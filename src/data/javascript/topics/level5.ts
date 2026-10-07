import { JsTopic } from '@/types/javascript';

export const level5Topics: JsTopic[] = [
  {
    "id": "P44",
    "level": 5,
    "levelTitle": "Asincronía",
    "question": "¿Cómo funciona el *event loop*?",
    "shortAnswer": "JavaScript es *single-thread*: ejecuta una cosa a la vez en la **call stack**. Las operaciones asíncronas (timers, red, eventos) las gestiona el entorno (navegador/Node) fuera de la pila; cuando terminan, su callback entra en una **cola**. El *event loop* revisa constantemente: si la pila está vacía, toma la siguiente tarea de la cola.",
    "explanation": "Orden: código síncrono → **todas** las microtareas → (render) → **una** macrotarea → todas las microtareas → ...",
    "codeSnippet": "Call Stack  ← ejecuta el código síncrono\nWeb APIs    ← setTimeout, fetch, eventos DOM (fuera del hilo principal)\nMicrotask queue  ← .then/.catch/.finally, async/await, queueMicrotask  (PRIORIDAD ALTA)\nMacrotask queue  ← setTimeout, setInterval, eventos, I/O                (después)",
    "seniorTip": "",
    "tags": [
      "nivel-5",
      "event-loop",
      "javascript"
    ],
    "interactiveDemo": "event-loop"
  },
  {
    "id": "P45",
    "level": 5,
    "levelTitle": "Asincronía",
    "question": "¿Diferencia entre microtareas y macrotareas? ¿Qué imprime esto?",
    "shortAnswer": "**Explicación:** primero el código síncrono (`1`, `5`). Luego se vacía la cola de microtareas (`3`, `4`) y solo después se atiende el `setTimeout` (`2`), aunque tenga 0 ms.",
    "explanation": "primero el código síncrono (`1`, `5`). Luego se vacía la cola de microtareas (`3`, `4`) y solo después se atiende el `setTimeout` (`2`), aunque tenga 0 ms.",
    "codeSnippet": "console.log('1');\nsetTimeout(() => console.log('2'), 0);          // macrotarea\nPromise.resolve().then(() => console.log('3')); // microtarea\nqueueMicrotask(() => console.log('4'));         // microtarea\nconsole.log('5');\n// Salida: 1 5 3 4 2",
    "seniorTip": "",
    "tags": [
      "nivel-5",
      "javascript"
    ],
    "interactiveDemo": "event-loop"
  },
  {
    "id": "P46",
    "level": 5,
    "levelTitle": "Asincronía",
    "question": "¿Qué es una Promesa y cuáles son sus estados?",
    "shortAnswer": "un objeto que representa el resultado futuro de una operación asíncrona. Estados: **pending** → **fulfilled** (resuelta) o **rejected** (rechazada). Una vez *settled*, no cambia. `.then()` devuelve **otra promesa**, lo que permite encadenar.",
    "explanation": "un objeto que representa el resultado futuro de una operación asíncrona. Estados: **pending** → **fulfilled** (resuelta) o **rejected** (rechazada). Una vez *settled*, no cambia. `.then()` devuelve **otra promesa**, lo que permite encadenar.",
    "codeSnippet": "const esperar = (ms) => new Promise((resolve, reject) => {\n  if (ms < 0) return reject(new Error('negativo'));\n  setTimeout(() => resolve(`listo tras ${ms}ms`), ms);\n});\n\nesperar(500)\n  .then((msg) => { console.log(msg); return 'siguiente'; })   // el return alimenta al próximo then\n  .then((v) => console.log(v))\n  .catch((err) => console.error(err))      // captura errores de toda la cadena\n  .finally(() => console.log('siempre'));",
    "seniorTip": "",
    "tags": [
      "nivel-5",
      "javascript"
    ],
    "interactiveDemo": "console"
  },
  {
    "id": "P47",
    "level": 5,
    "levelTitle": "Asincronía",
    "question": "¿Qué es `async/await` y cómo se manejan los errores?",
    "shortAnswer": "azúcar sintáctico sobre promesas. Una función `async` **siempre devuelve una promesa**; `await` pausa esa función (sin bloquear el hilo) hasta que la promesa se resuelva. Los errores se capturan con `try/catch`.",
    "explanation": "azúcar sintáctico sobre promesas. Una función `async` **siempre devuelve una promesa**; `await` pausa esa función (sin bloquear el hilo) hasta que la promesa se resuelva. Los errores se capturan con `try/catch`.",
    "codeSnippet": "async function cargarUsuario(id) {\n  try {\n    const res = await fetch(`/api/users/${id}`);\n    if (!res.ok) throw new Error(`HTTP ${res.status}`);   // fetch NO rechaza en 404/500\n    return await res.json();\n  } catch (error) {\n    console.error('Falló:', error);\n    throw error;                                          // re-lanzar si el llamador debe saberlo\n  } finally {\n    ocultarSpinner();\n  }\n}",
    "seniorTip": "",
    "tags": [
      "async",
      "nivel-5",
      "javascript"
    ],
    "interactiveDemo": "console"
  },
  {
    "id": "P48",
    "level": 5,
    "levelTitle": "Asincronía",
    "question": "¿Diferencia entre `Promise.all`, `allSettled`, `race` y `any`?",
    "shortAnswer": "| Método | Resuelve cuando... | Rechaza cuando... |",
    "explanation": "| Método | Resuelve cuando... | Rechaza cuando... |\n|---|---|---|\n| `all` | **todas** se cumplen (array de resultados) | **una** falla (rechaza rápido) |\n| `allSettled` | **todas** terminan (éxito o fallo) | nunca |\n| `race` | la **primera** termina (cumplida o rechazada) | la primera que termina es un rechazo |\n| `any` | la **primera que se cumple** | **todas** fallan (`AggregateError`) |",
    "codeSnippet": "const [usuario, posts] = await Promise.all([getUsuario(), getPosts()]);\n\nconst resultados = await Promise.allSettled([a(), b(), c()]);\nresultados.forEach((r) => r.status === 'fulfilled' ? usar(r.value) : log(r.reason));\n\n// Timeout con race\nconst conTimeout = (promesa, ms) =>\n  Promise.race([promesa, new Promise((_, rej) => setTimeout(() => rej(new Error('timeout')), ms))]);",
    "seniorTip": "",
    "tags": [
      "promise",
      "nivel-5",
      "javascript",
      "array"
    ],
    "interactiveDemo": "console"
  },
  {
    "id": "P49",
    "level": 5,
    "levelTitle": "Asincronía",
    "question": "¿Cómo ejecutar tareas en paralelo vs. en secuencia con `await`?",
    "shortAnswer": "¿Cómo ejecutar tareas en paralelo vs. en secuencia con `await`?",
    "explanation": "¿Cómo ejecutar tareas en paralelo vs. en secuencia con `await`?",
    "codeSnippet": "// Secuencial: ~ 2s (la segunda espera a la primera)\nconst a = await tarea1(); // 1s\nconst b = await tarea2(); // 1s\n\n// Paralelo: ~ 1s (se inician juntas)\nconst [a2, b2] = await Promise.all([tarea1(), tarea2()]);\n\n// En un bucle, for...of con await es secuencial\nfor (const id of ids) await procesar(id);\n// Paralelo\nawait Promise.all(ids.map((id) => procesar(id)));",
    "seniorTip": "",
    "tags": [
      "nivel-5",
      "javascript"
    ],
    "interactiveDemo": "console"
  },
  {
    "id": "P50",
    "level": 5,
    "levelTitle": "Asincronía",
    "question": "¿Por qué `await` dentro de `forEach` no funciona como esperas?",
    "shortAnswer": "`forEach` ignora el valor de retorno del callback (las promesas) y no espera a nadie, por lo que el código posterior corre antes de terminar.",
    "explanation": "`forEach` ignora el valor de retorno del callback (las promesas) y no espera a nadie, por lo que el código posterior corre antes de terminar.",
    "codeSnippet": "async function mal(ids) {\n  ids.forEach(async (id) => { await guardar(id); });\n  console.log('listo'); // se imprime ANTES de guardar\n}\n\nasync function bien(ids) {\n  for (const id of ids) await guardar(id);          // secuencial\n  // o: await Promise.all(ids.map(guardar));         // paralelo\n  console.log('listo');\n}",
    "seniorTip": "",
    "tags": [
      "nivel-5",
      "javascript"
    ],
    "interactiveDemo": "console"
  },
  {
    "id": "P51",
    "level": 5,
    "levelTitle": "Asincronía",
    "question": "¿Qué pasa con `setTimeout(fn, 0)`?",
    "shortAnswer": "no ejecuta `fn` inmediatamente: la encola como **macrotarea**, así que corre cuando termina el código actual y las microtareas pendientes (y los navegadores aplican un mínimo de ~4 ms con anidamiento). Sirve para ceder el hilo y dejar que el navegador pinte.",
    "explanation": "no ejecuta `fn` inmediatamente: la encola como **macrotarea**, así que corre cuando termina el código actual y las microtareas pendientes (y los navegadores aplican un mínimo de ~4 ms con anidamiento). Sirve para ceder el hilo y dejar que el navegador pinte.",
    "codeSnippet": "setTimeout(() => console.log('timeout'), 0);\nPromise.resolve().then(() => console.log('promesa'));\nconsole.log('sync');\n// sync, promesa, timeout",
    "seniorTip": "",
    "tags": [
      "nivel-5",
      "javascript"
    ],
    "interactiveDemo": "console"
  },
  {
    "id": "P52",
    "level": 5,
    "levelTitle": "Asincronía",
    "question": "¿Cómo se orquesta el orden con `async/await` internamente?",
    "shortAnswer": "**Explicación:** `a()` corre síncronamente hasta el `await`; ahí ejecuta `b()` (imprime `b`), y lo que sigue al `await` (`a2`) se programa como microtarea, de modo que `fin` se imprime antes.",
    "explanation": "`a()` corre síncronamente hasta el `await`; ahí ejecuta `b()` (imprime `b`), y lo que sigue al `await` (`a2`) se programa como microtarea, de modo que `fin` se imprime antes.",
    "codeSnippet": "async function a() { console.log('a1'); await b(); console.log('a2'); }\nasync function b() { console.log('b'); }\n\nconsole.log('inicio');\na();\nconsole.log('fin');\n// inicio, a1, b, fin, a2",
    "seniorTip": "",
    "tags": [
      "async",
      "nivel-5",
      "javascript"
    ],
    "interactiveDemo": "console"
  },
  {
    "id": "P53",
    "level": 5,
    "levelTitle": "Asincronía",
    "question": "¿Cómo cancelar una petición y evitar *race conditions*?",
    "shortAnswer": "Sin esto, una respuesta lenta de una búsqueda vieja puede sobrescribir los resultados de la nueva.",
    "explanation": "Sin esto, una respuesta lenta de una búsqueda vieja puede sobrescribir los resultados de la nueva.",
    "codeSnippet": "let controller;\nasync function buscar(texto) {\n  controller?.abort();                         // cancela la búsqueda anterior\n  controller = new AbortController();\n  try {\n    const res = await fetch(`/api?q=${texto}`, { signal: controller.signal });\n    return await res.json();\n  } catch (e) {\n    if (e.name === 'AbortError') return;       // cancelación esperada, no es un error\n    throw e;\n  }\n}",
    "seniorTip": "",
    "tags": [
      "nivel-5",
      "javascript"
    ],
    "interactiveDemo": "console"
  },
  {
    "id": "P54",
    "level": 5,
    "levelTitle": "Asincronía",
    "question": "¿Qué pasa con una promesa rechazada sin `catch`?",
    "shortAnswer": "genera un `unhandledrejection` (en Node moderno termina el proceso con error; en el navegador aparece en consola). Siempre maneja errores: `.catch()`, `try/catch` o un manejador global.",
    "explanation": "genera un `unhandledrejection` (en Node moderno termina el proceso con error; en el navegador aparece en consola). Siempre maneja errores: `.catch()`, `try/catch` o un manejador global.",
    "codeSnippet": "window.addEventListener('unhandledrejection', (e) => reportar(e.reason));\nprocess.on('unhandledRejection', (reason) => { /* Node */ });",
    "seniorTip": "",
    "tags": [
      "nivel-5",
      "javascript"
    ],
    "interactiveDemo": "console"
  },
  {
    "id": "P55",
    "level": 5,
    "levelTitle": "Asincronía",
    "question": "¿Cómo se implementa un *retry* con espera creciente (*backoff*)?",
    "shortAnswer": "---",
    "explanation": "---",
    "codeSnippet": "const dormir = (ms) => new Promise((r) => setTimeout(r, ms));\n\nasync function reintentar(fn, intentos = 3, espera = 500) {\n  for (let i = 0; i < intentos; i++) {\n    try { return await fn(); }\n    catch (e) {\n      if (i === intentos - 1) throw e;\n      await dormir(espera * 2 ** i);   // 500, 1000, 2000...\n    }\n  }\n}",
    "seniorTip": "",
    "tags": [
      "nivel-5",
      "javascript"
    ],
    "interactiveDemo": "console"
  }
];
