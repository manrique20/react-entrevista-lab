export interface RefactoringCase {
  id: string;
  title: string;
  category: 'React Hooks & State' | 'Component Architecture' | 'Async & Network' | 'Performance & Memory';
  difficulty: 'Mid-Senior' | 'Senior' | 'Staff';
  summary: string;
  interviewContext: string;
  beforeCode: string;
  beforeFilename: string;
  smellsList: {
    lineHint?: string;
    issue: string;
    impact: string;
  }[];
  afterCode: string;
  afterFilename: string;
  improvementsList: {
    feature: string;
    benefit: string;
  }[];
  seniorAnswerSummary: string;
  architecturalTradeoffs: string[];
  followUpQuestions: {
    question: string;
    answer: string;
  }[];
}

export const REFACTORING_CASES: RefactoringCase[] = [
  {
    id: 'case-1-useeffect-cascade',
    title: 'The Cascading useEffect Hell vs Pure Derivation',
    category: 'React Hooks & State',
    difficulty: 'Senior',
    summary:
      'Multiple chained useEffect hooks synchronizing filtering, sorting, and counters causing UI flicker, 3-4 unnecessary re-renders, and race conditions.',
    interviewContext:
      'The interviewer presents a filtering component and asks: "Why does this component feel sluggish and flicker when toggling filters? How would you refactor it following modern React guidelines?"',
    beforeFilename: 'ProductFilters.antipattern.tsx',
    beforeCode: `// ❌ CODE SMELL: Cascading state synchronization with useEffect
function ProductList({ products }) {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [sortedProducts, setSortedProducts] = useState([]);
  const [resultsCount, setResultsCount] = useState(0);

  // Effect 1: Filters when category or query changes
  useEffect(() => {
    const filtered = products.filter(p => {
      const matchCat = selectedCategory === 'all' || p.category === selectedCategory;
      const matchQuery = p.name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchQuery;
    });
    setFilteredProducts(filtered); // Extra Render #1
  }, [products, selectedCategory, searchQuery]);

  // Effect 2: Sorts whenever filtered array updates
  useEffect(() => {
    const sorted = [...filteredProducts].sort((a, b) => b.price - a.price);
    setSortedProducts(sorted); // Extra Render #2
  }, [filteredProducts]);

  // Effect 3: Updates counter whenever sorted array updates
  useEffect(() => {
    setResultsCount(sortedProducts.length); // Extra Render #3
  }, [sortedProducts]);

  return (
    <div>
      <span>Results: {resultsCount}</span>
      {sortedProducts.map(p => <ProductCard key={p.id} product={p} />)}
    </div>
  );
}`,
    smellsList: [
      {
        lineHint: 'filteredProducts, sortedProducts, resultsCount in useState',
        issue: 'Redundant state stored in useState for values directly derivable from existing state.',
        impact: 'Transient desynchronization between source state and derived state variables.'
      },
      {
        lineHint: '3 chained useEffect calls',
        issue: 'Render cascade (Render 1 -> Effect 1 -> Render 2 -> Effect 2 -> Render 3 -> Effect 3 -> Render 4).',
        impact: 'Visible UI flicker, main thread contention, and potential race conditions.'
      }
    ],
    afterFilename: 'ProductList.senior.tsx',
    afterCode: `// ✅ SENIOR SOLUTION: Pure in-render derivation with useMemo
function ProductList({ products }: { products: Product[] }) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // 1. Pure, deterministic derivation with zero useEffect hooks
  const sortedProducts = useMemo(() => {
    return products
      .filter(p => {
        const matchCat = selectedCategory === 'all' || p.category === selectedCategory;
        const matchQuery = p.name.toLowerCase().includes(searchQuery.toLowerCase());
        return matchCat && matchQuery;
      })
      .sort((a, b) => b.price - a.price);
  }, [products, selectedCategory, searchQuery]);

  // 2. Count derived instantaneously in O(1) time
  const resultsCount = sortedProducts.length;

  return (
    <div>
      <span>Results: {resultsCount}</span>
      {sortedProducts.map(p => (
        <ProductCard key={p.id} product={p} />
      ))}
    </div>
  );
}`,
    improvementsList: [
      {
        feature: 'Zero useEffect hooks for synchronizing derived state',
        benefit: 'Reduces 4 sequential render passes down to exactly 1 atomic synchronous render.'
      },
      {
        feature: 'useMemo bound strictly to source dependencies',
        benefit: 'When parents re-render for unrelated reasons, expensive filtering passes are safely skipped.'
      },
      {
        feature: 'resultsCount derived inline',
        benefit: 'Mathematically impossible for count to desynchronize from the rendered list.'
      }
    ],
    seniorAnswerSummary:
      'Golden Rule of Modern React: "You do not need an effect to transform data for rendering". If a value can be computed from existing props or state, compute it directly during render or memoize it with useMemo.',
    architecturalTradeoffs: [
      'For lists under 200 items, even useMemo is unnecessary overhead; inline filtering executes in sub-millisecond CPU time.',
      'For massive collections exceeding 10,000 records, filtering should be delegated to backend search queries with URL parameters or offloaded to a Web Worker.'
    ],
    followUpQuestions: [
      {
        question: 'What if the active category must be synced to the URL query string?',
        answer: 'Sync it inside the onClick/onChange event handler directly (using useRouter.push or nuqs), never in a passive useEffect.'
      }
    ]
  },
  {
    id: 'case-2-boolean-prop-explosion',
    title: 'Monolithic 15-Prop Coupling vs Compound Components',
    category: 'Component Architecture',
    difficulty: 'Senior',
    summary:
      'A monolithic modal/select component polluted with dozens of boolean configuration props that becomes unmaintainable with every design change.',
    interviewContext:
      'The interviewer presents a `<Modal>` component taking 18 props and asks: "Design wants a secondary button on the left and a tooltip on the title in only 1 out of 10 pages. How do you redesign this component to support arbitrary variations without adding more boolean flags?"',
    beforeFilename: 'MonolithicModal.antipattern.tsx',
    beforeCode: `// ❌ CODE SMELL: "Prop Explosion" and total loss of layout flexibility
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  showIcon?: boolean;
  iconType?: 'warning' | 'info' | 'success';
  content: string;
  showCancelButton?: boolean;
  cancelText?: string;
  showConfirmButton?: boolean;
  confirmText?: string;
  isConfirmDisabled?: boolean;
  footerAlign?: 'left' | 'center' | 'right';
  hasTooltipInTitle?: boolean;
  tooltipText?: string;
  customExtraButton?: boolean;
  extraButtonText?: string;
}

function MonolithicModal(props: ModalProps) {
  if (!props.isOpen) return null;
  return (
    <div className="backdrop">
      <div className="modal-box">
        <header>
          {props.showIcon && <Icon type={props.iconType} />}
          <h2>{props.title}</h2>
          {props.hasTooltipInTitle && <Tooltip text={props.tooltipText} />}
          {props.subtitle && <p>{props.subtitle}</p>}
        </header>
        <div className="body">{props.content}</div>
        <footer style={{ justifyContent: props.footerAlign || 'right' }}>
          {props.customExtraButton && <button>{props.extraButtonText}</button>}
          {props.showCancelButton && <button onClick={props.onClose}>{props.cancelText}</button>}
          {props.showConfirmButton && <button disabled={props.isConfirmDisabled}>{props.confirmText}</button>}
        </footer>
      </div>
    </div>
  );
}`,
    smellsList: [
      {
        lineHint: '17 boolean and conditional props',
        issue: 'Violates Open/Closed Principle: every new design requirement forces edits inside the Modal component.',
        impact: 'High regression risk across existing views currently using the component.'
      },
      {
        lineHint: 'content: string and rigid footer layout',
        issue: 'No inversion of control; the component dictates inner layout rather than supporting composition.',
        impact: 'Impossible to embed form inputs, multi-step wizards, or custom actions without duplicating the modal.'
      }
    ],
    afterFilename: 'CompoundModal.senior.tsx',
    afterCode: `// ✅ SENIOR SOLUTION: Compound Components pattern with React Context
interface ModalContextType {
  onClose: () => void;
}
const ModalContext = createContext<ModalContextType | null>(null);

function ModalRoot({ isOpen, onClose, children }: { isOpen: boolean; onClose: () => void; children: React.ReactNode }) {
  if (!isOpen) return null;
  return (
    <ModalContext.Provider value={{ onClose }}>
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
        <div className="bg-card border rounded-2xl p-6 max-w-lg w-full shadow-2xl animate-scaleUp">
          {children}
        </div>
      </div>
    </ModalContext.Provider>
  );
}

function ModalHeader({ children }: { children: React.ReactNode }) {
  const ctx = useContext(ModalContext);
  return (
    <div className="flex items-center justify-between border-b pb-3 mb-4">
      <div className="flex items-center gap-2">{children}</div>
      <button onClick={ctx?.onClose} className="text-muted hover:text-foreground">✕</button>
    </div>
  );
}

function ModalBody({ children }: { children: React.ReactNode }) {
  return <div className="space-y-4 text-sm leading-relaxed">{children}</div>;
}

function ModalFooter({ children, align = 'end' }: { children: React.ReactNode; align?: 'start' | 'center' | 'end' }) {
  return <div className={\`flex items-center justify-\${align} gap-3 pt-4 border-t mt-4\`}>{children}</div>;
}

export const Modal = Object.assign(ModalRoot, {
  Header: ModalHeader,
  Body: ModalBody,
  Footer: ModalFooter,
});

// 🚀 Elegant, 100% flexible consumer usage:
// <Modal isOpen={isOpen} onClose={handleClose}>
//   <Modal.Header>
//     <ShieldAlert className="text-amber-500" />
//     <h3 className="font-bold">Confirm Transaction</h3>
//   </Modal.Header>
//   <Modal.Body>Are you sure you want to transfer these funds?</Modal.Body>
//   <Modal.Footer align="end">
//     <button onClick={handleClose}>Cancel</button>
//     <button className="btn-danger">Confirm</button>
//   </Modal.Footer>
// </Modal>`,
    improvementsList: [
      {
        feature: 'Open/Closed Principle satisfied',
        benefit: 'Arbitrary modal layouts are composed without modifying a single line of the core component.'
      },
      {
        feature: 'Full Inversion of Control to consumers',
        benefit: 'Consumers decide placement for icons, tooltips, forms, or secondary buttons.'
      },
      {
        feature: 'Intuitive, modular API (Modal.Header, Modal.Body, Modal.Footer)',
        benefit: 'Identical to industry-standard libraries like Radix UI or Headless UI.'
      }
    ],
    seniorAnswerSummary:
      'The Compound Components pattern delegates layout and content responsibility to consumers via JSX composition, while the parent container manages shared modal lifecycle and accessibility (WAI-ARIA dialog, focus trapping).',
    architecturalTradeoffs: [
      'Requires checking that compound subcomponents are rendered within the Provider, throwing helpful descriptive errors if context is null.',
      'In React 19 / Server Components, the Modal root must be marked "use client" due to the context hook.'
    ],
    followUpQuestions: [
      {
        question: 'How would you ensure full accessibility (a11y) in this compound modal?',
        answer: 'Add aria-modal="true", role="dialog", automated focus trap on the first interactive element, and an Escape key listener.'
      }
    ]
  },
  {
    id: 'case-3-data-fetching-race-condition',
    title: 'Data Fetching Race Conditions with useEffect',
    category: 'Async & Network',
    difficulty: 'Senior',
    summary:
      'Un-cancelled asynchronous fetch calls inside useEffect where a slow earlier response overwrites newer query results.',
    interviewContext:
      'The interviewer asks: "A user types \'react\', quickly clears, and types \'vue\'. The \'react\' response takes 800ms and \'vue\' takes 200ms. Why does the screen display React data even though the input says Vue? How do you fix it?"',
    beforeFilename: 'SearchBox.racecondition.tsx',
    beforeCode: `// ❌ CODE SMELL: Concurrent fetches without cancellation (Race Condition)
function UserSearch() {
  const [query, setQuery] = useState('');
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!query) {
      setUsers([]);
      return;
    }

    setLoading(true);
    // DANGER: If this request resolves slower than a subsequent one,
    // it will overwrite fresher search data upon resolving.
    fetch(\`/api/users?search=\${query}\`)
      .then(res => res.json())
      .then(data => {
        setUsers(data);
        setLoading(false);
      });
  }, [query]);

  return (
    <div>
      <input value={query} onChange={e => setQuery(e.target.value)} />
      {loading && <p>Searching...</p>}
      <ul>{users.map(u => <li key={u.id}>{u.name}</li>)}</ul>
    </div>
  );
}`,
    smellsList: [
      {
        lineHint: 'fetch() without AbortController or ignore flag',
        issue: 'Race condition inherent to out-of-order network response arrival.',
        impact: 'UI renders out-of-date results conflicting with current search input.'
      },
      {
        lineHint: 'setLoading(false) without cancellation handling',
        issue: 'State updates invoked after query updates or component unmount.',
        impact: 'Inconsistent loading spinner states and memory leak warnings.'
      }
    ],
    afterFilename: 'UserSearch.abortcontroller.tsx',
    afterCode: `// ✅ SENIOR SOLUTION: Native AbortController with useEffect cleanup
function UserSearch() {
  const [query, setQuery] = useState('');
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!query.trim()) {
      setUsers([]);
      setLoading(false);
      return;
    }

    // 1. Instantiate native network abort controller
    const controller = new AbortController();
    const { signal } = controller;

    setLoading(true);
    setError(null);

    fetch(\`/api/users?search=\${encodeURIComponent(query)}\`, { signal })
      .then(res => {
        if (!res.ok) throw new Error('Failed to query users');
        return res.json();
      })
      .then(data => {
        setUsers(data);
        setLoading(false);
      })
      .catch(err => {
        // 2. Safely ignore intentional cancellation errors
        if (err.name === 'AbortError') return;
        setError(err.message);
        setLoading(false);
      });

    // 3. Deterministic cleanup: React aborts in-flight request when query changes
    return () => {
      controller.abort();
    };
  }, [query]);

  return (
    <div>
      <input value={query} onChange={e => setQuery(e.target.value)} />
      {loading && <Spinner />}
      {error && <Alert message={error} />}
      <ul>{users.map(u => <li key={u.id}>{u.name}</li>)}</ul>
    </div>
  );
}`,
    improvementsList: [
      {
        feature: 'AbortController inside useEffect cleanup',
        benefit: 'Cancels the in-flight request at browser TCP/HTTP level, saving bandwidth and CPU.'
      },
      {
        feature: 'Guard for err.name === "AbortError"',
        benefit: 'Prevents false-positive error notifications when prior queries are aborted.'
      },
      {
        feature: 'encodeURIComponent(query)',
        benefit: 'Prevents query param injection bugs with special characters like & or ?.'
      }
    ],
    seniorAnswerSummary:
      'In React applications without caching libraries, every fetch in a useEffect MUST have an AbortController in its cleanup return. In modern production apps, this is delegated to TanStack Query (React Query) or React 19 Server Components.',
    architecturalTradeoffs: [
      'For text search, pair this with useDebounce (300ms) to avoid inundating the backend with requests on every keystroke.',
      'In Next.js App Router, prefer Server Actions or URL searchParams that stream pre-filtered data from the server.'
    ],
    followUpQuestions: [
      {
        question: 'How would you handle this in React 19 without third-party libraries?',
        answer: 'Use the `use()` hook combined with Suspense and module cache, or Server Actions paired with useTransition.'
      }
    ]
  },
  {
    id: 'case-4-boolean-state-hell',
    title: 'Boolean State Hell vs Finite State Machine (useReducer)',
    category: 'React Hooks & State',
    difficulty: 'Mid-Senior',
    summary:
      'Scattered boolean flags (isLoading, isSuccess, isError) permitting impossible states and elusive bugs.',
    interviewContext:
      'The interviewer asks: "In this payment component, a network error occasionally leaves isLoading=true and isError=true simultaneously, rendering the spinner and error banner at the same time. Why does this happen and what data structure prevents it?"',
    beforeFilename: 'PaymentCheckout.booleanhell.tsx',
    beforeCode: `// ❌ CODE SMELL: Impossible states permitted by correlated booleans
function PaymentCheckout() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [data, setData] = useState(null);

  const handlePay = async () => {
    setIsLoading(true);
    // COMMON OMISSION: Forgetting to reset isError or isSuccess
    try {
      const res = await processPayment();
      setData(res);
      setIsSuccess(true);
      // BUG: If a prior attempt failed, isError stays true if you forget setIsError(false)
    } catch (err) {
      setIsError(true);
      setErrorMessage(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <button onClick={handlePay} disabled={isLoading}>Pay</button>
      {/* INCONSISTENT RENDER: Both can evaluate to true */}
      {isLoading && <Spinner />}
      {isError && <ErrorAlert msg={errorMessage} />}
      {isSuccess && <SuccessReceipt data={data} />}
    </div>
  );
}`,
    smellsList: [
      {
        lineHint: 'isLoading, isSuccess, isError as independent states',
        issue: 'Allows impossible states: (true, true, false) or (true, false, true).',
        impact: 'UI renders conflicting states simultaneously (e.g. spinner and error message).'
      },
      {
        lineHint: 'Manual coordination of 4 state setters per transition',
        issue: 'High fragility; forgetting to reset one setter in catch or finally corrupts UI flow.',
        impact: 'Fragile logic that is difficult to reliably test.'
      }
    ],
    afterFilename: 'PaymentCheckout.statemachine.tsx',
    afterCode: `// ✅ SENIOR SOLUTION: Finite State Machine with discriminated unions & useReducer
type PaymentState =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: TransactionReceipt }
  | { status: 'error'; message: string };

type PaymentAction =
  | { type: 'START_PAYMENT' }
  | { type: 'PAYMENT_SUCCESS'; data: TransactionReceipt }
  | { type: 'PAYMENT_ERROR'; message: string }
  | { type: 'RESET' };

function paymentReducer(state: PaymentState, action: PaymentAction): PaymentState {
  switch (action.type) {
    case 'START_PAYMENT':
      return { status: 'loading' };
    case 'PAYMENT_SUCCESS':
      return { status: 'success', data: action.data };
    case 'PAYMENT_ERROR':
      return { status: 'error', message: action.message };
    case 'RESET':
      return { status: 'idle' };
    default:
      return state;
  }
}

function PaymentCheckout() {
  const [state, dispatch] = useReducer(paymentReducer, { status: 'idle' });

  const handlePay = async () => {
    dispatch({ type: 'START_PAYMENT' });
    try {
      const receipt = await processPayment();
      dispatch({ type: 'PAYMENT_SUCCESS', data: receipt });
    } catch (err) {
      dispatch({ type: 'PAYMENT_ERROR', message: err instanceof Error ? err.message : 'Unknown error' });
    }
  };

  return (
    <div>
      <button onClick={handlePay} disabled={state.status === 'loading'}>
        Pay
      </button>

      {/* DETERMINISTIC RENDER: Exactly one state can exist at a time */}
      {state.status === 'loading' && <Spinner />}
      {state.status === 'error' && <ErrorAlert msg={state.message} />}
      {state.status === 'success' && <SuccessReceipt data={state.data} />}
    </div>
  );
}`,
    improvementsList: [
      {
        feature: 'TypeScript Discriminated Union Types ({ status: ... })',
        benefit: 'Makes illegal states physically unrepresentable at compile time.'
      },
      {
        feature: 'Atomic transitions via pure reducer',
        benefit: 'Dispatching PAYMENT_SUCCESS automatically evicts loading or error state without manual setter choreographing.'
      },
      {
        feature: 'Automatic Type Narrowing in JSX',
        benefit: 'state.data is strictly typed only when status === "success", eliminating defensive null assertions.'
      }
    ],
    seniorAnswerSummary:
      'Make illegal states unrepresentable. Replace correlated boolean flags with a single enum or discriminated union managed via useReducer or state machine libraries (XState).',
    architecturalTradeoffs: [
      'For complex checkout funnels or multi-step wizards with branching transitions, formalizing with XState is ideal.',
      'For simple atomic components, a union useState<\'idle\' | \'loading\' | \'success\' | \'error\'>(\'idle\') is often sufficient without full reducers.'
    ],
    followUpQuestions: [
      {
        question: 'Why does TypeScript excel with Discriminated Unions in reducers?',
        answer: 'It enables compile-time exhaustiveness checking in switch statements (via a default: never assertion) and strictly types action payloads.'
      }
    ]
  },
  {
    id: 'case-5-accidental-shallow-mutation',
    title: 'Accidental Nested Array Mutation Breaking Diffing',
    category: 'Performance & Memory',
    difficulty: 'Senior',
    summary:
      'Using the shallow spread operator [...state] on multi-dimensional structures assuming it deep-clones, breaking React.memo bailout.',
    interviewContext:
      'The interviewer asks: "A user edits a task in a kanban column, but the Column component fails to re-render despite calling setBoard. What immutability defect exists in this code?"',
    beforeFilename: 'KanbanBoard.shallowclone.tsx',
    beforeCode: `// ❌ CODE SMELL: Shallow spread does not clone nested objects
function KanbanBoard() {
  const [board, setBoard] = useState({
    columns: [
      { id: 'c1', title: 'To Do', tasks: [{ id: 't1', title: 'Design UI', done: false }] }
    ]
  });

  const toggleTask = (columnId: string, taskId: string) => {
    // CRITICAL BUG: Clones top-level object, but columns and tasks
    // share the IDENTICAL heap memory references.
    const newBoard = { ...board };
    const column = newBoard.columns.find(c => c.id === columnId);
    if (!column) return;

    const task = column.tasks.find(t => t.id === taskId);
    if (task) {
      task.done = !task.done; // ❌ DIRECT HEAP MUTATION
    }

    setBoard(newBoard);
    // React sees board.columns[0] has identical reference to before.
    // Memoized children (<Column memo>) WILL NOT UPDATE.
  };

  return <BoardView board={board} onToggle={toggleTask} />;
}`,
    smellsList: [
      {
        lineHint: 'const newBoard = { ...board }; task.done = !task.done;',
        issue: 'Direct mutation of nested task object. Shallow spreading only copies top-level references.',
        impact: 'React.memo, DevTools Time-Travel debugging, and Concurrent Mode break unpredictably.'
      },
      {
        lineHint: 'setBoard(newBoard) with unchanged child references',
        issue: 'Subtree retains identical Object.is reference, preventing memoized children from re-rendering.',
        impact: 'UI fails to reflect user edits until an unrelated event triggers a root re-render.'
      }
    ],
    afterFilename: 'KanbanBoard.immutable.tsx',
    afterCode: `// ✅ SENIOR SOLUTION: Deep functional immutability or Immer
function KanbanBoard() {
  const [board, setBoard] = useState<Board>({
    columns: [
      { id: 'c1', title: 'To Do', tasks: [{ id: 't1', title: 'Design UI', done: false }] }
    ]
  });

  // Native functional immutable update:
  const toggleTask = (columnId: string, taskId: string) => {
    setBoard(prevBoard => ({
      ...prevBoard,
      columns: prevBoard.columns.map(col => {
        if (col.id !== columnId) return col; // Preserved reference (Bailout)
        return {
          ...col,
          tasks: col.tasks.map(task => {
            if (task.id !== taskId) return task; // Preserved reference
            return { ...task, done: !task.done }; // Fresh atomic reference
          })
        };
      })
    }));
  };

  return <BoardView board={board} onToggle={toggleTask} />;
}

// 💡 Production-grade alternative with Immer (produce):
// const toggleTaskWithImmer = (columnId: string, taskId: string) => {
//   setBoard(produce(draft => {
//     const col = draft.columns.find(c => c.id === columnId);
//     const task = col?.tasks.find(t => t.id === taskId);
//     if (task) task.done = !task.done; // Safe proxy-isolated mutation
//   }));
// };`,
    improvementsList: [
      {
        feature: 'Cascaded immutable mapping (Array.map)',
        benefit: 'Only mutated items receive new references; unaffected columns retain references for React.memo bailouts.'
      },
      {
        feature: 'Functional setter form setBoard(prev => ...)',
        benefit: 'Immune to stale closures during rapid consecutive interactions.'
      },
      {
        feature: 'Full compatibility with Immer / Zustand',
        benefit: 'Adopts the standard immutability patterns expected across production codebases.'
      }
    ],
    seniorAnswerSummary:
      'The spread operator {...obj} is strictly shallow. In deep nested data structures, mutating an inner property mutates the original heap object by reference. You must allocate new references throughout the modified branch using .map() / spread or adopt Immer (produce).',
    architecturalTradeoffs: [
      'Normalizing state (Redux-style { byId, allIds }) simplifies updates to O(1) operations without nested mapping loops.',
      'Immer introduces a negligible Proxy overhead that is virtually imperceptible in 99% of applications while preventing human mutation bugs.'
    ],
    followUpQuestions: [
      {
        question: 'What is state normalization and when should it be applied?',
        answer: 'De-nesting relational entities into lookup dictionaries indexed by ID ({ tasks: { [id]: task } }). Ideal when entities are shared or manipulated across multiple disparate components.'
      }
    ]
  }
];
