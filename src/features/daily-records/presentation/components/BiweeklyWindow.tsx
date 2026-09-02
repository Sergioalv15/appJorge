import { Link } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { biweekWindowDays, parseIsoDate } from "../../../../core/utils/date";
import { useTheme } from "../../../../core/theme/ThemeProvider";
import { DailyRecord } from "../../domain/types";
import {
  buildBiweeklyRangeAnnouncement,
  buildDayAccessibilityHint,
  buildDayAccessibilityLabel,
} from "../calendar/calendarA11y";
import { DayCellStatus, deriveDayCellStatus } from "../calendar/dayCellStatus";
import { buildDayRouteFromIso } from "../calendar/dayRoute";

interface Props {
  windowStartIso: string;
  selectedIso: string | null;
  recordsByIso: Map<string, DailyRecord>;
  onPrevious: () => void;
  onNext: () => void;
  onToday: () => void;
  onSelectDay: (iso: string) => void;
}

function formatRangeTitle(startIso: string, endIso: string): string {
  const start = parseIsoDate(startIso);
  const end = parseIsoDate(endIso);

  const startLabel = start.toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "2-digit",
  });
  const endLabel = end.toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "2-digit",
  });

  return `${startLabel} - ${endLabel}`;
}

function weekdayLabel(iso: string): string {
  return parseIsoDate(iso).toLocaleDateString("es-ES", { weekday: "short" });
}

function dayNumber(iso: string): string {
  return String(parseIsoDate(iso).getDate());
}

export function BiweeklyWindow({
  windowStartIso,
  selectedIso,
  recordsByIso,
  onPrevious,
  onNext,
  onToday,
  onSelectDay,
}: Props) {
  const { theme } = useTheme();
  const windowDays = biweekWindowDays(windowStartIso);
  const windowEndIso = windowDays[windowDays.length - 1];

  return (
    <View
      style={[
        styles.wrapper,
        {
          backgroundColor: theme.colors.surface,
          borderRadius: theme.radius.lg,
          borderColor: theme.colors.border,
          padding: theme.spacing.md,
          gap: theme.spacing.sm,
        },
      ]}
    >
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.colors.text }]}>Calendario quincenal</Text>
        <Text style={[styles.rangeLabel, { color: theme.colors.mutedText }] }>
          {formatRangeTitle(windowStartIso, windowEndIso)}
        </Text>
        <Text
          accessibilityLiveRegion="polite"
          style={[styles.rangeAnnouncement, { color: theme.colors.mutedText }]}
        >
          {buildBiweeklyRangeAnnouncement(windowStartIso, windowEndIso)}
        </Text>
      </View>

      <View style={styles.controlsRow}>
        <Pressable
          style={[
            styles.controlButton,
            {
              borderRadius: theme.radius.md,
              borderColor: theme.colors.border,
              backgroundColor: theme.colors.inputBackground,
            },
          ]}
          onPress={onPrevious}
        >
          <Text style={[styles.controlText, { color: theme.colors.text }]}>Anterior</Text>
        </Pressable>
        <Pressable
          style={[
            styles.controlButton,
            {
              borderRadius: theme.radius.md,
              borderColor: theme.colors.border,
              backgroundColor: theme.colors.inputBackground,
            },
          ]}
          onPress={onToday}
        >
          <Text style={[styles.controlText, { color: theme.colors.text }]}>Hoy</Text>
        </Pressable>
        <Pressable
          style={[
            styles.controlButton,
            {
              borderRadius: theme.radius.md,
              borderColor: theme.colors.border,
              backgroundColor: theme.colors.inputBackground,
            },
          ]}
          onPress={onNext}
        >
          <Text style={[styles.controlText, { color: theme.colors.text }]}>Siguiente</Text>
        </Pressable>
      </View>

      <View style={styles.grid}>
        {windowDays.map((iso) => {
          const status = deriveDayCellStatus(recordsByIso.get(iso));
          const isSelected = selectedIso === iso;

          return (
            <Link href={buildDayRouteFromIso(iso)} asChild key={iso}>
              <Pressable
                style={[
                    styles.cell,
                    status === "filled" ? styles.cellFilled : styles.cellEmpty,
                    isSelected ? styles.cellSelected : null,
                    {
                      borderRadius: theme.radius.md,
                      borderColor: theme.colors.border,
                      backgroundColor: theme.colors.inputBackground,
                      padding: theme.spacing.xs,
                    },
                    status === 'filled'
                      ? {
                          borderColor: theme.colors.primarySoft,
                          backgroundColor: theme.colors.card,
                        }
                      : null,
                    isSelected
                      ? {
                          borderColor: theme.colors.primary,
                          borderWidth: 2,
                        }
                      : null,
                  ]}
                onPress={() => onSelectDay(iso)}
                accessibilityRole="button"
                accessibilityLabel={buildDayAccessibilityLabel(
                  iso,
                  status,
                  isSelected,
                )}
                accessibilityHint={buildDayAccessibilityHint(status)}
              >
                <Text style={[styles.weekday, { color: theme.colors.mutedText }]}>{weekdayLabel(iso)}</Text>
                <Text style={[styles.dayNumber, { color: theme.colors.text }]}>{dayNumber(iso)}</Text>
                <StatusPill status={status} />
              </Pressable>
            </Link>
          );
        })}
      </View>
    </View>
  );
}

function StatusPill({ status }: { status: DayCellStatus }) {
  const { theme } = useTheme();

  if (status === "filled") {
    return <Text style={[styles.filledLabel, { color: theme.colors.success }]}>Con registro</Text>;
  }

  return <Text style={[styles.emptyLabel, { color: theme.colors.mutedText }]}>Sin registro</Text>;
}

const styles = StyleSheet.create({
  wrapper: {
    borderWidth: 1,
  },
  header: {
    gap: 2,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
  },
  rangeLabel: {
    fontSize: 13,
  },
  rangeAnnouncement: {
    fontSize: 11,
  },
  controlsRow: {
    flexDirection: "row",
    gap: 6,
  },
  controlButton: {
    flex: 1,
    borderWidth: 1,
    paddingVertical: 8,
    paddingHorizontal: 10,
    alignItems: "center",
  },
  controlText: {
    fontWeight: "600",
    fontSize: 12,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
  },
  cell: {
    width: "31.5%",
    borderWidth: 1,
    gap: 2,
  },
  cellFilled: {},
  cellEmpty: {},
  cellSelected: {},
  weekday: {
    fontSize: 11,
    textTransform: "capitalize",
  },
  dayNumber: {
    fontSize: 18,
    fontWeight: "700",
  },
  filledLabel: {
    fontSize: 11,
    fontWeight: "600",
  },
  emptyLabel: {
    fontSize: 11,
  },
});
