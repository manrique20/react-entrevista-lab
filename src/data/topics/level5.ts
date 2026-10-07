import { Topic } from '@/types';

export const LEVEL_5_TOPICS: Topic[] = [
  {
    id: '5.1',
    level: 5,
    levelTitle: 'Rendimiento',
    title: '5.1 Profiler de React DevTools y Componente `<Profiler>`',
    summary: 'Mide antes de optimizar. Graba sesiones de renderizado, analiza tiempos de CPU y descubre por qué renderizó cada nodo.',
    whatIsIt: `Optimizar sin medir es el mayor error en frontend. La herramienta principal de diagnóstico es el **Profiler de React DevTools**:
- Permite grabar una interacción (ej: teclear en un input o hacer clic en un filtro) y genera un gráfico en llamas (Flamegraph) o por ranking.
- Al activar la opción **"Record why each component rendered"**, React explica con precisión si un componente se renderizó por:
  1. Cambio de hooks (estado).
  2. Cambio de props (mostrando el nombre exacto de la prop que cambió).
  3. Porque el componente padre se re-renderizó.

También existe el componente nativo de React **\`<Profiler id="..." onRender={callback}>\`**, que permite capturar métricas en código durante producción o pruebas de rendimiento:
- \`actualDuration\`: Tiempo real dedicado a renderizar el componente y sus descendientes.
- \`baseDuration\`: Estimación de cuánto tardaría en renderizarse todo el subárbol sin ninguna optimización.`,
    codeSnippet: `import { Profiler, ProfilerOnRenderCallback } from 'react';

function DashboardConMetricas() {
  const handleRender: ProfilerOnRenderCallback = (id, phase, actualDuration, baseDuration) => {
    console.log(\`[Profiler:\${id}] Fase: \${phase} | Duración real: \${actualDuration.toFixed(2)}ms | Base: \${baseDuration.toFixed(2)}ms\`);
  };

  return (
    <Profiler id="ListadoReportes" onRender={handleRender}>
      <ListadoComplejo />
    </Profiler>
  );
}`,
    interviewTips: [
      'Regla fundamental: "Premature optimization is the root of all evil". En una entrevista senior, siempre di que antes de tocar una línea de código o poner un `useMemo`, mides con el Profiler para identificar el cuello de botella real.',
      'Explica la métrica `actualDuration` vs `baseDuration`: si `actualDuration` es mucho menor que `baseDuration`, significa que tus optimizaciones de memoización están funcionando exitosamente.'
    ],
    commonTraps: [
      'Ejecutar el profiler en modo de desarrollo y asumir que esos tiempos representan producción (en desarrollo React incluye verificaciones adicionales de StrictMode y warnings que duplican el tiempo).',
      'Optimizar componentes cuyo render tarda 0.05ms ignorando peticiones de red o renders bloqueantes de 200ms.'
    ],
    keyTakeaway: 'Siempre mide con el Profiler antes de optimizar. Identifica la causa exacta del render en las DevTools.',
    componentKey: 'ProfilerDemo',
    tags: ['profiler', 'devtools', 'flamegraph', 'actualDuration', 'medicion']
  },
  {
    id: '5.2',
    level: 5,
    levelTitle: 'Rendimiento',
    title: '5.2 Re-renders innecesarios y las 3 técnicas para evitarlos',
    summary: 'Las 3 formas comprobadas de aislar renders: 1) Bajar el estado, 2) Levantar contenido con children, 3) React.memo.',
    whatIsIt: `Un re-render innecesario ocurre cuando un componente vuelve a ejecutar su función sin que el resultado visual para el usuario haya cambiado en lo absoluto.

**Las 3 técnicas comprobadas para resolverlo (en orden de elegancia)**:
1. **Bajar el estado (State Colocation)**:
Mueve el estado al componente más bajo posible en el árbol que lo necesite. Si un input solo actualiza su propio texto, su estado no debe estar en la raíz de la página.
2. **Pasar contenido como \`children\` o slots**:
Si un componente contenedor tiene estado que cambia con frecuencia (ej: scroll o posición del ratón), pasa el contenido pesado como \`children\`. Dado que el componente padre ya creó ese \`children\`, su referencia no cambia y React NO vuelve a ejecutar su función.
3. **\`React.memo\` + referencias estables**:
Envolver el componente pesado en \`React.memo\` y asegurar que todas las props que recibe (objetos y funciones) tengan identidad estable mediante \`useMemo\` y \`useCallback\`.`,
    codeSnippet: `// Técnica 2: Pasar children para evitar renders (¡Súper elegante!)
function MouseTrackerWrapper({ children }: { children: React.ReactNode }) {
  const [pos, setPos] = useState({ x: 0, y: 0 });

  return (
    <div onMouseMove={e => setPos({ x: e.clientX, y: e.clientY })}>
      <p>Coordenadas: {pos.x}, {pos.y}</p>
      {/* children NO se re-renderiza cuando pos cambia, porque fue instanciado fuera */}
      {children}
    </div>
  );
}

// Uso: ArbolPesado no sufre re-renders con cada movimiento del mouse
<MouseTrackerWrapper>
  <ArbolDeComponentesPesado />
</MouseTrackerWrapper>`,
    interviewTips: [
      'La técnica de `children` suele sorprender positivamente a los entrevistadores técnicos porque no requiere `React.memo`, `useMemo` ni `useCallback`, resolviendo el problema mediante simple composición de componentes nativa.',
      'Explica por qué un re-render innecesario no siempre es un problema: si el componente es ligero (ej: un icono o un botón simple), el costo de renderizarlo es de microsegundos y no afecta la tasa de 60 FPS.'
    ],
    commonTraps: [
      'Crear objetos inline en props de componentes memoizados: `<HijoMemoizado estilo={{ color: "red" }} />`. El objeto `{}` es nuevo en cada render y destruye por completo el beneficio de `React.memo`.',
      'Llenar todo el código de `React.memo` a ciegas sin verificar si las props son referencialmente estables.'
    ],
    keyTakeaway: 'Baja el estado y usa composición con `children` antes de saturar el código con memoizaciones manuales.',
    componentKey: 'PreventRerendersDemo',
    tags: ['re-renders', 'state-colocation', 'children-as-props', 'React.memo', 'optimizacion']
  },
  {
    id: '5.3',
    level: 5,
    levelTitle: 'Rendimiento',
    title: '5.3 Code Splitting: `React.lazy` y `<Suspense>`',
    summary: 'Divide el bundle de JavaScript en fragmentos descargados bajo demanda, acelerando el tiempo de carga inicial de la página.',
    whatIsIt: `Por defecto, los bundlers agrupan todo el código de tu aplicación en un único archivo JavaScript masivo. Un usuario que entra a la página de inicio descarga también el código de las páginas de administración, gráficos pesados y editores que quizás nunca use.

**Code Splitting**:
Divide la aplicación en múltiples archivos (chunks) que se descargan de forma perezosa por la red únicamente cuando se van a renderizar.
- \`React.lazy(() => import('./ModuloPesado'))\`: Importación dinámica asíncrona (requiere export default).
- \`<Suspense fallback={<Loader />}>\`: Envoltorio declarativo que muestra una UI de respaldo mientras el trozo de JavaScript se descarga por la red.
- En Next.js: Las rutas se dividen automáticamente por página y para componentes específicos se utiliza \`next/dynamic\`.`,
    codeSnippet: `import { lazy, Suspense } from 'react';

// El código de GraficoComplejo no se incluye en el bundle inicial
const GraficoPesado = lazy(() => import('./GraficoPesado'));

function PaginaReportes() {
  const [mostrarGrafico, setMostrarGrafico] = useState(false);

  return (
    <div className="p-6">
      <button onClick={() => setMostrarGrafico(true)}>Cargar Gráfico Detallado</button>

      {mostrarGrafico && (
        <Suspense fallback={<div className="h-64 animate-pulse bg-muted rounded-xl" />}>
          <GraficoPesado />
        </Suspense>
      )}
    </div>
  );
}`,
    interviewTips: [
      'En Next.js: explica `next/dynamic` con la opción `{ ssr: false }`. Es la solución definitiva para importar librerías pesadas que dependen del objeto `window` del navegador (ej: ApexCharts, Leaflet, librerías de Canvas) sin romper el render en el servidor.',
      'Menciona cómo los navegadores modernos ejecutan `prefetching`: Next.js detecta los componentes `<Link>` en el viewport y precarga los chunks en segundo plano cuando la red está inactiva.'
    ],
    commonTraps: [
      'Llamar a `React.lazy()` DENTRO del cuerpo del componente en lugar de hacerlo en el nivel superior del archivo (provocaría recrear la promesa en cada render).',
      'No proveer un fallback visual de altura adecuada en `<Suspense>`, lo que causa saltos de layout abruptos (CLS) al cargarse el chunk.'
    ],
    keyTakeaway: 'React.lazy + Suspense divide el bundle y descarga módulos pesados solo cuando el usuario los necesita.',
    componentKey: 'CodeSplittingDemo',
    tags: ['code-splitting', 'React.lazy', 'Suspense', 'next-dynamic', 'bundle-size']
  },
  {
    id: '5.4',
    level: 5,
    levelTitle: 'Rendimiento',
    title: '5.4 Optimización y Lazy Loading de imágenes',
    summary: 'Prevenir saltos de layout (CLS), formatos modernos (WebP/AVIF), atributos srcset y el componente `<Image>` de Next.js.',
    whatIsIt: `Las imágenes representan típicamente más del 60% del peso de una página web moderna y son el principal causante de degradación de las métricas LCP y CLS.

Estrategias de optimización:
1. **Atributo nativo \`loading="lazy"\`**: Indica al navegador que no descargue la imagen hasta que esté a punto de entrar al viewport.
2. **Dimensiones explícitas (\`width\` y \`height\` o \`aspect-ratio\`)**: Reserva el espacio en el layout antes de que la imagen termine de descargar, eliminando por completo los saltos de contenido (**Cumulative Layout Shift - CLS**).
3. **Formatos de última generación**: Servir WebP o AVIF (hasta 50% más livianos que JPEG/PNG con idéntica calidad).
4. **El componente \`<Image />\` de Next.js**:
- Optimización automática de tamaño en el servidor según el dispositivo.
- Prevención nativa de CLS mediante reserva de aspect ratio.
- Placeholders difuminados (\`blurDataURL\`) mientras carga.`,
    codeSnippet: `// 1. Enfoque nativo con reserva de aspect-ratio contra CLS:
<img
  src="/hero.jpg"
  alt="Dashboard"
  loading="lazy"
  width={800}
  height={450}
  className="w-full h-auto aspect-video rounded-xl object-cover"
/>

// 2. En Next.js con optimización automática:
// import Image from 'next/image';
// <Image src="/hero.jpg" alt="Dashboard" width={800} height={450} priority={false} placeholder="blur" blurDataURL="..." />`,
    interviewTips: [
      'Menciona la prop `priority` en `<Image />` de Next.js: la imagen principal que conforma el LCP (Largest Contentful Paint) arriba del pliegue (Above the fold) NUNCA debe ser lazy. Debe marcarse con `priority` para precargarse con máxima prioridad en el `<head>`.',
      'Explica cómo los saltos de layout penalizan el SEO técnico y la experiencia de usuario (un usuario intentando hacer clic en un botón que se mueve de repente por una imagen que terminó de cargar).'
    ],
    commonTraps: [
      'Poner `loading="lazy"` a la imagen del hero banner principal de la página, retrasando el LCP innecesariamente.',
      'Omitir atributos de tamaño o aspect ratio en CSS, disparando el CLS por encima del umbral de 0.1.'
    ],
    keyTakeaway: 'Reserva dimensiones fijas para evitar CLS y optimiza formatos con AVIF/WebP o Next.js `<Image />`.',
    componentKey: 'ImageOptimizationDemo',
    tags: ['imagenes', 'lazy-loading', 'CLS', 'LCP', 'next-image', 'web-vitals']
  },
  {
    id: '5.5',
    level: 5,
    levelTitle: 'Rendimiento',
    title: '5.5 Tamaño del Bundle y Tree Shaking',
    summary: 'Eliminación de código muerto en build time. Imports nombrados vs librerías monolíticas (Lodash, Moment vs date-fns/Intl).',
    whatIsIt: `**Tree Shaking** es un proceso de optimización que ejecutan los empaquetadores modernos (Webpack, Rollup, Turbopack, esbuild) para eliminar el código que se exporta pero que tu aplicación nunca llega a importar o utilizar ("código muerto").

Requisitos para un Tree Shaking exitoso:
- Usar **módulos ES (ESM)** con sintaxis estándar (\`import\` y \`export\`), en lugar de CommonJS (\`require\` / \`module.exports\`).
- Paquetes configurados con \`"sideEffects": false\` en su \`package.json\`.
- Evitar importaciones globales de librerías masivas:
  - ❌ \`import _ from 'lodash';\` (agrega 75KB innecesarios).
  - ✅ \`import debounce from 'lodash-es/debounce';\` (solo agrega 2KB).
  - ✅ Mejor aún: reemplazar \`moment.js\` por la API nativa \`Intl\` o librerías modulares como \`date-fns\`.`,
    codeSnippet: `// ❌ Mala práctica: Arrastra la librería completa sin Tree Shaking
// import _ from 'lodash';
// const res = _.capitalize('react');

// ✅ Buena práctica: Importación modular con ESM
import capitalize from 'lodash-es/capitalize';
const res = capitalize('react');

// Herramientas de diagnóstico de bundle:
// - @next/bundle-analyzer
// - source-map-explorer`,
    interviewTips: [
      'Explica el concepto de `sideEffects: false`: le informa al empaquetador que los archivos del paquete no modifican variables globales ni ejecutan código con efectos secundarios al ser importados, permitiendo podar con seguridad cualquier función no utilizada.',
      'Menciona el comando `@next/bundle-analyzer`: genera un mapa de árbol interactivo que visualiza el peso exacto de cada dependencia de npm en los paquetes de cliente.'
    ],
    commonTraps: [
      'Importar iconos usando `import * as Icons from "lucide-react"`, lo que puede arrastrar cientos de SVGs al bundle de JavaScript.',
      'Utilizar librerías diseñadas para Node.js o con módulos CommonJS pesados en componentes de cliente.'
    ],
    keyTakeaway: 'Utiliza siempre ESM, subrutas específicas y librerías modernas para que el empaquetador elimine el código muerto.',
    componentKey: 'BundleTreeShakingDemo',
    tags: ['tree-shaking', 'bundle-size', 'esm', 'bundle-analyzer', 'dead-code']
  },
  {
    id: '5.6',
    level: 5,
    levelTitle: 'Rendimiento',
    title: '5.6 Core Web Vitals (LCP, CLS, INP)',
    summary: 'Las métricas oficiales de Google para medir experiencia de usuario real: carga visual, estabilidad y velocidad de interacción.',
    whatIsIt: `Google evalúa la experiencia de usuario y el posicionamiento SEO a través de los **Core Web Vitals**:

1. **LCP (Largest Contentful Paint)**:
- Mide el tiempo de renderizado del elemento de contenido visible más grande en la pantalla (imagen hero o bloque de texto principal).
- **Meta**: < 2.5 segundos.
2. **CLS (Cumulative Layout Shift)**:
- Mide la estabilidad visual cuantificando los movimientos inesperados de elementos durante la carga.
- **Meta**: < 0.1.
3. **INP (Interaction to Next Paint - Reemplazó a FID)**:
- Mide la latencia de respuesta general de la página a todas las interacciones del usuario (clics, pulsaciones de teclas) a lo largo de toda su visita.
- **Meta**: < 200 milisegundos.`,
    codeSnippet: `// Medición en tiempo real de Web Vitals en Next.js:
// app/layout.tsx o reporte de analíticas:
export function reportWebVitals(metric: any) {
  switch (metric.name) {
    case 'LCP':
      console.log('LCP (meta < 2500ms):', metric.value);
      break;
    case 'CLS':
      console.log('CLS (meta < 0.1):', metric.value);
      break;
    case 'INP':
      console.log('INP (meta < 200ms):', metric.value);
      break;
    default:
      break;
  }
}`,
    interviewTips: [
      'INP es la métrica reina para desarrolladores de React: explica cómo `useTransition` y `useDeferredValue` en React 18/19 están diseñados específicamente para optimizar el INP dividiendo trabajo pesado en microtareas para que el navegador pueda pintar frames intermedios en menos de 200ms.',
      'Cómo mejorar LCP en Next.js: Server-Side Rendering (SSR), optimizar fuentes con `next/font` (cero parpadeo FOIT/FOUT) y marcar imágenes clave con `priority`.'
    ],
    commonTraps: [
      'Pensar que FID sigue siendo la métrica de interacción: Google reemplazó formalmente FID por INP en marzo de 2024. Mencionar INP demuestra actualidad.',
      'Medir Web Vitals únicamente en computadoras de escritorio potentes con conexión de fibra en vez de simular dispositivos móviles de gama media y redes 4G lentas.'
    ],
    keyTakeaway: 'LCP mide velocidad de carga, CLS estabilidad visual e INP capacidad de respuesta a las interacciones del usuario.',
    componentKey: 'WebVitalsDemo',
    tags: ['web-vitals', 'LCP', 'CLS', 'INP', 'lighthouse', 'seo']
  },
  {
    id: '5.7',
    level: 5,
    levelTitle: 'Rendimiento',
    title: '5.7 Debounce y Throttle (Control de frecuencia)',
    summary: 'Debounce: ejecuta tras un periodo de inactividad. Throttle: ejecuta como máximo una vez por intervalo de tiempo fijado.',
    whatIsIt: `Técnicas de limitación de frecuencia para eventos que se disparan docenas de veces por segundo:

1. **Debounce (Anti-rebote)**:
- Agrupa múltiples llamadas y ejecuta la función **solo después de que haya transcurrido un periodo de inactividad** determinado.
- Si entra un nuevo evento antes de que venza el tiempo, el temporizador se reinicia.
- **Caso típico**: Buscadores con autocompletado en tiempo real, guardado automático de borradores.

2. **Throttle (Estrangulamiento)**:
- Garantiza que la función se ejecute **como máximo una vez cada X milisegundos**, sin importar cuántas veces se dispare el evento.
- **Caso típico**: Eventos de \`scroll\`, redimensionamiento de ventana (\`resize\`), seguimiento de posición del puntero del mouse.`,
    codeSnippet: `// Custom hook useDebounce
function useDebounce<T>(valor: T, delay: number = 300): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(valor);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(valor);
    }, delay);

    // Si el valor cambia antes de 'delay', cancelamos el temporizador previo
    return () => {
      clearTimeout(handler);
    };
  }, [valor, delay]);

  return debouncedValue;
}

// Uso en buscador:
function BuscadorDebounced() {
  const [texto, setTexto] = useState('');
  const busquedaRetardada = useDebounce(texto, 400);

  useEffect(() => {
    if (busquedaRetardada) {
      console.log('Llamando a la API con:', busquedaRetardada);
    }
  }, [busquedaRetardada]);

  return <input value={texto} onChange={e => setTexto(e.target.value)} placeholder="Escribe para buscar..." />;
}`,
    interviewTips: [
      'Pregunta de pizarra clásica: implementar `useDebounce` desde cero. La clave está en explicar la función de cleanup de `useEffect` con `clearTimeout`.',
      'Contrasta `useDebounce` con `useTransition`: Debounce espera a que el usuario termine de teclear; `useTransition` no espera, ejecuta el cálculo en paralelo con baja prioridad y lo interrumpe si el usuario pulsa otra tecla.'
    ],
    commonTraps: [
      'Crear la función debounce dentro del cuerpo del componente sin memoizarla con `useCallback` o `useRef`, recreando una nueva instancia de timer en cada render.',
      'Usar throttle en buscadores: seguiría disparando peticiones intermedias mientras el usuario aún escribe a mitad de palabra.'
    ],
    keyTakeaway: 'Debounce ejecuta tras el cese de eventos (inputs); Throttle limita la ejecución a intervalos fijos (scroll/resize).',
    componentKey: 'DebounceThrottleDemo',
    tags: ['debounce', 'throttle', 'control-de-eventos', 'clearTimeout', 'custom-hooks']
  },
  {
    id: '5.8',
    level: 5,
    levelTitle: 'Rendimiento',
    title: '5.8 Web Workers en React',
    summary: 'Mover cómputos pesados a un hilo secundario sin congelar la interfaz gráfica ni perder fotogramas a 60 FPS.',
    whatIsIt: `JavaScript en el navegador es monohilo (**Single-threaded**). Si ejecutas un algoritmo computacionalmente costoso (parsear un CSV de 50MB, aplicar filtros a imágenes, calcular algoritmos criptográficos o grafos), **el hilo principal se bloquea por completo**:
- La interfaz no responde a clics ni tecleo.
- Las animaciones CSS y spinners se congelan.
- El navegador puede mostrar el temido cartel "La página no responde".

**Web Workers**:
Permiten ejecutar código JavaScript en un **hilo en segundo plano** totalmente independiente del hilo principal.
- Se comunican mediante paso de mensajes (\`postMessage\` y evento \`onmessage\`).
- No tienen acceso directo al DOM ni a las variables de React.
- Dejan el hilo principal 100% libre para responder a interacciones a 60 FPS.`,
    codeSnippet: `// Uso de un Web Worker en React:
function CalculoPesadoWorkerDemo() {
  const [resultado, setResultado] = useState<number | null>(null);
  const [calculando, setCalculando] = useState(false);

  const ejecutarWorker = () => {
    setCalculando(true);
    // Creamos el worker con soporte para módulos ES:
    const worker = new Worker(new URL('./primos.worker.ts', import.meta.url));

    worker.postMessage({ limite: 10_000_000 });

    worker.onmessage = (e) => {
      setResultado(e.data);
      setCalculando(false);
      worker.terminate(); // Liberamos memoria al terminar
    };
  };

  return (
    <div>
      <button onClick={ejecutarWorker} disabled={calculando}>
        {calculando ? 'Calculando en segundo plano...' : 'Calcular Primos Pesados'}
      </button>
      {resultado && <p>Primos encontrados: {resultado}</p>}
    </div>
  );
}`,
    interviewTips: [
      'Explica la serialización de datos: los mensajes enviados a través de `postMessage` se clonan mediante el algoritmo de Clonación Estructurada (Structured Clone). Para transferir grandes buffers de memoria sin costo de copia, menciona los `Transferable Objects` (como `ArrayBuffer`).',
      'Menciona librerías que facilitan la interacción con Web Workers en TypeScript, como Comlink de Google Chrome Labs.'
    ],
    commonTraps: [
      'Intentar acceder al objeto `window`, `document` o elementos DOM dentro del Web Worker (los workers operan en el contexto `DedicatedWorkerGlobalScope`, sin acceso al DOM).',
      'No terminar los workers creados (`worker.terminate()`), acumulando procesos huérfanos en memoria.'
    ],
    keyTakeaway: 'Web Workers mueven algoritmos pesados fuera del hilo principal, garantizando una UI fluida sin bloqueos.',
    componentKey: 'WebWorkerDemo',
    tags: ['web-workers', 'multi-hilo', 'rendimiento', 'postMessage', 'sin-bloqueo']
  },
  {
    id: '5.9',
    level: 5,
    levelTitle: 'Rendimiento',
    title: '5.9 Estructura del estado para minimizar re-renders',
    summary: 'Principios de normalización de estado, estados derivados durante el render y eliminación de estado redundante.',
    whatIsIt: `La arquitectura y forma en que modelas tu estado tiene más impacto en el rendimiento que cualquier optimización con \`useMemo\`:

Principios fundamentales de estructuración:
1. **No guardes estado duplicado**:
Si un valor puede calcularse a partir de las props o del estado existente (ej: total de un carrito, cantidad de elementos completados, nombre completo), **calcúlalo al vuelo durante el render**. Guardarlo en un estado adicional exige sincronizarlo con \`useEffect\`, duplicando renders y arriesgando desincronización.
2. **Normalización de entidades (Por IDs)**:
En lugar de arrays de objetos anidados profundamente (\`grupos[0].usuarios[2].comentarios[5]\`), modela las entidades normalizadas: \`byId: { [id]: Entidad }\` y \`allIds: [id1, id2]\`. Facilita actualizaciones \`O(1)\` y evita clonar árboles enteros para cambiar una sola propiedad.
3. **Agrupa estados que cambian juntos**:
Si dos variables de estado siempre se actualizan al mismo tiempo (ej: coordenadas \`x\` e \`y\`), combínalas en un solo objeto de estado.`,
    codeSnippet: `// ❌ MAL: Estado redundante y desincronizado
function CarritoMalo({ items }: { items: { id: string; precio: number }[] }) {
  const [total, setTotal] = useState(0);
  useEffect(() => {
    // Re-render adicional e innecesario tras montar y cada vez que cambien items:
    setTotal(items.reduce((acc, i) => acc + i.precio, 0));
  }, [items]);
  return <p>Total: {total}</p>;
}

// ✅ BIEN: Estado derivado puro (Cero re-renders adicionales)
function CarritoOptimo({ items }: { items: { id: string; precio: number }[] }) {
  // Se calcula limpiamente durante el render. Si es pesado, se envuelve en useMemo:
  const total = items.reduce((acc, i) => acc + i.precio, 0);
  return <p>Total: {total}</p>;
}`,
    interviewTips: [
      'Regla de oro: "Pregúntate: ¿Puede calcularse esto durante el render a partir de lo que ya tengo? Si la respuesta es sí, no debe ser un estado".',
      'Explica cómo normalizar estado beneficia a los selectores: si un usuario cambia su avatar, solo el componente suscrito a ese ID específico se re-renderiza, en vez de invalidar la lista entera de 500 usuarios.'
    ],
    commonTraps: [
      'Llenar componentes de pares `[items, setItems]` y `[filteredItems, setFilteredItems]`, sincronizados con un `useEffect` que provoca parpadeos y bugs.',
      'Tener arrays con objetos anidados a 5 niveles de profundidad, haciendo las actualizaciones inmutables extremadamente propensas a errores de copia.'
    ],
    keyTakeaway: 'Deriva valores durante el render y normaliza estructuras complejas por ID para evitar re-renders y bugs de sincronización.',
    componentKey: 'StateStructureDemo',
    tags: ['estructura-estado', 'estado-derivado', 'normalizacion', 'buenas-practicas']
  }
];
