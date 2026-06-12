import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { getPhotos } from '@/data/photos';

gsap.registerPlugin(ScrollTrigger);

export const SpiralVortex = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const triggersRef = useRef<ScrollTrigger[]>([]);

  useEffect(() => {
    const container = containerRef.current;
    const scene = sceneRef.current;
    if (!container || !scene) return;

    const cards = scene.querySelectorAll<HTMLDivElement>('.gallery-item');
    if (cards.length === 0) return;

    const radius = 500;
    const spacing = 0.25;
    const angleStep = 137.5 * (Math.PI / 180);

    const progress = { z: 0 };
    const scrollProgress = { amount: 0 };
    const scale = { s: 1 };
    const xVal = { x: 0 };
    const blurVal = { val: 0 };

    // Set initial positions
    cards.forEach((card, i) => {
      const angle = i * angleStep;
      const y = Math.sin(angle) * radius;
      const x = Math.cos(angle) * radius;
      const z = i * spacing;
      const rotationY = (angleStep * i * 180) / Math.PI;
      card.style.transform = `translate3d(${x}px, ${y}px, ${z}px) rotateZ(0deg) rotateY(${rotationY}deg) rotateX(0deg)`;
    });

    const lastCard = cards[cards.length - 1];
    const lastTransform = lastCard.style.transform;
    const match = lastTransform.match(/translate3d\([^)]+\s+[^)]+\s+([^p]+)px\)/);
    const depth = (match ? parseFloat(match[1]) : 0) + 3;
    const zStep = depth / cards.length;

    // Create scroll timeline
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: container,
        scrub: 2,
        start: 'top top',
        end: `+=${window.innerHeight * 15}px`,
        pin: true,
        onRefresh: (self) => {
          triggersRef.current.push(self);
        },
      },
    });

    // Store trigger reference
    if (tl.scrollTrigger) {
      triggersRef.current.push(tl.scrollTrigger);
    }

    // Set container perspective
    tl.set(container, { perspective: 1000, transformStyle: 'preserve-3d' });

    // Animate values
    tl.to(progress, { z: -depth, ease: 'power1.inOut' }, 0);
    tl.to(scrollProgress, { amount: zStep, ease: 'power1.inOut' }, 0);
    tl.to(scale, { s: 0, ease: 'power1.inOut' }, 0);
    tl.to(xVal, { x: -150, ease: 'power1.out' }, 0);
    tl.to(blurVal, { val: 2, ease: 'none' }, 0);

    // Light transition at 75%
    tl.add(() => {
      gsap.to(container, { backgroundColor: '#fff4d9', duration: 2 });
      if (overlayRef.current) {
        gsap.to(overlayRef.current, { opacity: 1, duration: 2 });
      }
    }, '<75%');

    // Update cards on each frame
    tl.eventCallback('onUpdate', () => {
      cards.forEach((card, index) => {
        const transform = card.style.transform;
        const match = transform.match(/translate3d\(([-\d.]+)px,\s*([-\d.]+)px,\s*([-\d.]+)px\)/);
        if (!match) return;

        let x = parseFloat(match[1]);
        let y = parseFloat(match[2]);
        let z = parseFloat(match[3]);

        x += xVal.x;
        z += scrollProgress.amount;
        z -= progress.z;
        const finalZ = z * scale.s;
        const rotateY = (137.5 * index * Math.PI) / 180;
        const blur = Math.max(0, (finalZ + blurVal.val) * 0.05);

        card.style.transform = `translate3d(${x}px, ${y}px, ${finalZ}px) rotateZ(0deg) rotateY(${rotateY}deg) rotateX(0deg)`;
        card.style.filter = `blur(${blur}px)`;
      });
    });

    return () => {
      tl.kill();
      triggersRef.current.forEach((trigger) => trigger.kill());
      triggersRef.current = [];
    };
  }, []);

  const photos = getPhotos();

  return (
    <div ref={containerRef} className="gallery-container">
      <div ref={overlayRef} className="light-overlay" />

      {/* Section label */}
      <div className="absolute top-8 left-1/2 -translate-x-1/2 z-20 text-center">
        <p className="text-[#a89f91] text-sm uppercase tracking-[0.3em] font-sans">
          Kenangan Indah
        </p>
        <h2 className="font-serif text-3xl md:text-4xl text-white text-glow mt-2">
          Perjalanan Kita
        </h2>
      </div>

      <div ref={sceneRef} className="gallery-scene">
        {photos.map((photo, i) => (
          <div
            key={i}
            className="gallery-item"
            style={{
              transformStyle: 'preserve-3d',
              backfaceVisibility: 'hidden',
              willChange: 'transform, filter',
              position: 'absolute',
              top: '50%',
              left: '50%',
              marginLeft: '-8vw',
              marginTop: '-11vw',
            }}
          >
            <div className="card-wrapper">
              <img
                src={photo.src}
                alt={photo.caption}
                className="w-full h-full object-cover"
                loading="lazy"
              />
              <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 to-transparent">
                <p className="text-white text-xs font-sans truncate">{photo.caption}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Scroll hint */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 text-center">
        <p className="text-[#a89f91] text-xs animate-pulse">Terus scroll untuk melihat lebih...</p>
      </div>
    </div>
  );
};
