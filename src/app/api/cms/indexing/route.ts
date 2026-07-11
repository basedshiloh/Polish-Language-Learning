import { NextRequest, NextResponse } from 'next/server';
import { createSign } from 'crypto';
import { isAuthorizedRequest } from '@/lib/cms-access';

const SITE_URL = process.env.GOOGLE_SEARCH_CONSOLE_SITE_URL ?? 'https://www.polishpal.pl/';

interface ServiceAccount {
  client_email: string;
  private_key: string;
}

function b64url(str: string) {
  return Buffer.from(str).toString('base64url');
}

function makeJWT(sa: ServiceAccount): string {
  const now = Math.floor(Date.now() / 1000);
  const header = b64url(JSON.stringify({ alg: 'RS256', typ: 'JWT' }));
  const payload = b64url(JSON.stringify({
    iss: sa.client_email,
    scope: 'https://www.googleapis.com/auth/webmasters.readonly',
    aud: 'https://oauth2.googleapis.com/token',
    iat: now,
    exp: now + 3600,
  }));
  const unsigned = `${header}.${payload}`;
  const sign = createSign('RSA-SHA256');
  sign.update(unsigned);
  // private_key stored in env may use literal \n — normalize to real newlines
  const pem = sa.private_key.replace(/\\n/g, '\n');
  const sig = sign.sign(pem, 'base64url');
  return `${unsigned}.${sig}`;
}

async function getAccessToken(sa: ServiceAccount): Promise<string> {
  const jwt = makeJWT(sa);
  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: `grant_type=${encodeURIComponent('urn:ietf:params:oauth2:grant_type:jwt-bearer')}&assertion=${encodeURIComponent(jwt)}`,
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Token exchange failed: ${res.status} ${text}`);
  }
  const data = await res.json();
  return data.access_token as string;
}

export async function POST(req: NextRequest) {
  if (!(await isAuthorizedRequest(req))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const raw = process.env.GOOGLE_SERVICE_ACCOUNT_JSON;
  if (!raw) {
    return NextResponse.json(
      { error: 'GOOGLE_SERVICE_ACCOUNT_JSON is not set. Add your service account key JSON to Vercel environment variables.' },
      { status: 503 }
    );
  }

  let sa: ServiceAccount;
  try {
    sa = JSON.parse(raw) as ServiceAccount;
  } catch {
    return NextResponse.json({ error: 'GOOGLE_SERVICE_ACCOUNT_JSON is not valid JSON.' }, { status: 503 });
  }

  const { url } = (await req.json()) as { url?: string };
  if (!url) return NextResponse.json({ error: 'url is required' }, { status: 400 });

  try {
    const token = await getAccessToken(sa);

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
      // 403 often means the service account doesn't have access to this SC property
      if (inspectRes.status === 403) {
        return NextResponse.json({
          url,
          verdict: 'error',
          error: 'Permission denied — make sure the service account is added as a Search Console owner or full user.',
        });
      }
      return NextResponse.json({ url, verdict: 'error', error: `GSC API ${inspectRes.status}: ${errText}` });
    }

    const data = await inspectRes.json();
    const result = data?.inspectionResult?.indexStatusResult;

    return NextResponse.json({
      url,
      verdict: result?.verdict ?? 'NEUTRAL',         // PASS | FAIL | NEUTRAL
      coverageState: result?.coverageState ?? null,  // e.g. "Submitted and indexed"
      lastCrawlTime: result?.lastCrawlTime ?? null,
      robotsTxtState: result?.robotsTxtState ?? null,
      indexingState: result?.indexingState ?? null,
      googleCanonical: result?.googleCanonical ?? null,
    });
  } catch (e) {
    return NextResponse.json({ url, verdict: 'error', error: (e as Error).message });
  }
}
