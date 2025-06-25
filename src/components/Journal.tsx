import React, { useState, useEffect } from 'react';
import type { Pillar } from '../types';
import { DataService } from '../services/DataService';
import { ArrowLeft, Save, Check } from 'lucide-react';
import './Journal.css';

interface JournalProps {
  onNavigate: (page: 'home' | 'journal' | 'stats') => void;
  onOpenQuickStart?: () => void;
}

const Journal: React.FC<JournalProps> = ({ onNavigate }) => {
  const [pillars, setPillars] = useState<Pillar[]>([]);
  const [savedMessage, setSavedMessage] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadTodayData();
  }, []);

  const loadTodayData = () => {
    setIsLoading(true);
    const todayEntry = DataService.getTodayEntry();
    if (todayEntry) {
      setPillars(todayEntry.pillars);
    } else {
      setPillars(DataService.createEmptyPillars());
    }
    setIsLoading(false);
  };

  const updateQuestionValue = (pillarId: string, questionId: string, value: number) => {
    setPillars(prevPillars => 
      prevPillars.map(pillar => 
        pillar.id === pillarId 
          ? {
              ...pillar,
              questions: pillar.questions.map(question =>
                question.id === questionId 
                  ? { ...question, value }
                  : question
              )
            }
          : pillar
      )
    );
  };

  const saveData = () => {
    try {
      DataService.saveTodayEntry(pillars);
      setSavedMessage(true);
      setTimeout(() => setSavedMessage(false), 2000);
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
    }
  };

  const calculatePillarScore = (pillar: Pillar): number => {
    if (pillar.questions.length === 0) return 0;
    const total = pillar.questions.reduce((sum, q) => sum + q.value, 0);
    return Math.round(total / pillar.questions.length);
  };

  const getSliderColor = (value: number): string => {
    if (value >= 80) return '#10B981';
    if (value >= 60) return '#F59E0B';
    if (value >= 40) return '#EF4444';
    return '#6B7280';
  };

  if (isLoading) {
    return (
      <div className="journal-container loading">
        <div className="loading-spinner"></div>
        <p>Chargement...</p>
      </div>
    );
  }

  return (
    <div className="journal-container">
      <header className="journal-header">
        <button 
          className="back-button"
          onClick={() => onNavigate('home')}
        >
          <ArrowLeft size={20} />
        </button>
        <h1>Journal du Jour</h1>
        <button 
          className="save-button"
          onClick={saveData}
        >
          {savedMessage ? <Check size={20} /> : <Save size={20} />}
        </button>
      </header>

      {savedMessage && (
        <div className="save-message">
          <Check size={16} />
          Données sauvegardées !
        </div>
      )}

      <div className="pillars-list">
        {pillars.map((pillar) => (
          <div key={pillar.id} className="pillar-section">
            <div className="pillar-section-header">
              <div className="pillar-info">
                <span className="pillar-icon">{pillar.icon}</span>
                <h2 className="pillar-title">{pillar.name}</h2>
              </div>
              <div className="pillar-score-badge">
                <span 
                  className="pillar-score-text"
                  style={{ color: pillar.color }}
                >
                  {calculatePillarScore(pillar)}%
                </span>
              </div>
            </div>

            <div className="questions-list">
              {pillar.questions.map((question) => (
                <div key={question.id} className="question-item">
                  <label className="question-label">
                    {question.text}
                  </label>
                  
                  <div className="slider-container">
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={question.value}
                      onChange={(e) => updateQuestionValue(pillar.id, question.id, Number(e.target.value))}
                      className="question-slider"
                      style={{
                        background: `linear-gradient(to right, ${getSliderColor(question.value)} 0%, ${getSliderColor(question.value)} ${question.value}%, #e5e7eb ${question.value}%, #e5e7eb 100%)`
                      }}
                    />
                    <div className="slider-value">
                      <span 
                        className="value-text"
                        style={{ color: getSliderColor(question.value) }}
                      >
                        {question.value}%
                      </span>
                    </div>
                  </div>

                  <div className="slider-labels">
                    <span className="slider-label-min">Pas du tout</span>
                    <span className="slider-label-max">Parfaitement</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="journal-footer">
        <button 
          className="save-and-go-home-button"
          onClick={() => {
            saveData();
            setTimeout(() => onNavigate('home'), 500);
          }}
        >
          <Save size={16} />
          Sauvegarder et Retourner
        </button>
      </div>
    </div>
  );
};

export default Journal;
