import { Topic } from '@/types';

export const LEVEL_3_TOPICS: Topic[] = [
  {
    id: '3.1',
    level: 3,
    levelTitle: 'Intermediate',
    title: '3.1 `useContext` and the Context API',
    summary: 'Share global data without prop drilling. The trap: ALL consumers re-render whenever the `value` reference changes.',
    whatIsIt: `The Context API allows data to pass through the component tree without manually threading props at every level.

It consists of three parts:
1. \`createContext(defaultValue)\`: Creates the context object.
2. \`<Context.Provider value={value}>\`: Wraps the subtree and provides the data.
3. \`useContext(Context)\` (or \`use(Context)\` in React 19): Hook to consume the value in any descendant component.

**The Critical Context Performance Problem**:
When the Provider's \`value\` changes (checked via \`Object.is\`), **every single component that calls \`useContext\` re-renders**, even if it only consumes an untouched property of the context value object. Context does not have built-in selector support.`,
    codeSnippet: `const ThemeContext = createContext<{ theme: 'light' | 'dark'; toggle: () => void }>({
  theme: 'light',
  toggle: () => {}
});

function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  // Optimize context value with useMemo to prevent re-renders from new object references:
  const value = useMemo(() => ({
    theme,
    toggle: () => setTheme(t => (t === 'light' ? 'dark' : 'light'))
  }), [theme]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

function ThemeButton() {
  const { theme, toggle } = useContext(ThemeContext);
  return <button onClick={toggle}>Current theme: {theme}</button>;
}`,
    interviewTips: [
      'When to use Context: for low-frequency updates (theme, locale, authenticated user). For high-frequency updates (financial tickers, live inputs, active carts), use Zustand or split context into smaller, focused contexts.',
      'Explain the context splitting pattern: a `StateContext` for the data and a `DispatchContext` for updater functions. This ensures components that only trigger actions do not re-render when state changes.'
    ],
    commonTraps: [
      'Passing an inline object literal directly to Provider value without `useMemo`: `<Context.Provider value={{ theme, toggle }}>`. This causes all consumers to re-render on EVERY parent render because `{}` is a new reference.',
      'Using Context as a replacement for Redux or Zustand in highly interactive applications.'
    ],
    keyTakeaway: 'Context is for low-frequency dependency injection. For high-frequency state updates, split contexts or use Zustand.',
    componentKey: 'ContextRerenderDemo',
    tags: ['useContext', 'context-api', 'prop-drilling', 're-renders', 'selectors']
  },
  {
    id: '3.2',
    level: 3,
    levelTitle: 'Intermediate',
    title: '3.2 `useReducer` (Local State Machine)',
    summary: 'Alternative to useState for complex state with multiple transitions. Pure `(state, action) => newState` function with stable dispatch.',
    whatIsIt: `\`useReducer\` is the preferred hook when:
- State has complex structure (nested objects or entity lists).
- The next state transition depends on complex business logic or multiple fields from previous state.
- You want to decouple update logic (the **how**) from event dispatching (the **what**).

Key characteristics:
- The reducer is a **pure function**: it must not produce side effects, trigger API calls, or mutate arguments.
- The \`dispatch\` function provided by React has a **strictly stable identity**: it never changes between renders, so it can be safely passed to memoized children without breaking \`React.memo\`.`,
    codeSnippet: `type State = { count: number; history: number[] };
type Action = { type: 'increment' } | { type: 'decrement' } | { type: 'reset' };

function counterReducer(state: State, action: Action): State {
  switch (action.type) {
    case 'increment':
      return { count: state.count + 1, history: [...state.history, state.count + 1] };
    case 'decrement':
      return { count: state.count - 1, history: [...state.history, state.count - 1] };
    case 'reset':
      return { count: 0, history: [] };
    default:
      return state;
  }
}

function ReducerCounter() {
  const [state, dispatch] = useReducer(counterReducer, { count: 0, history: [] });
  return (
    <div>
      <p>Count: {state.count}</p>
      <button onClick={() => dispatch({ type: 'increment' })}>+</button>
      <button onClick={() => dispatch({ type: 'reset' })}>Reset</button>
    </div>
  );
}`,
    interviewTips: [
      'Mention the "Mini-Redux" pattern: pairing `useReducer` with `useContext` creates a lightweight global architecture without external dependencies, perfect for prototypes or isolated modules.',
      'Highlight the stability of `dispatch`: unlike ad-hoc setState wrappers, `dispatch` never needs to be wrapped in `useCallback`.'
    ],
    commonTraps: [
      'Introducing side effects inside the reducer (fetching data or calling Date.now() / Math.random()). Reducers must be 100% deterministic and pure.',
      'Mutating state inside the reducer (`state.count++`) instead of returning a new object.'
    ],
    keyTakeaway: 'useReducer centralizes complex state transitions into pure functions and provides a referentially stable `dispatch`.',
    componentKey: 'UseReducerDemo',
    tags: ['useReducer', 'pure-functions', 'stable-dispatch', 'state-machine']
  },
  {
    id: '3.3',
    level: 3,
    levelTitle: 'Intermediate',
    title: '3.3 `useMemo`, `useCallback`, and `React.memo`',
    summary: 'The optimization trinity: useMemo for expensive calculations, useCallback for stable function references, and React.memo to skip component re-renders.',
    whatIsIt: `The fundamental trio for performance optimization in React:

1. **\`React.memo(Component)\`**:
Wraps a functional component so React skips re-rendering if its **props have not changed** (performs a shallow equality comparison on each prop).
2. **\`useCallback(fn, deps)\`**:
Returns a memoized version of the function that retains the same memory reference unless its dependencies change. Essential when passing callbacks to child components wrapped in \`React.memo\`.
3. **\`useMemo(fn, deps)\`**:
Executes the function and caches its **result**. It only recomputes the value when a dependency changes.`,
    codeSnippet: `// 1. Memoized Child Component with React.memo
interface RowProps {
  item: string;
  onDelete: (item: string) => void;
}
const MemoizedRow = React.memo(function Row({ item, onDelete }: RowProps) {
  return (
    <li className="flex justify-between p-2 border-b">
      <span>{item}</span>
      <button onClick={() => onDelete(item)}>Delete</button>
    </li>
  );
});

// 2. Parent Component preserving references
function OptimizedList({ items }: { items: string[] }) {
  // Memoized expensive calculation:
  const filteredItems = useMemo(() => {
    return items.filter(i => i.length > 3).sort();
  }, [items]);

  // Stable function reference to prevent busting MemoizedRow:
  const handleDelete = useCallback((item: string) => {
    console.log('Deleting:', item);
  }, []);

  return (
    <ul>
      {filteredItems.map(item => (
        <MemoizedRow key={item} item={item} onDelete={handleDelete} />
      ))}
    </ul>
  );
}`,
    interviewTips: [
      'Explain the symbiotic relationship: `React.memo` on a child is useless if the parent passes an inline function (`onDelete={() => ...}`) or newly created object without `useCallback`/`useMemo`, because props will always fail shallow comparison.',
      'Discuss the cost of optimization: every `useMemo`/`useCallback` hook allocates memory and runs array dependency comparisons on every render. Use them with profiling evidence, not by default everywhere.'
    ],
    commonTraps: [
      'Wrapping every handler in `useCallback` when child components are NOT memoized with `React.memo`.',
      'Omitting required dependencies from the dependency array, causing stale closure bugs.'
    ],
    keyTakeaway: 'React.memo prevents child re-renders when props match; useCallback and useMemo ensure stable referential identity for those props.',
    componentKey: 'MemoCallbackProfilerDemo',
    tags: ['useMemo', 'useCallback', 'React.memo', 'optimization', 'shallow-compare']
  },
  {
    id: '3.4',
    level: 3,
    levelTitle: 'Intermediate',
    title: '3.4 Custom Hooks',
    summary: 'Encapsulate and reuse stateful logic. Each call maintains its own isolated state instance.',
    whatIsIt: `A **Custom Hook** is a standard JavaScript function whose name starts with the **\`use\`** prefix and which can internally invoke other React hooks (\`useState\`, \`useEffect\`, \`useRef\`, etc.).

Critical conceptual rule:
- Sharing a Custom Hook **shares logic and behavior**, NOT state in memory.
- Each component that calls the hook receives an **independent and isolated instance** of any declared state variables.
- Custom hooks are the modern standard replacing Higher Order Components (HOCs) and Render Props.`,
    codeSnippet: `// Custom hook to synchronize state with LocalStorage
function useLocalStorage<T>(key: string, initialValue: T): [T, (val: T | ((prev: T) => T)) => void] {
  const [value, setValue] = useState<T>(() => {
    if (typeof window === 'undefined') return initialValue;
    try {
      const stored = localStorage.getItem(key);
      return stored ? JSON.parse(stored) : initialValue;
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.error('Error writing to localStorage:', e);
    }
  }, [key, value]);

  return [value, setValue];
}

// Usage in any component:
function ThemeSettings() {
  const [theme, setTheme] = useLocalStorage<'dark' | 'light'>('app_theme', 'light');
  return <button onClick={() => setTheme(t => t === 'light' ? 'dark' : 'light')}>Theme: {theme}</button>;
}`,
    interviewTips: [
      'Trick interview question: "If two components call the same custom hook, do they share state?" Emphatic answer: No! Each component maintains its own isolated state instance. Sharing global state requires Context or Zustand.',
      'Explain return conventions: returning a tuple `[val, setVal]` allows easy renaming on destructuring. If returning 3+ values, an object `{ data, loading, error, refetch }` is cleaner.'
    ],
    commonTraps: [
      'Not starting the function name with `use`: the linter cannot verify Rules of Hooks without the prefix.',
      'Premature abstraction: not every effect needs to be a custom hook; extract them only when logic is reused or complexity justifies decoupling.'
    ],
    keyTakeaway: 'Custom hooks share stateful algorithms, not state instances. Each invocation gets private, isolated state.',
    componentKey: 'CustomHooksPlaygroundDemo',
    tags: ['custom-hooks', 'reusability', 'useLocalStorage', 'abstraction']
  },
  {
    id: '3.5',
    level: 3,
    levelTitle: 'Intermediate',
    title: '3.5 Component Lifecycle and How Re-rendering Works',
    summary: 'The 3 triggers of a re-render and the execution pipeline: Render Phase (pure) -> Commit Phase (DOM) -> Effect Phase.',
    whatIsIt: `A functional component re-runs (re-renders) for exactly 3 reasons:
1. **Its own local state changes** (\`useState\` or \`useReducer\`).
2. **Its parent component re-renders** (by default React re-runs all descendants unless protected by \`React.memo\`).
3. **A Context it consumes changes** via \`useContext\`.

**React's 3-Phase Pipeline**:
- **Render Phase (Reconciliation)**: React executes the component function, constructs the new Virtual DOM tree, and computes diffs. This phase can be interrupted in concurrent React and **must be 100% pure** (no mutating external state).
- **Commit Phase**: React applies computed mutations to the real browser DOM synchronously.
- **Effect Phase**: Runs \`useLayoutEffect\` (synchronously before browser paint) and then \`useEffect\` (asynchronously after browser paint).`,
    codeSnippet: `function RerenderMonitor({ id }: { id: string }) {
  const [count, setCount] = useState(0);

  // 1. RENDER PHASE: This log runs on EVERY render
  console.log('[1. Render] Running component function');

  // 2. COMMIT / LAYOUT PHASE:
  useLayoutEffect(() => {
    console.log('[2. Commit Layout] DOM updated in memory, before screen paint');
  });

  // 3. PASSIVE EFFECT PHASE:
  useEffect(() => {
    console.log('[3. Passive Effect] Browser has painted pixels on screen');
  });

  return <button onClick={() => setCount(c => c + 1)}>Rerender ({count})</button>;
}`,
    interviewTips: [
      'Busted myth: "A props change causes a re-render". Explain: props changed because the parent re-rendered. The parent re-rendering is the root cause, not the props in isolation.',
      'Difference between rendering and DOM painting: a component can re-render 100 times, but if the resulting Virtual DOM is identical, React will not touch a single node in the real DOM.'
    ],
    commonTraps: [
      'Triggering side effects during the render phase (e.g. mutating a global array or initiating fetch requests directly inside the component body).',
      'Defining components nested inside another component body (`function Parent() { function Child() { ... } }`). This recreates the component definition on every render, destroying internal child state.'
    ],
    keyTakeaway: 'Re-rendering does not mean re-painting the DOM. React diffs in memory and only touches the DOM when output changes.',
    componentKey: 'LifecyclePipelineDemo',
    tags: ['lifecycle', 're-render', 'render-phase', 'commit-phase', 'purity']
  },
  {
    id: '3.6',
    level: 3,
    levelTitle: 'Intermediate',
    title: '3.6 Reconciliation and the Diffing Algorithm',
    summary: 'How React compares trees in O(n) complexity using 2 heuristics: different element types and list keys.',
    whatIsIt: `Comparing two arbitrary trees has an \`O(n³)\` general algorithmic complexity (for 1,000 elements, that would require one billion comparisons). React reduces this to **\`O(n)\`** using a heuristic diffing algorithm based on two core assumptions:

1. **Two elements of different types produce completely different trees**:
If a tag changes from \`<div>\` to \`<span>\`, or from \`<FormA />\` to \`<FormB />\`, React **completely tears down the old subtree** (unmounting components and discarding their state) and mounts the new tree from scratch.
2. **Child lists are matched using the \`key\` prop**:
Instead of matching children by sequential index, React uses the \`key\` to determine if an element simply moved position, reusing the underlying DOM node and preserving component state.`,
    codeSnippet: `// 1. Subtree teardown due to element type change:
// Changing container from <div> to <section> unmounts <Form> and wipes input values:
{isSection ? (
  <section><Form /></section>
) : (
  <div><Form /></div>
)}

// 2. Deliberate state reset via key change:
// Changing the key forces React to reset component state cleanly:
<EditForm key={selectedUser.id} user={selectedUser} />`,
    interviewTips: [
      'Highlight the professional "Key reset" pattern: changing a component\'s `key` forces React to unmount and remount it with initial state. This is the cleanest declarative way to reset complex forms without writing reset effects.',
      'Explain how React handles prop updates: if the element type remains unchanged (e.g. `<div className="red" />` changes to `<div className="blue" />`), React preserves the DOM node and updates only modified attributes.'
    ],
    commonTraps: [
      'Conditionally swapping wrapper element tags (`{isModal ? <div className="modal"><Content /></div> : <Content />}`), causing accidental state loss when toggling.',
      'Generating unstable dynamic keys in lists.'
    ],
    keyTakeaway: 'Different element types tear down the subtree; stable keys preserve element identity across renders.',
    componentKey: 'DiffingHeuristicsDemo',
    tags: ['reconciliation', 'diffing', 'O(n)', 'key-reset', 'heuristics']
  },
  {
    id: '3.7',
    level: 3,
    levelTitle: 'Intermediate',
    title: '3.7 Data Fetching (Loading, Error, and Race Conditions)',
    summary: 'Managing asynchronous state with useEffect. Mandatory prevention of race conditions using AbortController.',
    whatIsIt: `Fetching data client-side with \`useEffect\` requires managing 3 essential states:
- \`data\`: Processed response payload from the API.
- \`isLoading\`: Visual loading indicator.
- \`error\`: Network failures or HTTP status >= 400.

**The Danger of Race Conditions**:
If a user quickly clicks "User 1" and then "User 2", two concurrent requests are dispatched. If "User 1" takes 2 seconds and "User 2" takes 200ms, the slower response for "User 1" will arrive **last and overwrite the UI**, displaying stale data.
**Solution**: Abort previous requests in the effect cleanup function using **\`AbortController\`** or a boolean flag.`,
    codeSnippet: `function UserProfile({ userId }: { userId: string }) {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError(null);

    fetch(\`/api/users/\${userId}\`, { signal: controller.signal })
      .then(res => {
        if (!res.ok) throw new Error('Request error: ' + res.status);
        return res.json();
      })
      .then(data => {
        setUser(data);
        setLoading(false);
      })
      .catch(err => {
        // Ignore intentional abort errors
        if (err.name !== 'AbortError') {
          setError(err.message);
          setLoading(false);
        }
      });

    // Cleanup: aborts request if userId changes before response arrives
    return () => controller.abort();
  }, [userId]);

  if (loading) return <p>Loading profile...</p>;
  if (error) return <p className="text-red-500">Error: {error}</p>;
  return <div>{user?.name}</div>;
}`,
    interviewTips: [
      'Differentiate client fetching in useEffect from modern data libraries: explain why production apps use TanStack Query, SWR, or Next.js Server Components (built-in caching, background revalidation, deduplication, and automatic request cancellation).',
      'Explain `fetch` behavior in JavaScript: `fetch` DOES NOT reject promises on 404 or 500 HTTP status codes; you must explicitly verify `if (!res.ok)`.'
    ],
    commonTraps: [
      'Not handling `err.name === "AbortError"`, displaying false error banners to users when a request was aborted intentionally.',
      'Omitting AbortController cleanup, exposing the application to visual race condition bugs.'
    ],
    keyTakeaway: 'Use AbortController in useEffect cleanup to prevent slow network responses from overwriting newer data.',
    componentKey: 'DataFetchingRaceDemo',
    tags: ['data-fetching', 'race-conditions', 'AbortController', 'error-handling']
  },
  {
    id: '3.8',
    level: 3,
    levelTitle: 'Intermediate',
    title: '3.8 Routing in React (React Router and Modern Models)',
    summary: 'Nested routes with Outlet, programmatic navigation, URL parameters, and authenticated route protection.',
    whatIsIt: `Routing in Single Page Applications (SPAs) simulates traditional navigation by intercepting browser history using the \`History\` API (\`pushState\`, \`replaceState\`) without full page reloads.

Core concepts:
- **Nested Routes**: The URL structure maps directly to layout hierarchies. Parent layouts render an **\`<Outlet />\`** where child route components are injected.
- **Dynamic Parameters (\`useParams\`)**: Extract route segments like \`/users/:id\`.
- **Programmatic Navigation (\`useNavigate\` in React Router / \`useRouter\` in Next.js)**: Code-driven redirects after actions or form submissions.
- **Protected Routes**: Wrapper components that verify authentication status before rendering children, redirecting unauthenticated users to \`/login\`.`,
    codeSnippet: `// Protected Route Pattern
function ProtectedRoute({ children, isAuthenticated }: { children: React.ReactNode; isAuthenticated: boolean }) {
  if (!isAuthenticated) {
    // React Router: return <Navigate to="/login" replace />;
    // Next.js: redirect('/login');
    return <p className="text-amber-500">Unauthorized. Redirecting to login...</p>;
  }
  return <>{children}</>;
}

// Layout with Nested Outlet
function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <aside className="w-64 border-r p-4">Sidebar Navigation</aside>
      <main className="flex-1 p-6">{children /* or <Outlet /> */}</main>
    </div>
  );
}`,
    interviewTips: [
      'Contrast library-based routing (React Router v6/v7) with file-system routing (Next.js App Router): Next.js eliminates router configuration boilerplate and unlocks streaming and Server Components per route segment.',
      'Highlight UX best practices for redirects: pass the previous location as a query param (`/login?redirect=/admin`) to send users back to their intended destination after logging in.'
    ],
    commonTraps: [
      'Assuming client-side route guards provide actual security. Client JS can always be inspected or modified; real security must be enforced by backend APIs and Server Actions.',
      'Using regular `<a href="...">` anchor tags instead of `<Link>`, causing full page reloads that dump in-memory SPA state.'
    ],
    keyTakeaway: 'Modern routing is built on nested routes with persistent layouts and client-side transitions without reloads.',
    componentKey: 'RouterSimulatorDemo',
    tags: ['routing', 'react-router', 'outlet', 'protected-routes', 'spa']
  },
  {
    id: '3.9',
    level: 3,
    levelTitle: 'Intermediate',
    title: '3.9 Error Boundaries',
    summary: 'Catch rendering exceptions within child component trees and display fallback UI without crashing the whole app.',
    whatIsIt: `An **Error Boundary** is a React component that catches JavaScript errors anywhere in its child component tree during:
- The render phase.
- Lifecycle methods.
- Class constructors.

It renders a fallback UI instead of crashing the entire application into a blank white screen.
**Historical requirement**: It must be a **class component** because it uses lifecycle methods \`static getDerivedStateFromError()\` and \`componentDidCatch()\`. Modern applications typically use the \`react-error-boundary\` library or the native \`error.tsx\` convention in Next.js App Router.

**What Error Boundaries DO NOT catch**:
- Errors in event handlers (\`onClick\`).
- Asynchronous code (\`setTimeout\`, \`fetch\` promises).
- Server-Side Rendering (SSR).`,
    codeSnippet: `// Class Error Boundary Component
class ErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback?: React.ReactNode },
  { hasError: boolean; error: Error | null }
> {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error) {
    // Update state so next render displays fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log error to telemetry service (Sentry, Datadog)
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="p-4 border border-red-500 bg-red-50 rounded text-red-700">
          <h4>Something went wrong in this section</h4>
          <button onClick={() => this.setState({ hasError: false, error: null })}>Retry</button>
        </div>
      );
    }
    return this.props.children;
  }
}`,
    interviewTips: [
      'Classic interview question: "Why don\'t Error Boundaries catch errors inside `onClick`?". Answer: Because event handlers run outside React\'s render phase. Catching errors in handlers requires standard `try / catch` blocks.',
      'Mention how Next.js App Router integrates error handling: conventional `error.tsx` files automatically wrap route segments in React Error Boundaries with a built-in `reset()` function.'
    ],
    commonTraps: [
      'Placing a single Error Boundary at the root of the app: if a secondary widget fails, the entire screen is replaced with an error message. Use granular boundaries around independent features.',
      'Trying to write a pure functional Error Boundary with hooks (React does not provide a native `useErrorBoundary` hook for catching render exceptions).'
    ],
    keyTakeaway: 'Error Boundaries isolate render errors without crashing the whole application. They do not catch handler or async errors.',
    componentKey: 'ErrorBoundaryDemo',
    tags: ['error-boundaries', 'resilience', 'fallbacks', 'sentry', 'lifecycle']
  },
  {
    id: '3.10',
    level: 3,
    levelTitle: 'Intermediate',
    title: '3.10 Portals (`createPortal`)',
    summary: 'Render child elements into a different DOM node while keeping the React event bubble and context tree intact.',
    whatIsIt: `\`createPortal(children, domNode)\` lets you render JSX into a DOM node located outside the parent component's DOM hierarchy (such as directly appending to \`document.body\`).

Essential use cases:
- Modals and dialog overlays.
- Dropdown menus, popovers, and context menus.
- Floating tooltips and toast notifications.
Avoids CSS clipping issues caused by parent containers with \`overflow: hidden\`, \`position: relative\`, or conflicting \`z-index\` stacking contexts.

**The Superpower of Portals (Event Bubbling)**:
Even though the DOM node lives elsewhere in the HTML tree, it **remains a standard child in the React component tree**. Therefore:
- Events (like clicks) bubble up through the React tree, not the physical DOM tree.
- It retains access to all Context Providers wrapping the parent component.`,
    codeSnippet: `import { createPortal } from 'react-dom';

function ModalPortal({ isOpen, onClose, children }: { isOpen: boolean; onClose: () => void; children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!isOpen || !mounted) return null;

  // Render into document.body to escape parent container overflow constraints
  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-card border p-6 rounded-2xl shadow-2xl max-w-md w-full m-4"
        onClick={e => e.stopPropagation()} // Prevents closing modal when clicking its content
      >
        {children}
      </div>
    </div>,
    document.body
  );
}`,
    interviewTips: [
      'Explain safe hydration in Next.js / SSR: because `document` is undefined during server rendering, Portals must wait until mounted on the client (`if (!mounted) return null;` after `useEffect`) to prevent hydration mismatches.',
      'Highlight that React event bubbling crosses portals: clicking inside a portal mounted on `body` will still be caught by an `onClick` on its parent in the React tree.'
    ],
    commonTraps: [
      'Accessing `document.body` directly during SSR render execution, causing `ReferenceError: document is not defined`.',
      'Forgetting `e.stopPropagation()` inside the modal dialog container, causing clicks inside the dialog to trigger backdrop close handlers.'
    ],
    keyTakeaway: 'createPortal renders HTML into any DOM node while preserving React event bubbling and context hierarchies.',
    componentKey: 'PortalModalDemo',
    tags: ['portals', 'createPortal', 'modals', 'z-index', 'event-bubbling']
  },
  {
    id: '3.11',
    level: 3,
    levelTitle: 'Intermediate',
    title: '3.11 `forwardRef` and `useImperativeHandle`',
    summary: 'Pass refs to child components and expose custom imperative methods to parents (simplified in React 19).',
    whatIsIt: `By default, functional components cannot receive a \`ref\` prop directly.

- **\`forwardRef\`**: A higher-order function allowing a component to accept a \`ref\` and pass it down to an internal DOM node.
- **\`useImperativeHandle(ref, createHandle, [deps])\`**: Customizes the instance value exposed via the \`ref\`. Instead of exposing the raw native DOM node, you expose a clean imperative API with specific methods (\`focus()\`, \`scrollIntoView()\`, \`reset()\`).

**React 19 Revolution**:
In React 19, **\`ref\` is a standard prop just like any other** (\`<MyInput ref={myRef} />\`). \`forwardRef\` is officially deprecated in favor of accepting \`ref\` directly in component arguments.`,
    codeSnippet: `// React 18 pattern with forwardRef and useImperativeHandle:
export interface ImperativeInputRef {
  focus: () => void;
  clear: () => void;
}

const TextInput = forwardRef<ImperativeInputRef, { placeholder: string }>((props, ref) => {
  const domInputRef = useRef<HTMLInputElement>(null);

  // Expose only intentional methods to the parent:
  useImperativeHandle(ref, () => ({
    focus: () => domInputRef.current?.focus(),
    clear: () => {
      if (domInputRef.current) domInputRef.current.value = '';
    }
  }));

  return <input ref={domInputRef} placeholder={props.placeholder} className="input" />;
});

// In React 19, forwardRef is no longer needed:
// function TextInput({ ref, placeholder }: { ref?: React.Ref<ImperativeInputRef>; placeholder: string }) { ... }`,
    interviewTips: [
      'Mention encapsulation: `useImperativeHandle` is great for component libraries because it prevents leaking raw DOM elements to consumers, preserving a clean and restricted API contract.',
      'Highlight the React 19 improvement: treating `ref` as a regular prop eliminates `forwardRef` boilerplate and simplifies TypeScript typings.'
    ],
    commonTraps: [
      'Overusing imperative method calls (`ref.current.doSomething()`) for interactions that should be handled declaratively using props and state.',
      'Forgetting that in React 18, passing `ref` to a functional component without `forwardRef` produces a console warning and evaluates to undefined.'
    ],
    keyTakeaway: 'useImperativeHandle exposes a custom imperative API. In React 19, ref becomes a standard component prop.',
    componentKey: 'ForwardRefImperativeDemo',
    tags: ['forwardRef', 'useImperativeHandle', 'react-19-ref', 'encapsulation']
  },
  {
    id: '3.12',
    level: 3,
    levelTitle: 'Intermediate',
    title: '3.12 Advanced Composition Patterns',
    summary: 'Render Props, Compound Components, and the Container/Presentational pattern for building highly reusable components.',
    whatIsIt: `Over React's history, several architectural design patterns have become industry standards:

1. **Compound Components**:
Components that work together as a cohesive unit sharing implicit state via internal context (modeled after native HTML \`<select>\` and \`<option>\`). Examples: Tabs, Accordions, Dropdown Menus (seen in Radix UI / shadcn/ui).
2. **Render Props**:
A technique where a prop receives a function that returns React elements (\`<Mouse render={({ x, y }) => <p>{x}, {y}</p>} />\`). Largely superseded by Custom Hooks, but still present in virtualization and form libraries.
3. **Container / Presentational Pattern**:
Separating data fetching and business logic (Container) from pure UI rendering driven solely by props (Presentational).`,
    codeSnippet: `// Compound Components pattern for an Accordion
const AccordionContext = createContext<{
  openId: string | null;
  toggle: (id: string) => void;
}>({ openId: null, toggle: () => {} });

function Accordion({ children }: { children: React.ReactNode }) {
  const [openId, setOpenId] = useState<string | null>(null);
  const toggle = (id: string) => setOpenId(cur => (cur === id ? null : id));
  return (
    <AccordionContext.Provider value={{ openId, toggle }}>
      <div className="border rounded-xl divide-y">{children}</div>
    </AccordionContext.Provider>
  );
}

function AccordionItem({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  const { openId, toggle } = useContext(AccordionContext);
  const isOpen = openId === id;
  return (
    <div>
      <button onClick={() => toggle(id)} className="w-full text-left p-4 font-medium flex justify-between">
        {title} <span>{isOpen ? '▲' : '▼'}</span>
      </button>
      {isOpen && <div className="p-4 bg-muted/20 border-t">{children}</div>}
    </div>
  );
}
Accordion.Item = AccordionItem;`,
    interviewTips: [
      'Explain why Compound Components are the standard in modern UI libraries (Radix UI, Headless UI, Ark UI): they give consumers complete control over markup structure without requiring dozens of complex configuration props.',
      'Explain how Custom Hooks replaced 90% of HOCs and Render Props use cases, eliminating "Wrapper Hell" (deeply nested container hierarchies).'
    ],
    commonTraps: [
      'Trying to share logic using HOCs in new codebases when Custom Hooks are simpler and easier to type.',
      'Creating inflexible monolithic components configured via complex configuration arrays rather than declarative composition.'
    ],
    keyTakeaway: 'Compound components offer maximum markup flexibility by sharing implicit state via internal Context.',
    componentKey: 'CompositionPatternsDemo',
    tags: ['compound-components', 'render-props', 'container-presentational', 'radix-ui']
  },
  {
    id: '3.13',
    level: 3,
    levelTitle: 'Intermediate',
    title: '3.13 List Virtualization (Windowing)',
    summary: 'Render thousands of items efficiently by calculating only the visible viewport window (react-window / TanStack Virtual).',
    whatIsIt: `Rendering 10,000 items in a standard list degrades browser performance:
- Creates tens of thousands of DOM nodes in memory.
- Blocks the main thread during style recalculations and layout (reflow).
- Consumes hundreds of megabytes of RAM.

**The Virtualization (Windowing) Technique**:
Only renders **items currently visible within the scrollable viewport**, plus a small buffer (overscan) above and below for smooth scrolling.
As the user scrolls:
- Off-screen items are unmounted or recycled.
- Newly visible items are positioned using \`transform: translateY(...)\` or absolute positioning.
The DOM only holds 15 to 20 active nodes at any time, even if the dataset has 100,000 items.`,
    codeSnippet: `// Conceptual virtualization demo:
function VirtualListDemo({ items, itemHeight = 40, containerHeight = 300 }: { items: string[]; itemHeight?: number; containerHeight?: number }) {
  const [scrollTop, setScrollTop] = useState(0);

  const totalHeight = items.length * itemHeight;
  const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - 2); // overscan top
  const endIndex = Math.min(items.length, Math.ceil((scrollTop + containerHeight) / itemHeight) + 2); // overscan bottom

  const visibleItems = items.slice(startIndex, endIndex);

  return (
    <div
      style={{ height: containerHeight, overflowY: 'auto', position: 'relative' }}
      onScroll={e => setScrollTop(e.currentTarget.scrollTop)}
      className="border rounded-lg bg-card"
    >
      {/* Phantom container providing full scrollbar height */}
      <div style={{ height: totalHeight, position: 'relative' }}>
        {visibleItems.map((item, index) => {
          const itemIndex = startIndex + index;
          return (
            <div
              key={itemIndex}
              style={{
                position: 'absolute',
                top: itemIndex * itemHeight,
                height: itemHeight,
                width: '100%'
              }}
              className="p-2 border-b flex items-center"
            >
              Item #{itemIndex + 1}: {item}
            </div>
          );
        })}
      </div>
    </div>
  );
}`,
    interviewTips: [
      'Mention ecosystem libraries: `react-window` (by Brian Vaughn) and `@tanstack/react-virtual` (headless, supports dynamic item sizes and multi-axis scrolling).',
      'Discuss trade-offs: virtualization breaks browser native `Ctrl+F` in-page search for off-screen items and requires careful ARIA roles for screen reader accessibility.'
    ],
    commonTraps: [
      'Rendering thousands of records without pagination or virtualization expecting the browser to handle it.',
      'Failing to define a fixed height on the scroll container or items, leading to broken scroll calculations.'
    ],
    keyTakeaway: 'Virtualization keeps only viewport-visible nodes in the DOM, rendering 100k+ items smoothly at 60 FPS.',
    componentKey: 'VirtualizationDemo',
    tags: ['virtualization', 'windowing', 'react-window', 'tanstack-virtual', 'performance']
  }
];
