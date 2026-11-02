import React from 'react';

interface RealIllustrationProps {
  id:
    | 'pizza_4'
    | 'birthday_cake_8'
    | 'chocolate_bar_dina'
    | 'pizza_dimakan_5'
    | 'three_juice_glasses'
    | 'matching_3_items'
    | 'cyclist_road_120'
    | 'class_36_students';
  className?: string;
}

export const RealIllustration: React.FC<RealIllustrationProps> = ({ id, className = '' }) => {
  switch (id) {
    // 1. Soal 1: 4 Pizza (3 Utuh + 1 Berisi 5/6 Potong = 23/6)
    case 'pizza_4':
      return (
        <div className={`p-4 rounded-2xl border border-amber-200 bg-gradient-to-b from-amber-50/70 to-orange-50/40 shadow-sm ${className}`}>
          <div className="flex items-center justify-between mb-3 text-xs font-bold text-amber-900">
            <span className="flex items-center gap-1.5">
              🍕 <span className="uppercase tracking-wider">Ilustrasi Pizza Bilangan Campuran</span>
            </span>
            <span className="bg-white px-2.5 py-0.5 rounded-full border border-amber-300 text-amber-800">
              Total 23 Potong (Tiap potong = 1/6)
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 select-none">
            {/* Pizza 1: Utuh (6/6) */}
            <div className="flex flex-col items-center bg-white/90 p-3 rounded-xl border border-amber-200 shadow-xs">
              <svg viewBox="0 0 100 100" className="w-20 h-20 drop-shadow-md">
                <circle cx="50" cy="50" r="44" fill="#d97706" stroke="#92400e" strokeWidth="3" />
                <circle cx="50" cy="50" r="38" fill="#fde047" stroke="#b45309" strokeWidth="1.5" />
                {/* 6 Slice division lines */}
                {[0, 60, 120].map((deg) => (
                  <line
                    key={deg}
                    x1={50 + 38 * Math.cos((deg * Math.PI) / 180)}
                    y1={50 + 38 * Math.sin((deg * Math.PI) / 180)}
                    x2={50 - 38 * Math.cos((deg * Math.PI) / 180)}
                    y2={50 - 38 * Math.sin((deg * Math.PI) / 180)}
                    stroke="#b45309"
                    strokeWidth="1.8"
                  />
                ))}
                {/* Pepperoni toppings */}
                {[[40, 35], [60, 35], [65, 55], [45, 65], [32, 52], [52, 45]].map(([cx, cy], i) => (
                  <circle key={i} cx={cx} cy={cy} r="4.5" fill="#dc2626" stroke="#991b1b" strokeWidth="0.8" />
                ))}
              </svg>
              <span className="text-xs font-bold text-slate-700 mt-2">Pizza 1 (6 potong)</span>
            </div>

            {/* Pizza 2: Utuh (6/6) */}
            <div className="flex flex-col items-center bg-white/90 p-3 rounded-xl border border-amber-200 shadow-xs">
              <svg viewBox="0 0 100 100" className="w-20 h-20 drop-shadow-md">
                <circle cx="50" cy="50" r="44" fill="#d97706" stroke="#92400e" strokeWidth="3" />
                <circle cx="50" cy="50" r="38" fill="#fde047" stroke="#b45309" strokeWidth="1.5" />
                {[0, 60, 120].map((deg) => (
                  <line
                    key={deg}
                    x1={50 + 38 * Math.cos((deg * Math.PI) / 180)}
                    y1={50 + 38 * Math.sin((deg * Math.PI) / 180)}
                    x2={50 - 38 * Math.cos((deg * Math.PI) / 180)}
                    y2={50 - 38 * Math.sin((deg * Math.PI) / 180)}
                    stroke="#b45309"
                    strokeWidth="1.8"
                  />
                ))}
                {[[38, 38], [62, 38], [60, 62], [38, 62], [50, 48], [48, 25]].map(([cx, cy], i) => (
                  <circle key={i} cx={cx} cy={cy} r="4.5" fill="#dc2626" stroke="#991b1b" strokeWidth="0.8" />
                ))}
              </svg>
              <span className="text-xs font-bold text-slate-700 mt-2">Pizza 2 (6 potong)</span>
            </div>

            {/* Pizza 3: Utuh (6/6) */}
            <div className="flex flex-col items-center bg-white/90 p-3 rounded-xl border border-amber-200 shadow-xs">
              <svg viewBox="0 0 100 100" className="w-20 h-20 drop-shadow-md">
                <circle cx="50" cy="50" r="44" fill="#d97706" stroke="#92400e" strokeWidth="3" />
                <circle cx="50" cy="50" r="38" fill="#fde047" stroke="#b45309" strokeWidth="1.5" />
                {[0, 60, 120].map((deg) => (
                  <line
                    key={deg}
                    x1={50 + 38 * Math.cos((deg * Math.PI) / 180)}
                    y1={50 + 38 * Math.sin((deg * Math.PI) / 180)}
                    x2={50 - 38 * Math.cos((deg * Math.PI) / 180)}
                    y2={50 - 38 * Math.sin((deg * Math.PI) / 180)}
                    stroke="#b45309"
                    strokeWidth="1.8"
                  />
                ))}
                {[[35, 45], [65, 45], [50, 65], [45, 30], [55, 30], [50, 48]].map(([cx, cy], i) => (
                  <circle key={i} cx={cx} cy={cy} r="4.5" fill="#dc2626" stroke="#991b1b" strokeWidth="0.8" />
                ))}
              </svg>
              <span className="text-xs font-bold text-slate-700 mt-2">Pizza 3 (6 potong)</span>
            </div>

            {/* Pizza 4: 5 Potong Tersedia (5/6), 1 Potong Kosong */}
            <div className="flex flex-col items-center bg-amber-100/70 p-3 rounded-xl border-2 border-amber-400 shadow-xs relative">
              <span className="absolute -top-2.5 bg-amber-600 text-white text-[10px] font-black px-2 py-0.5 rounded-full">
                5 dari 6 Bagian
              </span>
              <svg viewBox="0 0 100 100" className="w-20 h-20 drop-shadow-md">
                {/* 5 Filled slices path (from 60 deg to 360 deg) */}
                <path
                  d="M50,50 L50,6 A44,44 0 1,0 88.1,28 Z"
                  fill="#d97706"
                  stroke="#92400e"
                  strokeWidth="3"
                />
                <path
                  d="M50,50 L50,12 A38,38 0 1,0 82.9,31 Z"
                  fill="#fde047"
                  stroke="#b45309"
                  strokeWidth="1.5"
                />
                {/* Missing slice outline dashed */}
                <path
                  d="M50,50 L50,6 A44,44 0 0,1 88.1,28 Z"
                  fill="#f8fafc"
                  stroke="#cbd5e1"
                  strokeWidth="1.5"
                  strokeDasharray="3,3"
                />
                {/* Lines */}
                {[60, 120, 180, 240, 300].map((deg) => (
                  <line
                    key={deg}
                    x1="50"
                    y1="50"
                    x2={50 + 38 * Math.cos((deg * Math.PI) / 180)}
                    y2={50 + 38 * Math.sin((deg * Math.PI) / 180)}
                    stroke="#b45309"
                    strokeWidth="1.5"
                  />
                ))}
                {[[35, 45], [60, 60], [40, 65], [30, 35], [52, 48]].map(([cx, cy], i) => (
                  <circle key={i} cx={cx} cy={cy} r="4" fill="#dc2626" stroke="#991b1b" strokeWidth="0.8" />
                ))}
              </svg>
              <span className="text-xs font-bold text-amber-900 mt-2">Pizza 4 (5 potong)</span>
            </div>
          </div>
          <p className="text-[11px] text-center text-amber-800/90 mt-2 italic font-medium">
            3 pizza utuh (18 potong) + 1 pizza berisi 5 potong = 23 potong (23/6).
          </p>
        </div>
      );

    // 2. Soal 8: Kue Ulang Tahun Dipotong 8 Bagian (Bagian Rani = 3 Potong)
    case 'birthday_cake_8':
      return (
        <div className={`p-4 rounded-2xl border border-pink-200 bg-gradient-to-b from-pink-50/70 to-rose-50/40 shadow-sm ${className}`}>
          <div className="flex items-center justify-between mb-3 text-xs font-bold text-pink-900">
            <span className="flex items-center gap-1.5">
              🎂 <span className="uppercase tracking-wider">Kue Ulang Tahun (8 Potong Sama Besar)</span>
            </span>
            <span className="bg-pink-500 text-white px-2.5 py-0.5 rounded-full text-[11px]">
              Bagian Rani: 3 Potong
            </span>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <svg viewBox="0 0 160 160" className="w-36 h-36 drop-shadow-lg select-none">
              {/* Outer Plate */}
              <circle cx="80" cy="80" r="76" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="2" />
              {/* Slices 1 to 5 (Remaining Slices - Light Rose/Cream) */}
              <circle cx="80" cy="80" r="66" fill="#fdf2f8" stroke="#f472b6" strokeWidth="2" />

              {/* 3 Slices For Rani (0 to 135 deg: 3 * 45 deg) */}
              <path
                d="M80,80 L146,80 A66,66 0 0,1 33.3,126.6 Z"
                fill="#f43f5e"
                stroke="#be123c"
                strokeWidth="2.5"
              />

              {/* 8 Radial dividing cuts */}
              {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
                <line
                  key={deg}
                  x1="80"
                  y1="80"
                  x2={80 + 66 * Math.cos((deg * Math.PI) / 180)}
                  y2={80 + 66 * Math.sin((deg * Math.PI) / 180)}
                  stroke="#ffffff"
                  strokeWidth="2.5"
                />
              ))}

              {/* Cherries/Strawberries on Slices */}
              {[22.5, 67.5, 112.5].map((deg, i) => (
                <circle
                  key={i}
                  cx={80 + 44 * Math.cos((deg * Math.PI) / 180)}
                  cy={80 + 44 * Math.sin((deg * Math.PI) / 180)}
                  r="5"
                  fill="#ffffff"
                  stroke="#be123c"
                  strokeWidth="1.5"
                />
              ))}

              {/* Cake Center Rose Swirl */}
              <circle cx="80" cy="80" r="10" fill="#fb7185" stroke="#ffffff" strokeWidth="2" />
            </svg>

            <div className="space-y-2 text-xs text-slate-700 max-w-xs">
              <div className="flex items-center gap-2">
                <span className="w-4 h-4 rounded-md bg-rose-500 shrink-0" />
                <span className="font-bold text-rose-700">3 Potong Bagian Rani (Warna Merah Muda)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-4 h-4 rounded-md bg-pink-100 border border-pink-300 shrink-0" />
                <span className="text-slate-600">5 Potong Bagian Lainnya</span>
              </div>
              <p className="text-[11px] text-slate-500 italic pt-1 border-t border-pink-200">
                Total kue terbagi menjadi 8 potongan yang berukuran sama besar.
              </p>
            </div>
          </div>
        </div>
      );

    // 3. Soal 9: Batang Cokelat Milik Dina (2/3 Sudah Dimakan)
    case 'chocolate_bar_dina':
      return (
        <div className={`p-4 rounded-2xl border border-amber-300 bg-amber-50/60 shadow-sm ${className}`}>
          <div className="flex items-center justify-between mb-2 text-xs font-bold text-amber-950">
            <span className="flex items-center gap-1.5">
              🍫 <span className="uppercase tracking-wider">Batang Cokelat Dina (Bagian Dimakan = 2/3)</span>
            </span>
            <span className="bg-amber-800 text-amber-100 px-2.5 py-0.5 rounded-full text-[10px]">
              Kotak Putus-putus = Sudah Dimakan
            </span>
          </div>

          <svg viewBox="0 0 340 110" className="w-full max-w-sm mx-auto drop-shadow-md select-none">
            {/* Chocolate Bar Wrapper Shadow */}
            <rect x="15" y="15" width="310" height="80" rx="8" fill="#451a03" />

            {/* 3 Columns (Each representing 1/3) */}
            {/* Column 1: Eaten (Putus-putus) */}
            <rect x="25" y="25" width="90" height="60" rx="4" fill="#fef3c7" stroke="#b45309" strokeWidth="2" strokeDasharray="5,4" />
            <text x="70" y="58" fill="#b45309" fontSize="11" fontWeight="bold" textAnchor="middle">Sudah Dimakan</text>

            {/* Column 2: Eaten (Putus-putus) */}
            <rect x="125" y="25" width="90" height="60" rx="4" fill="#fef3c7" stroke="#b45309" strokeWidth="2" strokeDasharray="5,4" />
            <text x="170" y="58" fill="#b45309" fontSize="11" fontWeight="bold" textAnchor="middle">Sudah Dimakan</text>

            {/* Column 3: Intact Chocolate (Dark Brown Segments) */}
            <rect x="225" y="25" width="90" height="60" rx="4" fill="#78350f" stroke="#451a03" strokeWidth="2" />
            <rect x="232" y="32" width="35" height="20" rx="2" fill="#92400e" stroke="#451a03" strokeWidth="1" />
            <rect x="273" y="32" width="35" height="20" rx="2" fill="#92400e" stroke="#451a03" strokeWidth="1" />
            <rect x="232" y="58" width="35" height="20" rx="2" fill="#92400e" stroke="#451a03" strokeWidth="1" />
            <rect x="273" y="58" width="35" height="20" rx="2" fill="#92400e" stroke="#451a03" strokeWidth="1" />
          </svg>
          <p className="text-[11px] text-center text-amber-900 mt-2 font-medium">
            2 dari 3 bagian cokelat (2/3) telah dimakan oleh Dina.
          </p>
        </div>
      );

    // 4. Soal 10: Pizza 8 Potong (5 Dimakan, 3 Tersisa)
    case 'pizza_dimakan_5':
      return (
        <div className={`p-4 rounded-2xl border border-orange-200 bg-orange-50/50 shadow-sm ${className}`}>
          <div className="flex items-center justify-between mb-2 text-xs font-bold text-orange-950">
            <span>🍕 Pizza 8 Bagian Sama Besar</span>
            <span className="bg-orange-600 text-white px-2 py-0.5 rounded-full text-[10px]">
              Dimakan = 5/8 | Tersisa = 3/8
            </span>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-5">
            <svg viewBox="0 0 160 160" className="w-36 h-36 drop-shadow-md select-none">
              {/* Plate */}
              <circle cx="80" cy="80" r="75" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="2" />
              {/* 5 Eaten Slices (dashed silhouette) */}
              <path
                d="M80,80 L145,80 A65,65 0 0,1 34,126 Z"
                fill="#fff7ed"
                stroke="#ea580c"
                strokeWidth="2"
                strokeDasharray="4,4"
              />
              {/* 3 Remaining Slices (Warm Pizza) */}
              <path
                d="M80,80 L34,126 A65,65 0 0,1 145,80 Z"
                fill="#ea580c"
                stroke="#9a3412"
                strokeWidth="2.5"
              />
              {/* Cheese & Toppings on Remaining Slices */}
              {[157.5, 202.5, 247.5].map((deg, i) => (
                <circle
                  key={i}
                  cx={80 + 40 * Math.cos((deg * Math.PI) / 180)}
                  cy={80 + 40 * Math.sin((deg * Math.PI) / 180)}
                  r="5"
                  fill="#fef08a"
                  stroke="#ca8a04"
                  strokeWidth="1.5"
                />
              ))}
              {/* Divider lines */}
              {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
                <line
                  key={deg}
                  x1="80"
                  y1="80"
                  x2={80 + 65 * Math.cos((deg * Math.PI) / 180)}
                  y2={80 + 65 * Math.sin((deg * Math.PI) / 180)}
                  stroke="#fed7aa"
                  strokeWidth="1.5"
                />
              ))}
            </svg>
            <div className="text-xs space-y-1 text-slate-700">
              <p className="font-bold text-orange-900">Keterangan Gambar:</p>
              <p>• Garis putus-putus: 5 potong sudah dimakan (5/8 = 62,5%)</p>
              <p>• Bagian berwarna tebal: 3 potong masih tersisa (3/8 = 37,5%)</p>
            </div>
          </div>
        </div>
      );

    // 5. Soal 12: Tiga Gelas Jus Sama Besar (1/2, 1/4, 1/4)
    case 'three_juice_glasses':
      return (
        <div className={`p-4 rounded-2xl border border-sky-200 bg-gradient-to-b from-sky-50 to-amber-50/40 shadow-sm ${className}`}>
          <div className="flex items-center justify-between mb-3 text-xs font-bold text-sky-950">
            <span>🥤 Tiga Gelas Jus Jeruk Sama Besar</span>
            <span className="text-slate-500 font-medium">Garis bantu: terbagi 4 bagian sama besar</span>
          </div>

          <div className="grid grid-cols-3 gap-3 max-w-md mx-auto select-none">
            {/* Gelas 1: Terisi 1/2 (2 dari 4 bagian) */}
            <div className="flex flex-col items-center bg-white p-3 rounded-xl border border-sky-200 shadow-xs">
              <svg viewBox="0 0 70 110" className="w-16 h-24">
                {/* Glass outline */}
                <polygon points="12,10 58,10 52,98 18,98" fill="#f0f9ff" stroke="#0284c7" strokeWidth="2" />
                {/* Orange Juice Liquid Level: 50% (half of glass height) */}
                <polygon points="15,55 55,55 52,98 18,98" fill="#f97316" stroke="#c2410c" strokeWidth="1" />
                {/* 4 calibration lines */}
                {[32, 54, 76].map((y, i) => (
                  <line key={i} x1="16" y1={y} x2="54" y2={y} stroke="#38bdf8" strokeWidth="1" strokeDasharray="3,2" />
                ))}
              </svg>
              <span className="text-xs font-bold text-slate-800 mt-2">Gelas 1</span>
              <span className="text-[11px] font-bold text-orange-600">1/2 bagian</span>
            </div>

            {/* Gelas 2: Terisi 1/4 (1 dari 4 bagian) */}
            <div className="flex flex-col items-center bg-white p-3 rounded-xl border border-sky-200 shadow-xs">
              <svg viewBox="0 0 70 110" className="w-16 h-24">
                <polygon points="12,10 58,10 52,98 18,98" fill="#f0f9ff" stroke="#0284c7" strokeWidth="2" />
                {/* Liquid Level: 1/4 (bottom 25%) */}
                <polygon points="16,76 54,76 52,98 18,98" fill="#f97316" stroke="#c2410c" strokeWidth="1" />
                {[32, 54, 76].map((y, i) => (
                  <line key={i} x1="16" y1={y} x2="54" y2={y} stroke="#38bdf8" strokeWidth="1" strokeDasharray="3,2" />
                ))}
              </svg>
              <span className="text-xs font-bold text-slate-800 mt-2">Gelas 2</span>
              <span className="text-[11px] font-bold text-orange-600">1/4 bagian</span>
            </div>

            {/* Gelas 3: Terisi 1/4 (1 dari 4 bagian) */}
            <div className="flex flex-col items-center bg-white p-3 rounded-xl border border-sky-200 shadow-xs">
              <svg viewBox="0 0 70 110" className="w-16 h-24">
                <polygon points="12,10 58,10 52,98 18,98" fill="#f0f9ff" stroke="#0284c7" strokeWidth="2" />
                {/* Liquid Level: 1/4 */}
                <polygon points="16,76 54,76 52,98 18,98" fill="#f97316" stroke="#c2410c" strokeWidth="1" />
                {[32, 54, 76].map((y, i) => (
                  <line key={i} x1="16" y1={y} x2="54" y2={y} stroke="#38bdf8" strokeWidth="1" strokeDasharray="3,2" />
                ))}
              </svg>
              <span className="text-xs font-bold text-slate-800 mt-2">Gelas 3</span>
              <span className="text-[11px] font-bold text-orange-600">1/4 bagian</span>
            </div>
          </div>
          <p className="text-[11px] text-center text-sky-900 mt-2 italic font-medium">
            1/2 + 1/4 + 1/4 = 4/4 = 1 gelas utuh terisi penuh jika digabungkan.
          </p>
        </div>
      );

    // 6. Soal 20: Tiga Gambar Benda Nyata (Cokelat 5/8, Pizza 3/4, Gelas 2/3)
    case 'matching_3_items':
      return (
        <div className={`p-4 rounded-2xl border border-slate-200 bg-slate-50/80 shadow-xs ${className}`}>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Gambar 1: Cokelat (5 dari 8 kotak berwarna) */}
            <div className="bg-white p-3 rounded-xl border border-slate-200 flex flex-col items-center text-center">
              <span className="text-xs font-bold text-slate-700 mb-2">Gambar 1: Cokelat</span>
              <div className="grid grid-cols-4 gap-1 p-1 bg-amber-950 rounded-lg w-28">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="h-6 bg-amber-600 rounded-xs border border-amber-500 shadow-xs" />
                ))}
                {[6, 7, 8].map((i) => (
                  <div key={i} className="h-6 bg-amber-100/70 rounded-xs border border-dashed border-amber-300" />
                ))}
              </div>
              <span className="text-[11px] text-slate-500 mt-2 font-medium">5 dari 8 kotak terisi</span>
            </div>

            {/* Gambar 2: Pizza (3 dari 4 potong berwarna) */}
            <div className="bg-white p-3 rounded-xl border border-slate-200 flex flex-col items-center text-center">
              <span className="text-xs font-bold text-slate-700 mb-2">Gambar 2: Pizza</span>
              <svg viewBox="0 0 80 80" className="w-20 h-20">
                {/* 3 Colored Slices (0 to 270 deg) */}
                <path d="M40,40 L76,40 A36,36 0 1,1 40,4 Z" fill="#f97316" stroke="#c2410c" strokeWidth="2" />
                {/* 1 Empty Slice */}
                <path d="M40,40 L40,4 A36,36 0 0,1 76,40 Z" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1.5" strokeDasharray="3,2" />
                <line x1="40" y1="4" x2="40" y2="76" stroke="#ffffff" strokeWidth="2" />
                <line x1="4" y1="40" x2="76" y2="40" stroke="#ffffff" strokeWidth="2" />
              </svg>
              <span className="text-[11px] text-slate-500 mt-2 font-medium">3 dari 4 potong terisi</span>
            </div>

            {/* Gambar 3: Gelas Jus (2 dari 3 bagian terisi) */}
            <div className="bg-white p-3 rounded-xl border border-slate-200 flex flex-col items-center text-center">
              <span className="text-xs font-bold text-slate-700 mb-2">Gambar 3: Gelas Jus</span>
              <svg viewBox="0 0 60 90" className="w-14 h-20">
                <polygon points="10,8 50,8 44,82 16,82" fill="#f0f9ff" stroke="#0284c7" strokeWidth="1.8" />
                {/* Liquid 2/3 */}
                <polygon points="12,32 48,32 44,82 16,82" fill="#eab308" stroke="#ca8a04" strokeWidth="1" />
                <line x1="12" y1="32" x2="48" y2="32" stroke="#0284c7" strokeWidth="1" strokeDasharray="2,2" />
                <line x1="14" y1="56" x2="46" y2="56" stroke="#0284c7" strokeWidth="1" strokeDasharray="2,2" />
              </svg>
              <span className="text-[11px] text-slate-500 mt-2 font-medium">2 dari 3 bagian terisi</span>
            </div>
          </div>
        </div>
      );

    // 7. Soal 21: Jalur Sepeda Andi 120 km (Menempuh 3/4 Jarak = 90 km)
    case 'cyclist_road_120':
      return (
        <div className={`p-4 rounded-2xl border border-emerald-200 bg-gradient-to-b from-sky-50 via-emerald-50/40 to-slate-100 shadow-sm ${className}`}>
          <div className="flex items-center justify-between mb-2 text-xs font-bold text-emerald-950">
            <span>🚴‍♂️ Jalur Bersepeda Andi (Total Jarak: 120 km)</span>
            <span className="bg-emerald-600 text-white px-2.5 py-0.5 rounded-full text-[10px]">
              Jalan Dibagi 4 Bagian Sama Panjang
            </span>
          </div>

          <svg viewBox="0 0 460 140" className="w-full max-w-lg mx-auto drop-shadow-sm select-none">
            {/* Sky & Hills */}
            <path d="M0,70 Q115,50 230,65 T460,60 L460,140 L0,140 Z" fill="#bbf7d0" />

            {/* Asphalt Highway Road */}
            <rect x="20" y="80" width="420" height="38" rx="6" fill="#334155" />
            {/* White Dashed Centerline */}
            <line x1="30" y1="99" x2="430" y2="99" stroke="#ffffff" strokeWidth="2.5" strokeDasharray="14,10" />

            {/* 4 Equal Segments Markers (0km, 30km, 60km, 90km, 120km) */}
            {[
              { x: 30, label: '0 km (Mulai)' },
              { x: 132, label: '30 km (1/4)' },
              { x: 235, label: '60 km (2/4)' },
              { x: 337, label: '90 km (3/4)' },
              { x: 430, label: '120 km (Tujuan)' },
            ].map((p, i) => (
              <g key={i}>
                <line x1={p.x} y1="76" x2={p.x} y2="122" stroke="#facc15" strokeWidth="2.5" />
                <circle cx={p.x} cy="126" r="3" fill="#0f172a" />
                <text x={p.x} y="137" fill="#0f172a" fontSize="8.5" fontWeight="bold" textAnchor="middle">
                  {p.label}
                </text>
              </g>
            ))}

            {/* Cyclist Andi at 90 km mark */}
            <g transform="translate(315, 38)">
              {/* Bicycle Wheels */}
              <circle cx="10" cy="38" r="8" fill="none" stroke="#0284c7" strokeWidth="2" />
              <circle cx="34" cy="38" r="8" fill="none" stroke="#0284c7" strokeWidth="2" />
              {/* Frame */}
              <polygon points="10,38 22,38 30,26 18,26" fill="none" stroke="#dc2626" strokeWidth="2" />
              <line x1="22" y1="38" x2="22" y2="22" stroke="#dc2626" strokeWidth="2" />
              <line x1="10" y1="38" x2="18" y2="26" stroke="#dc2626" strokeWidth="2" />
              {/* Handlebar */}
              <line x1="30" y1="26" x2="28" y2="18" stroke="#0f172a" strokeWidth="2" />
              {/* Cyclist Body */}
              <circle cx="24" cy="10" r="5" fill="#f59e0b" />
              <line x1="24" y1="15" x2="20" y2="26" stroke="#1e293b" strokeWidth="2.5" />
              <line x1="20" y1="26" x2="22" y2="38" stroke="#1e293b" strokeWidth="2" />
            </g>

            {/* Distance highlight bar: 3 of 4 segments */}
            <rect x="30" y="82" width="307" height="4" fill="#38bdf8" />
          </svg>
          <p className="text-[11px] text-center text-slate-600 mt-2 italic font-medium">
            Jalan dibagi 4 bagian sama panjang: 120 km ÷ 4 = 30 km per bagian. Andi menempuh 3 bagian (3/4 × 120 = 90 km).
          </p>
        </div>
      );

    // 8. Soal 23: 36 Siswa Terbagi dalam 6 Kelompok (5/6 Perempuan)
    case 'class_36_students':
      return (
        <div className={`p-4 rounded-2xl border border-indigo-200 bg-gradient-to-b from-indigo-50/60 to-purple-50/40 shadow-sm ${className}`}>
          <div className="flex items-center justify-between mb-3 text-xs font-bold text-indigo-950">
            <span>👥 Kelas 7: 36 Siswa (6 Kelompok Sama Banyak)</span>
            <span className="bg-indigo-600 text-white px-2.5 py-0.5 rounded-full text-[10px]">
              5/6 Bagian Adalah Siswa Perempuan
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 select-none max-w-lg mx-auto">
            {[1, 2, 3, 4, 5, 6].map((groupNum) => {
              const isFemaleGroup = groupNum <= 5;
              return (
                <div
                  key={groupNum}
                  className={`p-2.5 rounded-xl border flex flex-col items-center text-center transition-colors ${
                    isFemaleGroup
                      ? 'bg-purple-100/70 border-purple-300'
                      : 'bg-slate-100 border-slate-300'
                  }`}
                >
                  <span className="text-[11px] font-bold text-slate-800 mb-1">
                    Kelompok {groupNum} (6 Siswa)
                  </span>
                  <div className="flex items-center justify-center gap-1">
                    {[1, 2, 3, 4, 5, 6].map((s) => (
                      <span
                        key={s}
                        className={`w-3 h-3 rounded-full ${
                          isFemaleGroup ? 'bg-purple-600' : 'bg-slate-500'
                        }`}
                        title={isFemaleGroup ? 'Perempuan' : 'Laki-laki'}
                      />
                    ))}
                  </div>
                  <span className={`text-[10px] font-bold mt-1.5 ${isFemaleGroup ? 'text-purple-700' : 'text-slate-600'}`}>
                    {isFemaleGroup ? '5/6 Bagian Perempuan' : '1/6 Bagian Lainnya'}
                  </span>
                </div>
              );
            })}
          </div>
          <p className="text-[11px] text-center text-indigo-900 mt-2 italic font-medium">
            36 siswa ÷ 6 kelompok = 6 siswa per kelompok. 5 kelompok perempuan = 5 × 6 = 30 siswa.
          </p>
        </div>
      );

    default:
      return null;
  }
};
