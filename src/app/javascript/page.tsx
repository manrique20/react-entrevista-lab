import React from 'react';
import Link from 'next/link';
import { jsLevelsData } from '@/data/javascript/levelsData';
import { allJsTopics } from '@/data/javascript/topicsData';
import { jsRiddlesData } from '@/data/javascript/riddlesData';
import { jsExercisesData } from '@/data/javascript/exercisesData';
import { EventLoopVisualizer } from '@/components/javascript/EventLoopVisualizer';
import { CoercionMatrix } from '@/components/javascript/CoercionMatrix';
import {
  Sparkles,
  Zap,
  Code,
  Layers,
  Boxes,
  Clock,
  Globe,
  Cpu,
  HelpCircle,
  Code2,
  CheckSquare,
  ArrowRight,
  Terminal,
  BookOpen
} from 'lucide-react';

const iconMap: Record<string, React.ElementType> = {
  Zap,
  Code,
  Layers,
  Boxes,
  Clock,
  Sparkles,
  Globe,
  Cpu
};

export default function JavascriptHomePage() {
  return (
    <div className="space-y-12 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl border border-amber-500/30 bg-gradient-to-b from-amber-500/10 via-background to-background p-6 sm:p-10 lg:p-12 shadow-sm">
        <div className="w-full max-w-5xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-700 dark:text-amber-300 text-xs font-bold tracking-wide uppercase">
            <Sparkles className="w-3.5 h-3.5" />
            <span>JavaScript Core &amp; Moderno (ES6+)</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-foreground leading-tight sm:leading-tight lg:leading-[1.2] break-words pb-1">
            Domina las Entrevistas Técnicas de{' '}
            <span className="bg-gradient-to-r from-amber-500 via-yellow-500 to-orange-500 bg-clip-text text-transparent">
              JavaScript
            </span>
          </h1>

          <p className="text-sm sm:text-base text-muted leading-relaxed max-w-3xl">
            De los fundamentos más oscuros (hoisting, coerción, microtareas y event loop) a patrones de diseño, polyfills canónicos y desafíos de algoritmos exigidos en roles Senior Frontend y Fullstack.
          </p>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4">
            <div className="p-3.5 rounded-2xl bg-card border border-border/80 shadow-xs">
              <div className="text-2xl font-black text-amber-500">8</div>
              <div className="text-xs text-muted font-medium">Niveles Progresivos</div>
            </div>
            <div className="p-3.5 rounded-2xl bg-card border border-border/80 shadow-xs">
              <div className="text-2xl font-black text-amber-500">{allJsTopics.length}</div>
              <div className="text-xs text-muted font-medium">Preguntas Teóricas (P1–P81)</div>
            </div>
            <div className="p-3.5 rounded-2xl bg-card border border-border/80 shadow-xs">
              <div className="text-2xl font-black text-amber-500">{jsRiddlesData.length}</div>
              <div className="text-xs text-muted font-medium">Acertijos &quot;¿Qué imprime?&quot;</div>
            </div>
            <div className="p-3.5 rounded-2xl bg-card border border-border/80 shadow-xs">
              <div className="text-2xl font-black text-amber-500">{jsExercisesData.length}</div>
              <div className="text-xs text-muted font-medium">Retos de Implementación</div>
            </div>
          </div>

          {/* Quick CTA Buttons */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Link
              href="/javascript/nivel/1"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 font-extrabold text-xs shadow-md shadow-amber-500/20 hover:opacity-95 transition-all"
            >
              <span>Comenzar Nivel 1</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/javascript/acertijos"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-amber-500/40 bg-card hover:bg-muted text-xs font-bold text-foreground transition-all"
            >
              <HelpCircle className="w-4 h-4 text-amber-500" />
              <span>Acertijos &quot;¿Qué imprime?&quot;</span>
            </Link>

            <Link
              href="/javascript/ejercicios"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-border/80 bg-card hover:bg-muted text-xs font-bold text-foreground transition-all"
            >
              <Code2 className="w-4 h-4 text-amber-500" />
              <span>Ejercicios E1–E17</span>
            </Link>

            <Link
              href="/javascript/checklist"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-border/80 bg-card hover:bg-muted text-xs font-bold text-foreground transition-all"
            >
              <CheckSquare className="w-4 h-4 text-emerald-500" />
              <span>Checklist de Repaso</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Los 8 Niveles de JavaScript */}
      <section className="space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-foreground">
              Los 8 Niveles de JavaScript
            </h2>
            <p className="text-xs sm:text-sm text-muted">
              Organizados desde lo más fundamental hasta arquitectura avanzada del motor y concurrencia.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {jsLevelsData.map((lvl) => {
            const IconComponent = iconMap[lvl.iconName] || BookOpen;
            return (
              <Link
                key={lvl.id}
                href={`/javascript/nivel/${lvl.id}`}
                className="group p-5 rounded-2xl border border-border/80 bg-card hover:border-amber-500/50 hover:shadow-md transition-all duration-200 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 flex items-center justify-center group-hover:scale-105 transition-transform">
                      <IconComponent className="w-5 h-5" />
                    </div>
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-muted text-muted font-mono">
                      {lvl.questionIds.length} temas
                    </span>
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-foreground group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                      {lvl.title}
                    </h3>
                    <p className="text-xs text-muted leading-relaxed line-clamp-3 mt-1.5">
                      {lvl.description}
                    </p>
                  </div>
                </div>

                <div className="pt-4 mt-2 border-t border-border/60 flex items-center justify-between text-xs font-semibold text-amber-600 dark:text-amber-400">
                  <span>Estudiar nivel</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Laboratorios Visuales Interactivos */}
      <section className="space-y-6 pt-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-foreground">
            Laboratorios Interactivos en Vivo
          </h2>
          <p className="text-xs sm:text-sm text-muted">
            Experimenta en tiempo real con las trampas y mecanismos internos del motor V8 y browsers.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <EventLoopVisualizer />
          <CoercionMatrix />
        </div>
      </section>
    </div>
  );
}
