'use client';

import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  CheckSquare,
  Square,
  Trophy,
  RotateCcw,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import Link from 'next/link';

interface ChecklistItem {
  id: string;
  label: string;
  description: string;
  linkHref?: string;
}

const CHECKLIST_SECTIONS: { title: string; items: ChecklistItem[] }[] = [
  {
    title: 'Mastery of all 8 Knowledge Levels',
    items: [
      { id: 'chk_l1', label: 'Level 1: Fundamentals', description: 'Virtual DOM, JSX, functional components, props, keys, conditional rendering, and SyntheticEvent.', linkHref: '/nivel/1' },
      { id: 'chk_l2', label: 'Level 2: State & Basic Hooks', description: 'Functional useState, useEffect & cleanup, controlled vs uncontrolled, validation, and useRef.', linkHref: '/nivel/2' },
      { id: 'chk_l3', label: 'Level 3: Intermediate React', description: 'Context API, useReducer, useMemo/useCallback/memo, lifecycle, portals, and virtualization.', linkHref: '/nivel/3' },
      { id: 'chk_l4', label: 'Level 4: Global State & Ecosystem', description: 'Redux Toolkit, Zustand, TanStack Query, React Hook Form + Zod, TypeScript, a11y, and i18n.', linkHref: '/nivel/4' },
      { id: 'chk_l5', label: 'Level 5: Performance Optimization', description: 'Profiler, preventing re-renders with children pattern, code splitting, Web Vitals, debounce, and Web Workers.', linkHref: '/nivel/5' },
      { id: 'chk_l6', label: 'Level 6: Modern React (18 & 19)', description: 'Concurrent rendering, Automatic Batching, useTransition, useId, Server Components, Server Actions, and React 19 hooks.', linkHref: '/nivel/6' },
      { id: 'chk_l7', label: 'Level 7: Frameworks & Architecture', description: 'CSR vs SSR vs SSG vs ISR, Next.js App Router, feature-based architecture, micro-frontends, and XSS/CSRF security.', linkHref: '/nivel/7' },
      { id: 'chk_l8', label: 'Level 8: React Internals', description: 'Fiber architecture, Render/Commit phases, Scheduler lanes, hooks linked list, and stale closures.', linkHref: '/nivel/8' }
    ]
  },
  {
    title: 'Hands-on Practice & Interview Simulation',
    items: [
      { id: 'chk_preguntas_en', label: 'Classic senior questions explained out loud', description: 'Fluently explain why not to mutate state, useEffect vs useLayoutEffect, reconciliation mechanics, and architectural trade-offs.', linkHref: '/preguntas' },
      { id: 'chk_ejercicios', label: 'Live coding challenges solved from scratch without docs', description: 'Build debounced search inputs, todo list with undo, modal portals, and virtualized lists on live whiteboard sessions.', linkHref: '/ejercicios' }
    ]
  }
];

export function ChecklistPage() {
  const [completados, setCompletados] = useState<Record<string, boolean>>({});

  useEffect(() => {
    try {
      const guardado = localStorage.getItem('react_entrevista_checklist');
      if (guardado) {
        setCompletados(JSON.parse(guardado));
      }
    } catch {
      // Fallback
    }
  }, []);

  const totalItems = CHECKLIST_SECTIONS.reduce((acc, sec) => acc + sec.items.length, 0);
  const itemsMarcados = Object.values(completados).filter(Boolean).length;
  const porcentaje = Math.round((itemsMarcados / totalItems) * 100);

  const toggleItem = (id: string) => {
    setCompletados(prev => {
      const nuevo = { ...prev, [id]: !prev[id] };
      const marcadosAhora = Object.values(nuevo).filter(Boolean).length;

      // Confetti on 100% completion
      if (marcadosAhora === totalItems && !prev[id]) {
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.6 }
        });
      }

      try {
        localStorage.setItem('react_entrevista_checklist', JSON.stringify(nuevo));
      } catch {
        // Fallback
      }
      return nuevo;
    });
  };

  const resetear = () => {
    if (confirm('Do you want to reset your review checklist?')) {
      setCompletados({});
      localStorage.removeItem('react_entrevista_checklist');
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="p-6 sm:p-8 border rounded-3xl bg-card space-y-4 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1 flex-1 min-w-0">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 text-xs font-semibold">
              <CheckSquare className="w-3.5 h-3.5" />
              <span>Official Preparation Checklist</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground leading-tight break-words">
              Interview Review Checklist
            </h1>
            <p className="text-xs sm:text-sm text-muted max-w-4xl break-words">
              Track your end-to-end interview readiness. Check off each milestone as you master the theory and explain it fluently out loud.
            </p>
          </div>

          <div className="p-4 border rounded-2xl bg-background text-right min-w-[170px] shrink-0">
            <span className="text-xs text-muted block">Milestones Completed</span>
            <span className="text-2xl font-extrabold font-mono text-primary">
              {itemsMarcados}/{totalItems} ({porcentaje}%)
            </span>
            <div className="w-full h-1.5 bg-muted rounded-full mt-2 overflow-hidden">
              <div
                className="h-full bg-emerald-500 rounded-full transition-all duration-300"
                style={{ width: `${porcentaje}%` }}
              />
            </div>
          </div>
        </div>

        {itemsMarcados === totalItems && (
          <div className="p-4 border border-emerald-500/40 bg-emerald-500/10 rounded-2xl flex items-center gap-3 text-emerald-700 dark:text-emerald-300 text-xs font-semibold animate-in zoom-in-95">
            <Trophy className="w-6 h-6 text-emerald-500 shrink-0" />
            <div>
              <p className="text-sm font-bold">Congratulations! You completed 100% of technical preparation.</p>
              <p className="font-normal text-muted">You are ready for any Senior React &amp; Next.js technical interview round.</p>
            </div>
          </div>
        )}

        <div className="flex justify-end pt-2 border-t border-border/40">
          <button
            onClick={resetear}
            className="flex items-center gap-1.5 text-xs text-muted hover:text-red-500 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Checklist</span>
          </button>
        </div>
      </div>

      {/* Checklist Sections */}
      <div className="space-y-8">
        {CHECKLIST_SECTIONS.map((seccion, sIdx) => (
          <div key={sIdx} className="space-y-3">
            <h3 className="text-base font-bold text-foreground">{seccion.title}</h3>
            <div className="space-y-2">
              {seccion.items.map(item => {
                const checked = !!completados[item.id];

                return (
                  <div
                    key={item.id}
                    className={`p-4 border rounded-2xl bg-card flex items-start justify-between gap-4 transition-all ${
                      checked ? 'border-emerald-500/30 bg-emerald-500/5' : 'hover:border-primary/40'
                    }`}
                  >
                    <div
                      onClick={() => toggleItem(item.id)}
                      className="flex items-start gap-3 cursor-pointer select-none flex-1"
                    >
                      <div className="mt-0.5">
                        {checked ? (
                          <div className="w-5 h-5 rounded-md bg-emerald-500 text-white flex items-center justify-center">
                            ✓
                          </div>
                        ) : (
                          <Square className="w-5 h-5 text-muted hover:text-primary transition-colors" />
                        )}
                      </div>
                      <div>
                        <h4 className={`text-xs sm:text-sm font-bold ${checked ? 'line-through text-muted' : 'text-foreground'}`}>
                          {item.label}
                        </h4>
                        <p className="text-xs text-muted mt-0.5 leading-relaxed">{item.description}</p>
                      </div>
                    </div>

                    {item.linkHref && (
                      <Link
                        href={item.linkHref}
                        className="px-3 py-1.5 border rounded-xl hover:bg-muted text-[11px] font-semibold text-primary shrink-0 flex items-center gap-1"
                      >
                        <span>Study</span>
                        <ArrowRight className="w-3 h-3" />
                      </Link>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ChecklistPage;
