'use client';

import React, { useState, useRef } from 'react';
import { Star, RotateCcw, CheckCircle2, Sparkles, Code2, Keyboard, Eye } from 'lucide-react';
import confetti from 'canvas-confetti';

interface StarRatingProps {
  maxStars?: number;
  initialRating?: number;
  onChange?: (rating: number) => void;
}

export function StarRatingExercise({ maxStars = 5, initialRating = 0, onChange }: StarRatingProps) {
  const [rating, setRating] = useState<number>(initialRating);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [focusedIndex, setFocusedIndex] = useState<number>(-1);
  const [showCode, setShowCode] = useState(false);
  const starRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const LABELS: Record<number, string> = {
    1: '1 estrella: Malo / Deficiente',
    2: '2 estrellas: Regular / Aceptable',
    3: '3 estrellas: Bueno / Cumple expectativas',
    4: '4 estrellas: Muy Bueno / Recomendado',
    5: '5 estrellas: Excelente / Nivel Staff'
  };

  const handleSelect = (val: number) => {
    setRating(val);
    onChange?.(val);
    if (val === 5) {
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    let nextIndex = index;

    switch (e.key) {
      case 'ArrowRight':
      case 'ArrowUp':
        e.preventDefault();
        nextIndex = Math.min(maxStars - 1, index + 1);
        break;
      case 'ArrowLeft':
      case 'ArrowDown':
        e.preventDefault();
        nextIndex = Math.max(0, index - 1);
        break;
      case 'Home':
        e.preventDefault();
        nextIndex = 0;
        break;
      case 'End':
        e.preventDefault();
        nextIndex = maxStars - 1;
        break;
      case ' ':
      case 'Enter':
        e.preventDefault();
        handleSelect(index + 1);
        return;
      default:
        return;
    }

    starRefs.current[nextIndex]?.focus();
    setFocusedIndex(nextIndex);
    handleSelect(nextIndex + 1);
  };

  const activeDisplayRating = hoverRating > 0 ? hoverRating : rating;

  return (
    <div className="space-y-6">
      {/* Explicación del problema */}
      <div className="p-4 rounded-2xl bg-muted/30 border border-border/80 space-y-1.5">
        <div className="flex items-center gap-2 text-xs font-bold text-foreground">
          <Keyboard className="w-4 h-4 text-amber-500" />
          <span>Reto de Accesibilidad (WAI-ARIA) en Componentes Personalizados</span>
        </div>
        <p className="text-xs text-muted leading-relaxed">
          Un control de rating no es solo un conjunto de iconos SVG con <code>onClick</code>. Los entrevistadores senior evalúan si implementas el patrón semántico <code>role=&quot;radiogroup&quot;</code> con navegación bidireccional por teclado (flechas, Home, End y Space).
        </p>
      </div>

      {/* Componente Star Rating Interactivo */}
      <div className="rounded-2xl border border-border/80 bg-card p-6 sm:p-8 space-y-6 shadow-sm text-center">
        <div className="space-y-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-muted font-mono">
            Calificación del Candidato en Entrevista
          </span>
          <h3 className="text-xl sm:text-2xl font-black text-foreground">
            ¿Cómo evalúas la respuesta técnica?
          </h3>
        </div>

        {/* Contenedor WAI-ARIA RadioGroup */}
        <div
          role="radiogroup"
          aria-label="Calificación de 1 a 5 estrellas"
          className="inline-flex items-center justify-center gap-2 p-3 rounded-2xl bg-muted/20 border border-border/70"
          onMouseLeave={() => setHoverRating(0)}
        >
          {Array.from({ length: maxStars }).map((_, idx) => {
            const starValue = idx + 1;
            const isFilled = starValue <= activeDisplayRating;
            const isSelected = starValue === rating;

            return (
              <button
                key={starValue}
                ref={el => {
                  starRefs.current[idx] = el;
                }}
                type="button"
                role="radio"
                aria-checked={isSelected}
                aria-label={`${starValue} de ${maxStars} estrellas: ${LABELS[starValue] || ''}`}
                tabIndex={rating === starValue || (rating === 0 && idx === 0) ? 0 : -1}
                onClick={() => handleSelect(starValue)}
                onMouseEnter={() => setHoverRating(starValue)}
                onKeyDown={e => handleKeyDown(e, idx)}
                className={`p-2 rounded-xl transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-amber-500 transform hover:scale-125 active:scale-95 ${
                  isFilled ? 'text-amber-500' : 'text-slate-300 dark:text-slate-700 hover:text-amber-300'
                }`}
              >
                <Star
                  className={`w-8 h-8 transition-colors ${
                    isFilled ? 'fill-amber-400 stroke-amber-500' : 'stroke-current'
                  }`}
                />
              </button>
            );
          })}
        </div>

        {/* Etiqueta semántica del rating activo */}
        <div className="space-y-1 min-h-[48px]">
          <p className="text-sm font-bold text-foreground transition-all">
            {activeDisplayRating > 0 ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-300">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{LABELS[activeDisplayRating] || `${activeDisplayRating} estrellas`}</span>
              </span>
            ) : (
              <span className="text-muted text-xs">Pasa el ratón o usa las flechas del teclado para calificar</span>
            )}
          </p>
          {hoverRating > 0 && hoverRating !== rating && (
            <p className="text-[11px] text-muted italic">
              (Previsualizando {hoverRating} estrellas • Haz clic para fijar)
            </p>
          )}
        </div>

        {/* Botón para reiniciar */}
        <div className="flex items-center justify-center gap-3 pt-2">
          <button
            onClick={() => {
              setRating(0);
              setHoverRating(0);
            }}
            disabled={rating === 0}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-border/80 text-xs font-semibold text-muted hover:text-foreground hover:bg-muted transition-colors disabled:opacity-40"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Limpiar calificación</span>
          </button>
        </div>
      </div>

      {/* Inspector de Estados de Accesibilidad */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
        <div className="p-3.5 rounded-xl border border-border/80 bg-card space-y-1">
          <span className="text-[10px] text-muted font-mono uppercase">Rating Fijado</span>
          <p className="text-base font-bold text-foreground">
            {rating > 0 ? `${rating} / ${maxStars}` : 'Sin calificar (0)'}
          </p>
        </div>

        <div className="p-3.5 rounded-xl border border-border/80 bg-card space-y-1">
          <span className="text-[10px] text-muted font-mono uppercase">Hover Temporal</span>
          <p className="text-base font-bold text-foreground">
            {hoverRating > 0 ? `${hoverRating} estrellas` : 'Inactivo'}
          </p>
        </div>

        <div className="p-3.5 rounded-xl border border-border/80 bg-card space-y-1">
          <span className="text-[10px] text-muted font-mono uppercase">WAI-ARIA Pattern</span>
          <p className="text-base font-bold text-emerald-600 dark:text-emerald-400">
            role=&quot;radiogroup&quot; OK
          </p>
        </div>
      </div>

      {/* Snippet de Código */}
      <div className="p-4 rounded-2xl bg-card border border-border/80 space-y-2">
        <button
          onClick={() => setShowCode(!showCode)}
          className="flex items-center gap-1.5 text-xs text-primary font-bold hover:underline"
        >
          <Code2 className="w-4 h-4" />
          <span>{showCode ? 'Ocultar código de implementación' : 'Ver implementación accesible WAI-ARIA'}</span>
        </button>

        {showCode && (
          <div className="rounded-xl bg-slate-950 p-4 border border-slate-800 text-slate-100 font-mono text-xs overflow-x-auto shadow-inner mt-2">
            <pre className="text-amber-200/90 leading-relaxed">
{`// Implementación accesible WAI-ARIA de Star Rating:
<div role="radiogroup" aria-label="Calificación">
  {Array.from({ length: 5 }).map((_, idx) => (
    <button
      key={idx}
      role="radio"
      aria-checked={rating === idx + 1}
      aria-label={\`\${idx + 1} de 5 estrellas\`}
      tabIndex={rating === idx + 1 ? 0 : -1}
      onKeyDown={(e) => {
        if (e.key === 'ArrowRight') setRating(r => Math.min(5, r + 1));
        if (e.key === 'ArrowLeft') setRating(r => Math.max(1, r - 1));
      }}
      onClick={() => setRating(idx + 1)}
    >
      <Star filled={idx + 1 <= (hoverRating || rating)} />
    </button>
  ))}
</div>`}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}

