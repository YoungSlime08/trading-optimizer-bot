
import React from 'react';
import { useTrading } from '@/context/TradingContext';
import PerformanceCard from './PerformanceCard';
import StatisticsCard from './StatisticsCard';
import TradingPanel from '../trading/TradingPanel';
import TradingChart from '../trading/TradingChart';
import MetaTraderConnect from '../trading/MetaTraderConnect';

const Dashboard = () => {
  const { activeTrades } = useTrading();
  
  // Get the first active trade for chart references
  const firstTrade = activeTrades.length > 0 ? activeTrades[0] : null;
  
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
