export type QuestionType =
  | 'mcq'
  | 'complex'
  | 'true_false'
  | 'classification'
  | 'matching'
  | 'fill'
  | 'essay';

export interface Option {
  label: string;
  text: string;
}

export interface StatementItem {
  id: string;
  label: string;
  text: string;
  correctAnswer: 'B' | 'S';
}

export interface ClassificationItem {
  id: string;
  label: string;
  text: string;
  correctCategory: string;
}

export interface MatchingPair {
  id: string;
  num: string;
  question: string;
  correctCode: string;
}

export interface MatchingChoice {
  code: string;
  text: string;
}

export interface Question {
  id: number;
  section: 'A' | 'B' | 'C' | 'D' | 'E' | 'F';
  sectionTitle: string;
  sectionInstruction: string;
  type: QuestionType;
  maxPoints: number;
  prompt: string;
  adventurePost?: {
    id: 'pos1' | 'pos3' | 'pos4' | 'pos6' | 'pos7';
    name: string;
    description: string;
  };
  conceptBox?: {
    title: string;
    content: string;
    visualHint?: string;
  };
  // Tipe Spesifik
  options?: Option[];
  correctAnswer?: string; // Untuk MCQ single: 'A' | 'B' | 'C' | 'D'
  correctAnswers?: string[]; // Untuk Complex MCQ: ['A', 'B', 'D']
  statements?: StatementItem[]; // Untuk Benar-Salah
  classificationCategories?: string[]; // Untuk Klasifikasi
  classificationItems?: ClassificationItem[];
  matchingPairs?: MatchingPair[]; // Untuk Menjodohkan
  matchingChoices?: MatchingChoice[];
  expectedKeywords?: string[]; // Untuk evaluasi otomatis isian & uraian
  modelAnswer: string;
  rubric: string;
  explanation: string;
  indicator: string;
}

export interface StudentAnswers {
  [questionId: number]: any;
}

export interface QuestionEvaluation {
  questionId: number;
  score: number;
  maxScore: number;
  isCorrect: boolean;
  studentAnswerDisplay: string;
  correctAnswerDisplay: string;
  explanation: string;
  rubric: string;
  feedback?: string;
}

export interface ExamSubmission {
  id: string;
  studentName: string;
  studentClass: 'VII Akademik' | 'VII Tahfidz-Middle East';
  studentNis: string;
  totalScore: number;
  maxTotalScore: number;
  finalGrade: number; // 0 - 100
  passed: boolean;
  category: 'Sangat Baik' | 'Baik' | 'Cukup' | 'Perlu Bimbingan';
  categoryDescription: string;
  tabViolations: number;
  violationLogs: { time: string; reason: string }[];
  durationSeconds: number;
  durationFormatted: string;
  submittedAt: string;
  autoSubmittedDueToCheating: boolean;
  autoSubmittedDueToTimeout: boolean;
  answers: StudentAnswers;
  evaluations: QuestionEvaluation[];
  objectiveScore: number;
  essayScore: number;
  indicatorScores: { [indicator: string]: { score: number; max: number } };
  teacherNotes?: string;
}
