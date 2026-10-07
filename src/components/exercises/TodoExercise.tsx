'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Trash2, CheckCircle, Circle, Filter } from 'lucide-react';

interface Tarea {
  id: string;
  texto: string;
  completada: boolean;
  creadaEn: string;
}

export function TodoExercise() {
  const [tareas, setTareas] = useState<Tarea[]>([
    { id: '1', texto: 'Comprender el algoritmo Fiber O(n)', completada: true, creadaEn: 'Hoy' },
    { id: '2', texto: 'Resolver ejercicio de Debounce con AbortController', completada: false, creadaEn: 'Hoy' },
    { id: '3', texto: 'Repasar preguntas de concurrencia y Server Actions', completada: false, creadaEn: 'Hoy' }
  ]);
  const [nuevoTexto, setNuevoTexto] = useState('');
  const [filtro, setFiltro] = useState<'todas' | 'pendientes' | 'completadas'>('todas');

  const agregarTarea = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nuevoTexto.trim()) return;
    const nueva: Tarea = {
      id: crypto.randomUUID(), // ID estable
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
    if (filtro === 'pendientes') return !t.completada;
    if (filtro === 'completadas') return t.completada;
    return true;
  });

  return (
    <div className="p-5 border rounded-2xl bg-card space-y-4 shadow-sm">
      <div className="border-b pb-3">
        <h3 className="font-bold text-base">Ejercicio 2: To-do List Completo</h3>
        <p className="text-xs text-muted">Evalúa gestión de estado inmutable (.map, .filter), IDs estables para `key` y filtrado derivado.</p>
      </div>

      <form onSubmit={agregarTarea} className="flex gap-2">
        <input
          value={nuevoTexto}
          onChange={e => setNuevoTexto(e.target.value)}
          placeholder="Escribe una nueva tarea..."
          className="flex-1 px-3 py-2 border rounded-xl bg-background text-foreground text-xs focus:ring-2 focus:ring-primary focus:outline-none"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-primary text-white text-xs font-semibold rounded-xl hover:bg-primary/90 flex items-center gap-1.5 transition-colors"
        >
          <Plus className="w-4 h-4" /> Agregar
        </button>
      </form>

      {/* Barra de Filtros */}
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className="flex gap-1.5">
          {(['todas', 'pendientes', 'completadas'] as const).map(tipo => (
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
          {tareas.filter(t => !t.completada).length} pendientes de {tareas.length}
        </span>
      </div>

      {/* Lista */}
      <ul className="space-y-2">
        {tareasFiltradas.length === 0 ? (
          <li className="p-6 text-center text-xs text-muted italic border rounded-xl bg-muted/10">
            No hay tareas en esta categoría.
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
                  title="Eliminar tarea"
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
