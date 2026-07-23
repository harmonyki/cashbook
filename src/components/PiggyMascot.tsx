interface Props {
  size?: number;
  className?: string;
}

/** 핑크 돼지저금통 마스코트 (인라인 SVG, 외부 의존성 없음) */
export default function PiggyMascot({ size = 96, className = "" }: Props) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      role="img"
      aria-label="돼지저금통 마스코트"
    >
      {/* 볼터치 그림자 */}
      <ellipse cx="60" cy="104" rx="34" ry="6" fill="#ffb0cd" opacity="0.5" />

      {/* 동전 */}
      <circle cx="60" cy="18" r="9" fill="#ffd98a" stroke="#f0b53f" strokeWidth="2" />
      <text
        x="60"
        y="22"
        textAnchor="middle"
        fontSize="10"
        fill="#c98b1e"
        fontFamily="sans-serif"
        fontWeight="bold"
      >
        ₩
      </text>

      {/* 몸통 */}
      <ellipse cx="60" cy="66" rx="42" ry="34" fill="#ff9ec2" />
      <ellipse cx="60" cy="66" rx="42" ry="34" fill="url(#shine)" opacity="0.35" />

      {/* 귀 */}
      <path d="M30 40 L26 24 L44 34 Z" fill="#ff85b0" />
      <path d="M90 40 L94 24 L76 34 Z" fill="#ff85b0" />

      {/* 다리 */}
      <rect x="34" y="92" width="10" height="12" rx="5" fill="#ff85b0" />
      <rect x="76" y="92" width="10" height="12" rx="5" fill="#ff85b0" />

      {/* 동전 투입구 */}
      <rect x="48" y="40" width="24" height="5" rx="2.5" fill="#f36ba0" />

      {/* 코 */}
      <ellipse cx="60" cy="70" rx="15" ry="11" fill="#ff7aa8" />
      <circle cx="54" cy="70" r="2.6" fill="#e0417d" />
      <circle cx="66" cy="70" r="2.6" fill="#e0417d" />

      {/* 눈 */}
      <circle cx="47" cy="58" r="3.4" fill="#5b3348" />
      <circle cx="73" cy="58" r="3.4" fill="#5b3348" />
      <circle cx="48.2" cy="56.8" r="1.1" fill="#fff" />
      <circle cx="74.2" cy="56.8" r="1.1" fill="#fff" />

      {/* 볼터치 */}
      <circle cx="38" cy="66" r="5" fill="#ff6b9d" opacity="0.45" />
      <circle cx="82" cy="66" r="5" fill="#ff6b9d" opacity="0.45" />

      <defs>
        <linearGradient id="shine" x1="60" y1="32" x2="60" y2="100" gradientUnits="userSpaceOnUse">
          <stop stopColor="#ffffff" />
          <stop offset="1" stopColor="#ffffff" stopOpacity="0" />
        </linearGradient>
      </defs>
    </svg>
  );
}
