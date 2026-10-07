'use client';

import React, { useState } from 'react';
import { Check, Copy } from 'lucide-react';

interface CodeBlockProps {
  code: string;
  language?: string;
  title?: string;
}

export function CodeBlock({ code, language = 'tsx', title }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
    }
  };

  return (
    <div className="rounded-xl border border-border bg-[#0d1117] text-[#c9d1d9] overflow-hidden my-3 shadow-md font-mono text-xs md:text-sm">
      <div className="flex items-center justify-between px-4 py-2 bg-[#161b22] border-b border-[#30363d] text-xs text-gray-400">
        <div className="flex items-center gap-2">
          <span className="inline-block w-2.5 h-2.5 rounded-full bg-red-500/80" />
          <span className="inline-block w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
          <span className="inline-block w-2.5 h-2.5 rounded-full bg-green-500/80" />
          {title && <span className="ml-2 font-medium text-gray-300">{title}</span>}
          {!title && <span className="ml-2 uppercase tracking-wider">{language}</span>}
        </div>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-md hover:bg-white/10 text-gray-300 hover:text-white transition-colors"
          title="Copiar código"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-emerald-400 text-xs">¡Copiado!</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span className="text-xs">Copiar</span>
            </>
          )}
        </button>
      </div>
      <div className="p-4 overflow-x-auto max-h-[460px] leading-relaxed">
        <pre>
          <code>{code}</code>
        </pre>
      </div>
    </div>
  );
}
