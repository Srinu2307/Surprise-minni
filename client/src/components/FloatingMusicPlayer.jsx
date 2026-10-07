import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, Volume2, VolumeX, Music, Sparkles, ChevronDown, ChevronUp } from 'lucide-react';
import { soundEngine } from '../utils/soundEngine';

export default function FloatingMusicPlayer({ autoPlay = false }) {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.85);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isExpanded, setIsExpanded] = useState(true);

  // Romantic lyrics snippets to cycle through as lyrical whispers
  const lyricalWhispers = [
    "🎶 Anuvanuvuu Nuvve... In every atom, your warmth glows.",
    "❄️ In this frozen kingdom, you are the eternal sunrise.",
    "✨ Prathi Kshanam Nuvve... Every second is made for you, Minni.",
    "💖 Arijit Singh’s heartfelt melody playing for Minni's special day.",
    "👑 Hail to Princess Minni on her magical birthday!"
  ];
  const [whisperIndex, setWhisperIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setWhisperIndex((prev) => (prev + 1) % lyricalWhispers.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (autoPlay && audioRef.current) {
      audioRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch((e) => {
        console.log("Autoplay waiting for user interaction", e);
      });
    }
  }, [autoPlay]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    soundEngine.init();
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch(console.error);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const handleSeek = (e) => {
    const newTime = parseFloat(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const toggleMute = () => {
    if (!audioRef.current) return;
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    audioRef.current.muted = nextMuted;
    soundEngine.setMuted(nextMuted);
  };

  const handleVolumeChange = (e) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    if (audioRef.current) {
      audioRef.current.volume = val;
      if (val === 0) {
        setIsMuted(true);
        audioRef.current.muted = true;
      } else if (isMuted) {
        setIsMuted(false);
        audioRef.current.muted = false;
      }
    }
  };

  const formatTime = (secs) => {
    if (isNaN(secs)) return '0:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <>
      {/* Hidden Audio Element - connects to backend /api/audio or fallback client /audio.mp3 */}
      <audio
        ref={audioRef}
        src="/api/audio"
        onError={(e) => {
          // If proxy not ready, fallback to static public audio
          e.currentTarget.src = "/audio.mp3";
        }}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={() => setIsPlaying(false)}
        loop
        preload="auto"
      />

      {/* Glassmorphic Floating Dock */}
      <div className="fixed bottom-3 right-3 left-3 sm:left-auto sm:right-5 sm:bottom-5 z-40 sm:max-w-sm">
        <div className="relative rounded-2xl bg-slate-950/75 backdrop-blur-2xl border border-cyan-400/40 shadow-[0_10px_35px_rgba(0,0,0,0.6),0_0_25px_rgba(56,189,248,0.35)] overflow-hidden transition-all duration-300">
          {/* Subtle ice refraction line */}
          <div className="h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent" />

          {/* Top Bar / Header */}
          <div className="p-3.5 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              {/* Disc with spin animation */}
              <button
                onClick={togglePlay}
                className="relative w-11 h-11 flex-shrink-0 rounded-full bg-gradient-to-tr from-cyan-600 to-sky-400 p-0.5 shadow-[0_0_15px_rgba(56,189,248,0.6)] cursor-pointer group hover:scale-105 transition-transform"
              >
                <div
                  className={`w-full h-full rounded-full bg-slate-950 flex items-center justify-center ${
                    isPlaying ? 'animate-spin' : ''
                  }`}
                  style={{ animationDuration: '6s' }}
                >
                  <Music className="w-5 h-5 text-cyan-300" />
                </div>
                {/* Glowing play/pause badge */}
                <div className="absolute inset-0 rounded-full flex items-center justify-center bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-opacity">
                  {isPlaying ? (
                    <Pause className="w-5 h-5 text-cyan-200 fill-cyan-200" />
                  ) : (
                    <Play className="w-5 h-5 text-cyan-200 fill-cyan-200 ml-0.5" />
                  )}
                </div>
              </button>

              {/* Title & Artist */}
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <h4 className="text-xs sm:text-sm font-semibold text-white truncate font-['Outfit']">
                    Anuvanuvuu — Original Song
                  </h4>
                  <Sparkles className="w-3 h-3 text-cyan-300 flex-shrink-0 animate-pulse" />
                </div>
                <p className="text-[11px] text-cyan-300/80 truncate">
                  Arijit Singh • Om Bheem Bush (For Minni)
                </p>
              </div>
            </div>

            {/* Collapse/Expand Toggle */}
            <div className="flex items-center gap-1">
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="p-1.5 text-cyan-300 hover:text-white rounded-lg hover:bg-cyan-900/40 transition-colors"
                title={isExpanded ? "Collapse Player" : "Expand Player"}
              >
                {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Equalizer Frequency Visualizer Bars */}
          <div className="px-3.5 pb-2 flex items-center justify-between gap-1">
            {[18, 42, 75, 90, 60, 35, 80, 95, 45, 65, 30, 85, 50, 70, 90, 40].map((h, i) => (
              <span
                key={i}
                className="w-1 rounded-full bg-gradient-to-t from-cyan-500 to-sky-200 transition-all duration-150"
                style={{
                  height: isPlaying ? `${Math.max(4, Math.sin((currentTime * 4) + i) * 16 + 14)}px` : '4px',
                  opacity: isPlaying ? 0.9 : 0.3
                }}
              />
            ))}
          </div>

          {/* Expanded Player Controls */}
          {isExpanded && (
            <div className="px-3.5 pb-3.5 pt-1 space-y-2.5 border-t border-cyan-900/40">
              {/* Lyrical Whisper Ticker */}
              <div className="py-1 px-2.5 rounded-lg bg-cyan-950/50 border border-cyan-500/20 text-[11px] text-cyan-200/90 font-['Outfit'] italic tracking-wide truncate">
                {lyricalWhispers[whisperIndex]}
              </div>

              {/* Progress Bar & Timers */}
              <div className="space-y-1">
                <input
                  type="range"
                  min="0"
                  max={duration || 100}
                  step="0.1"
                  value={currentTime}
                  onChange={handleSeek}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400 hover:accent-cyan-300"
                />
                <div className="flex justify-between text-[10px] text-cyan-300/70 font-mono">
                  <span>{formatTime(currentTime)}</span>
                  <span>{formatTime(duration)}</span>
                </div>
              </div>

              {/* Playback & Volume Row */}
              <div className="flex items-center justify-between gap-3 pt-1">
                <button
                  onClick={togglePlay}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-400 text-slate-950 font-medium text-xs hover:bg-cyan-300 transition-colors cursor-pointer"
                >
                  {isPlaying ? <Pause className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current" />}
                  <span>{isPlaying ? 'Pause' : 'Play Song'}</span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    onClick={toggleMute}
                    className="text-cyan-300 hover:text-white transition-colors"
                  >
                    {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4" />}
                  </button>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={isMuted ? 0 : volume}
                    onChange={handleVolumeChange}
                    className="w-18 h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
