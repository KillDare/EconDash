import { router, Tabs } from 'expo-router';
import React from 'react';

import { HapticTab } from '@/components/haptic-tab';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useTheme } from '@/constants/ThemeContext';

export default function TabLayout() {
  const { theme, mode } = useTheme();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarButton: HapticTab,

        tabBarActiveTintColor: theme.tint,
        tabBarInactiveTintColor: theme.icon,

        tabBarStyle: {
          backgroundColor: theme.background,
          borderTopColor: mode === 'dark' ? '#222' : '#ddd',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="house.fill" color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="cashflow"
        options={{
          title: 'Add',
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="plus.square.fill" color={color} />
          ),
        }}
        listeners={{
          tabPress: (e) => {
            e.preventDefault();
            router.push({
              pathname: '/cashflow',
              params: { type: 'expense' },
            });
          },
          tabLongPress: () => {
            router.push({
              pathname: '/cashflow',
              params: { type: 'income' },
            });
          },
        }}
      />

      <Tabs.Screen
        name="dashboard"
        options={{
          title: 'Dashboard',
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="chart.bar.fill" color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
