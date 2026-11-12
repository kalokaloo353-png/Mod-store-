import React from 'react';
import { useModStore } from '../../context/ModStoreContext';
import { ModCard } from '../store/ModCard';
import { CssIcon } from '../common/CssIcon';

export const SavedModsView: React.FC = () => {
  const { mods, savedModIds, setActiveTab } = useModStore();

  const savedList = mods.filter((m) => savedModIds.has(m.id));

  return (
    <div className="space-y-6 py-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-neutral-900">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white font-['Space_Grotesk']">
            Bookmarked Mods
          </h1>
          <p className="text-xs sm:text-sm text-neutral-400 mt-1">
            Your saved wishlist and priority modifications ready for deployment.
          </p>
        </div>

        <span className="text-xs font-mono text-neutral-400 bg-neutral-950 border border-neutral-800 px-3 py-1.5 rounded-lg">
          {savedList.length} saved
        </span>
      </div>

      {/* Grid or Empty */}
      {savedList.length === 0 ? (
        <div className="text-center py-16 border border-dashed border-neutral-800 rounded-2xl bg-neutral-950/40 space-y-4">
          <div className="mx-auto w-12 h-12 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center text-neutral-400">
            <CssIcon name="heart" size={22} color="#f43f5e" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-white">No saved mods yet</h3>
            <p className="text-xs text-neutral-400 max-w-sm mx-auto mt-1">
              Tap the heart bookmark icon on any mod in the store to save it here for quick access across your devices.
            </p>
          </div>
          <button
            onClick={() => setActiveTab('store')}
            className="px-4 py-2 text-xs font-semibold text-black bg-white hover:bg-neutral-200 rounded-lg transition-colors"
          >
            Explore Catalog
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {savedList.map((mod) => (
            <ModCard key={mod.id} mod={mod} />
          ))}
        </div>
      )}
    </div>
  );
};
