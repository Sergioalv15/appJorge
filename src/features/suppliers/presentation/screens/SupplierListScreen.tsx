import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Screen } from '../../../../ui/components/Screen';
import { useTheme } from '../../../../core/theme/ThemeProvider';
import { useSuppliers } from '../hooks/useSuppliers';
import { Supplier } from '../../domain/types';

function formatCreated(date: string): string {
  return `Alta: ${date}`;
}

function SupplierCard({ supplier, onPress }: { supplier: Supplier; onPress: () => void }) {
  const { theme } = useTheme();

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`Proveedor ${supplier.name}`}
      accessibilityHint="Abre el detalle para editar o eliminar"
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        {
          backgroundColor: theme.colors.surface,
          borderColor: theme.colors.border,
          borderRadius: theme.radius.md,
          padding: theme.spacing.md,
          gap: theme.spacing.xs,
        },
        pressed ? styles.cardPressed : null,
      ]}
    >
      <Text style={[styles.cardName, { color: theme.colors.text }]}>{supplier.name}</Text>
      {supplier.phone ? (
        <Text style={[styles.cardMeta, { color: theme.colors.mutedText }]}>
          📞 {supplier.phone}
        </Text>
      ) : null}
      {supplier.notes ? (
        <Text style={[styles.cardNotes, { color: theme.colors.mutedText }]} numberOfLines={2}>
          {supplier.notes}
        </Text>
      ) : null}
      <Text style={[styles.cardDate, { color: theme.colors.mutedText }]}>
        {formatCreated(supplier.createdAt)}
      </Text>
    </Pressable>
  );
}

export function SupplierListScreen() {
  const { theme } = useTheme();
  const router = useRouter();
  const { loading, suppliers, error } = useSuppliers();

  const handleNew = () => router.push('/supplier/new');

  return (
    <View style={[styles.screenRoot, { backgroundColor: theme.colors.background }]}>
      <Screen>
        <View style={styles.header}>
          <Text style={[styles.title, { color: theme.colors.text }]}>Proveedores</Text>
          <Text style={[styles.subtitle, { color: theme.colors.mutedText }]}>
            Agenda de los proveedores habituales
          </Text>
        </View>

        <View style={styles.list}>
          {suppliers.length === 0 && !loading ? (
            <View
              style={[
                styles.empty,
                {
                  backgroundColor: theme.colors.surface,
                  borderColor: theme.colors.border,
                  borderRadius: theme.radius.md,
                  padding: theme.spacing.lg,
                },
              ]}
            >
              <Text style={[styles.emptyText, { color: theme.colors.mutedText }]}>
                {error ?? 'No hay proveedores aún. Agregá el primero.'}
              </Text>
            </View>
          ) : (
            suppliers.map((supplier) => (
              <SupplierCard
                key={supplier.id}
                supplier={supplier}
                onPress={() => router.push(`/supplier/${supplier.id}`)}
              />
            ))
          )}
        </View>
      </Screen>

      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Agregar proveedor"
        accessibilityHint="Crea un nuevo proveedor en la agenda"
        onPress={handleNew}
        style={({ pressed }) => [
          styles.fab,
          {
            backgroundColor: theme.colors.primary,
            borderRadius: 28,
          },
          pressed ? styles.fabPressed : null,
        ]}
      >
        <Text style={styles.fabText}>+</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  screenRoot: {
    flex: 1,
  },
  header: {
    gap: 2,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
  },
  subtitle: {
    fontSize: 13,
  },
  list: {
    gap: 10,
  },
  card: {
    borderWidth: 1,
  },
  cardPressed: {
    opacity: 0.7,
  },
  cardName: {
    fontSize: 17,
    fontWeight: '700',
  },
  cardMeta: {
    fontSize: 13,
  },
  cardNotes: {
    fontSize: 13,
  },
  cardDate: {
    fontSize: 11,
    marginTop: 2,
  },
  empty: {
    borderWidth: 1,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
    textAlign: 'center',
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 24,
    width: 56,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  fabPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.96 }],
  },
  fabText: {
    color: '#FFFFFF',
    fontSize: 30,
    fontWeight: '600',
    lineHeight: 34,
  },
});