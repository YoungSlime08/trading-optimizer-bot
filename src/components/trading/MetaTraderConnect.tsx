
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useTrading } from '@/context/TradingContext';
import { useToast } from '@/components/ui/use-toast';
import { Wifi, WifiOff } from 'lucide-react';
import GlassCard from '../common/GlassCard';

const MetaTraderConnect = () => {
  const { toast } = useToast();
  const { connectToMetaTrader, disconnectFromMetaTrader, isMetaTraderConnected } = useTrading();
  const [endpoint, setEndpoint] = useState<string>('http://localhost:5555');
  const [isConnecting, setIsConnecting] = useState<boolean>(false);
  
  const handleConnect = async () => {
    if (!endpoint) {
      toast({
        title: "Invalid Endpoint",
        description: "Please enter a valid MetaTrader 5 endpoint",
        variant: "destructive",
      });
      return;
    }
    
    setIsConnecting(true);
    
    try {
      const success = await connectToMetaTrader(endpoint);
      if (!success) {
        toast({
          title: "Connection Failed",
          description: "Failed to connect to MetaTrader 5",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Connection error:', error);
      toast({
        title: "Connection Error",
        description: "An error occurred while connecting to MetaTrader 5",
        variant: "destructive",
      });
    } finally {
      setIsConnecting(false);
    }
  };
  
  const handleDisconnect = () => {
    disconnectFromMetaTrader();
  };
  
  return (
    <GlassCard variant="subtle" className="p-4">
      <h3 className="text-sm font-medium mb-3">MetaTrader 5 Connection</h3>
      
      {isMetaTraderConnected() ? (
        <div className="space-y-3">
          <div className="flex items-center text-xs text-green-600 bg-green-50 p-2 rounded-md">
            <Wifi size={14} className="mr-2" />
            <span>Connected to MetaTrader 5</span>
          </div>
          <Button 
            variant="outline" 
            onClick={handleDisconnect}
            className="w-full"
            size="sm"
          >
            <WifiOff size={14} className="mr-2" />
            Disconnect
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Input
              value={endpoint}
              onChange={(e) => setEndpoint(e.target.value)}
              placeholder="MetaTrader 5 endpoint"
              className="text-xs"
              size={30}
            />
            <Button 
              onClick={handleConnect}
              disabled={isConnecting}
              size="sm"
            >
              {isConnecting ? 'Connecting...' : 'Connect'}
            </Button>
          </div>
          <p className="text-xs text-gray-500">
            * For demo purposes, any valid URL will simulate a connection
          </p>
        </div>
      )}
    </GlassCard>
  );
};

export default MetaTraderConnect;
