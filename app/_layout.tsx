import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import 'react-native-reanimated';

import { initDatabase } from '@/app/database/sqlite';
import {
  ThemeProvider as AppThemeProvider,
  useTheme,
} from '@/constants/ThemeContext';

function NavigationThemeProvider({ children }: { children: React.ReactNode }) {
  const { mode } = useTheme();

  return (
    <ThemeProvider value={mode === 'dark' ? DarkTheme : DefaultTheme}>
      {children}
    </ThemeProvider>
  );
}

function AppContent() {
  const { mode } = useTheme();

  return (
    <>
      <Stack>
        <Stack.Screen name="(drawer)" options={{ headerShown: false }} />
      </Stack>

      <StatusBar style={mode === 'dark' ? 'light' : 'dark'} />
    </>
  );
}

export default function RootLayout() {
  useEffect(() => {
    initDatabase().catch(error =>
      console.error('Erro ao inicializar banco:', error)
    );
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AppThemeProvider>
        <NavigationThemeProvider>
          <AppContent />
        </NavigationThemeProvider>
      </AppThemeProvider>
    </GestureHandlerRootView>
  );
}
