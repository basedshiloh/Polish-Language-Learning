'use client';

import { useSyncExternalStore } from 'react';

// How fast Polish audio plays, for every speaker button, the lesson buddy and
// the tour. Applies to Joanna's recordings (playbackRate, pitch kept) and to
// the browser-voice fallback. Remembered per device in localStorage; every
// SpeechSpeed control on the page stays in sync through a window event.

export const SPEECH_RATES = [
  { value: 0.6, label: '0.6×', name: 'Very slow' },
  { value: 0.8, label: '0.8×', name: 'Slow' },
  { value: 1, label: '1×', name: 'Normal' },
  { value: 1.25, label: '1.25×', name: 'Fast' },
] as const;

const KEY = 'pp-speech-rate';
const EVENT = 'polishpal:speech-rate';

export function getSpeechRate(): number {
  try {
    const v = Number(localStorage.getItem(KEY));
    return SPEECH_RATES.some((r) => r.value === v) ? v : 1;
  } catch {
    return 1;
  }
}

export function setSpeechRate(value: number) {
  try {
    localStorage.setItem(KEY, String(value));
  } catch {
    /* private mode: the choice lasts for this page only */
  }
  current = value;
  window.dispatchEvent(new Event(EVENT));
}

// In-memory copy so a blocked localStorage still keeps the choice this visit.
let current: number | null = null;
const read = () => current ?? (current = getSpeechRate());

function subscribe(cb: () => void) {
  const onStorage = (e: StorageEvent) => {
    if (e.key === KEY) {
      current = getSpeechRate();
      cb();
    }
  };
  window.addEventListener(EVENT, cb);
  window.addEventListener('storage', onStorage);
  return () => {
    window.removeEventListener(EVENT, cb);
    window.removeEventListener('storage', onStorage);
  };
}

/** The current rate (1 during server render). */
export function useSpeechRate(): number {
  return useSyncExternalStore(subscribe, read, () => 1);
}

/** Rate used at the moment a word is played. */
export function currentSpeechRate(): number {
  return typeof window === 'undefined' ? 1 : read();
}
