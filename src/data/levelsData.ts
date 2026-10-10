import { LevelInfo } from '@/types';

export const LEVELS: LevelInfo[] = [
  {
    id: 1,
    title: 'Level 1: React Fundamentals',
    shortTitle: 'Fundamentals',
    description: 'Virtual DOM, JSX, functional vs class components, props, keys, synthetic events, and unidirectional data flow.',
    color: 'emerald',
    iconName: 'Boxes',
    topicIds: ['1.1', '1.2', '1.3', '1.4', '1.5', '1.6', '1.7', '1.8', '1.9']
  },
  {
    id: 2,
    title: 'Level 2: State & Core Hooks',
    shortTitle: 'State & Hooks',
    description: 'useState with functional updates, useEffect synchronization, controlled vs uncontrolled inputs, forms, lifting state up, and useRef.',
    color: 'blue',
    iconName: 'Zap',
    topicIds: ['2.1', '2.2', '2.3', '2.4', '2.5', '2.6', '2.7', '2.8']
  },
  {
    id: 3,
    title: 'Level 3: Intermediate React',
    shortTitle: 'Intermediate',
    description: 'Context API, useReducer, useMemo/useCallback/memo, custom hooks, component lifecycle, diffing algorithm, data fetching, portals, compound components, and virtualization.',
    color: 'indigo',
    iconName: 'Layers',
    topicIds: ['3.1', '3.2', '3.3', '3.4', '3.5', '3.6', '3.7', '3.8', '3.9', '3.10', '3.11', '3.12', '3.13']
  },
  {
    id: 4,
    title: 'Level 4: Global State & Ecosystem',
    shortTitle: 'Global State & Ecosystem',
    description: 'Redux Toolkit, Zustand/Jotai, TanStack Query (server state), React Hook Form + Zod, TypeScript with React, testing library, accessibility (a11y), and i18n.',
    color: 'purple',
    iconName: 'Cpu',
    topicIds: ['4.1', '4.2', '4.3', '4.4', '4.5', '4.6', '4.7', '4.8', '4.9']
  },
  {
    id: 5,
    title: 'Level 5: Performance & Optimization',
    shortTitle: 'Performance',
    description: 'React DevTools Profiler, preventing unnecessary re-renders, code splitting with lazy/Suspense, Web Vitals (LCP, CLS, INP), debounce/throttle, and Web Workers.',
    color: 'amber',
    iconName: 'Gauge',
    topicIds: ['5.1', '5.2', '5.3', '5.4', '5.5', '5.6', '5.7', '5.8', '5.9']
  },
  {
    id: 6,
    title: 'Level 6: Modern React (18 & 19)',
    shortTitle: 'React 18 & 19',
    description: 'Concurrent Rendering, Automatic Batching, useTransition & useDeferredValue, useId, Server Components (RSC), Server Actions, useActionState, useOptimistic, ref as a prop, and React Compiler.',
    color: 'cyan',
    iconName: 'Sparkles',
    topicIds: ['6.1', '6.2', '6.3', '6.4', '6.5', '6.6', '6.7', '6.8', '6.9', '6.10', '6.11', '6.12']
  },
  {
    id: 7,
    title: 'Level 7: Frameworks & Architecture',
    shortTitle: 'Architecture & Next.js',
    description: 'Rendering strategies (CSR vs SSR vs SSG vs ISR), Next.js App Router, feature-based architecture, micro-frontends, frontend authentication, and security (XSS, CSRF, DOMPurify).',
    color: 'rose',
    iconName: 'Building2',
    topicIds: ['7.1', '7.2', '7.3', '7.4', '7.5', '7.6', '7.7', '7.8', '7.9']
  },
  {
    id: 8,
    title: 'Level 8: React Internals (Under the Hood)',
    shortTitle: 'Internals & Fiber',
    description: 'Fiber architecture, Render and Commit phases, Scheduler & lane priorities, hooks linked list, stale closures, setState queue & batching, useLayoutEffect vs useEffect, and custom hook reimplementation.',
    color: 'orange',
    iconName: 'Microscope',
    topicIds: ['8.1', '8.2', '8.3', '8.4', '8.5', '8.6', '8.7', '8.8', '8.9', '8.10']
  }
];
