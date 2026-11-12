export type ModCategory =
  | 'All'
  | 'Games'
  | 'Apps'
  | 'Tools'
  | 'Emulators'
  | 'Media';

export interface ModReview {
  id: string;
  modId: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: string;
  userBadge?: string;
}

export interface ModChangelogEntry {
  version: string;
  date: string;
  changes: string[];
}

export interface AISafetyAudit {
  safetyScore: number; // 0 - 100
  verdict: 'Verified Safe' | 'Low Risk' | 'Requires Review';
  analysis: string;
  permissionsAudited: string[];
  threatChecks: {
    name: string;
    passed: boolean;
    details: string;
  }[];
  verifiedAt: string;
}

export interface ModItem {
  id: string;
  title: string;
  summary: string;
  description: string;
  category: ModCategory;
  gamePlatform: string; // e.g. "Android 8.0+", "Android 10+", "Universal"
  packageName: string; // e.g. "app.revanced.android.youtube"
  version: string;
  authorName: string;
  authorId: string;
  downloadsCount: number;
  likesCount: number;
  rating: number;
  fileSizeBytes: number;
  fileSizeFormatted: string;
  releaseDate: string;
  lastUpdated: string;
  tags: string[];
  verified: boolean;
  compatibility: string; // e.g. "arm64-v8a, armeabi-v7a"
  modFeatures: string[]; // e.g. ["Ad-Free", "Background Play", "AMOLED Black"]
  apkFileName: string; // e.g. "YouTube_ReVanced_v19.45.38.apk"
  thumbnailUrl: string; // High-res app icon or thumbnail
  videoUrl?: string; // Preview or gameplay video URL (MP4 or embed)
  safetyAudit?: AISafetyAudit; // Gemini AI Safety Verification Report
  changelog: ModChangelogEntry[];
  installCommand?: string;
  isFeatured?: boolean;
  isTrending?: boolean;
}

export interface InstalledModRecord {
  modId: string;
  version: string;
  installedAt: string;
  enabled: boolean;
  localPath: string;
  apkFileName: string;
  autoUpdate: boolean;
}

export interface UserProfile {
  userId: string;
  email: string;
  displayName: string;
  bio?: string;
  role?: string;
  createdAt: string;
  reputation?: number;
}
