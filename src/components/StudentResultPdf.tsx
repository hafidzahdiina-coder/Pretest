import React from 'react';
import { ExamSubmission } from '../types/quiz';
import { QUESTIONS_DATA, EXAM_METADATA } from '../data/questions';
import {
  Printer,
  ShieldCheck,
  ShieldAlert,
  CheckCircle2,
  XCircle,
  HelpCircle,
  ArrowLeft,
  Award,
  Clock,
  User,
  School,
} from 'lucide-react';

interface StudentResultPdfProps {
  submission: ExamSubmission;
  onBackToHome?: () => void;
  onOpenTeacherDashboard?: () => void;
}

export const StudentResultPdf: React.FC<StudentResultPdfProps> = ({
  submission,
  onBackToHome,
  onOpenTeacherDashboard,
}) => {
  const handlePrint = () => {
    window.print();
  };

  const isPassed = submission.passed;

  return (
    <div className="min-h-screen bg-slate-100/70 py-6 px-3 sm:px-6 print:p-0 print:bg-white text-slate-900">
      {/* Top Floating Action Bar (Hidden on print) */}
      <div className="max-w-4xl mx-auto mb-6 flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-2xl shadow-sm border border-slate-200 print:hidden">
        <div className="flex items-center gap-2">
          {onBackToHome && (
            <button
              type="button"
              onClick={onBackToHome}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Kembali
            </button>
          )}
          <span className="text-xs text-slate-500 font-medium">
            Dokumen Hasil Asesmen Resmi
          </span>
        </div>

        <div className="flex items-center gap-2">
          {onOpenTeacherDashboard && (
            <button
              type="button"
              onClick={onOpenTeacherDashboard}
              className="px-3.5 py-2 rounded-xl text-xs font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 transition-colors"
            >
              Dashboard Guru
            </button>
          )}
          <button
            type="button"
            onClick={handlePrint}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm transition-all"
          >
            <Printer className="w-4 h-4" />
            Cetak / Download PDF
          </button>
        </div>
      </div>

      {/* Main Official Document Container (Designed to match the uploaded assessment result PDF) */}
      <div className="max-w-4xl mx-auto bg-white rounded-2xl sm:border border-slate-200 shadow-sm p-6 sm:p-10 print:p-4 print:border-none print:shadow-none print:max-w-none">
        {/* Document Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-200 text-xs text-slate-500 gap-1 mb-6">
          <div className="flex items-center gap-2 font-medium">
            <School className="w-4 h-4 text-indigo-600" />
            <span>{EXAM_METADATA.school}</span>
            <span>•</span>
            <span>{EXAM_METADATA.subtitle}</span>
          </div>
          <div>{submission.submittedAt}</div>
        </div>

        {/* Student Profile & Final Grade Banner (Exact replica of Nailah Sakhi card in the screenshot) */}
        <div className="rounded-2xl border border-slate-200/90 bg-slate-50/50 p-5 sm:p-6 mb-8 relative">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            {/* Left: Student Identity */}
            <div className="space-y-3">
              <span className="text-[11px] font-extrabold uppercase tracking-widest text-slate-500">
                HASIL ASESMEN HARIAN SISWA
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                {submission.studentName}
              </h1>

              <div className="flex flex-wrap items-center gap-2 pt-1 text-xs sm:text-sm">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white border border-slate-200 text-slate-700 font-semibold shadow-xs">
                  <User className="w-3.5 h-3.5 text-indigo-600" />
                  Kelas: {submission.studentClass}
                </span>

                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white border border-slate-200 text-slate-700 font-semibold shadow-xs">
                  No/NIS: {submission.studentNis}
                </span>

                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white border border-slate-200 text-slate-700 font-semibold shadow-xs">
                  <Clock className="w-3.5 h-3.5 text-slate-500" />
                  Durasi: {submission.durationFormatted}
                </span>
              </div>
            </div>

            {/* Right: Score Card Box */}
            <div className="sm:border-l sm:border-slate-200 sm:pl-8 flex flex-col items-start sm:items-center justify-center min-w-[170px]">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-0.5">
                NILAI AKHIR
              </span>
              <div
                className={`text-5xl font-black tracking-tight ${
                  isPassed ? 'text-emerald-600' : 'text-rose-600'
                }`}
              >
                {submission.finalGrade}
              </div>
              <div className="text-xs text-slate-500 font-medium mt-1">
                KKM: {EXAM_METADATA.kkm} • Skor: {submission.totalScore}/{submission.maxTotalScore}
              </div>
              <div
                className={`mt-2.5 px-3.5 py-1 rounded-full text-xs font-black uppercase tracking-wider ${
                  isPassed
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                    : 'bg-rose-100 text-rose-800 border border-rose-300'
                }`}
              >
                {isPassed ? 'TUNTAS / LULUS' : 'BELUM TUNTAS'}
              </div>
            </div>
          </div>
        </div>

        {/* 3 Metric Summary Boxes (Like page 1 of uploaded screenshot) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          {/* Box 1: Pilihan Ganda & Objektif */}
          <div className="rounded-xl border border-slate-200 p-4 bg-white shadow-xs">
            <div className="flex items-center justify-between text-xs text-slate-500 font-bold mb-2">
              <span>Pilihan Ganda & Objektif (32 Poin)</span>
              <span className="px-2 py-0.5 rounded bg-sky-100 text-sky-800 font-mono text-[10px]">
                PG
              </span>
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-3xl font-black text-slate-900">
                {Math.round((submission.objectiveScore / 32) * 100)}
              </span>
              <span className="text-xs text-slate-500 font-semibold">
                ({submission.objectiveScore}/32 Poin)
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Bagian A, B, C, D, E (20 Soal)
            </p>
          </div>

          {/* Box 2: Uraian & Isian */}
          <div className="rounded-xl border border-slate-200 p-4 bg-white shadow-xs">
            <div className="flex items-center justify-between text-xs text-slate-500 font-bold mb-2">
              <span>Isian & Uraian (8 Poin)</span>
              <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-mono text-[10px]">
                ES
              </span>
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-3xl font-black text-slate-900">
                {Math.round((submission.essayScore / 8) * 100)}
              </span>
              <span className="text-xs text-slate-500 font-semibold">
                ({submission.essayScore}/8 Poin)
              </span>
            </div>
            <p className="text-xs text-emerald-600 font-semibold mt-1 flex items-center gap-1">
              ✨ Dinilai Otomatis & Rubrik
            </p>
          </div>

          {/* Box 3: Catatan Integritas */}
          <div
            className={`rounded-xl border p-4 shadow-xs ${
              submission.tabViolations === 0
                ? 'border-slate-200 bg-white'
                : 'border-rose-200 bg-rose-50/40'
            }`}
          >
            <div className="flex items-center justify-between text-xs text-slate-500 font-bold mb-2">
              <span>Catatan Integritas</span>
              {submission.tabViolations === 0 ? (
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
              ) : (
                <ShieldAlert className="w-4 h-4 text-rose-600" />
              )}
            </div>
            <div className="flex items-baseline gap-1.5">
              <span
                className={`text-3xl font-black ${
                  submission.tabViolations === 0 ? 'text-slate-900' : 'text-rose-600'
                }`}
              >
                {submission.tabViolations}
              </span>
              <span className="text-xs text-slate-500 font-semibold">
                Pelanggaran Tab/Layar
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              {submission.tabViolations === 0
                ? '100% Pengerjaan Tertib'
                : submission.autoSubmittedDueToCheating
                ? 'Ujian Dihentikan Otomatis (3x Pindah Tab)'
                : 'Peringatan terdeteksi'}
            </p>
          </div>
        </div>

        {/* Category Description Banner */}
        <div className="mb-8 p-4 rounded-xl border border-indigo-100 bg-indigo-50/60 text-xs sm:text-sm text-indigo-950 flex items-start gap-3">
          <Award className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold">
              Kategori Penguasaan: {submission.category} ({submission.finalGrade}/100) —{' '}
            </span>
            <span className="text-indigo-900">{submission.categoryDescription}</span>
          </div>
        </div>

        {/* Detailed Item Evaluations Header */}
        <div className="flex items-center justify-between mb-5 pb-3 border-b border-slate-200">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Rincian Evaluasi Jawaban Siswa (25 Soal)
            </h2>
            <p className="text-xs text-slate-500">
              Kunci jawaban, langkah pengerjaan, dan rubrik penskoran lembar kerja
            </p>
          </div>
          <span className="text-xs font-bold px-3 py-1 rounded-full bg-slate-100 text-slate-700">
            Total {submission.evaluations.filter((e) => e.isCorrect).length}/25 Tepat
          </span>
        </div>

        {/* List of 25 Evaluated Items (Exact style as pages 2-10 of uploaded PDF) */}
        <div className="space-y-6">
          {QUESTIONS_DATA.map((q) => {
            const ev = submission.evaluations.find((e) => e.questionId === q.id);
            const isFullScore = ev && ev.score === ev.maxScore;
            const isPartial = ev && ev.score > 0 && ev.score < ev.maxScore;

            return (
              <div
                key={q.id}
                className="rounded-2xl border border-slate-200/90 p-5 bg-white shadow-xs break-inside-avoid print:py-3 print:px-4"
              >
                {/* Question Top Row: Number & Points badge */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-7 h-7 rounded-lg bg-slate-100 border border-slate-300 text-slate-800 font-bold text-xs flex items-center justify-center shrink-0">
                      {q.id}
                    </span>
                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                      {q.sectionTitle} {q.adventurePost && `• ${q.adventurePost.name}`}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {isFullScore ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Benar (+{ev?.score})
                      </span>
                    ) : isPartial ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
                        <HelpCircle className="w-3.5 h-3.5" />
                        Sebagian (+{ev?.score}/{ev?.maxScore})
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200">
                        <XCircle className="w-3.5 h-3.5" />
                        Belum Tepat (0/{ev?.maxScore})
                      </span>
                    )}
                  </div>
                </div>

                {/* Prompt */}
                <div className="text-slate-900 font-medium text-sm sm:text-base mb-4 leading-relaxed whitespace-pre-line">
                  {q.prompt}
                </div>

                {/* Student Answer Box & Correct Answer Box */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3 text-xs sm:text-sm">
                  {/* JAWABAN ANDA */}
                  <div className="p-3 rounded-xl border border-slate-200 bg-slate-50/70">
                    <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                      JAWABAN ANDA:
                    </span>
                    <p className="font-semibold text-slate-800 whitespace-pre-line">
                      {ev?.studentAnswerDisplay || '-'}
                    </p>
                    {ev?.feedback && (
                      <p className="text-[11px] text-slate-500 mt-1 italic">
                        {ev.feedback}
                      </p>
                    )}
                  </div>

                  {/* KUNCI JAWABAN */}
                  <div className="p-3 rounded-xl border border-indigo-100 bg-indigo-50/40">
                    <span className="block text-[10px] font-bold uppercase tracking-wider text-indigo-700 mb-1">
                      KUNCI JAWABAN MODEL:
                    </span>
                    <p className="font-semibold text-indigo-950 whitespace-pre-line">
                      {ev?.correctAnswerDisplay || q.modelAnswer}
                    </p>
                  </div>
                </div>

                {/* Pembahasan & Rubrik */}
                <div className="p-3.5 rounded-xl border border-slate-100 bg-slate-50 text-xs text-slate-700 space-y-1.5">
                  <p className="font-bold text-slate-800">Pembahasan & Konsep:</p>
                  <p className="leading-relaxed whitespace-pre-line">{q.explanation}</p>
                  <p className="text-slate-500 text-[11px] pt-1 border-t border-slate-200">
                    <strong>Pedoman Penskoran:</strong> {q.rubric}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Document Footer */}
        <div className="mt-10 pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-2">
          <span>SMP Ar Rohmah Bogor IIBS • Dokumen Resmi Hasil Asesmen Harian</span>
          <span>Halaman Rekapitulasi Nilai Asesmen Matematika Kelas 7</span>
        </div>
      </div>
    </div>
  );
};
