import React from 'react';
import { ModItem } from '../../types/mod';
import { useModStore } from '../../context/ModStoreContext';
import { CssIcon } from '../common/CssIcon';

interface ModCardProps {
  mod: ModItem;
}

export const ModCard: React.FC<ModCardProps> = ({ mod }) => {
  const { setSelectedMod, installMod, installedMods, toggleSaveMod, savedModIds } = useModStore();

  const isInstalled = !!installedMods[mod.id];
  const isSaved = savedModIds.has(mod.id);

  return (
    <div
      onClick={() => setSelectedMod(mod)}
      className="group relative flex flex-col justify-between rounded-xl border border-neutral-800/80 bg-neutral-950 p-4 hover:border-neutral-700 hover:bg-neutral-900/50 transition-all cursor-pointer shadow-sm hover:shadow-lg"
    >
      <div>
        {/* Top Header with App Thumbnail Icon */}
        <div className="flex items-start gap-3.5 mb-3">
          <div className="h-14 w-14 rounded-xl bg-neutral-900 border border-neutral-800 overflow-hidden shrink-0 shadow-sm">
            <img
              src={mod.thumbnailUrl}
              alt={mod.title}
              className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-200"
              loading="lazy"
            />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-mono text-emerald-400 font-semibold uppercase tracking-wider">
                  APK • {mod.gamePlatform}
                </span>
                <span className="px-1.5 py-0.2 text-[9px] font-mono text-emerald-400 bg-emerald-950/80 border border-emerald-800/60 rounded">
                  AI Safe
                </span>
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleSaveMod(mod.id);
                }}
                className="p-1 rounded hover:bg-neutral-800 text-neutral-400 hover:text-white transition-colors"
                title={isSaved ? 'Remove bookmark' : 'Bookmark'}
              >
                <CssIcon
                  name={isSaved ? 'heart-filled' : 'heart'}
                  size={14}
                  color={isSaved ? '#f43f5e' : undefined}
                />
              </button>
            </div>

            <h3 className="text-sm font-bold text-white group-hover:text-neutral-100 font-['Space_Grotesk'] leading-tight truncate mt-0.5">
              {mod.title}
            </h3>

            <p className="text-[11px] font-mono text-neutral-400 truncate mt-0.5">
              {mod.packageName}
            </p>
          </div>
        </div>

        {/* Summary */}
        <p className="text-xs text-neutral-400 line-clamp-2 leading-relaxed">
          {mod.summary}
        </p>

        {/* Mod Features tags */}
        <div className="flex flex-wrap gap-1 mt-3">
          {mod.modFeatures.slice(0, 3).map((feat) => (
            <span
              key={feat}
              className="text-[10px] font-mono text-neutral-300 bg-neutral-900 px-2 py-0.5 rounded border border-neutral-800/80"
            >
              ✓ {feat}
            </span>
          ))}
        </div>
      </div>

      {/* Footer Specs & Actions */}
      <div className="pt-3.5 mt-3.5 border-t border-neutral-900 flex items-center justify-between text-xs font-mono">
        <div className="flex items-center gap-3 text-neutral-400">
          <div className="flex items-center gap-1 text-neutral-200">
            <CssIcon name="star-filled" size={12} color="#eab308" />
            <span className="font-semibold text-white">{mod.rating.toFixed(1)}</span>
          </div>
          <span>{mod.fileSizeFormatted}</span>
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            installMod(mod);
          }}
          className={`px-3 py-1.5 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-all active:scale-95 ${
            isInstalled
              ? 'bg-neutral-800 text-emerald-400 border border-neutral-700'
              : 'bg-white text-black hover:bg-neutral-200'
          }`}
        >
          <CssIcon
            name={isInstalled ? 'check' : 'download'}
            size={13}
            color={isInstalled ? '#10b981' : '#000'}
          />
          <span>{isInstalled ? 'Installed' : 'Download APK'}</span>
        </button>
      </div>
    </div>
  );
};
