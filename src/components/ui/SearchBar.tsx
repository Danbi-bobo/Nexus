import React, { useState, useEffect, useRef } from 'react';
import { Search, X } from 'lucide-react';

interface SearchBarProps {
  placeholder?: string;
  onSearch: (query: string) => void;
  debounceMs?: number;
  className?: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  placeholder = 'Tìm kiếm links...',
  onSearch,
  debounceMs = 300,
  className = '',
}) => {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const debounceTimer = useRef<NodeJS.Timeout>();

  useEffect(() => {
    // Debounce search
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    debounceTimer.current = setTimeout(() => {
      onSearch(query);
    }, debounceMs);

    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, [query, onSearch, debounceMs]);

  const handleClear = () => {
    setQuery('');
    onSearch('');
  };

  return (
    <div className={`relative ${className}`}>
      <div
        className={`
          flex items-center gap-3 px-4 py-3 rounded-xl border-2 transition-all
          ${isFocused 
            ? 'border-indigo-500 bg-white shadow-lg' 
            : 'border-gray-200 bg-gray-50 hover:border-gray-300'
          }
        `}
      >
        <Search className={`w-5 h-5 ${isFocused ? 'text-indigo-500' : 'text-gray-400'}`} />
        
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          className="flex-1 bg-transparent outline-none text-gray-900 placeholder-gray-400"
        />

        {query && (
          <button
            onClick={handleClear}
            className="p-1 hover:bg-gray-200 rounded-full transition-colors"
            aria-label="Clear search"
          >
            <X className="w-4 h-4 text-gray-500" />
          </button>
        )}
      </div>

      {/* Search hint */}
      {isFocused && !query && (
        <div className="absolute top-full mt-2 left-0 right-0 bg-white rounded-lg shadow-lg border border-gray-200 p-3 z-10">
          <p className="text-sm text-gray-500">
            💡 Tip: Tìm kiếm theo tên, mô tả, hoặc tags
          </p>
        </div>
      )}
    </div>
  );
};
