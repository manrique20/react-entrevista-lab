import { JsTopic } from '@/types/javascript';

export const level2Topics: JsTopic[] = [
  {
    "id": "P14",
    "level": 2,
    "levelTitle": "Funciones",
    "question": "¿Diferencia entre declaración, expresión de función y arrow function?",
    "shortAnswer": "Una **declaración** se eleva completamente (hoisting), tiene su propio `this` y `arguments`, y puede instanciarse con `new`. Una **expresión** se asigna a una variable y solo se eleva la variable. Una **arrow function** tiene `this` léxico heredado de su contexto padre, carece de `arguments`, `prototype` y no puede invocarse con `new`.",
    "explanation": `Comparativa técnica detallada:

| Característica | Declaración (\`function f(){}\`) | Expresión (\`const f = function(){}\`) | Arrow Function (\`const f = () => {}\`) |
|---|---|---|---|
| Hoisting | Completo (cuerpo y nombre utilizables antes) | Solo elevación de variable (TDZ con \`let\`/\`const\`) | Solo elevación de variable (TDZ con \`let\`/\`const\`) |
| Enlace \`this\` | Dinámico (determinado por el llamador) | Dinámico (determinado por el llamador) | **Léxico** (captura el \`this\` del ámbito contenedor) |
| Objeto \`arguments\` | Presente (\`arguments[0]\`) | Presente (\`arguments[0]\`) | **Ausente** (se debe usar \`...rest\`) |
| Constructor (\`new\`) | Sí (posee propiedad \`.prototype\`) | Sí (posee propiedad \`.prototype\`) | **No** (lanza \`TypeError: not a constructor\`) |
| Generadores | Sí (\`function*\`) | Sí (\`function*\`) | No |

¿Por qué importa en producción?
1. Las **arrow functions** eliminan los clásicos bugs de pérdida de contexto en callbacks y métodos asíncronos (como \`setTimeout\` o handlers de eventos en React/DOM).
2. Las **declaraciones** son útiles para organizar archivos exportando funciones arriba y definiendo implementaciones abajo gracias al hoisting completo.`,
    "codeSnippet": "function suma(a, b) { return a + b; }          // declaración\nconst resta = function (a, b) { return a - b; }; // expresión\nconst mult = (a, b) => a * b;                   // arrow (return implícito)\nconst crear = (id) => ({ id });                 // para devolver un objeto, paréntesis",
    "seniorTip": "En entrevistas, no te limites a decir 'la flecha es más corta'. Resalta que las arrow functions carecen de slot interno [[Construct]] (por eso consumen menos memoria por instancia al no crear un objeto prototype) y que jamás debes usar arrow functions como métodos de objetos literales si planeas acceder a propiedades hermanas mediante this.",
    "tags": [
      "hoisting",
      "nivel-2",
      "this",
      "javascript"
    ],
    "interactiveDemo": "console"
  },
  {
    "id": "P15",
    "level": 2,
    "levelTitle": "Funciones",
    "question": "¿Qué son parámetros por defecto, *rest* y *spread*?",
    "shortAnswer": "Los **parámetros por defecto** asignan valores cuando un argumento es `undefined`. El operador **rest (`...`)** agrupa múltiples argumentos sobrantes en un array genuino al final de los parámetros. El operador **spread (`...`)** expande elementos de un iterable u objeto en llamadas, arrays u objetos literales.",
    "explanation": `Desglose profundo de los tres mecanismos de ES6+:

1. **Parámetros por defecto (\`param = valorDefault\`):**
- Se evalúan en **tiempo de ejecución** cada vez que se llama a la función, no en tiempo de parseo.
- **Trampa crítica:** Solo se activan si el valor pasado es estrictamente \`undefined\`. Pasar \`null\`, \`false\`, \`0\` o \`""\` se considera un valor explícito y **no** dispara el default.
- Tienen su propio ámbito léxico intermedio (parámetro scope): \`function f(a = 1, b = a * 2)\` es válido, pero \`function f(a = b, b = 2)\` lanza un \`ReferenceError\` por la Zona Muerta Temporal (TDZ) entre parámetros.

2. **Parámetro Rest (\`...args\`):**
- Agrupa todos los argumentos no asignados en una instancia real de \`Array\`.
- Debe situarse obligatoriamente como el **último parámetro** de la función (\`(a, b, ...resto)\`).
- Reemplaza por completo al antiguo objeto \`arguments\`, permitiendo aplicar directamente métodos de array como \`.reduce()\`, \`.map()\` o \`.filter()\` y funcionando limpiamente con TypeScript.

3. **Operador Spread (\`...iterable\` / \`...objeto\`):**
- Realiza una expansión en caliente de colecciones iterables (arrays, strings, sets, maps) o propiedades enumerables propias de un objeto.
- **Copia superficial (*Shallow Copy*):** Duplica referencias en objetos anidados, no genera copias profundas.
- En objetos, el orden de escritura define la precedencia: \`{ ...base, activo: true }\` sobrescribe la propiedad si ya existía en \`base\`.`,
    "codeSnippet": "// Por defecto (se evalúan solo si el argumento es undefined)\nfunction saludar(nombre = 'invitado') { return `Hola ${nombre}`; }\nsaludar();            // 'Hola invitado'\nsaludar(null);        // 'Hola null' (null NO activa el default)\n\n// Rest: agrupa argumentos restantes en un array real\nfunction sumar(...nums) { return nums.reduce((a, b) => a + b, 0); }\nsumar(1, 2, 3);       // 6\n\n// Spread: expande un iterable\nconst a = [1, 2], b = [3];\nconst c = [...a, ...b];             // [1, 2, 3]\nMath.max(...c);                      // 3\nconst o2 = { ...{ x: 1 }, y: 2 };   // { x: 1, y: 2 }",
    "seniorTip": "En una entrevista Senior, subraya que saludar(null) NO activa el default porque null representa una ausencia de valor deliberada (truthy/falsy check vs undefined check). Asimismo, advierte que el spread masivo en arrays gigantes dentro de llamadas como Math.max(...granArray) puede desbordar la pila de llamadas (Maximum call stack size exceeded) por exceder el límite de argumentos del motor.",
    "tags": [
      "nivel-2",
      "javascript",
      "es6",
      "funciones"
    ],
    "interactiveDemo": "console"
  },
  {
    "id": "P16",
    "level": 2,
    "levelTitle": "Funciones",
    "question": "¿Qué es una función de orden superior?",
    "shortAnswer": "Una **función de orden superior** (HOF) es una función que recibe una o más funciones como argumentos, o devuelve una función como resultado. Esto es posible porque en JavaScript las funciones son ciudadanos de primera clase (*first-class citizens*).",
    "explanation": `Mecanismo y aplicaciones esenciales:

1. **Ciudadanos de primera clase (*First-Class Citizens*):**
En JavaScript, las funciones son objetos ordinarios que pueden asignarse a variables, guardarse en estructuras de datos, enviarse como parámetros a otras funciones y retornarse como valores.

2. **Tipos de Funciones de Orden Superior:**
- **Consumidoras de callbacks:** Métodos nativos de Array como \`.map()\`, \`.filter()\`, \`.reduce()\`, \`.find()\`, \`.some()\`, y temporizadores como \`setTimeout()\`.
- **Fábricas de funciones (*Function Factories*):** Funciones que retornan nuevas funciones configuradas a través de closures (como decoradores, middlewares, o generadores de multiplicadores).

3. **Beneficios en Arquitectura:**
- **Abstracción declarativa:** Oculta bucles imperativos manuales y mutaciones de estado intermedio.
- **Composabilidad y reutilización:** Permite crear pipelines de procesamiento de datos desacoplados y predecibles (fundamento de la programación funcional y de librerías como RxJS, Redux y lodash/fp).`,
    "codeSnippet": "const numeros = [1, 2, 3, 4, 5];\n\nnumeros.map((n) => n * 2);               // [2, 4, 6, 8, 10]\nnumeros.filter((n) => n % 2 === 0);      // [2, 4]\nnumeros.reduce((acc, n) => acc + n, 0);  // 15\n\n// Devuelve una función (factory)\nconst multiplicadorDe = (factor) => (n) => n * factor;\nconst doble = multiplicadorDe(2);\ndoble(7); // 14",
    "seniorTip": "Los evaluadores técnicos buscan que distingas entre una HOF y un callback: el callback es la función pasada; la HOF es la receptora o productora. En términos de rendimiento, advierte que crear HOFs y callbacks en línea dentro de bucles o renders de React crea nuevas asignaciones de memoria y referencias en cada ciclo.",
    "tags": [
      "nivel-2",
      "javascript",
      "funcional",
      "hof"
    ],
    "interactiveDemo": "console"
  },
  {
    "id": "P17",
    "level": 2,
    "levelTitle": "Funciones",
    "question": "¿Qué es un callback?",
    "shortAnswer": "Un **callback** es una función que se pasa como argumento a otra función para ser invocada posteriormente (síncrona o asíncronamente) una vez que se completa una rutina o evento.",
    "explanation": `Diferenciación y evolución en JavaScript:

1. **Callbacks Síncronos vs Asíncronos:**
- **Síncronos:** Se ejecutan de inmediato en el mismo turno del hilo de ejecución (ej. \`[1, 2].forEach(callback)\`).
- **Asíncronos:** Se colocan en la cola de tareas del Event Loop para ejecutarse tras la resolución de una operación I/O, temporizador o evento del DOM (ej. \`fetch\`, \`setTimeout\`).

2. **El problema del *Callback Hell* (Pirámide de la Perdición):**
Cuando múltiples tareas asíncronas dependen secuencialmente del resultado de la anterior, anidar callbacks crea código piramidal difícil de leer, con manejo de errores fragmentado e inversión de control (el llamador confía ciegamente en cuándo y cuántas veces el callback será ejecutado).

3. **Solución moderna:**
- ES6 introdujo **Promesas** (garantizan que la resolución ocurrirá una sola vez y unifican el manejo de errores con \`.catch()\`).
- ES2017 consolidó **\`async/await\`**, permitiendo estructurar lógica asíncrona de forma lineal y con bloques \`try/catch\` nativos.`,
    "codeSnippet": "// Síncrono\n[1, 2, 3].forEach((n) => console.log(n));\n\n// Asíncrono\nsetTimeout(() => console.log('después de 1s'), 1000);\n\n// Convención Node.js: error-first callback\nleerArchivo('a.txt', (err, datos) => {\n  if (err) return console.error(err);\n  console.log(datos);\n});",
    "seniorTip": "Menciona el concepto de 'Inversión de Control' (Inversion of Control): cuando pasas un callback a una librería de terceros, pierdes la certeza de si lo llamarán cero, una o diez veces, o si tragarán las excepciones. Las Promesas devuelven el control de la resolución a tu código.",
    "tags": [
      "async",
      "nivel-2",
      "javascript",
      "callbacks"
    ],
    "interactiveDemo": "console"
  },
  {
    "id": "P18",
    "level": 2,
    "levelTitle": "Funciones",
    "question": "¿Qué es una IIFE y para qué sirve?",
    "shortAnswer": "Una **IIFE** (*Immediately Invoked Function Expression*) es una función de JavaScript que se declara y se ejecuta en el mismo instante en que se define: `(function() { ... })()`. Se utilizaba históricamente para crear un ámbito local privado y evitar la contaminación del objeto global.",
    "explanation": `Anatomía y contexto histórico vs moderno:

1. **Sintaxis:**
- El primer par de paréntesis \`(function() { ... })\` convierte la declaración de función en una **expresión**, evitando un error sintáctico.
- El segundo par \`()\` al final ejecuta inmediatamente dicha expresión.
- Puede recibir parámetros: \`((window, document) => { ... })(window, document)\`.

2. **Problema que resolvía en la era pre-ES6:**
Antes de la llegada de \`let\`, \`const\` y los módulos ES (ESM), JavaScript solo tenía ámbito global y ámbito de función (\`var\`). Cualquier variable declarada en un script podía colisionar con variables de otros scripts en el objeto \`window\`. Las IIFE creaban una 'burbuja' de scope aislada (patrón Módulo clásico).

3. **Relevancia actual:**
Con los módulos ESM (\`import\`/\`export\`) donde cada archivo tiene su propio ámbito cerrado, las IIFE rara vez son necesarias. Sin embargo, aún se usan para:
- Ejecutar código asíncrono inmediato en el nivel superior (*top-level await* en entornos legacy).
- Empaquetadores y bundlers (generación de bundles UMD/IIFE para etiquetas \`<script>\`).`,
    "codeSnippet": "(function () {\n  const secreto = 'no accesible desde fuera';\n  console.log('me ejecuto ya');\n})();\n\nconst contador = (() => {\n  let n = 0;\n  return { inc: () => ++n, valor: () => n };\n})();\ncontador.inc();\ncontador.valor(); // 1",
    "seniorTip": "En una entrevista, explica que con ESM y top-level await nativo, las IIFE han pasado a ser una técnica de compatibilidad legacy. Si te piden un caso moderno, menciona la inicialización atómica de variables complejas en una sola expresión: const config = (() => { if (...) return a; return b; })();",
    "tags": [
      "scope",
      "nivel-2",
      "javascript",
      "iife"
    ],
    "interactiveDemo": "console"
  },
  {
    "id": "P19",
    "level": 2,
    "levelTitle": "Funciones",
    "question": "¿Qué es una función pura y por qué importa?",
    "shortAnswer": "Una **función pura** es aquella que, dado el mismo conjunto de argumentos, siempre devuelve el mismo resultado y **no produce efectos secundarios** observables (no muta variables externas, no altera sus argumentos y no hace I/O).",
    "explanation": `Principios fundamentales y beneficios en producción:

1. **Determinismo (Transparencia Referencial):**
\`f(x)\` siempre producirá exactamente \`y\`. Una llamada a la función puede ser reemplazada directamente por su valor de retorno sin cambiar el comportamiento del programa.

2. **Ausencia de efectos secundarios (*Side Effects*):**
Una función pura NO realiza:
- Mutaciones de variables globales o en ámbitos superiores.
- Mutaciones de los argumentos recibidos por referencia (\`arr.push()\` o \`arr.sort()\` son impuros; \`[...arr].sort()\` es puro).
- Solicitudes HTTP, lecturas/escrituras en disco o almacenamiento (\`localStorage\`).
- Invocaciones a funciones no deterministas (\`Math.random()\`, \`Date.now()\`).
- Modificaciones directas en el DOM.

3. **Por qué es el pilar de React y Redux:**
- **Previsibilidad y tests triviales:** No requiere mocks de servicios externos ni restablecimiento de estado global.
- **Memoización segura:** Como el resultado depende solo de los inputs, se puede cachear con \`useMemo\`, \`React.memo\` o selectores de Redux sin temor a datos desactualizados.
- **Concurrencia:** Al no compartir estado mutable, se evitan condiciones de carrera (*race conditions*).`,
    "codeSnippet": "// Impura (muta estado externo)\nlet total = 0;\nfunction agregar(n) { total += n; return total; }\n\n// Pura (determinista sin efectos colaterales)\nconst agregarPura = (total, n) => total + n;\n\n// Impura por mutar el argumento recibido\nconst ordenarMal = (arr) => arr.sort();\n// Pura (copia previa o métodos ES2023 toSorted)\nconst ordenarBien = (arr) => [...arr].sort();",
    "seniorTip": "Cita trampas comunes de impureza inadvertida en JavaScript: Array.prototype.sort(), splice() y reverse() mutan el array original en sitio (in-place). Para mantener pureza sin librerías externas en ES2023+, usa los nuevos métodos inmutables: toSorted(), toSpliced(), toReversed() y with().",
    "tags": [
      "nivel-2",
      "javascript",
      "funcional",
      "inmutabilidad"
    ],
    "interactiveDemo": "console"
  },
  {
    "id": "P20",
    "level": 2,
    "levelTitle": "Funciones",
    "question": "¿Qué es *currying* y qué es composición?",
    "shortAnswer": "**Currying** descompone una función de múltiples argumentos `f(a, b, c)` en una secuencia de funciones unarias anidadas `f(a)(b)(c)`. La **composición** une dos o más funciones de modo que la salida de una sea la entrada de la siguiente: `(f ∘ g)(x) = f(g(x))`.",
    "explanation": `Detalles técnicos y aplicación práctica:

1. **Currying:**
Permite la **aplicación parcial** de argumentos: puedes preconfigurar parámetros fijos (ej. un logger con un prefijo predefinido o un conversor de divisas con una tasa fijada) y reutilizar la función resultante pasando solo los argumentos variables restantes.

2. **Composición de funciones:**
- **Composición matemática (\`compose\`):** Se evalúa de derecha a izquierda: \`compose(f, g)(x) => f(g(x))\`.
- **Pipeline (\`pipe\`):** Se evalúa de izquierda a derecha (más intuitivo): \`pipe(f, g)(x) => g(f(x))\`.
- En JavaScript se implementa limpiamente combinando *rest parameters* con \`Array.prototype.reduceRight\` (para compose) o \`Array.prototype.reduce\` (para pipe).

3. **Ventajas en arquitectura:**
Fomenta el principio de responsabilidad única (SRP), permitiendo construir utilidades complejas ensamblando pequeñas funciones puras y reutilizables sin crear variables temporales intermedias.`,
    "codeSnippet": "const sumar = (a) => (b) => (c) => a + b + c;\nsumar(1)(2)(3); // 6\n\nconst compose = (...fns) => (x) => fns.reduceRight((acc, fn) => fn(acc), x);\nconst pipe = (...fns) => (x) => fns.reduce((acc, fn) => fn(acc), x);\n\nconst limpiar = pipe(\n  (s) => s.trim(),\n  (s) => s.toLowerCase(),\n  (s) => s.replace(/\\s+/g, '-')\n);\nlimpiar('  Hola Mundo JS '); // 'hola-mundo-js'",
    "seniorTip": "Explica la diferencia entre currying estricto (que siempre transforma en funciones de 1 solo argumento a la vez) y aplicación parcial (que permite fijar algunos argumentos arbitrarios dejando otros pendientes). Menciona cómo librerías como Ramda o lodash/fp automatizan el auto-currying.",
    "tags": [
      "nivel-2",
      "javascript",
      "currying",
      "composicion"
    ],
    "interactiveDemo": "console"
  },
  {
    "id": "P21",
    "level": 2,
    "levelTitle": "Funciones",
    "question": "¿Qué es el objeto `arguments`?",
    "shortAnswer": "`arguments` es un objeto *array-like* implícito disponible dentro de funciones tradicionales (declaraciones y expresiones) que contiene todos los argumentos pasados a la llamada. En JavaScript moderno ha sido reemplazado por `...rest`.",
    "explanation": `Características técnicas y razones de su obsolescencia:

1. **Naturaleza *Array-like* (Similar a un Array):**
- Posee la propiedad \`.length\` y acceso por índices numéricos (\`arguments[0]\`, \`arguments[1]\`), pero **no hereda de \`Array.prototype\`**.
- Carece de métodos nativos como \`.map()\`, \`.filter()\`, \`.forEach()\` o \`.reduce()\`. Para utilizarlos en código heredado, era obligatorio convertirlo manualmente: \`Array.from(arguments)\` o \`Array.prototype.slice.call(arguments)\`.

2. **Incompatibilidad con Arrow Functions:**
Las arrow functions **no tienen objeto \`arguments\` propio**. Si intentas acceder a \`arguments\` dentro de una arrow function, resolverá la referencia en el scope léxico exterior (si existe).

3. **Vínculo bizarro con parámetros nombrados (sin strict mode):**
En modo no estricto, mutar \`arguments[0]\` alteraba el valor del primer parámetro nombrado y viceversa, lo que impedía optimizaciones del compilador JIT (V8).

4. **Por qué \`...rest\` es la solución definitiva:**
- Produce una instancia genuina de \`Array\`.
- Funciona uniformemente en funciones tradicionales y arrow functions.
- Admite tipado directo en TypeScript (\`(...args: number[]) => ...\`).`,
    "codeSnippet": "function vieja() {\n  console.log(arguments.length);          // 3\n  console.log(Array.from(arguments));     // [1, 2, 3] (convertir a array)\n  // arguments.map(...) → TypeError: no es un array\n}\nvieja(1, 2, 3);\n\nconst flecha = () => { /* arguments no existe aquí; usar ...args */ };",
    "seniorTip": "Menciona que el uso de arguments desoptimizaba funciones en versiones tempranas del motor V8 (evitaba el inlining por parte de Crankshaft/TurboFan). Hoy en día, escribir ...args no solo es sintácticamente más limpio, sino que permite al compilador JIT asignar memoria para arrays tipados de forma predecible.",
    "tags": [
      "nivel-2",
      "javascript",
      "array",
      "arguments"
    ],
    "interactiveDemo": "console"
  }
];
