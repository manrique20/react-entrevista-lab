'use client';

import React, { useState, useEffect, useRef } from 'react';
import { AlertCircle, Check, Timer, Layers } from 'lucide-react';

// Demo 2.1: useState Async Nature and Functional Updates
export function UseStateAsyncDemo() {
  const [count, setCount] = useState(0);
  const [logs, setLogs] = useState<string[]>([]);

  const handleImmediateRead = () => {
    // ❌ Common mistake: setCount(count + 1) three times
    setCount(count + 1);
    setCount(count + 1);
    setCount(count + 1);
    setLogs(prev => [
      `[Immediate Read]: Called setCount(count + 1) 3 consecutive times. In all 3 lines, count evaluated to ${count}. Final result: increments by only +1.`,
      ...prev.slice(0, 3)
    ]);
  };

  const handleFunctionalUpdate = () => {
    // ✅ Safe functional update
    setCount(prev => prev + 1);
    setCount(prev => prev + 1);
    setCount(prev => prev + 1);
    setLogs(prev => [
      `[Functional Update]: Called setCount(prev => prev + 1) 3 times. Each call received the latest pending value. Final result: increments by exactly +3.`,
      ...prev.slice(0, 3)
    ]);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4 p-4 border rounded-xl bg-card">
        <div className="text-center px-4 py-2 bg-primary/10 border border-primary/20 rounded-xl">
          <span className="text-xs text-muted block uppercase">Current Value</span>
          <span className="text-3xl font-extrabold text-primary font-mono">{count}</span>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={handleImmediateRead}
            className="px-3.5 py-2 bg-red-600/90 hover:bg-red-700 text-white text-xs font-semibold rounded-lg transition-colors"
          >
            ❌ setCount(count + 1) x3 (Adds +1)
          </button>
          <button
            onClick={handleFunctionalUpdate}
            className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg transition-colors"
          >
            ✅ setCount(prev =&gt; prev + 1) x3 (Adds +3)
          </button>
          <button
            onClick={() => { setCount(0); setLogs([]); }}
            className="px-3 py-2 border rounded-lg text-xs hover:bg-muted"
          >
            Reset
          </button>
        </div>
      </div>

      <div className="p-3 border rounded-xl bg-muted/20 font-mono text-xs space-y-1">
        <p className="font-semibold text-muted text-[11px] uppercase">Execution Log:</p>
        {logs.length === 0 ? (
          <p className="text-muted italic">Click the buttons to observe the difference in real time.</p>
        ) : (
          logs.map((l, i) => <p key={i} className="text-foreground/90">{l}</p>)
        )}
      </div>
    </div>
  );
}

// Demo 2.2: useEffect Lifecycle and Cleanup
export function UseEffectLifecycleDemo() {
  const [active, setActive] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [cleanupsRun, setCleanupsRun] = useState(0);

  useEffect(() => {
    if (!active) return;

    // Start interval
    const timerId = setInterval(() => {
      setSeconds(s => s + 1);
    }, 1000);

    // Cleanup function
    return () => {
      clearInterval(timerId);
      setCleanupsRun(prev => prev + 1);
    };
  }, [active]);

  return (
    <div className="space-y-4">
      <div className="p-4 border rounded-xl bg-card flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Timer className="w-5 h-5 text-primary" />
          <div>
            <p className="font-semibold text-sm">Effect Status: {active ? 'Active Subscription' : 'Stopped'}</p>
            <p className="text-xs text-muted">Timer: <strong className="font-mono text-primary">{seconds}s</strong></p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActive(!active)}
            className={`px-4 py-2 rounded-lg text-xs font-semibold text-white transition-colors ${
              active ? 'bg-amber-600 hover:bg-amber-700' : 'bg-primary hover:bg-primary/90'
            }`}
          >
            {active ? 'Pause (Runs Cleanup)' : 'Start Subscription'}
          </button>
          <button
            onClick={() => { setActive(false); setSeconds(0); setCleanupsRun(0); }}
            className="px-3 py-2 border rounded-lg text-xs hover:bg-muted"
          >
            Reset
          </button>
        </div>
      </div>

      <div className="p-3 bg-muted/30 border rounded-xl text-xs space-y-1">
        <p><strong>Cleanup functions executed:</strong> <span className="font-mono font-bold text-amber-500">{cleanupsRun}</span></p>
        <p className="text-muted text-[11px]">
          When clicking &quot;Pause&quot; or re-running effects, React invokes the returned cleanup function \`clearInterval(timerId)\` to ensure no orphaned processes leak memory.
        </p>
      </div>
    </div>
  );
}

// Demo 2.3: Controlled vs Uncontrolled Components
export function ControlledVsUncontrolledDemo() {
  const [controlledValue, setControlledValue] = useState('');
  const [controlledRenders, setControlledRenders] = useState(0);

  const uncontrolledInputRef = useRef<HTMLInputElement>(null);
  const [submittedUncontrolledValue, setSubmittedUncontrolledValue] = useState<string | null>(null);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Controlled */}
      <div className="p-4 border border-blue-500/30 rounded-xl bg-blue-500/5 space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="font-semibold text-xs text-blue-600 dark:text-blue-400">1. Controlled Input (React State)</h4>
          <span className="text-[10px] font-mono bg-blue-500/20 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded">
            Rerenders: {controlledRenders}
          </span>
        </div>
        <input
          value={controlledValue}
          onChange={e => {
            setControlledValue(e.target.value);
            setControlledRenders(r => r + 1);
          }}
          placeholder="Type each letter..."
          className="w-full px-3 py-2 border rounded-lg bg-card text-foreground text-xs"
        />
        <div className="text-xs space-y-1">
          <p>Live length: <strong>{controlledValue.length}</strong> characters</p>
          <p className="text-muted text-[11px]">Re-renders the component on every keystroke.</p>
        </div>
      </div>

      {/* Uncontrolled */}
      <div className="p-4 border border-purple-500/30 rounded-xl bg-purple-500/5 space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="font-semibold text-xs text-purple-600 dark:text-purple-400">2. Uncontrolled Input (DOM Ref)</h4>
          <span className="text-[10px] font-mono bg-purple-500/20 text-purple-700 dark:text-purple-300 px-2 py-0.5 rounded">
            Zero re-renders on keystroke
          </span>
        </div>
        <div className="flex gap-2">
          <input
            ref={uncontrolledInputRef}
            defaultValue=""
            placeholder="DOM holds the input value..."
            className="flex-1 px-3 py-2 border rounded-lg bg-card text-foreground text-xs"
          />
          <button
            onClick={() => setSubmittedUncontrolledValue(uncontrolledInputRef.current?.value ?? '')}
            className="px-3 py-1.5 bg-purple-600 text-white rounded-lg text-xs font-medium hover:bg-purple-700"
          >
            Read Ref
          </button>
        </div>
        <div className="text-xs space-y-1">
          <p>Value read on demand: <strong>{submittedUncontrolledValue ?? '(Click Read Ref)'}</strong></p>
          <p className="text-muted text-[11px]">React does not participate while the user types.</p>
        </div>
      </div>
    </div>
  );
}

// Demo 2.4: Form Handling and Validation
export function FormValidationDemo() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    // Live validation
    if (name === 'email') {
      setErrors(errs => ({
        ...errs,
        email: !value.includes('@') ? 'Email must contain @' : undefined
      }));
    }
    if (name === 'password') {
      setErrors(errs => ({
        ...errs,
        password: value.length < 6 ? 'Minimum 6 characters' : undefined
      }));
    }
    setIsSubmitted(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.email.includes('@') || form.password.length < 6) {
      setErrors({
        email: !form.email.includes('@') ? 'Invalid email format' : undefined,
        password: form.password.length < 6 ? 'Password is too short' : undefined
      });
      return;
    }
    setErrors({});
    setIsSubmitted(true);
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 border rounded-xl bg-card space-y-3">
      <div>
        <label className="text-xs font-medium text-muted block mb-1">Email Address</label>
        <input
          name="email"
          value={form.email}
          onChange={handleChange}
          placeholder="user@example.com"
          className={`w-full px-3 py-2 border rounded-lg bg-background text-foreground text-xs ${
            errors.email ? 'border-red-500 focus:ring-red-500' : ''
          }`}
        />
        {errors.email && <p className="text-red-500 text-[11px] mt-1">{errors.email}</p>}
      </div>

      <div>
        <label className="text-xs font-medium text-muted block mb-1">Password</label>
        <input
          type="password"
          name="password"
          value={form.password}
          onChange={handleChange}
          placeholder="Minimum 6 characters"
          className={`w-full px-3 py-2 border rounded-lg bg-background text-foreground text-xs ${
            errors.password ? 'border-red-500 focus:ring-red-500' : ''
          }`}
        />
        {errors.password && <p className="text-red-500 text-[11px] mt-1">{errors.password}</p>}
      </div>

      <button type="submit" className="w-full py-2 bg-primary text-white text-xs font-semibold rounded-lg hover:bg-primary/90">
        Validate & Submit
      </button>

      {isSubmitted && (
        <div className="p-2.5 bg-emerald-500/15 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 rounded-lg text-xs font-medium flex items-center gap-2">
          <Check className="w-4 h-4" /> Form successfully validated and submitted.
        </div>
      )}
    </form>
  );
}

// Demo 2.5: Lifting State Up (Celsius and Fahrenheit)
export function LiftingStateDemo() {
  const [celsius, setCelsius] = useState(25);

  const fahrenheit = (celsius * 9) / 5 + 32;

  const handleFahrenheitChange = (f: number) => {
    setCelsius(((f - 32) * 5) / 9);
  };

  return (
    <div className="p-4 border rounded-xl bg-card space-y-4">
      <div className="text-xs text-muted">
        The parent component holds the single source of truth \`celsius\`. The value \`fahrenheit\` is a mathematically derived state, ensuring both inputs remain in perfect synchrony.
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="p-3 border rounded-lg bg-background">
          <label className="text-xs font-semibold block mb-1">Temperature in Celsius (°C)</label>
          <input
            type="number"
            value={Math.round(celsius * 10) / 10}
            onChange={e => setCelsius(Number(e.target.value))}
            className="w-full px-3 py-2 border rounded bg-card text-foreground font-mono text-sm"
          />
        </div>
        <div className="p-3 border rounded-lg bg-background">
          <label className="text-xs font-semibold block mb-1">Temperature in Fahrenheit (°F)</label>
          <input
            type="number"
            value={Math.round(fahrenheit * 10) / 10}
            onChange={e => handleFahrenheitChange(Number(e.target.value))}
            className="w-full px-3 py-2 border rounded bg-card text-foreground font-mono text-sm"
          />
        </div>
      </div>
    </div>
  );
}

// Demo 2.6: Composition vs Inheritance
export function CompositionVsInheritanceDemo() {
  const [variant, setVariant] = useState<'info' | 'alert'>('info');

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <button
          onClick={() => setVariant('info')}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium ${variant === 'info' ? 'bg-primary text-white' : 'border'}`}
        >
          Info Variant
        </button>
        <button
          onClick={() => setVariant('alert')}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium ${variant === 'alert' ? 'bg-amber-600 text-white' : 'border'}`}
        >
          Alert Variant
        </button>
      </div>

      {/* Composed container with slots */}
      <div className={`p-4 border rounded-xl ${variant === 'info' ? 'bg-blue-500/5 border-blue-500/30' : 'bg-amber-500/5 border-amber-500/30'}`}>
        <div className="flex items-center justify-between pb-2 border-b border-border/50">
          <h4 className="font-semibold text-sm">
            {variant === 'info' ? 'ℹ️ Information Card' : '⚠️ Important Alert'}
          </h4>
          <span className="text-[10px] bg-muted px-2 py-0.5 rounded font-mono">Header Slot</span>
        </div>
        <div className="py-3 text-xs text-muted">
          This content is dynamically injected as <code>children</code> without needing rigid base class inheritance.
        </div>
        <div className="pt-2 border-t border-border/50 flex justify-end">
          <button className="px-3 py-1 text-xs font-medium bg-foreground text-background rounded-md">
            Footer Slot Action
          </button>
        </div>
      </div>
    </div>
  );
}

// Demo 2.7: useRef DOM Access and Render Counter
export function UseRefDomAndStateDemo() {
  const inputRef = useRef<HTMLInputElement>(null);
  const renderCount = useRef(0);
  const [, setForceRender] = useState(0);

  // Increment ref on every render cycle
  renderCount.current += 1;

  const focusAndSelect = () => {
    inputRef.current?.focus();
    inputRef.current?.select();
  };

  return (
    <div className="p-4 border rounded-xl bg-card space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-xs text-muted">
          Accumulated renders in this component: <strong className="font-mono text-primary">{renderCount.current}</strong>
        </p>
        <button
          onClick={() => setForceRender(f => f + 1)}
          className="px-3 py-1 bg-muted hover:bg-muted/80 text-xs font-medium rounded-lg flex items-center gap-1"
        >
          Force Re-render
        </button>
      </div>

      <div className="flex gap-2">
        <input
          ref={inputRef}
          defaultValue="Focused text via imperative useRef"
          className="flex-1 px-3 py-2 border rounded-lg bg-background text-foreground text-xs font-mono"
        />
        <button
          onClick={focusAndSelect}
          className="px-4 py-2 bg-primary text-white text-xs font-semibold rounded-lg hover:bg-primary/90"
        >
          Set Focus with Ref
        </button>
      </div>
      <p className="text-[11px] text-muted">
        Note: Mutating <code>renderCount.current += 1</code> persists values across renders without triggering infinite re-render loops.
      </p>
    </div>
  );
}

// Demo 2.8: Rules of Hooks and Internal Linked List
export function HooksRulesAndLinkedListDemo() {
  const [step, setStep] = useState(0);

  const linkedHooks = [
    { index: 0, type: 'useState(count)', value: '0', next: 'Hook 1' },
    { index: 1, type: 'useEffect(timer)', value: 'fn cleanup', next: 'Hook 2' },
    { index: 2, type: 'useRef(inputRef)', value: '{ current: HTMLInputElement }', next: 'null (End)' }
  ];

  return (
    <div className="p-4 border rounded-xl bg-card space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="font-semibold text-xs flex items-center gap-1.5">
          <Layers className="w-4 h-4 text-primary" /> Hook Linked List Visualizer (Fiber.memoizedState)
        </h4>
        <button
          onClick={() => setStep(p => (p + 1) % 3)}
          className="px-3 py-1 bg-primary text-white text-xs rounded-md"
        >
          Advance Cursor ({step})
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {linkedHooks.map((h, i) => (
          <div
            key={i}
            className={`p-3 border rounded-xl transition-all ${
              step === i ? 'border-primary ring-2 ring-primary/20 bg-primary/5' : 'bg-background'
            }`}
          >
            <div className="flex items-center justify-between text-xs font-mono mb-1">
              <span className="font-bold text-primary">Slot #{h.index}</span>
              {step === i && <span className="bg-primary text-white text-[10px] px-1.5 py-0.2 rounded">Active cursor</span>}
            </div>
            <p className="text-xs font-semibold">{h.type}</p>
            <p className="text-[11px] text-muted font-mono mt-1">Value: {h.value}</p>
            <p className="text-[10px] text-muted mt-2 border-t pt-1">Next: {h.next}</p>
          </div>
        ))}
      </div>

      <div className="p-2.5 bg-amber-500/10 border border-amber-500/20 rounded-lg text-xs text-amber-800 dark:text-amber-200">
        If a hook were wrapped inside an <code>if (condition)</code>, any render where the condition evaluates to false would omit the slot, causing the cursor to read subsequent hook state and corrupting the entire component.
      </div>
    </div>
  );
}
