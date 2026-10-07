import React, { useEffect, useRef } from 'react';

export default function AuroraBorealisCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let animationFrameId;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Stars in the background
    const starCount = 180;
    const stars = Array.from({ length: starCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * (height * 0.7),
      size: Math.random() * 1.5 + 0.5,
      alpha: Math.random() * 0.8 + 0.2,
      twinkleSpeed: Math.random() * 0.04 + 0.01,
      phase: Math.random() * Math.PI * 2
    }));

    // Aurora ribbons configuration
    const ribbons = [
      {
        baseY: 0.18,
        amplitude: 65,
        speed: 0.0008,
        freq: 0.003,
        color1: 'rgba(0, 245, 160, 0.28)',
        color2: 'rgba(0, 210, 255, 0.22)',
        color3: 'rgba(5, 10, 40, 0)',
        height: 280,
        phase: 0
      },
      {
        baseY: 0.25,
        amplitude: 80,
        speed: 0.0006,
        freq: 0.0025,
        color1: 'rgba(0, 229, 255, 0.32)',
        color2: 'rgba(157, 78, 221, 0.24)',
        color3: 'rgba(5, 10, 40, 0)',
        height: 320,
        phase: 2
      },
      {
        baseY: 0.22,
        amplitude: 50,
        speed: 0.001,
        freq: 0.004,
        color1: 'rgba(114, 9, 183, 0.2)',
        color2: 'rgba(72, 149, 239, 0.25)',
        color3: 'rgba(5, 10, 40, 0)',
        height: 250,
        phase: 4
      }
    ];

    let t = 0;

    const render = () => {
      t += 1;
      ctx.clearRect(0, 0, width, height);

      // 1. Draw twinkling stars
      for (const s of stars) {
        s.phase += s.twinkleSpeed;
        const curAlpha = s.alpha * (0.6 + 0.4 * Math.sin(s.phase));
        ctx.fillStyle = `rgba(235, 245, 255, ${curAlpha})`;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
        ctx.fill();
      }

      // 2. Draw Aurora curtains
      ctx.save();
      ctx.globalCompositeOperation = 'screen';

      for (const r of ribbons) {
        const ribbonBase = height * r.baseY;
        const step = 20;
        const points = [];

        for (let x = 0; x <= width + step; x += step) {
          const wave1 = Math.sin(x * r.freq + t * r.speed + r.phase) * r.amplitude;
          const wave2 = Math.cos(x * (r.freq * 1.5) - t * (r.speed * 0.7)) * (r.amplitude * 0.4);
          const y = ribbonBase + wave1 + wave2;
          points.push({ x, y });
        }

        // Draw vertical shimmering curtain bands along points
        for (let i = 0; i < points.length - 1; i++) {
          const p1 = points[i];
          const p2 = points[i + 1];

          const grad = ctx.createLinearGradient(p1.x, p1.y - r.height, p1.x, p1.y);
          grad.addColorStop(0, r.color3);
          grad.addColorStop(0.35, r.color2);
          grad.addColorStop(0.85, r.color1);
          grad.addColorStop(1, r.color3);

          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.lineTo(p2.x, p2.y - r.height);
          ctx.lineTo(p1.x, p1.y - r.height);
          ctx.closePath();
          ctx.fill();
        }
      }

      ctx.restore();

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-0"
      style={{ width: '100vw', height: '100vh', display: 'block' }}
    />
  );
}
