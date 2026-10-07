'use client';

import React, { useState } from 'react';
import { Plus, Minus, RotateCcw, History } from 'lucide-react';

export function CounterExercise() {
  const [cuenta, setCuenta] = useState(0);
  const [paso, setPaso] = useState(1);
  const [limiteMin, setLimiteMin] = useState(-10);
  const [limiteMax, setLimiteMax] = useState(10);
  const [historial, setHistorial] = useState<{ id: string; anterior: number; nuevo: number; hora: string }[]>([]);

  const modificar = (delta: number) => {
    setCuenta(prev => {
      const proximo = prev + delta;
      if (proximo < limiteMin || proximo > limiteMax) return prev;
      setHistorial(h => [
        {
          id: crypto.randomUUID(),
          anterior: prev,
          nuevo: proximo,
          hora: new Date().toLocaleTimeString()
        },
        ...h.slice(0, 7)
      ]);
      return proximo;
    });
  };

  const resetear = () => {
    setCuenta(0);
    setHistorial([]);
  };

  return (
    <div className="p-5 border rounded-2xl bg-card space-y-4 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b pb-3">
        <div>
          <h3 className="font-bold text-base">Ejercicio 1: Contador con Historial y Límites</h3>
          <p className="text-xs text-muted">Evalúa `useState`, actualizaciones funcionales inmutables y límites.</p>
        </div>
        <button
          onClick={resetear}
          className="px-3 py-1.5 border rounded-lg text-xs font-medium hover:bg-muted flex items-center gap-1.5"
        >
          <RotateCcw className="w-3.5 h-3.5" /> Reset
        </button>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 border rounded-xl bg-background">
        <div className="text-center">
          <span className="text-xs text-muted block uppercase tracking-wider">Valor Actual</span>
          <span className={`text-4xl font-extrabold font-mono ${
            cuenta === limiteMax ? 'text-emerald-500' : cuenta === limiteMin ? 'text-red-500' : 'text-primary'
          }`}>
            {cuenta}
          </span>
          <span className="text-[11px] text-muted block mt-1">Límites: [{limiteMin} ... {limiteMax}]</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => modificar(-paso)}
            disabled={cuenta - paso < limiteMin}
            className="p-3 bg-red-600 hover:bg-red-700 disabled:opacity-40 text-white rounded-xl transition-colors"
            title="Decrementar"
          >
            <Minus className="w-5 h-5" />
          </button>
          <button
            onClick={() => modificar(paso)}
            disabled={cuenta + paso > limiteMax}
            className="p-3 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white rounded-xl transition-colors"
            title="Incrementar"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>

        <div className="text-xs space-y-1">
          <label className="text-muted block">Tamaño del paso:</label>
          <select
            value={paso}
            onChange={e => setPaso(Number(e.target.value))}
            className="px-3 py-1.5 border rounded-lg bg-card text-foreground font-mono"
          >
            <option value={1}>Paso de 1</option>
            <option value={2}>Paso de 2</option>
            <option value={5}>Paso de 5</option>
          </select>
        </div>
      </div>

      {/* Historial */}
      <div className="space-y-2">
        <h4 className="text-xs font-semibold text-muted flex items-center gap-1.5">
          <History className="w-4 h-4" /> Historial de transiciones inmutables:
        </h4>
        {historial.length === 0 ? (
          <p className="text-xs text-muted italic">Sin cambios registrados aún.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 font-mono text-xs">
            {historial.map(h => (
              <div key={h.id} className="p-2 border rounded-lg bg-muted/20 flex justify-between">
                <span>{h.anterior} &rarr; <strong className="text-primary">{h.nuevo}</strong></span>
                <span className="text-muted text-[10px]">{h.hora}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
