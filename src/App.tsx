import React, { useState, useEffect, useMemo } from 'react';
import confetti from 'canvas-confetti';
import {
  EXAM_METADATA,
  QUESTIONS_DATA,
  PRETEST_CONFIG,
} from './data/questions';
import {
  DAILY_ASSESSMENT_CONFIG,
  DAILY_ASSESSMENT_QUESTIONS,
} from './data/dailyAssessmentQuestions';
import { ExamSubmission, StudentAnswers, SessionId, StudentLiveMonitor } from './types/quiz';
import { evaluateExam } from './utils/mathGrading';
import { getSampleSubmissions } from './data/demoSubmissions';
import { AntiCheatMonitor } from './components/AntiCheatMonitor';
import { QuestionCard } from './components/QuestionCard';
import { StudentResultPdf } from './components/StudentResultPdf';
import { TeacherDashboard } from './components/TeacherDashboard';
import { TeacherPinModal } from './components/TeacherPinModal';
import {
  Clock,
  ShieldAlert,
  Award,
  ChevronLeft,
  ChevronRight,
  Bookmark,
  CheckCircle2,
  AlertTriangle,
  Lock,
  Maximize2,
  BookOpen,
  Send,
  Sparkles,
  Layers,
  HelpCircle,
  KeyRound,
  Check,
} from 'lucide-react';

const STORAGE_KEY = 'arrohmah_exam_submissions_v2';

export default function App() {
  // Screen views: 'register' | 'exam' | 'result'
  const [view, setView] = useState<'register' | 'exam' | 'result'>('register');

  // Selected session: 'daily_assessment' (default) or 'pre_test'
  const [selectedSession, setSelectedSession] = useState<SessionId>('daily_assessment');
  const [sessionTokenInput, setSessionTokenInput] = useState(DAILY_ASSESSMENT_CONFIG.token);

  // Student registration state
  const [studentName, setStudentName] = useState('');
  const [studentClass, setStudentClass] = useState<'VII Akademik' | 'VII Tahfidz-Middle East'>('VII Akademik');
  const [studentNis, setStudentNis] = useState('');
  const [regError, setRegError] = useState('');

  // Exam runtime state
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<StudentAnswers>({});
  const [flaggedQuestions, setFlaggedQuestions] = useState<Record<number, boolean>>({});
  const [timeLeft, setTimeLeft] = useState(70 * 60); // 70 mins = 4200 s
  const [startTime, setStartTime] = useState<number>(0);

  // Anti-cheating state
  const [violations, setViolations] = useState(0);
  const [violationLogs, setViolationLogs] = useState<{ time: string; reason: string }[]>([]);

  // Submissions storage & current view submission
  const [submissions, setSubmissions] = useState<ExamSubmission[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return getSampleSubmissions();
  });

  const [activeSubmission, setActiveSubmission] = useState<ExamSubmission | null>(null);

  // Live Monitoring State for Teacher Dashboard
  const [liveStudents, setLiveStudents] = useState<StudentLiveMonitor[]>([]);

  // Modals
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [showTeacherPinModal, setShowTeacherPinModal] = useState(false);
  const [showTeacherDashboard, setShowTeacherDashboard] = useState(false);

  // Active Questions & Config based on selected session
  const activeQuestions = useMemo(() => {
    return selectedSession === 'daily_assessment' ? DAILY_ASSESSMENT_QUESTIONS : QUESTIONS_DATA;
  }, [selectedSession]);

  const activeConfig = useMemo(() => {
    return selectedSession === 'daily_assessment' ? DAILY_ASSESSMENT_CONFIG : PRETEST_CONFIG;
  }, [selectedSession]);

  // Sync token input when session switches
  const handleSelectSession = (sId: SessionId) => {
    setSelectedSession(sId);
    setSessionTokenInput(sId === 'daily_assessment' ? DAILY_ASSESSMENT_CONFIG.token : PRETEST_CONFIG.token);
  };

  // Save submissions to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(submissions));
    } catch {
      // ignore
    }
  }, [submissions]);

  // 70-Minute Timer countdown
  useEffect(() => {
    if (view !== 'exam') return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleFinishExam(false, true); // Auto-submit due to timeout
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [view]);

  // Update live student monitor record while exam is active
  useEffect(() => {
    if (view === 'exam') {
      const isFullscreen = !!document.fullscreenElement;
      const issues: string[] = [];
      if (violations > 0) issues.push(`${violations}x Pindah Tab`);
      if (!isFullscreen) issues.push('Layar Tidak Penuh');

      const liveEntry: StudentLiveMonitor = {
        id: 'active_student_session',
        sessionId: selectedSession,
        studentName: studentName || 'Siswa',
        studentClass,
        studentNis: studentNis || '-',
        currentQuestionIndex,
        answeredCount: Object.keys(answers).length,
        totalQuestions: activeQuestions.length,
        timeLeftSeconds: timeLeft,
        tabViolations: violations,
        isFullscreen,
        status: violations >= 3 ? 'disqualified' : issues.length > 0 ? 'trouble' : 'active',
        lastPing: new Date().toLocaleTimeString('id-ID'),
        issues,
      };

      setLiveStudents([liveEntry]);
    } else {
      setLiveStudents([]);
    }
  }, [view, selectedSession, studentName, studentClass, studentNis, currentQuestionIndex, answers, timeLeft, violations, activeQuestions.length]);

  // Teacher Action: Reset Tab Violations (Dispensasi)
  const handleResetStudentViolations = () => {
    setViolations(0);
    setViolationLogs((prev) => [
      ...prev,
      { time: new Date().toLocaleTimeString('id-ID'), reason: 'Dispensasi / Reset Pelanggaran oleh Guru' },
    ]);
  };

  // Teacher Action: Add extra time (+10 min)
  const handleAddStudentTime = (_stId: string, minutes: number) => {
    setTimeLeft((prev) => prev + minutes * 60);
  };

  // Handle student answers
  const handleAnswerChange = (questionId: number, val: any) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: val,
    }));
  };

  const toggleFlag = (questionId: number) => {
    setFlaggedQuestions((prev) => ({
      ...prev,
      [questionId]: !prev[questionId],
    }));
  };

  // Check if a question is considered answered
  const isQuestionAnswered = (qId: number) => {
    const val = answers[qId];
    if (val === undefined || val === null || val === '') return false;
    if (Array.isArray(val)) return val.length > 0;
    if (typeof val === 'object') {
      const keys = Object.keys(val);
      if (keys.length === 0) return false;
      return Object.values(val).some((v) => v !== '' && v !== undefined && v !== null);
    }
    return true;
  };

  const answeredCount = useMemo(() => {
    return activeQuestions.filter((q) => isQuestionAnswered(q.id)).length;
  }, [activeQuestions, answers]);

  // Start Exam
  const handleStartExam = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentName.trim()) {
      setRegError('Silakan masukkan nama lengkap Anda.');
      return;
    }

    // Validate Token Kode Ujian
    const requiredToken =
      selectedSession === 'daily_assessment' ? DAILY_ASSESSMENT_CONFIG.token : PRETEST_CONFIG.token;
    if (sessionTokenInput.trim().toUpperCase() !== requiredToken.toUpperCase()) {
      setRegError(`Kode Ujian / Token salah. Hubungi guru pengawas atau gunakan token: ${requiredToken}`);
      return;
    }

    setRegError('');
    setAnswers({});
    setFlaggedQuestions({});
    setViolations(0);
    setViolationLogs([]);
    setTimeLeft(activeConfig.durationMinutes * 60);
    setStartTime(Date.now());
    setCurrentQuestionIndex(0);

    // Try request fullscreen for screen lock feature
    try {
      if (document.documentElement.requestFullscreen) {
        await document.documentElement.requestFullscreen();
      }
    } catch {
      // Browser or user may block fullscreen, proceed safely
    }

    setView('exam');
  };

  // Record Tab Violation
  const handleViolation = (reason: string) => {
    const currentTimeStr = new Date().toLocaleTimeString('id-ID');
    const newCount = violations + 1;
    setViolations(newCount);
    setViolationLogs((prev) => [...prev, { time: currentTimeStr, reason }]);
  };

  // Auto finish due to cheating (3 violations)
  const handleMaxViolationsReached = () => {
    handleFinishExam(true, false);
  };

  // Finish and Evaluate Exam
  const handleFinishExam = (dueToCheating = false, dueToTimeout = false) => {
    const durationSeconds = startTime ? Math.max(10, Math.floor((Date.now() - startTime) / 1000)) : 1800;

    const submission = evaluateExam(
      studentName,
      studentClass,
      studentNis || '13',
      answers,
      violations,
      violationLogs,
      durationSeconds,
      {
        sessionId: selectedSession,
        autoSubmittedDueToCheating: dueToCheating,
        autoSubmittedDueToTimeout: dueToTimeout,
      }
    );

    setSubmissions((prev) => [submission, ...prev]);
    setActiveSubmission(submission);
    setShowSubmitModal(false);
    setView('result');

    // Confetti celebration
    try {
      confetti({
        particleCount: 90,
        spread: 80,
        origin: { y: 0.6 },
      });
    } catch {
      // ignore
    }
  };

  // Timer format (mm:ss)
  const formatTimer = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // Demo data loading for teacher
  const handleLoadDemoData = () => {
    const demo = getSampleSubmissions();
    setSubmissions((prev) => [...demo, ...prev]);
  };

  // Active question object
  const currentQuestion = activeQuestions[currentQuestionIndex] || activeQuestions[0];

  return (
    <div className="min-h-screen bg-slate-100/60 font-sans text-slate-800 flex flex-col">
      {/* =========================================================================
          SCREEN 1: REGISTRATION / WELCOME SCREEN (WITH AR ROHMAH LOGO & SESSIONS)
      ========================================================================= */}
      {view === 'register' && (
        <div className="flex-1 flex flex-col items-center justify-center p-4 sm:p-6">
          {/* Top Bar for Teacher Access */}
          <div className="w-full max-w-3xl flex items-center justify-between mb-4">
            <div className="flex items-center gap-2.5 text-slate-800 font-bold text-xs sm:text-sm">
              <img
                src="/assets/aistudio/images_226422da.png"
                alt="Logo Ar Rohmah"
                className="w-7 h-7 object-contain rounded-full shadow-xs"
              />
              <span>SMP Ar Rohmah Bogor • CBT Matematika Kelas 7</span>
            </div>

            <button
              type="button"
              onClick={() => setShowTeacherPinModal(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 shadow-xs transition-all"
            >
              <Lock className="w-3.5 h-3.5 text-indigo-600" />
              <span>Dashboard Guru</span>
            </button>
          </div>

          <div className="w-full max-w-3xl bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden">
            {/* Header Banner with Official Ar Rohmah Logo */}
            <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white p-6 sm:p-8 relative">
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
                <img
                  src="/assets/aistudio/images_226422da.png"
                  alt="Logo Resmi SMP Ar Rohmah Bogor"
                  className="w-20 h-20 sm:w-24 sm:h-24 object-contain rounded-full bg-white p-1.5 shadow-md shrink-0"
                />

                <div className="text-center sm:text-left space-y-1.5">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-500/30 text-blue-200 border border-blue-400/30">
                    <Sparkles className="w-3.5 h-3.5" />
                    CBT Assessment System • TP 2026/2027
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
                    SMP AR ROHMAH BOGOR
                  </h1>
                  <p className="text-blue-200 text-xs sm:text-sm font-medium">
                    Matematika Kelas 7 • Bab 2: Bilangan Rasional (NPSN: 70061534)
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6 sm:p-8 space-y-6">
              {/* Session Selector (Pre-Test vs Daily Assessment) */}
              <div>
                <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-700 mb-2">
                  Pilih Sesi Ujian:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Sesi 2: Daily Assessment (Bab 2) - New & Official */}
                  <button
                    type="button"
                    onClick={() => handleSelectSession('daily_assessment')}
                    className={`p-4 rounded-2xl border-2 text-left transition-all relative ${
                      selectedSession === 'daily_assessment'
                        ? 'border-blue-600 bg-blue-50/70 shadow-sm'
                        : 'border-slate-200 hover:border-slate-300 bg-slate-50/50'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-blue-600 text-white">
                        Sesi Resmi Utama
                      </span>
                      {selectedSession === 'daily_assessment' && (
                        <Check className="w-4 h-4 text-blue-600 font-bold" />
                      )}
                    </div>
                    <h3 className="font-bold text-slate-900 text-sm">Daily Assessment: Bab 2</h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      25 Soal Lengkap: Pizza, Cokelat, Jus, Pesepeda, & 36 Siswa (6 Tipe Soal).
                    </p>
                    <div className="mt-2 text-[11px] font-mono text-blue-700 font-bold flex items-center gap-1">
                      <KeyRound className="w-3 h-3" /> Token: {DAILY_ASSESSMENT_CONFIG.token}
                    </div>
                  </button>

                  {/* Sesi 1: Pre-Test (Petualangan Pecahan) */}
                  <button
                    type="button"
                    onClick={() => handleSelectSession('pre_test')}
                    className={`p-4 rounded-2xl border-2 text-left transition-all relative ${
                      selectedSession === 'pre_test'
                        ? 'border-indigo-600 bg-indigo-50/70 shadow-sm'
                        : 'border-slate-200 hover:border-slate-300 bg-slate-50/50'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-indigo-100 text-indigo-700">
                        Sesi Pembuka
                      </span>
                      {selectedSession === 'pre_test' && (
                        <Check className="w-4 h-4 text-indigo-600 font-bold" />
                      )}
                    </div>
                    <h3 className="font-bold text-slate-900 text-sm">Pre-Test Cambridge</h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      25 Soal Cambridge dengan 5 Pos Petualangan Pecahan (Kebun, Gua, Jembatan, dsb).
                    </p>
                    <div className="mt-2 text-[11px] font-mono text-indigo-700 font-bold flex items-center gap-1">
                      <KeyRound className="w-3 h-3" /> Token: {PRETEST_CONFIG.token}
                    </div>
                  </button>
                </div>
              </div>

              {/* Exam Info Matrix */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 text-center">
                  <Clock className="w-5 h-5 text-indigo-600 mx-auto mb-1" />
                  <span className="block text-lg font-black text-slate-800">70 Menit</span>
                  <span className="text-[11px] text-slate-500 font-semibold">Durasi Ujian</span>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 text-center">
                  <Layers className="w-5 h-5 text-indigo-600 mx-auto mb-1" />
                  <span className="block text-lg font-black text-slate-800">25 Soal</span>
                  <span className="text-[11px] text-slate-500 font-semibold">6 Tipe Soal</span>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 text-center">
                  <Award className="w-5 h-5 text-indigo-600 mx-auto mb-1" />
                  <span className="block text-lg font-black text-slate-800">40 Poin</span>
                  <span className="text-[11px] text-slate-500 font-semibold">Skor Maksimal</span>
                </div>

                <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-center">
                  <ShieldAlert className="w-5 h-5 text-rose-600 mx-auto mb-1" />
                  <span className="block text-lg font-black text-rose-700">Anti-Cheat</span>
                  <span className="text-[11px] text-rose-600 font-semibold">Maks 3x Tab Switch</span>
                </div>
              </div>

              {/* Student Registration Form */}
              <form onSubmit={handleStartExam} className="space-y-4">
                <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider pb-1 border-b">
                  Data Identitas & Token Ujian
                </h3>

                {regError && (
                  <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs font-semibold text-rose-700 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 shrink-0" />
                    <span>{regError}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Nama Lengkap */}
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Nama Lengkap Siswa <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={studentName}
                      onChange={(e) => setStudentName(e.target.value)}
                      placeholder="Contoh: Nailah Sakhi Nurramadhani"
                      className="w-full text-sm font-semibold px-4 py-2.5 rounded-xl border border-slate-300 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 outline-none"
                    />
                  </div>

                  {/* Kategori Kelas */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Kelas <span className="text-rose-500">*</span>
                    </label>
                    <select
                      value={studentClass}
                      onChange={(e) =>
                        setStudentClass(e.target.value as 'VII Akademik' | 'VII Tahfidz-Middle East')
                      }
                      className="w-full text-sm font-semibold px-3 py-2.5 rounded-xl border border-slate-300 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 outline-none bg-white"
                    >
                      <option value="VII Akademik">VII Akademik</option>
                      <option value="VII Tahfidz-Middle East">VII Tahfidz-Middle East</option>
                    </select>
                  </div>

                  {/* Nomor Absen / NIS */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Nomor Absen / NIS
                    </label>
                    <input
                      type="text"
                      value={studentNis}
                      onChange={(e) => setStudentNis(e.target.value)}
                      placeholder="Contoh: 13"
                      className="w-full text-sm font-semibold px-4 py-2.5 rounded-xl border border-slate-300 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 outline-none"
                    />
                  </div>

                  {/* Kode Token Ujian */}
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center justify-between">
                      <span>Kode Token Ujian <span className="text-rose-500">*</span></span>
                      <span className="text-[11px] text-indigo-600 font-mono font-bold">
                        Gunakan: {selectedSession === 'daily_assessment' ? DAILY_ASSESSMENT_CONFIG.token : PRETEST_CONFIG.token}
                      </span>
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        required
                        value={sessionTokenInput}
                        onChange={(e) => setSessionTokenInput(e.target.value.toUpperCase())}
                        placeholder="Masukkan Token Ujian..."
                        className="w-full text-sm font-mono font-bold uppercase tracking-wider px-4 py-2.5 rounded-xl border border-slate-300 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 outline-none"
                      />
                      <KeyRound className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
                    </div>
                  </div>
                </div>

                {/* Anti-cheat declaration box */}
                <div className="rounded-xl border border-amber-200 bg-amber-50/70 p-3.5 text-xs text-amber-900 flex items-start gap-2.5">
                  <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <span className="font-bold">Ketentuan Pengawasan & Kunci Layar:</span>
                    <p className="leading-relaxed">
                      Sistem akan mengunci layar ke mode penuh dan memantau perpindahan tab browser.
                      Jika terdeteksi <strong>3 kali berpindah tab</strong>, sistem akan otomatis mengakhiri ujian dan mengumpulkan jawaban.
                    </p>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-4 px-6 rounded-2xl bg-blue-700 hover:bg-blue-800 text-white font-extrabold text-base shadow-lg shadow-blue-700/30 hover:shadow-blue-700/40 transition-all flex items-center justify-center gap-2 group cursor-pointer"
                >
                  <Maximize2 className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  Mulai {activeConfig.title} & Kunci Layar Penuh
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          SCREEN 2: ACTIVE EXAM INTERFACE
      ========================================================================= */}
      {view === 'exam' && (
        <div className="flex-1 flex flex-col">
          {/* Top Sticky Assessment Bar */}
          <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/90 shadow-xs px-4 py-3">
            <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
              {/* Student identity with Logo */}
              <div className="flex items-center gap-2.5">
                <img
                  src="/assets/aistudio/images_226422da.png"
                  alt="Logo Ar Rohmah"
                  className="w-8 h-8 object-contain rounded-full border border-slate-200"
                />
                <div>
                  <h2 className="text-xs sm:text-sm font-bold text-slate-800 line-clamp-1">
                    {studentName}
                  </h2>
                  <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-600">
                    {activeConfig.title} • {studentClass} • No: {studentNis || '-'}
                  </span>
                </div>
              </div>

              {/* 70-Minute Timer Badge */}
              <div
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl border font-mono font-bold text-sm sm:text-base transition-colors ${
                  timeLeft <= 300
                    ? 'bg-rose-50 text-rose-700 border-rose-300 animate-pulse'
                    : timeLeft <= 600
                    ? 'bg-amber-50 text-amber-700 border-amber-300'
                    : 'bg-indigo-50 text-indigo-700 border-indigo-200'
                }`}
              >
                <Clock className="w-4 h-4 shrink-0" />
                <span>{formatTimer(timeLeft)}</span>
              </div>

              {/* Anti-cheat Status & Actions */}
              <div className="flex items-center gap-2">
                <AntiCheatMonitor
                  isActive={view === 'exam'}
                  violations={violations}
                  onViolation={handleViolation}
                  onMaxViolationsReached={handleMaxViolationsReached}
                  maxViolations={3}
                />

                <button
                  type="button"
                  onClick={() => setShowSubmitModal(true)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs transition-colors"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Kumpulkan Ujian</span>
                </button>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="max-w-7xl mx-auto mt-2">
              <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                <div
                  className="bg-indigo-600 h-full rounded-full transition-all duration-300"
                  style={{ width: `${(answeredCount / activeQuestions.length) * 100}%` }}
                />
              </div>
            </div>
          </header>

          {/* Exam Content: Main Question Area + Right Question Palette */}
          <main className="max-w-7xl mx-auto w-full p-4 sm:p-6 flex-1 flex flex-col lg:flex-row gap-6">
            {/* Left Column: Question Card & Question Navigator Controls */}
            <div className="flex-1 flex flex-col gap-4">
              <QuestionCard
                question={currentQuestion}
                studentAnswer={answers[currentQuestion.id]}
                onAnswerChange={handleAnswerChange}
                questionIndex={currentQuestionIndex}
                totalQuestions={activeQuestions.length}
              />

              {/* Bottom Navigation Buttons */}
              <div className="bg-white rounded-2xl border border-slate-200/90 p-4 flex flex-wrap items-center justify-between gap-3 shadow-xs">
                <button
                  type="button"
                  disabled={currentQuestionIndex === 0}
                  onClick={() => setCurrentQuestionIndex((prev) => Math.max(0, prev - 1))}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 disabled:opacity-40 transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Sebelumnya
                </button>

                {/* Mark as Doubt/Flag */}
                <button
                  type="button"
                  onClick={() => toggleFlag(currentQuestion.id)}
                  className={`inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-bold border transition-colors ${
                    flaggedQuestions[currentQuestion.id]
                      ? 'bg-amber-100 text-amber-800 border-amber-300'
                      : 'bg-white hover:bg-slate-50 text-slate-600 border-slate-200'
                  }`}
                >
                  <Bookmark
                    className={`w-4 h-4 ${
                      flaggedQuestions[currentQuestion.id] ? 'fill-amber-600 text-amber-600' : ''
                    }`}
                  />
                  <span>
                    {flaggedQuestions[currentQuestion.id] ? 'Ditandai Ragu-Ragu' : 'Tandai Ragu-Ragu'}
                  </span>
                </button>

                {currentQuestionIndex < activeQuestions.length - 1 ? (
                  <button
                    type="button"
                    onClick={() =>
                      setCurrentQuestionIndex((prev) => Math.min(activeQuestions.length - 1, prev + 1))
                    }
                    className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm transition-all"
                  >
                    Selanjutnya
                    <ChevronRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => setShowSubmitModal(true)}
                    className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-md transition-all"
                  >
                    Selesaikan Ujian
                    <CheckCircle2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Right Column: Question Number Matrix / Palette */}
            <aside className="w-full lg:w-72 shrink-0">
              <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs sticky top-24 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Nomor Soal (25)
                  </h3>
                  <span className="text-xs font-semibold text-indigo-600">
                    {answeredCount}/25 Terjawab
                  </span>
                </div>

                {/* 5 x 5 Number Grid */}
                <div className="grid grid-cols-5 gap-2">
                  {activeQuestions.map((q, idx) => {
                    const isAnswered = isQuestionAnswered(q.id);
                    const isFlagged = flaggedQuestions[q.id];
                    const isCurrent = currentQuestionIndex === idx;

                    return (
                      <button
                        key={q.id}
                        type="button"
                        onClick={() => setCurrentQuestionIndex(idx)}
                        className={`h-10 rounded-xl font-bold text-xs flex flex-col items-center justify-center relative transition-all ${
                          isCurrent ? 'ring-2 ring-indigo-600 ring-offset-2' : ''
                        } ${
                          isFlagged
                            ? 'bg-amber-400 text-amber-950 shadow-xs'
                            : isAnswered
                            ? 'bg-indigo-600 text-white shadow-xs'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        <span>{q.id}</span>
                        {isFlagged && (
                          <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-amber-900" />
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Legend */}
                <div className="pt-3 border-t border-slate-100 space-y-1.5 text-[11px] text-slate-600 font-medium">
                  <div className="flex items-center gap-2">
                    <span className="w-3.5 h-3.5 rounded bg-indigo-600 shrink-0" />
                    <span>Sudah Dijawab ({answeredCount})</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-3.5 h-3.5 rounded bg-amber-400 shrink-0" />
                    <span>Ragu-Ragu ({Object.values(flaggedQuestions).filter(Boolean).length})</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-3.5 h-3.5 rounded bg-slate-100 border border-slate-300 shrink-0" />
                    <span>Belum Dijawab ({activeQuestions.length - answeredCount})</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setShowSubmitModal(true)}
                  className="w-full py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-sm transition-colors flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4 text-emerald-400" />
                  Kumpulkan Lembar Ujian
                </button>
              </div>
            </aside>
          </main>

          {/* Confirm Submission Modal */}
          {showSubmitModal && (
            <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
              <div className="bg-white rounded-3xl max-w-md w-full p-6 text-slate-800 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
                <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-4">
                  <HelpCircle className="w-6 h-6" />
                </div>

                <h3 className="text-lg font-bold text-slate-900 mb-1">
                  Konfirmasi Pengumpulan Ujian
                </h3>
                <p className="text-xs text-slate-500 mb-4">
                  Pastikan Anda telah memeriksa semua jawaban sebelum mengumpulkan {activeConfig.title}.
                </p>

                <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 mb-5 space-y-2 text-xs">
                  <div className="flex justify-between font-semibold">
                    <span>Soal Terjawab:</span>
                    <span className="text-indigo-600 font-bold">{answeredCount} dari 25</span>
                  </div>
                  <div className="flex justify-between font-semibold">
                    <span>Soal Belum Dijawab:</span>
                    <span className={25 - answeredCount > 0 ? 'text-rose-600 font-bold' : 'text-slate-500'}>
                      {25 - answeredCount} soal
                    </span>
                  </div>
                  <div className="flex justify-between font-semibold">
                    <span>Catatan Pelanggaran Tab:</span>
                    <span className={violations > 0 ? 'text-amber-600 font-bold' : 'text-emerald-600 font-bold'}>
                      {violations} pelanggaran
                    </span>
                  </div>
                </div>

                {25 - answeredCount > 0 && (
                  <p className="text-xs text-amber-700 bg-amber-50 p-2.5 rounded-xl border border-amber-200 mb-4 font-medium">
                    ⚠️ Masih ada {25 - answeredCount} nomor soal yang belum Anda jawab. Anda yakin ingin mengumpulkan sekarang?
                  </p>
                )}

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setShowSubmitModal(false)}
                    className="flex-1 py-2.5 px-4 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
                  >
                    Periksa Kembali
                  </button>
                  <button
                    type="button"
                    onClick={() => handleFinishExam(false, false)}
                    className="flex-1 py-2.5 px-4 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-md transition-colors"
                  >
                    Ya, Kumpulkan Sekarang
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* =========================================================================
          SCREEN 3: STUDENT RESULT PDF VIEW
      ========================================================================= */}
      {view === 'result' && activeSubmission && (
        <StudentResultPdf
          submission={activeSubmission}
          onBackToHome={() => {
            setView('register');
            setStudentName('');
            setStudentNis('');
          }}
          onOpenTeacherDashboard={() => setShowTeacherPinModal(true)}
        />
      )}

      {/* =========================================================================
          GLOBAL MODALS: TEACHER PIN & TEACHER DASHBOARD
      ========================================================================= */}
      <TeacherPinModal
        isOpen={showTeacherPinModal}
        onClose={() => setShowTeacherPinModal(false)}
        onSuccess={() => {
          setShowTeacherPinModal(false);
          setShowTeacherDashboard(true);
        }}
      />

      {showTeacherDashboard && (
        <TeacherDashboard
          submissions={submissions}
          liveStudents={liveStudents}
          onViewStudentPdf={(sub) => {
            setActiveSubmission(sub);
            setView('result');
            setShowTeacherDashboard(false);
          }}
          onDeleteSubmission={(id) => {
            setSubmissions((prev) => prev.filter((s) => s.id !== id));
          }}
          onUpdateSubmission={(updated) => {
            setSubmissions((prev) => prev.map((s) => (s.id === updated.id ? updated : s)));
          }}
          onResetStudentViolations={handleResetStudentViolations}
          onAddStudentTime={handleAddStudentTime}
          onLoadDemoData={handleLoadDemoData}
          onClose={() => setShowTeacherDashboard(false)}
        />
      )}
    </div>
  );
}
