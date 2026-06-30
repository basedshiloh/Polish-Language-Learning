'use client';

import { useState } from 'react';
import { KeyRound, Plus, Copy, Check, Trash2, ShieldAlert } from 'lucide-react';
import type { ApiKeyRecord } from '@/lib/api-keys';

export default function ApiKeys({ initialKeys }: { initialKeys: ApiKeyRecord[] }) {
  const [keys, setKeys] = useState<ApiKeyRecord[]>(initialKeys);
  const [name, setName] = useState('');
  const [creating, setCreating] = useState(false);
  const [newKey, setNewKey] = useState('');
  const [copied, setCopied] = useState(false);
  const [confirmRevoke, setConfirmRevoke] = useState<string | null>(null);
  const [error, setError] = useState('');

  async function refresh() {
    const res = await fetch('/api/cms/keys', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'list' }),
    });
    const data = await res.json();
    if (data.keys) setKeys(data.keys);
  }

  async function create() {
    if (!name.trim()) return;
    setCreating(true);
    setError('');
    setNewKey('');
    const res = await fetch('/api/cms/keys', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'create', name: name.trim() }),
    });
    const data = await res.json();
    setCreating(false);
    if (!res.ok) { setError(data.error || 'Failed to create key. Has the cms_api_keys table been created?'); return; }
    setNewKey(data.key);
    setName('');
    refresh();
  }

  async function revoke(id: string) {
    await fetch('/api/cms/keys', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'revoke', id }),
    });
    setConfirmRevoke(null);
    refresh();
  }

  function copyKey() {
    navigator.clipboard?.writeText(newKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const curl = `curl -X POST https://www.polishpal.pl/api/cms/posts \\
  -H "Authorization: Bearer YOUR_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "action": "save",
    "post": {
      "title": "My new post",
      "content": "## Heading\\n\\nMarkdown body…",
      "excerpt": "Short summary",
      "metaDescription": "SEO description",
      "focusKeyword": "polish cases",
      "category": "grammar-deep-dive",
      "intent": "informational",
      "isPillar": false,
      "tags": ["cases", "grammar"],
      "summary": ["Point 1", "Point 2"],
      "featuredImage": "https://…/image.webp",
      "featuredImageAlt": "Alt text",
      "status": "published"
    }
  }'`;

  return (
    <div className="p-6 md:p-8">
      <div className="max-w-4xl">
        <div className="flex items-center gap-2 mb-1">
          <KeyRound className="w-5 h-5 text-blue-600" />
          <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">API Keys</h1>
        </div>
        <p className="text-sm text-gray-400 dark:text-gray-500 mb-6">
          Application passwords let your agents and apps create posts via the REST API — no CMS login needed. Treat them like passwords.
        </p>

        {/* Create */}
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-4 mb-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Create a new key</label>
          <div className="flex gap-2">
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && create()}
              placeholder="Name (e.g. Content Agent, n8n, Zapier)"
              className="flex-1 text-sm bg-gray-50 dark:bg-gray-800 rounded-lg px-3 py-2 outline-none text-gray-900 dark:text-gray-100 border border-gray-100 dark:border-gray-700"
            />
            <button onClick={create} disabled={creating || !name.trim()} className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors">
              <Plus className="w-4 h-4" /> {creating ? 'Creating…' : 'Create'}
            </button>
          </div>
          {error && <p className="text-xs text-red-500 mt-2">{error}</p>}

          {newKey && (
            <div className="mt-3 bg-amber-50 dark:bg-amber-950/30 border border-amber-100 dark:border-amber-900 rounded-lg p-3">
              <p className="text-xs font-medium text-amber-800 dark:text-amber-300 flex items-center gap-1 mb-2">
                <ShieldAlert className="w-3.5 h-3.5" /> Copy this key now — it won&apos;t be shown again.
              </p>
              <div className="flex items-center gap-2">
                <code className="flex-1 text-xs font-mono bg-white dark:bg-gray-900 rounded px-2 py-1.5 border border-amber-200 dark:border-amber-900 text-gray-900 dark:text-gray-100 break-all">{newKey}</code>
                <button onClick={copyKey} className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-amber-600 text-white text-xs font-medium hover:bg-amber-700 transition-colors shrink-0">
                  {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />} {copied ? 'Copied' : 'Copy'}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* List */}
        <div className="space-y-2 mb-8">
          {keys.length === 0 ? (
            <p className="text-sm text-gray-400 dark:text-gray-500 text-center py-6">No API keys yet.</p>
          ) : (
            keys.map((k) => (
              <div key={k.id} className={`flex items-center gap-3 bg-white dark:bg-gray-900 border rounded-lg p-3 ${k.revoked ? 'border-gray-100 dark:border-gray-800 opacity-50' : 'border-gray-200 dark:border-gray-800'}`}>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">{k.name}</p>
                    {k.revoked && <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400">Revoked</span>}
                  </div>
                  <p className="text-xs text-gray-400 dark:text-gray-500 font-mono">{k.key_prefix}••••••••</p>
                  <p className="text-[11px] text-gray-400 dark:text-gray-500">
                    Created {new Date(k.created_at).toLocaleDateString()}
                    {k.last_used_at ? ` · last used ${new Date(k.last_used_at).toLocaleDateString()}` : ' · never used'}
                  </p>
                </div>
                {!k.revoked && (
                  confirmRevoke === k.id ? (
                    <div className="flex items-center gap-1 shrink-0">
                      <button onClick={() => revoke(k.id)} className="px-2 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700">Confirm</button>
                      <button onClick={() => setConfirmRevoke(null)} className="px-2 py-1 text-xs text-gray-500">Cancel</button>
                    </div>
                  ) : (
                    <button onClick={() => setConfirmRevoke(k.id)} title="Revoke" className="p-2 rounded text-gray-400 hover:text-red-500 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors shrink-0">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )
                )}
              </div>
            ))
          )}
        </div>

        {/* Docs */}
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-4">
          <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2">Using the API</h2>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
            Send a POST to <code className="font-mono">/api/cms/posts</code> with your key in the <code className="font-mono">Authorization: Bearer</code> header.
            Set <code className="font-mono">status</code> to <code className="font-mono">&quot;draft&quot;</code> or <code className="font-mono">&quot;published&quot;</code>.
            Categories: learning-tips, grammar-deep-dive, culture, pronunciation, vocabulary.
          </p>
          <pre className="bg-gray-900 dark:bg-gray-950 text-gray-100 rounded-lg p-3 overflow-x-auto text-xs font-mono leading-relaxed">{curl}</pre>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-3">
            Image upload: POST a multipart form with a <code className="font-mono">file</code> field to <code className="font-mono">/api/cms/upload</code> (same Bearer header) — returns a WebP URL to use as <code className="font-mono">featuredImage</code>.
          </p>
          <div className="mt-3 bg-blue-50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900 rounded-lg p-3">
            <p className="text-xs text-blue-800 dark:text-blue-300">
              <strong>For internal linking:</strong> send <code className="font-mono">{'{"action":"list"}'}</code> to <code className="font-mono">/api/cms/posts</code> to get all published posts with <code className="font-mono">isPillar</code> and <code className="font-mono">intent</code>. Agents should <strong>prioritize linking to <code className="font-mono">isPillar: true</code> posts</strong> and write content that matches the target&apos;s <code className="font-mono">intent</code>. Set <code className="font-mono">intent</code> (informational / commercial / transactional / navigational) on every post.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
