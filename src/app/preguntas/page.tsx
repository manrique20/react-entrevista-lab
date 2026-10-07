'use client';

import React, { useState } from 'react';
import { INTERVIEW_QUESTIONS } from '@/data/interviewQuestions';
import { CodeBlock } from '@/components/ui/CodeBlock';
import {
  HelpCircle,
  Eye,
  EyeOff,
  AlertTriangle,
  CheckCircle2,
  Filter,
  Sparkles,
  BookOpen
} from 'lucide-react';

export default function QuestionsPage() {
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState<string>('Todas');
  const [reveladas, setReveladas] = useState<Record<string, boolean>>({});

  const categorias = ['Todas', ...Array.from(new Set(INTERVIEW_QUESTIONS.map(q => q.category)))];

  const toggleRevelar = (id: string) => {
    setReveladas(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const preguntasFiltradas = INTERVIEW_QUESTIONS.filter(q =>
    categoriaSeleccionada === 'Todas' || q.category === categoriaSeleccionada
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="p-6 sm:p-8 border rounded-3xl bg-card space-y-3 shadow-sm">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400 text-xs font-semibold">
          <HelpCircle className="w-3.5 h-3.5" />
          <span>Simulador de Entrevista Senior</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground leading-tight break-words">
          Preguntas Clásicas de Entrevista en React
        </h1>
        <p className="text-xs sm:text-sm text-muted max-w-4xl leading-relaxed break-words">
          Las 9 preguntas obligatorias en procesos técnicos para perfiles Mid y Senior. Cada tarjeta te permite pensar tu respuesta antes de revelar la explicación senior, el código demostrativo y las trampas que hacen fallar a candidatos.
        </p>

        {/* Filtros por Categoría */}
        <div className="pt-4 border-t border-border/60 flex flex-wrap gap-1.5">
          {categorias.map(cat => (
            <button
              key={cat}
              onClick={() => setCategoriaSeleccionada(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-colors ${
                categoriaSeleccionada === cat
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'border hover:bg-muted text-muted hover:text-foreground'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Listado de Preguntas */}
      <div className="space-y-6">
        {preguntasFiltradas.map((q, idx) => {
          const estaRevelada = !!reveladas[q.id];

          return (
            <div
              key={q.id}
              className="border border-border/80 rounded-2xl bg-card p-5 sm:p-6 space-y-4 shadow-sm"
            >
              {/* Encabezado de Pregunta */}
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-purple-500/10 text-purple-600 dark:text-purple-400">
                      Pregunta #{idx + 1}
                    </span>
                    <span className="text-[11px] text-muted font-medium bg-muted px-2 py-0.5 rounded">
                      {q.category}
                    </span>
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-foreground pt-1">
                    {q.question}
                  </h3>
                </div>

                <button
                  onClick={() => toggleRevelar(q.id)}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                    estaRevelada
                      ? 'bg-purple-600 text-white shadow-sm'
                      : 'border border-border hover:bg-muted text-foreground'
                  }`}
                >
                  {estaRevelada ? (
                    <>
                      <EyeOff className="w-3.5 h-3.5" />
                      <span>Ocultar Respuesta</span>
                    </>
                  ) : (
                    <>
                      <Eye className="w-3.5 h-3.5 text-purple-500" />
                      <span>Revelar Respuesta Senior</span>
                    </>
                  )}
                </button>
              </div>

              {!estaRevelada ? (
                <div className="p-4 border border-dashed rounded-xl bg-muted/10 text-center text-xs text-muted space-y-1">
                  <p className="font-semibold text-foreground">💡 Ejercicio de Práctica Mental:</p>
                  <p>Intenta explicar en voz alta los puntos clave antes de presionar &quot;Revelar Respuesta Senior&quot;.</p>
                </div>
              ) : (
                <div className="space-y-4 pt-3 border-t border-border/40 animate-in fade-in-50">
                  {/* Respuesta Senior */}
                  <div className="space-y-2">
                    <h4 className="font-bold text-xs text-foreground flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                      Respuesta del Candidato Senior:
                    </h4>
                    <div className="p-4 rounded-xl border border-border/80 bg-background text-xs leading-relaxed text-foreground whitespace-pre-line">
                      {q.seniorAnswer}
                    </div>
                  </div>

                  {/* Código de Ejemplo */}
                  {q.codeExample && (
                    <div>
                      <h4 className="font-bold text-xs text-foreground mb-1">Ejemplo de Código / Demostración:</h4>
                      <CodeBlock code={q.codeExample} language="tsx" />
                    </div>
                  )}

                  {/* Trampas y Red Flags */}
                  {q.trapsAndRedFlags.length > 0 && (
                    <div className="space-y-2 pt-2 border-t border-border/40">
                      <h4 className="font-bold text-xs text-amber-600 dark:text-amber-400 flex items-center gap-1.5">
                        <AlertTriangle className="w-4 h-4 text-amber-500" />
                        Trampas comunes y Red Flags en la entrevista:
                      </h4>
                      <ul className="space-y-2 text-xs">
                        {q.trapsAndRedFlags.map((trap, tIdx) => (
                          <li
                            key={tIdx}
                            className="p-3 rounded-xl border border-amber-500/20 bg-amber-500/5 text-foreground flex items-start gap-2.5"
                          >
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
          );
        })}
      </div>
    </div>
  );
}
