import React from 'react';
import { Files, Moon, Sun, ShieldCheck } from 'lucide-react';
import type { ToolCategory } from '../types/tool';

interface HeaderProps {
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
  activeCategory: ToolCategory;
  setActiveCategory: (cat: ToolCategory) => void;
}

export const Header: React.FC<HeaderProps> = ({
  darkMode,
  setDarkMode,
  activeCategory,
  setActiveCategory
}) => {
  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-white/80 dark:bg-zinc-950/80 border-b border-zinc-200/80 dark:border-zinc-850 transition-colors">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-15 flex items-center justify-between">
        
        {/* Brand Logo */}
        <div 
          className="flex items-center space-x-2.5 cursor-pointer group select-none" 
          onClick={() => setActiveCategory('all')}
        >
          <div className="h-8 w-8 rounded-lg bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 flex items-center justify-center font-bold shadow-xs">
            <Files className="w-4 h-4" />
          </div>
          <div className="flex items-baseline space-x-1.5">
            <span className="font-bold text-base tracking-tight text-zinc-900 dark:text-zinc-100">
              OmniPDF
            </span>
            <span className="text-[11px] font-medium text-zinc-400 dark:text-zinc-500">
              studio
            </span>
          </div>
        </div>

        {/* Category Navigation */}
        <nav className="hidden md:flex items-center space-x-1 font-medium text-xs text-zinc-600 dark:text-zinc-400 bg-zinc-100/70 dark:bg-zinc-900/70 p-1 rounded-xl border border-zinc-200/60 dark:border-zinc-800">
          {[
            { id: 'all', label: 'All' },
            { id: 'from_pdf', label: 'From PDF' },
            { id: 'to_pdf', label: 'To PDF' },
            { id: 'organize', label: 'Organize' },
            { id: 'security', label: 'Security' },
          ].map((item) => {
            const isActive = activeCategory === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveCategory(item.id as ToolCategory)}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  isActive
                    ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 shadow-xs font-semibold'
                    : 'hover:text-zinc-900 dark:hover:text-zinc-200'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Right side controls */}
        <div className="flex items-center space-x-2.5">
          <div className="hidden sm:flex items-center space-x-1.5 text-xs text-zinc-500 dark:text-zinc-400 font-medium px-2.5 py-1 rounded-md border border-zinc-200/80 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50">
            <ShieldCheck className="w-3.5 h-3.5 text-zinc-400 dark:text-zinc-500" />
            <span>Local processing</span>
          </div>

          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-lg text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors cursor-pointer"
            aria-label="Toggle dark mode"
          >
            {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </header>
  );
};
