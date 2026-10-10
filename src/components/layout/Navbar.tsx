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
  Layers,
  Atom,
  Terminal,
  Home,
  Award,
  Split,
  Cpu,
  Brain,
  Trash2
} from 'lucide-react';

export function Navbar() {
  const pathname = usePathname();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [reactCompletedCount, setReactCompletedCount] = useState(0);
  const [jsCompletedCount, setJsCompletedCount] = useState(0);

  const isJsTrack = pathname.startsWith('/javascript');
  const isReactTrack = pathname.startsWith('/react') || pathname.startsWith('/nivel') || pathname.startsWith('/preguntas') || pathname === '/ejercicios' || pathname === '/checklist' || pathname === '/refactorings' || pathname === '/system-design';
  const isHub = pathname === '/';

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
        const savedReact = localStorage.getItem('react_entrevista_progress');
        if (savedReact) {
          const list = JSON.parse(savedReact);
          setReactCompletedCount(Array.isArray(list) ? list.length : 0);
        }

        const savedJs = localStorage.getItem('js_topics_studied');
        if (savedJs) {
          const list = JSON.parse(savedJs);
          setJsCompletedCount(Array.isArray(list) ? list.length : 0);
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

  // Enlaces según la pista activa
  const getNavLinks = () => {
    if (isJsTrack) {
      return [
        { href: '/javascript', label: 'Levels 1-8', icon: Layers },
        { href: '/javascript/acertijos', label: 'Riddles', icon: HelpCircle },
        { href: '/javascript/ejercicios', label: 'Coding Challenges', icon: Code2 },
        { href: '/javascript/memory-leaks', label: 'Memory Leaks', icon: Trash2 },
        { href: '/simulador', label: 'Mock Simulator', icon: Award },
        { href: '/flashcards', label: 'Flashcards', icon: Brain }
      ];
    }

    if (isReactTrack) {
      return [
        { href: '/react', label: 'Levels 1-8', icon: Layers },
        { href: '/react/re-renders', label: 'Re-renders', icon: Layers },
        { href: '/refactorings', label: 'Refactorings', icon: Split },
        { href: '/system-design', label: 'System Design', icon: Cpu },
        { href: '/simulador', label: 'Mock Simulator', icon: Award },
        { href: '/flashcards', label: 'Flashcards', icon: Brain },
        { href: '/checklist', label: 'Checklist', icon: CheckSquare }
      ];
    }

    // Portal Hub links
    return [
      { href: '/simulador', label: 'Mock Simulator', icon: Award },
      { href: '/refactorings', label: 'Refactorings', icon: Split },
      { href: '/system-design', label: 'System Design', icon: Cpu },
      { href: '/flashcards', label: 'Flashcards', icon: Brain },
      { href: '/react/re-renders', label: 'Re-renders Lab', icon: Layers },
      { href: '/javascript/memory-leaks', label: 'Memory Leaks', icon: Trash2 }
    ];
  };

  const navLinks = getNavLinks();

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-border/80 bg-background/80 backdrop-blur-md">
        <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-10 h-16 flex items-center justify-between gap-4">
          {/* Logo and Track Switcher */}
          <div className="flex items-center gap-3 shrink-0">
            <Link href="/" className="flex items-center gap-2.5 font-bold text-foreground hover:opacity-90 transition-opacity shrink-0">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-amber-500 flex items-center justify-center text-white shadow-md shadow-primary/20 shrink-0">
                <Sparkles className="w-5 h-5" />
              </div>
              <div className="flex flex-col justify-center">
                <span className="text-sm font-extrabold tracking-tight flex items-center gap-1.5 leading-tight">
                  Interview Hub
                </span>
                <span className="text-[10px] text-muted font-medium leading-tight">
                  React 19 &amp; JS Core
                </span>
              </div>
            </Link>

            {/* Track Switcher (Desktop) */}
            <div className="hidden md:flex items-center p-1 rounded-xl bg-muted/50 border border-border/80 text-xs font-bold ml-2 shrink-0">
              <Link
                href="/"
                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg transition-colors ${
                  isHub ? 'bg-background text-foreground shadow-xs' : 'text-muted hover:text-foreground'
                }`}
                title="Main Portal Hub"
              >
                <Home className="w-3 h-3" />
                <span>Hub</span>
              </Link>
              <Link
                href="/react"
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg transition-colors ${
                  isReactTrack && !isHub ? 'bg-blue-600 text-white shadow-xs' : 'text-muted hover:text-foreground'
                }`}
                title="React 19 & Next.js Track"
              >
                <Atom className="w-3 h-3" />
                <span>React</span>
              </Link>
              <Link
                href="/javascript"
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg transition-colors ${
                  isJsTrack ? 'bg-amber-500 text-slate-950 font-black shadow-xs' : 'text-muted hover:text-foreground'
                }`}
                title="JavaScript Core Track"
              >
                <Terminal className="w-3 h-3" />
                <span>JavaScript</span>
              </Link>
            </div>
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden xl:flex items-center gap-1 shrink-0">
            {navLinks.map(link => {
              const Icon = link.icon;
              const isActive = pathname === link.href || (link.href !== '/' && link.href !== '/react' && link.href !== '/javascript' && pathname.startsWith(link.href));
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

          {/* Actions */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Search Trigger */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className="hidden sm:flex items-center gap-2 px-3 py-1.5 border rounded-xl bg-muted/30 text-xs text-muted hover:text-foreground hover:border-primary/50 transition-colors"
            >
              <Search className="w-3.5 h-3.5" />
              <span>Search...</span>
              <kbd className="text-[10px] font-mono border rounded px-1.5 bg-background text-muted">Ctrl K</kbd>
            </button>

            <button
              onClick={() => setIsSearchOpen(true)}
              className="sm:hidden p-2 rounded-xl border hover:bg-muted text-muted"
              title="Search"
            >
              <Search className="w-4 h-4" />
            </button>

            {/* Contextual Progress Pill */}
            {isJsTrack ? (
              <Link
                href="/javascript/checklist"
                className="hidden xl:flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 text-xs font-semibold border border-amber-500/20"
                title="Mastered JavaScript topics"
              >
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                <span>{jsCompletedCount}/81 JS</span>
              </Link>
            ) : isReactTrack ? (
              <Link
                href="/checklist"
                className="hidden xl:flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 text-xs font-semibold border border-blue-500/20"
                title="Mastered React topics"
              >
                <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                <span>{reactCompletedCount}/79 React</span>
              </Link>
            ) : (
              <Link
                href="/"
                className="hidden xl:flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-semibold border border-emerald-500/20"
                title="Combined learning progress"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>{reactCompletedCount + jsCompletedCount}/160 topics</span>
              </Link>
            )}

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
          <div className="md:hidden border-t p-4 bg-card space-y-3 animate-in slide-in-from-top-2">
            {/* Mobile track switcher */}
            <div className="grid grid-cols-3 gap-1.5 p-1 rounded-xl bg-muted/60 border text-xs font-bold text-center">
              <Link
                href="/"
                onClick={() => setIsMobileMenuOpen(false)}
                className={`py-1.5 rounded-lg ${isHub ? 'bg-background shadow-xs text-foreground' : 'text-muted'}`}
              >
                Hub
              </Link>
              <Link
                href="/react"
                onClick={() => setIsMobileMenuOpen(false)}
                className={`py-1.5 rounded-lg ${isReactTrack && !isHub ? 'bg-blue-600 text-white' : 'text-muted'}`}
              >
                React
              </Link>
              <Link
                href="/javascript"
                onClick={() => setIsMobileMenuOpen(false)}
                className={`py-1.5 rounded-lg ${isJsTrack ? 'bg-amber-500 text-slate-950' : 'text-muted'}`}
              >
                JavaScript
              </Link>
            </div>

            <div className="space-y-1">
              {navLinks.map(link => {
                const Icon = link.icon;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-2.5 p-2 rounded-xl text-xs font-semibold hover:bg-muted text-foreground block"
                  >
                    <Icon className="w-4 h-4 text-primary" />
                    <span>{link.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </header>

      {/* Modal de búsqueda rápida */}
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
}
