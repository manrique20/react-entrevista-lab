import { JsTopic } from '@/types/javascript';

export const level7Topics: JsTopic[] = [
  {
    "id": "P63",
    "level": 7,
    "levelTitle": "DOM y navegador",
    "question": "¿Qué son el *bubbling*, el *capturing* y la delegación de eventos?",
    "shortAnswer": "un evento viaja en 3 fases: **captura** (de `window` hacia el objetivo), **objetivo** y **burbujeo** (del objetivo de vuelta hacia `window`). Por defecto los listeners escuchan en burbujeo. La **delegación** aprovecha esto: un solo listener en el padre gestiona a todos los hijos (incluso los añadidos después).",
    "explanation": "**Ventajas:** menos listeners (mejor memoria), funciona con elementos dinámicos.",
    "codeSnippet": "document.querySelector('#lista').addEventListener('click', (e) => {\n  const item = e.target.closest('li[data-id]');   // e.target: quién originó el evento\n  if (!item || !e.currentTarget.contains(item)) return;\n  console.log('click en', item.dataset.id);        // e.currentTarget: dónde está el listener\n});\n\nel.addEventListener('click', fn, { capture: true });  // escuchar en fase de captura\nel.addEventListener('click', fn, { once: true });     // se auto-elimina tras ejecutarse",
    "seniorTip": "",
    "tags": [
      "nivel-7",
      "javascript"
    ],
    "interactiveDemo": "console"
  },
  {
    "id": "P64",
    "level": 7,
    "levelTitle": "DOM y navegador",
    "question": "¿Diferencia entre `stopPropagation`, `stopImmediatePropagation` y `preventDefault`?",
    "shortAnswer": "- `preventDefault()`: cancela el **comportamiento por defecto** (enviar un form, seguir un enlace). El evento sigue propagándose.",
    "explanation": "- `preventDefault()`: cancela el **comportamiento por defecto** (enviar un form, seguir un enlace). El evento sigue propagándose.\n- `stopPropagation()`: **detiene la propagación** hacia otros elementos (padres/hijos). Otros listeners del mismo elemento sí corren.\n- `stopImmediatePropagation()`: además impide que corran los demás listeners del mismo elemento.",
    "codeSnippet": "form.addEventListener('submit', (e) => {\n  e.preventDefault();          // no recargar la página\n  enviarPorFetch(new FormData(form));\n});",
    "seniorTip": "",
    "tags": [
      "nivel-7",
      "javascript"
    ],
    "interactiveDemo": "console"
  },
  {
    "id": "P65",
    "level": 7,
    "levelTitle": "DOM y navegador",
    "question": "¿Diferencia entre `localStorage`, `sessionStorage`, cookies e IndexedDB?",
    "shortAnswer": "| | Capacidad | Duración | Se envía al servidor | Notas |",
    "explanation": "| | Capacidad | Duración | Se envía al servidor | Notas |\n|---|---|---|---|---|\n| `localStorage` | ~5 MB | persistente | no | síncrono, solo strings |\n| `sessionStorage` | ~5 MB | hasta cerrar la pestaña | no | por pestaña |\n| Cookies | ~4 KB | configurable | **sí**, en cada petición | `HttpOnly`, `Secure`, `SameSite` |\n| IndexedDB | cientos de MB | persistente | no | asíncrono, estructurado, índices |\n\n\n\n**Seguridad:** nunca guardes tokens sensibles en `localStorage` si hay riesgo de XSS; prefiere cookies `HttpOnly`.",
    "codeSnippet": "localStorage.setItem('tema', 'oscuro');\nJSON.parse(localStorage.getItem('usuario') ?? 'null');\ndocument.cookie = 'visto=1; max-age=3600; Secure; SameSite=Lax';",
    "seniorTip": "",
    "tags": [
      "nivel-7",
      "javascript"
    ],
    "interactiveDemo": "console"
  },
  {
    "id": "P66",
    "level": 7,
    "levelTitle": "DOM y navegador",
    "question": "¿Cómo funciona `fetch` y cuál es su trampa principal?",
    "shortAnswer": "`fetch` devuelve una promesa que **solo se rechaza ante errores de red**. Una respuesta 404 o 500 **se resuelve normalmente**: hay que comprobar `res.ok`.",
    "explanation": "`fetch` devuelve una promesa que **solo se rechaza ante errores de red**. Una respuesta 404 o 500 **se resuelve normalmente**: hay que comprobar `res.ok`.",
    "codeSnippet": "async function postear(url, datos) {\n  const res = await fetch(url, {\n    method: 'POST',\n    headers: { 'Content-Type': 'application/json' },\n    body: JSON.stringify(datos),\n    credentials: 'include',      // enviar cookies en peticiones cross-origin\n  });\n  if (!res.ok) throw new Error(`HTTP ${res.status}`);\n  return res.json();\n}",
    "seniorTip": "",
    "tags": [
      "nivel-7",
      "javascript"
    ],
    "interactiveDemo": "console"
  },
  {
    "id": "P67",
    "level": 7,
    "levelTitle": "DOM y navegador",
    "question": "¿Qué es CORS y por qué ocurre?",
    "shortAnswer": "la **política del mismo origen** impide que una página lea respuestas de otro origen (esquema + dominio + puerto). **CORS** es el mecanismo por el cual el **servidor** declara, con cabeceras (`Access-Control-Allow-Origin`, etc.), qué orígenes pueden leer sus respuestas. Peticiones \"no simples\" (métodos como PUT/DELETE, cabeceras personalizadas, JSON) disparan antes una petición **preflight** `OPTIONS`.",
    "explanation": "CORS protege al usuario en el navegador; no es una medida de seguridad del servidor (herramientas como `curl` lo ignoran).",
    "codeSnippet": "// Se arregla en el SERVIDOR (no se puede \"arreglar\" desde el cliente)\n// Express:\napp.use(cors({ origin: 'https://miapp.com', credentials: true }));",
    "seniorTip": "",
    "tags": [
      "nivel-7",
      "dom",
      "javascript"
    ],
    "interactiveDemo": "console"
  },
  {
    "id": "P68",
    "level": 7,
    "levelTitle": "DOM y navegador",
    "question": "¿Qué es *debounce* y qué es *throttle*?",
    "shortAnswer": "- **Debounce:** espera a que pasen X ms **sin nuevos eventos** y entonces ejecuta una vez. Ej.: buscador mientras se escribe.",
    "explanation": "- **Debounce:** espera a que pasen X ms **sin nuevos eventos** y entonces ejecuta una vez. Ej.: buscador mientras se escribe.\n- **Throttle:** ejecuta como máximo **una vez cada X ms**. Ej.: `scroll`, `resize`, arrastrar.\n\nImplementaciones completas en [Ejercicios](#ejercicios-de-implementación).",
    "codeSnippet": "",
    "seniorTip": "",
    "tags": [
      "nivel-7",
      "debounce",
      "javascript"
    ],
    "interactiveDemo": "console"
  },
  {
    "id": "P69",
    "level": 7,
    "levelTitle": "DOM y navegador",
    "question": "¿Qué son *reflow* y *repaint*? ¿Para qué sirve `requestAnimationFrame`?",
    "shortAnswer": "*reflow* (layout) es recalcular posiciones/tamaños (costoso); *repaint* es volver a pintar píxeles (más barato). Leer y escribir en el DOM alternadamente fuerza reflows síncronos (*layout thrashing*). `requestAnimationFrame` ejecuta el callback justo antes del siguiente pintado, ideal para animaciones.",
    "explanation": "*reflow* (layout) es recalcular posiciones/tamaños (costoso); *repaint* es volver a pintar píxeles (más barato). Leer y escribir en el DOM alternadamente fuerza reflows síncronos (*layout thrashing*). `requestAnimationFrame` ejecuta el callback justo antes del siguiente pintado, ideal para animaciones.",
    "codeSnippet": "// Mal: lectura/escritura alternadas → un reflow por iteración\nitems.forEach((el) => { el.style.width = el.offsetWidth * 2 + 'px'; });\n\n// Mejor: agrupar lecturas y luego escrituras\nconst anchos = items.map((el) => el.offsetWidth);\nitems.forEach((el, i) => { el.style.width = anchos[i] * 2 + 'px'; });\n\nfunction animar() {\n  caja.style.transform = `translateX(${x++}px)`;   // transform/opacity no provocan reflow\n  if (x < 300) requestAnimationFrame(animar);\n}\nrequestAnimationFrame(animar);",
    "seniorTip": "",
    "tags": [
      "nivel-7",
      "dom",
      "javascript"
    ],
    "interactiveDemo": "console"
  },
  {
    "id": "P70",
    "level": 7,
    "levelTitle": "DOM y navegador",
    "question": "¿Qué es `IntersectionObserver`?",
    "shortAnswer": "API que avisa cuando un elemento entra o sale del viewport sin escuchar `scroll`. Se usa para *lazy loading*, *infinite scroll* y animaciones al aparecer.",
    "explanation": "API que avisa cuando un elemento entra o sale del viewport sin escuchar `scroll`. Se usa para *lazy loading*, *infinite scroll* y animaciones al aparecer.",
    "codeSnippet": "const obs = new IntersectionObserver((entradas, observador) => {\n  entradas.forEach((entrada) => {\n    if (entrada.isIntersecting) {\n      entrada.target.src = entrada.target.dataset.src;   // cargar imagen\n      observador.unobserve(entrada.target);\n    }\n  });\n}, { rootMargin: '200px' });\ndocument.querySelectorAll('img[data-src]').forEach((img) => obs.observe(img));",
    "seniorTip": "",
    "tags": [
      "nivel-7",
      "javascript"
    ],
    "interactiveDemo": "console"
  },
  {
    "id": "P71",
    "level": 7,
    "levelTitle": "DOM y navegador",
    "question": "¿Qué son los *Web Workers* y los *Service Workers*?",
    "shortAnswer": "- **Web Worker:** ejecuta JS en **otro hilo** para cálculo pesado sin bloquear la UI. No accede al DOM; se comunica por mensajes.",
    "explanation": "- **Web Worker:** ejecuta JS en **otro hilo** para cálculo pesado sin bloquear la UI. No accede al DOM; se comunica por mensajes.\n- **Service Worker:** proxy entre la app y la red; permite **caché offline**, notificaciones push y sincronización en segundo plano (base de las PWA).",
    "codeSnippet": "const worker = new Worker('worker.js');\nworker.postMessage({ numeros: arregloGrande });\nworker.onmessage = (e) => console.log('resultado', e.data);\n\n// worker.js\nself.onmessage = (e) => self.postMessage(e.data.numeros.reduce((a, b) => a + b, 0));",
    "seniorTip": "",
    "tags": [
      "proxy",
      "nivel-7",
      "dom",
      "javascript"
    ],
    "interactiveDemo": "console"
  },
  {
    "id": "P72",
    "level": 7,
    "levelTitle": "DOM y navegador",
    "question": "¿Qué es XSS y cómo se previene?",
    "shortAnswer": "*Cross-Site Scripting*: inyectar código JavaScript en una página que otros usuarios verán (por ejemplo, a través de un comentario). Se previene **escapando la salida**, usando `textContent` en vez de `innerHTML`, sanitizando HTML cuando es imprescindible (DOMPurify), con una **CSP** y cookies `HttpOnly`.",
    "explanation": "*Cross-Site Scripting*: inyectar código JavaScript en una página que otros usuarios verán (por ejemplo, a través de un comentario). Se previene **escapando la salida**, usando `textContent` en vez de `innerHTML`, sanitizando HTML cuando es imprescindible (DOMPurify), con una **CSP** y cookies `HttpOnly`.",
    "codeSnippet": "div.innerHTML = comentario;                 // peligroso: <img src=x onerror=...>\ndiv.textContent = comentario;               // seguro: se trata como texto\ndiv.innerHTML = DOMPurify.sanitize(comentario);",
    "seniorTip": "",
    "tags": [
      "nivel-7",
      "dom",
      "javascript"
    ],
    "interactiveDemo": "console"
  },
  {
    "id": "P73",
    "level": 7,
    "levelTitle": "DOM y navegador",
    "question": "¿Diferencia entre `<script>`, `async` y `defer`?",
    "shortAnswer": "| Atributo | Descarga | Ejecución | Orden |",
    "explanation": "| Atributo | Descarga | Ejecución | Orden |\n|---|---|---|---|\n| (ninguno) | bloquea el parseo del HTML | inmediata | secuencial |\n| `async` | en paralelo | apenas descarga (puede interrumpir el parseo) | **no garantizado** |\n| `defer` | en paralelo | tras parsear el HTML, antes de `DOMContentLoaded` | **respeta el orden** |\n| `type=\"module\"` | en paralelo | como `defer` por defecto | respeta dependencias |\n\nRegla práctica: `defer` para scripts de la aplicación; `async` para scripts independientes (analítica).\n\n---",
    "codeSnippet": "",
    "seniorTip": "",
    "tags": [
      "async",
      "nivel-7",
      "dom",
      "javascript"
    ],
    "interactiveDemo": "console"
  }
];
