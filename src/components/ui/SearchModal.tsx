'use client';

import React, { useState, useEffect } from 'react';
import { Search, X, ArrowRight, BookOpen, Layers } from 'lucide-react';
import { searchTopics } from '@/data/topicsData';
import { Topic } from '@/types';
import Link from 'next/link';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Topic[]>([]);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }
    const res = searchTopics(query);
    setResults(res.slice(0, 8));
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
        className="bg-card border border-border rounded-2xl shadow-2xl max-w-xl w-full overflow-hidden text-foreground animate-in zoom-in-95"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-4 border-b border-border flex items-center gap-3">
          <Search className="w-5 h-5 text-muted shrink-0" />
          <input
            autoFocus
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Buscar concepto (ej: 'fiber', 'stale closure', 'useActionState', 'diffing')..."
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
              <p>Escribe cualquier término técnico para saltar directamente al tema y demo interactiva.</p>
              <div className="flex flex-wrap justify-center gap-1.5 pt-2">
                {['Fiber', 'useTransition', 'Zustand', 'Key Trap', 'RSC', 'useOptimistic', 'AbortController'].map(sug => (
                  <button
                    key={sug}
                    onClick={() => setQuery(sug)}
                    className="px-2.5 py-1 rounded-lg border bg-muted/30 text-[11px] hover:border-primary/50"
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
            results.map(topic => (
              <Link
                key={topic.id}
                href={`/nivel/${topic.level}#topic-${topic.id}`}
                onClick={onClose}
                className="p-3 rounded-xl hover:bg-muted/50 flex items-center justify-between gap-3 group transition-colors block"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-primary">#{topic.id}</span>
                    <span className="font-semibold text-xs text-foreground group-hover:text-primary transition-colors">
                      {topic.title}
                    </span>
                  </div>
                  <p className="text-[11px] text-muted line-clamp-1 mt-0.5">{topic.summary}</p>
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
