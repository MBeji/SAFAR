import React, { useState, useEffect } from 'react';
import type { DailyEntry } from '../types';
import { DataService } from '../services/DataService';
import { Calendar, TrendingUp, Edit3, Bell } from 'lucide-react';
import ThemeToggle from './ThemeToggle';
import NotificationSettings from './NotificationSettings';
import { useNotifications } from '../hooks/useNotifications';
import './Home.css';

interface HomeProps {
  onNavigate: (page: 'home' | 'journal' | 'stats') => void;
}

const Home: React.FC<HomeProps> = ({ onNavigate }) => {
  const [todayEntry, setTodayEntry] = useState<DailyEntry | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showNotificationSettings, setShowNotificationSettings] = useState(false);
  
  const { showCongratulation, showWarning } = useNotifications();
  useEffect(() => {
    loadTodayData();
  }, []);

  useEffect(() => {
    // Déclencher les notifications basées sur les scores
    if (todayEntry) {
      const globalScore = todayEntry.globalScore;
      
      // Notification de félicitations si score élevé
      if (globalScore >= 80) {
        showCongratulation(globalScore);
      }
      
      // Notifications d'avertissement pour les piliers faibles
      todayEntry.pillars.forEach(pillar => {
        if (pillar.score < 40) {
          showWarning(pillar.name, pillar.score);
        }
      });
    }
  }, [todayEntry, showCongratulation, showWarning]);

  const loadTodayData = () => {
    setIsLoading(true);
    const entry = DataService.getTodayEntry();
    if (!entry) {
      // Créer une entrée vide pour aujourd'hui
      const emptyPillars = DataService.createEmptyPillars();
      const newEntry = DataService.saveTodayEntry(emptyPillars);
      setTodayEntry(newEntry);
    } else {
      setTodayEntry(entry);
    }
    setIsLoading(false);
  };

  const getScoreColor = (score: number): string => {
    if (score >= 80) return '#10B981'; // Vert
    if (score >= 60) return '#F59E0B'; // Orange
    if (score >= 40) return '#EF4444'; // Rouge
    return '#6B7280'; // Gris
  };

  const getScoreText = (score: number): string => {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Bien';
    if (score >= 40) return 'Moyen';
    return 'À améliorer';
  };

  if (isLoading) {
    return (
      <div className="home-container loading">
        <div className="loading-spinner"></div>
        <p>Chargement...</p>
      </div>
    );
  }

  return (
    <div className="home-container">      <header className="home-header">        <div className="header-content">
          <h1>Mon Bien-être</h1>
          <div className="header-actions">
            <button 
              className="notification-button"
              onClick={() => setShowNotificationSettings(true)}
              title="Paramètres de notifications"
            >
              <Bell size={18} />
            </button>
            <ThemeToggle />
          </div>
        </div>
        <p className="date">
          <Calendar size={18} />
          {new Date().toLocaleDateString('fr-FR', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </p>
      </header>

      <div className="global-score-card">
        <div className="score-circle">
          <span 
            className="score-number"
            style={{ color: getScoreColor(todayEntry?.globalScore || 0) }}
          >
            {todayEntry?.globalScore || 0}%
          </span>
          <span className="score-label">Score Global</span>
        </div>
        <p className="score-description">
          {getScoreText(todayEntry?.globalScore || 0)}
        </p>
      </div>

      <div className="pillars-grid">
        {todayEntry?.pillars.map((pillar) => (
          <div key={pillar.id} className="pillar-card">
            <div className="pillar-header">
              <span className="pillar-icon">{pillar.icon}</span>
              <span className="pillar-name">{pillar.name}</span>
            </div>
            <div className="pillar-score">
              <span 
                className="pillar-percentage"
                style={{ color: pillar.color }}
              >
                {pillar.score}%
              </span>
            </div>
            <div 
              className="pillar-progress-bar"
              style={{ backgroundColor: `${pillar.color}20` }}
            >
              <div 
                className="pillar-progress"
                style={{ 
                  width: `${pillar.score}%`,
                  backgroundColor: pillar.color 
                }}
              ></div>
            </div>
          </div>
        ))}
      </div>

      <div className="action-buttons">
        <button 
          className="action-button primary"
          onClick={() => onNavigate('journal')}
        >
          <Edit3 size={20} />
          Journal du Jour
        </button>
        <button 
          className="action-button secondary"
          onClick={() => onNavigate('stats')}
        >
          <TrendingUp size={20} />          Statistiques
        </button>
      </div>

      <NotificationSettings 
        isOpen={showNotificationSettings}
        onClose={() => setShowNotificationSettings(false)}
      />
    </div>
  );
};

export default Home;
