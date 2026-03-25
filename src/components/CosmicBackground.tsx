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
    const newStars = Array.from({ length: 150 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 2 + 0.5,
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

      {/* Nebula Effects - Red, Pink, White Galaxy Colors */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        {/* Large Red Nebula - Top Left */}
        <div
          className="absolute -top-60 -left-60 w-[700px] h-[700px] rounded-full animate-nebula-pulse"
          style={{
            background: 'radial-gradient(circle, rgba(220, 38, 38, 0.25) 0%, rgba(220, 38, 38, 0.1) 40%, transparent 70%)',
            animationDuration: '8s',
          }}
        />

        {/* Pink Nebula - Bottom Right */}
        <div
          className="absolute -bottom-60 -right-60 w-[600px] h-[600px] rounded-full animate-nebula-pulse"
          style={{
            background: 'radial-gradient(circle, rgba(236, 72, 153, 0.2) 0%, rgba(236, 72, 153, 0.08) 40%, transparent 70%)',
            animationDelay: '2s',
            animationDuration: '10s',
          }}
        />

        {/* Red-Pink Nebula - Center */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full animate-nebula-pulse"
          style={{
            background: 'radial-gradient(circle, rgba(220, 38, 38, 0.15) 0%, rgba(236, 72, 153, 0.1) 50%, transparent 70%)',
            animationDelay: '4s',
            animationDuration: '12s',
          }}
        />

        {/* White Glow - Top Right */}
        <div
          className="absolute -top-40 -right-40 w-[400px] h-[400px] rounded-full animate-nebula-pulse"
          style={{
            background: 'radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.04) 50%, transparent 70%)',
            animationDelay: '1s',
            animationDuration: '15s',
          }}
        />

        {/* Pink Accent - Bottom Left */}
        <div
          className="absolute -bottom-40 -left-40 w-[350px] h-[350px] rounded-full animate-nebula-pulse"
          style={{
            background: 'radial-gradient(circle, rgba(236, 72, 153, 0.18) 0%, rgba(220, 38, 38, 0.08) 50%, transparent 70%)',
            animationDelay: '3s',
            animationDuration: '11s',
          }}
        />

        {/* Additional Red Splash - Top Center */}
        <div
          className="absolute top-20 left-1/2 -translate-x-1/2 w-[300px] h-[300px] rounded-full animate-nebula-pulse"
          style={{
            background: 'radial-gradient(circle, rgba(220, 38, 38, 0.12) 0%, transparent 65%)',
            animationDelay: '5s',
            animationDuration: '9s',
          }}
        />

        {/* Shooting Stars */}
        <div className="absolute top-20 right-1/4 animate-shooting-star opacity-60">
          <div className="w-1 h-1 bg-white rounded-full" />
        </div>
        <div className="absolute top-40 left-1/4 animate-shooting-star opacity-60" style={{ animationDelay: '3s' }}>
          <div className="w-1 h-1 bg-white rounded-full" />
        </div>
        <div className="absolute bottom-1/3 right-1/3 animate-shooting-star opacity-60" style={{ animationDelay: '6s' }}>
          <div className="w-1 h-1 bg-white rounded-full" />
        </div>
      </div>

      {/* Deep Space Overlay - Adds depth */}
      <div
        className="fixed inset-0 pointer-events-none -z-10"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 0%, rgba(0, 0, 0, 0.2) 100%)',
        }}
      />
    </>
  );
}

export default memo(CosmicBackground);
