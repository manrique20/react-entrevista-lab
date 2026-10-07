'use client';

import React, { useState, useEffect } from 'react';
import { JsTopic } from '@/types/javascript';
import { JsConsoleRunner } from './JsConsoleRunner';
import confetti from 'canvas-confetti';
import {
  CheckCircle2,
  Terminal,
  Copy,
  Check,
  AlertTriangle,
  Lightbulb,
  ChevronDown,
  ChevronUp,
  Share2,
  Sparkles
} from 'lucide-react';

interface JsTopicCardProps {
  topic: JsTopic;
}

export function JsTopicCard({ topic }: JsTopicCardProps) {
  const [isStudied, setIsStudied] = useState(false);
  const [showConsole, setShowConsole] = useState(false);
  const [hasCopied, setHasCopied] = useState(false);
  const [isExplanationOpen, setIsExplanationOpen] = useState(true);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('js_topics_studied');
      if (saved) {
        const list: string[] = JSON.parse(saved);
        if (list.includes(topic.id)) {
          setIsStudied(true);
        }
      }
    } catch {
      // Ignore
    }
  }, [topic.id]);

  const toggleStudied = () => {
    try {
      const saved = localStorage.getItem('js_topics_studied');
      let list: string[] = saved ? JSON.parse(saved) : [];
      if (isStudied) {
        list = list.filter(id => id !== topic.id);
        setIsStudied(false);
      } else {
        list.push(topic.id);
        setIsStudied(true);
        confetti({ particleCount: 35, spread: 50, origin: { y: 0.8 } });
      }
      localStorage.setItem('js_topics_studied', JSON.stringify(list));
    } catch {
      // Ignore
    }
  };

  const handleCopyCode = () => {
    if (!topic.codeSnippet) return;
    navigator.clipboard.writeText(topic.codeSnippet);
    setHasCopied(true);
    setTimeout(() => setHasCopied(false), 2000);
  };

  return (
    <article
      id={topic.id}
      className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
        isStudied
          ? 'bg-card/70 border-emerald-500/40 shadow-sm'
          : 'bg-card border-border/80 hover:border-amber-500/40 shadow-sm'
      }`}
    >
      {/* Header */}
      <div className="p-5 border-b border-border/60 bg-muted/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-yellow-500 text-slate-950 font-black flex items-center justify-center text-sm shadow-md shadow-amber-500/20 shrink-0">
            {topic.id}
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/20 uppercase tracking-wider">
                {topic.levelTitle}
              </span>
              {topic.tags.slice(0, 3).map((tag, tIdx) => (
                <span key={tIdx} className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-muted text-muted">
                  #{tag}
                </span>
              ))}
            </div>
            <h2 className="text-base sm:text-lg font-bold text-foreground leading-snug">
              {topic.question}
            </h2>
          </div>
        </div>

        <button
          onClick={toggleStudied}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all border shrink-0 ${
            isStudied
              ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30'
              : 'bg-muted/40 hover:bg-muted text-muted hover:text-foreground border-border/80'
          }`}
        >
          <CheckCircle2 className={`w-3.5 h-3.5 ${isStudied ? 'text-emerald-500' : ''}`} />
          <span>{isStudied ? 'Dominado' : 'Marcar dominado'}</span>
        </button>
      </div>

      <div className="p-5 space-y-4">
        {/* Respuesta Corta / Directa */}
        <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/25 space-y-1">
          <div className="flex items-center gap-1.5 text-xs font-extrabold text-amber-700 dark:text-amber-400 uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Respuesta Concisa para la Entrevista</span>
          </div>
          <p className="text-xs sm:text-sm text-foreground leading-relaxed font-medium">
            {topic.shortAnswer}
          </p>
        </div>

        {/* Explicación Detallada */}
        {topic.explanation && (
          <div className="space-y-2">
            <button
              onClick={() => setIsExplanationOpen(!isExplanationOpen)}
              className="flex items-center justify-between w-full text-xs font-bold text-muted hover:text-foreground transition-colors"
            >
              <span className="flex items-center gap-1.5">
                <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
                Explicación en Profundidad
              </span>
              {isExplanationOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>

            {isExplanationOpen && (
              <div className="p-3.5 rounded-xl bg-muted/20 border border-border/60 text-xs text-muted leading-relaxed whitespace-pre-line animate-in fade-in">
                {topic.explanation}
              </div>
            )}
          </div>
        )}

        {/* Snippet de Código */}
        {topic.codeSnippet && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-muted font-medium">
              <span className="font-mono text-[11px] text-foreground font-semibold">Ejemplo Práctico:</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopyCode}
                  className="flex items-center gap-1 text-[11px] hover:text-foreground transition-colors"
                >
                  {hasCopied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{hasCopied ? 'Copiado' : 'Copiar'}</span>
                </button>
                <button
                  onClick={() => setShowConsole(!showConsole)}
                  className="flex items-center gap-1 text-[11px] text-amber-600 dark:text-amber-400 font-semibold hover:underline"
                >
                  <Terminal className="w-3 h-3" />
                  <span>{showConsole ? 'Ocultar consola' : 'Ejecutar en consola'}</span>
                </button>
              </div>
            </div>

            <div className="rounded-xl bg-slate-950 p-4 border border-slate-800 text-slate-100 font-mono text-xs overflow-x-auto shadow-inner">
              <pre className="text-amber-200/95 leading-relaxed">{topic.codeSnippet}</pre>
            </div>
          </div>
        )}

        {/* Consola en vivo interactiva */}
        {showConsole && topic.codeSnippet && (
          <div className="pt-1 animate-in fade-in slide-in-from-top-2">
            <JsConsoleRunner
              initialCode={topic.codeSnippet}
              title={`Consola: ${topic.id}`}
              autoRun={true}
            />
          </div>
        )}

        {/* Buena Práctica / Senior Tip */}
        {topic.seniorTip && (
          <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/25 flex items-start gap-2.5 text-xs">
            <Lightbulb className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <span className="font-bold text-emerald-700 dark:text-emerald-400">Consejo Senior de Entrevista:</span>
              <p className="text-muted leading-relaxed">{topic.seniorTip}</p>
            </div>
          </div>
        )}
      </div>
    </article>
  );
}
