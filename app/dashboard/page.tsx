
'use client';
import Image from 'next/image';
import { useState } from 'react';
import { MagnifyingGlassIcon, TagIcon } from '@heroicons/react/24/solid';
import { TECHNOLOGIES } from '../lib/data';
//import { searchTechnologies } from './lib/api';

const TAGS = ['Languages', 'Build', 'Design', 'Cloud'];

export async function searchTechnologies(query: string, category?: string) {  
  await new Promise((resolve) => setTimeout(resolve, 500));

  if (!query || query.trim().length < 2 || query.length > 100) return [];
  if (/[^a-zA-Z0-9\s]/.test(query)) return [];

  let results = TECHNOLOGIES.filter(item =>
    item.title.toLowerCase().includes(query.toLowerCase()) ||
    item.description.toLowerCase().includes(query.toLowerCase())
  );
  if (category) {
    results = results.filter(item => item.category === category);
  }
  return results;
}

export default function Home() {
  const [isFocused, setIsFocused] = useState(false);
  const [selectedTag, setSelectedTag] = useState<string | null>();
  const [resultCount, setresultCount] = useState<number | null>(null);

  const toggleTag = (tag: string) => {
    if (selectedTag === tag) {
      setSelectedTag(null);
    } else {
      setSelectedTag(tag);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#EAF0F7] flex items-center justify-center p-6">
      <div className="w-full max-w-xl bg-white rounded-2xl shadow p-6">
        {/* Search or Tags */}
        <div
          className={`w-full rounded-xl px-4 py-3 flex items-center gap-3 min-h-[74px] transition-all ${
            isFocused ? 'ring-2 ring-purple-600 bg-white' : 'bg-[#F2F4F8]'
          }`}
        >
          {!selectedTag ? (
            <>
              <MagnifyingGlassIcon className="w-5 h-5 text-gray-500" />
              <input
                type="text"
                placeholder="Search what technologies we are using at..."
                className="flex-1 bg-transparent outline-none text-gray-800 placeholder-gray-500"
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
              />
            </>
          ) : (
            <div className="flex flex-wrap gap-2">{selectedTag}</div>
          )}
        </div>

        {/* Filter Tags */}
        <div className="flex flex-wrap gap-3 mt-4">
          {TAGS.map((tag) => {
            const isSelected = selectedTag === tag;
            return (
              <button
                key={tag}
                onClick={() => toggleTag(tag)}
                className={`flex items-center gap-2 px-4 py-1 rounded-full border text-sm font-medium transition ${
                  isSelected
                    ? 'bg-[#6833FF] text-white'
                    : 'bg-white hover:bg-violet-500 text-purple-600 hover:text-white border-purple-300'
                }`}
              >
                <TagIcon className="w-4 h-4" />
                {tag}
              </button>
            );
          })}
        </div>

        {/* Illustration */}
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

        {/* Results Section */}
        <div className="mt-6">
          <hr className="border-t border-gray-300 w-full mb-4" />
          <div>
            {resultCount === 0 || resultCount === null ? (
              <p className="text-gray-400">No Results</p>
            ) : (
              <p className="text-gray-400">{resultCount} Results</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
