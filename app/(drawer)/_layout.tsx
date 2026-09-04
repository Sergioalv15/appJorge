import { Drawer } from 'expo-router/drawer';
import {
  createCalendarDrawerScreenOptions,
  createDrawerScreenOptions,
  drawerRouteLabels,
} from '../../src/core/navigation/drawerScreenOptions';
import { ThemeDrawerContent } from '../../src/core/navigation/ThemeDrawerContent';
import { useTheme } from '../../src/core/theme/ThemeProvider';

export default function DrawerLayout() {
  const { theme } = useTheme();

  return (
    <Drawer
      screenOptions={createDrawerScreenOptions(theme)}
      drawerContent={(props) => <ThemeDrawerContent {...props} />}
    >
      <Drawer.Screen
        name="index"
        options={{
          title: drawerRouteLabels.index,
          drawerLabel: drawerRouteLabels.index,
        }}
      />
      <Drawer.Screen
        name="calendar"
        options={{
          title: drawerRouteLabels.calendar,
          drawerLabel: drawerRouteLabels.calendar,
          ...createCalendarDrawerScreenOptions(theme),
        }}
      />
      <Drawer.Screen
        name="annual"
        options={{
          title: drawerRouteLabels.annual,
          drawerLabel: drawerRouteLabels.annual,
        }}
      />
    </Drawer>
  );
}
