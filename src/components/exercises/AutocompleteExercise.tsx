'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Search, Check } from 'lucide-react';

const SUGERENCIAS = [
  'React Server Components',
  'Server Actions',
  'useOptimistic',
  'useActionState',
  'useFormStatus',
  'useTransition',
  'useDeferredValue',
  'useSyncExternalStore',
  'useId',
  'createPortal',
  'forwardRef',
  'Virtual DOM Diffing',
  'Fiber Architecture'
];

export function AutocompleteExercise() {
  const [texto, setTexto] = useState('');
  const [abierto, setAbierto] = useState(false);
  const [indiceActivo, setIndiceActivo] = useState(-1);
  const listaRef = useRef<HTMLUListElement>(null);

  const filtradas = SUGERENCIAS.filter(s =>
    s.toLowerCase().includes(texto.toLowerCase())
  );

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!abierto || filtradas.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setIndiceActivo(prev => (prev < filtradas.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setIndiceActivo(prev => (prev > 0 ? prev - 1 : filtradas.length - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (indiceActivo >= 0 && indiceActivo < filtradas.length) {
        seleccionar(filtradas[indiceActivo]);
      }
    } else if (e.key === 'Escape') {
      setAbierto(false);
    }
  };

  const seleccionar = (opcion: string) => {
    setTexto(opcion);
    setAbierto(false);
    setIndiceActivo(-1);
  };

  return (
    <div className="p-5 border rounded-2xl bg-card space-y-4 shadow-sm">
      <div className="border-b pb-3">
        <h3 className="font-bold text-base">Ejercicio 9: Autocomplete con Selección por Teclado</h3>
        <p className="text-xs text-muted">Evalúa navegación completa por teclado (Flechas Arriba/Abajo, Enter, Escape) y gestión de foco.</p>
      </div>

      <div className="relative">
        <div className="relative">
          <Search className="w-4 h-4 text-muted absolute left-3 top-3" />
          <input
            value={texto}
            onChange={e => {
              setTexto(e.target.value);
              setAbierto(true);
              setIndiceActivo(-1);
            }}
            onFocus={() => setAbierto(true)}
            onKeyDown={handleKeyDown}
            placeholder="Escribe para autocompletar o usa las flechas..."
            className="w-full pl-9 pr-4 py-2 border rounded-xl bg-background text-foreground text-xs focus:ring-2 focus:ring-primary focus:outline-none"
          />
        </div>

        {abierto && texto && filtradas.length > 0 && (
          <ul
            ref={listaRef}
            className="absolute z-10 w-full mt-1 border rounded-xl bg-card shadow-xl max-h-48 overflow-y-auto divide-y divide-border/40 font-mono text-xs"
          >
            {filtradas.map((opcion, i) => (
              <li
                key={opcion}
                onMouseDown={() => seleccionar(opcion)}
                className={`p-2.5 cursor-pointer flex items-center justify-between transition-colors ${
                  indiceActivo === i ? 'bg-primary text-white' : 'hover:bg-muted/50 text-foreground'
                }`}
              >
                <span>{opcion}</span>
                {indiceActivo === i && <span className="text-[10px] opacity-80">↵ Enter</span>}
              </li>
            ))}
          </ul>
        )}
      </div>

      <p className="text-[11px] text-muted">
        Tip: Escribe una letra (ej: &quot;u&quot;) y navega con las flechas del teclado <kbd className="px-1 border rounded bg-muted">↓</kbd> <kbd className="px-1 border rounded bg-muted">↑</kbd> y presiona <kbd className="px-1 border rounded bg-muted">Enter</kbd>.
      </p>
    </div>
  );
}
