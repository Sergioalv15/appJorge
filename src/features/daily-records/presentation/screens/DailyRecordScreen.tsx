import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Screen } from '../../../../ui/components/Screen';
import { useTheme } from '../../../../core/theme/ThemeProvider';
import { useDailyRecord } from '../hooks/useDailyRecord';
import { DailyRecordForm } from '../components/DailyRecordForm';

export function DailyRecordScreen() {
  const { theme } = useTheme();
  const params = useLocalSearchParams<{ date?: string }>();
  const date = params.date ?? '';

  const state = useDailyRecord(date);

  if (!date) {
    return (
      <Screen>
        <Text style={[styles.error, { color: theme.colors.danger }]}>Fecha inválida</Text>
      </Screen>
    );
  }

  if (state.loading) {
    return (
      <Screen>
        <View style={styles.center}>
          <ActivityIndicator color={theme.colors.primary} />
          <Text style={[styles.muted, { color: theme.colors.mutedText }]}>Cargando día...</Text>
        </View>
      </Screen>
    );
  }

  return (
    <Screen>
      <DailyRecordForm
        date={date}
        totalSold={state.totalSold}
        investmentCost={state.investmentCost}
        additionalExpenses={state.additionalExpenses}
        notes={state.notes}
        grossProfit={state.previewProfit.grossProfit}
        netProfit={state.previewProfit.netProfit}
        saving={state.saving}
        error={state.error}
        notice={state.notice}
        onTotalSoldChange={state.setTotalSold}
        onInvestmentCostChange={state.setInvestmentCost}
        onAdditionalExpensesChange={state.setAdditionalExpenses}
        onNotesChange={state.setNotes}
        onSave={state.save}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  center: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 100,
    gap: 10,
  },
  muted: {},
  error: {
    fontWeight: '700',
  },
});
