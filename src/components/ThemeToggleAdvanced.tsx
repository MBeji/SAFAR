import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Sun, Moon, Monitor, Palette, Sparkles, Zap, Shuffle, History, Bookmark } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';
import type { Theme } from '../services/ThemeService';
import './ThemeToggleAdvanced.css';

interface ThemeOption {
  id: Theme | 'focus' | 'workout' | 'relax';
  label: string;
  icon: React.ReactNode;
  description: string;
  gradient: string;
  category?: 'standard' | 'contextual';
}

interface ThemeHistory {
  theme: Theme | 'focus' | 'workout' | 'relax';
  timestamp: Date;
}

const ThemeToggleAdvanced: React.FC = () => {
  const { currentTheme, setTheme } = useTheme();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);  const [recentThemes, setRecentThemes] = useState<ThemeHistory[]>([]);
  const [favoriteThemes, setFavoriteThemes] = useState<Set<string>>(new Set());
  const [konamiSequence, setKonamiSequence] = useState<string[]>([]);
  const [showEasterEgg, setShowEasterEgg] = useState(false);
  
  const dropdownRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const lastRandomRef = useRef<string>('');

  // Konami Code sequence
  const KONAMI_CODE = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'KeyB', 'KeyA'];  const themeOptions: ThemeOption[] = [
    // Standard themes - Apple Health Style
    {
      id: 'light',
      label: 'Jour',
      icon: <Sun size={16} />,
      description: 'Mode lumineux et énergisant',
      gradient: 'linear-gradient(135deg, #FF3B30 0%, #FF6B6B 50%, #FFB3B3 100%)',
      category: 'standard'
    },
    {
      id: 'dark',
      label: 'Nuit',
      icon: <Moon size={16} />,
      description: 'Mode sombre et reposant',
      gradient: 'linear-gradient(135deg, #1C1C1E 0%, #2C2C2E 50%, #3A3A3C 100%)',
      category: 'standard'
    },
    {
      id: 'auto',
      label: 'Auto',
      icon: <Monitor size={16} />,
      description: 'Adaptation automatique',
      gradient: 'linear-gradient(135deg, #007AFF 0%, #5AC8FA 50%, #64D2FF 100%)',
      category: 'standard'
    },
    // Contextual themes - Apple Health Categories
    {
      id: 'focus',
      label: 'Focus',
      icon: <Zap size={16} />,
      description: 'Concentration et productivité',
      gradient: 'linear-gradient(135deg, #30D158 0%, #32D74B 50%, #66E673 100%)',
      category: 'contextual'
    },
    {
      id: 'workout',
      label: 'Sport',
      icon: <Sparkles size={16} />,
      description: 'Activité et performance',
      gradient: 'linear-gradient(135deg, #FF9500 0%, #FF6B35 50%, #FFB366 100%)',
      category: 'contextual'
    },
    {
      id: 'relax',
      label: 'Détente',
      icon: <Palette size={16} />,
      description: 'Bien-être et relaxation',
      gradient: 'linear-gradient(135deg, #BF5AF2 0%, #DA70D6 50%, #E6B3FA 100%)',
      category: 'contextual'
    }  ];
  // Gestionnaire de changement de thème avec historique
  const handleThemeChange = useCallback((theme: Theme | 'focus' | 'workout' | 'relax') => {
    if (theme === currentTheme) return;
    
    setIsAnimating(true);
    
    // Ajouter à l'historique
    setRecentThemes(prev => {
      const newHistory = [{ theme, timestamp: new Date() }, ...prev.slice(0, 4)];
      localStorage.setItem('theme-history', JSON.stringify(newHistory));
      return newHistory;
    });
    
    // Appliquer le thème (pour les thèmes contextuels, on utilise 'auto' comme fallback)
    const actualTheme = ['light', 'dark', 'auto'].includes(theme as string) ? theme as Theme : 'auto';
    setTheme(actualTheme);
    setIsDropdownOpen(false);
    
    setTimeout(() => setIsAnimating(false), 300);
  }, [currentTheme, setTheme]);
  // Thème aléatoire
  const handleRandomTheme = useCallback(() => {
    const availableThemes = themeOptions.filter(option => option.id !== lastRandomRef.current);
    const randomTheme = availableThemes[Math.floor(Math.random() * availableThemes.length)];
    lastRandomRef.current = randomTheme.id as string;
    handleThemeChange(randomTheme.id);
  }, [handleThemeChange]);

  // Raccourcis clavier
  const handleKeyboardShortcuts = useCallback((event: KeyboardEvent) => {
    if (event.ctrlKey && event.altKey) {
      switch (event.key) {
        case '1':
          event.preventDefault();
          handleThemeChange('light');
          break;
        case '2':
          event.preventDefault();
          handleThemeChange('dark');
          break;
        case '3':
          event.preventDefault();
          handleThemeChange('auto');
          break;
        case 'r':
          event.preventDefault();
          handleRandomTheme();
          break;
      }
    }

    // Konami Code detection
    const newSequence = [...konamiSequence, event.code].slice(-KONAMI_CODE.length);
    
    if (newSequence.length === KONAMI_CODE.length && 
        newSequence.every((key, index) => key === KONAMI_CODE[index])) {
      setShowEasterEgg(true);
      setTimeout(() => setShowEasterEgg(false), 3000);
      setKonamiSequence([]);
    } else {
      setKonamiSequence(newSequence);
    }
  }, [konamiSequence, handleThemeChange, handleRandomTheme]);

  // Favoris
  const toggleFavorite = (themeId: string) => {
    setFavoriteThemes(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(themeId)) {
        newFavorites.delete(themeId);
      } else {
        newFavorites.add(themeId);
      }
      localStorage.setItem('favorite-themes', JSON.stringify([...newFavorites]));
      return newFavorites;
    });
  };

  // Charger les données sauvegardées
  useEffect(() => {
    const savedHistory = localStorage.getItem('theme-history');
    if (savedHistory) {
      setRecentThemes(JSON.parse(savedHistory));
    }
    
    const savedFavorites = localStorage.getItem('favorite-themes');
    if (savedFavorites) {
      setFavoriteThemes(new Set(JSON.parse(savedFavorites)));
    }

    document.addEventListener('keydown', handleKeyboardShortcuts);
    return () => document.removeEventListener('keydown', handleKeyboardShortcuts);
  }, [handleKeyboardShortcuts]);

  // Fermeture du dropdown
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

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
        document.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [isDropdownOpen]);

  const getCurrentThemeOption = () => {
    return themeOptions.find(option => option.id === currentTheme) || themeOptions[0];
  };

  const currentOption = getCurrentThemeOption();

  return (
    <>
      <div className="theme-toggle-advanced-container">        <button
          ref={toggleRef}
          className={`theme-toggle-advanced ${currentTheme} ${isDropdownOpen ? 'dropdown-open' : ''} ${isAnimating ? 'animating' : ''}`}
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          title={`${currentOption.label} - ${currentOption.description}`}
          aria-label={`Sélecteur de thème avancé, actuellement ${currentOption.label}`}
          aria-expanded={isDropdownOpen}
          aria-haspopup="menu"
          data-current-theme={currentTheme}
          style={{ background: currentOption.gradient }}
        >
          <span className="theme-icon" style={{ color: 'white', filter: 'drop-shadow(0 1px 2px rgba(0, 0, 0, 0.5))' }}>
            {currentOption.icon}
          </span>
          <span className="theme-label" style={{ color: 'white' }}>
            {currentOption.label}
          </span>
          <span className="dropdown-arrow" style={{ color: 'white', filter: 'drop-shadow(0 1px 2px rgba(0, 0, 0, 0.5))' }}>
            <Palette size={12} />
          </span>
          
          <div className="theme-shine"></div>
          <div className="theme-indicator"></div>
        </button>

        {/* Menu déroulant avancé */}
        <div 
          ref={dropdownRef}
          className={`theme-dropdown-advanced ${isDropdownOpen ? 'open' : ''}`}
          role="menu"
        >
          {/* Header avec actions rapides */}
          <div className="dropdown-header">
            <div className="header-title">
              <Sparkles size={14} />
              <span>Sélecteur de Thème</span>
            </div>
            <div className="header-actions">
              <button 
                className="action-btn"
                onClick={handleRandomTheme}
                title="Thème aléatoire (Ctrl+Alt+R)"
              >
                <Shuffle size={12} />
              </button>
            </div>
          </div>

          {/* Favoris */}
          {favoriteThemes.size > 0 && (
            <div className="favorites-section">
              <div className="section-title">
                <Bookmark size={12} />
                <span>Favoris</span>
              </div>
              <div className="favorites-grid">
                {themeOptions
                  .filter(option => favoriteThemes.has(option.id as string))
                  .map((option) => (
                    <button
                      key={`fav-${option.id}`}
                      className="favorite-theme"
                      onClick={() => handleThemeChange(option.id)}
                      style={{ background: option.gradient }}
                      title={option.label}
                    >
                      {option.icon}
                    </button>
                  ))}
              </div>
            </div>
          )}

          {/* Récents */}
          {recentThemes.length > 0 && (
            <div className="recent-section">
              <div className="section-title">
                <History size={12} />
                <span>Récents</span>
              </div>
              <div className="recent-list">
                {recentThemes.slice(0, 3).map((history, index) => {
                  const option = themeOptions.find(opt => opt.id === history.theme);
                  if (!option) return null;
                  return (
                    <button
                      key={`recent-${index}`}
                      className="recent-theme"
                      onClick={() => handleThemeChange(history.theme)}
                    >
                      <span className="recent-icon">{option.icon}</span>
                      <span className="recent-label">{option.label}</span>
                      <span className="recent-time">
                        {history.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Thèmes standards */}
          <div className="themes-section">
            <div className="section-title">Thèmes Standards</div>
            {themeOptions
              .filter(option => option.category === 'standard')
              .map((option) => (                <button
                  key={option.id}
                  className={`theme-option-advanced ${option.id === currentTheme ? 'active' : ''}`}
                  data-theme={option.id}
                  onClick={() => handleThemeChange(option.id)}
                  style={{ background: option.id === currentTheme ? option.gradient : undefined }}
                >
                  <span className="theme-option-icon">{option.icon}</span>
                  <div className="theme-option-content">
                    <span className="theme-option-label">{option.label}</span>
                    <span className="theme-option-description">{option.description}</span>
                  </div>
                  <div className="theme-option-actions">
                    <button
                      className={`favorite-btn ${favoriteThemes.has(option.id as string) ? 'active' : ''}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite(option.id as string);
                      }}
                      title="Ajouter aux favoris"
                    >
                      <Bookmark size={12} />
                    </button>
                  </div>
                </button>
              ))}
          </div>

          {/* Thèmes contextuels */}
          <div className="themes-section">
            <div className="section-title">Thèmes Contextuels</div>
            {themeOptions
              .filter(option => option.category === 'contextual')
              .map((option) => (                <button
                  key={option.id}
                  className={`theme-option-advanced contextual ${option.id === currentTheme ? 'active' : ''}`}
                  data-theme={option.id}
                  onClick={() => handleThemeChange(option.id)}
                  style={{ background: option.id === currentTheme ? option.gradient : undefined }}
                >
                  <span className="theme-option-icon">{option.icon}</span>
                  <div className="theme-option-content">
                    <span className="theme-option-label">{option.label}</span>
                    <span className="theme-option-description">{option.description}</span>
                  </div>
                  <div className="theme-option-actions">
                    <button
                      className={`favorite-btn ${favoriteThemes.has(option.id as string) ? 'active' : ''}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite(option.id as string);
                      }}
                      title="Ajouter aux favoris"
                    >
                      <Bookmark size={12} />
                    </button>
                  </div>
                </button>
              ))}
          </div>

          {/* Footer avec raccourcis */}
          <div className="dropdown-footer">
            <small>
              💡 <strong>Raccourcis :</strong> Ctrl+Alt+1/2/3 (thèmes), Ctrl+Alt+R (aléatoire)
            </small>
          </div>
        </div>
      </div>

      {/* Easter Egg Notification */}
      {showEasterEgg && (
        <div className="easter-egg-notification">
          🎉 Konami Code activé ! Thème secret débloqué ! 🌈
        </div>
      )}
    </>
  );
};

export default ThemeToggleAdvanced;
