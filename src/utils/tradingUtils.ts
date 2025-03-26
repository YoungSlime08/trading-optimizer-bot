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
  enabledIndicators: {
    sma: boolean;
    ema: boolean;
    rsi: boolean;
    macd: boolean;
    bollinger: boolean;
    parabolicSar: boolean;
  };
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
  value: number | string;
  signal: 'buy' | 'sell' | 'neutral';
  strength: number; // 0 to 1
  description?: string;
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
  type: 'forex' | 'crypto' | 'stock' | 'indices' | 'commodities' | 'bonds';
}

// Default trading settings based on requirements
export const defaultTradingSettings: TradeSettings = {
  riskPercentage: 5, // 5% risk per trade
  stopLossPercent: 2, // 2% stop loss
  takeProfitPercent: 4, // 4% take profit (1:2 risk-reward)
  partialTakePercentage: 30, // 30% of position closed at take profit
  maxTakeProfit: 3, // 3 take profit levels
  selectedCurrency: 'EURUSD',
  chartType: 'candlestick',
  metaTraderEnabled: false,
  autoTrading: false,
  tradingInterval: 30, // Check for trading opportunities every 30 seconds
  minSignalStrength: 0.3, // Minimum signal strength (0.3 out of 1)
  confirmationCount: 3, // At least 3 indicators should confirm the signal
  enabledIndicators: {
    sma: true,
    ema: true,
    rsi: true,
    macd: true,
    bollinger: true,
    parabolicSar: true
  }
};

// Available currencies for trading
export const availableCurrencies: Currency[] = [
  // Forex
  { symbol: 'EURUSD', name: 'EUR/USD', type: 'forex' },
  { symbol: 'GBPUSD', name: 'GBP/USD', type: 'forex' },
  { symbol: 'USDJPY', name: 'USD/JPY', type: 'forex' },
  { symbol: 'USDCHF', name: 'USD/CHF', type: 'forex' },
  { symbol: 'AUDUSD', name: 'AUD/USD', type: 'forex' },
  { symbol: 'USDCAD', name: 'USD/CAD', type: 'forex' },
  { symbol: 'NZDUSD', name: 'NZD/USD', type: 'forex' },
  
  // Crypto
  { symbol: 'BTCUSD', name: 'Bitcoin/USD', type: 'crypto' },
  { symbol: 'ETHUSD', name: 'Ethereum/USD', type: 'crypto' },
  { symbol: 'LTCUSD', name: 'Litecoin/USD', type: 'crypto' },
  { symbol: 'XRPUSD', name: 'Ripple/USD', type: 'crypto' },
  
  // Indices
  { symbol: 'US30', name: 'Dow Jones 30', type: 'indices' },
  { symbol: 'US500', name: 'S&P 500', type: 'indices' },
  { symbol: 'USTEC', name: 'Nasdaq 100', type: 'indices' },
  { symbol: 'UK100', name: 'FTSE 100', type: 'indices' },
  
  // Commodities
  { symbol: 'XAUUSD', name: 'Gold/USD', type: 'commodities' },
  { symbol: 'XAGUSD', name: 'Silver/USD', type: 'commodities' },
  { symbol: 'BRENT', name: 'Brent Oil', type: 'commodities' },
  { symbol: 'WTI', name: 'WTI Oil', type: 'commodities' },
  
  // Stocks
  { symbol: 'AAPL', name: 'Apple Inc.', type: 'stock' },
  { symbol: 'MSFT', name: 'Microsoft', type: 'stock' },
  { symbol: 'AMZN', name: 'Amazon', type: 'stock' },
  { symbol: 'GOOGL', name: 'Alphabet', type: 'stock' },
  { symbol: 'META', name: 'Meta', type: 'stock' },
  { symbol: 'TSLA', name: 'Tesla', type: 'stock' },
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

// Calculate SMA (Simple Moving Average)
export const calculateSMA = (prices: number[], period: number): number => {
  if (prices.length < period) return 0;
  
  const sum = prices.slice(-period).reduce((total, price) => total + price, 0);
  return sum / period;
};

// Calculate EMA (Exponential Moving Average)
export const calculateEMA = (prices: number[], period: number, prevEMA?: number): number => {
  if (prices.length < period) return 0;
  
  if (prevEMA === undefined) {
    // First EMA uses SMA as starting point
    prevEMA = calculateSMA(prices.slice(0, period), period);
    prices = prices.slice(period);
    if (prices.length === 0) return prevEMA;
  }
  
  const multiplier = 2 / (period + 1);
  const currentPrice = prices[prices.length - 1];
  
  return (currentPrice - prevEMA) * multiplier + prevEMA;
};

// Calculate RSI (Relative Strength Index)
export const calculateRSI = (prices: number[], period: number = 14): number => {
  if (prices.length < period + 1) return 50; // Not enough data
  
  let gains = 0;
  let losses = 0;
  
  // Calculate the initial average gain and loss
  for (let i = 1; i <= period; i++) {
    const change = prices[i] - prices[i - 1];
    if (change >= 0) {
      gains += change;
    } else {
      losses += Math.abs(change);
    }
  }
  
  let avgGain = gains / period;
  let avgLoss = losses / period;
  
  // Calculate the RSI using the smoothed method
  for (let i = period + 1; i < prices.length; i++) {
    const change = prices[i] - prices[i - 1];
    
    if (change >= 0) {
      avgGain = (avgGain * (period - 1) + change) / period;
      avgLoss = (avgLoss * (period - 1)) / period;
    } else {
      avgGain = (avgGain * (period - 1)) / period;
      avgLoss = (avgLoss * (period - 1) + Math.abs(change)) / period;
    }
  }
  
  if (avgLoss === 0) return 100;
  
  const rs = avgGain / avgLoss;
  return 100 - (100 / (1 + rs));
};

// Calculate MACD (Moving Average Convergence Divergence)
export const calculateMACD = (prices: number[]): { macd: number; signal: number; histogram: number } => {
  if (prices.length < 26) {
    return { macd: 0, signal: 0, histogram: 0 };
  }
  
  // Calculate the 12-day EMA
  const ema12 = calculateEMA(prices, 12);
  
  // Calculate the 26-day EMA
  const ema26 = calculateEMA(prices, 26);
  
  // Calculate the MACD line
  const macdLine = ema12 - ema26;
  
  // Calculate the signal line (9-day EMA of the MACD line)
  // For simplicity, we'll just use a simple approach here
  const macdHistory = prices.map((price, index, arr) => {
    if (index < 26) return 0;
    
    const ema12Local = calculateEMA(arr.slice(0, index + 1), 12);
    const ema26Local = calculateEMA(arr.slice(0, index + 1), 26);
    return ema12Local - ema26Local;
  }).slice(-9);
  
  const signalLine = calculateEMA(macdHistory, 9);
  
  // Calculate the histogram (MACD line - signal line)
  const histogram = macdLine - signalLine;
  
  return { macd: macdLine, signal: signalLine, histogram };
};

// Calculate Bollinger Bands
export const calculateBollingerBands = (prices: number[], period: number = 20, multiplier: number = 2): {
  upper: number;
  middle: number;
  lower: number;
} => {
  if (prices.length < period) {
    return { upper: 0, middle: 0, lower: 0 };
  }
  
  // Calculate the middle band (SMA)
  const middle = calculateSMA(prices, period);
  
  // Calculate the standard deviation
  const periodPrices = prices.slice(-period);
  const squaredDiffs = periodPrices.map(price => Math.pow(price - middle, 2));
  const avgSquaredDiff = squaredDiffs.reduce((total, diff) => total + diff, 0) / period;
  const standardDeviation = Math.sqrt(avgSquaredDiff);
  
  // Calculate the upper and lower bands
  const upper = middle + (standardDeviation * multiplier);
  const lower = middle - (standardDeviation * multiplier);
  
  return { upper, middle, lower };
};

// Calculate Parabolic SAR
export const calculateParabolicSAR = (
  highs: number[],
  lows: number[],
  close: number[],
  af: number = 0.02,
  maxAf: number = 0.2
): { sar: number; trend: 'up' | 'down' } => {
  if (highs.length < 2) return { sar: close[0], trend: 'up' };
  
  // For a simplified implementation
  // In a real scenario, this would be more complex with trend calculations
  
  // We'll use a simple approach for demo
  const lastHigh = highs[highs.length - 1];
  const lastLow = lows[lows.length - 1];
  const secondLastHigh = highs[highs.length - 2];
  const secondLastLow = lows[lows.length - 2];
  const lastClose = close[close.length - 1];
  
  const sar = calculateSMA(close, 2); // Using a simple SMA instead of actual SAR calc for simplicity
  const trend = lastClose > sar ? 'up' : 'down';
  
  return { sar, trend };
};

// Generate mock indicators based on the algorithms above
export const generateIndicators = (candles: Candlestick[] = []): Indicator[] => {
  // Generate some reasonable data if we don't have candles
  if (candles.length < 30) {
    const fakeClose = Array(50).fill(0).map((_, i) => 100 + Math.sin(i / 5) * 10 + Math.random() * 5);
    candles = fakeClose.map((close, i) => ({
      time: i,
      open: close - Math.random() * 2,
      high: close + Math.random() * 2,
      low: close - Math.random() * 2,
      close,
      volume: Math.floor(Math.random() * 1000) + 500
    }));
  }
  
  const closePrices = candles.map(c => c.close);
  const highPrices = candles.map(c => c.high);
  const lowPrices = candles.map(c => c.low);
  const lastClose = closePrices[closePrices.length - 1];
  
  // Calculate SMA
  const sma50 = calculateSMA(closePrices, 50);
  const smaSignal = lastClose > sma50 ? 'buy' : 'sell';
  const smaStrength = Math.min(0.95, Math.abs(lastClose - sma50) / sma50);
  
  // Calculate EMA
  const ema9 = calculateEMA(closePrices, 9);
  const emaSignal = lastClose > ema9 ? 'buy' : 'sell';
  const emaStrength = Math.min(0.9, Math.abs(lastClose - ema9) / ema9);
  
  // Calculate RSI
  const rsi = calculateRSI(closePrices);
  let rsiSignal = 'neutral';
  let rsiStrength = 0.5;
  
  if (rsi > 70) {
    rsiSignal = 'sell';
    rsiStrength = Math.min(0.9, (rsi - 70) / 30);
  } else if (rsi < 30) {
    rsiSignal = 'buy';
    rsiStrength = Math.min(0.9, (30 - rsi) / 30);
  } else {
    // Neutral zone
    rsiSignal = rsi > 50 ? 'buy' : 'sell';
    rsiStrength = Math.abs(rsi - 50) / 20; // Lower strength in neutral zone
  }
  
  // Calculate MACD
  const macd = calculateMACD(closePrices);
  const macdSignal = macd.histogram > 0 ? 'buy' : 'sell';
  const macdStrength = Math.min(0.9, Math.abs(macd.histogram) / 0.5);
  
  // Calculate Bollinger Bands
  const bollinger = calculateBollingerBands(closePrices);
  let bollingerSignal = 'neutral';
  let bollingerStrength = 0.5;
  
  if (lastClose > bollinger.upper) {
    bollingerSignal = 'sell';
    bollingerStrength = Math.min(0.85, (lastClose - bollinger.upper) / (bollinger.upper * 0.05));
  } else if (lastClose < bollinger.lower) {
    bollingerSignal = 'buy';
    bollingerStrength = Math.min(0.85, (bollinger.lower - lastClose) / (bollinger.lower * 0.05));
  } else {
    // Inside the bands - weaker signal
    const middleDistance = Math.abs(lastClose - bollinger.middle);
    const totalDistance = (bollinger.upper - bollinger.lower) / 2;
    bollingerStrength = Math.min(0.5, middleDistance / totalDistance);
    bollingerSignal = lastClose > bollinger.middle ? 'buy' : 'sell';
  }
  
  // Calculate Parabolic SAR
  const sar = calculateParabolicSAR(highPrices, lowPrices, closePrices);
  const sarSignal = sar.trend === 'up' ? 'buy' : 'sell';
  const sarStrength = 0.75; // Fixed strength for simplicity
  
  return [
    {
      name: 'SMA (50)',
      value: sma50.toFixed(2),
      signal: smaSignal,
      strength: smaStrength,
      description: 'Price vs 50-period Simple Moving Average'
    },
    {
      name: 'EMA (9)',
      value: ema9.toFixed(2),
      signal: emaSignal,
      strength: emaStrength,
      description: 'Price vs 9-period Exponential Moving Average'
    },
    {
      name: 'RSI (14)',
      value: rsi.toFixed(0),
      signal: rsiSignal,
      strength: rsiStrength,
      description: rsi > 70 ? 'Overbought' : rsi < 30 ? 'Oversold' : 'Neutral'
    },
    {
      name: 'MACD',
      value: `${macd.histogram.toFixed(2)}`,
      signal: macdSignal,
      strength: macdStrength,
      description: macd.histogram > 0 ? 'Bullish crossover' : 'Bearish crossover'
    },
    {
      name: 'Bollinger',
      value: `${((lastClose - bollinger.middle) / (bollinger.upper - bollinger.middle) * 100).toFixed(0)}%`,
      signal: bollingerSignal,
      strength: bollingerStrength,
      description: lastClose > bollinger.upper ? 'Above upper band' : 
                  lastClose < bollinger.lower ? 'Below lower band' : 'Inside bands'
    },
    {
      name: 'Parabolic SAR',
      value: sar.sar.toFixed(2),
      signal: sarSignal,
      strength: sarStrength,
      description: sar.trend === 'up' ? 'Uptrend' : 'Downtrend'
    },
  ];
};

// Smart trade decision function to achieve high win rate
export const analyzeMarketConditions = (indicators: Indicator[]): {
  decision: 'buy' | 'sell' | 'neutral';
  confidence: number;
  confirmedCount: number;
  reason: string;
} => {
  // Count indicators by signal
  const buySignals = indicators.filter(i => i.signal === 'buy');
  const sellSignals = indicators.filter(i => i.signal === 'sell');
  
  // Calculate total strength of each signal type
  const buyStrength = buySignals.reduce((sum, i) => sum + i.strength, 0) / Math.max(1, buySignals.length);
  const sellStrength = sellSignals.reduce((sum, i) => sum + i.strength, 0) / Math.max(1, sellSignals.length);
  
  // Special calculation for trend indicators (SMA, EMA) - they have higher weight
  const trendIndicators = indicators.filter(i => i.name.includes('SMA') || i.name.includes('EMA'));
  const trendBuySignals = trendIndicators.filter(i => i.signal === 'buy');
  
  // Weight RSI more heavily when it's in extreme territory
  const rsiIndicator = indicators.find(i => i.name.includes('RSI'));
  let rsiBoost = 0;
  
  if (rsiIndicator) {
    const rsiValue = parseFloat(rsiIndicator.value.toString());
    if (rsiValue < 30 && rsiIndicator.signal === 'buy') {
      rsiBoost = 0.2; // Boost buy confidence when RSI is oversold
    } else if (rsiValue > 70 && rsiIndicator.signal === 'sell') {
      rsiBoost = 0.2; // Boost sell confidence when RSI is overbought
    }
  }
  
  // Check for MACD crossover which is a strong signal
  const macdIndicator = indicators.find(i => i.name.includes('MACD'));
  let macdConfirmation = false;
  
  if (macdIndicator && macdIndicator.strength > 0.6) {
    macdConfirmation = true;
  }
  
  // Check Bollinger Bands for extreme levels
  const bollingerIndicator = indicators.find(i => i.name.includes('Bollinger'));
  let bollingerExtreme = false;
  
  if (bollingerIndicator && bollingerIndicator.strength > 0.7) {
    bollingerExtreme = true;
  }
  
  // More emphasis on Parabolic SAR for trend direction
  const sarIndicator = indicators.find(i => i.name.includes('Parabolic'));
  const sarConfirmation = sarIndicator?.signal === 'buy';
  
  // Strengthen the confidence when multiple conditions align
  let buyConfidence = buyStrength;
  let sellConfidence = sellStrength;
  
  // Add trend weight
  if (trendBuySignals.length >= trendIndicators.length / 2) {
    buyConfidence += 0.1;
  } else {
    sellConfidence += 0.1;
  }
  
  // Add RSI boost
  if (rsiIndicator?.signal === 'buy') {
    buyConfidence += rsiBoost;
  } else if (rsiIndicator?.signal === 'sell') {
    sellConfidence += rsiBoost;
  }
  
  // Add MACD confirmation
  if (macdConfirmation) {
    if (macdIndicator?.signal === 'buy') {
      buyConfidence += 0.15;
    } else {
      sellConfidence += 0.15;
    }
  }
  
  // Add Bollinger band extreme
  if (bollingerExtreme) {
    if (bollingerIndicator?.signal === 'buy') {
      buyConfidence += 0.1;
    } else {
      sellConfidence += 0.1;
    }
  }
  
  // Add SAR confirmation
  if (sarIndicator) {
    if (sarConfirmation) {
      buyConfidence += 0.1;
    } else {
      sellConfidence += 0.1;
    }
  }
  
  // Generate reason for the decision
  let reason = '';
  
  // Determine overall market direction with minimum thresholds for confidence
  // High win rate systems require strong confirmation and avoid weak signals
  if (buySignals.length > sellSignals.length && buyConfidence > 0.6) {
    reason = `Strong buy signals (${buySignals.length}/${indicators.length}): `;
    reason += buySignals.map(i => i.name).join(', ');
    
    // Add special conditions
    if (rsiBoost > 0 && rsiIndicator?.signal === 'buy') {
      reason += `. RSI oversold (${rsiIndicator.value})`;
    }
    if (macdConfirmation && macdIndicator?.signal === 'buy') {
      reason += `. MACD bullish crossover`;
    }
    
    return {
      decision: 'buy',
      confidence: Math.min(0.95, buyConfidence), // Cap at 95%
      confirmedCount: buySignals.length,
      reason
    };
  } else if (sellSignals.length > buySignals.length && sellConfidence > 0.6) {
    reason = `Strong sell signals (${sellSignals.length}/${indicators.length}): `;
    reason += sellSignals.map(i => i.name).join(', ');
    
    // Add special conditions
    if (rsiBoost > 0 && rsiIndicator?.signal === 'sell') {
      reason += `. RSI overbought (${rsiIndicator.value})`;
    }
    if (macdConfirmation && macdIndicator?.signal === 'sell') {
      reason += `. MACD bearish crossover`;
    }
    
    return {
      decision: 'sell',
      confidence: Math.min(0.95, sellConfidence), // Cap at 95%
      confirmedCount: sellSignals.length,
      reason
    };
  }
  
  // No strong signal, stay neutral
  return {
    decision: 'neutral',
    confidence: 0,
    confirmedCount: 0,
    reason: 'No strong trading signals detected'
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
