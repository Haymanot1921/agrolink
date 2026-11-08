// mobile/src/shared/components/ui/AppSearchBar.tsx
// Search input with debounce, clear button, and voice/scan icon slot.

import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Text,
  ViewStyle,
} from 'react-native';

import { colors } from '@styles/colors';
import { spacing } from '@styles/spacing';
import { typography } from '@styles/typography';
import { useLanguage } from '@i18n/hooks/useLanguage';
import { useTranslation } from '@i18n/hooks/useTranslation';
import { pickFontFamily } from '@styles/fonts';

export interface AppSearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  onSubmit?: (text: string) => void;
  placeholder?: string;
  /** Debounce in ms before calling onChangeText (default 300). */
  debounceMs?: number;
  /** Extra action icon (e.g. barcode scanner). */
  rightAction?: React.ReactNode;
  /** Auto-focus on mount. */
  autoFocus?: boolean;
  containerStyle?: ViewStyle;
}

export function AppSearchBar({
  value,
  onChangeText,
  onSubmit,
  placeholder,
  debounceMs = 300,
  rightAction,
  autoFocus = false,
  containerStyle,
}: AppSearchBarProps): React.ReactElement {
  const { language } = useLanguage();
  const { t } = useTranslation('common');
  const [localValue, setLocalValue] = useState(value);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Sync from parent
  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const handleChange = (text: string) => {
    setLocalValue(text);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => onChangeText(text), debounceMs);
  };

  const handleClear = () => {
    setLocalValue('');
    if (timer.current) clearTimeout(timer.current);
    onChangeText('');
  };

  return (
    <View style={[styles.container, containerStyle]}>
      <Text style={styles.iconLeft}>🔍</Text>
      <TextInput
        style={[styles.input, { fontFamily: pickFontFamily(language, 'regular') }]}
        placeholder={placeholder ?? t('actions.search')}
        placeholderTextColor={colors.textMuted}
        value={localValue}
        onChangeText={handleChange}
        onSubmitEditing={() => onSubmit?.(localValue)}
        returnKeyType="search"
        autoFocus={autoFocus}
        autoCorrect={false}
        autoCapitalize="none"
        clearButtonMode="never"
        accessibilityLabel={placeholder ?? t('actions.search')}
      />
      {localValue.length > 0 ? (
        <TouchableOpacity
          onPress={handleClear}
          style={styles.clearBtn}
          accessibilityRole="button"
          accessibilityLabel={t('actions.clear')}
        >
          <Text style={styles.clearIcon}>✕</Text>
        </TouchableOpacity>
      ) : null}
      {rightAction ? <View style={styles.rightSlot}>{rightAction}</View> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 44,
    paddingHorizontal: spacing.md,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.card,
  },
  iconLeft: { fontSize: 16, marginRight: spacing.sm },
  input: {
    flex: 1,
    fontSize: typography.md,
    color: colors.text,
    paddingVertical: 0,
  },
  clearBtn: {
    paddingHorizontal: spacing.xs,
    paddingVertical: spacing.xs,
  },
  clearIcon: { fontSize: 14, color: colors.textMuted },
  rightSlot: { marginLeft: spacing.sm },
});