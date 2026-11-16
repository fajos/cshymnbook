import { Hymn, Category, HymnDatabase } from '../types/hymn';
import {
  cleanChorusText,
  cleanStanzaText,
  cleanAmenText,
  normalizeText,
  extractNumber,
} from '../utils/textUtils';
import { getEnglishHymn } from '../constants/englishHymns';

// Re-export text utilities for backward compatibility
export {
  cleanChorusText,
  cleanStanzaText,
  cleanAmenText,
  normalizeText,
  extractNumber,
};

// Import the bundled JSON data directly
const hymnData: HymnDatabase = require('../../assets/data/cshymns.json');

// Clean and normalize hymns database on import, and enrich with English titles
export const categories: Category[] = hymnData.categories;

export const hymns: Hymn[] = hymnData.hymns.map((h) => {
  const eng = getEnglishHymn(h.id);
  return {
    ...h,
    english_title: eng?.englishTitle || undefined,
    english_author: eng?.author || undefined,
    amen: cleanAmenText(h.amen),
    stanzas: h.stanzas.map((s) => ({
      ...s,
      text: cleanStanzaText(s.text),
      chorus: cleanChorusText(s.chorus),
    })),
  };
});

// Pre-computed search index entry for lightning-fast bilingual search
interface SearchIndexEntry {
  hymn: Hymn;
  targetNum: number | null;
  lowerHymnNum: string;
  normTitle: string;
  normEngTitle: string;
  normScripture: string;
  searchBlob: string;
}

// Build pre-computed normalized search index once at load time (~50ms)
const searchIndex: SearchIndexEntry[] = hymns.map((h) => {
  const eng = getEnglishHymn(h.id);
  const parts: string[] = [
    h.hymn_number,
    h.title,
    h.scripture || '',
    ...h.stanzas.map((s) => (s.text || '') + ' ' + (s.chorus || '')),
  ];

  if (eng) {
    if (eng.englishTitle) parts.push(eng.englishTitle);
    if (eng.author) parts.push(eng.author);
    if (eng.stanzas && eng.stanzas.length > 0) {
      parts.push(...eng.stanzas.map((s) => (s.text || '') + ' ' + (s.chorus || '')));
    }
  }

  return {
    hymn: h,
    targetNum: extractNumber(h.hymn_number),
    lowerHymnNum: h.hymn_number.toLowerCase(),
    normTitle: normalizeText(h.title),
    normEngTitle: normalizeText(eng?.englishTitle || ''),
    normScripture: normalizeText(h.scripture || ''),
    searchBlob: normalizeText(parts.join(' ')),
  };
});

/**
 * Search hymns by query string across number, title, scripture, stanzas, and English translation
 */
export function searchHymns(query: string, categoryId?: number | null): Hymn[] {
  const trimmed = query.trim();
  const normalizedQuery = normalizeText(trimmed);

  const filterCategory = categoryId !== undefined && categoryId !== null;

  if (!normalizedQuery) {
    if (filterCategory) {
      return hymns.filter((h) => h.category_id === categoryId);
    }
    return hymns;
  }

  // Check if query is purely numeric or target number
  const numMatch = trimmed.match(/^\d+$/);
  const targetNum = numMatch ? parseInt(numMatch[0], 10) : null;
  const lowerQuery = trimmed.toLowerCase();

  const scored: { hymn: Hymn; score: number }[] = [];

  for (let i = 0; i < searchIndex.length; i++) {
    const entry = searchIndex[i];
    if (filterCategory && entry.hymn.category_id !== categoryId) {
      continue;
    }

    let score = 0;

    // 1. Direct number matches
    if (targetNum !== null) {
      if (entry.targetNum === targetNum) {
        score += 1000;
      } else if (entry.lowerHymnNum.includes(lowerQuery)) {
        score += 400;
      }
    } else if (entry.lowerHymnNum.includes(lowerQuery)) {
      score += 500;
    }

    // 2. Yoruba Title match
    if (entry.normTitle.startsWith(normalizedQuery)) {
      score += 300;
    } else if (entry.normTitle.includes(normalizedQuery)) {
      score += 200;
    }

    // 3. English Title match
    if (entry.normEngTitle.startsWith(normalizedQuery)) {
      score += 250;
    } else if (entry.normEngTitle.includes(normalizedQuery)) {
      score += 180;
    }

    // 4. Scripture match
    if (entry.normScripture.includes(normalizedQuery)) {
      score += 100;
    }

    // 5. Full search blob match (stanzas, chorus, authors, etc. in Yoruba or English)
    if (score === 0 && entry.searchBlob.includes(normalizedQuery)) {
      score += 50;
    }

    if (score > 0) {
      scored.push({ hymn: entry.hymn, score });
    }
  }

  // Sort by score descending, then by hymn id ascending
  scored.sort((a, b) => {
    if (b.score !== a.score) {
      return b.score - a.score;
    }
    return a.hymn.id - b.hymn.id;
  });

  return scored.map((s) => s.hymn);
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
