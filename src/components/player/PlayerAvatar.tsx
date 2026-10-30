import React, { useState } from 'react';
import { Player } from '../../types';

interface PlayerAvatarProps {
  player: Player;
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  className?: string;
}

export const PlayerAvatar: React.FC<PlayerAvatarProps> = ({
  player,
  size = 'md',
  className = '',
}) => {
  const [imgError, setImgError] = useState(false);

  const sizeMap = {
    sm: { container: 'w-7 h-7 text-[10px] rounded-lg', img: 'w-7 h-7 rounded-lg' },
    md: { container: 'w-10 h-10 text-xs rounded-xl', img: 'w-10 h-10 rounded-xl' },
    lg: { container: 'w-14 h-14 text-base font-bold rounded-xl', img: 'w-14 h-14 rounded-xl' },
    xl: { container: 'w-20 h-20 text-xl font-bold rounded-2xl', img: 'w-20 h-20 rounded-2xl' },
    '2xl': { container: 'w-28 h-28 sm:w-32 sm:h-32 text-3xl font-black rounded-3xl', img: 'w-28 h-28 sm:w-32 sm:h-32 rounded-3xl' },
  };

  const config = sizeMap[size];

  const initials = player.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2);

  return (
    <div
      className={`relative shrink-0 overflow-hidden bg-[#16214A] border border-[#26346B] flex items-center justify-center select-none shadow-md ${config.container} ${className}`}
    >
      {player.photoUrl && !imgError ? (
        <img
          src={player.photoUrl}
          alt={player.name}
          loading="lazy"
          decoding="async"
          referrerPolicy="no-referrer"
          className={`w-full h-full object-cover object-top transition-transform duration-200 group-hover:scale-105 ${config.img}`}
          onError={() => setImgError(true)}
        />
      ) : (
        <span className="font-display font-black text-[#3D7BFF] tracking-wider">
          {initials}
        </span>
      )}
    </div>
  );
};
