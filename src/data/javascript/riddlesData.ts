import { JsRiddle } from '@/types/javascript';

export const jsRiddlesData: JsRiddle[] = [
  {
    id: 'A1',
    title: 'Hoisting y Temporal Dead Zone (TDZ)',
    codeSnippet: `console.log(a);
var a = 1;
console.log(b);
let b = 2;`,
    expectedOutput: 'undefined y luego ReferenceError (TDZ de b)',
    explanation:
      'var se eleva e inicializa en undefined durante la fase de creación. let se eleva pero permanece en la Zona Muerta Temporal (TDZ) sin inicializar hasta que la ejecución llega a su declaración.',
    trapExplanation:
      'Trampa clásica de entrevista: Creer que let y const no sufren hoisting. Sí son hoisted, pero acceder a ellos antes de su línea de inicialización lanza ReferenceError.',
    options: [
      'undefined y luego ReferenceError (TDZ de b)',
      'undefined y luego undefined',
      'ReferenceError inmediatamente en la primera línea',
      '1 y luego 2'
    ]
  },
  {
    id: 'A2',
    title: 'Coerciones Clásicas de Tipos',
    codeSnippet: `console.log([] + []);
console.log([] + {});
console.log('5' + 3);
console.log('5' - 3);
console.log(true + true);
console.log([] == ![]);`,
    expectedOutput: `"" , "[object Object]" , "53" , 2 , 2 , true`,
    explanation:
      '1. [] + [] convierte ambos arrays a strings vacíos: "" + "" = "".\n2. [] + {} convierte [] a "" y {} a "[object Object]".\n3. \'5\' + 3 prioriza concatenación binaria: "53".\n4. \'5\' - 3 solo admite resta numérica, coercionando \'5\' a 5: 5 - 3 = 2.\n5. true + true se convierten a 1: 1 + 1 = 2.\n6. ![] es false. Luego [] == false convierte ambos a número: 0 == 0 -> true.',
    trapExplanation:
      'El operador + concatena si hay strings u objetos convertibles a string; el operador - siempre fuerza números.',
    options: [
      `"" , "[object Object]" , "53" , 2 , 2 , true`,
      `"[object Object]" , "[object Object]" , 8 , 2 , 2 , false`,
      `"" , "[object Object]" , "53" , NaN , true , true`,
      `undefined , "[object Object]" , 8 , 2 , 2 , false`
    ]
  },
  {
    id: 'A3',
    title: 'Binding de "this": Método Extraído vs Arrow Function',
    codeSnippet: `const obj = {
  nombre: 'Ana',
  normal() { return this?.nombre; },
  flecha: () => this?.nombre,
};
const f = obj.normal;

console.log(obj.normal());
console.log(f());
console.log(obj.flecha());`,
    expectedOutput: `'Ana', undefined, undefined`,
    explanation:
      '1. obj.normal() se invoca con obj a la izquierda, this es obj -> "Ana".\n2. f() es una función libre sin objeto receptor, this es undefined en strict mode (o window).\n3. obj.flecha() no tiene this propio y captura el scope léxico exterior (global/module), donde nombre no existe.',
    trapExplanation:
      'Extraer un método de un objeto desvincula su binding implícito de this. Las arrow functions nunca tienen su propio this.',
    options: [
      `'Ana', undefined, undefined`,
      `'Ana', 'Ana', 'Ana'`,
      `'Ana', 'Ana', undefined`,
      `'Ana', TypeError, undefined`
    ]
  },
  {
    id: 'A4',
    title: 'Closures y Bucles: var vs let',
    codeSnippet: `const fns = [];
for (var i = 0; i < 3; i++) fns.push(() => i);
console.log(fns.map((f) => f()));

const fns2 = [];
for (let j = 0; j < 3; j++) fns2.push(() => j);
console.log(fns2.map((f) => f()));`,
    expectedOutput: '[3, 3, 3] y luego [0, 1, 2]',
    explanation:
      'var tiene ámbito de función; todas las funciones capturan la misma variable mutada i cuyo valor final es 3. let tiene ámbito de bloque, creando un nuevo binding léxico por cada iteración del bucle for.',
    trapExplanation:
      'Las closures capturan variables por referencia, no su valor en el momento en que se definió la función.',
    options: [
      '[3, 3, 3] y luego [0, 1, 2]',
      '[0, 1, 2] y luego [0, 1, 2]',
      '[3, 3, 3] y luego [3, 3, 3]',
      '[undefined, undefined, undefined] y luego [0, 1, 2]'
    ]
  },
  {
    id: 'A5',
    title: 'Orden de Ejecución con Promesas, Async/Await y Timers',
    codeSnippet: `console.log('A');
setTimeout(() => console.log('B'), 0);
new Promise((res) => { console.log('C'); res(); }).then(() => console.log('D'));
(async () => { console.log('E'); await null; console.log('F'); })();
console.log('G');`,
    expectedOutput: 'A C E G D F B',
    explanation:
      '1. Código síncrono: Imprime A. Encola timer B en macrotasks. El executor de Promise es síncrono: imprime C y encola D en microtasks. La función async corre síncrona hasta await: imprime E y encola F en microtasks. Imprime G.\n2. Microtareas: D y F se ejecutan en orden de encolado.\n3. Macrotareas: B se ejecuta al final.',
    trapExplanation:
      'El executor de una promesa new Promise(fn) corre inmediatamente de forma síncrona, no es una microtarea.',
    options: [
      'A C E G D F B',
      'A B C D E F G',
      'A C E G B D F',
      'A E C G D F B'
    ]
  },
  {
    id: 'A6',
    title: 'Array.map con parseInt y Argumentos Ocultos',
    codeSnippet: `console.log(['1', '2', '3'].map(parseInt));`,
    expectedOutput: '[1, NaN, NaN]',
    explanation:
      'map pasa tres argumentos: (valor, índice, array). parseInt recibe (string, radix). Por tanto se ejecuta: parseInt("1", 0) -> 1 (radix 0 asume base 10); parseInt("2", 1) -> NaN (base 1 no existe); parseInt("3", 2) -> NaN ("3" es dígito inválido en base binaria 2).',
    trapExplanation:
      'Pasar funciones que aceptan múltiples parámetros directamente a .map() provoca efectos secundarios por el argumento de índice.',
    options: [
      '[1, NaN, NaN]',
      '[1, 2, 3]',
      '[1, 2, NaN]',
      '[NaN, NaN, NaN]'
    ]
  },
  {
    id: 'A7',
    title: 'Array.prototype.sort Orden Lexicográfico por Defecto',
    codeSnippet: `console.log([10, 9, 1, 100].sort());
console.log([10, 9, 1, 100].sort((a, b) => a - b));`,
    expectedOutput: '[1, 10, 100, 9] y luego [1, 9, 10, 100]',
    explanation:
      '.sort() sin comparador convierte los elementos a strings y los ordena por su valor UTF-16 lexicográfico: "1" < "10" < "100" < "9". Para orden numérico ascendente debe pasarse la función (a, b) => a - b.',
    trapExplanation:
      '.sort() en JavaScript NO ordena números por defecto; los ordena como strings lexicográficos y además muta el array original.',
    options: [
      '[1, 10, 100, 9] y luego [1, 9, 10, 100]',
      '[1, 9, 10, 100] y luego [1, 9, 10, 100]',
      '[100, 10, 9, 1] y luego [1, 9, 10, 100]',
      '[1, 10, 9, 100] y luego [1, 9, 10, 100]'
    ]
  },
  {
    id: 'A8',
    title: 'Comparaciones de Identidad, NaN y Object.is',
    codeSnippet: `console.log({} === {});
console.log([1] == [1]);
console.log([1] == 1);
console.log(NaN === NaN);
console.log(Object.is(NaN, NaN));
console.log(Object.is(0, -0));`,
    expectedOutput: 'false, false, true, false, true, false',
    explanation:
      '1. {} === {} y [1] == [1] son falsos porque comparan referencias de memoria distintas.\n2. [1] == 1 es true porque [1] se convierte a primitivo "1" y luego a 1.\n3. NaN === NaN es false por especificación IEEE 754.\n4. Object.is(NaN, NaN) es true.\n5. Object.is(0, -0) es false (distingue signos de cero).',
    trapExplanation:
      'NaN es el único valor en JavaScript que no es igual a sí mismo con ===.',
    options: [
      'false, false, true, false, true, false',
      'true, true, true, false, true, false',
      'false, false, false, false, true, true',
      'false, true, true, true, true, false'
    ]
  },
  {
    id: 'A9',
    title: 'Pérdida de Contexto "this" en setTimeout Callback',
    codeSnippet: `const contador = {
  n: 0,
  conFuncion() { setTimeout(function () { console.log(this?.n); }, 0); },
  conFlecha() { setTimeout(() => { console.log(this?.n); }, 0); },
};
contador.conFuncion();
contador.conFlecha();`,
    expectedOutput: 'undefined y luego 0',
    explanation:
      'En conFuncion(), function() común ejecutada por setTimeout es llamada por el entorno global, donde this es window o undefined. En conFlecha(), la arrow function preserva el this léxico de conFlecha (el objeto contador, donde n es 0).',
    trapExplanation:
      'Pasar una función tradicional como callback a setTimeout o event listeners desvincula su this original.',
    options: [
      'undefined y luego 0',
      '0 y luego 0',
      'undefined y luego undefined',
      'TypeError en la primera llamada'
    ]
  },
  {
    id: 'A10',
    title: 'Bloque finally y Prioridad de Ejecución de Return',
    codeSnippet: `function f() {
  try { return 'try'; }
  finally { console.log('finally'); }
}
console.log(f());`,
    expectedOutput: `'finally' y luego 'try'`,
    explanation:
      'El bloque finally SIEMPRE se ejecuta antes de que la función retorne su valor, incluso si el bloque try ya ejecutó una sentencia return.',
    trapExplanation:
      'finally no cancela el return del try (a menos que el propio finally contenga su propio return explícito, lo cual sobreescribiría el valor).',
    options: [
      `'finally' y luego 'try'`,
      `'try' y luego 'finally'`,
      `'try' únicamente ('finally' no corre tras un return)`,
      `'finally' únicamente (el return de try se descarta)`
    ]
  },
  {
    id: 'A11',
    title: 'Hoisting de Funciones vs Declaraciones de Variables',
    codeSnippet: `console.log(typeof foo);
var foo = 1;
function foo() {}
console.log(typeof foo);`,
    expectedOutput: `'function' y luego 'number'`,
    explanation:
      'Las declaraciones de función se elevan primero y tienen prioridad sobre var foo (la variable no la sobrescribe hasta que se asigna valor). Luego la asignación foo = 1 sobreescribe la variable con un número.',
    trapExplanation:
      'function foo() se eleva con su cuerpo completo; var foo solo eleva el identificador sin valor.',
    options: [
      `'function' y luego 'number'`,
      `'undefined' y luego 'number'`,
      `'function' y luego 'function'`,
      `'number' y luego 'number'`
    ]
  },
  {
    id: 'A12',
    title: 'Spread Operator y Copia Superficial (Shallow Copy)',
    codeSnippet: `const a = { x: { y: 1 } };
const b = { ...a };
b.x.y = 2;

console.log(a.x.y);`,
    expectedOutput: '2',
    explanation:
      'El operador spread {...a} crea una copia superficial. Las propiedades primitivas de primer nivel se copian, pero los objetos anidados (como x) conservan la misma referencia en memoria compartida.',
    trapExplanation:
      'Creer que {...obj} o Object.assign({}, obj) clonan profundamente objetos anidados.',
    options: [
      '2',
      '1',
      'undefined',
      'TypeError: Cannot assign to read only property'
    ]
  },
  {
    id: 'A13',
    title: 'Doble Negación (!!) y Valores Truthy / Falsy',
    codeSnippet: `console.log(!![]);
console.log(!!{});
console.log(!!0);
console.log(!!1);
console.log(!!-1);
console.log(!!"");
console.log(!!(() => null));`,
    expectedOutput: 'true, true, false, true, true, false, true',
    explanation:
      'En JavaScript, TODOS los objetos y arrays (incluso vacíos como [] y {}) son truthy. Cualquier número diferente de 0 (incluyendo números negativos como -1) es truthy. Solo 0, -0, 0n, "", null, undefined y NaN son falsy. Las funciones son objetos y siempre son truthy.',
    trapExplanation:
      'En otros lenguajes (como Python) las listas vacías [] o diccionarios {} son falsy. En JavaScript, TODO objeto es truthy sin importar su contenido.',
    options: [
      'true, true, false, true, true, false, true',
      'false, false, false, true, true, false, true',
      'true, true, false, true, false, false, true',
      'false, true, false, true, true, false, false'
    ]
  },
  {
    id: 'A14',
    title: 'Mutación de Arrays: Referencia vs Copia Superficial Spread',
    codeSnippet: `const original = [ 1, 2, 3, 4, 5 ];

const copy1 = original;
const copy2 = [ ...original ];

copy1[2] = 9;

console.log(original[2]);
console.log(copy1[2]);
console.log(copy2[2]);`,
    expectedOutput: '9, 9, 3',
    explanation:
      'copy1 = original no crea un nuevo array, solo copia el puntero de referencia en memoria. Modificar copy1[2] = 9 muta directamente el array original. Por otro lado, copy2 = [...original] creó una nueva instancia de array independiente en memoria, por lo que su posición [2] mantiene intacto el valor 3.',
    trapExplanation:
      'Asignar una variable de array u objeto a otra mediante = nunca crea una copia; ambas apuntan al mismo bloque de memoria.',
    options: [
      '9, 9, 3',
      '3, 9, 3',
      '9, 9, 9',
      '3, 9, 5'
    ]
  },
  {
    id: 'A15',
    title: 'Igualdad Débil (==) vs Igualdad Estricta (===)',
    codeSnippet: `console.log(2 == "2");
console.log(3 === "3");`,
    expectedOutput: 'true, false',
    explanation:
      'El operador == (loose equality) realiza coerción implícita de tipos si los tipos difieren; "2" se convierte al número 2 antes de comparar (2 == 2 es true). El operador === (strict equality) comprueba tanto el tipo como el valor sin coerción; number !== string, resultando en false.',
    trapExplanation:
      'Siempre preferir === en código de producción para evitar comportamientos impredecibles debidos a las reglas complejas del Abstract Equality Comparison Algorithm.',
    options: [
      'true, false',
      'true, true',
      'false, false',
      'false, true'
    ]
  },
  {
    id: 'A16',
    title: 'Orden de Ejecución Avanzado: Promise Executor, Microtasks y Timers',
    codeSnippet: `console.log(1);

new Promise((resolve) => {
  console.log(2);
  setTimeout(() => console.log(3));
  resolve(4);
}).then(console.log);

setTimeout(() => console.log(5));

console.log(6);`,
    expectedOutput: '1, 2, 6, 4, 3, 5',
    explanation:
      '1. Código síncrono inicial:\n   - console.log(1) imprime 1.\n   - new Promise() ejecuta su función executor SÍNCRONAMENTE: imprime 2.\n   - setTimeout(3) encola macrotarea #1 con timer.\n   - resolve(4) resuelve la promesa.\n   - .then(console.log) encola microtarea con el valor 4.\n   - setTimeout(5) encola macrotarea #2 con timer.\n   - console.log(6) imprime 6.\n2. Se vacía la cola de Microtareas:\n   - La reacción de .then imprime 4.\n3. El Event Loop toma las Macrotareas en orden de encolado:\n   - Callback del primer timer imprime 3.\n   - Callback del segundo timer imprime 5.\nSalida final: 1 -> 2 -> 6 -> 4 -> 3 -> 5.',
    trapExplanation:
      'El executor pasado a new Promise((resolve) => ...) NO es asíncrono; se ejecuta inmediatamente en el Call Stack principal.',
    options: [
      '1, 2, 6, 4, 3, 5',
      '1, 2, 4, 6, 3, 5',
      '1, 6, 2, 4, 3, 5',
      '1, 2, 6, 3, 5, 4'
    ]
  },
  {
    id: 'A17',
    title: 'Claves de Objeto y Coerción a "[object Object]"',
    codeSnippet: `const a = {};
const b = { key: 'b' };
const c = { key: 'c' };

a[b] = 123;
a[c] = 456;

console.log(a[b]);`,
    expectedOutput: '456',
    explanation:
      'Las claves de los objetos tradicionales en JavaScript son siempre strings (o Symbols). Al usar un objeto como clave (a[b]), JS invoca b.toString() que devuelve "[object Object]". Por ende, a[b] asigna a["[object Object]"] = 123, y luego a[c] sobrescribe exactamente la misma clave con a["[object Object]"] = 456. a[b] lee esa misma clave y retorna 456. Para usar objetos reales como claves debe usarse Map.',
    trapExplanation:
      'Los objetos no soportan instancias de objetos como claves directas sin convertirlos a string.',
    options: [
      '456',
      '123',
      'undefined',
      'TypeError: Invalid object key'
    ]
  },
  {
    id: 'A18',
    title: 'Asignación Encadenada y Fuga al Scope Global',
    codeSnippet: `(function() {
  var a = b = 3;
})();

console.log(typeof a);
console.log(typeof b);`,
    expectedOutput: `'undefined' y 'number'`,
    explanation:
      'La expresión var a = b = 3 se evalúa de derecha a izquierda como b = 3; var a = b;. En modo no estricto, b no tiene declaración var/let/const y se convierte en una variable global (window.b = 3). Sin embargo, a está declarada con var dentro de la función y queda confinada a su scope local, siendo inaccesible fuera.',
    trapExplanation:
      'Nunca encadenar asignaciones al declarar variables (var x = y = 5) porque la segunda variable se filtrará al objeto global.',
    options: [
      `'undefined' y 'number'`,
      `'number' y 'number'`,
      `'undefined' y 'undefined'`,
      `ReferenceError en console.log(a)`
    ]
  }
];
