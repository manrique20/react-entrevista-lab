'use client';

import React, { useState, useTransition, useId, useSyncExternalStore, useOptimistic, useRef, useMemo } from 'react';
import { Globe } from 'lucide-react';

// Demo 6.2: Automatic Batching
export function AutomaticBatchingDemo() {
  const [count, setCount] = useState(0);
  const [active, setActive] = useState(false);
  const renders = useRef(0);
  renders.current += 1;

  const handleClickTimeout = () => {
    setTimeout(() => {
      // React 18/19 batches both setters into A SINGLE re-render:
      setCount(c => c + 1);
      setActive(a => !a);
    }, 100);
  };

  return (
    <div className="p-4 border rounded-xl bg-card text-xs space-y-3">
      <div className="flex items-center justify-between">
        <button onClick={handleClickTimeout} className="px-3 py-1.5 bg-primary text-white rounded font-medium">
          Invoke 2 setStates inside setTimeout
        </button>
        <span className="font-mono text-primary font-bold">Renders: {renders.current}</span>
      </div>
      <p className="text-muted font-mono">
        Count: {count} | Active: {active ? 'true' : 'false'} (Both variables updated in a single render cycle).
      </p>
    </div>
  );
}

// Demo 6.3: useTransition with Heavy Filtering
export function UseTransitionDemo() {
  const [search, setSearch] = useState('');
  const [filtered, setFiltered] = useState<string[]>([]);
  const [isPending, startTransition] = useTransition();

  const largeDataset = useMemo(() => {
    return Array.from({ length: 5000 }, (_, i) => `Record #${i + 1} - Concurrent Entity`);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const q = e.target.value;
    setSearch(q); // Urgent update: keeps input typing responsive

    startTransition(() => {
      // Non-urgent update: interruptible if user continues typing
      const res = largeDataset.filter((d: string) => d.toLowerCase().includes(q.toLowerCase()));
      setFiltered(res.slice(0, 50));
    });
  };

  return (
    <div className="p-4 border rounded-xl bg-card text-xs space-y-3">
      <div className="flex gap-2 items-center">
        <input
          value={search}
          onChange={handleChange}
          placeholder="Type to filter 5,000 records..."
          className="flex-1 px-3 py-1.5 border rounded bg-background"
        />
        {isPending && <span className="text-cyan-500 font-bold animate-pulse">isPending...</span>}
      </div>

      <div className={`max-h-36 overflow-y-auto border rounded p-2 bg-background font-mono text-[11px] ${isPending ? 'opacity-50' : ''}`}>
        {filtered.length === 0 ? (
          <p className="text-muted">Type a query (e.g. &quot;10&quot; or &quot;Entity&quot;)...</p>
        ) : (
          filtered.map((it, i) => <p key={i}>{it}</p>)
        )}
      </div>
    </div>
  );
}

// Demo 6.4: useId and useSyncExternalStore
export function UseIdAndExternalStoreDemo() {
  const idA = useId();
  const idB = useId();

  const isOnline = useSyncExternalStore(
    cb => {
      window.addEventListener('online', cb);
      window.addEventListener('offline', cb);
      return () => {
        window.removeEventListener('online', cb);
        window.removeEventListener('offline', cb);
      };
    },
    () => navigator.onLine,
    () => true
  );

  return (
    <div className="p-4 border rounded-xl bg-card text-xs space-y-3">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="p-2 border rounded bg-background">
          <label htmlFor={idA} className="font-semibold block mb-1">Generated useId() A:</label>
          <input id={idA} defaultValue={idA} className="w-full px-2 py-1 border rounded font-mono text-[11px]" readOnly />
        </div>
        <div className="p-2 border rounded bg-background">
          <label htmlFor={idB} className="font-semibold block mb-1">Generated useId() B:</label>
          <input id={idB} defaultValue={idB} className="w-full px-2 py-1 border rounded font-mono text-[11px]" readOnly />
        </div>
      </div>
      <p className="flex items-center gap-2 font-medium">
        <Globe className="w-4 h-4 text-primary" /> useSyncExternalStore (Network Status):
        <strong className={isOnline ? 'text-emerald-500' : 'text-red-500'}>{isOnline ? 'Online (Connected)' : 'Offline (Disconnected)'}</strong>
      </p>
    </div>
  );
}

// Demo 6.9: React 19 Hooks (useOptimistic)
export function React19HooksDemo() {
  const [realMessages, setRealMessages] = useState(['Hello', 'Welcome to React 19']);
  const [optimisticMessages, setOptimistic] = useOptimistic(
    realMessages,
    (current, next: string) => [...current, `${next} (sending optimistic...)`]
  );
  const [text, setText] = useState('');
  const [isSending, setIsSending] = useState(false);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    const msg = text.trim();
    setText('');
    setIsSending(true);

    // 1. Instant UI update via useOptimistic:
    setOptimistic(msg);

    // 2. Simulated server roundtrip (1 second latency):
    setTimeout(() => {
      setRealMessages(prev => [...prev, msg]);
      setIsSending(false);
    }, 1000);
  };

  return (
    <div className="p-4 border rounded-xl bg-card text-xs space-y-3">
      <p className="font-semibold text-cyan-600 dark:text-cyan-400">useOptimistic in React 19</p>
      <ul className="space-y-1 font-mono">
        {optimisticMessages.map((m, i) => (
          <li key={i} className="p-1.5 border rounded bg-background">{m}</li>
        ))}
      </ul>
      <form onSubmit={sendMessage} className="flex gap-2">
        <input
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 px-3 py-1.5 border rounded bg-background"
        />
        <button type="submit" disabled={isSending} className="px-3 py-1.5 bg-primary text-white rounded font-medium disabled:opacity-50">
          Send
        </button>
      </form>
    </div>
  );
}

// Demo 6.10: ref as a prop in React 19
export function React19RefPropDemo() {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="p-4 border rounded-xl bg-card text-xs space-y-3">
      <p className="text-muted">
        In React 19, <code>ref</code> can be passed directly as a standard prop without using <code>forwardRef</code>.
      </p>
      <div className="flex gap-2">
        <React19Field ref={inputRef} placeholder="Child input with direct ref prop" />
        <button
          onClick={() => inputRef.current?.focus()}
          className="px-3 py-1.5 bg-primary text-white rounded font-medium"
        >
          Focus via ref prop
        </button>
      </div>
    </div>
  );
}

function React19Field({ ref, ...props }: { ref?: React.Ref<HTMLInputElement> } & React.InputHTMLAttributes<HTMLInputElement>) {
  return <input ref={ref} {...props} className="flex-1 px-3 py-1.5 border rounded bg-background" />;
}

// Level 6 Topics & Concepts
export function ConcurrentRenderingDemo() {
  return (
    <div className="p-4 border rounded-xl bg-card text-xs space-y-2">
      <p className="font-semibold text-cyan-500">Concurrent Rendering</p>
      <p className="text-muted">React 18 interrupts non-urgent work to prioritize critical browser typing and click responses.</p>
    </div>
  );
}

export function SuspenseDataDemo() {
  return (
    <div className="p-4 border rounded-xl bg-card text-xs space-y-2">
      <p className="font-semibold text-cyan-500">Suspense for Data Fetching</p>
      <p className="text-muted">Declaratively coordinates async loading boundaries with native &lt;Suspense fallback&gt; components.</p>
    </div>
  );
}

export function StreamingSsrDemo() {
  return (
    <div className="p-4 border rounded-xl bg-card text-xs space-y-2">
      <p className="font-semibold text-cyan-500">Streaming SSR</p>
      <p className="text-muted">Streams progressive HTML chunks over HTTP/2, reducing Time to First Byte (TTFB) to milliseconds.</p>
    </div>
  );
}

export function RscBoundariesDemo() {
  return (
    <div className="p-4 border rounded-xl bg-card text-xs space-y-2">
      <p className="font-semibold text-cyan-500">RSC Boundaries and &quot;use client&quot;</p>
      <p className="text-muted">Server Components execute exclusively on the server with 0KB JS bundle overhead. Client Components handle interactive events.</p>
    </div>
  );
}

export function ServerActionsDemo() {
  return (
    <div className="p-4 border rounded-xl bg-card text-xs space-y-2">
      <p className="font-semibold text-cyan-500">Server Actions (&apos;use server&apos;)</p>
      <p className="text-muted">Direct server-side mutations from forms with automatic revalidatePath cache invalidation.</p>
    </div>
  );
}

export function ReactCompilerDemo() {
  return (
    <div className="p-4 border rounded-xl bg-card text-xs space-y-2">
      <p className="font-semibold text-cyan-500">React Compiler</p>
      <p className="text-muted">Automatically injects fine-grained memoization at compile time when components adhere to React purity rules.</p>
    </div>
  );
}

export function StrictModeDemo() {
  return (
    <div className="p-4 border rounded-xl bg-card text-xs space-y-2">
      <p className="font-semibold text-cyan-500">Strict Mode (Double Invocation)</p>
      <p className="text-muted">Remounts components in development to uncover memory leaks and unhandled effect cleanups.</p>
    </div>
  );
}
