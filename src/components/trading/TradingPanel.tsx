import React, { useState } from 'react';
import { AlertTriangle, ArrowDown, ArrowUp, BarChart3, TrendingUp, LineChart, InfoIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTrading } from '@/context/TradingContext';
import { formatCurrency, formatPercentage } from '@/utils/tradingUtils';
import RiskManagementSlider from './RiskManagementSlider';
import GlassCard from '../common/GlassCard';
import { useToast } from '@/components/ui/use-toast';
import AutoTradingControl from './AutoTradingControl';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Toggle } from "@/components/ui/toggle";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const TradingPanel = () => {
  const { toast } = useToast();
  const { 
    settings, 
    updateSettings, 
    executeNewTrade,
    accountStats,
    activeTrades,
    indicators,
    availableCurrencies,
    isMetaTraderConnected,
    executeMT5Trade
  } = useTrading();
  
  const [simulatedPrice, setSimulatedPrice] = useState(100);
  
  // Calculate how many trades can be taken with current settings
  const maxPossibleTrades = Math.floor(100 / settings.riskPercentage);
  
  // Calculate overall position strength based on indicators
  const signalStrength = indicators.reduce((acc, indicator) => {
    if (indicator.signal === 'buy') return acc + indicator.strength;
    if (indicator.signal === 'sell') return acc - indicator.strength;
    return acc;
  }, 0) / indicators.length;
  
  // Interpret signal strength
  let signalDirection = 'neutral';
  let signalColor = 'text-trading-neutral';
  
  if (signalStrength > 0.1) {
    signalDirection = 'buy';
    signalColor = 'text-trading-profit';
  } else if (signalStrength < -0.1) {
    signalDirection = 'sell';
    signalColor = 'text-trading-loss';
  }
  
  const handleExecuteTrade = async (direction: 'long' | 'short') => {
    if (activeTrades.length >= settings.maxTrades) {
      toast({
        title: "Maximum trades reached",
        description: `You can have maximum ${settings.maxTrades} trades based on your current settings.`,
        variant: "destructive",
      });
      return;
    }
    
    // Use MetaTrader if connected
    if (settings.metaTraderEnabled && isMetaTraderConnected()) {
      const success = await executeMT5Trade(direction, simulatedPrice);
      if (success) {
        toast({
          title: `${direction === 'long' ? 'Buy' : 'Sell'} order executed via MetaTrader 5`,
          description: `${settings.selectedCurrency} at ${formatCurrency(simulatedPrice)}`,
        });
        // Generate new price for next trade
        setSimulatedPrice(prev => prev * (1 + (Math.random() - 0.5) * 0.03));
      } else {
        toast({
          title: "Order execution failed",
          description: "Failed to execute order via MetaTrader 5",
          variant: "destructive",
        });
      }
      return;
    }
    
    // Execute in simulation mode
    executeNewTrade(direction, simulatedPrice);
    
    // Generate new price for next trade
    setSimulatedPrice(prev => prev * (1 + (Math.random() - 0.5) * 0.03));
    
    toast({
      title: `${direction === 'long' ? 'Buy' : 'Sell'} order executed`,
      description: `Entry price: ${formatCurrency(simulatedPrice)}`,
    });
  };

  const handleCurrencyChange = (value: string) => {
    updateSettings({ selectedCurrency: value });
    
    // Update simulated price based on the selected currency
    const randomFactor = 0.9 + Math.random() * 0.2; // Between 0.9 and 1.1
    
    if (value.includes('BTC')) {
      setSimulatedPrice(20000 * randomFactor);
    } else if (value.includes('ETH')) {
      setSimulatedPrice(1800 * randomFactor);
    } else if (value.includes('EUR') || value.includes('GBP')) {
      setSimulatedPrice(1.10 * randomFactor);
    } else if (value.includes('JPY')) {
      setSimulatedPrice(150 * randomFactor);
    } else if (value.includes('XAU')) {
      setSimulatedPrice(2000 * randomFactor);
    } else if (value.includes('US30') || value.includes('US500')) {
      setSimulatedPrice(4500 * randomFactor);
    } else if (availableCurrencies.find(c => c.type === 'stock' && c.symbol === value)) {
      setSimulatedPrice(120 * randomFactor);
    } else {
      setSimulatedPrice(100 * randomFactor);
    }
  };

  const toggleChartType = () => {
    updateSettings({ 
      chartType: settings.chartType === 'line' ? 'candlestick' : 'line' 
    });
  };

  const handleAccountSizeChange = (size: 'small' | 'medium' | 'large') => {
    let initialBalance;
    
    switch(size) {
      case 'small':
        initialBalance = 10 + Math.floor(Math.random() * 41); // $10-$50
        break;
      case 'medium':
        initialBalance = 50 + Math.floor(Math.random() * 151); // $50-$200
        break;
      case 'large':
        initialBalance = 500 + Math.floor(Math.random() * 1501); // $500-$2000
        break;
    }
    
    updateSettings({ 
      accountSize: size,
      initialBalance
    });
    
    toast({
      title: `Account size changed to ${size}`,
      description: `Initial balance set to ${formatCurrency(initialBalance)}`,
    });
  };

  return (
    <GlassCard variant="elevated" className="p-4 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Element A Trading</h2>
        <div className="px-2 py-1 text-xs rounded-full bg-blue-50 text-blue-600 font-medium flex items-center space-x-1">
          <TrendingUp size={14} />
          <span>MT5 Trading</span>
        </div>
      </div>
      
      {/* Account Size Selection */}
      <div>
        <h3 className="text-sm font-semibold mb-2">Account Configuration</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Account Size</label>
            <Tabs 
              defaultValue={settings.accountSize} 
              className="w-full" 
              onValueChange={(value) => handleAccountSizeChange(value as 'small' | 'medium' | 'large')}
            >
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="small">Small</TabsTrigger>
                <TabsTrigger value="medium">Medium</TabsTrigger>
                <TabsTrigger value="large">Large</TabsTrigger>
              </TabsList>
              <div className="mt-1 text-xs text-gray-500">
                {settings.accountSize === 'small' && 'Balance: $10-$50'}
                {settings.accountSize === 'medium' && 'Balance: $50-$200'}
                {settings.accountSize === 'large' && 'Balance: $500+'}
              </div>
            </Tabs>
          </div>
          <div>
            <label className="text-xs text-gray-500 mb-1 block">
              Maximum Trades
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <InfoIcon className="h-3 w-3 inline ml-1 text-gray-400" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="text-xs">Max number of simultaneous open positions</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </label>
            <RiskManagementSlider
              label="Max Trades"
              value={settings.maxTrades}
              min={2}
              max={300}
              step={1}
              onChange={(value) => updateSettings({ maxTrades: value })}
              formatValue={(v) => `${v} trades`}
            />
          </div>
        </div>
      </div>
      
      {/* Auto Trading Control */}
      <AutoTradingControl />
      
      <div className="flex items-center justify-between gap-2">
        <Select value={settings.selectedCurrency} onValueChange={handleCurrencyChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select Currency" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Cryptocurrencies</SelectLabel>
              {availableCurrencies
                .filter(c => c.type === 'crypto')
                .map(currency => (
                  <SelectItem key={currency.symbol} value={currency.symbol}>
                    {currency.name}
                  </SelectItem>
                ))
              }
            </SelectGroup>
            <SelectGroup>
              <SelectLabel>Forex</SelectLabel>
              {availableCurrencies
                .filter(c => c.type === 'forex')
                .map(currency => (
                  <SelectItem key={currency.symbol} value={currency.symbol}>
                    {currency.name}
                  </SelectItem>
                ))
              }
            </SelectGroup>
            <SelectGroup>
              <SelectLabel>Indices</SelectLabel>
              {availableCurrencies
                .filter(c => c.type === 'indices')
                .map(currency => (
                  <SelectItem key={currency.symbol} value={currency.symbol}>
                    {currency.name}
                  </SelectItem>
                ))
              }
            </SelectGroup>
            <SelectGroup>
              <SelectLabel>Commodities</SelectLabel>
              {availableCurrencies
                .filter(c => c.type === 'commodities')
                .map(currency => (
                  <SelectItem key={currency.symbol} value={currency.symbol}>
                    {currency.name}
                  </SelectItem>
                ))
              }
            </SelectGroup>
            <SelectGroup>
              <SelectLabel>Stocks</SelectLabel>
              {availableCurrencies
                .filter(c => c.type === 'stock')
                .map(currency => (
                  <SelectItem key={currency.symbol} value={currency.symbol}>
                    {currency.name}
                  </SelectItem>
                ))
              }
            </SelectGroup>
          </SelectContent>
        </Select>
        
        <Toggle 
          pressed={settings.chartType === 'candlestick'} 
          onPressedChange={toggleChartType}
          aria-label="Toggle chart type"
        >
          {settings.chartType === 'line' ? (
            <LineChart size={16} className="mr-1" />
          ) : (
            <BarChart3 size={16} className="mr-1" />
          )}
          {settings.chartType === 'line' ? 'Line' : 'Candles'}
        </Toggle>
      </div>
      
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <div className="px-3 py-2 rounded-md bg-gray-50">
          <p className="text-xs text-gray-500">Balance</p>
          <p className="text-sm font-semibold">{formatCurrency(accountStats.balance)}</p>
        </div>
        <div className="px-3 py-2 rounded-md bg-gray-50">
          <p className="text-xs text-gray-500">Open Positions</p>
          <p className="text-sm font-semibold">{accountStats.openPositions}</p>
        </div>
        <div className="px-3 py-2 rounded-md bg-gray-50">
          <p className="text-xs text-gray-500">Win Rate</p>
          <p className="text-sm font-semibold">{accountStats.winRate.toFixed(1)}%</p>
        </div>
        <div className="px-3 py-2 rounded-md bg-gray-50">
          <p className="text-xs text-gray-500">Profit Factor</p>
          <p className="text-sm font-semibold">{accountStats.profitFactor.toFixed(2)}</p>
        </div>
      </div>
      
      <div>
        <h3 className="text-sm font-semibold mb-3">Risk Management</h3>
        <div className="space-y-4">
          <RiskManagementSlider
            label="Risk Per Trade"
            description="Maximum % of account balance at risk per trade"
            value={settings.riskPercentage}
            min={1}
            max={10}
            step={0.5}
            onChange={(value) => updateSettings({ riskPercentage: value })}
            formatValue={(v) => `${v}%`}
            colorScale={true}
          />
          
          <div className="grid grid-cols-2 gap-4">
            <RiskManagementSlider
              label="Stop Loss"
              value={settings.stopLossPercent}
              min={1}
              max={5}
              step={0.25}
              onChange={(value) => updateSettings({ stopLossPercent: value })}
              formatValue={(v) => `${v}%`}
            />
            
            <RiskManagementSlider
              label="Take Profit"
              value={settings.takeProfitPercent}
              min={settings.stopLossPercent * 1.5}
              max={settings.stopLossPercent * 3}
              step={0.25}
              onChange={(value) => updateSettings({ takeProfitPercent: value })}
              formatValue={(v) => `${v}%`}
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <RiskManagementSlider
              label="Partial Take %"
              description="Percentage to close at take profit"
              value={settings.partialTakePercentage}
              min={10}
              max={50}
              step={5}
              onChange={(value) => updateSettings({ partialTakePercentage: value })}
              formatValue={(v) => `${v}%`}
            />
            
            <RiskManagementSlider
              label="TP Levels"
              description="Maximum take profit levels"
              value={settings.maxTakeProfit}
              min={1}
              max={5}
              step={1}
              onChange={(value) => updateSettings({ maxTakeProfit: value })}
              formatValue={(v) => `${v}`}
            />
          </div>
        </div>
      </div>
      
      <div>
        <h3 className="text-sm font-semibold mb-3">Trading Signals</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {indicators.map((indicator, index) => (
            <div 
              key={index} 
              className="px-3 py-2 rounded-md bg-gray-50"
            >
              <div className="flex items-center justify-between">
                <p className="text-xs text-gray-500">{indicator.name}</p>
                {indicator.description && (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <InfoIcon className="h-3 w-3 text-gray-400" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="text-xs">{indicator.description}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
              </div>
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold">{indicator.value}</p>
                <Badge 
                  variant={
                    indicator.signal === 'buy' ? 'default' :
                    indicator.signal === 'sell' ? 'destructive' : 'outline'
                  }
                  className={`text-[10px] h-5 ${indicator.signal === 'buy' ? 'bg-green-500' : ''}`}
                >
                  {indicator.signal.toUpperCase()}
                </Badge>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-3 p-2 rounded-md bg-gray-50 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-xs font-medium">Overall Signal:</span>
            <span className={`text-xs font-bold ${signalColor}`}>
              {signalDirection.toUpperCase()}
            </span>
          </div>
          <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className={`h-full ${
                signalDirection === 'buy' ? 'bg-trading-profit' : 
                signalDirection === 'sell' ? 'bg-trading-loss' : 
                'bg-trading-neutral'
              }`}
              style={{ 
                width: `${Math.abs(signalStrength) * 100}%`,
                marginLeft: signalDirection === 'sell' ? '50%' : signalDirection === 'neutral' ? '50%' : '0%'
              }}
            ></div>
          </div>
        </div>
      </div>
      
      <div className="pt-2">
        <div className="grid grid-cols-1 gap-y-2 gap-x-4 sm:grid-cols-2">
          <Button
            onClick={() => handleExecuteTrade('long')}
            className="bg-trading-profit hover:bg-trading-profit/90 text-white flex items-center justify-center py-6 button-glow"
          >
            <ArrowUp className="mr-2 h-4 w-4" />
            Buy / Long
          </Button>
          
          <Button
            onClick={() => handleExecuteTrade('short')}
            className="bg-trading-loss hover:bg-trading-loss/90 text-white flex items-center justify-center py-6 button-glow"
          >
            <ArrowDown className="mr-2 h-4 w-4" />
            Sell / Short
          </Button>
        </div>
        
        <p className="text-xs text-gray-500 mt-2 flex items-center">
          <AlertTriangle size={12} className="mr-1" />
          Maximum {settings.maxTrades} of {maxPossibleTrades} possible trades with current risk settings
        </p>
      </div>
    </GlassCard>
  );
};

export default TradingPanel;
