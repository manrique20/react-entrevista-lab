'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { jsLevelsData } from '@/data/javascript/levelsData';
import { jsTopicsByLevel } from '@/data/javascript/topicsData';
import { JsTopicCard } from './JsTopicCard';
import { LevelAudioPlayer } from '@/components/audio/LevelAudioPlayer';
import { useLevelAudioReader, NarratorItem } from '@/hooks/useLevelAudioReader';
import { EventLoopVisualizer } from './EventLoopVisualizer';
import { CoercionMatrix } from './CoercionMatrix';
import {
  ArrowLeft,
  ArrowRight,
  Sparkles,
  BookOpen,
  CheckCircle2,
  CheckSquare,
  Search
} from 'lucide-react';

interface JsLevelClientViewProps {
  levelNum: number;
}

export function JsLevelClientView({ levelNum }: JsLevelClientViewProps) {
  const levelInfo = jsLevelsData.find(l => l.id === levelNum);
  const topics = jsTopicsByLevel[levelNum] || [];
  const [filterText, setFilterText] = useState('');
  const [completedTopicIds, setCompletedTopicIds] = useState<string[]>([]);

  // Preparar contenido para audio-guía de JavaScript
  const narratorItems: NarratorItem[] = useMemo(() => {
    return topics.map(t => {
      const parts: string[] = [t.shortAnswer];
      if (t.explanation) {
        parts.push(`Explicación detallada: ${t.explanation}`);
      }
      if (t.seniorTip) {
        parts.push(`Consejo senior para la entrevista: ${t.seniorTip}`);
      }
      return {
        id: t.id,
        title: t.question,
        text: parts.join('. '),
        domId: t.id
      };
    });
  }, [topics]);

  const narrator = useLevelAudioReader({
    items: narratorItems,
    levelTitle: `JavaScript Nivel ${levelNum}: ${levelInfo?.title || ''}`
  });

  useEffect(() => {
    const updateProgress = () => {
      try {
        const saved = localStorage.getItem('js_topics_studied');
        if (saved) {
          setCompletedTopicIds(JSON.parse(saved));
        }
      } catch {
        // Ignore
      }
    };
    updateProgress();
    window.addEventListener('storage', updateProgress);
    return () => window.removeEventListener('storage', updateProgress);
  }, []);

  if (!levelInfo) return null;

  const filteredTopics = topics.filter(t => {
    if (!filterText) return true;
    const term = filterText.toLowerCase();
    return (
      t.question.toLowerCase().includes(term) ||
      t.shortAnswer.toLowerCase().includes(term) ||
      t.id.toLowerCase().includes(term) ||
      t.tags.some(tag => tag.toLowerCase().includes(term))
    );
  });

  const levelProgress = topics.filter(t => completedTopicIds.includes(t.id)).length;
  const progressPercent = topics.length > 0 ? Math.round((levelProgress / topics.length) * 100) : 0;

  const prevLevel = levelNum > 1 ? levelNum - 1 : null;
  const nextLevel = levelNum < 8 ? levelNum + 1 : null;

  return (
    <div className="space-y-8 pb-16">
      {/* Breadcrumb & Navigation */}
      <div className="flex items-center justify-between gap-4">
        <Link
          href="/javascript"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Volver al Dashboard JS</span>
        </Link>

        <div className="flex items-center gap-2">
          {prevLevel && (
            <Link
              href={`/javascript/nivel/${prevLevel}`}
              className="flex items-center gap-1 px-3 py-1.5 rounded-xl border border-border/70 hover:bg-muted text-xs font-semibold text-muted hover:text-foreground transition-all"
            >
              <ArrowLeft className="w-3 h-3" />
              <span>Nivel {prevLevel}</span>
            </Link>
          )}

          {nextLevel && (
            <Link
              href={`/javascript/nivel/${nextLevel}`}
              className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/30 hover:bg-amber-500/20 text-xs font-bold text-amber-700 dark:text-amber-300 transition-all"
            >
              <span>Nivel {nextLevel}</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          )}
        </div>
      </div>

      {/* Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl border border-border/80 bg-gradient-to-r from-amber-500/10 via-card to-card shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1 flex-1 min-w-0">
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
              JavaScript Core • Nivel {levelNum} de 8
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-foreground leading-tight break-words">
              {levelInfo.title}
            </h1>
          </div>

          {/* Progress pill */}
          <div className="p-3 rounded-2xl bg-card border border-border/80 shadow-xs shrink-0 sm:text-right">
            <div className="text-xs text-muted font-medium mb-1 flex items-center gap-1.5 sm:justify-end">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
              <span>Progreso del nivel</span>
            </div>
            <div className="text-lg font-black text-foreground">
              {levelProgress} / {topics.length} dominados ({progressPercent}%)
            </div>
            <div className="w-full sm:w-40 h-1.5 bg-muted rounded-full overflow-hidden mt-1.5">
              <div
                className="h-full bg-emerald-500 transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>

        <p className="text-xs sm:text-sm text-muted leading-relaxed max-w-4xl break-words">
          {levelInfo.description}
        </p>

        {/* Buscador dentro del nivel */}
        <div className="pt-2">
          <div className="relative max-w-md">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
            <input
              type="text"
              value={filterText}
              onChange={(e) => setFilterText(e.target.value)}
              placeholder={`Filtrar en Nivel ${levelNum} (${topics.length} preguntas)...`}
              className="w-full pl-9 pr-4 py-2 rounded-xl border border-border/80 bg-card text-xs text-foreground placeholder:text-muted focus:outline-none focus:border-amber-500 transition-colors"
            />
          </div>
        </div>
      </div>

      {/* Demos visuales especiales contextuales */}
      {levelNum === 1 && (
        <div className="space-y-3">
          <h2 className="text-sm font-bold uppercase tracking-wider text-muted flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            Herramienta Visual del Nivel 1
          </h2>
          <CoercionMatrix />
        </div>
      )}

      {levelNum === 5 && (
        <div className="space-y-3">
          <h2 className="text-sm font-bold uppercase tracking-wider text-muted flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-blue-500" />
            Simulador de Microtareas y Macrotareas
          </h2>
          <EventLoopVisualizer />
        </div>
      )}

      {/* Reproductor de Audio del Nivel */}
      <LevelAudioPlayer narrator={narrator} levelTitle={`JavaScript Nivel ${levelNum}: ${levelInfo.title}`} />

      {/* Listado de preguntas */}
      <div className="space-y-5">
        <div className="flex items-center justify-between text-xs text-muted font-semibold">
          <span>{filteredTopics.length} de {topics.length} preguntas mostradas</span>
          <span>Pulsa &quot;Ejecutar en consola&quot; en cualquier ejemplo</span>
        </div>

        {filteredTopics.length === 0 ? (
          <div className="p-8 rounded-2xl border border-dashed text-center text-xs text-muted">
            No se encontraron preguntas que coincidan con &quot;{filterText}&quot;.
          </div>
        ) : (
          filteredTopics.map((topic) => (
            <JsTopicCard
              key={topic.id}
              topic={topic}
              isSpeaking={narrator.activeSpeechId === topic.id}
              onToggleAudio={() => {
                const item = narratorItems.find(ni => ni.id === topic.id);
                if (item) {
                  narrator.speakSingleTopic(item.id, item.title, item.text);
                }
              }}
            />
          ))
        )}
      </div>

      {/* Bottom navigation */}
      <div className="pt-8 border-t border-border/70 flex items-center justify-between">
        {prevLevel ? (
          <Link
            href={`/javascript/nivel/${prevLevel}`}
            className="flex items-center gap-2 px-4 py-2 rounded-xl border hover:bg-muted text-xs font-bold text-foreground transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Nivel Anterior ({prevLevel})</span>
          </Link>
        ) : <div />}

        {nextLevel ? (
          <Link
            href={`/javascript/nivel/${nextLevel}`}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 text-xs font-black shadow-md shadow-amber-500/20 hover:opacity-95 transition-all"
          >
            <span>Siguiente Nivel ({nextLevel})</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        ) : (
          <Link
            href="/javascript/acertijos"
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 text-xs font-black shadow-md shadow-amber-500/20 hover:opacity-95 transition-all"
          >
            <span>Ir a Acertijos de Entrevista</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        )}
      </div>
    </div>
  );
}
