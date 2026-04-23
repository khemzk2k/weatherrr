import React, { useEffect } from 'react';
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

  // Load weather on mount (optional: load default city or geolocation)
  useEffect(() => {
    // You can auto-load weather here if you want
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

        {/* Search Bar */}
        <div className="mb-8">
          <SearchBar
            onSearch={searchByCity}
            onGeolocation={searchByGeolocation}
            recentSearches={recentSearches}
            onSelectRecent={searchByCity}
            loading={loading}
          />
        </div>

        {/* Error Display */}
        {error && (
          <div className="max-w-2xl mx-auto mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-lg backdrop-blur-sm">
            <p className="text-red-100">
              <span className="font-semibold">⚠️ Error:</span> {error.message}
            </p>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="mb-8">
            <LoadingSpinner />
          </div>
        )}

        {/* Weather Display */}
        {!loading && (
          <div className="space-y-8">
            {/* Current Weather */}
            {current && (
              <div>
                <CurrentWeather
                  data={current}
                  tempUnit={tempUnit}
                  onToggleTemp={toggleTemperatureUnit}
                  loading={loading}
                />
              </div>
            )}

            {/* Forecast */}
            {forecast && (
              <div>
                <Forecast
                  data={forecast}
                  tempUnit={tempUnit}
                  loading={loading}
                />
              </div>
            )}

            {/* No Data Message */}
            {!current && !forecast && (
              <div className="text-center py-16">
                <p className="text-white/60 text-xl mb-4">
                  🔍 Search for a city to see the weather forecast
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
            Data provided by OpenWeatherMap | Built with React + Vite + Tailwind CSS
          </p>
        </footer>
      </div>
    </div>
  );
}

export default App;
                Learn more
              </a>
            </li>
          </ul>
        </div>
        <div id="social">
          <svg className="icon" role="presentation" aria-hidden="true">
            <use href="/icons.svg#social-icon"></use>
          </svg>
          <h2>Connect with us</h2>
          <p>Join the Vite community</p>
          <ul>
            <li>
              <a href="https://github.com/vitejs/vite" target="_blank">
                <svg
                  className="button-icon"
                  role="presentation"
                  aria-hidden="true"
                >
                  <use href="/icons.svg#github-icon"></use>
                </svg>
                GitHub
              </a>
            </li>
            <li>
              <a href="https://chat.vite.dev/" target="_blank">
                <svg
                  className="button-icon"
                  role="presentation"
                  aria-hidden="true"
                >
                  <use href="/icons.svg#discord-icon"></use>
                </svg>
                Discord
              </a>
            </li>
            <li>
              <a href="https://x.com/vite_js" target="_blank">
                <svg
                  className="button-icon"
                  role="presentation"
                  aria-hidden="true"
                >
                  <use href="/icons.svg#x-icon"></use>
                </svg>
                X.com
              </a>
            </li>
            <li>
              <a href="https://bsky.app/profile/vite.dev" target="_blank">
                <svg
                  className="button-icon"
                  role="presentation"
                  aria-hidden="true"
                >
                  <use href="/icons.svg#bluesky-icon"></use>
                </svg>
                Bluesky
              </a>
            </li>
          </ul>
        </div>
      </section>

      <div className="ticks"></div>
      <section id="spacer"></section>
    </>
  )
}

export default App
