'use client';

import React from 'react';

interface JsMarkdownViewProps {
  content: string;
  className?: string;
}

/**
 * Renderiza texto inline con soporte para:
 * - **negrita**
 * - `código inline`
 * - *itálica*
 */
function renderInlineFormatted(text: string): React.ReactNode[] {
  // Regex para capturar **negrita**, `codigo` e *italica*
  const tokens: React.ReactNode[] = [];
  const regex = /(\*\*[^*]+\*\*|`[^`]+`|\*[^*]+\*)/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      tokens.push(text.substring(lastIndex, match.index));
    }

    const token = match[0];
    if (token.startsWith('**') && token.endsWith('**')) {
      tokens.push(
        <strong key={`b-${match.index}`} className="font-semibold text-foreground">
          {token.slice(2, -2)}
        </strong>
      );
    } else if (token.startsWith('`') && token.endsWith('`')) {
      tokens.push(
        <code
          key={`c-${match.index}`}
          className="font-mono text-[11px] px-1.5 py-0.5 rounded bg-amber-500/10 dark:bg-amber-400/10 text-amber-700 dark:text-amber-300 border border-amber-500/20"
        >
          {token.slice(1, -1)}
        </code>
      );
    } else if (token.startsWith('*') && token.endsWith('*')) {
      tokens.push(
        <em key={`i-${match.index}`} className="italic text-foreground/90">
          {token.slice(1, -1)}
        </em>
      );
    }

    lastIndex = regex.lastIndex;
  }

  if (lastIndex < text.length) {
    tokens.push(text.substring(lastIndex));
  }

  return tokens.length > 0 ? tokens : [text];
}

/**
 * Parsea y renderiza una tabla Markdown clásica
 */
function renderMarkdownTable(tableLines: string[], key: string | number) {
  const rows = tableLines.map(line =>
    line
      .trim()
      .replace(/^\|/, '')
      .replace(/\|$/, '')
      .split('|')
      .map(cell => cell.trim())
  );

  if (rows.length < 2) return null;

  const headerRow = rows[0];
  // Si la segunda fila es el separador (|---|---|), la ignoramos para el body
  const bodyRows = rows.slice(1).filter(row => !row.every(cell => /^[-:\s]+$/.test(cell)));

  return (
    <div key={key} className="my-2.5 overflow-x-auto rounded-xl border border-border/70 shadow-xs">
      <table className="w-full border-collapse text-left text-xs">
        <thead>
          <tr className="bg-muted/60 border-b border-border/80">
            {headerRow.map((cell, i) => (
              <th key={i} className="px-3 py-2 font-bold text-foreground">
                {renderInlineFormatted(cell)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-border/50">
          {bodyRows.map((row, rIdx) => (
            <tr
              key={rIdx}
              className={rIdx % 2 === 0 ? 'bg-card/40 hover:bg-muted/30' : 'bg-muted/15 hover:bg-muted/30'}
            >
              {row.map((cell, cIdx) => (
                <td key={cIdx} className="px-3 py-2 text-foreground/90 align-top">
                  {renderInlineFormatted(cell)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function JsMarkdownView({ content, className = '' }: JsMarkdownViewProps) {
  if (!content) return null;

  const lines = content.split('\n');
  const elements: React.ReactNode[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];
    const trimmed = line.trim();

    // Línea vacía
    if (!trimmed) {
      i++;
      continue;
    }

    // Tabla markdown (comienza con |)
    if (trimmed.startsWith('|') && trimmed.endsWith('|')) {
      const tableLines: string[] = [];
      while (i < lines.length && lines[i].trim().startsWith('|') && lines[i].trim().endsWith('|')) {
        tableLines.push(lines[i]);
        i++;
      }
      elements.push(renderMarkdownTable(tableLines, `table-${i}`));
      continue;
    }

    // Lista desordenada (- o *)
    if (/^[-*]\s+/.test(trimmed)) {
      const listItems: string[] = [];
      while (i < lines.length && /^[-*]\s+/.test(lines[i].trim())) {
        listItems.push(lines[i].trim().replace(/^[-*]\s+/, ''));
        i++;
      }
      elements.push(
        <ul key={`ul-${i}`} className="space-y-1.5 my-2 ml-4 list-disc text-foreground/90 marker:text-amber-500">
          {listItems.map((item, idx) => (
            <li key={idx} className="leading-relaxed">
              {renderInlineFormatted(item)}
            </li>
          ))}
        </ul>
      );
      continue;
    }

    // Lista numerada (1. 2. etc)
    if (/^\d+\.\s+/.test(trimmed)) {
      const listItems: string[] = [];
      while (i < lines.length && /^\d+\.\s+/.test(lines[i].trim())) {
        listItems.push(lines[i].trim().replace(/^\d+\.\s+/, ''));
        i++;
      }
      elements.push(
        <ol key={`ol-${i}`} className="space-y-1.5 my-2 ml-4 list-decimal text-foreground/90 marker:font-bold marker:text-amber-500">
          {listItems.map((item, idx) => (
            <li key={idx} className="leading-relaxed">
              {renderInlineFormatted(item)}
            </li>
          ))}
        </ol>
      );
      continue;
    }

    // Párrafo de texto normal
    const paragraphLines: string[] = [line];
    i++;
    while (
      i < lines.length &&
      lines[i].trim() &&
      !lines[i].trim().startsWith('|') &&
      !/^[-*]\s+/.test(lines[i].trim()) &&
      !/^\d+\.\s+/.test(lines[i].trim())
    ) {
      paragraphLines.push(lines[i]);
      i++;
    }

    elements.push(
      <p key={`p-${i}`} className="leading-relaxed text-foreground/90">
        {renderInlineFormatted(paragraphLines.join('\n'))}
      </p>
    );
  }

  return (
    <div className={`space-y-2.5 text-xs sm:text-[13px] ${className}`}>
      {elements}
    </div>
  );
}
