
import React, { useState } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { CartProvider } from '@/contexts/CartContext';
import AppSidebar from '@/components/AppSidebar';
import Landing from '@/pages/Landing';
import Login from '@/pages/Login';
import Dashboard from '@/pages/Dashboard';
import Products from '@/pages/Products';
import Account from '@/pages/Account';
import { Menu } from 'lucide-react';

const queryClient = new QueryClient();

const AppContent = () => {
  const { isAuthenticated } = useAuth();
  const [currentView, setCurrentView] = useState<'landing' | 'login'>('landing');
  const [currentPage, setCurrentPage] = useState('dashboard');

  if (!isAuthenticated) {
    if (currentView === 'landing') {
      return <Landing onNavigateToLogin={() => setCurrentView('login')} />;
    } else {
      return <Login onBack={() => setCurrentView('landing')} />;
    }
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />;
      case 'products':
        return <Products />;
      case 'account':
        return <Account />;
      case 'payments':
        return (
          <div className="p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">Payments</h2>
            <p className="text-gray-600">Payment management coming soon!</p>
          </div>
        );
      case 'offers':
        return (
          <div className="p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">Special Offers</h2>
            <p className="text-gray-600">Special offers section coming soon!</p>
          </div>
        );
      case 'chat':
        return (
          <div className="p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">Chat with Supplier</h2>
            <p className="text-gray-600">Chat functionality coming soon!</p>
          </div>
        );
      case 'admin':
        return (
          <div className="p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">Admin Panel</h2>
            <p className="text-gray-600">Admin panel coming soon!</p>
          </div>
        );
      default:
        return <Dashboard />;
    }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gray-50">
        <AppSidebar 
          currentPage={currentPage} 
          onNavigate={setCurrentPage} 
        />
        <main className="flex-1 overflow-auto">
          <header className="bg-white shadow-sm border-b p-4 flex items-center">
            <SidebarTrigger className="mr-4">
              <Menu className="h-5 w-5" />
            </SidebarTrigger>
            <h1 className="text-xl font-semibold text-gray-900">
              Big Game Logistics
            </h1>
          </header>
          <div className="p-6">
            {renderPage()}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <CartProvider>
          <Toaster />
          <Sonner />
          <AppContent />
        </CartProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
