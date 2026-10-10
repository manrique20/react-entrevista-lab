import React from 'react';
import Link from 'next/link';
import { SeniorRefactoringLab } from '@/components/refactorings/SeniorRefactoringLab';
import { ArrowLeft, Split, Sparkles, BookOpen } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Code Smells & Senior Refactorings Lab | React Interview Lab',
  description:
    'Learn how to identify real code smells in technical interviews and refactor them with clean architecture principles, immutability, and compound components.',
};

export default function RefactoringsPage() {
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
          href="/simulador"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
        >
          <span>Practice in Mock Interview Simulator</span>
          <Sparkles className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Hero Header Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-500/10 via-cyan-500/10 to-indigo-500/10 border border-emerald-500/20 p-6 md:p-8">
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 text-xs font-semibold">
            <Split className="w-3.5 h-3.5" />
            <span>Senior Patterns &amp; Best Practices</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-foreground">
            Code Smells &amp; Senior Refactorings Lab
          </h1>
          <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
            In technical rounds for Mid and Senior roles, interviewers will show you real-world code and ask:{' '}
            <strong className="text-foreground font-semibold">
              What issues do you see in this code and how would you refactor it?
            </strong>{' '}
            Explore real before-and-after scenarios, compare interactive diffs, and master the exact architectural and SOLID principles reasoning.
          </p>
        </div>
      </div>

      {/* Interactive Lab Component */}
      <SeniorRefactoringLab />
    </div>
  );
}

