import { router, Tabs } from "expo-router";
import React from "react";
import { Platform, useWindowDimensions, View } from "react-native";

import { HapticTab } from "@/components/haptic-tab";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useTheme } from "@/constants/ThemeContext";

export default function TabLayout() {
  const { theme, mode } = useTheme();
  const { width } = useWindowDimensions();

  const isWeb = Platform.OS === "web";
  const isDesktop = isWeb && width >= 1024;

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: theme.background,
        alignItems: isDesktop ? "center" : "stretch",
      }}
    >
      <View
        style={{
          flex: 1,
          width: "100%",
        }}
      >
        <Tabs
          screenOptions={{
            headerShown: false,
            tabBarPosition: isDesktop ? "left" : "bottom",
            tabBarButton: isDesktop ? undefined : HapticTab,

            tabBarActiveTintColor: isDesktop ? theme.card : theme.tint,
            tabBarInactiveTintColor: theme.icon,

            tabBarStyle: {
              backgroundColor: theme.background,
              borderTopColor: mode === "dark" ? "#222" : "#ddd",
              height: isDesktop ? undefined : 60,
              minWidth: isDesktop ? 250 : undefined,
            },
          }}
        >
          <Tabs.Screen
            name="index"
            options={{
              title: "Home",
              tabBarIcon: ({ color }) => (
                <IconSymbol size={24} name="house.fill" color={color} />
              ),
            }}
          />

          <Tabs.Screen
            name="cashflow"
            options={{
              title: "Add",
              tabBarIcon: ({ color }) => (
                <IconSymbol size={24} name="plus.square.fill" color={color} />
              ),
            }}
            listeners={{
              tabPress: (e) => {
                e.preventDefault();
                router.push({
                  pathname: "/cashflow",
                  params: { type: "expense" },
                });
              },
              tabLongPress: () => {
                router.push({
                  pathname: "/cashflow",
                  params: { type: "income" },
                });
              },
            }}
          />
          <Tabs.Screen
            name="dashboard"
            options={{
              title: "Dashboard",
              tabBarIcon: ({ color }) => (
                <IconSymbol size={24} name="chart.bar.fill" color={color} />
              ),
            }}
          />
        </Tabs>
      </View>
    </View>
  );
}
