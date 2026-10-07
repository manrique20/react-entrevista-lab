import { Topic } from '@/types';

export const LEVEL_6_TOPICS: Topic[] = [
  {
    id: '6.1',
    level: 6,
    levelTitle: 'React Moderno (18 y 19)',
    title: '6.1 Concurrent Rendering (Renderizado Concurrente)',
    summary: 'React puede pausar, interrumpir y descartar renders en curso para priorizar interacciones urgentes del usuario.',
    whatIsIt: `Antes de React 18, el renderizado era una operación monolítica, síncrona y bloqueante: una vez que React comenzaba a renderizar un árbol de componentes, nada podía detenerlo hasta terminar. Si el árbol tardaba 200ms, la pantalla se congelaba por 200ms.

**El modelo Concurrente (habilitado con \`createRoot\`)**:
Permite a React trabajar en múltiples versiones de la UI al mismo tiempo entre bastidores.
- **Interrumpibilidad**: Si el usuario escribe una tecla en un input mientras React está ocupado renderizando una lista de 5,000 elementos, React **pausa el renderizado de la lista**, procesa inmediatamente el evento de la tecla para pintar el carácter en la pantalla, y luego reanuda o recalcula la lista.
- **Descarte de trabajo obsoleto**: Si la entrada del usuario invalida la búsqueda que se estaba calculando, React descarta el render en progreso sin llegar a tocar el DOM.`,
    codeSnippet: `// Activación del modo concurrente (estándar desde React 18):
import { createRoot } from 'react-dom/client';

const container = document.getElementById('root');
const root = createRoot(container!); // Habilita Concurrent Features
root.render(<App />);

// En Next.js App Router, el modo concurrente y Server Components están activos de forma nativa.`,
    interviewTips: [
      'Distingue entre Concurrencia y Multi-threading: React sigue corriendo en el único hilo de JavaScript del navegador. La concurrencia se logra dividiendo el trabajo en fragmentos de tiempo (Time-Slicing) coordinados por el Scheduler de React.',
      'Explica la analogía de la llamada telefónica: "Concurrencia es como poner una llamada en espera para atender un asunto urgente y luego retomar la conversación, en vez de obligar a la otra persona a esperar 10 minutos".'
    ],
    commonTraps: [
      'Pensar que `createRoot` hace que todo el código sea automáticamente más rápido: no acelera la CPU bruta, sino que reorganiza las prioridades para que la UI se sienta instantánea al usuario.',
      'Tener funciones de render con efectos secundarios impuros (mutaciones globales): en modo concurrente, React puede ejecutar un render varias veces antes de hacer commit, por lo que las funciones impuras causarán inconsistencias.'
    ],
    keyTakeaway: 'Concurrent React prioriza eventos urgentes (tecleo, clics) sobre tareas secundarias pausando renders en curso.',
    componentKey: 'ConcurrentRenderingDemo',
    tags: ['concurrencia', 'createRoot', 'time-slicing', 'scheduler', 'react-18']
  },
  {
    id: '6.2',
    level: 6,
    levelTitle: 'React Moderno (18 y 19)',
    title: '6.2 Automatic Batching (Agrupamiento automático)',
    summary: 'React 18/19 agrupa todas las llamadas a setState en un único re-render, incluso dentro de promesas, timeouts y eventos nativos.',
    whatIsIt: `**Batching** es la estrategia mediante la cual React combina múltiples actualizaciones de estado en una sola pasada de renderizado para evitar repintados innecesarios.

- **React 17 y anteriores**: El batching solo funcionaba dentro de los controladores de eventos sintéticos de React (\`onClick\`, \`onChange\`). Si actualizabas dos estados dentro de un \`fetch().then()\`, un \`setTimeout\` o un event listener nativo, React disparaba **dos re-renders independientes**.
- **React 18 y 19 (Automatic Batching)**: **TODAS las actualizaciones se agrupan automáticamente**, sin importar dónde ocurran (promesas, temporizadores, callbacks nativos).

¿Qué pasa si necesitas forzar un render síncrono inmediato?
Existe la función de escape **\`flushSync(() => { ... })\`**, aunque debe usarse con extrema reserva.`,
    codeSnippet: `function BatchingDemo() {
  const [contador, setContador] = useState(0);
  const [activo, setActivo] = useState(false);
  const [renders, setRenders] = useState(0);

  // Cada render incrementa la métrica
  console.log('[Render] Componente evaluado');

  const handleClickAsincrono = () => {
    setTimeout(() => {
      // En React 17: disparaba 2 re-renders independientes
      // En React 18/19: ¡dispara EXACTAMENTE 1 solo re-render agrupado!
      setContador(c => c + 1);
      setActivo(a => !a);
    }, 100);
  };

  return <button onClick={handleClickAsincrono}>Ejecutar con Batching</button>;
}`,
    interviewTips: [
      'Pregunta de entrevista técnica: "¿Qué hace flushSync?". Respuesta: Es una API de React DOM que obliga a React a vaciar la cola de actualizaciones pendientes y aplicar los cambios al DOM de forma síncrona en ese instante exacto. Se usa raramente, por ejemplo, para enfocar un input o medir un elemento inmediatamente después de forzar su inserción.',
      'Explica el impacto en rendimiento: Automatic Batching mejoró el rendimiento de aplicaciones grandes de forma gratuita sin necesidad de cambiar una sola línea de código al migrar a React 18.'
    ],
    commonTraps: [
      'Abusar de `flushSync`: degrada severamente el rendimiento y desactiva las ventajas del rendering concurrente.',
      'Asumir que las variables locales cambian síncronamente tras llamar al setter.'
    ],
    keyTakeaway: 'React 18 agrupa todas las actualizaciones de estado en un solo re-render, sin importar si ocurren en promesas o timeouts.',
    componentKey: 'AutomaticBatchingDemo',
    tags: ['automatic-batching', 'flushSync', 'promesas', 'react-18', 'agrupamiento']
  },
  {
    id: '6.3',
    level: 6,
    levelTitle: 'React Moderno (18 y 19)',
    title: '6.3 `useTransition` y `useDeferredValue`',
    summary: 'Marca actualizaciones no urgentes como transiciones interrumpibles. El usuario teclea a 60 FPS mientras la lista pesada se calcula.',
    whatIsIt: `Dos hooks fundamentales para mantener la interfaz receptiva durante cálculos exigentes:

1. **\`useTransition()\`**:
- Retorna \`[isPending, startTransition]\`.
- Permite envolver una llamada a \`setState\` para marcarla como **transición de baja prioridad (no urgente)**.
- El estado urgente (ej: lo que el usuario escribe en un input) se actualiza de inmediato; el estado pesado (ej: filtrar 20,000 registros) se procesa concurrentemente y puede ser interrumpido si el usuario pulsa otra tecla.
- \`isPending\` es un booleano reactivo que permite mostrar un spinner o bajar la opacidad mientras la transición se completa.

2. **\`useDeferredValue(valor)\`**:
- Difiere la actualización de un **valor** que recibes (por ejemplo, proveniente de una prop).
- React intentará renderizar primero con el valor viejo y actualizará al nuevo valor en segundo plano tan pronto el hilo esté libre.`,
    codeSnippet: `function BuscadorConTransition({ datos }: { datos: string[] }) {
  const [busqueda, setBusqueda] = useState('');
  const [listaFiltrada, setListaFiltrada] = useState(datos);
  const [isPending, startTransition] = useTransition();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const texto = e.target.value;
    // 1. Urgente: El input se actualiza instantáneamente en pantalla
    setBusqueda(texto);

    // 2. No urgente: El filtrado pesado puede tardar sin congelar el teclado
    startTransition(() => {
      const filtrados = datos.filter(d => d.toLowerCase().includes(texto.toLowerCase()));
      setListaFiltrada(filtrados);
    });
  };

  return (
    <div>
      <input value={busqueda} onChange={handleChange} placeholder="Buscar..." />
      {isPending && <span className="text-blue-500">Filtrando concurrentemente...</span>}
      <div className={isPending ? 'opacity-50 transition-opacity' : ''}>
        <Lista elementos={listaFiltrada} />
      </div>
    </div>
  );
}`,
    interviewTips: [
      'Diferencia clave entre useTransition y useDeferredValue: usa `useTransition` cuando tienes acceso directo a la función modificadora de estado (`setEstado`). Usa `useDeferredValue` cuando solo recibes el valor procesado como prop o cuando el estado proviene de un componente padre o librería.',
      'Compara useTransition con Debounce: Debounce retrasa la ejecución arbitrariamente con un temporizador (ej: 300ms). useTransition comienza de inmediato con baja prioridad y solo cede el control si ocurre un evento de mayor prioridad, entregando la UI tan pronto sea posible.'
    ],
    commonTraps: [
      'Envolver la actualización del propio input de texto dentro de `startTransition`. Si haces eso, el texto en el input parecerá tener lag al escribir.',
      'Intentar pasar funciones asíncronas no soportadas dentro de startTransition en React 18 (React 19 ahora soporta oficialmente funciones asíncronas dentro de startTransition).'
    ],
    keyTakeaway: 'useTransition mantiene el teclado fluido al relegar filtros y cómputos pesados a transiciones de baja prioridad.',
    componentKey: 'UseTransitionDemo',
    tags: ['useTransition', 'useDeferredValue', 'isPending', 'INP', 'concurrencia']
  },
  {
    id: '6.4',
    level: 6,
    levelTitle: 'React Moderno (18 y 19)',
    title: '6.4 `useId`, `useSyncExternalStore` y `useInsertionEffect`',
    summary: 'Hooks especializados: IDs únicos consistentes en SSR, suscripción segura a stores externos sin tearing, e inyección CSS.',
    whatIsIt: `Hooks avanzados introducidos en React 18 para resolver problemas específicos de arquitectura:

1. **\`useId()\`**:
Genera IDs únicos y deterministas que coinciden **exactamente en el servidor y en el cliente**, eliminando los errores de discrepancia de hidratación (**Hydration Mismatch**) al enlazar elementos accesibles (\`<label htmlFor={id}>\` con \`<input id={id}>\`).

2. **\`useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)\`**:
El hook definitivo para suscribirse a almacenes de datos externos a React (Redux, Zustand, APIs del navegador como \`navigator.onLine\`, \`window.innerWidth\`).
Garantiza lecturas síncronas que evitan el fenómeno de **Visual Tearing** (cuando un render concurrente lee datos inconsistentes en diferentes partes de la pantalla).

3. **\`useInsertionEffect()\`**:
Diseñado exclusivamente para autores de librerías CSS-in-JS (como styled-components). Se ejecuta antes de que se lean las medidas del DOM, inyectando etiquetas \`<style>\` a tiempo.`,
    codeSnippet: `// 1. useId para accesibilidad garantizada en SSR:
function CampoFormulario({ label }: { label: string }) {
  const id = useId();
  return (
    <div>
      <label htmlFor={id}>{label}</label>
      <input id={id} />
    </div>
  );
}

// 2. useSyncExternalStore para leer el estado de conexión de red del navegador:
function useOnlineStatus() {
  return useSyncExternalStore(
    (callback) => {
      window.addEventListener('online', callback);
      window.addEventListener('offline', callback);
      return () => {
        window.removeEventListener('online', callback);
        window.removeEventListener('offline', callback);
      };
    },
    () => navigator.onLine, // Snapshot en cliente
    () => true              // Snapshot en servidor (SSR)
  );
}`,
    interviewTips: [
      '¿Qué es "Tearing" y por qué se creó useSyncExternalStore?: En renderizado concurrente, React puede pausar el render. Si un store externo mutable cambia mientras React está en pausa, la mitad superior de la UI podría renderizar el valor nuevo y la inferior el valor viejo. useSyncExternalStore evita esto forzando una sincronización atómica.',
      'Nunca uses `useId` para generar keys en listas mapeadas (`items.map((i) => <li key={useId()} />)`); las keys deben derivarse de los datos de la lista.'
    ],
    commonTraps: [
      'Generar IDs con `Math.random()` en el render: generará un string distinto en el servidor que en el cliente, causando una falla de hidratación inmediata.',
      'Retornar una nueva referencia de objeto o array en `getSnapshot()` en cada llamada: provocará un bucle infinito de re-renders.'
    ],
    keyTakeaway: 'useId resuelve IDs accesibles idénticos en SSR y cliente; useSyncExternalStore conecta stores externos sin tearing.',
    componentKey: 'UseIdAndExternalStoreDemo',
    tags: ['useId', 'useSyncExternalStore', 'tearing', 'hidratacion', 'react-18']
  },
  {
    id: '6.5',
    level: 6,
    levelTitle: 'React Moderno (18 y 19)',
    title: '6.5 Suspense para datos (Data Fetching Suspense)',
    summary: 'Muestra estados de carga declarativos por zonas mientras los componentes asíncronos esperan promesas o recursos.',
    whatIsIt: `Tradicionalmente, cada componente manejaba sus propios estados \`if (loading) return <Spinner />\`. Esto provocaba jerarquías repletas de "spinners anidados" y cascadas de carga descoordinadas.

**Suspense para Datos**:
Permite a un componente hijo "suspenderse" (lanzar una promesa que React atrapa) mientras espera datos.
- \`<Suspense fallback={<Esqueleto />}>\` envuelve la zona de la pantalla.
- Mientras cualquier hijo dentro del límite esté esperando datos o promesas, se renderiza la UI de \`fallback\`.
- En React 19 y Next.js App Router, se combina de forma nativa con el nuevo hook **\`use(promise)\`** y con React Server Components (RSC).`,
    codeSnippet: `// En React 19 con el hook 'use':
import { Suspense, use } from 'react';

function PerfilUsuario({ promesaUsuario }: { promesaUsuario: Promise<{ nombre: string }> }) {
  // El hook 'use' suspende el componente hasta que la promesa se resuelva:
  const usuario = use(promesaUsuario);
  return <h2>Bienvenido, {usuario.nombre}</h2>;
}

function PaginaPrincipal() {
  const promesa = fetch('/api/usuario').then(r => r.json());

  return (
    <Suspense fallback={<div className="h-12 w-48 bg-muted animate-pulse rounded" />}>
      <PerfilUsuario promesaUsuario={promesa} />
    </Suspense>
  );
}`,
    interviewTips: [
      'Explica cómo Suspense desacopla la UI de carga de la lógica de negocio: el componente hijo solo se preocupa por renderizar los datos asumiendo que ya existen. El componente padre decide declarativamente cómo y dónde se agrupa la UI de carga.',
      'Contrasta "Fetch-on-render" (cascada con useEffect) con "Render-as-you-fetch" (Suspense): con Suspense, inicias la obtención de datos antes o en paralelo con el renderizado, eliminando waterfalls de red.'
    ],
    commonTraps: [
      'Crear la promesa dentro del cuerpo de la función del componente en cada render sin memoizarla, lo que causaría suspenderse en bucle infinito.',
      'No proveer límites de Suspense granulares, haciendo que un detalle menor bloquee toda la pantalla.'
    ],
    keyTakeaway: 'Suspense coordina de forma declarativa los estados de carga asíncronos por áreas visuales completas.',
    componentKey: 'SuspenseDataDemo',
    tags: ['suspense', 'data-fetching', 'use-hook', 'skeletons', 'fallbacks']
  },
  {
    id: '6.6',
    level: 6,
    levelTitle: 'React Moderno (18 y 19)',
    title: '6.6 Streaming SSR (Renderizado por partes en el servidor)',
    summary: 'El servidor envía el HTML en chunks progresivos mediante HTTP Streams, mejorando radicalmente el TTFB y el First Contentful Paint.',
    whatIsIt: `En el Server-Side Rendering tradicional, el servidor debía esperar a que **absolutamente todos los datos de la página estuvieran listos** en la base de datos antes de poder enviar un solo byte de HTML al navegador. Si una sección secundaria tardaba 3 segundos, toda la página tardaba 3 segundos en responder (**TTFB elevado**).

**Streaming SSR (Server-Side Rendering con Transmisión)**:
React divide el HTML de la página en trozos y los transmite al navegador conforme van estando listos:
1. El servidor envía inmediatamente el armazón HTML básico (Navbar, Layout, fallbacks de Suspense).
2. El usuario ve la página casi al instante (**TTFB y FCP mínimos**).
3. Cuando las consultas lentas a la base de datos terminan en el servidor, React transmite trozos de HTML adicionales con scripts que reemplazan los esqueletos por el contenido real en el navegador.
4. **Hidratación Selectiva**: React hidrata interactivamente primero las partes con las que el usuario intenta interactuar.`,
    codeSnippet: `// Demostración conceptual del flujo de Streaming en Next.js App Router:
// app/dashboard/page.tsx
import { Suspense } from 'react';

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* 1. Este encabezado se envía al instante en el primer chunk HTML */}
      <h1>Panel de Métricas</h1>

      {/* 2. El esqueleto se muestra al instante mientras la consulta corre en el servidor */}
      <Suspense fallback={<p className="animate-pulse">Consultando base de datos...</p>}>
        <MetricasServidorLentas />
      </Suspense>
    </div>
  );
}

// async Server Component que tarda 2 segundos:
async function MetricasServidorLentas() {
  await new Promise(r => setTimeout(r, 2000)); // Simulación de DB lenta
  return <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">Datos del servidor cargados</div>;
}`,
    interviewTips: [
      'Explica la Hidratación Selectiva (Selective Hydration): si una página tiene varios bloques de Suspense transmitiéndose, React no espera a que todo el HTML llegue para empezar a hidratar. Si el usuario hace clic en el bloque B antes de que el bloque A termine de hidratarse, React reprioriza e hidrata B de inmediato para responder al clic.',
      'Menciona el protocolo subyacente: Streaming SSR aprovecha la transferencia en trozos `Transfer-Encoding: chunked` estándar de HTTP/1.1 y los flujos continuos de HTTP/2.'
    ],
    commonTraps: [
      'Confundir Streaming SSR con WebSockets o Server-Sent Events (SSE): Streaming SSR es una respuesta HTTP estándar única que no cierra la conexión hasta enviar todos los trozos.',
      'Intentar usar APIs que dependen del DOM del cliente dentro de componentes de servidor.'
    ],
    keyTakeaway: 'Streaming SSR envía HTML progresivamente, permitiendo ver el cascarón de inmediato mientras las áreas lentas se completan.',
    componentKey: 'StreamingSsrDemo',
    tags: ['streaming-ssr', 'ttfb', 'selective-hydration', 'nextjs', 'rsc']
  },
  {
    id: '6.7',
    level: 6,
    levelTitle: 'React Moderno (18 y 19)',
    title: '6.7 React Server Components (RSC) y `"use client"`',
    summary: 'La revolución arquitectónica de React: componentes que corren exclusivamente en el servidor y envían CERO kilobytes de JS al cliente.',
    whatIsIt: `React Server Components (RSC) representa el mayor cambio de paradigma desde la llegada de los hooks:

1. **Server Components (Por defecto en Next.js App Router)**:
- Se ejecutan **exclusivamente en el servidor** (o en build time).
- Pueden ser funciones asíncronas (\`async / await\`).
- Tienen acceso directo a bases de datos, sistemas de archivos y variables de entorno secretas sin necesidad de crear endpoints de API intermedios.
- **Su código JavaScript jamás se envía al navegador del usuario**, reduciendo drásticamente el tamaño del bundle.
- Restricción: No pueden usar estado (\`useState\`), efectos (\`useEffect\`), listeners de eventos (\`onClick\`) ni APIs del navegador.

2. **Client Components (\`"use client"\`)**:
- Se ejecutan en el servidor para generar el HTML inicial y luego se **hidratan interactivamente en el navegador**.
- Llevan la directiva \`"use client"\` al inicio del archivo.
- Pueden usar estado, efectos, eventos e interactividad del navegador.`,
    codeSnippet: `// app/productos/page.tsx (Server Component por defecto - CERO JS en el cliente)
import { BotonFavorito } from './BotonFavorito'; // Client Component importado

export default async function PaginaProductos() {
  // Consulta directa a la base de datos sin API REST intermedia:
  const productos = [
    { id: '1', nombre: 'Laptop Pro', precio: 1200 },
    { id: '2', nombre: 'Teclado Mecánico', precio: 150 }
  ];

  return (
    <div className="space-y-4">
      <h2>Productos</h2>
      {productos.map(p => (
        <div key={p.id} className="p-4 border rounded flex justify-between">
          <span>{p.nombre} - \${p.precio}</span>
          {/* Frontera de cliente: solo este botón envía JS al navegador */}
          <BotonFavorito id={p.id} />
        </div>
      ))}
    </div>
  );
}

// BotonFavorito.tsx (Client Component)
// 'use client';
// export function BotonFavorito({ id }: { id: string }) { ... }`,
    interviewTips: [
      'Aclara el malentendido común sobre `"use client"`: `"use client"` NO significa "este componente solo corre en el navegador". Los Client Components TAMBIÉN se pre-renderizan en el servidor para generar HTML inicial; la directiva simplemente marca la frontera a partir de la cual el código debe empaquetarse e hidratarse en el cliente.',
      'Explica el patrón de composición: Un Server Component puede pasar otro Server Component como `children` a un Client Component, permitiendo que el contenido del servidor siga teniendo cero JS en el cliente.'
    ],
    commonTraps: [
      'Poner `"use client"` en la raíz de toda la aplicación, anulando todos los beneficios de rendimiento y ahorro de bundle de RSC.',
      'Intentar pasar funciones o clases no serializables como props a través de la frontera de Server a Client Component.'
    ],
    keyTakeaway: 'Server Components corren en el servidor y reducen el bundle a cero; Client Components manejan la interactividad del navegador.',
    componentKey: 'RscBoundariesDemo',
    tags: ['rsc', 'react-server-components', 'use-client', 'nextjs-app-router', 'zero-bundle']
  },
  {
    id: '6.8',
    level: 6,
    levelTitle: 'React Moderno (18 y 19)',
    title: '6.8 Server Actions y Mutaciones Seguras',
    summary: 'Funciones asíncronas del servidor invocables directamente desde componentes de cliente sin crear endpoints de API manuales.',
    whatIsIt: `Las **Server Actions** son funciones marcadas con la directiva **\`'use server'\`** que se ejecutan exclusivamente en el servidor pero pueden ser invocadas directamente desde componentes de cliente o formularios:

Características destacadas:
- Eliminan la necesidad de escribir manualmente controladores de rutas API (\`/api/crear-tarea\`), llamadas a \`fetch()\` y serialización de JSON.
- **Mejora Progresiva (Progressive Enhancement)**: Cuando se usan en etiquetas \`<form action={miAction}>\`, el formulario puede funcionar incluso antes de que el JavaScript del cliente haya terminado de cargar.
- **Revalidación instantánea**: Pueden invocar funciones del servidor como \`revalidatePath()\` o \`revalidateTag()\` para purgar cachés y actualizar la vista del cliente automáticamente en una sola ida y vuelta al servidor.
- **Seguridad**: Detrás de escena, React genera un endpoint POST público; **siempre debes autenticar y autorizar la acción dentro de la función**.`,
    codeSnippet: `// app/actions.ts
'use server';

import { revalidatePath } from 'next/cache';

export async function registrarUsuario(formData: FormData) {
  const email = formData.get('email') as string;

  // 1. Validación y seguridad en servidor
  if (!email || !email.includes('@')) {
    return { ok: false, error: 'Email inválido' };
  }

  // 2. Operación de base de datos directa
  console.log('Guardando en base de datos:', email);

  // 3. Revalidación de caché en servidor
  // revalidatePath('/usuarios');
  return { ok: true, mensaje: 'Usuario registrado con éxito' };
}

// Consumo en componente de formulario:
// <form action={registrarUsuario}>
//   <input name="email" type="email" required />
//   <button type="submit">Registrar</button>
// </form>`,
    interviewTips: [
      'Pregunta de seguridad crítica: "¿Son las Server Actions privadas o públicas?". Respuesta contundente: Son endpoints públicos HTTP POST expuestos al mundo. Nunca asumas que solo tu UI puede invocarlas; siempre debes validar la sesión del usuario, verificar permisos y sanitizar los inputs dentro de la action.',
      'Explica cómo se complementan con los nuevos hooks de React 19: `useActionState`, `useFormStatus` y `useOptimistic` fueron diseñados específicamente para integrarse a la perfección con Server Actions.'
    ],
    commonTraps: [
      "Confundir la directiva 'use server' a nivel de archivo con un Server Component: 'use server' define funciones exportadas como Server Actions; los Server Components NO llevan directiva (son el estándar por defecto).",
      'Confiar ciegamente en datos provenientes del cliente sin validarlos con librerías como Zod en el servidor.'
    ],
    keyTakeaway: 'Server Actions permiten mutar datos en el servidor de forma nativa desde formularios, requiriendo siempre validación de seguridad.',
    componentKey: 'ServerActionsDemo',
    tags: ['server-actions', 'use-server', 'mutaciones', 'revalidatePath', 'seguridad']
  },
  {
    id: '6.9',
    level: 6,
    levelTitle: 'React Moderno (18 y 19)',
    title: '6.9 Hooks de React 19 (`use`, `useActionState`, `useFormStatus`, `useOptimistic`)',
    summary: 'La nueva generación de hooks para formularios interactivos, consumo condicional de promesas y actualizaciones optimistas.',
    whatIsIt: `React 19 introduce 4 hooks oficiales de última generación para transformar el desarrollo frontend:

1. **\`use(Promise | Context)\`**:
A diferencia de los demás hooks de React, \`use\` **puede ser llamado dentro de condicionales (\`if\`) y bucles**. Permite suspender la UI leyendo promesas o leer contextos de forma dinámica.
2. **\`useActionState(action, initialState)\`**:
Maneja el estado devuelto por una acción asíncrona de formulario, proveyendo \`[state, formAction, isPending]\`. Reemplaza y estandariza patrones manuales con \`useState\`.
3. **\`useFormStatus()\`**:
Lee el estado del formulario padre más cercano (\`{ pending, data, method }\`) desde un componente hijo, ideal para botones con spinner automático sin pasar props.
4. **\`useOptimistic(state, updateFn)\`**:
Permite aplicar cambios instantáneos a la interfaz mientras la petición asíncrona se resuelve en el servidor, revirtiendo el estado automáticamente si la mutación falla.`,
    codeSnippet: `import { useActionState, useOptimistic } from 'react';

// Acción asíncrona simulada:
async function agregarComentarioAction(prev: string[], formData: FormData) {
  const texto = formData.get('comentario') as string;
  await new Promise(r => setTimeout(r, 1000)); // Simula servidor
  return [...prev, texto];
}

function SeccionComentarios() {
  const [comentarios, formAction, isPending] = useActionState(agregarComentarioAction, ['Comentario inicial']);

  // Actualización optimista instantánea:
  const [optimisticComentarios, setOptimistic] = useOptimistic(
    comentarios,
    (actuales, nuevo: string) => [...actuales, \`\${nuevo} (enviando...)\`]
  );

  const handleSubmit = async (formData: FormData) => {
    const texto = formData.get('comentario') as string;
    setOptimistic(texto); // Se muestra inmediatamente al hacer submit
    await formAction(formData);
  };

  return (
    <div>
      <ul>
        {optimisticComentarios.map((c, i) => <li key={i}>{c}</li>)}
      </ul>
      <form action={handleSubmit}>
        <input name="comentario" required />
        <button type="submit" disabled={isPending}>{isPending ? 'Guardando...' : 'Comentar'}</button>
      </form>
    </div>
  );
}`,
    interviewTips: [
      'Destaca la evolución histórica: `useActionState` se llamaba temporalmente `useFormState` en las versiones experimentales de Next.js antes de ser renombrado y estandarizado oficialmente en la versión final de React 19.',
      'Explica `useFormStatus`: debe usarse en un componente HIJO dentro de las etiquetas `<form>`, no en el mismo componente que declara el `<form>`. Este detalle es una pregunta técnica recurrente.'
    ],
    commonTraps: [
      'Llamar `useFormStatus` en el mismo nivel donde se declara la etiqueta `<form>`: devolverá `pending: false` porque busca el contexto del form hacia arriba en el árbol.',
      'Intentar usar `use()` con promesas recreadas en cada render sin que provengan de una referencia estable o memoizada.'
    ],
    keyTakeaway: 'React 19 formaliza el manejo de formularios y transiciones con hooks nativos para estados, progreso y optimismo.',
    componentKey: 'React19HooksDemo',
    tags: ['react-19', 'use-hook', 'useActionState', 'useFormStatus', 'useOptimistic']
  },
  {
    id: '6.10',
    level: 6,
    levelTitle: 'React Moderno (18 y 19)',
    title: '6.10 `ref` como Prop directa en React 19',
    summary: 'Eliminación oficial de forwardRef: ahora puedes recibir ref como una prop ordinaria en cualquier componente funcional.',
    whatIsIt: `Durante años, una de las mayores fuentes de fricción en React fue la imposibilidad de pasar una prop llamada \`ref\` directamente a un componente funcional sin envolverlo en la función \`forwardRef((props, ref) => ...)\`. Esto generaba firmas complejas y confusión al tipar con TypeScript.

**En React 19**:
- **\`ref\` es ahora una prop ordinaria de primer nivel**, tratada de la misma manera que \`className\` o \`onClick\`.
- \`forwardRef\` queda oficialmente obsoleto (deprecated) y será eliminado en versiones futuras.
- La firma de los componentes funcionales se simplifica enormemente, tanto en JavaScript como en TypeScript.`,
    codeSnippet: `// ❌ Antes en React 18 (Requiere forwardRef):
// const MiInput = forwardRef<HTMLInputElement, { label: string }>((props, ref) => (
//   <input ref={ref} {...props} />
// ));

// ✅ Ahora en React 19: ref es una prop normal y corriente
interface MiInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  ref?: React.Ref<HTMLInputElement>;
}

function MiInput({ label, ref, ...props }: MiInputProps) {
  return (
    <div className="flex flex-col gap-1">
      <label>{label}</label>
      <input ref={ref} className="border p-2 rounded" {...props} />
    </div>
  );
}

// El componente padre lo consume de forma limpia y directa:
function Formulario() {
  const inputRef = useRef<HTMLInputElement>(null);
  return <MiInput ref={inputRef} label="Nombre de usuario" />;
}`,
    interviewTips: [
      'Menciona el beneficio para TypeScript: antes, `forwardRef` alteraba la visualización de los tipos en IntelliSense y rompía componentes genéricos (`<T>`). Con `ref` como prop normal, los componentes genéricos se escriben de manera totalmente natural.',
      'Explica la compatibilidad regresiva: el código legado con `forwardRef` sigue funcionando en React 19 para facilitar migraciones graduales, pero todo nuevo código debe escribirse con la prop directa.'
    ],
    commonTraps: [
      'Intentar desestructurar `ref` sin tiparlo adecuadamente en TypeScript con `React.Ref<T>`.',
      'Creer que el comportamiento de la referencia cambió: la referencia sigue apuntando al nodo DOM interno una vez montado.'
    ],
    keyTakeaway: 'React 19 elimina la necesidad de `forwardRef`, permitiendo recibir `ref` como una prop estándar.',
    componentKey: 'React19RefPropDemo',
    tags: ['react-19', 'ref-prop', 'forwardRef-deprecated', 'typescript', 'simplificacion']
  },
  {
    id: '6.11',
    level: 6,
    levelTitle: 'React Moderno (18 y 19)',
    title: '6.11 React Compiler (Auto-memoización)',
    summary: 'Compilador que analiza el código en build time y aplica memoización automática, eliminando la necesidad de useMemo y useCallback manuales.',
    whatIsIt: `El **React Compiler** (originalmente conocido en investigación como React Forget) es un compilador optimizador desarrollado por Meta que comprende la semántica y las reglas de JavaScript y de React.

¿Qué problema resuelve?:
Antes, los ingenieros de React pasaban horas escribiendo manualmente \`useMemo\`, \`useCallback\` y \`React.memo\` para estabilizar referencias y evitar re-renders. Era un proceso propenso a errores humanos (arrays de dependencias incompletos, sobre-optimización innecesaria).

**Cómo funciona**:
- Opera en **tiempo de compilación** (Babel / ESLint plugin).
- Analiza el flujo de control y las mutaciones dentro de los componentes.
- Inserta automáticamente estructuras de memoización en el código generado.
- **Requisito indispensable**: El código debe obedecer estrictamente las **Reglas de React** (renderizado puro, no mutar el estado ni variables externas durante el render).`,
    codeSnippet: `// Lo que escribes tú (Código natural sin memoización manual):
function PerfilAmigos({ amigos, filtro }: { amigos: any[]; filtro: string }) {
  // El React Compiler memoiza automáticamente este filtrado:
  const visibles = amigos.filter(a => a.nombre.includes(filtro));

  // El React Compiler memoiza automáticamente esta función callback:
  const handleClick = (id: string) => console.log('Seleccionado:', id);

  return <ListaAmigos items={visibles} onSelect={handleClick} />;
}

// A lo que compila internamente (React Compiler inserta cachés automáticas):
// const $ = _c(4); // Slots de caché automáticos administrados por el compilador`,
    interviewTips: [
      'Pregunta de entrevista futurista: "Con React Compiler, ¿desaparecen useMemo y useCallback?". Respuesta senior: Para la inmensa mayoría de componentes cotidianos, sí. Solo seguirán utilizándose de forma explícita en casos excepcionales donde el programador necesite garantizar una identidad referencial para dependencias externas muy específicas.',
      'Explica el rol del ESLint Plugin `eslint-plugin-react-compiler`: ayuda a auditar qué componentes de tu base de código son compatibles y cuáles violan la pureza de React antes de activar el compilador.'
    ],
    commonTraps: [
      'Pensar que el compilador te permitirá escribir código con mutaciones impuras: si el código rompe las reglas de React, el compilador simplemente desactivará la auto-memoización para ese componente.',
      'Creer que el compilador sustituye a una buena arquitectura de estado.'
    ],
    keyTakeaway: 'React Compiler analiza el código en compilación y automatiza useMemo/useCallback si el código respeta la pureza de React.',
    componentKey: 'ReactCompilerDemo',
    tags: ['react-compiler', 'react-forget', 'auto-memoizacion', 'build-time', 'pureza']
  },
  {
    id: '6.12',
    level: 6,
    levelTitle: 'React Moderno (18 y 19)',
    title: '6.12 Strict Mode y el "Doble Render" en desarrollo',
    summary: 'Por qué useEffect corre dos veces en desarrollo: el mecanismo para destapar impurezas y efectos sin función de cleanup.',
    whatIsIt: `\`<StrictMode>\` es una herramienta de desarrollo de React que no genera ningún elemento visual en el DOM pero activa comprobaciones y advertencias adicionales para detectar errores de arquitectura tempranamente.

**El misterio del "Doble Montaje"**:
En modo de desarrollo (\`process.env.NODE_ENV === 'development'\`), React intencionalmente:
1. Monta el componente.
2. Lo desmonta inmediatamente.
3. Lo vuelve a montar una segunda vez.
Por este motivo, **los \`useEffect\` con array vacío \`[]\` se ejecutan dos veces en desarrollo**.

**¿Por qué hace esto React?**:
Para simular cómo se comportará el componente en el futuro cuando se navegue hacia atrás y adelante con caché, y para **forzar al desarrollador a escribir funciones de limpieza (cleanup)** adecuadas. Si un efecto conecta un WebSocket o añade un listener sin limpiarlo, el doble montaje revelará de inmediato la fuga de memoria en la consola.`,
    codeSnippet: `// Demostración de Strict Mode y limpieza obligatoria:
function ConexionChat({ roomId }: { roomId: string }) {
  useEffect(() => {
    console.log('[Efecto] Conectando a sala:', roomId);
    const conexion = simularConexionWebSocket(roomId);

    // Si NO escribes este cleanup, en desarrollo verás 2 conexiones abiertas:
    return () => {
      console.log('[Cleanup] Desconectando de sala:', roomId);
      conexion.desconectar();
    };
  }, [roomId]);

  return <p>Conectado a la sala {roomId}</p>;
}

function simularConexionWebSocket(id: string) {
  return { desconectar: () => console.log('Socket cerrado con éxito') };
}`,
    interviewTips: [
      'La pregunta más repetida en foros y entrevistas: "Mi `useEffect` corre dos veces y hace dos llamadas a la API, ¿cómo lo desactivo?". La respuesta de un programador senior es: ¡NO lo desactives! La solución correcta es garantizar que tu efecto sea resiliente implementando el cleanup adecuado (usando AbortController para cancelar o limpiando suscripciones).',
      'Menciona que este doble render solo ocurre en desarrollo; en la compilación final de producción (`npm run build`), React solo monta el componente una sola vez.'
    ],
    commonTraps: [
      'Eliminar `<StrictMode>` de `layout.tsx` o `index.tsx` para ocultar el doble montaje en vez de arreglar el cleanup faltante en el hook.',
      'Usar un `useRef` con bandera booleana (`isMounted.current = true`) para evitar que el efecto corra dos veces, esquivando la protección que React diseñó deliberadamente.'
    ],
    keyTakeaway: 'StrictMode remonta efectos en desarrollo para garantizar que tengan cleanup adecuado y toleren navegación concurrente.',
    componentKey: 'StrictModeDemo',
    tags: ['strict-mode', 'doble-render', 'cleanup', 'desarrollo', 'resiliencia']
  }
];
