
import React from 'react';
import { TradingProvider } from '@/context/TradingContext';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Dashboard from '@/components/dashboard/Dashboard';

const Index = () => {
  return (
    <TradingProvider>
      <div className="min-h-screen flex flex-col bg-gradient-to-b from-blue-50 to-gray-50">
        <Header />
        <main className="flex-1 px-4 py-6 md:py-8 md:px-8 max-w-7xl mx-auto w-full">
          <Dashboard />
        </main>
        <Footer />
      </div>
    </TradingProvider>
  );
};

export default Index;
