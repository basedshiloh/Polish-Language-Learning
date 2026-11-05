import Image from 'next/image';

// Żubek, the PolishPal study buddy (art + rig spec: design/mascot/README.md).
// Static poses from public/mascot/. Alt text mirrors src/data/mascot.json; the
// JSON itself is not imported so client pages don't ship the full rig manifest.

const ALT = {
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
} as const;

export type ZubekPose = keyof typeof ALT;

interface Props {
  pose: ZubekPose;
  className?: string;
  /** Decorative by default: the surrounding heading or copy carries the meaning. */
  decorative?: boolean;
  priority?: boolean;
}

export default function Zubek({ pose, className = '', decorative = true, priority = false }: Props) {
  return (
    <Image
      src={`/mascot/zubek-${pose}.svg`}
      width={400}
      height={480}
      alt={decorative ? '' : ALT[pose]}
      aria-hidden={decorative || undefined}
      priority={priority}
      unoptimized
      draggable={false}
      className={`select-none ${className}`}
    />
  );
}
