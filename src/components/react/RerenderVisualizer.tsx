'use client';

import React, { useState } from 'react';
import {
  Layers,
  RotateCcw,
  Sparkles,
  Info,
  CheckCircle2,
  AlertTriangle,
  Play,
  Zap,
  Code2,
  HelpCircle,
  Activity
} from 'lucide-react';

type ExperimentMode =
  | 'naive'
  | 'memo'
  | 'inline-prop'
  | 'use-callback'
  | 'children-slot'
  | 'context-bypass';

interface ComponentNodeState {
  id: string;
  name: string;
  renderCount: number;
  lastAction: 'rendered' | 'bailout' | 'idle';
  isMemoized?: boolean;
  memoBrokenReason?: string;
}

export function RerenderVisualizer() {
  const [mode, setMode] = useState<ExperimentMode>('naive');
  const [renderStep, setRenderStep] = useState(0);

  // Cumulative render counters per component
  const [parentCount, setParentCount] = useState(1);
  const [headerCount, setHeaderCount] = useState(1);
  const [cardCount, setCardCount] = useState(1);
  const [chartCount, setChartCount] = useState(1);
  const [footerCount, setFooterCount] = useState(1);

  // Visual state of latest render pulse
  const [parentAction, setParentAction] = useState<'rendered' | 'bailout' | 'idle'>('idle');
  const [headerAction, setHeaderAction] = useState<'rendered' | 'bailout' | 'idle'>('idle');
  const [cardAction, setCardAction] = useState<'rendered' | 'bailout' | 'idle'>('idle');
  const [chartAction, setChartAction] = useState<'rendered' | 'bailout' | 'idle'>('idle');
  const [footerAction, setFooterAction] = useState<'rendered' | 'bailout' | 'idle'>('idle');

  const [logs, setLogs] = useState<string[]>([
    'Component tree initialized successfully. Initial mount complete for all components.'
  ]);

  const addLog = (msg: string) => {
    setLogs(prev => [msg, ...prev.slice(0, 7)]);
  };

  const handleTriggerParentState = () => {
    setParentCount(p => p + 1);
    setParentAction('rendered');
    setRenderStep(s => s + 1);

    switch (mode) {
      case 'naive':
        // All children re-render because parent state changed
        setHeaderCount(h => h + 1);
        setCardCount(c => c + 1);
        setChartCount(ch => ch + 1);
        setFooterCount(f => f + 1);

        setHeaderAction('rendered');
        setCardAction('rendered');
        setChartAction('rendered');
        setFooterAction('rendered');

        addLog(
          '⚠️ [Naive] setState in <App>: No children are memoized. React walks and re-executes the ENTIRE subtree by default.'
        );
        break;

      case 'memo':
        // Card and Chart are wrapped in React.memo and props are stable primitives
        setHeaderCount(h => h + 1); // Unmemoized Header re-renders
        setFooterCount(f => f + 1); // Unmemoized Footer re-renders

        setHeaderAction('rendered');
        setFooterAction('rendered');
        setCardAction('bailout');
        setChartAction('bailout');

        addLog(
          '✅ [React.memo] <StatsCard> and <HeavyChart> wrapped in React.memo. Object.is(prevProps, nextProps) evaluated to true -> Bailout (0 re-renders).'
        );
        break;

      case 'inline-prop':
        // Card is memoized, but receives onClick={() => handleClick()} inline
        setHeaderCount(h => h + 1);
        setCardCount(c => c + 1); // Memo BROKEN by inline function reference
        setFooterCount(f => f + 1);

        setHeaderAction('rendered');
        setCardAction('rendered');
        setChartAction('bailout');
        setFooterAction('rendered');

        addLog(
          '❌ [Broken Memo] <StatsCard> has React.memo but receives onClick={() => ...}. Fresh function instance in memory breaks Object.is equality!'
        );
        break;

      case 'use-callback':
        // Callback memoized with useCallback preserves reference
        setHeaderCount(h => h + 1);
        setFooterCount(f => f + 1);

        setHeaderAction('rendered');
        setCardAction('bailout');
        setChartAction('bailout');
        setFooterAction('rendered');

        addLog(
          '✅ [useCallback] onClick was stabilized with useCallback. <StatsCard> retains identical reference -> Successful bailout.'
        );
        break;

      case 'children-slot':
        // Children / Inversion of Control pattern: HeavyChart passed as {children}
        setHeaderCount(h => h + 1);
        setCardCount(c => c + 1);
        setFooterCount(f => f + 1);

        setHeaderAction('rendered');
        setCardAction('rendered');
        setChartAction('bailout'); // Children preserves ReactElement instantiated by ancestor
        setFooterAction('rendered');

        addLog(
          '🚀 [Children Pattern] <HeavyChart> passed as {children}. Since it was instantiated outside <App>, its ReactElement identity is preserved -> ZERO re-renders without useMemo!'
        );
        break;

      case 'context-bypass':
        // Context API: Consumer inside HeavyChart updates
        setHeaderAction('rendered');
        setCardAction('bailout');
        setChartAction('rendered'); // Context update bypasses React.memo
        setFooterAction('rendered');

        setHeaderCount(h => h + 1);
        setChartCount(ch => ch + 1);
        setFooterCount(f => f + 1);

        addLog(
          '⚡ [Context Bypass] <HeavyChart> consumes an updated Context. Context changes pierce through React.memo and force consumers to re-render.'
        );
        break;
    }
  };

  const handleReset = () => {
    setParentCount(1);
    setHeaderCount(1);
    setCardCount(1);
    setChartCount(1);
    setFooterCount(1);
    setParentAction('idle');
    setHeaderAction('idle');
    setCardAction('idle');
    setChartAction('idle');
    setFooterAction('idle');
    setRenderStep(0);
    setLogs(['Visualizer reset. Component tree in baseline initial state.']);
  };

  const getActionBadge = (action: 'rendered' | 'bailout' | 'idle') => {
    if (action === 'rendered') {
      return (
        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/20 text-rose-600 dark:text-rose-400 border border-rose-500/30 animate-pulse">
          Re-rendered
        </span>
      );
    }
    if (action === 'bailout') {
      return (
        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
          Bailout (Memo OK)
        </span>
      );
    }
    return (
      <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-muted text-muted">
        Idle
      </span>
    );
  };

  const getNodeBorder = (action: 'rendered' | 'bailout' | 'idle') => {
    if (action === 'rendered') {
      return 'border-rose-500 bg-rose-500/5 ring-2 ring-rose-500/30 shadow-md shadow-rose-500/10 scale-102';
    }
    if (action === 'bailout') {
      return 'border-emerald-500 bg-emerald-500/5 ring-1 ring-emerald-500/30';
    }
    return 'border-border/80 bg-card';
  };

  return (
    <div className="rounded-3xl border border-border/80 bg-card p-6 sm:p-8 space-y-8 shadow-sm">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/60 pb-6">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 text-xs font-bold uppercase tracking-wider">
            <Activity className="w-3.5 h-3.5 animate-pulse" />
            <span>Live Reconciliation Laboratory</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-foreground">
            React Re-rendering Tree Simulator
          </h2>
          <p className="text-xs sm:text-sm text-muted max-w-2xl">
            Watch rendering cascades propagate down the component tree live, learn how to break and fix <code>React.memo</code>, and understand why the <code>children</code> slot pattern is one of the most respected senior design techniques.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-border/80 text-xs font-semibold hover:bg-muted text-muted hover:text-foreground transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
          <button
            onClick={handleTriggerParentState}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs font-bold shadow-md shadow-blue-500/20 hover:opacity-95 transition-all"
          >
            <Zap className="w-4 h-4 fill-current" />
            <span>Trigger setState in &lt;App&gt;</span>
          </button>
        </div>
      </div>

      {/* Scenario Selector */}
      <div className="space-y-3">
        <span className="text-xs font-bold uppercase tracking-wider text-muted font-mono block">
          Select an Optimization Scenario:
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
          <button
            onClick={() => {
              setMode('naive');
              handleReset();
            }}
            className={`p-3.5 rounded-2xl border text-left text-xs transition-all ${
              mode === 'naive'
                ? 'border-blue-500 bg-blue-500/10 text-foreground ring-1 ring-blue-500/30'
                : 'border-border/80 bg-muted/20 hover:bg-muted/40 text-muted'
            }`}
          >
            <span className="font-bold block text-foreground mb-0.5">1. Naive Cascade (Unoptimized)</span>
            <span className="text-[11px] text-muted leading-relaxed">
              Entire tree re-renders because no components are memoized.
            </span>
          </button>

          <button
            onClick={() => {
              setMode('memo');
              handleReset();
            }}
            className={`p-3.5 rounded-2xl border text-left text-xs transition-all ${
              mode === 'memo'
                ? 'border-blue-500 bg-blue-500/10 text-foreground ring-1 ring-blue-500/30'
                : 'border-border/80 bg-muted/20 hover:bg-muted/40 text-muted'
            }`}
          >
            <span className="font-bold block text-foreground mb-0.5">2. Basic React.memo</span>
            <span className="text-[11px] text-muted leading-relaxed">
              Children wrapped in React.memo achieve bailout when receiving primitive props.
            </span>
          </button>

          <button
            onClick={() => {
              setMode('inline-prop');
              handleReset();
            }}
            className={`p-3.5 rounded-2xl border text-left text-xs transition-all ${
              mode === 'inline-prop'
                ? 'border-blue-500 bg-blue-500/10 text-foreground ring-1 ring-blue-500/30'
                : 'border-border/80 bg-muted/20 hover:bg-muted/40 text-muted'
            }`}
          >
            <span className="font-bold block text-foreground mb-0.5">3. Trap: Inline Function Prop</span>
            <span className="text-[11px] text-muted leading-relaxed">
              onClick={'() => ...'} creates fresh function reference and invalidates React.memo.
            </span>
          </button>

          <button
            onClick={() => {
              setMode('use-callback');
              handleReset();
            }}
            className={`p-3.5 rounded-2xl border text-left text-xs transition-all ${
              mode === 'use-callback'
                ? 'border-blue-500 bg-blue-500/10 text-foreground ring-1 ring-blue-500/30'
                : 'border-border/80 bg-muted/20 hover:bg-muted/40 text-muted'
            }`}
          >
            <span className="font-bold block text-foreground mb-0.5">4. Fix with useCallback</span>
            <span className="text-[11px] text-muted leading-relaxed">
              Preserved reference restores bailout in the memoized child.
            </span>
          </button>

          <button
            onClick={() => {
              setMode('children-slot');
              handleReset();
            }}
            className={`p-3.5 rounded-2xl border text-left text-xs transition-all ${
              mode === 'children-slot'
                ? 'border-blue-500 bg-blue-500/10 text-foreground ring-1 ring-blue-500/30'
                : 'border-border/80 bg-muted/20 hover:bg-muted/40 text-muted'
            }`}
          >
            <span className="font-bold block text-foreground mb-0.5">5. Children Pattern (No useMemo)</span>
            <span className="text-[11px] text-muted leading-relaxed">
              Passing heavy trees as {'{children}'} eliminates re-renders for free.
            </span>
          </button>

          <button
            onClick={() => {
              setMode('context-bypass');
              handleReset();
            }}
            className={`p-3.5 rounded-2xl border text-left text-xs transition-all ${
              mode === 'context-bypass'
                ? 'border-blue-500 bg-blue-500/10 text-foreground ring-1 ring-blue-500/30'
                : 'border-border/80 bg-muted/20 hover:bg-muted/40 text-muted'
            }`}
          >
            <span className="font-bold block text-foreground mb-0.5">6. Context API Bypass</span>
            <span className="text-[11px] text-muted leading-relaxed">
              Context updates pierce through React.memo and force consumers to re-render.
            </span>
          </button>
        </div>
      </div>

      {/* Component Tree Visualization */}
      <div className="p-6 rounded-3xl bg-muted/20 border border-border/80 space-y-6">
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold text-foreground flex items-center gap-1.5">
            <Layers className="w-4 h-4 text-primary" />
            <span>Application Component Tree Hierarchy</span>
          </span>
          <span className="font-mono text-muted">
            Render Iteration: #{renderStep}
          </span>
        </div>

        {/* ROOT PARENT NODE: <App (State Container)> */}
        <div className="max-w-md mx-auto">
          <div
            className={`p-4 rounded-2xl border transition-all duration-300 ${getNodeBorder(
              parentAction
            )}`}
          >
            <div className="flex items-center justify-between gap-2">
              <div>
                <span className="font-black text-sm text-foreground flex items-center gap-1.5">
                  &lt;App /&gt; (Root Component)
                </span>
                <span className="text-[11px] text-muted block">
                  Hosts active state <code>const [count, setCount] = useState()</code>
                </span>
              </div>
              <div className="text-right">
                <span className="text-xs font-mono font-bold bg-muted/60 px-2 py-0.5 rounded">
                  {parentCount} renders
                </span>
                <div className="mt-1">{getActionBadge(parentAction)}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Connector Line */}
        <div className="w-0.5 h-6 bg-border mx-auto" />

        {/* DIRECT CHILDREN ROW */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Child 1: <Navbar /> (No memo) */}
          <div
            className={`p-4 rounded-2xl border transition-all duration-300 flex flex-col justify-between space-y-3 ${getNodeBorder(
              headerAction
            )}`}
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-foreground">&lt;Navbar /&gt;</span>
                <span className="text-[10px] font-mono text-muted">{headerCount}x</span>
              </div>
              <p className="text-[11px] text-muted mt-1">No React.memo. Re-renders whenever App re-renders.</p>
            </div>
            <div>{getActionBadge(headerAction)}</div>
          </div>

          {/* Child 2: <StatsCard /> (Memoized or broken by inline callback) */}
          <div
            className={`p-4 rounded-2xl border transition-all duration-300 flex flex-col justify-between space-y-3 ${getNodeBorder(
              cardAction
            )}`}
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-foreground">&lt;StatsCard /&gt;</span>
                <span className="text-[10px] font-mono text-muted">{cardCount}x</span>
              </div>
              <p className="text-[11px] text-muted mt-1">
                {mode === 'inline-prop'
                  ? '⚠️ Receives inline callback. Memo broken.'
                  : mode === 'use-callback' || mode === 'memo'
                  ? '🛡️ Wrapped in React.memo.'
                  : 'Unmemoized.'}
              </p>
            </div>
            <div>{getActionBadge(cardAction)}</div>
          </div>

          {/* Child 3: <HeavyChart /> (Children slot or Context) */}
          <div
            className={`p-4 rounded-2xl border transition-all duration-300 flex flex-col justify-between space-y-3 ${getNodeBorder(
              chartAction
            )}`}
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-foreground">&lt;HeavyChart /&gt;</span>
                <span className="text-[10px] font-mono text-muted">{chartCount}x</span>
              </div>
              <p className="text-[11px] text-muted mt-1">
                {mode === 'children-slot'
                  ? '🚀 Passed as {children}. Zero re-renders!'
                  : mode === 'context-bypass'
                  ? '⚡ Consumes Context. Forced re-render.'
                  : mode === 'memo' || mode === 'use-callback'
                  ? '🛡️ Wrapped in React.memo.'
                  : 'Heavy component without memo.'}
              </p>
            </div>
            <div>{getActionBadge(chartAction)}</div>
          </div>

          {/* Child 4: <Footer /> (No memo) */}
          <div
            className={`p-4 rounded-2xl border transition-all duration-300 flex flex-col justify-between space-y-3 ${getNodeBorder(
              footerAction
            )}`}
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-foreground">&lt;Footer /&gt;</span>
                <span className="text-[10px] font-mono text-muted">{footerCount}x</span>
              </div>
              <p className="text-[11px] text-muted mt-1">No React.memo. Re-renders on parent state change.</p>
            </div>
            <div>{getActionBadge(footerAction)}</div>
          </div>
        </div>
      </div>

      {/* Real-time Fiber Engine Educational Logs */}
      <div className="rounded-2xl bg-slate-950 p-4 border border-slate-800 font-mono text-xs text-slate-200 space-y-2">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2 text-[11px] text-slate-400">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>React Reconciliation Engine Explanation (Fiber)</span>
          </span>
          <span>DOM DIFFING: O(n)</span>
        </div>
        <div className="space-y-1.5 pt-1">
          {logs.map((log, idx) => (
            <div
              key={idx}
              className={`leading-relaxed text-[11px] ${
                idx === 0 ? 'text-cyan-300 font-semibold' : 'text-slate-400 opacity-80'
              }`}
            >
              &gt; {log}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
