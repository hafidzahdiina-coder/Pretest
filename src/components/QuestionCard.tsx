import React from 'react';
import { Question } from '../types/quiz';
import { AdventureIllustration } from './AdventureIllustrations';
import { RealIllustration } from './RealIllustrations';
import { MathText } from './MathText';
import { Check, Info, HelpCircle } from 'lucide-react';

interface QuestionCardProps {
  question: Question;
  studentAnswer: any;
  onAnswerChange: (questionId: number, answer: any) => void;
  questionIndex: number;
  totalQuestions: number;
}

export const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  studentAnswer,
  onAnswerChange,
  questionIndex,
  totalQuestions,
}) => {
  // Helper to update student answer
  const setAnswer = (val: any) => {
    onAnswerChange(question.id, val);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-5 sm:p-7 transition-all">
      {/* Header Info */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 mb-4 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <span className="w-8 h-8 rounded-xl bg-indigo-600 text-white font-black text-sm flex items-center justify-center shadow-sm">
            {question.id}
          </span>
          <div>
            <h3 className="text-sm font-bold text-slate-800">{question.sectionTitle}</h3>
            <p className="text-xs text-slate-500">Soal {questionIndex + 1} dari {totalQuestions}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-100">
            {question.maxPoints} Poin
          </span>
        </div>
      </div>

      {/* Real-life Illustrations for Daily Assessment */}
      {question.realIllustrationId && (
        <div className="mb-6">
          <RealIllustration id={question.realIllustrationId} />
        </div>
      )}

      {/* Adventure Illustration if this question belongs to an Adventure Post */}
      {question.adventurePost && (
        <div className="mb-6">
          <AdventureIllustration postId={question.adventurePost.id} />
        </div>
      )}

      {/* Question Prompt with mathematical equation formatting */}
      <div className="mb-6">
        <div className="text-slate-900 font-semibold text-base sm:text-lg leading-relaxed whitespace-pre-line">
          <MathText text={question.prompt} />
        </div>
        <p className="text-xs text-slate-500 mt-2 italic flex items-center gap-1.5">
          <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
          {question.sectionInstruction}
        </p>
      </div>

      {/* INTERACTIVE CONTROLS BASED ON QUESTION TYPE */}

      {/* 1. Standard MCQ */}
      {question.type === 'mcq' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {(question.options || []).map((opt) => {
            const isSelected = studentAnswer === opt.label;
            return (
              <button
                key={opt.label}
                type="button"
                onClick={() => setAnswer(opt.label)}
                className={`flex items-center gap-3 p-3.5 rounded-xl border-2 text-left transition-all ${
                  isSelected
                    ? 'border-indigo-600 bg-indigo-50/80 text-indigo-950 font-semibold shadow-sm'
                    : 'border-slate-200 hover:border-slate-300 bg-slate-50/50 text-slate-700'
                }`}
              >
                <span
                  className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 transition-colors ${
                    isSelected ? 'bg-indigo-600 text-white' : 'bg-white border border-slate-300 text-slate-600'
                  }`}
                >
                  {opt.label}
                </span>
                <span className="text-sm sm:text-base font-medium">
                  <MathText text={opt.text} />
                </span>
              </button>
            );
          })}
        </div>
      )}

      {/* 2. Complex MCQ (Checkboxes) */}
      {question.type === 'complex' && (
        <div className="space-y-2.5">
          {(question.options || []).map((opt) => {
            const currentSelected: string[] = Array.isArray(studentAnswer) ? studentAnswer : [];
            const isChecked = currentSelected.includes(opt.label);

            const toggleChoice = () => {
              if (isChecked) {
                setAnswer(currentSelected.filter((c) => c !== opt.label));
              } else {
                setAnswer([...currentSelected, opt.label]);
              }
            };

            return (
              <button
                key={opt.label}
                type="button"
                onClick={toggleChoice}
                className={`w-full flex items-center gap-3.5 p-3.5 rounded-xl border-2 text-left transition-all ${
                  isChecked
                    ? 'border-indigo-600 bg-indigo-50/70 text-indigo-950 font-semibold shadow-sm'
                    : 'border-slate-200 hover:border-slate-300 bg-slate-50/40 text-slate-700'
                }`}
              >
                <div
                  className={`w-6 h-6 rounded-md flex items-center justify-center shrink-0 border transition-colors ${
                    isChecked ? 'bg-indigo-600 border-indigo-600 text-white' : 'border-slate-400 bg-white'
                  }`}
                >
                  {isChecked && <Check className="w-4 h-4 stroke-[3]" />}
                </div>
                <div className="flex items-center gap-2 text-sm sm:text-base">
                  <span className="font-bold text-indigo-600">[{opt.label}]</span>
                  <span>
                    <MathText text={opt.text} />
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      )}

      {/* 3. True / False */}
      {question.type === 'true_false' && (
        <div className="overflow-x-auto rounded-xl border border-slate-200 shadow-xs">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-100 text-slate-700 uppercase text-xs font-bold tracking-wider">
              <tr>
                <th className="py-3 px-4 w-12 text-center">No</th>
                <th className="py-3 px-4">Pernyataan</th>
                <th className="py-3 px-4 w-40 text-center">Pilihan Jawaban</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {(question.statements || []).map((st) => {
                const currentVals = typeof studentAnswer === 'object' && studentAnswer !== null ? studentAnswer : {};
                const chosen = currentVals[st.id];

                return (
                  <tr key={st.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-4 text-center font-bold text-slate-600">{st.label}.</td>
                    <td className="py-3 px-4 font-medium text-slate-800">
                      <MathText text={st.text} />
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          type="button"
                          onClick={() => setAnswer({ ...currentVals, [st.id]: 'B' })}
                          className={`px-3 py-1.5 rounded-lg font-bold text-xs transition-all ${
                            chosen === 'B'
                              ? 'bg-emerald-600 text-white shadow-sm ring-2 ring-emerald-300'
                              : 'bg-slate-100 text-slate-600 hover:bg-emerald-50 hover:text-emerald-700'
                          }`}
                        >
                          Benar (B)
                        </button>
                        <button
                          type="button"
                          onClick={() => setAnswer({ ...currentVals, [st.id]: 'S' })}
                          className={`px-3 py-1.5 rounded-lg font-bold text-xs transition-all ${
                            chosen === 'S'
                              ? 'bg-rose-600 text-white shadow-sm ring-2 ring-rose-300'
                              : 'bg-slate-100 text-slate-600 hover:bg-rose-50 hover:text-rose-700'
                          }`}
                        >
                          Salah (S)
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* 4. Classification / Grouping */}
      {question.type === 'classification' && (
        <div className="space-y-4">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Tentukan kategori yang sesuai untuk setiap butir bilangan di bawah:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {(question.classificationItems || []).map((item) => {
              const currentVals = typeof studentAnswer === 'object' && studentAnswer !== null ? studentAnswer : {};
              const selectedCategory = currentVals[item.id];

              return (
                <div key={item.id} className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-700 text-sm">
                      {item.label}. <span className="text-indigo-600 font-mono text-base"><MathText text={item.text} /></span>
                    </span>
                    {selectedCategory && (
                      <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
                        <Check className="w-3 h-3" /> Terpilih
                      </span>
                    )}
                  </div>

                  <select
                    value={selectedCategory || ''}
                    onChange={(e) => setAnswer({ ...currentVals, [item.id]: e.target.value })}
                    className="w-full text-xs sm:text-sm font-medium py-2 px-3 rounded-lg border border-slate-300 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="">-- Pilih Kelompok --</option>
                    {(question.classificationCategories || []).map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 5. Matching */}
      {question.type === 'matching' && (
        <div className="space-y-4">
          <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-3 mb-2">
            <p className="text-xs font-bold text-amber-900 mb-1.5 uppercase tracking-wider">
              Daftar Pilihan Jawaban di Kolom Kanan:
            </p>
            <div className="flex flex-wrap gap-2 text-xs">
              {(question.matchingChoices || []).map((c) => (
                <span key={c.code} className="px-2.5 py-1 rounded-md bg-white border border-amber-300 font-medium text-amber-900 shadow-xs">
                  <strong className="text-amber-700 font-bold mr-1">{c.code}.</strong> <MathText text={c.text} />
                </span>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            {(question.matchingPairs || []).map((pair) => {
              const currentVals = typeof studentAnswer === 'object' && studentAnswer !== null ? studentAnswer : {};
              const selectedCode = currentVals[pair.id];

              return (
                <div
                  key={pair.id}
                  className="p-3 sm:p-4 rounded-xl border border-slate-200 bg-slate-50/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="flex items-start gap-2.5">
                    <span className="w-6 h-6 rounded-full bg-slate-200 text-slate-700 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                      {pair.num}
                    </span>
                    <span className="text-sm sm:text-base font-semibold text-slate-800">
                      <MathText text={pair.question} />
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-slate-500 whitespace-nowrap">Jodohkan ke:</span>
                    <select
                      value={selectedCode || ''}
                      onChange={(e) => setAnswer({ ...currentVals, [pair.id]: e.target.value })}
                      className="text-xs sm:text-sm font-bold py-1.5 px-3 rounded-lg border border-slate-300 bg-white text-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="">Pilih Huruf...</option>
                      {(question.matchingChoices || []).map((c) => (
                        <option key={c.code} value={c.code}>
                          Pilihan {c.code} ({c.text})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 6. Fill (Isian Singkat) */}
      {question.type === 'fill' && (
        <div className="space-y-3">
          <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider">
            Tulis Jawaban Akhir:
          </label>
          <div className="max-w-md">
            <input
              type="text"
              value={typeof studentAnswer === 'string' ? studentAnswer : ''}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="Contoh: 2 2/3 atau 8/3"
              className="w-full text-base sm:text-lg font-mono font-bold px-4 py-3 rounded-xl border-2 border-slate-300 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 outline-none transition-all"
            />
          </div>
          <p className="text-xs text-slate-400">
            * Tips: Tuliskan pecahan dalam bentuk paling sederhana (contoh: 2 1/4 atau 9/4).
          </p>
        </div>
      )}

      {/* 7. Essay (Uraian dengan Langkah Pengerjaan) */}
      {question.type === 'essay' && (
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Jawaban Akhir:
            </label>
            <input
              type="text"
              value={studentAnswer?.answer || (typeof studentAnswer === 'string' ? studentAnswer : '')}
              onChange={(e) => {
                const prevSteps = studentAnswer?.steps || '';
                setAnswer({ answer: e.target.value, steps: prevSteps });
              }}
              placeholder="Contoh: 37,5% atau 1 11/16 ton"
              className="w-full max-w-sm text-sm sm:text-base font-bold font-mono px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Langkah Penyelesaian / Pengerjaan Runtut:
            </label>
            <textarea
              rows={4}
              value={studentAnswer?.steps || ''}
              onChange={(e) => {
                const prevAns = studentAnswer?.answer || '';
                setAnswer({ answer: prevAns, steps: e.target.value });
              }}
              placeholder="Tuliskan langkah perhitunganmu di sini secara terperinci (misal: 1) Jumlah awal = ..., 2) Operasi hitung = ..., 3) Hasil = ...)"
              className="w-full text-sm font-mono px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 outline-none transition-all leading-relaxed"
            />
          </div>
        </div>
      )}
    </div>
  );
};
