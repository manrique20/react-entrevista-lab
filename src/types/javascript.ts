export interface JsTopic {
  id: string; // e.g. "P1", "P44"
  level: number;
  levelTitle: string;
  question: string;
  shortAnswer: string;
  explanation: string;
  codeSnippet: string;
  codeLanguage?: string;
  seniorTip?: string;
  tags: string[];
  interactiveDemo?: 'console' | 'coercion' | 'event-loop' | 'prototype' | 'none';
}

export interface JsLevelInfo {
  id: number;
  title: string;
  shortTitle: string;
  description: string;
  color: string;
  iconName: string;
  questionIds: string[];
}

export interface JsRiddle {
  id: string; // e.g. "A1"
  title: string;
  codeSnippet: string;
  expectedOutput: string;
  explanation: string;
  trapExplanation: string;
  options: string[];
}

export interface JsImplementationExercise {
  id: string; // e.g. "E1"
  title: string;
  category: 'Funcional' | 'Asincronía' | 'Estructuras de Datos' | 'Algoritmos' | 'Polyfills' | 'Objetos';
  description: string;
  solutionCode: string;
  testCasesCode: string;
  hints: string[];
}
