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
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  value: number;
  min: number;
  max: number;
  onChange: (v: number) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-3 px-3 py-2.5 rounded-2xl bg-canvas">
      <div className="flex items-center gap-2.5 min-w-0">
        <span className="icon-badge w-8 h-8 rounded-lg bg-cobalt-soft text-cobalt-ink">
          <Icon className="w-4 h-4" strokeWidth={2.4} />
        </span>
        <span className="text-sm font-bold text-ink">{label}</span>
      </div>
      <div className="flex items-center gap-1 shrink-0">
        <button
          onClick={() => onChange(Math.max(min, value - 1))}
          disabled={value <= min}
          aria-label={`Decrease ${label}`}
          className="w-8 h-8 rounded-full flex items-center justify-center bg-paper border-2 border-line-2 text-ink shadow-[0_2px_0_var(--color-line-2)] active:translate-y-0.5 active:shadow-none disabled:opacity-30 disabled:active:translate-y-0 transition-transform"
        >
          <Minus className="w-3.5 h-3.5" strokeWidth={3} />
        </button>
        <span className="w-8 text-center text-sm font-extrabold text-ink tabular-nums" aria-live="polite">
          {value > 0 ? `+${value}` : value}
        </span>
        <button
          onClick={() => onChange(Math.min(max, value + 1))}
          disabled={value >= max}
          aria-label={`Increase ${label}`}
          className="w-8 h-8 rounded-full flex items-center justify-center bg-paper border-2 border-line-2 text-ink shadow-[0_2px_0_var(--color-line-2)] active:translate-y-0.5 active:shadow-none disabled:opacity-30 disabled:active:translate-y-0 transition-transform"
        >
          <Plus className="w-3.5 h-3.5" strokeWidth={3} />
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
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  active: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <button
      onClick={() => onChange(!active)}
      aria-pressed={active}
      className={`flex items-center gap-2.5 w-full px-3 py-2.5 rounded-2xl text-sm font-bold text-left transition-colors ${
        active ? 'bg-cobalt-soft text-cobalt-ink' : 'text-ink hover:bg-canvas'
      }`}
    >
      <span className={`icon-badge w-8 h-8 rounded-lg transition-colors ${active ? 'bg-cobalt text-white' : 'bg-canvas text-muted'}`}>
        <Icon className="w-4 h-4" strokeWidth={2.4} />
      </span>
      <span className="flex-1">{label}</span>
      <span
        aria-hidden="true"
        className={`relative shrink-0 w-10 h-6 rounded-full transition-colors duration-200 ${active ? 'bg-cobalt' : 'bg-line-2'}`}
      >
        <span className={`absolute top-1 left-1 w-4 h-4 bg-paper rounded-full transition-transform duration-200 ${active ? 'translate-x-4' : 'translate-x-0'}`} />
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
        aria-label={open ? 'Close accessibility panel' : 'Open accessibility panel'}
        aria-expanded={open}
        data-a11y-keep="true"
        className={`no-print fixed z-50 bottom-4 right-4 md:bottom-6 md:right-6 w-14 h-14 rounded-full flex items-center justify-center transition-[transform,box-shadow,background-color] duration-100 active:translate-y-1 ${
          open
            ? 'bg-paper border-2 border-line-2 text-ink shadow-[0_4px_0_var(--color-line-2)] active:shadow-none'
            : 'bg-cobalt text-white shadow-[0_4px_0_var(--color-cobalt-edge)] hover:brightness-110 active:shadow-none'
        }`}
      >
        {open ? (
          <X className="w-6 h-6" strokeWidth={2.6} />
        ) : (
          <Accessibility className="w-7 h-7" strokeWidth={2.2} data-a11y-keep="true" />
        )}
        {isModified && !open && (
          <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-sun rounded-full border-2 border-paper" aria-hidden="true" />
        )}
      </button>

      {/* Panel */}
      {open && (
        <div
          role="dialog"
          aria-label="Accessibility"
          className="no-print pp-pop origin-bottom-right fixed bottom-[5.5rem] right-4 md:bottom-24 md:right-6 z-50 w-[22rem] max-w-[calc(100vw-2rem)] max-h-[min(80vh,640px)] tile shadow-[0_18px_40px_-18px_rgba(30,33,50,0.35)] overflow-hidden flex flex-col"
        >
          {/* Header */}
          <div className="px-4 py-3.5 border-b-2 border-line flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <span className="icon-badge w-9 h-9 rounded-xl bg-cobalt text-white">
                <Accessibility className="w-5 h-5" strokeWidth={2.4} data-a11y-keep="true" />
              </span>
              <h2 className="text-lg font-semibold">Accessibility</h2>
            </div>
            {isModified && (
              <button
                onClick={reset}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-extrabold uppercase tracking-[0.06em] text-crimson-ink hover:bg-crimson-soft transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" strokeWidth={2.6} />
                Reset all
              </button>
            )}
          </div>

          {/* Content */}
          <div className="overflow-y-auto p-3 space-y-5">
            {/* Text adjustments */}
            <div>
              <h3 className="px-1 mb-2 leading-none"><span className="font-sans text-xs font-extrabold text-muted uppercase tracking-[0.1em]">Text Adjustments</span></h3>
              <div className="space-y-1.5">
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
              <h3 className="px-1 mb-2 leading-none"><span className="font-sans text-xs font-extrabold text-muted uppercase tracking-[0.1em]">Visual Adjustments</span></h3>
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
              <h3 className="px-1 mb-2 leading-none"><span className="font-sans text-xs font-extrabold text-muted uppercase tracking-[0.1em]">Navigation Aids</span></h3>
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
          <div className="px-4 py-2.5 border-t-2 border-line bg-canvas">
            <p className="text-[11px] font-semibold text-muted text-center">
              Press <kbd className="px-1.5 py-0.5 bg-paper border border-line-2 rounded-md text-[10px] font-bold text-ink-2">Alt+A</kbd> to toggle this panel
            </p>
          </div>
        </div>
      )}
    </>
  );
}
