import { ActivityIndicator, Pressable, StyleSheet, Text, View } from "react-native";
import { useMemo } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Screen } from "../../../../ui/components/Screen";
import { useTheme } from "../../../../core/theme/ThemeProvider";
import { useMonthlyOverview } from "../hooks/useMonthlyOverview";
import { formatCurrency } from "../../../../core/utils/currency";

function parseYearMonth(value: string): Date | null {
  const match = /^(\d{4})-(\d{2})$/.exec(value);
  if (!match) {
    return null;
  }

  const year = Number(match[1]);
  const monthIndex = Number(match[2]) - 1;
  if (monthIndex < 0 || monthIndex > 11) {
    return null;
  }

  return new Date(year, monthIndex, 1);
}

function formatMonthLabel(date: Date): string {
  return date
    .toLocaleDateString("es-ES", { month: "long", year: "numeric" })
    .replace(/ de /g, " ");
}

export function DataphoneMonthScreen() {
  const { theme } = useTheme();
  const router = useRouter();
  const params = useLocalSearchParams<{ yearMonth?: string }>();
  const monthDate = useMemo(() => parseYearMonth(params.yearMonth ?? ""), [params.yearMonth]);

  const { loading, error, overview, records } = useMonthlyOverview(
    monthDate ?? new Date(),
  );

  if (!monthDate) {
    return (
      <Screen>
        <Text style={[styles.message, { color: theme.colors.danger }]}>Año-mes inválido</Text>
      </Screen>
    );
  }

  if (loading) {
    return (
      <Screen>
        <View style={styles.center}>
          <ActivityIndicator color={theme.colors.primary} />
          <Text style={[styles.muted, { color: theme.colors.mutedText }]}>Cargando datafono...</Text>
        </View>
      </Screen>
    );
  }

  if (error || !overview) {
    return (
      <Screen>
        <View style={styles.center}>
          <Text style={[styles.message, { color: theme.colors.danger }]}>
            No se pudo cargar el detalle de datafono.
          </Text>
          <Pressable
            accessibilityRole="button"
            style={[
              styles.retryButton,
              {
                backgroundColor: theme.colors.primary,
                borderRadius: theme.radius.md,
                paddingHorizontal: theme.spacing.md,
                paddingVertical: 10,
              },
            ]}
            onPress={() => router.back()}
          >
            <Text style={styles.retryText}>Volver</Text>
          </Pressable>
        </View>
      </Screen>
    );
  }

  const dataphoneDays = records
    .filter((record) => (record.dataphoneSales ?? 0) > 0)
    .sort((a, b) => a.date.localeCompare(b.date));

  return (
    <Screen>
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.colors.primary }]}>Ventas datafono</Text>
        <Text style={[styles.monthLabel, { color: theme.colors.mutedText }]}>
          {formatMonthLabel(monthDate)}
        </Text>
      </View>

      <View style={styles.totalsRow}>
        <View style={styles.totalBlock}>
          <Text style={[styles.totalLabel, { color: theme.colors.mutedText }]}>Total datafono</Text>
          <Text style={[styles.totalValue, { color: theme.colors.primary }]}>
            {formatCurrency(overview.totalDataphoneSales)}
          </Text>
        </View>
        <View style={styles.totalBlock}>
          <Text style={[styles.totalLabel, { color: theme.colors.mutedText }]}>Días</Text>
          <Text style={[styles.totalValue, { color: theme.colors.text }]}>{dataphoneDays.length}</Text>
        </View>
      </View>

      {dataphoneDays.length === 0 ? (
        <View style={styles.center}>
          <Text style={[styles.muted, { color: theme.colors.mutedText }]}>
            No hubo ventas datafono este mes.
          </Text>
        </View>
      ) : (
        <View style={styles.list}>
          {dataphoneDays.map((record) => {
            const iso = record.date;
            const date = new Date(`${iso}T00:00:00`);
            const weekday = date.toLocaleDateString("es-ES", { weekday: "short" });

            return (
              <View
                key={iso}
                style={[
                  styles.row,
                  {
                    borderColor: theme.colors.border,
                    borderRadius: theme.radius.md,
                    padding: theme.spacing.sm,
                    backgroundColor: theme.colors.inputBackground,
                  },
                ]}
              >
                <View style={styles.left}>
                  <Text style={[styles.dayNumber, { color: theme.colors.text }]}>
                    {date.getDate()}
                  </Text>
                  <Text style={[styles.weekday, { color: theme.colors.mutedText }]}>
                    {weekday}
                  </Text>
                </View>
                <Text style={[styles.amount, { color: theme.colors.primary }]}>
                  {formatCurrency(record.dataphoneSales ?? 0)}
                </Text>
              </View>
            );
          })}
        </View>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    alignItems: "center",
    gap: 2,
  },
  title: {
    fontSize: 22,
    fontWeight: "800",
  },
  monthLabel: {
    fontSize: 14,
    textTransform: "capitalize",
  },
  totalsRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: 12,
  },
  totalBlock: {
    flex: 1,
    alignItems: "center",
    gap: 2,
  },
  totalLabel: {
    fontSize: 12,
  },
  totalValue: {
    fontSize: 18,
    fontWeight: "700",
  },
  list: {
    marginTop: 14,
    gap: 6,
  },
  row: {
    borderWidth: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  left: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  dayNumber: {
    fontSize: 16,
    fontWeight: "700",
    minWidth: 24,
  },
  weekday: {
    fontSize: 13,
    textTransform: "capitalize",
  },
  amount: {
    fontSize: 15,
    fontWeight: "700",
  },
  center: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 60,
    gap: 10,
  },
  muted: {},
  message: {
    fontWeight: "600",
  },
  retryButton: {
    alignSelf: "center",
  },
  retryText: {
    color: "#FFFFFF",
    fontWeight: "700",
  },
});