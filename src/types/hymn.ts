export interface Stanza {
  number: string;
  text: string;
  chorus: string;
}

export interface Hymn {
  id: number;
  hymn_number: string;
  title: string;
  category_id: number;
  category_name: string;
  meter: string;
  scripture: string;
  stanzas: Stanza[];
  amen: string;
}

export interface Category {
  id: number;
  number: string;
  name: string;
  range: string;
  hymnCount: number;
}

export interface HymnDatabase {
  metadata: {
    title: string;
    total_hymns: number;
    total_categories: number;
  };
  categories: Category[];
  hymns: Hymn[];
}

export type ThemeMode = 'light' | 'dark' | 'sepia';

export interface Setlist {
  id: string;
  name: string;
  description?: string;
  createdAt: number;
  hymnIds: number[];
}
