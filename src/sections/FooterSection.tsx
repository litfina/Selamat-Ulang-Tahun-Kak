import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { Heart, Sparkles } from 'lucide-react';
import { SISTER_NAME, FOOTER_MESSAGE } from '@/data/config';

function createPetal(container: HTMLElement) {
  const petal = document.createElement('div');
  const size = Math.random() * 10 + 5;
  const left = Math.random() * 100;

  petal.className = 'petal';
  petal.style.cssText = `
    position: absolute;
    width: ${size}px;
    height: ${size}px;
    background: linear-gradient(135deg, #ffb7b2, #ff9e9e);
    border-radius: 50% 50% 50% 0;
    left: ${left}vw;
    top: -20px;
    opacity: 0.7;
    pointer-events: none;
    transform: rotate(${Math.random() * 360}deg);
  `;

  container.appendChild(petal);

  gsap.to(petal, {
    y: '110vh',
    x: `+=${Math.random() * 100 - 50}`,
    rotation: Math.random() * 720,
    duration: Math.random() * 5 + 5,
    ease: 'none',
    onComplete: () => {
      petal.remove();
      createPetal(container);
    },
  });
}

export const FooterSection = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const petalsContainerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = petalsContainerRef.current;
    if (!container) return;

    // Create initial batch of petals
    const petalCount = 25;
    for (let i = 0; i < petalCount; i++) {
      setTimeout(() => createPetal(container), i * 300);
    }

    // Content animation
    const ctx = gsap.context(() => {
      gsap.fromTo(
        contentRef.current,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: contentRef.current,
            start: 'top 85%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    }, containerRef);

    return () => {
      ctx.revert();
      // Clean up petals
      container.innerHTML = '';
    };
  }, []);

  return (
    <footer
      ref={containerRef}
      className="footer-section relative w-full py-24 md:py-32 overflow-hidden"
      style={{
        background: 'linear-gradient(180deg, #ffeef2 0%, #fff0f3 100%)',
      }}
    >
      {/* Falling petals container */}
      <div
        ref={petalsContainerRef}
        className="absolute inset-0 pointer-events-none overflow-hidden"
      />

      {/* Content */}
      <div ref={contentRef} className="relative z-10 text-center px-4">
        {/* Decorative icon */}
        <div className="mb-8">
          <div className="w-20 h-20 mx-auto rounded-full bg-[#ff4d6d]/10 border border-[#ff4d6d]/30 flex items-center justify-center">
            <Heart className="w-10 h-10 text-[#ff4d6d]" fill="currentColor" />
          </div>
        </div>

        {/* Main message */}
        <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-[#5c0620] text-glow mb-4">
          Semoga Harimu Indah
        </h2>
        <p className="text-[#800f2f] text-lg md:text-xl font-sans max-w-lg mx-auto mb-8 font-medium">
          {FOOTER_MESSAGE}
        </p>

        {/* Decorative divider */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="h-px w-16 bg-gradient-to-r from-transparent to-[#ff4d6d]" />
          <Sparkles className="w-4 h-4 text-[#ff4d6d]" />
          <div className="h-px w-16 bg-gradient-to-l from-transparent to-[#ff4d6d]" />
        </div>

        {/* Birthday wish */}
        <div className="glass-panel rounded-2xl p-8 max-w-md mx-auto">
          <p className="text-[#5c0620] font-serif text-2xl italic mb-4">
            &ldquo;Happy Birthday&rdquo;
          </p>
          <p className="text-[#ff4d6d] font-serif text-3xl font-bold">
            {SISTER_NAME}! 🎂
          </p>
        </div>

        {/* Copyright */}
        <p className="text-[#800f2f]/50 text-sm mt-16 font-sans font-semibold">
          Dibuat dengan cinta untuk hari spesialmu
        </p>
      </div>

      {/* Bottom glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 h-32 bg-[#ff4d6d]/5 blur-[100px] pointer-events-none" />
    </footer>
  );
};
