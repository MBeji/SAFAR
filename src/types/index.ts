export interface Question {
  id: string;
  text: string;
  value: number; // 0-100
}

export interface Pillar {
  id: string;
  name: string;
  icon: string;
  color: string;
  questions: Question[];
  score: number; // Moyenne des questions, 0-100
}

export interface DailyEntry {
  date: string; // YYYY-MM-DD
  pillars: Pillar[];
  globalScore: number; // Moyenne des scores des piliers, 0-100
  timestamp: number;
}

export interface WeeklyData {
  week: string;
  scores: {
    date: string;
    globalScore: number;
    pillars: { [key: string]: number };
  }[];
}

export interface MonthlyData {
  month: string;
  averageScore: number;
  pillars: { [key: string]: number };
}

export type PillarType = 'alimentation' | 'sport' | 'sommeil' | 'stress' | 'spiritualite' | 'social';

export const PILLAR_CONFIG: Record<PillarType, { name: string; icon: string; color: string; questions: string[] }> = {
  alimentation: {
    name: 'Alimentation',
    icon: '🥗',
    color: '#10B981',
    questions: [
      'Ai-je évité le sucre, le pain blanc et les aliments transformés ?',
      'Ai-je consommé suffisamment de légumes, fruits et de l\'eau ?',
      'Ai-je consommé assez de protéines aujourd\'hui ?'
    ]
  },
  sport: {
    name: 'Sport',
    icon: '💪',
    color: '#3B82F6',
    questions: [
      'Ai-je fait une séance de sport aujourd\'hui ?'
    ]
  },
  sommeil: {
    name: 'Sommeil',
    icon: '😴',
    color: '#8B5CF6',
    questions: [
      'Ai-je bien dormi (quantité et qualité) ?'
    ]
  },
  stress: {
    name: 'Stress / Équilibre',
    icon: '🧘',
    color: '#06B6D4',
    questions: [
      'Ai-je bien géré mon temps d\'écran ?',
      'Ai-je protégé mes 5 sens (langue, yeux, pensées, etc.) ?'
    ]
  },
  spiritualite: {
    name: 'Spiritualité',
    icon: '🕌',
    color: '#F59E0B',
    questions: [
      'Ai-je accompli mes 5 prières à l\'heure, dont 3 en groupe ?',
      'Ai-je respecté mon programme de Coran (lecture, mémorisation) ?',
      'Ai-je récité les doâs du matin et du soir ?'
    ]
  },
  social: {
    name: 'Social',
    icon: '❤️',
    color: '#EF4444',
    questions: [
      'Ai-je été utile à ma famille ou mon entourage ?',
      'Ai-je aidé quelqu\'un aujourd\'hui (même petit geste) ?',
      'Ai-je été bienveillant dans mes interactions ?'
    ]
  }
};
