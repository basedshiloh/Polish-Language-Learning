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
    ? 'w-6 h-6 p-1'
    : 'w-8 h-8 p-1.5';

  return (
    <button
      onClick={speak}
      title="Listen to pronunciation"
      className={`${sizeClasses} rounded-md text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors shrink-0 ${
        speaking ? 'text-blue-600 bg-blue-50 animate-pulse' : ''
      }`}
    >
      <Volume2 className="w-full h-full" />
    </button>
  );
}
