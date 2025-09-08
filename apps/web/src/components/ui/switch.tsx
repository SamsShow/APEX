'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface SwitchProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  disabled?: boolean;
  className?: string;
}

export const Switch: React.FC<SwitchProps> = ({
  checked = false,
  onCheckedChange,
  disabled = false,
  className,
  ...props
}) => {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (onCheckedChange) {
      onCheckedChange(event.target.checked);
    }
  };

  return (
    <label
      className={cn(
        'relative inline-flex items-center cursor-pointer',
        disabled && 'cursor-not-allowed opacity-50',
        className,
      )}
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={handleChange}
        disabled={disabled}
        className="sr-only"
        {...props}
      />
      <div
        className={cn(
          'relative inline-block w-10 h-6 transition-colors duration-200 ease-in-out rounded-full',
          checked ? 'bg-blue-600' : 'bg-gray-300 dark:bg-zinc-600',
        )}
      >
        <div
          className={cn(
            'absolute top-1 w-4 h-4 transition-transform duration-200 ease-in-out bg-white rounded-full shadow',
            checked ? 'translate-x-5' : 'translate-x-1',
          )}
        />
      </div>
    </label>
  );
};
