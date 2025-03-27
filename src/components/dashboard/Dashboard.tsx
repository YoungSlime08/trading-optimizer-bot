
import React, { useState, useEffect } from 'react';
import { useTrading } from '@/context/TradingContext';
import PerformanceCard from './PerformanceCard';
import StatisticsCard from './StatisticsCard';
import TradingPanel from '../trading/TradingPanel';
import TradingChart from '../trading/TradingChart';
import MetaTraderConnect from '../trading/MetaTraderConnect';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useIsMobile } from '@/hooks/use-mobile';

const Dashboard = () => {
  const { activeTrades } = useTrading();
  const isMobile = useIsMobile();
  const [activeTab, setActiveTab] = useState<string>('panel');
  
  // Get the first active trade for chart references
  const firstTrade = activeTrades.length > 0 ? activeTrades[0] : null;
  
  // Effect to detect if running as a mobile app
  useEffect(() => {
    // Check if running as a standalone PWA or mobile app
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
    
    if (isStandalone) {
      console.log('Running as installed app');
      // You can add specific app behaviors here
    }
  }, []);
  
  if (isMobile) {
    return (
      <div className="space-y-4">
        <Tabs defaultValue="panel" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="panel">Trading</TabsTrigger>
            <TabsTrigger value="chart">Chart</TabsTrigger>
            <TabsTrigger value="stats">Stats</TabsTrigger>
          </TabsList>
          
          <TabsContent value="panel" className="mt-0">
            <TradingPanel />
            {activeTab === 'panel' && (
              <div className="mt-4">
                <MetaTraderConnect />
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="chart" className="mt-0">
            <TradingChart 
              activeStopLoss={firstTrade?.stopLoss}
              activeTakeProfit={firstTrade?.takeProfit}
              entryPrice={firstTrade?.entryPrice}
            />
          </TabsContent>
          
          <TabsContent value="stats" className="mt-0 space-y-4">
            <PerformanceCard />
            <StatisticsCard />
          </TabsContent>
        </Tabs>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-7 gap-6">
        <div className="md:col-span-3">
          <TradingPanel />
          <div className="mt-4">
            <MetaTraderConnect />
          </div>
        </div>
        <div className="md:col-span-4">
          <TradingChart 
            activeStopLoss={firstTrade?.stopLoss}
            activeTakeProfit={firstTrade?.takeProfit}
            entryPrice={firstTrade?.entryPrice}
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <PerformanceCard />
        <StatisticsCard />
      </div>
    </div>
  );
};

export default Dashboard;
