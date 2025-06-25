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

export const PILLAR_CONFIG: Record<PillarType, { name: string; icon: string; color: string; questions: string[] }> = {  alimentation: {
    name: 'Alimentation',
    icon: '🥗',
    color: '#34C759', /* Vert santé Apple */
    questions: [
      'Ai-je évité le sucre, le pain blanc et les aliments transformés ?',
      'Ai-je consommé suffisamment de légumes, fruits et de l\'eau ?',
      'Ai-je consommé assez de protéines aujourd\'hui ?'
    ]
  },  sport: {
    name: 'Sport',
    icon: '💪',
    color: '#FF9500', /* Orange fitness Apple */
    questions: [
      'Ai-je fait une séance de sport aujourd\'hui ?'
    ]
  },  sommeil: {
    name: 'Sommeil',
    icon: '😴',
    color: '#5856D6', /* Violet sommeil Apple */
    questions: [
      'Ai-je bien dormi (quantité et qualité) ?'
    ]
  },  stress: {
    name: 'Stress / Équilibre',
    icon: '🧘',
    color: '#00C7BE', /* Mint anti-stress Apple */
    questions: [
      'Ai-je bien géré mon temps d\'écran ?',
      'Ai-je protégé mes 5 sens (langue, yeux, pensées, etc.) ?'
    ]
  },  spiritualite: {
    name: 'Spiritualité',
    icon: '🕌',
    color: '#5AC8FA', /* Cyan spiritualité Apple */
    questions: [
      'Ai-je accompli mes 5 prières à l\'heure, dont 3 en groupe ?',
      'Ai-je respecté mon programme de Coran (lecture, mémorisation) ?',
      'Ai-je récité les doâs du matin et du soir ?'
    ]
  },
  social: {
    name: 'Social',
    icon: '❤️',
    color: '#FF2D92', /* Rose social Apple */
    questions: [
      'Ai-je été utile à ma famille ou mon entourage ?',
      'Ai-je aidé quelqu\'un aujourd\'hui (même petit geste) ?',
      'Ai-je été bienveillant dans mes interactions ?'
    ]
  }
};
