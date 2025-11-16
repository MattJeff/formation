'use client';

/**
 * ============================================
 * 🌓 THEME TOGGLE BUTTON
 * ============================================
 * Bouton pour basculer entre dark et light mode
 */

import { useTheme } from '@/providers/ThemeProvider';
import { Moon, Sun } from 'lucide-react';

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="relative flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-background hover:bg-accent transition-colors"
      aria-label={`Basculer en mode ${theme === 'dark' ? 'clair' : 'sombre'}`}
      title={`Mode ${theme === 'dark' ? 'clair' : 'sombre'}`}
    >
      {/* Icon with fade transition */}
      <div className="relative h-5 w-5">
        <Sun
          className={`absolute inset-0 h-5 w-5 text-foreground transition-all duration-300 ${
            theme === 'dark'
              ? 'rotate-90 scale-0 opacity-0'
              : 'rotate-0 scale-100 opacity-100'
          }`}
        />
        <Moon
          className={`absolute inset-0 h-5 w-5 text-foreground transition-all duration-300 ${
            theme === 'dark'
              ? 'rotate-0 scale-100 opacity-100'
              : '-rotate-90 scale-0 opacity-0'
          }`}
        />
      </div>
    </button>
  );
}
