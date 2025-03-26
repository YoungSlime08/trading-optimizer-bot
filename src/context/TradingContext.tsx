import React, { createContext, useContext, useState, useEffect, ReactNode, useRef } from 'react';
import { 
  TradeSettings, 
  TradeResult, 
  Indicator, 
  AccountStats,
  Candlestick,
  Currency,
  defaultTradingSettings,
  generateIndicators,
  generateCandlestickSeries,
  availableCurrencies,
  analyzeMarketConditions
} from '@/utils/tradingUtils';
import { metaTraderService } from '@/services/metaTraderService';
import { toast } from '@/components/ui/use-toast';

interface TradingContextType {
  settings: TradeSettings;
  updateSettings: (newSettings: Partial<TradeSettings>) => void;
  accountStats: AccountStats;
  activeTrades: TradeResult[];
  tradeHistory: TradeResult[];
  indicators: Indicator[];
  candlestickData: Candlestick[];
  availableCurrencies: Currency[];
  executeNewTrade: (direction: 'long' | 'short', price: number) => void;
  closeTradeById: (id: string) => void;
  resetSimulation: () => void;
  connectToMetaTrader: (endpoint: string) => Promise<boolean>;
  disconnectFromMetaTrader: () => void;
  isMetaTraderConnected: () => boolean;
  executeMT5Trade: (direction: 'long' | 'short', price: number) => Promise<boolean>;
  toggleAutoTrading: (enabled: boolean) => void;
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
  const [settings, setSettings] = useState<TradeSettings>({
    ...defaultTradingSettings,
    maxTrades: 10, // Default max trades
    accountSize: 'medium', // Default account size
    initialBalance: 100, // Default initial balance
    chartSource: 'internal' // Default chart source
  });
  const [accountStats, setAccountStats] = useState<AccountStats>({
    ...initialAccountStats,
    balance: settings.initialBalance,
    equity: settings.initialBalance
  });
  
  const [activeTrades, setActiveTrades] = useState<TradeResult[]>([]);
  const [tradeHistory, setTradeHistory] = useState<TradeResult[]>([]);
  const [indicators, setIndicators] = useState<Indicator[]>(generateIndicators());
  const [candlestickData, setCandlestickData] = useState<Candlestick[]>(
    generateCandlestickSeries(100, 20, 0.01)
  );
  
  // Auto-trading interval reference
  const autoTradingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Update settings
  const updateSettings = (newSettings: Partial<TradeSettings>) => {
    setSettings(prev => {
      const updated = { ...prev, ...newSettings };
      
      // If initial balance is updated, update the account stats
      if (newSettings.initialBalance !== undefined && prev.initialBalance !== newSettings.initialBalance) {
        setAccountStats(prevStats => ({
          ...prevStats,
          balance: newSettings.initialBalance as number,
          equity: newSettings.initialBalance as number
        }));
      }
      
      return updated;
    });
  };

  // Toggle auto-trading
  const toggleAutoTrading = (enabled: boolean) => {
    updateSettings({ autoTrading: enabled });
    
    if (enabled) {
      toast({
        title: "Auto-Trading Enabled",
        description: `Bot will execute trades with ${settings.minSignalStrength * 100}% minimum confidence`,
      });
    } else {
      toast({
        title: "Auto-Trading Disabled",
        description: "Automatic trading has been stopped",
      });
    }
  };

  // Connect to MetaTrader 5
  const connectToMetaTrader = async (endpoint: string): Promise<boolean> => {
    const success = await metaTraderService.connect(endpoint);
    if (success) {
      updateSettings({ metaTraderEnabled: true });
    }
    return success;
  };

  // Disconnect from MetaTrader 5
  const disconnectFromMetaTrader = () => {
    metaTraderService.disconnect();
    updateSettings({ metaTraderEnabled: false });
  };

  // Check if connected to MetaTrader 5
  const isMetaTraderConnected = (): boolean => {
    return metaTraderService.isConnected();
  };

  // Execute a trade through MetaTrader 5
  const executeMT5Trade = async (direction: 'long' | 'short', price: number): Promise<boolean> => {
    if (!metaTraderService.isConnected()) {
      return false;
    }

    const riskAmount = accountStats.balance * (settings.riskPercentage / 100);
    const stopLossPrice = direction === 'long' 
      ? price * (1 - settings.stopLossPercent / 100)
      : price * (1 + settings.stopLossPercent / 100);
    
    const takeProfitPrice = direction === 'long'
      ? price * (1 + settings.takeProfitPercent / 100)
      : price * (1 - settings.takeProfitPercent / 100);
    
    // Calculate position size based on account currency and symbol
    const volume = (riskAmount / (price * 0.01)).toFixed(2);
    
    try {
      const response = direction === 'long' 
        ? await metaTraderService.buyOrder(settings.selectedCurrency, parseFloat(volume), stopLossPrice, takeProfitPrice)
        : await metaTraderService.sellOrder(settings.selectedCurrency, parseFloat(volume), stopLossPrice, takeProfitPrice);
      
      return response.success;
    } catch (error) {
      console.error('Error executing MT5 trade:', error);
      return false;
    }
  };

  // Execute a new trade
  const executeNewTrade = (direction: 'long' | 'short', price: number) => {
    // Check if we've reached the maximum number of trades
    if (activeTrades.length >= settings.maxTrades) {
      toast({
        title: "Maximum trades reached",
        description: `You can have maximum ${settings.maxTrades} trades based on your current settings.`,
        variant: "destructive",
      });
      return;
    }
    
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
    
    const closedTrade = { ...activeTrades[tradeIndex], status: 'closed' as const };
    
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

  // Effect for auto-trading
  useEffect(() => {
    if (settings.autoTrading) {
      // Clear any existing interval
      if (autoTradingIntervalRef.current) {
        clearInterval(autoTradingIntervalRef.current);
      }
      
      // Set new interval
      autoTradingIntervalRef.current = setInterval(() => {
        // Don't execute more trades if we've reached the maximum
        if (activeTrades.length >= settings.maxTrades) {
          return;
        }
        
        // Filter indicators based on enabled settings
        const filteredIndicators = indicators.filter(indicator => {
          if (indicator.name.includes('SMA') && !settings.enabledIndicators.sma) return false;
          if (indicator.name.includes('EMA') && !settings.enabledIndicators.ema) return false;
          if (indicator.name.includes('RSI') && !settings.enabledIndicators.rsi) return false;
          if (indicator.name.includes('MACD') && !settings.enabledIndicators.macd) return false;
          if (indicator.name.includes('Bollinger') && !settings.enabledIndicators.bollinger) return false;
          if (indicator.name.includes('Parabolic') && !settings.enabledIndicators.parabolicSar) return false;
          return true;
        });
        
        // Don't proceed if we have fewer than 2 indicators enabled
        if (filteredIndicators.length < 2) {
          return;
        }
        
        // Analyze market conditions
        const analysis = analyzeMarketConditions(filteredIndicators);
        
        // Check if we should execute a trade
        if (
          analysis.confidence >= settings.minSignalStrength && 
          analysis.confirmedCount >= settings.confirmationCount &&
          analysis.decision !== 'neutral'
        ) {
          // Use the last candle close price as the current price
          const currentPrice = candlestickData[candlestickData.length - 1].close;
          
          // Execute trade
          const direction = analysis.decision === 'buy' ? 'long' : 'short';
          
          if (settings.metaTraderEnabled && isMetaTraderConnected()) {
            executeMT5Trade(direction, currentPrice).then(success => {
              if (success) {
                toast({
                  title: "Auto-Trade Executed via MT5",
                  description: `${direction === 'long' ? 'Buy' : 'Sell'} ${settings.selectedCurrency} at ${currentPrice.toFixed(2)} with ${(analysis.confidence * 100).toFixed(0)}% confidence. ${analysis.reason}`,
                });
              }
            });
          } else {
            executeNewTrade(direction, currentPrice);
            toast({
              title: "Auto-Trade Executed",
              description: `${direction === 'long' ? 'Buy' : 'Sell'} ${settings.selectedCurrency} at ${currentPrice.toFixed(2)} with ${(analysis.confidence * 100).toFixed(0)}% confidence`,
            });
          }
        }
      }, settings.tradingInterval * 1000);
      
      // Clean up on unmount or when auto-trading is disabled
      return () => {
        if (autoTradingIntervalRef.current) {
          clearInterval(autoTradingIntervalRef.current);
          autoTradingIntervalRef.current = null;
        }
      };
    } else if (autoTradingIntervalRef.current) {
      // Clear interval if auto-trading is disabled
      clearInterval(autoTradingIntervalRef.current);
      autoTradingIntervalRef.current = null;
    }
  }, [
    settings.autoTrading, 
    settings.tradingInterval, 
    settings.minSignalStrength, 
    settings.confirmationCount, 
    settings.enabledIndicators, 
    settings.maxTrades, 
    indicators
  ]);

  // Refresh indicators periodically (for demo)
  useEffect(() => {
    const interval = setInterval(() => {
      setIndicators(generateIndicators(candlestickData));
    }, 15000);
    
    return () => clearInterval(interval);
  }, [candlestickData]);

  // Update candlestick data
  useEffect(() => {
    if (candlestickData.length === 0) return;
    
    const interval = setInterval(() => {
      setCandlestickData(prev => {
        const lastCandle = prev[prev.length - 1];
        const changePercent = (Math.random() - 0.48) * 0.01; // Slightly biased toward up
        
        const open = lastCandle.close;
        const close = open * (1 + changePercent);
        const highLowRange = open * 0.005 * Math.random();
        const high = Math.max(open, close) + highLowRange;
        const low = Math.min(open, close) - highLowRange;
        const volume = Math.floor(Math.random() * 1000) + 500;
        
        const newCandle: Candlestick = {
          time: lastCandle.time + 1,
          open,
          high,
          low,
          close,
          volume
        };
        
        // Return updated array with new candle and removing the first one
        return [...prev.slice(1), newCandle];
      });
    }, 3000);
    
    return () => clearInterval(interval);
  }, [candlestickData]);

  // Update current prices and check for stop loss / take profit
  useEffect(() => {
    if (activeTrades.length === 0) return;
    
    const interval = setInterval(() => {
      setActiveTrades(prev => 
        prev.map(trade => {
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
        })
      );
      
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
    candlestickData,
    availableCurrencies,
    executeNewTrade,
    closeTradeById,
    resetSimulation,
    connectToMetaTrader,
    disconnectFromMetaTrader,
    isMetaTraderConnected,
    executeMT5Trade,
    toggleAutoTrading,
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
