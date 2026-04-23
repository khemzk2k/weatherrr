import type { RecentSearch } from '../types/weather';

const STORAGE_KEYS = {
  RECENT_SEARCHES: 'weather_app_recent_searches',
  TEMPERATURE_UNIT: 'weather_app_temp_unit',
};

export const storage = {
  // Recent Searches
  getRecentSearches: (): RecentSearch[] => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.RECENT_SEARCHES);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error reading recent searches:', error);
      return [];
    }
  },

  addRecentSearch: (city: string): void => {
    try {
      const searches = storage.getRecentSearches();
      const filtered = searches.filter(
        (s) => s.city.toLowerCase() !== city.toLowerCase()
      );
      const updated = [
        { city, timestamp: Date.now() },
        ...filtered,
      ].slice(0, 10);
      localStorage.setItem(STORAGE_KEYS.RECENT_SEARCHES, JSON.stringify(updated));
    } catch (error) {
      console.error('Error saving recent search:', error);
    }
  },

  clearRecentSearches: (): void => {
    try {
      localStorage.removeItem(STORAGE_KEYS.RECENT_SEARCHES);
    } catch (error) {
      console.error('Error clearing recent searches:', error);
    }
  },

  // Temperature Unit
  getTemperatureUnit: (): 'C' | 'F' => {
    try {
      const unit = localStorage.getItem(STORAGE_KEYS.TEMPERATURE_UNIT);
      return (unit as 'C' | 'F') || 'C';
    } catch (error) {
      console.error('Error reading temperature unit:', error);
      return 'C';
    }
  },

  setTemperatureUnit: (unit: 'C' | 'F'): void => {
    try {
      localStorage.setItem(STORAGE_KEYS.TEMPERATURE_UNIT, unit);
    } catch (error) {
      console.error('Error saving temperature unit:', error);
    }
  },
};

export const convertTemperature = (
  kelvin: number,
  unit: 'C' | 'F'
): number => {
  const celsius = kelvin - 273.15;
  return unit === 'C' ? celsius : (celsius * 9) / 5 + 32;
};

export const getWeatherIconUrl = (iconCode: string): string => {
  return `https://openweathermap.org/img/wn/${iconCode}@4x.png`;
};

export const formatTime = (timestamp: number): string => {
  return new Date(timestamp * 1000).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const formatDate = (timestamp: number): string => {
  return new Date(timestamp * 1000).toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
};
