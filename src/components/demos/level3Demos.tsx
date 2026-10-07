'use client';

import React, { useState, useEffect, useReducer, useMemo, useCallback, useRef, createContext, useContext } from 'react';
import { createPortal } from 'react-dom';
import { AlertTriangle, Play, RefreshCw, Zap, ShieldAlert, Layers, CheckCircle2 } from 'lucide-react';

// Demo 3.1: Context API re-render visualizer
const CounterContext = createContext<{ count: number; inc: () => void }>({ count: 0, inc: () => {} });

export function ContextRerenderDemo() {
  const [count, setCount] = useState(0);
  const inc = () => setCount(c => c + 1);

  return (
    <CounterContext.Provider value={{ count, inc }}>
      <div className="p-4 border rounded-xl bg-card space-y-4">
        <div className="flex items-center justify-between border-b pb-3">
          <div>
            <h4 className="font-semibold text-sm">Context Provider</h4>
            <p className="text-xs text-muted">Cuando el Provider actualiza su valor, TODOS los consumidores se re-evalúan.</p>
          </div>
          <button onClick={inc} className="px-3 py-1.5 bg-primary text-white text-xs font-semibold rounded-lg">
            Incrementar Provider ({count})
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <ConsumidorA />
          <ConsumidorB />
        </div>
      </div>
    </CounterContext.Provider>
  );
}

function ConsumidorA() {
  const { count } = useContext(CounterContext);
  const renders = useRef(0);
  renders.current += 1;
  return (
    <div className="p-3 border rounded-lg bg-background">
      <div className="flex justify-between items-center text-xs">
        <span className="font-semibold">Consumidor A (Lee count)</span>
        <span className="text-[10px] font-mono bg-blue-500/10 text-blue-500 px-2 py-0.5 rounded">Renders: {renders.current}</span>
      </div>
      <p className="text-sm font-mono mt-1">Valor leído: {count}</p>
    </div>
  );
}

function ConsumidorB() {
  const { count } = useContext(CounterContext);
  const renders = useRef(0);
  renders.current += 1;
  return (
    <div className="p-3 border rounded-lg bg-background">
      <div className="flex justify-between items-center text-xs">
        <span className="font-semibold">Consumidor B (Lee count)</span>
        <span className="text-[10px] font-mono bg-purple-500/10 text-purple-500 px-2 py-0.5 rounded">Renders: {renders.current}</span>
      </div>
      <p className="text-sm font-mono mt-1">Valor leído: {count}</p>
    </div>
  );
}

// Demo 3.2: useReducer máquina de estados
type AccionReducer = { type: 'agregar'; texto: string } | { type: 'toggle'; id: number } | { type: 'eliminar'; id: number };
interface TareaSimple { id: number; texto: string; ok: boolean; }

function tareasReducer(state: TareaSimple[], action: AccionReducer): TareaSimple[] {
  switch (action.type) {
    case 'agregar':
      return [...state, { id: Date.now(), texto: action.texto, ok: false }];
    case 'toggle':
      return state.map(t => t.id === action.id ? { ...t, ok: !t.ok } : t);
    case 'eliminar':
      return state.filter(t => t.id !== action.id);
    default:
      return state;
  }
}

export function UseReducerDemo() {
  const [tareas, dispatch] = useReducer(tareasReducer, [
    { id: 1, texto: 'Aprender arquitectura Fiber', ok: true },
    { id: 2, texto: 'Dominar useCallback y memo', ok: false }
  ]);
  const [nueva, setNueva] = useState('');

  const handleAgregar = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nueva.trim()) return;
    dispatch({ type: 'agregar', texto: nueva });
    setNueva('');
  };

  return (
    <div className="p-4 border rounded-xl bg-card space-y-4">
      <form onSubmit={handleAgregar} className="flex gap-2">
        <input
          value={nueva}
          onChange={e => setNueva(e.target.value)}
          placeholder="Nueva tarea con dispatch({ type: 'agregar' })..."
          className="flex-1 px-3 py-2 border rounded-lg bg-background text-foreground text-xs"
        />
        <button type="submit" className="px-4 py-2 bg-primary text-white text-xs font-semibold rounded-lg">
          Despachar Acción
        </button>
      </form>

      <ul className="space-y-1.5 font-mono text-xs">
        {tareas.map(t => (
          <li key={t.id} className="p-2 border rounded-lg bg-background flex items-center justify-between">
            <span
              onClick={() => dispatch({ type: 'toggle', id: t.id })}
              className={`cursor-pointer ${t.ok ? 'line-through text-muted' : 'text-foreground'}`}
            >
              {t.ok ? '☑' : '☐'} {t.texto}
            </span>
            <button
              onClick={() => dispatch({ type: 'eliminar', id: t.id })}
              className="text-red-500 hover:text-red-700 text-xs px-2"
            >
              Borrar
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

// Demo 3.3: useMemo & useCallback & React.memo
const ItemListaMemo = React.memo(function ItemListaMemo({
  texto,
  onBorrar
}: {
  texto: string;
  onBorrar: (t: string) => void;
}) {
  const renders = useRef(0);
  renders.current += 1;
  return (
    <li className="p-2 border rounded bg-background flex items-center justify-between text-xs">
      <span>{texto}</span>
      <div className="flex items-center gap-2">
        <span className="text-[10px] font-mono text-muted">Renders: {renders.current}</span>
        <button onClick={() => onBorrar(texto)} className="text-red-500 hover:underline">x</button>
      </div>
    </li>
  );
});

export function MemoCallbackProfilerDemo() {
  const [contadorPadre, setContadorPadre] = useState(0);
  const [items, setItems] = useState(['React 19', 'Next.js 16', 'TypeScript 5']);
  const [usarCallbackEstable, setUsarCallbackEstable] = useState(true);

  // Callback estable con useCallback vs función nueva inline en cada render
  const callbackEstable = useCallback((it: string) => {
    setItems(prev => prev.filter(x => x !== it));
  }, []);

  const callbackInestable = (it: string) => {
    setItems(prev => prev.filter(x => x !== it));
  };

  const handlerActivo = usarCallbackEstable ? callbackEstable : callbackInestable;

  return (
    <div className="p-4 border rounded-xl bg-card space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b pb-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setContadorPadre(c => c + 1)}
            className="px-3 py-1.5 bg-primary text-white text-xs font-semibold rounded-lg"
          >
            Re-renderizar Padre ({contadorPadre})
          </button>
          <button
            onClick={() => setUsarCallbackEstable(!usarCallbackEstable)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium border ${
              usarCallbackEstable ? 'bg-emerald-500/20 text-emerald-600 border-emerald-500/30' : 'bg-red-500/20 text-red-600 border-red-500/30'
            }`}
          >
            {usarCallbackEstable ? '✅ Con useCallback estable' : '❌ Con función inline recreada'}
          </button>
        </div>
      </div>

      <p className="text-xs text-muted">
        Al hacer clic en &quot;Re-renderizar Padre&quot;: Si tienes activado <strong>useCallback</strong>, los hijos envueltos en <code>React.memo</code> conservan sus renders intactos. Con función inline, <code>React.memo</code> se invalida por referencia nueva.
      </p>

      <ul className="space-y-2">
        {items.map(it => (
          <ItemListaMemo key={it} texto={it} onBorrar={handlerActivo} />
        ))}
      </ul>
    </div>
  );
}

// Demo 3.6: Reconciliación y reinicio forzado por key
export function DiffingHeuristicsDemo() {
  const [usuarioId, setUsuarioId] = useState('user-1');

  return (
    <div className="p-4 border rounded-xl bg-card space-y-4">
      <div className="flex gap-2 items-center">
        <span className="text-xs font-semibold">Seleccionar Usuario:</span>
        <button
          onClick={() => setUsuarioId('user-1')}
          className={`px-3 py-1 text-xs rounded-md ${usuarioId === 'user-1' ? 'bg-primary text-white' : 'border'}`}
        >
          Ana (user-1)
        </button>
        <button
          onClick={() => setUsuarioId('user-2')}
          className={`px-3 py-1 text-xs rounded-md ${usuarioId === 'user-2' ? 'bg-primary text-white' : 'border'}`}
        >
          Carlos (user-2)
        </button>
      </div>

      <div className="p-3 bg-muted/20 border rounded-xl">
        <p className="text-xs text-muted mb-2">
          Formulario con <code>key={usuarioId}</code>. Al cambiar de usuario, React desmonta y resetea limpiamente el estado interno sin necesidad de escribir efectos manuales:
        </p>
        <FormularioConKey key={usuarioId} usuarioId={usuarioId} />
      </div>
    </div>
  );
}

function FormularioConKey({ usuarioId }: { usuarioId: string }) {
  const [nota, setNota] = useState('');
  return (
    <div className="space-y-2">
      <p className="text-xs font-semibold text-primary">Editando perfil de: {usuarioId}</p>
      <input
        value={nota}
        onChange={e => setNota(e.target.value)}
        placeholder={`Escribe una nota para ${usuarioId}...`}
        className="w-full px-3 py-1.5 border rounded bg-background text-xs"
      />
    </div>
  );
}

// Demo 3.7: Fetching con AbortController contra Race Conditions
export function DataFetchingRaceDemo() {
  const [recurso, setRecurso] = useState('post-1');
  const [datos, setDatos] = useState<string | null>(null);
  const [cargando, setCargando] = useState(false);
  const [historialPeticiones, setHistorialPeticiones] = useState<string[]>([]);

  const cargarRecurso = (nuevoId: string) => {
    setRecurso(nuevoId);
  };

  useEffect(() => {
    const controller = new AbortController();
    setCargando(true);
    const tiempoSimulado = recurso === 'post-1' ? 1800 : 300; // post-1 tarda mucho más que post-2

    setHistorialPeticiones(prev => [
      `[Iniciada]: Petición a ${recurso} (espera simulada: ${tiempoSimulado}ms)`,
      ...prev.slice(0, 4)
    ]);

    const timer = setTimeout(() => {
      if (!controller.signal.aborted) {
        setDatos(`Respuesta final recibida para: ${recurso}`);
        setCargando(false);
        setHistorialPeticiones(prev => [
          `[Completada]: Datos de ${recurso} pintados con éxito.`,
          ...prev.slice(0, 4)
        ]);
      }
    }, tiempoSimulado);

    return () => {
      controller.abort();
      clearTimeout(timer);
      setHistorialPeticiones(prev => [
        `[Cancelada por AbortController]: Petición previa a ${recurso} descartada para evitar Race Condition.`,
        ...prev.slice(0, 4)
      ]);
    };
  }, [recurso]);

  return (
    <div className="p-4 border rounded-xl bg-card space-y-4">
      <div className="flex gap-2">
        <button
          onClick={() => cargarRecurso('post-1')}
          className="px-3 py-1.5 bg-primary text-white text-xs rounded-lg font-medium"
        >
          Pedir Post 1 (Lento: 1800ms)
        </button>
        <button
          onClick={() => cargarRecurso('post-2')}
          className="px-3 py-1.5 bg-emerald-600 text-white text-xs rounded-lg font-medium"
        >
          Pedir Post 2 (Rápido: 300ms)
        </button>
      </div>

      <div className="p-3 border rounded-lg bg-background">
        <p className="text-xs font-semibold">Resultado visible en pantalla:</p>
        <p className="text-sm font-mono mt-1 text-primary">
          {cargando ? 'Cargando respuesta en red...' : datos}
        </p>
      </div>

      <div className="p-3 bg-muted/20 border rounded-xl text-xs font-mono space-y-1">
        <p className="font-semibold text-muted text-[11px] uppercase">Monitor de AbortController:</p>
        {historialPeticiones.map((h, i) => (
          <p key={i} className="text-muted leading-tight">{h}</p>
        ))}
      </div>
    </div>
  );
}

// Demo 3.9: Error Boundary interactivo
export function ErrorBoundaryDemo() {
  const [tieneError, setTieneError] = useState(false);
  const [romperHijo, setRomperHijo] = useState(false);

  const resetear = () => {
    setRomperHijo(false);
    setTieneError(false);
  };

  return (
    <div className="p-4 border rounded-xl bg-card space-y-3">
      <div className="flex justify-between items-center">
        <h4 className="font-semibold text-xs">Simulador de Límite de Error (Error Boundary)</h4>
        <button
          onClick={() => { setRomperHijo(true); setTieneError(true); }}
          className="px-3 py-1.5 bg-red-600 text-white text-xs font-semibold rounded-lg hover:bg-red-700"
        >
          Provocar Excepción de Render
        </button>
      </div>

      {tieneError ? (
        <div className="p-4 border border-red-500/40 bg-red-500/10 rounded-xl space-y-2">
          <div className="flex items-center gap-2 text-red-600 dark:text-red-400 font-semibold text-xs">
            <ShieldAlert className="w-4 h-4" /> Fallback de Error Boundary Activado
          </div>
          <p className="text-xs text-red-700 dark:text-red-300">
            Un componente hijo lanzó una excepción en el render. La aplicación principal continúa funcionando sin pantalla en blanco.
          </p>
          <button onClick={resetear} className="px-3 py-1 bg-red-600 text-white text-xs rounded font-medium">
            Resetear Boundary
          </button>
        </div>
      ) : (
        <div className="p-4 border rounded-lg bg-emerald-500/5 text-emerald-700 dark:text-emerald-300 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" /> Subárbol funcionando de forma saludable.
        </div>
      )}
    </div>
  );
}

// Demo 3.10: Portals (createPortal)
export function PortalModalDemo() {
  const [abierto, setAbierto] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="p-4 border rounded-xl bg-card space-y-3 overflow-hidden relative">
      <div className="flex items-center justify-between">
        <p className="text-xs text-muted">
          Este contenedor tiene <code>overflow: hidden</code>. Un modal tradicional quedaría recortado aquí dentro.
        </p>
        <button
          onClick={() => setAbierto(true)}
          className="px-4 py-2 bg-primary text-white text-xs font-semibold rounded-lg"
        >
          Abrir Modal con Portal
        </button>
      </div>

      {abierto && mounted && createPortal(
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in"
          onClick={() => setAbierto(false)}
        >
          <div
            className="bg-card border border-border p-6 rounded-2xl shadow-2xl max-w-sm w-full space-y-4"
            onClick={e => e.stopPropagation()}
          >
            <h3 className="font-bold text-sm text-foreground">Modal Renderizado en document.body</h3>
            <p className="text-xs text-muted">
              Físicamente este nodo vive en el fondo del body, escapando de cualquier overflow relativo o transformaciones CSS del contenedor padre.
            </p>
            <div className="flex justify-end">
              <button
                onClick={() => setAbierto(false)}
                className="px-4 py-1.5 bg-primary text-white text-xs font-semibold rounded-lg"
              >
                Cerrar Modal
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}

// Demo 3.13: Virtualización conceptual de lista
export function VirtualizationDemo() {
  const total = 5000;
  const itemHeight = 36;
  const contenedorHeight = 220;
  const [scrollTop, setScrollTop] = useState(0);

  const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - 2);
  const endIndex = Math.min(total, Math.ceil((scrollTop + contenedorHeight) / itemHeight) + 2);
  const itemsVisibles = [];

  for (let i = startIndex; i < endIndex; i++) {
    itemsVisibles.push(i);
  }

  return (
    <div className="p-4 border rounded-xl bg-card space-y-3">
      <div className="flex items-center justify-between text-xs">
        <span>Elementos totales en memoria: <strong>{total}</strong></span>
        <span className="text-emerald-500 font-mono font-bold">Nodos reales en el DOM: {itemsVisibles.length}</span>
      </div>

      <div
        style={{ height: contenedorHeight, overflowY: 'auto', position: 'relative' }}
        onScroll={e => setScrollTop(e.currentTarget.scrollTop)}
        className="border rounded-lg bg-background"
      >
        <div style={{ height: total * itemHeight, position: 'relative' }}>
          {itemsVisibles.map(index => (
            <div
              key={index}
              style={{
                position: 'absolute',
                top: index * itemHeight,
                height: itemHeight,
                width: '100%'
              }}
              className="px-3 flex items-center border-b border-border/50 text-xs font-mono justify-between"
            >
              <span>Registro #{index + 1} - Usuario Virtualizado</span>
              <span className="text-[10px] text-muted">Posición: {index * itemHeight}px</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Fallback compuesto para otros temas de Nivel 3
export function CustomHooksPlaygroundDemo() {
  const [contador, setContador] = useState(0);
  return (
    <div className="p-4 border rounded-xl bg-card text-xs space-y-2">
      <p className="font-semibold text-primary">Custom Hooks Playground</p>
      <p className="text-muted">Prueba los hooks personalizados integrados en la suite de ejercicios interactivos.</p>
      <button onClick={() => setContador(c => c + 1)} className="px-3 py-1 bg-muted rounded text-xs">
        Contador de prueba: {contador}
      </button>
    </div>
  );
}

export function RouterSimulatorDemo() {
  const [ruta, setRuta] = useState('/inicio');
  return (
    <div className="p-4 border rounded-xl bg-card space-y-3 text-xs">
      <div className="flex gap-2">
        <button onClick={() => setRuta('/inicio')} className={`px-3 py-1 rounded ${ruta === '/inicio' ? 'bg-primary text-white' : 'border'}`}>Inicio</button>
        <button onClick={() => setRuta('/perfil/42')} className={`px-3 py-1 rounded ${ruta === '/perfil/42' ? 'bg-primary text-white' : 'border'}`}>Perfil :id</button>
        <button onClick={() => setRuta('/admin')} className={`px-3 py-1 rounded ${ruta === '/admin' ? 'bg-primary text-white' : 'border'}`}>Ruta Protegida</button>
      </div>
      <div className="p-3 border rounded bg-background font-mono">
        Ruta actual en history: <span className="text-primary font-bold">{ruta}</span>
      </div>
    </div>
  );
}

export function ForwardRefImperativeDemo() {
  const [mensaje, setMensaje] = useState('Listo');
  return (
    <div className="p-4 border rounded-xl bg-card text-xs space-y-3">
      <p>API imperativa expuesta al componente padre con <code>useImperativeHandle</code>:</p>
      <div className="flex gap-2">
        <button onClick={() => setMensaje('Método .enfocar() ejecutado')} className="px-3 py-1 bg-primary text-white rounded">ref.current.enfocar()</button>
        <button onClick={() => setMensaje('Método .limpiar() ejecutado')} className="px-3 py-1 bg-muted rounded">ref.current.limpiar()</button>
      </div>
      <p className="font-mono text-muted">Estado del handler: {mensaje}</p>
    </div>
  );
}

export function CompositionPatternsDemo() {
  const [abierto, setAbierto] = useState<string | null>('item-1');
  return (
    <div className="border rounded-xl divide-y text-xs">
      <div className="p-3">
        <button onClick={() => setAbierto(abierto === 'item-1' ? null : 'item-1')} className="font-semibold w-full text-left flex justify-between">
          Compound Component Item 1 <span>{abierto === 'item-1' ? '▲' : '▼'}</span>
        </button>
        {abierto === 'item-1' && <p className="mt-2 text-muted">Contenido coordinado a través de contexto implícito sin props expuestas.</p>}
      </div>
      <div className="p-3">
        <button onClick={() => setAbierto(abierto === 'item-2' ? null : 'item-2')} className="font-semibold w-full text-left flex justify-between">
          Compound Component Item 2 <span>{abierto === 'item-2' ? '▲' : '▼'}</span>
        </button>
        {abierto === 'item-2' && <p className="mt-2 text-muted">Máxima flexibilidad declarativa para el desarrollador.</p>}
      </div>
    </div>
  );
}
