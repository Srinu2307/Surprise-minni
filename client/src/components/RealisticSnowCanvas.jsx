import React, { useEffect, useRef } from 'react';

export default function RealisticSnowCanvas({ intensity = 1.0, mouseReact = true }) {
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

    // Mouse tracking for wind interaction
    let mouse = { x: -1000, y: -1000, vx: 0, vy: 0, lastX: 0, lastY: 0 };
    const handleMouseMove = (e) => {
      if (!mouseReact) return;
      mouse.vx = (e.clientX - mouse.lastX) * 0.1;
      mouse.vy = (e.clientY - mouse.lastY) * 0.1;
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      mouse.lastX = e.clientX;
      mouse.lastY = e.clientY;
    };
    window.addEventListener('mousemove', handleMouseMove);

    // Snowflake particle count based on screen size
    const flakeCount = Math.min(220, Math.floor((width * height) / 8000) * intensity);
    const flakes = [];

    // Helper to generate a flake
    const createFlake = (resetY = false) => {
      // 3 layers: 0: bg (tiny, slow, sharp), 1: mid (detailed crystal), 2: fg (large, soft blur)
      const layer = Math.random() < 0.6 ? 0 : Math.random() < 0.85 ? 1 : 2;
      let radius, speedY, speedX, opacity, swayAmp, swaySpeed;

      if (layer === 0) {
        radius = 1 + Math.random() * 1.5;
        speedY = 0.5 + Math.random() * 0.9;
        speedX = (Math.random() - 0.5) * 0.4;
        opacity = 0.25 + Math.random() * 0.45;
        swayAmp = 0.5 + Math.random() * 1.0;
        swaySpeed = 0.01 + Math.random() * 0.02;
      } else if (layer === 1) {
        radius = 2.5 + Math.random() * 2.5;
        speedY = 1.2 + Math.random() * 1.4;
        speedX = (Math.random() - 0.5) * 0.6;
        opacity = 0.6 + Math.random() * 0.35;
        swayAmp = 1.2 + Math.random() * 2.2;
        swaySpeed = 0.02 + Math.random() * 0.03;
      } else {
        radius = 5.0 + Math.random() * 4.5;
        speedY = 2.0 + Math.random() * 2.2;
        speedX = (Math.random() - 0.5) * 1.0;
        opacity = 0.2 + Math.random() * 0.35; // Soft focus in foreground
        swayAmp = 2.5 + Math.random() * 3.5;
        swaySpeed = 0.03 + Math.random() * 0.04;
      }

      return {
        x: Math.random() * width,
        y: resetY ? -20 : Math.random() * height,
        layer,
        radius,
        speedY,
        speedX,
        opacity,
        swayAmp,
        swaySpeed,
        angle: Math.random() * Math.PI * 2,
        rotation: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.03,
        twinkle: Math.random() * Math.PI * 2,
        twinkleSpeed: 0.03 + Math.random() * 0.05,
        isCrystal: layer === 1 && Math.random() < 0.35
      };
    };

    for (let i = 0; i < flakeCount; i++) {
      flakes.push(createFlake(false));
    }

    // Draw crystalline 6-point snowflake
    const drawCrystalFlake = (x, y, r, rotation, alpha) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(rotation);
      ctx.strokeStyle = `rgba(220, 245, 255, ${alpha})`;
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      for (let arm = 0; arm < 6; arm++) {
        ctx.moveTo(0, 0);
        ctx.lineTo(0, -r);
        // Small branch off each arm
        ctx.moveTo(0, -r * 0.6);
        ctx.lineTo(-r * 0.3, -r * 0.85);
        ctx.moveTo(0, -r * 0.6);
        ctx.lineTo(r * 0.3, -r * 0.85);
        ctx.rotate(Math.PI / 3);
      }
      ctx.stroke();

      // Center sparkle dot
      ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
      ctx.beginPath();
      ctx.arc(0, 0, r * 0.2, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    };

    let globalWind = 0.2;
    let time = 0;

    const render = () => {
      time += 0.016;
      ctx.clearRect(0, 0, width, height);

      // Global breeze undulating
      globalWind = Math.sin(time * 0.5) * 0.5 + 0.2;

      // Decay mouse velocity
      mouse.vx *= 0.92;
      mouse.vy *= 0.92;

      for (let i = 0; i < flakes.length; i++) {
        const f = flakes[i];
        f.angle += f.swaySpeed;
        f.rotation += f.rotSpeed;
        f.twinkle += f.twinkleSpeed;

        // Sway motion
        const sway = Math.sin(f.angle) * f.swayAmp;
        f.x += f.speedX + globalWind + sway;
        f.y += f.speedY;

        // Mouse disturbance
        const dx = f.x - mouse.x;
        const dy = f.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 140) {
          const force = (1 - dist / 140) * 3;
          f.x += (dx / dist) * force + mouse.vx * 0.4;
          f.y += (dy / dist) * force + mouse.vy * 0.4;
        }

        // Reset if offscreen
        if (f.y > height + 20) {
          flakes[i] = createFlake(true);
        }
        if (f.x > width + 20) f.x = -20;
        if (f.x < -20) f.x = width + 20;

        // Dynamic twinkle alpha
        const currentAlpha = Math.min(1, Math.max(0.1, f.opacity + Math.sin(f.twinkle) * 0.15));

        if (f.isCrystal) {
          drawCrystalFlake(f.x, f.y, f.radius * 1.8, f.rotation, currentAlpha);
        } else if (f.layer === 2) {
          // Foreground soft bokeh snow
          const grad = ctx.createRadialGradient(f.x, f.y, 0, f.x, f.y, f.radius);
          grad.addColorStop(0, `rgba(240, 252, 255, ${currentAlpha * 0.8})`);
          grad.addColorStop(0.5, `rgba(210, 240, 255, ${currentAlpha * 0.4})`);
          grad.addColorStop(1, 'rgba(200, 230, 255, 0)');
          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.arc(f.x, f.y, f.radius, 0, Math.PI * 2);
          ctx.fill();
        } else {
          // Background or mid circular snow
          ctx.fillStyle = `rgba(245, 252, 255, ${currentAlpha})`;
          ctx.beginPath();
          ctx.arc(f.x, f.y, f.radius, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [intensity, mouseReact]);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-0"
      style={{ width: '100vw', height: '100vh', display: 'block' }}
    />
  );
}
