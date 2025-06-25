import React from 'react';
import ReactDOM from 'react-dom/client';
import ThemeToggle from './components/ThemeToggle';
import { ThemeService } from './services/ThemeService';
import './index.css';

// Initialiser le thème
ThemeService.initTheme();

// Page de test simple pour le ThemeToggle
const TestApp: React.FC = () => {
  return (
    <div style={{
      minHeight: '100vh',
      padding: '2rem',
      background: 'linear-gradient(135deg, #E0E7FF, #FEF3E2, #ECFDF5)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '2rem'
    }}>
      <h1 style={{ 
        color: 'var(--color-text, #1F2937)',
        textAlign: 'center',
        fontSize: '2.5rem',
        fontWeight: '700',
        background: 'linear-gradient(135deg, #6366F1, #8B5CF6, #EC4899)',
        backgroundClip: 'text',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent'
      }}>
        🎨 Test du ThemeToggle Modernisé
      </h1>
      
      <div style={{
        background: 'var(--color-surface, rgba(255, 255, 255, 0.8))',
        padding: '3rem',
        borderRadius: '24px',
        backdropFilter: 'blur(20px)',
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.1)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '2rem'
      }}>
        <p style={{ 
          color: 'var(--color-text-secondary, #6B7280)',
          textAlign: 'center',
          fontSize: '1.1rem',
          lineHeight: '1.6'
        }}>
          Cliquez sur le bouton ci-dessous pour tester le menu déroulant interactif<br/>
          avec ses animations fluides et ses effets visuels modernisés.
        </p>
        
        <div style={{
          padding: '2rem',
          background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(139, 92, 246, 0.1))',
          borderRadius: '16px',
          border: '2px dashed rgba(99, 102, 241, 0.2)'
        }}>
          <ThemeToggle />
        </div>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1rem',
          width: '100%',
          maxWidth: '600px'
        }}>
          <div style={{
            background: 'var(--color-surface, white)',
            padding: '1.5rem',
            borderRadius: '12px',
            textAlign: 'center',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)'
          }}>
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🎯</div>
            <h3 style={{ color: 'var(--color-text, #374151)', margin: '0 0 0.5rem 0' }}>Menu Déroulant</h3>
            <p style={{ color: 'var(--color-text-secondary, #6B7280)', fontSize: '0.9rem', margin: 0 }}>
              Interface intuitive avec descriptions
            </p>
          </div>
          
          <div style={{
            background: 'var(--color-surface, white)',
            padding: '1.5rem',
            borderRadius: '12px',
            textAlign: 'center',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)'
          }}>
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>⚡</div>
            <h3 style={{ color: 'var(--color-text, #374151)', margin: '0 0 0.5rem 0' }}>Animations</h3>
            <p style={{ color: 'var(--color-text-secondary, #6B7280)', fontSize: '0.9rem', margin: 0 }}>
              Transitions fluides et effets visuels
            </p>
          </div>
          
          <div style={{
            background: 'var(--color-surface, white)',
            padding: '1.5rem',
            borderRadius: '12px',
            textAlign: 'center',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)'
          }}>
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>♿</div>
            <h3 style={{ color: 'var(--color-text, #374151)', margin: '0 0 0.5rem 0' }}>Accessibilité</h3>
            <p style={{ color: 'var(--color-text-secondary, #6B7280)', fontSize: '0.9rem', margin: 0 }}>
              Navigation clavier complète
            </p>
          </div>
        </div>
        
        <div style={{
          background: 'rgba(99, 102, 241, 0.1)',
          padding: '1rem',
          borderRadius: '8px',
          borderLeft: '4px solid #6366F1',
          width: '100%',
          maxWidth: '500px'
        }}>
          <h4 style={{ color: 'var(--color-text, #374151)', margin: '0 0 0.5rem 0' }}>
            🔧 Instructions de test :
          </h4>
          <ul style={{ color: 'var(--color-text-secondary, #6B7280)', fontSize: '0.9rem', margin: 0 }}>
            <li>Cliquez sur le bouton pour ouvrir le menu</li>
            <li>Observez les animations et effets visuels</li>
            <li>Testez les différents thèmes disponibles</li>
            <li>Essayez la navigation avec Tab et Échap</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <TestApp />
  </React.StrictMode>
);
