'use client';

import React, { useState, useEffect } from 'react';
import { Search, Loader2, Sparkles, Check } from 'lucide-react';

const BD_MOCK = [
  { id: '1', titulo: 'React 19 Server Actions', categoria: 'Next.js' },
  { id: '2', titulo: 'useOptimistic Hook', categoria: 'React 19' },
  { id: '3', titulo: 'useActionState Form State', categoria: 'React 19' },
  { id: '4', titulo: 'TanStack Query Server State', categoria: 'Data Fetching' },
  { id: '5', titulo: 'Zustand Global Store', categoria: 'State Management' },
  { id: '6', titulo: 'Fiber Architecture Double Buffering', categoria: 'Internals' },
  { id: '7', titulo: 'Virtual DOM Diffing Heuristics', categoria: 'Core' },
  { id: '8', titulo: 'IntersectionObserver Infinite Scroll', categoria: 'Performance' },
  { id: '9', titulo: 'DOMPurify XSS Sanitization', categoria: 'Security' },
  { id: '10', titulo: 'useTransition Concurrent Priority', categoria: 'React 18' }
];

export function DebounceSearchExercise() {
  const [termino, setTermino] = useState('');
  const [debouncedTermino, setDebouncedTermino] = useState('');
  const [cargando, setCargando] = useState(false);
  const [resultados, setResultados] = useState<typeof BD_MOCK>([]);

  // Hook personalizado de debounce en línea
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedTermino(termino);
    }, 400);

    return () => clearTimeout(timer);
  }, [termino]);

  // Simulación de búsqueda asíncrona en red
  useEffect(() => {
    if (!debouncedTermino.trim()) {
      setResultados([]);
      setCargando(false);
      return;
    }

    setCargando(true);
    const controller = new AbortController();

    const timer = setTimeout(() => {
      if (!controller.signal.aborted) {
        const filtrados = BD_MOCK.filter(item =>
          item.titulo.toLowerCase().includes(debouncedTermino.toLowerCase()) ||
          item.categoria.toLowerCase().includes(debouncedTermino.toLowerCase())
        );
        setResultados(filtrados);
        setCargando(false);
      }
    }, 500); // 500ms de latencia simulada de API

    return () => {
      controller.abort();
      clearTimeout(timer);
    };
  }, [debouncedTermino]);

  return (
    <div className="p-5 border rounded-2xl bg-card space-y-4 shadow-sm">
      <div className="border-b pb-3">
        <h3 className="font-bold text-base">Ejercicio 3: Buscador en Tiempo Real con Debounce</h3>
        <p className="text-xs text-muted">Evalúa hooks personalizados, cancelación de timers y prevención de llamadas excesivas a APIs.</p>
      </div>

      <div className="relative">
        <Search className="w-4 h-4 text-muted absolute left-3 top-3" />
        <input
          value={termino}
          onChange={e => setTermino(e.target.value)}
          placeholder="Busca por título o categoría (ej: 'React 19', 'State', 'Fiber')..."
          className="w-full pl-9 pr-4 py-2 border rounded-xl bg-background text-foreground text-xs focus:ring-2 focus:ring-primary focus:outline-none"
        />
        {cargando && (
          <Loader2 className="w-4 h-4 text-primary animate-spin absolute right-3 top-3" />
        )}
      </div>

      <div className="flex items-center justify-between text-xs font-mono text-muted bg-muted/20 px-3 py-1.5 rounded-lg">
        <span>Término inmediato en input: &quot;{termino}&quot;</span>
        <span>Debounced (400ms): &quot;{debouncedTermino}&quot;</span>
      </div>

      {/* Resultados */}
      <div className="space-y-2">
        {cargando ? (
          <div className="p-6 text-center text-xs text-muted font-medium flex items-center justify-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin text-primary" />
            <span>Consultando API simulada...</span>
          </div>
        ) : debouncedTermino && resultados.length === 0 ? (
          <div className="p-6 text-center text-xs text-muted italic border rounded-xl">
            No se encontraron coincidencias para &quot;{debouncedTermino}&quot;.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {resultados.map(res => (
              <div key={res.id} className="p-3 border rounded-xl bg-background flex items-center justify-between">
                <div>
                  <h4 className="font-semibold text-xs text-foreground">{res.titulo}</h4>
                  <span className="text-[10px] text-muted font-mono">{res.categoria}</span>
                </div>
                <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium">
                  Coincidencia
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
