import React from 'react';
import { Search, Sparkles, Zap, Shield, FileCheck } from 'lucide-react';

interface HeroProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export const Hero: React.FC<HeroProps> = ({ searchQuery, setSearchQuery }) => {
  return (
    <div className="relative pt-8 pb-6 sm:pt-12 sm:pb-8 text-center px-4 overflow-hidden">
      {/* Background ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 sm:w-[600px] h-64 bg-rose-500/10 dark:bg-rose-500/15 rounded-full blur-3xl pointer-events-none -z-10" />
      
      {/* Floating feature pills */}
      <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-900/60 text-xs font-semibold text-rose-600 dark:text-rose-400 mb-4 shadow-sm">
        <Sparkles className="w-3.5 h-3.5" />
        <span>Every tool you need to work with PDFs in one place</span>
      </div>

      <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-900 dark:text-white tracking-tight leading-tight max-w-4xl mx-auto">
        Convert & Edit PDFs <br className="hidden sm:inline" />
        <span className="bg-gradient-to-r from-rose-600 via-red-500 to-amber-500 bg-clip-text text-transparent">
          Without Limits or Watermarks
        </span>
      </h1>

      <p className="mt-4 text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
        Convert PDF to Word, Excel, PowerPoint, Images, or merge, split, compress, and secure your files with high-fidelity formatting.
      </p>

      {/* Instant Search Bar */}
      <div className="mt-7 max-w-xl mx-auto relative">
        <div className="relative flex items-center">
          <Search className="absolute left-4 w-5 h-5 text-slate-400 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search tools (e.g. Word, Excel, Merge, Compress, Watermark)..."
            className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 shadow-xl shadow-slate-200/50 dark:shadow-none focus:outline-none focus:ring-2 focus:ring-rose-500 dark:focus:ring-rose-400 transition-all text-sm"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 px-2 py-1 text-xs font-semibold text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 bg-slate-100 dark:bg-slate-800 rounded-lg cursor-pointer"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Key highlight badges */}
      <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-xs text-slate-500 dark:text-slate-400 font-medium">
        <div className="flex items-center space-x-1.5">
          <Zap className="w-4 h-4 text-amber-500" />
          <span>Lightning Fast Engine</span>
        </div>
        <div className="flex items-center space-x-1.5">
          <Shield className="w-4 h-4 text-emerald-500" />
          <span>100% Secure & Local</span>
        </div>
        <div className="flex items-center space-x-1.5">
          <FileCheck className="w-4 h-4 text-blue-500" />
          <span>Preserves Fonts & Layouts</span>
        </div>
      </div>
    </div>
  );
};
