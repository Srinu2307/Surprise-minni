import React, { useState } from 'react';
import { Snowflake, Sparkles, Menu, X, Crown, Music } from 'lucide-react';
import { soundEngine } from '../utils/soundEngine';

export default function RoyalNavbar({ onPlayMusic }) {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { label: 'Realm', href: '#' },
    { label: 'Memories', href: '#gallery' },
    { label: 'Cake', href: '#cake' },
    { label: 'Magic', href: '#magic' },
    { label: 'Letter', href: '#letter' }
  ];

  const handleLinkClick = (href) => {
    soundEngine.playSparkle();
    setIsOpen(false);
    if (href === '#') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      const el = document.querySelector(href);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="relative w-full z-20 px-3 sm:px-6 lg:px-8 pt-4 pb-2 select-none">
      <div className="max-w-6xl mx-auto rounded-2xl bg-slate-950/85 backdrop-blur-2xl border border-cyan-400/30 shadow-[0_4px_30px_rgba(0,0,0,0.7),0_0_20px_rgba(56,189,248,0.2)] px-3 sm:px-6 py-2 sm:py-2.5 flex items-center justify-between">
        {/* Brand */}
        <div
          onClick={() => handleLinkClick('#')}
          className="flex items-center gap-2 sm:gap-2.5 cursor-pointer group"
        >
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-sky-300 p-0.5 shadow-[0_0_15px_rgba(56,189,248,0.6)] group-hover:scale-105 transition-transform flex items-center justify-center flex-shrink-0">
            <Snowflake className="w-4 h-4 sm:w-5 sm:h-5 text-slate-950 animate-spin" style={{ animationDuration: '14s' }} />
          </div>
          <div>
            <div className="flex items-center gap-1 font-['Cinzel_Decorative'] font-black text-xs sm:text-base text-white group-hover:text-cyan-200 transition-colors">
              <span>Princess Minni</span>
              <Crown className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-amber-300" />
            </div>
            <div className="text-[9px] sm:text-[10px] text-cyan-300/70 font-['Outfit'] tracking-wider uppercase">
              The Frozen Realm
            </div>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1.5 sm:gap-2">
          {navLinks.map((item) => (
            <button
              key={item.label}
              onClick={() => handleLinkClick(item.href)}
              className="px-3.5 py-1.5 rounded-xl text-xs font-semibold text-cyan-200 bg-slate-900/70 hover:bg-cyan-900/80 border border-cyan-500/30 hover:border-cyan-300 hover:text-white hover:shadow-[0_0_15px_rgba(56,189,248,0.5)] transition-all font-['Outfit'] cursor-pointer flex items-center justify-center"
            >
              {item.label}
            </button>
          ))}
        </nav>

        {/* Right side Music button & Mobile Menu trigger */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          <button
            onClick={() => {
              soundEngine.playSparkle();
              if (onPlayMusic) onPlayMusic();
            }}
            className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-cyan-950/80 border border-cyan-400/40 text-cyan-300 hover:text-white text-[11px] sm:text-xs font-medium cursor-pointer shadow-sm hover:shadow-[0_0_15px_rgba(56,189,248,0.5)] transition-all"
            title="Music track ‘Anuvanuvuu’ is loaded"
          >
            <Music className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-cyan-300 animate-pulse" />
            <span>Anuvanuvuu</span>
          </button>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-xl text-cyan-300 hover:text-white hover:bg-cyan-950/80 border border-cyan-800/40 transition-colors"
            aria-label="Toggle navigation menu"
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="md:hidden mt-2 rounded-2xl bg-slate-950/95 backdrop-blur-2xl border border-cyan-400/40 p-3 space-y-1.5 shadow-2xl animate-fade-in max-w-6xl mx-auto">
          {navLinks.map((item) => (
            <button
              key={item.label}
              onClick={() => handleLinkClick(item.href)}
              className="w-full text-left px-4 py-2.5 rounded-xl text-sm font-semibold text-cyan-200 hover:text-white bg-slate-900/60 hover:bg-cyan-950/80 border border-cyan-800/30 transition-all font-['Outfit'] flex items-center justify-between"
            >
              <span>{item.label}</span>
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            </button>
          ))}
        </div>
      )}
    </header>
  );
}
