import React from 'react';
import { ExportButton } from './components/ExportButton';
import { DataService } from './services/DataService';

const TestExport: React.FC = () => {
  // Créer des données de test si elles n'existent pas
  const createTestData = () => {
    DataService.createTestData();
    alert('Données de test créées !');
  };

  return (
    <div style={{ 
      padding: '20px', 
      maxWidth: '400px', 
      margin: '0 auto',
      textAlign: 'center'
    }}>
      <h2>Test Export PDF</h2>
      <div style={{ margin: '20px 0' }}>
        <button 
          onClick={createTestData}
          style={{
            padding: '12px 24px',
            marginRight: '10px',
            backgroundColor: '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer'
          }}
        >
          Créer des données de test
        </button>
      </div>
      
      <div style={{ margin: '20px 0' }}>
        <ExportButton />
      </div>
      
      <p style={{ color: '#666', fontSize: '14px' }}>
        Cliquez d'abord sur "Créer des données de test" pour avoir des données à exporter,
        puis sur "Exporter PDF" pour tester la fonctionnalité.
      </p>
    </div>
  );
};

export default TestExport;
