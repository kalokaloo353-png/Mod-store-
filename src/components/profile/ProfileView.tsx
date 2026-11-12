import React, { useState } from 'react';
import { useAuth } from '../../firebase/authContext';
import { useModStore } from '../../context/ModStoreContext';
import { CssIcon } from '../common/CssIcon';

export const ProfileView: React.FC = () => {
  const { user, userProfile, updateProfileDetails, logOut, setAuthModalOpen } = useAuth();
  const { installedMods, savedModIds, setNotification } = useModStore();

  const [displayName, setDisplayName] = useState(userProfile?.displayName || user?.displayName || '');
  const [bio, setBio] = useState(userProfile?.bio || '');
  const [isSaving, setIsSaving] = useState(false);

  if (!user) {
    return (
      <div className="max-w-md mx-auto py-16 text-center space-y-4">
        <div className="mx-auto w-12 h-12 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center text-neutral-400">
          <CssIcon name="user" size={20} />
        </div>
        <h2 className="text-xl font-bold text-white font-['Space_Grotesk']">
          Sign In to Access Your Mod Profile
        </h2>
        <p className="text-xs text-neutral-400">
          Sync your mod installations, bookmark collections, and publish community mods with your Firebase account.
        </p>
        <button
          onClick={() => setAuthModalOpen(true)}
          className="px-5 py-2.5 text-xs font-semibold text-black bg-white hover:bg-neutral-200 rounded-xl transition-colors"
        >
          Sign In / Create Account
        </button>
      </div>
    );
  }

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!displayName.trim()) return;
    try {
      setIsSaving(true);
      await updateProfileDetails(displayName.trim(), bio.trim());
      setNotification('Profile updated successfully!');
    } catch {
      setNotification('Failed to update profile.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-4 space-y-6">
      {/* Header */}
      <div className="pb-6 border-b border-neutral-900 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white font-['Space_Grotesk']">
            Modder Profile & Settings
          </h1>
          <p className="text-xs sm:text-sm text-neutral-400 mt-1">
            Manage your account credentials, developer badge, and sync settings.
          </p>
        </div>

        <button
          onClick={logOut}
          className="px-3.5 py-1.5 text-xs font-medium rounded-lg border border-neutral-800 hover:border-red-900/60 hover:bg-red-950/30 text-neutral-400 hover:text-red-400 transition-colors flex items-center gap-2 self-start sm:self-auto"
        >
          <CssIcon name="logout" size={13} />
          <span>Sign Out</span>
        </button>
      </div>

      {/* Account Overview Card */}
      <div className="p-6 rounded-2xl border border-neutral-800 bg-neutral-950/80 space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="h-14 w-14 rounded-2xl bg-gradient-to-tr from-neutral-900 to-neutral-800 border border-neutral-700 flex items-center justify-center font-bold text-white text-xl shadow-inner font-mono">
              {(displayName || user.email || 'M').charAt(0).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-white font-mono">{displayName || 'Anonymous Modder'}</h2>
                <span className="px-2 py-0.5 text-[10px] font-mono text-emerald-400 bg-emerald-950/50 border border-emerald-800/40 rounded">
                  {userProfile?.role || 'Verified Modder'}
                </span>
              </div>
              <p className="text-xs text-neutral-400 font-mono mt-0.5">{user.email}</p>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs font-mono">
            <div className="px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-center">
              <span className="text-[10px] text-neutral-500 uppercase block">Installed</span>
              <span className="text-white font-bold">{Object.keys(installedMods).length}</span>
            </div>
            <div className="px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-center">
              <span className="text-[10px] text-neutral-500 uppercase block">Saved</span>
              <span className="text-white font-bold">{savedModIds.size}</span>
            </div>
            <div className="px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-center">
              <span className="text-[10px] text-neutral-500 uppercase block">Reputation</span>
              <span className="text-emerald-400 font-bold">{userProfile?.reputation || 100}</span>
            </div>
          </div>
        </div>

        {/* Profile Details Form */}
        <form onSubmit={handleSaveProfile} className="space-y-4 pt-4 border-t border-neutral-900 text-xs">
          <div className="space-y-1.5">
            <label className="text-neutral-300 font-medium">Display Name</label>
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="w-full h-9 px-3 bg-neutral-900 border border-neutral-800 rounded-lg text-white focus:outline-none focus:border-neutral-600 font-mono"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-neutral-300 font-medium">Modder Bio</label>
            <textarea
              rows={3}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tell other modders about your setup, favorite game engines, or created tools..."
              className="w-full p-3 bg-neutral-900 border border-neutral-800 rounded-lg text-white focus:outline-none focus:border-neutral-600 leading-relaxed"
            />
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={isSaving}
              className="px-5 py-2 font-semibold text-black bg-white hover:bg-neutral-200 rounded-xl transition-all active:scale-95 disabled:opacity-50"
            >
              {isSaving ? 'Saving Changes...' : 'Save Profile'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
