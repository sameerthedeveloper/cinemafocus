export default function manifest() {
  return {
    name: 'Cinema Focus - Premium Audio & Home Cinema Systems',
    short_name: 'Cinema Focus',
    description: 'Experience the ultimate in high-fidelity sound and dedicated home theaters.',
    start_url: '/',
    display: 'standalone',
    background_color: '#0a0a0a', // Matches dark mode theme
    theme_color: '#0a0a0a',
    icons: [
      {
        src: '/logo.svg',
        sizes: 'any',
        type: 'image/svg+xml',
      }
    ],
  };
}
