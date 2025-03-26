
import React from 'react';
import { ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';
import { useTrading } from '@/context/TradingContext';
import GlassCard from '../common/GlassCard';
import { formatCurrency, formatPercentage } from '@/utils/tradingUtils';

const PerformanceCard = () => {
  const { activeTrades, tradeHistory, accountStats } = useTrading();
  
  // Calculate daily performance
  const calculatePerformance = () => {
    if (tradeHistory.length === 0) return { profit: 0, percentage: 0 };
    
    const totalProfit = tradeHistory.reduce((acc, trade) => acc + trade.profitLoss, 0);
    const percentage = (totalProfit / (accountStats.balance - totalProfit)) * 100;
    
    return { profit: totalProfit, percentage };
  };
  
  const { profit, percentage } = calculatePerformance();
  
  // Calculate win/loss ratio
  const wins = tradeHistory.filter(trade => trade.profitLoss > 0).length;
  const losses = tradeHistory.filter(trade => trade.profitLoss < 0).length;
  
  // Get largest win and loss
  const largestWin = tradeHistory.length > 0 
    ? Math.max(...tradeHistory.map(trade => trade.profitLoss))
    : 0;
    
  const largestLoss = tradeHistory.length > 0
    ? Math.min(...tradeHistory.map(trade => trade.profitLoss))
    : 0;
  
  return (
    <GlassCard className="p-4">
      <h3 className="text-sm font-semibold mb-3">Performance</h3>
      
      <div className="mb-4">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Net Profit/Loss</span>
          <div className="flex items-center">
            <span className={`text-lg font-bold ${profit >= 0 ? 'text-trading-profit' : 'text-trading-loss'}`}>
              {formatCurrency(profit)}
            </span>
            <span className={`ml-1 text-xs flex items-center ${profit >= 0 ? 'text-trading-profit' : 'text-trading-loss'}`}>
              {profit > 0 ? (
                <ArrowUpRight size={14} />
              ) : profit < 0 ? (
                <ArrowDownRight size={14} />
              ) : (
                <Minus size={14} />
              )}
              {formatPercentage(percentage)}
            </span>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="p-2 rounded bg-gray-50">
          <p className="text-xs text-gray-500">Win Rate</p>
          <p className="text-sm font-semibold">
            {tradeHistory.length > 0 ? ((wins / tradeHistory.length) * 100).toFixed(1) : 0}%
          </p>
        </div>
        
        <div className="p-2 rounded bg-gray-50">
          <p className="text-xs text-gray-500">Trades</p>
          <p className="text-sm font-semibold">
            {tradeHistory.length} <span className="text-xs text-gray-500">completed</span>
          </p>
        </div>
        
        <div className="p-2 rounded bg-gray-50">
          <p className="text-xs text-gray-500">Largest Win</p>
          <p className="text-sm font-semibold text-trading-profit">
            {formatCurrency(largestWin)}
          </p>
        </div>
        
        <div className="p-2 rounded bg-gray-50">
          <p className="text-xs text-gray-500">Largest Loss</p>
          <p className="text-sm font-semibold text-trading-loss">
            {formatCurrency(largestLoss)}
          </p>
        </div>
      </div>
      
      {/* Win/Loss Chart */}
      <div className="mt-4">
        <p className="text-xs text-gray-500 mb-1">Win/Loss Distribution</p>
        <div className="w-full h-3 rounded-full bg-gray-100 overflow-hidden">
          {tradeHistory.length > 0 ? (
            <>
              <div 
                className="h-full bg-trading-profit"
                style={{ width: `${(wins / tradeHistory.length) * 100}%`, float: 'left' }}
              />
              <div 
                className="h-full bg-trading-loss"
                style={{ width: `${(losses / tradeHistory.length) * 100}%`, float: 'left' }}
              />
            </>
          ) : (
            <div className="h-full bg-gray-300 w-full animate-pulse" />
          )}
        </div>
        <div className="flex justify-between mt-1 text-xs text-gray-500">
          <span>{wins} Wins</span>
          <span>{losses} Losses</span>
        </div>
      </div>
    </GlassCard>
  );
};

export default PerformanceCard;
