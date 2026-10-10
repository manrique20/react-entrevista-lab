import { Topic } from '@/types';

export const LEVEL_4_TOPICS: Topic[] = [
  {
    id: '4.1',
    level: 4,
    levelTitle: 'Global State & Ecosystem',
    title: '4.1 Redux Toolkit (RTK) and Flux Architecture',
    summary: 'Immutable global store with strict unidirectional flow. RTK modernizes Redux by integrating Immer for simplified syntax.',
    whatIsIt: `Redux implements the Flux architecture: a single source of truth (**Single Source of Truth**), read-only state, and mutations executed strictly by **dispatching typed actions to pure reducers**.

**Redux Toolkit (RTK)** is the official modern standard for writing Redux:
- \`createSlice\`: Combines initial state, reducers, and action creators into a single cohesive module.
- **Immer Integration**: Allows writing code that looks like direct mutations (\`state.items.push(item)\`), which Immer converts under the hood into safe immutable updates.
- \`createAsyncThunk\`: Typed handling for asynchronous workflows generating \`pending\`, \`fulfilled\`, and \`rejected\` actions.
- \`useSelector\`: Hook to select state slices with equality checks, preventing unnecessary re-renders.`,
    codeSnippet: `import { configureStore, createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Todo { id: string; text: string; completed: boolean; }

const todosSlice = createSlice({
  name: 'todos',
  initialState: { list: [] as Todo[] },
  reducers: {
    add: (state, action: PayloadAction<string>) => {
      // Immer enables direct mutation syntax safely
      state.list.push({ id: crypto.randomUUID(), text: action.payload, completed: false });
    },
    toggle: (state, action: PayloadAction<string>) => {
      const todo = state.list.find(t => t.id === action.payload);
      if (todo) todo.completed = !todo.completed;
    }
  }
});

export const { add, toggle } = todosSlice.actions;
export const store = configureStore({ reducer: { todos: todosSlice.reducer } });`,
    interviewTips: [
      'Explain Immer\'s role: in classic Redux, you had to manually shallow copy with `{ ...state, items: [...state.items, newItem] }`. In RTK, Immer creates a Draft Proxy and records mutations to produce the next immutable state.',
      'Explain when Redux Toolkit makes sense over Zustand: large enterprise codebases with dozens of engineers needing strict organizational conventions, complex middleware, and comprehensive Redux DevTools audit trails.'
    ],
    commonTraps: [
      'Storing server state (API responses) in Redux rather than using RTK Query or TanStack Query, resulting in repetitive boilerplate for loading and error states.',
      'Selecting the entire state object with `const state = useSelector(s => s)`, causing the component to re-render on ANY store change.'
    ],
    keyTakeaway: 'Redux Toolkit standardizes Redux with Immer and eliminates legacy boilerplate through concise, predictable slices.',
    componentKey: 'ReduxSimulatorDemo',
    tags: ['redux', 'redux-toolkit', 'immer', 'flux', 'slices', 'global-state']
  },
  {
    id: '4.2',
    level: 4,
    levelTitle: 'Global State & Ecosystem',
    title: '4.2 Zustand, Jotai, and Recoil (Modern State Management)',
    summary: 'Lightweight alternatives without boilerplate or Providers. Zustand uses a unified hook-based store; Jotai uses atomic state.',
    whatIsIt: `Modern state management libraries have gained popularity by eliminating ceremony and nested Providers:

1. **Zustand**:
- Built around an external centralized store that does not require wrapping your tree in Providers.
- Components subscribe using **granular selectors**: \`const count = useStore(s => s.count)\`. Only components whose selected values change will re-render.
- Tiny footprint (< 2KB), works in vanilla JS, and includes built-in persistence middleware.
2. **Jotai / Recoil (Atomic State)**:
- State is split into tiny independent units called **atoms** (\`atom(initialValue)\`).
- Atoms can be combined and derived declaratively (\`derived atoms\`), acting like reactive spreadsheets.`,
    codeSnippet: `// Global store with Zustand (zero boilerplate, no Provider)
import { create } from 'zustand';

interface CounterStore {
  count: number;
  increment: () => void;
  reset: () => void;
}

export const useCounterStore = create<CounterStore>((set) => ({
  count: 0,
  increment: () => set((state) => ({ count: state.count + 1 })),
  reset: () => set({ count: 0 })
}));

// Consuming with an optimal granular selector:
function CounterViewer() {
  // Only re-renders when 'count' changes, ignoring other store updates:
  const count = useCounterStore((state) => state.count);
  return <span>Store value: {count}</span>;
}`,
    interviewTips: [
      'Compare Zustand with Context API: Zustand uses external store subscriptions (similar to `useSyncExternalStore`), allowing it to skip renders for uninterested components without Context\'s cascading re-render problem.',
      'Explain why Zustand is often recommended for modern React: it delivers 95% of Redux\'s capabilities with 5% of the ceremonial boilerplate.'
    ],
    commonTraps: [
      'Skipping selectors in Zustand (`const { count, inc } = useStore()`), which subscribes the component to the entire store and triggers unnecessary re-renders.',
      'Using client state stores to hold remote API data that should be managed by TanStack Query.'
    ],
    keyTakeaway: 'Zustand provides providerless global state with fine-grained selectors in under 2KB.',
    componentKey: 'ZustandStoreDemo',
    tags: ['zustand', 'jotai', 'recoil', 'granular-selectors', 'atomic-state']
  },
  {
    id: '4.3',
    level: 4,
    levelTitle: 'Global State & Ecosystem',
    title: '4.3 TanStack Query (React Query) and SWR: Server State',
    summary: 'Specialized remote server state management: intelligent caching, background revalidation, retries, and optimistic mutations.',
    whatIsIt: `A major architectural shift in modern React is separating **Client State** (ephemeral UI state: open modal, active tab) from **Server State** (remote data that is asynchronously persisted and shared across clients).

**What TanStack Query provides**:
- **In-Memory Caching**: Deduplicates concurrent requests to the same query key.
- **staleTime vs gcTime**: Defines when cached data becomes stale (\`staleTime\`) and when it is garbage collected from memory (\`gcTime\`).
- **Background Revalidation**: Silently refreshes stale data on window focus (\`refetchOnWindowFocus\`) or network reconnection.
- **Optimistic Mutations**: Updates the UI immediately before server confirmation, rolling back automatically if the request fails.`,
    codeSnippet: `import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

function ProductList() {
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ['productos'],
    queryFn: () => fetch('/api/productos').then(r => r.json()),
    staleTime: 1000 * 60 * 5, // Fresh for 5 minutes
  });

  const createMutation = useMutation({
    mutationFn: (newProduct: string) => fetch('/api/productos', { method: 'POST', body: JSON.stringify({ nombre: newProduct }) }),
    // Automatic cache invalidation on success:
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['productos'] });
    }
  });

  if (isLoading) return <p>Loading products...</p>;
  return <ul>{data?.map((p: any) => <li key={p.id}>{p.nombre}</li>)}</ul>;
}`,
    interviewTips: [
      'Key interview insight: "With TanStack Query handling server state and useState/Zustand handling UI state, the need for complex global state stores drops dramatically".',
      'Explain the exact difference between `staleTime` (how long data is considered fresh before needing refetch) and `gcTime` (Garbage Collection Time: how long inactive data stays in cache after all consuming components unmount).',
    ],
    commonTraps: [
      'Storing API responses in Zustand or Redux stores using manual `useEffect` calls, having to reinvent caching, loading states, and retry logic.',
      'Forgetting to configure `staleTime` (defaults to 0 in React Query, meaning data is considered stale immediately after fetching).'
    ],
    keyTakeaway: 'Server State belongs to the remote API. Use TanStack Query to manage caching, background synchronization, and optimistic updates.',
    componentKey: 'TanStackQueryDemo',
    tags: ['tanstack-query', 'react-query', 'server-state', 'cache', 'staleTime', 'mutations']
  },
  {
    id: '4.4',
    level: 4,
    levelTitle: 'Global State & Ecosystem',
    title: '4.4 High-Performance Forms: React Hook Form + Zod',
    summary: 'Schema-based typed validation and uncontrolled components for snappy forms without excessive re-renders.',
    whatIsIt: `The modern standard for forms in React and Next.js combines:
1. **React Hook Form**:
- Uses **uncontrolled inputs** by registering DOM refs (\`{...register('campo')}\`).
- Avoids re-rendering the entire form on every keystroke.
- Provides typed reactive state for errors (\`formState.errors\`) and granular subscriptions (\`watch\`, \`useWatch\`).
2. **Zod**:
- TypeScript-first schema declaration and validation library.
- Infers static TypeScript types directly from schemas (\`z.infer<typeof schema>\`), keeping types and runtime validation in sync.
- Integrates seamlessly with React Hook Form via \`@hookform/resolvers/zod\`.`,
    codeSnippet: `import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const registrationSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  age: z.coerce.number().min(18, 'Must be at least 18 years old'),
});

type FormValues = z.infer<typeof registrationSchema>;

function AdvancedRegistrationForm() {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormValues>({
    resolver: zodResolver(registrationSchema)
  });

  const onSubmit = async (data: FormValues) => {
    console.log('Validated and typed data:', data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <input {...register('name')} placeholder="Name" />
      {errors.name && <p className="text-red-500">{errors.name.message}</p>}
      <input {...register('email')} placeholder="Email" />
      {errors.email && <p className="text-red-500">{errors.email.message}</p>}
      <input type="number" {...register('age')} placeholder="Age" />
      {errors.age && <p className="text-red-500">{errors.age.message}</p>}
      <button type="submit" disabled={isSubmitting}>Submit</button>
    </form>
  );
}`,
    interviewTips: [
      'Explain Zod\'s advantage with Next.js Server Actions: you can share the EXACT same Zod schema between client validation with React Hook Form and backend validation in Server Actions.',
      'Contrast with Formik: Formik uses controlled inputs (re-rendering on every keystroke), causing noticeable frame drops in large forms; React Hook Form avoids this with native refs.'
    ],
    commonTraps: [
      'Forgetting `z.coerce.number()` on number inputs: HTML inputs always return strings from native events, so `z.number()` fails without coercion.',
      'Duplicating TypeScript interfaces manually instead of using `z.infer<typeof schema>`.'
    ],
    keyTakeaway: 'React Hook Form + Zod provides typed validation, optimal rendering performance, and shared schemas across client and server.',
    componentKey: 'HookFormZodDemo',
    tags: ['react-hook-form', 'zod', 'schemas', 'validation', 'typescript']
  },
  {
    id: '4.5',
    level: 4,
    levelTitle: 'Global State & Ecosystem',
    title: '4.5 UI Libraries: shadcn/ui, Radix, Tailwind vs. Traditional',
    summary: 'From monolithic npm packages (MUI) to open-code ownership with shadcn/ui + Radix Primitives.',
    whatIsIt: `The UI library landscape has undergone a major shift:
1. **Traditional Monolithic Libraries (Material UI, Ant Design, Chakra)**:
Installed as heavy npm dependencies. Hard to customize beyond preset themes, inflate bundle size, and face Server Component compatibility hurdles due to runtime CSS-in-JS.
2. **Headless UI Primitives (Radix UI, React Aria, Headless UI)**:
Provide certified accessibility (WAI-ARIA), keyboard navigation, and interaction logic with zero styling opinion.
3. **The shadcn/ui Model**:
Not an npm dependency: **you copy component source code directly into your repository**.
- Built on accessible Radix UI primitives styled with Tailwind CSS.
- Full code ownership: you can customize animations, props, and markup freely.
- Zero vendor lock-in and complete compatibility with React Server Components.`,
    codeSnippet: `// shadcn/ui component concept:
// A component you own, wrapping Radix for accessibility and Tailwind for styling:
import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary/90',
        destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
        outline: 'border border-input bg-background hover:bg-accent'
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-9 rounded-md px-3',
        lg: 'h-11 rounded-md px-8'
      }
    },
    defaultVariants: { variant: 'default', size: 'default' }
  }
);`,
    interviewTips: [
      'Selection criteria for UI libraries in interviews: 1) Native accessibility (a11y), 2) Bundle size impact, 3) React Server Components (RSC) compatibility, 4) Ease of customization for company Design Systems.',
      'Explain why copying code (shadcn approach) won popularity: it eliminates vendor lock-in where an unmaintained third-party library blocks React major version upgrades.'
    ],
    commonTraps: [
      'Building complex interactive components like Selects, Modals, or Date Pickers from scratch without accessible primitives, missing focus management and screen reader support.',
      'Installing a 200KB component library bundle just to use 2 buttons.'
    ],
    keyTakeaway: 'Radix + Tailwind + shadcn dominates modern development by delivering accessible components without bundle bloat or vendor lock-in.',
    componentKey: 'UiLibrariesDemo',
    tags: ['shadcn-ui', 'radix-ui', 'tailwind', 'headless-ui', 'design-system']
  },
  {
    id: '4.6',
    level: 4,
    levelTitle: 'Global State & Ecosystem',
    title: '4.6 Advanced TypeScript with React',
    summary: 'Generic components, React event typing, discriminated unions for state, and extending native HTML props.',
    whatIsIt: `Professional TypeScript with React goes far beyond primitive types:
- **Extending Native HTML Props**: Extending \`React.ComponentProps<'button'>\` or \`React.ButtonHTMLAttributes<HTMLButtonElement>\` to inherit props like \`aria-*\`, \`disabled\`, and \`tabIndex\`.
- **Strict Event Typing**: \`React.MouseEvent<HTMLButtonElement>\`, \`React.ChangeEvent<HTMLInputElement>\`, \`React.FormEvent<HTMLFormElement>\`.
- **Discriminated Unions**: Modeling state where certain properties exist only when a discriminant has a specific value (making invalid states unrepresentable at compile time).
- **Generic Components**: Reusable typed components such as \`<List<T> items={data} renderItem={(item) => ...} />\`.`,
    codeSnippet: `// 1. Discriminated Union: Eliminates impossible states
type AsyncState<T> =
  | { status: 'idle'; data: null; error: null }
  | { status: 'loading'; data: null; error: null }
  | { status: 'success'; data: T; error: null }
  | { status: 'error'; data: null; error: string };

// 2. Generic Component <T>
interface GenericListProps<T> {
  items: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
  keyExtractor: (item: T) => string;
}

function GenericList<T>({ items, renderItem, keyExtractor }: GenericListProps<T>) {
  return (
    <ul className="divide-y">
      {items.map((item, index) => (
        <li key={keyExtractor(item)}>{renderItem(item, index)}</li>
      ))}
    </ul>
  );
}`,
    interviewTips: [
      'Explain why modern React avoids `React.FC` (FunctionComponent): it used to implicitly inject `children` even on components that did not accept them, and it complicated generic component definitions. The community standard is typing parameters directly: `function MyComp(props: MyProps)`.',
      'Explain Discriminated Unions: they prevent UI bugs where `isLoading === true` and `error !== null` occur simultaneously, enforcing a single coherent state.'
    ],
    commonTraps: [
      'Using `any` for event handler parameters instead of specific React event types (`React.ChangeEvent<HTMLInputElement>`).',
      'Failing to properly type `useRef<HTMLInputElement>(null)`, leading to runtime errors when accessing `.current`.'
    ],
    keyTakeaway: 'Leverage discriminated unions for type-safe states and generic components for reusable, type-checked UI abstractions.',
    componentKey: 'TypeScriptReactDemo',
    tags: ['typescript', 'generics', 'discriminated-unions', 'component-props']
  },
  {
    id: '4.7',
    level: 4,
    levelTitle: 'Global State & Ecosystem',
    title: '4.7 Testing Strategies in React (Vitest / Testing Library)',
    summary: 'Test visible user behavior rather than internal implementation details. Accessible query priority.',
    whatIsIt: `The guiding principle of **React Testing Library (RTL)** is:
> *"The more your tests resemble the way your software is used, the more confidence they can give you."*

Essential testing principles:
- **Do not test implementation details**: Avoid testing internal state variables, private method names, or component sub-structures. Test what users see and interact with (rendered text, clicks, form submissions).
- **Recommended Query Priority**:
1. \`getByRole\` (highest priority: mirrors how users and assistive technologies navigate: \`getByRole('button', { name: /submit/i })\`).
2. \`getByLabelText\` (for labeled form inputs).
3. \`getByPlaceholderText\` / \`getByText\`.
4. \`getByTestId\` (last resort when semantic accessible queries are not feasible).`,
    codeSnippet: `// Test with Vitest and React Testing Library:
// import { render, screen } from '@testing-library/react';
// import userEvent from '@testing-library/user-event';

/*
test('increments counter and updates accessible text', async () => {
  const user = userEvent.setup();
  render(<Counter />);

  // Query by accessible role
  const button = screen.getByRole('button', { name: /increment/i });
  expect(screen.getByText(/count: 0/i)).toBeInTheDocument();

  // Simulate real user interaction
  await user.click(button);

  // Assert visible outcome
  expect(screen.getByText(/count: 1/i)).toBeInTheDocument();
});
*/`,
    interviewTips: [
      'Contrast React Testing Library with Enzyme (legacy): Enzyme tested internal state via `wrapper.state()` and `wrapper.find("SubComponent")`. This created brittle tests that broke on internal refactoring even when user-facing behavior did not change. RTL tests remain resilient through refactoring.',
      'Mention Mock Service Worker (MSW) to mock network requests at the HTTP boundary rather than patching `global.fetch` with brittle manual mocks.'
    ],
    commonTraps: [
      'Littering components with `data-testid` instead of querying standard semantic HTML accessible roles (`button`, `dialog`, `heading`).',
      'Using `fireEvent` instead of `userEvent`: `userEvent` triggers all realistic secondary browser events (hover, focus, blur, keydown).'
    ],
    keyTakeaway: 'Test visible user experiences with `getByRole` and `userEvent`, never internal implementation details.',
    componentKey: 'TestingStrategyDemo',
    tags: ['testing', 'react-testing-library', 'vitest', 'getByRole', 'userEvent', 'msw']
  },
  {
    id: '4.8',
    level: 4,
    levelTitle: 'Global State & Ecosystem',
    title: '4.8 Accessibility (a11y) in React',
    summary: 'Semantic HTML first, focus management, WAI-ARIA, visual contrast, and live announcements with aria-live regions.',
    whatIsIt: `Building accessible web applications (WCAG 2.1) ensures that people with visual, motor, or cognitive disabilities can fully perceive and interact with your UI.

Key Accessibility Pillars in React:
1. **Semantic HTML Before ARIA**: Use \`<button>\` instead of \`<div onClick={...}>\`. Native elements provide built-in keyboard navigation (\`Enter\`, \`Space\`) and accessibility roles out of the box.
2. **Focus Management**: When opening a dialog, trap focus inside (**Focus Trap**) and move focus to the first interactive element. When closing, return focus to the initial trigger.
3. **Associated Labels**: Every input must have an associated \`<label htmlFor={id}>\` or \`aria-label\`.
4. **Live Regions (\`aria-live="polite"\`)**: Announce asynchronous changes to screen readers (success notifications, incoming messages).`,
    codeSnippet: `// Accessible component with keyboard support and live announcements:
function AccessibleNotification({ message, onClose }: { message: string; onClose: () => void }) {
  return (
    // role="status" and aria-live announce message without interrupting screen reader:
    <div role="status" aria-live="polite" className="p-4 bg-blue-50 border border-blue-200 rounded flex justify-between">
      <span>{message}</span>
      <button
        onClick={onClose}
        aria-label="Close notification" // Accessible label for visual icon
        className="text-blue-800 font-bold"
      >
        ✕
      </button>
    </div>
  );
}`,
    interviewTips: [
      'Golden Rule of ARIA: "No ARIA is better than bad ARIA. If a native HTML element exists that provides the semantic behavior, use it instead of ARIA".',
      'Explain accessibility audits: use automated tools like axe-core and Lighthouse, combined with manual keyboard testing using `Tab`, `Shift+Tab`, `Space`, and arrow keys without a mouse.'
    ],
    commonTraps: [
      'Using `<div>` with `onClick` without adding `role="button"`, `tabIndex={0}`, and handlers for `Enter` and `Space`.',
      'Removing focus outlines (`outline: none`) without providing an explicit visual replacement with `:focus-visible`.'
    ],
    keyTakeaway: 'Use native semantic HTML, ensure smooth keyboard navigation, and manage focus for dynamic dialogs.',
    componentKey: 'AccessibilityAuditDemo',
    tags: ['a11y', 'accessibility', 'wai-aria', 'focus-management', 'screen-readers']
  },
  {
    id: '4.9',
    level: 4,
    levelTitle: 'Global State & Ecosystem',
    title: '4.9 Internationalization (i18n) and Localization (l10n)',
    summary: 'Adapting applications for multiple languages and cultures: message translation, pluralization, and native Intl APIs.',
    whatIsIt: `Internationalization (i18n) goes beyond string translation:
- **Dynamic Interpolation**: Injecting variables into translated text (\`Hello, {{name}}\`).
- **Complex Pluralization Rules**: Languages have distinct plural categories (for instance, Arabic and Polish have multiple plural forms beyond singular and plural).
- **Cultural Date, Number, and Currency Formatting**: Utilizing JavaScript's native **\`Intl\`** API (\`Intl.DateTimeFormat\`, \`Intl.NumberFormat\`) built into all modern browsers.
- **Right-to-Left (RTL) Layout Support**: Mirroring layouts for languages like Arabic or Hebrew (\`dir="rtl"\`).`,
    codeSnippet: `// Native cultural formatting without external dependencies using Intl API:
function CulturalFormatter({ date, amount, locale = 'en-US' }: { date: Date; amount: number; locale?: string }) {
  const formattedDate = new Intl.DateTimeFormat(locale, {
    dateStyle: 'full',
    timeStyle: 'short'
  }).format(date);

  const formattedCurrency = new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: locale.startsWith('en') ? 'USD' : 'EUR'
  }).format(amount);

  return (
    <div className="p-4 border rounded space-y-2">
      <p>Date: {formattedDate}</p>
      <p>Price: {formattedCurrency}</p>
    </div>
  );
}`,
    interviewTips: [
      'Highlight JavaScript\'s native `Intl` API: many codebases bundle heavy libraries like Moment.js when modern browsers already include `Intl.NumberFormat`, `Intl.DateTimeFormat`, and `Intl.RelativeTimeFormat` with zero bundle overhead.',
      'In Next.js: mention native internationalized routing in App Router using localized subpaths like `/[lang]/page.tsx` with middleware detecting `Accept-Language` headers.'
    ],
    commonTraps: [
      'Concatenating strings for plurals (`count + " item(s)"`), which breaks grammar in many languages.',
      'Hardcoding date formats (`DD/MM/YYYY`), which confuses international users (e.g. US users who expect `MM/DD/YYYY`).'
    ],
    keyTakeaway: 'Use the native `Intl` API for dates and numbers, and structure translation keys with proper pluralization and interpolation support.',
    componentKey: 'I18nLocalizationDemo',
    tags: ['i18n', 'l10n', 'Intl-api', 'pluralization', 'translation']
  }
];
