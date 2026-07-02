'use client';

import Link from 'next/link';
import { Network, Star, Check, AlertTriangle, FileText } from 'lucide-react';
import type { ContentGraph, ClusterNode } from '@/lib/content-graph';
import { blogCategoryStyles } from '@/data/blog';
import { seoScoreText } from '@/lib/utils';

function ClusterCard({ c }: { c: ClusterNode }) {
  const cat = blogCategoryStyles[c.category as keyof typeof blogCategoryStyles];
  return (
    <Link
      href={`/polaris/posts/${c.id}`}
      className="group relative block w-48 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-3 hover:shadow-md hover:border-blue-300 dark:hover:border-blue-700 transition-all"
    >
      <div className="flex items-center justify-between mb-1">
        {cat && <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full ${cat.bg} ${cat.text} ${cat.darkBg} ${cat.darkText}`}>{cat.label}</span>}
        <span className={`text-xs font-bold ${seoScoreText(c.seoScore)}`}>{c.seoScore}</span>
      </div>
      <p className="text-xs font-medium text-gray-900 dark:text-gray-100 line-clamp-2 mb-1.5">{c.title}</p>
      {c.linksToPillar ? (
        <span className="inline-flex items-center gap-1 text-[10px] font-medium text-green-600 dark:text-green-400">
          <Check className="w-3 h-3" /> links to pillar
        </span>
      ) : (
        <span className="inline-flex items-center gap-1 text-[10px] font-medium text-orange-500 dark:text-orange-400">
          <AlertTriangle className="w-3 h-3" /> not linked yet
        </span>
      )}
    </Link>
  );
}

export default function LinkVisualizer({ graph }: { graph: ContentGraph }) {
  const { pillars, unclustered } = graph;
  const hasPillars = pillars.length > 0;

  return (
    <div className="p-6 md:p-8">
      <div className="max-w-5xl">
        <div className="flex items-center gap-2 mb-1">
          <Network className="w-5 h-5 text-blue-600" />
          <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">Content Visualizer</h1>
        </div>
        <p className="text-sm text-gray-400 dark:text-gray-500 mb-8">
          Your pillar → cluster structure. Each pillar sits at the top with its cluster posts below.
          Green = the cluster post actually links up to its pillar; orange = the internal link is still missing.
        </p>

        {!hasPillars && (
          <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-100 dark:border-amber-900 rounded-xl p-5 mb-8">
            <p className="text-sm text-amber-800 dark:text-amber-300">
              No pillar posts yet. Open a post in the editor and toggle <strong>&ldquo;This is a pillar post&rdquo;</strong> to start
              building a pyramid, then assign related posts to it via <strong>&ldquo;Belongs to pillar&rdquo;</strong>.
            </p>
          </div>
        )}

        <div className="space-y-10">
          {pillars.map((pillar) => {
            const cat = blogCategoryStyles[pillar.category as keyof typeof blogCategoryStyles];
            return (
              <div key={pillar.id} className="flex flex-col items-center">
                {/* Pillar (apex) */}
                <Link
                  href={`/polaris/posts/${pillar.id}`}
                  className="group relative w-72 bg-gradient-to-br from-amber-50 to-white dark:from-amber-950/30 dark:to-gray-900 border-2 border-amber-300 dark:border-amber-700 rounded-xl p-4 hover:shadow-lg transition-all"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wide text-amber-600 dark:text-amber-400">
                      <Star className="w-3 h-3" /> Pillar
                    </span>
                    <span className={`text-sm font-bold ${seoScoreText(pillar.seoScore)}`}>{pillar.seoScore}</span>
                  </div>
                  <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">{pillar.title}</p>
                  {cat && <span className="text-xs text-gray-400 dark:text-gray-500">{cat.label}</span>}
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                    {pillar.clusters.length} cluster post{pillar.clusters.length !== 1 ? 's' : ''} ·{' '}
                    {pillar.clusters.filter((c) => c.linksToPillar).length} linked
                  </p>
                </Link>

                {/* Connector */}
                {pillar.clusters.length > 0 && <div className="w-px h-6 bg-gray-300 dark:bg-gray-700" />}

                {/* Clusters */}
                {pillar.clusters.length > 0 ? (
                  <div className="flex flex-wrap justify-center gap-3">
                    {pillar.clusters.map((c) => (
                      <ClusterCard key={c.id} c={c} />
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-gray-400 dark:text-gray-500">No cluster posts assigned yet.</p>
                )}
              </div>
            );
          })}
        </div>

        {/* Unclustered */}
        {unclustered.length > 0 && (
          <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-800">
            <div className="flex items-center gap-2 mb-1">
              <FileText className="w-4 h-4 text-gray-400" />
              <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Unclustered posts ({unclustered.length})</h2>
            </div>
            <p className="text-xs text-gray-400 dark:text-gray-500 mb-4">
              These posts aren&apos;t pillars and aren&apos;t assigned to one. Assign them to a pillar to strengthen your topic clusters.
            </p>
            <div className="flex flex-wrap gap-3">
              {unclustered.map((c) => (
                <ClusterCard key={c.id} c={c} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
