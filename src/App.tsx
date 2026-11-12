import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AuthProvider } from './firebase/authContext';
import { ModStoreProvider, useModStore } from './context/ModStoreContext';
import { Navbar } from './components/layout/Navbar';
import { StoreView } from './components/store/StoreView';
import { LibraryView } from './components/library/LibraryView';
import { SavedModsView } from './components/saved/SavedModsView';
import { SubmitModView } from './components/upload/SubmitModView';
import { ProfileView } from './components/profile/ProfileView';
import { ModDetailDrawer } from './components/store/ModDetailDrawer';
import { AuthModal } from './components/auth/AuthModal';
import { ToastNotification } from './components/common/ToastNotification';

import { AdminPanel } from './components/admin/AdminPanel';

const MainContent: React.FC = () => {
  const { activeTab, setActiveTab } = useModStore();

  const tabVariants = {
    initial: { opacity: 0, y: 12 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.25, ease: 'easeOut' as const } },
    exit: { opacity: 0, y: -12, transition: { duration: 0.15 } },
  };

  return (
    <div className="min-h-screen flex flex-col bg-black text-neutral-100 selection:bg-neutral-800 selection:text-white">
      {/* Sticky Top Navigation */}
      <Navbar />

      {/* Main Container with Smooth Page Transitions */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <AnimatePresence mode="wait">
          {activeTab === 'store' && (
            <motion.div key="store" variants={tabVariants} initial="initial" animate="animate" exit="exit">
              <StoreView />
            </motion.div>
          )}

          {activeTab === 'library' && (
            <motion.div key="library" variants={tabVariants} initial="initial" animate="animate" exit="exit">
              <LibraryView />
            </motion.div>
          )}

          {activeTab === 'saved' && (
            <motion.div key="saved" variants={tabVariants} initial="initial" animate="animate" exit="exit">
              <SavedModsView />
            </motion.div>
          )}

          {activeTab === 'upload' && (
            <motion.div key="upload" variants={tabVariants} initial="initial" animate="animate" exit="exit">
              <SubmitModView />
            </motion.div>
          )}

          {activeTab === 'profile' && (
            <motion.div key="profile" variants={tabVariants} initial="initial" animate="animate" exit="exit">
              <ProfileView />
            </motion.div>
          )}

          {activeTab === 'admin' && (
            <motion.div key="admin" variants={tabVariants} initial="initial" animate="animate" exit="exit">
              <AdminPanel />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Mod Details Slide-In Drawer */}
      <ModDetailDrawer />

      {/* Firebase Authentication Modal */}
      <AuthModal />

      {/* Toast Notification */}
      <ToastNotification />

      {/* Professional Black Obsidian Footer */}
      <footer className="border-t border-neutral-900 bg-black/90 py-10 mt-12 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-neutral-950 border border-neutral-800 p-1 flex items-center justify-center">
              <img
                src="/assets/aistudio/Modstore_Orbital_Bag_Logo_d1ce68d7.png"
                alt="Modstore"
                className="h-full w-full object-contain"
              />
            </div>
            <div>
              <span className="font-bold text-white tracking-tight font-['Space_Grotesk'] text-sm">
                MODSTORE
              </span>
              <p className="text-[11px] text-neutral-500 font-mono">
                Verified repository for modded APK packages, game tools &amp; emulators.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-6 text-neutral-400 font-mono text-[11px]">
            <button onClick={() => setActiveTab('store')} className="hover:text-white transition-colors">
              Catalog
            </button>
            <button onClick={() => setActiveTab('library')} className="hover:text-white transition-colors">
              Local Manager
            </button>
            <button onClick={() => setActiveTab('upload')} className="hover:text-white transition-colors">
              Developer Portal
            </button>
            <span className="text-neutral-700">|</span>
            <span className="text-neutral-500">Firebase Auth &amp; Firestore Engine</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <ModStoreProvider>
        <MainContent />
      </ModStoreProvider>
    </AuthProvider>
  );
}
