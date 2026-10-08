import { JsTopic } from '@/types/javascript';

export const level8Topics: JsTopic[] = [
  {
    "id": "P74",
    "level": 8,
    "levelTitle": "Avanzado",
    "question": "¿Cómo funciona la gestión de memoria y qué causa fugas (*memory leaks*)?",
    "shortAnswer": "JavaScript utiliza gestión automática de memoria mediante el recolector de basura (*Garbage Collector*) con el algoritmo **Mark-and-Sweep**: libera la memoria de aquellos objetos que ya no son **alcanzables (*reachable*)** desde las raíces del sistema (Call Stack y objeto global). Una fuga de memoria (*memory leak*) ocurre cuando una referencia no deseada mantiene vivo un objeto innecesario en el Heap.",
    "explanation": `Mecánica del Garbage Collector y las 5 causas principales de fugas:

1. **Algoritmo Mark-and-Sweep (Marcar y Barrer):**
- **Fase Mark:** El recolector parte desde las raíces (\`window\`/\`global\`, variables locales activas en la pila) y sigue todos los punteros transitivos marcando cada objeto alcanzable.
- **Fase Sweep:** Todo objeto en el Heap que no haya sido marcado se considera inalcanzable; su memoria se reclama y se devuelve al sistema.

2. **Las 5 fuentes comunes de Memory Leaks en producción:**
- **Variables globales accidentales:** Olvidar declarar con \`const\`/\`let\` (\`data = []\`) vincula el dato permanentemente a \`window\`.
- **Temporizadores (\`setInterval\`) y Event Listeners olvidados:** Listeners sobre \`window\` o intervalos continuos que referencian objetos de componentes ya desmontados.
- **Closures no deseadas:** Una función interna de larga vida que retiene en su scope variables voluminosas que ya no se usan.
- **Nodos del DOM huérfanos (*Detached DOM Nodes*):** Eliminar un elemento visual de la página pero mantener una variable de JavaScript apuntando a él (\`const ref = document.getElementById(...)\`).
- **Cachés y Maps sin límite:** Mapas globales que acumulan claves sin estrategia de expulsión (LRU) o sin usar \`WeakMap\`.

3. **Diagnóstico con Chrome DevTools:**
Panel **Memory** → Tomar Heap Snapshots antes y después de interactuar con la app, y comparar (*Comparison view*) filtrando por objetos retenidos (*Retained Size*).`,
    "codeSnippet": "// 1) Global accidental (evitable con 'use strict')\nfunction fuga() { dato = 'sobrevive en window'; }\n\n// 2) Interval sin limpiar (mantiene viva toda la closure)\nconst id = setInterval(() => procesar(objetoPesado), 1000);\n// Solución: clearInterval(id) al desmontar\n\n// 3) Listener olvidado en window\nwindow.addEventListener('resize', handler);\n// Solución: window.removeEventListener('resize', handler);",
    "seniorTip": "Distingue entre Shallow Size (el peso de la propia estructura del objeto) y Retained Size (la cantidad total de memoria que se liberaría si ese objeto fuera destruido por el GC junto a todos los objetos dependientes que solo él mantiene vivos). En perfiles de memoria, siempre optimiza por Retained Size.",
    "tags": [
      "nivel-8",
      "javascript",
      "memoria",
      "garbage-collector",
      "memory-leaks"
    ],
    "interactiveDemo": "console"
  },
  {
    "id": "P75",
    "level": 8,
    "levelTitle": "Avanzado",
    "question": "¿Qué es la inmutabilidad y por qué se usa?",
    "shortAnswer": "La **inmutabilidad** es la práctica arquitectónica de tratar las estructuras de datos como inalterables: en lugar de mutar un objeto o array existente, se genera una **nueva referencia que incorpora los cambios**. Es la base de React y Redux porque permite verificar cambios en tiempo $O(1)$ mediante igualdad estricta de referencias (`prev !== next`).",
    "explanation": `Por qué la inmutabilidad domina la arquitectura frontend moderna:

1. **Comparación Superficial Ultra-rápida ($O(1)$ vs $O(n)$):**
Si el estado fuera mutable, para saber si una lista de 10,000 elementos cambió tendrías que recorrer y comparar cada propiedad una por una. Con inmutabilidad, si el puntero de referencia en memoria es distinto (\`nuevo !== anterior\`), React sabe instantáneamente que debe re-renderizar.

2. **Previsibilidad y Transparencia Temporal:**
- Facilita la depuración con *Time Travel Debugging* (Redux DevTools): el historial de estados es una lista de instantáneas estables que no pueden ser alteradas retrospectivamente por efectos colaterales.
- Permite operaciones seguras de Deshacer/Rehacer (*Undo/Redo*).

3. **Herramientas y librerías modernas:**
- Clonación inmutable nativa con spread (\`{ ...obj, mod: 1 }\`) o métodos ES2023 (\`arr.toSorted()\`).
- Para árboles de estado profundamente anidados, librerías como **Immer** (\`produce(draft => { draft.a.b.c = 1; })\`) utilizan Proxies para permitir sintaxis 'mutable' que produce un nuevo estado inmutable congelado sin verbosidad.`,
    "codeSnippet": "const estado = { usuario: { nombre: 'Ana' }, items: [1, 2] };\n\n// Actualización inmutable:\nconst nuevoEstado = {\n  ...estado,\n  usuario: { ...estado.usuario, nombre: 'Luis' },\n  items: [...estado.items, 3],\n};\n\nconsole.log(estado === nuevoEstado);                 // false (nueva referencia)\nconsole.log(estado.items === nuevoEstado.items);     // false\nconsole.log(estado.usuario.nombre);                  // 'Ana' (intacto)",
    "seniorTip": "Explica el trade-off: la inmutabilidad genera más asignaciones de objetos efímeros en el Heap. Sin embargo, los motores modernos (V8) cuentan con un recolector generacional (Scavenger / Young Generation) hiper-optimizado para reciclar objetos de vida corta en microsegundos, haciendo que el beneficio en previsibilidad y diffing supere con creces el costo del GC.",
    "tags": [
      "nivel-8",
      "javascript",
      "inmutabilidad",
      "react",
      "arquitectura"
    ],
    "interactiveDemo": "console"
  },
  {
    "id": "P76",
    "level": 8,
    "levelTitle": "Avanzado",
    "question": "¿Qué patrones de diseño se usan en JavaScript?",
    "shortAnswer": "Los patrones más usados en JavaScript incluyen: **Singleton** (los módulos ESM son singletons nativos), **Factory** (funciones que instancian objetos configurados), **Observer / Pub-Sub** (sistemas desacoplados de eventos como `EventEmitter` o Redux), **Module Pattern** (encapsulación de estado privado) y **Strategy / Decorator** (composición de funciones).",
    "explanation": `Implementación idiomática de los patrones clásicos en JS:

1. **Singleton (Instancia única compartida):**
En JavaScript moderno no se requieren clases complejas con constructores privados: cualquier archivo ESM se evalúa una sola vez y su exportación se almacena en caché en el motor como un singleton natural.
\`export const config = Object.freeze({ api: 'https://...' });\`

2. **Factory (Fábrica de Objetos):**
Funciones puras que producen objetos sin forzar el uso de \`class\` ni lidiar con \`new\` o \`this\`:
\`const crearBoton = (tipo) => ({ tipo, click: () => console.log(tipo) });\`

3. **Observer / EventEmitter (Pub-Sub):**
Patrón reactivo donde los emisores notifican a múltiples suscriptores sin conocer sus identidades. Es la base de \`document.addEventListener\`, WebSockets, Redux y Node.js \`EventEmitter\`.

4. **Strategy Pattern:**
En JavaScript, como las funciones son ciudadanos de primera clase, el patrón estrategia no requiere jerarquías de clases: basta con pasar diferentes funciones como argumento (callbacks o HOFs).`,
    "codeSnippet": "// Implementación minimalista del patrón Observer / Pub-Sub:\nclass EventEmitter {\n  #eventos = new Map();\n  on(evento, fn) {\n    const lista = this.#eventos.get(evento) ?? [];\n    lista.push(fn);\n    this.#eventos.set(evento, lista);\n    return () => this.off(evento, fn); // Desuscribir\n  }\n  off(evento, fn) {\n    const lista = this.#eventos.get(evento) ?? [];\n    this.#eventos.set(evento, lista.filter(f => f !== fn));\n  }\n  emit(evento, ...datos) {\n    (this.#eventos.get(evento) ?? []).forEach(fn => fn(...datos));\n  }\n}",
    "seniorTip": "En una entrevista de diseño, destaca que en JavaScript se prefiere la composición sobre la herencia (Composition over Inheritance). En vez de construir jerarquías rígidas de clases derivadas con extends, compone comportamiento combinando funciones puras y mezclando propiedades (mixins funcionales).",
    "tags": [
      "nivel-8",
      "javascript",
      "patrones",
      "arquitectura",
      "observer"
    ],
    "interactiveDemo": "console"
  },
  {
    "id": "P77",
    "level": 8,
    "levelTitle": "Avanzado",
    "question": "¿Cómo se manejan los errores en JavaScript?",
    "shortAnswer": "`try/catch` captura excepciones **síncronas** y promesas esperadas con `await`. Para errores asíncronos sin `await` se requiere `.catch()`. Las buenas prácticas exigen crear **clases de error personalizadas** que hereden de `Error`, nunca silenciar errores con bloques catch vacíos y utilizar la opción `cause` (ES2022) para preservar la traza original.",
    "explanation": `Estrategia profesional de manejo de errores:

1. **La regla de oro del \`try/catch\` asíncrono:**
Un \`try/catch\` síncrono no puede capturar un error lanzado dentro de un callback diferido:
\`\`\`js
// ERROR: el catch no atrapará la excepción
try {
  setTimeout(() => { throw new Error('Fallo'); }, 100);
} catch (e) { /* Nunca llega aquí */ }
\`\`\`
Para asincronía moderna, usa siempre \`await\` dentro de \`try/catch\`:
\`\`\`js
try {
  await fetchDatos();
} catch (e) { /* Capturado correctamente */ }
\`\`\`

2. **Clases de Error de Dominio Personalizadas:**
Permiten a los bloques catch identificar qué tipo de fallo ocurrió usando \`instanceof\`:
\`class NotFoundError extends Error { constructor(msg) { super(msg); this.name = 'NotFoundError'; } }\`

3. **Encadenamiento de Causas (*Error Cause* - ES2022):**
\`\`\`js
try {
  await db.query();
} catch (err) {
  throw new Error('Fallo al cargar perfil', { cause: err });
}
\`\`\`
Permite envolver errores con contexto de alto nivel sin perder el \`stack trace\` del error original.`,
    "codeSnippet": "class ErrorDeValidacion extends Error {\n  constructor(mensaje, campo) {\n    super(mensaje);\n    this.name = 'ErrorDeValidacion';\n    this.campo = campo;\n  }\n}\n\ntry {\n  throw new ErrorDeValidacion('Email inválido', 'email');\n} catch (e) {\n  if (e instanceof ErrorDeValidacion) {\n    console.warn(`Campo ${e.campo}: ${e.message}`);\n  } else {\n    throw e; // Nunca silenciar errores desconocidos\n  }\n}",
    "seniorTip": "Antipatrón letal: jamás escribas catch (e) {} (tragar errores en silencio). Si no puedes resolver el error localmente, debes al menos loguearlo a una plataforma de telemetría (Sentry/Datadog) o re-lanzarlo (throw e) para que el llamador aguas arriba tome medidas compensatorias.",
    "tags": [
      "nivel-8",
      "javascript",
      "errores",
      "excepciones"
    ],
    "interactiveDemo": "console"
  },
  {
    "id": "P78",
    "level": 8,
    "levelTitle": "Avanzado",
    "question": "¿Cómo es el *event loop* en Node.js? (`nextTick`, `setImmediate`)",
    "shortAnswer": "Node.js basa su Event Loop en la biblioteca **libuv**, dividida en 6 fases específicas: (1) Timers (`setTimeout`), (2) Pending callbacks, (3) Idle/prepare, (4) **Poll (I/O de red y disco)**, (5) **Check (`setImmediate`)**, y (6) Close callbacks. **`process.nextTick`** no es parte de libuv: se ejecuta inmediatamente al terminar la operación actual, antes que cualquier microtarea o fase del Event Loop.",
    "explanation": `Mecánica de fases de libuv y prioridades en Node.js:

1. **Las fases de libuv:**
- **Timers:** Ejecuta callbacks de \`setTimeout\` y \`setInterval\` vencidos.
- **Poll:** Fase central. Espera eventos de I/O entrantes (sockets, lectura de archivos) y ejecuta sus callbacks.
- **Check:** Ejecuta callbacks de \`setImmediate()\` inmediatamente después de la fase Poll.

2. **\`setImmediate\` vs \`setTimeout(fn, 0)\`:**
- Dentro de un callback de I/O (ej. \`fs.readFile\`), \`setImmediate\` **siempre se ejecuta antes** que \`setTimeout(..., 0)\` porque la fase Check sigue directamente a la fase Poll.
- En el script principal el orden no está garantizado debido al jitter del reloj del sistema.

3. **\`process.nextTick\` vs \`Promise.then\`:**
- \`process.nextTick\` tiene su propia cola de microtareas que se procesa **antes** que la cola de microtareas estándar de Promesas en CommonJS.
- *(Nota técnica ESM):* En módulos ESM, el módulo raíz se evalúa en una microtarea de promesa, lo que puede provocar que las promesas drenen antes de la primera ráfaga de \`nextTick\`.`,
    "codeSnippet": "setTimeout(() => console.log('timeout'), 0);\nsetImmediate(() => console.log('setImmediate (fase check)'));\nprocess.nextTick(() => console.log('nextTick (prioridad inmediata)'));\nPromise.resolve().then(() => console.log('microtarea promesa'));\nconsole.log('síncrono');\n\n// Salida típica en CommonJS:\n// síncrono -> nextTick -> microtarea promesa -> timeout -> setImmediate",
    "seniorTip": "Advierte que abusar de llamadas recursivas a process.nextTick bloqueará completamente el Event Loop de Node.js por inanición (starvation), impidiendo que el servidor procese peticiones I/O de otros clientes. Para iteraciones asíncronas seguras en Node, prefiere setImmediate.",
    "tags": [
      "event-loop",
      "nivel-8",
      "javascript",
      "nodejs",
      "libuv"
    ],
    "interactiveDemo": "event-loop"
  },
  {
    "id": "P79",
    "level": 8,
    "levelTitle": "Avanzado",
    "question": "¿Cómo mejoras el rendimiento de código JavaScript?",
    "shortAnswer": "Para optimizar JavaScript se debe seguir una regla cardinal: **medir antes de optimizar** usando Chrome DevTools Performance Profiler y `performance.now()`. Las estrategias clave son: reducir complejidad algorítmica ($O(1)$ con `Map`/`Set`), no bloquear el hilo principal (Web Workers, `scheduler.yield`), y minimizar mutaciones de DOM agrupando lecturas y escrituras.",
    "explanation": `Pilares de optimización de alto rendimiento:

1. **Complejidad Algorítmica ($O(n^2) \\to O(n)$):**
Sustituir búsquedas anidadas lineales (\`arr.filter(x => otro.includes(x))\`) por diccionarios hash o conjuntos \`Set\` (\`set.has(x)\` en $O(1)$).

2. **No Bloquear el Hilo Principal (*Long Tasks*):**
Cualquier tarea en JavaScript que tarde más de 50ms se considera una tarea larga (*Long Task*) que degrada las métricas Core Web Vitals (TBT e INP). Rompe bucles pesados en trozos cediendo el hilo con \`await new Promise(r => setTimeout(r, 0))\` o la API nativa \`scheduler.yield()\`.

3. **Optimizaciones del Motor V8 (Crankshaft / TurboFan):**
- **Formas consistentes (*Hidden Classes / Shapes*):** Inicializa siempre los objetos con las mismas propiedades y en el mismo orden; mutar la estructura dinámicamente desoptimiza los accesos en caché (*Inline Caches*).
- **Evitar arrays dispersos (*Holey Arrays*):** Mantén los arrays continuos y homogéneos en tipos (ej. puros números) para que V8 use arrays C++ empaquetados en memoria.`,
    "codeSnippet": "// Complejidad O(n²) ineficiente:\nconst comunesLento = a.filter(x => b.includes(x));\n\n// Optimizado O(n) con Set hash lookup:\nconst setB = new Set(b);\nconst comunesRapido = a.filter(x => setB.has(x));\n\n// Medición de microsegundos precisa:\nconst t0 = performance.now();\nejecutarCalculo();\nconsole.log(`Tiempo: ${(performance.now() - t0).toFixed(2)}ms`);",
    "seniorTip": "Cita la frase de Donald Knuth: 'La optimización prematura es la raíz de todos los males'. En una entrevista, explica que primero se identifican los cuellos de botella reales con CPU flamecharts en DevTools antes de alterar la legibilidad del código.",
    "tags": [
      "nivel-8",
      "javascript",
      "rendimiento",
      "v8",
      "optimizacion"
    ],
    "interactiveDemo": "console"
  },
  {
    "id": "P80",
    "level": 8,
    "levelTitle": "Avanzado",
    "question": "¿Qué aporta TypeScript frente a JavaScript?",
    "shortAnswer": "TypeScript es un **superset tipado estático** de JavaScript que se compila y elimina por completo (*type erasure*), generando JavaScript estándar ejecutable. Aporta detección de errores en tiempo de desarrollo/compilación, autocompletado inteligente (*IntelliSense*), refactorización asistida y contratos vivos de datos, sin alterar en absoluto el comportamiento ni el rendimiento en tiempo de ejecución.",
    "explanation": `Diferencias estructurales y beneficios arquitectónicos:

1. **Comprobación en Compilación vs Runtime:**
- En JavaScript puro, un error de tipado (\`TypeError: Cannot read properties of undefined\`) solo se descubre cuando el usuario final interactúa con la aplicación en producción.
- TypeScript detecta discrepancias de contratos, llamadas inválidas o propiedades inexistentes de forma estática en el IDE antes de que el código llegue a staging.

2. **Type Erasure (Eliminación Total de Tipos):**
El compilador de TypeScript (\`tsc\`, SWC o Turbopack) remueve todas las interfaces, types, genéricos y anotaciones. El archivo final generado es JavaScript limpio que no añade ninguna sobrecarga de rendimiento ni peso adicional de biblioteca en runtime.

3. **Capacidades avanzadas del sistema de tipos:**
- **Tipos de Unión y Discriminados (*Discriminated Unions*):** Modelado exacto de máquinas de estado.
- **Genéricos (\`<T>\`):** Componentes y funciones reutilizables con tipado estricto.
- **Tipos Mapeados y Condicionales:** \`Pick\`, \`Omit\`, \`Partial\`, \`ReturnType\`.`,
    "codeSnippet": "type Rol = 'admin' | 'usuario';\n\ninterface Usuario {\n  id: number;\n  nombre: string;\n  rol: Rol;\n}\n\n// Error detectado en compilación (no en producción):\n// const u: Usuario = { id: 1, nombre: 'Ana', rol: 'superadmin' };",
    "seniorTip": "Pregunta trampa recurrente: '¿TypeScript hace que mi aplicación corra más rápido en el navegador?'. La respuesta correcta es NO: los tipos no existen en el navegador; el rendimiento del bytecode resultante es idéntico. Sin embargo, hace que el equipo de ingeniería desarrolle más rápido y con un 80% menos de regresiones.",
    "tags": [
      "nivel-8",
      "javascript",
      "typescript",
      "tipos"
    ],
    "interactiveDemo": "console"
  },
  {
    "id": "P81",
    "level": 8,
    "levelTitle": "Avanzado",
    "question": "¿Qué es un `WeakRef` y cuándo se usaría?",
    "shortAnswer": "Un **`WeakRef`** (*Weak Reference*) es un objeto que mantiene una **referencia débil** hacia otro objeto sin impedir que este sea destruido por el Garbage Collector si no existen otras referencias fuertes hacia él. Se complementa con `FinalizationRegistry` para ejecutar limpieza cuando el objeto es recolectado.",
    "explanation": `Mecánica, APIs y advertencias críticas de uso:

1. **Cómo funciona:**
\`\`\`js
let objetoPesado = { datos: new Array(1e6) };
const ref = new WeakRef(objetoPesado);

// Desreferenciar:
const obj = ref.deref();
if (obj) {
  // El objeto sigue vivo en memoria
  console.log(obj.datos.length);
} else {
  // El recolector de basura ya lo liberó de memoria
  console.log('El objeto ha sido recolectado');
}
\`\`\`

2. **Casos de uso válidos:**
- **Cachés de objetos pesados regenerables:** Guardar imágenes procesadas o estructuras complejas que pueden recalcularse fácilmente si el recolector de basura decide destruirlas ante presión de memoria.
- **Mapeos de elementos de UI:** Asociar datos a elementos del DOM sin retenerlos.

3. **Advertencia de la especificación de TC39:**
El momento exacto en que el Garbage Collector se ejecuta es **completamente no determinista**. Nunca bases la lógica crítica de negocio o el flujo de control de tu aplicación en la recolección de un \`WeakRef\`.`,
    "codeSnippet": "let cache = new Map();\n\nfunction obtenerDatoPesado(clave) {\n  const ref = cache.get(clave);\n  const dato = ref?.deref();\n  if (dato) return dato; // Acierto en caché\n\n  const nuevoDato = calcularPesado(clave);\n  cache.set(clave, new WeakRef(nuevoDato));\n  return nuevoDato;\n}",
    "seniorTip": "Resalta el consejo oficial de la especificación ECMAScript: 'Evita usar WeakRef siempre que sea posible'. En casi todos los escenarios habituales, un WeakMap o WeakSet estándar es mucho más predecible, seguro y adecuado.",
    "tags": [
      "weakref",
      "nivel-8",
      "javascript",
      "memoria",
      "avanzado"
    ],
    "interactiveDemo": "console"
  }
];
