'use client';

import React, { useState } from 'react';
import { Topic } from '@/types';
import { CodeBlock } from './CodeBlock';
import { TopicDemoDispatcher } from '../demos/TopicDemoDispatcher';
import {
  BookOpen,
  FlaskConical,
  Code2,
  Briefcase,
  CheckCircle2,
  Circle,
  AlertTriangle,
  Lightbulb,
  ExternalLink,
  Volume2,
  VolumeX
} from 'lucide-react';

interface TopicCardProps {
  topic: Topic;
  isCompleted?: boolean;
  onToggleComplete?: (id: string) => void;
  isSpeaking?: boolean;
  onToggleAudio?: () => void;
}

export function TopicCard({
  topic,
  isCompleted = false,
  onToggleComplete,
  isSpeaking = false,
  onToggleAudio
}: TopicCardProps) {
  const [activeTab, setActiveTab] = useState<'concept' | 'demo' | 'code' | 'interview'>('concept');

  return (
    <div
      id={`topic-${topic.id}`}
      className={`border rounded-2xl bg-card shadow-sm transition-all duration-200 overflow-hidden ${
        isSpeaking
          ? 'border-primary ring-2 ring-primary/50 shadow-lg shadow-primary/10'
          : isCompleted
          ? 'border-emerald-500/40 ring-1 ring-emerald-500/20'
          : 'border-border/80 hover:border-primary/40'
      }`}
    >
      {/* Header */}
      <div className="p-5 border-b border-border/60 bg-muted/10">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <span className="px-2.5 py-1 rounded-lg bg-primary/10 text-primary font-mono text-xs font-bold">
              #{topic.id}
            </span>
            <span className="text-xs text-muted font-medium bg-muted px-2 py-0.5 rounded-md">
              {topic.levelTitle}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {onToggleAudio && (
              <button
                onClick={onToggleAudio}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-semibold transition-all border ${
                  isSpeaking
                    ? 'bg-primary text-white border-primary shadow-xs'
                    : 'border-border/80 hover:bg-muted text-muted hover:text-foreground'
                }`}
                title={isSpeaking ? 'Detener lectura de este tema' : 'Escuchar este tema con voz asistida'}
              >
                {isSpeaking ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                <span className="text-[11px]">{isSpeaking ? 'Detener' : 'Escuchar'}</span>
              </button>
            )}

            <button
              onClick={() => onToggleComplete?.(topic.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                isCompleted
                  ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
                  : 'border border-border/80 hover:bg-muted text-muted hover:text-foreground'
              }`}
            >
              {isCompleted ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>Dominado</span>
                </>
              ) : (
                <>
                  <Circle className="w-4 h-4 text-muted" />
                  <span>Marcar como estudiado</span>
                </>
              )}
            </button>
          </div>
        </div>

        <h3 className="text-lg font-bold text-foreground mt-2 leading-snug break-words">{topic.title}</h3>
        <p className="text-xs text-muted mt-1 leading-relaxed break-words">{topic.summary}</p>

        {/* Tabs de navegación interna */}
        <div className="flex flex-wrap gap-1.5 mt-4 pt-3 border-t border-border/40 text-xs">
          <button
            onClick={() => setActiveTab('concept')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-colors ${
              activeTab === 'concept'
                ? 'bg-primary text-white shadow-sm'
                : 'text-muted hover:text-foreground hover:bg-muted/60'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" /> Concepto
          </button>
          <button
            onClick={() => setActiveTab('demo')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-colors ${
              activeTab === 'demo'
                ? 'bg-primary text-white shadow-sm'
                : 'text-muted hover:text-foreground hover:bg-muted/60'
            }`}
          >
            <FlaskConical className="w-3.5 h-3.5" /> Laboratorio en Vivo
          </button>
          <button
            onClick={() => setActiveTab('code')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-colors ${
              activeTab === 'code'
                ? 'bg-primary text-white shadow-sm'
                : 'text-muted hover:text-foreground hover:bg-muted/60'
            }`}
          >
            <Code2 className="w-3.5 h-3.5" /> Código Fuente
          </button>
          <button
            onClick={() => setActiveTab('interview')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-colors ${
              activeTab === 'interview'
                ? 'bg-primary text-white shadow-sm'
                : 'text-muted hover:text-foreground hover:bg-muted/60'
            }`}
          >
            <Briefcase className="w-3.5 h-3.5" /> En la Entrevista
          </button>
        </div>
      </div>

      {/* Body dinámico por tab */}
      <div className="p-5">
        {activeTab === 'concept' && (
          <div className="space-y-4">
            <div className="text-xs leading-relaxed text-foreground/90 whitespace-pre-line space-y-2">
              {topic.whatIsIt}
            </div>

            <div className="p-3.5 rounded-xl border border-primary/20 bg-primary/5 flex items-start gap-3 mt-4">
              <Lightbulb className="w-4 h-4 text-primary shrink-0 mt-0.5" />
              <div className="text-xs">
                <span className="font-bold text-primary block mb-0.5">Idea Clave para Recordar:</span>
                <span className="text-foreground/90">{topic.keyTakeaway}</span>
              </div>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-1.5 pt-2">
              {topic.tags.map(t => (
                <span
                  key={t}
                  className="px-2 py-0.5 rounded-md text-[10px] font-mono bg-muted text-muted-foreground"
                >
                  #{t}
                </span>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'demo' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs text-muted mb-2">
              <span className="font-semibold text-primary flex items-center gap-1">
                <FlaskConical className="w-3.5 h-3.5" /> Widget interactivo de prueba
              </span>
              <span className="text-[11px] font-mono">React 19 Interactive Runtime</span>
            </div>
            <TopicDemoDispatcher
              componentKey={topic.componentKey}
              topicTitle={topic.title}
            />
          </div>
        )}

        {activeTab === 'code' && (
          <div>
            <CodeBlock
              code={topic.codeSnippet}
              language={topic.codeLanguage || 'tsx'}
              title={`${topic.title} - Ejemplo`}
            />
          </div>
        )}

        {activeTab === 'interview' && (
          <div className="space-y-4">
            {/* Qué decir */}
            <div className="space-y-2">
              <h4 className="font-bold text-xs text-foreground flex items-center gap-1.5">
                <Briefcase className="w-4 h-4 text-blue-500" />
                Cómo responder con nivel Senior:
              </h4>
              <ul className="space-y-2 text-xs">
                {topic.interviewTips.map((tip, idx) => (
                  <li key={idx} className="p-3 rounded-xl border border-blue-500/20 bg-blue-500/5 text-foreground/90 flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                    <span className="leading-relaxed">{tip}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Trampas comunes */}
            {topic.commonTraps.length > 0 && (
              <div className="space-y-2 pt-2 border-t border-border/40">
                <h4 className="font-bold text-xs text-amber-600 dark:text-amber-400 flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-amber-500" />
                  Trampas habituales y Red Flags en entrevistas:
                </h4>
                <ul className="space-y-2 text-xs">
                  {topic.commonTraps.map((trap, idx) => (
                    <li key={idx} className="p-3 rounded-xl border border-amber-500/20 bg-amber-500/5 text-foreground/90 flex items-start gap-2.5">
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
    </div>
  );
}
