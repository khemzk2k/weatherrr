import  { useEffect } from 'react';
import './App.css';
import { SearchBar } from './components/SearchBar';
import { CurrentWeather } from './components/CurrentWeather';
import { Forecast } from './components/Forecast';
import { LoadingSpinner } from './components/LoadingSpinner';
import { useWeather } from './hooks/useWeather';
import { storage } from './utils/storage';

function App() {
  const {
    current,
    forecast,
    loading,
    error,
    tempUnit,
    searchByCity,
    searchByGeolocation,
    toggleTemperatureUnit,
  } = useWeather();

  const recentSearches = storage.getRecentSearches();

  useEffect(() => {
    // Optional auto-load
    // searchByGeolocation();
  }, []);

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <header className="text-center mb-8">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-2">
            ☀️ Weather App
          </h1>
          <p className="text-white/70 text-lg">
            Real-time weather forecasts for any location
          </p>
        </header>

        {/* Search */}
        <div className="mb-8">
          <SearchBar
            onSearch={searchByCity}
            onGeolocation={searchByGeolocation}
            recentSearches={recentSearches}
            onSelectRecent={searchByCity}
            loading={loading}
          />
        </div>

        {/* Error */}
        {error && (
          <div className="max-w-2xl mx-auto mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-lg backdrop-blur-sm">
            <p className="text-red-100">
              ⚠️ {error.message}
            </p>
          </div>
        )}

        {/* Loading */}
        {loading && <LoadingSpinner />}

        {/* Weather Content */}
        {!loading && (
          <div className="space-y-8">

            {current && (
              <CurrentWeather
                data={current}
                tempUnit={tempUnit}
                onToggleTemp={toggleTemperatureUnit}
                loading={loading}
              />
            )}

            {forecast && (
              <Forecast
                data={forecast}
                tempUnit={tempUnit}
                loading={loading}
              />
            )}

            {!current && !forecast && (
              <div className="text-center py-16">
                <p className="text-white/60 text-xl mb-4">
                  🔍 Search for a city or use your location
                </p>
                <button
                  onClick={searchByGeolocation}
                  className="btn-primary"
                >
                  📍 Use My Location
                </button>
              </div>
            )}

          </div>
        )}

        {/* Footer */}
        <footer className="mt-16 pt-8 border-t border-white/10 text-center">
          <p className="text-white/60 text-sm">
            Built with React + Vite + Tailwind CSS
          </p>
        </footer>

      </div>
    </div>
  );
}

export default App;