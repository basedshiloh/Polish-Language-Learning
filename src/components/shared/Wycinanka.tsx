/**
 * Łowicz-style papercut flower (wycinanka) — PolishPal's decorative motif.
 * Pure SVG, symmetrical, drawn in the site palette. Decorative only.
 */

const RING_OUTER = 12;
const RING_INNER = 8;

export default function Wycinanka({
  className = '',
  withStem = true,
}: {
  className?: string;
  withStem?: boolean;
}) {
  const cx = 120;
  const cy = 110;
  return (
    <svg
      viewBox={withStem ? '0 0 240 300' : '0 0 240 220'}
      className={className}
      aria-hidden="true"
      data-a11y-keep
      focusable="false"
    >
      {withStem && (
        <g>
          <path d={`M${cx} ${cy + 40} C ${cx - 6} 200, ${cx + 6} 250, ${cx} 296`} stroke="#1a9e55" strokeWidth="7" fill="none" strokeLinecap="round" />
          {[
            { y: 196, s: 1 },
            { y: 238, s: 0.8 },
          ].map(({ y, s }) => (
            <g key={y}>
              <path
                d="M0 0 C 18 -22, 52 -24, 70 -6 C 50 8, 20 12, 0 0 Z"
                fill="#1a9e55"
                transform={`translate(${cx + 2} ${y}) scale(${s}) rotate(-18)`}
              />
              <path
                d="M0 0 C 18 -22, 52 -24, 70 -6 C 50 8, 20 12, 0 0 Z"
                fill="#1a9e55"
                transform={`translate(${cx - 2} ${y}) scale(${-s} ${s}) rotate(-18)`}
              />
              <circle cx={cx + 44 * s} cy={y - 16 * s} r={4 * s} fill="#ffc21a" />
              <circle cx={cx - 44 * s} cy={y - 16 * s} r={4 * s} fill="#ffc21a" />
            </g>
          ))}
        </g>
      )}

      {/* Outer petals */}
      {Array.from({ length: RING_OUTER }, (_, i) => (
        <ellipse
          key={`o${i}`}
          cx={cx}
          cy={cy - 66}
          rx="15"
          ry="30"
          fill={i % 2 === 0 ? '#d6338a' : '#7c4ddb'}
          transform={`rotate(${(360 / RING_OUTER) * i} ${cx} ${cy})`}
        />
      ))}
      {/* Outer petal tips */}
      {Array.from({ length: RING_OUTER }, (_, i) => (
        <circle
          key={`t${i}`}
          cx={cx}
          cy={cy - 88}
          r="5"
          fill="#ffc21a"
          transform={`rotate(${(360 / RING_OUTER) * i} ${cx} ${cy})`}
        />
      ))}
      {/* Inner petals */}
      {Array.from({ length: RING_INNER }, (_, i) => (
        <ellipse
          key={`i${i}`}
          cx={cx}
          cy={cy - 40}
          rx="14"
          ry="22"
          fill="#f2711c"
          transform={`rotate(${(360 / RING_INNER) * i + 22.5} ${cx} ${cy})`}
        />
      ))}
      <circle cx={cx} cy={cy} r="34" fill="#2f5bea" />
      {Array.from({ length: 10 }, (_, i) => (
        <circle
          key={`d${i}`}
          cx={cx}
          cy={cy - 26}
          r="3.5"
          fill="#ffffff"
          transform={`rotate(${36 * i} ${cx} ${cy})`}
        />
      ))}
      <circle cx={cx} cy={cy} r="18" fill="#ffc21a" />
      <circle cx={cx} cy={cy} r="9" fill="#d91f3b" />
    </svg>
  );
}
