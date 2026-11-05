// Tiny event bus so any part of the site can make the Żubek puppets on screen
// react, without importing GSAP. zubek-motion.ts listens for these.
export type ZubekCue = 'talk-start' | 'talk-end' | 'cheer' | 'oops';

export const ZUBEK_EVENT = 'polishpal:zubek';

export function cueZubek(cue: ZubekCue) {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new CustomEvent<ZubekCue>(ZUBEK_EVENT, { detail: cue }));
}
