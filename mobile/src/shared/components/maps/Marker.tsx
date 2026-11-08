// mobile/src/shared/components/maps/Marker.tsx
// Marker + custom branded pin + callout bubble.
// SRS §13.4: display-only — no delivery markers.

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Marker as RNMarker, MarkerProps as RNMarkerProps } from 'react-native-maps';
import { colors } from '@styles/colors';
import { spacing } from '@styles/spacing';
import { typography } from '@styles/typography';

export interface MarkerProps extends Omit<RNMarkerProps, 'coordinate'> {
  latitude: number;
  longitude: number;
  /** Short label shown above the pin when active. */
  label?: string;
  /** Optional color for the pin (default primary). */
  color?: string;
  /** Custom node instead of default pin. */
  children?: React.ReactNode;
}

export function Marker({
  latitude,
  longitude,
  label,
  color = colors.primary,
  children,
  ...rest
}: MarkerProps): React.ReactElement {
  return (
    <RNMarker
      coordinate={{ latitude, longitude }}
      tracksViewChanges={false}
      {...rest}
    >
      {children ?? (
        <View style={styles.markerWrap}>
          {label ? (
            <View style={styles.labelBubble}>
              <Text style={styles.labelText} numberOfLines={1}>
                {label}
              </Text>
            </View>
          ) : null}
          <View style={[styles.pin, { backgroundColor: color }]}>
            <View style={styles.pinDot} />
          </View>
          <View style={[styles.pinTip, { borderTopColor: color }]} />
        </View>
      )}
    </RNMarker>
  );
}

const styles = StyleSheet.create({
  markerWrap: { alignItems: 'center' },
  labelBubble: {
    backgroundColor: colors.card,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 2,
    maxWidth: 160,
  },
  labelText: { fontSize: typography.xs, color: colors.text, fontWeight: '600' },
  pin: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3,
    elevation: 4,
  },
  pinDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#fff' },
  pinTip: {
    width: 0,
    height: 0,
    borderLeftWidth: 6,
    borderRightWidth: 6,
    borderTopWidth: 8,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    marginTop: -1,
  },
});