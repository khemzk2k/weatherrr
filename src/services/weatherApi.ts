import type {
  CurrentWeatherResponse,
  ForecastResponse,
  LocationCoords,
} from '../types/weather';

const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;
const API_URL = import.meta.env.VITE_WEATHER_API_URL || 'https://api.openweathermap.org/data/2.5';


  class WeatherApiError extends Error {
  statusCode?: number;

  constructor(message: string, statusCode?: number) {
    super(message);
    this.statusCode = statusCode;
    this.name = "WeatherApiError";
  }
}

export const weatherApi = {
  /**
   * Fetch current weather by city name
   */
  getCurrentWeatherByCity: async (
    city: string
  ): Promise<CurrentWeatherResponse> => {
    if (!API_KEY) {
      throw new WeatherApiError('API key is not configured');
    }

    if (!city || city.trim().length === 0) {
      throw new WeatherApiError('City name cannot be empty', 400);
    }

    try {
      const response = await fetch(
        `${API_URL}/weather?q=${encodeURIComponent(city)}&appid=${API_KEY}`
      );

      if (!response.ok) {
        if (response.status === 404) {
          throw new WeatherApiError('City not found', 404);
        }
        throw new WeatherApiError(
          `API Error: ${response.statusText}`,
          response.status
        );
      }

      const data: CurrentWeatherResponse = await response.json();
      return data;
    } catch (error) {
      if (error instanceof WeatherApiError) {
        throw error;
      }
      throw new WeatherApiError(
        `Failed to fetch weather data: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  },

  /**
   * Fetch current weather by coordinates
   */
  getCurrentWeatherByCoords: async (
    coords: LocationCoords
  ): Promise<CurrentWeatherResponse> => {
    if (!API_KEY) {
      throw new WeatherApiError('API key is not configured');
    }

    try {
      const response = await fetch(
        `${API_URL}/weather?lat=${coords.latitude}&lon=${coords.longitude}&appid=${API_KEY}`
      );

      if (!response.ok) {
        throw new WeatherApiError(
          `API Error: ${response.statusText}`,
          response.status
        );
      }

      const data: CurrentWeatherResponse = await response.json();
      return data;
    } catch (error) {
      if (error instanceof WeatherApiError) {
        throw error;
      }
      throw new WeatherApiError(
        `Failed to fetch weather data: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  },

  /**
   * Fetch 5-day forecast by city name
   */
  getForecastByCity: async (city: string): Promise<ForecastResponse> => {
    if (!API_KEY) {
      throw new WeatherApiError('API key is not configured');
    }

    if (!city || city.trim().length === 0) {
      throw new WeatherApiError('City name cannot be empty', 400);
    }

    try {
      const response = await fetch(
        `${API_URL}/forecast?q=${encodeURIComponent(city)}&appid=${API_KEY}`
      );

      if (!response.ok) {
        if (response.status === 404) {
          throw new WeatherApiError('City not found', 404);
        }
        throw new WeatherApiError(
          `API Error: ${response.statusText}`,
          response.status
        );
      }

      const data: ForecastResponse = await response.json();
      return data;
    } catch (error) {
      if (error instanceof WeatherApiError) {
        throw error;
      }
      throw new WeatherApiError(
        `Failed to fetch forecast data: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  },

  /**
   * Fetch 5-day forecast by coordinates
   */
  getForecastByCoords: async (
    coords: LocationCoords
  ): Promise<ForecastResponse> => {
    if (!API_KEY) {
      throw new WeatherApiError('API key is not configured');
    }

    try {
      const response = await fetch(
        `${API_URL}/forecast?lat=${coords.latitude}&lon=${coords.longitude}&appid=${API_KEY}`
      );

      if (!response.ok) {
        throw new WeatherApiError(
          `API Error: ${response.statusText}`,
          response.status
        );
      }

      const data: ForecastResponse = await response.json();
      return data;
    } catch (error) {
      if (error instanceof WeatherApiError) {
        throw error;
      }
      throw new WeatherApiError(
        `Failed to fetch forecast data: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  },

  /**
   * Get user's geolocation coordinates
   */
  getUserLocation: async (): Promise<LocationCoords> => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(
          new WeatherApiError(
            'Geolocation is not supported by your browser',
            undefined
          )
        );
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => {
          let message = 'Failed to get your location';
          if (error.code === 1) {
            message = 'Location permission denied. Please enable it in settings.';
          } else if (error.code === 2) {
            message = 'Location information is unavailable.';
          } else if (error.code === 3) {
            message = 'Location request timed out.';
          }
          reject(new WeatherApiError(message, undefined));
        }
      );
    });
  },
};

export { WeatherApiError };
