import { useState } from 'react';
import Home from './components/Home';
import Journal from './components/Journal';
import Stats from './components/Stats';
import './App.css';

type Page = 'home' | 'journal' | 'stats';

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');

  const handleNavigate = (page: Page) => {
    setCurrentPage(page);
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <Home onNavigate={handleNavigate} />;
      case 'journal':
        return <Journal onNavigate={handleNavigate} />;
      case 'stats':
        return <Stats onNavigate={handleNavigate} />;
      default:
        return <Home onNavigate={handleNavigate} />;
    }
  };

  return (
    <div className="App">
      {renderPage()}
    </div>
  );
}

export default App;
