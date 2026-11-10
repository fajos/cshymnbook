import { Hymn, Category, HymnDatabase } from '../types/hymn';

// Import the bundled JSON data directly
const hymnData: HymnDatabase = require('../../assets/data/cshymns.json');

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
  cleaned = cleaned.replace(/^(egbe|ẹgbẹ|chorus|refrain)\s*[:\-\—\t]\s*/i, '');
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

// Clean and normalize hymns database on import
export const categories: Category[] = hymnData.categories;
export const hymns: Hymn[] = hymnData.hymns.map((h) => ({
  ...h,
  amen: cleanAmenText(h.amen),
  stanzas: h.stanzas.map((s) => ({
    ...s,
    text: cleanStanzaText(s.text),
    chorus: cleanChorusText(s.chorus),
  })),
}));

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

/**
 * Search hymns by query string across number, title, scripture, and stanzas
 */
export function searchHymns(query: string, categoryId?: number | null): Hymn[] {
  const trimmed = query.trim();
  const normalizedQuery = normalizeText(trimmed);

  let targetList = hymns;
  if (categoryId !== undefined && categoryId !== null) {
    targetList = hymns.filter((h) => h.category_id === categoryId);
  }

  if (!normalizedQuery) {
    return targetList;
  }

  // Check if query is purely numeric or starts with number
  const numMatch = trimmed.match(/^\d+$/);
  const targetNum = numMatch ? parseInt(numMatch[0], 10) : null;

  return targetList.filter((hymn) => {
    // 1. Direct number match
    if (targetNum !== null) {
      const hNum = extractNumber(hymn.hymn_number);
      if (hNum === targetNum) return true;
      if (hymn.hymn_number.toLowerCase().includes(trimmed.toLowerCase())) return true;
    }

    // 2. Title match
    const normTitle = normalizeText(hymn.title);
    if (normTitle.includes(normalizedQuery)) return true;

    // 3. Hymn number match (e.g. "isoji 5", "ks 474", "saamu 24")
    const normHymnNum = normalizeText(hymn.hymn_number);
    if (normHymnNum.includes(normalizedQuery)) return true;

    // 4. Scripture match
    const normScripture = normalizeText(hymn.scripture);
    if (normScripture.includes(normalizedQuery)) return true;

    // 5. Stanza lyrics match
    for (const stanza of hymn.stanzas) {
      if (normalizeText(stanza.text).includes(normalizedQuery)) return true;
      if (stanza.chorus && normalizeText(stanza.chorus).includes(normalizedQuery)) return true;
    }

    return false;
  });
}

/**
 * Get hymn by its primary ID
 */
export function getHymnById(id: number): Hymn | undefined {
  return hymns.find((h) => h.id === id);
}

/**
 * Get next and previous hymns for reader navigation
 */
export function getSurroundingHymns(currentId: number): { prev: Hymn | null; next: Hymn | null } {
  const index = hymns.findIndex((h) => h.id === currentId);
  if (index === -1) return { prev: null, next: null };
  return {
    prev: index > 0 ? hymns[index - 1] : null,
    next: index < hymns.length - 1 ? hymns[index + 1] : null,
  };
}

/**
 * Get hymns in a category
 */
export function getHymnsByCategory(categoryId: number): Hymn[] {
  return hymns.filter((h) => h.category_id === categoryId);
}

/**
 * Special Liturgical sections
 */
export const SPECIAL_SECTIONS = [
  { id: 'akunleko', name: 'Orin Akúnlẹkọ (i - xlv)', categoryId: 0, icon: 'hand-left-outline' },
  { id: 'isoji', name: 'Orin Isọji & Idaraya (1 - 49)', categoryId: 54, icon: 'flame-outline' },
  { id: 'psalms', name: 'Orin Dafidi (Psalms)', categoryId: 55, icon: 'book-outline' },
  { id: 'lord_prayer', name: "Adura Oluwa (Lord's Prayer)", categoryId: 56, icon: 'sunny-outline' },
  { id: 'creeds', name: 'Igbagbọ & Katikismu', categoryId: 57, icon: 'shield-checkmark-outline' },
];
