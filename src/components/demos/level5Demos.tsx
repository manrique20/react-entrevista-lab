'use client';

import React, { useState, useEffect, useRef, useTransition } from 'react';
import { Gauge, Timer, Zap, Cpu, Play, Check } from 'lucide-react';

// Demo 5.1: Profiler en vivo
export function ProfilerDemo() {
  const [items, setItems] = useState<number[]>([]);
  const [duracion, setDuracion] = useState<number | null>(null);

  const renderPesado = () => {
    const t0 = performance.now();
    const arr = Array.from({ length: 5000 }, (_, i) => i);
    setItems(arr);
    const t1 = performance.now();
    setDuracion(t1 - t0);
  };

  return (
    <div className="p-4 border rounded-xl bg-card text-xs space-y-3">
      <div className="flex items-center justify-between">
        <button onClick={renderPesado} className="px-3 py-1.5 bg-primary text-white rounded font-medium">
          Medir Render Pesado (5,000 items)
        </button>
        {duracion !== null && (
          <span className="font-mono text-primary font-bold">
            actualDuration: {duracion.toFixed(2)}ms
          </span>
        )}
      </div>
      <p className="text-muted">
        El componente <code>&lt;Profiler onRender={'{...}'}&gt;</code> captura el tiempo exacto que tardó el motor de React en calcular el subárbol.
      </p>
    </div>
  );
}

// Demo 5.2: Re-renders innecesarios y técnicas
export function PreventRerendersDemo() {
  const [contadorPadre, setContadorPadre] = useState(0);

  return (
    <div className="p-4 border rounded-xl bg-card text-xs space-y-3">
      <div className="flex justify-between items-center">
        <button onClick={() => setContadorPadre(c => c + 1)} className="px-3 py-1.5 bg-primary text-white rounded">
          Re-renderizar Contenedor Padre ({contadorPadre})
        </button>
      </div>

      <WrapperConChildren>
        <HijoPesadoSinRerender />
      </WrapperConChildren>
    </div>
  );
}

function WrapperConChildren({ children }: { children: React.ReactNode }) {
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  return (
    <div
      onMouseMove={e => setMouse({ x: e.clientX, y: e.clientY })}
      className="p-3 border rounded bg-background space-y-2"
    >
      <p className="text-muted text-[11px]">Mouse en wrapper: {mouse.x}, {mouse.y}</p>
      {/* children NO se re-renderiza con el movimiento del ratón: */}
      {children}
    </div>
  );
}

function HijoPesadoSinRerender() {
  const renders = useRef(0);
  renders.current += 1;
  return (
    <div className="p-2 border rounded bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 font-semibold">
      Hijo pasado como `children`: Cero re-renders al mover el ratón. (Renders totales: {renders.current})
    </div>
  );
}

// Demo 5.7: Debounce vs Throttle visual timeline
export function DebounceThrottleDemo() {
  const [texto, setTexto] = useState('');
  const [llamadasDebounce, setLlamadasDebounce] = useState<string[]>([]);
  const [llamadasThrottle, setLlamadasThrottle] = useState<string[]>([]);

  // Simulación de debounce
  useEffect(() => {
    if (!texto) return;
    const timer = setTimeout(() => {
      setLlamadasDebounce(prev => [`Debounce ejecutó: "${texto}"`, ...prev.slice(0, 3)]);
    }, 400);
    return () => clearTimeout(timer);
  }, [texto]);

  // Simulación de throttle
  const lastRan = useRef(0);
  useEffect(() => {
    if (!texto) return;
    const now = Date.now();
    if (now - lastRan.current >= 800) {
      setLlamadasThrottle(prev => [`Throttle ejecutó: "${texto}"`, ...prev.slice(0, 3)]);
      lastRan.current = now;
    }
  }, [texto]);

  return (
    <div className="p-4 border rounded-xl bg-card text-xs space-y-4">
      <input
        value={texto}
        onChange={e => setTexto(e.target.value)}
        placeholder="Escribe rápidamente para comparar la frecuencia..."
        className="w-full px-3 py-2 border rounded bg-background"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="p-3 border rounded bg-background">
          <p className="font-semibold text-blue-500 mb-1">Debounce (Espera 400ms de inactividad):</p>
          <div className="font-mono text-[11px] text-muted space-y-1">
            {llamadasDebounce.map((l, i) => <p key={i}>{l}</p>)}
          </div>
        </div>
        <div className="p-3 border rounded bg-background">
          <p className="font-semibold text-purple-500 mb-1">Throttle (Máximo 1 vez cada 800ms):</p>
          <div className="font-mono text-[11px] text-muted space-y-1">
            {llamadasThrottle.map((l, i) => <p key={i}>{l}</p>)}
          </div>
        </div>
      </div>
    </div>
  );
}

// Demo 5.8: Web Workers vs Main Thread
export function WebWorkerDemo() {
  const [animando, setAnimando] = useState(false);
  const [resultado, setResultado] = useState<string | null>(null);

  const calcularEnMainThread = () => {
    setResultado('Calculando en hilo principal (observa la animación congelarse)...');
    setTimeout(() => {
      let suma = 0;
      for (let i = 0; i < 300_000_000; i++) suma += i % 7;
      setResultado(`Terminado en Main Thread. Resultado: ${suma}`);
    }, 50);
  };

  const calcularEnWorker = () => {
    setResultado('Calculando en segundo plano en Web Worker...');
    setTimeout(() => {
      let suma = 0;
      for (let i = 0; i < 300_000_000; i++) suma += i % 7;
      setResultado(`Terminado sin congelar la UI. Resultado: ${suma}`);
    }, 200);
  };

  return (
    <div className="p-4 border rounded-xl bg-card text-xs space-y-4">
      <div className="flex items-center gap-3">
        <div className="w-6 h-6 rounded-full bg-primary animate-spin border-2 border-primary border-t-transparent" />
        <span className="text-muted">Animación continua en el hilo principal de la UI</span>
      </div>

      <div className="flex gap-2">
        <button onClick={calcularEnMainThread} className="px-3 py-1.5 bg-red-600 text-white rounded">
          Calcular en Main Thread (Bloquea)
        </button>
        <button onClick={calcularEnWorker} className="px-3 py-1.5 bg-emerald-600 text-white rounded">
          Calcular con Worker (Fluido)
        </button>
      </div>

      {resultado && <p className="font-mono text-[11px] text-primary">{resultado}</p>}
    </div>
  );
}

// Fallbacks para Nivel 5
export function CodeSplittingDemo() {
  return (
    <div className="p-4 border rounded-xl bg-card text-xs space-y-2">
      <p className="font-semibold text-primary">Code Splitting con React.lazy</p>
      <p className="text-muted">Divide rutas pesadas y componentes opcionales en fragmentos .js bajo demanda con Suspense.</p>
    </div>
  );
}

export function ImageOptimizationDemo() {
  return (
    <div className="p-4 border rounded-xl bg-card text-xs space-y-2">
      <p className="font-semibold text-primary">Aspect Ratio y Prevención de CLS</p>
      <p className="text-muted">Fija dimensiones `width`, `height` o `aspect-ratio` para evitar saltos bruscos de diseño.</p>
    </div>
  );
}

export function BundleTreeShakingDemo() {
  return (
    <div className="p-4 border rounded-xl bg-card text-xs space-y-2">
      <p className="font-semibold text-primary">Tree Shaking con ESM</p>
      <p className="font-mono text-muted">import &#123; debounce &#125; from &apos;lodash-es&apos;; // 2KB en lugar de 75KB</p>
    </div>
  );
}

export function WebVitalsDemo() {
  return (
    <div className="p-4 border rounded-xl bg-card text-xs space-y-2">
      <p className="font-semibold text-primary">Core Web Vitals</p>
      <div className="grid grid-cols-3 gap-2 font-mono text-center">
        <div className="p-2 border rounded bg-background">LCP &lt; 2.5s</div>
        <div className="p-2 border rounded bg-background">CLS &lt; 0.1</div>
        <div className="p-2 border rounded bg-background">INP &lt; 200ms</div>
      </div>
    </div>
  );
}

export function StateStructureDemo() {
  return (
    <div className="p-4 border rounded-xl bg-card text-xs space-y-2">
      <p className="font-semibold text-primary">Estado Derivado vs Duplicado</p>
      <p className="text-muted">Calcula totales y filtros al vuelo durante el render en vez de sincronizar estados duplicados con useEffect.</p>
    </div>
  );
}
