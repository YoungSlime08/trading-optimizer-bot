
import React from 'react';
import { Toggle } from '@/components/ui/toggle';
import { useTrading } from '@/context/TradingContext';
import { Slider } from '@/components/ui/slider';
import { CheckCircle, XCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';

const AutoTradingControl = () => {
  const { settings, toggleAutoTrading, updateSettings } = useTrading();
  
  const handleIndicatorToggle = (name: keyof typeof settings.enabledIndicators) => {
    updateSettings({
      enabledIndicators: {
        ...settings.enabledIndicators,
        [name]: !settings.enabledIndicators[name]
      }
    });
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
      
      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="indicator-sma" 
            checked={settings.enabledIndicators.sma}
            onCheckedChange={() => handleIndicatorToggle('sma')}
          />
          <label htmlFor="indicator-sma" className="text-xs cursor-pointer">
            SMA
          </label>
        </div>
        
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="indicator-ema" 
            checked={settings.enabledIndicators.ema}
            onCheckedChange={() => handleIndicatorToggle('ema')}
          />
          <label htmlFor="indicator-ema" className="text-xs cursor-pointer">
            EMA
          </label>
        </div>
        
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="indicator-rsi" 
            checked={settings.enabledIndicators.rsi}
            onCheckedChange={() => handleIndicatorToggle('rsi')}
          />
          <label htmlFor="indicator-rsi" className="text-xs cursor-pointer">
            RSI
          </label>
        </div>
        
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="indicator-macd" 
            checked={settings.enabledIndicators.macd}
            onCheckedChange={() => handleIndicatorToggle('macd')}
          />
          <label htmlFor="indicator-macd" className="text-xs cursor-pointer">
            MACD
          </label>
        </div>
        
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="indicator-bollinger" 
            checked={settings.enabledIndicators.bollinger}
            onCheckedChange={() => handleIndicatorToggle('bollinger')}
          />
          <label htmlFor="indicator-bollinger" className="text-xs cursor-pointer">
            Bollinger
          </label>
        </div>
        
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="indicator-parabolicsar" 
            checked={settings.enabledIndicators.parabolicSar}
            onCheckedChange={() => handleIndicatorToggle('parabolicSar')}
          />
          <label htmlFor="indicator-parabolicsar" className="text-xs cursor-pointer">
            Parabolic SAR
          </label>
        </div>
      </div>
    </div>
  );
};

export default AutoTradingControl;
