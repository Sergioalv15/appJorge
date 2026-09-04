import { useMemo, useState } from "react";
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from "react-native";
import { Screen } from "../../../../ui/components/Screen";
import { useTheme } from "../../../../core/theme/ThemeProvider";
import { useAnnualSummary } from "../hooks/useAnnualSummary";
import { MonthSummaryCard } from "../components/MonthSummaryCard";

function formatYear(date: Date): string {
  return String(date.getFullYear());
}

export function AnnualSummaryScreen() {
  const { theme } = useTheme();
  const currentYear = useMemo(() => new Date().getFullYear(), []);
  const [visibleYear, setVisibleYear] = useState(currentYear);

  const isShowingCurrentYear = visibleYear === currentYear;
  const { loading, error, monthlySummaries } = useAnnualSummary(visibleYear);

  const handlePreviousYear = () => setVisibleYear((prev) => prev - 1);
  const handleNextYear = () => setVisibleYear((prev) => prev + 1);
  const handleShowCurrentYear = () => setVisibleYear(currentYear);

  return (
    <Screen>
      <View style={styles.header}>
        <View style={styles.headerTitleRow}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Año anterior"
            hitSlop={8}
            style={({ pressed }) => [
              styles.yearButton,
              {
                borderColor: theme.colors.border,
                borderRadius: theme.radius.sm,
              },
              pressed ? styles.controlPressed : null,
            ]}
            onPress={handlePreviousYear}
          >
            <Text style={[styles.yearButtonText, { color: theme.colors.text }]}>‹</Text>
          </Pressable>

          <View style={styles.titleArea}>
            <Text style={[styles.title, { color: theme.colors.primary }]}>
              Resumen anual
            </Text>
            <Text style={[styles.yearLabel, { color: theme.colors.mutedText }]}>
              {formatYear(new Date(visibleYear, 0, 1))}
            </Text>
          </View>

          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Año siguiente"
            hitSlop={8}
            style={({ pressed }) => [
              styles.yearButton,
              {
                borderColor: theme.colors.border,
                borderRadius: theme.radius.sm,
              },
              pressed ? styles.controlPressed : null,
            ]}
            onPress={handleNextYear}
          >
            <Text style={[styles.yearButtonText, { color: theme.colors.text }]}>›</Text>
          </Pressable>
        </View>

        {!isShowingCurrentYear ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Mostrar año actual"
            style={({ pressed }) => [
              styles.todayButton,
              {
                backgroundColor: theme.colors.primary,
                borderRadius: theme.radius.sm,
                paddingHorizontal: theme.spacing.sm,
              },
              pressed ? styles.controlPressed : null,
            ]}
            onPress={handleShowCurrentYear}
          >
            <Text style={styles.todayButtonText}>Ver año actual</Text>
          </Pressable>
        ) : null}
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator color={theme.colors.primary} />
          <Text style={[styles.muted, { color: theme.colors.mutedText }]}>
            Cargando resumen anual...
          </Text>
        </View>
      ) : error ? (
        <View style={styles.center}>
          <Text style={[styles.error, { color: theme.colors.danger }]}>{error}</Text>
        </View>
      ) : (
        <View style={styles.list}>
          {monthlySummaries.map((monthly) => (
            <MonthSummaryCard
              key={monthly.month.getTime()}
              monthly={monthly}
              isCurrentMonth={
                monthly.month.getMonth() === new Date().getMonth() &&
                visibleYear === currentYear
              }
              badge="Actual"
            />
          ))}
        </View>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    gap: 6,
  },
  headerTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
  },
  yearButton: {
    width: 40,
    height: 40,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  yearButtonText: {
    fontSize: 26,
    lineHeight: 28,
    fontWeight: "700",
  },
  controlPressed: {
    opacity: 0.62,
  },
  titleArea: {
    flex: 1,
    minWidth: 0,
    alignItems: "center",
    gap: 2,
  },
  title: {
    fontSize: 22,
    fontWeight: "800",
  },
  yearLabel: {
    fontSize: 14,
  },
  todayButton: {
    alignSelf: "center",
    paddingVertical: 6,
  },
  todayButtonText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "700",
  },
  list: {
    gap: 12,
  },
  center: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 100,
    gap: 10,
  },
  muted: {},
  error: {
    fontWeight: "600",
  },
});