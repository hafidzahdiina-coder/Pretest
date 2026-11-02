import React, { useEffect, useState, useRef } from 'react';
import { AlertTriangle, Lock, ShieldAlert, Maximize2 } from 'lucide-react';

interface AntiCheatMonitorProps {
  isActive: boolean;
  violations: number;
  onViolation: (reason: string) => void;
  onMaxViolationsReached: () => void;
  maxViolations?: number;
}

export const AntiCheatMonitor: React.FC<AntiCheatMonitorProps> = ({
  isActive,
  violations,
  onViolation,
  onMaxViolationsReached,
  maxViolations = 3,
}) => {
  const [showWarningModal, setShowWarningModal] = useState(false);
  const [lastViolationReason, setLastViolationReason] = useState('');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const lastEventTimeRef = useRef<number>(0);

  // Monitor visibility & blur
  useEffect(() => {
    if (!isActive) return;

    const recordViolation = (reason: string) => {
      const now = Date.now();
      // Debounce window blur + visibility change happening within 1.5 seconds
      if (now - lastEventTimeRef.current < 1500) {
        return;
      }
      lastEventTimeRef.current = now;

      setLastViolationReason(reason);
      setShowWarningModal(true);
      onViolation(reason);
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        recordViolation('Terdeteksi beralih ke tab / aplikasi lain (Visibility Change)');
      }
    };

    const handleWindowBlur = () => {
      recordViolation('Fokus jendela browser terlepas / membuka jendela lain (Window Blur)');
    };

    const handleFullscreenChange = () => {
      const fs = !!document.fullscreenElement;
      setIsFullscreen(fs);
      if (!fs && isActive) {
        recordViolation('Keluar dari mode Layar Penuh (Fullscreen Exited)');
      }
    };

    // Prevent context menu (right click) & copy shortcuts during exam
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      // Block Ctrl+C, Ctrl+V, Ctrl+U, F12, Ctrl+Shift+I
      if (
        (e.ctrlKey && ['c', 'v', 'u', 'a', 'p', 's'].includes(e.key.toLowerCase())) ||
        e.key === 'F12' ||
        (e.ctrlKey && e.shiftKey && ['i', 'j', 'c'].includes(e.key.toLowerCase()))
      ) {
        e.preventDefault();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', handleWindowBlur);
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    window.addEventListener('contextmenu', handleContextMenu);
    window.addEventListener('keydown', handleKeyDown);

    // Initial fullscreen check
    setIsFullscreen(!!document.fullscreenElement);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handleWindowBlur);
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      window.removeEventListener('contextmenu', handleContextMenu);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isActive, onViolation]);

  // Check if reached max violations
  useEffect(() => {
    if (isActive && violations >= maxViolations) {
      setShowWarningModal(false);
      onMaxViolationsReached();
    }
  }, [violations, maxViolations, isActive, onMaxViolationsReached]);

  const requestFullscreen = async () => {
    try {
      if (!document.fullscreenElement && document.documentElement.requestFullscreen) {
        await document.documentElement.requestFullscreen();
        setIsFullscreen(true);
      }
    } catch {
      // User or browser permission restriction, proceed gracefully
    }
  };

  if (!isActive) return null;

  return (
    <>
      {/* Real-time Header Integrity Indicator */}
      <div className="flex items-center gap-2">
        <div
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${
            violations === 0
              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
              : violations === 1
              ? 'bg-amber-50 text-amber-700 border-amber-300 animate-pulse'
              : 'bg-rose-50 text-rose-700 border-rose-300 animate-bounce'
          }`}
        >
          <ShieldAlert className="w-3.5 h-3.5" />
          <span>
            Integritas: {violations}/{maxViolations} Pelanggaran
          </span>
        </div>

        {!isFullscreen && (
          <button
            type="button"
            onClick={requestFullscreen}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200 hover:bg-indigo-100 transition-colors"
            title="Kunci Layar Penuh (Fullscreen)"
          >
            <Maximize2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Kunci Layar Penuh</span>
          </button>
        )}
      </div>

      {/* Emergency Tab Switch Warning Modal */}
      {showWarningModal && violations < maxViolations && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 text-slate-800 shadow-2xl border-2 border-rose-500 animate-in fade-in zoom-in-95 duration-200">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mb-4">
              <AlertTriangle className="w-8 h-8" />
            </div>

            <h3 className="text-xl font-bold text-center text-rose-700 mb-1">
              PERINGATAN ANTI-CHEATING
            </h3>
            <p className="text-center text-xs font-bold uppercase tracking-wider text-rose-500 mb-3">
              Pelanggaran {violations} dari {maxViolations} Batas Toleransi
            </p>

            <div className="bg-rose-50 border border-rose-200 rounded-xl p-3 mb-4 text-xs text-rose-800">
              <p className="font-semibold mb-1">Alasan Terdeteksi:</p>
              <p className="italic">{lastViolationReason}</p>
            </div>

            <p className="text-sm text-slate-600 mb-5 text-center leading-relaxed">
              Anda terdeteksi meninggalkan halaman ujian atau keluar dari mode layar penuh.
              <span className="block font-bold text-slate-800 mt-1">
                Jika terdeteksi berpindah tab sebanyak 3 kali, sistem akan otomatis menghentikan ujian Anda dan mengirimkan hasil saat ini!
              </span>
            </p>

            <div className="flex flex-col gap-2">
              <button
                type="button"
                onClick={() => {
                  setShowWarningModal(false);
                  requestFullscreen();
                }}
                className="w-full py-3 px-4 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2"
              >
                <Lock className="w-4 h-4" />
                Saya Mengerti & Kembali ke Ujian
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
