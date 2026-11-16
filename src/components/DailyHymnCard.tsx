import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemeColors } from '../constants/theme';
import { getHymnOfTheDay } from '../services/dailyHymnService';

interface DailyHymnCardProps {
  theme: ThemeColors;
  onPressHymn: (hymnId: number) => void;
}

export const DailyHymnCard: React.FC<DailyHymnCardProps> = ({ theme, onPressHymn }) => {
  const [collapsed, setCollapsed] = useState(false);
  const daily = getHymnOfTheDay();

  if (!daily || !daily.hymn) return null;

  return (
    <View style={[styles.card, { backgroundColor: theme.surfaceCard, borderColor: theme.border }]}>
      {/* Top Banner Row */}
      <View style={styles.topRow}>
        <View style={styles.titleRow}>
          <Ionicons name="sunny" size={17} color={theme.accentGold} />
          <Text style={[styles.badgeLabel, { color: theme.accentGold }]}>
            HYMN OF THE DAY
          </Text>
          <Text style={[styles.dateText, { color: theme.textMuted }]}>
            • {daily.dateString}
          </Text>
        </View>

        <TouchableOpacity
          onPress={() => setCollapsed(!collapsed)}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          style={styles.collapseBtn}
        >
          <Ionicons
            name={collapsed ? 'chevron-down' : 'chevron-up'}
            size={16}
            color={theme.textMuted}
          />
        </TouchableOpacity>
      </View>

      {!collapsed && (
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => onPressHymn(daily.hymn.id)}
          style={styles.contentBox}
        >
          <View style={styles.hymnHeaderRow}>
            <View style={[styles.numberBadge, { backgroundColor: theme.primary + '18' }]}>
              <Text style={[styles.numberText, { color: theme.primary }]}>
                {daily.hymn.hymn_number}
              </Text>
            </View>

            <View style={[styles.themePill, { backgroundColor: theme.borderLight }]}>
              <Text style={[styles.themePillText, { color: theme.textSecondary }]} numberOfLines={1}>
                {daily.themeTitle}
              </Text>
            </View>
          </View>

          <Text style={[styles.hymnTitle, { color: theme.text }]} numberOfLines={1}>
            {daily.hymn.title}
          </Text>

          {daily.hymn.english_title ? (
            <Text style={[styles.englishTitle, { color: theme.accentGold }]} numberOfLines={1}>
              {daily.hymn.english_title}
            </Text>
          ) : null}

          {daily.verseExcerpt ? (
            <Text style={[styles.verseExcerpt, { color: theme.textSecondary }]} numberOfLines={2}>
              "{daily.verseExcerpt}"
            </Text>
          ) : null}

          <View style={styles.actionRow}>
            <Text style={[styles.actionText, { color: theme.primary }]}>
              Read & Sing Hymn
            </Text>
            <Ionicons name="arrow-forward" size={14} color={theme.primary} />
          </View>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 16,
    marginTop: 10,
    marginBottom: 6,
    borderRadius: 16,
    borderWidth: 1,
    padding: 14,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flex: 1,
  },
  badgeLabel: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.6,
  },
  dateText: {
    fontSize: 11,
    fontWeight: '500',
  },
  collapseBtn: {
    padding: 2,
  },
  contentBox: {
    marginTop: 10,
  },
  hymnHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  numberBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  numberText: {
    fontSize: 12,
    fontWeight: '800',
  },
  themePill: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    maxWidth: 200,
  },
  themePillText: {
    fontSize: 11,
    fontWeight: '600',
  },
  hymnTitle: {
    fontSize: 16,
    fontWeight: '700',
    lineHeight: 22,
    marginBottom: 2,
  },
  englishTitle: {
    fontSize: 13,
    fontWeight: '600',
    fontStyle: 'italic',
    marginBottom: 6,
  },
  verseExcerpt: {
    fontSize: 13,
    lineHeight: 18,
    fontStyle: 'italic',
    marginBottom: 10,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  actionText: {
    fontSize: 13,
    fontWeight: '700',
  },
});
