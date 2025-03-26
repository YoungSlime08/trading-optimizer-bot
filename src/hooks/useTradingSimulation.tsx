
import { useState, useEffect } from 'react';
import { TradeSettings, TradeResult, defaultTradingSettings } from '@/utils/tradingUtils';

interface UseTradingSimulationProps {
  initialBalance?: number;
}

export const useTradingSimulation = ({ initialBalance = 10000 }: UseTradingSimulationProps = {}) => {
  const [balance, setBalance] = useState(initialBalance);
  const [equity, setEquity] = useState(initialBalance);
  const [settings, setSettings] = useState<TradeSettings>(defaultTradingSettings);
  const [activeTrades, setActiveTrades] = useState<TradeResult[]>([]);
  const [tradeHistory, setTradeHistory] = useState<TradeResult[]>([]);
  
  // Update equity based on active trades
  useEffect(() => {
    if (activeTrades.length === 0) {
      setEquity(balance);
      return;
    }
    
    const unrealizedPnL = activeTrades.reduce((acc, trade) => acc + trade.profitLoss, 0);
    setEquity(balance + unrealizedPnL);
  }, [activeTrades, balance]);
  
  // Update settings
  const updateSettings = (newSettings: Partial<TradeSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };
  
  // Execute new trade
  const executeTrade = (direction: 'long' | 'short', price: number) => {
    // Calculate position size based on risk percentage
    const riskAmount = balance * (settings.riskPercentage / 100);
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
  };
  
  // Close trade
  const closeTrade = (id: string) => {
    const trade = activeTrades.find(t => t.id === id);
    if (!trade) return;
    
    // Update balance
    setBalance(prev => prev + trade.profitLoss);
    
    // Move to history
    setTradeHistory(prev => [...prev, { ...trade, status: 'closed' }]);
    
    // Remove from active
    setActiveTrades(prev => prev.filter(t => t.id !== id));
  };
  
  // Reset simulation
  const resetSimulation = () => {
    setBalance(initialBalance);
    setEquity(initialBalance);
    setActiveTrades([]);
    setTradeHistory([]);
    setSettings(defaultTradingSettings);
  };
  
  return {
    balance,
    equity,
    settings,
    activeTrades,
    tradeHistory,
    updateSettings,
    executeTrade,
    closeTrade,
    resetSimulation,
  };
};
