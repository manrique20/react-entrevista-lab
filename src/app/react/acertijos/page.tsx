'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { reactRiddlesData } from '@/data/reactRiddlesData';
import { ReactRiddlePlayer } from '@/components/react/ReactRiddlePlayer';
import {
  HelpCircle,
  Sparkles,
  CheckCircle2,
  ArrowRight,
  Search,
  Filter,
  ArrowLeft,
  Atom
} from 'lucide-react';

export default function ReactAcertijosPage() {
  const [filterText, setFilterText] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [masteredIds, setMasteredIds] = useState<string[]>([]);

  const categories = ['All', ...Array.from(new Set(reactRiddlesData.map(r => r.topicCategory || 'General')))];

  useEffect(() => {
    const updateProgress = () => {
      try {
        const saved = localStorage.getItem('react_riddles_mastered');
        if (saved) {
          setMasteredIds(JSON.parse(saved));
        }
      } catch {
        // Ignore
      }
    };
    updateProgress();
    window.addEventListener('storage', updateProgress);
    return () => window.removeEventListener('storage', updateProgress);
  }, []);

  const filteredRiddles = reactRiddlesData.filter(r => {
    const matchesCategory = categoryFilter === 'All' || (r.topicCategory || 'General') === categoryFilter;
    if (!matchesCategory) return false;

    if (!filterText) return true;
    const term = filterText.toLowerCase();
    return (
      r.title.toLowerCase().includes(term) ||
      r.id.toLowerCase().includes(term) ||
      r.explanation.toLowerCase().includes(term)
    );
  });

  const percent = Math.round((masteredIds.length / reactRiddlesData.length) * 100);

  return (
    <div className="space-y-8 pb-16">
      {/* Breadcrumb */}
      <div className="flex items-center justify-between">
        <Link
          href="/react"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to React Dashboard</span>
        </Link>
        <Link
          href="/javascript/acertijos"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-600 dark:text-amber-400 hover:underline"
        >
          <span>Go to JavaScript Riddles &gt;</span>
        </Link>
      </div>

      {/* Hero Header */}
      <div className="p-6 sm:p-8 rounded-3xl border border-blue-500/30 bg-gradient-to-r from-blue-500/10 via-card to-card shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1 flex-1 min-w-0">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/15 text-blue-700 dark:text-blue-300 text-xs font-bold uppercase tracking-wider">
              <Atom className="w-3.5 h-3.5 animate-spin-slow" />
              <span>Mental Model Simulator</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black text-foreground leading-tight break-words">
              React Riddles: What is rendered or logged?
            </h1>
            <p className="text-xs sm:text-sm text-muted max-w-2xl leading-relaxed">
              Test yourself on the most notorious React interview puzzles: key reconciliation, Automatic Batching, stale closures in timers, and rendering falsy values.
            </p>
          </div>

          {/* Progress Card */}
          <div className="p-4 rounded-2xl bg-card border border-border/80 shadow-xs shrink-0 sm:text-right">
            <div className="text-xs text-muted font-medium mb-1 flex items-center gap-1.5 sm:justify-end">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
              <span>Riddles Mastered</span>
            </div>
            <div className="text-2xl font-black text-blue-600 dark:text-blue-400 font-mono">
              {masteredIds.length} / {reactRiddlesData.length}
            </div>
            <div className="w-36 h-2 bg-muted rounded-full mt-2 overflow-hidden sm:ml-auto">
              <div
                className="h-full bg-gradient-to-r from-blue-600 to-cyan-500 transition-all duration-300"
                style={{ width: `${percent}%` }}
              />
            </div>
          </div>
        </div>

        {/* Search & Filters */}
        <div className="pt-4 border-t border-border/60 flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={filterText}
              onChange={e => setFilterText(e.target.value)}
              placeholder="Search by concept (batching, key, closure, strictmode)..."
              className="w-full pl-9 pr-4 py-2 rounded-xl border border-border/80 bg-background text-xs focus:outline-none focus:border-blue-500 transition-colors placeholder:text-muted"
            />
          </div>

          <div className="flex flex-wrap gap-1.5">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  categoryFilter === cat
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'border border-border/80 hover:bg-muted text-muted hover:text-foreground'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Riddles List */}
      <div className="space-y-6">
        {filteredRiddles.length === 0 ? (
          <div className="p-12 text-center border rounded-2xl bg-card space-y-2">
            <p className="text-sm font-semibold text-foreground">No riddles found</p>
            <p className="text-xs text-muted">Try a different search query or reset the filters.</p>
          </div>
        ) : (
          filteredRiddles.map((riddle, idx) => (
            <ReactRiddlePlayer key={riddle.id} riddle={riddle} index={idx} />
          ))
        )}
      </div>
    </div>
  );
}

