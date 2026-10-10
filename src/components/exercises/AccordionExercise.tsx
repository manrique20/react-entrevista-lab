'use client';

import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const ITEMS_ACORDEON = [
  {
    id: 'p1',
    pregunta: 'Why is immutability vital in React?',
    respuesta: 'React compares values using Object.is; if you mutate an object directly, the reference remains the same and React does not detect the change, skipping the re-render.'
  },
  {
    id: 'p2',
    pregunta: 'What is the difference between useMemo and useCallback?',
    respuesta: 'useMemo memoizes the result of an expensive calculation; useCallback memoizes the function definition itself to preserve referential identity.'
  },
  {
    id: 'p3',
    pregunta: 'What is useTransition used for in React 18/19?',
    respuesta: 'It marks state updates as non-urgent and interruptible to keep the UI responsive at 60 FPS.'
  }
];

export function AccordionExercise() {
  const [abiertos, setAbiertos] = useState<string[]>(['p1']);
  const [modoMultiple, setModoMultiple] = useState(false);

  const toggle = (id: string) => {
    if (modoMultiple) {
      setAbiertos(prev =>
        prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
      );
    } else {
      setAbiertos(prev => (prev.includes(id) ? [] : [id]));
    }
  };

  return (
    <div className="p-5 border rounded-2xl bg-card space-y-4 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b pb-3">
        <div>
          <h3 className="font-bold text-base">Exercise 8: Collapsible Accordion</h3>
          <p className="text-xs text-muted">Evaluates multiple vs. exclusive state management, `aria-expanded` attributes, and transitions.</p>
        </div>
        <button
          onClick={() => {
            setModoMultiple(!modoMultiple);
            setAbiertos(['p1']);
          }}
          className={`px-3 py-1 rounded-lg text-xs font-semibold border transition-colors ${
            modoMultiple ? 'bg-primary text-white' : 'hover:bg-muted'
          }`}
        >
          {modoMultiple ? 'Multiple Mode Active' : 'Single Mode (Exclusive)'}
        </button>
      </div>

      <div className="border rounded-xl divide-y bg-background overflow-hidden">
        {ITEMS_ACORDEON.map(item => {
          const estaAbierto = abiertos.includes(item.id);
          return (
            <div key={item.id} className="transition-colors">
              <button
                onClick={() => toggle(item.id)}
                aria-expanded={estaAbierto}
                className="w-full text-left p-3.5 flex items-center justify-between text-xs font-semibold hover:bg-muted/30"
              >
                <span>{item.pregunta}</span>
                <ChevronDown className={`w-4 h-4 text-muted transition-transform duration-200 ${estaAbierto ? 'rotate-180 text-primary' : ''}`} />
              </button>
              {estaAbierto && (
                <div className="px-3.5 pb-3.5 text-xs text-muted leading-relaxed border-t border-border/30 pt-2 animate-in fade-in-50">
                  {item.respuesta}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
