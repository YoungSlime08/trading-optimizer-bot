
import React from 'react';
import { cn } from '@/lib/utils';

interface FooterProps extends React.HTMLAttributes<HTMLElement> {
  className?: string;
}

const Footer = ({ className, ...props }: FooterProps) => {
  return (
    <footer
      className={cn(
        'w-full py-4 px-6 mt-auto text-center text-sm text-gray-500',
        className
      )}
      {...props}
    >
      <div className="flex flex-col md:flex-row items-center justify-center gap-2 md:gap-4">
        <span>© {new Date().getFullYear()} Element A Trading</span>
        <span className="hidden md:inline">•</span>
        <span>This is a simulation - not financial advice</span>
        <span className="hidden md:inline">•</span>
        <span className="text-xs px-2 py-1 rounded-full bg-gray-100">v1.0.0</span>
      </div>
    </footer>
  );
};

export default Footer;
