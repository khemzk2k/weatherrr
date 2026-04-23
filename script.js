// ============================================
// WEATHER API CONFIGURATION
// ============================================
// Using Open-Meteo API - Free, no API key needed, no CORS issues
const GEOCODING_URL = 'https://geocoding-api.open-meteo.com/v1/search';
const WEATHER_URL = 'https://api.open-meteo.com/v1/forecast';

// ============================================
// DOM ELEMENTS
// ============================================
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const locationBtn = document.getElementById('locationBtn');
const celsiusBtn = document.getElementById('celsiusBtn');
const fahrenheitBtn = document.getElementById('fahrenheitBtn');
const loading = document.getElementById('loading');
const error = document.getElementById('error');
const currentWeather = document.getElementById('currentWeather');
const forecast = document.getElementById('forecast');
const recentSearches = document.getElementById('recentSearches');

// ============================================
// STATE MANAGEMENT
// ============================================
let isCelsius = true;
let currentWeatherData = null;
let debounceTimer = null;
const DEBOUNCE_DELAY = 500;
const STORAGE_KEY = 'weatherAppRecentSearches';

// ============================================
// UTILITY FUNCTIONS
// ============================================

/**
 * Show loading state
 */
function showLoading() {
    loading.classList.remove('hidden');
    error.classList.add('hidden');
    currentWeather.classList.add('hidden');
    forecast.classList.add('hidden');
}

/**
 * Hide loading state
 */
function hideLoading() {
    loading.classList.add('hidden');
}

/**
 * Show error message
 */
function showError(message) {
    error.textContent = message;
    error.classList.remove('hidden');
    currentWeather.classList.add('hidden');
    forecast.classList.add('hidden');
    hideLoading();
}

/**
 * Convert WMO Weather Code to description
 */
function getWeatherDescription(code) {
    const codes = {
        0: 'Clear sky',
        1: 'Mainly clear',
        2: 'Partly cloudy',
        3: 'Overcast',
        45: 'Foggy',
        48: 'Depositing rime fog',
        51: 'Light drizzle',
        53: 'Moderate drizzle',
        55: 'Dense drizzle',
        61: 'Slight rain',
        63: 'Moderate rain',
        65: 'Heavy rain',
        71: 'Slight snow',
        73: 'Moderate snow',
        75: 'Heavy snow',
        77: 'Snow grains',
        80: 'Slight rain showers',
        81: 'Moderate rain showers',
        82: 'Violent rain showers',
        85: 'Slight snow showers',
        86: 'Heavy snow showers',
        95: 'Thunderstorm',
        96: 'Thunderstorm with hail',
        99: 'Thunderstorm with hail'
    };
    return codes[code] || 'Unknown';
}

/**
 * Get weather icon emoji based on weather code
 */
function getWeatherIcon(code) {
    if (code === 0) return '☀️';
    if (code === 1 || code === 2) return '🌤️';
    if (code === 3) return '☁️';
    if (code === 45 || code === 48) return '🌫️';
    if (code >= 51 && code <= 55) return '🌦️';
    if (code >= 61 && code <= 65) return '🌧️';
    if (code >= 71 && code <= 77) return '❄️';
    if (code >= 80 && code <= 82) return '⛈️';
    if (code >= 85 && code <= 86) return '❄️';
    if (code >= 95 && code <= 99) return '⛈️';
    return '🌥️';
}

/**
 * Convert Celsius to Fahrenheit
 */
function celsiusToFahrenheit(celsius) {
    return Math.round((celsius * 9/5) + 32);
}

/**
 * Format temperature based on unit
 */
function formatTemp(celsius) {
    if (isCelsius) {
        return `${celsius}°C`;
    }
    return `${celsiusToFahrenheit(celsius)}°F`;
}

/**
 * Debounce function for input
 */
function debounce(callback, delay) {
    return function (...args) {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => callback(...args), delay);
    };
}

/**
 * Get recent searches from localStorage
 */
function getRecentSearches() {
    const searches = localStorage.getItem(STORAGE_KEY);
    return searches ? JSON.parse(searches) : [];
}

/**
 * Save city to recent searches
 */
function saveRecentSearch(city) {
    let searches = getRecentSearches();
    searches = searches.filter(s => s.toLowerCase() !== city.toLowerCase());
    searches.unshift(city);
    searches = searches.slice(0, 5); // Keep only 5 recent searches
    localStorage.setItem(STORAGE_KEY, JSON.stringify(searches));
    displayRecentSearches();
}

/**
 * Display recent searches
 */
function displayRecentSearches() {
    const searches = getRecentSearches();
    recentSearches.innerHTML = '';
    
    if (searches.length === 0) return;
    
    searches.forEach(city => {
        const btn = document.createElement('button');
        btn.className = 'recent-search-btn';
        btn.textContent = city;
        btn.onclick = () => searchWeather(city);
        recentSearches.appendChild(btn);
    });
}

// ============================================
// API CALLS
// ============================================

/**
 * Fetch current weather by city name
 */
async function fetchWeatherByCity(city) {
    try {
        showLoading();
        
        // First, get coordinates from city name
        const geoResponse = await fetch(
            `${GEOCODING_URL}?name=${encodeURIComponent(city)}&count=1&language=en&format=json`
        );
        
        if (!geoResponse.ok) {
            throw new Error('Failed to find city. Please try again.');
        }
        
        const geoData = await geoResponse.json();
        
        if (!geoData.results || geoData.results.length === 0) {
            throw new Error('City not found. Please check the spelling and try again.');
        }
        
        const location = geoData.results[0];
        saveRecentSearch(city);
        
        // Now fetch weather for these coordinates
        const weatherResponse = await fetch(
            `${WEATHER_URL}?latitude=${location.latitude}&longitude=${location.longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m,pressure_msl&timezone=auto`
        );
        
        if (!weatherResponse.ok) {
            throw new Error('Failed to fetch weather data.');
        }
        
        const weatherData = await weatherResponse.json();
        
        return {
            location: location,
            current: weatherData.current,
            timezone: weatherData.timezone
        };
    } catch (err) {
        showError(err.message);
        throw err;
    }
}

/**
 * Fetch current weather by coordinates
 */
async function fetchWeatherByCoords(lat, lon) {
    try {
        showLoading();
        
        // Reverse geocoding to get city name
        const geoResponse = await fetch(
            `${GEOCODING_URL}?latitude=${lat}&longitude=${lon}&count=1&language=en&format=json`
        );
        
        const geoData = await geoResponse.ok ? await geoResponse.json() : { results: [{name: 'Your Location', country: ''}] };
        const location = geoData.results?.[0] || {name: 'Your Location', country: ''};
        
        if (location.name !== 'Your Location') {
            saveRecentSearch(location.name);
        }
        
        // Fetch weather
        const weatherResponse = await fetch(
            `${WEATHER_URL}?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m,pressure_msl&timezone=auto`
        );
        
        if (!weatherResponse.ok) {
            throw new Error('Failed to fetch weather data.');
        }
        
        const weatherData = await weatherResponse.json();
        
        return {
            location: location,
            current: weatherData.current,
            timezone: weatherData.timezone
        };
    } catch (err) {
        showError(err.message);
        throw err;
    }
}

/**
 * Fetch 5-day forecast
 */
async function fetchForecast(lat, lon) {
    try {
        const response = await fetch(
            `${WEATHER_URL}?latitude=${lat}&longitude=${lon}&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=auto`
        );
        
        if (!response.ok) {
            throw new Error('Failed to fetch forecast data.');
        }
        
        return await response.json();
    } catch (err) {
        console.error('Forecast Error:', err.message);
        return null;
    }
}

// ============================================
// DISPLAY FUNCTIONS
// ============================================

/**
 * Display current weather
 */
function displayCurrentWeather(data) {
    const celsius = data.current.temperature_2m;
    const feelsLikeCelsius = data.current.apparent_temperature;
    const weatherCode = data.current.weather_code;
    
    document.getElementById('cityName').textContent = `${data.location.name}, ${data.location.country || ''}`.trim();
    document.getElementById('temperature').textContent = formatTemp(celsius);
    document.getElementById('description').textContent = getWeatherDescription(weatherCode);
    
    // Use emoji as icon
    const iconElement = document.getElementById('weatherIcon');
    iconElement.style.fontSize = '80px';
    iconElement.style.lineHeight = '1';
    iconElement.textContent = getWeatherIcon(weatherCode);
    
    document.getElementById('feelsLike').textContent = formatTemp(feelsLikeCelsius);
    document.getElementById('humidity').textContent = `${data.current.relative_humidity_2m}%`;
    document.getElementById('windSpeed').textContent = 
        isCelsius ? `${data.current.wind_speed_10m.toFixed(1)} km/h` : `${(data.current.wind_speed_10m * 0.621371).toFixed(1)} mph`;
    document.getElementById('pressure').textContent = `${Math.round(data.current.pressure_msl)} hPa`;
    
    currentWeather.classList.remove('hidden');
    currentWeatherData = { ...data, celsius };
    hideLoading();
}

/**
 * Display 5-day forecast
 */
function displayForecast(forecastData) {
    if (!forecastData || !forecastData.daily) return;
    
    const forecastContainer = document.getElementById('forecastCards');
    forecastContainer.innerHTML = '';
    
    // Open-Meteo returns daily forecast
    forecastData.daily.time.forEach((dateStr, index) => {
        const date = new Date(dateStr);
        const maxTemp = forecastData.daily.temperature_2m_max[index];
        const minTemp = forecastData.daily.temperature_2m_min[index];
        const weatherCode = forecastData.daily.weather_code[index];
        
        const card = document.createElement('div');
        card.className = 'forecast-card';
        card.innerHTML = `
            <div class="date">${date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</div>
            <div style="font-size: 40px; margin: 10px auto; text-align: center;">
                ${getWeatherIcon(weatherCode)}
            </div>
            <div class="temp">${formatTemp(maxTemp)}/${formatTemp(minTemp)}</div>
            <div class="desc">${getWeatherDescription(weatherCode)}</div>
        `;
        forecastContainer.appendChild(card);
    });
    
    forecast.classList.remove('hidden');
}

// ============================================
// MAIN FUNCTIONS
// ============================================

/**
 * Search weather by city name
 */
async function searchWeather(city) {
    if (!city.trim()) {
        showError('Please enter a city name.');
        return;
    }
    
    try {
        const weatherData = await fetchWeatherByCity(city);
        displayCurrentWeather(weatherData);
        
        const forecastData = await fetchForecast(weatherData.location.latitude, weatherData.location.longitude);
        displayForecast(forecastData);
    } catch (err) {
        // Error already displayed in fetchWeatherByCity
    }
}

/**
 * Get weather using geolocation
 */
function getUserLocation() {
    if (!navigator.geolocation) {
        showError('Geolocation is not supported by your browser.');
        return;
    }
    
    showLoading();
    
    navigator.geolocation.getCurrentPosition(
        async (position) => {
            const { latitude, longitude } = position.coords;
            try {
                const weatherData = await fetchWeatherByCoords(latitude, longitude);
                displayCurrentWeather(weatherData);
                
                const forecastData = await fetchForecast(weatherData.location.latitude, weatherData.location.longitude);
                displayForecast(forecastData);
            } catch (err) {
                // Error already displayed
            }
        },
        (err) => {
            showError('Unable to access your location. Please enable location services.');
        }
    );
}

/**
 * Toggle temperature unit
 */
function toggleTemperatureUnit(unit) {
    isCelsius = unit === 'C';
    
    if (isCelsius) {
        celsiusBtn.classList.add('active');
        fahrenheitBtn.classList.remove('active');
    } else {
        celsiusBtn.classList.remove('active');
        fahrenheitBtn.classList.add('active');
    }
    
    // Refresh display if weather data exists
    if (currentWeatherData) {
        displayCurrentWeather(currentWeatherData);
        const forecastData = forecast.classList.contains('hidden') ? null : true;
        if (forecastData) {
            // Re-fetch and display forecast with new unit
            fetchForecast(currentWeatherData.location.latitude, currentWeatherData.location.longitude)
                .then(displayForecast);
        }
    }
}

// ============================================
// EVENT LISTENERS
// ============================================

searchBtn.addEventListener('click', () => {
    searchWeather(searchInput.value);
});

searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        searchWeather(searchInput.value);
    }
});

searchInput.addEventListener('input', debounce((e) => {
    // Optional: Add autocomplete or live search here
}, DEBOUNCE_DELAY));

locationBtn.addEventListener('click', getUserLocation);

celsiusBtn.addEventListener('click', () => {
    toggleTemperatureUnit('C');
});

fahrenheitBtn.addEventListener('click', () => {
    toggleTemperatureUnit('F');
});

// ============================================
// INITIALIZATION
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    displayRecentSearches();
    
    // Auto-load user location on page load
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                fetchWeatherByCoords(latitude, longitude)
                    .then(data => {
                        displayCurrentWeather(data);
                        return data;
                    })
                    .then(data => fetchForecast(data.location.latitude, data.location.longitude))
                    .then(displayForecast);
            },
            () => {
                // Silently fail - user can search manually
            }
        );
    }
});
