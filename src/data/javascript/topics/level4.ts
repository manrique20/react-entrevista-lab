import { JsTopic } from '@/types/javascript';

export const level4Topics: JsTopic[] = [
  {
    "id": "P30",
    "level": 4,
    "levelTitle": "Objetos, prototipos, clases y arrays",
    "question": "¿Qué es la cadena de prototipos?",
    "shortAnswer": "cada objeto tiene un enlace interno `[[Prototype]]` a otro objeto. Al buscar una propiedad, JS la busca en el objeto y, si no está, **sube por la cadena** hasta `Object.prototype` y luego `null`. Así funciona la herencia.",
    "explanation": "cada objeto tiene un enlace interno `[[Prototype]]` a otro objeto. Al buscar una propiedad, JS la busca en el objeto y, si no está, **sube por la cadena** hasta `Object.prototype` y luego `null`. Así funciona la herencia.",
    "codeSnippet": "const animal = { comer() { return 'comiendo'; } };\nconst perro = Object.create(animal);   // perro.__proto__ === animal\nperro.ladrar = () => 'guau';\n\nperro.ladrar();   // propiedad propia\nperro.comer();    // encontrada en el prototipo\nperro.hasOwnProperty('comer');         // false\nObject.getPrototypeOf(perro) === animal; // true",
    "seniorTip": "",
    "tags": [
      "prototype",
      "object",
      "nivel-4",
      "javascript"
    ],
    "interactiveDemo": "prototype"
  },
  {
    "id": "P31",
    "level": 4,
    "levelTitle": "Objetos, prototipos, clases y arrays",
    "question": "¿Qué hace el operador `new`?",
    "shortAnswer": "(1) crea un objeto vacío, (2) enlaza su prototipo al `prototype` de la función, (3) ejecuta la función con `this` apuntando a ese objeto, (4) devuelve el objeto (salvo que la función devuelva otro objeto).",
    "explanation": "(1) crea un objeto vacío, (2) enlaza su prototipo al `prototype` de la función, (3) ejecuta la función con `this` apuntando a ese objeto, (4) devuelve el objeto (salvo que la función devuelva otro objeto).",
    "codeSnippet": "function Persona(nombre) { this.nombre = nombre; }\nPersona.prototype.saludar = function () { return `Hola ${this.nombre}`; };\n\nconst p = new Persona('Ana');\np.saludar();                          // 'Hola Ana'\np instanceof Persona;                 // true\nObject.getPrototypeOf(p) === Persona.prototype; // true",
    "seniorTip": "",
    "tags": [
      "prototype",
      "nivel-4",
      "this",
      "javascript"
    ],
    "interactiveDemo": "prototype"
  },
  {
    "id": "P32",
    "level": 4,
    "levelTitle": "Objetos, prototipos, clases y arrays",
    "question": "¿Las clases de ES6 son clases \"reales\"?",
    "shortAnswer": "son **azúcar sintáctico** sobre la herencia prototipal. `class` sigue creando funciones y prototipos, aunque con diferencias: no se elevan como las funciones, siempre usan strict mode y deben llamarse con `new`.",
    "explanation": "son **azúcar sintáctico** sobre la herencia prototipal. `class` sigue creando funciones y prototipos, aunque con diferencias: no se elevan como las funciones, siempre usan strict mode y deben llamarse con `new`.",
    "codeSnippet": "class Persona {\n  constructor(nombre) { this.nombre = nombre; }\n  saludar() { return `Hola ${this.nombre}`; }   // va en Persona.prototype\n  static crear(n) { return new Persona(n); }    // método estático\n}\ntypeof Persona;                                    // 'function'\nPersona.prototype.saludar === new Persona('x').saludar; // true",
    "seniorTip": "",
    "tags": [
      "strict-mode",
      "nivel-4",
      "javascript"
    ],
    "interactiveDemo": "console"
  },
  {
    "id": "P33",
    "level": 4,
    "levelTitle": "Objetos, prototipos, clases y arrays",
    "question": "¿Cómo funciona la herencia con `extends` y `super`?",
    "shortAnswer": "¿Cómo funciona la herencia con `extends` y `super`?",
    "explanation": "¿Cómo funciona la herencia con `extends` y `super`?",
    "codeSnippet": "class Animal {\n  constructor(nombre) { this.nombre = nombre; }\n  hablar() { return `${this.nombre} hace un ruido`; }\n}\n\nclass Perro extends Animal {\n  constructor(nombre, raza) {\n    super(nombre);            // obligatorio antes de usar this\n    this.raza = raza;\n  }\n  hablar() { return `${super.hablar()} y ladra`; }  // llama al método del padre\n}\n\nnew Perro('Rex', 'Labrador').hablar(); // 'Rex hace un ruido y ladra'",
    "seniorTip": "",
    "tags": [
      "nivel-4",
      "javascript"
    ],
    "interactiveDemo": "console"
  },
  {
    "id": "P34",
    "level": 4,
    "levelTitle": "Objetos, prototipos, clases y arrays",
    "question": "¿Cómo se declaran miembros privados?",
    "shortAnswer": "con el prefijo `#` (privacidad real, forzada por el lenguaje). El prefijo `_` es solo una convención.",
    "explanation": "con el prefijo `#` (privacidad real, forzada por el lenguaje). El prefijo `_` es solo una convención.",
    "codeSnippet": "class Cuenta {\n  #saldo = 0;\n  static #total = 0;\n\n  depositar(n) { this.#saldo += n; Cuenta.#total++; }\n  get saldo() { return this.#saldo; }\n  #validar() { /* método privado */ }\n}\nconst c = new Cuenta();\nc.#saldo;        // SyntaxError\nc.saldo;         // 0 (a través del getter)",
    "seniorTip": "",
    "tags": [
      "nivel-4",
      "javascript"
    ],
    "interactiveDemo": "console"
  },
  {
    "id": "P35",
    "level": 4,
    "levelTitle": "Objetos, prototipos, clases y arrays",
    "question": "¿Cuáles son los métodos de array más importantes y cuáles mutan el original?",
    "shortAnswer": "| Método | Qué hace | ¿Muta? |",
    "explanation": "| Método | Qué hace | ¿Muta? |\n|---|---|---|\n| `map` | transforma cada elemento | no |\n| `filter` | deja los que cumplen | no |\n| `reduce` | acumula en un valor | no |\n| `find` / `findIndex` | primer elemento / índice | no |\n| `some` / `every` | ¿alguno? / ¿todos? | no |\n| `flat` / `flatMap` | aplana niveles | no |\n| `slice` | copia un fragmento | no |\n| `push` `pop` `shift` `unshift` `splice` | agregar/quitar | **sí** |\n| `sort` `reverse` | ordenar/invertir | **sí** |\n| `toSorted` `toReversed` `toSpliced` `with` | versiones inmutables (ES2023) | no |",
    "codeSnippet": "const nums = [3, 1, 2];\n[...nums].sort((a, b) => a - b);   // [1, 2, 3] sin mutar el original\nnums.toSorted((a, b) => a - b);    // igual, forma moderna\n\n[10, 9, 1].sort();                  // [1, 10, 9]: sin comparador ordena como strings\n[[1, 2], [3, [4]]].flat(Infinity);  // [1, 2, 3, 4]\n\n// reduce: agrupar\nconst porEdad = personas.reduce((acc, p) => {\n  (acc[p.edad] ||= []).push(p);\n  return acc;\n}, {});",
    "seniorTip": "",
    "tags": [
      "nivel-4",
      "javascript",
      "array"
    ],
    "interactiveDemo": "console"
  },
  {
    "id": "P36",
    "level": 4,
    "levelTitle": "Objetos, prototipos, clases y arrays",
    "question": "¿Qué es la desestructuración?",
    "shortAnswer": "¿Qué es la desestructuración?",
    "explanation": "¿Qué es la desestructuración?",
    "codeSnippet": "// Objetos\nconst { nombre, edad = 18, direccion: { ciudad } = {} } = usuario;\nconst { nombre: alias, ...resto } = usuario;   // renombrar y \"resto\"\n\n// Arrays\nconst [primero, , tercero, ...otros] = [1, 2, 3, 4, 5];\n\n// Intercambiar variables\nlet a = 1, b = 2;\n[a, b] = [b, a];\n\n// En parámetros\nfunction pintar({ x = 0, y = 0, color = 'rojo' } = {}) { /* ... */ }",
    "seniorTip": "",
    "tags": [
      "nivel-4",
      "javascript"
    ],
    "interactiveDemo": "console"
  },
  {
    "id": "P37",
    "level": 4,
    "levelTitle": "Objetos, prototipos, clases y arrays",
    "question": "¿Diferencia entre copia superficial (*shallow*) y profunda (*deep*)?",
    "shortAnswer": "la superficial copia solo el primer nivel; los objetos anidados siguen compartiendo referencia. La profunda duplica todo el árbol.",
    "explanation": "`structuredClone` no copia funciones ni métodos de clase (lanza error con funciones).",
    "codeSnippet": "const original = { a: 1, anidado: { b: 2 }, fecha: new Date() };\n\nconst shallow = { ...original };            // también Object.assign, Array.slice\nshallow.anidado.b = 99;\noriginal.anidado.b;                          // 99 (¡afectado!)\n\nconst deep = structuredClone(original);     // moderna: conserva Date, Map, Set, ciclos\n// JSON.parse(JSON.stringify(x)) pierde Date (→string), undefined, funciones, Map, Set y falla con ciclos",
    "seniorTip": "",
    "tags": [
      "nivel-4",
      "javascript"
    ],
    "interactiveDemo": "console"
  },
  {
    "id": "P38",
    "level": 4,
    "levelTitle": "Objetos, prototipos, clases y arrays",
    "question": "¿Diferencia entre `Object.freeze`, `seal` y `preventExtensions`?",
    "shortAnswer": "| | Agregar props | Borrar props | Modificar valores |",
    "explanation": "| | Agregar props | Borrar props | Modificar valores |\n|---|---|---|---|\n| `preventExtensions` | no | sí | sí |\n| `seal` | no | no | sí |\n| `freeze` | no | no | no |",
    "codeSnippet": "const o = Object.freeze({ a: 1, interno: { b: 2 } });\no.a = 5;            // se ignora (error en strict mode)\no.interno.b = 99;   // funciona: freeze es SUPERFICIAL\nObject.isFrozen(o); // true",
    "seniorTip": "",
    "tags": [
      "object",
      "nivel-4",
      "javascript"
    ],
    "interactiveDemo": "console"
  },
  {
    "id": "P39",
    "level": 4,
    "levelTitle": "Objetos, prototipos, clases y arrays",
    "question": "¿Cuándo usar `Map`/`Set` en vez de objeto/array?",
    "shortAnswer": "`Map` admite **cualquier tipo de clave** (no solo strings/symbols), mantiene el orden de inserción, tiene `.size` y rinde mejor con muchas altas/bajas. `Set` guarda valores **únicos**. `WeakMap`/`WeakSet` tienen claves débiles: no impiden que el recolector libere el objeto.",
    "explanation": "`Map` admite **cualquier tipo de clave** (no solo strings/symbols), mantiene el orden de inserción, tiene `.size` y rinde mejor con muchas altas/bajas. `Set` guarda valores **únicos**. `WeakMap`/`WeakSet` tienen claves débiles: no impiden que el recolector libere el objeto.",
    "codeSnippet": "const m = new Map();\nconst clave = { id: 1 };\nm.set(clave, 'dato').set('x', 1);\nm.get(clave);       // 'dato'\nm.size;             // 2\n\nconst unicos = [...new Set([1, 2, 2, 3, 3])]; // [1, 2, 3]\n\n// WeakMap: metadatos privados sin fugas de memoria\nconst privados = new WeakMap();\nclass A { constructor() { privados.set(this, { secreto: 1 }); } }",
    "seniorTip": "",
    "tags": [
      "nivel-4",
      "javascript",
      "array"
    ],
    "interactiveDemo": "console"
  },
  {
    "id": "P40",
    "level": 4,
    "levelTitle": "Objetos, prototipos, clases y arrays",
    "question": "¿Qué es un `Symbol`?",
    "shortAnswer": "un valor primitivo **único e irrepetible**, usado como clave de propiedad sin riesgo de colisiones. Existen *well-known symbols* como `Symbol.iterator` para personalizar el comportamiento del lenguaje.",
    "explanation": "un valor primitivo **único e irrepetible**, usado como clave de propiedad sin riesgo de colisiones. Existen *well-known symbols* como `Symbol.iterator` para personalizar el comportamiento del lenguaje.",
    "codeSnippet": "const id = Symbol('id');\nconst u = { [id]: 123, nombre: 'Ana' };\nObject.keys(u);                 // ['nombre']  (los symbols no aparecen)\nSymbol('a') === Symbol('a');    // false\nSymbol.for('a') === Symbol.for('a'); // true (registro global)",
    "seniorTip": "",
    "tags": [
      "nivel-4",
      "javascript"
    ],
    "interactiveDemo": "console"
  },
  {
    "id": "P41",
    "level": 4,
    "levelTitle": "Objetos, prototipos, clases y arrays",
    "question": "¿Qué son *getters*, *setters* y `Object.defineProperty`?",
    "shortAnswer": "¿Qué son *getters*, *setters* y `Object.defineProperty`?",
    "explanation": "¿Qué son *getters*, *setters* y `Object.defineProperty`?",
    "codeSnippet": "const persona = {\n  nombre: 'Ana', apellido: 'Gómez',\n  get completo() { return `${this.nombre} ${this.apellido}`; },\n  set completo(v) { [this.nombre, this.apellido] = v.split(' '); },\n};\npersona.completo = 'Luis Pérez';\n\nObject.defineProperty(persona, 'id', {\n  value: 1, writable: false, enumerable: false, configurable: false,\n});",
    "seniorTip": "",
    "tags": [
      "object",
      "nivel-4",
      "javascript"
    ],
    "interactiveDemo": "console"
  },
  {
    "id": "P42",
    "level": 4,
    "levelTitle": "Objetos, prototipos, clases y arrays",
    "question": "¿Diferencia entre `for...in` y `for...of`?",
    "shortAnswer": "`for...in` recorre las **claves enumerables** (incluidas las heredadas) de un objeto; `for...of` recorre los **valores de un iterable** (array, string, Map, Set).",
    "explanation": "`for...in` recorre las **claves enumerables** (incluidas las heredadas) de un objeto; `for...of` recorre los **valores de un iterable** (array, string, Map, Set).",
    "codeSnippet": "const arr = ['a', 'b'];\nfor (const i in arr) console.log(i);   // '0', '1' (strings)\nfor (const v of arr) console.log(v);   // 'a', 'b'\n\nfor (const [k, v] of Object.entries({ x: 1, y: 2 })) console.log(k, v);\nfor (const [clave, valor] of new Map([['a', 1]])) { /* ... */ }",
    "seniorTip": "",
    "tags": [
      "nivel-4",
      "javascript",
      "array"
    ],
    "interactiveDemo": "console"
  },
  {
    "id": "P43",
    "level": 4,
    "levelTitle": "Objetos, prototipos, clases y arrays",
    "question": "¿Qué cosas \"raras\" tiene `JSON.stringify`?",
    "shortAnswer": "---",
    "explanation": "---",
    "codeSnippet": "JSON.stringify({ a: undefined, b: () => {}, c: Symbol('x') }); // '{}' (se omiten)\nJSON.stringify([undefined, () => {}]);                          // '[null,null]'\nJSON.stringify({ f: new Date(0) });                             // fecha → string ISO\nJSON.stringify({ n: NaN, i: Infinity });                        // '{\"n\":null,\"i\":null}'\nJSON.stringify(1n);                                              // TypeError (BigInt)\nJSON.stringify(objetoConCiclos);                                 // TypeError\nJSON.stringify({ a: 1, b: 2 }, null, 2);                         // formateado con 2 espacios",
    "seniorTip": "",
    "tags": [
      "nivel-4",
      "javascript"
    ],
    "interactiveDemo": "console"
  }
];
