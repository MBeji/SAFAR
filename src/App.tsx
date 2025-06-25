import { useState, useEffect } from 'react';
import Home from './components/Home';
import Journal from './components/Journal';
import Stats from './components/Stats';
import QuickStart from './components/QuickStart';
import { ThemeService } from './services/ThemeService';
import { NotificationService } from './services/NotificationService';
import { DataService } from './services/DataService';
import { useTheme } from './hooks/useTheme';
import './App.css';

type Page = 'home' | 'journal' | 'stats';

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [showQuickStart, setShowQuickStart] = useState(false);
  
  // Le thème est géré automatiquement par le ThemeService
  useTheme();

  useEffect(() => {
    // Initialiser le thème au chargement de l'application
    ThemeService.initTheme();
    
    // Initialiser le service de notifications
    NotificationService.init();

    // Vérifier si c'est la première visite
    const hasSeenQuickStart = localStorage.getItem('hasSeenQuickStart');
    const hasData = DataService.getAllData().length > 0;
    
    if (!hasSeenQuickStart && !hasData) {
      setShowQuickStart(true);
    }
  }, []);

  const handleNavigate = (page: Page) => {
    setCurrentPage(page);
  };

  const handleCloseQuickStart = () => {
    localStorage.setItem('hasSeenQuickStart', 'true');
    setShowQuickStart(false);
  };

  const handleOpenQuickStart = () => {
    setShowQuickStart(true);
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <Home onNavigate={handleNavigate} onOpenQuickStart={handleOpenQuickStart} />;
      case 'journal':
        return <Journal onNavigate={handleNavigate} onOpenQuickStart={handleOpenQuickStart} />;
      case 'stats':
        return <Stats onNavigate={handleNavigate} onOpenQuickStart={handleOpenQuickStart} />;
      default:
        return <Home onNavigate={handleNavigate} onOpenQuickStart={handleOpenQuickStart} />;
    }
  };

  return (
    <div className="App">
      {renderPage()}
      {showQuickStart && (
        <QuickStart 
          onClose={handleCloseQuickStart}
          onNavigate={handleNavigate}
        />
      )}
    </div>
  );
}

export default App;
