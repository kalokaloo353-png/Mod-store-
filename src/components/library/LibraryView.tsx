import React from 'react';
import { useModStore } from '../../context/ModStoreContext';
import { CssIcon } from '../common/CssIcon';

export const LibraryView: React.FC = () => {
  const {
    mods,
    installedMods,
    toggleModEnabled,
    uninstallMod,
    setSelectedMod,
    setActiveTab,
    installMod,
  } = useModStore();

  const installedKeys = Object.keys(installedMods);
  const installedItems = installedKeys
    .map((id) => {
      const mod = mods.find((m) => m.id === id);
      const record = installedMods[id];
      return mod ? { mod, record } : null;
    })
    .filter(Boolean) as { mod: any; record: any }[];

  const activeCount = installedItems.filter((i) => i.record.enabled).length;
  const totalSizeBytes = installedItems.reduce((acc, curr) => acc + curr.mod.fileSizeBytes, 0);
  const totalFormattedSize = (totalSizeBytes / (1024 * 1024)).toFixed(1) + ' MB';

  return (
    <div className="space-y-6 py-2">
      {/* Header and stats */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-neutral-900">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white font-['Space_Grotesk']">
            Installed APK Library
          </h1>
          <p className="text-xs text-neutral-400 mt-1">
            Manage your downloaded APKs, active hooks, and package installation states.
          </p>
        </div>

        {/* Stats Strip */}
        <div className="flex items-center gap-2.5">
          <div className="px-3.5 py-1.5 rounded-xl bg-neutral-950 border border-neutral-800 text-center font-mono">
            <span className="text-[10px] uppercase text-neutral-500 block">Downloaded</span>
            <span className="text-xs font-bold text-white">{installedItems.length}</span>
          </div>

          <div className="px-3.5 py-1.5 rounded-xl bg-neutral-950 border border-neutral-800 text-center font-mono">
            <span className="text-[10px] uppercase text-neutral-500 block">Active</span>
            <span className="text-xs font-bold text-emerald-400">{activeCount}</span>
          </div>

          <div className="px-3.5 py-1.5 rounded-xl bg-neutral-950 border border-neutral-800 text-center font-mono">
            <span className="text-[10px] uppercase text-neutral-500 block">Storage</span>
            <span className="text-xs font-bold text-neutral-300">{totalFormattedSize}</span>
          </div>
        </div>
      </div>

      {/* Mod List */}
      {installedItems.length === 0 ? (
        <div className="text-center py-16 border border-dashed border-neutral-800 rounded-2xl bg-neutral-950 space-y-4">
          <div className="mx-auto w-12 h-12 rounded-2xl bg-neutral-900 border border-neutral-800 flex items-center justify-center text-neutral-400">
            <CssIcon name="library" size={20} />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white">No downloaded APKs yet</h3>
            <p className="text-xs text-neutral-400 max-w-sm mx-auto mt-1">
              Browse the store to download verified modded apps, games, and emulators.
            </p>
          </div>
          <button
            onClick={() => setActiveTab('store')}
            className="px-4 py-2 text-xs font-semibold text-black bg-white hover:bg-neutral-200 rounded-lg transition-colors"
          >
            Browse APK Catalog
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {installedItems.map(({ mod, record }) => (
            <div
              key={mod.id}
              className={`p-4 rounded-xl border transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                record.enabled
                  ? 'bg-neutral-950 border-neutral-800 hover:border-neutral-700'
                  : 'bg-neutral-950/50 border-neutral-900 opacity-60'
              }`}
            >
              {/* Mod Info with Thumbnail */}
              <div
                onClick={() => setSelectedMod(mod)}
                className="flex items-center gap-3.5 flex-1 cursor-pointer"
              >
                <div className="h-12 w-12 rounded-xl bg-neutral-900 border border-neutral-800 overflow-hidden shrink-0">
                  <img
                    src={mod.thumbnailUrl}
                    alt={mod.title}
                    className="h-full w-full object-cover"
                  />
                </div>

                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-white hover:underline truncate">
                      {mod.title}
                    </h3>
                    <span className="text-[10px] font-mono text-neutral-500">v{record.version}</span>
                  </div>
                  <p className="text-[11px] text-neutral-400 font-mono truncate">{mod.packageName}</p>
                  <div className="flex items-center gap-3 text-[10px] font-mono text-neutral-500">
                    <span>{mod.fileSizeFormatted}</span>
                    <span>•</span>
                    <span className={record.enabled ? 'text-emerald-400' : 'text-neutral-500'}>
                      {record.enabled ? 'Active Hook' : 'Inactive'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Controls */}
              <div className="flex items-center gap-2.5 shrink-0 text-xs font-mono">
                {/* Re-download APK file */}
                <button
                  onClick={() => installMod(mod)}
                  className="px-3 py-1.5 rounded-lg border border-neutral-800 bg-neutral-900 hover:bg-neutral-850 text-neutral-300 transition-colors flex items-center gap-1.5"
                  title="Download APK file again"
                >
                  <CssIcon name="download" size={12} />
                  <span>Download</span>
                </button>

                {/* Enable / Disable toggle */}
                <button
                  onClick={() => toggleModEnabled(mod.id)}
                  className={`px-3 py-1.5 rounded-lg border transition-all flex items-center gap-1.5 ${
                    record.enabled
                      ? 'bg-emerald-950/40 border-emerald-800/60 text-emerald-300 hover:bg-emerald-900/50'
                      : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-white'
                  }`}
                >
                  <CssIcon name={record.enabled ? 'play' : 'pause'} size={11} color={record.enabled ? '#34d399' : undefined} />
                  <span>{record.enabled ? 'Active' : 'Disabled'}</span>
                </button>

                {/* Details */}
                <button
                  onClick={() => setSelectedMod(mod)}
                  className="px-3 py-1.5 rounded-lg border border-neutral-800 bg-neutral-900 text-neutral-300 hover:bg-neutral-850 hover:text-white transition-colors"
                >
                  Specs
                </button>

                {/* Remove */}
                <button
                  onClick={() => uninstallMod(mod.id)}
                  className="p-1.5 rounded-lg border border-neutral-800 hover:border-red-900/60 hover:bg-red-950/30 text-neutral-400 hover:text-red-400 transition-colors"
                  title="Remove from library"
                >
                  <CssIcon name="trash" size={13} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
