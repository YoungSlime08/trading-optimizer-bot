
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  TradeSettings, 
  TradeResult, 
  Indicator, 
  AccountStats,
  defaultTradingSettings,
  generateIndicators
} from '@/utils/tradingUtils';

interface TradingContextType {
  settings: TradeSettings;
  updateSettings: (newSettings: Partial<TradeSettings>) => void;
  accountStats: AccountStats;
  activeTrades: TradeResult[];
  tradeHistory: TradeResult[];
  indicators: Indicator[];
  executeNewTrade: (direction: 'long' | 'short', price: number) => void;
  closeTradeById: (id: string) => void;
  resetSimulation: () => void;
}

const initialAccountStats: AccountStats = {
  balance: 10000,
  equity: 10000,
  openPositions: 0,
  winRate: 0,
  profitFactor: 0,
};

const TradingContext = createContext<TradingContextType | undefined>(undefined);

export const TradingProvider = ({ children }: { children: ReactNode }) => {
  const [settings, setSettings] = useState<TradeSettings>(defaultTradingSettings);
  const [accountStats, setAccountStats] = useState<AccountStats>(initialAccountStats);
  const [activeTrades, setActiveTrades] = useState<TradeResult[]>([]);
  const [tradeHistory, setTradeHistory] = useState<TradeResult[]>([]);
  const [indicators, setIndicators] = useState<Indicator[]>(generateIndicators());

  // Update settings
  const updateSettings = (newSettings: Partial<TradeSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  // Execute a new trade
  const executeNewTrade = (direction: 'long' | 'short', price: number) => {
    // Calculate position size based on risk percentage
    const riskAmount = accountStats.balance * (settings.riskPercentage / 100);
    const stopLossPrice = direction === 'long' 
      ? price * (1 - settings.stopLossPercent / 100)
      : price * (1 + settings.stopLossPercent / 100);
    
    const riskPerShare = Math.abs(price - stopLossPrice);
    const shares = riskAmount / riskPerShare;
    
    const takeProfit = direction === 'long'
      ? price * (1 + settings.takeProfitPercent / 100)
      : price * (1 - settings.takeProfitPercent / 100);
    
    const newTrade: TradeResult = {
      id: Date.now().toString(),
      entryPrice: price,
      currentPrice: price,
      direction,
      quantity: shares,
      status: 'open',
      profitLoss: 0,
      profitLossPercent: 0,
      stopLoss: stopLossPrice,
      takeProfit,
      timestamp: Date.now(),
      takeProfitHits: 0,
    };
    
    setActiveTrades(prev => [...prev, newTrade]);
    setAccountStats(prev => ({
      ...prev,
      openPositions: prev.openPositions + 1,
      equity: prev.equity - riskAmount * 0.01, // Simulate small commission
    }));
  };

  // Close a trade
  const closeTradeById = (id: string) => {
    const tradeIndex = activeTrades.findIndex(trade => trade.id === id);
    if (tradeIndex === -1) return;
    
    const closedTrade = { ...activeTrades[tradeIndex], status: 'closed' };
    
    // Update account stats
    setAccountStats(prev => {
      const newBalance = prev.balance + closedTrade.profitLoss;
      
      // Calculate new win rate
      const wins = tradeHistory.filter(t => t.profitLoss > 0).length + (closedTrade.profitLoss > 0 ? 1 : 0);
      const totalTrades = tradeHistory.length + 1;
      const winRate = totalTrades > 0 ? (wins / totalTrades) * 100 : 0;
      
      // Calculate profit factor
      const grossProfit = tradeHistory.reduce((sum, trade) => 
        trade.profitLoss > 0 ? sum + trade.profitLoss : sum, 0
      ) + (closedTrade.profitLoss > 0 ? closedTrade.profitLoss : 0);
      
      const grossLoss = Math.abs(tradeHistory.reduce((sum, trade) => 
        trade.profitLoss < 0 ? sum + trade.profitLoss : sum, 0
      ) + (closedTrade.profitLoss < 0 ? closedTrade.profitLoss : 0));
      
      const profitFactor = grossLoss > 0 ? grossProfit / grossLoss : grossProfit > 0 ? 999 : 0;
      
      return {
        balance: newBalance,
        equity: newBalance - (prev.openPositions - 1) * 0.01 * newBalance,
        openPositions: prev.openPositions - 1,
        winRate,
        profitFactor,
      };
    });
    
    // Remove from active and add to history
    setActiveTrades(prev => prev.filter(t => t.id !== id));
    setTradeHistory(prev => [...prev, closedTrade]);
  };

  // Reset the simulation
  const resetSimulation = () => {
    setAccountStats(initialAccountStats);
    setActiveTrades([]);
    setTradeHistory([]);
    setSettings(defaultTradingSettings);
  };

  // Refresh indicators periodically (for demo)
  useEffect(() => {
    const interval = setInterval(() => {
      setIndicators(generateIndicators());
    }, 15000);
    
    return () => clearInterval(interval);
  }, []);

  // Update current prices and check for stop loss / take profit
  useEffect(() => {
    if (activeTrades.length === 0) return;
    
    const interval = setInterval(() => {
      setActiveTrades(prev => prev.map(trade => {
        // Simulate price movement for demo
        const priceChange = (Math.random() - 0.48) * 0.5; // Slightly biased toward up
        const newPrice = trade.currentPrice * (1 + priceChange / 100);
        
        // Calculate P/L
        const priceDiff = trade.direction === 'long' 
          ? newPrice - trade.entryPrice
          : trade.entryPrice - newPrice;
        
        const profitLoss = priceDiff * trade.quantity;
        const profitLossPercent = (priceDiff / trade.entryPrice) * 100;
        
        // Check for take profit hit
        let takeProfitHits = trade.takeProfitHits;
        let takeProfit = trade.takeProfit;
        let stopLoss = trade.stopLoss;
        let quantity = trade.quantity;
        
        if (trade.direction === 'long' && newPrice >= trade.takeProfit && takeProfitHits < settings.maxTakeProfit) {
          // Take partial profit
          takeProfitHits++;
          
          // Only reduce position size if it's not the final take profit
          if (takeProfitHits < settings.maxTakeProfit) {
            // Remove 30% of position
            quantity = quantity * (1 - settings.partialTakePercentage / 100);
            
            // Move stop loss to entry price
            stopLoss = trade.entryPrice;
            
            // Increase take profit by 50%
            const tpDistance = trade.takeProfit - trade.entryPrice;
            takeProfit = trade.takeProfit + (tpDistance * 0.5);
          }
        } else if (trade.direction === 'short' && newPrice <= trade.takeProfit && takeProfitHits < settings.maxTakeProfit) {
          // Take partial profit for short
          takeProfitHits++;
          
          // Only reduce position size if it's not the final take profit
          if (takeProfitHits < settings.maxTakeProfit) {
            // Remove 30% of position
            quantity = quantity * (1 - settings.partialTakePercentage / 100);
            
            // Move stop loss to entry price
            stopLoss = trade.entryPrice;
            
            // Increase take profit by 50%
            const tpDistance = trade.entryPrice - trade.takeProfit;
            takeProfit = trade.takeProfit - (tpDistance * 0.5);
          }
        }
        
        return {
          ...trade,
          currentPrice: newPrice,
          profitLoss,
          profitLossPercent,
          takeProfitHits,
          takeProfit,
          stopLoss,
          quantity,
        };
      }));
      
      // Check for stop losses and close trades if needed
      setActiveTrades(prev => {
        const tradesToClose: string[] = [];
        
        prev.forEach(trade => {
          if (
            (trade.direction === 'long' && trade.currentPrice <= trade.stopLoss) ||
            (trade.direction === 'short' && trade.currentPrice >= trade.stopLoss) ||
            (trade.takeProfitHits >= settings.maxTakeProfit)
          ) {
            tradesToClose.push(trade.id);
          }
        });
        
        // Close the trades
        tradesToClose.forEach(id => closeTradeById(id));
        
        // Return the remaining trades
        return prev.filter(trade => !tradesToClose.includes(trade.id));
      });
    }, 1000);
    
    return () => clearInterval(interval);
  }, [activeTrades, settings]);

  const value = {
    settings,
    updateSettings,
    accountStats,
    activeTrades,
    tradeHistory,
    indicators,
    executeNewTrade,
    closeTradeById,
    resetSimulation,
  };

  return (
    <TradingContext.Provider value={value}>
      {children}
    </TradingContext.Provider>
  );
};

export const useTrading = () => {
  const context = useContext(TradingContext);
  if (context === undefined) {
    throw new Error('useTrading must be used within a TradingProvider');
  }
  return context;
};
