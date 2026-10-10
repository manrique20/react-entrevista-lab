import { JsRiddle } from '@/types/javascript';

export interface ReactRiddle extends JsRiddle {
  topicCategory?: string;
}

export const reactRiddlesData: ReactRiddle[] = [
  {
    id: 'R1',
    title: 'Automatic Batching in Event Handlers',
    topicCategory: 'State & Render',
    codeSnippet: `function Counter() {
  const [count, setCount] = useState(0);

  const handleClick = () => {
    setCount(count + 1);
    setCount(count + 1);
    setCount(count + 1);
    console.log(count);
  };

  return <button onClick={handleClick}>{count}</button>;
}`,
    expectedOutput: 'Console logs 0; next render displays 1 on the button',
    explanation:
      'All three setCount calls read the same count value (0) captured in the current render closure. In React 18/19, Automatic Batching groups all three updates into a single re-render, applying count = 0 + 1.',
    trapExplanation:
      'setState schedules a render and does not mutate the count variable synchronously. To accumulate updates within a single event, use functional updates: setCount(prev => prev + 1).',
    options: [
      'Console logs 0; next render displays 1 on the button',
      'Console logs 3; next render displays 3 on the button',
      'Console logs 1; next render displays 3 on the button',
      'Console logs 0; next render displays 3 on the button'
    ]
  },
  {
    id: 'R2',
    title: 'The Index as Key Trap in Dynamic Lists',
    topicCategory: 'Diffing & Reconciliation',
    codeSnippet: `function List() {
  const [items, setItems] = useState(['A', 'B', 'C']);

  const removeFirst = () => {
    setItems(items.slice(1)); // Removes 'A'
  };

  return (
    <div>
      <button onClick={removeFirst}>Remove first</button>
      {items.map((item, index) => (
        <div key={index}>
          <span>{item}: </span>
          <input defaultValue={'Text ' + item} />
        </div>
      ))}
    </div>
  );
}`,
    expectedOutput: 'Rendered text shows B and C, but inputs retain "Text A" and "Text B"',
    explanation:
      'When "A" is removed, "B" and "C" shift to indices 0 and 1. React\'s reconciliation diffing checks key="0" and key="1", assumes the original components persisted, and preserves the uncontrolled DOM inputs\' internal state.',
    trapExplanation:
      'Using indices as keys corrupts the internal state of uncontrolled inputs, checkboxes, and CSS transitions whenever lists are reordered, filtered, or deleted.',
    options: [
      'Rendered text shows B and C, but inputs retain "Text A" and "Text B"',
      'Inputs update correctly to "Text B" and "Text C"',
      'A reconciliation runtime error is thrown due to missing indices',
      'All inputs reset to blank values'
    ]
  },
  {
    id: 'R3',
    title: 'Stale Closure in useEffect with setInterval',
    topicCategory: 'Hooks & Closures',
    codeSnippet: `function Timer() {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds(seconds + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return <h1>{seconds}</h1>;
}`,
    expectedOutput: 'Increments to 1 after 1 second, then remains frozen at 1 indefinitely',
    explanation:
      'The effect has an empty dependency array ([]), meaning the setInterval callback is created once on mount, capturing seconds = 0 in its closure. Every second it executes setSeconds(0 + 1) perpetually.',
    trapExplanation:
      'To prevent stale closures in intervals without resetting the timer every second, use functional state updates: setSeconds(prev => prev + 1).',
    options: [
      'Increments to 1 after 1 second, then remains frozen at 1 indefinitely',
      'Increments every second: 1, 2, 3, 4... without issue',
      'Increments exponentially due to duplicate timers',
      'Throws a React runtime lifecycle error'
    ]
  },
  {
    id: 'R4',
    title: 'Direct In-Place Mutation vs Object.is Comparison',
    topicCategory: 'Immutability',
    codeSnippet: `function UserList() {
  const [users, setUsers] = useState(['Ana', 'Luis']);

  const addUser = () => {
    users.push('Carlos');
    setUsers(users);
  };

  return (
    <div>
      <button onClick={addUser}>Add</button>
      <p>Total: {users.length}</p>
    </div>
  );
}`,
    expectedOutput: 'React detects identical array reference and skips re-render; UI remains at "Total: 2"',
    explanation:
      'React checks next state against previous state with Object.is(users, users). Because users.push mutated the array at the same heap memory address, the reference is identical and React bails out of re-rendering.',
    trapExplanation:
      'Mutating arrays or objects in place and passing them to setState triggers a bailout. Always generate a fresh immutable reference: setUsers([...users, "Carlos"]).',
    options: [
      'React detects identical array reference and skips re-render; UI remains at "Total: 2"',
      'React re-renders immediately displaying "Total: 3"',
      'setUsers throws a TypeError because state is read-only by default',
      'The button freezes and ignores further clicks'
    ]
  },
  {
    id: 'R5',
    title: 'useEffect Execution Order in Parent-Child Hierarchy',
    topicCategory: 'Lifecycle & Render',
    codeSnippet: `function Child() {
  useEffect(() => {
    console.log('Child Effect');
  }, []);
  return <span>Child</span>;
}

function Parent() {
  useEffect(() => {
    console.log('Parent Effect');
  }, []);
  return <Child />;
}`,
    expectedOutput: '"Child Effect" followed by "Parent Effect"',
    explanation:
      'React\'s component tree mounts bottom-up. A parent component does not complete its mounting phase until all its children have mounted. Therefore, passive child effects fire before parent effects.',
    trapExplanation:
      'Do not assume parent effects run first because parent render functions execute earlier. Rendering is top-down, but effect execution on mount is bottom-up.',
    options: [
      '"Child Effect" followed by "Parent Effect"',
      '"Parent Effect" followed by "Child Effect"',
      'Both execute simultaneously in parallel Web Worker threads',
      'Only "Parent Effect" executes'
    ]
  },
  {
    id: 'R6',
    title: 'The Falsy 0 Trap in JSX (0 && <Component />)',
    topicCategory: 'JSX & Conditionals',
    codeSnippet: `function Badge({ unreadCount }: { unreadCount: number }) {
  return (
    <div>
      {unreadCount && <span>You have messages</span>}
    </div>
  );
}
// Rendered as: <Badge unreadCount={0} />`,
    expectedOutput: 'Renders the visible number 0 in the DOM (<div>0</div>)',
    explanation:
      'The && operator returns the first falsy operand. Because unreadCount is 0, the expression evaluates to 0. In JSX, false, null, and undefined render nothing, but the numeric primitive 0 is rendered as visible text "0".',
    trapExplanation:
      'Never use count && <Component /> for numeric checks. Use explicit boolean comparisons: count > 0 && <Component /> or Boolean(count) && <Component />.',
    options: [
      'Renders the visible number 0 in the DOM (<div>0</div>)',
      'Renders nothing in the DOM (empty <div></div>)',
      'Renders the text "You have messages"',
      'Throws a JSX compilation type error'
    ]
  },
  {
    id: 'R7',
    title: 'Chained Functional Updates in Fiber Queue',
    topicCategory: 'State & Queues',
    codeSnippet: `function Clicker() {
  const [count, setCount] = useState(0);

  const handleClick = () => {
    setCount(prev => prev + 1);
    setCount(prev => prev + 2);
    setCount(prev => prev + 5);
  };

  return <button onClick={handleClick}>{count}</button>;
}`,
    expectedOutput: 'The button updates to 8 in a single re-render',
    explanation:
      'Unlike direct value setters, updater functions are enqueued on the fiber\'s updateQueue. React evaluates them sequentially during the render phase: 0 -> 0 + 1 = 1 -> 1 + 2 = 3 -> 3 + 5 = 8.',
    trapExplanation:
      'Functional updates guarantee each updater receives the intermediate queued value without waiting for successive re-renders.',
    options: [
      'The button updates to 8 in a single re-render',
      'The button updates to 5',
      '3 separate re-renders occur successively (1 -> 3 -> 8)',
      'The button updates to 1'
    ]
  },
  {
    id: 'R8',
    title: 'Double Invocation in React.StrictMode during Development',
    topicCategory: 'StrictMode & Concurrency',
    codeSnippet: `let renders = 0;

function MyComponent() {
  renders++;
  console.log('Render:', renders);
  return <h1>Hello</h1>;
}
// Mounted inside <React.StrictMode> in development`,
    expectedOutput: 'Logs "Render: 1" followed by "Render: 2" during initial mount',
    explanation:
      'In development with StrictMode active, React intentionally executes component bodies twice to help developers detect unintentional side effects and impure mutations occurring outside useEffect.',
    trapExplanation:
      'StrictMode double-rendering occurs exclusively in development environments (next dev); in production builds (next build / start) every component renders exactly once.',
    options: [
      'Logs "Render: 1" followed by "Render: 2" during initial mount',
      'Logs only "Render: 1"',
      'Throws a compilation warning for accessing an outer variable',
      'Logs "Render: 1" every 1000ms indefinitely'
    ]
  }
];
