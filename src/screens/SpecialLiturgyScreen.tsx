import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemeColors } from '../constants/theme';
import { getHymnsByCategory, SPECIAL_SECTIONS, getHymnById } from '../services/hymnService';
import { CHURCH_SEASONS, ChurchSeason } from '../constants/churchSeasons';
import { HymnCard } from '../components/HymnCard';
import { DownloadAllTunesModal } from '../components/DownloadAllTunesModal';
import { Hymn } from '../types/hymn';
import { HymnHistoriesScreen } from './HymnHistoriesScreen';

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
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.tabScrollView}
          contentContainerStyle={styles.tabButtonsScroll}
        >
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
        </ScrollView>

        <View style={[styles.audioPackDivider, { backgroundColor: theme.border }]} />

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
          <HymnHistoriesScreen
            theme={theme}
            onSelectHymn={onSelectHymn}
            favorites={favorites}
            onToggleFavorite={onToggleFavorite}
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
    paddingLeft: 12,
    paddingRight: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    height: 48,
  },
  tabScrollView: {
    flex: 1,
  },
  tabButtonsScroll: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 8,
  },
  segmentBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 48,
    paddingHorizontal: 8,
    marginRight: 12,
    gap: 6,
  },
  activeSegmentBtn: {
    borderBottomWidth: 3,
  },
  segmentBtnText: {
    fontSize: 13.5,
    fontWeight: '700',
  },
  audioPackDivider: {
    width: 1,
    height: 22,
    marginHorizontal: 8,
  },
  audioPackBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 9,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    gap: 4,
    flexShrink: 0,
  },
  audioPackBtnText: {
    fontSize: 11,
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
