import React, { useState } from 'react';
import { DataService } from '../services/DataService';
import { BookOpen, TrendingUp, Calendar, X } from 'lucide-react';
import './QuickStart.css';

interface QuickStartProps {
  onClose: () => void;
  onNavigate: (page: 'home' | 'journal' | 'stats') => void;
}

const QuickStart: React.FC<QuickStartProps> = ({ onClose, onNavigate }) => {
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      title: "Bienvenue dans votre application bien-être ! 🌟",
      description: "Suivez votre bien-être quotidien avec 6 piliers essentiels pour une vie équilibrée.",
      icon: <BookOpen className="quick-start-icon" />,
      action: null
    },
    {
      title: "Evaluez vos 6 piliers de bien-être",
      description: "Notez chaque aspect de votre journée de 0 à 100% : Alimentation, Sport, Sommeil, Stress/Équilibre, Spiritualité et Social.",
      icon: <TrendingUp className="quick-start-icon" />,
      action: () => onNavigate('home')
    },
    {
      title: "Consultez vos statistiques et progrès",
      description: "Visualisez votre évolution avec des graphiques détaillés et exportez vos rapports en PDF.",
      icon: <Calendar className="quick-start-icon" />,
      action: () => onNavigate('stats')
    }
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Dernière étape : fermer et aller à l'accueil
      onClose();
      onNavigate('home');
    }
  };

  const handleSkip = () => {
    onClose();
  };

  const handleCreateTestData = () => {
    DataService.createTestData();
    onClose();
    onNavigate('stats');
  };

  return (
    <div className="quick-start-overlay">
      <div className="quick-start-modal">
        <button className="quick-start-close" onClick={onClose}>
          <X size={20} />
        </button>
        
        <div className="quick-start-content">
          <div className="quick-start-step-indicator">
            {steps.map((_, index) => (
              <div 
                key={index}
                className={`step-dot ${index <= currentStep ? 'active' : ''}`}
              />
            ))}
          </div>

          <div className="quick-start-step">
            {steps[currentStep].icon}
            <h2>{steps[currentStep].title}</h2>
            <p>{steps[currentStep].description}</p>
          </div>

          <div className="quick-start-actions">
            {currentStep === 0 && (
              <button 
                className="quick-start-button secondary"
                onClick={handleCreateTestData}
              >
                📊 Voir avec des données d'exemple
              </button>
            )}
            
            <div className="quick-start-navigation">
              <button 
                className="quick-start-button outline"
                onClick={handleSkip}
              >
                Passer
              </button>
              <button 
                className="quick-start-button primary"
                onClick={handleNext}
              >
                {currentStep === steps.length - 1 ? 'Commencer' : 'Suivant'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickStart;
