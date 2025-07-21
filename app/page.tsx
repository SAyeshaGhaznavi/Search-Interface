'use client';

import { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { debounce } from 'lodash';
import { searchTechnologies } from './lib/api';
import { useSearchHistory } from './lib/hook';
import Image from 'next/image';
import { MagnifyingGlassIcon, TagIcon, ArrowDownTrayIcon } from '@heroicons/react/24/solid';
import { jsPDF } from 'jspdf';
import resultDisplay from './resultDisplay';
import TagSelector from './tags';

const TAGS = ['Languages', 'Build', 'Design', 'Cloud'];

export default function Home() {
  const [query, setQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [isFocused, setIsFocused] = useState(false);
  //const [tagSet, setTagSet] = useState(false);
  const [focusedTagIndex, setFocusedTagIndex] = useState<number | null>(null);
  //const searchInputRef = useRef<HTMLInputElement>(null);
  //const tagRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [searchInput, setSearchInput]=useState<boolean | false>(false);
  const [ showHistoryDropdown, setShowHistoryDropdown ] = useState(false);
  
  const { searchHistory, addToSearchHistory } = useSearchHistory();
  const {
    data: results = [],
    isLoading,
    isError,
    refetch,
    error,
  } = useQuery({
    queryKey: ['search', query, selectedTag],
    queryFn: () => searchTechnologies(query, selectedTag ?? undefined),
    enabled: query.trim().length >= 2 && query.length <= 100 && !/[^a-zA-Z0-9\s]/.test(query),
    staleTime: 1000 * 60,
  });

  const debouncedSetQuery = useMemo(
    () =>
      debounce((value: string) => {
        setQuery(value);
      }, 400),
    []
  );

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
    
    if (value.length < 2) {
      setSearchInput(false);
    } else {
      setSearchInput(true);
    }

    debouncedSetQuery(value);
  }, [debouncedSetQuery]);

  const handleTagChange = useCallback((val: string) => {
    const value = val.trim();
    if (value.length > 100 || /[^a-zA-Z0-9\s]/.test(value)) return;
    debouncedSetQuery(value); 
  }, [debouncedSetQuery]);

  const toggleTag = (tag: string) => {
    if (selectedTag === tag) {
      setSelectedTag(null);
      //setTagSet(false);
      setQuery('');
    }
    else {
      setSelectedTag(tag);
      //setTagSet(true);
      setQuery('');
      handleTagChange(tag);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      if (
        query.trim().length >= 2 &&
        query.length <= 100 &&
        !/[^a-zA-Z0-9\s]/.test(query)
      ) {
        addToSearchHistory(query);
        setShowHistoryDropdown(false);
        //searchInputRef.current?.blur();
      }
    }
  };

  const handleHistoryClick = (item: string) => {
    setQuery(item);
    addToSearchHistory(item);
    setShowHistoryDropdown(false);
    //searchInputRef.current?.blur();
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

  const handleSingleDownload = (tech:any)=> {
    const doc = new jsPDF();

    doc.setFontSize(16);
    const lines= `Title: ${tech.title}\n   Description: ${tech.description}\n   Category: ${tech.category} `;
    doc.setFontSize(12);
    doc.text(doc.splitTextToSize(lines, 180), 10, 20);
    doc.save('Result.pdf');
  }


  return (
    <div className="min-h-screen w-full bg-[#EAF0F7] flex items-center justify-center p-6">
      <div className="w-[690px] bg-white rounded-2xl shadow p-6">

        {/* Search */}
        <div
          className={`w-[642px] rounded-xl px-6 py-6 flex items-center gap-3 min-h-[74px] transition-all ${
            isFocused ? 'ring-2 ring-purple-600 bg-white' : 'bg-[#F2F4F8]'
          }`}
        >
          {!selectedTag ? (
            <>
              <MagnifyingGlassIcon className="w-5 h-5 text-gray-500" />
              <input
                //ref={searchInputRef}
                type="text"
                value={query}
                placeholder="Search what technologies we are using at..."
                className="flex-1 bg-transparent outline-none text-gray-800 placeholder-gray-500"
                onFocus={() => { setIsFocused(true); setShowHistoryDropdown(true); }}
                onBlur={() => { setTimeout(() => setShowHistoryDropdown(false), 150); setIsFocused(false); }}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
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

        {/* Tags */}
        <TagSelector
          tags={TAGS}
          selectedTag={selectedTag}
          focusedTagIndex={focusedTagIndex}
          onTagClick={toggleTag}
          onFocus={(i) => setFocusedTagIndex(i)}
          onBlur={() => setFocusedTagIndex(null)}
        />


         {/* Illustration */}
        {selectedTag&&(!query || results.length===0 &&! isLoading || query.trim().length < 2 || /[^a-zA-Z0-9\s]/.test(query)) && (
            <div className="flex justify-center items-center flex justify-center items-center h-[414px] w-[642px]">
            <Image
              src="/searching.svg"
              alt="Searching Illustration"
              width={247}
              height={200}
              className="max-w-full h-auto"
              priority
            />
          </div>
        )}


        {/* Results Section */}
        <div className="mt-6">
          {isLoading ? (
            <div className="flex justify-center items-center flex justify-center items-center h-[406px] w-[642px]">
            <Image
              src="/loading.svg"
              alt="Loading Illustration"
              width={40}
              height={40}
              className="animate-spin"
              priority
            />
          </div>
            
          ) : isError ? (
            <div className="flex justify-center items-center flex justify-center items-center h-[406px] w-[642px]">
            <Image
              src="/errorImage.svg"
              alt="Error Illustration"
              width={247}
              height={200}
              className="max-w-full h-auto"
              priority
            />
          </div>
          ) : results.length==0&&query? (
            <div className="flex justify-center items-center flex justify-center items-center h-[406px] w-[642px]">
            <Image
              src="/errorImage.svg"
              alt="Error Illustration"
              width={247}
              height={200}
              className="max-w-full h-auto"
              priority
            />
          </div>
          )  : selectedTag||query&&(searchInput)? (
            <div className="grid gap-4">
              {/* Results */}
              {resultDisplay(results)}
              <button onClick={handleDownload}>
              <p className="text-purple-600">Download All Results PDF</p>
              </button>
            </div>
          ) : (
            <div className="flex justify-center items-center flex justify-center items-center h-[414px] w-[642px]">
            <Image
              src="/searching.svg"
              alt="Searching Illustration"
              width={247}
              height={200}
              className="max-w-full h-auto"
              priority
            />
          </div>
          )}
        </div>

        {/* Results Section */}
        <div className="mt-6">
          <hr className="border-t border-gray-300 w-full mb-4" />
          <div>
            {isError?  (
              <p className="text-red-400">Something wrong happened but this is not your fault</p>
            ) : (results.length === 0 || results === null) || !selectedTag && !(searchInput) ? (
              <p className="text-gray-400">No Results</p>
            ) : (
              <p className="text-gray-400">{results.length} Results</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}