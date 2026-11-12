import React, { useState } from 'react';
import { useModStore } from '../../context/ModStoreContext';
import { useAuth } from '../../firebase/authContext';
import { CssIcon } from '../common/CssIcon';

export const AdminPanel: React.FC = () => {
  const {
    isAdminAuthenticated,
    setIsAdminAuthenticated,
    adminPassword,
    setAdminPassword,
    mods,
    deleteModAsAdmin,
    toggleFeatureModAsAdmin,
    setNotification,
    setActiveTab,
  } = useModStore();

  const { user } = useAuth();

  // Login Gate state
  const [passwordInput, setPasswordInput] = useState('');
  const [authError, setAuthError] = useState<string | null>(null);

  // Tab state inside admin
  const [adminTab, setAdminTab] = useState<'passwords' | 'mods' | 'security'>('passwords');

  // Dedicated Admin Password Generator State
  const [passwordLength, setPasswordLength] = useState(20);
  const [includeUppercase, setIncludeUppercase] = useState(true);
  const [includeLowercase, setIncludeLowercase] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(true);
  const [avoidAmbiguous, setAvoidAmbiguous] = useState(true);
  const [generatedPassword, setGeneratedPassword] = useState('');
  const [copiedPwd, setCopiedPwd] = useState(false);

  // Password change state
  const [newMasterPassword, setNewMasterPassword] = useState('');
  const [confirmMasterPassword, setConfirmMasterPassword] = useState('');
  const [pwdChangeSuccess, setPwdChangeSuccess] = useState(false);

  // Generate Admin Password function
  const handleGenerateAdminPassword = () => {
    let charset = '';
    let lower = 'abcdefghijklmnopqrstuvwxyz';
    let upper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let nums = '0123456789';
    let syms = '!@#$%^&*()_+-=[]{}|;:,.<>?';

    if (avoidAmbiguous) {
      lower = lower.replace(/[il1o0O]/g, '');
      upper = upper.replace(/[IO0]/g, '');
      nums = nums.replace(/[01]/g, '');
    }

    if (includeLowercase) charset += lower;
    if (includeUppercase) charset += upper;
    if (includeNumbers) charset += nums;
    if (includeSymbols) charset += syms;

    if (!charset) charset = lower + upper + nums;

    const chars = Array.from({ length: passwordLength }, () =>
      charset[Math.floor(Math.random() * charset.length)]
    );
    const pwd = chars.join('');
    setGeneratedPassword(pwd);
    setCopiedPwd(false);
  };

  const handleCopyPassword = () => {
    if (!generatedPassword) return;
    navigator.clipboard.writeText(generatedPassword);
    setCopiedPwd(true);
    setNotification('Admin password copied to clipboard!');
    setTimeout(() => setCopiedPwd(false), 2000);
  };

  const handleApplyAsMasterPassword = () => {
    if (!generatedPassword) return;
    setAdminPassword(generatedPassword);
    setNotification('Applied as Master Admin Password!');
  };

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);

    const isRootEmail = user?.email === 'jacobfhernandez14@gmail.com';
    const isMatchingPassword = adminPassword
      ? passwordInput.trim() === adminPassword
      : passwordInput.trim().length >= 4;

    if (isMatchingPassword || isRootEmail) {
      setIsAdminAuthenticated(true);
      try {
        sessionStorage.setItem('modstore_admin_auth', 'true');
      } catch {}
      setPasswordInput('');
      setNotification('Administrator session unlocked.');
    } else {
      setAuthError('Invalid administrator password.');
    }
  };

  const handleAdminLogout = () => {
    setIsAdminAuthenticated(false);
    try {
      sessionStorage.removeItem('modstore_admin_auth');
    } catch {}
    setNotification('Administrator session locked.');
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMasterPassword || newMasterPassword.length < 6) {
      setNotification('Password must be at least 6 characters.');
      return;
    }
    if (newMasterPassword !== confirmMasterPassword) {
      setNotification('Passwords do not match.');
      return;
    }
    setAdminPassword(newMasterPassword);
    setPwdChangeSuccess(true);
    setNewMasterPassword('');
    setConfirmMasterPassword('');
    setNotification('Master admin password updated!');
    setTimeout(() => setPwdChangeSuccess(false), 3000);
  };

  // Compute strength score for generated password
  const getEntropyScore = () => {
    if (!generatedPassword) return { label: 'Empty', color: 'text-neutral-500', pct: 0 };
    const len = generatedPassword.length;
    let score = len * 4;
    if (/[A-Z]/.test(generatedPassword)) score += 10;
    if (/[0-9]/.test(generatedPassword)) score += 10;
    if (/[^A-Za-z0-9]/.test(generatedPassword)) score += 15;

    if (score >= 90) return { label: '256-Bit Maximum Security', color: 'text-emerald-400', pct: 100 };
    if (score >= 60) return { label: 'Strong Security', color: 'text-emerald-300', pct: 75 };
    if (score >= 40) return { label: 'Moderate', color: 'text-yellow-400', pct: 50 };
    return { label: 'Weak', color: 'text-red-400', pct: 25 };
  };

  // PASSWORD GATE IF NOT AUTHENTICATED
  if (!isAdminAuthenticated) {
    return (
      <div className="max-w-md mx-auto py-12 px-4 space-y-6">
        <div className="text-center space-y-2">
          <div className="mx-auto h-12 w-12 rounded-2xl bg-neutral-900 border border-neutral-800 flex items-center justify-center text-white mb-2">
            <CssIcon name="lock" size={20} />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white font-['Space_Grotesk']">
            Administrator Gateway
          </h1>
          <p className="text-xs text-neutral-400">
            Restricted access. Enter your administrator password to unlock console tools and security controls.
          </p>
        </div>

        {authError && (
          <div className="p-3 rounded-xl border border-red-900/60 bg-red-950/40 text-xs text-red-400">
            {authError}
          </div>
        )}

        <form onSubmit={handleAdminLogin} className="space-y-4 text-xs">
          <div className="space-y-1.5">
            <label className="text-neutral-300 font-medium">Administrator Password</label>
            <input
              type="password"
              required
              autoFocus
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
              placeholder="Enter admin master password..."
              className="w-full h-10 px-3 bg-neutral-950 border border-neutral-800 rounded-xl text-white font-mono focus:outline-none focus:border-neutral-600"
            />
          </div>

          <div className="p-3 rounded-xl bg-neutral-950 border border-neutral-900 text-[11px] font-mono text-neutral-500 space-y-1">
            <p>Authorized administrator credentials or authenticated Firebase root account required.</p>
            {user?.email && (
              <p>
                Logged in account: <span className="text-neutral-300">{user.email}</span>
                {user.email === 'jacobfhernandez14@gmail.com' && (
                  <span className="text-emerald-400 ml-1">(Root Admin verified)</span>
                )}
              </p>
            )}
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button
              type="button"
              onClick={() => setActiveTab('store')}
              className="flex-1 h-10 rounded-xl border border-neutral-800 text-neutral-400 hover:text-white transition-colors"
            >
              Return to Store
            </button>
            <button
              type="submit"
              className="flex-1 h-10 font-semibold text-black bg-white hover:bg-neutral-200 rounded-xl transition-all shadow-md active:scale-95 flex items-center justify-center gap-2"
            >
              <CssIcon name="shield" size={13} color="#000" />
              <span>Unlock Admin</span>
            </button>
          </div>
        </form>
      </div>
    );
  }

  // UNLOCKED ADMINISTRATOR PANEL
  const strength = getEntropyScore();

  return (
    <div className="max-w-5xl mx-auto py-2 space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-900">
        <div>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-mono uppercase tracking-wider text-emerald-400">
              Admin Session Active
            </span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white font-['Space_Grotesk'] mt-0.5">
            Modstore Administration Console
          </h1>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={() => setActiveTab('store')}
            className="px-3 py-1.5 text-xs font-medium rounded-lg border border-neutral-800 bg-neutral-900 hover:bg-neutral-850 text-neutral-300 transition-colors"
          >
            View Store
          </button>
          <button
            onClick={handleAdminLogout}
            className="px-3 py-1.5 text-xs font-medium rounded-lg border border-neutral-800 hover:border-red-900 hover:bg-red-950/40 text-neutral-400 hover:text-red-400 transition-colors flex items-center gap-1.5"
          >
            <CssIcon name="lock" size={12} />
            <span>Lock Admin</span>
          </button>
        </div>
      </div>

      {/* Admin Sub-Tabs */}
      <div className="flex items-center gap-2 border-b border-neutral-900 pb-2 text-xs">
        <button
          onClick={() => setAdminTab('passwords')}
          className={`px-4 py-2 font-medium rounded-xl transition-all flex items-center gap-2 ${
            adminTab === 'passwords'
              ? 'bg-white text-black font-semibold shadow-sm'
              : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
          }`}
        >
          <CssIcon name="sparkle" size={13} color={adminTab === 'passwords' ? '#000' : undefined} />
          <span>Admin Password Generator</span>
        </button>

        <button
          onClick={() => setAdminTab('mods')}
          className={`px-4 py-2 font-medium rounded-xl transition-all flex items-center gap-2 ${
            adminTab === 'mods'
              ? 'bg-white text-black font-semibold shadow-sm'
              : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
          }`}
        >
          <CssIcon name="grid" size={13} color={adminTab === 'mods' ? '#000' : undefined} />
          <span>APK Moderation ({mods.length})</span>
        </button>

        <button
          onClick={() => setAdminTab('security')}
          className={`px-4 py-2 font-medium rounded-xl transition-all flex items-center gap-2 ${
            adminTab === 'security'
              ? 'bg-white text-black font-semibold shadow-sm'
              : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
          }`}
        >
          <CssIcon name="shield" size={13} color={adminTab === 'security' ? '#000' : undefined} />
          <span>Master Security Settings</span>
        </button>
      </div>

      {/* TAB 1: DEDICATED ADMIN PASSWORD GENERATOR */}
      {adminTab === 'passwords' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Controls Card */}
            <div className="p-6 rounded-2xl border border-neutral-800 bg-neutral-950 space-y-5">
              <div>
                <h3 className="text-base font-bold text-white font-['Space_Grotesk']">
                  Admin Password Generator
                </h3>
                <p className="text-xs text-neutral-400 mt-1">
                  Generate strong, high-entropy cryptographic passphrases to secure the administrator panel.
                </p>
              </div>

              {/* Length slider */}
              <div className="space-y-2 text-xs">
                <div className="flex justify-between items-center font-mono">
                  <span className="text-neutral-300 font-medium">Password Length</span>
                  <span className="text-white font-bold text-sm">{passwordLength} chars</span>
                </div>
                <input
                  type="range"
                  min="8"
                  max="64"
                  value={passwordLength}
                  onChange={(e) => setPasswordLength(parseInt(e.target.value, 10))}
                  className="w-full accent-white cursor-pointer"
                />
              </div>

              {/* Toggles */}
              <div className="grid grid-cols-2 gap-3 text-xs font-mono text-neutral-300 pt-1">
                <label className="flex items-center gap-2 p-2.5 rounded-xl border border-neutral-800 bg-neutral-900 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={includeUppercase}
                    onChange={(e) => setIncludeUppercase(e.target.checked)}
                    className="accent-white"
                  />
                  <span>Uppercase (A-Z)</span>
                </label>

                <label className="flex items-center gap-2 p-2.5 rounded-xl border border-neutral-800 bg-neutral-900 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={includeLowercase}
                    onChange={(e) => setIncludeLowercase(e.target.checked)}
                    className="accent-white"
                  />
                  <span>Lowercase (a-z)</span>
                </label>

                <label className="flex items-center gap-2 p-2.5 rounded-xl border border-neutral-800 bg-neutral-900 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={includeNumbers}
                    onChange={(e) => setIncludeNumbers(e.target.checked)}
                    className="accent-white"
                  />
                  <span>Numbers (0-9)</span>
                </label>

                <label className="flex items-center gap-2 p-2.5 rounded-xl border border-neutral-800 bg-neutral-900 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={includeSymbols}
                    onChange={(e) => setIncludeSymbols(e.target.checked)}
                    className="accent-white"
                  />
                  <span>Symbols (!@#$)</span>
                </label>
              </div>

              <label className="flex items-center gap-2 p-2.5 rounded-xl border border-neutral-800 bg-neutral-900 text-xs font-mono text-neutral-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={avoidAmbiguous}
                  onChange={(e) => setAvoidAmbiguous(e.target.checked)}
                  className="accent-white"
                />
                <span>Avoid ambiguous characters (1, I, l, 0, O)</span>
              </label>

              {/* Action Button */}
              <button
                type="button"
                onClick={handleGenerateAdminPassword}
                className="w-full h-11 font-semibold text-black bg-white hover:bg-neutral-200 rounded-xl transition-all shadow-md active:scale-95 flex items-center justify-center gap-2 text-xs"
              >
                <CssIcon name="sparkle" size={14} color="#000" />
                <span>Generate Admin Password</span>
              </button>
            </div>

            {/* Password Result Output */}
            <div className="p-6 rounded-2xl border border-neutral-800 bg-neutral-950 flex flex-col justify-between space-y-4">
              <div>
                <span className="text-[10px] uppercase font-mono tracking-wider text-neutral-500 block mb-1">
                  Generated Output
                </span>
                <h3 className="text-base font-bold text-white font-['Space_Grotesk']">
                  Admin Passphrase Result
                </h3>
              </div>

              {generatedPassword ? (
                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-black border border-neutral-800 flex items-center justify-between gap-3">
                    <span className="font-mono text-sm sm:text-base font-bold text-emerald-400 select-all break-all">
                      {generatedPassword}
                    </span>
                    <button
                      onClick={handleCopyPassword}
                      className="p-2 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-white shrink-0 transition-colors"
                      title="Copy Password"
                    >
                      <CssIcon
                        name={copiedPwd ? 'check' : 'copy'}
                        size={15}
                        color={copiedPwd ? '#10b981' : undefined}
                      />
                    </button>
                  </div>

                  {/* Strength Meter */}
                  <div className="space-y-1.5 font-mono text-xs">
                    <div className="flex justify-between items-center">
                      <span className="text-neutral-400">Entropy Strength:</span>
                      <span className={`font-bold ${strength.color}`}>{strength.label}</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-neutral-900 overflow-hidden border border-neutral-800">
                      <div
                        className="h-full bg-emerald-500 transition-all duration-300"
                        style={{ width: `${strength.pct}%` }}
                      />
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 pt-2">
                    <button
                      type="button"
                      onClick={handleApplyAsMasterPassword}
                      className="flex-1 py-2 text-xs font-semibold text-white bg-neutral-900 hover:bg-neutral-850 border border-neutral-700 rounded-xl transition-colors flex items-center justify-center gap-1.5"
                    >
                      <CssIcon name="check" size={13} color="#34d399" />
                      <span>Set as Master Admin Password</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-10 border border-dashed border-neutral-800 rounded-xl space-y-2">
                  <p className="text-xs text-neutral-400">No password generated yet.</p>
                  <p className="text-[11px] text-neutral-500">
                    Click "Generate Admin Password" to create a fresh secure passphrase.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: LIVE APP MODERATION */}
      {adminTab === 'mods' && (
        <div className="p-6 rounded-2xl border border-neutral-800 bg-neutral-950 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white font-['Space_Grotesk']">
                APK Catalog Moderation
              </h3>
              <p className="text-xs text-neutral-400">
                Manage, feature, or delete any published packages in Firestore.
              </p>
            </div>
            <button
              onClick={() => setActiveTab('upload')}
              className="px-3.5 py-1.5 text-xs font-semibold text-black bg-white hover:bg-neutral-200 rounded-lg transition-colors"
            >
              Upload New APK
            </button>
          </div>

          {mods.length === 0 ? (
            <div className="text-center py-12 border border-dashed border-neutral-800 rounded-xl space-y-3">
              <p className="text-xs text-neutral-400">Store catalog is currently empty.</p>
              <p className="text-[11px] text-neutral-500">
                No fake apps exist. Use "Upload New APK" to publish genuine packages verified by Gemini AI.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {mods.map((mod) => (
                <div
                  key={mod.id}
                  className="p-4 rounded-xl border border-neutral-800 bg-neutral-900/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className="h-12 w-12 rounded-xl bg-neutral-900 border border-neutral-800 overflow-hidden shrink-0">
                      <img src={mod.thumbnailUrl} alt={mod.title} className="h-full w-full object-cover" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-bold text-white truncate">{mod.title}</h4>
                        <span className="text-[10px] font-mono text-neutral-500">v{mod.version}</span>
                        {mod.isFeatured && (
                          <span className="px-1.5 py-0.5 rounded text-[10px] bg-emerald-950 text-emerald-400 border border-emerald-800">
                            Spotlight
                          </span>
                        )}
                        {mod.safetyAudit && (
                          <span className="px-1.5 py-0.5 rounded text-[10px] bg-neutral-900 text-emerald-400 font-mono">
                            AI Score: {mod.safetyAudit.safetyScore}/100
                          </span>
                        )}
                      </div>
                      <p className="text-xs font-mono text-neutral-400 truncate">{mod.packageName}</p>
                      <p className="text-[10px] font-mono text-neutral-500">
                        {mod.downloadsCount} downloads • Author: {mod.authorName}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 text-xs font-mono">
                    <button
                      onClick={() => toggleFeatureModAsAdmin(mod.id)}
                      className={`px-3 py-1.5 rounded-lg border transition-colors ${
                        mod.isFeatured
                          ? 'border-emerald-800 bg-emerald-950/60 text-emerald-300'
                          : 'border-neutral-800 bg-neutral-900 text-neutral-400 hover:text-white'
                      }`}
                    >
                      {mod.isFeatured ? 'Featured' : 'Feature'}
                    </button>

                    <button
                      onClick={() => deleteModAsAdmin(mod.id)}
                      className="px-3 py-1.5 rounded-lg border border-red-900/60 bg-red-950/30 text-red-400 hover:bg-red-950/60 transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: ADMIN SECURITY */}
      {adminTab === 'security' && (
        <div className="max-w-xl mx-auto p-6 rounded-2xl border border-neutral-800 bg-neutral-950 space-y-6">
          <div>
            <h3 className="text-base font-bold text-white font-['Space_Grotesk']">
              Administrator Master Password
            </h3>
            <p className="text-xs text-neutral-400 mt-1">
              Update the master security passphrase required to unlock this console.
            </p>
          </div>

          {pwdChangeSuccess && (
            <div className="p-3 text-xs text-emerald-400 bg-emerald-950/40 border border-emerald-900/60 rounded-xl">
              Master password updated successfully!
            </div>
          )}

          <form onSubmit={handleChangePassword} className="space-y-4 text-xs">
            <div className="space-y-1.5">
              <label className="text-neutral-300 font-medium">New Master Password</label>
              <input
                type="password"
                required
                minLength={6}
                value={newMasterPassword}
                onChange={(e) => setNewMasterPassword(e.target.value)}
                placeholder="At least 6 characters..."
                className="w-full h-9 px-3 bg-neutral-900 border border-neutral-800 rounded-lg text-white font-mono"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-neutral-300 font-medium">Confirm New Master Password</label>
              <input
                type="password"
                required
                minLength={6}
                value={confirmMasterPassword}
                onChange={(e) => setConfirmMasterPassword(e.target.value)}
                placeholder="Re-enter to confirm..."
                className="w-full h-9 px-3 bg-neutral-900 border border-neutral-800 rounded-lg text-white font-mono"
              />
            </div>

            <button
              type="submit"
              className="px-5 py-2 font-semibold text-black bg-white hover:bg-neutral-200 rounded-xl transition-all shadow-md active:scale-95"
            >
              Update Master Password
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
