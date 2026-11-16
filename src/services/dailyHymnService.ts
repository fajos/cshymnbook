import { Hymn } from '../types/hymn';
import { hymns, getHymnById } from './hymnService';

export interface DailyHymnItem {
  dateString: string;
  themeTitle: string;
  hymn: Hymn;
  verseExcerpt: string;
}

// 31 Curated devotional anchor hymns rotated cyclically across the calendar days
const DEVOTIONAL_ANCHORS: { hymnId: number; theme: string }[] = [
  { hymnId: 131, theme: 'Assurance & Joyful Praise' },
  { hymnId: 64, theme: 'Twilight Trust & Abiding Peace' },
  { hymnId: 482, theme: 'Total Surrender to Christ' },
  { hymnId: 520, theme: 'Sheltered Under God’s Wings' },
  { hymnId: 621, theme: 'Courage & Standing Firm in Faith' },
  { hymnId: 143, theme: 'Seraphic Covenant & Divine Protection' },
  { hymnId: 105, theme: 'The Wonder of Redemption' },
  { hymnId: 461, theme: 'The Sweet Haven of Prayer' },
  { hymnId: 442, theme: 'Treasure of the Holy Scriptures' },
  { hymnId: 819, theme: 'Grace & Farewell Benediction' },
  { hymnId: 46, theme: 'Morning Consecration & Sun of Righteousness' },
  { hymnId: 169, theme: 'All People That on Earth Do Dwell' },
  { hymnId: 54, theme: 'Evening Healing & Twilight Supplication' },
  { hymnId: 66, theme: 'Holy Sabbath & Day of Rest' },
  { hymnId: 91, theme: 'Seeking Christ’s Redemption' },
  { hymnId: 127, theme: 'Rejoicing in the Lord Always' },
  { hymnId: 188, theme: 'Triumphant Hope for Believers' },
  { hymnId: 245, theme: 'Saluting the Happy Morn' },
  { hymnId: 256, theme: 'The Risen Savior’s Victory' },
  { hymnId: 269, theme: 'Holy Ghost Fire & Divine Guidance' },
  { hymnId: 501, theme: 'Angelic Deliverance & Overcoming' },
  { hymnId: 549, theme: 'Unfailing Friendship in Jesus' },
  { hymnId: 646, theme: 'Soldiers of the Cross' },
  { hymnId: 760, theme: 'Harvest Praise & Bountiful Goodness' },
  { hymnId: 800, theme: 'Covenant of the New Dawn' },
  { hymnId: 95, theme: 'United Praise & Thanksgiving' },
  { hymnId: 585, theme: 'Grace Unfathomable & Divine Favor' },
  { hymnId: 270, theme: 'Descent of Heavenly Power' },
  { hymnId: 370, theme: 'The Way of the Holy Cross' },
  { hymnId: 761, theme: 'Reaping in Heavenly Joy' },
  { hymnId: 801, theme: 'Praise for Another Year of Life' },
];

/**
 * Calculates the day of the year (1 - 366).
 */
function getDayOfYear(date: Date = new Date()): number {
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = date.getTime() - start.getTime() + (start.getTimezoneOffset() - date.getTimezoneOffset()) * 60 * 1000;
  const oneDay = 1000 * 60 * 60 * 24;
  return Math.floor(diff / oneDay);
}

/**
 * Returns the Hymn of the Day for today's date.
 */
export function getHymnOfTheDay(targetDate: Date = new Date()): DailyHymnItem {
  const dayOfYear = getDayOfYear(targetDate);
  const anchorIndex = (dayOfYear - 1) % DEVOTIONAL_ANCHORS.length;
  const anchor = DEVOTIONAL_ANCHORS[anchorIndex];

  let selectedHymn = getHymnById(anchor.hymnId);
  if (!selectedHymn && hymns.length > 0) {
    selectedHymn = hymns[0];
  }

  // Extract first 2 lines of first stanza as verse excerpt
  let verseExcerpt = '';
  if (selectedHymn && selectedHymn.stanzas.length > 0) {
    const lines = selectedHymn.stanzas[0].text
      .split('\n')
      .map((l) => l.trim())
      .filter((l) => l.length > 0);
    verseExcerpt = lines.slice(0, 2).join(' / ');
  }

  const dateOptions: Intl.DateTimeFormatOptions = {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  };
  const dateString = targetDate.toLocaleDateString(undefined, dateOptions);

  return {
    dateString,
    themeTitle: anchor.theme,
    hymn: selectedHymn!,
    verseExcerpt,
  };
}
