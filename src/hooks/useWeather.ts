import { useState, useCallback, useEffect } from 'react';
import type {
  CurrentWeatherResponse,
  ForecastResponse,
  ErrorState,
} from '../types/weather';
import { weatherApi, WeatherApiError } from '../services/weatherApi';
import { storage } from '../utils/storage';

interface UseWeatherState {
  current: CurrentWeatherResponse | null;
  forecast: ForecastResponse | null;
  loading: boolean;
  error: ErrorState | null;
}

export const useWeather = () => {
  const [state, setState] = useState<UseWeatherState>({
    current: null,
    forecast: null,
    loading: false,
    error: null,
  });

  const [tempUnit, setTempUnit] = useState<'C' | 'F'>(() =>
    storage.getTemperatureUnit()
  );

  // Clear error after 5 seconds
  useEffect(() => {
    if (state.error) {
      const timer = setTimeout(() => {
        setState((prev) => ({ ...prev, error: null }));
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [state.error]);

  const setError = useCallback((message: string, type: ErrorState['type']) => {
    setState((prev) => ({
      ...prev,
      error: { message, type },
    }));
  }, []);

  const searchByCity = useCallback(async (city: string) => {
    if (!city.trim()) {
      setError('Please enter a city name', 'input');
      return;
    }

    setState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      const [currentData, forecastData] = await Promise.all([
        weatherApi.getCurrentWeatherByCity(city),
        weatherApi.getForecastByCity(city),
      ]);

      setState({
        current: currentData,
        forecast: forecastData,
        loading: false,
        error: null,
      });

      // Save to recent searches
      storage.addRecentSearch(city);
    } catch (error) {
      if (error instanceof WeatherApiError) {
        setError(error.message, 'api');
      } else {
        setError(
          error instanceof Error ? error.message : 'An unknown error occurred',
          'api'
        );
      }
      setState((prev) => ({ ...prev, loading: false }));
    }
  }, [setError]);

  const searchByGeolocation = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      const coords = await weatherApi.getUserLocation();
      const [currentData, forecastData] = await Promise.all([
        weatherApi.getCurrentWeatherByCoords(coords),
        weatherApi.getForecastByCoords(coords),
      ]);

      setState({
        current: currentData,
        forecast: forecastData,
        loading: false,
        error: null,
      });

      // Save to recent searches
      storage.addRecentSearch(currentData.name);
    } catch (error) {
      if (error instanceof WeatherApiError) {
        setError(error.message, 'geolocation');
      } else {
        setError(
          error instanceof Error ? error.message : 'An unknown error occurred',
          'geolocation'
        );
      }
      setState((prev) => ({ ...prev, loading: false }));
    }
  }, [setError]);

  const toggleTemperatureUnit = useCallback(() => {
    const newUnit: 'C' | 'F' = tempUnit === 'C' ? 'F' : 'C';
    setTempUnit(newUnit);
    storage.setTemperatureUnit(newUnit);
  }, [tempUnit]);

  return {
    ...state,
    tempUnit,
    searchByCity,
    searchByGeolocation,
    toggleTemperatureUnit,
  };
};
