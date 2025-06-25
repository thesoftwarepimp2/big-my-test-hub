
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
    <div className={`inline-flex items-center ${className}`}>
      <img 
        src="/lovable-uploads/a4dfe34d-1fae-463d-82e5-87da4744df85.png" 
        alt="BGL - Big Game Logistics" 
        className={sizeClasses[size]}
      />
    </div>
  );
};

export default Logo;
