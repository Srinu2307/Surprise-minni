import React, { useState } from 'react';
import FrostScreenGateway from './components/FrostScreenGateway';
import AuroraBorealisCanvas from './components/AuroraBorealisCanvas';
import RealisticSnowCanvas from './components/RealisticSnowCanvas';
import RoyalNavbar from './components/RoyalNavbar';
import HeroSection from './components/HeroSection';
import FrozenMemoriesGallery from './components/FrozenMemoriesGallery';
import InteractiveIceCake from './components/InteractiveIceCake';
import ElsaMagicPlayground from './components/ElsaMagicPlayground';
import RoyalLetter from './components/RoyalLetter';
import RoyalFooter from './components/RoyalFooter';
import FloatingMusicPlayer from './components/FloatingMusicPlayer';
import { soundEngine } from './utils/soundEngine';

export default function App() {
  const [hasEntered, setHasEntered] = useState(false);
  const [startMusic, setStartMusic] = useState(false);

  const handleEnterKingdom = () => {
    setHasEntered(true);
    setStartMusic(true);
  };

  const handleStartMusic = () => {
    setStartMusic(true);
  };

  return (
    <div className="relative min-h-screen bg-[#030712] text-slate-100 overflow-x-hidden selection:bg-cyan-500 selection:text-slate-950">
      {/* 1. Initial Interactive Frozen Surprise Gateway */}
      {!hasEntered && (
        <FrostScreenGateway
          onEnter={handleEnterKingdom}
          onMusicStart={handleStartMusic}
        />
      )}

      {/* 2. Realistic Dynamic Aurora Borealis Canvas (The Night Sky) */}
      <AuroraBorealisCanvas />

      {/* 3. Realistic 3D Multi-Layered Snowfall Canvas (Background layer so images stay crystal clear) */}
      <RealisticSnowCanvas intensity={0.9} mouseReact={true} />

      {/* 4. Main Kingdom Content (Unveiled once entered) */}
      <div className={`transition-opacity duration-1000 ${hasEntered ? 'opacity-100' : 'opacity-0'}`}>
        <RoyalNavbar onPlayMusic={() => setStartMusic(true)} />

        <main className="relative z-10 space-y-12 sm:space-y-24">
          <HeroSection onPlayMusic={() => setStartMusic(true)} />

          <FrozenMemoriesGallery />

          <InteractiveIceCake />

          <ElsaMagicPlayground />

          <RoyalLetter />
        </main>

        <RoyalFooter />

        {/* 5. Floating Music Player with Anuvanuvuu Karaoke and live frequency spectrum */}
        <FloatingMusicPlayer autoPlay={startMusic} />
      </div>
    </div>
  );
}
