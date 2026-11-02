import { ExamSubmission } from '../types/quiz';
import { evaluateExam } from '../utils/mathGrading';

export function getSampleSubmissions(): ExamSubmission[] {
  // 1. Nailah Sakhi Nurramadhani - High Scorer (88)
  const answersNailah: Record<number, any> = {
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
    15: { '15a': 'Kurang dari 1/2', '15b': 'Sama dengan 1/2', '15c': 'Lebih dari 1/2', '15d': 'Kurang dari 1/2', '15e': 'Lebih dari 1/2', '15f': 'Sama dengan 1/2' },
    16: { '16a': 'Pecahan tak wajar', '16b': 'Bilangan campuran', '16c': 'Pecahan wajar', '16d': 'Pecahan tak wajar', '16e': 'Bilangan campuran', '16f': 'Pecahan wajar' },
    17: { '17a': 'Pangkat positif (n > 0)', '17b': 'Pangkat negatif (n < 0)', '17c': 'Pangkat positif (n > 0)', '17d': 'Pangkat negatif (n < 0)', '17e': 'Pangkat positif (n > 0)', '17f': 'Pangkat negatif (n < 0)' },
    18: { '18_1': 'C', '18_2': 'A', '18_3': 'B', '18_4': 'D' },
    19: { '19_1': 'C', '19_2': 'B', '19_3': 'A', '19_4': 'D' },
    20: { '20_1': 'C', '20_2': 'B', '20_3': 'A' },
    21: '2 2/3',
    22: '2 1/4 kg',
    23: { answer: '37,5%', steps: '40% x 20 = 8 mawar. Mawar segar = 8 - 5 = 3 mawar. Persentase = 3/8 x 100% = 37,5%.' },
    24: { answer: '15%', steps: 'Koin perak = 25% x 100 = 25. Sisa perak = 25 - 10 = 15. Persentase dari 100 koin awal = 15/100 x 100% = 15%.' },
    25: { answer: '1 11/16 ton', steps: 'Muatan awal = 2 1/4 ton = 9/4 ton. Sisa beras = 3/4 x 9/4 ton = 27/16 ton = 1 11/16 ton.' },
  };

  const sub1 = evaluateExam(
    'Nailah Sakhi Nurramadhani',
    'VII Akademik',
    '13',
    answersNailah,
    0,
    [],
    2412, // 40m 12s
    { teacherNotes: 'Pemahaman konsep bilangan rasional sangat luar biasa dan runtut.' }
  );

  // 2. Muhammad Al-Fatih - Good Scorer (78)
  const answersFatih: Record<number, any> = {
    1: 'B',
    2: 'C',
    3: 'C',
    4: 'A',
    5: 'C',
    6: 'B',
    7: 'D',
    8: 'B',
    9: ['A', 'B', 'D'],
    10: ['A', 'C'], // partial
    11: ['A', 'C', 'E'],
    12: { '12a': 'B', '12b': 'S', '12c': 'B' },
    13: { '13a': 'B', '13b': 'S', '13c': 'B' },
    14: { '14a': 'B', '14b': 'B', '14c': 'B' }, // 2 of 3
    15: { '15a': 'Kurang dari 1/2', '15b': 'Sama dengan 1/2', '15c': 'Lebih dari 1/2', '15d': 'Kurang dari 1/2', '15e': 'Lebih dari 1/2', '15f': 'Sama dengan 1/2' },
    16: { '16a': 'Pecahan tak wajar', '16b': 'Bilangan campuran', '16c': 'Pecahan wajar', '16d': 'Pecahan tak wajar', '16e': 'Bilangan campuran', '16f': 'Pecahan wajar' },
    17: { '17a': 'Pangkat positif (n > 0)', '17b': 'Pangkat negatif (n < 0)', '17c': 'Pangkat positif (n > 0)', '17d': 'Pangkat negatif (n < 0)', '17e': 'Pangkat positif (n > 0)', '17f': 'Pangkat negatif (n < 0)' },
    18: { '18_1': 'C', '18_2': 'A', '18_3': 'B', '18_4': 'D' },
    19: { '19_1': 'C', '19_2': 'B', '19_3': 'A', '19_4': 'D' },
    20: { '20_1': 'C', '20_2': 'B', '20_3': 'A' },
    21: '2 2/3',
    22: '2 1/4 kg',
    23: { answer: '37,5%', steps: '40% x 20 = 8 mawar segar 3 maka 37,5%' },
    24: { answer: '15%', steps: '25 - 10 = 15%' },
    25: { answer: '1 11/16 ton', steps: '3/4 x 9/4 = 27/16 = 1 11/16' },
  };

  const sub2 = evaluateExam(
    'Muhammad Al-Fatih',
    'VII Tahfidz-Middle East',
    '07',
    answersFatih,
    1,
    [{ time: '10:14', reason: 'Fokus jendela browser terlepas' }],
    2890,
    { teacherNotes: 'Perlu sedikit ketelitian pada perkalian desimal (soal 14).' }
  );

  return [sub1, sub2];
}
