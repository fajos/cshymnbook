import { Platform, Linking } from 'react-native';

export const APP_VERSION: string = require('../../app.json').expo?.version || '1.0.1';

// Primary endpoint: fast raw GitHub URL (instantly live on git push)
// Fallback endpoint: Cloudflare R2 public bucket URL
const PRIMARY_VERSION_URL =
  'https://raw.githubusercontent.com/fajos/cshymnbook/main/version.json';
const FALLBACK_VERSION_URL =
  'https://pub-b4f0c6d4ce79432b9b0d7d5417700a4b.r2.dev/version.json';

const DEFAULT_STORE_URLS = {
  ios: 'https://apps.apple.com/app/id6829350908',
  android: 'https://play.google.com/store/apps/details?id=com.fajostech.cshymnbook',
};

export interface RemoteVersionConfig {
  minimumVersion: string;
  latestVersion: string;
  title?: string;
  message?: string;
  storeUrls?: {
    ios?: string;
    android?: string;
  };
}

export interface VersionCheckResult {
  checked: boolean;
  isHardUpdateRequired: boolean;
  isSoftUpdateAvailable: boolean;
  currentVersion: string;
  minimumVersion: string;
  latestVersion: string;
  title: string;
  message: string;
  storeUrl: string;
}

/**
 * Compares two semantic version strings (e.g. "1.0.0", "1.0.1", "1.2.0").
 * Returns:
 *   -1 if v1 < v2
 *    0 if v1 === v2
 *    1 if v1 > v2
 */
export function compareVersions(v1: string, v2: string): number {
  const p1 = (v1 || '0').split('.').map((x) => parseInt(x, 10) || 0);
  const p2 = (v2 || '0').split('.').map((x) => parseInt(x, 10) || 0);
  const len = Math.max(p1.length, p2.length);
  for (let i = 0; i < len; i++) {
    const num1 = p1[i] || 0;
    const num2 = p2[i] || 0;
    if (num1 < num2) return -1;
    if (num1 > num2) return 1;
  }
  return 0;
}

export function getStoreUrl(customUrl?: string): string {
  if (customUrl) return customUrl;
  return Platform.OS === 'ios' ? DEFAULT_STORE_URLS.ios : DEFAULT_STORE_URLS.android;
}

export function openStoreUrl(customUrl?: string): void {
  const url = getStoreUrl(customUrl);
  Linking.openURL(url).catch(() => {});
}

async function fetchWithTimeout(url: string, timeoutMs: number = 3000): Promise<Response> {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        Pragma: 'no-cache',
        Expires: '0',
      },
    });
    return response;
  } finally {
    clearTimeout(id);
  }
}

async function fetchRemoteConfig(): Promise<RemoteVersionConfig | null> {
  // Try primary (GitHub Raw) first
  try {
    const res = await fetchWithTimeout(PRIMARY_VERSION_URL, 3000);
    if (res.ok) {
      return (await res.json()) as RemoteVersionConfig;
    }
  } catch {}

  // Fallback to Cloudflare R2
  try {
    const res = await fetchWithTimeout(FALLBACK_VERSION_URL, 3000);
    if (res.ok) {
      return (await res.json()) as RemoteVersionConfig;
    }
  } catch {}

  return null;
}

export const versionService = {
  currentVersion: APP_VERSION,

  /**
   * Checks remote version configuration.
   * If network fails or user is offline during church service, it fails open
   * (returns isHardUpdateRequired: false) so users are never blocked offline.
   */
  async checkVersion(): Promise<VersionCheckResult> {
    const config = await fetchRemoteConfig();
    if (!config) {
      return {
        checked: false,
        isHardUpdateRequired: false,
        isSoftUpdateAvailable: false,
        currentVersion: APP_VERSION,
        minimumVersion: APP_VERSION,
        latestVersion: APP_VERSION,
        title: 'Update Available',
        message: 'A new version of C&S Hymn Book is available.',
        storeUrl: getStoreUrl(),
      };
    }

    const minVer = config.minimumVersion || '1.0.0';
    const latestVer = config.latestVersion || minVer;

    // Hard update: current < minimumVersion
    const isHardUpdateRequired = compareVersions(APP_VERSION, minVer) < 0;

    // Soft update: current < latestVersion (and not already hard update)
    const isSoftUpdateAvailable =
      !isHardUpdateRequired && compareVersions(APP_VERSION, latestVer) < 0;

    const targetStoreUrl =
      Platform.OS === 'ios'
        ? config.storeUrls?.ios || DEFAULT_STORE_URLS.ios
        : config.storeUrls?.android || DEFAULT_STORE_URLS.android;

    return {
      checked: true,
      isHardUpdateRequired,
      isSoftUpdateAvailable,
      currentVersion: APP_VERSION,
      minimumVersion: minVer,
      latestVersion: latestVer,
      title: config.title || 'Update Required',
      message:
        config.message ||
        'A new version of C&S Hymn Book is available. Please update to continue.',
      storeUrl: targetStoreUrl,
    };
  },
};
