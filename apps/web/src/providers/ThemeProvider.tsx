'use client';

/**
 * ============================================
 * 🎨 THEME PROVIDER - DARK/LIGHT MODE
 * ============================================
 * Gère le thème de l'application avec persistence localStorage
 */

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>('dark'); // Default dark
  const [mounted, setMounted] = useState(false);

  // Charger le thème depuis localStorage au montage
  useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem('skillforge-theme') as Theme | null;
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    setThemeState(stored || (prefersDark ? 'dark' : 'light'));
  }, []);

  // Appliquer le thème au document
  useEffect(() => {
    if (!mounted) return;

    const root = document.documentElement;

    // Supprimer l'ancien thème
    root.classList.remove('light', 'dark');

    // Ajouter le nouveau thème
    root.classList.add(theme);

    // Persister dans localStorage
    localStorage.setItem('skillforge-theme', theme);
  }, [theme, mounted]);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
  };

  const toggleTheme = () => {
    setThemeState(prev => prev === 'dark' ? 'light' : 'dark');
  };

  // Éviter le flash de thème incorrect (hydration mismatch)
  if (!mounted) {
    return <>{children}</>;
  }

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
}
