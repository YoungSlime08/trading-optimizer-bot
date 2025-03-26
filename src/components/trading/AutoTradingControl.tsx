
import React from 'react';
import { Switch } from "@/components/ui/switch";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle,
} from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { useTrading } from '@/context/TradingContext';
import { RocketIcon, ApertureIcon, TimerIcon, AlertTriangleIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

const AutoTradingControl = () => {
  const { settings, updateSettings, toggleAutoTrading } = useTrading();
  
  const handleToggleAutoTrading = (checked: boolean) => {
    toggleAutoTrading(checked);
  };
  
  return (
    <Card className={cn(
      "border-2 transition-colors duration-200",
      settings.autoTrading ? "border-green-400 shadow-md shadow-green-100" : "border-gray-200"
    )}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <RocketIcon 
              className={cn(
                "h-5 w-5 transition-colors", 
                settings.autoTrading ? "text-green-500" : "text-gray-400"
              )} 
            />
            <CardTitle className="text-base">Auto-Trading Bot</CardTitle>
          </div>
          <Switch
            checked={settings.autoTrading}
            onCheckedChange={handleToggleAutoTrading}
            aria-label="Toggle auto-trading"
          />
        </div>
        <CardDescription>
          {settings.autoTrading 
            ? "AI bot is actively looking for trading opportunities" 
            : "Switch on to let the AI find and execute trades for you"}
        </CardDescription>
      </CardHeader>
      <CardContent className="pb-3 pt-1 space-y-4">
        <div className="space-y-1">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-1">
              <ApertureIcon className="h-3.5 w-3.5" /> 
              <span>Signal Strength</span>
            </div>
            <span className="font-medium">{Math.round(settings.minSignalStrength * 100)}%</span>
          </div>
          <Slider
            value={[settings.minSignalStrength * 100]}
            min={30}
            max={95}
            step={5}
            disabled={!settings.autoTrading}
            onValueChange={(values) => {
              updateSettings({ minSignalStrength: values[0] / 100 });
            }}
          />
          <p className="text-xs text-gray-500">Minimum confidence required to execute a trade</p>
        </div>
        
        <div className="space-y-1">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-1">
              <AlertTriangleIcon className="h-3.5 w-3.5" /> 
              <span>Confirmations</span>
            </div>
            <span className="font-medium">{settings.confirmationCount}/{4}</span>
          </div>
          <Slider
            value={[settings.confirmationCount]}
            min={1}
            max={4}
            step={1}
            disabled={!settings.autoTrading}
            onValueChange={(values) => {
              updateSettings({ confirmationCount: values[0] });
            }}
          />
          <p className="text-xs text-gray-500">Minimum indicators confirming the signal</p>
        </div>
        
        <div className="space-y-1">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-1">
              <TimerIcon className="h-3.5 w-3.5" /> 
              <span>Check Interval</span>
            </div>
            <span className="font-medium">{settings.tradingInterval}s</span>
          </div>
          <Slider
            value={[settings.tradingInterval]}
            min={10}
            max={60}
            step={5}
            disabled={!settings.autoTrading}
            onValueChange={(values) => {
              updateSettings({ tradingInterval: values[0] });
            }}
          />
          <p className="text-xs text-gray-500">How often to check for new trading opportunities</p>
        </div>
      </CardContent>
      <CardFooter className="pt-0">
        <div className="w-full rounded-md bg-blue-50 p-2 text-xs text-blue-800">
          <p className="font-medium">Target: 80%+ Win Rate</p>
          <p className="text-blue-700 mt-0.5">
            The bot uses smart entry criteria and multiple confirmation signals to achieve high accuracy trades.
          </p>
        </div>
      </CardFooter>
    </Card>
  );
};

export default AutoTradingControl;
