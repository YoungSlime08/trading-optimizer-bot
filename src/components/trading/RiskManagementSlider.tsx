
import React from 'react';
import { Slider } from "@/components/ui/slider";
import { cn } from '@/lib/utils';

interface RiskManagementSliderProps {
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (value: number) => void;
  label: string;
  description?: string;
  formatValue?: (value: number) => string;
  className?: string;
  colorScale?: boolean;
}

const RiskManagementSlider = ({
  value,
  min,
  max,
  step,
  onChange,
  label,
  description,
  formatValue = (v) => `${v}`,
  className,
  colorScale = false,
}: RiskManagementSliderProps) => {
  // Calculate percentage for gradient backgrounds
  const percentage = ((value - min) / (max - min)) * 100;
  
  const getColorClass = () => {
    if (!colorScale) return '';
    
    if (percentage < 33) {
      return 'text-green-600';
    } else if (percentage < 66) {
      return 'text-amber-600';
    } else {
      return 'text-red-600';
    }
  };

  return (
    <div className={cn('space-y-2', className)}>
      <div className="flex items-center justify-between">
        <div>
          <label className="text-sm font-medium">{label}</label>
          {description && (
            <p className="text-xs text-gray-500">{description}</p>
          )}
        </div>
        <span className={cn('text-sm font-medium', getColorClass())}>
          {formatValue(value)}
        </span>
      </div>
      <Slider
        value={[value]}
        min={min}
        max={max}
        step={step}
        onValueChange={([newValue]) => onChange(newValue)}
        className="py-1"
      />
    </div>
  );
};

export default RiskManagementSlider;
