import { ExerciseItem } from '@/types';

export const EXERCISES: ExerciseItem[] = [
  {
    id: 'ex1',
    title: '1. Advanced Counter with History and Boundaries',
    description: 'Build a counter featuring increment, decrement, reset, configurable min/max limits, and step-by-step history logs.',
    difficulty: 'Basic',
    topicsTested: ['useState', 'Functional updates', 'Array immutability', 'Props'],
    componentKey: 'CounterExercise',
    hints: [
      'Use setCount(prev => ...) to avoid stale state closures.',
      'Persist history as an array of objects with timestamps and deltas.',
      'Enforce min/max boundaries prior to state updates.'
    ]
  },
  {
    id: 'ex2',
    title: '2. Complete To-do List (CRUD + Filters + Persistence)',
    description: 'Task management list with creation, completion toggling, deletion, inline editing, status filters (All / Active / Completed), and localStorage sync.',
    difficulty: 'Basic',
    topicsTested: ['useState', 'Lists and key prop', 'useEffect / localStorage', 'Form events'],
    componentKey: 'TodoExercise',
    hints: [
      'Generate stable unique IDs using crypto.randomUUID().',
      'Never use array indices as task keys.',
      'Use immutable transformations with .map() for toggles and .filter() for deletions.'
    ]
  },
  {
    id: 'ex3',
    title: '3. Real-Time Search with Debounce and Cancellation',
    description: 'Search input throttling requests against a simulated API via a custom `useDebounce` hook, with loading states, error handling, active debounce indicators, and out-of-order request cancellation.',
    difficulty: 'Intermediate',
    topicsTested: ['Custom hooks', 'useDebounce', 'useEffect cleanup', 'Async request handling'],
    componentKey: 'DebounceSearchExercise',
    hints: [
      'Set up a timeout in useDebounce and clear it inside the useEffect cleanup return.',
      'Mitigate race conditions using a mounted flag or AbortController.'
    ]
  },
  {
    id: 'ex4',
    title: '4. Paginated Data Fetching with Loading and Error States',
    description: 'Fetch and display simulated API datasets with explicit `isLoading`, `error`, and `data` states, previous/next pagination controls, and page size selectors.',
    difficulty: 'Intermediate',
    topicsTested: ['Data Fetching', 'AbortController', 'Error boundaries', 'Controlled inputs'],
    componentKey: 'PaginatedFetchExercise',
    hints: [
      'Reset loading state before initiating each new network call.',
      'Use AbortController to abort pending requests if the user navigates before completion.'
    ]
  },
  {
    id: 'ex5',
    title: '5. Infinite Scroll with IntersectionObserver',
    description: 'Feed list that automatically triggers new batches of items when the user approaches the bottom via the `IntersectionObserver` API without layout jitter.',
    difficulty: 'Intermediate',
    topicsTested: ['useRef sentinel node', 'IntersectionObserver in useEffect', 'Cumulative arrays'],
    componentKey: 'InfiniteScrollExercise',
    hints: [
      'Mount a sentinel <div ref={sentinelRef} /> at the bottom of the list.',
      'Disconnect the observer inside the useEffect cleanup function.'
    ]
  },
  {
    id: 'ex6',
    title: '6. Accessible Modal with createPortal & Focus Trapping',
    description: 'Floating dialog rendered directly into `document.body` via `createPortal`, featuring backdrop blur, Escape key dismissal, keyboard focus trapping, and smooth transitions.',
    difficulty: 'Intermediate',
    topicsTested: ['createPortal', 'Global useEffect listeners', 'Accessibility (role="dialog", aria-modal)', 'Event bubbling'],
    componentKey: 'PortalModalExercise',
    hints: [
      'Ensure the component is mounted before querying document.body to avoid SSR hydration mismatches.',
      'Use e.stopPropagation() on the modal container to prevent backdrop clicks from dismissing.'
    ]
  },
  {
    id: 'ex7',
    title: '7. Accessible Tabs Component (WAI-ARIA)',
    description: 'Tabbed navigation with smooth panels, semantic `role="tablist"`, `role="tab"`, and `role="tabpanel"` attributes, and full arrow key keyboard navigation.',
    difficulty: 'Intermediate',
    topicsTested: ['Compound components', 'WAI-ARIA accessibility', 'Keyboard event management'],
    componentKey: 'TabsExercise',
    hints: [
      'Link tabs to their panels using aria-controls and aria-labelledby.',
      'Manage tabIndex dynamically (0 for the selected active tab, -1 for inactive tabs).'
    ]
  },
  {
    id: 'ex8',
    title: '8. Collapsible Accordion with Single and Multiple Expansion',
    description: 'Interactive FAQ/Accordion supporting exclusive mode (only one item expanded at a time) or multi-expansion mode (multiple panels opened concurrently).',
    difficulty: 'Basic',
    topicsTested: ['Conditional state', 'Set / Array of active IDs', 'Collapse animations'],
    componentKey: 'AccordionExercise',
    hints: [
      'Represent multi-selection state using a Set<string> or string[].',
      'Apply aria-expanded attributes to header buttons.'
    ]
  },
  {
    id: 'ex9',
    title: '9. Autocomplete Search with Keyboard Navigation',
    description: 'Intelligent autocomplete combobox featuring a dropdown list, matched substring highlighting, and complete arrow-key navigation (Arrow Up, Arrow Down, Enter to select, Escape to close).',
    difficulty: 'Advanced',
    topicsTested: ['Focus management', 'onKeyDown listeners', 'Active index synchronization', 'useRef'],
    componentKey: 'AutocompleteExercise',
    hints: [
      'Track activeIndex state for keyboard-highlighted list items.',
      'Auto-scroll active items into view if the dropdown list overflows.'
    ]
  },
  {
    id: 'ex10',
    title: '10. Essential Custom Hooks Laboratory',
    description: 'Interactive sandbox to test and master the 4 most commonly asked custom hooks in senior interviews: `useFetch`, `useLocalStorage`, `usePrevious`, and `useDebounce`.',
    difficulty: 'Advanced',
    topicsTested: ['useLocalStorage', 'usePrevious with useRef', 'useDebounce', 'useFetch with abort'],
    componentKey: 'CustomHooksExercise',
    hints: [
      'usePrevious saves values to ref.current within useEffect, meaning it holds the previous value during the current render.',
      'useLocalStorage must gracefully catch JSON.parse exceptions and quota errors.'
    ]
  },
  {
    id: 'ex11',
    title: '11. Robust Form Validation with Zod & React Hook Form',
    description: 'Production registration form featuring real-time schema validation with Zod and React Hook Form, high-performance uncontrolled inputs, submission states, and accessible error alerts.',
    difficulty: 'Advanced',
    topicsTested: ['React Hook Form', 'Zod validation', 'Uncontrolled inputs', 'Accessible error states'],
    componentKey: 'ValidatedFormExercise',
    hints: [
      'Define schemas with z.object({ email: z.string().email(), ... }).',
      'Pass zodResolver(schema) to useForm to bind strongly typed validation schemas.'
    ]
  },
  {
    id: 'ex12',
    title: '12. Optimistic UI with Automated Server Rollback',
    description: 'Implement optimistic updates on social post actions (Like / Bookmark and comments). The UI updates state instantly (0ms); if the simulated network call fails after 1.5s, it rolls back automatically with toast notifications and retry options.',
    difficulty: 'Advanced',
    topicsTested: ['Optimistic updates', 'Rollback handling', 'Network failure simulation', 'useOptimistic'],
    componentKey: 'OptimisticUpdateExercise',
    hints: [
      'Snapshot previous state prior to mutating state optimistically to cleanly revert on error.',
      'Show clear visual sync indicators (e.g., "Syncing..." badges).',
      'In React 19, this pattern is streamlined natively via the useOptimistic hook.'
    ]
  },
  {
    id: 'ex13',
    title: '13. Accessible Star Rating Component (WAI-ARIA & Keyboard)',
    description: 'Interactive 5-star rating component with hover previews, persistent selection, reset actions, and complete keyboard controls (Left/Right arrows, Home/End, Enter/Space) with aria-checked states.',
    difficulty: 'Intermediate',
    topicsTested: ['WAI-ARIA accessibility', 'onKeyDown event listeners', 'role="radiogroup"', 'Hover vs selection state'],
    componentKey: 'StarRatingExercise',
    hints: [
      'Separate rating (committed value) from hoverRating (transient preview).',
      'Apply role="radiogroup" to the container and role="radio" to each star with aria-checked and tabIndex.',
      'Support ArrowRight/ArrowLeft to increment and decrement ratings accessibly.'
    ]
  }
];
