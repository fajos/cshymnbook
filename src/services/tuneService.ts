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
 * When Cloudflare R2 is configured, update this to your R2 bucket public URL or custom domain
 * (e.g. 'https://pub-xxxx.r2.dev/audio' or 'https://tunes.yourdomain.com').
 */
export const TUNE_CDN_BASE_URL = 'https://cherubseraph.org/view/assets/audio';

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
