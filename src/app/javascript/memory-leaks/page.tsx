import React from 'react';
import Link from 'next/link';
import { MemoryLeakSimulator } from '@/components/javascript/MemoryLeakSimulator';
import { ArrowLeft, Trash2, Sparkles, Terminal } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Memory Leaks & V8 Garbage Collection Simulator | React Interview Lab',
  description:
    'Visually understand how JavaScript memory leaks happen: Detached DOM nodes, orphaned event listeners, and retained closures. Master debugging with V8 GC.',
};

export default function MemoryLeaksPage() {
  return (
    <div className="space-y-8 pb-16">
      {/* Top Breadcrumb */}
      <div className="flex items-center justify-between">
        <Link
          href="/javascript"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to JavaScript Dashboard</span>
        </Link>
        <Link
          href="/javascript/acertijos"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-600 dark:text-amber-400 hover:underline"
        >
          <span>Practice JavaScript Riddles</span>
          <Sparkles className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Hero Header Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-rose-500/10 via-amber-500/10 to-orange-500/10 border border-rose-500/20 p-6 md:p-8">
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-rose-500/15 text-rose-700 dark:text-rose-300 text-xs font-semibold">
            <Trash2 className="w-3.5 h-3.5" />
            <span>V8 Engine &amp; Heap Memory Management</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-foreground">
            Memory Leaks &amp; Garbage Collection Simulator
          </h1>
          <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
            One of the most demanding questions in Senior interviews is:{' '}
            <strong className="text-foreground font-semibold">
              How does the V8 Garbage Collector work and what patterns trigger silent memory leaks in Single Page Applications?
            </strong>{' '}
            Experiment live with the Heap Memory gauge, simulate real leaks, and observe why the GC cannot reclaim
            objects with active GC roots until the senior fix is applied.
          </p>
        </div>
      </div>

      {/* Interactive Memory Leak Simulator */}
      <MemoryLeakSimulator />
    </div>
  );
}

