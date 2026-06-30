import { getAllPostsAdmin } from '@/lib/posts';
import { buildContentGraph } from '@/lib/content-graph';
import LinkVisualizer from '@/components/cms/LinkVisualizer';

export const dynamic = 'force-dynamic';

export default async function VisualizerPage() {
  const posts = await getAllPostsAdmin();
  const graph = buildContentGraph(posts);
  return <LinkVisualizer graph={graph} />;
}
