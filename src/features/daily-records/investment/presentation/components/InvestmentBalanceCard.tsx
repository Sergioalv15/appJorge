import { useState } from 'react';
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { formatCurrency } from '../../../../../core/utils/currency';
import { useTheme } from '../../../../../core/theme/ThemeProvider';

interface Props {
  available: number;
  adjustmentsTotal: number;
  investedTotal: number;
  loading: boolean;
  adding: boolean;
  error: string | null;
  onAddAdjustment: (input: { date: string; amount: number; note: string }) => Promise<boolean>;
  onRefresh: () => void;
}

export function InvestmentBalanceCard({
  available,
  adjustmentsTotal,
  investedTotal,
  loading,
  adding,
  error,
  onAddAdjustment,
  onRefresh,
}: Props) {
  const { theme } = useTheme();
  const [modalVisible, setModalVisible] = useState(false);
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [isWithdrawal, setIsWithdrawal] = useState(false);

  const openModal = () => {
    setAmount('');
    setNote('');
    setIsWithdrawal(false);
    setModalVisible(true);
  };

  const handleSave = async () => {
    const parsed = Number(amount.replace(',', '.')) || 0;
    if (parsed === 0) {
      return;
    }

    const signedAmount = isWithdrawal ? -Math.abs(parsed) : Math.abs(parsed);
    const today = new Date();
    const date = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(
      today.getDate()
    ).padStart(2, '0')}`;

    const ok = await onAddAdjustment({
      date,
      amount: signedAmount,
      note: note.trim(),
    });

    if (ok) {
      setModalVisible(false);
    }
  };

  const formattedAvailable = loading ? '...' : formatCurrency(available);

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: theme.colors.surface,
          borderRadius: theme.radius.md,
          borderColor: theme.colors.border,
          padding: theme.spacing.md,
        },
      ]}
    >
      <Text style={[styles.title, { color: theme.colors.text }]}>Capital para invertir</Text>
      <Text style={[styles.value, { color: theme.colors.success }]}>{formattedAvailable}</Text>

      <View style={styles.breakdown}>
        <Text style={[styles.breakdownItem, { color: theme.colors.mutedText }]}>
          Invertido en entradas: {loading ? '...' : formatCurrency(investedTotal)}
        </Text>
        <Text style={[styles.breakdownItem, { color: theme.colors.mutedText }]}>
          Ajustes manuales: {loading ? '...' : formatCurrency(adjustmentsTotal)}
        </Text>
      </View>

      {error ? (
        <Text
          accessibilityRole="alert"
          accessibilityLiveRegion="polite"
          style={[styles.error, { color: theme.colors.danger }]}
        >
          {error}
        </Text>
      ) : null}

      <View style={styles.actions}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Agregar capital manualmente"
          style={({ pressed }) => [
            styles.button,
            {
              backgroundColor: theme.colors.primary,
              borderRadius: theme.radius.md,
            },
            pressed ? styles.buttonPressed : null,
          ]}
          onPress={openModal}
        >
          <Text style={styles.buttonText}>Agregar / Ajustar</Text>
        </Pressable>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Recargar capital para invertir"
          style={({ pressed }) => [
            styles.iconButton,
            {
              borderColor: theme.colors.border,
              borderRadius: theme.radius.md,
            },
            pressed ? styles.buttonPressed : null,
          ]}
          onPress={onRefresh}
        >
          <Text style={[styles.iconButtonText, { color: theme.colors.primary }]}>↻</Text>
        </Pressable>
      </View>

      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View
            style={[
              styles.modalContent,
              {
                backgroundColor: theme.colors.surface,
                borderRadius: theme.radius.lg,
                padding: theme.spacing.md,
              },
            ]}
          >
            <Text style={[styles.modalTitle, { color: theme.colors.text }]}>Ajustar capital</Text>

            <View style={styles.segmented}>
              <Pressable
                accessibilityRole="button"
                accessibilityState={{ selected: !isWithdrawal }}
                style={[
                  styles.segment,
                  { borderRadius: theme.radius.sm },
                  !isWithdrawal ? { backgroundColor: theme.colors.primary } : null,
                ]}
                onPress={() => setIsWithdrawal(false)}
              >
                <Text
                  style={[
                    styles.segmentText,
                    { color: !isWithdrawal ? '#FFFFFF' : theme.colors.mutedText },
                  ]}
                >
                  Sumar
                </Text>
              </Pressable>
              <Pressable
                accessibilityRole="button"
                accessibilityState={{ selected: isWithdrawal }}
                style={[
                  styles.segment,
                  { borderRadius: theme.radius.sm },
                  isWithdrawal ? { backgroundColor: theme.colors.danger } : null,
                ]}
                onPress={() => setIsWithdrawal(true)}
              >
                <Text
                  style={[
                    styles.segmentText,
                    { color: isWithdrawal ? '#FFFFFF' : theme.colors.mutedText },
                  ]}
                >
                  Retirar
                </Text>
              </Pressable>
            </View>

            <TextInput
              accessibilityLabel="Monto del ajuste en euros"
              accessibilityHint={isWithdrawal ? 'Monto a retirar' : 'Monto a sumar'}
              keyboardType="decimal-pad"
              value={amount}
              onChangeText={setAmount}
              placeholder="0"
              placeholderTextColor={theme.colors.mutedText}
              selectionColor={theme.colors.primary}
              style={[
                styles.input,
                {
                  borderColor: theme.colors.border,
                  borderRadius: theme.radius.md,
                  color: theme.colors.text,
                  backgroundColor: theme.colors.inputBackground,
                },
              ]}
            />
            <TextInput
              accessibilityLabel="Nota del ajuste"
              value={note}
              onChangeText={setNote}
              placeholder="Nota (opcional)"
              placeholderTextColor={theme.colors.mutedText}
              selectionColor={theme.colors.primary}
              style={[
                styles.input,
                {
                  borderColor: theme.colors.border,
                  borderRadius: theme.radius.md,
                  color: theme.colors.text,
                  backgroundColor: theme.colors.inputBackground,
                },
              ]}
            />

            <View style={styles.modalActions}>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Cancelar ajuste"
                style={({ pressed }) => [
                  styles.modalButton,
                  {
                    borderColor: theme.colors.border,
                    borderRadius: theme.radius.md,
                  },
                  pressed ? styles.buttonPressed : null,
                ]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={[styles.modalButtonText, { color: theme.colors.text }]}>Cancelar</Text>
              </Pressable>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Guardar ajuste"
                accessibilityState={{ disabled: adding }}
                style={({ pressed }) => [
                  styles.modalButton,
                  {
                    backgroundColor: theme.colors.primary,
                    borderRadius: theme.radius.md,
                  },
                  pressed || adding ? styles.buttonPressed : null,
                ]}
                disabled={adding}
                onPress={() => void handleSave()}
              >
                <Text style={styles.modalButtonTextPrimary}>
                  {adding ? 'Guardando...' : 'Guardar'}
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    gap: 6,
  },
  title: {
    fontSize: 14,
    fontWeight: '700',
  },
  value: {
    fontSize: 32,
    fontWeight: '800',
  },
  breakdown: {
    gap: 2,
  },
  breakdownItem: {
    fontSize: 12,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 4,
  },
  button: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
  },
  iconButton: {
    width: 42,
    height: 42,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconButtonText: {
    fontSize: 20,
    fontWeight: '700',
  },
  buttonPressed: {
    opacity: 0.65,
  },
  error: {
    fontSize: 13,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'center',
    padding: 24,
  },
  modalContent: {
    gap: 12,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  segmented: {
    flexDirection: 'row',
    gap: 8,
  },
  segment: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
  },
  segmentText: {
    fontWeight: '700',
    fontSize: 14,
  },
  input: {
    borderWidth: 1,
    paddingVertical: 10,
    paddingHorizontal: 12,
    fontSize: 16,
  },
  modalActions: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 4,
  },
  modalButton: {
    flex: 1,
    borderWidth: 1,
    paddingVertical: 10,
    alignItems: 'center',
  },
  modalButtonText: {
    fontWeight: '700',
    fontSize: 14,
  },
  modalButtonTextPrimary: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
  },
});
