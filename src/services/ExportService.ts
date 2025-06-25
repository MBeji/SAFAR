import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import type { DailyEntry } from '../types';
import { DataService } from './DataService';

export class ExportService {
  /**
   * Exporte les statistiques en PDF
   */
  static async exportStatsToPDF(): Promise<void> {
    try {      // Récupération des données
      const lastWeekData = DataService.getLastDays(7);
      const todayEntry = DataService.getTodayEntry();

      // Création du PDF
      const pdf = new jsPDF('p', 'mm', 'a4');
      
      // Configuration
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 20;
      let yPosition = margin;

      // En-tête
      pdf.setFontSize(24);
      pdf.setTextColor(88, 127, 178); // Couleur primaire
      pdf.text('Rapport de Bien-être', pageWidth / 2, yPosition, { align: 'center' });
      
      yPosition += 15;
      pdf.setFontSize(12);
      pdf.setTextColor(100, 100, 100);
      const dateStr = format(new Date(), 'dd MMMM yyyy', { locale: fr });
      pdf.text(`Généré le ${dateStr}`, pageWidth / 2, yPosition, { align: 'center' });
      
      yPosition += 20;

      // Score global du jour
      if (todayEntry) {
        pdf.setFontSize(16);
        pdf.setTextColor(60, 60, 60);
        pdf.text('Score Global du Jour', margin, yPosition);
        
        yPosition += 10;
        pdf.setFontSize(24);
        const scoreColor = this.getScoreColor(todayEntry.globalScore);
        pdf.setTextColor(scoreColor.r, scoreColor.g, scoreColor.b);
        pdf.text(`${todayEntry.globalScore}%`, margin, yPosition);
        
        yPosition += 15;
      }

      // Scores par pilier du jour
      if (todayEntry) {
        pdf.setFontSize(14);
        pdf.setTextColor(60, 60, 60);
        pdf.text('Scores par Pilier (Aujourd\'hui)', margin, yPosition);
        yPosition += 10;

        todayEntry.pillars.forEach((pillar) => {
          pdf.setFontSize(12);
          pdf.setTextColor(80, 80, 80);
          pdf.text(`• ${pillar.name}:`, margin + 5, yPosition);
          
          const scoreColor = this.getScoreColor(pillar.score);
          pdf.setTextColor(scoreColor.r, scoreColor.g, scoreColor.b);
          pdf.text(`${pillar.score}%`, margin + 80, yPosition);
          
          yPosition += 8;
        });
        
        yPosition += 10;
      }

      // Tendances hebdomadaires
      if (lastWeekData.length > 1) {
        pdf.setFontSize(14);
        pdf.setTextColor(60, 60, 60);
        pdf.text('Tendances de la Semaine', margin, yPosition);
        yPosition += 10;

        const weeklyStats = this.calculateWeeklyStats(lastWeekData);
        
        pdf.setFontSize(12);
        pdf.setTextColor(80, 80, 80);
        pdf.text(`Score moyen: ${weeklyStats.averageScore}%`, margin + 5, yPosition);
        yPosition += 8;
        
        pdf.text(`Meilleur jour: ${weeklyStats.bestDay.date} (${weeklyStats.bestDay.score}%)`, margin + 5, yPosition);
        yPosition += 8;
        
        pdf.text(`Évolution: ${weeklyStats.trend > 0 ? '+' : ''}${weeklyStats.trend}%`, margin + 5, yPosition);
        yPosition += 15;
      }

      // Recommandations
      yPosition = this.addRecommendations(pdf, margin, yPosition, todayEntry);

      // Nouvelle page pour les graphiques si nécessaire
      if (yPosition > pageHeight - 60) {
        pdf.addPage();
        yPosition = margin;
      }

      // Capture des graphiques si présents
      await this.addChartsToPDF(pdf, margin, yPosition);

      // Sauvegarde
      const fileName = `rapport-bien-etre-${format(new Date(), 'yyyy-MM-dd')}.pdf`;
      pdf.save(fileName);

    } catch (error) {
      console.error('Erreur lors de l\'export PDF:', error);
      throw new Error('Impossible de générer le rapport PDF');
    }
  }

  /**
   * Calcule les statistiques hebdomadaires
   */
  private static calculateWeeklyStats(data: DailyEntry[]) {
    const scores = data.map(entry => entry.globalScore);
    const averageScore = Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length);
    
    const sortedEntries = [...data].sort((a, b) => b.globalScore - a.globalScore);
    const bestDay = {
      date: format(new Date(sortedEntries[0].date), 'dd/MM', { locale: fr }),
      score: sortedEntries[0].globalScore
    };

    // Calcul de la tendance (différence entre premier et dernier jour)
    const trend = data.length > 1 ? 
      Math.round(data[0].globalScore - data[data.length - 1].globalScore) : 0;

    return { averageScore, bestDay, trend };
  }

  /**
   * Ajoute les recommandations basées sur les scores
   */
  private static addRecommendations(pdf: jsPDF, margin: number, yPosition: number, todayEntry: DailyEntry | null): number {
    if (!todayEntry) return yPosition;

    pdf.setFontSize(14);
    pdf.setTextColor(60, 60, 60);
    pdf.text('Recommandations', margin, yPosition);
    yPosition += 10;

    // Trouver les piliers les plus faibles
    const weakPillars = todayEntry.pillars
      .filter(p => p.score < 60)
      .sort((a, b) => a.score - b.score)
      .slice(0, 3);

    if (weakPillars.length > 0) {
      pdf.setFontSize(12);
      pdf.setTextColor(80, 80, 80);
      pdf.text('Domaines à améliorer:', margin + 5, yPosition);
      yPosition += 8;

      weakPillars.forEach(pillar => {
        const recommendation = this.getRecommendation(pillar.id);
        pdf.setFontSize(10);
        pdf.text(`• ${pillar.name}: ${recommendation}`, margin + 10, yPosition);
        yPosition += 6;
      });
    } else {
      pdf.setFontSize(12);
      pdf.setTextColor(46, 125, 50);
      pdf.text('Excellent travail! Tous vos piliers sont bien équilibrés.', margin + 5, yPosition);
      yPosition += 8;
    }

    return yPosition + 10;
  }

  /**
   * Retourne une recommandation pour un pilier donné
   */
  private static getRecommendation(pillarId: string): string {
    const recommendations: Record<string, string> = {
      'nutrition': 'Privilégiez des repas équilibrés et hydratez-vous davantage.',
      'sport': 'Intégrez 30min d\'activité physique quotidienne.',
      'sleep': 'Maintenez un horaire de sommeil régulier (7-9h).',
      'stress': 'Pratiquez la méditation ou des exercices de respiration.',
      'spirituality': 'Prenez du temps pour la réflexion et la gratitude.',
      'social': 'Cultivez vos relations et partagez des moments conviviaux.'
    };
    
    return recommendations[pillarId] || 'Accordez plus d\'attention à ce domaine.';
  }

  /**
   * Ajoute les graphiques au PDF
   */
  private static async addChartsToPDF(pdf: jsPDF, margin: number, yPosition: number): Promise<void> {
    try {
      // Rechercher les éléments de graphiques dans le DOM
      const chartElements = document.querySelectorAll('.recharts-wrapper');
      
      if (chartElements.length > 0) {
        pdf.setFontSize(14);
        pdf.setTextColor(60, 60, 60);
        pdf.text('Graphiques', margin, yPosition);
        yPosition += 15;

        for (let i = 0; i < Math.min(chartElements.length, 2); i++) {
          const element = chartElements[i] as HTMLElement;
          
          try {
            const canvas = await html2canvas(element, {
              backgroundColor: '#ffffff',
              scale: 2
            });
            
            const imgData = canvas.toDataURL('image/png');
            const imgWidth = 160;
            const imgHeight = (canvas.height * imgWidth) / canvas.width;
            
            // Vérifier si on a assez d'espace
            if (yPosition + imgHeight > pdf.internal.pageSize.getHeight() - margin) {
              pdf.addPage();
              yPosition = margin;
            }
            
            pdf.addImage(imgData, 'PNG', margin, yPosition, imgWidth, imgHeight);
            yPosition += imgHeight + 10;
            
          } catch (chartError) {
            console.warn('Erreur lors de la capture du graphique:', chartError);
          }
        }
      }
    } catch (error) {
      console.warn('Erreur lors de l\'ajout des graphiques:', error);
    }
  }

  /**
   * Retourne la couleur correspondant à un score
   */
  private static getScoreColor(score: number): { r: number; g: number; b: number } {
    if (score >= 80) return { r: 76, g: 175, b: 80 }; // Vert
    if (score >= 60) return { r: 255, g: 193, b: 7 }; // Orange
    return { r: 244, g: 67, b: 54 }; // Rouge
  }
}
