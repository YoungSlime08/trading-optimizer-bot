
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
import { 
  RocketIcon, 
  ApertureIcon, 
  TimerIcon, 
  AlertTriangleIcon,
  LineChartIcon,
  TrendingUpIcon,
  BarChart3Icon,
  ActivityIcon,
  DotIcon,
  MoveIcon
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

const AutoTradingControl = () => {
  const { settings, updateSettings, toggleAutoTrading } = useTrading();
  
  const handleToggleAutoTrading = (checked: boolean) => {
    toggleAutoTrading(checked);
  };

  const handleToggleIndicator = (indicator: keyof typeof settings.enabledIndicators, checked: boolean) => {
    updateSettings({
      enabledIndicators: {
        ...settings.enabledIndicators,
        [indicator]: checked
      }
    });
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
          <div className="flex items-center gap-2">
            <Badge variant={settings.autoTrading ? "success" : "outline"}>
              {settings.autoTrading ? "Active" : "Inactive"}
            </Badge>
            <Switch
              checked={settings.autoTrading}
              onCheckedChange={handleToggleAutoTrading}
              aria-label="Toggle auto-trading"
            />
          </div>
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
            <span className="font-medium">{settings.confirmationCount}/{6}</span>
          </div>
          <Slider
            value={[settings.confirmationCount]}
            min={1}
            max={6}
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

        <Separator className="my-2" />
        
        <div>
          <h4 className="text-sm font-medium mb-2">Enabled Indicators</h4>
          <div className="grid grid-cols-2 gap-x-4 gap-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="indicator-sma" 
                checked={settings.enabledIndicators.sma}
                onCheckedChange={(checked) => handleToggleIndicator('sma', !!checked)}
                disabled={!settings.autoTrading}
              />
              <label htmlFor="indicator-sma" className="text-sm flex items-center cursor-pointer">
                <LineChartIcon className="h-3.5 w-3.5 mr-1 text-blue-500" />
                SMA (50)
              </label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="indicator-ema" 
                checked={settings.enabledIndicators.ema}
                onCheckedChange={(checked) => handleToggleIndicator('ema', !!checked)}
                disabled={!settings.autoTrading}
              />
              <label htmlFor="indicator-ema" className="text-sm flex items-center cursor-pointer">
                <TrendingUpIcon className="h-3.5 w-3.5 mr-1 text-indigo-500" />
                EMA (9)
              </label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="indicator-rsi" 
                checked={settings.enabledIndicators.rsi}
                onCheckedChange={(checked) => handleToggleIndicator('rsi', !!checked)}
                disabled={!settings.autoTrading}
              />
              <label htmlFor="indicator-rsi" className="text-sm flex items-center cursor-pointer">
                <ActivityIcon className="h-3.5 w-3.5 mr-1 text-purple-500" />
                RSI (14)
              </label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="indicator-macd" 
                checked={settings.enabledIndicators.macd}
                onCheckedChange={(checked) => handleToggleIndicator('macd', !!checked)}
                disabled={!settings.autoTrading}
              />
              <label htmlFor="indicator-macd" className="text-sm flex items-center cursor-pointer">
                <BarChart3Icon className="h-3.5 w-3.5 mr-1 text-green-500" />
                MACD
              </label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="indicator-bollinger" 
                checked={settings.enabledIndicators.bollinger}
                onCheckedChange={(checked) => handleToggleIndicator('bollinger', !!checked)}
                disabled={!settings.autoTrading}
              />
              <label htmlFor="indicator-bollinger" className="text-sm flex items-center cursor-pointer">
                <DotIcon className="h-3.5 w-3.5 mr-1 text-orange-500" />
                Bollinger
              </label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="indicator-parabolicSar" 
                checked={settings.enabledIndicators.parabolicSar}
                onCheckedChange={(checked) => handleToggleIndicator('parabolicSar', !!checked)}
                disabled={!settings.autoTrading}
              />
              <label htmlFor="indicator-parabolicSar" className="text-sm flex items-center cursor-pointer">
                <MoveIcon className="h-3.5 w-3.5 mr-1 text-red-500" />
                Parabolic SAR
              </label>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="pt-0">
        <div className="w-full rounded-md bg-blue-50 p-2 text-xs text-blue-800">
          <p className="font-medium">Target: 80%+ Win Rate</p>
          <p className="text-blue-700 mt-0.5">
            The bot uses smart entry criteria with SMA, EMA, RSI, MACD, Bollinger Bands, and Parabolic SAR to achieve high accuracy trades.
          </p>
        </div>
      </CardFooter>
    </Card>
  );
};

export default AutoTradingControl;
