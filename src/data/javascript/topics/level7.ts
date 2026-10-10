import { JsTopic } from '@/types/javascript';

export const level7Topics: JsTopic[] = [
  {
    "id": "P63",
    "level": 7,
    "levelTitle": "DOM & Browser APIs",
    "question": "What are bubbling, capturing, and event delegation?",
    "shortAnswer": "DOM event propagation consists of 3 phases: **Capturing** (the event descends from `window` down to the target element), **Target**, and **Bubbling** (the event ascends from the target back up to `window`). **Event delegation** leverages bubbling by attaching a single listener on a common ancestor to manage events across multiple current and future child elements.",
    "explanation": `Mechanics and architecture of event propagation:

1. **The 3 W3C Event Flow Phases:**
- **Phase 1 (Capturing):** The event travels downward: \`window\` → \`document\` → \`<html>\` → \`<body>\` → ... → target element. Activated by passing \`{ capture: true }\` to \`addEventListener\`.
- **Phase 2 (Target):** The event reaches the exact node that initiated the interaction (\`e.target\`).
- **Phase 3 (Bubbling):** The event bubbles upward through ancestor nodes back to \`window\`. This is the default phase for \`addEventListener\`.

2. **\`e.target\` vs \`e.currentTarget\` (Key Distinction):**
- **\`e.target\`:** The exact element that triggered the event (e.g., an inner \`<span>\` or \`<button>\`).
- **\`e.currentTarget\`:** The container element to which the listener is attached (\`this\`).

3. **The Event Delegation Pattern:**
In lists with hundreds of dynamic rows (\`<ul>\` with thousands of \`<li>\` items), attaching individual listeners consumes excessive memory and requires reattaching listeners whenever nodes are added. Delegation places a single listener on \`<ul>\` and resolves the clicked child item using \`e.target.closest('li')\`.`,
    "codeSnippet": "document.querySelector('#list').addEventListener('click', (e) => {\n  const item = e.target.closest('li[data-id]');   // e.target: element that originated the event\n  if (!item || !e.currentTarget.contains(item)) return;\n  console.log('Clicked element with ID:', item.dataset.id);\n});\n\n// Advanced addEventListener options:\nel.addEventListener('click', fn, { capture: true });  // Listen during capture phase\nel.addEventListener('click', fn, { once: true });     // Auto-remove after 1 execution\nel.addEventListener('scroll', fn, { passive: true });  // Performance: won't call preventDefault",
    "seniorTip": "Mention how React handles synthetic event delegation (SyntheticEvents): prior to React 17, it delegated all events to document; starting in React 17, it attaches them to the root DOM container of the app, allowing multiple React micro-frontends to coexist cleanly on the same page.",
    "tags": [
      "level-7",
      "dom",
      "events",
      "delegation",
      "javascript"
    ],
    "interactiveDemo": "console"
  },
  {
    "id": "P64",
    "level": 7,
    "levelTitle": "DOM & Browser APIs",
    "question": "What is the difference between `stopPropagation`, `stopImmediatePropagation`, and `preventDefault`?",
    "shortAnswer": "`preventDefault()` cancels the browser's default action (such as submitting a form or navigating a link) without halting event propagation. `stopPropagation()` prevents the event from bubbling or capturing further along the DOM hierarchy. `stopImmediatePropagation()` stops propagation and additionally halts execution of any other listeners registered on that exact same element.",
    "explanation": `Functional comparison of the three event control methods:

1. **\`event.preventDefault()\`:**
- **What it does:** Suppresses the browser's native default behavior (e.g., page reloads on \`<form submit>\`, navigation on \`<a href>\`, or toggling \`<input type="checkbox">\`).
- **What it does NOT do:** It does not halt propagation; parent elements will still receive the event during bubbling.
- **Check:** \`event.defaultPrevented\` returns \`true\` if default behavior was cancelled.

2. **\`event.stopPropagation()\`:**
- **What it does:** Halts event traversal at the current node. No ancestor during bubbling (or descendant during capturing) will receive the event.
- **Limitation:** If multiple listeners are attached to the same element for the same event (\`el.addEventListener('click', fn1)\` and \`el.addEventListener('click', fn2)\`), \`fn2\` will still execute.

3. **\`event.stopImmediatePropagation()\`:**
- **What it does:** Halts propagation to parent elements AND immediately terminates execution of any subsequent listeners registered on this same element.`,
    "codeSnippet": "button.addEventListener('click', (e) => {\n  e.preventDefault();              // Prevents default behavior\n  e.stopPropagation();             // Does not bubble to parents\n});\n\nbutton.addEventListener('click', (e) => {\n  e.stopImmediatePropagation();    // Prevents other listeners on this button from running\n});",
    "seniorTip": "Avoid abusing stopPropagation() in libraries or reusable components: breaking global bubbling can disable analytics tools (like Google Analytics or Hotjar), click-outside dropdown detectors, and design system components.",
    "tags": [
      "level-7",
      "javascript",
      "events",
      "dom"
    ],
    "interactiveDemo": "console"
  },
  {
    "id": "P65",
    "level": 7,
    "levelTitle": "DOM & Browser APIs",
    "question": "What is the difference between `localStorage`, `sessionStorage`, cookies, and IndexedDB?",
    "shortAnswer": "`localStorage` stores up to ~5MB of key-value string pairs persistently across sessions. `sessionStorage` stores ~5MB scoped to a single tab until it closes. **Cookies** (~4KB) are sent automatically in HTTP headers on requests and are standard for authentication with `HttpOnly`. **IndexedDB** is an asynchronous, transactional client-side NoSQL database storing hundreds of megabytes of structured data.",
    "explanation": `Comprehensive web storage matrix:

| Storage | Capacity | Lifecycle | Accessible via JS | Sent to Server | Data Model |
|---|---|---|---|---|---|
| \`localStorage\` | ~5 MB | Persistent (until manual clear) | **Yes** | No | Synchronous key-value pairs (strings only) |
| \`sessionStorage\` | ~5 MB | Tab/session duration | **Yes** | No | Synchronous key-value pairs (strings only) |
| Cookies | ~4 KB | Configurable (\`Expires\`/\`Max-Age\`) | No if \`HttpOnly\` | **Yes** (on every HTTP request) | Key-value pairs in headers |
| IndexedDB | Hundreds of MB (disk quota) | Persistent | **Yes** | No | Asynchronous transactional NoSQL with indexes |

Critical Security (JWT Tokens):
Never store sensitive authentication tokens in \`localStorage\`: any Cross-Site Scripting (XSS) vulnerability allows attackers to extract them via \`localStorage.getItem('token')\`. OWASP recommends storing auth tokens in cookies with \`HttpOnly\`, \`Secure\`, and \`SameSite=Lax/Strict\` attributes.`,
    "codeSnippet": "localStorage.setItem('theme', 'dark');\nconst user = JSON.parse(localStorage.getItem('user') ?? 'null');\n\n// Secure cookie configured from HTTP server:\n// Set-Cookie: token=xyz; Secure; HttpOnly; SameSite=Strict; Max-Age=3600\n\n// Client-side cookie (lacks HttpOnly protection):\ndocument.cookie = 'preference=compact; max-age=86400; path=/; SameSite=Lax';",
    "seniorTip": "Emphasize that localStorage and sessionStorage are synchronous, blocking APIs on the main thread. Reading or parsing large JSON payloads in localStorage causes perceptible UI jank. For large datasets or offline caching, use IndexedDB or clean wrappers like idb or localForage.",
    "tags": [
      "level-7",
      "javascript",
      "storage",
      "cookies",
      "security"
    ],
    "interactiveDemo": "console"
  },
  {
    "id": "P66",
    "level": 7,
    "levelTitle": "DOM & Browser APIs",
    "question": "How does `fetch` work and what is its main trap?",
    "shortAnswer": "`fetch()` returns a Promise that **only rejects on network-level transport errors** (disconnection, failed DNS lookup). Responses with HTTP error status codes like 404 Not Found or 500 Internal Server Error **resolve successfully**; checking the boolean `res.ok` (or `res.status`) property is mandatory.",
    "explanation": `Two-phase lifecycle of \`fetch\` and critical pitfalls:

1. **Two-Phase Body Consumption:**
\`fetch()\` resolves as soon as the server responds with **HTTP headers**. To read the response body, you must call a second asynchronous method that consumes the stream:
- \`await res.json()\`
- \`await res.text()\`
- \`await res.blob()\`
*(Important: the response body stream can only be read once).*

2. **The \`res.ok\` Pitfall:**
\`\`\`js
const res = await fetch('/api/data');
if (!res.ok) { // res.ok is true only for HTTP 200-299 status codes
  throw new Error(\`HTTP Failure: \${res.status} \${res.statusText}\`);
}
const data = await res.json();
\`\`\`

3. **Handling Cross-Origin Cookies:**
By default, cross-origin requests do not include cookies unless configured with \`credentials: 'include'\` (or \`'same-origin'\`).`,
    "codeSnippet": "async function postData(url, data) {\n  const res = await fetch(url, {\n    method: 'POST',\n    headers: { 'Content-Type': 'application/json' },\n    body: JSON.stringify(data),\n    credentials: 'include',      // send cookies on cross-origin requests\n  });\n  if (!res.ok) throw new Error(`HTTP Error: ${res.status}`);\n  return res.json();\n}",
    "seniorTip": "In a technical interview comparing fetch with axios, highlight that axios automatically rejects on status codes >= 400 and transparently serializes JSON, whereas with fetch you must build an enterprise wrapper to handle res.ok, timeouts with AbortSignal.timeout(), and serialization.",
    "tags": [
      "level-7",
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
    "levelTitle": "DOM & Browser APIs",
    "question": "What is CORS and why does it happen?",
    "shortAnswer": "The **Same-Origin Policy** (SOP) is a browser security rule preventing scripts from one origin from accessing data from another origin (differing protocol, domain, or port). **CORS** (*Cross-Origin Resource Sharing*) is the mechanism by which the **server explicitly grants permission** via HTTP headers declaring which external origins are allowed to read its responses.",
    "explanation": `Security mechanism and the Preflight process:

1. **What Defines an Origin:**
Protocol + Domain + Port (e.g., \`https://myapp.com:443\`). If any of the three differ, the request is Cross-Origin.

2. **CORS is Enforced by the BROWSER, Not the Server:**
The server processes the request regardless; it is the browser that blocks JavaScript access to the response if required CORS headers are missing. Backend tools like \`curl\` or Postman do not enforce CORS and receive responses normally.

3. **Simple Requests vs Preflight Requests (\`OPTIONS\`):**
If a request uses methods like \`PUT\`, \`DELETE\` or non-simple headers (\`Content-Type: application/json\`, \`Authorization: Bearer\`), the browser sends an initial **\`OPTIONS\` (Preflight)** request to confirm whether the server authorizes the action before dispatching the actual request.

4. **Key Server Headers:**
- \`Access-Control-Allow-Origin: https://myapp.com\` (or \`*\` if public without credentials).
- \`Access-Control-Allow-Methods: GET, POST, PUT, DELETE\`.
- \`Access-Control-Allow-Headers: Content-Type, Authorization\`.
- \`Access-Control-Allow-Credentials: true\` (required when transmitting cookies).`,
    "codeSnippet": "// Example CORS headers in Node/Express:\n// app.use(cors({\n//   origin: 'https://myapp.com',\n//   credentials: true,\n//   methods: ['GET', 'POST', 'PUT', 'DELETE'],\n// }));\n\n// On the client, make the standard fetch call;\n// If CORS fails, the fix MUST be applied on the server",
    "seniorTip": "The definitive interview answer to 'How do you fix a CORS error from the frontend?': 'A CORS error CANNOT be fixed purely in client JavaScript; it must be configured on the server serving the API or routed through a reverse proxy (such as Next.js API Routes or Nginx) to make the call same-origin.'",
    "tags": [
      "level-7",
      "dom",
      "javascript",
      "cors",
      "security"
    ],
    "interactiveDemo": "console"
  },
  {
    "id": "P68",
    "level": 7,
    "levelTitle": "DOM & Browser APIs",
    "question": "What is debounce and what is throttle?",
    "shortAnswer": "**Debounce** delays the execution of a function until a specified period of **total inactivity** has elapsed with no new events (ideal for search inputs). **Throttle** limits execution frequency, ensuring the function runs at most **once every X milliseconds** (ideal for continuous events like scroll or window resize).",
    "explanation": `Mental models and implementations:

1. **Debounce (Search Inputs, Autosave, Form Validation):**
- On every event, **cancels the existing timer and sets a new one**.
- Only after the user stops triggering events for $N$ milliseconds (e.g., pauses typing), the function executes once.

2. **Throttle (Scroll, Window Resize, Mouse Dragging):**
- When events fire rapidly (e.g., 60 times per second), throttle guarantees execution at regular, spaced intervals (e.g., every 100ms), discarding intermediate triggers.

3. **When to Apply Each:**
- **Debounce:** Search input ('wait until typing stops before querying the API').
- **Throttle:** Scroll listener ('update reading progress bar at most 10 times per second').`,
    "codeSnippet": "// Clean Debounce Implementation:\nfunction debounce(fn, ms) {\n  let timer;\n  return (...args) => {\n    clearTimeout(timer);\n    timer = setTimeout(() => fn(...args), ms);\n  };\n}\n\n// Clean Throttle Implementation:\nfunction throttle(fn, ms) {\n  let active = false;\n  return (...args) => {\n    if (active) return;\n    fn(...args);\n    active = true;\n    setTimeout(() => { active = false; }, ms);\n  };\n}",
    "seniorTip": "In React, when using debounce inside a functional component, always wrap it in useCallback or useRef to prevent the debounced function from being recreated on every render, which would reset the internal timer and break debouncing.",
    "tags": [
      "level-7",
      "debounce",
      "throttle",
      "optimization",
      "javascript"
    ],
    "interactiveDemo": "console"
  },
  {
    "id": "P69",
    "level": 7,
    "levelTitle": "DOM & Browser APIs",
    "question": "What are reflow and repaint? What is `requestAnimationFrame` used for?",
    "shortAnswer": "**Reflow** (or Layout) recalculates element geometry, positions, and dimensions across the page (computationally expensive). **Repaint** redraws visual pixels (colors, backgrounds, shadows) without changing geometries. `requestAnimationFrame` synchronizes visual mutations with the monitor refresh rate (60Hz/120Hz) immediately prior to painting.",
    "explanation": `Browser rendering pipeline and avoiding Layout Thrashing:

1. **Browser Rendering Pipeline:**
JavaScript → Style (CSS Calculation) → **Layout (Reflow)** → **Paint (Repaint)** → Composite (GPU Compositing).

2. **Expensive vs GPU-Accelerated Properties:**
- Trigger **Reflow + Repaint**: Changes to \`width\`, \`height\`, \`margin\`, \`padding\`, \`top\`, \`fontSize\`.
- Trigger **Repaint Only**: Changes to \`color\`, \`background-color\`, \`visibility\`.
- **GPU-Accelerated (No Reflow or Repaint)**: \`transform\` (translate, scale) and \`opacity\`. These are the recommended properties for smooth 60 FPS animations.

3. **Layout Thrashing (Interleaved Reads and Writes):**
Reading layout properties (\`offsetWidth\`, \`scrollTop\`, \`getBoundingClientRect\`) forces an immediate synchronous reflow if preceded by DOM writes. Always batch all reads first, then batch writes.`,
    "codeSnippet": "// Bad (Layout Thrashing: 1 forced reflow per iteration):\nitems.forEach((el) => { el.style.width = el.offsetWidth * 2 + 'px'; });\n\n// Good: batch reads first, then writes\nconst widths = items.map((el) => el.offsetWidth);\nitems.forEach((el, i) => { el.style.width = widths[i] * 2 + 'px'; });\n\n// Smooth 60fps animation with rAF and GPU transform:\nfunction animate() {\n  box.style.transform = `translateX(${x++}px)`;\n  if (x < 300) requestAnimationFrame(animate);\n}\nrequestAnimationFrame(animate);",
    "seniorTip": "Mention will-change: transform: it informs the browser ahead of time to promote an element to its own GPU Compositor Layer, preventing main-thread repaints during complex animations.",
    "tags": [
      "level-7",
      "dom",
      "performance",
      "reflow",
      "javascript"
    ],
    "interactiveDemo": "console"
  },
  {
    "id": "P70",
    "level": 7,
    "levelTitle": "DOM & Browser APIs",
    "question": "What is `IntersectionObserver`?",
    "shortAnswer": "`IntersectionObserver` is a modern browser API that asynchronously detects when a DOM element enters or leaves the visible viewport or a specified ancestor container. It replaces the need to listen to continuous `scroll` events and calculate expensive element coordinates using `getBoundingClientRect`.",
    "explanation": `Performance benefits and production use cases:

1. **Why it revolutionized frontend performance:**
Traditionally, checking whether an image was visible required \`window.addEventListener('scroll', ...)\`. This choked the main thread with dozens of \`getBoundingClientRect()\` calls per second, inducing layout thrashing. \`IntersectionObserver\` computes intersections off the main thread inside browser engine internals.

2. **Essential Production Use Cases:**
- **Lazy Loading of Images & Videos:** Defer asset loading until elements are about to enter viewport.
- **Infinite Scrolling:** Detect when an invisible sentinel element at the bottom of a list enters view to fetch the next batch.
- **Scroll Reveal Animations:** Trigger CSS entrance animations as sections enter view.
- **Ad Viewability Metrics:** Accurately measure genuine impression time of ad units.`,
    "codeSnippet": "const observer = new IntersectionObserver((entries, obs) => {\n  entries.forEach((entry) => {\n    if (entry.isIntersecting) {\n      const img = entry.target;\n      img.src = img.dataset.src;      // Load actual image\n      obs.unobserve(img);             // Unobserve once loaded\n    }\n  });\n}, { rootMargin: '200px' });          // Preload 200px before entering viewport\n\ndocument.querySelectorAll('img[data-src]').forEach((img) => observer.observe(img));",
    "seniorTip": "In Next.js and React, the <Image /> component leverages IntersectionObserver by default. When configuring observers, take advantage of rootMargin: '200px' to trigger loading 200 pixels before the user scrolls to the element, ensuring assets are loaded before entering view.",
    "tags": [
      "level-7",
      "javascript",
      "intersection-observer",
      "lazy-loading"
    ],
    "interactiveDemo": "console"
  },
  {
    "id": "P71",
    "level": 7,
    "levelTitle": "DOM & Browser APIs",
    "question": "What are Web Workers and Service Workers?",
    "shortAnswer": "**Web Workers** run computationally intensive JavaScript tasks in a **secondary background thread**, preventing UI freezes on the main thread. **Service Workers** act as a **programmable network proxy** between the browser and the network, enabling offline caching, push notifications, and Progressive Web App (PWA) features.",
    "explanation": `Technical comparison of worker types:

1. **Web Workers (Dedicated Workers):**
- **Purpose:** Parallelism for CPU-intensive computing (image/audio manipulation, compression, large JSON parsing, cryptography, or physics engines).
- **Constraints:** No access to the DOM, \`window\`, or \`document\`. Communicate with the main thread via asynchronous message passing (\`postMessage\` and \`onmessage\`).
- **Memory Transfer:** Support *Transferable Objects* (\`ArrayBuffer\`) to transfer ownership of memory buffers with zero cloning overhead ($O(1)$).

2. **Service Workers:**
- **Purpose:** Network resilience and Progressive Web App (PWA) workflows.
- **Lifecycle:** \`install\`, \`activate\`, and network request interception (\`fetch\`).
- **Offline Caching:** Serve entire applications offline by querying the Cache Storage API.`,
    "codeSnippet": "// Web Worker usage:\nconst worker = new Worker('calculator.js');\nworker.postMessage({ numbers: [1, 2, 3, 4] });\nworker.onmessage = (e) => console.log('Result from worker thread:', e.data);\n\n// calculator.js (background thread without DOM access):\nself.onmessage = (e) => {\n  const sum = e.data.numbers.reduce((a, b) => a + b, 0);\n  self.postMessage(sum);\n};",
    "seniorTip": "If asked in an interview how to resolve UI lag caused by parsing a 100 MB Excel or CSV file in the browser, the correct architectural solution is delegating parsing to a Web Worker bundled with Vite or Webpack.",
    "tags": [
      "level-7",
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
    "levelTitle": "DOM & Browser APIs",
    "question": "What is XSS and how is it prevented?",
    "shortAnswer": "**XSS (*Cross-Site Scripting*)** is a vulnerability where an attacker injects malicious JavaScript into a web application that executes in the browsers of other users. It is prevented by **escaping output data**, using `textContent` instead of `innerHTML`, sanitizing with libraries like DOMPurify, enforcing a **Content Security Policy (CSP)**, and setting `HttpOnly` on session cookies.",
    "explanation": `XSS attack vectors and defense-in-depth:

1. **XSS Attack Categories:**
- **Stored XSS:** Malicious payload is saved permanently in the database (e.g., a comment with \`<script src=\"malicious.js\"></script>\`). Every user viewing the comment executes the payload.
- **Reflected XSS:** Payload travels in URL parameters and the server reflects it unsanitized into the HTML response.
- **DOM-based XSS:** Occurs entirely client-side when reading untrusted sources (\`location.hash\`) and writing into unsafe sinks (\`element.innerHTML\` or \`eval()\`).

2. **Defense Strategies:**
- **Avoid Unsafe Sinks:** Avoid \`innerHTML\`, \`outerHTML\`, or \`document.write\`. Prefer \`textContent\`, \`innerText\`, or safe DOM node creation APIs.
- **Strict Sanitization:** When rendering rich HTML (e.g., a WYSIWYG editor), always sanitize inputs with **DOMPurify**.
- **Content Security Policy (CSP):** HTTP header restricting allowable script execution domains (\`Content-Security-Policy: default-src 'self'\`).
- **Session Protection:** Mark session cookies as \`HttpOnly\` to block extraction via \`document.cookie\`.`,
    "codeSnippet": "const userInput = '<img src=x onerror=\"alert(1)\">';\n\n// VULNERABLE to XSS:\ndiv.innerHTML = userInput;                   // Executes injected script\n\n// NATIVE SAFE:\ndiv.textContent = userInput;                 // Rendered purely as visible plain text\n\n// SAFE for rich HTML:\ndiv.innerHTML = DOMPurify.sanitize(userInput); // Strips dangerous elements and handlers",
    "seniorTip": "In React, JSX automatically escapes strings to defend against XSS. That is why the property to inject raw HTML was deliberately named dangerouslySetInnerHTML, serving as an explicit warning in code reviews that prior sanitization with DOMPurify is required.",
    "tags": [
      "level-7",
      "dom",
      "javascript",
      "security",
      "xss"
    ],
    "interactiveDemo": "console"
  },
  {
    "id": "P73",
    "level": 7,
    "levelTitle": "DOM & Browser APIs",
    "question": "What is the difference between `<script>`, `async`, and `defer`?",
    "shortAnswer": "A standard `<script>` pauses HTML parsing while downloading and executing. `async` downloads the script in parallel and executes it **the moment download completes** (interrupting HTML parsing with no guaranteed execution order). `defer` downloads in parallel and executes **only after HTML parsing is complete**, strictly preserving document script order.",
    "explanation": `Comparison of script loading and execution behavior:

| Attribute | Download | Execution Time | Execution Order | Recommended Use |
|---|---|---|---|---|
| \`<script>\` | Blocks HTML parsing | Immediate (blocking) | Sequential | Legacy scripts or essential inline bootstrapper |
| \`<script async>\` | Parallel (non-blocking) | Immediately on download (interrupts parsing) | **Non-guaranteed** (fastest download executes first) | Independent analytics, ads |
| \`<script defer>\` | Parallel (non-blocking) | After HTML parsing finishes, before \`DOMContentLoaded\` | **Guaranteed in declaration order** | Core application scripts depending on the DOM or each other |
| \`<script type=\"module\">\` | Parallel | Behaves as \`defer\` by default | Respects dependency graph | Modern ESM scripts |

Golden Rule: For application code where execution order matters and the DOM is queried, use **\`defer\`**; for decoupled third-party tracking tags, use **\`async\`**.`,
    "codeSnippet": "<!-- Blocks rendering (anti-pattern): -->\n<script src=\"app.js\"></script>\n\n<!-- For independent third-party analytics: -->\n<script async src=\"https://analytics.com/tag.js\"></script>\n\n<!-- For application scripts (recommended): -->\n<script defer src=\"vendor.js\"></script>\n<script defer src=\"app.js\"></script>",
    "seniorTip": "Keep in mind that modern browsers execute <script type=\"module\"> with deferred behavior by default, so adding the defer attribute explicitly to ES module tags is unnecessary.",
    "tags": [
      "async",
      "level-7",
      "dom",
      "performance",
      "scripts"
    ],
    "interactiveDemo": "console"
  }
];
