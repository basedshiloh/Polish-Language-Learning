'use client';

import { cueZubek } from '@/components/mascot/zubek-bus';
import voiceManifest from '@/data/voice-manifest.json';
import { currentSpeechRate } from '@/lib/speech-rate';

// Polish pronunciation for the whole site (SpeakButton, LessonBuddy, the tour).
// 1. Recorded audio first: every lesson/grammar/home line was pre-recorded with
//    ElevenLabs (voice: Joanna) into public/audio/pl/<key>.mp3 by
//    scripts/voice/generate.py; src/data/voice-manifest.json lists the keys.
// 2. Browser speech as the fallback: lone sounds (ą, sz…), anything new that
//    has not been recorded yet, or a file that fails to load.
// While a word plays, the Żubek puppets on screen move their mouths.

const RECORDED = new Set<string>(voiceManifest.files);

let polishVoice: SpeechSynthesisVoice | null = null;
let voiceLoaded = false;
let player: HTMLAudioElement | null = null;

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

/** Strip pronunciation hints and arrows that should not be read aloud; a slash between alternatives becomes a pause. */
export function speakableText(text: string): string {
  return text
    .replace(/\(.*?\)/g, '')
    .replace(/\[.*?\]/g, '')
    // A clock label such as "12:00 Jest dwunasta" is for the eye; say only the Polish.
    .replace(/^\s*\d{1,2}:\d{2}\s*[—–-]?\s*/, '')
    // "Pan/Pani", "on/ona": read both, with a short pause (removing the slash glued them together).
    .replace(/\s*\/\s*/g, ', ')
    .replace(/[→…]/g, '')
    .replace(/^[\s,]+|[\s,]+$/g, '')
    .trim();
}

/** File key for a line: 32-bit FNV-1a of the cleaned text. Must match fnv1a() in scripts/voice/generate.py. */
export function voiceKey(text: string): string {
  const s = speakableText(text).replace(/\s+/g, ' ').normalize('NFC');
  let h = 0x811c9dc5;
  for (const ch of s) {
    h ^= ch.codePointAt(0)!;
    h = Math.imul(h, 0x01000193) >>> 0;
  }
  return h.toString(16).padStart(8, '0');
}

/** True when this line has a pre-recorded file (plays in every browser, speech engine or not). */
export function hasRecording(text: string): boolean {
  return RECORDED.has(voiceKey(text));
}

/** Can this browser say the line at all, recorded or synthesised? */
export function canSpeak(text: string): boolean {
  return hasRecording(text) || speechSupported();
}

interface SpeakOptions {
  onStart?: () => void;
  onEnd?: () => void;
}

function stopAll() {
  if (player) {
    player.onpause = null;
    player.pause();
    player = null;
  }
  if (speechSupported()) speechSynthesis.cancel();
}

function speakWithBrowser(cleaned: string, { onStart, onEnd }: SpeakOptions): boolean {
  if (!speechSupported()) {
    onEnd?.();
    return false;
  }
  const utterance = new SpeechSynthesisUtterance(cleaned);
  utterance.lang = 'pl-PL';
  // The browser voice runs a little slow by default (0.85); the learner's speed scales it.
  utterance.rate = Math.min(2, Math.max(0.3, 0.85 * currentSpeechRate()));
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

/** Speak Polish text. Returns false when nothing could be spoken. */
export function speakPolish(text: string, opts: SpeakOptions = {}): boolean {
  const cleaned = speakableText(text);
  if (!cleaned) return false;
  stopAll();

  const key = voiceKey(text);
  if (!RECORDED.has(key) || typeof Audio === 'undefined') return speakWithBrowser(cleaned, opts);

  const audio = new Audio(`/audio/pl/${key}.mp3`);
  // Learner's speed (Audio speed control); pitch stays natural.
  audio.preservesPitch = true;
  audio.playbackRate = currentSpeechRate();
  player = audio;
  let started = false;
  let finished = false;
  const finish = () => {
    if (finished) return;
    finished = true;
    if (player === audio) player = null;
    cueZubek('talk-end');
    opts.onEnd?.();
  };
  audio.onplaying = () => {
    if (started) return;
    started = true;
    cueZubek('talk-start');
    opts.onStart?.();
  };
  audio.onended = finish;
  audio.onpause = finish;
  // The file is missing or blocked: fall back to the browser voice once.
  const fallback = () => {
    if (started || finished) return;
    finished = true;
    if (player === audio) player = null;
    speakWithBrowser(cleaned, opts);
  };
  audio.onerror = fallback;
  audio.play().catch(fallback);
  return true;
}
