import type { Post } from '@/lib/types';
import { extractLinks } from '@/lib/link-audit';

export interface ClusterNode {
  id: string;
  title: string;
  slug: string;
  category: string;
  seoScore: number;
  intent: string;
  linksToPillar: boolean; // does this cluster post actually link to its pillar?
}

export interface PillarNode {
  id: string;
  title: string;
  slug: string;
  category: string;
  seoScore: number;
  intent: string;
  clusters: ClusterNode[];
}

export interface ContentGraph {
  pillars: PillarNode[];
  unclustered: ClusterNode[]; // posts with no pillar assignment and not a pillar
}

// Does `post` contain an internal link to /blog/<targetSlug> in its markdown?
function postLinksTo(post: Post, targetSlug: string): boolean {
  const target = `/blog/${targetSlug}`.toLowerCase().replace(/\/$/, '');
  return extractLinks(post.content).some(
    (l) => l.type === 'internal' && l.url.toLowerCase().replace(/\/$/, '') === target
  );
}

function toNode(p: Post, linksToPillar = false): ClusterNode {
  return {
    id: p.id,
    title: p.title,
    slug: p.slug,
    category: p.category,
    seoScore: p.seoScore,
    intent: p.intent,
    linksToPillar,
  };
}

// Score how well a non-pillar post matches a pillar (higher = better fit).
// Used for auto-assignment when no explicit pillarId is set.
function matchScore(post: Post, pillarPost: Post): number {
  let score = 0;
  // Shared primary category is the strongest signal
  if (post.category === pillarPost.category) score += 10;
  // Each shared tag adds 2 points
  const pillarTags = new Set(pillarPost.tags.map((t) => t.toLowerCase()));
  for (const tag of post.tags) {
    if (pillarTags.has(tag.toLowerCase())) score += 2;
  }
  // Focus keyword appearing in the other post's title adds 1
  const pk = pillarPost.focusKeyword?.toLowerCase();
  const ck = post.focusKeyword?.toLowerCase();
  if (pk && post.title.toLowerCase().includes(pk)) score += 1;
  if (ck && pillarPost.title.toLowerCase().includes(ck)) score += 1;
  return score;
}

export function buildContentGraph(posts: Post[]): ContentGraph {
  const byId = new Map(posts.map((p) => [p.id, p]));
  const pillars: PillarNode[] = posts
    .filter((p) => p.isPillar)
    .map((p) => ({
      id: p.id,
      title: p.title,
      slug: p.slug,
      category: p.category,
      seoScore: p.seoScore,
      intent: p.intent,
      clusters: [],
    }));
  const pillarById = new Map(pillars.map((p) => [p.id, p]));
  const pillarPosts = posts.filter((p) => p.isPillar);

  // Pre-compute which pillar(s) each post actually links to in its content.
  // A post can link to multiple pillars; we track the full set.
  const linkedPillarIds = new Map<string, string[]>(); // postId → pillarIds[]
  for (const p of posts) {
    if (p.isPillar) continue;
    const targets: string[] = [];
    for (const pillarPost of pillarPosts) {
      if (postLinksTo(p, pillarPost.slug)) targets.push(pillarPost.id);
    }
    if (targets.length > 0) linkedPillarIds.set(p.id, targets);
  }

  const clustered = new Set<string>(); // postIds already assigned
  const unclustered: ClusterNode[] = [];

  for (const p of posts) {
    if (p.isPillar) continue;

    // 1. Manual pillarId override — highest priority
    if (p.pillarId && pillarById.has(p.pillarId)) {
      pillarById.get(p.pillarId)!.clusters.push(toNode(p, true)); // must link since it's manual
      clustered.add(p.id);
      continue;
    }

    // 2. Inbound-link detection — if this post links to one or more pillars,
    //    cluster it under each of them (a post can appear in multiple clusters)
    const linkTargets = linkedPillarIds.get(p.id);
    if (linkTargets && linkTargets.length > 0) {
      for (const pillarId of linkTargets) {
        pillarById.get(pillarId)!.clusters.push(toNode(p, true));
      }
      clustered.add(p.id);
      continue;
    }

    // 3. Category + tag auto-match as fallback (min score 10 = same primary category)
    let bestPillar: PillarNode | null = null;
    let bestScore = 9;
    for (const pillarPost of pillarPosts) {
      const s = matchScore(p, pillarPost);
      if (s > bestScore) { bestScore = s; bestPillar = pillarById.get(pillarPost.id)!; }
    }
    if (bestPillar) {
      bestPillar.clusters.push(toNode(p, false));
      clustered.add(p.id);
      continue;
    }

    unclustered.push(toNode(p));
  }

  // sort clusters: unlinked first (need attention), then by seo score asc
  for (const pillar of pillars) {
    pillar.clusters.sort((a, b) => Number(a.linksToPillar) - Number(b.linksToPillar) || a.seoScore - b.seoScore);
  }

  return { pillars, unclustered };
}
