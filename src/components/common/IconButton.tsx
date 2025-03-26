
import React from 'react';
import { cn } from '@/lib/utils';

interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: React.ReactNode;
  label?: string;
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline';
  size?: 'sm' | 'md' | 'lg';
}

const IconButton = ({
  icon,
  label,
  variant = 'primary',
  size = 'md',
  className,
  ...props
}: IconButtonProps) => {
  const variantClasses = {
    primary: 'bg-primary text-primary-foreground hover:bg-primary/90',
    secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/90',
    ghost: 'hover:bg-secondary hover:text-secondary-foreground',
    outline: 'border border-input bg-transparent hover:bg-secondary hover:text-secondary-foreground',
  };

  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-10 w-10',
    lg: 'h-12 w-12',
  };

  return (
    <button
      className={cn(
        'rounded-full flex items-center justify-center transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/30 button-glow',
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
      aria-label={label}
      title={label}
      {...props}
    >
      {icon}
    </button>
  );
};

export default IconButton;
