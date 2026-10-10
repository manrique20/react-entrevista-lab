'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { TOPICS } from '@/data/topicsData';
import { allJsTopics } from '@/data/javascript/topicsData';
import { INTERVIEW_QUESTIONS } from '@/data/interviewQuestions';
import {
  RotateCcw,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ArrowLeft,
  Atom,
  Terminal,
  Bookmark,
  Layers,
  HelpCircle,
  TrendingUp,
  Brain,
  Shuffle
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface FlashcardItem {
  id: string;
  track: 'react' | 'javascript';
  category: string;
  question: string;
  answerSummary: string;
  keyTakeaway: string;
  traps: string[];
  codeSnippet?: string;
  level: number;
}

export function FlashcardReviewer() {
  const [trackFilter, setTrackFilter] = useState<'all' | 'react' | 'javascript'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'unreviewed' | 'mastered' | 'review_needed'>('all');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  // Review status stored in localStorage: cardId -> 'mastered' | 'good' | 'hard'
  const [ratings, setRatings] = useState<Record<string, 'mastered' | 'good' | 'hard'>>({});

  useEffect(() => {
    try {
      const saved = localStorage.getItem('flashcards_ratings');
      if (saved) {
        setRatings(JSON.parse(saved));
      }
    } catch {
      // Fallback
    }
  }, []);

  // Build unified deck
  const allCards: FlashcardItem[] = useMemo(() => {
    const list: FlashcardItem[] = [];

    // 1. React Topics
    TOPICS.forEach(t => {
      list.push({
        id: `react-t-${t.id}`,
        track: 'react',
        category: t.levelTitle,
        question: `What is and how does it work: ${t.title}?`,
        answerSummary: t.summary,
        keyTakeaway: t.keyTakeaway,
        traps: t.commonTraps,
        codeSnippet: t.codeSnippet,
        level: t.level
      });
    });

    // 2. React Senior Questions
    INTERVIEW_QUESTIONS.forEach(q => {
      list.push({
        id: `react-q-${q.id}`,
        track: 'react',
        category: q.category,
        question: q.question,
        answerSummary: q.seniorAnswer.slice(0, 240) + '...',
        keyTakeaway: q.seniorAnswer.split('\n')[0],
        traps: q.trapsAndRedFlags,
        codeSnippet: q.codeExample,
        level: 5
      });
    });

    // 3. JavaScript Topics
    allJsTopics.forEach(j => {
      list.push({
        id: `js-t-${j.id}`,
        track: 'javascript',
        category: j.levelTitle,
        question: j.question,
        answerSummary: j.shortAnswer,
        keyTakeaway: j.seniorTip || j.explanation.slice(0, 180) + '...',
        traps: ['Watch out for loose coercion', 'Verify Strict Mode behavior'],
        codeSnippet: j.codeSnippet,
        level: j.level
      });
    });

    return list;
  }, []);

  // Filtered deck
  const filteredCards = useMemo(() => {
    return allCards.filter(c => {
      if (trackFilter !== 'all' && c.track !== trackFilter) return false;

      const cardRating = ratings[c.id];
      if (statusFilter === 'unreviewed' && cardRating !== undefined) return false;
      if (statusFilter === 'mastered' && cardRating !== 'mastered') return false;
      if (statusFilter === 'review_needed' && cardRating !== 'hard') return false;

      return true;
    });
  }, [allCards, trackFilter, statusFilter, ratings]);

  const currentCard: FlashcardItem | undefined = filteredCards[currentIndex];

  const handleRate = useCallback((rating: 'mastered' | 'good' | 'hard') => {
    if (!currentCard) return;

    const nextRatings = { ...ratings, [currentCard.id]: rating };
    setRatings(nextRatings);
    try {
      localStorage.setItem('flashcards_ratings', JSON.stringify(nextRatings));
    } catch {
      // Fallback
    }

    if (rating === 'mastered') {
      try {
        confetti({ particleCount: 20, spread: 40, origin: { y: 0.8 } });
      } catch {
        // Fallback
      }
    }

    // Advance to next card
    setIsFlipped(false);
    if (currentIndex < filteredCards.length - 1) {
      setCurrentIndex(prev => prev + 1);
    }
  }, [currentCard, currentIndex, filteredCards.length, ratings]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      if (e.code === 'Space') {
        e.preventDefault();
        setIsFlipped(prev => !prev);
      } else if (e.code === 'ArrowRight') {
        e.preventDefault();
        setIsFlipped(false);
        setCurrentIndex(prev => Math.min(filteredCards.length - 1, prev + 1));
      } else if (e.code === 'ArrowLeft') {
        e.preventDefault();
        setIsFlipped(false);
        setCurrentIndex(prev => Math.max(0, prev - 1));
      } else if (e.key === '1') {
        handleRate('hard');
      } else if (e.key === '2') {
        handleRate('good');
      } else if (e.key === '3') {
        handleRate('mastered');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [filteredCards.length, handleRate]);

  const masteredCount = Object.values(ratings).filter(r => r === 'mastered').length;
  const hardCount = Object.values(ratings).filter(r => r === 'hard').length;
  const progressPercent = Math.round((Object.keys(ratings).length / allCards.length) * 100);

  return (
    <div className="space-y-6">
      {/* Top Filter Bar & Metrics */}
      <div className="bg-card border border-card-border rounded-2xl p-4 md:p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Track selector */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-muted/60 border text-xs font-bold">
          <button
            onClick={() => {
              setTrackFilter('all');
              setCurrentIndex(0);
              setIsFlipped(false);
            }}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              trackFilter === 'all' ? 'bg-background text-foreground shadow-xs' : 'text-muted-foreground'
            }`}
          >
            All ({allCards.length})
          </button>
          <button
            onClick={() => {
              setTrackFilter('react');
              setCurrentIndex(0);
              setIsFlipped(false);
            }}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors ${
              trackFilter === 'react' ? 'bg-blue-600 text-white shadow-xs' : 'text-muted-foreground'
            }`}
          >
            <Atom className="w-3.5 h-3.5" />
            <span>React</span>
          </button>
          <button
            onClick={() => {
              setTrackFilter('javascript');
              setCurrentIndex(0);
              setIsFlipped(false);
            }}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors ${
              trackFilter === 'javascript' ? 'bg-amber-500 text-slate-950 font-black shadow-xs' : 'text-muted-foreground'
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>JavaScript</span>
          </button>
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-2 text-xs font-semibold">
          <select
            value={statusFilter}
            onChange={e => {
              setStatusFilter(e.target.value as typeof statusFilter);
              setCurrentIndex(0);
              setIsFlipped(false);
            }}
            className="p-2 rounded-xl border border-card-border bg-card text-foreground text-xs focus:outline-none"
          >
            <option value="all">All Flashcards</option>
            <option value="unreviewed">Unreviewed</option>
            <option value="mastered">Mastered ({masteredCount})</option>
            <option value="review_needed">Needs Review ({hardCount})</option>
          </select>
        </div>

        {/* Global Progress Pill */}
        <div className="flex items-center gap-3 text-xs font-mono">
          <div className="text-right">
            <span className="text-muted-foreground text-[11px] block">Review Progress</span>
            <span className="font-bold text-foreground">
              {Object.keys(ratings).length} / {allCards.length} ({progressPercent}%)
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 flex items-center justify-center font-bold">
            <Brain className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Main Flashcard Body */}
      {filteredCards.length === 0 ? (
        <div className="text-center p-12 bg-card border border-card-border rounded-2xl space-y-3">
          <p className="text-sm font-semibold text-muted-foreground">
            No flashcards match the selected filters.
          </p>
          <button
            onClick={() => {
              setTrackFilter('all');
              setStatusFilter('all');
              setCurrentIndex(0);
            }}
            className="px-4 py-2 rounded-xl bg-primary text-white text-xs font-bold"
          >
            View all flashcards
          </button>
        </div>
      ) : currentCard ? (
        <div className="space-y-6">
          {/* Header navigation bar */}
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center gap-2">
              <span className="font-bold font-mono text-foreground">
                Card {currentIndex + 1} of {filteredCards.length}
              </span>
              <span>•</span>
              <span className="uppercase text-[10px] px-2 py-0.5 rounded-full bg-muted font-bold text-muted-foreground">
                {currentCard.category}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="hidden sm:inline text-[11px] text-muted-foreground">
                [Space]: Flip | [1]: Hard | [2]: Good | [3]: Mastered
              </span>
            </div>
          </div>

          {/* Interactive Card */}
          <div
            onClick={() => setIsFlipped(!isFlipped)}
            className="cursor-pointer min-h-[380px] rounded-3xl border border-card-border bg-gradient-to-b from-card via-card to-card-hover/30 p-8 md:p-12 flex flex-col justify-between shadow-md hover:shadow-lg hover:border-primary/40 transition-all select-none relative overflow-hidden group"
          >
            {/* Front indicator / Back indicator */}
            <div className="flex items-center justify-between border-b border-card-border/60 pb-4">
              <div className="flex items-center gap-2">
                <span
                  className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                    currentCard.track === 'react'
                      ? 'bg-blue-500/15 text-blue-600 dark:text-blue-400'
                      : 'bg-amber-500/15 text-amber-700 dark:text-amber-300'
                  }`}
                >
                  {currentCard.track === 'react' ? 'React 19' : 'JavaScript Core'}
                </span>
                <span className="text-[10px] font-semibold text-muted-foreground">
                  Level {currentCard.level}
                </span>
              </div>

              <span className="text-xs font-bold text-cyan-600 dark:text-cyan-400 flex items-center gap-1 group-hover:underline">
                <RotateCcw className="w-3.5 h-3.5" />
                <span>{isFlipped ? 'Back to Front' : 'Click to Reveal Answer'}</span>
              </span>
            </div>

            {/* Content Area */}
            <div className="py-6 space-y-4">
              {!isFlipped ? (
                /* FRONT VIEW */
                <div className="space-y-4 text-center sm:text-left">
                  <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Technical Question:
                  </div>
                  <h3 className="text-2xl md:text-3xl font-extrabold text-foreground leading-snug">
                    {currentCard.question}
                  </h3>
                  <p className="text-xs md:text-sm text-muted-foreground pt-4">
                    Take 5 seconds to formulate your senior-level answer before flipping.
                  </p>
                </div>
              ) : (
                /* BACK VIEW */
                <div className="space-y-4 animate-fadeIn">
                  <div className="space-y-2">
                    <div className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4" />
                      <span>Senior Answer &amp; Key Takeaway:</span>
                    </div>
                    <p className="text-sm md:text-base font-semibold text-foreground leading-relaxed">
                      {currentCard.answerSummary}
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-xs text-foreground/90 leading-relaxed">
                    <strong>Key Focus:</strong> {currentCard.keyTakeaway}
                  </div>

                  {currentCard.traps && currentCard.traps.length > 0 && (
                    <div className="text-xs text-muted-foreground">
                      <span className="font-bold text-rose-500">Traps to Avoid: </span>
                      {currentCard.traps.slice(0, 2).join(' • ')}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Bottom Card Footer */}
            <div className="border-t border-card-border/60 pt-4 flex items-center justify-between text-xs text-muted-foreground">
              <span>Click card or press Spacebar</span>
              {ratings[currentCard.id] && (
                <span
                  className={`font-semibold capitalize px-2 py-0.5 rounded-full text-[10px] ${
                    ratings[currentCard.id] === 'mastered'
                      ? 'bg-emerald-500/20 text-emerald-500'
                      : ratings[currentCard.id] === 'good'
                      ? 'bg-blue-500/20 text-blue-500'
                      : 'bg-rose-500/20 text-rose-500'
                  }`}
                >
                  Status: {ratings[currentCard.id]}
                </span>
              )}
            </div>
          </div>

          {/* Rating Controls */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            {/* Prev / Next buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setIsFlipped(false);
                  setCurrentIndex(prev => Math.max(0, prev - 1));
                }}
                disabled={currentIndex === 0}
                className="px-4 py-2.5 rounded-xl border border-card-border hover:bg-card-hover disabled:opacity-30 disabled:pointer-events-none text-xs font-semibold text-foreground flex items-center gap-1.5"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Previous</span>
              </button>

              <button
                onClick={() => {
                  setIsFlipped(false);
                  setCurrentIndex(prev => Math.min(filteredCards.length - 1, prev + 1));
                }}
                disabled={currentIndex === filteredCards.length - 1}
                className="px-4 py-2.5 rounded-xl border border-card-border hover:bg-card-hover disabled:opacity-30 disabled:pointer-events-none text-xs font-semibold text-foreground flex items-center gap-1.5"
              >
                <span>Next</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Self-Rating evaluation buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleRate('hard')}
                className="px-4 py-2.5 rounded-xl border border-rose-500/30 text-rose-500 hover:bg-rose-500/10 text-xs font-bold transition-colors"
                title="Shortcut: 1"
              >
                1. Hard (Repeat)
              </button>
              <button
                onClick={() => handleRate('good')}
                className="px-4 py-2.5 rounded-xl border border-blue-500/30 text-blue-500 hover:bg-blue-500/10 text-xs font-bold transition-colors"
                title="Shortcut: 2"
              >
                2. Good
              </button>
              <button
                onClick={() => handleRate('mastered')}
                className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-colors shadow-sm"
                title="Shortcut: 3"
              >
                3. Mastered!
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

