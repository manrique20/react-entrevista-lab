import { Topic } from '@/types';

export const LEVEL_5_TOPICS: Topic[] = [
  {
    id: '5.1',
    level: 5,
    levelTitle: 'Performance',
    title: '5.1 React DevTools Profiler & the `<Profiler>` Component',
    summary: 'Measure before optimizing. Record render sessions, analyze CPU execution times, and uncover why each node rendered.',
    whatIsIt: `Optimizing without measuring is the single biggest mistake in frontend engineering. The primary diagnostic tool is the **React DevTools Profiler**:
- Record an interaction (e.g., typing in an input or clicking a filter) to generate a Flamegraph or Ranked chart.
- Enabling **"Record why each component rendered"** allows React to explain precisely why a component rendered:
  1. Hook changes (state).
  2. Prop changes (showing the exact name of the prop that changed).
  3. Parent component re-rendered.

React also provides the built-in component **\`<Profiler id="..." onRender={callback}>\`** to capture runtime metrics in production or performance testing:
- \`actualDuration\`: Time spent rendering the component and its descendants.
- \`baseDuration\`: Estimated time to render the entire subtree without any memoization optimizations.`,
    codeSnippet: `import { Profiler, ProfilerOnRenderCallback } from 'react';

function MetricsDashboard() {
  const handleRender: ProfilerOnRenderCallback = (id, phase, actualDuration, baseDuration) => {
    console.log(\`[Profiler:\${id}] Phase: \${phase} | Actual duration: \${actualDuration.toFixed(2)}ms | Base: \${baseDuration.toFixed(2)}ms\`);
  };

  return (
    <Profiler id="ReportsList" onRender={handleRender}>
      <ComplexList />
    </Profiler>
  );
}`,
    interviewTips: [
      'Fundamental rule: "Premature optimization is the root of all evil". In a senior interview, always emphasize that before touching a line of code or adding `useMemo`, you measure with the Profiler to pinpoint the actual bottleneck.',
      'Explain `actualDuration` vs. `baseDuration`: if `actualDuration` is significantly lower than `baseDuration`, your memoization optimizations are working effectively.'
    ],
    commonTraps: [
      'Running the profiler in development mode and assuming those times reflect production (development mode includes extra StrictMode checks and warnings that roughly double execution time).',
      'Optimizing components whose render takes 0.05ms while ignoring blocking 200ms renders or unoptimized network requests.'
    ],
    keyTakeaway: 'Always measure with the Profiler before optimizing. Identify the exact render trigger in DevTools.',
    componentKey: 'ProfilerDemo',
    tags: ['profiler', 'devtools', 'flamegraph', 'actualDuration', 'performance-measurement']
  },
  {
    id: '5.2',
    level: 5,
    levelTitle: 'Performance',
    title: '5.2 Unnecessary Re-renders & the 3 Techniques to Prevent Them',
    summary: 'The 3 battle-tested techniques to isolate renders: 1) State colocation, 2) Lifting content with children, 3) React.memo.',
    whatIsIt: `An unnecessary re-render occurs when a component re-executes its render function without any visual change in the user interface.

**The 3 proven techniques to eliminate them (ordered by elegance)**:
1. **Push State Down (State Colocation)**:
Move state to the lowest possible component in the tree that requires it. If an input only updates its own text, its state does not belong at the page root.
2. **Pass Content as \`children\` (or Slots)**:
If a container component has frequently changing state (e.g., scroll position or mouse coordinates), pass heavy child content as \`children\`. Because the parent component already created those \`children\`, their reference does not change, and React skips re-rendering them.
3. **\`React.memo\` + Stable References**:
Wrap expensive components in \`React.memo\` and ensure all passed props (objects, arrays, and functions) maintain stable referential identity via \`useMemo\` and \`useCallback\`.`,
    codeSnippet: `// Technique 2: Passing children to bypass renders (Clean composition!)
function MouseTrackerWrapper({ children }: { children: React.ReactNode }) {
  const [pos, setPos] = useState({ x: 0, y: 0 });

  return (
    <div onMouseMove={e => setPos({ x: e.clientX, y: e.clientY })}>
      <p>Coordinates: {pos.x}, {pos.y}</p>
      {/* children does NOT re-render when pos changes because it was instantiated outside */}
      {children}
    </div>
  );
}

// Usage: ExpensiveComponentTree suffers zero re-renders on mouse move
<MouseTrackerWrapper>
  <ExpensiveComponentTree />
</MouseTrackerWrapper>`,
    interviewTips: [
      'The `children` composition technique consistently impresses technical interviewers because it requires neither `React.memo`, `useMemo`, nor `useCallback`—solving the problem purely through component composition.',
      'Explain why unnecessary re-renders are not always a problem: lightweight components (e.g., icons or simple buttons) render in microseconds, easily maintaining 60 FPS without optimization.'
    ],
    commonTraps: [
      'Passing inline objects/arrays to memoized components: `<MemoizedChild style={{ color: "red" }} />`. The `{}` object literal is brand new on every render, completely defeating `React.memo`.',
      'Blindly wrapping every component in `React.memo` without verifying whether its props have stable references.'
    ],
    keyTakeaway: 'Push state down and use composition with `children` before cluttering code with manual memoization.',
    componentKey: 'PreventRerendersDemo',
    tags: ['re-renders', 'state-colocation', 'children-as-props', 'React.memo', 'optimization']
  },
  {
    id: '5.3',
    level: 5,
    levelTitle: 'Performance',
    title: '5.3 Code Splitting: `React.lazy` and `<Suspense>`',
    summary: 'Split JavaScript bundles into on-demand downloaded chunks to drastically reduce initial page load time.',
    whatIsIt: `By default, bundlers pack your application's entire codebase into a single monolithic JavaScript bundle. A user visiting only the home page still downloads admin dashboards, heavy chart libraries, and rich text editors they might never use.

**Code Splitting**:
Splits application code into multiple chunks loaded over the network on demand, only when about to render.
- \`React.lazy(() => import('./HeavyModule'))\`: Asynchronous dynamic import (requires a default export).
- \`<Suspense fallback={<Loader />}>\`: Declarative boundary rendering fallback UI while the chunk downloads over the network.
- Next.js: Routes are automatically code-split by page; specific client components use \`next/dynamic\`.`,
    codeSnippet: `import { lazy, Suspense, useState } from 'react';

// The code for HeavyChart is excluded from the initial bundle
const HeavyChart = lazy(() => import('./HeavyChart'));

function ReportsPage() {
  const [showChart, setShowChart] = useState(false);

  return (
    <div className="p-6">
      <button onClick={() => setShowChart(true)}>Load Detailed Chart</button>

      {showChart && (
        <Suspense fallback={<div className="h-64 animate-pulse bg-muted rounded-xl" />}>
          <HeavyChart />
        </Suspense>
      )}
    </div>
  );
}`,
    interviewTips: [
      'In Next.js: explain `next/dynamic` with `{ ssr: false }`. This is the standard solution for loading heavy browser-dependent libraries (e.g., ApexCharts, Leaflet, Canvas libraries) without breaking server-side rendering.',
      'Highlight browser prefetching: Next.js detects `<Link>` components in the viewport and prefetches route chunks in the background during network idle time.'
    ],
    commonTraps: [
      'Calling `React.lazy()` inside the component body instead of at module top-level (recreates the dynamic import promise on every single render).',
      'Failing to provide a fallback with adequate dimensions in `<Suspense>`, causing jarring layout shifts (CLS) when the chunk finishes loading.'
    ],
    keyTakeaway: 'React.lazy + Suspense splits bundles and fetches heavy modules only when needed by the user.',
    componentKey: 'CodeSplittingDemo',
    tags: ['code-splitting', 'React.lazy', 'Suspense', 'next-dynamic', 'bundle-size']
  },
  {
    id: '5.4',
    level: 5,
    levelTitle: 'Performance',
    title: '5.4 Image Optimization & Lazy Loading',
    summary: 'Prevent layout shifts (CLS), leverage modern formats (WebP/AVIF), srcset attributes, and Next.js `<Image>` component.',
    whatIsIt: `Images typically account for over 60% of modern web page weight and are the primary culprit behind poor LCP and CLS scores.

Optimization strategies:
1. **Native \`loading="lazy"\` Attribute**: Tells the browser to defer downloading the image until it approaches the viewport.
2. **Explicit Dimensions (\`width\` and \`height\` or CSS \`aspect-ratio\`)**: Reserves layout space before the image finishes downloading, completely eliminating **Cumulative Layout Shift (CLS)**.
3. **Modern Formats**: Serve WebP or AVIF (up to 50% lighter than JPEG/PNG at equivalent visual quality).
4. **Next.js \`<Image />\` Component**:
- Automatic server-side image optimization tailored to device width.
- Native CLS prevention through reserved aspect ratios.
- Blurred placeholders (\`blurDataURL\`) during loading.`,
    codeSnippet: `// 1. Native approach reserving aspect ratio against CLS:
<img
  src="/hero.jpg"
  alt="Dashboard"
  loading="lazy"
  width={800}
  height={450}
  className="w-full h-auto aspect-video rounded-xl object-cover"
/>

// 2. In Next.js with automatic optimization:
// import Image from 'next/image';
// <Image src="/hero.jpg" alt="Dashboard" width={800} height={450} priority={false} placeholder="blur" blurDataURL="..." />`,
    interviewTips: [
      'Mention the `priority` prop in Next.js `<Image />`: the primary above-the-fold image that determines Largest Contentful Paint (LCP) must NEVER be lazy loaded. Marking it with `priority` preloads it via `<head>` with the highest network priority.',
      'Explain how layout shifts harm technical SEO and user experience (e.g., a user attempting to tap a button that shifts abruptly when an image finishes loading).'
    ],
    commonTraps: [
      'Adding `loading="lazy"` to the primary above-the-fold hero image, artificially delaying LCP.',
      'Omitting size attributes or CSS aspect ratios, pushing CLS past the 0.1 threshold.'
    ],
    keyTakeaway: 'Reserve fixed dimensions to avoid CLS and optimize formats using AVIF/WebP or Next.js `<Image />`.',
    componentKey: 'ImageOptimizationDemo',
    tags: ['images', 'lazy-loading', 'CLS', 'LCP', 'next-image', 'web-vitals']
  },
  {
    id: '5.5',
    level: 5,
    levelTitle: 'Performance',
    title: '5.5 Bundle Size & Tree Shaking',
    summary: 'Eliminate dead code at build time. Named imports vs monolithic libraries (Lodash, Moment vs date-fns/Intl).',
    whatIsIt: `**Tree Shaking** is an optimization process performed by modern bundlers (Webpack, Rollup, Turbopack, esbuild) to eliminate dead code that is exported by packages but never actually imported or used by your application.

Prerequisites for effective Tree Shaking:
- Use **ES Modules (ESM)** with standard syntax (\`import\` and \`export\`), rather than CommonJS (\`require\` / \`module.exports\`).
- Packages marked with \`"sideEffects": false\` in their \`package.json\`.
- Avoid full-library imports for large monolithic packages:
  - ❌ \`import _ from 'lodash';\` (adds ~75KB uncompressed).
  - ✅ \`import debounce from 'lodash-es/debounce';\` (adds only ~2KB).
  - ✅ Better yet: replace \`moment.js\` with the native \`Intl\` API or modular libraries like \`date-fns\` or \`dayjs\`.`,
    codeSnippet: `// ❌ Bad practice: Pulls in the entire library without Tree Shaking
// import _ from 'lodash';
// const res = _.capitalize('react');

// ✅ Good practice: Modular ESM import
import capitalize from 'lodash-es/capitalize';
const res = capitalize('react');

// Bundle diagnostic tools:
// - @next/bundle-analyzer
// - source-map-explorer`,
    interviewTips: [
      'Explain `sideEffects: false`: it informs the bundler that files in the package have no global mutations or top-level side effects when imported, allowing unused exports to be safely eliminated.',
      'Mention `@next/bundle-analyzer`: generates an interactive treemap visualizing the exact bundle footprint of every npm dependency in your client bundles.'
    ],
    commonTraps: [
      'Importing icons with `import * as Icons from "lucide-react"`, which can bundle hundreds of SVGs into the client bundle.',
      'Importing heavy Node.js-oriented or CommonJS packages in client components.'
    ],
    keyTakeaway: 'Always use ESM, granular subpath imports, and modern lightweight libraries so bundlers can prune dead code.',
    componentKey: 'BundleTreeShakingDemo',
    tags: ['tree-shaking', 'bundle-size', 'esm', 'bundle-analyzer', 'dead-code']
  },
  {
    id: '5.6',
    level: 5,
    levelTitle: 'Performance',
    title: '5.6 Core Web Vitals (LCP, CLS, INP)',
    summary: "Google's official metrics for measuring real-world user experience: loading speed, visual stability, and interaction responsiveness.",
    whatIsIt: `Google evaluates user experience and SEO rankings through the **Core Web Vitals**:

1. **LCP (Largest Contentful Paint)**:
- Measures the render time of the largest visible content element on the screen (hero image or primary text block).
- **Target**: < 2.5 seconds.
2. **CLS (Cumulative Layout Shift)**:
- Measures visual stability by quantifying unexpected layout shifts during the page lifecycle.
- **Target**: < 0.1.
3. **INP (Interaction to Next Paint - Replaced FID)**:
- Measures the page's overall responsiveness latency to all user interactions (clicks, taps, key presses) throughout the entire visit.
- **Target**: < 200 milliseconds.`,
    codeSnippet: `// Real-time Web Vitals measurement in Next.js:
// app/layout.tsx or analytics reporter:
export function reportWebVitals(metric: any) {
  switch (metric.name) {
    case 'LCP':
      console.log('LCP (target < 2500ms):', metric.value);
      break;
    case 'CLS':
      console.log('CLS (target < 0.1):', metric.value);
      break;
    case 'INP':
      console.log('INP (target < 200ms):', metric.value);
      break;
    default:
      break;
  }
}`,
    interviewTips: [
      'INP is the defining metric for React developers: explain how `useTransition` and `useDeferredValue` in React 18/19 specifically optimize INP by breaking expensive tasks into interruptible chunks so the browser can paint the next frame within 200ms.',
      'Improving LCP in Next.js: Server-Side Rendering (SSR), font optimization via `next/font` (zero FOIT/FOUT layout shift), and marking hero images with `priority`.'
    ],
    commonTraps: [
      'Assuming FID is still the interactivity metric: Google formally deprecated FID and replaced it with INP in March 2024. Citing INP demonstrates up-to-date domain expertise.',
      'Auditing Web Vitals exclusively on high-end desktop machines with fiber connections instead of simulating mid-tier mobile devices on throttled 4G.'
    ],
    keyTakeaway: 'LCP measures load speed, CLS visual stability, and INP interaction responsiveness.',
    componentKey: 'WebVitalsDemo',
    tags: ['web-vitals', 'LCP', 'CLS', 'INP', 'lighthouse', 'seo']
  },
  {
    id: '5.7',
    level: 5,
    levelTitle: 'Performance',
    title: '5.7 Debounce & Throttle (Rate Limiting Events)',
    summary: 'Debounce: fires after a period of inactivity. Throttle: fires at most once per defined time interval.',
    whatIsIt: `Rate-limiting techniques for events that fire dozens of times per second:

1. **Debounce**:
- Batches multiple calls and executes the function **only after a specified quiet period of inactivity** has elapsed.
- If a new event arrives before the delay expires, the timer resets.
- **Typical use cases**: Real-time search inputs with autocomplete, auto-saving drafts.

2. **Throttle**:
- Guarantees that the function executes **at most once every X milliseconds**, regardless of how many times the event fires.
- **Typical use cases**: \`scroll\` handlers, window \`resize\` listeners, mouse movement tracking.`,
    codeSnippet: `// Custom useDebounce hook
function useDebounce<T>(value: T, delay: number = 300): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // If value changes before 'delay' expires, cancel the previous timer
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

// Search input usage:
function DebouncedSearch() {
  const [text, setText] = useState('');
  const debouncedQuery = useDebounce(text, 400);

  useEffect(() => {
    if (debouncedQuery) {
      console.log('Calling API with:', debouncedQuery);
    }
  }, [debouncedQuery]);

  return <input value={text} onChange={e => setText(e.target.value)} placeholder="Type to search..." />;
}`,
    interviewTips: [
      'Classic whiteboard question: implement `useDebounce` from scratch. The key is explaining the `useEffect` cleanup function with `clearTimeout`.',
      'Contrast `useDebounce` with `useTransition`: Debounce arbitrarily delays execution with a timer; `useTransition` begins work immediately at low priority and interrupts it if higher-priority user input arrives.'
    ],
    commonTraps: [
      'Declaring the debounce function inside the component body without memoizing it with `useCallback` or `useRef`, creating a brand-new timer instance on every render.',
      'Using throttle on search inputs: it still fires intermediate network requests while the user is actively typing mid-word.'
    ],
    keyTakeaway: 'Debounce waits for activity to settle (inputs); Throttle limits execution to fixed intervals (scroll/resize).',
    componentKey: 'DebounceThrottleDemo',
    tags: ['debounce', 'throttle', 'event-handling', 'clearTimeout', 'custom-hooks']
  },
  {
    id: '5.8',
    level: 5,
    levelTitle: 'Performance',
    title: '5.8 Web Workers in React',
    summary: 'Offload heavy computations to a background thread without freezing the main thread or dropping 60 FPS frames.',
    whatIsIt: `JavaScript in the browser is single-threaded. Running a computationally intensive task (parsing a 50MB CSV, applying image filters, executing cryptographic algorithms or graph traversals) **completely blocks the main thread**:
- The UI stops responding to clicks and keystrokes.
- CSS animations and loading spinners freeze.
- The browser may display the "Page Unresponsive" dialog.

**Web Workers**:
Allow executing JavaScript in an **isolated background thread** separate from the main thread.
- Communicate via message passing (\`postMessage\` and \`onmessage\` events).
- Have no direct access to the DOM or React component state.
- Keep the main thread 100% free to handle user interactions smoothly at 60 FPS.`,
    codeSnippet: `// Using a Web Worker in React:
function WorkerCalculationDemo() {
  const [result, setResult] = useState<number | null>(null);
  const [calculating, setCalculating] = useState(false);

  const runWorker = () => {
    setCalculating(true);
    // Instantiate worker with ES Module support:
    const worker = new Worker(new URL('./primes.worker.ts', import.meta.url));

    worker.postMessage({ limit: 10_000_000 });

    worker.onmessage = (e) => {
      setResult(e.data);
      setCalculating(false);
      worker.terminate(); // Free memory when finished
    };
  };

  return (
    <div>
      <button onClick={runWorker} disabled={calculating}>
        {calculating ? 'Calculating in background...' : 'Calculate Primes'}
      </button>
      {result && <p>Primes found: {result}</p>}
    </div>
  );
}`,
    interviewTips: [
      'Explain message serialization: data passed via `postMessage` is copied using the Structured Clone algorithm. To transfer large binary buffers with zero copy overhead, explain `Transferable Objects` (e.g., `ArrayBuffer`).',
      'Mention developer ergonomic libraries for Web Workers in TypeScript, such as Google Chrome Labs’ Comlink.'
    ],
    commonTraps: [
      'Attempting to access `window`, `document`, or DOM elements inside a Web Worker (`DedicatedWorkerGlobalScope` has no DOM access).',
      'Failing to terminate workers (`worker.terminate()`), leaking memory and processes in the background.'
    ],
    keyTakeaway: 'Web Workers offload heavy computations to background threads, guaranteeing an unblocked, responsive UI.',
    componentKey: 'WebWorkerDemo',
    tags: ['web-workers', 'multithreading', 'performance', 'postMessage', 'non-blocking']
  },
  {
    id: '5.9',
    level: 5,
    levelTitle: 'Performance',
    title: '5.9 State Structuring to Minimize Re-renders',
    summary: 'State normalization principles, derived state during render, and eliminating redundant state.',
    whatIsIt: `State architecture and data modeling have a greater impact on performance than manual \`useMemo\` optimizations:

Core principles of state structuring:
1. **Never Store Duplicate State**:
If a value can be computed from existing props or state (e.g., cart total, completed items count, full name), **derive it inline during render**. Storing it in separate state requires syncing via \`useEffect\`, doubling render cycles and introducing sync bugs.
2. **Entity Normalization (By ID)**:
Instead of deeply nested object arrays (\`groups[0].users[2].comments[5]\`), normalize entities into \`byId: { [id]: Entity }\` and \`allIds: [id1, id2]\`. This enables \`O(1)\` lookups and prevents cloning entire object trees to update a single property.
3. **Group State That Changes Together**:
If two state variables always update together (e.g., coordinates \`x\` and \`y\`), combine them into a single state object.`,
    codeSnippet: `// ❌ BAD: Redundant and desynchronized state
function PoorCart({ items }: { items: { id: string; price: number }[] }) {
  const [total, setTotal] = useState(0);
  useEffect(() => {
    // Unnecessary extra re-render after mount and whenever items change:
    setTotal(items.reduce((acc, i) => acc + i.price, 0));
  }, [items]);
  return <p>Total: {total}</p>;
}

// ✅ GOOD: Pure derived state (Zero extra re-renders)
function OptimalCart({ items }: { items: { id: string; price: number }[] }) {
  // Computed cleanly during render; wrap in useMemo only if calculation is expensive:
  const total = items.reduce((acc, i) => acc + i.price, 0);
  return <p>Total: {total}</p>;
} `,
    interviewTips: [
      'Golden rule: "Ask yourself: Can this be calculated during render from existing props or state? If yes, it should not be state".',
      'Explain how state normalization optimizes selectors: if a user updates their avatar, only the component subscribed to that specific entity ID re-renders, rather than invalidating an entire list of 500 users.'
    ],
    commonTraps: [
      'Pairing `[items, setItems]` and `[filteredItems, setFilteredItems]` synchronized via `useEffect`, which causes visual flashes and synchronization bugs.',
      'Nesting state arrays 5 levels deep, making immutable updates brittle and error-prone.'
    ],
    keyTakeaway: 'Derive values during render and normalize complex state by ID to prevent unnecessary re-renders and sync bugs.',
    componentKey: 'StateStructureDemo',
    tags: ['state-structure', 'derived-state', 'normalization', 'best-practices']
  }
];
