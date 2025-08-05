import React, { useState, useEffect } from 'react';
import type { DailyEntry } from '../types';
import { DataService } from '../services/DataService';
import { Calendar, TrendingUp, Edit3, Bell, HelpCircle } from 'lucide-react';
import ThemeToggleAdvanced from './ThemeToggleAdvanced';
import NotificationSettings from './NotificationSettings';
import DailyTips from './DailyTips';
import WeeklyGoals from './WeeklyGoals';
import AdvancedInsights from './AdvancedInsights';
import { CircularProgress, PillarsRadar } from './CircularProgress';
import { useNotifications } from '../hooks/useNotifications';
import './Home.css';

interface HomeProps {
  onNavigate: (page: 'home' | 'journal' | 'stats') => void;
  onOpenQuickStart?: () => void;
}

const Home: React.FC<HomeProps> = ({ onNavigate, onOpenQuickStart }) => {
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
    }    setIsLoading(false);
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
    <div className="home-container">      <header className="home-header animate-slide-up">        <div className="header-content">
          <h1>Mon Bien-être</h1>          <div className="header-actions">
            <button 
              className="notification-button hover-glow"
              onClick={onOpenQuickStart}
              title="Guide de démarrage"
            >
              <HelpCircle size={18} />
            </button>
            <button 
              className="notification-button hover-glow"
              onClick={() => setShowNotificationSettings(true)}
              title="Paramètres de notifications"
            >
              <Bell size={18} />
            </button>
            <ThemeToggleAdvanced />
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
      </header>      <div className="global-score-card animate-scale hover-lift">
        <div className="score-circle">
          <CircularProgress 
            score={todayEntry?.globalScore || 0}
            size={100}
            strokeWidth={8}
            animationDuration={2000}
          />
          <span className="score-label">Global</span>
        </div>
        <div className="score-info">
          <h3 className="score-title">Score de Bien-être</h3>
          <p className="score-subtitle">
            {getScoreText(todayEntry?.globalScore || 0)}
          </p>
          <p className="score-description">
            Évaluation basée sur {todayEntry?.pillars.length || 6} piliers de santé
          </p>
        </div>
      </div>      <div className="pillars-grid animate-slide-left">
        {todayEntry?.pillars.map((pillar, index) => (
          <div 
            key={pillar.id} 
            className="pillar-card hover-lift"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
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
          </div>        ))}
      </div>      {/* Radar des piliers */}
      {todayEntry && (
        <PillarsRadar 
          pillars={todayEntry.pillars.map(p => ({
            name: p.name,
            score: p.score,
            color: p.color
          }))}
        />
      )}      {/* Conseils quotidiens */}
      {todayEntry && (
        <DailyTips 
          pillars={todayEntry.pillars}
          globalScore={todayEntry.globalScore}
        />
      )}

      {/* Objectifs hebdomadaires et défis */}
      {todayEntry && (
        <WeeklyGoals 
          pillars={todayEntry.pillars}
        />
      )}

      {/* Insights avancés */}
      {todayEntry && (
        <AdvancedInsights 
          pillars={todayEntry.pillars}
        />
      )}

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
