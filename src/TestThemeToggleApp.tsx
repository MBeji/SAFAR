import React from 'react';
import ThemeToggle from './components/ThemeToggle';
import { ThemeService } from './services/ThemeService';
import './index.css';

// Initialiser les services essentiels
ThemeService.initTheme();

const TestThemeToggleApp: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-soft-lavender via-soft-peach to-soft-mint p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            🎨 Test du ThemeToggle Modernisé
          </h1>
          <p className="text-gray-600 text-lg">
            Découvrez les nouvelles fonctionnalités et animations du sélecteur de thème
          </p>
        </div>

        {/* Test Section */}
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/20">
          <div className="flex justify-between items-start mb-8">
            <div>
              <h2 className="text-2xl font-semibold text-gray-800 mb-2">
                Sélecteur de Thème Interactif
              </h2>
              <p className="text-gray-600">
                Cliquez pour découvrir le menu déroulant avec animations fluides
              </p>
            </div>
            <ThemeToggle />
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-gradient-to-br from-blue-50 to-indigo-100 p-6 rounded-xl">
              <div className="text-3xl mb-3">🎯</div>
              <h3 className="font-semibold text-gray-800 mb-2">Menu Déroulant</h3>
              <p className="text-gray-600 text-sm">
                Interface intuitive avec descriptions détaillées de chaque thème
              </p>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-pink-100 p-6 rounded-xl">
              <div className="text-3xl mb-3">⚡</div>
              <h3 className="font-semibold text-gray-800 mb-2">Animations Fluides</h3>
              <p className="text-gray-600 text-sm">
                Transitions smooth avec effets visuels modernisés
              </p>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-emerald-100 p-6 rounded-xl">
              <div className="text-3xl mb-3">♿</div>
              <h3 className="font-semibold text-gray-800 mb-2">Accessibilité</h3>
              <p className="text-gray-600 text-sm">
                Navigation clavier complète et support screen reader
              </p>
            </div>
          </div>

          {/* Instructions */}
          <div className="bg-indigo-50 border-l-4 border-indigo-500 p-6 rounded-r-xl">
            <h4 className="font-semibold text-indigo-900 mb-3">
              🔧 Instructions de test :
            </h4>
            <ul className="text-indigo-800 space-y-2">
              <li>• <strong>Clic :</strong> Ouvrez le menu déroulant</li>
              <li>• <strong>Hover :</strong> Observez les effets de brillance et d'élévation</li>
              <li>• <strong>Sélection :</strong> Changez de thème et voyez l'animation</li>
              <li>• <strong>Clavier :</strong> Utilisez Tab pour naviguer, Échap pour fermer</li>
            </ul>
          </div>

          {/* Demo Area */}
          <div className="mt-8 p-8 bg-gradient-to-r from-indigo-100/50 via-purple-100/50 to-pink-100/50 rounded-2xl border-2 border-dashed border-indigo-300">
            <div className="text-center">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                Zone de Démonstration
              </h3>
              <p className="text-gray-600 mb-6">
                Cette zone change d'apparence selon le thème sélectionné
              </p>
              
              {/* Multiple ThemeToggle instances pour démonstration */}
              <div className="flex flex-wrap justify-center gap-4">
                <div className="flex flex-col items-center gap-2">
                  <ThemeToggle />
                  <span className="text-xs text-gray-500">Version complète</span>
                </div>
                
                <div className="flex flex-col items-center gap-2" style={{ width: '200px' }}>
                  <ThemeToggle />
                  <span className="text-xs text-gray-500">Version responsive</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Info */}
        <div className="text-center mt-8 text-gray-500 text-sm">
          <p>🌟 ThemeToggle v2.0 - Design moderne avec menu déroulant interactif</p>
          <p>Développé pour l'application Bien-être avec React + TypeScript</p>
        </div>
      </div>
    </div>
  );
};

export default TestThemeToggleApp;
