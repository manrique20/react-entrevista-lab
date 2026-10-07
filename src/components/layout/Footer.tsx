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
          <span className="font-semibold text-foreground">React &amp; Next.js Entrevista Lab</span>
          <span>— Guía interactiva de preparación técnica de 8 niveles</span>
        </div>
        <div className="flex items-center gap-4 text-xs">
          <Link href="/" className="hover:text-foreground transition-colors">Niveles 1-8</Link>
          <Link href="/preguntas" className="hover:text-foreground transition-colors">Preguntas Clásicas</Link>
          <Link href="/ejercicios" className="hover:text-foreground transition-colors">Ejercicios</Link>
          <Link href="/checklist" className="hover:text-foreground transition-colors">Checklist</Link>
        </div>
      </div>
    </footer>
  );
}
