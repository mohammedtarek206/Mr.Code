import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Mr Code',
    short_name: 'Mr Code',
    description: 'Empowering youth through certified training in programming, cybersecurity, and AI',
    start_url: '/',
    display: 'standalone',
    background_color: '#0A0F1C',
    theme_color: '#4F46E5',
    orientation: 'portrait',
    icons: [
      {
        src: '/icon?size=192',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icon?size=512',
        sizes: '512x512',
        type: 'image/png',
      },
      {
        src: '/icon?size=192',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/icon?size=512',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
  };
}
