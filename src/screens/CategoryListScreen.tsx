import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Category } from '../types/hymn';
import { ThemeColors } from '../constants/theme';
import { categories, normalizeText } from '../services/hymnService';
import { CategoryCard } from '../components/CategoryCard';

interface CategoryListScreenProps {
  theme: ThemeColors;
  onSelectCategory: (category: Category) => void;
}

export const CategoryListScreen: React.FC<CategoryListScreenProps> = ({
  theme,
  onSelectCategory,
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCategories = useMemo(() => {
    if (!searchQuery.trim()) return categories;
    const norm = normalizeText(searchQuery);
    return categories.filter((c) => {
      return (
        normalizeText(c.name).includes(norm) ||
        normalizeText(c.range).includes(norm) ||
        c.number.includes(searchQuery.trim())
      );
    });
  }, [searchQuery]);

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Search Bar */}
      <View style={[styles.searchContainer, { backgroundColor: theme.surface, borderBottomColor: theme.border }]}>
        <View style={[styles.searchInputWrapper, { backgroundColor: theme.background, borderColor: theme.border }]}>
          <Ionicons name="search" size={20} color={theme.textMuted} />
          <TextInput
            placeholder="Search categories (e.g. Owuro, Isimi, Ajinde)..."
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
      </View>

      {/* Info Header */}
      <View style={styles.headerInfo}>
        <Text style={[styles.infoTitle, { color: theme.text }]}>
          58 Liturgical Categories
        </Text>
        <Text style={[styles.infoSubtitle, { color: theme.textMuted }]}>
          Orin Akunleko, Akole Orin Mimo, Isoji, Saamu & Katikismu
        </Text>
      </View>

      {/* Categories List */}
      <FlatList
        data={filteredCategories}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <CategoryCard
            category={item}
            theme={theme}
            onPress={() => onSelectCategory(item)}
          />
        )}
        contentContainerStyle={styles.listContent}
        initialNumToRender={12}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="folder-open-outline" size={48} color={theme.textMuted} />
            <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
              No categories found matching "{searchQuery}"
            </Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  searchInputWrapper: {
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
  headerInfo: {
    paddingHorizontal: 18,
    paddingTop: 12,
    paddingBottom: 4,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: -0.2,
  },
  infoSubtitle: {
    fontSize: 12,
    fontWeight: '500',
    marginTop: 2,
  },
  listContent: {
    paddingBottom: 80,
    paddingTop: 6,
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
  },
});
