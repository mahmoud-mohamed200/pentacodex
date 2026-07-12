export function Logo({ className = "" }: { className?: string }) {
  return (
    <div className={`group/logo flex items-center gap-2.5 ${className}`}>
      <svg
        viewBox="0 0 140 140"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        className="h-10 w-auto shrink-0"
      >
        <defs>
          <linearGradient id="badgeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#0B0F19" />
            <stop offset="100%" stop-color="#151B33" />
          </linearGradient>
          <filter id="neonGlow" x="-80%" y="-80%" width="260%" height="260%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <rect x="10" y="10" width="120" height="120" rx="26" fill="url(#badgeGrad)" />

        <path
          d="M45,45 L75,70 L45,95"
          fill="none"
          stroke="#00E5FF"
          stroke-width="10"
          stroke-linecap="round"
          stroke-linejoin="round"
          filter="url(#neonGlow)"
        />

        <rect x="86" y="80" width="15" height="30" rx="3" fill="#C084FC" filter="url(#neonGlow)">
          <animate
            attributeName="opacity"
            values="1;1;0.1;1"
            keyTimes="0;0.55;0.75;1"
            dur="1.6s"
            repeatCount="indefinite"
          />
        </rect>
      </svg>

      <span
        className="font-['Plus_Jakarta_Sans'] text-[1.5rem] leading-none tracking-[0.15em] text-[#00F2FE] transition-all duration-300 ease-out"
      >
        <span className="font-light opacity-90">penta</span>
        <span className="font-extrabold text-shadow-cyan">codex</span>
      </span>
    </div>
  );
}
