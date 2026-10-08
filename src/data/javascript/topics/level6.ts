import { JsTopic } from '@/types/javascript';

export const level6Topics: JsTopic[] = [
  {
    "id": "P56",
    "level": 6,
    "levelTitle": "ES6+ y módulos",
    "question": "¿Diferencia entre módulos ESM y CommonJS?",
    "shortAnswer": "**ESM (`import`/`export`)** es el estándar oficial de ECMAScript: tiene análisis estático en tiempo de compilación, admite *tree shaking*, *top-level await* y exporta **enlaces vivos (*live bindings*)**. **CommonJS (`require`/`module.exports`)** es el sistema histórico de Node.js: se evalúa dinámicamente en tiempo de ejecución, es sincrónico y copia valores por valor.",
    "explanation": `Comparación exhaustiva entre los dos sistemas modulares:

| Característica | ESM (\`import\` / \`export\`) | CommonJS (\`require\` / \`module.exports\`) |
|---|---|---|
| Análisis y Carga | **Estático** (se resuelve antes de ejecutar el código) | **Dinámico** (se resuelve en runtime donde se llame) |
| Asincronía | Nativa (soporta *Top-level await* en el nivel raíz) | Estrictamente síncrona |
| Optimización | Permite **Tree Shaking** automático en bundlers | Muy difícil o imposible de optimizar estáticamente |
| Enlace de exportaciones | **Live Bindings** (si el módulo exportador muta una variable, el importador ve el cambio) | **Copia por valor** (copia el estado en el instante del require) |
| Entorno por defecto | Modo estricto obligatorio (\`'use strict'\`), \`this === undefined\` | Objeto \`module.exports\` como \`this\` en nivel raíz |

Import dinámico en ESM:
ESM también admite carga bajo demanda con la función \`import('./modulo.js')\`, la cual retorna una Promesa, permitiendo *code splitting* y carga perezosa en React y Next.js.`,
    "codeSnippet": "// ESM (estándar oficial ECMAScript)\nexport const PI = 3.1416;\nexport default function area(r) { return PI * r ** 2; }\nimport area, { PI } from './geometria.js';\nconst modulo = await import('./pesado.js');   // import dinámico lazy\n\n// CommonJS (Node.js legacy)\nconst fs = require('fs');\nmodule.exports = { area };",
    "seniorTip": "En entrevistas, explica el concepto de 'Live Bindings': en ESM, import { count } no copia un número; crea un puntero de solo lectura a la variable original del módulo exportador. Si el módulo fuente tiene una función que incrementa count, el importador ve reflejado el nuevo valor sin tener que volver a importar.",
    "tags": [
      "nivel-6",
      "modulos",
      "esm",
      "commonjs",
      "javascript"
    ],
    "interactiveDemo": "console"
  },
  {
    "id": "P57",
    "level": 6,
    "levelTitle": "ES6+ y módulos",
    "question": "¿Qué son los *template literals* y los *tagged templates*?",
    "shortAnswer": "Los **template literals** son cadenas delimitadas por backticks (`` ` ``) que permiten interpolación de expresiones (`${expresion}`) y textos multilínea nativos. Los **tagged templates** son llamadas a funciones donde la plantilla se pasa como argumentos separados (un array de strings fijos y los valores interpolados), permitiendo procesar, transformar o sanitizar la cadena.",
    "explanation": `Mecanismo y aplicaciones en frameworks modernos:

1. **Template Literals Ordinarios:**
- Permiten escribir cadenas de múltiples líneas sin concatenar caracteres \`\\n\`.
- Evalúan cualquier expresión válida de JavaScript dentro de \`\${}\`: operaciones matemáticas, llamadas a funciones y operadores ternarios.

2. **Anatomía de un Tagged Template:**
- Definición de la función tag: \`function tag(strings, ...valores) { ... }\`
- Invocación sin paréntesis: \`tag\` seguido de la plantilla literal con backticks.
- \`strings\`: Array con los fragmentos de texto estáticos: \`['Hola ', ', tienes ', ' notificaciones']\`. Incluye además la propiedad \`strings.raw\` con las cadenas sin procesar escapes.
- \`...valores\`: Argumentos rest con las expresiones evaluadas: \`[nombre, mensajes]\`.

3. **Usos masivos en la industria:**
- **Estilos CSS-in-JS:** \`styled.div\` en styled-components y emotion.
- **Consultas GraphQL:** \`gql\` en Apollo Client para parsear queries en AST.
- **Prevención de SQL Injection y XSS:** Librerías de base de datos como Prisma o Slonik sanitizan parámetros interpolados usando tagged templates para evitar inyecciones maliciosas.`,
    "codeSnippet": "const nombre = 'Ana';\nconst mensaje = `Hola ${nombre},\nesto es multilínea y ${1 + 1} es una expresión`;\n\n// Tagged Template Function\nfunction resaltar(strings, ...valores) {\n  return strings.reduce((acc, s, i) => {\n    const val = valores[i] !== undefined ? `<b>${valores[i]}</b>` : '';\n    return acc + s + val;\n  }, '');\n}\n\nconst html = resaltar`Usuario ${nombre} tiene ${5} mensajes`;\nconsole.log(html); // 'Usuario <b>Ana</b> tiene <b>5</b> mensajes'",
    "seniorTip": "Pregunta típica de React/CSS: ¿Cómo funciona styled.button por debajo? Responde: 'Es una tagged template function que recibe las reglas CSS separadas de las funciones interpoladas de temas (props => props.color), generando dinámicamente clases CSS inyectadas en el DOM'.",
    "tags": [
      "nivel-6",
      "javascript",
      "es6",
      "template-literals"
    ],
    "interactiveDemo": "console"
  },
  {
    "id": "P58",
    "level": 6,
    "levelTitle": "ES6+ y módulos",
    "question": "¿Qué son iterables e iteradores?",
    "shortAnswer": "Un **iterable** es cualquier objeto que implementa el protocolo de iteración proveyendo un método `[Symbol.iterator]()`. Un **iterador** es el objeto devuelto por ese método, el cual cuenta con una función `.next()` que produce objetos con la forma `{ value: any, done: boolean }` hasta completar la secuencia.",
    "explanation": `El protocolo de iteración de ES6 en profundidad:

1. **El Contrato del Protocolo de Iteración:**
- **Objeto Iterable:** Objeto que posee la clave \`[Symbol.iterator]\`: una función sin argumentos que devuelve un objeto iterador.
- **Objeto Iterador:** Objeto que posee un método \`.next()\`:
  - Mientras haya elementos: \`{ value: elementoActual, done: false }\`.
  - Al culminar la colección: \`{ value: undefined, done: true }\`.

2. **Estructuras de datos iterables nativas:**
Arrays, Strings, Maps, Sets, \`TypedArrays\`, \`arguments\` y colecciones DOM (\`NodeList\`).
*(Nota crítica: Los objetos planos \`{}\` **NO son iterables** por defecto porque no definen un orden de recorrido universal).*

3. **Consumidores nativos de iterables:**
- Bucles \`for...of\`
- Operador Spread (\`[...iterable]\`, \`Math.max(...iterable)\`)
- Desestructuración de arrays (\`const [x, y] = iterable\`)
- Constructores: \`new Set(iterable)\`, \`new Map(iterable)\`
- Métodos estáticos: \`Promise.all(iterable)\``,
    "codeSnippet": "const rango = {\n  desde: 1, hasta: 3,\n  [Symbol.iterator]() {\n    let actual = this.desde, hasta = this.hasta;\n    return {\n      next: () => actual <= hasta\n        ? { value: actual++, done: false }\n        : { value: undefined, done: true }\n    };\n  },\n};\n\nconsole.log([...rango]); // [1, 2, 3]\nfor (const n of rango) console.log(n); // 1, 2, 3",
    "seniorTip": "Muestra maestría técnica explicando cómo hacer que un objeto propio sea iterable: basta con añadir *[Symbol.iterator]() { yield this.prop1; yield this.prop2; }. Esto permite usar for...of o [...miObjeto] directamente sobre tu modelo de dominio.",
    "tags": [
      "nivel-6",
      "javascript",
      "iteradores",
      "protocolos"
    ],
    "interactiveDemo": "console"
  },
  {
    "id": "P59",
    "level": 6,
    "levelTitle": "ES6+ y módulos",
    "question": "¿Qué son los generadores?",
    "shortAnswer": "Los **generadores** son funciones especiales declaradas con `function*` que pueden **pausar su ejecución** en cada instrucción `yield` y reanudarla posteriormente bajo demanda. Devuelven un objeto iterador y permiten la evaluación perezosa (*lazy evaluation*) de secuencias potencialmente infinitas.",
    "explanation": `Mecánica de ejecución y comunicación bidireccional:

1. **Evaluación Perezosa (*Lazy Evaluation*):**
A diferencia de una función ordinaria que corre de principio a fin de forma bloqueante, un generador no ejecuta su código al ser invocado; simplemente devuelve un objeto generador (que implementa el protocolo de iterador). El código solo avanza hasta el siguiente \`yield\` cada vez que el consumidor llama a \`.next()\`.

2. **Flujos infinitos sin desbordamiento de memoria:**
Un generador puede contener un bucle infinito \`while(true) { yield id++; }\` sin consumir la memoria del sistema ni congelar el hilo principal, porque solo produce un único valor cuando se lo solicitan.

3. **Comunicación bidireccional con \`.next(valor)\`:**
\`yield\` no solo emite valores hacia afuera; también puede **recibir valores** desde el exterior:
\`const input = yield 'esperando dato';\`
Al invocar \`gen.next('miDato')\`, ese valor se asigna a \`input\` dentro del generador.

4. **Uso histórico en asincronía:**
Antes de \`async/await\`, librerías como \`co\` y Redux-Saga utilizaban generadores con \`yield\` sobre promesas para escribir flujos asíncronos limpios.`,
    "codeSnippet": "function* idsInfinitos() {\n  let id = 1;\n  while (true) yield id++;\n}\nconst gen = idsInfinitos();\nconsole.log(gen.next().value); // 1\nconsole.log(gen.next().value); // 2\n\nfunction* tomar(n, iterable) {\n  let i = 0;\n  for (const x of iterable) {\n    if (i++ >= n) return;\n    yield x;\n  }\n}\nconsole.log([...tomar(3, idsInfinitos())]); // [1, 2, 3]",
    "seniorTip": "En una entrevista de arquitectura, cita Redux-Saga: explica cómo utiliza generadores para representar efectos secundarios (API calls, delays) como objetos planos descritos (yield call(fetchUser)), lo que hace que los tests unitarios sean extremadamente sencillos de probar con simples .next() sin necesidad de simular APIs complejas.",
    "tags": [
      "nivel-6",
      "javascript",
      "generadores",
      "yield"
    ],
    "interactiveDemo": "console"
  },
  {
    "id": "P60",
    "level": 6,
    "levelTitle": "ES6+ y módulos",
    "question": "¿Qué son `Proxy` y `Reflect`?",
    "shortAnswer": "`Proxy` permite envolver un objeto para interceptar y personalizar sus operaciones fundamentales (lectura de propiedades, escritura, eliminación, invocación). `Reflect` es un objeto global que provee los métodos equivalentes a las operaciones internas del lenguaje con retorno predecible, facilitando delegar el comportamiento predeterminado dentro del Proxy.",
    "explanation": `Metaprogramación y arquitectura reactiva moderna:

1. **Anatomía de un \`Proxy\`:**
\`const proxy = new Proxy(target, handler);\`
- \`target\`: El objeto original que se desea envolver.
- \`handler\`: Objeto contenedor de 'trampas' (*traps*) que interceptan operaciones:
  - \`get(target, prop, receiver)\`: Intercepta lecturas.
  - \`set(target, prop, value, receiver)\`: Intercepta asignaciones.
  - \`deleteProperty(target, prop)\`: Intercepta borrado con \`delete\`.
  - \`has(target, prop)\`: Intercepta el operador \`in\`.
  - \`apply(target, thisArg, argumentsList)\`: Intercepta llamadas a funciones.

2. **Por qué \`Reflect\` es el complemento indispensable:**
\`Reflect\` contiene los métodos espejo exactos de cada trampa del Proxy:
- Devuelve booleanos limpios en lugar de lanzar errores silenciosos (\`Reflect.set()\` retorna \`false\` si falla, permitiendo manejarlo sin \`try/catch\`).
- Soporta el parámetro \`receiver\`, garantizando que \`this\` apunte correctamente al Proxy en getters heredados.

3. **El motor de Reactividad de Vue 3:**
Vue 3 reemplazó los getters/setters de \`Object.defineProperty\` por \`Proxy\`. Esto le permite detectar automáticamente adición de nuevas propiedades, eliminación de propiedades y mutaciones en arrays (\`arr.push(1)\`) sin trucos auxiliares.`,
    "codeSnippet": "const validador = new Proxy({}, {\n  set(obj, prop, valor) {\n    if (prop === 'edad' && !Number.isInteger(valor)) {\n      throw new TypeError('La edad debe ser un número entero');\n    }\n    return Reflect.set(obj, prop, valor);\n  },\n  get(obj, prop) {\n    return prop in obj ? Reflect.get(obj, prop) : `propiedad_${String(prop)}_no_existe`;\n  },\n});\nvalidador.edad = 30; // Válido\n// validador.edad = 'treinta'; // Lanza TypeError",
    "seniorTip": "Ten presente la limitación de invariantes (Proxy Invariants): un Proxy no puede mentir sobre propiedades no configurables o no modificables del objeto target (por ejemplo, si una propiedad es writable: false, configurable: false, la trampa get está obligada a retornar el valor original o el motor arrojará un TypeError).",
    "tags": [
      "proxy",
      "nivel-6",
      "javascript",
      "metaprogramacion",
      "reflect"
    ],
    "interactiveDemo": "console"
  },
  {
    "id": "P61",
    "level": 6,
    "levelTitle": "ES6+ y módulos",
    "question": "¿Qué novedades útiles trajeron las versiones recientes (ES2022–ES2024)?",
    "shortAnswer": "Las versiones recientes han incorporado mejoras sustanciales: `Array.prototype.at()` (índices negativos), `Object.hasOwn()` y campos privados `#` (ES2022); métodos de array inmutables como `toSorted` y `toReversed` (ES2023); y `Object.groupBy()` junto a `Promise.withResolvers()` (ES2024).",
    "explanation": `Desglose de las adiciones modernas más útiles en producción:

1. **ES2022:**
- **\`.at(index)\` en Arrays y Strings:** Permite indexación negativa intuitiva: \`arr.at(-1)\` reemplaza al engorroso \`arr[arr.length - 1]\`.
- **\`Object.hasOwn(obj, prop)\`:** Reemplazo directo y seguro de \`obj.hasOwnProperty(prop)\`, inmune a objetos creados con \`Object.create(null)\` o propiedades sobrescritas.
- **Top-level await:** Permite usar \`await\` fuera de funciones \`async\` en el nivel raíz de módulos ESM.
- **Error Cause:** Encadenamiento de causas de error: \`new Error('Fallo de red', { cause: errOriginal })\`.

2. **ES2023:**
- **Métodos inmutables de Array:** \`toSorted()\`, \`toReversed()\`, \`toSpliced()\` y \`with(index, valor)\` devuelven copias transformadas sin mutar el array original.
- **\`findLast()\` y \`findLastIndex()\`:** Búsqueda optimizada desde el final hacia el inicio del array.

3. **ES2024:**
- **\`Object.groupBy(items, callback)\` y \`Map.groupBy()\`:** Agrupación nativa de colecciones sin requerir utilidades externas de Lodash ni reducers manuales.
- **\`Promise.withResolvers()\`:** Desestructura \`{ promise, resolve, reject }\` en una sola llamada limpia, eliminando la necesidad de guardar referencias al callback de \`new Promise\`.`,
    "codeSnippet": "[1, 2, 3].at(-1);                                    // 3 (ES2022)\nObject.hasOwn({ a: 1 }, 'a');                        // true (ES2022)\n[3, 1, 2].toSorted();                                // [1, 2, 3] inmutable (ES2023)\nObject.groupBy([{ g: 'a' }, { g: 'b' }], (x) => x.g); // { a: [...], b: [...] } (ES2024)\nconst { promise, resolve } = Promise.withResolvers(); // ES2024",
    "seniorTip": "Destacar Promise.withResolvers() y Object.groupBy() en una entrevista técnica demuestra que te mantienes al día con las especificaciones TC39 de última hornada. Demuestra cómo Object.groupBy(usuarios, u => u.rol) simplifica tareas complejas de manipulación de datos.",
    "tags": [
      "nivel-6",
      "javascript",
      "es2022",
      "es2023",
      "es2024"
    ],
    "interactiveDemo": "console"
  },
  {
    "id": "P62",
    "level": 6,
    "levelTitle": "ES6+ y módulos",
    "question": "¿Qué es el *tree shaking*?",
    "shortAnswer": "El **Tree Shaking** es una técnica de optimización ejecutada por empaquetadores modernos (Rollup, Webpack, Turbopack, esbuild) durante la compilación que analiza el grafo de dependencias y **elimina el código muerto (*dead code*) exportado que nunca llega a importarse o utilizarse en la aplicación**, reduciendo drásticamente el peso del bundle final.",
    "explanation": `Fundamento técnico y requisitos indispensables para que funcione:

1. **Por qué depende exclusivamente de ESM:**
Los módulos ES (\`import\`/\`export\`) tienen **estructura estática**: las importaciones no pueden ser condicionales ni incluir expresiones dinámicas dentro de \`if\`. Esto permite a los bundlers analizar todo el grafo de dependencias en tiempo de compilación sin ejecutar el código, identificando inequívocamente qué funciones o constantes no tienen ningún consumidor.
*(CommonJS no permite tree shaking eficaz porque \`require('./' + variable)\` es dinámico).*

2. **El peligro de los efectos secundarios (*Side Effects*):**
Un bundler no eliminará un módulo sin usar si sospecha que importarlo ejecuta código que modifica el entorno global (ej. polyfills, manipulación de \`window\` o CSS inyectado).
- Si la librería es pura, debe declarar en su \`package.json\`:
  \`"sideEffects": false\`
  Esto autoriza al bundler a descartar de forma segura cualquier archivo de la librería si ninguna de sus exportaciones es consumida.

3. **Buenas prácticas en el código:**
- Importar funciones nombradas específicas: \`import { debounce } from 'lodash-es'\` en vez de importar el objeto global \`import _ from 'lodash'\`.
- Evitar clases monolíticas masivas o exportaciones por defecto de grandes objetos con métodos.`,
    "codeSnippet": "// utils.js\nexport const formatearFecha = (d) => d.toISOString();\nexport const funcionPesadaNoUsada = () => { /* 50kb de lógica */ };\n\n// app.js\nimport { formatearFecha } from './utils.js';\n// El bundler descarta 'funcionPesadaNoUsada' del archivo final generado",
    "seniorTip": "El clásico error de novato en entrevistas es intentar hacer tree shaking con lodash: la librería clásica lodash está empaquetada en CommonJS, por lo que el bundler importará los 70KB completos. La solución correcta es migrar a lodash-es o librerías nativas modernas como es-toolkit.",
    "tags": [
      "nivel-6",
      "javascript",
      "tree-shaking",
      "bundlers",
      "rendimiento"
    ],
    "interactiveDemo": "console"
  }
];
