
import React from 'react';

interface BrandLogoProps {
  className?: string;
  size?: number;
  showText?: boolean;
  light?: boolean;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({ className = '', size = 48, showText = false, light = false }) => {
  return (
    <div className={`flex flex-col items-center gap-2 ${className}`}>
      <div style={{ width: size, height: size }} className="relative flex items-center justify-center">
        {/* The "D" Shaped Gradient Blob */}
        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-xl">
          <defs>
            <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FF0000" />
              <stop offset="50%" stopColor="#FF5100" />
              <stop offset="100%" stopColor="#FFB800" />
            </linearGradient>
          </defs>
          <path 
            d="M20 20C20 10 30 0 50 0C80 0 100 20 100 50C100 80 80 100 50 100C30 100 20 90 20 80L20 20Z" 
            fill="url(#logoGradient)" 
            transform="rotate(-45 50 50)"
          />
          {/* Connected Dots Motif */}
          <circle cx="40" cy="30" r="6" fill="white" />
          <circle cx="60" cy="30" r="6" fill="white" />
          <circle cx="40" cy="50" r="6" fill="white" />
          <circle cx="80" cy="50" r="6" fill="white" />
          <circle cx="60" cy="70" r="6" fill="white" />
          <circle cx="80" cy="70" r="6" fill="white" />
          
          {/* Purple Connection Path */}
          <path d="M40 70 L60 50 L80 30" stroke="#5E00A3" strokeWidth="6" strokeLinecap="round" />
          <circle cx="40" cy="70" r="8" fill="#5E00A3" />
          <circle cx="60" cy="50" r="8" fill="#5E00A3" />
          <circle cx="80" cy="30" r="8" fill="#5E00A3" />
        </svg>
      </div>
      {showText && (
        <div className="flex flex-col items-center">
          <span className={`text-2xl font-black tracking-tighter ${light ? 'text-white' : 'text-[#5E00A3]'}`}>
            DataHub
          </span>
          <span className={`text-[10px] font-black uppercase tracking-[0.4em] -mt-1 ${light ? 'text-white/80' : 'text-[#5E00A3]'}`}>
            Africa
          </span>
        </div>
      )}
    </div>
  );
};
