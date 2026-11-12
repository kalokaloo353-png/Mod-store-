import React from 'react';
import { useModStore } from '../../context/ModStoreContext';
import { useAuth } from '../../firebase/authContext';
import { CssIcon } from '../common/CssIcon';

export const Navbar: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    searchQuery,
    setSearchQuery,
    installedMods,
    savedModIds,
  } = useModStore();

  const { user, userProfile, setAuthModalOpen, setAuthMode } = useAuth();

  const installedCount = Object.keys(installedMods).length;
  const savedCount = savedModIds.size;

  return (
    <header className="sticky top-0 z-40 w-full border-b border-neutral-900 bg-black/95 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand & Logo */}
        <div className="flex items-center gap-6">
          <button
            onClick={() => setActiveTab('store')}
            className="flex items-center gap-3 group focus:outline-none"
            aria-label="Modstore Home"
          >
            {/* User-provided Raster Logo PNG — Strictly NO SVG */}
            <div className="relative h-10 w-10 overflow-hidden rounded-lg bg-neutral-950 border border-neutral-800 p-1 flex items-center justify-center transition-transform group-hover:scale-105">
              <img
                src="/assets/aistudio/Modstore_Orbital_Bag_Logo_d1ce68d7.png"
                alt="Modstore Logo"
                className="h-full w-full object-contain"
                loading="eager"
              />
            </div>
            <div className="flex flex-col text-left">
              <span className="text-lg font-bold tracking-tight text-white font-['Space_Grotesk'] leading-none">
                MODSTORE
              </span>
              <span className="text-[10px] tracking-wider uppercase text-neutral-400 font-mono mt-0.5">
                Mod &amp; APK Hub
              </span>
            </div>
          </button>

          {/* Navigation items with sliding active underline */}
          <nav className="hidden md:flex items-center gap-1">
            <button
              onClick={() => setActiveTab('store')}
              className={`relative px-3.5 py-1.5 text-sm font-medium transition-colors rounded-md ${
                activeTab === 'store'
                  ? 'text-white bg-neutral-900/90'
                  : 'text-neutral-400 hover:text-white hover:bg-neutral-950'
              }`}
            >
              <span className="flex items-center gap-2">
                <CssIcon name="grid" size={14} />
                Store Catalog
              </span>
            </button>

            <button
              onClick={() => setActiveTab('library')}
              className={`relative px-3.5 py-1.5 text-sm font-medium transition-colors rounded-md ${
                activeTab === 'library'
                  ? 'text-white bg-neutral-900/90'
                  : 'text-neutral-400 hover:text-white hover:bg-neutral-950'
              }`}
            >
              <span className="flex items-center gap-2">
                <CssIcon name="library" size={14} />
                Library
                {installedCount > 0 && (
                  <span className="inline-flex items-center justify-center h-4 min-w-[16px] px-1 text-[10px] font-bold rounded-full bg-neutral-800 text-neutral-200">
                    {installedCount}
                  </span>
                )}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('saved')}
              className={`relative px-3.5 py-1.5 text-sm font-medium transition-colors rounded-md ${
                activeTab === 'saved'
                  ? 'text-white bg-neutral-900/90'
                  : 'text-neutral-400 hover:text-white hover:bg-neutral-950'
              }`}
            >
              <span className="flex items-center gap-2">
                <CssIcon name="heart-filled" size={13} color="#f43f5e" />
                Bookmarks
                {savedCount > 0 && (
                  <span className="inline-flex items-center justify-center h-4 min-w-[16px] px-1 text-[10px] font-bold rounded-full bg-neutral-800 text-neutral-200">
                    {savedCount}
                  </span>
                )}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('upload')}
              className={`relative px-3.5 py-1.5 text-sm font-medium transition-colors rounded-md ${
                activeTab === 'upload'
                  ? 'text-white bg-neutral-900/90'
                  : 'text-neutral-400 hover:text-white hover:bg-neutral-950'
              }`}
            >
              <span className="flex items-center gap-2">
                <CssIcon name="plus" size={13} />
                Submit Mod
              </span>
            </button>

            <button
              onClick={() => setActiveTab('admin')}
              className={`relative px-3 py-1.5 text-sm font-medium transition-colors rounded-md ${
                activeTab === 'admin'
                  ? 'text-emerald-400 bg-neutral-900/90 border border-neutral-800'
                  : 'text-neutral-400 hover:text-white hover:bg-neutral-950'
              }`}
              title="Administrator Only Console"
            >
              <span className="flex items-center gap-1.5">
                <CssIcon name="lock" size={12} color={activeTab === 'admin' ? '#34d399' : undefined} />
                Admin
              </span>
            </button>
          </nav>
        </div>

        {/* Search bar & Auth controls */}
        <div className="flex items-center gap-3">
          {/* Search Bar */}
          <div className="relative hidden sm:block w-48 md:w-64 lg:w-72">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-neutral-500">
              <CssIcon name="search" size={14} />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search mods, games, tags..."
              className="w-full h-9 pl-9 pr-8 text-xs bg-neutral-950 border border-neutral-800 rounded-lg text-neutral-100 placeholder-neutral-500 focus:outline-none focus:border-neutral-600 focus:ring-1 focus:ring-neutral-600 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-neutral-500 hover:text-white"
                title="Clear search"
              >
                <CssIcon name="close" size={12} />
              </button>
            )}
          </div>

          {/* User Sign In / Profile Button */}
          {user ? (
            <button
              onClick={() => setActiveTab('profile')}
              className={`flex items-center gap-2.5 px-3 py-1.5 rounded-lg border text-xs font-medium transition-all ${
                activeTab === 'profile'
                  ? 'border-neutral-600 bg-neutral-900 text-white'
                  : 'border-neutral-800 bg-neutral-950 text-neutral-300 hover:border-neutral-700 hover:text-white'
              }`}
            >
              <div className="h-6 w-6 rounded-full bg-neutral-800 border border-neutral-700 flex items-center justify-center font-bold text-white text-[10px]">
                {(userProfile?.displayName || user.displayName || user.email || 'M')
                  .charAt(0)
                  .toUpperCase()}
              </div>
              <span className="hidden sm:inline font-mono truncate max-w-[110px]">
                {userProfile?.displayName || user.displayName || 'Modder'}
              </span>
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setAuthMode('signin');
                  setAuthModalOpen(true);
                }}
                className="px-3 py-1.5 text-xs font-medium text-neutral-300 hover:text-white rounded-lg transition-colors"
              >
                Sign In
              </button>
              <button
                onClick={() => {
                  setAuthMode('signup');
                  setAuthModalOpen(true);
                }}
                className="px-3.5 py-1.5 text-xs font-semibold text-black bg-white hover:bg-neutral-200 rounded-lg transition-colors flex items-center gap-1.5 shadow-sm"
              >
                <CssIcon name="user" size={13} color="#000" />
                Sign Up
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Sub-Navigation Bar */}
      <div className="flex md:hidden items-center justify-around border-t border-neutral-900 bg-black/90 px-2 py-2 text-xs">
        <button
          onClick={() => setActiveTab('store')}
          className={`flex flex-col items-center gap-1 py-1 px-2 rounded ${
            activeTab === 'store' ? 'text-white' : 'text-neutral-500'
          }`}
        >
          <CssIcon name="grid" size={15} />
          <span>Store</span>
        </button>
        <button
          onClick={() => setActiveTab('library')}
          className={`flex flex-col items-center gap-1 py-1 px-2 rounded relative ${
            activeTab === 'library' ? 'text-white' : 'text-neutral-500'
          }`}
        >
          <CssIcon name="library" size={15} />
          <span>Library</span>
          {installedCount > 0 && (
            <span className="absolute top-0 right-1 h-2 w-2 rounded-full bg-emerald-500" />
          )}
        </button>
        <button
          onClick={() => setActiveTab('saved')}
          className={`flex flex-col items-center gap-1 py-1 px-2 rounded ${
            activeTab === 'saved' ? 'text-white' : 'text-neutral-500'
          }`}
        >
          <CssIcon name="heart-filled" size={15} color={activeTab === 'saved' ? '#f43f5e' : undefined} />
          <span>Saved</span>
        </button>
        <button
          onClick={() => setActiveTab('upload')}
          className={`flex flex-col items-center gap-1 py-1 px-2 rounded ${
            activeTab === 'upload' ? 'text-white' : 'text-neutral-500'
          }`}
        >
          <CssIcon name="plus" size={15} />
          <span>Submit</span>
        </button>
        <button
          onClick={() => setActiveTab('admin')}
          className={`flex flex-col items-center gap-1 py-1 px-2 rounded ${
            activeTab === 'admin' ? 'text-emerald-400' : 'text-neutral-500'
          }`}
        >
          <CssIcon name="lock" size={15} color={activeTab === 'admin' ? '#34d399' : undefined} />
          <span>Admin</span>
        </button>
      </div>
    </header>
  );
};
