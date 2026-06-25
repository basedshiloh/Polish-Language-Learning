import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface Rating {
  id: string;
  item_key: string;
  item_type: string;
  total_score: number;
  total_votes: number;
}

export interface Comment {
  id: string;
  page_id: string;
  page_type: string;
  author_name: string;
  content: string;
  created_at: string;
}

export async function getRating(itemKey: string): Promise<Rating | null> {
  const { data } = await supabase
    .from('ratings')
    .select('*')
    .eq('item_key', itemKey)
    .single();
  return data;
}

export async function submitRating(itemKey: string, itemType: string, score: number): Promise<Rating | null> {
  const existing = await getRating(itemKey);

  if (existing) {
    const { data } = await supabase
      .from('ratings')
      .update({
        total_score: existing.total_score + score,
        total_votes: existing.total_votes + 1,
        updated_at: new Date().toISOString(),
      })
      .eq('item_key', itemKey)
      .select()
      .single();
    return data;
  }

  const { data } = await supabase
    .from('ratings')
    .insert({
      item_key: itemKey,
      item_type: itemType,
      total_score: score,
      total_votes: 1,
    })
    .select()
    .single();
  return data;
}

export async function getComments(pageId: string): Promise<Comment[]> {
  const { data } = await supabase
    .from('comments')
    .select('*')
    .eq('page_id', pageId)
    .order('created_at', { ascending: false })
    .limit(50);
  return data || [];
}

export async function addComment(pageId: string, pageType: string, authorName: string, content: string): Promise<Comment | null> {
  const { data } = await supabase
    .from('comments')
    .insert({
      page_id: pageId,
      page_type: pageType,
      author_name: authorName.trim().slice(0, 50),
      content: content.trim().slice(0, 2000),
    })
    .select()
    .single();
  return data;
}
