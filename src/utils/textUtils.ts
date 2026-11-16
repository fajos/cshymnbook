/**
 * Utility functions for text cleaning, normalization, and search parsing
 */

/**
 * Cleans a chorus/refrain string by:
 * 1. Stripping redundant leading "Egbe:" / "Refrain:" / "Chorus:" / "EGBE:" label from the text
 * 2. Trimming leading and trailing tabs and extra whitespace from every line so all lines align cleanly flush left
 * 3. Replacing internal tab clusters with a single space and removing blank lines
 */
export function cleanChorusText(rawChorus?: string | null): string {
  if (!rawChorus) return '';
  let cleaned = rawChorus.trim();
  // Strip redundant leading "Egbe:" / "Refrain:" / "Chorus:" label and following delimiter
  cleaned = cleaned.replace(/^(egbe|ẹgbẹ|chorus|refrain|chirus|chous)\s*[:\-\—\t]\s*/i, '');
  // Normalize lines: trim leading/trailing tabs and whitespace from every line, replace internal tabs with spaces
  const lines = cleaned
    .split('\n')
    .map((line) =>
      line
        .replace(/^[\t ]+/, '')
        .replace(/[\t ]+$/, '')
        .replace(/\t+/g, ' ')
    );
  // Remove leading and trailing empty lines
  while (lines.length > 0 && lines[0].trim() === '') lines.shift();
  while (lines.length > 0 && lines[lines.length - 1].trim() === '') lines.pop();
  return lines.join('\n');
}

/**
 * Cleans stanza text by removing leading tabs / typewriter indentations and normalizing internal tabs
 */
export function cleanStanzaText(rawText?: string | null): string {
  if (!rawText) return '';
  return rawText
    .split('\n')
    .map((line) =>
      line
        .replace(/^[\t ]+/, '')
        .replace(/[\t ]+$/, '')
        .replace(/\t+/g, ' ')
    )
    .join('\n')
    .trim();
}

/**
 * Cleans closing amen / asẹ text by removing leading tabs and normalizing whitespace
 */
export function cleanAmenText(rawAmen?: string | null): string {
  if (!rawAmen) return '';
  return rawAmen
    .split('\n')
    .map((line) =>
      line
        .replace(/^[\t ]+/, '')
        .replace(/[\t ]+$/, '')
        .replace(/\t+/g, ' ')
    )
    .join('\n')
    .trim();
}

/**
 * Normalizes a string for diacritic-insensitive and case-insensitive search
 */
export function normalizeText(text: string): string {
  if (!text) return '';
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // remove accent marks
    .replace(/[ẹ]/g, 'e')
    .replace(/[ọ]/g, 'o')
    .replace(/[ṣ]/g, 's')
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Extract number from hymn number string (e.g. "K&S 474" -> 474, "474" -> 474, "Isoji 10" -> 10)
 */
export function extractNumber(hymnNumber: string): number | null {
  const match = hymnNumber.match(/\d+/);
  return match ? parseInt(match[0], 10) : null;
}
