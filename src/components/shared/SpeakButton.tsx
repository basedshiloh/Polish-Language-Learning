'use client';

import { useState, useCallback, useEffect } from 'react';
import { Volume2 } from 'lucide-react';

interface SpeakButtonProps {
  text: string;
  size?: 'sm' | 'md';
}

let polishVoice: SpeechSynthesisVoice | null = null;
let voiceLoaded = false;

function findPolishVoice(): SpeechSynthesisVoice | null {
  if (voiceLoaded) return polishVoice;
  const voices = speechSynthesis.getVoices();
  polishVoice = voices.find((v) => v.lang.startsWith('pl')) || null;
  if (voices.length > 0) voiceLoaded = true;
  return polishVoice;
}

export default function SpeakButton({ text, size = 'sm' }: SpeakButtonProps) {
  const [speaking, setSpeaking] = useState(false);
  const [supported, setSupported] = useState(true);

  useEffect(() => {
    if (typeof window === 'undefined' || !window.speechSynthesis) {
      setSupported(false);
      return;
    }
    findPolishVoice();
    speechSynthesis.addEventListener('voiceschanged', () => findPolishVoice());
  }, []);

  const speak = useCallback(() => {
    if (!supported || speaking) return;
    speechSynthesis.cancel();

    const cleaned = text
      .replace(/\(.*?\)/g, '')
      .replace(/\[.*?\]/g, '')
      .replace(/[/→…]/g, '')
      .trim();

    if (!cleaned) return;

    const utterance = new SpeechSynthesisUtterance(cleaned);
    utterance.lang = 'pl-PL';
    utterance.rate = 0.85;

    const voice = findPolishVoice();
    if (voice) utterance.voice = voice;

    utterance.onstart = () => setSpeaking(true);
    utterance.onend = () => setSpeaking(false);
    utterance.onerror = () => setSpeaking(false);

    speechSynthesis.speak(utterance);
  }, [text, supported, speaking]);

  if (!supported) return null;

  const sizeClasses = size === 'sm'
    ? 'w-8 h-8 [&>svg]:w-4 [&>svg]:h-4'
    : 'w-10 h-10 [&>svg]:w-5 [&>svg]:h-5';

  // Round tactile key: soft cobalt face on a 3px cobalt edge that presses in on :active.
  const tone = speaking
    ? 'bg-cobalt text-white shadow-[0_3px_0_var(--color-cobalt-edge)] animate-pulse'
    : 'bg-cobalt-soft text-cobalt-ink shadow-[0_3px_0_color-mix(in_oklab,var(--color-cobalt)_35%,var(--color-cobalt-soft))] hover:bg-[color-mix(in_oklab,var(--color-cobalt)_14%,white)]';

  return (
    <button
      type="button"
      onClick={speak}
      title="Listen to pronunciation"
      aria-label={`Listen to pronunciation: ${text}`}
      className={`${sizeClasses} ${tone} inline-flex items-center justify-center rounded-full shrink-0 mb-[3px] transition-[transform,box-shadow,background-color] duration-100 active:translate-y-[3px] active:shadow-none`}
    >
      <Volume2 strokeWidth={2.6} aria-hidden="true" />
    </button>
  );
}
