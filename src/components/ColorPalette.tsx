import React from 'react';
import './ColorPalette.css';

export const ColorPalette: React.FC = () => {
  const colors = [
    { name: 'Alimentation', color: '#6EE7B7', description: 'Vert menthe pastel' },
    { name: 'Sport', color: '#93C5FD', description: 'Bleu ciel pastel' },
    { name: 'Sommeil', color: '#C4B5FD', description: 'Violet lavande pastel' },
    { name: 'Stress', color: '#A7F3D0', description: 'Vert aqua pastel' },
    { name: 'Spiritualité', color: '#DDD6FE', description: 'Violet très doux' },
    { name: 'Social', color: '#FECACA', description: 'Rose saumon pastel' }
  ];

  const systemColors = [
    { name: 'Succès', color: '#34D399', description: 'Vert menthe doux' },
    { name: 'Attention', color: '#FBBF24', description: 'Jaune doré doux' },
    { name: 'Erreur', color: '#F87171', description: 'Rouge corail doux' },
    { name: 'Primaire', color: '#8B7CF6', description: 'Violet doux' },
    { name: 'Secondaire', color: '#A78BFA', description: 'Violet plus clair' }
  ];

  return (
    <div className="color-palette">
      <h2>🎨 Nouvelle Palette de Couleurs</h2>
      
      <div className="color-section">
        <h3>Couleurs des Piliers</h3>
        <div className="color-grid">
          {colors.map((color, index) => (
            <div key={index} className="color-card">
              <div 
                className="color-swatch" 
                style={{ backgroundColor: color.color }}
              ></div>
              <div className="color-info">
                <h4>{color.name}</h4>
                <p className="color-code">{color.color}</p>
                <p className="color-description">{color.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="color-section">
        <h3>Couleurs Système</h3>
        <div className="color-grid">
          {systemColors.map((color, index) => (
            <div key={index} className="color-card">
              <div 
                className="color-swatch" 
                style={{ backgroundColor: color.color }}
              ></div>
              <div className="color-info">
                <h4>{color.name}</h4>
                <p className="color-code">{color.color}</p>
                <p className="color-description">{color.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="harmony-info">
        <h3>✨ Principe de cette Palette</h3>
        <ul>
          <li>🌸 <strong>Couleurs pastel</strong> : Douces pour les yeux</li>
          <li>🎨 <strong>Harmonie chromatique</strong> : Basée sur des teintes complémentaires</li>
          <li>👁️ <strong>Accessibilité</strong> : Contraste suffisant pour la lisibilité</li>
          <li>🧠 <strong>Psychologie</strong> : Couleurs apaisantes et motivantes</li>
          <li>📱 <strong>Cohérence</strong> : Fonctionnent bien ensemble</li>
        </ul>
      </div>
    </div>
  );
};
