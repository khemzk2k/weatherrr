import React from 'react';
import type { CurrentWeatherResponse } from '../types/weather';
import { convertTemperature, getWeatherIconUrl, formatTime } from '../utils/storage';

interface CurrentWeatherProps {
  data: CurrentWeatherResponse;
  tempUnit: 'C' | 'F';
  onToggleTemp: () => void;
  loading: boolean;
}

export const CurrentWeather: React.FC<CurrentWeatherProps> = ({
  data,
  tempUnit,
  onToggleTemp,
  loading,
}) => {
  if (loading) {
    return (
      <div className="weather-card animate-pulse">
        <div className="h-32 bg-white/10 rounded-lg"></div>
      </div>
    );
  }

  const temp = convertTemperature(data.main.temp, tempUnit);
  const feelsLike = convertTemperature(data.main.feels_like, tempUnit);
  const tempMin = convertTemperature(data.main.temp_min, tempUnit);
  const tempMax = convertTemperature(data.main.temp_max, tempUnit);

  return (
    <div className="weather-card weather-card-hover">
      <div className="text-center md:text-left">
        {/* Location and Time */}
        <div className="mb-6">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
            {data.name}, {data.sys.country}
          </h1>
          <p className="text-white/70 text-lg">
            {new Date(data.dt * 1000).toLocaleString('en-US', {
              weekday: 'long',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })}
          </p>
        </div>

        {/* Main Weather Display */}
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6 mb-6">
          {/* Weather Icon and Temperature */}
          <div className="flex items-center gap-4">
            <img
              src={getWeatherIconUrl(data.weather[0].icon)}
              alt={data.weather[0].description}
              className="weather-icon"
            />
            <div>
              <div className="text-6xl font-bold text-white">
                {Math.round(temp)}°
              </div>
              <button
                onClick={onToggleTemp}
                className="btn-secondary text-sm mt-2"
              >
                {tempUnit === 'C' ? '°F' : '°C'}
              </button>
            </div>
          </div>

          {/* Weather Description and Details */}
          <div className="flex-1">
            <p className="text-2xl text-white/90 capitalize mb-4">
              {data.weather[0].description}
            </p>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/10 rounded-lg p-3">
                <p className="text-white/60 text-sm">Feels Like</p>
                <p className="text-xl font-semibold text-white">
                  {Math.round(feelsLike)}°
                </p>
              </div>
              <div className="bg-white/10 rounded-lg p-3">
                <p className="text-white/60 text-sm">Humidity</p>
                <p className="text-xl font-semibold text-white">
                  {data.main.humidity}%
                </p>
              </div>
              <div className="bg-white/10 rounded-lg p-3">
                <p className="text-white/60 text-sm">Wind Speed</p>
                <p className="text-xl font-semibold text-white">
                  {data.wind.speed.toFixed(1)} m/s
                </p>
              </div>
              <div className="bg-white/10 rounded-lg p-3">
                <p className="text-white/60 text-sm">Pressure</p>
                <p className="text-xl font-semibold text-white">
                  {data.main.pressure} hPa
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Info */}
        <div className="grid grid-cols-3 md:grid-cols-5 gap-3 mt-6 pt-6 border-t border-white/20">
          <div className="text-center">
            <p className="text-white/60 text-sm">Min Temp</p>
            <p className="text-lg font-semibold text-white">
              {Math.round(tempMin)}°
            </p>
          </div>
          <div className="text-center">
            <p className="text-white/60 text-sm">Max Temp</p>
            <p className="text-lg font-semibold text-white">
              {Math.round(tempMax)}°
            </p>
          </div>
          <div className="text-center">
            <p className="text-white/60 text-sm">Cloud %</p>
            <p className="text-lg font-semibold text-white">{data.clouds.all}%</p>
          </div>
          <div className="text-center">
            <p className="text-white/60 text-sm">Sunrise</p>
            <p className="text-lg font-semibold text-white">
              {formatTime(data.sys.sunrise)}
            </p>
          </div>
          <div className="text-center">
            <p className="text-white/60 text-sm">Sunset</p>
            <p className="text-lg font-semibold text-white">
              {formatTime(data.sys.sunset)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
