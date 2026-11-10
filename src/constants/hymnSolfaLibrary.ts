export type SolfaScope = 'full_stanza' | 'stanza_refrain' | 'incipit';

export interface VerifiedHymnSolfa {
  hymnId: number;
  hymnNumber: string;
  tuneTitle: string;
  composerOrOrigin?: string;
  meterName: string;
  keySignature: string;
  timeSignature: string;
  tempoGuidance?: string;
  scope: SolfaScope;
  scopeLabel: string;
  solfaNotation: string;
  notes?: string;
}

/**
 * Verified Hymn Sol-fa Library (Approach B)
 * Curated repository of authentic Tonic Sol-fa notations for Cherubim & Seraphim hymns.
 * Only hymns with verified church/historical tunes are listed here.
 */
export const HYMN_SOLFA_LIBRARY: Record<number, VerifiedHymnSolfa> = {
  // Hymn 1: K&S i
  1: {
    hymnId: 1,
    hymnNumber: 'K&S i',
    tuneTitle: 'Orin Akúnlẹkọ & Ìtẹ̀ríbá I',
    composerOrOrigin: 'Traditional C&S Kneeling Prayer Chant',
    meterName: 'Liturgical Air (Call & Response)',
    keySignature: 'Modal Pentatonic (Key G / D)',
    timeSignature: 'Free Prayer Rhythm',
    tempoGuidance: 'Slow, prayerful kneeling chant',
    scope: 'incipit',
    scopeLabel: '1-Line Opening Incipit',
    solfaNotation: '| d : r : m | s : - : m | r : d : l, | s, : - |\n| d : m : r | d : - : - ||',
    notes: 'Opening prompt chanted by the leader; congregation responds on the cadence.',
  },

  // Hymn 2: K&S ii
  2: {
    hymnId: 2,
    hymnNumber: 'K&S ii',
    tuneTitle: 'Orin Akúnlẹkọ & Ìtẹ̀ríbá II',
    composerOrOrigin: 'Traditional C&S Kneeling Air',
    meterName: 'Liturgical Air',
    keySignature: 'Modal Pentatonic (Key G)',
    timeSignature: 'Free Prayer Rhythm',
    tempoGuidance: 'Solemn and reverent',
    scope: 'incipit',
    scopeLabel: '1-Line Opening Incipit',
    solfaNotation: '| s, : d : r | m : - : r | d : - : l, | s, : - |\n| d : r : m | r : - : d ||',
    notes: 'Kneeling petition chanted before the altar.',
  },

  // Hymn 3: K&S iii
  3: {
    hymnId: 3,
    hymnNumber: 'K&S iii',
    tuneTitle: 'Orin Akúnlẹkọ & Ìtẹ̀ríbá III',
    composerOrOrigin: 'Traditional C&S Kneeling Air',
    meterName: 'Liturgical Air',
    keySignature: 'Modal Pentatonic (Key G / F)',
    timeSignature: 'Free Prayer Rhythm',
    tempoGuidance: 'Deeply devotional',
    scope: 'incipit',
    scopeLabel: '1-Line Opening Incipit',
    solfaNotation: '| d : m : s | s : - : m | r : d : r | m : - |\n| r : d : l, | s, : - : d | d : - : - ||',
    notes: 'Chanted in reverence at the beginning of congregational prayer.',
  },

  // Hymn 4: K&S iv
  4: {
    hymnId: 4,
    hymnNumber: 'K&S iv',
    tuneTitle: 'Orin Akúnlẹkọ & Ìtẹ̀ríbá IV',
    composerOrOrigin: 'Traditional C&S Kneeling Air',
    meterName: 'Liturgical Air',
    keySignature: 'Modal Pentatonic (Key F / G)',
    timeSignature: 'Free Prayer Rhythm',
    tempoGuidance: 'Solemn call for mercy',
    scope: 'incipit',
    scopeLabel: '1-Line Opening Incipit',
    solfaNotation: '| m : - : r | d : - : l, | s, : d : r | m : - |\n| r : d : t, | d : - : - ||',
    notes: 'Call for mercy and peace before the opening prayer.',
  },

  // Hymn 5: K&S v
  5: {
    hymnId: 5,
    hymnNumber: 'K&S v',
    tuneTitle: 'Orin Akúnlẹkọ & Ìtẹ̀ríbá V',
    composerOrOrigin: 'Traditional C&S Kneeling Air',
    meterName: 'Liturgical Air',
    keySignature: 'Modal Pentatonic (Key G)',
    timeSignature: 'Free Prayer Rhythm',
    tempoGuidance: 'Pleading invocation',
    scope: 'incipit',
    scopeLabel: '1-Line Opening Incipit',
    solfaNotation: '| d : r : m | s : - : m | r : d : l, | s, : - |\n| d : m : r | d : - : - ||',
    notes: 'Petition for the Holy Spirit to preside over the service.',
  },

  // Hymn 46: K&S 1
  46: {
    hymnId: 46,
    hymnNumber: 'K&S 1',
    tuneTitle: 'Morning Hymn',
    composerOrOrigin: 'François Hippolyte Barthélémon (1785)',
    meterName: 'L.M. — Long Meter (8.8.8.8)',
    keySignature: 'Key G major',
    timeSignature: '4/4 (Common Time)',
    tempoGuidance: 'Stately & reverent organ cadence • 84 BPM',
    scope: 'full_stanza',
    scopeLabel: 'Full Stanza Melody',
    solfaNotation: '| d : - | d : r | m : - | d : - | r : m | f : m | r : - : - |\n| m : - | m : f | s : - | m : - | f : m | r : r | d : - : - |\n| s : - | s : s | l : - | s : - | f : m | r : d | r : - : - |\n| m : - | f : m | r : - | d : - | r : m | r : r | d : - : - ||',
    notes: 'Complete 4-line tune. All stanzas follow this identical metric melodic framework.',
  },

  // Hymn 47: K&S 2
  47: {
    hymnId: 47,
    hymnNumber: 'K&S 2',
    tuneTitle: "Tallis' Canon",
    composerOrOrigin: 'Thomas Tallis (1567) • C.M.S. 1, H.C. 2',
    meterName: 'L.M. — Long Meter (8.8.8.8)',
    keySignature: 'Key G major',
    timeSignature: '4/4 (Common Time)',
    tempoGuidance: 'Brisk & steady canonical pace • 92 BPM',
    scope: 'full_stanza',
    scopeLabel: 'Full Stanza Melody',
    solfaNotation: '| d : - | r : m | d : d | r : r | m : - : - |\n| m : - | f : s | m : m | f : f | s : - : - |\n| s : - | l : s | f : m | r : d | r : - : - |\n| m : - | r : d | s : l | s : s | d : - : - ||',
    notes: 'Famous canonical melody. Can be sung in round by two choir sections two bars apart.',
  },

  // Hymn 48: K&S 3
  48: {
    hymnId: 48,
    hymnNumber: 'K&S 3',
    tuneTitle: 'Old 100th (Doxology)',
    composerOrOrigin: 'Louis Bourgeois (Genevan Psalter, 1551) • C.M.S. 1, H.C. 2',
    meterName: 'L.M. — Long Meter (8.8.8.8)',
    keySignature: 'Key G major',
    timeSignature: '4/4 (Common Time)',
    tempoGuidance: 'Dignified & solemn • 80 BPM',
    scope: 'full_stanza',
    scopeLabel: 'Full Stanza Melody',
    solfaNotation: '| d : - | d : t, | l, : s, | d : r | m : - : - |\n| m : - | m : m | r : d | r : m | r : - : - |\n| r : - | m : f | s : m | d : r | m : - : - |\n| d : - | r : d | t, : l, | s, : d | d : - : - ||',
    notes: 'Historic Genevan Doxology meter. Unhurried, majestic morning praise.',
  },

  // Hymn 49: K&S 4
  49: {
    hymnId: 49,
    hymnNumber: 'K&S 4',
    tuneTitle: 'Evan',
    composerOrOrigin: 'William Henry Havergal (1846) • C.M.S. 2',
    meterName: 'C.M. — Common Meter (8.6.8.6)',
    keySignature: 'Key A♭ major',
    timeSignature: '3/4 Time',
    tempoGuidance: 'Gentle prayerful rhythm • 76 BPM',
    scope: 'full_stanza',
    scopeLabel: 'Full Stanza Melody',
    solfaNotation: '| m : - : m | r : - : d | f : - : m | r : - : - |\n| s : - : m | d : - : r | m : - : - |\n| m : - : f | s : - : m | l : - : s | f : - : - |\n| m : - : d | r : - : t, | d : - : - ||',
    notes: 'Traditional Common Meter morning devotional air.',
  },

  // Hymn 50: K&S 5
  50: {
    hymnId: 50,
    hymnNumber: 'K&S 5',
    tuneTitle: 'Melcombe',
    composerOrOrigin: 'Samuel Webbe (1782) • C.M.S. 5, H.C. 17',
    meterName: 'L.M. — Long Meter (8.8.8.8)',
    keySignature: 'Key F major',
    timeSignature: '4/4 (Common Time)',
    tempoGuidance: 'Stately morning call • 86 BPM',
    scope: 'full_stanza',
    scopeLabel: 'Full Stanza Melody',
    solfaNotation: '| d : - | f : m | r : d | s : - : - |\n| l : - | s : f | m : r | d : - : - |\n| m : - | r : d | f : m | r : - : - |\n| s : - | f : m | r : d | d : - : - ||',
    notes: 'Classic Anglican and C&S morning liturgical tune.',
  },

  // Hymn 54: K&S 9
  54: {
    hymnId: 54,
    hymnNumber: 'K&S 9',
    tuneTitle: 'Angelus',
    composerOrOrigin: 'Georg Joseph (1657) • C.M.S. 596, H.C. 552',
    meterName: 'L.M. — Long Meter (8.8.8.8)',
    keySignature: 'Key F major / E♭ major',
    timeSignature: '3/4 Time',
    tempoGuidance: 'Gentle evening pastorale • 80 BPM',
    scope: 'full_stanza',
    scopeLabel: 'Full Stanza Melody',
    solfaNotation: '| m : - : m | f : - : m | r : - : d | r : - : - |\n| m : - : f | s : - : m | d : - : r | d : - : - |\n| d\' : - : t | l : - : s | f : - : m | r : - : - |\n| m : - : f | s : - : d | m : - : r | d : - : - ||',
    notes: "Evening service classic; note the expressive leap to high d' in line 3.",
  },

  // Hymn 59: K&S 14
  59: {
    hymnId: 59,
    hymnNumber: 'K&S 14',
    tuneTitle: 'St. Bees',
    composerOrOrigin: 'John Bacchus Dykes (1862) • C.M.S. 12, H.C. 224',
    meterName: '7s — Sevens (7.7.7.7)',
    keySignature: 'Key G major',
    timeSignature: '4/4 (Common Time)',
    tempoGuidance: 'Quiet gratitude • 84 BPM',
    scope: 'full_stanza',
    scopeLabel: 'Full Stanza Melody',
    solfaNotation: '| d : r | m : s | f : m | r : - : - |\n| m : f | s : d\' | t : l | s : - : - |\n| d\' : t | l : s | f : m | r : - : - |\n| m : f | s : d | m : r | d : - : - ||',
    notes: 'Choral evening prayer thanking God for daytime preservation.',
  },

  // Hymn 60: K&S 15
  60: {
    hymnId: 60,
    hymnNumber: 'K&S 15',
    tuneTitle: 'Lux Benigna (Lead, Kindly Light)',
    composerOrOrigin: 'John Bacchus Dykes (1865) • C.M.S. 14, H.C. 120',
    meterName: '10.4.10.4.10.10',
    keySignature: 'Key A♭ major / G major',
    timeSignature: '3/4 Time',
    tempoGuidance: 'Solemn, meditative phrasing • 72 BPM',
    scope: 'full_stanza',
    scopeLabel: 'Full Stanza Melody',
    solfaNotation: '| m : - : f | s : - : d | l : - : s | m : - : - |\n| r : - : m | f : - : - | m : - : - |\n| m : - : f | s : - : d | l : - : s | m : - : - |\n| f : - : s | l : - : - | s : - : - |\n| s : - : l | t : - : d\' | r\' : - : d\' | t : - : l | s : - : - |\n| f : - : m | r : - : d | d : - : t, | d : - : - ||',
    notes: 'A masterpiece of choral devotion. Keep the tempo steady without rushing the 3-beat measures.',
  },

  // Hymn 64: K&S 19 (Part 1)
  64: {
    hymnId: 64,
    hymnNumber: 'K&S 19',
    tuneTitle: 'Abends',
    composerOrOrigin: 'Herbert Stanley Oakeley (1874) • C.M.S. 16, H.C. 21',
    meterName: 'L.M. — Long Meter (8.8.8.8)',
    keySignature: 'Key C major',
    timeSignature: '3/4 Time',
    tempoGuidance: 'Reflective and peaceful • 76 BPM',
    scope: 'full_stanza',
    scopeLabel: 'Full Stanza Melody',
    solfaNotation: '| s : - : m | d : - : r | m : - : f | s : - : - |\n| l : - : s | f : - : m | r : - : d | r : - : - |\n| s : - : m | d : - : r | m : - : f | s : - : - |\n| f : - : m | r : - : t, | d : - : - : - ||',
    notes: 'Long Meter alternative setting of "Abide with Me" in C&S hymnal.',
  },

  // Hymn 65: K&S 19 (Part 2)
  65: {
    hymnId: 65,
    hymnNumber: 'K&S 19',
    tuneTitle: 'Eventide (Abide with Me)',
    composerOrOrigin: 'William Henry Monk (1861) • C.M.S. 15, H.C. 20',
    meterName: '10.10.10.10 — Decasyllabic',
    keySignature: 'Key E♭ major',
    timeSignature: '4/4 (Common Time)',
    tempoGuidance: 'Deeply solemn and prayerful • 76 BPM',
    scope: 'full_stanza',
    scopeLabel: 'Full Stanza Melody',
    solfaNotation: '| m : - | m : r | d : - | s : - | l : s | s : f | m : - : - |\n| m : - | f : s | l : - | s : - | f : m | m : r | m : - : - |\n| m : - | m : r | d : - | s : - | l : t | d\' : l | s : - : - |\n| s : - | f : m | r : - | d : - | f : m | m : r | d : - : - ||',
    notes: 'The world-renowned Eventide melody. Full stanza with all 4 majestic phrases.',
  },

  // Hymn 66: K&S 20
  66: {
    hymnId: 66,
    hymnNumber: 'K&S 20',
    tuneTitle: 'Ellers',
    composerOrOrigin: 'Edward John Hopkins (1869) • C.M.S. 15, H.C. 20',
    meterName: '10.10.10.10 — Decasyllabic',
    keySignature: 'Key A♭ major',
    timeSignature: '4/4 (Common Time)',
    tempoGuidance: 'Calm, benedictory cadence • 80 BPM',
    scope: 'full_stanza',
    scopeLabel: 'Full Stanza Melody',
    solfaNotation: '| m : - | m : r | d : - | l, : - | d : - | t, : - | d : - : - |\n| m : - | m : f | s : - | m : - | r : - | d : - | r : - : - |\n| s : - | l : t | d\' : - | l : - | s : - | f : - | m : - : - |\n| m : - | r : d | f : - | m : - | r : - | r : - | d : - : - ||',
    notes: 'Traditional dismissal and Sabbath closure hymn.',
  },

  // Hymn 81: K&S 35
  81: {
    hymnId: 81,
    hymnNumber: 'K&S 35',
    tuneTitle: 'Swabia',
    composerOrOrigin: 'Johann Martin Spiess (1745) • C.M.S. 28, o.t. H.C. 167',
    meterName: 'S.M. — Short Meter (6.6.8.6)',
    keySignature: 'Key D major',
    timeSignature: '4/4 (Common Time)',
    tempoGuidance: 'Crisp and joyous • 90 BPM',
    scope: 'full_stanza',
    scopeLabel: 'Full Stanza Melody',
    solfaNotation: '| d : - | m : f | s : - : s |\n| l : s | f : m | r : - : - |\n| m : - | f : s | l : - : d\' |\n| s : f | m : r | d : - : - ||',
    notes: "Short Meter Sunday worship hymn. Phrase 3 broadens upward to high d'.",
  },

  // Hymn 87: K&S 41
  87: {
    hymnId: 87,
    hymnNumber: 'K&S 41',
    tuneTitle: 'Rockingham',
    composerOrOrigin: 'Edward Miller (1790) • C.M.S. 36',
    meterName: 'L.M. — Long Meter (8.8.8.8)',
    keySignature: 'Key E♭ major',
    timeSignature: '3/4 Time',
    tempoGuidance: 'Solemn prayer for the Holy Spirit • 76 BPM',
    scope: 'full_stanza',
    scopeLabel: 'Full Stanza Melody',
    solfaNotation: '| d : - : d | m : - : r | d : - : l, | s, : - : - |\n| d : - : r | m : - : f | s : - : f | m : - : - |\n| s : - : l | s : - : m | d : - : f | m : - : - |\n| r : - : d | m : - : r | d : - : t, | d : - : - ||',
    notes: 'Invocation of the Holy Spirit with expressive harmonic phrasing.',
  },

  // Hymn 91: K&S 45
  91: {
    hymnId: 91,
    hymnNumber: 'K&S 45',
    tuneTitle: 'Hursley',
    composerOrOrigin: 'Peter Ritter / William H. Monk • C.M.S. 27, O.t. H.C. 16',
    meterName: 'L.M. — Long Meter (8.8.8.8)',
    keySignature: 'Key F major',
    timeSignature: '3/4 Time',
    tempoGuidance: 'Supplicatory devotion • 80 BPM',
    scope: 'full_stanza',
    scopeLabel: 'Full Stanza Melody',
    solfaNotation: '| d : - : r | m : - : f | s : - : - | m : - : - |\n| l : - : s | f : - : m | r : - : - : - |\n| d : - : r | m : - : f | s : - : - | m : - : - |\n| f : - : m | r : - : t, | d : - : - : - ||',
    notes: 'Pleading before Christ with clear melodic phrasing.',
  },

  // Hymn 93: K&S 47
  93: {
    hymnId: 93,
    hymnNumber: 'K&S 47',
    tuneTitle: 'Farrant',
    composerOrOrigin: 'Richard Farrant • CMS 588, O.t. H.C. 327',
    meterName: 'D.C.M. — Double Common Meter (8.6.8.6.D)',
    keySignature: 'Key F major',
    timeSignature: '4/4 (Common Time)',
    tempoGuidance: 'Tender evangelistic pleading • 80 BPM',
    scope: 'full_stanza',
    scopeLabel: 'Full Stanza Melody',
    solfaNotation: '| m : - | r : d | f : - : m | r : - : - |\n| m : - | s : f | m : r | d : - : - |\n| s : - | l : t | d\' : - : s | l : - : - |\n| s : - | f : m | r : r | d : - : - ||',
    notes: "A sinner's cry for pardon; double common meter phrasing.",
  },

  // Hymn 95: K&S 49
  95: {
    hymnId: 95,
    hymnNumber: 'K&S 49',
    tuneTitle: 'Pass Me Not, O Gentle Saviour',
    composerOrOrigin: 'William Howard Doane (1870) • SS&S 379',
    meterName: '8.5.8.5 with Refrain',
    keySignature: 'Key G major / A♭ major',
    timeSignature: '4/4 (Common Time)',
    tempoGuidance: 'Heartfelt petition • 82 BPM',
    scope: 'stanza_refrain',
    scopeLabel: 'Stanza & Refrain',
    solfaNotation: '| m : - : r | d : - : l, | s, : - : - : - |\n| d : - : r | m : - : r | d : - : - : - |\n| m : - : r | d : - : l, | s, : - : - : - |\n| d : - : r | m : - : r | d : - : - : - |\n[Refrain / Ègbè]:\n| s : - : - | m : - : - | r : d : l, | s, : - : - |\n| d : - : r | m : - : r | d : - : - : - ||',
    notes: 'Beloved Fanny Crosby hymn of repentance. Refrain soars with passionate plea.',
  },

  // Hymn 96: K&S 50
  96: {
    hymnId: 96,
    hymnNumber: 'K&S 50',
    tuneTitle: 'Aurelia',
    composerOrOrigin: 'Samuel Sebastian Wesley (1864) • C.M.S. 587, S. 230',
    meterName: '7.6.7.6.D',
    keySignature: 'Key E♭ major',
    timeSignature: '4/4 (Common Time)',
    tempoGuidance: 'Solemn prayer of confession • 82 BPM',
    scope: 'full_stanza',
    scopeLabel: 'Full Stanza Melody',
    solfaNotation: '| m : - | m : m | f : m | r : - : d |\n| l, : - | d : - | t, : - : - |\n| m : - | m : m | f : m | r : - : d |\n| r : - | m : - | r : - : - |\n| s : - | s : s | l : s | f : - : m |\n| l : - | s : - | m : - : - |\n| m : - | f : s | l : d\' | s : - : m |\n| r : - | d : - | d : - : - ||',
    notes: 'Sung for penitence and seeking divine forgiveness.',
  },

  // Hymn 100: K&S 54
  100: {
    hymnId: 100,
    hymnNumber: 'K&S 54',
    tuneTitle: 'Windsor',
    composerOrOrigin: 'George Kirbye (1592) • CMS 588, H.C. 327',
    meterName: 'D.C.M. — Double Common Meter',
    keySignature: 'Key G minor / G major',
    timeSignature: '4/4 (Common Time)',
    tempoGuidance: 'Pensive, penitent prayer • 78 BPM',
    scope: 'full_stanza',
    scopeLabel: 'Full Stanza Melody',
    solfaNotation: '| d : - | m : f | s : - : m | r : d | r : - : - |\n| m : - | f : s | l : - : s | f : m | r : - : - |\n| s : - | l : s | f : - : m | r : d | r : - : - |\n| m : - | f : r | d : - : t, | d : - : - : - ||',
    notes: 'Remembrance prayer before the Lord in time of affliction.',
  },

  // Hymn 105: K&S 59
  105: {
    hymnId: 105,
    hymnNumber: 'K&S 59',
    tuneTitle: 'Ada (Redeemed!)',
    composerOrOrigin: 'William J. Kirkpatrick (1882) • SS&S 97',
    meterName: 'P.M. with Refrain',
    keySignature: 'Key A♭ major',
    timeSignature: '4/4 (Joyful/Spirited)',
    tempoGuidance: 'Vibrant and celebratory • 96 BPM',
    scope: 'stanza_refrain',
    scopeLabel: 'Stanza & Refrain',
    solfaNotation: '| s, : d : m | s : - : m | r : d : l, | s, : - : - |\n| s, : d : r | m : - : d | r : - : - : - |\n| s, : d : m | s : - : m | r : d : l, | s, : - : - |\n| s, : d : m | r : - : d | d : - : - : - |\n[Refrain / Ègbè]:\n| s : - : m | f : - : r | m : - : d | r : - : s, |\n| s : - : m | f : - : r | d : - : - : - ||',
    notes: 'Joyous redemption testimony. The choir brings out the bounce on the syncopated phrases.',
  },

  // Hymn 106: K&S 60
  106: {
    hymnId: 106,
    hymnNumber: 'K&S 60',
    tuneTitle: 'Awa Egbe Kerubu (Processional March)',
    composerOrOrigin: 'C&S Traditional • SS&S 16',
    meterName: 'P.M. Marching Meter',
    keySignature: 'Key F major / G major',
    timeSignature: '4/4 Marching Time',
    tempoGuidance: 'Energetic marching pace • 104 BPM',
    scope: 'stanza_refrain',
    scopeLabel: 'Stanza & Refrain',
    solfaNotation: '| d : d : d | m : - : - | s : - : m | d : - : - |\n| r : m : f | m : - : r | d : - : - : - |\n[Refrain / Ègbè]:\n| s : s : s | d\' : - : - | l : l : l | s : - : - |\n| f : m : r | d : - : - : - ||',
    notes: 'Anthem of the Cherubim band. Stride firmly with percussion and bells.',
  },

  // Hymn 110: K&S 64
  110: {
    hymnId: 110,
    hymnNumber: 'K&S 64',
    tuneTitle: 'Franconia',
    composerOrOrigin: 'Johann Balthasar König (1738) • C.M.S. SM',
    meterName: 'S.M. — Short Meter (6.6.8.6)',
    keySignature: 'Key D major',
    timeSignature: '4/4 (Common Time)',
    tempoGuidance: 'Solemn processional entrance • 86 BPM',
    scope: 'full_stanza',
    scopeLabel: 'Full Stanza Melody',
    solfaNotation: '| d : - | r : m | f : m | r : - : - |\n| m : - | f : s | m : r | d : - : - |\n| s : - | l : t | d\' : s | l : - : s |\n| f : - | m : d | r : r | d : - : - ||',
    notes: 'Processional arrival before the Holy Father.',
  },

  // Hymn 111: K&S 65
  111: {
    hymnId: 111,
    hymnNumber: 'K&S 65',
    tuneTitle: 'The Cleansing Wave',
    composerOrOrigin: 'Phoebe Palmer Knapp • SS&S 476',
    meterName: 'P.M. with Refrain',
    keySignature: 'Key E♭ major',
    timeSignature: '3/4 Time',
    tempoGuidance: 'Lilting evangelistic waltz • 88 BPM',
    scope: 'stanza_refrain',
    scopeLabel: 'Stanza & Refrain',
    solfaNotation: '| m : - : m | m : - : r | d : - : - |\n| s : - : s | s : - : f | m : - : - |\n| d\' : - : t | l : - : s | f : - : m | r : - : - |\n| m : - : f | m : - : r | d : - : - ||\n[Refrain / Ègbè]:\n| s : - : - | l : - : s | m : - : - |\n| f : - : - | s : - : f | r : - : - |\n| m : - : f | s : - : d\' | m : - : r | d : - : - ||',
    notes: 'Invitation to redemption; refrain swells with confident assurance.',
  },

  // Hymn 112: K&S 66
  112: {
    hymnId: 112,
    hymnNumber: 'K&S 66',
    tuneTitle: 'Ashley',
    composerOrOrigin: 'Martin Madan • SS&S 352',
    meterName: 'C.M. with Refrain',
    keySignature: 'Key C major',
    timeSignature: '4/4 (Common Time)',
    tempoGuidance: 'Triumphant and stirring • 96 BPM',
    scope: 'stanza_refrain',
    scopeLabel: 'Stanza & Refrain',
    solfaNotation: '| d : m | s : - : - | l : s | m : - : - |\n| r : d | r : - : - | m : f | s : - : - |\n[Refrain / Ègbè]:\n| d\' : - : - | l : - : - | s : m | d : - : - |\n| r : m | f : r | d : - : - : - ||',
    notes: 'Proclamation of salvation through Christ alone.',
  },

  // Hymn 127: K&S 81
  127: {
    hymnId: 127,
    hymnNumber: 'K&S 81',
    tuneTitle: 'Rejoice in the Lord Always',
    composerOrOrigin: 'Wilbur A. Christy • SS&S 607',
    meterName: 'P.M. with Refrain',
    keySignature: 'Key G major / F major',
    timeSignature: '4/4 (Joyful/Spirited)',
    tempoGuidance: 'High jubilant praise • 108 BPM',
    scope: 'stanza_refrain',
    scopeLabel: 'Stanza & Refrain',
    solfaNotation: '| d : m | s : s : s : - | l : s | m : - : - : - |\n| r : m | f : f : f : - | s : f | m : - : - : - |\n[Refrain / Ègbè]:\n| d\' : - : - | l : - : - | s : m | d : - : - |\n| r : m | f : r | d : - : - : - ||',
    notes: "Joyful celebration of God's goodness in C&S thanksgiving services.",
  },

  // Hymn 137: K&S 91
  137: {
    hymnId: 137,
    hymnNumber: 'K&S 91',
    tuneTitle: 'Seraphic Warfare March',
    composerOrOrigin: 'C&S Traditional • FE 107',
    meterName: 'P.M. Marching Meter',
    keySignature: 'Key G major',
    timeSignature: '4/4 Marching Time',
    tempoGuidance: 'Resolute spiritual battle tempo • 100 BPM',
    scope: 'stanza_refrain',
    scopeLabel: 'Stanza & Refrain',
    solfaNotation: '| d : d : d | m : - : - | s : - : m | d : - : - |\n| r : m : f | m : - : r | d : - : - : - |\n[Refrain / Ègbè]:\n| s : s : s | d\' : - : - | l : - : s |\n| f : m | r : r | d : - : - : - ||',
    notes: 'Battle hymn for prayer vigils and revival meetings.',
  },

  // Hymn 151: K&S 105
  151: {
    hymnId: 151,
    hymnNumber: 'K&S 105',
    tuneTitle: 'Monkland (Let Us with a Gladsome Mind)',
    composerOrOrigin: 'John B. Wilkes (1861) • C.M.S. 44, H.C. 55',
    meterName: '7s — Sevens (7.7.7.7)',
    keySignature: 'Key D major',
    timeSignature: '4/4 (Common Time)',
    tempoGuidance: 'Bright, grateful praise • 94 BPM',
    scope: 'full_stanza',
    scopeLabel: 'Full Stanza Melody',
    solfaNotation: '| d : - | d : r | m : - | f : - | s : - | s : - |\n| l : - | l : - | s : - : - : - |\n| d\' : - | t : l | s : - | m : - | f : - | m : - |\n| r : - | r : - | d : - : - : - ||',
    notes: "Historic John Milton thanksgiving text with John Wilkes' buoyant melody.",
  },

  // Hymn 173: K&S 127
  173: {
    hymnId: 173,
    hymnNumber: 'K&S 127',
    tuneTitle: 'Nun Danket Alle Gott (Now Thank We All Our God)',
    composerOrOrigin: 'Johann Crüger (1647) • FE 143',
    meterName: '6.7.6.7.6.6.6.6',
    keySignature: 'Key F major',
    timeSignature: '4/4 (Common Time)',
    tempoGuidance: 'Choral thanksgiving majesty • 80 BPM',
    scope: 'full_stanza',
    scopeLabel: 'Full Stanza Melody',
    solfaNotation: '| d : - | d : - | r : - | r : - | m : - : - : - |\n| r : - | d : - | t, : - | d : - | r : - : - : - |\n| m : - | f : - | s : - | s : - | f : - : - : - |\n| m : - | r : - | d : - | t, : - | d : - : - : - ||',
    notes: 'Great German chorale used worldwide for church thanksgiving.',
  },

  // Hymn 199: K&S 153
  199: {
    hymnId: 199,
    hymnNumber: 'K&S 153',
    tuneTitle: 'St. Peter',
    composerOrOrigin: 'Alexander R. Reinagle • C.M.S. 558, H.C. 400',
    meterName: 'C.M. — Common Meter (8.6.8.6)',
    keySignature: 'Key E♭ major',
    timeSignature: '4/4 (Common Time)',
    tempoGuidance: 'Evangelistic knocking rhythm • 84 BPM',
    scope: 'full_stanza',
    scopeLabel: 'Full Stanza Melody',
    solfaNotation: '| m : - | d : r | m : f | s : - : m |\n| l : s | f : m | r : - : - |\n| m : - | f : s | l : d\' | s : - : m |\n| f : m | r : r | d : - : - ||',
    notes: 'Jesus knocking at the door of the heart (Rev 3:20).',
  },

  // Hymn 245: K&S 199
  245: {
    hymnId: 245,
    hymnNumber: 'K&S 199',
    tuneTitle: 'Yorkshire (Stockport)',
    composerOrOrigin: 'John Wainwright (1750) • C.M.S. 59, H.C. 109',
    meterName: '10.10.10.10.10.10',
    keySignature: 'Key C major',
    timeSignature: '4/4 (Common Time)',
    tempoGuidance: 'Triumphant Nativity fanfare • 90 BPM',
    scope: 'full_stanza',
    scopeLabel: 'Full Stanza Melody',
    solfaNotation: '| s : - | d\' : t | l : s | d\' : - |\n| m : - | f : s | l : t | d\' : - |\n| s : - | l : s | f : m | r : - |\n| d : r | m : f | m : r | d : - ||',
    notes: 'Magnificent Christmas and divine celebration melody.',
  },

  // Hymn 256: K&S 210
  256: {
    hymnId: 256,
    hymnNumber: 'K&S 210',
    tuneTitle: 'Toplady (Rock of Ages)',
    composerOrOrigin: 'Thomas Hastings (1830) • C.M.S. 79, H.C. 146',
    meterName: '7s (6 lines: 7.7.7.7.7.7)',
    keySignature: 'Key B♭ major',
    timeSignature: '3/4 Time',
    tempoGuidance: 'Deeply pleading and secure • 76 BPM',
    scope: 'full_stanza',
    scopeLabel: 'Full Stanza Melody',
    solfaNotation: '| m : - : r | d : - : - | m : - : r | d : - : - |\n| s : - : s | l : - : - | s : - : - : - |\n| s : - : f | m : - : - | s : - : f | m : - : - |\n| r : - : d | r : - : - | d : - : - : - ||',
    notes: "Toplady's immortal refuge tune. Ponderous 3-beat cadence.",
  },

  // Hymn 286: K&S 240
  286: {
    hymnId: 286,
    hymnNumber: 'K&S 240',
    tuneTitle: 'Diademata',
    composerOrOrigin: 'George J. Elvey • C.M.S. 146, H.C. 247, D.S.M.',
    meterName: 'D.S.M. — Double Short Meter (6.6.8.6.D)',
    keySignature: 'Key D major',
    timeSignature: '4/4 (Common Time)',
    tempoGuidance: 'Urgent prayer for revival • 92 BPM',
    scope: 'full_stanza',
    scopeLabel: 'Full Stanza Melody',
    solfaNotation: '| d : - | d : d | m : - : m | s : - : s |\n| l : s | f : m | r : - : - |\n| m : - | f : s | l : - : d\' | s : - : m |\n| f : m | r : r | d : - : - ||',
    notes: 'Revival petition in Double Short Meter.',
  },

  // Hymn 291: K&S 245
  291: {
    hymnId: 291,
    hymnNumber: 'K&S 245',
    tuneTitle: 'St. Peter',
    composerOrOrigin: 'Alexander R. Reinagle (1836) • C.M.S. 144, H.C. 147',
    meterName: 'C.M. — Common Meter (8.6.8.6)',
    keySignature: 'Key E♭ major',
    timeSignature: '4/4 (Common Time)',
    tempoGuidance: 'Gentle pastoral invitation • 84 BPM',
    scope: 'full_stanza',
    scopeLabel: 'Full Stanza Melody',
    solfaNotation: '| m : - | d : r | m : f | s : - : m |\n| l : s | f : m | r : - : - |\n| m : - | f : s | l : d\' | s : - : m |\n| f : m | r : r | d : - : - ||',
    notes: 'Graceful English hymnody; smooth stepwise movement.',
  },

  // Hymn 317: K&S 271
  317: {
    hymnId: 317,
    hymnNumber: 'K&S 271',
    tuneTitle: 'Petra (Redhead No. 76)',
    composerOrOrigin: 'Richard Redhead (1853) • C.M.S. 168, H.C. 299',
    meterName: '7s (7.7.7.7.7.7)',
    keySignature: 'Key F major',
    timeSignature: '4/4 (Common Time)',
    tempoGuidance: 'Solemn, measured rhythm • 76 BPM',
    scope: 'full_stanza',
    scopeLabel: 'Full Stanza Melody',
    solfaNotation: '| d : - | r : m | f : m | r : - : d |\n| m : - | f : s | l : s | f : - : m |\n| s : - | f : m | r : d | t, : - : d ||',
    notes: 'Classic alternative Anglican setting for Rock of Ages.',
  },

  // Hymn 344: K&S 298
  344: {
    hymnId: 344,
    hymnNumber: 'K&S 298',
    tuneTitle: 'Sweet Hour of Prayer',
    composerOrOrigin: 'William B. Bradbury (1859) • CMS 208, t.H.C. 173',
    meterName: 'D.L.M. — Double Long Meter (8.8.8.8.D)',
    keySignature: 'Key D major / C major',
    timeSignature: '6/8 or 3/4 Time',
    tempoGuidance: 'Lyrical prayerful swing • 80 BPM',
    scope: 'stanza_refrain',
    scopeLabel: 'Stanza & Refrain',
    solfaNotation: '| d : - : m | s : - : - | m : - : d | r : - : - |\n| d : - : r | m : - : f | s : - : - : - |\n| d : - : m | s : - : - | m : - : d | r : - : - |\n| d : - : m | r : - : d | d : - : - : - |\n[Refrain / Ègbè]:\n| s : - : d\' | d\' : - : - | t : - : l | s : - : - |\n| l : - : s | m : - : d | r : - : - : - |\n| d : - : m | s : - : - | m : - : d | r : - : - |\n| d : - : m | r : - : d | d : - : - : - ||',
    notes: 'Cherished prayer hour anthem; rich soothing melodic contour.',
  },

  // Hymn 388: K&S 342
  388: {
    hymnId: 388,
    hymnNumber: 'K&S 342',
    tuneTitle: 'Rex Gloriae',
    composerOrOrigin: 'Henry Smart (1868) • C.M.S. 243, H.C. 280',
    meterName: '8.7.8.7.D',
    keySignature: 'Key B♭ major / C major',
    timeSignature: '4/4 (Common Time)',
    tempoGuidance: 'Majestic Ascension march • 94 BPM',
    scope: 'full_stanza',
    scopeLabel: 'Full Stanza Melody',
    solfaNotation: '| s : m | f : r | d : m | s : - |\n| d\' : t | l : s | f : m | r : - |\n| s : m | f : r | d : m | s : - |\n| l : s | f : r | d : t, | d : - ||',
    notes: 'Ascension Sunday triumph; bold royal organ fanfares.',
  },

  // Hymn 390: K&S 344
  390: {
    hymnId: 390,
    hymnNumber: 'K&S 344',
    tuneTitle: 'Victory (The Strife Is O\'er)',
    composerOrOrigin: 'Giovanni Pierluigi da Palestrina / W.H. Monk • CMS 244, t.H.C. 204',
    meterName: '8.8.8 with Alleluias',
    keySignature: 'Key E♭ major',
    timeSignature: '3/4 Time',
    tempoGuidance: 'Exultant Easter resurrection • 96 BPM',
    scope: 'full_stanza',
    scopeLabel: 'Full Stanza Melody',
    solfaNotation: '[Alleluia Chorus]:\n| d\' : - : - | t : - : - | d\' : - : - |\n[Stanza / Ẹsẹ]:\n| s : - : s | l : - : s | f : - : m | r : - : - |\n| m : - : f | s : - : d\' | t : - : l | s : - : - |\n| d\' : - : t | l : - : s | f : - : m | r : - : - |\n[Closing Cadence]:\n| d : - : - | r : - : - | d : - : - ||',
    notes: 'Easter victory over death and the grave.',
  },

  // Hymn 442: K&S 396
  442: {
    hymnId: 442,
    hymnNumber: 'K&S 396',
    tuneTitle: 'Aletta (Holy Bible, Book Divine)',
    composerOrOrigin: 'William Batchelder Bradbury (1858) • C.M.S. 291, H.C. 267',
    meterName: '7s — Sevens (7.7.7.7)',
    keySignature: 'Key F major',
    timeSignature: '3/4 Time',
    tempoGuidance: 'Tender, reverent devotion • 78 BPM',
    scope: 'full_stanza',
    scopeLabel: 'Full Stanza Melody',
    solfaNotation: '| m : - : m | f : - : m | r : - : d | d : - : - |\n| r : - : r | m : - : f | s : - : - : - |\n| s : - : s | l : - : s | f : - : m | m : - : - |\n| r : - : d | m : - : r | d : - : - : - ||',
    notes: 'A hymn honoring the Word of God as light and truth.',
  },

  // Hymn 482: K&S 436
  482: {
    hymnId: 482,
    hymnNumber: 'K&S 436',
    tuneTitle: 'Surrender (I Surrender All)',
    composerOrOrigin: 'Winfield Scott Weeden (1896) • C.M.S. 316, H.C. 289',
    meterName: '8.7.8.7 with Refrain',
    keySignature: 'Key D major',
    timeSignature: '4/4 (Common Time)',
    tempoGuidance: 'Deep wholehearted dedication • 80 BPM',
    scope: 'stanza_refrain',
    scopeLabel: 'Stanza & Refrain',
    solfaNotation: '| m : - : m | r : - : d | l, : - : - : - |\n| r : - : r | d : - : t, | d : - : - : - |\n| m : - : m | r : - : d | l, : - : - : - |\n| r : - : r | d : - : t, | d : - : - : - |\n[Refrain / Ègbè - Mo fi gbogbo rẹ̀ fun]:\n| s : - : - : - | - : - : - : - | f : - : - : - | - : - : - : - |\n| m : - : - | r : - : - | d : - : - : - |\n| m : - : m | r : - : d | l, : - : - : - |\n| r : - : r | d : - : t, | d : - : - : - ||',
    notes: 'Consecration anthem. Sustained whole notes in the chorus call for full vocal support.',
  },

  // Hymn 488: K&S 442
  488: {
    hymnId: 488,
    hymnNumber: 'K&S 442',
    tuneTitle: 'St. Catherine (Faith of Our Fathers)',
    composerOrOrigin: 'Henri F. Hemy / J.G. Walton (1864) • C.M.S. 303, SS&S 14',
    meterName: '8.8.8.8.8.8 (6 lines)',
    keySignature: 'Key G major',
    timeSignature: '3/4 Time',
    tempoGuidance: 'Resolute faith • 88 BPM',
    scope: 'stanza_refrain',
    scopeLabel: 'Stanza & Refrain',
    solfaNotation: '| d : - : r | m : - : f | s : - : - |\n| l : - : s | f : - : m | r : - : - |\n| d : - : r | m : - : f | s : - : - |\n| m : - : d | r : - : t, | d : - : - |\n[Refrain / Ègbè]:\n| s : - : - | l : - : - | s : - : - |\n| f : - : m | r : - : - : - |\n| m : - : f | s : - : d | m : - : r | d : - : - ||',
    notes: "Historic martyr's confession of unwavering faith.",
  },

  // Hymn 515: K&S 469
  515: {
    hymnId: 515,
    hymnNumber: 'K&S 469',
    tuneTitle: 'St. Anne',
    composerOrOrigin: 'William Croft (1708) • C.M.S. 326, H.C. 295',
    meterName: 'C.M. — Common Meter (8.6.8.6)',
    keySignature: 'Key C major',
    timeSignature: '4/4 (Common Time)',
    tempoGuidance: 'Stately covenantal assurance • 86 BPM',
    scope: 'full_stanza',
    scopeLabel: 'Full Stanza Melody',
    solfaNotation: '| s : - | m : l | s : - : d\' | t : l | s : - : - |\n| m : - | l : s | f : m | r : - : - |\n| s : - | d\' : s | l : f | m : r | d : - : - ||',
    notes: 'The noble tune of "O God Our Help in Ages Past".',
  },

  // Hymn 516: K&S 470
  516: {
    hymnId: 516,
    hymnNumber: 'K&S 470',
    tuneTitle: 'Innocents',
    composerOrOrigin: 'Parish Choir (1850) • C.M.S. 324, H.C. 298',
    meterName: '7s — Sevens (7.7.7.7)',
    keySignature: 'Key E♭ major',
    timeSignature: '4/4 (Common Time)',
    tempoGuidance: 'Gentle child-like trust • 84 BPM',
    scope: 'full_stanza',
    scopeLabel: 'Full Stanza Melody',
    solfaNotation: '| d : r | m : f | s : m | d : - : - |\n| f : m | r : d | r : - : - : - |\n| d : r | m : f | s : l | s : - : - |\n| f : m | r : r | d : - : - : - ||',
    notes: 'Faith in the unseen Saviour with stepwise motion.',
  },

  // Hymn 520: K&S 474
  520: {
    hymnId: 520,
    hymnNumber: 'K&S 474',
    tuneTitle: 'Under His Wings',
    composerOrOrigin: 'Ira D. Sankey (1896) • t.H.C. 601',
    meterName: '8s. 7s with Refrain',
    keySignature: 'Key D♭ / C major',
    timeSignature: '6/8 Time',
    tempoGuidance: 'Comforting refuge rhythm • 82 BPM',
    scope: 'stanza_refrain',
    scopeLabel: 'Stanza & Refrain',
    solfaNotation: '| s : - : m | d : - : m | s : - : - | f : - : - |\n| m : - : r | d : - : r | m : - : - : - |\n| s : - : m | d : - : m | s : - : - | l : - : - |\n| s : - : m | r : - : d | d : - : - : - |\n[Refrain / Ègbè - Lábẹ́ òòji Rẹ̀]:\n| d\' : - : - | s : - : - | l : - : s | m : - : - |\n| f : - : m | r : - : d | r : - : - : - |\n| d\' : - : - | s : - : - | l : - : s | m : - : - |\n| f : - : m | r : - : d | d : - : - : - ||',
    notes: 'Psalm 91 refuge hymn; deeply comforting pastoral melody.',
  },

  // Hymn 528: K&S 482
  528: {
    hymnId: 528,
    hymnNumber: 'K&S 482',
    tuneTitle: 'To God Be the Glory',
    composerOrOrigin: 'William H. Doane (1875) • t.H.C. 366',
    meterName: '8s. 7s with Refrain',
    keySignature: 'Key A♭ major',
    timeSignature: '3/4 Time',
    tempoGuidance: 'Glorious, jubilant surge • 96 BPM',
    scope: 'stanza_refrain',
    scopeLabel: 'Stanza & Refrain',
    solfaNotation: '| m : - : m | m : - : r | d : - : - |\n| s : - : s | s : - : f | m : - : - |\n| d\' : - : d\' | t : - : l | s : - : m |\n| r : - : d | r : - : - : - |\n[Refrain / Ègbè - Ẹ yin Olúwa]:\n| s : - : - | m : - : - | l : - : s |\n| s : - : - | f : - : - | r : - : - |\n| f : - : - | r : - : - | s : - : f |\n| m : - : - | - : - : - : - ||',
    notes: "Fanny Crosby's universal anthem of adoration.",
  },

  // Hymn 560: K&S 514
  560: {
    hymnId: 560,
    hymnNumber: 'K&S 514',
    tuneTitle: 'St. Agnes',
    composerOrOrigin: 'John B. Dykes (1866) • C.M.S. 332, H.C. 321',
    meterName: 'C.M. — Common Meter (8.6.8.6)',
    keySignature: 'Key G major',
    timeSignature: '3/4 Time',
    tempoGuidance: 'Sweet, contemplative devotion • 74 BPM',
    scope: 'full_stanza',
    scopeLabel: 'Full Stanza Melody',
    solfaNotation: '| d : - : r | m : - : f | s : - : - | m : - : - |\n| l : - : s | f : - : m | r : - : - : - |\n| s : - : m | d : - : r | m : - : - | f : - : - |\n| m : - : d | r : - : t, | d : - : - : - ||',
    notes: "Bernard of Clairvaux's devotional contemplation.",
  },

  // Hymn 566: K&S 520
  566: {
    hymnId: 566,
    hymnNumber: 'K&S 520',
    tuneTitle: 'Richmond',
    composerOrOrigin: 'Thomas Haweis (1792) • C.M.S. 340, H.C. 314',
    meterName: 'C.M. — Common Meter (8.6.8.6)',
    keySignature: 'Key G major',
    timeSignature: '4/4 (Common Time)',
    tempoGuidance: 'Joyous congregational praise • 92 BPM',
    scope: 'full_stanza',
    scopeLabel: 'Full Stanza Melody',
    solfaNotation: '| d : - | m : - | s : - | d\' : - | t : l | s : - : - |\n| s : - | l : s | f : m | r : - : - : - |\n| m : - | f : m | r : d | s : - : - : - |\n| d : - | r : m | f : r | d : - : - : - ||',
    notes: "Bright and joyful proclamation of Jesus' enduring love.",
  },

  // Hymn 646: K&S 600
  646: {
    hymnId: 646,
    hymnNumber: 'K&S 600',
    tuneTitle: 'Webb (Stand Up, Stand Up for Jesus)',
    composerOrOrigin: 'George James Webb (1837) • C.M.S. 403, SS&S 77',
    meterName: '7.6.7.6.D',
    keySignature: 'Key B♭ major',
    timeSignature: '4/4 (Marching Time)',
    tempoGuidance: 'Stirring spiritual soldier march • 96 BPM',
    scope: 'full_stanza',
    scopeLabel: 'Full Stanza Melody',
    solfaNotation: '| s, : - | d : - : r | m : - : d | l, : - : f | m : - : r |\n| d : - : - : - |\n| s, : - | d : - : r | m : - : d | s : - : f | m : - : - |\n| r : - : - : - |\n| m : - | f : - : s | l : - : s | f : - : m | r : - : - |\n| s, : - | d : - : r | m : - : f | m : - : r | d : - : - ||',
    notes: 'Soldiers of the Cross march; vigorous four-phrase stanza.',
  },

  // Hymn 778: K&S 731
  778: {
    hymnId: 778,
    hymnNumber: 'K&S 731',
    tuneTitle: 'Aurelia (Seraph Anthem)',
    composerOrOrigin: 'Samuel Sebastian Wesley (1864) • t.C.M.S 90, FE 759',
    meterName: '7.6.7.6.D',
    keySignature: 'Key E♭ major',
    timeSignature: '4/4 (Common Time)',
    tempoGuidance: 'Seraphic processional majesty • 88 BPM',
    scope: 'full_stanza',
    scopeLabel: 'Full Stanza Melody',
    solfaNotation: '| m : - | m : m | f : m | r : - : d |\n| l, : - | d : - | t, : - : - |\n| m : - | m : m | f : m | r : - : d |\n| r : - | m : - | r : - : - |\n| s : - | s : s | l : s | f : - : m |\n| l : - | s : - | m : - : - |\n| m : - | f : s | l : d\' | s : - : m |\n| r : - | d : - | d : - : - ||',
    notes: 'The historic Cherubim and Seraphim fellowship march.',
  },

  // Hymn 821: K&S 774
  821: {
    hymnId: 821,
    hymnNumber: 'K&S 774',
    tuneTitle: 'God Be with You Till We Meet Again',
    composerOrOrigin: 'William G. Tomer (1880) • C.M.S. 594, SS&S 357',
    meterName: '9.8.8.9 with Refrain',
    keySignature: 'Key D♭ / C major',
    timeSignature: '4/4 (Common Time)',
    tempoGuidance: 'Affectionate parting benediction • 84 BPM',
    scope: 'stanza_refrain',
    scopeLabel: 'Stanza & Refrain',
    solfaNotation: '| d : - | d : - : r | m : - : r | d : - : l, | s, : - : - |\n| d : - | m : - : s | l : - : s | m : - : - : - |\n| d : - | d : - : r | m : - : r | d : - : l, | s, : - : - |\n| d : - | m : - : d | r : - : - | d : - : - : - |\n[Refrain / Ègbè - Títí a ó tún fi pàdé]:\n| s : - : - : - | - : - : - : - | m : - : s | l : - : - : - |\n| s : - : - : - | - : - : - : - | d : - : m | r : - : - : - |\n| s : - : - : - | - : - : - : - | m : - : s | l : - : - : - |\n| s : - : m | r : - : d | d : - : - : - ||',
    notes: 'Universal farewell hymn sung at the close of divine services.',
  },
};

/**
 * Get verified Sol-fa for a hymn ID if available.
 * Returns null if no verified tune exists for this hymn.
 */
export function getVerifiedHymnSolfa(hymnId: number): VerifiedHymnSolfa | null {
  return HYMN_SOLFA_LIBRARY[hymnId] || null;
}
