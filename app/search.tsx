'use client';

import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { debounce } from 'lodash';
import { searchTechnologies } from './lib/api';
import { useSearchHistory } from './lib/hook';
import { jsPDF } from 'jspdf';
import { MagnifyingGlassIcon } from '@heroicons/react/24/solid';

interface Props {
  selectedTag: string | null;
  setSelectedTag: (tag: string | null) => void;
  handleSingleDownload: (tech: any) => void;
  resultDisplay: (results: any[]) => React.ReactNode;
}

export default function Search({ selectedTag }: Props) {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [searchInput, setSearchInput] = useState<boolean | false>(false);
  const [showHistoryDropdown, setShowHistoryDropdown] = useState(false);

  const { searchHistory, addToSearchHistory } = useSearchHistory();

  const {
    data: results = [],
    isLoading,
    isError
  } = useQuery({
    queryKey: ['search', query, selectedTag],
    queryFn: () => searchTechnologies(query, selectedTag ?? undefined),
    enabled: query.trim().length >= 2 && query.length <= 100 && !/[^a-zA-Z0-9\s]/.test(query),
    staleTime: 1000 * 60,
  });

  const debouncedSetQuery = useMemo(() => debounce((value: string) => setQuery(value), 400), []);

  useEffect(() => {
    if (
      query.trim().length >= 2 &&
      query.length <= 100 &&
      !/[^a-zA-Z0-9\s]/.test(query)
    ) {
      debouncedSetQuery(query);
    }
  }, [query, selectedTag]);

  useEffect(() => {
    if (
      query.trim().length >= 2 &&
      query.length <= 100 &&
      !/[^a-zA-Z0-9\s]/.test(query) &&
      results.length > 0
    ) {
      addToSearchHistory(query);
    }
  }, [results]);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    setShowHistoryDropdown(true);

    if (value.length > 100 || /[^a-zA-Z0-9\s]/.test(value)) {
      setSearchInput(false);
      return;
    }

    setSearchInput(value.length >= 2);
    debouncedSetQuery(value);
  }, [debouncedSetQuery]);

  const handleHistoryClick = (item: string) => {
    setQuery(item);
    addToSearchHistory(item);
    setShowHistoryDropdown(false);
  };

  const handleDownload = () => {
    const doc = new jsPDF();

    doc.setFontSize(16);
    doc.text(`Search Results for "${query}"`, 10, 10);

    const lines = results.map((tech: any, index: number) => {
      return `${index + 1}. Title: ${tech.title}\n   Description: ${tech.description}\n   Category: ${tech.category || 'N/A'}\n`;
    });

    const docText = lines.join('\n\n');

    doc.setFontSize(12);
    doc.text(doc.splitTextToSize(docText, 180), 10, 20);

    doc.save('searchResults.pdf');
  };

  return (
    <div>
      {/* Search Input */}
      <div
        className={`w-full rounded-xl px-6 py-6 flex items-center gap-3 min-h-[74px] transition-all ${
          isFocused ? 'ring-2 ring-purple-600 bg-white' : 'bg-[#F2F4F8]'
        }`}
      >
        {!selectedTag ? (
          <>
            <MagnifyingGlassIcon className="w-5 h-5 text-gray-500" />
            <input
              type="text"
              value={query}
              placeholder="Search what technologies we are using at..."
              className="flex-1 bg-transparent outline-none text-gray-800 placeholder-gray-500"
              onFocus={() => { setIsFocused(true); setShowHistoryDropdown(true); }}
              onBlur={() => { setTimeout(() => setShowHistoryDropdown(false), 150); setIsFocused(false); }}
              onChange={handleInputChange}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  addToSearchHistory(query);
                  setShowHistoryDropdown(false);
                }
              }}
            />
          </>
        ) : (
          <div className="flex flex-wrap gap-2">{selectedTag}</div>
        )}

        {showHistoryDropdown && searchHistory.length > 0 && (
          <div className="absolute top-30 left-170 mt-1 bg-white shadow-md rounded-lg border border-gray-200 z-20 max-h-52 max-w-50 overflow-y-auto w-[calc(100%-3rem)]">
            {searchHistory.map((item, idx) => (
              <button
                key={`${item}-${idx}`}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-violet-100 transition rounded-none"
                onMouseDown={() => handleHistoryClick(item)}
              >
                {item}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Results Section */}
      {/* <div className="mt-6">
        {isLoading ? (
          <p>Loading...</p>
        ) : isError ? (
          <p className="text-red-400">Something went wrong.</p>
        ) : results.length === 0 ? (
          <p className="text-gray-400">No Results</p>
        ) : selectedTag || (query && searchInput) ? (
          <div className="grid gap-4">
            {resultDisplay(results)}
            <button onClick={handleDownload} className="text-purple-600">Download All Results PDF</button>
          </div>
        ) : null}
      </div> */}
    </div>
  );
}
