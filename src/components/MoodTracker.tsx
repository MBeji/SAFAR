import React, { useState, useEffect } from 'react';
import { Heart, Zap, Cloud, Sun } from 'lucide-react';
import './MoodTracker.css';

interface MoodEntry {
  date: string;
  mood: number; // 1-5
  emotions: string[];
  note?: string;
  energy: number; // 1-5
  stress: number; // 1-5
  timestamp: number;
}

interface MoodTrackerProps {
  onMoodUpdate?: (mood: MoodEntry) => void;
}

const MoodTracker: React.FC<MoodTrackerProps> = ({ onMoodUpdate }) => {
  const [currentMood, setCurrentMood] = useState<number>(3);
  const [selectedEmotions, setSelectedEmotions] = useState<string[]>([]);
  const [energy, setEnergy] = useState<number>(3);
  const [stress, setStress] = useState<number>(3);
  const [note, setNote] = useState<string>('');
  const [recentMoods, setRecentMoods] = useState<MoodEntry[]>([]);

  const moodEmojis = [
    { value: 1, emoji: '😢', label: 'Très difficile', color: '#F87171' },
    { value: 2, emoji: '😕', label: 'Difficile', color: '#FBBF24' },
    { value: 3, emoji: '😐', label: 'Neutre', color: '#93C5FD' },
    { value: 4, emoji: '😊', label: 'Bien', color: '#34D399' },
    { value: 5, emoji: '😄', label: 'Excellent', color: '#10B981' }
  ];

  const emotionOptions = [
    { id: 'happy', label: 'Joyeux', emoji: '😊', color: '#FBBF24' },
    { id: 'excited', label: 'Excité', emoji: '🤩', color: '#F472B6' },
    { id: 'calm', label: 'Calme', emoji: '😌', color: '#34D399' },
    { id: 'anxious', label: 'Anxieux', emoji: '😰', color: '#F87171' },
    { id: 'tired', label: 'Fatigué', emoji: '😴', color: '#C4B5FD' },
    { id: 'motivated', label: 'Motivé', emoji: '💪', color: '#10B981' },
    { id: 'sad', label: 'Triste', emoji: '😢', color: '#93C5FD' },
    { id: 'grateful', label: 'Reconnaissant', emoji: '🙏', color: '#DDD6FE' },
    { id: 'stressed', label: 'Stressé', emoji: '😤', color: '#FCA5A5' },
    { id: 'peaceful', label: 'Paisible', emoji: '🕊️', color: '#A7F3D0' }
  ];

  useEffect(() => {
    loadRecentMoods();
  }, []);

  const loadRecentMoods = () => {
    const saved = localStorage.getItem('mood-tracking');
    if (saved) {
      setRecentMoods(JSON.parse(saved));
    }
  };

  const handleEmotionToggle = (emotionId: string) => {
    setSelectedEmotions(prev => 
      prev.includes(emotionId) 
        ? prev.filter(id => id !== emotionId)
        : [...prev, emotionId]
    );
  };

  const saveMood = () => {
    const today = new Date().toISOString().split('T')[0];
    const moodEntry: MoodEntry = {
      date: today,
      mood: currentMood,
      emotions: selectedEmotions,
      note: note.trim(),
      energy,
      stress,
      timestamp: Date.now()
    };

    const updated = [...recentMoods.filter(m => m.date !== today), moodEntry];
    setRecentMoods(updated);
    localStorage.setItem('mood-tracking', JSON.stringify(updated));
    
    if (onMoodUpdate) {
      onMoodUpdate(moodEntry);
    }

    // Reset form
    setNote('');
    setSelectedEmotions([]);
  };

  const getMoodTrend = (): 'improving' | 'declining' | 'stable' => {
    if (recentMoods.length < 3) return 'stable';
    
    const recent = recentMoods.slice(-3).map(m => m.mood);
    const avg1 = recent[0];
    const avg2 = (recent[1] + recent[2]) / 2;
    
    if (avg2 > avg1 + 0.5) return 'improving';
    if (avg2 < avg1 - 0.5) return 'declining';
    return 'stable';
  };

  const getEnergyIcon = (level: number) => {
    if (level <= 2) return <Cloud size={16} />;
    if (level >= 4) return <Zap size={16} />;
    return <Sun size={16} />;
  };

  const currentMoodData = moodEmojis.find(m => m.value === currentMood);
  const trend = getMoodTrend();

  return (
    <div className="mood-tracker animate-slide-up">
      <div className="mood-header">
        <h3 className="mood-title">
          <Heart size={20} />
          État Émotionnel
        </h3>
        {recentMoods.length > 0 && (
          <div className={`mood-trend trend-${trend}`}>
            {trend === 'improving' && '📈'}
            {trend === 'declining' && '📉'}
            {trend === 'stable' && '➡️'}
            <span>{trend === 'improving' ? 'En amélioration' : trend === 'declining' ? 'En baisse' : 'Stable'}</span>
          </div>
        )}
      </div>

      {/* Sélection d'humeur */}
      <div className="mood-selection">
        <h4>Comment vous sentez-vous aujourd'hui ?</h4>
        <div className="mood-options">
          {moodEmojis.map(mood => (
            <button
              key={mood.value}
              className={`mood-option ${currentMood === mood.value ? 'selected' : ''}`}
              onClick={() => setCurrentMood(mood.value)}
              style={{ '--mood-color': mood.color } as React.CSSProperties}
            >
              <span className="mood-emoji">{mood.emoji}</span>
              <span className="mood-label">{mood.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Métriques secondaires */}
      <div className="mood-metrics">
        <div className="metric-item">
          <label>Énergie {getEnergyIcon(energy)}</label>
          <input
            type="range"
            min="1"
            max="5"
            value={energy}
            onChange={(e) => setEnergy(Number(e.target.value))}
            className="metric-slider energy"
          />
          <span className="metric-value">{energy}/5</span>
        </div>
        
        <div className="metric-item">
          <label>Stress 😤</label>
          <input
            type="range"
            min="1"
            max="5"
            value={stress}
            onChange={(e) => setStress(Number(e.target.value))}
            className="metric-slider stress"
          />
          <span className="metric-value">{stress}/5</span>
        </div>
      </div>

      {/* Sélection d'émotions */}
      <div className="emotions-selection">
        <h4>Quelles émotions ressentez-vous ?</h4>
        <div className="emotions-grid">
          {emotionOptions.map(emotion => (
            <button
              key={emotion.id}
              className={`emotion-chip ${selectedEmotions.includes(emotion.id) ? 'selected' : ''}`}
              onClick={() => handleEmotionToggle(emotion.id)}
              style={{ '--emotion-color': emotion.color } as React.CSSProperties}
            >
              <span className="emotion-emoji">{emotion.emoji}</span>
              <span className="emotion-label">{emotion.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Note optionnelle */}
      <div className="mood-note">
        <label htmlFor="mood-note">Note personnelle (optionnel)</label>
        <textarea
          id="mood-note"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Décrivez votre journée, vos pensées..."
          className="note-textarea"
          rows={3}
        />
      </div>

      {/* Résumé et sauvegarde */}
      <div className="mood-summary">
        <div className="summary-display">
          <div className="summary-mood">
            <span className="summary-emoji">{currentMoodData?.emoji}</span>
            <span className="summary-text">{currentMoodData?.label}</span>
          </div>
          {selectedEmotions.length > 0 && (
            <div className="summary-emotions">
              {selectedEmotions.map(emotionId => {
                const emotion = emotionOptions.find(e => e.id === emotionId);
                return emotion ? (
                  <span key={emotionId} className="summary-emotion">
                    {emotion.emoji}
                  </span>
                ) : null;
              })}
            </div>
          )}
        </div>
        
        <button className="save-mood-button" onClick={saveMood}>
          <Heart size={16} />
          Enregistrer
        </button>
      </div>

      {/* Historique récent */}
      {recentMoods.length > 0 && (
        <div className="mood-history">
          <h4>Derniers jours</h4>
          <div className="history-timeline">
            {recentMoods.slice(-7).reverse().map(mood => (
              <div key={mood.date} className="history-item">
                <div className="history-date">
                  {new Date(mood.date).toLocaleDateString('fr-FR', { 
                    day: 'numeric', 
                    month: 'short' 
                  })}
                </div>
                <div className="history-mood">
                  {moodEmojis.find(m => m.value === mood.mood)?.emoji}
                </div>
                {mood.emotions.length > 0 && (
                  <div className="history-emotions">
                    {mood.emotions.slice(0, 3).map(emotionId => {
                      const emotion = emotionOptions.find(e => e.id === emotionId);
                      return emotion ? (
                        <span key={emotionId} className="history-emotion">
                          {emotion.emoji}
                        </span>
                      ) : null;
                    })}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MoodTracker;
