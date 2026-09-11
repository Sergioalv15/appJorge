import {
  DrawerContentComponentProps,
  DrawerContentScrollView,
  DrawerItemList,
} from '@react-navigation/drawer';
import { Alert, Pressable, StyleSheet, Switch, Text, View } from 'react-native';
import { useState } from 'react';
import { useTheme } from '../theme/ThemeProvider';
import { backupService } from '../../features/daily-records/infrastructure/container';

export function ThemeDrawerContent(props: DrawerContentComponentProps) {
  const { theme, mode, toggleTheme } = useTheme();
  const darkEnabled = mode === 'dark';
  const [backingUp, setBackingUp] = useState(false);
  const [restoring, setRestoring] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const runExport = async () => {
    if (backingUp) {
      return;
    }
    setMenuOpen(false);
    setBackingUp(true);
    const result = await backupService.exportBackup();
    setBackingUp(false);
    Alert.alert(result.ok ? 'Copia de seguridad' : 'Error', result.message);
  };

  const runRestore = async () => {
    if (restoring) {
      return;
    }
    setMenuOpen(false);
    setRestoring(true);
    const result = await backupService.restoreFromBackup();
    setRestoring(false);
    Alert.alert(result.ok ? 'Copia de seguridad' : 'Error', result.message);
  };

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

      <View
        style={[
          styles.backupRow,
          {
            borderTopColor: theme.colors.border,
            backgroundColor: theme.colors.surface,
            paddingHorizontal: theme.spacing.md,
            paddingVertical: theme.spacing.sm,
          },
        ]}
      >
        <View style={styles.backupHeader}>
          <Text style={[styles.backupTitle, { color: theme.colors.text }]}>Copia de seguridad</Text>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Opciones de copia de seguridad"
            accessibilityHint="Abre las opciones para exportar o restaurar una copia"
            accessibilityState={{ expanded: menuOpen, busy: backingUp || restoring }}
            disabled={backingUp || restoring}
            onPress={() => setMenuOpen((open) => !open)}
            style={({ pressed }) => [
              styles.gearButton,
              {
                backgroundColor: theme.colors.primarySoft,
                borderRadius: theme.radius.sm,
              },
              pressed ? styles.controlPressed : null,
              menuOpen ? styles.gearButtonActive : null,
            ]}
          >
            <Text style={[styles.gearGlyph, { color: theme.colors.white }]}>{backingUp || restoring ? '…' : '⚙'}</Text>
          </Pressable>
        </View>

        {menuOpen ? (
          <View style={styles.menu}>
            <Pressable
              accessibilityRole="menuitem"
              accessibilityLabel="Exportar copia de seguridad"
              accessibilityHint="Crea un archivo con todos los datos para guardarlo o compartirlo"
              disabled={backingUp || restoring}
              onPress={() => void runExport()}
              style={({ pressed }) => [
                styles.menuItem,
                { backgroundColor: theme.colors.surface },
                pressed ? styles.controlPressed : null,
              ]}
            >
              <Text style={[styles.menuItemText, { color: theme.colors.text }]}>Exportar</Text>
            </Pressable>
            <Pressable
              accessibilityRole="menuitem"
              accessibilityLabel="Restaurar copia de seguridad"
              accessibilityHint="Recupera los datos desde un archivo de copia"
              disabled={backingUp || restoring}
              onPress={() => void runRestore()}
              style={({ pressed }) => [
                styles.menuItem,
                { backgroundColor: theme.colors.surface },
                pressed ? styles.controlPressed : null,
              ]}
            >
              <Text style={[styles.menuItemText, { color: theme.colors.text }]}>Restaurar</Text>
            </Pressable>
          </View>
        ) : null}
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
  backupRow: {
    borderTopWidth: 1,
    paddingTop: 4,
  },
  backupHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backupTitle: {
    fontSize: 13,
    fontWeight: '700',
  },
  gearButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  gearButtonActive: {
    transform: [{ rotate: '45deg' }],
  },
  gearGlyph: {
    fontSize: 20,
    fontWeight: '700',
    lineHeight: 24,
  },
  menu: {
    marginTop: 8,
    paddingVertical: 4,
    borderRadius: 8,
    overflow: 'hidden',
  },
  menuItem: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  menuItemText: {
    fontSize: 15,
    fontWeight: '600',
  },
  controlPressed: {
    opacity: 0.7,
  },
});
