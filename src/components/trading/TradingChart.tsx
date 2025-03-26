
import React, { useEffect, useRef, useState } from 'react';
import { Line, LineChart, ResponsiveContainer, CartesianGrid, XAxis, YAxis, Tooltip, ReferenceLine } from 'recharts';
import { generatePriceSeries } from '@/utils/tradingUtils';
import GlassCard from '../common/GlassCard';

interface TradingChartProps {
  activeStopLoss?: number;
  activeTakeProfit?: number;
  entryPrice?: number;
}

const TradingChart = ({ activeStopLoss, activeTakeProfit, entryPrice }: TradingChartProps) => {
  const [data, setData] = useState([]);
  const timeoutRef = useRef(null);

  useEffect(() => {
    // Generate initial data
    const initialPrice = 100;
    const initialData = generatePriceSeries(initialPrice, 20, 0.01).map((price, index) => ({
      time: index,
      price
    }));
    
    setData(initialData);
    
    // Update data periodically with new price points
    timeoutRef.current = setInterval(() => {
      setData(prevData => {
        const lastPrice = prevData[prevData.length - 1].price;
        const volatility = 0.005; // Lower for smoother movement
        const randomChange = (Math.random() - 0.48) * 2 * volatility; // Slightly biased to up
        const newPrice = lastPrice * (1 + randomChange);
        
        // Shift array and add new point
        const newData = [...prevData.slice(1), {
          time: prevData[prevData.length - 1].time + 1,
          price: newPrice
        }];
        
        return newData;
      });
    }, 1000);
    
    return () => clearInterval(timeoutRef.current);
  }, []);

  const formatYAxis = (value) => {
    return value.toFixed(2);
  };
  
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-2 border border-gray-100 shadow-sm rounded text-xs">
          <p>Price: ${payload[0].value.toFixed(2)}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <GlassCard variant="elevated" className="p-4 h-72 md:h-96">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-medium">Price Chart</h3>
        <div className="flex items-center space-x-2">
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-blue-500 mr-1" />
            <span className="text-xs">BTC/USD</span>
          </div>
          {entryPrice && (
            <div className="text-xs px-2 py-0.5 bg-blue-50 text-blue-700 rounded-full">
              Entry: ${entryPrice.toFixed(2)}
            </div>
          )}
        </div>
      </div>
      
      <ResponsiveContainer width="100%" height="90%">
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
      </ResponsiveContainer>
    </GlassCard>
  );
};

export default TradingChart;
