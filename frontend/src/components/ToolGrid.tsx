import React from 'react';
import type { ToolItem, ToolCategory } from '../types/tool';
import { ToolCard } from './ToolCard';
import { FileQuestion } from 'lucide-react';

interface ToolGridProps {
  tools: ToolItem[];
  activeCategory?: ToolCategory;
  searchQuery?: string;
  onSelectTool: (tool: ToolItem) => void;
}

export const ToolGrid: React.FC<ToolGridProps> = ({
  tools,
  onSelectTool
}) => {
  if (tools.length === 0) {
    return (
      <div className="max-w-md mx-auto my-16 text-center p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="w-12 h-12 rounded-full bg-rose-50 dark:bg-rose-950/60 text-rose-500 flex items-center justify-center mx-auto mb-3">
          <FileQuestion className="w-6 h-6" />
        </div>
        <h3 className="text-lg font-bold text-slate-900 dark:text-white">No tools match your search</h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Try searching for keywords like &quot;Word&quot;, &quot;Merge&quot;, &quot;Compress&quot;, or &quot;Images&quot;.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
        {tools.map((tool) => (
          <ToolCard key={tool.id} tool={tool} onSelect={onSelectTool} />
        ))}
      </div>
    </div>
  );
};
