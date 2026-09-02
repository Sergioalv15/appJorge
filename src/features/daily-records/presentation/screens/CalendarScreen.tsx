import { useMemo, useReducer } from "react";
import { StatusBar } from "expo-status-bar";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useTheme } from "../../../../core/theme/ThemeProvider";
import {
  createInitialMonthlyCalendarState,
  monthlyCalendarReducer,
} from "../calendar/monthlyCalendarState";
import { MonthlyCalendar } from "../components/MonthlyCalendar";
import { useMonthlyCalendarRecords } from "../hooks/useMonthlyCalendarRecords";
import { SafeAreaView } from "react-native-safe-area-context";

export function CalendarScreen() {
  const { theme } = useTheme();
  const today = useMemo(() => new Date(), []);
  const [calendarState, dispatch] = useReducer(
    monthlyCalendarReducer,
    today,
    createInitialMonthlyCalendarState,
  );

  const { loading, error, recordsByIso, refresh } = useMonthlyCalendarRecords(
    calendarState.visibleMonth,
  );

  if (error) {
    return (
      <SafeAreaView
        style={[
          styles.safeArea,
          { backgroundColor: theme.colors.calendarBackground },
        ]}
      >
        <StatusBar style={theme.isDark ? "light" : "dark"} />
        <View style={styles.errorState} accessibilityLiveRegion="polite">
          <Text style={[styles.error, { color: theme.colors.danger }]}>
            {error}
          </Text>
          <Pressable
            accessibilityRole="button"
            style={({ pressed }) => [
              styles.retryButton,
              {
                backgroundColor: theme.colors.primary,
                borderRadius: theme.radius.sm,
                paddingHorizontal: theme.spacing.md,
                paddingVertical: theme.spacing.sm,
              },
              pressed ? styles.buttonPressed : null,
            ]}
            onPress={() => void refresh()}
          >
            <Text style={styles.retryButtonText}>Reintentar</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={[
        styles.safeArea,
        { backgroundColor: theme.colors.calendarBackground },
      ]}
    >
      <StatusBar style={theme.isDark ? "light" : "dark"} />
      <View
        style={[
          styles.screenContent,
          {
            paddingHorizontal: theme.spacing.md,
            paddingTop: theme.spacing.sm,
            paddingBottom: theme.spacing.md,
          },
        ]}
      >
        <MonthlyCalendar
          visibleMonth={calendarState.visibleMonth}
          selectedDateIso={calendarState.selectedDateIso}
          recordsByIso={recordsByIso}
          showInitialLoadingOverlay={loading}
          onPreviousMonth={() => dispatch({ type: "previousMonth" })}
          onNextMonth={() => dispatch({ type: "nextMonth" })}
          onShowToday={() => dispatch({ type: "showMonth", date: new Date() })}
          onSelectDate={(iso) => dispatch({ type: "selectDate", iso })}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  screenContent: {
    flex: 1,
  },
  error: {
    fontWeight: "600",
    textAlign: "center",
  },
  errorState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 16,
  },
  retryButton: {},
  retryButtonText: {
    color: "#FFFFFF",
    fontWeight: "700",
  },
  buttonPressed: {
    opacity: 0.65,
  },
});
