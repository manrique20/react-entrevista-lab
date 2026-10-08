import { JsTopic } from '@/types/javascript';

export const level1Topics: JsTopic[] = [
  {
    "id": "P1",
    "level": 1,
    "levelTitle": "Fundamentos",
    "question": "¿Qué tipos de datos tiene JavaScript?",
    "shortAnswer": "JavaScript tiene **7 tipos primitivos** (`string`, `number`, `bigint`, `boolean`, `undefined`, `null`, `symbol`) y **1 tipo de referencia** (`object`, que engloba objetos literales, arrays, funciones, fechas y mapas).",
    "explanation": `Detalles clave de almacenamiento y mutabilidad:

1. **Primitivos (Almacenados por valor):**
- Son **inmutables**: no puedes alterar el valor de un string o número en memoria (operaciones como \`.toUpperCase()\` o \`str[0] = 'x'\` devuelven un nuevo string o fallan silenciosamente).
- Se comparan por su **valor intrínseco**: \`'hola' === 'hola'\` es \`true\`.
- En motores modernos (como V8), los primitivos simples suelen asignarse directamente en la pila (*stack*).

2. **Objetos (Almacenados por referencia):**
- Son **mutables**: sus propiedades internas pueden añadirse, modificarse o eliminarse.
- Se almacenan en el montículo (*heap*) de memoria, y las variables contienen un puntero a esa dirección.
- Dos objetos con las mismas propiedades nunca son iguales por valor: \`{} === {}\` es \`false\` porque ocupan diferentes posiciones en memoria.

3. **Curiosidades del sistema de tipos:**
- Las funciones son objetos de primera clase con slot interno invocable \`[[Call]]\`.
- \`null\` es un primitivo a pesar de que \`typeof null === 'object'\` (error histórico de JS en 1995).`,
    "codeSnippet": "let a = 'hola';\na[0] = 'H';          // no hace nada: los strings son inmutables\nconsole.log(a);      // 'hola'\n\nconst x = { n: 1 };\nconst y = x;         // y apunta al MISMO objeto\ny.n = 2;\nconsole.log(x.n);    // 2",
    "seniorTip": "Un entrevistador suele preguntar por BigInt y Symbol: aclara que BigInt rompe el límite seguro de Number.MAX_SAFE_INTEGER (2^53 - 1) pero no se puede mezclar con Numbers en operaciones aritméticas directas (10n + 5 arroja TypeError).",
    "tags": [
      "object",
      "nivel-1",
      "javascript",
      "array",
      "tipos"
    ],
    "interactiveDemo": "console"
  },
  {
    "id": "P2",
    "level": 1,
    "levelTitle": "Fundamentos",
    "question": "¿Diferencia entre `var`, `let` y `const`?",
    "shortAnswer": "`var` posee ámbito de función y hoisting inicializado en `undefined`. `let` y `const` poseen ámbito de bloque y permanecen en la Zona Muerta Temporal (TDZ) hasta su declaración. `const` impide la reasignación de la variable, pero no congela objetos mutables.",
    "explanation": `Comparación técnica exhaustiva:

1. **Ámbito (*Scope*):**
- \`var\` ignora bloques (\`if\`, \`for\`, \`while\`) y solo se aísla dentro del cuerpo de una función. Además, en el ámbito global se adjunta como propiedad de \`window\`.
- \`let\` y \`const\` respetan cualquier par de llaves \`{ ... }\`, evitando fugas de variables en bucles y condicionales.

2. **Elevación (*Hoisting*) y Zona Muerta Temporal (TDZ):**
- \`var\` se registra y se inicializa con \`undefined\` antes de ejecutar la primera línea de código.
- \`let\` y \`const\` se registran en el entorno léxico pero **no se inicializan**. El período entre el inicio del bloque y la línea donde se declara la variable es la TDZ; acceder a ella lanza \`ReferenceError\`.

3. **Inmutabilidad y \`const\`:**
- \`const\` solo garantiza que el **enlace de la variable** (el puntero en memoria) no puede reasignarse.
- Para lograr inmutabilidad superficial en el objeto, se debe aplicar \`Object.freeze()\`; para inmutabilidad profunda, se requiere congelación recursiva o librerías como Immer.`,
    "codeSnippet": "if (true) {\n  var a = 1;\n  let b = 2;\n}\nconsole.log(a); // 1\nconsole.log(b); // ReferenceError\n\nconst user = { nombre: 'Ana' };\nuser.nombre = 'Luis';   // permitido: se muta el objeto\nuser = {};              // TypeError: no se puede reasignar",
    "seniorTip": "En una entrevista senior, enfatiza la regla de oro: usa const por defecto para garantizar que los enlaces no cambien, let únicamente cuando la reasignación sea indispensable (como contadores en bucles), y jamás uses var en código moderno. Si te preguntan si const hace inmutable un objeto, aclara que solo congela el identificador, no el contenido del heap.",
    "tags": [
      "scope",
      "nivel-1",
      "javascript",
      "variables"
    ],
    "interactiveDemo": "console"
  },
  {
    "id": "P3",
    "level": 1,
    "levelTitle": "Fundamentos",
    "question": "¿Qué es el hoisting y la TDZ?",
    "shortAnswer": "El **hoisting** es la fase de creación del contexto de ejecución donde el motor reserva memoria para declaraciones antes de ejecutar el código. Las funciones tradicionales se elevan con su cuerpo completo; `var` se eleva inicializado en `undefined`; `let` y `const` se elevan sin inicializar, generando la **TDZ** (*Temporal Dead Zone*).",
    "explanation": `Cómo opera internamente el motor V8:

1. **Fases del Contexto de Ejecución:**
- **Fase de Creación:** El motor escanea el código, crea el entorno léxico (*Lexical Environment*) e identifica identificadores.
- **Fase de Ejecución:** El motor recorre el código línea a línea asignando valores y ejecutando llamadas.

2. **Comportamiento por tipo de declaración:**
- **Funciones declaradas (\`function saludar(){}\`):** Se elevan con su implementación completa. Puedes llamarlas con seguridad antes de su definición física en el archivo.
- **\`var\`:** Se reserva el identificador y se le asigna de inmediato el valor primitivo \`undefined\`. Por eso \`console.log(a); var a = 10;\` imprime \`undefined\` en lugar de fallar.
- **\`let\` y \`const\`:** El identificador existe en el registro del ámbito, pero acceder a él antes de su inicialización activa la TDZ y arroja \`ReferenceError: Cannot access 'x' before initialization\`.
- **Clases (\`class\`):** Al igual que \`let\` y \`const\`, las clases no se inicializan y están sujetas a la TDZ.

3. **Por qué se introdujo la TDZ en ES6:**
Para detectar errores de lectura de variables antes de su asignación lógica y evitar comportamientos silenciosamente erróneos como los producidos por \`var\`.`,
    "codeSnippet": "console.log(a);   // undefined (var elevada)\nvar a = 5;\n\nconsole.log(b);   // ReferenceError: Cannot access 'b' before initialization (TDZ)\nlet b = 5;\n\nsaludar();        // funciona: la declaración completa se eleva\nfunction saludar() { console.log('hola'); }\n\ndespedir();       // TypeError: despedir is not a function (var elevada = undefined)\nvar despedir = function () {};",
    "seniorTip": "Los evaluadores preguntan con frecuencia: '¿Las declaraciones let y const sufren hoisting?'. La respuesta correcta es SÍ, se elevan en la fase de escaneo léxico; la diferencia con var es que entran en la TDZ y no reciben inicialización hasta que el hilo llega a su declaración explícita.",
    "tags": [
      "hoisting",
      "nivel-1",
      "javascript",
      "tdz"
    ],
    "interactiveDemo": "console"
  },
  {
    "id": "P4",
    "level": 1,
    "levelTitle": "Fundamentos",
    "question": "¿Diferencia entre `==` y `===`?",
    "shortAnswer": "`===` (igualdad estricta) compara tipo y valor sin realizar ninguna transformación. `==` (igualdad débil) aplica el algoritmo abstracto de **coerción de tipos** (*Abstract Equality Comparison*) convirtiendo operandos a un tipo común antes de comparar.",
    "explanation": `Reglas del algoritmo de igualdad y trampas habituales:

1. **Algoritmo de coerción en \`==\`:**
- Si comparas un \`number\` con un \`string\`, el string se convierte a número: \`'42' == 42\` → \`Number('42') == 42\` (true).
- Si comparas un \`boolean\` con cualquier otro tipo, el booleano se convierte primero a número (\`true → 1\`, \`false → 0\`). Por eso \`'2' == true\` es \`false\` (ya que \`'2' == 1\` → \`2 == 1\`).
- Si comparas un objeto/array con un primitivo, el motor aplica \`ToPrimitive()\` usando \`.valueOf()\` o \`.toString()\`: \`[] == 0\` es \`true\` porque \`[].toString()\` es \`""\`, y \`Number("")\` es \`0\`.

2. **La única excepción aceptada en la industria para \`==\`:**
\`if (valor == null)\`: Comprueba simultáneamente si \`valor\` es \`null\` o \`undefined\` en una sola expresión limpia, ya que según la especificación ECMAScript, \`null == undefined\` es siempre \`true\`.

3. **Regla de oro:**
Utiliza siempre \`===\` para prevenir efectos colaterales de coerción implícita, excepto en la comprobación nula mencionada.`,
    "codeSnippet": "0 == '0';          // true\n0 == '';           // true\n'0' == '';         // false  (no es transitivo)\nnull == undefined; // true\nnull === undefined;// false\nNaN == NaN;        // false\n[] == ![];         // true   (acertijo clásico)\n\nif (valor == null) { /* null o undefined */ }",
    "seniorTip": "Un clásico acertijo de entrevista: ¿Por qué [] == ![] evalúa a true? Explica el paso a paso: ![] es negación lógica y cualquier objeto es truthy, por lo que ![] evalúa a false. Luego la expresión queda [] == false. Al comparar objeto con booleano, false se convierte a 0. Finalmente [].toString() es \"\", y \"\" == 0 se convierte en 0 == 0, resultando en true.",
    "tags": [
      "nivel-1",
      "javascript",
      "coercion",
      "operadores"
    ],
    "interactiveDemo": "coercion"
  },
  {
    "id": "P5",
    "level": 1,
    "levelTitle": "Fundamentos",
    "question": "¿Diferencia entre `null` y `undefined`?",
    "shortAnswer": "`undefined` indica que una variable ha sido declarada pero aún no tiene ningún valor asignado (o que una propiedad/parámetro no existe). `null` es un valor asignado deliberadamente para representar la ausencia intencional de un objeto o dato.",
    "explanation": `Diferencias semánticas, técnicas y de runtime:

1. **Origen en el runtime:**
- **\`undefined\` es el default de JavaScript:** Aparece cuando declaras \`let x;\`, cuando una función no tiene sentencia \`return\`, cuando accedes a una propiedad que no existe en un objeto (\`obj.noExiste\`), o cuando omites un argumento en una función.
- **\`null\` es una asignación explícita:** El desarrollador o una API lo asigna a propósito para indicar que el campo está 'vacío' o que un objeto ha sido 'limpiado'.

2. **Comportamiento con Operadores:**
- \`typeof undefined === 'undefined'\`.
- \`typeof null === 'object'\` (famoso bug original del motor de Brendan Eich en 1995 que no puede corregirse para no romper millones de sitios web existentes).
- En operaciones aritméticas: \`1 + undefined\` resulta en \`NaN\`, mientras que \`1 + null\` resulta en \`1\` (porque \`null\` se coerciona a \`0\`).
- Parámetros por defecto: \`function f(x = 10) {}\`: llamar \`f(undefined)\` usa \`10\`; llamar \`f(null)\` conserva \`null\`.`,
    "codeSnippet": "let x;              // undefined\nconst o = {};\no.inexistente;      // undefined\nfunction f() {}\nf();                // undefined\n\nlet usuario = null; // \"aún no hay usuario\", asignado a propósito\ntypeof undefined;   // 'undefined'\ntypeof null;        // 'object'  (bug histórico del lenguaje)",
    "seniorTip": "En TypeScript y APIs modernas, es una buena práctica acordar con el equipo una sola representación para 'vacío' (usualmente undefined en props opcionales y TypeScript, y null para datos de bases de datos JSON donde el campo está explícitamente ausente).",
    "tags": [
      "nivel-1",
      "javascript",
      "primitivos"
    ],
    "interactiveDemo": "console"
  },
  {
    "id": "P6",
    "level": 1,
    "levelTitle": "Fundamentos",
    "question": "¿Cuáles son los valores *falsy*?",
    "shortAnswer": "Existen exactamente **8 valores falsy** en JavaScript: `false`, `0`, `-0`, `0n` (BigInt), `\"\"` (string vacío), `null`, `undefined` y `NaN`. Cualquier otro valor es **truthy**, incluyendo `[]`, `{}`, `\"0\"` y `\"false\"`.",
    "explanation": `Reglas de evaluación lógica y trampas críticas en UI:

1. **Qué es un valor falsy:**
Cualquier valor que, al ser evaluado en un contexto booleano (como un \`if\`, operador ternario o \`Boolean(x)\`), se convierte a \`false\`.

2. **Trampas peligrosas con valores numéricos y strings:**
- \`0\` es un número totalmente válido en contadores, precios o coordenadas, pero al ser falsy, si haces \`total || 10\` se reemplazará por \`10\`.
- El string vacío \`""\` es falsy, pero strings con texto como \`"0"\` o \`"false"\` son truthy.
- Objetos y arrays vacíos (\`{}\`, \`[]\`) son **truthy** porque son instancias en el heap: \`Boolean([]) === true\`.

3. **Solución moderna:**
- Para valores por defecto, prefiere el operador de coalescencia nula **\`??\`** sobre **\`||\`**, ya que solo considera nulos a \`null\` y \`undefined\`, respetando \`0\`, \`""\` y \`false\` como datos válidos.`,
    "codeSnippet": "if ([]) console.log('un array vacío es truthy');\nif ('0') console.log('\"0\" es truthy');\nif (!'') console.log('\"\" es falsy');\n\n// Trampa común: 0 es un valor válido\nconst cantidad = 0;\nconst mostrar = cantidad || 10;  // 10 (incorrecto)\nconst mostrar2 = cantidad ?? 10; // 0  (correcto)",
    "seniorTip": "En React y Next.js, una trampa letal en entrevistas es el render condicional: {items.length && <List />}. Si items.length es 0, la expresión evalúa a 0 y React pintará un '0' visible en la pantalla del usuario en vez de nada. La solución senior es usar {items.length > 0 && <List />} o {Boolean(items.length) && <List />}.",
    "tags": [
      "nivel-1",
      "javascript",
      "boolean",
      "falsy"
    ],
    "interactiveDemo": "coercion"
  },
  {
    "id": "P7",
    "level": 1,
    "levelTitle": "Fundamentos",
    "question": "¿Qué hace `typeof` y cuáles son sus rarezas?",
    "shortAnswer": "`typeof` devuelve un string indicando el tipo primitivo o de función de un operando. Sus mayores rarezas son `typeof null === 'object'`, `typeof [] === 'object'` y `typeof NaN === 'number'`. Para validar colecciones y tipos exactos se usan `Array.isArray()`, `instanceof` o `Object.prototype.toString.call()`.",
    "explanation": `Mapeo de resultados y técnicas profesionales de comprobación:

1. **Resultados estándar de \`typeof\`:**
- Primitivos: \`'string'\`, \`'number'\`, \`'bigint'\`, \`'boolean'\`, \`'symbol'\`, \`'undefined'\`.
- Funciones: \`'function'\` (a pesar de ser objetos, tienen un resultado específico por tener el slot \`[[Call]]\`).
- Variables no declaradas: \`typeof noExiste\` devuelve \`'undefined'\` de forma segura sin lanzar \`ReferenceError\`.

2. **Casos anómalos históricos:**
- \`typeof null === 'object'\`: En la primera implementación de JS, los valores se representaban con una etiqueta de tipo en los primeros bits; el tag \`000\` representaba objetos y \`null\` era el puntero nulo (\`0x00\`), lo que provocó que \`typeof\` lo leyera erróneamente como objeto.
- \`typeof NaN === 'number'\`: Aunque signifique 'Not a Number', pertenece a la representación de punto flotante de IEEE 754.

3. **Cómo validar tipos de forma robusta:**
- Arrays: \`Array.isArray(x)\`.
- Fechas y RegExp: \`x instanceof Date\`, \`x instanceof RegExp\`.
- Inspección universal profunda: \`Object.prototype.toString.call(x)\` (devuelve \`[object Array]\`, \`[object Null]\`, \`[object Date]\`, etc.).`,
    "codeSnippet": "typeof 'a';          // 'string'\ntypeof 42;           // 'number'\ntypeof NaN;          // 'number'\ntypeof 10n;          // 'bigint'\ntypeof undefined;    // 'undefined'\ntypeof null;         // 'object'   <- rareza\ntypeof [];           // 'object'   <- usa Array.isArray([])\ntypeof function(){}; // 'function'\ntypeof Symbol();     // 'symbol'\ntypeof sinDeclarar;  // 'undefined' (no lanza error)",
    "seniorTip": "Menciona que instanceof puede fallar si tu aplicación trabaja con múltiples contextos de ejecución o ventanas (iframes o web workers), ya que el prototipo de Array en el iframe no coincide con el prototipo de Array de la ventana principal. Por eso Array.isArray() es el estándar infalible.",
    "tags": [
      "prototype",
      "object",
      "nivel-1",
      "javascript",
      "typeof"
    ],
    "interactiveDemo": "console"
  },
  {
    "id": "P8",
    "level": 1,
    "levelTitle": "Fundamentos",
    "question": "¿Qué es `NaN` y cómo se comprueba?",
    "shortAnswer": "`NaN` (*Not a Number*) es un valor numérico especial de tipo `number` que representa una operación matemática inválida. Es el único valor en todo JavaScript que **no es igual a sí mismo** (`NaN === NaN` es `false`). Debe comprobarse con `Number.isNaN()`.",
    "explanation": `Diferencia crucial entre \`isNaN\` global y \`Number.isNaN\`:

1. **El peligro de la función global \`isNaN(x)\`:**
La función global \`isNaN()\` intenta primero coercionar el argumento a número antes de evaluar:
- \`isNaN('hola')\` devuelve \`true\` porque \`Number('hola')\` es \`NaN\`.
- \`isNaN(undefined)\` devuelve \`true\`.
Esto produce falsos positivos graves cuando solo querías validar si una variable ya contenía el valor \`NaN\`.

2. **La solución confiable: \`Number.isNaN(x)\` (ES6):**
\`Number.isNaN()\` no realiza coerción de tipos. Solo devuelve \`true\` si el argumento es estrictamente de tipo \`number\` y tiene el valor \`NaN\`.
- \`Number.isNaN('hola')\` → \`false\`.
- \`Number.isNaN(NaN)\` → \`true\`.
- \`Number.isNaN(0 / 0)\` → \`true\`.

3. **Alternativas nativas:**
- \`Object.is(NaN, NaN)\` devuelve \`true\` (algoritmo SameValue).
- Comprobación manual: \`x !== x\` solo es \`true\` cuando \`x\` es \`NaN\`.`,
    "codeSnippet": "0 / 0;                  // NaN\nparseInt('abc');        // NaN\nNaN === NaN;            // false\n\nisNaN('abc');           // true  (convierte 'abc' → NaN; engañoso)\nNumber.isNaN('abc');    // false (no es el valor NaN)\nNumber.isNaN(NaN);      // true\nObject.is(NaN, NaN);    // true",
    "seniorTip": "Si te preguntan por qué NaN === NaN es false, explica que sigue estrictamente el estándar IEEE 754: dos valores indefinidos o indeterminados de punto flotante no pueden considerarse idénticos porque provienen de orígenes dispares (ej. 0 / 0 frente a Math.sqrt(-1)).",
    "tags": [
      "nivel-1",
      "javascript",
      "nan",
      "numeros"
    ],
    "interactiveDemo": "console"
  },
  {
    "id": "P9",
    "level": 1,
    "levelTitle": "Fundamentos",
    "question": "¿Por qué `0.1 + 0.2 !== 0.3`?",
    "shortAnswer": "Los números en JavaScript se almacenan con el estándar binario de punto flotante de 64 bits **IEEE 754**. Fracciones decimales como 0.1 y 0.2 se convierten en fracciones periódicas infinitas en binario, provocando un ligero error de redondeo (`0.30000000000000004`).",
    "explanation": `Mecánica de punto flotante y cómo solucionarlo en producción:

1. **Por qué sucede en binario:**
Así como en base 10 la fracción 1/3 produce un número decimal infinito (\`0.33333...\`), en base 2 las fracciones decimales como 1/10 (0.1) y 2/10 (0.2) no tienen representación binaria finita. Al tener solo 53 bits de mantisa, el procesador se ve forzado a truncar el valor binario más cercano.

2. **Cómo comparar números flotantes con seguridad:**
Nunca uses \`===\` para flotantes con operaciones. Usa el margen de tolerancia de la máquina:
\`Math.abs(a + b - esperado) < Number.EPSILON\` (donde \`Number.EPSILON\` es la diferencia mínima entre 1 y el siguiente flotante representable).

3. **Manejo de dinero y transacciones:**
En sistemas financieros o pasarelas de pago (Stripe, PayPal), **nunca utilices números flotantes**:
- Multiplica y almacena todos los montos en la unidad entera más pequeña (centavos): \`$19.99\` se almacena y calcula como \`1999\`.
- O utiliza tipos \`BigInt\` o librerías de precisión arbitraria como \`decimal.js\` o \`bignumber.js\`.`,
    "codeSnippet": "0.1 + 0.2;                          // 0.30000000000000004\n0.1 + 0.2 === 0.3;                  // false\n\n// Soluciones\nMath.abs(0.1 + 0.2 - 0.3) < Number.EPSILON;   // true\n+(0.1 + 0.2).toFixed(2);                      // 0.3 (redondeo para mostrar)\n(10 + 20) / 100;                              // trabajar en enteros (centavos) para dinero",
    "seniorTip": "Resalta que este no es un fallo exclusivo de JavaScript: ocurre exactamente igual en Python, C++, Java y cualquier lenguaje que utilice IEEE 754 a nivel de procesador. Menciona Number.EPSILON como la forma idiomática de hacer aserciones en tests unitarios.",
    "tags": [
      "nivel-1",
      "javascript",
      "flotantes",
      "matematicas"
    ],
    "interactiveDemo": "console"
  },
  {
    "id": "P10",
    "level": 1,
    "levelTitle": "Fundamentos",
    "question": "¿Qué es la coerción de tipos?",
    "shortAnswer": "La **coerción de tipos** es la conversión automática o implícita que realiza el motor de JavaScript entre tipos incompatibles. Con el operador `+`, si algún operando es `string`, se produce concatenación; con operadores aritméticos (`-`, `*`, `/`, `%`), los operandos se convierten a `number`.",
    "explanation": `Algoritmos de conversión interna en la especificación ECMAScript:

1. **Coerción Numérica (\`ToNumber\`):**
Operadores como \`-\`, \`*\`, \`/\`, \`>\`, \`<\` convierten los operandos a números:
- \`true → 1\`, \`false → 0\`, \`null → 0\`.
- \`undefined → NaN\`.
- Strings numéricos \`'5' - 2\` → \`3\`.

2. **La peculiaridad del operador binario \`+\`:**
Si **al menos uno** de los operandos es un \`string\`, el motor realiza coerción \`ToString\` y concatena: \`'5' + 2\` da \`'52'\`. Si ninguno es string, intenta sumar numéricamente (\`true + 1\` da \`2\`).

3. **Conversión de Objetos (\`ToPrimitive\`):**
Cuando un objeto o array interactúa con un primitivo, el motor invoca internamente el método \`[Symbol.toPrimitive]\`, o en su defecto \`.valueOf()\` y luego \`.toString()\`:
- \`[] + []\`: ambos arrays se convierten a strings vacíos \`"" + ""\` → \`""\`.
- \`[] + {}\`: \`"" + "[object Object]"\` → \`"[object Object]"\`.

4. **Conversión explícita recomendada:**
Evita la coerción implícita. Escribe código legible con constructores: \`Number(str)\`, \`String(num)\`, \`Boolean(val)\` o doble negación \`!!val\`.`,
    "codeSnippet": "'5' + 2;        // '52'\n'5' - 2;        // 3\ntrue + 1;       // 2\n[] + [];        // ''\n[] + {};        // '[object Object]'\n+'42';          // 42   (unario +: convierte a número)\n!!'hola';       // true (convierte a booleano)\nString(123);    // '123' (conversión explícita, preferible)",
    "seniorTip": "En una entrevista, demuestra conocimiento de Symbol.toPrimitive: explica que puedes personalizar exactamente cómo un objeto propio se convierte a string, número o default según la pista (hint) recibida ('number', 'string', 'default').",
    "tags": [
      "nivel-1",
      "javascript",
      "coercion",
      "tipos"
    ],
    "interactiveDemo": "coercion"
  },
  {
    "id": "P11",
    "level": 1,
    "levelTitle": "Fundamentos",
    "question": "¿Se pasa por valor o por referencia?",
    "shortAnswer": "JavaScript **siempre pasa por valor** (*call by value*). Sin embargo, cuando el valor pasado es un objeto, ese valor es la **referencia (puntero)** a la dirección en memoria. Mutar las propiedades del objeto afecta al original; reasignar la variable parámetro dentro de la función no.",
    "explanation": `Modelo mental: 'Call by sharing' o 'Paso de referencia por valor':

1. **Variables primitivas:**
Se copian por valor completo. Si pasas un número \`n = 5\` a una función y dentro haces \`n = 10\`, la variable original fuera de la función no sufre ninguna alteración.

2. **Variables de objeto:**
La variable en la función recibe una **copia del puntero**. Ambos punteros apuntan al mismo objeto en el heap:
- **Mutación de propiedades (\`obj.prop = 'nuevo'\`):** Como ambos punteros se dirigen al mismo bloque de memoria, el cambio es visible en cualquier parte del código que tenga acceso a dicho objeto.
- **Reasignación del parámetro (\`obj = { nuevo: true }\`):** Se corta el enlace del puntero local del parámetro y se redirige a un nuevo objeto. La variable original en el ámbito exterior sigue apuntando al objeto anterior.`,
    "codeSnippet": "function cambiar(obj, num) {\n  obj.valor = 99;      // muta el objeto original\n  obj = { valor: 0 };  // reasigna solo la copia local de la referencia\n  num = 100;           // copia del primitivo\n}\nconst o = { valor: 1 };\nlet n = 1;\ncambiar(o, n);\nconsole.log(o.valor, n); // 99 1",
    "seniorTip": "Un término técnico muy valorado en entrevistas de arquitectura es 'Call by sharing'. Aclara que no existe el paso por referencia genuino como en C++ (&var) o C# (ref), porque en JavaScript es imposible modificar el puntero original que tenía la variable llamadora desde el interior de una función.",
    "tags": [
      "nivel-1",
      "javascript",
      "memoria",
      "referencias"
    ],
    "interactiveDemo": "console"
  },
  {
    "id": "P12",
    "level": 1,
    "levelTitle": "Fundamentos",
    "question": "¿Diferencia entre `??`, `||` y `?.`?",
    "shortAnswer": "`||` (OR lógico) devuelve el operando derecho si el izquierdo es cualquier valor *falsy*. `??` (*Nullish Coalescing*) solo lo devuelve si el izquierdo es estrictamente `null` o `undefined`. `?.` (*Optional Chaining*) detiene la evaluación y retorna `undefined` si la referencia previa es `null` o `undefined`.",
    "explanation": `Comparación de operadores modernos de control de flujo:

1. **\`||\` vs \`??\` (El problema del valor por defecto):**
- \`||\` falla cuando valores válidos legítimos son falsy (\`0\`, \`""\`, \`false\`):
  \`const timeout = config.timeout || 5000;\` // Si timeout es 0, asigna 5000 erróneamente.
- \`??\` solo sustituye ante ausencia real de valor (\`null\` o \`undefined\`):
  \`const timeout = config.timeout ?? 5000;\` // Si timeout es 0, conserva 0.

2. **\`?.\` (*Optional Chaining*):**
- Evita el temido \`TypeError: Cannot read properties of undefined\`:
  \`const email = user?.profile?.contact?.email;\`
- Funciona con llamadas a funciones que podrían no existir: \`callback?.()\`
- Funciona con propiedades dinámicas y arrays: \`lista?.[index]\`
- Realiza **cortocircuito (*short-circuiting*)**: Si la parte izquierda es nula, el resto de la expresión encadenada ni siquiera se evalúa.`,
    "codeSnippet": "const config = { puerto: 0, host: '' };\nconfig.puerto || 3000;      // 3000 (0 es falsy → pierde el valor válido)\nconfig.puerto ?? 3000;      // 0\nconfig.host ?? 'localhost'; // ''\n\nconst usuario = null;\nusuario?.direccion?.calle;     // undefined (sin error)\nusuario?.saludar?.();          // llamada opcional\nusuario?.lista?.[0];           // acceso opcional por índice\n\nlet x = null;\nx ??= 5;    // asignación lógica: x = x ?? 5",
    "seniorTip": "Advierte contra el abuso indiscriminado de ?.: si esperas obligatoriamente que un objeto exista según tu modelo de datos, usar ?. puede enmascarar bugs lógicos silenciosos aguas arriba en lugar de fallar rápido y de forma explícita. Úsalo solo en puntos donde la ausencia del dato sea un estado normal y esperado.",
    "tags": [
      "nivel-1",
      "javascript",
      "es2020",
      "operadores"
    ],
    "interactiveDemo": "console"
  },
  {
    "id": "P13",
    "level": 1,
    "levelTitle": "Fundamentos",
    "question": "¿Qué es el *strict mode*?",
    "shortAnswer": "`'use strict'` activa el **modo estricto** de ECMAScript, el cual elimina trampas silenciosas del lenguaje convirtiéndolas en excepciones explícitas, impide la creación accidental de variables globales y fija `this` como `undefined` en funciones invocadas de forma aislada. Los módulos ESM y las clases de ES6 ya se ejecutan en modo estricto por defecto.",
    "explanation": `Reglas clave y beneficios que introdujo el modo estricto:

1. **Eliminación de fallos silenciosos:**
- Asignar a variables no declaradas (\`x = 10;\`) lanza \`ReferenceError\` en lugar de crear una variable global en \`window\`.
- Asignar a propiedades de solo lectura (\`NaN = 5;\` o propiedades no modificables con \`writable: false\`) lanza \`TypeError\` en lugar de fallar en silencio.
- Eliminar variables o propiedades no configurables (\`delete Object.prototype\`) lanza error.

2. **Comportamiento seguro de \`this\`:**
En modo no estricto, si invocas una función suelta \`f()\`, \`this\` apunta al objeto global (\`window\` en el navegador). En modo estricto, \`this\` permanece como \`undefined\`, previniendo la contaminación accidental del objeto global.

3. **Restricciones de sintaxis y optimización de motores:**
- Prohíbe la sentencia arcaica \`with\`.
- Prohíbe parámetros duplicados en funciones: \`function suma(a, a, b)\` arroja \`SyntaxError\`.
- \`arguments\` no refleja mutaciones con los parámetros nombrados.
- Permite a los motores JIT (como V8) compilar código más optimizado al eliminar ambigüedades dinámicas.`,
    "codeSnippet": "'use strict';\nx = 10;                           // ReferenceError (sin strict crearía una global)\nfunction f() { return this; }\nf();                              // undefined (sin strict sería window/globalThis)\ndelete Object.prototype;          // TypeError",
    "seniorTip": "En una entrevista moderna, destaca que hoy en día rara vez necesitas escribir 'use strict' manualmente en tus archivos, porque todo el código escrito en módulos ES (import/export), TypeScript o dentro del cuerpo de una class opera obligatoriamente en modo estricto según la especificación.",
    "tags": [
      "strict-mode",
      "nivel-1",
      "this",
      "javascript"
    ],
    "interactiveDemo": "console"
  }
];
