import { JsTopic } from '@/types/javascript';

export const level8Topics: JsTopic[] = [
  {
    "id": "P74",
    "level": 8,
    "levelTitle": "Avanzado",
    "question": "¿Cómo funciona la gestión de memoria y qué causa fugas (*memory leaks*)?",
    "shortAnswer": "JS usa **recolección de basura** con el algoritmo *mark-and-sweep*: libera lo que ya no es **alcanzable** desde las raíces (global, pila). Una fuga ocurre cuando mantienes referencias a cosas que ya no necesitas.",
    "explanation": "Causas típicas:\n\n\n\nSe diagnostican con Chrome DevTools → **Memory** (heap snapshots, comparar antes/después).",
    "codeSnippet": "// 1) Globales accidentales\nfunction f() { dato = 'fuga'; }          // sin declarar → global (evitable con strict mode)\n\n// 2) Listeners y timers sin limpiar\nconst id = setInterval(() => usar(grande), 1000);   // clearInterval(id) al terminar\nwindow.addEventListener('resize', handler);         // removeEventListener al desmontar\n\n// 3) Closures que retienen datos grandes\nfunction crear() {\n  const enorme = new Array(1e6).fill('x');\n  return () => enorme.length;            // enorme sigue vivo mientras exista la función\n}\n\n// 4) Cachés que crecen sin límite → usa WeakMap/WeakRef o un LRU\n// 5) Referencias a nodos del DOM eliminados",
    "seniorTip": "",
    "tags": [
      "nivel-8",
      "javascript"
    ],
    "interactiveDemo": "console"
  },
  {
    "id": "P75",
    "level": 8,
    "levelTitle": "Avanzado",
    "question": "¿Qué es la inmutabilidad y por qué se usa?",
    "shortAnswer": "tratar los datos como inalterables: en vez de modificar, se crea una **copia con el cambio**. Facilita detectar cambios por comparación de referencias (React, Redux), evita efectos secundarios y simplifica depurar.",
    "explanation": "tratar los datos como inalterables: en vez de modificar, se crea una **copia con el cambio**. Facilita detectar cambios por comparación de referencias (React, Redux), evita efectos secundarios y simplifica depurar.",
    "codeSnippet": "const estado = { usuario: { nombre: 'Ana' }, items: [1, 2] };\n\nconst nuevo = {\n  ...estado,\n  usuario: { ...estado.usuario, nombre: 'Luis' },\n  items: [...estado.items, 3],\n};\n// Para estructuras profundas: Immer (produce) o structuredClone + cambio",
    "seniorTip": "",
    "tags": [
      "nivel-8",
      "javascript"
    ],
    "interactiveDemo": "console"
  },
  {
    "id": "P76",
    "level": 8,
    "levelTitle": "Avanzado",
    "question": "¿Qué patrones de diseño se usan en JavaScript?",
    "shortAnswer": "¿Qué patrones de diseño se usan en JavaScript?",
    "explanation": "¿Qué patrones de diseño se usan en JavaScript?",
    "codeSnippet": "// Singleton (un módulo ESM ya es un singleton)\nexport const config = Object.freeze({ api: 'https://...' });\n\n// Factory\nconst crearUsuario = (tipo) => (tipo === 'admin' ? { permisos: ['all'] } : { permisos: ['leer'] });\n\n// Observer / Pub-Sub\nclass Emisor {\n  #escuchas = new Map();\n  on(evento, fn) { (this.#escuchas.get(evento) ?? this.#escuchas.set(evento, []).get(evento)).push(fn); return () => this.off(evento, fn); }\n  off(evento, fn) { this.#escuchas.set(evento, (this.#escuchas.get(evento) ?? []).filter((f) => f !== fn)); }\n  emit(evento, ...args) { (this.#escuchas.get(evento) ?? []).forEach((fn) => fn(...args)); }\n}\n\n// Módulo (closures / ESM), Strategy (pasar funciones), Decorator (envolver funciones), Proxy (P60)",
    "seniorTip": "",
    "tags": [
      "nivel-8",
      "javascript"
    ],
    "interactiveDemo": "console"
  },
  {
    "id": "P77",
    "level": 8,
    "levelTitle": "Avanzado",
    "question": "¿Cómo se manejan los errores en JavaScript?",
    "shortAnswer": "`try/catch` solo captura errores **síncronos** o los de `await` dentro de una `async function`; un `throw` dentro de un `setTimeout` o promesa sin `await` no lo capturan.",
    "explanation": "`try/catch` solo captura errores **síncronos** o los de `await` dentro de una `async function`; un `throw` dentro de un `setTimeout` o promesa sin `await` no lo capturan.",
    "codeSnippet": "class ErrorDeValidacion extends Error {\n  constructor(mensaje, campo) {\n    super(mensaje);\n    this.name = 'ErrorDeValidacion';\n    this.campo = campo;\n  }\n}\n\ntry {\n  throw new ErrorDeValidacion('Email inválido', 'email');\n} catch (e) {\n  if (e instanceof ErrorDeValidacion) mostrarEnCampo(e.campo, e.message);\n  else throw e;                                   // no tragarse errores desconocidos\n} finally {\n  limpiar();                                       // siempre se ejecuta\n}\n\nnew Error('falló', { cause: errorOriginal });      // ES2022: encadenar la causa",
    "seniorTip": "",
    "tags": [
      "async",
      "nivel-8",
      "javascript"
    ],
    "interactiveDemo": "console"
  },
  {
    "id": "P78",
    "level": 8,
    "levelTitle": "Avanzado",
    "question": "¿Cómo es el *event loop* en Node.js? (`nextTick`, `setImmediate`)",
    "shortAnswer": "Node usa libuv con fases (timers → pending → poll/I/O → check → close). `process.nextTick` tiene su propia cola, que se vacía **antes** que la de microtareas de promesas, salvo cuando el código ya se está ejecutando dentro de una microtarea (caso de los módulos ESM). `setImmediate` corre en la fase *check*, justo tras el poll.",
    "explanation": "**Por qué cambia en ESM:** un módulo ESM se evalúa dentro de una microtarea, así que la cola de promesas se vacía antes de que Node procese `nextTick`. En entrevista, lo importante es saber que `nextTick` y las promesas se ejecutan antes que cualquier `setTimeout`/`setImmediate`, y que depender del orden entre ellas es frágil.",
    "codeSnippet": "setTimeout(() => console.log('timeout'), 0);\nsetImmediate(() => console.log('immediate'));\nprocess.nextTick(() => console.log('nextTick'));\nPromise.resolve().then(() => console.log('promesa'));\nconsole.log('sync');\n\n// CommonJS (.cjs):  sync, nextTick, promesa, timeout, immediate\n// ESM (.mjs):       sync, promesa, nextTick, timeout, immediate\n// (timeout vs immediate no está garantizado fuera de un callback de I/O)",
    "seniorTip": "",
    "tags": [
      "event-loop",
      "nivel-8",
      "javascript"
    ],
    "interactiveDemo": "event-loop"
  },
  {
    "id": "P79",
    "level": 8,
    "levelTitle": "Avanzado",
    "question": "¿Cómo mejoras el rendimiento de código JavaScript?",
    "shortAnswer": "- **Medir primero:** `console.time`, `performance.now()`, DevTools → Performance.",
    "explanation": "- **Medir primero:** `console.time`, `performance.now()`, DevTools → Performance.\n- **No bloquear el hilo principal:** dividir tareas largas, `requestIdleCallback`, Web Workers, `setTimeout(fn, 0)` entre trozos.\n- **Complejidad algorítmica:** usar `Map`/`Set` (O(1)) en vez de buscar con `includes`/`find` (O(n)) dentro de bucles.\n- **Memoización** para cálculos puros costosos.\n- **DOM:** agrupar lecturas/escrituras, `DocumentFragment`, delegación de eventos, virtualizar listas.\n- **Red:** caché, compresión, `debounce` de peticiones, paginación.",
    "codeSnippet": "// O(n²)\nconst comunes = a.filter((x) => b.includes(x));\n// O(n)\nconst setB = new Set(b);\nconst comunes2 = a.filter((x) => setB.has(x));",
    "seniorTip": "",
    "tags": [
      "debounce",
      "dom",
      "nivel-8",
      "javascript"
    ],
    "interactiveDemo": "console"
  },
  {
    "id": "P80",
    "level": 8,
    "levelTitle": "Avanzado",
    "question": "¿Qué aporta TypeScript frente a JavaScript?",
    "shortAnswer": "tipado estático opcional que se **comprueba en compilación** (y se elimina al generar JS). Aporta detección temprana de errores, autocompletado, refactorización segura y documentación viva. No cambia el comportamiento en runtime.",
    "explanation": "```ts\ntype Usuario = { id: number; nombre: string; email?: string };\n\nfunction saludar(u: Usuario): string {\n  return `Hola ${u.nombre}`;\n}\nsaludar({ id: 1 });                       // Error de compilación: falta nombre\nconst primero = <T,>(arr: T[]): T | undefined => arr[0];   // genéricos\n```",
    "codeSnippet": "",
    "seniorTip": "",
    "tags": [
      "nivel-8",
      "javascript"
    ],
    "interactiveDemo": "console"
  },
  {
    "id": "P81",
    "level": 8,
    "levelTitle": "Avanzado",
    "question": "¿Qué es un `WeakRef` y cuándo se usaría?",
    "shortAnswer": "una referencia **débil** a un objeto que no impide que sea recolectado. Útil para cachés de objetos grandes que se pueden recalcular. Úsalo con cautela: el momento de la recolección no es predecible.",
    "explanation": "---",
    "codeSnippet": "let objeto = { datos: new Array(1e6) };\nconst ref = new WeakRef(objeto);\nobjeto = null;\nref.deref()?.datos;       // puede ser undefined si ya fue recolectado",
    "seniorTip": "",
    "tags": [
      "weakref",
      "nivel-8",
      "javascript"
    ],
    "interactiveDemo": "console"
  }
];
