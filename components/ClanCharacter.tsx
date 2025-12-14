import React from 'react';
import { ClanConfig } from '../types';

interface Props {
  clanConfig: ClanConfig;
  isVisible: boolean;
}

const ClanCharacter: React.FC<Props> = ({ clanConfig, isVisible }) => {
  return (
    <div 
      className={`absolute inset-0 w-full h-full transition-all duration-700 flex justify-center pointer-events-none ${isVisible ? 'opacity-100 scale-100 delay-100' : 'opacity-0 scale-95'}`}
    >
      {/* Increased height from 90% to 120% to make the character huge */}
      <img 
        src={clanConfig.image} 
        alt={clanConfig.name}
        className={`h-[120%] object-contain object-top animate-float mt-4 md:mt-0 ${clanConfig.glowColor}`} 
      />
    </div>
  );
};

export default ClanCharacter;