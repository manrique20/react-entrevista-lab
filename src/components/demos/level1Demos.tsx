'use client';

import React, { useState } from 'react';
import { ArrowDown, AlertTriangle, CheckCircle2, Play, Cpu, Layers } from 'lucide-react';

// Demo 1.1: Virtual DOM vs Real DOM
export function VirtualDomDemo() {
  const [items, setItems] = useState(['Apple', 'Pear', 'Banana']);
  const [newItem, setNewItem] = useState('');
  const [diffingLog, setDiffingLog] = useState<string[]>([
    'Virtual DOM initialized with 3 nodes in heap memory.',
    'Real DOM synchronized.'
  ]);
  const [domMutations, setDomMutations] = useState(0);

  const addItem = () => {
    if (!newItem.trim()) return;
    const item = newItem.trim();
    setItems(prev => [...prev, item]);
    setNewItem('');
    setDomMutations(prev => prev + 1);
    setDiffingLog(prev => [
      `1. State updated -> New Virtual DOM created with ${items.length + 1} nodes.`,
      `2. Diffing algorithm: 2 in-memory JS trees compared (duration: ~0.02ms).`,
      `3. Reconciler detects: Only 1 new node ('${item}').`,
      `4. Real DOM mutation: Only 1 'document.createElement' executed instead of rebuilding entire list.`,
      ...prev.slice(0, 4)
    ]);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2 items-center">
        <input
          type="text"
          value={newItem}
          onChange={e => setNewItem(e.target.value)}
          placeholder="Type a fruit..."
          className="px-3 py-2 border rounded-lg bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          onKeyDown={e => e.key === 'Enter' && addItem()}
        />
        <button
          onClick={addItem}
          className="px-4 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-1.5"
        >
          <Play className="w-4 h-4" /> Add Item
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 border rounded-xl bg-card">
          <div className="flex items-center justify-between mb-3 border-b pb-2">
            <h4 className="font-semibold text-sm flex items-center gap-2">
              <Layers className="w-4 h-4 text-blue-500" /> Virtual DOM (In-Memory Tree)
            </h4>
            <span className="text-xs bg-blue-500/10 text-blue-600 dark:text-blue-400 font-mono px-2 py-0.5 rounded">
              {items.length} JS nodes
            </span>
          </div>
          <ul className="space-y-1.5 font-mono text-xs">
            {items.map((it, idx) => (
              <li key={idx} className="p-2 rounded bg-muted/40 border border-border/50 flex justify-between">
                <span>FiberNode({it})</span>
                <span className="text-muted text-[10px]">memoizedState: ok</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="p-4 border rounded-xl bg-card">
          <div className="flex items-center justify-between mb-3 border-b pb-2">
            <h4 className="font-semibold text-sm flex items-center gap-2">
              <Cpu className="w-4 h-4 text-emerald-500" /> Real Browser DOM
            </h4>
            <span className="text-xs bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-mono px-2 py-0.5 rounded">
              Real mutations: {domMutations}
            </span>
          </div>
          <div className="space-y-2">
            <div className="flex flex-wrap gap-1.5">
              {items.map((it, idx) => (
                <span key={idx} className="px-2.5 py-1 bg-emerald-500/15 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 rounded text-xs font-medium">
                  {it}
                </span>
              ))}
            </div>
            <div className="mt-4 pt-3 border-t text-xs space-y-1">
              <p className="font-semibold text-muted text-[11px] uppercase tracking-wider">Diffing History:</p>
              {diffingLog.map((log, i) => (
                <p key={i} className="text-muted leading-tight font-mono text-[11px]">{log}</p>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Demo 1.2: JSX Expressions
export function JsxExpressionsDemo() {
  const [count, setCount] = useState(5);
  const [user] = useState('Senior Dev');
  const [showDetails, setShowDetails] = useState(true);

  return (
    <div className="space-y-4">
      <div className="p-4 border rounded-xl bg-card space-y-3">
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => setCount(c => c + 1)}
            className="px-3 py-1.5 bg-primary/10 text-primary border border-primary/20 rounded-lg text-xs font-medium hover:bg-primary/20"
          >
            Increment: {count}
          </button>
          <button
            onClick={() => setShowDetails(d => !d)}
            className="px-3 py-1.5 bg-muted rounded-lg text-xs font-medium hover:bg-muted/80"
          >
            Toggle Details ({showDetails ? 'Visible' : 'Hidden'})
          </button>
        </div>

        <div className="p-3 bg-muted/30 rounded-lg border text-sm space-y-1.5">
          <p><strong>1. Mathematical operation in JSX:</strong> 10 * {count} = <span className="font-mono text-primary font-bold">{10 * count}</span></p>
          <p><strong>2. String transformation in JSX:</strong> {user.toUpperCase()}</p>
          <p><strong>3. Ternary operator in JSX:</strong> {count % 2 === 0 ? 'The number is EVEN' : 'The number is ODD'}</p>
          {showDetails && (
            <div className="p-2 bg-blue-500/10 border border-blue-500/20 text-blue-700 dark:text-blue-300 rounded text-xs mt-2">
              Fragment conditionally rendered via logical expression evaluation.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Demo 1.3: Functional vs Class Components
export function FunctionalVsClassDemo() {
  const [functionalCount, setFunctionalCount] = useState(0);
  const [classCount, setClassCount] = useState(0);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="p-4 border rounded-xl bg-card">
        <div className="flex items-center justify-between mb-2">
          <h4 className="font-semibold text-sm text-emerald-600 dark:text-emerald-400">Functional Component (Modern)</h4>
          <span className="text-xs bg-emerald-500/10 text-emerald-600 px-2 py-0.5 rounded font-mono">React 19 / Hooks</span>
        </div>
        <p className="text-xs text-muted mb-3">Uses `useState`, pure functions, and closures. Zero `this` bindings.</p>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setFunctionalCount(c => c + 1)}
            className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700"
          >
            Increment: {functionalCount}
          </button>
          <button onClick={() => setFunctionalCount(0)} className="text-xs text-muted hover:underline">Reset</button>
        </div>
      </div>

      <div className="p-4 border rounded-xl bg-card">
        <div className="flex items-center justify-between mb-2">
          <h4 className="font-semibold text-sm text-amber-600 dark:text-amber-400">Class Component (Legacy)</h4>
          <span className="text-xs bg-amber-500/10 text-amber-600 px-2 py-0.5 rounded font-mono">this.state / bind</span>
        </div>
        <p className="text-xs text-muted mb-3">Requires extending `React.Component`, `this.state`, and manual binding.</p>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setClassCount(c => c + 1)}
            className="px-4 py-2 bg-amber-600 text-white rounded-lg text-sm font-medium hover:bg-amber-700"
          >
            this.setState(): {classCount}
          </button>
          <button onClick={() => setClassCount(0)} className="text-xs text-muted hover:underline">Reset</button>
        </div>
      </div>
    </div>
  );
}

// Demo 1.5: The Key Prop Trap with Index
export function ListKeysTrapDemo() {
  const [items, setItems] = useState([
    { id: 'item-1', text: 'Buy groceries' },
    { id: 'item-2', text: 'Review PRs' },
    { id: 'item-3', text: 'Exercise' }
  ]);
  const [useIndices, setUseIndices] = useState(true);

  const prependItem = () => {
    const newItem = { id: `item-${Date.now()}`, text: 'New Task ' + (items.length + 1) };
    setItems([newItem, ...items]);
  };

  const deleteFirst = () => {
    setItems(items.slice(1));
  };

  return (
    <div className="space-y-4">
      <div className="p-3 border rounded-xl bg-muted/20 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setUseIndices(!useIndices)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              useIndices ? 'bg-red-500/20 text-red-600 border border-red-500/30' : 'bg-emerald-500/20 text-emerald-600 border border-emerald-500/30'
            }`}
          >
            Mode: {useIndices ? '❌ Using INDEX as key' : '✅ Using stable unique ID'}
          </button>
        </div>
        <div className="flex gap-2">
          <button
            onClick={prependItem}
            className="px-3 py-1.5 bg-primary text-white text-xs rounded-lg font-medium hover:bg-primary/90"
          >
            Insert at beginning
          </button>
          <button
            onClick={deleteFirst}
            disabled={items.length === 0}
            className="px-3 py-1.5 bg-red-600 text-white text-xs rounded-lg font-medium hover:bg-red-700 disabled:opacity-50"
          >
            Delete first
          </button>
        </div>
      </div>

      <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl text-xs text-amber-800 dark:text-amber-200">
        <p className="font-semibold flex items-center gap-1.5">
          <AlertTriangle className="w-4 h-4 text-amber-500" /> Instructions to observe the bug:
        </p>
        <p className="mt-1">
          Type text into the inputs and check a checkbox. Then click <strong>&quot;Insert at beginning&quot;</strong> or <strong>&quot;Delete first&quot;</strong>.
          In <strong>INDEX</strong> mode, you will see the text you typed stays at the wrong position because React associates internal component state with index 0. In <strong>UNIQUE ID</strong> mode, state correctly travels with its item.
        </p>
      </div>

      <div className="space-y-2 border rounded-xl p-4 bg-card">
        {items.map((item, index) => {
          const keyProp = useIndices ? index : item.id;
          return (
            <div key={keyProp} className="flex items-center gap-3 p-2 border rounded-lg bg-background">
              <span className="font-mono text-xs text-muted w-16">
                key: {String(keyProp)}
              </span>
              <input type="checkbox" className="w-4 h-4 rounded text-primary" />
              <span className="font-medium text-xs w-36">{item.text}</span>
              <input
                type="text"
                placeholder="Type something here..."
                defaultValue=""
                className="flex-1 px-2.5 py-1 text-xs border rounded bg-card text-foreground"
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Demo 1.6: Falsy 0 Trap in Conditional Rendering
export function ConditionalRenderingDemo() {
  const [messages, setMessages] = useState<string[]>([]);

  return (
    <div className="space-y-4">
      <div className="flex gap-2 items-center">
        <button
          onClick={() => setMessages(prev => [...prev, `Message #${prev.length + 1}`])}
          className="px-3 py-1.5 bg-primary text-white rounded-lg text-xs font-medium"
        >
          Add message (Total: {messages.length})
        </button>
        <button
          onClick={() => setMessages([])}
          className="px-3 py-1.5 bg-muted rounded-lg text-xs font-medium hover:bg-muted/80"
        >
          Reset list to 0
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 border border-red-500/30 rounded-xl bg-red-500/5">
          <h4 className="font-semibold text-xs text-red-600 dark:text-red-400 mb-2 flex items-center gap-1.5">
            <AlertTriangle className="w-4 h-4" /> The Classic Trap: &#123;count && &lt;UI /&gt;&#125;
          </h4>
          <p className="text-xs text-muted mb-3 font-mono text-[11px]">
            Code: &#123;messages.length && &lt;span&gt;You have messages&lt;/span&gt;&#125;
          </p>
          <div className="p-3 bg-card border rounded-lg min-h-[50px] flex items-center justify-center font-bold text-sm">
            {/* 💣 This expression renders '0' on screen when messages.length is 0 */}
            {messages.length && (
              <span className="text-emerald-500">You have {messages.length} pending messages!</span>
            )}
          </div>
          <p className="text-[11px] text-muted mt-2">
            Notice how when the list is empty, a literal <strong className="text-red-500">0</strong> appears in the container.
          </p>
        </div>

        <div className="p-4 border border-emerald-500/30 rounded-xl bg-emerald-500/5">
          <h4 className="font-semibold text-xs text-emerald-600 dark:text-emerald-400 mb-2 flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4" /> The Correct Way: Boolean Comparison
          </h4>
          <p className="text-xs text-muted mb-3 font-mono text-[11px]">
            Code: &#123;messages.length &gt; 0 && &lt;span&gt;You have messages&lt;/span&gt;&#125;
          </p>
          <div className="p-3 bg-card border rounded-lg min-h-[50px] flex items-center justify-center font-medium text-sm">
            {messages.length > 0 ? (
              <span className="text-emerald-500">You have {messages.length} pending messages!</span>
            ) : (
              <span className="text-muted text-xs">Inbox clear (zero messages).</span>
            )}
          </div>
          <p className="text-[11px] text-muted mt-2">
            Explicit boolean comparison prevents falsy numbers from leaking into the UI.
          </p>
        </div>
      </div>
    </div>
  );
}

// Demo 1.7: Synthetic Events and preventDefault
export function EventsDemo() {
  const [eventLogs, setEventLogs] = useState<string[]>([]);
  const [text, setText] = useState('');

  const addLog = (msg: string) => {
    setEventLogs(prev => [msg, ...prev.slice(0, 5)]);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Prevents page reload
    addLog(`[Prevented Submit]: e.preventDefault() prevented browser page reload. Submitted: "${text}"`);
    setText('');
  };

  return (
    <div className="space-y-3">
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          value={text}
          onChange={e => {
            setText(e.target.value);
            addLog(`[SyntheticEvent onChange]: current value = "${e.target.value}"`);
          }}
          placeholder="Type and press Enter..."
          className="flex-1 px-3 py-2 border rounded-lg bg-card text-foreground text-sm"
        />
        <button type="submit" className="px-4 py-2 bg-primary text-white text-sm font-medium rounded-lg">
          Submit Form
        </button>
      </form>

      <div className="p-3 border rounded-xl bg-muted/20 font-mono text-xs space-y-1">
        <p className="font-semibold text-muted text-[11px] uppercase">SyntheticEvent Log:</p>
        {eventLogs.length === 0 ? (
          <p className="text-muted italic">Interact with the form to log events...</p>
        ) : (
          eventLogs.map((log, i) => <p key={i} className="text-xs text-foreground/80">{log}</p>)
        )}
      </div>
    </div>
  );
}

// Demo 1.9: Unidirectional Data Flow (Props down, events up)
export function DataFlowDemo() {
  const [parentColor, setParentColor] = useState('#3b82f6');
  const [childMessage, setChildMessage] = useState('No message yet');

  return (
    <div className="p-4 border-2 border-dashed border-blue-500/40 rounded-2xl bg-card space-y-4">
      <div className="flex items-center justify-between border-b pb-2">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-blue-500" />
          <h4 className="font-bold text-sm">Parent Component</h4>
        </div>
        <span className="text-xs font-mono bg-blue-500/10 text-blue-500 px-2 py-0.5 rounded">
          State Owner
        </span>
      </div>

      <div className="text-xs space-y-1">
        <p>Selected color in Parent: <span className="font-mono font-bold" style={{ color: parentColor }}>{parentColor}</span></p>
        <p>Last notification received from Child: <strong className="text-foreground">{childMessage}</strong></p>
      </div>

      <div className="flex justify-center my-2">
        <div className="flex items-center gap-1.5 text-xs text-muted font-mono bg-muted/40 px-3 py-1 rounded-full">
          <span>Props flow down (color)</span>
          <ArrowDown className="w-3.5 h-3.5 text-primary animate-bounce" />
          <span>Callbacks flow up (onChange)</span>
        </div>
      </div>

      {/* Child Component */}
      <div className="p-3 border rounded-xl bg-background shadow-inner space-y-2">
        <div className="flex items-center justify-between">
          <h5 className="font-semibold text-xs text-emerald-600 dark:text-emerald-400">Child Component (Presentational)</h5>
          <span className="text-[10px] text-muted">Receives props, triggers callback</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setParentColor('#ef4444');
              setChildMessage('Child clicked Red button');
            }}
            className="px-3 py-1.5 bg-red-500 text-white rounded text-xs font-medium hover:bg-red-600"
          >
            Set Red
          </button>
          <button
            onClick={() => {
              setParentColor('#10b981');
              setChildMessage('Child clicked Green button');
            }}
            className="px-3 py-1.5 bg-emerald-500 text-white rounded text-xs font-medium hover:bg-emerald-600"
          >
            Set Green
          </button>
          <button
            onClick={() => {
              setParentColor('#8b5cf6');
              setChildMessage('Child clicked Violet button');
            }}
            className="px-3 py-1.5 bg-purple-500 text-white rounded text-xs font-medium hover:bg-purple-600"
          >
            Set Violet
          </button>
        </div>
      </div>
    </div>
  );
}

// Demo 1.8: Styling Approaches Comparison in React
export function StylesComparisonDemo() {
  const [strategy, setStrategy] = useState<'tailwind' | 'inline' | 'modules' | 'cssinjs'>('tailwind');
  const [progress, setProgress] = useState(65);
  const [primaryColor, setPrimaryColor] = useState<'blue' | 'emerald' | 'purple' | 'amber'>('blue');

  const colorMap = {
    blue: { bg: 'bg-blue-600', hover: 'hover:bg-blue-700', hex: '#2563eb', border: 'border-blue-500/30', text: 'text-blue-500' },
    emerald: { bg: 'bg-emerald-600', hover: 'hover:bg-emerald-700', hex: '#059669', border: 'border-emerald-500/30', text: 'text-emerald-500' },
    purple: { bg: 'bg-purple-600', hover: 'hover:bg-purple-700', hex: '#7c3aed', border: 'border-purple-500/30', text: 'text-purple-500' },
    amber: { bg: 'bg-amber-600', hover: 'hover:bg-amber-700', hex: '#d97706', border: 'border-amber-500/30', text: 'text-amber-500' }
  };

  const selColor = colorMap[primaryColor];

  return (
    <div className="space-y-6">
      {/* Styling Strategy Selector */}
      <div className="space-y-2">
        <label className="text-xs font-bold text-muted uppercase tracking-wider block">
          Select a Styling Strategy in React:
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          <button
            onClick={() => setStrategy('tailwind')}
            className={`p-2.5 rounded-xl border text-xs font-semibold transition-all text-left ${
              strategy === 'tailwind'
                ? 'border-blue-500 bg-blue-500/15 text-blue-600 dark:text-blue-400 font-bold shadow-xs'
                : 'border-border/80 hover:bg-muted text-foreground'
            }`}
          >
            <div className="text-[11px] font-bold">1. Tailwind CSS</div>
            <div className="text-[10px] text-muted font-normal mt-0.5">Utility-first • Zero runtime</div>
          </button>

          <button
            onClick={() => setStrategy('inline')}
            className={`p-2.5 rounded-xl border text-xs font-semibold transition-all text-left ${
              strategy === 'inline'
                ? 'border-amber-500 bg-amber-500/15 text-amber-600 dark:text-amber-400 font-bold shadow-xs'
                : 'border-border/80 hover:bg-muted text-foreground'
            }`}
          >
            <div className="text-[11px] font-bold">2. Inline Styles</div>
            <div className="text-[10px] text-muted font-normal mt-0.5">style={'{{ ... }}'} • Dynamic values</div>
          </button>

          <button
            onClick={() => setStrategy('modules')}
            className={`p-2.5 rounded-xl border text-xs font-semibold transition-all text-left ${
              strategy === 'modules'
                ? 'border-emerald-500 bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-bold shadow-xs'
                : 'border-border/80 hover:bg-muted text-foreground'
            }`}
          >
            <div className="text-[11px] font-bold">3. CSS Modules</div>
            <div className="text-[10px] text-muted font-normal mt-0.5">Scoped CSS • Hashed names</div>
          </button>

          <button
            onClick={() => setStrategy('cssinjs')}
            className={`p-2.5 rounded-xl border text-xs font-semibold transition-all text-left ${
              strategy === 'cssinjs'
                ? 'border-purple-500 bg-purple-500/15 text-purple-600 dark:text-purple-400 font-bold shadow-xs'
                : 'border-border/80 hover:bg-muted text-foreground'
            }`}
          >
            <div className="text-[11px] font-bold">4. CSS-in-JS (Runtime)</div>
            <div className="text-[10px] text-muted font-normal mt-0.5">styled-components • DOM injection</div>
          </button>
        </div>
      </div>

      {/* Dynamic Controls */}
      <div className="p-4 rounded-2xl border border-border/80 bg-muted/20 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
          <span className="font-bold text-foreground">Dynamic Component Settings:</span>

          <div className="flex items-center gap-3 flex-wrap">
            {/* Color selector */}
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] text-muted font-medium">Color:</span>
              {(['blue', 'emerald', 'purple', 'amber'] as const).map(c => (
                <button
                  key={c}
                  onClick={() => setPrimaryColor(c)}
                  className={`w-5 h-5 rounded-full border-2 transition-transform ${colorMap[c].bg} ${
                    primaryColor === c ? 'scale-125 border-foreground ring-2 ring-primary/30' : 'border-transparent'
                  }`}
                  title={c}
                />
              ))}
            </div>

            {/* Progress Slider */}
            <div className="flex items-center gap-2">
              <span className="text-[11px] text-muted font-medium">Progress ({progress}%):</span>
              <input
                type="range"
                min="10"
                max="100"
                value={progress}
                onChange={e => setProgress(Number(e.target.value))}
                className="w-24 h-1.5 accent-primary cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Rendered Card by active strategy */}
        <div className="p-5 rounded-2xl border border-border/80 bg-card shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-muted">
              Rendered output by strategy:
            </span>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${
              strategy === 'tailwind' || strategy === 'modules'
                ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30'
                : strategy === 'inline'
                ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30'
                : 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/30'
            }`}>
              {strategy === 'tailwind' && '✅ 100% Compatible with React Server Components (RSC)'}
              {strategy === 'modules' && '✅ 100% Compatible with RSC (Zero Runtime)'}
              {strategy === 'inline' && '⚠️ Recommended only for mathematically computed dynamic values'}
              {strategy === 'cssinjs' && '❌ Issues with RSC streaming and JS runtime overhead'}
            </span>
          </div>

          {/* DEMO 1: TAILWIND */}
          {strategy === 'tailwind' && (
            <div className="p-4 rounded-xl border border-border/80 bg-background space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-foreground">Card with Tailwind Utility-First</h4>
                  <p className="text-xs text-muted">Styles generated at compile time by PostCSS / Turbopack engine.</p>
                </div>
                <button className={`px-4 py-2 ${selColor.bg} ${selColor.hover} text-white font-bold text-xs rounded-xl shadow-md transition-all active:scale-95`}>
                  Tailwind Button
                </button>
              </div>

              {/* Progress bar */}
              <div className="space-y-1">
                <div className="flex justify-between text-[11px] text-muted">
                  <span>Cache capacity</span>
                  <span className="font-mono font-bold">{progress}%</span>
                </div>
                <div className="w-full h-2.5 bg-muted/40 rounded-full overflow-hidden p-0.5 border border-border/60">
                  <div
                    className={`h-full ${selColor.bg} rounded-full transition-all duration-300`}
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            </div>
          )}

          {/* DEMO 2: INLINE STYLES */}
          {strategy === 'inline' && (
            <div
              style={{
                padding: '16px',
                borderRadius: '12px',
                border: `1px solid ${selColor.hex}40`,
                backgroundColor: 'var(--background)',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
              }}
              className="space-y-3"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-foreground">Card with style={'{{ ... }}'}</h4>
                  <p className="text-xs text-muted">Values applied directly to DOM element style attributes.</p>
                </div>
                <button
                  style={{
                    backgroundColor: selColor.hex,
                    color: '#ffffff',
                    padding: '8px 16px',
                    borderRadius: '12px',
                    fontWeight: 'bold',
                    fontSize: '12px',
                    border: 'none',
                    cursor: 'pointer'
                  }}
                >
                  Inline Style Button
                </button>
              </div>

              {/* Mathematically computed dynamic bar */}
              <div className="space-y-1">
                <div className="flex justify-between text-[11px] text-muted">
                  <span>Dynamic calculation per frame:</span>
                  <span className="font-mono font-bold">{progress}%</span>
                </div>
                <div style={{ width: '100%', height: '10px', backgroundColor: 'rgba(100,116,139,0.2)', borderRadius: '9999px', overflow: 'hidden' }}>
                  <div
                    style={{
                      width: `${progress}%`,
                      height: '100%',
                      backgroundColor: selColor.hex,
                      transition: 'width 0.3s ease'
                    }}
                  />
                </div>
              </div>
            </div>
          )}

          {/* DEMO 3: CSS MODULES */}
          {strategy === 'modules' && (
            <div className="p-4 rounded-xl border border-emerald-500/30 bg-background space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-foreground">Card simulating CSS Modules</h4>
                  <p className="text-xs text-muted font-mono">
                    className=&quot;Card_container__9fa2c Button_primary__x7b81&quot;
                  </p>
                </div>
                <button className={`px-4 py-2 ${selColor.bg} text-white font-bold text-xs rounded-xl shadow-md`}>
                  styles.primaryButton
                </button>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-[11px] text-muted font-mono">
                  <span>styles.progressBar</span>
                  <span>{progress}%</span>
                </div>
                <div className="w-full h-2.5 bg-muted/40 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${selColor.bg} rounded-full transition-all duration-300`}
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            </div>
          )}

          {/* DEMO 4: CSS-IN-JS (RUNTIME) */}
          {strategy === 'cssinjs' && (
            <div className="p-4 rounded-xl border border-purple-500/30 bg-background space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-foreground">styled-components / Emotion Simulation</h4>
                  <p className="text-xs text-muted font-mono">
                    &lt;Button color=&quot;{selColor.hex}&quot; /&gt; -&gt; Injects &lt;style&gt; into &lt;head&gt;
                  </p>
                </div>
                <button className={`px-4 py-2 ${selColor.bg} text-white font-bold text-xs rounded-xl shadow-md`}>
                  styled.button`...`
                </button>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-[11px] text-muted">
                  <span>Main thread overhead:</span>
                  <span className="font-mono text-purple-600 font-bold">~15ms JS parsing</span>
                </div>
                <div className="w-full h-2.5 bg-muted/40 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${selColor.bg} rounded-full transition-all duration-300`}
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Senior Interview Technical Comparison Table */}
      <div className="p-4 rounded-2xl border border-border/80 bg-card overflow-x-auto text-xs space-y-3">
        <h4 className="font-bold text-foreground">Senior Interview Comparison Table:</h4>
        <table className="w-full text-left border-collapse min-w-[550px]">
          <thead>
            <tr className="border-b border-border text-muted font-mono text-[11px]">
              <th className="py-2 pr-3">Strategy</th>
              <th className="py-2 pr-3">Runtime Overhead</th>
              <th className="py-2 pr-3">RSC Compatibility</th>
              <th className="py-2 pr-3">Pseudo-classes (:hover)</th>
              <th className="py-2">When to Use</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60 text-[11px]">
            <tr className={strategy === 'tailwind' ? 'bg-blue-500/10 font-semibold' : ''}>
              <td className="py-2 pr-3 font-bold text-blue-600 dark:text-blue-400">Tailwind CSS</td>
              <td className="py-2 pr-3 text-emerald-600 font-bold">0 KB (Compile time)</td>
              <td className="py-2 pr-3 text-emerald-600 font-bold">100% Native</td>
              <td className="py-2 pr-3">Yes (hover:, focus:)</td>
              <td className="py-2 text-muted">Modern default in Next.js and React 19.</td>
            </tr>
            <tr className={strategy === 'modules' ? 'bg-emerald-500/10 font-semibold' : ''}>
              <td className="py-2 pr-3 font-bold text-emerald-600 dark:text-emerald-400">CSS Modules</td>
              <td className="py-2 pr-3 text-emerald-600 font-bold">0 KB (Compile time)</td>
              <td className="py-2 pr-3 text-emerald-600 font-bold">100% Native</td>
              <td className="py-2 pr-3">Yes</td>
              <td className="py-2 text-muted">Teams preferring traditional CSS with local component scoping.</td>
            </tr>
            <tr className={strategy === 'inline' ? 'bg-amber-500/10 font-semibold' : ''}>
              <td className="py-2 pr-3 font-bold text-amber-600 dark:text-amber-400">Inline Styles</td>
              <td className="py-2 pr-3 text-amber-600">Object allocation on render</td>
              <td className="py-2 pr-3 text-emerald-600">Compatible</td>
              <td className="py-2 pr-3 text-rose-500">Not supported</td>
              <td className="py-2 text-muted">Only for computed dynamic values (coordinates, %).</td>
            </tr>
            <tr className={strategy === 'cssinjs' ? 'bg-purple-500/10 font-semibold' : ''}>
              <td className="py-2 pr-3 font-bold text-purple-600 dark:text-purple-400">CSS-in-JS (styled)</td>
              <td className="py-2 pr-3 text-rose-500 font-bold">High (~12-25KB bundle + parse)</td>
              <td className="py-2 pr-3 text-rose-500 font-bold">Incompatible with streaming</td>
              <td className="py-2 pr-3">Yes</td>
              <td className="py-2 text-muted">Legacy Client-Side Rendering (CSR) codebases.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
