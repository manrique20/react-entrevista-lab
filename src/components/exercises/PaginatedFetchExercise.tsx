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

    // Simulated paginated endpoint
    const timer = setTimeout(() => {
      if (!activo) return;

      // 3 dynamic posts per page
      const nuevosPosts: PostMock[] = [
        { id: (pagina - 1) * 3 + 1, title: `Chapter ${(pagina - 1) * 3 + 1}: React Architecture in Production`, body: 'Scaling and decoupling strategies.', author: 'React Team' },
        { id: (pagina - 1) * 3 + 2, title: `Chapter ${(pagina - 1) * 3 + 2}: Concurrency and Suspense`, body: 'Priority transitions and Server Components.', author: 'Vercel Engineering' },
        { id: (pagina - 1) * 3 + 3, title: `Chapter ${(pagina - 1) * 3 + 3}: Core Web Vitals Optimization`, body: 'INP improvements and CLS prevention.', author: 'Google Chrome Devs' }
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
          <h3 className="font-bold text-base">Exercise 4: Data Fetching with Pagination</h3>
          <p className="text-xs text-muted">Evaluates `isLoading`, `error`, `data` states, pagination, and mount flags.</p>
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
            Page {pagina} of {totalPaginas}
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
          <span>Fetching page #{pagina}...</span>
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
