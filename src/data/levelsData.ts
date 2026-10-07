import { LevelInfo } from '@/types';

export const LEVELS: LevelInfo[] = [
  {
    id: 1,
    title: 'Nivel 1: Fundamentos de React',
    shortTitle: 'Fundamentos',
    description: 'DOM Virtual, JSX, Componentes funcionales vs clase, Props, Keys, Eventos sintéticos y flujo unidireccional.',
    color: 'emerald',
    iconName: 'Boxes',
    topicIds: ['1.1', '1.2', '1.3', '1.4', '1.5', '1.6', '1.7', '1.8', '1.9']
  },
  {
    id: 2,
    title: 'Nivel 2: Estado y Hooks Básicos',
    shortTitle: 'Estado & Hooks',
    description: 'useState con actualizaciones funcionales, sincronización con useEffect, inputs controlados vs no controlados, formularios, lifting state y useRef.',
    color: 'blue',
    iconName: 'Zap',
    topicIds: ['2.1', '2.2', '2.3', '2.4', '2.5', '2.6', '2.7', '2.8']
  },
  {
    id: 3,
    title: 'Nivel 3: React Intermedio',
    shortTitle: 'Intermedio',
    description: 'Context API, useReducer, useMemo/useCallback/memo, custom hooks, ciclo de vida, diffing algorithm, data fetching, portals, compound components y virtualización.',
    color: 'indigo',
    iconName: 'Layers',
    topicIds: ['3.1', '3.2', '3.3', '3.4', '3.5', '3.6', '3.7', '3.8', '3.9', '3.10', '3.11', '3.12', '3.13']
  },
  {
    id: 4,
    title: 'Nivel 4: Estado Global y Ecosistema',
    shortTitle: 'Estado Global & Ecosistema',
    description: 'Redux Toolkit, Zustand/Jotai, TanStack Query (server state), React Hook Form + Zod, TypeScript con React, testing library, accesibilidad (a11y) e i18n.',
    color: 'purple',
    iconName: 'Cpu',
    topicIds: ['4.1', '4.2', '4.3', '4.4', '4.5', '4.6', '4.7', '4.8', '4.9']
  },
  {
    id: 5,
    title: 'Nivel 5: Rendimiento y Optimización',
    shortTitle: 'Rendimiento',
    description: 'React DevTools Profiler, prevención de re-renders innecesarios, code splitting con lazy/Suspense, Web Vitals (LCP, CLS, INP), debounce/throttle y Web Workers.',
    color: 'amber',
    iconName: 'Gauge',
    topicIds: ['5.1', '5.2', '5.3', '5.4', '5.5', '5.6', '5.7', '5.8', '5.9']
  },
  {
    id: 6,
    title: 'Nivel 6: React Moderno (18 y 19)',
    shortTitle: 'React 18 & 19',
    description: 'Concurrent Rendering, Automatic Batching, useTransition & useDeferredValue, useId, Server Components (RSC), Server Actions, useActionState, useOptimistic, ref como prop y React Compiler.',
    color: 'cyan',
    iconName: 'Sparkles',
    topicIds: ['6.1', '6.2', '6.3', '6.4', '6.5', '6.6', '6.7', '6.8', '6.9', '6.10', '6.11', '6.12']
  },
  {
    id: 7,
    title: 'Nivel 7: Frameworks y Arquitectura',
    shortTitle: 'Arquitectura & Next.js',
    description: 'Estrategias de renderizado (CSR vs SSR vs SSG vs ISR), Next.js App Router, arquitectura por features, micro-frontends, autenticación frontend y seguridad (XSS, CSRF, DOMPurify).',
    color: 'rose',
    iconName: 'Building2',
    topicIds: ['7.1', '7.2', '7.3', '7.4', '7.5', '7.6', '7.7', '7.8', '7.9']
  },
  {
    id: 8,
    title: 'Nivel 8: Internos de React (Bajo el capó)',
    shortTitle: 'Internos & Fiber',
    description: 'Arquitectura Fiber, fases Render y Commit, Scheduler y prioridades, lista enlazada de hooks, stale closures, cola y batching de setState, useLayoutEffect vs useEffect y reimplementación de hooks.',
    color: 'orange',
    iconName: 'Microscope',
    topicIds: ['8.1', '8.2', '8.3', '8.4', '8.5', '8.6', '8.7', '8.8', '8.9', '8.10']
  }
];
