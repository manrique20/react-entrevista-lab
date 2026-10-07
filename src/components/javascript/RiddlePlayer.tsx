'use client';

import React, { useState, useEffect } from 'react';
import { JsRiddle } from '@/types/javascript';
import { JsConsoleRunner } from './JsConsoleRunner';
import confetti from 'canvas-confetti';
import {
  HelpCircle,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  Terminal,
  ChevronDown,
  ChevronUp,
  Sparkles,
  RefreshCw
} from 'lucide-react';

interface RiddlePlayerProps {
  riddle: JsRiddle;
  index: number;
}

export function RiddlePlayer({ riddle, index }: RiddlePlayerProps) {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isRevealed, setIsRevealed] = useState(false);
  const [showConsole, setShowConsole] = useState(false);
  const [isMastered, setIsMastered] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('js_riddles_mastered');
      if (saved) {
        const list: string[] = JSON.parse(saved);
        if (list.includes(riddle.id)) {
          setIsMastered(true);
        }
      }
    } catch {
      // Ignore
    }
  }, [riddle.id]);

  const toggleMastered = () => {
    try {
      const saved = localStorage.getItem('js_riddles_mastered');
      let list: string[] = saved ? JSON.parse(saved) : [];
      if (isMastered) {
        list = list.filter(id => id !== riddle.id);
        setIsMastered(false);
      } else {
        list.push(riddle.id);
        setIsMastered(true);
        confetti({ particleCount: 40, spread: 60, origin: { y: 0.8 } });
      }
      localStorage.setItem('js_riddles_mastered', JSON.stringify(list));
    } catch {
      // Ignore
    }
  };

  const handleReveal = () => {
    setIsRevealed(true);
    if (selectedOption === riddle.expectedOutput) {
      confetti({ particleCount: 70, spread: 70, origin: { y: 0.7 } });
    }
  };

  const handleReset = () => {
    setSelectedOption(null);
    setIsRevealed(false);
  };

  return (
    <div className="rounded-2xl border border-border/70 bg-card overflow-hidden shadow-sm hover:shadow-md transition-all">
      {/* Header */}
      <div className="p-5 border-b border-border/60 bg-muted/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 flex items-center justify-center font-bold text-sm">
            {riddle.id}
          </div>
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-muted">
              Acertijo #{index + 1}
            </span>
            <h3 className="text-base font-bold text-foreground">{riddle.title}</h3>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={toggleMastered}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all border ${
              isMastered
                ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30'
                : 'bg-muted/40 hover:bg-muted text-muted hover:text-foreground border-border/80'
            }`}
          >
            <CheckCircle2 className={`w-3.5 h-3.5 ${isMastered ? 'text-emerald-500' : ''}`} />
            <span>{isMastered ? 'Dominado' : 'Marcar como dominado'}</span>
          </button>
        </div>
      </div>

      {/* Code Display */}
      <div className="p-5 space-y-4">
        <div>
          <div className="flex items-center justify-between text-xs text-muted font-medium mb-1.5">
            <span className="flex items-center gap-1.5">
              <HelpCircle className="w-3.5 h-3.5 text-amber-500" />
              ¿Qué imprime este código?
            </span>
            <button
              onClick={() => setShowConsole(!showConsole)}
              className="flex items-center gap-1 text-[11px] text-amber-600 dark:text-amber-400 hover:underline font-mono"
            >
              <Terminal className="w-3 h-3" />
              {showConsole ? 'Ocultar consola' : 'Abrir en consola interactiva'}
            </button>
          </div>

          <div className="rounded-xl bg-slate-950 p-4 border border-slate-800 text-slate-100 font-mono text-xs overflow-x-auto shadow-inner">
            <pre className="text-amber-200/95 leading-relaxed">{riddle.codeSnippet}</pre>
          </div>
        </div>

        {/* Live Console Sandbox */}
        {showConsole && (
          <div className="animate-in fade-in slide-in-from-top-2 pt-2">
            <JsConsoleRunner
              initialCode={riddle.codeSnippet}
              title={`Consola: ${riddle.title}`}
              autoRun={true}
            />
          </div>
        )}

        {/* Prediction Options */}
        <div className="space-y-2 pt-1">
          <p className="text-xs font-semibold text-foreground flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            Elige tu predicción antes de revelar la respuesta:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {riddle.options.map((opt, oIdx) => {
              const isSelected = selectedOption === opt;
              const isCorrect = isRevealed && opt === riddle.expectedOutput;
              const isWrong = isRevealed && isSelected && opt !== riddle.expectedOutput;

              let btnStyle = 'border-border/80 bg-muted/20 hover:bg-muted/50 text-foreground';
              if (isSelected && !isRevealed) {
                btnStyle = 'border-amber-500/60 bg-amber-500/10 text-amber-700 dark:text-amber-300 font-semibold';
              } else if (isCorrect) {
                btnStyle = 'border-emerald-500/60 bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 font-bold';
              } else if (isWrong) {
                btnStyle = 'border-red-500/60 bg-red-500/15 text-red-600 dark:text-red-400 line-through';
              }

              return (
                <button
                  key={oIdx}
                  disabled={isRevealed}
                  onClick={() => setSelectedOption(opt)}
                  className={`p-3 rounded-xl border text-left text-xs font-mono transition-all flex items-center justify-between gap-2 ${btnStyle}`}
                >
                  <span className="truncate">{opt}</span>
                  {isCorrect && <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 pt-2">
          {!isRevealed ? (
            <button
              onClick={handleReveal}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 font-bold text-xs shadow-md shadow-amber-500/20 hover:opacity-95 transition-all flex items-center gap-1.5"
            >
              <span>Revelar salida y explicación</span>
              <ChevronDown className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              onClick={handleReset}
              className="px-3.5 py-1.5 rounded-xl border border-border/80 text-xs font-semibold hover:bg-muted text-muted transition-all flex items-center gap-1.5"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Volver a intentar</span>
            </button>
          )}
        </div>

        {/* Revealed Section */}
        {isRevealed && (
          <div className="space-y-4 pt-3 border-t border-border/60 animate-in fade-in slide-in-from-top-2">
            {/* Salida Exacta */}
            <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30">
              <span className="text-[11px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 block mb-1">
                Salida Real de JavaScript
              </span>
              <pre className="font-mono text-xs font-bold text-foreground whitespace-pre-wrap">
                {riddle.expectedOutput}
              </pre>
            </div>

            {/* Explicación Técnica */}
            <div className="p-3.5 rounded-xl bg-card border border-border/70 text-xs space-y-1.5">
              <div className="flex items-center gap-1.5 font-bold text-foreground">
                <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
                <span>¿Por qué ocurre esto?</span>
              </div>
              <p className="text-muted leading-relaxed whitespace-pre-line">
                {riddle.explanation}
              </p>
            </div>

            {/* Trampa de Entrevista */}
            <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/25 text-xs space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-rose-600 dark:text-rose-400">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>La Trampa de Entrevista</span>
              </div>
              <p className="text-muted leading-relaxed">
                {riddle.trapExplanation}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
