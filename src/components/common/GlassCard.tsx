
import React from 'react';
import { cn } from '@/lib/utils';

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'elevated' | 'subtle';
}

const GlassCard = ({
  children,
  className,
  variant = 'default',
  ...props
}: GlassCardProps) => {
  const variantClasses = {
    default: 'bg-white/80 backdrop-blur-md shadow-sm border border-white/20',
    elevated: 'bg-white/90 backdrop-blur-lg shadow-md border border-white/30',
    subtle: 'bg-white/60 backdrop-blur-sm shadow-xs border border-white/10',
  };

  return (
    <div
      className={cn(
        'rounded-lg transition-all duration-300 animate-fade-in',
        variantClasses[variant],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export default GlassCard;
