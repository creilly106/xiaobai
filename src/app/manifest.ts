import type { MetadataRoute } from 'next';

/**
 * Makes Xiaobai installable as an app: iPhone "Add to Home Screen" (which
 * also uses app/apple-icon.png), Chrome / Edge "Install".
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: '小白 Xiaobai',
    short_name: 'Xiaobai',
    description: 'Spaced-repetition, scenario and grammar practice for learning Chinese.',
    start_url: '/',
    display: 'standalone',
    background_color: '#0f172a',
    theme_color: '#0f172a',
    icons: [
      { src: '/icon.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'any' },
      { src: '/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
      { src: '/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
    ],
  };
}
