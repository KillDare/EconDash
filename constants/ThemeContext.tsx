import { Colors } from '@/constants/theme';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useState } from 'react';

type ThemeMode = 'light' | 'dark';

export type AppTheme = {
  mode: ThemeMode;
  theme: {
    background: string;
    text: string;
    tint: string;
    icon: string;
    border: string;
    card: string;

    button: {
      primary: {
        background: string;
        text: string;
        border?: string;
      };
      secondary: {
        background: string;
        text: string;
        border?: string;
      };
      danger: {
        background: string;
        text: string;
        border?: string;
      };
      outline: {
        background: string;
        text: string;
        border?: string;
      };
    };
  };
  toggleTheme: () => void;
};

const ThemeContext = createContext<AppTheme | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = useState<ThemeMode>('light');

  useEffect(() => {
    AsyncStorage.getItem('@theme').then(saved => {
      if (saved === 'dark' || saved === 'light') {
        setMode(saved);
      }
    });
  }, []);

  useEffect(() => {
    AsyncStorage.setItem('@theme', mode);
  }, [mode]);

  const toggleTheme = () => {
    setMode(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  const base = Colors[mode];

  const value: AppTheme = {
    mode,
    theme: {
      background: base.background,
      text: base.text,
      tint: base.tint,
      icon: base.icon,
      border: mode === 'dark' ? '#2a2a2a' : '#ddd',
      card: mode === 'dark' ? '#2a2a2a' : '#F5F5F5',

      // 🔘 PADRÃO DE BOTÕES
      button: {
        primary: {
          background: base.tint,
          text: mode === 'dark' ? '#000' : '#fff',
        },
        secondary: {
          background: mode === 'dark' ? '#2a2a2a' : '#f0f0f0',
          text: base.text,
        },
        danger: {
          background: '#E53935',
          text: '#fff',
        },
        outline: {
          background: 'transparent',
          text: base.text,
          border: base.icon,
        },
      },
    },
    toggleTheme,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error('useTheme must be used inside ThemeProvider');
  }
  return ctx;
}
