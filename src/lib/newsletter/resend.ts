import { NEWSLETTER_SEGMENT_ID } from './config';

// Minimal Resend REST client (no SDK dependency). Server-only.
// Contacts are global in Resend; "segments" are the lists broadcasts go to.

const API = 'https://api.resend.com';

export class ResendError extends Error {
  constructor(public status: number, public body: string) {
    super(`Resend ${status}: ${body.slice(0, 300)}`);
  }
}

async function call<T>(method: string, path: string, body?: unknown): Promise<T> {
  const res = await fetch(`${API}${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      'Content-Type': 'application/json',
      'User-Agent': 'polishpal-newsletter/1.0',
    },
    body: body === undefined ? undefined : JSON.stringify(body),
    cache: 'no-store',
  });
  const text = await res.text();
  if (!res.ok) throw new ResendError(res.status, text);
  return (text ? JSON.parse(text) : {}) as T;
}

export interface OutgoingEmail {
  from: string;
  to: string;
  replyTo?: string;
  subject: string;
  html: string;
  text: string;
  headers?: Record<string, string>;
  tags?: { name: string; value: string }[];
}

export async function sendEmail(email: OutgoingEmail): Promise<string> {
  const data = await call<{ id: string }>('POST', '/emails', {
    from: email.from,
    to: [email.to],
    reply_to: email.replyTo,
    subject: email.subject,
    html: email.html,
    text: email.text,
    headers: email.headers,
    tags: email.tags,
  });
  return data.id;
}

interface Contact {
  id: string;
  email: string;
  unsubscribed: boolean;
  properties?: Record<string, { value: string }>;
}

export async function getContact(email: string): Promise<Contact | null> {
  try {
    return await call<Contact>('GET', `/contacts/${encodeURIComponent(email)}`);
  } catch (err) {
    if (err instanceof ResendError && err.status === 404) return null;
    throw err;
  }
}

async function contactSegmentIds(email: string): Promise<string[]> {
  const data = await call<{ data: { id: string }[] }>('GET', `/contacts/${encodeURIComponent(email)}/segments`);
  return data.data.map((s) => s.id);
}

/** True when the address is already a subscribed member of the newsletter segment. */
export async function isSubscribed(email: string): Promise<boolean> {
  const contact = await getContact(email);
  if (!contact || contact.unsubscribed) return false;
  return (await contactSegmentIds(email)).includes(NEWSLETTER_SEGMENT_ID);
}

/**
 * Create or re-activate a confirmed subscriber with their consent record, and make sure
 * they are in the newsletter segment. Creating an existing contact is idempotent in
 * Resend, so we always follow up with an explicit update.
 */
export async function subscribeContact(
  email: string,
  properties: { signup_source: string; consent_at: string; consent_version: string },
): Promise<void> {
  await call('POST', '/contacts', { email, unsubscribed: false, properties });
  await call('PATCH', `/contacts/${encodeURIComponent(email)}`, { unsubscribed: false, properties });
  if (!(await contactSegmentIds(email)).includes(NEWSLETTER_SEGMENT_ID)) {
    await call('POST', `/contacts/${encodeURIComponent(email)}/segments/${NEWSLETTER_SEGMENT_ID}`);
  }
}

/** Global opt-out from all broadcasts. A missing contact counts as already unsubscribed. */
export async function unsubscribeContact(email: string): Promise<void> {
  try {
    await call('PATCH', `/contacts/${encodeURIComponent(email)}`, { unsubscribed: true });
  } catch (err) {
    if (err instanceof ResendError && err.status === 404) return;
    throw err;
  }
}
