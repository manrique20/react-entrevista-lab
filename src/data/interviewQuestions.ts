import { InterviewQuestion } from '@/types';

export const INTERVIEW_QUESTIONS: InterviewQuestion[] = [
  {
    id: 'q1',
    question: '¿Por qué no se debe mutar el estado en React?',
    category: 'Fundamentos & Estado',
    seniorAnswer: `React decide si un componente debe re-renderizarse comparando la referencia anterior con la nueva mediante Object.is (comparación superficial). Si mutas un objeto o array existente (ej: user.age = 30), la referencia en memoria sigue siendo exactamente la misma. Por ende, React asume que no hubo cambios y omite el re-renderizado, dejando la interfaz desincronizada.

Además, mutar el estado rompe:
1. React.memo y useMemo: que dependen de comparar props previas con las actuales.
2. DevTools Time Travel: el historial de estados previos se sobrescribe.
3. El modelo de concurrencia de React: donde diferentes renders pueden evaluar estados anteriores de forma segura.

Respuesta Senior en 1 frase: "La inmutabilidad garantiza que el cambio de referencia sea la señal determinista que React necesita para disparar la reconciliación".`,
    codeExample: `// ❌ ERROR GRAVE: Mutación directa (Misma referencia)
const [user, setUser] = useState({ name: 'Ana', age: 25 });
user.age = 26;
setUser(user); // React ve Object.is(user, user) === true -> NO RERENDERIZA

// ✅ FORMA CORRECTA: Creación de nueva referencia inmutable
setUser(prev => ({ ...prev, age: 26 }));`,
    trapsAndRedFlags: [
      'Trampa: Creer que hacer arr.push() y luego setArr(arr) funciona porque "llamaste al setter".',
      'Bandera roja en entrevista: Decir que la inmutabilidad es solo una "buena práctica de estilo". Es el pilar del diffing algorítmico de React.',
      'Cuidado con mutaciones anidadas: el spread shallow (...user) no clona objetos internos (user.address requiere copia profunda o Immer).'
    ]
  },
  {
    id: 'q2',
    question: '¿Para qué sirve la prop `key` y qué pasa si usas el índice del array?',
    category: 'Diffing & Listas',
    seniorAnswer: `La prop 'key' es un identificador único y estable que el algoritmo de reconciliación de React utiliza para rastrear la identidad de los elementos de una lista a través de diferentes renders. Le permite a React saber con exactitud si un elemento fue agregado, eliminado, movido o modificado.

Si usas el índice (index) como key:
1. Si la lista se reordena, filtra o se inserta un elemento al inicio, los índices de los elementos cambian.
2. El elemento en índice 0 siempre tendrá key="0". Si un componente hijo tiene estado interno (un input con texto no guardado, una animación, o un checkbox marcado), React reasociará ese estado interno al elemento incorrecto.
3. Se arruina la optimización de reutilización del DOM de React, forzando mutaciones de DOM innecesarias.

Cuándo es aceptable el índice: ÚNICAMENTE si la lista es estrictamente estática (nunca se filtra, ni reordena, ni inserta, ni elimina) y sus elementos no tienen estado ni IDs naturales.`,
    codeExample: `// ❌ PELIGRO: Si eliminas o reordenas, el estado de los inputs se corrompe
{items.map((item, index) => (
  <ListItem key={index} item={item} />
))}

// ✅ CORRECTO: ID estable que pertenece al dato
{items.map(item => (
  <ListItem key={item.id} item={item} />
))}`,
    trapsAndRedFlags: [
      'Trampa: Usar key={Math.random()} o key={Date.now()} en el render. Esto destruye y remonta el componente en CADA render, perdiendo el foco y causando parpadeos masivos.',
      'Pregunta de seguimiento típica: ¿Cómo reseteas el estado interno de un formulario sin useEffect? Respuesta senior: Pasándole una nueva key (<UserForm key={userId} />).'
    ]
  },
  {
    id: 'q3',
    question: '¿Cuál es la diferencia exacta entre `useMemo` y `useCallback`?',
    category: 'Rendimiento',
    seniorAnswer: `Ambos son hooks de memoización basados en un array de dependencias:
- useMemo(fn, deps): Ejecuta la función fn durante el render y memoiza el VALOR DE RETORNO (el resultado del cálculo).
- useCallback(fn, deps): Memoiza la INSTANCIA DE LA FUNCIÓN misma entre renders, garantizando una referencia estable en memoria.

De hecho, useCallback(fn, deps) es literalmente equivalente a useMemo(() => fn, deps).

¿Cuándo usarlos realmente?:
No deben colocarse "por si acaso" porque la memoización en sí misma consume memoria y ciclos de CPU para comparar dependencias.
- useMemo: Para cálculos computacionalmente pesados (miles de iteraciones, filtros grandes) o para evitar recrear objetos de configuración que son dependencias de otros hooks.
- useCallback: Principalmente cuando pasas una función callback a un componente hijo memoizado con React.memo, o cuando la función se pasa al array de dependencias de un useEffect.`,
    codeExample: `// useMemo memoiza el resultado de un cálculo pesado
const datosFiltrados = useMemo(() => {
  return listaEnorme.filter(item => item.activo).sort((a, b) => b.puntos - a.puntos);
}, [listaEnorme]);

// useCallback memoiza la referencia de la función
const handleClick = useCallback((id: string) => {
  eliminarItem(id);
}, [eliminarItem]); // Hijo memoizado con React.memo no se re-renderizará por prop de función nueva`,
    trapsAndRedFlags: [
      'Error común: Creer que useCallback hace que la función interna se ejecute más rápido. No es así; solo mantiene la misma referencia en memoria.',
      'Contexto moderno: Mencionar React Compiler. Con React Compiler en React 19, la memoización manual con useMemo y useCallback se automatiza en tiempo de compilación para la gran mayoría de casos.'
    ]
  },
  {
    id: 'q4',
    question: '¿Cuándo usar Context API vs Zustand / Redux Toolkit vs TanStack Query?',
    category: 'Arquitectura & Estado',
    seniorAnswer: `Esta es una de las preguntas de arquitectura más evaluadas. La respuesta senior separa claramente el 'Server State' del 'Client State':

1. TanStack Query (React Query) / SWR:
Para ESTADO DEL SERVIDOR (datos que provienen de una API remota: usuarios, listados, productos). Provee caché, revalidación en segundo plano, deduplicación de peticiones, reintentos y mutaciones optimistas. En el 80% de los proyectos modernos, usar TanStack Query elimina la necesidad de stores globales complejos.

2. React Context API:
Para inyección de dependencias y estado global de BAJA FRECUENCIA DE CAMBIO (tema claro/oscuro, idioma i18n, sesión de usuario autenticado). Desventaja crítica: TODOS los componentes que consumen el contexto se re-renderizan cuando su valor cambia, sin selectores granulares nativos.

3. Zustand / Redux Toolkit:
Para ESTADO GLOBAL DE UI DE ALTA FRECUENCIA O COMPLEJO (carrito de compras con reglas de negocio locales, editor canvas, reproductores multimedia con tiempo por milisegundos). Permiten 'selectores finos' (solo el componente suscrito al campo exacto se re-renderiza). Zustand es preferido por su mínima fricción y ausencia de Providers.`,
    codeExample: `// Contexto: Bueno para datos estables
const ThemeContext = createContext<Theme>('dark');

// TanStack Query: Para estado de servidor
const { data, isLoading } = useQuery({ queryKey: ['users'], queryFn: fetchUsers });

// Zustand: Para estado de cliente con selectores granulares
const useCartStore = create((set) => ({
  items: [],
  addItem: (item) => set((state) => ({ items: [...state.items, item] }))
}));
// Solo re-renderiza cuando la cantidad cambia:
const count = useCartStore((state) => state.items.length);`,
    trapsAndRedFlags: [
      'Bandera roja: Meter datos de API en Redux o Context usando useEffect + dispatch(fetchSuccess(data)). Explica que eso es gestionar estado de servidor manualmente con boilerplate innecesario.',
      'Trampa: Usar un solo Context masivo para toda la aplicación que guarda tanto el tema como datos que cambian a cada segundo.'
    ]
  },
  {
    id: 'q5',
    question: '¿Cómo evitar el "Prop Drilling" sin caer inmediatamente en estado global?',
    category: 'Patrones de Composición',
    seniorAnswer: `El Prop Drilling ocurre cuando pasas props a través de múltiples niveles de componentes intermedios que no necesitan ese dato y solo actúan como pasarelas.

Estrategias en orden de prioridad:
1. Composición de componentes con 'children' o slots: En lugar de pasar datos al fondo para que el nieto arme un botón, armas el botón en el ancestro y lo pasas como prop (o como children). El componente intermedio simplemente renderiza {children}. Esto elimina el drilling y desacopla la arquitectura.
2. Colocar el estado más cerca (Colocation): A menudo el estado fue levantado demasiado alto innecesariamente. Moverlo al submódulo donde realmente se utiliza.
3. Componentes compuestos (Compound Components): Un contenedor padre coordina a sus hijos mediante un Context local limitado solo a ese componente (ej. <Select><Select.Option /></Select>).
4. Context API: Cuando los datos son globales y estables (tema, autenticación).
5. Zustand: Si se requiere estado accesible en múltiples pantallas sin anidación.`,
    codeExample: `// ❌ Prop Drilling: Layout y Sidebar no usan 'user' ni 'logout'
<App user={user}>
  <Layout user={user}>
    <Sidebar user={user} onLogout={logout} />
  </Layout>
</App>

// ✅ Solución con Composición (Children / Slots):
<Layout
  sidebar={<UserProfile user={user} onLogout={logout} />}
>
  <MainContent />
</Layout>`,
    trapsAndRedFlags: [
      'Bandera roja: Responder que la única solución es instalar Redux o usar Context. Un ingeniero senior prefiere la composición de componentes antes de introducir estado global.'
    ]
  },
  {
    id: 'q6',
    question: '¿Cuál es la diferencia entre `useEffect` y `useLayoutEffect`?',
    category: 'Ciclo de Vida & Render',
    seniorAnswer: `La diferencia fundamental reside en el momento exacto de ejecución respecto al pintado del navegador (Browser Paint):

1. useLayoutEffect:
- Se ejecuta de manera SÍNCRONA inmediatamente después de que React aplica las mutaciones al DOM (fase de Commit), pero ANTES de que el navegador pinte la pantalla en el frame.
- Bloquea el pintado del navegador hasta que termine.
- Propósito principal: Realizar mediciones del DOM (getBoundingClientRect, scroll position) y aplicar mutaciones inmediatas antes de que el usuario vea el fotograma, evitando cualquier parpadeo visual (flicker).
- Advertencia: No corre durante Server-Side Rendering (dispara warning en SSR).

2. useEffect:
- Se ejecuta de manera ASÍNCRONA después de que el navegador ha pintado la pantalla en el monitor.
- No bloquea la renderización visual de la página.
- Propósito: El 99% de los efectos secundarios (fetch de datos, suscripciones, event listeners, timers, analíticas).`,
    codeExample: `// useLayoutEffect: Mide y ajusta antes de pintar (cero parpadeo visual)
useLayoutEffect(() => {
  const rect = tooltipRef.current.getBoundingClientRect();
  setPosition({ top: rect.top - 40, left: rect.left });
}, []);

// useEffect: No bloquea el render visual del usuario
useEffect(() => {
  const controller = new AbortController();
  fetchData({ signal: controller.signal });
  return () => controller.abort();
}, []);`,
    trapsAndRedFlags: [
      'Peligro: Poner tareas pesadas (como fetch o parseo intensivo) en useLayoutEffect congelará el hilo principal antes de pintar.',
      'Pregunta con trampa: ¿Corre useLayoutEffect en SSR de Next.js? Respuesta: No, porque en el servidor no hay DOM ni layout que pintar.'
    ]
  },
  {
    id: 'q7',
    question: '¿Cómo diagnosticarías y optimizarías una aplicación React con problemas de rendimiento?',
    category: 'Rendimiento & Profiling',
    seniorAnswer: `Una respuesta senior nunca empieza diciendo "pongo useMemo en todo". Sigue una metodología rigurosa: "Medir primero, optimizar después".

Paso 1: Medición y Diagnóstico
- Abrir React DevTools Profiler y marcar "Record why each component rendered".
- Identificar componentes con renders largos o componentes que se re-renderizan continuamente sin que sus datos visuales hayan cambiado.
- Inspeccionar las métricas de Web Vitals: LCP (Largest Contentful Paint), INP (Interaction to Next Paint) y CLS (Cumulative Layout Shift).

Paso 2: Optimización a nivel de Componente
- Bajar el estado (State Colocation): mover inputs y estados rápidos al componente que realmente los necesita para no re-renderizar ramas enteras del árbol.
- Composición con children: Si un wrapper maneja estado de scroll o mouse, pasar el contenido pesado como {children} (los children no se re-renderizan porque su instancia ya fue creada por el padre).
- React.memo con dependencias estables (useCallback/useMemo).

Paso 3: Optimización de listas y datos
- Si hay listas de más de 100 elementos, aplicar virtualización (TanStack Virtual / react-window).

Paso 4: Tareas pesadas y Concurrencia
- Usar useTransition para tareas no urgentes como filtrado de grandes datasets para que el input del usuario no pierda fluidez (INP < 200ms).
- Delegar cómputos pesados a un Web Worker.

Paso 5: Bundle y Red
- Code splitting con React.lazy / dynamic imports de Next.js.
- Tree shaking correcto (reemplazar importaciones masivas por subrutas como lodash-es).`,
    codeExample: `// Técnica altamente valorada: "Levantar el contenido con Children"
// Aunque el wrapper cambie su estado interno, 'HeavyTree' no se re-renderiza
function ExpensiveWrapper({ children }: { children: React.ReactNode }) {
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  return (
    <div onMouseMove={(e) => setCoords({ x: e.clientX, y: e.clientY })}>
      <span>Mouse: {coords.x}, {coords.y}</span>
      {children} {/* HeavyTree mantiene la misma referencia, no se re-ejecuta */}
    </div>
  );
}`,
    trapsAndRedFlags: [
      'Trampa: Optimización prematura. Llenar el código de useMemo y useCallback donde no hay componentes pesados memoizados añade overhead de memoria innecesario.',
      'Ignorar el tamaño de los bundles de librerías de terceros (ej: moment.js en lugar de date-fns/Intl).'
    ]
  },
  {
    id: 'q8',
    question: 'Componentes Controlados vs No Controlados: ¿Diferencias, pros, contras y cuándo usar cada uno?',
    category: 'Formularios & DOM',
    seniorAnswer: `La diferencia se basa en quién es la "única fuente de verdad" (Single Source of Truth) para el valor del elemento de formulario:

1. Componente Controlado:
- React controla el valor a través de estado (value={val} y onChange={(e) => setVal(e.target.value)}).
- Cada pulsación de tecla pasa por el ciclo de render de React.
- Ventajas: Validación inmediata en cada carácter, deshabilitar botones en tiempo real, formateo dinámico (ej: números de tarjeta con guiones), inputs dependientes entre sí.
- Desventajas: Provoca un re-render por cada tecla pulsada. En formularios masivos con cientos de campos puede impactar el rendimiento si no se aíslan los campos.

2. Componente No Controlado:
- El DOM del navegador retiene el valor internamente.
- Se lee el valor bajo demanda usando un 'useRef' o capturando el FormData al enviar el formulario (onSubmit).
- Ventajas: Rendimiento estelar en formularios extensos (cero re-renders al escribir), integración directa con librerías nativas o APIs de terceros.
- Es el modelo que utiliza React Hook Form (mediante ref registration) para lograr máximo rendimiento.`,
    codeExample: `// CONTROLADO: React tiene el control absoluto en cada render
const [query, setQuery] = useState('');
<input value={query} onChange={(e) => setQuery(e.target.value)} />

// NO CONTROLADO: El DOM gestiona el valor, React lo lee solo al enviar
const inputRef = useRef<HTMLInputElement>(null);
const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault();
  console.log(inputRef.current?.value);
};
<input ref={inputRef} defaultValue="Valor inicial" />`,
    trapsAndRedFlags: [
      'Error común: Cambiar un input de no controlado a controlado pasando primero value={undefined} y luego un string. React disparará un warning en consola: "A component is changing an uncontrolled input to be controlled". Solución: inicializar siempre con string vacío value={value ?? ""}.'
    ]
  },
  {
    id: 'q9',
    question: 'Explica el ciclo completo desde que ejecutas `setState` hasta que el píxel se pinta en pantalla',
    category: 'Internos & Reconciliación',
    seniorAnswer: `Este es el "Santo Grial" de las entrevistas senior de React. Demuestra comprensión profunda de la arquitectura Fiber:

Paso 1: Disparo y Encolado (Trigger & Schedule)
Se ejecuta setVal(nuevo). React no actualiza la variable de inmediato. Crea un objeto de actualización ('Update') y lo encola en la cola de la fibra del componente (updateQueue).
En React 18/19, opera el Automatic Batching: si ocurren varios setState dentro del mismo ciclo de eventos (incluso en promesas o timeouts), se agrupan en una única pasada.

Paso 2: Planificación por el Scheduler
El Scheduler evalúa la prioridad del carril (Lane Priority): ¿Es un evento de usuario inmediato (tecleo, clic) o una transición de baja prioridad (startTransition)? Si hay trabajo urgente, React puede interrumpir renders previos.

Paso 3: Fase de Render (Reconciliación) - ASÍNCRONA E INTERRUMPIBLE
React recorre el árbol de trabajo (workInProgress tree) usando la estructura Fiber. Llama a la función del componente con el nuevo estado.
Compara el nuevo Virtual DOM con el árbol de fibras actual mediante el algoritmo de diffing heurístico O(n).
Calcula las mutaciones requeridas y marca las banderas de efecto (flags como Placement, Update, Deletion). No se toca el DOM real en esta fase.

Paso 4: Fase de Commit - SÍNCRONA E ININTERRUMPIBLE
React toma la lista de cambios del árbol de trabajo y los aplica directamente al DOM real del navegador.
Cambia el puntero raíz (double buffering de Fiber) para que el workInProgress pase a ser el árbol actual.

Paso 5: Efectos de Diseño (Layout Effects)
React ejecuta síncronamente los hooks 'useLayoutEffect'. Como aún no se ha producido el pintado, cualquier ajuste al DOM aquí no causa parpadeo visible.

Paso 6: Pintado del Navegador (Browser Paint)
El navegador ejecuta el reflow, layout, cálculo de estilos y dibuja los píxeles en la pantalla.

Paso 7: Efectos Pasivos (Passive Effects)
Una vez que el usuario ve el resultado, React ejecuta de forma asíncrona los hooks 'useEffect' y sus funciones de cleanup pendientes.`,
    codeExample: `// Demostración de Batching y Asincronía
function ContadorDemo() {
  const [count, setCount] = useState(0);

  const handleClick = () => {
    // Ambas lecturas ven count = 0 en el render actual:
    setCount(count + 1);
    console.log(count); // IMPRIME 0, NO 1

    setCount(count + 1); // No suma 2, porque usa el mismo count = 0

    // Con forma funcional, se encadenan sobre la cola de actualizaciones:
    setCount(prev => prev + 1); // Esta sí tomará el resultado pendiente
  };
  return <button onClick={handleClick}>{count}</button>;
}`,
    trapsAndRedFlags: [
      'Bandera roja: Afirmar que setState es una función asíncrona que retorna una Promesa (await setState(...) no existe). setState programa un render, es síncrona en su invocación pero asíncrona en su resolución de render.',
      'Olvidar mencionar la diferencia entre la fase de Render (pura, interrumpible) y la fase de Commit (mutación de DOM, síncrona).'
    ]
  }
];
