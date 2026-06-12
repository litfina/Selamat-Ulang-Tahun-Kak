import { useState, useEffect, useCallback } from 'react';
import { BIRTHDAY_DATE } from '@/data/config';
import { useAudio } from '@/hooks/useAudio';
import { Countdown } from '@/sections/Countdown';
import { GiftReveal } from '@/sections/GiftReveal';
import { HeroSection } from '@/sections/HeroSection';
import { MessageSection } from '@/sections/MessageSection';
import { GallerySection } from '@/sections/GallerySection';
import { FooterSection } from '@/sections/FooterSection';
import { MusicPlayer } from '@/components/MusicPlayer';
import './App.css';

type AppPhase = 'loading' | 'countdown' | 'gift' | 'main';

function App() {
  const [phase, setPhase] = useState<AppPhase>('loading');
  const audioApi = useAudio();

  // Check if birthday has arrived
  useEffect(() => {
    const checkDate = () => {
      const target = new Date(BIRTHDAY_DATE);
      target.setHours(0, 0, 0, 0);
      const now = new Date();

      if (now >= target) {
        setPhase('gift');
      } else {
        setPhase('countdown');
      }
    };

    const timer = setTimeout(checkDate, 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleCountdownComplete = useCallback(() => {
    setPhase('gift');
  }, []);

  const handleGiftComplete = useCallback(() => {
    setPhase('main');
    setTimeout(() => {
      audioApi.play();
    }, 600);
  }, [audioApi]);

  // Loading screen — pink theme
  if (phase === 'loading') {
    return (
      <div
        className="fixed inset-0 flex items-center justify-center z-50"
        style={{
          background: 'linear-gradient(135deg, #ffe5ec 0%, #ffccd5 50%, #ffb3c1 100%)',
        }}
      >
        <div className="text-center">
          <div className="text-6xl mb-4 animate-bounce">🎂</div>
          <div className="w-16 h-16 mx-auto mb-6 border-4 border-[#ff4d6d]/20 border-t-[#ff4d6d] rounded-full animate-spin" />
          <p className="text-[#800f2f] text-lg font-sans font-semibold animate-pulse">
            Menyiapkan kejutan...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen" style={{ backgroundColor: '#ffeef2' }}>
      {/* Phase: Countdown */}
      {phase === 'countdown' && (
        <Countdown onComplete={handleCountdownComplete} />
      )}

      {/* Phase: Gift Reveal */}
      {phase === 'gift' && (
        <GiftReveal onComplete={handleGiftComplete} />
      )}

      {/* Phase: Main Birthday Site */}
      {phase === 'main' && (
        <main className="relative">
          <HeroSection />
          <MessageSection />
          <GallerySection />
          <FooterSection />

          {/* Floating Music Player — only on main page */}
          <MusicPlayer {...audioApi} />
        </main>
      )}
    </div>
  );
}

export default App;
