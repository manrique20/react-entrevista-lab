'use client';

import React, { useState, useEffect, useLayoutEffect, useRef, useCallback } from 'react';
import { Microscope, Layers, AlertTriangle, Check, RefreshCw, Eye, EyeOff } from 'lucide-react';

// Demo 8.1: Árbol Fiber con punteros child, sibling y return
export function FiberTreeVisualizerDemo() {
  const [nodoSeleccionado, setNodoSeleccionado] = useState('App');

  const nodos: Record<string, { tipo: string; child: string | null; sibling: string | null; parent: string | null }> = {
    App: { tipo: 'RootComponent', child: 'Header', sibling: null, parent: null },
    Header: { tipo: 'HeaderComponent', child: 'Logo', sibling: 'Main', parent: 'App' },
    Logo: { tipo: 'HostComponent (<img>)', child: null, sibling: 'Nav', parent: 'Header' },
    Nav: { tipo: 'HostComponent (<nav>)', child: null, sibling: null, parent: 'Header' },
    Main: { tipo: 'MainComponent', child: 'Article', sibling: 'Footer', parent: 'App' },
    Article: { tipo: 'ArticleComponent', child: null, sibling: null, parent: 'Main' },
    Footer: { tipo: 'FooterComponent', child: null, sibling: null, parent: 'App' }
  };

  const actual = nodos[nodoSeleccionado];

  return (
    <div className="p-4 border rounded-xl bg-card text-xs space-y-4">
      <div className="flex flex-wrap gap-1.5 items-center">
        <span className="font-semibold text-muted mr-1">Seleccionar nodo Fiber:</span>
        {Object.keys(nodos).map(k => (
          <button
            key={k}
            onClick={() => setNodoSeleccionado(k)}
            className={`px-2.5 py-1 rounded font-mono text-[11px] ${
              nodoSeleccionado === k ? 'bg-orange-600 text-white font-bold' : 'border hover:bg-muted'
            }`}
          >
            {k}
          </button>
        ))}
      </div>

      <div className="p-4 border rounded-xl bg-background font-mono space-y-2">
        <div className="flex items-center justify-between border-b pb-2">
          <span className="text-sm font-bold text-orange-500">FiberNode: {nodoSeleccionado}</span>
          <span className="text-muted text-[11px]">{actual.tipo}</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px]">
          <p><strong>.child (Primer Hijo):</strong> <span className="text-blue-500">{actual.child ?? 'null'}</span></p>
          <p><strong>.sibling (Hermano):</strong> <span className="text-emerald-500">{actual.sibling ?? 'null'}</span></p>
          <p><strong>.return (Padre):</strong> <span className="text-purple-500">{actual.parent ?? 'null'}</span></p>
        </div>
        <p className="text-[10px] text-muted pt-2 border-t">
          Esta estructura de punteros sustituye la recursión de llamadas con bucles pausables, permitiendo rendering concurrente.
        </p>
      </div>
    </div>
  );
}

// Demo 8.5: Bug de Stale Closure y sus 3 soluciones en vivo
export function StaleClosuresDemo() {
  const [cuenta, setCuenta] = useState(0);
  const [modo, setModo] = useState<'bug' | 'funcional' | 'ref'>('bug');
  const [valorRegistrado, setValorRegistrado] = useState(0);

  const cuentaRef = useRef(cuenta);
  cuentaRef.current = cuenta;

  useEffect(() => {
    const id = setInterval(() => {
      if (modo === 'bug') {
        // 💣 Stale Closure: esta closure capturó el valor de 'cuenta' al montar el efecto
        setValorRegistrado(cuenta);
      } else if (modo === 'funcional') {
        // ✅ Solución 1: actualización funcional
        setCuenta(c => {
          setValorRegistrado(c + 1);
          return c + 1;
        });
      } else if (modo === 'ref') {
        // ✅ Solución 2: lectura a través de useRef mutable
        setValorRegistrado(cuentaRef.current);
      }
    }, 1000);

    return () => clearInterval(id);
  }, [modo]); // Intencionalmente sin [cuenta] para evidenciar el bug en modo 'bug'

  return (
    <div className="p-4 border rounded-xl bg-card text-xs space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          <button
            onClick={() => setCuenta(c => c + 1)}
            className="px-3 py-1.5 bg-primary text-white rounded font-medium"
          >
            Incrementar Cuenta ({cuenta})
          </button>
          <button onClick={() => setCuenta(0)} className="px-3 py-1.5 border rounded">
            Reset
          </button>
        </div>
        <span className="font-mono text-sm">Estado React: <strong>{cuenta}</strong></span>
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setModo('bug')}
          className={`px-3 py-1 rounded font-medium ${modo === 'bug' ? 'bg-red-600 text-white' : 'border'}`}
        >
          ❌ Modo Stale Closure (Captura Congelada)
        </button>
        <button
          onClick={() => setModo('funcional')}
          className={`px-3 py-1 rounded font-medium ${modo === 'funcional' ? 'bg-emerald-600 text-white' : 'border'}`}
        >
          ✅ Solución 1: Forma Funcional (prev =&gt; ...)
        </button>
        <button
          onClick={() => setModo('ref')}
          className={`px-3 py-1 rounded font-medium ${modo === 'ref' ? 'bg-blue-600 text-white' : 'border'}`}
        >
          ✅ Solución 2: Lectura vía useRef
        </button>
      </div>

      <div className="p-3 border rounded bg-background font-mono">
        <p>Valor leído por el setInterval en este segundo: <strong className={modo === 'bug' ? 'text-red-500' : 'text-emerald-500'}>{valorRegistrado}</strong></p>
        {modo === 'bug' && (
          <p className="text-[11px] text-red-500 mt-1">
            Observa cómo aunque pulses &quot;Incrementar Cuenta&quot;, el setInterval sigue leyendo {valorRegistrado} porque está atrapado en la closure del primer render.
          </p>
        )}
      </div>
    </div>
  );
}

// Demo 8.8: useEffect vs useLayoutEffect Flicker Simulator
export function LayoutEffectFlickerDemo() {
  const [tamano, setTamano] = useState(100);
  const [usarLayoutEffect, setUsarLayoutEffect] = useState(false);
  const cajaRef = useRef<HTMLDivElement>(null);

  // Simulación: ajusta el tamaño tras medir
  const ejecutarAjuste = () => {
    setTamano(prev => (prev === 100 ? 220 : 100));
  };

  return (
    <div className="p-4 border rounded-xl bg-card text-xs space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          <button
            onClick={() => setUsarLayoutEffect(!usarLayoutEffect)}
            className={`px-3 py-1.5 rounded font-medium border ${
              usarLayoutEffect ? 'bg-emerald-500/20 text-emerald-600 border-emerald-500/30' : 'bg-amber-500/20 text-amber-600 border-amber-500/30'
            }`}
          >
            {usarLayoutEffect ? '✅ useLayoutEffect (Síncrono sin parpadeo)' : '⚠️ useEffect (Asíncrono tras pintar)'}
          </button>
          <button onClick={ejecutarAjuste} className="px-3 py-1.5 bg-primary text-white rounded font-medium">
            Alternar Dimensión
          </button>
        </div>
        <span className="font-mono text-muted">Ancho actual: {tamano}px</span>
      </div>

      <div className="h-28 border rounded bg-background flex items-center p-3 overflow-hidden">
        <div
          ref={cajaRef}
          style={{ width: `${tamano}px` }}
          className="h-16 bg-gradient-to-r from-orange-500 to-amber-500 rounded-lg flex items-center justify-center text-white font-bold text-xs transition-all duration-300"
        >
          {tamano}px
        </div>
      </div>
      <p className="text-muted text-[11px]">
        <code>useLayoutEffect</code> corre antes de que el navegador pinte el frame, asegurando mediciones de DOM y ajustes de posición con cero parpadeo.
      </p>
    </div>
  );
}

// Demo 8.10: Custom hooks implementados desde cero
export function CustomHooksFromScratchDemo() {
  const [cuenta, setCuenta] = useState(0);
  const valorPrevio = usePreviousHook(cuenta);

  return (
    <div className="p-4 border rounded-xl bg-card text-xs space-y-3">
      <div className="flex items-center gap-3">
        <button
          onClick={() => setCuenta(c => c + 1)}
          className="px-3 py-1.5 bg-primary text-white rounded font-medium"
        >
          Incrementar: {cuenta}
        </button>
      </div>

      <div className="p-3 border rounded bg-background font-mono space-y-1">
        <p>Valor Actual en Render: <strong className="text-primary">{cuenta}</strong></p>
        <p>Valor Anterior (usePrevious con useRef): <strong className="text-emerald-500">{valorPrevio !== undefined ? valorPrevio : 'undefined (Primer render)'}</strong></p>
      </div>
    </div>
  );
}

// Implementación de usePrevious desde cero
function usePreviousHook<T>(valor: T): T | undefined {
  const ref = useRef<T>(undefined);
  useEffect(() => {
    ref.current = valor; // Corre DESPUÉS del render
  }, [valor]);
  return ref.current;   // En el render actual retorna el valor previo
}

// Fallbacks para Nivel 8
export function RenderCommitPhasesDemo() {
  return (
    <div className="p-4 border rounded-xl bg-card text-xs space-y-2">
      <p className="font-semibold text-orange-500">Pipeline de Fases en React</p>
      <div className="font-mono text-[11px] text-muted space-y-1">
        <p>1. Trigger (setState) -&gt; Scheduler encola el trabajo</p>
        <p>2. Fase de Render: reconciliación en memoria (Interrumpible y Pura)</p>
        <p>3. Fase de Commit: mutación síncrona en el DOM real</p>
        <p>4. useLayoutEffect (síncrono antes de pintar)</p>
        <p>5. Pintado del navegador (Browser Paint)</p>
        <p>6. useEffect (asíncrono tras el pintado)</p>
      </div>
    </div>
  );
}

export function SchedulerLanesDemo() {
  return (
    <div className="p-4 border rounded-xl bg-card text-xs space-y-2">
      <p className="font-semibold text-orange-500">Scheduler Lanes (Prioridades de 31 bits)</p>
      <p className="text-muted">SyncLane (clic/input) &gt; InputContinuousLane &gt; DefaultLane &gt; TransitionLane &gt; IdleLane.</p>
    </div>
  );
}

export function HooksInternalsDemo() {
  return (
    <div className="p-4 border rounded-xl bg-card text-xs space-y-2">
      <p className="font-semibold text-orange-500">Lista Enlazada de Hooks</p>
      <p className="text-muted">React no almacena nombres de variables; recorre fiber.memoizedState en orden estricto.</p>
    </div>
  );
}

export function SetStateBatchingAsyncDemo() {
  return (
    <div className="p-4 border rounded-xl bg-card text-xs space-y-2">
      <p className="font-semibold text-orange-500">Encolado y Asincronía de setState</p>
      <p className="text-muted">setState encola un objeto Update en fiber.updateQueue; nunca muta la constante local en la misma línea.</p>
    </div>
  );
}

export function WhyRerenderBailoutDemo() {
  return (
    <div className="p-4 border rounded-xl bg-card text-xs space-y-2">
      <p className="font-semibold text-orange-500">Bailout con Object.is</p>
      <p className="text-muted">Si el setter recibe la misma referencia, React ejecuta un Eager Bailout y omite el render.</p>
    </div>
  );
}

export function HydrationMismatchDemo() {
  return (
    <div className="p-4 border rounded-xl bg-card text-xs space-y-2">
      <p className="font-semibold text-orange-500">Prevención de Mismatch de Hidratación</p>
      <p className="text-muted">Difiere lecturas dependientes del cliente (como la hora local o localStorage) a un useEffect tras el montaje.</p>
    </div>
  );
}
