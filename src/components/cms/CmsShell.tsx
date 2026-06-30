'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, FileText, MessageSquare, Link2, Network, GitFork, KeyRound, LogOut, ExternalLink } from 'lucide-react';

const nav = [
  { label: 'Dashboard', href: '/polaris', icon: LayoutDashboard },
  { label: 'Posts', href: '/polaris/posts', icon: FileText },
  { label: 'Comments', href: '/polaris/comments', icon: MessageSquare },
  { label: 'Link Genius', href: '/polaris/links', icon: Link2 },
  { label: 'Link Manager', href: '/polaris/manager', icon: Network },
  { label: 'Visualizer', href: '/polaris/visualizer', icon: GitFork },
  { label: 'API Keys', href: '/polaris/api', icon: KeyRound },
];

export default function CmsShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  async function logout() {
    await fetch('/api/cms/logout', { method: 'POST' });
    router.refresh();
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex">
      {/* Sidebar */}
      <aside className="w-56 shrink-0 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 flex flex-col fixed inset-y-0">
        <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-800">
          <span className="text-sm font-bold text-gray-900 dark:text-gray-100">PolishPal CMS</span>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {nav.map((item) => {
            const active = item.href === '/polaris' ? pathname === '/polaris' : pathname.startsWith(item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  active
                    ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'
                }`}
              >
                <Icon className="w-4 h-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="p-3 border-t border-gray-100 dark:border-gray-800 space-y-1">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
            View site
          </a>
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Log out
          </button>
        </div>
      </aside>

      {/* Content */}
      <main className="flex-1 ml-56 min-w-0">{children}</main>
    </div>
  );
}
