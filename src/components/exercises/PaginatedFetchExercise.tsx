'use client';

import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Loader2, AlertCircle, RefreshCw } from 'lucide-react';

interface PostMock {
  id: number;
  title: string;
  body: string;
  author: string;
}

export function PaginatedFetchExercise() {
  const [pagina, setPagina] = useState(1);
  const [posts, setPosts] = useState<PostMock[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const totalPaginas = 5;

  useEffect(() => {
    let activo = true;
    setCargando(true);
    setError(null);

    // Simulación de endpoint paginado
    const timer = setTimeout(() => {
      if (!activo) return;

      // Generamos 3 posts dinámicos por página
      const nuevosPosts: PostMock[] = [
        { id: (pagina - 1) * 3 + 1, title: `Capítulo ${(pagina - 1) * 3 + 1}: Arquitectura React en Producción`, body: 'Estrategias de escalado y decoupling.', author: 'Equipo React' },
        { id: (pagina - 1) * 3 + 2, title: `Capítulo ${(pagina - 1) * 3 + 2}: Concurrencia y Suspense`, body: 'Transiciones de prioridad y Server Components.', author: 'Ingeniería Vercel' },
        { id: (pagina - 1) * 3 + 3, title: `Capítulo ${(pagina - 1) * 3 + 3}: Optimización de Core Web Vitals`, body: 'Mejoras de INP y prevención de CLS.', author: 'Google Chrome Devs' }
      ];

      setPosts(nuevosPosts);
      setCargando(false);
    }, 400);

    return () => {
      activo = false;
      clearTimeout(timer);
    };
  }, [pagina]);

  return (
    <div className="p-5 border rounded-2xl bg-card space-y-4 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b pb-3">
        <div>
          <h3 className="font-bold text-base">Ejercicio 4: Fetch de Datos con Paginación</h3>
          <p className="text-xs text-muted">Evalúa estados `isLoading`, `error`, `data`, paginación y banderas de montaje.</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setPagina(p => Math.max(1, p - 1))}
            disabled={pagina === 1 || cargando}
            className="p-1.5 border rounded-lg hover:bg-muted disabled:opacity-40 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-xs font-mono font-semibold px-2">
            Página {pagina} de {totalPaginas}
          </span>
          <button
            onClick={() => setPagina(p => Math.min(totalPaginas, p + 1))}
            disabled={pagina === totalPaginas || cargando}
            className="p-1.5 border rounded-lg hover:bg-muted disabled:opacity-40 transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {cargando ? (
        <div className="p-10 text-center flex flex-col items-center justify-center gap-2 text-xs text-muted">
          <Loader2 className="w-5 h-5 text-primary animate-spin" />
          <span>Obteniendo página #{pagina}...</span>
        </div>
      ) : error ? (
        <div className="p-4 border border-red-500/30 bg-red-500/10 rounded-xl text-xs text-red-600 flex items-center gap-2">
          <AlertCircle className="w-4 h-4" /> {error}
        </div>
      ) : (
        <div className="space-y-2">
          {posts.map(post => (
            <div key={post.id} className="p-3 border rounded-xl bg-background space-y-1">
              <div className="flex justify-between items-center">
                <h4 className="font-semibold text-xs text-foreground">{post.title}</h4>
                <span className="text-[10px] text-muted font-mono">{post.author}</span>
              </div>
              <p className="text-xs text-muted">{post.body}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
