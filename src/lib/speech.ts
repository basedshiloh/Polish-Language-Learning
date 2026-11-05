'use client';

import { cueZubek } from '@/components/mascot/zubek-bus';

// Browser text-to-speech for Polish words (shared by SpeakButton and Żubek).
// While a word plays, the Żubek puppets on screen move their mouths.

let polishVoice: SpeechSynthesisVoice | null = null;
let voiceLoaded = false;

export function speechSupported(): boolean {
  return typeof window !== 'undefined' && 'speechSynthesis' in window;
}

export function findPolishVoice(): SpeechSynthesisVoice | null {
  if (!speechSupported()) return null;
  if (voiceLoaded) return polishVoice;
  const voices = speechSynthesis.getVoices();
  polishVoice = voices.find((v) => v.lang.startsWith('pl')) || null;
  if (voices.length > 0) voiceLoaded = true;
  return polishVoice;
}

/** Strip pronunciation hints and arrows that should not be read aloud. */
export function speakableText(text: string): string {
  return text
    .replace(/\(.*?\)/g, '')
    .replace(/\[.*?\]/g, '')
    .replace(/[/→…]/g, '')
    .trim();
}

interface SpeakOptions {
  onStart?: () => void;
  onEnd?: () => void;
}

/** Speak Polish text. Returns false when nothing could be spoken. */
export function speakPolish(text: string, { onStart, onEnd }: SpeakOptions = {}): boolean {
  if (!speechSupported()) return false;
  const cleaned = speakableText(text);
  if (!cleaned) return false;
  speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(cleaned);
  utterance.lang = 'pl-PL';
  utterance.rate = 0.85;
  const voice = findPolishVoice();
  if (voice) utterance.voice = voice;

  const end = () => {
    cueZubek('talk-end');
    onEnd?.();
  };
  utterance.onstart = () => {
    cueZubek('talk-start');
    onStart?.();
  };
  utterance.onend = end;
  utterance.onerror = end;
  speechSynthesis.speak(utterance);
  return true;
}
