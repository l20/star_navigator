import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export default function WarpTransition() {
  const [stars, setStars] = useState<{ id: number; x: number; y: number; delay: number; duration: number }[]>([]);

  useEffect(() => {
    // Generate star streaks
    const newStars = Array.from({ length: 50 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100, // %
      y: Math.random() * 100, // %
      delay: Math.random() * 0.5,
      duration: 0.5 + Math.random() * 0.5
    }));
    setStars(newStars);
  }, []);

  return (
    <div className="absolute inset-0 z-[100] pointer-events-none overflow-hidden flex items-center justify-center">
      {/* Flash Overlay */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 1, 1, 0] }}
        transition={{ duration: 2, times: [0, 0.1, 0.8, 1] }}
        className="absolute inset-0 bg-white z-20 mix-blend-overlay"
      />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 1, 0] }}
        transition={{ duration: 2.5, ease: "easeInOut" }}
        className="absolute inset-0 bg-cyan-950 z-10"
      >
        {/* Radial Blur / Tunnel Effect */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#000_100%)] opacity-50" />

        {/* Star Streaks */}
        <div className="absolute inset-0 perspective-[1000px] transform-style-3d">
          {stars.map(star => (
            <motion.div
              key={star.id}
              initial={{
                opacity: 0,
                scale: 0.1,
                x: `${star.x}vw`,
                y: `${star.y}vh`,
                z: 0
              }}
              animate={{
                opacity: [0, 1, 0],
                scale: [0.1, 5], // Stretch
                z: [0, 1000] // Move towards camera
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: star.delay,
                ease: "linear"
              }}
              className="absolute w-1 h-32 bg-cyan-200 rounded-full origin-center blur-[1px]"
              style={{
                boxShadow: '0 0 10px cyan'
              }}
            />
          ))}
        </div>

        {/* Center Converge Info */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: [0.8, 1.2, 3], opacity: [0, 1, 0] }}
          transition={{ duration: 1.5, delay: 0.2 }}
          className="absolute inset-0 flex items-center justify-center"
        >
          <div className="text-4xl md:text-6xl font-black italic text-white tracking-widest uppercase outline-text drop-shadow-[0_0_20px_cyan]">
            成功飞跃...
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
