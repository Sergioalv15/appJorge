import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useCallback, useMemo, useRef } from "react";
import { useFocusEffect } from "expo-router";
import { Screen } from "../../../../ui/components/Screen";
import { useTheme } from "../../../../core/theme/ThemeProvider";
import { useMonthlyOverview } from "../hooks/useMonthlyOverview";
import { createFocusRefreshGuard } from "../hooks/focusRefreshGuard";
import { KpiCard } from "../components/KpiCard";
import { MonthSummaryCard } from "../components/MonthSummaryCard";
import { deriveHomeKpis } from "../home/deriveHomeKpis";
import { formatCurrency } from "../../../../core/utils/currency";
import { addMonths, startOfMonth } from "../../../../core/utils/date";
import { useInvestmentBalance } from "../../investment/presentation/hooks/useInvestmentBalance";
import { InvestmentBalanceCard } from "../../investment/presentation/components/InvestmentBalanceCard";
import { LinearGradient } from "expo-linear-gradient";

function formatRecordDate(date: string | null): string {
  if (!date) {
    return "Sin registros";
  }

  const parsedDate = new Date(`${date}T00:00:00`);

  return parsedDate.toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

function formatMonthLabel(date: Date): string {
  return date
    .toLocaleDateString("es-ES", {
      month: "long",
      year: "numeric",
    })
    .replace(/ de /g, " ");
}

function HeaderDivider() {
  const { theme } = useTheme();
  const transparent = "rgba(0,0,0,0)";
  const edgeColor = theme.isDark ? theme.colors.white : theme.colors.black;

  return (
    <LinearGradient
      colors={[transparent, edgeColor, transparent]}
      locations={[0, 0.5, 1]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      style={styles.headerDivider}
    />
  );
}

export function HomeScreen() {
  const { theme } = useTheme();
  const overviewMonth = useMemo(() => startOfMonth(new Date()), []);
  const previousMonth = useMemo(() => addMonths(overviewMonth, -1), [overviewMonth]);
  const { loading, error, overview, records, refresh } = useMonthlyOverview(overviewMonth);
  const prev = useMonthlyOverview(previousMonth);
  const investmentBalance = useInvestmentBalance();
  const shouldRefreshOnFocus = useRef(createFocusRefreshGuard());

  useFocusEffect(
    useCallback(() => {
      void investmentBalance.refresh();

      if (shouldRefreshOnFocus.current()) {
        void refresh();
      }
    }, [refresh, investmentBalance.refresh]),
  );

  if (loading) {
    return (
      <Screen>
        <View style={styles.center}>
          <ActivityIndicator color={theme.colors.primary} />
          <Text style={[styles.muted, { color: theme.colors.mutedText }]}>Cargando resumen...</Text>
        </View>
      </Screen>
    );
  }

  if (error || !overview) {
    const technicalDetail = error?.technicalMessage;
    const shouldShowTechnicalDetail = __DEV__;

    return (
      <Screen>
        <View style={styles.center}>
          <Text style={[styles.error, { color: theme.colors.danger }]}>
            {error?.userMessage ?? "No se pudo cargar el inicio."}
          </Text>
          {shouldShowTechnicalDetail && technicalDetail ? (
            <Text style={[styles.errorDetail, { color: theme.colors.mutedText }]}>{technicalDetail}</Text>
          ) : null}
          <Pressable
            accessibilityRole="button"
            style={[
              styles.button,
              {
                marginTop: theme.spacing.xs,
                backgroundColor: theme.colors.primary,
                borderRadius: theme.radius.md,
                paddingHorizontal: theme.spacing.md,
              },
            ]}
            onPress={() => void refresh()}
          >
            <Text style={styles.buttonText}>Reintentar</Text>
          </Pressable>
        </View>
      </Screen>
    );
  }

  const kpis = deriveHomeKpis(overview, records);

  return (
    <Screen>
      <View style={styles.header}>
        <HeaderDivider />
        <View style={styles.titleArea}>
          <Text style={[styles.title, { color: theme.colors.primary }]}>
            Resumen del mes
          </Text>
          <Text style={[styles.monthLabel, { color: theme.colors.mutedText }]}>
            {formatMonthLabel(overviewMonth)}
          </Text>
        </View>
      </View>

      <View style={styles.kpiGrid}>
        <KpiCard
          label="Ventas ultimo dia"
          value={formatCurrency(kpis.ventasUltimoDia)}
          hint={`Ultimo registro: ${formatRecordDate(kpis.lastRecordDate)}`}
        />
        <KpiCard
          label="Ultimo destinado a inversion"
          value={formatCurrency(kpis.ultimaInversion)}
        />
        <KpiCard
          label="Beneficio bruto total del mes"
          value={formatCurrency(kpis.beneficioBrutoTotalMes)}
        />
        <KpiCard
          label="Beneficio neto del mes actual"
          value={formatCurrency(kpis.beneficioNetoMesActual)}
        />
      </View>

      <HeaderDivider />

      {prev.loading ? (
        <View style={styles.prevLoading}>
          <ActivityIndicator color={theme.colors.primary} />
        </View>
      ) : prev.overview ? (
        <MonthSummaryCard
          monthly={{ month: previousMonth, overview: prev.overview }}
        />
      ) : null}

      <HeaderDivider />

      <InvestmentBalanceCard
        available={investmentBalance.available}
        adjustmentsTotal={investmentBalance.adjustmentsTotal}
        investedTotal={investmentBalance.investedTotal}
        loading={investmentBalance.loading}
        adding={investmentBalance.adding}
        error={investmentBalance.error ?? investmentBalance.addError}
        onAddAdjustment={investmentBalance.addAdjustment}
        onRefresh={() => void investmentBalance.refresh()}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    gap: 6,
  },
  headerDivider: {
    width: "100%",
    height: 1,
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
  monthLabel: {
    fontSize: 14,
    textTransform: "capitalize",
  },
  kpiGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    rowGap: 10,
  },
  prevLoading: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 20,
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
  errorDetail: {
    fontSize: 12,
    textAlign: "center",
  },
  button: {
    paddingVertical: 10,
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: "700",
  },
});
