export interface WeatherData {
  id: number;
  main: string;
  description: string;
  icon: string;
}

export interface MainData {
  temp: number;
  feels_like: number;
  temp_min: number;
  temp_max: number;
  pressure: number;
  humidity: number;
}

export interface WindData {
  speed: number;
  deg: number;
  gust?: number;
}

export interface CurrentWeatherResponse {
  coord: { lon: number; lat: number };
  weather: WeatherData[];
  main: MainData;
  wind: WindData;
  clouds: { all: number };
  dt: number;
  sys: {
    type: number;
    id: number;
    country: string;
    sunrise: number;
    sunset: number;
  };
  timezone: number;
  id: number;
  name: string;
  cod: number;
}

export interface ForecastItem {
  dt: number;
  main: MainData;
  weather: WeatherData[];
  wind: WindData;
  visibility: number;
  pop: number;
  sys: { pod: string };
}

export interface ForecastResponse {
  cod: string;
  message: number;
  cnt: number;
  list: ForecastItem[];
  city: {
    id: number;
    name: string;
    coord: { lat: number; lon: number };
    country: string;
    population: number;
    timezone: number;
    sunrise: number;
    sunset: number;
  };
}

export interface LocationCoords {
  latitude: number;
  longitude: number;
}

export interface ErrorState {
  message: string;
  type: 'location' | 'api' | 'input' | 'geolocation';
}

export interface RecentSearch {
  city: string;
  timestamp: number;
}
