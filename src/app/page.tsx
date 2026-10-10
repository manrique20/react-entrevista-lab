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
  GraduationCap,
  Award,
  Clock,
  Split,
  Brain,
  Trash2
} from 'lucide-react';
import { LEVELS } from '@/data/levelsData';
import { jsLevelsData } from '@/data/javascript/levelsData';
import { allJsTopics } from '@/data/javascript/topicsData';
import { TOPICS } from '@/data/topicsData';
import { jsRiddlesData } from '@/data/javascript/riddlesData';
import { jsExercisesData } from '@/data/javascript/exercisesData';
import { reactRiddlesData } from '@/data/reactRiddlesData';
import { INTERVIEW_QUESTIONS } from '@/data/interviewQuestions';
import { EXERCISES } from '@/data/exercisesData';

export default function UnifiedPortalHub() {
  const [reactCompleted, setReactCompleted] = useState(0);
  const [jsCompleted, setJsCompleted] = useState(0);
  const [jsRiddlesCompleted, setJsRiddlesCompleted] = useState(0);
  const [reactRiddlesCompleted, setReactRiddlesCompleted] = useState(0);
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

        const savedReactRiddles = localStorage.getItem('react_riddles_mastered');
        if (savedReactRiddles) setReactRiddlesCompleted(JSON.parse(savedReactRiddles).length);

        const savedExercises = localStorage.getItem('js_exercises_completed');
        if (savedExercises) setJsExercisesCompleted(JSON.parse(savedExercises).length);
      } catch {
        // Fallback
      }
    };
    updateStats();
    window.addEventListener('storage', updateStats);
    return () => window.removeEventListener('storage', updateStats);
  }, []);

  const totalTopics = TOPICS.length + allJsTopics.length; // 79 + 81 = 160
  const totalCompletedTopics = reactCompleted + jsCompleted;
  const globalPercent = Math.round((totalCompletedTopics / totalTopics) * 100);

  return (
    <div className="space-y-12 pb-20">
      {/* Primary Hero */}
      <section className="relative overflow-hidden rounded-3xl border border-border/80 bg-gradient-to-b from-primary/5 via-card to-card p-6 sm:p-12 text-center space-y-6 shadow-sm">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold tracking-wide uppercase">
          <Sparkles className="w-4 h-4 animate-pulse" />
          <span>Frontend Interview Mastery Hub</span>
        </div>

        <div className="w-full max-w-5xl mx-auto space-y-4">
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-foreground leading-tight sm:leading-tight lg:leading-[1.15] break-words pb-1">
            The Definitive Frontend{' '}
            <span className="bg-gradient-to-r from-blue-500 via-indigo-500 to-amber-500 bg-clip-text text-transparent">
              Interview Laboratory
            </span>
          </h1>
          <p className="text-sm sm:text-base text-muted leading-relaxed max-w-3xl mx-auto">
            Rigorous, hands-on preparation across two dedicated tracks: modern <strong>React 19 &amp; Next.js</strong> architecture and core <strong>JavaScript V8</strong> runtime internals.
          </p>
        </div>

        {/* Global Progress Overview */}
        <div className="w-full max-w-2xl mx-auto p-5 rounded-2xl bg-card border border-border/80 shadow-xs space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-bold">
            <span className="flex items-center gap-1.5 text-foreground">
              <Activity className="w-4 h-4 text-emerald-500" />
              Overall Study Progress
            </span>
            <span className="text-primary font-mono">{totalCompletedTopics} / {totalTopics} topics mastered ({globalPercent}%)</span>
          </div>
          <div className="w-full h-2.5 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-amber-500 transition-all duration-500"
              style={{ width: `${globalPercent}%` }}
            />
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-[11px] text-muted text-center pt-1 font-medium">
            <span className="p-1.5 rounded-xl bg-muted/40 border border-border/60">React: {reactCompleted}/79</span>
            <span className="p-1.5 rounded-xl bg-muted/40 border border-border/60">JS Core: {jsCompleted}/81</span>
            <span className="p-1.5 rounded-xl bg-muted/40 border border-border/60">JS Riddles: {jsRiddlesCompleted}/{jsRiddlesData.length}</span>
            <span className="p-1.5 rounded-xl bg-muted/40 border border-border/60">React Riddles: {reactRiddlesCompleted}/{reactRiddlesData.length}</span>
            <span className="p-1.5 rounded-xl bg-muted/40 border border-border/60">JS Challenges: {jsExercisesCompleted}/{jsExercisesData.length}</span>
          </div>
        </div>
      </section>

      {/* Dual Track Cards */}
      <section className="space-y-4">
        <div className="text-center sm:text-left space-y-1">
          <h2 className="text-2xl font-black text-foreground">
            Choose Your Study Track
          </h2>
          <p className="text-xs sm:text-sm text-muted">
            Both learning roadmaps include structured levels, senior questions, runnable code playgrounds, and live test runners.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* TRACK 1: REACT 19 & NEXT.JS */}
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
                  From reconciliation fundamentals and hook closures to Server Components (RSC), concurrent transitions, Server Actions, and enterprise frontend architecture.
                </p>
              </div>

              {/* React Track Specs */}
              <div className="grid grid-cols-2 gap-2.5 pt-2 text-xs">
                <div className="p-3 rounded-xl bg-card border border-border/80 flex items-center gap-2">
                  <Layers className="w-4 h-4 text-blue-500 shrink-0" />
                  <span><strong>8 Levels</strong> (79 topics)</span>
                </div>
                <div className="p-3 rounded-xl bg-card border border-border/80 flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-blue-500 shrink-0" />
                  <span><strong>{INTERVIEW_QUESTIONS.length} Questions</strong> Senior</span>
                </div>
                <div className="p-3 rounded-xl bg-card border border-border/80 flex items-center gap-2">
                  <Code2 className="w-4 h-4 text-blue-500 shrink-0" />
                  <span><strong>{EXERCISES.length} Exercises</strong> Interactive</span>
                </div>
                <div className="p-3 rounded-xl bg-card border border-border/80 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-cyan-500 shrink-0" />
                  <span><strong>{reactRiddlesData.length} Riddles</strong> What renders?</span>
                </div>
              </div>
            </div>

            <div className="space-y-3 pt-4 border-t border-border/60">
              <Link
                href="/react"
                className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 text-white font-extrabold text-sm shadow-md shadow-blue-500/25 hover:opacity-95 transition-all"
              >
                <span>Enter React &amp; Next.js</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>

              <div className="flex flex-wrap items-center justify-center gap-3 text-xs font-semibold text-muted">
                <Link href="/react/acertijos" className="text-blue-600 dark:text-blue-400 hover:underline">
                  React Riddles &gt;
                </Link>
                <Link href="/preguntas" className="hover:text-foreground hover:underline">
                  Senior Questions &gt;
                </Link>
                <Link href="/ejercicios" className="hover:text-foreground hover:underline">
                  Exercises ({EXERCISES.length}) &gt;
                </Link>
                <Link href="/checklist" className="hover:text-foreground hover:underline">
                  React Checklist &gt;
                </Link>
              </div>
            </div>
          </div>

          {/* TRACK 2: JAVASCRIPT CORE & ES6+ */}
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
                  JavaScript Core &amp; Modern (ES6+)
                </h3>
                <p className="text-xs sm:text-sm text-muted leading-relaxed mt-2">
                  From V8 engine mysteries (hoisting, coercion, microtasks, and the event loop) to tricky riddle execution and {jsExercisesData.length} canonical algorithm &amp; polyfill challenges.
                </p>
              </div>

              {/* JavaScript Track Specs */}
              <div className="grid grid-cols-2 gap-2.5 pt-2 text-xs">
                <div className="p-3 rounded-xl bg-card border border-border/80 flex items-center gap-2">
                  <Zap className="w-4 h-4 text-amber-500 shrink-0" />
                  <span><strong>8 Levels</strong> (81 topics)</span>
                </div>
                <div className="p-3 rounded-xl bg-card border border-border/80 flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-amber-500 shrink-0" />
                  <span><strong>{jsRiddlesData.length} Riddles</strong> What logs?</span>
                </div>
                <div className="p-3 rounded-xl bg-card border border-border/80 flex items-center gap-2">
                  <Code2 className="w-4 h-4 text-amber-500 shrink-0" />
                  <span><strong>{jsExercisesData.length} Challenges</strong> Test Suite</span>
                </div>
                <div className="p-3 rounded-xl bg-card border border-border/80 flex items-center gap-2">
                  <CheckSquare className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Progress Checklist</span>
                </div>
              </div>
            </div>

            <div className="space-y-3 pt-4 border-t border-border/60">
              <Link
                href="/javascript"
                className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 font-extrabold text-sm shadow-md shadow-amber-500/25 hover:opacity-95 transition-all"
              >
                <span>Enter JavaScript Core</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>

              <div className="flex flex-wrap items-center justify-center gap-3 text-xs font-semibold text-muted">
                <Link href="/javascript/acertijos" className="text-amber-600 dark:text-amber-400 hover:underline">
                  JS Riddles ({jsRiddlesData.length}) &gt;
                </Link>
                <Link href="/javascript/ejercicios" className="hover:text-foreground hover:underline">
                  Challenges ({jsExercisesData.length}) &gt;
                </Link>
                <Link href="/javascript/checklist" className="hover:text-foreground hover:underline">
                  JS Checklist &gt;
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Labs Section */}
      <section className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-foreground flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-cyan-500" />
              <span>High-Performance Interactive Labs</span>
            </h2>
            <p className="text-xs sm:text-sm text-muted">
              Visual tools, memory monitors, and simulations engineered to master the most challenging aspects of senior frontend interviews.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card 1: Mock Interview Simulator */}
          <div className="relative overflow-hidden rounded-3xl border border-indigo-500/30 bg-gradient-to-br from-indigo-500/10 via-card to-card p-6 sm:p-8 flex flex-col justify-between space-y-6 shadow-sm hover:shadow-md hover:border-indigo-500/60 transition-all group">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-md shadow-indigo-500/30">
                  <Award className="w-6 h-6" />
                </div>
                <span className="px-3 py-1 rounded-full bg-indigo-500/15 border border-indigo-500/30 text-indigo-600 dark:text-indigo-400 text-xs font-bold font-mono">
                  Timer &amp; Seniority Score
                </span>
              </div>

              <div>
                <h3 className="text-xl sm:text-2xl font-black text-foreground group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                  Technical Mock Interview Simulator
                </h3>
                <p className="text-xs sm:text-sm text-muted leading-relaxed mt-2">
                  Experience a realistic 15, 30, or 45-minute technical round. Answer senior conceptual questions,
                  solve tricky output riddles, and pass live coding challenges with an in-browser test runner to diagnose your seniority level.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
                <span className="px-2.5 py-1 rounded-lg bg-card border border-border/80 font-medium">15/30/45 min</span>
                <span className="px-2.5 py-1 rounded-lg bg-card border border-border/80 font-medium">React + JS + Algorithms</span>
                <span className="px-2.5 py-1 rounded-lg bg-card border border-border/80 font-medium">Staff / Senior Diagnosis</span>
              </div>
            </div>

            <div className="pt-4 border-t border-border/60">
              <Link
                href="/simulador"
                className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-indigo-600 to-cyan-600 text-white font-extrabold text-sm shadow-md shadow-indigo-500/25 hover:opacity-95 transition-all"
              >
                <span>Start Mock Interview</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>

          {/* Card 2: Re-renders Visualizer */}
          <div className="relative overflow-hidden rounded-3xl border border-cyan-500/30 bg-gradient-to-br from-cyan-500/10 via-card to-card p-6 sm:p-8 flex flex-col justify-between space-y-6 shadow-sm hover:shadow-md hover:border-cyan-500/60 transition-all group">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-cyan-600 text-white flex items-center justify-center shadow-md shadow-cyan-500/30">
                  <Layers className="w-6 h-6" />
                </div>
                <span className="px-3 py-1 rounded-full bg-cyan-500/15 border border-cyan-500/30 text-cyan-600 dark:text-cyan-400 text-xs font-bold font-mono">
                  Real-Time Virtual DOM
                </span>
              </div>

              <div>
                <h3 className="text-xl sm:text-2xl font-black text-foreground group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">
                  React Re-renders Visualizer
                </h3>
                <p className="text-xs sm:text-sm text-muted leading-relaxed mt-2">
                  Why does a child re-render when its parent updates? Watch live Virtual DOM render pulses and experiment across 6 reconciliation scenarios:
                  <code className="text-cyan-600 dark:text-cyan-400 font-mono"> React.memo</code>,
                  <code className="text-cyan-600 dark:text-cyan-400 font-mono"> useCallback</code>, and the
                  <code className="text-cyan-600 dark:text-cyan-400 font-mono"> children slot pattern</code>.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
                <span className="px-2.5 py-1 rounded-lg bg-card border border-border/80 font-medium">6 Live Scenarios</span>
                <span className="px-2.5 py-1 rounded-lg bg-card border border-border/80 font-medium">Render pulse effects</span>
                <span className="px-2.5 py-1 rounded-lg bg-card border border-border/80 font-medium">Reconciliation logs</span>
              </div>
            </div>

            <div className="pt-4 border-t border-border/60">
              <Link
                href="/react/re-renders"
                className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-extrabold text-sm shadow-md shadow-cyan-500/25 hover:opacity-95 transition-all"
              >
                <span>Open Re-renders Visualizer</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>

          {/* Card 3: Senior Refactorings */}
          <div className="relative overflow-hidden rounded-3xl border border-emerald-500/30 bg-gradient-to-br from-emerald-500/10 via-card to-card p-6 sm:p-8 flex flex-col justify-between space-y-6 shadow-sm hover:shadow-md hover:border-emerald-500/60 transition-all group">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-md shadow-emerald-500/30">
                  <Split className="w-6 h-6" />
                </div>
                <span className="px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-bold font-mono">
                  Code Smells &amp; Split Diff
                </span>
              </div>

              <div>
                <h3 className="text-xl sm:text-2xl font-black text-foreground group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                  Senior Refactoring Laboratory
                </h3>
                <p className="text-xs sm:text-sm text-muted leading-relaxed mt-2">
                  What smells do you identify in this component and how would you refactor it? Master production scenarios: cascading useEffects,
                  compound components, network race conditions, and state machines with split diff viewer.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
                <span className="px-2.5 py-1 rounded-lg bg-card border border-border/80 font-medium">5 Case Studies</span>
                <span className="px-2.5 py-1 rounded-lg bg-card border border-border/80 font-medium">Split Diff Viewer</span>
                <span className="px-2.5 py-1 rounded-lg bg-card border border-border/80 font-medium">SOLID Reasoning</span>
              </div>
            </div>

            <div className="pt-4 border-t border-border/60">
              <Link
                href="/refactorings"
                className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-extrabold text-sm shadow-md shadow-emerald-500/25 hover:opacity-95 transition-all"
              >
                <span>Explore Refactoring Cases</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>

          {/* Card 4: Frontend System Design */}
          <div className="relative overflow-hidden rounded-3xl border border-purple-500/30 bg-gradient-to-br from-purple-500/10 via-card to-card p-6 sm:p-8 flex flex-col justify-between space-y-6 shadow-sm hover:shadow-md hover:border-purple-500/60 transition-all group">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-purple-600 text-white flex items-center justify-center shadow-md shadow-purple-500/30">
                  <Cpu className="w-6 h-6" />
                </div>
                <span className="px-3 py-1 rounded-full bg-purple-500/15 border border-purple-500/30 text-purple-600 dark:text-purple-400 text-xs font-bold font-mono">
                  Staff &amp; Principal Tier
                </span>
              </div>

              <div>
                <h3 className="text-xl sm:text-2xl font-black text-foreground group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                  Frontend System Design &amp; Architecture
                </h3>
                <p className="text-xs sm:text-sm text-muted leading-relaxed mt-2">
                  The pivotal round for high-seniority compensation bands. Learn to design 60 FPS infinite feeds,
                  global e-commerce with RSC, real-time collaborative editors with CRDTs, and silent refresh authentication.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
                <span className="px-2.5 py-1 rounded-lg bg-card border border-border/80 font-medium">4 Massive Blueprints</span>
                <span className="px-2.5 py-1 rounded-lg bg-card border border-border/80 font-medium">Architecture Diagrams</span>
                <span className="px-2.5 py-1 rounded-lg bg-card border border-border/80 font-medium">Staff Trap Questions</span>
              </div>
            </div>

            <div className="pt-4 border-t border-border/60">
              <Link
                href="/system-design"
                className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-extrabold text-sm shadow-md shadow-purple-500/25 hover:opacity-95 transition-all"
              >
                <span>View System Designs</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Access Matrix */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-foreground">
          Quick Tools &amp; Hub Sections
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-3.5">
          <Link
            href="/react/acertijos"
            className="p-5 rounded-2xl border border-border/80 bg-card hover:border-blue-500/40 hover:bg-muted/20 transition-all flex flex-col justify-between space-y-2 group"
          >
            <div className="space-y-1">
              <div className="w-8 h-8 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold text-xs">
                ⚛
              </div>
              <h3 className="text-sm font-bold text-foreground group-hover:text-blue-500 transition-colors">
                React Riddles
              </h3>
              <p className="text-xs text-muted">
                {reactRiddlesData.length} interactive puzzles: batching, keys, and closures.
              </p>
            </div>
            <span className="text-[11px] font-bold text-blue-500 flex items-center gap-1 pt-2">
              Solve now &gt;
            </span>
          </Link>

          <Link
            href="/javascript/acertijos"
            className="p-5 rounded-2xl border border-border/80 bg-card hover:border-amber-500/40 hover:bg-muted/20 transition-all flex flex-col justify-between space-y-2 group"
          >
            <div className="space-y-1">
              <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center font-bold text-xs">
                ?
              </div>
              <h3 className="text-sm font-bold text-foreground group-hover:text-amber-500 transition-colors">
                JS Riddles &quot;What logs?&quot;
              </h3>
              <p className="text-xs text-muted">
                {jsRiddlesData.length} riddles: coercion, hoisting, and event loop.
              </p>
            </div>
            <span className="text-[11px] font-bold text-amber-500 flex items-center gap-1 pt-2">
              Try now &gt;
            </span>
          </Link>

          <Link
            href="/javascript/ejercicios"
            className="p-5 rounded-2xl border border-border/80 bg-card hover:border-indigo-500/40 hover:bg-muted/20 transition-all flex flex-col justify-between space-y-2 group"
          >
            <div className="space-y-1">
              <div className="w-8 h-8 rounded-xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center font-bold text-xs">
                &lt;/&gt;
              </div>
              <h3 className="text-sm font-bold text-foreground group-hover:text-indigo-500 transition-colors">
                {jsExercisesData.length} JS Challenges
              </h3>
              <p className="text-xs text-muted">
                reverseSentence, debounce, deepClone, LRU, and polyfills.
              </p>
            </div>
            <span className="text-[11px] font-bold text-indigo-500 flex items-center gap-1 pt-2">
              Run tests &gt;
            </span>
          </Link>

          <Link
            href="/preguntas"
            className="p-5 rounded-2xl border border-border/80 bg-card hover:border-purple-500/40 hover:bg-muted/20 transition-all flex flex-col justify-between space-y-2 group"
          >
            <div className="space-y-1">
              <div className="w-8 h-8 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center font-bold text-xs">
                {INTERVIEW_QUESTIONS.length}
              </div>
              <h3 className="text-sm font-bold text-foreground group-hover:text-purple-500 transition-colors">
                React Senior Q&amp;A
              </h3>
              <p className="text-xs text-muted">
                Simulator with red flags, Server Actions, and traps.
              </p>
            </div>
            <span className="text-[11px] font-bold text-purple-500 flex items-center gap-1 pt-2">
              Simulate Q&amp;A &gt;
            </span>
          </Link>

          <Link
            href="/ejercicios"
            className="p-5 rounded-2xl border border-border/80 bg-card hover:border-cyan-500/40 hover:bg-muted/20 transition-all flex flex-col justify-between space-y-2 group"
          >
            <div className="space-y-1">
              <div className="w-8 h-8 rounded-xl bg-cyan-500/10 text-cyan-500 flex items-center justify-center font-bold text-xs">
                {EXERCISES.length}
              </div>
              <h3 className="text-sm font-bold text-foreground group-hover:text-cyan-500 transition-colors">
                React Exercises
              </h3>
              <p className="text-xs text-muted">
                Optimistic UI, Star Rating, Zod, Debounce, and Virtualization.
              </p>
            </div>
            <span className="text-[11px] font-bold text-cyan-500 flex items-center gap-1 pt-2">
              View exercises &gt;
            </span>
          </Link>

          <Link
            href="/flashcards"
            className="p-5 rounded-2xl border border-border/80 bg-card hover:border-cyan-500/40 hover:bg-muted/20 transition-all flex flex-col justify-between space-y-2 group"
          >
            <div className="space-y-1">
              <div className="w-8 h-8 rounded-xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 flex items-center justify-center font-bold text-xs">
                🎴
              </div>
              <h3 className="text-sm font-bold text-foreground group-hover:text-cyan-500 transition-colors">
                Flashcards (160)
              </h3>
              <p className="text-xs text-muted">
                Spaced repetition and agile memorization with 3D cards.
              </p>
            </div>
            <span className="text-[11px] font-bold text-cyan-500 flex items-center gap-1 pt-2">
              Review now &gt;
            </span>
          </Link>

          <Link
            href="/javascript/memory-leaks"
            className="p-5 rounded-2xl border border-border/80 bg-card hover:border-rose-500/40 hover:bg-muted/20 transition-all flex flex-col justify-between space-y-2 group"
          >
            <div className="space-y-1">
              <div className="w-8 h-8 rounded-xl bg-rose-500/10 text-rose-500 flex items-center justify-center font-bold text-xs">
                🧹
              </div>
              <h3 className="text-sm font-bold text-foreground group-hover:text-rose-500 transition-colors">
                V8 Memory Leaks
              </h3>
              <p className="text-xs text-muted">
                Heap memory, detached DOM nodes, and interactive V8 GC.
              </p>
            </div>
            <span className="text-[11px] font-bold text-rose-500 flex items-center gap-1 pt-2">
              Debug leaks &gt;
            </span>
          </Link>
        </div>
      </section>
    </div>
  );
}
