import React, { useState, useEffect } from 'react';
import { Wand2, Snowflake, Wind, Sparkles, Gem, Activity, Heart } from 'lucide-react';
import { soundEngine } from '../utils/soundEngine';

export default function ElsaMagicPlayground() {
  const [selectedSpell, setSelectedSpell] = useState('bloom');
  const [activeSpells, setActiveSpells] = useState([]);
  const [stats, setStats] = useState({
    frostMeltedCount: 142,
    candlesBlownCount: 18,
    spellsCastCount: 260,
    wishesCount: 12
  });

  const spells = [
    {
      id: 'bloom',
      name: 'Frost Bloom',
      icon: Snowflake,
      desc: 'Sprouts blooming crystalline ice fractals wherever you click.',
      color: 'from-cyan-400 to-sky-200'
    },
    {
      id: 'blizzard',
      name: 'Blizzard Whirlwind',
      icon: Wind,
      desc: 'Summons a swirling spiral of frosty winter flakes.',
      color: 'from-sky-300 to-indigo-300'
    },
    {
      id: 'aurora',
      name: 'Aurora Surge',
      icon: Sparkles,
      desc: 'Pulsates glowing emerald & violet rays across the skies.',
      color: 'from-emerald-300 to-purple-400'
    },
    {
      id: 'diamonds',
      name: 'Diamond Rain',
      icon: Gem,
      desc: 'Showers glistening frozen diamonds of eternal joy.',
      color: 'from-blue-200 to-white'
    }
  ];

  // Fetch stats from backend
  const fetchStats = () => {
    fetch('/api/stats')
      .then((res) => res.json())
      .then((data) => {
        if (data && !data.error) setStats(data);
      })
      .catch(() => {});
  };

  useEffect(() => {
    fetchStats();
    const interval = setInterval(fetchStats, 10000);
    return () => clearInterval(interval);
  }, []);

  const castSpell = (e) => {
    soundEngine.init();
    if (selectedSpell === 'bloom') soundEngine.playFrostBloom();
    else if (selectedSpell === 'blizzard') soundEngine.playBlowWind();
    else if (selectedSpell === 'aurora') soundEngine.playCrystalChime(1.5);
    else soundEngine.playSparkle();

    // Create visual spell particle
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX ? e.clientX - rect.left : rect.width / 2;
    const y = e.clientY ? e.clientY - rect.top : rect.height / 2;

    const newSpell = {
      id: Date.now() + Math.random(),
      type: selectedSpell,
      x,
      y
    };

    setActiveSpells((prev) => [...prev.slice(-15), newSpell]);

    // Increment backend stat
    fetch('/api/stats/increment', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ key: 'spellsCastCount' })
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.spellsCastCount) {
          setStats((prev) => ({ ...prev, spellsCastCount: data.spellsCastCount }));
        }
      })
      .catch(() => {
        setStats((prev) => ({ ...prev, spellsCastCount: prev.spellsCastCount + 1 }));
      });

    // Remove spell particle after animation
    setTimeout(() => {
      setActiveSpells((prev) => prev.filter((s) => s.id !== newSpell.id));
    }, 2000);
  };

  return (
    <section id="magic" className="relative py-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="text-center mb-12 space-y-3">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-950/70 border border-cyan-400/40 text-cyan-300 text-xs sm:text-sm font-medium uppercase tracking-widest backdrop-blur-md">
          <Wand2 className="w-3.5 h-3.5 text-cyan-300" />
          Interactive Ice Sorcery
          <Sparkles className="w-3.5 h-3.5 text-cyan-300" />
        </div>

        <h2 className="font-['Cinzel_Decorative'] text-3xl sm:text-4xl lg:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-100 via-white to-sky-200 drop-shadow-[0_4px_16px_rgba(56,189,248,0.7)]">
          Elsa’s Winter Wand
        </h2>

        <p className="font-['Outfit'] text-slate-300 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
          Select a winter enchantment, then click or tap inside the ice sanctum below to cast magical frost spells in honor of Minni!
        </p>
      </div>

      {/* Spell Selection Toolbar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-8">
        {spells.map((s) => {
          const Icon = s.icon;
          const isSelected = selectedSpell === s.id;
          return (
            <button
              key={s.id}
              onClick={() => {
                soundEngine.playSparkle();
                setSelectedSpell(s.id);
              }}
              className={`p-4 rounded-2xl border text-left transition-all duration-300 cursor-pointer ${
                isSelected
                  ? 'bg-cyan-950/80 border-cyan-300 shadow-[0_0_25px_rgba(56,189,248,0.5)] scale-102'
                  : 'bg-slate-900/60 border-cyan-800/40 hover:bg-slate-800/70 text-slate-300'
              }`}
            >
              <div className="flex items-center gap-3 mb-2">
                <div
                  className={`p-2 rounded-xl bg-gradient-to-tr ${s.color} text-slate-950 shadow-md`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <h4 className="font-['Cinzel_Decorative'] font-bold text-sm sm:text-base text-white">
                  {s.name}
                </h4>
              </div>
              <p className="text-xs text-slate-300/80 font-['Outfit'] leading-tight">
                {s.desc}
              </p>
            </button>
          );
        })}
      </div>

      {/* Interactive Spell Casting Sanctum */}
      <div
        onClick={castSpell}
        className="relative h-72 sm:h-96 rounded-3xl bg-slate-950/80 border-2 border-dashed border-cyan-400/40 backdrop-blur-xl shadow-[0_0_50px_rgba(56,189,248,0.2)] overflow-hidden cursor-crosshair flex items-center justify-center select-none group"
      >
        {/* Subtle background radial glow */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(56,189,248,0.15)_0%,_transparent_70%)] pointer-events-none" />

        {/* Floating guidance prompt */}
        <div className="text-center pointer-events-none space-y-2 z-10 px-4">
          <div className="mx-auto w-12 h-12 rounded-full bg-cyan-950/60 border border-cyan-400/50 flex items-center justify-center text-cyan-300 animate-pulse">
            <Wand2 className="w-6 h-6" />
          </div>
          <h4 className="font-['Cinzel_Decorative'] font-bold text-lg text-cyan-200">
            Touch or Click Anywhere to Cast Magic
          </h4>
          <p className="text-xs text-slate-300/70 font-['Outfit']">
            Active Spell: <span className="text-cyan-300 font-semibold">{spells.find((s) => s.id === selectedSpell)?.name}</span>
          </p>
        </div>

        {/* Animated Spells Cast */}
        {activeSpells.map((s) => (
          <div
            key={s.id}
            className="absolute pointer-events-none transform -translate-x-1/2 -translate-y-1/2"
            style={{ left: s.x, top: s.y }}
          >
            {s.type === 'bloom' && (
              <div className="relative animate-ping-once flex items-center justify-center">
                <Snowflake className="w-20 h-20 text-cyan-200 animate-spin" style={{ animationDuration: '3s' }} />
                <div className="absolute inset-0 rounded-full border-2 border-cyan-300 animate-ping" />
              </div>
            )}
            {s.type === 'blizzard' && (
              <div className="relative flex items-center justify-center animate-spin" style={{ animationDuration: '1.2s' }}>
                <Wind className="w-24 h-24 text-sky-200" />
                <div className="absolute w-28 h-28 rounded-full border border-sky-400/40 animate-pulse" />
              </div>
            )}
            {s.type === 'aurora' && (
              <div className="w-40 h-40 rounded-full bg-gradient-to-tr from-emerald-400/60 via-cyan-400/50 to-purple-500/60 blur-xl animate-pulse" />
            )}
            {s.type === 'diamonds' && (
              <div className="flex gap-2 animate-bounce">
                <Gem className="w-8 h-8 text-white filter drop-shadow-[0_0_10px_#fff]" />
                <Gem className="w-10 h-10 text-cyan-200 filter drop-shadow-[0_0_10px_#67e8f9]" />
                <Gem className="w-7 h-7 text-sky-200 filter drop-shadow-[0_0_10px_#38bdf8]" />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Live Royal Kingdom Stats */}
      <div className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Frost Melted', value: stats.frostMeltedCount, icon: Snowflake },
          { label: 'Candles Extinguished', value: stats.candlesBlownCount, icon: Sparkles },
          { label: 'Spells Cast', value: stats.spellsCastCount, icon: Wand2 },
          { label: 'Moments Cherished', value: (stats.wishesCount || 9) + 12, icon: Heart }
        ].map((item, idx) => {
          const Icon = item.icon;
          return (
            <div
              key={idx}
              className="p-4 rounded-2xl bg-slate-900/60 backdrop-blur-md border border-cyan-900/50 text-center"
            >
              <Icon className="w-5 h-5 text-cyan-300 mx-auto mb-1.5" />
              <div className="font-['Cinzel_Decorative'] font-black text-2xl sm:text-3xl text-white">
                {item.value}
              </div>
              <div className="text-xs text-cyan-200/70 font-['Outfit'] font-medium">
                {item.label}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
