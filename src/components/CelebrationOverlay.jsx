import React, { useEffect, useRef, useState } from "react";
import confetti from "canvas-confetti";

// Palet warna brand (biru + emas) — bukan rainbow neon
const CONFETTI_COLORS = ["#2D60FF", "#4A90FF", "#6BA3FF", "#FFD700", "#F5C518"];

const CelebrationOverlay = ({ awardees, onDismiss }) => {
  const [visible, setVisible] = useState(false);
  const confettiTimerRef = useRef(null);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 30);
    const onKeyDown = (e) => {
      if (e.key === "Escape") handleDismiss();
    };

    // Satu burst konfeti lembut setelah badge selesai muncul
    confettiTimerRef.current = setTimeout(() => {
      confetti({
        particleCount: 120,
        angle: 90,
        spread: 80,
        startVelocity: 40,
        decay: 0.92,
        ticks: 160,
        scalar: 0.9,
        origin: { x: 0.5, y: 0.45 },
        colors: CONFETTI_COLORS,
        zIndex: 150,
        disableForReducedMotion: true,
      });
    }, 500);

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);
    return () => {
      clearTimeout(timer);
      clearTimeout(confettiTimerRef.current);
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDismiss = () => {
    clearTimeout(confettiTimerRef.current);
    setVisible(false);
    setTimeout(onDismiss, 300);
  };

  // Pasangan nama + skema agar tidak misalign saat ada beasiswa kosong
  const items = (awardees || [])
    .map((a) => ({ name: a?.beasiswa, skema: a?.skema }))
    .filter((item) => item.name);

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-opacity duration-300 ${
        visible ? "opacity-100" : "opacity-0"
      }`}
      role="dialog"
      aria-modal="true"
      aria-label="Pemberitahuan penerima beasiswa"
    >
      <div
        className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm"
        onClick={handleDismiss}
      />

      <style>{`
        @keyframes ov-card-in {
          0% { opacity: 0; transform: translateY(14px) scale(0.97); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
        .ov-card {
          animation: ov-card-in 0.35s cubic-bezier(0.16, 1, 0.3, 1);
        }
        @keyframes ov-check-in {
          0% { transform: scale(0.5); opacity: 0; }
          60% { transform: scale(1.06); }
          100% { transform: scale(1); opacity: 1; }
        }
        .ov-check {
          animation: ov-check-in 0.45s cubic-bezier(0.16, 1, 0.3, 1) 0.12s both;
        }
        @keyframes ov-accent-in {
          0% { transform: scaleX(0); opacity: 0; }
          100% { transform: scaleX(1); opacity: 1; }
        }
        .ov-accent {
          animation: ov-accent-in 0.5s ease-out 0.18s both;
          transform-origin: center;
        }
      `}</style>

      <div
        className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl ov-card overflow-hidden"
        style={{ zIndex: 10 }}
      >
        <div className="ov-accent absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-blue-500 to-transparent" />

        <button
          onClick={handleDismiss}
          aria-label="Tutup"
          className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 14 14"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
          >
            <path d="M1 1l12 12M13 1L1 13" />
          </svg>
        </button>

        <div className="px-8 pt-10 pb-7 text-center">
          <div className="ov-check mx-auto mb-6 w-16 h-16 rounded-full bg-blue-50 ring-1 ring-blue-100 flex items-center justify-center">
            <svg
              width="26"
              height="26"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#2563EB"
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M20 6L9 17l-5-5" />
            </svg>
          </div>

          <h2 className="text-2xl font-semibold tracking-tight text-gray-900 mb-3">
            Selamat!
          </h2>

          <p className="text-sm text-gray-500 leading-relaxed">
            Anda resmi terpilih sebagai
          </p>
          <p className="text-blue-600 font-semibold text-base mb-7">
            Penerima Beasiswa
          </p>

          {items.length > 0 && (
            <div className="text-left bg-gray-50 rounded-xl border border-gray-100 px-5 py-4 mb-7 max-h-52 overflow-y-auto">
              <p className="text-[11px] font-medium uppercase tracking-wider text-gray-400 mb-3">
                Beasiswa
              </p>
              <ul className="space-y-3">
                {items.map((item, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500 flex-shrink-0" />
                    <div className="min-w-0 text-left">
                      <p className="text-sm font-medium text-gray-800 truncate">
                        {item.name}
                      </p>
                      {item.skema && (
                        <p className="text-xs text-gray-400 truncate">
                          {item.skema}
                        </p>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <button
            onClick={handleDismiss}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-3 rounded-xl transition-colors active:scale-[0.99]"
          >
            Selesai
          </button>

          <p className="text-[11px] text-gray-400 mt-3">
            Klik di luar popup untuk menutup
          </p>
        </div>
      </div>
    </div>
  );
};

export default CelebrationOverlay;
