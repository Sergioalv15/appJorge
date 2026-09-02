import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useCallback, useRef } from "react";
import { useFocusEffect } from "expo-router";
import { Screen } from "../../../../ui/components/Screen";
import { useTheme } from "../../../../core/theme/ThemeProvider";
import { useMonthlyOverview } from "../hooks/useMonthlyOverview";
import { createFocusRefreshGuard } from "../hooks/focusRefreshGuard";
import { KpiCard } from "../components/KpiCard";
import { deriveHomeKpis } from "../home/deriveHomeKpis";
import { formatCurrency } from "../../../../core/utils/currency";

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

export function HomeScreen() {
  const { theme } = useTheme();
  const { loading, error, overview, records, refresh } = useMonthlyOverview();
  const shouldRefreshOnFocus = useRef(createFocusRefreshGuard());

  useFocusEffect(
    useCallback(() => {
      if (shouldRefreshOnFocus.current()) {
        void refresh();
      }
    }, [refresh]),
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
        <Text style={[styles.title, { color: theme.colors.primary }]}>Pagina Principal</Text>
        <Text style={[styles.subtitle, { color: theme.colors.mutedText }]}>Resumen rapido del mes actual</Text>
      </View>

      <View style={styles.kpiGrid}>
        <KpiCard
          label="Ventas ultimo dia"
          value={formatCurrency(kpis.ventasUltimoDia)}
          hint={`Ultimo registro: ${formatRecordDate(kpis.lastRecordDate)}`}
        />
        <KpiCard
          label="Ultima inversion"
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

      <View
        style={[
          styles.noteCard,
          {
            backgroundColor: theme.colors.card,
            borderRadius: theme.radius.md,
            borderColor: theme.colors.border,
            padding: theme.spacing.sm,
          },
        ]}
      >
        <Text style={[styles.noteTitle, { color: theme.colors.text }]}>Entrada diaria</Text>
        <Text style={[styles.noteText, { color: theme.colors.mutedText }]}>
          Usa Calendario desde el drawer para seleccionar un dia y abrir el
          formulario.
        </Text>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    gap: 2,
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
  },
  subtitle: {
    fontSize: 14,
  },
  kpiGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    rowGap: 10,
  },
  noteCard: {
    borderWidth: 1,
    gap: 4,
  },
  noteTitle: {
    fontSize: 14,
    fontWeight: "700",
  },
  noteText: {
    fontSize: 13,
    lineHeight: 18,
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
