'use client';

import React, { useState, useEffect } from 'react';
import { Play, RotateCcw, Copy, Check, Terminal, AlertCircle } from 'lucide-react';

interface LogEntry {
  type: 'log' | 'error' | 'warn' | 'info';
  content: string;
  timestamp: string;
}

interface JsConsoleRunnerProps {
  initialCode: string;
  title?: string;
  autoRun?: boolean;
}

export function JsConsoleRunner({ initialCode, title = 'Consola en Vivo', autoRun = false }: JsConsoleRunnerProps) {
  const [code, setCode] = useState(initialCode);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [hasCopied, setHasCopied] = useState(false);

  useEffect(() => {
    setCode(initialCode);
    setLogs([]);
    if (autoRun) {
      runCode(initialCode);
    }
  }, [initialCode, autoRun]);

  const runCode = (codeToRun: string = code) => {
    setIsRunning(true);
    const newLogs: LogEntry[] = [];
    const now = () => new Date().toLocaleTimeString('es-ES', { minute: '2-digit', second: '2-digit', fractionalSecondDigits: 3 });

    const originalConsole = {
      log: console.log,
      error: console.error,
      warn: console.warn,
      info: console.info,
      assert: console.assert
    };

    const formatArg = (arg: unknown): string => {
      if (arg === undefined) return 'undefined';
      if (arg === null) return 'null';
      if (typeof arg === 'function') return arg.toString();
      if (typeof arg === 'object') {
        try {
          return JSON.stringify(arg, null, 2);
        } catch {
          return Object.prototype.toString.call(arg);
        }
      }
      return String(arg);
    };

    // Override console
    console.log = (...args: unknown[]) => {
      newLogs.push({
        type: 'log',
        content: args.map(formatArg).join(' '),
        timestamp: now()
      });
      originalConsole.log(...args);
    };

    console.error = (...args: unknown[]) => {
      newLogs.push({
        type: 'error',
        content: args.map(formatArg).join(' '),
        timestamp: now()
      });
      originalConsole.error(...args);
    };

    console.warn = (...args: unknown[]) => {
      newLogs.push({
        type: 'warn',
        content: args.map(formatArg).join(' '),
        timestamp: now()
      });
      originalConsole.warn(...args);
    };

    console.assert = (condition?: boolean, ...args: unknown[]) => {
      if (!condition) {
        newLogs.push({
          type: 'error',
          content: 'Assertion failed: ' + args.map(formatArg).join(' '),
          timestamp: now()
        });
      }
      originalConsole.assert(condition, ...args);
    };

    try {
      // Execute in isolated function context
      const runner = new Function(codeToRun);
      const result = runner();
      if (result !== undefined && typeof result?.then !== 'function') {
        newLogs.push({
          type: 'info',
          content: '=> ' + formatArg(result),
          timestamp: now()
        });
      } else if (result && typeof result.then === 'function') {
        result
          .then((res: unknown) => {
            if (res !== undefined) {
              setLogs(prev => [
                ...prev,
                { type: 'info', content: '=> Promesa resuelta: ' + formatArg(res), timestamp: now() }
              ]);
            }
          })
          .catch((err: unknown) => {
            setLogs(prev => [
              ...prev,
              { type: 'error', content: 'Promesa rechazada: ' + String(err), timestamp: now() }
            ]);
          });
      }
    } catch (err: unknown) {
      newLogs.push({
        type: 'error',
        content: (err instanceof Error) ? `${err.name}: ${err.message}` : String(err),
        timestamp: now()
      });
    } finally {
      // Restore console
      console.log = originalConsole.log;
      console.error = originalConsole.error;
      console.warn = originalConsole.warn;
      console.info = originalConsole.info;
      console.assert = originalConsole.assert;
      setLogs([...newLogs]);
      setIsRunning(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setHasCopied(true);
    setTimeout(() => setHasCopied(false), 2000);
  };

  return (
    <div className="rounded-xl border border-border/80 bg-slate-950 text-slate-100 overflow-hidden shadow-lg font-mono text-xs">
      {/* Barra superior con controles */}
      <div className="flex items-center justify-between px-3.5 py-2.5 bg-slate-900 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 mr-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
            <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
          </div>
          <Terminal className="w-3.5 h-3.5 text-amber-400" />
          <span className="font-semibold text-slate-300 text-[11px]">{title}</span>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={handleCopy}
            className="flex items-center gap-1 px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
            title="Copiar código"
          >
            {hasCopied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
            <span className="text-[10px]">{hasCopied ? 'Copiado' : 'Copiar'}</span>
          </button>

          <button
            onClick={() => setLogs([])}
            className="flex items-center gap-1 px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
            title="Limpiar salida"
          >
            <RotateCcw className="w-3 h-3" />
            <span className="text-[10px]">Limpiar</span>
          </button>

          <button
            onClick={() => runCode()}
            disabled={isRunning}
            className="flex items-center gap-1 px-2.5 py-1 rounded bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold transition-colors shadow-sm disabled:opacity-50"
          >
            <Play className="w-3 h-3 fill-current" />
            <span className="text-[10px]">Ejecutar</span>
          </button>
        </div>
      </div>

      {/* Editor de código */}
      <div className="p-3 bg-slate-950 border-b border-slate-900">
        <textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          spellCheck={false}
          className="w-full h-36 bg-transparent text-amber-200/90 focus:outline-none resize-y font-mono text-[12px] leading-relaxed selection:bg-amber-500/30"
          placeholder="// Escribe o modifica el código de JavaScript aquí..."
        />
      </div>

      {/* Terminal Output */}
      <div className="p-3 bg-black/90 min-h-[90px] max-h-56 overflow-y-auto space-y-1">
        <div className="text-[10px] text-slate-500 flex items-center justify-between pb-1 border-b border-slate-800/80 mb-1.5">
          <span>SALIDA DE CONSOLA ({logs.length} registros)</span>
          <span>DOMINIO: Navegador</span>
        </div>

        {logs.length === 0 ? (
          <p className="text-slate-600 italic text-[11px] py-2 flex items-center gap-1.5">
            <span>&gt; Pulsa &quot;Ejecutar&quot; para correr el snippet en vivo.</span>
          </p>
        ) : (
          logs.map((log, idx) => (
            <div
              key={idx}
              className={`flex items-start gap-2 leading-relaxed text-[11px] ${
                log.type === 'error'
                  ? 'text-red-400 bg-red-950/20 px-1 rounded'
                  : log.type === 'warn'
                  ? 'text-yellow-400'
                  : log.type === 'info'
                  ? 'text-cyan-300 font-semibold'
                  : 'text-emerald-300'
              }`}
            >
              <span className="text-[9px] text-slate-600 select-none pt-0.5 font-mono">{log.timestamp}</span>
              <span className="text-slate-500 select-none">&gt;</span>
              <pre className="whitespace-pre-wrap font-mono flex-1">{log.content}</pre>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
