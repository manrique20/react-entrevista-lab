'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import Link from 'next/link';
import confetti from 'canvas-confetti';
import {
  generateInterviewBattery,
  evaluateMockInterview,
  type InterviewTrack,
  type InterviewDuration,
  type SimulatorQuestion,
  type UserAnswersState,
  type SeniorityDiagnosis,
  type TestCaseItem
} from '@/data/mockInterviewEngine';
import {
  Clock,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  Play,
  Pause,
  Award,
  Layers,
  Terminal,
  Code2,
  BookOpen,
  ChevronDown,
  ChevronUp,
  Brain,
  ShieldAlert,
  Zap,
  HelpCircle,
  TrendingUp,
  Activity
} from 'lucide-react';

interface TestRunResult {
  name: string;
  passed: boolean;
  error?: string;
}

export function MockInterviewSimulator() {
  // CONFIGURATION STATE
  const [track, setTrack] = useState<InterviewTrack>('fullstack');
  const [duration, setDuration] = useState<InterviewDuration>(30);
  const [mode, setMode] = useState<'setup' | 'in-progress' | 'results'>('setup');

  // INTERVIEW STATE
  const [battery, setBattery] = useState<SimulatorQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [secondsRemaining, setSecondsRemaining] = useState<number>(30 * 60);
  const [isPaused, setIsPaused] = useState(false);
  const [showExitModal, setShowExitModal] = useState(false);

  // USER ANSWERS STATE
  const [userAnswers, setUserAnswers] = useState<UserAnswersState>({
    riddleSelections: {},
    conceptNotes: {},
    conceptChecklist: {},
    codingCode: {},
    codingPassed: {},
  });

  // TEST RUNNING FOR CODING QUESTIONS
  const [testResults, setTestResults] = useState<Record<string, TestRunResult[]>>({});
  const [isTestingCode, setIsTestingCode] = useState(false);

  // SHOW MODEL SPOILERS IN EXAM
  const [showModelAnswer, setShowModelAnswer] = useState<Record<string, boolean>>({});

  // FINAL DIAGNOSIS
  const [diagnosis, setDiagnosis] = useState<SeniorityDiagnosis | null>(null);
  const [expandedReview, setExpandedReview] = useState<Record<string, boolean>>({});

  // START INTERVIEW
  const handleStartInterview = () => {
    const newBattery = generateInterviewBattery(track, duration);
    setBattery(newBattery);
    setCurrentIndex(0);
    setSecondsRemaining(duration * 60);
    setIsPaused(false);

    // Initialize coding initial codes
    const initialCoding: Record<string, string> = {};
    newBattery.forEach(q => {
      if (q.type === 'coding' && q.starterCode) {
        initialCoding[q.id] = q.starterCode;
      }
    });

    setUserAnswers({
      riddleSelections: {},
      conceptNotes: {},
      conceptChecklist: {},
      codingCode: initialCoding,
      codingPassed: {},
    });
    setTestResults({});
    setShowModelAnswer({});
    setDiagnosis(null);
    setMode('in-progress');
  };

  // FINISH INTERVIEW
  const handleFinishInterview = useCallback(() => {
    const evaluation = evaluateMockInterview(battery, userAnswers);
    setDiagnosis(evaluation);
    setMode('results');

    // Trigger celebratory confetti on high scores
    if (evaluation.scorePercentage >= 75) {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  }, [battery, userAnswers]);

  // TIMER EFFECT
  useEffect(() => {
    if (mode !== 'in-progress' || isPaused) return;

    if (secondsRemaining <= 0) {
      handleFinishInterview();
      return;
    }

    const timer = setInterval(() => {
      setSecondsRemaining(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          handleFinishInterview();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [mode, isPaused, secondsRemaining, handleFinishInterview]);

  // FORMAT REMAINING SECONDS
  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remSecs = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${remSecs.toString().padStart(2, '0')}`;
  };

  const currentQuestion = battery[currentIndex];

  // EXECUTE LIVE TEST SUITE FOR CODING QUESTIONS
  const handleRunTests = async (q: SimulatorQuestion) => {
    if (!q.testCases || q.testCases.length === 0) return;

    const userCode = userAnswers.codingCode[q.id] || q.starterCode || '';
    setIsTestingCode(true);

    try {
      const results: TestRunResult[] = [];
      let allPassed = true;

      for (const tc of q.testCases) {
        try {
          // Construct isolated sandbox evaluation
          const runnerFn = new Function(`
            ${userCode}
            try {
              return Boolean(${tc.expression});
            } catch (err) {
              return { __error: String(err) };
            }
          `);

          const output = runnerFn();
          if (output && typeof output === 'object' && output.__error) {
            results.push({ name: tc.name, passed: false, error: output.__error });
            allPassed = false;
          } else if (output === true) {
            results.push({ name: tc.name, passed: true });
          } else {
            results.push({ name: tc.name, passed: false, error: 'Expression returned false' });
            allPassed = false;
          }
        } catch (evalErr) {
          results.push({ name: tc.name, passed: false, error: String(evalErr) });
          allPassed = false;
        }
      }

      setTestResults(prev => ({ ...prev, [q.id]: results }));
      setUserAnswers(prev => ({
        ...prev,
        codingPassed: { ...prev.codingPassed, [q.id]: allPassed }
      }));
    } catch (err) {
      const failed = q.testCases.map(tc => ({
        name: tc.name,
        passed: false,
        error: String(err)
      }));
      setTestResults(prev => ({ ...prev, [q.id]: failed }));
      setUserAnswers(prev => ({
        ...prev,
        codingPassed: { ...prev.codingPassed, [q.id]: false }
      }));
    } finally {
      setIsTestingCode(false);
    }
  };

  // CHECK STATUS OF QUESTION
  const isQuestionAnswered = (q: SimulatorQuestion) => {
    if (q.type === 'riddle') {
      return userAnswers.riddleSelections[q.id] !== undefined;
    }
    if (q.type === 'concept') {
      return (
        (userAnswers.conceptNotes[q.id]?.trim().length || 0) > 10 ||
        (userAnswers.conceptChecklist[q.id]?.length || 0) > 0
      );
    }
    if (q.type === 'coding') {
      return Boolean(userAnswers.codingPassed[q.id]);
    }
    return false;
  };

  // ----------------------------------------------------
  // VIEW: SETUP / CONFIGURATION
  // ----------------------------------------------------
  if (mode === 'setup') {
    return (
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 text-xs font-semibold">
            <Zap className="w-3.5 h-3.5" />
            <span>Realistic Simulation Environment</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold text-foreground tracking-tight">
            Technical Mock Interview Simulator
          </h2>
          <p className="text-sm md:text-base text-muted max-w-2xl mx-auto">
            Test your composure under timed pressure. Answer senior conceptual questions,
            solve tricky execution riddles, and pass live algorithm test suites to receive your
            Seniority diagnosis (Junior to Staff).
          </p>
        </div>

        {/* Configuration Card */}
        <div className="bg-card border border-border/80 rounded-2xl p-6 md:p-8 space-y-8 shadow-sm">
          {/* Step 1: Select Track */}
          <div className="space-y-4">
            <label className="text-xs font-bold uppercase tracking-wider text-muted flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-600 dark:text-cyan-400 flex items-center justify-center text-xs">
                1
              </span>
              <span>Select Your Interview Track</span>
            </label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {[
                {
                  id: 'fullstack',
                  title: 'Fullstack Frontend',
                  subtitle: 'React Internals + JavaScript Core',
                  desc: 'Comprehensive and balanced battery of rendering, event loop, and algorithms.',
                  icon: Layers
                },
                {
                  id: 'react',
                  title: 'React Specialist',
                  subtitle: 'Hooks, Diffing & Architecture',
                  desc: 'Reconciliation, React 19, re-renders, Server Actions, and memoization.',
                  icon: Sparkles
                },
                {
                  id: 'javascript',
                  title: 'JavaScript Core',
                  subtitle: 'Event Loop & Coercion',
                  desc: 'Microtasks vs Macrotasks, prototype chain, closures, and live coding.',
                  icon: Terminal
                }
              ].map(t => {
                const Icon = t.icon;
                const active = track === t.id;
                return (
                  <button
                    key={t.id}
                    onClick={() => setTrack(t.id as InterviewTrack)}
                    className={`p-4 rounded-xl border text-left transition-all ${
                      active
                        ? 'border-cyan-500 bg-cyan-500/10 text-foreground ring-2 ring-cyan-500/20 shadow-sm'
                        : 'border-border/80 bg-card hover:bg-muted/30 text-muted'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <Icon className={`w-4 h-4 ${active ? 'text-cyan-500' : 'text-muted'}`} />
                      <span className="font-bold text-sm text-foreground">{t.title}</span>
                    </div>
                    <div className="text-xs font-medium text-cyan-600 dark:text-cyan-400 mb-1">
                      {t.subtitle}
                    </div>
                    <div className="text-[11px] text-muted leading-relaxed">
                      {t.desc}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Step 2: Select Duration */}
          <div className="space-y-4">
            <label className="text-xs font-bold uppercase tracking-wider text-muted flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-600 dark:text-cyan-400 flex items-center justify-center text-xs">
                2
              </span>
              <span>Choose Session Duration</span>
            </label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {[
                {
                  time: 15,
                  title: 'Express (15 min)',
                  tag: '5 Key Questions',
                  desc: '2 Conceptual + 2 Riddles + 1 Quick Coding. Ideal for an agile refresher.'
                },
                {
                  time: 30,
                  title: 'Standard (30 min)',
                  tag: '8 Full Questions',
                  desc: '3 Conceptual + 4 Riddles + 1 Coding. Typical technical phone screen format.'
                },
                {
                  time: 45,
                  title: 'Senior / Staff (45 min)',
                  tag: '12 Advanced Questions',
                  desc: '4 Deep Conceptual + 6 Tricky Riddles + 2 Live Codings.'
                }
              ].map(d => {
                const active = duration === d.time;
                return (
                  <button
                    key={d.time}
                    onClick={() => setDuration(d.time as InterviewDuration)}
                    className={`p-4 rounded-xl border text-left transition-all ${
                      active
                        ? 'border-indigo-500 bg-indigo-500/10 text-foreground ring-2 ring-indigo-500/20 shadow-sm'
                        : 'border-border/80 bg-card hover:bg-muted/30 text-muted'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-sm text-foreground">{d.title}</span>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-400">
                        {d.tag}
                      </span>
                    </div>
                    <div className="text-[11px] text-muted leading-relaxed mt-2">
                      {d.desc}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Rules and Expectations */}
          <div className="p-4 rounded-xl bg-muted/40 border border-border/80 text-xs space-y-2 text-muted">
            <div className="font-bold text-foreground flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4 text-amber-500" />
              <span>Simulation Rules:</span>
            </div>
            <ul className="list-disc list-inside space-y-1">
              <li>The timer will not pause unless you explicitly hit pause.</li>
              <li>For conceptual questions, articulate your reasoning and check off the key concepts covered.</li>
              <li>For coding challenges, your solution must pass all unit tests in the test runner.</li>
              <li>Upon completion, you receive a domain breakdown and a Seniority rank diagnosis.</li>
            </ul>
          </div>

          {/* Action Button */}
          <div className="flex justify-end pt-2">
            <button
              onClick={handleStartInterview}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white font-bold text-sm shadow-md transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <span>Start Simulation Now</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ----------------------------------------------------
  // VIEW: RESULTS & SENIORITY DIAGNOSIS
  // ----------------------------------------------------
  if (mode === 'results' && diagnosis) {
    return (
      <div className="max-w-4xl mx-auto space-y-8 pb-12">
        {/* Results Banner */}
        <div className="bg-card border border-border/80 rounded-2xl p-6 md:p-8 space-y-6 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border/80 pb-6">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 text-xs font-semibold mb-2">
                <Award className="w-3.5 h-3.5" />
                <span>Final Interview Diagnosis</span>
              </div>
              <h2 className="text-2xl md:text-3xl font-extrabold text-foreground">
                Technical Seniority Report
              </h2>
              <p className="text-xs md:text-sm text-muted mt-1">
                Score achieved:{' '}
                <strong className="text-foreground">{diagnosis.earnedPoints}</strong> of{' '}
                <strong className="text-foreground">{diagnosis.totalPoints}</strong> possible points ({diagnosis.scorePercentage}%)
              </p>
            </div>

            <div className="flex items-center gap-4 bg-muted/40 p-4 rounded-xl border border-border/80">
              <div className="text-right">
                <div className="text-xs uppercase tracking-wider text-muted font-semibold">
                  Assigned Rank
                </div>
                <div className={`text-xl md:text-2xl font-black ${diagnosis.rankColor}`}>
                  {diagnosis.rank}
                </div>
              </div>
              <div className="w-12 h-12 rounded-xl bg-cyan-500/10 flex items-center justify-center text-cyan-500">
                <Brain className="w-6 h-6" />
              </div>
            </div>
          </div>

          {/* Rank Description */}
          <div className="p-4 rounded-xl bg-cyan-500/5 border border-cyan-500/20 text-xs md:text-sm text-foreground/90 leading-relaxed">
            {diagnosis.rankDescription}
          </div>

          {/* Domain Breakdown */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-indigo-500" />
              <span>Technical Domain Breakdown</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {diagnosis.domains.map(d => (
                <div key={d.domain} className="p-3 rounded-xl border border-border/80 bg-card/60 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-foreground">{d.domain}</span>
                    <span className="font-mono text-muted">
                      {d.percentage}% ({d.earned}/{d.total} pts)
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-muted overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        d.percentage >= 80
                          ? 'bg-emerald-500'
                          : d.percentage >= 50
                          ? 'bg-cyan-500'
                          : 'bg-amber-500'
                      }`}
                      style={{ width: `${d.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recommended Action Plan */}
          <div className="space-y-3 pt-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyan-500" />
              <span>Recommended Study &amp; Action Plan</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {diagnosis.recommendations.map((rec, i) => (
                <div
                  key={i}
                  className="p-4 rounded-xl border border-border/80 bg-card hover:bg-muted/30 transition-colors flex flex-col justify-between space-y-3"
                >
                  <div className="space-y-1">
                    <h4 className="text-sm font-bold text-foreground">{rec.title}</h4>
                    <p className="text-xs text-muted leading-relaxed">{rec.description}</p>
                  </div>
                  <Link
                    href={rec.linkUrl}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-cyan-600 dark:text-cyan-400 hover:underline pt-1"
                  >
                    <span>{rec.linkLabel}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-4 border-t border-border/80">
            <button
              onClick={() => setMode('setup')}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-border/80 hover:bg-muted/30 text-xs font-semibold text-foreground transition-all"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>New Simulation</span>
            </button>
            <Link
              href="/react/re-renders"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold transition-all shadow-sm"
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Explore Re-renders Visualizer</span>
            </Link>
          </div>
        </div>

        {/* Detailed Question Review */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-foreground uppercase tracking-wider flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-muted" />
            <span>Detailed Question Review ({diagnosis.questionResults.length})</span>
          </h3>

          <div className="space-y-3">
            {diagnosis.questionResults.map((r, idx) => {
              const q = r.question;
              const isExp = expandedReview[q.id];
              return (
                <div
                  key={q.id}
                  className={`border rounded-xl bg-card overflow-hidden transition-all ${
                    r.passed ? 'border-emerald-500/30' : 'border-amber-500/30'
                  }`}
                >
                  <button
                    onClick={() =>
                      setExpandedReview(prev => ({ ...prev, [q.id]: !prev[q.id] }))
                    }
                    className="w-full p-4 flex items-center justify-between text-left hover:bg-muted/30 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                          r.passed
                            ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400'
                            : 'bg-amber-500/15 text-amber-600 dark:text-amber-400'
                        }`}
                      >
                        {idx + 1}
                      </div>
                      <div>
                        <div className="text-xs font-bold text-foreground line-clamp-1">
                          {q.title}
                        </div>
                        <div className="text-[11px] text-muted flex items-center gap-2 mt-0.5">
                          <span>{q.category}</span>
                          <span>•</span>
                          <span>{q.type.toUpperCase()}</span>
                          <span>•</span>
                          <span className={r.passed ? 'text-emerald-500' : 'text-amber-500'}>
                            {r.earnedPoints} / {q.points} pts
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {r.passed ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                      ) : (
                        <AlertTriangle className="w-4 h-4 text-amber-500" />
                      )}
                      {isExp ? (
                        <ChevronUp className="w-4 h-4 text-muted" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-muted" />
                      )}
                    </div>
                  </button>

                  {isExp && (
                    <div className="p-4 border-t border-border/80 bg-muted/20 space-y-4 text-xs">
                      <div>
                        <div className="text-[11px] font-bold uppercase tracking-wider text-muted mb-1">
                          Your Recorded Response:
                        </div>
                        <div className="p-3 rounded-lg bg-card border border-border/80 text-foreground font-mono">
                          {r.userChoiceOrNote}
                        </div>
                      </div>

                      {q.expectedExplanation && (
                        <div>
                          <div className="text-[11px] font-bold uppercase tracking-wider text-muted mb-1">
                            Senior Technical Explanation:
                          </div>
                          <div className="p-3 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-foreground leading-relaxed whitespace-pre-line">
                            {q.expectedExplanation}
                          </div>
                        </div>
                      )}

                      {q.modelAnswer && (
                        <div>
                          <div className="text-[11px] font-bold uppercase tracking-wider text-muted mb-1">
                            Model Answer:
                          </div>
                          <div className="p-3 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-foreground leading-relaxed whitespace-pre-line">
                            {q.modelAnswer}
                          </div>
                        </div>
                      )}

                      {q.traps && q.traps.length > 0 && (
                        <div>
                          <div className="text-[11px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 mb-1">
                            Common Interview Pitfalls:
                          </div>
                          <ul className="list-disc list-inside space-y-1 text-muted">
                            {q.traps.map((t, ti) => (
                              <li key={ti}>{t}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // ----------------------------------------------------
  // VIEW: ACTIVE IN-PROGRESS INTERVIEW
  // ----------------------------------------------------
  if (!currentQuestion) return null;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Top Sticky Status Bar */}
      <div className="sticky top-16 z-30 bg-card/90 backdrop-blur-md border border-border/80 rounded-2xl p-4 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Left: Progress count */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-cyan-500/15 text-cyan-600 dark:text-cyan-400 flex items-center justify-center font-bold text-xs">
            {currentIndex + 1}/{battery.length}
          </div>
          <div>
            <div className="text-xs font-bold text-foreground">
              Question {currentIndex + 1} of {battery.length}
            </div>
            <div className="text-[11px] text-muted flex items-center gap-2">
              <span className="capitalize">{currentQuestion.category}</span>
              <span>•</span>
              <span>{currentQuestion.points} pts</span>
            </div>
          </div>
        </div>

        {/* Center: Timer & Controls */}
        <div className="flex items-center gap-3">
          <div
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-mono font-bold text-sm border ${
              secondsRemaining < 120
                ? 'bg-rose-500/15 text-rose-500 border-rose-500/30 animate-pulse'
                : secondsRemaining < 300
                ? 'bg-amber-500/15 text-amber-500 border-amber-500/30'
                : 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/20'
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>{formatTime(secondsRemaining)}</span>
          </div>

          <button
            onClick={() => setIsPaused(!isPaused)}
            className="p-2 rounded-xl border border-border/80 hover:bg-muted/30 text-muted hover:text-foreground transition-colors"
            title={isPaused ? 'Resume' : 'Pause'}
          >
            {isPaused ? <Play className="w-4 h-4 text-emerald-500" /> : <Pause className="w-4 h-4" />}
          </button>

          <button
            onClick={() => setShowExitModal(true)}
            className="px-3 py-1.5 rounded-xl border border-rose-500/30 text-rose-500 hover:bg-rose-500/10 text-xs font-semibold transition-colors"
          >
            Finish
          </button>
        </div>
      </div>

      {/* Paused Warning Banner */}
      {isPaused && (
        <div className="p-4 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-between text-xs text-amber-700 dark:text-amber-300">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4" />
            <span>Simulation paused. In a real technical round, the clock does not stop.</span>
          </div>
          <button
            onClick={() => setIsPaused(false)}
            className="px-3 py-1 rounded-lg bg-amber-500 text-white font-bold hover:bg-amber-600 transition-colors"
          >
            Resume
          </button>
        </div>
      )}

      {/* Question Selector Navigator */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-thin">
        {battery.map((q, idx) => {
          const isCurrent = idx === currentIndex;
          const answered = isQuestionAnswered(q);
          return (
            <button
              key={q.id}
              onClick={() => setCurrentIndex(idx)}
              className={`min-w-[32px] h-8 rounded-lg text-xs font-bold transition-all flex items-center justify-center ${
                isCurrent
                  ? 'bg-cyan-600 text-white ring-2 ring-cyan-500/30 shadow-sm'
                  : answered
                  ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
                  : 'bg-muted/60 text-muted hover:bg-muted'
              }`}
            >
              {idx + 1}
            </button>
          );
        })}
      </div>

      {/* QUESTION MAIN CARD */}
      <div className="bg-card border border-border/80 rounded-2xl p-6 md:p-8 space-y-6 shadow-sm">
        {/* Header badges */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/80 pb-4">
          <div className="flex items-center gap-2">
            <span
              className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                currentQuestion.type === 'concept'
                  ? 'bg-indigo-500/15 text-indigo-600 dark:text-indigo-400'
                  : currentQuestion.type === 'riddle'
                  ? 'bg-cyan-500/15 text-cyan-600 dark:text-cyan-400'
                  : 'bg-amber-500/15 text-amber-600 dark:text-amber-400'
              }`}
            >
              {currentQuestion.type === 'concept'
                ? 'Senior Conceptual Question'
                : currentQuestion.type === 'riddle'
                ? 'Execution Riddle'
                : 'Live Coding Challenge'}
            </span>

            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-muted text-muted">
              {currentQuestion.difficulty} Level
            </span>
          </div>

          <div className="text-xs font-mono text-muted">
            {currentQuestion.points} points possible
          </div>
        </div>

        {/* Prompt / Title */}
        <div className="space-y-2">
          <h3 className="text-xl md:text-2xl font-bold text-foreground leading-snug">
            {currentQuestion.title}
          </h3>
          <p className="text-xs md:text-sm text-muted leading-relaxed">
            {currentQuestion.prompt}
          </p>
        </div>

        {/* ------------------------------------------------ */}
        {/* QUESTION TYPE 1: RIDDLE (MULTIPLE CHOICE CODE) */}
        {/* ------------------------------------------------ */}
        {currentQuestion.type === 'riddle' && (
          <div className="space-y-6">
            {currentQuestion.codeSnippet && (
              <div className="rounded-xl border border-border/80 bg-[#0d1117] overflow-hidden text-xs">
                <div className="px-4 py-2 border-b border-neutral-800 bg-neutral-900/50 flex items-center justify-between text-neutral-400">
                  <span className="font-mono text-[11px]">snippet.js</span>
                  <Code2 className="w-3.5 h-3.5" />
                </div>
                <pre className="p-4 font-mono text-neutral-100 overflow-x-auto leading-relaxed whitespace-pre">
                  {currentQuestion.codeSnippet}
                </pre>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-muted">
                Select the exact output:
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                {currentQuestion.options?.map((opt, oIndex) => {
                  const isSelected = userAnswers.riddleSelections[currentQuestion.id] === oIndex;
                  return (
                    <button
                      key={oIndex}
                      onClick={() =>
                        setUserAnswers(prev => ({
                          ...prev,
                          riddleSelections: {
                            ...prev.riddleSelections,
                            [currentQuestion.id]: oIndex
                          }
                        }))
                      }
                      className={`p-3.5 rounded-xl border text-left transition-all font-mono text-xs flex items-center justify-between ${
                        isSelected
                          ? 'border-cyan-500 bg-cyan-500/10 text-cyan-600 dark:text-cyan-300 ring-2 ring-cyan-500/20'
                          : 'border-border/80 bg-card hover:bg-muted/30 text-foreground'
                      }`}
                    >
                      <span>{opt}</span>
                      <div
                        className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                          isSelected ? 'border-cyan-500 bg-cyan-500' : 'border-neutral-500'
                        }`}
                      >
                        {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ------------------------------------------------ */}
        {/* QUESTION TYPE 2: CONCEPTUAL (SENIOR ARGUMENTATION) */}
        {/* ------------------------------------------------ */}
        {currentQuestion.type === 'concept' && (
          <div className="space-y-6">
            {currentQuestion.codeSnippet && (
              <div className="rounded-xl border border-border/80 bg-[#0d1117] overflow-hidden text-xs">
                <div className="px-4 py-2 border-b border-neutral-800 bg-neutral-900/50 flex items-center justify-between text-neutral-400">
                  <span className="font-mono text-[11px]">example.tsx</span>
                  <Code2 className="w-3.5 h-3.5" />
                </div>
                <pre className="p-4 font-mono text-neutral-100 overflow-x-auto leading-relaxed whitespace-pre">
                  {currentQuestion.codeSnippet}
                </pre>
              </div>
            )}

            {/* Candidate text note */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-muted flex items-center justify-between">
                <span>Your Technical Explanation:</span>
                <span className="text-[11px] font-normal text-muted">
                  Write your answer as you would present it to the interviewer
                </span>
              </label>
              <textarea
                value={userAnswers.conceptNotes[currentQuestion.id] || ''}
                onChange={e =>
                  setUserAnswers(prev => ({
                    ...prev,
                    conceptNotes: {
                      ...prev.conceptNotes,
                      [currentQuestion.id]: e.target.value
                    }
                  }))
                }
                placeholder="Explain the technical root cause, lifecycle and memory implications, and architectural resolution..."
                rows={4}
                className="w-full p-3.5 rounded-xl border border-border/80 bg-card text-foreground text-xs leading-relaxed focus:outline-none focus:ring-2 focus:ring-cyan-500/20"
              />
            </div>

            {/* Self-check key points */}
            {currentQuestion.keyPoints && (
              <div className="p-4 rounded-xl border border-border/80 bg-muted/30 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-foreground">
                    Evaluator Key Criteria Checklist:
                  </span>
                  <span className="text-[11px] text-muted">
                    Check off key concepts covered in your reasoning
                  </span>
                </div>
                <div className="space-y-2">
                  {currentQuestion.keyPoints.map((point, pIdx) => {
                    const checkedList = userAnswers.conceptChecklist[currentQuestion.id] || [];
                    const isChecked = checkedList.includes(point);
                    return (
                      <label
                        key={pIdx}
                        className="flex items-start gap-2.5 text-xs text-foreground/90 cursor-pointer select-none"
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => {
                            const next = isChecked
                              ? checkedList.filter(p => p !== point)
                              : [...checkedList, point];
                            setUserAnswers(prev => ({
                              ...prev,
                              conceptChecklist: {
                                ...prev.conceptChecklist,
                                [currentQuestion.id]: next
                              }
                            }));
                          }}
                          className="mt-0.5 rounded border-border/80 text-cyan-600 focus:ring-cyan-500"
                        />
                        <span>{point}</span>
                      </label>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Optional peek model answer button */}
            <div className="pt-2">
              <button
                type="button"
                onClick={() =>
                  setShowModelAnswer(prev => ({
                    ...prev,
                    [currentQuestion.id]: !prev[currentQuestion.id]
                  }))
                }
                className="text-xs font-semibold text-cyan-600 dark:text-cyan-400 hover:underline inline-flex items-center gap-1"
              >
                <span>
                  {showModelAnswer[currentQuestion.id]
                    ? 'Hide reference model answer'
                    : 'Peek at reference model answer'}
                </span>
                <HelpCircle className="w-3.5 h-3.5" />
              </button>

              {showModelAnswer[currentQuestion.id] && currentQuestion.modelAnswer && (
                <div className="mt-3 p-4 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-xs leading-relaxed text-foreground whitespace-pre-line animate-fadeIn">
                  {currentQuestion.modelAnswer}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ------------------------------------------------ */}
        {/* QUESTION TYPE 3: CODING CHALLENGE */}
        {/* ------------------------------------------------ */}
        {currentQuestion.type === 'coding' && (
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold uppercase tracking-wider text-muted flex items-center gap-1.5">
                  <Terminal className="w-3.5 h-3.5 text-cyan-500" />
                  <span>Code Playground:</span>
                </span>
                <button
                  type="button"
                  onClick={() =>
                    setUserAnswers(prev => ({
                      ...prev,
                      codingCode: {
                        ...prev.codingCode,
                        [currentQuestion.id]: currentQuestion.solutionCode || ''
                      }
                    }))
                  }
                  className="text-[11px] font-semibold text-muted hover:text-cyan-500 transition-colors"
                >
                  Load Solution Scaffold
                </button>
              </div>

              <textarea
                value={userAnswers.codingCode[currentQuestion.id] ?? currentQuestion.starterCode ?? ''}
                onChange={e =>
                  setUserAnswers(prev => ({
                    ...prev,
                    codingCode: {
                      ...prev.codingCode,
                      [currentQuestion.id]: e.target.value
                    }
                  }))
                }
                rows={8}
                className="w-full p-4 font-mono text-xs bg-[#0d1117] text-neutral-100 rounded-xl border border-neutral-800 leading-relaxed focus:outline-none focus:ring-2 focus:ring-cyan-500/30"
                spellCheck={false}
              />
            </div>

            {/* Test Run Button */}
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={() => handleRunTests(currentQuestion)}
                disabled={isTestingCode}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-white font-bold text-xs shadow-sm transition-all"
              >
                <Play className="w-3.5 h-3.5" />
                <span>{isTestingCode ? 'Running test suite...' : 'Run Test Suite'}</span>
              </button>

              {userAnswers.codingPassed[currentQuestion.id] && (
                <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-500">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>All test cases passed! (+{currentQuestion.points} pts)</span>
                </div>
              )}
            </div>

            {/* Test cases results display */}
            {testResults[currentQuestion.id] && (
              <div className="p-4 rounded-xl border border-border/80 bg-muted/30 space-y-2 text-xs">
                <div className="font-bold text-foreground">Test Suite Output:</div>
                <div className="space-y-1.5">
                  {testResults[currentQuestion.id].map((res, rIdx) => (
                    <div
                      key={rIdx}
                      className={`p-2 rounded-lg flex items-center justify-between ${
                        res.passed
                          ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                          : 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        {res.passed ? (
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                        ) : (
                          <AlertTriangle className="w-3.5 h-3.5 text-rose-500" />
                        )}
                        <span className="font-semibold">{res.name}</span>
                      </div>
                      <span className="font-mono text-[11px]">
                        {res.passed ? 'PASSED' : res.error ? `Error: ${res.error}` : 'FAILED'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Bottom Nav Controls */}
        <div className="flex items-center justify-between pt-4 border-t border-border/80">
          <button
            onClick={() => setCurrentIndex(prev => Math.max(0, prev - 1))}
            disabled={currentIndex === 0}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-border/80 hover:bg-muted/30 disabled:opacity-30 disabled:pointer-events-none text-xs font-semibold text-foreground transition-all"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Previous</span>
          </button>

          {currentIndex < battery.length - 1 ? (
            <button
              onClick={() => setCurrentIndex(prev => Math.min(battery.length - 1, prev + 1))}
              className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold transition-all shadow-sm"
            >
              <span>Next</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              onClick={handleFinishInterview}
              className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-white text-xs font-bold transition-all shadow-md"
            >
              <span>Finish &amp; Evaluate</span>
              <Award className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Confirmation Exit Modal */}
      {showExitModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-card border border-border/80 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-xl">
            <div className="flex items-center gap-3 text-rose-500">
              <AlertTriangle className="w-6 h-6" />
              <h4 className="text-base font-bold text-foreground">Finish interview now?</h4>
            </div>
            <p className="text-xs text-muted leading-relaxed">
              Your evaluation will be calculated immediately with all answers recorded so far. Any
              unanswered questions will be scored as 0.
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setShowExitModal(false)}
                className="px-4 py-2 rounded-xl border border-border/80 hover:bg-muted/30 text-xs font-semibold text-foreground"
              >
                Continue Interview
              </button>
              <button
                onClick={() => {
                  setShowExitModal(false);
                  handleFinishInterview();
                }}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold"
              >
                Yes, finish &amp; score
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
