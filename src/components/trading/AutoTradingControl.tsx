
import React from 'react';
import { Toggle } from '@/components/ui/toggle';
import { useTrading } from '@/context/TradingContext';
import { Slider } from '@/components/ui/slider';
import { CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useToast } from '@/components/ui/use-toast';

const AutoTradingControl = () => {
  const { settings, toggleAutoTrading, updateSettings } = useTrading();
  const { toast } = useToast();
  
  const handleIndicatorToggle = (name: keyof typeof settings.enabledIndicators) => {
    // Check if at least one indicator will remain enabled
    const currentlyEnabled = Object.values(settings.enabledIndicators).filter(Boolean).length;
    
    if (currentlyEnabled <= 1 && settings.enabledIndicators[name]) {
      toast({
        title: "Warning",
        description: "At least one indicator must be enabled for auto-trading",
        variant: "destructive",
      });
      return;
    }
    
    updateSettings({
      enabledIndicators: {
        ...settings.enabledIndicators,
        [name]: !settings.enabledIndicators[name]
      }
    });
  };

  const getEnabledCount = () => {
    return Object.values(settings.enabledIndicators).filter(Boolean).length;
  };
  
  return (
    <div className="border border-gray-100 rounded-lg p-3 bg-gray-50/60 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <h3 className="text-sm font-semibold">Auto-Trading</h3>
          <Badge variant={settings.autoTrading ? "default" : "outline"} className={settings.autoTrading ? "bg-green-500" : ""}>
            {settings.autoTrading ? 'Active' : 'Disabled'}
          </Badge>
        </div>
        <Toggle 
          pressed={settings.autoTrading} 
          onPressedChange={toggleAutoTrading}
          size="sm"
          className={settings.autoTrading ? "bg-green-500 text-white" : ""}
        >
          {settings.autoTrading ? 'Running' : 'Start Bot'}
        </Toggle>
      </div>
      
      {settings.autoTrading && (
        <div className="text-xs px-2 py-1 bg-yellow-50 text-yellow-700 rounded-md flex items-center">
          <AlertTriangle size={12} className="mr-1 flex-shrink-0" />
          <span>Auto-trading is using {getEnabledCount()} indicators with {(settings.minSignalStrength * 100).toFixed(0)}% signal strength</span>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-xs text-gray-500 flex items-center justify-between">
            Signal Strength
            <span className="font-medium">{(settings.minSignalStrength * 100).toFixed(0)}%</span>
          </label>
          <Slider 
            value={[settings.minSignalStrength * 100]} 
            min={50} 
            max={95} 
            step={5}
            className="mt-1"
            onValueChange={(value) => updateSettings({ minSignalStrength: value[0] / 100 })}
          />
        </div>
        
        <div>
          <label className="text-xs text-gray-500 flex items-center justify-between">
            Confirmations
            <span className="font-medium">{settings.confirmationCount}</span>
          </label>
          <Slider 
            value={[settings.confirmationCount]} 
            min={1} 
            max={5} 
            step={1}
            className="mt-1"
            onValueChange={(value) => updateSettings({ confirmationCount: value[0] })}
          />
        </div>
      </div>
      
      <div>
        <div className="flex items-center justify-between">
          <label className="text-xs text-gray-500">Scan Interval</label>
          <span className="text-xs font-medium">{settings.tradingInterval} sec</span>
        </div>
        <Slider 
          value={[settings.tradingInterval]} 
          min={5} 
          max={60} 
          step={5}
          className="mt-1"
          onValueChange={(value) => updateSettings({ tradingInterval: value[0] })}
        />
      </div>
      
      <div>
        <div className="flex items-center justify-between mb-1">
          <label className="text-xs text-gray-500">Enabled Indicators</label>
          <span className="text-xs font-medium">{getEnabledCount()} of 6</span>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          <TooltipProvider>
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="indicator-sma" 
                checked={settings.enabledIndicators.sma}
                onCheckedChange={() => handleIndicatorToggle('sma')}
              />
              <Tooltip>
                <TooltipTrigger asChild>
                  <label htmlFor="indicator-sma" className="text-xs cursor-pointer">
                    SMA
                  </label>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-xs">Simple Moving Average</p>
                </TooltipContent>
              </Tooltip>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="indicator-ema" 
                checked={settings.enabledIndicators.ema}
                onCheckedChange={() => handleIndicatorToggle('ema')}
              />
              <Tooltip>
                <TooltipTrigger asChild>
                  <label htmlFor="indicator-ema" className="text-xs cursor-pointer">
                    EMA
                  </label>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-xs">Exponential Moving Average</p>
                </TooltipContent>
              </Tooltip>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="indicator-rsi" 
                checked={settings.enabledIndicators.rsi}
                onCheckedChange={() => handleIndicatorToggle('rsi')}
              />
              <Tooltip>
                <TooltipTrigger asChild>
                  <label htmlFor="indicator-rsi" className="text-xs cursor-pointer">
                    RSI
                  </label>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-xs">Relative Strength Index</p>
                </TooltipContent>
              </Tooltip>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="indicator-macd" 
                checked={settings.enabledIndicators.macd}
                onCheckedChange={() => handleIndicatorToggle('macd')}
              />
              <Tooltip>
                <TooltipTrigger asChild>
                  <label htmlFor="indicator-macd" className="text-xs cursor-pointer">
                    MACD
                  </label>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-xs">Moving Average Convergence Divergence</p>
                </TooltipContent>
              </Tooltip>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="indicator-bollinger" 
                checked={settings.enabledIndicators.bollinger}
                onCheckedChange={() => handleIndicatorToggle('bollinger')}
              />
              <Tooltip>
                <TooltipTrigger asChild>
                  <label htmlFor="indicator-bollinger" className="text-xs cursor-pointer">
                    Bollinger
                  </label>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-xs">Bollinger Bands</p>
                </TooltipContent>
              </Tooltip>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="indicator-parabolicsar" 
                checked={settings.enabledIndicators.parabolicSar}
                onCheckedChange={() => handleIndicatorToggle('parabolicSar')}
              />
              <Tooltip>
                <TooltipTrigger asChild>
                  <label htmlFor="indicator-parabolicsar" className="text-xs cursor-pointer">
                    Parabolic SAR
                  </label>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-xs">Parabolic Stop and Reverse</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </TooltipProvider>
        </div>
      </div>
    </div>
  );
};

export default AutoTradingControl;
