'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { jsRiddlesData } from '@/data/javascript/riddlesData';
import { RiddlePlayer } from '@/components/javascript/RiddlePlayer';
import {
  HelpCircle,
  Sparkles,
  CheckCircle2,
  ArrowRight,
  Search,
  Filter,
  ArrowLeft
} from 'lucide-react';

export default function AcertijosPage() {
  const [filterText, setFilterText] = useState('');
  const [masteredIds, setMasteredIds] = useState<string[]>([]);

  useEffect(() => {
    const updateProgress = () => {
      try {
        const saved = localStorage.getItem('js_riddles_mastered');
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

  const filteredRiddles = jsRiddlesData.filter(r => {
    if (!filterText) return true;
    const term = filterText.toLowerCase();
    return (
      r.title.toLowerCase().includes(term) ||
      r.id.toLowerCase().includes(term) ||
      r.explanation.toLowerCase().includes(term)
    );
  });

  const percent = Math.round((masteredIds.length / jsRiddlesData.length) * 100);

  return (
    <div className="space-y-8 pb-16">
      {/* Breadcrumb */}
      <div className="flex items-center justify-between">
        <Link
          href="/javascript"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to JS Dashboard</span>
        </Link>
      </div>

      {/* Hero Header */}
      <div className="p-6 sm:p-8 rounded-3xl border border-amber-500/30 bg-gradient-to-r from-amber-500/10 via-card to-card shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1 flex-1 min-w-0">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 text-amber-700 dark:text-amber-300 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Interview Simulator</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black text-foreground leading-tight break-words">
              Riddles: What does this code log?
            </h1>
          </div>

          {/* Progress Card */}
          <div className="p-4 rounded-2xl bg-card border border-border/80 shadow-xs shrink-0 sm:text-right">
            <div className="text-xs text-muted font-medium mb-1 flex items-center gap-1.5 sm:justify-end">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
              <span>Riddles Mastered</span>
            </div>
            <div className="text-xl font-black text-foreground">
              {masteredIds.length} / {jsRiddlesData.length} ({percent}%)
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
          The canonical JavaScript interview riddles that interviewers use to distinguish candidates who simply memorize syntax from those with a deep grasp of the execution engine (hoisting, TDZ, implicit coercion, microtasks, callbacks, and losing <code className="text-amber-500 font-bold">this</code>).
        </p>

        {/* Filter Input */}
        <div className="pt-2">
          <div className="relative max-w-md">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
            <input
              type="text"
              value={filterText}
              onChange={(e) => setFilterText(e.target.value)}
              placeholder="Search by concept (hoisting, timers, parseInt, null)..."
              className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-border/80 bg-card text-xs text-foreground placeholder:text-muted focus:outline-none focus:border-amber-500 transition-colors"
            />
          </div>
        </div>
      </div>

      {/* Lista de Acertijos */}
      <div className="space-y-6">
        <div className="flex items-center justify-between text-xs text-muted font-semibold">
          <span>Showing {filteredRiddles.length} of {jsRiddlesData.length} riddles</span>
          <span>Test your prediction before revealing</span>
        </div>

        {filteredRiddles.length === 0 ? (
          <div className="p-10 rounded-2xl border border-dashed text-center text-xs text-muted">
            No riddles found for &quot;{filterText}&quot;.
          </div>
        ) : (
          filteredRiddles.map((riddle, idx) => (
            <RiddlePlayer key={riddle.id} riddle={riddle} index={idx} />
          ))
        )}
      </div>

      {/* Next Step */}
      <div className="p-6 rounded-2xl border border-border/80 bg-card flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-sm font-bold text-foreground">Ready to write real-world code?</h3>
          <p className="text-xs text-muted">Advance to the {jsRiddlesData.length} live coding implementation challenges (debounce, throttle, deepClone, etc.).</p>
        </div>
        <Link
          href="/javascript/ejercicios"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 text-xs font-black shadow-md shadow-amber-500/20 hover:opacity-95 transition-all shrink-0"
        >
          <span>Go to Coding Challenges</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
