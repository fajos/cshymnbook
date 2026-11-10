import AsyncStorage from '@react-native-async-storage/async-storage';
import { ThemeMode, Setlist } from '../types/hymn';

const KEYS = {
  FAVORITES: '@cshymnbook_favorites',
  THEME: '@cshymnbook_theme',
  FONT_SIZE: '@cshymnbook_font_size',
  RECENTS: '@cshymnbook_recents',
  SETLISTS: '@cshymnbook_setlists',
};

export const storageService = {
  // Favorites
  async getFavorites(): Promise<number[]> {
    try {
      const data = await AsyncStorage.getItem(KEYS.FAVORITES);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  async toggleFavorite(hymnId: number): Promise<boolean> {
    try {
      const favs = await this.getFavorites();
      const exists = favs.includes(hymnId);
      const updated = exists ? favs.filter((id) => id !== hymnId) : [...favs, hymnId];
      await AsyncStorage.setItem(KEYS.FAVORITES, JSON.stringify(updated));
      return !exists;
    } catch {
      return false;
    }
  },

  // Theme
  async getTheme(): Promise<ThemeMode> {
    try {
      const theme = await AsyncStorage.getItem(KEYS.THEME);
      return (theme as ThemeMode) || 'light';
    } catch {
      return 'light';
    }
  },

  async setTheme(theme: ThemeMode): Promise<void> {
    try {
      await AsyncStorage.setItem(KEYS.THEME, theme);
    } catch {}
  },

  // Font Size
  async getFontSize(): Promise<number> {
    try {
      const size = await AsyncStorage.getItem(KEYS.FONT_SIZE);
      return size ? parseInt(size, 10) : 18;
    } catch {
      return 18;
    }
  },

  async setFontSize(size: number): Promise<void> {
    try {
      await AsyncStorage.setItem(KEYS.FONT_SIZE, size.toString());
    } catch {}
  },

  // Recently Viewed
  async getRecents(): Promise<number[]> {
    try {
      const data = await AsyncStorage.getItem(KEYS.RECENTS);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  async addRecent(hymnId: number): Promise<void> {
    try {
      const recents = await this.getRecents();
      const filtered = recents.filter((id) => id !== hymnId);
      const updated = [hymnId, ...filtered].slice(0, 30);
      await AsyncStorage.setItem(KEYS.RECENTS, JSON.stringify(updated));
    } catch {}
  },

  // Setlists / Collections
  async getSetlists(): Promise<Setlist[]> {
    try {
      const data = await AsyncStorage.getItem(KEYS.SETLISTS);
      if (data) return JSON.parse(data);
      // Default setlists
      const defaults: Setlist[] = [
        {
          id: 'sunday_morning_service',
          name: 'Sunday Morning Service',
          description: 'Hymns for Sunday Divine Service',
          createdAt: Date.now(),
          hymnIds: [46, 60, 100, 150], // Owuro 1, etc.
        },
      ];
      await AsyncStorage.setItem(KEYS.SETLISTS, JSON.stringify(defaults));
      return defaults;
    } catch {
      return [];
    }
  },

  async saveSetlists(setlists: Setlist[]): Promise<void> {
    try {
      await AsyncStorage.setItem(KEYS.SETLISTS, JSON.stringify(setlists));
    } catch {}
  },

  async createSetlist(name: string, description?: string): Promise<Setlist> {
    return this.createSetlistWithHymns(name, description, []);
  },

  async createSetlistWithHymns(
    name: string,
    description?: string,
    hymnIds: number[] = []
  ): Promise<Setlist> {
    const setlists = await this.getSetlists();
    const newSetlist: Setlist = {
      id: `setlist_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name: name.trim(),
      description: description?.trim() || '',
      createdAt: Date.now(),
      hymnIds: Array.from(new Set(hymnIds)),
    };
    const updated = [newSetlist, ...setlists];
    await this.saveSetlists(updated);
    return newSetlist;
  },

  async deleteSetlist(id: string): Promise<void> {
    try {
      const setlists = await this.getSetlists();
      const updated = setlists.filter((s) => s.id !== id);
      await this.saveSetlists(updated);
    } catch {}
  },

  async addHymnToSetlist(setlistId: string, hymnId: number): Promise<void> {
    try {
      const setlists = await this.getSetlists();
      const target = setlists.find((s) => s.id === setlistId);
      if (target && !target.hymnIds.includes(hymnId)) {
        target.hymnIds.push(hymnId);
        await this.saveSetlists(setlists);
      }
    } catch {}
  },

  async removeHymnFromSetlist(setlistId: string, hymnId: number): Promise<void> {
    try {
      const setlists = await this.getSetlists();
      const target = setlists.find((s) => s.id === setlistId);
      if (target) {
        target.hymnIds = target.hymnIds.filter((id) => id !== hymnId);
        await this.saveSetlists(setlists);
      }
    } catch {}
  },
};
