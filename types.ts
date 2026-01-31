
export interface Lesson {
  id: string;
  day: number;
  title: string;
  description: string;
  level: 'A2' | 'B1';
  topic: string;
  content?: LessonContent;
  status: 'locked' | 'available' | 'completed';
}

export interface LessonContent {
  grammar: string;
  vocabulary: string[];
  readingPassage: string;
  codeSnippet: {
    language: 'python' | 'html';
    code: string;
    explanation: string;
  };
  quiz: QuizQuestion[];
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export interface UserProgress {
  currentDay: number;
  completedLessons: string[];
  streak: number;
  vocabularyMastered: string[];
}
