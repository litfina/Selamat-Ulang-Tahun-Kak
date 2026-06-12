import { useEffect, useState, useRef, useCallback } from 'react';
import { gsap } from 'gsap';
import { Heart, Calendar, Clock, Sparkles } from 'lucide-react';
import { BIRTHDAY_DATE, COUNTDOWN_MESSAGE, COUNTDOWN_COMPLETE_MESSAGE, SISTER_NAME } from '@/data/config';

interface CountdownProps {
  onComplete: () => void;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export const Countdown = ({ onComplete }: CountdownProps) => {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [isComplete, setIsComplete] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  const calculateTimeLeft = useCallback((): TimeLeft | null => {
    const target = new Date(BIRTHDAY_DATE);
    target.setHours(0, 0, 0, 0);
    const now = new Date();
    const diff = target.getTime() - now.getTime();

    if (diff <= 0) {
      return null;
    }

    return {
      days: Math.floor(diff / (1000 * 60 * 60 * 24)),
      hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((diff / 1000 / 60) % 60),
      seconds: Math.floor((diff / 1000) % 60),
    };
  }, []);

  // Initialize countdown
  useEffect(() => {
    const initial = calculateTimeLeft();
    if (initial === null) {
      setIsComplete(true);
      return;
    }
    setTimeLeft(initial);
  }, [calculateTimeLeft]);

  // Timer interval
  useEffect(() => {
    if (isComplete) return;

    const timer = setInterval(() => {
      const remaining = calculateTimeLeft();
      if (remaining === null) {
        setIsComplete(true);
        clearInterval(timer);
      } else {
        setTimeLeft(remaining);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [isComplete, calculateTimeLeft]);

  // Keyboard clack sound per second
  useEffect(() => {
    if (isComplete) return;
    try {
      const audioContext = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();

      const playKeyboardClack = () => {
        if (isComplete) return;
        const now = audioContext.currentTime;

        // Layer 1: body "thock" — short filtered noise burst (the main keyboard body resonance)
        const noiseLen = Math.floor(audioContext.sampleRate * 0.06);
        const noiseBuffer = audioContext.createBuffer(1, noiseLen, audioContext.sampleRate);
        const noiseData = noiseBuffer.getChannelData(0);
        for (let j = 0; j < noiseLen; j++) {
          // Sharp attack, exponential tail
          const env = Math.exp(-j / (noiseLen * 0.3));
          noiseData[j] = (Math.random() * 2 - 1) * env;
        }
        const noiseSource = audioContext.createBufferSource();
        noiseSource.buffer = noiseBuffer;

        // Band-pass filter to make it sound like a key body (mid-freq resonance)
        const bpf = audioContext.createBiquadFilter();
        bpf.type = 'bandpass';
        bpf.frequency.value = 2800;
        bpf.Q.value = 1.2;

        const noiseGain = audioContext.createGain();
        noiseGain.gain.setValueAtTime(0.18, now);
        noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);

        noiseSource.connect(bpf);
        bpf.connect(noiseGain);
        noiseGain.connect(audioContext.destination);
        noiseSource.start(now);

        // Layer 2: high-freq "click" transient at key contact moment
        const clickLen = Math.floor(audioContext.sampleRate * 0.008);
        const clickBuffer = audioContext.createBuffer(1, clickLen, audioContext.sampleRate);
        const clickData = clickBuffer.getChannelData(0);
        for (let j = 0; j < clickLen; j++) {
          clickData[j] = (Math.random() * 2 - 1) * (1 - j / clickLen);
        }
        const clickSource = audioContext.createBufferSource();
        clickSource.buffer = clickBuffer;

        const hpf = audioContext.createBiquadFilter();
        hpf.type = 'highpass';
        hpf.frequency.value = 5000;

        const clickGain = audioContext.createGain();
        clickGain.gain.setValueAtTime(0.08, now);

        clickSource.connect(hpf);
        hpf.connect(clickGain);
        clickGain.connect(audioContext.destination);
        clickSource.start(now);

        // Layer 3: subtle low "bump" (key bottom-out thud)
        const osc = audioContext.createOscillator();
        const oscGain = audioContext.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(120, now);
        osc.frequency.exponentialRampToValueAtTime(50, now + 0.04);
        oscGain.gain.setValueAtTime(0.06, now);
        oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
        osc.connect(oscGain);
        oscGain.connect(audioContext.destination);
        osc.start(now); osc.stop(now + 0.06);
      };

      playKeyboardClack();
      const tickInterval = setInterval(playKeyboardClack, 1000);
      return () => {
        clearInterval(tickInterval);
        audioContext.close();
      };
    } catch {
      // Audio not supported
    }
  }, [isComplete]);

  // Cinematic celebration sound on countdown complete
  useEffect(() => {
    if (!isComplete) return;

    try {
      const audioContext = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();

      // Rising synth arpeggio + reverb tail
      const majorScale = [523, 659, 784, 1047, 1319, 1568];
      majorScale.forEach((freq, i) => {
        const delay = i * 0.13;
        const now = audioContext.currentTime;

        const osc = audioContext.createOscillator();
        const gain = audioContext.createGain();
        osc.type = i % 2 === 0 ? 'triangle' : 'sine';
        osc.frequency.setValueAtTime(freq, now + delay);
        gain.gain.setValueAtTime(0, now + delay);
        gain.gain.linearRampToValueAtTime(0.12, now + delay + 0.04);
        gain.gain.exponentialRampToValueAtTime(0.001, now + delay + 1.2);
        osc.connect(gain);
        gain.connect(audioContext.destination);
        osc.start(now + delay);
        osc.stop(now + delay + 1.2);

        // Harmony note (5th interval)
        const osc2 = audioContext.createOscillator();
        const gain2 = audioContext.createGain();
        osc2.type = 'sine';
        osc2.frequency.setValueAtTime(freq * 1.5, now + delay);
        gain2.gain.setValueAtTime(0, now + delay);
        gain2.gain.linearRampToValueAtTime(0.05, now + delay + 0.06);
        gain2.gain.exponentialRampToValueAtTime(0.001, now + delay + 1.5);
        osc2.connect(gain2);
        gain2.connect(audioContext.destination);
        osc2.start(now + delay);
        osc2.stop(now + delay + 1.5);
      });

      // Final impact boom at the end
      setTimeout(() => {
        const osc = audioContext.createOscillator();
        const gain = audioContext.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(80, audioContext.currentTime);
        osc.frequency.exponentialRampToValueAtTime(20, audioContext.currentTime + 0.6);
        gain.gain.setValueAtTime(0.2, audioContext.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.7);
        osc.connect(gain);
        gain.connect(audioContext.destination);
        osc.start(audioContext.currentTime);
        osc.stop(audioContext.currentTime + 0.7);
      }, majorScale.length * 130);
    } catch {
      // Audio not supported
    }

    // Fade out animation
    const tl = gsap.timeline({
      onComplete: () => {
        onComplete();
      },
    });

    tl.to(containerRef.current, {
      opacity: 0,
      scale: 1.1,
      duration: 1.5,
      ease: 'power2.inOut',
    });
  }, [isComplete, onComplete]);

  // Card animations
  useEffect(() => {
    if (isComplete) return;
    cardsRef.current.forEach((card, i) => {
      if (card) {
        gsap.fromTo(card,
          { y: 50, opacity: 0, scale: 0.8 },
          { y: 0, opacity: 1, scale: 1, duration: 0.8, delay: 0.2 + i * 0.15, ease: 'back.out(1.7)' }
        );
      }
    });
  }, [isComplete]);

  // Pulse animation on seconds card
  useEffect(() => {
    const secondsCard = cardsRef.current[3];
    if (secondsCard && !isComplete) {
      gsap.fromTo(secondsCard,
        { scale: 1 },
        { scale: 1.05, duration: 0.3, yoyo: true, repeat: 1, ease: 'power1.inOut' }
      );
    }
  }, [timeLeft.seconds, isComplete]);

  const timeUnits = [
    { value: timeLeft.days, label: 'Hari', icon: Calendar },
    { value: timeLeft.hours, label: 'Jam', icon: Clock },
    { value: timeLeft.minutes, label: 'Menit', icon: Sparkles },
    { value: timeLeft.seconds, label: 'Detik', icon: Heart },
  ];

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center"
      style={{
        background: 'linear-gradient(135deg, #ffe5ec 0%, #ffccd5 40%, #ffb3c1 100%)',
      }}
    >
      {/* Floating hearts background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="absolute animate-float opacity-20"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${4 + Math.random() * 4}s`,
            }}
          >
            <Heart
              className="text-[#ff4d6d]"
              style={{
                width: `${10 + Math.random() * 30}px`,
                height: `${10 + Math.random() * 30}px`,
              }}
              fill="currentColor"
            />
          </div>
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-4">
        <h1 className="font-serif text-3xl md:text-5xl lg:text-6xl text-[#5c0620] mb-2 text-glow">
          {isComplete ? COUNTDOWN_COMPLETE_MESSAGE : COUNTDOWN_MESSAGE}
        </h1>
        <p className="text-[#800f2f] text-lg md:text-xl mb-12 font-sans font-medium">
          {isComplete
            ? `Selamat Ulang Tahun, ${SISTER_NAME}! 🎉`
            : `${SISTER_NAME} akan berulang tahun pada ${new Date(BIRTHDAY_DATE).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}`}
        </p>

        {!isComplete && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 max-w-3xl mx-auto">
            {timeUnits.map((unit, index) => (
              <div
                key={unit.label}
                ref={(el) => { cardsRef.current[index] = el; }}
                className="glass-card p-6 md:p-8 flex flex-col items-center gap-2 hover:border-[#ff4d6d]/40 transition-all duration-300"
              >
                <unit.icon className="w-6 h-6 text-[#ff4d6d] mb-1" />
                <span className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-[#5c0620] tabular-nums">
                  {String(unit.value).padStart(2, '0')}
                </span>
                <span className="text-[#800f2f] text-sm md:text-base uppercase tracking-widest font-sans font-semibold">
                  {unit.label}
                </span>
              </div>
            ))}
          </div>
        )}

        {isComplete && (
          <div className="mt-8 animate-pulse-slow">
            <Sparkles className="w-16 h-16 text-[#ff4d6d] mx-auto" />
          </div>
        )}
      </div>

      {/* Bottom glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3/4 h-1/3 bg-gradient-to-t from-[#ff4d6d]/15 to-transparent blur-3xl pointer-events-none" />
    </div>
  );
};
