import { createClient } from '@supabase/supabase-js';
import type { Post, BlogCategory } from '@/lib/types';
import { blogCategoryStyles } from '@/data/blog';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

// Public reads (RLS limits to status='published')
function publicClient() {
  return createClient(url, anonKey);
}

// Admin reads/writes (service role bypasses RLS) — server-only
export function adminClient() {
  return createClient(url, serviceKey || anonKey);
}

interface PostRow {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  meta_description: string;
  focus_keyword: string;
  category: string;
  author_name: string;
  author_bio: string;
  content: string;
  featured_image: string;
  featured_image_alt: string;
  summary: unknown;
  tags: unknown;
  reading_time: number;
  status: string;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

function toStringArray(v: unknown): string[] {
  if (Array.isArray(v)) return v.filter((x): x is string => typeof x === 'string');
  if (typeof v === 'string') {
    try {
      const parsed = JSON.parse(v);
      return Array.isArray(parsed) ? parsed.filter((x) => typeof x === 'string') : [];
    } catch {
      return [];
    }
  }
  return [];
}

export function rowToPost(r: PostRow): Post {
  const category = (r.category in blogCategoryStyles ? r.category : 'learning-tips') as BlogCategory;
  return {
    id: r.id,
    slug: r.slug,
    title: r.title,
    excerpt: r.excerpt,
    metaDescription: r.meta_description || r.excerpt,
    focusKeyword: r.focus_keyword || '',
    category,
    author: { name: r.author_name, bio: r.author_bio },
    content: r.content,
    featuredImage: r.featured_image,
    featuredImageAlt: r.featured_image_alt,
    summary: toStringArray(r.summary),
    tags: toStringArray(r.tags),
    readingTime: r.reading_time,
    status: r.status === 'published' ? 'published' : 'draft',
    date: (r.published_at || r.created_at || new Date().toISOString()).slice(0, 10),
    updatedDate: r.updated_at ? r.updated_at.slice(0, 10) : undefined,
  };
}

const SELECT = '*';

export async function getPublishedPosts(): Promise<Post[]> {
  const { data } = await publicClient()
    .from('posts')
    .select(SELECT)
    .eq('status', 'published')
    .order('published_at', { ascending: false });
  return (data || []).map((r) => rowToPost(r as PostRow));
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  const { data } = await publicClient()
    .from('posts')
    .select(SELECT)
    .eq('slug', slug)
    .eq('status', 'published')
    .maybeSingle();
  return data ? rowToPost(data as PostRow) : null;
}

export async function getRelatedPosts(slug: string, category: string, limit = 3): Promise<Post[]> {
  const { data } = await publicClient()
    .from('posts')
    .select(SELECT)
    .eq('status', 'published')
    .eq('category', category)
    .neq('slug', slug)
    .order('published_at', { ascending: false })
    .limit(limit);
  return (data || []).map((r) => rowToPost(r as PostRow));
}

export async function getPaginatedPosts(page: number, perPage = 9, category?: string) {
  let all = await getPublishedPosts();
  const activeCategory = category && category in blogCategoryStyles ? category : undefined;
  if (activeCategory) all = all.filter((p) => p.category === activeCategory);
  const totalPages = Math.ceil(all.length / perPage);
  const currentPage = Math.max(1, Math.min(page, totalPages || 1));
  const start = (currentPage - 1) * perPage;
  return {
    posts: all.slice(start, start + perPage),
    currentPage,
    totalPages,
    totalPosts: all.length,
    activeCategory,
  };
}

// ── Admin (service role) ──────────────────────────────────

export async function getAllPostsAdmin(): Promise<Post[]> {
  const { data } = await adminClient()
    .from('posts')
    .select(SELECT)
    .order('updated_at', { ascending: false });
  return (data || []).map((r) => rowToPost(r as PostRow));
}

export async function getPostByIdAdmin(id: string): Promise<Post | null> {
  const { data } = await adminClient().from('posts').select(SELECT).eq('id', id).maybeSingle();
  return data ? rowToPost(data as PostRow) : null;
}
