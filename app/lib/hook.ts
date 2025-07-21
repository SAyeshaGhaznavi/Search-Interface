import { useState, useEffect } from 'react';

export function useSearchHistory() {
  const [searchHistory, setSearchHistory] = useState<string[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem('searchHistory');
    if (stored) setSearchHistory(JSON.parse(stored));
  }, []);

  useEffect(() => {
    localStorage.setItem('searchHistory', JSON.stringify(searchHistory));
  }, [searchHistory]);

  function addToSearchHistory(query: string) {
    const trimmed = query.trim();
    if (
      trimmed.length < 2 ||
      trimmed.length > 100 ||
      /[^a-zA-Z0-9\s]/.test(trimmed) ||
      searchHistory[0] === trimmed
    ) {
      return;
    }
    setSearchHistory(prev => {
      const filtered = prev.filter(q => q !== trimmed);
      return [trimmed, ...filtered].slice(0, 10);
    });
  }

  return { searchHistory, addToSearchHistory };
} 