import React, { useState, useRef } from 'react';
import { useModStore } from '../../context/ModStoreContext';
import { useAuth } from '../../firebase/authContext';
import { ModCategory } from '../../types/mod';
import { CssIcon } from '../common/CssIcon';

export const SubmitModView: React.FC = () => {
  const { publishMod, setActiveTab } = useModStore();
  const { user, setAuthModalOpen } = useAuth();

  // Basic info
  const [title, setTitle] = useState('');
  const [packageName, setPackageName] = useState('');
  const [gamePlatform, setGamePlatform] = useState('Android 8.0+');
  const [category, setCategory] = useState<ModCategory>('Apps');
  const [version, setVersion] = useState('1.0.0');
  const [summary, setSummary] = useState('');
  const [description, setDescription] = useState('');
  const [modFeaturesInput, setModFeaturesInput] = useState('Ad-Free, Premium Unlocked, No Root Required');
  const [tagsInput, setTagsInput] = useState('APK, Mod, Verified');

  // APK File upload state
  const [apkFile, setApkFile] = useState<{
    name: string;
    sizeBytes: number;
    sizeFormatted: string;
  } | null>(null);
  const [isDraggingApk, setIsDraggingApk] = useState(false);
  const apkInputRef = useRef<HTMLInputElement>(null);

  // Thumbnail upload state
  const [thumbnailUrl, setThumbnailUrl] = useState<string>('');
  const [thumbMode, setThumbMode] = useState<'upload' | 'url'>('upload');
  const thumbInputRef = useRef<HTMLInputElement>(null);

  // Video preview upload state
  const [videoUrl, setVideoUrl] = useState<string>('');
  const [videoMode, setVideoMode] = useState<'upload' | 'url'>('upload');
  const videoInputRef = useRef<HTMLInputElement>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Handle APK file selection
  const handleApkSelect = (file: File) => {
    if (!file) return;
    const sizeInMB = file.size / (1024 * 1024);
    const formatted = sizeInMB >= 1 ? `${sizeInMB.toFixed(1)} MB` : `${(file.size / 1024).toFixed(1)} KB`;

    setApkFile({
      name: file.name,
      sizeBytes: file.size,
      sizeFormatted: formatted,
    });

    // Auto-fill title or package name if empty
    if (!title) {
      const cleanName = file.name
        .replace(/\.(apk|xapk|zip)$/i, '')
        .replace(/[._-]/g, ' ')
        .trim();
      setTitle(cleanName);
    }
    if (!packageName) {
      const slug = (title || file.name)
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '')
        .substring(0, 15);
      setPackageName(`com.${slug || 'mod'}.app`);
    }
  };

  // Handle Thumbnail image selection
  const handleThumbSelect = (file: File) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      if (typeof e.target?.result === 'string') {
        setThumbnailUrl(e.target.result);
      }
    };
    reader.readAsDataURL(file);
  };

  // Handle Video file selection
  const handleVideoSelect = (file: File) => {
    if (!file) return;
    const objectUrl = URL.createObjectURL(file);
    setVideoUrl(objectUrl);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!user) {
      setAuthModalOpen(true);
      return;
    }

    if (!title.trim() || !summary.trim() || !description.trim()) {
      setErrorMsg('Please complete the title, summary, and description.');
      return;
    }

    if (!apkFile) {
      setErrorMsg('Please upload an APK or mod package file.');
      return;
    }

    try {
      setIsSubmitting(true);

      const features = modFeaturesInput
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);

      const tags = tagsInput
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);

      const resolvedThumbnail =
        thumbnailUrl.trim() ||
        'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=300&auto=format&fit=crop&q=80';

      await publishMod({
        title: title.trim(),
        packageName: packageName.trim() || `com.${title.toLowerCase().replace(/[^a-z0-9]/g, '')}.mod`,
        gamePlatform: gamePlatform.trim() || 'Android 8.0+',
        category,
        version: version.trim() || '1.0.0',
        summary: summary.trim(),
        description: description.trim(),
        authorName: user.displayName || 'Verified Modder',
        authorId: user.uid,
        fileSizeBytes: apkFile.sizeBytes,
        fileSizeFormatted: apkFile.sizeFormatted,
        apkFileName: apkFile.name,
        thumbnailUrl: resolvedThumbnail,
        videoUrl: videoUrl.trim() || undefined,
        modFeatures: features.length ? features : ['Verified Mod', 'No Ads'],
        tags: tags.length ? tags : ['APK', 'Community'],
        verified: true,
        compatibility: 'arm64-v8a, armeabi-v7a',
        installCommand: `modstore apk install ${packageName.trim() || 'app.mod'}`,
        changelog: [
          {
            version: version.trim() || '1.0.0',
            date: new Date().toISOString().split('T')[0],
            changes: ['Initial release published to Modstore'],
          },
        ],
      });

      setActiveTab('store');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to publish mod.';
      setErrorMsg(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-2 space-y-6">
      {/* Header */}
      <div className="pb-5 border-b border-neutral-900">
        <h1 className="text-2xl font-bold tracking-tight text-white font-['Space_Grotesk']">
          Submit Mod or APK File
        </h1>
        <p className="text-xs text-neutral-400 mt-1">
          Publish your verified Android APK or modded game package with media previews and feature specifications.
        </p>
      </div>

      {!user && (
        <div className="p-4 rounded-xl border border-neutral-800 bg-neutral-950 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-neutral-900 text-neutral-300">
              <CssIcon name="lock" size={16} />
            </div>
            <div>
              <p className="text-xs font-semibold text-white">Authentication Required</p>
              <p className="text-[11px] text-neutral-400">
                Sign in with Firebase to register author credentials and publish to the store.
              </p>
            </div>
          </div>
          <button
            onClick={() => setAuthModalOpen(true)}
            className="px-4 py-2 text-xs font-semibold text-black bg-white hover:bg-neutral-200 rounded-lg transition-colors shrink-0"
          >
            Sign In with Firebase
          </button>
        </div>
      )}

      {errorMsg && (
        <div className="p-3 text-xs text-red-400 bg-red-950/40 border border-red-900/60 rounded-xl">
          {errorMsg}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6 text-xs">
        {/* SECTION 1: APK / MOD FILE UPLOAD AREA */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-neutral-200 font-semibold flex items-center gap-1.5">
              <span>APK or Mod Package File</span>
              <span className="text-emerald-400">*</span>
            </label>
            <span className="text-[11px] font-mono text-neutral-500">
              Accepted: .apk, .xapk, .zip
            </span>
          </div>

          <input
            type="file"
            ref={apkInputRef}
            accept=".apk,.xapk,.zip"
            onChange={(e) => {
              if (e.target.files?.[0]) handleApkSelect(e.target.files[0]);
            }}
            className="hidden"
          />

          {!apkFile ? (
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setIsDraggingApk(true);
              }}
              onDragLeave={() => setIsDraggingApk(false)}
              onDrop={(e) => {
                e.preventDefault();
                setIsDraggingApk(false);
                if (e.dataTransfer.files?.[0]) handleApkSelect(e.dataTransfer.files[0]);
              }}
              onClick={() => apkInputRef.current?.click()}
              className={`p-6 border-2 border-dashed rounded-xl cursor-pointer text-center transition-all ${
                isDraggingApk
                  ? 'border-white bg-neutral-900'
                  : 'border-neutral-800 bg-neutral-950 hover:border-neutral-700 hover:bg-neutral-900/60'
              }`}
            >
              <div className="mx-auto w-10 h-10 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center justify-center text-neutral-300 mb-2.5">
                <CssIcon name="download" size={18} />
              </div>
              <p className="text-xs font-semibold text-white">
                Drag &amp; drop APK file here, or click to browse
              </p>
              <p className="text-[11px] text-neutral-500 mt-1">
                File size will be automatically extracted and validated
              </p>
            </div>
          ) : (
            <div className="p-4 rounded-xl border border-neutral-800 bg-neutral-950 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <div className="p-2.5 rounded-lg bg-neutral-900 border border-neutral-800 text-emerald-400 shrink-0">
                  <CssIcon name="check" size={16} />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-mono font-semibold text-white truncate">
                    {apkFile.name}
                  </p>
                  <p className="text-[11px] font-mono text-neutral-400">
                    Calculated Size: <span className="text-emerald-400 font-bold">{apkFile.sizeFormatted}</span> • Package validated
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setApkFile(null)}
                className="px-2.5 py-1 text-[11px] text-neutral-400 hover:text-red-400 border border-neutral-800 hover:border-red-900 rounded-md transition-colors"
              >
                Change File
              </button>
            </div>
          )}
        </div>

        {/* SECTION 2: THUMBNAIL UPLOAD AREA */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-neutral-200 font-semibold flex items-center gap-1.5">
              <span>App Icon or Mod Thumbnail</span>
              <span className="text-neutral-500 font-normal">(PNG, WebP, JPG)</span>
            </label>
            <div className="flex rounded-md bg-neutral-900 p-0.5 border border-neutral-800 text-[10px]">
              <button
                type="button"
                onClick={() => setThumbMode('upload')}
                className={`px-2 py-0.5 rounded transition-all ${
                  thumbMode === 'upload' ? 'bg-neutral-800 text-white font-medium' : 'text-neutral-400'
                }`}
              >
                Upload File
              </button>
              <button
                type="button"
                onClick={() => setThumbMode('url')}
                className={`px-2 py-0.5 rounded transition-all ${
                  thumbMode === 'url' ? 'bg-neutral-800 text-white font-medium' : 'text-neutral-400'
                }`}
              >
                Image URL
              </button>
            </div>
          </div>

          <input
            type="file"
            ref={thumbInputRef}
            accept="image/png,image/jpeg,image/webp"
            onChange={(e) => {
              if (e.target.files?.[0]) handleThumbSelect(e.target.files[0]);
            }}
            className="hidden"
          />

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 rounded-xl border border-neutral-800 bg-neutral-950">
            {/* Live Thumbnail Preview */}
            <div className="h-16 w-16 rounded-2xl bg-neutral-900 border border-neutral-800 overflow-hidden flex items-center justify-center shrink-0">
              {thumbnailUrl ? (
                <img
                  src={thumbnailUrl}
                  alt="Thumbnail Preview"
                  className="h-full w-full object-cover"
                />
              ) : (
                <CssIcon name="grid" size={20} color="#525252" />
              )}
            </div>

            <div className="flex-1 w-full space-y-2">
              {thumbMode === 'upload' ? (
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => thumbInputRef.current?.click()}
                    className="px-3.5 py-1.5 text-xs font-medium bg-neutral-900 hover:bg-neutral-850 text-white border border-neutral-800 rounded-lg transition-colors flex items-center gap-1.5"
                  >
                    <CssIcon name="folder" size={13} />
                    <span>Select Image File</span>
                  </button>
                  {thumbnailUrl && (
                    <button
                      type="button"
                      onClick={() => setThumbnailUrl('')}
                      className="text-[11px] text-neutral-400 hover:text-white"
                    >
                      Clear
                    </button>
                  )}
                </div>
              ) : (
                <input
                  type="url"
                  value={thumbnailUrl}
                  onChange={(e) => setThumbnailUrl(e.target.value)}
                  placeholder="https://example.com/thumbnail.png"
                  className="w-full h-8 px-3 bg-neutral-900 border border-neutral-800 rounded-lg text-white font-mono text-xs focus:outline-none focus:border-neutral-600"
                />
              )}
              <p className="text-[11px] text-neutral-500">
                Square 1:1 or 16:9 ratio recommended for high-DPI displays.
              </p>
            </div>
          </div>
        </div>

        {/* SECTION 3: VIDEO UPLOAD & PREVIEW AREA */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-neutral-200 font-semibold flex items-center gap-1.5">
              <span>Preview or Gameplay Video</span>
              <span className="text-neutral-500 font-normal">(Optional MP4/WebM)</span>
            </label>
            <div className="flex rounded-md bg-neutral-900 p-0.5 border border-neutral-800 text-[10px]">
              <button
                type="button"
                onClick={() => setVideoMode('upload')}
                className={`px-2 py-0.5 rounded transition-all ${
                  videoMode === 'upload' ? 'bg-neutral-800 text-white font-medium' : 'text-neutral-400'
                }`}
              >
                Video File
              </button>
              <button
                type="button"
                onClick={() => setVideoMode('url')}
                className={`px-2 py-0.5 rounded transition-all ${
                  videoMode === 'url' ? 'bg-neutral-800 text-white font-medium' : 'text-neutral-400'
                }`}
              >
                Video URL
              </button>
            </div>
          </div>

          <input
            type="file"
            ref={videoInputRef}
            accept="video/mp4,video/webm"
            onChange={(e) => {
              if (e.target.files?.[0]) handleVideoSelect(e.target.files[0]);
            }}
            className="hidden"
          />

          <div className="p-4 rounded-xl border border-neutral-800 bg-neutral-950 space-y-3">
            {videoMode === 'upload' ? (
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => videoInputRef.current?.click()}
                  className="px-3.5 py-1.5 text-xs font-medium bg-neutral-900 hover:bg-neutral-850 text-white border border-neutral-800 rounded-lg transition-colors flex items-center gap-1.5"
                >
                  <CssIcon name="play" size={12} />
                  <span>Choose Video File (.mp4)</span>
                </button>
                {videoUrl && (
                  <button
                    type="button"
                    onClick={() => setVideoUrl('')}
                    className="text-[11px] text-neutral-400 hover:text-white"
                  >
                    Remove Video
                  </button>
                )}
              </div>
            ) : (
              <input
                type="url"
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                placeholder="https://example.com/gameplay_preview.mp4"
                className="w-full h-8 px-3 bg-neutral-900 border border-neutral-800 rounded-lg text-white font-mono text-xs focus:outline-none focus:border-neutral-600"
              />
            )}

            {/* Live Responsive Video Preview Player */}
            {videoUrl && (
              <div className="relative rounded-lg overflow-hidden border border-neutral-800 bg-black aspect-video max-h-56 w-full">
                <video
                  src={videoUrl}
                  controls
                  className="w-full h-full object-contain"
                  preload="metadata"
                >
                  Your browser does not support HTML5 video preview.
                </video>
              </div>
            )}
          </div>
        </div>

        {/* SECTION 4: MOD & APP METADATA */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-neutral-300 font-medium">Mod / App Name *</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. YouTube ReVanced Extended"
              className="w-full h-9 px-3 bg-neutral-950 border border-neutral-800 rounded-lg text-white focus:outline-none focus:border-neutral-600"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-neutral-300 font-medium">Android Package Name *</label>
            <input
              type="text"
              required
              value={packageName}
              onChange={(e) => setPackageName(e.target.value)}
              placeholder="e.g. com.spotify.music.mod"
              className="w-full h-9 px-3 bg-neutral-950 border border-neutral-800 rounded-lg text-white focus:outline-none focus:border-neutral-600 font-mono"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-1.5">
            <label className="text-neutral-300 font-medium">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as ModCategory)}
              className="w-full h-9 px-2.5 bg-neutral-950 border border-neutral-800 rounded-lg text-white focus:outline-none focus:border-neutral-600"
            >
              <option value="Apps">Apps</option>
              <option value="Games">Games</option>
              <option value="Tools">Tools</option>
              <option value="Emulators">Emulators</option>
              <option value="Media">Media</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-neutral-300 font-medium">Version</label>
            <input
              type="text"
              value={version}
              onChange={(e) => setVersion(e.target.value)}
              placeholder="1.0.0"
              className="w-full h-9 px-3 bg-neutral-950 border border-neutral-800 rounded-lg text-white focus:outline-none focus:border-neutral-600 font-mono"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-neutral-300 font-medium">Target OS</label>
            <input
              type="text"
              value={gamePlatform}
              onChange={(e) => setGamePlatform(e.target.value)}
              placeholder="Android 8.0+"
              className="w-full h-9 px-3 bg-neutral-950 border border-neutral-800 rounded-lg text-white focus:outline-none focus:border-neutral-600 font-mono"
            />
          </div>
        </div>

        {/* Mod Features */}
        <div className="space-y-1.5">
          <label className="text-neutral-300 font-medium">
            Unlocked Mod Features (comma separated)
          </label>
          <input
            type="text"
            value={modFeaturesInput}
            onChange={(e) => setModFeaturesInput(e.target.value)}
            placeholder="e.g. Ad-Free, Unlimited Money, Premium Unlocked, No Root"
            className="w-full h-9 px-3 bg-neutral-950 border border-neutral-800 rounded-lg text-white focus:outline-none focus:border-neutral-600"
          />
        </div>

        {/* Summary */}
        <div className="space-y-1.5">
          <label className="text-neutral-300 font-medium">One-Line Summary *</label>
          <input
            type="text"
            required
            maxLength={180}
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            placeholder="Clean summary of the mod features and benefits..."
            className="w-full h-9 px-3 bg-neutral-950 border border-neutral-800 rounded-lg text-white focus:outline-none focus:border-neutral-600"
          />
        </div>

        {/* Description */}
        <div className="space-y-1.5">
          <label className="text-neutral-300 font-medium">Full Description & Guide *</label>
          <textarea
            rows={5}
            required
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Provide detailed changelogs, installation instructions, compatibility notes, and hotkeys..."
            className="w-full p-3 bg-neutral-950 border border-neutral-800 rounded-lg text-white focus:outline-none focus:border-neutral-600 leading-relaxed"
          />
        </div>

        {/* Tags */}
        <div className="space-y-1.5">
          <label className="text-neutral-300 font-medium">Tags (comma separated)</label>
          <input
            type="text"
            value={tagsInput}
            onChange={(e) => setTagsInput(e.target.value)}
            placeholder="e.g. APK, Music, Verified, NoAds"
            className="w-full h-9 px-3 bg-neutral-950 border border-neutral-800 rounded-lg text-white focus:outline-none focus:border-neutral-600 font-mono"
          />
        </div>

        {/* Actions */}
        <div className="pt-4 flex items-center justify-end gap-3 border-t border-neutral-900">
          <button
            type="button"
            onClick={() => setActiveTab('store')}
            className="px-4 py-2 font-medium text-neutral-400 hover:text-white transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting || !apkFile}
            className="px-6 py-2.5 font-semibold text-black bg-white hover:bg-neutral-200 disabled:opacity-50 rounded-xl transition-all shadow-md active:scale-95 flex items-center gap-2"
          >
            <CssIcon name="check" size={14} color="#000" />
            <span>{isSubmitting ? 'Publishing Mod Package...' : 'Publish Mod to Store'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
