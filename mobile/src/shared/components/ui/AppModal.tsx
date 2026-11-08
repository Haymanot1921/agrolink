// mobile/src/shared/components/ui/AppModal.tsx
// Centered modal with title, body, actions. Uses RN Modal (not BottomSheet).

import React from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Pressable,
} from 'react-native';

import { colors } from '@styles/colors';
import { spacing } from '@styles/spacing';
import { typography } from '@styles/typography';
import { useLanguage } from '@i18n/hooks/useLanguage';
import { pickFontFamily } from '@styles/fonts';

export interface ModalAction {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'ghost' | 'danger';
}

export interface AppModalProps {
  visible: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  actions?: ModalAction[];
  children?: React.ReactNode;
  /** Prevent closing by tapping the backdrop. */
  lockBackdrop?: boolean;
}

export function AppModal({
  visible,
  onClose,
  title,
  description,
  actions,
  children,
  lockBackdrop = false,
}: AppModalProps): React.ReactElement {
  const { language } = useLanguage();
  const bold = pickFontFamily(language, 'bold');
  const regular = pickFontFamily(language, 'regular');

  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable
        style={styles.backdrop}
        onPress={() => (lockBackdrop ? undefined : onClose())}
      >
        <Pressable style={styles.card} onPress={(e) => e.stopPropagation()}>
          {title ? (
            <Text style={[styles.title, { fontFamily: bold }]}>{title}</Text>
          ) : null}
          {description ? (
            <Text style={[styles.description, { fontFamily: regular }]}>
              {description}
            </Text>
          ) : null}
          {children ? <View style={styles.body}>{children}</View> : null}
          {actions?.length ? (
            <View style={styles.actions}>
              {actions.map((action, idx) => {
                const variant = action.variant ?? 'primary';
                return (
                  <TouchableOpacity
                    key={idx}
                    style={[styles.actionBtn, ACTION_STYLES[variant].container]}
                    onPress={action.onPress}
                  >
                    <Text
                      style={[
                        styles.actionText,
                        { fontFamily: bold, color: ACTION_STYLES[variant].textColor },
                      ]}
                    >
                      {action.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          ) : null}
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const ACTION_STYLES: Record<
  NonNullable<ModalAction['variant']>,
  { container: object; textColor: string }
> = {
  primary: { container: { backgroundColor: colors.primary }, textColor: '#fff' },
  ghost: {
    container: { backgroundColor: 'transparent', borderWidth: 1, borderColor: colors.border },
    textColor: colors.text,
  },
  danger: { container: { backgroundColor: colors.danger }, textColor: '#fff' },
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: colors.overlay ?? 'rgba(0,0,0,0.45)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.lg,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: spacing.lg,
    width: '100%',
    maxWidth: 400,
  },
  title: {
    fontSize: typography.xl,
    color: colors.text,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  description: {
    fontSize: typography.md,
    color: colors.textMuted,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  body: { marginVertical: spacing.sm },
  actions: { marginTop: spacing.md, gap: spacing.sm },
  actionBtn: {
    paddingVertical: spacing.md,
    borderRadius: 10,
    alignItems: 'center',
  },
  actionText: { fontSize: typography.md },
});