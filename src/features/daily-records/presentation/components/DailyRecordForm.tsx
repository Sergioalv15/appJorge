import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { ReactNode } from 'react';
import { formatCurrency } from '../../../../core/utils/currency';
import { useTheme } from '../../../../core/theme/ThemeProvider';

interface Props {
  date: string;
  totalSold: string;
  investmentCost: string;
  additionalExpenses: string;
  notes: string;
  grossProfit: number;
  netProfit: number;
  saving: boolean;
  error?: string | null;
  notice?: string | null;
  onTotalSoldChange: (value: string) => void;
  onInvestmentCostChange: (value: string) => void;
  onAdditionalExpensesChange: (value: string) => void;
  onNotesChange: (value: string) => void;
  onSave: () => void;
}

export function DailyRecordForm(props: Props) {
  const { theme } = useTheme();

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
      <Text style={[styles.title, { color: theme.colors.text }]}>Registro del día</Text>
      <Text style={[styles.date, { color: theme.colors.mutedText }]}>{props.date}</Text>

      <Field label="Total vendido (€)" labelId="total-sold-label">
        <TextInput
          accessibilityLabelledBy="total-sold-label"
          accessibilityLabel="Total vendido en euros"
          accessibilityHint="Ingresá el total vendido del día"
          keyboardType="decimal-pad"
          value={props.totalSold}
          onChangeText={props.onTotalSoldChange}
          placeholder="0"
          placeholderTextColor={theme.colors.mutedText}
          selectionColor={theme.colors.primary}
          style={[
            styles.input,
            {
              borderColor: theme.colors.border,
              borderRadius: theme.radius.md,
              paddingHorizontal: theme.spacing.sm,
              color: theme.colors.text,
              backgroundColor: theme.colors.inputBackground,
            },
          ]}
        />
      </Field>

      <Field label="Coste inversión (€)" labelId="investment-cost-label">
        <TextInput
          accessibilityLabelledBy="investment-cost-label"
          accessibilityLabel="Coste de inversión en euros"
          accessibilityHint="Ingresá el coste de inversión del día"
          keyboardType="decimal-pad"
          value={props.investmentCost}
          onChangeText={props.onInvestmentCostChange}
          placeholder="0"
          placeholderTextColor={theme.colors.mutedText}
          selectionColor={theme.colors.primary}
          style={[
            styles.input,
            {
              borderColor: theme.colors.border,
              borderRadius: theme.radius.md,
              paddingHorizontal: theme.spacing.sm,
              color: theme.colors.text,
              backgroundColor: theme.colors.inputBackground,
            },
          ]}
        />
      </Field>

      <Field label="Gastos adicionales (€)" labelId="additional-expenses-label">
        <TextInput
          accessibilityLabelledBy="additional-expenses-label"
          accessibilityLabel="Gastos adicionales en euros"
          accessibilityHint="Ingresá los gastos adicionales del día"
          keyboardType="decimal-pad"
          value={props.additionalExpenses}
          onChangeText={props.onAdditionalExpensesChange}
          placeholder="0"
          placeholderTextColor={theme.colors.mutedText}
          selectionColor={theme.colors.primary}
          style={[
            styles.input,
            {
              borderColor: theme.colors.border,
              borderRadius: theme.radius.md,
              paddingHorizontal: theme.spacing.sm,
              color: theme.colors.text,
              backgroundColor: theme.colors.inputBackground,
            },
          ]}
        />
      </Field>

      <Field label="Notas" labelId="notes-label">
        <TextInput
          accessibilityLabelledBy="notes-label"
          accessibilityLabel="Notas del día"
          accessibilityHint="Agregá observaciones opcionales del día"
          style={[
            styles.input,
            styles.notes,
            {
              borderColor: theme.colors.border,
              borderRadius: theme.radius.md,
              paddingHorizontal: theme.spacing.sm,
              color: theme.colors.text,
              backgroundColor: theme.colors.inputBackground,
            },
          ]}
          multiline
          value={props.notes}
          onChangeText={props.onNotesChange}
          placeholder="Observaciones del día"
          placeholderTextColor={theme.colors.mutedText}
          selectionColor={theme.colors.primary}
        />
      </Field>

      <View
        style={[
          styles.profitCard,
          {
            borderColor: theme.colors.border,
            borderRadius: theme.radius.md,
            padding: theme.spacing.sm,
            backgroundColor: theme.colors.card,
          },
        ]}
      >
        <Text style={[styles.profitLabel, { color: theme.colors.mutedText }]}>Beneficio bruto</Text>
        <Text style={[styles.profitValue, { color: theme.colors.text }]}>{formatCurrency(props.grossProfit)}</Text>
        <Text style={[styles.profitLabel, { color: theme.colors.mutedText }]}>Beneficio neto</Text>
        <Text style={[styles.profitValue, { color: theme.colors.success }]}>{formatCurrency(props.netProfit)}</Text>
      </View>

      {props.error ? (
        <Text
          accessibilityRole="alert"
          accessibilityLiveRegion="polite"
          style={[styles.error, { color: theme.colors.danger }]}
        >
          {props.error}
        </Text>
      ) : null}
      {props.notice ? (
        <Text accessibilityLiveRegion="polite" style={[styles.notice, { color: theme.colors.success }]}>
          {props.notice}
        </Text>
      ) : null}

      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Guardar registro del día"
        accessibilityHint="Guarda los valores cargados del día actual"
        accessibilityState={{ disabled: props.saving, busy: props.saving }}
        style={[
          styles.button,
          {
            backgroundColor: theme.colors.primary,
            borderRadius: theme.radius.md,
          },
          props.saving && styles.buttonDisabled,
        ]}
        disabled={props.saving}
        onPress={props.onSave}
      >
        <Text style={styles.buttonText}>{props.saving ? 'Guardando...' : 'Guardar día'}</Text>
      </Pressable>
    </View>
  );
}

function Field({ label, labelId, children }: { label: string; labelId: string; children: ReactNode }) {
  const { theme } = useTheme();

  return (
    <View style={styles.field}>
      <Text nativeID={labelId} style={[styles.fieldLabel, { color: theme.colors.text }]}>
        {label}
      </Text>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    borderWidth: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
  },
  date: {
    fontSize: 13,
  },
  field: {
    gap: 6,
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: '600',
  },
  input: {
    borderWidth: 1,
    paddingVertical: 10,
    fontSize: 16,
  },
  notes: {
    minHeight: 86,
    textAlignVertical: 'top',
  },
  profitCard: {
    borderWidth: 1,
    gap: 4,
  },
  profitLabel: {
    fontSize: 12,
  },
  profitValue: {
    fontSize: 18,
    fontWeight: '700',
  },
  button: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.65,
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 16,
  },
  error: {
    fontSize: 13,
  },
  notice: {
    fontSize: 13,
  },
});
