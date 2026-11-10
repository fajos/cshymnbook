export interface ParsedMeterInfo {
  meterType: string; // e.g. "L.M. (8.8.8.8)", "C.M. (8.6.8.6)", "S.M. (6.6.8.6)", "8.7.8.7.D", etc.
  tuneRef?: string;  // e.g. "H.C. 2 / C.M.S. 1"
  editionRef?: string; // e.g. "FE 19"
  tonicSolFa?: {
    keySuggestion: string; // e.g. "Key F / G"
    timeSignature: string; // e.g. "4/4 (Common Time)"
    scaleSnippet: string;  // Tonic Sol-fa notation melody line
    patternNotes: string;  // Rhythm / phrasing tip
  };
}

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
  let tonicSolFa: ParsedMeterInfo['tonicSolFa'] = undefined;

  if (upper.includes('L.M.') || upper.includes('LM')) {
    meterType = 'L.M. — Long Meter (8.8.8.8)';
    tonicSolFa = {
      keySuggestion: 'Key G / F major',
      timeSignature: '4/4 (Common Time)',
      scaleSnippet: '| d : - | d : t, | l, : s, | d : r | m : - |\n| m : - | m : m | r : d | r : m | r : - |\n| r : - | m : f | s : m | d : r | m : - |\n| d : - | r : d | t, : l, | s, : d | d : - ||',
      patternNotes: '8 syllables per line • Four equal phrases • Standard Church Organ tempo',
    };
  } else if (upper.includes('C.M.') || upper.includes('CM')) {
    meterType = 'C.M. — Common Meter (8.6.8.6)';
    tonicSolFa = {
      keySuggestion: 'Key C / D major',
      timeSignature: '3/4 or 4/4 Time',
      scaleSnippet: '| d : m | s : - : f | m : r | d : - |\n| m : s | l : - : s | f : m | r : - |\n| s : m | d : - : r | m : f | s : - |\n| m : d | r : - : t, | d : - : - ||',
      patternNotes: 'Alternating 8 and 6 syllables • Ballad/Folk Hymn meter',
    };
  } else if (upper.includes('S.M.') || upper.includes('SM')) {
    meterType = 'S.M. — Short Meter (6.6.8.6)';
    tonicSolFa = {
      keySuggestion: 'Key E♭ / F major',
      timeSignature: '4/4 or 3/4 Time',
      scaleSnippet: '| s, : d : r | m : - : - |\n| r : d : t, | d : - : - |\n| m : m : f | s : - : f | m : r |\n| d : r : t, | d : - : - ||',
      patternNotes: 'Short 6-syllable opening lines rising to 8 syllables in line 3',
    };
  } else if (upper.includes('8S 7S') || upper.includes('8.7.8.7') || upper.includes('D. 8S7S')) {
    meterType = '8.7.8.7.D — Trochaic Double Meter';
    tonicSolFa = {
      keySuggestion: 'Key B♭ / C major',
      timeSignature: '4/4 Marching Time',
      scaleSnippet: '| s : m | f : r | d : m | s : - |\n| f : r | d : t, | d : - : - |\n| s : s | l : s | f : m | r : - |\n| s : m | f : r | d : t, | d : - ||',
      patternNotes: 'Lilting 8.7 trochaic rhythm • Ideal for revival & joyful songs',
    };
  } else if (upper.includes('10S') || upper.includes('10.10.10.10')) {
    meterType = '10.10.10.10 — Decasyllabic (Eventide / Slane)';
    tonicSolFa = {
      keySuggestion: 'Key E♭ major',
      timeSignature: '4/4 Choral Time',
      scaleSnippet: '| m : - | m : r | d : - | s, : - |\n| l, : d | t, : l, | s, : - : - |\n| m : - | f : m | r : - | d : - |\n| r : m | f : r | d : - : - ||',
      patternNotes: 'Reverent, stately cadence • Traditional for Evening & Communion hymns',
    };
  } else if (upper.includes('7S') || upper.includes('7.7.7.7')) {
    meterType = '7s — Sevens (7.7.7.7)';
    tonicSolFa = {
      keySuggestion: 'Key G / A major',
      timeSignature: '4/4 Stately Time',
      scaleSnippet: '| d : r | m : d | s : f | m : - |\n| r : d | t, : l, | s, : - : - |\n| s : f | m : r | d : m | s : - |\n| f : m | r : r | d : - : - ||',
      patternNotes: 'Seven crisp syllables per line • Celebratory and prayerful',
    };
  } else if (upper.includes('KI AGBARA') || upper.includes('ALAFIA')) {
    meterType = 'Orin Akúnlẹkọ & Ìtẹ̀ríbá (Yoruba Liturgical Air)';
    tonicSolFa = {
      keySuggestion: 'Pentatonic / Modal',
      timeSignature: 'Free Worship Rhythm',
      scaleSnippet: '| d : r : m | s : - : m | r : d : l, | s, : - |\n| d : m : r | d : - : - ||',
      patternNotes: 'Solemn call-and-response kneeling chant • Accompany with agogo & gentle organ',
    };
  }

  return {
    meterType,
    tuneRef,
    editionRef,
    tonicSolFa,
  };
};
