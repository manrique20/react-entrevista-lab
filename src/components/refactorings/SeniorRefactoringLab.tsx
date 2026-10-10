'use client';

import React, { useState, useEffect } from 'react';
import { REFACTORING_CASES, type RefactoringCase } from '@/data/refactoringsData';
import {
  Code2,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  ArrowRight,
  Copy,
  Check,
  HelpCircle,
  Layers,
  BookOpen,
  Split,
  ShieldAlert,
  Flame,
  CheckSquare,
  Bookmark
} from 'lucide-react';
import confetti from 'canvas-confetti';

export function SeniorRefactoringLab() {
  const [selectedCaseId, setSelectedCaseId] = useState<string>(REFACTORING_CASES[0].id);
  const [activeTab, setActiveTab] = useState<'diff' | 'before' | 'after' | 'interview'>('diff');
  const [masteredIds, setMasteredIds] = useState<string[]>([]);
  const [copiedSection, setCopiedSection] = useState<string | null>(null);
  const [expandedFollowUp, setExpandedFollowUp] = useState<Record<number, boolean>>({});

  const currentCase = REFACTORING_CASES.find(c => c.id === selectedCaseId) || REFACTORING_CASES[0];

  useEffect(() => {
    try {
      const saved = localStorage.getItem('refactorings_mastered');
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
      localStorage.setItem('refactorings_mastered', JSON.stringify(next));
      if (!masteredIds.includes(id)) {
        confetti({ particleCount: 40, spread: 60, origin: { y: 0.8 } });
      }
    } catch {
      // Fallback
    }
  };

  const handleCopy = async (code: string, label: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedSection(label);
      setTimeout(() => setCopiedSection(null), 2000);
    } catch {
      // Fallback
    }
  };

  const isMastered = masteredIds.includes(currentCase.id);

  return (
    <div className="space-y-6">
      {/* Case Navigator Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
        {REFACTORING_CASES.map((c, idx) => {
          const isSelected = c.id === selectedCaseId;
          const done = masteredIds.includes(c.id);
          return (
            <button
              key={c.id}
              onClick={() => {
                setSelectedCaseId(c.id);
                setExpandedFollowUp({});
              }}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-2 border ${
                isSelected
                  ? 'bg-primary text-white border-primary shadow-sm'
                  : done
                  ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20'
                  : 'bg-card border-card-border hover:bg-card-hover text-muted-foreground'
              }`}
            >
              <span>Case {idx + 1}: {c.title.split(' vs ')[0].slice(0, 24)}...</span>
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
              <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-cyan-500/15 text-cyan-600 dark:text-cyan-400">
                {currentCase.category}
              </span>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-indigo-500/15 text-indigo-500">
                {currentCase.difficulty} Level
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
                <span>Pattern Mastered</span>
              </>
            ) : (
              <>
                <Bookmark className="w-4 h-4" />
                <span>Mark as Mastered</span>
              </>
            )}
          </button>
        </div>

        {/* Interview Scenario Context Box */}
        <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-foreground/90 space-y-1.5 leading-relaxed">
          <div className="font-bold flex items-center gap-1.5 text-amber-600 dark:text-amber-400">
            <HelpCircle className="w-4 h-4" />
            <span>Typical Technical Interview Scenario:</span>
          </div>
          <p className="italic text-muted-foreground">&quot;{currentCase.interviewContext}&quot;</p>
        </div>

        {/* View Switcher Tabs */}
        <div className="flex items-center gap-1 border-b border-card-border pb-1 overflow-x-auto text-xs font-semibold">
          {[
            { id: 'diff', label: 'Split Comparison (Before vs After)', icon: Split },
            { id: 'before', label: '1. The Code Smell (Before)', icon: Flame },
            { id: 'after', label: '2. Senior Solution (After)', icon: Sparkles },
            { id: 'interview', label: '3. Reasoning & Trade-offs', icon: BookOpen }
          ].map(tab => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg transition-colors whitespace-nowrap ${
                  active
                    ? 'bg-primary/10 text-primary border-b-2 border-primary font-bold'
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
        {/* TAB 1: SPLIT COMPARISON (BEFORE VS AFTER) */}
        {/* -------------------------------------------------- */}
        {activeTab === 'diff' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Left Side: Before */}
            <div className="rounded-xl border border-rose-500/30 bg-[#0d1117] overflow-hidden flex flex-col justify-between text-xs">
              <div>
                <div className="px-4 py-2.5 bg-rose-500/15 border-b border-rose-500/20 flex items-center justify-between text-rose-400 font-mono text-[11px]">
                  <span className="flex items-center gap-1.5 font-bold">
                    <Flame className="w-3.5 h-3.5" />
                    <span>{currentCase.beforeFilename} (Anti-pattern)</span>
                  </span>
                  <button
                    onClick={() => handleCopy(currentCase.beforeCode, 'before')}
                    className="hover:text-rose-200"
                    title="Copy code"
                  >
                    {copiedSection === 'before' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
                <pre className="p-4 font-mono text-rose-200/90 overflow-x-auto leading-relaxed whitespace-pre text-[11px]">
                  {currentCase.beforeCode}
                </pre>
              </div>
              <div className="p-3 bg-rose-950/30 border-t border-rose-900/40 text-[11px] text-rose-300">
                <strong>Key issues:</strong> {currentCase.smellsList.map(s => s.issue).join(' • ')}
              </div>
            </div>

            {/* Right Side: After */}
            <div className="rounded-xl border border-emerald-500/30 bg-[#0d1117] overflow-hidden flex flex-col justify-between text-xs">
              <div>
                <div className="px-4 py-2.5 bg-emerald-500/15 border-b border-emerald-500/20 flex items-center justify-between text-emerald-400 font-mono text-[11px]">
                  <span className="flex items-center gap-1.5 font-bold">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>{currentCase.afterFilename} (Senior Solution)</span>
                  </span>
                  <button
                    onClick={() => handleCopy(currentCase.afterCode, 'after')}
                    className="hover:text-emerald-200"
                    title="Copy code"
                  >
                    {copiedSection === 'after' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
                <pre className="p-4 font-mono text-emerald-200/90 overflow-x-auto leading-relaxed whitespace-pre text-[11px]">
                  {currentCase.afterCode}
                </pre>
              </div>
              <div className="p-3 bg-emerald-950/30 border-t border-emerald-900/40 text-[11px] text-emerald-300">
                <strong>Key improvements:</strong> {currentCase.improvementsList.map(i => i.feature).join(' • ')}
              </div>
            </div>
          </div>
        )}

        {/* -------------------------------------------------- */}
        {/* TAB 2: DETAILED CODE SMELL (BEFORE) */}
        {/* -------------------------------------------------- */}
        {activeTab === 'before' && (
          <div className="space-y-6">
            <div className="rounded-xl border border-rose-500/30 bg-[#0d1117] overflow-hidden text-xs">
              <div className="px-4 py-2 bg-rose-500/10 border-b border-rose-500/20 flex items-center justify-between text-rose-400 font-mono">
                <span>{currentCase.beforeFilename}</span>
                <button onClick={() => handleCopy(currentCase.beforeCode, 'before')}>
                  {copiedSection === 'before' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
              <pre className="p-4 font-mono text-neutral-100 overflow-x-auto leading-relaxed whitespace-pre">
                {currentCase.beforeCode}
              </pre>
            </div>

            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-rose-500 flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4" />
                <span>Critical Flaws &amp; Interview Red Flags Analysis:</span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {currentCase.smellsList.map((smell, idx) => (
                  <div key={idx} className="p-4 rounded-xl border border-rose-500/20 bg-rose-500/5 space-y-1.5 text-xs">
                    {smell.lineHint && (
                      <div className="font-mono text-[11px] text-rose-500 font-bold">
                        📍 {smell.lineHint}
                      </div>
                    )}
                    <div className="font-semibold text-foreground">{smell.issue}</div>
                    <div className="text-muted-foreground leading-relaxed">{smell.impact}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* -------------------------------------------------- */}
        {/* TAB 3: SENIOR REFACTORED SOLUTION (AFTER) */}
        {/* -------------------------------------------------- */}
        {activeTab === 'after' && (
          <div className="space-y-6">
            <div className="rounded-xl border border-emerald-500/30 bg-[#0d1117] overflow-hidden text-xs">
              <div className="px-4 py-2 bg-emerald-500/10 border-b border-emerald-500/20 flex items-center justify-between text-emerald-400 font-mono">
                <span>{currentCase.afterFilename}</span>
                <button onClick={() => handleCopy(currentCase.afterCode, 'after')}>
                  {copiedSection === 'after' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
              <pre className="p-4 font-mono text-neutral-100 overflow-x-auto leading-relaxed whitespace-pre">
                {currentCase.afterCode}
              </pre>
            </div>

            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-500 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4" />
                <span>Applied Architectural Benefits:</span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {currentCase.improvementsList.map((imp, idx) => (
                  <div key={idx} className="p-4 rounded-xl border border-emerald-500/20 bg-emerald-500/5 space-y-1.5 text-xs">
                    <div className="font-bold text-foreground flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                      <span>{imp.feature}</span>
                    </div>
                    <div className="text-muted-foreground leading-relaxed">{imp.benefit}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* -------------------------------------------------- */}
        {/* TAB 4: INTERVIEW GUIDE & TRADE-OFFS */}
        {/* -------------------------------------------------- */}
        {activeTab === 'interview' && (
          <div className="space-y-6 text-xs leading-relaxed">
            {/* Senior Answer in 1 Sentence */}
            <div className="p-5 rounded-xl border border-primary/20 bg-primary/5 space-y-2">
              <div className="font-bold uppercase tracking-wider text-primary flex items-center gap-1.5 text-[11px]">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Senior 1-Sentence Answer for the Interviewer:</span>
              </div>
              <p className="text-sm font-semibold text-foreground">
                &quot;{currentCase.seniorAnswerSummary}&quot;
              </p>
            </div>

            {/* Architectural Trade-offs */}
            <div className="space-y-3">
              <h3 className="font-bold uppercase tracking-wider text-foreground flex items-center gap-1.5 text-xs">
                <Layers className="w-4 h-4 text-cyan-500" />
                <span>Trade-offs Analysis &amp; Production Decisions:</span>
              </h3>
              <ul className="space-y-2">
                {currentCase.architecturalTradeoffs.map((to, idx) => (
                  <li key={idx} className="p-3.5 rounded-xl border border-card-border bg-card/60 flex items-start gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 mt-1.5 shrink-0" />
                    <span className="text-muted-foreground">{to}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Follow-up Questions */}
            <div className="space-y-3 pt-2">
              <h3 className="font-bold uppercase tracking-wider text-foreground flex items-center gap-1.5 text-xs">
                <HelpCircle className="w-4 h-4 text-indigo-500" />
                <span>Common Follow-up Interview Questions:</span>
              </h3>
              <div className="space-y-2.5">
                {currentCase.followUpQuestions.map((q, idx) => {
                  const isOpen = expandedFollowUp[idx];
                  return (
                    <div key={idx} className="border border-card-border rounded-xl bg-card overflow-hidden">
                      <button
                        onClick={() =>
                          setExpandedFollowUp(prev => ({ ...prev, [idx]: !prev[idx] }))
                        }
                        className="w-full p-3.5 text-left flex items-center justify-between font-semibold text-foreground hover:bg-card-hover transition-colors"
                      >
                        <span>{q.question}</span>
                        <span className="text-xs text-primary font-bold">
                          {isOpen ? 'Hide' : 'View Answer'}
                        </span>
                      </button>
                      {isOpen && (
                        <div className="p-4 border-t border-card-border bg-muted/20 text-muted-foreground leading-relaxed">
                          {q.answer}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

