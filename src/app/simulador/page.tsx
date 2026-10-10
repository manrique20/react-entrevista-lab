import React from 'react';
import Link from 'next/link';
import { MockInterviewSimulator } from '@/components/interview/MockInterviewSimulator';
import { ArrowLeft, Sparkles, Layers, ShieldCheck } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Live Technical Interview Simulator | React & JavaScript',
  description:
    'Timed senior technical interview simulation with conceptual questions, trap riddles, and live coding with real-time test runner.',
};

export default function MockInterviewPage() {
  return (
    <div className="space-y-8 pb-16">
      {/* Top Breadcrumb */}
      <div className="flex items-center justify-between">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Home</span>
        </Link>
        <div className="flex items-center gap-3">
          <Link
            href="/react/re-renders"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-cyan-600 dark:text-cyan-400 hover:underline"
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Re-renders Visualizer</span>
          </Link>
        </div>
      </div>

      {/* Simulator Component */}
      <MockInterviewSimulator />
    </div>
  );
}

