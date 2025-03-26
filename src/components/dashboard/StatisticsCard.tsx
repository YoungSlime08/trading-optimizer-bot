
import React from 'react';
import { useTrading } from '@/context/TradingContext';
import GlassCard from '../common/GlassCard';
import { formatCurrency, formatPercentage } from '@/utils/tradingUtils';

const StatisticsCard = () => {
  const { activeTrades, tradeHistory } = useTrading();
  
  // Current open trades summary
  const totalOpenPositions = activeTrades.length;
  const totalOpenProfitLoss = activeTrades.reduce((acc, trade) => acc + trade.profitLoss, 0);
  const openProfitable = activeTrades.filter(trade => trade.profitLoss > 0).length;
  const openLosing = activeTrades.filter(trade => trade.profitLoss < 0).length;
  
  return (
    <GlassCard className="p-4">
      <h3 className="text-sm font-semibold mb-3">Open Positions</h3>
      
      {activeTrades.length > 0 ? (
        <>
          <div className="mb-3 flex justify-between items-center">
            <span className="text-sm text-gray-600">Unrealized P/L</span>
            <span className={`font-bold ${totalOpenProfitLoss >= 0 ? 'text-trading-profit' : 'text-trading-loss'}`}>
              {formatCurrency(totalOpenProfitLoss)}
            </span>
          </div>
          
          <div className="space-y-3">
            {activeTrades.map((trade) => (
              <div 
                key={trade.id} 
                className="p-2 rounded-md border border-gray-100 bg-white shadow-sm"
              >
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-2">
                    <div 
                      className={`w-2 h-8 rounded-sm ${
                        trade.direction === 'long' ? 'bg-trading-profit' : 'bg-trading-loss'
                      }`}
                    />
                    <div>
                      <p className="text-xs font-medium">
                        {trade.direction === 'long' ? 'Long' : 'Short'} @ {formatCurrency(trade.entryPrice)}
                      </p>
                      <div className="flex items-center space-x-3 text-2xs text-gray-500">
                        <span>SL: {formatCurrency(trade.stopLoss)}</span>
                        <span>TP: {formatCurrency(trade.takeProfit)}</span>
                        <span>TP Hits: {trade.takeProfitHits}/{trade.maxTakeProfit}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`text-sm font-bold ${
                      trade.profitLoss >= 0 ? 'text-trading-profit' : 'text-trading-loss'
                    }`}>
                      {formatCurrency(trade.profitLoss)}
                    </p>
                    <p className="text-2xs text-gray-500">
                      {formatPercentage(trade.profitLossPercent)}
                    </p>
                  </div>
                </div>
                
                {/* Trade progress bar */}
                <div className="mt-2 w-full h-1 bg-gray-100 rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${trade.profitLoss >= 0 ? 'bg-trading-profit' : 'bg-trading-loss'}`}
                    style={{ 
                      width: `${Math.min(Math.abs(trade.profitLossPercent / trade.takeProfitPercent) * 100, 100)}%` 
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="text-center py-6">
          <p className="text-sm text-gray-500">No open positions</p>
          <p className="text-xs text-gray-400 mt-1">Execute a trade to see positions here</p>
        </div>
      )}
    </GlassCard>
  );
};

export default StatisticsCard;
