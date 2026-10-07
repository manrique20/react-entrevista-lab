'use client';

import React, { useState } from 'react';
import { EXERCISES } from '@/data/exercisesData';
import { CounterExercise } from '@/components/exercises/CounterExercise';
import { TodoExercise } from '@/components/exercises/TodoExercise';
import { DebounceSearchExercise } from '@/components/exercises/DebounceSearchExercise';
import { PaginatedFetchExercise } from '@/components/exercises/PaginatedFetchExercise';
import { InfiniteScrollExercise } from '@/components/exercises/InfiniteScrollExercise';
import { PortalModalExercise } from '@/components/exercises/PortalModalExercise';
import { TabsExercise } from '@/components/exercises/TabsExercise';
import { AccordionExercise } from '@/components/exercises/AccordionExercise';
import { AutocompleteExercise } from '@/components/exercises/AutocompleteExercise';
import { CustomHooksExercise } from '@/components/exercises/CustomHooksExercise';
import { ValidatedFormExercise } from '@/components/exercises/ValidatedFormExercise';
import {
  Code2,
  CheckCircle2,
  Lightbulb,
  Sparkles,
  ArrowRight
} from 'lucide-react';

const COMPONENT_MAP: Record<string, React.ElementType> = {
  CounterExercise,
  TodoExercise,
  DebounceSearchExercise,
  PaginatedFetchExercise,
  InfiniteScrollExercise,
  PortalModalExercise,
  TabsExercise,
  AccordionExercise,
  AutocompleteExercise,
  CustomHooksExercise,
  ValidatedFormExercise
};

export default function ExercisesPage() {
  const [ejercicioActivoId, setEjercicioActivoId] = useState<string>('ex1');

  const ejercicioActivo = EXERCISES.find(e => e.id === ejercicioActivoId) || EXERCISES[0];
  const ActiveComponent = COMPONENT_MAP[ejercicioActivo.componentKey] || CounterExercise;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="p-6 sm:p-8 border rounded-3xl bg-card space-y-3 shadow-sm">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-semibold">
          <Code2 className="w-3.5 h-3.5" />
          <span>Laboratorio de Pruebas de Código</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground">
          Ejercicios de Código Frecuentes en Entrevistas
        </h1>
        <p className="text-xs sm:text-sm text-muted max-w-2xl leading-relaxed">
          Los 11 ejercicios prácticos que los entrevistadores solicitan construir en vivo durante pruebas técnicas (Live Coding y Take-Home). Interactúa con las implementaciones completas y analiza sus conceptos clave.
        </p>
      </div>

      {/* Grid selector + Área de Trabajo */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Barra lateral de ejercicios */}
        <div className="lg:col-span-4 space-y-2 border rounded-2xl bg-card p-3 shadow-sm">
          <span className="text-xs font-semibold text-muted px-2 py-1 block">
            Selecciona un ejercicio:
          </span>
          <div className="space-y-1">
            {EXERCISES.map((ex, idx) => {
              const esActivo = ex.id === ejercicioActivoId;
              return (
                <button
                  key={ex.id}
                  onClick={() => setEjercicioActivoId(ex.id)}
                  className={`w-full text-left p-3 rounded-xl transition-all flex items-center justify-between gap-2 text-xs font-semibold ${
                    esActivo
                      ? 'bg-primary text-white shadow-sm'
                      : 'hover:bg-muted text-foreground'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <span className="font-mono text-[11px] opacity-80">#{idx + 1}</span>
                    <span className="truncate">{ex.title.replace(/^\d+\.\s*/, '')}</span>
                  </div>
                  <span
                    className={`text-[10px] font-mono px-2 py-0.5 rounded ${
                      esActivo
                        ? 'bg-white/20 text-white'
                        : ex.difficulty === 'Básico'
                        ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                        : ex.difficulty === 'Intermedio'
                        ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400'
                        : 'bg-purple-500/10 text-purple-600 dark:text-purple-400'
                    }`}
                  >
                    {ex.difficulty}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Contenido del ejercicio seleccionado */}
        <div className="lg:col-span-8 space-y-6">
          {/* Metadata del ejercicio */}
          <div className="p-5 border rounded-2xl bg-card space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="font-mono text-xs font-bold text-primary bg-primary/10 px-2.5 py-1 rounded-md">
                {ejercicioActivo.id.toUpperCase()}
              </span>
              <span className="text-xs font-mono font-medium px-2 py-0.5 rounded bg-muted">
                Dificultad: {ejercicioActivo.difficulty}
              </span>
            </div>

            <h2 className="text-xl font-bold text-foreground">{ejercicioActivo.title}</h2>
            <p className="text-xs sm:text-sm text-muted">{ejercicioActivo.description}</p>

            <div className="pt-3 border-t border-border/60">
              <span className="text-xs font-semibold text-foreground block mb-1.5">Tópicos evaluados:</span>
              <div className="flex flex-wrap gap-1.5">
                {ejercicioActivo.topicsTested.map(t => (
                  <span
                    key={t}
                    className="px-2.5 py-0.5 rounded-md bg-muted text-[11px] font-mono text-muted-foreground"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>

            {ejercicioActivo.hints.length > 0 && (
              <div className="p-3 bg-primary/5 border border-primary/20 rounded-xl space-y-1.5 mt-3">
                <span className="text-xs font-bold text-primary flex items-center gap-1.5">
                  <Lightbulb className="w-3.5 h-3.5" /> Pistas para la prueba técnica:
                </span>
                <ul className="text-xs text-foreground/90 space-y-1 pl-4 list-disc">
                  {ejercicioActivo.hints.map((h, i) => (
                    <li key={i}>{h}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Componente interactivo en vivo */}
          <ActiveComponent />
        </div>
      </div>
    </div>
  );
}
