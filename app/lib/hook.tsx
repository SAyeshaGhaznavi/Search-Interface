import { useEffect, useState } from 'react';

export function useSearchHistory() {
  const [searchHistory, setSearchHistory] = useState<string[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem('searchHistory');
    if (stored) {
      setSearchHistory(JSON.parse(stored));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('searchHistory', JSON.stringify(searchHistory));
  }, [searchHistory]);

  const addToSearchHistory = (query: string) => {
    const trimmed = query.trim();
    if (
      !trimmed ||
      trimmed.length < 2 ||
      trimmed.length > 100 ||
      /[^a-zA-Z0-9\s]/.test(trimmed)
    )
      return;

    setSearchHistory((prev) => {
      const updated = [trimmed, ...prev.filter((q) => q !== trimmed)];
      return updated.slice(0, 8);
    });
  };

  return {
    searchHistory,
    addToSearchHistory,
  };
}
