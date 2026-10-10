import { INTERVIEW_QUESTIONS } from '@/data/interviewQuestions';
import { reactRiddlesData } from '@/data/reactRiddlesData';
import { jsRiddlesData } from '@/data/javascript/riddlesData';
import { jsExercisesData } from '@/data/javascript/exercisesData';

export type InterviewTrack = 'fullstack' | 'react' | 'javascript';
export type InterviewDuration = 15 | 30 | 45;
export type SimulatorQuestionType = 'concept' | 'riddle' | 'coding';

export interface TestCaseItem {
  name: string;
  expression: string;
}

export interface SimulatorQuestion {
  id: string;
  type: SimulatorQuestionType;
  track: 'react' | 'javascript';
  title: string;
  category: string;
  difficulty: 'Junior' | 'Mid' | 'Senior' | 'Staff';
  points: number;
  prompt: string;
  codeSnippet?: string;
  options?: string[];
  correctIndex?: number;
  expectedExplanation?: string;
  keyPoints?: string[];
  modelAnswer?: string;
  traps?: string[];
  starterCode?: string;
  solutionCode?: string;
  testCases?: TestCaseItem[];
  relatedUrl?: string;
}

export interface UserAnswersState {
  riddleSelections: Record<string, number>; // questionId -> optionIndex
  conceptNotes: Record<string, string>; // questionId -> candidate notes
  conceptChecklist: Record<string, string[]>; // questionId -> array of checked key points
  codingCode: Record<string, string>; // questionId -> code
  codingPassed: Record<string, boolean>; // questionId -> boolean
}

export interface DomainScore {
  domain: string;
  earned: number;
  total: number;
  percentage: number;
}

export interface SeniorityDiagnosis {
  scorePercentage: number;
  earnedPoints: number;
  totalPoints: number;
  rank: 'Staff / Tech Lead' | 'Senior Frontend' | 'Semi-Senior (Mid)' | 'Junior Frontend';
  rankDescription: string;
  rankColor: string;
  domains: DomainScore[];
  recommendations: {
    title: string;
    description: string;
    linkUrl: string;
    linkLabel: string;
  }[];
  questionResults: {
    question: SimulatorQuestion;
    passed: boolean;
    earnedPoints: number;
    userChoiceOrNote: string;
  }[];
}

export function generateInterviewBattery(
  track: InterviewTrack,
  duration: InterviewDuration
): SimulatorQuestion[] {
  const result: SimulatorQuestion[] = [];

  // Determine quotas based on duration
  const counts = {
    15: { concept: 2, riddles: 2, coding: 1 },
    30: { concept: 3, riddles: 4, coding: 1 },
    45: { concept: 4, riddles: 6, coding: 2 },
  }[duration];

  // 1. SELECT CONCEPT QUESTIONS
  let availableConcepts = [...INTERVIEW_QUESTIONS];
  if (track === 'javascript') {
    availableConcepts = INTERVIEW_QUESTIONS.filter(q =>
      q.category.includes('Performance') || q.category.includes('Hooks') || q.id === 'q1' || q.id === 'q7'
    );
  }

  // Shuffle & pick
  const selectedConcepts = availableConcepts
    .sort(() => 0.5 - Math.random())
    .slice(0, counts.concept)
    .map((q, idx): SimulatorQuestion => ({
      id: `sim-concept-${q.id}-${idx}`,
      type: 'concept',
      track: 'react',
      title: q.question,
      category: q.category,
      difficulty: q.trapsAndRedFlags.length > 2 ? 'Senior' : 'Mid',
      points: 15,
      prompt: `Senior conceptual question: Formulate your answer explaining the technical root cause and architectural implications.`,
      codeSnippet: q.codeExample,
      modelAnswer: q.seniorAnswer,
      keyPoints: [
        'Technical root cause explanation (immutability, shallow diffing, or lifecycle)',
        'Impact on performance, state synchronization, or reconciliation',
        'Recommended production patterns and how to prevent errors'
      ],
      traps: q.trapsAndRedFlags,
      relatedUrl: '/react'
    }));

  result.push(...selectedConcepts);

  // 2. SELECT RIDDLES
  const availableRiddles: SimulatorQuestion[] = [];

  if (track === 'react' || track === 'fullstack') {
    const rRiddles = reactRiddlesData.map((r, idx): SimulatorQuestion => {
      const correctIdx = r.options.findIndex(opt => opt === r.expectedOutput);
      return {
        id: `sim-riddle-react-${r.id}-${idx}`,
        type: 'riddle',
        track: 'react',
        title: r.title,
        category: r.topicCategory || 'React Internals',
        difficulty: r.id === 'R2' || r.id === 'R3' || r.id === 'R8' ? 'Senior' : 'Mid',
        points: 10,
        prompt: `What exact value will be logged or rendered after execution?`,
        codeSnippet: r.codeSnippet,
        options: r.options,
        correctIndex: correctIdx !== -1 ? correctIdx : 0,
        expectedExplanation: r.explanation,
        traps: [r.trapExplanation],
        relatedUrl: '/react/acertijos'
      };
    });
    availableRiddles.push(...rRiddles);
  }

  if (track === 'javascript' || track === 'fullstack') {
    const jsRiddles = jsRiddlesData.map((r, idx): SimulatorQuestion => {
      const correctIdx = r.options.findIndex(opt => opt === r.expectedOutput);
      return {
        id: `sim-riddle-js-${r.id}-${idx}`,
        type: 'riddle',
        track: 'javascript',
        title: r.title,
        category: 'JavaScript Event Loop & Coercion',
        difficulty: r.id === 'A16' || r.id === 'A13' || r.id === 'A14' ? 'Senior' : 'Mid',
        points: 10,
        prompt: `What is the exact console output of this code snippet?`,
        codeSnippet: r.codeSnippet,
        options: r.options,
        correctIndex: correctIdx !== -1 ? correctIdx : 0,
        expectedExplanation: r.explanation,
        traps: [r.trapExplanation],
        relatedUrl: '/javascript/acertijos'
      };
    });
    availableRiddles.push(...jsRiddles);
  }

  const selectedRiddles = availableRiddles
    .sort(() => 0.5 - Math.random())
    .slice(0, counts.riddles);

  result.push(...selectedRiddles);

  // 3. SELECT CODING CHALLENGES
  const codingPool = jsExercisesData.filter(e =>
    ['E18', 'E19', 'E20', 'E4', 'E1', 'E9'].includes(e.id)
  );

  const selectedCoding = codingPool
    .sort(() => 0.5 - Math.random())
    .slice(0, counts.coding)
    .map((e, idx): SimulatorQuestion => {
      let testCases: TestCaseItem[] = [];
      let starterCode = '';

      if (e.id === 'E18') {
        starterCode = `// Reverse the order of words in a sentence\nfunction reverseSentence(sentence) {\n  // Your implementation here:\n  \n}`;
        testCases = [
          { name: 'Standard sentence', expression: `reverseSentence("Colorless green ideas sleep furiously") === "furiously sleep ideas green Colorless"` },
          { name: 'Single word', expression: `reverseSentence("React") === "React"` },
          { name: 'Multiple words', expression: `reverseSentence("frontend interview lab") === "lab interview frontend"` }
        ];
      } else if (e.id === 'E19') {
        starterCode = `// Group array items by key selector function\nfunction groupBy(array, keyFn) {\n  // Your implementation here:\n  \n}`;
        testCases = [
          { name: 'Group by even/odd', expression: `JSON.stringify(groupBy([1, 2, 3, 4], x => x % 2 === 0 ? 'even' : 'odd')) === JSON.stringify({odd:[1,3],even:[2,4]})` },
          { name: 'Group by length', expression: `JSON.stringify(groupBy(['a', 'bb', 'c'], s => s.length)) === JSON.stringify({"1":['a','c'],"2":['bb']})` }
        ];
      } else if (e.id === 'E20') {
        starterCode = `// Deep equality comparison for objects and primitives\nfunction deepEqual(a, b) {\n  // Your implementation here:\n  \n}`;
        testCases = [
          { name: 'Equal primitives', expression: `deepEqual(42, 42) === true` },
          { name: 'Distinct primitives', expression: `deepEqual(42, '42') === false` },
          { name: 'Nested objects', expression: `deepEqual({ x: [1, 2], y: { z: 3 } }, { x: [1, 2], y: { z: 3 } }) === true` },
          { name: 'Objects with distinct values', expression: `deepEqual({ a: 1 }, { a: 2 }) === false` }
        ];
      } else {
        starterCode = `// Implement ${e.title}\nfunction ${e.title.split(' ')[0]}() {\n  // Your code here:\n}`;
        testCases = [
          { name: 'Basic function type check', expression: `typeof ${e.title.split(' ')[0]} === 'function'` }
        ];
      }

      return {
        id: `sim-coding-${e.id}-${idx}`,
        type: 'coding',
        track: 'javascript',
        title: `Live Coding: ${e.title}`,
        category: e.category,
        difficulty: 'Senior',
        points: 20,
        prompt: `${e.description}. Write your solution and click "Run Test Suite" to verify execution live.`,
        starterCode,
        solutionCode: e.solutionCode,
        testCases,
        relatedUrl: '/javascript/ejercicios'
      };
    });

  result.push(...selectedCoding);

  return result.sort(() => 0.5 - Math.random());
}

export function evaluateMockInterview(
  battery: SimulatorQuestion[],
  answers: UserAnswersState
): SeniorityDiagnosis {
  let earnedPoints = 0;
  let totalPoints = 0;

  const domainScores: Record<string, { earned: number; total: number }> = {
    'React Internals & State': { earned: 0, total: 0 },
    'JavaScript Event Loop & Async': { earned: 0, total: 0 },
    'Coercion & Data Structures': { earned: 0, total: 0 },
    'Algorithms & Live Coding': { earned: 0, total: 0 },
  };

  const questionResults = battery.map((q) => {
    totalPoints += q.points;
    let passed = false;
    let earned = 0;
    let userChoiceOrNote = '';

    // Map question to domain category
    let domainKey = 'React Internals & State';
    if (q.type === 'coding') {
      domainKey = 'Algorithms & Live Coding';
    } else if (q.category.includes('Coercion') || q.category.includes('Coerción') || q.category.includes('Objects') || q.category.includes('Types')) {
      domainKey = 'Coercion & Data Structures';
    } else if (q.category.includes('Event Loop') || q.category.includes('Async')) {
      domainKey = 'JavaScript Event Loop & Async';
    } else if (q.track === 'react' || q.category.includes('React') || q.category.includes('Hooks')) {
      domainKey = 'React Internals & State';
    }

    if (q.type === 'riddle') {
      const selected = answers.riddleSelections[q.id];
      if (selected !== undefined && selected === q.correctIndex) {
        passed = true;
        earned = q.points;
      }
      userChoiceOrNote = selected !== undefined && q.options ? q.options[selected] : 'Unanswered';
    } else if (q.type === 'concept') {
      const checkedPoints = answers.conceptChecklist[q.id] || [];
      const totalChecks = q.keyPoints?.length || 1;
      const fraction = checkedPoints.length / totalChecks;
      earned = Math.round(q.points * fraction);
      passed = fraction >= 0.6;
      userChoiceOrNote = answers.conceptNotes[q.id]
        ? `Notes: "${answers.conceptNotes[q.id].slice(0, 80)}..." (${checkedPoints.length}/${totalChecks} key points checked)`
        : 'No notes provided';
    } else if (q.type === 'coding') {
      const isPassed = answers.codingPassed[q.id];
      if (isPassed) {
        passed = true;
        earned = q.points;
      }
      userChoiceOrNote = isPassed ? 'Test suite passed successfully' : 'Tests failing or incomplete';
    }

    earnedPoints += earned;
    domainScores[domainKey].earned += earned;
    domainScores[domainKey].total += q.points;

    return {
      question: q,
      passed,
      earnedPoints: earned,
      userChoiceOrNote,
    };
  });

  const scorePercentage = totalPoints > 0 ? Math.round((earnedPoints / totalPoints) * 100) : 0;

  // Seniority Ranking
  let rank: SeniorityDiagnosis['rank'] = 'Junior Frontend';
  let rankDescription = 'Foundations in progress. Recommend solidifying component lifecycle, core async handling, and avoiding direct state mutations.';
  let rankColor = 'text-amber-500';

  if (scorePercentage >= 90) {
    rank = 'Staff / Tech Lead';
    rankDescription = 'Elite mastery. Deep understanding of the rendering engine, surgical performance optimizations, closures, and production algorithms.';
    rankColor = 'text-emerald-500';
  } else if (scorePercentage >= 75) {
    rank = 'Senior Frontend';
    rankDescription = 'Solid Senior level. Sharp reconciliation intuition, microtasks/macrotasks mastery, and clean rendering patterns without over-engineering.';
    rankColor = 'text-cyan-500';
  } else if (scorePercentage >= 55) {
    rank = 'Semi-Senior (Mid)';
    rankDescription = 'Strong day-to-day practical skills, but with hesitation on async traps, stale closures, or fine-grained component optimizations.';
    rankColor = 'text-blue-500';
  }

  // Domain scores formatted
  const domains: DomainScore[] = Object.entries(domainScores)
    .filter(([_, data]) => data.total > 0)
    .map(([domain, data]) => ({
      domain,
      earned: data.earned,
      total: data.total,
      percentage: Math.round((data.earned / data.total) * 100),
    }));

  // Recommendations based on failed questions
  const recommendations: SeniorityDiagnosis['recommendations'] = [];

  const failedReact = questionResults.some(r => !r.passed && r.question.track === 'react');
  if (failedReact) {
    recommendations.push({
      title: 'React Re-renders Visualizer',
      description: 'Visually understand when React triggers unnecessary renders and how to resolve them with React.memo, useCallback, and children slot patterns.',
      linkUrl: '/react/re-renders',
      linkLabel: 'Open Re-renders Visualizer',
    });
    recommendations.push({
      title: 'React Riddles & Traps',
      description: 'Practice real-world production scenarios involving stale closures, automatic batching, and lifecycle hooks.',
      linkUrl: '/react/acertijos',
      linkLabel: 'Practice React Riddles',
    });
  }

  const failedJs = questionResults.some(r => !r.passed && r.question.track === 'javascript');
  if (failedJs) {
    recommendations.push({
      title: 'JavaScript Event Loop & Coercion',
      description: 'Master microtasks vs macrotasks execution order and tricky memory reference mutations.',
      linkUrl: '/javascript/acertijos',
      linkLabel: 'Explore JavaScript Riddles',
    });
    recommendations.push({
      title: 'Live Implementation Challenges',
      description: 'Master canonical interview polyfills such as debounce, deepClone, groupBy, and deepEqual in the interactive editor.',
      linkUrl: '/javascript/ejercicios',
      linkLabel: 'Solve JS Exercises',
    });
  }

  if (recommendations.length === 0) {
    recommendations.push({
      title: 'Explore Staff React Roadmap',
      description: 'Dive deeper into concurrent rendering patterns, React 19 Server Actions, and massive list virtualization architectures.',
      linkUrl: '/react',
      linkLabel: 'Explore React Dashboard',
    });
  }

  return {
    scorePercentage,
    earnedPoints,
    totalPoints,
    rank,
    rankDescription,
    rankColor,
    domains,
    recommendations,
    questionResults,
  };
}
