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
  },
  {
    id: 'q10',
    question: '¿Qué es un "Stale Closure" en React y cuáles son sus 3 soluciones canónicas?',
    category: 'Hooks & Closures',
    seniorAnswer: `Un Stale Closure ocurre cuando una función callback (como las pasadas a setInterval, setTimeout, o event listeners dentro de un useEffect/useCallback) captura variables de estado o props del render en el que fue creada y nunca se actualiza porque el array de dependencias no incluye esa variable o está vacío ([]).

Como las closures en JavaScript capturan variables por referencia a su ámbito léxico original, la función sigue ejecutándose pero "ve" eternamente el valor congelado de ese render inicial.

Solución 1: Actualizaciones funcionales de estado
En lugar de setCount(count + 1), usa setCount(prev => prev + 1). La función recibe el estado más reciente de la cola de React sin necesidad de capturarlo de su closure léxica.

Solución 2: Usar useRef como contenedor mutable
Guarda el callback o valor mutable en una referencia (ref.current = valor). Los refs persisten entre renders con identidad estable y siempre apuntan a la última mutación.

Solución 3: Declarar todas las dependencias o el hook experimental useEffectEvent (React 19)
Separar la lógica reactiva (que dispara el efecto) de la lógica no reactiva que solo necesita leer el valor más reciente sin re-ejecutar el efecto.`,
    codeExample: `// ❌ BUG: count se congela en 0, imprime siempre "Tick: 1"
useEffect(() => {
  const id = setInterval(() => {
    setCount(count + 1); // count siempre vale 0 aquí
  }, 1000);
  return () => clearInterval(id);
}, []); // deps vacías causan stale closure

// ✅ SOLUCIÓN 1: Actualizador funcional (cero dependencias necesarias)
useEffect(() => {
  const id = setInterval(() => {
    setCount(prev => prev + 1);
  }, 1000);
  return () => clearInterval(id);
}, []);`,
    trapsAndRedFlags: [
      'Bandera roja: Desactivar eslint-plugin-react-hooks/exhaustive-deps con un comentario // eslint-disable sin entender por qué faltaba la dependencia.',
      'Trampa: Poner count en las dependencias sin limpiar el timer causará que el intervalo se destruya y se vuelva a crear cada segundo, degradando rendimiento.'
    ]
  },
  {
    id: 'q11',
    question: '¿En qué se diferencian `useTransition` y `useDeferredValue` y cuándo usar cada uno?',
    category: 'Rendimiento Concurrente',
    seniorAnswer: `Ambos hooks pertenecen al Concurrent Mode de React y permiten marcar actualizaciones de UI como "no urgentes" (transiciones), evitando que bloqueen el hilo principal durante interacciones críticas de usuario como teclear en un input (priorizando la métrica INP):

1. useTransition:
- Se utiliza cuando TÚ controlas el código que llama al setState.
- Envuelve la actualización: startTransition(() => setFiltro(nuevoValor)).
- Provee un flag booleano isPending para mostrar spinners o estados atenuados mientras React renderiza en segundo plano.

2. useDeferredValue:
- Se utiliza cuando NO controlas el setter, sino que RECIBES un valor como prop o desde una librería externa.
- Toma un valor y difiere la actualización de su copia diferida: const deferredQuery = useDeferredValue(query).
- React primero renderiza el input con el valor inmediato y luego programa un render en segundo plano con el valor diferido.

¿Cuándo NO usarlos?:
No reemplazan a debounce o throttle para reducir llamadas a APIs de red. useTransition y useDeferredValue optimizan la CPU en el cliente (re-render de listas pesadas en Virtual DOM), no el tráfico HTTP.`,
    codeExample: `// useTransition: Controlas el setter
const [isPending, startTransition] = useTransition();
function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
  setInputVal(e.target.value); // Urgente: se pinta de inmediato
  startTransition(() => {
    setQuery(e.target.value); // No urgente: si hay lag, el usuario sigue tecleando fluido
  });
}

// useDeferredValue: Recibes el prop
function ListaFiltrada({ filtro }: { filtro: string }) {
  const deferredFiltro = useDeferredValue(filtro);
  return <HeavyList search={deferredFiltro} />;
}`,
    trapsAndRedFlags: [
      'Error común: Pensar que useTransition retrasa la ejecución en el tiempo como un setTimeout. React comienza a renderizar inmediatamente, pero de forma interrumpible.',
      'Pregunta de entrevista: ¿Por qué useTransition no sirve para una llamada fetch? Porque startTransition solo aplica a actualizaciones de estado síncronas en memoria.'
    ]
  },
  {
    id: 'q12',
    question: 'React 19 Server Actions & `useActionState`: ¿Cómo cambian el manejo de mutaciones frente a API Routes?',
    category: 'React 19 & Next.js',
    seniorAnswer: `En arquitecturas tradicionales (React 18 / Pages Router), enviar un formulario implicaba:
1. Crear una API Route manual (/api/crear-usuario).
2. Prevenir e.preventDefault().
3. Manejar manualmente estados booleanos: const [loading, setLoading] = useState(false); const [error, setError] = useState(null).
4. Hacer fetch('/api/...') y sincronizar estados manualmente.

En React 19 y Next.js App Router:
- Server Actions ('use server'): Son funciones asíncronas que se ejecutan directamente en el servidor pero se pueden invocar como atributos action de formularios o funciones cliente.
- useActionState: Hook canónico de React 19 que vincula la acción del servidor con el estado del formulario, proveyendo [state, formAction, isPending] en una sola línea idiomática.
- Progressive Enhancement: Los formularios con Server Actions funcionan incluso si el JavaScript del cliente no ha terminado de cargar o está deshabilitado.
- useOptimistic: Permite proyectar en UI el resultado esperado instantáneamente (0ms) mientras la acción del servidor se resuelve en segundo plano.`,
    codeExample: `// Server Action (actions/user.ts)
'use server';
export async function updateUser(prevState: any, formData: FormData) {
  const name = formData.get('name') as string;
  if (!name) return { error: 'Nombre requerido' };
  await db.user.update({ name });
  return { success: true };
}

// Cliente (Component.tsx)
'use client';
import { useActionState } from 'react';
import { updateUser } from './actions/user';

function UserForm() {
  const [state, formAction, isPending] = useActionState(updateUser, null);
  return (
    <form action={formAction}>
      <input name="name" />
      <button disabled={isPending}>{isPending ? 'Guardando...' : 'Actualizar'}</button>
      {state?.error && <p className="text-red-500">{state.error}</p>}
    </form>
  );
}`,
    trapsAndRedFlags: [
      'Peligro de seguridad crítico: Olvidar autenticar y validar los argumentos dentro de una Server Action. Al ser un endpoint público generado internamente, cualquier usuario puede invocar la función con parámetros alterados.',
      'Validar siempre con Zod dentro de la Server Action.'
    ]
  },
  {
    id: 'q13',
    question: '¿Por qué `React.StrictMode` ejecuta los efectos y renders dos veces en desarrollo?',
    category: 'Ciclo de Vida & StrictMode',
    seniorAnswer: `StrictMode intencionalmente monta, desmonta y vuelve a montar cada componente en desarrollo (Mount -> Unmount -> Mount), además de ejecutar los constructores y cuerpos de componentes dos veces:

¿Por qué hace esto React?:
1. Detectar efectos sin limpieza (Missing Cleanup): Si suscribes un event listener o un websocket y no lo limpias en el return () => ..., la segunda ejecución revelará la fuga de memoria al duplicar listeners o peticiones.
2. Garantizar componentes puros e idempotentes: Si tu componente muta variables externas durante el render, la segunda llamada producirá un resultado visiblemente corrupto.
3. Compatibilidad con Concurrent Rendering: En modo concurrente, React necesita poder pausar, descartar y reiniciar renders sin efectos secundarios destructivos.

¿Cómo escribir efectos compatibles?:
Todo efecto secundario debe ser IDEMPOTENTE: ejecutarlo dos veces seguidas con su correspondiente función de cleanup debe dejar la aplicación en el mismo estado que ejecutarlo una sola vez.`,
    codeExample: `// ❌ EFECTO ROTO EN STRICTMODE (Duplica listeners)
useEffect(() => {
  window.addEventListener('resize', handleResize);
  // Falta return () => window.removeEventListener...
}, []);

// ✅ EFECTO IDEMPOTENTE LIMPIO
useEffect(() => {
  const controller = new AbortController();
  fetch('/api/data', { signal: controller.signal })
    .then(r => r.json())
    .then(setData)
    .catch(err => { if (err.name !== 'AbortError') setError(err); });

  return () => controller.abort(); // Limpieza correcta
}, []);`,
    trapsAndRedFlags: [
      'Bandera roja en entrevista: Decir "StrictMode es un bug de React que arreglé quitando <StrictMode> de index.tsx". Quitarlo esconderá memory leaks y bugs de producción.',
      'Usar un ref booleano hasMounted.current para saltarse el segundo montaje es un antipatrón en la gran mayoría de casos.'
    ]
  },
  {
    id: 'q14',
    question: '¿Por qué pasar funciones inline (`onClick={() => ...}`) causa re-renders y cuándo es realmente un problema?',
    category: 'Rendimiento & Diffing',
    seniorAnswer: `En cada render de un componente padre, una función flecha inline (() => ...) crea una NUEVA INSTANCIA de función en memoria con una referencia hexadecimal distinta.

¿Cuándo causa un re-render innecesario?:
ÚNICAMENTE cuando se pasa como prop a un componente hijo que ha sido memoizado explícitamente con React.memo(Child). Como React.memo compara las props previas y nuevas mediante Object.is, al detectar una referencia de función diferente, invalida la memoización y fuerza al hijo a re-renderizarse.

¿Cuándo NO es un problema?:
1. En elementos HTML nativos (<button onClick={() => doSomething()}>): React actualiza el event listener sintético sin recrear el nodo del DOM.
2. En hijos no memoizados: Si el hijo no tiene React.memo, se va a re-renderizar de todos modos cuando el padre renderice, por lo que memoizar la función con useCallback es un desperdicio de CPU y memoria.

Respuesta Senior: Solo memoiza funciones con useCallback cuando:
a) Se pasan a hijos pesados envueltos en React.memo.
b) La función se incluye en el array de dependencias de un useEffect en otro componente.`,
    codeExample: `// Caso donde SI importa useCallback:
const ChildMemo = React.memo(({ onAction }: { onAction: () => void }) => {
  return <HeavyComponent onClick={onAction} />;
});

function Parent() {
  const [text, setText] = useState('');
  
  // ✅ useCallback previene que ChildMemo renderice cada vez que tecleas en text
  const handleAction = useCallback(() => {
    enviarDatos();
  }, []);

  return (
    <>
      <input value={text} onChange={e => setText(e.target.value)} />
      <ChildMemo onAction={handleAction} />
    </>
  );
}`,
    trapsAndRedFlags: [
      'Trampa de sobre-optimización: Envolver absolutamente todas las funciones en useCallback sin que ningún hijo esté memoizado con React.memo.',
      'Recordar que con React Compiler en React 19, estas memoizaciones de referencias se gestionan automáticamente.'
    ]
  },
  {
    id: 'q15',
    question: '¿Qué es un "Hydration Mismatch" en SSR/Next.js, cuáles son sus causas más frecuentes y cómo resolverlo?',
    category: 'SSR & Next.js',
    seniorAnswer: `La hidratación (Hydration) es el proceso en el que React se ejecuta en el navegador del cliente y vincula los event listeners al HTML estático que fue generado previamente por el servidor.

Un Hydration Mismatch ocurre cuando el árbol de Virtual DOM generado en el cliente no coincide exactamente con el HTML generado en el servidor. React detecta la discrepancia y emite el clásico error: "Text content did not match. Server: '...' Client: '...'".

Causas más frecuentes:
1. Fechas y horas: Renderizar new Date().toLocaleTimeString() o formatos con zonas horarias distintas entre el servidor (UTC) y el navegador del usuario.
2. APIs exclusivas del navegador: Leer window.innerWidth, navigator.userAgent o localStorage durante el render inicial.
3. Extensiones del navegador: Extensiones como Grammarly o Google Translate que inyectan atributos o nodos en el DOM antes de que React hidrate.
4. HTML inválido: Anidar un <p> dentro de otro <p>, o un <div> dentro de un <p>, lo que causa que el navegador auto-corrija el DOM rompiendo la estructura esperada por React.

Estrategias de solución:
- Técnica IsMounted: Usar un estado useState(false) y cambiarlo a true dentro de un useEffect para renderizar contenido cliente dependiente solo tras montar.
- suppressHydrationWarning: Útil para timestamps donde la diferencia de segundos es aceptable en un elemento específico.
- dynamic imports con ssr: false para componentes que dependen 100% de APIs de cliente.`,
    codeExample: `// Solución canónica para componentes dependientes de browser APIs:
function UserGreeting() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    // Renderiza placeholder idéntico al generado por el servidor
    return <span className="opacity-0">Cargando...</span>;
  }

  // Ahora es 100% seguro leer localStorage o window
  const theme = localStorage.getItem('theme');
  return <span>Tema actual: {theme}</span>;
}`,
    trapsAndRedFlags: [
      'Peligro: Abusar de suppressHydrationWarning en nodos raíz (<body suppressHydrationWarning>). Solo oculta bugs reales de sincronización.',
      'Next.js 14+ emite diffs visuales muy claros en consola que muestran la discrepancia exacta entre Server y Client.'
    ]
  }
];
