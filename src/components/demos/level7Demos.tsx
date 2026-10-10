'use client';

import React, { useState } from 'react';
import { ShieldCheck, ShieldAlert } from 'lucide-react';

// Demo 7.1: Rendering Strategies
export function RenderingStrategiesDemo() {
  const [strategy, setStrategy] = useState<'SSG' | 'SSR' | 'ISR' | 'CSR'>('SSG');

  const details = {
    SSG: {
      title: 'Static Site Generation (SSG)',
      when: 'Generated once during npm run build',
      where: 'Compiled on server and served directly from Edge CDN',
      ideal: 'Blogs, documentation, marketing landing pages',
      pros: 'Sub-millisecond delivery, zero server compute overhead, optimal TTFB',
      cons: 'Requires project rebuild to publish fresh content'
    },
    SSR: {
      title: 'Server-Side Rendering (SSR)',
      when: 'On every incoming HTTP request',
      where: 'Dynamically executed on Node.js / Serverless runtime',
      ideal: 'Dynamic user-specific pages (social feeds, live e-commerce)',
      pros: 'Always-fresh data, excellent SEO with personalized content',
      cons: 'TTFB depends on database latency, higher compute overhead'
    },
    ISR: {
      title: 'Incremental Static Regeneration (ISR)',
      when: 'At build time + background revalidation after X seconds',
      where: 'CDN edge cache with progressive invalidation (Stale-While-Revalidate)',
      ideal: 'Large e-commerce catalogs with moderate update frequency',
      pros: 'SSG speed with dynamic refresh capability without global rebuilds',
      cons: 'The first visitor after expiration may see stale data'
    },
    CSR: {
      title: 'Client-Side Rendering (CSR)',
      when: 'In the browser after downloading JS bundles',
      where: 'Client web browser (Pure SPA)',
      ideal: 'Authenticated private dashboards, internal tools',
      pros: 'Zero server compute overhead, instantaneous page transitions',
      cons: 'Zero SEO without prerendering, initial blank screen while parsing JS'
    }
  };

  const info = details[strategy];

  return (
    <div className="p-4 border rounded-xl bg-card text-xs space-y-4">
      <div className="flex flex-wrap gap-2">
        {(['SSG', 'SSR', 'ISR', 'CSR'] as const).map(type => (
          <button
            key={type}
            onClick={() => setStrategy(type)}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
              strategy === type ? 'bg-rose-600 text-white' : 'border hover:bg-muted'
            }`}
          >
            {type}
          </button>
        ))}
      </div>

      <div className="p-4 border rounded-xl bg-background space-y-2">
        <h4 className="font-bold text-sm text-rose-600 dark:text-rose-400">{info.title}</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-muted">
          <p><strong>When generated:</strong> {info.when}</p>
          <p><strong>Where processed:</strong> {info.where}</p>
          <p><strong>Ideal use cases:</strong> {info.ideal}</p>
          <p><strong>Key advantage:</strong> {info.pros}</p>
        </div>
      </div>
    </div>
  );
}

// Demo 7.8: Secure Authentication (HttpOnly vs LocalStorage)
export function AuthSecurityFlowDemo() {
  const [mode, setMode] = useState<'localstorage' | 'httponly'>('httponly');
  const [tokenExfiltrated, setTokenExfiltrated] = useState(false);

  return (
    <div className="p-4 border rounded-xl bg-card text-xs space-y-4">
      <div className="flex gap-2">
        <button
          onClick={() => { setMode('httponly'); setTokenExfiltrated(false); }}
          className={`px-3 py-1.5 rounded-lg font-medium ${mode === 'httponly' ? 'bg-emerald-600 text-white' : 'border'}`}
        >
          ✅ HttpOnly + Secure Cookies (Recommended)
        </button>
        <button
          onClick={() => { setMode('localstorage'); setTokenExfiltrated(false); }}
          className={`px-3 py-1.5 rounded-lg font-medium ${mode === 'localstorage' ? 'bg-red-600 text-white' : 'border'}`}
        >
          ❌ JWT in LocalStorage (Vulnerable to XSS)
        </button>
      </div>

      <div className={`p-4 border rounded-xl ${mode === 'httponly' ? 'border-emerald-500/30 bg-emerald-500/5' : 'border-red-500/30 bg-red-500/5'} space-y-2`}>
        <div className="flex items-center justify-between">
          <span className="font-semibold flex items-center gap-1.5">
            {mode === 'httponly' ? <ShieldCheck className="w-4 h-4 text-emerald-500" /> : <ShieldAlert className="w-4 h-4 text-red-500" />}
            {mode === 'httponly' ? 'Protected against XSS' : 'Vulnerable to malicious script read'}
          </span>
          <button
            onClick={() => setTokenExfiltrated(true)}
            className="px-2.5 py-1 bg-foreground text-background rounded text-[11px] font-medium"
          >
            Simulate XSS Script Attack
          </button>
        </div>

        {tokenExfiltrated && (
          <div className="p-2 border rounded bg-background font-mono text-[11px] mt-2">
            {mode === 'localstorage' ? (
              <p className="text-red-500">
                🚨 Attack Successful! Malicious script read: <code>localStorage.getItem(&apos;jwt&apos;) = &quot;eyJhbGciOi...&quot;</code> and stole session tokens.
              </p>
            ) : (
              <p className="text-emerald-500">
                🛡️ Attack Blocked: JavaScript is forbidden from reading <code>document.cookie</code> due to browser-enforced HttpOnly flags.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// Demo 7.9: XSS and Sanitization with DOMPurify
export function XssSanitizationDemo() {
  const [maliciousInput, setMaliciousInput] = useState('<img src="x" onerror="alert(\'XSS Hack!\')">');
  const [sanitized, setSanitized] = useState(false);

  return (
    <div className="p-4 border rounded-xl bg-card text-xs space-y-4">
      <div>
        <label className="text-muted block mb-1">Simulated attacker HTML payload:</label>
        <input
          value={maliciousInput}
          onChange={e => setMaliciousInput(e.target.value)}
          className="w-full px-3 py-1.5 border rounded bg-background font-mono text-[11px]"
        />
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => setSanitized(false)}
          className={`px-3 py-1 rounded ${!sanitized ? 'bg-red-600 text-white font-semibold' : 'border'}`}
        >
          Unsanitized (Dangerous)
        </button>
        <button
          onClick={() => setSanitized(true)}
          className={`px-3 py-1 rounded ${sanitized ? 'bg-emerald-600 text-white font-semibold' : 'border'}`}
        >
          Sanitized with DOMPurify
        </button>
      </div>

      <div className="p-3 border rounded bg-background font-mono text-[11px]">
        {sanitized ? (
          <p className="text-emerald-600 dark:text-emerald-400">
            DOMPurify stripped the malicious `onerror` handler. Clean output: <code>&lt;img src=&quot;x&quot;&gt;</code>
          </p>
        ) : (
          <p className="text-red-600 dark:text-red-400">
            ⚠️ If inserted via `dangerouslySetInnerHTML`, the attacker script will execute within the active user session.
          </p>
        )}
      </div>
    </div>
  );
}

// Level 7 Topics & Concepts
export function NextJsArchitectureDemo() {
  return (
    <div className="p-4 border rounded-xl bg-card text-xs space-y-2">
      <p className="font-semibold text-rose-500">App Router File Conventions</p>
      <div className="font-mono text-[11px] text-muted space-y-1">
        <p>• layout.tsx: Preserves state and does not remount on route changes</p>
        <p>• page.tsx: Route-specific content and view UI</p>
        <p>• loading.tsx: Automatically wrapped in a Suspense boundary</p>
        <p>• error.tsx: Automatically wrapped in a React Error Boundary</p>
      </div>
    </div>
  );
}

export function FrameworksComparisonDemo() {
  return (
    <div className="p-4 border rounded-xl bg-card text-xs space-y-2">
      <p className="font-semibold text-rose-500">Remix vs Vite vs Next.js</p>
      <p className="text-muted">Next.js leads with Server Components; React Router v7 / Remix excels in web standard loaders; Vite powers pure client-side SPAs.</p>
    </div>
  );
}

export function FolderArchitectureDemo() {
  return (
    <div className="p-4 border rounded-xl bg-card text-xs space-y-2">
      <p className="font-semibold text-rose-500">Feature-based Architecture</p>
      <p className="text-muted">Organize code by business feature modules (features/auth, features/cart) with explicit public index.ts exports rather than technical roles.</p>
    </div>
  );
}

export function MonorepoStructureDemo() {
  return (
    <div className="p-4 border rounded-xl bg-card text-xs space-y-2">
      <p className="font-semibold text-rose-500">Turborepo &amp; Monorepos</p>
      <p className="text-muted">Intelligent incremental compilation caching for multi-app codebases and shared design packages.</p>
    </div>
  );
}

export function MicrofrontendsDemo() {
  return (
    <div className="p-4 border rounded-xl bg-card text-xs space-y-2">
      <p className="font-semibold text-rose-500">Module Federation</p>
      <p className="text-muted">Asynchronous runtime consumption of microfrontend components while sharing singleton React instances.</p>
    </div>
  );
}

export function DesignSystemStoryDemo() {
  return (
    <div className="p-4 border rounded-xl bg-card text-xs space-y-2">
      <p className="font-semibold text-rose-500">Storybook &amp; Design Tokens</p>
      <p className="text-muted">Isolates development and automated accessibility validation for reusable design components prior to app integration.</p>
    </div>
  );
}
