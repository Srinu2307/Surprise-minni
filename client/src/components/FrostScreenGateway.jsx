import React, { useEffect, useRef, useState } from 'react';
import { soundEngine } from '../utils/soundEngine';
import { Sparkles, Snowflake, Wand2, Volume2 } from 'lucide-react';

export default function FrostScreenGateway({ onEnter, onMusicStart }) {
  const canvasRef = useRef(null);
  const [meltedPercent, setMeltedPercent] = useState(0);
  const [isShattering, setIsShattering] = useState(false);
  const [shatterFragments, setShatterFragments] = useState([]);
  const isDrawingRef = useRef(false);
  const totalPixelsRef = useRef(0);
  const clearedPixelsRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const width = (canvas.width = window.innerWidth);
    const height = (canvas.height = window.innerHeight);

    // Generate realistic frost texture on the canvas
    const drawFrostTexture = () => {
      // Base translucent frosted glass gradient
      const grad = ctx.createRadialGradient(
        width / 2, height / 2, 80,
        width / 2, height / 2, Math.max(width, height) * 0.8
      );
      grad.addColorStop(0, 'rgba(195, 230, 255, 0.94)');
      grad.addColorStop(0.5, 'rgba(160, 210, 245, 0.96)');
      grad.addColorStop(1, 'rgba(125, 185, 235, 0.98)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);

      // Draw delicate crystalline ice dendrites (fern branches)
      const drawIceDendrite = (x, y, length, angle, depth) => {
        if (depth <= 0) return;
        const x2 = x + Math.cos(angle) * length;
        const y2 = y + Math.sin(angle) * length;

        ctx.strokeStyle = `rgba(255, 255, 255, ${0.25 + depth * 0.15})`;
        ctx.lineWidth = depth * 1.5;
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x2, y2);
        ctx.stroke();

        // Sub-branches
        drawIceDendrite(x2, y2, length * 0.72, angle - 0.5, depth - 1);
        drawIceDendrite(x2, y2, length * 0.72, angle + 0.5, depth - 1);
      };

      // Scatter ice dendrites along borders and corners
      const corners = [
        [0, 0, 1.2],
        [width, 0, 2.4],
        [0, height, -0.6],
        [width, height, -2.2],
        [width * 0.25, 0, 1.4],
        [width * 0.75, 0, 1.8],
        [width * 0.5, height, -1.5]
      ];

      corners.forEach(([cx, cy, ang]) => {
        for (let i = 0; i < 4; i++) {
          drawIceDendrite(cx, cy, 70 + Math.random() * 40, ang + (Math.random() - 0.5) * 0.6, 4);
        }
      });

      // Scatter ice crystallization noise
      ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
      for (let i = 0; i < 4000; i++) {
        const nx = Math.random() * width;
        const ny = Math.random() * height;
        const sz = Math.random() * 2.5;
        ctx.fillRect(nx, ny, sz, sz);
      }

      // Add vignette ice frost rim
      ctx.strokeStyle = 'rgba(240, 250, 255, 0.5)';
      ctx.lineWidth = 14;
      ctx.strokeRect(0, 0, width, height);
    };

    drawFrostTexture();

    // Track cleared pixels estimation
    totalPixelsRef.current = (width * height) / 1000;
  }, []);

  // Melt frost function (Scratch / thermal reveal)
  const meltAt = (x, y) => {
    const canvas = canvasRef.current;
    if (!canvas || isShattering) return;
    const ctx = canvas.getContext('2d');

    ctx.save();
    ctx.globalCompositeOperation = 'destination-out';

    // Melt brush with soft feathered edges
    const radius = 55;
    const grad = ctx.createRadialGradient(x, y, 0, x, y, radius);
    grad.addColorStop(0, 'rgba(0, 0, 0, 1)');
    grad.addColorStop(0.65, 'rgba(0, 0, 0, 0.85)');
    grad.addColorStop(1, 'rgba(0, 0, 0, 0)');

    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // Occasional sound and sparkle
    if (Math.random() < 0.2) {
      soundEngine.playIceCrack();
    }
    if (Math.random() < 0.3) {
      soundEngine.playSparkle();
    }

    clearedPixelsRef.current += 1;
    const pct = Math.min(100, Math.floor((clearedPixelsRef.current / (totalPixelsRef.current * 0.15)) * 100));
    setMeltedPercent(pct);
  };

  const handlePointerDown = (e) => {
    isDrawingRef.current = true;
    soundEngine.init();
    soundEngine.playIceCrack();
    meltAt(e.clientX, e.clientY);
  };

  const handlePointerMove = (e) => {
    if (!isDrawingRef.current) return;
    meltAt(e.clientX, e.clientY);
  };

  const handlePointerUp = () => {
    isDrawingRef.current = false;
  };

  // Shatter the entire frost layer
  const handleShatter = () => {
    if (isShattering) return;
    soundEngine.init();
    soundEngine.playIceCrack();
    soundEngine.playCelebrationFanfare();
    setIsShattering(true);

    if (onMusicStart) onMusicStart();

    // Generate exploding crystal shards
    const shards = [];
    const count = 35;
    for (let i = 0; i < count; i++) {
      shards.push({
        id: i,
        x: (Math.random() - 0.5) * window.innerWidth * 0.8,
        y: (Math.random() - 0.5) * window.innerHeight * 0.8,
        rot: (Math.random() - 0.5) * 720,
        scale: 0.5 + Math.random() * 1.5,
        delay: Math.random() * 0.2
      });
    }
    setShatterFragments(shards);

    // Notify backend stat
    fetch('/api/stats/increment', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ key: 'frostMeltedCount' })
    }).catch(() => {});

    setTimeout(() => {
      if (onEnter) onEnter();
    }, 1100);
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center select-none overflow-hidden transition-opacity duration-1000 ${
        isShattering ? 'pointer-events-none opacity-0' : 'opacity-100'
      }`}
      style={{
        background: 'radial-gradient(ellipse at center, rgba(10,25,50,0.4) 0%, rgba(2,6,15,0.85) 100%)'
      }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
    >
      {/* Interactive Frost Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 cursor-crosshair touch-none"
      />

      {/* Exploding Shards Animation */}
      {isShattering && (
        <div className="absolute inset-0 pointer-events-none">
          {shatterFragments.map((shard) => (
            <div
              key={shard.id}
              className="absolute top-1/2 left-1/2 w-16 h-24 bg-gradient-to-tr from-cyan-200/90 to-white/95 rounded-sm shadow-2xl backdrop-blur-md"
              style={{
                clipPath: 'polygon(50% 0%, 100% 70%, 75% 100%, 0% 85%)',
                transform: `translate(${shard.x}px, ${shard.y}px) rotate(${shard.rot}deg) scale(${shard.scale})`,
                transition: 'all 1s cubic-bezier(0.1, 0.8, 0.2, 1)',
                opacity: 0,
                border: '1px solid rgba(255,255,255,0.9)'
              }}
            />
          ))}
        </div>
      )}

      {/* Frost Gateway Center Card */}
      <div className="relative z-10 max-w-lg mx-4 p-8 sm:p-10 text-center rounded-3xl bg-slate-950/40 backdrop-blur-xl border border-cyan-300/40 shadow-[0_0_80px_rgba(56,189,248,0.35)] animate-fade-in">
        {/* Glowing Snowflake Emblem */}
        <div className="mx-auto mb-5 w-20 h-20 rounded-full bg-gradient-to-tr from-cyan-500/20 to-blue-300/30 border border-cyan-300/60 flex items-center justify-center shadow-[0_0_30px_rgba(56,189,248,0.6)] animate-pulse">
          <Snowflake className="w-10 h-10 text-cyan-200 animate-spin" style={{ animationDuration: '18s' }} />
        </div>

        {/* Royal Title */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-950/60 border border-cyan-400/40 text-cyan-300 text-xs sm:text-sm font-medium uppercase tracking-widest mb-3">
          <Sparkles className="w-3.5 h-3.5 text-cyan-300" />
          A Royal Birthday Enchantment
          <Sparkles className="w-3.5 h-3.5 text-cyan-300" />
        </div>

        <h1 className="font-['Cinzel_Decorative'] text-3xl sm:text-4xl lg:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-100 via-white to-sky-200 drop-shadow-[0_4px_16px_rgba(56,189,248,0.8)] tracking-wide mb-3">
          Princess Minni
        </h1>

        <p className="font-['Outfit'] text-slate-200 text-sm sm:text-base leading-relaxed mb-6">
          The Northern Kingdom is blanketed in ancient frost. <br />
          <span className="text-cyan-300 font-medium">Rub or drag across your screen</span> to melt the ice, or click below to unleash the winter magic!
        </p>

        {/* Melt progress bar */}
        {meltedPercent > 0 && (
          <div className="mb-6">
            <div className="flex justify-between text-xs text-cyan-200 mb-1 font-medium">
              <span>Frost Cleared</span>
              <span>{meltedPercent}%</span>
            </div>
            <div className="w-full h-2 rounded-full bg-cyan-950/80 border border-cyan-500/30 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-cyan-400 to-sky-200 rounded-full transition-all duration-300"
                style={{ width: `${meltedPercent}%` }}
              />
            </div>
          </div>
        )}

        {/* Action Button */}
        <button
          onClick={handleShatter}
          className="group relative w-full py-4 px-8 rounded-2xl font-['Cinzel_Decorative'] font-bold text-base sm:text-lg text-slate-950 bg-gradient-to-r from-cyan-200 via-white to-sky-200 hover:from-white hover:to-cyan-300 transition-all duration-300 shadow-[0_0_35px_rgba(56,189,248,0.6)] hover:shadow-[0_0_50px_rgba(56,189,248,0.9)] hover:scale-[1.02] active:scale-[0.98] overflow-hidden flex items-center justify-center gap-3 cursor-pointer"
        >
          <span className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
          <Wand2 className="w-5 h-5 text-cyan-900 group-hover:rotate-12 transition-transform" />
          <span>Shatter The Frost & Enter</span>
          <Sparkles className="w-5 h-5 text-cyan-900" />
        </button>

        <p className="text-[11px] text-cyan-300/70 mt-4 flex items-center justify-center gap-1.5">
          <Volume2 className="w-3.5 h-3.5 text-cyan-400" />
          Includes “Anuvanuvuu” melody & realistic winter soundscapes
        </p>
      </div>
    </div>
  );
}
