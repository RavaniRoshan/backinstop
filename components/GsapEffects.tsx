'use client';

import { useEffect } from 'react';
import gsap from 'gsap';

export function GsapEffects() {
  useEffect(() => {
    // Only run on client
    if (typeof window === 'undefined') return;

    const ctx = gsap.context(() => {
      // 1. Dither Spheres Subtle Floating Movement
      gsap.to('.gsap-floating-sphere-1', {
        y: '+=18',
        x: '-=10',
        rotation: 3,
        duration: 5,
        ease: 'sine.inOut',
        yoyo: true,
        repeat: -1,
      });

      gsap.to('.gsap-floating-sphere-2', {
        y: '-=24',
        x: '+=14',
        rotation: -4,
        duration: 6.5,
        ease: 'sine.inOut',
        yoyo: true,
        repeat: -1,
      });

      gsap.to('.gsap-floating-sphere-3', {
        y: '+=14',
        x: '+=8',
        duration: 4.5,
        ease: 'sine.inOut',
        yoyo: true,
        repeat: -1,
      });

      // 2. Hero Section Elements Staggered Entrance
      gsap.fromTo(
        '.gsap-hero-badge',
        { opacity: 0, y: -12 },
        { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out', delay: 0.1 }
      );

      gsap.fromTo(
        '.gsap-hero-title',
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', delay: 0.2 }
      );

      gsap.fromTo(
        '.gsap-hero-sub',
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 0.7, ease: 'power2.out', delay: 0.35 }
      );

      gsap.fromTo(
        '.gsap-hero-cta',
        { opacity: 0, scale: 0.95 },
        { opacity: 1, scale: 1, duration: 0.6, ease: 'back.out(1.5)', delay: 0.5, stagger: 0.1 }
      );

      // 3. Smooth Marquee Continuous Drive
      const marqueeEl = document.querySelector('.gsap-marquee-track');
      if (marqueeEl) {
        gsap.to(marqueeEl, {
          xPercent: -50,
          ease: 'none',
          duration: 30,
          repeat: -1,
        });
      }

      // 4. Subtle Micro-Hover Reaction on Retro Window Buttons
      const buttons = document.querySelectorAll('.gsap-retro-btn');
      buttons.forEach((btn) => {
        const handleMouseEnter = () => {
          gsap.to(btn, { scale: 1.02, duration: 0.15, ease: 'power1.out' });
        };
        const handleMouseLeave = () => {
          gsap.to(btn, { scale: 1.0, duration: 0.2, ease: 'power1.out' });
        };
        btn.addEventListener('mouseenter', handleMouseEnter);
        btn.addEventListener('mouseleave', handleMouseLeave);
      });
    });

    return () => ctx.revert();
  }, []);

  return null;
}
