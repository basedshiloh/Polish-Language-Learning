'use client';

import { useState, useEffect, useCallback } from 'react';
import { Download, RefreshCw, RotateCcw, Trash2, Shield, Clock, Database, AlertTriangle } from 'lucide-react';
import type { BackupMeta, BackupType } from '@/lib/backup';

const TYPE_META: Record<BackupType, { label: string; color: string; bg: string; darkBg: string; description: string }> = {
  'pre-delete': { label: 'Pre-Delete', color: 'text-red-700 dark:text-red-400',   bg: 'bg-red-100',    darkBg: 'dark:bg-red-900/30',    description: 'Saved automatically before a post is deleted' },
  'auto':       { label: 'Auto',       color: 'text-blue-700 dark:text-blue-400',  bg: 'bg-blue-100',   darkBg: 'dark:bg-blue-900/30',   description: 'Saved automatically on every edit' },
  'scheduled':  { label: 'Scheduled',  color: 'text-green-700 dark:text-green-400',bg: 'bg-green-100',  darkBg: 'dark:bg-green-900/30',  description: 'Full-site snapshot taken daily at 02:00 UTC' },
  'manual':     { label: 'Manual',     color: 'text-amber-700 dark:text-amber-400',bg: 'bg-amber-100',  darkBg: 'dark:bg-amber-900/30',  description: 'Triggered manually via "Backup All Now"' },
};

function fmt(date: string, time: string) {
  const iso = `${date}T${time.replace(/-/g, ':')}Z`;
  return new Date(iso).toLocaleString('en-GB', { dateStyle: 'medium', timeStyle: 'short' });
}

function fmtSize(bytes?: number) {
  if (!bytes) return '';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

export default function BackupManager() {
  const [backups, setBackups] = useState<BackupMeta[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState<BackupType | 'all'>('all');
  const [search, setSearch] = useState('');
  const [restoring, setRestoring] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [backing, setBacking] = useState(false);
  const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null);
  const [confirm, setConfirm] = useState<{ path: string; action: 'restore' | 'delete' } | null>(null);
  const [preview, setPreview] = useState<{ path: string; data: unknown } | null>(null);

  const showToast = useCallback((msg: string, ok: boolean) => {
    setToast({ msg, ok });
    setTimeout(() => setToast(null), 4000);
  }, []);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/cms/backup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'list', type: filterType === 'all' ? undefined : filterType }),
      });
      const { backups: data } = await res.json();
      setBackups(data || []);
    } finally {
      setLoading(false);
    }
  }, [filterType]);

  useEffect(() => { load(); }, [load]);

  async function doBackupAll() {
    setBacking(true);
    try {
      const res = await fetch('/api/cms/backup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'full-backup' }),
      });
      const { ok, count, error } = await res.json();
      if (ok) {
        showToast(`Backed up ${count} posts successfully`, true);
        load();
      } else {
        showToast(error || 'Backup failed', false);
      }
    } finally {
      setBacking(false);
    }
  }

  async function doRestore(path: string) {
    setRestoring(path);
    setConfirm(null);
    try {
      const res = await fetch('/api/cms/backup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'restore', path }),
      });
      const { ok, restored, error } = await res.json();
      if (ok) {
        showToast(`Restored ${restored} post${restored !== 1 ? 's' : ''} successfully`, true);
      } else {
        showToast(error || 'Restore failed', false);
      }
    } finally {
      setRestoring(null);
    }
  }

  async function doDelete(path: string) {
    setDeleting(path);
    setConfirm(null);
    try {
      const res = await fetch('/api/cms/backup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'delete', path }),
      });
      const { ok } = await res.json();
      if (ok) {
        setBackups((prev) => prev.filter((b) => b.path !== path));
        showToast('Backup deleted', true);
      } else {
        showToast('Delete failed', false);
      }
    } finally {
      setDeleting(null);
    }
  }

  async function doPreview(path: string) {
    const res = await fetch('/api/cms/backup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'download', path }),
    });
    const { snapshot } = await res.json();
    if (snapshot) setPreview({ path, data: snapshot });
  }

  const filtered = backups.filter((b) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return b.slug.toLowerCase().includes(q) || b.date.includes(q);
  });

  const types: BackupType[] = ['pre-delete', 'auto', 'scheduled', 'manual'];

  return (
    <div className="p-6 md:p-10 max-w-5xl">
      {/* Toast */}
      {toast && (
        <div className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-xl shadow-lg text-sm font-medium flex items-center gap-2 ${
          toast.ok ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
        }`}>
          {toast.ok ? <Shield className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
          {toast.msg}
        </div>
      )}

      {/* Confirm dialog */}
      {confirm && (
        <div className="fixed inset-0 bg-black/40 z-40 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-6 max-w-sm w-full">
            <h3 className="font-bold text-gray-900 dark:text-gray-100 mb-2">
              {confirm.action === 'restore' ? 'Restore this backup?' : 'Delete this backup?'}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-5">
              {confirm.action === 'restore'
                ? 'This will overwrite the current live version of the post with the backup. This cannot be undone.'
                : 'This backup file will be permanently removed.'}
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => confirm.action === 'restore' ? doRestore(confirm.path) : doDelete(confirm.path)}
                className={`flex-1 px-4 py-2 rounded-lg text-sm font-semibold text-white ${
                  confirm.action === 'restore' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-red-600 hover:bg-red-700'
                }`}
              >
                {confirm.action === 'restore' ? 'Yes, restore' : 'Yes, delete'}
              </button>
              <button
                onClick={() => setConfirm(null)}
                className="flex-1 px-4 py-2 rounded-lg text-sm font-semibold bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Preview dialog */}
      {preview && (
        <div className="fixed inset-0 bg-black/40 z-40 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-6 max-w-2xl w-full max-h-[80vh] flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-gray-900 dark:text-gray-100 text-sm">{preview.path}</h3>
              <button onClick={() => setPreview(null)} className="text-gray-400 hover:text-gray-600 text-xs">Close</button>
            </div>
            <pre className="text-xs text-gray-700 dark:text-gray-300 overflow-auto flex-1 bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
              {JSON.stringify(preview.data, null, 2)}
            </pre>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-start justify-between mb-6 gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Backups</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Posts are backed up automatically on every save, edit, and before deletion. Daily full snapshots run at 02:00 UTC.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={load}
            disabled={loading}
            className="p-2 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={doBackupAll}
            disabled={backing}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg transition-colors disabled:opacity-50"
          >
            <Database className="w-4 h-4" />
            {backing ? 'Backing up…' : 'Backup All Now'}
          </button>
        </div>
      </div>

      {/* Type cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {types.map((t) => {
          const meta = TYPE_META[t];
          const count = backups.filter((b) => b.type === t).length;
          return (
            <button
              key={t}
              onClick={() => setFilterType(filterType === t ? 'all' : t)}
              className={`text-left p-3 rounded-xl border transition-all ${
                filterType === t
                  ? `border-blue-400 dark:border-blue-600 ${meta.bg} ${meta.darkBg}`
                  : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800'
              }`}
            >
              <p className={`text-xs font-bold uppercase tracking-wider ${meta.color}`}>{meta.label}</p>
              <p className="text-2xl font-black text-gray-900 dark:text-gray-100 mt-1">{count}</p>
            </button>
          );
        })}
      </div>

      {/* Search */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Filter by slug or date…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full max-w-xs px-3 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 outline-none focus:border-blue-400"
        />
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-sm text-gray-400 dark:text-gray-500">Loading backups…</div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center text-sm text-gray-400 dark:text-gray-500">No backups found.</div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 dark:border-gray-800">
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Type</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Post</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider hidden sm:table-cell">Date</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider hidden md:table-cell">Size</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
              {filtered.map((b) => {
                const meta = TYPE_META[b.type];
                const isRestoring = restoring === b.path;
                const isDeleting = deleting === b.path;
                return (
                  <tr key={b.path} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                    <td className="px-4 py-3">
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${meta.bg} ${meta.darkBg} ${meta.color}`}>
                        {meta.label}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="font-mono text-xs text-gray-700 dark:text-gray-300">{b.slug}</span>
                    </td>
                    <td className="px-4 py-3 hidden sm:table-cell">
                      <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                        <Clock className="w-3 h-3" />{fmt(b.date, b.time)}
                      </span>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <span className="text-xs text-gray-400 dark:text-gray-500">{fmtSize(b.size)}</span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1 justify-end">
                        <button
                          onClick={() => doPreview(b.path)}
                          title="Preview JSON"
                          className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                        >
                          <Download className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setConfirm({ path: b.path, action: 'restore' })}
                          disabled={!!isRestoring}
                          title="Restore this backup"
                          className="p-1.5 rounded-lg text-blue-500 hover:text-blue-700 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors disabled:opacity-40"
                        >
                          <RotateCcw className={`w-3.5 h-3.5 ${isRestoring ? 'animate-spin' : ''}`} />
                        </button>
                        <button
                          onClick={() => setConfirm({ path: b.path, action: 'delete' })}
                          disabled={!!isDeleting}
                          title="Delete backup"
                          className="p-1.5 rounded-lg text-red-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors disabled:opacity-40"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      <p className="text-xs text-gray-400 dark:text-gray-500 mt-4">
        {filtered.length} backup{filtered.length !== 1 ? 's' : ''} shown · Auto backups older than 30 days are pruned automatically · Pre-delete and manual backups are kept forever
      </p>
    </div>
  );
}
