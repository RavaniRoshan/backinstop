'use client';

import React, { useEffect, useRef } from 'react';

interface WireframeCubeProps {
  color?: string;
}

export function WireframeCube({ color }: WireframeCubeProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let angleX = 0.5;
    let angleY = 0.3;
    let angleZ = 0.1;

    const resize = () => {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
    };

    resize();
    window.addEventListener('resize', resize);

    // Base cube vertices
    const baseVertices = [
      [-1, -1, -1],
      [1, -1, -1],
      [1, 1, -1],
      [-1, 1, -1],
      [-1, -1, 1],
      [1, -1, 1],
      [1, 1, 1],
      [-1, 1, 1],
    ];

    const edges = [
      [0, 1], [1, 2], [2, 3], [3, 0], // back
      [4, 5], [5, 6], [6, 7], [7, 4], // front
      [0, 4], [1, 5], [2, 6], [3, 7], // connectors
    ];

    const extraEdges = [
      [0, 6], [1, 7], [2, 4], [3, 5]
    ];

    const project = (
      x: number,
      y: number,
      z: number,
      w: number,
      h: number,
      scale: number
    ) => {
      let y1 = y * Math.cos(angleX) - z * Math.sin(angleX);
      let z1 = y * Math.sin(angleX) + z * Math.cos(angleX);

      let x2 = x * Math.cos(angleY) + z1 * Math.sin(angleY);
      let z2 = -x * Math.sin(angleY) + z1 * Math.cos(angleY);

      let x3 = x2 * Math.cos(angleZ) - y1 * Math.sin(angleZ);
      let y3 = x2 * Math.sin(angleZ) + y1 * Math.cos(angleZ);

      const distance = 4.2;
      const fov = scale / (distance + z2);

      return {
        px: w / 2 + x3 * fov,
        py: h / 2 + y3 * fov,
        depth: z2,
      };
    };

    const draw = () => {
      const w = canvas.getBoundingClientRect().width;
      const h = canvas.getBoundingClientRect().height;

      ctx.clearRect(0, 0, w, h);

      angleX += 0.005;
      angleY += 0.007;
      angleZ += 0.003;

      const cubeScales = [
        { scale: Math.min(w, h) * 0.75, dashed: false, alpha: 0.5, width: 1.2 },
        { scale: Math.min(w, h) * 0.42, dashed: true, alpha: 0.8, width: 1.0 },
      ];

      cubeScales.forEach(({ scale, dashed, alpha, width: strokeW }) => {
        ctx.save();
        ctx.strokeStyle = color || `rgba(254, 254, 254, ${alpha})`;
        ctx.lineWidth = strokeW;
        if (dashed) {
          ctx.setLineDash([4, 4]);
        } else {
          ctx.setLineDash([]);
        }

        const pts = baseVertices.map(([x, y, z]) => project(x, y, z, w, h, scale));

        edges.forEach(([i1, i2]) => {
          ctx.beginPath();
          ctx.moveTo(pts[i1].px, pts[i1].py);
          ctx.lineTo(pts[i2].px, pts[i2].py);
          ctx.stroke();
        });

        if (dashed) {
          ctx.setLineDash([2, 4]);
          extraEdges.forEach(([i1, i2]) => {
            ctx.beginPath();
            ctx.moveTo(pts[i1].px, pts[i1].py);
            ctx.lineTo(pts[i2].px, pts[i2].py);
            ctx.stroke();
          });
        }

        ctx.fillStyle = color || `rgba(254, 254, 254, ${alpha * 1.2})`;
        pts.forEach((pt) => {
          ctx.fillRect(pt.px - 1.5, pt.py - 1.5, 3, 3);
        });

        ctx.restore();
      });

      animId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, [color]);

  return (
    <div className="relative w-full h-[320px] md:h-[420px] flex items-center justify-center pointer-events-none">
      <canvas ref={canvasRef} className="w-full h-full" />
    </div>
  );
}
