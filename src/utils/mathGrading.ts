import { ExamSubmission, Question, QuestionEvaluation, StudentAnswers } from '../types/quiz';
import { QUESTIONS_DATA, EXAM_METADATA } from '../data/questions';

export function evaluateExam(
  studentName: string,
  studentClass: 'VII Akademik' | 'VII Tahfidz-Middle East',
  studentNis: string,
  answers: StudentAnswers,
  tabViolations: number,
  violationLogs: { time: string; reason: string }[],
  durationSeconds: number,
  options?: {
    autoSubmittedDueToCheating?: boolean;
    autoSubmittedDueToTimeout?: boolean;
    teacherNotes?: string;
  }
): ExamSubmission {
  const evaluations: QuestionEvaluation[] = [];
  let totalScore = 0;
  let objectiveScore = 0;
  let essayScore = 0;

  const indicatorScores: { [indicator: string]: { score: number; max: number } } = {};

  QUESTIONS_DATA.forEach((q) => {
    if (!indicatorScores[q.indicator]) {
      indicatorScores[q.indicator] = { score: 0, max: 0 };
    }
    indicatorScores[q.indicator].max += q.maxPoints;

    const studentAns = answers[q.id];
    let score = 0;
    let isCorrect = false;
    let studentAnswerDisplay = '-';
    let feedback = '';

    if (q.type === 'mcq') {
      const selected = typeof studentAns === 'string' ? studentAns : '';
      studentAnswerDisplay = selected
        ? `${selected}. ${q.options?.find((o) => o.label === selected)?.text || ''}`
        : 'Tidak dijawab';
      if (selected === q.correctAnswer) {
        score = q.maxPoints;
        isCorrect = true;
        feedback = 'Jawaban benar (+1)';
      } else {
        score = 0;
        feedback = selected ? 'Jawaban belum tepat' : 'Tidak dijawab';
      }
      objectiveScore += score;
    } else if (q.type === 'complex') {
      const selectedArr: string[] = Array.isArray(studentAns) ? studentAns : [];
      studentAnswerDisplay = selectedArr.length > 0
        ? selectedArr.sort().map((code) => `${code} (${q.options?.find((o) => o.label === code)?.text})`).join(', ')
        : 'Tidak dijawab';

      const correctSet = new Set(q.correctAnswers || []);
      const hasWrongChoice = selectedArr.some((code) => !correctSet.has(code));
      const correctSelectedCount = selectedArr.filter((code) => correctSet.has(code)).length;

      if (!hasWrongChoice && correctSelectedCount === correctSet.size && selectedArr.length > 0) {
        score = 2;
        isCorrect = true;
        feedback = 'Semua pilihan benar (+2)';
      } else if (!hasWrongChoice && correctSelectedCount > 0) {
        score = 1;
        feedback = `Sebagian benar (${correctSelectedCount}/${correctSet.size}) tanpa pilihan salah (+1)`;
      } else {
        score = 0;
        feedback = hasWrongChoice ? 'Terdapat opsi yang keliru (0 poin)' : 'Tidak dijawab';
      }
      objectiveScore += score;
    } else if (q.type === 'true_false') {
      const ansObj = typeof studentAns === 'object' && studentAns !== null ? studentAns : {};
      const statements = q.statements || [];
      let correctCount = 0;
      const displayParts: string[] = [];

      statements.forEach((st) => {
        const userChoice = ansObj[st.id];
        displayParts.push(`${st.label}: ${userChoice || '-'}`);
        if (userChoice === st.correctAnswer) {
          correctCount++;
        }
      });

      studentAnswerDisplay = displayParts.join(' | ');

      if (correctCount === statements.length) {
        score = 2;
        isCorrect = true;
        feedback = 'Ketiga pernyataan benar (+2)';
      } else if (correctCount === 2) {
        score = 1;
        feedback = 'Dua pernyataan benar (+1)';
      } else {
        score = 0;
        feedback = `Hanya ${correctCount} pernyataan yang tepat (0 poin)`;
      }
      objectiveScore += score;
    } else if (q.type === 'classification') {
      const classObj = typeof studentAns === 'object' && studentAns !== null ? studentAns : {};
      const items = q.classificationItems || [];
      let correctCount = 0;
      const displayParts: string[] = [];

      items.forEach((item) => {
        const userCat = classObj[item.id];
        displayParts.push(`${item.label}(${item.text}) -> ${userCat || 'Belum dipilih'}`);
        if (userCat === item.correctCategory) {
          correctCount++;
        }
      });

      studentAnswerDisplay = displayParts.join('; ');

      if (correctCount === items.length) {
        score = 2;
        isCorrect = true;
        feedback = 'Semua 6 pengelompokan tepat (+2)';
      } else if (correctCount >= 4) {
        score = 1;
        feedback = `${correctCount} dari 6 pengelompokan tepat (+1)`;
      } else {
        score = 0;
        feedback = `Hanya ${correctCount} tepat (kurang dari 4 tepat, 0 poin)`;
      }
      objectiveScore += score;
    } else if (q.type === 'matching') {
      const matchObj = typeof studentAns === 'object' && studentAns !== null ? studentAns : {};
      const pairs = q.matchingPairs || [];
      let correctCount = 0;
      const displayParts: string[] = [];

      pairs.forEach((pair) => {
        const chosenCode = matchObj[pair.id];
        const choiceText = q.matchingChoices?.find((c) => c.code === chosenCode)?.text || '';
        displayParts.push(`${pair.num}. ${pair.question} -> ${chosenCode || '-'}${choiceText ? ` (${choiceText})` : ''}`);
        if (chosenCode === pair.correctCode) {
          correctCount++;
        }
      });

      studentAnswerDisplay = displayParts.join(' | ');

      const totalPairs = pairs.length;
      const half = totalPairs === 4 ? 2 : 2; // min 2
      if (correctCount === totalPairs) {
        score = 2;
        isCorrect = true;
        feedback = `Semua ${totalPairs} pasangan benar (+2)`;
      } else if (correctCount >= half) {
        score = 1;
        feedback = `${correctCount} dari ${totalPairs} pasangan benar (+1)`;
      } else {
        score = 0;
        feedback = `Hanya ${correctCount} benar (0 poin)`;
      }
      objectiveScore += score;
    } else if (q.type === 'fill') {
      const textAns = typeof studentAns === 'string' ? studentAns.trim() : '';
      studentAnswerDisplay = textAns || 'Tidak dijawab';

      const norm = textAns.toLowerCase().replace(/\s+/g, ' ').replace(',', '.');
      const isMatch = (q.expectedKeywords || []).some((kw) => {
        const kwNorm = kw.toLowerCase().replace(/\s+/g, ' ').replace(',', '.');
        return norm === kwNorm || norm.includes(kwNorm);
      });

      if (isMatch) {
        score = 1;
        isCorrect = true;
        feedback = 'Jawaban akhir tepat (+1)';
      } else {
        score = 0;
        feedback = textAns ? 'Jawaban belum tepat' : 'Tidak dijawab';
      }
      essayScore += score;
    } else if (q.type === 'essay') {
      const essayObj = typeof studentAns === 'object' && studentAns !== null
        ? studentAns
        : { answer: typeof studentAns === 'string' ? studentAns : '', steps: '' };

      const finalAns = (essayObj.answer || '').trim();
      const steps = (essayObj.steps || '').trim();
      studentAnswerDisplay = `Jawaban: ${finalAns || '-'}\nLangkah:\n${steps || '(Langkah tidak disertakan)'}`;

      const combined = `${finalAns} ${steps}`.toLowerCase().replace(',', '.');
      const hasCorrectFinal = (q.expectedKeywords || []).some((kw) =>
        combined.includes(kw.toLowerCase().replace(',', '.'))
      );

      const hasSteps = steps.length > 10;

      if (hasCorrectFinal && hasSteps) {
        score = 2;
        isCorrect = true;
        feedback = 'Lengkap dan tepat: langkah runtut dan hasil akhir sesuai (+2)';
      } else if (hasCorrectFinal || hasSteps) {
        score = 1;
        feedback = hasCorrectFinal
          ? 'Hasil akhir tepat namun langkah kurang lengkap (+1)'
          : 'Langkah pengerjaan tercatat namun hasil akhir belum tepat (+1)';
      } else {
        score = 0;
        feedback = finalAns || steps ? 'Belum tepat sesuai rubrik (0 poin)' : 'Tidak dijawab';
      }
      essayScore += score;
    }

    totalScore += score;
    indicatorScores[q.indicator].score += score;

    evaluations.push({
      questionId: q.id,
      score,
      maxScore: q.maxPoints,
      isCorrect,
      studentAnswerDisplay,
      correctAnswerDisplay: q.modelAnswer,
      explanation: q.explanation,
      rubric: q.rubric,
      feedback,
    });
  });

  const finalGrade = Math.round((totalScore / EXAM_METADATA.maxScore) * 100);
  const passed = finalGrade >= EXAM_METADATA.kkm;

  let category: 'Sangat Baik' | 'Baik' | 'Cukup' | 'Perlu Bimbingan';
  let categoryDescription: string;

  if (totalScore >= 35) {
    category = 'Sangat Baik';
    categoryDescription = 'Memahami konsep dan operasi pecahan, desimal, persen, dan notasi ilmiah. Mampu menyelesaikan berbagai tipe soal, termasuk soal cerita bertahap.';
  } else if (totalScore >= 29) {
    category = 'Baik';
    categoryDescription = 'Menguasai sebagian besar konsep. Kesalahan kecil muncul pada soal kompleks atau uraian.';
  } else if (totalScore >= 24) {
    category = 'Cukup';
    categoryDescription = 'Menguasai operasi dasar, tetapi masih ragu pada penyamaan penyebut, pengelompokan, atau soal cerita.';
  } else {
    category = 'Perlu Bimbingan';
    categoryDescription = 'Konsep dasar belum kuat. Diperlukan pengulangan materi dengan alat peraga dan gambar.';
  }

  const minutes = Math.floor(durationSeconds / 60);
  const seconds = durationSeconds % 60;
  const durationFormatted = `${minutes} menit ${seconds < 10 ? '0' : ''}${seconds} detik`;

  const submission: ExamSubmission = {
    id: `sub_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    studentName: studentName || 'Siswa SMP Ar Rohmah',
    studentClass: studentClass,
    studentNis: studentNis || '-',
    totalScore,
    maxTotalScore: EXAM_METADATA.maxScore,
    finalGrade,
    passed,
    category,
    categoryDescription,
    tabViolations,
    violationLogs,
    durationSeconds,
    durationFormatted,
    submittedAt: new Date().toLocaleString('id-ID', {
      dateStyle: 'medium',
      timeStyle: 'short',
    }),
    autoSubmittedDueToCheating: !!options?.autoSubmittedDueToCheating,
    autoSubmittedDueToTimeout: !!options?.autoSubmittedDueToTimeout,
    answers,
    evaluations,
    objectiveScore,
    essayScore,
    indicatorScores,
    teacherNotes: options?.teacherNotes || '',
  };

  return submission;
}
