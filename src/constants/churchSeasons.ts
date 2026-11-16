export interface ChurchSeason {
  id: string;
  name: string;
  yorubaName: string;
  periodDescription: string;
  scriptureTheme: string;
  color: string;
  icon: string;
  hymnIds: number[];
  description: string;
}

/**
 * Liturgical and Sacred Church Seasons for Cherubim & Seraphim Worship.
 * (Curated specifically excluding Mount Taborah and Holy Gabriel's day per instructions).
 */
export const CHURCH_SEASONS: ChurchSeason[] = [
  {
    id: 'lent',
    name: 'Lent & Passion Week',
    yorubaName: 'Akoko Aawẹ & Ọsẹ Ìyà Kristi',
    periodDescription: '40 Days of Prayer, Fasting & Penitence before Easter',
    scriptureTheme: 'Matthew 4:1–2 • Joel 2:12–13',
    color: '#8B5CF6',
    icon: 'hourglass-outline',
    description:
      'A sacred season of deep spiritual reflection, self-denial, repentance, and meditation on Christ’s suffering and ultimate sacrifice on Calvary.',
    hymnIds: [436, 91, 370, 371, 374, 380, 385, 390],
  },
  {
    id: 'easter',
    name: 'Easter & Resurrection',
    yorubaName: 'Àjíǹde Olúwa Wa',
    periodDescription: 'Celebration of Christ’s Triumphant Victory over Death',
    scriptureTheme: '1 Corinthians 15:55–57 • Matthew 28:5–6',
    color: '#10B981',
    icon: 'sunny-outline',
    description:
      'The supreme Christian celebration of the Risen Christ, victorious over the grave, securing eternal life for all believers.',
    hymnIds: [256, 257, 258, 260, 262, 265],
  },
  {
    id: 'pentecost',
    name: 'Pentecost & Holy Spirit',
    yorubaName: 'Ọjọ́ Pẹ́ńtíkọ́sítì & Ẹ̀mí Mímọ́',
    periodDescription: 'Outpouring of the Holy Spirit & Divine Power',
    scriptureTheme: 'Acts 2:1–4 • Joel 2:28',
    color: '#F59E0B',
    icon: 'flame-outline',
    description:
      'Celebrating the descent of the Holy Spirit with heavenly fire, empowering the church with gifts, healing, and divine guidance.',
    hymnIds: [269, 270, 272, 275, 501, 502],
  },
  {
    id: 'harvest',
    name: 'Harvest & Thanksgiving',
    yorubaName: 'Ọdún Ìkórè & Ọpẹ́ Gbogbogbò',
    periodDescription: 'Celebration of Bountiful Provision & Divine Blessings',
    scriptureTheme: 'Psalm 107:1 • Galatians 6:9',
    color: '#D97706',
    icon: 'leaf-outline',
    description:
      'Festive thanksgiving for God’s faithful supply throughout the year, rejoicing with tithes, offerings, and congregational joy.',
    hymnIds: [85, 95, 760, 761, 762, 765, 768],
  },
  {
    id: 'advent_christmas',
    name: 'Advent & Christmas',
    yorubaName: 'Ìbẹ̀wò & Ìbí Olùgbàlà',
    periodDescription: 'Birth of our Lord and Savior Jesus Christ',
    scriptureTheme: 'Isaiah 9:6 • Luke 2:10–14',
    color: '#EC4899',
    icon: 'star-outline',
    description:
      'Proclaiming the joy of the Incarnation—God dwelling with man in Christ Jesus, bringing light into the world’s darkness.',
    hymnIds: [245, 246, 248, 250, 252, 254],
  },
  {
    id: 'new_year',
    name: 'New Year & Watchnight',
    yorubaName: 'Ìṣọ́ Ọdún Titun & Ọpẹ́ Ìkẹ́yìn',
    periodDescription: 'Cross-over Vigil & Dedication of the New Year',
    scriptureTheme: 'Psalm 90:12 • Lamentations 3:22–23',
    color: '#3B82F6',
    icon: 'time-outline',
    description:
      'Standing in holy vigil to thank God for surviving the outgoing year and consecrating homes and church under His covenant for the new year.',
    hymnIds: [800, 801, 805, 808, 810, 812],
  },
  {
    id: 'seraphic_anniversary',
    name: 'Seraphic Anniversary',
    yorubaName: 'Ọdún Ẹgbẹ́ Séráfù',
    periodDescription: 'Founding of the Holy Order of C&S (September)',
    scriptureTheme: 'Isaiah 6:1–3 • Revelation 4:8',
    color: '#0284C7',
    icon: 'shield-checkmark-outline',
    description:
      'Celebrating the sacred heritage, calling, and enduring prayer ministry of the Cherubim and Seraphim Church worldwide.',
    hymnIds: [97, 98, 99, 100, 102, 103],
  },
];
