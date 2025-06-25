
import React, { useState } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { CartProvider } from '@/contexts/CartContext';
import AppSidebar from '@/components/AppSidebar';
import Header from '@/components/Header';
import Landing from '@/pages/Landing';
import Login from '@/pages/Login';
import Dashboard from '@/pages/Dashboard';
import Products from '@/pages/Products';
import Account from '@/pages/Account';
import Payments from '@/pages/Payments';
import Chat from '@/pages/Chat';
import Offers from '@/pages/Offers';

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
        return <Dashboard onNavigate={setCurrentPage} />;
      case 'products':
        return <Products />;
      case 'account':
        return <Account />;
      case 'payments':
        return <Payments />;
      case 'offers':
        return <Offers />;
      case 'chat':
        return <Chat />;
      case 'admin':
        return (
          <div className="p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">Admin Panel</h2>
            <p className="text-gray-600">Admin panel coming soon!</p>
          </div>
        );
      default:
        return <Dashboard onNavigate={setCurrentPage} />;
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
          <Header onNavigate={setCurrentPage} />
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
