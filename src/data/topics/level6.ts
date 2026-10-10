import { Topic } from '@/types';

export const LEVEL_6_TOPICS: Topic[] = [
  {
    id: '6.1',
    level: 6,
    levelTitle: 'Modern React (18 & 19)',
    title: '6.1 Concurrent Rendering',
    summary: 'React can pause, interrupt, and discard renders in progress to prioritize urgent user interactions.',
    whatIsIt: `Before React 18, rendering was a monolithic, synchronous, and blocking operation: once React started rendering a component tree, nothing could stop it until it completed. If the tree took 200ms to render, the screen remained frozen for 200ms.

**The Concurrent Model (enabled with \`createRoot\`)**:
Allows React to work on multiple versions of the UI simultaneously behind the scenes.
- **Interruptibility**: If the user types a key into an input while React is busy rendering a list of 5,000 items, React **pauses rendering the list**, immediately handles the keystroke event to paint the character on screen, and then resumes or recomputes the list.
- **Discarding stale work**: If user input invalidates the search query that was currently being computed, React abandons the in-progress render without ever committing it to the DOM.`,
    codeSnippet: `// Enabling concurrent mode (standard since React 18):
import { createRoot } from 'react-dom/client';

const container = document.getElementById('root');
const root = createRoot(container!); // Enables Concurrent Features
root.render(<App />);

// In Next.js App Router, concurrent rendering and Server Components are enabled natively.`,
    interviewTips: [
      'Distinguish between Concurrency and Multi-threading: React still runs on the browser’s single JavaScript thread. Concurrency is achieved by slicing work into time slots (Time-Slicing) coordinated by the React Scheduler.',
      'Explain the phone call analogy: "Concurrency is like putting a call on hold to handle an urgent matter and then resuming the conversation, rather than forcing the caller to wait 10 minutes".'
    ],
    commonTraps: [
      'Assuming `createRoot` makes all code automatically faster: it does not increase raw CPU speed, but rather reorganizes work priorities so the UI feels instantaneous to the user.',
      'Writing impure render functions with side effects (global mutations): in concurrent mode, React may invoke a render multiple times before committing, so impure functions introduce race conditions and inconsistencies.'
    ],
    keyTakeaway: 'Concurrent React prioritizes urgent events (typing, clicks) over background work by pausing in-progress renders.',
    componentKey: 'ConcurrentRenderingDemo',
    tags: ['concurrency', 'createRoot', 'time-slicing', 'scheduler', 'react-18']
  },
  {
    id: '6.2',
    level: 6,
    levelTitle: 'Modern React (18 & 19)',
    title: '6.2 Automatic Batching',
    summary: 'React 18/19 batches all setState calls into a single re-render, even inside promises, timeouts, and native event handlers.',
    whatIsIt: `**Batching** is the mechanism where React combines multiple state updates into a single re-render pass to prevent unnecessary repaints.

- **React 17 and earlier**: Batching only worked inside React synthetic event handlers (\`onClick\`, \`onChange\`). Updating two states inside a \`fetch().then()\`, \`setTimeout\`, or native event listener triggered **two independent re-renders**.
- **React 18 and 19 (Automatic Batching)**: **ALL state updates are automatically batched**, regardless of where they originate (promises, timers, native callbacks).

What if you need to force an immediate synchronous render?
React provides the escape hatch **\`flushSync(() => { ... })\`**, though it should be used sparingly.`,
    codeSnippet: `function BatchingDemo() {
  const [count, setCount] = useState(0);
  const [active, setActive] = useState(false);
  const [renders, setRenders] = useState(0);

  // Each render increments the metric
  console.log('[Render] Component evaluated');

  const handleAsyncClick = () => {
    setTimeout(() => {
      // In React 17: triggered 2 separate re-renders
      // In React 18/19: triggers EXACTLY 1 batched re-render!
      setCount(c => c + 1);
      setActive(a => !a);
    }, 100);
  };

  return <button onClick={handleAsyncClick}>Run with Batching</button>;
}`,
    interviewTips: [
      'Technical interview question: "What does flushSync do?". Answer: It is a React DOM API that forces React to immediately flush pending updates and apply changes to the DOM synchronously. It is rarely needed, but useful for tasks like focusing an input or measuring an element immediately after forcing its insertion.',
      'Explain the performance impact: Automatic Batching delivered free performance improvements to large applications upon upgrading to React 18 without requiring a single line of code change.'
    ],
    commonTraps: [
      'Overusing `flushSync`: severely degrades performance and disables the advantages of concurrent rendering.',
      'Assuming local variables update synchronously after calling state setters.'
    ],
    keyTakeaway: 'React 18 batches all state updates into a single re-render, whether inside promises, timeouts, or native events.',
    componentKey: 'AutomaticBatchingDemo',
    tags: ['automatic-batching', 'flushSync', 'promises', 'react-18', 'state-batching']
  },
  {
    id: '6.3',
    level: 6,
    levelTitle: 'Modern React (18 & 19)',
    title: '6.3 `useTransition` and `useDeferredValue`',
    summary: 'Mark non-urgent updates as interruptible transitions. Keep typing at 60 FPS while heavy lists compute in the background.',
    whatIsIt: `Two essential hooks for keeping the UI responsive during demanding computations:

1. **\`useTransition()\`**:
- Returns \`[isPending, startTransition]\`.
- Wraps a \`setState\` call to mark it as a **low-priority (non-urgent) transition**.
- Urgent state (e.g., typing in an input) updates immediately; heavy state (e.g., filtering 20,000 records) processes concurrently and yields immediately if the user types another key.
- \`isPending\` is a reactive boolean that allows displaying a spinner or dimming opacity while the transition completes.

2. **\`useDeferredValue(value)\`**:
- Defers updating a **value** passed into it (such as a prop).
- React renders with the previous value first and updates to the new value in the background as soon as the main thread is idle.`,
    codeSnippet: `function TransitionSearch({ items }: { items: string[] }) {
  const [query, setQuery] = useState('');
  const [filteredItems, setFilteredItems] = useState(items);
  const [isPending, startTransition] = useTransition();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const text = e.target.value;
    // 1. Urgent: Input updates instantaneously on screen
    setQuery(text);

    // 2. Non-urgent: Heavy filtering can take time without freezing keystrokes
    startTransition(() => {
      const filtered = items.filter(item => item.toLowerCase().includes(text.toLowerCase()));
      setFilteredItems(filtered);
    });
  };

  return (
    <div>
      <input value={query} onChange={handleChange} placeholder="Search..." />
      {isPending && <span className="text-blue-500">Filtering concurrently...</span>}
      <div className={isPending ? 'opacity-50 transition-opacity' : ''}>
        <ItemList items={filteredItems} />
      </div>
    </div>
  );
}`,
    interviewTips: [
      'Key difference between useTransition and useDeferredValue: use `useTransition` when you have direct access to the state setter (`setState`). Use `useDeferredValue` when you receive the processed value as a prop or when state originates from a parent component or third-party library.',
      'Compare useTransition with Debounce: Debounce delays execution using an arbitrary timer (e.g., 300ms). useTransition starts work immediately at low priority and only yields control if a higher-priority event occurs, delivering results as quickly as the device allows.'
    ],
    commonTraps: [
      'Wrapping the text input state update itself inside `startTransition`. Doing so introduces perceived lag into the input as the user types.',
      'Passing unsupported async functions inside startTransition in React 18 (React 19 now officially supports async functions in startTransition).'
    ],
    keyTakeaway: 'useTransition maintains smooth keystrokes by demoting heavy computations and filters to interruptible transitions.',
    componentKey: 'UseTransitionDemo',
    tags: ['useTransition', 'useDeferredValue', 'isPending', 'INP', 'concurrency']
  },
  {
    id: '6.4',
    level: 6,
    levelTitle: 'Modern React (18 & 19)',
    title: '6.4 `useId`, `useSyncExternalStore`, and `useInsertionEffect`',
    summary: 'Specialized hooks: unique deterministic SSR IDs, tearing-free external store subscriptions, and CSS injection.',
    whatIsIt: `Advanced hooks introduced in React 18 to address specific architectural requirements:

1. **\`useId()\`**:
Generates unique, deterministic IDs that match **identically between server and client**, eliminating **Hydration Mismatch** errors when linking accessible elements (\`<label htmlFor={id}>\` with \`<input id={id}>\`).

2. **\`useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)\`**:
The definitive hook for subscribing to stores outside of React (Redux, Zustand, browser APIs like \`navigator.onLine\`, \`window.innerWidth\`).
Guarantees synchronous reads that prevent **Visual Tearing** (when concurrent renders display inconsistent data in different parts of the screen).

3. **\`useInsertionEffect()\`**:
Designed specifically for CSS-in-JS library authors (like styled-components). Executes before DOM layout measurements are read, ensuring \`<style>\` tags are injected in time.`,
    codeSnippet: `// 1. useId for accessible forms with guaranteed SSR consistency:
function FormField({ label }: { label: string }) {
  const id = useId();
  return (
    <div>
      <label htmlFor={id}>{label}</label>
      <input id={id} />
    </div>
  );
}

// 2. useSyncExternalStore to subscribe to browser online status:
function useOnlineStatus() {
  return useSyncExternalStore(
    (callback) => {
      window.addEventListener('online', callback);
      window.addEventListener('offline', callback);
      return () => {
        window.removeEventListener('online', callback);
        window.removeEventListener('offline', callback);
      };
    },
    () => navigator.onLine, // Client snapshot
    () => true              // Server snapshot (SSR)
  );
}`,
    interviewTips: [
      'What is "Tearing" and why was useSyncExternalStore created?: In concurrent rendering, React can pause in the middle of a render. If a mutable external store updates while React is paused, the top half of the UI could render the new value while the bottom renders the old value. useSyncExternalStore prevents this by enforcing atomic synchronous reads.',
      'Never use `useId` to generate keys for mapped lists (`items.map(item => <li key={useId()} />)`); list keys must always be derived from item data.'
    ],
    commonTraps: [
      'Generating IDs with `Math.random()` during render: produces different strings on server vs client, triggering an immediate hydration mismatch.',
      'Returning a new object/array reference from `getSnapshot()` on every call: causes infinite re-render loops.'
    ],
    keyTakeaway: 'useId guarantees accessible IDs across SSR and client; useSyncExternalStore safely binds external stores without tearing.',
    componentKey: 'UseIdAndExternalStoreDemo',
    tags: ['useId', 'useSyncExternalStore', 'tearing', 'hydration', 'react-18']
  },
  {
    id: '6.5',
    level: 6,
    levelTitle: 'Modern React (18 & 19)',
    title: '6.5 Suspense for Data Fetching',
    summary: 'Declarative loading states coordinated across UI regions while async components await promises or resources.',
    whatIsIt: `Traditionally, components individually handled \`if (loading) return <Spinner />\`. This led to nested loading cascades ("spinner hell") and uncoordinated page pops.

**Suspense for Data Fetching**:
Allows a child component to "suspend" (throw a promise that React catches) while awaiting data.
- \`<Suspense fallback={<Skeleton />}>\` wraps the designated UI boundary.
- While any child inside the boundary awaits unresolved promises or data, React renders the fallback UI.
- In React 19 and Next.js App Router, Suspense integrates natively with the **\`use(promise)\`** hook and React Server Components (RSC).`,
    codeSnippet: `// In React 19 with the 'use' hook:
import { Suspense, use } from 'react';

function UserProfile({ userPromise }: { userPromise: Promise<{ name: string }> }) {
  // The 'use' hook suspends the component until the promise resolves:
  const user = use(userPromise);
  return <h2>Welcome, {user.name}</h2>;
}

function HomePage() {
  const promise = fetch('/api/user').then(r => r.json());

  return (
    <Suspense fallback={<div className="h-12 w-48 bg-muted animate-pulse rounded" />}>
      <UserProfile userPromise={promise} />
    </Suspense>
  );
}`,
    interviewTips: [
      'Explain how Suspense decouples loading UI from business logic: child components render assuming data is already resolved. The parent component declaratively determines where and how loading spinners/skeletons are displayed.',
      'Contrast "Fetch-on-render" (waterfalls with useEffect) with "Render-as-you-fetch" (Suspense): with Suspense, data fetching initiates before or in parallel with rendering, eliminating network waterfalls.'
    ],
    commonTraps: [
      'Creating new promises inside the render function body without memoization, causing infinite suspension loops.',
      'Omitting granular Suspense boundaries, allowing a slow non-critical component to block the entire page.'
    ],
    keyTakeaway: 'Suspense coordinates async loading states declaratively across cohesive UI boundaries.',
    componentKey: 'SuspenseDataDemo',
    tags: ['suspense', 'data-fetching', 'use-hook', 'skeletons', 'fallbacks']
  },
  {
    id: '6.6',
    level: 6,
    levelTitle: 'Modern React (18 & 19)',
    title: '6.6 Streaming SSR (Server-Side Streaming)',
    summary: 'The server streams HTML in progressive chunks over HTTP Streams, dramatically improving TTFB and First Contentful Paint.',
    whatIsIt: `In traditional Server-Side Rendering, the server had to wait for **all database queries and data across the entire page to complete** before sending a single byte of HTML. If a secondary section took 3 seconds, the entire page experienced a 3-second delay (**high TTFB**).

**Streaming SSR**:
React breaks page HTML into chunks and streams them to the browser as they become ready:
1. The server immediately streams the initial HTML shell (Navbar, Layout, Suspense fallbacks).
2. The user sees the page layout almost instantaneously (**minimal TTFB and FCP**).
3. As slow backend queries resolve, React streams additional HTML chunks containing inline scripts that replace loading skeletons with final content.
4. **Selective Hydration**: React prioritizes hydrating components that the user attempts to interact with first.`,
    codeSnippet: `// Streaming conceptual flow in Next.js App Router:
// app/dashboard/page.tsx
import { Suspense } from 'react';

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* 1. Header sent immediately in the first streamed HTML chunk */}
      <h1>Metrics Dashboard</h1>

      {/* 2. Skeleton rendered immediately while database query executes on the server */}
      <Suspense fallback={<p className="animate-pulse">Querying database...</p>}>
        <SlowServerMetrics />
      </Suspense>
    </div>
  );
}

// Async Server Component taking 2 seconds:
async function SlowServerMetrics() {
  await new Promise(r => setTimeout(r, 2000)); // Simulated slow DB query
  return <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">Server data loaded</div>;
}`,
    interviewTips: [
      'Explain Selective Hydration: if a page has multiple Suspense boundaries streaming in, React does not wait for all HTML to arrive before hydrating. If a user clicks on block B before block A finishes hydrating, React reprioritizes and hydrates block B immediately to respond to the click.',
      'Mention the underlying transport: Streaming SSR relies on standard HTTP/1.1 `Transfer-Encoding: chunked` and continuous HTTP/2 streams.'
    ],
    commonTraps: [
      'Confusing Streaming SSR with WebSockets or Server-Sent Events (SSE): Streaming SSR is a standard HTTP response that remains open until all HTML chunks are transmitted.',
      'Attempting to use browser-dependent DOM APIs inside server components.'
    ],
    keyTakeaway: 'Streaming SSR transmits HTML progressively, delivering an instant shell while slower data chunks stream in.',
    componentKey: 'StreamingSsrDemo',
    tags: ['streaming-ssr', 'ttfb', 'selective-hydration', 'nextjs', 'rsc']
  },
  {
    id: '6.7',
    level: 6,
    levelTitle: 'Modern React (18 & 19)',
    title: '6.7 React Server Components (RSC) & `"use client"`',
    summary: "React's architectural paradigm shift: components that execute exclusively on the server and ship ZERO kilobytes of JS to the client.",
    whatIsIt: `React Server Components (RSC) represent the biggest architectural shift since the introduction of hooks:

1. **Server Components (Default in Next.js App Router)**:
- Execute **exclusively on the server** (or at build time).
- Can be asynchronous functions (\`async / await\`).
- Enjoy direct access to databases, filesystems, and secret environment variables without needing intermediate REST API endpoints.
- **Their JavaScript is never bundled or sent to the browser**, drastically reducing client bundle size.
- Constraints: Cannot use state (\`useState\`), effects (\`useEffect\`), event handlers (\`onClick\`), or browser APIs.

2. **Client Components (\`"use client"\`)**:
- Pre-rendered on the server for initial HTML and **hydrated interactively in the browser**.
- Marked with the \`"use client"\` directive at the top of the file.
- Support state, effects, event listeners, and browser APIs.`,
    codeSnippet: `// app/products/page.tsx (Server Component by default - ZERO JS shipped to client)
import { FavoriteButton } from './FavoriteButton'; // Imported Client Component

export default async function ProductsPage() {
  // Direct database query without intermediate REST endpoints:
  const products = [
    { id: '1', name: 'Laptop Pro', price: 1200 },
    { id: '2', name: 'Mechanical Keyboard', price: 150 }
  ];

  return (
    <div className="space-y-4">
      <h2>Products</h2>
      {products.map(p => (
        <div key={p.id} className="p-4 border rounded flex justify-between">
          <span>{p.name} - \${p.price}</span>
          {/* Client boundary: only this interactive button ships JS to the browser */}
          <FavoriteButton id={p.id} />
        </div>
      ))}
    </div>
  );
}

// FavoriteButton.tsx (Client Component)
// 'use client';
// export function FavoriteButton({ id }: { id: string }) { ... }`,
    interviewTips: [
      'Dispel the common misconception about `"use client"`: `"use client"` does NOT mean "this component only runs in the browser". Client Components ARE pre-rendered on the server to generate initial HTML; the directive simply defines the boundary where JavaScript must be bundled and hydrated on the client.',
      'Explain the composition pattern: A Server Component can pass another Server Component as `children` into a Client Component, allowing server content to retain zero client JS while nested inside interactive client containers.'
    ],
    commonTraps: [
      'Adding `"use client"` at the root of the entire application, throwing away all bundle-saving benefits of RSC.',
      'Attempting to pass non-serializable values (such as functions or class instances) as props across the Server-to-Client component boundary.'
    ],
    keyTakeaway: 'Server Components run on the server with zero client bundle impact; Client Components supply browser interactivity.',
    componentKey: 'RscBoundariesDemo',
    tags: ['rsc', 'react-server-components', 'use-client', 'nextjs-app-router', 'zero-bundle']
  },
  {
    id: '6.8',
    level: 6,
    levelTitle: 'Modern React (18 & 19)',
    title: '6.8 Server Actions & Secure Mutations',
    summary: 'Async server functions callable directly from client components and forms without creating manual API routes.',
    whatIsIt: `**Server Actions** are asynchronous functions marked with the **\`'use server'\`** directive that run exclusively on the server but can be invoked directly from client components and forms:

Key capabilities:
- Eliminate the need to manually build API route handlers (\`/api/create-task\`), fetch requests, and JSON serialization.
- **Progressive Enhancement**: When used in \`<form action={myAction}>\`, forms can submit successfully even before client-side JavaScript has finished loading.
- **Instant Cache Revalidation**: Can invoke server APIs such as \`revalidatePath()\` or \`revalidateTag()\` to purge caches and update client views in a single network round-trip.
- **Security**: Under the hood, React exposes a public HTTP POST endpoint; **you must always authenticate, authorize, and validate inputs inside the action**.`,
    codeSnippet: `// app/actions.ts
'use server';

import { revalidatePath } from 'next/cache';

export async function registerUser(formData: FormData) {
  const email = formData.get('email') as string;

  // 1. Server-side validation and authorization
  if (!email || !email.includes('@')) {
    return { ok: false, error: 'Invalid email' };
  }

  // 2. Direct database operation
  console.log('Saving to database:', email);

  // 3. Server-side cache revalidation
  // revalidatePath('/users');
  return { ok: true, message: 'User registered successfully' };
}

// Consumption in form component:
// <form action={registerUser}>
//   <input name="email" type="email" required />
//   <button type="submit">Register</button>
// </form>`,
    interviewTips: [
      'Critical security question: "Are Server Actions private or public?". Answer: They are public HTTP POST endpoints exposed to the internet. Never assume only your UI can invoke them; always authenticate user sessions, authorize permissions, and validate inputs with schemas like Zod inside the action.',
      'Explain how they integrate with React 19 hooks: `useActionState`, `useFormStatus`, and `useOptimistic` were specifically designed to pair seamlessly with Server Actions.'
    ],
    commonTraps: [
      "Confusing file-level 'use server' with a Server Component: 'use server' defines exported functions as Server Actions; Server Components have NO directive (they are the default standard).",
      'Blindly trusting client data without server-side validation using libraries like Zod.'
    ],
    keyTakeaway: 'Server Actions enable native server-side mutations from forms; always enforce strict authentication and validation.',
    componentKey: 'ServerActionsDemo',
    tags: ['server-actions', 'use-server', 'mutations', 'revalidatePath', 'security']
  },
  {
    id: '6.9',
    level: 6,
    levelTitle: 'Modern React (18 & 19)',
    title: '6.9 React 19 Hooks (`use`, `useActionState`, `useFormStatus`, `useOptimistic`)',
    summary: 'The next generation of hooks for interactive forms, conditional promise unwrapping, and optimistic UI updates.',
    whatIsIt: `React 19 introduces 4 official next-generation hooks to standardize common frontend patterns:

1. **\`use(Promise | Context)\`**:
Unlike other React hooks, \`use\` **can be called inside conditionals (\`if\`) and loops**. It suspends the UI when reading unresolved promises or reads Context dynamically.
2. **\`useActionState(action, initialState)\`**:
Manages the state returned by an async form action, returning \`[state, formAction, isPending]\`. Replaces and standardizes manual \`useState\` patterns.
3. **\`useFormStatus()\`**:
Reads the status of the closest parent form (\`{ pending, data, method }\`) from within a child component—ideal for submit buttons with automatic spinners without prop drilling.
4. **\`useOptimistic(state, updateFn)\`**:
Applies instantaneous optimistic UI updates while an async server mutation resolves, automatically rolling back if the operation fails.`,
    codeSnippet: `import { useActionState, useOptimistic } from 'react';

// Simulated async server action:
async function addCommentAction(prev: string[], formData: FormData) {
  const text = formData.get('comment') as string;
  await new Promise(r => setTimeout(r, 1000)); // Simulate server delay
  return [...prev, text];
}

function CommentsSection() {
  const [comments, formAction, isPending] = useActionState(addCommentAction, ['Initial comment']);

  // Instant optimistic update:
  const [optimisticComments, setOptimistic] = useOptimistic(
    comments,
    (current, newComment: string) => [...current, \`\${newComment} (sending...)\`]
  );

  const handleSubmit = async (formData: FormData) => {
    const text = formData.get('comment') as string;
    setOptimistic(text); // Display immediately on submit
    await formAction(formData);
  };

  return (
    <div>
      <ul>
        {optimisticComments.map((c, i) => <li key={i}>{c}</li>)}
      </ul>
      <form action={handleSubmit}>
        <input name="comment" required />
        <button type="submit" disabled={isPending}>{isPending ? 'Saving...' : 'Comment'}</button>
      </form>
    </div>
  );
}`,
    interviewTips: [
      'Highlight naming history: `useActionState` was temporarily called `useFormState` in early Next.js experimental releases before being officially renamed and standardized in React 19.',
      'Explain `useFormStatus`: it MUST be called from a CHILD component rendered inside the `<form>`, not within the component declaring the `<form>`. This is a classic interview gotcha.'
    ],
    commonTraps: [
      'Calling `useFormStatus` at the same level where `<form>` is declared: returns `pending: false` because it searches for form context upward in the tree.',
      'Passing promises recreated on every render to `use()` without a stable reference or memoization.'
    ],
    keyTakeaway: 'React 19 formalizes form and transition workflows with native hooks for state, pending status, and optimistic UI.',
    componentKey: 'React19HooksDemo',
    tags: ['react-19', 'use-hook', 'useActionState', 'useFormStatus', 'useOptimistic']
  },
  {
    id: '6.10',
    level: 6,
    levelTitle: 'Modern React (18 & 19)',
    title: '6.10 `ref` as a Direct Prop in React 19',
    summary: 'Deprecation of forwardRef: functional components now receive ref as an ordinary prop directly.',
    whatIsIt: `For years, one of the biggest friction points in React was the inability to pass a \`ref\` prop directly to a function component without wrapping it in \`forwardRef((props, ref) => ...)\`. This created convoluted type signatures and TypeScript friction.

**In React 19**:
- **\`ref\` is now a standard first-class prop**, handled just like \`className\` or \`onClick\`.
- \`forwardRef\` is officially deprecated and will be removed in a future major version.
- Function component signatures are drastically simplified in both JavaScript and TypeScript.`,
    codeSnippet: `// ❌ Legacy approach in React 18 (Requires forwardRef):
// const CustomInput = forwardRef<HTMLInputElement, { label: string }>((props, ref) => (
//   <input ref={ref} {...props} />
// ));

// ✅ Now in React 19: ref is an ordinary prop
interface CustomInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  ref?: React.Ref<HTMLInputElement>;
}

function CustomInput({ label, ref, ...props }: CustomInputProps) {
  return (
    <div className="flex flex-col gap-1">
      <label>{label}</label>
      <input ref={ref} className="border p-2 rounded" {...props} />
    </div>
  );
}

// Parent component consumes it cleanly:
function Form() {
  const inputRef = useRef<HTMLInputElement>(null);
  return <CustomInput ref={inputRef} label="Username" />;
}`,
    interviewTips: [
      'Highlight TypeScript ergonomics: previously, `forwardRef` broke generic type parameters (`<T>`) and obscured IntelliSense types. With `ref` as a regular prop, generic components are written cleanly and naturally.',
      'Backward compatibility: existing code using `forwardRef` continues to work in React 19 for smooth incremental migrations, but all new code should adopt the direct prop.'
    ],
    commonTraps: [
      'Destructuring `ref` without properly typing it as `React.Ref<T>` in TypeScript.',
      'Assuming ref behavior changed: the ref still points to the underlying DOM node once mounted.'
    ],
    keyTakeaway: 'React 19 eliminates `forwardRef`, allowing components to accept `ref` directly as a regular prop.',
    componentKey: 'React19RefPropDemo',
    tags: ['react-19', 'ref-prop', 'forwardRef-deprecated', 'typescript', 'simplification']
  },
  {
    id: '6.11',
    level: 6,
    levelTitle: 'Modern React (18 & 19)',
    title: '6.11 React Compiler (Automatic Memoization)',
    summary: 'Build-time optimizing compiler that applies automatic memoization, eliminating manual useMemo and useCallback.',
    whatIsIt: `The **React Compiler** (originally researched under the codename React Forget) is an optimizing build-time compiler developed by Meta that understands JavaScript and React semantics.

What problem does it solve?:
Previously, React engineers spent hours manually writing \`useMemo\`, \`useCallback\`, and \`React.memo\` to stabilize references and prevent unnecessary re-renders. This process was prone to human error (incomplete dependency arrays, over-optimization).

**How it works**:
- Operates at **build time** (via Babel / ESLint plugin).
- Analyzes control flow and variable mutations within components.
- Automatically inserts fine-grained memoization caches into the compiled output.
- **Strict requirement**: Code must strictly obey the **Rules of React** (pure rendering, no mutating props or external variables during render).`,
    codeSnippet: `// Source code you write (Idiomatic code without manual memoization):
function FriendsProfile({ friends, filter }: { friends: any[]; filter: string }) {
  // React Compiler automatically memoizes this filtered result:
  const visibleFriends = friends.filter(f => f.name.includes(filter));

  // React Compiler automatically memoizes this callback:
  const handleClick = (id: string) => console.log('Selected:', id);

  return <FriendsList items={visibleFriends} onSelect={handleClick} />;
}

// Internal compiled output (React Compiler inserts automatic cache slots):
// const $ = _c(4); // Compiler-managed cache slots`,
    interviewTips: [
      'Forward-looking interview question: "With React Compiler, do useMemo and useCallback disappear?". Senior answer: For the vast majority of day-to-day code, yes. They remain relevant only in rare edge cases where developers need explicit referential guarantees for specific external dependencies.',
      'Explain `eslint-plugin-react-compiler`: audits your codebase to identify which components are compatible and which violate React purity rules before enabling the compiler.'
    ],
    commonTraps: [
      'Expecting the compiler to fix impure code: if code violates the Rules of React, the compiler simply bails out and disables auto-memoization for that component.',
      'Believing the compiler replaces solid state architecture and component design.'
    ],
    keyTakeaway: 'React Compiler analyzes code at build time and automates useMemo/useCallback if components respect React purity rules.',
    componentKey: 'ReactCompilerDemo',
    tags: ['react-compiler', 'react-forget', 'auto-memoization', 'build-time', 'purity']
  },
  {
    id: '6.12',
    level: 6,
    levelTitle: 'Modern React (18 & 19)',
    title: '6.12 Strict Mode & the Development "Double Render"',
    summary: 'Why useEffect runs twice in development: the intentional mechanism to surface impurities and missing cleanup functions.',
    whatIsIt: `\`<StrictMode>\` is a development-only tool in React that renders no visual DOM elements but activates additional checks and warnings to catch architectural bugs early.

**The "Double Mount" Mechanism**:
In development mode (\`process.env.NODE_ENV === 'development'\`), React intentionally:
1. Mounts the component.
2. Immediately unmounts it.
3. Mounts it a second time.
Consequently, **\`useEffect\` with an empty dependency array \`[]\` runs twice in development**.

**Why does React do this?**:
To simulate future concurrent navigation features (such as navigating back and forth with preserved state) and **force developers to implement proper cleanup functions**. If an effect connects a WebSocket or attaches an event listener without cleaning it up, the double mount immediately exposes the memory leak in the console.`,
    codeSnippet: `// Demonstrating Strict Mode and mandatory cleanup:
function ChatConnection({ roomId }: { roomId: string }) {
  useEffect(() => {
    console.log('[Effect] Connecting to room:', roomId);
    const connection = createMockWebSocket(roomId);

    // Without this cleanup function, development mode leaks 2 connections:
    return () => {
      console.log('[Cleanup] Disconnecting from room:', roomId);
      connection.disconnect();
    };
  }, [roomId]);

  return <p>Connected to room: {roomId}</p>;
}

function createMockWebSocket(id: string) {
  return { disconnect: () => console.log('Socket closed cleanly') };
}`,
    interviewTips: [
      'Most frequent question in forums and interviews: "My useEffect runs twice and triggers two API calls, how do I disable it?". Senior response: Do NOT disable it! Make the effect resilient with proper cleanup (using AbortController to cancel in-flight requests or cleaning up subscriptions).',
      'Emphasize that double mounting only occurs in development; production builds (`npm run build`) mount components exactly once.'
    ],
    commonTraps: [
      'Removing `<StrictMode>` from `layout.tsx` or `index.tsx` to suppress the double mount instead of fixing missing effect cleanups.',
      'Using a `useRef` boolean flag (`isMounted.current = true`) to prevent the effect from running twice, defeating the safety check React intentionally designed.'
    ],
    keyTakeaway: 'StrictMode remounts effects in development to verify proper cleanup and ensure resilience in concurrent environments.',
    componentKey: 'StrictModeDemo',
    tags: ['strict-mode', 'double-render', 'cleanup', 'development', 'resilience']
  }
];
