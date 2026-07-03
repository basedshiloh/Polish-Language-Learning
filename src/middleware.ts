import { NextRequest, NextResponse } from 'next/server';

// Spam/referrer domains to block. Add new entries here as needed.
const BLOCKED_REFERRERS = [
  'rankchief.shop',
];

export function middleware(req: NextRequest) {
  const referer = req.headers.get('referer') || '';
  if (referer) {
    try {
      const host = new URL(referer).hostname.replace(/^www\./, '');
      if (BLOCKED_REFERRERS.some((blocked) => host === blocked || host.endsWith(`.${blocked}`))) {
        return new NextResponse(null, { status: 403 });
      }
    } catch {
      // Malformed Referer header — ignore
    }
  }
  return NextResponse.next();
}

export const config = {
  matcher: [
    // Apply to all routes except Next.js internals and static files
    '/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|.*\\.webp$|.*\\.svg$|.*\\.png$|.*\\.ico$).*)',
  ],
};
