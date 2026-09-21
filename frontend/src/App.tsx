import { useState, useEffect, useMemo } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { CategoryFilter } from './components/CategoryFilter';
import { ToolGrid } from './components/ToolGrid';
import { ToolModal } from './components/ToolModal';
import { Footer } from './components/Footer';
import { TOOLS } from './data/toolsData';
import type { ToolItem, ToolCategory } from './types/tool';

export function App() {
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });
  const [activeCategory, setActiveCategory] = useState<ToolCategory>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedTool, setSelectedTool] = useState<ToolItem | null>(null);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const counts = useMemo(() => {
    return {
      all: TOOLS.length,
      from_pdf: TOOLS.filter((t) => t.category === 'from_pdf').length,
      to_pdf: TOOLS.filter((t) => t.category === 'to_pdf').length,
      organize: TOOLS.filter((t) => t.category === 'organize').length,
      security: TOOLS.filter((t) => t.category === 'security').length,
    };
  }, []);

  const filteredTools = useMemo(() => {
    return TOOLS.filter((tool) => {
      const matchesCategory =
        activeCategory === 'all' || tool.category === activeCategory;

      const query = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !query ||
        tool.title.toLowerCase().includes(query) ||
        tool.desc.toLowerCase().includes(query) ||
        tool.inputExt.toLowerCase().includes(query) ||
        tool.outputExt.toLowerCase().includes(query);

      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchQuery]);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 transition-colors">
      <Header
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        activeCategory={activeCategory}
        setActiveCategory={setActiveCategory}
      />

      <main className="flex-1">
        <Hero searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

        <CategoryFilter
          activeCategory={activeCategory}
          setActiveCategory={setActiveCategory}
          counts={counts}
        />

        <ToolGrid
          tools={filteredTools}
          activeCategory={activeCategory}
          searchQuery={searchQuery}
          onSelectTool={(tool) => setSelectedTool(tool)}
        />
      </main>

      <Footer onSelectTool={(tool) => setSelectedTool(tool)} tools={TOOLS} />

      {selectedTool && (
        <ToolModal
          tool={selectedTool}
          onClose={() => setSelectedTool(null)}
        />
      )}
    </div>
  );
}

export default App;
