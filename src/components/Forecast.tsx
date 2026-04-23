import React from 'react';
import type { ForecastResponse, ForecastItem } from '../types/weather';
import { convertTemperature, getWeatherIconUrl, formatDate } from '../utils/storage';
import { WeatherCardSkeleton } from './LoadingSpinner';

interface ForecastProps {
  data: ForecastResponse;
  tempUnit: 'C' | 'F';
  loading: boolean;
}

// Group forecast items by day (5-day forecast, one per day at noon)
const getDailyForecast = (items: ForecastItem[]): ForecastItem[] => {
  const dailyMap = new Map<string, ForecastItem>();

  items.forEach((item) => {
    const date = new Date(item.dt * 1000).toLocaleDateString('en-US');
    const hour = new Date(item.dt * 1000).getHours();

    // Prefer noon time (12:00) for daily forecast
    if (!dailyMap.has(date) || Math.abs(hour - 12) < Math.abs(new Date(dailyMap.get(date)!.dt * 1000).getHours() - 12)) {
      dailyMap.set(date, item);
    }
  });

  return Array.from(dailyMap.values()).slice(0, 5);
};

export const Forecast: React.FC<ForecastProps> = ({ data, tempUnit, loading }) => {
  if (loading) {
    return (
      <div>
        <h2 className="text-2xl font-bold text-white mb-4">5-Day Forecast</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {[...Array(5)].map((_, i) => (
            <WeatherCardSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  const dailyForecast = getDailyForecast(data.list);

  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-4">5-Day Forecast</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {dailyForecast.map((item) => {
          const temp = convertTemperature(item.main.temp, tempUnit);
          const tempMin = convertTemperature(item.main.temp_min, tempUnit);
          const tempMax = convertTemperature(item.main.temp_max, tempUnit);

          return (
            <div
              key={item.dt}
              className="weather-card weather-card-hover flex flex-col items-center text-center"
            >
              <p className="text-white/80 font-semibold mb-3">
                {formatDate(item.dt)}
              </p>

              <img
                src={getWeatherIconUrl(item.weather[0].icon)}
                alt={item.weather[0].description}
                className="w-16 h-16 mb-2"
              />

              <p className="text-white/70 text-sm capitalize mb-3">
                {item.weather[0].main}
              </p>

              <div className="w-full space-y-2">
                <div className="bg-white/10 rounded p-2">
                  <p className="text-white/60 text-xs">Avg</p>
                  <p className="text-lg font-bold text-white">
                    {Math.round(temp)}°
                  </p>
                </div>

                <div className="flex gap-2">
                  <div className="flex-1 bg-white/10 rounded p-2">
                    <p className="text-white/60 text-xs">Min</p>
                    <p className="text-sm font-bold text-white">
                      {Math.round(tempMin)}°
                    </p>
                  </div>
                  <div className="flex-1 bg-white/10 rounded p-2">
                    <p className="text-white/60 text-xs">Max</p>
                    <p className="text-sm font-bold text-white">
                      {Math.round(tempMax)}°
                    </p>
                  </div>
                </div>

                <div className="bg-white/10 rounded p-2">
                  <p className="text-white/60 text-xs">Humidity</p>
                  <p className="text-sm font-bold text-white">
                    {item.main.humidity}%
                  </p>
                </div>

                <div className="bg-white/10 rounded p-2">
                  <p className="text-white/60 text-xs">Wind</p>
                  <p className="text-sm font-bold text-white">
                    {item.wind.speed.toFixed(1)} m/s
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
