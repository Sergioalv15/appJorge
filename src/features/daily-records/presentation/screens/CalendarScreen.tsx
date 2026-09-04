import {
  useCallback,
  useLayoutEffect,
  useMemo,
  useReducer,
  useState,
} from "react";
import { StatusBar } from "expo-status-bar";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useNavigation } from "expo-router";
import { useTheme } from "../../../../core/theme/ThemeProvider";
import {
  createInitialMonthlyCalendarState,
  monthlyCalendarReducer,
} from "../calendar/monthlyCalendarState";
import {
  createInitialBiweeklyWindowState,
  biweeklyWindowReducer,
} from "../calendar/biweeklyWindowState";
import { MonthlyCalendar } from "../components/MonthlyCalendar";
import { BiweeklyWindow } from "../components/BiweeklyWindow";
import {
  CalendarViewMode,
  CalendarViewModeToggle,
} from "../components/CalendarViewModeToggle";
import { useMonthlyCalendarRecords } from "../hooks/useMonthlyCalendarRecords";
import { useBiweeklyRecords } from "../hooks/useBiweeklyRecords";
import { SafeAreaView } from "react-native-safe-area-context";

export function CalendarScreen() {
  const { theme } = useTheme();
  const navigation = useNavigation();
  const today = useMemo(() => new Date(), []);
  const [viewMode, setViewMode] = useState<CalendarViewMode>("monthly");
  const [calendarState, dispatch] = useReducer(
    monthlyCalendarReducer,
    today,
    createInitialMonthlyCalendarState,
  );
  const [biweeklyState, dispatchBiweekly] = useReducer(
    biweeklyWindowReducer,
    today,
    createInitialBiweeklyWindowState,
  );

  const handleToggleViewMode = useCallback(() => {
    setViewMode((prev) => (prev === "monthly" ? "biweekly" : "monthly"));
  }, []);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <CalendarViewModeToggle
          mode={viewMode}
          onToggle={handleToggleViewMode}
        />
      ),
    });
  }, [navigation, viewMode, handleToggleViewMode]);

  const monthlyRecords = useMonthlyCalendarRecords(calendarState.visibleMonth);
  const biweeklyRecords = useBiweeklyRecords(biweeklyState.windowStartIso);

  const activeError =
    viewMode === "monthly" ? monthlyRecords.error : biweeklyRecords.error;
  const activeRefresh =
    viewMode === "monthly" ? monthlyRecords.refresh : biweeklyRecords.refresh;

  if (activeError) {
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
            {activeError}
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
            onPress={() => void activeRefresh()}
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
        {viewMode === "monthly" ? (
          <MonthlyCalendar
            visibleMonth={calendarState.visibleMonth}
            selectedDateIso={calendarState.selectedDateIso}
            recordsByIso={monthlyRecords.recordsByIso}
            showInitialLoadingOverlay={monthlyRecords.loading}
            onPreviousMonth={() => dispatch({ type: "previousMonth" })}
            onNextMonth={() => dispatch({ type: "nextMonth" })}
            onShowToday={() => dispatch({ type: "showMonth", date: new Date() })}
            onSelectDate={(iso) => dispatch({ type: "selectDate", iso })}
          />
        ) : (
          <BiweeklyWindow
            windowStartIso={biweeklyState.windowStartIso}
            selectedIso={biweeklyState.selectedIso}
            recordsByIso={biweeklyRecords.recordsByIso}
            onPrevious={() => dispatchBiweekly({ type: "prev" })}
            onNext={() => dispatchBiweekly({ type: "next" })}
            onToday={() => dispatchBiweekly({ type: "today", today: new Date() })}
            onSelectDay={(iso) => dispatchBiweekly({ type: "select", iso })}
          />
        )}
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
