import { JsImplementationExercise } from '@/types/javascript';

export const jsExercisesData: JsImplementationExercise[] = [
  {
    "id": "E1",
    "title": "debounce",
    "category": "Funcional",
    "description": "Implementación canónica solicitada habitualmente en entrevistas técnicas para evaluar el dominio de debounce.",
    "solutionCode": "function debounce(fn, delay = 300) {\n  let timer;\n  return function (...args) {\n    clearTimeout(timer);\n    timer = setTimeout(() => fn.apply(this, args), delay);\n  };\n}\nconst buscar = debounce((q) => console.log('buscando', q), 400);",
    "testCasesCode": "// Test suite para debounce\nconst llamadas = [];\nconst fn = debounce((v) => llamadas.push(v), 50);\nfn(1); fn(2); fn(3);\nsetTimeout(() => {\n  console.assert(llamadas.length === 1 && llamadas[0] === 3, 'Test Debounce falló');\n  console.log('✓ Debounce: ' + JSON.stringify(llamadas));\n}, 100);",
    "hints": [
      "Presta atención al manejo de argumentos y al contexto 'this'.",
      "Considera casos borde como entradas nulas o estructuras vacías.",
      "Asegúrate de no mutar objetos inesperadamente."
    ]
  },
  {
    "id": "E2",
    "title": "throttle",
    "category": "Funcional",
    "description": "Implementación canónica solicitada habitualmente en entrevistas técnicas para evaluar el dominio de throttle.",
    "solutionCode": "function throttle(fn, intervalo = 300) {\n  let ultimo = 0;\n  return function (...args) {\n    const ahora = Date.now();\n    if (ahora - ultimo >= intervalo) {\n      ultimo = ahora;\n      fn.apply(this, args);\n    }\n  };\n}\nwindow.addEventListener('scroll', throttle(() => console.log('scroll'), 200));",
    "testCasesCode": "// Test suite para throttle\nlet conteo = 0;\nconst throttled = throttle(() => conteo++, 50);\nthrottled(); throttled(); throttled();\nconsole.assert(conteo === 1, 'Throttle debe llamar 1 vez inmediatamente');\nconsole.log('✓ Throttle inicial ejecutado: ' + conteo);",
    "hints": [
      "Presta atención al manejo de argumentos y al contexto 'this'.",
      "Considera casos borde como entradas nulas o estructuras vacías.",
      "Asegúrate de no mutar objetos inesperadamente."
    ]
  },
  {
    "id": "E3",
    "title": "deepClone (con ciclos, Date, Map, Set)",
    "category": "Objetos",
    "description": "Implementación canónica solicitada habitualmente en entrevistas técnicas para evaluar el dominio de deepClone (con ciclos, Date, Map, Set).",
    "solutionCode": "function deepClone(valor, vistos = new WeakMap()) {\n  if (valor === null || typeof valor !== 'object') return valor;\n  if (vistos.has(valor)) return vistos.get(valor);           // referencia circular\n\n  if (valor instanceof Date) return new Date(valor);\n  if (valor instanceof RegExp) return new RegExp(valor.source, valor.flags);\n\n  if (valor instanceof Map) {\n    const copia = new Map(); vistos.set(valor, copia);\n    valor.forEach((v, k) => copia.set(deepClone(k, vistos), deepClone(v, vistos)));\n    return copia;\n  }\n  if (valor instanceof Set) {\n    const copia = new Set(); vistos.set(valor, copia);\n    valor.forEach((v) => copia.add(deepClone(v, vistos)));\n    return copia;\n  }\n\n  const copia = Array.isArray(valor) ? [] : Object.create(Object.getPrototypeOf(valor));\n  vistos.set(valor, copia);\n  for (const clave of Reflect.ownKeys(valor)) copia[clave] = deepClone(valor[clave], vistos);\n  return copia;\n}",
    "testCasesCode": "// Test suite para deepClone\nconst obj = { a: 1, fecha: new Date(), map: new Map([['x', 10]]) };\nobj.circular = obj;\nconst copia = deepClone(obj);\nconsole.assert(copia !== obj, 'Debe ser referencia distinta');\nconsole.assert(copia.circular === copia, 'Debe resolver ciclos');\nconsole.log('✓ deepClone superó ciclos y referencias');",
    "hints": [
      "Presta atención al manejo de argumentos y al contexto 'this'.",
      "Considera casos borde como entradas nulas o estructuras vacías.",
      "Asegúrate de no mutar objetos inesperadamente."
    ]
  },
  {
    "id": "E4",
    "title": "flatten de arrays anidados",
    "category": "Algoritmos",
    "description": "Implementación canónica solicitada habitualmente en entrevistas técnicas para evaluar el dominio de flatten de arrays anidados.",
    "solutionCode": "const flatten = (arr, nivel = Infinity) =>\n  nivel < 1\n    ? arr.slice()\n    : arr.reduce((acc, x) => acc.concat(Array.isArray(x) ? flatten(x, nivel - 1) : x), []);\n\nflatten([1, [2, [3, [4]]]]);     // [1, 2, 3, 4]\nflatten([1, [2, [3, [4]]]], 1);  // [1, 2, [3, [4]]]",
    "testCasesCode": "// Test suite flatten\nconst res = flatten([1, [2, [3, [4]], 5]]);\nconsole.assert(JSON.stringify(res) === '[1,2,3,4,5]', 'Flatten falló');\nconsole.log('✓ Flatten resultado: ' + JSON.stringify(res));",
    "hints": [
      "Presta atención al manejo de argumentos y al contexto 'this'.",
      "Considera casos borde como entradas nulas o estructuras vacías.",
      "Asegúrate de no mutar objetos inesperadamente."
    ]
  },
  {
    "id": "E5",
    "title": "curry",
    "category": "Funcional",
    "description": "Implementación canónica solicitada habitualmente en entrevistas técnicas para evaluar el dominio de curry.",
    "solutionCode": "function curry(fn) {\n  return function curried(...args) {\n    return args.length >= fn.length\n      ? fn.apply(this, args)\n      : (...mas) => curried.apply(this, [...args, ...mas]);\n  };\n}\nconst suma = curry((a, b, c) => a + b + c);\nsuma(1)(2)(3);   // 6\nsuma(1, 2)(3);   // 6",
    "testCasesCode": "// Test suite curry\nconst suma = (a, b, c) => a + b + c;\nconst curried = curry(suma);\nconsole.assert(curried(1)(2)(3) === 6, 'Curry 1 falló');\nconsole.assert(curried(1, 2)(3) === 6, 'Curry 2 falló');\nconsole.log('✓ Curry ejecutado correctamente: ' + curried(1)(2)(3));",
    "hints": [
      "Presta atención al manejo de argumentos y al contexto 'this'.",
      "Considera casos borde como entradas nulas o estructuras vacías.",
      "Asegúrate de no mutar objetos inesperadamente."
    ]
  },
  {
    "id": "E6",
    "title": "compose y pipe",
    "category": "Funcional",
    "description": "Implementación canónica solicitada habitualmente en entrevistas técnicas para evaluar el dominio de compose y pipe.",
    "solutionCode": "const pipe = (...fns) => (x) => fns.reduce((acc, f) => f(acc), x);\nconst compose = (...fns) => (x) => fns.reduceRight((acc, f) => f(acc), x);\npipe((x) => x + 1, (x) => x * 2)(3);     // 8\ncompose((x) => x + 1, (x) => x * 2)(3);  // 7",
    "testCasesCode": "// Test suite compose y pipe\nconst sumar1 = x => x + 1;\nconst duplicar = x => x * 2;\nconsole.assert(compose(duplicar, sumar1)(3) === 8, 'Compose falló');\nconsole.assert(pipe(sumar1, duplicar)(3) === 8, 'Pipe falló');\nconsole.log('✓ Compose y Pipe verificados');",
    "hints": [
      "Presta atención al manejo de argumentos y al contexto 'this'.",
      "Considera casos borde como entradas nulas o estructuras vacías.",
      "Asegúrate de no mutar objetos inesperadamente."
    ]
  },
  {
    "id": "E7",
    "title": "memoize",
    "category": "Funcional",
    "description": "Implementación canónica solicitada habitualmente en entrevistas técnicas para evaluar el dominio de memoize.",
    "solutionCode": "function memoize(fn) {\n  const cache = new Map();\n  return function (...args) {\n    const clave = JSON.stringify(args);\n    if (cache.has(clave)) return cache.get(clave);\n    const resultado = fn.apply(this, args);\n    cache.set(clave, resultado);\n    return resultado;\n  };\n}\nconst fib = memoize((n) => (n < 2 ? n : fib(n - 1) + fib(n - 2)));\nfib(50); // 12586269025",
    "testCasesCode": "// Test suite memoize\nlet ops = 0;\nconst fib = memoize((n) => { ops++; return n <= 1 ? n : fib(n - 1) + fib(n - 2); });\nfib(10);\nconsole.log('✓ Memoize calculó fib(10) en ' + ops + ' operaciones');",
    "hints": [
      "Presta atención al manejo de argumentos y al contexto 'this'.",
      "Considera casos borde como entradas nulas o estructuras vacías.",
      "Asegúrate de no mutar objetos inesperadamente."
    ]
  },
  {
    "id": "E8",
    "title": "once",
    "category": "Funcional",
    "description": "Implementación canónica solicitada habitualmente en entrevistas técnicas para evaluar el dominio de once.",
    "solutionCode": "const once = (fn) => {\n  let llamado = false, resultado;\n  return function (...args) {\n    if (!llamado) { llamado = true; resultado = fn.apply(this, args); }\n    return resultado;\n  };\n};",
    "testCasesCode": "// Test suite once\nlet runCount = 0;\nconst init = once(() => runCount++);\ninit(); init(); init();\nconsole.assert(runCount === 1, 'Once debe correr solo 1 vez');\nconsole.log('✓ Once garantizó llamada única: ' + runCount);",
    "hints": [
      "Presta atención al manejo de argumentos y al contexto 'this'.",
      "Considera casos borde como entradas nulas o estructuras vacías.",
      "Asegúrate de no mutar objetos inesperadamente."
    ]
  },
  {
    "id": "E9",
    "title": "Polyfills de bind, call y map",
    "category": "Polyfills",
    "description": "Implementación canónica solicitada habitualmente en entrevistas técnicas para evaluar el dominio de Polyfills de bind, call y map.",
    "solutionCode": "Function.prototype.miBind = function (contexto, ...fijos) {\n  const fn = this;\n  return function (...args) { return fn.apply(contexto, [...fijos, ...args]); };\n};\n\nFunction.prototype.miCall = function (contexto, ...args) {\n  const clave = Symbol('fn');\n  contexto = contexto ?? globalThis;\n  contexto[clave] = this;\n  const r = contexto[clave](...args);\n  delete contexto[clave];\n  return r;\n};\n\nArray.prototype.miMap = function (callback, thisArg) {\n  const resultado = [];\n  for (let i = 0; i < this.length; i++) {\n    if (i in this) resultado[i] = callback.call(thisArg, this[i], i, this);\n  }\n  return resultado;\n};",
    "testCasesCode": "// Test suite Polyfills\nconst obj = { x: 42 };\nfunction ver(y) { return this.x + y; }\nconsole.assert(ver.miCall(obj, 8) === 50, 'miCall falló');\nconsole.assert([1, 2, 3].miMap(x => x * 2).join(',') === '2,4,6', 'miMap falló');\nconsole.log('✓ Polyfills funcionando perfectamente');",
    "hints": [
      "Presta atención al manejo de argumentos y al contexto 'this'.",
      "Considera casos borde como entradas nulas o estructuras vacías.",
      "Asegúrate de no mutar objetos inesperadamente."
    ]
  },
  {
    "id": "E10",
    "title": "Polyfill de Promise.all",
    "category": "Asincronía",
    "description": "Implementación canónica solicitada habitualmente en entrevistas técnicas para evaluar el dominio de Polyfill de Promise.all.",
    "solutionCode": "function promiseAll(promesas) {\n  return new Promise((resolve, reject) => {\n    const items = [...promesas];\n    if (items.length === 0) return resolve([]);\n    const resultados = new Array(items.length);\n    let pendientes = items.length;\n    items.forEach((p, i) => {\n      Promise.resolve(p).then((valor) => {\n        resultados[i] = valor;\n        if (--pendientes === 0) resolve(resultados);\n      }, reject);\n    });\n  });\n}",
    "testCasesCode": "// Test suite promiseAll\npromiseAll([Promise.resolve(1), Promise.resolve(2), 3]).then(vals => {\n  console.assert(JSON.stringify(vals) === '[1,2,3]', 'promiseAll falló');\n  console.log('✓ Promise.all polyfill resolvió: ' + JSON.stringify(vals));\n});",
    "hints": [
      "Presta atención al manejo de argumentos y al contexto 'this'.",
      "Considera casos borde como entradas nulas o estructuras vacías.",
      "Asegúrate de no mutar objetos inesperadamente."
    ]
  },
  {
    "id": "E11",
    "title": "Limitar concurrencia (*promise pool*)",
    "category": "Asincronía",
    "description": "Implementación canónica solicitada habitualmente en entrevistas técnicas para evaluar el dominio de Limitar concurrencia (*promise pool*).",
    "solutionCode": "async function pool(tareas, limite = 3) {\n  const resultados = [];\n  let siguiente = 0;\n  async function trabajador() {\n    while (siguiente < tareas.length) {\n      const i = siguiente++;\n      resultados[i] = await tareas[i]();\n    }\n  }\n  await Promise.all(Array.from({ length: Math.min(limite, tareas.length) }, trabajador));\n  return resultados;\n}\n// pool(urls.map((u) => () => fetch(u)), 3);",
    "testCasesCode": "// Test suite promise pool\nconst tareas = [() => Promise.resolve(1), () => Promise.resolve(2), () => Promise.resolve(3)];\npromisePool(tareas, 2).then(res => {\n  console.assert(res.length === 3, 'Promise pool falló');\n  console.log('✓ Promise pool procesó tareas concurrentes: ' + JSON.stringify(res));\n});",
    "hints": [
      "Presta atención al manejo de argumentos y al contexto 'this'.",
      "Considera casos borde como entradas nulas o estructuras vacías.",
      "Asegúrate de no mutar objetos inesperadamente."
    ]
  },
  {
    "id": "E12",
    "title": "retry, sleep y timeout",
    "category": "Asincronía",
    "description": "Implementación canónica solicitada habitualmente en entrevistas técnicas para evaluar el dominio de retry, sleep y timeout.",
    "solutionCode": "const sleep = (ms) => new Promise((r) => setTimeout(r, ms));\n\nasync function retry(fn, intentos = 3, espera = 300) {\n  for (let i = 0; i < intentos; i++) {\n    try { return await fn(); }\n    catch (e) { if (i === intentos - 1) throw e; await sleep(espera * 2 ** i); }\n  }\n}\n\nconst timeout = (promesa, ms) =>\n  Promise.race([promesa, new Promise((_, rej) => setTimeout(() => rej(new Error('timeout')), ms))]);",
    "testCasesCode": "// Test suite retry/sleep\nretry(() => Promise.resolve('ok'), 3, 20).then(res => {\n  console.assert(res === 'ok', 'Retry falló');\n  console.log('✓ Retry exitoso con backoff');\n});",
    "hints": [
      "Presta atención al manejo de argumentos y al contexto 'this'.",
      "Considera casos borde como entradas nulas o estructuras vacías.",
      "Asegúrate de no mutar objetos inesperadamente."
    ]
  },
  {
    "id": "E13",
    "title": "EventEmitter",
    "category": "Estructuras de Datos",
    "description": "Implementación canónica solicitada habitualmente en entrevistas técnicas para evaluar el dominio de EventEmitter.",
    "solutionCode": "class EventEmitter {\n  #eventos = {};\n  on(nombre, fn) { (this.#eventos[nombre] ||= []).push(fn); return this; }\n  off(nombre, fn) { this.#eventos[nombre] = (this.#eventos[nombre] || []).filter((f) => f !== fn); return this; }\n  once(nombre, fn) {\n    const envoltura = (...args) => { this.off(nombre, envoltura); fn(...args); };\n    return this.on(nombre, envoltura);\n  }\n  emit(nombre, ...args) { [...(this.#eventos[nombre] || [])].forEach((fn) => fn(...args)); return this; }\n}",
    "testCasesCode": "// Test suite EventEmitter\nconst ee = new EventEmitter();\nlet recibido = 0;\nee.on('ping', n => { recibido += n; });\nee.emit('ping', 5);\nconsole.assert(recibido === 5, 'EventEmitter falló');\nconsole.log('✓ EventEmitter gestionó evento: recibido=' + recibido);",
    "hints": [
      "Presta atención al manejo de argumentos y al contexto 'this'.",
      "Considera casos borde como entradas nulas o estructuras vacías.",
      "Asegúrate de no mutar objetos inesperadamente."
    ]
  },
  {
    "id": "E14",
    "title": "groupBy, chunk y valores únicos",
    "category": "Algoritmos",
    "description": "Implementación canónica solicitada habitualmente en entrevistas técnicas para evaluar el dominio de groupBy, chunk y valores únicos.",
    "solutionCode": "const groupBy = (arr, fn) =>\n  arr.reduce((acc, x) => { (acc[fn(x)] ||= []).push(x); return acc; }, {});\ngroupBy([1.2, 1.8, 2.1], Math.floor);   // { 1: [1.2, 1.8], 2: [2.1] }\n\nconst chunk = (arr, n) =>\n  Array.from({ length: Math.ceil(arr.length / n) }, (_, i) => arr.slice(i * n, i * n + n));\nchunk([1, 2, 3, 4, 5], 2);              // [[1, 2], [3, 4], [5]]\n\nconst unicos = (arr) => [...new Set(arr)];",
    "testCasesCode": "// Test suite groupBy / chunk\nconst grp = groupBy(['a', 'bb', 'c', 'dd'], s => s.length);\nconsole.assert(grp[1].length === 2 && grp[2].length === 2, 'GroupBy falló');\nconsole.log('✓ GroupBy verificado: ' + JSON.stringify(grp));",
    "hints": [
      "Presta atención al manejo de argumentos y al contexto 'this'.",
      "Considera casos borde como entradas nulas o estructuras vacías.",
      "Asegúrate de no mutar objetos inesperadamente."
    ]
  },
  {
    "id": "E15",
    "title": "Caché LRU",
    "category": "Estructuras de Datos",
    "description": "Implementación canónica solicitada habitualmente en entrevistas técnicas para evaluar el dominio de Caché LRU.",
    "solutionCode": "class LRU {\n  constructor(capacidad) { this.cap = capacidad; this.mapa = new Map(); }\n  get(clave) {\n    if (!this.mapa.has(clave)) return undefined;\n    const valor = this.mapa.get(clave);\n    this.mapa.delete(clave);\n    this.mapa.set(clave, valor);                 // pasa a \"más reciente\"\n    return valor;\n  }\n  set(clave, valor) {\n    this.mapa.delete(clave);\n    this.mapa.set(clave, valor);\n    if (this.mapa.size > this.cap) this.mapa.delete(this.mapa.keys().next().value); // elimina el más antiguo\n  }\n}",
    "testCasesCode": "// Test suite LRU Cache\nconst cache = new LRU(2);\ncache.set('a', 1); cache.set('b', 2); cache.get('a'); cache.set('c', 3);\nconsole.assert(cache.get('b') === undefined, 'b debió ser expulsado de LRU');\nconsole.log('✓ LRU Cache expulsó la clave menos reciente');",
    "hints": [
      "Presta atención al manejo de argumentos y al contexto 'this'.",
      "Considera casos borde como entradas nulas o estructuras vacías.",
      "Asegúrate de no mutar objetos inesperadamente."
    ]
  },
  {
    "id": "E16",
    "title": "Problemas clásicos de lógica",
    "category": "Algoritmos",
    "description": "Implementación canónica solicitada habitualmente en entrevistas técnicas para evaluar el dominio de Problemas clásicos de lógica.",
    "solutionCode": "// Two Sum (O(n))\nfunction twoSum(nums, objetivo) {\n  const vistos = new Map();\n  for (let i = 0; i < nums.length; i++) {\n    const falta = objetivo - nums[i];\n    if (vistos.has(falta)) return [vistos.get(falta), i];\n    vistos.set(nums[i], i);\n  }\n}\ntwoSum([2, 7, 11, 15], 9); // [0, 1]\n\n// Anagramas\nconst esAnagrama = (a, b) =>\n  [...a.toLowerCase()].sort().join('') === [...b.toLowerCase()].sort().join('');\n\n// Palíndromo\nconst esPalindromo = (s) => {\n  const limpio = s.toLowerCase().replace(/[^a-z0-9]/g, '');\n  return limpio === [...limpio].reverse().join('');\n};\n\n// FizzBuzz\nfor (let i = 1; i <= 100; i++) {\n  console.log(i % 15 === 0 ? 'FizzBuzz' : i % 3 === 0 ? 'Fizz' : i % 5 === 0 ? 'Buzz' : i);\n}\n\n// Paréntesis balanceados\nfunction balanceado(s) {\n  const pares = { ')': '(', ']': '[', '}': '{' };\n  const pila = [];\n  for (const c of s) {\n    if ('([{'.includes(c)) pila.push(c);\n    else if (c in pares && pila.pop() !== pares[c]) return false;\n  }\n  return pila.length === 0;\n}",
    "testCasesCode": "// Test suite Algoritmos\nconsole.assert(JSON.stringify(twoSum([2, 7, 11, 15], 9)) === '[0,1]', 'TwoSum falló');\nconsole.assert(balanceado('({[]})') === true, 'Balanceado falló');\nconsole.log('✓ Algoritmos clásicos resueltos con éxito');",
    "hints": [
      "Presta atención al manejo de argumentos y al contexto 'this'.",
      "Considera casos borde como entradas nulas o estructuras vacías.",
      "Asegúrate de no mutar objetos inesperadamente."
    ]
  },
  {
    "id": "E17",
    "title": "Aplanar un objeto anidado",
    "category": "Objetos",
    "description": "---",
    "solutionCode": "function aplanarObjeto(obj, prefijo = '', salida = {}) {\n  for (const [k, v] of Object.entries(obj)) {\n    const clave = prefijo ? `${prefijo}.${k}` : k;\n    if (v && typeof v === 'object' && !Array.isArray(v)) aplanarObjeto(v, clave, salida);\n    else salida[clave] = v;\n  }\n  return salida;\n}\naplanarObjeto({ a: 1, b: { c: 2, d: { e: 3 } } }); // { a: 1, 'b.c': 2, 'b.d.e': 3 }",
    "testCasesCode": "// Test suite aplanarObjeto\nconst plano = aplanarObjeto({ a: 1, b: { c: 2, d: { e: 3 } } });\nconsole.assert(plano['b.c'] === 2 && plano['b.d.e'] === 3, 'Aplanar falló');\nconsole.log('✓ aplanarObjeto resultado: ' + JSON.stringify(plano));",
    "hints": [
      "Presta atención al manejo de argumentos y al contexto 'this'.",
      "Considera casos borde como entradas nulas o estructuras vacías.",
      "Asegúrate de no mutar objetos inesperadamente."
    ]
  }
];
