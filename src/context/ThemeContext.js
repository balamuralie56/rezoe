const shared = {
  spacing: { s: 8, m: 12, l: 16, xl: 20, xxl: 24 },
  borderRadius: { s: 8, m: 12, l: 20, round: 50 }
};

export const lightTheme = {
  ...shared,
  mode: 'light',
  colors: {
    primary: '#ea580c', // Orange 600
    background: '#ffffff',
    surface: '#f3f4f6', // Light gray for cards
    textPrimary: '#111827', // Almost black
    textSecondary: '#6b7280', // Gray
    textHighlight: '#ea580c',
    border: '#e5e7eb',
    inputBg: '#ffffff',
    icon: '#4b5563',
    danger: '#ef4444',
    success: '#22c55e',
    warning: '#f59e0b',
    overlay: 'rgba(255,255,255,0.8)',
    videoOverlay: ['transparent', 'rgba(0,0,0,0.3)', 'rgba(0,0,0,0.8)'], // Keep video overlay dark for visibility
    bottomSheet: '#ffffff'
  }
};

export const darkTheme = {
  ...shared,
  mode: 'dark',
  colors: {
    primary: '#ea580c', // Orange 600
    background: '#000000',
    surface: '#1f2937', // Dark gray for cards
    textPrimary: '#ffffff',
    textSecondary: '#9ca3af', // Light gray
    textHighlight: '#ea580c',
    border: '#374151',
    inputBg: '#222222',
    icon: '#ffffff',
    danger: '#ef4444',
    success: '#22c55e',
    warning: '#f59e0b',
    overlay: 'rgba(0,0,0,0.8)',
    videoOverlay: ['transparent', 'rgba(0,0,0,0.6)', 'rgba(0,0,0,0.95)'],
    bottomSheet: '#1f2937'
  }
};