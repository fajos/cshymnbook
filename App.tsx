import React, { useState, useEffect, useCallback } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Platform,
  BackHandler,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

import { Category, ThemeMode, Setlist } from './src/types/hymn';
import { THEMES } from './src/constants/theme';
import { storageService } from './src/services/storageService';
import { Header } from './src/components/Header';
import { HymnListScreen } from './src/screens/HymnListScreen';
import { CategoryListScreen } from './src/screens/CategoryListScreen';
import { CategoryDetailScreen } from './src/screens/CategoryDetailScreen';
import { HymnDetailScreen } from './src/screens/HymnDetailScreen';
import { FavoritesScreen } from './src/screens/FavoritesScreen';
import { SpecialLiturgyScreen } from './src/screens/SpecialLiturgyScreen';
import { AboutModal } from './src/components/AboutModal';
import { OnboardingModal } from './src/components/OnboardingModal';

type Tab = 'hymns' | 'categories' | 'liturgy' | 'favorites';

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>('hymns');
  const [themeMode, setThemeMode] = useState<ThemeMode>('light');
  const [fontSize, setFontSize] = useState<number>(18);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [setlists, setSetlists] = useState<Setlist[]>([]);

  // Navigation stack states
  const [selectedHymnId, setSelectedHymnId] = useState<number | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [showAboutModal, setShowAboutModal] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);

  // Load saved preferences
  useEffect(() => {
    (async () => {
      const [savedTheme, savedSize, savedFavs, savedSets, onboardingDone] =
        await Promise.all([
          storageService.getTheme(),
          storageService.getFontSize(),
          storageService.getFavorites(),
          storageService.getSetlists(),
          storageService.hasCompletedOnboarding(),
        ]);

      setThemeMode(savedTheme);
      setFontSize(savedSize);
      setFavorites(savedFavs);
      setSetlists(savedSets);
      if (!onboardingDone) {
        setShowOnboarding(true);
      }
    })();
  }, []);

  const handleCompleteOnboarding = useCallback(async () => {
    setShowOnboarding(false);
    await storageService.setOnboardingCompleted();
  }, []);

  // Hardware back button support on Android
  useEffect(() => {
    const onHardwareBack = () => {
      if (showOnboarding) {
        handleCompleteOnboarding();
        return true;
      }
      if (showAboutModal) {
        setShowAboutModal(false);
        return true;
      }
      if (selectedHymnId !== null) {
        setSelectedHymnId(null);
        return true;
      }
      if (selectedCategory !== null) {
        setSelectedCategory(null);
        return true;
      }
      return false;
    };

    const subscription = BackHandler.addEventListener('hardwareBackPress', onHardwareBack);
    return () => subscription.remove();
  }, [showOnboarding, handleCompleteOnboarding, showAboutModal, selectedHymnId, selectedCategory]);

  const theme = THEMES[themeMode];

  const handleToggleFavorite = useCallback(async (hymnId: number) => {
    const isNowFav = await storageService.toggleFavorite(hymnId);
    setFavorites((prev) =>
      isNowFav ? [...prev, hymnId] : prev.filter((id) => id !== hymnId)
    );
  }, []);

  const handleChangeTheme = async (newTheme: ThemeMode) => {
    setThemeMode(newTheme);
    await storageService.setTheme(newTheme);
  };

  const handleChangeFontSize = async (newSize: number) => {
    setFontSize(newSize);
    await storageService.setFontSize(newSize);
  };

  const handleSelectHymn = useCallback(async (hymnId: number) => {
    setSelectedHymnId(hymnId);
    await storageService.addRecent(hymnId);
  }, []);

  // Setlist operations
  const handleCreateSetlist = async (name: string, description?: string) => {
    const created = await storageService.createSetlist(name, description);
    setSetlists((prev) => [created, ...prev]);
  };

  const handleDeleteSetlist = async (id: string) => {
    await storageService.deleteSetlist(id);
    setSetlists((prev) => prev.filter((s) => s.id !== id));
  };

  const handleAddHymnToSet = async (setlistId: string, hymnId: number) => {
    await storageService.addHymnToSetlist(setlistId, hymnId);
    const updated = await storageService.getSetlists();
    setSetlists(updated);
  };

  const handleRemoveHymnFromSet = async (setlistId: string, hymnId: number) => {
    await storageService.removeHymnFromSetlist(setlistId, hymnId);
    const updated = await storageService.getSetlists();
    setSetlists(updated);
  };

  const handleCreateAndAddSetlist = async (name: string, description?: string, hymnId?: number) => {
    const created = await storageService.createSetlist(name, description);
    if (hymnId) {
      await storageService.addHymnToSetlist(created.id, hymnId);
    }
    const updated = await storageService.getSetlists();
    setSetlists(updated);
  };

  const handleCreateSetlistWithHymns = async (
    name: string,
    description?: string,
    hymnIds: number[] = []
  ) => {
    await storageService.createSetlistWithHymns(name, description, hymnIds);
    const updated = await storageService.getSetlists();
    setSetlists(updated);
  };

  // Header Title for tab view
  const getHeaderTitle = () => {
    switch (activeTab) {
      case 'hymns':
        return 'C&S Hymn Book';
      case 'categories':
        return 'Hymn Categories';
      case 'liturgy':
        return 'Special Liturgy';
      case 'favorites':
        return 'Favorites & Sets';
    }
  };

  const getHeaderSubtitle = () => {
    switch (activeTab) {
      case 'hymns':
        return 'Orin Mimo K&S (980 Hymns)';
      case 'categories':
        return '58 Liturgical Sections';
      case 'liturgy':
        return 'Akunleko, Isoji, Psalms & Creeds';
      case 'favorites':
        return `${favorites.length} Saved • ${setlists.length} Sets`;
    }
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.surface }]}>
        <StatusBar style={theme.statusBar} />

        {/* Top App Header (when not inside hymn reader or category detail) */}
        {selectedHymnId === null && selectedCategory === null && (
          <Header
            title={getHeaderTitle()}
            subtitle={getHeaderSubtitle()}
            theme={theme}
            rightActions={[
              {
                icon:
                  themeMode === 'dark'
                    ? 'moon'
                    : themeMode === 'sepia'
                    ? 'book'
                    : 'sunny',
                onPress: () => {
                  const cycle: ThemeMode[] = ['light', 'dark', 'sepia'];
                  const nextIdx = (cycle.indexOf(themeMode) + 1) % cycle.length;
                  handleChangeTheme(cycle[nextIdx]);
                },
                color: theme.accentGold,
              },
              {
                icon: 'information-circle-outline',
                onPress: () => setShowAboutModal(true),
                color: theme.accentGold,
              },
            ]}
          />
        )}

        {/* Screen Content */}
        <View style={styles.body}>
          {/* Tab 1: Hymns */}
          <View
            style={[
              styles.tabContainer,
              activeTab === 'hymns' && selectedCategory === null
                ? styles.visible
                : styles.hidden,
            ]}
          >
            <HymnListScreen
              theme={theme}
              favorites={favorites}
              onSelectHymn={handleSelectHymn}
              onToggleFavorite={handleToggleFavorite}
            />
          </View>

          {/* Tab 2: Categories */}
          <View
            style={[
              styles.tabContainer,
              activeTab === 'categories' && selectedCategory === null
                ? styles.visible
                : styles.hidden,
            ]}
          >
            <CategoryListScreen
              theme={theme}
              onSelectCategory={(cat) => setSelectedCategory(cat)}
            />
          </View>

          {/* Category Detail Screen */}
          {selectedCategory !== null && (
            <View style={[styles.tabContainer, styles.visible]}>
              <CategoryDetailScreen
                category={selectedCategory}
                theme={theme}
                favorites={favorites}
                onBack={() => setSelectedCategory(null)}
                onSelectHymn={handleSelectHymn}
                onToggleFavorite={handleToggleFavorite}
              />
            </View>
          )}

          {/* Tab 3: Liturgy */}
          <View
            style={[
              styles.tabContainer,
              activeTab === 'liturgy' && selectedCategory === null
                ? styles.visible
                : styles.hidden,
            ]}
          >
            <SpecialLiturgyScreen
              theme={theme}
              favorites={favorites}
              onSelectHymn={handleSelectHymn}
              onToggleFavorite={handleToggleFavorite}
            />
          </View>

          {/* Tab 4: Favorites & Setlists */}
          <View
            style={[
              styles.tabContainer,
              activeTab === 'favorites' && selectedCategory === null
                ? styles.visible
                : styles.hidden,
            ]}
          >
            <FavoritesScreen
              theme={theme}
              favorites={favorites}
              setlists={setlists}
              onSelectHymn={handleSelectHymn}
              onToggleFavorite={handleToggleFavorite}
              onCreateSetlist={handleCreateSetlist}
              onDeleteSetlist={handleDeleteSetlist}
              onAddHymnToSet={handleAddHymnToSet}
              onRemoveHymnFromSet={handleRemoveHymnFromSet}
              onCreateSetlistWithHymns={handleCreateSetlistWithHymns}
            />
          </View>

          {/* Hymn Detail Screen (Overlaid when viewing a hymn) */}
          {selectedHymnId !== null && (
            <View style={[StyleSheet.absoluteFill, { zIndex: 100, elevation: 100 }]}>
              <HymnDetailScreen
                hymnId={selectedHymnId}
                theme={theme}
                themeMode={themeMode}
                fontSize={fontSize}
                isFavorite={favorites.includes(selectedHymnId)}
                setlists={setlists}
                onBack={() => setSelectedHymnId(null)}
                onSelectHymn={handleSelectHymn}
                onToggleFavorite={handleToggleFavorite}
                onChangeTheme={handleChangeTheme}
                onChangeFontSize={handleChangeFontSize}
                onAddToSetlist={handleAddHymnToSet}
                onCreateAndAddSetlist={handleCreateAndAddSetlist}
              />
            </View>
          )}
        </View>

        {/* Bottom Tab Navigation Bar (when not in detail view) */}
        {selectedHymnId === null && selectedCategory === null && (
          <View style={[styles.bottomTabs, { backgroundColor: theme.surface, borderTopColor: theme.border }]}>
            <TouchableOpacity
              style={styles.tabItem}
              onPress={() => setActiveTab('hymns')}
            >
              <Ionicons
                name={activeTab === 'hymns' ? 'book' : 'book-outline'}
                size={22}
                color={activeTab === 'hymns' ? theme.primary : theme.textMuted}
              />
              <Text
                style={[
                  styles.tabLabel,
                  { color: activeTab === 'hymns' ? theme.primary : theme.textMuted },
                ]}
              >
                Hymns
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.tabItem}
              onPress={() => setActiveTab('categories')}
            >
              <Ionicons
                name={activeTab === 'categories' ? 'grid' : 'grid-outline'}
                size={22}
                color={activeTab === 'categories' ? theme.primary : theme.textMuted}
              />
              <Text
                style={[
                  styles.tabLabel,
                  { color: activeTab === 'categories' ? theme.primary : theme.textMuted },
                ]}
              >
                Categories
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.tabItem}
              onPress={() => setActiveTab('liturgy')}
            >
              <Ionicons
                name={activeTab === 'liturgy' ? 'flame' : 'flame-outline'}
                size={22}
                color={activeTab === 'liturgy' ? theme.primary : theme.textMuted}
              />
              <Text
                style={[
                  styles.tabLabel,
                  { color: activeTab === 'liturgy' ? theme.primary : theme.textMuted },
                ]}
              >
                Liturgy
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.tabItem}
              onPress={() => setActiveTab('favorites')}
            >
              <Ionicons
                name={activeTab === 'favorites' ? 'heart' : 'heart-outline'}
                size={22}
                color={activeTab === 'favorites' ? theme.primary : theme.textMuted}
              />
              <Text
                style={[
                  styles.tabLabel,
                  { color: activeTab === 'favorites' ? theme.primary : theme.textMuted },
                ]}
              >
                Favorites
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* In-App About, Privacy Policy & Terms Modal */}
        <AboutModal
          visible={showAboutModal}
          theme={theme}
          onClose={() => setShowAboutModal(false)}
          onOpenOnboarding={() => {
            setShowAboutModal(false);
            setShowOnboarding(true);
          }}
        />

        {/* First-Launch / Replayable Onboarding Tour */}
        <OnboardingModal
          visible={showOnboarding}
          theme={theme}
          onComplete={handleCompleteOnboarding}
        />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  body: {
    flex: 1,
    position: 'relative',
  },
  tabContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  visible: {
    display: 'flex',
  },
  hidden: {
    display: 'none',
  },
  bottomTabs: {
    flexDirection: 'row',
    height: Platform.OS === 'ios' ? 70 : 60,
    borderTopWidth: StyleSheet.hairlineWidth,
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingBottom: Platform.OS === 'ios' ? 16 : 4,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
    gap: 3,
  },
  tabLabel: {
    fontSize: 11,
    fontWeight: '700',
  },
});
