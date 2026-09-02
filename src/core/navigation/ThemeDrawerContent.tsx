import {
  DrawerContentComponentProps,
  DrawerContentScrollView,
  DrawerItemList,
} from '@react-navigation/drawer';
import { StyleSheet, Switch, Text, View } from 'react-native';
import { useTheme } from '../theme/ThemeProvider';

export function ThemeDrawerContent(props: DrawerContentComponentProps) {
  const { theme, mode, toggleTheme } = useTheme();
  const darkEnabled = mode === 'dark';

  return (
    <View style={[styles.root, { backgroundColor: theme.colors.surface }]}> 
      <DrawerContentScrollView
        {...props}
        contentContainerStyle={styles.scrollContent}
      >
        <DrawerItemList {...props} />
      </DrawerContentScrollView>

      <View
        accessibilityRole="switch"
        accessibilityLabel="Tema oscuro"
        accessibilityHint="Activa o desactiva el modo oscuro en toda la app"
        accessibilityState={{ checked: darkEnabled }}
        style={[
          styles.toggleRow,
          {
            borderTopColor: theme.colors.border,
            backgroundColor: theme.colors.surface,
            paddingHorizontal: theme.spacing.md,
            paddingVertical: theme.spacing.sm,
          },
        ]}
      >
        <View style={styles.toggleTextContainer}>
          <Text style={[styles.toggleLabel, { color: theme.colors.text }]}>Tema oscuro</Text>
          <Text style={[styles.toggleHint, { color: theme.colors.mutedText }]}>Se guarda para próximos inicios</Text>
        </View>

        <Switch
          accessibilityLabel="Interruptor de tema oscuro"
          value={darkEnabled}
          onValueChange={() => void toggleTheme()}
          trackColor={{ false: theme.colors.border, true: theme.colors.primarySoft }}
          thumbColor={darkEnabled ? theme.colors.primary : theme.colors.white}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  toggleRow: {
    borderTopWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  toggleTextContainer: {
    flex: 1,
  },
  toggleLabel: {
    fontSize: 15,
    fontWeight: '700',
  },
  toggleHint: {
    fontSize: 12,
    marginTop: 2,
  },
});
