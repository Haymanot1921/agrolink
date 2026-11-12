// client/src/shared/components/maps/Marker.jsx
// Marker wrapper — used inside <MapView markers={[<Marker .../>]} />.
// SRS refs: §13.4.

import React from 'react';
import { Marker as LMarker, Popup } from 'react-leaflet';
import L from 'leaflet';

// Fix default icon paths under Vite/webpack
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

export function Marker({ position, title, popup, icon = 'default' }) {
  const customIcon = icon !== 'default' ? L.divIcon({
    html: `<div style="font-size:24px;line-height:1">${icon}</div>`,
    className: '',
    iconSize: [24, 24],
  }) : undefined;

  return (
    <LMarker position={position} icon={customIcon}>
      {popup && <Popup>{popup}</Popup>}
      {!popup && title && <Popup>{title}</Popup>}
    </LMarker>
  );
}

export default Marker;