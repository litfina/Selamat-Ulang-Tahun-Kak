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
    url: "/songs/semua-aku-dirayakan.mp3"
  }
];

export const useAudio = () => {
  const soundRef = useRef<Howl | null>(null);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [volume, setVolumeState] = useState(0.7);

  const loadTrack = useCallback((index: number, shouldPlay: boolean) => {
    // Unload existing track
    if (soundRef.current) {
      soundRef.current.unload();
      soundRef.current = null;
    }

    setIsLoaded(false);

    const track = playlist[index];
    const sound = new Howl({
      src: [track.url],
      html5: true,
      loop: true,
      volume: volume,
      onload: () => {
        setIsLoaded(true);
        if (shouldPlay) {
          sound.play();
          setIsPlaying(true);
        }
      },
      onplay: () => setIsPlaying(true),
      onpause: () => setIsPlaying(false),
      onstop: () => setIsPlaying(false),
      onloaderror: (_id: number, err: unknown) => {
        console.error("Failed to load track:", track.title, err);
      }
    });

    soundRef.current = sound;
  }, [volume]);

  // ⚠️ LAZY: jangan load di mount, cukup load saat play() dipanggil pertama kali
  // (menghindari "Failed to load" & "audio pool exhausted" di fase loading/gift)

  const play = useCallback(() => {
    if (!soundRef.current) {
      // Belum pernah di-load — load sekarang lalu langsung play
      loadTrack(currentTrackIndex, true);
    } else {
      soundRef.current.play();
      setIsPlaying(true);
    }
  }, [currentTrackIndex, loadTrack]);

  const pause = useCallback(() => {
    if (soundRef.current) {
      soundRef.current.pause();
      setIsPlaying(false);
    }
  }, []);

  const toggle = useCallback(() => {
    if (!soundRef.current) {
      // Belum di-load, load dan play
      loadTrack(currentTrackIndex, true);
      return;
    }
    if (isPlaying) {
      soundRef.current.pause();
      setIsPlaying(false);
    } else {
      soundRef.current.play();
      setIsPlaying(true);
    }
  }, [isPlaying, currentTrackIndex, loadTrack]);

  const setVolume = useCallback((vol: number) => {
    setVolumeState(vol);
    if (soundRef.current) {
      soundRef.current.volume(vol);
    }
  }, []);

  const nextTrack = useCallback(() => {
    setCurrentTrackIndex((prev) => {
      const nextIdx = (prev + 1) % playlist.length;
      loadTrack(nextIdx, true);
      return nextIdx;
    });
  }, [loadTrack]);

  const prevTrack = useCallback(() => {
    setCurrentTrackIndex((prev) => {
      const prevIdx = prev === 0 ? playlist.length - 1 : prev - 1;
      loadTrack(prevIdx, true);
      return prevIdx;
    });
  }, [loadTrack]);

  const selectTrack = useCallback((index: number) => {
    setCurrentTrackIndex(index);
    loadTrack(index, true);
  }, [loadTrack]);

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
    nextTrack,
    prevTrack,
    selectTrack,
  };
};
