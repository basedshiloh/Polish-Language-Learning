'use client';

import { useRef, useState } from 'react';
import { Bold, Italic, Heading2, Heading3, List, ListOrdered, Quote, Code, Link as LinkIcon, Image as ImageIcon, Eye, Pencil } from 'lucide-react';
import MarkdownRenderer from '@/components/blog/MarkdownRenderer';

interface Props {
  value: string;
  onChange: (v: string) => void;
}

export default function MarkdownEditor({ value, onChange }: Props) {
  const ref = useRef<HTMLTextAreaElement>(null);
  const [tab, setTab] = useState<'write' | 'preview'>('write');

  function surround(before: string, after = before) {
    const ta = ref.current;
    if (!ta) return;
    const start = ta.selectionStart;
    const end = ta.selectionEnd;
    const sel = value.slice(start, end);
    const next = value.slice(0, start) + before + sel + after + value.slice(end);
    onChange(next);
    requestAnimationFrame(() => {
      ta.focus();
      ta.selectionStart = start + before.length;
      ta.selectionEnd = start + before.length + sel.length;
    });
  }

  function prefixLine(prefix: string) {
    const ta = ref.current;
    if (!ta) return;
    const start = ta.selectionStart;
    const lineStart = value.lastIndexOf('\n', start - 1) + 1;
    const next = value.slice(0, lineStart) + prefix + value.slice(lineStart);
    onChange(next);
    requestAnimationFrame(() => { ta.focus(); ta.selectionStart = ta.selectionEnd = start + prefix.length; });
  }

  const words = value.trim() ? value.trim().split(/\s+/).length : 0;
  const chars = value.length;
  const sentences = value.trim() ? (value.match(/[^.!?]*[.!?]+/g) || []).length : 0;
  const paragraphs = value.trim() ? value.split(/\n\s*\n/).filter((p) => p.trim()).length : 0;
  const h2count = (value.match(/^## /gm) || []).length;
  const h3count = (value.match(/^### /gm) || []).length;
  const readMin = Math.max(1, Math.round(words / 200));

  const tools = [
    { icon: Bold, title: 'Bold', fn: () => surround('**') },
    { icon: Italic, title: 'Italic', fn: () => surround('*') },
    { icon: Heading2, title: 'Heading 2', fn: () => prefixLine('## ') },
    { icon: Heading3, title: 'Heading 3', fn: () => prefixLine('### ') },
    { icon: List, title: 'Bullet list', fn: () => prefixLine('- ') },
    { icon: ListOrdered, title: 'Numbered list', fn: () => prefixLine('1. ') },
    { icon: Quote, title: 'Quote', fn: () => prefixLine('> ') },
    { icon: Code, title: 'Inline code', fn: () => surround('`') },
    { icon: LinkIcon, title: 'Link', fn: () => surround('[', '](https://)') },
    { icon: ImageIcon, title: 'Image', fn: () => surround('![alt](', ')') },
  ];

  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden bg-white dark:bg-gray-900">
      <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 px-2 py-1.5">
        <div className="flex items-center gap-0.5 flex-wrap">
          {tools.map((t) => {
            const Icon = t.icon;
            return (
              <button key={t.title} type="button" onClick={t.fn} title={t.title} className="p-1.5 rounded text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                <Icon className="w-4 h-4" />
              </button>
            );
          })}
        </div>
        <div className="flex items-center gap-1">
          <button type="button" onClick={() => setTab('write')} className={`flex items-center gap-1 px-2 py-1 rounded text-xs font-medium ${tab === 'write' ? 'bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300' : 'text-gray-500 dark:text-gray-400'}`}>
            <Pencil className="w-3.5 h-3.5" /> Write
          </button>
          <button type="button" onClick={() => setTab('preview')} className={`flex items-center gap-1 px-2 py-1 rounded text-xs font-medium ${tab === 'preview' ? 'bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300' : 'text-gray-500 dark:text-gray-400'}`}>
            <Eye className="w-3.5 h-3.5" /> Preview
          </button>
        </div>
      </div>

      <div className="flex">
        {/* Left stats strip */}
        <div className="hidden sm:flex flex-col items-center gap-3 w-16 shrink-0 border-r border-gray-100 dark:border-gray-800 py-4 px-1 bg-gray-50/60 dark:bg-gray-800/30">
          {[
            { label: 'Words', value: words >= 1000 ? `${(words / 1000).toFixed(1)}k` : words },
            { label: 'Chars', value: chars >= 1000 ? `${(chars / 1000).toFixed(1)}k` : chars },
            { label: 'Min', value: `~${readMin}` },
            { label: 'Para', value: paragraphs },
            { label: 'Sent', value: sentences },
            { label: 'H2', value: h2count },
            { label: 'H3', value: h3count },
          ].map((s) => (
            <div key={s.label} className="flex flex-col items-center gap-0.5">
              <span className="text-sm font-bold text-gray-700 dark:text-gray-200 leading-none">{s.value}</span>
              <span className="text-[9px] uppercase tracking-widest text-gray-400 dark:text-gray-500">{s.label}</span>
            </div>
          ))}
        </div>

        {/* Editor / Preview */}
        {tab === 'write' ? (
          <textarea
            ref={ref}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Write your post in Markdown…"
            className="flex-1 h-[480px] p-4 text-sm font-mono bg-transparent outline-none resize-y text-gray-900 dark:text-gray-100 leading-relaxed"
          />
        ) : (
          <div className="flex-1 h-[480px] overflow-y-auto p-4">
            {value.trim() ? <MarkdownRenderer content={value} /> : <p className="text-sm text-gray-400">Nothing to preview yet.</p>}
          </div>
        )}
      </div>
    </div>
  );
}
