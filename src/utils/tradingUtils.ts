
export interface TradeSettings {
  riskPercentage: number;
  stopLossPercent: number;
  takeProfitPercent: number;
  partialTakePercentage: number;
  maxTakeProfit: number;
}

export interface TradeResult {
  id: string;
  entryPrice: number;
  currentPrice: number;
  direction: 'long' | 'short';
  quantity: number;
  status: 'open' | 'closed';
  profitLoss: number;
  profitLossPercent: number;
  stopLoss: number;
  takeProfit: number;
  timestamp: number;
  takeProfitHits: number;
}

export interface Indicator {
  name: string;
  value: number;
  signal: 'buy' | 'sell' | 'neutral';
  strength: number; // 0 to 1
}

export interface AccountStats {
  balance: number;
  equity: number; 
  openPositions: number;
  winRate: number;
  profitFactor: number;
}

// Default trading settings based on requirements
export const defaultTradingSettings: TradeSettings = {
  riskPercentage: 5, // 5% risk per trade
  stopLossPercent: 2, // 2% stop loss
  takeProfitPercent: 4, // 4% take profit (1:2 risk-reward)
  partialTakePercentage: 30, // 30% of position closed at take profit
  maxTakeProfit: 3, // 3 take profit levels
};

// Simulate price movement for demo
export const generatePriceSeries = (
  initialPrice: number,
  periods: number,
  volatility: number = 0.01
): number[] => {
  const prices: number[] = [initialPrice];
  
  for (let i = 1; i < periods; i++) {
    const randomChange = (Math.random() - 0.5) * 2 * volatility;
    const lastPrice = prices[i - 1];
    const newPrice = lastPrice * (1 + randomChange);
    prices.push(newPrice);
  }
  
  return prices;
};

// Generate mock indicators for demo
export const generateIndicators = (): Indicator[] => {
  const signals: Array<'buy' | 'sell' | 'neutral'> = ['buy', 'sell', 'neutral'];
  
  return [
    {
      name: 'RSI',
      value: Math.round(Math.random() * 100),
      signal: signals[Math.floor(Math.random() * signals.length)],
      strength: Math.random(),
    },
    {
      name: 'MACD',
      value: parseFloat((Math.random() * 2 - 1).toFixed(2)),
      signal: signals[Math.floor(Math.random() * signals.length)],
      strength: Math.random(),
    },
    {
      name: 'Bollinger',
      value: parseFloat((Math.random() * 2 - 1).toFixed(2)),
      signal: signals[Math.floor(Math.random() * signals.length)],
      strength: Math.random(),
    },
    {
      name: 'ATR',
      value: parseFloat((Math.random() * 0.5).toFixed(2)),
      signal: signals[Math.floor(Math.random() * signals.length)],
      strength: Math.random(),
    },
  ];
};

// Calculate potential profit/loss based on settings
export const calculatePotentialOutcome = (
  entryPrice: number,
  direction: 'long' | 'short',
  settings: TradeSettings
): { stopLoss: number; takeProfit: number; risk: number; reward: number } => {
  const stopLoss = direction === 'long' 
    ? entryPrice * (1 - settings.stopLossPercent / 100)
    : entryPrice * (1 + settings.stopLossPercent / 100);

  const takeProfit = direction === 'long'
    ? entryPrice * (1 + settings.takeProfitPercent / 100)
    : entryPrice * (1 - settings.takeProfitPercent / 100);

  const risk = Math.abs(entryPrice - stopLoss);
  const reward = Math.abs(entryPrice - takeProfit);

  return { stopLoss, takeProfit, risk, reward };
};

// Format number as currency
export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value);
};

// Format percentage
export const formatPercentage = (value: number): string => {
  return `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`;
};
