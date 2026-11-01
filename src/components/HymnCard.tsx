import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Hymn } from '../types/hymn';
import { ThemeColors } from '../constants/theme';

interface HymnCardProps {
  hymn: Hymn;
  theme: ThemeColors;
  isFavorite: boolean;
  onPress: () => void;
  onToggleFavorite: () => void;
}

export const HymnCard: React.FC<HymnCardProps> = ({
  hymn,
  theme,
  isFavorite,
  onPress,
  onToggleFavorite,
}) => {
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onPress}
      style={[
        styles.card,
        {
          backgroundColor: theme.surfaceCard,
          borderColor: theme.border,
        },
      ]}
    >
      <View style={styles.topRow}>
        <View style={[styles.numberBadge, { backgroundColor: theme.primaryLight + '20' }]}>
          <Text style={[styles.numberText, { color: theme.primary }]}>
            {hymn.hymn_number}
          </Text>
        </View>

        <View style={styles.tagsContainer}>
          {hymn.meter ? (
            <View style={[styles.meterBadge, { backgroundColor: theme.borderLight }]}>
              <Text style={[styles.meterText, { color: theme.textSecondary }]} numberOfLines={1}>
                {hymn.meter}
              </Text>
            </View>
          ) : null}

          <TouchableOpacity
            onPress={(e) => {
              e.stopPropagation();
              onToggleFavorite();
            }}
            style={styles.favButton}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons
              name={isFavorite ? 'heart' : 'heart-outline'}
              size={20}
              color={isFavorite ? '#EF4444' : theme.textMuted}
            />
          </TouchableOpacity>
        </View>
      </View>

      <Text style={[styles.title, { color: theme.text }]} numberOfLines={2}>
        {hymn.title}
      </Text>

      {hymn.scripture ? (
        <Text style={[styles.scripture, { color: theme.scriptureText }]} numberOfLines={1}>
          📖 {hymn.scripture}
        </Text>
      ) : null}

      <View style={styles.bottomRow}>
        <Text style={[styles.category, { color: theme.textSecondary }]} numberOfLines={1}>
          {hymn.category_name}
        </Text>
        <Text style={[styles.stanzasCount, { color: theme.textMuted }]}>
          {hymn.stanzas.length} {hymn.stanzas.length === 1 ? 'ẹsẹ' : 'ẹsẹ'}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 16,
    marginVertical: 6,
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  numberBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  numberText: {
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  tagsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  meterBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    maxWidth: 150,
  },
  meterText: {
    fontSize: 11,
    fontWeight: '600',
  },
  favButton: {
    padding: 4,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    lineHeight: 22,
    marginBottom: 6,
  },
  scripture: {
    fontSize: 12,
    fontWeight: '500',
    fontStyle: 'italic',
    marginBottom: 8,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(150, 150, 150, 0.15)',
    paddingTop: 8,
    marginTop: 2,
  },
  category: {
    fontSize: 12,
    fontWeight: '600',
    flex: 1,
  },
  stanzasCount: {
    fontSize: 11,
    fontWeight: '500',
    marginLeft: 8,
  },
});
