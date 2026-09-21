import React from 'react';
import type { ToolItem } from '../types/tool';
import {
  FileText, Table, Presentation, Image, AlignLeft, Layers,
  Sheet, Images, FileCode, Combine, Scissors, Minimize2,
  RotateCw, Stamp, Lock, Unlock, ArrowRight
} from 'lucide-react';

interface ToolCardProps {
  tool: ToolItem;
  onSelect: (tool: ToolItem) => void;
}

const ICON_MAP: Record<string, React.ReactNode> = {
  FileText: <FileText className="w-7 h-7" />,
  Table: <Table className="w-7 h-7" />,
  Presentation: <Presentation className="w-7 h-7" />,
  Image: <Image className="w-7 h-7" />,
  AlignLeft: <AlignLeft className="w-7 h-7" />,
  Layers: <Layers className="w-7 h-7" />,
  Sheet: <Sheet className="w-7 h-7" />,
  Images: <Images className="w-7 h-7" />,
  FileCode: <FileCode className="w-7 h-7" />,
  Combine: <Combine className="w-7 h-7" />,
  Scissors: <Scissors className="w-7 h-7" />,
  Minimize2: <Minimize2 className="w-7 h-7" />,
  RotateCw: <RotateCw className="w-7 h-7" />,
  Stamp: <Stamp className="w-7 h-7" />,
  Lock: <Lock className="w-7 h-7" />,
  Unlock: <Unlock className="w-7 h-7" />,
};

const COLOR_CLASSES: Record<string, { bg: string; text: string; border: string; glow: string }> = {
  blue: { bg: 'bg-blue-50 dark:bg-blue-950/40', text: 'text-blue-600 dark:text-blue-400', border: 'border-blue-100 dark:border-blue-900/40', glow: 'group-hover:shadow-blue-500/20' },
  green: { bg: 'bg-emerald-50 dark:bg-emerald-950/40', text: 'text-emerald-600 dark:text-emerald-400', border: 'border-emerald-100 dark:border-emerald-900/40', glow: 'group-hover:shadow-emerald-500/20' },
  orange: { bg: 'bg-amber-50 dark:bg-amber-950/40', text: 'text-amber-600 dark:text-amber-400', border: 'border-amber-100 dark:border-amber-900/40', glow: 'group-hover:shadow-amber-500/20' },
  yellow: { bg: 'bg-yellow-50 dark:bg-yellow-950/40', text: 'text-yellow-600 dark:text-yellow-400', border: 'border-yellow-100 dark:border-yellow-900/40', glow: 'group-hover:shadow-yellow-500/20' },
  purple: { bg: 'bg-purple-50 dark:bg-purple-950/40', text: 'text-purple-600 dark:text-purple-400', border: 'border-purple-100 dark:border-purple-900/40', glow: 'group-hover:shadow-purple-500/20' },
  emerald: { bg: 'bg-emerald-50 dark:bg-emerald-950/40', text: 'text-emerald-600 dark:text-emerald-400', border: 'border-emerald-100 dark:border-emerald-900/40', glow: 'group-hover:shadow-emerald-500/20' },
  red: { bg: 'bg-rose-50 dark:bg-rose-950/40', text: 'text-rose-600 dark:text-rose-400', border: 'border-rose-100 dark:border-rose-900/40', glow: 'group-hover:shadow-rose-500/20' },
  indigo: { bg: 'bg-indigo-50 dark:bg-indigo-950/40', text: 'text-indigo-600 dark:text-indigo-400', border: 'border-indigo-100 dark:border-indigo-900/40', glow: 'group-hover:shadow-indigo-500/20' },
  violet: { bg: 'bg-violet-50 dark:bg-violet-950/40', text: 'text-violet-600 dark:text-violet-400', border: 'border-violet-100 dark:border-violet-900/40', glow: 'group-hover:shadow-violet-500/20' },
  teal: { bg: 'bg-teal-50 dark:bg-teal-950/40', text: 'text-teal-600 dark:text-teal-400', border: 'border-teal-100 dark:border-teal-900/40', glow: 'group-hover:shadow-teal-500/20' },
  slate: { bg: 'bg-slate-100 dark:bg-slate-800', text: 'text-slate-700 dark:text-slate-300', border: 'border-slate-200 dark:border-slate-700', glow: 'group-hover:shadow-slate-500/20' },
};

export const ToolCard: React.FC<ToolCardProps> = ({ tool, onSelect }) => {
  const color = COLOR_CLASSES[tool.color] || COLOR_CLASSES.red;
  const icon = ICON_MAP[tool.iconName] || <FileText className="w-7 h-7" />;

  return (
    <div
      onClick={() => onSelect(tool)}
      className={`group relative flex flex-col justify-between p-6 rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800 hover:shadow-xl ${color.glow} hover:-translate-y-1 transition-all duration-200 cursor-pointer overflow-hidden`}
    >
      <div>
        <div className="flex items-start justify-between mb-4">
          <div className={`p-3.5 rounded-xl ${color.bg} ${color.text} border ${color.border} group-hover:scale-105 transition-transform duration-200`}>
            {icon}
          </div>
          {tool.badge && (
            <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider ${color.bg} ${color.text} border ${color.border}`}>
              {tool.badge}
            </span>
          )}
        </div>

        <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-rose-500 dark:group-hover:text-rose-400 transition-colors">
          {tool.title}
        </h3>

        <p className="mt-2 text-xs sm:text-sm text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
          {tool.desc}
        </p>
      </div>

      <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs font-semibold">
        <div className="flex items-center space-x-1.5 text-slate-600 dark:text-slate-400 font-mono text-[11px]">
          <span className="bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">{tool.inputExt.replace(/,/g, ' ')}</span>
          <span>→</span>
          <span className="bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 px-1.5 py-0.5 rounded font-bold">{tool.outputExt}</span>
        </div>

        <div className="flex items-center space-x-1 text-slate-400 group-hover:text-rose-500 transition-colors">
          <span className="text-xs font-bold">Use Tool</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
    </div>
  );
};
