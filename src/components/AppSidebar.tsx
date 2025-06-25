
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { Home, ShoppingCart, User, CreditCard, Tag, MessageCircle, Shield, LogOut } from 'lucide-react';
import Logo from './Logo';

interface AppSidebarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

const AppSidebar: React.FC<AppSidebarProps> = ({ currentPage, onNavigate }) => {
  const { user, logout } = useAuth();
  const { totalItems } = useCart();
  const { setOpenMobile } = useSidebar();

  const menuItems = [
    {
      title: "Dashboard",
      page: "dashboard",
      icon: Home,
      roles: ['wholesaler', 'retailer', 'admin']
    },
    {
      title: "Products & Orders",
      page: "products",
      icon: ShoppingCart,
      roles: ['wholesaler', 'retailer'],
      badge: totalItems > 0 ? totalItems : undefined
    },
    {
      title: "My Account",
      page: "account",
      icon: User,
      roles: ['wholesaler', 'retailer', 'admin']
    },
    {
      title: "Payments",
      page: "payments",
      icon: CreditCard,
      roles: ['wholesaler', 'retailer']
    },
    {
      title: "Special Offers",
      page: "offers",
      icon: Tag,
      roles: ['wholesaler', 'retailer']
    },
    {
      title: "Chat with Supplier",
      page: "chat",
      icon: MessageCircle,
      roles: ['wholesaler', 'retailer']
    },
    {
      title: "Admin Panel",
      page: "admin",
      icon: Shield,
      roles: ['admin']
    }
  ];

  const filteredMenuItems = menuItems.filter(item => 
    user && item.roles.includes(user.role)
  );

  const handleNavigation = (page: string) => {
    onNavigate(page);
    setOpenMobile(false); // Close mobile sidebar after navigation
  };

  return (
    <Sidebar className="bg-gradient-to-b from-blue-900 to-blue-800 text-white border-r border-blue-700">
      <SidebarHeader className="p-4 border-b border-blue-700">
        <Logo className="mx-auto" />
        <div className="text-center mt-4">
          <p className="text-sm text-blue-200">Welcome back,</p>
          <p className="font-semibold text-white">{user?.businessName}</p>
          <p className="text-xs text-blue-300 capitalize">{user?.role}</p>
        </div>
      </SidebarHeader>
      
      <SidebarContent className="px-2">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {filteredMenuItems.map((item) => (
                <SidebarMenuItem key={item.page}>
                  <SidebarMenuButton 
                    onClick={() => handleNavigation(item.page)}
                    className={`w-full text-left hover:bg-white/20 transition-colors group relative ${
                      currentPage === item.page 
                        ? 'bg-white/25 text-white font-semibold' 
                        : 'text-white hover:text-white'
                    }`}
                  >
                    <item.icon className="h-5 w-5 text-white" />
                    <span className="ml-3 text-white font-medium">{item.title}</span>
                    {item.badge && (
                      <span className="ml-auto bg-bgl-yellow-400 text-blue-900 text-xs rounded-full px-2 py-1 font-semibold">
                        {item.badge}
                      </span>
                    )}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4 border-t border-blue-700">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton 
              onClick={logout}
              className="w-full text-left hover:bg-red-500/20 text-red-200 hover:text-white transition-colors"
            >
              <LogOut className="h-5 w-5" />
              <span className="ml-3">Logout</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebar;
