import { ThemeMode } from '../types/hymn';

export interface ThemeColors {
  primary: string;
  primaryLight: string;
  primaryDark: string;
  accent: string;
  accentGold: string;
  background: string;
  surface: string;
  surfaceElevated: string;
  surfaceCard: string;
  text: string;
  textSecondary: string;
  textMuted: string;
  border: string;
  borderLight: string;
  badgeBg: string;
  badgeText: string;
  chorusBg: string;
  chorusBorder: string;
  scriptureBg: string;
  scriptureText: string;
  statusBar: 'light' | 'dark';
}

export const THEMES: Record<ThemeMode, ThemeColors> = {
  light: {
    primary: '#1E3A8A',       // Sacred deep blue
    primaryLight: '#3B82F6',
    primaryDark: '#172554',
    accent: '#D97706',        // Liturgical gold
    accentGold: '#F59E0B',
    background: '#F8FAFC',
    surface: '#FFFFFF',
    surfaceElevated: '#FFFFFF',
    surfaceCard: '#FFFFFF',
    text: '#0F172A',
    textSecondary: '#475569',
    textMuted: '#94A3B8',
    border: '#E2E8F0',
    borderLight: '#F1F5F9',
    badgeBg: '#EFF6FF',
    badgeText: '#1D4ED8',
    chorusBg: '#FEF3C7',
    chorusBorder: '#F59E0B',
    scriptureBg: '#EEF2FF',
    scriptureText: '#3730A3',
    statusBar: 'dark',
  },
  dark: {
    primary: '#60A5FA',
    primaryLight: '#93C5FD',
    primaryDark: '#1E3A8A',
    accent: '#FBBF24',
    accentGold: '#F59E0B',
    background: '#0B1120',    // Deep night navy
    surface: '#151E33',
    surfaceElevated: '#1E293B',
    surfaceCard: '#182238',
    text: '#F8FAFC',
    textSecondary: '#CBD5E1',
    textMuted: '#64748B',
    border: '#334155',
    borderLight: '#1E293B',
    badgeBg: '#1E293B',
    badgeText: '#93C5FD',
    chorusBg: '#2A2315',
    chorusBorder: '#B45309',
    scriptureBg: '#1E2342',
    scriptureText: '#A5B4FC',
    statusBar: 'light',
  },
  sepia: {
    primary: '#78350F',       // Warm aged umber
    primaryLight: '#B45309',
    primaryDark: '#451A03',
    accent: '#B45309',
    accentGold: '#D97706',
    background: '#F5EBE1',    // Parchment paper
    surface: '#FCF8F2',
    surfaceElevated: '#EDE0D4',
    surfaceCard: '#FCF8F2',
    text: '#3E2723',
    textSecondary: '#5D4037',
    textMuted: '#8D6E63',
    border: '#E6D7C3',
    borderLight: '#EFE5D8',
    badgeBg: '#EDE0D4',
    badgeText: '#78350F',
    chorusBg: '#EFE5D8',
    chorusBorder: '#B45309',
    scriptureBg: '#E9DFD3',
    scriptureText: '#5C3813',
    statusBar: 'dark',
  },
};
