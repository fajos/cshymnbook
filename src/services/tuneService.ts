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

/**
 * Downloads and caches a hymn tune permanently to local storage (Paths.document/tunes/<instrument>/<fileName>).
 * Subsequent visits will load directly from the local file without touching the network.
 */
export async function downloadAndCacheTune(
  fileName: string,
  instrument: 'organ' | 'piano' = 'organ'
): Promise<string> {
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
  }
}
