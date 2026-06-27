'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Shield, LogIn } from 'lucide-react';

export default function CmsLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function submit() {
    setLoading(true);
    setError('');
    const res = await fetch('/api/cms/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    setLoading(false);
    if (res.ok) {
      router.refresh();
    } else if (res.status === 429) {
      setError('Too many attempts. Try again later.');
    } else {
      setError('Invalid username or password');
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-8 w-full max-w-sm">
        <div className="flex items-center gap-2 mb-6">
          <Shield className="w-5 h-5 text-blue-600" />
          <h1 className="text-lg font-semibold text-gray-900 dark:text-gray-100">PolishPal CMS</h1>
        </div>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && submit()}
          placeholder="Username"
          autoComplete="username"
          className="w-full mb-2 px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm outline-none focus:border-blue-400 dark:focus:border-blue-600 transition-colors"
          autoFocus
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && submit()}
          placeholder="Password"
          autoComplete="current-password"
          className="w-full px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm outline-none focus:border-blue-400 dark:focus:border-blue-600 transition-colors"
        />
        {error && <p className="text-xs text-red-500 mt-2">{error}</p>}
        <button
          onClick={submit}
          disabled={loading}
          className="w-full mt-3 flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors"
        >
          <LogIn className="w-4 h-4" />
          {loading ? 'Signing in…' : 'Enter'}
        </button>
      </div>
    </div>
  );
}
