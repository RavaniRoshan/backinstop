'use client';

import React, { useEffect, useRef } from 'react';

export function DitherCloudCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let time = 0;

    // Bayer 4x4 dither matrix
    const bayer4x4 = [
      [0, 8, 2, 10],
      [12, 4, 14, 6],
      [3, 11, 1, 9],
      [15, 7, 13, 5],
    ];

    // Colors matching the warm parchment + terracotta & dusty slate theme
    // Sky base: dusty slate / soft steel oklch(0.7864 0.0449 251.5844) => rgb(168, 194, 209)
    // Cloud / wave: deep wine / terracotta oklch(0.2799 0.0930 22.4270) => rgb(98, 42, 44)
    const skyR = 174, skyG = 196, skyB = 210;
    const cloudR = 106, cloudG = 46, cloudB = 48;

    // Render at pixelScale 3 for authentic retro dither aesthetic
    const pixelScale = 3;
    let width = 0;
    let height = 0;

    const resize = () => {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      width = Math.max(1, Math.floor(rect.width / pixelScale));
      height = Math.max(1, Math.floor(rect.height / pixelScale));
      canvas.width = width;
      canvas.height = height;
    };

    resize();
    window.addEventListener('resize', resize);

    const noise = (x: number, y: number, t: number) => {
      const s1 = Math.sin(x * 0.02 + t * 0.4) * Math.cos(y * 0.025 + t * 0.3);
      const s2 = Math.sin(x * 0.045 - t * 0.35 + y * 0.035);
      const s3 = Math.cos(x * 0.08 + y * 0.07 - t * 0.5) * 0.5;
      const s4 = Math.sin((x + y) * 0.015 + t * 0.2) * 0.8;
      return (s1 + s2 + s3 + s4) / 2.8;
    };

    const render = () => {
      time += 0.012;
      const imgData = ctx.createImageData(width, height);
      const data = imgData.data;

      for (let y = 0; y < height; y++) {
        const yNorm = y / height;
        const verticalBias = Math.sin(yNorm * Math.PI) * 0.4 + (0.35 - yNorm * 0.3);

        for (let x = 0; x < width; x++) {
          const n = noise(x, y, time) + verticalBias;
          const val = Math.min(1, Math.max(0, (n + 0.5) * 0.8));

          const bayerThreshold = bayer4x4[y % 4][x % 4] / 16;
          const isCloud = val > bayerThreshold;

          const idx = (y * width + x) * 4;
          if (isCloud) {
            data[idx] = cloudR;
            data[idx + 1] = cloudG;
            data[idx + 2] = cloudB;
            data[idx + 3] = 255;
          } else {
            data[idx] = skyR;
            data[idx + 1] = skyG;
            data[idx + 2] = skyB;
            data[idx + 3] = 255;
          }
        }
      }

      ctx.putImageData(imgData, 0, 0);
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <div className="relative w-full h-[52vh] min-h-[380px] max-h-[560px] overflow-hidden select-none">
      <canvas
        ref={canvasRef}
        className="w-full h-full object-cover"
        style={{ imageRendering: 'pixelated' }}
      />
      {/* Smooth bottom fade gradient to theme background */}
      <div className="absolute inset-x-0 bottom-0 h-36 bg-gradient-to-b from-transparent via-background/70 to-background pointer-events-none" />
      {/* Subtle top edge vignette */}
      <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-black/15 to-transparent pointer-events-none" />
    </div>
  );
}
