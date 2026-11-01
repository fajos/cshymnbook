import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Category } from '../types/hymn';
import { ThemeColors } from '../constants/theme';

interface CategoryCardProps {
  category: Category;
  theme: ThemeColors;
  onPress: () => void;
}

export const CategoryCard: React.FC<CategoryCardProps> = ({
  category,
  theme,
  onPress,
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
      <View style={[styles.badge, { backgroundColor: theme.primary + '15' }]}>
        <Text style={[styles.badgeText, { color: theme.primary }]}>
          {category.number}
        </Text>
      </View>

      <View style={styles.content}>
        <Text style={[styles.name, { color: theme.text }]} numberOfLines={2}>
          {category.name}
        </Text>

        <View style={styles.footer}>
          <Text style={[styles.range, { color: theme.accentGold }]}>
            {category.range}
          </Text>
          <View style={styles.countWrapper}>
            <Text style={[styles.count, { color: theme.textSecondary }]}>
              {category.hymnCount} hymns
            </Text>
            <Ionicons name="chevron-forward" size={16} color={theme.textMuted} />
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
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
  badge: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  badgeText: {
    fontSize: 16,
    fontWeight: '800',
  },
  content: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  range: {
    fontSize: 12,
    fontWeight: '600',
  },
  countWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  count: {
    fontSize: 12,
    fontWeight: '500',
  },
});
