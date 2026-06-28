import { listApiKeys } from '@/lib/api-keys';
import ApiKeys from '@/components/cms/ApiKeys';
import type { ApiKeyRecord } from '@/lib/api-keys';

export const dynamic = 'force-dynamic';

export default async function ApiKeysPage() {
  let keys: ApiKeyRecord[] = [];
  try {
    keys = await listApiKeys();
  } catch {
    keys = [];
  }
  return <ApiKeys initialKeys={keys} />;
}
