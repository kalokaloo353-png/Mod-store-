import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../../firebase/authContext';
import { CssIcon } from '../common/CssIcon';

export const AuthModal: React.FC = () => {
  const {
    isAuthModalOpen,
    setAuthModalOpen,
    authMode,
    setAuthMode,
    signInWithGoogle,
    signInWithEmail,
    signUpWithEmail,
    error,
    clearError,
  } = useAuth();

  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isAuthModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    setIsSubmitting(true);

    try {
      if (authMode === 'signin') {
        await signInWithEmail(email.trim(), password);
      } else {
        await signUpWithEmail(email.trim(), password, displayName.trim() || 'Modder');
      }
    } catch {
      // Handled by auth context error state
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleSignIn = async () => {
    clearError();
    setIsSubmitting(true);
    try {
      await signInWithGoogle();
    } catch {
      // Handled by auth context
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setAuthModalOpen(false)}
          className="fixed inset-0 bg-black/85 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ scale: 0.94, opacity: 0, y: 15 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.94, opacity: 0, y: 15 }}
          transition={{ type: 'spring', damping: 25, stiffness: 350 }}
          className="relative w-full max-w-md bg-neutral-950 border border-neutral-800 rounded-2xl p-6 sm:p-8 shadow-2xl z-10 space-y-6"
        >
          {/* Close button */}
          <button
            onClick={() => setAuthModalOpen(false)}
            className="absolute top-4 right-4 p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-900 transition-colors"
            aria-label="Close modal"
          >
            <CssIcon name="close" size={15} />
          </button>

          {/* Logo & Header */}
          <div className="flex flex-col items-center text-center space-y-2">
            <div className="h-14 w-14 rounded-2xl bg-black border border-neutral-800 p-2 shadow-inner flex items-center justify-center mb-1">
              <img
                src="/assets/aistudio/Modstore_Orbital_Bag_Logo_d1ce68d7.png"
                alt="Modstore Logo"
                className="h-full w-full object-contain"
              />
            </div>
            <h2 className="text-xl font-bold text-white font-['Space_Grotesk'] tracking-tight">
              {authMode === 'signin' ? 'Sign In to Modstore' : 'Create Modstore Account'}
            </h2>
            <p className="text-xs text-neutral-400 max-w-xs">
              {authMode === 'signin'
                ? 'Access your cloud-synced library, reviews, and bookmarked mods.'
                : 'Join the community of developers and power modders.'}
            </p>
          </div>

          {/* Slide Tab Switcher */}
          <div className="relative flex rounded-xl bg-neutral-900/90 p-1 border border-neutral-800">
            <button
              type="button"
              onClick={() => {
                clearError();
                setAuthMode('signin');
              }}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                authMode === 'signin'
                  ? 'bg-neutral-800 text-white shadow-sm'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                clearError();
                setAuthMode('signup');
              }}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                authMode === 'signup'
                  ? 'bg-neutral-800 text-white shadow-sm'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              Create Account
            </button>
          </div>

          {/* Google One-Click Auth Button */}
          <button
            type="button"
            disabled={isSubmitting}
            onClick={handleGoogleSignIn}
            className="w-full h-10 px-4 rounded-xl border border-neutral-800 bg-neutral-900 hover:bg-neutral-850 hover:border-neutral-700 text-white text-xs font-medium flex items-center justify-center gap-2.5 transition-all active:scale-98 disabled:opacity-50"
          >
            {/* Pure CSS Geometric Google G emblem - zero SVG */}
            <span className="font-bold text-xs px-1.5 py-0.5 rounded bg-neutral-800 text-neutral-200 border border-neutral-700">
              G
            </span>
            <span>Continue with Google Account</span>
          </button>

          {/* Divider */}
          <div className="relative flex items-center justify-center">
            <div className="w-full border-t border-neutral-900" />
            <span className="absolute px-3 bg-neutral-950 text-[10px] font-mono uppercase text-neutral-500 tracking-wider">
              Or email credentials
            </span>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-3 text-xs text-red-400 bg-red-950/40 border border-red-900/60 rounded-xl leading-relaxed">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
            {authMode === 'signup' && (
              <div className="space-y-1">
                <label className="text-neutral-300 font-medium">Modder Handle / Name</label>
                <input
                  type="text"
                  required
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="e.g. ApexModder"
                  className="w-full h-9 px-3 bg-neutral-900 border border-neutral-800 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:border-neutral-600 font-mono"
                />
              </div>
            )}

            <div className="space-y-1">
              <label className="text-neutral-300 font-medium">Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="developer@modstore.io"
                className="w-full h-9 px-3 bg-neutral-900 border border-neutral-800 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:border-neutral-600 font-mono"
              />
            </div>

            <div className="space-y-1">
              <label className="text-neutral-300 font-medium">Password</label>
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full h-9 px-3 bg-neutral-900 border border-neutral-800 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:border-neutral-600 font-mono"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-10 mt-2 font-semibold text-black bg-white hover:bg-neutral-200 rounded-xl transition-all shadow-md active:scale-98 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <span>Authorizing with Firebase...</span>
              ) : authMode === 'signin' ? (
                <span>Sign In</span>
              ) : (
                <span>Complete Sign Up</span>
              )}
            </button>
          </form>

          {/* Footer note */}
          <p className="text-[10px] text-center text-neutral-500 font-mono">
            Secured by Google Firebase Authentication &amp; Cloud Firestore
          </p>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
