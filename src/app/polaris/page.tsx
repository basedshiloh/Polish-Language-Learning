import Link from 'next/link';
import { FileText, MessageSquare, Link2, PlusCircle } from 'lucide-react';
import { getAllPostsAdmin } from '@/lib/posts';

export const dynamic = 'force-dynamic';

export default async function CmsDashboard() {
  const posts = await getAllPostsAdmin();
  const published = posts.filter((p) => p.status === 'published').length;
  const drafts = posts.filter((p) => p.status === 'draft').length;

  const cards = [
    { label: 'Published', value: published, color: 'text-green-600' },
    { label: 'Drafts', value: drafts, color: 'text-amber-600' },
    { label: 'Total posts', value: posts.length, color: 'text-blue-600' },
  ];

  return (
    <div className="p-6 md:p-8">
      <div className="max-w-4xl">
        <h1 className="text-xl font-bold text-gray-900 mb-1">Dashboard</h1>
        <p className="text-sm text-gray-400 mb-6">Manage PolishPal content</p>

        <div className="grid grid-cols-3 gap-3 mb-8">
          {cards.map((c) => (
            <div key={c.label} className="bg-white rounded-lg border border-gray-200 p-4">
              <p className="text-xs text-gray-400">{c.label}</p>
              <p className={`text-2xl font-bold ${c.color}`}>{c.value}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Link href="/polaris/posts/new" className="group bg-white border border-gray-200 rounded-xl p-5 hover:border-blue-300 hover:shadow-md transition-all">
            <PlusCircle className="w-6 h-6 text-blue-600 mb-2" />
            <p className="font-semibold text-gray-900">New post</p>
            <p className="text-sm text-gray-500">Write a new blog article</p>
          </Link>
          <Link href="/polaris/posts" className="group bg-white border border-gray-200 rounded-xl p-5 hover:border-blue-300 hover:shadow-md transition-all">
            <FileText className="w-6 h-6 text-blue-600 mb-2" />
            <p className="font-semibold text-gray-900">Manage posts</p>
            <p className="text-sm text-gray-500">Edit, publish, or delete</p>
          </Link>
          <Link href="/polaris/comments" className="group bg-white border border-gray-200 rounded-xl p-5 hover:border-blue-300 hover:shadow-md transition-all">
            <MessageSquare className="w-6 h-6 text-blue-600 mb-2" />
            <p className="font-semibold text-gray-900">Moderate comments</p>
            <p className="text-sm text-gray-500">Hide or delete comments</p>
          </Link>
          <Link href="/polaris/links" className="group bg-white border border-gray-200 rounded-xl p-5 hover:border-blue-300 hover:shadow-md transition-all">
            <Link2 className="w-6 h-6 text-blue-600 mb-2" />
            <p className="font-semibold text-gray-900">Link Genius</p>
            <p className="text-sm text-gray-500">Internal link index</p>
          </Link>
        </div>
      </div>
    </div>
  );
}
