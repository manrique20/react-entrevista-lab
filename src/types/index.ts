export interface Topic {
  id: string; // e.g. "1.1", "6.9"
  level: number;
  levelTitle: string;
  title: string;
  summary: string;
  whatIsIt: string;
  codeSnippet: string;
  codeLanguage?: string;
  interviewTips: string[];
  commonTraps: string[];
  keyTakeaway: string;
  componentKey: string;
  tags: string[];
}

export interface LevelInfo {
  id: number;
  title: string;
  shortTitle: string;
  description: string;
  color: string;
  iconName: string;
  topicIds: string[];
}

export interface InterviewQuestion {
  id: string;
  question: string;
  seniorAnswer: string;
  codeExample?: string;
  trapsAndRedFlags: string[];
  category: string;
  levelEquivalent?: number;
}

export interface ExerciseItem {
  id: string;
  title: string;
  description: string;
  difficulty: 'Básico' | 'Intermedio' | 'Avanzado';
  topicsTested: string[];
  componentKey: string;
  hints: string[];
}

export interface UserProgress {
  completedTopics: string[];
  completedExercises: string[];
  checklistItems: Record<string, boolean>;
}
