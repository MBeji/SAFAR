import React from 'react';
import ThemeToggle from './ThemeToggle';
import './ThemeToggleDemo.css';

const ThemeToggleDemo: React.FC = () => {
  return (
    <div className="theme-toggle-demo">
      <div className="demo-container">
        <h2>Démo du ThemeToggle Modernisé</h2>
        
        <div className="demo-section">
          <h3>🎨 Design Interactif</h3>
          <p>Cliquez sur le bouton pour découvrir le menu déroulant avec les différents thèmes disponibles.</p>
          
          <div className="toggle-showcase">
            <ThemeToggle />
          </div>
        </div>

        <div className="demo-section">
          <h3>✨ Fonctionnalités</h3>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">🎯</div>
              <h4>Menu Déroulant</h4>
              <p>Interface intuitive avec descriptions des thèmes</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">⚡</div>
              <h4>Animations Fluides</h4>
              <p>Transitions smooth et effets visuels modernes</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">🎨</div>
              <h4>Gradients Dynamiques</h4>
              <p>Chaque thème avec son propre style visuel</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">♿</div>
              <h4>Accessibilité</h4>
              <p>Navigation clavier et support screen reader</p>
            </div>
          </div>
        </div>

        <div className="demo-section">
          <h3>🔧 Instructions</h3>
          <div className="instructions">
            <div className="instruction-item">
              <span className="instruction-number">1</span>
              <span>Cliquez sur le bouton ThemeToggle ci-dessus</span>
            </div>
            <div className="instruction-item">
              <span className="instruction-number">2</span>
              <span>Explorez les différents thèmes dans le menu déroulant</span>
            </div>
            <div className="instruction-item">
              <span className="instruction-number">3</span>
              <span>Observez les animations et effets visuels</span>
            </div>
            <div className="instruction-item">
              <span className="instruction-number">4</span>
              <span>Testez la navigation avec Tab et Échap</span>
            </div>
          </div>
        </div>

        <div className="demo-section">
          <h3>📱 Test Responsive</h3>
          <p>Redimensionnez votre fenêtre pour voir l'adaptation mobile du composant.</p>
          
          <div className="responsive-preview">
            <div className="device-frame mobile">
              <div className="device-content">
                <ThemeToggle />
              </div>
              <span className="device-label">Mobile</span>
            </div>
            
            <div className="device-frame tablet">
              <div className="device-content">
                <ThemeToggle />
              </div>
              <span className="device-label">Tablet</span>
            </div>
            
            <div className="device-frame desktop">
              <div className="device-content">
                <ThemeToggle />
              </div>
              <span className="device-label">Desktop</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThemeToggleDemo;
