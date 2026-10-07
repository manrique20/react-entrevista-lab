'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Loader2, ArrowDownCircle } from 'lucide-react';

export function InfiniteScrollExercise() {
  const [items, setItems] = useState<string[]>(() =>
    Array.from({ length: 8 }, (_, i) => `Elemento inicial #${i + 1}`)
  );
  const [pagina, setPagina] = useState(1);
  const [cargandoMas, setCargandoMas] = useState(false);
  const [hayMas, setHayMas] = useState(true);
  const centinelaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!hayMas) return;

    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && !cargandoMas) {
          cargarSiguienteLote();
        }
      },
      { threshold: 0.5 }
    );

    if (centinelaRef.current) {
      observer.observe(centinelaRef.current);
    }

    return () => observer.disconnect();
  }, [hayMas, cargandoMas, pagina]);

  const cargarSiguienteLote = () => {
    if (pagina >= 4) {
      setHayMas(false);
      return;
    }
    setCargandoMas(true);
    setTimeout(() => {
      const nuevos = Array.from({ length: 5 }, (_, i) => `Lote #${pagina + 1} - Elemento ${i + 1}`);
      setItems(prev => [...prev, ...nuevos]);
      setPagina(p => p + 1);
      setCargandoMas(false);
    }, 600);
  };

  return (
    <div className="p-5 border rounded-2xl bg-card space-y-4 shadow-sm">
      <div className="border-b pb-3">
        <h3 className="font-bold text-base">Ejercicio 5: Infinite Scroll con IntersectionObserver</h3>
        <p className="text-xs text-muted">Evalúa `IntersectionObserver`, `useRef` como centinela y acumulación inmutable de lotes.</p>
      </div>

      <div className="h-64 overflow-y-auto border rounded-xl p-3 bg-background space-y-2">
        {items.map((item, idx) => (
          <div key={idx} className="p-3 border rounded-lg bg-card text-xs font-mono flex justify-between">
            <span>{item}</span>
            <span className="text-muted text-[10px]">#{idx + 1}</span>
          </div>
        ))}

        {/* Centinela de intersección */}
        <div ref={centinelaRef} className="py-4 text-center">
          {cargandoMas ? (
            <div className="flex items-center justify-center gap-2 text-xs text-primary font-medium">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Cargando más elementos en background...</span>
            </div>
          ) : hayMas ? (
            <span className="text-[11px] text-muted flex items-center justify-center gap-1">
              <ArrowDownCircle className="w-3.5 h-3.5" /> Haz scroll para cargar lote {pagina + 1}...
            </span>
          ) : (
            <span className="text-xs text-emerald-500 font-semibold">
              ✓ Has llegado al final de todos los lotes.
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
