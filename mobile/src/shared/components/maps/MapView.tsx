// mobile/src/shared/components/maps/MapView.tsx
// Display-only map wrapper around react-native-maps.
// SRS §13.4: used only for showing farm / storefront / product locations.
// NOT used for delivery tracking, route drawing, or transporter views (§2.4).

import React, { forwardRef } from 'react';
import { StyleSheet, ViewStyle, StyleProp } from 'react-native';
import RNMapView, {
  MapViewProps as RNMapViewProps,
  PROVIDER_GOOGLE,
  Region,
} from 'react-native-maps';
import mapStyle from '@assets/map-style.json';
import { colors } from '@styles/colors';

export interface MapViewProps extends Omit<RNMapViewProps, 'provider'> {
  /** Optional initial region (defaults to Addis Ababa). */
  initialRegion?: Region;
  /** Style override. */
  style?: StyleProp<ViewStyle>;
  /** Enable user location dot. */
  showsUserLocation?: boolean;
  /** Zoom / scroll gestures. */
  scrollEnabled?: boolean;
  zoomEnabled?: boolean;
  /** Use branded map style (default: true). */
  useBrandStyle?: boolean;
}

const ADDIS_ABABA: Region = {
  latitude: 9.03,
  longitude: 38.74,
  latitudeDelta: 0.05,
  longitudeDelta: 0.05,
};

export const MapView = forwardRef<RNMapView, MapViewProps>(function MapView(
  {
    initialRegion,
    style,
    showsUserLocation = false,
    scrollEnabled = true,
    zoomEnabled = true,
    useBrandStyle = true,
    children,
    ...rest
  },
  ref,
): React.ReactElement {
  return (
    <RNMapView
      ref={ref}
      provider={PROVIDER_GOOGLE}
      style={[styles.map, style]}
      initialRegion={initialRegion ?? ADDIS_ABABA}
      showsUserLocation={showsUserLocation}
      showsMyLocationButton={showsUserLocation}
      scrollEnabled={scrollEnabled}
      zoomEnabled={zoomEnabled}
      rotateEnabled={false}
      pitchEnabled={false}
      customMapStyle={useBrandStyle ? mapStyle : undefined}
      loadingEnabled
      loadingIndicatorColor={colors.primary}
      loadingBackgroundColor={colors.background}
      {...rest}
    >
      {children}
    </RNMapView>
  );
});

const styles = StyleSheet.create({
  map: { flex: 1, minHeight: 200 },
});