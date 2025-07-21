// 'use client'

// import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
// import { useSearchHistory } from '@/app/lib/hook';

// interface ProjectContextType {
//       query: string|null; 
//       setQuery : (q: string | null) => void;
//       selectedTag : string|null; 
//       setSelectedTag : (t: string|null) => void;
//       isFocused : boolean;
//       setIsFocused : (focus: boolean|false) => void;
//       tagSet: boolean; 
//       setTagSet : (tagState: boolean|false) => void;
//       focusedTagIndex : number;
//       setFocusedTagIndex : (focusIndex: number|0) => void;
//       searchInputRef : (ref: React.FormEvent) => Promise<void>;
//       //tagRefs : (button: React.ButtonHTMLAttributes) => Promise<void>;
//       searchInput : boolean;
//       setSearchInput : boolean;
//       showHistoryDropdown : boolean; 
//       setShowHistoryDropdown : boolean;
//     }
    
//     const ProjectContext = createContext<ProjectContextType | null>(null);
    
//     export const ProjectProvider = ({ children }: { children: ReactNode }) => {
//       //const { searchHistory, addToSearchHistory } = useSearchHistory();
//       const [query, setQuery] = useState<string|null>(null);
//       const [selectedTag, setSelectedTag] = useState<string | null>(null);
//       const [isFocused, setIsFocused] = useState<boolean|false>(false);
//       const [tagSet, setTagSet] = useState<boolean|false>(false);
//       const [focusedTagIndex, setFocusedTagIndex] = useState<number | null>();
//       const searchInputRef = useRef<HTMLInputElement>(null);
//       const tagRefs = useRef<(HTMLButtonElement | null)[]>([]);
//       const [searchInput, setSearchInput]=useState<boolean | false>(false);
//       const { searchHistory, addToSearchHistory } = useSearchHistory();
//       const [showHistoryDropdown, setShowHistoryDropdown] = useState(false);

//     return (
//     <ProjectContext.Provider
//     value={{
//       query,
//       setQuery,
//       selectedTag,
//       setSelectedTag,
//       isFocused,
//       setIsFocused,
//       tagSet,
//       setTagSet,
//       focusedTagIndex,
//       setFocusedTagIndex,
//       searchInputRef,
//       //tagRefs : (button: React.ButtonHTMLAttributes) => Promise<void>;
//       searchInput ,
//       setSearchInput,
//       showHistoryDropdown,
//       setShowHistoryDropdown
//     }}
//     >
//     {children}
//     </ProjectContext.Provider>
//     );
// };

// export const useProject = () => {
//   const context = useContext(ProjectContext);
//   if (!context) throw new Error('useProcet must be used inside <ProjectProvider>');
//   return context;
// };