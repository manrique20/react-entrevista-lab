'use client';

import React from 'react';
import Link from 'next/link';
import { Sparkles, Heart } from 'lucide-react';

export function Footer() {
  return (
    <footer className="w-full border-t border-border/80 bg-card/50 text-xs text-muted py-8 mt-16">
      <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-10 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-primary" />
          <span className="font-semibold text-foreground">Frontend Interview Mastery Lab</span>
          <span>— Full-stack technical preparation guide for React 19 &amp; JavaScript Core</span>
        </div>
        <div className="flex items-center gap-4 text-xs">
          <Link href="/" className="hover:text-foreground transition-colors">Hub</Link>
          <Link href="/react" className="hover:text-foreground transition-colors">React 19</Link>
          <Link href="/javascript" className="hover:text-foreground transition-colors">JS Core</Link>
          <Link href="/simulador" className="hover:text-foreground transition-colors">Mock Simulator</Link>
          <Link href="/system-design" className="hover:text-foreground transition-colors">System Design</Link>
          <Link href="/flashcards" className="hover:text-foreground transition-colors">Flashcards</Link>
        </div>
      </div>
    </footer>
  );
}
