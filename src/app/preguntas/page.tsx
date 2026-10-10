'use client';

import React, { useState } from 'react';
import { INTERVIEW_QUESTIONS } from '@/data/interviewQuestions';
import { CodeBlock } from '@/components/ui/CodeBlock';
import {
  HelpCircle,
  Eye,
  EyeOff,
  AlertTriangle,
  CheckCircle2,
  Filter,
  Sparkles,
  BookOpen
} from 'lucide-react';

export default function QuestionsPage() {
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState<string>('All');
  const [reveladas, setReveladas] = useState<Record<string, boolean>>({});

  const categorias = ['All', ...Array.from(new Set(INTERVIEW_QUESTIONS.map(q => q.category)))];

  const toggleRevelar = (id: string) => {
    setReveladas(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const preguntasFiltradas = INTERVIEW_QUESTIONS.filter(q =>
    categoriaSeleccionada === 'All' || q.category === categoriaSeleccionada
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="p-6 sm:p-8 border rounded-3xl bg-card space-y-3 shadow-sm">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400 text-xs font-semibold">
          <HelpCircle className="w-3.5 h-3.5" />
          <span>Senior Interview Simulator</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground leading-tight break-words">
          Classic React Technical Interview Questions
        </h1>
        <p className="text-xs sm:text-sm text-muted max-w-4xl leading-relaxed break-words">
          The essential questions asked in technical processes for Mid and Senior roles. Each card lets you formulate your answer before revealing the senior explanation, code demonstration, and traps that trip up candidates.
        </p>

        {/* Category Filters */}
        <div className="pt-4 border-t border-border/60 flex flex-wrap gap-1.5">
          {categorias.map(cat => (
            <button
              key={cat}
              onClick={() => setCategoriaSeleccionada(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-colors ${
                categoriaSeleccionada === cat
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'border hover:bg-muted text-muted hover:text-foreground'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* List of Questions */}
      <div className="space-y-6">
        {preguntasFiltradas.map((q, idx) => {
          const estaRevelada = !!reveladas[q.id];

          return (
            <div
              key={q.id}
              className="border border-border/80 rounded-2xl bg-card p-5 sm:p-6 space-y-4 shadow-sm"
            >
              {/* Question Header */}
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-purple-500/10 text-purple-600 dark:text-purple-400">
                      Question #{idx + 1}
                    </span>
                    <span className="text-[11px] text-muted font-medium bg-muted px-2 py-0.5 rounded">
                      {q.category}
                    </span>
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-foreground pt-1">
                    {q.question}
                  </h3>
                </div>

                <button
                  onClick={() => toggleRevelar(q.id)}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                    estaRevelada
                      ? 'bg-purple-600 text-white shadow-sm'
                      : 'border border-border hover:bg-muted text-foreground'
                  }`}
                >
                  {estaRevelada ? (
                    <>
                      <EyeOff className="w-3.5 h-3.5" />
                      <span>Hide Answer</span>
                    </>
                  ) : (
                    <>
                      <Eye className="w-3.5 h-3.5 text-purple-500" />
                      <span>Reveal Senior Answer</span>
                    </>
                  )}
                </button>
              </div>

              {!estaRevelada ? (
                <div className="p-4 border border-dashed rounded-xl bg-muted/10 text-center text-xs text-muted space-y-1">
                  <p className="font-semibold text-foreground">💡 Mental Practice Challenge:</p>
                  <p>Try to explain the core concepts out loud before clicking &quot;Reveal Senior Answer&quot;.</p>
                </div>
              ) : (
                <div className="space-y-4 pt-3 border-t border-border/40 animate-in fade-in-50">
                  {/* Senior Answer */}
                  <div className="space-y-2">
                    <h4 className="font-bold text-xs text-foreground flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                      Senior Candidate Response:
                    </h4>
                    <div className="p-4 rounded-xl border border-border/80 bg-background text-xs leading-relaxed text-foreground whitespace-pre-line">
                      {q.seniorAnswer}
                    </div>
                  </div>

                  {/* Code Example */}
                  {q.codeExample && (
                    <div>
                      <h4 className="font-bold text-xs text-foreground mb-1">Code Demonstration:</h4>
                      <CodeBlock code={q.codeExample} language="tsx" />
                    </div>
                  )}

                  {/* Traps and Red Flags */}
                  {q.trapsAndRedFlags.length > 0 && (
                    <div className="space-y-2 pt-2 border-t border-border/40">
                      <h4 className="font-bold text-xs text-amber-600 dark:text-amber-400 flex items-center gap-1.5">
                        <AlertTriangle className="w-4 h-4 text-amber-500" />
                        Common Traps &amp; Interview Red Flags:
                      </h4>
                      <ul className="space-y-2 text-xs">
                        {q.trapsAndRedFlags.map((trap, tIdx) => (
                          <li
                            key={tIdx}
                            className="p-3 rounded-xl border border-amber-500/20 bg-amber-500/5 text-foreground flex items-start gap-2.5"
                          >
                            <span className="text-amber-500 font-bold">•</span>
                            <span className="leading-relaxed">{trap}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
