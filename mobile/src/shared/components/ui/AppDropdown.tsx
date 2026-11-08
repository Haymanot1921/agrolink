// mobile/src/shared/components/ui/AppDropdown.tsx
// Anchor-based dropdown menu (opens near the trigger).
// Lightweight alternative to AppSelect when you don't need a full-screen sheet.

import React, { useState, useRef } from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  Modal,
  Dimensions,
  ViewStyle,
} from 'react-native';

import { colors } from '@styles/colors';
import { spacing } from '@styles/spacing';
import { typography } from '@styles/typography';
import { useLanguage } from '@i18n/hooks/useLanguage';
import { pickFontFamily } from '@styles/fonts';

export interface DropdownItem {
  label: string;
  onPress: () => void;
  icon?: React.ReactNode;
  destructive?: boolean;
  disabled?: boolean;
}

export interface AppDropdownProps {
  trigger: React.ReactNode;
  items: DropdownItem[];
  /** Align menu to trigger's right edge (default: left). */
  align?: 'left' | 'right';
  containerStyle?: ViewStyle;
}

export function AppDropdown({
  trigger,
  items,
  align = 'left',
  containerStyle,
}: AppDropdownProps): React.ReactElement {
  const { language } = useLanguage();
  const [visible, setVisible] = useState(false);
  const triggerRef = useRef<View>(null);
  const [anchor, setAnchor] = useState({ x: 0, y: 0, width: 0, height: 0 });

  const openMenu = () => {
    triggerRef.current?.measureInWindow((x, y, width, height) => {
      setAnchor({ x, y, width, height });
      setVisible(true);
    });
  };

  const menuTop = anchor.y + anchor.height + 4;
  const menuLeft =
    align === 'right'
      ? anchor.x + anchor.width - MENU_WIDTH
      : anchor.x;

  return (
    <>
      <View ref={triggerRef} collapsable={false} style={containerStyle}>
        <TouchableOpacity
          onPress={openMenu}
          accessibilityRole="button"
          accessibilityLabel="Open menu"
        >
          {trigger}
        </TouchableOpacity>
      </View>

      <Modal transparent visible={visible} animationType="fade" onRequestClose={() => setVisible(false)}>
        <TouchableOpacity
          style={StyleSheet.absoluteFill}
          activeOpacity={1}
          onPress={() => setVisible(false)}
        >
          <View
            style={[
              styles.menu,
              { top: menuTop, left: Math.max(8, menuLeft) },
            ]}
          >
            {items.map((item, idx) => (
              <TouchableOpacity
                key={idx}
                style={[styles.item, item.disabled && styles.disabled]}
                disabled={item.disabled}
                onPress={() => {
                  setVisible(false);
                  item.onPress();
                }}
                accessibilityRole="menuitem"
              >
                {item.icon ? <View style={styles.icon}>{item.icon}</View> : null}
                <Text
                  style={[
                    styles.label,
                    { fontFamily: pickFontFamily(language, 'regular') },
                    item.destructive && styles.destructive,
                  ]}
                >
                  {item.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  );
}

const MENU_WIDTH = 200;

const styles = StyleSheet.create({
  menu: {
    position: 'absolute',
    width: MENU_WIDTH,
    backgroundColor: colors.card,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: spacing.xs,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
  },
  disabled: { opacity: 0.4 },
  icon: { marginRight: spacing.sm },
  label: { fontSize: typography.md, color: colors.text },
  destructive: { color: colors.danger },
});