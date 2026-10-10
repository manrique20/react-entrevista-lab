'use client';

import React, { useState, useRef } from 'react';
import { Database, Check } from 'lucide-react';

// Demo 4.1: Redux Simulator
export function ReduxSimulatorDemo() {
  const [state, setState] = useState({ users: ['John', 'Lucia'], status: 'idle' });
  const [actionHistory, setActionHistory] = useState<string[]>(['@@INIT']);

  const dispatch = (action: { type: string; payload?: any }) => {
    setActionHistory(prev => [`${action.type} (${JSON.stringify(action.payload ?? {})})`, ...prev]);
    if (action.type === 'users/add') {
      setState(prev => ({ ...prev, users: [...prev.users, action.payload] }));
    } else if (action.type === 'users/clear') {
      setState(prev => ({ ...prev, users: [] }));
    }
  };

  return (
    <div className="p-4 border rounded-xl bg-card space-y-4 text-xs">
      <div className="flex gap-2">
        <button
          onClick={() => dispatch({ type: 'users/add', payload: 'NewDev' })}
          className="px-3 py-1.5 bg-purple-600 text-white rounded font-medium"
        >
          dispatch(add(&apos;NewDev&apos;))
        </button>
        <button
          onClick={() => dispatch({ type: 'users/clear' })}
          className="px-3 py-1.5 bg-muted rounded font-medium"
        >
          dispatch(clear())
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="p-3 border rounded bg-background">
          <p className="font-semibold text-purple-500 mb-1">Global Redux State (Store):</p>
          <pre className="font-mono text-[11px] text-muted">{JSON.stringify(state, null, 2)}</pre>
        </div>
        <div className="p-3 border rounded bg-background">
          <p className="font-semibold text-muted mb-1">Redux DevTools Action History:</p>
          <div className="font-mono text-[11px] space-y-0.5 text-muted max-h-24 overflow-y-auto">
            {actionHistory.map((a, i) => <p key={i}>{a}</p>)}
          </div>
        </div>
      </div>
    </div>
  );
}

// Demo 4.2: Zustand Store granular selectors
export function ZustandStoreDemo() {
  const [countA, setCountA] = useState(0);
  const [countB, setCountB] = useState(0);

  const rendersSelectorA = useRef(0);
  rendersSelectorA.current += 1;

  const rendersSelectorB = useRef(0);
  rendersSelectorB.current += 1;

  return (
    <div className="p-4 border rounded-xl bg-card space-y-4 text-xs">
      <div className="flex gap-2">
        <button onClick={() => setCountA(c => c + 1)} className="px-3 py-1.5 bg-primary text-white rounded">
          Mutate Field A ({countA})
        </button>
        <button onClick={() => setCountB(c => c + 1)} className="px-3 py-1.5 bg-emerald-600 text-white rounded">
          Mutate Field B ({countB})
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="p-3 border rounded bg-background">
          <p className="font-semibold text-primary">Selector A: s =&gt; s.fieldA</p>
          <p className="font-mono text-sm mt-1">Value: {countA}</p>
          <p className="text-[10px] text-muted mt-2">Only re-renders when A mutates. Renders: {rendersSelectorA.current}</p>
        </div>
        <div className="p-3 border rounded bg-background">
          <p className="font-semibold text-emerald-500">Selector B: s =&gt; s.fieldB</p>
          <p className="font-mono text-sm mt-1">Value: {countB}</p>
          <p className="text-[10px] text-muted mt-2">Only re-renders when B mutates. Renders: {rendersSelectorB.current}</p>
        </div>
      </div>
    </div>
  );
}

// Demo 4.3: TanStack Query (Cache and staleTime)
export function TanStackQueryDemo() {
  const [cacheState, setCacheState] = useState<'fresh' | 'stale' | 'fetching'>('fresh');
  const [refetchCount, setRefetchCount] = useState(1);

  const invalidateCache = () => {
    setCacheState('fetching');
    setTimeout(() => {
      setRefetchCount(c => c + 1);
      setCacheState('fresh');
      setTimeout(() => setCacheState('stale'), 3000);
    }, 600);
  };

  return (
    <div className="p-4 border rounded-xl bg-card space-y-3 text-xs">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Database className="w-4 h-4 text-primary" />
          <span className="font-semibold">QueryKey: [&apos;users&apos;]</span>
        </div>
        <span className={`px-2 py-0.5 rounded font-mono uppercase text-[10px] ${
          cacheState === 'fresh' ? 'bg-emerald-500/20 text-emerald-600' :
          cacheState === 'stale' ? 'bg-amber-500/20 text-amber-600' : 'bg-blue-500/20 text-blue-600'
        }`}>
          Status: {cacheState}
        </span>
      </div>

      <p className="text-muted">
        Cached data: <strong>Version #{refetchCount} of users</strong>. (staleTime: 3s).
      </p>

      <button onClick={invalidateCache} className="px-3 py-1.5 bg-primary text-white rounded text-xs font-semibold">
        qc.invalidateQueries({`{ queryKey: ['users'] }`})
      </button>
    </div>
  );
}

// Demo 4.4: React Hook Form + Zod
export function HookFormZodDemo() {
  const [email, setEmail] = useState('');
  const [age, setAge] = useState('25');
  const [zodError, setZodError] = useState<string | null>(null);
  const [isValid, setIsValid] = useState(false);

  const validate = (e: string, ed: string) => {
    if (!e.includes('@') || !e.includes('.')) {
      setZodError('Zod: Invalid email format');
      setIsValid(false);
    } else if (Number(ed) < 18) {
      setZodError('Zod: Must be at least 18 years old');
      setIsValid(false);
    } else {
      setZodError(null);
      setIsValid(true);
    }
  };

  return (
    <div className="p-4 border rounded-xl bg-card space-y-3 text-xs">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="text-muted block mb-1">Email</label>
          <input
            value={email}
            onChange={ev => { setEmail(ev.target.value); validate(ev.target.value, age); }}
            placeholder="user@domain.com"
            className="w-full px-3 py-1.5 border rounded bg-background"
          />
        </div>
        <div>
          <label className="text-muted block mb-1">Age</label>
          <input
            type="number"
            value={age}
            onChange={ev => { setAge(ev.target.value); validate(email, ev.target.value); }}
            className="w-full px-3 py-1.5 border rounded bg-background"
          />
        </div>
      </div>

      {zodError && <p className="text-red-500 text-xs font-medium">{zodError}</p>}
      {isValid && <p className="text-emerald-500 text-xs font-medium flex items-center gap-1"><Check className="w-3.5 h-3.5" /> Zod schema validated successfully.</p>}
    </div>
  );
}

// Demo 4.6: TypeScript Discriminated Unions
export function TypeScriptReactDemo() {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('success');

  return (
    <div className="p-4 border rounded-xl bg-card text-xs space-y-3">
      <div className="flex gap-2">
        <button onClick={() => setStatus('loading')} className="px-2.5 py-1 border rounded">Status: &apos;loading&apos;</button>
        <button onClick={() => setStatus('success')} className="px-2.5 py-1 border rounded">Status: &apos;success&apos;</button>
        <button onClick={() => setStatus('error')} className="px-2.5 py-1 border rounded">Status: &apos;error&apos;</button>
      </div>

      <div className="p-3 border rounded bg-background font-mono">
        {status === 'loading' && <p className="text-blue-500">⏳ Loading typed payload...</p>}
        {status === 'success' && <p className="text-emerald-500">✅ Data: {`{ user: "Andrew", id: "usr_10" }`}</p>}
        {status === 'error' && <p className="text-red-500">❌ Error: &quot;Service unavailable&quot;</p>}
      </div>
    </div>
  );
}

// Level 4 Topics & Helpers
export function UiLibrariesDemo() {
  return (
    <div className="p-4 border rounded-xl bg-card text-xs space-y-2">
      <p className="font-semibold">UI Library Selection Criteria</p>
      <p className="text-muted">Shadcn UI (copying code into your repository using Radix + Tailwind) dominates modern React for accessibility and full RSC compatibility.</p>
    </div>
  );
}

export function TestingStrategyDemo() {
  return (
    <div className="p-4 border rounded-xl bg-card text-xs space-y-2">
      <p className="font-semibold text-emerald-500">Testing Library Query Hierarchy</p>
      <p className="font-mono text-muted">1. getByRole &gt; 2. getByLabelText &gt; 3. getByText &gt; 4. getByTestId</p>
    </div>
  );
}

export function AccessibilityAuditDemo() {
  const [notification, setNotification] = useState('');
  return (
    <div className="p-4 border rounded-xl bg-card text-xs space-y-3">
      <button
        onClick={() => setNotification('New notification received')}
        className="px-3 py-1.5 bg-primary text-white rounded font-medium"
      >
        Trigger aria-live Announcement
      </button>
      <div role="status" aria-live="polite" className="p-3 border rounded bg-background font-medium">
        {notification || 'Region aria-live="polite" listening...'}
      </div>
    </div>
  );
}

export function I18nLocalizationDemo() {
  const [locale, setLocale] = useState<'en-US' | 'es-ES'>('en-US');
  const price = 1250.5;
  const date = new Date();

  return (
    <div className="p-4 border rounded-xl bg-card text-xs space-y-3">
      <div className="flex gap-2">
        <button onClick={() => setLocale('en-US')} className={`px-3 py-1 rounded ${locale === 'en-US' ? 'bg-primary text-white' : 'border'}`}>English (en-US)</button>
        <button onClick={() => setLocale('es-ES')} className={`px-3 py-1 rounded ${locale === 'es-ES' ? 'bg-primary text-white' : 'border'}`}>Spanish (es-ES)</button>
      </div>
      <div className="p-3 border rounded bg-background font-mono space-y-1">
        <p>Intl Currency: <strong>{new Intl.NumberFormat(locale, { style: 'currency', currency: locale === 'en-US' ? 'USD' : 'EUR' }).format(price)}</strong></p>
        <p>Intl Date: <strong>{new Intl.DateTimeFormat(locale, { dateStyle: 'full' }).format(date)}</strong></p>
      </div>
    </div>
  );
}
