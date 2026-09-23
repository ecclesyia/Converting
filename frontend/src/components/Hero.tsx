import React from 'react';
import { Search } from 'lucide-react';

interface HeroProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export const Hero: React.FC<HeroProps> = ({ searchQuery, setSearchQuery }) => {
  return (
    <div className="pt-10 pb-6 text-center px-4 max-w-4xl mx-auto">
      <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-zinc-900 dark:text-white tracking-tight leading-tight">
        Fast, clean document & PDF tools.
      </h1>

      <p className="mt-3 text-sm sm:text-base text-zinc-500 dark:text-zinc-400 max-w-xl mx-auto font-normal leading-relaxed">
        Convert to and from PDF, merge, split, compress, protect, and edit documents directly in your browser.
      </p>

      {/* Clean search bar */}
      <div className="mt-6 max-w-md mx-auto relative">
        <div className="relative flex items-center">
          <Search className="absolute left-3.5 w-4 h-4 text-zinc-400 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search tools (Word, Excel, Merge, Compress, Split)..."
            className="w-full pl-10 pr-16 py-2.5 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-100 transition-all shadow-xs"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 px-2 py-0.5 text-xs font-medium text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 bg-zinc-100 dark:bg-zinc-800 rounded-md cursor-pointer"
            >
              Esc
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
