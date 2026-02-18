'use client';

import { useEffect, useState } from 'react';

type Props = {
  coordinates: { lat: number; lng: number };
  locale: string;
};

type WeatherData = {
  temperature: number;
  weatherCode: number;
  windSpeed: number;
  humidity: number;
  precipitation: number;
  feelsLike: number;
};

// Weather code descriptions based on WMO codes
const getWeatherDescription = (code: number, locale: string): { text: string; icon: string } => {
  const descriptions: Record<number, { es: string; en: string; icon: string }> = {
    0: { es: 'Despejado', en: 'Clear sky', icon: '☀️' },
    1: { es: 'Mayormente despejado', en: 'Mainly clear', icon: '🌤️' },
    2: { es: 'Parcialmente nublado', en: 'Partly cloudy', icon: '⛅' },
    3: { es: 'Nublado', en: 'Overcast', icon: '☁️' },
    45: { es: 'Niebla', en: 'Fog', icon: '🌫️' },
    48: { es: 'Niebla con escarcha', en: 'Depositing rime fog', icon: '🌫️' },
    51: { es: 'Llovizna ligera', en: 'Light drizzle', icon: '🌧️' },
    53: { es: 'Llovizna moderada', en: 'Moderate drizzle', icon: '🌧️' },
    55: { es: 'Llovizna intensa', en: 'Dense drizzle', icon: '🌧️' },
    61: { es: 'Lluvia ligera', en: 'Light rain', icon: '🌧️' },
    63: { es: 'Lluvia moderada', en: 'Moderate rain', icon: '🌧️' },
    65: { es: 'Lluvia intensa', en: 'Heavy rain', icon: '🌧️' },
    66: { es: 'Lluvia helada ligera', en: 'Light freezing rain', icon: '🌨️' },
    67: { es: 'Lluvia helada intensa', en: 'Heavy freezing rain', icon: '🌨️' },
    71: { es: 'Nevada ligera', en: 'Light snow', icon: '❄️' },
    73: { es: 'Nevada moderada', en: 'Moderate snow', icon: '❄️' },
    75: { es: 'Nevada intensa', en: 'Heavy snow', icon: '❄️' },
    77: { es: 'Granizo', en: 'Snow grains', icon: '🌨️' },
    80: { es: 'Chubascos ligeros', en: 'Light showers', icon: '🌦️' },
    81: { es: 'Chubascos moderados', en: 'Moderate showers', icon: '🌦️' },
    82: { es: 'Chubascos intensos', en: 'Violent showers', icon: '⛈️' },
    85: { es: 'Nevada ligera', en: 'Light snow showers', icon: '🌨️' },
    86: { es: 'Nevada intensa', en: 'Heavy snow showers', icon: '🌨️' },
    95: { es: 'Tormenta', en: 'Thunderstorm', icon: '⛈️' },
    96: { es: 'Tormenta con granizo', en: 'Thunderstorm with hail', icon: '⛈️' },
    99: { es: 'Tormenta con granizo fuerte', en: 'Thunderstorm with heavy hail', icon: '⛈️' },
  };

  const desc = descriptions[code] || { es: 'Desconocido', en: 'Unknown', icon: '❓' };
  return {
    text: locale === 'es' ? desc.es : desc.en,
    icon: desc.icon,
  };
};

export default function WeatherWidget({ coordinates, locale }: Props) {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        setLoading(true);
        setError(false);

        // Using Open-Meteo API (free, no API key required)
        const response = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${coordinates.lat}&longitude=${coordinates.lng}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m&timezone=auto`
        );

        if (!response.ok) throw new Error('Weather fetch failed');

        const data = await response.json();

        setWeather({
          temperature: Math.round(data.current.temperature_2m),
          weatherCode: data.current.weather_code,
          windSpeed: Math.round(data.current.wind_speed_10m),
          humidity: data.current.relative_humidity_2m,
          precipitation: data.current.precipitation,
          feelsLike: Math.round(data.current.apparent_temperature),
        });
      } catch (err) {
        console.error('Error fetching weather:', err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    if (coordinates.lat && coordinates.lng) {
      fetchWeather();
    }
  }, [coordinates.lat, coordinates.lng]);

  if (loading) {
    return (
      <div className="bg-gradient-to-br from-sky-50 to-blue-100 rounded-xl border border-sky-200 p-4 sm:p-5">
        <div className="animate-pulse">
          <div className="h-5 bg-sky-200 rounded w-32 mb-3"></div>
          <div className="h-12 bg-sky-200 rounded w-24 mb-2"></div>
          <div className="h-4 bg-sky-200 rounded w-40"></div>
        </div>
      </div>
    );
  }

  if (error || !weather) {
    return null; // Hide widget if weather can't be fetched
  }

  const weatherInfo = getWeatherDescription(weather.weatherCode, locale);

  return (
    <div className="bg-gradient-to-br from-sky-50 to-blue-100 rounded-xl border border-sky-200 p-4 sm:p-5">
      <h3 className="text-base sm:text-lg font-semibold text-sky-900 mb-3 flex items-center gap-2">
        <svg className="w-5 h-5 text-sky-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
        </svg>
        {locale === 'es' ? 'Clima Actual' : 'Current Weather'}
      </h3>

      <div className="flex items-center gap-4 mb-4">
        <span className="text-5xl">{weatherInfo.icon}</span>
        <div>
          <div className="text-3xl font-bold text-sky-900">{weather.temperature}°C</div>
          <div className="text-sm text-sky-700">{weatherInfo.text}</div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 text-sm">
        <div className="flex items-center gap-2 text-sky-800">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          <span>
            {locale === 'es' ? 'Sensación: ' : 'Feels like: '}
            <strong>{weather.feelsLike}°C</strong>
          </span>
        </div>
        <div className="flex items-center gap-2 text-sky-800">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>
            {locale === 'es' ? 'Humedad: ' : 'Humidity: '}
            <strong>{weather.humidity}%</strong>
          </span>
        </div>
        <div className="flex items-center gap-2 text-sky-800">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          </svg>
          <span>
            {locale === 'es' ? 'Viento: ' : 'Wind: '}
            <strong>{weather.windSpeed} km/h</strong>
          </span>
        </div>
        {weather.precipitation > 0 && (
          <div className="flex items-center gap-2 text-sky-800">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
            <span>
              {locale === 'es' ? 'Lluvia: ' : 'Rain: '}
              <strong>{weather.precipitation} mm</strong>
            </span>
          </div>
        )}
      </div>

      <p className="text-xs text-sky-600 mt-3 flex items-center gap-1">
        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        {locale === 'es'
          ? 'Datos de Open-Meteo. Verifica antes de salir.'
          : 'Data from Open-Meteo. Verify before heading out.'}
      </p>
    </div>
  );
}
