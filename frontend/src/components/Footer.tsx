import React from 'react';
import { FileText, Shield, Cpu } from 'lucide-react';
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
    <footer className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 pt-12 pb-8 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-slate-100 dark:border-slate-800">
          {/* Brand info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-lg bg-rose-500 flex items-center justify-center text-white font-bold">
                <FileText className="w-5 h-5" />
              </div>
              <span className="font-black text-lg text-slate-900 dark:text-white">
                Omni<span className="text-rose-500">PDF</span>
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              A privacy-first, 100% self-hosted PDF and document processing engine. Convert, merge, split, compress, and edit documents with total security.
            </p>
            <div className="flex items-center space-x-3 text-xs text-slate-400">
              <div className="flex items-center space-x-1">
                <Shield className="w-3.5 h-3.5 text-emerald-500" />
                <span>Zero Cloud Leak</span>
              </div>
              <div className="flex items-center space-x-1">
                <Cpu className="w-3.5 h-3.5 text-rose-500" />
                <span>Local GPU/CPU</span>
              </div>
            </div>
          </div>

          {/* From PDF Links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white mb-3">
              Convert from PDF
            </h4>
            <ul className="space-y-2 text-xs text-slate-500 dark:text-slate-400">
              {fromPdf.map((t) => (
                <li key={t.id}>
                  <button
                    onClick={() => onSelectTool(t)}
                    className="hover:text-rose-500 dark:hover:text-rose-400 transition-colors cursor-pointer"
                  >
                    {t.title}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* To PDF Links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white mb-3">
              Convert to PDF
            </h4>
            <ul className="space-y-2 text-xs text-slate-500 dark:text-slate-400">
              {toPdf.map((t) => (
                <li key={t.id}>
                  <button
                    onClick={() => onSelectTool(t)}
                    className="hover:text-rose-500 dark:hover:text-rose-400 transition-colors cursor-pointer"
                  >
                    {t.title}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* PDF Tools & Security */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white mb-3">
              Tools & Security
            </h4>
            <ul className="space-y-2 text-xs text-slate-500 dark:text-slate-400">
              {organize.map((t) => (
                <li key={t.id}>
                  <button
                    onClick={() => onSelectTool(t)}
                    className="hover:text-rose-500 dark:hover:text-rose-400 transition-colors cursor-pointer"
                  >
                    {t.title}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom row */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 space-y-4 sm:space-y-0">
          <p>© {new Date().getFullYear()} OmniPDF Studio. All rights reserved.</p>
          <div className="flex items-center space-x-1">
            <span>Crafted for high performance document workflows</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
