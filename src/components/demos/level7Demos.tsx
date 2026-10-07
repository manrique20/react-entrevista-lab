'use client';

import React, { useState } from 'react';
import { ShieldCheck, ShieldAlert, Lock, Unlock, Server, Globe, Folder, Box } from 'lucide-react';

// Demo 7.1: Estrategias de renderizado
export function RenderingStrategiesDemo() {
  const [estrategia, setEstrategia] = useState<'SSG' | 'SSR' | 'ISR' | 'CSR'>('SSG');

  const detalles = {
    SSG: {
      titulo: 'Static Site Generation (SSG)',
      cuando: 'Una sola vez durante npm run build',
      donde: 'Compilado en servidor y servido desde CDN Edge',
      ideal: 'Blogs, documentación, landing pages de marketing',
      pros: 'Velocidad milimétrica, costo mínimo de servidor, TTFB óptimo',
      contras: 'Requiere recompilar el proyecto para actualizar contenido'
    },
    SSR: {
      titulo: 'Server-Side Rendering (SSR)',
      cuando: 'En cada petición HTTP entrante',
      donde: 'Ejecutado dinámicamente en servidor Node.js / Serverless',
      ideal: 'Páginas con datos dinámicos por usuario (redes sociales, e-commerce)',
      pros: 'Datos siempre frescos, SEO excelente con contenido personalizado',
      contras: 'TTFB depende de la velocidad de la base de datos, mayor costo computacional'
    },
    ISR: {
      titulo: 'Incremental Static Regeneration (ISR)',
      cuando: 'En build + regeneración en background tras X segundos',
      donde: 'Caché CDN con invalidación progresiva (Stale-While-Revalidate)',
      ideal: 'Catálogos de productos grandes con cambios moderados',
      pros: 'Velocidad de SSG con capacidad de actualización sin rebuild global',
      contras: 'El primer usuario tras expirar el tiempo puede ver datos viejos'
    },
    CSR: {
      titulo: 'Client-Side Rendering (CSR)',
      cuando: 'En el navegador tras descargar el bundle JS',
      donde: 'Navegador del cliente (SPA pura)',
      ideal: 'Dashboards privados tras login, herramientas internas',
      pros: 'Cero carga en el servidor, transiciones instantáneas tras la carga inicial',
      contras: 'SEO nulo sin prerenderizado, pantalla en blanco inicial mientras descarga JS'
    }
  };

  const info = detalles[estrategia];

  return (
    <div className="p-4 border rounded-xl bg-card text-xs space-y-4">
      <div className="flex flex-wrap gap-2">
        {(['SSG', 'SSR', 'ISR', 'CSR'] as const).map(tipo => (
          <button
            key={tipo}
            onClick={() => setEstrategia(tipo)}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
              estrategia === tipo ? 'bg-rose-600 text-white' : 'border hover:bg-muted'
            }`}
          >
            {tipo}
          </button>
        ))}
      </div>

      <div className="p-4 border rounded-xl bg-background space-y-2">
        <h4 className="font-bold text-sm text-rose-600 dark:text-rose-400">{info.titulo}</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-muted">
          <p><strong>Cuándo se genera:</strong> {info.cuando}</p>
          <p><strong>Dónde se procesa:</strong> {info.donde}</p>
          <p><strong>Casos ideales:</strong> {info.ideal}</p>
          <p><strong>Ventaja principal:</strong> {info.pros}</p>
        </div>
      </div>
    </div>
  );
}

// Demo 7.8: Autenticación segura (HttpOnly vs LocalStorage)
export function AuthSecurityFlowDemo() {
  const [modo, setModo] = useState<'localstorage' | 'httponly'>('httponly');
  const [tokenExfiltrado, setTokenExfiltrado] = useState(false);

  return (
    <div className="p-4 border rounded-xl bg-card text-xs space-y-4">
      <div className="flex gap-2">
        <button
          onClick={() => { setModo('httponly'); setTokenExfiltrado(false); }}
          className={`px-3 py-1.5 rounded-lg font-medium ${modo === 'httponly' ? 'bg-emerald-600 text-white' : 'border'}`}
        >
          ✅ Cookies HttpOnly + Secure (Recomendado)
        </button>
        <button
          onClick={() => { setModo('localstorage'); setTokenExfiltrado(false); }}
          className={`px-3 py-1.5 rounded-lg font-medium ${modo === 'localstorage' ? 'bg-red-600 text-white' : 'border'}`}
        >
          ❌ JWT en LocalStorage (Vulnerable a XSS)
        </button>
      </div>

      <div className={`p-4 border rounded-xl ${modo === 'httponly' ? 'border-emerald-500/30 bg-emerald-500/5' : 'border-red-500/30 bg-red-500/5'} space-y-2`}>
        <div className="flex items-center justify-between">
          <span className="font-semibold flex items-center gap-1.5">
            {modo === 'httponly' ? <ShieldCheck className="w-4 h-4 text-emerald-500" /> : <ShieldAlert className="w-4 h-4 text-red-500" />}
            {modo === 'httponly' ? 'Protegido contra XSS' : 'Vulnerable a lectura maliciosa'}
          </span>
          <button
            onClick={() => setTokenExfiltrado(true)}
            className="px-2.5 py-1 bg-foreground text-background rounded text-[11px] font-medium"
          >
            Simular Ataque Script XSS
          </button>
        </div>

        {tokenExfiltrado && (
          <div className="p-2 border rounded bg-background font-mono text-[11px] mt-2">
            {modo === 'localstorage' ? (
              <p className="text-red-500">
                🚨 ¡Ataque Exitoso! El script malicioso leyó: <code>localStorage.getItem(&apos;jwt&apos;) = &quot;eyJhbGciOi...&quot;</code> y robó la sesión.
              </p>
            ) : (
              <p className="text-emerald-500">
                🛡️ Ataque Bloqueado: JavaScript no tiene permiso para leer <code>document.cookie</code> debido a la bandera HttpOnly impuesta por el navegador.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// Demo 7.9: XSS y Sanitización con DOMPurify
export function XssSanitizationDemo() {
  const [inputMalicioso, setInputMalicioso] = useState('<img src="x" onerror="alert(\'XSS Hackeado!\')">');
  const [sanitizado, setSanitizado] = useState(false);

  return (
    <div className="p-4 border rounded-xl bg-card text-xs space-y-4">
      <div>
        <label className="text-muted block mb-1">Payload HTML simulado de usuario atacante:</label>
        <input
          value={inputMalicioso}
          onChange={e => setInputMalicioso(e.target.value)}
          className="w-full px-3 py-1.5 border rounded bg-background font-mono text-[11px]"
        />
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => setSanitizado(false)}
          className={`px-3 py-1 rounded ${!sanitizado ? 'bg-red-600 text-white font-semibold' : 'border'}`}
        >
          Sin Sanitizar (Peligro)
        </button>
        <button
          onClick={() => setSanitizado(true)}
          className={`px-3 py-1 rounded ${sanitizado ? 'bg-emerald-600 text-white font-semibold' : 'border'}`}
        >
          Sanitizado con DOMPurify
        </button>
      </div>

      <div className="p-3 border rounded bg-background font-mono text-[11px]">
        {sanitizado ? (
          <p className="text-emerald-600 dark:text-emerald-400">
            DOMPurify eliminó el handler malicioso `onerror`. Salida limpia: <code>&lt;img src=&quot;x&quot;&gt;</code>
          </p>
        ) : (
          <p className="text-red-600 dark:text-red-400">
            ⚠️ Si insertas esto con `dangerouslySetInnerHTML`, el script se ejecutará en la sesión del usuario.
          </p>
        )}
      </div>
    </div>
  );
}

// Fallbacks para Nivel 7
export function NextJsArchitectureDemo() {
  return (
    <div className="p-4 border rounded-xl bg-card text-xs space-y-2">
      <p className="font-semibold text-rose-500">Convenciones de Archivos en App Router</p>
      <div className="font-mono text-[11px] text-muted space-y-1">
        <p>• layout.tsx: Persiste estado y no se desmonta al navegar</p>
        <p>• page.tsx: Contenido de la ruta actual</p>
        <p>• loading.tsx: Envuelto automáticamente en Suspense</p>
        <p>• error.tsx: Envuelto automáticamente en Error Boundary</p>
      </div>
    </div>
  );
}

export function FrameworksComparisonDemo() {
  return (
    <div className="p-4 border rounded-xl bg-card text-xs space-y-2">
      <p className="font-semibold text-rose-500">Remix vs Vite vs Next.js</p>
      <p className="text-muted">Next.js lidera en Server Components; React Router v7 en estándares web y loaders; Vite para SPAs puras.</p>
    </div>
  );
}

export function FolderArchitectureDemo() {
  return (
    <div className="p-4 border rounded-xl bg-card text-xs space-y-2">
      <p className="font-semibold text-rose-500">Feature-based Architecture</p>
      <p className="text-muted">Organiza por carpetas de funcionalidad (features/auth, features/carrito) con index.ts público en lugar de clasificar por tipo técnico.</p>
    </div>
  );
}

export function MonorepoStructureDemo() {
  return (
    <div className="p-4 border rounded-xl bg-card text-xs space-y-2">
      <p className="font-semibold text-rose-500">Turborepo &amp; Monorepos</p>
      <p className="text-muted">Caché inteligente de compilación incremental para múltiples aplicaciones y paquetes compartidos.</p>
    </div>
  );
}

export function MicrofrontendsDemo() {
  return (
    <div className="p-4 border rounded-xl bg-card text-xs space-y-2">
      <p className="font-semibold text-rose-500">Module Federation</p>
      <p className="text-muted">Descarga de componentes remotos en runtime compartiendo instancias singleton de React.</p>
    </div>
  );
}

export function DesignSystemStoryDemo() {
  return (
    <div className="p-4 border rounded-xl bg-card text-xs space-y-2">
      <p className="font-semibold text-rose-500">Storybook &amp; Tokens</p>
      <p className="text-muted">Desarrollo y prueba de componentes accesibles en aislamiento antes de integrarlos a la aplicación.</p>
    </div>
  );
}
