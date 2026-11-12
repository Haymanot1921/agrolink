// client/src/shared/components/maps/MapView.jsx
// Read-only map display. Display-only per SRS §13.4.
// SRS refs: §13.4 Maps and Location Services (display only).

import React from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

export function MapView({
  center = [9.03, 38.74], // Addis Ababa
  zoom = 8,
  height = 400,
  markers = [],
  interactive = true,
}) {
  return (
    <div
      style={{
        height,
        borderRadius: 12,
        overflow: 'hidden',
        border: '1px solid var(--color-border, #E0E0E0)',
      }}
      role="region"
      aria-label="Map"
    >
      <MapContainer
        center={center}
        zoom={zoom}
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={interactive}
        dragging={interactive}
        zoomControl={interactive}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {markers}
      </MapContainer>
    </div>
  );
}

export default MapView;