import React, { useState, useEffect } from 'react';
import type { DailyEntry } from '../types';
import { DataService } from '../services/DataService';
import { ArrowLeft, TrendingUp, Calendar, BarChart3 } from 'lucide-react';
import { ExportButton } from './ExportButton';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  BarChart,
  Bar
} from 'recharts';
import './Stats.css';

interface StatsProps {
  onNavigate: (page: 'home' | 'journal' | 'stats' | 'test') => void;
}

const Stats: React.FC<StatsProps> = ({ onNavigate }) => {
  const [data, setData] = useState<DailyEntry[]>([]);
  const [viewMode, setViewMode] = useState<'week' | 'month'>('week');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [viewMode]);

  const loadData = () => {
    setIsLoading(true);
    const days = viewMode === 'week' ? 7 : 30;
    const entries = DataService.getLastDays(days);
    setData(entries.reverse()); // Plus ancien au plus récent pour les graphiques
    setIsLoading(false);
  };

  const getChartData = () => {
    return data.map(entry => ({
      date: new Date(entry.date).toLocaleDateString('fr-FR', { 
        weekday: 'short',
        day: 'numeric',
        month: 'short'
      }),
      score: entry.globalScore,
      ...entry.pillars.reduce((acc, pillar) => ({
        ...acc,
        [pillar.name]: pillar.score
      }), {})
    }));
  };

  const getRadarData = () => {
    if (data.length === 0) return [];
    
    // Calculer la moyenne de chaque pilier
    const pillarAverages: { [key: string]: number } = {};
    
    data.forEach(entry => {
      entry.pillars.forEach(pillar => {
        if (!pillarAverages[pillar.name]) {
          pillarAverages[pillar.name] = 0;
        }
        pillarAverages[pillar.name] += pillar.score;
      });
    });

    return Object.entries(pillarAverages).map(([name, total]) => ({
      pillar: name,
      score: Math.round(total / data.length),
      fullMark: 100
    }));
  };

  const getAverageScore = () => {
    if (data.length === 0) return 0;
    const total = data.reduce((sum, entry) => sum + entry.globalScore, 0);
    return Math.round(total / data.length);
  };

  const getBestDay = () => {
    if (data.length === 0) return null;
    return data.reduce((best, current) => 
      current.globalScore > best.globalScore ? current : best
    );
  };

  const getWorstDay = () => {
    if (data.length === 0) return null;
    return data.reduce((worst, current) => 
      current.globalScore < worst.globalScore ? current : worst
    );
  };

  if (isLoading) {
    return (
      <div className="stats-container loading">
        <div className="loading-spinner"></div>
        <p>Chargement des statistiques...</p>
      </div>
    );
  }

  const chartData = getChartData();
  const radarData = getRadarData();
  const averageScore = getAverageScore();
  const bestDay = getBestDay();
  const worstDay = getWorstDay();

  return (
    <div className="stats-container">      <header className="stats-header">
        <button 
          className="back-button"
          onClick={() => onNavigate('home')}
        >
          <ArrowLeft size={20} />
        </button>
        <h1>Statistiques</h1>
        <div className="header-actions">
          <ExportButton className="export-btn" />
          <div className="view-toggle">
            <button 
              className={`toggle-button ${viewMode === 'week' ? 'active' : ''}`}
              onClick={() => setViewMode('week')}
            >
              7J
            </button>
            <button 
              className={`toggle-button ${viewMode === 'month' ? 'active' : ''}`}
              onClick={() => setViewMode('month')}
            >
              30J
            </button>
          </div>
        </div>
      </header>

      {data.length === 0 ? (
        <div className="no-data">
          <BarChart3 size={64} color="#9CA3AF" />
          <h3>Aucune donnée disponible</h3>
          <p>Commencez à remplir votre journal quotidien pour voir vos statistiques.</p>
        </div>
      ) : (
        <div className="stats-content">
          {/* Résumé */}
          <div className="summary-cards">
            <div className="summary-card">
              <TrendingUp size={24} />
              <div>
                <span className="summary-value">{averageScore}%</span>
                <span className="summary-label">Moyenne</span>
              </div>
            </div>
            
            {bestDay && (
              <div className="summary-card">
                <Calendar size={24} />
                <div>
                  <span className="summary-value">{bestDay.globalScore}%</span>
                  <span className="summary-label">Meilleur jour</span>
                </div>
              </div>
            )}
            
            {worstDay && (
              <div className="summary-card">
                <BarChart3 size={24} />
                <div>
                  <span className="summary-value">{worstDay.globalScore}%</span>
                  <span className="summary-label">À améliorer</span>
                </div>
              </div>
            )}
          </div>

          {/* Graphique de tendance */}
          <div className="chart-section">
            <h3>Évolution du Score Global</h3>
            <div className="chart-container">
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />
                  <XAxis 
                    dataKey="date" 
                    tick={{ fill: 'white', fontSize: 12 }}
                    axisLine={{ stroke: '#ffffff40' }}
                  />
                  <YAxis 
                    domain={[0, 100]}
                    tick={{ fill: 'white', fontSize: 12 }}
                    axisLine={{ stroke: '#ffffff40' }}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(0,0,0,0.8)', 
                      border: 'none',
                      borderRadius: '8px',
                      color: 'white'
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="score" 
                    stroke="#10B981" 
                    strokeWidth={3}
                    dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, stroke: '#10B981', strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Radar des piliers */}
          <div className="chart-section">
            <h3>Répartition par Pilier</h3>
            <div className="chart-container">
              <ResponsiveContainer width="100%" height={250}>
                <RadarChart data={radarData}>
                  <PolarGrid stroke="#ffffff40" />
                  <PolarAngleAxis 
                    dataKey="pillar" 
                    tick={{ fill: 'white', fontSize: 10 }}
                  />
                  <PolarRadiusAxis 
                    angle={0}
                    domain={[0, 100]}
                    tick={{ fill: 'white', fontSize: 10 }}
                  />
                  <Radar 
                    name="Score" 
                    dataKey="score" 
                    stroke="#3B82F6" 
                    fill="#3B82F6" 
                    fillOpacity={0.3}
                    strokeWidth={2}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Graphique en barres des piliers */}
          <div className="chart-section">
            <h3>Moyenne par Pilier ({viewMode === 'week' ? '7 jours' : '30 jours'})</h3>
            <div className="chart-container">
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={radarData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />
                  <XAxis 
                    dataKey="pillar" 
                    tick={{ fill: 'white', fontSize: 10 }}
                    axisLine={{ stroke: '#ffffff40' }}
                  />
                  <YAxis 
                    domain={[0, 100]}
                    tick={{ fill: 'white', fontSize: 12 }}
                    axisLine={{ stroke: '#ffffff40' }}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(0,0,0,0.8)', 
                      border: 'none',
                      borderRadius: '8px',
                      color: 'white'
                    }}
                  />
                  <Bar 
                    dataKey="score" 
                    fill="#8B5CF6"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Stats;
