import { getAllPostsAdmin } from '@/lib/posts';
import { lessons } from '@/data/lessons';
import { grammarTopics } from '@/data/grammar';
import { auditFromText, type LinkAudit } from '@/lib/link-audit';
import LinkManager from '@/components/cms/LinkManager';

export const dynamic = 'force-dynamic';

export default async function ManagerPage() {
  const posts = await getAllPostsAdmin();

  const audits: LinkAudit[] = [
    ...posts.map((p) =>
      auditFromText(p.content, { id: p.id, title: p.title, kind: 'Post', url: `/blog/${p.slug}` })
    ),
    ...lessons.map((l) =>
      auditFromText(JSON.stringify(l), { id: l.id, title: l.title, kind: 'Lesson', url: `/lessons/${l.id}` })
    ),
    ...grammarTopics.map((g) =>
      auditFromText(JSON.stringify(g), { id: g.id, title: g.title, kind: 'Grammar', url: `/grammar/${g.id}` })
    ),
  ];

  return <LinkManager audits={audits} />;
}
