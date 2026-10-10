'use client';

import React, { useState, useEffect } from 'react';
import { SYSTEM_DESIGN_CASES, type SystemDesignCase } from '@/data/systemDesignData';
import {
  Layers,
  Cpu,
  Workflow,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  BookOpen,
  HelpCircle,
  ShieldCheck,
  Zap,
  Activity,
  Bookmark,
  ChevronDown,
  ChevronUp,
  Server,
  Share2
} from 'lucide-react';
import confetti from 'canvas-confetti';

export function SystemDesignLab() {
  const [selectedCaseId, setSelectedCaseId] = useState<string>(SYSTEM_DESIGN_CASES[0].id);
  const [activeTab, setActiveTab] = useState<'reqs' | 'architecture' | 'flow' | 'deepdives' | 'traps'>('reqs');
  const [masteredIds, setMasteredIds] = useState<string[]>([]);
  const [expandedTraps, setExpandedTraps] = useState<Record<number, boolean>>({});

  const currentCase = SYSTEM_DESIGN_CASES.find(c => c.id === selectedCaseId) || SYSTEM_DESIGN_CASES[0];

  useEffect(() => {
    try {
      const saved = localStorage.getItem('system_design_mastered');
      if (saved) {
        setMasteredIds(JSON.parse(saved));
      }
    } catch {
      // Fallback
    }
  }, []);

  const toggleMastered = (id: string) => {
    try {
      const next = masteredIds.includes(id)
        ? masteredIds.filter(item => item !== id)
        : [...masteredIds, id];
      setMasteredIds(next);
      localStorage.setItem('system_design_mastered', JSON.stringify(next));
      if (!masteredIds.includes(id)) {
        confetti({ particleCount: 40, spread: 60, origin: { y: 0.8 } });
      }
    } catch {
      // Fallback
    }
  };

  const isMastered = masteredIds.includes(currentCase.id);

  return (
    <div className="space-y-6">
      {/* Case Selector Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
        {SYSTEM_DESIGN_CASES.map((c, idx) => {
          const isSelected = c.id === selectedCaseId;
          const done = masteredIds.includes(c.id);
          return (
            <button
              key={c.id}
              onClick={() => {
                setSelectedCaseId(c.id);
                setExpandedTraps({});
              }}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-2 border ${
                isSelected
                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                  : done
                  ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20'
                  : 'bg-card border-card-border hover:bg-card-hover text-muted-foreground'
              }`}
            >
              <span>Case {idx + 1}: {c.title.split(' (')[0].slice(0, 26)}...</span>
              {done && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />}
            </button>
          );
        })}
      </div>

      {/* Main Study Case Card */}
      <div className="bg-card border border-card-border rounded-2xl p-6 md:p-8 space-y-6 shadow-sm">
        {/* Header Badges & Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-card-border pb-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-indigo-500/15 text-indigo-600 dark:text-indigo-400">
                {currentCase.domain}
              </span>
              <span
                className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                  currentCase.targetRole === 'Staff / Principal'
                    ? 'bg-purple-500/15 text-purple-600 dark:text-purple-400'
                    : 'bg-cyan-500/15 text-cyan-600 dark:text-cyan-400'
                }`}
              >
                {currentCase.targetRole} Level
              </span>
            </div>
            <h2 className="text-xl md:text-2xl font-black text-foreground">
              {currentCase.title}
            </h2>
            <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">
              {currentCase.summary}
            </p>
          </div>

          <button
            onClick={() => toggleMastered(currentCase.id)}
            className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all flex items-center gap-1.5 shrink-0 self-start sm:self-auto ${
              isMastered
                ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30'
                : 'bg-muted/40 hover:bg-muted text-muted-foreground border-card-border'
            }`}
          >
            {isMastered ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>Design Mastered</span>
              </>
            ) : (
              <>
                <Bookmark className="w-4 h-4" />
                <span>Mark as Mastered</span>
              </>
            )}
          </button>
        </div>

        {/* Problem Statement Box */}
        <div className="p-4 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-xs text-foreground/90 space-y-1.5 leading-relaxed">
          <div className="font-bold flex items-center gap-1.5 text-indigo-600 dark:text-indigo-400">
            <Cpu className="w-4 h-4" />
            <span>System Design Interview Prompt:</span>
          </div>
          <p className="italic text-muted-foreground">&quot;{currentCase.interviewProblem}&quot;</p>
        </div>

        {/* View Switcher Tabs */}
        <div className="flex items-center gap-1 border-b border-card-border pb-1 overflow-x-auto text-xs font-semibold">
          {[
            { id: 'reqs', label: '1. Requirements & Scope', icon: CheckCircle2 },
            { id: 'architecture', label: '2. Architecture & Components', icon: Layers },
            { id: 'flow', label: '3. Data Flow', icon: Workflow },
            { id: 'deepdives', label: '4. Deep Dives & Trade-offs', icon: Activity },
            { id: 'traps', label: '5. Interview Traps', icon: HelpCircle }
          ].map(tab => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg transition-colors whitespace-nowrap ${
                  active
                    ? 'bg-indigo-600/10 text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600 font-bold'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/40'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* -------------------------------------------------- */}
        {/* TAB 1: FUNCTIONAL & NON-FUNCTIONAL REQUIREMENTS */}
        {/* -------------------------------------------------- */}
        {activeTab === 'reqs' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
            {/* Functional */}
            <div className="p-5 rounded-xl border border-card-border bg-card space-y-3">
              <h3 className="font-bold uppercase tracking-wider text-cyan-600 dark:text-cyan-400 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>Functional Requirements (What must it do?)</span>
              </h3>
              <ul className="space-y-2 text-muted-foreground">
                {currentCase.functionalReqs.map((req, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 mt-1.5 shrink-0" />
                    <span>{req}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Non-Functional */}
            <div className="p-5 rounded-xl border border-card-border bg-card space-y-3">
              <h3 className="font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 flex items-center gap-2">
                <Zap className="w-4 h-4" />
                <span>Non-Functional Requirements (Quality &amp; Scale)</span>
              </h3>
              <ul className="space-y-2 text-muted-foreground">
                {currentCase.nonFunctionalReqs.map((req, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-1.5 shrink-0" />
                    <span>{req}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* -------------------------------------------------- */}
        {/* TAB 2: ARCHITECTURE & COMPONENTS */}
        {/* -------------------------------------------------- */}
        {activeTab === 'architecture' && (
          <div className="space-y-6">
            {/* Architecture Flow Box */}
            <div className="p-5 rounded-xl border border-indigo-500/20 bg-[#0d1117] text-neutral-100 space-y-3">
              <div className="flex items-center justify-between text-xs text-neutral-400 border-b border-neutral-800 pb-2">
                <span className="font-bold uppercase tracking-wider text-indigo-400 flex items-center gap-1.5">
                  <Workflow className="w-3.5 h-3.5" />
                  <span>Layered Architecture Diagram</span>
                </span>
                <span className="font-mono text-[11px]">System Blueprint</span>
              </div>
              <pre className="font-mono text-xs text-neutral-300 leading-relaxed overflow-x-auto whitespace-pre p-2">
                {currentCase.architectureDiagramMermaid}
              </pre>
            </div>

            {/* Key Components Breakdown */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-foreground flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-indigo-500" />
                <span>Key System Components:</span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {currentCase.keyComponents.map((comp, idx) => (
                  <div key={idx} className="p-4 rounded-xl border border-card-border bg-card space-y-2 text-xs">
                    <div className="font-bold text-foreground text-sm flex items-center gap-1.5">
                      <Server className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                      <span>{comp.name}</span>
                    </div>
                    <p className="text-muted-foreground leading-relaxed">{comp.description}</p>
                    <div className="pt-2 border-t border-card-border space-y-1">
                      <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                        Responsibilities:
                      </div>
                      <ul className="space-y-1 text-muted-foreground text-[11px]">
                        {comp.responsibilities.map((r, ri) => (
                          <li key={ri} className="flex items-start gap-1.5">
                            <span className="w-1 h-1 rounded-full bg-indigo-500 mt-1.5 shrink-0" />
                            <span>{r}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* -------------------------------------------------- */}
        {/* TAB 3: DATA FLOW STEP BY STEP */}
        {/* -------------------------------------------------- */}
        {activeTab === 'flow' && (
          <div className="space-y-4">
            <div className="space-y-3">
              {currentCase.dataFlowSteps.map(step => (
                <div
                  key={step.stepNumber}
                  className="p-4 rounded-xl border border-card-border bg-card hover:bg-card-hover transition-colors flex items-start gap-4 text-xs"
                >
                  <div className="w-7 h-7 rounded-xl bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-xs shrink-0">
                    {step.stepNumber}
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-bold text-foreground text-sm">{step.title}</h4>
                    <p className="text-muted-foreground leading-relaxed">{step.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* -------------------------------------------------- */}
        {/* TAB 4: DEEP DIVES & TRADE-OFFS */}
        {/* -------------------------------------------------- */}
        {activeTab === 'deepdives' && (
          <div className="space-y-4">
            {currentCase.deepDives.map((dd, idx) => (
              <div key={idx} className="p-5 rounded-xl border border-card-border bg-card space-y-3 text-xs">
                <h4 className="font-bold text-foreground text-sm flex items-center gap-2">
                  <Activity className="w-4 h-4 text-cyan-500" />
                  <span>{dd.topic}</span>
                </h4>
                <div className="p-3.5 rounded-lg bg-muted/30 border border-card-border text-muted-foreground leading-relaxed">
                  <strong>Technical Challenge:</strong> {dd.analysis}
                </div>
                <div className="p-3.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-foreground leading-relaxed">
                  <strong className="text-emerald-600 dark:text-emerald-400">Senior Decision &amp; Trade-off:</strong>{' '}
                  {dd.seniorTradeoff}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* -------------------------------------------------- */}
        {/* TAB 5: INTERVIEWER TRAP QUESTIONS */}
        {/* -------------------------------------------------- */}
        {activeTab === 'traps' && (
          <div className="space-y-3 text-xs">
            {currentCase.interviewTrapsAndQuestions.map((trap, idx) => {
              const isOpen = expandedTraps[idx];
              return (
                <div key={idx} className="border border-card-border rounded-xl bg-card overflow-hidden">
                  <button
                    onClick={() =>
                      setExpandedTraps(prev => ({ ...prev, [idx]: !prev[idx] }))
                    }
                    className="w-full p-4 text-left flex items-center justify-between font-bold text-foreground hover:bg-card-hover transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <HelpCircle className="w-4 h-4 text-amber-500 shrink-0" />
                      <span>{trap.trapQuestion}</span>
                    </div>
                    {isOpen ? (
                      <ChevronUp className="w-4 h-4 text-muted-foreground" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-muted-foreground" />
                    )}
                  </button>
                  {isOpen && (
                    <div className="p-4 border-t border-card-border bg-cyan-500/5 text-muted-foreground leading-relaxed">
                      <div className="font-semibold text-cyan-600 dark:text-cyan-400 mb-1">
                        How to answer as a Staff / Senior Engineer:
                      </div>
                      <p>{trap.howToAnswer}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

