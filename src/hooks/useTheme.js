import { useState, useEffect } from 'react';
import { storageService } from '../services/storageService';

export const useTheme = () => {
  const [theme, setTheme] = useState(() => {
    return storageService.get(storageService.KEYS.THEME, 'light');
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    storageService.set(storageService.KEYS.THEME, theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  return { theme, setTheme, toggleTheme };
};
