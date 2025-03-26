export interface TradeSettings {
  riskPercentage: number;
  stopLossPercent: number;
  takeProfitPercent: number;
  partialTakePercentage: number;
  maxTakeProfit: number;
  selectedCurrency: string;
  chartType: 'line' | 'candlestick';
  metaTraderEnabled: boolean;
  autoTrading: boolean;
  tradingInterval: number; // in seconds
  minSignalStrength: number; // threshold to execute trades (0 to 1)
  confirmationCount: number; // number of indicators that should confirm
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

export interface Candlestick {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume?: number;
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

export interface Currency {
  symbol: string;
  name: string;
  type: 'forex' | 'crypto' | 'stock';
}

// Default trading settings based on requirements
export const defaultTradingSettings: TradeSettings = {
  riskPercentage: 5, // 5% risk per trade
  stopLossPercent: 2, // 2% stop loss
  takeProfitPercent: 4, // 4% take profit (1:2 risk-reward)
  partialTakePercentage: 30, // 30% of position closed at take profit
  maxTakeProfit: 3, // 3 take profit levels
  selectedCurrency: 'BTCUSD',
  chartType: 'line',
  metaTraderEnabled: false,
  autoTrading: false,
  tradingInterval: 30, // Check for trading opportunities every 30 seconds
  minSignalStrength: 0.3, // Minimum signal strength (0.3 out of 1)
  confirmationCount: 3, // At least 3 indicators should confirm the signal
};

// Available currencies for trading
export const availableCurrencies: Currency[] = [
  { symbol: 'BTCUSD', name: 'Bitcoin/USD', type: 'crypto' },
  { symbol: 'ETHUSD', name: 'Ethereum/USD', type: 'crypto' },
  { symbol: 'EURUSD', name: 'EUR/USD', type: 'forex' },
  { symbol: 'GBPUSD', name: 'GBP/USD', type: 'forex' },
  { symbol: 'USDJPY', name: 'USD/JPY', type: 'forex' },
  { symbol: 'AAPL', name: 'Apple Inc.', type: 'stock' },
  { symbol: 'MSFT', name: 'Microsoft', type: 'stock' },
  { symbol: 'AMZN', name: 'Amazon', type: 'stock' },
];

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

// Generate candlestick data
export const generateCandlestickSeries = (
  initialPrice: number,
  periods: number,
  volatility: number = 0.01
): Candlestick[] => {
  const candlesticks: Candlestick[] = [];
  let currentPrice = initialPrice;
  
  for (let i = 0; i < periods; i++) {
    // Generate random price movements
    const changePercent = (Math.random() - 0.5) * 2 * volatility;
    const open = currentPrice;
    const close = open * (1 + changePercent);
    
    // Generate high and low with additional randomness
    const highLowRange = open * volatility * Math.random();
    const high = Math.max(open, close) + highLowRange;
    const low = Math.min(open, close) - highLowRange;
    
    // Generate random volume
    const volume = Math.floor(Math.random() * 1000) + 500;
    
    candlesticks.push({
      time: i,
      open,
      high,
      low,
      close,
      volume
    });
    
    currentPrice = close;
  }
  
  return candlesticks;
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

// Smart trade decision function to achieve high win rate
export const analyzeMarketConditions = (indicators: Indicator[]): {
  decision: 'buy' | 'sell' | 'neutral';
  confidence: number;
  confirmedCount: number;
} => {
  // Count indicators by signal
  const buySignals = indicators.filter(i => i.signal === 'buy');
  const sellSignals = indicators.filter(i => i.signal === 'sell');
  
  // Calculate total strength of each signal type
  const buyStrength = buySignals.reduce((sum, i) => sum + i.strength, 0) / Math.max(1, buySignals.length);
  const sellStrength = sellSignals.reduce((sum, i) => sum + i.strength, 0) / Math.max(1, sellSignals.length);
  
  // Determine overall market direction
  if (buySignals.length > sellSignals.length && buyStrength > 0.5) {
    return {
      decision: 'buy',
      confidence: buyStrength,
      confirmedCount: buySignals.length
    };
  } else if (sellSignals.length > buySignals.length && sellStrength > 0.5) {
    return {
      decision: 'sell',
      confidence: sellStrength,
      confirmedCount: sellSignals.length
    };
  }
  
  return {
    decision: 'neutral',
    confidence: 0,
    confirmedCount: 0
  };
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
