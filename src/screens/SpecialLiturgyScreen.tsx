import React, { useState } from 'react';
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
import { getHymnsByCategory, SPECIAL_SECTIONS } from '../services/hymnService';
import { HymnCard } from '../components/HymnCard';

interface SpecialLiturgyScreenProps {
  theme: ThemeColors;
  favorites: number[];
  onSelectHymn: (hymnId: number) => void;
  onToggleFavorite: (hymnId: number) => void;
}

export const SpecialLiturgyScreen: React.FC<SpecialLiturgyScreenProps> = ({
  theme,
  favorites,
  onSelectHymn,
  onToggleFavorite,
}) => {
  const [selectedSection, setSelectedSection] = useState(SPECIAL_SECTIONS[0]);
  const hymnsInSection = getHymnsByCategory(selectedSection.categoryId);

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Horizontal Liturgical Tabs */}
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
                  size={16}
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
        <Ionicons name={selectedSection.icon as any} size={28} color={theme.accentGold} />
        <View style={{ flex: 1 }}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            {selectedSection.name}
          </Text>
          <Text style={[styles.sectionSub, { color: theme.textMuted }]}>
            {hymnsInSection.length} Liturgical entries
          </Text>
        </View>
      </View>

      {/* Hymns List */}
      <FlatList
        data={hymnsInSection}
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
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    gap: 6,
  },
  tabChipText: {
    fontSize: 13,
    fontWeight: '700',
  },
  sectionBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 16,
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    gap: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 2,
  },
  sectionSub: {
    fontSize: 12,
    fontWeight: '500',
  },
  listContent: {
    paddingBottom: 80,
  },
});
