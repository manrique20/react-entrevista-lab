import { JsTopic } from '@/types/javascript';

export const level5Topics: JsTopic[] = [
  {
    "id": "P44",
    "level": 5,
    "levelTitle": "Asincronía",
    "question": "¿Cómo funciona el *event loop*?",
    "shortAnswer": "JavaScript es monohilo (*single-threaded*): ejecuta un solo hilo de instrucciones síncronas en la **pila de llamadas (*Call Stack*)**. Las tareas asíncronas se delegan a las Web APIs del entorno (o libuv en Node.js); al resolverse, sus callbacks se encolan. El **Event Loop** monitorea el Call Stack: cuando este queda completamente vacío, procesa prioritariamente **todas las microtareas** y luego toma **una macrotarea** de la cola.",
    "explanation": `Ciclo de vida del Event Loop en el navegador paso a paso:

1. **La Pila de Llamadas (*Call Stack*):**
Ejecuta el código síncrono línea por línea mediante estructuras de pila LIFO (Last In, First Out). Hasta que el Call Stack no se vacía, nada más puede ejecutarse en el hilo principal.

2. **APIs del Entorno (*Web APIs / Libuv*):**
Operaciones de I/O, llamadas a red (\`fetch\`), timers (\`setTimeout\`) o eventos de usuario (\`click\`) no corren en JavaScript: las atiende el motor del navegador en hilos secundarios en segundo plano.

3. **Las dos colas de ejecución:**
- **Microtask Queue (Prioridad Absoluta):** Contiene callbacks de \`Promise.then/catch/finally\`, \`queueMicrotask()\` y \`MutationObserver\`. Se vacía por completo (incluso si se generan nuevas microtareas durante su vaciado) antes de ceder el control.
- **Macrotask / Task Queue:** Contiene callbacks de \`setTimeout\`, \`setInterval\`, \`setImmediate\` e I/O de red. Se atiende solo UNA por vuelta de loop.

4. **Fase de Renderizado del Navegador (*Render Phase*):**
Ocurre entre el vaciado de microtareas y la siguiente macrotarea (típicamente sincronizada a 60Hz/120Hz con \`requestAnimationFrame\`).`,
    "codeSnippet": "// Esquema de prioridades del runtime:\n// 1. Call Stack (síncrono)\n// 2. Microtask Queue (todas las promesas pendientes)\n// 3. Render / repintado del DOM si corresponde\n// 4. Macrotask Queue (1 callback de setTimeout / I/O)",
    "seniorTip": "Trampa de starvation: dado que el motor procesa microtareas hasta agotar la cola antes de dar paso a la siguiente macrotarea o al renderizado del DOM, encadenar infinitamente promesas o microtareas (queueMicrotask) congelará la UI del navegador por completo (UI starvation), impidiendo que el usuario haga clic o la página se repinte.",
    "tags": [
      "nivel-5",
      "event-loop",
      "javascript",
      "asincronia"
    ],
    "interactiveDemo": "event-loop"
  },
  {
    "id": "P45",
    "level": 5,
    "levelTitle": "Asincronía",
    "question": "¿Diferencia entre microtareas y macrotareas? ¿Qué imprime esto?",
    "shortAnswer": "Las **microtareas** provienen de Promesas (`.then()`, `async/await`) y `queueMicrotask`; tienen máxima prioridad y se vacían en su totalidad antes de cualquier repintado o macrotarea. Las **macrotareas** provienen de `setTimeout`, `setInterval` y eventos del DOM; el Event Loop ejecuta solo **una macrotarea por ciclo**, revisando la cola de microtareas después de cada una.",
    "explanation": `Análisis paso a paso de la salida \`1, 5, 3, 4, 2\`:

1. \`console.log('1')\`: Síncrono inmediato → Imprime **1**.
2. \`setTimeout(..., 0)\`: Registra un temporizador en las Web APIs. Al expirar de inmediato, encola su callback en la **Macrotask Queue**.
3. \`Promise.resolve().then(...)\`: La promesa ya está cumplida; su callback se encola en la **Microtask Queue**.
4. \`queueMicrotask(...)\`: Se añade directamente a la **Microtask Queue**.
5. \`console.log('5')\`: Síncrono inmediato → Imprime **5**.
6. **El Call Stack queda vacío:** El Event Loop inspecciona la Microtask Queue y la drena en orden FIFO → Imprime **3** y luego **4**.
7. **No quedan microtareas:** El Event Loop avanza y extrae la primera macrotarea de la Macrotask Queue → Imprime **2**.`,
    "codeSnippet": "console.log('1');\nsetTimeout(() => console.log('2'), 0);          // macrotarea\nPromise.resolve().then(() => console.log('3')); // microtarea\nqueueMicrotask(() => console.log('4'));         // microtarea\nconsole.log('5');\n// Salida estricta: 1 5 3 4 2",
    "seniorTip": "En una entrevista técnica, si te preguntan '¿Por qué Promise.resolve().then(f) se ejecuta antes que setTimeout(f, 0)?', no respondas vagamente 'porque es más rápido'. Especifica: 'Porque la especificación HTML5 asigna prioridad estricta al vaciado del Microtask Checkpoint antes de consumir el siguiente ciclo de la Task Queue'.",
    "tags": [
      "nivel-5",
      "javascript",
      "event-loop",
      "microtasks"
    ],
    "interactiveDemo": "event-loop"
  },
  {
    "id": "P46",
    "level": 5,
    "levelTitle": "Asincronía",
    "question": "¿Qué es una Promesa y cuáles son sus estados?",
    "shortAnswer": "Una **Promesa** es un objeto que representa la eventual finalización (con éxito) o fracaso de una operación asíncrona. Pasa por 3 estados mutuamente excluyentes: **pending** (pendiente), **fulfilled** (cumplida con un valor) o **rejected** (rechazada con un motivo). Una vez establecida (*settled*), su estado y valor son inmutables.",
    "explanation": `Garantías y arquitectura del objeto \`Promise\` (ES6):

1. **Estados del Ciclo de Vida:**
- **\`pending\`:** Estado inicial; la operación aún no se ha completado.
- **\`fulfilled\`:** La operación tuvo éxito; se resolvió con un valor \`resolve(valor)\`.
- **\`rejected\`:** La operación falló; se rechazó con un error o motivo \`reject(razon)\`.
- **\`settled\`:** Término que engloba a \`fulfilled\` o \`rejected\`; una vez en este estado, ninguna llamada posterior a \`resolve\` o \`reject\` tiene efecto alguno.

2. **Encadenamiento y Composición (*Promise Chaining*):**
- Cada llamada a \`.then()\`, \`.catch()\` o \`.finally()\` devuelve una **nueva Promesa independiente**.
- Si el callback de un \`.then()\` retorna un valor, la nueva promesa se resuelve con ese valor.
- Si retorna otra promesa, la nueva promesa adopta el estado y valor de esa promesa interna (resolución aplanada).
- Si lanza una excepción (\`throw new Error()\`), la nueva promesa pasa a estado \`rejected\` y salta al \`.catch()\` más cercano.`,
    "codeSnippet": "const esperar = (ms) => new Promise((resolve, reject) => {\n  if (ms < 0) return reject(new Error('Tiempo negativo no permitido'));\n  setTimeout(() => resolve(`Completado en ${ms}ms`), ms);\n});\n\nesperar(500)\n  .then((msg) => { console.log(msg); return 42; })   // el retorno alimenta al siguiente then\n  .then((num) => console.log('Recibido:', num))\n  .catch((err) => console.error('Error:', err.message))\n  .finally(() => console.log('Operación concluida'));",
    "seniorTip": "Aclara que el callback constructor de new Promise((resolve, reject) => { ... }) se ejecuta de forma completamente síncrona en el Call Stack. Lo que es asíncrono son los callbacks suscritos posteriormente mediante .then() o .catch(), que se despachan a la Microtask Queue.",
    "tags": [
      "nivel-5",
      "javascript",
      "promesas",
      "async"
    ],
    "interactiveDemo": "console"
  },
  {
    "id": "P47",
    "level": 5,
    "levelTitle": "Asincronía",
    "question": "¿Qué es `async/await` y cómo se manejan los errores?",
    "shortAnswer": "`async/await` es azúcar sintáctico sobre Promesas que permite escribir código asíncrono con sintaxis secuencial y legible. Toda función marcada con `async` **devuelve siempre una Promesa**, y `await` pausa la ejecución interna de dicha función hasta que la promesa se resuelva, permitiendo capturar errores con bloques síncronos `try/catch`.",
    "explanation": `Mecánica y trampas habituales con \`async/await\`:

1. **Cómo funciona internamente (Generadores + Promesas):**
Bajo el capó, \`async/await\` es equivalente a una función generadora (\`function*\`) combinada con un iterador de promesas. Cuando se encuentra un \`await\`, la función suspende su ejecución, cede el hilo de ejecución al Event Loop y se reanuda como una microtarea cuando la promesa culmina.

2. **Manejo de Errores con \`try/catch/finally\`:**
- Cualquier rechazo de promesa en una expresión \`await\` se traduce en una excepción estándar que activa el bloque \`catch\`.
- Si una función \`async\` no contiene \`try/catch\` y una promesa falla, la función retorna una promesa rechazada que debe ser atrapada con \`.catch()\` en el llamador.

3. **La trampa número 1 de \`fetch\` en entrevistas:**
\`fetch()\` **NO rechaza la promesa** ante códigos de error HTTP como 404, 401 o 500; solo la rechaza ante fallos de red o desconexión física. Es mandatorio verificar manualmente \`if (!res.ok) throw new Error(...)\`.`,
    "codeSnippet": "async function cargarUsuario(id) {\n  try {\n    const res = await fetch(`/api/users/${id}`);\n    if (!res.ok) throw new Error(`HTTP ${res.status}`);   // fetch NO rechaza en 404/500\n    return await res.json();\n  } catch (error) {\n    console.error('Falló la carga:', error);\n    throw error;                                          // re-lanzar si el llamador debe saberlo\n  } finally {\n    ocultarSpinner();\n  }\n}",
    "seniorTip": "Patrón Golang en TypeScript/JavaScript moderno: para evitar anidar bloques try/catch por todas partes, muchos desarrolladores seniors usan una función auxiliar: const to = (p) => p.then(d => [null, d]).catch(e => [e, null]); const [err, user] = await to(fetchUser(id));",
    "tags": [
      "async",
      "nivel-5",
      "javascript",
      "await",
      "errores"
    ],
    "interactiveDemo": "console"
  },
  {
    "id": "P48",
    "level": 5,
    "levelTitle": "Asincronía",
    "question": "¿Diferencia entre `Promise.all`, `allSettled`, `race` y `any`?",
    "shortAnswer": "`Promise.all` espera a que **todas** se cumplan o falla inmediatamente ante el **primer error** (*fail-fast*). `allSettled` espera a que **todas terminen** sin importar éxito o fallo. `race` resuelve o rechaza según la **primera que finalice**. `any` resuelve con la **primera que tenga éxito** y solo rechaza si **todas fallan**.",
    "explanation": `Comparativa de los combinadores estáticos de \`Promise\`:

| Combinador | Condición de Resolución | Condición de Rechazo | Caso de Uso Típico |
|---|---|---|---|
| \`Promise.all\` | Todas resuelven con éxito (array de resultados) | **Falla rápida (*Fail-fast*):** Una sola promesa rechaza | Cargas paralelas interdependientes (ej. datos de usuario + permisos) |
| \`Promise.allSettled\` | **Todas terminan** (éxito o rechazo) | **Nunca rechaza** | Operaciones independientes donde quieres el informe final de cada una |
| \`Promise.race\` | La **primera que termine**, ya sea éxito o error | La primera que termine fue un rechazo | Implementación de límites de tiempo (*Timeouts*) |
| \`Promise.any\` | La **primera que resuelva con éxito** | **Todas fallan** (devuelve un \`AggregateError\`) | Consultas a servidores espejo o CDNs redundantes |

Estructura de respuesta de \`allSettled\`:
Cada elemento del array es un objeto: \`{ status: 'fulfilled', value: T }\` o \`{ status: 'rejected', reason: any }\`.`,
    "codeSnippet": "const [usuario, posts] = await Promise.all([getUsuario(), getPosts()]);\n\nconst resultados = await Promise.allSettled([a(), b(), c()]);\nresultados.forEach((r) => r.status === 'fulfilled' ? usar(r.value) : log(r.reason));\n\n// Timeout elegante con race\nconst conTimeout = (promesa, ms) =>\n  Promise.race([promesa, new Promise((_, rej) => setTimeout(() => rej(new Error('timeout')), ms))]);",
    "seniorTip": "Si usas Promise.all y una promesa se rechaza, las demás promesas continúan ejecutándose en segundo plano en el navegador o servidor (no se cancelan automáticamente). Para cancelar realmente las peticiones de red huérfanas en paralelo, debes combinarlas con un AbortController.",
    "tags": [
      "promise",
      "nivel-5",
      "javascript",
      "combinadores"
    ],
    "interactiveDemo": "console"
  },
  {
    "id": "P49",
    "level": 5,
    "levelTitle": "Asincronía",
    "question": "¿Cómo ejecutar tareas en paralelo vs. en secuencia con `await`?",
    "shortAnswer": "Para ejecutar en **secuencia** (una tras otra), se utiliza un bucle `for...of` con `await`, útil cuando cada paso depende del resultado del anterior. Para ejecutar en **paralelo** (simultáneamente), se inician todas las promesas al mismo tiempo con `Promise.all` o `map`, reduciendo drásticamente el tiempo total de respuesta.",
    "explanation": `Diferencia de tiempo y arquitectura en producción:

1. **Ejecución Secuencial (Tiempo total = suma de todas las tareas):**
\`\`\`js
// Si cada tarea tarda 1 segundo, tiempo total = 3 segundos
const user = await getUser();
const posts = await getPosts(user.id);
const comments = await getComments(posts[0].id);
\`\`\`
Indispensable cuando existe una dependencia de datos en cascada (*waterfall*).

2. **Ejecución Paralela (Tiempo total = tiempo de la tarea más lenta):**
\`\`\`js
// Ambas tareas se disparan al unísono: tiempo total = max(1s, 1s) = 1s
const [productos, categorias] = await Promise.all([
  fetchProductos(),
  fetchCategorias()
]);
\`\`\`

3. **La trampa de iniciar promesas dentro del bucle:**
\`\`\`js
// SECUENCIAL:
for (const id of ids) { await procesar(id); }

// PARALELO (dispara todas y espera su conclusión):
await Promise.all(ids.map(id => procesar(id)));
\`\`\``,
    "codeSnippet": "// Secuencial: tarda ~2s (la segunda espera a que termine la primera)\nconst a = await tarea1(); // 1s\nconst b = await tarea2(); // 1s\n\n// Paralelo: tarda ~1s (se inician concurrentemente)\nconst [a2, b2] = await Promise.all([tarea1(), tarea2()]);\n\n// En arrays:\nfor (const id of ids) await procesar(id);           // Secuencial\nawait Promise.all(ids.map((id) => procesar(id)));    // Paralelo",
    "seniorTip": "Cuidado con la concurrencia no controlada: hacer Promise.all(ids.map(...)) sobre un array de 10,000 elementos saturará el pool de conexiones de red del navegador (límite de 6 sockets por dominio) o tumbará tu base de datos backend. Para arrays masivos, implementa un pool de concurrencia limitada (como p-limit).",
    "tags": [
      "nivel-5",
      "javascript",
      "concurrencia",
      "async"
    ],
    "interactiveDemo": "console"
  },
  {
    "id": "P50",
    "level": 5,
    "levelTitle": "Asincronía",
    "question": "¿Por qué `await` dentro de `forEach` no funciona como esperas?",
    "shortAnswer": "`Array.prototype.forEach` no espera promesas porque su implementación interna es síncrona: invoca el callback pero **ignora por completo cualquier valor que este retorne**. Si le pasas una función `async`, los callbacks se disparan en paralelo sin esperarse, y la línea posterior al `forEach` se ejecutará de inmediato.",
    "explanation": `Análisis de la mecánica de \`forEach\` y cómo solucionarlo:

1. **Por qué falla:**
La implementación interna de \`forEach\` es conceptualmente:
\`\`\`js
for (let i = 0; i < array.length; i++) {
  callback(array[i], i, array); // ¡No hace await de este callback!
}
\`\`\`
Al marcar el callback como \`async\`, este retorna una \`Promise\`, pero \`forEach\` la descarta. La función contenedora continúa inmediatamente su flujo síncrono.

2. **Solución 1: Si necesitas ejecución secuencial:**
Utiliza un bucle \`for...of\` estándar:
\`\`\`js
for (const item of items) {
  await procesar(item);
}
\`\`\`

3. **Solución 2: Si deseas ejecución concurrente:**
Utiliza \`.map()\` combinado con \`Promise.all()\`:
\`\`\`js
await Promise.all(items.map(async (item) => {
  await procesar(item);
}));
\`\`\``,
    "codeSnippet": "async function mal(ids) {\n  ids.forEach(async (id) => { await guardar(id); });\n  console.log('listo'); // ¡Se imprime ANTES de que los guardados terminen!\n}\n\nasync function bien(ids) {\n  for (const id of ids) await guardar(id);          // Secuencial correcto\n  // o en paralelo: await Promise.all(ids.map(guardar));\n  console.log('listo');                             // Se imprime al terminar todos\n}",
    "seniorTip": "La misma limitación aplica a .filter() y .reduce(): array.filter(async fn) mantendrá TODOS los elementos porque una función async devuelve un objeto Promise, y cualquier objeto es truthy. Para filtrar asíncronamente se requiere mapear a booleanos y luego filtrar.",
    "tags": [
      "nivel-5",
      "javascript",
      "bucles",
      "async"
    ],
    "interactiveDemo": "console"
  },
  {
    "id": "P51",
    "level": 5,
    "levelTitle": "Asincronía",
    "question": "¿Qué pasa con `setTimeout(fn, 0)`?",
    "shortAnswer": "`setTimeout(fn, 0)` no ejecuta la función de forma instantánea; encola su callback en la **cola de macrotareas** (*Task Queue*). La función solo se ejecutará cuando la pila de llamadas (*Call Stack*) y todas las microtareas pendientes se hayan vaciado por completo. Sirve para diferir trabajo no bloqueante y ceder el turno al render del navegador.",
    "explanation": `Mecánica temporal y el límite mínimo de 4ms:

1. **El mito de los cero milisegundos:**
Especificar \`0\` no significa ejecución inmediata, significa 'tan pronto como el Call Stack esté desocupado y le toque el turno a las macrotareas'.
Todo el código síncrono actual y todas las microtareas en cola tienen prioridad absoluta sobre este callback.

2. **La regla de los 4ms en HTML5:**
La especificación de la W3C y WHATWG estipula que tras 5 niveles de temporizadores anidados consecutivos (\`setTimeout\` dentro de \`setTimeout\`), el navegador impone un retardo mínimo forzado de **4 milisegundos**, independientemente de que se haya solicitado \`0\`.

3. **Para qué se utiliza en producción:**
- **Ceder el hilo al motor gráfico (*Yielding to main thread*):** Permite al navegador pintar cambios pendientes en el DOM antes de procesar la siguiente tarea pesada.
- **Romper tareas largas (*Long Tasks*):** Evita que un cálculo intensivo bloquee la interacción de usuario (mejorando métricas de rendimiento como INP - Interaction to Next Paint).`,
    "codeSnippet": "setTimeout(() => console.log('macrotarea (setTimeout)'), 0);\nPromise.resolve().then(() => console.log('microtarea (Promise)'));\nconsole.log('síncrono');\n// Orden de salida: 'síncrono', 'microtarea (Promise)', 'macrotarea (setTimeout)'",
    "seniorTip": "En navegadores modernos, si buscas programar una tarea no bloqueante con máxima eficiencia de rendimiento, menciona la API nativa moderna scheduler.yield() o requestIdleCallback(), que fueron diseñadas específicamente para sustituir el truco de setTimeout(fn, 0).",
    "tags": [
      "nivel-5",
      "javascript",
      "settimeout",
      "event-loop"
    ],
    "interactiveDemo": "console"
  },
  {
    "id": "P52",
    "level": 5,
    "levelTitle": "Asincronía",
    "question": "¿Cómo se orquesta el orden con `async/await` internamente?",
    "shortAnswer": "Una función `async` se ejecuta de forma **completamente síncrona** hasta encontrar la primera palabra clave `await`. En ese punto, evalúa la expresión contigua, suspende la función y programa todo el código subsiguiente como una **microtarea** en la cola de promesas, permitiendo que el hilo principal continúe su ejecución.",
    "explanation": `Desglose cronológico del ejemplo:
\`\`\`js
async function a() { console.log('a1'); await b(); console.log('a2'); }
async function b() { console.log('b'); }
console.log('inicio');
a();
console.log('fin');
\`\`\`

1. Se imprime \`'inicio'\`.
2. Se invoca \`a()\`: Se ejecuta síncronamente su primera línea e imprime \`'a1'\`.
3. Se encuentra \`await b()\`: Se evalúa \`b()\` síncronamente e imprime \`'b'\`.
4. La función \`a()\` se suspende en el \`await\`: la continuación (\`console.log('a2')\`) se encola como una **microtarea**.
5. El hilo principal vuelve al contexto exterior e imprime \`'fin'\`.
6. El Call Stack se vacía. El Event Loop despacha la microtarea encolada e imprime finalmente \`'a2'\`.

Salida resultante garantizada: \`inicio\` → \`a1\` → \`b\` → \`fin\` → \`a2\`.`,
    "codeSnippet": "async function a() {\n  console.log('a1');\n  await b();\n  console.log('a2');\n}\nasync function b() {\n  console.log('b');\n}\n\nconsole.log('inicio');\na();\nconsole.log('fin');\n// Salida: inicio, a1, b, fin, a2",
    "seniorTip": "Comprender que lo que está ANTES del primer await corre síncronamente y solo lo que está DESPUÉS se convierte en microtarea es la clave para resolver cualquier prueba técnica de Event Loop sin equivocarse.",
    "tags": [
      "async",
      "nivel-5",
      "javascript",
      "event-loop",
      "await"
    ],
    "interactiveDemo": "console"
  },
  {
    "id": "P53",
    "level": 5,
    "levelTitle": "Asincronía",
    "question": "¿Cómo cancelar una petición y evitar *race conditions*?",
    "shortAnswer": "Para cancelar peticiones HTTP se utiliza **`AbortController`** pasando su `signal` en la configuración de `fetch`. Es fundamental en inputs de búsqueda tipo autocomplete para evitar **condiciones de carrera (*race conditions*)**, donde una petición anterior pero más lenta sobrescribe los datos de la búsqueda más reciente.",
    "explanation": `El peligro de las condiciones de carrera y la solución con \`AbortController\`:

1. **El problema de la condición de carrera (*Race Condition*):**
- El usuario teclea 're' → Se dispara \`fetch('/search?q=re')\` (tarda 800ms).
- El usuario teclea 'react' → Se dispara \`fetch('/search?q=react')\` (tarda 200ms).
- La búsqueda 'react' responde primero y la UI muestra los resultados correctos.
- 600ms después, responde la búsqueda vieja 're' y sobrescribe la pantalla con datos obsoletos.

2. **La solución con \`AbortController\`:**
- Antes de disparar una nueva consulta, se llama a \`controller.abort()\`.
- Esto cancela la conexión HTTP en el socket de red del navegador inmediatamente.
- La promesa de \`fetch\` se rechaza con un error cuyo \`error.name === 'AbortError'\`, el cual simplemente se descarta sin mostrar alertas de error al usuario.

3. **Uso en React:**
En \`useEffect\`, el cleanup function debe invocar \`controller.abort()\` para evitar actualizar el estado si el componente se desmonta antes de recibir la respuesta.`,
    "codeSnippet": "let controller;\nasync function buscar(texto) {\n  controller?.abort();                         // cancela la petición previa pendiente\n  controller = new AbortController();\n  try {\n    const res = await fetch(`/api/search?q=${texto}`, { signal: controller.signal });\n    return await res.json();\n  } catch (e) {\n    if (e.name === 'AbortError') return null;  // cancelación esperada, no es error\n    throw e;\n  }\n}",
    "seniorTip": "Menciona que AbortSignal ahora cuenta con métodos estáticos modernos en ES2023+: AbortSignal.timeout(5000) para timeouts automáticos limpios, y AbortSignal.any([sig1, sig2]) para abortar una tarea si cualquiera de múltiples señales se dispara.",
    "tags": [
      "nivel-5",
      "javascript",
      "abort-controller",
      "race-conditions"
    ],
    "interactiveDemo": "console"
  },
  {
    "id": "P54",
    "level": 5,
    "levelTitle": "Asincronía",
    "question": "¿Qué pasa con una promesa rechazada sin `catch`?",
    "shortAnswer": "Una promesa rechazada sin capturar genera un evento de **`unhandledrejection`**. En Node.js moderno, esto termina el proceso inmediatamente con un código de salida distinto de cero; en navegadores, emite una advertencia roja en consola y puede dejar la aplicación en un estado inconsistente.",
    "explanation": `Consecuencias y prevención de rechazos no controlados:

1. **En Node.js (Evolución crítica):**
En versiones tempranas de Node.js solo emitía una advertencia de deprecación. Desde Node.js 15+, cualquier rechazo de promesa no manejado dispara \`unhandledRejection\` y **provoca la caída inmediata del proceso (\`crash\`)** para evitar que el servidor continúe en un estado corrupto.

2. **En el Navegador:**
El error aparece en la consola de herramientas de desarrollo y se puede interceptar con el evento global:
\`window.addEventListener('unhandledrejection', (event) => { console.error(event.reason); });\`

3. **Estrategia defensiva en producción:**
- Manejar siempre errores en el punto de invocación con \`try/catch\` o \`.catch()\`.
- Capturar rechazos globales y enviarlos a herramientas de monitoreo como Sentry o Datadog.
- En Node.js: \`process.on('unhandledRejection', (reason, promise) => { log(reason); });\``,
    "codeSnippet": "// Monitoreo global en Navegador:\nwindow.addEventListener('unhandledrejection', (e) => {\n  console.warn('Promesa rechazada no capturada:', e.reason);\n  reportarErrorASentry(e.reason);\n});\n\n// En Node.js:\nprocess.on('unhandledRejection', (reason) => {\n  console.error('Fatal unhandled rejection:', reason);\n  process.exit(1);\n});",
    "seniorTip": "En entrevistas, aclara que un bloque try/catch síncrono ordinario NO captura el error de una promesa si olvidaste anteponer la palabra clave await: try { fetchAlgo(); } catch(e) {} no atrapará el fallo; debe ser obligatoriamente try { await fetchAlgo(); } catch(e) {}.",
    "tags": [
      "nivel-5",
      "javascript",
      "errores",
      "promesas"
    ],
    "interactiveDemo": "console"
  },
  {
    "id": "P55",
    "level": 5,
    "levelTitle": "Asincronía",
    "question": "¿Cómo se implementa un *retry* con espera creciente (*backoff*)?",
    "shortAnswer": "Un patrón de **reintento con backoff exponencial** reintenta una operación asíncrona fallida un número finito de veces, duplicando el tiempo de espera entre intentos sucesivos (`espera * 2 ** intento`). Permite recuperarse de fallos transitorios de red sin saturar los servidores de destino.",
    "explanation": `Diseño del algoritmo de resiliencia:

1. **Por qué el backoff lineal o inmediato es perjudicial:**
Si un servidor está sufriendo sobrecarga temporal y 1,000 clientes reintentan inmediatamente al unísono, se genera el 'problema de la manada atronadora' (*Thundering Herd Problem*), terminando de colapsar la infraestructura.

2. **Backoff Exponencial con Jitter:**
- **Exponencial:** Las esperas crecen exponencialmente (ej. 500ms, 1000ms, 2000ms, 4000ms).
- **Jitter (Aleatoriedad):** Añadir una variación aleatoria al tiempo de espera (\`espera + Math.random() * 100\`) desincroniza las peticiones de los distintos clientes, distribuyendo la carga de forma suave en el tiempo.

3. **Condición de salida y propagación de errores:**
Si el número máximo de reintentos se agota y la operación sigue fallando, la función debe re-lanzar la última excepción capturada para que el llamador pueda manejar el error de forma transparente.`,
    "codeSnippet": "const dormir = (ms) => new Promise((r) => setTimeout(r, ms));\n\nasync function reintentar(fn, intentos = 3, espera = 500) {\n  for (let i = 0; i < intentos; i++) {\n    try {\n      return await fn();\n    } catch (e) {\n      if (i === intentos - 1) throw e; // Agotados todos los reintentos\n      const delay = espera * (2 ** i) + Math.random() * 100; // Exponencial + Jitter\n      await dormir(delay);\n    }\n  }\n}",
    "seniorTip": "Un candidato Senior destaca que no todos los errores deben reintentarse: solo los errores transitorios (códigos HTTP 429 Too Many Requests, 502, 503, 504 o fallos de conexión). Reintentar errores de cliente como 400 Bad Request o 401 Unauthorized es un antipatrón, ya que jamás tendrán éxito sin cambiar el payload.",
    "tags": [
      "nivel-5",
      "javascript",
      "resiliencia",
      "patrones"
    ],
    "interactiveDemo": "console"
  }
];
