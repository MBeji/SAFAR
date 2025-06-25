import React, { useState, useEffect } from 'react';
import { Medal, Award, Star, Zap, Target, Clock, Trophy, Crown, Calendar, TrendingUp, Users } from 'lucide-react';
import { DataService } from '../services/DataService';
import type { DailyEntry } from '../types';
import './Achievements.css';

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  condition: (data: DailyEntry[]) => boolean;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first_entry',
    name: 'Premier Pas',
    description: 'Effectuer votre première évaluation',
    icon: <Star size={20} />,
    color: '#93C5FD',
    condition: (data) => data.length >= 1,
    rarity: 'common'
  },  {
    id: 'week_streak',
    name: 'Semaine Complète',
    description: 'Maintenir un score de 70%+ pendant 7 jours',
    icon: <Zap size={20} />,
    color: '#34D399',
    condition: () => {
      const streak = DataService.getStreakData();
      return streak.currentStreak >= 7;
    },
    rarity: 'rare'
  },
  {
    id: 'perfect_score',
    name: 'Perfection',
    description: 'Atteindre un score global de 100%',
    icon: <Crown size={20} />,
    color: '#FBBF24',
    condition: (data) => data.some(entry => entry.globalScore >= 100),
    rarity: 'legendary'
  },
  {
    id: 'month_consistent',
    name: 'Régularité Mensuelle',
    description: 'Saisir vos données 30 jours consécutifs',
    icon: <Calendar size={20} />,
    color: '#C4B5FD',
    condition: (data) => {
      if (data.length < 30) return false;
      const sortedData = data.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
      let consecutive = 1;
      for (let i = 1; i < sortedData.length; i++) {
        const prevDate = new Date(sortedData[i-1].date);
        const currDate = new Date(sortedData[i].date);
        const dayDiff = (currDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24);
        if (dayDiff === 1) {
          consecutive++;
          if (consecutive >= 30) return true;
        } else {
          consecutive = 1;
        }
      }
      return false;
    },
    rarity: 'epic'
  },
  {
    id: 'balanced_life',
    name: 'Vie Équilibrée',
    description: 'Tous les piliers à 80%+ le même jour',
    icon: <Target size={20} />,
    color: '#A7F3D0',
    condition: (data) => data.some(entry => 
      entry.pillars.every(pillar => pillar.score >= 80)
    ),
    rarity: 'epic'
  },  {
    id: 'improvement_master',
    name: 'Maître de l\'Amélioration',
    description: 'Améliorer votre score de 20 points en une semaine',
    icon: <TrendingUp size={20} />,
    color: '#F472B6',
    condition: () => {
      const weekData = DataService.getLastDays(7);
      if (weekData.length < 7) return false;
      const scores = weekData.map(entry => entry.globalScore).reverse();
      const firstDay = scores[0];
      const lastDay = scores[scores.length - 1];
      return (lastDay - firstDay) >= 20;
    },
    rarity: 'rare'
  },  {
    id: 'early_bird',
    name: 'Lève-tôt',
    description: 'Score de sommeil à 90%+ pendant 5 jours',
    icon: <Clock size={20} />,
    color: '#DDD6FE',
    condition: () => {
      const recentData = DataService.getLastDays(5);
      return recentData.length >= 5 && 
        recentData.every(entry => {
          const sleepPillar = entry.pillars.find(p => p.id === 'sommeil');
          return sleepPillar && sleepPillar.score >= 90;
        });
    },
    rarity: 'rare'
  },
  {
    id: 'social_butterfly',
    name: 'Papillon Social',
    description: 'Score social à 100% pendant 3 jours',
    icon: <Users size={20} />,
    color: '#FECACA',
    condition: () => {
      const recentData = DataService.getLastDays(3);
      return recentData.length >= 3 && 
        recentData.every(entry => {
          const socialPillar = entry.pillars.find(p => p.id === 'social');
          return socialPillar && socialPillar.score >= 100;
        });
    },
    rarity: 'rare'
  }
];

const Achievements: React.FC = () => {
  const [unlockedAchievements, setUnlockedAchievements] = useState<Set<string>>(new Set());
  const [newAchievements, setNewAchievements] = useState<Achievement[]>([]);
  const [showNotification, setShowNotification] = useState(false);

  useEffect(() => {
    checkAchievements();
  }, []);

  const checkAchievements = () => {
    const data = DataService.getAllData();
    const savedAchievements = localStorage.getItem('achievements');
    const previouslyUnlocked = savedAchievements ? new Set(JSON.parse(savedAchievements)) : new Set();
    const newlyUnlocked = new Set<string>();
    const newAchievementsList: Achievement[] = [];

    ACHIEVEMENTS.forEach(achievement => {
      if (achievement.condition(data)) {
        newlyUnlocked.add(achievement.id);
        if (!previouslyUnlocked.has(achievement.id)) {
          newAchievementsList.push(achievement);
        }
      }
    });

    if (newAchievementsList.length > 0) {
      setNewAchievements(newAchievementsList);
      setShowNotification(true);
      // Auto-hide après 5 secondes
      setTimeout(() => setShowNotification(false), 5000);
    }

    setUnlockedAchievements(newlyUnlocked);
    localStorage.setItem('achievements', JSON.stringify([...newlyUnlocked]));
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return '#93C5FD';
      case 'rare': return '#34D399';
      case 'epic': return '#C084FC';
      case 'legendary': return '#FBBF24';
      default: return '#93C5FD';
    }
  };

  const getRarityText = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'Commun';
      case 'rare': return 'Rare';
      case 'epic': return 'Épique';
      case 'legendary': return 'Légendaire';
      default: return 'Commun';
    }
  };

  return (
    <div className="achievements-container">
      <div className="achievements animate-slide-up">
        <h3 className="achievements-title">
          <Trophy size={20} />
          Réalisations
          <span className="achievements-count">
            {unlockedAchievements.size}/{ACHIEVEMENTS.length}
          </span>
        </h3>

        <div className="achievements-grid">
          {ACHIEVEMENTS.map(achievement => {
            const isUnlocked = unlockedAchievements.has(achievement.id);
            return (
              <div 
                key={achievement.id} 
                className={`achievement-card ${isUnlocked ? 'unlocked' : 'locked'} rarity-${achievement.rarity}`}
              >
                <div className="achievement-icon" style={{ color: achievement.color }}>
                  {achievement.icon}
                </div>
                <div className="achievement-content">
                  <h4 className="achievement-name">{achievement.name}</h4>
                  <p className="achievement-description">{achievement.description}</p>
                  <span className="achievement-rarity" style={{ color: getRarityColor(achievement.rarity) }}>
                    {getRarityText(achievement.rarity)}
                  </span>
                </div>
                {isUnlocked && (
                  <div className="achievement-badge">
                    <Medal size={16} />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Notification de nouveaux succès */}
      {showNotification && newAchievements.length > 0 && (
        <div className="achievement-notification">
          <div className="notification-header">
            <Award size={20} />
            <span>Nouveau succès débloqué !</span>
          </div>
          {newAchievements.map(achievement => (
            <div key={achievement.id} className="notification-achievement">
              <div className="notification-icon" style={{ color: achievement.color }}>
                {achievement.icon}
              </div>
              <div className="notification-content">
                <span className="notification-name">{achievement.name}</span>
                <span className="notification-rarity" style={{ color: getRarityColor(achievement.rarity) }}>
                  {getRarityText(achievement.rarity)}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Achievements;
