// mobile/src/layouts/common/AuthLayout.tsx
// Wrapper for all auth screens — safe area, keyboard avoiding, scroll,
// language switcher access, offline banner.
// SRS refs: §5.1 (auth), §11.7 (mobile UX).

import React, { ReactNode } from 'react';
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
  Text,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useTranslation } from '@i18n/hooks/useTranslation';
import { useLanguage } from '@i18n/hooks/useLanguage';
import { Icons } from '@assets/assets';
import { colors } from '@styles/colors';
import { spacing } from '@styles/spacing';
import { OfflineBanner } from './OfflineBanner';
import { LanguageSwitcherModal } from './LanguageSwitcherModal';

interface AuthLayoutProps {
  children: ReactNode;
  /** Show back button (default true). */
  showBack?: boolean;
  /** Called when back pressed. */
  onBack?: () => void;
  /** Show brand logo (default true). */
  showLogo?: boolean;
  /** Optional subtitle shown below the logo. */
  subtitle?: string;
  /** Enable scrolling (default true). */
  scrollable?: boolean;
}

export function AuthLayout({
  children,
  showBack = true,
  onBack,
  showLogo = true,
  subtitle,
  scrollable = true,
}: AuthLayoutProps): React.ReactElement {
  const { t } = useTranslation('common');
  const { language, toggleLanguage } = useLanguage();
  const [langModalOpen, setLangModalOpen] = React.useState(false);

  const content = (
    <View style={styles.content}>
      {showLogo && (
        <View style={styles.logoWrap}>
          <Image source={Icons.app} style={styles.logo} resizeMode="contain" />
          <Text style={styles.appName}>{t('appName')}</Text>
          {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
        </View>
      )}
      {children}
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right', 'bottom']}>
      <OfflineBanner />

      <View style={styles.header}>
        {showBack ? (
          <TouchableOpacity
            onPress={onBack}
            style={styles.backBtn}
            accessibilityRole="button"
            accessibilityLabel={t('accessibility.back')}
          >
            <Text style={styles.backIcon}>‹</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.backBtn} />
        )}

        <TouchableOpacity
          onPress={() => setLangModalOpen(true)}
          style={styles.langBtn}
          accessibilityRole="button"
          accessibilityLabel={t('labels.language')}
        >
          <Text style={styles.langText}>
            {language === 'en' ? 'አማ' : 'EN'}
          </Text>
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.flex}
      >
        {scrollable ? (
          <ScrollView
            contentContainerStyle={styles.scroll}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {content}
          </ScrollView>
        ) : (
          content
        )}
      </KeyboardAvoidingView>

      <LanguageSwitcherModal
        visible={langModalOpen}
        onClose={() => setLangModalOpen(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  flex: { flex: 1 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  backBtn: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backIcon: { fontSize: 32, color: colors.text, lineHeight: 32 },
  langBtn: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 999,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
  },
  langText: { fontSize: 13, fontWeight: '600', color: colors.primary },
  scroll: { flexGrow: 1, padding: spacing.lg },
  content: { flex: 1, gap: spacing.md },
  logoWrap: {
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  logo: { width: 72, height: 72, borderRadius: 16, marginBottom: spacing.sm },
  appName: { fontSize: 20, fontWeight: '700', color: colors.text },
  subtitle: {
    fontSize: 14,
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: spacing.xs,
  },
});