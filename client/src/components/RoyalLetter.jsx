import React, { useState } from 'react';
import { Scroll, Heart, Sparkles, Feather, Lock, Unlock } from 'lucide-react';
import { soundEngine } from '../utils/soundEngine';

export default function RoyalLetter() {
  const [isOpen, setIsOpen] = useState(false);
  const [heartsBurst, setHeartsBurst] = useState([]);

  const toggleScroll = () => {
    soundEngine.init();
    if (!isOpen) {
      soundEngine.playIceCrack();
      soundEngine.playCelebrationFanfare();
      setIsOpen(true);
    } else {
      soundEngine.playSparkle();
      setIsOpen(false);
    }
  };

  const burstHearts = () => {
    soundEngine.playSparkle();
    const newHearts = Array.from({ length: 8 }, (_, i) => ({
      id: Date.now() + i,
      x: (Math.random() - 0.5) * 200,
      y: -Math.random() * 150 - 50
    }));
    setHeartsBurst(newHearts);
    setTimeout(() => setHeartsBurst([]), 1800);
  };

  return (
    <section id="letter" className="relative py-24 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center mb-12 space-y-3">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-950/70 border border-cyan-400/40 text-cyan-300 text-xs sm:text-sm font-medium uppercase tracking-widest backdrop-blur-md">
          <Feather className="w-3.5 h-3.5 text-cyan-300" />
          The Royal Proclamation
          <Sparkles className="w-3.5 h-3.5 text-cyan-300" />
        </div>

        <h2 className="font-['Cinzel_Decorative'] text-3xl sm:text-4xl lg:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-100 via-white to-sky-200 drop-shadow-[0_4px_16px_rgba(56,189,248,0.7)]">
          A Message From The Heart
        </h2>

        <p className="font-['Outfit'] text-slate-300 max-w-xl mx-auto text-sm sm:text-base leading-relaxed">
          Enclosed in an enchanted frost scroll, penned under the northern stars especially for Princess Minni.
        </p>
      </div>

      {/* Sealed Scroll Container */}
      <div className="relative">
        {!isOpen ? (
          /* Sealed State */
          <div
            onClick={toggleScroll}
            className="cursor-pointer max-w-md mx-auto p-8 rounded-3xl bg-slate-900/80 backdrop-blur-2xl border-2 border-cyan-400/40 shadow-[0_0_60px_rgba(56,189,248,0.3)] hover:shadow-[0_0_80px_rgba(56,189,248,0.6)] hover:border-cyan-300 transition-all duration-500 text-center group hover:-translate-y-1.5"
          >
            {/* Frozen Wax Seal */}
            <div className="mx-auto w-24 h-24 rounded-full bg-gradient-to-tr from-cyan-500 via-sky-400 to-blue-600 border-4 border-cyan-200/80 flex items-center justify-center shadow-[0_0_35px_rgba(56,189,248,0.7)] group-hover:scale-110 transition-transform mb-5 relative">
              <Lock className="w-10 h-10 text-white" />
              <div className="absolute inset-0 rounded-full border border-white/60 animate-ping opacity-30" />
            </div>

            <h3 className="font-['Cinzel_Decorative'] font-bold text-xl sm:text-2xl text-white mb-2">
              The Frozen Seal of Love
            </h3>

            <p className="font-['Outfit'] text-cyan-200/80 text-sm mb-6 leading-relaxed">
              This royal parchment is protected by ancient winter enchantments. Break the crystal seal to read Minni's birthday letter.
            </p>

            <button className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-300 to-sky-200 text-slate-950 font-['Cinzel_Decorative'] font-bold text-sm shadow-[0_0_20px_rgba(56,189,248,0.6)] group-hover:shadow-[0_0_30px_rgba(56,189,248,0.9)] inline-flex items-center gap-2 cursor-pointer transition-all">
              <Unlock className="w-4 h-4 text-slate-950" />
              <span>Break Seal & Read Letter</span>
            </button>
          </div>
        ) : (
          /* Unrolled Royal Parchment */
          <div className="relative rounded-3xl p-8 sm:p-14 bg-gradient-to-b from-slate-900/90 via-slate-950/95 to-cyan-950/90 backdrop-blur-2xl border-2 border-cyan-300/60 shadow-[0_0_90px_rgba(56,189,248,0.4)] animate-fade-in space-y-8">
            {/* Ice Corner Ornaments */}
            <div className="absolute top-4 left-4 text-cyan-400 text-xl">❄️</div>
            <div className="absolute top-4 right-4 text-cyan-400 text-xl">❄️</div>
            <div className="absolute bottom-4 left-4 text-cyan-400 text-xl">❄️</div>
            <div className="absolute bottom-4 right-4 text-cyan-400 text-xl">❄️</div>

            {/* Salutation */}
            <div className="text-center space-y-2 border-b border-cyan-800/40 pb-6">
              <div className="inline-flex items-center gap-2 text-cyan-300 font-['Cinzel_Decorative'] text-xs sm:text-sm font-semibold tracking-widest uppercase">
                👑 To Our Precious Queen 👑
              </div>
              <h3 className="font-['Cinzel_Decorative'] text-2xl sm:text-4xl font-black text-white">
                Dearest Minni,
              </h3>
            </div>

            {/* Letter Body */}
            <div className="space-y-6 font-['Cormorant_Garamond'] text-lg sm:text-xl text-cyan-50/95 leading-relaxed text-justify sm:text-left">
              <p>
                In a world that can often feel rushed and unpredictable, your gentle presence is like a quiet snowfall over a sleeping forest — bringing peace, breathtaking beauty, and an unmatched sense of calm to everyone lucky enough to know you.
              </p>

              <p>
                They say the northern frost can freeze even the mightiest rivers into glass, yet the warmth of your laughter and the sweetness in your eyes could easily melt the deepest winter. Every smile you share carries the golden glow of a new dawn.
              </p>

              <div className="p-5 rounded-2xl bg-cyan-950/40 border border-cyan-400/30 text-center font-['Playfair_Display'] italic text-cyan-200 text-lg sm:text-xl leading-normal">
                “Anuvanuvuu... In every atom of my heart, every second of time, your happiness is celebrated today and forever.”
              </div>

              <p>
                On this day that celebrates the moment you came into this universe, may the heavens shower you with good health, unshakeable confidence, endless laughter, and all the magical dreams your heart has ever dared to wish for.
              </p>

              <p>
                Happy Birthday, Minni. Keep shining brighter than the Northern Lights. You are, and will always be, truly unforgettable.
              </p>
            </div>

            {/* Sign-off */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-6 border-t border-cyan-800/40">
              <div className="text-center sm:text-left">
                <div className="font-['Cinzel_Decorative'] text-lg font-bold text-white">
                  With Infinite Warmth & Admiration,
                </div>
                <div className="font-['Outfit'] text-xs text-cyan-300/80">
                  Forever Celebrating You ❤️
                </div>
              </div>

              {/* Heart Burst Action */}
              <div className="relative">
                <button
                  onClick={burstHearts}
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-400 hover:to-pink-400 text-white font-['Outfit'] font-semibold text-sm shadow-[0_0_25px_rgba(244,63,94,0.6)] hover:scale-105 active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
                >
                  <Heart className="w-4 h-4 fill-white" />
                  <span>Send Love to Minni</span>
                </button>

                {/* Floating Heart Bursts */}
                {heartsBurst.map((h) => (
                  <div
                    key={h.id}
                    className="absolute top-0 left-1/2 pointer-events-none transform -translate-x-1/2 animate-float-heart"
                    style={{
                      transform: `translate(${h.x}px, ${h.y}px)`,
                      transition: 'all 1.6s cubic-bezier(0.1, 0.8, 0.2, 1)',
                      opacity: 0
                    }}
                  >
                    <Heart className="w-6 h-6 fill-rose-400 text-rose-300 drop-shadow-[0_0_8px_#f43f5e]" />
                  </div>
                ))}
              </div>

              {/* Seal Back Up Button */}
              <button
                onClick={toggleScroll}
                className="text-xs text-cyan-300/70 hover:text-cyan-200 underline cursor-pointer"
              >
                Close & Reseal Scroll
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
