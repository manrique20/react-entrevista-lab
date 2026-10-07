'use client';

import React, { useState } from 'react';
import { HelpCircle, Sparkles, Check, ArrowRight } from 'lucide-react';

interface CoercionCase {
  expression: string;
  expectedResult: string;
  type: string;
  explanation: string;
}

const cases: CoercionCase[] = [
  {
    expression: "[] + []",
    expectedResult: "''",
    type: "string",
    explanation: "Ambos arrays se convierten a primitivos vía toString() -> '' + '' = ''."
  },
  {
    expression: "[] + {}",
    expectedResult: "'[object Object]'",
    type: "string",
    explanation: "[] se convierte a '' y {} a '[object Object]'. Con '+' concatena."
  },
  {
    expression: "'5' + 3",
    expectedResult: "'53'",
    type: "string",
    explanation: "El operador binario '+' prioriza concatenación si un operando es string."
  },
  {
    expression: "'5' - 3",
    expectedResult: "2",
    type: "number",
    explanation: "El operador '-' solo tiene significado aritmético, forzando a '5' a número."
  },
  {
    expression: "true + true",
    expectedResult: "2",
    type: "number",
    explanation: "Los booleanos se coercionan a 1 numéricamente -> 1 + 1 = 2."
  },
  {
    expression: "[] == ![]",
    expectedResult: "true",
    type: "boolean",
    explanation: "![] es false. Luego [] == false convierte ambos a número: 0 == 0 -> true."
  },
  {
    expression: "null >= 0",
    expectedResult: "true",
    type: "boolean",
    explanation: "Comparaciones relacionales (>=, <=) coercionan null a número (0 >= 0 es true)."
  },
  {
    expression: "null == 0",
    expectedResult: "false",
    type: "boolean",
    explanation: "Con '==', null solo es igual a undefined y a sí mismo."
  },
  {
    expression: "'b' + 'a' + +'a' + 'a'",
    expectedResult: "'baNaNa'",
    type: "string",
    explanation: "+'a' intenta convertir 'a' a número resultando en NaN. Concatena: 'b' + 'a' + 'NaN' + 'a'."
  }
];

export function CoercionMatrix() {
  const [selectedCase, setSelectedCase] = useState<CoercionCase>(cases[0]);

  return (
    <div className="rounded-2xl border border-amber-500/30 bg-card p-5 space-y-4 shadow-sm">
      <div className="flex items-center gap-2 border-b border-border/60 pb-3">
        <Sparkles className="w-4 h-4 text-amber-500" />
        <h3 className="text-sm font-bold text-foreground">
          Laboratorio de Coerción y Comparaciones Curiosas
        </h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
        {cases.map((item, idx) => (
          <button
            key={idx}
            onClick={() => setSelectedCase(item)}
            className={`p-2.5 rounded-xl border text-left font-mono text-xs transition-all flex items-center justify-between ${
              selectedCase.expression === item.expression
                ? 'border-amber-500 bg-amber-500/10 text-amber-700 dark:text-amber-300 font-bold'
                : 'border-border/70 hover:bg-muted text-foreground'
            }`}
          >
            <span>{item.expression}</span>
            <span className="text-[10px] text-muted">evaluar</span>
          </button>
        ))}
      </div>

      <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 space-y-2 font-mono text-xs">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
          <span className="text-amber-300 font-bold text-sm">{selectedCase.expression}</span>
          <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold">
            Resultado: {selectedCase.expectedResult} ({selectedCase.type})
          </span>
        </div>
        <p className="text-slate-300 font-sans text-xs leading-relaxed pt-1">
          <strong className="text-amber-400 font-sans">Regla ECMAScript: </strong>
          {selectedCase.explanation}
        </p>
      </div>
    </div>
  );
}
