import type { NextConfig } from "next";

// Baseline hardening headers for every response.
// The CSP is deliberately narrow: it does not restrict script/style/img/connect
// sources, so AdSense, Umami, Supabase and next/image keep working. It blocks
// plugins, <base> hijacking and framing by other sites. Tighten script-src
// later with a Content-Security-Policy-Report-Only trial first.
const securityHeaders = [
  {
    key: "Content-Security-Policy",
    value: "base-uri 'self'; object-src 'none'; frame-ancestors 'self'; upgrade-insecure-requests",
  },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
];

const nextConfig: NextConfig = {
  // The /og route renders cards at request time too (new posts, some crawlers):
  // it reads its fonts from disk, and sharp needs its native libvips .so, which
  // the tracer missed ("libvips-cpp.so.8.18.3: cannot open shared object file").
  outputFileTracingIncludes: {
    '/og/[kind]/[slug]': [
      './src/assets/og/**',
      './node_modules/@img/sharp-linux-x64/**/*',
      './node_modules/@img/sharp-libvips-linux-x64/**/*',
    ],
  },
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    remotePatterns: [
      { protocol: 'https', hostname: 'gdtbogshuqmayallpgmk.supabase.co' },
    ],
  },
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
