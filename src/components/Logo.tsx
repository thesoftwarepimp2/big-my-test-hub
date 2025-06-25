
import React from 'react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const Logo: React.FC<LogoProps> = ({ className = '', size = 'md' }) => {
  const sizeClasses = {
    sm: 'h-8',
    md: 'h-12',
    lg: 'h-16'
  };

  return (
    <div className={`inline-flex items-center bg-white rounded-lg px-4 py-2 shadow-lg ${className}`}>
      <div className="flex items-center space-x-2">
        <div className="flex items-center">
          <span className="text-2xl font-bold text-blue-800">BGL</span>
          <div className="ml-1 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
            <div className="w-3 h-3 bg-red-600 rounded-full"></div>
          </div>
        </div>
        <div className="border-l-2 border-gray-300 pl-2">
          <div className="text-blue-800 font-semibold text-sm">BIG GAME</div>
          <div className="text-blue-800 font-semibold text-sm">LOGISTICS</div>
        </div>
      </div>
    </div>
  );
};

export default Logo;
