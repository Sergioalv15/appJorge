import { Pressable, StyleSheet, Text, View } from "react-native";
import { formatCurrency } from "../../../../core/utils/currency";
import { useTheme } from "../../../../core/theme/ThemeProvider";

interface MonthOverviewMetrics {
  totalSold: number;
  totalInvested: number;
  totalAdditionalExpenses: number;
  grossProfit: number;
  netProfit: number;
  totalDataphoneSales: number;
}

export interface MonthSummaryInput {
  month: Date;
  overview: MonthOverviewMetrics;
}

interface MonthSummaryCardProps {
  monthly: MonthSummaryInput;
  isCurrentMonth?: boolean;
  badge?: string | null;
  onPressDataphone?: () => void;
}

export function formatMonthName(date: Date): string {
  return date.toLocaleDateString("es-ES", { month: "long" });
}

export function MonthSummaryCard({
  monthly,
  isCurrentMonth = false,
  badge = null,
  onPressDataphone,
}: MonthSummaryCardProps) {
  const { theme } = useTheme();
  const { month, overview } = monthly;

  const dataphoneLine = (
    <View style={styles.metricLine}>
      <Text style={[styles.metricLabel, { color: theme.colors.mutedText }]}>
        Datafono
      </Text>
      <Text style={[styles.metricValue, { color: theme.colors.primary }]}>
        {formatCurrency(overview.totalDataphoneSales)}
        {onPressDataphone ? <Text style={styles.dataphoneHint}>  ver ›</Text> : null}
      </Text>
    </View>
  );

  return (
    <View
      style={[
        styles.card,
        isCurrentMonth
          ? { borderColor: theme.colors.primary, borderWidth: 2 }
          : { borderColor: theme.colors.border, borderWidth: 1 },
        {
          backgroundColor: theme.colors.surface,
          borderRadius: theme.radius.md,
        },
      ]}
    >
      <View style={styles.header}>
        <Text style={[styles.monthName, { color: theme.colors.text }]}>
          {formatMonthName(month)}
        </Text>
        {badge ? (
          <Text style={[styles.badge, { color: theme.colors.primary }]}>{badge}</Text>
        ) : null}
      </View>

      <View style={styles.metricLine}>
        <Text style={[styles.metricLabel, { color: theme.colors.mutedText }]}>
          Ventas / Bruto
        </Text>
        <Text style={[styles.metricValue, { color: theme.colors.text }]}>
          {formatCurrency(overview.totalSold)} / {formatCurrency(overview.grossProfit)}
        </Text>
      </View>

      <View style={styles.metricLine}>
        <Text style={[styles.metricLabel, { color: theme.colors.mutedText }]}>
          Destinado a inversion
        </Text>
        <Text style={[styles.metricValue, { color: theme.colors.primarySoft }]}>
          {formatCurrency(overview.totalInvested)}
        </Text>
      </View>

      <View style={styles.metricLine}>
        <Text style={[styles.metricLabel, { color: theme.colors.mutedText }]}>
          Otros gastos
        </Text>
        <Text style={[styles.metricValue, { color: theme.colors.danger }]}>
          {formatCurrency(overview.totalAdditionalExpenses)}
        </Text>
      </View>

      <View style={styles.metricLine}>
        <Text style={[styles.metricLabel, { color: theme.colors.mutedText }]}>
          Neto
        </Text>
        <Text style={[styles.metricValue, { color: overview.netProfit < 0 ? theme.colors.danger : theme.colors.success }]}>
          {formatCurrency(overview.netProfit)}
        </Text>
      </View>

      {onPressDataphone ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`Ventas datafono de ${formatMonthName(month)}`}
          accessibilityHint="Abre el detalle de ventas datafono de este mes"
          style={({ pressed }) => [pressed ? styles.dataphonePressed : null]}
          onPress={onPressDataphone}
        >
          {dataphoneLine}
        </Pressable>
      ) : (
        dataphoneLine
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 12,
    gap: 8,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  monthName: {
    fontSize: 16,
    fontWeight: "800",
    textTransform: "capitalize",
  },
  badge: {
    fontSize: 12,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.4,
  },
  metricLine: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  metricLabel: {
    fontSize: 12,
  },
  metricValue: {
    fontSize: 14,
    fontWeight: "700",
  },
  dataphoneHint: {
    fontSize: 11,
    fontWeight: "600",
  },
  dataphonePressed: {
    opacity: 0.62,
  },
});