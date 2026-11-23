// server/src/config/maps.js
// Location services for marketplace "nearby" search (FR-SEARCH-003).
// NO delivery routing — only geo lookups + distance.

'use strict';

const axios = require('axios');
const env = require('./environment');
const logger = require('./logger');

// Haversine fallback (works offline, used when no provider key configured).
function haversineKm(a, b) {
  const toRad = (v) => (v * Math.PI) / 180;
  const R = 6371;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

function isEnabled() {
  return Boolean(
    (env.maps.provider === 'google' && env.maps.google.apiKey) ||
    (env.maps.provider === 'mapbox' && env.maps.mapbox.accessToken),
  );
}

async function geocode(address) {
  if (!isEnabled()) {
    logger.warn('[maps] geocode skipped — provider not configured');
    return null;
  }

  try {
    if (env.maps.provider === 'google') {
      const { data } = await axios.get('https://maps.googleapis.com/maps/api/geocode/json', {
        params: { address, key: env.maps.google.apiKey, components: `country:${env.maps.defaultCountry}` },
        timeout: 10000,
      });
      const hit = data?.results?.[0];
      if (!hit) return null;
      return {
        lat: hit.geometry.location.lat,
        lng: hit.geometry.location.lng,
        formattedAddress: hit.formatted_address,
      };
    }

    if (env.maps.provider === 'mapbox') {
      const { data } = await axios.get(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(address)}.json`,
        {
          params: {
            access_token: env.maps.mapbox.accessToken,
            country: env.maps.defaultCountry,
            limit: 1,
          },
          timeout: 10000,
        },
      );
      const hit = data?.features?.[0];
      if (!hit) return null;
      const [lng, lat] = hit.center;
      return { lat, lng, formattedAddress: hit.place_name };
    }
  } catch (err) {
    logger.error('[maps] geocode failed', { message: err.message });
    return null;
  }

  return null;
}

async function reverseGeocode({ lat, lng }) {
  if (!isEnabled()) return null;

  try {
    if (env.maps.provider === 'google') {
      const { data } = await axios.get('https://maps.googleapis.com/maps/api/geocode/json', {
        params: { latlng: `${lat},${lng}`, key: env.maps.google.apiKey },
        timeout: 10000,
      });
      return data?.results?.[0]?.formatted_address || null;
    }
    if (env.maps.provider === 'mapbox') {
      const { data } = await axios.get(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json`,
        { params: { access_token: env.maps.mapbox.accessToken, limit: 1 }, timeout: 10000 },
      );
      return data?.features?.[0]?.place_name || null;
    }
  } catch (err) {
    logger.error('[maps] reverse geocode failed', { message: err.message });
    return null;
  }
  return null;
}

function distanceKm(origin, dest) {
  if (!origin || !dest) return null;
  return Number(haversineKm(origin, dest).toFixed(2));
}

function defaultCenter() {
  return { ...env.maps.defaultCenter };
}

module.exports = {
  geocode,
  reverseGeocode,
  distanceKm,
  defaultCenter,
  isEnabled,
};