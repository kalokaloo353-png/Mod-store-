import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useModStore } from '../../context/ModStoreContext';
import { CssIcon } from '../common/CssIcon';

export const HeroSlider: React.FC = () => {
  const { featuredMods, setSelectedMod, installMod, installedMods, toggleSaveMod, savedModIds } = useModStore();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(1);

  const total = featuredMods.length;

  useEffect(() => {
    if (total <= 1) return;
    const interval = setInterval(() => {
      setDirection(1);
      setCurrentIndex((prev) => (prev + 1) % total);
    }, 7000);
    return () => clearInterval(interval);
  }, [total]);

  if (total === 0) return null;

  const currentMod = featuredMods[currentIndex];
  const isInstalled = !!installedMods[currentMod.id];
  const isSaved = savedModIds.has(currentMod.id);

  const handlePrev = () => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + total) % total);
  };

  const handleNext = () => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % total);
  };

  const slideVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 100 : -100,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
      transition: {
        x: { type: 'spring' as const, stiffness: 300, damping: 30 },
        opacity: { duration: 0.25 },
      },
    },
    exit: (dir: number) => ({
      x: dir > 0 ? -100 : 100,
      opacity: 0,
      transition: {
        x: { type: 'spring' as const, stiffness: 300, damping: 30 },
        opacity: { duration: 0.2 },
      },
    }),
  };

  return (
    <div className="relative w-full overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-950 mb-6 shadow-xl">
      {/* Slide Container */}
      <div className="relative min-h-[320px] flex items-center p-6 sm:p-8 lg:p-10">
        <AnimatePresence initial={false} custom={direction} mode="wait">
          <motion.div
            key={currentMod.id}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            className="w-full flex flex-col md:flex-row items-start md:items-center justify-between gap-6 z-10"
          >
            {/* Left Content Area with App Icon */}
            <div className="flex items-start gap-5 max-w-2xl">
              {/* App Thumbnail Icon */}
              <div className="h-20 w-20 sm:h-24 sm:w-24 rounded-2xl bg-neutral-900 border border-neutral-700/80 overflow-hidden shadow-lg shrink-0">
                <img
                  src={currentMod.thumbnailUrl}
                  alt={currentMod.title}
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
              </div>

              {/* App Info */}
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-2 py-0.5 text-[10px] font-mono uppercase tracking-wider text-emerald-400 bg-emerald-950/60 border border-emerald-800/40 rounded">
                    Featured APK
                  </span>
                  <span className="text-xs font-mono text-neutral-400">
                    {currentMod.packageName}
                  </span>
                  <span className="text-xs font-mono text-neutral-500">
                    v{currentMod.version}
                  </span>
                </div>

                <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white font-['Space_Grotesk'] leading-tight">
                  {currentMod.title}
                </h2>

                <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed max-w-xl">
                  {currentMod.summary}
                </p>

                {/* Mod Features Pills */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {currentMod.modFeatures.slice(0, 4).map((f) => (
                    <span
                      key={f}
                      className="px-2.5 py-0.5 text-[11px] font-mono text-neutral-200 bg-neutral-900 border border-neutral-800 rounded-md"
                    >
                      ✓ {f}
                    </span>
                  ))}
                </div>

                {/* Stats row */}
                <div className="flex items-center gap-4 text-xs font-mono text-neutral-400 pt-1">
                  <div className="flex items-center gap-1.5 text-neutral-200">
                    <CssIcon name="star-filled" size={13} color="#eab308" />
                    <span className="font-bold text-white">{currentMod.rating.toFixed(2)}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <CssIcon name="download" size={12} />
                    <span>{(currentMod.downloadsCount / 1000000).toFixed(1)}M downloads</span>
                  </div>
                  <span>•</span>
                  <span>{currentMod.fileSizeFormatted}</span>
                  <span>•</span>
                  <span>{currentMod.gamePlatform}</span>
                </div>

                {/* Actions */}
                <div className="flex flex-wrap items-center gap-3 pt-3">
                  <button
                    onClick={() => installMod(currentMod)}
                    className={`px-5 py-2.5 text-xs sm:text-sm font-semibold rounded-xl flex items-center gap-2 transition-all active:scale-95 shadow-md ${
                      isInstalled
                        ? 'bg-neutral-800 text-emerald-400 border border-neutral-700'
                        : 'bg-white text-black hover:bg-neutral-200'
                    }`}
                  >
                    <CssIcon
                      name={isInstalled ? 'check' : 'download'}
                      size={15}
                      color={isInstalled ? '#10b981' : '#000'}
                    />
                    <span>{isInstalled ? 'Installed APK' : 'Download APK'}</span>
                  </button>


                  <button
                    onClick={() => toggleSaveMod(currentMod.id)}
                    className="p-2.5 rounded-xl border border-neutral-800 bg-neutral-900 hover:bg-neutral-850 text-neutral-300 transition-colors"
                    title={isSaved ? 'Remove Bookmark' : 'Bookmark'}
                  >
                    <CssIcon
                      name={isSaved ? 'heart-filled' : 'heart'}
                      size={15}
                      color={isSaved ? '#f43f5e' : 'currentColor'}
                    />
                  </button>
                </div>
              </div>
            </div>

            {/* Right Media Card (Shows Video Snippet or Package Spec) */}
            {currentMod.videoUrl && (
              <div
                onClick={() => setSelectedMod(currentMod)}
                className="w-full md:w-80 rounded-xl overflow-hidden border border-neutral-800 bg-black cursor-pointer group shrink-0 relative aspect-video"
              >
                <video
                  src={currentMod.videoUrl}
                  muted
                  loop
                  autoPlay
                  playsInline
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center group-hover:bg-black/20 transition-colors">
                  <div className="h-10 w-10 rounded-full bg-black/80 border border-neutral-700 flex items-center justify-center text-white">
                    <CssIcon name="play" size={14} />
                  </div>
                </div>
                <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-black/80 text-[10px] font-mono text-neutral-300 border border-neutral-800">
                  Preview Video
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Slide Navigation Footer */}
      <div className="flex items-center justify-between px-6 py-2.5 border-t border-neutral-900 bg-black/70">
        <div className="flex items-center gap-1.5">
          {featuredMods.map((mod, idx) => (
            <button
              key={mod.id}
              onClick={() => {
                setDirection(idx > currentIndex ? 1 : -1);
                setCurrentIndex(idx);
              }}
              className="py-1 focus:outline-none"
              aria-label={`Slide ${idx + 1}`}
            >
              <div
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  idx === currentIndex
                    ? 'w-7 bg-white'
                    : 'w-2 bg-neutral-700 hover:bg-neutral-500'
                }`}
              />
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePrev}
            className="p-1.5 rounded-lg border border-neutral-800 bg-neutral-900 hover:bg-neutral-850 text-neutral-300 transition-colors"
            aria-label="Previous"
          >
            <CssIcon name="chevron-left" size={13} />
          </button>
          <button
            onClick={handleNext}
            className="p-1.5 rounded-lg border border-neutral-800 bg-neutral-900 hover:bg-neutral-850 text-neutral-300 transition-colors"
            aria-label="Next"
          >
            <CssIcon name="chevron-right" size={13} />
          </button>
        </div>
      </div>
    </div>
  );
};
