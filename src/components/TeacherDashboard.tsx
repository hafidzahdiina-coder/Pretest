import React, { useState, useMemo } from 'react';
import { ExamSubmission, StudentLiveMonitor, SessionId } from '../types/quiz';
import { EXAM_METADATA, PRETEST_CONFIG } from '../data/questions';
import { DAILY_ASSESSMENT_CONFIG, DAILY_ASSESSMENT_TYPE2_CONFIG } from '../data/dailyAssessmentQuestions';
import {
  Users,
  Search,
  Filter,
  Eye,
  Trash2,
  Award,
  AlertTriangle,
  CheckCircle,
  FileSpreadsheet,
  PlusCircle,
  X,
  Lock,
  BarChart3,
  Edit3,
  Radio,
  Clock,
  ShieldAlert,
  ShieldCheck,
  Maximize2,
  RefreshCw,
  Plus,
  Copy,
  Check,
  KeyRound,
  ExternalLink,
} from 'lucide-react';

interface TeacherDashboardProps {
  submissions: ExamSubmission[];
  liveStudents: StudentLiveMonitor[];
  onViewStudentPdf: (sub: ExamSubmission) => void;
  onDeleteSubmission: (id: string) => void;
  onUpdateSubmission: (updated: ExamSubmission) => void;
  onResetStudentViolations?: (studentId: string) => void;
  onAddStudentTime?: (studentId: string, minutes: number) => void;
  onLoadDemoData: () => void;
  onClose: () => void;
}

export const TeacherDashboard: React.FC<TeacherDashboardProps> = ({
  submissions,
  liveStudents,
  onViewStudentPdf,
  onDeleteSubmission,
  onUpdateSubmission,
  onResetStudentViolations,
  onAddStudentTime,
  onLoadDemoData,
  onClose,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClass, setSelectedClass] = useState<string>('all');
  const [selectedSession, setSelectedSession] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [activeTab, setActiveTab] = useState<'table' | 'live' | 'indicators'>('table');
  const [editingSub, setEditingSub] = useState<ExamSubmission | null>(null);
  const [copiedToken, setCopiedToken] = useState<string | null>(null);
  const [actionNotice, setActionNotice] = useState<string>('');

  // Handle Token Copying
  const copyToClipboard = (token: string) => {
    navigator.clipboard.writeText(token);
    setCopiedToken(token);
    setTimeout(() => setCopiedToken(null), 2000);
  };

  // Filtered submissions
  const filteredSubmissions = useMemo(() => {
    return submissions.filter((sub) => {
      const matchSearch =
        sub.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sub.studentNis.toLowerCase().includes(searchTerm.toLowerCase());
      const matchClass = selectedClass === 'all' || sub.studentClass === selectedClass;
      const matchSession = selectedSession === 'all' || sub.sessionId === selectedSession;
      const matchStatus =
        selectedStatus === 'all'
          ? true
          : selectedStatus === 'passed'
          ? sub.passed
          : selectedStatus === 'failed'
          ? !sub.passed
          : selectedStatus === 'violation'
          ? sub.tabViolations > 0
          : true;

      return matchSearch && matchClass && matchSession && matchStatus;
    });
  }, [submissions, searchTerm, selectedClass, selectedSession, selectedStatus]);

  // Statistics
  const stats = useMemo(() => {
    const total = filteredSubmissions.length;
    if (total === 0) {
      return {
        total: 0,
        avgGrade: 0,
        passCount: 0,
        passRate: 0,
        maxGrade: 0,
        minGrade: 0,
        totalViolations: 0,
      };
    }

    const grades = filteredSubmissions.map((s) => s.finalGrade);
    const sum = grades.reduce((a, b) => a + b, 0);
    const passCount = filteredSubmissions.filter((s) => s.passed).length;
    const totalViolations = filteredSubmissions.reduce((sum, s) => sum + s.tabViolations, 0);

    return {
      total,
      avgGrade: Math.round(sum / total),
      passCount,
      passRate: Math.round((passCount / total) * 100),
      maxGrade: Math.max(...grades),
      minGrade: Math.min(...grades),
      totalViolations,
    };
  }, [filteredSubmissions]);

  // Indicator Analysis aggregated across submissions
  const indicatorAnalysis = useMemo(() => {
    if (filteredSubmissions.length === 0) return [];

    const map: { [indicator: string]: { totalScore: number; totalMax: number } } = {};

    filteredSubmissions.forEach((sub) => {
      Object.entries(sub.indicatorScores || {}).forEach(([ind, val]) => {
        if (!map[ind]) {
          map[ind] = { totalScore: 0, totalMax: 0 };
        }
        map[ind].totalScore += val.score;
        map[ind].totalMax += val.max;
      });
    });

    return Object.entries(map).map(([indicator, data]) => {
      const percent = data.totalMax > 0 ? Math.round((data.totalScore / data.totalMax) * 100) : 0;
      return {
        indicator,
        totalScore: data.totalScore,
        totalMax: data.totalMax,
        percent,
      };
    });
  }, [filteredSubmissions]);

  // Export CSV
  const exportToCSV = () => {
    if (filteredSubmissions.length === 0) return;

    const headers = [
      'No',
      'Sesi Ujian',
      'Nama Siswa',
      'Kelas',
      'NIS',
      'Skor Total (40)',
      'Nilai Akhir (100)',
      'Status KKM (75)',
      'Kategori',
      'Pelanggaran Tab',
      'Durasi',
      'Waktu Pengumpulan',
    ];

    const rows = filteredSubmissions.map((s, idx) => [
      idx + 1,
      `"${s.sessionTitle || (s.sessionId === 'daily_assessment' ? 'Daily Assessment' : 'Pre-Test')}"`,
      `"${s.studentName}"`,
      `"${s.studentClass}"`,
      `"${s.studentNis}"`,
      s.totalScore,
      s.finalGrade,
      s.passed ? 'TUNTAS' : 'BELUM TUNTAS',
      `"${s.category}"`,
      s.tabViolations,
      `"${s.durationFormatted}"`,
      `"${s.submittedAt}"`,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute(
      'download',
      `Rekap_Nilai_Matematika_ArRohmah_${selectedSession}_${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleTriggerDispensasi = (studentId: string, studentName: string) => {
    if (onResetStudentViolations) {
      onResetStudentViolations(studentId);
      setActionNotice(`Dispensasi berhasil: Peringatan tab untuk ${studentName} telah di-reset ke 0.`);
      setTimeout(() => setActionNotice(''), 3500);
    }
  };

  const handleTriggerTambahWaktu = (studentId: string, studentName: string) => {
    if (onAddStudentTime) {
      onAddStudentTime(studentId, 10);
      setActionNotice(`Waktu tambahan +10 Menit berhasil diberikan kepada ${studentName}.`);
      setTimeout(() => setActionNotice(''), 3500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm overflow-y-auto p-3 sm:p-6 flex flex-col justify-start">
      <div className="max-w-7xl w-full mx-auto bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-auto flex flex-col">
        {/* Top Navbar */}
        <div className="bg-slate-900 text-white px-6 py-4 flex flex-wrap items-center justify-between gap-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <img
              src="/assets/aistudio/images_226422da.png"
              alt="Logo Ar Rohmah"
              className="w-10 h-10 object-contain shrink-0 rounded-full bg-white p-0.5 shadow-sm"
            />
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold">Dashboard Guru • Rekapitulasi & Pusat Kendala</h2>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  PIN Terverifikasi
                </span>
              </div>
              <p className="text-xs text-slate-400">
                SMP Ar Rohmah Bogor • Kelas 7 Matematika (Pre-Test & Daily Assessment)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={exportToCSV}
              disabled={filteredSubmissions.length === 0}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 disabled:opacity-50 transition-colors"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
              Export CSV
            </button>

            {submissions.length === 0 && (
              <button
                type="button"
                onClick={onLoadDemoData}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow-sm transition-colors"
              >
                <PlusCircle className="w-4 h-4" />
                Muat Data Contoh
              </button>
            )}

            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              title="Tutup Dashboard"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Action Notice Bar if any */}
        {actionNotice && (
          <div className="bg-emerald-600 text-white px-6 py-2.5 text-xs font-semibold flex items-center justify-between animate-in fade-in">
            <span>✓ {actionNotice}</span>
            <button type="button" onClick={() => setActionNotice('')}>
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Content Body */}
        <div className="p-6 bg-slate-50/50 space-y-6">
          {/* Active Tokens / Kode Sesi Banner */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {/* Token Sesi Type 2 (20 Soal) */}
            <div className="bg-gradient-to-r from-cyan-900 to-blue-900 text-white p-4 rounded-2xl shadow-sm border border-cyan-700/60 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-cyan-300 block mb-0.5">
                  Type 2: Bab 2 (20 Soal)
                </span>
                <div className="flex items-center gap-2">
                  <KeyRound className="w-4 h-4 text-cyan-300" />
                  <span className="font-mono text-base font-black tracking-widest text-white">
                    {DAILY_ASSESSMENT_TYPE2_CONFIG.token}
                  </span>
                </div>
                <span className="text-[11px] text-cyan-200">20 Soal • Max 32 Poin • 60 Mnt</span>
              </div>
              <button
                type="button"
                onClick={() => copyToClipboard(DAILY_ASSESSMENT_TYPE2_CONFIG.token)}
                className="px-2.5 py-1.5 rounded-xl text-xs font-bold bg-white/10 hover:bg-white/20 border border-white/20 text-white transition-colors flex items-center gap-1"
                title="Salin Token Type 2"
              >
                {copiedToken === DAILY_ASSESSMENT_TYPE2_CONFIG.token ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" /> Tersalin
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" /> Salin
                  </>
                )}
              </button>
            </div>

            {/* Token Sesi Type 1 (25 Soal Lengkap) */}
            <div className="bg-gradient-to-r from-blue-900 to-indigo-900 text-white p-4 rounded-2xl shadow-sm border border-blue-800 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-blue-300 block mb-0.5">
                  Type 1: Bab 2 (25 Soal)
                </span>
                <div className="flex items-center gap-2">
                  <KeyRound className="w-4 h-4 text-amber-400" />
                  <span className="font-mono text-base font-black tracking-widest text-white">
                    {DAILY_ASSESSMENT_CONFIG.token}
                  </span>
                </div>
                <span className="text-[11px] text-blue-200">25 Soal • Max 40 Poin • 70 Mnt</span>
              </div>
              <button
                type="button"
                onClick={() => copyToClipboard(DAILY_ASSESSMENT_CONFIG.token)}
                className="px-2.5 py-1.5 rounded-xl text-xs font-bold bg-white/10 hover:bg-white/20 border border-white/20 text-white transition-colors flex items-center gap-1"
                title="Salin Token Type 1"
              >
                {copiedToken === DAILY_ASSESSMENT_CONFIG.token ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" /> Tersalin
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" /> Salin
                  </>
                )}
              </button>
            </div>

            {/* Token Sesi Pre-Test */}
            <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white p-4 rounded-2xl shadow-sm border border-slate-700 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block mb-0.5">
                  Pre-Test Petualangan Pecahan
                </span>
                <div className="flex items-center gap-2">
                  <KeyRound className="w-4 h-4 text-emerald-400" />
                  <span className="font-mono text-base font-black tracking-widest text-white">
                    {PRETEST_CONFIG.token}
                  </span>
                </div>
                <span className="text-[11px] text-slate-300">25 Soal • Max 40 Poin • 70 Mnt</span>
              </div>
              <button
                type="button"
                onClick={() => copyToClipboard(PRETEST_CONFIG.token)}
                className="px-2.5 py-1.5 rounded-xl text-xs font-bold bg-white/10 hover:bg-white/20 border border-white/20 text-white transition-colors flex items-center gap-1"
                title="Salin Token Pre-Test"
              >
                {copiedToken === PRETEST_CONFIG.token ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" /> Tersalin
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" /> Salin
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Summary KPI Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">
                Total Lembar Selesai
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black text-slate-900">{stats.total}</span>
                <span className="text-xs text-slate-500 font-medium">Siswa Masuk</span>
              </div>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">
                Rata-rata Nilai
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black text-indigo-600">{stats.avgGrade}</span>
                <span className="text-xs text-slate-500 font-medium">/ 100</span>
              </div>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">
                Ketuntasan (KKM 75)
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black text-emerald-600">{stats.passRate}%</span>
                <span className="text-xs text-slate-500 font-medium">({stats.passCount} Tuntas)</span>
              </div>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">
                Siswa Sedang Ujian
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black text-blue-600">{liveStudents.length}</span>
                <span className="text-xs text-slate-500 font-medium">Aktif Online</span>
              </div>
            </div>
          </div>

          {/* Tab Navigation (Table vs Live Monitoring vs Indicator Analysis) */}
          <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
            <button
              type="button"
              onClick={() => setActiveTab('table')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                activeTab === 'table'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              Rekapitulasi Nilai Siswa ({filteredSubmissions.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('live')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 ${
                activeTab === 'live'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <Radio className="w-3.5 h-3.5 animate-pulse text-amber-400" />
              Pemantauan Kendala & Progres Siswa ({liveStudents.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('indicators')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                activeTab === 'indicators'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              Analisis Daya Serap per Indikator
            </button>
          </div>

          {/* TAB 1: REKAPITULASI TABEL NILAI */}
          {activeTab === 'table' && (
            <>
              {/* Filter and Search Bar */}
              <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
                <div className="flex items-center gap-2 flex-1 min-w-[240px]">
                  <Search className="w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Cari berdasarkan nama siswa atau nomor NIS..."
                    className="w-full text-xs sm:text-sm outline-none text-slate-800 placeholder-slate-400"
                  />
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {/* Sesi Filter */}
                  <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                    <span>Sesi:</span>
                    <select
                      value={selectedSession}
                      onChange={(e) => setSelectedSession(e.target.value)}
                      className="border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-semibold bg-slate-50 text-slate-700 outline-none"
                    >
                      <option value="all">Semua Sesi</option>
                      <option value="daily_assessment_type2">Daily Assessment Type 2 (20 Soal)</option>
                      <option value="daily_assessment">Daily Assessment Type 1 (25 Soal)</option>
                      <option value="pre_test">Pre-Test Cambridge</option>
                    </select>
                  </div>

                  {/* Kelas Filter */}
                  <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                    <Filter className="w-3.5 h-3.5" />
                    <span>Kelas:</span>
                    <select
                      value={selectedClass}
                      onChange={(e) => setSelectedClass(e.target.value)}
                      className="border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-semibold bg-slate-50 text-slate-700 outline-none"
                    >
                      <option value="all">Semua Kelas</option>
                      <option value="VII Akademik">VII Akademik</option>
                      <option value="VII Tahfidz-Middle East">VII Tahfidz-Middle East</option>
                    </select>
                  </div>

                  {/* Status Filter */}
                  <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                    <span>Status:</span>
                    <select
                      value={selectedStatus}
                      onChange={(e) => setSelectedStatus(e.target.value)}
                      className="border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-semibold bg-slate-50 text-slate-700 outline-none"
                    >
                      <option value="all">Semua Nilai</option>
                      <option value="passed">Tuntas (≥ 75)</option>
                      <option value="failed">Belum Tuntas (&lt; 75)</option>
                      <option value="violation">Ada Catatan Pindah Tab</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Submissions Table */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs sm:text-sm">
                    <thead className="bg-slate-100/80 text-slate-600 uppercase text-[11px] font-bold tracking-wider border-b border-slate-200">
                      <tr>
                        <th className="py-3 px-4 w-12 text-center">No</th>
                        <th className="py-3 px-4">Nama Siswa</th>
                        <th className="py-3 px-4">Sesi & Kelas</th>
                        <th className="py-3 px-4 text-center">Skor (40)</th>
                        <th className="py-3 px-4 text-center">Nilai (100)</th>
                        <th className="py-3 px-4 text-center">Kategori</th>
                        <th className="py-3 px-4 text-center">Integritas</th>
                        <th className="py-3 px-4">Waktu Ujian</th>
                        <th className="py-3 px-4 text-center">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredSubmissions.length === 0 ? (
                        <tr>
                          <td colSpan={9} className="py-12 text-center text-slate-400">
                            {submissions.length === 0 ? (
                              <div className="space-y-3">
                                <p className="text-sm font-semibold text-slate-600">
                                  Belum ada hasil ujian yang dikumpulkan.
                                </p>
                                <button
                                  type="button"
                                  onClick={onLoadDemoData}
                                  className="px-4 py-2 rounded-xl text-xs font-bold bg-indigo-600 text-white hover:bg-indigo-700 transition-colors"
                                >
                                  Muat Data Contoh Siswa
                                </button>
                              </div>
                            ) : (
                              <p>Tidak ada data siswa yang cocok dengan filter yang dipilih.</p>
                            )}
                          </td>
                        </tr>
                      ) : (
                        filteredSubmissions.map((sub, idx) => (
                          <tr key={sub.id} className="hover:bg-slate-50 transition-colors">
                            <td className="py-3 px-4 text-center font-bold text-slate-500">
                              {idx + 1}
                            </td>
                            <td className="py-3 px-4 font-bold text-slate-900">
                              {sub.studentName}
                            </td>
                            <td className="py-3 px-4 text-slate-600">
                              <span className="font-semibold block text-indigo-700">
                                {sub.sessionId === 'daily_assessment' ? 'Daily Assessment' : 'Pre-Test'}
                              </span>
                              <span className="text-[11px] text-slate-500">
                                {sub.studentClass} • NIS: {sub.studentNis}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-center font-semibold text-slate-700">
                              {sub.totalScore} / 40
                            </td>
                            <td className="py-3 px-4 text-center">
                              <span
                                className={`text-base font-black ${
                                  sub.passed ? 'text-emerald-600' : 'text-rose-600'
                                }`}
                              >
                                {sub.finalGrade}
                              </span>
                              <span
                                className={`block text-[10px] font-bold uppercase tracking-wider ${
                                  sub.passed ? 'text-emerald-700' : 'text-rose-600'
                                }`}
                              >
                                {sub.passed ? 'Tuntas' : 'Belum'}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-center">
                              <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-700">
                                {sub.category}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-center">
                              {sub.tabViolations === 0 ? (
                                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600">
                                  <CheckCircle className="w-3.5 h-3.5" /> Bersih (0)
                                </span>
                              ) : (
                                <span
                                  className={`inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full ${
                                    sub.autoSubmittedDueToCheating
                                      ? 'bg-rose-100 text-rose-700'
                                      : 'bg-amber-100 text-amber-800'
                                  }`}
                                  title={sub.violationLogs.map((l) => `${l.time}: ${l.reason}`).join('\n')}
                                >
                                  <AlertTriangle className="w-3.5 h-3.5" />
                                  {sub.tabViolations}x Pindah Tab
                                </span>
                              )}
                            </td>
                            <td className="py-3 px-4 text-xs text-slate-500">
                              <div>{sub.submittedAt}</div>
                              <div className="text-[11px] text-slate-400">
                                Durasi: {sub.durationFormatted}
                              </div>
                            </td>
                            <td className="py-3 px-4 text-center">
                              <div className="flex items-center justify-center gap-1.5">
                                <button
                                  type="button"
                                  onClick={() => onViewStudentPdf(sub)}
                                  className="p-1.5 rounded-lg text-indigo-600 hover:bg-indigo-50 transition-colors"
                                  title="Buka Lembar PDF Siswa"
                                >
                                  <Eye className="w-4 h-4" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setEditingSub(sub)}
                                  className="p-1.5 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors"
                                  title="Catatan Guru"
                                >
                                  <Edit3 className="w-4 h-4" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => onDeleteSubmission(sub.id)}
                                  className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 transition-colors"
                                  title="Hapus Nilai"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}

          {/* TAB 2: LIVE MONITORING & PUSAT KENDALA SISWA */}
          {activeTab === 'live' && (
            <div className="space-y-4">
              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
                    <Radio className="w-4 h-4 text-blue-600 animate-pulse" />
                    Pusat Pengawasan Real-Time & Penanganan Kendala
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Memantau pergerakan tab, mode layar penuh, dan kendala teknis siswa selama ujian berlangsung.
                  </p>
                </div>
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-600">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                  <span>Sistem Pengawasan Aktif</span>
                </div>
              </div>

              {liveStudents.length === 0 ? (
                <div className="bg-white rounded-2xl border border-slate-200 p-10 text-center text-slate-500 space-y-2">
                  <Clock className="w-8 h-8 mx-auto text-slate-400" />
                  <p className="font-bold text-slate-700">Tidak ada siswa yang sedang mengerjakan ujian saat ini.</p>
                  <p className="text-xs">Siswa yang membuka halaman ujian akan langsung muncul di panel pemantauan ini.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {liveStudents.map((st) => {
                    const isWarning = st.tabViolations > 0;
                    const isCritical = st.tabViolations >= 3;

                    return (
                      <div
                        key={st.id}
                        className={`bg-white rounded-2xl border p-4 shadow-xs space-y-3 relative overflow-hidden transition-all ${
                          isCritical
                            ? 'border-rose-400 bg-rose-50/20'
                            : isWarning
                            ? 'border-amber-300 bg-amber-50/20'
                            : 'border-slate-200'
                        }`}
                      >
                        {/* Top Student Header */}
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <h4 className="font-extrabold text-sm text-slate-900">{st.studentName}</h4>
                            <p className="text-[11px] text-slate-500 font-medium">
                              {st.studentClass} • No: {st.studentNis}
                            </p>
                          </div>
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                            {st.sessionId === 'daily_assessment' ? 'Daily Assessment' : 'Pre-Test'}
                          </span>
                        </div>

                        {/* Progress and Timer */}
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div className="bg-slate-50 p-2 rounded-xl border border-slate-200/80">
                            <span className="text-[10px] text-slate-400 font-bold uppercase block">Progres</span>
                            <span className="font-bold text-slate-800">
                              Soal {st.currentQuestionIndex + 1}/25 ({st.answeredCount} Terjawab)
                            </span>
                          </div>
                          <div className="bg-slate-50 p-2 rounded-xl border border-slate-200/80">
                            <span className="text-[10px] text-slate-400 font-bold uppercase block">Sisa Waktu</span>
                            <span className="font-mono font-bold text-indigo-600">
                              {Math.floor(st.timeLeftSeconds / 60)}m {st.timeLeftSeconds % 60}s
                            </span>
                          </div>
                        </div>

                        {/* Status Badges */}
                        <div className="flex flex-wrap items-center gap-1.5 text-xs">
                          {st.tabViolations === 0 ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 font-semibold text-[11px]">
                              <ShieldCheck className="w-3.5 h-3.5" /> Integritas Tertib (0)
                            </span>
                          ) : (
                            <span
                              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg font-bold text-[11px] ${
                                isCritical
                                  ? 'bg-rose-100 text-rose-700 border border-rose-300'
                                  : 'bg-amber-100 text-amber-800 border border-amber-300'
                              }`}
                            >
                              <ShieldAlert className="w-3.5 h-3.5" /> {st.tabViolations}/3x Pindah Tab
                            </span>
                          )}

                          <span
                            className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-bold ${
                              st.isFullscreen
                                ? 'bg-sky-50 text-sky-700 border border-sky-200'
                                : 'bg-rose-50 text-rose-700 border border-rose-200'
                            }`}
                          >
                            <Maximize2 className="w-3 h-3" />
                            {st.isFullscreen ? 'Layar Penuh Terkunci' : 'Layar Tidak Penuh'}
                          </span>
                        </div>

                        {/* Emergency Teacher Controls for Trouble */}
                        <div className="pt-2 border-t border-slate-100 flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleTriggerDispensasi(st.id, st.studentName)}
                            className="flex-1 py-1.5 px-2 rounded-lg bg-amber-50 hover:bg-amber-100 border border-amber-300 text-amber-800 text-[11px] font-bold transition-colors flex items-center justify-center gap-1"
                            title="Reset hitungan pelanggaran jika ada kendala sistem"
                          >
                            <RefreshCw className="w-3 h-3" />
                            Reset Tab
                          </button>

                          <button
                            type="button"
                            onClick={() => handleTriggerTambahWaktu(st.id, st.studentName)}
                            className="flex-1 py-1.5 px-2 rounded-lg bg-blue-50 hover:bg-blue-100 border border-blue-300 text-blue-800 text-[11px] font-bold transition-colors flex items-center justify-center gap-1"
                            title="Beri tambahan 10 menit jika perangkat siswa terkendala"
                          >
                            <Plus className="w-3 h-3" />
                            +10 Menit
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: ANALISIS DAYA SERAP PER INDIKATOR */}
          {activeTab === 'indicators' && (
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-5">
              <div>
                <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-indigo-600" />
                  Analisis Ketercapaian Indikator Kompetensi (Rubrik Analitik Guru)
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Standar ketuntasan indikator minimal 66,7% (2/3 dari total poin indikator).
                </p>
              </div>

              <div className="space-y-4">
                {indicatorAnalysis.map((ind) => {
                  const isIndPassed = ind.percent >= 67;
                  return (
                    <div key={ind.indicator} className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs sm:text-sm font-semibold">
                        <span className="text-slate-800">{ind.indicator}</span>
                        <span className="font-bold">
                          {ind.percent}%{' '}
                          <span
                            className={`ml-1.5 px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                              isIndPassed ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            {isIndPassed ? 'Tuntas' : 'Perlu Penguatan'}
                          </span>
                        </span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            isIndPassed ? 'bg-emerald-500' : 'bg-amber-500'
                          }`}
                          style={{ width: `${ind.percent}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Teacher Note & Edit Modal */}
        {editingSub && (
          <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-lg w-full p-6 text-slate-800 shadow-2xl border border-slate-200 space-y-4">
              <div className="flex items-center justify-between border-b pb-3">
                <h3 className="text-base font-bold">Catatan Guru: {editingSub.studentName}</h3>
                <button
                  type="button"
                  onClick={() => setEditingSub(null)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase mb-1">
                  Catatan Evaluasi / Rekomendasi Guru:
                </label>
                <textarea
                  rows={4}
                  value={editingSub.teacherNotes || ''}
                  onChange={(e) => setEditingSub({ ...editingSub, teacherNotes: e.target.value })}
                  placeholder="Misal: Perlu latihan lebih banyak pada materi notasi ilmiah pangkat negatif..."
                  className="w-full text-xs sm:text-sm p-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingSub(null)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200"
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onUpdateSubmission(editingSub);
                    setEditingSub(null);
                  }}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm"
                >
                  Simpan Catatan
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
