import { adminClient } from '@/lib/posts';
import type { AdSlotData } from '@/lib/ads';
import AdsManager from '@/components/cms/AdsManager';

export const dynamic = 'force-dynamic';

export default async function AdsPage() {
  const { data } = await adminClient().from('ad_slots').select('*').order('slot_key');
  return <AdsManager initialSlots={(data as AdSlotData[]) || []} />;
}
