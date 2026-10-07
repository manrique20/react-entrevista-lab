'use client';

import React, { useState, useTransition, useId, useSyncExternalStore, useOptimistic, useRef, useMemo } from 'react';
import { Sparkles, Zap, Server, Globe, CheckCircle2, ArrowRight } from 'lucide-react';

// Demo 6.2: Automatic Batching
export function AutomaticBatchingDemo() {
  const [cuenta, setCuenta] = useState(0);
  const [activo, setActivo] = useState(false);
  const renders = useRef(0);
  renders.current += 1;

  const handleClickTimeout = () => {
    setTimeout(() => {
      // React 18/19 agrupa ambos setters en UN SOLO re-render:
      setCuenta(c => c + 1);
      setActivo(a => !a);
    }, 100);
  };

  return (
    <div className="p-4 border rounded-xl bg-card text-xs space-y-3">
      <div className="flex items-center justify-between">
        <button onClick={handleClickTimeout} className="px-3 py-1.5 bg-primary text-white rounded font-medium">
          Llamar 2 setState dentro de setTimeout
        </button>
        <span className="font-mono text-primary font-bold">Renders: {renders.current}</span>
      </div>
      <p className="text-muted font-mono">
        Cuenta: {cuenta} | Activo: {activo ? 'true' : 'false'} (Ambas variables se actualizaron en un único ciclo de renderizado).
      </p>
    </div>
  );
}

// Demo 6.3: useTransition con filtrado masivo
export function UseTransitionDemo() {
  const [busqueda, setBusqueda] = useState('');
  const [filtrados, setFiltrados] = useState<string[]>([]);
  const [isPending, startTransition] = useTransition();

  const datosGrandes = useMemo(() => {
    return Array.from({ length: 5000 }, (_, i) => `Registro #${i + 1} - Entidad Concurrente`);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const q = e.target.value;
    setBusqueda(q); // Urgente: el teclado responde de inmediato

    startTransition(() => {
      // No urgente: se puede interrumpir si el usuario teclea de nuevo
      const res = datosGrandes.filter((d: string) => d.toLowerCase().includes(q.toLowerCase()));
      setFiltrados(res.slice(0, 50));
    });
  };

  return (
    <div className="p-4 border rounded-xl bg-card text-xs space-y-3">
      <div className="flex gap-2 items-center">
        <input
          value={busqueda}
          onChange={handleChange}
          placeholder="Escribe para filtrar 5,000 registros..."
          className="flex-1 px-3 py-1.5 border rounded bg-background"
        />
        {isPending && <span className="text-cyan-500 font-bold animate-pulse">isPending...</span>}
      </div>

      <div className={`max-h-36 overflow-y-auto border rounded p-2 bg-background font-mono text-[11px] ${isPending ? 'opacity-50' : ''}`}>
        {filtrados.length === 0 ? (
          <p className="text-muted">Escribe un término (ej: &quot;10&quot; o &quot;Entidad&quot;)...</p>
        ) : (
          filtrados.map((it, i) => <p key={i}>{it}</p>)
        )}
      </div>
    </div>
  );
}

// Demo 6.4: useId y useSyncExternalStore
export function UseIdAndExternalStoreDemo() {
  const idA = useId();
  const idB = useId();

  const isOnline = useSyncExternalStore(
    cb => {
      window.addEventListener('online', cb);
      window.addEventListener('offline', cb);
      return () => {
        window.removeEventListener('online', cb);
        window.removeEventListener('offline', cb);
      };
    },
    () => navigator.onLine,
    () => true
  );

  return (
    <div className="p-4 border rounded-xl bg-card text-xs space-y-3">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="p-2 border rounded bg-background">
          <label htmlFor={idA} className="font-semibold block mb-1">useId() Generado A:</label>
          <input id={idA} defaultValue={idA} className="w-full px-2 py-1 border rounded font-mono text-[11px]" readOnly />
        </div>
        <div className="p-2 border rounded bg-background">
          <label htmlFor={idB} className="font-semibold block mb-1">useId() Generado B:</label>
          <input id={idB} defaultValue={idB} className="w-full px-2 py-1 border rounded font-mono text-[11px]" readOnly />
        </div>
      </div>
      <p className="flex items-center gap-2 font-medium">
        <Globe className="w-4 h-4 text-primary" /> useSyncExternalStore (Estado de Red):
        <strong className={isOnline ? 'text-emerald-500' : 'text-red-500'}>{isOnline ? 'Online (Conectado)' : 'Offline (Sin red)'}</strong>
      </p>
    </div>
  );
}

// Demo 6.9: Hooks de React 19 (useOptimistic)
export function React19HooksDemo() {
  const [mensajesReales, setMensajesReales] = useState(['Hola', 'Bienvenido a React 19']);
  const [optimisticMensajes, setOptimistic] = useOptimistic(
    mensajesReales,
    (actuales, nuevo: string) => [...actuales, `${nuevo} (enviando optimista...)`]
  );
  const [texto, setTexto] = useState('');
  const [enviando, setEnviando] = useState(false);

  const enviarMensaje = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!texto.trim()) return;
    const msg = texto.trim();
    setTexto('');
    setEnviando(true);

    // 1. UI se actualiza instantáneamente con useOptimistic:
    setOptimistic(msg);

    // 2. Simulación de respuesta del servidor (1 segundo de red):
    setTimeout(() => {
      setMensajesReales(prev => [...prev, msg]);
      setEnviando(false);
    }, 1000);
  };

  return (
    <div className="p-4 border rounded-xl bg-card text-xs space-y-3">
      <p className="font-semibold text-cyan-600 dark:text-cyan-400">useOptimistic en React 19</p>
      <ul className="space-y-1 font-mono">
        {optimisticMensajes.map((m, i) => (
          <li key={i} className="p-1.5 border rounded bg-background">{m}</li>
        ))}
      </ul>
      <form onSubmit={enviarMensaje} className="flex gap-2">
        <input
          value={texto}
          onChange={e => setTexto(e.target.value)}
          placeholder="Escribe un mensaje..."
          className="flex-1 px-3 py-1.5 border rounded bg-background"
        />
        <button type="submit" disabled={enviando} className="px-3 py-1.5 bg-primary text-white rounded font-medium disabled:opacity-50">
          Enviar
        </button>
      </form>
    </div>
  );
}

// Demo 6.10: ref como prop en React 19
export function React19RefPropDemo() {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="p-4 border rounded-xl bg-card text-xs space-y-3">
      <p className="text-muted">
        En React 19 pasamos <code>ref</code> directamente como prop sin usar <code>forwardRef</code>.
      </p>
      <div className="flex gap-2">
        <CampoReact19 ref={inputRef} placeholder="Input hijo con ref directa" />
        <button
          onClick={() => inputRef.current?.focus()}
          className="px-3 py-1.5 bg-primary text-white rounded font-medium"
        >
          Enfocar con ref prop
        </button>
      </div>
    </div>
  );
}

function CampoReact19({ ref, ...props }: { ref?: React.Ref<HTMLInputElement> } & React.InputHTMLAttributes<HTMLInputElement>) {
  return <input ref={ref} {...props} className="flex-1 px-3 py-1.5 border rounded bg-background" />;
}

// Fallbacks para Nivel 6
export function ConcurrentRenderingDemo() {
  return (
    <div className="p-4 border rounded-xl bg-card text-xs space-y-2">
      <p className="font-semibold text-cyan-500">Renderizado Concurrente</p>
      <p className="text-muted">React 18 interrumpe cálculos no urgentes para priorizar el pintado de teclas y clics.</p>
    </div>
  );
}

export function SuspenseDataDemo() {
  return (
    <div className="p-4 border rounded-xl bg-card text-xs space-y-2">
      <p className="font-semibold text-cyan-500">Suspense para Datos</p>
      <p className="text-muted">Coordina estados de carga de forma declarativa con la API nativa de &lt;Suspense fallback&gt;.</p>
    </div>
  );
}

export function StreamingSsrDemo() {
  return (
    <div className="p-4 border rounded-xl bg-card text-xs space-y-2">
      <p className="font-semibold text-cyan-500">Streaming SSR</p>
      <p className="text-muted">Transmite HTML por trozos (chunks) con HTTP/2, reduciendo el TTFB a milisegundos.</p>
    </div>
  );
}

export function RscBoundariesDemo() {
  return (
    <div className="p-4 border rounded-xl bg-card text-xs space-y-2">
      <p className="font-semibold text-cyan-500">Fronteras RSC y &quot;use client&quot;</p>
      <p className="text-muted">Server Components corren en el servidor con 0KB de JS. Client Components manejan eventos interactivos.</p>
    </div>
  );
}

export function ServerActionsDemo() {
  return (
    <div className="p-4 border rounded-xl bg-card text-xs space-y-2">
      <p className="font-semibold text-cyan-500">Server Actions (&apos;use server&apos;)</p>
      <p className="text-muted">Mutaciones directas en el servidor desde formularios con revalidatePath automático.</p>
    </div>
  );
}

export function ReactCompilerDemo() {
  return (
    <div className="p-4 border rounded-xl bg-card text-xs space-y-2">
      <p className="font-semibold text-cyan-500">React Compiler</p>
      <p className="text-muted">Inserta memoización automática en build time si el código respeta las reglas de pureza de React.</p>
    </div>
  );
}

export function StrictModeDemo() {
  return (
    <div className="p-4 border rounded-xl bg-card text-xs space-y-2">
      <p className="font-semibold text-cyan-500">Strict Mode (Doble Montaje)</p>
      <p className="text-muted">Remonta componentes en desarrollo para destapar fugas de memoria y efectos sin cleanup.</p>
    </div>
  );
}
