'use client';

import React, { useState } from 'react';

const TABS_DATA = [
  {
    id: 'fundamentos',
    titulo: 'Fundamentals',
    contenido: 'React is declarative and uses the Virtual DOM to reconcile minimal changes with the real DOM.'
  },
  {
    id: 'hooks',
    titulo: 'Hooks & State',
    contenido: 'Hooks allow reusing stateful logic without classes or this-binding pitfalls.'
  },
  {
    id: 'moderno',
    titulo: 'React 19 & Next.js',
    contenido: 'Server Components run on the server with zero client-side JavaScript, complemented by Server Actions.'
  }
];

export function TabsExercise() {
  const [activa, setActiva] = useState(0);

  return (
    <div className="p-5 border rounded-2xl bg-card space-y-4 shadow-sm">
      <div className="border-b pb-3">
        <h3 className="font-bold text-base">Exercise 7: Accessible Tabs System (WAI-ARIA)</h3>
        <p className="text-xs text-muted">Evaluates semantic attributes `role=&quot;tablist&quot;`, `role=&quot;tab&quot;`, and synchronized panels.</p>
      </div>

      <div role="tablist" aria-label="React proficiency levels" className="flex border-b border-border/80 gap-2">
        {TABS_DATA.map((tab, idx) => (
          <button
            key={tab.id}
            role="tab"
            id={`tab-${tab.id}`}
            aria-controls={`panel-${tab.id}`}
            aria-selected={activa === idx}
            tabIndex={activa === idx ? 0 : -1}
            onClick={() => setActiva(idx)}
            className={`px-4 py-2 text-xs font-semibold border-b-2 transition-all -mb-[2px] ${
              activa === idx
                ? 'border-primary text-primary'
                : 'border-transparent text-muted hover:text-foreground'
            }`}
          >
            {tab.titulo}
          </button>
        ))}
      </div>

      <div
        role="tabpanel"
        id={`panel-${TABS_DATA[activa].id}`}
        aria-labelledby={`tab-${TABS_DATA[activa].id}`}
        className="p-4 rounded-xl bg-background border text-xs leading-relaxed text-foreground animate-in fade-in-50"
      >
        <h4 className="font-bold text-sm mb-1 text-primary">{TABS_DATA[activa].titulo}</h4>
        <p className="text-muted">{TABS_DATA[activa].contenido}</p>
      </div>
    </div>
  );
}
