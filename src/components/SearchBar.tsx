import React, { useState, useCallback } from 'react';
import type { RecentSearch } from '../types/weather';
import { debounce } from '../utils/debounce';

interface SearchBarProps {
  onSearch: (city: string) => void;
  onGeolocation: () => void;
  recentSearches: RecentSearch[];
  onSelectRecent: (city: string) => void;
  loading: boolean;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  onSearch,
  onGeolocation,
  recentSearches,
  onSelectRecent,
  loading,
}) => {
  const [input, setInput] = useState('');
  const [showRecent, setShowRecent] = useState(false);

  const debouncedSearch = useCallback(
    debounce((value: string) => {
      if (value.trim().length > 0) {
        onSearch(value);
      }
    }, 500),
    [onSearch]
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInput(value);
    debouncedSearch(value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      onSearch(input);
    }
  };

  const handleSelectRecent = (city: string) => {
    setInput(city);
    onSelectRecent(city);
    setShowRecent(false);
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <input
              type="text"
              value={input}
              onChange={handleChange}
              onFocus={() => setShowRecent(true)}
              onBlur={() => setTimeout(() => setShowRecent(false), 200)}
              placeholder="Search for a city..."
              className="input-search"
              disabled={loading}
            />
            
            {/* Recent Searches Dropdown */}
            {showRecent && recentSearches.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white/20 backdrop-blur-md border border-white/20 rounded-lg overflow-hidden z-10">
                <div className="py-2">
                  {recentSearches.slice(0, 5).map((search) => (
                    <button
                      key={search.timestamp}
                      type="button"
                      onClick={() => handleSelectRecent(search.city)}
                      className="w-full text-left px-4 py-2 hover:bg-white/20 transition-colors text-white/80 hover:text-white text-sm"
                    >
                      📍 {search.city}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={onGeolocation}
            disabled={loading}
            className="btn-primary relative flex items-center justify-center"
            title="Use my location"
          >
            <span className="text-lg">📍</span>
          </button>

          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="btn-primary relative flex items-center justify-center"
          >
            {loading ? (
              <span className="animate-spin">⟳</span>
            ) : (
              <span>🔍</span>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
