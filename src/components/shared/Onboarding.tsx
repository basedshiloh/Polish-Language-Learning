'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { X, Volume2, ArrowRight, Check, BookOpen } from 'lucide-react';
import Zubek, { type ZubekPose } from '@/components/shared/Zubek';
import { cueZubek } from '@/components/mascot/zubek-bus';
import { speakPolish, speechSupported } from '@/lib/speech';
import { STORAGE_KEY } from '@/lib/constants';
import { lessons } from '@/data/lessons';
import { quizzes } from '@/data/quizzes';
import type { MultipleChoiceQuestion } from '@/lib/types';

// "How to get started" tour with Żubek, modelled on PlantAlong's Pip tour.
// Opens for first-time visitors ~1.4 s after the page settles. Closing it (any
// way) sets the pp_welcome_tour cookie for 3 days, so it comes back at most
// once every 3 days. People who already finished a lesson or a quiz are not
// first-time users, so it never opens for them by itself. Anyone can reopen it
// with a [data-onb-open] link (footer "Take the tour") or #tour.
// Every Polish word, pronunciation and quiz question here comes from the
// lesson and quiz data (no invented content).

const COOKIE = 'pp_welcome_tour';
const THREE_DAYS = 3 * 24 * 60 * 60;
const STEPS = 4;
const NEXT = ['Show me around', 'Next', 'Last step', 'Maybe later'];
const POSES: ZubekPose[] = ['hello', 'speak', 'think', 'teach'];

const lesson1 = [...lessons].sort((a, b) => a.order - b.order)[0];
const firstWord = (() => {
  for (const b of lesson1.content) {
    const w = (b.type === 'vocabulary' ? b.vocabulary : undefined)?.find((v) => v.polish === 'Cześć');
    if (w) return w;
  }
  return { polish: 'Cześć', english: 'Hi / Bye (informal)', pronunciation: 'cheshch' };
})();
const question = quizzes
  .find((q) => q.lessonId === lesson1.id)
  ?.questions.find((q): q is MultipleChoiceQuestion => q.type === 'multiple-choice' && q.id === 'intro-2');

function hasCookie() {
  return document.cookie.split('; ').some((c) => c.startsWith(`${COOKIE}=`));
}
function setCookie() {
  const secure = location.protocol === 'https:' ? '; Secure' : '';
  document.cookie = `${COOKIE}=${new Date().toISOString().slice(0, 10)}; Max-Age=${THREE_DAYS}; Path=/; SameSite=Lax${secure}`;
}
function alreadyLearning() {
  try {
    const p = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
    const done = Object.values(p.lessonProgress ?? {}).some((l) => (l as { completed?: boolean }).completed);
    return done || Object.keys(p.quizAttempts ?? {}).length > 0;
  } catch {
    return false;
  }
}
const motionOff = () =>
  document.documentElement.classList.contains('a11y-pause-animations') ||
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export default function Onboarding() {
  const pathname = usePathname();
  const ref = useRef<HTMLDialogElement>(null);
  const [mounted, setMounted] = useState(false);
  const [step, setStep] = useState(0);
  const [answer, setAnswer] = useState<number | null>(null);
  const [canSpeak, setCanSpeak] = useState(true);

  const open = useCallback(() => {
    setMounted(true);
    setStep(0);
    setAnswer(null);
    setCanSpeak(speechSupported());
  }, []);

  // Show the dialog once it is in the DOM, with a little GSAP pop.
  useEffect(() => {
    const d = ref.current;
    if (!mounted || !d || d.open) return;
    d.showModal();
    document.documentElement.classList.add('onb-open');
    if (!motionOff()) {
      import('gsap').then(({ gsap }) => {
        gsap.fromTo(d, { y: 40, scale: 0.94, opacity: 0 }, { y: 0, scale: 1, opacity: 1, duration: 0.55, ease: 'back.out(1.6)', clearProps: 'transform,opacity' });
      });
    }
  }, [mounted]);

  // First visit (or 3+ days since it was last closed): open after the page settles.
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if ((e.target as Element).closest?.('[data-onb-open]')) {
        e.preventDefault();
        open();
      }
    };
    document.addEventListener('click', onClick);
    if (location.hash === '#tour') window.setTimeout(open, 0);
    const onHash = () => location.hash === '#tour' && open();
    window.addEventListener('hashchange', onHash);

    let timer: number | undefined;
    if (!pathname.startsWith('/polaris') && !hasCookie() && !navigator.webdriver && !alreadyLearning()) {
      timer = window.setTimeout(() => {
        // Busy typing or in another dialog: leave them be (it shows next visit).
        if (document.activeElement?.matches('input, textarea, select, [contenteditable]')) return;
        if (document.querySelector('dialog[open]')) return;
        open();
      }, 1400);
    }
    return () => {
      document.removeEventListener('click', onClick);
      window.removeEventListener('hashchange', onHash);
      if (timer) window.clearTimeout(timer);
    };
    // Only on first load; route changes inside the app do not re-trigger it.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const close = useCallback(() => {
    setCookie();
    ref.current?.close();
  }, []);

  const onClosed = () => {
    setCookie();
    document.documentElement.classList.remove('onb-open');
    if (location.hash === '#tour') history.replaceState(null, '', location.pathname + location.search);
    setMounted(false);
  };

  const dirRef = useRef(1);
  const go = (i: number) => {
    if (i < 0 || i >= STEPS) return;
    dirRef.current = i >= step ? 1 : -1;
    setStep(i);
  };

  // Slide the new step's text in (after React has rendered it).
  useEffect(() => {
    if (!mounted || step === 0 || motionOff()) return;
    const body = ref.current?.querySelector('[data-onb-step]');
    if (!body) return;
    import('gsap').then(({ gsap }) => {
      gsap.fromTo(body.querySelectorAll(':scope > :not([data-onb-stage])'), { x: 36 * dirRef.current, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.5, ease: 'expo.out', stagger: 0.05, clearProps: 'transform,opacity' });
    });
  }, [step, mounted]);

  // Focus the new step's heading so screen readers announce it.
  useEffect(() => {
    if (!mounted) return;
    ref.current?.querySelector<HTMLElement>(`#onb-h${step}`)?.focus({ preventScroll: true });
  }, [step, mounted]);

  if (!mounted) return null;

  const pick = (i: number) => {
    if (!question || answer !== null) return;
    setAnswer(i);
    cueZubek(i === question.correctIndex ? 'cheer' : 'oops');
  };
  const pose: ZubekPose =
    step === 2 && answer !== null && question ? (answer === question.correctIndex ? 'celebrate' : 'oops') : POSES[step];

  return (
    <dialog
      ref={ref}
      className="onb no-print"
      aria-labelledby={`onb-h${step}`}
      onCancel={() => setCookie()}
      onClose={onClosed}
      onClick={(e) => {
        // A click on the backdrop (outside the box) closes it.
        if (e.target !== e.currentTarget) return;
        const r = e.currentTarget.getBoundingClientRect();
        if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) close();
      }}
      onKeyDown={(e) => {
        if ((e.target as Element).matches('input')) return;
        if (e.key === 'ArrowRight') go(step + 1);
        if (e.key === 'ArrowLeft') go(step - 1);
      }}
    >
      <div className="relative p-5 sm:p-8">
        <button type="button" onClick={close} aria-label="Close the tour" className="absolute right-3 top-3 z-10 flex h-10 w-10 items-center justify-center rounded-full text-muted transition-colors hover:bg-canvas hover:text-ink">
          <X className="h-5 w-5" strokeWidth={2.8} aria-hidden="true" />
        </button>

        <div className="mb-5 mr-10 h-2 overflow-hidden rounded-full bg-line" aria-hidden="true">
          <div className="h-full rounded-full bg-crimson transition-[width] duration-500" style={{ width: `${((step + 1) / STEPS) * 100}%` }} />
        </div>
        <p className="sr-only" aria-live="polite">Step {step + 1} of {STEPS}</p>

        <div data-onb-step key={step} className="text-center">
          <div data-onb-stage className="mx-auto mb-3 flex h-32 items-end justify-center sm:h-40">
            <Zubek key={pose} pose={pose} className="w-24 sm:w-28" />
          </div>

          {step === 0 && (
            <>
              <p className="onb-kicker">Welcome to PolishPal</p>
              <h2 id="onb-h0" tabIndex={-1} className="onb-title">Hi, I&apos;m Żubek!</h2>
              <p className="onb-lede">I&apos;ll help you learn Polish from your very first word to A1 level, one short lesson at a time.</p>
              <ul className="mx-auto mt-5 max-w-sm space-y-2 text-left text-[15px] font-bold text-ink-2">
                <li className="flex items-start gap-2.5"><Check className="mt-0.5 h-5 w-5 shrink-0 text-emerald" strokeWidth={3} aria-hidden="true" />{lessons.length} free lessons, plus grammar tables and quizzes</li>
                <li className="flex items-start gap-2.5"><Check className="mt-0.5 h-5 w-5 shrink-0 text-emerald" strokeWidth={3} aria-hidden="true" />No sign-up. Your progress is saved on this device</li>
              </ul>
            </>
          )}

          {step === 1 && (
            <>
              <p className="onb-kicker">Step 1 · Listen</p>
              <h2 id="onb-h1" tabIndex={-1} className="onb-title">Every word comes with sound</h2>
              <p className="onb-lede">Tap a blue speaker anywhere on the site to hear Polish out loud. Try it with your first word:</p>
              <button
                type="button"
                onClick={() => speakPolish(firstWord.polish)}
                className="tile tile-link mx-auto mt-5 flex w-full max-w-sm items-center gap-4 p-4 text-left"
              >
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-cobalt-soft text-cobalt-ink"><Volume2 className="h-5 w-5" strokeWidth={2.6} aria-hidden="true" /></span>
                <span className="min-w-0">
                  <span lang="pl" className="polish-text block text-2xl leading-tight">{firstWord.polish}</span>
                  <span className="block text-sm font-bold text-ink-2">Say it: {firstWord.pronunciation} · {firstWord.english}</span>
                </span>
              </button>
              {!canSpeak && <p className="mt-3 text-sm font-semibold text-muted">Your browser has no speech, but every word also shows how to say it.</p>}
            </>
          )}

          {step === 2 && question && (
            <>
              <p className="onb-kicker">Step 2 · Practise</p>
              <h2 id="onb-h2" tabIndex={-1} className="onb-title">Then test yourself</h2>
              <p className="onb-lede">Every lesson ends with a quick quiz. Here is a real question from lesson 1:</p>
              <p className="mt-4 font-display text-lg font-semibold text-ink">{question.prompt}</p>
              <div className="mx-auto mt-3 grid max-w-sm grid-cols-2 gap-2" role="group" aria-label="Answers">
                {question.options.map((o, i) => {
                  // Each state sets its own colours (a base bg/border class would win over these in the CSS order).
                  const state = answer === null
                    ? 'border-line bg-paper text-ink hover:bg-canvas'
                    : i === question.correctIndex ? 'border-emerald bg-emerald-soft text-emerald-ink'
                    : i === answer ? 'border-crimson bg-crimson-soft text-crimson-ink'
                    : 'border-line bg-paper text-ink opacity-50';
                  return (
                    <button key={o} type="button" lang="pl" onClick={() => pick(i)} disabled={answer !== null}
                      className={`rounded-2xl border-2 border-b-4 px-3 py-3 font-extrabold transition-colors ${state}`}>
                      {o}
                    </button>
                  );
                })}
              </div>
              <p className="mx-auto mt-3 min-h-[3rem] max-w-sm text-sm font-semibold text-ink-2" aria-live="polite">
                {answer !== null && (answer === question.correctIndex ? `I'm cheering for you. Nicely done! ${question.explanation}` : `Not quite, and that's fine. ${question.explanation}`)}
              </p>
            </>
          )}

          {step === 3 && (
            <>
              <p className="onb-kicker">Step 3 · Start</p>
              <h2 id="onb-h3" tabIndex={-1} className="onb-title">Ready for lesson 1?</h2>
              <p className="onb-lede">
                Lesson 1, {lesson1.title}, takes about {lesson1.estimatedMinutes} minutes. Mark it complete at the end and your progress is saved here.
              </p>
              <div className="mx-auto mt-5 flex max-w-sm flex-col gap-2">
                <Link href={`/lessons/${lesson1.id}`} onClick={close} className="btn btn-primary">
                  Start lesson 1 <ArrowRight className="h-4 w-4" strokeWidth={2.8} aria-hidden="true" />
                </Link>
                <Link href="/lessons" onClick={close} className="btn btn-secondary">
                  <BookOpen className="h-4 w-4" strokeWidth={2.6} aria-hidden="true" /> See all lessons
                </Link>
              </div>
            </>
          )}
        </div>

        <div className="mt-6 flex items-center justify-between gap-3">
          <button type="button" onClick={() => go(step - 1)} className={`btn btn-secondary btn-sm ${step === 0 ? 'invisible' : ''}`}>Back</button>
          <ol className="flex gap-1.5" aria-hidden="true">
            {Array.from({ length: STEPS }, (_, i) => (
              <li key={i} className={`h-2 rounded-full transition-all ${i <= step ? 'w-5 bg-crimson' : 'w-2 bg-line'}`} />
            ))}
          </ol>
          <button type="button" onClick={() => (step === STEPS - 1 ? close() : go(step + 1))} className="btn btn-primary btn-sm">
            {NEXT[step]}
          </button>
        </div>
      </div>
    </dialog>
  );
}
