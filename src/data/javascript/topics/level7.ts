import { JsTopic } from '@/types/javascript';

export const level7Topics: JsTopic[] = [
  {
    "id": "P63",
    "level": 7,
    "levelTitle": "DOM y navegador",
    "question": "¿Qué son el *bubbling*, el *capturing* y la delegación de eventos?",
    "shortAnswer": "El flujo de eventos en el DOM consta de 3 fases: **Captura (*Capturing*)** (el evento desciende desde `window` hasta el elemento objetivo), **Objetivo (*Target*)**, y **Burbujeo (*Bubbling*)** (asciende desde el objetivo de regreso a `window`). La **delegación de eventos** aprovecha el burbujeo colocando un único listener en un ancestro común para gestionar las interacciones de múltiples hijos presentes y futuros.",
    "explanation": `Mecánica y arquitectura de propagación de eventos:

1. **Las 3 Fases del Event Flow de la W3C:**
- **Fase 1 (Captura):** El evento viaja hacia abajo: \`window\` → \`document\` → \`<html>\` → \`<body>\` → ... → elemento objetivo. Se activa pasando \`{ capture: true }\` a \`addEventListener\`.
- **Fase 2 (Target):** El evento alcanza el nodo exacto donde se originó la interacción (\`e.target\`).
- **Fase 3 (Burbujeo):** El evento sube hacia arriba por toda la jerarquía de ancestros hasta \`window\`. Es la fase por defecto de \`addEventListener\`.

2. **\`e.target\` vs \`e.currentTarget\` (Distinción clave):**
- **\`e.target\`:** El elemento concreto y exacto que originó el evento (ej. un \`<span>\` o \`<button>\` interno).
- **\`e.currentTarget\`:** El elemento contenedor al cual está asociado físicamente el listener (\`this\`).

3. **Patrón Delegación de Eventos:**
En listas con cientos de filas (\`<ul>\` con miles de \`<li>\` dinámicos), crear un listener por cada ítem consume mucha memoria y requiere reconectar listeners al insertar nuevos nodos. La delegación coloca un solo listener en \`<ul>\` e identifica el elemento hijo con \`e.target.closest('li')\`.`,
    "codeSnippet": "document.querySelector('#lista').addEventListener('click', (e) => {\n  const item = e.target.closest('li[data-id]');   // e.target: quién originó el evento\n  if (!item || !e.currentTarget.contains(item)) return;\n  console.log('Click en el elemento con ID:', item.dataset.id);\n});\n\n// Opciones avanzadas de addEventListener:\nel.addEventListener('click', fn, { capture: true });  // Escuchar en captura\nel.addEventListener('click', fn, { once: true });     // Auto-eliminación tras 1 uso\nel.addEventListener('scroll', fn, { passive: true });  // Rendimiento: no llama preventDefault",
    "seniorTip": "Menciona cómo React implementa la delegación de eventos sintéticos (SyntheticEvents): antes de React 17 delegaba todos los eventos en document; a partir de React 17 delega en el nodo raíz de la aplicación (root DOM container), permitiendo la convivencia limpia de múltiples microfrontends React en la misma página.",
    "tags": [
      "nivel-7",
      "dom",
      "eventos",
      "delegacion",
      "javascript"
    ],
    "interactiveDemo": "console"
  },
  {
    "id": "P64",
    "level": 7,
    "levelTitle": "DOM y navegador",
    "question": "¿Diferencia entre `stopPropagation`, `stopImmediatePropagation` y `preventDefault`?",
    "shortAnswer": "`preventDefault()` cancela la acción predeterminada del navegador (como enviar un formulario o navegar un enlace) sin detener la propagación. `stopPropagation()` impide que el evento continúe viajando hacia ancestros o descendientes. `stopImmediatePropagation()` además detiene la ejecución de cualquier otro listener registrado en el mismo elemento.",
    "explanation": `Comparación funcional de los tres métodos de control de eventos:

1. **\`event.preventDefault()\`:**
- **Qué hace:** Anula el comportamiento intrínseco del navegador (ej. recarga de página en \`<form submit>\`, navegación en \`<a href>\`, o marcado de \`<input type="checkbox">\`).
- **Qué NO hace:** No detiene la propagación del evento; los elementos padres seguirán recibiendo el evento a través del burbujeo.
- Comprobación: \`event.defaultPrevented\` devuelve \`true\` si ya fue cancelado.

2. **\`event.stopPropagation()\`:**
- **Qué hace:** Corta la cadena de propagación en el nodo actual. Ningún ancestro superior en la fase de burbujeo (o descendiente en captura) recibirá el evento.
- **Limitación:** Si el mismo elemento tiene registrados varios listeners para el mismo evento (\`el.addEventListener('click', fn1)\` y \`el.addEventListener('click', fn2)\`), \`fn2\` seguirá ejecutándose.

3. **\`event.stopImmediatePropagation()\`:**
- **Qué hace:** Detiene la propagación hacia otros elementos Y cancela inmediatamente la ejecución de los demás listeners registrados sobre este mismo elemento específico.`,
    "codeSnippet": "boton.addEventListener('click', (e) => {\n  e.preventDefault();              // Evita comportamiento por defecto\n  e.stopPropagation();             // No sube a los elementos padres\n});\n\nboton.addEventListener('click', (e) => {\n  e.stopImmediatePropagation();    // Impide que se ejecuten otros listeners posteriores de este botón\n});",
    "seniorTip": "Evita abusar de stopPropagation() en librerías o componentes reutilizables: romper el burbujeo global puede inutilizar herramientas de analítica (como Google Analytics o Hotjar), dropdowns que cierran al hacer clic fuera (click outside) o sistemas de diseño corporativos.",
    "tags": [
      "nivel-7",
      "javascript",
      "eventos",
      "dom"
    ],
    "interactiveDemo": "console"
  },
  {
    "id": "P65",
    "level": 7,
    "levelTitle": "DOM y navegador",
    "question": "¿Diferencia entre `localStorage`, `sessionStorage`, cookies e IndexedDB?",
    "shortAnswer": "`localStorage` almacena hasta ~5MB de strings de forma persistente. `sessionStorage` guarda ~5MB aislados por pestaña hasta que esta se cierra. Las **Cookies** (~4KB) viajan automáticamente al servidor en cada cabecera HTTP y son el estándar de autenticación con `HttpOnly`. **IndexedDB** es una base de datos NoSQL transaccional en el cliente para cientos de megabytes de datos estructurados.",
    "explanation": `Matriz exhaustiva de almacenamiento web:

| Almacenamiento | Capacidad | Ciclo de vida | Accesible por JS | Se envía al servidor | Modelo de datos |
|---|---|---|---|---|---|
| \`localStorage\` | ~5 MB | Persistente (hasta borrado manual) | **Sí** | No | Pares clave-valor síncronos (solo strings) |
| \`sessionStorage\` | ~5 MB | Hasta cerrar la pestaña/sesión | **Sí** | No | Pares clave-valor síncronos (solo strings) |
| Cookies | ~4 KB | Configurable (\`Expires\`/\`Max-Age\`) | No si tiene \`HttpOnly\` | **Sí** (en cada petición HTTP) | Clave-valor en cabeceras |
| IndexedDB | Cientos de MB (según disco) | Persistente | **Sí** | No | NoSQL transaccional asíncrono con índices |

Seguridad Crítica (Tokens JWT):
Nunca almacenes tokens sensibles de autenticación en \`localStorage\`: cualquier vulnerabilidad de Cross-Site Scripting (XSS) permite a un atacante robarlos con \`localStorage.getItem('token')\`. La práctica de seguridad recomendada por OWASP es usar cookies con atributos \`HttpOnly\`, \`Secure\` y \`SameSite=Lax/Strict\`.`,
    "codeSnippet": "localStorage.setItem('tema', 'oscuro');\nconst usuario = JSON.parse(localStorage.getItem('usuario') ?? 'null');\n\n// Cookie segura configurada desde servidor HTTP:\n// Set-Cookie: token=xyz; Secure; HttpOnly; SameSite=Strict; Max-Age=3600\n\n// Cookie establecida desde cliente (sin HttpOnly):\ndocument.cookie = 'preferencia=compacta; max-age=86400; path=/; SameSite=Lax';",
    "seniorTip": "Resalta que localStorage y sessionStorage son APIs síncronas y bloqueantes sobre el hilo principal. Escribir o parsear payloads JSON masivos en localStorage produce microcongelamientos (jank) perceptibles en la UI. Para datos voluminosos o caches offline, usa IndexedDB o wrappers limpios como idb o localForage.",
    "tags": [
      "nivel-7",
      "javascript",
      "storage",
      "cookies",
      "seguridad"
    ],
    "interactiveDemo": "console"
  },
  {
    "id": "P66",
    "level": 7,
    "levelTitle": "DOM y navegador",
    "question": "¿Cómo funciona `fetch` y cuál es su trampa principal?",
    "shortAnswer": "`fetch()` devuelve una Promesa que **únicamente se rechaza ante errores de red** a nivel de transporte (desconexión, DNS no resuelto). Las respuestas con códigos de error HTTP como 404 Not Found o 500 Internal Server Error **resuelven con éxito**; es mandatorio verificar la propiedad booleana `res.ok` (o `res.status`).",
    "explanation": `Mecánica en dos fases de \`fetch\` y trampas críticas:

1. **Lectura del cuerpo en dos fases:**
\`fetch()\` resuelve tan pronto como el servidor envía las **cabeceras HTTP** de respuesta. Para leer el cuerpo real de datos, se debe invocar un segundo método asíncrono que consume el flujo (*Stream*):
- \`await res.json()\`
- \`await res.text()\`
- \`await res.blob()\`
*(Importante: el cuerpo de la respuesta es un Stream que solo puede consumirse una sola vez).*

2. **La trampa de \`res.ok\`:**
\`\`\`js
const res = await fetch('/api/datos');
if (!res.ok) { // res.ok es true solo para códigos 200-299
  throw new Error(\`Fallo HTTP: \${res.status} \${res.statusText}\`);
}
const data = await res.json();
\`\`\`

3. **Manejo de Cookies Cross-Origin:**
Por defecto, las peticiones hacia otros dominios no envían cookies a menos que especifiques \`credentials: 'include'\` (o \`'same-origin'\`).`,
    "codeSnippet": "async function postear(url, datos) {\n  const res = await fetch(url, {\n    method: 'POST',\n    headers: { 'Content-Type': 'application/json' },\n    body: JSON.stringify(datos),\n    credentials: 'include',      // enviar cookies en peticiones cross-origin\n  });\n  if (!res.ok) throw new Error(`HTTP Error: ${res.status}`);\n  return res.json();\n}",
    "seniorTip": "En una entrevista técnica, si comparas fetch con axios, resalta que axios sí rechaza automáticamente la promesa ante códigos >= 400 y serializa JSON de forma transparente, mientras que con fetch debes implementar un wrapper corporativo para manejar res.ok, timeouts con AbortSignal.timeout() y serialización.",
    "tags": [
      "nivel-7",
      "javascript",
      "fetch",
      "http",
      "ajax"
    ],
    "interactiveDemo": "console"
  },
  {
    "id": "P67",
    "level": 7,
    "levelTitle": "DOM y navegador",
    "question": "¿Qué es CORS y por qué ocurre?",
    "shortAnswer": "La **Same-Origin Policy** (SOP) es una regla de seguridad del navegador que impide que un script de un origen acceda a datos de otro origen (diferente protocolo, dominio o puerto). **CORS** (*Cross-Origin Resource Sharing*) es el mecanismo por el cual el **servidor autoriza explícitamente** mediante cabeceras HTTP qué orígenes externos tienen permiso para leer sus respuestas.",
    "explanation": `Mecanismo de seguridad y el proceso Preflight:

1. **Qué define un Origen:**
Protocolo + Dominio + Puerto (ej. \`https://miapp.com:443\`). Si cualquiera de los tres difiere, la petición es Cross-Origin.

2. **CORS es una protección del NAVEGADOR, no del servidor:**
El servidor procesa la petición de todas formas; es el navegador quien bloquea el acceso a la respuesta en JavaScript si faltan las cabeceras CORS. Herramientas de backend como \`curl\` o Postman no respetan CORS y pueden leer los datos sin problema.

3. **Peticiones Simples vs Peticiones Preflight (\`OPTIONS\`):**
Si la petición utiliza métodos como \`PUT\`, \`DELETE\` o cabeceras personalizadas (\`Content-Type: application/json\`, \`Authorization: Bearer\`), el navegador envía primero una petición preliminar **\`OPTIONS\` (Preflight)** para consultar si el servidor autoriza la operación antes de enviar la petición real.

4. **Cabeceras clave del servidor:**
- \`Access-Control-Allow-Origin: https://miapp.com\` (o \`*\` si es público sin credenciales).
- \`Access-Control-Allow-Methods: GET, POST, PUT, DELETE\`.
- \`Access-Control-Allow-Headers: Content-Type, Authorization\`.
- \`Access-Control-Allow-Credentials: true\` (requerido si se envían cookies).`,
    "codeSnippet": "// Ejemplo de configuración de cabeceras en Node/Express:\n// app.use(cors({\n//   origin: 'https://miapp.com',\n//   credentials: true,\n//   methods: ['GET', 'POST', 'PUT', 'DELETE'],\n// }));\n\n// En el cliente simplemente haces el fetch normal;\n// Si falla por CORS, el error solo se resuelve en el servidor",
    "seniorTip": "La respuesta definitiva en entrevistas a '¿Cómo solucionas un error de CORS desde el frontend?': 'Un error de CORS NO se arregla en el cliente; debe configurarse en el servidor que sirve la API o resolverse mediante un proxy inverso (como Next.js API Routes o Nginx) para que la llamada sea del mismo origen'.",
    "tags": [
      "nivel-7",
      "dom",
      "javascript",
      "cors",
      "seguridad"
    ],
    "interactiveDemo": "console"
  },
  {
    "id": "P68",
    "level": 7,
    "levelTitle": "DOM y navegador",
    "question": "¿Qué es *debounce* y qué es *throttle*?",
    "shortAnswer": "**Debounce** pospone la ejecución de una función hasta que haya transcurrido un tiempo determinado de **inactividad total** sin nuevos eventos (ideal para inputs de búsqueda). **Throttle** limita la frecuencia de ejecución, asegurando que la función se ejecute como máximo **una vez cada X milisegundos** (ideal para eventos continuos como scroll o resize).",
    "explanation": `Modelos mentales e implementaciones:

1. **Debounce (Búsquedas, Autoguardado, Validación de formularios):**
- Cada vez que entra un nuevo evento, **cancela el temporizador anterior y programa uno nuevo**.
- Solo cuando el usuario deja de interactuar durante $N$ milisegundos (por ejemplo, deja de teclear), la función finalmente se ejecuta una sola vez.

2. **Throttle (Scroll, Resize de ventana, Arrastre de elementos mousemove):**
- Si el evento se dispara 60 veces por segundo, throttle garantiza que la función se invoque a intervalos regulares espaciados (ej. cada 100ms), descartando las llamadas intermedias.

3. **Cuándo aplicar cada uno:**
- **Debounce:** Input search ("espera a que termine de escribir para consultar la API").
- **Throttle:** Evento scroll ("actualiza la barra de progreso de lectura como máximo 10 veces por segundo").`,
    "codeSnippet": "// Implementación limpia de Debounce:\nfunction debounce(fn, ms) {\n  let timer;\n  return (...args) => {\n    clearTimeout(timer);\n    timer = setTimeout(() => fn(...args), ms);\n  };\n}\n\n// Implementación limpia de Throttle:\nfunction throttle(fn, ms) {\n  let activo = false;\n  return (...args) => {\n    if (activo) return;\n    fn(...args);\n    activo = true;\n    setTimeout(() => { activo = false; }, ms);\n  };\n}",
    "seniorTip": "En React, si usas debounce dentro de un componente funcional, debes envolverlo obligatoriamente en useCallback o useRef para evitar que la función se recree en cada render, lo que resetearía el temporizador interno e inutilizaría el debounce.",
    "tags": [
      "nivel-7",
      "debounce",
      "throttle",
      "optimizacion",
      "javascript"
    ],
    "interactiveDemo": "console"
  },
  {
    "id": "P69",
    "level": 7,
    "levelTitle": "DOM y navegador",
    "question": "¿Qué son *reflow* y *repaint*? ¿Para qué sirve `requestAnimationFrame`?",
    "shortAnswer": "**Reflow** (o Layout) recalcula la geometría, posición y dimensiones de los elementos en la página (operación computacionalmente costosa). **Repaint** vuelve a dibujar los píxeles visuales (colores, fondos, sombras) sin alterar geometrías. `requestAnimationFrame` sincroniza las mutaciones visuales con la tasa de refresco del monitor (60Hz/120Hz) justo antes del pintado.",
    "explanation": `El Pipeline de renderizado del navegador y cómo evitar el *Layout Thrashing*:

1. **Pipeline de Renderizado del Navegador:**
JavaScript → Style (Cálculo de CSS) → **Layout (Reflow)** → **Paint (Repaint)** → Composite (Composición en GPU).

2. **Propiedades costosas vs Propiedades aceleradas por GPU:**
- Provocan **Reflow + Repaint**: Cambios en \`width\`, \`height\`, \`margin\`, \`padding\`, \`top\`, \`fontSize\`.
- Provocan solo **Repaint**: Cambios en \`color\`, \`background-color\`, \`visibility\`.
- **Aceleradas por GPU (Sin Reflow ni Repaint)**: \`transform\` (translaciones, escalas) y \`opacity\`. Son las únicas recomendadas para animaciones fluidas a 60 FPS.

3. **Layout Thrashing (Lectura/Escritura entrelazada):**
Leer propiedades geométricas (\`offsetWidth\`, \`scrollTop\`, \`getBoundingClientRect\`) obliga al motor a forzar un reflow síncrono inmediato si hubo escrituras previas. Agrupar siempre todas las lecturas primero y todas las escrituras después.`,
    "codeSnippet": "// Mal (Layout Thrashing: 1 reflow forzado por iteración):\nitems.forEach((el) => { el.style.width = el.offsetWidth * 2 + 'px'; });\n\n// Bien: agrupar lecturas y luego escrituras\nconst anchos = items.map((el) => el.offsetWidth);\nitems.forEach((el, i) => { el.style.width = anchos[i] * 2 + 'px'; });\n\n// Animación suave a 60fps con rAF y transform GPU:\nfunction animar() {\n  caja.style.transform = `translateX(${x++}px)`;\n  if (x < 300) requestAnimationFrame(animar);\n}\nrequestAnimationFrame(animar);",
    "seniorTip": "Menciona will-change: transform: informa al navegador por adelantado para que promueva el elemento a su propia capa de composición en la GPU (Compositor Layer), evitando repintados en el hilo principal durante animaciones complejas.",
    "tags": [
      "nivel-7",
      "dom",
      "rendimiento",
      "reflow",
      "javascript"
    ],
    "interactiveDemo": "console"
  },
  {
    "id": "P70",
    "level": 7,
    "levelTitle": "DOM y navegador",
    "question": "¿Qué es `IntersectionObserver`?",
    "shortAnswer": "`IntersectionObserver` es una API web moderna que detecta de forma asíncrona cuándo un elemento del DOM entra o sale del área visible (*viewport*) o de un elemento ancestro. Sustituye la necesidad de escuchar eventos continuos de `scroll` y consultar costosas coordenadas con `getBoundingClientRect`.",
    "explanation": `Ventajas de rendimiento y casos de uso en producción:

1. **Por qué revoluciona el rendimiento frontend:**
Tradicionalmente, para detectar si una imagen entraba en pantalla se agregaba un listener a \`window.addEventListener('scroll', ...)\`. Esto saturaba el hilo principal con docenas de cálculos de \`getBoundingClientRect()\` por segundo, causando *layout thrashing*. \`IntersectionObserver\` se calcula de forma optimizada internamente por el motor del navegador fuera del hilo de ejecución de JS.

2. **Casos de uso indispensables:**
- **Lazy Loading de imágenes y vídeos:** Cargar el recurso solo cuando está a punto de entrar en pantalla.
- **Scroll Infinito (*Infinite Scrolling*):** Detectar cuándo un elemento centinela invisible al final de la lista se hace visible para disparar la carga de la siguiente página.
- **Animaciones de entrada (Scroll Reveal):** Activar transiciones CSS cuando el usuario hace scroll hacia una sección.
- **Métricas de visibilidad de anuncios (*Ad Viewability*):** Registrar impresiones reales de banners.`,
    "codeSnippet": "const observador = new IntersectionObserver((entradas, obs) => {\n  entradas.forEach((entrada) => {\n    if (entrada.isIntersecting) {\n      const img = entrada.target;\n      img.src = img.dataset.src;      // Cargar la imagen real\n      obs.unobserve(img);             // Dejar de observar tras cargar\n    }\n  });\n}, { rootMargin: '200px' });          // Precarga 200px antes de entrar\n\ndocument.querySelectorAll('img[data-src]').forEach((img) => observador.observe(img));",
    "seniorTip": "En Next.js y React, el componente <Image /> utiliza IntersectionObserver por defecto. Al configurar el observador, aprovecha la opción rootMargin: '200px' para comenzar la precarga de la imagen 200 píxeles antes de que el usuario llegue a ella, garantizando que ya esté descargada al entrar en el viewport.",
    "tags": [
      "nivel-7",
      "javascript",
      "intersection-observer",
      "lazy-loading"
    ],
    "interactiveDemo": "console"
  },
  {
    "id": "P71",
    "level": 7,
    "levelTitle": "DOM y navegador",
    "question": "¿Qué son los *Web Workers* y los *Service Workers*?",
    "shortAnswer": "Los **Web Workers** ejecutan código JavaScript intensivo en un **hilo secundario en segundo plano**, evitando congelar el hilo principal y la UI. Los **Service Workers** actúan como un **servidor proxy interceptor de red** entre el navegador y la web, permitiendo almacenamiento en caché offline, notificaciones push y experiencias PWA.",
    "explanation": `Comparación técnica de los tipos de Workers:

1. **Web Workers (Dedicated Workers):**
- **Propósito:** Paralelismo computacional para cálculos pesados (procesamiento de imágenes/audio, compresión, parseo de grandes volúmenes de datos JSON, criptografía o motores de física).
- **Restricciones:** No tienen acceso al DOM, a \`window\` ni a \`document\`. Se comunican con el hilo principal mediante paso de mensajes asíncrono (\`postMessage\` y \`onmessage\`).
- **Transferencia de memoria:** Soportan *Transferable Objects* (\`ArrayBuffer\`) para transferir bloques de memoria sin clonarlos ($O(1)$).

2. **Service Workers:**
- **Propósito:** Resiliencia de red y experiencias Progressive Web Apps (PWA).
- **Ciclo de vida:** Instalar (\`install\`), Activar (\`activate\`), e Interceptar peticiones de red (\`fetch\`).
- **Caché Offline:** Permiten servir la aplicación completa sin conexión a internet leyendo de la Cache Storage API.`,
    "codeSnippet": "// Uso de Web Worker:\nconst worker = new Worker('calculador.js');\nworker.postMessage({ numeros: [1, 2, 3, 4] });\nworker.onmessage = (e) => console.log('Resultado del hilo secundario:', e.data);\n\n// calculador.js (hilo de fondo sin acceso a DOM):\nself.onmessage = (e) => {\n  const suma = e.data.numeros.reduce((a, b) => a + b, 0);\n  self.postMessage(suma);\n};",
    "seniorTip": "Si en una entrevista te preguntan cómo resolverías un lag en la UI provocado por procesar un archivo Excel o CSV de 100 MB en el navegador, la respuesta arquitectónica correcta es delegar el parseo en un Web Worker utilizando un Worker empaquetado con Vite o Webpack.",
    "tags": [
      "nivel-7",
      "web-workers",
      "service-workers",
      "pwa",
      "javascript"
    ],
    "interactiveDemo": "console"
  },
  {
    "id": "P72",
    "level": 7,
    "levelTitle": "DOM y navegador",
    "question": "¿Qué es XSS y cómo se previene?",
    "shortAnswer": "**XSS (*Cross-Site Scripting*)** es una vulnerabilidad donde un atacante inyecta scripts maliciosos de JavaScript en una aplicación web que luego se ejecutan en los navegadores de otros usuarios. Se previene **escapando la salida de datos**, usando `textContent` en vez de `innerHTML`, sanitizando con librerías como DOMPurify, definiendo una **CSP** y usando cookies `HttpOnly`.",
    "explanation": `Tipos de XSS y defensas en capas:

1. **Tipos de Ataque XSS:**
- **Almacenado (*Stored XSS*):** El payload malicioso se guarda permanentemente en la base de datos (ej. un comentario con \`<script src="malicioso.js"></script>\`). Cada usuario que visualiza el comentario ejecuta el código.
- **Reflejado (*Reflected XSS*):** El payload viaja en la URL como parámetro de búsqueda y el servidor lo refleja en el HTML sin sanitizar.
- **Basado en DOM (*DOM-based XSS*):** Ocurre enteramente en el cliente al leer fuentes inseguras (\`location.hash\`) y escribirlas en sumideros inseguros (\`element.innerHTML\` o \`eval()\`).

2. **Estrategias de Mitigación en Profundidad:**
- **Evitar sumideros inseguros:** Nunca uses \`innerHTML\`, \`outerHTML\` o \`document.write\`. Usa \`textContent\`, \`innerText\` o APIs seguras de creación de nodos.
- **Sanitización estricta:** Si requieres renderizar HTML enriquecido (ej. un editor WYSIWYG), procesa siempre el contenido con librerías como **DOMPurify**.
- **Content Security Policy (CSP):** Cabecera HTTP que restringe de qué dominios se permite cargar y ejecutar scripts (\`Content-Security-Policy: default-src 'self'\`).
- **Protección de Sesión:** Configurar \`HttpOnly\` en las cookies de sesión para que JavaScript no pueda acceder a ellas vía \`document.cookie\`.`,
    "codeSnippet": "const entrada = '<img src=x onerror=\"alert(1)\">';\n\n// VULNERABLE a XSS:\ndiv.innerHTML = entrada;                   // Ejecuta el script inyectado\n\n// SEGURO nativo:\ndiv.textContent = entrada;                 // Lo trata puramente como texto plano visible\n\n// SEGURO para HTML enriquecido:\ndiv.innerHTML = DOMPurify.sanitize(entrada); // Limpia etiquetas peligrosas",
    "seniorTip": "En React, el renderizado de JSX escapa strings por defecto contra XSS. Por eso la propiedad para inyectar HTML crudo se llama deliberadamente dangerouslySetInnerHTML, sirviendo como advertencia explícita en code reviews de que se requiere sanitización previa con DOMPurify.",
    "tags": [
      "nivel-7",
      "dom",
      "javascript",
      "seguridad",
      "xss"
    ],
    "interactiveDemo": "console"
  },
  {
    "id": "P73",
    "level": 7,
    "levelTitle": "DOM y navegador",
    "question": "¿Diferencia entre `<script>`, `async` y `defer`?",
    "shortAnswer": "Un `<script>` estándar bloquea la descarga y parseo del HTML mientras se descarga y ejecuta. `async` descarga el script en paralelo y lo ejecuta **tan pronto como termina de descargarse** (interrumpiendo el parseo del HTML y sin orden garantizado). `defer` descarga en paralelo y lo ejecuta **solo al finalizar el parseo del HTML**, garantizando el orden de aparición de los scripts.",
    "explanation": `Comparativa de carga y ejecución de scripts:

| Atributo | Descarga | Momento de Ejecución | Orden de Ejecución | Cuándo usarlo |
|---|---|---|---|---|
| \`<script>\` | Bloquea el parseo del HTML | Inmediata (bloqueante) | Secuencial | Código legacy o scripts críticos mínimos |
| \`<script async>\` | En paralelo (no bloquea descarga) | Apenas termina de descargar (interrumpe HTML) | **No garantizado** (el más rápido corre primero) | Scripts independientes (Google Analytics, anuncios) |
| \`<script defer>\` | En paralelo (no bloquea descarga) | Al finalizar el parseo del HTML, antes de \`DOMContentLoaded\` | **Garantizado en orden de declaración** | Scripts de la aplicación principal que dependen del DOM o de otros scripts |
| \`<script type="module">\` | En paralelo | Se comporta como \`defer\` por defecto | Respeta grafo de dependencias | Módulos ESM modernos |

Regla de oro: Para scripts de la aplicación donde el orden importa y se interactúa con el DOM, usa **\`defer\`**; para scripts de analítica de terceros completamente aislados, usa **\`async\`**.`,
    "codeSnippet": "<!-- Bloquea renderizado (antipatrón): -->\n<script src=\"app.js\"></script>\n\n<!-- Para analytics independiente de terceros: -->\n<script async src=\"https://analytics.com/tag.js\"></script>\n\n<!-- Para scripts de la aplicación (recomendado): -->\n<script defer src=\"vendor.js\"></script>\n<script defer src=\"app.js\"></script>",
    "seniorTip": "Ten presente que los navegadores modernos ejecutan <script type=\"module\"> con comportamiento defer implícito de forma predeterminada, por lo que no es necesario añadir el atributo defer explícitamente a módulos ES.",
    "tags": [
      "async",
      "nivel-7",
      "dom",
      "rendimiento",
      "scripts"
    ],
    "interactiveDemo": "console"
  }
];
