// mobile/src/shared/components/ui/Toast.tsx
// Global toast provider + imperative `showToast()` API.
// Usage: showToast('Saved!', 'success')

import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Animated, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '@styles/colors';
import { spacing } from '@styles/spacing';
import { typography } from '@styles/typography';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

interface ToastMessage {
  id: number;
  type: ToastType;
  text: string;
  duration: number;
}

interface ToastContextValue {
  show: (text: string, type?: ToastType, duration?: number) => void;
}

const ToastContext = createContext<ToastContextValue>({ show: () => {} });

let currentShow: ((text: string, type?: ToastType, duration?: number) => void) | null = null;

/** Imperative API — callable anywhere. */
export function showToast(text: string, type: ToastType = 'info', duration = 3000): void {
  currentShow?.(text, type, duration);
}

const COLORS: Record<ToastType, string> = {
  success: '#166534',
  error: '#991B1B',
  info: '#1E40AF',
  warning: '#92400E',
};

export function ToastProvider({ children }: { children: React.ReactNode }): React.ReactElement {
  const [queue, setQueue] = useState<ToastMessage[]>([]);
  const nextId = useRef(0);

  const show = useCallback((text: string, type: ToastType = 'info', duration = 3000) => {
    const id = nextId.current++;
    setQueue((q) => [...q, { id, type, text, duration }]);
  }, []);

  useEffect(() => {
    currentShow = show;
    return () => {
      currentShow = null;
    };
  }, [show]);

  const current = queue[0];

  const handleDone = useCallback(() => {
    setQueue((q) => q.slice(1));
  }, []);

  return (
    <ToastContext.Provider value={{ show }}>
      {children}
      {current ? <ToastItem key={current.id} toast={current} onDone={handleDone} /> : null}
    </ToastContext.Provider>
  );
}

export function useToast(): ToastContextValue {
  return useContext(ToastContext);
}

function ToastItem({
  toast,
  onDone,
}: {
  toast: ToastMessage;
  onDone: () => void;
}): React.ReactElement {
  const insets = useSafeAreaInsets();
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(-20)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, { toValue: 1, duration: 200, useNativeDriver: true }),
      Animated.timing(translateY, { toValue: 0, duration: 200, useNativeDriver: true }),
    ]).start();

    const timeout = setTimeout(() => {
      Animated.parallel([
        Animated.timing(opacity, { toValue: 0, duration: 200, useNativeDriver: true }),
        Animated.timing(translateY, { toValue: -20, duration: 200, useNativeDriver: true }),
      ]).start(() => onDone());
    }, toast.duration);

    return () => clearTimeout(timeout);
  }, [toast.duration, opacity, translateY, onDone]);

  return (
    <Animated.View
      style={[
        styles.toast,
        {
          top: insets.top + spacing.sm,
          backgroundColor: COLORS[toast.type],
          opacity,
          transform: [{ translateY }],
        },
      ]}
      accessibilityLiveRegion="polite"
    >
      <Text style={styles.text} numberOfLines={3}>
        {toast.text}
      </Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  toast: {
    position: 'absolute',
    left: spacing.md,
    right: spacing.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 2,
    borderRadius: 10,
    zIndex: 99999,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 4 },
      },
      android: { elevation: 8 },
    }),
  },
  text: { color: '#fff', fontSize: typography.sm + 1, fontWeight: '600' },
});