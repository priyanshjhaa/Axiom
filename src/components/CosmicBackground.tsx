'use client';

import { useEffect, useState, memo } from 'react';

interface Star {
  id: number;
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
}

function CosmicBackground() {
  const [stars, setStars] = useState<Star[]>([]);

  useEffect(() => {
    // Generate random stars
    const newStars = Array.from({ length: 100 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 2 + 1,
      duration: Math.random() * 3 + 2,
      delay: Math.random() * 2,
    }));
    setStars(newStars);
  }, []);

  return (
    <>
      {/* Animated Stars */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        {stars.map((star) => (
          <div
            key={star.id}
            className="absolute rounded-full bg-white animate-twinkle"
            style={{
              left: `${star.x}%`,
              top: `${star.y}%`,
              width: `${star.size}px`,
              height: `${star.size}px`,
              animationDuration: `${star.duration}s`,
              animationDelay: `${star.delay}s`,
            }}
          />
        ))}
      </div>

      {/* Nebula Effects */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        {/* Purple Nebula - Top Left */}
        <div
          className="absolute -top-40 -left-40 w-96 h-96 rounded-full animate-nebula-pulse"
          style={{
            background: 'radial-gradient(circle, rgba(147, 51, 234, 0.15) 0%, transparent 70%)',
          }}
        />

        {/* Blue Nebula - Bottom Right */}
        <div
          className="absolute -bottom-40 -right-40 w-96 h-96 rounded-full animate-nebula-pulse"
          style={{
            background: 'radial-gradient(circle, rgba(59, 130, 246, 0.15) 0%, transparent 70%)',
            animationDelay: '1s',
          }}
        />

        {/* Pink Nebula - Top Right */}
        <div
          className="absolute -top-40 -right-40 w-80 h-80 rounded-full animate-nebula-pulse"
          style={{
            background: 'radial-gradient(circle, rgba(236, 72, 153, 0.1) 0%, transparent 70%)',
            animationDelay: '2s',
          }}
        />

        {/* Shooting Stars */}
        <div className="absolute top-20 right-1/4 animate-shooting-star">
          <div className="w-1 h-1 bg-white rounded-full" />
        </div>
        <div className="absolute top-40 left-1/4 animate-shooting-star" style={{ animationDelay: '3s' }}>
          <div className="w-1 h-1 bg-white rounded-full" />
        </div>
      </div>

      {/* Vignette Effect for Focus */}
      <div
        className="fixed inset-0 pointer-events-none -z-10"
        style={{
          background: 'radial-gradient(circle at center, transparent 0%, rgba(0, 0, 0, 0.3) 100%)',
        }}
      />
    </>
  );
}

export default memo(CosmicBackground);
