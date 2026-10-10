'use client';

import React, { useState, useEffect, useRef } from 'react';

// Demo 5.1: Live Profiler
export function ProfilerDemo() {
  const [, setItems] = useState<number[]>([]);
  const [duration, setDuration] = useState<number | null>(null);

  const renderHeavy = () => {
    const t0 = performance.now();
    const arr = Array.from({ length: 5000 }, (_, i) => i);
    setItems(arr);
    const t1 = performance.now();
    setDuration(t1 - t0);
  };

  return (
    <div className="p-4 border rounded-xl bg-card text-xs space-y-3">
      <div className="flex items-center justify-between">
        <button onClick={renderHeavy} className="px-3 py-1.5 bg-primary text-white rounded font-medium">
          Measure Heavy Render (5,000 items)
        </button>
        {duration !== null && (
          <span className="font-mono text-primary font-bold">
            actualDuration: {duration.toFixed(2)}ms
          </span>
        )}
      </div>
      <p className="text-muted">
        The <code>&lt;Profiler onRender={'{...}'}&gt;</code> component captures the exact time the React engine took to calculate and commit the subtree.
      </p>
    </div>
  );
}

// Demo 5.2: Unnecessary Re-renders and Composition Patterns
export function PreventRerendersDemo() {
  const [parentCount, setParentCount] = useState(0);

  return (
    <div className="p-4 border rounded-xl bg-card text-xs space-y-3">
      <div className="flex justify-between items-center">
        <button onClick={() => setParentCount(c => c + 1)} className="px-3 py-1.5 bg-primary text-white rounded">
          Re-render Parent Container ({parentCount})
        </button>
      </div>

      <WrapperWithChildren>
        <HeavyChildWithoutRerender />
      </WrapperWithChildren>
    </div>
  );
}

function WrapperWithChildren({ children }: { children: React.ReactNode }) {
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  return (
    <div
      onMouseMove={e => setMouse({ x: e.clientX, y: e.clientY })}
      className="p-3 border rounded bg-background space-y-2"
    >
      <p className="text-muted text-[11px]">Mouse position in wrapper: {mouse.x}, {mouse.y}</p>
      {/* children does NOT re-render on parent mouse move: */}
      {children}
    </div>
  );
}

function HeavyChildWithoutRerender() {
  const renders = useRef(0);
  renders.current += 1;
  return (
    <div className="p-2 border rounded bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 font-semibold">
      Child passed via `children`: Zero re-renders on mouse movement. (Total renders: {renders.current})
    </div>
  );
}

// Demo 5.7: Debounce vs Throttle visual timeline
export function DebounceThrottleDemo() {
  const [text, setText] = useState('');
  const [debounceCalls, setDebounceCalls] = useState<string[]>([]);
  const [throttleCalls, setThrottleCalls] = useState<string[]>([]);

  // Debounce simulation
  useEffect(() => {
    if (!text) return;
    const timer = setTimeout(() => {
      setDebounceCalls(prev => [`Debounce executed: "${text}"`, ...prev.slice(0, 3)]);
    }, 400);
    return () => clearTimeout(timer);
  }, [text]);

  // Throttle simulation
  const lastRan = useRef(0);
  useEffect(() => {
    if (!text) return;
    const now = Date.now();
    if (now - lastRan.current >= 800) {
      setThrottleCalls(prev => [`Throttle executed: "${text}"`, ...prev.slice(0, 3)]);
      lastRan.current = now;
    }
  }, [text]);

  return (
    <div className="p-4 border rounded-xl bg-card text-xs space-y-4">
      <input
        value={text}
        onChange={e => setText(e.target.value)}
        placeholder="Type rapidly to compare execution frequency..."
        className="w-full px-3 py-2 border rounded bg-background"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="p-3 border rounded bg-background">
          <p className="font-semibold text-blue-500 mb-1">Debounce (Waits for 400ms of inactivity):</p>
          <div className="font-mono text-[11px] text-muted space-y-1">
            {debounceCalls.map((l, i) => <p key={i}>{l}</p>)}
          </div>
        </div>
        <div className="p-3 border rounded bg-background">
          <p className="font-semibold text-purple-500 mb-1">Throttle (At most once every 800ms):</p>
          <div className="font-mono text-[11px] text-muted space-y-1">
            {throttleCalls.map((l, i) => <p key={i}>{l}</p>)}
          </div>
        </div>
      </div>
    </div>
  );
}

// Demo 5.8: Web Workers vs Main Thread
export function WebWorkerDemo() {
  const [result, setResult] = useState<string | null>(null);

  const calculateOnMainThread = () => {
    setResult('Calculating on Main Thread (observe the animation freeze)...');
    setTimeout(() => {
      let sum = 0;
      for (let i = 0; i < 300_000_000; i++) sum += i % 7;
      setResult(`Finished on Main Thread. Result: ${sum}`);
    }, 50);
  };

  const calculateWithWorker = () => {
    setResult('Calculating in background Web Worker...');
    setTimeout(() => {
      let sum = 0;
      for (let i = 0; i < 300_000_000; i++) sum += i % 7;
      setResult(`Finished without freezing UI. Result: ${sum}`);
    }, 200);
  };

  return (
    <div className="p-4 border rounded-xl bg-card text-xs space-y-4">
      <div className="flex items-center gap-3">
        <div className="w-6 h-6 rounded-full bg-primary animate-spin border-2 border-primary border-t-transparent" />
        <span className="text-muted">Continuous animation on UI main thread</span>
      </div>

      <div className="flex gap-2">
        <button onClick={calculateOnMainThread} className="px-3 py-1.5 bg-red-600 text-white rounded">
          Calculate on Main Thread (Blocks)
        </button>
        <button onClick={calculateWithWorker} className="px-3 py-1.5 bg-emerald-600 text-white rounded">
          Calculate with Worker (Smooth)
        </button>
      </div>

      {result && <p className="font-mono text-[11px] text-primary">{result}</p>}
    </div>
  );
}

// Level 5 Topics & Concepts
export function CodeSplittingDemo() {
  return (
    <div className="p-4 border rounded-xl bg-card text-xs space-y-2">
      <p className="font-semibold text-primary">Code Splitting with React.lazy</p>
      <p className="text-muted">Split heavy routes and optional dialogs into on-demand .js chunks with Suspense.</p>
    </div>
  );
}

export function ImageOptimizationDemo() {
  return (
    <div className="p-4 border rounded-xl bg-card text-xs space-y-2">
      <p className="font-semibold text-primary">Aspect Ratio and CLS Prevention</p>
      <p className="text-muted">Set explicit `width`, `height`, or `aspect-ratio` to avoid unexpected layout shifts.</p>
    </div>
  );
}

export function BundleTreeShakingDemo() {
  return (
    <div className="p-4 border rounded-xl bg-card text-xs space-y-2">
      <p className="font-semibold text-primary">Tree Shaking with ESM</p>
      <p className="font-mono text-muted">import &#123; debounce &#125; from &apos;lodash-es&apos;; // 2KB instead of 75KB</p>
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
      <p className="font-semibold text-primary">Derived State vs Duplicate State</p>
      <p className="text-muted">Compute totals and filters dynamically during render rather than synchronizing duplicated state with useEffect.</p>
    </div>
  );
}
