// Żubek as a GSAP puppet, in the spirit of PlantAlong's Pip.
// Rig contract: design/mascot/README.md. Every part is <g data-part="…"
// data-pivot="x y"> in SVG user units, so rotations use svgOrigin, never
// percentages. The whole figure moves via [data-rig="character"] (the shadow
// stays on the ground); [data-rig="stance"] carries the breathing squash.
//
// Behaviour: hops in when scrolled into view (or a small hello hop if it is
// already on screen when the script loads), breathes, blinks, does a
// pose-specific idle action every few seconds, and hops with happy eyes when
// tapped. The celebrate pose also throws confetti.
// Stills: prefers-reduced-motion, or the site's "Pause animations" switch
// (html.a11y-pause-animations). Loops pause while off screen.
import { gsap } from 'gsap';
import type { ZubekPose } from './zubek-svgs';
import { ZUBEK_EVENT, type ZubekCue } from './zubek-bus';

const rand = gsap.utils.random;
const CONFETTI = ['#D91F3B', '#FFC21A', '#2F5BEA', '#15803D', '#D6338A'];

const motionOff = () =>
  document.documentElement.classList.contains('a11y-pause-animations') ||
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

type Eyes = 'open' | 'happy' | 'closed';

interface Rig {
  svg: SVGSVGElement;
  character: SVGGElement;
  stance: SVGGElement;
  shadow: SVGGElement | null;
  part: (name: string) => SVGGElement | null;
}

function rigOf(root: HTMLElement): Rig | null {
  const svg = root.querySelector('svg');
  const character = svg?.querySelector<SVGGElement>('[data-rig="character"]');
  const stance = svg?.querySelector<SVGGElement>('[data-rig="stance"]');
  if (!svg || !character || !stance) return null;
  return {
    svg,
    character,
    stance,
    shadow: svg.querySelector<SVGGElement>('[data-part="shadow"]'),
    part: (name) => svg.querySelector<SVGGElement>(`[data-part="${name}"]`),
  };
}

const pivotOf = (el: Element | null) => el?.getAttribute('data-pivot') ?? '200 448';

// ── Expression states (visibility swaps, per the README) ─────────────────────

function setEyes(r: Rig, state: Eyes) {
  for (const side of ['l', 'r']) {
    const eye = r.part(`eye-${side}`);
    const lid = r.part(`lid-${side}`);
    eye?.querySelectorAll<SVGGElement>(':scope > [data-state]').forEach((g) => {
      g.setAttribute('visibility', state !== 'closed' && g.dataset.state === state ? 'visible' : 'hidden');
    });
    lid?.setAttribute('visibility', state === 'closed' ? 'visible' : 'hidden');
  }
}

function setMouth(r: Rig, state: 'closed' | 'open-s' | 'open-l') {
  r.part('mouth')?.querySelectorAll<SVGGElement>(':scope > [data-state]').forEach((g) => {
    g.setAttribute('visibility', g.dataset.state === state ? 'visible' : 'hidden');
  });
}

// ── Gestures ──────────────────────────────────────────────────────────────────

function hop(r: Rig, height = 26) {
  const tl = gsap.timeline();
  tl.to(r.character, { svgOrigin: '200 448', scaleY: 0.9, scaleX: 1.06, duration: 0.1, ease: 'power2.out' })
    .to(r.character, { y: -height, scaleY: 1.06, scaleX: 0.95, duration: 0.24, ease: 'power2.out' })
    .to(r.character, { y: 0, scaleY: 0.9, scaleX: 1.06, duration: 0.2, ease: 'power2.in' })
    .to(r.character, { scaleY: 1, scaleX: 1, duration: 0.6, ease: 'elastic.out(1, 0.35)' });
  if (r.shadow) {
    tl.to(r.shadow, { svgOrigin: '200 454', scaleX: 0.7, opacity: 0.6, duration: 0.24, yoyo: true, repeat: 1, ease: 'power2.out' }, 0.1);
  }
  return tl;
}

function wave(r: Rig, arm = 'arm-l') {
  const el = r.part(arm);
  if (!el) return gsap.timeline();
  const o = pivotOf(el);
  return gsap.timeline()
    .to(el, { svgOrigin: o, rotation: arm === 'arm-l' ? 14 : -14, duration: 0.16, ease: 'sine.inOut' })
    .to(el, { svgOrigin: o, rotation: arm === 'arm-l' ? -10 : 10, duration: 0.2, ease: 'sine.inOut', repeat: 3, yoyo: true })
    .to(el, { svgOrigin: o, rotation: 0, duration: 0.5, ease: 'elastic.out(1, 0.45)' });
}

function tilt(r: Rig) {
  const head = r.part('head');
  const o = pivotOf(head);
  const a = rand(-7, 7);
  return gsap.timeline()
    .to(head, { svgOrigin: o, rotation: a, duration: 0.35, ease: 'sine.inOut' })
    .to(head, { svgOrigin: o, rotation: 0, duration: 0.6, ease: 'elastic.out(1, 0.5)' }, '+=0.6');
}

function shrug(r: Rig) {
  const tl = gsap.timeline();
  for (const arm of ['arm-l', 'arm-r']) {
    const el = r.part(arm);
    if (el) tl.to(el, { y: -10, duration: 0.18, ease: 'power2.out', yoyo: true, repeat: 1 }, 0);
  }
  tl.add(tilt(r), 0);
  return tl;
}

function propBob(r: Rig, y = -8, rotation = 0) {
  const prop = r.part('prop');
  if (!prop) return gsap.timeline();
  return gsap.timeline().to(prop, { svgOrigin: pivotOf(prop), y, rotation, duration: 0.3, ease: 'power2.out', yoyo: true, repeat: 1 });
}

function talk(r: Rig) {
  const tl = gsap.timeline({ onComplete: () => setMouth(r, 'closed') });
  (['open-s', 'open-l', 'closed', 'open-s', 'closed', 'open-l', 'closed'] as const).forEach((s, i) => {
    tl.call(() => setMouth(r, s), [], i * 0.12);
  });
  return tl;
}

function happy(r: Rig, base: Eyes, hold = 0.9) {
  if (base === 'closed') return gsap.timeline();
  return gsap.timeline().call(() => setEyes(r, 'happy')).call(() => setEyes(r, base), [], hold);
}

function confetti(root: HTMLElement, pieces = 16) {
  const box = root.getBoundingClientRect();
  for (let i = 0; i < pieces; i++) {
    const c = document.createElement('span');
    c.setAttribute('aria-hidden', 'true');
    Object.assign(c.style, {
      position: 'absolute', left: '50%', top: '28%', width: '9px', height: '9px',
      background: CONFETTI[i % CONFETTI.length], borderRadius: '2px', pointerEvents: 'none',
    });
    root.append(c);
    gsap.timeline({ onComplete: () => c.remove() })
      .to(c, { x: rand(-box.width * 0.9, box.width * 0.9), y: rand(-box.height * 0.55, -box.height * 0.2), rotation: rand(-360, 360), duration: 0.6, ease: 'power2.out' })
      .to(c, { y: `+=${box.height * 0.8}`, opacity: 0, rotation: '+=180', duration: 1, ease: 'power1.in' });
  }
}

/** Easter egg (three quick taps): a full backflip with a big hop. */
function backflip(r: Rig) {
  const tl = gsap.timeline();
  tl.to(r.character, { svgOrigin: '200 448', scaleY: 0.86, scaleX: 1.1, duration: 0.12, ease: 'power2.out' })
    .to(r.character, { y: -90, scaleY: 1, scaleX: 1, duration: 0.3, ease: 'power2.out' })
    .to(r.character, { svgOrigin: '200 300', rotation: -360, duration: 0.55, ease: 'power1.inOut' }, '<0.05')
    .to(r.character, { y: 0, duration: 0.28, ease: 'power2.in' }, '-=0.25')
    .set(r.character, { rotation: 0 })
    .to(r.character, { svgOrigin: '200 448', scaleY: 0.88, scaleX: 1.1, duration: 0.1 })
    .to(r.character, { scaleY: 1, scaleX: 1, duration: 0.6, ease: 'elastic.out(1, 0.35)' });
  return tl;
}

/** Mouth flaps for as long as a word is playing. */
function talkLoop(r: Rig) {
  const states = ['open-s', 'open-l', 'open-s', 'closed'] as const;
  const tl = gsap.timeline({ repeat: -1, onInterrupt: () => setMouth(r, 'closed') });
  states.forEach((s, i) => tl.call(() => setMouth(r, s), [], i * 0.11));
  tl.to({}, { duration: 0.44 }, 0);
  return tl;
}

/** The idle action that fits each pose (README pose table). */
function idleAction(r: Rig, pose: ZubekPose, base: Eyes) {
  const pick = Math.random();
  switch (pose) {
    case 'hello':
      return pick < 0.6 ? wave(r, 'arm-l') : tilt(r);
    case 'celebrate':
      return pick < 0.6 ? hop(r, 18).add(happy(r, base), 0) : propBob(r, -10, 8);
    case 'oops':
    case 'confused':
      return pick < 0.6 ? shrug(r).add(propBob(r, -6, 6), 0) : tilt(r);
    case 'sleep':
      return propBob(r, -6, -6);
    case 'think':
      return tilt(r);
    case 'teach':
      return pick < 0.5 ? wave(r, 'arm-r') : propBob(r, -4, 0);
    case 'read':
      return pick < 0.5 ? tilt(r) : propBob(r, -5, -3);
    case 'speak':
      return talk(r).add(propBob(r, 0, 6), 0);
    default: // cards, trophy, travel
      return pick < 0.5 ? propBob(r, -8, rand(-5, 5)).add(happy(r, base, 0.6), 0) : tilt(r);
  }
}

// ── Setup ─────────────────────────────────────────────────────────────────────

export function animateZubek(root: HTMLElement, pose: ZubekPose): () => void {
  const r = rigOf(root);
  if (!r) return () => {};
  const base = (r.svg.getAttribute('data-default-eyes') as Eyes) || 'open';

  let running = false;
  let entered = false;
  let onScreen = false;
  const loops: gsap.core.Animation[] = [];
  let idle: gsap.core.Tween | null = null;
  let blink: gsap.core.Tween | null = null;
  let talking: gsap.core.Timeline | null = null;
  let talkSafety: gsap.core.Tween | null = null;
  let taps: number[] = [];

  const nextIdle = () => {
    idle = gsap.delayedCall(rand(4, 8), () => {
      if (running && onScreen) idleAction(r, pose, base);
      nextIdle();
    });
  };
  const nextBlink = () => {
    if (base === 'closed') return;
    blink = gsap.delayedCall(rand(2.2, 5.5), () => {
      if (running && onScreen) {
        setEyes(r, 'closed');
        gsap.delayedCall(0.12, () => setEyes(r, base));
      }
      nextBlink();
    });
  };

  const startLoops = () => {
    if (loops.length) return loops.forEach((l) => l.play());
    loops.push(gsap.to(r.stance, {
      svgOrigin: '200 448', scaleY: pose === 'sleep' ? 1.025 : 1.015, scaleX: 0.995,
      duration: pose === 'sleep' ? rand(2.2, 2.6) : rand(1.4, 1.8), ease: 'sine.inOut', yoyo: true, repeat: -1,
    }));
    if (pose === 'celebrate' || pose === 'sleep') {
      const prop = r.part('prop');
      if (prop) loops.push(gsap.to(prop, { y: -5, duration: rand(1.6, 2), ease: 'sine.inOut', yoyo: true, repeat: -1 }));
    }
    nextIdle();
    nextBlink();
  };

  const enter = (alreadyVisible: boolean) => {
    entered = true;
    const tl = gsap.timeline({ onComplete: startLoops });
    if (alreadyVisible) {
      tl.add(hop(r, 14));
    } else {
      tl.fromTo(r.character, { svgOrigin: '200 448', y: 60, opacity: 0, scaleY: 0.6, scaleX: 1.2 },
        { y: -20, opacity: 1, scaleY: 1.08, scaleX: 0.94, duration: 0.32, ease: 'power2.out' })
        .to(r.character, { y: 0, scaleY: 0.9, scaleX: 1.08, duration: 0.18, ease: 'power2.in' })
        .to(r.character, { scaleY: 1, scaleX: 1, duration: 0.7, ease: 'elastic.out(1, 0.35)' });
    }
    if (pose === 'hello') tl.add(wave(r, 'arm-l'), '-=0.4');
    if (pose === 'celebrate') tl.call(() => confetti(root), [], 0.25).add(happy(r, base, 1.2), 0);
  };

  const start = () => {
    if (running) return;
    running = true;
    if (entered) return startLoops();
    // Already on screen when the script arrives (hero, header): greet with a
    // small hop instead of hiding a figure the reader is looking at. Below the
    // fold: hide now, hop in when it scrolls into view.
    const box = root.getBoundingClientRect();
    onScreen = box.bottom > 0 && box.top < window.innerHeight && box.width > 0;
    if (onScreen) enter(true);
    else gsap.set(r.character, { svgOrigin: '200 448', opacity: 0 });
  };
  const stop = () => {
    running = false;
    idle?.kill(); idle = null;
    blink?.kill(); blink = null;
    talking?.kill(); talking = null;
    loops.forEach((l) => l.kill());
    loops.length = 0;
    gsap.killTweensOf(r.svg.querySelectorAll('g'));
    gsap.set(r.svg.querySelectorAll('g'), { clearProps: 'transform,opacity' });
    r.svg.querySelectorAll('[data-rig],[data-part]').forEach((g) => g.removeAttribute('transform'));
    setEyes(r, base);
    setMouth(r, 'closed');
  };

  // Visible-or-not drives entrance and pauses loops off screen.
  const io = new IntersectionObserver(([e]) => {
    onScreen = !!e?.isIntersecting;
    if (!running) return;
    if (onScreen && !entered) enter(false);
    loops.forEach((l) => (onScreen ? l.play() : l.pause()));
  }, { rootMargin: '0px 0px -8% 0px' });

  const onTap = () => {
    if (!running) return;
    const now = performance.now();
    taps = [...taps.filter((ts) => now - ts < 1200), now];
    if (taps.length >= 3) {
      taps = [];
      backflip(r);
      happy(r, base, 1.4);
      confetti(root, 14);
      return;
    }
    hop(r, 30);
    happy(r, base);
    if (pose === 'hello') talk(r);
    if (pose === 'celebrate') confetti(root, 10);
  };

  // Site-wide cues: a word is playing (lip-sync), a cheer, a kind "oops".
  const onCue = (e: Event) => {
    const cue = (e as CustomEvent<ZubekCue>).detail;
    if (cue === 'talk-end') {
      talking?.kill(); talking = null;
      setMouth(r, 'closed');
      return;
    }
    if (!running || !onScreen) return;
    if (cue === 'talk-start') {
      talking?.kill();
      talkSafety?.kill();
      talking = talkLoop(r);
      // speechSynthesis can skip onend (tab switch, voice errors); never flap forever.
      talkSafety = gsap.delayedCall(6, () => { talking?.kill(); talking = null; setMouth(r, 'closed'); });
    } else if (cue === 'cheer') {
      hop(r, 34);
      happy(r, base, 1.4);
      confetti(root, 14);
    } else if (cue === 'oops') {
      shrug(r);
    }
  };

  // Eyes follow the pointer a little (mouse/trackpad only).
  const eyes = [r.part('eye-l'), r.part('eye-r')].filter((e): e is SVGGElement => !!e);
  const lookX = eyes.map((e) => gsap.quickTo(e, 'x', { duration: 0.45, ease: 'power3.out' }));
  const lookY = eyes.map((e) => gsap.quickTo(e, 'y', { duration: 0.45, ease: 'power3.out' }));
  const finePointer = window.matchMedia('(pointer: fine)').matches;
  const onPointer = (e: PointerEvent) => {
    if (!running || !onScreen || base === 'closed') return;
    const b = root.getBoundingClientRect();
    const dx = e.clientX - (b.left + b.width / 2);
    const dy = e.clientY - (b.top + b.height * 0.35);
    const d = Math.max(Math.hypot(dx, dy), 1);
    const reach = Math.min(d / 260, 1) * 5;
    lookX.forEach((f) => f((dx / d) * reach));
    lookY.forEach((f) => f((dy / d) * reach * 0.8));
  };

  const sync = () => (motionOff() ? stop() : start());
  const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
  const mo = new MutationObserver(sync);

  if (!motionOff()) start();
  io.observe(root);
  mo.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
  mq.addEventListener('change', sync);
  root.addEventListener('click', onTap);
  window.addEventListener(ZUBEK_EVENT, onCue);
  if (finePointer) window.addEventListener('pointermove', onPointer, { passive: true });

  return () => {
    window.removeEventListener(ZUBEK_EVENT, onCue);
    window.removeEventListener('pointermove', onPointer);
    io.disconnect();
    mo.disconnect();
    mq.removeEventListener('change', sync);
    root.removeEventListener('click', onTap);
    stop();
  };
}
