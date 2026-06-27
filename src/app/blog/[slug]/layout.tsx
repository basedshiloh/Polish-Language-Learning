import type { Metadata } from 'next';
import { getPostBySlug, getPublishedPosts } from '@/lib/posts';
import JsonLd, { breadcrumbSchema } from '@/components/seo/JsonLd';

export const revalidate = 3600;
export const dynamicParams = true;

interface Props {
  params: Promise<{ slug: string }>;
  children: React.ReactNode;
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return {};

  return {
    title: post.title,
    description: post.metaDescription || post.excerpt,
    openGraph: {
      title: `${post.title} | PolishPal`,
      description: post.excerpt,
      url: `/blog/${post.slug}`,
      type: 'article',
      publishedTime: post.date,
      modifiedTime: post.updatedDate || post.date,
      authors: [post.author.name],
      tags: post.tags,
      images: [{ url: post.featuredImage, width: 1200, height: 630, alt: post.featuredImageAlt }],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt,
      images: [post.featuredImage],
    },
    alternates: { canonical: `/blog/${post.slug}` },
  };
}

export async function generateStaticParams() {
  const posts = await getPublishedPosts();
  return posts.map((p) => ({ slug: p.slug }));
}

export default async function BlogPostLayout({ params, children }: Props) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return <>{children}</>;

  const articleData = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt,
    url: `https://www.polishpal.pl/blog/${post.slug}`,
    datePublished: post.date,
    dateModified: post.updatedDate || post.date,
    author: { '@type': 'Organization', name: post.author.name },
    publisher: { '@type': 'Organization', name: 'PolishPal' },
    image: `https://www.polishpal.pl${post.featuredImage}`,
    wordCount: post.readingTime * 200,
    inLanguage: 'en',
    isAccessibleForFree: true,
    keywords: post.tags.join(', '),
  };

  return (
    <>
      <JsonLd data={breadcrumbSchema([
        { name: 'Home', url: 'https://www.polishpal.pl' },
        { name: 'Blog', url: 'https://www.polishpal.pl/blog' },
        { name: post.title, url: `https://www.polishpal.pl/blog/${post.slug}` },
      ])} />
      <JsonLd data={articleData} />
      {children}
    </>
  );
}
