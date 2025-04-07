// Design System for QanDu Platform
// Based on the workspace component styles

// Colors
export const colors = {
  // Core brand colors
  blue: {
    50: '#e6f0ff',
    100: '#cce0ff',
    200: '#99c1ff',
    300: '#66a3ff',
    400: '#3384ff',
    500: '#0066ff', // Primary brand blue
    600: '#0052cc',
    700: '#003d99',
    800: '#002966',
    900: '#001433',
  },
  // UI Colors
  zinc: {
    50: '#fafafa',
    100: '#f4f4f5',
    200: '#e4e4e7',
    300: '#d4d4d8',
    400: '#a1a1aa',
    500: '#71717a',
    600: '#52525b',
    700: '#3f3f46',
    800: '#27272a',
    850: '#202022', // Custom shade used in workspace
    900: '#18181b',
    950: '#09090b',
  },
  // Accent/Status colors
  green: {
    400: '#10b981',
    500: '#10b981',
  },
  pink: {
    400: '#ec4899',
    500: '#ec4899',
  },
  amber: {
    400: '#f59e0b',
    500: '#f59e0b',
  },
  indigo: {
    400: '#6366f1',
    500: '#6366f1',
  },
};

// Spacing (consistent spacing across components)
export const spacing = {
  px: '1px',
  0: '0',
  1: '0.25rem',
  2: '0.5rem',
  3: '0.75rem',
  4: '1rem',
  5: '1.25rem',
  6: '1.5rem',
  8: '2rem',
  10: '2.5rem',
  12: '3rem',
  16: '4rem',
  20: '5rem',
  24: '6rem',
  32: '8rem',
  40: '10rem',
  48: '12rem',
  56: '14rem',
  64: '16rem',
  72: '18rem',
  80: '20rem',
};

// Border Radii
export const borderRadius = {
  none: '0',
  sm: '0.125rem',
  default: '0.25rem',
  md: '0.375rem',
  lg: '0.5rem',
  xl: '0.75rem',
  '2xl': '1rem',
  '3xl': '1.5rem',
  full: '9999px',
};

// Animation
export const animation = {
  // Durations
  duration: {
    fast: '150ms',
    normal: '300ms',
    slow: '500ms',
  },
  // Easing functions
  easing: {
    easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
    easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
    easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
  },
};

// Typography
export const typography = {
  fontFamily: {
    sans: 'var(--font-sans, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif)',
  },
  fontWeight: {
    light: '300',
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },
  lineHeight: {
    none: '1',
    tight: '1.25',
    snug: '1.375',
    normal: '1.5',
    relaxed: '1.625',
    loose: '2',
  },
  fontSize: {
    xs: '0.75rem',
    sm: '0.875rem',
    base: '1rem',
    lg: '1.125rem',
    xl: '1.25rem',
    '2xl': '1.5rem',
    '3xl': '1.875rem',
    '4xl': '2.25rem',
    '5xl': '3rem',
  },
};

// Common component styles (extracted from workspace components)
export const componentStyles = {
  card: {
    base: "rounded-xl border bg-zinc-800/50 backdrop-blur-xl border-zinc-700/50 p-6",
    hover: "hover:border-zinc-600 transition-all duration-300",
    active: "border-blue-500 bg-blue-500/10",
  },
  input: {
    base: "bg-zinc-800 border-zinc-700 focus:border-blue-500 rounded-lg",
  },
  button: {
    primary: "bg-blue-600 text-white hover:bg-blue-500 rounded-lg transition-colors",
    secondary: "bg-zinc-800 text-zinc-100 hover:bg-zinc-700 border border-zinc-700 rounded-lg transition-colors",
    ghost: "text-zinc-300 hover:bg-zinc-800 rounded-lg transition-colors",
  },
  sidebar: {
    base: "bg-zinc-900 border-r border-zinc-800",
  },
  header: {
    base: "border-b border-zinc-700/50 backdrop-blur-sm bg-zinc-900/30 sticky top-0 z-10",
  },
};

// Common layout patterns
export const layouts = {
  container: "container mx-auto py-4 px-6",
  section: "mb-8",
  grid: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6",
};

// Theme mapping (for styling consistency)
export const theme = {
  background: colors.zinc[900],
  foreground: colors.zinc[50],
  primary: colors.blue[500],
  secondary: colors.zinc[700],
  accent: colors.blue[400],
  muted: colors.zinc[600],
  border: colors.zinc[700],
}; 