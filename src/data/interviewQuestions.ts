import { InterviewQuestion } from '@/types';

export const INTERVIEW_QUESTIONS: InterviewQuestion[] = [
  {
    id: 'q1',
    question: 'Why must state never be mutated directly in React?',
    category: 'Fundamentals & State',
    seniorAnswer: `React determines whether a component needs to re-render by comparing the previous reference with the next reference using Object.is (shallow comparison). If you mutate an existing object or array in place (e.g., user.age = 30), the reference in memory remains identical. Consequently, React assumes nothing has changed and bails out of re-rendering, leaving the UI completely desynchronized.

Furthermore, direct mutation breaks:
1. React.memo and useMemo: which rely on comparing previous props with current props.
2. DevTools Time Travel: the historical snapshot of prior states gets overwritten.
3. React's Concurrent Model: where different rendering passes must evaluate previous states safely and immutably.

Senior Answer in One Sentence: "Immutability guarantees that reference changes serve as the deterministic signal React requires to schedule reconciliation."`,
    codeExample: `// ❌ SEVERE BUG: In-place mutation (Same reference)
const [user, setUser] = useState({ name: 'Ana', age: 25 });
user.age = 26;
setUser(user); // React sees Object.is(user, user) === true -> BAILS OUT, NO RE-RENDER

// ✅ CORRECT: Producing a fresh immutable reference
setUser(prev => ({ ...prev, age: 26 }));`,
    trapsAndRedFlags: [
      'Trap: Assuming arr.push() followed by setArr(arr) works simply because "you called the setter".',
      'Interview Red Flag: Claiming immutability is merely a "coding style preference". It is the foundational pillar of React\'s algorithmic diffing.',
      'Beware of nested mutations: shallow spreading (...user) does not clone nested objects (user.address requires deep cloning or Immer).'
    ]
  },
  {
    id: 'q2',
    question: 'What is the purpose of the `key` prop and what happens if you use array indices?',
    category: 'Diffing & Lists',
    seniorAnswer: `The 'key' prop is a unique, stable identifier that React's reconciliation algorithm uses to track element identity across different render cycles. It informs React precisely whether an item was inserted, removed, reordered, or modified.

If you use the array index as a key:
1. If the list is sorted, filtered, or prepended, elements shift their indices.
2. The item at index 0 will perpetually have key="0". If a child component holds local internal state (an uncommitted input value, a CSS transition, or a checked checkbox), React re-associates that state with the wrong item.
3. React's DOM node reuse optimization is degraded, triggering unnecessary DOM destructions and mutations.

When is index acceptable: ONLY if the list is strictly static (never filtered, reordered, prepended, or truncated) and its elements hold zero internal state and lack natural unique IDs.`,
    codeExample: `// ❌ DANGER: Removing or sorting corrupts input state
{items.map((item, index) => (
  <ListItem key={index} item={item} />
))}

// ✅ CORRECT: Stable ID tied to the underlying domain data
{items.map(item => (
  <ListItem key={item.id} item={item} />
))}`,
    trapsAndRedFlags: [
      'Trap: Using key={Math.random()} or key={Date.now()} inside the render pass. This destroys and remounts the component on EVERY single render, losing focus and creating severe flickering.',
      'Common Follow-up: How do you reset internal form state without useEffect? Senior answer: Pass a changing key prop (<UserForm key={userId} />).'
    ]
  },
  {
    id: 'q3',
    question: 'What is the exact difference between `useMemo` and `useCallback`?',
    category: 'Performance',
    seniorAnswer: `Both are memoization hooks powered by a dependency array:
- useMemo(fn, deps): Executes fn during render and memoizes the RETURN VALUE (the computational result).
- useCallback(fn, deps): Memoizes the FUNCTION INSTANCE itself across renders, guaranteeing a stable referential identity.

In fact, useCallback(fn, deps) is structurally equivalent to useMemo(() => fn, deps).

When should they actually be used?:
They should never be sprinkled preemptively because memoization itself carries overhead (memory allocations and dependency comparisons).
- useMemo: For CPU-heavy computations (sorting thousands of items, intensive matrix calculations) or to stabilize object references used as dependencies for downstream hooks.
- useCallback: Primarily when passing a callback prop to a child component wrapped in React.memo, or when the function must be included in a useEffect dependency array.`,
    codeExample: `// useMemo caches the result of an expensive calculation
const filteredData = useMemo(() => {
  return hugeList.filter(item => item.active).sort((a, b) => b.score - a.score);
}, [hugeList]);

// useCallback preserves function reference stability
const handleClick = useCallback((id: string) => {
  deleteItem(id);
}, [deleteItem]); // Child wrapped in React.memo will not re-render due to new function prop`,
    trapsAndRedFlags: [
      'Common Misconception: Believing useCallback makes the inner function execute faster. It does not; it only maintains the same memory reference.',
      'Modern Context: Mention the React Compiler. With React Compiler in React 19, manual useMemo and useCallback memoization is automated at build time for the vast majority of scenarios.'
    ]
  },
  {
    id: 'q4',
    question: 'When should you use Context API vs Zustand / Redux Toolkit vs TanStack Query?',
    category: 'Architecture & State',
    seniorAnswer: `This is a flagship architectural question. A senior answer clearly decouples 'Server State' from 'Client State':

1. TanStack Query (React Query) / SWR:
For SERVER STATE (data originating from a remote API: users, products, notifications). Provides caching, background revalidation, request deduplication, retries, and optimistic mutations. In modern frontend systems, adopting TanStack Query eliminates ~80% of boilerplate global stores.

2. React Context API:
For dependency injection and LOW-FREQUENCY global client state (dark/light theme, active locale, authenticated user profile). Critical caveat: ALL consumer components re-render whenever the context value reference changes, lacking native granular selectors.

3. Zustand / Redux Toolkit:
For HIGH-FREQUENCY OR COMPLEX CLIENT UI STATE (e-commerce shopping cart with local business rules, canvas editors, audio/video players with millisecond scrubbers). Provides fine-grained selectors so only components subscribed to specific slices re-render. Zustand is widely preferred today due to zero boilerplate and provider-less architecture.`,
    codeExample: `// Context: Ideal for low-frequency configuration
const ThemeContext = createContext<Theme>('dark');

// TanStack Query: Manages server state lifecycle
const { data, isLoading } = useQuery({ queryKey: ['users'], queryFn: fetchUsers });

// Zustand: Scalable client state with granular selectors
const useCartStore = create((set) => ({
  items: [],
  addItem: (item) => set((state) => ({ items: [...state.items, item] }))
}));
// Only re-renders when count changes:
const count = useCartStore((state) => state.items.length);`,
    trapsAndRedFlags: [
      'Red Flag: Storing raw API responses in Redux or Context using useEffect + dispatch(fetchSuccess(data)). Explain that this manually reinvents server state management with heavy boilerplate.',
      'Trap: Using a single giant Context for the entire application that bundles both theme settings and rapidly ticking timers.'
    ]
  },
  {
    id: 'q5',
    question: 'How do you avoid "Prop Drilling" without immediately reaching for global state?',
    category: 'Component Composition',
    seniorAnswer: `Prop Drilling occurs when props are threaded through multiple layers of intermediate components that have no operational interest in the data and merely serve as conduits.

Hierarchical strategies in priority order:
1. Component Composition with 'children' or slots: Instead of passing props down several levels so a deep child can build a button, instantiate the button in the shared ancestor and pass it as a prop (or as children). Intermediate components simply render {children}. This eliminates drilling and decouples component contracts.
2. State Colocation: State was often lifted too high preemptively. Move it down to the closest sub-tree where it is genuinely consumed.
3. Compound Components: A parent container coordinates its children via an encapsulated, locally-scoped Context (e.g., <Select><Select.Option /></Select>).
4. Context API: When data represents stable, cross-cutting concerns (theme, auth).
5. Zustand: When state must be accessed across disparate screens without nesting constraints.`,
    codeExample: `// ❌ Prop Drilling: Layout and Sidebar do not need 'user' or 'logout'
<App user={user}>
  <Layout user={user}>
    <Sidebar user={user} onLogout={logout} />
  </Layout>
</App>

// ✅ Composition Solution (Children / Slots):
<Layout
  sidebar={<UserProfile user={user} onLogout={logout} />}
>
  <MainContent />
</Layout>`,
    trapsAndRedFlags: [
      'Red Flag: Responding that the only solution is installing Redux or Context. Senior engineers leverage component composition before introducing global stores.'
    ]
  },
  {
    id: 'q6',
    question: 'What is the fundamental difference between `useEffect` and `useLayoutEffect`?',
    category: 'Lifecycle & Render',
    seniorAnswer: `The distinction lies in the precise execution timing relative to the browser painting the frame:

1. useLayoutEffect:
- Fires SYNCHRONOUSLY immediately after React completes DOM mutations (Commit Phase), but BEFORE the browser paints the frame to the screen.
- Blocks the browser paint until its execution completes.
- Primary Purpose: Performing DOM layout measurements (getBoundingClientRect, scroll offsets) and applying immediate layout adjustments before the user sees the frame, eliminating visual layout shifts (flicker).
- Warning: Disables SSR execution (triggers Next.js hydration warning if not guarded).

2. useEffect:
- Fires ASYNCHRONOUSLY after the browser has completed painting pixels to the screen.
- Never blocks visual rendering.
- Primary Purpose: 99% of side effects (data fetching, subscriptions, event listeners, analytics).`,
    codeExample: `// useLayoutEffect: Measures and repositions before painting (zero flicker)
useLayoutEffect(() => {
  const rect = tooltipRef.current.getBoundingClientRect();
  setPosition({ top: rect.top - 40, left: rect.left });
}, []);

// useEffect: Non-blocking, runs post-paint
useEffect(() => {
  const controller = new AbortController();
  fetchData({ signal: controller.signal });
  return () => controller.abort();
}, []);`,
    trapsAndRedFlags: [
      'Danger: Putting heavy operations (network fetch or JSON parsing) inside useLayoutEffect will freeze the main thread before painting.',
      'Trick Question: Does useLayoutEffect run on the server during SSR in Next.js? Answer: No, because there is no DOM or layout tree on the server.'
    ]
  },
  {
    id: 'q7',
    question: 'How would you diagnose and optimize performance issues in a slow React app?',
    category: 'Performance & Profiling',
    seniorAnswer: `A senior engineer never begins by saying "I wrap everything in useMemo". Follow a disciplined methodology: "Measure first, optimize second".

Step 1: Measurement & Profiling
- Open React DevTools Profiler and check "Record why each component rendered".
- Identify slow rendering passes and components repeatedly re-rendering without prop or state data changes.
- Inspect Core Web Vitals: LCP (Largest Contentful Paint), INP (Interaction to Next Paint), and CLS (Cumulative Layout Shift).

Step 2: Component-Level Optimization
- State Colocation: Push state down to isolated leaf nodes so typing in a search bar does not re-render the whole page.
- Children Slot Pattern: If an outer container tracks mouse/scroll coordinates, pass the heavy inner subtree as {children} (children retain identical reference and skip re-renders).
- React.memo paired with stable props (useCallback/useMemo).

Step 3: List & Data Virtualization
- For lists exceeding 100 items, introduce DOM virtualization (TanStack Virtual or react-window).

Step 4: Concurrency & Heavy Computations
- Leverage useTransition for non-urgent state updates (large dataset filtering) to keep interaction responsive (INP < 200ms).
- Offload CPU-heavy mathematical computations to Web Workers.

Step 5: Bundle Splitting & Network
- Route-based code splitting using React.lazy / Next.js dynamic imports.
- Proper tree shaking (replacing monolithic libraries with sub-path imports like lodash-es).`,
    codeExample: `// High-impact pattern: "Lifting content via Children"
// Even when ExpensiveWrapper updates its internal coordinates, HeavyTree does not re-render
function ExpensiveWrapper({ children }: { children: React.ReactNode }) {
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  return (
    <div onMouseMove={(e) => setCoords({ x: e.clientX, y: e.clientY })}>
      <span>Mouse: {coords.x}, {coords.y}</span>
      {children} {/* HeavyTree maintains identical reference, skipped by reconciliation */}
    </div>
  );
}`,
    trapsAndRedFlags: [
      'Trap: Premature optimization. Littering components with useMemo and useCallback where children are un-memoized introduces pointless memory overhead.',
      'Ignoring heavy third-party bundle sizes (e.g., using moment.js instead of date-fns or native Intl).'
    ]
  },
  {
    id: 'q8',
    question: 'Controlled vs Uncontrolled Components: Differences, pros, cons, and when to use each?',
    category: 'Forms & DOM',
    seniorAnswer: `The difference centers on which system holds the "Single Source of Truth" for the form element's current value:

1. Controlled Component:
- React state controls the value via props (value={val} and onChange={(e) => setVal(e.target.value)}).
- Every keystroke triggers a React render cycle.
- Pros: Immediate character-level validation, live button disabling, dynamic input formatting (credit card spacing), interdependent fields.
- Cons: Causes a re-render per keystroke. In massive forms with hundreds of inputs, this can degrade performance without isolated leaf state.

2. Uncontrolled Component:
- The browser DOM retains the input value internally.
- The value is read on demand via useRef or by capturing FormData during onSubmit.
- Pros: Outstanding performance on huge forms (zero React re-renders while typing), clean integration with non-React third-party DOM widgets.
- This is the core architectural model behind React Hook Form (using ref registration) to achieve maximum performance.`,
    codeExample: `// CONTROLLED: React maintains absolute control on every render
const [query, setQuery] = useState('');
<input value={query} onChange={(e) => setQuery(e.target.value)} />

// UNCONTROLLED: DOM manages the value; React reads it on submission
const inputRef = useRef<HTMLInputElement>(null);
const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault();
  console.log(inputRef.current?.value);
};
<input ref={inputRef} defaultValue="Initial value" />`,
    trapsAndRedFlags: [
      'Common Bug: Switching an input from uncontrolled to controlled by passing value={undefined} initially and then a string. React logs: "A component is changing an uncontrolled input to be controlled". Fix: always initialize with an empty string value={value ?? ""}.'
    ]
  },
  {
    id: 'q9',
    question: 'Explain the complete lifecycle from calling `setState` to pixels rendering on screen',
    category: 'Internals & Reconciliation',
    seniorAnswer: `This is a flagship senior React question demonstrating deep mastery of Fiber architecture:

Step 1: Trigger & Schedule
setVal(next) is called. React does not update the variable synchronously. It creates an 'Update' object and enqueues it on the fiber node's updateQueue.
In React 18/19, Automatic Batching bundles multiple setState calls within the same event tick (even inside promises, timeouts, or native listeners) into a single pass.

Step 2: Scheduler Lane Evaluation
The Scheduler evaluates lane priority: Is this an urgent user interaction (typing, clicking) or a low-priority transition (startTransition)? If urgent work arrives, React can interrupt an ongoing non-urgent render pass.

Step 3: Render Phase (Reconciliation) - ASYNCHRONOUS & INTERRUPTIBLE
React traverses the workInProgress fiber tree. It executes component functions with pending states.
It compares the new Virtual DOM with current fiber nodes using heuristic O(n) diffing.
It computes mutations and tags fiber nodes with effect flags (Placement, Update, ChildDeletion). Real DOM is untouched in this phase.

Step 4: Commit Phase - SYNCHRONOUS & UNINTERRUPTIBLE
React applies the collected mutations directly to the browser DOM.
It flips the root pointer (Fiber double buffering), turning workInProgress into the current tree.

Step 5: Layout Effects
React synchronously fires useLayoutEffect hooks. Because browser paint has not occurred yet, any DOM adjustments made here prevent visual flicker.

Step 6: Browser Paint
The browser executes style recalculations, layout reflow, composite layers, and paints pixels to the screen.

Step 7: Passive Effects
Once pixels are displayed, React asynchronously fires useEffect hooks and their pending cleanup routines.`,
    codeExample: `// Batching & Asynchrony Demonstration
function CounterDemo() {
  const [count, setCount] = useState(0);

  const handleClick = () => {
    // Both reads capture count = 0 in current render scope:
    setCount(count + 1);
    console.log(count); // LOGS 0, NOT 1

    setCount(count + 1); // Does not increment by 2; still uses count = 0

    // Functional form chains operations on the fiber updateQueue:
    setCount(prev => prev + 1); // Resolves against latest queue state
  };
  return <button onClick={handleClick}>{count}</button>;
}`,
    trapsAndRedFlags: [
      'Red Flag: Stating that setState is an asynchronous function returning a Promise (await setState(...) does not exist). setState schedules a render; it is synchronous in invocation but asynchronous in rendering completion.',
      'Failing to distinguish between the Render Phase (pure, interruptible) and Commit Phase (synchronous DOM mutations).'
    ]
  },
  {
    id: 'q10',
    question: 'What is a "Stale Closure" in React and what are its 3 canonical solutions?',
    category: 'Hooks & Closures',
    seniorAnswer: `A Stale Closure occurs when a callback function (such as those passed to setInterval, setTimeout, or event listeners inside useEffect/useCallback) captures state variables or props from the render cycle in which it was instantiated, and fails to update because the dependency array omits the variable or is empty ([]).

Because JavaScript closures capture variables by reference to their original lexical scope, the callback continues executing while referencing stale, frozen values from the initial render.

Solution 1: Functional State Updates
Instead of setCount(count + 1), use setCount(prev => prev + 1). The updater receives the freshest state directly from React\'s internal queue without needing to capture it from lexical scope.

Solution 2: useRef as a Mutable Container
Store the callback or mutable value in a reference (ref.current = value). Refs preserve identity across renders and always point to the most recent mutation.

Solution 3: Comprehensive Dependencies or useEffectEvent (React 19)
Separate reactive logic (which triggers effect re-runs) from non-reactive logic that only needs to read the freshest value without triggering effect teardown.`,
    codeExample: `// ❌ BUG: count is trapped at 0; perpetually logs "Tick: 1"
useEffect(() => {
  const id = setInterval(() => {
    setCount(count + 1); // count is frozen at 0 here
  }, 1000);
  return () => clearInterval(id);
}, []); // Empty deps cause stale closure

// ✅ SOLUTION 1: Functional update (zero dependencies needed)
useEffect(() => {
  const id = setInterval(() => {
    setCount(prev => prev + 1);
  }, 1000);
  return () => clearInterval(id);
}, []);`,
    trapsAndRedFlags: [
      'Red Flag: Suppressing eslint-plugin-react-hooks/exhaustive-deps with // eslint-disable without understanding the missing dependency.',
      'Trap: Adding count to dependencies without clearing the timer causes the interval to tear down and recreate every second, degrading timer accuracy.'
    ]
  },
  {
    id: 'q11',
    question: 'How do `useTransition` and `useDeferredValue` differ and when should each be used?',
    category: 'Concurrent Performance',
    seniorAnswer: `Both hooks belong to React\'s Concurrent Mode and mark UI updates as "non-urgent" (transitions), preventing them from blocking the main thread during high-priority user interactions like typing (optimizing the INP metric):

1. useTransition:
- Used when YOU control the code that calls setState.
- Wraps state setter invocations: startTransition(() => setFilter(nextValue)).
- Provides an isPending boolean flag to render loading indicators or dimmed UI while background rendering proceeds.

2. useDeferredValue:
- Used when you DO NOT control the setter, but RECEIVE a value as a prop or from an external library.
- Takes a value and defers updating its deferred clone: const deferredQuery = useDeferredValue(query).
- React first renders the immediate value and schedules a background render pass for the deferred value.

When NOT to use them:
They do not replace debounce or throttle for network requests. useTransition and useDeferredValue optimize client-side CPU rendering (heavy Virtual DOM tree diffing), not network HTTP traffic.`,
    codeExample: `// useTransition: You own the state setter
const [isPending, startTransition] = useTransition();
function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
  setInputVal(e.target.value); // Urgent: immediate feedback
  startTransition(() => {
    setQuery(e.target.value); // Non-urgent: deferred background render
  });
}

// useDeferredValue: You consume incoming props
function FilteredList({ query }: { query: string }) {
  const deferredQuery = useDeferredValue(query);
  return <HeavyList search={deferredQuery} />;
}`,
    trapsAndRedFlags: [
      'Common Misconception: Thinking useTransition delays execution like setTimeout. React begins rendering immediately, but in an interruptible, low-priority lane.',
      'Interview Question: Why can\'t useTransition wrap a fetch call? Because startTransition only applies to synchronous in-memory state updates.'
    ]
  },
  {
    id: 'q12',
    question: 'React 19 Server Actions & `useActionState`: How do they transform mutation handling vs API Routes?',
    category: 'React 19 & Next.js',
    seniorAnswer: `In legacy client-driven workflows (React 18 / Pages Router), submitting a form required:
1. Creating a dedicated API Route endpoint (/api/create-user).
2. Manually calling e.preventDefault().
3. Managing booleans: const [loading, setLoading] = useState(false); const [error, setError] = useState(null).
4. Calling fetch('/api/...') and manually syncing state transitions.

In React 19 and Next.js App Router:
- Server Actions ('use server'): Asynchronous functions that execute securely on the server but can be invoked directly as form action attributes or client functions.
- useActionState: The canonical React 19 hook that binds the server action to form state, exposing [state, formAction, isPending] in a single idiomatic line.
- Progressive Enhancement: Forms powered by Server Actions function even before client JavaScript finishes downloading or if JavaScript is disabled.
- useOptimistic: Allows instant UI updates (0ms perceived latency) while the server action processes in the background.`,
    codeExample: `// Server Action (actions/user.ts)
'use server';
export async function updateUser(prevState: any, formData: FormData) {
  const name = formData.get('name') as string;
  if (!name) return { error: 'Name is required' };
  await db.user.update({ name });
  return { success: true };
}

// Client Component (Component.tsx)
'use client';
import { useActionState } from 'react';
import { updateUser } from './actions/user';

function UserForm() {
  const [state, formAction, isPending] = useActionState(updateUser, null);
  return (
    <form action={formAction}>
      <input name="name" />
      <button disabled={isPending}>{isPending ? 'Saving...' : 'Update'}</button>
      {state?.error && <p className="text-red-500">{state.error}</p>}
    </form>
  );
}`,
    trapsAndRedFlags: [
      'Critical Security Trap: Forgetting to authenticate and validate arguments inside Server Actions. Because they are public HTTP endpoints under the hood, any client can invoke them with arbitrary payloads.',
      'Always validate input schemas using Zod inside Server Actions.'
    ]
  },
  {
    id: 'q13',
    question: 'Why does `React.StrictMode` execute renders and effects twice in development?',
    category: 'Lifecycle & StrictMode',
    seniorAnswer: `StrictMode intentionally mounts, unmounts, and remounts components in development (Mount -> Unmount -> Mount), and invokes component render bodies twice:

Why does React do this?:
1. Detecting Missing Cleanups: If you attach an event listener or open a WebSocket without returning a cleanup function (return () => ...), the second mount reveals memory leaks by duplicating active connections.
2. Enforcing Pure, Idempotent Components: If a component mutates external variables during render, the second run surfaces corrupted state immediately.
3. Preparing for Concurrent Rendering: In concurrent rendering, React must be able to pause, discard, and restart render passes without destructive side effects.

Writing Compliant Effects:
Every side effect must be IDEMPOTENT: running it twice consecutively with its cleanup must leave the application in the exact same state as running it once.`,
    codeExample: `// ❌ BROKEN UNDER STRICTMODE (Duplicates listeners)
useEffect(() => {
  window.addEventListener('resize', handleResize);
  // Missing return () => window.removeEventListener...
}, []);

// ✅ CLEAN IDEMPOTENT EFFECT
useEffect(() => {
  const controller = new AbortController();
  fetch('/api/data', { signal: controller.signal })
    .then(r => r.json())
    .then(setData)
    .catch(err => { if (err.name !== 'AbortError') setError(err); });

  return () => controller.abort(); // Proper teardown
}, []);`,
    trapsAndRedFlags: [
      'Interview Red Flag: Saying "StrictMode is a React bug that I fixed by removing <StrictMode> from index.tsx". Removing it hides memory leaks and production bugs.',
      'Using a boolean ref (hasMounted.current) to bypass the second mount is an anti-pattern in nearly all scenarios.'
    ]
  },
  {
    id: 'q14',
    question: 'Why does passing inline functions (`onClick={() => ...}`) cause re-renders and when does it matter?',
    category: 'Performance & Diffing',
    seniorAnswer: `On every render of a parent component, an inline arrow function (() => ...) allocates a NEW FUNCTION INSTANCE in memory with a distinct referential address.

When does this actually cause an unnecessary re-render?:
ONLY when passed as a prop to a child component explicitly memoized with React.memo(Child). Because React.memo shallowly compares previous and next props using Object.is, detecting a new function reference invalidates memoization and forces the child to re-render.

When is it NOT a problem?:
1. On native HTML elements (<button onClick={() => doSomething()}>): React updates the synthetic event listener without re-creating DOM nodes.
2. On un-memoized children: If a child is not wrapped in React.memo, it re-renders whenever the parent renders regardless. Wrapping callbacks in useCallback here wastes CPU and memory.

Senior Rule: Only memoize callbacks with useCallback when:
a) Passed to expensive children wrapped in React.memo.
b) Used inside the dependency array of a downstream useEffect or custom hook.`,
    codeExample: `// Scenario where useCallback MATTERS:
const ChildMemo = React.memo(({ onAction }: { onAction: () => void }) => {
  return <HeavyComponent onClick={onAction} />;
});

function Parent() {
  const [text, setText] = useState('');
  
  // ✅ useCallback prevents ChildMemo from re-rendering whenever user types in text
  const handleAction = useCallback(() => {
    submitData();
  }, []);

  return (
    <>
      <input value={text} onChange={e => setText(e.target.value)} />
      <ChildMemo onAction={handleAction} />
    </>
  );
}`,
    trapsAndRedFlags: [
      'Over-optimization Trap: Wrapping every single function in useCallback when none of the child components are memoized.',
      'Keep in mind that React Compiler in React 19 handles referential stability automatically at build time.'
    ]
  },
  {
    id: 'q15',
    question: 'What is a "Hydration Mismatch" in SSR / Next.js, what causes it, and how do you resolve it?',
    category: 'SSR & Next.js',
    seniorAnswer: `Hydration is the process where client-side React runs in the browser and attaches event listeners to the pre-rendered HTML sent by the server.

A Hydration Mismatch occurs when the client Virtual DOM tree diverges from the server-rendered HTML. React detects the discrepancy and logs: "Text content did not match. Server: '...' Client: '...'".

Most common causes:
1. Dates and Timestamps: Rendering new Date().toLocaleTimeString() where the server uses UTC and the user\'s client uses their local timezone.
2. Browser-only APIs: Reading window.innerWidth, navigator.userAgent, or localStorage during the initial render pass.
3. Browser Extensions: Extensions (like Grammarly or Google Translate) mutating or injecting attributes into the DOM before hydration finishes.
4. Invalid HTML: Nesting a <p> inside another <p>, or a <div> inside a <p>, causing the browser parser to auto-correct the DOM structure unexpectedly.

Resolution Strategies:
- Mounted Guard Technique: Use a useState(false) flag set to true inside useEffect to render client-specific content only after mounting.
- suppressHydrationWarning: Acceptable for timestamps on specific text elements where second-level divergence is benign.
- Next.js dynamic imports with ssr: false for components that rely strictly on browser APIs.`,
    codeExample: `// Canonical solution for components relying on browser APIs:
function UserGreeting() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    // Render placeholder identical to server output
    return <span className="opacity-0">Loading...</span>;
  }

  // Safe to read localStorage or window now
  const theme = localStorage.getItem('theme');
  return <span>Active Theme: {theme}</span>;
}`,
    trapsAndRedFlags: [
      'Danger: Abusing suppressHydrationWarning on root tags (<body suppressHydrationWarning>). This masks real synchronization defects.',
      'Next.js 14+ provides clear visual console diffs showing the exact character mismatch between server and client.'
    ]
  }
];
