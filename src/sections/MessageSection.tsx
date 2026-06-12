import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { BIRTHDAY_MESSAGE, SISTER_NAME, SENDER_NAME } from '@/data/config';
import { SakuraPetals } from '@/components/SakuraPetals';

gsap.registerPlugin(ScrollTrigger);

export const MessageSection = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const messageRef = useRef<HTMLDivElement>(null);
  const signatureRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        headingRef.current,
        { opacity: 0, y: 50 },
        {
          opacity: 1, y: 0, duration: 1.2, ease: 'power3.out',
          scrollTrigger: {
            trigger: headingRef.current,
            start: 'top 82%',
            toggleActions: 'play none none reverse',
          },
        }
      );

      const words = messageRef.current?.querySelectorAll('.word');
      if (words) {
        gsap.fromTo(
          words,
          { opacity: 0, y: 22 },
          {
            opacity: 1, y: 0, duration: 0.55, stagger: 0.025, ease: 'power2.out',
            scrollTrigger: {
              trigger: messageRef.current,
              start: 'top 72%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      }

      gsap.fromTo(
        signatureRef.current,
        { opacity: 0, y: 20 },
        {
          opacity: 1, y: 0, duration: 1, ease: 'power2.out',
          scrollTrigger: {
            trigger: signatureRef.current,
            start: 'top 88%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const paragraphs = BIRTHDAY_MESSAGE.split('\n\n');

  return (
    <section
      ref={containerRef}
      className="relative w-full py-24 md:py-36 overflow-hidden"
      style={{ background: 'linear-gradient(180deg, #ffccd5 0%, #ffe5ec 25%, #fff0f3 100%)' }}
    >
      {/* Spinning sakura on scroll */}
      <SakuraPetals count={22} spinning={true} zIndex={1} />

      <div className="relative z-10 max-w-3xl mx-auto px-6">
        {/* Heading */}
        <div ref={headingRef} className="text-center mb-16">
          <p className="font-script text-[#ff4d6d] text-2xl mb-3 opacity-80">~ with all my heart ~</p>
          <div className="flex items-center justify-center gap-4 mb-5">
            <div className="h-px w-20 bg-gradient-to-r from-transparent to-[#ff4d6d]" />
            <span className="text-2xl">🌸</span>
            <div className="h-px w-20 bg-gradient-to-l from-transparent to-[#ff4d6d]" />
          </div>
          <h2
            className="text-luxury-title text-glow"
            style={{ fontSize: 'clamp(2.8rem, 6vw, 5rem)', color: '#5c0620' }}
          >
            Untuk {SISTER_NAME}
          </h2>
          <p className="text-poetry mt-3" style={{ color: '#800f2f', fontSize: '1.15rem' }}>
            Kata-kata ini lahir dari hati yang tulus
          </p>
        </div>

        {/* Message card */}
        <div
          ref={messageRef}
          className="glass-panel rounded-3xl p-8 md:p-14 space-y-6"
          style={{ boxShadow: '0 8px 40px rgba(255,77,109,0.10)' }}
        >
          {paragraphs.map((paragraph, pIndex) => (
            <p key={pIndex} className="text-[#590d22] text-lg md:text-xl leading-relaxed font-sans font-medium">
              {paragraph.split(' ').map((word, wIndex) => (
                <span key={wIndex} className="word inline-block mr-[0.3em]">
                  {word}
                </span>
              ))}
            </p>
          ))}

          {/* Signature */}
          <div ref={signatureRef} className="pt-8 border-t border-[#ff4d6d]/20 mt-8 text-right">
            <p className="text-poetry text-[#ff4d6d] text-xl">
              With all my love,
            </p>
            <p className="font-script text-[#5c0620] text-3xl mt-1">
              {SENDER_NAME} 💕
            </p>
          </div>
        </div>

        {/* Bottom flourish */}
        <div className="flex items-center justify-center gap-4 mt-14">
          <div className="h-px w-16 bg-gradient-to-r from-transparent to-[#ff4d6d]/40" />
          <span className="text-[#ff4d6d] opacity-50">✨</span>
          <div className="h-px w-16 bg-gradient-to-l from-transparent to-[#ff4d6d]/40" />
        </div>
      </div>
    </section>
  );
};
