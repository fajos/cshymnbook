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

// Bundled English Hymn Database (868 hymns)
const bundledEnglishHymns: Record<string, EnglishHymn> = require('../../assets/data/englishHymns.json');

// Curated author & title metadata for classic Western & C&S pillars
const CURATED_METADATA_OVERRIDES: Record<number, Partial<EnglishHymn>> = {
  1: {
    englishTitle: 'God is a Spirit: And They That Worship Him',
    author: 'Liturgical Scripture (John 4:24)',
  },
  4: {
    englishTitle: 'Our Heavenly Father, We Have Come Today',
    author: 'C&S Traditional Kneeling Air',
  },
  46: {
    englishTitle: 'Awake, My Soul, and with the Sun',
    author: 'Thomas Ken (1637–1711)',
  },
  47: {
    englishTitle: 'Awake, Awake, Ye Heavenly Choir',
    author: 'Thomas Tallis (1567)',
  },
  48: {
    englishTitle: 'All People That on Earth Do Dwell',
    author: 'William Kethe (1561)',
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
  245: {
    englishTitle: 'Christians, Awake, Salute the Happy Morn',
    author: 'John Byrom (1749)',
  },
  344: {
    englishTitle: 'Sweet Hour of Prayer',
    author: 'William W. Walford (1845)',
  },
  442: {
    englishTitle: 'Holy Bible, Book Divine',
    author: 'John Burton (1803)',
  },
  482: {
    englishTitle: 'All to Jesus I Surrender (I Surrender All)',
    author: 'Judson W. Van DeVenter (1896)',
  },
  520: {
    englishTitle: 'Under His Wings I Am Safely Abiding',
    author: 'William Orcutt Cushing (1896)',
  },
  646: {
    englishTitle: 'Stand Up, Stand Up for Jesus',
    author: 'George Duffield Jr. (1858)',
  },
  821: {
    englishTitle: 'God Be with You Till We Meet Again',
    author: 'Jeremiah E. Rankin (1880)',
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
  if (!override) return base;

  return {
    ...base,
    ...override,
    stanzas: override.stanzas || base.stanzas,
  };
};

export const ENGLISH_HYMNS: Record<string, EnglishHymn> = bundledEnglishHymns;
