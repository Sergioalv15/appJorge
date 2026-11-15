import { PropsWithChildren, useContext } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  useWindowDimensions,
  View,
  ViewStyle,
} from 'react-native';
import { Edge, SafeAreaView } from 'react-native-safe-area-context';
import { HeaderHeightContext } from 'expo-router/react-navigation';
import { useTheme } from '../../core/theme/ThemeProvider';

type ScreenProps = PropsWithChildren<{
  scroll?: boolean;
  contentContainerStyle?: ViewStyle;
  topInset?: boolean;
  bottomInset?: boolean;
  keyboardAware?: boolean;
}>;

export function Screen({
  children,
  scroll = true,
  contentContainerStyle,
  topInset = false,
  bottomInset = true,
  keyboardAware = false,
}: ScreenProps) {
  const { theme } = useTheme();
  // Expo Router 58 reports the header height in dp on both platforms (SDK 54 used px on Android).
  const keyboardVerticalOffset = useContext(HeaderHeightContext) ?? 0;
  const { width } = useWindowDimensions();
  const safeAreaEdges: Edge[] = [
    ...(topInset ? ['top' as const] : []),
    'left',
    'right',
    ...(bottomInset ? ['bottom' as const] : []),
  ];
  const horizontalPadding = Math.min(
    theme.spacing.lg,
    Math.max(theme.spacing.md, width * 0.06),
  );
  const contentStyle = [
    styles.container,
    {
      paddingHorizontal: horizontalPadding,
      paddingVertical: theme.spacing.md,
      gap: theme.spacing.md,
    },
    contentContainerStyle,
  ];

  if (scroll) {
    return (
      <SafeAreaView
        edges={safeAreaEdges}
        style={[styles.safeArea, { backgroundColor: theme.colors.background }]}
      >
        <KeyboardAvoidingView
          style={styles.fill}
          behavior={keyboardAware ? (Platform.OS === 'ios' ? 'padding' : 'height') : undefined}
          keyboardVerticalOffset={keyboardVerticalOffset}
        >
          <ScrollView
            contentContainerStyle={contentStyle}
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode={keyboardAware ? 'none' : 'on-drag'}
          >
            {children}
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      edges={safeAreaEdges}
      style={[styles.safeArea, { backgroundColor: theme.colors.background }]}
    >
      <KeyboardAvoidingView
        style={styles.fill}
        behavior={keyboardAware ? (Platform.OS === 'ios' ? 'padding' : 'height') : undefined}
        keyboardVerticalOffset={keyboardVerticalOffset}
      >
        <View style={contentStyle}>{children}</View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  fill: {
    flex: 1,
  },
  container: {},
});
