import React from 'react';
import Link from 'next/link';
import { RerenderVisualizer } from '@/components/react/RerenderVisualizer';
import { ArrowLeft, Layers, Sparkles, BookOpen } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'React Re-renders Visualizer | React Interview Lab',
  description:
    'Visually and interactively understand how React propagates renders down the Virtual DOM tree, how React.memo, useCallback, the children slot pattern, and Context bailouts work.',
};

export default function RerenderVisualizerPage() {
  return (
    <div className="space-y-8 pb-16">
      {/* Breadcrumb & Navigation */}
      <div className="flex items-center justify-between">
        <Link
          href="/react"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to React Dashboard</span>
        </Link>
        <Link
          href="/react/acertijos"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-cyan-600 dark:text-cyan-400 hover:underline"
        >
          <span>Practice React Riddles</span>
          <Sparkles className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Hero Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-cyan-500/10 via-blue-500/10 to-indigo-500/10 border border-cyan-500/20 p-6 md:p-8">
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-cyan-500/15 text-cyan-700 dark:text-cyan-300 text-xs font-semibold">
            <Layers className="w-3.5 h-3.5" />
            <span>Interactive Performance Lab</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-foreground">
            React Re-renders Visualizer
          </h1>
          <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
            One of the most frequent questions in Senior React interviews is:{' '}
            <strong className="text-foreground font-semibold">
              Why does a child component re-render when its parent changes and how do you genuinely prevent it?
            </strong>{' '}
            Experiment live with the component tree, watch real-time reconciliation pulses, and
            master patterns like <code className="text-cyan-600 dark:text-cyan-400 font-mono">React.memo</code>,{' '}
            <code className="text-cyan-600 dark:text-cyan-400 font-mono">useCallback</code>, and the{' '}
            <code className="text-cyan-600 dark:text-cyan-400 font-mono">children slot pattern</code>.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              6 Interactive Scenarios
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-cyan-500"></span>
              Real-time Visual Pulses
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
              Reconciliation Log
            </span>
          </div>
        </div>
      </div>

      {/* Interactive Visualizer Component */}
      <RerenderVisualizer />

      {/* Senior Tips Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-5 rounded-xl border border-card-border bg-card/60 space-y-3">
          <div className="flex items-center gap-2 text-foreground font-bold text-sm">
            <BookOpen className="w-4 h-4 text-cyan-500" />
            <span>Key Interview Question: Is React.memo always free?</span>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            No. <code className="font-mono text-cyan-600 dark:text-cyan-400">React.memo</code> introduces overhead on every render:
            a shallow equality comparison across all incoming props. If a component is cheap to render or receives props
            that change on almost every render, wrapping it in memoization adds net unnecessary overhead.
          </p>
        </div>

        <div className="p-5 rounded-xl border border-card-border bg-card/60 space-y-3">
          <div className="flex items-center gap-2 text-foreground font-bold text-sm">
            <Sparkles className="w-4 h-4 text-indigo-500" />
            <span>The Power of the Children Slot Pattern</span>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            When you pass a JSX element as <code className="font-mono text-indigo-600 dark:text-indigo-400">children</code> to a wrapper component,
            that element is evaluated in the parent scope, not inside the wrapper. Thus, when the wrapper re-renders due to its own internal state,
            the <code className="font-mono text-indigo-600 dark:text-indigo-400">children</code> reference remains strictly identical, and React bails out of re-rendering children without even needing <code className="font-mono text-indigo-600 dark:text-indigo-400">React.memo</code>.
          </p>
        </div>
      </div>
    </div>
  );
}

