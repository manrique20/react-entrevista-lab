'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, X, ArrowRight, Atom, Terminal, HelpCircle, Code2 } from 'lucide-react';
import { TOPICS } from '@/data/topicsData';
import { allJsTopics } from '@/data/javascript/topicsData';
import { jsRiddlesData } from '@/data/javascript/riddlesData';
import { jsExercisesData } from '@/data/javascript/exercisesData';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface SearchResultItem {
  id: string;
  title: string;
  subtitle: string;
  href: string;
  badge: string;
  badgeStyle: string;
}

export function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResultItem[]>([]);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const term = query.toLowerCase().trim();
    const matches: SearchResultItem[] = [];

    // 1. Search React Topics
    for (const t of TOPICS) {
      if (
        t.title.toLowerCase().includes(term) ||
        t.summary.toLowerCase().includes(term) ||
        t.id.toLowerCase().includes(term) ||
        t.tags.some(tag => tag.toLowerCase().includes(term))
      ) {
        matches.push({
          id: `react-${t.id}`,
          title: t.title,
          subtitle: t.summary,
          href: `/nivel/${t.level}#topic-${t.id}`,
          badge: 'React 19',
          badgeStyle: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20'
        });
      }
    }

    // 2. Search JavaScript Topics
    for (const j of allJsTopics) {
      if (
        j.question.toLowerCase().includes(term) ||
        j.shortAnswer.toLowerCase().includes(term) ||
        j.id.toLowerCase().includes(term) ||
        j.tags.some(tag => tag.toLowerCase().includes(term))
      ) {
        matches.push({
          id: `js-${j.id}`,
          title: j.question,
          subtitle: j.shortAnswer,
          href: `/javascript/nivel/${j.level}#${j.id}`,
          badge: 'JS Core',
          badgeStyle: 'bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/20'
        });
      }
    }

    // 3. Search JS Riddles
    for (const r of jsRiddlesData) {
      if (
        r.title.toLowerCase().includes(term) ||
        r.id.toLowerCase().includes(term) ||
        r.explanation.toLowerCase().includes(term)
      ) {
        matches.push({
          id: `riddle-${r.id}`,
          title: `${r.id}: ${r.title}`,
          subtitle: `Acertijo ¿Qué imprime? • ${r.expectedOutput}`,
          href: `/javascript/acertijos`,
          badge: 'Acertijo JS',
          badgeStyle: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20'
        });
      }
    }

    // 4. Search JS Exercises
    for (const e of jsExercisesData) {
      if (
        e.title.toLowerCase().includes(term) ||
        e.id.toLowerCase().includes(term) ||
        e.description.toLowerCase().includes(term)
      ) {
        matches.push({
          id: `exercise-${e.id}`,
          title: `${e.id}: ${e.title}`,
          subtitle: `Reto de código • ${e.category}`,
          href: `/javascript/ejercicios`,
          badge: 'Reto JS',
          badgeStyle: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
        });
      }
    }

    setResults(matches.slice(0, 10));
  }, [query]);

  // Listener para Escape
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-20 bg-black/60 backdrop-blur-sm p-4 animate-in fade-in"
      onClick={onClose}
    >
      <div
        className="bg-card border border-border/80 rounded-2xl shadow-2xl max-w-xl w-full overflow-hidden text-foreground animate-in zoom-in-95"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-4 border-b border-border/70 flex items-center gap-3">
          <Search className="w-5 h-5 text-muted shrink-0" />
          <input
            autoFocus
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Buscar en React y JavaScript (ej: 'hoisting', 'event loop', 'debounce', 'fiber', 'closure')..."
            className="w-full bg-transparent text-sm focus:outline-none placeholder:text-muted"
          />
          <button
            onClick={onClose}
            className="p-1 rounded-md text-muted hover:text-foreground"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="max-h-96 overflow-y-auto p-2 space-y-1">
          {query.trim() === '' ? (
            <div className="p-8 text-center text-xs text-muted space-y-2">
              <p>Búsqueda unificada en los 160 temas, 12 acertijos y 28 ejercicios prácticos.</p>
              <div className="flex flex-wrap justify-center gap-1.5 pt-2">
                {['Event Loop', 'Debounce', 'Hoisting', 'Fiber', 'useTransition', 'Closures', 'LRU Cache', 'Zustand', 'Promise.all'].map(sug => (
                  <button
                    key={sug}
                    onClick={() => setQuery(sug)}
                    className="px-2.5 py-1 rounded-lg border bg-muted/30 text-[11px] hover:border-primary/50 transition-colors"
                  >
                    {sug}
                  </button>
                ))}
              </div>
            </div>
          ) : results.length === 0 ? (
            <div className="p-8 text-center text-xs text-muted">
              No se encontraron resultados para &quot;{query}&quot;.
            </div>
          ) : (
            results.map(item => (
              <Link
                key={item.id}
                href={item.href}
                onClick={onClose}
                className="p-3 rounded-xl hover:bg-muted/50 flex items-center justify-between gap-3 group transition-colors block"
              >
                <div className="space-y-0.5 overflow-hidden">
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded border ${item.badgeStyle}`}>
                      {item.badge}
                    </span>
                    <span className="font-semibold text-xs text-foreground group-hover:text-primary transition-colors truncate">
                      {item.title}
                    </span>
                  </div>
                  <p className="text-[11px] text-muted line-clamp-1">{item.subtitle}</p>
                </div>
                <ArrowRight className="w-4 h-4 text-muted group-hover:text-primary shrink-0 transition-colors" />
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
