import React from 'react';
import Link from 'next/link';
import { FlashcardReviewer } from '@/components/flashcards/FlashcardReviewer';
import { ArrowLeft, Brain, Sparkles } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Quick Review Flashcards | React & JavaScript Lab',
  description:
    'High-velocity spaced repetition review to master all 160 core topics of React and JavaScript. 3D cards with questions, traps, and senior insights.',
};

export default function FlashcardsPage() {
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
          <span>Go to Interview Simulator</span>
          <Sparkles className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Hero Header Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-cyan-500/10 via-blue-500/10 to-indigo-500/10 border border-cyan-500/20 p-6 md:p-8">
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-cyan-500/15 text-cyan-700 dark:text-cyan-300 text-xs font-semibold">
            <Brain className="w-3.5 h-3.5" />
            <span>Spaced Repetition &amp; Rapid Recall</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-foreground">
            Quick Review Flashcards
          </h1>
          <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
            Train your conceptual recall speed for technical interviews. Review 160+ core React 19 and
            JavaScript topics with interactive cards, grade your retention level, and laser-focus on
            areas requiring deeper practice.
          </p>
        </div>
      </div>

      {/* Interactive Flashcard Reviewer */}
      <FlashcardReviewer />
    </div>
  );
}

