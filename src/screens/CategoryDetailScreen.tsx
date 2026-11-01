import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Category, Hymn } from '../types/hymn';
import { ThemeColors } from '../constants/theme';
import { getHymnsByCategory } from '../services/hymnService';
import { HymnCard } from '../components/HymnCard';
import { Header } from '../components/Header';

interface CategoryDetailScreenProps {
  category: Category;
  theme: ThemeColors;
  favorites: number[];
  onBack: () => void;
  onSelectHymn: (hymnId: number) => void;
  onToggleFavorite: (hymnId: number) => void;
}

export const CategoryDetailScreen: React.FC<CategoryDetailScreenProps> = ({
  category,
  theme,
  favorites,
  onBack,
  onSelectHymn,
  onToggleFavorite,
}) => {
  const flatListRef = useRef<FlatList<Hymn>>(null);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const categoryHymns = getHymnsByCategory(category.id);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    setShowScrollTop(offsetY > 300);
  };

  const scrollToTop = () => {
    flatListRef.current?.scrollToOffset({ offset: 0, animated: true });
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Header
        title={category.name}
        subtitle={`${category.range} • ${categoryHymns.length} Hymns`}
        theme={theme}
        showBack
        onBack={onBack}
      />

      {/* Banner */}
      <View style={[styles.banner, { backgroundColor: theme.surface, borderColor: theme.border }]}>
        <View style={[styles.badge, { backgroundColor: theme.primary + '15' }]}>
          <Text style={[styles.badgeText, { color: theme.primary }]}>
            {category.number}
          </Text>
        </View>
        <View style={styles.bannerContent}>
          <Text style={[styles.bannerTitle, { color: theme.text }]}>
            {category.name}
          </Text>
          <Text style={[styles.bannerRange, { color: theme.accentGold }]}>
            Range: {category.range}
          </Text>
        </View>
      </View>

      {/* Hymns List */}
      <FlatList
        ref={flatListRef}
        data={categoryHymns}
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 16,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
  },
  badge: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  badgeText: {
    fontSize: 18,
    fontWeight: '800',
  },
  bannerContent: {
    flex: 1,
  },
  bannerTitle: {
    fontSize: 17,
    fontWeight: '700',
    marginBottom: 4,
  },
  bannerRange: {
    fontSize: 13,
    fontWeight: '600',
  },
  listContent: {
    paddingBottom: 40,
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
