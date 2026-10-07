'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { LEVELS } from '@/data/levelsData';
import { ALL_TOPICS } from '@/data/topicsData';
import { INTERVIEW_QUESTIONS } from '@/data/interviewQuestions';
import { EXERCISES } from '@/data/exercisesData';
import {
  Boxes,
  Zap,
  Layers,
  Cpu,
  Gauge,
  Sparkles,
  Building2,
  Microscope,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  HelpCircle,
  Code2,
  BookOpen,
  Terminal,
  Trophy
} from 'lucide-react';

const ICONS_MAP: Record<string, React.ElementType> = {
  Boxes,
  Zap,
  Layers,
  Cpu,
  Gauge,
  Sparkles,
  Building2,
  Microscope
};

export default function HomePage() {
  const [completedTopics, setCompletedTopics] = useState<string[]>([]);

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

  const totalTopics = ALL_TOPICS.length;
  const porcentaje = Math.round((completedTopics.length / totalTopics) * 100);

  return (
    <div className="space-y-12 pb-16">
      {/* Barra de navegación rápida al Hub */}
      <div className="flex items-center justify-between">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Volver al Hub Principal</span>
        </Link>
        <Link
          href="/javascript"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-600 dark:text-amber-400 hover:underline"
        >
          <span>Explorar Track de JavaScript Core &gt;</span>
        </Link>
      </div>

      {/* Hero Banner */}
      <section className="relative overflow-hidden rounded-3xl border border-border/80 bg-gradient-to-b from-primary/5 via-card to-card p-6 sm:p-10 text-center sm:text-left shadow-sm">
        <div className="w-full max-w-5xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Actualizado para React 19, Server Components y Next.js 16</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-foreground leading-tight sm:leading-tight lg:leading-[1.2] break-words pb-1">
            React &amp; Next.js <br />
            <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 bg-clip-text text-transparent">
              Laboratorio de Entrevistas
            </span>
          </h1>

          <p className="text-sm sm:text-base text-muted leading-relaxed max-w-3xl">
            Una plataforma interactiva completa basada en el documento <code>react-entrevista.md</code>. Cada uno de los 79 tópicos cuenta con su modelo mental, código fuente, laboratorio en vivo interactivo y las respuestas senior que esperan los entrevistadores técnicos.
          </p>

          <div className="flex flex-wrap gap-3 pt-2 justify-center sm:justify-start">
            <Link
              href="/nivel/1"
              className="px-5 py-2.5 rounded-xl bg-primary text-white text-xs sm:text-sm font-semibold hover:bg-primary/90 transition-colors shadow-md shadow-primary/20 flex items-center gap-2"
            >
              <BookOpen className="w-4 h-4" />
              <span>Comenzar desde Nivel 1</span>
            </Link>
            <Link
              href="/preguntas"
              className="px-5 py-2.5 rounded-xl border border-border hover:bg-muted text-xs sm:text-sm font-semibold transition-colors flex items-center gap-2"
            >
              <HelpCircle className="w-4 h-4 text-purple-500" />
              <span>Simular Preguntas Clásicas</span>
            </Link>
            <Link
              href="/ejercicios"
              className="px-5 py-2.5 rounded-xl border border-border hover:bg-muted text-xs sm:text-sm font-semibold transition-colors flex items-center gap-2"
            >
              <Code2 className="w-4 h-4 text-emerald-500" />
              <span>11 Ejercicios Prácticos</span>
            </Link>
          </div>
        </div>

        {/* Barra de progreso global */}
        <div className="mt-8 pt-6 border-t border-border/60 max-w-xl">
          <div className="flex justify-between items-center text-xs mb-2">
            <span className="font-semibold text-muted">Progreso Global de Estudio</span>
            <span className="font-mono font-bold text-primary">{completedTopics.length} de {totalTopics} temas ({porcentaje}%)</span>
          </div>
          <div className="w-full h-2.5 rounded-full bg-muted/40 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-emerald-500 transition-all duration-500 rounded-full"
              style={{ width: `${porcentaje}%` }}
            />
          </div>
        </div>
      </section>

      {/* Métricas destacadas */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-5 border rounded-2xl bg-card text-center sm:text-left space-y-1">
          <span className="text-2xl sm:text-3xl font-extrabold text-blue-500 font-mono">8</span>
          <p className="text-xs font-semibold text-foreground">Niveles Estructurados</p>
          <p className="text-[11px] text-muted">De Fundamentos a Internos Fiber</p>
        </div>
        <div className="p-5 border rounded-2xl bg-card text-center sm:text-left space-y-1">
          <span className="text-2xl sm:text-3xl font-extrabold text-indigo-500 font-mono">79</span>
          <p className="text-xs font-semibold text-foreground">Tópicos con Demos</p>
          <p className="text-[11px] text-muted">Laboratorios y tips de entrevista</p>
        </div>
        <div className="p-5 border rounded-2xl bg-card text-center sm:text-left space-y-1">
          <span className="text-2xl sm:text-3xl font-extrabold text-purple-500 font-mono">9</span>
          <p className="text-xs font-semibold text-foreground">Preguntas Clásicas</p>
          <p className="text-[11px] text-muted">Simulador con trampas y red flags</p>
        </div>
        <div className="p-5 border rounded-2xl bg-card text-center sm:text-left space-y-1">
          <span className="text-2xl sm:text-3xl font-extrabold text-emerald-500 font-mono">11</span>
          <p className="text-xs font-semibold text-foreground">Ejercicios de Código</p>
          <p className="text-[11px] text-muted">Los retos más frecuentes en pruebas</p>
        </div>
      </section>

      {/* Grid de los 8 Niveles */}
      <section className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border/80 pb-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-foreground">Ruta de Aprendizaje por Niveles</h2>
            <p className="text-xs text-muted">Selecciona cualquier nivel para explorar sus explicaciones, código y widgets interactivos.</p>
          </div>
          <Link href="/checklist" className="text-xs font-semibold text-primary hover:underline flex items-center gap-1">
            Ver checklist completo &rarr;
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {LEVELS.map(level => {
            const Icon = ICONS_MAP[level.iconName] || Layers;
            const topicsEnNivel = level.topicIds.length;
            const completadosEnNivel = level.topicIds.filter(id => completedTopics.includes(id)).length;

            return (
              <Link
                key={level.id}
                href={`/nivel/${level.id}`}
                className="group p-5 border border-border/80 hover:border-primary/50 rounded-2xl bg-card transition-all duration-200 hover:shadow-lg flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center group-hover:scale-105 transition-transform">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-mono font-bold text-muted bg-muted px-2 py-0.5 rounded">
                      {completadosEnNivel}/{topicsEnNivel}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-bold text-sm text-foreground group-hover:text-primary transition-colors">
                      {level.title}
                    </h3>
                    <p className="text-xs text-muted mt-1 line-clamp-3 leading-relaxed">
                      {level.description}
                    </p>
                  </div>
                </div>

                <div className="pt-4 mt-4 border-t border-border/50 flex items-center justify-between text-xs font-semibold text-primary">
                  <span>Explorar nivel</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Sección rápida: Preguntas de entrevista recomendadas */}
      <section className="p-6 sm:p-8 border rounded-3xl bg-card space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-purple-500" />
              Simulador de Preguntas Clásicas de Entrevista
            </h3>
            <p className="text-xs text-muted">¿Por qué no se debe mutar el estado? ¿Cuándo usar Context vs Zustand? ¿Qué pasa si usas el index como key?</p>
          </div>
          <Link
            href="/preguntas"
            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-semibold transition-colors"
          >
            Abrir Simulador Completo
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {INTERVIEW_QUESTIONS.slice(0, 3).map(q => (
            <Link
              key={q.id}
              href="/preguntas"
              className="p-4 border rounded-xl bg-background hover:border-purple-500/40 transition-colors block space-y-2"
            >
              <span className="text-[10px] font-mono bg-purple-500/10 text-purple-600 px-2 py-0.5 rounded">
                {q.category}
              </span>
              <h4 className="font-semibold text-xs text-foreground line-clamp-2">
                {q.question}
              </h4>
              <p className="text-[11px] text-muted line-clamp-2">
                {q.seniorAnswer}
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* Sección rápida: Laboratorio de Ejercicios */}
      <section className="p-6 sm:p-8 border rounded-3xl bg-card space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
              <Code2 className="w-5 h-5 text-emerald-500" />
              Suite de 11 Ejercicios Prácticos Frecuentes
            </h3>
            <p className="text-xs text-muted">Todo list, Buscador Debounce con AbortController, Modal con createPortal, Paginación, Infinite Scroll y Formularios Zod.</p>
          </div>
          <Link
            href="/ejercicios"
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold transition-colors"
          >
            Ver todos los Ejercicios
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {EXERCISES.slice(0, 4).map(ex => (
            <Link
              key={ex.id}
              href="/ejercicios"
              className="p-4 border rounded-xl bg-background hover:border-emerald-500/40 transition-colors block space-y-2"
            >
              <span className="text-[10px] font-mono bg-emerald-500/10 text-emerald-600 px-2 py-0.5 rounded">
                {ex.difficulty}
              </span>
              <h4 className="font-semibold text-xs text-foreground line-clamp-1">{ex.title}</h4>
              <p className="text-[11px] text-muted line-clamp-2">{ex.description}</p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
