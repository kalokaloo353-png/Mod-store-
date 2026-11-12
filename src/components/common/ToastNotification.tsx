import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useModStore } from '../../context/ModStoreContext';
import { CssIcon } from './CssIcon';

export const ToastNotification: React.FC = () => {
  const { notification, setNotification } = useModStore();

  return (
    <AnimatePresence>
      {notification && (
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          transition={{ type: 'spring', damping: 20, stiffness: 300 }}
          className="fixed top-5 right-5 z-50 flex items-center gap-3 px-4 py-2.5 rounded-xl bg-neutral-900/95 border border-neutral-700/80 shadow-2xl backdrop-blur-md text-xs font-mono text-white"
        >
          <div className="h-2 w-2 rounded-full bg-emerald-400 shrink-0 animate-pulse" />
          <span>{notification}</span>
          <button
            onClick={() => setNotification(null)}
            className="p-1 rounded hover:bg-neutral-800 text-neutral-400 hover:text-white transition-colors ml-2"
          >
            <CssIcon name="close" size={11} />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
