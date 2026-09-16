import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '../../../../core/theme/ThemeProvider';
import { useUpcomingHolidays } from '../../../holidays/presentation/hooks/useUpcomingHolidays';

function formatHolidayDate(date: string): string {
  const d = new Date(`${date}T00:00:00`);
  return d.toLocaleDateString('es-ES', { day: 'numeric', weekday: 'short', month: 'short' });
}

export function UpcomingHolidaysCard() {
  const { theme } = useTheme();
  const router = useRouter();
  const { loading, holidays } = useUpcomingHolidays(14, 3);

  if (loading || holidays.length === 0) {
    return null;
  }

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: theme.colors.surface,
          borderColor: theme.colors.border,
          borderRadius: theme.radius.lg,
        },
      ]}
    >
      <Text style={[styles.title, { color: theme.colors.text }]}>Próximos festivos</Text>
      {holidays.map((holiday) => (
        <View key={holiday.date} style={styles.row}>
          <Text style={[styles.dot, { color: theme.colors.primary }]}>●</Text>
          <Text style={[styles.holidayName, { color: theme.colors.text }]}>{holiday.name}</Text>
          <Text style={[styles.holidayDate, { color: theme.colors.mutedText }]}>
            {formatHolidayDate(holiday.date)}{holiday.daysUntil <= 1 ? '' : ` (en ${holiday.daysUntil}d)`}
          </Text>
        </View>
      ))}
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Ver calendario completo"
        style={({ pressed }) => [pressed ? styles.linkPressed : null]}
        onPress={() => router.push('/calendar' as never)}
      >
        <Text style={[styles.link, { color: theme.colors.primary }]}>Ver todo →</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    padding: 14,
    gap: 8,
  },
  title: {
    fontSize: 15,
    fontWeight: '700',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dot: {
    fontSize: 6,
  },
  holidayName: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
  },
  holidayDate: {
    fontSize: 13,
  },
  link: {
    fontSize: 13,
    fontWeight: '600',
    marginTop: 4,
  },
  linkPressed: {
    opacity: 0.6,
  },
});