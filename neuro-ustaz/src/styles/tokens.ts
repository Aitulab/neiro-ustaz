export const colors = {
  surface: '#f9f9ff',
  surfaceLow: '#f3f3fa',
  surfaceLowest: '#ffffff',
  surfaceContainer: '#ededf4',
  surfaceContainerHigh: '#e7e8ee',
  primary: '#4DA6FF',
  primaryDark: '#4C1D95',
  onSurface: '#1a1a2e',
  onSurfaceVariant: '#404752',
  outline: '#707783',
  outlineVariant: '#c0c7d4',
  secondaryContainer: '#d4e1f4',
  secondaryFixed: '#d7e3f6',
  tertiaryContainer: '#6d28d9',
  error: '#ba1a1a',
} as const;

export const gradients = {
  primary: 'linear-gradient(135deg, #4DA6FF, #4C1D95)',
} as const;

export const shadows = {
  card: '0 8px 48px rgba(77, 166, 255, 0.06)',
  cardHover: '0 16px 60px rgba(77, 166, 255, 0.10)',
  glass: '0 8px 32px rgba(77, 166, 255, 0.08)',
} as const;

export const radius = {
  sm: '8px',
  md: '24px',
  lg: '32px',
  full: '9999px',
} as const;

export const spacing = {
  xs: '4px',
  sm: '8px',
  md: '16px',
  lg: '24px',
  xl: '32px',
  '2xl': '48px',
  '3xl': '64px',
} as const;
