// Design tokens exported from the Figma Dev Mode design library.
// These values are used to align spacing, typography, colors, and UI states with the Figma UI library.

export const designTokens = {
  colors: {
    background: '#f8fafc',
    surface: '#ffffff',
    surfaceMuted: '#f1f5f9',
    textPrimary: '#0f172a',
    textSecondary: '#475569',
    textMuted: '#64748b',
    accent: '#2563eb',
    accentHover: '#1d4ed8',
    border: '#e2e8f0',
    borderStrong: '#cbd5e1',
    hoverBackground: 'rgba(37, 99, 235, 0.06)',
    focusRing: 'rgba(37, 99, 235, 0.18)',
    shadow: '0 24px 60px rgba(15, 23, 42, 0.08)',
    surfaceShadow: '0 12px 30px rgba(15, 23, 42, 0.08)',
    backgroundGradient: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
  },
  spacing: {
    xs: '0.5rem',
    sm: '0.75rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    '2xl': '2.5rem',
    '3xl': '3rem',
    '4xl': '4rem',
  },
  sizing: {
    bannerHeight: '12rem',
    logoHeight: '4rem',
  },
  radius: {
    sm: '0.5rem',
    md: '0.75rem',
    lg: '1rem',
    xl: '1.25rem',
    '2xl': '1.5rem',
    '3xl': '1.75rem',
  },
  typography: {
    fontFamily: 'var(--font-geist-sans)',
    fontWeight: {
      regular: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
    },
    size: {
      base: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      '2xl': '1.5rem',
      '3xl': '2.25rem',
      '4xl': '3rem',
      '5xl': '3.75rem',
    },
    lineHeight: {
      body: 1.75,
      heading: 1.1,
    },
    letterSpacing: {
      normal: '0em',
      tight: '-0.02em',
    },
  },
  states: {
    transition: 'all 180ms ease-in-out',
    focusRing: '0 0 0 4px rgba(37, 99, 235, 0.18)',
  },
};
