import React, { useState, useEffect } from 'react';
import { Target, Trophy, Star, ChevronRight } from 'lucide-react';
import { DataService } from '../services/DataService';
import type { Pillar } from '../types';
import './WeeklyGoals.css';

interface WeeklyGoalsProps {
  pillars: Pillar[];
}

const WeeklyGoals: React.FC<WeeklyGoalsProps> = ({ pillars }) => {
  const [goals, setGoals] = useState<Record<string, any>>({});
  const [showSetGoal, setShowSetGoal] = useState(false);
  const [selectedPillar, setSelectedPillar] = useState<string>('');
  const [targetScore, setTargetScore] = useState<number>(80);
  const [dailyChallenge, setDailyChallenge] = useState<any>(null);

  useEffect(() => {
    loadGoals();
    loadDailyChallenge();
  }, [pillars]);

  const loadGoals = () => {
    const goalsData: Record<string, any> = {};
    pillars.forEach(pillar => {
      const progress = DataService.checkGoalProgress(pillar.id);
      if (progress) {
        goalsData[pillar.id] = progress;
      }
    });
    setGoals(goalsData);
  };

  const loadDailyChallenge = () => {
    const challenge = DataService.generateDailyChallenge();
    setDailyChallenge(challenge);
  };

  const handleSetGoal = () => {
    if (selectedPillar && targetScore >= 50 && targetScore <= 100) {
      DataService.setWeeklyGoal(selectedPillar, targetScore);
      loadGoals();
      setShowSetGoal(false);
      setSelectedPillar('');
      setTargetScore(80);
    }
  };
  const getProgressColor = (progress: number) => {
    if (progress >= 100) return 'var(--color-success)';
    if (progress >= 70) return 'var(--color-primary)';
    if (progress >= 50) return 'var(--color-warning)';
    return 'var(--color-error)';
  };

  return (
    <div className="weekly-goals animate-slide-up">
      <div className="goals-header">
        <h3 className="goals-title">
          <Target size={20} />
          Objectifs & Défis
        </h3>
        <button 
          className="set-goal-button"
          onClick={() => setShowSetGoal(true)}
          title="Définir un nouvel objectif"
        >
          <Star size={16} />
          Nouvel objectif
        </button>
      </div>

      {/* Défi quotidien */}
      {dailyChallenge && (
        <div className="daily-challenge">
          <div className="challenge-header">
            <Trophy size={18} />
            <span>Défi du jour</span>
          </div>
          <div className="challenge-content">
            <h4>{dailyChallenge.title}</h4>
            <p>{dailyChallenge.description}</p>
          </div>
        </div>
      )}

      {/* Objectifs hebdomadaires */}
      <div className="goals-list">
        {Object.entries(goals).map(([pillarId, goal]) => {
          const pillar = pillars.find(p => p.id === pillarId);
          if (!pillar || !goal.hasGoal) return null;

          return (
            <div key={pillarId} className="goal-item">
              <div className="goal-info">
                <div className="goal-pillar">
                  <span className="pillar-icon">{pillar.icon}</span>
                  <span className="pillar-name">{pillar.name}</span>
                  {goal.achieved && <Trophy size={16} className="achievement-icon" />}
                </div>
                <div className="goal-stats">
                  <span className="goal-current">{goal.current}</span>
                  <span className="goal-separator">/</span>
                  <span className="goal-target">{goal.target}</span>
                </div>
              </div>
              <div className="goal-progress">
                <div className="progress-bar">
                  <div 
                    className="progress-fill"
                    style={{ 
                      width: `${Math.min(100, goal.progress)}%`,
                      backgroundColor: getProgressColor(goal.progress)
                    }}
                  />
                </div>
                <span className="progress-text">{goal.progress}%</span>
              </div>
            </div>
          );
        })}
      </div>

      {Object.keys(goals).filter(id => goals[id].hasGoal).length === 0 && (
        <div className="no-goals">
          <Target size={32} />
          <p>Aucun objectif défini pour cette semaine</p>
          <button 
            className="set-first-goal-button"
            onClick={() => setShowSetGoal(true)}
          >
            Créer mon premier objectif
            <ChevronRight size={16} />
          </button>
        </div>
      )}

      {/* Modal pour définir un objectif */}
      {showSetGoal && (
        <div className="goal-modal-overlay">
          <div className="goal-modal">
            <h3>Définir un objectif hebdomadaire</h3>
            
            <div className="goal-form">
              <div className="form-group">
                <label htmlFor="pillar-select">Pilier</label>
                <select 
                  id="pillar-select"
                  value={selectedPillar}
                  onChange={(e) => setSelectedPillar(e.target.value)}
                  className="pillar-select"
                >
                  <option value="">Choisir un pilier</option>
                  {pillars.map(pillar => (
                    <option key={pillar.id} value={pillar.id}>
                      {pillar.icon} {pillar.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="target-score">Objectif (50-100%)</label>
                <div className="score-input-container">
                  <input
                    id="target-score"
                    type="range"
                    min="50"
                    max="100"
                    value={targetScore}
                    onChange={(e) => setTargetScore(Number(e.target.value))}
                    className="score-slider"
                  />
                  <span className="score-display">{targetScore}%</span>
                </div>
              </div>

              <div className="modal-actions">
                <button 
                  className="cancel-button"
                  onClick={() => setShowSetGoal(false)}
                >
                  Annuler
                </button>
                <button 
                  className="confirm-button"
                  onClick={handleSetGoal}
                  disabled={!selectedPillar}
                >
                  Créer l'objectif
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WeeklyGoals;
