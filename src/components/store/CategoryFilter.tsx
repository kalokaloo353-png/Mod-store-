import React from 'react';
import { useModStore } from '../../context/ModStoreContext';
import { ModCategory } from '../../types/mod';
import { CssIcon } from '../common/CssIcon';

const CATEGORIES: ModCategory[] = [
  'All',
  'Apps',
  'Games',
  'Tools',
  'Emulators',
  'Media',
];

export const CategoryFilter: React.FC = () => {
  const {
    selectedCategory,
    setSelectedCategory,
    sortBy,
    setSortBy,
    filteredMods,
  } = useModStore();

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-3 border-b border-neutral-900 mb-6">
      {/* Category Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
        {CATEGORIES.map((cat) => {
          const isSelected = selectedCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-all shrink-0 cursor-pointer ${
                isSelected
                  ? 'bg-white text-black font-semibold shadow-sm'
                  : 'text-neutral-400 hover:text-white hover:bg-neutral-900 border border-neutral-800/80'
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Sort By Dropdown & Count */}
      <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 text-xs font-mono">
        <span className="text-neutral-500">
          {filteredMods.length} {filteredMods.length === 1 ? 'package' : 'packages'}
        </span>

        <div className="flex items-center gap-2 bg-neutral-950 border border-neutral-800 rounded-lg px-2.5 py-1.5">
          <CssIcon name="sliders" size={13} color="#a3a3a3" />
          <span className="text-neutral-500 hidden md:inline">Sort:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="bg-transparent text-neutral-200 text-xs focus:outline-none cursor-pointer"
          >
            <option value="trending" className="bg-neutral-950 text-neutral-200">
              Trending
            </option>
            <option value="downloads" className="bg-neutral-950 text-neutral-200">
              Most Downloaded
            </option>
            <option value="rating" className="bg-neutral-950 text-neutral-200">
              Top Rated
            </option>
            <option value="newest" className="bg-neutral-950 text-neutral-200">
              Recently Updated
            </option>
          </select>
        </div>
      </div>
    </div>
  );
};
