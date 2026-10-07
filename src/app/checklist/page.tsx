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
    title: 'Dominio de los 8 Niveles de Conocimiento',
    items: [
      { id: 'chk_l1', label: 'Nivel 1: Fundamentos', description: 'DOM virtual, JSX, componentes funcionales, props, keys, condicionales y SyntheticEvent.', linkHref: '/nivel/1' },
      { id: 'chk_l2', label: 'Nivel 2: Estado y Hooks Básicos', description: 'useState funcional, useEffect y cleanup, controlados vs no controlados, validación y useRef.', linkHref: '/nivel/2' },
      { id: 'chk_l3', label: 'Nivel 3: Intermedio', description: 'Context API, useReducer, useMemo/useCallback/memo, ciclo de vida, portals y virtualización.', linkHref: '/nivel/3' },
      { id: 'chk_l4', label: 'Nivel 4: Estado Global y Ecosistema', description: 'Redux Toolkit, Zustand, TanStack Query, React Hook Form + Zod, TypeScript, a11y e i18n.', linkHref: '/nivel/4' },
      { id: 'chk_l5', label: 'Nivel 5: Rendimiento', description: 'Profiler, prevención de re-renders con children, code splitting, Web Vitals, debounce y Web Workers.', linkHref: '/nivel/5' },
      { id: 'chk_l6', label: 'Nivel 6: React Moderno (18 y 19)', description: 'Concurrencia, Automatic Batching, useTransition, useId, Server Components, Server Actions y React 19 hooks.', linkHref: '/nivel/6' },
      { id: 'chk_l7', label: 'Nivel 7: Frameworks y Arquitectura', description: 'CSR vs SSR vs SSG vs ISR, Next.js App Router, arquitectura por features, micro-frontends y seguridad XSS/CSRF.', linkHref: '/nivel/7' },
      { id: 'chk_l8', label: 'Nivel 8: Internos de React', description: 'Arquitectura Fiber, fases Render/Commit, Scheduler lanes, lista enlazada de hooks y stale closures.', linkHref: '/nivel/8' }
    ]
  },
  {
    title: 'Preparación Práctica y Simulación de Entrevistas',
    items: [
      { id: 'chk_preguntas_es', label: 'Preguntas clásicas explicadas en voz alta (Español)', description: 'Explicar con claridad por qué no mutar estado, diferencia entre useEffect y useLayoutEffect, etc.', linkHref: '/preguntas' },
      { id: 'chk_preguntas_en', label: 'Preguntas clásicas explicadas en voz alta (Inglés)', description: 'Capacidad de defender conceptos clave en entrevistas técnicas en inglés técnico.', linkHref: '/preguntas' },
      { id: 'chk_ejercicios', label: 'Ejercicios de código hechos sin mirar documentación', description: 'Construir el buscador debounce, todo list y modal portal en pizarra o live coding fluido.', linkHref: '/ejercicios' }
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

      // Celebración si completa el 100%
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
    if (confirm('¿Deseas reiniciar tu checklist de repaso?')) {
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
              <span>Checklist Oficial de Preparación</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground leading-tight break-words">
              Checklist de Repaso para la Entrevista
            </h1>
            <p className="text-xs sm:text-sm text-muted max-w-4xl break-words">
              Monitorea tu preparación integral. Marca cada hito a medida que domines la teoría y puedas explicarlo con fluidez en voz alta.
            </p>
          </div>

          <div className="p-4 border rounded-2xl bg-background text-right min-w-[170px] shrink-0">
            <span className="text-xs text-muted block">Hitos Completados</span>
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
              <p className="text-sm font-bold">¡Felicidades! Has completado el 100% de la preparación técnica.</p>
              <p className="font-normal text-muted">Estás listo para cualquier entrevista técnica de React &amp; Next.js Senior.</p>
            </div>
          </div>
        )}

        <div className="flex justify-end pt-2 border-t border-border/40">
          <button
            onClick={resetear}
            className="flex items-center gap-1.5 text-xs text-muted hover:text-red-500 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reiniciar Checklist</span>
          </button>
        </div>
      </div>

      {/* Secciones de Checklist */}
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
                        <span>Estudiar</span>
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
