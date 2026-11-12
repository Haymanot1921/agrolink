// client/src/shared/components/maps/LocationPicker.jsx
// Display + record lat/lng. Doesn't initiate delivery — SRS §13.4.
// SRS refs: §13.4.

import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker as LMarker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useTranslation } from '@i18n/hooks/useTranslation';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

function ClickHandler({ onPick }) {
  useMapEvents({
    click(e) {
      onPick({ lat: e.latlng.lat, lng: e.latlng.lng });
    },
  });
  return null;
}

export function LocationPicker({ value, onChange, defaultCenter = [9.03, 38.74], zoom = 8, height = 350 }) {
  const { t } = useTranslation('common');
  const [position, setPosition] = useState(
    value ? [value.lat, value.lng] : null,
  );

  const pick = ({ lat, lng }) => {
    const rounded = { lat: Number(lat.toFixed(6)), lng: Number(lng.toFixed(6)) };
    setPosition([rounded.lat, rounded.lng]);
    onChange?.(rounded);
  };

  return (
    <div>
      <div
        style={{ height, borderRadius: 12, overflow: 'hidden', border: '1px solid var(--color-border, #E0E0E0)' }}
      >
        <MapContainer center={position ?? defaultCenter} zoom={zoom} style={{ height: '100%' }}>
          <TileLayer
            attribution='&copy; OpenStreetMap'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <ClickHandler onPick={pick} />
          {position && <LMarker position={position} />}
        </MapContainer>
      </div>
      <p style={{ fontSize: 12, color: 'var(--color-text-muted, #5F6368)', marginTop: 6 }}>
        {position
          ? `${t('locationPicker.selected')}: ${position[0].toFixed(6)}, ${position[1].toFixed(6)}`
          : t('locationPicker.clickToSet')}
      </p>
    </div>
  );
}

export default LocationPicker;