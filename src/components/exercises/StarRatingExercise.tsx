'use client';

import React, { useState, useRef } from 'react';
import { Star, RotateCcw, CheckCircle2, Sparkles, Code2, Keyboard, Eye } from 'lucide-react';
import confetti from 'canvas-confetti';

interface StarRatingProps {
  maxStars?: number;
  initialRating?: number;
  onChange?: (rating: number) => void;
}

export function StarRatingExercise({ maxStars = 5, initialRating = 0, onChange }: StarRatingProps) {
  const [rating, setRating] = useState<number>(initialRating);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [focusedIndex, setFocusedIndex] = useState<number>(-1);
  const [showCode, setShowCode] = useState(false);
  const starRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const LABELS: Record<number, string> = {
    1: '1 star: Poor / Unsatisfactory',
    2: '2 stars: Fair / Needs improvement',
    3: '3 stars: Good / Meets expectations',
    4: '4 stars: Very Good / Recommended',
    5: '5 stars: Excellent / Staff Level'
  };

  const handleSelect = (val: number) => {
    setRating(val);
    onChange?.(val);
    if (val === 5) {
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    let nextIndex = index;

    switch (e.key) {
      case 'ArrowRight':
      case 'ArrowUp':
        e.preventDefault();
        nextIndex = Math.min(maxStars - 1, index + 1);
        break;
      case 'ArrowLeft':
      case 'ArrowDown':
        e.preventDefault();
        nextIndex = Math.max(0, index - 1);
        break;
      case 'Home':
        e.preventDefault();
        nextIndex = 0;
        break;
      case 'End':
        e.preventDefault();
        nextIndex = maxStars - 1;
        break;
      case ' ':
      case 'Enter':
        e.preventDefault();
        handleSelect(index + 1);
        return;
      default:
        return;
    }

    starRefs.current[nextIndex]?.focus();
    setFocusedIndex(nextIndex);
    handleSelect(nextIndex + 1);
  };

  const activeDisplayRating = hoverRating > 0 ? hoverRating : rating;

  return (
    <div className="space-y-6">
      {/* Problem Explanation */}
      <div className="p-4 rounded-2xl bg-muted/30 border border-border/80 space-y-1.5">
        <div className="flex items-center gap-2 text-xs font-bold text-foreground">
          <Keyboard className="w-4 h-4 text-amber-500" />
          <span>Accessibility Challenge (WAI-ARIA) in Custom Components</span>
        </div>
        <p className="text-xs text-muted leading-relaxed">
          A rating control is not just a set of SVG icons with <code>onClick</code>. Senior interviewers evaluate whether you implement the semantic <code>role=&quot;radiogroup&quot;</code> pattern with bidirectional keyboard navigation (arrows, Home, End, and Space).
        </p>
      </div>

      {/* Interactive Star Rating Component */}
      <div className="rounded-2xl border border-border/80 bg-card p-6 sm:p-8 space-y-6 shadow-sm text-center">
        <div className="space-y-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-muted font-mono">
            Candidate Evaluation in Technical Interview
          </span>
          <h3 className="text-xl sm:2xl font-black text-foreground">
            How do you rate the technical response?
          </h3>
        </div>

        {/* WAI-ARIA RadioGroup Container */}
        <div
          role="radiogroup"
          aria-label="Rating from 1 to 5 stars"
          className="inline-flex items-center justify-center gap-2 p-3 rounded-2xl bg-muted/20 border border-border/70"
          onMouseLeave={() => setHoverRating(0)}
        >
          {Array.from({ length: maxStars }).map((_, idx) => {
            const starValue = idx + 1;
            const isFilled = starValue <= activeDisplayRating;
            const isSelected = starValue === rating;

            return (
              <button
                key={starValue}
                ref={el => {
                  starRefs.current[idx] = el;
                }}
                type="button"
                role="radio"
                aria-checked={isSelected}
                aria-label={`${starValue} of ${maxStars} stars: ${LABELS[starValue] || ''}`}
                tabIndex={rating === starValue || (rating === 0 && idx === 0) ? 0 : -1}
                onClick={() => handleSelect(starValue)}
                onMouseEnter={() => setHoverRating(starValue)}
                onKeyDown={e => handleKeyDown(e, idx)}
                className={`p-2 rounded-xl transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-amber-500 transform hover:scale-125 active:scale-95 ${
                  isFilled ? 'text-amber-500' : 'text-slate-300 dark:text-slate-700 hover:text-amber-300'
                }`}
              >
                <Star
                  className={`w-8 h-8 transition-colors ${
                    isFilled ? 'fill-amber-400 stroke-amber-500' : 'stroke-current'
                  }`}
                />
              </button>
            );
          })}
        </div>

        {/* Semantic Label for Active Rating */}
        <div className="space-y-1 min-h-[48px]">
          <p className="text-sm font-bold text-foreground transition-all">
            {activeDisplayRating > 0 ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-300">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{LABELS[activeDisplayRating] || `${activeDisplayRating} stars`}</span>
              </span>
            ) : (
              <span className="text-muted text-xs">Hover or use keyboard arrow keys to rate</span>
            )}
          </p>
          {hoverRating > 0 && hoverRating !== rating && (
            <p className="text-[11px] text-muted italic">
              (Previewing {hoverRating} stars • Click to confirm)
            </p>
          )}
        </div>

        {/* Reset Button */}
        <div className="flex items-center justify-center gap-3 pt-2">
          <button
            onClick={() => {
              setRating(0);
              setHoverRating(0);
            }}
            disabled={rating === 0}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-border/80 text-xs font-semibold text-muted hover:text-foreground hover:bg-muted transition-colors disabled:opacity-40"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset rating</span>
          </button>
        </div>
      </div>

      {/* Accessibility State Inspector */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
        <div className="p-3.5 rounded-xl border border-border/80 bg-card space-y-1">
          <span className="text-[10px] text-muted font-mono uppercase">Committed Rating</span>
          <p className="text-base font-bold text-foreground">
            {rating > 0 ? `${rating} / ${maxStars}` : 'Unrated (0)'}
          </p>
        </div>

        <div className="p-3.5 rounded-xl border border-border/80 bg-card space-y-1">
          <span className="text-[10px] text-muted font-mono uppercase">Temporary Hover</span>
          <p className="text-base font-bold text-foreground">
            {hoverRating > 0 ? `${hoverRating} stars` : 'Inactive'}
          </p>
        </div>

        <div className="p-3.5 rounded-xl border border-border/80 bg-card space-y-1">
          <span className="text-[10px] text-muted font-mono uppercase">WAI-ARIA Pattern</span>
          <p className="text-base font-bold text-emerald-600 dark:text-emerald-400">
            role=&quot;radiogroup&quot; OK
          </p>
        </div>
      </div>

      {/* Code Snippet */}
      <div className="p-4 rounded-2xl bg-card border border-border/80 space-y-2">
        <button
          onClick={() => setShowCode(!showCode)}
          className="flex items-center gap-1.5 text-xs text-primary font-bold hover:underline"
        >
          <Code2 className="w-4 h-4" />
          <span>{showCode ? 'Hide implementation code' : 'View accessible WAI-ARIA implementation'}</span>
        </button>

        {showCode && (
          <div className="rounded-xl bg-slate-950 p-4 border border-slate-800 text-slate-100 font-mono text-xs overflow-x-auto shadow-inner mt-2">
            <pre className="text-amber-200/90 leading-relaxed">
{`// Accessible WAI-ARIA Star Rating implementation:
<div role="radiogroup" aria-label="Rating">
  {Array.from({ length: 5 }).map((_, idx) => (
    <button
      key={idx}
      role="radio"
      aria-checked={rating === idx + 1}
      aria-label={\`\${idx + 1} of 5 stars\`}
      tabIndex={rating === idx + 1 ? 0 : -1}
      onKeyDown={(e) => {
        if (e.key === 'ArrowRight') setRating(r => Math.min(5, r + 1));
        if (e.key === 'ArrowLeft') setRating(r => Math.max(1, r - 1));
      }}
      onClick={() => setRating(idx + 1)}
    >
      <Star filled={idx + 1 <= (hoverRating || rating)} />
    </button>
  ))}
</div>`}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
