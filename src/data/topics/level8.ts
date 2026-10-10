import { Topic } from '@/types';

export const LEVEL_8_TOPICS: Topic[] = [
  {
    id: '8.1',
    level: 8,
    levelTitle: 'React Internals',
    title: '8.1 The Fiber Architecture (Under the Hood)',
    summary: 'The internal data structure that replaced the synchronous call stack, enabling interruptible and concurrent rendering.',
    whatIsIt: `Prior to React 16, reconciliation relied on the "Stack Reconciler": it traversed the component tree recursively using the native JavaScript call stack. Because the call stack cannot be paused without blocking the browser thread, large component trees locked up the UI.

**What is a Fiber node?**:
In React 16+, every element in the component tree is represented by an internal JavaScript object called a **Fiber**.
A Fiber represents both a unit of work and a node in a **singly/doubly linked list tree structure**:
- \`child\`: Pointer to the first direct child.
- \`sibling\`: Pointer to the next direct sibling.
- \`return\`: Pointer to the parent Fiber.
- \`stateNode\`: Reference to the component class instance or physical DOM node.
- \`memoizedState\`: Linked list of hooks for the component.
- \`alternate\`: Pointer to the corresponding fiber in the opposing tree (**Double Buffering**).

By replacing the native call stack with heap-allocated pointers, React can pause iteration at any time, save the pointer, yield to an urgent browser event, and resume work exactly where it left off.`,
    codeSnippet: `// Simplified representation of a Fiber node structure:
interface FiberNode {
  tag: number;              // Type: FunctionComponent, ClassComponent, HostComponent (DOM), etc.
  key: null | string;
  elementType: any;         // Component function or tag ('div')
  type: any;
  stateNode: any;           // Native DOM element or class instance

  // Linked list tree pointers:
  child: FiberNode | null;  // First child
  sibling: FiberNode | null;// Next sibling
  return: FiberNode | null; // Parent

  // State and Hooks:
  memoizedState: any;       // Head of the hooks linked list
  memoizedProps: any;
  pendingProps: any;

  // Double Buffering:
  alternate: FiberNode | null; // Points to the tree currently displayed on screen
  flags: number;            // Mutation effect flags (Placement, Update, Deletion)
}`,
    interviewTips: [
      'Explain the "Double Buffering" technique borrowed from game engines: React maintains two Fiber trees in memory: the "Current" tree (what the user currently sees on screen) and the "WorkInProgress" tree (being calculated in the background). When the render phase completes successfully, React simply swaps the root pointer in a single atomic pointer swap during the Commit phase.',
      'Explain why Fiber nodes use `child`, `sibling`, and `return`: allows traversing the entire tree with a flat `while` loop without deep recursive function call stacks.'
    ],
    commonTraps: [
      'Confusing the Virtual DOM with Fiber: Virtual DOM is the high-level concept of an in-memory UI representation; Fiber is the specific low-level data structure and scheduling engine implementing it since React 16.',
      'Attempting to inspect or mutate Fiber nodes in production application code: they are private, internal, and unstable implementation details.'
    ],
    keyTakeaway: 'Fiber transformed rendering into a pausable linked list with double buffering, making concurrency possible.',
    componentKey: 'FiberTreeVisualizerDemo',
    tags: ['fiber', 'internals', 'double-buffering', 'linked-list', 'concurrency', 'stack-reconciler']
  },
  {
    id: '8.2',
    level: 8,
    levelTitle: 'React Internals',
    title: '8.2 Render & Commit Phases in Depth',
    summary: 'The strict separation: Render is async, interruptible, and pure; Commit is synchronous and uninterrupted on the real DOM.',
    whatIsIt: `React's update pipeline is strictly partitioned into two phases with fundamentally opposite contracts:

1. **Render Phase (Reconciliation)**:
- React invokes function components, evaluates hook queues, and calculates what changed between trees.
- **Asynchronous and Interruptible**: The React Scheduler can slice it across multiple frame budgets or abort it entirely if a higher-priority event intervenes.
- **Must be 100% Pure**: Zero side effects, zero API calls, zero global variable mutations. React may call a component render function multiple times and discard the output without ever committing it to screen.
- The real browser DOM is NEVER touched during this phase.

2. **Commit Phase**:
- React takes the list of mutations computed during the render phase and applies them to the real DOM (inserting, moving, or removing DOM nodes).
- **Synchronous and Uninterrupted**: The browser cannot intervene until React finishes updating the DOM, preventing inconsistent, partially painted UI states.
- Executes \`useLayoutEffect\` (synchronously before browser paint) and schedules \`useEffect\` (asynchronously after browser paint).`,
    codeSnippet: `// Demonstrating execution lifecycle across phases:
function PhasePipelineDemo() {
  const [val, setVal] = useState(0);

  // PHASE 1: Render (Pure, may execute multiple times before painting)
  console.log('[PHASE 1: Render] Evaluating component function');

  // PHASE 2: Commit - Layout Effect (Synchronous, after DOM mutation, before paint)
  useLayoutEffect(() => {
    console.log('[PHASE 2: Commit - Layout] DOM synchronously mutated, screen not yet painted');
  }, [val]);

  // PHASE 2+: Commit - Passive Effect (Asynchronous, after browser paints frame to screen)
  useEffect(() => {
    console.log('[PHASE 2+: Passive Effect] Browser has painted pixels on screen');
  }, [val]);

  return <button onClick={() => setVal(v => v + 1)}>Trigger Pipeline ({val})</button>;
}`,
    interviewTips: [
      'Senior trick question: "Why does React execute the component body twice in StrictMode development, but only runs `useEffect` once?". Answer: To catch impurities in the RENDER PHASE. If your render function mutates a global variable or produces side effects, the second invocation produces different outputs, immediately exposing the bug.',
      'Explain why `useLayoutEffect` can cause frame drops: because it executes synchronously in the Commit phase before paint, long-running calculations inside it block the main thread and delay the next frame.'
    ],
    commonTraps: [
      'Triggering side effects during the render phase (e.g., `window.title = "New"` or `fetch()` called directly in the component body).',
      'Misunderstanding when `useEffect` fires: it runs AFTER commit and AFTER the browser has completed layout and paint.'
    ],
    keyTakeaway: 'Render phase calculates diffs and is interruptible; Commit phase synchronously mutates the real DOM.',
    componentKey: 'RenderCommitPhasesDemo',
    tags: ['render-phase', 'commit-phase', 'purity', 'useLayoutEffect', 'useEffect']
  },
  {
    id: '8.3',
    level: 8,
    levelTitle: 'React Internals',
    title: '8.3 The React Scheduler & Priority Lanes',
    summary: 'How the Scheduler allocates priorities via 32-bit binary lanes and yields to the browser to prevent frame drops.',
    whatIsIt: `The **Scheduler** is React's internal package that orchestrates task execution time on the browser's single thread.

How does it avoid locking the browser?:
It employs **Cooperative Multitasking**: React breaks rendering work into 5-millisecond execution chunks. After each chunk, it checks whether user input events are pending (\`navigator.scheduling.isInputPending()\` or a \`MessageChannel\` tick). If input is pending, React yields control back to the host browser (**Yield to Host**).

**The Lanes Priority Model**:
React 18 introduced a 31-bit priority system using binary bitmasks (Lanes):
- **SyncLane**: Highest priority (direct clicks, keystrokes, \`flushSync\`).
- **InputContinuousLane**: Continuous user inputs (drag-and-drop, scroll).
- **DefaultLane**: Standard updates from \`useState\` and network promise resolutions.
- **TransitionLane**: Low-priority transitions originating from \`useTransition\` or \`useDeferredValue\`.
- **IdleLane**: Maintenance tasks executed only when the browser is entirely idle.`,
    codeSnippet: `// Conceptual representation of 32-bit priority Lanes:
// React uses bitwise operations to check and combine priorities in nanoseconds:
const SyncLane             = 0b0000000000000000000000000000001; // Highest urgency
const InputContinuousLane  = 0b0000000000000000000000000000100;
const DefaultLane          = 0b0000000000000000000000010000000;
const TransitionLane       = 0b0000000000000000001000000000000; // useTransition
const IdleLane             = 0b0100000000000000000000000000000;

// If a SyncLane update arrives, React interrupts any running TransitionLane work:
function hasHigherPriority(laneA: number, laneB: number): boolean {
  return laneA < laneB; // Lower binary value = higher urgency
} `,
    interviewTips: [
      'Explain the architectural evolution: before Lanes, React 16 used linear "Expiration Times". Lanes allowed React to model multiple disjoint concurrent transitions and batch or decouple them using fast bitwise operators (`&`, `|`).',
      'Why doesn’t React use the native `requestIdleCallback`?: Because on many browsers it fires too infrequently (sometimes 20 frames late). The React Scheduler implements a finely tuned polyfill based on `MessageChannel` and `postMessage` to yield every 5ms.'
    ],
    commonTraps: [
      'Assuming all state updates have equal priority in React.',
      'Assuming low-priority background work can starve indefinitely: the Scheduler implements "Starvation Protection", boosting task priorities if they remain unexecuted past a deadline.'
    ],
    keyTakeaway: 'The Scheduler uses bitmask Lanes and yields every 5ms so the browser never drops below 60 FPS.',
    componentKey: 'SchedulerLanesDemo',
    tags: ['scheduler', 'lanes', 'priorities', 'message-channel', 'starvation', 'yield']
  },
  {
    id: '8.4',
    level: 8,
    levelTitle: 'React Internals',
    title: '8.4 How Hooks Work Under the Hood (Linked List)',
    summary: 'The real implementation of useState and useEffect: a cursor traversing a sequential linked list on the fiber.',
    whatIsIt: `A common misconception is that React tracks hooks by their variable names. In reality, React has no idea you named your variable \`const [age, setAge] = useState(25)\`.

**The Linked List Architecture**:
On each component Fiber exists the property \`fiber.memoizedState\`.
When a component renders:
1. On **Initial Mount**: Each hook call (\`useState\`, \`useEffect\`) creates a new \`Hook\` object and appends it to the end of a linked list: \`hook1.next = hook2; hook2.next = hook3\`.
2. On **Subsequent Updates**: React places a cursor pointer at the first hook (\`workInProgressHook = fiber.memoizedState\`). Every time your code invokes a hook, React reads state from that node and advances the cursor to the next (\`workInProgressHook = currentHook.next\`).

This is the exact reason the Rules of Hooks exist: hook calls must execute in the exact same sequence on every single render pass.`,
    codeSnippet: `// Educational simulation of how React implements useState internally:
let hooksList: any[] = [];
let currentCursor = 0;

function myUseState<T>(initialValue: T): [T, (next: T | ((prev: T) => T)) => void] {
  const fixedIndex = currentCursor;

  // Initialize value on first run (mount):
  if (hooksList[fixedIndex] === undefined) {
    hooksList[fixedIndex] = initialValue;
  }

  const setter = (nextValue: T | ((prev: T) => T)) => {
    hooksList[fixedIndex] = typeof nextValue === 'function'
      ? (nextValue as any)(hooksList[fixedIndex])
      : nextValue;
    reRenderApp(); // Trigger a new render cycle
  };

  currentCursor++; // Advance cursor for the next hook call
  return [hooksList[fixedIndex], setter];
}

function reRenderApp() {
  currentCursor = 0; // Reset cursor to 0 before re-evaluating the component
  // Component function is called again...
}`,
    interviewTips: [
      'Frequent senior live coding challenge: "Implement a minimal useState from scratch". Demonstrating the array or linked list pointer with `cursor = 0` reset at the start of each render proves deep understanding.',
      'Explain `mountWorkInProgressHook` vs `updateWorkInProgressHook`: in React source code, distinct dispatcher tables exist for mount and update phases.'
    ],
    commonTraps: [
      'Calling a hook conditionally, which shifts the cursor index and misaligns state between completely different variables.',
      'Performing side effects inside state setters without understanding they are queued updates.'
    ],
    keyTakeaway: 'React tracks hooks via a sequential linked list; call order is their only persistent identity.',
    componentKey: 'HooksInternalsDemo',
    tags: ['hooks-internals', 'linked-list', 'useState-from-scratch', 'cursor', 'fiber']
  },
  {
    id: '8.5',
    level: 8,
    levelTitle: 'React Internals',
    title: '8.5 Stale Closures',
    summary: "React's most subtle bug: functions capturing variables from a prior render pass and referencing outdated values.",
    whatIsIt: `A **Stale Closure** occurs because of how functions and lexical scoping work in JavaScript:
Each time a React function component runs, a fresh scope is created with **brand-new local variables**.

If you declare a callback, interval (\`setInterval\`), or event listener that persists over time, that function **retains in its closure the variable values from the exact render pass in which it was created**.
If that callback is not recreated or does not update its dependency array, **it will perpetually read the stale variable value from that initial render**.`,
    codeSnippet: `// ❌ THE CLASSIC STALE CLOSURE BUG
function BrokenTimer() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      // 💣 This interval closed over 'count = 0' on mount.
      // Every second it logs 0 and calls setCount(0 + 1) = 1 forever!
      console.log('Stale captured value:', count);
      setCount(count + 1);
    }, 1000);
    return () => clearInterval(id);
  }, []); // Missing dependencies: lacks [count]

  return <div>Count: {count}</div>;
}

// ✅ THE 3 SENIOR SOLUTIONS:
// 1. Functional state updater (does not depend on outer scope variable):
//    setCount(prev => prev + 1);
// 2. Include [count] in dependencies (resets the timer with fresh closure).
// 3. Store state in a useRef updated on every render:
//    const countRef = useRef(count); countRef.current = count;`,
    interviewTips: [
      'Explain the `useRef` pattern for stable callbacks: when an event listener must not be reset but needs to read the latest state, assign `ref.current = state` on each render and access `ref.current` inside the handler.',
      'Mention the experimental/RFC hook `useEffectEvent`: designed specifically to extract non-reactive logic from effects without adding dependencies to the effect array.'
    ],
    commonTraps: [
      'Silencing ESLint warnings (`// eslint-disable-next-line react-hooks/exhaustive-deps`) instead of applying one of the 3 correct architectural fixes.',
      'Assuming variable values inside `setTimeout` or promises remain reactive in real time.'
    ],
    keyTakeaway: 'Closures capture values from their specific render. Use functional updates `prev => ...` or refs to avoid frozen state.',
    componentKey: 'StaleClosuresDemo',
    tags: ['stale-closures', 'closures', 'setInterval', 'exhaustive-deps', 'useRef']
  },
  {
    id: '8.6',
    level: 8,
    levelTitle: 'React Internals',
    title: '8.6 Asynchrony & `setState` Queuing',
    summary: 'setState does not mutate local variables immediately; it enqueues an update onto the fiber to be processed in the next render.',
    whatIsIt: `A major source of confusion for engineers is calling \`setCount(5)\` and noticing on the next line that \`count\` is still \`0\`.

Why does this happen?:
1. \`const [count, setCount] = useState(0)\` declares a constant \`count\` scoped to the current function execution.
2. \`setCount\` is not a pointer to that constant and cannot reassign a JavaScript constant in the current execution scope.
3. Instead, \`setCount\` instantiates an \`Update\` object and appends it to the **Fiber update queue (\`fiber.updateQueue\`)**, scheduling a future re-render.
4. The updated value becomes available only when React invokes the component function again in the **next render pass**.`,
    codeSnippet: `function QueueingDemo() {
  const [n, setN] = useState(0);

  const handleClick = () => {
    console.log('1. Before set:', n); // Logs 0

    setN(n + 1); // Enqueues update with computed value (0 + 1)
    console.log('2. Immediately after:', n); // Still logs 0!

    setN(n + 1); // Enqueues update with identical value (0 + 1)

    // Functional updates chain over the queue:
    setN(prev => prev + 1); // Receives output from queue (1) and increments -> 2
  };

  return <button onClick={handleClick}>Current value: {n}</button>;
}`,
    interviewTips: [
      'Interview trick question: "Is setState synchronous or asynchronous?". Precise technical answer: The function call `setCount()` itself executes synchronously (it creates and enqueues the update object immediately), but the observable state change and screen repaint are asynchronous and scheduled.',
      'Explain how `updateQueue` is processed: React traverses a circular linked list of pending updates and sequentially applies them to base state to compute the final `memoizedState`.'
    ],
    commonTraps: [
      'Writing `await setState(...)` believing it returns a Promise (it returns `void`).',
      'Attempting to read state immediately after calling its setter to pass to an API instead of passing the new value directly.'
    ],
    keyTakeaway: 'setState schedules a re-render and queues an update; it never modifies the local variable in the current call stack.',
    componentKey: 'SetStateBatchingAsyncDemo',
    tags: ['setState', 'asynchrony', 'updateQueue', 'queueing', 'batching']
  },
  {
    id: '8.7',
    level: 8,
    levelTitle: 'React Internals',
    title: '8.7 When & Why React Re-renders',
    summary: 'The exact triggers of a re-render and early bailout optimizations with `Object.is` comparison.',
    whatIsIt: `A component re-renders exclusively due to:
1. **Local state updates** (\`useState\` / \`useReducer\`).
2. **Parent component re-rendering** (unless memoized with \`React.memo\` and props remain identical).
3. **Context changes** when the component consumes that Context.

**The Early Bailout Optimization (with \`Object.is\`)**:
If you invoke \`setState(nextValue)\` and \`Object.is(nextValue, prevState) === true\` (meaning primitive values or object references are strictly identical), **React aborts the update immediately (Eager Bailout)** without rendering children or touching the DOM.`,
    codeSnippet: `function BailoutDemo() {
  const [number, setNumber] = useState(10);
  const renders = useRef(0);
  renders.current += 1;

  const assignSameValue = () => {
    // Because the value is identical under Object.is, React bails out
    setNumber(10);
  };

  const assignNewObjectSameContent = () => {
    // 💣 Even if content is identical, the object reference is new
    // React cannot bail out and triggers a re-render:
    // setUser({ name: 'Ana' });
  };

  return (
    <div>
      <p>Value: {number} | Renders executed: {renders.current}</p>
      <button onClick={assignSameValue}>Assign 10 again (Bailout)</button>
    </div>
  );
}`,
    interviewTips: [
      'Explain why mutating objects breaks bailout: if you do `user.age = 30; setUser(user);`, the reference is identical (`Object.is(user, user) === true`), so React triggers an eager bailout and DOES NOT update the UI.',
      'Explain what happens if setState is called with the same value while a render is already pending: React may evaluate the component body once to verify, then bail out before committing to child fibers.'
    ],
    commonTraps: [
      'Creating new references in setters (`setItems([...items])`) without changes, forcing re-renders that could have been skipped.',
      'Assuming React performs deep object equality checks: React only performs shallow `Object.is` comparisons.'
    ],
    keyTakeaway: 'React compares values with `Object.is`; if references have not changed, it executes an early Bailout and skips re-rendering.',
    componentKey: 'WhyRerenderBailoutDemo',
    tags: ['rerender-causes', 'bailout', 'Object.is', 'shallow-compare', 'optimization']
  },
  {
    id: '8.8',
    level: 8,
    levelTitle: 'React Internals',
    title: '8.8 `useEffect` vs. `useLayoutEffect` (Browser Paint)',
    summary: 'useLayoutEffect runs synchronously before paint to prevent visual flicker; useEffect runs asynchronously after paint.',
    whatIsIt: `The crucial distinction lies in execution timing relative to the **Browser Paint** pipeline:

1. **\`useLayoutEffect\`**:
- Runs **synchronously** immediately after React applies DOM mutations in the Commit phase, but **BEFORE the browser paints pixels on screen**.
- Blocks visual paint until its execution completes.
- **Essential Use Case**: Measuring DOM geometry (\`getBoundingClientRect()\`) and adjusting layout/styles (tooltips, popovers, dropdowns) so the user never sees a visual layout jump (**Flicker**).
- Warning: Emits a console warning in SSR because the server has no layout or DOM.

2. **\`useEffect\`**:
- Runs **asynchronously after the browser has completed layout and paint**.
- Never blocks painting or user interactions.
- **Essential Use Case**: 99% of day-to-day side effects (data fetching, subscriptions, timers).`,
    codeSnippet: `function TooltipWithLayoutEffect({ targetRect }: { targetRect: DOMRect | null }) {
  const tooltipRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ top: 0, left: 0 });

  // If useEffect were used here, the tooltip would render at (0,0) for 1 frame then jump.
  // With useLayoutEffect, measurement and adjustment occur BEFORE the first visible paint:
  useLayoutEffect(() => {
    if (tooltipRef.current && targetRect) {
      const tooltipHeight = tooltipRef.current.offsetHeight;
      setPosition({
        top: targetRect.top - tooltipHeight - 8,
        left: targetRect.left
      });
    }
  }, [targetRect]);

  return (
    <div
      ref={tooltipRef}
      style={{ position: 'fixed', top: position.top, left: position.left }}
      className="bg-gray-900 text-white p-2 rounded shadow-lg text-sm"
    >
      Perfectly positioned tooltip with zero visual flicker
    </div>
  );
}`,
    interviewTips: [
      'Whiteboard question: "How would you reproduce visual flicker to justify useLayoutEffect?". Answer: Render an element with initial coordinates, then update its position in `useEffect` based on DOM measurements; the user sees the element flicker in its starting position for a split second. With `useLayoutEffect`, that intermediate frame is never painted.',
      'Rule of thumb: "Always start with `useEffect`. Switch to `useLayoutEffect` only if you experience visual flicker while measuring the DOM".'
    ],
    commonTraps: [
      'Placing slow API calls or heavy tasks in `useLayoutEffect`, blocking browser painting and degrading INP.',
      'Attempting to run `useLayoutEffect` in React Server Components or Next.js SSR.'
    ],
    keyTakeaway: 'useLayoutEffect measures and updates before paint to prevent flicker; useEffect runs asynchronously after paint.',
    componentKey: 'LayoutEffectFlickerDemo',
    tags: ['useEffect', 'useLayoutEffect', 'flicker', 'browser-paint', 'dom-measurements']
  },
  {
    id: '8.9',
    level: 8,
    levelTitle: 'React Internals',
    title: '8.9 Hydration & Mismatch Errors in Depth',
    summary: 'What causes hydration mismatches between server and client, and how to resolve them cleanly and robustly.',
    whatIsIt: `In Server-Side Rendering (SSR) or SSG, the server renders a static HTML document and delivers it to the browser. Once the JavaScript bundle downloads, React initiates **Hydration**:
React walks the existing server HTML DOM tree and attaches event listeners and in-memory component state.

**What is a Hydration Mismatch?**:
During hydration, React expects that **the Virtual DOM tree generated by the client’s first render pass matches the server-rendered HTML character for character**.
If discrepancies exist (e.g., the server rendered \`<div>--:--</div>\` but the client rendered \`<div>14:32:05</div>\`), React flags an error:
- In development: Logs the prominent warning \`Text content does not match server-rendered HTML\`.
- In severe cases: React must discard the server-rendered DOM subtree and recreate it from scratch on the client, destroying SSR performance advantages.`,
    codeSnippet: `// ❌ COMMON CAUSES OF HYDRATION MISMATCH:
// 1. Date/time formatting: new Date().toLocaleTimeString() (server runs in a different timezone than user)
// 2. Random values: Math.random() or crypto.randomUUID()
// 3. Browser-only globals: window.innerWidth, localStorage.getItem('token')
// 4. Invalid HTML according to HTML specs: nesting <p> inside <p>, or <div> inside <p>

// ✅ CLEAN FIX: Defer rendering browser-dependent data until after hydration
function SafeClock() {
  const [time, setTime] = useState<string | null>(null);

  useEffect(() => {
    // Only runs on the client after successful hydration:
    setTime(new Date().toLocaleTimeString());
    const id = setInterval(() => setTime(new Date().toLocaleTimeString()), 1000);
    return () => clearInterval(id);
  }, []);

  // Server and initial client render display '--:--' (perfect match):
  return <span>{time ?? '--:--'}</span>;
}`,
    interviewTips: [
      'Mention the escape hatch `suppressHydrationWarning`: If a discrepancy is unavoidable and benign (e.g., a server-rendered timestamp differing slightly in text), you can add `suppressHydrationWarning` to that specific HTML element to silence warnings without re-creating the entire subtree.',
      'Explain invalid HTML nesting: browsers like Chrome auto-correct malformed HTML on the fly (e.g., nesting a `<div>` inside a `<p>` causes Chrome to close the `<p>` early). This mutates the physical DOM structure and causes React hydration to fail catastrophically.'
    ],
    commonTraps: [
      'Reading `localStorage` inside `useState(() => localStorage.getItem("theme"))` initialization in an SSR component.',
      'Using `typeof window !== "undefined"` in initial conditional JSX (produces different markup on server vs client).'
    ],
    keyTakeaway: 'Ensure the initial client render matches server HTML identically; defer browser-only reads to a useEffect.',
    componentKey: 'HydrationMismatchDemo',
    tags: ['hydration', 'hydration-mismatch', 'ssr', 'suppressHydrationWarning', 'isMounted']
  },
  {
    id: '8.10',
    level: 8,
    levelTitle: 'React Internals',
    title: '8.10 Implementing Custom Hooks from Scratch',
    summary: 'Whiteboard mastery: implementing usePrevious, useToggle, useDebounce, and useLocalStorage from first principles.',
    whatIsIt: `One of the most effective ways interviewers evaluate whether an engineer truly understands React mechanics is asking them to implement fundamental Custom Hooks **from scratch without libraries or documentation**:

1. **\`usePrevious(value)\`**:
Returns the value a prop or state variable held during the immediately preceding render.
Implemented by exploiting the fact that \`ref.current\` updates inside \`useEffect\` (which runs **after** render). Consequently, during the current render, \`ref.current\` still holds the prior render's value.
2. **\`useToggle(initialState)\`**:
Toggles boolean state functionally.
3. **\`useDebounce(value, delay)\`**:
Debounces a rapidly changing value using \`setTimeout\` and \`clearTimeout\`.
4. **\`useLocalStorage(key, initialValue)\`**:
Synchronizes state with browser localStorage with resilient JSON serialization.`,
    codeSnippet: `// 1. usePrevious implemented from scratch:
function usePrevious<T>(value: T): T | undefined {
  const ref = useRef<T>(undefined);

  useEffect(() => {
    // Executes AFTER rendering commits
    ref.current = value;
  }, [value]);

  // During render execution, returns the value stored in the PREVIOUS cycle
  return ref.current;
}

// 2. useToggle implemented from scratch:
function useToggle(initial: boolean = false): [boolean, (force?: boolean) => void] {
  const [active, setActive] = useState(initial);
  const toggle = useCallback((force?: boolean) => {
    setActive(prev => (typeof force === 'boolean' ? force : !prev));
  }, []);
  return [active, toggle];
}`,
    interviewTips: [
      'Explain the mental model of `usePrevious`: the return statement evaluates during render; the assignment to `ref.current` evaluates in `useEffect` (passive effects phase). Because render runs BEFORE passive effects, the hook consistently returns the value from the prior render.',
      'In React 19: mention that complex patterns for tracking previous values can often be simplified with `useOptimistic` or by deriving state directly.'
    ],
    commonTraps: [
      'Attempting to implement `usePrevious` using `useState` instead of `useRef`, which triggers an infinite re-render loop on every update.',
      'Failing to handle `JSON.parse` exceptions or quota exceeded errors in `useLocalStorage` implementations.'
    ],
    keyTakeaway: 'Mastering usePrevious, useToggle, and useDebounce from scratch demonstrates an intuitive grasp of the render lifecycle.',
    componentKey: 'CustomHooksFromScratchDemo',
    tags: ['usePrevious', 'useToggle', 'useDebounce', 'custom-hooks-scratch', 'technical-interview']
  }
];
