import { Feather } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import type { ComponentProps } from 'react';
import type { ColorValue } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../src/core/theme/ThemeProvider';

type FeatherIconName = ComponentProps<typeof Feather>['name'];

// React Native 0.88 types tab tint colors as ColorValue (which includes null and numbers);
// Feather only accepts strings or native colors, so drop the values it cannot render.
function tabBarIcon(name: FeatherIconName) {
  return ({ color, size }: { color: ColorValue; size: number }) => (
    <Feather name={name} color={typeof color === 'number' || color === null ? undefined : color} size={size} />
  );
}

export default function AppTabsLayout() {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        sceneStyle: { backgroundColor: theme.colors.background },
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.mutedText,
        tabBarHideOnKeyboard: true,
        tabBarStyle: {
          height: 60 + insets.bottom,
          paddingTop: 4,
          paddingBottom: Math.max(4, insets.bottom),
          backgroundColor: theme.colors.background,
          borderTopColor: theme.colors.border,
          borderTopWidth: 1,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          lineHeight: 14,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Inicio',
          tabBarIcon: tabBarIcon('home'),
        }}
      />
      <Tabs.Screen
        name="calendar"
        options={{
          title: 'Calendario',
          tabBarIcon: tabBarIcon('calendar'),
        }}
      />
      <Tabs.Screen
        name="annual"
        options={{
          title: 'Balance',
          tabBarIcon: tabBarIcon('bar-chart-2'),
        }}
      />
      <Tabs.Screen
        name="more"
        options={{
          title: 'Más',
          tabBarIcon: tabBarIcon('menu'),
        }}
      />
      {/* Expo Router 58 makes `href: null` routes unreachable; hide only the tab button so /suppliers stays navigable. */}
      <Tabs.Screen name="suppliers" options={{ tabBarButton: () => null }} />
    </Tabs>
  );
}
