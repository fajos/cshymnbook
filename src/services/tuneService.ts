import { Platform } from 'react-native';
import { File, Directory, Paths } from 'expo-file-system';

export interface HymnTuneSubentry {
  tuneOrder: string;
  tuneName: string;
  composer: string;
  fileName: string;
}

export interface HymnTuneInfo {
  hymnId: number;
  hymnNumber: string;
  title: string;
  tuneName: string;
  composer: string;
  arranger?: string;
  allTunes?: HymnTuneSubentry[];
  selectedFileName: string;
}

// Bundled mapping from assets/data/hymnTunes.json (385 C&S hymns)
const hymnTunesData: Record<string, HymnTuneInfo> = require('../../assets/data/hymnTunes.json');

/**
 * Base CDN endpoint for streaming hymn audio.
 * Cloudflare R2 bucket: https://pub-b4f0c6d4ce79432b9b0d7d5417700a4b.r2.dev
 */
export const TUNE_CDN_BASE_URL = 'https://pub-b4f0c6d4ce79432b9b0d7d5417700a4b.r2.dev';

/**
 * Retrieves tune metadata for a given hymn ID if available.
 */
export function getHymnTune(hymnId: number): HymnTuneInfo | null {
  return hymnTunesData[String(hymnId)] || (hymnTunesData as any)[hymnId] || null;
}

/**
 * Generates the streaming audio URL for a given tune file and instrument.
 * Works seamlessly with both Cloudflare R2 (https://<bucket>/organ/<file>.mp3)
 * and the upstream cherubseraph.org fallback (https://.../organ/mp3/<file>.mp3).
 */
export function getAudioStreamUrl(fileName: string, instrument: 'organ' | 'piano' = 'organ'): string {
  const cleanName = fileName.replace(/\.ogg$/i, '.mp3');
  if (TUNE_CDN_BASE_URL.includes('cherubseraph.org')) {
    return `${TUNE_CDN_BASE_URL}/${instrument}/mp3/${cleanName}`;
  }
  return `${TUNE_CDN_BASE_URL}/${instrument}/${cleanName}`;
}

/**
 * Checks whether a tune file is already downloaded and cached locally on the device.
 * Returns the local file:// URI if present, or null if not yet cached.
 */
export function getLocalTuneUri(fileName: string, instrument: 'organ' | 'piano' = 'organ'): string | null {
  if (Platform.OS === 'web') return null;
  try {
    const cleanName = fileName.replace(/\.ogg$/i, '.mp3');
    const localFile = new File(Paths.document, 'tunes', instrument, cleanName);
    if (localFile.exists) {
      return localFile.uri;
    }
  } catch (err) {
    // If filesystem check fails, fallback to streaming
  }
  return null;
}

// In-flight download promises deduplication map to prevent concurrent download collisions
const inFlightDownloads = new Map<string, Promise<string>>();

/**
 * Downloads and caches a hymn tune permanently to local storage (Paths.document/tunes/<instrument>/<fileName>).
 * Subsequent visits will load directly from the local file without touching the network.
 */
export async function downloadAndCacheTune(
  fileName: string,
  instrument: 'organ' | 'piano' = 'organ'
): Promise<string> {
  const cacheKey = `${instrument}_${fileName}`;
  const existing = inFlightDownloads.get(cacheKey);
  if (existing) {
    return existing;
  }

  const downloadTask = (async () => {
    const remoteUrl = getAudioStreamUrl(fileName, instrument);
    if (Platform.OS === 'web') return remoteUrl;

    try {
      const cleanName = fileName.replace(/\.ogg$/i, '.mp3');
      const dir = new Directory(Paths.document, 'tunes', instrument);
      if (!dir.exists) {
        dir.create({ intermediates: true, idempotent: true });
      }
      const localFile = new File(dir, cleanName);
      if (localFile.exists) {
        return localFile.uri;
      }

      await File.downloadFileAsync(remoteUrl, localFile, { idempotent: true });
      return localFile.uri;
    } catch (err) {
      console.warn(`Failed to cache tune ${fileName} locally:`, err);
      return remoteUrl;
    } finally {
      inFlightDownloads.delete(cacheKey);
    }
  })();

  inFlightDownloads.set(cacheKey, downloadTask);
  return downloadTask;
}

export interface TuneDownloadProgress {
  completed: number;
  total: number;
  currentTuneName: string;
  isFinished: boolean;
  errorCount: number;
}

/**
 * Returns all unique tune files across the bundled 385 C&S hymns.
 */
export function getAllUniqueTuneFiles(): { fileName: string; tuneName: string; hymnNumber: string }[] {
  const fileMap = new Map<string, { fileName: string; tuneName: string; hymnNumber: string }>();
  for (const item of Object.values(hymnTunesData)) {
    if (item.selectedFileName) {
      fileMap.set(item.selectedFileName, {
        fileName: item.selectedFileName,
        tuneName: item.tuneName || 'Hymn Tune',
        hymnNumber: item.hymnNumber,
      });
    }
    if (item.allTunes) {
      for (const t of item.allTunes) {
        if (t.fileName && !fileMap.has(t.fileName)) {
          fileMap.set(t.fileName, {
            fileName: t.fileName,
            tuneName: t.tuneName || item.tuneName || 'Hymn Tune',
            hymnNumber: item.hymnNumber,
          });
        }
      }
    }
  }
  return Array.from(fileMap.values());
}

/**
 * Counts how many unique tune files are already downloaded and cached locally.
 */
export function getOfflineTuneCount(instrument: 'organ' | 'piano' = 'organ'): number {
  if (Platform.OS === 'web') return 0;
  const tunes = getAllUniqueTuneFiles();
  let count = 0;
  for (const t of tunes) {
    if (getLocalTuneUri(t.fileName, instrument)) {
      count++;
    }
  }
  return count;
}

/**
 * Bulk downloads all available hymn tunes with real-time progress callbacks.
 */
export async function downloadAllTunes(
  instrument: 'organ' | 'piano' = 'organ',
  onProgress?: (progress: TuneDownloadProgress) => void,
  shouldCancel?: () => boolean
): Promise<void> {
  const tunes = getAllUniqueTuneFiles();
  const total = tunes.length;
  let completed = 0;
  let errorCount = 0;

  for (let i = 0; i < tunes.length; i++) {
    if (shouldCancel && shouldCancel()) {
      break;
    }

    const t = tunes[i];
    onProgress?.({
      completed,
      total,
      currentTuneName: `${t.hymnNumber} (${t.tuneName})`,
      isFinished: false,
      errorCount,
    });

    try {
      await downloadAndCacheTune(t.fileName, instrument);
      completed++;
    } catch {
      errorCount++;
    }
  }

  onProgress?.({
    completed,
    total,
    currentTuneName: 'Done',
    isFinished: true,
    errorCount,
  });
}

/**
 * Clears the offline audio cache for the selected instrument or all instruments.
 */
export async function clearOfflineTunes(instrument?: 'organ' | 'piano'): Promise<void> {
  if (Platform.OS === 'web') return;
  try {
    const targets = instrument ? [instrument] : (['organ', 'piano'] as const);
    for (const inst of targets) {
      const dir = new Directory(Paths.document, 'tunes', inst);
      if (dir.exists) {
        dir.delete();
      }
    }
  } catch (err) {
    console.warn('Failed to clear tunes directory:', err);
  }
}
