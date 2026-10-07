'use client';

import React from 'react';
import {
  Play,
  Pause,
  Square,
  SkipForward,
  SkipBack,
  Volume2,
  ArrowDownCircle
} from 'lucide-react';
import { useLevelAudioReader } from '@/hooks/useLevelAudioReader';

interface LevelAudioPlayerProps {
  narrator: ReturnType<typeof useLevelAudioReader>;
  levelTitle: string;
}

export function LevelAudioPlayer({ narrator, levelTitle }: LevelAudioPlayerProps) {

  if (!narrator.isSupported) {
    return null;
  }

  const rates = [0.8, 1.0, 1.25, 1.5, 1.75];

  return (
    <div
      className={`rounded-2xl border transition-all duration-300 shadow-sm overflow-hidden ${
        narrator.isPlaying
          ? 'bg-gradient-to-r from-primary/10 via-card to-card border-primary/40 ring-1 ring-primary/20'
          : 'bg-card border-border/80'
      }`}
    >
      <div className="p-3.5 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Lado izquierdo: Estado y tema actual */}
        <div className="flex items-center gap-3 flex-1 min-w-0">
          {/* Botón principal Play / Pause */}
          <button
            onClick={() => {
              if (narrator.isPlaying) narrator.pause();
              else narrator.play();
            }}
            className={`w-11 h-11 rounded-xl flex items-center justify-center transition-all shadow-md shrink-0 ${
              narrator.isPlaying
                ? 'bg-primary text-white hover:bg-primary/90'
                : 'bg-gradient-to-tr from-primary to-indigo-600 text-white hover:opacity-95'
            }`}
            title={narrator.isPlaying ? 'Pausar audio-guía' : 'Reproducir audio-guía'}
          >
            {narrator.isPlaying ? (
              <Pause className="w-5 h-5 fill-current" />
            ) : (
              <Play className="w-5 h-5 fill-current ml-0.5" />
            )}
          </button>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-0.5">
              <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-primary/10 text-primary border border-primary/20">
                <Volume2 className="w-3 h-3" />
                <span>Audio-Guía de Estudio</span>
              </span>

              {narrator.isPlaying && (
                <div className="flex items-center gap-0.5 h-3">
                  <span className="w-0.5 h-3 bg-primary animate-pulse rounded-full" />
                  <span className="w-0.5 h-2 bg-primary animate-pulse delay-75 rounded-full" />
                  <span className="w-0.5 h-4 bg-primary animate-pulse delay-150 rounded-full" />
                  <span className="w-0.5 h-2.5 bg-primary animate-pulse rounded-full" />
                </div>
              )}

              <span className="text-[11px] text-muted font-medium">
                Tema {narrator.currentIndex + 1} de {narrator.totalItems}
              </span>
              {narrator.isLoadingAudio && (
                <span className="text-[10px] text-primary font-bold animate-pulse">
                  (Cargando audio...)
                </span>
              )}
            </div>

            <p className="text-xs sm:text-sm font-bold text-foreground truncate">
              {narrator.activeItem ? narrator.activeItem.title : `Escuchar ${levelTitle} completo`}
            </p>
          </div>
        </div>

        {/* Lado derecho: Controles de navegación y velocidad */}
        <div className="flex items-center gap-1.5 flex-wrap shrink-0">
          {/* Botón Anterior */}
          <button
            onClick={narrator.prev}
            disabled={narrator.currentIndex === 0}
            className="p-2 rounded-xl border border-border/80 hover:bg-muted text-muted hover:text-foreground transition-colors disabled:opacity-40"
            title="Tema anterior"
          >
            <SkipBack className="w-3.5 h-3.5" />
          </button>

          {/* Botón Detener */}
          <button
            onClick={narrator.stop}
            disabled={!narrator.isPlaying && !narrator.isPaused}
            className="p-2 rounded-xl border border-border/80 hover:bg-muted text-muted hover:text-foreground transition-colors disabled:opacity-40"
            title="Detener lectura"
          >
            <Square className="w-3.5 h-3.5" />
          </button>

          {/* Botón Siguiente */}
          <button
            onClick={narrator.next}
            disabled={narrator.currentIndex >= narrator.totalItems - 1}
            className="p-2 rounded-xl border border-border/80 hover:bg-muted text-muted hover:text-foreground transition-colors disabled:opacity-40"
            title="Siguiente tema"
          >
            <SkipForward className="w-3.5 h-3.5" />
          </button>

          {/* Selector de Velocidad */}
          <div className="flex items-center p-0.5 rounded-xl bg-muted/40 border border-border/70 text-[10px] font-bold">
            {rates.map((r) => (
              <button
                key={r}
                onClick={() => narrator.setRate(r)}
                className={`px-2 py-1 rounded-lg transition-colors ${
                  narrator.rate === r
                    ? 'bg-background text-primary shadow-xs font-black'
                    : 'text-muted hover:text-foreground'
                }`}
              >
                {r}x
              </button>
            ))}
          </div>

          {/* Auto-scroll toggle */}
          <button
            onClick={() => narrator.setAutoScroll(!narrator.autoScroll)}
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-[11px] font-semibold border transition-all ${
              narrator.autoScroll
                ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30'
                : 'border-border/80 text-muted hover:bg-muted'
            }`}
            title="Desplazamiento automático al tema que se está narrando"
          >
            <ArrowDownCircle className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Scroll automático</span>
          </button>

        </div>
      </div>

      {/* Banner informativo de error / bloqueo de síntesis */}
      {narrator.errorMessage && (
        <div className="p-3 bg-amber-500/10 border-t border-amber-500/30 text-xs text-amber-700 dark:text-amber-300 flex items-start justify-between gap-3 animate-in fade-in">
          <p className="flex-1 leading-relaxed">
            <span className="font-bold block mb-0.5">Aviso del motor de audio:</span>
            {narrator.errorMessage}
          </p>
          <button
            onClick={narrator.clearError}
            className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-amber-500/20 hover:bg-amber-500/30 text-amber-900 dark:text-amber-200 transition-colors shrink-0"
          >
            Cerrar
          </button>
        </div>
      )}
    </div>
  );
}
