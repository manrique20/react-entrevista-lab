'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { jsExercisesData } from '@/data/javascript/exercisesData';
import { JsExerciseTester } from '@/components/javascript/JsExerciseTester';
import {
  Code2,
  Sparkles,
  CheckCircle2,
  ArrowRight,
  Search,
  Filter,
  ArrowLeft,
  CheckSquare
} from 'lucide-react';

const categories = [
  'All',
  'Functional',
  'Asynchronous',
  'Data Structures',
  'Algorithms',
  'Polyfills',
  'Objects'
];

export default function JsExercisesPage() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [filterText, setFilterText] = useState('');
  const [completedIds, setCompletedIds] = useState<string[]>([]);

  useEffect(() => {
    const updateProgress = () => {
      try {
        const saved = localStorage.getItem('js_exercises_completed');
        if (saved) {
          setCompletedIds(JSON.parse(saved));
        }
      } catch {
        // Ignore
      }
    };
    updateProgress();
    window.addEventListener('storage', updateProgress);
    return () => window.removeEventListener('storage', updateProgress);
  }, []);

  const filteredExercises = jsExercisesData.filter(ex => {
    const matchesCat = selectedCategory === 'All' || ex.category === selectedCategory;
    const term = filterText.toLowerCase();
    const matchesText =
      !filterText ||
      ex.title.toLowerCase().includes(term) ||
      ex.id.toLowerCase().includes(term) ||
      ex.description.toLowerCase().includes(term);
    return matchesCat && matchesText;
  });

  const percent = Math.round((completedIds.length / jsExercisesData.length) * 100);

  return (
    <div className="space-y-8 pb-16">
      {/* Breadcrumb */}
      <div className="flex items-center justify-between">
        <Link
          href="/javascript"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to JavaScript Dashboard</span>
        </Link>
      </div>

      {/* Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl border border-amber-500/30 bg-gradient-to-r from-amber-500/10 via-card to-card shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1 flex-1 min-w-0">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 text-amber-700 dark:text-amber-300 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Live Coding Test Bench</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black text-foreground leading-tight break-words">
              {jsExercisesData.length} Implementation Challenges
            </h1>
          </div>

          {/* Progress Pill */}
          <div className="p-4 rounded-2xl bg-card border border-border/80 shadow-xs shrink-0 sm:text-right">
            <div className="text-xs text-muted font-medium mb-1 flex items-center gap-1.5 sm:justify-end">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
              <span>Challenges Completed</span>
            </div>
            <div className="text-xl font-black text-foreground">
              {completedIds.length} / {jsExercisesData.length} ({percent}%)
            </div>
            <div className="w-full sm:w-44 h-2 bg-muted rounded-full overflow-hidden mt-2">
              <div
                className="h-full bg-amber-500 transition-all duration-300"
                style={{ width: `${percent}%` }}
              />
            </div>
          </div>
        </div>

        <p className="text-xs sm:text-sm text-muted leading-relaxed max-w-5xl break-words">
          Write from memory and master every algorithmic nuance across canonical challenges: debounce, throttle, circular deepClone, LRU cache, promise pool, curry, memoize, and performance optimizations.
        </p>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <div className="relative flex-1 max-w-sm">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
            <input
              type="text"
              value={filterText}
              onChange={(e) => setFilterText(e.target.value)}
              placeholder="Search challenges (debounce, LRU, curry)..."
              className="w-full pl-9 pr-4 py-2 rounded-xl border border-border/80 bg-card text-xs text-foreground placeholder:text-muted focus:outline-none focus:border-amber-500 transition-colors"
            />
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all border ${
                  selectedCategory === cat
                    ? 'bg-amber-500/15 border-amber-500/40 text-amber-700 dark:text-amber-300 font-bold'
                    : 'border-border/70 hover:bg-muted text-muted hover:text-foreground'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grid of Exercises */}
      <div className="space-y-6">
        <div className="flex items-center justify-between text-xs text-muted font-semibold">
          <span>Showing {filteredExercises.length} of {jsExercisesData.length} challenges</span>
          <span>Execute unit tests live in your browser</span>
        </div>

        {filteredExercises.length === 0 ? (
          <div className="p-10 rounded-2xl border border-dashed text-center text-xs text-muted">
            No challenges match your selected filters.
          </div>
        ) : (
          filteredExercises.map((exercise, idx) => (
            <JsExerciseTester key={exercise.id} exercise={exercise} index={idx} />
          ))
        )}
      </div>

      {/* Footer CTA */}
      <div className="p-6 rounded-2xl border border-border/80 bg-card flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-sm font-bold text-foreground">Finished practicing these implementations?</h3>
          <p className="text-xs text-muted">Check out your comprehensive technical interview review checklist.</p>
        </div>
        <Link
          href="/javascript/checklist"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 text-white text-xs font-bold shadow-md shadow-emerald-500/20 hover:opacity-95 transition-all shrink-0"
        >
          <CheckSquare className="w-4 h-4" />
          <span>View JavaScript Review Checklist</span>
        </Link>
      </div>
    </div>
  );
}
