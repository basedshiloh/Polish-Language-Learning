'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Save, Upload, ArrowLeft, Globe, FileText, Star } from 'lucide-react';
import Link from 'next/link';
import type { Post, PostStatus, PostIntent } from '@/lib/types';
import type { LinkTarget } from '@/lib/internal-links';
import { blogCategoryStyles } from '@/data/blog';
import { slugify } from '@/lib/utils';
import MarkdownEditor from './MarkdownEditor';
import SeoPanel from './SeoPanel';
import LinkGenius from './LinkGenius';

interface Props {
  initial: Post | null;
  linkIndex: LinkTarget[];
  pillars: { id: string; title: string }[];
}

const INTENT_LABELS: Record<PostIntent, string> = {
  informational: 'Informational — answers a question / teaches',
  commercial: 'Commercial — compares or evaluates options',
  transactional: 'Transactional — download / sign-up / action',
  navigational: 'Navigational — brand or specific page',
};

export default function PostEditor({ initial, linkIndex, pillars }: Props) {
  const router = useRouter();
  const isNew = !initial;

  const [id] = useState(initial?.id || '');
  const [title, setTitle] = useState(initial?.title || '');
  const [slug, setSlug] = useState(initial?.slug || '');
  const [slugEdited, setSlugEdited] = useState(!isNew);
  const [excerpt, setExcerpt] = useState(initial?.excerpt || '');
  const [metaDescription, setMetaDescription] = useState(initial?.metaDescription || '');
  const [focusKeyword, setFocusKeyword] = useState(initial?.focusKeyword || '');
  const [category, setCategory] = useState(initial?.category || 'learning-tips');
  const [authorName, setAuthorName] = useState(initial?.author.name || 'PolishPal Contributor');
  const [authorBio, setAuthorBio] = useState(initial?.author.bio || 'Community-driven language education — making Polish accessible to everyone.');
  const [content, setContent] = useState(initial?.content || '');
  const [featuredImage, setFeaturedImage] = useState(initial?.featuredImage || '');
  const [featuredImageAlt, setFeaturedImageAlt] = useState(initial?.featuredImageAlt || '');
  const [summaryText, setSummaryText] = useState((initial?.summary || []).join('\n'));
  const [tagsText, setTagsText] = useState((initial?.tags || []).join(', '));
  const [status, setStatus] = useState<PostStatus>(initial?.status || 'draft');
  const [intent, setIntent] = useState<PostIntent>(initial?.intent || 'informational');
  const [isPillar, setIsPillar] = useState(initial?.isPillar || false);
  const [pillarId, setPillarId] = useState<string>(initial?.pillarId || '');

  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  function onTitleChange(v: string) {
    setTitle(v);
    if (!slugEdited) setSlug(slugify(v));
  }

  function insertLink(phrase: string, url: string) {
    const idx = content.indexOf(phrase);
    if (idx === -1) return;
    setContent(content.slice(0, idx) + `[${phrase}](${url})` + content.slice(idx + phrase.length));
  }

  async function uploadFeatured(file: File) {
    setUploading(true);
    setError('');
    const fd = new FormData();
    fd.append('file', file);
    const res = await fetch('/api/cms/upload', { method: 'POST', body: fd });
    const data = await res.json();
    setUploading(false);
    if (data.url) setFeaturedImage(data.url);
    else setError(data.error || 'Upload failed');
  }

  async function save(target?: PostStatus) {
    setSaving(true);
    setError('');
    setMessage('');
    const nextStatus = target ?? status;
    const post = {
      id: id || undefined,
      title,
      slug,
      excerpt,
      metaDescription: metaDescription || excerpt,
      focusKeyword,
      category,
      authorName,
      authorBio,
      content,
      featuredImage,
      featuredImageAlt,
      summary: summaryText.split('\n').map((s) => s.trim()).filter(Boolean),
      tags: tagsText.split(',').map((t) => t.trim()).filter(Boolean),
      status: nextStatus,
      intent,
      isPillar,
      pillarId: isPillar ? null : (pillarId || null),
    };
    const res = await fetch('/api/cms/posts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'save', post }),
    });
    const data = await res.json();
    setSaving(false);
    if (!res.ok) { setError(data.error || 'Save failed'); return; }
    setStatus(nextStatus);
    setMessage(nextStatus === 'published' ? 'Published!' : 'Saved.');
    if (isNew && data.id) {
      router.replace(`/polaris/posts/${data.id}`);
      router.refresh();
    }
  }

  return (
    <div className="p-6 md:p-8">
      <div className="max-w-6xl">
        <div className="flex items-center justify-between mb-6">
          <Link href="/polaris/posts" className="inline-flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 hover:text-blue-600 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Posts
          </Link>
          <div className="flex items-center gap-2">
            <span className={`text-xs px-2 py-1 rounded-full font-medium ${status === 'published' ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' : 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400'}`}>
              {status === 'published' ? 'Published' : 'Draft'}
            </span>
            <button onClick={() => save()} disabled={saving} className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 text-sm font-medium hover:opacity-90 disabled:opacity-50 transition-opacity">
              <Save className="w-4 h-4" /> {saving ? 'Saving…' : 'Save'}
            </button>
            {status === 'published' ? (
              <button onClick={() => save('draft')} disabled={saving} className="flex items-center gap-1.5 px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                <FileText className="w-4 h-4" /> Unpublish
              </button>
            ) : (
              <button onClick={() => save('published')} disabled={saving} className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors">
                <Globe className="w-4 h-4" /> Publish
              </button>
            )}
          </div>
        </div>

        {error && <div className="mb-4 text-sm text-red-600 bg-red-50 dark:bg-red-950/30 border border-red-100 dark:border-red-900 rounded-lg px-4 py-2">{error}</div>}
        {message && <div className="mb-4 text-sm text-green-700 bg-green-50 dark:bg-green-950/30 border border-green-100 dark:border-green-900 rounded-lg px-4 py-2">{message}</div>}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main column */}
          <div className="lg:col-span-2 space-y-4">
            <input
              value={title}
              onChange={(e) => onTitleChange(e.target.value)}
              placeholder="Post title"
              className="w-full text-2xl font-bold bg-transparent outline-none text-gray-900 dark:text-gray-100 placeholder:text-gray-300 dark:placeholder:text-gray-600"
            />
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <span>/blog/</span>
              <input
                value={slug}
                onChange={(e) => { setSlug(slugify(e.target.value)); setSlugEdited(true); }}
                placeholder="slug"
                className="flex-1 bg-transparent outline-none text-gray-600 dark:text-gray-300 border-b border-dashed border-gray-200 dark:border-gray-700"
              />
            </div>

            <MarkdownEditor value={content} onChange={setContent} />

            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-4 space-y-3">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Excerpt (card + meta fallback)</label>
              <textarea value={excerpt} onChange={(e) => setExcerpt(e.target.value)} rows={2} className="w-full text-sm bg-gray-50 dark:bg-gray-800 rounded-lg p-2.5 outline-none text-gray-900 dark:text-gray-100 border border-gray-100 dark:border-gray-700" />

              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Summary (TL;DR — one bullet per line)</label>
              <textarea value={summaryText} onChange={(e) => setSummaryText(e.target.value)} rows={3} className="w-full text-sm bg-gray-50 dark:bg-gray-800 rounded-lg p-2.5 outline-none text-gray-900 dark:text-gray-100 border border-gray-100 dark:border-gray-700" />
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Publish/meta settings */}
            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-4 space-y-3">
              <div>
                <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Category</label>
                <select value={category} onChange={(e) => setCategory(e.target.value as Post['category'])} className="w-full text-sm bg-gray-50 dark:bg-gray-800 rounded-lg p-2 outline-none text-gray-900 dark:text-gray-100 border border-gray-100 dark:border-gray-700">
                  {Object.entries(blogCategoryStyles).map(([key, s]) => (
                    <option key={key} value={key}>{s.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Tags (comma-separated)</label>
                <input value={tagsText} onChange={(e) => setTagsText(e.target.value)} className="w-full text-sm bg-gray-50 dark:bg-gray-800 rounded-lg p-2 outline-none text-gray-900 dark:text-gray-100 border border-gray-100 dark:border-gray-700" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Author name</label>
                <input value={authorName} onChange={(e) => setAuthorName(e.target.value)} className="w-full text-sm bg-gray-50 dark:bg-gray-800 rounded-lg p-2 outline-none text-gray-900 dark:text-gray-100 border border-gray-100 dark:border-gray-700" />
              </div>
            </div>

            {/* Content strategy */}
            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-4 space-y-3">
              <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">Content strategy</p>
              <div>
                <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Search intent</label>
                <select value={intent} onChange={(e) => setIntent(e.target.value as PostIntent)} className="w-full text-sm bg-gray-50 dark:bg-gray-800 rounded-lg p-2 outline-none text-gray-900 dark:text-gray-100 border border-gray-100 dark:border-gray-700">
                  {(Object.keys(INTENT_LABELS) as PostIntent[]).map((k) => (
                    <option key={k} value={k}>{INTENT_LABELS[k]}</option>
                  ))}
                </select>
              </div>

              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={isPillar} onChange={(e) => setIsPillar(e.target.checked)} className="rounded border-gray-300 dark:border-gray-600 text-amber-500 focus:ring-amber-400" />
                <span className="text-sm text-gray-700 dark:text-gray-300 flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 text-amber-500" /> This is a pillar post
                </span>
              </label>
              <p className="text-xs text-gray-400 dark:text-gray-500 -mt-1">Pillar posts are prioritized as internal-link targets (in Link Genius and for agents).</p>

              {!isPillar && (
                <div>
                  <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Belongs to pillar (cluster)</label>
                  <select value={pillarId} onChange={(e) => setPillarId(e.target.value)} className="w-full text-sm bg-gray-50 dark:bg-gray-800 rounded-lg p-2 outline-none text-gray-900 dark:text-gray-100 border border-gray-100 dark:border-gray-700">
                    <option value="">— none —</option>
                    {pillars.map((p) => (
                      <option key={p.id} value={p.id}>{p.title}</option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            {/* Featured image */}
            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-4 space-y-3">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Featured image</label>
              {featuredImage && (
                <div className="relative aspect-[2/1] rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800">
                  <Image src={featuredImage} alt={featuredImageAlt || 'preview'} fill className="object-cover" sizes="320px" />
                </div>
              )}
              <label className="flex items-center justify-center gap-2 px-3 py-2 rounded-lg border border-dashed border-gray-300 dark:border-gray-700 text-sm text-gray-500 dark:text-gray-400 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                <Upload className="w-4 h-4" />
                {uploading ? 'Uploading…' : 'Upload image (→ WebP)'}
                <input type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && uploadFeatured(e.target.files[0])} />
              </label>
              <input value={featuredImage} onChange={(e) => setFeaturedImage(e.target.value)} placeholder="…or paste an image URL" className="w-full text-xs bg-gray-50 dark:bg-gray-800 rounded-lg p-2 outline-none text-gray-600 dark:text-gray-300 border border-gray-100 dark:border-gray-700" />
              <input value={featuredImageAlt} onChange={(e) => setFeaturedImageAlt(e.target.value)} placeholder="Alt text (describe the image)" className="w-full text-xs bg-gray-50 dark:bg-gray-800 rounded-lg p-2 outline-none text-gray-600 dark:text-gray-300 border border-gray-100 dark:border-gray-700" />
            </div>

            {/* SEO */}
            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-4 space-y-3">
              <div>
                <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Focus keyword</label>
                <input value={focusKeyword} onChange={(e) => setFocusKeyword(e.target.value)} placeholder="e.g. polish cases" className="w-full text-sm bg-gray-50 dark:bg-gray-800 rounded-lg p-2 outline-none text-gray-900 dark:text-gray-100 border border-gray-100 dark:border-gray-700" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Meta description ({metaDescription.length}/160)</label>
                <textarea value={metaDescription} onChange={(e) => setMetaDescription(e.target.value)} rows={3} className="w-full text-sm bg-gray-50 dark:bg-gray-800 rounded-lg p-2 outline-none text-gray-900 dark:text-gray-100 border border-gray-100 dark:border-gray-700" />
              </div>
              <SeoPanel title={title} metaDescription={metaDescription || excerpt} slug={slug} focusKeyword={focusKeyword} content={content} />
            </div>

            {/* Link Genius */}
            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-4">
              <LinkGenius content={content} index={linkIndex} onInsert={insertLink} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
