import { useEffect, useRef, useState, useCallback } from 'react';
import { Howl } from 'howler';

export interface Track {
  title: string;
  artist: string;
  url: string;
}

// ============================================================
// DAFTAR LAGU — ganti URL dengan lagu uploadanmu sendiri!
// Format: { title: "Judul Lagu", artist: "Nama Artis", url: "/data/songs/nama-file.mp3" }
// ============================================================
export const playlist: Track[] = [
  {
    title: "Semua Aku Dirayakan",
    artist: "Nadin Amizah",
    url: `${import.meta.env.BASE_URL}songs/semua-aku-dirayakan.mp3`
  }
];

export const useAudio = () => {
  const soundRef = useRef<Howl | null>(null);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [volume, setVolumeState] = useState(0.3);
  const isLoadingRef = useRef(false);

  const loadTrack = useCallback((index: number, shouldPlay: boolean) => {
    // Unload existing track
    if (soundRef.current) {
      soundRef.current.unload();
      soundRef.current = null;
    }

    setIsLoaded(false);
    isLoadingRef.current = true;

    const track = playlist[index];
    const sound = new Howl({
      src: [track.url],
      html5: true,
      loop: true,
      volume: volume,
      onload: () => {
        setIsLoaded(true);
        isLoadingRef.current = false;
        if (shouldPlay) {
          sound.play();
          setIsPlaying(true);
        }
      },
      onplay: () => setIsPlaying(true),
      onpause: () => setIsPlaying(false),
      onstop: () => setIsPlaying(false),
      onend: () => {
        // Loop manually in case html5 mode doesn't loop
        if (soundRef.current) {
          soundRef.current.play();
        }
      },
      onloaderror: (_id: number, err: unknown) => {
        console.error("Failed to load track:", track.title, err);
        isLoadingRef.current = false;
      },
      onplayerror: (_id: number, err: unknown) => {
        console.error("Failed to play track:", track.title, err);
        // Retry play after short delay
        setTimeout(() => {
          if (soundRef.current) {
            soundRef.current.play();
          }
        }, 100);
      }
    });

    soundRef.current = sound;
  }, [volume]);

  const play = useCallback(() => {
    if (isLoadingRef.current) return; // Prevent double-load
    if (!soundRef.current) {
      // Belum pernah di-load — load sekarang lalu langsung play
      loadTrack(currentTrackIndex, true);
    } else if (!soundRef.current.playing()) {
      soundRef.current.play();
      setIsPlaying(true);
    }
  }, [currentTrackIndex, loadTrack]);

  const pause = useCallback(() => {
    if (soundRef.current && soundRef.current.playing()) {
      soundRef.current.pause();
      setIsPlaying(false);
    }
  }, []);

  const toggle = useCallback(() => {
    if (isLoadingRef.current) return; // Prevent double-load
    if (!soundRef.current) {
      // Belum di-load, load dan play
      loadTrack(currentTrackIndex, true);
      return;
    }
    // Use Howl's actual playing state, not React state
    if (soundRef.current.playing()) {
      soundRef.current.pause();
      setIsPlaying(false);
    } else {
      soundRef.current.play();
      setIsPlaying(true);
    }
  }, [currentTrackIndex, loadTrack]);

  const setVolume = useCallback((vol: number) => {
    setVolumeState(vol);
    if (soundRef.current) {
      soundRef.current.volume(vol);
    }
  }, []);

  // Cleanup saat unmount
  useEffect(() => {
    return () => {
      if (soundRef.current) {
        soundRef.current.unload();
      }
    };
  }, []);

  return {
    play,
    pause,
    toggle,
    isPlaying,
    isLoaded,
    volume,
    setVolume,
    currentTrackIndex,
    currentTrack: playlist[currentTrackIndex],
    playlist,
  };
};
