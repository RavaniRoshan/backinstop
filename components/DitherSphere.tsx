'use client';

import React, { useEffect, useRef } from 'react';

interface DitherSphereProps {
  size?: number;
  className?: string;
  dotColor?: string;
}

export function DitherSphere({
  size = 280,
  className = '',
  dotColor,
}: DitherSphereProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = size;
    canvas.height = size;

    const radius = size / 2 - 2;
    const cx = size / 2;
    const cy = size / 2;

    const lx = -0.45;
    const ly = -0.45;
    const lz = 0.75;
    const lMag = Math.sqrt(lx * lx + ly * ly + lz * lz);
    const nlx = lx / lMag;
    const nly = ly / lMag;
    const nlz = lz / lMag;

    const step = 6;

    ctx.clearRect(0, 0, size, size);

    // Compute stroke & fill color from parent or css variable
    const computedColor =
      dotColor ||
      getComputedStyle(canvas).getPropertyValue('--foreground').trim() ||
      '#38312E';

    // Draw halftone dots across the sphere
    for (let y = 0; y < size; y += step) {
      for (let x = 0; x < size; x += step) {
        const dx = (x - cx) / radius;
        const dy = (y - cy) / radius;
        const distSq = dx * dx + dy * dy;

        if (distSq <= 1.0) {
          const dz = Math.sqrt(Math.max(0, 1.0 - distSq));
          const diffuse = dx * nlx + dy * nly + dz * nlz;
          const brightness = Math.max(0, Math.min(1, (diffuse + 0.35) * 0.9));
          const dotRadius = (1 - brightness) * (step * 0.72);

          if (dotRadius > 0.4) {
            ctx.beginPath();
            ctx.arc(x, y, dotRadius, 0, Math.PI * 2);
            ctx.fillStyle = computedColor;
            ctx.fill();
          }
        }
      }
    }

    // Outer circle border
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.strokeStyle = computedColor;
    ctx.lineWidth = 1.2;
    ctx.stroke();
  }, [size, dotColor]);

  return (
    <canvas
      ref={canvasRef}
      className={`select-none pointer-events-none ${className}`}
      style={{ width: size, height: size }}
    />
  );
}
