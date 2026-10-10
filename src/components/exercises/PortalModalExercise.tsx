'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Check } from 'lucide-react';

export function PortalModalExercise() {
  const [abierto, setAbierto] = useState(false);
  const [montado, setMontado] = useState(false);

  useEffect(() => {
    setMontado(true);
  }, []);

  // Handle Escape key
  useEffect(() => {
    if (!abierto) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setAbierto(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [abierto]);

  return (
    <div className="p-5 border rounded-2xl bg-card space-y-4 shadow-sm">
      <div className="border-b pb-3">
        <h3 className="font-bold text-base">Exercise 6: Accessible Modal with createPortal</h3>
        <p className="text-xs text-muted">Evaluates `createPortal`, `Escape` key handling, click isolation (`e.stopPropagation`), and WAI-ARIA roles.</p>
      </div>

      <div className="flex items-center justify-between">
        <p className="text-xs text-muted">
          Click the button to open the modal rendered directly into <code>&lt;body&gt;</code>.
        </p>
        <button
          onClick={() => setAbierto(true)}
          className="px-4 py-2 bg-primary text-white text-xs font-semibold rounded-xl hover:bg-primary/90 transition-colors"
        >
          Open Accessible Modal
        </button>
      </div>

      {abierto && montado && createPortal(
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in"
          onClick={() => setAbierto(false)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="bg-card border border-border rounded-2xl p-6 shadow-2xl max-w-md w-full space-y-4 text-foreground animate-in zoom-in-95"
            onClick={e => e.stopPropagation()} // Prevents closing when clicking inside
          >
            <div className="flex items-center justify-between border-b pb-3">
              <h4 className="font-bold text-sm">Critical Action Confirmation</h4>
              <button
                onClick={() => setAbierto(false)}
                className="p-1 text-muted hover:text-foreground rounded-lg"
                aria-label="Close modal"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-muted leading-relaxed">
              This dialog renders physically outside the page&apos;s local container while preserving the React event tree. You can close it by pressing <kbd className="px-1.5 py-0.5 border rounded bg-muted font-mono text-[10px]">Escape</kbd> or clicking the dark backdrop.
            </p>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setAbierto(false)}
                className="px-3 py-1.5 border rounded-lg text-xs font-medium hover:bg-muted"
              >
                Cancel
              </button>
              <button
                onClick={() => setAbierto(false)}
                className="px-4 py-1.5 bg-primary text-white text-xs font-semibold rounded-lg hover:bg-primary/90"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
