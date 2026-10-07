'use client';

import React, { useState, useEffect, useRef } from 'react';
import { AlertCircle, Check, Play, RefreshCw, Eye, EyeOff, Layers, Timer } from 'lucide-react';

// Demo 2.1: useState asincronía y actualización funcional
export function UseStateAsyncDemo() {
  const [cuenta, setCuenta] = useState(0);
  const [logs, setLogs] = useState<string[]>([]);

  const handleLecturaInmediata = () => {
    // ❌ Error común: setCount(count + 1) tres veces
    setCuenta(cuenta + 1);
    setCuenta(cuenta + 1);
    setCuenta(cuenta + 1);
    setLogs(prev => [
      `[Lectura Inmediata]: Llamaste a setCuenta(cuenta + 1) 3 veces consecutivas. En las 3 líneas, cuenta valía ${cuenta}. Resultado final: suma solo +1.`,
      ...prev.slice(0, 3)
    ]);
  };

  const handleActualizacionFuncional = () => {
    // ✅ Forma funcional segura
    setCuenta(prev => prev + 1);
    setCuenta(prev => prev + 1);
    setCuenta(prev => prev + 1);
    setLogs(prev => [
      `[Actualización Funcional]: Llamaste a setCuenta(prev => prev + 1) 3 veces. Cada llamada tomó el valor pendiente más reciente. Resultado: suma exactamente +3.`,
      ...prev.slice(0, 3)
    ]);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4 p-4 border rounded-xl bg-card">
        <div className="text-center px-4 py-2 bg-primary/10 border border-primary/20 rounded-xl">
          <span className="text-xs text-muted block uppercase">Valor actual</span>
          <span className="text-3xl font-extrabold text-primary font-mono">{cuenta}</span>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={handleLecturaInmediata}
            className="px-3.5 py-2 bg-red-600/90 hover:bg-red-700 text-white text-xs font-semibold rounded-lg transition-colors"
          >
            ❌ setCount(cuenta + 1) x3 (Suma +1)
          </button>
          <button
            onClick={handleActualizacionFuncional}
            className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg transition-colors"
          >
            ✅ setCount(prev =&gt; prev + 1) x3 (Suma +3)
          </button>
          <button
            onClick={() => { setCuenta(0); setLogs([]); }}
            className="px-3 py-2 border rounded-lg text-xs hover:bg-muted"
          >
            Reset
          </button>
        </div>
      </div>

      <div className="p-3 border rounded-xl bg-muted/20 font-mono text-xs space-y-1">
        <p className="font-semibold text-muted text-[11px] uppercase">Registro de ejecución:</p>
        {logs.length === 0 ? (
          <p className="text-muted italic">Haz clic en los botones para observar la diferencia en tiempo real.</p>
        ) : (
          logs.map((l, i) => <p key={i} className="text-foreground/90">{l}</p>)
        )}
      </div>
    </div>
  );
}

// Demo 2.2: useEffect ciclo de vida y cleanup
export function UseEffectLifecycleDemo() {
  const [activo, setActivo] = useState(false);
  const [segundos, setSegundos] = useState(0);
  const [limpiezasEjecutadas, setLimpiezasEjecutadas] = useState(0);

  useEffect(() => {
    if (!activo) return;

    // Inicia el intervalo
    const timerId = setInterval(() => {
      setSegundos(s => s + 1);
    }, 1000);

    // Función de limpieza (Cleanup)
    return () => {
      clearInterval(timerId);
      setLimpiezasEjecutadas(prev => prev + 1);
    };
  }, [activo]);

  return (
    <div className="space-y-4">
      <div className="p-4 border rounded-xl bg-card flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Timer className="w-5 h-5 text-primary" />
          <div>
            <p className="font-semibold text-sm">Estado del Efecto: {activo ? 'Suscripción Activa' : 'Detenido'}</p>
            <p className="text-xs text-muted">Contador: <strong className="font-mono text-primary">{segundos}s</strong></p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActivo(!activo)}
            className={`px-4 py-2 rounded-lg text-xs font-semibold text-white transition-colors ${
              activo ? 'bg-amber-600 hover:bg-amber-700' : 'bg-primary hover:bg-primary/90'
            }`}
          >
            {activo ? 'Pausar (Ejecuta Cleanup)' : 'Iniciar Suscripción'}
          </button>
          <button
            onClick={() => { setActivo(false); setSegundos(0); setLimpiezasEjecutadas(0); }}
            className="px-3 py-2 border rounded-lg text-xs hover:bg-muted"
          >
            Reset
          </button>
        </div>
      </div>

      <div className="p-3 bg-muted/30 border rounded-xl text-xs space-y-1">
        <p><strong>Funciones de Limpieza (Cleanup) invocadas:</strong> <span className="font-mono font-bold text-amber-500">{limpiezasEjecutadas}</span></p>
        <p className="text-muted text-[11px]">
          Al pulsar &quot;Pausar&quot; o cambiar de pestaña, React ejecuta la función de retorno \`clearInterval(timerId)\` para garantizar que no quede ningún proceso huérfano consumiendo memoria.
        </p>
      </div>
    </div>
  );
}

// Demo 2.3: Controlado vs No Controlado
export function ControlledVsUncontrolledDemo() {
  const [valorControlado, setValorControlado] = useState('');
  const [rendersControlado, setRendersControlado] = useState(0);

  const inputNoControladoRef = useRef<HTMLInputElement>(null);
  const [valorEnviadoNoControlado, setValorEnviadoNoControlado] = useState<string | null>(null);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Controlado */}
      <div className="p-4 border border-blue-500/30 rounded-xl bg-blue-500/5 space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="font-semibold text-xs text-blue-600 dark:text-blue-400">1. Input Controlado (React State)</h4>
          <span className="text-[10px] font-mono bg-blue-500/20 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded">
            Rerenders: {rendersControlado}
          </span>
        </div>
        <input
          value={valorControlado}
          onChange={e => {
            setValorControlado(e.target.value);
            setRendersControlado(r => r + 1);
          }}
          placeholder="Escribe cada letra..."
          className="w-full px-3 py-2 border rounded-lg bg-card text-foreground text-xs"
        />
        <div className="text-xs space-y-1">
          <p>Longitud en vivo: <strong>{valorControlado.length}</strong> caracteres</p>
          <p className="text-muted text-[11px]">Re-renderiza el componente con cada pulsación de tecla.</p>
        </div>
      </div>

      {/* No Controlado */}
      <div className="p-4 border border-purple-500/30 rounded-xl bg-purple-500/5 space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="font-semibold text-xs text-purple-600 dark:text-purple-400">2. Input No Controlado (DOM Ref)</h4>
          <span className="text-[10px] font-mono bg-purple-500/20 text-purple-700 dark:text-purple-300 px-2 py-0.5 rounded">
            Cero re-renders al teclear
          </span>
        </div>
        <div className="flex gap-2">
          <input
            ref={inputNoControladoRef}
            defaultValue=""
            placeholder="El DOM retiene el valor..."
            className="flex-1 px-3 py-2 border rounded-lg bg-card text-foreground text-xs"
          />
          <button
            onClick={() => setValorEnviadoNoControlado(inputNoControladoRef.current?.value ?? '')}
            className="px-3 py-1.5 bg-purple-600 text-white rounded-lg text-xs font-medium hover:bg-purple-700"
          >
            Leer Ref
          </button>
        </div>
        <div className="text-xs space-y-1">
          <p>Valor leído bajo demanda: <strong>{valorEnviadoNoControlado ?? '(Presiona Leer Ref)'}</strong></p>
          <p className="text-muted text-[11px]">React no interviene mientras el usuario escribe.</p>
        </div>
      </div>
    </div>
  );
}

// Demo 2.4: Formulario y validación
export function FormValidationDemo() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [errores, setErrores] = useState<{ email?: string; password?: string }>({});
  const [enviadoExitoso, setEnviadoExitoso] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    // Validación inmediata en vivo
    if (name === 'email') {
      setErrores(errs => ({
        ...errs,
        email: !value.includes('@') ? 'El email debe contener un @' : undefined
      }));
    }
    if (name === 'password') {
      setErrores(errs => ({
        ...errs,
        password: value.length < 6 ? 'Mínimo 6 caracteres' : undefined
      }));
    }
    setEnviadoExitoso(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.email.includes('@') || form.password.length < 6) {
      setErrores({
        email: !form.email.includes('@') ? 'Email inválido' : undefined,
        password: form.password.length < 6 ? 'Contraseña demasiado corta' : undefined
      });
      return;
    }
    setErrores({});
    setEnviadoExitoso(true);
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 border rounded-xl bg-card space-y-3">
      <div>
        <label className="text-xs font-medium text-muted block mb-1">Correo Electrónico</label>
        <input
          name="email"
          value={form.email}
          onChange={handleChange}
          placeholder="ejemplo@correo.com"
          className={`w-full px-3 py-2 border rounded-lg bg-background text-foreground text-xs ${
            errores.email ? 'border-red-500 focus:ring-red-500' : ''
          }`}
        />
        {errores.email && <p className="text-red-500 text-[11px] mt-1">{errores.email}</p>}
      </div>

      <div>
        <label className="text-xs font-medium text-muted block mb-1">Contraseña</label>
        <input
          type="password"
          name="password"
          value={form.password}
          onChange={handleChange}
          placeholder="Mínimo 6 caracteres"
          className={`w-full px-3 py-2 border rounded-lg bg-background text-foreground text-xs ${
            errores.password ? 'border-red-500 focus:ring-red-500' : ''
          }`}
        />
        {errores.password && <p className="text-red-500 text-[11px] mt-1">{errores.password}</p>}
      </div>

      <button type="submit" className="w-full py-2 bg-primary text-white text-xs font-semibold rounded-lg hover:bg-primary/90">
        Validar y Enviar
      </button>

      {enviadoExitoso && (
        <div className="p-2.5 bg-emerald-500/15 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 rounded-lg text-xs font-medium flex items-center gap-2">
          <Check className="w-4 h-4" /> Formulario validado y enviado correctamente.
        </div>
      )}
    </form>
  );
}

// Demo 2.5: Lifting state up (Celsius y Fahrenheit)
export function LiftingStateDemo() {
  const [celsius, setCelsius] = useState(25);

  const fahrenheit = (celsius * 9) / 5 + 32;

  const handleFahrenheitChange = (f: number) => {
    setCelsius(((f - 32) * 5) / 9);
  };

  return (
    <div className="p-4 border rounded-xl bg-card space-y-4">
      <div className="text-xs text-muted">
        El componente padre posee el estado único \`celsius\`. El valor \`fahrenheit\` es un valor derivado matemáticamente, asegurando que ambos hermanos permanezcan en sincronía perfecta.
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="p-3 border rounded-lg bg-background">
          <label className="text-xs font-semibold block mb-1">Temperatura en Celsius (°C)</label>
          <input
            type="number"
            value={Math.round(celsius * 10) / 10}
            onChange={e => setCelsius(Number(e.target.value))}
            className="w-full px-3 py-2 border rounded bg-card text-foreground font-mono text-sm"
          />
        </div>
        <div className="p-3 border rounded-lg bg-background">
          <label className="text-xs font-semibold block mb-1">Temperatura en Fahrenheit (°F)</label>
          <input
            type="number"
            value={Math.round(fahrenheit * 10) / 10}
            onChange={e => handleFahrenheitChange(Number(e.target.value))}
            className="w-full px-3 py-2 border rounded bg-card text-foreground font-mono text-sm"
          />
        </div>
      </div>
    </div>
  );
}

// Demo 2.6: Composición vs Herencia
export function CompositionVsInheritanceDemo() {
  const [variante, setVariante] = useState<'info' | 'alerta'>('info');

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <button
          onClick={() => setVariante('info')}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium ${variante === 'info' ? 'bg-primary text-white' : 'border'}`}
        >
          Variante Informativa
        </button>
        <button
          onClick={() => setVariante('alerta')}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium ${variante === 'alerta' ? 'bg-amber-600 text-white' : 'border'}`}
        >
          Variante Alerta
        </button>
      </div>

      {/* Contenedor compuesto con slots */}
      <div className={`p-4 border rounded-xl ${variante === 'info' ? 'bg-blue-500/5 border-blue-500/30' : 'bg-amber-500/5 border-amber-500/30'}`}>
        <div className="flex items-center justify-between pb-2 border-b border-border/50">
          <h4 className="font-semibold text-sm">
            {variante === 'info' ? 'ℹ️ Tarjeta de Información' : '⚠️ Aviso Importante'}
          </h4>
          <span className="text-[10px] bg-muted px-2 py-0.5 rounded font-mono">Ranura Header</span>
        </div>
        <div className="py-3 text-xs text-muted">
          Este contenido se inyecta dinámicamente como <code>children</code> sin necesidad de heredar clases de componentes base rígidos.
        </div>
        <div className="pt-2 border-t border-border/50 flex justify-end">
          <button className="px-3 py-1 text-xs font-medium bg-foreground text-background rounded-md">
            Acción de Ranura Footer
          </button>
        </div>
      </div>
    </div>
  );
}

// Demo 2.7: useRef acceso al DOM y contador de renders
export function UseRefDomAndStateDemo() {
  const inputRef = useRef<HTMLInputElement>(null);
  const contadorRenders = useRef(0);
  const [, setFuerzaRender] = useState(0);

  // Incrementamos la ref en cada pasada de render
  contadorRenders.current += 1;

  const enfocarYSeleccionar = () => {
    inputRef.current?.focus();
    inputRef.current?.select();
  };

  return (
    <div className="p-4 border rounded-xl bg-card space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-xs text-muted">
          Renders acumulados en este componente: <strong className="font-mono text-primary">{contadorRenders.current}</strong>
        </p>
        <button
          onClick={() => setFuerzaRender(f => f + 1)}
          className="px-3 py-1 bg-muted hover:bg-muted/80 text-xs font-medium rounded-lg flex items-center gap-1"
        >
          <RefreshCw className="w-3.5 h-3.5" /> Forzar Re-render
        </button>
      </div>

      <div className="flex gap-2">
        <input
          ref={inputRef}
          defaultValue="Texto enfocado vía useRef imperativo"
          className="flex-1 px-3 py-2 border rounded-lg bg-background text-foreground text-xs font-mono"
        />
        <button
          onClick={enfocarYSeleccionar}
          className="px-4 py-2 bg-primary text-white text-xs font-semibold rounded-lg hover:bg-primary/90"
        >
          Poner Foco con Ref
        </button>
      </div>
      <p className="text-[11px] text-muted">
        Nota: Modificar <code>contadorRenders.current += 1</code> persiste el valor a través de renders sin desencadenar renders infinitos.
      </p>
    </div>
  );
}

// Demo 2.8: Reglas de los hooks y lista enlazada interna
export function HooksRulesAndLinkedListDemo() {
  const [paso, setPaso] = useState(0);

  const hooksEnlazados = [
    { indice: 0, tipo: 'useState(cuenta)', valor: '0', siguiente: 'Hook 1' },
    { indice: 1, tipo: 'useEffect(timer)', valor: 'fn cleanup', siguiente: 'Hook 2' },
    { indice: 2, tipo: 'useRef(inputRef)', valor: '{ current: HTMLInputElement }', siguiente: 'null (Fin)' }
  ];

  return (
    <div className="p-4 border rounded-xl bg-card space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="font-semibold text-xs flex items-center gap-1.5">
          <Layers className="w-4 h-4 text-primary" /> Visualizador de la Lista Enlazada de Hooks (Fiber.memoizedState)
        </h4>
        <button
          onClick={() => setPaso(p => (p + 1) % 3)}
          className="px-3 py-1 bg-primary text-white text-xs rounded-md"
        >
          Avanzar Cursor ({paso})
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {hooksEnlazados.map((h, i) => (
          <div
            key={i}
            className={`p-3 border rounded-xl transition-all ${
              paso === i ? 'border-primary ring-2 ring-primary/20 bg-primary/5' : 'bg-background'
            }`}
          >
            <div className="flex items-center justify-between text-xs font-mono mb-1">
              <span className="font-bold text-primary">Slot #{h.indice}</span>
              {paso === i && <span className="bg-primary text-white text-[10px] px-1.5 py-0.2 rounded">Cursor activo</span>}
            </div>
            <p className="text-xs font-semibold">{h.tipo}</p>
            <p className="text-[11px] text-muted font-mono mt-1">Valor: {h.valor}</p>
            <p className="text-[10px] text-muted mt-2 border-t pt-1">Siguiente: {h.siguiente}</p>
          </div>
        ))}
      </div>

      <div className="p-2.5 bg-amber-500/10 border border-amber-500/20 rounded-lg text-xs text-amber-800 dark:text-amber-200">
        Si un hook se colocara dentro de un <code>if (condicion)</code>, en el render donde la condición fuera falsa el slot se omitiría y el cursor leería el dato del hook contiguo, rompiendo la aplicación por completo.
      </div>
    </div>
  );
}
