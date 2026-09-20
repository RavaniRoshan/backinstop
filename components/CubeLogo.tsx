'use client';

import React from 'react';

interface CubeLogoProps {
  className?: string;
  size?: number;
  strokeColor?: string;
  strokeWidth?: number;
}

export function CubeLogo({
  className = '',
  size = 28,
  strokeColor = 'currentColor',
  strokeWidth = 2,
}: CubeLogoProps) {
  // Precision isometric double-cube line mark from TypeSafe AI identity
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Outer isometric cube */}
      <polygon
        points="50,6 90,28 90,72 50,94 10,72 10,28"
        stroke={strokeColor}
        strokeWidth={strokeWidth * 1.6}
        strokeLinejoin="round"
      />
      {/* Outer isometric inner axes */}
      <line x1="50" y1="6" x2="50" y2="50" stroke={strokeColor} strokeWidth={strokeWidth * 1.5} />
      <line x1="10" y1="28" x2="50" y2="50" stroke={strokeColor} strokeWidth={strokeWidth * 1.5} />
      <line x1="90" y1="28" x2="50" y2="50" stroke={strokeColor} strokeWidth={strokeWidth * 1.5} />
      <line x1="50" y1="50" x2="50" y2="94" stroke={strokeColor} strokeWidth={strokeWidth * 1.5} />

      {/* Nested inner inverted cube */}
      <polygon
        points="50,26 72,38 72,62 50,74 28,62 28,38"
        stroke={strokeColor}
        strokeWidth={strokeWidth * 1.2}
        strokeLinejoin="round"
      />
      <line x1="50" y1="26" x2="50" y2="50" stroke={strokeColor} strokeWidth={strokeWidth * 1.2} />
      <line x1="28" y1="38" x2="50" y2="50" stroke={strokeColor} strokeWidth={strokeWidth * 1.2} />
      <line x1="72" y1="38" x2="50" y2="50" stroke={strokeColor} strokeWidth={strokeWidth * 1.2} />
      <line x1="50" y1="50" x2="50" y2="74" stroke={strokeColor} strokeWidth={strokeWidth * 1.2} />
    </svg>
  );
}
