'use client';

import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const ITEMS_ACORDEON = [
  {
    id: 'p1',
    pregunta: '¿Por qué la inmutabilidad es vital en React?',
    respuesta: 'React compara con Object.is; si mutas el objeto directamente, la referencia es la misma y React no detecta el cambio, omitiendo el re-render.'
  },
  {
    id: 'p2',
    pregunta: '¿Cuál es la diferencia entre useMemo y useCallback?',
    respuesta: 'useMemo memoiza el resultado de un cálculo pesado; useCallback memoiza la función misma para preservar identidad referencial.'
  },
  {
    id: 'p3',
    pregunta: '¿Para qué sirve useTransition en React 18/19?',
    respuesta: 'Marca actualizaciones como no urgentes e interrumpibles para mantener la capacidad de respuesta de la UI a 60 FPS.'
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
          <h3 className="font-bold text-base">Ejercicio 8: Acordeón Colapsable</h3>
          <p className="text-xs text-muted">Evalúa gestión de estado múltiple vs exclusivo, atributos `aria-expanded` y transiciones.</p>
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
          {modoMultiple ? 'Modo Múltiple Activo' : 'Modo Simple (Exclusivo)'}
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
