import { getVerifiedHymnSolfa, VerifiedHymnSolfa } from '../constants/hymnSolfaLibrary';

export { getVerifiedHymnSolfa, VerifiedHymnSolfa };

export interface ParsedMeterInfo {
  meterType: string;   // e.g. "L.M. — Long Meter (8.8.8.8)", "C.M. — Common Meter (8.6.8.6)", etc.
  tuneRef?: string;    // e.g. "Tune: H.C. 2 / C.M.S. 1"
  editionRef?: string; // e.g. "Fogo Olorun Han: FE 19"
}

/**
 * Extracts meter metadata (edition, tune reference, and poetic meter category)
 * from the hymn's meter string without inventing synthetic sol-fa melodies.
 */
export const parseMeterString = (meterStr?: string): ParsedMeterInfo | null => {
  if (!meterStr || !meterStr.trim()) return null;

  const raw = meterStr.trim();

  // Extract FE edition e.g. (FE 19)
  const feMatch = raw.match(/\(FE\s*([0-9]+)\)/i);
  const editionRef = feMatch ? `Fogo Olorun Han: FE ${feMatch[1]}` : undefined;

  // Extract Tune e.g. t. H.C. 552 or t.S. 634
  const tuneMatch = raw.match(/t\.?\s*([A-Za-z0-9\.\s]+)/i);
  const tuneRef = tuneMatch ? `Tune: ${tuneMatch[0].replace(/\(FE.*?\)/i, '').trim()}` : undefined;

  // Detect Meter Type
  const upper = raw.toUpperCase();
  let meterType = 'Metrical Hymn';

  if (upper.includes('L.M.') || upper.includes('LM')) {
    meterType = 'L.M. — Long Meter (8.8.8.8)';
  } else if (upper.includes('D.C.M.') || upper.includes('DCM')) {
    meterType = 'D.C.M. — Double Common Meter (8.6.8.6.D)';
  } else if (upper.includes('C.M.') || upper.includes('CM')) {
    meterType = 'C.M. — Common Meter (8.6.8.6)';
  } else if (upper.includes('D.S.M.') || upper.includes('DSM')) {
    meterType = 'D.S.M. — Double Short Meter (6.6.8.6.D)';
  } else if (upper.includes('S.M.') || upper.includes('SM')) {
    meterType = 'S.M. — Short Meter (6.6.8.6)';
  } else if (upper.includes('8S 7S') || upper.includes('8.7.8.7') || upper.includes('D. 8S7S')) {
    meterType = '8.7.8.7 — Trochaic Meter';
  } else if (upper.includes('10S') || upper.includes('10.10.10.10')) {
    meterType = '10.10.10.10 — Decasyllabic';
  } else if (upper.includes('7S') || upper.includes('7.7.7.7')) {
    meterType = '7s — Sevens (7.7.7.7)';
  } else if (upper.includes('6S') || upper.includes('6.8S') || upper.includes('6S. 8S') || upper.includes('6. 8S')) {
    meterType = '6s & 8s';
  } else if (upper.includes('KI AGBARA') || upper.includes('ALAFIA')) {
    meterType = 'Orin Akúnlẹkọ & Ìtẹ̀ríbá (Yoruba Liturgical Air)';
  }

  return {
    meterType,
    tuneRef,
    editionRef,
  };
};
