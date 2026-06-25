import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/polaris', '/api/', '/progress'],
    },
    sitemap: 'https://polishpal.pl/sitemap.xml',
  };
}
