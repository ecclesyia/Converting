import React from 'react';
import { FileText, Moon, Sun, ShieldCheck } from 'lucide-react';
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
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-white/90 dark:bg-slate-900/90 border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveCategory('all')}>
          <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-rose-600 via-red-500 to-amber-500 flex items-center justify-center shadow-lg shadow-rose-500/20 text-white font-bold text-xl tracking-tight">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center space-x-1.5">
              <span className="font-extrabold text-xl tracking-tight text-slate-900 dark:text-white">
                Omni<span className="text-rose-500">PDF</span>
              </span>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-rose-100 text-rose-700 dark:bg-rose-950/80 dark:text-rose-300">
                Studio
              </span>
            </div>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium leading-none">
              All-in-One PDF & Doc Suite
            </p>
          </div>
        </div>

        {/* Quick Category Navigation */}
        <nav className="hidden md:flex items-center space-x-1 font-medium text-sm text-slate-600 dark:text-slate-300">
          <button
            onClick={() => setActiveCategory('all')}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              activeCategory === 'all'
                ? 'bg-slate-100 text-rose-600 font-semibold dark:bg-slate-800 dark:text-rose-400'
                : 'hover:bg-slate-100 dark:hover:bg-slate-800/60'
            }`}
          >
            All Tools
          </button>
          <button
            onClick={() => setActiveCategory('from_pdf')}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              activeCategory === 'from_pdf'
                ? 'bg-slate-100 text-rose-600 font-semibold dark:bg-slate-800 dark:text-rose-400'
                : 'hover:bg-slate-100 dark:hover:bg-slate-800/60'
            }`}
          >
            Convert From PDF
          </button>
          <button
            onClick={() => setActiveCategory('to_pdf')}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              activeCategory === 'to_pdf'
                ? 'bg-slate-100 text-rose-600 font-semibold dark:bg-slate-800 dark:text-rose-400'
                : 'hover:bg-slate-100 dark:hover:bg-slate-800/60'
            }`}
          >
            Convert To PDF
          </button>
          <button
            onClick={() => setActiveCategory('organize')}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              activeCategory === 'organize'
                ? 'bg-slate-100 text-rose-600 font-semibold dark:bg-slate-800 dark:text-rose-400'
                : 'hover:bg-slate-100 dark:hover:bg-slate-800/60'
            }`}
          >
            Organize & Edit
          </button>
          <button
            onClick={() => setActiveCategory('security')}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              activeCategory === 'security'
                ? 'bg-slate-100 text-rose-600 font-semibold dark:bg-slate-800 dark:text-rose-400'
                : 'hover:bg-slate-100 dark:hover:bg-slate-800/60'
            }`}
          >
            Security
          </button>
        </nav>

        {/* Right side controls */}
        <div className="flex items-center space-x-3">
          <div className="hidden sm:flex items-center space-x-1.5 text-xs text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/50 px-2.5 py-1 rounded-full font-medium">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>100% Private & Local</span>
          </div>

          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors cursor-pointer"
            aria-label="Toggle dark mode"
          >
            {darkMode ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5" />}
          </button>
        </div>
      </div>
    </header>
  );
};
