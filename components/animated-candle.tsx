export default function AnimatedCandle({ className }: { className?: string }) {
  return (
    <div className={className}>
      <style>{`
        @keyframes candleGlow {
          0%, 100% { transform: scale(1); opacity: 0.1; }
          50% { transform: scale(1.2); opacity: 0.4; }
        }
        @keyframes flameBack {
          0%, 100% { transform: scale(1) rotate(0deg); opacity: 0.8; }
          25% { transform: scale(1.1) rotate(-5deg); opacity: 1; }
          50% { transform: scale(0.9) rotate(5deg); opacity: 0.7; }
          75% { transform: scale(1.05) rotate(-2deg); opacity: 1; }
        }
        @keyframes flameCenter {
          0%, 100% { transform: scale(1) rotate(0deg); opacity: 0.9; }
          25% { transform: scale(1.25) rotate(3deg); opacity: 1; }
          50% { transform: scale(0.9) rotate(-4deg); opacity: 0.8; }
          75% { transform: scale(1.1) rotate(2deg); opacity: 1; }
        }
        @keyframes flameFront {
          0%, 100% { transform: scale(1) rotate(0deg); opacity: 0.8; }
          25% { transform: scale(1.1) rotate(-3deg); opacity: 0.9; }
          50% { transform: scale(0.85) rotate(6deg); opacity: 0.7; }
          75% { transform: scale(1.05) rotate(-2deg); opacity: 1; }
        }
        
        .candle-glow-anim {
          transform-origin: 100px 50px;
          animation: candleGlow 2s ease-in-out infinite;
        }
        .flame-back {
          transform-origin: 65px 50px;
          animation: flameBack 1.5s ease-in-out infinite;
          animation-delay: 0.2s;
        }
        .flame-center {
          transform-origin: 100px 55px;
          animation: flameCenter 1.8s ease-in-out infinite;
        }
        .flame-front {
          transform-origin: 130px 95px;
          animation: flameFront 1.3s ease-in-out infinite;
          animation-delay: 0.5s;
        }
      `}</style>
      <svg
        viewBox="0 0 200 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full text-vintage-border-dark dark:text-vintage-btn-dark drop-shadow-md"
      >
        {/* Glow behind the flames */}
        <circle
          cx="100"
          cy="50"
          r="50"
          fill="#ff9d00"
          className="candle-glow-anim"
        />

        {/* --- BOOKS BASE (Static Isometric) --- */}
        <g stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round">
          {/* BOOK 1 (Bottom) */}
          <path d="M 20 180 L 50 160 L 180 160 L 150 180 Z" fill="currentColor" fillOpacity="0.1" />
          <path d="M 20 180 L 150 180 L 150 195 L 20 195 Z" fill="currentColor" fillOpacity="0.4" />
          <path d="M 150 180 L 180 160 L 180 175 L 150 195 Z" fill="currentColor" fillOpacity="0.05" />
          <path d="M 150 185 L 180 165 M 150 190 L 180 170" stroke="currentColor" strokeOpacity="0.3" />

          {/* BOOK 2 (Middle) */}
          <path d="M 30 172 L 60 152 L 170 152 L 140 172 Z" fill="currentColor" fillOpacity="0.2" />
          <path d="M 30 172 L 140 172 L 140 184 L 30 184 Z" fill="currentColor" fillOpacity="0.5" />
          <path d="M 140 172 L 170 152 L 170 164 L 140 184 Z" fill="currentColor" fillOpacity="0.05" />
          <path d="M 140 176 L 170 156 M 140 180 L 170 160" stroke="currentColor" strokeOpacity="0.3" />

          {/* BOOK 3 (Top Journal) */}
          <path d="M 40 162 L 70 142 L 160 142 L 130 162 Z" fill="currentColor" fillOpacity="0.3" />
          <path d="M 40 162 L 130 162 L 130 170 L 40 170 Z" fill="currentColor" fillOpacity="0.6" />
          <path d="M 130 162 L 160 142 L 160 150 L 130 170 Z" fill="currentColor" fillOpacity="0.05" />
          <path d="M 130 166 L 160 146" stroke="currentColor" strokeOpacity="0.3" />
        </g>

        {/* Base Plateau/Holder on top of books */}
        <ellipse cx="100" cy="150" rx="42" ry="12" fill="currentColor" fillOpacity="0.3" />

        {/* --- Back Left Candle --- */}
        <path d="M50 140 L50 60 Q65 65 80 60 L80 140 Q65 146 50 140 Z" fill="currentColor" fillOpacity="0.6" />
        <line x1="65" y1="60" x2="65" y2="50" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <path d="M65 25 Q55 40 65 50 Q75 40 65 25" fill="#ffbb00" className="flame-back" />
        
        {/* --- Center Main Candle --- */}
        <path d="M80 152 L80 70 Q100 75 120 70 L120 152 Q100 158 80 152 Z" fill="currentColor" fillOpacity="0.8" />
        <path d="M85 72 C85 85 90 90 90 90 C90 90 95 85 95 73" fill="currentColor" fillOpacity="0.9" />
        <path d="M105 73 C105 95 110 100 110 100 C110 100 115 95 115 72" fill="currentColor" fillOpacity="0.9" />
        <line x1="100" y1="70" x2="100" y2="55" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
        <path d="M100 20 Q85 40 100 55 Q115 40 100 20" fill="#ffaa00" className="flame-center" />

        {/* --- Front Right Short Candle --- */}
        <path d="M115 156 L115 100 Q130 105 145 100 L145 156 Q130 162 115 156 Z" fill="currentColor" fillOpacity="0.9" />
        <line x1="130" y1="100" x2="130" y2="90" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <path d="M130 70 Q120 85 130 95 Q140 85 130 70" fill="#ff9900" className="flame-front" />

      </svg>
    </div>
  )
}
