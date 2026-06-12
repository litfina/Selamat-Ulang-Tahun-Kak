import { useEffect, useRef } from 'react';

// ============================================================
// SakuraPetals — reusable falling cherry blossom component
// Props:
//   count     — number of petals (default 30)
//   spinning  — if true, petals spin with scroll-driven rotation
// ============================================================

interface SakuraPetalsProps {
  count?: number;
  spinning?: boolean;
  zIndex?: number;
}

// SVG sakura petal shape
const PetalSVG = ({ color, size }: { color: string; size: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 40 40"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    style={{ display: 'block' }}
  >
    {/* 5-petal cherry blossom */}
    <g transform="translate(20,20)">
      {[0, 72, 144, 216, 288].map((angle, i) => (
        <ellipse
          key={i}
          cx={0}
          cy={-9}
          rx={5}
          ry={9}
          fill={color}
          opacity={0.85}
          transform={`rotate(${angle})`}
        />
      ))}
      <circle cx={0} cy={0} r={3} fill="#ffe0ec" opacity={0.9} />
    </g>
  </svg>
);

export const SakuraPetals = ({ count = 30, spinning = false, zIndex = 5 }: SakuraPetalsProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Generate stable petal configs (memo via useRef)
  const petalsRef = useRef(
    Array.from({ length: count }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      startY: -60 - Math.random() * 200,
      size: 14 + Math.random() * 18,
      duration: 7 + Math.random() * 8,
      delay: Math.random() * 12,
      drift: (Math.random() - 0.5) * 160,
      rotSpeed: (Math.random() - 0.5) * 720,
      color: ['#ffb3c6', '#ff85a1', '#ffc2d4', '#ff4d6d', '#ffccd5'][i % 5],
      opacity: 0.55 + Math.random() * 0.35,
    }))
  );

  // For spinning mode, update rotation based on scroll position
  useEffect(() => {
    if (!spinning) return;
    const petals = containerRef.current?.querySelectorAll<HTMLElement>('.sakura-petal');
    if (!petals) return;

    const onScroll = () => {
      const scrollY = window.scrollY;
      petals.forEach((el, i) => {
        const rot = (scrollY * 0.4 * (i % 2 === 0 ? 1 : -1)) + (i * 37);
        el.style.transform = `rotate(${rot}deg)`;
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [spinning]);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 pointer-events-none overflow-hidden"
      style={{ zIndex }}
      aria-hidden="true"
    >
      {petalsRef.current.map((p) => (
        <div
          key={p.id}
          className={`sakura-petal absolute${spinning ? ' sakura-spinning' : ''}`}
          style={{
            left: `${p.left}%`,
            top: spinning ? `${20 + Math.random() * 60}%` : `${p.startY}px`,
            width: p.size,
            height: p.size,
            opacity: p.opacity,
            animation: spinning
              ? `sakura-sway ${p.duration}s ease-in-out ${p.delay}s infinite alternate`
              : `sakura-fall ${p.duration}s linear ${p.delay}s infinite`,
            willChange: 'transform',
          }}
        >
          <PetalSVG color={p.color} size={p.size} />
        </div>
      ))}
    </div>
  );
};
