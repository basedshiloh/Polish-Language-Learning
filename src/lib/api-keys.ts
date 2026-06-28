import crypto from 'crypto';
import { adminClient } from '@/lib/posts';

export interface ApiKeyRecord {
  id: string;
  name: string;
  key_prefix: string;
  revoked: boolean;
  created_at: string;
  last_used_at: string | null;
}

function sha256(s: string): string {
  return crypto.createHash('sha256').update(s).digest('hex');
}

// Generate a new application password: pp_<40 hex>. Returned raw ONCE.
export function generateKey() {
  const raw = 'pp_' + crypto.randomBytes(20).toString('hex');
  return { raw, prefix: raw.slice(0, 11), hash: sha256(raw) };
}

export async function createApiKey(name: string): Promise<{ raw: string; record: ApiKeyRecord } | null> {
  const { raw, prefix, hash } = generateKey();
  const { data, error } = await adminClient()
    .from('cms_api_keys')
    .insert({ name: name.slice(0, 60) || 'Untitled', key_prefix: prefix, key_hash: hash })
    .select('id, name, key_prefix, revoked, created_at, last_used_at')
    .single();
  if (error || !data) return null;
  return { raw, record: data as ApiKeyRecord };
}

export async function listApiKeys(): Promise<ApiKeyRecord[]> {
  const { data } = await adminClient()
    .from('cms_api_keys')
    .select('id, name, key_prefix, revoked, created_at, last_used_at')
    .order('created_at', { ascending: false });
  return (data as ApiKeyRecord[]) || [];
}

export async function revokeApiKey(id: string): Promise<boolean> {
  const { error } = await adminClient().from('cms_api_keys').update({ revoked: true }).eq('id', id);
  return !error;
}

// Verify an incoming raw key. Updates last_used_at on success.
export async function verifyApiKey(raw: string): Promise<boolean> {
  if (!raw || !raw.startsWith('pp_')) return false;
  const hash = sha256(raw);
  const supabase = adminClient();
  const { data } = await supabase
    .from('cms_api_keys')
    .select('id')
    .eq('key_hash', hash)
    .eq('revoked', false)
    .maybeSingle();
  if (!data) return false;
  void supabase.from('cms_api_keys').update({ last_used_at: new Date().toISOString() }).eq('id', data.id);
  return true;
}
