// mobile/src/shared/services/weatherService.ts
// Fetch current weather + forecast from backend (Open-Meteo / OpenWeather proxy).
// SRS refs: §11.7 (weather widget, farmer dashboard).

import { api } from './apiClient';

export interface WeatherCurrent {
  temperatureC: number;
  condition: string;
  iconKey: 'sunny' | 'cloudy' | 'rainy' | 'stormy' | 'windy' | 'partly-cloudy';
  minTempC: number;
  maxTempC: number;
  humidity: number;
  windSpeedKph: number;
  location: string;
}

export interface WeatherForecast {
  date: string;
  dayLabel: string;
  minTempC: number;
  maxTempC: number;
  iconKey: WeatherCurrent['iconKey'];
}

export interface WeatherResponse {
  current: WeatherCurrent;
  forecast: WeatherForecast[];
  updatedAt: string;
}

export const weatherService = {
  async getWeather(coords: { latitude: number; longitude: number }): Promise<WeatherResponse> {
    return api.get<WeatherResponse>('/weather', {
      params: { lat: coords.latitude, lng: coords.longitude },
    });
  },
};