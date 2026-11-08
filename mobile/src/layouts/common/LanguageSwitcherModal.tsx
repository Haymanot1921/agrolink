// mobile/src/layouts/common/LanguageSwitcherModal.tsx
// Modal to switch UI language (English / Amharic).
// SRS refs: FR-ACCESS-006 (English + Amharic), §11.8 (UI principles).

import React from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useLanguage } from '@i18n/hooks/useLanguage';
import { useTranslation } from '@i18n/hooks/useTranslation';
import { LANGUAGE_LABELS, SUPPORTED_LANGUAGES, type SupportedLanguage } from '@i18n/config';
import { colors } from '@styles/colors';
import { spacing } from '@styles/spacing';

interface LanguageSwitcherModalProps {
  visible: boolean;
  onClose: () => void;
}

export function LanguageSwitcherModal({
  visible,
  onClose,
}: LanguageSwitcherModalProps): React.ReactElement {
  const { language, setLanguage } = useLanguage();
  const { t } = useTranslation('common');

  const handleSelect = async (lang: SupportedLanguage) => {
    await setLanguage(lang);
    onClose();
  };

  return (
    <Modal
      animationType="slide"
      transparent
      visible={visible}
      onRequestClose={onClose}
    >
      <Pressable style={styles.backdrop} onPress={onClose}>
        <SafeAreaView style={styles.safeArea} edges={['bottom']}>
          <Pressable style={styles.sheet} onPress={(e) => e.stopPropagation()}>
            <View style={styles.handle} />
            <Text style={styles.title}>{t('labels.language')}</Text>

            {SUPPORTED_LANGUAGES.map((lang) => {
              const isSelected = lang === language;
              return (
                <TouchableOpacity
                  key={lang}
                  style={[styles.option, isSelected && styles.optionSelected]}
                  onPress={() => handleSelect(lang)}
                  accessibilityRole="radio"
                  accessibilityState={{ selected: isSelected }}
                >
                  <View style={styles.optionRow}>
                    <Text style={styles.optionNative}>{LANGUAGE_LABELS[lang].native}</Text>
                    <Text style={styles.optionEnglish}>{LANGUAGE_LABELS[lang].english}</Text>
                  </View>
                  {isSelected && <Text style={styles.check}>✓</Text>}
                </TouchableOpacity>
              );
            })}

            <TouchableOpacity
              onPress={onClose}
              style={styles.cancelBtn}
              accessibilityRole="button"
            >
              <Text style={styles.cancelText}>{t('actions.cancel')}</Text>
            </TouchableOpacity>
          </Pressable>
        </SafeAreaView>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  safeArea: { backgroundColor: colors.card, borderTopLeftRadius: 20, borderTopRightRadius: 20 },
  sheet: {
    backgroundColor: colors.card,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.lg,
  },
  handle: {
    alignSelf: 'center',
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.border,
    marginVertical: spacing.sm,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    textAlign: 'center',
    marginVertical: spacing.md,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.sm,
  },
  optionSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryLight,
  },
  optionRow: { flex: 1 },
  optionNative: { fontSize: 16, fontWeight: '600', color: colors.text },
  optionEnglish: { fontSize: 13, color: colors.textMuted, marginTop: 2 },
  check: { fontSize: 20, color: colors.primary, fontWeight: '700' },
  cancelBtn: {
    marginTop: spacing.md,
    paddingVertical: spacing.md,
    alignItems: 'center',
  },
  cancelText: { fontSize: 15, color: colors.textMuted },
});