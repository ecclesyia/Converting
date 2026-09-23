import React from 'react';
import type { ToolItem } from '../types/tool';
import { ToolCard } from './ToolCard';
import { FileQuestion } from 'lucide-react';

interface ToolGridProps {
  tools: ToolItem[];
  onSelectTool: (tool: ToolItem) => void;
}

export const ToolGrid: React.FC<ToolGridProps> = ({
  tools,
  onSelectTool
}) => {
  if (tools.length === 0) {
    return (
      <div className="max-w-xs mx-auto my-16 text-center p-8 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
        <div className="w-10 h-10 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-400 flex items-center justify-center mx-auto mb-3">
          <FileQuestion className="w-5 h-5" />
        </div>
        <h3 className="text-sm font-semibold text-zinc-900 dark:text-white">No tools found</h3>
        <p className="text-xs text-zinc-400 mt-1">
          Try searching for Word, Excel, Merge, or Images.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 pb-16">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5">
        {tools.map((tool) => (
          <ToolCard key={tool.id} tool={tool} onSelect={onSelectTool} />
        ))}
      </div>
    </div>
  );
};
