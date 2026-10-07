# ⚛️ React & Next.js Entrevista Lab

Plataforma interactiva de maestría y preparación técnica para entrevistas de **React 19**, **Next.js (App Router)** y **TypeScript**, desarrollada a partir de la guía exhaustiva `react-entrevista.md`.

---

## 🌟 Características Principales

1. **8 Niveles de Conocimiento Estructurados (79 Tópicos)**:
   - **Nivel 1: Fundamentos** (DOM Virtual, JSX, Componentes funcionales vs clase, Props, Key trap, Condicionales, SyntheticEvent, Estilos y Flujo Unidireccional).
   - **Nivel 2: Estado y Hooks Básicos** (useState asíncrono y funcional, useEffect y cleanup, Controlados vs No controlados, Validación, Lifting State, Composición y useRef).
   - **Nivel 3: Intermedio** (Context API y selectores, useReducer, useMemo/useCallback/memo, Custom hooks, Ciclo de vida, Diffing O(n), Data Fetching con AbortController, React Router, Error Boundaries, Portals, Compound Components y Virtualización).
   - **Nivel 4: Estado Global y Ecosistema** (Redux Toolkit, Zustand, TanStack Query Server State, React Hook Form + Zod, UI Libraries, TypeScript avanzado, Testing Library, a11y e i18n).
   - **Nivel 5: Rendimiento** (React Profiler, Prevención de re-renders con children, Code Splitting con lazy/Suspense, Core Web Vitals LCP/CLS/INP, Debounce/Throttle y Web Workers).
   - **Nivel 6: React Moderno (18 y 19)** (Concurrent Rendering, Automatic Batching, useTransition & useDeferredValue, useId & useSyncExternalStore, React Server Components (RSC), Server Actions, Hooks de React 19: `use`, `useActionState`, `useFormStatus`, `useOptimistic`, ref como prop directa y React Compiler).
   - **Nivel 7: Frameworks y Arquitectura** (Estrategias de renderizado CSR/SSR/SSG/ISR, Next.js App Router, Remix vs Vite vs Next, Feature-based architecture, Monorepos con Turborepo, Micro-frontends, Autenticación HttpOnly y seguridad XSS/DOMPurify).
   - **Nivel 8: Internos de React (Bajo el Capó)** (Arquitectura Fiber con child/sibling/return, Fases Render vs Commit, Scheduler Lanes de 31 bits, Lista enlazada de hooks, Stale Closures, Encolado de setState, useLayoutEffect vs useEffect y reimplementación de hooks desde cero).

2. **Demos Interactivas en Vivo (Live Playgrounds)**:
   - Cada tópico cuenta con su widget interactivo que simula el problema técnico real y demuestra la solución óptima.
   - Pestañas por tópico: **Concepto**, **Laboratorio en Vivo**, **Código Fuente**, y **En la Entrevista (Tips y Trampas)**.

3. **Simulador de Preguntas Clásicas de Entrevista**:
   - 9 preguntas senior profundas con selector de revelación ("Piénsalo primero" &rarr; "Respuesta Senior").
   - Ejemplos de código y advertencias sobre "Red Flags" que descalifican candidatos.

4. **Suite de 11 Ejercicios Prácticos de Código Frecuentes**:
   - 1. Contador con historial y límites
   - 2. To-do list completo (CRUD, filtros y persistencia)
   - 3. Buscador en tiempo real con Debounce y cancelación
   - 4. Fetch de datos con paginación, loading y error
   - 5. Infinite scroll con IntersectionObserver
   - 6. Modal accesible con createPortal y cierre por tecla Escape
   - 7. Sistema de Tabs accesible (WAI-ARIA)
   - 8. Acordeón colapsable (modo simple y múltiple)
   - 9. Autocomplete con navegación completa por teclado (flechas y Enter)
   - 10. Laboratorio de Custom Hooks (`usePrevious`, `useToggle`, `useDebounce`, `useLocalStorage`)
   - 11. Formulario profesional con Zod y React Hook Form

5. **Checklist Oficial de Repaso con Persistencia**:
   - Monitorea el progreso con guardado local en el navegador y celebración con confeti interactivo al alcanzar el 100%.

6. **Búsqueda Instantánea Global (Ctrl+K / Cmd+K)**:
   - Encuentra cualquier concepto al instante (ej: `fiber`, `stale closure`, `useActionState`, `diffing`, `tanstack`).

7. **Diseño Moderno & Modo Oscuro / Claro**:
   - Adaptable con Tailwind CSS, Lucide Icons y tokens semánticos accesibles.

---

## 🚀 Cómo Ejecutar el Proyecto

### Requisitos
- Node.js >= 18.18 (o Node 20 / 22 / 24)
- npm o pnpm

### Pasos

1. Entra a la carpeta del proyecto:
   ```bash
   cd react-entrevista-lab
   ```

2. Inicia el servidor de desarrollo:
   ```bash
   npm run dev
   ```

3. Abre en tu navegador:
   ```
   http://localhost:3000
   ```

### Scripts Disponibles
- `npm run dev`: Inicia el servidor de desarrollo en Turbopack.
- `npm run build`: Compila la versión de producción optimizada estáticamente.
- `npm run start`: Inicia el servidor en modo producción.
- `npm run lint`: Ejecuta el análisis estático de ESLint.

---

## 📁 Estructura del Código

```
src/
├── app/
│   ├── layout.tsx                     # Layout global (Navbar, Footer, Suspense, Providers)
│   ├── page.tsx                       # Dashboard / Home interactiva
│   ├── nivel/[levelId]/page.tsx       # Página estática generada por nivel (generateStaticParams)
│   ├── preguntas/page.tsx             # Simulador de preguntas clásicas
│   ├── ejercicios/page.tsx            # Suite de los 11 ejercicios de código
│   └── checklist/page.tsx             # Checklist con persistencia y confeti
├── components/
│   ├── demos/                         # Demos interactivas en vivo para cada nivel
│   │   ├── level1Demos.tsx
│   │   ├── level2Demos.tsx
│   │   ├── level3Demos.tsx
│   │   ├── level4Demos.tsx
│   │   ├── level5Demos.tsx
│   │   ├── level6Demos.tsx
│   │   ├── level7Demos.tsx
│   │   ├── level8Demos.tsx
│   │   └── TopicDemoDispatcher.tsx   # Enrutador inteligente de componentes interactivos
│   ├── exercises/                     # Implementación de los 11 ejercicios prácticos
│   │   ├── CounterExercise.tsx
│   │   ├── TodoExercise.tsx
│   │   ├── DebounceSearchExercise.tsx
│   │   ├── PaginatedFetchExercise.tsx
│   │   ├── InfiniteScrollExercise.tsx
│   │   ├── PortalModalExercise.tsx
│   │   ├── TabsExercise.tsx
│   │   ├── AccordionExercise.tsx
│   │   ├── AutocompleteExercise.tsx
│   │   ├── CustomHooksExercise.tsx
│   │   └── ValidatedFormExercise.tsx
│   ├── layout/                        # Navbar, Sidebar, Footer
│   ├── level/                         # Vistas de nivel
│   └── ui/                            # CodeBlock, TopicCard, SearchModal, ThemeToggle
├── data/
│   ├── topics/                        # Módulos detallados por cada uno de los 8 niveles
│   │   ├── level1.ts ... level8.ts
│   ├── levelsData.ts                  # Metadatos de los 8 niveles
│   ├── topicsData.ts                  # Agregador maestro y funciones de búsqueda
│   ├── interviewQuestions.ts          # Las 9 preguntas senior con trampas y respuestas
│   └── exercisesData.ts               # Metadatos de los 11 ejercicios prácticos
└── types/                             # Definiciones de TypeScript
```
