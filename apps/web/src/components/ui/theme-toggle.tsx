'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useTheme, Theme } from '@/hooks/useTheme';
import { useSystemTheme } from '@/hooks/useTheme';
import { Sun, Moon, Monitor } from 'lucide-react';

export function ThemeToggle() {
  const { theme, setTheme, actualTheme } = useTheme();
  const systemTheme = useSystemTheme();

  const getCurrentThemeIcon = () => {
    if (theme === 'system') return Monitor;
    return theme === 'light' ? Sun : Moon;
  };

  const getCurrentThemeLabel = () => {
    if (theme === 'system') return `System (${systemTheme})`;
    return theme.charAt(0).toUpperCase() + theme.slice(1);
  };

  const CurrentIcon = getCurrentThemeIcon();

  return (
    <Select value={theme} onValueChange={(value: Theme) => setTheme(value)}>
      <SelectTrigger className="w-auto h-8 bg-zinc-900/50 border-zinc-700 hover:bg-zinc-800/50 text-zinc-300">
        <div className="flex items-center gap-2">
          <CurrentIcon className="h-4 w-4" />
          <span className="hidden sm:inline text-sm">{getCurrentThemeLabel()}</span>
        </div>
      </SelectTrigger>
      <SelectContent className="bg-zinc-900 border-zinc-700">
        <SelectItem value="light" className="text-zinc-300 hover:bg-zinc-800 hover:text-zinc-200">
          <div className="flex items-center gap-2">
            <Sun className="h-4 w-4" />
            <span>Light</span>
          </div>
        </SelectItem>
        <SelectItem value="dark" className="text-zinc-300 hover:bg-zinc-800 hover:text-zinc-200">
          <div className="flex items-center gap-2">
            <Moon className="h-4 w-4" />
            <span>Dark</span>
          </div>
        </SelectItem>
        <SelectItem value="system" className="text-zinc-300 hover:bg-zinc-800 hover:text-zinc-200">
          <div className="flex items-center gap-2">
            <Monitor className="h-4 w-4" />
            <span>System ({systemTheme})</span>
          </div>
        </SelectItem>
      </SelectContent>
    </Select>
  );
}

// Simple theme toggle button (just light/dark toggle)
export function SimpleThemeToggle() {
  const { toggleTheme, actualTheme } = useTheme();
  const Icon = actualTheme === 'light' ? Sun : Moon;

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleTheme}
      className="h-8 w-8 px-0 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50"
      title={`Switch to ${actualTheme === 'light' ? 'dark' : 'light'} theme`}
    >
      <Icon className="h-4 w-4" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
