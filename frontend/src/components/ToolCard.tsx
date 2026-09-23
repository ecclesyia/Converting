import React from 'react';
import type { ToolItem } from '../types/tool';
import {
  FileText, Table, Presentation, Image, AlignLeft, Layers,
  Sheet, Images, FileCode, Combine, Scissors, Minimize2,
  RotateCw, Stamp, Lock, Unlock, ArrowUpRight
} from 'lucide-react';

interface ToolCardProps {
  tool: ToolItem;
  onSelect: (tool: ToolItem) => void;
}

const ICON_MAP: Record<string, React.ReactNode> = {
  FileText: <FileText className="w-5 h-5" />,
  Table: <Table className="w-5 h-5" />,
  Presentation: <Presentation className="w-5 h-5" />,
  Image: <Image className="w-5 h-5" />,
  AlignLeft: <AlignLeft className="w-5 h-5" />,
  Layers: <Layers className="w-5 h-5" />,
  Sheet: <Sheet className="w-5 h-5" />,
  Images: <Images className="w-5 h-5" />,
  FileCode: <FileCode className="w-5 h-5" />,
  Combine: <Combine className="w-5 h-5" />,
  Scissors: <Scissors className="w-5 h-5" />,
  Minimize2: <Minimize2 className="w-5 h-5" />,
  RotateCw: <RotateCw className="w-5 h-5" />,
  Stamp: <Stamp className="w-5 h-5" />,
  Lock: <Lock className="w-5 h-5" />,
  Unlock: <Unlock className="w-5 h-5" />,
};

export const ToolCard: React.FC<ToolCardProps> = ({ tool, onSelect }) => {
  const icon = ICON_MAP[tool.iconName] || <FileText className="w-5 h-5" />;

  return (
    <div
      onClick={() => onSelect(tool)}
      className="group relative flex flex-col justify-between p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 hover:border-zinc-400 dark:hover:border-zinc-600 hover:shadow-sm transition-all duration-150 cursor-pointer select-none"
    >
      <div>
        {/* Top bar: Icon & Format badge */}
        <div className="flex items-center justify-between mb-3.5">
          <div className="w-9 h-9 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 flex items-center justify-center transition-colors group-hover:bg-zinc-900 group-hover:text-white dark:group-hover:bg-white dark:group-hover:text-zinc-900">
            {icon}
          </div>
          <ArrowUpRight className="w-4 h-4 text-zinc-300 dark:text-zinc-600 group-hover:text-zinc-700 dark:group-hover:text-zinc-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
        </div>

        {/* Title */}
        <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 tracking-tight">
          {tool.title}
        </h3>

        {/* Description */}
        <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400 line-clamp-2 leading-relaxed font-normal">
          {tool.desc}
        </p>
      </div>

      {/* Bottom info tag */}
      <div className="mt-4 pt-3 border-t border-zinc-100 dark:border-zinc-800/80 flex items-center justify-between text-[11px] text-zinc-400 dark:text-zinc-500 font-mono">
        <span>{tool.inputExt.replace(/,/g, ' ')}</span>
        <span>→</span>
        <span className="font-semibold text-zinc-700 dark:text-zinc-300">{tool.outputExt}</span>
      </div>
    </div>
  );
};
