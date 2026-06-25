import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/polaris', '/api/', '/progress'],
    },
    sitemap: 'https://polish-language-learning.vercel.app/sitemap.xml',
  };
}
