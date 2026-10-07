import { Topic } from '@/types';

export const LEVEL_4_TOPICS: Topic[] = [
  {
    id: '4.1',
    level: 4,
    levelTitle: 'Estado Global y Ecosistema',
    title: '4.1 Redux Toolkit (RTK) y Arquitectura Flux',
    summary: 'Store global inmutable con flujo unidireccional estricto. RTK moderniza Redux integrando Immer para sintaxis simplificada.',
    whatIsIt: `Redux implementa la arquitectura Flux: una única fuente de verdad (**Single Source of Truth**), estado de solo lectura y cambios ejecutados únicamente mediante **acciones tipadas despachadas a reducers puros**.

**Redux Toolkit (RTK)** es la forma oficial estándar de escribir Redux:
- \`createSlice\`: Combina estado inicial, reducers y generadores de acciones en un solo módulo.
- **Integración con Immer**: Permite escribir lógica "mutante" aparente (\`state.items.push(item)\`), que Immer transforma internamente en copias inmutables seguras.
- \`createAsyncThunk\`: Manejo tipado de peticiones asíncronas con estados \`pending\`, \`fulfilled\` y \`rejected\`.
- \`useSelector\`: Hook para seleccionar porciones de estado con comparación por igualdad, evitando renders innecesarios.`,
    codeSnippet: `import { configureStore, createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Tarea { id: string; texto: string; completada: boolean; }

const tareasSlice = createSlice({
  name: 'tareas',
  initialState: { lista: [] as Tarea[] },
  reducers: {
    agregar: (state, action: PayloadAction<string>) => {
      // Immer permite escribir .push() de forma inmutable
      state.lista.push({ id: crypto.randomUUID(), texto: action.payload, completada: false });
    },
    toggle: (state, action: PayloadAction<string>) => {
      const tarea = state.lista.find(t => t.id === action.payload);
      if (tarea) tarea.completada = !tarea.completada;
    }
  }
});

export const { agregar, toggle } = tareasSlice.actions;
export const store = configureStore({ reducer: { tareas: tareasSlice.reducer } });`,
    interviewTips: [
      'Explica el rol de Immer: en Redux clásico debías clonar manualmente con `{ ...state, items: [...state.items, nuevo] }`. En RTK, Immer crea un objeto proxy borrador (Draft Proxy) y detecta los cambios para producir el siguiente estado inmutable de forma automática.',
      'Explica cuándo Redux Toolkit sigue teniendo sentido frente a Zustand: grandes aplicaciones empresariales con decenas de desarrolladores, necesidad de convenciones estrictas de equipo, middleware complejo y trazabilidad exhaustiva en Redux DevTools.'
    ],
    commonTraps: [
      'Guardar estado de servidor (datos de API) en Redux en lugar de usar RTK Query o TanStack Query, escribiendo thunks manuales repetitivos para loading y error.',
      'Seleccionar todo el estado en un solo `useSelector` (`const state = useSelector(s => s)`), provocando que el componente se re-renderice ante CUALQUIER cambio en el store.'
    ],
    keyTakeaway: 'Redux Toolkit estandariza Redux con Immer y reduce el boilerplate tradicional a slices concisos y predecibles.',
    componentKey: 'ReduxSimulatorDemo',
    tags: ['redux', 'redux-toolkit', 'immer', 'flux', 'slices', 'estado-global']
  },
  {
    id: '4.2',
    level: 4,
    levelTitle: 'Estado Global y Ecosistema',
    title: '4.2 Zustand, Jotai y Recoil (Manejo moderno de estado)',
    summary: 'Alternativas ligeras sin boilerplate ni Providers. Zustand usa un store unificado basado en hooks; Jotai usa estado atómico.',
    whatIsIt: `Las librerías modernas de gestión de estado han ganado enorme tracción por eliminar la verbosidad y los Providers innecesarios:

1. **Zustand**:
- Basado en un store unificado externo que no requiere envolver la app en Providers.
- Los componentes se suscriben usando **selectores granulares**: \`const count = useStore(s => s.count)\`. Solo los componentes cuyo selector cambie se re-renderizan.
- Tamaño mínimo (< 2KB), compatible con vanilla JS y fácil persistencia con middleware.
2. **Jotai / Recoil (Estado Atómico)**:
- El estado se divide en piezas diminutas e independientes llamadas **átomos** (\`atom(initialValue)\`).
- Los átomos pueden derivarse entre sí de manera declarativa (\`derived atoms\`), como hojas de cálculo reactivas.`,
    codeSnippet: `// Store global con Zustand (cero boilerplate, sin Provider)
import { create } from 'zustand';

interface ContadorStore {
  cuenta: number;
  incrementar: () => void;
  reset: () => void;
}

export const useContadorStore = create<ContadorStore>((set) => ({
  cuenta: 0,
  incrementar: () => set((state) => ({ cuenta: state.cuenta + 1 })),
  reset: () => set({ cuenta: 0 })
}));

// Consumo con selector granular óptimo:
function VisorCuenta() {
  // Solo re-renderiza cuando 'cuenta' cambia, no cuando otros campos del store mutan:
  const cuenta = useContadorStore((state) => state.cuenta);
  return <span>Valor en store: {cuenta}</span>;
}`,
    interviewTips: [
      'Compara la arquitectura de Zustand con Context API: Zustand usa una suscripción externa (similar al hook `useSyncExternalStore`), lo que le permite omitir renders de componentes no interesados sin sufrir el problema de cascada de Context.',
      'Explica por qué Zustand suele ser la opción recomendada para proyectos modernos de React: proporciona el 95% de la potencia de Redux con el 5% del código ceremonial.'
    ],
    commonTraps: [
      'No usar selectores en Zustand (`const { count, inc } = useStore()`), lo cual suscribe al componente a todo el store y fuerza renders innecesarios.',
      'Usar stores de cliente para almacenar listados remotos de API que deberían gestionarse con TanStack Query.'
    ],
    keyTakeaway: 'Zustand ofrece estado global sin providers con selectores de precisión quirúrgica en menos de 2KB.',
    componentKey: 'ZustandStoreDemo',
    tags: ['zustand', 'jotai', 'recoil', 'selectores-finos', 'estado-atomico']
  },
  {
    id: '4.3',
    level: 4,
    levelTitle: 'Estado Global y Ecosistema',
    title: '4.3 TanStack Query (React Query) y SWR: Server State',
    summary: 'Gestión especializada de estado de servidor remoto: caché inteligente, revalidación en background, reintentos y mutaciones optimistas.',
    whatIsIt: `El concepto más influyente del desarrollo moderno en React es la separación entre **Client State** (estado de UI efímero: modal abierto, pestaña activa) y **Server State** (datos remotos que no te pertenecen en exclusiva y que pueden cambiar de espaldas a tu app).

**TanStack Query resuelve**:
- **Caché en memoria**: Deduplica peticiones concurrentes a la misma clave.
- **staleTime vs gcTime**: Define cuándo un dato se considera viejo (\`staleTime\`) y cuándo se purga de la memoria (\`gcTime\`).
- **Revalidación en segundo plano**: Actualiza los datos silenciosamente al recuperar el foco de la ventana (\`refetchOnWindowFocus\`) o al reconectar la red.
- **Mutaciones Optimistas (Optimistic Updates)**: Actualiza la UI de inmediato antes de que el servidor responda, con reversión automática en caso de error.`,
    codeSnippet: `import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

function ListaProductos() {
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ['productos'],
    queryFn: () => fetch('/api/productos').then(r => r.json()),
    staleTime: 1000 * 60 * 5, // Datos frescos por 5 minutos
  });

  const mutacionCrear = useMutation({
    mutationFn: (nuevo: string) => fetch('/api/productos', { method: 'POST', body: JSON.stringify({ nombre: nuevo }) }),
    // Revalidación automática de la caché tras mutación exitosa:
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['productos'] });
    }
  });

  if (isLoading) return <p>Cargando productos...</p>;
  return <ul>{data?.map((p: any) => <li key={p.id}>{p.nombre}</li>)}</ul>;
}`,
    interviewTips: [
      'Frase que enamora entrevistadores: "Con TanStack Query para server state y useState/Zustand para UI state, la necesidad de Redux se reduce drásticamente".',
      'Explica la diferencia exacta entre `staleTime` (cuánto tiempo un dato se considera fresco sin necesidad de refetch) y `gcTime` (Garbage Collection Time: cuánto tiempo el dato se mantiene en caché tras desmontarse el último componente consumidor).'
    ],
    commonTraps: [
      'Poner datos de API en el store global de Zustand o Redux manualmente con `useEffect`, teniendo que implementar a mano lógica de loading, reintentos y caché.',
      'Olvidar configurar `staleTime` (por defecto es 0 en React Query, lo que significa que el dato se vuelve stale inmediatamente tras ser obtenido).'
    ],
    keyTakeaway: 'Server State pertenece a la API remota. Usa TanStack Query para gestionar caché, sincronización y mutaciones optimistas.',
    componentKey: 'TanStackQueryDemo',
    tags: ['tanstack-query', 'react-query', 'server-state', 'cache', 'staleTime', 'mutaciones']
  },
  {
    id: '4.4',
    level: 4,
    levelTitle: 'Estado Global y Ecosistema',
    title: '4.4 Formularios de alto rendimiento: React Hook Form + Zod',
    summary: 'Validación tipada basada en esquemas y componentes no controlados para formularios ágiles sin re-renders excesivos.',
    whatIsIt: `El estándar actual para formularios en el ecosistema React y Next.js combina:
1. **React Hook Form**:
- Utiliza **inputs no controlados** registrando la referencia (\`{...register('campo')}\`).
- No causa re-render en todo el formulario al escribir cada letra.
- Provee un estado reactivo tipado para errores (\`formState.errors\`) y suscripciones granulares (\`watch\`, \`useWatch\`).
2. **Zod**:
- Biblioteca de declaración de esquemas y validación TypeScript-first.
- Permite inferir el tipo estricto de TypeScript directamente del esquema (\`z.infer<typeof schema>\`), asegurando que la validación y los tipos jamás se desincronicen.
- Se integra con React Hook Form a través de \`@hookform/resolvers/zod\`.`,
    codeSnippet: `import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const schemaRegistro = z.object({
  nombre: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  email: z.string().email('Correo electrónico no válido'),
  edad: z.coerce.number().min(18, 'Debes ser mayor de edad'),
});

type FormValores = z.infer<typeof schemaRegistro>;

function FormularioRegistroAvanzado() {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormValores>({
    resolver: zodResolver(schemaRegistro)
  });

  const onSubmit = async (datos: FormValores) => {
    console.log('Datos validados y tipados:', datos);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <input {...register('nombre')} placeholder="Nombre" />
      {errors.nombre && <p className="text-red-500">{errors.nombre.message}</p>}
      <input {...register('email')} placeholder="Email" />
      {errors.email && <p className="text-red-500">{errors.email.message}</p>}
      <input type="number" {...register('edad')} placeholder="Edad" />
      {errors.edad && <p className="text-red-500">{errors.edad.message}</p>}
      <button type="submit" disabled={isSubmitting}>Enviar</button>
    </form>
  );
}`,
    interviewTips: [
      'Explica la ventaja de Zod con Server Actions en Next.js: puedes utilizar EXACTAMENTE EL MISMO esquema de Zod para validar en el frontend con React Hook Form y para validar la mutación en el backend dentro de la Server Action.',
      'Contrasta con Formik: Formik usa inputs controlados (re-renderiza en cada pulsación de tecla), lo que causa caídas de fotogramas en formularios largos; React Hook Form no tiene ese problema.'
    ],
    commonTraps: [
      'Olvidar `z.coerce.number()` en inputs de tipo número: los inputs de HTML siempre devuelven strings en el evento nativo, por lo que `z.number()` fallaría sin coerción.',
      'Replicar tipos de TypeScript a mano en vez de usar `z.infer<typeof schema>`, duplicando el esfuerzo de mantenimiento.'
    ],
    keyTakeaway: 'React Hook Form + Zod ofrece validación tipada, máxima velocidad de renderizado y reutilización de esquemas en cliente y servidor.',
    componentKey: 'HookFormZodDemo',
    tags: ['react-hook-form', 'zod', 'esquemas', 'validacion', 'typescript']
  },
  {
    id: '4.5',
    level: 4,
    levelTitle: 'Estado Global y Ecosistema',
    title: '4.5 Librerías de UI: Shadcn, Radix, Tailwind vs. Tradicionales',
    summary: 'De componentes monolíticos en paquetes de terceros (MUI) al código abierto editable con Shadcn UI + Radix Primitives.',
    whatIsIt: `El paradigma de librerías de UI ha vivido un cambio histórico:
1. **Librerías tradicionales (Material UI, Ant Design, Chakra)**:
Instaladas como paquetes npm gigantes. Difíciles de personalizar más allá de sus temas predefinidos, pesadas en el bundle y con problemas de compatibilidad en Server Components por CSS-in-JS.
2. **Headless UI Primitives (Radix UI, React Aria, Headless UI)**:
Proveen accesibilidad certificada (WAI-ARIA), navegación por teclado y lógica de interacción sin una sola línea de estilos CSS.
3. **El modelo Shadcn UI**:
No es una librería npm tradicional: **copias el código fuente del componente directamente a tu repositorio**.
- Construido sobre primitivas accesibles de Radix UI estilizadas con Tailwind CSS.
- Tienes control del 100% del código: puedes modificar las animaciones, las props y el JSX a tu medida.
- Cero bloqueo de dependencias externas y compatibilidad total con React Server Components.`,
    codeSnippet: `// Concepto de componente estilo Shadcn UI:
// Un componente que tú posees, envuelve Radix para accesibilidad y Tailwind para estilos:
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
      'Criterios para elegir una librería en la entrevista: 1) Accesibilidad (a11y) nativa, 2) Impacto en el tamaño del bundle, 3) Compatibilidad con React Server Components (RSC), 4) Facilidad de personalización para el Design System de la empresa.',
      'Menciona por qué copiar el código (enfoque Shadcn) triunfó: resuelve el problema de "vendor lock-in" donde una librería de terceros descontinúa el soporte o bloquea la actualización de versiones de React.'
    ],
    commonTraps: [
      'Intentar construir componentes complejos como Selects, Modales accesibles o Date Pickers desde cero sin librerías primitivas, olvidando el manejo de focos, lectores de pantalla y navegación por teclado.',
      'Instalar una librería completa de 200KB solo para usar 2 botones.'
    ],
    keyTakeaway: 'Radix + Tailwind + Shadcn domina la industria moderna al ofrecer accesibilidad sin penalizaciones de bundle ni vendor lock-in.',
    componentKey: 'UiLibrariesDemo',
    tags: ['shadcn-ui', 'radix-ui', 'tailwind', 'headless-ui', 'design-system']
  },
  {
    id: '4.6',
    level: 4,
    levelTitle: 'Estado Global y Ecosistema',
    title: '4.6 TypeScript avanzado con React',
    summary: 'Componentes genéricos, tipado de eventos de React, uniones discriminadas para estado y extensión de props nativas.',
    whatIsIt: `Escribir React con TypeScript profesional va más allá de declarar tipos primitivos:
- **Herencia de props nativas de HTML**: Extender \`React.ComponentProps<'button'>\` o \`React.ButtonHTMLAttributes<HTMLButtonElement>\` para heredar props como \`aria-*\`, \`disabled\`, \`tabIndex\`.
- **Tipado estricto de eventos**: \`React.MouseEvent<HTMLButtonElement>\`, \`React.ChangeEvent<HTMLInputElement>\`, \`React.FormEvent<HTMLFormElement>\`.
- **Uniones discriminadas (Discriminated Unions)**: Modelar estados donde ciertos campos solo existen si el estado tiene un valor específico (imposibilitando estados inválidos en tiempo de compilación).
- **Componentes Genéricos**: Componentes tipados reutilizables como \`<Lista<T> items={data} render={(item) => ...} />\`.`,
    codeSnippet: `// 1. Unión Discriminada: Elimina estados imposibles
type AsyncState<T> =
  | { status: 'idle'; data: null; error: null }
  | { status: 'loading'; data: null; error: null }
  | { status: 'success'; data: T; error: null }
  | { status: 'error'; data: null; error: string };

// 2. Componente Genérico <T>
interface ListaGenericaProps<T> {
  items: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
  claveExtractor: (item: T) => string;
}

function ListaGenerica<T>({ items, renderItem, claveExtractor }: ListaGenericaProps<T>) {
  return (
    <ul className="divide-y">
      {items.map((item, index) => (
        <li key={claveExtractor(item)}>{renderItem(item, index)}</li>
      ))}
    </ul>
  );
}`,
    interviewTips: [
      'Explica por qué evitar `React.FC` (FunctionComponent) en proyectos modernos: solía forzar la inclusión implícita de `children` (incluso cuando el componente no los aceptaba) y complicaba los componentes genéricos. Hoy la comunidad prefiere tipar directamente los parámetros `function MiComp(props: MisProps)`.',
      'Explica el concepto de Uniones Discriminadas: previenen bugs de UI donde `isLoading === true` pero `error !== null` al mismo tiempo, forzando un único estado coherente.'
    ],
    commonTraps: [
      'Usar `any` en tipos de eventos en handlers en vez del tipo específico de React (`React.ChangeEvent<HTMLInputElement>`).',
      'No tipar las referencias de `useRef<HTMLInputElement>(null)`, causando errores de runtime al acceder a `.current`.'
    ],
    keyTakeaway: 'Aprovecha uniones discriminadas para estados seguros y componentes genéricos para máxima reutilización tipada.',
    componentKey: 'TypeScriptReactDemo',
    tags: ['typescript', 'generics', 'discriminated-unions', 'component-props']
  },
  {
    id: '4.7',
    level: 4,
    levelTitle: 'Estado Global y Ecosistema',
    title: '4.7 Estrategias de Testing en React (Vitest / Testing Library)',
    summary: 'Probar el comportamiento visible del usuario en lugar de detalles internos de implementación. Jerarquía de consultas accesible.',
    whatIsIt: `El principio rector de **React Testing Library (RTL)** es:
> *"Cuanto más se parezcan tus pruebas a la forma en que se usa tu software, más confianza te darán."*

Reglas esenciales de testing:
- **No testees detalles de implementación**: No pruebes variables de estado interno, nombres de métodos privados ni la estructura interna de componentes. Prueba lo que el usuario ve y hace (textos en pantalla, clics, envíos de formulario).
- **Jerarquía recomendada de consultas (Queries)**:
1. \`getByRole\` (la más recomendada: simula cómo navega un usuario o lector de pantalla: \`getByRole('button', { name: /enviar/i })\`).
2. \`getByLabelText\` (para inputs asociados a un label).
3. \`getByPlaceholderText\` / \`getByText\`.
4. \`getByTestId\` (solo como último recurso si no hay atributo accesible semántico).`,
    codeSnippet: `// Prueba con Vitest y React Testing Library:
// import { render, screen } from '@testing-library/react';
// import userEvent from '@testing-library/user-event';

/*
test('incrementa el contador y actualiza el texto accesible', async () => {
  const user = userEvent.setup();
  render(<Contador />);

  // Buscamos por rol accesible
  const boton = screen.getByRole('button', { name: /incrementar/i });
  expect(screen.getByText(/cuenta: 0/i)).toBeInTheDocument();

  // Simulamos la interacción real del usuario
  await user.click(boton);

  // Verificamos el resultado visible
  expect(screen.getByText(/cuenta: 1/i)).toBeInTheDocument();
});
*/`,
    interviewTips: [
      'Contrasta React Testing Library con Enzyme (legado): Enzyme permitía inspeccionar `wrapper.state()` y `wrapper.find("SubComponente")`. Esto causaba tests frágiles que se rompían al hacer un refactor interno sin que la interfaz hubiera cambiado. RTL garantiza tests resistentes a refactors.',
      'Menciona Mock Service Worker (MSW) para mockear peticiones de red a nivel de petición HTTP en lugar de sobreescribir `global.fetch` con mocks manuales quebradizos.'
    ],
    commonTraps: [
      'Llenar los componentes de `data-testid` en vez de usar roles accesibles estándar de HTML (`button`, `dialog`, `heading`).',
      'Usar `fireEvent` en lugar de `userEvent`: `userEvent` dispara todos los eventos secundarios que el navegador genera en la vida real (hover, focus, blur, keydown).'
    ],
    keyTakeaway: 'Prueba la experiencia visible del usuario con `getByRole` y `userEvent`, nunca los detalles internos de implementación.',
    componentKey: 'TestingStrategyDemo',
    tags: ['testing', 'react-testing-library', 'vitest', 'getByRole', 'userEvent', 'msw']
  },
  {
    id: '4.8',
    level: 4,
    levelTitle: 'Estado Global y Ecosistema',
    title: '4.8 Accesibilidad (a11y) en React',
    summary: 'HTML semántico primero, gestión de foco, WAI-ARIA, contraste visual y anuncios dinámicos con regiones aria-live.',
    whatIsIt: `Crear aplicaciones web accesibles (WCAG 2.1) asegura que personas con discapacidades visuales, motrices o cognitivas puedan interactuar plenamente con tu interfaz.

Pilares de Accesibilidad en React:
1. **HTML Semántico antes que ARIA**: Usa \`<button>\` en lugar de \`<div onClick={...}>\`. Los elementos nativos incluyen soporte por teclado (\`Enter\`, \`Espacio\`) y roles por defecto.
2. **Gestión de foco**: Al abrir un modal, atrapar el foco dentro (**Focus Trap**) y moverlo al primer elemento operable. Al cerrar, devolver el foco al disparador original.
3. **Labels enlazados**: Todo input debe tener un \`<label htmlFor={id}>\` o \`aria-label\`.
4. **Regiones activas (\`aria-live="polite"\`)**: Anunciar a los lectores de pantalla cambios asíncronos en la página (mensajes de éxito, nuevos mensajes de chat).`,
    codeSnippet: `// Componente accesible con soporte de teclado y anuncios en vivo:
function NotificacionAccesible({ mensaje, onClose }: { mensaje: string; onClose: () => void }) {
  return (
    // role="status" y aria-live anuncian el mensaje sin interrumpir al lector de pantalla:
    <div role="status" aria-live="polite" className="p-4 bg-blue-50 border border-blue-200 rounded flex justify-between">
      <span>{mensaje}</span>
      <button
        onClick={onClose}
        aria-label="Cerrar notificación" // Nombre accesible para icono visual
        className="text-blue-800 font-bold"
      >
        ✕
      </button>
    </div>
  );
}`,
    interviewTips: [
      'Regla de oro de ARIA: "La primera regla de ARIA es no usar ARIA si existe un elemento HTML nativo que ya cumpla esa función".',
      'Explica cómo auditar accesibilidad: mediante herramientas como axe-core, Lighthouse y navegación real desconectando el ratón y usando solo la tecla `Tab`, `Shift+Tab`, `Espacio` y las flechas.'
    ],
    commonTraps: [
      'Usar `<div>` con `onClick` sin añadir `role="button"`, `tabIndex={0}` ni listeners para la tecla `Enter` y barra espaciadora.',
      'Eliminar los contornos de foco (`outline: none` sin proveer un reemplazo visual claro con `:focus-visible`).'
    ],
    keyTakeaway: 'Usa HTML semántico nativo, garantiza navegación fluida por teclado y administra el foco en componentes emergentes.',
    componentKey: 'AccessibilityAuditDemo',
    tags: ['a11y', 'accesibilidad', 'wai-aria', 'focus-management', 'lectores-pantalla']
  },
  {
    id: '4.9',
    level: 4,
    levelTitle: 'Estado Global y Ecosistema',
    title: '4.9 Internacionalización (i18n) y Localización (l10n)',
    summary: 'Adaptar la aplicación a múltiples idiomas y culturas: traducción de textos, pluralización y APIs nativas de Intl.',
    whatIsIt: `La internacionalización (i18n) va más allá de traducir palabras:
- **Interpolación dinámica**: Inyectar variables en los textos (\`Hola, {{nombre}}\`).
- **Reglas de pluralización complejas**: Cada idioma tiene reglas distintas de plurales (por ejemplo, el árabe o el polaco tienen múltiples formas de plurales, no solo singular/plural).
- **Formateo cultural de fechas, números y monedas**: Usar la API nativa de JavaScript **\`Intl\`** (\`Intl.DateTimeFormat\`, \`Intl.NumberFormat\`) que viene integrada en todos los navegadores modernos.
- **Soporte de texto de derecha a izquierda (RTL)**: Adaptar la interfaz para idiomas como el árabe o hebreo (\`dir="rtl"\`).`,
    codeSnippet: `// Formateo cultural nativo sin librerías pesadas usando la API Intl:
function FormateadorCultural({ fecha, monto, locale = 'es-ES' }: { fecha: Date; monto: number; locale?: string }) {
  const fechaFormateada = new Intl.DateTimeFormat(locale, {
    dateStyle: 'full',
    timeStyle: 'short'
  }).format(fecha);

  const monedaFormateada = new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: locale.startsWith('en') ? 'USD' : 'EUR'
  }).format(monto);

  return (
    <div className="p-4 border rounded space-y-2">
      <p>Fecha: {fechaFormateada}</p>
      <p>Precio: {monedaFormateada}</p>
    </div>
  );
}`,
    interviewTips: [
      'Destaca la API nativa `Intl` de JavaScript: muchas aplicaciones instalan librerías gigantescas como Moment.js para fechas y monedas cuando los navegadores ya incorporan `Intl.NumberFormat`, `Intl.DateTimeFormat` y `Intl.RelativeTimeFormat` con cero bytes de bundle.',
      'En Next.js: menciona el enrutamiento internacionalizado nativo en App Router mediante subrutas `/[lang]/page.tsx` con middlewares que detectan la cabecera `Accept-Language` del usuario.'
    ],
    commonTraps: [
      'Concatenar strings para plurales (`count + " elemento(s)"`), lo cual rompe la gramática en muchos idiomas.',
      'Hardcodear formatos de fecha (`DD/MM/YYYY`) que confunden a usuarios internacionales (en EE.UU. interpretan `MM/DD/YYYY`).'
    ],
    keyTakeaway: 'Usa la API nativa `Intl` para fechas y números, y gestiona traducciones con soporte de plurales e interpolación.',
    componentKey: 'I18nLocalizationDemo',
    tags: ['i18n', 'l10n', 'Intl-api', 'pluralizacion', 'traduccion']
  }
];
