import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { Sparkles, Flame, Mic, MicOff, Wind, RotateCcw, Award } from 'lucide-react';
import { soundEngine } from '../utils/soundEngine';

export default function InteractiveIceCake() {
  const [candlesLit, setCandlesLit] = useState(true);
  const [isBlowing, setIsBlowing] = useState(false);
  const [blowProgress, setBlowProgress] = useState(0);
  const [micEnabled, setMicEnabled] = useState(false);
  const [micVolume, setMicVolume] = useState(0);
  const [wishGranted, setWishGranted] = useState(false);
  const blowTimerRef = useRef(null);
  const audioContextRef = useRef(null);
  const micStreamRef = useRef(null);

  // Trigger celebration explosion
  const celebrateWish = () => {
    soundEngine.playBlowWind();
    soundEngine.playCelebrationFanfare();
    setCandlesLit(false);
    setWishGranted(true);

    // Call stats API
    fetch('/api/stats/increment', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ key: 'candlesBlownCount' })
    }).catch(() => {});

    // Spectacular frozen confetti blast: ice blue, silver, cyan, and gold
    const end = Date.now() + 3.5 * 1000;
    const colors = ['#67e8f9', '#38bdf8', '#e0f2fe', '#ffffff', '#fde047'];

    (function frame() {
      confetti({
        particleCount: 5,
        angle: 60,
        spread: 70,
        origin: { x: 0, y: 0.7 },
        colors: colors
      });
      confetti({
        particleCount: 5,
        angle: 120,
        spread: 70,
        origin: { x: 1, y: 0.7 },
        colors: colors
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    })();
  };

  // Click or Trigger blow out
  const triggerBlowOut = () => {
    if (!candlesLit || isBlowing) return;
    setIsBlowing(true);
    soundEngine.init();
    soundEngine.playBlowWind();

    let p = 0;
    const interval = setInterval(() => {
      p += 25;
      setBlowProgress(p);
      if (p >= 100) {
        clearInterval(interval);
        setIsBlowing(false);
        setBlowProgress(0);
        celebrateWish();
      }
    }, 180);
  };

  // Click / Hold to blow out
  const startBlowing = () => {
    if (!candlesLit) return;
    setIsBlowing(true);
    soundEngine.init();
    soundEngine.playBlowWind();

    let p = 0;
    blowTimerRef.current = setInterval(() => {
      p += 20;
      setBlowProgress(p);
      if (p >= 100) {
        clearInterval(blowTimerRef.current);
        setIsBlowing(false);
        setBlowProgress(0);
        celebrateWish();
      }
    }, 120);
  };

  const stopBlowing = () => {
    if (blowTimerRef.current) {
      clearInterval(blowTimerRef.current);
      // If reached at least 40% when releasing, finish celebration!
      if (blowProgress >= 40) {
        setIsBlowing(false);
        setBlowProgress(0);
        celebrateWish();
      } else {
        setIsBlowing(false);
        setBlowProgress(0);
      }
    }
  };

  // Microphone breath detection
  const toggleMic = async () => {
    if (micEnabled) {
      if (micStreamRef.current) {
        micStreamRef.current.getTracks().forEach((track) => track.stop());
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
      setMicEnabled(false);
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      micStreamRef.current = stream;
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      audioContextRef.current = audioCtx;
      const analyser = audioCtx.createAnalyser();
      const source = audioCtx.createMediaStreamSource(stream);
      source.connect(analyser);
      analyser.fftSize = 256;

      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);
      setMicEnabled(true);

      const checkVolume = () => {
        if (!micStreamRef.current) return;
        analyser.getByteFrequencyData(dataArray);
        let sum = 0;
        for (let i = 0; i < bufferLength; i++) {
          sum += dataArray[i];
        }
        const avg = sum / bufferLength;
        setMicVolume(avg);

        // If high breath noise detected and candles are lit
        if (avg > 48 && candlesLit) {
          celebrateWish();
        } else {
          requestAnimationFrame(checkVolume);
        }
      };
      checkVolume();
    } catch (err) {
      alert("Microphone access could not be enabled. You can hold the 'Blow Candles' button instead!");
      setMicEnabled(false);
    }
  };

  const relightCandles = () => {
    soundEngine.playSparkle();
    setCandlesLit(true);
    setWishGranted(false);
    setBlowProgress(0);
  };

  useEffect(() => {
    return () => {
      if (blowTimerRef.current) clearInterval(blowTimerRef.current);
      if (micStreamRef.current) {
        micStreamRef.current.getTracks().forEach((t) => t.stop());
      }
    };
  }, []);

  return (
    <section id="cake" className="relative py-24 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
      {/* Container with Frosted Glass Backdrop */}
      <div className="relative rounded-3xl p-6 sm:p-12 bg-gradient-to-b from-slate-900/80 via-slate-950/90 to-cyan-950/80 backdrop-blur-2xl border border-cyan-400/40 shadow-[0_0_80px_rgba(56,189,248,0.3)] text-center overflow-hidden">
        {/* Decorative corner icicles */}
        <div className="absolute top-0 left-0 right-0 h-4 bg-gradient-to-b from-cyan-300/30 to-transparent pointer-events-none" />

        {/* Section Header */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-950/80 border border-cyan-400/40 text-cyan-300 text-xs sm:text-sm font-medium uppercase tracking-widest mb-4">
          <Award className="w-4 h-4 text-cyan-300" />
          The Royal Birthday Ceremony
          <Sparkles className="w-4 h-4 text-cyan-300" />
        </div>

        <h2 className="font-['Cinzel_Decorative'] text-3xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-100 via-white to-sky-200 drop-shadow-[0_4px_16px_rgba(56,189,248,0.8)] mb-4">
          The Crystal Birthday Cake
        </h2>

        <p className="font-['Outfit'] text-slate-300 max-w-xl mx-auto text-sm sm:text-base leading-relaxed mb-8">
          Sculpted by winter magic from pure glacial crystal. Close your eyes, make your deepest wish for Minni's coming year, and blow out the enchanted candles!
        </p>

        {/* Realistic Cake Display with Floating Interactive Candle Flames */}
        <div className="relative max-w-md mx-auto mb-10 select-none">
          {/* Glowing Cake Base */}
          <div className="relative rounded-3xl overflow-hidden border-2 border-cyan-300/50 shadow-[0_0_50px_rgba(56,189,248,0.5)] group">
            <img
              src="/frozen_cake.jpg"
              alt="Enchanted Frozen Birthday Cake"
              className="w-full h-auto object-cover transform group-hover:scale-102 transition-transform duration-700"
            />

            {/* Candle Flames Overlay (Synchronized with Lit State) */}
            {candlesLit ? (
              <div className="absolute top-[8%] left-[24%] right-[24%] flex justify-between pointer-events-none">
                {[0, 1, 2, 3, 4].map((i) => (
                  <div key={i} className="relative flex flex-col items-center">
                    {/* Flame Glow */}
                    <div
                      className={`w-4 h-7 rounded-full bg-gradient-to-t from-cyan-400 via-sky-200 to-amber-200 blur-[2px] animate-pulse shadow-[0_0_15px_#38bdf8] ${
                        isBlowing ? 'scale-75 -translate-y-1' : ''
                      }`}
                      style={{
                        animationDuration: `${0.8 + i * 0.2}s`,
                        animationDelay: `${i * 0.15}s`
                      }}
                    />
                    {/* Tiny Sparkle Core */}
                    <span className="w-1.5 h-3 bg-white rounded-full -mt-4 shadow-sm" />
                  </div>
                ))}
              </div>
            ) : (
              /* Smoke Whiffs when candles are blown */
              <div className="absolute top-[8%] left-[24%] right-[24%] flex justify-between pointer-events-none">
                {[0, 1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="w-2 h-8 bg-cyan-200/40 rounded-full blur-[3px] animate-fade-out"
                    style={{ animationDuration: '2.5s' }}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Candle Status Badge */}
          <div className="mt-4 inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-slate-900/80 border border-cyan-500/30 text-xs font-semibold text-cyan-200">
            {candlesLit ? (
              <>
                <Flame className="w-3.5 h-3.5 text-amber-300 animate-bounce" />
                <span>Frost Candles Are Glowing</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5 text-cyan-300 animate-spin" />
                <span>Candles Extinguished — Wish Has Been Sent!</span>
              </>
            )}
          </div>
        </div>

        {/* Interactive Blowing Controls */}
        <div className="space-y-6">
          {candlesLit ? (
            <div className="space-y-4">
              {/* Blow Button with Progress Ring */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <button
                  onClick={triggerBlowOut}
                  onMouseDown={startBlowing}
                  onMouseUp={stopBlowing}
                  onTouchStart={startBlowing}
                  onTouchEnd={stopBlowing}
                  className="group relative px-8 py-4 rounded-2xl font-['Cinzel_Decorative'] font-bold text-base text-slate-950 bg-gradient-to-r from-cyan-200 via-white to-sky-200 hover:from-white hover:to-cyan-300 shadow-[0_0_35px_rgba(56,189,248,0.7)] hover:shadow-[0_0_55px_rgba(56,189,248,0.9)] hover:scale-105 active:scale-95 transition-all flex items-center gap-3 cursor-pointer select-none"
                >
                  <Wind className={`w-5 h-5 text-cyan-900 ${isBlowing ? 'animate-spin' : ''}`} />
                  <span>{isBlowing ? `Blowing... (${blowProgress}%)` : 'Press & Hold to Blow Candles'}</span>
                  <Sparkles className="w-5 h-5 text-cyan-900" />
                </button>

                {/* Optional Real Microphone Blow Button */}
                <button
                  onClick={toggleMic}
                  className={`px-5 py-4 rounded-2xl border font-['Outfit'] font-semibold text-sm flex items-center gap-2 transition-all cursor-pointer ${
                    micEnabled
                      ? 'bg-rose-950/60 border-rose-400 text-rose-200 shadow-[0_0_20px_rgba(244,63,94,0.4)]'
                      : 'bg-cyan-950/40 border-cyan-400/40 text-cyan-200 hover:bg-cyan-900/60'
                  }`}
                  title="Enable microphone to blow on the screen with your breath"
                >
                  {micEnabled ? (
                    <>
                      <MicOff className="w-4 h-4 text-rose-400" />
                      <span>Disable Mic Blow</span>
                    </>
                  ) : (
                    <>
                      <Mic className="w-4 h-4 text-cyan-300" />
                      <span>Blow with Microphone Breath</span>
                    </>
                  )}
                </button>
              </div>

              {/* Progress Bar when holding */}
              {isBlowing && (
                <div className="max-w-xs mx-auto">
                  <div className="w-full h-2.5 rounded-full bg-slate-800 overflow-hidden border border-cyan-400/30">
                    <div
                      className="h-full bg-gradient-to-r from-cyan-400 via-sky-300 to-white transition-all duration-150"
                      style={{ width: `${blowProgress}%` }}
                    />
                  </div>
                  <p className="text-xs text-cyan-300/80 mt-1 font-mono">Keep holding to extinguish the flame!</p>
                </div>
              )}

              {micEnabled && (
                <div className="text-xs text-cyan-300 font-mono animate-pulse">
                  🎙️ Microphone active! Blow directly onto your phone or laptop mic to extinguish the candles! (Level: {Math.round(micVolume)})
                </div>
              )}
            </div>
          ) : (
            /* Celebration Message Once Extinguished */
            <div className="space-y-6 animate-fade-in">
              <div className="p-6 rounded-2xl bg-gradient-to-r from-cyan-950/60 via-sky-950/60 to-cyan-950/60 border border-cyan-300/50 shadow-[0_0_40px_rgba(56,189,248,0.4)] max-w-xl mx-auto">
                <Sparkles className="w-8 h-8 text-cyan-300 mx-auto mb-2 animate-bounce" />
                <h3 className="font-['Cinzel_Decorative'] text-2xl sm:text-3xl font-black text-white mb-2">
                  🎉 Wish Granted, Princess Minni! 🎉
                </h3>
                <p className="font-['Cormorant_Garamond'] text-lg sm:text-xl text-cyan-100 italic leading-relaxed">
                  "May every wish whispered in the winter wind dance its way into your life, bringing joy as boundless as the northern sky."
                </p>
              </div>

              <button
                onClick={relightCandles}
                className="px-6 py-3 rounded-xl bg-slate-900 border border-cyan-400/40 text-cyan-200 hover:text-white hover:bg-cyan-950 font-semibold text-sm inline-flex items-center gap-2 transition-all cursor-pointer"
              >
                <RotateCcw className="w-4 h-4 text-cyan-400" />
                <span>Relight Frost Candles & Wish Again</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
