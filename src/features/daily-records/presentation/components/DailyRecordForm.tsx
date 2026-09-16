import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { ReactNode } from 'react';
import { formatCurrency } from '../../../../core/utils/currency';
import { useTheme } from '../../../../core/theme/ThemeProvider';
import { Toast } from '../../../../ui/components/Toast';

interface Props {
  date: string;
  totalSold: string;
  additionalExpenses: string;
  profitPercent: string;
  notes: string;
  dataphoneSales: string;
  grossProfit: number;
  netProfit: number;
  investment: number;
  saving: boolean;
  error?: string | null;
  notice?: string | null;
  onTotalSoldChange: (value: string) => void;
  onAdditionalExpensesChange: (value: string) => void;
  onProfitPercentChange: (value: string) => void;
  onNotesChange: (value: string) => void;
  onDataphoneSalesChange: (value: string) => void;
  onNoticeHide: () => void;
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

      <Field label="Ventas datafono (€)" labelId="dataphone-sales-label">
        <TextInput
          accessibilityLabelledBy="dataphone-sales-label"
          accessibilityLabel="Ventas datafono en euros"
          accessibilityHint="Ingresá cuánto se vendió con el datafono. Solo es un registro informativo, no afecta los cálculos"
          keyboardType="decimal-pad"
          value={props.dataphoneSales}
          onChangeText={props.onDataphoneSalesChange}
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
        <Text style={[styles.fieldHint, { color: theme.colors.mutedText }]}>
          Solo registro informativo, no afecta los cálculos
        </Text>
      </Field>

      <Field label="Porcentaje de beneficio (%)" labelId="profit-percent-label">
        <TextInput
          accessibilityLabelledBy="profit-percent-label"
          accessibilityLabel="Porcentaje de beneficio en tanto por ciento"
          accessibilityHint="Porcentaje sobre las ventas que se destina a beneficio"
          keyboardType="decimal-pad"
          value={props.profitPercent}
          onChangeText={props.onProfitPercentChange}
          placeholder="30"
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

      <Field label="Destinar a inversión (€)" labelId="investment-cost-label">
        <Text
          nativeID="investment-cost-label"
          style={[
            styles.investmentValue,
            {
              borderColor: theme.colors.border,
              borderRadius: theme.radius.md,
              paddingHorizontal: theme.spacing.sm,
              color: theme.colors.text,
              backgroundColor: theme.colors.inputBackground,
            },
          ]}
        >
          {formatCurrency(props.investment)}
        </Text>
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
        <Text style={[styles.profitLabel, { color: theme.colors.mutedText }]}>Beneficio neto (calculado)</Text>
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
        <View style={styles.saveArea}>
          <View style={styles.toastOverlay}>
            <Toast message={props.notice} onHide={props.onNoticeHide} />
          </View>
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
      ) : (
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
      )}
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
  fieldHint: {
    fontSize: 11,
  },
  input: {
    borderWidth: 1,
    paddingVertical: 10,
    fontSize: 16,
  },
  investmentValue: {
    borderWidth: 1,
    paddingVertical: 11,
    fontSize: 16,
    fontWeight: '600',
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
  saveArea: {
    position: 'relative',
  },
  toastOverlay: {
    position: 'absolute',
    top: -52,
    left: 0,
    right: 0,
    zIndex: 10,
    alignItems: 'center',
  },
  error: {
    fontSize: 13,
  },
  notice: {
    fontSize: 13,
  },
});
