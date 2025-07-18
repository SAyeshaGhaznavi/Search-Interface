'use client';

import { useState, useCallback, useMemo, useRef } from 'react';
import { useQuery, QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { debounce } from 'lodash';
import { TECHNOLOGIES } from './lib/data';
import { searchTechnologies } from './lib/api';
import Image from 'next/image';
import { MagnifyingGlassIcon, TagIcon } from '@heroicons/react/24/solid';

const TAGS = ['Languages', 'Build', 'Design', 'Cloud'];

export default function Home() {
  const [query, setQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [isFocused, setIsFocused] = useState(false);
  const [tagSet, setTagSet] = useState(false);
  const [focusedTagIndex, setFocusedTagIndex] = useState<number | null>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const tagRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [searchInput, setSearchInput]=useState<boolean | false>(false);


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

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value.length > 100 || /[^a-zA-Z0-9\s]/.test(value)) {
      setSearchInput(false);
      return;
    }
    else if(value.length<2)
    {
      setSearchInput(false);
    }
    else if(value.length<100&&value.length>1)
    {
      setSearchInput(true);
    }
    debouncedSetQuery(value);
  }, [debouncedSetQuery]);

  const handleTagChange = useCallback((val: string) => {
    const value = val.trim();
    if (value.length > 100 || /[^a-zA-Z0-9\s]/.test(value)) return;
    //setSelectedTag(value); 
    debouncedSetQuery(value); 
  }, [debouncedSetQuery]);


  const toggleTag = (tag: string) => {
    if (selectedTag === tag) {
      setSelectedTag(null);
      setTagSet(false);
    }
    else {
      setSelectedTag(tag);
      setTagSet(true);
      handleTagChange(tag);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#EAF0F7] flex items-center justify-center p-6">
      <div className="w-full max-w-xl bg-white rounded-2xl shadow p-6">

        {/* Search */}
        <div
          className={`w-full rounded-xl px-6 py-6 flex items-center gap-3 min-h-[74px] transition-all ${
            isFocused ? 'ring-2 ring-purple-600 bg-white' : 'bg-[#F2F4F8]'
          }`}
        >
          {!selectedTag ? (
            <>
              <MagnifyingGlassIcon className="w-5 h-5 text-gray-500" />
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search what technologies we are using at..."
                className="flex-1 bg-transparent outline-none text-gray-800 placeholder-gray-500"
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                onChange={handleInputChange}
                //onKeyDown={handleKeyDown}
              />
            </>
          ) : (
            <div className="flex flex-wrap gap-2">{selectedTag}</div>
          )}
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-3 mt-4">
          {TAGS.map((tag, i) => {
            const isSelected = selectedTag === tag;
            const isFocused = focusedTagIndex === i;
            //setTagSet(!(selectedTag === tag));
            return (
              <button
                key={tag}
                ref={el => { tagRefs.current[i] = el; }}
                onFocus={() => setFocusedTagIndex(i)}
                onBlur={() => setFocusedTagIndex(null)}
                onClick={() => toggleTag(tag)}
                tabIndex={0}
                className={`flex items-center gap-2 px-4 py-1 rounded-full border text-sm font-medium transition outline-none
                  ${isSelected ? 'bg-[#6833FF] text-white' : ''}
                  ${isFocused && !isSelected ? 'bg-violet-500 text-white' : ''}
                  ${!isSelected && !isFocused ? 'bg-white hover:bg-violet-500 text-purple-600 hover:text-white border-purple-300' : ''}
                `}
              >
                <TagIcon className="w-4 h-4" />
                {tag}
              </button>
            );
          })}
        </div>


         {/* Illustration */}
         
        {tagSet&&(!query || results.length===0 &&! isLoading || query.trim().length < 2 || /[^a-zA-Z0-9\s]/.test(query)) && (
          <div className="flex justify-center items-center h-full mt-6">
            <Image
              src="/searching.svg"
              alt="Searching Illustration"
              width={400}
              height={460}
              className="max-w-full h-auto"
              priority
            />
          </div>
        )}


        {/* Results Section */}
        <div className="mt-6">
          {isLoading ? (
            <div className="flex justify-center items-center h-full mt-6">
            <Image
              src="/loading.svg"
              alt="Loading Illustration"
              width={100}
              height={100}
              className="animate-spin"
              priority
            />
          </div>
            
          ) : isError ? (
            <div className="flex justify-center items-center h-full mt-6">
            <Image
              src="/errorImage.svg"
              alt="Error Illustration"
              width={400}
              height={460}
              className="max-w-full h-auto"
              priority
            />
          </div>
          )  : tagSet||query&&(searchInput)? (
            <div className="grid gap-4">
              {results.map((tech:any) => (
                <div key={tech.title} className="p-4 rounded-xl bg-white hover:bg-[#F2F4F8]">
                  <a
                    href={tech.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-4"
                  >
                    <div className="flex items-center gap-4">
                      <img src={tech.image} alt={tech.title} className="w-12 h-12 rounded" />
                      <div>
                        <h3 className="font-semibold">{tech.title}</h3>
                        <p className="text-sm text-gray-500">{tech.description}</p>
                      </div>
                    </div>
                  </a>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex justify-center items-center h-full mt-6">
            <Image
              src="/searching.svg"
              alt="Searching Illustration"
              width={400}
              height={460}
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
            ) : (results.length === 0 || results === null) || !tagSet && !(searchInput) ? (
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
