export type QuestionType =
  | 'mcq'
  | 'complex'
  | 'true_false'
  | 'classification'
  | 'matching'
  | 'fill'
  | 'essay';

export type SessionId = 'pre_test' | 'daily_assessment' | 'daily_assessment_type2';

export interface ExamSessionConfig {
  id: SessionId;
  title: string;
  subtitle: string;
  token: string;
  durationMinutes: number;
  totalQuestions: number;
  maxScore: number;
  kkm: number;
  badge: string;
  themeColor: string;
}

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
  realIllustrationId?:
    | 'pizza_4'
    | 'birthday_cake_8'
    | 'chocolate_bar_dina'
    | 'pizza_dimakan_5'
    | 'three_juice_glasses'
    | 'matching_3_items'
    | 'cyclist_road_120'
    | 'class_36_students';
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
  options?: Option[];
  correctAnswer?: string;
  correctAnswers?: string[];
  statements?: StatementItem[];
  classificationCategories?: string[];
  classificationItems?: ClassificationItem[];
  matchingPairs?: MatchingPair[];
  matchingChoices?: MatchingChoice[];
  expectedKeywords?: string[];
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
  sessionId: SessionId;
  sessionTitle: string;
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

export interface StudentLiveMonitor {
  id: string;
  sessionId: SessionId;
  studentName: string;
  studentClass: 'VII Akademik' | 'VII Tahfidz-Middle East';
  studentNis: string;
  currentQuestionIndex: number;
  answeredCount: number;
  totalQuestions: number;
  timeLeftSeconds: number;
  tabViolations: number;
  isFullscreen: boolean;
  status: 'active' | 'finished' | 'disqualified' | 'trouble';
  lastPing: string;
  issues: string[];
}
