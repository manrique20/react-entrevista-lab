'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ThemeToggle } from '../ui/ThemeToggle';
import { SearchModal } from '../ui/SearchModal';
import {
  Sparkles,
  Search,
  BookOpen,
  Code2,
  CheckSquare,
  HelpCircle,
  Menu,
  X,
  Layers
} from 'lucide-react';

export function Navbar() {
  const pathname = usePathname();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [completedCount, setCompletedCount] = useState(0);

  useEffect(() => {
    // Escuchar atajo Ctrl+K / Cmd+K
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(open => !open);
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    // Leer progreso de localStorage
    const updateProgress = () => {
      try {
        const saved = localStorage.getItem('react_entrevista_progress');
        if (saved) {
          const list = JSON.parse(saved);
          setCompletedCount(Array.isArray(list) ? list.length : 0);
        }
      } catch {
        // Fallback
      }
    };
    updateProgress();
    window.addEventListener('storage', updateProgress);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('storage', updateProgress);
    };
  }, []);

  const navLinks = [
    { href: '/', label: 'Niveles 1-8', icon: Layers },
    { href: '/preguntas', label: 'Preguntas de Entrevista', icon: HelpCircle },
    { href: '/ejercicios', label: 'Ejercicios Prácticos', icon: Code2 },
    { href: '/checklist', label: 'Checklist de Repaso', icon: CheckSquare }
  ];

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-border/80 bg-background/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 font-bold text-foreground hover:opacity-90 transition-opacity">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-500 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
              <Sparkles className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-extrabold tracking-tight flex items-center gap-1.5">
                React Lab <span className="text-[10px] font-mono font-normal px-1.5 py-0.2 rounded bg-primary/10 text-primary border border-primary/20">19 &amp; Next</span>
              </span>
              <span className="text-[10px] text-muted -mt-0.5 font-medium">Guía de Entrevista Senior</span>
            </div>
          </Link>

          {/* Links desktop */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map(link => {
              const Icon = link.icon;
              const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                    isActive
                      ? 'bg-primary/10 text-primary'
                      : 'text-muted hover:text-foreground hover:bg-muted/60'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Acciones */}
          <div className="flex items-center gap-2">
            {/* Buscador */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className="hidden sm:flex items-center gap-2 px-3 py-1.5 border rounded-xl bg-muted/30 text-xs text-muted hover:text-foreground hover:border-primary/50 transition-colors"
            >
              <Search className="w-3.5 h-3.5" />
              <span>Buscar...</span>
              <kbd className="text-[10px] font-mono border rounded px-1.5 bg-background text-muted">Ctrl K</kbd>
            </button>

            <button
              onClick={() => setIsSearchOpen(true)}
              className="sm:hidden p-2 rounded-xl border hover:bg-muted text-muted"
              title="Buscar"
            >
              <Search className="w-4 h-4" />
            </button>

            {/* Progreso pill */}
            <Link
              href="/checklist"
              className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-semibold border border-emerald-500/20"
              title="Temas marcados como estudiados"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>{completedCount}/79 dominados</span>
            </Link>

            <ThemeToggle />

            {/* Mobile menu trigger */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-xl border hover:bg-muted text-muted"
            >
              {isMobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Mobile dropdown */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t p-4 bg-card space-y-2 animate-in slide-in-from-top-2">
            {navLinks.map(link => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-2.5 p-2.5 rounded-xl text-xs font-semibold hover:bg-muted text-foreground block"
                >
                  <Icon className="w-4 h-4 text-primary" />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </div>
        )}
      </header>

      {/* Modal de búsqueda rápida */}
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
}
