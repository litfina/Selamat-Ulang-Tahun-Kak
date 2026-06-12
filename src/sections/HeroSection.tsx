import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { SakuraPetals } from '@/components/SakuraPetals';
import { HERO_MESSAGE, SISTER_NAME } from '@/data/config';

export const HeroSection = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const dividerRef = useRef<HTMLDivElement>(null);
  const scrollSakuraRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Title — staggered letter reveal
      gsap.fromTo(
        titleRef.current,
        { opacity: 0, y: 80, scale: 0.85 },
        { opacity: 1, y: 0, scale: 1, duration: 1.8, ease: 'power4.out', delay: 0.2 }
      );

      gsap.fromTo(
        subtitleRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 1.2, ease: 'power3.out', delay: 0.9 }
      );

      gsap.fromTo(
        dividerRef.current,
        { opacity: 0, scaleX: 0 },
        { opacity: 1, scaleX: 1, duration: 1, ease: 'power2.out', delay: 1.2 }
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  // Update rotation of the custom sakura flower based on scroll
  useEffect(() => {
    const onScroll = () => {
      if (scrollSakuraRef.current) {
        const rotation = window.scrollY * 0.75;
        scrollSakuraRef.current.style.transform = `rotate(${rotation}deg)`;
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative w-full min-h-screen flex flex-col items-center justify-center overflow-hidden"
      style={{
        background: 'linear-gradient(180deg, #ffe5ec 0%, #ffccd5 55%, #ffb3c1 100%)',
      }}
    >
      {/* Falling sakura background */}
      <SakuraPetals count={38} spinning={false} zIndex={1} />

      {/* Radial glow behind text */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-[#ff4d6d]/8 rounded-full blur-[130px] pointer-events-none" style={{ zIndex: 2 }} />

      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto" style={{ zIndex: 10 }}>

        {/* Small script label */}
        <p className="font-script text-[#ff4d6d] text-2xl md:text-3xl mb-4 opacity-80">
          ~ Untuk {SISTER_NAME} ~
        </p>

        {/* Divider */}
        <div ref={dividerRef} className="flex items-center justify-center gap-4 mb-8">
          <div className="h-px w-20 bg-gradient-to-r from-transparent to-[#ff4d6d]/60" />
          <span className="text-[#ff4d6d] text-xl">🌸</span>
          <div className="h-px w-20 bg-gradient-to-l from-transparent to-[#ff4d6d]/60" />
        </div>

        {/* Main title — luxury poetry font */}
        <h1
          ref={titleRef}
          className="text-luxury-title text-glow mb-6"
          style={{
            fontSize: 'clamp(3.2rem, 9vw, 8rem)',
            color: '#5c0620',
            lineHeight: 1.25,
          }}
        >
          {HERO_MESSAGE}
        </h1>

        {/* Subtitle — mixed poetry */}
        <p
          ref={subtitleRef}
          className="text-poetry mt-6"
          style={{
            fontSize: 'clamp(1.2rem, 2.8vw, 2.1rem)',
            color: '#800f2f',
            maxWidth: '38ch',
            margin: '1.5rem auto 0',
          }}
        >
          Hari ini milikmu —<br />
          <em>wishing you a day as beautiful as you are. 💕</em>
        </p>

        {/* Bottom flourish */}
        <div className="flex items-center justify-center gap-4 mt-10">
          <div className="h-px w-16 bg-gradient-to-r from-transparent to-[#ff4d6d]/50" />
          <span className="text-[#ff4d6d]">💕</span>
          <div className="h-px w-16 bg-gradient-to-l from-transparent to-[#ff4d6d]/50" />
        </div>

        {/* Interactive Scroll Down Indicator with custom cat/bear outline and spinning sakura */}
        <div className="mt-14 flex flex-col items-center gap-3">
          <p className="text-[#800f2f] text-xs font-sans font-bold tracking-wider uppercase opacity-70">
            Scroll Down
          </p>
          <div className="relative w-16 h-16 flex items-center justify-center">
            {/* Cute Shape 1: Pulsing dashed heart outline */}
            <div className="absolute inset-0 flex items-center justify-center animate-pulse">
              <svg
                width="60"
                height="60"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#ffccd5"
                strokeWidth="1.5"
                strokeDasharray="4 2"
                className="animate-spin"
                style={{ animationDuration: '12s' }}
              >
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
            </div>

            {/* Cute Shape 2: Bouncing bear/cat face outline */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-80 animate-bounce" style={{ animationDuration: '3s' }}>
              <svg
                width="44"
                height="44"
                viewBox="0 0 100 100"
                fill="none"
                stroke="#ff85a1"
                strokeWidth="3.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M 20 40 C 10 20, 40 10, 45 35 C 50 30, 50 30, 55 35 C 60 10, 90 20, 80 40 C 85 60, 75 80, 50 85 C 25 80, 15 60, 20 40 Z" />
              </svg>
            </div>
            
            {/* Spinning Sakura Flower linked to Scroll */}
            <div ref={scrollSakuraRef} className="transition-transform duration-75 ease-out pointer-events-none" style={{ zIndex: 5 }}>
              <svg
                width="28"
                height="28"
                viewBox="0 0 40 40"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g transform="translate(20,20)">
                  {[0, 72, 144, 216, 288].map((angle, i) => (
                    <ellipse
                      key={i}
                      cx={0}
                      cy={-8}
                      rx={4.5}
                      ry={8}
                      fill="#ff4d6d"
                      opacity={0.95}
                      transform={`rotate(${angle})`}
                    />
                  ))}
                  <circle cx={0} cy={0} r={2.5} fill="#ffe5ec" />
                </g>
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Gradient fade to next section */}
      <div className="absolute bottom-0 left-0 right-0 h-28 bg-gradient-to-t from-[#ffccd5] to-transparent pointer-events-none" style={{ zIndex: 8 }} />
    </section>
  );
};
