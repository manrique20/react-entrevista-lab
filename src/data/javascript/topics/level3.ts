import { JsTopic } from '@/types/javascript';

export const level3Topics: JsTopic[] = [
  {
    "id": "P22",
    "level": 3,
    "levelTitle": "Scope, closures y `this`",
    "question": "¿Qué es el scope y qué tipos hay?",
    "shortAnswer": "El **scope** es el contexto o alcance léxico que determina la visibilidad y ciclo de vida de las variables. En JavaScript existen 4 scopes: **global**, de **módulo**, de **función** y de **bloque** (`let`/`const`). JavaScript utiliza **ámbito léxico (*lexical scope*)**: la resolución de variables depende de dónde se declaró la función en el código fuente, no de dónde se invoca.",
    "explanation": `Mecánica interna de la cadena de ámbitos (*Scope Chain*):

1. **Tipos de Ámbito:**
- **Global:** Variables accesibles en todo el programa. En navegadores residen en \`window\` si se declaran con \`var\`.
- **Módulo:** Cada archivo ESM (\`import\`/\`export\`) tiene su propio ámbito aislado, impidiendo colisiones entre módulos.
- **Función:** Variables creadas con \`var\`, \`let\` o \`const\` dentro de una función no son visibles desde el exterior.
- **Bloque (ES6):** Delimitado por \`{ ... }\` (\`if\`, \`for\`, \`try/catch\`). Solo afecta a \`let\`, \`const\` y declaraciones de clases.

2. **Ámbito Léxico y Scope Chain:**
Cuando el motor ejecuta una instrucción y necesita resolver un identificador:
1. Busca en el **Registro de Entorno (*Environment Record*)** local inmediato.
2. Si no lo encuentra, sube a través de la referencia \`outer\` del contexto léxico hacia el ámbito contenedor padre.
3. Continúa subiendo sucesivamente hasta llegar al ámbito global.
4. Si tampoco existe en el global, lanza \`ReferenceError\` en modo estricto.

3. **Direccionalidad:**
La búsqueda de variables siempre va de adentro hacia afuera (un hijo ve las variables de sus padres, pero un padre jamás puede acceder a las variables locales de sus hijos).`,
    "codeSnippet": "const global = 'g';\n\nfunction externa() {\n  const e = 'e';\n  function interna() {\n    const i = 'i';\n    console.log(global, e, i); // ve los tres: sube por la scope chain\n  }\n  interna();\n}\n// console.log(e); → ReferenceError: no se ve hacia adentro",
    "seniorTip": "En entrevistas, aclara que JavaScript NO tiene ámbito dinámico (como Bash o Perl); tiene ámbito léxico o estático. Esto significa que el scope se determina durante el análisis léxico en tiempo de compilación/parseo, lo cual permite que las closures funcionen de manera predecible.",
    "tags": [
      "nivel-3",
      "scope",
      "javascript",
      "lexical-scope"
    ],
    "interactiveDemo": "console"
  },
  {
    "id": "P23",
    "level": 3,
    "levelTitle": "Scope, closures y `this`",
    "question": "¿Qué es una closure?",
    "shortAnswer": "Una **closure** es la combinación de una función y el **entorno léxico** en el cual fue declarada. Permite que la función interna recuerde y mantenga acceso a las variables de su ámbito contenedor exterior, incluso después de que la función padre haya finalizado su ejecución y salido de la pila de llamadas (*call stack*).",
    "explanation": `Mecanismo en memoria y casos de uso en producción:

1. **Cómo funciona en la memoria del motor:**
Normalmente, cuando una función termina su ejecución, su contexto de ejecución (*Execution Context*) se retira de la pila (*call stack*) y sus variables locales son destruidas por el Garbage Collector. Sin embargo, si una función interna hace referencia a alguna variable de ese contexto padre y dicha función interna sobrevive (por ejemplo, al retornarla o pasarla a un callback), el motor traslada esas variables al **Heap** dentro de un objeto de ámbito especial (*Closure Scope*), manteniéndolas vivas mientras la función interna exista.

2. **Casos de uso clave en ingeniería de software:**
- **Encapsulación y datos privados:** Simular propiedades privadas y métodos de acceso sin exponer estado mutable (Patrón Factory y Módulo).
- **Fábricas de funciones (*Currying* y Aplicación Parcial):** Generar funciones parametrizadas (ej. generadores de URLs o validadores).
- **Memoización y Caché:** Guardar un diccionario de resultados previos en una variable oculta en la closure para evitar recálculos costosos.
- **Temporizadores y Event Handlers:** Preservar estado en callbacks asíncronos (\`debounce\`, \`throttle\`, listeners del DOM).`,
    "codeSnippet": "function crearContador() {\n  let n = 0;              // variable \"privada\"\n  return () => ++n;       // la función interna la sigue viendo\n}\n\nconst a = crearContador();\nconst b = crearContador();\na(); a();                 // 1, 2\nb();                      // 1 (entorno distinto)",
    "seniorTip": "Cuidado con los memory leaks: las closures mantienen vivas todas las variables a las que hacen referencia. Si una closure de larga duración (como un event listener global o un setInterval) referencia objetos pesados (como un árbol DOM completo o un gran array), esos datos no podrán ser liberados por el Garbage Collector hasta que la closure sea descartada.",
    "tags": [
      "nivel-3",
      "scope",
      "javascript",
      "debounce",
      "closure"
    ],
    "interactiveDemo": "console"
  },
  {
    "id": "P24",
    "level": 3,
    "levelTitle": "Scope, closures y `this`",
    "question": "¿Qué imprime este bucle y cómo se arregla?",
    "shortAnswer": "Imprime `3 3 3` porque `var` tiene ámbito de función, creando una **única variable `i` compartida** en memoria. Cuando los callbacks de `setTimeout` se ejecutan tras el bucle, este ya finalizó y `i` vale 3. Con `let`, JavaScript crea una **nueva variable `i` con su propia closure por cada iteración**, imprimiendo `0 1 2`.",
    "explanation": `Análisis paso a paso del Event Loop y closures:

1. **Por qué ocurre con \`var\`:**
- \`var\` no tiene ámbito de bloque. Solo existe una única variable \`i\` en todo el scope de la función o contexto global.
- \`setTimeout(..., 0)\` no ejecuta el callback de inmediato; lo encola en la cola de macrotareas (*macrotask queue*).
- El bucle \`for\` síncrono corre hasta su final (\`i = 0, 1, 2, 3\`), terminando con \`i === 3\`.
- El Call Stack se vacía y el Event Loop despacha los 3 callbacks encolados. Como los 3 leen el mismo puntero en memoria de \`i\`, todos imprimen \`3\`.

2. **Por qué \`let\` lo resuelve automáticamente:**
La especificación de ES6 define un comportamiento especial para bucles \`for (let ...)\`: en cada iteración del bucle, el motor crea un **nuevo entorno léxico independiente** y enlaza el valor actual de \`i\` a esa iteración concreta. Cada callback captura su propio valor inmutable de \`i\` en su respectiva closure.

3. **Solución alternativa histórica (pre-ES6):**
Usar una IIFE para capturar el valor de \`i\` como argumento por valor:
\`for (var i = 0; i < 3; i++) { ((j) => setTimeout(() => console.log(j), 0))(i); }\``,
    "codeSnippet": "for (var i = 0; i < 3; i++) {\n  setTimeout(() => console.log(i), 0);\n}\n// Imprime: 3 3 3\n\n// Solución 1 moderna: let (ámbito por iteración)\nfor (let i = 0; i < 3; i++) {\n  setTimeout(() => console.log(i), 0); // 0 1 2\n}\n\n// Solución 2 clásica: IIFE que captura el valor en un parámetro j\nfor (var i = 0; i < 3; i++) {\n  ((j) => setTimeout(() => console.log(j), 0))(i);\n}",
    "seniorTip": "Esta es una de las preguntas de filtro técnico más clásicas en la industria. Si el evaluador te pide explicar la solución con let, menciona explícitamente que la especificación ECMAScript estipula una creación de entorno por paso de bucle (per-iteration environment binding), demostrando que comprendes la especificación a bajo nivel.",
    "tags": [
      "nivel-3",
      "closure",
      "javascript",
      "event-loop"
    ],
    "interactiveDemo": "console"
  },
  {
    "id": "P25",
    "level": 3,
    "levelTitle": "Scope, closures y `this`",
    "question": "¿Cómo se determina el valor de `this`?",
    "shortAnswer": "En funciones tradicionales, `this` no depende de dónde se escribe la función sino de **cómo se invoca** en tiempo de ejecución. Se determina evaluando 4 reglas con precedencia: (1) `new`, (2) enlace explícito (`call`/`apply`/`bind`), (3) enlace implícito (`obj.metodo()`), y (4) enlace por defecto (`undefined` en strict mode, `window` en no estricto). En arrow functions, `this` es puramente léxico.",
    "explanation": `Las 4 reglas de enlace (*Binding Rules*) ordenadas por precedencia:

1. **Regla 1: \`new Binding\` (Mayor prioridad):**
Si la función se invoca con el operador \`new\` (\`new Persona()\`), \`this\` se enlaza automáticamente al nuevo objeto recién creado en memoria.

2. **Regla 2: Enlace Explícito (\`call\`, \`apply\`, \`bind\`):**
Si se usa \`.call(contexto)\`, \`.apply(contexto)\` o \`.bind(contexto)\`, \`this\` se fija explícitamente al objeto provisto como primer argumento.

3. **Regla 3: Enlace Implícito (Llamada mediante objeto):**
Si la función se invoca como propiedad de un objeto (\`usuario.saludar()\`), \`this\` apunta al objeto contenedor inmediato situado a la izquierda del punto en la llamada.

4. **Regla 4: Enlace por Defecto (Menor prioridad):**
Si la función se llama como una función suelta e independiente (\`saludar()\`):
- En **modo estricto (\`'use strict'\`):** \`this\` es \`undefined\`.
- En **modo no estricto:** \`this\` apunta al objeto global (\`window\` en el navegador, \`global\` en Node.js).

**Excepción:** Las **Arrow Functions** ignoran por completo estas cuatro reglas y heredan el \`this\` léxico de su contexto contenedor en tiempo de definición.`,
    "codeSnippet": "const persona = {\n  nombre: 'Ana',\n  saludar() { return `Hola, soy ${this.nombre}`; },\n};\n\npersona.saludar();            // 'Hola, soy Ana'  (regla 3: enlace implícito)\nconst suelta = persona.saludar;\nsuelta();                     // pierde el this → TypeError en strict mode",
    "seniorTip": "Para memorizar esto en entrevistas, cita el libro 'You Don't Know JS' de Kyle Simpson: aplica las reglas en orden: ¿Se llamó con new? ¿Con bind/call/apply? ¿Con un objeto contexto obj.fn()? Si ninguna aplica, cae en default binding (undefined en strict).",
    "tags": [
      "nivel-3",
      "scope",
      "this",
      "javascript"
    ],
    "interactiveDemo": "console"
  },
  {
    "id": "P26",
    "level": 3,
    "levelTitle": "Scope, closures y `this`",
    "question": "¿Diferencia entre `call`, `apply` y `bind`?",
    "shortAnswer": "`call` y `apply` **ejecutan la función inmediatamente** cambiando su contexto `this`: `call` recibe los argumentos separados por comas y `apply` como un array. Por el contrario, `bind` **no ejecuta la función**, sino que devuelve una nueva función con el `this` (y opcionalmente argumentos) fijado permanentemente.",
    "explanation": `Comparativa y casos de uso de los métodos de \`Function.prototype\`:

1. **\`Function.prototype.call(thisArg, arg1, arg2, ...)\`:**
- Invoca la función de inmediato con \`thisArg\` como \`this\`.
- Pasa los argumentos de forma posicional e individual.
- Útil cuando conoces con antelación el número exacto de argumentos.

2. **\`Function.prototype.apply(thisArg, [argsArray])\`:**
- Invoca la función de inmediato con \`thisArg\` como \`this\`.
- Pasa los argumentos agrupados en un array o un objeto array-like.
- Históricamente vital antes de ES6 para pasar listas dinámicas (\`Math.max.apply(null, numeros)\`), hoy mayoritariamente sustituido por el spread operator (\`Math.max(...numeros)\`).

3. **\`Function.prototype.bind(thisArg, arg1, arg2, ...)\`:**
- Retorna una nueva función ligada (*bound function*).
- Fija \`this\` de forma inmutable: intentar usar \`.call()\` o \`.apply()\` sobre una función ya ligada con \`bind\` no alterará su \`this\`.
- Permite la **aplicación parcial de argumentos**: puedes prefijar argumentos que se prependerán a las llamadas posteriores.`,
    "codeSnippet": "function presentar(saludo, puntuacion) {\n  return `${saludo}, soy ${this.nombre}${puntuacion}`;\n}\nconst ana = { nombre: 'Ana' };\n\npresentar.call(ana, 'Hola', '!');       // 'Hola, soy Ana!'\npresentar.apply(ana, ['Hola', '!']);    // 'Hola, soy Ana!'\nconst ligada = presentar.bind(ana, 'Hola');\nligada('?');                            // 'Hola, soy Ana?'",
    "seniorTip": "Regla mnemotécnica para entrevistas: Call usa Comas (arg1, arg2), Apply usa Array ([args]), y Bind devuelve una función atada para llamar más tarde. Aclara también que bind() no puede re-ligarse: una vez atada con bind, invocar .bind() por segunda vez no cambiará el this original.",
    "tags": [
      "nivel-3",
      "this",
      "javascript",
      "bind",
      "call"
    ],
    "interactiveDemo": "console"
  },
  {
    "id": "P27",
    "level": 3,
    "levelTitle": "Scope, closures y `this`",
    "question": "¿Cómo se comporta `this` en una arrow function?",
    "shortAnswer": "Una **arrow function no tiene su propio enlace `this`**; en su lugar, captura el `this` de su ámbito léxico contenedor al momento de definirse. Este valor es permanente y no puede ser alterado con `call`, `apply` o `bind`.",
    "explanation": `Mecánica y consecuencias prácticas:

1. **Resolución Léxica:**
Las arrow functions no tienen el slot interno \`[[ThisBindingStatus]]\`. Cuando dentro de una arrow function se utiliza la palabra reservada \`this\`, el motor la busca en la cadena de ámbitos (*scope chain*) tal como buscaría cualquier variable ordinaria (\`x\` o \`y\`).

2. **Comportamiento con \`call\`, \`apply\` y \`bind\`:**
Si invocas \`.call(nuevoContexto)\` o \`.bind(nuevoContexto)\` sobre una arrow function, **el primer argumento es ignorado**. Solo se pasarán los argumentos subsiguientes si la función los recibe.

3. **Cuándo es ideal:**
- En callbacks de métodos (\`array.map(() => this.propiedad)\`).
- En timers (\`setTimeout(() => this.contador++, 1000)\`).
- En controladores de eventos donde necesitas acceder a la instancia de la clase y no al elemento del DOM.

4. **Cuándo es un antipatrón:**
- **Como métodos de objetos literales:** \`const obj = { id: 1, getId: () => this.id }\` fallará porque el scope léxico exterior es \`window\` o el módulo, no \`obj\`.
- **Como métodos prototipales:** \`Persona.prototype.saludar = () => { ... }\` no tendrá acceso a la instancia.
- **En handlers de DOM donde necesites \`event.currentTarget\` vía \`this\`.**`,
    "codeSnippet": "const temporizador = {\n  segundos: 0,\n  iniciar() {\n    setInterval(() => {\n      this.segundos++;   // this = temporizador (heredado léxicamente de iniciar)\n    }, 1000);\n  },\n  malMetodo: () => this.segundos, // this NO es el objeto (es el del scope exterior global)\n};",
    "seniorTip": "En entrevistas, si te preguntan '¿Cómo harías para cambiarle el this a una arrow function?', la respuesta técnica categórica es: 'No es posible. Su diseño en la especificación ECMAScript elimina el enlace dinámico de this a nivel de bytecode'.",
    "tags": [
      "nivel-3",
      "scope",
      "this",
      "javascript",
      "arrow-functions"
    ],
    "interactiveDemo": "console"
  },
  {
    "id": "P28",
    "level": 3,
    "levelTitle": "Scope, closures y `this`",
    "question": "¿Por qué se pierde `this` al pasar un método como callback y cómo se arregla?",
    "shortAnswer": "Al extraer un método de un objeto y pasarlo como callback (por ejemplo, `setTimeout(obj.metodo, 1000)`), se extrae únicamente la **referencia suelta a la función**, desvinculándola del objeto. Al ejecutarse en el Event Loop, se invoca como una llamada independiente sin objeto receptor, activando la regla de enlace por defecto (`undefined` o `window`).",
    "explanation": `Por qué ocurre y las 3 soluciones en producción:

1. **La causa raíz:**
La sintaxis \`obj.metodo()\` ejecuta una referencia con base (*Reference Record* con base \`obj\`). Al hacer \`const fn = obj.metodo;\` o \`setTimeout(obj.metodo, 100);\`, la operación de acceso a propiedad evalúa y entrega solo el valor funcional desprovisto de su base. Cuando el temporizador o el despachador de eventos lo ejecuta, hace \`fn()\`, lo que activa la regla 4 (enlace por defecto).

2. **Solución 1: Envolver en una Arrow Function (Recomendada):**
\`setTimeout(() => obj.metodo(), 1000);\`
La arrow function preserva la invocación explícita \`obj.metodo()\`, conservando a \`obj\` a la izquierda del punto.

3. **Solución 2: Enlace explícito con \`bind\`:**
\`setTimeout(obj.metodo.bind(obj), 1000);\`
Crea una nueva función permanentemente vinculada a la instancia.

4. **Solución 3: Class Fields con Arrow Functions (Patrón React clásico):**
\`class Boton { onClick = () => { console.log(this.texto); }; }\`
Crea una función flecha por cada instancia durante la construcción de la clase.`,
    "codeSnippet": "class Boton {\n  constructor() { this.texto = 'Click'; }\n  onClick() { console.log(this.texto); }\n}\nconst b = new Boton();\n\nsetTimeout(b.onClick, 0);                    // undefined o TypeError: this perdido\n\n// Soluciones eficaces:\nsetTimeout(() => b.onClick(), 0);            // 1. Arrow wrapper\nsetTimeout(b.onClick.bind(b), 0);            // 2. Function.prototype.bind\nclass Boton2 {\n  onClick = () => console.log(this.texto);   // 3. Class field arrow\n}",
    "seniorTip": "En React y TypeScript, los class fields con arrow functions resuelven el problema de this, pero tienen un coste en memoria: la función se recrea en cada instancia en lugar de compartirse en el prototipo (Boton.prototype). Si tienes miles de instancias en memoria, usar métodos prototipales y bind o wrappers es mucho más eficiente.",
    "tags": [
      "nivel-3",
      "this",
      "javascript",
      "callbacks"
    ],
    "interactiveDemo": "console"
  },
  {
    "id": "P29",
    "level": 3,
    "levelTitle": "Scope, closures y `this`",
    "question": "¿Cómo se crea privacidad con closures (patrón módulo)?",
    "shortAnswer": "El **patrón Módulo** utiliza closures e IIFEs para crear variables y funciones privadas dentro de un ámbito de función cerrado, exponiendo únicamente un objeto público con métodos que operan sobre dicho estado interno. En JavaScript moderno coexiste con los campos privados nativos `#campo` en clases.",
    "explanation": `Evolución de la privacidad en JavaScript:

1. **Patrón Módulo Clásico con Closures:**
Al retornar un objeto literal desde una función o IIFE, los métodos del objeto mantienen una closure sobre las variables locales de la función. El código exterior no puede leer ni modificar esas variables directamente bajo ninguna circunstancia, garantizando encapsulación estricta.

2. **Ventajas del enfoque funcional con closures:**
- No depende de clases ni de \`this\`.
- Inviolable desde el exterior (ni siquiera mediante \`Object.keys()\` o \`Reflect\`).
- Estado 100% aislado por cada instancia producida por la factory.

3. **Alternativa moderna de ES2022: Campos Privados \`#\`:**
Las clases de JavaScript ahora soportan sintaxis de campos privados reales forzados a nivel de lenguaje con \`#\` (\`#saldo = 0\`). A diferencia de convenciones obsoletas como \`_saldo\` (que era meramente cosmético), \`#saldo\` arroja \`SyntaxError\` si se intenta acceder desde fuera de la clase.`,
    "codeSnippet": "const banco = (() => {\n  let saldo = 0;                       // inaccesible desde fuera\n  const validar = (n) => n > 0;\n\n  return {\n    depositar(n) { if (validar(n)) saldo += n; },\n    obtenerSaldo: () => saldo,\n  };\n})();\n\nbanco.depositar(100);\nconsole.log(banco.obtenerSaldo()); // 100\nconsole.log(banco.saldo);          // undefined (privacidad real)",
    "seniorTip": "Diferencia técnica senior entre _prop (convención TypeScript private) y #prop (privacidad nativa ECMAScript): la palabra clave private de TypeScript solo es una comprobación en tiempo de compilación que desaparece al transpilar a JS; #prop es privacidad forzada por el propio motor del navegador en tiempo de ejecución.",
    "tags": [
      "nivel-3",
      "closure",
      "javascript",
      "patrones",
      "privacidad"
    ],
    "interactiveDemo": "console"
  }
];
