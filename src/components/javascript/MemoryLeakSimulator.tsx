'use client';

import React, { useState } from 'react';
import {
  Activity,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  Play,
  Trash2,
  Layers,
  HelpCircle,
  ShieldCheck,
  Zap,
  Code2,
  Cpu
} from 'lucide-react';
import confetti from 'canvas-confetti';

type LeakScenario = 'detached-dom' | 'uncleaned-listeners' | 'retained-closures' | 'orphan-timers';

interface ScenarioInfo {
  id: LeakScenario;
  title: string;
  category: string;
  description: string;
  codeSmellSnippet: string;
  solutionSnippet: string;
  whyItLeaks: string;
  interviewTip: string;
}

const SCENARIOS: ScenarioInfo[] = [
  {
    id: 'detached-dom',
    title: 'Detached DOM Tree (Orphan Nodes)',
    category: 'DOM & V8 Heap',
    description:
      'DOM elements are removed from the tree with removeChild(), but JavaScript retains a reference in an array or global variable, preventing GC reclamation.',
    whyItLeaks:
      'V8 uses a Mark & Sweep algorithm starting from GC Roots (window, global scope variables). Even if an element is detached from the document tree, if it is reachable from a JS reference, the entire subtree and its listeners stay alive in heap memory.',
    codeSmellSnippet: `// ❌ CODE SMELL: Retained reference in external array
const elementsCache = [];

function createDetachedModal() {
  const container = document.createElement('div');
  container.innerHTML = '<div class="heavy-modal">' + 'A'.repeat(500000) + '</div>';
  document.body.appendChild(container);

  // Modal closed and removed from DOM:
  document.body.removeChild(container);

  // ⚠️ FATAL LEAK: container is retained in elementsCache
  elementsCache.push(container);
}`,
    solutionSnippet: `// ✅ SENIOR SOLUTION: Use WeakSet or nullify references
// Option 1: Explicitly clear reference
function destroyModal(container) {
  if (container.parentNode) {
    container.parentNode.removeChild(container);
  }
  container = null; // Clears reference so GC can collect
}

// Option 2: WeakSet / WeakMap when metadata is needed without retaining memory
const activeModals = new WeakSet();
// If the node is removed from DOM and has no other strong references,
// the GC collects it automatically even if held in a WeakSet.`,
    interviewTip:
      'In Chrome DevTools Memory tab, search for "Detached HTMLDivElement" in a Heap Snapshot to pinpoint detached DOM leaks.'
  },
  {
    id: 'uncleaned-listeners',
    title: 'Uncleaned Event Listeners',
    category: 'React useEffect & Window',
    description:
      'Registering listeners on window, document, or WebSockets inside useEffect without providing a cleanup return function.',
    whyItLeaks:
      'The window object is a permanent global GC Root. If you attach a listener that accesses component scope variables, window retains the callback function, which retains the entire component lexical closure and its state in memory, even after unmounting.',
    codeSmellSnippet: `// ❌ CODE SMELL: Missing cleanup in useEffect
function WindowMonitor() {
  const [data, setData] = useState(new Array(1000000).fill('data'));

  useEffect(() => {
    // ⚠️ Added to window but NEVER removed
    window.addEventListener('resize', () => {
      console.log('Window resized:', data.length);
    });
  }, [data]); // Each data change stacks yet another duplicated listener!
}`,
    solutionSnippet: `// ✅ SENIOR SOLUTION: Deterministic cleanup function
function WindowMonitor() {
  const [dimensions, setDimensions] = useState({ w: 0, h: 0 });

  useEffect(() => {
    const handleResize = () => {
      setDimensions({ w: window.innerWidth, h: window.innerHeight });
    };

    window.addEventListener('resize', handleResize);

    // ✅ MANDATORY CLEANUP: Removes listener on unmount
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []); // Empty deps: mounts and unmounts cleanly once
}`,
    interviewTip:
      'A classic interview question: "Why can useEffect(..., []) still cause a memory leak?". Answer: If the effect captures a large object and forgets to provide a cleanup function.'
  },
  {
    id: 'retained-closures',
    title: 'Retained Closures (Meteor V8 Phenomenon)',
    category: 'V8 Lexical Scope',
    description:
      'Two functions in the same lexical scope share the same Context Object in V8; if one function survives in a timer, it retains the heavy data of the other.',
    whyItLeaks:
      'In the V8 engine, functions declared in the same lexical scope share a single shared Lexical Context. If one long-lived closure (e.g. in a timer) survives, V8 cannot discard heavy variables created by a sibling closure that has already finished.',
    codeSmellSnippet: `// ❌ CODE SMELL: Closures sharing the same Context Object
let theThing = null;

function replaceThing() {
  const originalThing = theThing;

  // Unused closure that shares the same lexical scope
  const unused = function () {
    if (originalThing) console.log('hello');
  };

  // theThing retains a closure with a 10 MB array
  theThing = {
    longStr: new Array(1000000).join('*'),
    someMethod: function () {
      console.log('active');
    }
  };
}
// Called repeatedly in setInterval, memory climbs up to 1 GB!`,
    solutionSnippet: `// ✅ SENIOR SOLUTION: Isolate scopes and nullify references
function replaceThingClean() {
  // Avoid unnecessary shared closures
  const bigBuffer = new Array(1000000).join('*');

  theThing = {
    someMethod: function () {
      console.log('active');
    }
  };

  // bigBuffer falls out of scope cleanly without closures capturing it
}`,
    interviewTip:
      'Demonstrate Senior depth by explaining that JavaScript closures do not just capture an isolated variable, but the entire Lexical Environment context object of the enclosing scope.'
  },
  {
    id: 'orphan-timers',
    title: 'Orphan Timers (Uncancelled setInterval)',
    category: 'Async & Event Loop',
    description:
      'setInterval that keeps executing indefinitely after the component unmounts, continuously appending data into arrays.',
    whyItLeaks:
      'Timers registered with setInterval are managed by browser Web APIs and their callbacks are queued on the Macrotask Queue on every tick. If clearInterval(id) is never invoked, the timer never terminates and keeps all closure variables alive.',
    codeSmellSnippet: `// ❌ CODE SMELL: setInterval without saving or clearing timerId
function LiveStockTicker() {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    // ⚠️ The interval runs even if the user navigates away
    setInterval(() => {
      setHistory(prev => [...prev, Math.random()]);
    }, 1000);
  }, []);
}`,
    solutionSnippet: `// ✅ SENIOR SOLUTION: clearInterval with timerId in cleanup
function LiveStockTicker() {
  const [history, setHistory] = useState<number[]>([]);

  useEffect(() => {
    const timerId = setInterval(() => {
      setHistory(prev => [...prev.slice(-20), Math.random()]); // Bound size
    }, 1000);

    // ✅ CLEANUP: Destroys Web API timer immediately on unmount
    return () => {
      clearInterval(timerId);
    };
  }, []);
}`,
    interviewTip:
      'Also mention using AbortSignal with EventTarget or reactive polling hooks like TanStack Query for automatic background cancellation.'
  }
];

export function MemoryLeakSimulator() {
  const [selectedScenario, setSelectedScenario] = useState<LeakScenario>('detached-dom');
  const [baseHeapMB] = useState(14.5);
  const [leakedHeapMB, setLeakedHeapMB] = useState(0);
  const [leakCycles, setLeakCycles] = useState(0);
  const [retainedObjectsCount, setRetainedObjectsCount] = useState(0);
  const [logs, setLogs] = useState<string[]>([
    'Heap initialized in clean state (14.5 MB base V8 runtime).'
  ]);

  const activeScenario = SCENARIOS.find(s => s.id === selectedScenario) || SCENARIOS[0];

  const totalHeapMB = Math.round((baseHeapMB + leakedHeapMB) * 10) / 10;
  const isDangerous = totalHeapMB > 60;
  const isCritical = totalHeapMB > 100;

  const addLog = (msg: string) => {
    setLogs(prev => [msg, ...prev.slice(0, 6)]);
  };

  const handleTriggerLeak = () => {
    const deltaMB = selectedScenario === 'detached-dom' ? 18.2 : selectedScenario === 'uncleaned-listeners' ? 12.5 : 15.0;
    const addedCount = selectedScenario === 'detached-dom' ? 1000 : 25;

    setLeakedHeapMB(prev => prev + deltaMB);
    setLeakCycles(prev => prev + 1);
    setRetainedObjectsCount(prev => prev + addedCount);

    addLog(`⚠️ Leak triggered: +${deltaMB} MB retained on heap (${addedCount} orphan objects generated).`);
  };

  const handleRunGarbageCollector = () => {
    if (leakedHeapMB === 0) {
      addLog('🧹 Garbage Collector (Mark & Sweep) executed: No orphan objects found. Heap optimal.');
      return;
    }

    addLog(`🚨 V8 GC executed (Mark & Sweep): GC Roots analyzed. All ${retainedObjectsCount} objects could NOT be freed because they are still reachable from active roots.`);
  };

  const handleApplyFixAndReset = () => {
    setLeakedHeapMB(0);
    setLeakCycles(0);
    setRetainedObjectsCount(0);
    addLog('✨ Senior fix applied: References nullified and cleanups executed. Heap restored to 14.5 MB.');
    confetti({ particleCount: 35, spread: 50, origin: { y: 0.7 } });
  };

  return (
    <div className="space-y-6">
      {/* Scenario Selector Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
        {SCENARIOS.map(s => {
          const active = s.id === selectedScenario;
          return (
            <button
              key={s.id}
              onClick={() => {
                setSelectedScenario(s.id);
                setLeakedHeapMB(0);
                setLeakCycles(0);
                setRetainedObjectsCount(0);
              }}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap border ${
                active
                  ? 'bg-rose-600 text-white border-rose-600 shadow-sm'
                  : 'bg-card border-card-border hover:bg-card-hover text-muted-foreground'
              }`}
            >
              {s.title}
            </button>
          );
        })}
      </div>

      {/* Main Interactive Memory Panel */}
      <div className="bg-card border border-card-border rounded-2xl p-6 md:p-8 space-y-6 shadow-sm">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-card-border pb-6">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-rose-500/15 text-rose-600 dark:text-rose-400">
                {activeScenario.category}
              </span>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                V8 Heap Memory Simulator
              </span>
            </div>
            <h2 className="text-xl md:text-2xl font-black text-foreground">
              {activeScenario.title}
            </h2>
            <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">
              {activeScenario.description}
            </p>
          </div>

          {/* Quick Metrics Badge */}
          <div className="bg-muted/40 p-4 rounded-xl border border-card-border flex items-center gap-4 shrink-0">
            <div>
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">
                Used Heap
              </div>
              <div
                className={`text-2xl font-black font-mono ${
                  isCritical ? 'text-rose-500 animate-pulse' : isDangerous ? 'text-amber-500' : 'text-emerald-500'
                }`}
              >
                {totalHeapMB} MB
              </div>
            </div>
            <Cpu className="w-8 h-8 text-muted-foreground/40" />
          </div>
        </div>

        {/* Visual Heap Meter Bar */}
        <div className="p-5 rounded-xl border border-card-border bg-muted/20 space-y-3">
          <div className="flex items-center justify-between text-xs font-semibold">
            <span className="text-foreground flex items-center gap-1.5">
              <Activity className="w-4 h-4 text-cyan-500" />
              <span>Allocated RAM Memory Meter (V8 Heap Limit: 120 MB)</span>
            </span>
            <span className="font-mono text-muted-foreground">
              {retainedObjectsCount} orphan objects retained
            </span>
          </div>

          {/* Progress bar */}
          <div className="w-full h-4 rounded-full bg-muted overflow-hidden relative">
            <div
              className={`h-full transition-all duration-300 ${
                isCritical ? 'bg-rose-500' : isDangerous ? 'bg-amber-500' : 'bg-emerald-500'
              }`}
              style={{ width: `${Math.min(100, (totalHeapMB / 120) * 100)}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-[11px] text-muted-foreground font-mono">
            <span>Base: {baseHeapMB} MB</span>
            <span>+Cumulative leak: {leakedHeapMB.toFixed(1)} MB ({leakCycles} cycles)</span>
            <span>Simulated limit: 120 MB</span>
          </div>
        </div>

        {/* Controls Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
          <div className="flex items-center gap-2.5">
            <button
              onClick={handleTriggerLeak}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-sm transition-all active:scale-95"
            >
              <Play className="w-3.5 h-3.5" />
              <span>Trigger Leaking Action</span>
            </button>

            <button
              onClick={handleRunGarbageCollector}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-card-border bg-card hover:bg-card-hover text-foreground font-bold text-xs transition-all"
            >
              <Trash2 className="w-3.5 h-3.5 text-amber-500" />
              <span>Run Garbage Collector (GC)</span>
            </button>
          </div>

          <button
            onClick={handleApplyFixAndReset}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-all shadow-sm"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Apply Senior Fix &amp; Release Memory</span>
          </button>
        </div>

        {/* Real-time GC Terminal Log */}
        <div className="rounded-xl border border-neutral-800 bg-[#0d1117] text-neutral-200 p-4 space-y-2 text-xs font-mono">
          <div className="flex items-center justify-between text-neutral-400 border-b border-neutral-800 pb-2 text-[11px]">
            <span>V8 Engine Event Log</span>
            <span>Mark-Sweep Garbage Collector</span>
          </div>
          <div className="space-y-1 text-[11px] max-h-28 overflow-y-auto">
            {logs.map((log, i) => (
              <div key={i} className="leading-relaxed">
                <span className="text-neutral-500">&gt;</span> {log}
              </div>
            ))}
          </div>
        </div>

        {/* Code Comparison & Senior Solution */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 text-xs">
          {/* Antipatrón */}
          <div className="rounded-xl border border-rose-500/30 bg-[#0d1117] overflow-hidden">
            <div className="px-4 py-2 bg-rose-500/10 border-b border-rose-500/20 text-rose-400 font-bold font-mono text-[11px]">
              ❌ Code Causing the Memory Leak:
            </div>
            <pre className="p-4 font-mono text-rose-200/90 overflow-x-auto leading-relaxed whitespace-pre text-[11px]">
              {activeScenario.codeSmellSnippet}
            </pre>
          </div>

          {/* Senior Solution */}
          <div className="rounded-xl border border-emerald-500/30 bg-[#0d1117] overflow-hidden">
            <div className="px-4 py-2 bg-emerald-500/10 border-b border-emerald-500/20 text-emerald-400 font-bold font-mono text-[11px]">
              ✅ Senior Solution (Deterministic Cleanup):
            </div>
            <pre className="p-4 font-mono text-emerald-200/90 overflow-x-auto leading-relaxed whitespace-pre text-[11px]">
              {activeScenario.solutionSnippet}
            </pre>
          </div>
        </div>

        {/* Senior Interview Tip Box */}
        <div className="p-4 rounded-xl border border-indigo-500/20 bg-indigo-500/5 space-y-1.5 text-xs text-foreground/90">
          <div className="font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4" />
            <span>Root Cause &amp; Interview Tip:</span>
          </div>
          <p className="text-muted-foreground leading-relaxed">{activeScenario.whyItLeaks}</p>
          <div className="pt-1 text-foreground font-semibold">
            💡 {activeScenario.interviewTip}
          </div>
        </div>
      </div>
    </div>
  );
}

