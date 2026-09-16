import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Screen } from '../../../../ui/components/Screen';
import { useTheme } from '../../../../core/theme/ThemeProvider';
import { useSupplierForm } from '../hooks/useSupplierForm';

function FormField(props: {
  label: string;
  labelId: string;
  value: string;
  onChangeText: (value: string) => void;
  placeholder: string;
  multiline?: boolean;
  keyboardType?: 'default' | 'phone-pad';
}) {
  const { theme } = useTheme();

  return (
    <View style={styles.field}>
      <Text nativeID={props.labelId} style={[styles.fieldLabel, { color: theme.colors.text }]}>
        {props.label}
      </Text>
      <TextInput
        accessibilityLabelledBy={props.labelId}
        accessibilityLabel={props.label}
        keyboardType={props.keyboardType ?? 'default'}
        multiline={props.multiline}
        value={props.value}
        onChangeText={props.onChangeText}
        placeholder={props.placeholder}
        placeholderTextColor={theme.colors.mutedText}
        selectionColor={theme.colors.primary}
        style={[
          styles.input,
          props.multiline ? styles.inputMultiline : null,
          {
            borderColor: theme.colors.border,
            borderRadius: theme.radius.md,
            paddingHorizontal: theme.spacing.sm,
            color: theme.colors.text,
            backgroundColor: theme.colors.inputBackground,
          },
        ]}
      />
    </View>
  );
}

export function SupplierFormScreen() {
  const { theme } = useTheme();
  const router = useRouter();
  const params = useLocalSearchParams<{ id?: string }>();
  const editingId = params.id ? Number(params.id) : null;

  const { values, loading, saving, error, isEditing, setName, setPhone, setNotes, save } =
    useSupplierForm(editingId, () => {
      router.back();
    });

  const handleSave = () => {
    void save();
  };

  if (loading) {
    return (
      <Screen>
        <View style={styles.center}>
          <Text style={[styles.muted, { color: theme.colors.mutedText }]}>Cargando proveedor...</Text>
        </View>
      </Screen>
    );
  }

  return (
    <Screen>
      <View style={styles.card}>
        <Text style={[styles.title, { color: theme.colors.text }]}>
          {isEditing ? 'Editar proveedor' : 'Nuevo proveedor'}
        </Text>

        <FormField
          label="Nombre *"
          labelId="supplier-name-label"
          value={values.name}
          onChangeText={setName}
          placeholder="Nombre del proveedor"
        />

        <FormField
          label="Teléfono"
          labelId="supplier-phone-label"
          value={values.phone}
          onChangeText={setPhone}
          placeholder="Número de teléfono"
          keyboardType="phone-pad"
        />

        <FormField
          label="Notas"
          labelId="supplier-notes-label"
          value={values.notes}
          onChangeText={setNotes}
          placeholder="Observaciones (opcional)"
          multiline
        />

        {error ? (
          <Text
            accessibilityRole="alert"
            accessibilityLiveRegion="polite"
            style={[styles.error, { color: theme.colors.danger }]}
          >
            {error}
          </Text>
        ) : null}

        <Pressable
          accessibilityRole="button"
          accessibilityLabel={isEditing ? 'Guardar cambios del proveedor' : 'Crear proveedor'}
          accessibilityState={{ disabled: saving, busy: saving }}
          style={[
            styles.button,
            {
              backgroundColor: theme.colors.primary,
              borderRadius: theme.radius.md,
            },
            saving ? styles.buttonDisabled : null,
          ]}
          disabled={saving}
          onPress={handleSave}
        >
          <Text style={styles.buttonText}>
            {saving ? 'Guardando...' : isEditing ? 'Guardar cambios' : 'Crear proveedor'}
          </Text>
        </Pressable>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: 14,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
  },
  center: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 100,
  },
  muted: {
    fontSize: 14,
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
  inputMultiline: {
    minHeight: 86,
    textAlignVertical: 'top',
  },
  error: {
    fontSize: 13,
  },
  button: {
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 4,
  },
  buttonDisabled: {
    opacity: 0.65,
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 16,
  },
});