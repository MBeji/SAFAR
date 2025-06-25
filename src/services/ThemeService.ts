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
    primary: '#007AFF',
    secondary: '#5AC8FA',
    background: '#F2F2F7',
    surface: 'rgba(255, 255, 255, 0.9)',
    text: '#1C1C1E',
    textSecondary: 'rgba(28, 28, 30, 0.7)',    border: 'rgba(28, 28, 30, 0.1)',
    success: '#30D158',
    warning: '#FF9500',
    error: '#FF3B30'
  }
};

export const DARK_THEME: ThemeConfig = {
  theme: 'dark',
  colors: {
    primary: '#0A84FF',
    secondary: '#64D2FF',
    background: 'linear-gradient(135deg, #000000 0%, #1C1C1E 50%, #2C2C2E 100%)',
    surface: 'rgba(255, 255, 255, 0.05)',
    text: '#F2F2F7',
    textSecondary: 'rgba(242, 242, 247, 0.7)',
    border: 'rgba(255, 255, 255, 0.1)',
    success: '#32D74B',
    warning: '#FF9F0A',
    error: '#FF453A'
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
  }  static applyTheme(theme: Theme): void {
    const config = this.getThemeConfig(theme);
    const root = document.documentElement;

    // Nettoyer les anciennes classes de thème
    root.className = root.className.replace(/theme-\w+/g, '');
    document.body.className = document.body.className.replace(/theme-\w+/g, '');

    // Ajouter la nouvelle classe de thème
    root.classList.add(`theme-${config.theme}`);
    document.body.classList.add(`theme-${config.theme}`);

    // Appliquer les variables CSS
    Object.entries(config.colors).forEach(([key, value]) => {
      root.style.setProperty(`--color-${key}`, value);
    });

    // Force ABSOLUE du style avec !important via CSS inline
    const style = document.createElement('style');
    style.id = 'theme-override-style';
    
    // Supprimer l'ancien style s'il existe
    const oldStyle = document.getElementById('theme-override-style');
    if (oldStyle) {
      oldStyle.remove();
    }

    // Créer les règles CSS avec !important
    const isLight = config.theme === 'light';
    const textColor = isLight ? '#1C1C1E' : '#F2F2F7';
    const backgroundColor = isLight ? '#F2F2F7' : '#1C1C1E';

    style.textContent = `
      /* THEME OVERRIDE - FORCE ABSOLUE */
      html.theme-${config.theme},
      body.theme-${config.theme},
      #root.theme-${config.theme},
      .theme-${config.theme},
      .theme-${config.theme} *:not(.theme-toggle-advanced):not(.theme-toggle-advanced *) {
        color: ${textColor} !important;
        background: ${backgroundColor} !important;
      }
      
      /* Exceptions pour éléments avec couleurs spécifiques */
      .theme-${config.theme} .pillar-card,
      .theme-${config.theme} .score-circle,
      .theme-${config.theme} button:not(.theme-toggle-advanced button) {
        background: var(--color-surface) !important;
      }
      
      .theme-${config.theme} .home-container {
        background: ${backgroundColor} !important;
        color: ${textColor} !important;
      }
    `;

    document.head.appendChild(style);
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
