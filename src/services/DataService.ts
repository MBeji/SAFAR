import type { DailyEntry, Pillar } from '../types';
import { PILLAR_CONFIG } from '../types';
import { format } from 'date-fns';

const STORAGE_KEY = 'wellbeing-data';

export class DataService {
  static createEmptyPillars(): Pillar[] {
    return Object.entries(PILLAR_CONFIG).map(([key, config]) => ({
      id: key,
      name: config.name,
      icon: config.icon,
      color: config.color,
      questions: config.questions.map((text, index) => ({
        id: `${key}-q${index}`,
        text,
        value: 0
      })),
      score: 0
    }));
  }

  static calculatePillarScore(pillar: Pillar): number {
    if (pillar.questions.length === 0) return 0;
    const total = pillar.questions.reduce((sum, q) => sum + q.value, 0);
    return Math.round(total / pillar.questions.length);
  }

  static calculateGlobalScore(pillars: Pillar[]): number {
    if (pillars.length === 0) return 0;
    const total = pillars.reduce((sum, pillar) => sum + this.calculatePillarScore(pillar), 0);
    return Math.round(total / pillars.length);
  }

  static getTodayEntry(): DailyEntry | null {
    const today = format(new Date(), 'yyyy-MM-dd');
    const data = this.getAllData();
    return data.find(entry => entry.date === today) || null;
  }

  static saveTodayEntry(pillars: Pillar[]): DailyEntry {
    const today = format(new Date(), 'yyyy-MM-dd');
    
    // Calculer les scores
    const updatedPillars = pillars.map(pillar => ({
      ...pillar,
      score: this.calculatePillarScore(pillar)
    }));

    const entry: DailyEntry = {
      date: today,
      pillars: updatedPillars,
      globalScore: this.calculateGlobalScore(updatedPillars),
      timestamp: Date.now()
    };

    // Récupérer les données existantes
    const existingData = this.getAllData();
    
    // Remplacer l'entrée du jour ou l'ajouter
    const otherDays = existingData.filter(e => e.date !== today);
    const newData = [...otherDays, entry];

    // Sauvegarder
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newData));
    
    return entry;
  }

  static getAllData(): DailyEntry[] {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Erreur lors du chargement des données:', error);
      return [];
    }
  }

  static getLastDays(days: number): DailyEntry[] {
    const allData = this.getAllData();
    return allData
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, days);
  }

  static exportData(): string {
    return JSON.stringify(this.getAllData(), null, 2);
  }

  static importData(jsonData: string): boolean {
    try {
      const data = JSON.parse(jsonData);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      return true;
    } catch (error) {
      console.error('Erreur lors de l\'import:', error);
      return false;
    }
  }

  static clearAllData(): void {
    localStorage.removeItem(STORAGE_KEY);
  }
}
