
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Home, ShoppingCart, User, MessageCircle, Shield } from 'lucide-react';

interface FooterProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

const Footer: React.FC<FooterProps> = ({ currentPage, onNavigate }) => {
  const { user } = useAuth();

  const footerItems = [
    {
      title: "Dashboard",
      page: "dashboard",
      icon: Home,
      roles: ['wholesaler', 'retailer']
    },
    {
      title: "Products",
      page: "products",
      icon: ShoppingCart,
      roles: ['wholesaler', 'retailer']
    },
    {
      title: "Account",
      page: "account",
      icon: User,
      roles: ['wholesaler', 'retailer', 'admin']
    },
    {
      title: "Chat",
      page: "chat",
      icon: MessageCircle,
      roles: ['wholesaler', 'retailer', 'admin']
    },
    {
      title: "Admin",
      page: "admin",
      icon: Shield,
      roles: ['admin']
    }
  ];

  const filteredItems = footerItems.filter(item => 
    user && item.roles.includes(user.role)
  );

  return (
    <footer className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-200 px-4 py-2 md:hidden">
      <div className="flex justify-around items-center max-w-sm mx-auto">
        {filteredItems.map((item) => (
          <button
            key={item.page}
            onClick={() => onNavigate(item.page)}
            className={`flex flex-col items-center space-y-1 p-2 rounded-lg transition-colors ${
              currentPage === item.page
                ? 'text-bgl-blue-600 bg-bgl-blue-50'
                : 'text-gray-500 hover:text-bgl-blue-600'
            }`}
          >
            <item.icon className="h-5 w-5" />
            <span className="text-xs font-medium">{item.title}</span>
          </button>
        ))}
      </div>
    </footer>
  );
};

export default Footer;
