'use client';

import { Moon, Sun, Monitor, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { useTheme } from '@/hooks/use-theme';
import type { Theme } from '@/hooks/use-theme';

interface ThemeSwitcherProps {
  theme?: Theme;
  toggleTheme?: (theme?: Theme) => void;
}

export function ThemeSwitcher({ theme: propTheme, toggleTheme: propToggleTheme }: ThemeSwitcherProps) {
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const { theme, resolvedTheme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  const currentTheme = propTheme || theme;
  const handleSetTheme = propToggleTheme || setTheme;
  const isDark = resolvedTheme === 'dark';

  if (!mounted) {
    return (
      <Button
        variant="ghost"
        size="icon"
        className="h-7 w-7 rounded-full"
        aria-label="Toggle theme"
        disabled
      >
        <Sun className="h-4 w-4" />
      </Button>
    );
  }

  const getIcon = () => {
    if (currentTheme === 'system') {
      return <Monitor className="h-4 w-4 transition-transform duration-300" />;
    }
    return isDark ? (
      <Sun className="h-4 w-4 transition-transform duration-300" />
    ) : (
      <Moon className="h-4 w-4 transition-transform duration-300" />
    );
  };

  return (
    <DropdownMenu open={open} onOpenChange={setOpen} modal={false}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            'h-7 w-7 rounded-full transition-all duration-300',
            isDark 
              ? 'bg-primary/20 text-primary hover:bg-primary/30' 
              : 'bg-slate-200/80 text-slate-700 hover:bg-slate-300/80'
          )}
          aria-label="Select theme"
        >
          {getIcon()}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align="end" 
        className={cn(
          "w-48 rounded-xl border shadow-xl backdrop-blur-xl p-1.5",
          isDark 
            ? "bg-[#0d0a16]/95 border-white/10" 
            : "bg-white/95 border-slate-200/50"
        )}
        sideOffset={8}
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <DropdownMenuItem
          onClick={() => {
            handleSetTheme('light');
            setOpen(false);
          }}
          className={cn(
            "flex items-center justify-between cursor-pointer rounded-lg px-3 py-2.5 transition-all",
            isDark
              ? "hover:bg-white/10 text-white"
              : "hover:bg-slate-100 text-slate-900"
          )}
        >
          <div className="flex items-center gap-3">
            <Sun className="h-4 w-4" />
            <span className="text-sm font-medium">Світла</span>
          </div>
          {currentTheme === 'light' && <Check className="h-4 w-4 text-primary" />}
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => {
            handleSetTheme('dark');
            setOpen(false);
          }}
          className={cn(
            "flex items-center justify-between cursor-pointer rounded-lg px-3 py-2.5 transition-all",
            isDark
              ? "hover:bg-white/10 text-white"
              : "hover:bg-slate-100 text-slate-900"
          )}
        >
          <div className="flex items-center gap-3">
            <Moon className="h-4 w-4" />
            <span className="text-sm font-medium">Темна</span>
          </div>
          {currentTheme === 'dark' && <Check className="h-4 w-4 text-primary" />}
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => {
            handleSetTheme('system');
            setOpen(false);
          }}
          className={cn(
            "flex items-center justify-between cursor-pointer rounded-lg px-3 py-2.5 transition-all",
            isDark
              ? "hover:bg-white/10 text-white"
              : "hover:bg-slate-100 text-slate-900"
          )}
        >
          <div className="flex items-center gap-3">
            <Monitor className="h-4 w-4" />
            <span className="text-sm font-medium">Система</span>
          </div>
          {currentTheme === 'system' && <Check className="h-4 w-4 text-primary" />}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
