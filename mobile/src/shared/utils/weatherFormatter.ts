// mobile/src/shared/utils/weatherFormatter.ts
// Format weather data for display — temperature, icon key, condition labels.
// SRS refs: §11.7 mobile farmer experience.

import i18n from '@i18n/index';

export type WeatherIconKey =
  | 'sunny'
  | 'cloudy'
  | 'rainy'
  | 'stormy'
  | 'windy'
  | 'partly-cloudy';

export function formatTemperature(celsius: number, withUnit = true): string {
  const rounded = Math.round(celsius);
  return withUnit ? `${rounded}°C` : `${rounded}°`;
}

export function formatTemperatureRange(
  minC: number,
  maxC: number,
  withUnit = false,
): string {
  const suffix = withUnit ? '°C' : '°';
  return `${Math.round(maxC)}${suffix} / ${Math.round(minC)}${suffix}`;
}

export function formatWindSpeed(kph: number): string {
  return `${Math.round(kph)} km/h`;
}

export function formatHumidity(percent: number): string {
  return `${Math.round(percent)}%`;
}

/** Map a raw provider condition code/string to our UI icon key. */
export function mapConditionToIcon(condition: string): WeatherIconKey {
  const c = condition.toLowerCase();
  if (c.includes('thunder') || c.includes('storm')) return 'stormy';
  if (c.includes('rain') || c.includes('drizzle') || c.includes('shower')) return 'rainy';
  if (c.includes('wind') || c.includes('gale')) return 'windy';
  if (c.includes('partly') || c.includes('mostly sun')) return 'partly-cloudy';
  if (c.includes('cloud') || c.includes('overcast')) return 'cloudy';
  return 'sunny';
}

/** Map condition to a localized label. */
export function mapConditionToLabel(condition: string): string {
  const icon = mapConditionToIcon(condition);
  const ns = 'farmer';
  switch (icon) {
    case 'sunny':
      return i18n.t('weather.sunny', { ns, defaultValue: 'Sunny' });
    case 'cloudy':
      return i18n.t('weather.cloudy', { ns, defaultValue: 'Cloudy' });
    case 'rainy':
      return i18n.t('weather.rainy', { ns, defaultValue: 'Rainy' });
    case 'stormy':
      return i18n.t('weather.stormy', { ns, defaultValue: 'Stormy' });
    case 'windy':
      return i18n.t('weather.windy', { ns, defaultValue: 'Windy' });
    case 'partly-cloudy':
      return i18n.t('weather.partlyCloudy', { ns, defaultValue: 'Partly cloudy' });
    default:
      return condition;
  }
}

/** Map condition to a color hint for the gradient. */
export function mapConditionToGradient(icon: WeatherIconKey): [string, string] {
  switch (icon) {
    case 'sunny':
      return ['#FDD835', '#F57C00'];
    case 'cloudy':
      return ['#90A4AE', '#546E7A'];
    case 'rainy':
      return ['#4FC3F7', '#1565C0'];
    case 'stormy':
      return ['#7E57C2', '#4527A0'];
    case 'windy':
      return ['#80DEEA', '#00838F'];
    case 'partly-cloudy':
      return ['#4FC3F7', '#1976D2'];
    default:
      return ['#90A4AE', '#546E7A'];
  }
}

/** True when the farmer should get a weather warning. */
export function isSevereWeather(input: {
  maxTempC: number;
  minTempC: number;
  windSpeedKph: number;
  icon: WeatherIconKey;
}): 'info' | 'warning' | 'severe' | null {
  if (input.windSpeedKph >= 60) return 'severe';
  if (input.icon === 'stormy') return 'severe';
  if (input.maxTempC >= 38 || input.minTempC <= 2) return 'warning';
  if (input.icon === 'rainy' && input.windSpeedKph >= 30) return 'warning';
  if (input.icon === 'windy') return 'info';
  return null;
}