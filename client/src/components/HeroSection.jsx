import React, { useState, useEffect } from 'react';
import { Sparkles, Crown, Heart, Camera, Gift, Wand2, MessageSquareHeart, Music } from 'lucide-react';
import { soundEngine } from '../utils/soundEngine';

export default function HeroSection({ onPlayMusic }) {
  const scrollTo = (id) => {
    soundEngine.playSparkle();
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative min-h-[85vh] flex flex-col justify-center items-center text-center px-4 sm:px-6 lg:px-8 pt-8 sm:pt-12 pb-16 overflow-hidden">
      {/* Background Ice Palace Backdrop with Depth Gradient */}
      <div className="absolute inset-0 z-0">
        <img
          src="/frozen_palace.jpg"
          alt="Royal Frozen Ice Palace"
          className="w-full h-full object-cover object-center opacity-40 scale-105 animate-pulse"
          style={{ animationDuration: '10s' }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/80 via-slate-950/60 to-slate-950" />
      </div>

      {/* Content Container */}
      <div className="relative z-10 max-w-4xl mx-auto space-y-8 animate-fade-in">
        {/* Royal Crown Badge */}
        <div className="inline-flex items-center gap-2.5 px-5 py-2 rounded-full bg-cyan-950/70 border border-cyan-400/50 text-cyan-200 text-xs sm:text-sm font-semibold uppercase tracking-widest backdrop-blur-xl shadow-[0_0_30px_rgba(56,189,248,0.4)]">
          <Crown className="w-4 h-4 text-amber-300 animate-bounce" />
          <span>Her Royal Highness Princess Minni</span>
          <Sparkles className="w-4 h-4 text-cyan-300" />
        </div>

        {/* Main Title with Ice Crystal Refraction */}
        <div className="space-y-3 px-2">
          <h1 className="font-['Cinzel_Decorative'] text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-100 via-white to-sky-200 drop-shadow-[0_8px_30px_rgba(56,189,248,0.9)] tracking-tight">
            Happy Birthday <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-sky-100 to-teal-200">
              Minni!
            </span>
          </h1>

          <p className="font-['Cormorant_Garamond'] text-lg sm:text-2xl md:text-3xl text-cyan-100/90 italic font-medium max-w-2xl mx-auto leading-relaxed">
            “Anuvanuvuu Nuvve... Even the coldest glaciers melt in the radiance of your smile.”
          </p>
        </div>



        {/* Action Navigation Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 pt-4">
          <button
            onClick={() => scrollTo('cake')}
            className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-cyan-300 via-white to-sky-200 hover:from-white hover:to-cyan-300 text-slate-950 font-['Cinzel_Decorative'] font-bold text-sm shadow-[0_0_30px_rgba(56,189,248,0.7)] hover:shadow-[0_0_45px_rgba(56,189,248,0.9)] hover:scale-105 active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
          >
            <Gift className="w-4 h-4 text-slate-950" />
            <span>Blow The Birthday Cake</span>
          </button>

          <button
            onClick={() => scrollTo('gallery')}
            className="px-6 py-3.5 rounded-2xl bg-slate-900/80 hover:bg-slate-800 border border-cyan-400/50 text-cyan-200 hover:text-white font-['Outfit'] font-semibold text-sm backdrop-blur-md shadow-lg hover:scale-105 active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
          >
            <Camera className="w-4 h-4 text-cyan-300" />
            <span>View Crystal Memories</span>
          </button>

          <button
            onClick={() => scrollTo('magic')}
            className="px-5 py-3.5 rounded-2xl bg-cyan-950/60 hover:bg-cyan-900/80 border border-cyan-500/40 text-cyan-300 hover:text-white font-['Outfit'] font-semibold text-sm backdrop-blur-md shadow-lg hover:scale-105 active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
          >
            <Wand2 className="w-4 h-4 text-cyan-400" />
            <span>Elsa's Magic</span>
          </button>

          <button
            onClick={() => scrollTo('letter')}
            className="px-5 py-3.5 rounded-2xl bg-slate-900/80 hover:bg-slate-800 border border-cyan-400/50 text-rose-300 hover:text-white font-['Outfit'] font-semibold text-sm backdrop-blur-md shadow-lg hover:scale-105 active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
          >
            <Heart className="w-4 h-4 text-rose-400 fill-rose-400" />
            <span>Birthday Letter</span>
          </button>
        </div>
      </div>
    </section>
  );
}
