import React from 'react';
import { motion } from 'motion/react';
import { useModStore } from '../../context/ModStoreContext';
import { HeroSlider } from './HeroSlider';
import { CategoryFilter } from './CategoryFilter';
import { ModCard } from './ModCard';
import { CssIcon } from '../common/CssIcon';

export const StoreView: React.FC = () => {
  const {
    filteredMods,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    setActiveTab,
  } = useModStore();

  const isSearching = searchQuery.trim().length > 0;

  return (
    <div className="space-y-6">
      {/* MAXIMUM SAFETY PROMINENT BANNER */}
      <div className="p-4 sm:p-5 rounded-2xl border border-neutral-800 bg-neutral-950 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-lg">
        <div className="flex items-center gap-3.5">
          <div className="h-10 w-10 rounded-xl bg-emerald-950/80 border border-emerald-800/60 flex items-center justify-center text-emerald-400 shrink-0">
            <CssIcon name="shield" size={20} color="#34d399" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm sm:text-base font-bold text-white font-['Space_Grotesk'] tracking-tight">
                Safe Mod Store
              </h2>
              <span className="px-2 py-0.5 text-[10px] font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-800/50 rounded-full font-semibold">
                Gemini AI Verified
              </span>
            </div>
            <p className="text-xs text-neutral-300 font-mono mt-0.5">
              We will try to make it maximum safe
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 text-[11px] font-mono text-neutral-400">
          <div className="flex items-center gap-1 bg-neutral-900 px-2.5 py-1 rounded-lg border border-neutral-800">
            <CssIcon name="check" size={11} color="#34d399" />
            <span>Zero Malware</span>
          </div>
          <div className="flex items-center gap-1 bg-neutral-900 px-2.5 py-1 rounded-lg border border-neutral-800">
            <CssIcon name="check" size={11} color="#34d399" />
            <span>v2/v3 Cert Audited</span>
          </div>
        </div>
      </div>

      {/* Featured Spotlight Carousel */}
      {!isSearching && selectedCategory === 'All' && <HeroSlider />}

      {/* Category Pills & Sorting Bar */}
      <CategoryFilter />

      {/* Active Search Banner indicator if filtering */}
      {isSearching && (
        <div className="flex items-center justify-between p-3.5 rounded-xl border border-neutral-800 bg-neutral-950 text-xs font-mono">
          <div className="flex items-center gap-2 text-neutral-300">
            <CssIcon name="search" size={13} color="#a3a3a3" />
            <span>
              Search results for <span className="text-white font-semibold">"{searchQuery}"</span>
            </span>
          </div>
          <button
            onClick={() => setSearchQuery('')}
            className="text-neutral-400 hover:text-white underline text-[11px]"
          >
            Clear Search
          </button>
        </div>
      )}

      {/* Mod Cards Grid */}
      {filteredMods.length === 0 ? (
        <div className="text-center py-20 border border-dashed border-neutral-800 rounded-2xl bg-neutral-950 space-y-4 max-w-xl mx-auto">
          <div className="mx-auto w-12 h-12 rounded-2xl bg-neutral-900 border border-neutral-800 flex items-center justify-center text-neutral-400">
            <CssIcon name={isSearching ? 'search' : 'grid'} size={20} />
          </div>

          <div>
            <h3 className="text-base font-bold text-white font-['Space_Grotesk']">
              {isSearching ? 'No mods match your search query' : 'No mods in catalog yet'}
            </h3>
            <p className="text-xs text-neutral-400 max-w-sm mx-auto mt-1 leading-relaxed">
              {isSearching
                ? 'Try adjusting your keywords or category filters.'
                : 'Modstore only hosts genuine user and administrator submitted APK packages verified by Gemini AI.'}
            </p>
          </div>

          <div className="flex items-center justify-center gap-3 pt-2">
            {isSearching ? (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('All');
                }}
                className="px-4 py-2 text-xs font-semibold text-black bg-white hover:bg-neutral-200 rounded-lg transition-colors"
              >
                Reset Search Filters
              </button>
            ) : (
              <>
                <button
                  onClick={() => setActiveTab('upload')}
                  className="px-4 py-2 text-xs font-semibold text-black bg-white hover:bg-neutral-200 rounded-lg transition-colors flex items-center gap-1.5"
                >
                  <CssIcon name="plus" size={12} color="#000" />
                  <span>Submit APK File</span>
                </button>
                <button
                  onClick={() => setActiveTab('admin')}
                  className="px-4 py-2 text-xs font-medium text-neutral-300 hover:text-white bg-neutral-900 hover:bg-neutral-850 border border-neutral-800 rounded-lg transition-colors flex items-center gap-1.5"
                >
                  <CssIcon name="lock" size={12} />
                  <span>Admin Panel</span>
                </button>
              </>
            )}
          </div>
        </div>
      ) : (
        <motion.div
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
        >
          {filteredMods.map((mod) => (
            <ModCard key={mod.id} mod={mod} />
          ))}
        </motion.div>
      )}
    </div>
  );
};
