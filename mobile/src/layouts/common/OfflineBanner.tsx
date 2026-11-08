// mobile/src/layouts/common/OfflineBanner.tsx
// Non-blocking banner shown when offline (or back online briefly).
// SRS refs: §11.7, NFR-REL-004, NFR-USE-006 (understandable errors).

import React, { useEffect, useRef } from 'react';
import {
  Animated,
  Text,
  StyleSheet,
  View,
  TouchableOpacity,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useNetworkStatus } from './NetworkStatusProvider';
import { useTranslation } from '@i18n/hooks/useTranslation';
import { colors } from '@styles/colors';
import { spacing } from '@styles/spacing';

interface OfflineBannerProps {
  /** Optional callback when user taps the banner. */
  onPress?: () => void;
}

export function OfflineBanner({ onPress }: OfflineBannerProps): React.ReactElement | null {
  const { isConnected, isInternetReachable, isSlowConnection, refresh } = useNetworkStatus();
  const { t } = useTranslation('mobile');
  const insets = useSafeAreaInsets();

  const offline = !isConnected || !isInternetReachable;
  const [showReconnected, setShowReconnected] = React.useState(false);
  const wasOffline = useRef(offline);

  const translateY = useRef(new Animated.Value(-100)).current;

  // Animate banner in/out
  useEffect(() => {
    const shouldShow = offline || showReconnected;
    Animated.timing(translateY, {
      toValue: shouldShow ? 0 : -100,
      duration: 250,
      useNativeDriver: true,
    }).start();
  }, [offline, showReconnected, translateY]);

  // Handle "reconnected" toast for 2 seconds after coming back online
  useEffect(() => {
    if (wasOffline.current && !offline) {
      setShowReconnected(true);
      const id = setTimeout(() => setShowReconnected(false), 2000);
      return () => clearTimeout(id);
    }
    wasOffline.current = offline;
  }, [offline]);

  if (!offline && !showReconnected) return null;

  const bg = offline ? colors.danger : colors.success;
  const message = offline
    ? isSlowConnection
      ? t('network.slowConnection')
      : t('network.offlineBody')
    : t('network.online');

  return (
    <Animated.View
      style={[
        styles.container,
        {
          paddingTop: insets.top + spacing.sm,
          backgroundColor: bg,
          transform: [{ translateY }],
        },
      ]}
    >
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => {
          if (onPress) onPress();
          else if (offline) refresh();
        }}
        style={styles.inner}
      >
        <View style={styles.dot} />
        <Text style={styles.text} numberOfLines={2}>
          {message}
        </Text>
        {offline && (
          <Text style={styles.action}>{t('actions.retry', { ns: 'common' })}</Text>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 9999,
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.sm,
  },
  inner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#fff',
  },
  text: {
    flex: 1,
    color: '#fff',
    fontSize: 13,
    fontWeight: '600',
  },
  action: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '700',
    textDecorationLine: 'underline',
  },
});