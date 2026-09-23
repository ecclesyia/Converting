import React from 'react';
import type { ToolItem } from '../types/tool';

interface FooterProps {
  onSelectTool: (tool: ToolItem) => void;
  tools: ToolItem[];
}

export const Footer: React.FC<FooterProps> = ({ onSelectTool, tools }) => {
  const fromPdf = tools.filter((t) => t.category === 'from_pdf');
  const toPdf = tools.filter((t) => t.category === 'to_pdf');
  const organize = tools.filter((t) => t.category === 'organize' || t.category === 'security');

  return (
    <footer className="bg-white dark:bg-zinc-950 border-t border-zinc-200/80 dark:border-zinc-850 pt-10 pb-8 transition-colors">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pb-8 border-b border-zinc-100 dark:border-zinc-850 text-xs">
          
          {/* Brand info */}
          <div className="col-span-2 md:col-span-1 space-y-2">
            <span className="font-bold text-sm text-zinc-900 dark:text-white">
              OmniPDF
            </span>
            <p className="text-zinc-500 dark:text-zinc-400 leading-relaxed font-normal">
              Private, fast, local document conversion and PDF processing suite.
            </p>
          </div>

          {/* From PDF Links */}
          <div>
            <h4 className="font-semibold text-zinc-900 dark:text-white mb-2.5">
              From PDF
            </h4>
            <ul className="space-y-1.5 text-zinc-500 dark:text-zinc-400">
              {fromPdf.map((t) => (
                <li key={t.id}>
                  <button
                    onClick={() => onSelectTool(t)}
                    className="hover:text-zinc-900 dark:hover:text-zinc-200 transition-colors cursor-pointer"
                  >
                    {t.title}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* To PDF Links */}
          <div>
            <h4 className="font-semibold text-zinc-900 dark:text-white mb-2.5">
              To PDF
            </h4>
            <ul className="space-y-1.5 text-zinc-500 dark:text-zinc-400">
              {toPdf.map((t) => (
                <li key={t.id}>
                  <button
                    onClick={() => onSelectTool(t)}
                    className="hover:text-zinc-900 dark:hover:text-zinc-200 transition-colors cursor-pointer"
                  >
                    {t.title}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* PDF Tools & Security */}
          <div>
            <h4 className="font-semibold text-zinc-900 dark:text-white mb-2.5">
              Tools & Security
            </h4>
            <ul className="space-y-1.5 text-zinc-500 dark:text-zinc-400">
              {organize.map((t) => (
                <li key={t.id}>
                  <button
                    onClick={() => onSelectTool(t)}
                    className="hover:text-zinc-900 dark:hover:text-zinc-200 transition-colors cursor-pointer"
                  >
                    {t.title}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom row */}
        <div className="mt-6 flex items-center justify-between text-[11px] text-zinc-400">
          <p>© {new Date().getFullYear()} OmniPDF Studio. All rights reserved.</p>
          <span>Self-hosted document studio</span>
        </div>
      </div>
    </footer>
  );
};
