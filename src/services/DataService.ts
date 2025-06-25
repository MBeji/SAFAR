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

  // Méthode pour créer des données de test
  static createTestData(): void {
    const testEntries: DailyEntry[] = [];
    const today = new Date();
    
    // Créer 7 jours de données de test
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);        const pillars = [
        { id: 'nutrition', name: 'Alimentation', icon: '🥗', color: '#34C759', score: Math.round(60 + Math.random() * 40), questions: [] },
        { id: 'sport', name: 'Sport', icon: '🏃', color: '#FF9500', score: Math.round(50 + Math.random() * 50), questions: [] },
        { id: 'sleep', name: 'Sommeil', icon: '😴', color: '#5856D6', score: Math.round(65 + Math.random() * 35), questions: [] },
        { id: 'stress', name: 'Stress/Équilibre', icon: '🧘', color: '#00C7BE', score: Math.round(45 + Math.random() * 55), questions: [] },
        { id: 'spirituality', name: 'Spiritualité', icon: '✨', color: '#5AC8FA', score: Math.round(40 + Math.random() * 60), questions: [] },
        { id: 'social', name: 'Social', icon: '👥', color: '#FF2D92', score: Math.round(60 + Math.random() * 40), questions: [] }
      ];
      
      const globalScore = Math.round(pillars.reduce((sum, p) => sum + p.score, 0) / pillars.length);
      
      testEntries.push({
        date: format(date, 'yyyy-MM-dd'),
        pillars,
        globalScore,
        timestamp: date.getTime()
      });
    }
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(testEntries));
  }

  // Méthodes d'analytics avancées
  static getWeeklyAverage(): number {
    const weekData = this.getLastDays(7);
    if (weekData.length === 0) return 0;
    const total = weekData.reduce((sum, entry) => sum + entry.globalScore, 0);
    return Math.round(total / weekData.length);
  }

  static getMonthlyAverage(): number {
    const monthData = this.getLastDays(30);
    if (monthData.length === 0) return 0;
    const total = monthData.reduce((sum, entry) => sum + entry.globalScore, 0);
    return Math.round(total / monthData.length);
  }

  static getPillarTrend(pillarId: string, days: number = 7): 'improving' | 'declining' | 'stable' {
    const data = this.getLastDays(days);
    if (data.length < 2) return 'stable';
    
    const scores = data
      .reverse() // Plus ancien au plus récent
      .map(entry => entry.pillars.find(p => p.id === pillarId)?.score || 0);
    
    const firstHalf = scores.slice(0, Math.floor(scores.length / 2));
    const secondHalf = scores.slice(Math.floor(scores.length / 2));
    
    const firstAvg = firstHalf.reduce((sum, score) => sum + score, 0) / firstHalf.length;
    const secondAvg = secondHalf.reduce((sum, score) => sum + score, 0) / secondHalf.length;
    
    const difference = secondAvg - firstAvg;
    
    if (difference > 5) return 'improving';
    if (difference < -5) return 'declining';
    return 'stable';
  }

  static getBestPillar(): { pillarId: string; name: string; averageScore: number } | null {
    const recentData = this.getLastDays(7);
    if (recentData.length === 0) return null;
    
    const pillarAverages = new Map<string, { name: string; total: number; count: number }>();
    
    recentData.forEach(entry => {
      entry.pillars.forEach(pillar => {
        const existing = pillarAverages.get(pillar.id) || { name: pillar.name, total: 0, count: 0 };
        existing.total += pillar.score;
        existing.count += 1;
        pillarAverages.set(pillar.id, existing);
      });
    });
    
    let best = { pillarId: '', name: '', averageScore: 0 };
    pillarAverages.forEach((data, pillarId) => {
      const average = data.total / data.count;
      if (average > best.averageScore) {
        best = { pillarId, name: data.name, averageScore: Math.round(average) };
      }
    });
    
    return best.averageScore > 0 ? best : null;
  }

  static getWeakestPillar(): { pillarId: string; name: string; averageScore: number } | null {
    const recentData = this.getLastDays(7);
    if (recentData.length === 0) return null;
    
    const pillarAverages = new Map<string, { name: string; total: number; count: number }>();
    
    recentData.forEach(entry => {
      entry.pillars.forEach(pillar => {
        const existing = pillarAverages.get(pillar.id) || { name: pillar.name, total: 0, count: 0 };
        existing.total += pillar.score;
        existing.count += 1;
        pillarAverages.set(pillar.id, existing);
      });
    });
    
    let weakest = { pillarId: '', name: '', averageScore: 100 };
    pillarAverages.forEach((data, pillarId) => {
      const average = data.total / data.count;
      if (average < weakest.averageScore) {
        weakest = { pillarId, name: data.name, averageScore: Math.round(average) };
      }
    });
    
    return weakest.averageScore < 100 ? weakest : null;
  }

  static getStreakData(): { currentStreak: number; longestStreak: number; targetScore: number } {
    const data = this.getAllData().sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    const TARGET_SCORE = 70; // Score cible pour considérer un "bon jour"
    
    let currentStreak = 0;
    let longestStreak = 0;
    let tempStreak = 0;
    
    // Calculer la série actuelle (en partant d'aujourd'hui vers le passé)
    const today = format(new Date(), 'yyyy-MM-dd');
    const reversedData = [...data].reverse();
    
    for (const entry of reversedData) {
      if (entry.globalScore >= TARGET_SCORE) {
        if (entry.date === today || currentStreak > 0) {
          currentStreak++;
        }
        tempStreak++;
        longestStreak = Math.max(longestStreak, tempStreak);
      } else {
        if (entry.date === today) {
          currentStreak = 0;
        }
        tempStreak = 0;
      }
    }
    
    return { currentStreak, longestStreak, targetScore: TARGET_SCORE };
  }

  // Méthodes de validation et sauvegarde avancées
  static validateEntry(entry: DailyEntry): boolean {
    if (!entry.date || !entry.pillars || !Array.isArray(entry.pillars)) {
      return false;
    }
    
    // Vérifier que tous les piliers requis sont présents
    const requiredPillarIds = Object.keys(PILLAR_CONFIG);
    const entryPillarIds = entry.pillars.map(p => p.id);
    
    for (const requiredId of requiredPillarIds) {
      if (!entryPillarIds.includes(requiredId)) {
        return false;
      }
    }
    
    // Vérifier que les scores sont dans la bonne plage
    for (const pillar of entry.pillars) {
      if (pillar.score < 0 || pillar.score > 100) {
        return false;
      }
    }
    
    return true;
  }

  static createBackup(): string {
    const backup = {
      version: '1.0',
      timestamp: Date.now(),
      data: this.getAllData(),
      metadata: {
        totalEntries: this.getAllData().length,
        dateRange: this.getDateRange(),
        averageScore: this.getWeeklyAverage()
      }
    };
    
    return JSON.stringify(backup, null, 2);
  }

  static restoreFromBackup(backupData: string): boolean {
    try {
      const backup = JSON.parse(backupData);
      
      if (!backup.data || !Array.isArray(backup.data)) {
        console.error('Format de sauvegarde invalide');
        return false;
      }
      
      // Valider chaque entrée
      for (const entry of backup.data) {
        if (!this.validateEntry(entry)) {
          console.error('Entrée invalide trouvée dans la sauvegarde');
          return false;
        }
      }
      
      // Sauvegarder les données actuelles comme backup
      const currentBackup = this.createBackup();
      localStorage.setItem(STORAGE_KEY + '_backup', currentBackup);
      
      // Restaurer les nouvelles données
      localStorage.setItem(STORAGE_KEY, JSON.stringify(backup.data));
      
      return true;
    } catch (error) {
      console.error('Erreur lors de la restauration:', error);
      return false;
    }
  }

  static getDateRange(): { start: string; end: string } | null {
    const data = this.getAllData();
    if (data.length === 0) return null;
    
    const dates = data.map(entry => entry.date).sort();
    return {
      start: dates[0],
      end: dates[dates.length - 1]
    };
  }

  static cleanupOldData(daysToKeep: number = 365): number {
    const data = this.getAllData();
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);
    const cutoffString = format(cutoffDate, 'yyyy-MM-dd');
    
    const filteredData = data.filter(entry => entry.date >= cutoffString);
    const removedCount = data.length - filteredData.length;
    
    if (removedCount > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredData));
    }
    
    return removedCount;
  }

  // Système d'objectifs et de défis
  static setWeeklyGoal(pillarId: string, targetScore: number): boolean {
    try {
      const goals = this.getGoals();
      goals[pillarId] = {
        target: targetScore,
        setDate: format(new Date(), 'yyyy-MM-dd'),
        weekStart: this.getWeekStart()
      };
      localStorage.setItem(STORAGE_KEY + '_goals', JSON.stringify(goals));
      return true;
    } catch (error) {
      console.error('Erreur lors de la définition de l\'objectif:', error);
      return false;
    }
  }

  static getGoals(): Record<string, { target: number; setDate: string; weekStart: string }> {
    try {
      const data = localStorage.getItem(STORAGE_KEY + '_goals');
      return data ? JSON.parse(data) : {};
    } catch (error) {
      console.error('Erreur lors du chargement des objectifs:', error);
      return {};
    }
  }

  static getWeekStart(): string {
    const today = new Date();
    const dayOfWeek = today.getDay();
    const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek; // Lundi = début de semaine
    const monday = new Date(today);
    monday.setDate(today.getDate() + mondayOffset);
    return format(monday, 'yyyy-MM-dd');
  }

  static checkGoalProgress(pillarId: string): { 
    hasGoal: boolean; 
    target: number; 
    current: number; 
    progress: number; 
    achieved: boolean 
  } | null {
    const goals = this.getGoals();
    const goal = goals[pillarId];
    
    if (!goal) {
      return { hasGoal: false, target: 0, current: 0, progress: 0, achieved: false };
    }
    
    const weekStart = this.getWeekStart();
    if (goal.weekStart !== weekStart) {
      // Nouvel objectif pour cette semaine nécessaire
      return { hasGoal: false, target: 0, current: 0, progress: 0, achieved: false };
    }
    
    // Calculer la moyenne de la semaine actuelle
    const weekData = this.getThisWeekData();
    const pillarScores = weekData
      .map(entry => entry.pillars.find(p => p.id === pillarId)?.score || 0)
      .filter(score => score > 0);
    
    const current = pillarScores.length > 0 
      ? Math.round(pillarScores.reduce((sum, score) => sum + score, 0) / pillarScores.length)
      : 0;
    
    const progress = Math.min(100, Math.round((current / goal.target) * 100));
    const achieved = current >= goal.target;
    
    return {
      hasGoal: true,
      target: goal.target,
      current,
      progress,
      achieved
    };
  }

  static getThisWeekData(): DailyEntry[] {
    const weekStart = this.getWeekStart();
    const today = format(new Date(), 'yyyy-MM-dd');
    
    return this.getAllData().filter(entry => 
      entry.date >= weekStart && entry.date <= today
    );
  }

  static generateDailyChallenge(): { title: string; description: string; pillarId: string } | null {
    const weekestPillar = this.getWeakestPillar();
    if (!weekestPillar) return null;
    
    const challenges = {
      'alimentation': [
        'Buvez 8 verres d\'eau aujourd\'hui',
        'Mangez 5 portions de fruits et légumes',
        'Évitez les aliments transformés toute la journée',
        'Préparez un repas fait maison'
      ],
      'sport': [
        'Faites 30 minutes d\'activité physique',
        'Montez les escaliers au lieu de prendre l\'ascenseur',
        'Faites une promenade de 20 minutes',
        'Essayez un nouvel exercice aujourd\'hui'
      ],
      'sommeil': [
        'Couchez-vous 30 minutes plus tôt',
        'Évitez les écrans 1h avant le coucher',
        'Créez une routine de relaxation avant de dormir',
        'Gardez votre chambre fraîche et sombre'
      ],
      'stress': [
        'Pratiquez 10 minutes de méditation',
        'Faites 3 pauses sans écran aujourd\'hui',
        'Écrivez 3 choses pour lesquelles vous êtes reconnaissant',
        'Respirez profondément 5 fois quand vous vous sentez stressé'
      ],
      'spiritualite': [
        'Accordez-vous 15 minutes de réflexion spirituelle',
        'Lisez un texte inspirant',
        'Pratiquez la gratitude pendant 5 minutes',
        'Méditez sur vos valeurs profondes'
      ],
      'social': [
        'Appelez un proche que vous n\'avez pas vu récemment',
        'Faites un compliment sincère à quelqu\'un',
        'Proposez votre aide à un collègue ou ami',
        'Écrivez un message de remerciement'
      ]
    };
    
    const pillarChallenges = challenges[weekestPillar.pillarId as keyof typeof challenges];
    if (!pillarChallenges) return null;
    
    const randomChallenge = pillarChallenges[Math.floor(Math.random() * pillarChallenges.length)];
    
    return {
      title: `Défi ${weekestPillar.name}`,
      description: randomChallenge,
      pillarId: weekestPillar.pillarId
    };
  }
}
