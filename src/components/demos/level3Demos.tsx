'use client';

import React, { useState, useEffect, useReducer, useCallback, useRef, createContext, useContext } from 'react';
import { createPortal } from 'react-dom';
import { ShieldAlert, CheckCircle2 } from 'lucide-react';

// Demo 3.1: Context API re-render visualizer
const CounterContext = createContext<{ count: number; inc: () => void }>({ count: 0, inc: () => {} });

export function ContextRerenderDemo() {
  const [count, setCount] = useState(0);
  const inc = () => setCount(c => c + 1);

  return (
    <CounterContext.Provider value={{ count, inc }}>
      <div className="p-4 border rounded-xl bg-card space-y-4">
        <div className="flex items-center justify-between border-b pb-3">
          <div>
            <h4 className="font-semibold text-sm">Context Provider</h4>
            <p className="text-xs text-muted">When the Provider updates its value, ALL consumers are re-evaluated.</p>
          </div>
          <button onClick={inc} className="px-3 py-1.5 bg-primary text-white text-xs font-semibold rounded-lg">
            Increment Provider ({count})
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <ConsumerA />
          <ConsumerB />
        </div>
      </div>
    </CounterContext.Provider>
  );
}

function ConsumerA() {
  const { count } = useContext(CounterContext);
  const renders = useRef(0);
  renders.current += 1;
  return (
    <div className="p-3 border rounded-lg bg-background">
      <div className="flex justify-between items-center text-xs">
        <span className="font-semibold">Consumer A (Reads count)</span>
        <span className="text-[10px] font-mono bg-blue-500/10 text-blue-500 px-2 py-0.5 rounded">Renders: {renders.current}</span>
      </div>
      <p className="text-sm font-mono mt-1">Read value: {count}</p>
    </div>
  );
}

function ConsumerB() {
  const { count } = useContext(CounterContext);
  const renders = useRef(0);
  renders.current += 1;
  return (
    <div className="p-3 border rounded-lg bg-background">
      <div className="flex justify-between items-center text-xs">
        <span className="font-semibold">Consumer B (Reads count)</span>
        <span className="text-[10px] font-mono bg-purple-500/10 text-purple-500 px-2 py-0.5 rounded">Renders: {renders.current}</span>
      </div>
      <p className="text-sm font-mono mt-1">Read value: {count}</p>
    </div>
  );
}

// Demo 3.2: useReducer State Machine
type ReducerAction = { type: 'add'; text: string } | { type: 'toggle'; id: number } | { type: 'delete'; id: number };
interface SimpleTodo { id: number; text: string; done: boolean; }

function todosReducer(state: SimpleTodo[], action: ReducerAction): SimpleTodo[] {
  switch (action.type) {
    case 'add':
      return [...state, { id: Date.now(), text: action.text, done: false }];
    case 'toggle':
      return state.map(t => t.id === action.id ? { ...t, done: !t.done } : t);
    case 'delete':
      return state.filter(t => t.id !== action.id);
    default:
      return state;
  }
}

export function UseReducerDemo() {
  const [todos, dispatch] = useReducer(todosReducer, [
    { id: 1, text: 'Learn Fiber architecture', done: true },
    { id: 2, text: 'Master useCallback and memo', done: false }
  ]);
  const [newText, setNewText] = useState('');

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newText.trim()) return;
    dispatch({ type: 'add', text: newText });
    setNewText('');
  };

  return (
    <div className="p-4 border rounded-xl bg-card space-y-4">
      <form onSubmit={handleAdd} className="flex gap-2">
        <input
          value={newText}
          onChange={e => setNewText(e.target.value)}
          placeholder="New task with dispatch({ type: 'add' })..."
          className="flex-1 px-3 py-2 border rounded-lg bg-background text-foreground text-xs"
        />
        <button type="submit" className="px-4 py-2 bg-primary text-white text-xs font-semibold rounded-lg">
          Dispatch Action
        </button>
      </form>

      <ul className="space-y-1.5 font-mono text-xs">
        {todos.map(t => (
          <li key={t.id} className="p-2 border rounded-lg bg-background flex items-center justify-between">
            <span
              onClick={() => dispatch({ type: 'toggle', id: t.id })}
              className={`cursor-pointer ${t.done ? 'line-through text-muted' : 'text-foreground'}`}
            >
              {t.done ? '☑' : '☐'} {t.text}
            </span>
            <button
              onClick={() => dispatch({ type: 'delete', id: t.id })}
              className="text-red-500 hover:text-red-700 text-xs px-2"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

// Demo 3.3: useMemo & useCallback & React.memo
const MemoizedListItem = React.memo(function MemoizedListItem({
  text,
  onDelete
}: {
  text: string;
  onDelete: (t: string) => void;
}) {
  const renders = useRef(0);
  renders.current += 1;
  return (
    <li className="p-2 border rounded bg-background flex items-center justify-between text-xs">
      <span>{text}</span>
      <div className="flex items-center gap-2">
        <span className="text-[10px] font-mono text-muted">Renders: {renders.current}</span>
        <button onClick={() => onDelete(text)} className="text-red-500 hover:underline">x</button>
      </div>
    </li>
  );
});

export function MemoCallbackProfilerDemo() {
  const [parentCount, setParentCount] = useState(0);
  const [items, setItems] = useState(['React 19', 'Next.js 16', 'TypeScript 5']);
  const [useStableCallback, setUseStableCallback] = useState(true);

  // Stable callback with useCallback vs inline recreated function
  const stableCallback = useCallback((it: string) => {
    setItems(prev => prev.filter(x => x !== it));
  }, []);

  const unstableCallback = (it: string) => {
    setItems(prev => prev.filter(x => x !== it));
  };

  const activeHandler = useStableCallback ? stableCallback : unstableCallback;

  return (
    <div className="p-4 border rounded-xl bg-card space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b pb-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setParentCount(c => c + 1)}
            className="px-3 py-1.5 bg-primary text-white text-xs font-semibold rounded-lg"
          >
            Re-render Parent ({parentCount})
          </button>
          <button
            onClick={() => setUseStableCallback(!useStableCallback)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium border ${
              useStableCallback ? 'bg-emerald-500/20 text-emerald-600 border-emerald-500/30' : 'bg-red-500/20 text-red-600 border-red-500/30'
            }`}
          >
            {useStableCallback ? '✅ With stable useCallback' : '❌ With recreated inline function'}
          </button>
        </div>
      </div>

      <p className="text-xs text-muted">
        When clicking &quot;Re-render Parent&quot;: If <strong>useCallback</strong> is enabled, children wrapped in <code>React.memo</code> retain their render count intact. With an inline function, <code>React.memo</code> is invalidated due to a fresh function reference.
      </p>

      <ul className="space-y-2">
        {items.map(it => (
          <MemoizedListItem key={it} text={it} onDelete={activeHandler} />
        ))}
      </ul>
    </div>
  );
}

// Demo 3.6: Reconciliation and State Reset via Key
export function DiffingHeuristicsDemo() {
  const [userId, setUserId] = useState('user-1');

  return (
    <div className="p-4 border rounded-xl bg-card space-y-4">
      <div className="flex gap-2 items-center">
        <span className="text-xs font-semibold">Select User:</span>
        <button
          onClick={() => setUserId('user-1')}
          className={`px-3 py-1 text-xs rounded-md ${userId === 'user-1' ? 'bg-primary text-white' : 'border'}`}
        >
          Ana (user-1)
        </button>
        <button
          onClick={() => setUserId('user-2')}
          className={`px-3 py-1 text-xs rounded-md ${userId === 'user-2' ? 'bg-primary text-white' : 'border'}`}
        >
          Carlos (user-2)
        </button>
      </div>

      <div className="p-3 bg-muted/20 border rounded-xl">
        <p className="text-xs text-muted mb-2">
          Form with <code>key={userId}</code>. When switching users, React unmounts and cleanly resets internal state without writing manual cleanup effects:
        </p>
        <FormWithKey key={userId} userId={userId} />
      </div>
    </div>
  );
}

function FormWithKey({ userId }: { userId: string }) {
  const [note, setNote] = useState('');
  return (
    <div className="space-y-2">
      <p className="text-xs font-semibold text-primary">Editing profile for: {userId}</p>
      <input
        value={note}
        onChange={e => setNote(e.target.value)}
        placeholder={`Type a note for ${userId}...`}
        className="w-full px-3 py-1.5 border rounded bg-background text-xs"
      />
    </div>
  );
}

// Demo 3.7: Fetching with AbortController against Race Conditions
export function DataFetchingRaceDemo() {
  const [resource, setResource] = useState('post-1');
  const [data, setData] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [requestHistory, setRequestHistory] = useState<string[]>([]);

  const loadResource = (newId: string) => {
    setResource(newId);
  };

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    const simulatedDelay = resource === 'post-1' ? 1800 : 300; // post-1 takes much longer than post-2

    setRequestHistory(prev => [
      `[Initiated]: Request to ${resource} (simulated delay: ${simulatedDelay}ms)`,
      ...prev.slice(0, 4)
    ]);

    const timer = setTimeout(() => {
      if (!controller.signal.aborted) {
        setData(`Final response received for: ${resource}`);
        setLoading(false);
        setRequestHistory(prev => [
          `[Completed]: Data for ${resource} rendered successfully.`,
          ...prev.slice(0, 4)
        ]);
      }
    }, simulatedDelay);

    return () => {
      controller.abort();
      clearTimeout(timer);
      setRequestHistory(prev => [
        `[Aborted by AbortController]: Previous request to ${resource} discarded to prevent Race Condition.`,
        ...prev.slice(0, 4)
      ]);
    };
  }, [resource]);

  return (
    <div className="p-4 border rounded-xl bg-card space-y-4">
      <div className="flex gap-2">
        <button
          onClick={() => loadResource('post-1')}
          className="px-3 py-1.5 bg-primary text-white text-xs rounded-lg font-medium"
        >
          Fetch Post 1 (Slow: 1800ms)
        </button>
        <button
          onClick={() => loadResource('post-2')}
          className="px-3 py-1.5 bg-emerald-600 text-white text-xs rounded-lg font-medium"
        >
          Fetch Post 2 (Fast: 300ms)
        </button>
      </div>

      <div className="p-3 border rounded-lg bg-background">
        <p className="text-xs font-semibold">Visible output on screen:</p>
        <p className="text-sm font-mono mt-1 text-primary">
          {loading ? 'Loading network response...' : data}
        </p>
      </div>

      <div className="p-3 bg-muted/20 border rounded-xl text-xs font-mono space-y-1">
        <p className="font-semibold text-muted text-[11px] uppercase">AbortController Monitor:</p>
        {requestHistory.map((h, i) => (
          <p key={i} className="text-muted leading-tight">{h}</p>
        ))}
      </div>
    </div>
  );
}

// Demo 3.9: Interactive Error Boundary
export function ErrorBoundaryDemo() {
  const [hasError, setHasError] = useState(false);

  const reset = () => {
    setHasError(false);
  };

  return (
    <div className="p-4 border rounded-xl bg-card space-y-3">
      <div className="flex justify-between items-center">
        <h4 className="font-semibold text-xs">Error Boundary Simulator</h4>
        <button
          onClick={() => setHasError(true)}
          className="px-3 py-1.5 bg-red-600 text-white text-xs font-semibold rounded-lg hover:bg-red-700"
        >
          Trigger Render Exception
        </button>
      </div>

      {hasError ? (
        <div className="p-4 border border-red-500/40 bg-red-500/10 rounded-xl space-y-2">
          <div className="flex items-center gap-2 text-red-600 dark:text-red-400 font-semibold text-xs">
            <ShieldAlert className="w-4 h-4" /> Error Boundary Fallback Activated
          </div>
          <p className="text-xs text-red-700 dark:text-red-300">
            A child component threw an unhandled render exception. The rest of the application continues functioning without a blank screen crash.
          </p>
          <button onClick={reset} className="px-3 py-1 bg-red-600 text-white text-xs rounded font-medium">
            Reset Boundary
          </button>
        </div>
      ) : (
        <div className="p-4 border rounded-lg bg-emerald-500/5 text-emerald-700 dark:text-emerald-300 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" /> Subtree operating in healthy state.
        </div>
      )}
    </div>
  );
}

// Demo 3.10: Portals (createPortal)
export function PortalModalDemo() {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="p-4 border rounded-xl bg-card space-y-3 overflow-hidden relative">
      <div className="flex items-center justify-between">
        <p className="text-xs text-muted">
          This container has <code>overflow: hidden</code>. A traditional modal would be clipped inside.
        </p>
        <button
          onClick={() => setIsOpen(true)}
          className="px-4 py-2 bg-primary text-white text-xs font-semibold rounded-lg"
        >
          Open Modal with Portal
        </button>
      </div>

      {isOpen && mounted && createPortal(
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in"
          onClick={() => setIsOpen(false)}
        >
          <div
            className="bg-card border border-border p-6 rounded-2xl shadow-2xl max-w-sm w-full space-y-4"
            onClick={e => e.stopPropagation()}
          >
            <h3 className="font-bold text-sm text-foreground">Modal Rendered into document.body</h3>
            <p className="text-xs text-muted">
              Physically this DOM node lives at the end of the document body, breaking out of any parent overflow clipping or CSS transforms.
            </p>
            <div className="flex justify-end">
              <button
                onClick={() => setIsOpen(false)}
                className="px-4 py-1.5 bg-primary text-white text-xs font-semibold rounded-lg"
              >
                Close Modal
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}

// Demo 3.13: Conceptual List Virtualization
export function VirtualizationDemo() {
  const total = 5000;
  const itemHeight = 36;
  const containerHeight = 220;
  const [scrollTop, setScrollTop] = useState(0);

  const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - 2);
  const endIndex = Math.min(total, Math.ceil((scrollTop + containerHeight) / itemHeight) + 2);
  const visibleItems = [];

  for (let i = startIndex; i < endIndex; i++) {
    visibleItems.push(i);
  }

  return (
    <div className="p-4 border rounded-xl bg-card space-y-3">
      <div className="flex items-center justify-between text-xs">
        <span>Total elements in memory: <strong>{total}</strong></span>
        <span className="text-emerald-500 font-mono font-bold">Real DOM nodes: {visibleItems.length}</span>
      </div>

      <div
        style={{ height: containerHeight, overflowY: 'auto', position: 'relative' }}
        onScroll={e => setScrollTop(e.currentTarget.scrollTop)}
        className="border rounded-lg bg-background"
      >
        <div style={{ height: total * itemHeight, position: 'relative' }}>
          {visibleItems.map(index => (
            <div
              key={index}
              style={{
                position: 'absolute',
                top: index * itemHeight,
                height: itemHeight,
                width: '100%'
              }}
              className="px-3 flex items-center border-b border-border/50 text-xs font-mono justify-between"
            >
              <span>Record #{index + 1} - Virtualized User</span>
              <span className="text-[10px] text-muted">Position: {index * itemHeight}px</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Level 3 topic helpers & playground
export function CustomHooksPlaygroundDemo() {
  const [count, setCount] = useState(0);
  return (
    <div className="p-4 border rounded-xl bg-card text-xs space-y-2">
      <p className="font-semibold text-primary">Custom Hooks Playground</p>
      <p className="text-muted">Test custom hooks integrated within the interactive challenge suite.</p>
      <button onClick={() => setCount(c => c + 1)} className="px-3 py-1 bg-muted rounded text-xs">
        Test Counter: {count}
      </button>
    </div>
  );
}

export function RouterSimulatorDemo() {
  const [route, setRoute] = useState('/home');
  return (
    <div className="p-4 border rounded-xl bg-card space-y-3 text-xs">
      <div className="flex gap-2">
        <button onClick={() => setRoute('/home')} className={`px-3 py-1 rounded ${route === '/home' ? 'bg-primary text-white' : 'border'}`}>Home</button>
        <button onClick={() => setRoute('/profile/42')} className={`px-3 py-1 rounded ${route === '/profile/42' ? 'bg-primary text-white' : 'border'}`}>Profile :id</button>
        <button onClick={() => setRoute('/admin')} className={`px-3 py-1 rounded ${route === '/admin' ? 'bg-primary text-white' : 'border'}`}>Protected Route</button>
      </div>
      <div className="p-3 border rounded bg-background font-mono">
        Current route in history: <span className="text-primary font-bold">{route}</span>
      </div>
    </div>
  );
}

export function ForwardRefImperativeDemo() {
  const [message, setMessage] = useState('Ready');
  return (
    <div className="p-4 border rounded-xl bg-card text-xs space-y-3">
      <p>Imperative API exposed to parent component using <code>useImperativeHandle</code>:</p>
      <div className="flex gap-2">
        <button onClick={() => setMessage('Method .focus() executed')} className="px-3 py-1 bg-primary text-white rounded">ref.current.focus()</button>
        <button onClick={() => setMessage('Method .clear() executed')} className="px-3 py-1 bg-muted rounded">ref.current.clear()</button>
      </div>
      <p className="font-mono text-muted">Handler state: {message}</p>
    </div>
  );
}

export function CompositionPatternsDemo() {
  const [openItem, setOpenItem] = useState<string | null>('item-1');
  return (
    <div className="border rounded-xl divide-y text-xs">
      <div className="p-3">
        <button onClick={() => setOpenItem(openItem === 'item-1' ? null : 'item-1')} className="font-semibold w-full text-left flex justify-between">
          Compound Component Item 1 <span>{openItem === 'item-1' ? '▲' : '▼'}</span>
        </button>
        {openItem === 'item-1' && <p className="mt-2 text-muted">Coordinated content via implicit context without prop drilling.</p>}
      </div>
      <div className="p-3">
        <button onClick={() => setOpenItem(openItem === 'item-2' ? null : 'item-2')} className="font-semibold w-full text-left flex justify-between">
          Compound Component Item 2 <span>{openItem === 'item-2' ? '▲' : '▼'}</span>
        </button>
        {openItem === 'item-2' && <p className="mt-2 text-muted">Maximum declarative flexibility for developers consuming the API.</p>}
      </div>
    </div>
  );
}
