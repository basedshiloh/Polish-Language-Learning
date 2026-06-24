'use client';

import { useState, useEffect, useCallback } from 'react';
import { Star } from 'lucide-react';

interface StarRatingProps {
  itemId: string;
  itemType: 'lesson' | 'grammar';
}

const STORAGE_KEY = 'polish-pal-ratings';

function loadRatings(): Record<string, number> {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch { return {}; }
}

export default function StarRating({ itemId, itemType }: StarRatingProps) {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [mounted, setMounted] = useState(false);

  const key = `${itemType}-${itemId}`;

  useEffect(() => {
    const ratings = loadRatings();
    if (ratings[key]) setRating(ratings[key]);
    setMounted(true);
  }, [key]);

  const handleRate = useCallback((value: number) => {
    setRating(value);
    const ratings = loadRatings();
    ratings[key] = value;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(ratings));
  }, [key]);

  if (!mounted) return null;

  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            onClick={() => handleRate(star)}
            onMouseEnter={() => setHover(star)}
            onMouseLeave={() => setHover(0)}
            className="p-0.5 transition-transform hover:scale-110"
            title={`Rate ${star} star${star > 1 ? 's' : ''}`}
          >
            <Star
              className={`w-5 h-5 transition-colors ${
                star <= (hover || rating)
                  ? 'fill-amber-400 text-amber-400'
                  : 'text-gray-300 dark:text-gray-600'
              }`}
            />
          </button>
        ))}
      </div>
      {rating > 0 && (
        <span className="text-xs text-gray-400 dark:text-gray-500">
          You rated this {rating}/5
        </span>
      )}
      {rating === 0 && (
        <span className="text-xs text-gray-400 dark:text-gray-500">
          Rate this {itemType}
        </span>
      )}
    </div>
  );
}
