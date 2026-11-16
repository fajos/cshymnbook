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

interface SpecialLiturgyScreenProps {
  theme: ThemeColors;
  favorites: number[];
  onSelectHymn: (hymnId: number) => void;
  onToggleFavorite: (hymnId: number) => void;
}

type LiturgyMode = 'orders' | 'seasons';

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

      {mode === 'orders' ? (
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
      ) : (
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
});
