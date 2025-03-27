import React, { useState, useEffect } from 'react';
import { 
  Line, 
  LineChart, 
  ResponsiveContainer, 
  CartesianGrid, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ReferenceLine,
  BarChart,
  Bar,
  ComposedChart,
  Area,
  Scatter
} from 'recharts';
import { generatePriceSeries } from '@/utils/tradingUtils';
import GlassCard from '../common/GlassCard';
import { useTrading } from '@/context/TradingContext';
import { ArrowUpRight, ArrowDownRight, ExternalLink } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface TradingChartProps {
  activeStopLoss?: number;
  activeTakeProfit?: number;
  entryPrice?: number;
}

const TradingChart = ({ activeStopLoss, activeTakeProfit, entryPrice }: TradingChartProps) => {
  const { settings, candlestickData, activeTrades, updateSettings } = useTrading();
  const [chartSize, setChartSize] = useState<'small' | 'medium' | 'large'>('medium');
  const [tradingViewUrl, setTradingViewUrl] = useState('');
  
  useEffect(() => {
    // Update TradingView URL when currency changes
    if (settings.chartSource === 'tradingview') {
      setTradingViewUrl(`https://www.tradingview.com/chart/?symbol=${settings.selectedCurrency}`);
    }
  }, [settings.selectedCurrency, settings.chartSource]);
  
  const formatYAxis = (value: number) => {
    return value.toFixed(2);
  };
  
  const CustomTooltip = ({ active, payload }: { active?: boolean, payload?: any[] }) => {
    if (active && payload && payload.length) {
      if (settings.chartType === 'line') {
        return (
          <div className="bg-white p-2 border border-gray-100 shadow-sm rounded text-xs">
            <p>Price: ${payload[0].value.toFixed(2)}</p>
          </div>
        );
      } else {
        // Candlestick tooltip
        const data = payload[0].payload;
        return (
          <div className="bg-white p-2 border border-gray-100 shadow-sm rounded text-xs space-y-1">
            <p>Open: ${data.open.toFixed(2)}</p>
            <p>High: ${data.high.toFixed(2)}</p>
            <p>Low: ${data.low.toFixed(2)}</p>
            <p>Close: ${data.close.toFixed(2)}</p>
            {data.volume && <p>Volume: {data.volume}</p>}
          </div>
        );
      }
    }
    return null;
  };

  // Custom component to render candlesticks
  const renderCandlestick = () => {
    return (
      <ComposedChart data={candlestickData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis dataKey="time" hide />
        <YAxis 
          domain={['auto', 'auto']}
          tickFormatter={formatYAxis}
          width={40}
          tick={{ fontSize: 10 }}
        />
        <YAxis 
          yAxisId="volume"
          orientation="right"
          tickFormatter={(value) => `${value}`}
          width={40}
          tick={{ fontSize: 8 }}
          domain={[0, 'auto']}
        />
        <Tooltip content={<CustomTooltip />} />
        
        {/* Render High-Low as line */}
        {candlestickData.map((candle, index) => (
          <line
            key={`candle-hl-${index}`}
            x1={index + 0.5}
            x2={index + 0.5}
            y1={candle.low}
            y2={candle.high}
            stroke={candle.open > candle.close ? '#FF5252' : '#4CAF50'}
            strokeWidth={1}
          />
        ))}
        
        {/* Render body as bar */}
        <Bar
          dataKey={(data) => [data.open, data.close]}
          fill="#8884d8"
          name="Price Range"
        />
        
        {/* Render volume */}
        <Bar
          dataKey="volume"
          fill="#8884d8"
          opacity={0.3}
          yAxisId="volume"
        />
        
        {/* Entry markers for all active trades */}
        {activeTrades.map((trade, index) => (
          <React.Fragment key={`trade-${trade.id}`}>
            {/* Entry marker */}
            <Scatter
              name={`Entry-${trade.id}`}
              data={[{
                time: candlestickData.length - 5,
                value: trade.entryPrice,
                direction: trade.direction
              }]}
              fill={trade.direction === 'long' ? '#4CAF50' : '#FF5252'}
              shape={(props) => {
                const { cx, cy, fill } = props;
                return trade.direction === 'long' ? (
                  <ArrowUpRight x={cx} y={cy} size={14} color={fill as string} />
                ) : (
                  <ArrowDownRight x={cx} y={cy} size={14} color={fill as string} />
                );
              }}
            />
            
            {/* Stop Loss line */}
            <ReferenceLine 
              y={trade.stopLoss} 
              stroke="#FF5252" 
              strokeDasharray="3 3" 
              label={{ 
                value: `SL: ${trade.stopLoss.toFixed(2)}`, 
                position: 'insideBottomRight',
                fill: '#FF5252',
                fontSize: 10
              }} 
            />
            
            {/* Take Profit line */}
            <ReferenceLine 
              y={trade.takeProfit} 
              stroke="#4CAF50" 
              strokeDasharray="3 3" 
              label={{ 
                value: `TP: ${trade.takeProfit.toFixed(2)}`, 
                position: 'insideTopRight',
                fill: '#4CAF50',
                fontSize: 10
              }} 
            />
          </React.Fragment>
        ))}
        
        {activeStopLoss && !activeTrades.some(t => t.stopLoss === activeStopLoss) && (
          <ReferenceLine 
            y={activeStopLoss} 
            stroke="#FF5252" 
            strokeDasharray="3 3" 
            label={{ 
              value: 'Stop Loss', 
              position: 'insideBottomRight',
              fill: '#FF5252',
              fontSize: 10
            }} 
          />
        )}
        
        {activeTakeProfit && !activeTrades.some(t => t.takeProfit === activeTakeProfit) && (
          <ReferenceLine 
            y={activeTakeProfit} 
            stroke="#4CAF50" 
            strokeDasharray="3 3" 
            label={{ 
              value: 'Take Profit', 
              position: 'insideTopRight',
              fill: '#4CAF50',
              fontSize: 10
            }} 
          />
        )}
        
        {entryPrice && !activeTrades.some(t => t.entryPrice === entryPrice) && (
          <ReferenceLine 
            y={entryPrice} 
            stroke="#757575" 
            strokeDasharray="3 3" 
            label={{ 
              value: 'Entry', 
              position: 'insideTopRight',
              fill: '#757575',
              fontSize: 10
            }} 
          />
        )}
      </ComposedChart>
    );
  };

  // Render line chart
  const renderLineChart = () => {
    const data = candlestickData.map(candle => ({
      time: candle.time,
      price: candle.close
    }));
    
    return (
      <LineChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis dataKey="time" hide />
        <YAxis 
          domain={['auto', 'auto']}
          tickFormatter={formatYAxis}
          width={40}
          tick={{ fontSize: 10 }}
        />
        <Tooltip content={<CustomTooltip />} />
        <Line 
          type="monotone" 
          dataKey="price" 
          stroke="#2196F3" 
          strokeWidth={2}
          dot={false}
          activeDot={{ r: 4 }}
          isAnimationActive={false}
        />
        
        {/* Entry markers for all active trades */}
        {activeTrades.map((trade, index) => (
          <React.Fragment key={`trade-${trade.id}`}>
            {/* Stop Loss line */}
            <ReferenceLine 
              y={trade.stopLoss} 
              stroke="#FF5252" 
              strokeDasharray="3 3" 
              label={{ 
                value: `SL: ${trade.stopLoss.toFixed(2)}`, 
                position: 'insideBottomRight',
                fill: '#FF5252',
                fontSize: 10
              }} 
            />
            
            {/* Take Profit line */}
            <ReferenceLine 
              y={trade.takeProfit} 
              stroke="#4CAF50" 
              strokeDasharray="3 3" 
              label={{ 
                value: `TP: ${trade.takeProfit.toFixed(2)}`, 
                position: 'insideTopRight',
                fill: '#4CAF50',
                fontSize: 10
              }} 
            />
            
            {/* Entry markers */}
            <Scatter
              name={`Entry-${trade.id}`}
              data={[{
                time: data.length - 5,
                price: trade.entryPrice,
                direction: trade.direction
              }]}
              fill={trade.direction === 'long' ? '#4CAF50' : '#FF5252'}
              shape={(props) => {
                const { cx, cy, fill } = props;
                return trade.direction === 'long' ? (
                  <ArrowUpRight x={cx} y={cy} size={14} color={fill as string} />
                ) : (
                  <ArrowDownRight x={cx} y={cy} size={14} color={fill as string} />
                );
              }}
            />
          </React.Fragment>
        ))}
        
        {activeStopLoss && !activeTrades.some(t => t.stopLoss === activeStopLoss) && (
          <ReferenceLine 
            y={activeStopLoss} 
            stroke="#FF5252" 
            strokeDasharray="3 3" 
            label={{ 
              value: 'Stop Loss', 
              position: 'insideBottomRight',
              fill: '#FF5252',
              fontSize: 10
            }} 
          />
        )}
        
        {activeTakeProfit && !activeTrades.some(t => t.takeProfit === activeTakeProfit) && (
          <ReferenceLine 
            y={activeTakeProfit} 
            stroke="#4CAF50" 
            strokeDasharray="3 3" 
            label={{ 
              value: 'Take Profit', 
              position: 'insideTopRight',
              fill: '#4CAF50',
              fontSize: 10
            }} 
          />
        )}
        
        {entryPrice && !activeTrades.some(t => t.entryPrice === entryPrice) && (
          <ReferenceLine 
            y={entryPrice} 
            stroke="#757575" 
            strokeDasharray="3 3" 
            label={{ 
              value: 'Entry', 
              position: 'insideTopRight',
              fill: '#757575',
              fontSize: 10
            }} 
          />
        )}
      </LineChart>
    );
  };

  // Render TradingView chart
  const renderTradingViewChart = () => {
    return (
      <div className="w-full h-full flex flex-col">
        <iframe
          src={`https://www.tradingview.com/chart/?symbol=${settings.selectedCurrency}&interval=15&theme=light&hide_side_toolbar=1&utm_source=element-a-trading-app&utm_medium=widget&utm_campaign=chart`}
          className="w-full h-full border-0 rounded-md"
          style={{ height: '100%', minHeight: '300px' }}
          title="TradingView Chart"
        />
      </div>
    );
  };

  // Render MT5 chart placeholder
  const renderMT5Chart = () => {
    return (
      <div className="flex items-center justify-center h-full bg-gray-50 rounded-md">
        <div className="text-center p-4">
          <p className="text-sm text-gray-600 mb-2">
            MetaTrader 5 Chart Integration
          </p>
          <p className="text-xs text-gray-500 mb-3">
            For full MT5 functionality, please use the external link above to access the MetaTrader 5 platform.
          </p>
          <a 
            href="https://www.metatrader5.com/en/terminal" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-xs flex items-center justify-center text-blue-600 hover:text-blue-800 underline"
          >
            Download MetaTrader 5
            <ExternalLink size={12} className="ml-1" />
          </a>
        </div>
      </div>
    );
  };

  const getChartHeight = () => {
    switch (chartSize) {
      case 'small': return 'h-48 md:h-64';
      case 'large': return 'h-96 md:h-[32rem]';
      default: return 'h-72 md:h-96';
    }
  };

  const renderSelectedChart = () => {
    if (settings.chartSource === 'tradingview') {
      return renderTradingViewChart();
    } else if (settings.chartSource === 'mt5') {
      return renderMT5Chart();
    } else {
      // Internal chart
      return settings.chartType === 'line' ? renderLineChart() : renderCandlestick();
    }
  };

  return (
    <GlassCard variant="elevated" className={`p-4 ${getChartHeight()}`}>
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-medium">Price Chart</h3>
        <div className="flex items-center space-x-2">
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-blue-500 mr-1" />
            <span className="text-xs">{settings.selectedCurrency}</span>
          </div>
          {entryPrice && (
            <div className="text-xs px-2 py-0.5 bg-blue-50 text-blue-700 rounded-full">
              Entry: ${entryPrice.toFixed(2)}
            </div>
          )}
        </div>
      </div>
      
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2">
          <Select 
            value={settings.chartSource} 
            onValueChange={(value) => updateSettings({ chartSource: value as 'internal' | 'tradingview' | 'mt5' })}
          >
            <SelectTrigger className="h-8 w-36">
              <SelectValue placeholder="Chart Source" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="internal">Basic Chart</SelectItem>
              <SelectItem value="tradingview">TradingView</SelectItem>
              <SelectItem value="mt5">MetaTrader 5</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={chartSize} onValueChange={(value) => setChartSize(value as 'small' | 'medium' | 'large')}>
            <SelectTrigger className="h-8 w-32">
              <SelectValue placeholder="Chart Size" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="small">Small</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="large">Large</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        {(settings.chartSource === 'tradingview' || settings.chartSource === 'mt5') && (
          <a 
            href={settings.chartSource === 'tradingview' 
              ? `https://www.tradingview.com/chart/?symbol=${settings.selectedCurrency}` 
              : `https://www.metatrader5.com/en/terminal`} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-xs flex items-center text-blue-600 hover:text-blue-800"
          >
            Open {settings.chartSource === 'tradingview' ? 'TradingView' : 'MT5'}
            <ExternalLink size={12} className="ml-1" />
          </a>
        )}
      </div>
      
      <div className="h-[85%]">
        {settings.chartSource === 'internal' ? (
          <ResponsiveContainer width="100%" height="100%">
            {settings.chartType === 'line' ? renderLineChart() : renderCandlestick()}
          </ResponsiveContainer>
        ) : (
          renderSelectedChart()
        )}
      </div>
    </GlassCard>
  );
};

export default TradingChart;
