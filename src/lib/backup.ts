import type { SupabaseClient } from '@supabase/supabase-js';

const BUCKET = 'post-backups';

export type BackupType = 'auto' | 'pre-delete' | 'scheduled' | 'manual';

export interface BackupMeta {
  path: string;
  type: BackupType;
  date: string;
  time: string;
  slug: string;
  size?: number;
}

function pad(n: number) {
  return String(n).padStart(2, '0');
}

function nowPath() {
  const d = new Date();
  const date = `${d.getUTCFullYear()}-${pad(d.getUTCMonth() + 1)}-${pad(d.getUTCDate())}`;
  const time = `${pad(d.getUTCHours())}-${pad(d.getUTCMinutes())}-${pad(d.getUTCSeconds())}`;
  return { date, time };
}

async function ensureBucket(client: SupabaseClient): Promise<void> {
  const { error } = await client.storage.createBucket(BUCKET, { public: false });
  if (error && !error.message.toLowerCase().includes('already exist')) {
    console.error('[backup] bucket error:', error.message);
  }
}

export async function saveBackup(
  type: BackupType,
  slug: string,
  data: unknown,
  client: SupabaseClient
): Promise<string | null> {
  try {
    await ensureBucket(client);
    const { date, time } = nowPath();
    const path = `${type}/${date}/${time}_${slug}.json`;
    const { error } = await client.storage
      .from(BUCKET)
      .upload(path, JSON.stringify(data, null, 2), {
        contentType: 'application/json',
        upsert: true,
      });
    if (error) {
      console.error('[backup] upload error:', error.message);
      return null;
    }
    return path;
  } catch (e) {
    console.error('[backup] unexpected error:', e);
    return null;
  }
}

export async function listBackups(
  client: SupabaseClient,
  filterType?: BackupType
): Promise<BackupMeta[]> {
  const types: BackupType[] = filterType
    ? [filterType]
    : ['pre-delete', 'auto', 'scheduled', 'manual'];
  const all: BackupMeta[] = [];

  for (const t of types) {
    const { data: dateFolders } = await client.storage
      .from(BUCKET)
      .list(t, { sortBy: { column: 'name', order: 'desc' } });
    if (!dateFolders) continue;

    for (const folder of dateFolders) {
      if (!folder.name || folder.name === '.emptyFolderPlaceholder') continue;
      const { data: files } = await client.storage
        .from(BUCKET)
        .list(`${t}/${folder.name}`, { sortBy: { column: 'name', order: 'desc' } });
      if (!files) continue;

      for (const file of files) {
        if (!file.name.endsWith('.json')) continue;
        const nameNoExt = file.name.replace('.json', '');
        const underIdx = nameNoExt.indexOf('_');
        if (underIdx === -1) continue;
        const time = nameNoExt.slice(0, underIdx);
        const slug = nameNoExt.slice(underIdx + 1);
        all.push({
          path: `${t}/${folder.name}/${file.name}`,
          type: t,
          date: folder.name,
          time,
          slug,
          size: (file.metadata as Record<string, number> | null)?.size,
        });
      }
    }
  }

  return all.sort((a, b) =>
    `${b.date}${b.time}`.localeCompare(`${a.date}${a.time}`)
  );
}

export async function downloadBackup(
  path: string,
  client: SupabaseClient
): Promise<unknown | null> {
  const { data, error } = await client.storage.from(BUCKET).download(path);
  if (error || !data) return null;
  try {
    return JSON.parse(await data.text());
  } catch {
    return null;
  }
}

export async function deleteOldAutoBackups(
  client: SupabaseClient,
  slug: string,
  keepDays = 30
): Promise<void> {
  try {
    const { data: dateFolders } = await client.storage
      .from(BUCKET)
      .list('auto', { sortBy: { column: 'name', order: 'desc' } });
    if (!dateFolders) return;

    const cutoff = new Date();
    cutoff.setUTCDate(cutoff.getUTCDate() - keepDays);
    const cutoffStr = cutoff.toISOString().slice(0, 10);

    for (const folder of dateFolders) {
      if (!folder.name || folder.name >= cutoffStr) continue;
      const { data: files } = await client.storage
        .from(BUCKET)
        .list(`auto/${folder.name}`);
      if (!files) continue;
      const toDelete = files
        .filter((f) => f.name.endsWith(`_${slug}.json`))
        .map((f) => `auto/${folder.name}/${f.name}`);
      if (toDelete.length > 0) await client.storage.from(BUCKET).remove(toDelete);
    }
  } catch (e) {
    console.error('[backup] prune error:', e);
  }
}
