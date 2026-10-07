'use client';

import React, { useState, useEffect } from 'react';
import { JsImplementationExercise } from '@/types/javascript';
import { JsConsoleRunner } from './JsConsoleRunner';
import confetti from 'canvas-confetti';
import {
  Code2,
  CheckCircle2,
  Copy,
  Check,
  Play,
  Lightbulb,
  Terminal,
  Bookmark,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

interface JsExerciseTesterProps {
  exercise: JsImplementationExercise;
  index: number;
}

export function JsExerciseTester({ exercise, index }: JsExerciseTesterProps) {
  const [activeTab, setActiveTab] = useState<'solution' | 'runner'>('solution');
  const [isCompleted, setIsCompleted] = useState(false);
  const [hasCopied, setHasCopied] = useState(false);
  const [showHints, setShowHints] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('js_exercises_completed');
      if (saved) {
        const list: string[] = JSON.parse(saved);
        if (list.includes(exercise.id)) {
          setIsCompleted(true);
        }
      }
    } catch {
      // Ignore
    }
  }, [exercise.id]);

  const toggleCompleted = () => {
    try {
      const saved = localStorage.getItem('js_exercises_completed');
      let list: string[] = saved ? JSON.parse(saved) : [];
      if (isCompleted) {
        list = list.filter(id => id !== exercise.id);
        setIsCompleted(false);
      } else {
        list.push(exercise.id);
        setIsCompleted(true);
        confetti({ particleCount: 40, spread: 60, origin: { y: 0.8 } });
      }
      localStorage.setItem('js_exercises_completed', JSON.stringify(list));
    } catch {
      // Ignore
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(exercise.solutionCode);
    setHasCopied(true);
    setTimeout(() => setHasCopied(false), 2000);
  };

  const fullPlaygroundCode = `${exercise.solutionCode}\n\n${exercise.testCasesCode}`;

  const categoryColors: Record<string, string> = {
    Funcional: 'bg-indigo-500/10 text-indigo-500 border-indigo-500/20',
    Asincronía: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
    'Estructuras de Datos': 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
    Algoritmos: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
    Polyfills: 'bg-purple-500/10 text-purple-500 border-purple-500/20',
    Objetos: 'bg-rose-500/10 text-rose-500 border-rose-500/20'
  };

  return (
    <div className="rounded-2xl border border-border/70 bg-card overflow-hidden shadow-sm hover:shadow-md transition-all">
      {/* Header */}
      <div className="p-5 border-b border-border/60 bg-muted/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 flex items-center justify-center font-bold text-sm">
            {exercise.id}
          </div>
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${categoryColors[exercise.category] || 'bg-muted text-muted'}`}>
                {exercise.category}
              </span>
              <span className="text-[11px] text-muted font-medium">Ejercicio #{index + 1}</span>
            </div>
            <h3 className="text-base font-bold text-foreground">{exercise.title}</h3>
          </div>
        </div>

        <button
          onClick={toggleCompleted}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all border ${
            isCompleted
              ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30'
              : 'bg-muted/40 hover:bg-muted text-muted hover:text-foreground border-border/80'
          }`}
        >
          <CheckCircle2 className={`w-3.5 h-3.5 ${isCompleted ? 'text-emerald-500' : ''}`} />
          <span>{isCompleted ? 'Completado' : 'Marcar como completado'}</span>
        </button>
      </div>

      {/* Description */}
      <div className="p-5 space-y-4">
        <div className="p-3.5 rounded-xl bg-muted/30 border border-border/70 text-xs text-muted leading-relaxed whitespace-pre-line">
          {exercise.description}
        </div>

        {/* Tab switchers */}
        <div className="flex items-center justify-between border-b border-border/60 pb-2">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('solution')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'solution'
                  ? 'bg-amber-500/15 text-amber-700 dark:text-amber-400 border border-amber-500/30'
                  : 'text-muted hover:text-foreground'
              }`}
            >
              <Code2 className="w-3.5 h-3.5" />
              <span>Solución Senior Canónica</span>
            </button>

            <button
              onClick={() => setActiveTab('runner')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'runner'
                  ? 'bg-amber-500/15 text-amber-700 dark:text-amber-400 border border-amber-500/30'
                  : 'text-muted hover:text-foreground'
              }`}
            >
              <Terminal className="w-3.5 h-3.5" />
              <span>Ejecutar Test Suite en Vivo</span>
            </button>
          </div>

          {activeTab === 'solution' && (
            <button
              onClick={handleCopy}
              className="flex items-center gap-1 text-[11px] text-muted hover:text-foreground transition-colors"
            >
              {hasCopied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              <span>{hasCopied ? 'Copiado' : 'Copiar código'}</span>
            </button>
          )}
        </div>

        {/* Tab Content */}
        {activeTab === 'solution' ? (
          <div className="rounded-xl bg-slate-950 p-4 border border-slate-800 text-slate-100 font-mono text-xs overflow-x-auto shadow-inner">
            <pre className="text-amber-200/90 leading-relaxed">{exercise.solutionCode}</pre>
          </div>
        ) : (
          <div className="space-y-2">
            <JsConsoleRunner
              initialCode={fullPlaygroundCode}
              title={`Test Runner: ${exercise.title}`}
              autoRun={true}
            />
          </div>
        )}

        {/* Hints */}
        {exercise.hints && exercise.hints.length > 0 && (
          <div className="pt-1">
            <button
              onClick={() => setShowHints(!showHints)}
              className="flex items-center gap-1.5 text-xs text-amber-600 dark:text-amber-400 font-semibold hover:underline"
            >
              <Lightbulb className="w-3.5 h-3.5" />
              <span>{showHints ? 'Ocultar consejos técnicos' : 'Ver consejos clave para la entrevista'}</span>
              {showHints ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            </button>

            {showHints && (
              <ul className="mt-2.5 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-muted space-y-1.5 list-disc list-inside">
                {exercise.hints.map((hint, hIdx) => (
                  <li key={hIdx}>{hint}</li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
