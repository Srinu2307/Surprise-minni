import React from 'react';
import { Snowflake, Heart, ArrowUp, Sparkles } from 'lucide-react';
import { soundEngine } from '../utils/soundEngine';

export default function RoyalFooter() {
  const scrollToTop = () => {
    soundEngine.playIceCrack();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative z-20 border-t border-cyan-900/50 bg-slate-950/80 backdrop-blur-xl py-12 px-4 sm:px-6 lg:px-8 text-center text-slate-400 select-none">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-center gap-2 text-cyan-300">
          <Snowflake className="w-5 h-5 text-cyan-400" />
          <span className="font-['Cinzel_Decorative'] font-bold text-base sm:text-lg text-white">
            The Eternal Frozen Realm
          </span>
          <Snowflake className="w-5 h-5 text-cyan-400" />
        </div>

        <p className="font-['Cormorant_Garamond'] text-lg sm:text-xl text-cyan-100/90 italic max-w-xl mx-auto leading-relaxed">
          “May every falling snowflake carry joy, every frosty wind bring health, and every northern light illuminate your boundless dreams, Minni.”
        </p>

        <div className="text-xs text-slate-400 font-['Outfit'] space-y-1">
          <p className="flex items-center justify-center gap-1.5">
            Crafted with all the love in the universe for Minni’s Birthday <Heart className="w-3.5 h-3.5 text-rose-400 fill-rose-400" />
          </p>
          <p className="text-cyan-300/70">
            Music: <span className="font-medium text-cyan-200">Anuvanuvuu</span> • Om Bheem Bush • Sung by Arijit Singh
          </p>
        </div>

        <button
          onClick={scrollToTop}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 border border-cyan-500/30 text-cyan-200 hover:text-white hover:bg-cyan-950 text-xs font-semibold font-['Outfit'] transition-all shadow-sm cursor-pointer"
        >
          <ArrowUp className="w-4 h-4 text-cyan-400" />
          <span>Ascend To The Frost Palace</span>
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
        </button>
      </div>
    </footer>
  );
}
