'use client';

import React, { useState, useEffect, useRef } from 'react';

// Demo 8.1: Fiber Tree with child, sibling, and return pointers
export function FiberTreeVisualizerDemo() {
  const [selectedNode, setSelectedNode] = useState('App');

  const nodes: Record<string, { type: string; child: string | null; sibling: string | null; parent: string | null }> = {
    App: { type: 'RootComponent', child: 'Header', sibling: null, parent: null },
    Header: { type: 'HeaderComponent', child: 'Logo', sibling: 'Main', parent: 'App' },
    Logo: { type: 'HostComponent (<img>)', child: null, sibling: 'Nav', parent: 'Header' },
    Nav: { type: 'HostComponent (<nav>)', child: null, sibling: null, parent: 'Header' },
    Main: { type: 'MainComponent', child: 'Article', sibling: 'Footer', parent: 'App' },
    Article: { type: 'ArticleComponent', child: null, sibling: null, parent: 'Main' },
    Footer: { type: 'FooterComponent', child: null, sibling: null, parent: 'App' }
  };

  const current = nodes[selectedNode];

  return (
    <div className="p-4 border rounded-xl bg-card text-xs space-y-4">
      <div className="flex flex-wrap gap-1.5 items-center">
        <span className="font-semibold text-muted mr-1">Select Fiber node:</span>
        {Object.keys(nodes).map(k => (
          <button
            key={k}
            onClick={() => setSelectedNode(k)}
            className={`px-2.5 py-1 rounded font-mono text-[11px] ${
              selectedNode === k ? 'bg-orange-600 text-white font-bold' : 'border hover:bg-muted'
            }`}
          >
            {k}
          </button>
        ))}
      </div>

      <div className="p-4 border rounded-xl bg-background font-mono space-y-2">
        <div className="flex items-center justify-between border-b pb-2">
          <span className="text-sm font-bold text-orange-500">FiberNode: {selectedNode}</span>
          <span className="text-muted text-[11px]">{current.type}</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px]">
          <p><strong>.child (First Child):</strong> <span className="text-blue-500">{current.child ?? 'null'}</span></p>
          <p><strong>.sibling (Sibling):</strong> <span className="text-emerald-500">{current.sibling ?? 'null'}</span></p>
          <p><strong>.return (Parent):</strong> <span className="text-purple-500">{current.parent ?? 'null'}</span></p>
        </div>
        <p className="text-[10px] text-muted pt-2 border-t">
          This pointer structure replaces call-stack recursion with pausable loops, enabling concurrent rendering.
        </p>
      </div>
    </div>
  );
}

// Demo 8.5: Stale Closure Bug and 3 Live Solutions
export function StaleClosuresDemo() {
  const [count, setCount] = useState(0);
  const [mode, setMode] = useState<'bug' | 'functional' | 'ref'>('bug');
  const [loggedValue, setLoggedValue] = useState(0);

  const countRef = useRef(count);
  countRef.current = count;

  useEffect(() => {
    const id = setInterval(() => {
      if (mode === 'bug') {
        // 💣 Stale Closure: this closure captured the initial render's 'count'
        setLoggedValue(count);
      } else if (mode === 'functional') {
        // ✅ Solution 1: functional state update
        setCount(c => {
          setLoggedValue(c + 1);
          return c + 1;
        });
      } else if (mode === 'ref') {
        // ✅ Solution 2: reading through mutable useRef
        setLoggedValue(countRef.current);
      }
    }, 1000);

    return () => clearInterval(id);
  }, [mode]); // Intentionally omitting [count] to demonstrate the bug in 'bug' mode

  return (
    <div className="p-4 border rounded-xl bg-card text-xs space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          <button
            onClick={() => setCount(c => c + 1)}
            className="px-3 py-1.5 bg-primary text-white rounded font-medium"
          >
            Increment Count ({count})
          </button>
          <button onClick={() => setCount(0)} className="px-3 py-1.5 border rounded">
            Reset
          </button>
        </div>
        <span className="font-mono text-sm">React State: <strong>{count}</strong></span>
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setMode('bug')}
          className={`px-3 py-1 rounded font-medium ${mode === 'bug' ? 'bg-red-600 text-white' : 'border'}`}
        >
          ❌ Stale Closure Mode (Frozen Capture)
        </button>
        <button
          onClick={() => setMode('functional')}
          className={`px-3 py-1 rounded font-medium ${mode === 'functional' ? 'bg-emerald-600 text-white' : 'border'}`}
        >
          ✅ Solution 1: Functional Form (prev =&gt; ...)
        </button>
        <button
          onClick={() => setMode('ref')}
          className={`px-3 py-1 rounded font-medium ${mode === 'ref' ? 'bg-blue-600 text-white' : 'border'}`}
        >
          ✅ Solution 2: Reading via useRef
        </button>
      </div>

      <div className="p-3 border rounded bg-background font-mono">
        <p>Value read by setInterval this second: <strong className={mode === 'bug' ? 'text-red-500' : 'text-emerald-500'}>{loggedValue}</strong></p>
        {mode === 'bug' && (
          <p className="text-[11px] text-red-500 mt-1">
            Notice that even when you click &quot;Increment Count&quot;, the setInterval continues reading {loggedValue} because it is trapped inside the initial render&apos;s closure scope.
          </p>
        )}
      </div>
    </div>
  );
}

// Demo 8.8: useEffect vs useLayoutEffect Flicker Simulator
export function LayoutEffectFlickerDemo() {
  const [boxSize, setBoxSize] = useState(100);
  const [useLayoutEffectMode, setUseLayoutEffectMode] = useState(false);
  const boxRef = useRef<HTMLDivElement>(null);

  // Simulation: resize after measurement
  const triggerResize = () => {
    setBoxSize(prev => (prev === 100 ? 220 : 100));
  };

  return (
    <div className="p-4 border rounded-xl bg-card text-xs space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          <button
            onClick={() => setUseLayoutEffectMode(!useLayoutEffectMode)}
            className={`px-3 py-1.5 rounded font-medium border ${
              useLayoutEffectMode ? 'bg-emerald-500/20 text-emerald-600 border-emerald-500/30' : 'bg-amber-500/20 text-amber-600 border-amber-500/30'
            }`}
          >
            {useLayoutEffectMode ? '✅ useLayoutEffect (Synchronous before paint)' : '⚠️ useEffect (Asynchronous after paint)'}
          </button>
          <button onClick={triggerResize} className="px-3 py-1.5 bg-primary text-white rounded font-medium">
            Toggle Dimension
          </button>
        </div>
        <span className="font-mono text-muted">Current width: {boxSize}px</span>
      </div>

      <div className="h-28 border rounded bg-background flex items-center p-3 overflow-hidden">
        <div
          ref={boxRef}
          style={{ width: `${boxSize}px` }}
          className="h-16 bg-gradient-to-r from-orange-500 to-amber-500 rounded-lg flex items-center justify-center text-white font-bold text-xs transition-all duration-300"
        >
          {boxSize}px
        </div>
      </div>
      <p className="text-muted text-[11px]">
        <code>useLayoutEffect</code> executes synchronously before the browser paints the frame, guaranteeing DOM measurements and coordinate adjustments happen without visual flicker.
      </p>
    </div>
  );
}

// Demo 8.10: Custom Hooks Implemented from Scratch
export function CustomHooksFromScratchDemo() {
  const [count, setCount] = useState(0);
  const previousValue = usePreviousHook(count);

  return (
    <div className="p-4 border rounded-xl bg-card text-xs space-y-3">
      <div className="flex items-center gap-3">
        <button
          onClick={() => setCount(c => c + 1)}
          className="px-3 py-1.5 bg-primary text-white rounded font-medium"
        >
          Increment: {count}
        </button>
      </div>

      <div className="p-3 border rounded bg-background font-mono space-y-1">
        <p>Current Value on Render: <strong className="text-primary">{count}</strong></p>
        <p>Previous Value (usePrevious with useRef): <strong className="text-emerald-500">{previousValue !== undefined ? previousValue : 'undefined (Initial render)'}</strong></p>
      </div>
    </div>
  );
}

// Implementation of usePrevious from scratch
function usePreviousHook<T>(value: T): T | undefined {
  const ref = useRef<T>(undefined);
  useEffect(() => {
    ref.current = value; // Runs AFTER render commit
  }, [value]);
  return ref.current;   // Returns prior value during current render
}

// Level 8 Topics & Internal Mechanics
export function RenderCommitPhasesDemo() {
  return (
    <div className="p-4 border rounded-xl bg-card text-xs space-y-2">
      <p className="font-semibold text-orange-500">React Phase Pipeline</p>
      <div className="font-mono text-[11px] text-muted space-y-1">
        <p>1. Trigger (setState) -&gt; Scheduler enqueues work</p>
        <p>2. Render Phase: in-memory reconciliation (Interruptible &amp; Pure)</p>
        <p>3. Commit Phase: synchronous mutation of the real browser DOM</p>
        <p>4. useLayoutEffect (synchronous before paint)</p>
        <p>5. Browser Paint (visual frame rendered)</p>
        <p>6. useEffect (asynchronous after browser paint)</p>
      </div>
    </div>
  );
}

export function SchedulerLanesDemo() {
  return (
    <div className="p-4 border rounded-xl bg-card text-xs space-y-2">
      <p className="font-semibold text-orange-500">Scheduler Lanes (31-bit Priorities)</p>
      <p className="text-muted">SyncLane (clicks/inputs) &gt; InputContinuousLane &gt; DefaultLane &gt; TransitionLane &gt; IdleLane.</p>
    </div>
  );
}

export function HooksInternalsDemo() {
  return (
    <div className="p-4 border rounded-xl bg-card text-xs space-y-2">
      <p className="font-semibold text-orange-500">Hooks Linked List</p>
      <p className="text-muted">React does not store variable names; it traverses fiber.memoizedState in strict invocation order.</p>
    </div>
  );
}

export function SetStateBatchingAsyncDemo() {
  return (
    <div className="p-4 border rounded-xl bg-card text-xs space-y-2">
      <p className="font-semibold text-orange-500">setState Queuing and Asynchrony</p>
      <p className="text-muted">setState enqueues an Update object into fiber.updateQueue; it never mutates the local closure variable on the same line.</p>
    </div>
  );
}

export function WhyRerenderBailoutDemo() {
  return (
    <div className="p-4 border rounded-xl bg-card text-xs space-y-2">
      <p className="font-semibold text-orange-500">Bailout with Object.is</p>
      <p className="text-muted">If the setter receives the identical identity reference, React executes an Eager Bailout and skips child re-rendering.</p>
    </div>
  );
}

export function HydrationMismatchDemo() {
  return (
    <div className="p-4 border rounded-xl bg-card text-xs space-y-2">
      <p className="font-semibold text-orange-500">Hydration Mismatch Prevention</p>
      <p className="text-muted">Defer client-dependent values (like local time or localStorage) to a useEffect hook running strictly after mount.</p>
    </div>
  );
}
