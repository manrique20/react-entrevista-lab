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
    explanation: "Both arrays coerce to primitives via toString() -> '' + '' = ''."
  },
  {
    expression: "[] + {}",
    expectedResult: "'[object Object]'",
    type: "string",
    explanation: "[] coerces to '' and {} to '[object Object]'. The '+' operator concatenates them."
  },
  {
    expression: "'5' + 3",
    expectedResult: "'53'",
    type: "string",
    explanation: "Binary '+' prioritizes string concatenation whenever either operand is a string."
  },
  {
    expression: "'5' - 3",
    expectedResult: "2",
    type: "number",
    explanation: "The '-' operator only possesses arithmetic semantics, coercing '5' to the number 5."
  },
  {
    expression: "true + true",
    expectedResult: "2",
    type: "number",
    explanation: "Booleans coerce numerically to 1 -> 1 + 1 = 2."
  },
  {
    expression: "[] == ![]",
    expectedResult: "true",
    type: "boolean",
    explanation: "![] evaluates to false. Then [] == false converts both sides to numbers: 0 == 0 -> true."
  },
  {
    expression: "null >= 0",
    expectedResult: "true",
    type: "boolean",
    explanation: "Relational comparisons (>=, <=) coerce null to number 0 (0 >= 0 is true)."
  },
  {
    expression: "null == 0",
    expectedResult: "false",
    type: "boolean",
    explanation: "Under abstract equality '==', null is only equal to undefined and to itself."
  },
  {
    expression: "'b' + 'a' + +'a' + 'a'",
    expectedResult: "'baNaNa'",
    type: "string",
    explanation: "+'a' attempts to parse 'a' as a number, resulting in NaN. Concatenates: 'b' + 'a' + 'NaN' + 'a'."
  }
];

export function CoercionMatrix() {
  const [selectedCase, setSelectedCase] = useState<CoercionCase>(cases[0]);

  return (
    <div className="rounded-2xl border border-amber-500/30 bg-card p-5 space-y-4 shadow-sm">
      <div className="flex items-center gap-2 border-b border-border/60 pb-3">
        <Sparkles className="w-4 h-4 text-amber-500" />
        <h3 className="text-sm font-bold text-foreground">
          Type Coercion &amp; Quirks Explorer
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
            <span className="text-[10px] text-muted">eval</span>
          </button>
        ))}
      </div>

      <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 space-y-2 font-mono text-xs">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
          <span className="text-amber-300 font-bold text-sm">{selectedCase.expression}</span>
          <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold">
            Result: {selectedCase.expectedResult} ({selectedCase.type})
          </span>
        </div>
        <p className="text-slate-300 font-sans text-xs leading-relaxed pt-1">
          <strong className="text-amber-400 font-sans">ECMAScript Spec: </strong>
          {selectedCase.explanation}
        </p>
      </div>
    </div>
  );
}
