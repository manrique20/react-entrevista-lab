import { Topic } from '@/types';

export const LEVEL_3_TOPICS: Topic[] = [
  {
    id: '3.1',
    level: 3,
    levelTitle: 'Intermedio',
    title: '3.1 `useContext` y la Context API',
    summary: 'Compartir datos globales sin prop drilling. La trampa: TODOS los consumidores se re-renderizan cuando el `value` cambia.',
    whatIsIt: `La Context API permite pasar datos a través del árbol de componentes sin necesidad de pasarlos manualmente por props en cada nivel.

Se compone de tres piezas:
1. \`createContext(defaultValue)\`: Crea el objeto de contexto.
2. \`<Context.Provider value={valor}>\`: Envuelve el subárbol y suministra el dato.
3. \`useContext(Context)\` (o \`use(Context)\` en React 19): Hook para leer el valor en cualquier descendiente.

**El problema crítico de rendimiento de Context**:
Cuando el \`value\` del Provider cambia (según \`Object.is\`), **absolutamente todos los componentes que llaman a \`useContext\` se re-renderizan**, incluso si solo consumen una propiedad insignificante del objeto. Context carece de selectores nativos.`,
    codeSnippet: `const ThemeContext = createContext<{ tema: 'light' | 'dark'; toggle: () => void }>({
  tema: 'light',
  toggle: () => {}
});

function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [tema, setTema] = useState<'light' | 'dark'>('light');

  // Optimizamos el value con useMemo para no disparar renders por nuevo objeto:
  const valor = useMemo(() => ({
    tema,
    toggle: () => setTema(t => (t === 'light' ? 'dark' : 'light'))
  }), [tema]);

  return <ThemeContext.Provider value={valor}>{children}</ThemeContext.Provider>;
}

function BotonTema() {
  const { tema, toggle } = useContext(ThemeContext);
  return <button onClick={toggle}>Tema actual: {tema}</button>;
}`,
    interviewTips: [
      'Cuándo usar Context: para datos estables de baja frecuencia de cambio (tema, idioma, usuario logueado). Para datos de alta frecuencia (tickers financieros, inputs en tiempo real, carritos dinámicos), usa Zustand o divide el contexto en varios contextos pequeños.',
      'Explica la técnica de dividir contextos: un `StateContext` para el dato y un `DispatchContext` para las funciones modificadoras. De este modo, los botones que solo modifican no se re-renderizan cuando el dato cambia.'
    ],
    commonTraps: [
      'Pasar un objeto literal directo en el Provider sin `useMemo`: `<Context.Provider value={{ tema, toggle }}>`. Provoca que todos los consumidores se re-rendericen en CADA render del padre porque el objeto `{}` es una referencia nueva.',
      'Usar Context como reemplazo directo de Redux o Zustand en aplicaciones de alta interactividad.'
    ],
    keyTakeaway: 'Context es para inyección de dependencias de baja frecuencia. Para rendimiento fino, divide contextos o usa Zustand.',
    componentKey: 'ContextRerenderDemo',
    tags: ['useContext', 'context-api', 'prop-drilling', 're-renders', 'selectores']
  },
  {
    id: '3.2',
    level: 3,
    levelTitle: 'Intermedio',
    title: '3.2 `useReducer` (Máquina de estados local)',
    summary: 'Alternativa a useState para estados complejos con múltiples transiciones. Función pura `(state, action) => newState` con dispatch estable.',
    whatIsIt: `\`useReducer\` es el hook preferido cuando:
- El estado tiene una estructura compleja (objetos anidados o listas de entidades).
- La siguiente actualización depende de reglas de negocio complejas o de múltiples campos del estado previo.
- Deseas desacoplar la lógica de actualización (el **cómo**) de los componentes que disparan los eventos (el **qué**).

Propiedades clave:
- El reducer es una **función pura**: no debe contener efectos secundarios, llamadas a APIs ni mutaciones.
- La función \`dispatch\` devuelta por React tiene **identidad referencial estrictamente estable**: nunca cambia entre renders, lo que permite pasarla a hijos memoizados sin romper \`React.memo\`.`,
    codeSnippet: `type Estado = { count: number; historial: number[] };
type Accion = { type: 'incrementar' } | { type: 'decrementar' } | { type: 'reset' };

function contadorReducer(state: Estado, action: Accion): Estado {
  switch (action.type) {
    case 'incrementar':
      return { count: state.count + 1, historial: [...state.historial, state.count + 1] };
    case 'decrementar':
      return { count: state.count - 1, historial: [...state.historial, state.count - 1] };
    case 'reset':
      return { count: 0, historial: [] };
    default:
      return state;
  }
}

function ContadorConReducer() {
  const [state, dispatch] = useReducer(contadorReducer, { count: 0, historial: [] });
  return (
    <div>
      <p>Valor: {state.count}</p>
      <button onClick={() => dispatch({ type: 'incrementar' })}>+</button>
      <button onClick={() => dispatch({ type: 'reset' })}>Reset</button>
    </div>
  );
}`,
    interviewTips: [
      'Menciona el patrón "Mini-Redux": Combinar `useReducer` con `useContext` crea una arquitectura global ligera sin dependencias externas, ideal para prototipos o submódulos aislados.',
      'Destaca la estabilidad de `dispatch`: a diferencia de las funciones setters creadas al vuelo, `dispatch` nunca requiere ser envuelto en `useCallback`.'
    ],
    commonTraps: [
      'Introducir efectos secundarios dentro del reducer (hacer fetch o leer Date.now() / Math.random()). El reducer debe ser 100% determinista y puro.',
      'Mutar el estado dentro del reducer (`state.count++`) en lugar de retornar un nuevo objeto.'
    ],
    keyTakeaway: 'useReducer centraliza transiciones complejas en funciones puras y provee un `dispatch` referencialmente estable.',
    componentKey: 'UseReducerDemo',
    tags: ['useReducer', 'funciones-puras', 'dispatch-estable', 'state-machine']
  },
  {
    id: '3.3',
    level: 3,
    levelTitle: 'Intermedio',
    title: '3.3 `useMemo`, `useCallback` y `React.memo`',
    summary: 'Trinidad de optimización: useMemo para resultados pesados, useCallback para referencias de funciones y React.memo para omitir renders.',
    whatIsIt: `El trío fundamental de optimización de rendimiento en React:

1. **\`React.memo(Componente)\`**:
Envuelve un componente funcional para que React omita su ejecución si sus **props no han cambiado** (realiza una comparación superficial \`shallow compare\` de cada prop).
2. **\`useCallback(fn, deps)\`**:
Retorna una versión memoizada de la función que mantiene la misma referencia en memoria a menos que sus dependencias cambien. Es vital cuando pasas callbacks a componentes hijos envueltos en \`React.memo\`.
3. **\`useMemo(fn, deps)\`**:
Ejecuta la función y guarda en caché su **resultado**. Solo vuelve a calcular el valor cuando alguna dependencia cambia.`,
    codeSnippet: `// 1. Componente Hijo memoizado con React.memo
interface FilaProps {
  item: string;
  onEliminar: (item: string) => void;
}
const FilaMemoizada = React.memo(function Fila({ item, onEliminar }: FilaProps) {
  return (
    <li className="flex justify-between p-2 border-b">
      <span>{item}</span>
      <button onClick={() => onEliminar(item)}>Borrar</button>
    </li>
  );
});

// 2. Componente Padre que preserva referencias
function ListaOptimizada({ items }: { items: string[] }) {
  // Cálculo pesado memoizado:
  const itemsFiltrados = useMemo(() => {
    return items.filter(i => i.length > 3).sort();
  }, [items]);

  // Referencia de función estable para no romper FilaMemoizada:
  const handleEliminar = useCallback((item: string) => {
    console.log('Eliminando:', item);
  }, []);

  return (
    <ul>
      {itemsFiltrados.map(item => (
        <FilaMemoizada key={item} item={item} onEliminar={handleEliminar} />
      ))}
    </ul>
  );
}`,
    interviewTips: [
      'Explica la relación simbiótica: `React.memo` en un hijo es completamente inútil si el padre le pasa una función inline (`onDelete={() => ...}`) o un objeto nuevo sin `useCallback`/`useMemo`, porque las props siempre parecerán diferentes en comparación superficial.',
      'Habla del costo de la optimización: cada hook `useMemo`/`useCallback` reserva memoria y ejecuta comparaciones de arrays en cada render. Solo deben usarse con justificación métrica.'
    ],
    commonTraps: [
      'Usar `useCallback` en todos los métodos de un componente cuando sus hijos NO están memoizados con `React.memo`.',
      'Olvidar dependencias requeridas en el array de dependencias, causando bugs de closures obsoletas.'
    ],
    keyTakeaway: 'React.memo previene renders de hijos si las props son idénticas; useCallback y useMemo garantizan la identidad estable de esas props.',
    componentKey: 'MemoCallbackProfilerDemo',
    tags: ['useMemo', 'useCallback', 'React.memo', 'optimizacion', 'shallow-compare']
  },
  {
    id: '3.4',
    level: 3,
    levelTitle: 'Intermedio',
    title: '3.4 Custom Hooks (Hooks personalizados)',
    summary: 'Encapsula y reutiliza lógica con estado. Cada invocación mantiene su propia instancia de estado 100% aislada.',
    whatIsIt: `Un **Custom Hook** es una función estándar de JavaScript cuyo nombre comienza obligatoriamente con el prefijo **\`use\`** y que puede invocar internamente otros hooks de React (\`useState\`, \`useEffect\`, \`useRef\`, etc.).

Regla conceptual crítica:
- Compartir un Custom Hook **comparte lógica y comportamiento**, NO estado en memoria.
- Cada componente que invoca el hook obtiene una **instancia independiente y aislada** de las variables de estado que declare dentro.
- Los custom hooks son el reemplazo moderno de los Higher Order Components (HOC) y de las Render Props.`,
    codeSnippet: `// Custom hook para sincronizar estado con LocalStorage
function useLocalStorage<T>(clave: string, valorInicial: T): [T, (val: T | ((prev: T) => T)) => void] {
  const [valor, setValor] = useState<T>(() => {
    if (typeof window === 'undefined') return valorInicial;
    try {
      const guardado = localStorage.getItem(clave);
      return guardado ? JSON.parse(guardado) : valorInicial;
    } catch {
      return valorInicial;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(clave, JSON.stringify(valor));
    } catch (e) {
      console.error('Error guardando en localStorage:', e);
    }
  }, [clave, valor]);

  return [valor, setValor];
}

// Uso en cualquier componente:
function PerfilTema() {
  const [tema, setTema] = useLocalStorage<'oscuro' | 'claro'>('app_tema', 'claro');
  return <button onClick={() => setTema(t => t === 'claro' ? 'oscuro' : 'claro')}>Tema: {tema}</button>;
}`,
    interviewTips: [
      'Pregunta de entrevista trampa: "Si dos componentes usan el mismo custom hook, ¿comparten el mismo estado?". Respuesta enfática: ¡No! Cada componente tiene su propio estado local aislado. Para compartir estado global se requiere Context o Zustand.',
      'Explica las convenciones de retorno: si devuelve 2 valores tipo tupla (como `[val, setVal]`), permite renombrarlos al desestructurar. Si devuelve más de 2 valores, es preferible retornar un objeto `{ data, loading, error, refetch }`.'
    ],
    commonTraps: [
      'No comenzar el nombre con `use`: el linter no podrá verificar las reglas de hooks dentro de la función.',
      'Crear abstracciones prematuras: no todos los efectos necesitan ser un custom hook; solo aquellos cuya lógica se reutiliza o cuya complejidad amerita desacoplamiento.'
    ],
    keyTakeaway: 'Los custom hooks reutilizan algoritmos con estado. Cada llamada genera un estado privado e independiente.',
    componentKey: 'CustomHooksPlaygroundDemo',
    tags: ['custom-hooks', 'reutilizacion', 'useLocalStorage', 'abstraccion']
  },
  {
    id: '3.5',
    level: 3,
    levelTitle: 'Intermedio',
    title: '3.5 Ciclo de vida y cómo funciona el Re-render',
    summary: 'Las 3 causas de un re-render y el pipeline de ejecución: Fase de Render (puro) -> Fase de Commit (DOM) -> Efectos.',
    whatIsIt: `Un componente funcional se vuelve a ejecutar (re-renderiza) por exactamente 3 motivos:
1. **Cambia su propio estado local** (\`useState\` o \`useReducer\`).
2. **Su componente padre se re-renderiza** (por defecto React vuelve a ejecutar todos los descendientes, a menos que estén protegidos con \`React.memo\`).
3. **Cambia un Contexto** que el componente consume vía \`useContext\`.

**El Pipeline de 3 fases de React**:
- **Fase de Render (Reconciliación)**: React ejecuta el cuerpo de la función del componente, construye el nuevo árbol de Virtual DOM y calcula las diferencias. Es interrumpible en React concurrente y **debe ser 100% puro** (sin mutar variables externas).
- **Fase de Commit**: React aplica las mutaciones calculadas al DOM real de manera síncrona.
- **Fase de Efectos**: Se ejecutan \`useLayoutEffect\` (síncrono antes del pintado) y posteriormente \`useEffect\` (asíncrono tras el pintado del navegador).`,
    codeSnippet: `function RerenderMonitor({ id }: { id: string }) {
  const [contador, setContador] = useState(0);

  // 1. FASE DE RENDER: Este log corre en CADA render
  console.log('[1. Render] Ejecutando función del componente');

  // 2. FASE DE COMMIT / LAYOUT:
  useLayoutEffect(() => {
    console.log('[2. Commit Layout] DOM actualizado en memoria, antes de pintar pantalla');
  });

  // 3. FASE DE EFECTOS PASIVOS:
  useEffect(() => {
    console.log('[3. Passive Effect] El navegador ya pintó la pantalla en el monitor');
  });

  return <button onClick={() => setContador(c => c + 1)}>Rerender ({contador})</button>;
}`,
    interviewTips: [
      'Mito desmontado: "Un cambio de props causa un re-render". Explica: técnicamente las props cambian porque el componente padre se re-renderizó. El re-render del padre es el causante real, no la prop en sí misma.',
      'Diferencia entre renderizar y pintar en el DOM: un componente puede re-renderizarse 100 veces, pero si el Virtual DOM resultante es idéntico al anterior, React no tocará un solo nodo del DOM real.'
    ],
    commonTraps: [
      'Provocar efectos secundarios durante la fase de render (ej: mutar un array global o hacer llamadas HTTP directas en el cuerpo del componente).',
      'Crear componentes dentro del cuerpo de otro componente (`function Padre() { function Hijo() { ... } }`). Esto recrea la definición del componente en cada render, destruyendo su estado interno.'
    ],
    keyTakeaway: 'Re-renderizar no es repintar el DOM. React calcula en memoria y solo toca el DOM si el Virtual DOM cambió.',
    componentKey: 'LifecyclePipelineDemo',
    tags: ['ciclo-de-vida', 're-render', 'fase-render', 'fase-commit', 'pureza']
  },
  {
    id: '3.6',
    level: 3,
    levelTitle: 'Intermedio',
    title: '3.6 Reconciliación y algoritmo de Diffing',
    summary: 'Cómo React compara árboles en complejidad O(n) usando 2 heurísticas: tipos de elementos diferentes y keys en listas.',
    whatIsIt: `El algoritmo general de comparación de dos árboles tiene una complejidad teórica de \`O(n³)\` (para 1,000 elementos implicaría mil millones de comparaciones). React reduce esto a **\`O(n)\`** mediante su algoritmo heurístico de diffing basado en dos premisas:

1. **Dos elementos de tipos diferentes producen árboles totalmente distintos**:
Si una etiqueta cambia de \`<div>\` a \`<span>\`, o de \`<FormularioA />\` a \`<FormularioB />\`, React **destruye por completo el subárbol viejo** (desmonta todos los componentes, pierde su estado en memoria) y monta el nuevo desde cero.
2. **Las listas de hijos se comparan usando la prop \`key\`**:
En lugar de comparar nodos por posición secuencial, React usa la \`key\` para saber si un nodo solo cambió de lugar, reutilizando el elemento DOM y preservando el estado interno del componente.`,
    codeSnippet: `// 1. Destrucción de subárbol por cambio de tipo:
// Cambiar el contenedor de <div> a <section> desmonta <Formulario> y borra todo lo escrito:
{esSeccion ? (
  <section><Formulario /></section>
) : (
  <div><Formulario /></div>
)}

// 2. Reinicio deliberado de estado mediante cambio de key:
// Si cambia el usuario seleccionado, pasar su id como key resetea el formulario limpiamente:
<FormularioEdicion key={usuarioSeleccionado.id} usuario={usuarioSeleccionado} />`,
    interviewTips: [
      'Destaca el truco profesional de "Key reset": cambiar la `key` de un componente fuerza a React a desmontarlo y volver a montarlo con su estado inicial. Es la forma más limpia y declarativa de resetear componentes complejos sin llenar el código de `useEffect` de reseteo.',
      'Explica cómo React maneja las props: si el tipo de elemento es el mismo (ej: `<div className="rojo" />` cambia a `<div className="azul" />`), React no recrea el elemento DOM; simplemente actualiza el atributo en el nodo existente.'
    ],
    commonTraps: [
      'Cambiar condicionalmente el tag envoltorio de un componente (`{esModal ? <div className="modal"><Contenido /></div> : <Contenido />}`) causando pérdidas de estado no deseadas al alternar.',
      'Crear claves dinámicas inestables en listas.'
    ],
    keyTakeaway: 'Tipos distintos desmontan el subárbol; la misma prop key preserva la identidad del elemento.',
    componentKey: 'DiffingHeuristicsDemo',
    tags: ['reconciliacion', 'diffing', 'O(n)', 'key-reset', 'heuristicas']
  },
  {
    id: '3.7',
    level: 3,
    levelTitle: 'Intermedio',
    title: '3.7 Fetching de datos (Loading, Error y Race Conditions)',
    summary: 'Manejo de estados asíncronos con useEffect. Prevención obligatoria de condiciones de carrera mediante AbortController.',
    whatIsIt: `Hacer peticiones HTTP con \`useEffect\` en cliente requiere gestionar 3 estados fundamentales:
- \`data\`: Los datos procesados recibidos de la API.
- \`isLoading\`: Indicador visual de carga.
- \`error\`: Captura de fallos de red o respuestas con status >= 400.

**El peligro de las condiciones de carrera (Race Conditions)**:
Si el usuario pulsa rápidamente en "Usuario 1" y luego en "Usuario 2", se disparan dos peticiones asíncronas concurrentes. Si la respuesta de "Usuario 1" tarda 2 segundos y la de "Usuario 2" tarda 200 milisegundos, la respuesta de "Usuario 1" llegará **al final y sobrescribirá la pantalla**, mostrando datos obsoletos.
**Solución**: Cancelar la petición anterior en la función de limpieza usando **\`AbortController\`** o una bandera booleana.`,
    codeSnippet: `function PerfilUsuario({ userId }: { userId: string }) {
  const [usuario, setUsuario] = useState<any>(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    setCargando(true);
    setError(null);

    fetch(\`/api/users/\${userId}\`, { signal: controller.signal })
      .then(res => {
        if (!res.ok) throw new Error('Error en la petición: ' + res.status);
        return res.json();
      })
      .then(data => {
        setUsuario(data);
        setCargando(false);
      })
      .catch(err => {
        // Ignoramos el error de cancelación intencional
        if (err.name !== 'AbortError') {
          setError(err.message);
          setCargando(false);
        }
      });

    // Cleanup: cancela la petición si el userId cambia antes de responder
    return () => controller.abort();
  }, [userId]);

  if (cargando) return <p>Cargando perfil...</p>;
  if (error) return <p className="text-red-500">Error: {error}</p>;
  return <div>{usuario?.nombre}</div>;
}`,
    interviewTips: [
      'Diferencia entre "Client Fetching con useEffect" y librerías modernas: argumenta por qué en producción preferimos TanStack Query, SWR o Server Components de Next.js (manejan caché, revalidación automática, deduplicación y cancelaciones de forma nativa).',
      'Explica qué ocurre con `fetch` en JavaScript: `fetch` NO rechaza la promesa ante códigos de estado HTTP 404 o 500; debes verificar manualmente `if (!res.ok)`.'
    ],
    commonTraps: [
      'No manejar el caso `err.name === "AbortError"`, mostrando mensajes falsos de error cuando una petición fue cancelada a propósito.',
      'Olvidar el cleanup del AbortController, dejando abierta la puerta a race conditions visuales.'
    ],
    keyTakeaway: 'Usa AbortController en el cleanup del useEffect para evitar que respuestas lentas sobreescriban datos nuevos.',
    componentKey: 'DataFetchingRaceDemo',
    tags: ['data-fetching', 'race-conditions', 'AbortController', 'error-handling']
  },
  {
    id: '3.8',
    level: 3,
    levelTitle: 'Intermedio',
    title: '3.8 Enrutamiento en React (React Router y Modelos Modernos)',
    summary: 'Rutas anidadas con Outlet, navegación programática, parámetros de URL y protección de rutas autenticadas.',
    whatIsIt: `El enrutamiento en aplicaciones Single Page (SPA) simula la navegación tradicional interceptando el historial del navegador mediante la API \`History\` (\`pushState\`, \`replaceState\`) sin recargar la página.

Conceptos fundamentales:
- **Rutas anidadas (Nested Routes)**: La estructura de la URL se mapea a la jerarquía de layouts y páginas. Los componentes padres renderizan un **\`<Outlet />\`** donde se inyecta la ruta hija.
- **Parámetros dinámicos (\`useParams\`)**: Extraer valores de rutas como \`/usuarios/:id\`.
- **Navegación programática (\`useNavigate\` en React Router / \`useRouter\` en Next.js)**: Redirecciones en código tras mutaciones o clics.
- **Rutas Protegidas**: Componentes envoltorios que validan el estado de autenticación antes de renderizar los hijos, redirigiendo a \`/login\` si no hay sesión.`,
    codeSnippet: `// Patrón de Enrutamiento con Rutas Protegidas
function ProtectedRoute({ children, isAuthenticated }: { children: React.ReactNode; isAuthenticated: boolean }) {
  if (!isAuthenticated) {
    // En React Router: return <Navigate to="/login" replace />;
    // En Next.js: redirect('/login');
    return <p className="text-amber-500">Acceso no autorizado. Redirigiendo a login...</p>;
  }
  return <>{children}</>;
}

// Layout con Outlet anidado
function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <aside className="w-64 border-r p-4">Navegación Sidebar</aside>
      <main className="flex-1 p-6">{children /* o <Outlet /> */}</main>
    </div>
  );
}`,
    interviewTips: [
      'Contrasta el enrutamiento basado en librería (React Router v6/v7) con el enrutamiento basado en archivos (File-system routing de Next.js App Router): Next.js elimina la necesidad de configurar un archivo router manual y habilita streaming y Server Components por ruta.',
      'Explica la importancia de la UX en redirecciones: pasar la ruta previa como parámetro de consulta (`/login?redirect=/admin`) para devolver al usuario a donde deseaba ir tras autenticarse.'
    ],
    commonTraps: [
      'Creer que proteger rutas en el frontend es suficiente seguridad. Cualquier usuario puede manipular el JS local; la seguridad real SIEMPRE reside en los endpoints y Server Actions que validan tokens/sesión en el servidor.',
      'Usar etiquetas `<a href="...">` en lugar del componente `<Link>` de React Router o Next.js, perdiendo el estado de la SPA y forzando recargas completas del navegador.'
    ],
    keyTakeaway: 'El enrutamiento moderno se basa en rutas anidadas con layouts persistentes y navegación sin recargas.',
    componentKey: 'RouterSimulatorDemo',
    tags: ['enrutamiento', 'react-router', 'outlet', 'rutas-protegidas', 'spa']
  },
  {
    id: '3.9',
    level: 3,
    levelTitle: 'Intermedio',
    title: '3.9 Error Boundaries (Límites de error)',
    summary: 'Atrapan excepciones durante el renderizado en subárboles y muestran UI de fallback sin que toda la app se caiga en blanco.',
    whatIsIt: `Un **Error Boundary** es un componente de React que captura errores de JavaScript en cualquier parte de su subárbol de componentes hijos durante:
- La fase de renderizado.
- Métodos del ciclo de vida.
- Constructores.

Muestra una interfaz de respaldo (fallback) en lugar de permitir que la pantalla entera se quede en blanco (Crash).
**Requisito histórico**: Debe ser un **componente de clase** porque utiliza los métodos de ciclo de vida \`static getDerivedStateFromError()\` y \`componentDidCatch()\`. En apps modernas se suele usar la biblioteca \`react-error-boundary\` o el archivo \`error.tsx\` nativo de Next.js App Router.

**Lo que NO capturan los Error Boundaries**:
- Errores dentro de event handlers (\`onClick\`).
- Código asíncrono (\`setTimeout\`, promesas de \`fetch\`).
- Server-Side Rendering (SSR).`,
    codeSnippet: `// Componente de Clase Error Boundary
class ErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback?: React.ReactNode },
  { hasError: boolean; error: Error | null }
> {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error) {
    // Actualiza el estado para que el siguiente render muestre la UI de fallback
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Envío del error a un servicio de telemetría (Sentry, Datadog)
    console.error('Error capturado por boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="p-4 border border-red-500 bg-red-50 rounded text-red-700">
          <h4>Ocurrió un error en esta sección</h4>
          <button onClick={() => this.setState({ hasError: false, error: null })}>Reintentar</button>
        </div>
      );
    }
    return this.props.children;
  }
}`,
    interviewTips: [
      'Pregunta clásica de entrevista: "¿Por qué los Error Boundaries no capturan errores dentro de un `onClick`?". Respuesta: Porque los event handlers ocurren fuera de la fase de renderizado de React. Para capturar excepciones en handlers se usa un bloque estándar `try / catch`.',
      'Menciona cómo Next.js App Router resuelve esto: mediante archivos convencionales `error.tsx`, que envuelven automáticamente el segmento de ruta en un Error Boundary de React con función `reset()`.'
    ],
    commonTraps: [
      'Colocar un único Error Boundary en la raíz absoluta de la app: si falla un componente secundario, toda la aplicación se reemplaza por el mensaje de error. Lo ideal es colocar boundaries granulares por sección o widget.',
      'Intentar escribir un Error Boundary funcional puro con hooks (React aún no provee un hook `useErrorBoundary` nativo para capturar excepciones de render).'
    ],
    keyTakeaway: 'Los Error Boundaries aíslan fallos de render sin romper la aplicación. No capturan errores en handlers ni promesas asíncronas.',
    componentKey: 'ErrorBoundaryDemo',
    tags: ['error-boundaries', 'resiliencia', 'fallbacks', 'sentry', 'ciclo-de-vida']
  },
  {
    id: '3.10',
    level: 3,
    levelTitle: 'Intermedio',
    title: '3.10 Portals (`createPortal`)',
    summary: 'Renderiza elementos hijos en un nodo DOM diferente mientras preserva el árbol de eventos y contexto de React intacto.',
    whatIsIt: `\`createPortal(children, domNode)\` permite insertar un fragmento de JSX en un nodo del DOM que reside fuera de la jerarquía del componente padre (por ejemplo, directamente como hijo de \`document.body\`).

Casos de uso indispensables:
- Modales y diálogos flotantes.
- Menús desplegables (dropdowns), selectores y context menus.
- Tooltips flotantes y notificaciones Toast flotantes.
Evita problemas con contenedores padres que tienen \`overflow: hidden\`, \`position: relative\` o reglas de \`z-index\` conflictivas.

**El superpoder de los Portals (Event Bubbling)**:
Aunque el nodo HTML se renderice físicamente en el fondo del \`<body>\`, en el árbol de componentes de React **sigue siendo un hijo normal**. Por lo tanto:
- Los eventos (como clics) hacen "bubbling" hacia arriba a través del árbol de React, no del árbol del DOM físico.
- Tiene acceso a todos los Providers de Context del componente padre.`,
    codeSnippet: `import { createPortal } from 'react-dom';

function ModalPortal({ isOpen, onClose, children }: { isOpen: boolean; onClose: () => void; children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!isOpen || !mounted) return null;

  // Renderizamos en document.body para escapar de cualquier overflow del contenedor padre
  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-card border p-6 rounded-2xl shadow-2xl max-w-md w-full m-4"
        onClick={e => e.stopPropagation()} // Evita cerrar el modal al hacer clic en su contenido
      >
        {children}
      </div>
    </div>,
    document.body
  );
}`,
    interviewTips: [
      'Explica la hidratación segura en Next.js/SSR: como `document` no existe durante el render en el servidor, un Portal debe condicionarse a estar montado en cliente (`if (!mounted) return null;` tras un `useEffect`) para evitar fallos de hidratación.',
      'Destaca que el bubbling de eventos de React cruza el portal: si haces clic dentro del modal montado en `body`, un `onClick` en el componente padre en React seguirá capturando el evento.'
    ],
    commonTraps: [
      'Intentar acceder a `document.body` directamente en el cuerpo del render en SSR, provocando el error `ReferenceError: document is not defined`.',
      'Olvidar `e.stopPropagation()` dentro del diálogo, provocando que cualquier interacción cierre el modal si el backdrop tiene listener.'
    ],
    keyTakeaway: 'createPortal inserta el HTML en cualquier nodo DOM pero conserva el árbol de eventos y contexto de React.',
    componentKey: 'PortalModalDemo',
    tags: ['portals', 'createPortal', 'modales', 'z-index', 'event-bubbling']
  },
  {
    id: '3.11',
    level: 3,
    levelTitle: 'Intermedio',
    title: '3.11 `forwardRef` y `useImperativeHandle`',
    summary: 'Pasar refs a componentes hijos y exponer métodos imperativos personalizados al padre (simplificado en React 19).',
    whatIsIt: `Por defecto, los componentes funcionales no aceptan la prop \`ref\` directamente.

- **\`forwardRef\`**: Función de orden superior que permite a un componente aceptar una \`ref\` y reenviarla (forward) hacia uno de sus elementos DOM internos.
- **\`useImperativeHandle(ref, createHandle, [deps])\`**: Personaliza la instancia expuesta a través de la \`ref\`. En lugar de exponer el nodo DOM nativo completo con todas sus propiedades, expones una API imperativa limpia con funciones específicas (\`focus()\`, \`scrollIntoView()\`, \`reset()\`).

**Revolución en React 19**:
En React 19, **\`ref\` es una prop estándar como cualquier otra** (\`<MyInput ref={myRef} />\`). \`forwardRef\` queda oficialmente en desuso (deprecated) a favor de recibir \`ref\` directamente en los argumentos de la función.`,
    codeSnippet: `// Patrón en React 18 con forwardRef y useImperativeHandle:
export interface InputImperativoRef {
  enfocar: () => void;
  limpiar: () => void;
}

const CampoTexto = forwardRef<InputImperativoRef, { placeholder: string }>((props, ref) => {
  const domInputRef = useRef<HTMLInputElement>(null);

  // Exponemos solo métodos intencionales al padre:
  useImperativeHandle(ref, () => ({
    enfocar: () => domInputRef.current?.focus(),
    limpiar: () => {
      if (domInputRef.current) domInputRef.current.value = '';
    }
  }));

  return <input ref={domInputRef} placeholder={props.placeholder} className="input" />;
});

// En React 19 ya no se necesita forwardRef:
// function CampoTexto({ ref, placeholder }: { ref?: React.Ref<InputImperativoRef>; placeholder: string }) { ... }`,
    interviewTips: [
      'Menciona el principio de encapsulamiento: `useImperativeHandle` es excelente para librerías de componentes porque evita filtrar el nodo DOM nativo crudo al consumidor, manteniendo un contrato de API limpio y restringido.',
      'Destaca la mejora de React 19: `ref` como prop regular elimina el boilerplate de `forwardRef` y simplifica la firma de tipos en TypeScript.'
    ],
    commonTraps: [
      'Abusar de llamadas imperativas (`ref.current.hacerAlgo()`) para flujos que deberían resolverse de forma puramente declarativa con props y estado.',
      'Olvidar que en React 18 un componente funcional sin `forwardRef` arrojará un warning si le pasas `ref`.'
    ],
    keyTakeaway: 'useImperativeHandle expone una API imperativa personalizada. En React 19 `ref` pasa a ser una prop regular.',
    componentKey: 'ForwardRefImperativeDemo',
    tags: ['forwardRef', 'useImperativeHandle', 'react-19-ref', 'encapsulamiento']
  },
  {
    id: '3.12',
    level: 3,
    levelTitle: 'Intermedio',
    title: '3.12 Patrones avanzados de composición',
    summary: 'Render Props, Compound Components y el patrón Container/Presentational para crear componentes altamente reusables.',
    whatIsIt: `A lo largo de la evolución de React se han consolidado patrones de diseño arquitectónicos clave:

1. **Compound Components (Componentes Compuestos)**:
Componentes que trabajan juntos como una unidad cohesiva compartiendo estado implícito mediante un contexto interno (inspirados en el HTML nativo \`<select>\` y \`<option>\`). Ejemplos: Tabs, Acordeones, Menús dropdown (estilo Radix UI / Shadcn).
2. **Render Props**:
Una técnica donde una prop recibe una función que devuelve elementos de React (\`<Mouse render={({ x, y }) => <p>{x}, {y}</p>} />\`). Aunque mayoritariamente reemplazada por Custom Hooks, sigue vigente en librerías de formularios y virtualización.
3. **Container / Presentational Pattern**:
Separar el componente que maneja la lógica de negocio y llamadas a API (Container) del componente que únicamente renderiza UI pura a partir de props (Presentational).`,
    codeSnippet: `// Patrón Compound Components para un Acordeón
const AccordionContext = createContext<{
  abierto: string | null;
  toggle: (id: string) => void;
}>({ abierto: null, toggle: () => {} });

function Accordion({ children }: { children: React.ReactNode }) {
  const [abierto, setAbierto] = useState<string | null>(null);
  const toggle = (id: string) => setAbierto(cur => (cur === id ? null : id));
  return (
    <AccordionContext.Provider value={{ abierto, toggle }}>
      <div className="border rounded-xl divide-y">{children}</div>
    </AccordionContext.Provider>
  );
}

function AccordionItem({ id, titulo, children }: { id: string; titulo: string; children: React.ReactNode }) {
  const { abierto, toggle } = useContext(AccordionContext);
  const estaAbierto = abierto === id;
  return (
    <div>
      <button onClick={() => toggle(id)} className="w-full text-left p-4 font-medium flex justify-between">
        {titulo} <span>{estaAbierto ? '▲' : '▼'}</span>
      </button>
      {estaAbierto && <div className="p-4 bg-muted/20 border-t">{children}</div>}
    </div>
  );
}
Accordion.Item = AccordionItem;`,
    interviewTips: [
      'Explica por qué Compound Components es el estándar en librerías de diseño modernas (Radix UI, Headless UI, Ark UI): le otorgan al consumidor control absoluto sobre el orden y la estructura del markup sin tener que exponer 50 props de configuración complejas.',
      'Explica cómo los Custom Hooks reemplazaron el 90% de los casos de HOCs y Render Props eliminando el "Wrapper Hell" (árboles profundamente anidados de componentes contenedores).'
    ],
    commonTraps: [
      'Intentar resolver la compartición de lógica de negocio usando HOCs en proyectos nuevos cuando un Custom Hook es mucho más transparente y tipable.',
      'Rigidez en componentes que intentan manejar toda la estructura interna con un array de objetos de configuración en lugar de permitir composición declarativa.'
    ],
    keyTakeaway: 'Compound components otorgan máxima flexibilidad de marcado compartiendo estado implícito vía Context.',
    componentKey: 'CompositionPatternsDemo',
    tags: ['compound-components', 'render-props', 'container-presentational', 'radix-ui']
  },
  {
    id: '3.13',
    level: 3,
    levelTitle: 'Intermedio',
    title: '3.13 Virtualización de listas (Windowing)',
    summary: 'Técnica para renderizar miles de elementos calculando solo la ventana visible en viewport (react-window / TanStack Virtual).',
    whatIsIt: `Intentar renderizar 10,000 elementos en una lista estándar colapsa el rendimiento del navegador:
- Crea decenas de miles de nodos DOM en memoria.
- Provoca bloqueos del hilo principal durante el cálculo de estilos y layout (Reflow).
- Consume cientos de megabytes de memoria RAM.

**La técnica de Virtualización (Windowing)**:
Consiste en renderizar **únicamente los elementos que actualmente están visibles dentro del área de desplazamiento (Viewport)**, más un pequeño margen (overscan) por encima y por debajo para permitir un scroll suave.
A medida que el usuario se desplaza:
- Los elementos que salen de la pantalla se reciclan o desmontan del DOM.
- Los nuevos elementos que entran se renderizan en sus posiciones correspondientes usando \`transform: translateY(...)\` o posicionamiento absoluto.
El DOM siempre mantiene solo 15 o 20 nodos activos, sin importar si la lista tiene 100,000 elementos.`,
    codeSnippet: `// Demostración conceptual de ventana virtualizada:
function VirtualListDemo({ items, itemHeight = 40, contenedorAlto = 300 }: { items: string[]; itemHeight?: number; contenedorAlto?: number }) {
  const [scrollTop, setScrollTop] = useState(0);

  const totalHeight = items.length * itemHeight;
  const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - 2); // margen superior
  const endIndex = Math.min(items.length, Math.ceil((scrollTop + contenedorAlto) / itemHeight) + 2); // margen inferior

  const itemsVisibles = items.slice(startIndex, endIndex);

  return (
    <div
      style={{ height: contenedorAlto, overflowY: 'auto', position: 'relative' }}
      onScroll={e => setScrollTop(e.currentTarget.scrollTop)}
      className="border rounded-lg bg-card"
    >
      {/* Contenedor fantasma que da la altura total del scrollbar real */}
      <div style={{ height: totalHeight, position: 'relative' }}>
        {itemsVisibles.map((item, index) => {
          const itemIndex = startIndex + index;
          return (
            <div
              key={itemIndex}
              style={{
                position: 'absolute',
                top: itemIndex * itemHeight,
                height: itemHeight,
                width: '100%'
              }}
              className="p-2 border-b flex items-center"
            >
              Elemento #{itemIndex + 1}: {item}
            </div>
          );
        })}
      </div>
    </div>
  );
}`,
    interviewTips: [
      'Menciona las librerías líderes en el ecosistema: `react-window` (creada por Dan Abramov / Brian Vaughn) y `@tanstack/react-virtual` (headless, soporta elementos de tamaño dinámico y scroll horizontal/vertical).',
      'Explica el trade-off: la virtualización rompe la búsqueda nativa con `Ctrl+F` del navegador sobre elementos fuera de vista y puede complicar la accesibilidad para lectores de pantalla si no se gestionan roles adecuados.'
    ],
    commonTraps: [
      'Renderizar listas de miles de registros sin paginación ni virtualización esperando que el navegador lo gestione.',
      'No fijar una altura fija al contenedor contenedor o al elemento virtualizado, causando cálculos erróneos de scroll.'
    ],
    keyTakeaway: 'La virtualización solo mantiene en el DOM los elementos visibles en el viewport, permitiendo manejar 100k elementos a 60 FPS.',
    componentKey: 'VirtualizationDemo',
    tags: ['virtualizacion', 'windowing', 'react-window', 'tanstack-virtual', 'rendimiento']
  }
];
