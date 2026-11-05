import { ExamSubmission } from '../types/quiz';
import { evaluateExam } from '../utils/mathGrading';

export function getSampleSubmissions(): ExamSubmission[] {
  // 1. Nailah Sakhi Nurramadhani - Daily Assessment Bab 2 (High Scorer - 95)
  const answersDaily1: Record<number, any> = {
    1: 'B',
    2: 'C',
    3: 'A',
    4: 'D',
    5: 'C',
    6: 'D',
    7: 'B',
    8: 'C',
    9: ['A', 'C', 'D'],
    10: ['A', 'C', 'D'],
    11: ['A', 'C', 'E'],
    12: { '12a': 'S', '12b': 'B', '12c': 'B' },
    13: { '13a': 'B', '13b': 'B', '13c': 'S' },
    14: { '14a': 'B', '14b': 'S', '14c': 'B' },
    15: {
      '15a': 'Kurang dari 1/3',
      '15b': 'Sama dengan 1/3',
      '15c': 'Lebih dari 1/3',
      '15d': 'Sama dengan 1/3',
      '15e': 'Kurang dari 1/3',
      '15f': 'Lebih dari 1/3',
    },
    16: {
      '16a': 'Pecahan tak wajar',
      '16b': 'Bilangan campuran',
      '16c': 'Pecahan wajar',
      '16d': 'Pecahan tak wajar',
      '16e': 'Bilangan campuran',
      '16f': 'Pecahan wajar',
    },
    17: {
      '17a': 'Pangkat positif (n > 0)',
      '17b': 'Pangkat negatif (n < 0)',
      '17c': 'Pangkat positif (n > 0)',
      '17d': 'Pangkat negatif (n < 0)',
      '17e': 'Pangkat positif (n > 0)',
      '17f': 'Pangkat negatif (n < 0)',
    },
    18: { '18_1': 'D', '18_2': 'A', '18_3': 'C', '18_4': 'B' },
    19: { '19_1': 'D', '19_2': 'C', '19_3': 'A', '19_4': 'B' },
    20: { '20_1': 'B', '20_2': 'A', '20_3': 'C' },
    21: '90 km',
    22: '4 7/12',
    23: { answer: '30 siswa', steps: '5/6 x 36 = 180/6 = 30 siswa perempuan.' },
    24: { answer: '3/5, 61%, 0,62, 5/8', steps: '5/8 = 0,625; 0,62 = 0,62; 3/5 = 0,6; 61% = 0,61. Urutan: 3/5 < 61% < 0,62 < 5/8.' },
    25: { answer: '36', steps: '3/8 x 240 = 90. 45% x 120 = 54. 90 - 54 = 36.' },
  };

  const sub1 = evaluateExam(
    'Nailah Sakhi Nurramadhani',
    'VII Akademik',
    '13',
    answersDaily1,
    0,
    [],
    2412, // 40m 12s
    {
      sessionId: 'daily_assessment',
      teacherNotes: 'Pemahaman konsep bilangan rasional bab 2 sangat luar biasa dan runtut.',
    }
  );

  // 2. Muhammad Al-Fatih - Daily Assessment Bab 2 (Skor 82)
  const answersDaily2: Record<number, any> = {
    1: 'B',
    2: 'C',
    3: 'A',
    4: 'D',
    5: 'C',
    6: 'D',
    7: 'B',
    8: 'C',
    9: ['A', 'C'],
    10: ['A', 'C', 'D'],
    11: ['A', 'C', 'E'],
    12: { '12a': 'S', '12b': 'B', '12c': 'B' },
    13: { '13a': 'B', '13b': 'B', '13c': 'S' },
    14: { '14a': 'B', '14b': 'B', '14c': 'B' },
    15: {
      '15a': 'Kurang dari 1/3',
      '15b': 'Sama dengan 1/3',
      '15c': 'Lebih dari 1/3',
      '15d': 'Sama dengan 1/3',
      '15e': 'Kurang dari 1/3',
      '15f': 'Lebih dari 1/3',
    },
    16: {
      '16a': 'Pecahan tak wajar',
      '16b': 'Bilangan campuran',
      '16c': 'Pecahan wajar',
      '16d': 'Pecahan tak wajar',
      '16e': 'Bilangan campuran',
      '16f': 'Pecahan wajar',
    },
    17: {
      '17a': 'Pangkat positif (n > 0)',
      '17b': 'Pangkat negatif (n < 0)',
      '17c': 'Pangkat positif (n > 0)',
      '17d': 'Pangkat negatif (n < 0)',
      '17e': 'Pangkat positif (n > 0)',
      '17f': 'Pangkat negatif (n < 0)',
    },
    18: { '18_1': 'D', '18_2': 'A', '18_3': 'C', '18_4': 'B' },
    19: { '19_1': 'D', '19_2': 'C', '19_3': 'A', '19_4': 'B' },
    20: { '20_1': 'B', '20_2': 'A', '20_3': 'C' },
    21: '90 km',
    22: '4 7/12',
    23: { answer: '30 siswa', steps: '5/6 x 36 = 30 siswa perempuan.' },
    24: { answer: '3/5, 61%, 0,62, 5/8', steps: '0,6 < 0,61 < 0,62 < 0,625.' },
    25: { answer: '36', steps: '90 - 54 = 36.' },
  };

  const sub2 = evaluateExam(
    'Muhammad Al-Fatih',
    'VII Tahfidz-Middle East',
    '07',
    answersDaily2,
    1,
    [{ time: '10:14', reason: 'Fokus jendela browser terlepas' }],
    2890,
    {
      sessionId: 'daily_assessment',
      teacherNotes: 'Hasil sangat baik, tuntas di atas KKM 75.',
    }
  );

  // 3. Aisyah Humaira - Pre-Test Cambridge
  const answersPretest: Record<number, any> = {
    1: 'B',
    2: 'C',
    3: 'C',
    4: 'A',
    5: 'C',
    6: 'B',
    7: 'D',
    8: 'B',
    9: ['A', 'B', 'D'],
    10: ['A', 'C', 'D'],
    11: ['A', 'C', 'E'],
    12: { '12a': 'B', '12b': 'S', '12c': 'B' },
    13: { '13a': 'B', '13b': 'S', '13c': 'B' },
    14: { '14a': 'B', '14b': 'S', '14c': 'B' },
    15: {
      '15a': 'Kurang dari 1/2',
      '15b': 'Sama dengan 1/2',
      '15c': 'Lebih dari 1/2',
      '15d': 'Kurang dari 1/2',
      '15e': 'Lebih dari 1/2',
      '15f': 'Sama dengan 1/2',
    },
    16: {
      '16a': 'Pecahan tak wajar',
      '16b': 'Bilangan campuran',
      '16c': 'Pecahan wajar',
      '16d': 'Pecahan tak wajar',
      '16e': 'Bilangan campuran',
      '16f': 'Pecahan wajar',
    },
    17: {
      '17a': 'Pangkat positif (n > 0)',
      '17b': 'Pangkat negatif (n < 0)',
      '17c': 'Pangkat positif (n > 0)',
      '17d': 'Pangkat negatif (n < 0)',
      '17e': 'Pangkat positif (n > 0)',
      '17f': 'Pangkat negatif (n < 0)',
    },
    18: { '18_1': 'C', '18_2': 'A', '18_3': 'B', '18_4': 'D' },
    19: { '19_1': 'C', '19_2': 'B', '19_3': 'A', '19_4': 'D' },
    20: { '20_1': 'C', '20_2': 'B', '20_3': 'A' },
    21: '2 2/3',
    22: '2 1/4 kg',
    23: { answer: '37,5%', steps: '40% x 20 = 8. Sisa segar 3. 3/8 x 100% = 37,5%.' },
    24: { answer: '15%', steps: '25 - 10 = 15%. 15/100 x 100% = 15%.' },
    25: { answer: '1 11/16 ton', steps: '3/4 x 9/4 = 27/16 = 1 11/16 ton.' },
  };

  const sub3 = evaluateExam(
    'Aisyah Humaira',
    'VII Akademik',
    '03',
    answersPretest,
    0,
    [],
    2250,
    {
      sessionId: 'pre_test',
      teacherNotes: 'Tuntas pada sesi Pre-Test Petualangan Pecahan.',
    }
  );

  // 4. Fatima Az-Zahra - Daily Assessment Bab 2 Type 2 (20 Soal, Max 32 Poin)
  const answersType2: Record<number, any> = {
    1: 'B',
    2: 'C',
    3: 'A',
    4: 'D',
    5: 'C',
    6: 'D',
    7: 'B',
    8: 'C',
    9: ['A', 'C', 'D'],
    10: ['A', 'C', 'D'],
    11: ['A', 'C', 'E'],
    12: { '12a': 'S', '12b': 'B', '12c': 'B' },
    13: { '13a': 'B', '13b': 'B', '13c': 'S' },
    14: { '14a': 'B', '14b': 'S', '14c': 'B' },
    15: {
      '15a': 'Kurang dari 1/3',
      '15b': 'Sama dengan 1/3',
      '15c': 'Lebih dari 1/3',
      '15d': 'Sama dengan 1/3',
      '15e': 'Kurang dari 1/3',
      '15f': 'Lebih dari 1/3',
    },
    16: {
      '16a': 'Pecahan tak wajar',
      '16b': 'Bilangan campuran',
      '16c': 'Pecahan wajar',
      '16d': 'Pecahan tak wajar',
      '16e': 'Bilangan campuran',
      '16f': 'Pecahan wajar',
    },
    17: {
      '17a': 'Pangkat positif (n > 0)',
      '17b': 'Pangkat negatif (n < 0)',
      '17c': 'Pangkat positif (n > 0)',
      '17d': 'Pangkat negatif (n < 0)',
      '17e': 'Pangkat positif (n > 0)',
      '17f': 'Pangkat negatif (n < 0)',
    },
    18: { '18_1': 'D', '18_2': 'A', '18_3': 'C', '18_4': 'B' },
    19: { '19_1': 'D', '19_2': 'C', '19_3': 'A', '19_4': 'B' },
    20: { '20_1': 'B', '20_2': 'A', '20_3': 'C' },
  };

  const sub4 = evaluateExam(
    'Fatima Az-Zahra',
    'VII Akademik',
    '09',
    answersType2,
    0,
    [],
    2150,
    {
      sessionId: 'daily_assessment_type2',
      teacherNotes: 'Sempurna pada Sesi Type 2 (20 Soal Bagian A s/d E). Nilai 100.',
    }
  );

  return [sub4, sub1, sub2, sub3];
}
