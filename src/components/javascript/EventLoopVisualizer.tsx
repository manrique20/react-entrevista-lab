'use client';

import React, { useState } from 'react';
import { Play, RotateCcw, ArrowRight, Clock, Cpu, Layers, Sparkles } from 'lucide-react';

interface Step {
  id: number;
  description: string;
  callStack: string[];
  webApis: string[];
  microtasks: string[];
  macrotasks: string[];
  output: string[];
}

const steps: Step[] = [
  {
    id: 0,
    description: 'Estado inicial. El script está listo para ejecutarse en el Call Stack.',
    callStack: ['<main script>'],
    webApis: [],
    microtasks: [],
    macrotasks: [],
    output: []
  },
  {
    id: 1,
    description: "Se ejecuta console.log('1'). Se imprime directamente en consola de forma síncrona.",
    callStack: ["console.log('1')", '<main script>'],
    webApis: [],
    microtasks: [],
    macrotasks: [],
    output: ['1']
  },
  {
    id: 2,
    description: "Se llama a setTimeout(..., 0). El navegador registra el timer en Web APIs.",
    callStack: ['setTimeout(...)', '<main script>'],
    webApis: ['Timer (0ms) -> Macrotask'],
    microtasks: [],
    macrotasks: [],
    output: ['1']
  },
  {
    id: 3,
    description: "El timer de 0ms expira inmediatamente y encola su callback en la MACROTASK QUEUE.",
    callStack: ['<main script>'],
    webApis: [],
    microtasks: [],
    macrotasks: ["cb: console.log('2')"],
    output: ['1']
  },
  {
    id: 4,
    description: "Promise.resolve().then(...) encola su reacción en la MICROTASK QUEUE.",
    callStack: ['Promise.then(...)', '<main script>'],
    webApis: [],
    microtasks: ["then: console.log('3')"],
    macrotasks: ["cb: console.log('2')"],
    output: ['1']
  },
  {
    id: 5,
    description: "Se ejecuta console.log('4') síncrono. Imprime '4'. El script principal finaliza.",
    callStack: ["console.log('4')", '<main script>'],
    webApis: [],
    microtasks: ["then: console.log('3')"],
    macrotasks: ["cb: console.log('2')"],
    output: ['1', '4']
  },
  {
    id: 6,
    description: "Call Stack vacío. REGLA DE ORO: El Event Loop vacía TODAS las Microtareas antes de la siguiente Macrotarea. Imprime '3'.",
    callStack: ["then: console.log('3')"],
    webApis: [],
    microtasks: [],
    macrotasks: ["cb: console.log('2')"],
    output: ['1', '4', '3']
  },
  {
    id: 7,
    description: "Microtasks vacías. El Event Loop toma la primera Macrotarea encolada (setTimeout callback) y la ejecuta. Imprime '2'.",
    callStack: ["cb: console.log('2')"],
    webApis: [],
    microtasks: [],
    macrotasks: [],
    output: ['1', '4', '3', '2']
  },
  {
    id: 8,
    description: "¡Ejecución completa! Salida final: 1 -> 4 -> 3 -> 2.",
    callStack: [],
    webApis: [],
    microtasks: [],
    macrotasks: [],
    output: ['1', '4', '3', '2']
  }
];

export function EventLoopVisualizer() {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const step = steps[currentStepIndex];

  const handleNext = () => {
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
    }
  };

  const handleReset = () => {
    setCurrentStepIndex(0);
  };

  return (
    <div className="rounded-2xl border border-blue-500/30 bg-card p-5 space-y-4 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border/60 pb-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse" />
            <h3 className="text-sm font-bold text-foreground flex items-center gap-1.5">
              Simulador Visual del Event Loop (Micro vs Macro)
            </h3>
          </div>
          <p className="text-xs text-muted">
            Paso {currentStepIndex + 1} de {steps.length}: Observa la prioridad entre Stack, Microtasks y Macrotasks.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleReset}
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl border text-xs font-semibold hover:bg-muted text-muted transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reiniciar</span>
          </button>
          <button
            onClick={handleNext}
            disabled={currentStepIndex === steps.length - 1}
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-colors disabled:opacity-50"
          >
            <span>Siguiente Paso</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Snippet bajo prueba */}
      <div className="rounded-xl bg-slate-950 p-3 text-slate-100 font-mono text-xs border border-slate-800">
        <span className="text-slate-500">{'// Código bajo análisis:'}</span>
        <pre className="text-blue-300 mt-1">
{`console.log('1');
setTimeout(() => console.log('2'), 0);
Promise.resolve().then(() => console.log('3'));
console.log('4');`}
        </pre>
      </div>

      {/* Explicación del paso actual */}
      <div className="p-3.5 rounded-xl bg-blue-500/10 border border-blue-500/20 text-xs text-blue-900 dark:text-blue-200 font-medium">
        {step.description}
      </div>

      {/* Diagrama de los 4 cuadrantes */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
        {/* Call Stack */}
        <div className="p-3 rounded-xl border border-border/80 bg-muted/20 flex flex-col min-h-[140px]">
          <div className="flex items-center gap-1.5 font-bold text-foreground mb-2 pb-1 border-b border-border/60">
            <Cpu className="w-3.5 h-3.5 text-blue-500" />
            <span>Call Stack (LIFO)</span>
          </div>
          <div className="flex-1 flex flex-col-reverse justify-start gap-1">
            {step.callStack.length === 0 ? (
              <span className="text-slate-500 italic text-[11px] m-auto">Vacío</span>
            ) : (
              step.callStack.map((item, idx) => (
                <div key={idx} className="p-1.5 rounded bg-blue-500/20 border border-blue-500/40 font-mono text-[11px] text-foreground text-center animate-in fade-in">
                  {item}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Web APIs */}
        <div className="p-3 rounded-xl border border-border/80 bg-muted/20 flex flex-col min-h-[140px]">
          <div className="flex items-center gap-1.5 font-bold text-foreground mb-2 pb-1 border-b border-border/60">
            <Clock className="w-3.5 h-3.5 text-amber-500" />
            <span>Web APIs / Timers</span>
          </div>
          <div className="flex-1 flex flex-col justify-start gap-1">
            {step.webApis.length === 0 ? (
              <span className="text-slate-500 italic text-[11px] m-auto">Inactivo</span>
            ) : (
              step.webApis.map((item, idx) => (
                <div key={idx} className="p-1.5 rounded bg-amber-500/20 border border-amber-500/40 font-mono text-[11px] text-foreground text-center animate-in fade-in">
                  {item}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Microtask Queue */}
        <div className="p-3 rounded-xl border border-purple-500/30 bg-purple-500/5 flex flex-col min-h-[140px]">
          <div className="flex items-center gap-1.5 font-bold text-purple-600 dark:text-purple-400 mb-2 pb-1 border-b border-purple-500/20">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Microtasks (Alta prioridad)</span>
          </div>
          <div className="flex-1 flex flex-col justify-start gap-1">
            {step.microtasks.length === 0 ? (
              <span className="text-slate-500 italic text-[11px] m-auto">Vacía</span>
            ) : (
              step.microtasks.map((item, idx) => (
                <div key={idx} className="p-1.5 rounded bg-purple-500/20 border border-purple-500/40 font-mono text-[11px] text-foreground text-center animate-in fade-in">
                  {item}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Macrotask Queue */}
        <div className="p-3 rounded-xl border border-emerald-500/30 bg-emerald-500/5 flex flex-col min-h-[140px]">
          <div className="flex items-center gap-1.5 font-bold text-emerald-600 dark:text-emerald-400 mb-2 pb-1 border-b border-emerald-500/20">
            <Layers className="w-3.5 h-3.5" />
            <span>Macrotasks (Timers/I/O)</span>
          </div>
          <div className="flex-1 flex flex-col justify-start gap-1">
            {step.macrotasks.length === 0 ? (
              <span className="text-slate-500 italic text-[11px] m-auto">Vacía</span>
            ) : (
              step.macrotasks.map((item, idx) => (
                <div key={idx} className="p-1.5 rounded bg-emerald-500/20 border border-emerald-500/40 font-mono text-[11px] text-foreground text-center animate-in fade-in">
                  {item}
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Salida acumulada */}
      <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-slate-100 flex items-center justify-between">
        <span className="text-slate-400">Salida en Consola:</span>
        <div className="flex items-center gap-2">
          {step.output.length === 0 ? (
            <span className="text-slate-600 italic">(sin salida aún)</span>
          ) : (
            step.output.map((out, idx) => (
              <span key={idx} className="px-2 py-0.5 rounded bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-bold">
                {out}
              </span>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
