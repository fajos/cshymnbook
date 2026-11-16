import React, { useState, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  Share,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemeColors } from '../constants/theme';
import { HymnStory } from '../types/hymn';
import {
  getAllHymnStories,
  getHymnStoriesByCategory,
} from '../constants/hymnStories';

interface HymnHistoriesScreenProps {
  theme: ThemeColors;
  onSelectHymn: (hymnId: number) => void;
  favorites?: number[];
  onToggleFavorite?: (hymnId: number) => void;
}

export const HymnHistoriesScreen: React.FC<HymnHistoriesScreenProps> = React.memo(({
  theme,
  onSelectHymn,
  favorites = [],
  onToggleFavorite,
}) => {
  const [historyQuery, setHistoryQuery] = useState('');
  const [historyCategory, setHistoryCategory] = useState<'all' | 'cs_heritage' | 'general_classic'>('all');
  const [expandedStoryIds, setExpandedStoryIds] = useState<Record<number, boolean>>({});

  const allStories = useMemo(() => getAllHymnStories(), []);

  const filteredStories = useMemo(() => {
    let list = allStories;
    if (historyCategory !== 'all') {
      list = list.filter((s) => s.category === historyCategory);
    }
    if (historyQuery.trim()) {
      const q = historyQuery.trim().toLowerCase();
      list = list.filter(
        (s) =>
          (s.hymnNumber && s.hymnNumber.toLowerCase().includes(q)) ||
          s.title.toLowerCase().includes(q) ||
          s.author.toLowerCase().includes(q) ||
          (s.year && s.year.toLowerCase().includes(q)) ||
          (s.originStory && s.originStory.toLowerCase().includes(q)) ||
          (s.spiritualTakeaway && s.spiritualTakeaway.toLowerCase().includes(q)) ||
          (s.scriptureReference && s.scriptureReference.toLowerCase().includes(q))
      );
    }
    return list;
  }, [allStories, historyCategory, historyQuery]);

  const toggleExpandStory = useCallback((id: number) => {
    setExpandedStoryIds((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  }, []);

  const handleShareStory = useCallback(async (story: HymnStory) => {
    try {
      const shareText = `📜 ${story.hymnNumber ? story.hymnNumber + ' • ' : ''}${story.title}
✍️ Author: ${story.author} (${story.year || 'Historic'})
📖 Scripture: ${story.scriptureReference || 'Holy Bible'}

${story.originStory}

💡 Spiritual Takeaway:
${story.spiritualTakeaway || 'To God be the glory.'}

— Shared from C&S Hymn Book App`;

      await Share.share({
        message: shareText,
        title: story.title,
      });
    } catch {}
  }, []);

  const renderHeader = useMemo(() => {
    const heritageCount = allStories.filter((s) => s.category === 'cs_heritage').length;
    const classicCount = allStories.filter((s) => s.category === 'general_classic').length;

    return (
      <View style={styles.headerContainer}>
        {/* Banner Card */}
        <View style={[styles.heroBanner, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          <View style={[styles.heroIconBox, { backgroundColor: theme.primary + '15' }]}>
            <Text style={{ fontSize: 26 }}>📜</Text>
          </View>
          <View style={{ flex: 1, marginLeft: 12 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <Text style={[styles.heroTitle, { color: theme.text }]}>Hymn Histories & Heritage</Text>
              <View style={[styles.heroCountPill, { backgroundColor: theme.accentGold }]}>
                <Text style={styles.heroCountText}>{allStories.length} Stories</Text>
              </View>
            </View>
            <Text style={[styles.heroSubtitle, { color: theme.textMuted }]}>
              Inspiring backstories, divine origins, author testimonies & Seraphic roots.
            </Text>
          </View>
        </View>

        {/* Search Bar */}
        <View style={[styles.searchBox, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          <Ionicons name="search" size={18} color={theme.textMuted} />
          <TextInput
            placeholder="Search story, author, hymn #, title, scripture..."
            placeholderTextColor={theme.textMuted}
            value={historyQuery}
            onChangeText={setHistoryQuery}
            style={[styles.searchInput, { color: theme.text }]}
            returnKeyType="search"
            clearButtonMode="while-editing"
          />
          {historyQuery.length > 0 && (
            <TouchableOpacity onPress={() => setHistoryQuery('')} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
              <Ionicons name="close-circle" size={18} color={theme.textMuted} />
            </TouchableOpacity>
          )}
        </View>

        {/* Filter Chips */}
        <View style={styles.filterChipsRow}>
          <TouchableOpacity
            onPress={() => setHistoryCategory('all')}
            style={[
              styles.filterChip,
              historyCategory === 'all'
                ? { backgroundColor: theme.primary, borderColor: theme.primary }
                : { backgroundColor: theme.surface, borderColor: theme.border },
            ]}
          >
            <Text
              style={[
                styles.filterChipText,
                { color: historyCategory === 'all' ? '#FFFFFF' : theme.textMuted },
              ]}
            >
              All ({allStories.length})
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setHistoryCategory('cs_heritage')}
            style={[
              styles.filterChip,
              historyCategory === 'cs_heritage'
                ? { backgroundColor: theme.accentGold, borderColor: theme.accentGold }
                : { backgroundColor: theme.surface, borderColor: theme.border },
            ]}
          >
            <Text
              style={[
                styles.filterChipText,
                { color: historyCategory === 'cs_heritage' ? '#000000' : theme.textMuted, fontWeight: '700' },
              ]}
            >
              ⭐ Seraphic Heritage ({heritageCount})
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setHistoryCategory('general_classic')}
            style={[
              styles.filterChip,
              historyCategory === 'general_classic'
                ? { backgroundColor: theme.primary, borderColor: theme.primary }
                : { backgroundColor: theme.surface, borderColor: theme.border },
            ]}
          >
            <Text
              style={[
                styles.filterChipText,
                { color: historyCategory === 'general_classic' ? '#FFFFFF' : theme.textMuted },
              ]}
            >
              🏛️ Classic Pillars ({classicCount})
            </Text>
          </TouchableOpacity>
        </View>

        {/* Results summary if searching */}
        {historyQuery.trim().length > 0 && (
          <Text style={[styles.resultsCountText, { color: theme.textMuted }]}>
            Found {filteredStories.length} matching {filteredStories.length === 1 ? 'story' : 'stories'}
          </Text>
        )}
      </View>
    );
  }, [allStories, historyCategory, historyQuery, filteredStories.length, theme]);

  const renderStoryItem = useCallback(({ item }: { item: HymnStory }) => {
    const isExpanded = !!expandedStoryIds[item.hymnId];
    const isFav = favorites.includes(item.hymnId);

    return (
      <View style={[styles.storyCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
        {/* Card Header Row */}
        <View style={styles.storyCardHeader}>
          <View style={styles.storyHeaderBadges}>
            {item.hymnNumber && (
              <View style={[styles.hymnNumPill, { backgroundColor: theme.primary + '18' }]}>
                <Text style={[styles.hymnNumText, { color: theme.primary }]}>{item.hymnNumber}</Text>
              </View>
            )}
            <View
              style={[
                styles.categoryBadge,
                {
                  backgroundColor:
                    item.category === 'cs_heritage'
                      ? theme.accentGold + '22'
                      : theme.primary + '15',
                },
              ]}
            >
              <Text
                style={[
                  styles.categoryBadgeText,
                  {
                    color:
                      item.category === 'cs_heritage' ? theme.accentGold : theme.primary,
                  },
                ]}
              >
                {item.category === 'cs_heritage' ? '⭐ Seraphic Heritage' : 'Classic Pillar'}
              </Text>
            </View>
            {item.year && (
              <Text style={[styles.yearText, { color: theme.textMuted }]}>
                {item.year}
              </Text>
            )}
          </View>

          {onToggleFavorite && (
            <TouchableOpacity
              onPress={() => onToggleFavorite(item.hymnId)}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Ionicons
                name={isFav ? 'heart' : 'heart-outline'}
                size={19}
                color={isFav ? '#E53935' : theme.textMuted}
              />
            </TouchableOpacity>
          )}
        </View>

        {/* Title */}
        <Text style={[styles.storyTitle, { color: theme.text }]}>{item.title}</Text>

        {/* Author & Scripture Row */}
        <View style={styles.metaRow}>
          <View style={styles.metaItem}>
            <Ionicons name="person-outline" size={13} color={theme.textMuted} />
            <Text style={[styles.metaText, { color: theme.textSecondary }]} numberOfLines={1}>
              {item.author}
            </Text>
          </View>
        </View>

        {item.scriptureReference && (
          <View style={styles.scriptureRow}>
            <Ionicons name="book-outline" size={13} color={theme.accentGold} />
            <Text style={[styles.scriptureText, { color: theme.textMuted }]} numberOfLines={isExpanded ? undefined : 2}>
              {item.scriptureReference}
            </Text>
          </View>
        )}

        {/* Story Text */}
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => toggleExpandStory(item.hymnId)}
          style={styles.storyContentTouch}
        >
          <Text
            numberOfLines={isExpanded ? undefined : 3}
            style={[styles.storyBodyText, { color: theme.text }]}
          >
            {item.originStory}
          </Text>

          <View style={styles.expandToggleRow}>
            <Text style={[styles.expandToggleText, { color: theme.primary }]}>
              {isExpanded ? 'Show less ▴' : 'Read full history ▾'}
            </Text>
          </View>
        </TouchableOpacity>

        {/* Expanded Details: Takeaway & Actions */}
        {isExpanded && (
          <View style={styles.expandedSection}>
            {item.spiritualTakeaway && (
              <View
                style={[
                  styles.takeawayBox,
                  { backgroundColor: theme.primary + '10', borderColor: theme.primary + '30' },
                ]}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5, marginBottom: 3 }}>
                  <Text style={{ fontSize: 13 }}>💡</Text>
                  <Text style={[styles.takeawayHeading, { color: theme.primary }]}>
                    Spiritual Takeaway
                  </Text>
                </View>
                <Text style={[styles.takeawayBody, { color: theme.textSecondary }]}>
                  {item.spiritualTakeaway}
                </Text>
              </View>
            )}

            {/* Bottom Card Action Buttons */}
            <View style={styles.cardActionsRow}>
              <TouchableOpacity
                onPress={() => onSelectHymn(item.hymnId)}
                style={[styles.actionBtnPrimary, { backgroundColor: theme.primary }]}
              >
                <Ionicons name="musical-notes" size={15} color="#FFFFFF" />
                <Text style={styles.actionBtnPrimaryText}>Open Hymn & Sing</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => handleShareStory(item)}
                style={[styles.actionBtnSecondary, { borderColor: theme.border, backgroundColor: theme.background }]}
              >
                <Ionicons name="share-outline" size={15} color={theme.text} />
                <Text style={[styles.actionBtnSecondaryText, { color: theme.text }]}>Share</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>
    );
  }, [expandedStoryIds, favorites, onSelectHymn, onToggleFavorite, handleShareStory, toggleExpandStory, theme]);

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <FlatList
        data={filteredStories}
        keyExtractor={(item) => String(item.hymnId)}
        ListHeaderComponent={renderHeader}
        renderItem={renderStoryItem}
        contentContainerStyle={styles.listContent}
        keyboardShouldPersistTaps="handled"
        initialNumToRender={10}
        maxToRenderPerBatch={15}
        windowSize={7}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="search-outline" size={44} color={theme.textMuted} />
            <Text style={[styles.emptyTitle, { color: theme.text }]}>No hymn stories found</Text>
            <Text style={[styles.emptySubtitle, { color: theme.textMuted }]}>
              Try searching with another keyword or selecting "All"
            </Text>
          </View>
        }
      />
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContent: {
    paddingBottom: 40,
  },
  headerContainer: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 6,
  },
  heroBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    marginBottom: 12,
  },
  heroIconBox: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroTitle: {
    fontSize: 15,
    fontWeight: '800',
  },
  heroCountPill: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  heroCountText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#000000',
  },
  heroSubtitle: {
    fontSize: 12,
    lineHeight: 16,
    marginTop: 2,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    height: 44,
    borderRadius: 10,
    borderWidth: 1,
    gap: 8,
    marginBottom: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    paddingVertical: 0,
  },
  filterChipsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
    flexWrap: 'wrap',
  },
  filterChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
  },
  filterChipText: {
    fontSize: 12,
    fontWeight: '600',
  },
  resultsCountText: {
    fontSize: 12,
    fontStyle: 'italic',
    marginBottom: 4,
  },
  storyCard: {
    marginHorizontal: 16,
    marginBottom: 12,
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  storyCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  storyHeaderBadges: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flexWrap: 'wrap',
  },
  hymnNumPill: {
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 6,
  },
  hymnNumText: {
    fontSize: 12,
    fontWeight: '800',
  },
  categoryBadge: {
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 6,
  },
  categoryBadgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  yearText: {
    fontSize: 11,
    fontWeight: '500',
  },
  storyTitle: {
    fontSize: 15,
    fontWeight: '700',
    lineHeight: 21,
    marginBottom: 6,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    flex: 1,
  },
  metaText: {
    fontSize: 12.5,
    fontWeight: '500',
  },
  scriptureRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 5,
    marginBottom: 8,
  },
  scriptureText: {
    fontSize: 12,
    fontStyle: 'italic',
    lineHeight: 16,
    flex: 1,
  },
  storyContentTouch: {
    marginTop: 2,
  },
  storyBodyText: {
    fontSize: 13.5,
    lineHeight: 21,
  },
  expandToggleRow: {
    marginTop: 4,
    marginBottom: 2,
  },
  expandToggleText: {
    fontSize: 12.5,
    fontWeight: '700',
  },
  expandedSection: {
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(150, 150, 150, 0.2)',
  },
  takeawayBox: {
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    marginBottom: 12,
  },
  takeawayHeading: {
    fontSize: 12,
    fontWeight: '800',
  },
  takeawayBody: {
    fontSize: 12.5,
    lineHeight: 18,
  },
  cardActionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  actionBtnPrimary: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    height: 38,
    borderRadius: 8,
  },
  actionBtnPrimaryText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  actionBtnSecondary: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    paddingHorizontal: 14,
    height: 38,
    borderRadius: 8,
    borderWidth: 1,
  },
  actionBtnSecondaryText: {
    fontSize: 13,
    fontWeight: '600',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 50,
    paddingHorizontal: 20,
    gap: 8,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginTop: 4,
  },
  emptySubtitle: {
    fontSize: 13,
    textAlign: 'center',
  },
});
