'use client';

import React, { useState, useRef } from 'react';
import { ArrowDown, AlertTriangle, CheckCircle2, Play, RefreshCw, Cpu, Layers } from 'lucide-react';

// Demo 1.1: Virtual DOM vs Real DOM
export function VirtualDomDemo() {
  const [items, setItems] = useState(['Manzana', 'Pera', 'Plátano']);
  const [nuevoItem, setNuevoItem] = useState('');
  const [logDiffing, setLogDiffing] = useState<string[]>([
    'Virtual DOM inicializado con 3 nodos en memoria heap.',
    'DOM real sincronizado.'
  ]);
  const [mutacionesDom, setMutacionesDom] = useState(0);

  const agregarItem = () => {
    if (!nuevoItem.trim()) return;
    const nuevo = nuevoItem.trim();
    setItems(prev => [...prev, nuevo]);
    setNuevoItem('');
    setMutacionesDom(prev => prev + 1);
    setLogDiffing(prev => [
      `1. Estado modificado -> Nuevo Virtual DOM creado con ${items.length + 1} nodos.`,
      `2. Algoritmo de Diffing: Se comparan los 2 árboles JS en memoria (tiempo: ~0.02ms).`,
      `3. Reconciliador detecta: Solo 1 nodo nuevo ('${nuevo}').`,
      `4. Mutación en DOM real: Solo se ejecuta 1 'document.createElement' en vez de reconstruir la lista entera.`,
      ...prev.slice(0, 4)
    ]);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2 items-center">
        <input
          type="text"
          value={nuevoItem}
          onChange={e => setNuevoItem(e.target.value)}
          placeholder="Escribe una fruta..."
          className="px-3 py-2 border rounded-lg bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          onKeyDown={e => e.key === 'Enter' && agregarItem()}
        />
        <button
          onClick={agregarItem}
          className="px-4 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-1.5"
        >
          <Play className="w-4 h-4" /> Agregar elemento
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 border rounded-xl bg-card">
          <div className="flex items-center justify-between mb-3 border-b pb-2">
            <h4 className="font-semibold text-sm flex items-center gap-2">
              <Layers className="w-4 h-4 text-blue-500" /> Virtual DOM (Árbol en memoria)
            </h4>
            <span className="text-xs bg-blue-500/10 text-blue-600 dark:text-blue-400 font-mono px-2 py-0.5 rounded">
              {items.length} nodos JS
            </span>
          </div>
          <ul className="space-y-1.5 font-mono text-xs">
            {items.map((it, idx) => (
              <li key={idx} className="p-2 rounded bg-muted/40 border border-border/50 flex justify-between">
                <span>FiberNode({it})</span>
                <span className="text-muted text-[10px]">memoizedState: ok</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="p-4 border rounded-xl bg-card">
          <div className="flex items-center justify-between mb-3 border-b pb-2">
            <h4 className="font-semibold text-sm flex items-center gap-2">
              <Cpu className="w-4 h-4 text-emerald-500" /> DOM Real del Navegador
            </h4>
            <span className="text-xs bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-mono px-2 py-0.5 rounded">
              Mutaciones reales: {mutacionesDom}
            </span>
          </div>
          <div className="space-y-2">
            <div className="flex flex-wrap gap-1.5">
              {items.map((it, idx) => (
                <span key={idx} className="px-2.5 py-1 bg-emerald-500/15 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 rounded text-xs font-medium">
                  {it}
                </span>
              ))}
            </div>
            <div className="mt-4 pt-3 border-t text-xs space-y-1">
              <p className="font-semibold text-muted text-[11px] uppercase tracking-wider">Historial de Diffing:</p>
              {logDiffing.map((log, i) => (
                <p key={i} className="text-muted leading-tight font-mono text-[11px]">{log}</p>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Demo 1.2: Expresiones JSX
export function JsxExpressionsDemo() {
  const [contador, setContador] = useState(5);
  const [usuario, setUsuario] = useState('Dev Senior');
  const [mostrarDetalles, setMostrarDetalles] = useState(true);

  return (
    <div className="space-y-4">
      <div className="p-4 border rounded-xl bg-card space-y-3">
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => setContador(c => c + 1)}
            className="px-3 py-1.5 bg-primary/10 text-primary border border-primary/20 rounded-lg text-xs font-medium hover:bg-primary/20"
          >
            Incrementar: {contador}
          </button>
          <button
            onClick={() => setMostrarDetalles(d => !d)}
            className="px-3 py-1.5 bg-muted rounded-lg text-xs font-medium hover:bg-muted/80"
          >
            Alternar Detalles ({mostrarDetalles ? 'Visibles' : 'Ocultos'})
          </button>
        </div>

        <div className="p-3 bg-muted/30 rounded-lg border text-sm space-y-1.5">
          <p><strong>1. Operación matemática en JSX:</strong> 10 * {contador} = <span className="font-mono text-primary font-bold">{10 * contador}</span></p>
          <p><strong>2. Transformación de String en JSX:</strong> {usuario.toUpperCase()}</p>
          <p><strong>3. Operador Ternario en JSX:</strong> {contador % 2 === 0 ? 'El número es PAR' : 'El número es IMPAR'}</p>
          {mostrarDetalles && (
            <div className="p-2 bg-blue-500/10 border border-blue-500/20 text-blue-700 dark:text-blue-300 rounded text-xs mt-2">
              Fragmento renderizado condicionalmente mediante evaluación de expresión lógica.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Demo 1.3: Componentes funcionales vs clase
export function FunctionalVsClassDemo() {
  const [cuentaFuncional, setCuentaFuncional] = useState(0);
  const [cuentaClaseSimulada, setCuentaClaseSimulada] = useState(0);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="p-4 border rounded-xl bg-card">
        <div className="flex items-center justify-between mb-2">
          <h4 className="font-semibold text-sm text-emerald-600 dark:text-emerald-400">Componente Funcional (Moderno)</h4>
          <span className="text-xs bg-emerald-500/10 text-emerald-600 px-2 py-0.5 rounded font-mono">React 19 / Hooks</span>
        </div>
        <p className="text-xs text-muted mb-3">Usa `useState`, funciones puras y closures. Cero enlaces de `this`.</p>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setCuentaFuncional(c => c + 1)}
            className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700"
          >
            Incrementar: {cuentaFuncional}
          </button>
          <button onClick={() => setCuentaFuncional(0)} className="text-xs text-muted hover:underline">Reset</button>
        </div>
      </div>

      <div className="p-4 border rounded-xl bg-card">
        <div className="flex items-center justify-between mb-2">
          <h4 className="font-semibold text-sm text-amber-600 dark:text-amber-400">Componente de Clase (Legado)</h4>
          <span className="text-xs bg-amber-500/10 text-amber-600 px-2 py-0.5 rounded font-mono">this.state / bind</span>
        </div>
        <p className="text-xs text-muted mb-3">Requiere extender `React.Component`, `this.state` y lidiar con binding.</p>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setCuentaClaseSimulada(c => c + 1)}
            className="px-4 py-2 bg-amber-600 text-white rounded-lg text-sm font-medium hover:bg-amber-700"
          >
            this.setState(): {cuentaClaseSimulada}
          </button>
          <button onClick={() => setCuentaClaseSimulada(0)} className="text-xs text-muted hover:underline">Reset</button>
        </div>
      </div>
    </div>
  );
}

// Demo 1.5: La trampa de la prop key con el índice
export function ListKeysTrapDemo() {
  const [items, setItems] = useState([
    { id: 'item-1', texto: 'Comprar leche' },
    { id: 'item-2', texto: 'Revisar PRs' },
    { id: 'item-3', texto: 'Hacer ejercicio' }
  ]);
  const [usarIndices, setUsarIndices] = useState(true);

  const agregarAlPrincipio = () => {
    const nuevo = { id: `item-${Date.now()}`, texto: 'Tarea Nueva ' + (items.length + 1) };
    setItems([nuevo, ...items]);
  };

  const eliminarPrimero = () => {
    setItems(items.slice(1));
  };

  return (
    <div className="space-y-4">
      <div className="p-3 border rounded-xl bg-muted/20 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setUsarIndices(!usarIndices)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              usarIndices ? 'bg-red-500/20 text-red-600 border border-red-500/30' : 'bg-emerald-500/20 text-emerald-600 border border-emerald-500/30'
            }`}
          >
            Modo: {usarIndices ? '❌ Usando INDEX como key' : '✅ Usando ID único y estable'}
          </button>
        </div>
        <div className="flex gap-2">
          <button
            onClick={agregarAlPrincipio}
            className="px-3 py-1.5 bg-primary text-white text-xs rounded-lg font-medium hover:bg-primary/90"
          >
            Insertar al inicio
          </button>
          <button
            onClick={eliminarPrimero}
            disabled={items.length === 0}
            className="px-3 py-1.5 bg-red-600 text-white text-xs rounded-lg font-medium hover:bg-red-700 disabled:opacity-50"
          >
            Borrar primero
          </button>
        </div>
      </div>

      <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl text-xs text-amber-800 dark:text-amber-200">
        <p className="font-semibold flex items-center gap-1.5">
          <AlertTriangle className="w-4 h-4 text-amber-500" /> Instrucción para ver el bug:
        </p>
        <p className="mt-1">
          Escribe texto en los inputs y marca algún checkbox. Luego presiona <strong>&quot;Insertar al inicio&quot;</strong> o <strong>&quot;Borrar primero&quot;</strong>.
          En modo <strong>INDEX</strong>, verás que el texto que escribiste permanece en la posición incorrecta porque React asocia el estado interno al índice 0. En modo <strong>ID ÚNICO</strong>, el estado viaja correctamente con su ítem.
        </p>
      </div>

      <div className="space-y-2 border rounded-xl p-4 bg-card">
        {items.map((item, index) => {
          const keyProp = usarIndices ? index : item.id;
          return (
            <div key={keyProp} className="flex items-center gap-3 p-2 border rounded-lg bg-background">
              <span className="font-mono text-xs text-muted w-16">
                key: {String(keyProp)}
              </span>
              <input type="checkbox" className="w-4 h-4 rounded text-primary" />
              <span className="font-medium text-xs w-36">{item.texto}</span>
              <input
                type="text"
                placeholder="Escribe algo aquí..."
                defaultValue=""
                className="flex-1 px-2.5 py-1 text-xs border rounded bg-card text-foreground"
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Demo 1.6: Trampa del 0 en renderizado condicional
export function ConditionalRenderingDemo() {
  const [mensajes, setMensajes] = useState<string[]>([]);

  return (
    <div className="space-y-4">
      <div className="flex gap-2 items-center">
        <button
          onClick={() => setMensajes(prev => [...prev, `Mensaje #${prev.length + 1}`])}
          className="px-3 py-1.5 bg-primary text-white rounded-lg text-xs font-medium"
        >
          Añadir mensaje (Total: {mensajes.length})
        </button>
        <button
          onClick={() => setMensajes([])}
          className="px-3 py-1.5 bg-muted rounded-lg text-xs font-medium hover:bg-muted/80"
        >
          Vaciar lista a 0
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 border border-red-500/30 rounded-xl bg-red-500/5">
          <h4 className="font-semibold text-xs text-red-600 dark:text-red-400 mb-2 flex items-center gap-1.5">
            <AlertTriangle className="w-4 h-4" /> La Trampa Clásica: &#123;count && &lt;UI /&gt;&#125;
          </h4>
          <p className="text-xs text-muted mb-3 font-mono text-[11px]">
            Código: &#123;mensajes.length && &lt;span&gt;Tienes mensajes&lt;/span&gt;&#125;
          </p>
          <div className="p-3 bg-card border rounded-lg min-h-[50px] flex items-center justify-center font-bold text-sm">
            {/* 💣 Esta expresión renderizará un '0' en pantalla cuando mensajes.length sea 0 */}
            {mensajes.length && (
              <span className="text-emerald-500">¡Tienes {mensajes.length} mensajes pendientes!</span>
            )}
          </div>
          <p className="text-[11px] text-muted mt-2">
            Nota cómo cuando la lista está vacía, aparece un <strong className="text-red-500">0</strong> literal en la caja.
          </p>
        </div>

        <div className="p-4 border border-emerald-500/30 rounded-xl bg-emerald-500/5">
          <h4 className="font-semibold text-xs text-emerald-600 dark:text-emerald-400 mb-2 flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4" /> La Forma Correcta: Comparación booleana
          </h4>
          <p className="text-xs text-muted mb-3 font-mono text-[11px]">
            Código: &#123;mensajes.length &gt; 0 && &lt;span&gt;Tienes mensajes&lt;/span&gt;&#125;
          </p>
          <div className="p-3 bg-card border rounded-lg min-h-[50px] flex items-center justify-center font-medium text-sm">
            {mensajes.length > 0 ? (
              <span className="text-emerald-500">¡Tienes {mensajes.length} mensajes pendientes!</span>
            ) : (
              <span className="text-muted text-xs">Bandeja limpia (cero mensajes).</span>
            )}
          </div>
          <p className="text-[11px] text-muted mt-2">
            La comparación booleana previene que números falsy se pinten en pantalla.
          </p>
        </div>
      </div>
    </div>
  );
}

// Demo 1.7: Eventos sintéticos y preventDefault
export function EventsDemo() {
  const [registroEventos, setRegistroEventos] = useState<string[]>([]);
  const [texto, setTexto] = useState('');

  const agregarLog = (msg: string) => {
    setRegistroEventos(prev => [msg, ...prev.slice(0, 5)]);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Evita recarga
    agregarLog(`[Submit Prevenido]: e.preventDefault() evitó la recarga total del navegador. Enviado: "${texto}"`);
    setTexto('');
  };

  return (
    <div className="space-y-3">
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          value={texto}
          onChange={e => {
            setTexto(e.target.value);
            agregarLog(`[SyntheticEvent onChange]: valor actual = "${e.target.value}"`);
          }}
          placeholder="Escribe y presiona Enter..."
          className="flex-1 px-3 py-2 border rounded-lg bg-card text-foreground text-sm"
        />
        <button type="submit" className="px-4 py-2 bg-primary text-white text-sm font-medium rounded-lg">
          Enviar Formulario
        </button>
      </form>

      <div className="p-3 border rounded-xl bg-muted/20 font-mono text-xs space-y-1">
        <p className="font-semibold text-muted text-[11px] uppercase">Registro de SyntheticEvent:</p>
        {registroEventos.length === 0 ? (
          <p className="text-muted italic">Interactúa con el formulario para registrar eventos...</p>
        ) : (
          registroEventos.map((log, i) => <p key={i} className="text-xs text-foreground/80">{log}</p>)
        )}
      </div>
    </div>
  );
}

// Demo 1.9: Flujo unidireccional (Props down, events up)
export function DataFlowDemo() {
  const [colorPadre, setColorPadre] = useState('#3b82f6');
  const [mensajeHijo, setMensajeHijo] = useState('Sin mensaje aún');

  return (
    <div className="p-4 border-2 border-dashed border-blue-500/40 rounded-2xl bg-card space-y-4">
      <div className="flex items-center justify-between border-b pb-2">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-blue-500" />
          <h4 className="font-bold text-sm">Componente Padre</h4>
        </div>
        <span className="text-xs font-mono bg-blue-500/10 text-blue-500 px-2 py-0.5 rounded">
          Dueño del Estado
        </span>
      </div>

      <div className="text-xs space-y-1">
        <p>Color seleccionado en el Padre: <span className="font-mono font-bold" style={{ color: colorPadre }}>{colorPadre}</span></p>
        <p>Última notificación recibida del Hijo: <strong className="text-foreground">{mensajeHijo}</strong></p>
      </div>

      <div className="flex justify-center my-2">
        <div className="flex items-center gap-1.5 text-xs text-muted font-mono bg-muted/40 px-3 py-1 rounded-full">
          <span>Props descienden (color)</span>
          <ArrowDown className="w-3.5 h-3.5 text-primary animate-bounce" />
          <span>Callbacks ascienden (onCambiar)</span>
        </div>
      </div>

      {/* Componente Hijo */}
      <div className="p-3 border rounded-xl bg-background shadow-inner space-y-2">
        <div className="flex items-center justify-between">
          <h5 className="font-semibold text-xs text-emerald-600 dark:text-emerald-400">Componente Hijo (Presentacional)</h5>
          <span className="text-[10px] text-muted">Recibe props, invoca callback</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setColorPadre('#ef4444');
              setMensajeHijo('Hijo pulsó botón Rojo');
            }}
            className="px-3 py-1.5 bg-red-500 text-white rounded text-xs font-medium hover:bg-red-600"
          >
            Poner Rojo
          </button>
          <button
            onClick={() => {
              setColorPadre('#10b981');
              setMensajeHijo('Hijo pulsó botón Verde');
            }}
            className="px-3 py-1.5 bg-emerald-500 text-white rounded text-xs font-medium hover:bg-emerald-600"
          >
            Poner Verde
          </button>
          <button
            onClick={() => {
              setColorPadre('#8b5cf6');
              setMensajeHijo('Hijo pulsó botón Violeta');
            }}
            className="px-3 py-1.5 bg-purple-500 text-white rounded text-xs font-medium hover:bg-purple-600"
          >
            Poner Violeta
          </button>
        </div>
      </div>
    </div>
  );
}

// Demo 1.8: Comparativa de Estilos en React
export function StylesComparisonDemo() {
  const [estrategia, setEstrategia] = useState<'tailwind' | 'inline' | 'modules' | 'cssinjs'>('tailwind');
  const [progreso, setProgreso] = useState(65);
  const [colorPrimario, setColorPrimario] = useState<'blue' | 'emerald' | 'purple' | 'amber'>('blue');
  const [radioBorde, setRadioBorde] = useState<'rounded-none' | 'rounded-lg' | 'rounded-2xl'>('rounded-xl' as 'rounded-lg');
  const [modoOscuro, setModoOscuro] = useState(false);

  const coloresMap = {
    blue: { bg: 'bg-blue-600', hover: 'hover:bg-blue-700', hex: '#2563eb', border: 'border-blue-500/30', text: 'text-blue-500' },
    emerald: { bg: 'bg-emerald-600', hover: 'hover:bg-emerald-700', hex: '#059669', border: 'border-emerald-500/30', text: 'text-emerald-500' },
    purple: { bg: 'bg-purple-600', hover: 'hover:bg-purple-700', hex: '#7c3aed', border: 'border-purple-500/30', text: 'text-purple-500' },
    amber: { bg: 'bg-amber-600', hover: 'hover:bg-amber-700', hex: '#d97706', border: 'border-amber-500/30', text: 'text-amber-500' }
  };

  const selColor = coloresMap[colorPrimario];

  return (
    <div className="space-y-6">
      {/* Selector de Estrategia de Estilo */}
      <div className="space-y-2">
        <label className="text-xs font-bold text-muted uppercase tracking-wider block">
          Selecciona una Estrategia de Estilizado en React:
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          <button
            onClick={() => setEstrategia('tailwind')}
            className={`p-2.5 rounded-xl border text-xs font-semibold transition-all text-left ${
              estrategia === 'tailwind'
                ? 'border-blue-500 bg-blue-500/15 text-blue-600 dark:text-blue-400 font-bold shadow-xs'
                : 'border-border/80 hover:bg-muted text-foreground'
            }`}
          >
            <div className="text-[11px] font-bold">1. Tailwind CSS</div>
            <div className="text-[10px] text-muted font-normal mt-0.5">Utility-first • Cero runtime</div>
          </button>

          <button
            onClick={() => setEstrategia('inline')}
            className={`p-2.5 rounded-xl border text-xs font-semibold transition-all text-left ${
              estrategia === 'inline'
                ? 'border-amber-500 bg-amber-500/15 text-amber-600 dark:text-amber-400 font-bold shadow-xs'
                : 'border-border/80 hover:bg-muted text-foreground'
            }`}
          >
            <div className="text-[11px] font-bold">2. Estilos en Línea</div>
            <div className="text-[10px] text-muted font-normal mt-0.5">style={'{{ ... }}'} • Valores dinámicos</div>
          </button>

          <button
            onClick={() => setEstrategia('modules')}
            className={`p-2.5 rounded-xl border text-xs font-semibold transition-all text-left ${
              estrategia === 'modules'
                ? 'border-emerald-500 bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-bold shadow-xs'
                : 'border-border/80 hover:bg-muted text-foreground'
            }`}
          >
            <div className="text-[11px] font-bold">3. CSS Modules</div>
            <div className="text-[10px] text-muted font-normal mt-0.5">Scoped CSS • Nombres hasheados</div>
          </button>

          <button
            onClick={() => setEstrategia('cssinjs')}
            className={`p-2.5 rounded-xl border text-xs font-semibold transition-all text-left ${
              estrategia === 'cssinjs'
                ? 'border-purple-500 bg-purple-500/15 text-purple-600 dark:text-purple-400 font-bold shadow-xs'
                : 'border-border/80 hover:bg-muted text-foreground'
            }`}
          >
            <div className="text-[11px] font-bold">4. CSS-in-JS (Runtime)</div>
            <div className="text-[10px] text-muted font-normal mt-0.5">styled-components • Inyección DOM</div>
          </button>
        </div>
      </div>

      {/* Controles Dinámicos para experimentar */}
      <div className="p-4 rounded-2xl border border-border/80 bg-muted/20 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
          <span className="font-bold text-foreground">Ajustes Dinámicos para el Componente:</span>

          <div className="flex items-center gap-3 flex-wrap">
            {/* Color selector */}
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] text-muted font-medium">Color:</span>
              {(['blue', 'emerald', 'purple', 'amber'] as const).map(c => (
                <button
                  key={c}
                  onClick={() => setColorPrimario(c)}
                  className={`w-5 h-5 rounded-full border-2 transition-transform ${coloresMap[c].bg} ${
                    colorPrimario === c ? 'scale-125 border-foreground ring-2 ring-primary/30' : 'border-transparent'
                  }`}
                  title={c}
                />
              ))}
            </div>

            {/* Slider de Progreso */}
            <div className="flex items-center gap-2">
              <span className="text-[11px] text-muted font-medium">Progreso ({progreso}%):</span>
              <input
                type="range"
                min="10"
                max="100"
                value={progreso}
                onChange={e => setProgreso(Number(e.target.value))}
                className="w-24 h-1.5 accent-primary cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Tarjeta Renderizada con la Estrategia Activa */}
        <div className="p-5 rounded-2xl border border-border/80 bg-card shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-muted">
              Resultado renderizado según estrategia:
            </span>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${
              estrategia === 'tailwind' || estrategia === 'modules'
                ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30'
                : estrategia === 'inline'
                ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30'
                : 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/30'
            }`}>
              {estrategia === 'tailwind' && '✅ 100% Compatible con React Server Components (RSC)'}
              {estrategia === 'modules' && '✅ 100% Compatible con RSC (Cero Runtime)'}
              {estrategia === 'inline' && '⚠️ Recomendado solo para valores calculados matemáticamente'}
              {estrategia === 'cssinjs' && '❌ Problemas con RSC streaming y sobrecarga en JS runtime'}
            </span>
          </div>

          {/* DEMO 1: TAILWIND */}
          {estrategia === 'tailwind' && (
            <div className="p-4 rounded-xl border border-border/80 bg-background space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-foreground">Tarjeta con Tailwind Utility-First</h4>
                  <p className="text-xs text-muted">Estilos generados en tiempo de compilación por el motor de PostCSS / Turbopack.</p>
                </div>
                <button className={`px-4 py-2 ${selColor.bg} ${selColor.hover} text-white font-bold text-xs rounded-xl shadow-md transition-all active:scale-95`}>
                  Botón Tailwind
                </button>
              </div>

              {/* Barra de progreso */}
              <div className="space-y-1">
                <div className="flex justify-between text-[11px] text-muted">
                  <span>Capacidad en caché</span>
                  <span className="font-mono font-bold">{progreso}%</span>
                </div>
                <div className="w-full h-2.5 bg-muted/40 rounded-full overflow-hidden p-0.5 border border-border/60">
                  <div
                    className={`h-full ${selColor.bg} rounded-full transition-all duration-300`}
                    style={{ width: `${progreso}%` }}
                  />
                </div>
              </div>
            </div>
          )}

          {/* DEMO 2: INLINE STYLES */}
          {estrategia === 'inline' && (
            <div
              style={{
                padding: '16px',
                borderRadius: '12px',
                border: `1px solid ${selColor.hex}40`,
                backgroundColor: 'var(--background)',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
              }}
              className="space-y-3"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-foreground">Tarjeta con style={'{{ ... }}'}</h4>
                  <p className="text-xs text-muted">Valores aplicados directamente al atributo style del elemento DOM.</p>
                </div>
                <button
                  style={{
                    backgroundColor: selColor.hex,
                    color: '#ffffff',
                    padding: '8px 16px',
                    borderRadius: '12px',
                    fontWeight: 'bold',
                    fontSize: '12px',
                    border: 'none',
                    cursor: 'pointer'
                  }}
                >
                  Botón Inline Style
                </button>
              </div>

              {/* Barra dinámica calculada matemáticamente */}
              <div className="space-y-1">
                <div className="flex justify-between text-[11px] text-muted">
                  <span>Cálculo dinámico en cada frame:</span>
                  <span className="font-mono font-bold">{progreso}%</span>
                </div>
                <div style={{ width: '100%', height: '10px', backgroundColor: 'rgba(100,116,139,0.2)', borderRadius: '9999px', overflow: 'hidden' }}>
                  <div
                    style={{
                      width: `${progreso}%`,
                      height: '100%',
                      backgroundColor: selColor.hex,
                      transition: 'width 0.3s ease'
                    }}
                  />
                </div>
              </div>
            </div>
          )}

          {/* DEMO 3: CSS MODULES */}
          {estrategia === 'modules' && (
            <div className="p-4 rounded-xl border border-emerald-500/30 bg-background space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-foreground">Tarjeta simulando CSS Modules</h4>
                  <p className="text-xs text-muted font-mono">
                    className=&quot;Card_contenedor__9fa2c Button_primario__x7b81&quot;
                  </p>
                </div>
                <button className={`px-4 py-2 ${selColor.bg} text-white font-bold text-xs rounded-xl shadow-md`}>
                  styles.botonPrimario
                </button>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-[11px] text-muted font-mono">
                  <span>styles.barraProgreso</span>
                  <span>{progreso}%</span>
                </div>
                <div className="w-full h-2.5 bg-muted/40 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${selColor.bg} rounded-full transition-all duration-300`}
                    style={{ width: `${progreso}%` }}
                  />
                </div>
              </div>
            </div>
          )}

          {/* DEMO 4: CSS-IN-JS (RUNTIME) */}
          {estrategia === 'cssinjs' && (
            <div className="p-4 rounded-xl border border-purple-500/30 bg-background space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-foreground">Simulación styled-components / Emotion</h4>
                  <p className="text-xs text-muted font-mono">
                    &lt;Boton color=&quot;{selColor.hex}&quot; /&gt; -&gt; Inyecta &lt;style&gt; en el &lt;head&gt;
                  </p>
                </div>
                <button className={`px-4 py-2 ${selColor.bg} text-white font-bold text-xs rounded-xl shadow-md`}>
                  styled.button`...`
                </button>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-[11px] text-muted">
                  <span>Sobrecarga en hilo principal:</span>
                  <span className="font-mono text-purple-600 font-bold">~15ms de parseo JS</span>
                </div>
                <div className="w-full h-2.5 bg-muted/40 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${selColor.bg} rounded-full transition-all duration-300`}
                    style={{ width: `${progreso}%` }}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Tabla comparativa técnica para la entrevista */}
      <div className="p-4 rounded-2xl border border-border/80 bg-card overflow-x-auto text-xs space-y-3">
        <h4 className="font-bold text-foreground">Tabla Comparativa para la Entrevista Senior:</h4>
        <table className="w-full text-left border-collapse min-w-[550px]">
          <thead>
            <tr className="border-b border-border text-muted font-mono text-[11px]">
              <th className="py-2 pr-3">Estrategia</th>
              <th className="py-2 pr-3">Runtime Overhead</th>
              <th className="py-2 pr-3">Compatibilidad RSC</th>
              <th className="py-2 pr-3">Pseudo-clases (:hover)</th>
              <th className="py-2">Cuándo Usarlo</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60 text-[11px]">
            <tr className={estrategia === 'tailwind' ? 'bg-blue-500/10 font-semibold' : ''}>
              <td className="py-2 pr-3 font-bold text-blue-600 dark:text-blue-400">Tailwind CSS</td>
              <td className="py-2 pr-3 text-emerald-600 font-bold">0 KB (Compilación)</td>
              <td className="py-2 pr-3 text-emerald-600 font-bold">100% Nativo</td>
              <td className="py-2 pr-3">Sí (hover:, focus:)</td>
              <td className="py-2 text-muted">Desarrollo moderno por defecto en Next.js y React 19.</td>
            </tr>
            <tr className={estrategia === 'modules' ? 'bg-emerald-500/10 font-semibold' : ''}>
              <td className="py-2 pr-3 font-bold text-emerald-600 dark:text-emerald-400">CSS Modules</td>
              <td className="py-2 pr-3 text-emerald-600 font-bold">0 KB (Compilación)</td>
              <td className="py-2 pr-3 text-emerald-600 font-bold">100% Nativo</td>
              <td className="py-2 pr-3">Sí</td>
              <td className="py-2 text-muted">Equipos que prefieren escribir CSS tradicional con scope local.</td>
            </tr>
            <tr className={estrategia === 'inline' ? 'bg-amber-500/10 font-semibold' : ''}>
              <td className="py-2 pr-3 font-bold text-amber-600 dark:text-amber-400">Estilos en línea</td>
              <td className="py-2 pr-3 text-amber-600">Creación de objetos en render</td>
              <td className="py-2 pr-3 text-emerald-600">Compatible</td>
              <td className="py-2 pr-3 text-rose-500">No soportado</td>
              <td className="py-2 text-muted">Solo para valores dinámicos calculados (coordenadas, %).</td>
            </tr>
            <tr className={estrategia === 'cssinjs' ? 'bg-purple-500/10 font-semibold' : ''}>
              <td className="py-2 pr-3 font-bold text-purple-600 dark:text-purple-400">CSS-in-JS (styled)</td>
              <td className="py-2 pr-3 text-rose-500 font-bold">Alto (~12-25KB bundle + parseo)</td>
              <td className="py-2 pr-3 text-rose-500 font-bold">No compatible con streaming</td>
              <td className="py-2 pr-3">Sí</td>
              <td className="py-2 text-muted">Proyectos legacy Client-Side Rendering (CSR).</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

