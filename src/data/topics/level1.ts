import { Topic } from '@/types';

export const LEVEL_1_TOPICS: Topic[] = [
  {
    id: '1.1',
    level: 1,
    levelTitle: 'Fundamentos',
    title: '1.1 Qué es React y el DOM virtual',
    summary: 'React es declarativo y utiliza una representación en memoria (Virtual DOM) para agrupar y minimizar las mutaciones costosas en el DOM real.',
    whatIsIt: `React es una biblioteca de JavaScript orientada a componentes. Su paradigma es **declarativo**: describes cómo debe verse la interfaz para un estado dado (\`UI = f(state)\`) y React se encarga de realizar las mutaciones necesarias en el navegador.

El **DOM Virtual** es un árbol de objetos ligeros de JavaScript en memoria que representa la estructura de la UI. Cuando el estado cambia:
1. React crea un nuevo árbol virtual en memoria.
2. Compara el árbol nuevo con el anterior (**Diffing Algorithm**).
3. Calcula el conjunto mínimo de cambios necesarios (**Reconciliación**).
4. Aplica únicamente esas diferencias al DOM real del navegador en una sola operación agrupada.`,
    codeSnippet: `// Paradigma Declarativo (React)
function Saludo({ nombre }: { nombre: string }) {
  return <h1 className="text-xl font-bold">Hola, {nombre}</h1>;
}

// Paradigma Imperativo (Vanilla JS)
// const h1 = document.createElement('h1');
// h1.textContent = \`Hola, \${nombre}\`;
// h1.className = 'text-xl font-bold';
// document.getElementById('root')?.appendChild(h1);`,
    interviewTips: [
      'El DOM virtual NO es inherentemente más rápido que el DOM directo; es una abstracción que garantiza un rendimiento predecible y suficiente sin manipulación manual.',
      'Destaca que el mayor valor del Virtual DOM no es la velocidad bruta, sino el modelo mental declarativo que desacopla la lógica de la UI de la manipulación del DOM nativo.',
      'Menciona que este desacoplamiento permite que React se ejecute en otros entornos, como React Native (móvil) o SSR (servidor).'
    ],
    commonTraps: [
      'Trampa: Decir que "el Virtual DOM es más rápido que el DOM en todas las circunstancias". Tocar el DOM directamente con código vanilla hiper-optimizado puede ser más rápido, pero no es mantenible a escala.',
      'Confundir el Shadow DOM (estándar de Web Components para encapsular estilos y scripts) con el Virtual DOM (estructura en memoria propia de React).'
    ],
    keyTakeaway: 'React calcula la diferencia en memoria (barato) y aplica al DOM real solo los nodos modificados (costoso).',
    componentKey: 'VirtualDomDemo',
    tags: ['virtual-dom', 'declarativo', 'diffing', 'reconciliacion']
  },
  {
    id: '1.2',
    level: 1,
    levelTitle: 'Fundamentos',
    title: '1.2 JSX (JavaScript XML)',
    summary: 'Azúcar sintáctico que se compila a React.createElement / jsx(). Permite componer UI declarativa con expresiones de JavaScript.',
    whatIsIt: `JSX es una extensión de la sintaxis de JavaScript con aspecto similar a HTML. No es HTML nativo ni se ejecuta directamente en el navegador; un transpilador (Babel, SWC o TypeScript) lo transforma en llamadas a funciones JS (\`jsx(type, props)\` en el runtime moderno o \`React.createElement\`).

Características esenciales:
- Atributos en camelCase (\`className\`, \`htmlFor\`, \`onClick\`, \`tabIndex\`).
- Expresiones dentro de llaves \`{}\`: se evalúa cualquier expresión que retorne un valor (ternarios, \`.map()\`, llamadas a funciones).
- Elemento raíz único o **React Fragment** (\`<>...</>\` o \`<React.Fragment>\`) para agrupar sin inyectar nodos DOM adicionales.`,
    codeSnippet: `// Lo que escribes en JSX:
function Tarjeta({ titulo, activo }: { titulo: string; activo: boolean }) {
  return (
    <div className={activo ? 'border-blue-500' : 'border-gray-200'}>
      <h2>{titulo.toUpperCase()}</h2>
      <p>Cálculo en línea: {2 + 2}</p>
    </div>
  );
}

// A lo que compila internamente (React JSX runtime):
// import { jsx as _jsx, jsxs as _jsxs } from 'react/jsx-runtime';
// _jsxs('div', { className: ..., children: [...] });`,
    interviewTips: [
      'Explica la diferencia entre sentencias y expresiones: dentro de `{}` solo van expresiones (código que devuelve un valor). Por eso usamos ternarios y operadores lógicos, nunca sentencias como `if` o `for`.',
      'Menciona por qué React Fragment (`<>...</>`) es fundamental: evita el problema de "div soup" que rompe esquemas semánticos, flexbox y CSS grid.'
    ],
    commonTraps: [
      'Intentar poner un `if` o un bucle `for` directamente dentro de las llaves `{}`.',
      'Olvidar que un Fragment abreviado `<>...</>` no puede recibir la prop `key` en listas mapeadas. Si necesitas `key`, debes usar `<React.Fragment key={id}>` explícito.'
    ],
    keyTakeaway: 'JSX es código JavaScript puro disfrazado de etiquetas, transformado en tiempo de compilación a llamadas de objetos de elementos.',
    componentKey: 'JsxExpressionsDemo',
    tags: ['jsx', 'fragments', 'expresiones', 'transpilacion']
  },
  {
    id: '1.3',
    level: 1,
    levelTitle: 'Fundamentos',
    title: '1.3 Componentes funcionales vs. de clase',
    summary: 'Evolución histórica: de clases con ciclo de vida rígido y enlaces de "this" a funciones puras con Hooks modernos.',
    whatIsIt: `En las primeras versiones de React, los componentes de clase eran la única forma de tener estado (\`this.state\`) y ciclo de vida (\`componentDidMount\`, \`componentDidUpdate\`). 

Con la introducción de los **Hooks en React 16.8**, los **componentes funcionales** se convirtieron en el estándar absoluto:
- Sintaxis concisa y sin problemas de enlace de \`this\`.
- Reutilización de lógica con estado mediante **Custom Hooks** (antes requería HOCs o Render Props complejos).
- Menor tamaño de empaquetado y mejor optimización para compiladores y minificadores.
- Los componentes de clase se mantienen por compatibilidad y para los Error Boundaries (que aún requieren \`componentDidCatch\`).`,
    codeSnippet: `// Funcional (Estándar Moderno)
function Contador() {
  const [count, setCount] = useState(0);
  return <button onClick={() => setCount(c => c + 1)}>{count}</button>;
}

// Clase (Legado)
class ContadorClase extends React.Component<{}, { count: number }> {
  state = { count: 0 };
  render() {
    return (
      <button onClick={() => this.setState({ count: this.state.count + 1 })}>
        {this.state.count}
      </button>
    );
  }
}`,
    interviewTips: [
      'Enfatiza que los componentes funcionales "capturan" los valores de renderizado mediante closures de JavaScript, mientras que las clases leían `this.props` de forma mutable, lo que provocaba bugs sutiles en operaciones asíncronas.',
      'Menciona que la única razón para escribir un componente de clase hoy en día es un Error Boundary si no usas una librería como `react-error-boundary`.'
    ],
    commonTraps: [
      'Creer que los componentes de clase tienen mejor rendimiento. En la práctica moderna los funcionales son más rápidos de optimizar con React Compiler y no tienen la sobrecarga de instanciación de clase.',
      'Olvidar cómo resolver el enlace de `this` en clases (bind en constructor o arrow functions).'
    ],
    keyTakeaway: 'Los componentes funcionales + hooks resuelven la reutilización de lógica con estado sin jerarquías complejas ni problemas con `this`.',
    componentKey: 'FunctionalVsClassDemo',
    tags: ['componentes', 'clases', 'hooks', 'historico']
  },
  {
    id: '1.4',
    level: 1,
    levelTitle: 'Fundamentos',
    title: '1.4 Props (Propiedades)',
    summary: 'Argumentos de entrada inmutables que fluyen hacia abajo. La prop especial `children` permite composición de contenido.',
    whatIsIt: `Las **props** son la vía principal para comunicar datos de un componente padre a sus hijos.
Reglas fundamentales:
1. Son **de solo lectura (inmutables)** para el componente que las recibe. Una función pura no debe alterar sus entradas.
2. Soportan cualquier tipo de dato en JavaScript: primitivos, objetos, funciones callback, promesas e incluso otros componentes JSX.
3. La prop especial **\`children\`** contiene todo lo anidado entre las etiquetas de apertura y cierre del componente.
4. Se pueden destructurar con valores por defecto y agrupar el resto con el operador rest (\`...resto\`).`,
    codeSnippet: `interface BotonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variante?: 'primario' | 'secundario' | 'peligro';
  cargando?: boolean;
}

function Boton({ variante = 'primario', cargando, children, ...resto }: BotonProps) {
  return (
    <button
      disabled={cargando || resto.disabled}
      className={\`btn btn-\${variante} \${cargando ? 'opacity-50' : ''}\`}
      {...resto}
    >
      {cargando ? 'Cargando...' : children}
    </button>
  );
}`,
    interviewTips: [
      'Nunca intentes modificar una prop directamente (`props.algo = 123`). Si necesitas cambiar un valor, eleva el estado al padre y pasa un callback, o crea una copia en estado local.',
      'Explica cómo `children` facilita la composición y evita el prop drilling permitiendo pasar elementos ya armados en vez de datos primitivos por capas intermedias.'
    ],
    commonTraps: [
      'Mutar props de objetos o arrays (`props.usuario.nombre = "Nuevo"`). Esto muta el estado del padre de espaldas a React.',
      'No definir valores por defecto en props opcionales, generando errores de tipo `cannot read property of undefined`.'
    ],
    keyTakeaway: 'Las props son inmutables para el hijo. Para alterar un dato, pasa un callback que notifique al dueño del estado.',
    componentKey: 'PropsAndChildrenDemo',
    tags: ['props', 'inmutabilidad', 'children', 'composicion']
  },
  {
    id: '1.5',
    level: 1,
    levelTitle: 'Fundamentos',
    title: '1.5 Listas y la prop `key`',
    summary: 'Claves únicas y estables para que el reconciliador rastree y preserve el estado de cada nodo en listas.',
    whatIsIt: `Para renderizar colecciones de datos se utiliza el método \`.map()\`. React exige que cada elemento devuelto tenga una prop especial **\`key\`**.

El rol de la \`key\`:
- Le da una identidad persistente a cada nodo a través de múltiples renders.
- Permite a React saber si un elemento fue añadido, removido, reordenado o modificado con el mínimo costo de operaciones en el DOM.
- **¿Por qué NO usar el índice como key?** Si la lista cambia de orden, se filtra o se inserta un elemento al inicio, los índices cambian de dueño. Si los componentes hijos tienen estado interno (como inputs de texto o checkboxes), el estado quedará asociado al elemento equivocado.`,
    codeSnippet: `// ❌ PELIGROSO: Usar el índice como key en listas mutables
{items.map((item, index) => (
  <TareaItem key={index} item={item} />
))}

// ✅ SEGURO: ID único y persistente proveniente de la entidad
{items.map((item) => (
  <TareaItem key={item.id} item={item} />
))}`,
    interviewTips: [
      'Demuestra en vivo por qué el índice falla: con una lista de inputs donde borras el primer elemento y el texto escrito se queda en el nuevo primer elemento.',
      'Menciona que la `key` es un atributo reservado para React: no se pasa como prop a los hijos (`props.key` no existe dentro del componente).'
    ],
    commonTraps: [
      'Usar `key={Math.random()}`. Esto destruye y remonta el componente en CADA render, perdiendo el foco de los inputs y causando estragos de rendimiento.',
      'Usar índices en listas que soportan ordenamiento, eliminación o filtrado dinámico.'
    ],
    keyTakeaway: 'Usa siempre identificadores únicos y estables. El índice solo es admisible si la lista es estrictamente estática y sin estado.',
    componentKey: 'ListKeysTrapDemo',
    tags: ['listas', 'key', 'reconciliacion', 'indices']
  },
  {
    id: '1.6',
    level: 1,
    levelTitle: 'Fundamentos',
    title: '1.6 Renderizado condicional',
    summary: 'Técnicas para mostrar UI condicional y la trampa común del número 0 con el operador lógico &&.',
    whatIsIt: `El renderizado condicional en React funciona con la misma lógica que las expresiones en JavaScript:
1. **Early Return**: Salir antes de la función con un loader o mensaje de error.
2. **Operador ternario (\`condicion ? <A /> : <B />\`)**: Ideal para alternar entre dos estados visuales.
3. **Operador lógico AND (\`condicion && <Componente />\`)**: Muestra el componente solo si la condición es verdadera.

**La trampa clásica del \`0\` con \`&&\`**:
En JavaScript, si el lado izquierdo evalúa a un número \`0\`, la expresión devuelve el número \`0\`. Como React renderiza números en la pantalla, \`items.length && <Lista />\` pintará un feo \`0\` en la página cuando el array esté vacío.`,
    codeSnippet: `// ❌ Trampa: renderiza un '0' en el DOM si items.length es 0
<div>
  {items.length && <Lista items={items} />}
</div>

// ✅ Solución segura 1: Comparación booleana explícita
<div>
  {items.length > 0 && <Lista items={items} />}
</div>

// ✅ Solución segura 2: Conversión a booleano con doble negación o ternario
<div>
  {Boolean(items.length) && <Lista items={items} />}
  {items.length ? <Lista items={items} /> : <p>Sin elementos</p>}
</div>`,
    interviewTips: [
      'Explica con precisión cómo evalúa JS el operador `&&`: devuelve el primer valor falsy o el último valor truthy. Si evalúa a `0` o `NaN`, React lo imprime como texto.',
      'Valores que React ignora al renderizar: `null`, `undefined`, `true` y `false`. Todo lo demás (incluyendo `0` y `""`) se pinta en el DOM.'
    ],
    commonTraps: [
      'Confiar en `items.length && <Componente />` sin comprobar que `0` es falsy pero imprimible.',
      'Anidar demasiados operadores ternarios (`a ? b ? c : d : e`), lo cual destruye la legibilidad del código.'
    ],
    keyTakeaway: 'Siempre usa comparaciones booleanas explícitas (`count > 0 && ...`) para evitar que números cero se impriman en pantalla.',
    componentKey: 'ConditionalRenderingDemo',
    tags: ['condicional', 'operador-and', 'ternario', 'trampa-cero']
  },
  {
    id: '1.7',
    level: 1,
    levelTitle: 'Fundamentos',
    title: '1.7 Eventos y SyntheticEvent',
    summary: 'React unifica los eventos del navegador mediante SyntheticEvent con sintaxis camelCase y paso de funciones por referencia.',
    whatIsIt: `React implementa una envoltura sintética sobre los eventos nativos del navegador llamada **SyntheticEvent**.
Ventajas:
- Proporciona una API homogénea y consistente a través de todos los navegadores (cross-browser).
- Implementa delegación de eventos en la raíz del árbol (\`root\`), mejorando el uso de memoria.
- Los nombres son camelCase (\`onClick\`, \`onChange\`, \`onSubmit\`).
- Se pasa una referencia a una función, no una llamada ejecutada (\`onClick={fn}\`, no \`onClick={fn()}\`).`,
    codeSnippet: `function FormularioBusqueda() {
  const [texto, setTexto] = useState('');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Evita que el navegador recargue la página completa
    console.log('Buscando:', texto);
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        type="text"
        value={texto}
        onChange={(e) => setTexto(e.target.value)}
        placeholder="Escribe algo..."
      />
      {/* Pasamos referencia a la función, no ejecución */}
      <button type="submit">Buscar</button>
    </form>
  );
}`,
    interviewTips: [
      'Explica la trampa común de `onClick={handleClick()}`: los paréntesis ejecutan la función durante la fase de render, provocando bucles infinitos si dentro hay un setState.',
      'Menciona que para pasar argumentos se debe usar una arrow function: `onClick={() => handleClick(id)}`.'
    ],
    commonTraps: [
      'Ejecutar la función en el prop del handler: `onClick={hacerAlgo()}` en vez de `onClick={() => hacerAlgo()}`.',
      'Olvidar `e.preventDefault()` en formularios, lo cual recarga la página completa y destruye todo el estado de React en memoria.'
    ],
    keyTakeaway: 'SyntheticEvent garantiza compatibilidad universal y delegación de eventos. Pasa funciones por referencia, nunca su invocación.',
    componentKey: 'EventsDemo',
    tags: ['eventos', 'synthetic-event', 'preventDefault', 'delegacion']
  },
  {
    id: '1.8',
    level: 1,
    levelTitle: 'Fundamentos',
    title: '1.8 Estilos en React',
    summary: 'Comparativa de estrategias de estilizado: CSS Modules, Estilos en línea, CSS-in-JS y Utility-first (Tailwind CSS).',
    whatIsIt: `Existen diversas formas de aplicar estilos en React, cada una con distintos trade-offs de rendimiento, modularidad y compatibilidad con Server Components:
1. **CSS Modules**: Clases CSS con nombres hasheados únicos automáticamente generados. Cero colisiones globales y cero sobrecarga en runtime.
2. **Estilos en línea (\`style={{ ... }}\`)**: Objetos con propiedades en camelCase. Útil para valores dinámicos calculados (coordenadas, porcentajes de progreso), pero no soporta pseudo-clases (\`:hover\`) ni media queries.
3. **Tailwind CSS**: Enfoque de clases utilitarias generado en tiempo de compilación. Máximo rendimiento, bundle size reducido y total compatibilidad con React Server Components (RSC).
4. **CSS-in-JS en runtime (styled-components / Emotion)**: Potente pero genera sobrecarga de inyección de estilos en el cliente y tiene problemas de compatibilidad con RSC.`,
    codeSnippet: `// 1. Tailwind CSS (Recomendado moderno)
<button className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-lg transition-colors">
  Botón Tailwind
</button>

// 2. Estilos en línea (Solo para propiedades dinámicas calculadas)
<div style={{ width: \`\${progreso}%\`, backgroundColor: colorDinamico }} />

// 3. CSS Modules
// import styles from './Boton.module.css';
// <button className={styles.primario}>Botón Modular</button>`,
    interviewTips: [
      'Destaca por qué la industria migró de librerías CSS-in-JS de runtime (styled-components) hacia Tailwind CSS o Vanilla Extract: compatibilidad nativa con React Server Components (RSC) y cero costo de serialización en el hilo principal.',
      'Menciona que los estilos en línea crean un nuevo objeto en memoria en cada render, lo que puede invalidar `React.memo` en hijos si no se usa con precaución.'
    ],
    commonTraps: [
      'Usar estilos en línea para toda la UI, perdiendo pseudo-elementos, media queries y rendimiento de clases reutilizables.',
      'Colisiones de clases CSS globales por no usar CSS Modules o Tailwind.'
    ],
    keyTakeaway: 'Tailwind CSS y CSS Modules ofrecen modularidad y alto rendimiento en compilación sin penalizaciones de runtime en RSC.',
    componentKey: 'StylesComparisonDemo',
    tags: ['estilos', 'tailwind', 'css-modules', 'inline-styles', 'rsc']
  },
  {
    id: '1.9',
    level: 1,
    levelTitle: 'Fundamentos',
    title: '1.9 Flujo de datos unidireccional (Unidirectional Data Flow)',
    summary: 'El estado desciende como props y las notificaciones suben como callbacks, garantizando previsibilidad y depuración clara.',
    whatIsIt: `El flujo unidireccional es la regla arquitectónica de oro de React:
- **Los datos descienden** desde el componente padre hacia los hijos exclusivamente a través de **props**.
- **Los eventos ascienden** desde el componente hijo hacia el padre invocando **funciones de callback** pasadas como props.
- Un componente hijo nunca debe alterar directamente el estado del padre.

¿Por qué es superior al two-way data binding tradicional?
- **Previsibilidad**: Siempre sabes exactamente qué componente posee la verdad de un dato y quién puede mutarlo.
- **Depuración sencilla**: Si un valor está corrupto, sigues el flujo hacia arriba en el árbol hasta el único componente dueño del estado.`,
    codeSnippet: `// Componente Padre: Dueño de la verdad
function PanelContador() {
  const [cuenta, setCuenta] = useState(0);

  return (
    <div className="p-4 border rounded">
      <h3>Valor en Padre: {cuenta}</h3>
      {/* El dato baja por prop (valor), la intención sube por callback (onIncrementar) */}
      <ContadorHijo valor={cuenta} onIncrementar={() => setCuenta(c => c + 1)} />
    </div>
  );
}

// Componente Hijo: Presentacional y dependiente
function ContadorHijo({ valor, onIncrementar }: { valor: number; onIncrementar: () => void }) {
  return (
    <button onClick={onIncrementar} className="btn-primary">
      Hijo dice: {valor} (Clic para sumar)
    </button>
  );
}`,
    interviewTips: [
      'Contrasta el flujo unidireccional de React con el "Two-way data binding" (bidireccional) de AngularJS temprano: el flujo bidireccional creaba efectos secundarios en cascada difíciles de rastrear.',
      'Explica la frase: "Data flows down, events flow up".'
    ],
    commonTraps: [
      'Intentar sincronizar estado duplicado en el hijo copiando una prop a un `useState` local y no actualizarla cuando la prop cambia.',
      'Mutar el estado en el hijo pasando el objeto de estado del padre y modificándolo directamente.'
    ],
    keyTakeaway: 'Los datos bajan por props, los eventos suben por callbacks. El componente que posee el estado es el único autorizado para modificarlo.',
    componentKey: 'DataFlowDemo',
    tags: ['flujo-unidireccional', 'props-down-events-up', 'callbacks', 'previsibilidad']
  }
];
