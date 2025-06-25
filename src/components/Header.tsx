
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Menu, User, LogOut } from 'lucide-react';
import Logo from './Logo';

interface HeaderProps {
  onNavigate: (page: string) => void;
}

const Header: React.FC<HeaderProps> = ({ onNavigate }) => {
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm border-b p-4 flex items-center justify-between">
      <div className="flex items-center">
        <SidebarTrigger className="mr-4 md:hidden">
          <Menu className="h-5 w-5" />
        </SidebarTrigger>
        <button 
          onClick={() => onNavigate('dashboard')}
          className="hover:opacity-80 transition-opacity"
        >
          <Logo className="h-12" />
        </button>
      </div>
      
      <div className="flex items-center space-x-4">
        <div className="hidden md:block text-right">
          <p className="text-sm font-medium text-gray-900">{user?.businessName}</p>
          <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
        </div>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative rounded-full">
              <div className="w-8 h-8 bg-bgl-blue-600 rounded-full flex items-center justify-center">
                <User className="h-4 w-4 text-white" />
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 bg-white border shadow-lg z-50">
            <DropdownMenuItem 
              onClick={() => onNavigate('account')}
              className="cursor-pointer hover:bg-gray-50"
            >
              <User className="mr-2 h-4 w-4" />
              My Account
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={logout}
              className="cursor-pointer hover:bg-gray-50 text-red-600"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default Header;
