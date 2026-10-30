import React from 'react';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from 'recharts';
import { PlayerRadarAttributes } from '../../types';

interface PlayerAttributesRadarProps {
  attributes: PlayerRadarAttributes;
  secondAttributes?: PlayerRadarAttributes;
  firstPlayerName?: string;
  secondPlayerName?: string;
  height?: number;
}

export const PlayerAttributesRadar: React.FC<PlayerAttributesRadarProps> = ({
  attributes,
  secondAttributes,
  firstPlayerName = 'Player',
  secondPlayerName = 'Opponent',
  height = 260,
}) => {
  const data = [
    {
      subject: 'Pace',
      A: attributes.pace,
      B: secondAttributes ? secondAttributes.pace : 0,
      fullMark: 100,
    },
    {
      subject: 'Shooting',
      A: attributes.shooting,
      B: secondAttributes ? secondAttributes.shooting : 0,
      fullMark: 100,
    },
    {
      subject: 'Passing',
      A: attributes.passing,
      B: secondAttributes ? secondAttributes.passing : 0,
      fullMark: 100,
    },
    {
      subject: 'Dribbling',
      A: attributes.dribbling,
      B: secondAttributes ? secondAttributes.dribbling : 0,
      fullMark: 100,
    },
    {
      subject: 'Defending',
      A: attributes.defending,
      B: secondAttributes ? secondAttributes.defending : 0,
      fullMark: 100,
    },
    {
      subject: 'Physical',
      A: attributes.physical,
      B: secondAttributes ? secondAttributes.physical : 0,
      fullMark: 100,
    },
  ];

  return (
    <div className="w-full flex flex-col items-center justify-center">
      <div style={{ width: '100%', height }} aria-label="Player attributes radar chart">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
            <PolarGrid stroke="#26346B" strokeOpacity={0.6} />
            <PolarAngleAxis
              dataKey="subject"
              tick={{ fill: '#9AA7D6', fontSize: 11, fontWeight: 600 }}
            />
            <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#26346B" tick={false} />
            <Radar
              name={firstPlayerName}
              dataKey="A"
              stroke="#3D7BFF"
              fill="#3D7BFF"
              fillOpacity={0.4}
            />
            {secondAttributes && (
              <Radar
                name={secondPlayerName}
                dataKey="B"
                stroke="#F0BE4D"
                fill="#F0BE4D"
                fillOpacity={0.35}
              />
            )}
          </RadarChart>
        </ResponsiveContainer>
      </div>

      {secondAttributes && (
        <div className="flex items-center justify-center gap-6 text-xs mt-2">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-[#3D7BFF]" />
            <span className="font-semibold text-white">{firstPlayerName}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-[#F0BE4D]" />
            <span className="font-semibold text-white">{secondPlayerName}</span>
          </div>
        </div>
      )}
    </div>
  );
};
