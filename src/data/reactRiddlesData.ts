import { JsRiddle } from '@/types/javascript';

export interface ReactRiddle extends JsRiddle {
  topicCategory?: string;
}

export const reactRiddlesData: ReactRiddle[] = [
  {
    id: 'R1',
    title: 'Automatic Batching en Event Handlers',
    topicCategory: 'Estado & Render',
    codeSnippet: `function Counter() {
  const [count, setCount] = useState(0);

  const handleClick = () => {
    setCount(count + 1);
    setCount(count + 1);
    setCount(count + 1);
    console.log(count);
  };

  return <button onClick={handleClick}>{count}</button>;
}`,
    expectedOutput: 'En consola imprime 0; en el siguiente render el botón muestra 1',
    explanation:
      'Las tres llamadas a setCount leen el mismo valor count (0) capturado en la closure del render actual. Además, React 18/19 agrupa las tres actualizaciones en un solo re-render (Automatic Batching), aplicando count = 0 + 1.',
    trapExplanation:
      'setState programa un render y no muta la variable count síncronamente. Para acumular cambios en un solo evento debe usarse la forma funcional: setCount(prev => prev + 1).',
    options: [
      'En consola imprime 0; en el siguiente render el botón muestra 1',
      'En consola imprime 3; en el siguiente render el botón muestra 3',
      'En consola imprime 1; en el siguiente render el botón muestra 3',
      'En consola imprime 0; en el siguiente render el botón muestra 3'
    ]
  },
  {
    id: 'R2',
    title: 'La Trampa del Índice como "key" en Listas Dinámicas',
    topicCategory: 'Diffing & Reconciliación',
    codeSnippet: `function List() {
  const [items, setItems] = useState(['A', 'B', 'C']);

  const removeFirst = () => {
    setItems(items.slice(1)); // Remueve 'A'
  };

  return (
    <div>
      <button onClick={removeFirst}>Eliminar primero</button>
      {items.map((item, index) => (
        <div key={index}>
          <span>{item}: </span>
          <input defaultValue={'Texto ' + item} />
        </div>
      ))}
    </div>
  );
}`,
    expectedOutput: 'El texto renderizado mostrará B y C, pero los inputs mantendrán "Texto A" y "Texto B"',
    explanation:
      'Al borrar "A", los elementos restantes "B" y "C" pasan a ocupar los índices 0 y 1. El algoritmo de diffing de React ve key="0" y key="1", asume que los mismos componentes siguen allí y preserva el estado interno del DOM de los inputs no controlados.',
    trapExplanation:
      'Usar index como key corrompe el estado interno de inputs, checkboxes y animaciones si la lista se reordena, filtra o elimina.',
    options: [
      'El texto renderizado mostrará B y C, pero los inputs mantendrán "Texto A" y "Texto B"',
      'Los inputs se actualizarán correctamente a "Texto B" y "Texto C"',
      'Se lanzará un error de reconciliación por índices faltantes',
      'Todos los inputs se resetearán a valores vacíos'
    ]
  },
  {
    id: 'R3',
    title: 'Stale Closure en useEffect con setInterval',
    topicCategory: 'Hooks & Closures',
    codeSnippet: `function Timer() {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds(seconds + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return <h1>{seconds}</h1>;
}`,
    expectedOutput: 'Aumentará a 1 tras un segundo y se quedará congelado en 1 indefinidamente',
    explanation:
      'El efecto tiene array de dependencias vacío ([]), por lo que la función callback de setInterval solo se crea una vez en el montaje inicial capturando seconds = 0. En cada segundo subsiguiente ejecuta setSeconds(0 + 1) perpetuamente.',
    trapExplanation:
      'Para evitar stale closures en intervalos, usa la actualización funcional setSeconds(prev => prev + 1).',
    options: [
      'Aumentará a 1 tras un segundo y se quedará congelado en 1 indefinidamente',
      'Incrementará cada segundo: 1, 2, 3, 4... sin problema',
      'Incrementará exponencialmente por múltiples timers creados',
      'Lanzará un error en tiempo de ejecución de React'
    ]
  },
  {
    id: 'R4',
    title: 'Mutación Directa vs Comparación Object.is',
    topicCategory: 'Inmutabilidad',
    codeSnippet: `function UserList() {
  const [users, setUsers] = useState(['Ana', 'Luis']);

  const addUser = () => {
    users.push('Carlos');
    setUsers(users);
  };

  return (
    <div>
      <button onClick={addUser}>Agregar</button>
      <p>Total: {users.length}</p>
    </div>
  );
}`,
    expectedOutput: 'React detecta la misma referencia de array y NO re-renderiza; la UI sigue mostrando "Total: 2"',
    explanation:
      'React compara el nuevo estado con el anterior usando Object.is(users, users). Como users.push mutó el array en el mismo puntero de memoria, la referencia no cambió y React descarta el render (bailout).',
    trapExplanation:
      'Mutar arrays u objetos y pasarlos a setState no dispara re-render. Siempre se debe generar una nueva referencia inmutable: setUsers([...users, "Carlos"]).',
    options: [
      'React detecta la misma referencia de array y NO re-renderiza; la UI sigue mostrando "Total: 2"',
      'React re-renderiza inmediatamente mostrando "Total: 3"',
      'setUsers lanza TypeError porque el estado es inmutable por defecto',
      'El botón queda congelado y no responde a más clics'
    ]
  },
  {
    id: 'R5',
    title: 'Orden de Ejecución de useEffect en Jerarquía Padre-Hijo',
    topicCategory: 'Ciclo de Vida & Render',
    codeSnippet: `function Child() {
  useEffect(() => {
    console.log('Efecto Hijo');
  }, []);
  return <span>Hijo</span>;
}

function Parent() {
  useEffect(() => {
    console.log('Efecto Padre');
  }, []);
  return <Child />;
}`,
    expectedOutput: '"Efecto Hijo" y luego "Efecto Padre"',
    explanation:
      'El árbol de componentes de React se recorre en profundidad (bottom-up al completar). Un componente padre no termina de montarse hasta que todos sus hijos han terminado de montarse. Por tanto, los efectos pasivos de los hijos se ejecutan siempre antes que los de sus padres.',
    trapExplanation:
      'Pensar que el efecto del padre corre primero porque su función de render se ejecuta antes. El render es top-down, pero el montaje de efectos es bottom-up.',
    options: [
      '"Efecto Hijo" y luego "Efecto Padre"',
      '"Efecto Padre" y luego "Efecto Hijo"',
      'Se ejecutan simultáneamente en hilos paralelos',
      'Solo se ejecuta "Efecto Padre"'
    ]
  },
  {
    id: 'R6',
    title: 'La Trampa de Falsy 0 en JSX (0 && <Component />)',
    topicCategory: 'JSX & Condicionales',
    codeSnippet: `function Badge({ unreadCount }: { unreadCount: number }) {
  return (
    <div>
      {unreadCount && <span>Tienes mensajes</span>}
    </div>
  );
}
// Renderizado con: <Badge unreadCount={0} />`,
    expectedOutput: 'Renderiza el número 0 visiblemente en el DOM (<div>0</div>)',
    explanation:
      'El operador && devuelve el primer operando falsy. Como unreadCount es 0, la expresión evalúa a 0. En JSX, false, null y undefined no se renderizan, pero el número 0 es un primitivo válido que se pinta como texto visible "0".',
    trapExplanation:
      'Nunca uses count && <Component /> para comprobaciones numéricas. Usa condicionales booleanos explícitos: count > 0 && <Component /> o Boolean(count) && <Component />.',
    options: [
      'Renderiza el número 0 visiblemente en el DOM (<div>0</div>)',
      'No renderiza nada en el DOM (<div></div> vacío)',
      'Renderiza el texto "Tienes mensajes"',
      'Lanza un error de tipado en JSX'
    ]
  },
  {
    id: 'R7',
    title: 'Actualizaciones Funcionales Encadenadas',
    topicCategory: 'Estado & Colas',
    codeSnippet: `function Clicker() {
  const [count, setCount] = useState(0);

  const handleClick = () => {
    setCount(prev => prev + 1);
    setCount(prev => prev + 2);
    setCount(prev => prev + 5);
  };

  return <button onClick={handleClick}>{count}</button>;
}`,
    expectedOutput: 'El botón se actualiza a 8 en un solo re-render',
    explanation:
      'A diferencia de pasar valores directos, las funciones actualizadoras (updater functions) se encolan en la updateQueue de la fibra. React las ejecuta secuencialmente durante la fase de render: 0 -> 0 + 1 = 1 -> 1 + 2 = 3 -> 3 + 5 = 8.',
    trapExplanation:
      'Las actualizaciones funcionales garantizan que cada cálculo reciba el estado intermedio más reciente de la cola sin esperar a un re-render.',
    options: [
      'El botón se actualiza a 8 en un solo re-render',
      'El botón se actualiza a 5',
      'Se producen 3 re-renders sucesivos (1 -> 3 -> 8)',
      'El botón se actualiza a 1'
    ]
  },
  {
    id: 'R8',
    title: 'Doble Invocación en React.StrictMode en Desarrollo',
    topicCategory: 'StrictMode & Concurrencia',
    codeSnippet: `let renders = 0;

function MyComponent() {
  renders++;
  console.log('Render:', renders);
  return <h1>Hola</h1>;
}
// Montado dentro de <React.StrictMode> en desarrollo`,
    expectedOutput: 'Imprime "Render: 1" y luego "Render: 2" durante el montaje inicial',
    explanation:
      'En desarrollo con StrictMode habilitado, React ejecuta intencionalmente los cuerpos de los componentes dos veces para ayudar a los desarrolladores a detectar efectos secundarios accidentales y mutaciones impuras fuera de useEffect.',
    trapExplanation:
      'El doble render en StrictMode solo ocurre en desarrollo (next dev / dev server); en builds de producción (next build / start) cada componente corre exactamente una vez.',
    options: [
      'Imprime "Render: 1" y luego "Render: 2" durante el montaje inicial',
      'Imprime únicamente "Render: 1"',
      'Lanza un warning de compilación por variable externa',
      'Imprime "Render: 1" cada 1000ms indefinidamente'
    ]
  }
];

