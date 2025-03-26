import React from 'react';
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
  Area 
} from 'recharts';
import { generatePriceSeries } from '@/utils/tradingUtils';
import GlassCard from '../common/GlassCard';
import { useTrading } from '@/context/TradingContext';

interface TradingChartProps {
  activeStopLoss?: number;
  activeTakeProfit?: number;
  entryPrice?: number;
}

const TradingChart = ({ activeStopLoss, activeTakeProfit, entryPrice }: TradingChartProps) => {
  const { settings, candlestickData } = useTrading();
  
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
          fill={(data) => data.open > data.close ? '#FF5252' : '#4CAF50'}
          yAxisId="volume"
        />
        
        {/* Render volume */}
        <Bar
          dataKey="volume"
          fill="#8884d8"
          opacity={0.3}
          yAxisId="volume"
        />
        
        {activeStopLoss && (
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
        
        {activeTakeProfit && (
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
        
        {entryPrice && (
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
        
        {activeStopLoss && (
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
        
        {activeTakeProfit && (
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
        
        {entryPrice && (
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

  return (
    <GlassCard variant="elevated" className="p-4 h-72 md:h-96">
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
      
      <ResponsiveContainer width="100%" height="90%">
        {settings.chartType === 'line' ? renderLineChart() : renderCandlestick()}
      </ResponsiveContainer>
    </GlassCard>
  );
};

export default TradingChart;
