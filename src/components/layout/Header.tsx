
import React from 'react';
import { cn } from '@/lib/utils';
import { ArrowUpRight, BarChart3, Settings } from 'lucide-react';
import IconButton from '../common/IconButton';

interface HeaderProps extends React.HTMLAttributes<HTMLElement> {
  className?: string;
}

const Header = ({ className, ...props }: HeaderProps) => {
  return (
    <header
      className={cn(
        'w-full py-4 px-6 flex items-center justify-between bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-10',
        className
      )}
      {...props}
    >
      <div className="flex items-center space-x-2">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center">
          <div className="w-3 h-3 bg-white rounded-sm transform rotate-45" />
        </div>
        <div>
          <h1 className="font-bold text-lg tracking-tight">Element A</h1>
          <p className="text-xs text-gray-500">Trading Bot</p>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <IconButton 
          icon={<BarChart3 size={18} />} 
          variant="ghost" 
          size="sm"
          label="Analytics"
        />
        <IconButton 
          icon={<Settings size={18} />} 
          variant="ghost" 
          size="sm"
          label="Settings"
        />
        <button className="flex items-center text-xs px-3 py-1.5 rounded-full bg-blue-50 text-blue-700 font-medium transition-all hover:bg-blue-100">
          <span>Demo Mode</span>
          <ArrowUpRight size={14} className="ml-1" />
        </button>
      </div>
    </header>
  );
};

export default Header;
