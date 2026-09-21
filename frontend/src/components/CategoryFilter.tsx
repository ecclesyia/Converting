import React from 'react';
import type { ToolCategory } from '../types/tool';
import { Grid, ArrowDownToLine, ArrowUpFromLine, SlidersHorizontal, ShieldAlert } from 'lucide-react';

interface CategoryFilterProps {
  activeCategory: ToolCategory;
  setActiveCategory: (cat: ToolCategory) => void;
  counts: Record<ToolCategory, number>;
}

export const CategoryFilter: React.FC<CategoryFilterProps> = ({
  activeCategory,
  setActiveCategory,
  counts
}) => {
  const categories: { id: ToolCategory; label: string; icon: React.ReactNode }[] = [
    { id: 'all', label: 'All Tools', icon: <Grid className="w-4 h-4" /> },
    { id: 'from_pdf', label: 'Convert From PDF', icon: <ArrowUpFromLine className="w-4 h-4" /> },
    { id: 'to_pdf', label: 'Convert To PDF', icon: <ArrowDownToLine className="w-4 h-4" /> },
    { id: 'organize', label: 'Organize & Edit', icon: <SlidersHorizontal className="w-4 h-4" /> },
    { id: 'security', label: 'Security', icon: <ShieldAlert className="w-4 h-4" /> },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-6">
      <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-none sm:justify-center">
        {categories.map((cat) => {
          const isActive = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all whitespace-nowrap cursor-pointer ${
                isActive
                  ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/25 scale-102'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800'
              }`}
            >
              <span>{cat.icon}</span>
              <span>{cat.label}</span>
              <span
                className={`text-xs px-1.5 py-0.5 rounded-full ${
                  isActive
                    ? 'bg-white/20 text-white'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                }`}
              >
                {counts[cat.id]}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
