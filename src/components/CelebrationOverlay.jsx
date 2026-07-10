import React, { useEffect, useState } from "react";

const CONFETTI_COLORS = [
  "#2D60FF", "#4A90FF", "#6BA3FF", "#FFD700",
  "#FF6B6B", "#FF9FF3", "#FECA57", "#48DBFB",
  "#FF9F43", "#A29BFE", "#FD79A8", "#00CEC9",
];

const CelebrationOverlay = ({ awardees, onDismiss }) => {
  const [visible, setVisible] = useState(true);
  const [particles, setParticles] = useState([]);
  const [fireworks, setFireworks] = useState([]);
  const [stars, setStars] = useState([]);
  const [glow, setGlow] = useState(false);

  useEffect(() => {
    const confetti = Array.from({ length: 80 }, (_, i) => ({
      id: `c-${i}`,
      left: `${Math.random() * 100}%`,
      color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
      delay: `${Math.random() * 4}s`,
      duration: `${2.5 + Math.random() * 3}s`,
      size: `${6 + Math.random() * 10}px`,
      rotation: `${Math.random() * 360}deg`,
      sway: `${(Math.random() - 0.5) * 200}px`,
      shape: Math.random() > 0.5 ? "50%" : "2px",
    }));
    setParticles(confetti);

    const fws = [
      { id: "fw-1", left: "15%", delay: "0.3s" },
      { id: "fw-2", left: "50%", delay: "0.8s" },
      { id: "fw-3", left: "85%", delay: "1.5s" },
      { id: "fw-4", left: "30%", delay: "2.2s" },
      { id: "fw-5", left: "70%", delay: "2.8s" },
    ];
    setFireworks(fws);

    const starPositions = Array.from({ length: 12 }, (_, i) => ({
      id: `s-${i}`,
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      delay: `${Math.random() * 4}s`,
      size: `${12 + Math.random() * 16}px`,
      duration: `${2 + Math.random() * 2}s`,
    }));
    setStars(starPositions);

    setTimeout(() => setGlow(true), 100);
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  const handleDismiss = () => {
    setVisible(false);
    setTimeout(onDismiss, 400);
  };

  const names = awardees.map((a) => a.beasiswa).filter(Boolean);

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center transition-all duration-500 ${
        visible ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"
      }`}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/60" onClick={handleDismiss} />

      <style>{`
        @keyframes confetti-fall {
          0% { transform: translateY(0) translateX(0) rotate(0deg); opacity: 1; }
          100% { transform: translateY(110vh) translateX(var(--sway)) rotate(720deg); opacity: 0; }
        }
        .animate-confetti {
          animation: confetti-fall linear forwards;
          --sway: 0px;
        }

        @keyframes firework-launch {
          0% { transform: translateY(0) scale(1); opacity: 1; }
          40% { transform: translateY(-200px) scale(1); opacity: 1; }
          50% { transform: translateY(-220px) scale(2); opacity: 0.8; }
          60% { transform: translateY(-200px) scale(3); opacity: 0.4; }
          100% { transform: translateY(-180px) scale(0); opacity: 0; }
        }
        .animate-firework {
          animation: firework-launch 1.5s ease-out forwards;
        }

        @keyframes sparkle {
          0%, 100% { transform: scale(0) rotate(0deg); opacity: 0; }
          50% { transform: scale(1.2) rotate(180deg); opacity: 1; }
        }
        .animate-sparkle {
          animation: sparkle var(--duration) ease-in-out infinite;
          animation-delay: var(--delay);
        }

        @keyframes card-enter {
          0% { transform: scale(0.3) rotate(-5deg); opacity: 0; }
          40% { transform: scale(1.08) rotate(1deg); opacity: 1; }
          60% { transform: scale(0.95) rotate(-0.5deg); }
          80% { transform: scale(1.02) rotate(0.2deg); }
          100% { transform: scale(1) rotate(0deg); opacity: 1; }
        }
        .animate-card {
          animation: card-enter 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }

        @keyframes glow-pulse {
          0%, 100% { box-shadow: 0 0 20px rgba(45, 96, 255, 0.3), 0 0 60px rgba(45, 96, 255, 0.1); }
          50% { box-shadow: 0 0 40px rgba(45, 96, 255, 0.5), 0 0 100px rgba(45, 96, 255, 0.2); }
        }
        .animate-glow {
          animation: glow-pulse 2s ease-in-out infinite;
        }

        @keyframes trophy-bounce {
          0% { transform: translateY(0) scale(1); }
          15% { transform: translateY(-20px) scale(1.1) rotate(-5deg); }
          30% { transform: translateY(0) scale(1) rotate(0); }
          45% { transform: translateY(-15px) scale(1.05) rotate(3deg); }
          60% { transform: translateY(0) scale(1) rotate(0); }
          75% { transform: translateY(-8px); }
          100% { transform: translateY(0); }
        }
        .animate-trophy {
          animation: trophy-bounce 1.2s ease-in-out 0.5s both;
        }

        @keyframes ribbon-slide {
          0% { transform: translateX(-100%) skewX(-15deg); opacity: 0; }
          100% { transform: translateX(0) skewX(-15deg); opacity: 1; }
        }
        .animate-ribbon {
          animation: ribbon-slide 0.6s ease-out 0.3s both;
        }

        @keyframes firework-particle {
          0% { transform: translate(0, 0) scale(1); opacity: 1; }
          100% { transform: translate(var(--x), var(--y)) scale(0); opacity: 0; }
        }
        .animate-fw-particle {
          animation: firework-particle 1.2s ease-out forwards;
        }
      `}</style>

      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute animate-confetti"
          style={{
            left: p.left,
            top: "-10px",
            width: p.size,
            height: p.size,
            backgroundColor: p.color,
            borderRadius: p.shape,
            animationDelay: p.delay,
            animationDuration: p.duration,
            transform: `rotate(${p.rotation})`,
            "--sway": p.sway,
          }}
        />
      ))}

      {fireworks.map((fw) =>
        Array.from({ length: 14 }).map((_, j) => {
          const angle = (j / 14) * Math.PI * 2;
          const dist = 60 + Math.random() * 80;
          return (
            <div
              key={`${fw.id}-${j}`}
              className="absolute animate-fw-particle"
              style={{
                left: fw.left,
                bottom: "10%",
                width: "6px",
                height: "6px",
                borderRadius: "50%",
                backgroundColor: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
            animationDelay: fw.delay,
            "--x": `${Math.cos(angle) * dist}px`,
            "--y": `${Math.sin(angle) * dist}px`,
              }}
            />
          );
        })
      )}

      {stars.map((s) => (
        <div
          key={s.id}
          className="absolute animate-sparkle pointer-events-none"
          style={{
            top: s.top,
            left: s.left,
            animationDelay: s.delay,
            animationDuration: s.duration,
            "--delay": s.delay,
            "--duration": s.duration,
          }}
        >
          <svg width={s.size} height={s.size} viewBox="0 0 100 100">
            <polygon
              points="50,5 61,38 95,38 68,60 79,95 50,75 21,95 32,60 5,38 39,38"
              fill="#FFD700"
              opacity="0.8"
            />
          </svg>
        </div>
      ))}

      <div
        className={`relative bg-white rounded-3xl shadow-2xl p-10 max-w-lg mx-4 text-center animate-card ${
          glow ? "animate-glow" : ""
        }`}
        style={{ zIndex: 10 }}
      >
        <div className="animate-ribbon absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 via-blue-400 to-blue-500 rounded-t-3xl" />

        <div className="w-28 h-28 bg-gradient-to-br from-blue-400 via-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto my-6 shadow-xl animate-trophy">
          <svg width="56" height="56" viewBox="0 0 100 100" fill="none">
            <path d="M50 60C37 60 26 49 26 36V20H74V36C74 49 63 60 50 60Z" fill="white" opacity="0.9"/>
            <path d="M42 65L50 72L58 65L55 78L50 82L45 78L42 65Z" fill="#FFD700"/>
            <path d="M26 20C26 14 30 10 36 10H64C70 10 74 14 74 20" stroke="white" strokeWidth="4" fill="none" opacity="0.9"/>
            <ellipse cx="50" cy="78" rx="12" ry="4" fill="#FFD700" opacity="0.6"/>
          </svg>
        </div>

        <div className="text-5xl mb-2">🎉</div>

        <h2 className="text-3xl font-extrabold text-gray-900 mb-1">
          Selamat!
        </h2>

        <div className="flex items-center justify-center gap-2 mb-1">
          <div className="h-px w-8 bg-blue-300" />
          <p className="text-lg text-gray-700">
            Kamu lolos sebagai{" "}
            <span className="font-bold text-blue-600">Penerima Beasiswa</span>
          </p>
          <div className="h-px w-8 bg-blue-300" />
        </div>

        {names.length > 0 && (
          <div className="mt-5 space-y-2">
            {names.map((name, i) => (
              <div
                key={i}
                className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl px-5 py-3"
              >
                <p className="text-xs text-blue-500 font-medium uppercase tracking-wide">Beasiswa</p>
                <p className="font-semibold text-blue-800 text-base">{name}</p>
              </div>
            ))}
          </div>
        )}

        <div className="flex items-center justify-center gap-3 mt-6 mb-2">
          {["✨", "🌟", "💪", "🔥"].map((emoji, i) => (
            <span key={i} className="text-xl" style={{ animation: `sparkle 1.5s ease-in-out ${i * 0.3}s infinite` }}>
              {emoji}
            </span>
          ))}
        </div>

        <p className="text-sm text-gray-500 mb-6">
          Tetap semangat dan pertahankan prestasi kamu!
        </p>

        <button
          onClick={handleDismiss}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg active:scale-95"
        >
          Lanjutkan
        </button>

        <p className="text-xs text-gray-400 mt-3">Klik di luar popup untuk menutup</p>
      </div>
    </div>
  );
};

export default CelebrationOverlay;
