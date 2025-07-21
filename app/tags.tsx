'use client';

import { TagIcon } from '@heroicons/react/24/solid';
import React from 'react';

type Props = {
  tags: string[];
  selectedTag: string | null;
  focusedTagIndex: number | null;
  onTagClick: (tag: string) => void;
  onFocus: (index: number) => void;
  onBlur: () => void;
};

export default function TagSelector({
  tags,
  selectedTag,
  focusedTagIndex,
  onTagClick,
  onFocus,
  onBlur,
}: Props) {
  return (
    <div className="flex flex-wrap gap-3 mt-4">
      {tags.map((tag, i) => {
        const isSelected = selectedTag === tag;
        const isFocused = focusedTagIndex === i;

        return (
          <button
            key={tag}
            onFocus={() => onFocus(i)}
            onBlur={onBlur}
            onClick={() => onTagClick(tag)}
            tabIndex={0}
            className={`flex items-center gap-2 px-4 py-1 h-[32px] w-[145px] rounded-full border text-sm font-medium transition outline-none
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
  );
}
