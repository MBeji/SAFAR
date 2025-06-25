import React from 'react';
import { Lightbulb, Heart, Zap, Moon, Salad, Users } from 'lucide-react';
import type { Pillar } from '../types';
import './DailyTips.css';

interface DailyTipsProps {
  pillars: Pillar[];
  globalScore: number;
}

const DailyTips: React.FC<DailyTipsProps> = ({ pillars, globalScore }) => {
  const getWeakestPillar = (): Pillar | null => {
    if (pillars.length === 0) return null;
    return pillars.reduce((weakest, current) => 
      current.score < weakest.score ? current : weakest
    );
  };

  const getStrongestPillar = (): Pillar | null => {
    if (pillars.length === 0) return null;
    return pillars.reduce((strongest, current) => 
      current.score > strongest.score ? current : strongest
    );
  };

  const getPillarIcon = (pillarId: string) => {
    switch (pillarId) {
      case 'alimentation': return <Salad size={20} />;
      case 'sport': return <Zap size={20} />;
      case 'sommeil': return <Moon size={20} />;
      case 'stress': return <Heart size={20} />;
      case 'spiritualite': return <Lightbulb size={20} />;
      case 'social': return <Users size={20} />;
      default: return <Lightbulb size={20} />;
    }
  };

  const getTips = () => {
    const weakest = getWeakestPillar();
    const strongest = getStrongestPillar();
    const tips = [];

    // Conseil global
    if (globalScore >= 80) {
      tips.push({
        type: 'success',
        title: '🌟 Excellent travail !',
        message: 'Votre bien-être global est excellent. Continuez sur cette lancée !',
        icon: <Heart size={20} />
      });
    } else if (globalScore >= 60) {
      tips.push({
        type: 'info',
        title: '👍 Bon équilibre',
        message: 'Votre bien-être est sur la bonne voie. Quelques ajustements peuvent encore l\'améliorer.',
        icon: <Lightbulb size={20} />
      });
    } else {
      tips.push({
        type: 'warning',
        title: '⚠️ Attention à votre bien-être',
        message: 'Il est temps de prendre soin de vous. Concentrez-vous sur les piliers les plus faibles.',
        icon: <Heart size={20} />
      });
    }

    // Conseil pour le pilier le plus faible
    if (weakest && weakest.score < 60) {
      const pillarTips = {
        'alimentation': 'Privilégiez les aliments non transformés, buvez plus d\'eau et réduisez le sucre.',
        'sport': 'Même 15 minutes de marche quotidienne peuvent faire une différence.',
        'sommeil': 'Essayez de vous coucher plus tôt et créez une routine de coucher relaxante.',
        'stress': 'Prenez des pauses régulières loin des écrans et pratiquez la respiration profonde.',
        'spiritualite': 'Accordez-vous quelques minutes de méditation ou de lecture spirituelle.',
        'social': 'Contactez un proche ou faites un geste bienveillant pour quelqu\'un aujourd\'hui.'
      };

      tips.push({
        type: 'improvement',
        title: `Améliorez votre ${weakest.name.toLowerCase()}`,
        message: pillarTips[weakest.id as keyof typeof pillarTips] || 'Concentrez-vous sur ce pilier aujourd\'hui.',
        icon: getPillarIcon(weakest.id)
      });
    }

    // Félicitation pour le pilier le plus fort
    if (strongest && strongest.score >= 80) {
      tips.push({
        type: 'celebration',
        title: `✨ Bravo pour votre ${strongest.name.toLowerCase()} !`,
        message: 'Vous excellez dans ce domaine. Votre exemple peut inspirer d\'autres aspects de votre vie.',
        icon: getPillarIcon(strongest.id)
      });
    }

    return tips;
  };

  const tips = getTips();

  if (tips.length === 0) return null;

  return (
    <div className="daily-tips animate-slide-up">
      <h3 className="daily-tips-title">
        <Lightbulb size={20} />
        Conseils du jour
      </h3>
      <div className="tips-container">
        {tips.map((tip, index) => (
          <div key={index} className={`tip-card tip-${tip.type}`}>
            <div className="tip-icon">
              {tip.icon}
            </div>
            <div className="tip-content">
              <h4 className="tip-title">{tip.title}</h4>
              <p className="tip-message">{tip.message}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DailyTips;
