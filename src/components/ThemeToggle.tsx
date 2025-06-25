import React, { useState, useRef, useEffect } from 'react';
import { Sun, Moon, Monitor, Palette, Sparkles, Zap } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';
import type { Theme } from '../services/ThemeService';
import './ThemeToggle.css';

interface ThemeOption {
  id: Theme;
  label: string;
  icon: React.ReactNode;
  description: string;
  gradient: string;
}

const ThemeToggle: React.FC = () => {
  const { currentTheme, setTheme } = useTheme();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  const themeOptions: ThemeOption[] = [
    {
      id: 'light',
      label: 'Clair',
      icon: <Sun size={16} />,
      description: 'Mode jour lumineux',
      gradient: 'linear-gradient(135deg, #FEF3C7, #FCD34D)'
    },
    {
      id: 'dark',
      label: 'Sombre',
      icon: <Moon size={16} />,
      description: 'Mode nuit apaisant',
      gradient: 'linear-gradient(135deg, #1F2937, #374151)'
    },
    {
      id: 'auto',
      label: 'Auto',
      icon: <Monitor size={16} />,
      description: 'Adapte selon l\'heure',
      gradient: 'linear-gradient(135deg, #6366F1, #8B5CF6)'
    }
  ];

  const getCurrentThemeOption = () => {
    return themeOptions.find(option => option.id === currentTheme) || themeOptions[0];
  };

  const handleThemeChange = (theme: Theme) => {
    if (theme === currentTheme) return;
    
    setIsAnimating(true);
    setTheme(theme);
    setIsDropdownOpen(false);
    
    setTimeout(() => setIsAnimating(false), 300);
  };

  const handleToggleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsDropdownOpen(!isDropdownOpen);
  };

  // Fermer le dropdown en cliquant à l'extérieur
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        toggleRef.current &&
        !toggleRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Gestion des touches du clavier
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [isDropdownOpen]);

  const currentOption = getCurrentThemeOption();

  return (
    <div className="theme-toggle-container">
      <button
        ref={toggleRef}
        className={`theme-toggle ${currentTheme} ${isDropdownOpen ? 'dropdown-open' : ''} ${isAnimating ? 'animating' : ''}`}
        onClick={handleToggleClick}
        title={`${currentOption.label} - ${currentOption.description}`}
        aria-label={`Sélecteur de thème, actuellement ${currentOption.label}. Cliquer pour ouvrir les options`}
        aria-expanded={isDropdownOpen}
        aria-haspopup="menu"
        style={{ background: currentOption.gradient }}
      >
        <span className="theme-icon">
          {currentOption.icon}
        </span>
        <span className="theme-label">
          {currentOption.label}
        </span>
        <span className="dropdown-arrow">
          <Palette size={12} />
        </span>
        
        {/* Effet de brillance animé */}
        <div className="theme-shine"></div>
        
        {/* Indicateur de thème actif */}
        <div className="theme-indicator"></div>
      </button>

      {/* Menu déroulant */}
      <div 
        ref={dropdownRef}
        className={`theme-dropdown ${isDropdownOpen ? 'open' : ''}`}
        role="menu"
        aria-label="Options de thème"
      >
        <div className="dropdown-header">
          <Sparkles size={14} />
          <span>Choisir un thème</span>
        </div>
        
        {themeOptions.map((option) => (
          <button
            key={option.id}
            className={`theme-option ${option.id === currentTheme ? 'active' : ''}`}
            onClick={() => handleThemeChange(option.id)}
            role="menuitem"
            style={{ background: option.id === currentTheme ? option.gradient : undefined }}
          >
            <span className="theme-option-icon">
              {option.icon}
            </span>
            <div className="theme-option-content">
              <span className="theme-option-label">{option.label}</span>
              <span className="theme-option-description">{option.description}</span>
            </div>
            {option.id === currentTheme && (
              <span className="active-indicator">
                <Zap size={12} />
              </span>
            )}
          </button>
        ))}
        
        <div className="dropdown-footer">
          <small>Le thème s'applique automatiquement</small>
        </div>
      </div>
    </div>
  );
};

export default ThemeToggle;
