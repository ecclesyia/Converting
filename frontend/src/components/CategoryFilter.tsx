import React from 'react';
import type { ToolCategory } from '../types/tool';

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
  const categories: { id: ToolCategory; label: string }[] = [
    { id: 'all', label: 'All' },
    { id: 'from_pdf', label: 'From PDF' },
    { id: 'to_pdf', label: 'To PDF' },
    { id: 'organize', label: 'Organize' },
    { id: 'security', label: 'Security' },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 my-5">
      <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 scrollbar-none sm:justify-center">
        {categories.map((cat) => {
          const isActive = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap cursor-pointer ${
                isActive
                  ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 shadow-xs'
                  : 'bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 border border-zinc-200/80 dark:border-zinc-800'
              }`}
            >
              <span>{cat.label}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-md ${
                  isActive
                    ? 'bg-white/20 text-white dark:bg-zinc-900/20 dark:text-zinc-900'
                    : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-400 dark:text-zinc-500'
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
