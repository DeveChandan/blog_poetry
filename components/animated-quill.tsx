export default function AnimatedQuill({ className }: { className?: string }) {
  return (
    <div className={className}>
      <style>{`
        @keyframes sway {
          0%, 100% { transform: rotate(-2deg); }
          50% { transform: rotate(4deg); }
        }
        @keyframes floatDrop1 {
          0%, 100% { transform: translateY(0); opacity: 0; }
          50% { transform: translateY(-15px); opacity: 0.8; }
        }
        @keyframes floatDrop2 {
          0%, 100% { transform: translateY(0); opacity: 0; }
          50% { transform: translateY(-20px); opacity: 0.6; }
        }
        .quill-sway {
          transform-origin: 100px 130px;
          animation: sway 6s ease-in-out infinite;
        }
        .ink-drop-1 {
          animation: floatDrop1 3s ease-in-out infinite;
          animation-delay: 1s;
        }
        .ink-drop-2 {
          animation: floatDrop2 4s ease-in-out infinite;
          animation-delay: 2s;
        }
      `}</style>
      <svg
        viewBox="0 0 200 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full text-vintage-border-dark dark:text-vintage-btn-dark"
      >
        {/* Inkwell base */}
        <path
          d="M70 160 Q100 180 130 160 L120 120 L80 120 Z"
          fill="currentColor"
          fillOpacity="0.2"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M75 120 L125 120 M85 110 L115 110"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
        />

        {/* The Quill Feather */}
        <g className="quill-sway">
          {/* Main stem */}
          <path
            d="M100 130 C80 80 140 20 170 10"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
          />
          {/* Feather Left barbs */}
          <path
            d="M100 130 C70 90 120 30 170 10 C150 40 100 80 100 130"
            fill="currentColor"
            fillOpacity="0.8"
          />
          {/* Feather Right barbs */}
          <path
            d="M100 130 C120 100 160 40 170 10 C180 40 130 90 100 130"
            fill="currentColor"
            fillOpacity="0.4"
          />
          {/* Little elegant cuts/gaps in feather */}
          <path
            d="M120 90 L140 60 M140 100 L160 70"
            stroke="var(--vintage-paper)"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </g>

        {/* Subtle floating ink drops */}
        <circle
          cx="80"
          cy="90"
          r="3"
          fill="currentColor"
          className="ink-drop-1"
        />
        <circle
          cx="120"
          cy="80"
          r="4"
          fill="currentColor"
          className="ink-drop-2"
        />
      </svg>
    </div>
  )
}
