import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { getPhotos } from '@/data/photos';
import { SakuraPetals } from '@/components/SakuraPetals';

gsap.registerPlugin(ScrollTrigger);

export const GallerySection = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const loveRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Heading fade-in
      gsap.fromTo(
        headingRef.current,
        { opacity: 0, y: 40 },
        {
          opacity: 1, y: 0, duration: 1.2, ease: 'power3.out',
          scrollTrigger: {
            trigger: headingRef.current,
            start: 'top 85%',
            toggleActions: 'play none none reverse',
          },
        }
      );

      // Photo cards stagger
      const items = gridRef.current?.querySelectorAll('.gallery-grid-item');
      if (items) {
        gsap.fromTo(
          items,
          { opacity: 0, y: 60, scale: 0.88, rotateY: 8 },
          {
            opacity: 1, y: 0, scale: 1, rotateY: 0, duration: 0.9, stagger: 0.14,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: gridRef.current,
              start: 'top 78%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      }

      // Love section
      gsap.fromTo(
        loveRef.current,
        { opacity: 0, y: 50, scale: 0.95 },
        {
          opacity: 1, y: 0, scale: 1, duration: 1.3, ease: 'power3.out',
          scrollTrigger: {
            trigger: loveRef.current,
            start: 'top 82%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  // Only 4 photos
  const photos = getPhotos().slice(0, 4);

  return (
    <section
      ref={containerRef}
      className="relative w-full py-24 md:py-36 overflow-hidden"
      style={{ backgroundColor: '#ffeef2' }}
    >
      {/* Spinning sakura */}
      <SakuraPetals count={20} spinning={true} zIndex={1} />

      {/* ── Heading ── */}
      <div ref={headingRef} className="relative z-10 text-center mb-16 px-4">
        <p className="font-script text-[#ff4d6d] text-2xl mb-3 opacity-75">~ captured moments ~</p>
        <div className="flex items-center justify-center gap-4 mb-5">
          <div className="h-px w-20 bg-gradient-to-r from-transparent to-[#ff4d6d]/60" />
          <span className="text-2xl">📷</span>
          <div className="h-px w-20 bg-gradient-to-l from-transparent to-[#ff4d6d]/60" />
        </div>
        <h2
          className="text-luxury-title text-glow"
          style={{ fontSize: 'clamp(2.6rem, 6vw, 4.5rem)', color: '#5c0620' }}
        >
          Your Beautiful Picture
        </h2>
        <p className="text-poetry mt-3" style={{ color: '#800f2f', fontSize: '1.1rem', maxWidth: '34ch', margin: '0.8rem auto 0' }}>
          Every frame holds a story,<br />
          <em>every smile — a universe.</em>
        </p>
      </div>

      {/* ── Photo grid — 4 photos, glass frames ── */}
      <div
        ref={gridRef}
        className="relative z-10 max-w-5xl mx-auto px-6"
      >
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-7">
          {photos.map((photo, index) => (
            <div
              key={index}
              className="gallery-grid-item glass-frame group cursor-pointer overflow-hidden"
              style={{ aspectRatio: '3/4' }}
            >
              <img
                src={photo.src}
                alt=""
                className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-110"
                style={{ zIndex: 1 }}
                loading="lazy"
              />


              {/* Hover overlay — animasi tanpa caption */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{
                  background: 'linear-gradient(to top, rgba(92,6,32,0.45) 0%, transparent 60%)',
                  zIndex: 4,
                }}
              />

              {/* Number badge */}
              <div
                className="absolute top-3 left-3 w-7 h-7 rounded-full flex items-center justify-center"
                style={{
                  background: 'rgba(255,255,255,0.45)',
                  backdropFilter: 'blur(8px)',
                  border: '1px solid rgba(255,255,255,0.6)',
                  zIndex: 5,
                }}
              >
                <span className="text-[#ff4d6d] text-xs font-bold">{index + 1}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Love section ── */}
      <div
        ref={loveRef}
        className="relative z-10 max-w-2xl mx-auto px-6 mt-24"
      >
        <div
          className="glass-panel rounded-3xl p-10 md:p-14 text-center"
          style={{ boxShadow: '0 12px 60px rgba(255,77,109,0.14)' }}
        >
          {/* Decoration */}
          <div className="flex items-center justify-center gap-4 mb-8">
            <div className="h-px w-16 bg-gradient-to-r from-transparent to-[#ff4d6d]/60" />
            <span className="text-3xl">💗</span>
            <div className="h-px w-16 bg-gradient-to-l from-transparent to-[#ff4d6d]/60" />
          </div>

          {/* Luxury script heading */}
          <h3
            className="text-luxury-title text-glow mb-8"
            style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', color: '#5c0620' }}
          >
            You Are Loved
          </h3>

          {/* Poetry lines */}
          <div className="space-y-4">
            <p className="text-poetry" style={{ color: '#800f2f', fontSize: '1.2rem' }}>
              More than the words you have ever heard,<br />
              more than the stars you can count at night —
            </p>
            <p className="text-poetry" style={{ color: '#590d22', fontSize: '1.15rem', fontStyle: 'normal', fontWeight: 400 }}>
              You are loved <em>more than you will ever know.</em>
            </p>
            <p className="text-poetry" style={{ color: '#800f2f', fontSize: '1.1rem' }}>
              In every quiet moment, in every passing day,<br />
              someone's heart holds yours — <em>and always will.</em>
            </p>
            <p className="text-poetry mt-6" style={{ color: '#ff4d6d', fontSize: '1.25rem', fontWeight: 600 }}>
              "You are cherished beyond measure,<br />
              beyond time, beyond words."
            </p>
          </div>

          {/* Bottom flourish */}
          <div className="flex items-center justify-center gap-4 mt-10">
            <div className="h-px w-14 bg-gradient-to-r from-transparent to-[#ff4d6d]/50" />
            <span className="text-xl">🌸</span>
            <div className="h-px w-14 bg-gradient-to-l from-transparent to-[#ff4d6d]/50" />
          </div>
        </div>
      </div>
    </section>
  );
};
