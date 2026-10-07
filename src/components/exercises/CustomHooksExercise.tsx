'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, Check, RefreshCw } from 'lucide-react';

export function CustomHooksExercise() {
  // 1. usePrevious
  const [contador, setContador] = useState(1);
  const valorAnterior = usePrevious(contador);

  // 2. useToggle
  const [activo, toggleActivo] = useToggle(false);

  // 3. useDebounce
  const [inputVal, setInputVal] = useState('');
  const debouncedVal = useDebounce(inputVal, 500);

  return (
    <div className="p-5 border rounded-2xl bg-card space-y-4 shadow-sm">
      <div className="border-b pb-3">
        <h3 className="font-bold text-base">Ejercicio 10: Suite de Custom Hooks Esenciales</h3>
        <p className="text-xs text-muted">Evalúa la implementación de memoria de los 4 hooks estrella de entrevistas: `usePrevious`, `useToggle`, `useDebounce` y `useLocalStorage`.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {/* usePrevious */}
        <div className="p-4 border rounded-xl bg-background space-y-2">
          <h4 className="font-semibold text-xs text-primary">1. usePrevious(val)</h4>
          <p className="text-xs text-muted">Usa `useRef` para guardar el valor en `useEffect` tras el render.</p>
          <div className="font-mono text-xs space-y-1 py-1">
            <p>Actual: <strong>{contador}</strong></p>
            <p className="text-muted">Anterior: <strong>{valorAnterior ?? 'N/A'}</strong></p>
          </div>
          <button
            onClick={() => setContador(c => c + 1)}
            className="w-full py-1.5 bg-primary text-white text-xs rounded font-medium hover:bg-primary/90"
          >
            Incrementar
          </button>
        </div>

        {/* useToggle */}
        <div className="p-4 border rounded-xl bg-background space-y-2">
          <h4 className="font-semibold text-xs text-emerald-500">2. useToggle(bool)</h4>
          <p className="text-xs text-muted">Alterna estado booleano sin escribir setters repetitivos.</p>
          <div className="font-mono text-xs py-2">
            Estado: <strong className={activo ? 'text-emerald-500' : 'text-muted'}>{activo ? 'TRUE' : 'FALSE'}</strong>
          </div>
          <button
            onClick={() => toggleActivo()}
            className="w-full py-1.5 bg-emerald-600 text-white text-xs rounded font-medium hover:bg-emerald-700"
          >
            Toggle Booleano
          </button>
        </div>

        {/* useDebounce */}
        <div className="p-4 border rounded-xl bg-background space-y-2">
          <h4 className="font-semibold text-xs text-purple-500">3. useDebounce(val, 500)</h4>
          <p className="text-xs text-muted">Pospone el valor con `setTimeout` y limpia con `clearTimeout`.</p>
          <input
            value={inputVal}
            onChange={e => setInputVal(e.target.value)}
            placeholder="Escribe algo..."
            className="w-full px-2 py-1 border rounded bg-card text-xs font-mono"
          />
          <p className="font-mono text-[11px] text-muted truncate">
            Debounced: <strong>&quot;{debouncedVal}&quot;</strong>
          </p>
        </div>
      </div>
    </div>
  );
}

function usePrevious<T>(value: T): T | undefined {
  const ref = useRef<T>(undefined);
  useEffect(() => {
    ref.current = value;
  }, [value]);
  return ref.current;
}

function useToggle(initial: boolean = false): [boolean, (force?: boolean) => void] {
  const [state, setState] = useState(initial);
  const toggle = (force?: boolean) => setState(prev => (typeof force === 'boolean' ? force : !prev));
  return [state, toggle];
}

function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debounced;
}
