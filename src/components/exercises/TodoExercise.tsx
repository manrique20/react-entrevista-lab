'use client';

import React, { useState } from 'react';
import { Plus, Trash2, CheckCircle, Circle } from 'lucide-react';

interface Tarea {
  id: string;
  texto: string;
  completada: boolean;
  creadaEn: string;
}

export function TodoExercise() {
  const [tareas, setTareas] = useState<Tarea[]>([
    { id: '1', texto: 'Understand the O(n) Fiber reconciliation algorithm', completada: true, creadaEn: 'Today' },
    { id: '2', texto: 'Solve Debounce exercise with AbortController', completada: false, creadaEn: 'Today' },
    { id: '3', texto: 'Review concurrency questions and Server Actions', completada: false, creadaEn: 'Today' }
  ]);
  const [nuevoTexto, setNuevoTexto] = useState('');
  const [filtro, setFiltro] = useState<'all' | 'pending' | 'completed'>('all');

  const agregarTarea = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nuevoTexto.trim()) return;
    const nueva: Tarea = {
      id: crypto.randomUUID(), // Stable ID
      texto: nuevoTexto.trim(),
      completada: false,
      creadaEn: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setTareas(prev => [nueva, ...prev]);
    setNuevoTexto('');
  };

  const toggleTarea = (id: string) => {
    setTareas(prev =>
      prev.map(t => (t.id === id ? { ...t, completada: !t.completada } : t))
    );
  };

  const eliminarTarea = (id: string) => {
    setTareas(prev => prev.filter(t => t.id !== id));
  };

  const tareasFiltradas = tareas.filter(t => {
    if (filtro === 'pending') return !t.completada;
    if (filtro === 'completed') return t.completada;
    return true;
  });

  return (
    <div className="p-5 border rounded-2xl bg-card space-y-4 shadow-sm">
      <div className="border-b pb-3">
        <h3 className="font-bold text-base">Exercise 2: Complete To-do List</h3>
        <p className="text-xs text-muted">Evaluates immutable state management (.map, .filter), stable IDs for `key`, and derived filtering.</p>
      </div>

      <form onSubmit={agregarTarea} className="flex gap-2">
        <input
          value={nuevoTexto}
          onChange={e => setNuevoTexto(e.target.value)}
          placeholder="Write a new task..."
          className="flex-1 px-3 py-2 border rounded-xl bg-background text-foreground text-xs focus:ring-2 focus:ring-primary focus:outline-none"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-primary text-white text-xs font-semibold rounded-xl hover:bg-primary/90 flex items-center gap-1.5 transition-colors"
        >
          <Plus className="w-4 h-4" /> Add
        </button>
      </form>

      {/* Filter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className="flex gap-1.5">
          {(['all', 'pending', 'completed'] as const).map(tipo => (
            <button
              key={tipo}
              onClick={() => setFiltro(tipo)}
              className={`px-3 py-1 rounded-lg capitalize font-medium transition-colors ${
                filtro === tipo ? 'bg-primary text-white' : 'border hover:bg-muted text-muted'
              }`}
            >
              {tipo}
            </button>
          ))}
        </div>
        <span className="text-muted font-mono text-[11px]">
          {tareas.filter(t => !t.completada).length} pending of {tareas.length}
        </span>
      </div>

      {/* List */}
      <ul className="space-y-2">
        {tareasFiltradas.length === 0 ? (
          <li className="p-6 text-center text-xs text-muted italic border rounded-xl bg-muted/10">
            No tasks in this category.
          </li>
        ) : (
          tareasFiltradas.map(t => (
            <li
              key={t.id}
              className={`p-3 border rounded-xl bg-background flex items-center justify-between gap-3 transition-colors ${
                t.completada ? 'opacity-60 bg-muted/20' : ''
              }`}
            >
              <div
                onClick={() => toggleTarea(t.id)}
                className="flex items-center gap-2.5 cursor-pointer flex-1 select-none"
              >
                {t.completada ? (
                  <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                ) : (
                  <Circle className="w-4 h-4 text-muted shrink-0" />
                )}
                <span className={`text-xs ${t.completada ? 'line-through text-muted' : 'text-foreground font-medium'}`}>
                  {t.texto}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-[10px] text-muted font-mono">{t.creadaEn}</span>
                <button
                  onClick={() => eliminarTarea(t.id)}
                  className="text-muted hover:text-red-500 p-1 transition-colors"
                  title="Delete task"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}
