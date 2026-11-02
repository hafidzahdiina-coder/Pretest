import React from 'react';

interface AdventureIllustrationProps {
  postId: 'pos1' | 'pos3' | 'pos4' | 'pos6' | 'pos7';
  className?: string;
  showCaption?: boolean;
}

export const AdventureIllustration: React.FC<AdventureIllustrationProps> = ({
  postId,
  className = '',
  showCaption = true,
}) => {
  switch (postId) {
    case 'pos1':
      return (
        <div className={`rounded-2xl border border-amber-200/80 bg-gradient-to-b from-sky-50 via-amber-50/40 to-emerald-50/50 p-4 shadow-sm ${className}`}>
          <div className="flex items-center justify-between mb-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-500 text-white shadow-sm">
              🍎 Pos 1 • Kebun Buah
            </span>
            <span className="text-xs font-medium text-slate-500">Total Apel: 12 Buah</span>
          </div>

          <svg viewBox="0 0 520 220" className="w-full h-auto max-h-56 mx-auto drop-shadow-sm select-none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="skyGrad1" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#dbeafe" />
                <stop offset="100%" stopColor="#fef3c7" />
              </linearGradient>
              <linearGradient id="grassGrad1" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#4ade80" />
                <stop offset="100%" stopColor="#16a34a" />
              </linearGradient>
              <radialGradient id="sunGrad1" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#fef08a" />
                <stop offset="100%" stopColor="#f59e0b" />
              </radialGradient>
              <linearGradient id="trunkGrad1" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#78350f" />
                <stop offset="100%" stopColor="#92400e" />
              </linearGradient>
              <radialGradient id="appleGrad" cx="35%" cy="35%" r="65%">
                <stop offset="0%" stopColor="#f87171" />
                <stop offset="80%" stopColor="#dc2626" />
                <stop offset="100%" stopColor="#991b1b" />
              </radialGradient>
              <linearGradient id="basketGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#d97706" />
                <stop offset="100%" stopColor="#92400e" />
              </linearGradient>
            </defs>

            {/* Background Sky & Sun */}
            <rect width="520" height="220" rx="16" fill="url(#skyGrad1)" />
            <circle cx="460" cy="40" r="28" fill="url(#sunGrad1)" opacity="0.9" />
            {/* Sun rays */}
            {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
              <line
                key={i}
                x1={460 + 34 * Math.cos((angle * Math.PI) / 180)}
                y1={40 + 34 * Math.sin((angle * Math.PI) / 180)}
                x2={460 + 44 * Math.cos((angle * Math.PI) / 180)}
                y2={40 + 44 * Math.sin((angle * Math.PI) / 180)}
                stroke="#f59e0b"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            ))}

            {/* Hills & Grass */}
            <path d="M0,175 Q150,155 300,170 T520,165 L520,220 L0,220 Z" fill="url(#grassGrad1)" />
            <path d="M0,185 Q260,170 520,185 L520,220 L0,220 Z" fill="#15803d" opacity="0.5" />

            {/* Apple Tree */}
            <path d="M120,185 L120,110 Q120,95 105,85 L135,85 Q120,95 120,110 L120,185" fill="url(#trunkGrad1)" stroke="#451a03" strokeWidth="2" />
            {/* Tree foliage */}
            <circle cx="120" cy="80" r="45" fill="#22c55e" stroke="#15803d" strokeWidth="2.5" />
            <circle cx="85" cy="90" r="32" fill="#16a34a" />
            <circle cx="155" cy="90" r="32" fill="#16a34a" />
            <circle cx="120" cy="55" r="30" fill="#4ade80" />

            {/* Apples remaining on tree (5 apples) */}
            <g transform="translate(100, 60)">
              <circle cx="0" cy="0" r="7" fill="url(#appleGrad)" stroke="#7f1d1d" strokeWidth="1" />
              <path d="M0,-7 Q2,-10 4,-8" stroke="#15803d" strokeWidth="1.5" fill="none" />
            </g>
            <g transform="translate(135, 65)">
              <circle cx="0" cy="0" r="7" fill="url(#appleGrad)" stroke="#7f1d1d" strokeWidth="1" />
              <path d="M0,-7 Q2,-10 4,-8" stroke="#15803d" strokeWidth="1.5" fill="none" />
            </g>
            <g transform="translate(80, 85)">
              <circle cx="0" cy="0" r="7" fill="url(#appleGrad)" stroke="#7f1d1d" strokeWidth="1" />
              <path d="M0,-7 Q2,-10 4,-8" stroke="#15803d" strokeWidth="1.5" fill="none" />
            </g>
            <g transform="translate(115, 95)">
              <circle cx="0" cy="0" r="7" fill="url(#appleGrad)" stroke="#7f1d1d" strokeWidth="1" />
              <path d="M0,-7 Q2,-10 4,-8" stroke="#15803d" strokeWidth="1.5" fill="none" />
            </g>
            <g transform="translate(150, 90)">
              <circle cx="0" cy="0" r="7" fill="url(#appleGrad)" stroke="#7f1d1d" strokeWidth="1" />
              <path d="M0,-7 Q2,-10 4,-8" stroke="#15803d" strokeWidth="1.5" fill="none" />
            </g>

            {/* Label Tree: Tersisa di pohon */}
            <rect x="55" y="188" width="130" height="22" rx="6" fill="#0f172a" opacity="0.85" />
            <text x="120" y="203" fill="#ffffff" fontSize="10.5" fontWeight="bold" textAnchor="middle">
              Tersisa di pohon = ?
            </text>

            {/* Basket Section (Keranjang: apel yang sudah dipetik = 7 buah) */}
            <g transform="translate(320, 115)">
              {/* Basket Body */}
              <polygon points="20,40 100,40 90,82 30,82" fill="url(#basketGrad)" stroke="#78350f" strokeWidth="2.5" />
              {/* Weave pattern lines */}
              <line x1="30" y1="52" x2="90" y2="52" stroke="#b45309" strokeWidth="1.5" />
              <line x1="33" y1="66" x2="87" y2="66" stroke="#b45309" strokeWidth="1.5" />
              <line x1="45" y1="40" x2="40" y2="82" stroke="#b45309" strokeWidth="1.5" />
              <line x1="60" y1="40" x2="60" y2="82" stroke="#b45309" strokeWidth="1.5" />
              <line x1="75" y1="40" x2="80" y2="82" stroke="#b45309" strokeWidth="1.5" />

              {/* 7 Harvested Apples in/on Basket */}
              {[
                { x: 34, y: 32 },
                { x: 50, y: 30 },
                { x: 68, y: 31 },
                { x: 86, y: 34 },
                { x: 42, y: 18 },
                { x: 60, y: 16 },
                { x: 76, y: 19 },
              ].map((pos, idx) => (
                <g key={idx} transform={`translate(${pos.x}, ${pos.y})`}>
                  <circle cx="0" cy="0" r="8" fill="url(#appleGrad)" stroke="#7f1d1d" strokeWidth="1" />
                  <path d="M0,-8 Q2,-11 4,-9" stroke="#15803d" strokeWidth="1.5" fill="none" />
                </g>
              ))}

              {/* Basket Label */}
              <rect x="0" y="-18" width="120" height="20" rx="5" fill="#fef08a" stroke="#ca8a04" strokeWidth="1" />
              <text x="60" y="-4" fill="#854d0e" fontSize="9" fontWeight="bold" textAnchor="middle">
                Keranjang: 7 apel dipetik
              </text>
            </g>

            {/* Total Indicator Badge */}
            <rect x="200" y="16" width="120" height="24" rx="8" fill="#ffffff" stroke="#e2e8f0" strokeWidth="1.5" />
            <text x="260" y="32" fill="#0f172a" fontSize="10.5" fontWeight="bold" textAnchor="middle">
              Total apel = 12
            </text>
          </svg>
          {showCaption && (
            <p className="text-xs text-center text-slate-600 mt-1 italic">
              Amati pohon dan keranjang: Dari total 12 apel, 7 apel sudah berada di keranjang.
            </p>
          )}
        </div>
      );

    case 'pos3':
      return (
        <div className={`rounded-2xl border border-blue-200/80 bg-gradient-to-b from-sky-50 via-cyan-50/40 to-emerald-50/50 p-4 shadow-sm ${className}`}>
          <div className="flex items-center justify-between mb-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-sky-600 text-white shadow-sm">
              🌉 Pos 3 • Jembatan
            </span>
            <span className="text-xs font-medium text-slate-500">Konstruksi 4 Bagian</span>
          </div>

          <svg viewBox="0 0 520 220" className="w-full h-auto max-h-56 mx-auto drop-shadow-sm select-none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="riverGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#38bdf8" />
                <stop offset="100%" stopColor="#0284c7" />
              </linearGradient>
              <linearGradient id="woodPlank" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#d97706" />
                <stop offset="100%" stopColor="#92400e" />
              </linearGradient>
            </defs>

            {/* River & Banks */}
            <rect width="520" height="220" rx="16" fill="#f0fdf4" />
            {/* River */}
            <rect x="150" y="0" width="220" height="220" fill="url(#riverGrad)" />

            {/* River waves */}
            {[40, 80, 120, 160, 200].map((y, i) => (
              <path
                key={i}
                d={`M170,${y} q20,-8 40,0 t40,0 t40,0 t40,0`}
                stroke="#bae6fd"
                strokeWidth="2.5"
                fill="none"
                opacity="0.75"
              />
            ))}

            {/* Left Bank & Tree */}
            <rect x="0" y="0" width="150" height="220" fill="#22c55e" />
            <circle cx="60" cy="110" r="45" fill="#15803d" />
            <circle cx="95" cy="130" r="35" fill="#16a34a" />
            <rect x="70" y="140" width="16" height="50" fill="#78350f" rx="3" />

            {/* Right Bank & Tree */}
            <rect x="370" y="0" width="150" height="220" fill="#22c55e" />
            <circle cx="450" cy="100" r="40" fill="#15803d" />
            <rect x="442" y="130" width="16" height="60" fill="#78350f" rx="3" />

            {/* Sun */}
            <circle cx="460" cy="35" r="22" fill="#fbbf24" />

            {/* Banner: Jembatan dibangun dari 4 bagian kayu yang sama besar */}
            <rect x="100" y="18" width="320" height="26" rx="8" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1.5" />
            <text x="260" y="35" fill="#0f172a" fontSize="11" fontWeight="bold" textAnchor="middle">
              Jembatan dibangun dari 4 bagian kayu yang sama besar
            </text>

            {/* Bridge Framework Structure */}
            {/* Posts / Pillars in the water */}
            <rect x="195" y="105" width="12" height="65" fill="#78350f" rx="2" />
            <rect x="250" y="105" width="12" height="65" fill="#78350f" rx="2" />
            <rect x="305" y="105" width="12" height="65" fill="#78350f" rx="2" />

            {/* Handrails */}
            <line x1="130" y1="80" x2="385" y2="80" stroke="#78350f" strokeWidth="4" />
            {[140, 195, 250, 305, 360, 380].map((x, i) => (
              <line key={i} x1={x} y1="80" x2={x} y2="105" stroke="#78350f" strokeWidth="3" />
            ))}

            {/* 4 Bridge Sections */}
            {/* Section 1: Terpasang */}
            <rect x="140" y="100" width="55" height="18" fill="url(#woodPlank)" stroke="#451a03" strokeWidth="1.5" rx="3" />
            <text x="167" y="113" fill="#ffffff" fontSize="9" fontWeight="bold" textAnchor="middle">Bagian 1</text>

            {/* Section 2: Terpasang */}
            <rect x="200" y="100" width="55" height="18" fill="url(#woodPlank)" stroke="#451a03" strokeWidth="1.5" rx="3" />
            <text x="227" y="113" fill="#ffffff" fontSize="9" fontWeight="bold" textAnchor="middle">Bagian 2</text>

            {/* Section 3: Terpasang */}
            <rect x="260" y="100" width="55" height="18" fill="url(#woodPlank)" stroke="#451a03" strokeWidth="1.5" rx="3" />
            <text x="287" y="113" fill="#ffffff" fontSize="9" fontWeight="bold" textAnchor="middle">Bagian 3</text>

            {/* Section 4: BELUM TERPASANG (Kosong / Tanda Tanya) */}
            <rect x="320" y="100" width="55" height="18" fill="#fef2f2" stroke="#dc2626" strokeWidth="2" strokeDasharray="4,3" rx="3" />
            <text x="347" y="114" fill="#dc2626" fontSize="13" fontWeight="900" textAnchor="middle">?</text>

            {/* Sub-label under bridge */}
            <rect x="140" y="130" width="175" height="22" rx="5" fill="#ecfdf5" stroke="#10b981" strokeWidth="1" />
            <text x="227" y="145" fill="#047857" fontSize="9.5" fontWeight="bold" textAnchor="middle">
              ✓ 3 bagian sudah terpasang
            </text>

            <rect x="320" y="130" width="60" height="22" rx="5" fill="#fff1f2" stroke="#f43f5e" strokeWidth="1" />
            <text x="350" y="145" fill="#be123c" fontSize="9.5" fontWeight="bold" textAnchor="middle">
              Belum
            </text>
          </svg>
          {showCaption && (
            <p className="text-xs text-center text-slate-600 mt-1 italic">
              Ada 4 petak kayu berukuran sama besar: 3 petak telah terpasang dan 1 petak belum terpasang.
            </p>
          )}
        </div>
      );

    case 'pos4':
      return (
        <div className={`rounded-2xl border border-purple-200/80 bg-gradient-to-b from-slate-900 via-indigo-950 to-slate-900 p-4 shadow-sm text-white ${className}`}>
          <div className="flex items-center justify-between mb-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-purple-600 text-white shadow-sm">
              💎 Pos 4 • Gua Rahasia
            </span>
            <span className="text-xs font-medium text-purple-200">3 Kantong Permata</span>
          </div>

          <svg viewBox="0 0 520 220" className="w-full h-auto max-h-56 mx-auto drop-shadow-md select-none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="caveBg" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#1e1b4b" />
                <stop offset="100%" stopColor="#0f172a" />
              </linearGradient>
              <radialGradient id="gemPurple" cx="35%" cy="35%" r="65%">
                <stop offset="0%" stopColor="#f472b6" />
                <stop offset="100%" stopColor="#9333ea" />
              </radialGradient>
              <radialGradient id="gemBlue" cx="35%" cy="35%" r="65%">
                <stop offset="0%" stopColor="#67e8f9" />
                <stop offset="100%" stopColor="#0284c7" />
              </radialGradient>
              <radialGradient id="gemGreen" cx="35%" cy="35%" r="65%">
                <stop offset="0%" stopColor="#86efac" />
                <stop offset="100%" stopColor="#16a34a" />
              </radialGradient>
            </defs>

            {/* Cave background */}
            <rect width="520" height="220" rx="16" fill="url(#caveBg)" />

            {/* Stalactites (ceiling) */}
            <polygon points="40,0 60,35 70,0" fill="#312e81" />
            <polygon points="120,0 145,50 160,0" fill="#3730a3" />
            <polygon points="230,0 250,40 270,0" fill="#312e81" />
            <polygon points="340,0 365,55 380,0" fill="#3730a3" />
            <polygon points="440,0 460,35 480,0" fill="#312e81" />

            {/* Glowing Crystals on Ground */}
            <polygon points="20,210 30,175 40,210" fill="#a855f7" opacity="0.8" />
            <polygon points="480,210 490,170 500,210" fill="#38bdf8" opacity="0.8" />

            {/* Kantong 1 (2/5) */}
            <g transform="translate(45, 45)">
              <rect x="0" y="0" width="125" height="145" rx="12" fill="#1e1b4b" stroke="#a855f7" strokeWidth="1.5" />
              {/* Bag Pouch */}
              <path d="M42,25 C30,35 25,60 30,85 C35,100 85,100 90,85 C95,60 90,35 78,25 Z" fill="#7c2d12" stroke="#ea580c" strokeWidth="1.5" />
              <rect x="45" y="22" width="30" height="7" rx="3" fill="#facc15" />
              {/* Gems */}
              <rect x="52" y="48" width="12" height="12" rx="2" transform="rotate(45 58 54)" fill="url(#gemPurple)" stroke="#ffffff" strokeWidth="0.8" />
              <rect x="68" y="58" width="12" height="12" rx="2" transform="rotate(45 74 64)" fill="url(#gemPurple)" stroke="#ffffff" strokeWidth="0.8" />

              <text x="62" y="18" fill="#f472b6" fontSize="10.5" fontWeight="bold" textAnchor="middle">Kantong 1</text>
              <text x="62" y="113" fill="#ffffff" fontSize="11" fontWeight="bold" textAnchor="middle">2/5 bagian</text>

              {/* Grid 5 parts (2 filled) */}
              <g transform="translate(18, 122)">
                <rect x="0" y="0" width="17" height="12" fill="#a855f7" stroke="#cbd5e1" strokeWidth="0.8" />
                <rect x="17" y="0" width="17" height="12" fill="#a855f7" stroke="#cbd5e1" strokeWidth="0.8" />
                <rect x="34" y="0" width="17" height="12" fill="#334155" stroke="#cbd5e1" strokeWidth="0.8" />
                <rect x="51" y="0" width="17" height="12" fill="#334155" stroke="#cbd5e1" strokeWidth="0.8" />
                <rect x="68" y="0" width="17" height="12" fill="#334155" stroke="#cbd5e1" strokeWidth="0.8" />
              </g>
            </g>

            {/* Kantong 2 (1/5) */}
            <g transform="translate(195, 45)">
              <rect x="0" y="0" width="125" height="145" rx="12" fill="#1e1b4b" stroke="#38bdf8" strokeWidth="1.5" />
              {/* Bag Pouch */}
              <path d="M42,25 C30,35 25,60 30,85 C35,100 85,100 90,85 C95,60 90,35 78,25 Z" fill="#475569" stroke="#94a3b8" strokeWidth="1.5" />
              <rect x="45" y="22" width="30" height="7" rx="3" fill="#facc15" />
              {/* 1 Gem */}
              <rect x="60" y="52" width="13" height="13" rx="2" transform="rotate(45 66 58)" fill="url(#gemBlue)" stroke="#ffffff" strokeWidth="0.8" />

              <text x="62" y="18" fill="#38bdf8" fontSize="10.5" fontWeight="bold" textAnchor="middle">Kantong 2</text>
              <text x="62" y="113" fill="#ffffff" fontSize="11" fontWeight="bold" textAnchor="middle">1/5 bagian</text>

              {/* Grid 5 parts (1 filled) */}
              <g transform="translate(18, 122)">
                <rect x="0" y="0" width="17" height="12" fill="#0284c7" stroke="#cbd5e1" strokeWidth="0.8" />
                <rect x="17" y="0" width="17" height="12" fill="#334155" stroke="#cbd5e1" strokeWidth="0.8" />
                <rect x="34" y="0" width="17" height="12" fill="#334155" stroke="#cbd5e1" strokeWidth="0.8" />
                <rect x="51" y="0" width="17" height="12" fill="#334155" stroke="#cbd5e1" strokeWidth="0.8" />
                <rect x="68" y="0" width="17" height="12" fill="#334155" stroke="#cbd5e1" strokeWidth="0.8" />
              </g>
            </g>

            {/* Kantong 3 (2/5) */}
            <g transform="translate(345, 45)">
              <rect x="0" y="0" width="125" height="145" rx="12" fill="#1e1b4b" stroke="#4ade80" strokeWidth="1.5" />
              {/* Bag Pouch */}
              <path d="M42,25 C30,35 25,60 30,85 C35,100 85,100 90,85 C95,60 90,35 78,25 Z" fill="#14532d" stroke="#22c55e" strokeWidth="1.5" />
              <rect x="45" y="22" width="30" height="7" rx="3" fill="#facc15" />
              {/* 2 Gems */}
              <rect x="52" y="48" width="12" height="12" rx="2" transform="rotate(45 58 54)" fill="url(#gemGreen)" stroke="#ffffff" strokeWidth="0.8" />
              <rect x="68" y="58" width="12" height="12" rx="2" transform="rotate(45 74 64)" fill="url(#gemGreen)" stroke="#ffffff" strokeWidth="0.8" />

              <text x="62" y="18" fill="#4ade80" fontSize="10.5" fontWeight="bold" textAnchor="middle">Kantong 3</text>
              <text x="62" y="113" fill="#ffffff" fontSize="11" fontWeight="bold" textAnchor="middle">2/5 bagian</text>

              {/* Grid 5 parts (2 filled) */}
              <g transform="translate(18, 122)">
                <rect x="0" y="0" width="17" height="12" fill="#16a34a" stroke="#cbd5e1" strokeWidth="0.8" />
                <rect x="17" y="0" width="17" height="12" fill="#16a34a" stroke="#cbd5e1" strokeWidth="0.8" />
                <rect x="34" y="0" width="17" height="12" fill="#334155" stroke="#cbd5e1" strokeWidth="0.8" />
                <rect x="51" y="0" width="17" height="12" fill="#334155" stroke="#cbd5e1" strokeWidth="0.8" />
                <rect x="68" y="0" width="17" height="12" fill="#334155" stroke="#cbd5e1" strokeWidth="0.8" />
              </g>
            </g>
          </svg>
          {showCaption && (
            <p className="text-xs text-center text-purple-200 mt-1 italic">
              Kantong 1 = 2/5, Kantong 2 = 1/5, Kantong 3 = 2/5. Total ketiganya adalah 2/5 + 1/5 + 2/5 = 5/5 = 1 utuh.
            </p>
          )}
        </div>
      );

    case 'pos6':
      return (
        <div className={`rounded-2xl border border-emerald-200/80 bg-gradient-to-b from-sky-50 via-lime-50/40 to-emerald-50 p-4 shadow-sm ${className}`}>
          <div className="flex items-center justify-between mb-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-600 text-white shadow-sm">
              🐮 Pos 6 • Peternakan
            </span>
            <span className="text-xs font-medium text-slate-500">Populasi: 12 Sapi</span>
          </div>

          <svg viewBox="0 0 520 220" className="w-full h-auto max-h-56 mx-auto drop-shadow-sm select-none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="farmSky" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#bae6fd" />
                <stop offset="100%" stopColor="#fef08a" />
              </linearGradient>
            </defs>

            {/* Farm sky */}
            <rect width="520" height="220" rx="16" fill="url(#farmSky)" />
            <circle cx="450" cy="35" r="22" fill="#f59e0b" />

            {/* Green Meadow */}
            <path d="M0,90 Q150,75 300,85 T520,80 L520,220 L0,220 Z" fill="#22c55e" />
            <path d="M0,110 Q260,95 520,110 L520,220 L0,220 Z" fill="#16a34a" />

            {/* Red Barn on the Right */}
            <g transform="translate(370, 45)">
              {/* Roof */}
              <polygon points="10,40 55,5 100,40" fill="#991b1b" stroke="#7f1d1d" strokeWidth="2" />
              {/* Building walls */}
              <rect x="20" y="40" width="70" height="50" fill="#dc2626" stroke="#7f1d1d" strokeWidth="1.5" />
              {/* White Cross Door */}
              <rect x="42" y="55" width="26" height="35" fill="#f8fafc" stroke="#475569" strokeWidth="1" />
              <line x1="42" y1="55" x2="68" y2="90" stroke="#991b1b" strokeWidth="2" />
              <line x1="68" y1="55" x2="42" y2="90" stroke="#991b1b" strokeWidth="2" />
            </g>

            {/* Wooden Fence */}
            <line x1="10" y1="105" x2="360" y2="105" stroke="#92400e" strokeWidth="3" />
            <line x1="10" y1="120" x2="360" y2="120" stroke="#92400e" strokeWidth="3" />
            {[20, 60, 100, 140, 180, 220, 260, 300, 340].map((x, i) => (
              <line key={i} x1={x} y1="95" x2={x} y2="135" stroke="#78350f" strokeWidth="3.5" strokeLinecap="round" />
            ))}

            {/* Badge: Peternakan: 12 sapi */}
            <rect x="180" y="16" width="160" height="25" rx="8" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1.5" />
            <text x="260" y="33" fill="#0f172a" fontSize="11" fontWeight="bold" textAnchor="middle">
              Peternakan: 12 sapi
            </text>

            {/* 12 Cows grid (3 rows of 4 cows) */}
            {[
              // Baris 1: 4 sapi (sapi dijual = 1/3 x 12 = 4 ekor)
              { x: 50, y: 140, tag: 'Dijual' },
              { x: 105, y: 140, tag: 'Dijual' },
              { x: 160, y: 140, tag: 'Dijual' },
              { x: 215, y: 140, tag: 'Dijual' },
              // Baris 2: 4 sapi (diberikan ke panti = 1/2 x 8 = 4 ekor)
              { x: 50, y: 168, tag: 'Panti' },
              { x: 105, y: 168, tag: 'Panti' },
              { x: 160, y: 168, tag: 'Panti' },
              { x: 215, y: 168, tag: 'Panti' },
              // Baris 3: 4 sapi sisa akhir
              { x: 275, y: 150, tag: 'Sisa' },
              { x: 330, y: 150, tag: 'Sisa' },
              { x: 275, y: 180, tag: 'Sisa' },
              { x: 330, y: 180, tag: 'Sisa' },
            ].map((c, i) => (
              <g key={i} transform={`translate(${c.x}, ${c.y})`}>
                {/* Cow body */}
                <ellipse cx="18" cy="12" rx="16" ry="10" fill="#ffffff" stroke="#334155" strokeWidth="1.2" />
                {/* Black spots */}
                <ellipse cx="14" cy="9" rx="5" ry="4" fill="#0f172a" />
                <ellipse cx="24" cy="13" rx="4" ry="3" fill="#0f172a" />
                {/* Cow head */}
                <circle cx="5" cy="8" r="7" fill="#ffffff" stroke="#334155" strokeWidth="1" />
                <circle cx="3" cy="7" r="1.2" fill="#0f172a" />
                {/* Ears / horns */}
                <path d="M4,2 L1,5" stroke="#f59e0b" strokeWidth="1.5" />
                <path d="M7,2 L9,5" stroke="#f59e0b" strokeWidth="1.5" />
                {/* Legs */}
                <line x1="8" y1="21" x2="8" y2="26" stroke="#334155" strokeWidth="1.5" />
                <line x1="14" y1="21" x2="14" y2="26" stroke="#334155" strokeWidth="1.5" />
                <line x1="22" y1="21" x2="22" y2="26" stroke="#334155" strokeWidth="1.5" />
                <line x1="28" y1="21" x2="28" y2="26" stroke="#334155" strokeWidth="1.5" />
              </g>
            ))}

            {/* Explanation Pills */}
            <rect x="25" y="196" width="240" height="18" rx="4" fill="#fef08a" opacity="0.95" />
            <text x="145" y="209" fill="#854d0e" fontSize="9" fontWeight="bold" textAnchor="middle">
              1/3 dijual (4 sapi) • Sisa = 8 sapi • 1/2 sisa ke panti (4 sapi)
            </text>
          </svg>
          {showCaption && (
            <p className="text-xs text-center text-slate-600 mt-1 italic">
              Total 12 ekor sapi: 1/3 dijual (4 sapi). Sisa = 8 sapi. Dari 8 sapi yang tersisa, 1/2 diberikan ke panti asuhan (4 sapi).
            </p>
          )}
        </div>
      );

    case 'pos7':
      return (
        <div className={`rounded-2xl border border-sky-300/80 bg-gradient-to-b from-sky-100 via-blue-50 to-blue-200 p-4 shadow-sm ${className}`}>
          <div className="flex items-center justify-between mb-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-600 text-white shadow-sm">
              🚢 Pos 7 • Kapal
            </span>
            <span className="text-xs font-medium text-slate-600">Muatan Beras</span>
          </div>

          <svg viewBox="0 0 520 220" className="w-full h-auto max-h-56 mx-auto drop-shadow-sm select-none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="seaGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#0284c7" />
                <stop offset="100%" stopColor="#0369a1" />
              </linearGradient>
              <linearGradient id="shipHull" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#dc2626" />
                <stop offset="100%" stopColor="#991b1b" />
              </linearGradient>
            </defs>

            {/* Sky & Clouds */}
            <rect width="520" height="220" rx="16" fill="#e0f2fe" />
            {/* Sun */}
            <circle cx="440" cy="40" r="22" fill="#fbbf24" />
            {/* Seagulls */}
            <path d="M190,45 Q198,38 206,45 Q214,38 222,45" stroke="#64748b" strokeWidth="1.5" fill="none" />
            <path d="M235,55 Q241,50 247,55 Q253,50 259,55" stroke="#64748b" strokeWidth="1.5" fill="none" />

            {/* Sea Waves Background */}
            <path d="M0,135 Q130,120 260,135 T520,135 L520,220 L0,220 Z" fill="url(#seaGrad)" />
            {/* Sea wave crests */}
            {[155, 175, 195].map((y, i) => (
              <path
                key={i}
                d={`M0,${y} q25,-6 50,0 t50,0 t50,0 t50,0 t50,0 t50,0 t50,0 t50,0 t50,0 t50,0 t50,0`}
                stroke="#7dd3fc"
                strokeWidth="2"
                fill="none"
                opacity="0.6"
              />
            ))}

            {/* Cargo Ship */}
            <g transform="translate(90, 65)">
              {/* Cabin */}
              <rect x="230" y="25" width="55" height="40" fill="#f8fafc" stroke="#334155" strokeWidth="1.5" rx="3" />
              {/* Portholes */}
              <circle cx="245" cy="42" r="4.5" fill="#38bdf8" stroke="#334155" strokeWidth="1" />
              <circle cx="260" cy="42" r="4.5" fill="#38bdf8" stroke="#334155" strokeWidth="1" />
              <circle cx="275" cy="42" r="4.5" fill="#38bdf8" stroke="#334155" strokeWidth="1" />
              {/* Smokestack */}
              <rect x="245" y="8" width="16" height="18" fill="#ea580c" stroke="#9a3412" strokeWidth="1.2" />
              <rect x="243" y="6" width="20" height="4" fill="#0f172a" />

              {/* Rice Sacks on Deck (9 karung = 9 × 1/4 ton = 2 1/4 ton) */}
              <rect x="35" y="42" width="185" height="22" rx="4" fill="#fef3c7" stroke="#b45309" strokeWidth="1" />
              <text x="127" y="57" fill="#78350f" fontSize="10" fontWeight="bold" textAnchor="middle">
                1 karung = 1/4 ton (Total 9 karung = 2 1/4 ton)
              </text>

              {/* Stacks of sacks */}
              {[45, 65, 85, 105, 125, 145, 165, 185, 205].map((x, i) => (
                <rect key={i} x={x} y="32" width="16" height="10" rx="2" fill="#fde68a" stroke="#d97706" strokeWidth="1" />
              ))}

              {/* Ship Hull */}
              <polygon points="10,65 330,65 295,105 45,105" fill="url(#shipHull)" stroke="#7f1d1d" strokeWidth="2" />
              {/* White waterline stripe */}
              <line x1="28" y1="85" x2="312" y2="85" stroke="#ffffff" strokeWidth="2.5" />
            </g>

            {/* Bottom Caption Pill */}
            <rect x="150" y="180" width="220" height="24" rx="6" fill="#0f172a" opacity="0.9" />
            <text x="260" y="196" fill="#ffffff" fontSize="10.5" fontWeight="bold" textAnchor="middle">
              Muatan awal: 2 1/4 ton beras (Sisa: 3/4 awal)
            </text>
          </svg>
          {showCaption && (
            <p className="text-xs text-center text-slate-700 mt-1 italic">
              Kapal membawa 2 1/4 ton beras (9/4 ton). Setelah perjalanan, sisa beras adalah 3/4 dari jumlah awal.
            </p>
          )}
        </div>
      );

    default:
      return null;
  }
};
