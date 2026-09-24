import type { MetadataRoute } from 'next';

/** Makes Xiaobai installable as an app (Chrome / Edge: "Install" in the address bar). */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: '小白 Xiaobai',
    short_name: 'Xiaobai',
    description: 'Spaced-repetition, scenario and grammar practice for learning Chinese.',
    start_url: '/',
    display: 'standalone',
    background_color: '#0f172a',
    theme_color: '#0f172a',
    icons: [{ src: '/icon.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'any' }],
  };
}
