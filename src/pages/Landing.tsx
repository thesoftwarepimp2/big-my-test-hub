
import React from 'react';
import { Button } from '@/components/ui/button';
import Logo from '@/components/Logo';
import { Truck, ArrowUp } from 'lucide-react';

interface LandingProps {
  onNavigateToLogin: () => void;
}

const Landing: React.FC<LandingProps> = ({ onNavigateToLogin }) => {
  return (
    <div className="min-h-screen gradient-blue flex flex-col items-center justify-center px-4 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-32 h-32 bg-white rounded-full"></div>
        <div className="absolute bottom-20 right-10 w-24 h-24 bg-white rounded-full"></div>
        <div className="absolute top-1/2 left-5 w-16 h-16 bg-white rounded-full"></div>
      </div>

      <div className="text-center space-y-8 relative z-10 max-w-md w-full animate-fade-in">
        {/* Logo */}
        <div className="flex justify-center">
          <Logo size="lg" />
        </div>

        {/* Main Content */}
        <div className="space-y-6">
          <h1 className="text-2xl font-bold text-white leading-tight">
            Business App for<br />
            Wholesalers and Retailers
          </h1>

          {/* Truck Icon */}
          <div className="flex justify-center">
            <div className="bg-white/20 rounded-full p-8">
              <Truck className="h-20 w-20 text-white" />
            </div>
          </div>

          {/* Login Button */}
          <Button 
            onClick={onNavigateToLogin}
            className="w-full bg-bgl-yellow-400 hover:bg-bgl-yellow-500 text-gray-900 font-bold py-4 text-lg rounded-full shadow-lg transform transition-all duration-200 hover:scale-105"
          >
            LOGIN
          </Button>
        </div>

        {/* Bottom Arrow */}
        <div className="flex justify-center pt-8">
          <div className="animate-bounce">
            <ArrowUp className="h-6 w-6 text-white/60 rotate-180" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Landing;
