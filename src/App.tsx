
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
import Footer from '@/components/Footer';
import Landing from '@/pages/Landing';
import Login from '@/pages/Login';
import Dashboard from '@/pages/Dashboard';
import Products from '@/pages/Products';
import Account from '@/pages/Account';
import Payments from '@/pages/Payments';
import Chat from '@/pages/Chat';
import Offers from '@/pages/Offers';
import AdminPanel from '@/pages/AdminPanel';

const queryClient = new QueryClient();

const AppContent = () => {
  const { isAuthenticated, user } = useAuth();
  const [currentView, setCurrentView] = useState<'landing' | 'login'>('landing');
  const [currentPage, setCurrentPage] = useState(() => {
    // Start admin users on admin panel instead of dashboard
    return user?.role === 'admin' ? 'admin' : 'dashboard';
  });

  // Update currentPage when user changes (e.g., after login)
  React.useEffect(() => {
    if (user?.role === 'admin' && currentPage === 'dashboard') {
      setCurrentPage('admin');
    }
  }, [user?.role, currentPage]);

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
        return <AdminPanel />;
      default:
        return user?.role === 'admin' ? <AdminPanel /> : <Dashboard onNavigate={setCurrentPage} />;
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
          <Footer currentPage={currentPage} onNavigate={setCurrentPage} />
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
