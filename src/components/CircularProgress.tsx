import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import './CircularProgress.css';

interface CircularProgressProps {
  score: number;
  size?: number;
  strokeWidth?: number;
  showLabel?: boolean;
  color?: string;
  animationDuration?: number;
}

export const CircularProgress: React.FC<CircularProgressProps> = ({  score,
  size = 120,
  strokeWidth = 8,
  showLabel = true,
  color = '#34C759',
  animationDuration = 1500
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const getScoreColor = (score: number): string => {
    if (score >= 80) return '#34C759'; // Apple Health Green
    if (score >= 60) return '#FF9500'; // Apple Health Orange  
    if (score >= 40) return '#FF3B30'; // Apple Health Red
    return '#8E8E93'; // Apple Health Gray
  };

  const scoreColor = color === '#34C759' ? getScoreColor(score) : color;

  return (
    <div className="circular-progress" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="circular-progress-svg">
        {/* Cercle de fond */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(255, 255, 255, 0.2)"
          strokeWidth={strokeWidth}
        />
        
        {/* Cercle de progression */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={scoreColor}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="circular-progress-bar"
          style={{
            animationDuration: `${animationDuration}ms`,
            filter: `drop-shadow(0 0 8px ${scoreColor}40)`
          }}
        />
        
        {/* Effet de lueur */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={scoreColor}
          strokeWidth={strokeWidth / 2}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="circular-progress-glow"
          style={{ animationDuration: `${animationDuration}ms` }}
        />
      </svg>
      
      {showLabel && (
        <div className="circular-progress-label">
          <span className="circular-progress-score" style={{ color: scoreColor }}>
            {score}%
          </span>
        </div>
      )}
    </div>
  );
};

interface PillarsRadarProps {
  pillars: Array<{
    name: string;
    score: number;
    color: string;
  }>;
}

export const PillarsRadar: React.FC<PillarsRadarProps> = ({ pillars }) => {
  const data = pillars.map(pillar => ({
    name: pillar.name,
    value: pillar.score,
    color: pillar.color
  }));

  return (
    <div className="pillars-radar">
      <ResponsiveContainer width="100%" height={200}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={40}
            outerRadius={80}
            paddingAngle={2}
            dataKey="value"
            animationBegin={0}
            animationDuration={1500}
          >
            {data.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={entry.color}
                stroke={entry.color}
                strokeWidth={2}
                filter={`drop-shadow(0 2px 8px ${entry.color}40)`}
              />
            ))}
          </Pie>
          <Tooltip 
            formatter={(value: any) => [`${value}%`, 'Score']}
            contentStyle={{
              background: 'rgba(0, 0, 0, 0.8)',
              border: 'none',
              borderRadius: '8px',
              color: 'white',
              fontSize: '14px'
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};
