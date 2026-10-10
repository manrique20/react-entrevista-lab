'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { LEVELS } from '@/data/levelsData';
import { getTopicsByLevel } from '@/data/topicsData';
import { TopicCard } from '@/components/ui/TopicCard';
import { LevelAudioPlayer } from '@/components/audio/LevelAudioPlayer';
import { useLevelAudioReader, NarratorItem } from '@/hooks/useLevelAudioReader';
import {
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Layers
} from 'lucide-react';

interface LevelClientViewProps {
  levelNum: number;
}

export function LevelClientView({ levelNum }: LevelClientViewProps) {
  const levelInfo = LEVELS.find(l => l.id === levelNum);
  const topics = getTopicsByLevel(levelNum);

  const [completedTopics, setCompletedTopics] = useState<string[]>([]);

  // Prepare content for audio-guide
  const narratorItems: NarratorItem[] = useMemo(() => {
    return topics.map(t => {
      const parts: string[] = [t.summary];
      if (t.whatIsIt) parts.push(`In-depth explanation: ${t.whatIsIt}`);
      if (t.interviewTips && t.interviewTips.length > 0) {
        parts.push(`Interview tips: ${t.interviewTips.join('. ')}`);
      }
      if (t.commonTraps && t.commonTraps.length > 0) {
        parts.push(`Common traps to avoid: ${t.commonTraps.join('. ')}`);
      }
      if (t.keyTakeaway) {
        parts.push(`Key takeaway: ${t.keyTakeaway}`);
      }
      return {
        id: t.id,
        title: t.title,
        text: parts.join('. '),
        domId: `topic-${t.id}`
      };
    });
  }, [topics]);

  const narrator = useLevelAudioReader({
    items: narratorItems,
    levelTitle: levelInfo?.title || `Level ${levelNum}`
  });

  useEffect(() => {
    try {
      const saved = localStorage.getItem('react_entrevista_progress');
      if (saved) {
        const arr = JSON.parse(saved);
        if (Array.isArray(arr)) setCompletedTopics(arr);
      }
    } catch {
      // Fallback
    }
  }, []);

  const toggleComplete = (id: string) => {
    setCompletedTopics(prev => {
      const nuevo = prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id];
      try {
        localStorage.setItem('react_entrevista_progress', JSON.stringify(nuevo));
        window.dispatchEvent(new Event('storage'));
      } catch {
        // Fallback
      }
      return nuevo;
    });
  };

  if (!levelInfo) return null;

  const prevLevel = levelNum > 1 ? levelNum - 1 : null;
  const nextLevel = levelNum < 8 ? levelNum + 1 : null;
  const completadosNivel = topics.filter(t => completedTopics.includes(t.id)).length;
  const porcentajeNivel = Math.round((completadosNivel / topics.length) * 100);

  return (
    <div className="space-y-8">
      {/* Horizontal 8-level navigator */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 border-border/80 scrollbar-none">
        {LEVELS.map(l => (
          <Link
            key={l.id}
            href={`/nivel/${l.id}`}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
              l.id === levelNum
                ? 'bg-primary text-white shadow-sm'
                : 'bg-muted/40 hover:bg-muted text-muted hover:text-foreground'
            }`}
          >
            Level {l.id}: {l.shortTitle}
          </Link>
        ))}
      </div>

      {/* Level Header */}
      <div className="p-6 sm:p-8 border rounded-3xl bg-card space-y-4 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1 flex-1 min-w-0">
            <span className="text-xs font-mono font-bold text-primary bg-primary/10 px-2.5 py-1 rounded-md">
              Level {levelInfo.id} of 8
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground leading-tight break-words">{levelInfo.title}</h1>
            <p className="text-xs sm:text-sm text-muted max-w-4xl break-words">{levelInfo.description}</p>
          </div>

          <div className="p-4 border rounded-2xl bg-background text-right min-w-[160px] shrink-0">
            <span className="text-xs text-muted block">Level Progress</span>
            <span className="text-2xl font-extrabold font-mono text-primary">
              {completadosNivel}/{topics.length}
            </span>
            <div className="w-full h-1.5 bg-muted rounded-full mt-2 overflow-hidden">
              <div
                className="h-full bg-emerald-500 rounded-full transition-all duration-300"
                style={{ width: `${porcentajeNivel}%` }}
              />
            </div>
          </div>
        </div>

        {/* Quick topic jump table */}
        <div className="pt-4 border-t border-border/60">
          <span className="text-xs font-semibold text-muted block mb-2">Jump to topic in this level:</span>
          <div className="flex flex-wrap gap-2">
            {topics.map(t => {
              const completado = completedTopics.includes(t.id);
              return (
                <a
                  key={t.id}
                  href={`#topic-${t.id}`}
                  className={`px-2.5 py-1 rounded-lg text-xs font-mono transition-colors flex items-center gap-1.5 ${
                    completado
                      ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                      : 'border hover:border-primary/50 text-foreground'
                  }`}
                >
                  {completado && <CheckCircle2 className="w-3 h-3 text-emerald-500" />}
                  <span>#{t.id}</span>
                </a>
              );
            })}
          </div>
        </div>
      </div>

      {/* Level Audio Player */}
      <LevelAudioPlayer narrator={narrator} levelTitle={levelInfo.title} />

      {/* List of TopicCards */}
      <div className="space-y-6">
        {topics.map(topic => (
          <TopicCard
            key={topic.id}
            topic={topic}
            isCompleted={completedTopics.includes(topic.id)}
            onToggleComplete={toggleComplete}
            isSpeaking={narrator.activeSpeechId === topic.id}
            onToggleAudio={() => {
              const item = narratorItems.find(ni => ni.id === topic.id);
              if (item) {
                narrator.speakSingleTopic(item.id, item.title, item.text);
              }
            }}
          />
        ))}
      </div>

      {/* Pagination previous / next level */}
      <div className="flex items-center justify-between border-t border-border/80 pt-6">
        {prevLevel ? (
          <Link
            href={`/nivel/${prevLevel}`}
            className="flex items-center gap-2 px-4 py-2 border rounded-xl hover:bg-muted text-xs font-semibold text-foreground transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Level {prevLevel}: {LEVELS[prevLevel - 1].shortTitle}</span>
          </Link>
        ) : <div />}

        {nextLevel ? (
          <Link
            href={`/nivel/${nextLevel}`}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl hover:bg-primary/90 text-xs font-semibold transition-colors"
          >
            <span>Level {nextLevel}: {LEVELS[nextLevel - 1].shortTitle}</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        ) : <div />}
      </div>
    </div>
  );
}
