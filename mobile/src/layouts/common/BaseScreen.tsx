// mobile/src/layouts/common/BaseScreen.tsx
// Generic screen wrapper used by all non-auth screens.
// Handles: safe area, offline banner, keyboard avoiding, pull-to-refresh,
// scroll, status bar, optional back button + header.
// SRS refs: §11.7, §11.8, NFR-USE-001 (clear navigation).

import React, { ReactNode } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  ViewStyle,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';

import { useTranslation } from '@i18n/hooks/useTranslation';
import { colors } from '@styles/colors';
import { spacing } from '@styles/spacing';
import { OfflineBanner } from './OfflineBanner';

interface BaseScreenProps {
  children: ReactNode;

  /** Header title. If provided, a header is rendered. */
  title?: string;
  /** Show back arrow in header (default: false — override per screen). */
  showBack?: boolean;
  /** Custom back handler (default: navigation.goBack()). */
  onBack?: () => void;
  /** Right-side header action node. */
  headerRight?: ReactNode;
  /** Left-side header action node (overrides back arrow). */
  headerLeft?: ReactNode;

  /** Wrap in ScrollView (default: true). */
  scrollable?: boolean;
  /** Enable pull-to-refresh (requires `onRefresh`). */
  refreshing?: boolean;
  onRefresh?: () => void;

  /** Safe area edges. */
  edges?: Array<'top' | 'right' | 'bottom' | 'left'>;

  /** Container style override. */
  contentStyle?: ViewStyle;

  /** Background color (default: colors.background). */
  backgroundColor?: string;

  /** Show offline banner (default: true). */
  showOfflineBanner?: boolean;

  /** Hide the header entirely (useful for fullscreen content). */
  noHeader?: boolean;
}

export function BaseScreen({
  children,
  title,
  showBack = false,
  onBack,
  headerRight,
  headerLeft,
  scrollable = true,
  refreshing = false,
  onRefresh,
  edges = ['top', 'left', 'right'],
  contentStyle,
  backgroundColor = colors.background,
  showOfflineBanner = true,
  noHeader = false,
}: BaseScreenProps): React.ReactElement {
  const navigation = useNavigation();
  const { t } = useTranslation('common');

  const handleBack = () => {
    if (onBack) onBack();
    else if (navigation.canGoBack()) navigation.goBack();
  };

  const header = !noHeader && title ? (
    <View style={styles.header}>
      <View style={styles.headerLeft}>
        {headerLeft ?? (showBack ? (
          <TouchableOpacity
            onPress={handleBack}
            style={styles.backBtn}
            accessibilityRole="button"
            accessibilityLabel={t('accessibility.back')}
          >
            <Text style={styles.backIcon}>‹</Text>
          </TouchableOpacity>
        ) : null)}
      </View>

      <Text style={styles.title} numberOfLines={1}>
        {title}
      </Text>

      <View style={styles.headerRight}>{headerRight}</View>
    </View>
  ) : null;

  const body = scrollable ? (
    <ScrollView
      contentContainerStyle={[styles.scroll, contentStyle]}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
      refreshControl={
        onRefresh ? (
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary}
            colors={[colors.primary]}
          />
        ) : undefined
      }
    >
      {children}
    </ScrollView>
  ) : (
    <View style={[styles.staticContent, contentStyle]}>{children}</View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor }]} edges={edges}>
      <StatusBar barStyle="dark-content" backgroundColor={backgroundColor} />

      {showOfflineBanner && <OfflineBanner />}

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        {header}
        {body}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  flex: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
    minHeight: 52,
  },
  headerLeft: { width: 60, alignItems: 'flex-start' },
  headerRight: { width: 60, alignItems: 'flex-end' },
  backBtn: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backIcon: { fontSize: 32, color: colors.text, lineHeight: 32 },
  title: {
    flex: 1,
    fontSize: 17,
    fontWeight: '600',
    color: colors.text,
    textAlign: 'center',
  },
  scroll: {
    flexGrow: 1,
    padding: spacing.md,
  },
  staticContent: { flex: 1 },
});