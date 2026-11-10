export interface PresetHymn {
  id: number;
  part: string;
}

export interface LiturgicalPreset {
  id: string;
  title: string;
  yorubaTitle: string;
  tagline: string;
  description: string;
  icon: 'sunny-outline' | 'heart-half-outline' | 'moon-outline' | 'flame-outline' | 'trophy-outline';
  accentColor: string;
  hymns: PresetHymn[];
}

export const LITURGICAL_PRESETS: LiturgicalPreset[] = [
  {
    id: 'sunday_divine_service',
    title: 'Sunday Worship Service',
    yorubaTitle: 'Ètò Ìjọ́sìn Ọjọ́ Ìsinmi',
    tagline: 'Standard Order of Sunday Morning Worship',
    description: 'Processional, kneeling prayers, scripture sermon, thanksgiving offerings, and recessional blessing.',
    icon: 'sunny-outline',
    accentColor: '#D4AF37',
    hymns: [
      { id: 46, part: 'Processional / Ìwọlé (K&S 1)' },
      { id: 1, part: 'Akúnlẹkọ / Kneeling Prayer (K&S i)' },
      { id: 66, part: 'Worship / Ọjọ́ Ìsinmi (K&S 20)' },
      { id: 442, part: 'Sermon / Ọ̀rọ̀ Ìyè (K&S 396)' },
      { id: 127, part: 'Thanksgiving & Offering / Ọpẹ́ (K&S 81)' },
      { id: 821, part: 'Recessional / Ìjáde (K&S 774)' },
    ],
  },
  {
    id: 'wednesday_mercy_service',
    title: 'Wednesday Mercy Service',
    yorubaTitle: 'Àdúrà Àánú / Ọjọ́ Ẹkún',
    tagline: 'Supplication, Repentance & Divine Grace',
    description: 'Deep supplication before the Mercy Seat, seeking divine forgiveness, healing, and open heavens.',
    icon: 'heart-half-outline',
    accentColor: '#3B82F6',
    hymns: [
      { id: 4, part: 'Akúnlẹkọ / Kneeling (K&S iv)' },
      { id: 91, part: 'Repentance & Grace (K&S 45)' },
      { id: 105, part: 'Redemption & Mercy (K&S 59)' },
      { id: 455, part: 'Prayer in the Storm (K&S 409)' },
      { id: 525, part: 'Cry for Divine Favour (K&S 479)' },
      { id: 819, part: 'Parting Blessing (K&S 772)' },
    ],
  },
  {
    id: 'friday_vigil_service',
    title: 'Friday Night Vigil',
    yorubaTitle: 'Ìṣọ́ Ọjọ́ Ẹtì (Night of Power)',
    tagline: 'Midnight Warfare, Angelic Protection & Victory',
    description: 'Midnight warfare songs, Angelic defense, Seraphic fellowship, and welcoming the dawn with praise.',
    icon: 'moon-outline',
    accentColor: '#8B5CF6',
    hymns: [
      { id: 54, part: 'Evening Entrance (K&S 9)' },
      { id: 14, part: 'Akúnlẹkọ / Warfare Prayer (K&S xiv)' },
      { id: 520, part: 'Divine Fortress & Shelter (K&S 474)' },
      { id: 778, part: 'Seraphic Army (K&S 731)' },
      { id: 482, part: 'Complete Surrender (K&S 436)' },
      { id: 46, part: 'Dawn / Òwúrọ̀ Praise (K&S 1)' },
    ],
  },
  {
    id: 'revival_holy_spirit',
    title: 'Revival & Holy Ghost Songs',
    yorubaTitle: 'Ètò Ìsọjí Ẹ̀mí Mímọ́',
    tagline: 'Pentecostal Fire, Soul Awakening & Joy',
    description: 'High-energy revival choruses, spiritual awakening, and celebration of the Holy Spirit.',
    icon: 'flame-outline',
    accentColor: '#EF4444',
    hymns: [
      { id: 199, part: 'Holy Spirit Power (K&S 153)' },
      { id: 915, part: 'Revival Chorus (Ìsọjí 2)' },
      { id: 920, part: 'Holy Dove (Ìsọjí 7)' },
      { id: 145, part: 'Seraphic Host Praise (K&S 99)' },
      { id: 776, part: 'Soldiers of Salvation (K&S 729)' },
    ],
  },
  {
    id: 'thanksgiving_adoption',
    title: 'Thanksgiving & Adoption',
    yorubaTitle: 'Ètò Ìdúpẹ́ ati Ìgbani',
    tagline: 'Church Anniversary, Band Adoption & Harvest',
    description: 'Hymns of boundless gratitude, band anniversaries, harvest celebrations, and dedication of members.',
    icon: 'trophy-outline',
    accentColor: '#10B981',
    hymns: [
      { id: 127, part: 'Joyful Thanksgiving (K&S 81)' },
      { id: 145, part: 'Praise of Séráfù (K&S 99)' },
      { id: 777, part: 'Victorious Michael (K&S 730)' },
      { id: 778, part: 'Band Dedication (K&S 731)' },
      { id: 821, part: 'Closing Benediction (K&S 774)' },
    ],
  },
];
