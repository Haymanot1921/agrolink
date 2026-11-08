// mobile/src/shared/components/maps/LocationPicker.tsx
// Interactive map for picking a farm / storefront address.
// User can drag the pin, tap the map, or search via GPS.
// SRS refs: §5.2 (farm location), §5.5 (storefront address), §13.4.

import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  ViewStyle,
} from 'react-native';
import * as ExpoLocation from 'expo-location';
import RNMapView, { Region, PROVIDER_GOOGLE } from 'react-native-maps';

import { MapView } from './MapView';
import { Marker } from './Marker';
import { colors } from '@styles/colors';
import { spacing } from '@styles/spacing';
import { typography } from '@styles/typography';
import { useTranslation } from '@i18n/hooks/useTranslation';
import { useLanguage } from '@i18n/hooks/useLanguage';
import { pickFontFamily } from '@styles/fonts';

export interface PickedLocation {
  latitude: number;
  longitude: number;
  /** Optional reverse-geocoded address (needs separate geocoding service). */
  address?: string;
}

export interface LocationPickerProps {
  label?: string;
  value?: PickedLocation | null;
  onChange: (location: PickedLocation) => void;
  error?: string;
  required?: boolean;
  helper?: string;
  containerStyle?: ViewStyle;
  mapHeight?: number;
}

const DEFAULT_REGION: Region = {
  latitude: 9.03,
  longitude: 38.74,
  latitudeDelta: 0.05,
  longitudeDelta: 0.05,
};

export function LocationPicker({
  label,
  value,
  onChange,
  error,
  required,
  helper,
  containerStyle,
  mapHeight = 280,
}: LocationPickerProps): React.ReactElement {
  const { t } = useTranslation('common');
  const { language } = useLanguage();
  const mapRef = useRef<RNMapView>(null);
  const [loading, setLoading] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const updateLocation = (lat: number, lng: number) => {
    setLocalError(null);
    onChange({ latitude: lat, longitude: lng });
  };

  const onMapPress = (e: { nativeEvent: { coordinate: { latitude: number; longitude: number } } }) => {
    const { latitude, longitude } = e.nativeEvent.coordinate;
    updateLocation(latitude, longitude);
  };

  const onMarkerDragEnd = (e: {
    nativeEvent: { coordinate: { latitude: number; longitude: number } };
  }) => {
    const { latitude, longitude } = e.nativeEvent.coordinate;
    updateLocation(latitude, longitude);
  };

  const useMyLocation = async () => {
    setLocalError(null);
    setLoading(true);
    try {
      const { status } = await ExpoLocation.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setLocalError('Location permission not granted');
        return;
      }
      const pos = await ExpoLocation.getCurrentPositionAsync({
        accuracy: ExpoLocation.Accuracy.Balanced,
      });
      const { latitude, longitude } = pos.coords;
      mapRef.current?.animateToRegion(
        { latitude, longitude, latitudeDelta: 0.01, longitudeDelta: 0.01 },
        500,
      );
      updateLocation(latitude, longitude);
    } catch {
      setLocalError(t('messages.tryAgain'));
    } finally {
      setLoading(false);
    }
  };

  const initialRegion: Region = value
    ? {
        latitude: value.latitude,
        longitude: value.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      }
    : DEFAULT_REGION;

  return (
    <View style={[styles.wrapper, containerStyle]}>
      {label ? (
        <Text style={[styles.label, { fontFamily: pickFontFamily(language, 'bold') }]}>
          {label}
          {required ? <Text style={styles.required}> *</Text> : null}
        </Text>
      ) : null}

      <View style={[styles.mapWrap, error && styles.mapWrapError, { height: mapHeight }]}>
        <MapView
          ref={mapRef}
          initialRegion={initialRegion}
          onPress={onMapPress}
          showsUserLocation
          style={StyleSheet.absoluteFill}
        >
          {value ? (
            <Marker
              latitude={value.latitude}
              longitude={value.longitude}
              draggable
              onDragEnd={onMarkerDragEnd}
              label={label ?? 'Selected'}
            />
          ) : null}
        </MapView>

        <TouchableOpacity
          style={styles.myLocationBtn}
          onPress={useMyLocation}
          disabled={loading}
          accessibilityRole="button"
          accessibilityLabel="Use my current location"
        >
          {loading ? (
            <ActivityIndicator color={colors.primary} size="small" />
          ) : (
            <Text style={styles.myLocationIcon}>📍</Text>
          )}
        </TouchableOpacity>
      </View>

      {value ? (
        <View style={styles.coordsRow}>
          <Text style={styles.coordsText}>
            {value.latitude.toFixed(5)}, {value.longitude.toFixed(5)}
          </Text>
        </View>
      ) : (
        <Text style={styles.hint}>{t('actions.selectOne')} — tap the map</Text>
      )}

      {(error || localError || helper) ? (
        <Text style={[styles.helper, (error || localError) && styles.errorText]}>
          {error ?? localError ?? helper}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { gap: spacing.xs },
  label: { fontSize: typography.sm, color: colors.text, marginBottom: spacing.xs },
  required: { color: colors.danger },
  mapWrap: {
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
    position: 'relative',
  },
  mapWrapError: { borderColor: colors.danger, borderWidth: 2 },
  myLocationBtn: {
    position: 'absolute',
    bottom: spacing.md,
    right: spacing.md,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.card,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  myLocationIcon: { fontSize: 20 },
  coordsRow: { flexDirection: 'row', justifyContent: 'space-between' },
  coordsText: {
    fontSize: typography.xs + 1,
    color: colors.textMuted,
    fontFamily: 'monospace',
  },
  hint: { fontSize: typography.xs + 1, color: colors.textMuted, fontStyle: 'italic' },
  helper: { fontSize: typography.xs + 1, color: colors.textMuted },
  errorText: { color: colors.danger },
});