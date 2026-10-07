import { JsTopic } from '@/types/javascript';

export const level3Topics: JsTopic[] = [
  {
    "id": "P22",
    "level": 3,
    "levelTitle": "Scope, closures y `this`",
    "question": "¿Qué es el scope y qué tipos hay?",
    "shortAnswer": "es la región donde una variable es accesible. Hay scope **global**, de **función**, de **bloque** (`let`/`const`) y de **módulo**. JavaScript usa **scope léxico**: una función puede ver las variables del lugar donde fue *escrita*, no donde se llama.",
    "explanation": "es la región donde una variable es accesible. Hay scope **global**, de **función**, de **bloque** (`let`/`const`) y de **módulo**. JavaScript usa **scope léxico**: una función puede ver las variables del lugar donde fue *escrita*, no donde se llama.",
    "codeSnippet": "const global = 'g';\n\nfunction externa() {\n  const e = 'e';\n  function interna() {\n    const i = 'i';\n    console.log(global, e, i); // ve los tres: sube por la scope chain\n  }\n  interna();\n}\n// console.log(e); → ReferenceError: no se ve hacia adentro",
    "seniorTip": "",
    "tags": [
      "nivel-3",
      "scope",
      "javascript"
    ],
    "interactiveDemo": "console"
  },
  {
    "id": "P23",
    "level": 3,
    "levelTitle": "Scope, closures y `this`",
    "question": "¿Qué es una closure?",
    "shortAnswer": "una función que **recuerda las variables de su scope exterior** incluso después de que ese scope terminó de ejecutarse. Cada llamada a la función externa crea un entorno independiente.",
    "explanation": "**Usos típicos:** encapsulación y datos privados, fábricas de funciones, memoización, *debounce/throttle*, `once`, callbacks que conservan contexto, módulos.",
    "codeSnippet": "function crearContador() {\n  let n = 0;              // variable \"privada\"\n  return () => ++n;       // la función interna la sigue viendo\n}\n\nconst a = crearContador();\nconst b = crearContador();\na(); a();                 // 1, 2\nb();                      // 1 (entorno distinto)",
    "seniorTip": "",
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
    "shortAnswer": "**Explicación:** `var` tiene un solo `i` compartido por todas las closures; cuando corren los timeouts el bucle ya terminó y `i` vale 3. Soluciones:",
    "explanation": "`var` tiene un solo `i` compartido por todas las closures; cuando corren los timeouts el bucle ya terminó y `i` vale 3. Soluciones:",
    "codeSnippet": "for (var i = 0; i < 3; i++) {\n  setTimeout(() => console.log(i), 0);\n}\n// 3 3 3\n\n// 1) let: crea un i nuevo por iteración\nfor (let i = 0; i < 3; i++) setTimeout(() => console.log(i), 0); // 0 1 2\n\n// 2) IIFE que captura el valor\nfor (var i = 0; i < 3; i++) {\n  ((j) => setTimeout(() => console.log(j), 0))(i);\n}",
    "seniorTip": "",
    "tags": [
      "nivel-3",
      "closure",
      "javascript"
    ],
    "interactiveDemo": "console"
  },
  {
    "id": "P25",
    "level": 3,
    "levelTitle": "Scope, closures y `this`",
    "question": "¿Cómo se determina el valor de `this`?",
    "shortAnswer": "depende de **cómo se llama** la función (excepto en arrows):",
    "explanation": "1. **`new Fn()`** → el objeto nuevo.\n2. **`call/apply/bind`** → el que indiques explícitamente.\n3. **`obj.metodo()`** → `obj`.\n4. **Llamada suelta `fn()`** → `undefined` (strict) o `globalThis` (no strict).\n5. **Arrow function** → hereda `this` del scope donde se definió.",
    "codeSnippet": "const persona = {\n  nombre: 'Ana',\n  saludar() { return `Hola, soy ${this.nombre}`; },\n};\n\npersona.saludar();            // 'Hola, soy Ana'  (regla 3)\nconst suelta = persona.saludar;\nsuelta();                     // pierde el this → undefined / TypeError en strict",
    "seniorTip": "",
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
    "shortAnswer": "los tres fijan el `this`. `call` y `apply` **ejecutan** la función en el momento (con argumentos separados / en un array); `bind` **devuelve una función nueva** con el `this` fijado.",
    "explanation": "los tres fijan el `this`. `call` y `apply` **ejecutan** la función en el momento (con argumentos separados / en un array); `bind` **devuelve una función nueva** con el `this` fijado.",
    "codeSnippet": "function presentar(saludo, puntuacion) {\n  return `${saludo}, soy ${this.nombre}${puntuacion}`;\n}\nconst ana = { nombre: 'Ana' };\n\npresentar.call(ana, 'Hola', '!');       // 'Hola, soy Ana!'\npresentar.apply(ana, ['Hola', '!']);    // 'Hola, soy Ana!'\nconst ligada = presentar.bind(ana, 'Hola');\nligada('?');                            // 'Hola, soy Ana?'",
    "seniorTip": "",
    "tags": [
      "nivel-3",
      "this",
      "javascript",
      "array"
    ],
    "interactiveDemo": "console"
  },
  {
    "id": "P27",
    "level": 3,
    "levelTitle": "Scope, closures y `this`",
    "question": "¿Cómo se comporta `this` en una arrow function?",
    "shortAnswer": "no tiene `this` propio; usa el del scope donde está definida y **no se puede cambiar** con `call/bind`. Es útil en callbacks dentro de métodos, pero **mala idea como método de objeto**.",
    "explanation": "no tiene `this` propio; usa el del scope donde está definida y **no se puede cambiar** con `call/bind`. Es útil en callbacks dentro de métodos, pero **mala idea como método de objeto**.",
    "codeSnippet": "const temporizador = {\n  segundos: 0,\n  iniciar() {\n    setInterval(() => {\n      this.segundos++;   // this = temporizador (heredado de iniciar)\n    }, 1000);\n  },\n  malMetodo: () => this.segundos, // this NO es el objeto (es el del scope exterior)\n};",
    "seniorTip": "",
    "tags": [
      "nivel-3",
      "scope",
      "this",
      "javascript"
    ],
    "interactiveDemo": "console"
  },
  {
    "id": "P28",
    "level": 3,
    "levelTitle": "Scope, closures y `this`",
    "question": "¿Por qué se pierde `this` al pasar un método como callback y cómo se arregla?",
    "shortAnswer": "¿Por qué se pierde `this` al pasar un método como callback y cómo se arregla?",
    "explanation": "¿Por qué se pierde `this` al pasar un método como callback y cómo se arregla?",
    "codeSnippet": "class Boton {\n  constructor() { this.texto = 'Click'; }\n  onClick() { console.log(this.texto); }\n}\nconst b = new Boton();\n\nsetTimeout(b.onClick, 0);                    // undefined / error: this perdido\n\n// Soluciones\nsetTimeout(() => b.onClick(), 0);            // arrow que llama al método\nsetTimeout(b.onClick.bind(b), 0);            // bind\nclass Boton2 {\n  onClick = () => console.log(this.texto);   // class field con arrow\n}",
    "seniorTip": "",
    "tags": [
      "nivel-3",
      "this",
      "javascript"
    ],
    "interactiveDemo": "console"
  },
  {
    "id": "P29",
    "level": 3,
    "levelTitle": "Scope, closures y `this`",
    "question": "¿Cómo se crea privacidad con closures (patrón módulo)?",
    "shortAnswer": "Hoy también se puede usar `#privado` en clases (ver P34).",
    "explanation": "Hoy también se puede usar `#privado` en clases (ver P34).\n\n---",
    "codeSnippet": "const banco = (() => {\n  let saldo = 0;                       // inaccesible desde fuera\n  const validar = (n) => n > 0;\n\n  return {\n    depositar(n) { if (validar(n)) saldo += n; },\n    obtenerSaldo: () => saldo,\n  };\n})();\n\nbanco.depositar(100);\nbanco.obtenerSaldo(); // 100\nbanco.saldo;          // undefined",
    "seniorTip": "",
    "tags": [
      "nivel-3",
      "closure",
      "javascript"
    ],
    "interactiveDemo": "console"
  }
];
