'use client';

import React, { useState } from 'react';

const TABS_DATA = [
  {
    id: 'fundamentos',
    titulo: 'Fundamentos',
    contenido: 'React es declarativo y utiliza el Virtual DOM para reconciliar cambios mínimos en el DOM real.'
  },
  {
    id: 'hooks',
    titulo: 'Hooks & Estado',
    contenido: 'Los Hooks permiten reutilizar lógica con estado sin clases ni problemas de enlace de this.'
  },
  {
    id: 'moderno',
    titulo: 'React 19 & Next.js',
    contenido: 'Server Components corren en servidor con cero JavaScript en el cliente, complementados con Server Actions.'
  }
];

export function TabsExercise() {
  const [activa, setActiva] = useState(0);

  return (
    <div className="p-5 border rounded-2xl bg-card space-y-4 shadow-sm">
      <div className="border-b pb-3">
        <h3 className="font-bold text-base">Ejercicio 7: Sistema de Tabs Accesible (WAI-ARIA)</h3>
        <p className="text-xs text-muted">Evalúa atributos semánticos `role=&quot;tablist&quot;`, `role=&quot;tab&quot;` y paneles sincronizados.</p>
      </div>

      <div role="tablist" aria-label="Niveles de React" className="flex border-b border-border/80 gap-2">
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
