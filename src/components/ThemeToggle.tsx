import React from 'react';
import { Sun, Moon, Monitor } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';
import type { Theme } from '../services/ThemeService';
import './ThemeToggle.css';

const ThemeToggle: React.FC = () => {
  const { currentTheme, toggleTheme } = useTheme();

  const getIcon = (theme: Theme) => {
    switch (theme) {
      case 'light':
        return <Sun size={18} />;
      case 'dark':
        return <Moon size={18} />;
      case 'auto':
        return <Monitor size={18} />;
    }
  };

  const getLabel = (theme: Theme) => {
    switch (theme) {
      case 'light':
        return 'Clair';
      case 'dark':
        return 'Sombre';
      case 'auto':
        return 'Auto';
    }
  };

  return (
    <button
      className="theme-toggle"
      onClick={toggleTheme}
      title={`Mode ${getLabel(currentTheme)} - Cliquer pour changer`}
      aria-label={`Changer le thème, actuellement en mode ${getLabel(currentTheme)}`}
    >
      <span className="theme-icon">
        {getIcon(currentTheme)}
      </span>
      <span className="theme-label">
        {getLabel(currentTheme)}
      </span>
    </button>
  );
};

export default ThemeToggle;
