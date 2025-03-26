export interface TradeSettings {
  riskPercentage: number;
  stopLossPercent: number;
  takeProfitPercent: number;
  partialTakePercentage: number;
  maxTakeProfit: number;
  metaTraderEnabled: boolean;
  selectedCurrency: string;
  chartType: 'line' | 'candlestick';
  autoTrading: boolean;
  tradingInterval: number;
  minSignalStrength: number;
  confirmationCount: number;
  enabledIndicators: {
    sma: boolean;
    ema: boolean;
    rsi: boolean;
    macd: boolean;
    bollinger: boolean;
    parabolicSar: boolean;
  };
  maxTrades: number;
  accountSize: 'small' | 'medium' | 'large';
  initialBalance: number;
  chartSource: 'internal' | 'tradingview' | 'mt5';
}

export const defaultTradingSettings: TradeSettings = {
  riskPercentage: 2,
  stopLossPercent: 2,
  takeProfitPercent: 4,
  partialTakePercentage: 30,
  maxTakeProfit: 3,
  metaTraderEnabled: false,
  selectedCurrency: 'EURUSD',
  chartType: 'candlestick',
  autoTrading: false,
  tradingInterval: 10,
  minSignalStrength: 0.65,
  confirmationCount: 3,
  enabledIndicators: {
    sma: true,
    ema: true,
    rsi: true,
    macd: true,
    bollinger: true,
    parabolicSar: true,
  },
  maxTrades: 10,
  accountSize: 'medium',
  initialBalance: 100,
  chartSource: 'internal'
}

export type TradeSignal = 'buy' | 'sell' | 'neutral';

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
  value: string;
  signal: TradeSignal;
  strength: number;
  description?: string;
}

export interface AccountStats {
  balance: number;
  equity: number;
  openPositions: number;
  winRate: number;
  profitFactor: number;
}

export interface Candlestick {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface Currency {
  symbol: string;
  name: string;
  type: 'crypto' | 'forex' | 'indices' | 'commodities' | 'stock';
}

export const availableCurrencies: Currency[] = [
  { symbol: 'BTCUSD', name: 'Bitcoin / US Dollar', type: 'crypto' },
  { symbol: 'ETHUSD', name: 'Ethereum / US Dollar', type: 'crypto' },
  { symbol: 'EURUSD', name: 'Euro / US Dollar', type: 'forex' },
  { symbol: 'GBPUSD', name: 'British Pound / US Dollar', type: 'forex' },
  { symbol: 'USDJPY', name: 'US Dollar / Japanese Yen', type: 'forex' },
  { symbol: 'AUDUSD', name: 'Australian Dollar / US Dollar', type: 'forex' },
  { symbol: 'US30', name: 'Dow Jones Industrial Average', type: 'indices' },
  { symbol: 'US500', name: 'S&P 500', type: 'indices' },
  { symbol: 'XAUUSD', name: 'Gold / US Dollar', type: 'commodities' },
  { symbol: 'XAGUSD', name: 'Silver / US Dollar', type: 'commodities' },
  { symbol: 'AAPL', name: 'Apple Inc.', type: 'stock' },
  { symbol: 'GOOG', name: 'Alphabet Inc.', type: 'stock' },
  { symbol: 'TSLA', name: 'Tesla, Inc.', type: 'stock' },
];

export const generatePriceSeries = (length: number, volatility: number = 0.01, trend: number = 0.001): { time: number, price: number }[] => {
  const series: { time: number, price: number }[] = [];
  let price = 100; // Initial price
  for (let i = 0; i < length; i++) {
    // Generate a random change with a slight upward trend
    const change = price * (Math.random() - 0.5) * 2 * volatility + trend;
    price += change;
    series.push({ time: i, price: price });
  }
  return series;
};

export const generateCandlestickSeries = (length: number, volatility: number = 20, trend: number = 0.01): Candlestick[] => {
  const series: Candlestick[] = [];
  let open = 100; // Initial open price
  for (let i = 0; i < length; i++) {
    const changePercent = (Math.random() - 0.5) * 2 * volatility / 100 + trend;
    const close = open * (1 + changePercent);
    const highLowRange = open * 0.01 * Math.random();
    const high = Math.max(open, close) + highLowRange;
    const low = Math.min(open, close) - highLowRange;
    const volume = Math.floor(Math.random() * 1000) + 500;
    
    series.push({
      time: i,
      open,
      high,
      low,
      close,
      volume
    });
    open = close; // Next open is the current close
  }
  return series;
};

export function generateIndicators(data: Candlestick[] = []): Indicator[] {
  const sma = calculateSMA(data, 14);
  const ema = calculateEMA(data, 14);
  const rsi = calculateRSI(data, 14);
  const macd = calculateMACD(data);
  const bollingerBands = calculateBollingerBands(data, 20, 2);
  const parabolicSar = calculateParabolicSAR(data, 0.02, 0.2);
  
  return [
    processIndicator({
      name: 'SMA (14)',
      value: sma ? sma.toFixed(2) : 'N/A',
      signal: 'neutral',
      strength: 0.5,
      description: 'Simple Moving Average over 14 periods'
    }),
    processIndicator({
      name: 'EMA (14)',
      value: ema ? ema.toFixed(2) : 'N/A',
      signal: 'neutral',
      strength: 0.6,
      description: 'Exponential Moving Average over 14 periods'
    }),
    processIndicator({
      name: 'RSI (14)',
      value: rsi ? rsi.toFixed(2) : 'N/A',
      signal: 'neutral',
      strength: 0.7,
      description: 'Relative Strength Index over 14 periods'
    }),
    processIndicator({
      name: `MACD (${macd?.macd ? macd.macd.toFixed(2) : 'N/A'})`,
      value: macd ? macd.histogram.toFixed(2) : 'N/A',
      signal: 'neutral',
      strength: 0.6,
      description: 'Moving Average Convergence Divergence'
    }),
    processIndicator({
      name: `Bollinger Bands (${bollingerBands ? bollingerBands.upper.toFixed(2) : 'N/A'})`,
      value: bollingerBands ? bollingerBands.lower.toFixed(2) : 'N/A',
      signal: 'neutral',
      strength: 0.5,
      description: 'Bollinger Bands with 20 periods and 2 standard deviations'
    }),
    processIndicator({
      name: `Parabolic SAR (${parabolicSar ? parabolicSar.toFixed(2) : 'N/A'})`,
      value: parabolicSar ? parabolicSar.toFixed(2) : 'N/A',
      signal: 'neutral',
      strength: 0.4,
      description: 'Parabolic Stop and Reverse'
    }),
  ];
}

export function analyzeMarketConditions(indicators: Indicator[]) {
  let buySignals = 0;
  let sellSignals = 0;
  let buyStrength = 0;
  let sellStrength = 0;
  
  indicators.forEach(indicator => {
    if (indicator.signal === 'buy') {
      buySignals++;
      buyStrength += indicator.strength;
    } else if (indicator.signal === 'sell') {
      sellSignals++;
      sellStrength += indicator.strength;
    }
  });
  
  buyStrength /= buySignals || 1;
  sellStrength /= sellSignals || 1;
  
  let decision: TradeSignal = 'neutral';
  
  if (buySignals > sellSignals && buyStrength > 0.5) {
    decision = 'buy';
  } else if (sellSignals > buySignals && sellStrength > 0.5) {
    decision = 'sell';
  }
  
  return {
    decision,
    confirmedCount: Math.max(buySignals, sellSignals),
    confidence: Math.max(buyStrength, sellStrength),
    reason: decision === 'buy' 
      ? `${buySignals} indicators suggest bullish trend`
      : decision === 'sell'
        ? `${sellSignals} indicators suggest bearish trend`
        : 'Market conditions are neutral'
  };
}

export function processIndicator(indicator: Indicator): Indicator {
  let signal: TradeSignal = 'neutral';
  
  return {
    ...indicator,
    signal,
  };
}

// Technical Analysis Functions
function calculateSMA(data: Candlestick[], period: number): number | null {
  if (data.length < period) return null;
  
  let sum = 0;
  for (let i = data.length - period; i < data.length; i++) {
    sum += data[i].close;
  }
  return sum / period;
}

function calculateEMA(data: Candlestick[], period: number): number | null {
  if (data.length < period) return null;
  
  const k = 2 / (period + 1);
  let ema = calculateSMA(data.slice(0, period), period) || data[period - 1].close;
  
  for (let i = period; i < data.length; i++) {
    ema = (data[i].close * k) + (ema * (1 - k));
  }
  
  return ema;
}

function calculateRSI(data: Candlestick[], period: number): number | null {
  if (data.length < period) return null;
  
  let gains = 0;
  let losses = 0;
  
  for (let i = 1; i < period; i++) {
    const change = data[data.length - period + i].close - data[data.length - period + i - 1].close;
    if (change > 0) {
      gains += change;
    } else {
      losses += Math.abs(change);
    }
  }
  
  const avgGain = gains / period;
  const avgLoss = losses / period;
  
  let rs = avgGain / avgLoss;
  if (avgLoss === 0) {
    rs = 100;
  }
  
  let rsi = 100 - (100 / (1 + rs));
  
  return rsi;
}

function calculateMACD(data: Candlestick[]) {
  const ema12 = calculateEMA(data, 12);
  const ema26 = calculateEMA(data, 26);
  
  if (!ema12 || !ema26) return null;
  
  const macdLine = ema12 - ema26;
  const signalLine = calculateEMA(data.slice(data.length - 30), 9);
  
  if (!signalLine) return null;
  
  const histogram = macdLine - signalLine;
  
  return {
    macd: macdLine,
    signal: signalLine,
    histogram: histogram
  };
}

function calculateBollingerBands(data: Candlestick[], period: number, stdDev: number) {
  const sma = calculateSMA(data, period);
  if (!sma) return null;
  
  let sum = 0;
  for (let i = data.length - period; i < data.length; i++) {
    sum += Math.pow(data[i].close - sma, 2);
  }
  const variance = sum / period;
  const standardDeviation = Math.sqrt(variance);
  
  const upperBand = sma + (standardDeviation * stdDev);
  const lowerBand = sma - (standardDeviation * stdDev);
  
  return {
    upper: upperBand,
    lower: lowerBand
  };
}

function calculateParabolicSAR(data: Candlestick[], accelerationFactor: number, maxAcceleration: number): number | null {
  if (data.length < 2) return null;

  let sar = data[0].low;
  let ep = data[0].high;
  let isUptrend = true;
  let af = accelerationFactor;

  for (let i = 1; i < data.length; i++) {
    const current = data[i];
    const previous = data[i - 1];

    if (isUptrend) {
      sar = sar + af * (ep - sar);

      if (current.low < sar) {
        isUptrend = false;
        sar = ep;
        ep = current.low;
        af = accelerationFactor;
      } else {
        if (current.high > ep) {
          ep = current.high;
          af = Math.min(af + accelerationFactor, maxAcceleration);
        }
      }
    } else {
      sar = sar + af * (ep - sar);

      if (current.high > sar) {
        isUptrend = true;
        sar = ep;
        ep = current.high;
        af = accelerationFactor;
      } else {
        if (current.low < ep) {
          ep = current.low;
          af = Math.min(af + accelerationFactor, maxAcceleration);
        }
      }
    }
  }

  return sar;
}

export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(value);
};

export const formatPercentage = (value: number): string => {
  return `${value.toFixed(2)}%`;
};
