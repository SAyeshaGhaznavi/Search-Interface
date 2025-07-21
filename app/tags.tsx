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
            className={`flex items-center gap-[8px] px-[16px] py-[6px] h-[32px] w-[145px] rounded-full border text-sm font-medium items-center justify-center transition outline-none
              ${isSelected ? 'bg-[#6833FF] text-white' : ''}
              ${isFocused && !isSelected ? 'bg-[#865CFF] text-white' : ''}
              ${!isSelected && !isFocused ? 'bg-[#F2F4F8] hover:bg-violet-500 text-[#865CFF] hover:text-[#F2F4F8] border-[#F2F4F8]' : ''}
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
