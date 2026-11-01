import React, { useState, useMemo, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Hymn, Category } from '../types/hymn';
import { ThemeColors } from '../constants/theme';
import { hymns, categories, searchHymns } from '../services/hymnService';
import { HymnCard } from '../components/HymnCard';
import { QuickNumberPad } from '../components/QuickNumberPad';

interface HymnListScreenProps {
  theme: ThemeColors;
  favorites: number[];
  onSelectHymn: (hymnId: number) => void;
  onToggleFavorite: (hymnId: number) => void;
}

export const HymnListScreen: React.FC<HymnListScreenProps> = ({
  theme,
  favorites,
  onSelectHymn,
  onToggleFavorite,
}) => {
  const flatListRef = useRef<FlatList<Hymn>>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCatId, setSelectedCatId] = useState<number | null>(null);
  const [keypadVisible, setKeypadVisible] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Filtered hymns
  const filteredHymns = useMemo(() => {
    return searchHymns(searchQuery, selectedCatId);
  }, [searchQuery, selectedCatId]);

  // Selected category object
  const activeCategory = useMemo(() => {
    return selectedCatId !== null ? categories.find((c) => c.id === selectedCatId) : null;
  }, [selectedCatId]);

  // Scroll to top when search query or category filter changes
  useEffect(() => {
    flatListRef.current?.scrollToOffset({ offset: 0, animated: false });
    setShowScrollTop(false);
  }, [searchQuery, selectedCatId]);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    setShowScrollTop(offsetY > 300);
  };

  const scrollToTop = () => {
    flatListRef.current?.scrollToOffset({ offset: 0, animated: true });
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Top Search & Filter Bar */}
      <View style={[styles.searchContainer, { backgroundColor: theme.surface, borderBottomColor: theme.border }]}>
        <View style={[styles.searchInputWrapper, { backgroundColor: theme.background, borderColor: theme.border }]}>
          <Ionicons name="search" size={20} color={theme.textMuted} />
          <TextInput
            placeholder="Search hymn number, title or lyrics..."
            placeholderTextColor={theme.textMuted}
            value={searchQuery}
            onChangeText={setSearchQuery}
            style={[styles.searchInput, { color: theme.text }]}
            clearButtonMode="while-editing"
          />
          {searchQuery ? (
            <TouchableOpacity onPress={() => setSearchQuery('')} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
              <Ionicons name="close-circle" size={18} color={theme.textMuted} />
            </TouchableOpacity>
          ) : null}
        </View>

        {/* Quick Number Pad Button */}
        <TouchableOpacity
          onPress={() => setKeypadVisible(true)}
          style={[styles.keypadButton, { backgroundColor: theme.primary }]}
          accessibilityLabel="Quick Number Keypad"
        >
          <Ionicons name="keypad" size={20} color="#FFFFFF" />
          <Text style={styles.keypadButtonText}>#</Text>
        </TouchableOpacity>
      </View>

      {/* Quick Category Filter Pills */}
      <View style={styles.pillsContainer}>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={[{ id: null, name: 'All Hymns' }, ...categories.slice(0, 16)]}
          keyExtractor={(item) => (item.id === null ? 'all' : item.id.toString())}
          contentContainerStyle={styles.pillsList}
          renderItem={({ item }) => {
            const isSelected = selectedCatId === item.id;
            return (
              <TouchableOpacity
                onPress={() => setSelectedCatId(item.id)}
                style={[
                  styles.pill,
                  {
                    backgroundColor: isSelected ? theme.primary : theme.surfaceCard,
                    borderColor: isSelected ? theme.primary : theme.border,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.pillText,
                    { color: isSelected ? '#FFFFFF' : theme.textSecondary },
                  ]}
                >
                  {item.name}
                </Text>
              </TouchableOpacity>
            );
          }}
        />
      </View>

      {/* Active Filter Header */}
      {activeCategory && (
        <View style={[styles.activeFilterBanner, { backgroundColor: theme.surfaceCard, borderColor: theme.border }]}>
          <Text style={[styles.activeFilterText, { color: theme.primary }]} numberOfLines={1}>
            Category: {activeCategory.name} ({activeCategory.range})
          </Text>
          <TouchableOpacity onPress={() => setSelectedCatId(null)} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
            <Ionicons name="close" size={16} color={theme.textMuted} />
          </TouchableOpacity>
        </View>
      )}

      {/* Results Count */}
      <View style={styles.countRow}>
        <Text style={[styles.countText, { color: theme.textMuted }]}>
          Showing {filteredHymns.length} {filteredHymns.length === 1 ? 'hymn' : 'hymns'}
        </Text>
      </View>

      {/* Hymns FlatList */}
      <FlatList
        ref={flatListRef}
        data={filteredHymns}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <HymnCard
            hymn={item}
            theme={theme}
            isFavorite={favorites.includes(item.id)}
            onPress={() => onSelectHymn(item.id)}
            onToggleFavorite={() => onToggleFavorite(item.id)}
          />
        )}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        contentContainerStyle={styles.listContent}
        initialNumToRender={15}
        maxToRenderPerBatch={20}
        windowSize={10}
        removeClippedSubviews
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="musical-notes-outline" size={48} color={theme.textMuted} />
            <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
              No hymns found matching "{searchQuery}"
            </Text>
          </View>
        }
      />

      {/* Floating Back to Top Button */}
      {showScrollTop && (
        <TouchableOpacity
          style={[
            styles.scrollTopButton,
            { backgroundColor: theme.primary },
          ]}
          onPress={scrollToTop}
          activeOpacity={0.85}
          accessibilityLabel="Back to top"
        >
          <Ionicons name="arrow-up" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      )}

      {/* Quick Number Pad Modal */}
      <QuickNumberPad
        visible={keypadVisible}
        theme={theme}
        onClose={() => setKeypadVisible(false)}
        onSelectHymn={onSelectHymn}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  searchInputWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    height: 44,
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 12,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    paddingVertical: 0,
  },
  keypadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 44,
    paddingHorizontal: 12,
    borderRadius: 12,
    gap: 4,
  },
  keypadButtonText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 16,
  },
  pillsContainer: {
    paddingVertical: 8,
  },
  pillsList: {
    paddingHorizontal: 16,
    gap: 8,
  },
  pill: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
  },
  pillText: {
    fontSize: 13,
    fontWeight: '600',
  },
  activeFilterBanner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 16,
    marginBottom: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
  },
  activeFilterText: {
    fontSize: 12,
    fontWeight: '700',
  },
  countRow: {
    paddingHorizontal: 18,
    paddingBottom: 4,
  },
  countText: {
    fontSize: 12,
    fontWeight: '600',
  },
  listContent: {
    paddingBottom: 80,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    gap: 12,
  },
  emptyText: {
    fontSize: 15,
    fontWeight: '600',
    textAlign: 'center',
    paddingHorizontal: 30,
  },
  scrollTopButton: {
    position: 'absolute',
    right: 20,
    bottom: 24,
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    zIndex: 99,
  },
});
