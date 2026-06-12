import { useRef, useEffect, useState, useCallback } from 'react';
import { gsap } from 'gsap';
import { GIFT_PROMPT, SISTER_NAME } from '@/data/config';

interface GiftRevealProps {
  onComplete: () => void;
}

export const GiftReveal = ({ onComplete }: GiftRevealProps) => {
  const [clicked, setClicked] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const cakeRef = useRef<HTMLDivElement>(null);
  const topHalfRef = useRef<HTMLDivElement>(null);
  const bottomHalfRef = useRef<HTMLDivElement>(null);
  const sparklesRef = useRef<HTMLDivElement>(null);

  // Candle flicker animation
  const candleFlames = [0, 1, 2, 3, 4];

  useEffect(() => {
    gsap.fromTo(containerRef.current, { opacity: 0 }, { opacity: 1, duration: 1.2, ease: 'power2.out' });

    // Gentle bob animation for cake
    if (cakeRef.current) {
      gsap.to(cakeRef.current, {
        y: -12,
        duration: 1.8,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });
    }
  }, []);

  const handleCakeClick = useCallback(() => {
    if (clicked) return;
    setClicked(true);

    // Play happy sound
    try {
      const ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      const notes = [523, 659, 784, 880, 1047];
      notes.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain); gain.connect(ctx.destination);
        osc.frequency.value = freq;
        osc.type = 'sine';
        gain.gain.setValueAtTime(0, ctx.currentTime + i * 0.18);
        gain.gain.linearRampToValueAtTime(0.12, ctx.currentTime + i * 0.18 + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.18 + 0.8);
        osc.start(ctx.currentTime + i * 0.18);
        osc.stop(ctx.currentTime + i * 0.18 + 0.8);
      });
    } catch { /* ignore */ }

    // Stop bob animation
    if (cakeRef.current) gsap.killTweensOf(cakeRef.current);

    // Cake splits in half: top goes up, bottom goes down
    const tl = gsap.timeline({
      onComplete: () => {
        setShowContent(true);
        // Flash and fade container out
        gsap.to(containerRef.current, {
          opacity: 0,
          duration: 0.8,
          delay: 1.6,
          onComplete: () => onComplete(),
        });
      }
    });

    // Pulse shake
    tl.to(cakeRef.current, { scale: 1.08, duration: 0.15, ease: 'power2.out' });
    tl.to(cakeRef.current, { scale: 0.95, duration: 0.12 });
    tl.to(cakeRef.current, { scale: 1.0, duration: 0.1 });

    // Split apart
    tl.to(topHalfRef.current, { y: -320, rotation: -15, opacity: 0, duration: 0.9, ease: 'power3.out' }, '+=0.1');
    tl.to(bottomHalfRef.current, { y: 320, rotation: 12, opacity: 0, duration: 0.9, ease: 'power3.out' }, '<');

    // Sparkles burst
    tl.fromTo(
      sparklesRef.current?.children ? Array.from(sparklesRef.current.children) : [],
      { opacity: 0, scale: 0 },
      { opacity: 1, scale: 1, duration: 0.4, stagger: 0.05, ease: 'back.out(2)' },
      '<0.2'
    );
    tl.to(
      sparklesRef.current?.children ? Array.from(sparklesRef.current.children) : [],
      { opacity: 0, y: -80, duration: 1.0, stagger: 0.04, ease: 'power1.in' },
      '+=0.3'
    );
  }, [clicked, onComplete]);

  const sparkleItems = Array.from({ length: 20 }, (_, i) => ({
    emoji: ['🎉', '✨', '🎊', '💖', '🌟', '🎈', '💕', '🎀'][i % 8],
    x: -160 + (i * 17),
    y: -50 - Math.random() * 100,
    rotate: Math.random() * 360,
  }));

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-40 flex flex-col items-center justify-center overflow-hidden"
      style={{ background: 'linear-gradient(180deg, #ffe5ec 0%, #ffccd5 50%, #ffb3c1 100%)' }}
    >
      {/* Floating background dots */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 24 }).map((_, i) => (
          <div
            key={i}
            className="absolute animate-float"
            style={{
              left: `${(i * 4.2 + 1) % 100}%`,
              top: `${(i * 7.3 + 5) % 100}%`,
              animationDelay: `${(i * 0.3) % 4}s`,
              animationDuration: `${4 + (i % 3)}s`,
              fontSize: `${12 + (i % 3) * 8}px`,
              opacity: 0.25,
            }}
          >
            {['🌸', '💗', '✨', '🎀'][i % 4]}
          </div>
        ))}
      </div>

      {/* Top text */}
      <div className="relative z-10 text-center mb-8">
        <h2 className="font-serif text-3xl md:text-5xl text-[#5c0620] text-glow font-bold">
          Untuk {SISTER_NAME} 🎂
        </h2>
        <p className="text-[#800f2f] mt-2 font-sans text-lg font-medium">
          Ada sesuatu yang spesial untukmu
        </p>
      </div>

      {/* CAKE */}
      <div
        ref={cakeRef}
        className="relative z-10 cursor-pointer select-none"
        onClick={handleCakeClick}
        style={{ width: 260 }}
      >
        {/* Sparkle burst (hidden until click) */}
        <div
          ref={sparklesRef}
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
          style={{ zIndex: 30 }}
        >
          {sparkleItems.map((s, i) => (
            <div
              key={i}
              className="absolute text-2xl"
              style={{
                left: '50%',
                top: '40%',
                transform: `translateX(${s.x}px) translateY(${s.y}px) rotate(${s.rotate}deg)`,
                opacity: 0,
              }}
            >
              {s.emoji}
            </div>
          ))}
        </div>

        {/* TOP HALF of cake */}
        <div ref={topHalfRef} style={{ transformOrigin: 'center bottom' }}>
          {/* Candles */}
          <div className="flex justify-center gap-5 mb-1">
            {candleFlames.map((_, i) => (
              <div key={i} className="flex flex-col items-center">
                {/* Flame */}
                <div
                  className="animate-pulse"
                  style={{
                    width: 10, height: 16,
                    background: 'radial-gradient(ellipse at 50% 80%, #fff176 0%, #ffb300 50%, #ff6f00 100%)',
                    borderRadius: '50% 50% 50% 50% / 60% 60% 40% 40%',
                    marginBottom: 2,
                    filter: 'drop-shadow(0 0 4px #ffb300)',
                    animationDuration: `${0.6 + i * 0.12}s`,
                  }}
                />
                {/* Candle stick */}
                <div style={{
                  width: 8, height: 28,
                  background: `linear-gradient(to bottom, ${['#ff758f','#a78bfa','#34d399','#60a5fa','#fbbf24'][i]}, ${['#ff4d6d','#7c3aed','#059669','#2563eb','#d97706'][i]})`,
                  borderRadius: 4,
                }} />
              </div>
            ))}
          </div>

          {/* Top layer (frosting) */}
          <div style={{
            height: 40,
            background: 'linear-gradient(to bottom, #fff0f3, #ffe0e8)',
            borderRadius: '50% 50% 0 0 / 30% 30% 0 0',
            border: '3px solid #ffb3c1',
            borderBottom: 'none',
            position: 'relative',
            overflow: 'hidden',
          }}>
            {/* Frosting drips */}
            {[10, 30, 50, 70, 90].map((left, i) => (
              <div key={i} style={{
                position: 'absolute',
                top: 20,
                left: `${left}%`,
                width: 12,
                height: 18,
                background: 'white',
                borderRadius: '0 0 50% 50%',
                opacity: 0.85,
              }} />
            ))}
          </div>

          {/* Top cake tier */}
          <div style={{
            height: 70,
            background: 'linear-gradient(to right, #ff758f, #ff4d6d, #ff6b88, #ff4d6d)',
            borderLeft: '3px solid #e03060',
            borderRight: '3px solid #e03060',
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 12,
          }}>
            {['💕', '🌸', '⭐', '💕'].map((em, i) => (
              <span key={i} style={{ fontSize: 18, opacity: 0.9 }}>{em}</span>
            ))}
          </div>
        </div>

        {/* BOTTOM HALF of cake */}
        <div ref={bottomHalfRef} style={{ transformOrigin: 'center top' }}>
          {/* Cut line (where split happens) */}
          <div style={{
            height: 3,
            background: 'linear-gradient(to right, transparent, #fff0f3, transparent)',
            marginBottom: 0,
          }} />

          {/* Bottom cake tier */}
          <div style={{
            height: 90,
            background: 'linear-gradient(to right, #ff85a1, #ff758f, #ff9bb1, #ff758f)',
            borderLeft: '3px solid #e03060',
            borderRight: '3px solid #e03060',
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-around',
            padding: '0 16px',
          }}>
            <span style={{ fontSize: 22 }}>🎀</span>
            <span style={{ fontSize: 22 }}>🎂</span>
            <span style={{ fontSize: 22 }}>🎀</span>
          </div>

          {/* Cake plate / base */}
          <div style={{
            height: 20,
            background: 'linear-gradient(to bottom, #ffccd5, #ffeef2)',
            borderRadius: '0 0 50% 50% / 0 0 100% 100%',
            border: '3px solid #ffb3c1',
            borderTop: 'none',
          }} />

          {/* Plate stand shadow */}
          <div style={{
            height: 10,
            background: 'radial-gradient(ellipse at 50% 0%, rgba(255,77,109,0.2) 0%, transparent 80%)',
            borderRadius: '50%',
            marginTop: 4,
          }} />
        </div>
      </div>

      {/* Bottom prompt */}
      {!clicked && (
        <div className="relative z-10 mt-8 animate-bounce text-center">
          <p className="text-[#ff4d6d] font-sans text-lg md:text-xl font-bold">
            {GIFT_PROMPT}
          </p>
          <p className="text-[#800f2f] text-sm mt-1 font-medium opacity-70">
            Klik kuenya! 🎂
          </p>
        </div>
      )}

      {/* After click — loading message */}
      {showContent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ background: 'linear-gradient(135deg, #ffe5ec 0%, #ffccd5 50%, #ffb3c1 100%)' }}>
          <div className="text-center animate-bounce">
            <div className="text-6xl mb-4">🎉</div>
            <p className="text-[#5c0620] text-2xl font-serif font-bold text-glow">
              Selamat Ulang Tahun!
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
