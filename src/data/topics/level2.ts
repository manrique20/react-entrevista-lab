import { Topic } from '@/types';

export const LEVEL_2_TOPICS: Topic[] = [
  {
    id: '2.1',
    level: 2,
    levelTitle: 'Estado y Hooks Básicos',
    title: '2.1 `useState` (Estado local y actualizaciones funcionales)',
    summary: 'Manejo de estado inmutable en componentes funcionales. La forma funcional `setCount(prev => prev + 1)` es clave para actualizaciones concurrentes y seguras.',
    whatIsIt: `\`useState\` declara una variable de estado que React preserva entre renders. Cuando su función actualizadora se invoca con un nuevo valor, programa un re-render del componente.

Reglas de oro de \`useState\`:
1. **Inmutabilidad estricta**: Nunca modifiques el objeto o array actual. Crea una copia nueva usando el operador spread (\`[...arr]\` o \`{ ...obj }\`).
2. **Actualizaciones asíncronas y programadas**: Llamar a \`setN(5)\` no actualiza la variable \`n\` en la línea siguiente del código actual. La variable tendrá el nuevo valor en el **siguiente ciclo de render**.
3. **Forma funcional**: Si el nuevo estado depende del estado anterior, usa \`setN(prev => prev + 1)\`. Esto evita leer valores obsoletos por closures o cuando múltiples actualizaciones se agrupan (batching).`,
    codeSnippet: `function ContadorAsincrono() {
  const [cuenta, setCuenta] = useState(0);

  const handleClickIncorrecto = () => {
    // ❌ Error: Todas leen el mismo 'cuenta' del render actual (ej: 0)
    setCuenta(cuenta + 1);
    setCuenta(cuenta + 1);
    setCuenta(cuenta + 1);
    // Resultado al terminar el render: ¡Solo suma 1!
  };

  const handleClickCorrecto = () => {
    // ✅ Seguro: Se encolan funciones sobre el valor pendiente más reciente
    setCuenta(prev => prev + 1);
    setCuenta(prev => prev + 1);
    setCuenta(prev => prev + 1);
    // Resultado: ¡Suma 3 de forma fiable!
  };

  return (
    <div className="flex gap-4">
      <button onClick={handleClickIncorrecto}>Suma Incorrecta</button>
      <button onClick={handleClickCorrecto}>Suma Funcional (Correcta)</button>
    </div>
  );
}`,
    interviewTips: [
      'Pregunta clásica: "¿Por qué console.log(cuenta) imprime el valor viejo justo después de setCuenta(cuenta + 1)?" Respuesta senior: Porque setState no muta la variable local en ese frame; programa un nuevo render donde el componente se invocará con el nuevo valor en su closure.',
      'Explica la inicialización perezosa (lazy initial state): si el valor inicial es costoso de calcular (ej: leer localStorage), pasa una función: `useState(() => calcularPesado())`. Solo se ejecutará en el montaje inicial.'
    ],
    commonTraps: [
      'Hacer `arr.push(item)` y luego `setArr(arr)`. React compara con `Object.is` y al ver la misma referencia, omite el render.',
      'Pasar la invocación directa en vez de la función perezosa: `useState(leerLocalStorage())` ejecutará la lectura costosa en cada render aunque descarte el resultado.'
    ],
    keyTakeaway: 'Usa siempre la forma funcional `prev => ...` cuando el nuevo valor dependa del anterior, y nunca mutes la referencia.',
    componentKey: 'UseStateAsyncDemo',
    tags: ['useState', 'actualizacion-funcional', 'inmutabilidad', 'lazy-initial-state']
  },
  {
    id: '2.2',
    level: 2,
    levelTitle: 'Estado y Hooks Básicos',
    title: '2.2 `useEffect` (Sincronización y ciclo de vida)',
    summary: 'Sincroniza el componente con sistemas externos (APIs, timers, eventos DOM). Su función de retorno (cleanup) previene fugas de memoria.',
    whatIsIt: `\`useEffect\` permite ejecutar efectos secundarios después de que React ha terminado la fase de render y el navegador ha pintado la pantalla.

El array de dependencias define su ciclo:
- **Sin array (\`useEffect(fn)\`)**: Corre después de CADA render.
- **Array vacío (\`[]\`)**: Corre solo una vez al montar el componente.
- **Con dependencias (\`[a, b]\`)**: Corre al montar y cada vez que el valor de \`a\` o \`b\` cambie según \`Object.is\`.

**La función de limpieza (Cleanup Function)**:
La función retornada por \`useEffect\` se ejecuta:
1. Justo antes de que el efecto vuelva a correr (cuando las dependencias cambian).
2. Cuando el componente se desmonta de la pantalla.
Es vital para cancelar peticiones, limpiar \`setInterval\` o remover event listeners.`,
    codeSnippet: `function TemporizadorActivo() {
  const [segundos, setSegundos] = useState(0);

  useEffect(() => {
    // 1. Configuración del efecto
    const timerId = setInterval(() => {
      setSegundos(s => s + 1);
    }, 1000);

    // 2. Limpieza obligatoria (Cleanup)
    return () => {
      clearInterval(timerId); // Evita fugas de memoria y timers huérfanos
    };
  }, []); // Solo al montar y desmontar

  return <p>Tiempo transcurrido: {segundos}s</p>;
}`,
    interviewTips: [
      'Enfatiza la frase de la documentación oficial: "useEffect no es un método de ciclo de vida, es un mecanismo de sincronización con el mundo exterior".',
      'Si puedes calcular algo derivado del estado o de las props durante el propio render, NO uses un `useEffect`. Los effects para sincronizar estado interno son un antipatrón común.'
    ],
    commonTraps: [
      'Olvidar la función de retorno al suscribirse a eventos de `window` o timers, provocando fugas de memoria acumulativas.',
      'Omitir dependencias usadas dentro del efecto para "evitar que corra", lo que conduce directamente a bugs de closures obsoletas (stale closures).'
    ],
    keyTakeaway: 'useEffect es para sincronizar con sistemas externos al árbol de React. Limpia siempre los recursos al desmontar.',
    componentKey: 'UseEffectLifecycleDemo',
    tags: ['useEffect', 'dependencias', 'cleanup', 'fugas-de-memoria']
  },
  {
    id: '2.3',
    level: 2,
    levelTitle: 'Estado y Hooks Básicos',
    title: '2.3 Componentes controlados vs. no controlados',
    summary: 'Controlado: React es la fuente de la verdad con value + onChange. No controlado: el DOM retiene el valor y se lee vía useRef.',
    whatIsIt: `Se refiere al manejo de los elementos de formulario (\`<input>\`, \`<select>\`, \`<textarea>\`):

1. **Componente Controlado**:
- El valor está enlazado a un estado de React (\`value={valor}\`).
- Las mutaciones ocurren a través de handlers (\`onChange={(e) => setValor(e.target.value)}\`).
- Ventajas: Validación inmediata, deshabilitado de botones reactivo, inputs dependientes.
- Desventajas: Provoca un re-render por cada tecla pulsada.

2. **Componente No Controlado**:
- El navegador maneja el valor en su DOM interno.
- Se accede al valor usando una referencia (\`ref={inputRef}\`) o al hacer submit con \`new FormData(e.currentTarget)\`.
- Ventajas: Máximo rendimiento, código simple, ideal para formularios extensos o librerías como React Hook Form.`,
    codeSnippet: `// 1. Controlado: Estado en React
function InputControlado() {
  const [texto, setTexto] = useState('');
  return (
    <div>
      <input value={texto} onChange={e => setTexto(e.target.value)} />
      <span>Caracteres: {texto.length}</span>
    </div>
  );
}

// 2. No Controlado: Estado en el DOM
function InputNoControlado() {
  const inputRef = useRef<HTMLInputElement>(null);
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Valor leído del DOM: ' + inputRef.current?.value);
  };
  return (
    <form onSubmit={handleSubmit}>
      <input ref={inputRef} defaultValue="Texto inicial" />
      <button type="submit">Enviar</button>
    </form>
  );
}`,
    interviewTips: [
      'Explica por qué React Hook Form prefiere componentes no controlados: al registrar refs nativas, escribir en un campo no desencadena un ciclo de renderizado en toda la pantalla, manteniendo 60 FPS incluso con cientos de campos.',
      'Menciona el uso de `defaultValue` vs `value`: en componentes no controlados se usa `defaultValue` para fijar el valor inicial sin volverlo controlado.'
    ],
    commonTraps: [
      'El warning: "A component is changing an uncontrolled input to be controlled". Ocurre cuando inicias con `value={undefined}` y luego pasa a tener string. Solución: `value={texto ?? ""}`.'
    ],
    keyTakeaway: 'Controlado ofrece reactividad y validación instantánea; no controlado ofrece rendimiento óptimo y simplicidad.',
    componentKey: 'ControlledVsUncontrolledDemo',
    tags: ['formularios', 'controlados', 'no-controlados', 'useRef']
  },
  {
    id: '2.4',
    level: 2,
    levelTitle: 'Estado y Hooks Básicos',
    title: '2.4 Formularios y validación en React',
    summary: 'Patrones para formularios multi-campo, unificación de handlers y validación síncrona/asíncrona con feedback visual accesible.',
    whatIsIt: `Manejar formularios eficientemente en React requiere estructurar el estado para evitar declarar un \`useState\` independiente para cada campo.

Patrón recomendado de handler unificado:
- Se declara un solo objeto de estado para todos los campos: \`const [form, setForm] = useState({ email: '', password: '' })\`.
- Se asigna el atributo \`name\` a cada input coincidiendo con la llave del objeto.
- Un único handler actualiza dinámicamente la propiedad con computación de llaves: \`setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))\`.
- La función de validación comprueba las reglas y genera un diccionario de errores tipado antes de enviar.`,
    codeSnippet: `function FormularioRegistro() {
  const [form, setForm] = useState({ email: '', pass: '' });
  const [errores, setErrores] = useState<{ email?: string; pass?: string }>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const validar = () => {
    const errs: { email?: string; pass?: string } = {};
    if (!form.email.includes('@')) errs.email = 'Email inválido';
    if (form.pass.length < 6) errs.pass = 'Mínimo 6 caracteres';
    return errs;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const nuevosErrores = validar();
    setErrores(nuevosErrores);
    if (Object.keys(nuevosErrores).length === 0) {
      console.log('Enviando:', form);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <input name="email" value={form.email} onChange={handleChange} placeholder="Email" />
      {errores.email && <p className="text-red-500 text-sm">{errores.email}</p>}
      <input name="pass" type="password" value={form.pass} onChange={handleChange} placeholder="Contraseña" />
      {errores.pass && <p className="text-red-500 text-sm">{errores.pass}</p>}
      <button type="submit">Registrarse</button>
    </form>
  );
}`,
    interviewTips: [
      'Destaca la importancia de la accesibilidad en formularios: enlazar etiquetas con `htmlFor="id"`, marcar `aria-invalid={!!error}` y asociar el mensaje de error con `aria-describedby="error-id"`.',
      'Para producción en proyectos medianos/grandes, argumenta por qué se opta por React Hook Form + Zod (validación basada en esquemas sin duplicar lógica entre frontend y backend).'
    ],
    commonTraps: [
      'Declarar 15 `useState` separados para un formulario de 15 campos en lugar de un objeto consolidado o una librería de formularios.',
      'Validar únicamente en el frontend y olvidar que cualquier validación en cliente es solo conveniencia de UX; la seguridad real se valida en el backend.'
    ],
    keyTakeaway: 'Consolida campos con `[e.target.name]: value` o usa React Hook Form para validación desacoplada y accesible.',
    componentKey: 'FormValidationDemo',
    tags: ['formularios', 'validacion', 'handlers-dinamicos', 'accesibilidad']
  },
  {
    id: '2.5',
    level: 2,
    levelTitle: 'Estado y Hooks Básicos',
    title: '2.5 Lifting State Up (Elevar el estado)',
    summary: 'Compartir estado entre componentes hermanos moviéndolo al ancestro común más cercano y distribuyéndolo vía props.',
    whatIsIt: `A menudo, varios componentes necesitan reflejar los mismos datos cambiantes (ej: un conversor de moneda o dos inputs de temperatura Celsius y Fahrenheit).

En React, los componentes no pueden comunicarse de forma lateral directamente. La solución canónica es **elevar el estado (Lifting State Up)**:
1. Se retira el estado local de los componentes hijos.
2. Se traslada al ancestro común más cercano.
3. El ancestro común pasa el valor actual hacia abajo a través de props y una función callback para actualizarlo.
4. Ambos hijos permanecen perfectamente sincronizados gracias al flujo de datos unidireccional.`,
    codeSnippet: `function ConversorTemperatura() {
  const [celsius, setCelsius] = useState(0);

  const fahrenheit = (celsius * 9) / 5 + 32;

  const handleFahrenheitChange = (f: number) => {
    setCelsius(((f - 32) * 5) / 9);
  };

  return (
    <div className="grid grid-cols-2 gap-4">
      <InputTemperatura label="Celsius (°C)" valor={celsius} onChange={setCelsius} />
      <InputTemperatura label="Fahrenheit (°F)" valor={fahrenheit} onChange={handleFahrenheitChange} />
    </div>
  );
}

function InputTemperatura({ label, valor, onChange }: { label: string; valor: number; onChange: (v: number) => void }) {
  return (
    <div>
      <label>{label}</label>
      <input type="number" value={Math.round(valor * 100) / 100} onChange={e => onChange(Number(e.target.value))} />
    </div>
  );
}`,
    interviewTips: [
      'Explica el concepto de "Single Source of Truth" (Única fuente de verdad): no guardes Celsius y Fahrenheit como dos estados independientes que se sincronizan con useEffect; guarda uno solo y deriva el otro durante el renderizado.',
      'Explica cuándo elevar el estado deja de ser suficiente: si el ancestro común está a demasiados niveles de distancia (prop drilling severo), es momento de considerar Composición, Context API o Zustand.'
    ],
    commonTraps: [
      'Duplicar el estado en ambos hijos e intentar sincronizarlos mediante llamadas cruzadas de `useEffect`, lo cual crea bucles infinitos de renderizado y estados desfasados.',
      'Elevar el estado demasiado alto (al componente raíz de toda la app), provocando re-renders innecesarios en toda la aplicación.'
    ],
    keyTakeaway: 'Eleva el estado al ancestro común más cercano y deriva valores matemáticos durante el render en vez de guardarlos por duplicado.',
    componentKey: 'LiftingStateDemo',
    tags: ['lifting-state', 'single-source-of-truth', 'estado-derivado', 'sincronizacion']
  },
  {
    id: '2.6',
    level: 2,
    levelTitle: 'Estado y Hooks Básicos',
    title: '2.6 Composición vs. Herencia en React',
    summary: 'React favorece fuertemente la composición mediante children y slots sobre la herencia de clases tradicional.',
    whatIsIt: `En la documentación oficial de React el equipo de Facebook señaló que tras miles de componentes en producción nunca encontraron un caso de uso donde recomendaran la herencia de componentes.

**La composición resuelve todos los casos mediante dos técnicas principales**:
1. **Contención**: Pasar elementos anidados mediante la prop especial \`children\`.
2. **Especialización**: Un componente más específico renderiza a uno más genérico configurándolo con props específicas (ej: un \`DialogoBienvenida\` renderiza un \`Dialogo\` genérico).
3. **Slots / Ranuras**: Pasar componentes completos a través de props nombradas (\`encabezado={<Header />}\`, \`lateral={<Sidebar />}\`).`,
    codeSnippet: `// Componente genérico con Slots y Children
interface CardProps {
  header?: React.ReactNode;
  footer?: React.ReactNode;
  children: React.ReactNode;
}

function Card({ header, footer, children }: CardProps) {
  return (
    <div className="rounded-xl border bg-card shadow-sm">
      {header && <div className="border-b p-4 font-semibold">{header}</div>}
      <div className="p-4">{children}</div>
      {footer && <div className="border-t p-4 bg-muted/30">{footer}</div>}
    </div>
  );
}

// Uso mediante composición limpia:
function PerfilUsuario() {
  return (
    <Card
      header={<h3>Mi Perfil</h3>}
      footer={<button className="btn-primary">Guardar Cambios</button>}
    >
      <p>Configura las opciones de tu cuenta.</p>
    </Card>
  );
}`,
    interviewTips: [
      'Explica cómo la composición es la principal herramienta para mitigar el Prop Drilling: en vez de pasar datos a través de 4 componentes intermedios para que el nieto los pinte, armas el nieto en el abuelo y lo pasas como `children` directo al intermedio.',
      'Cita el principio de diseño de software: "Favorece la composición sobre la herencia" (GoF Design Patterns).'
    ],
    commonTraps: [
      'Crear jerarquías rígidas de clases o componentes (`BotonBase -> BotonConIcono -> BotonPrimarioConIcono`) en vez de componer con props opcionales y children.',
      'Pasar 20 props de configuración primitivas cuando podrías simplemente aceptar un `React.ReactNode` como ranura.'
    ],
    keyTakeaway: 'Usa `children` y slots para componentes contenedores flexibles. Evita cualquier intento de extender clases en React.',
    componentKey: 'CompositionVsInheritanceDemo',
    tags: ['composicion', 'herencia', 'children', 'slots', 'prop-drilling']
  },
  {
    id: '2.7',
    level: 2,
    levelTitle: 'Estado y Hooks Básicos',
    title: '2.7 `useRef` (Nodos DOM y valores mutables persistentes)',
    summary: 'Guarda una referencia mutable que persiste durante todo el ciclo de vida sin desencadenar re-renders al modificar `.current`.',
    whatIsIt: `\`useRef\` retorna un objeto plano mutable con una única propiedad: \`{ current: initialValue }\`.

Tiene dos usos primordiales:
1. **Acceso directo al DOM imperativo**:
- Enfocar inputs (\`inputRef.current.focus()\`).
- Medir dimensiones o posiciones de scroll.
- Integrarse con librerías externas que no son de React (gráficos D3, mapas Leaflet, reproductores de video).
2. **Almacén de valores mutables entre renders**:
- Guardar IDs de temporizadores (\`timerId.current\`).
- Contadores de renders de diagnóstico.
- Almacenar el valor anterior de una prop o estado sin forzar una actualización visual.

Diferencia crítica con \`useState\`: **Modificar \`ref.current\` NO desencadena un re-render** de React.`,
    codeSnippet: `function InputConFocoYContadorDeRenders() {
  const inputRef = useRef<HTMLInputElement>(null);
  const rendersCount = useRef(0);

  // Incrementamos el ref en cada render:
  rendersCount.current += 1; // NO causa bucle infinito porque no re-renderiza

  const handleEnfocar = () => {
    inputRef.current?.focus();
    inputRef.current?.select();
  };

  return (
    <div className="space-y-3">
      <p className="text-sm text-muted">Este componente se ha renderizado: {rendersCount.current} veces.</p>
      <div className="flex gap-2">
        <input ref={inputRef} placeholder="Escribe aquí..." />
        <button onClick={handleEnfocar}>Poner Foco</button>
      </div>
    </div>
  );
}`,
    interviewTips: [
      'Regla de oro: Nunca leas ni escribas en `ref.current` durante la fase pura de renderizado si el resultado afecta lo que se pinta en pantalla (hacerlo rompe el rendering concurrente de React 18/19). Las lecturas/escrituras deben ocurrir en handlers de eventos o dentro de `useEffect`.',
      'Describe la analogía: "useRef es como una variable de instancia `this.miVariable` en una clase, pero adaptada al mundo funcional".'
    ],
    commonTraps: [
      'Intentar usar `useRef` para datos que deben verse actualizados inmediatamente en la pantalla (como un contador visual). Como no causa re-render, la UI se queda congelada hasta que otro evento fuerce una actualización.',
      'Modificar el DOM directamente a través de refs (`inputRef.current.remove()`) interfiriendo con la reconciliación interna de React.'
    ],
    keyTakeaway: 'useRef persiste referencias entre renders sin causar re-renders. Ideal para el DOM y valores mutables entre bastidores.',
    componentKey: 'UseRefDomAndStateDemo',
    tags: ['useRef', 'dom', 'persistencia-mutable', 'contador-renders']
  },
  {
    id: '2.8',
    level: 2,
    levelTitle: 'Estado y Hooks Básicos',
    title: '2.8 Reglas de los Hooks y su mecanismo interno',
    summary: 'Las 2 reglas inviolables: solo en el nivel superior y solo desde componentes/hooks. La lista enlazada interna de Fiber depende del orden exacto de llamada.',
    whatIsIt: `Los Hooks de React están sujetos a dos reglas estrictas exigidas por el linter (\`eslint-plugin-react-hooks\`):
1. **Llamar a los Hooks solo en el nivel superior**:
Nunca los invoques dentro de condicionales (\`if\`), bucles (\`for\`, \`while\`), ni funciones anidadas.
2. **Llamar a los Hooks solo desde funciones de React**:
Únicamente desde componentes funcionales o desde Custom Hooks personalizados (cuyo nombre comience por \`use\`).

**¿Por qué existe esta restricción? (Bajo el capó)**:
React no asocia los hooks a nombres de variables, sino a una **lista enlazada interna (Linked List)** guardada en la fibra del componente (\`fiber.memoizedState\`).
En cada renderizado, React recorre esa lista secuencialmente: la llamada 1 lee el hook 1, la llamada 2 lee el hook 2, etc.
Si un hook estuviera dentro de un \`if\` y en el segundo render la condición fuera falsa, **el orden se desplazaría** y React le entregaría el estado de un hook a otro completamente distinto, corrompiendo la app.`,
    codeSnippet: `// ❌ VIOLACIÓN GRAVE: Hook dentro de condicional
function ComponenteRoto({ esAdmin }: { esAdmin: boolean }) {
  if (esAdmin) {
    const [permisos, setPermisos] = useState(['read']); // 💣 Al cambiar esAdmin, la lista enlazada se desalinea
  }
  const [tema, setTema] = useState('dark');
  // ...
}

// ✅ FORMA CORRECTA: Los hooks siempre corren en el mismo orden incondicional
function ComponenteCorrecto({ esAdmin }: { esAdmin: boolean }) {
  const [permisos, setPermisos] = useState(['read']);
  const [tema, setTema] = useState('dark');

  // La lógica condicional se aplica AL VALOR O RENDER, no a la invocación del hook:
  const permisosActivos = esAdmin ? permisos : [];
  // ...
}`,
    interviewTips: [
      'Esta es una de las preguntas favoritas de los entrevistadores técnicos de nivel Senior: "¿Por qué React exige llamar a los hooks en el nivel superior?". Explicar la lista enlazada interna (`memoizedState`) y el puntero secuencial (`workInProgressHook`) te coloca de inmediato en la franja alta de evaluación técnica.',
      'Menciona el hook `use` introducido en React 19: a diferencia de los hooks clásicos, `use(promise)` o `use(context)` SÍ puede llamarse dentro de condicionales y bucles.'
    ],
    commonTraps: [
      'Intentar engañar a las reglas llamando hooks dentro de callbacks de eventos (`const handleClick = () => { const [x, setX] = useState(0); }`).',
      'Desactivar las advertencias de ESLint (`eslint-disable-next-line react-hooks/rules-of-hooks`) en vez de refactorizar el código correctamente.'
    ],
    keyTakeaway: 'React identifica los hooks por su orden secuencial estricto en cada render. React 19 relaja esto exclusivamente para el nuevo operador `use()`.',
    componentKey: 'HooksRulesAndLinkedListDemo',
    tags: ['reglas-de-los-hooks', 'lista-enlazada', 'fiber-internals', 'eslint']
  }
];
