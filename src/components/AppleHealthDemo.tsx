import React from 'react';
import ThemeToggleAdvanced from './ThemeToggleAdvanced';
import './AppleHealthDemo.css';

const AppleHealthDemo: React.FC = () => {
  return (
    <div className="apple-health-demo">
      <div className="demo-header">
        <h1>🍎 Apple Health Style Demo</h1>
        <p>Découvrez les couleurs et gradients inspirés de l'application Santé d'iPhone</p>
        <ThemeToggleAdvanced />
      </div>

      <div className="color-palette-section">
        <h2>Palette de Couleurs Apple Health</h2>
        <div className="color-grid">
          <div className="color-card health-red">
            <div className="color-sample"></div>
            <div className="color-info">
              <h3>Rouge Santé</h3>
              <code>#FF3B30</code>
              <p>Couleur principale de l'app Santé</p>
            </div>
          </div>

          <div className="color-card activity-green">
            <div className="color-sample"></div>
            <div className="color-info">
              <h3>Vert Activité</h3>
              <code>#30D158</code>
              <p>Exercice et mouvement</p>
            </div>
          </div>

          <div className="color-card apple-blue">
            <div className="color-sample"></div>
            <div className="color-info">
              <h3>Bleu Apple</h3>
              <code>#007AFF</code>
              <p>Interface système</p>
            </div>
          </div>

          <div className="color-card mindfulness-purple">
            <div className="color-sample"></div>
            <div className="color-info">
              <h3>Violet Pleine Conscience</h3>
              <code>#BF5AF2</code>
              <p>Bien-être mental</p>
            </div>
          </div>

          <div className="color-card fitness-orange">
            <div className="color-sample"></div>
            <div className="color-info">
              <h3>Orange Forme</h3>
              <code>#FF9500</code>
              <p>Entraînements et sport</p>
            </div>
          </div>

          <div className="color-card cycle-pink">
            <div className="color-sample"></div>
            <div className="color-info">
              <h3>Rose Cycle</h3>
              <code>#FF2D92</code>
              <p>Suivi féminin</p>
            </div>
          </div>
        </div>
      </div>

      <div className="gradients-section">
        <h2>Gradients Thématiques</h2>
        <div className="gradient-grid">
          <div className="gradient-card">
            <div className="gradient-sample gradient-health"></div>
            <h3>Santé Générale</h3>
            <p>Rouge énergisant pour la vitalité</p>
          </div>

          <div className="gradient-card">
            <div className="gradient-sample gradient-activity"></div>
            <h3>Activité Physique</h3>
            <p>Vert dynamique pour le mouvement</p>
          </div>

          <div className="gradient-card">
            <div className="gradient-sample gradient-mindfulness"></div>
            <h3>Pleine Conscience</h3>
            <p>Violet apaisant pour la méditation</p>
          </div>

          <div className="gradient-card">
            <div className="gradient-sample gradient-fitness"></div>
            <h3>Entraînement</h3>
            <p>Orange motivant pour l'effort</p>
          </div>

          <div className="gradient-card">
            <div className="gradient-sample gradient-system"></div>
            <h3>Système</h3>
            <p>Bleu technologique et moderne</p>
          </div>

          <div className="gradient-card">
            <div className="gradient-sample gradient-dark"></div>
            <h3>Mode Sombre</h3>
            <p>Gris élégant pour la nuit</p>
          </div>
        </div>
      </div>

      <div className="features-section">
        <h2>Fonctionnalités du Theme Toggle</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">🎨</div>
            <h3>Thèmes Contextuels</h3>
            <p>Focus, Sport, Détente avec couleurs appropriées</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">⭐</div>
            <h3>Favoris</h3>
            <p>Sauvegardez vos thèmes préférés</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">⏱️</div>
            <h3>Historique</h3>
            <p>Accès rapide aux thèmes récents</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">⌨️</div>
            <h3>Raccourcis</h3>
            <p>Ctrl+Alt+1/2/3 pour changer rapidement</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">🎲</div>
            <h3>Aléatoire</h3>
            <p>Découvrez de nouveaux thèmes</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">🎉</div>
            <h3>Easter Egg</h3>
            <p>Konami Code pour une surprise !</p>
          </div>
        </div>
      </div>

      <div className="instructions-section">
        <h2>Mode d'Emploi</h2>
        <div className="instructions">
          <div className="instruction">
            <span className="step">1</span>
            <div>
              <h4>Cliquez sur le bouton thème</h4>
              <p>Ouvre le menu déroulant avec toutes les options</p>
            </div>
          </div>

          <div className="instruction">
            <span className="step">2</span>
            <div>
              <h4>Choisissez votre thème</h4>
              <p>Standard (Jour/Nuit/Auto) ou Contextuel (Focus/Sport/Détente)</p>
            </div>
          </div>

          <div className="instruction">
            <span className="step">3</span>
            <div>
              <h4>Marquez vos favoris</h4>
              <p>Cliquez sur l'étoile pour sauvegarder un thème</p>
            </div>
          </div>

          <div className="instruction">
            <span className="step">4</span>
            <div>
              <h4>Utilisez les raccourcis</h4>
              <p>Ctrl+Alt+1/2/3 pour les thèmes, Ctrl+Alt+R pour aléatoire</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppleHealthDemo;
