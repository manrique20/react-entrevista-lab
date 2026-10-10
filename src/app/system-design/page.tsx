import React from 'react';
import Link from 'next/link';
import { SystemDesignLab } from '@/components/system-design/SystemDesignLab';
import { ArrowLeft, Cpu, Sparkles, Layers } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Frontend System Design & Architecture at Scale | React Interview Lab',
  description:
    'Master Frontend System Design interviews for Senior, Lead, and Staff roles with 4 real cases: Infinite Feed, Global E-Commerce, Collaborative Editor, and Silent Refresh Authentication.',
};

export default function SystemDesignPage() {
  return (
    <div className="space-y-8 pb-16">
      {/* Top Breadcrumb */}
      <div className="flex items-center justify-between">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Main Hub</span>
        </Link>
        <Link
          href="/refactorings"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-cyan-600 dark:text-cyan-400 hover:underline"
        >
          <span>Senior Refactorings Lab</span>
          <Sparkles className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Hero Header Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-purple-500/10 via-indigo-500/10 to-blue-500/10 border border-purple-500/20 p-6 md:p-8">
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-purple-500/15 text-purple-700 dark:text-purple-300 text-xs font-semibold">
            <Cpu className="w-3.5 h-3.5" />
            <span>Senior, Lead &amp; Staff Engineer Track</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-foreground">
            Frontend System Design &amp; Architecture
          </h1>
          <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
            The most decisive round with the highest compensation impact in senior interviews. Learn how to decompose
            massive frontend systems, define functional and non-functional requirements, design data flow diagrams,
            and defend technical trade-offs with confidence.
          </p>
        </div>
      </div>

      {/* Interactive System Design Lab */}
      <SystemDesignLab />
    </div>
  );
}

