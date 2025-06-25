import { useState, useEffect } from 'react';
import { ThemeService, type Theme, type ThemeConfig } from '../services/ThemeService';

export const useTheme = () => {
  const [currentTheme, setCurrentTheme] = useState<Theme>(ThemeService.getCurrentTheme());
  const [themeConfig, setThemeConfig] = useState<ThemeConfig>(
    ThemeService.getThemeConfig(currentTheme)
  );

  useEffect(() => {
    // Initialiser le thème au montage
    ThemeService.initTheme();
    
    // Écouter les changements de préférence système
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      if (currentTheme === 'auto') {
        setThemeConfig(ThemeService.getThemeConfig('auto'));
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [currentTheme]);

  const toggleTheme = () => {
    const themes: Theme[] = ['light', 'dark', 'auto'];
    const currentIndex = themes.indexOf(currentTheme);
    const nextTheme = themes[(currentIndex + 1) % themes.length];
    
    setCurrentTheme(nextTheme);
    ThemeService.setTheme(nextTheme);
    setThemeConfig(ThemeService.getThemeConfig(nextTheme));
  };

  const setTheme = (theme: Theme) => {
    setCurrentTheme(theme);
    ThemeService.setTheme(theme);
    setThemeConfig(ThemeService.getThemeConfig(theme));
  };

  return {
    currentTheme,
    themeConfig,
    toggleTheme,
    setTheme,
    isDark: themeConfig.theme === 'dark'
  };
};
