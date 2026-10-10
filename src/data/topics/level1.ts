import { Topic } from '@/types';

export const LEVEL_1_TOPICS: Topic[] = [
  {
    id: '1.1',
    level: 1,
    levelTitle: 'Fundamentals',
    title: '1.1 What is React and the Virtual DOM',
    summary: 'React is declarative and uses an in-memory representation (Virtual DOM) to batch and minimize expensive mutations on the real DOM.',
    whatIsIt: `React is a component-driven JavaScript library. Its paradigm is **declarative**: you describe what the UI should look like for a given state (\`UI = f(state)\`), and React takes care of performing the necessary DOM mutations in the browser.

The **Virtual DOM** is an in-memory tree of lightweight JavaScript objects representing the UI structure. When state changes:
1. React creates a new virtual tree in memory.
2. It compares the new tree with the previous one (**Diffing Algorithm**).
3. It computes the minimum set of necessary changes (**Reconciliation**).
4. It applies only those differences to the browser's real DOM in a single batched operation.`,
    codeSnippet: `// Declarative Paradigm (React)
function Greeting({ name }: { name: string }) {
  return <h1 className="text-xl font-bold">Hello, {name}</h1>;
}

// Imperative Paradigm (Vanilla JS)
// const h1 = document.createElement('h1');
// h1.textContent = \`Hello, \${name}\`;
// h1.className = 'text-xl font-bold';
// document.getElementById('root')?.appendChild(h1);`,
    interviewTips: [
      'The Virtual DOM is NOT inherently faster than direct DOM manipulation; it is an abstraction that guarantees predictable and sufficient performance without manual optimization.',
      'Emphasize that the biggest value of the Virtual DOM is not raw speed, but the declarative mental model that decouples UI logic from native DOM manipulation.',
      'Mention that this decoupling enables React to run in other environments, such as React Native (mobile) or SSR (server-side rendering).'
    ],
    commonTraps: [
      'Pitfall: Claiming that "the Virtual DOM is faster than the DOM in all circumstances." Touching the DOM directly with hyper-optimized vanilla code can be faster, but it is unmaintainable at scale.',
      'Confusing the Shadow DOM (a Web Components standard for encapsulating styles and scripts) with the Virtual DOM (React\'s internal in-memory structure).'
    ],
    keyTakeaway: 'React computes differences in memory (inexpensive) and applies only modified nodes to the real DOM (expensive).',
    componentKey: 'VirtualDomDemo',
    tags: ['virtual-dom', 'declarative', 'diffing', 'reconciliation']
  },
  {
    id: '1.2',
    level: 1,
    levelTitle: 'Fundamentals',
    title: '1.2 JSX (JavaScript XML)',
    summary: 'Syntactic sugar that compiles to React.createElement / jsx(). Enables composing declarative UI with JavaScript expressions.',
    whatIsIt: `JSX is a syntax extension for JavaScript with an HTML-like appearance. It is not native HTML and does not run directly in the browser; a transpiler (Babel, SWC, or TypeScript) transforms it into JS function calls (\`jsx(type, props)\` in the modern runtime or \`React.createElement\`).

Essential characteristics:
- camelCase attributes (\`className\`, \`htmlFor\`, \`onClick\`, \`tabIndex\`).
- Expressions inside curly braces \`{}\`: any expression that returns a value is evaluated (ternaries, \`.map()\`, function calls).
- Single root element or **React Fragment** (\`<>...</>\` or \`<React.Fragment>\`) to group children without injecting additional DOM nodes.`,
    codeSnippet: `// What you write in JSX:
function Card({ title, active }: { title: string; active: boolean }) {
  return (
    <div className={active ? 'border-blue-500' : 'border-gray-200'}>
      <h2>{title.toUpperCase()}</h2>
      <p>Inline calculation: {2 + 2}</p>
    </div>
  );
}

// What it compiles to internally (React JSX runtime):
// import { jsx as _jsx, jsxs as _jsxs } from 'react/jsx-runtime';
// _jsxs('div', { className: ..., children: [...] });`,
    interviewTips: [
      'Explain the difference between statements and expressions: inside `{}` only expressions (code that resolves to a value) are allowed. That is why we use ternaries and logical operators, never statements like `if` or `for`.',
      'Mention why React Fragment (`<>...</>`) is essential: it avoids the "div soup" problem that breaks semantic markup, flexbox, and CSS grid layouts.'
    ],
    commonTraps: [
      'Attempting to place an `if` statement or `for` loop directly inside curly braces `{}`.',
      'Forgetting that shorthand Fragments `<>...</>` cannot accept the `key` prop when mapping lists. If you need a `key`, use explicit `<React.Fragment key={id}>`.'
    ],
    keyTakeaway: 'JSX is pure JavaScript syntax sugar transformed at compile time into element object creation calls.',
    componentKey: 'JsxExpressionsDemo',
    tags: ['jsx', 'fragments', 'expressions', 'transpilation']
  },
  {
    id: '1.3',
    level: 1,
    levelTitle: 'Fundamentals',
    title: '1.3 Functional vs. Class Components',
    summary: 'Historical evolution: from classes with rigid lifecycles and "this" binding to pure functions with modern Hooks.',
    whatIsIt: `In early React versions, class components were the only way to have state (\`this.state\`) and lifecycle methods (\`componentDidMount\`, \`componentDidUpdate\`).

With the introduction of **Hooks in React 16.8**, **functional components** became the standard:
- Concise syntax free of \`this\` binding issues.
- Stateful logic reuse via **Custom Hooks** (which previously required complex HOCs or Render Props).
- Smaller bundle footprint and better optimization by compilers and minifiers.
- Class components remain supported for backwards compatibility and Error Boundaries (which still require \`componentDidCatch\`).`,
    codeSnippet: `// Functional (Modern Standard)
function Counter() {
  const [count, setCount] = useState(0);
  return <button onClick={() => setCount(c => c + 1)}>{count}</button>;
}

// Class (Legacy)
class ClassCounter extends React.Component<{}, { count: number }> {
  state = { count: 0 };
  render() {
    return (
      <button onClick={() => this.setState({ count: this.state.count + 1 })}>
        {this.state.count}
      </button>
    );
  }
}`,
    interviewTips: [
      'Emphasize that functional components "capture" rendered values via JavaScript closures, whereas classes read `this.props` mutably, causing subtle race condition bugs in asynchronous operations.',
      'Mention that the only reason to write a class component today is an Error Boundary if you are not using a library like `react-error-boundary`.'
    ],
    commonTraps: [
      'Believing class components have better performance. In modern practice, functional components are faster to optimize with React Compiler and do not incur class instantiation overhead.',
      'Forgetting how to resolve `this` binding in classes (constructor binding or arrow functions).'
    ],
    keyTakeaway: 'Functional components + hooks solve stateful logic reuse without complex inheritance hierarchies or `this` binding issues.',
    componentKey: 'FunctionalVsClassDemo',
    tags: ['components', 'classes', 'hooks', 'historical']
  },
  {
    id: '1.4',
    level: 1,
    levelTitle: 'Fundamentals',
    title: '1.4 Props (Properties)',
    summary: 'Immutable input arguments that flow downward. The special `children` prop enables component composition.',
    whatIsIt: `**Props** are the primary mechanism for passing data from parent components to child components.

Fundamental rules:
1. They are **read-only (immutable)** for the receiving component. Pure functions must never mutate their inputs.
2. They support any JavaScript data type: primitives, objects, callback functions, promises, and even other JSX components.
3. The special **\`children\`** prop contains whatever is nested between the component's opening and closing tags.
4. They can be destructured with default values and grouped with the rest operator (\`...rest\`).`,
    codeSnippet: `interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger';
  loading?: boolean;
}

function Button({ variant = 'primary', loading, children, ...rest }: ButtonProps) {
  return (
    <button
      disabled={loading || rest.disabled}
      className={\`btn btn-\${variant} \${loading ? 'opacity-50' : ''}\`}
      {...rest}
    >
      {loading ? 'Loading...' : children}
    </button>
  );
}`,
    interviewTips: [
      'Never attempt to mutate a prop directly (`props.something = 123`). If you need to change a value, lift state up to the parent and pass a callback, or initialize local state.',
      'Explain how `children` enables composition and prevents prop drilling by allowing callers to pass pre-composed elements instead of piping primitive props through intermediate layers.'
    ],
    commonTraps: [
      'Mutating object or array props directly (`props.user.name = "New"`). This mutates parent state behind React\'s back.',
      'Not providing default values for optional props, leading to runtime errors like `cannot read property of undefined`.'
    ],
    keyTakeaway: 'Props are immutable to the child. To alter data, pass a callback that notifies the state owner.',
    componentKey: 'PropsAndChildrenDemo',
    tags: ['props', 'immutability', 'children', 'composition']
  },
  {
    id: '1.5',
    level: 1,
    levelTitle: 'Fundamentals',
    title: '1.5 Lists and the `key` Prop',
    summary: 'Unique and stable keys allow the reconciler to track and preserve state for each list node across renders.',
    whatIsIt: `To render collections of data, the \`.map()\` method is used. React requires each returned element to have a special **\`key\`** prop.

The role of the \`key\`:
- It provides a persistent identity for each node across multiple renders.
- It allows React to determine whether an element was added, removed, reordered, or modified with minimal DOM operations.
- **Why you should NOT use array indexes as keys**: If list order changes, items are filtered, or an element is prepended, array indexes shift to different items. If child components hold internal state (such as input text or checkboxes), that state remains tied to the index rather than the item, corrupting the UI.`,
    codeSnippet: `// ❌ DANGEROUS: Using index as key in mutable lists
{items.map((item, index) => (
  <TodoItem key={index} item={item} />
))}

// ✅ SAFE: Unique, persistent ID from the entity
{items.map((item) => (
  <TodoItem key={item.id} item={item} />
))}`,
    interviewTips: [
      'Demonstrate live why using the index fails: in a list of inputs, deleting the first item causes the entered text to stay on the new first item.',
      'Mention that `key` is a reserved React prop: it is not forwarded to the child component (`props.key` does not exist inside the component).'
    ],
    commonTraps: [
      'Using `key={Math.random()}`. This destroys and remounts the component on EVERY render, losing input focus and causing severe performance degradation.',
      'Using array indexes in lists that support dynamic sorting, deletion, or filtering.'
    ],
    keyTakeaway: 'Always use unique, stable identifiers. Indexes are only acceptable if the list is strictly static and stateless.',
    componentKey: 'ListKeysTrapDemo',
    tags: ['lists', 'key', 'reconciliation', 'indexes']
  },
  {
    id: '1.6',
    level: 1,
    levelTitle: 'Fundamentals',
    title: '1.6 Conditional Rendering',
    summary: 'Techniques for displaying conditional UI and the common trap of the number 0 with the logical && operator.',
    whatIsIt: `Conditional rendering in React follows the same semantics as JavaScript expressions:
1. **Early Return**: Returning early from the component with a loader or error message.
2. **Ternary Operator (\`condition ? <A /> : <B />\`)**: Ideal for toggling between two visual states.
3. **Logical AND Operator (\`condition && <Component />\`)**: Renders the component only when the condition is truthy.

**The classic \`0\` trap with \`&&\`**:
In JavaScript, if the left-hand side evaluates to the number \`0\`, the expression returns \`0\`. Because React renders numbers to the screen, \`items.length && <List />\` prints an unwanted \`0\` on the page when the array is empty.`,
    codeSnippet: `// ❌ Pitfall: Renders '0' in the DOM if items.length is 0
<div>
  {items.length && <List items={items} />}
</div>

// ✅ Safe solution 1: Explicit boolean comparison
<div>
  {items.length > 0 && <List items={items} />}
</div>

// ✅ Safe solution 2: Boolean conversion or ternary
<div>
  {Boolean(items.length) && <List items={items} />}
  {items.length ? <List items={items} /> : <p>No items</p>}
</div>`,
    interviewTips: [
      'Explain precisely how JS evaluates the `&&` operator: it returns the first falsy operand or the last truthy operand. If it evaluates to `0` or `NaN`, React renders it as text.',
      'Values React ignores when rendering: `null`, `undefined`, `true`, and `false`. Everything else (including `0` and `""`) is rendered into the DOM.'
    ],
    commonTraps: [
      'Relying on `items.length && <Component />` without realizing that `0` is falsy yet renderable.',
      'Nesting too many ternary operators (`a ? b ? c : d : e`), which ruins code readability.'
    ],
    keyTakeaway: 'Always use explicit boolean comparisons (`count > 0 && ...`) to prevent zero values from leaking onto the screen.',
    componentKey: 'ConditionalRenderingDemo',
    tags: ['conditional', 'and-operator', 'ternary', 'zero-trap']
  },
  {
    id: '1.7',
    level: 1,
    levelTitle: 'Fundamentals',
    title: '1.7 Events and SyntheticEvent',
    summary: 'React normalizes browser events using SyntheticEvent with camelCase syntax and function references.',
    whatIsIt: `React implements a cross-browser wrapper around native browser events called **SyntheticEvent**.

Advantages:
- Provides a uniform, consistent API across all browsers.
- Implements event delegation at the root of the tree (\`root\`), optimizing memory usage.
- Uses camelCase event names (\`onClick\`, \`onChange\`, \`onSubmit\`).
- Takes function references rather than function invocations (\`onClick={fn}\`, not \`onClick={fn()}\`).`,
    codeSnippet: `function SearchForm() {
  const [query, setQuery] = useState('');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Prevents full page reload
    console.log('Searching:', query);
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Type something..."
      />
      {/* Pass function reference, not invocation */}
      <button type="submit">Search</button>
    </form>
  );
}`,
    interviewTips: [
      'Explain the common trap of `onClick={handleClick()}`: the parentheses invoke the function during render, triggering infinite loops if setState is called inside.',
      'Mention that to pass arguments, you must use an arrow function: `onClick={() => handleClick(id)}`.'
    ],
    commonTraps: [
      'Invoking the function directly in the handler prop: `onClick={doSomething()}` instead of `onClick={() => doSomething()}`.',
      'Forgetting `e.preventDefault()` on form submit, which causes a full page reload and wipes out all in-memory React state.'
    ],
    keyTakeaway: 'SyntheticEvent ensures cross-browser compatibility and event delegation. Pass functions by reference, never invoke them inline.',
    componentKey: 'EventsDemo',
    tags: ['events', 'synthetic-event', 'preventDefault', 'delegation']
  },
  {
    id: '1.8',
    level: 1,
    levelTitle: 'Fundamentals',
    title: '1.8 Styling in React',
    summary: 'Comparison of styling strategies: CSS Modules, Inline Styles, CSS-in-JS, and Utility-first (Tailwind CSS).',
    whatIsIt: `There are several ways to style components in React, each with distinct trade-offs in performance, modularity, and Server Component compatibility:
1. **CSS Modules**: Automatically scoped CSS class names with unique hashes. Zero global collisions and zero runtime overhead.
2. **Inline Styles (\`style={{ ... }}\`)**: JavaScript objects with camelCase properties. Useful for dynamically computed values (coordinates, progress percentages), but cannot handle pseudo-classes (\`:hover\`) or media queries.
3. **Tailwind CSS**: Utility-first approach compiled at build time. Maximum performance, tiny bundle footprint, and full compatibility with React Server Components (RSC).
4. **Runtime CSS-in-JS (styled-components / Emotion)**: Highly dynamic but adds client runtime style injection overhead and has compatibility limitations with RSC.`,
    codeSnippet: `// 1. Tailwind CSS (Modern recommended)
<button className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-lg transition-colors">
  Tailwind Button
</button>

// 2. Inline styles (Best for dynamically computed properties)
<div style={{ width: \`\${progress}%\`, backgroundColor: dynamicColor }} />

// 3. CSS Modules
// import styles from './Button.module.css';
// <button className={styles.primary}>Modular Button</button>`,
    interviewTips: [
      'Highlight why the industry migrated away from runtime CSS-in-JS (styled-components) toward Tailwind CSS or Vanilla Extract: native compatibility with React Server Components (RSC) and zero main-thread serialization cost.',
      'Mention that inline styles create a new object reference on every render, which can bust `React.memo` optimizations on child components if not used cautiously.'
    ],
    commonTraps: [
      'Using inline styles for all UI styling, sacrificing pseudo-classes, media queries, and stylesheet caching optimizations.',
      'Global CSS class name collisions caused by avoiding CSS Modules or scoped utility classes.'
    ],
    keyTakeaway: 'Tailwind CSS and CSS Modules deliver scoped, high-performance styling at build time with zero runtime penalties in RSC.',
    componentKey: 'StylesComparisonDemo',
    tags: ['styles', 'tailwind', 'css-modules', 'inline-styles', 'rsc']
  },
  {
    id: '1.9',
    level: 1,
    levelTitle: 'Fundamentals',
    title: '1.9 Unidirectional Data Flow',
    summary: 'State flows down as props and notifications flow up as callbacks, ensuring predictability and clear debugging.',
    whatIsIt: `Unidirectional data flow is the core architectural rule of React:
- **Data flows down** from parent components to children exclusively via **props**.
- **Events flow up** from child components to parents by invoking **callback functions** passed as props.
- A child component must never directly mutate parent state.

Why this is superior to traditional two-way data binding:
- **Predictability**: You always know exactly which component owns the state and who has authority to mutate it.
- **Straightforward debugging**: When a value is corrupted, you follow the flow up the tree to the single component owning that state.`,
    codeSnippet: `// Parent Component: Owner of state
function CounterPanel() {
  const [count, setCount] = useState(0);

  return (
    <div className="p-4 border rounded">
      <h3>Parent value: {count}</h3>
      {/* Data flows down as prop (value), intent flows up as callback (onIncrement) */}
      <ChildCounter value={count} onIncrement={() => setCount(c => c + 1)} />
    </div>
  );
}

// Child Component: Presentational and dependent
function ChildCounter({ value, onIncrement }: { value: number; onIncrement: () => void }) {
  return (
    <button onClick={onIncrement} className="btn-primary">
      Child says: {value} (Click to increment)
    </button>
  );
}`,
    interviewTips: [
      'Contrast React\'s unidirectional data flow with early AngularJS two-way data binding: bidirectional binding created cascading side effects that were difficult to track.',
      'Explain the maxim: "Data flows down, events flow up".'
    ],
    commonTraps: [
      'Attempting to mirror parent state into child state with `useState(props.value)` without updating it when the prop changes.',
      'Mutating parent state directly by passing a mutable object reference to the child.'
    ],
    keyTakeaway: 'Data flows down via props; events flow up via callbacks. The component owning the state is the only one authorized to modify it.',
    componentKey: 'DataFlowDemo',
    tags: ['unidirectional-data-flow', 'props-down-events-up', 'callbacks', 'predictability']
  }
];
