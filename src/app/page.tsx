'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  Atom,
  Terminal,
  HelpCircle,
  Code2,
  CheckSquare,
  ArrowRight,
  Zap,
  Layers,
  BookOpen,
  CheckCircle2,
  Search,
  Activity,
  Cpu,
  GraduationCap
} from 'lucide-react';
import { LEVELS } from '@/data/levelsData';
import { jsLevelsData } from '@/data/javascript/levelsData';
import { allJsTopics } from '@/data/javascript/topicsData';
import { TOPICS } from '@/data/topicsData';

export default function UnifiedPortalHub() {
  const [reactCompleted, setReactCompleted] = useState(0);
  const [jsCompleted, setJsCompleted] = useState(0);
  const [jsRiddlesCompleted, setJsRiddlesCompleted] = useState(0);
  const [jsExercisesCompleted, setJsExercisesCompleted] = useState(0);

  useEffect(() => {
    const updateStats = () => {
      try {
        const savedReact = localStorage.getItem('react_entrevista_progress');
        if (savedReact) setReactCompleted(JSON.parse(savedReact).length);

        const savedJs = localStorage.getItem('js_topics_studied');
        if (savedJs) setJsCompleted(JSON.parse(savedJs).length);

        const savedRiddles = localStorage.getItem('js_riddles_mastered');
        if (savedRiddles) setJsRiddlesCompleted(JSON.parse(savedRiddles).length);

        const savedExercises = localStorage.getItem('js_exercises_completed');
        if (savedExercises) setJsExercisesCompleted(JSON.parse(savedExercises).length);
      } catch {
        // Fallback
      }
    };
    updateStats();
    window.addEventListener('storage', updateStats);
    return () => window.removeEventListener('storage', updateProgressSafe);
  }, []);

  const updateProgressSafe = () => {};

  const totalTopics = TOPICS.length + allJsTopics.length; // 79 + 81 = 160
  const totalCompletedTopics = reactCompleted + jsCompleted;
  const globalPercent = Math.round((totalCompletedTopics / totalTopics) * 100);

  return (
    <div className="space-y-12 pb-20">
      {/* Hero Principal */}
      <section className="relative overflow-hidden rounded-3xl border border-border/80 bg-gradient-to-b from-primary/5 via-card to-card p-6 sm:p-12 text-center space-y-6 shadow-sm">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold tracking-wide uppercase">
          <Sparkles className="w-4 h-4 animate-pulse" />
          <span>Frontend Interview Mastery Hub</span>
        </div>

        <div className="max-w-3xl mx-auto space-y-3">
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-foreground">
            El Laboratorio Definitivo de{' '}
            <span className="bg-gradient-to-r from-blue-500 via-indigo-500 to-amber-500 bg-clip-text text-transparent">
              Entrevistas Frontend
            </span>
          </h1>
          <p className="text-sm sm:text-base text-muted leading-relaxed max-w-2xl mx-auto">
            Preparación intensiva y rigurosa en dos pistas independientes: la arquitectura moderna de <strong>React 19 &amp; Next.js</strong> y los mecanismos profundos de ejecución de <strong>JavaScript Core</strong>.
          </p>
        </div>

        {/* Global Progress Overview */}
        <div className="max-w-xl mx-auto p-4 rounded-2xl bg-card border border-border/80 shadow-xs space-y-2.5">
          <div className="flex items-center justify-between text-xs font-bold">
            <span className="flex items-center gap-1.5 text-foreground">
              <Activity className="w-4 h-4 text-emerald-500" />
              Progreso Global de Estudio
            </span>
            <span className="text-primary font-mono">{totalCompletedTopics} / {totalTopics} temas dominados ({globalPercent}%)</span>
          </div>
          <div className="w-full h-2.5 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-amber-500 transition-all duration-500"
              style={{ width: `${globalPercent}%` }}
            />
          </div>
          <div className="flex items-center justify-between text-[11px] text-muted">
            <span>React: {reactCompleted}/79</span>
            <span>JavaScript: {jsCompleted}/81</span>
            <span>Acertijos: {jsRiddlesCompleted}/12</span>
            <span>Retos: {jsExercisesCompleted}/17</span>
          </div>
        </div>
      </section>

      {/* Selector de Pistas Principales (Dual Track Cards) */}
      <section className="space-y-4">
        <div className="text-center sm:text-left space-y-1">
          <h2 className="text-2xl font-black text-foreground">
            Elige tu Pista de Estudio
          </h2>
          <p className="text-xs sm:text-sm text-muted">
            Ambas rutas cuentan con niveles estructurados, preguntas de entrevista, código ejecutable y pruebas en vivo.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* PISTA 1: REACT 19 & NEXT.JS */}
          <div className="rounded-3xl border border-blue-500/30 bg-gradient-to-b from-blue-500/10 via-card to-card p-6 sm:p-8 flex flex-col justify-between space-y-6 shadow-sm hover:shadow-md hover:border-blue-500/60 transition-all group">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-cyan-500 text-white flex items-center justify-center shadow-md shadow-blue-500/30">
                  <Atom className="w-7 h-7" />
                </div>
                <span className="px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 text-xs font-bold uppercase tracking-wider font-mono">
                  Track 1
                </span>
              </div>

              <div>
                <h3 className="text-xl sm:text-2xl font-black text-foreground group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  React 19 &amp; Next.js App Router
                </h3>
                <p className="text-xs sm:text-sm text-muted leading-relaxed mt-2">
                  De los fundamentos de reconciliación y closures en hooks hasta Server Components (RSC), transiciones concurrentes, Server Actions y arquitectura de producción.
                </p>
              </div>

              {/* Características del track React */}
              <div className="grid grid-cols-2 gap-2.5 pt-2 text-xs">
                <div className="p-3 rounded-xl bg-card border border-border/80 flex items-center gap-2">
                  <Layers className="w-4 h-4 text-blue-500 shrink-0" />
                  <span><strong>8 Niveles</strong> (79 tópicos)</span>
                </div>
                <div className="p-3 rounded-xl bg-card border border-border/80 flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-blue-500 shrink-0" />
                  <span><strong>9 Preguntas</strong> Senior</span>
                </div>
                <div className="p-3 rounded-xl bg-card border border-border/80 flex items-center gap-2">
                  <Code2 className="w-4 h-4 text-blue-500 shrink-0" />
                  <span><strong>11 Ejercicios</strong> interactivos</span>
                </div>
                <div className="p-3 rounded-xl bg-card border border-border/80 flex items-center gap-2">
                  <CheckSquare className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Checklist con progreso</span>
                </div>
              </div>
            </div>

            <div className="space-y-3 pt-4 border-t border-border/60">
              <Link
                href="/react"
                className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 text-white font-extrabold text-sm shadow-md shadow-blue-500/25 hover:opacity-95 transition-all"
              >
                <span>Entrar a React &amp; Next.js</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>

              <div className="flex items-center justify-center gap-4 text-xs font-semibold text-muted">
                <Link href="/preguntas" className="hover:text-foreground hover:underline">
                  Preguntas Senior &gt;
                </Link>
                <Link href="/ejercicios" className="hover:text-foreground hover:underline">
                  Ejercicios React &gt;
                </Link>
                <Link href="/checklist" className="hover:text-foreground hover:underline">
                  Checklist React &gt;
                </Link>
              </div>
            </div>
          </div>

          {/* PISTA 2: JAVASCRIPT CORE & ES6+ */}
          <div className="rounded-3xl border border-amber-500/30 bg-gradient-to-b from-amber-500/10 via-card to-card p-6 sm:p-8 flex flex-col justify-between space-y-6 shadow-sm hover:shadow-md hover:border-amber-500/60 transition-all group">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-yellow-500 text-slate-950 flex items-center justify-center shadow-md shadow-amber-500/30">
                  <Terminal className="w-7 h-7" />
                </div>
                <span className="px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-300 text-xs font-bold uppercase tracking-wider font-mono">
                  Track 2
                </span>
              </div>

              <div>
                <h3 className="text-xl sm:text-2xl font-black text-foreground group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                  JavaScript Core &amp; Moderno (ES6+)
                </h3>
                <p className="text-xs sm:text-sm text-muted leading-relaxed mt-2">
                  De los misterios del motor V8 (hoisting, coerción, microtareas y event loop) a acertijos trampa y los 17 retos canónicos de algoritmos y polyfills.
                </p>
              </div>

              {/* Características del track JavaScript */}
              <div className="grid grid-cols-2 gap-2.5 pt-2 text-xs">
                <div className="p-3 rounded-xl bg-card border border-border/80 flex items-center gap-2">
                  <Zap className="w-4 h-4 text-amber-500 shrink-0" />
                  <span><strong>8 Niveles</strong> (81 preguntas)</span>
                </div>
                <div className="p-3 rounded-xl bg-card border border-border/80 flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-amber-500 shrink-0" />
                  <span><strong>12 Acertijos</strong> ¿Qué imprime?</span>
                </div>
                <div className="p-3 rounded-xl bg-card border border-border/80 flex items-center gap-2">
                  <Code2 className="w-4 h-4 text-amber-500 shrink-0" />
                  <span><strong>17 Retos</strong> con test suite</span>
                </div>
                <div className="p-3 rounded-xl bg-card border border-border/80 flex items-center gap-2">
                  <CheckSquare className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Checklist con progreso</span>
                </div>
              </div>
            </div>

            <div className="space-y-3 pt-4 border-t border-border/60">
              <Link
                href="/javascript"
                className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 font-extrabold text-sm shadow-md shadow-amber-500/25 hover:opacity-95 transition-all"
              >
                <span>Entrar a JavaScript Core</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>

              <div className="flex items-center justify-center gap-4 text-xs font-semibold text-muted">
                <Link href="/javascript/acertijos" className="hover:text-foreground hover:underline">
                  Acertijos &gt;
                </Link>
                <Link href="/javascript/ejercicios" className="hover:text-foreground hover:underline">
                  Retos E1–E17 &gt;
                </Link>
                <Link href="/javascript/checklist" className="hover:text-foreground hover:underline">
                  Checklist JS &gt;
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Matriz de Accesos Rápidos */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-foreground">
          Herramientas y Secciones Rápidas
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link
            href="/javascript/acertijos"
            className="p-5 rounded-2xl border border-border/80 bg-card hover:border-amber-500/40 hover:bg-muted/20 transition-all flex flex-col justify-between space-y-2 group"
          >
            <div className="space-y-1">
              <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center font-bold text-xs">
                ?
              </div>
              <h3 className="text-sm font-bold text-foreground group-hover:text-amber-500 transition-colors">
                Acertijos &quot;¿Qué imprime?&quot;
              </h3>
              <p className="text-xs text-muted">
                12 acertijos con simulación y trampa de entrevista explicada.
              </p>
            </div>
            <span className="text-[11px] font-bold text-amber-500 flex items-center gap-1 pt-2">
              Probar ahora &gt;
            </span>
          </Link>

          <Link
            href="/javascript/ejercicios"
            className="p-5 rounded-2xl border border-border/80 bg-card hover:border-amber-500/40 hover:bg-muted/20 transition-all flex flex-col justify-between space-y-2 group"
          >
            <div className="space-y-1">
              <div className="w-8 h-8 rounded-xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center font-bold text-xs">
                &lt;/&gt;
              </div>
              <h3 className="text-sm font-bold text-foreground group-hover:text-indigo-500 transition-colors">
                17 Retos de Algoritmos JS
              </h3>
              <p className="text-xs text-muted">
                Debounce, throttle, deepClone con ciclos, LRU y polyfills.
              </p>
            </div>
            <span className="text-[11px] font-bold text-indigo-500 flex items-center gap-1 pt-2">
              Ejecutar tests &gt;
            </span>
          </Link>

          <Link
            href="/preguntas"
            className="p-5 rounded-2xl border border-border/80 bg-card hover:border-blue-500/40 hover:bg-muted/20 transition-all flex flex-col justify-between space-y-2 group"
          >
            <div className="space-y-1">
              <div className="w-8 h-8 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center font-bold text-xs">
                9
              </div>
              <h3 className="text-sm font-bold text-foreground group-hover:text-blue-500 transition-colors">
                Preguntas Senior React
              </h3>
              <p className="text-xs text-muted">
                Simulador con red flags, respuestas canónicas y trampas.
              </p>
            </div>
            <span className="text-[11px] font-bold text-blue-500 flex items-center gap-1 pt-2">
              Simular entrevista &gt;
            </span>
          </Link>

          <Link
            href="/ejercicios"
            className="p-5 rounded-2xl border border-border/80 bg-card hover:border-cyan-500/40 hover:bg-muted/20 transition-all flex flex-col justify-between space-y-2 group"
          >
            <div className="space-y-1">
              <div className="w-8 h-8 rounded-xl bg-cyan-500/10 text-cyan-500 flex items-center justify-center font-bold text-xs">
                11
              </div>
              <h3 className="text-sm font-bold text-foreground group-hover:text-cyan-500 transition-colors">
                Ejercicios Prácticos React
              </h3>
              <p className="text-xs text-muted">
                Virtualización, debounce search, form con Zod y concurrencia.
              </p>
            </div>
            <span className="text-[11px] font-bold text-cyan-500 flex items-center gap-1 pt-2">
              Ver ejercicios &gt;
            </span>
          </Link>
        </div>
      </section>
    </div>
  );
}
