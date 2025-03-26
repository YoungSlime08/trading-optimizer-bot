
import React from 'react';
import { useTrading } from '@/context/TradingContext';
import { formatCurrency } from '@/utils/tradingUtils';
import GlassCard from '../common/GlassCard';
import { Button } from '@/components/ui/button';
import { ArrowUpDown, X, TrendingUp, TrendingDown } from 'lucide-react';

const StatisticsCard = () => {
  const { activeTrades, closeTradeById, settings } = useTrading();
  
  if (activeTrades.length === 0) {
    return (
      <GlassCard variant="elevated" className="p-4 h-72 md:h-64">
        <h3 className="text-lg font-semibold mb-2">Active Trades</h3>
        <div className="flex items-center justify-center h-48 text-gray-400">
          <div className="text-center">
            <ArrowUpDown className="mx-auto h-8 w-8 mb-2 opacity-30" />
            <p>No active trades</p>
            <p className="text-xs mt-1">Execute a trade to see it here</p>
          </div>
        </div>
      </GlassCard>
    );
  }
  
  return (
    <GlassCard variant="elevated" className="p-4 h-72 md:h-64 overflow-y-auto">
      <h3 className="text-lg font-semibold mb-2">Active Trades</h3>
      <div className="space-y-3">
        {activeTrades.map(trade => {
          const isProfit = trade.profitLoss > 0;
          
          return (
            <div 
              key={trade.id}
              className="flex items-center justify-between p-2 rounded-md bg-gray-50 border border-gray-100"
            >
              <div className="flex items-center">
                {trade.direction === 'long' ? (
                  <TrendingUp className="h-4 w-4 text-trading-profit mr-2" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-trading-loss mr-2" />
                )}
                <div>
                  <p className="text-sm font-medium">
                    {trade.direction === 'long' ? 'Buy' : 'Sell'} {settings.selectedCurrency}
                  </p>
                  <div className="flex items-center text-xs text-gray-500 space-x-2">
                    <span>Entry: {formatCurrency(trade.entryPrice)}</span>
                    <span>•</span>
                    <span>TP Hits: {trade.takeProfitHits}/{settings.maxTakeProfit}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="text-right">
                  <p className={`text-sm font-semibold ${isProfit ? 'text-trading-profit' : 'text-trading-loss'}`}>
                    {isProfit ? '+' : ''}{formatCurrency(trade.profitLoss)}
                  </p>
                  <p className={`text-xs ${isProfit ? 'text-trading-profit' : 'text-trading-loss'}`}>
                    {isProfit ? '+' : ''}{trade.profitLossPercent.toFixed(2)}%
                  </p>
                </div>
                
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-8 w-8 p-0"
                  onClick={() => closeTradeById(trade.id)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </GlassCard>
  );
};

export default StatisticsCard;
