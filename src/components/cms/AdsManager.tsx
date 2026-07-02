'use client';

import { useState } from 'react';
import { Megaphone, Save, Check } from 'lucide-react';
import type { AdSlotData } from '@/lib/ads';

export default function AdsManager({ initialSlots }: { initialSlots: AdSlotData[] }) {
  const [slots, setSlots] = useState<AdSlotData[]>(initialSlots);
  const [saving, setSaving] = useState<string | null>(null);
  const [saved, setSaved] = useState<string | null>(null);
  const [error, setError] = useState('');

  function patch(id: string, changes: Partial<AdSlotData>) {
    setSlots((prev) => prev.map((s) => (s.id === id ? { ...s, ...changes } : s)));
  }

  async function save(slot: AdSlotData) {
    setSaving(slot.id);
    setError('');
    const res = await fetch('/api/cms/ads', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'save', slot }),
    });
    setSaving(null);
    if (!res.ok) {
      const d = await res.json().catch(() => ({}));
      setError(d.error || 'Save failed');
      return;
    }
    setSaved(slot.id);
    setTimeout(() => setSaved(null), 2000);
  }

  const inputCls = 'w-full text-sm bg-gray-50 dark:bg-gray-800 rounded-lg p-2 outline-none text-gray-900 dark:text-gray-100 border border-gray-100 dark:border-gray-700';

  return (
    <div className="p-6 md:p-8">
      <div className="max-w-3xl">
        <div className="flex items-center gap-2 mb-1">
          <Megaphone className="w-5 h-5 text-blue-600" />
          <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">Ad Slots</h1>
        </div>
        <p className="text-sm text-gray-400 dark:text-gray-500 mb-6">
          Each slot renders on the public site. <strong>Placeholder</strong> shows an &ldquo;Advertise here&rdquo; box linking to /contact ·{' '}
          <strong>Image</strong> shows a linked banner · <strong>HTML</strong> embeds ad-network code (e.g. AdSense).
        </p>

        {error && <div className="mb-4 text-sm text-red-600 bg-red-50 dark:bg-red-950/30 border border-red-100 dark:border-red-900 rounded-lg px-4 py-2">{error}</div>}

        <div className="space-y-4">
          {slots.map((s) => (
            <div key={s.id} className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-4 space-y-3">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">{s.label}</p>
                  <p className="text-xs text-gray-400 dark:text-gray-500 font-mono">{s.slot_key}</p>
                </div>
                <label className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 cursor-pointer shrink-0">
                  <input type="checkbox" checked={s.enabled} onChange={(e) => patch(s.id, { enabled: e.target.checked })} className="rounded border-gray-300 text-blue-600" />
                  Enabled
                </label>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Type</label>
                  <select value={s.type} onChange={(e) => patch(s.id, { type: e.target.value as AdSlotData['type'] })} className={inputCls}>
                    <option value="placeholder">Placeholder (advertise here)</option>
                    <option value="image">Image banner</option>
                    <option value="html">HTML / ad network</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Size (WxH)</label>
                  <input value={s.size} onChange={(e) => patch(s.id, { size: e.target.value })} placeholder="728x90" className={inputCls} />
                </div>
              </div>

              {s.type === 'image' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Image URL</label>
                    <input value={s.image_url} onChange={(e) => patch(s.id, { image_url: e.target.value })} placeholder="https://…/banner.webp" className={inputCls} />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Click-through link</label>
                    <input value={s.link_url} onChange={(e) => patch(s.id, { link_url: e.target.value })} placeholder="https://sponsor.example.com" className={inputCls} />
                  </div>
                </div>
              )}

              {s.type === 'html' && (
                <div>
                  <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Embed code (scripts allowed)</label>
                  <textarea value={s.html} onChange={(e) => patch(s.id, { html: e.target.value })} rows={4} placeholder='<ins class="adsbygoogle" …></ins>' className={`${inputCls} font-mono text-xs`} />
                </div>
              )}

              <button
                onClick={() => save(s)}
                disabled={saving === s.id}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors"
              >
                {saved === s.id ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
                {saving === s.id ? 'Saving…' : saved === s.id ? 'Saved' : 'Save'}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
