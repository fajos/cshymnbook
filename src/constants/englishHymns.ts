import { cleanChorusText, cleanStanzaText } from '../utils/textUtils';

export interface EnglishStanza {
  number: string;
  text: string;
  chorus?: string;
}

export interface EnglishHymn {
  hymnId: number;
  englishTitle: string;
  author?: string;
  stanzas: EnglishStanza[];
}

// Bundled English Hymn Database (866 hymns)
const bundledEnglishHymns: Record<string, EnglishHymn> = require('../../assets/data/englishHymns.json');

// Curated author & title metadata for classic Western & C&S pillars
const CURATED_METADATA_OVERRIDES: Record<number, Partial<EnglishHymn>> = {
  46: {
    englishTitle: 'Awake, My Soul, and with the Sun',
    author: 'Thomas Ken (1637–1711)',
  },
  47: {
    englishTitle: 'Awake, Awake, Ye Heavenly Choir',
    author: 'Thomas Tallis (1567)',
  },
  48: {
    englishTitle: 'Through All the Dangers of the Night',
    author: 'Thomas Kelly (1806)',
  },
  50: {
    englishTitle: 'Come to the Morning Prayer',
    author: 'James Montgomery (1825)',
  },
  54: {
    englishTitle: 'At Even, Ere the Sun Was Set',
    author: 'Henry Twells (1868)',
  },
  60: {
    englishTitle: 'Lead, Kindly Light, Amid the Encircling Gloom',
    author: 'John Henry Newman (1833)',
  },
  64: {
    englishTitle: 'Abide with Me, Fast Falls the Eventide (Part 1)',
    author: 'Henry Francis Lyte (1847)',
  },
  65: {
    englishTitle: 'Abide with Me, Fast Falls the Eventide (Part 2 - Eventide)',
    author: 'Henry Francis Lyte (1847)',
  },
  66: {
    englishTitle: 'Holy, Holy Sabbath (Day of Rest and Gladness)',
    author: 'Christopher Wordsworth (1862)',
  },
  91: {
    englishTitle: 'I Seek Redemption from Our Christ',
    author: 'C&S Traditional Supplication',
  },
  105: {
    englishTitle: 'Redeemed! How I Love to Proclaim It',
    author: 'Fanny J. Crosby (1882)',
  },
  127: {
    englishTitle: 'Rejoice in the Lord Always',
    author: 'Wilbur A. Christy (1896)',
  },
  131: {
    englishTitle: 'Blessed Assurance, Jesus Is Mine',
    author: 'Fanny J. Crosby & Phoebe P. Knapp (1873)',
  },
  143: {
    englishTitle: 'God Our Creator Who Created the Seraphic Band',
    author: 'Cherubim & Seraphim Founding Fathers (1925)',
  },
  169: {
    englishTitle: 'All People That on Earth Do Dwell',
    author: 'William Kethe (1561)',
  },
  245: {
    englishTitle: 'Christians, Awake, Salute the Happy Morn',
    author: 'John Byrom (1749)',
  },
  344: {
    englishTitle: 'Sweet the Moments Rich in Blessing',
    author: 'James Allen & Walter Shirley (1770)',
  },
  442: {
    englishTitle: 'Holy Bible, Book Divine',
    author: 'John Burton (1803)',
  },
  461: {
    englishTitle: 'Sweet Hour of Prayer',
    author: 'William W. Walford (1845)',
  },
  482: {
    englishTitle: 'All to Jesus I Surrender (I Surrender All)',
    author: 'Judson W. Van DeVenter (1896)',
  },
  520: {
    englishTitle: 'Under His Wings I Am Safely Abiding',
    author: 'William Orcutt Cushing (1896)',
  },
  549: {
    englishTitle: 'What a Friend We Have in Jesus',
    author: 'Joseph M. Scriven (1855)',
  },
  585: {
    englishTitle: 'Amazing Grace, How Sweet the Sound',
    author: 'John Newton (1779)',
  },
  621: {
    englishTitle: 'Stand Up, Stand Up for Jesus',
    author: 'George Duffield Jr. (1858)',
  },
  646: {
    englishTitle: 'All Ye the Holy Saints of God',
    author: 'Cherubim & Seraphim Traditional',
  },
  767: {
    englishTitle: 'Blessed Day of Joy It Is',
    author: 'Cherubim & Seraphim Traditional Anniversary',
  },
  819: {
    englishTitle: 'God Be with You Till We Meet Again',
    author: 'Jeremiah E. Rankin (1880)',
  },
  821: {
    englishTitle: 'We Are Going Home, Escort Us Forth',
    author: 'Cherubim & Seraphim Dismissal Air',
  },
};

/**
 * Retrieves the English translation for a given hymn primary ID.
 * Returns null if no English lyrics exist for that hymn.
 */
export const getEnglishHymn = (hymnId: number): EnglishHymn | null => {
  const base = bundledEnglishHymns[String(hymnId)] || (bundledEnglishHymns as any)[hymnId];
  if (!base) return null;

  const override = CURATED_METADATA_OVERRIDES[hymnId];
  const combined = override
    ? {
        ...base,
        ...override,
        stanzas: override.stanzas || base.stanzas,
      }
    : base;

  return {
    ...combined,
    stanzas: combined.stanzas.map((s) => ({
      ...s,
      text: cleanStanzaText(s.text),
      chorus: cleanChorusText(s.chorus),
    })),
  };
};

export const ENGLISH_HYMNS: Record<string, EnglishHymn> = bundledEnglishHymns;
