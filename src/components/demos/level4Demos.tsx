'use client';

import React, { useState, useRef } from 'react';
import { Cpu, Zap, Database, ShieldCheck, Check, Sparkles, AlertCircle } from 'lucide-react';

// Demo 4.1: Redux Simulator
export function ReduxSimulatorDemo() {
  const [estado, setEstado] = useState({ usuarios: ['Juan', 'Lucía'], carga: 'idle' });
  const [historialAcciones, setHistorialAcciones] = useState<string[]>(['@@INIT']);

  const dispatch = (action: { type: string; payload?: any }) => {
    setHistorialAcciones(prev => [`${action.type} (${JSON.stringify(action.payload ?? {})})`, ...prev]);
    if (action.type === 'usuarios/agregar') {
      setEstado(prev => ({ ...prev, usuarios: [...prev.usuarios, action.payload] }));
    } else if (action.type === 'usuarios/limpiar') {
      setEstado(prev => ({ ...prev, usuarios: [] }));
    }
  };

  return (
    <div className="p-4 border rounded-xl bg-card space-y-4 text-xs">
      <div className="flex gap-2">
        <button
          onClick={() => dispatch({ type: 'usuarios/agregar', payload: 'NuevoDev' })}
          className="px-3 py-1.5 bg-purple-600 text-white rounded font-medium"
        >
          dispatch(agregar(&apos;NuevoDev&apos;))
        </button>
        <button
          onClick={() => dispatch({ type: 'usuarios/limpiar' })}
          className="px-3 py-1.5 bg-muted rounded font-medium"
        >
          dispatch(limpiar())
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="p-3 border rounded bg-background">
          <p className="font-semibold text-purple-500 mb-1">Estado Global Redux (Store):</p>
          <pre className="font-mono text-[11px] text-muted">{JSON.stringify(estado, null, 2)}</pre>
        </div>
        <div className="p-3 border rounded bg-background">
          <p className="font-semibold text-muted mb-1">Historial Redux DevTools (Acciones):</p>
          <div className="font-mono text-[11px] space-y-0.5 text-muted max-h-24 overflow-y-auto">
            {historialAcciones.map((a, i) => <p key={i}>{a}</p>)}
          </div>
        </div>
      </div>
    </div>
  );
}

// Demo 4.2: Zustand Store granular selectors
export function ZustandStoreDemo() {
  const [countA, setCountA] = useState(0);
  const [countB, setCountB] = useState(0);

  const rendersSelectorA = useRef(0);
  rendersSelectorA.current += 1;

  const rendersSelectorB = useRef(0);
  rendersSelectorB.current += 1;

  return (
    <div className="p-4 border rounded-xl bg-card space-y-4 text-xs">
      <div className="flex gap-2">
        <button onClick={() => setCountA(c => c + 1)} className="px-3 py-1.5 bg-primary text-white rounded">
          Mutar Campo A ({countA})
        </button>
        <button onClick={() => setCountB(c => c + 1)} className="px-3 py-1.5 bg-emerald-600 text-white rounded">
          Mutar Campo B ({countB})
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="p-3 border rounded bg-background">
          <p className="font-semibold text-primary">Selector A: s =&gt; s.campoA</p>
          <p className="font-mono text-sm mt-1">Valor: {countA}</p>
          <p className="text-[10px] text-muted mt-2">Solo re-renderiza cuando A muta. Renders: {rendersSelectorA.current}</p>
        </div>
        <div className="p-3 border rounded bg-background">
          <p className="font-semibold text-emerald-500">Selector B: s =&gt; s.campoB</p>
          <p className="font-mono text-sm mt-1">Valor: {countB}</p>
          <p className="text-[10px] text-muted mt-2">Solo re-renderiza cuando B muta. Renders: {rendersSelectorB.current}</p>
        </div>
      </div>
    </div>
  );
}

// Demo 4.3: TanStack Query (Caché y staleTime)
export function TanStackQueryDemo() {
  const [estadoCache, setEstadoCache] = useState<'fresh' | 'stale' | 'fetching'>('fresh');
  const [contadorRefetch, setContadorRefetch] = useState(1);

  const invalidarCache = () => {
    setEstadoCache('fetching');
    setTimeout(() => {
      setContadorRefetch(c => c + 1);
      setEstadoCache('fresh');
      setTimeout(() => setEstadoCache('stale'), 3000);
    }, 600);
  };

  return (
    <div className="p-4 border rounded-xl bg-card space-y-3 text-xs">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Database className="w-4 h-4 text-primary" />
          <span className="font-semibold">QueryKey: [&apos;usuarios&apos;]</span>
        </div>
        <span className={`px-2 py-0.5 rounded font-mono uppercase text-[10px] ${
          estadoCache === 'fresh' ? 'bg-emerald-500/20 text-emerald-600' :
          estadoCache === 'stale' ? 'bg-amber-500/20 text-amber-600' : 'bg-blue-500/20 text-blue-600'
        }`}>
          Estado: {estadoCache}
        </span>
      </div>

      <p className="text-muted">
        Datos en caché: <strong>Versión #{contadorRefetch} de usuarios</strong>. (staleTime: 3s).
      </p>

      <button onClick={invalidarCache} className="px-3 py-1.5 bg-primary text-white rounded text-xs font-semibold">
        qc.invalidateQueries({`{ queryKey: ['usuarios'] }`})
      </button>
    </div>
  );
}

// Demo 4.4: React Hook Form + Zod
export function HookFormZodDemo() {
  const [email, setEmail] = useState('');
  const [edad, setEdad] = useState('25');
  const [errorZod, setErrorZod] = useState<string | null>(null);
  const [valido, setValido] = useState(false);

  const validar = (e: string, ed: string) => {
    if (!e.includes('@') || !e.includes('.')) {
      setErrorZod('Zod: Formato de correo inválido');
      setValido(false);
    } else if (Number(ed) < 18) {
      setErrorZod('Zod: Debes ser mayor de 18 años');
      setValido(false);
    } else {
      setErrorZod(null);
      setValido(true);
    }
  };

  return (
    <div className="p-4 border rounded-xl bg-card space-y-3 text-xs">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="text-muted block mb-1">Email</label>
          <input
            value={email}
            onChange={ev => { setEmail(ev.target.value); validar(ev.target.value, edad); }}
            placeholder="usuario@dominio.com"
            className="w-full px-3 py-1.5 border rounded bg-background"
          />
        </div>
        <div>
          <label className="text-muted block mb-1">Edad</label>
          <input
            type="number"
            value={edad}
            onChange={ev => { setEdad(ev.target.value); validar(email, ev.target.value); }}
            className="w-full px-3 py-1.5 border rounded bg-background"
          />
        </div>
      </div>

      {errorZod && <p className="text-red-500 text-xs font-medium">{errorZod}</p>}
      {valido && <p className="text-emerald-500 text-xs font-medium flex items-center gap-1"><Check className="w-3.5 h-3.5" /> Esquema Zod validado correctamente.</p>}
    </div>
  );
}

// Demo 4.6: TypeScript uniones discriminadas
export function TypeScriptReactDemo() {
  const [estado, setEstado] = useState<'loading' | 'success' | 'error'>('success');

  return (
    <div className="p-4 border rounded-xl bg-card text-xs space-y-3">
      <div className="flex gap-2">
        <button onClick={() => setEstado('loading')} className="px-2.5 py-1 border rounded">Status: &apos;loading&apos;</button>
        <button onClick={() => setEstado('success')} className="px-2.5 py-1 border rounded">Status: &apos;success&apos;</button>
        <button onClick={() => setEstado('error')} className="px-2.5 py-1 border rounded">Status: &apos;error&apos;</button>
      </div>

      <div className="p-3 border rounded bg-background font-mono">
        {estado === 'loading' && <p className="text-blue-500">⏳ Cargando datos tipados...</p>}
        {estado === 'success' && <p className="text-emerald-500">✅ Data: {`{ user: "Andrés", id: "usr_10" }`}</p>}
        {estado === 'error' && <p className="text-red-500">❌ Error: &quot;Fallo en el servicio&quot;</p>}
      </div>
    </div>
  );
}

// Fallbacks para Nivel 4
export function UiLibrariesDemo() {
  return (
    <div className="p-4 border rounded-xl bg-card text-xs space-y-2">
      <p className="font-semibold">Criterios de Selección de UI</p>
      <p className="text-muted">Shadcn UI (copiar código a tu repo con Radix + Tailwind) domina el ecosistema por accesibilidad y compatibilidad con RSC.</p>
    </div>
  );
}

export function TestingStrategyDemo() {
  return (
    <div className="p-4 border rounded-xl bg-card text-xs space-y-2">
      <p className="font-semibold text-emerald-500">Testing Library Query Hierarchy</p>
      <p className="font-mono text-muted">1. getByRole &gt; 2. getByLabelText &gt; 3. getByText &gt; 4. getByTestId</p>
    </div>
  );
}

export function AccessibilityAuditDemo() {
  const [notificacion, setNotificacion] = useState('');
  return (
    <div className="p-4 border rounded-xl bg-card text-xs space-y-3">
      <button
        onClick={() => setNotificacion('Nuevo mensaje recibido')}
        className="px-3 py-1.5 bg-primary text-white rounded font-medium"
      >
        Disparar Anuncio aria-live
      </button>
      <div role="status" aria-live="polite" className="p-3 border rounded bg-background font-medium">
        {notificacion || 'Región aria-live="polite" a la escucha...'}
      </div>
    </div>
  );
}

export function I18nLocalizationDemo() {
  const [idioma, setIdioma] = useState<'es-ES' | 'en-US'>('es-ES');
  const precio = 1250.5;
  const fecha = new Date();

  return (
    <div className="p-4 border rounded-xl bg-card text-xs space-y-3">
      <div className="flex gap-2">
        <button onClick={() => setIdioma('es-ES')} className={`px-3 py-1 rounded ${idioma === 'es-ES' ? 'bg-primary text-white' : 'border'}`}>Español (es-ES)</button>
        <button onClick={() => setIdioma('en-US')} className={`px-3 py-1 rounded ${idioma === 'en-US' ? 'bg-primary text-white' : 'border'}`}>English (en-US)</button>
      </div>
      <div className="p-3 border rounded bg-background font-mono space-y-1">
        <p>Moneda Intl: <strong>{new Intl.NumberFormat(idioma, { style: 'currency', currency: idioma === 'es-ES' ? 'EUR' : 'USD' }).format(precio)}</strong></p>
        <p>Fecha Intl: <strong>{new Intl.DateTimeFormat(idioma, { dateStyle: 'full' }).format(fecha)}</strong></p>
      </div>
    </div>
  );
}
