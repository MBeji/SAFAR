import React, { useState } from 'react';
import { Download, Loader2 } from 'lucide-react';
import { ExportService } from '../services/ExportService';
import './ExportButton.css';

interface ExportButtonProps {
  className?: string;
}

export const ExportButton: React.FC<ExportButtonProps> = ({ className = '' }) => {
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    if (isExporting) return;
    
    setIsExporting(true);
    
    try {
      await ExportService.exportStatsToPDF();
      
      // Petite notification de succès
      const notification = document.createElement('div');
      notification.className = 'export-success-notification';
      notification.textContent = '✓ Rapport PDF généré avec succès !';
      document.body.appendChild(notification);
      
      setTimeout(() => {
        if (document.body.contains(notification)) {
          document.body.removeChild(notification);
        }
      }, 3000);
      
    } catch (error) {
      console.error('Erreur lors de l\'export:', error);
      
      // Notification d'erreur
      const notification = document.createElement('div');
      notification.className = 'export-error-notification';
      notification.textContent = '❌ Erreur lors de la génération du rapport';
      document.body.appendChild(notification);
      
      setTimeout(() => {
        if (document.body.contains(notification)) {
          document.body.removeChild(notification);
        }
      }, 3000);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <button
      className={`export-button ${className}`}
      onClick={handleExport}
      disabled={isExporting}
      title="Exporter les statistiques en PDF"
    >
      {isExporting ? (
        <>
          <Loader2 className="export-button-icon spinning" size={20} />
          Génération...
        </>
      ) : (
        <>
          <Download className="export-button-icon" size={20} />
          Exporter PDF
        </>
      )}
    </button>
  );
};
