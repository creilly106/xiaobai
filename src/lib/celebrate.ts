'use client';

import confetti from 'canvas-confetti';

export type CelebrationIntensity = 'small' | 'medium' | 'big';

export function celebrate(intensity: CelebrationIntensity = 'medium'): void {
  if (typeof window === 'undefined') return;
  const counts: Record<CelebrationIntensity, number> = {
    small: 30,
    medium: 80,
    big: 160,
  };
  confetti({
    particleCount: counts[intensity],
    spread: 80,
    startVelocity: 32,
    origin: { y: 0.65 },
    disableForReducedMotion: true,
  });
  if (intensity === 'big') {
    setTimeout(() => {
      confetti({
        particleCount: 60,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.7 },
        disableForReducedMotion: true,
      });
      confetti({
        particleCount: 60,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.7 },
        disableForReducedMotion: true,
      });
    }, 200);
  }
}
