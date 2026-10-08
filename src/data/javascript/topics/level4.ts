import { JsTopic } from '@/types/javascript';

export const level4Topics: JsTopic[] = [
  {
    "id": "P30",
    "level": 4,
    "levelTitle": "Objetos, prototipos, clases y arrays",
    "question": "¿Qué es la cadena de prototipos?",
    "shortAnswer": "Cada objeto en JavaScript posee un enlace interno privado (`[[Prototype]]`, accesible con `Object.getPrototypeOf`) hacia otro objeto prototipo. Al acceder a una propiedad, el motor la busca en el objeto receptor; si no existe, asciende por la **cadena de prototipos** hasta llegar a `Object.prototype`, cuyo prototipo es `null`.",
    "explanation": `Mecánica y arquitectura de la herencia prototipal:

1. **Cómo opera la búsqueda de propiedades:**
- **Propiedad propia (*Own Property*):** Se comprueba si existe en el propio diccionario del objeto (\`obj.hasOwnProperty('x')\` o \`Object.hasOwn(obj, 'x')\`).
- **Delegación prototipal:** Si no está, el motor sigue el puntero \`[[Prototype]]\`. Si tampoco está en el prototipo, sigue al prototipo del prototipo.
- Si llega a \`Object.prototype\` y sigue sin hallarse, el siguiente enlace es \`null\`, devolviendo \`undefined\`.

2. **Diferencia entre \`prototype\` y \`[[Prototype]]\` (\`__proto__\`):**
- **\`Fn.prototype\`:** Es un objeto ordinario que solo tienen las funciones constructoras y clases. Es el objeto que se asignará como \`[[Prototype]]\` a todas las instancias creadas con \`new Fn()\`.
- **\`[[Prototype]]\` (o accesor \`__proto__\`):** Es el enlace real que posee cada instancia hacia su prototipo.

3. **Creación y manipulación segura:**
- \`Object.create(proto)\`: Crea un nuevo objeto con el prototipo indicado.
- \`Object.getPrototypeOf(obj)\` y \`Object.setPrototypeOf(obj, proto)\`: Métodos oficiales de introspección (evita usar \`__proto__\` en producción).`,
    "codeSnippet": "const animal = { comer() { return 'comiendo'; } };\nconst perro = Object.create(animal);   // perro.__proto__ === animal\nperro.ladrar = () => 'guau';\n\nperro.ladrar();   // propiedad propia\nperro.comer();    // encontrada en la cadena de prototipos\nObject.hasOwn(perro, 'comer');         // false (es heredada)\nObject.getPrototypeOf(perro) === animal; // true",
    "seniorTip": "Alerta de rendimiento en entrevistas: mutar el prototipo de un objeto en runtime con Object.setPrototypeOf es una de las operaciones más lentas en JavaScript porque destruye todas las optimizaciones JIT de inline caching y hidden classes en el motor V8. Si necesitas un prototipo particular, defínelo siempre desde la creación con Object.create().",
    "tags": [
      "prototype",
      "object",
      "nivel-4",
      "javascript",
      "herencia"
    ],
    "interactiveDemo": "prototype"
  },
  {
    "id": "P31",
    "level": 4,
    "levelTitle": "Objetos, prototipos, clases y arrays",
    "question": "¿Qué hace el operador `new`?",
    "shortAnswer": "El operador `new` ejecuta 4 pasos: (1) crea un nuevo objeto plano en memoria, (2) enlaza su `[[Prototype]]` al `prototype` de la función constructora, (3) ejecuta el constructor con `this` apuntando al nuevo objeto, y (4) retorna el nuevo objeto, a menos que el constructor retorne explícitamente otro objeto.",
    "explanation": `Desglose del algoritmo interno de \`new\` según la especificación:

1. **Paso a paso de la invocación con \`new\`:**
1. **Creación del objeto:** Se asigna un nuevo objeto vacío en el Heap (\`{}\`).
2. **Vinculación del prototipo:** Se establece \`Object.setPrototypeOf(nuevoObj, Constructor.prototype)\`.
3. **Ejecución del constructor:** Se invoca la función pasando \`nuevoObj\` como contexto \`this\` (\`Constructor.apply(nuevoObj, args)\`).
4. **Retorno:** Si la función constructora devuelve un objeto primitivo (número, string) o nada (\`undefined\`), \`new\` ignora ese retorno y devuelve \`nuevoObj\`. Si devuelve explícitamente una instancia de objeto (\`return { custom: true }\`), \`new\` devuelve ese objeto alternativo.

2. **Cómo detectar si una función se llamó con \`new\`:**
En ES6 se introdujo la metapropiedad **\`new.target\`**: apunta a la función constructora cuando se invoca con \`new\`, y vale \`undefined\` si se invoca como función normal.`,
    "codeSnippet": "function Persona(nombre) {\n  this.nombre = nombre;\n}\nPersona.prototype.saludar = function () {\n  return `Hola ${this.nombre}`;\n};\n\nconst p = new Persona('Ana');\np.saludar();                          // 'Hola Ana'\np instanceof Persona;                 // true\nObject.getPrototypeOf(p) === Persona.prototype; // true",
    "seniorTip": "Un ejercicio clásico de entrevista técnica Senior es pedirte que programes un polyfill de new: function miNew(Constructor, ...args) { const obj = Object.create(Constructor.prototype); const res = Constructor.apply(obj, args); return (typeof res === 'object' && res !== null) ? res : obj; }",
    "tags": [
      "prototype",
      "nivel-4",
      "this",
      "javascript",
      "new"
    ],
    "interactiveDemo": "prototype"
  },
  {
    "id": "P32",
    "level": 4,
    "levelTitle": "Objetos, prototipos, clases y arrays",
    "question": "¿Las clases de ES6 son clases \"reales\"?",
    "shortAnswer": "Las clases de ES6 son principalmente **azúcar sintáctico (*syntactic sugar*)** sobre el modelo de herencia prototipal existente. No introducen un nuevo modelo orientado a objetos, pero aportan garantías estrictas: siempre se ejecutan en modo estricto, no admiten hoisting utilizable (TDZ) y lanzan `TypeError` si se invocan sin `new`.",
    "explanation": `Diferencias técnicas cruciales entre clases de ES6 y funciones constructoras:

1. **Por debajo del capó:**
Declarar \`class Persona { saludar() {} }\` sigue creando una función (\`typeof Persona === 'function'\`) y asignando métodos a su prototipo (\`Persona.prototype.saludar\`).

2. **Garantías y mejoras de la sintaxis \`class\`:**
- **Invocación segura:** No se pueden llamar como funciones ordinarias (\`Persona()\` lanza \`TypeError: Class constructor Persona cannot be invoked without 'new'\`), mientras que con funciones constructoras era fácil olvidar \`new\` y contaminar \`window\`.
- **Métodos no enumerables:** Los métodos definidos dentro de una \`class\` se crean con \`enumerable: false\` en el prototipo, evitando que aparezcan inesperadamente en bucles \`for...in\`.
- **Modo estricto obligatorio:** Todo el código dentro del cuerpo de la clase se ejecuta en \`'use strict'\`.
- **No se elevan como funciones:** Están en la TDZ igual que \`let\` y \`const\`.
- **Soporte de miembros privados nativos (\`#\`) y bloques de inicialización estáticos (\`static {}\`).**`,
    "codeSnippet": "class Persona {\n  constructor(nombre) { this.nombre = nombre; }\n  saludar() { return `Hola ${this.nombre}`; }   // va en Persona.prototype\n  static crear(n) { return new Persona(n); }    // método estático en la clase\n}\ntypeof Persona;                                    // 'function'\nPersona.prototype.saludar === new Persona('x').saludar; // true",
    "seniorTip": "Si el entrevistador te pregunta si las clases de JS son iguales a las de Java o C#, aclara que NO: en lenguajes basados en clases reales, la clase es un molde que se instancia mediante copias de estructura. En JavaScript, todas las instancias siguen enlazadas dinámicamente al mismo objeto prototipo en memoria mediante punteros [[Prototype]].",
    "tags": [
      "strict-mode",
      "nivel-4",
      "javascript",
      "clases",
      "es6"
    ],
    "interactiveDemo": "console"
  },
  {
    "id": "P33",
    "level": 4,
    "levelTitle": "Objetos, prototipos, clases y arrays",
    "question": "¿Cómo funciona la herencia con `extends` y `super`?",
    "shortAnswer": "`extends` establece la cadena de prototipos tanto entre las clases (para métodos estáticos) como entre sus prototipos (para métodos de instancia). `super()` invoca el constructor de la clase padre y es obligatorio llamarlo antes de poder acceder a `this` en el constructor derivado.",
    "explanation": `Mecánica de la herencia y el rol de \`super\`:

1. **Doble enlace prototipal:**
Cuando \`class Perro extends Animal\` se ejecuta:
- Para instancias: \`Object.getPrototypeOf(Perro.prototype) === Animal.prototype\` (herencia de métodos normales).
- Para estáticos: \`Object.getPrototypeOf(Perro) === Animal\` (herencia de métodos estáticos \`Animal.metodoEstatico()\`).

2. **Por qué \`super()\` es obligatorio antes de \`this\`:**
En clases derivadas, el constructor de la subclase no crea el objeto \`this\` de forma independiente. Delega la creación de la instancia en memoria al constructor de la clase base padre mediante \`super()\`. Hasta que \`super()\` no termina y retorna la instancia, \`this\` no existe y acceder a él arroja \`ReferenceError: Must call super constructor in derived class before accessing 'this'\`.

3. **Uso de \`super\` en métodos:**
- En métodos ordinarios, \`super.hablar()\` accede al método de la clase padre enlazando automáticamente el \`this\` de la instancia actual.`,
    "codeSnippet": "class Animal {\n  constructor(nombre) { this.nombre = nombre; }\n  hablar() { return `${this.nombre} hace un ruido`; }\n}\n\nclass Perro extends Animal {\n  constructor(nombre, raza) {\n    super(nombre);            // obligatorio antes de usar this\n    this.raza = raza;\n  }\n  hablar() { return `${super.hablar()} y ladra`; }  // llama al método del padre\n}\n\nnew Perro('Rex', 'Labrador').hablar(); // 'Rex hace un ruido y ladra'",
    "seniorTip": "Menciona que super utiliza internamente el slot interno [[HomeObject]] en la especificación ECMAScript para saber cuál es la clase padre sin depender de cómo se invoca el método. Por esta razón, extraer o reasignar métodos que usan super fuera de la clase puede perder la referencia estática a la clase padre.",
    "tags": [
      "nivel-4",
      "javascript",
      "herencia",
      "super",
      "clases"
    ],
    "interactiveDemo": "console"
  },
  {
    "id": "P34",
    "level": 4,
    "levelTitle": "Objetos, prototipos, clases y arrays",
    "question": "¿Cómo se declaran miembros privados?",
    "shortAnswer": "Los miembros privados se declaran anteponiendo el símbolo hash (`#nombre`). Ofrecen **privacidad real y estricta en tiempo de ejecución**, forzada por el propio motor de JavaScript; intentar leer o modificar un campo privado desde fuera de la clase arroja un `SyntaxError` inmediato.",
    "explanation": `Características técnicas de los campos privados de ES2022:

1. **Privacidad Dura (*Hard Private*) vs Blanda (*Soft Private*):**
- Convención \`_propiedad\`: Es pública; cualquiera puede leerla o mutarla.
- TypeScript \`private propiedad\`: Solo se comprueba en tiempo de compilación. Al compilar a JavaScript se convierte en una propiedad pública ordinaria accesible con \`(obj as any).propiedad\`.
- Campos nativos \`#propiedad\`: Ni TypeScript ni JavaScript en runtime permiten acceder a ellos fuera del cuerpo léxico de la clase. Ni siquiera \`Object.getOwnPropertyNames()\`, \`Object.keys()\` o \`Reflect\` pueden listarlos.

2. **Soporte de miembros:**
- Propiedades de instancia: \`#saldo = 0;\`
- Métodos privados: \`#calcularComision() { ... }\`
- Getters y setters privados: \`get #id() { ... }\`
- Campos y métodos estáticos privados: \`static #instanciaUnica;\`

3. **Comprobación segura de pertenencia con operador \`in\`:**
Puedes verificar si un objeto contiene un campo privado sin lanzar excepciones:
\`if (#saldo in objeto) { /* es una instancia legítima con ese campo privado */ }\``,
    "codeSnippet": "class Cuenta {\n  #saldo = 0;\n  static #total = 0;\n\n  depositar(n) { this.#saldo += n; Cuenta.#total++; }\n  get saldo() { return this.#saldo; }\n  #validar() { return this.#saldo >= 0; }\n}\nconst c = new Cuenta();\n// c.#saldo;     → SyntaxError: Private field '#saldo' must be declared in an enclosing class\nconsole.log(c.saldo); // 0 (a través del getter)",
    "seniorTip": "Resalta que los campos privados # no se almacenan como propiedades de objeto convencionales en la tabla hash de propiedades, sino en slots internos de clave débil (PrivateElements) asociados a la instancia. Esto hace que no entren en colisiones de nombres con clases hijas en casos de herencia.",
    "tags": [
      "nivel-4",
      "javascript",
      "privacidad",
      "es2022"
    ],
    "interactiveDemo": "console"
  },
  {
    "id": "P35",
    "level": 4,
    "levelTitle": "Objetos, prototipos, clases y arrays",
    "question": "¿Cuáles son los métodos de array más importantes y cuáles mutan el original?",
    "shortAnswer": "Los métodos inmutables (`map`, `filter`, `reduce`, `slice`, `flat`) devuelven nuevos arrays sin alterar el original. Los métodos mutables (`push`, `pop`, `shift`, `unshift`, `splice`, `sort`, `reverse`) modifican el array original en sitio. ES2023 introdujo alternativas inmutables nativas: `toSorted`, `toReversed`, `toSpliced` y `with`.",
    "explanation": `Matriz exhaustiva de métodos de \`Array.prototype\`:

| Método | Propósito | ¿Muta el array original? |
|---|---|---|
| \`map(fn)\` | Transforma cada elemento proyectándolo | **No** (nuevo array) |
| \`filter(fn)\` | Filtra elementos según predicado | **No** (nuevo array) |
| \`reduce(fn, init)\` | Reduce la colección a un único valor acumulado | **No** |
| \`slice(start, end)\` | Extrae una porción superficial del array | **No** (nuevo array) |
| \`flat(depth)\` / \`flatMap(fn)\` | Aplana arrays multidimensionales | **No** (nuevo array) |
| \`concat(...items)\` | Concatena múltiples arrays o valores | **No** (nuevo array) |
| \`toSorted()\` / \`toReversed()\` | Ordena o invierte inmutablemente (ES2023) | **No** (nuevo array) |
| \`toSpliced()\` / \`with(idx, val)\` | Reemplaza o elimina elementos (ES2023) | **No** (nuevo array) |
| \`push()\` / \`pop()\` | Agrega o extrae al final | **Sí** (muta) |
| \`unshift()\` / \`shift()\` | Agrega o extrae al inicio | **Sí** (muta) |
| \`splice(start, count, ...items)\` | Elimina/inserta elementos en cualquier índice | **Sí** (muta) |
| \`sort(comparator)\` | Ordena los elementos en sitio | **Sí** (muta) |
| \`reverse()\` | Invierte el orden de los elementos en sitio | **Sí** (muta) |

Peligro mayúsculo de \`sort()\`: Sin función de comparación, convierte todo a string: \`[10, 9, 2].sort()\` resulta en \`[10, 2, 9]\` porque \`'10'\` antecede alfabéticamente a \`'2'\`.`,
    "codeSnippet": "const nums = [3, 1, 2];\n[...nums].sort((a, b) => a - b);   // [1, 2, 3] sin mutar el original\nnums.toSorted((a, b) => a - b);    // igual, forma nativa ES2023\n\n[10, 9, 1].sort();                  // [1, 10, 9]: ordena como strings sin comparador\n[[1, 2], [3, [4]]].flat(Infinity);  // [1, 2, 3, 4]\n\n// reduce: agrupar por propiedad\nconst personas = [{ edad: 20 }, { edad: 20 }, { edad: 30 }];\nconst porEdad = personas.reduce((acc, p) => {\n  (acc[p.edad] ||= []).push(p);\n  return acc;\n}, {});",
    "seniorTip": "En aplicaciones con React, Zustand o Redux, la mutabilidad es la fuente número uno de bugs por falta de re-renderizado (ya que React compara referencias con Object.is). Nunca ejecutes .sort() o .reverse() directamente sobre el estado; usa [...arr].sort(...) o el moderno arr.toSorted(...).",
    "tags": [
      "nivel-4",
      "javascript",
      "array",
      "inmutabilidad"
    ],
    "interactiveDemo": "console"
  },
  {
    "id": "P36",
    "level": 4,
    "levelTitle": "Objetos, prototipos, clases y arrays",
    "question": "¿Qué es la desestructuración?",
    "shortAnswer": "La **desestructuración** es una sintaxis de asignación que permite desempaquetar valores de arrays o propiedades de objetos directamente en variables distintas de forma concisa. Permite renombrar variables, asignar valores por defecto, anidar patrones y extraer el resto con operadores rest.",
    "explanation": `Capacidades y patrones avanzados:

1. **Desestructuración de Objetos:**
- Coincidencia por nombre de clave: \`const { nombre, edad } = usuario;\`
- Renombrado de variables: \`const { nombre: alias, id: userId } = usuario;\`
- Valores por defecto: \`const { rol = 'invitado' } = usuario;\` (se aplica solo ante \`undefined\`).
- Parámetro rest en objetos: \`const { password, ...usuarioPublico } = usuario;\` (excelente para sanitizar datos).

2. **Desestructuración de Arrays:**
- Coincidencia por posición ordenada: \`const [primero, segundo] = lista;\`
- Ignorar posiciones con comas: \`const [primero, , tercero] = lista;\`
- Intercambio elegante de variables (*Swap*): \`[a, b] = [b, a];\` sin necesidad de variable temporal auxiliar.
- Rest en arrays: \`const [cabeza, ...cola] = lista;\`

3. **Desestructuración en parámetros de funciones:**
Permite simular parámetros nombrados limpios con valores por defecto integrados:
\`function configurar({ puerto = 3000, host = 'localhost', ssl = false } = {}) {}\`
*(Notar el \`= {}\` al final para permitir invocar \`configurar()\` sin argumentos sin arrojar TypeError).*`,
    "codeSnippet": "// Objetos\nconst usuario = { nombre: 'Ana', rol: 'admin' };\nconst { nombre: alias, edad = 18, ...resto } = usuario;\n\n// Arrays: swap sin variable temporal\nlet a = 1, b = 2;\n[a, b] = [b, a];\n\n// En parámetros de funciones con fallback total\nfunction pintar({ x = 0, y = 0, color = 'rojo' } = {}) {\n  return `${color} en (${x}, ${y})`;\n}",
    "seniorTip": "Ten siempre presente el peligro del anidamiento profundo con valores nulos: const { direccion: { calle } } = usuario; lanzará TypeError si direccion es undefined. La forma segura es aportar un fallback en el nivel intermedio: const { direccion: { calle } = {} } = usuario;.",
    "tags": [
      "nivel-4",
      "javascript",
      "destructuring",
      "es6"
    ],
    "interactiveDemo": "console"
  },
  {
    "id": "P37",
    "level": 4,
    "levelTitle": "Objetos, prototipos, clases y arrays",
    "question": "¿Diferencia entre copia superficial (*shallow*) y profunda (*deep*)?",
    "shortAnswer": "Una **copia superficial** (*shallow copy*) solo duplica el primer nivel de propiedades; las estructuras anidadas siguen apuntando a la misma referencia en memoria. Una **copia profunda** (*deep copy*) duplica recursivamente todos los niveles del árbol de objetos.",
    "explanation": `Técnicas de clonación y sus limitaciones:

1. **Copias Superficiales (\`{ ...obj }\`, \`Object.assign()\`, \`[...arr]\`, \`arr.slice()\`):**
- Rápidas y eficientes en memoria.
- **Peligro:** Si modificas \`copia.usuario.direccion.calle = 'nueva'\`, estás mutando también el objeto original porque el subobjeto \`direccion\` no fue duplicado.

2. **Copias Profundas: \`structuredClone(obj)\` (Estándar Moderno Web y Node 17+):**
- La API nativa recomendada por el estándar HTML y ECMAScript.
- Clona correctamente fechas (\`Date\`), colecciones (\`Map\`, \`Set\`), expresiones regulares (\`RegExp\`) y referencias cíclicas sin desbordar la pila.
- **Limitación:** Lanza \`DOMException\` si el objeto contiene funciones, métodos, o símbolos en claves.

3. **Copias Profundas con \`JSON.parse(JSON.stringify(obj))\` (Técnica Arcaica con trampas):**
- Pierde propiedades con valor \`undefined\`, funciones y \`Symbol\` (los elimina silenciosamente).
- Convierte instancias de \`Date\` en strings ISO, rompiendo sus métodos de fecha.
- Convierte \`NaN\` e \`Infinity\` a \`null\`.
- Lanza un \`TypeError\` fatal si el objeto contiene referencias circulares.`,
    "codeSnippet": "const original = { a: 1, anidado: { b: 2 }, fecha: new Date() };\n\nconst shallow = { ...original };            // también Object.assign, Array.slice\nshallow.anidado.b = 99;\nconsole.log(original.anidado.b);            // 99 (¡afectado por compartir referencia!)\n\nconst deep = structuredClone(original);     // clonación profunda moderna\ndeep.anidado.b = 500;\nconsole.log(original.anidado.b);            // 99 (intacto)",
    "seniorTip": "En una entrevista Senior, si te preguntan cómo clonarías un objeto con estado complejo en frontend moderno, responde categóricamente con structuredClone(). Si necesitas clonar funciones o prototipos de clases, aclara que se debe emplear una función recursiva personalizada con WeakMap para resolver ciclos.",
    "tags": [
      "nivel-4",
      "javascript",
      "clonacion",
      "structured-clone"
    ],
    "interactiveDemo": "console"
  },
  {
    "id": "P38",
    "level": 4,
    "levelTitle": "Objetos, prototipos, clases y arrays",
    "question": "¿Diferencia entre `Object.freeze`, `seal` y `preventExtensions`?",
    "shortAnswer": "`Object.preventExtensions` prohíbe añadir nuevas propiedades. `Object.seal` prohíbe añadir y eliminar propiedades pero permite modificar las existentes. `Object.freeze` prohíbe añadir, eliminar y modificar propiedades (inmutabilidad superficial completa).",
    "explanation": `Matriz comparativa de control de integridad de objetos:

| Método | Añadir propiedades | Eliminar propiedades | Modificar valores existentes | Modificar descriptores |
|---|---|---|---|---|
| \`Object.preventExtensions(obj)\` | **No** | Sí | Sí | Sí |
| \`Object.seal(obj)\` | **No** | **No** | Sí | **No** (configurable: false) |
| \`Object.freeze(obj)\` | **No** | **No** | **No** (writable: false) | **No** (configurable: false) |

Aspecto crítico: La congelación es **SUPERFICIAL (*Shallow Freeze*)**:
Si un objeto congelado tiene propiedades cuyos valores son otros objetos o arrays, las propiedades internas de esos subobjetos **siguen siendo mutables**.

Para lograr una congelación profunda genuina (*Deep Freeze*):
\`function deepFreeze(obj) { Object.keys(obj).forEach(prop => { if (typeof obj[prop] === 'object' && obj[prop] !== null) deepFreeze(obj[prop]); }); return Object.freeze(obj); }\``,
    "codeSnippet": "const o = Object.freeze({ a: 1, interno: { b: 2 } });\no.a = 5;            // se ignora (lanza TypeError en 'use strict')\no.interno.b = 99;   // ¡funciona!: freeze es SUPERFICIAL\nconsole.log(Object.isFrozen(o)); // true",
    "seniorTip": "En modo no estricto, intentar modificar un objeto congelado falla de forma silenciosa. En modo estricto ('use strict'), arroja un TypeError: Cannot assign to read only property. Por eso 'use strict' es vital en bases de código que operan con estructuras inmutables.",
    "tags": [
      "object",
      "nivel-4",
      "javascript",
      "inmutabilidad"
    ],
    "interactiveDemo": "console"
  },
  {
    "id": "P39",
    "level": 4,
    "levelTitle": "Objetos, prototipos, clases y arrays",
    "question": "¿Cuándo usar `Map`/`Set` en vez de objeto/array?",
    "shortAnswer": "`Map` admite **cualquier tipo de dato como clave** (incluidos objetos y funciones), preserva el orden de inserción y tiene mejor rendimiento en adición/eliminación frecuente. `Set` garantiza elementos **únicos**. Sus variantes `WeakMap` y `WeakSet` mantienen referencias débiles que no impiden el Garbage Collection.",
    "explanation": `Cuándo elegir cada estructura de datos:

1. **\`Map\` vs Objeto plano (\`{}\`):**
- **Tipos de clave:** Los objetos solo admiten \`string\` y \`symbol\` (cualquier otra cosa se convierte con \`.toString()\`, causando colisiones como \`{[obj]: 1}\`); \`Map\` admite objetos, funciones y primitivos como claves diferenciadas por identidad.
- **Tamaño:** \`map.size\` es directo e instantáneo ($O(1)$), mientras que en objetos requiere \`Object.keys(obj).length\` ($O(n)$).
- **Rendimiento:** \`Map\` está altamente optimizado a nivel de motor C++ para inserciones y eliminaciones continuas de pares clave-valor.
- **Sin claves prototipales:** Un objeto plano hereda propiedades como \`toString\` o \`constructor\`; \`Map\` es limpio.

2. **\`Set\` vs Array (\`[]\`):**
- \`Set\` garantiza unicidad sin duplicados: ideal para deduplicar colecciones (\`[...new Set(array)]\`) en tiempo $O(n)$ frente a los costosos \`filter + indexOf\` ($O(n^2)$).
- Búsqueda de pertenencia: \`set.has(x)\` opera en tiempo constante promedio **$O(1)$**, mientras que \`array.includes(x)\` requiere escaneo lineal **$O(n)$**.

3. **\`WeakMap\` y \`WeakSet\`:**
- Solo aceptan objetos como claves.
- Las referencias a las claves son **débiles**: si el objeto no tiene otras referencias vivas en la aplicación, el recolector de basura lo destruye junto a su entrada en el WeakMap, evitando memory leaks.`,
    "codeSnippet": "const m = new Map();\nconst clave = { id: 1 };\nm.set(clave, 'dato').set('x', 1);\nconsole.log(m.get(clave)); // 'dato'\nconsole.log(m.size);       // 2\n\n// Deduplicación O(n)\nconst unicos = [...new Set([1, 2, 2, 3, 3])]; // [1, 2, 3]\n\n// WeakMap: metadatos asociados sin fugas de memoria\nconst privados = new WeakMap();\nclass A { constructor() { privados.set(this, { secreto: 1 }); } }",
    "seniorTip": "El caso de uso predilecto de WeakMap en entrevistas es el almacenamiento de metadatos o caché privada para elementos del DOM o instancias de clases sin temor a fugas de memoria: cuando el nodo DOM se elimina de la página, sus datos asociados en el WeakMap se limpian automáticamente.",
    "tags": [
      "nivel-4",
      "javascript",
      "map",
      "set",
      "estructuras-datos"
    ],
    "interactiveDemo": "console"
  },
  {
    "id": "P40",
    "level": 4,
    "levelTitle": "Objetos, prototipos, clases y arrays",
    "question": "¿Qué es un `Symbol`?",
    "shortAnswer": "Un `Symbol` es un tipo de dato primitivo garantizado como **único e inmutable**. Se utiliza principalmente como identificador de propiedad en objetos para evitar colisiones de nombres accidentales y para implementar protocolos internos del lenguaje a través de los *Well-Known Symbols*.",
    "explanation": `Mecánica y usos esenciales de \`Symbol\`:

1. **Unicidad Absoluta:**
Cada llamada a \`Symbol('descripcion')\` crea un símbolo completamente nuevo e irrepetible:
\`Symbol('id') === Symbol('id')\` es siempre \`false\`. La descripción es solo una etiqueta para depuración.

2. **Propiedades semi-privadas / ocultas:**
Las propiedades cuyas claves son símbolos no son enumerables por bucles \`for...in\`, \`Object.keys()\` ni \`JSON.stringify()\`. Sin embargo, no son privadas en sentido estricto, ya que pueden listarse con \`Object.getOwnPropertySymbols(obj)\` o \`Reflect.ownKeys(obj)\`.

3. **Registro Global de Símbolos:**
- \`Symbol.for('clave')\`: Busca si ya existe un símbolo con esa clave en el registro global del runtime; si no existe, lo crea y lo registra. Permite compartir el mismo símbolo entre distintos módulos o iframes.

4. **Símbolos bien conocidos (*Well-Known Symbols*):**
Puntos de enlace para alterar el comportamiento del lenguaje:
- \`Symbol.iterator\`: Permite que cualquier objeto sea iterable con \`for...of\` o spread.
- \`Symbol.hasInstance\`: Personaliza el operador \`instanceof\`.
- \`Symbol.toPrimitive\`: Controla la coerción de tipos del objeto.`,
    "codeSnippet": "const id = Symbol('id');\nconst u = { [id]: 123, nombre: 'Ana' };\nconsole.log(Object.keys(u));                 // ['nombre']  (los symbols se omiten)\nconsole.log(Object.getOwnPropertySymbols(u)); // [Symbol(id)]\n\nSymbol('a') === Symbol('a');    // false\nSymbol.for('a') === Symbol.for('a'); // true (registro global compartido)",
    "seniorTip": "Resalta en entrevistas que los Symbols resolvieron el problema histórico de extensión de prototipos nativos: permiten a los comités de TC39 añadir nuevos métodos universales a Array u Object sin colisionar con métodos que librerías externas (como MooTools o jQuery) ya hubiesen inyectado en el pasado.",
    "tags": [
      "nivel-4",
      "javascript",
      "symbols",
      "primitivos"
    ],
    "interactiveDemo": "console"
  },
  {
    "id": "P41",
    "level": 4,
    "levelTitle": "Objetos, prototipos, clases y arrays",
    "question": "¿Qué son *getters*, *setters* y `Object.defineProperty`?",
    "shortAnswer": "Los *getters* (`get`) y *setters* (`set`) son descriptores de acceso que vinculan una propiedad de un objeto a funciones ejecutadas al leer o escribir en ella. `Object.defineProperty` permite configurar de forma precisa los descriptores internos de una propiedad: `value`, `writable`, `enumerable` y `configurable`.",
    "explanation": `Anatomía de los descriptores de propiedad (*Property Descriptors*):

1. **Descriptores de Acceso (*Accessor Descriptors*):**
- \`get propiedad()\`: Se ejecuta al evaluar \`obj.propiedad\`. Permite calcular valores al vuelo o registrar accesos.
- \`set propiedad(valor)\`: Se ejecuta al asignar \`obj.propiedad = nuevo\`. Permite validación, transformación o disparar reactividad.

2. **Los 4 atributos configurables con \`Object.defineProperty\`:**
- **\`value\`:** El dato contenido.
- **\`writable\` (booleano):** Si es \`true\`, el valor puede modificarse con el operador de asignación.
- **\`enumerable\` (booleano):** Si es \`true\`, la propiedad aparece en bucles \`for...in\` y \`Object.keys()\`. Si es \`false\`, queda oculta a la iteración.
- **\`configurable\` (booleano):** Si es \`true\`, la propiedad puede ser eliminada con \`delete\` y sus atributos pueden ser cambiados posteriormente. Si es \`false\`, queda fijada para siempre.

3. **Importancia histórica en frameworks:**
Vue 2 construyó todo su sistema de reactividad transformando recursivamente cada propiedad de estado en getters y setters mediante \`Object.defineProperty\`.`,
    "codeSnippet": "const persona = {\n  nombre: 'Ana', apellido: 'Gómez',\n  get completo() { return `${this.nombre} ${this.apellido}`; },\n  set completo(v) { [this.nombre, this.apellido] = v.split(' '); },\n};\npersona.completo = 'Luis Pérez';\nconsole.log(persona.nombre); // 'Luis'\n\nObject.defineProperty(persona, 'id', {\n  value: 1,\n  writable: false,\n  enumerable: false,\n  configurable: false,\n});",
    "seniorTip": "Conectar Object.defineProperty con la evolución de frameworks demuestra seniority: explica cómo Vue 2 dependía de Object.defineProperty (lo que le impedía detectar adición o borrado de propiedades sin Vue.set), razón por la cual Vue 3 migró a la API moderna de Proxy (ES6), que intercepta el objeto completo.",
    "tags": [
      "object",
      "nivel-4",
      "javascript",
      "reactividad",
      "getters-setters"
    ],
    "interactiveDemo": "console"
  },
  {
    "id": "P42",
    "level": 4,
    "levelTitle": "Objetos, prototipos, clases y arrays",
    "question": "¿Diferencia entre `for...in` y `for...of`?",
    "shortAnswer": "`for...in` recorre las **claves o nombres de propiedad enumerables** de un objeto (incluyendo las heredadas en su prototipo) como cadenas de texto. `for...of` recorre los **valores producidos por un iterable** (arrays, strings, Map, Set, generadores) utilizando el protocolo `Symbol.iterator`.",
    "explanation": `Diferencias técnicas fundamentales:

1. **\`for...in\` (Diseñado para objetos):**
- Itera sobre **claves** (*keys*).
- **Trampas letales:** Recorre también propiedades enumerables de la cadena de prototipos. Si una librería añade un método a \`Array.prototype\`, \`for...in\` en un array lo listará como índice.
- Devuelve las claves como strings (\`'0'\`, \`'1'\`), no como números.
- El orden de recorrido no está 100% garantizado en especificaciones antiguas.

2. **\`for...of\` (Diseñado para colecciones iterables):**
- Itera sobre **valores** (*values*).
- Solo funciona con objetos que implementen el protocolo de iteración \`[Symbol.iterator]()\`.
- Intentar ejecutar \`for...of\` sobre un objeto plano ordinario (\`{ a: 1 }\`) arroja \`TypeError: obj is not iterable\`.
- Para recorrer objetos con \`for...of\`, se combinan métodos de ayuda:
  - \`for (const [clave, valor] of Object.entries(obj))\`
  - \`for (const clave of Object.keys(obj))\`
  - \`for (const valor of Object.values(obj))\``,
    "codeSnippet": "const arr = ['a', 'b'];\nfor (const i in arr) console.log(i);   // '0', '1' (claves string)\nfor (const v of arr) console.log(v);   // 'a', 'b' (valores del iterable)\n\n// Para objetos con for...of\nfor (const [k, v] of Object.entries({ x: 1, y: 2 })) {\n  console.log(k, v); // x 1, y 2\n}",
    "seniorTip": "Regla mnemotécnica clara: for...in para propiedades internas de objetos; for...of para elementos de colecciones iterables. Nunca uses for...in para recorrer arrays; utiliza for...of, for clásico o métodos de orden superior como .forEach().",
    "tags": [
      "nivel-4",
      "javascript",
      "bucles",
      "iterables"
    ],
    "interactiveDemo": "console"
  },
  {
    "id": "P43",
    "level": 4,
    "levelTitle": "Objetos, prototipos, clases y arrays",
    "question": "¿Qué cosas \"raras\" tiene `JSON.stringify`?",
    "shortAnswer": "`JSON.stringify` tiene particularidades críticas: omite propiedades con `undefined`, funciones y `Symbol` en objetos (o los convierte en `null` dentro de arrays), convierte `NaN` e `Infinity` a `null`, transforma `Date` en string ISO, lanza `TypeError` con `BigInt` o referencias cíclicas, y admite un parámetro `replacer` e indentación.",
    "explanation": `Comportamientos insospechados de la serialización JSON:

1. **Valores omitidos o alterados:**
- **En objetos literales:** Las claves con valor \`undefined\`, funciones o \`Symbol\` son **completamente eliminadas** del string resultante: \`JSON.stringify({ a: undefined, b: () => {} })\` produce \`"{}"\`.
- **En arrays:** Para no alterar la indexación posicional, se transforman en \`null\`: \`JSON.stringify([undefined, () => {}])\` produce \`"[null,null]"\`.
- **Valores matemáticos especiales:** \`NaN\` e \`Infinity\` se serializan como \`null\`: \`JSON.stringify({ n: NaN })\` produce \`{"n":null}\`.

2. **Excepciones fatales (\`TypeError\`):**
- **Referencias circulares:** Si un objeto se referencia a sí mismo en alguna propiedad, lanza \`TypeError: Converting circular structure to JSON\`.
- **BigInt:** \`JSON.stringify(10n)\` arroja \`TypeError: Do not know how to serialize a BigInt\` (porque JSON no define sintaxis para BigInt).

3. **Parámetros avanzados (\`replacer\` y \`space\`):**
\`JSON.stringify(valor, replacer, space)\`
- \`replacer\`: Puede ser un array de claves permitidas (*whitelist*) o una función filtro/transformadora \`(key, value) => ...\`.
- \`space\`: Número de espacios para formatear e indentar el JSON resultante de forma legible (ej. \`2\`).
- Método \`.toJSON()\`: Si un objeto tiene definido un método \`toJSON()\`, \`JSON.stringify\` utilizará su valor de retorno.`,
    "codeSnippet": "JSON.stringify({ a: undefined, b: () => {}, c: Symbol('x') }); // '{}' (se omiten)\nJSON.stringify([undefined, () => {}]);                          // '[null,null]'\nJSON.stringify({ f: new Date(0) });                             // fecha → string ISO\nJSON.stringify({ n: NaN, i: Infinity });                        // '{\"n\":null,\"i\":null}'\n// JSON.stringify(10n);                                         // TypeError (BigInt)\nJSON.stringify({ a: 1, b: 2 }, null, 2);                         // formateado con 2 espacios",
    "seniorTip": "Si necesitas serializar un objeto que contiene BigInts, implementa un replacer personalizado: JSON.stringify(datos, (k, v) => typeof v === 'bigint' ? v.toString() : v). También menciona que nunca debes usar JSON.stringify para clonar objetos en producción por las pérdidas silenciosas de tipos de datos.",
    "tags": [
      "nivel-4",
      "javascript",
      "json",
      "serializacion"
    ],
    "interactiveDemo": "console"
  }
];
