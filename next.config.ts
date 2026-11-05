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
  // Share-card fonts are read from disk by the /og route at request time too.
  outputFileTracingIncludes: { '/og/[kind]/[slug]': ['./src/assets/og/**'] },
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
