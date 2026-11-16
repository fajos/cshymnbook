import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ScrollView,
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemeColors } from '../constants/theme';
import { getHymnsByCategory, SPECIAL_SECTIONS, getHymnById } from '../services/hymnService';
import { CHURCH_SEASONS, ChurchSeason } from '../constants/churchSeasons';
import { getAllHymnStories } from '../constants/hymnStories';
import { HymnCard } from '../components/HymnCard';
import { DownloadAllTunesModal } from '../components/DownloadAllTunesModal';
import { Hymn, HymnStory } from '../types/hymn';

interface SpecialLiturgyScreenProps {
  theme: ThemeColors;
  favorites: number[];
  onSelectHymn: (hymnId: number) => void;
  onToggleFavorite: (hymnId: number) => void;
}

type LiturgyMode = 'orders' | 'seasons' | 'histories';

export const SpecialLiturgyScreen: React.FC<SpecialLiturgyScreenProps> = ({
  theme,
  favorites,
  onSelectHymn,
  onToggleFavorite,
}) => {
  const [mode, setMode] = useState<LiturgyMode>('orders');
  const [selectedSection, setSelectedSection] = useState(SPECIAL_SECTIONS[0]);
  const [selectedSeason, setSelectedSeason] = useState<ChurchSeason>(CHURCH_SEASONS[0]);
  const [showDownloadModal, setShowDownloadModal] = useState(false);

  // Hymn Histories states
  const [historyCategory, setHistoryCategory] = useState<'all' | 'cs_heritage' | 'general_classic'>('all');
  const [historyQuery, setHistoryQuery] = useState('');
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
          (s.spiritualTakeaway && s.spiritualTakeaway.toLowerCase().includes(q))
      );
    }
    return list;
  }, [allStories, historyCategory, historyQuery]);

  const toggleExpandStory = (id: number) => {
    setExpandedStoryIds((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // Hymns for selected special order category
  const hymnsInOrder = useMemo(() => {
    return getHymnsByCategory(selectedSection.categoryId);
  }, [selectedSection.categoryId]);

  // Hymns for selected church season
  const hymnsInSeason = useMemo(() => {
    return selectedSeason.hymnIds
      .map((id) => getHymnById(id))
      .filter((h): h is Hymn => h !== undefined);
  }, [selectedSeason]);

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Top Segmented Mode Selector */}
      <View style={[styles.mainSegmentRow, { backgroundColor: theme.surface, borderBottomColor: theme.border }]}>
        <View style={styles.tabButtonsGroup}>
          <TouchableOpacity
            onPress={() => setMode('orders')}
            style={[
              styles.segmentBtn,
              mode === 'orders' && [styles.activeSegmentBtn, { borderBottomColor: theme.primary }],
            ]}
          >
            <Ionicons
              name={mode === 'orders' ? 'book' : 'book-outline'}
              size={15}
              color={mode === 'orders' ? theme.primary : theme.textMuted}
            />
            <Text
              style={[
                styles.segmentBtnText,
                { color: mode === 'orders' ? theme.primary : theme.textMuted },
              ]}
            >
              Liturgical Orders
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setMode('seasons')}
            style={[
              styles.segmentBtn,
              mode === 'seasons' && [styles.activeSegmentBtn, { borderBottomColor: theme.primary }],
            ]}
          >
            <Ionicons
              name={mode === 'seasons' ? 'sparkles' : 'sparkles-outline'}
              size={15}
              color={mode === 'seasons' ? theme.primary : theme.textMuted}
            />
            <Text
              style={[
                styles.segmentBtnText,
                { color: mode === 'seasons' ? theme.primary : theme.textMuted },
              ]}
            >
              Church Seasons
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setMode('histories')}
            style={[
              styles.segmentBtn,
              mode === 'histories' && [styles.activeSegmentBtn, { borderBottomColor: theme.primary }],
            ]}
          >
            <Ionicons
              name={mode === 'histories' ? 'time' : 'time-outline'}
              size={15}
              color={mode === 'histories' ? theme.primary : theme.textMuted}
            />
            <Text
              style={[
                styles.segmentBtnText,
                { color: mode === 'histories' ? theme.primary : theme.textMuted },
              ]}
            >
              Hymn Histories
            </Text>
          </TouchableOpacity>
        </View>

        {/* Offline Audio Downloader Launcher */}
        <TouchableOpacity
          onPress={() => setShowDownloadModal(true)}
          style={[styles.audioPackBtn, { backgroundColor: theme.primary + '15', borderColor: theme.primary + '35' }]}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          accessibilityLabel="Download All Offline Audio Tunes"
        >
          <Ionicons name="cloud-download-outline" size={14} color={theme.primary} />
          <Text style={[styles.audioPackBtnText, { color: theme.primary }]}>Audio Pack</Text>
        </TouchableOpacity>
      </View>

      {mode === 'orders' && (
        /* Mode 1: Special Liturgical Orders (Akunleko, Isoji, Psalms, Lord's Prayer, Creeds) */
        <View style={{ flex: 1 }}>
          <View style={[styles.tabsWrapper, { backgroundColor: theme.surface, borderBottomColor: theme.border }]}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.tabsContent}
            >
              {SPECIAL_SECTIONS.map((sec) => {
                const isSelected = selectedSection.id === sec.id;
                return (
                  <TouchableOpacity
                    key={sec.id}
                    onPress={() => setSelectedSection(sec)}
                    style={[
                      styles.tabChip,
                      {
                        backgroundColor: isSelected ? theme.primary : theme.surfaceCard,
                        borderColor: isSelected ? theme.primary : theme.border,
                      },
                    ]}
                  >
                    <Ionicons
                      name={sec.icon as any}
                      size={15}
                      color={isSelected ? '#FFFFFF' : theme.textSecondary}
                    />
                    <Text
                      style={[
                        styles.tabChipText,
                        { color: isSelected ? '#FFFFFF' : theme.textSecondary },
                      ]}
                    >
                      {sec.name}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>

          {/* Section Header Info */}
          <View style={[styles.sectionBanner, { backgroundColor: theme.surfaceCard, borderColor: theme.border }]}>
            <Ionicons name={selectedSection.icon as any} size={26} color={theme.accentGold} />
            <View style={{ flex: 1 }}>
              <Text style={[styles.sectionTitle, { color: theme.text }]}>
                {selectedSection.name}
              </Text>
              <Text style={[styles.sectionSub, { color: theme.textMuted }]}>
                {hymnsInOrder.length} liturgical entries
              </Text>
            </View>
          </View>

          {/* Hymns List */}
          <FlatList
            data={hymnsInOrder}
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
            initialNumToRender={12}
          />
        </View>
      )}

      {mode === 'seasons' && (
        /* Mode 2: Canonical Church Seasons (Lent, Easter, Pentecost, Harvest, Christmas, New Year, Seraphic Anniversary) */
        <View style={{ flex: 1 }}>
          <View style={[styles.tabsWrapper, { backgroundColor: theme.surface, borderBottomColor: theme.border }]}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.tabsContent}
            >
              {CHURCH_SEASONS.map((season) => {
                const isSelected = selectedSeason.id === season.id;
                return (
                  <TouchableOpacity
                    key={season.id}
                    onPress={() => setSelectedSeason(season)}
                    style={[
                      styles.tabChip,
                      {
                        backgroundColor: isSelected ? season.color : theme.surfaceCard,
                        borderColor: isSelected ? season.color : theme.border,
                      },
                    ]}
                  >
                    <Ionicons
                      name={season.icon as any}
                      size={15}
                      color={isSelected ? '#FFFFFF' : season.color}
                    />
                    <Text
                      style={[
                        styles.tabChipText,
                        { color: isSelected ? '#FFFFFF' : theme.textSecondary },
                      ]}
                    >
                      {season.name}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>

          {/* Church Season Information Card */}
          <View style={[styles.seasonCard, { backgroundColor: theme.surfaceCard, borderColor: theme.border }]}>
            <View style={styles.seasonCardHeader}>
              <View style={[styles.seasonIconBox, { backgroundColor: selectedSeason.color + '22' }]}>
                <Ionicons name={selectedSeason.icon as any} size={22} color={selectedSeason.color} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.seasonCardTitle, { color: theme.text }]}>
                  {selectedSeason.name}
                </Text>
                <Text style={[styles.seasonCardYoruba, { color: selectedSeason.color }]}>
                  {selectedSeason.yorubaName}
                </Text>
              </View>
            </View>

            <View style={styles.seasonMetaRow}>
              <View style={[styles.seasonMetaPill, { backgroundColor: theme.background }]}>
                <Ionicons name="time-outline" size={12} color={theme.textMuted} />
                <Text style={[styles.seasonMetaText, { color: theme.textSecondary }]}>
                  {selectedSeason.periodDescription}
                </Text>
              </View>
            </View>

            <Text style={[styles.seasonScripture, { color: theme.accentGold }]}>
              📖 {selectedSeason.scriptureTheme}
            </Text>

            <Text style={[styles.seasonDesc, { color: theme.textSecondary }]}>
              {selectedSeason.description}
            </Text>

            <View style={styles.seasonHymnCountRow}>
              <Text style={[styles.seasonHymnCountText, { color: theme.textMuted }]}>
                {hymnsInSeason.length} designated hymns for this liturgical season
              </Text>
            </View>
          </View>

          {/* Season Hymns List */}
          <FlatList
            data={hymnsInSeason}
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
            initialNumToRender={12}
          />
        </View>
      )}

      {mode === 'histories' && (
        /* Mode 3: Hymn Histories & Historical Backgrounds */
        <View style={{ flex: 1 }}>
          {/* Search Box */}
          <View style={[styles.historySearchWrapper, { backgroundColor: theme.surface, borderBottomColor: theme.border }]}>
            <View style={[styles.historySearchInputBox, { backgroundColor: theme.background, borderColor: theme.border }]}>
              <Ionicons name="search" size={16} color={theme.textMuted} />
              <TextInput
                placeholder="Search hymn history, author, title, story..."
                placeholderTextColor={theme.textMuted}
                value={historyQuery}
                onChangeText={setHistoryQuery}
                style={[styles.historySearchInput, { color: theme.text }]}
                clearButtonMode="while-editing"
              />
              {historyQuery ? (
                <TouchableOpacity onPress={() => setHistoryQuery('')}>
                  <Ionicons name="close-circle" size={16} color={theme.textMuted} />
                </TouchableOpacity>
              ) : null}
            </View>
          </View>

          {/* Category Filter Chips */}
          <View style={[styles.historyFilterRow, { backgroundColor: theme.surface, borderBottomColor: theme.border }]}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabsContent}>
              <TouchableOpacity
                onPress={() => setHistoryCategory('all')}
                style={[
                  styles.tabChip,
                  {
                    backgroundColor: historyCategory === 'all' ? theme.primary : theme.surfaceCard,
                    borderColor: historyCategory === 'all' ? theme.primary : theme.border,
                  },
                ]}
              >
                <Ionicons
                  name="library"
                  size={14}
                  color={historyCategory === 'all' ? '#FFFFFF' : theme.textSecondary}
                />
                <Text
                  style={[
                    styles.tabChipText,
                    { color: historyCategory === 'all' ? '#FFFFFF' : theme.textSecondary },
                  ]}
                >
                  All Histories ({allStories.length})
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setHistoryCategory('cs_heritage')}
                style={[
                  styles.tabChip,
                  {
                    backgroundColor: historyCategory === 'cs_heritage' ? theme.accentGold : theme.surfaceCard,
                    borderColor: historyCategory === 'cs_heritage' ? theme.accentGold : theme.border,
                  },
                ]}
              >
                <Ionicons
                  name="sparkles"
                  size={14}
                  color={historyCategory === 'cs_heritage' ? '#000000' : theme.accentGold}
                />
                <Text
                  style={[
                    styles.tabChipText,
                    {
                      color: historyCategory === 'cs_heritage' ? '#000000' : theme.textSecondary,
                      fontWeight: historyCategory === 'cs_heritage' ? '700' : '500',
                    },
                  ]}
                >
                  👑 Seraphic Heritage ({allStories.filter((s) => s.category === 'cs_heritage').length})
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setHistoryCategory('general_classic')}
                style={[
                  styles.tabChip,
                  {
                    backgroundColor: historyCategory === 'general_classic' ? theme.primary : theme.surfaceCard,
                    borderColor: historyCategory === 'general_classic' ? theme.primary : theme.border,
                  },
                ]}
              >
                <Ionicons
                  name="globe-outline"
                  size={14}
                  color={historyCategory === 'general_classic' ? '#FFFFFF' : theme.textSecondary}
                />
                <Text
                  style={[
                    styles.tabChipText,
                    { color: historyCategory === 'general_classic' ? '#FFFFFF' : theme.textSecondary },
                  ]}
                >
                  🌍 Classic Pillars ({allStories.filter((s) => s.category === 'general_classic').length})
                </Text>
              </TouchableOpacity>
            </ScrollView>
          </View>

          {/* Stories List */}
          <FlatList
            data={filteredStories}
            keyExtractor={(item) => item.hymnId.toString()}
            contentContainerStyle={styles.historyListContent}
            renderItem={({ item }) => {
              const isExpanded = expandedStoryIds[item.hymnId] ?? false;
              return (
                <View style={[styles.historyCard, { backgroundColor: theme.surfaceCard, borderColor: theme.border }]}>
                  {/* Top Bar: Hymn Number, Badges, Category */}
                  <View style={styles.historyCardTopRow}>
                    <View style={styles.historyHymnBadgeRow}>
                      <View style={[styles.historyNumberBadge, { backgroundColor: theme.primary }]}>
                        <Text style={styles.historyNumberBadgeText}>
                          {item.hymnNumber || `Hymn ${item.hymnId}`}
                        </Text>
                      </View>
                      <View
                        style={[
                          styles.historyCategoryPill,
                          {
                            backgroundColor:
                              item.category === 'cs_heritage'
                                ? theme.accentGold + '20'
                                : theme.primary + '18',
                            borderColor:
                              item.category === 'cs_heritage'
                                ? theme.accentGold + '40'
                                : theme.primary + '35',
                          },
                        ]}
                      >
                        <Text
                          style={[
                            styles.historyCategoryPillText,
                            {
                              color:
                                item.category === 'cs_heritage'
                                  ? theme.accentGold
                                  : theme.primary,
                            },
                          ]}
                        >
                          {item.category === 'cs_heritage' ? '👑 C&S Heritage' : '🌍 Global Pillar'}
                        </Text>
                      </View>
                    </View>

                    {item.year ? (
                      <Text style={[styles.historyYearText, { color: theme.textMuted }]}>
                        {item.year}
                      </Text>
                    ) : null}
                  </View>

                  {/* Title & Author */}
                  <Text style={[styles.historyCardTitle, { color: theme.text }]}>
                    {item.title}
                  </Text>
                  <Text style={[styles.historyCardAuthor, { color: theme.textSecondary }]}>
                    ✍️ By <Text style={{ fontWeight: '700', color: theme.text }}>{item.author}</Text>
                  </Text>

                  {/* Scripture Reference */}
                  {item.scriptureReference ? (
                    <Text style={[styles.historyScriptureText, { color: theme.accentGold }]}>
                      📖 {item.scriptureReference}
                    </Text>
                  ) : null}

                  {/* Narrative Body */}
                  <Text
                    style={[styles.historyStoryText, { color: theme.textSecondary }]}
                    numberOfLines={isExpanded ? undefined : 4}
                  >
                    {item.originStory}
                  </Text>

                  {item.originStory && item.originStory.length > 200 ? (
                    <TouchableOpacity
                      onPress={() => toggleExpandStory(item.hymnId)}
                      style={styles.historyExpandBtn}
                      hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
                    >
                      <Text style={[styles.historyExpandText, { color: theme.primary }]}>
                        {isExpanded ? 'Show Less ▲' : 'Read Full History ▼'}
                      </Text>
                    </TouchableOpacity>
                  ) : null}

                  {/* Spiritual Takeaway Box */}
                  {item.spiritualTakeaway && isExpanded ? (
                    <View style={[styles.historyTakeawayBox, { backgroundColor: theme.primary + '10', borderColor: theme.primary + '30' }]}>
                      <Text style={[styles.historyTakeawayLabel, { color: theme.primary }]}>
                        💡 Spiritual Takeaway
                      </Text>
                      <Text style={[styles.historyTakeawayText, { color: theme.textSecondary }]}>
                        {item.spiritualTakeaway}
                      </Text>
                    </View>
                  ) : null}

                  {/* Bottom Action: Open Hymn in HymnDetailScreen */}
                  <View style={[styles.historyActionRow, { borderTopColor: theme.border }]}>
                    <TouchableOpacity
                      onPress={() => onSelectHymn(item.hymnId)}
                      style={[styles.historyOpenHymnBtn, { backgroundColor: theme.primary }]}
                      activeOpacity={0.8}
                    >
                      <Ionicons name="musical-notes" size={15} color="#FFFFFF" />
                      <Text style={styles.historyOpenHymnText}>Open Hymn & Sing</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              );
            }}
          />
        </View>
      )}

      {/* Bulk Offline Audio Downloader Modal */}
      <DownloadAllTunesModal
        visible={showDownloadModal}
        theme={theme}
        onClose={() => setShowDownloadModal(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  mainSegmentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  tabButtonsGroup: {
    flexDirection: 'row',
    flex: 1,
  },
  segmentBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    marginRight: 18,
    gap: 6,
  },
  activeSegmentBtn: {
    borderBottomWidth: 3,
  },
  segmentBtnText: {
    fontSize: 13.5,
    fontWeight: '700',
  },
  audioPackBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 14,
    borderWidth: 1,
    gap: 4,
  },
  audioPackBtnText: {
    fontSize: 11.5,
    fontWeight: '700',
  },
  tabsWrapper: {
    paddingVertical: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  tabsContent: {
    paddingHorizontal: 16,
    gap: 8,
  },
  tabChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 13,
    paddingVertical: 7,
    borderRadius: 18,
    borderWidth: 1,
    gap: 6,
  },
  tabChipText: {
    fontSize: 12.5,
    fontWeight: '700',
  },
  sectionBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginTop: 12,
    marginBottom: 8,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    gap: 12,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '800',
    marginBottom: 2,
  },
  sectionSub: {
    fontSize: 12,
    fontWeight: '500',
  },
  seasonCard: {
    marginHorizontal: 16,
    marginTop: 12,
    marginBottom: 8,
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
  },
  seasonCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 8,
  },
  seasonIconBox: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
  },
  seasonCardTitle: {
    fontSize: 16,
    fontWeight: '800',
  },
  seasonCardYoruba: {
    fontSize: 12.5,
    fontWeight: '700',
    marginTop: 1,
  },
  seasonMetaRow: {
    flexDirection: 'row',
    marginBottom: 6,
  },
  seasonMetaPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    gap: 5,
  },
  seasonMetaText: {
    fontSize: 11.5,
    fontWeight: '600',
  },
  seasonScripture: {
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 6,
  },
  seasonDesc: {
    fontSize: 12.5,
    lineHeight: 18,
    marginBottom: 8,
  },
  seasonHymnCountRow: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(128,128,128,0.2)',
    paddingTop: 8,
  },
  seasonHymnCountText: {
    fontSize: 11.5,
    fontWeight: '600',
  },
  listContent: {
    paddingBottom: 80,
  },
  historySearchWrapper: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  historySearchInputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    gap: 8,
  },
  historySearchInput: {
    flex: 1,
    fontSize: 14,
    paddingVertical: 0,
  },
  historyFilterRow: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    paddingVertical: 4,
  },
  historyListContent: {
    padding: 16,
    paddingBottom: 90,
  },
  historyCard: {
    borderRadius: 14,
    borderWidth: 1,
    padding: 16,
    marginBottom: 16,
  },
  historyCardTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  historyHymnBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  historyNumberBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  historyNumberBadgeText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 12,
  },
  historyCategoryPill: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
  },
  historyCategoryPillText: {
    fontSize: 11,
    fontWeight: '700',
  },
  historyYearText: {
    fontSize: 12,
    fontWeight: '600',
  },
  historyCardTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
    lineHeight: 22,
  },
  historyCardAuthor: {
    fontSize: 13,
    marginBottom: 8,
  },
  historyScriptureText: {
    fontSize: 12,
    fontWeight: '600',
    fontStyle: 'italic',
    marginBottom: 8,
  },
  historyStoryText: {
    fontSize: 13.5,
    lineHeight: 21,
  },
  historyExpandBtn: {
    alignSelf: 'flex-start',
    marginTop: 6,
    marginBottom: 4,
  },
  historyExpandText: {
    fontSize: 12.5,
    fontWeight: '700',
  },
  historyTakeawayBox: {
    marginTop: 10,
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
  },
  historyTakeawayLabel: {
    fontSize: 12,
    fontWeight: '800',
    marginBottom: 3,
  },
  historyTakeawayText: {
    fontSize: 12.5,
    lineHeight: 18,
  },
  historyActionRow: {
    marginTop: 14,
    paddingTop: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  historyOpenHymnBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 6,
  },
  historyOpenHymnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
});
