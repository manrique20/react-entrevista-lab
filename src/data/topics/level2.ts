import { Topic } from '@/types';

export const LEVEL_2_TOPICS: Topic[] = [
  {
    id: '2.1',
    level: 2,
    levelTitle: 'State & Core Hooks',
    title: '2.1 `useState` (Local State and Functional Updates)',
    summary: 'Immutable state management in functional components. The functional updater `setCount(prev => prev + 1)` is critical for safe, concurrent updates.',
    whatIsIt: `\`useState\` declares a state variable that React preserves between renders. Calling its updater function with a new value schedules a re-render of the component.

Golden rules of \`useState\`:
1. **Strict Immutability**: Never mutate the current state object or array in place. Always create a new copy using the spread operator (\`[...arr]\` or \`{ ...obj }\`).
2. **Asynchronous, Scheduled Updates**: Calling \`setN(5)\` does not update the local variable \`n\` on the very next line of code. The variable reflects the new value in the **next render cycle**.
3. **Functional Updater Form**: If the new state depends on the previous state, use \`setN(prev => prev + 1)\`. This avoids stale values captured in closures and works reliably with state batching.`,
    codeSnippet: `function AsyncCounter() {
  const [count, setCount] = useState(0);

  const handleIncorrectClick = () => {
    // ❌ Bug: All calls read the same 'count' from the current render closure (e.g. 0)
    setCount(count + 1);
    setCount(count + 1);
    setCount(count + 1);
    // Result after render: Increments by only 1!
  };

  const handleCorrectClick = () => {
    // ✅ Safe: Queues updater functions operating on the latest pending state
    setCount(prev => prev + 1);
    setCount(prev => prev + 1);
    setCount(prev => prev + 1);
    // Result: Reliably increments by 3!
  };

  return (
    <div className="flex gap-4">
      <button onClick={handleIncorrectClick}>Incorrect Increment</button>
      <button onClick={handleCorrectClick}>Functional Increment (Correct)</button>
    </div>
  );
}`,
    interviewTips: [
      'Classic question: "Why does console.log(count) log the old value immediately after setCount(count + 1)?" Senior answer: Because setState does not mutate the local variable in the current frame; it schedules a new render where the component function will run with the new value in its closure.',
      'Explain lazy state initialization: if computing the initial value is expensive (e.g. reading from localStorage), pass an initializer function: `useState(() => computeExpensiveValue())`. It only runs during initial mount.'
    ],
    commonTraps: [
      'Calling `arr.push(item)` and then `setArr(arr)`. React compares state references with `Object.is`; seeing the same reference, it bails out of rendering.',
      'Passing a direct function invocation instead of an initializer function: `useState(readLocalStorage())` runs the expensive operation on every render even though React discards the return value after mount.'
    ],
    keyTakeaway: 'Always use the functional form `prev => ...` when next state depends on previous state, and never mutate references directly.',
    componentKey: 'UseStateAsyncDemo',
    tags: ['useState', 'functional-updates', 'immutability', 'lazy-initial-state']
  },
  {
    id: '2.2',
    level: 2,
    levelTitle: 'State & Core Hooks',
    title: '2.2 `useEffect` (Synchronization and Lifecycle)',
    summary: 'Synchronize the component with external systems (APIs, timers, DOM events). Its cleanup function prevents memory leaks.',
    whatIsIt: `\`useEffect\` lets you run side effects after React has completed the render phase and the browser has painted the screen.

The dependency array controls its lifecycle:
- **No array (\`useEffect(fn)\`)**: Runs after EVERY render.
- **Empty array (\`[]\`)**: Runs only once when the component mounts.
- **With dependencies (\`[a, b]\`)**: Runs on mount and whenever \`a\` or \`b\` changes based on \`Object.is\` comparison.

**The Cleanup Function**:
The cleanup function returned by \`useEffect\` executes:
1. Right before the effect re-runs (when dependencies change).
2. When the component unmounts from the DOM.
It is critical for canceling network requests, clearing timers (\`clearInterval\`), or removing event listeners.`,
    codeSnippet: `function ActiveTimer() {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    // 1. Effect setup
    const timerId = setInterval(() => {
      setSeconds(s => s + 1);
    }, 1000);

    // 2. Mandatory cleanup
    return () => {
      clearInterval(timerId); // Prevents memory leaks and orphaned intervals
    };
  }, []); // Runs on mount and unmount only

  return <p>Elapsed time: {seconds}s</p>;
}`,
    interviewTips: [
      'Emphasize the official React docs guidance: "useEffect is not a lifecycle hook; it is a synchronization mechanism with external systems outside React".',
      'If a value can be derived from existing state or props during render, DO NOT use `useEffect`. Using effects to sync internal React state is a major anti-pattern.'
    ],
    commonTraps: [
      'Forgetting cleanup functions when subscribing to `window` events or intervals, creating cumulative memory leaks.',
      'Omitting dependencies used inside the effect to "prevent it from running," which directly leads to stale closure bugs.'
    ],
    keyTakeaway: 'useEffect is for synchronizing with systems external to the React tree. Always clean up resources on unmount.',
    componentKey: 'UseEffectLifecycleDemo',
    tags: ['useEffect', 'dependencies', 'cleanup', 'memory-leaks']
  },
  {
    id: '2.3',
    level: 2,
    levelTitle: 'State & Core Hooks',
    title: '2.3 Controlled vs. Uncontrolled Components',
    summary: 'Controlled: React is the single source of truth via value + onChange. Uncontrolled: DOM holds the value and is accessed via useRef.',
    whatIsIt: `This distinction applies to form input elements (\`<input>\`, \`<select>\`, \`<textarea>\`):

1. **Controlled Component**:
- The input value is bound to React state (\`value={val}\`).
- Modifications occur through change handlers (\`onChange={(e) => setVal(e.target.value)}\`).
- Advantages: Instant validation, reactive button disabling, dependent inputs.
- Trade-offs: Triggers a re-render on every keystroke.

2. **Uncontrolled Component**:
- The browser manages the value in its internal DOM state.
- The value is read using a ref (\`ref={inputRef}\`) or on submit via \`new FormData(e.currentTarget)\`.
- Advantages: Optimal performance, simpler code, ideal for large forms and libraries like React Hook Form.`,
    codeSnippet: `// 1. Controlled: State in React
function ControlledInput() {
  const [text, setText] = useState('');
  return (
    <div>
      <input value={text} onChange={e => setText(e.target.value)} />
      <span>Characters: {text.length}</span>
    </div>
  );
}

// 2. Uncontrolled: State in the DOM
function UncontrolledInput() {
  const inputRef = useRef<HTMLInputElement>(null);
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Value read from DOM: ' + inputRef.current?.value);
  };
  return (
    <form onSubmit={handleSubmit}>
      <input ref={inputRef} defaultValue="Initial text" />
      <button type="submit">Submit</button>
    </form>
  );
}`,
    interviewTips: [
      'Explain why React Hook Form prefers uncontrolled components: by registering native input refs, typing in a field does not trigger full-component re-renders, maintaining 60 FPS even with hundreds of inputs.',
      'Highlight `defaultValue` vs `value`: uncontrolled components use `defaultValue` to configure the initial value without converting the input into a controlled component.'
    ],
    commonTraps: [
      'The warning: "A component is changing an uncontrolled input to be controlled". This occurs when starting with `value={undefined}` and later passing a string. Fix: `value={text ?? ""}`.'
    ],
    keyTakeaway: 'Controlled inputs provide instant reactivity and validation; uncontrolled inputs provide optimal rendering performance and simplicity.',
    componentKey: 'ControlledVsUncontrolledDemo',
    tags: ['forms', 'controlled', 'uncontrolled', 'useRef']
  },
  {
    id: '2.4',
    level: 2,
    levelTitle: 'State & Core Hooks',
    title: '2.4 Forms and Validation in React',
    summary: 'Patterns for multi-field forms, unified change handlers, and synchronous/asynchronous validation with accessible visual feedback.',
    whatIsIt: `Managing forms efficiently in React requires structuring state to avoid declaring separate \`useState\` hooks for every single field.

Recommended unified handler pattern:
- Declare a single state object for all fields: \`const [form, setForm] = useState({ email: '', password: '' })\`.
- Assign the \`name\` attribute on each input matching the state object key.
- Use a single change handler that updates properties dynamically with computed property names: \`setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))\`.
- A validation function evaluates rules and produces a typed error dictionary prior to submission.`,
    codeSnippet: `function RegistrationForm() {
  const [form, setForm] = useState({ email: '', pass: '' });
  const [errors, setErrors] = useState<{ email?: string; pass?: string }>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    const errs: { email?: string; pass?: string } = {};
    if (!form.email.includes('@')) errs.email = 'Invalid email';
    if (form.pass.length < 6) errs.pass = 'Minimum 6 characters';
    return errs;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors = validate();
    setErrors(newErrors);
    if (Object.keys(newErrors).length === 0) {
      console.log('Submitting:', form);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <input name="email" value={form.email} onChange={handleChange} placeholder="Email" />
      {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
      <input name="pass" type="password" value={form.pass} onChange={handleChange} placeholder="Password" />
      {errors.pass && <p className="text-red-500 text-sm">{errors.pass}</p>}
      <button type="submit">Register</button>
    </form>
  );
}`,
    interviewTips: [
      'Emphasize form accessibility: associate labels using `htmlFor="id"`, mark invalid fields with `aria-invalid={!!error}`, and link error messages with `aria-describedby="error-id"`.',
      'For production in mid-to-large projects, explain why you choose React Hook Form + Zod (schema-based validation that avoids duplicating validation logic between client and server).'
    ],
    commonTraps: [
      'Declaring 15 separate `useState` hooks for a 15-field form instead of using a consolidated object or dedicated form library.',
      'Relying solely on frontend validation and forgetting that client-side validation is purely for UX convenience; real security must be enforced on the server.'
    ],
    keyTakeaway: 'Consolidate multi-field inputs with `[e.target.name]: value` or use React Hook Form for decoupled, accessible validation.',
    componentKey: 'FormValidationDemo',
    tags: ['forms', 'validation', 'dynamic-handlers', 'accessibility']
  },
  {
    id: '2.5',
    level: 2,
    levelTitle: 'State & Core Hooks',
    title: '2.5 Lifting State Up',
    summary: 'Share state between sibling components by moving it to their closest common ancestor and distributing it via props.',
    whatIsIt: `Often, multiple components need to reflect the same changing data (e.g. a currency converter or Celsius and Fahrenheit temperature inputs).

In React, sibling components cannot communicate laterally. The canonical solution is **Lifting State Up**:
1. Remove local state from the child components.
2. Move it to their closest common ancestor.
3. The common ancestor passes the current state down via props and passes callback functions to update it.
4. Both children stay in sync thanks to unidirectional data flow.`,
    codeSnippet: `function TemperatureConverter() {
  const [celsius, setCelsius] = useState(0);

  const fahrenheit = (celsius * 9) / 5 + 32;

  const handleFahrenheitChange = (f: number) => {
    setCelsius(((f - 32) * 5) / 9);
  };

  return (
    <div className="grid grid-cols-2 gap-4">
      <TemperatureInput label="Celsius (°C)" value={celsius} onChange={setCelsius} />
      <TemperatureInput label="Fahrenheit (°F)" value={fahrenheit} onChange={handleFahrenheitChange} />
    </div>
  );
}

function TemperatureInput({ label, value, onChange }: { label: string; value: number; onChange: (v: number) => void }) {
  return (
    <div>
      <label>{label}</label>
      <input type="number" value={Math.round(value * 100) / 100} onChange={e => onChange(Number(e.target.value))} />
    </div>
  );
}`,
    interviewTips: [
      'Explain the "Single Source of Truth" concept: do not store Celsius and Fahrenheit as two separate states synced via useEffect; store only one and derive the other during rendering.',
      'Explain when lifting state up is no longer sufficient: if the common ancestor is too far up the component tree (severe prop drilling), it is time to consider Composition, the Context API, or Zustand.'
    ],
    commonTraps: [
      'Duplicating state across sibling components and attempting to synchronize them with cross-firing `useEffect` calls, creating render loops and out-of-sync states.',
      'Lifting state up too high (to the app root), causing the entire application to re-render on minor input changes.'
    ],
    keyTakeaway: 'Lift state to the closest common ancestor and derive calculated values during render rather than storing duplicates.',
    componentKey: 'LiftingStateDemo',
    tags: ['lifting-state', 'single-source-of-truth', 'derived-state', 'synchronization']
  },
  {
    id: '2.6',
    level: 2,
    levelTitle: 'State & Core Hooks',
    title: '2.6 Composition vs. Inheritance in React',
    summary: 'React strongly favors composition via children and slots over traditional class-based inheritance.',
    whatIsIt: `In the official React documentation, the Facebook team noted that across thousands of components in production, they never found a use case where component inheritance was recommended.

**Composition solves all use cases through primary techniques**:
1. **Containment**: Passing nested elements via the special \`children\` prop.
2. **Specialization**: A specific component renders a more generic component by configuring it with specific props (e.g. a \`WelcomeDialog\` renders a generic \`Dialog\`).
3. **Slots**: Passing complete components through named props (\`header={<Header />}\`, \`sidebar={<Sidebar />}\`).`,
    codeSnippet: `// Generic Component with Slots and Children
interface CardProps {
  header?: React.ReactNode;
  footer?: React.ReactNode;
  children: React.ReactNode;
}

function Card({ header, footer, children }: CardProps) {
  return (
    <div className="rounded-xl border bg-card shadow-sm">
      {header && <div className="border-b p-4 font-semibold">{header}</div>}
      <div className="p-4">{children}</div>
      {footer && <div className="border-t p-4 bg-muted/30">{footer}</div>}
    </div>
  );
}

// Usage via clean composition:
function UserProfile() {
  return (
    <Card
      header={<h3>My Profile</h3>}
      footer={<button className="btn-primary">Save Changes</button>}
    >
      <p>Configure your account preferences.</p>
    </Card>
  );
}`,
    interviewTips: [
      'Explain how composition is the primary tool to mitigate prop drilling: instead of piping data down 4 intermediate layers for a grandchild to consume, instantiate the grandchild in the grandparent and pass it as `children` directly through intermediate components.',
      'Quote the classic software engineering principle: "Favor object composition over class inheritance" (GoF Design Patterns).'
    ],
    commonTraps: [
      'Creating rigid inheritance hierarchies (`BaseButton -> IconButton -> PrimaryIconButton`) instead of composing with optional props and children.',
      'Accepting dozens of primitive configuration props when you could simply accept a `React.ReactNode` slot.'
    ],
    keyTakeaway: 'Use `children` and slots for flexible container components. Avoid extending classes in React.',
    componentKey: 'CompositionVsInheritanceDemo',
    tags: ['composition', 'inheritance', 'children', 'slots', 'prop-drilling']
  },
  {
    id: '2.7',
    level: 2,
    levelTitle: 'State & Core Hooks',
    title: '2.7 `useRef` (DOM Nodes and Persistent Mutable Values)',
    summary: 'Holds a mutable reference that persists across the full component lifecycle without triggering re-renders when `.current` changes.',
    whatIsIt: `\`useRef\` returns a plain mutable JavaScript object with a single property: \`{ current: initialValue }\`.

It has two primary use cases:
1. **Direct Imperative DOM Access**:
- Focusing inputs (\`inputRef.current.focus()\`).
- Measuring scroll positions or element dimensions.
- Integrating with non-React external libraries (D3 charts, Leaflet maps, video players).
2. **Storing Mutable Values Across Renders**:
- Holding timer IDs (\`timerId.current\`).
- Render counters for diagnostic purposes.
- Storing previous prop or state values without triggering a visual re-render.

Critical difference with \`useState\`: **Mutating \`ref.current\` DOES NOT trigger a React re-render**.`,
    codeSnippet: `function InputWithFocusAndRenderCount() {
  const inputRef = useRef<HTMLInputElement>(null);
  const rendersCount = useRef(0);

  // Increment ref on each render:
  rendersCount.current += 1; // Does NOT trigger an infinite loop because refs do not re-render

  const handleFocus = () => {
    inputRef.current?.focus();
    inputRef.current?.select();
  };

  return (
    <div className="space-y-3">
      <p className="text-sm text-muted">This component has rendered: {rendersCount.current} times.</p>
      <div className="flex gap-2">
        <input ref={inputRef} placeholder="Type here..." />
        <button onClick={handleFocus}>Focus Input</button>
      </div>
    </div>
  );
}`,
    interviewTips: [
      'Golden Rule: Never read or write `ref.current` during the pure rendering phase if the result affects what is displayed on screen (doing so breaks React 18/19 concurrent rendering). Ref mutations and reads belong in event handlers or `useEffect`.',
      'Describe the analogy: "useRef is like an instance variable `this.myVar` on a class component, adapted for functional components".'
    ],
    commonTraps: [
      'Attempting to use `useRef` for data that needs to be reflected immediately in the UI (like a visual counter). Because it does not trigger a re-render, the UI remains frozen until another event updates state.',
      'Mutating the DOM directly through refs (`inputRef.current.remove()`), interfering with React\'s internal reconciliation.'
    ],
    keyTakeaway: 'useRef persists values across renders without triggering re-renders. Ideal for DOM references and behind-the-scenes mutable values.',
    componentKey: 'UseRefDomAndStateDemo',
    tags: ['useRef', 'dom', 'mutable-persistence', 'render-counter']
  },
  {
    id: '2.8',
    level: 2,
    levelTitle: 'State & Core Hooks',
    title: '2.8 Rules of Hooks and Internal Mechanics',
    summary: 'The 2 inviolable rules: call only at the top level and only from React functions. Fiber\'s internal linked list relies on exact call order.',
    whatIsIt: `React Hooks must follow two strict rules enforced by the linter (\`eslint-plugin-react-hooks\`):
1. **Call Hooks only at the top level**:
Never call them inside conditional statements (\`if\`), loops (\`for\`, \`while\`), or nested functions.
2. **Call Hooks only from React functions**:
Only from React functional components or custom hooks (functions starting with \`use\`).

**Why this rule exists (Under the Hood)**:
React does not identify hooks by variable name; it tracks them using an **internal linked list** stored on the component\'s Fiber node (\`fiber.memoizedState\`).
On every render, React traverses this linked list sequentially: call 1 reads hook 1, call 2 reads hook 2, and so on.
If a hook were wrapped in an \`if\` statement and the condition evaluated to false on the next render, **the sequence would shift**, handing one hook\'s state to a completely different hook and corrupting application state.`,
    codeSnippet: `// ❌ SEVERE VIOLATION: Hook inside a conditional
function BrokenComponent({ isAdmin }: { isAdmin: boolean }) {
  if (isAdmin) {
    const [permissions, setPermissions] = useState(['read']); // 💣 Shifts the linked list when isAdmin changes
  }
  const [theme, setTheme] = useState('dark');
  // ...
}

// ✅ CORRECT: Hooks always execute in the exact same unconditional order
function CorrectComponent({ isAdmin }: { isAdmin: boolean }) {
  const [permissions, setPermissions] = useState(['read']);
  const [theme, setTheme] = useState('dark');

  // Conditional logic applies to the VALUE or RENDER, never the hook call:
  const activePermissions = isAdmin ? permissions : [];
  // ...
}`,
    interviewTips: [
      'A favorite Senior interview question: "Why does React require hooks to be called at the top level?" Explaining the internal linked list (`memoizedState`) and sequential pointer (`workInProgressHook`) demonstrates deep technical knowledge.',
      'Mention the `use` hook in React 19: unlike classic hooks, `use(promise)` or `use(context)` CAN be called conditionally and inside loops.'
    ],
    commonTraps: [
      'Trying to bypass the rules by calling hooks inside event handlers (`const handleClick = () => { const [x, setX] = useState(0); }`).',
      'Disabling ESLint warnings (`eslint-disable-next-line react-hooks/rules-of-hooks`) instead of refactoring the code correctly.'
    ],
    keyTakeaway: 'React identifies hooks by strict sequential order on each render. React 19 relaxes this exclusively for the new `use()` API.',
    componentKey: 'HooksRulesAndLinkedListDemo',
    tags: ['rules-of-hooks', 'linked-list', 'fiber-internals', 'eslint']
  }
];
