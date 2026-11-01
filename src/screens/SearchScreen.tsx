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
import { Hymn } from '../types/hymn';
import { ThemeColors } from '../constants/theme';
import { searchHymns } from '../services/hymnService';
import { HymnCard } from '../components/HymnCard';

interface SearchScreenProps {
  theme: ThemeColors;
  favorites: number[];
  onSelectHymn: (hymnId: number) => void;
  onToggleFavorite: (hymnId: number) => void;
}

const POPULAR_SEARCHES = [
  '474',
  'Ji okan mi',
  'Wa ba mi gbe',
  'Awa ko le sai dupe',
  'Psalm 24',
  'Adura Oluwa',
  'Emi Mimo',
  'Ajinde',
];

export const SearchScreen: React.FC<SearchScreenProps> = ({
  theme,
  favorites,
  onSelectHymn,
  onToggleFavorite,
}) => {
  const [query, setQuery] = useState('');

  const results = useMemo(() => {
    if (!query.trim()) return [];
    return searchHymns(query);
  }, [query]);

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Search Input */}
      <View style={[styles.inputBox, { backgroundColor: theme.surface, borderBottomColor: theme.border }]}>
        <View style={[styles.inputWrapper, { backgroundColor: theme.background, borderColor: theme.border }]}>
          <Ionicons name="search" size={20} color={theme.textMuted} />
          <TextInput
            placeholder="Search number, title, lyrics or scripture..."
            placeholderTextColor={theme.textMuted}
            value={query}
            onChangeText={setQuery}
            style={[styles.input, { color: theme.text }]}
            autoFocus
            clearButtonMode="while-editing"
          />
          {query ? (
            <TouchableOpacity onPress={() => setQuery('')} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
              <Ionicons name="close-circle" size={18} color={theme.textMuted} />
            </TouchableOpacity>
          ) : null}
        </View>
      </View>

      {/* Suggested Searches if empty */}
      {!query.trim() ? (
        <View style={styles.suggestionsContainer}>
          <Text style={[styles.suggestionsHeader, { color: theme.textSecondary }]}>
            Popular & Suggested Searches
          </Text>
          <View style={styles.chipsWrap}>
            {POPULAR_SEARCHES.map((chip, idx) => (
              <TouchableOpacity
                key={idx}
                onPress={() => setQuery(chip)}
                style={[
                  styles.chip,
                  { backgroundColor: theme.surfaceCard, borderColor: theme.border },
                ]}
              >
                <Ionicons name="search-outline" size={13} color={theme.primary} />
                <Text style={[styles.chipText, { color: theme.text }]}>{chip}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={[styles.tipCard, { backgroundColor: theme.surfaceCard, borderColor: theme.border }]}>
            <Ionicons name="bulb-outline" size={22} color={theme.accentGold} />
            <View style={{ flex: 1 }}>
              <Text style={[styles.tipTitle, { color: theme.text }]}>Search Tips</Text>
              <Text style={[styles.tipDesc, { color: theme.textSecondary }]}>
                • Type any number (e.g. 100, 474) to quickly jump to a hymn.{'\n'}
                • Search with or without Yoruba accents (e.g. "Ope" or "Ọpẹ").{'\n'}
                • Search keywords in lyrics, meters (e.g. "C.M."), or scripture verses.
              </Text>
            </View>
          </View>
        </View>
      ) : (
        <>
          <View style={styles.countBanner}>
            <Text style={[styles.countText, { color: theme.textMuted }]}>
              {results.length} {results.length === 1 ? 'match' : 'matches'} found for "{query}"
            </Text>
          </View>

          <FlatList
            data={results}
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
            contentContainerStyle={styles.listContent}
            ListEmptyComponent={
              <View style={styles.emptyBox}>
                <Ionicons name="search-outline" size={44} color={theme.textMuted} />
                <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
                  No hymns matched "{query}"
                </Text>
              </View>
            }
          />
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  inputBox: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 46,
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 12,
    gap: 8,
  },
  input: {
    flex: 1,
    fontSize: 15,
  },
  suggestionsContainer: {
    padding: 18,
  },
  suggestionsHeader: {
    fontSize: 13,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 12,
  },
  chipsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 24,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    gap: 6,
  },
  chipText: {
    fontSize: 13,
    fontWeight: '600',
  },
  tipCard: {
    flexDirection: 'row',
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
    gap: 12,
  },
  tipTitle: {
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 4,
  },
  tipDesc: {
    fontSize: 13,
    lineHeight: 19,
  },
  countBanner: {
    paddingHorizontal: 18,
    paddingVertical: 8,
  },
  countText: {
    fontSize: 12,
    fontWeight: '600',
  },
  listContent: {
    paddingBottom: 80,
  },
  emptyBox: {
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
