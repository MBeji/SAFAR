export type Theme = 'light' | 'dark' | 'auto';

export interface ThemeConfig {
  theme: Theme;
  colors: {
    primary: string;
    secondary: string;
    background: string;
    surface: string;
    text: string;
    textSecondary: string;
    border: string;
    success: string;
    warning: string;
    error: string;
  };
}

const THEME_STORAGE_KEY = 'wellbeing-theme';

export const LIGHT_THEME: ThemeConfig = {
  theme: 'light',
  colors: {
    primary: '#667eea',
    secondary: '#764ba2',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    surface: 'rgba(255, 255, 255, 0.1)',
    text: '#ffffff',
    textSecondary: 'rgba(255, 255, 255, 0.8)',
    border: 'rgba(255, 255, 255, 0.2)',
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444'
  }
};

export const DARK_THEME: ThemeConfig = {
  theme: 'dark',
  colors: {
    primary: '#4c1d95',
    secondary: '#581c87',
    background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)',
    surface: 'rgba(255, 255, 255, 0.05)',
    text: '#e5e7eb',
    textSecondary: 'rgba(229, 231, 235, 0.7)',
    border: 'rgba(255, 255, 255, 0.1)',
    success: '#059669',
    warning: '#d97706',
    error: '#dc2626'
  }
};

export class ThemeService {
  static getCurrentTheme(): Theme {
    try {
      const saved = localStorage.getItem(THEME_STORAGE_KEY);
      return (saved as Theme) || 'auto';
    } catch {
      return 'auto';
    }
  }

  static setTheme(theme: Theme): void {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
    this.applyTheme(theme);
  }

  static getThemeConfig(theme: Theme): ThemeConfig {
    if (theme === 'auto') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      return prefersDark ? DARK_THEME : LIGHT_THEME;
    }
    return theme === 'dark' ? DARK_THEME : LIGHT_THEME;
  }

  static applyTheme(theme: Theme): void {
    const config = this.getThemeConfig(theme);
    const root = document.documentElement;

    // Appliquer les variables CSS
    Object.entries(config.colors).forEach(([key, value]) => {
      root.style.setProperty(`--color-${key}`, value);
    });

    // Ajouter une classe pour les styles spécifiques
    root.className = root.className.replace(/theme-\w+/g, '');
    root.classList.add(`theme-${config.theme}`);
  }

  static initTheme(): void {
    const theme = this.getCurrentTheme();
    this.applyTheme(theme);

    // Écouter les changements de préférence système
    if (theme === 'auto') {
      window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
        this.applyTheme('auto');
      });
    }
  }
}
