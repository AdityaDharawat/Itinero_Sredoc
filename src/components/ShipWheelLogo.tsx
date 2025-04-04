import React from 'react';

interface DeathlyHallowsLogoProps {
  size?: number;
  color?: string;
  className?: string;
}

const DeathlyHallowsLogo: React.FC<DeathlyHallowsLogoProps> = ({
  size = 100,
  color = '#000',
  className = '',
}) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 100"
      width={size}
      height={size}
      className={`deathly-hallows-logo ${className}`}
    >
      {/* Triangle */}
      <polygon points="50,5 95,95 5,95" stroke={color} strokeWidth="4" fill="none" />
      
      {/* Circle - sized to touch all sides of the triangle from inside */}
      <circle cx="50" cy="67" r="25" stroke={color} strokeWidth="4" fill="none" />
      
      {/* Elder wand vertical line with details */}
      <path
        d="M50,5 
           L50,33 
           C50,35 52,35 52,33 
           L48,33 
           C48,35 50,35 50,33
           L50,40
           C51,42 53,42 54,40
           C54,38 52,38 50,40
           C48,38 46,38 46,40
           C47,42 49,42 50,40
           L50,50
           C51,51 53,51 54,49
           C54,47 52,47 50,49
           C48,47 46,47 46,49
           C47,51 49,51 50,49
           L50,60
           C52,62 54,62 56,60
           C56,58 54,56 50,60
           C46,56 44,58 44,60
           C46,62 48,62 50,60
           L50,67
           C52,70 56,70 58,67
           C58,64 54,61 50,67
           C46,61 42,64 42,67
           C44,70 48,70 50,67
           L50,95"
        stroke={color}
        strokeWidth="4"
        fill="none"
      />
      
      {/* Stylish ITINERO text */}
      <text
        x="50"
        y="90"
        textAnchor="middle"
        fontSize="10"
        fontFamily="'Brush Script MT', cursive"
        fill={color}
      >
        ITINERO
      </text>
      
      <style>{`
        .deathly-hallows-logo {
          opacity: 1;
          transition: opacity 1s ease-out;
        }
        .deathly-hallows-logo:hover {
          opacity: 0;
        }
      `}</style>
    </svg>
  );
};

export default DeathlyHallowsLogo;
