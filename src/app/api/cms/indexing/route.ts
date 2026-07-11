import { NextRequest, NextResponse } from 'next/server';
import { GoogleAuth } from 'google-auth-library';
import { isAuthorizedRequest } from '@/lib/cms-access';

const SITE_URL = process.env.GOOGLE_SEARCH_CONSOLE_SITE_URL ?? 'https://www.polishpal.pl/';

function getAuth() {
  const raw = process.env.GOOGLE_SERVICE_ACCOUNT_JSON;
  if (!raw) throw new Error('GOOGLE_SERVICE_ACCOUNT_JSON is not set');
  const credentials = JSON.parse(raw);
  return new GoogleAuth({
    credentials,
    scopes: ['https://www.googleapis.com/auth/webmasters.readonly'],
  });
}

export async function POST(req: NextRequest) {
  if (!(await isAuthorizedRequest(req))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (!process.env.GOOGLE_SERVICE_ACCOUNT_JSON) {
    return NextResponse.json(
      { error: 'GOOGLE_SERVICE_ACCOUNT_JSON is not set. Add your service account key JSON to Vercel environment variables.' },
      { status: 503 }
    );
  }

  const { url } = (await req.json()) as { url?: string };
  if (!url) return NextResponse.json({ error: 'url is required' }, { status: 400 });

  try {
    const auth = getAuth();
    const token = await auth.getAccessToken();

    const inspectRes = await fetch(
      'https://searchconsole.googleapis.com/v1/urlInspection/index:inspect',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ inspectionUrl: url, siteUrl: SITE_URL }),
      }
    );

    if (!inspectRes.ok) {
      const errText = await inspectRes.text();
      return NextResponse.json({ url, verdict: 'error', error: `GSC ${inspectRes.status}: ${errText}` });
    }

    const data = await inspectRes.json();
    const result = data?.inspectionResult?.indexStatusResult;

    return NextResponse.json({
      url,
      verdict: result?.verdict ?? 'NEUTRAL',
      coverageState: result?.coverageState ?? null,
      lastCrawlTime: result?.lastCrawlTime ?? null,
      robotsTxtState: result?.robotsTxtState ?? null,
      indexingState: result?.indexingState ?? null,
      googleCanonical: result?.googleCanonical ?? null,
    });
  } catch (e) {
    return NextResponse.json({ url, verdict: 'error', error: (e as Error).message });
  }
}
