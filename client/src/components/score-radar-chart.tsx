import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';

interface ScoreRadarChartProps {
  scores: {
    structure: number;
    motivation: number;
    cognitive: number;
    task: number;
  };
}

export function ScoreRadarChart({ scores }: ScoreRadarChartProps) {
  const data = [
    {
      axis: 'Structure',
      value: scores.structure,
      fullMark: 35,
    },
    {
      axis: 'Motivation',
      value: scores.motivation,
      fullMark: 35,
    },
    {
      axis: 'Cognitive',
      value: scores.cognitive,
      fullMark: 35,
    },
    {
      axis: 'Task',
      value: scores.task,
      fullMark: 35,
    },
  ];

  return (
    <ResponsiveContainer width="100%" height={300}>
      <RadarChart data={data}>
        <PolarGrid stroke="#e0e0e0" />
        <PolarAngleAxis 
          dataKey="axis" 
          tick={{ fill: '#374151', fontSize: 14, fontWeight: 500 }}
        />
        <PolarRadiusAxis 
          angle={90} 
          domain={[0, 35]} 
          tick={{ fill: '#9ca3af', fontSize: 12 }}
        />
        <Radar
          name="Your Scores"
          dataKey="value"
          stroke="#6366f1"
          fill="#6366f1"
          fillOpacity={0.6}
          strokeWidth={2}
          data-testid="radar-chart"
        />
      </RadarChart>
    </ResponsiveContainer>
  );
}
