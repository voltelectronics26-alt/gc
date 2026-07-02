import React, { useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Award, RefreshCw } from 'lucide-react';
import { GameTheme, i18n, themes } from '../types';

interface WinnerModalProps {
  isOpen: boolean;
  winner: 1 | 2 | null;
  lang: string;
  theme: GameTheme;
  p1Name: string;
  p2Name: string;
  onPlayAgain: () => void;
}

interface Particle {
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
  vx: number;
  vy: number;
  rotation: number;
  rotationSpeed: number;
  gravity: number;
  opacity: number;
}

export default function WinnerModal({
  isOpen,
  winner,
  lang,
  theme,
  p1Name,
  p2Name,
  onPlayAgain,
}: WinnerModalProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!isOpen || !canvasRef.current || winner === null) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Resize canvas
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const particles: Particle[] = [];
    const colors = ['#FFC107', '#FF1744', '#00E5FF', '#00E676', '#D500F9', '#FF5722', '#76FF03', '#FFEB3B'];

    // Helper to spawn a particle
    const spawnParticle = (fromSide: 'left' | 'right') => {
      const isLeft = fromSide === 'left';
      return {
        x: isLeft ? 0 : canvas.width,
        y: canvas.height,
        width: Math.random() * 8 + 8,
        height: Math.random() * 12 + 10,
        color: colors[Math.floor(Math.random() * colors.length)],
        vx: isLeft ? (Math.random() * 14 + 12) : -(Math.random() * 14 + 12),
        vy: -(Math.random() * 20 + 20),
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() * 6 - 3) * 3,
        gravity: 0.35 + Math.random() * 0.15,
        opacity: 1,
      };
    };

    // Initial bursts
    for (let i = 0; i < 70; i++) {
      particles.push(spawnParticle('left'));
      particles.push(spawnParticle('right'));
    }

    // Dynamic stream for 180 frames (approx 3 seconds)
    let frameCount = 0;
    let animationFrameId: number;

    const update = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Add a couple of new particles per frame from each side for a continuous celebration look
      if (frameCount < 150) {
        if (frameCount % 2 === 0) {
          particles.push(spawnParticle('left'));
          particles.push(spawnParticle('right'));
        }
      }

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.vy += p.gravity;
        p.vx *= 0.975;
        p.vy *= 0.985;
        p.x += p.vx;
        p.y += p.vy;
        p.rotation += p.rotationSpeed;
        p.opacity -= 0.005;

        if (p.opacity <= 0 || p.y > canvas.height + 20) {
          particles.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.globalAlpha = p.opacity;
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.width / 2, -p.height / 2, p.width, p.height);
        ctx.restore();
      }

      frameCount++;
      animationFrameId = requestAnimationFrame(update);
    };

    update();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [isOpen, winner]);

  if (!isOpen || winner === null) return null;

  const t = i18n[lang] || i18n.en;
  const tc = themes[theme];

  const playerTitle = winner === 1 ? p1Name : p2Name;
  const rawMessage = t.winnerMsg;
  const displayMessage = rawMessage.replace('{player}', playerTitle);

  return (
    <AnimatePresence>
      <div id="winner-modal" className="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        {/* Confetti canvas */}
        <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-50 w-full h-full" />

        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ type: "spring", damping: 25, stiffness: 350 }}
          className={`game-card max-w-md w-full p-6 md:p-8 text-center rounded-2xl border relative z-10 ${tc.cardBg} ${tc.cardBorder} shadow-2xl ${tc.glowShadow || ''}`}
        >
          {/* Animated Big Trophy/Award Icon */}
          <motion.div
            initial={{ scale: 0.5, rotate: -10 }}
            animate={{ scale: [1, 1.2, 1], rotate: [0, 15, -15, 0] }}
            transition={{ duration: 1, repeat: Infinity, repeatType: "reverse", repeatDelay: 1 }}
            className={`inline-flex p-5 rounded-full bg-yellow-500/10 text-yellow-500 text-6xl mb-6 mx-auto`}
          >
            <Award className="w-16 h-16 text-yellow-500 stroke-[1.5]" />
          </motion.div>

          <h2 id="winner-text" className="text-2xl font-black mb-4 tracking-tight text-yellow-400">
            {winner === 1 ? p1Name : p2Name}
          </h2>

          <p className={`text-lg font-bold leading-relaxed mb-8 px-2 ${tc.textPrimary}`}>
            {displayMessage}
          </p>

          <button
            onClick={onPlayAgain}
            className={`w-full py-4 px-6 rounded-xl font-extrabold transition-all duration-200 flex items-center justify-center gap-2.5 shadow-lg active:scale-95 ${tc.primaryBtn}`}
            data-i18n="playAgain"
          >
            <RefreshCw className="w-5 h-5 animate-spin-slow" />
            <span>{t.playAgain}</span>
          </button>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
