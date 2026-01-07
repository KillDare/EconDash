import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Drawer } from 'expo-router/drawer';
import { Pressable, View } from 'react-native';

import { useTheme } from '@/constants/ThemeContext';

export default function DrawerLayout() {
  const router = useRouter();
  const { theme, mode, toggleTheme } = useTheme();

  return (
    <Drawer
      screenOptions={{
        // 🎨 Drawer inteiro no ThemeContext
        headerStyle: {
          backgroundColor: theme.background,
        },
        headerTintColor: theme.text,

        drawerStyle: {
          backgroundColor: theme.background,
        },

        drawerActiveTintColor: theme.tint,
        drawerInactiveTintColor: theme.icon,

        headerRight: () => (
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 16,
              marginRight: 8,
            }}
          >
            {/* 🌗 Toggle Tema */}
            <Pressable
              onPress={toggleTheme}
              style={({ pressed }) => ({ opacity: pressed ? 0.6 : 1 })}
            >
              <Ionicons
                name={mode === 'dark' ? 'moon-outline' : 'sunny-outline'}
                size={24}
                color={theme.tint}
              />
            </Pressable>

            {/* 👤 Perfil */}
            <Pressable
              onPress={() => router.push('/(drawer)/profile')}
              style={({ pressed }) => ({ opacity: pressed ? 0.6 : 1 })}
            >
              <Ionicons
                name="person-circle-outline"
                size={28}
                color={theme.tint}
              />
            </Pressable>
          </View>
        ),
      }}
    >
      <Drawer.Screen
        name="(tabs)"
        options={{
          title: 'EconDash',
          drawerIcon: ({ color, size }) => (
            <Ionicons name="home-outline" size={size} color={color} />
          ),
        }}
      />

      <Drawer.Screen
        name="settings"
        options={{
          title: 'Settings',
          drawerIcon: ({ color, size }) => (
            <Ionicons name="settings-outline" size={size} color={color} />
          ),
        }}
      />

      <Drawer.Screen
        name="profile"
        options={{
          title: 'Profile',
          drawerIcon: ({ color, size }) => (
            <Ionicons name="person-outline" size={size} color={color} />
          ),
        }}
      />
    </Drawer>
  );
}
