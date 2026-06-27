'use client';

import { useState, useEffect } from 'react';
import {
  Accessibility,
  X,
  Plus,
  Minus,
  Type,
  ALargeSmall,
  Baseline,
  Eye,
  MousePointer2,
  ScanLine,
  Link2,
  ImageOff,
  Pause,
  RotateCcw,
  Contrast,
} from 'lucide-react';
import { useAccessibility } from '@/hooks/useAccessibility';

function StepControl({
  label,
  icon: Icon,
  value,
  min,
  max,
  onChange,
}: {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  value: number;
  min: number;
  max: number;
  onChange: (v: number) => void;
}) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <Icon className="w-4 h-4 text-blue-500" />
        <span className="text-sm text-gray-700 dark:text-gray-300">{label}</span>
      </div>
      <div className="flex items-center gap-1">
        <button
          onClick={() => onChange(Math.max(min, value - 1))}
          disabled={value <= min}
          className="w-7 h-7 rounded-md flex items-center justify-center bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-30 transition-colors"
        >
          <Minus className="w-3.5 h-3.5" />
        </button>
        <span className="w-8 text-center text-xs font-semibold text-gray-800 dark:text-gray-200">
          {value > 0 ? `+${value}` : value}
        </span>
        <button
          onClick={() => onChange(Math.min(max, value + 1))}
          disabled={value >= max}
          className="w-7 h-7 rounded-md flex items-center justify-center bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-30 transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}

function ToggleOption({
  label,
  icon: Icon,
  active,
  onChange,
}: {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  active: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <button
      onClick={() => onChange(!active)}
      className={`flex items-center gap-2 w-full px-3 py-2.5 rounded-lg text-sm transition-colors ${
        active
          ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 font-medium'
          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
      }`}
    >
      <Icon className={`w-4 h-4 ${active ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400 dark:text-gray-500'}`} />
      <span className="flex-1 text-left">{label}</span>
      <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${
        active ? 'bg-blue-100 dark:bg-blue-800 text-blue-700 dark:text-blue-300' : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
      }`}>
        {active ? 'ON' : 'OFF'}
      </span>
    </button>
  );
}

export default function AccessibilityPanel() {
  const { settings, update, reset, mounted, isModified } = useAccessibility();
  const [open, setOpen] = useState(false);

  // Reading line guide follows mouse
  useEffect(() => {
    if (!settings.readingLine) return;
    function handleMouse(e: MouseEvent) {
      const guide = document.getElementById('a11y-reading-guide');
      if (guide) guide.style.top = `${e.clientY - 6}px`;
    }
    window.addEventListener('mousemove', handleMouse);
    return () => window.removeEventListener('mousemove', handleMouse);
  }, [settings.readingLine]);

  // Keyboard shortcut: Alt+A to toggle
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.altKey && e.key === 'a') {
        e.preventDefault();
        setOpen((o) => !o);
      }
    }
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, []);

  if (!mounted) return null;

  return (
    <>
      {/* Reading guide line */}
      <div id="a11y-reading-guide" />

      {/* Floating button */}
      <button
        onClick={() => setOpen(!open)}
        title="Accessibility adjustments (Alt+A)"
        data-a11y-keep="true"
        className={`no-print fixed z-50 w-12 h-12 rounded-full shadow-lg flex items-center justify-center transition-all ${
          open
            ? 'bottom-6 right-6 bg-gray-200 dark:bg-gray-700'
            : 'bottom-24 md:bottom-6 right-4 md:right-6 bg-blue-600 hover:bg-blue-700 hover:scale-110'
        }`}
      >
        {open ? (
          <X className="w-5 h-5 text-gray-600 dark:text-gray-300" />
        ) : (
          <Accessibility className="w-6 h-6 text-white" data-a11y-keep="true" />
        )}
        {isModified && !open && (
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-amber-500 rounded-full border-2 border-white dark:border-gray-900" />
        )}
      </button>

      {/* Panel */}
      {open && (
        <div className="fixed bottom-24 md:bottom-20 right-4 md:right-6 z-50 w-80 max-h-[80vh] bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
          {/* Header */}
          <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Accessibility className="w-5 h-5 text-blue-600" data-a11y-keep="true" />
              <h2 className="text-sm font-bold text-gray-900 dark:text-gray-100">Accessibility</h2>
            </div>
            {isModified && (
              <button
                onClick={reset}
                className="flex items-center gap-1 text-xs text-gray-400 hover:text-red-500 transition-colors"
              >
                <RotateCcw className="w-3 h-3" />
                Reset all
              </button>
            )}
          </div>

          {/* Content */}
          <div className="overflow-y-auto p-4 space-y-5">
            {/* Text adjustments */}
            <div>
              <h3 className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-3">
                Text Adjustments
              </h3>
              <div className="space-y-3">
                <StepControl
                  label="Font Size"
                  icon={ALargeSmall}
                  value={settings.fontSize}
                  min={-2}
                  max={4}
                  onChange={(v) => update({ fontSize: v })}
                />
                <StepControl
                  label="Line Height"
                  icon={Baseline}
                  value={settings.lineHeight}
                  min={0}
                  max={3}
                  onChange={(v) => update({ lineHeight: v })}
                />
                <StepControl
                  label="Letter Spacing"
                  icon={Type}
                  value={settings.letterSpacing}
                  min={0}
                  max={3}
                  onChange={(v) => update({ letterSpacing: v })}
                />
                <ToggleOption
                  label="Dyslexia-Friendly Font"
                  icon={Type}
                  active={settings.dyslexiaFont}
                  onChange={(v) => update({ dyslexiaFont: v })}
                />
              </div>
            </div>

            {/* Visual adjustments */}
            <div>
              <h3 className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-3">
                Visual Adjustments
              </h3>
              <div className="space-y-1">
                <ToggleOption
                  label="High Contrast"
                  icon={Contrast}
                  active={settings.highContrast}
                  onChange={(v) => update({ highContrast: v })}
                />
                <ToggleOption
                  label="Monochrome"
                  icon={Eye}
                  active={settings.monochrome}
                  onChange={(v) => update({ monochrome: v })}
                />
                <ToggleOption
                  label="Pause Animations"
                  icon={Pause}
                  active={settings.pauseAnimations}
                  onChange={(v) => update({ pauseAnimations: v })}
                />
                <ToggleOption
                  label="Hide Images"
                  icon={ImageOff}
                  active={settings.hideImages}
                  onChange={(v) => update({ hideImages: v })}
                />
              </div>
            </div>

            {/* Navigation aids */}
            <div>
              <h3 className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-3">
                Navigation Aids
              </h3>
              <div className="space-y-1">
                <ToggleOption
                  label="Big Cursor"
                  icon={MousePointer2}
                  active={settings.bigCursor}
                  onChange={(v) => update({ bigCursor: v })}
                />
                <ToggleOption
                  label="Reading Guide"
                  icon={ScanLine}
                  active={settings.readingLine}
                  onChange={(v) => update({ readingLine: v })}
                />
                <ToggleOption
                  label="Highlight Links"
                  icon={Link2}
                  active={settings.highlightLinks}
                  onChange={(v) => update({ highlightLinks: v })}
                />
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="px-4 py-2.5 border-t border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
            <p className="text-[10px] text-gray-400 dark:text-gray-500 text-center">
              Press <kbd className="px-1 py-0.5 bg-gray-200 dark:bg-gray-700 rounded text-[9px] font-mono">Alt+A</kbd> to toggle this panel
            </p>
          </div>
        </div>
      )}
    </>
  );
}
