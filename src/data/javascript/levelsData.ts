import { JsLevelInfo } from '@/types/javascript';

export const jsLevelsData: JsLevelInfo[] = [
  {
    id: 1,
    title: 'Nivel 1: Fundamentos',
    shortTitle: 'Fundamentos',
    description: 'Tipos de datos primitivos y referencias, var/let/const, hoisting, TDZ, coerción, igualdad y operadores modernos.',
    color: 'from-amber-500 to-yellow-500',
    iconName: 'Zap',
    questionIds: ['P1', 'P2', 'P3', 'P4', 'P5', 'P6', 'P7', 'P8', 'P9', 'P10', 'P11', 'P12', 'P13']
  },
  {
    id: 2,
    title: 'Nivel 2: Funciones',
    shortTitle: 'Funciones',
    description: 'Declaraciones vs expresiones, arrow functions, rest/spread, HOF, callbacks, IIFE, funciones puras y currying.',
    color: 'from-orange-500 to-amber-600',
    iconName: 'Code',
    questionIds: ['P14', 'P15', 'P16', 'P17', 'P18', 'P19', 'P20', 'P21']
  },
  {
    id: 3,
    title: 'Nivel 3: Scope, Closures y this',
    shortTitle: 'Scope, Closures y this',
    description: 'Scope léxico, closures en profundidad, resolución de "this", call/apply/bind, pérdida de contexto y privacidad.',
    color: 'from-rose-500 to-pink-600',
    iconName: 'Layers',
    questionIds: ['P22', 'P23', 'P24', 'P25', 'P26', 'P27', 'P28', 'P29']
  },
  {
    id: 4,
    title: 'Nivel 4: Objetos, Prototipos, Clases y Arrays',
    shortTitle: 'Objetos y Prototipos',
    description: 'Cadena de prototipos, operador new, clases ES6, campos privados (#), inmutabilidad (freeze/seal), Map/Set y Symbols.',
    color: 'from-emerald-500 to-teal-600',
    iconName: 'Boxes',
    questionIds: ['P30', 'P31', 'P32', 'P33', 'P34', 'P35', 'P36', 'P37', 'P38', 'P39', 'P40', 'P41', 'P42', 'P43']
  },
  {
    id: 5,
    title: 'Nivel 5: Asincronía y Event Loop',
    shortTitle: 'Asincronía',
    description: 'Event Loop, microtareas vs macrotareas, Promesas, async/await, Promise combinators (all, race, any), cancelaciones y retry backoff.',
    color: 'from-blue-500 to-cyan-600',
    iconName: 'Clock',
    questionIds: ['P44', 'P45', 'P46', 'P47', 'P48', 'P49', 'P50', 'P51', 'P52', 'P53', 'P54', 'P55']
  },
  {
    id: 6,
    title: 'Nivel 6: ES6+ y Módulos',
    shortTitle: 'ES6+ y Módulos',
    description: 'ESM vs CommonJS, tagged templates, iteradores, generadores (yield), Proxy & Reflect, novedades ES2022-ES2024 y tree shaking.',
    color: 'from-indigo-500 to-purple-600',
    iconName: 'Sparkles',
    questionIds: ['P56', 'P57', 'P58', 'P59', 'P60', 'P61', 'P62']
  },
  {
    id: 7,
    title: 'Nivel 7: DOM y Navegador',
    shortTitle: 'DOM y Navegador',
    description: 'Event bubbling, captura, delegación de eventos, storage (local/session/cookies/IDB), fetch, CORS, debounce/throttle, reflow y repaint.',
    color: 'from-violet-500 to-fuchsia-600',
    iconName: 'Globe',
    questionIds: ['P63', 'P64', 'P65', 'P66', 'P67', 'P68', 'P69', 'P70', 'P71', 'P72', 'P73']
  },
  {
    id: 8,
    title: 'Nivel 8: Avanzado',
    shortTitle: 'Avanzado',
    description: 'Gestión de memoria, detección de memory leaks, patrones de diseño, manejo robusto de errores, Event Loop de Node.js y WeakRef.',
    color: 'from-red-500 to-rose-700',
    iconName: 'Cpu',
    questionIds: ['P74', 'P75', 'P76', 'P77', 'P78', 'P79', 'P80', 'P81']
  }
];
