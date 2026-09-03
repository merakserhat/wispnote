export const theme = {
  colors: {
    text: '#1d1d1f',
    textMuted: 'rgba(29, 29, 31, 0.6)',
    textInverted: '#ffffff',
    accent: '#0071e3',
    danger: '#d70015',
    background: '#f5f5f7',
    sidebar: 'rgba(255, 255, 255, 0.72)',
    surface: 'rgba(255, 255, 255, 0.55)',
    surfaceStrong: 'rgba(255, 255, 255, 0.7)',
    surfaceMuted: 'rgba(127, 127, 127, 0.12)',
    border: 'rgba(127, 127, 127, 0.28)',
    hover: 'rgba(127, 127, 127, 0.22)',
  },
  space: [0, 2, 4, 6, 8, 12, 16, 24, 32],
  radii: { sm: 6, md: 7, lg: 8, xl: 12 },
  textVariants: {
    heading: { fontSize: '22px', fontWeight: 600, lineHeight: 1.25 },
    subheading: { fontSize: '15px', fontWeight: 500, lineHeight: 1.3 },
    label: { fontSize: '12px', fontWeight: 500, lineHeight: 1.3 },
    title: { fontSize: '13px', fontWeight: 600, lineHeight: 1.35 },
    body: { fontSize: '12px', fontWeight: 400, lineHeight: 1.4 },
    meta: { fontSize: '11px', fontWeight: 400, lineHeight: 1.35 },
    badge: { fontSize: '10px', fontWeight: 500, lineHeight: 1.2 },
  },
  fonts: {
    system: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif',
  },
} as const;

export const darkColors = {
  text: '#f5f5f7',
  textMuted: 'rgba(245, 245, 247, 0.6)',
  danger: '#ff453a',
  background: '#1c1c1e',
  sidebar: 'rgba(28, 28, 30, 0.72)',
  surface: 'rgba(255, 255, 255, 0.1)',
  surfaceStrong: 'rgba(0, 0, 0, 0.25)',
  surfaceMuted: 'rgba(255, 255, 255, 0.08)',
  border: 'rgba(255, 255, 255, 0.16)',
  hover: 'rgba(255, 255, 255, 0.1)',
} as const;
