'use client';

import { memo, useEffect, useMemo, useRef } from 'react';
import { ZUBEK_SVG, type ZubekPose } from '@/components/mascot/zubek-svgs';

// Żubek, the PolishPal study buddy (art + rig spec: design/mascot/README.md).
// The pose SVG is inlined (server-rendered, so it shows before JS) and then
// animated by a GSAP puppet (components/mascot/zubek-motion.ts), which loads
// after hydration so GSAP stays out of the first-load bundle.
// Alt text mirrors src/data/mascot.json.

const ALT: Record<ZubekPose, string> = {
  hello: 'Żubek waves hello.',
  speak: 'Żubek speaks with sound arcs.',
  teach: 'Żubek points to a lesson board.',
  read: 'Żubek holds an open book.',
  think: 'Żubek rests a hoof by the chin.',
  celebrate: 'Żubek jumps with confetti.',
  oops: 'Żubek gives an encouraging shrug.',
  confused: 'Żubek wonders beside a question mark.',
  sleep: 'Żubek dozes with folded arms.',
  cards: 'Żubek holds vocabulary cards.',
  trophy: 'Żubek holds a star trophy.',
  travel: 'Żubek carries a small suitcase.',
};

export type { ZubekPose };

interface Props {
  pose: ZubekPose;
  /** Size with a width class (w-32 …); height follows the 400:480 artwork. */
  className?: string;
  /** Decorative by default: the surrounding heading or copy carries the meaning. */
  decorative?: boolean;
}

// memo + a stable __html object: if a parent re-render re-applied the markup,
// React would swap in fresh SVG nodes and GSAP would keep animating the old,
// detached ones (seen on the lesson buddy: Żubek froze after the first tap).
function Zubek({ pose, className = '', decorative = true }: Props) {
  const ref = useRef<HTMLSpanElement>(null);
  const html = useMemo(() => ({ __html: ZUBEK_SVG[pose] }), [pose]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let cleanup: (() => void) | undefined;
    let cancelled = false;
    let observer: MutationObserver | undefined;
    import('@/components/mascot/zubek-motion').then(({ animateZubek }) => {
      if (cancelled) return;
      cleanup = animateZubek(el, pose);
      // Safety net: if the SVG itself is ever replaced, re-attach to the new
      // nodes. (Confetti pieces are also appended here, so compare the svg.)
      let svg = el.querySelector(':scope > svg');
      observer = new MutationObserver(() => {
        const now = el.querySelector(':scope > svg');
        if (now === svg) return;
        svg = now;
        cleanup?.();
        cleanup = animateZubek(el, pose);
      });
      observer.observe(el, { childList: true });
    });
    return () => {
      cancelled = true;
      observer?.disconnect();
      cleanup?.();
    };
  }, [pose]);

  return (
    <span
      ref={ref}
      data-zubek={pose}
      role={decorative ? undefined : 'img'}
      aria-label={decorative ? undefined : ALT[pose]}
      aria-hidden={decorative || undefined}
      className={`zubek ${className}`}
      dangerouslySetInnerHTML={html}
    />
  );
}

export default memo(Zubek);
