'use client';

import { useState, useEffect, useCallback } from 'react';
import { Star } from 'lucide-react';
import { getRating, submitRating } from '@/lib/supabase';

interface StarRatingProps {
  itemId: string;
  itemType: 'lesson' | 'grammar';
}

const LOCAL_KEY = 'polish-pal-my-ratings';

function getMyRatings(): Record<string, number> {
  try { return JSON.parse(localStorage.getItem(LOCAL_KEY) || '{}'); } catch { return {}; }
}

function saveMyRating(key: string, value: number) {
  const ratings = getMyRatings();
  ratings[key] = value;
  localStorage.setItem(LOCAL_KEY, JSON.stringify(ratings));
}

export default function StarRating({ itemId, itemType }: StarRatingProps) {
  const [myRating, setMyRating] = useState(0);
  const [avgRating, setAvgRating] = useState(0);
  const [totalVotes, setTotalVotes] = useState(0);
  const [hover, setHover] = useState(0);
  const [mounted, setMounted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const key = `${itemType}-${itemId}`;

  useEffect(() => {
    setMounted(true);
    const my = getMyRatings();
    if (my[key]) setMyRating(my[key]);

    getRating(key).then((r) => {
      if (r) {
        setAvgRating(r.total_votes > 0 ? r.total_score / r.total_votes : 0);
        setTotalVotes(r.total_votes);
      }
    }).catch(() => {});
  }, [key]);

  const handleRate = useCallback(async (value: number) => {
    if (submitting) return;
    const already = getMyRatings()[key];
    if (already) return;

    setMyRating(value);
    saveMyRating(key, value);
    setSubmitting(true);

    try {
      const r = await submitRating(key, itemType, value);
      if (r) {
        setAvgRating(r.total_votes > 0 ? r.total_score / r.total_votes : 0);
        setTotalVotes(r.total_votes);
      }
    } catch {}
    setSubmitting(false);
  }, [key, itemType, submitting]);

  if (!mounted) return null;

  const hasRated = myRating > 0;

  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-2">
      <div className="flex items-center gap-0.5" role="group" aria-label={`Rate this ${itemType}`}>
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            onClick={() => handleRate(star)}
            onMouseEnter={() => !hasRated && setHover(star)}
            onMouseLeave={() => setHover(0)}
            disabled={hasRated || submitting}
            className={`p-1 rounded-lg transition-transform ${hasRated ? 'cursor-default' : 'hover:scale-115 active:scale-95'}`}
            title={hasRated ? `You rated ${myRating}/5` : `Rate ${star} star${star > 1 ? 's' : ''}`}
            aria-label={hasRated ? `You rated ${myRating} out of 5` : `Rate ${star} star${star > 1 ? 's' : ''}`}
          >
            <Star
              strokeWidth={2.2}
              className={`w-6 h-6 transition-colors ${
                star <= (hover || myRating)
                  ? 'fill-sun text-sun-edge'
                  : 'text-line-2'
              }`}
            />
          </button>
        ))}
      </div>
      <div className="flex items-center gap-2 text-xs font-bold text-muted">
        {hasRated && <span>You rated {myRating}/5</span>}
        {totalVotes > 0 && (
          <span>
            {hasRated ? '·' : ''} {avgRating.toFixed(1)} avg ({totalVotes} vote{totalVotes !== 1 ? 's' : ''})
          </span>
        )}
        {!hasRated && totalVotes === 0 && <span>Rate this {itemType}</span>}
      </div>
    </div>
  );
}
