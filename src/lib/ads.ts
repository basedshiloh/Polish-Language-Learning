import { createClient } from '@supabase/supabase-js';

export interface AdSlotData {
  id: string;
  slot_key: string;
  label: string;
  type: 'placeholder' | 'image' | 'html';
  image_url: string;
  link_url: string;
  html: string;
  size: string; // e.g. "728x90"
  enabled: boolean;
}

function publicClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
  );
}

// Public read — RLS only returns enabled slots.
export async function getAdSlots(keys: string[]): Promise<Record<string, AdSlotData>> {
  const { data } = await publicClient()
    .from('ad_slots')
    .select('*')
    .in('slot_key', keys);
  const map: Record<string, AdSlotData> = {};
  for (const row of (data as AdSlotData[]) || []) map[row.slot_key] = row;
  return map;
}
