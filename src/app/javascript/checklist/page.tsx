'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import confetti from 'canvas-confetti';
import { jsLevelsData } from '@/data/javascript/levelsData';
import { allJsTopics } from '@/data/javascript/topicsData';
import { jsRiddlesData } from '@/data/javascript/riddlesData';
import { jsExercisesData } from '@/data/javascript/exercisesData';
import {
  CheckSquare,
  CheckCircle2,
  RotateCcw,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Award,
  HelpCircle,
  Code2
} from 'lucide-react';

interface ChecklistItem {
  id: string;
  title: string;
  description: string;
  link: string;
  category: 'Nivel' | 'Práctica';
}

const defaultChecklistItems: ChecklistItem[] = [
  {
    id: 'lvl-1',
    title: 'Nivel 1: Fundamentos',
    description: 'Tipos primitivos vs objetos, var/let/const, hoisting, TDZ, coerción y operadores ?? y ?.',
    link: '/javascript/nivel/1',
    category: 'Nivel'
  },
  {
    id: 'lvl-2',
    title: 'Nivel 2: Funciones',
    description: 'Arrow functions, rest/spread, funciones de orden superior, closures, currying y objeto arguments.',
    link: '/javascript/nivel/2',
    category: 'Nivel'
  },
  {
    id: 'lvl-3',
    title: 'Nivel 3: Scope, closures y this',
    description: 'Scope léxico, variables en bucles, binding de this, call/apply/bind y patrón módulo para privacidad.',
    link: '/javascript/nivel/3',
    category: 'Nivel'
  },
  {
    id: 'lvl-4',
    title: 'Nivel 4: Objetos, prototipos, clases y arrays',
    description: 'Cadena de prototipos, operador new, miembros privados (#), mutación de arrays, shallow vs deep copy, Map y Set.',
    link: '/javascript/nivel/4',
    category: 'Nivel'
  },
  {
    id: 'lvl-5',
    title: 'Nivel 5: Asincronía',
    description: 'Event loop explicado de memoria, microtareas vs macrotareas, Promise.all/race/any, cancelación con AbortController y retry con backoff.',
    link: '/javascript/nivel/5',
    category: 'Nivel'
  },
  {
    id: 'lvl-6',
    title: 'Nivel 6: ES6+ y módulos',
    description: 'ESM vs CommonJS, iterables, generadores (function*), Proxy & Reflect y novedades recientes.',
    link: '/javascript/nivel/6',
    category: 'Nivel'
  },
  {
    id: 'lvl-7',
    title: 'Nivel 7: DOM y navegador',
    description: 'Event bubbling, captura, delegación, storage, fetch/CORS, debounce vs throttle, reflow/repaint y Web Workers.',
    link: '/javascript/nivel/7',
    category: 'Nivel'
  },
  {
    id: 'lvl-8',
    title: 'Nivel 8: Avanzado',
    description: 'Gestión de memoria, fugas (memory leaks), inmutabilidad, patrones de diseño en JS, Node.js event loop y WeakRef.',
    link: '/javascript/nivel/8',
    category: 'Nivel'
  },
  {
    id: 'pr-riddles',
    title: 'Acertijos resueltos sin mirar la solución',
    description: 'Resolver los 12 acertijos (A1–A12) de memoria prediciendo exactamente la salida y explicando la trampa técnica.',
    link: '/javascript/acertijos',
    category: 'Práctica'
  },
  {
    id: 'pr-exercises',
    title: 'Ejercicios E1–E17 escritos de memoria y explicados en voz alta',
    description: 'Capacidad de codificar debounce, throttle, deepClone (con ciclos), LRU cache, polyfills y promesas sin consultar documentación.',
    link: '/javascript/ejercicios',
    category: 'Práctica'
  }
];

export default function JsChecklistPage() {
  const [checkedState, setCheckedState] = useState<Record<string, boolean>>({});
  const [studiedCount, setStudiedCount] = useState(0);
  const [riddlesCount, setRiddlesCount] = useState(0);
  const [exercisesCount, setExercisesCount] = useState(0);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('js_review_checklist');
      if (saved) setCheckedState(JSON.parse(saved));

      const savedTopics = localStorage.getItem('js_topics_studied');
      if (savedTopics) setStudiedCount(JSON.parse(savedTopics).length);

      const savedRiddles = localStorage.getItem('js_riddles_mastered');
      if (savedRiddles) setRiddlesCount(JSON.parse(savedRiddles).length);

      const savedExercises = localStorage.getItem('js_exercises_completed');
      if (savedExercises) setExercisesCount(JSON.parse(savedExercises).length);
    } catch {
      // Ignore
    }
  }, []);

  const toggleItem = (id: string) => {
    const updated = { ...checkedState, [id]: !checkedState[id] };
    setCheckedState(updated);
    try {
      localStorage.setItem('js_review_checklist', JSON.stringify(updated));
    } catch {
      // Ignore
    }

    const totalCompleted = Object.values(updated).filter(Boolean).length;
    if (totalCompleted === defaultChecklistItems.length) {
      confetti({ particleCount: 100, spread: 80, origin: { y: 0.6 } });
    }
  };

  const resetAll = () => {
    if (confirm('¿Deseas reiniciar el checklist de repaso de JavaScript?')) {
      setCheckedState({});
      localStorage.removeItem('js_review_checklist');
    }
  };

  const completedTotal = defaultChecklistItems.filter(item => checkedState[item.id]).length;
  const percentage = Math.round((completedTotal / defaultChecklistItems.length) * 100);

  return (
    <div className="space-y-8 pb-16">
      {/* Breadcrumb */}
      <div className="flex items-center justify-between">
        <Link
          href="/javascript"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Volver al Dashboard JS</span>
        </Link>
      </div>

      {/* Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl border border-amber-500/30 bg-gradient-to-r from-amber-500/10 via-card to-card shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1 flex-1 min-w-0">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 text-amber-700 dark:text-amber-300 text-xs font-bold uppercase tracking-wider">
              <CheckSquare className="w-3.5 h-3.5" />
              <span>Preparación Final para la Entrevista</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black text-foreground leading-tight break-words">
              Checklist de Repaso: JavaScript
            </h1>
          </div>

          <button
            onClick={resetAll}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-border/80 hover:bg-muted text-xs font-semibold text-muted hover:text-foreground transition-all shrink-0"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reiniciar Checklist</span>
          </button>
        </div>

        <p className="text-xs sm:text-sm text-muted leading-relaxed max-w-5xl break-words">
          Lista oficial de verificación del documento. Marca cada hito a medida que seas capaz de explicarlo con soltura y escribirlo en vivo sin dudar.
        </p>

        {/* Resumen de Dominio en Vivo */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          <div className="p-3.5 rounded-2xl bg-card border border-border/80 flex items-center justify-between">
            <div>
              <span className="text-[11px] text-muted font-medium block">Preguntas Teóricas</span>
              <span className="text-base font-bold text-foreground">{studiedCount} / {allJsTopics.length} marcadas</span>
            </div>
            <Link href="/javascript/nivel/1" className="text-xs text-amber-600 dark:text-amber-400 hover:underline font-semibold">
              Revisar &gt;
            </Link>
          </div>

          <div className="p-3.5 rounded-2xl bg-card border border-border/80 flex items-center justify-between">
            <div>
              <span className="text-[11px] text-muted font-medium block">Acertijos A1–A12</span>
              <span className="text-base font-bold text-foreground">{riddlesCount} / {jsRiddlesData.length} dominados</span>
            </div>
            <Link href="/javascript/acertijos" className="text-xs text-amber-600 dark:text-amber-400 hover:underline font-semibold">
              Practicar &gt;
            </Link>
          </div>

          <div className="p-3.5 rounded-2xl bg-card border border-border/80 flex items-center justify-between">
            <div>
              <span className="text-[11px] text-muted font-medium block">Ejercicios E1–E17</span>
              <span className="text-base font-bold text-foreground">{exercisesCount} / {jsExercisesData.length} completados</span>
            </div>
            <Link href="/javascript/ejercicios" className="text-xs text-amber-600 dark:text-amber-400 hover:underline font-semibold">
              Probar &gt;
            </Link>
          </div>
        </div>

        {/* Global Progress Bar */}
        <div className="pt-2">
          <div className="flex items-center justify-between text-xs font-bold mb-1.5">
            <span>Objetivos Generales de la Guía</span>
            <span className="text-amber-600 dark:text-amber-400">{completedTotal} de {defaultChecklistItems.length} ({percentage}%)</span>
          </div>
          <div className="w-full h-3 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-amber-500 to-yellow-500 transition-all duration-300"
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>
      </div>

      {/* Checklist Items */}
      <div className="space-y-3">
        {defaultChecklistItems.map((item) => {
          const isDone = !!checkedState[item.id];
          return (
            <div
              key={item.id}
              onClick={() => toggleItem(item.id)}
              className={`p-4 sm:p-5 rounded-2xl border transition-all cursor-pointer flex items-start gap-4 ${
                isDone
                  ? 'bg-emerald-500/10 border-emerald-500/30'
                  : 'bg-card border-border/80 hover:border-amber-500/40 hover:bg-muted/30'
              }`}
            >
              <div className="pt-0.5 shrink-0">
                <input
                  type="checkbox"
                  checked={isDone}
                  onChange={() => {}}
                  className="w-5 h-5 rounded-md border-border text-amber-500 focus:ring-amber-500 cursor-pointer"
                />
              </div>

              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <h3 className={`text-sm sm:text-base font-bold ${isDone ? 'text-emerald-700 dark:text-emerald-400 line-through' : 'text-foreground'}`}>
                    {item.title}
                  </h3>
                  <Link
                    href={item.link}
                    onClick={(e) => e.stopPropagation()}
                    className="text-xs font-semibold text-amber-600 dark:text-amber-400 hover:underline inline-flex items-center gap-1"
                  >
                    <span>Ir al módulo</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
                <p className="text-xs text-muted leading-relaxed">
                  {item.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {percentage === 100 && (
        <div className="p-8 rounded-3xl bg-gradient-to-r from-emerald-500/15 via-teal-500/15 to-emerald-500/15 border border-emerald-500/40 text-center space-y-3 animate-in zoom-in-95">
          <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto shadow-md">
            <Award className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-black text-foreground">
            ¡Felicidades! Has completado el Checklist de JavaScript Core
          </h2>
          <p className="text-xs sm:text-sm text-muted max-w-xl mx-auto">
            Estás 100% preparado para responder con confianza preguntas de arquitectura, el motor V8, event loop y algoritmos en vivo en cualquier entrevista técnica.
          </p>
        </div>
      )}
    </div>
  );
}
