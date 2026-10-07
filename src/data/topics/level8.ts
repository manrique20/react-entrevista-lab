import { Topic } from '@/types';

export const LEVEL_8_TOPICS: Topic[] = [
  {
    id: '8.1',
    level: 8,
    levelTitle: 'Internos de React',
    title: '8.1 La Arquitectura Fiber (Bajo el capó de React)',
    summary: 'La estructura de datos interna que reemplazó la pila de llamadas síncrona, habilitando el rendering concurrente y pausado.',
    whatIsIt: `Antes de React 16, la reconciliación utilizaba el "Stack Reconciler": recorría el árbol de componentes mediante la pila de llamadas nativa de JavaScript recursivamente. Como la pila no puede pausarse sin bloquear el navegador, renders grandes congelaban la interfaz.

**¿Qué es un nodo Fiber?**:
En React 16+, cada elemento del árbol de componentes está representado por un objeto de JavaScript llamado **Fiber**.
Un Fiber es tanto una unidad de trabajo como una representación del árbol estructurada como una **lista doblemente enlazada**:
- \`child\`: Puntero al primer hijo directo.
- \`sibling\`: Puntero al siguiente hermano directo.
- \`return\`: Puntero al componente padre.
- \`stateNode\`: Referencia a la instancia de la clase o al nodo DOM real.
- \`memoizedState\`: Lista enlazada de hooks del componente.
- \`alternate\`: Puntero al fiber correspondiente en el otro árbol (técnica de **Double Buffering**).

Al sustituir la pila de llamadas nativa por esta estructura de punteros en memoria heap, React puede pausar la iteración en cualquier momento, guardar el puntero, atender un evento urgente del usuario y reanudar el trabajo donde lo dejó.`,
    codeSnippet: `// Representación simplificada de la estructura de un nodo Fiber:
interface FiberNode {
  tag: number;              // Tipo: FunctionComponent, ClassComponent, HostComponent (DOM), etc.
  key: null | string;
  elementType: any;         // La función del componente o tag ('div')
  type: any;
  stateNode: any;           // El elemento DOM nativo

  // Punteros de la lista enlazada del árbol:
  child: FiberNode | null;  // Primer hijo
  sibling: FiberNode | null;// Siguiente hermano
  return: FiberNode | null; // Padre

  // Estado y Hooks:
  memoizedState: any;       // Cabeza de la lista enlazada de hooks
  memoizedProps: any;
  pendingProps: any;

  // Double Buffering:
  alternate: FiberNode | null; // Apunta al árbol que se está mostrando actualmente en pantalla
  flags: number;            // Banderas de mutación (Placement, Update, Deletion)
}`,
    interviewTips: [
      'Explica la técnica de "Double Buffering" inspirada en motores de videojuegos: React mantiene dos árboles de Fiber en memoria: el árbol "Current" (lo que el usuario ve ahora en pantalla) y el árbol "WorkInProgress" (el que se está calculando en segundo plano). Cuando la fase de render termina con éxito, React simplemente intercambia el puntero raíz en una sola operación atómica en la fase de Commit.',
      'Explica por qué los nodos Fiber usan `child`, `sibling` y `return`: permite recorrer todo el árbol con un bucle `while` plano sin recursión profunda de funciones.'
    ],
    commonTraps: [
      'Confundir el Virtual DOM con Fiber: El Virtual DOM es el concepto de alto nivel de tener una representación en memoria de la UI; Fiber es la estructura de datos interna y el motor de planificación concreto que lo implementa desde React 16.',
      'Intentar manipular nodos Fiber directamente en código de aplicación: son privados e internos del núcleo de React.'
    ],
    keyTakeaway: 'Fiber convirtió el renderizado en una lista enlazada pausable con double buffering, haciendo posible la concurrencia.',
    componentKey: 'FiberTreeVisualizerDemo',
    tags: ['fiber', 'internals', 'double-buffering', 'linked-list', 'concurrencia', 'stack-reconciler']
  },
  {
    id: '8.2',
    level: 8,
    levelTitle: 'Internos de React',
    title: '8.2 Fases de Render y Commit en detalle',
    summary: 'La separación estricta: Render es asíncrono, interrumpible y puro; Commit es síncrono e ininterrumpible sobre el DOM real.',
    whatIsIt: `El pipeline de actualización de React está estrictamente dividido en dos fases con reglas completamente opuestas:

1. **Fase de Render (Reconciliación)**:
- React ejecuta los componentes funcionales, procesa las colas de hooks y calcula qué nodos han cambiado.
- **Es asíncrona e interrumpible**: El Scheduler de React puede fragmentarla en múltiples cuadros de tiempo o abortarla si surge un evento de mayor prioridad.
- **Debe ser 100% pura**: Cero efectos secundarios, cero llamadas a APIs, cero mutaciones de variables globales. React puede invocar una función de componente y descartar su resultado sin llegar a pintar nada.
- No se toca el DOM del navegador en esta fase.

2. **Fase de Commit**:
- React toma la lista de cambios calculada en la fase de render y aplica las mutaciones al DOM real (insertar, mover o eliminar nodos).
- **Es síncrona e ininterrumpible**: El navegador no puede intervenir hasta que React termine de actualizar el DOM para evitar que el usuario vea estados visuales inconsistentes a medio pintar.
- En esta fase se ejecutan \`useLayoutEffect\` (síncrono antes de pintar) y se programa \`useEffect\` (asíncrono tras el pintado).`,
    codeSnippet: `// Demostración del orden de ejecución entre fases:
function PipelineFasesDemo() {
  const [val, setVal] = useState(0);

  // FASE 1: Render (Puro, puede ejecutarse múltiples veces antes de pintar)
  console.log('[FASE 1: Render] Evaluando función del componente');

  // FASE 2: Commit - Efecto de layout (Síncrono, tras mutar DOM, antes de pintar pantalla)
  useLayoutEffect(() => {
    console.log('[FASE 2: Commit - Layout] DOM mutado síncronamente, pantalla aún no pintada');
  }, [val]);

  // FASE 2+: Efecto pasivo (Asíncrono, tras pintar el frame en el monitor)
  useEffect(() => {
    console.log('[FASE 2+: Passive Effect] El navegador ya pintó los píxeles en pantalla');
  }, [val]);

  return <button onClick={() => setVal(v => v + 1)}>Disparar Pipeline ({val})</button>;
}`,
    interviewTips: [
      'Pregunta de trampa senior: "¿Por qué en Strict Mode en desarrollo React ejecuta dos veces el cuerpo de la función pero solo una vez el `useEffect`?". Respuesta: Para detectar impurezas en la FASE DE RENDER. Si tu función de render muta una variable global, la segunda ejecución generará un resultado diferente, delatando el bug.',
      'Explica por qué `useLayoutEffect` puede causar congelamiento: al correr en la fase de Commit antes de que el navegador pinte, si ejecutas código lento dentro de él, bloquearás el hilo principal y retrasarás el siguiente fotograma.'
    ],
    commonTraps: [
      'Provocar efectos secundarios en la fase de render (ej: `window.titulo = "Nuevo"` o `fetch()` directo en el cuerpo del componente).',
      'Confundir el momento en que se ejecuta `useEffect`: corre DESPUÉS del commit y DESPUÉS del pintado del navegador.'
    ],
    keyTakeaway: 'La fase de Render calcula diferencias y es interrumpible; la fase de Commit aplica mutaciones al DOM real de forma síncrona.',
    componentKey: 'RenderCommitPhasesDemo',
    tags: ['render-phase', 'commit-phase', 'pureza', 'useLayoutEffect', 'useEffect']
  },
  {
    id: '8.3',
    level: 8,
    levelTitle: 'Internos de React',
    title: '8.3 El Scheduler de React y los Carriles de Prioridad (Lanes)',
    summary: 'Cómo el Scheduler asigna prioridades mediante carriles binarios (Lanes) y cede el control al navegador para evitar congelar frames.',
    whatIsIt: `El **Scheduler** es el paquete interno de React que gestiona el tiempo de ejecución de las tareas en el hilo principal del navegador.

¿Cómo evita bloquear el navegador?:
Utiliza una técnica llamada **Cooperative Multitasking**: divide el trabajo de renderizado en pequeños trozos de 5 milisegundos. Tras cada trozo, pregunta al navegador si hay eventos de usuario pendientes (\`navigator.scheduling.isInputPending()\` o \`MessageChannel\`). Si los hay, React cede el control inmediatamente (**Yield to Host**).

**El modelo de Carriles (Lanes)**:
React 18 introdujo un sistema de prioridades de 31 bits basado en máscaras binarias (Lanes):
- **SyncLane**: Prioridad máxima absoluta (clicks inmediatos, entradas de teclado, \`flushSync\`).
- **InputContinuousLane**: Eventos continuos (drag and drop, scroll).
- **DefaultLane**: Actualizaciones normales de \`useState\` y promesas de red.
- **TransitionLane**: Tareas de baja prioridad creadas con \`useTransition\` o \`useDeferredValue\`.
- **IdleLane**: Tareas de mantenimiento ejecutadas solo cuando el navegador está completamente desocupado.`,
    codeSnippet: `// Representación conceptual de los carriles de prioridad (Lanes de 32 bits):
// React usa operaciones a nivel de bits (bitwise operations) para comprobar prioridades en nanosegundos:
const SyncLane             = 0b0000000000000000000000000000001; // Urgencia máxima
const InputContinuousLane  = 0b0000000000000000000000000000100;
const DefaultLane          = 0b0000000000000000000000010000000;
const TransitionLane       = 0b0000000000000000001000000000000; // useTransition
const IdleLane             = 0b0100000000000000000000000000000;

// Si llega un trabajo SyncLane, React interrumpe el trabajo TransitionLane actual:
function tieneMayorPrioridad(laneA: number, laneB: number): boolean {
  return laneA < laneB; // Menor valor numérico binario = mayor prioridad
}`,
    interviewTips: [
      'Explica la evolución: antes de Lanes, React 16 usaba una escala simple de "Expiration Times". Lanes permitió modelar múltiples transiciones concurrentes paralelas y agruparlas o desacoplarlas con operaciones binarias rápidas (`&`, `|`).',
      '¿Por qué React no usa `requestIdleCallback` nativo del navegador?: Porque en muchos navegadores se dispara con demasiada infrecuencia (a veces 20 cuadros después). El Scheduler de React utiliza un polyfill optimizado basado en `MessageChannel` y `postMessage` para lograr una granularidad de 5ms.'
    ],
    commonTraps: [
      'Pensar que todas las actualizaciones de estado tienen la misma urgencia en React.',
      'Asumir que un trabajo en segundo plano nunca se ejecutará: el Scheduler incluye un mecanismo de "Starvation Protection" que eleva la prioridad de una tarea si ha estado esperando demasiado tiempo.'
    ],
    keyTakeaway: 'El Scheduler usa máscaras de bits (Lanes) y rinde el control cada 5ms para que el navegador nunca pierda un frame de 60 FPS.',
    componentKey: 'SchedulerLanesDemo',
    tags: ['scheduler', 'lanes', 'prioridades', 'message-channel', 'starvation', 'yield']
  },
  {
    id: '8.4',
    level: 8,
    levelTitle: 'Internos de React',
    title: '8.4 Cómo funcionan los Hooks por dentro (Lista Enlazada)',
    summary: 'La implementación real de useState y useEffect: un cursor que avanza sobre una lista enlazada en la fibra del componente.',
    whatIsIt: `Un mito recurrente es que React "busca los hooks por el nombre de la variable". En realidad, React no tiene idea de qué nombre le diste a \`const [edad, setEdad] = useState(25)\`.

**La arquitectura de lista enlazada**:
En el nodo Fiber del componente existe la propiedad \`fiber.memoizedState\`.
Cuando un componente se renderiza:
1. En el **primer montaje (mount)**: cada llamada a un hook (\`useState\`, \`useEffect\`) crea un nuevo objeto \`Hook\` y lo enlaza al final de la lista: \`hook1.next = hook2; hook2.next = hook3\`.
2. En los **renders siguientes (update)**: React sitúa un puntero cursor en el primer hook (\`workInProgressHook = fiber.memoizedState\`). Cada vez que tu código invoca un hook, React lee el estado de ese nodo y avanza el cursor al siguiente (\`workInProgressHook = currentHook.next\`).

Por este motivo es matemáticamente obligatorio que los hooks se invoquen en el mismo orden exacto en cada render.`,
    codeSnippet: `// Simulación didáctica de cómo React implementa useState internamente:
let listaDeHooks: any[] = [];
let cursorActual = 0;

function miUseState<T>(valorInicial: T): [T, (nuevo: T | ((prev: T) => T)) => void] {
  const indiceFijo = cursorActual;

  // Si es la primera vez que corre, inicializamos el valor:
  if (listaDeHooks[indiceFijo] === undefined) {
    listaDeHooks[indiceFijo] = valorInicial;
  }

  const setter = (nuevoValor: T | ((prev: T) => T)) => {
    listaDeHooks[indiceFijo] = typeof nuevoValor === 'function'
      ? (nuevoValor as any)(listaDeHooks[indiceFijo])
      : nuevoValor;
    reRenderizarApp(); // Dispara un nuevo ciclo de renderizado
  };

  cursorActual++; // Avanzamos el cursor para el siguiente hook
  return [listaDeHooks[indiceFijo], setter];
}

function reRenderizarApp() {
  cursorActual = 0; // Se reinicia el cursor al inicio del render
  // Se vuelve a invocar el componente...
}`,
    interviewTips: [
      'Esta es una de las preguntas de código en vivo más habituales para candidatos Senior: "Implementa una versión mínima de `useState` desde cero". Explicar el array o lista enlazada y el reseteo del cursor `cursor = 0` al inicio de cada render demuestra dominio absoluto.',
      'Explica la diferencia entre `mountWorkInProgressHook` y `updateWorkInProgressHook`: en el código fuente de React, existen dos conjuntos de funciones para cada hook según si el componente está montándose por primera vez o actualizándose.'
    ],
    commonTraps: [
      'Llamar a un hook condicionalmente, lo cual desincroniza el cursor e intercambia el estado de dos variables totalmente distintas.',
      'Crear efectos secundarios en setters sin saber que son funciones encoladas.'
    ],
    keyTakeaway: 'React rastrea los hooks mediante una lista enlazada secuencial; el orden de llamada es su única identidad.',
    componentKey: 'HooksInternalsDemo',
    tags: ['hooks-internals', 'lista-enlazada', 'useState-from-scratch', 'cursor', 'fiber']
  },
  {
    id: '8.5',
    level: 8,
    levelTitle: 'Internos de React',
    title: '8.5 Closures Obsoletas (Stale Closures)',
    summary: 'El error más sutil de React: funciones que capturan variables de un render previo y muestran valores desactualizados.',
    whatIsIt: `Una **Stale Closure (Closure obsoleta)** ocurre debido a la forma en que funcionan las funciones y el ámbito léxico en JavaScript:
Cada vez que un componente funcional de React se ejecuta, se crea un nuevo ámbito con **nuevas variables independientes**.

Si defines una función callback, un temporizador (\`setInterval\`) o un manejador de eventos que persiste a lo largo del tiempo, esa función **retiene en su closure los valores de las variables del render exacto en que fue creada**.
Si ese temporizador no se recrea o no actualiza sus dependencias, **seguirá leyendo para siempre el valor viejo del primer render**.`,
    codeSnippet: `// ❌ EL BUG CLÁSICO DE STALE CLOSURE
function TemporizadorRoto() {
  const [cuenta, setCuenta] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      // 💣 Este intervalo capturó 'cuenta = 0' al montar.
      // ¡En cada segundo volverá a imprimir 0 y fijará setCuenta(0 + 1) = 1 eternamente!
      console.log('Valor capturado obsoleto:', cuenta);
      setCuenta(cuenta + 1);
    }, 1000);
    return () => clearInterval(id);
  }, []); // Dependencias incompletas: falta [cuenta]

  return <div>Cuenta: {cuenta}</div>;
}

// ✅ LAS 3 SOLUCIONES SENIOR:
// 1. Usar actualización funcional (no depende de la variable externa):
//    setCuenta(prev => prev + 1);
// 2. Incluir [cuenta] en las dependencias (reinicia el timer con la nueva closure).
// 3. Guardar el valor en una useRef que se actualiza en cada render:
//    const cuentaRef = useRef(cuenta); cuentaRef.current = cuenta;`,
    interviewTips: [
      'Explica la solución de `useRef` para callbacks estables: si tienes un listener que no deseas reiniciar pero necesita leer el valor más reciente del estado, almacena el estado en `ref.current = state` en cada render y lee `ref.current` dentro del callback.',
      'Menciona el hook experimental/propuesto `useEffectEvent`: una API diseñada para extraer código no reactivo de los efectos sin disparar re-ejecuciones.'
    ],
    commonTraps: [
      'Silenciar las advertencias de ESLint (`// eslint-disable-next-line react-hooks/exhaustive-deps`) en vez de aplicar una de las 3 soluciones correctas.',
      'Asumir que los valores de las variables dentro de un `setTimeout` o promesa son reactivos en tiempo real.'
    ],
    keyTakeaway: 'Las closures capturan el valor de su render. Usa la forma funcional `prev => ...` o refs para evitar valores congelados.',
    componentKey: 'StaleClosuresDemo',
    tags: ['stale-closures', 'closures-obsoletas', 'setInterval', 'exhaustive-deps', 'useRef']
  },
  {
    id: '8.6',
    level: 8,
    levelTitle: 'Internos de React',
    title: '8.6 Asincronía y Encolado de `setState`',
    summary: 'setState no muta la variable local de inmediato; encola una actualización en la fibra para ser procesada en el siguiente render.',
    whatIsIt: `Una de las mayores fuentes de confusión para principiantes es escribir \`setContador(5)\` y en la línea siguiente comprobar que \`contador\` sigue teniendo el valor \`0\`.

¿Por qué ocurre esto?:
1. \`const [contador, setContador] = useState(0)\` declara una constante \`contador\` en el ámbito de la función actual.
2. \`setContador\` no es un puntero a esa constante ni puede mutar el valor de una constante en JavaScript.
3. Lo que hace \`setContador\` es crear un objeto de actualización (\`Update\`) y colocarlo en la **cola de actualizaciones de la fibra (\`fiber.updateQueue\`)**, programando una nueva invocación del componente para el futuro.
4. El nuevo valor solo estará disponible cuando React vuelva a ejecutar la función del componente en el **siguiente ciclo de render**.`,
    codeSnippet: `function DemostracionEncolado() {
  const [n, setN] = useState(0);

  const handleClick = () => {
    console.log('1. Antes del set:', n); // Imprime 0

    setN(n + 1); // Encola actualización con valor calculado (0 + 1)
    console.log('2. Inmediatamente después:', n); // ¡Sigue imprimiendo 0!

    setN(n + 1); // Encola actualización con el mismo valor (0 + 1)

    // Con la forma funcional se encadenan sobre la cola de actualizaciones:
    setN(prev => prev + 1); // Recibe el resultado de la cola (1) y suma 1 -> 2
  };

  return <button onClick={handleClick}>Valor actual: {n}</button>;
}`,
    interviewTips: [
      'Pregunta de entrevista trampa: "¿`setState` es síncrono o asíncrono?". Respuesta técnica precisa: La llamada a la función `setContador()` es estrictamente síncrona en su ejecución (crea el objeto y lo encola al instante), pero el efecto observable sobre el estado y el repintado en pantalla es asíncrono y programado.',
      'Explica cómo se procesa la cola de updates (`updateQueue`): React recorre la lista circular de actualizaciones pendientes y aplica cada una secuencialmente sobre el estado base para calcular el `memoizedState` final.'
    ],
    commonTraps: [
      'Escribir `await setEstado(...)` creyendo que `setState` retorna una Promesa (retorna `void`).',
      'Intentar leer el estado actualizado inmediatamente después de invocar su setter para enviarlo a una API en vez de pasar el nuevo valor directamente a la función de envío.'
    ],
    keyTakeaway: 'setState programa un re-render y encola un cambio; nunca modifica la variable local en la misma línea de ejecución.',
    componentKey: 'SetStateBatchingAsyncDemo',
    tags: ['setState', 'asincronia', 'updateQueue', 'encolado', 'batching']
  },
  {
    id: '8.7',
    level: 8,
    levelTitle: 'Internos de React',
    title: '8.7 Cuándo y por qué React vuelve a renderizar',
    summary: 'Las causas exactas de un re-render y optimizaciones de salida temprana (Bailout) con comparación `Object.is`.',
    whatIsIt: `Un componente vuelve a renderizarse exclusivamente por:
1. **Actualización de su propio estado local** (\`useState\` / \`useReducer\`).
2. **Re-renderizado de su componente padre** (a menos que esté memoizado con \`React.memo\` y sus props sean idénticas).
3. **Consumo de un Contexto** cuyo valor cambió.

**La optimización de salida temprana (Bailout con \`Object.is\`)**:
Si invocas \`setEstado(nuevoValor)\` y \`Object.is(nuevoValor, estadoAnterior) === true\` (es decir, el valor o la referencia es exactamente idéntica), **React cancela la actualización de inmediato (Eager Bailout)** sin re-renderizar los hijos ni tocar el DOM.`,
    codeSnippet: `function BailoutDemo() {
  const [numero, setNumero] = useState(10);
  const renders = useRef(0);
  renders.current += 1;

  const asignarMismoValor = () => {
    // Como el valor es idéntico según Object.is, React omite el render
    setNumero(10);
  };

  const asignarNuevoObjetoMismoContenido = () => {
    // 💣 Aunque el contenido sea igual, la referencia de memoria es nueva
    // React no puede hacer bailout y forzará un re-render:
    // setUser({ nombre: 'Ana' });
  };

  return (
    <div>
      <p>Valor: {numero} | Renders ejecutados: {renders.current}</p>
      <button onClick={asignarMismoValor}>Asignar 10 de nuevo (Bailout)</button>
    </div>
  );
}`,
    interviewTips: [
      'Explica por qué mutar objetos rompe el bailout: si haces `usuario.edad = 30; setUsuario(usuario);`, la referencia es idéntica (`Object.is(usuario, usuario) === true`), por lo que React ejecuta un bailout y NO actualiza la UI.',
      'Explica qué ocurre si llamas a setState con el mismo valor cuando el componente ya tenía un render pendiente: React puede ejecutar el cuerpo del componente una vez para verificar y luego hacer bailout sin hacer commit en los hijos.'
    ],
    commonTraps: [
      'Crear nuevas referencias en el setter (`setItems([...items])`) sin haber modificado nada, forzando re-renders que podrían haberse evitado.',
      'Asumir que React compara objetos en profundidad (deep equality): React solo usa comparación superficial con `Object.is`.'
    ],
    keyTakeaway: 'React compara con `Object.is`; si la referencia no cambió, aplica un Bailout y omite el re-render por completo.',
    componentKey: 'WhyRerenderBailoutDemo',
    tags: ['rerender-causes', 'bailout', 'Object.is', 'shallow-compare', 'optimizacion']
  },
  {
    id: '8.8',
    level: 8,
    levelTitle: 'Internos de React',
    title: '8.8 `useEffect` vs. `useLayoutEffect` (Pintado del navegador)',
    summary: 'useLayoutEffect corre síncronamente antes de pintar para evitar parpadeos visuales; useEffect corre asíncronamente tras el pintado.',
    whatIsIt: `La diferencia crítica reside en el momento exacto en que se ejecutan respecto al ciclo de pintado del navegador (**Browser Paint**):

1. **\`useLayoutEffect\`**:
- Se ejecuta **síncronamente** inmediatamente después de que React aplica los cambios al DOM en la fase de Commit, pero **ANTES de que el navegador pinte el fotograma en pantalla**.
- Bloquea el pintado visual hasta que su función termine.
- **Caso de uso esencial**: Medir el tamaño o posición de un nodo del DOM (\`getBoundingClientRect()\`) y ajustar estilos o posicionamiento (ej: tooltips, popovers) para que el usuario no vea el salto visual (**Flicker**).
- Advertencia: Dispara un warning en SSR porque en el servidor no hay DOM ni layout.

2. **\`useEffect\`**:
- Se ejecuta **asíncronamente después de que el navegador ha pintado la pantalla**.
- No bloquea la renderización.
- **Caso de uso**: El 99% de los efectos cotidianos (fetch, suscripciones, timers).`,
    codeSnippet: `function TooltipConLayoutEffect({ targetRect }: { targetRect: DOMRect | null }) {
  const tooltipRef = useRef<HTMLDivElement>(null);
  const [posicion, setPosicion] = useState({ top: 0, left: 0 });

  // Si usáramos useEffect aquí, el tooltip aparecería en (0,0) por 1 frame y luego saltaría
  // Con useLayoutEffect, la medición y ajuste ocurren ANTES del primer frame visible:
  useLayoutEffect(() => {
    if (tooltipRef.current && targetRect) {
      const tooltipHeight = tooltipRef.current.offsetHeight;
      setPosicion({
        top: targetRect.top - tooltipHeight - 8,
        left: targetRect.left
      });
    }
  }, [targetRect]);

  return (
    <div
      ref={tooltipRef}
      style={{ position: 'fixed', top: posicion.top, left: posicion.left }}
      className="bg-gray-900 text-white p-2 rounded shadow-lg text-sm"
    >
      Tooltip posicionado a la perfección sin parpadeo
    </div>
  );
}`,
    interviewTips: [
      'Pregunta de pizarra: "¿Cómo simularías un parpadeo visual para demostrar la necesidad de useLayoutEffect?". Respuesta: Renderizas un elemento con un valor inicial y en `useEffect` lo modificas tras una medición; el usuario verá el elemento cambiar de posición por una fracción de segundo. Con `useLayoutEffect`, ese frame intermedio nunca se pinta.',
      'Explica la regla: "Comienza siempre con `useEffect`. Solo cambia a `useLayoutEffect` si experimentas parpadeos visuales al medir el DOM".'
    ],
    commonTraps: [
      'Colocar llamadas a APIs o tareas lentas en `useLayoutEffect`, bloqueando el hilo de pintado del navegador y arruinando el INP.',
      'Intentar usar `useLayoutEffect` en Server Components o en SSR de Next.js.'
    ],
    keyTakeaway: 'useLayoutEffect mide y corrige antes de pintar para evitar parpadeos; useEffect corre después para no bloquear la pantalla.',
    componentKey: 'LayoutEffectFlickerDemo',
    tags: ['useEffect', 'useLayoutEffect', 'flicker', 'browser-paint', 'mediciones-dom']
  },
  {
    id: '8.9',
    level: 8,
    levelTitle: 'Internos de React',
    title: '8.9 Hidratación y Errores de Mismatch en profundidad',
    summary: 'Qué causa las discrepancias de hidratación entre servidor y cliente y cómo resolverlas de forma robusta y elegante.',
    whatIsIt: `En Server-Side Rendering (SSR) o SSG, el servidor genera un archivo HTML estático que se envía al navegador. Al llegar el bundle de JavaScript, React ejecuta la fase de **Hidratación**:
React recorre el DOM HTML existente y le asocia los listeners de eventos y el estado en memoria.

**¿Qué es un Hydration Mismatch?**:
Durante la hidratación, React espera que **el árbol de Virtual DOM generado por el primer render en el cliente sea idéntico al HTML que provino del servidor**.
Si hay diferencias (por ejemplo, el servidor renderizó \`<div>--:--</div>\` pero el cliente renderizó \`<div>14:32:05</div>\`), React detecta una inconsistencia:
- En desarrollo: Dispara el warning rojo \`Text content does not match server-rendered HTML\`.
- En casos severos: React tiene que descartar el subárbol del servidor y regenerarlo en el cliente, destruyendo las ventajas de rendimiento de SSR.`,
    codeSnippet: `// ❌ CAUSAS COMUNES DE MISMATCH:
// 1. Fechas y horas: new Date().toLocaleTimeString() (el servidor tiene una zona horaria distinta al usuario)
// 2. Valores aleatorios: Math.random() o crypto.randomUUID()
// 3. APIs del navegador: window.innerWidth, localStorage.getItem('token')
// 4. HTML inválido según el estándar: colocar un <p> dentro de otro <p>, o un <div> dentro de un <p>

// ✅ SOLUCIÓN ELEGANTE: Diferir la renderización del dato dependiente del cliente
function RelojSeguro() {
  const [hora, setHora] = useState<string | null>(null);

  useEffect(() => {
    // Solo corre en el cliente tras la hidratación exitosa:
    setHora(new Date().toLocaleTimeString());
    const id = setInterval(() => setHora(new Date().toLocaleTimeString()), 1000);
    return () => clearInterval(id);
  }, []);

  // En el servidor y primer render del cliente muestra '--:--' (coincidencia perfecta):
  return <span>{hora ?? '--:--'}</span>;
}`,
    interviewTips: [
      'Menciona el atributo de escape `suppressHydrationWarning`: Si una diferencia es inevitable y controlada (por ejemplo, una marca de tiempo generada por el servidor que solo difiere por milisegundos en el texto), puedes añadir `suppressHydrationWarning` en ese elemento HTML específico para silenciar la advertencia sin regenerar todo el nodo.',
      'Explica el impacto del HTML no válido: navegadores como Chrome corrigen el HTML defectuoso sobre la marcha (por ejemplo, si pones un `<div>` dentro de un `<p>`, el navegador cierra el `<p>` antes de tiempo). Esto altera la estructura del DOM físico y hace que la hidratación de React falle de forma catastrófica.'
    ],
    commonTraps: [
      'Leer `localStorage` durante la inicialización de `useState(() => localStorage.getItem("tema"))` en un componente con SSR.',
      'Usar `typeof window !== "undefined"` en condicionales de renderizado inicial (produce diferente JSX en servidor que en cliente).'
    ],
    keyTakeaway: 'Garantiza que el primer render en cliente sea idéntico al del servidor; difiere lecturas de navegador a un useEffect.',
    componentKey: 'HydrationMismatchDemo',
    tags: ['hidratacion', 'hydration-mismatch', 'ssr', 'suppressHydrationWarning', 'isMounted']
  },
  {
    id: '8.10',
    level: 8,
    levelTitle: 'Internos de React',
    title: '8.10 Implementar Custom Hooks desde cero',
    summary: 'Demuestra maestría implementando en pizarra: usePrevious, useToggle, useDebounce y useLocalStorage.',
    whatIsIt: `Una de las pruebas más efectivas en entrevistas técnicas para evaluar si un candidato comprende los mecanismos profundos de React es pedirle que implemente Custom Hooks esenciales **sin mirar documentación ni librerías**:

1. **\`usePrevious(value)\`**:
Retorna el valor que la prop o estado tenía en el render inmediatamente anterior.
Se implementa aprovechando que \`ref.current\` se actualiza dentro de un \`useEffect\` (el cual corre **después** del render). Por lo tanto, durante el render actual, \`ref.current\` aún conserva el valor anterior.
2. **\`useToggle(initialState)\`**:
Hook para alternar valores booleanos de forma funcional.
3. **\`useDebounce(value, delay)\`**:
Retorna una versión retardada de un valor mediante \`setTimeout\` y \`clearTimeout\`.
4. **\`useLocalStorage(key, initialValue)\`**:
Sincroniza estado con la API de almacenamiento local con serialización segura.`,
    codeSnippet: `// 1. usePrevious implementado desde cero:
function usePrevious<T>(valor: T): T | undefined {
  const ref = useRef<T>(undefined);

  useEffect(() => {
    // Se ejecuta DESPUÉS del renderizado
    ref.current = valor;
  }, [valor]);

  // Durante la ejecución del render, retorna el valor guardado en el ciclo PREVIO
  return ref.current;
}

// 2. useToggle implementado desde cero:
function useToggle(inicial: boolean = false): [boolean, (forzar?: boolean) => void] {
  const [activo, setActivo] = useState(inicial);
  const toggle = useCallback((forzar?: boolean) => {
    setActivo(prev => (typeof forzar === 'boolean' ? forzar : !prev));
  }, []);
  return [activo, toggle];
}`,
    interviewTips: [
      'Explica el truco mental de `usePrevious`: el retorno de la función ocurre durante el render; la asignación a `ref.current` ocurre en el `useEffect` (fase de efectos pasivos). Como el render ocurre ANTES que los efectos, la función siempre retorna el valor del render anterior.',
      'En React 19: menciona que patrones complejos para capturar valores previos a menudo pueden simplificarse con `useOptimistic` o derivando valores directamente.'
    ],
    commonTraps: [
      'Intentar implementar `usePrevious` usando `useState` en vez de `useRef`, provocando un re-render adicional e infinito en cada cambio.',
      'No manejar excepciones `JSON.parse` ni cuota excedida en implementaciones de `useLocalStorage`.'
    ],
    keyTakeaway: 'Dominar la implementación de usePrevious, useToggle y useDebounce desde cero demuestra comprensión profunda del ciclo de render.',
    componentKey: 'CustomHooksFromScratchDemo',
    tags: ['usePrevious', 'useToggle', 'useDebounce', 'custom-hooks-scratch', 'entrevista-tecnica']
  }
];
