import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Minus, Award, Zap, Clock } from 'lucide-react';
import { DataService } from '../services/DataService';
import type { Pillar } from '../types';
import './AdvancedInsights.css';

interface AdvancedInsightsProps {
  pillars: Pillar[];
}

const AdvancedInsights: React.FC<AdvancedInsightsProps> = ({ pillars }) => {
  const [insights, setInsights] = useState<any>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadInsights();
  }, [pillars]);

  const loadInsights = async () => {
    setIsLoading(true);
    
    const insights = {
      weeklyAverage: DataService.getWeeklyAverage(),
      monthlyAverage: DataService.getMonthlyAverage(),
      bestPillar: DataService.getBestPillar(),
      weakestPillar: DataService.getWeakestPillar(),
      streakData: DataService.getStreakData(),
      trends: {} as Record<string, string>
    };

    // Calculer les tendances pour chaque pilier
    for (const pillar of pillars) {
      insights.trends[pillar.id] = DataService.getPillarTrend(pillar.id, 7);
    }

    setInsights(insights);
    setIsLoading(false);
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'improving': return <TrendingUp size={16} className="trend-improving" />;
      case 'declining': return <TrendingDown size={16} className="trend-declining" />;
      default: return <Minus size={16} className="trend-stable" />;
    }
  };

  const getTrendText = (trend: string) => {
    switch (trend) {
      case 'improving': return 'En amélioration';
      case 'declining': return 'En baisse';
      default: return 'Stable';
    }
  };

  const getScoreEvolution = () => {
    const weekly = insights.weeklyAverage || 0;
    const monthly = insights.monthlyAverage || 0;
    const diff = weekly - monthly;
    
    if (Math.abs(diff) < 3) return { type: 'stable', text: 'Stable', value: 0 };
    if (diff > 0) return { type: 'improving', text: `+${diff.toFixed(0)} points`, value: diff };
    return { type: 'declining', text: `${diff.toFixed(0)} points`, value: diff };
  };

  if (isLoading) {
    return (
      <div className="advanced-insights loading">
        <div className="loading-spinner"></div>
        <p>Analyse en cours...</p>
      </div>
    );
  }

  const evolution = getScoreEvolution();

  return (
    <div className="advanced-insights animate-slide-up">
      <h3 className="insights-title">
        <Zap size={20} />
        Insights Avancés
      </h3>

      <div className="insights-grid">
        {/* Score hebdomadaire vs mensuel */}
        <div className="insight-card score-evolution">
          <div className="card-header">
            <h4>Évolution du Score</h4>
            <div className={`evolution-badge evolution-${evolution.type}`}>
              {evolution.type === 'improving' && <TrendingUp size={14} />}
              {evolution.type === 'declining' && <TrendingDown size={14} />}
              {evolution.type === 'stable' && <Minus size={14} />}
              <span>{evolution.text}</span>
            </div>
          </div>
          <div className="score-comparison">
            <div className="score-item">
              <span className="score-label">Cette semaine</span>
              <span className="score-value primary">{insights.weeklyAverage}%</span>
            </div>
            <div className="score-divider"></div>
            <div className="score-item">
              <span className="score-label">Ce mois</span>
              <span className="score-value secondary">{insights.monthlyAverage}%</span>
            </div>
          </div>
        </div>

        {/* Séries de réussite */}
        <div className="insight-card streak-card">
          <div className="card-header">
            <h4>Séries de Réussite</h4>
            <Award className="card-icon" size={18} />
          </div>
          <div className="streak-stats">
            <div className="streak-item">
              <span className="streak-label">Série actuelle</span>
              <span className="streak-value current">{insights.streakData?.currentStreak || 0}</span>
              <span className="streak-unit">jours</span>
            </div>
            <div className="streak-item">
              <span className="streak-label">Meilleure série</span>
              <span className="streak-value best">{insights.streakData?.longestStreak || 0}</span>
              <span className="streak-unit">jours</span>
            </div>
          </div>
          <p className="streak-info">
            Objectif: {insights.streakData?.targetScore || 70}% ou plus
          </p>
        </div>

        {/* Meilleur et plus faible pilier */}
        <div className="insight-card pillars-performance">
          <div className="card-header">
            <h4>Performance des Piliers</h4>
            <TrendingUp className="card-icon" size={18} />
          </div>
          <div className="performance-list">
            {insights.bestPillar && (
              <div className="performance-item best">
                <div className="performance-info">
                  <span className="performance-label">Plus fort</span>
                  <span className="performance-name">{insights.bestPillar.name}</span>
                </div>
                <span className="performance-score">{insights.bestPillar.averageScore}%</span>
              </div>
            )}
            {insights.weakestPillar && (
              <div className="performance-item weakest">
                <div className="performance-info">
                  <span className="performance-label">À améliorer</span>
                  <span className="performance-name">{insights.weakestPillar.name}</span>
                </div>
                <span className="performance-score">{insights.weakestPillar.averageScore}%</span>
              </div>
            )}
          </div>
        </div>

        {/* Tendances des piliers */}
        <div className="insight-card trends-card">
          <div className="card-header">
            <h4>Tendances (7 jours)</h4>
            <Clock className="card-icon" size={18} />
          </div>
          <div className="trends-list">
            {pillars.map(pillar => (
              <div key={pillar.id} className="trend-item">
                <div className="trend-pillar">
                  <span className="pillar-icon">{pillar.icon}</span>
                  <span className="pillar-name">{pillar.name}</span>
                </div>
                <div className="trend-status">
                  {getTrendIcon(insights.trends[pillar.id])}
                  <span className="trend-text">
                    {getTrendText(insights.trends[pillar.id])}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdvancedInsights;
