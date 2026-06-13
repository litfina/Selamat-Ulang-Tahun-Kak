import { useState } from 'react';
import { Play, Pause, SkipForward, SkipBack, Volume2, VolumeX, Music, ListMusic } from 'lucide-react';

interface MusicPlayerProps {
  play: () => void;
  pause: () => void;
  toggle: () => void;
  isPlaying: boolean;
  isLoaded: boolean;
  volume: number;
  setVolume: (vol: number) => void;
  currentTrackIndex: number;
  currentTrack: { title: string; artist: string; url: string };
  playlist: Array<{ title: string; artist: string; url: string }>;
}

export const MusicPlayer = ({
  toggle,
  isPlaying,
  volume,
  setVolume,
  currentTrack,
  playlist,
}: MusicPlayerProps) => {
  const [showList, setShowList] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [prevVolume, setPrevVolume] = useState(volume);

  const handleMuteToggle = () => {
    if (isMuted) {
      setVolume(prevVolume);
      setIsMuted(false);
    } else {
      setPrevVolume(volume);
      setVolume(0);
      setIsMuted(true);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2 max-w-xs w-full sm:w-80">
      {/* Playlist Dropup */}
      {showList && (
        <div className="w-full glass-panel rounded-2xl p-4 shadow-xl border border-[#ff4d6d]/20 animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className="flex justify-between items-center mb-3 pb-2 border-b border-[#ff4d6d]/10">
            <span className="font-serif text-[#5c0620] font-bold flex items-center gap-1.5">
              <ListMusic className="w-4 h-4 text-[#ff4d6d]" /> Daftar Lagu
            </span>
          </div>
          <div className="space-y-1 max-h-40 overflow-y-auto pr-1">
            {playlist.map((track, idx) => (
              <button
                key={idx}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all flex items-center justify-between ${
                  playlist[idx].title === currentTrack.title
                    ? 'bg-[#ff4d6d]/10 text-[#ff4d6d] font-bold'
                    : 'text-[#800f2f] hover:bg-[#ff4d6d]/5'
                }`}
              >
                <div className="truncate pr-2">
                  <p className="truncate">{track.title}</p>
                  <p className="text-xs opacity-60 truncate">{track.artist}</p>
                </div>
                {playlist[idx].title === currentTrack.title && isPlaying && (
                  <span className="flex gap-0.5 items-end h-3">
                    <span className="w-0.5 bg-[#ff4d6d] rounded-full animate-bounce h-2" style={{ animationDelay: '0.1s' }} />
                    <span className="w-0.5 bg-[#ff4d6d] rounded-full animate-bounce h-3" style={{ animationDelay: '0.3s' }} />
                    <span className="w-0.5 bg-[#ff4d6d] rounded-full animate-bounce h-1.5" style={{ animationDelay: '0.5s' }} />
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Main Player Card */}
      <div className="w-full glass-card p-4 shadow-lg flex flex-col gap-3 border border-[#ff4d6d]/20">
        {/* Track Info */}
        <div className="flex items-center gap-3">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-br from-[#ffccd5] to-[#ff4d6d]/20 text-[#ff4d6d] relative overflow-hidden ${isPlaying ? 'animate-pulse' : ''}`}>
            <Music className={`w-5 h-5 ${isPlaying ? 'animate-bounce' : ''}`} />
            {isPlaying && (
              <span className="absolute inset-0 bg-[#ff4d6d]/5 animate-ping rounded-full" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="font-serif text-[#5c0620] font-bold text-sm truncate leading-snug">
              {currentTrack.title}
            </h4>
            <p className="text-[#800f2f] text-xs font-sans font-semibold truncate opacity-80 mt-0.5">
              {currentTrack.artist}
            </p>
          </div>
        </div>

        {/* Controls Row */}
        <div className="flex items-center justify-between gap-2">
          {/* Playlist Toggle */}
          <button
            onClick={() => setShowList(!showList)}
            className={`p-2 rounded-lg transition-colors ${showList ? 'bg-[#ff4d6d]/15 text-[#ff4d6d]' : 'text-[#800f2f] hover:bg-[#ff4d6d]/5'}`}
            title="Playlist"
          >
            <ListMusic className="w-5 h-5" />
          </button>

          {/* Previous Button */}
          <button
            className="p-2 rounded-lg text-[#800f2f] hover:bg-[#ff4d6d]/5 transition-colors"
            title="Sebelumnya"
          >
            <SkipBack className="w-5 h-5" />
          </button>

          {/* Play/Pause Button */}
          <button
            onClick={toggle}
            className="w-10 h-10 rounded-full bg-[#ff4d6d] text-white flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-md shadow-[#ff4d6d]/20"
            title={isPlaying ? "Jeda" : "Putar"}
          >
            {isPlaying ? (
              <Pause className="w-5 h-5 fill-current" />
            ) : (
              <Play className="w-5 h-5 fill-current translate-x-0.5" />
            )}
          </button>

          {/* Next Button */}
          <button
            className="p-2 rounded-lg text-[#800f2f] hover:bg-[#ff4d6d]/5 transition-colors"
            title="Berikutnya"
          >
            <SkipForward className="w-5 h-5" />
          </button>

          {/* Mute Button */}
          <button
            onClick={handleMuteToggle}
            className="p-2 rounded-lg text-[#800f2f] hover:bg-[#ff4d6d]/5 transition-colors"
            title={isMuted ? "Suarakan" : "Bisukan"}
          >
            {isMuted ? (
              <VolumeX className="w-5 h-5" />
            ) : (
              <Volume2 className="w-5 h-5" />
            )}
          </button>
        </div>

        {/* Volume Slider */}
        <div className="flex items-center gap-2 pt-1 border-t border-[#ff4d6d]/10">
          <span className="text-[10px] text-[#800f2f]/60 font-sans font-bold">Vol</span>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={isMuted ? 0 : volume}
            onChange={(e) => {
              const val = parseFloat(e.target.value);
              setVolume(val);
              if (val > 0) setIsMuted(false);
            }}
            className="flex-1 h-1 bg-[#ffccd5] rounded-lg appearance-none cursor-pointer accent-[#ff4d6d]"
          />
          <span className="text-[10px] text-[#800f2f]/80 font-sans font-bold tabular-nums w-8 text-right">
            {Math.round((isMuted ? 0 : volume) * 100)}%
          </span>
        </div>
      </div>
    </div>
  );
};
