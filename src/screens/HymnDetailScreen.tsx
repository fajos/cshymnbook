import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Share,
  Platform,
  Alert,
} from 'react-native';
import * as Clipboard from 'expo-clipboard';
import { Ionicons } from '@expo/vector-icons';
import { Hymn, ThemeMode, Setlist } from '../types/hymn';
import { ThemeColors } from '../constants/theme';
import { getHymnById, getSurroundingHymns } from '../services/hymnService';
import { AddToSetlistModal } from '../components/AddToSetlistModal';

interface HymnDetailScreenProps {
  hymnId: number;
  theme: ThemeColors;
  themeMode: ThemeMode;
  fontSize: number;
  isFavorite: boolean;
  setlists: Setlist[];
  onBack: () => void;
  onSelectHymn: (hymnId: number) => void;
  onToggleFavorite: (hymnId: number) => void;
  onChangeTheme: (theme: ThemeMode) => void;
  onChangeFontSize: (newSize: number) => void;
  onAddToSetlist: (setlistId: string, hymnId: number) => Promise<void>;
  onCreateAndAddSetlist: (name: string, description?: string, hymnId?: number) => Promise<void>;
}

const STORE_URL = Platform.select({
  ios: 'https://apps.apple.com/app/id6829350908',
  android: 'https://play.google.com/store/apps/details?id=com.fajostech.cshymnbook',
  default: 'https://apps.apple.com/app/id6829350908',
});

export const HymnDetailScreen: React.FC<HymnDetailScreenProps> = ({
  hymnId,
  theme,
  themeMode,
  fontSize,
  isFavorite,
  setlists,
  onBack,
  onSelectHymn,
  onToggleFavorite,
  onChangeTheme,
  onChangeFontSize,
  onAddToSetlist,
  onCreateAndAddSetlist,
}) => {
  const hymn = getHymnById(hymnId);
  const { prev, next } = getSurroundingHymns(hymnId);
  const scrollViewRef = useRef<any>(null);
  const [showFontControls, setShowFontControls] = useState(false);
  const [showSetlistModal, setShowSetlistModal] = useState(false);

  if (!hymn) {
    return (
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <Text style={[styles.emptyText, { color: theme.text }]}>Hymn not found.</Text>
      </View>
    );
  }

  // Format hymn text for sharing / copying
  const getShareableText = () => {
    let output = `${hymn.hymn_number}: ${hymn.title}\n`;
    output += `Category: ${hymn.category_name}\n`;
    if (hymn.meter) output += `Tune/Meter: ${hymn.meter}\n`;
    if (hymn.scripture) output += `Scripture: ${hymn.scripture}\n\n`;

    hymn.stanzas.forEach((s) => {
      output += `${s.number}\n${s.text}\n`;
      if (s.chorus) {
        output += `Egbe:\n${s.chorus}\n`;
      }
      output += '\n';
    });

    if (hymn.amen) {
      output += `${hymn.amen}\n`;
    }

    output += `\n— Shared from C&S Hymn Book\nDownload: ${STORE_URL}`;
    return output;
  };

  const handleShare = async () => {
    try {
      const text = getShareableText();
      await Share.share({
        message: text,
        title: `${hymn.hymn_number}: ${hymn.title}`,
      });
    } catch {}
  };

  const handleCopy = async () => {
    try {
      const text = getShareableText();
      await Clipboard.setStringAsync(text);
      Alert.alert('Copied', 'Hymn lyrics copied to clipboard!');
    } catch {}
  };

  const handleCycleTheme = () => {
    const cycle: ThemeMode[] = ['light', 'dark', 'sepia'];
    const nextIdx = (cycle.indexOf(themeMode) + 1) % cycle.length;
    onChangeTheme(cycle[nextIdx]);
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Top Header */}
      <View style={[styles.header, { backgroundColor: theme.surface, borderBottomColor: theme.border }]}>
        <TouchableOpacity onPress={onBack} style={styles.headerBtn} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
          <Ionicons name="arrow-back" size={24} color={theme.text} />
        </TouchableOpacity>

        <View style={styles.headerTitleBox}>
          <Text style={[styles.headerHymnNum, { color: theme.primary }]}>
            {hymn.hymn_number}
          </Text>
        </View>

        <View style={styles.headerActions}>
          {/* Favorite */}
          <TouchableOpacity onPress={() => onToggleFavorite(hymn.id)} style={styles.headerBtn} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
            <Ionicons name={isFavorite ? 'heart' : 'heart-outline'} size={22} color={isFavorite ? '#EF4444' : theme.text} />
          </TouchableOpacity>

          {/* Add to Service Set */}
          <TouchableOpacity
            onPress={() => setShowSetlistModal(true)}
            style={styles.headerBtn}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Ionicons name="albums-outline" size={22} color={theme.text} />
          </TouchableOpacity>

          {/* Font Controls Toggle */}
          <TouchableOpacity onPress={() => setShowFontControls(!showFontControls)} style={styles.headerBtn} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
            <Ionicons name="text-outline" size={22} color={showFontControls ? theme.primary : theme.text} />
          </TouchableOpacity>

          {/* Theme Toggle */}
          <TouchableOpacity onPress={handleCycleTheme} style={styles.headerBtn} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
            <Ionicons
              name={themeMode === 'dark' ? 'moon' : themeMode === 'sepia' ? 'book' : 'sunny'}
              size={22}
              color={theme.accentGold}
            />
          </TouchableOpacity>

          {/* Share */}
          <TouchableOpacity onPress={handleShare} style={styles.headerBtn} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
            <Ionicons name="share-social-outline" size={22} color={theme.text} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Expandable Font Size Bar */}
      {showFontControls && (
        <View style={[styles.fontControlBar, { backgroundColor: theme.surfaceElevated, borderBottomColor: theme.border }]}>
          <Text style={[styles.fontLabel, { color: theme.textSecondary }]}>Font Size: {fontSize}px</Text>
          <View style={styles.fontButtons}>
            <TouchableOpacity
              onPress={() => onChangeFontSize(Math.max(14, fontSize - 2))}
              style={[styles.fontSizeBtn, { backgroundColor: theme.surface, borderColor: theme.border }]}
            >
              <Text style={[styles.fontSizeBtnText, { color: theme.text }]}>A-</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => onChangeFontSize(18)}
              style={[styles.fontSizeBtn, { backgroundColor: theme.surface, borderColor: theme.border }]}
            >
              <Text style={[styles.fontSizeResetText, { color: theme.textMuted }]}>Reset</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => onChangeFontSize(Math.min(32, fontSize + 2))}
              style={[styles.fontSizeBtn, { backgroundColor: theme.surface, borderColor: theme.border }]}
            >
              <Text style={[styles.fontSizeBtnText, { color: theme.text }]}>A+</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleCopy}
              style={[styles.fontSizeBtn, { backgroundColor: theme.primary + '20', borderColor: theme.primary }]}
            >
              <Ionicons name="copy-outline" size={16} color={theme.primary} />
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Hymn Body ScrollView */}
      <ScrollView
        ref={scrollViewRef}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Hymn Header Info Card */}
        <View style={[styles.infoCard, { backgroundColor: theme.surfaceCard, borderColor: theme.border }]}>
          <View style={styles.badgeRow}>
            <View style={[styles.badge, { backgroundColor: theme.primary + '15' }]}>
              <Text style={[styles.badgeText, { color: theme.primary }]}>
                {hymn.hymn_number}
              </Text>
            </View>

            <View style={[styles.catBadge, { backgroundColor: theme.borderLight }]}>
              <Text style={[styles.catText, { color: theme.textSecondary }]} numberOfLines={1}>
                {hymn.category_name}
              </Text>
            </View>

            <TouchableOpacity
              onPress={() => setShowSetlistModal(true)}
              style={[styles.addToSetChip, { borderColor: theme.accentGold, backgroundColor: theme.accentGold + '15' }]}
            >
              <Ionicons name="bookmark-outline" size={13} color={theme.accentGold} />
              <Text style={[styles.addToSetChipText, { color: theme.accentGold }]}>Add to Set</Text>
            </TouchableOpacity>
          </View>

          <Text style={[styles.hymnTitle, { color: theme.text }]}>
            {hymn.title}
          </Text>

          {hymn.meter ? (
            <View style={[styles.meterCard, { backgroundColor: theme.background }]}>
              <Ionicons name="musical-note" size={14} color={theme.accentGold} />
              <Text style={[styles.meterLabel, { color: theme.accentGold }]}>Ohun Orin / Tune:</Text>
              <Text style={[styles.meterVal, { color: theme.textSecondary }]}>{hymn.meter}</Text>
            </View>
          ) : null}

          {hymn.scripture ? (
            <View style={[styles.scriptureCard, { backgroundColor: theme.scriptureBg }]}>
              <Text style={[styles.scriptureText, { color: theme.scriptureText }]}>
                “{hymn.scripture}”
              </Text>
            </View>
          ) : null}
        </View>

        {/* Stanzas */}
        <View style={styles.stanzasContainer}>
          {hymn.stanzas.map((stanza, idx) => (
            <View
              key={idx}
              style={[
                styles.stanzaCard,
                { backgroundColor: theme.surfaceCard, borderColor: theme.border },
              ]}
            >
              <View style={styles.stanzaHeader}>
                <View style={[styles.stanzaBadge, { backgroundColor: theme.primary + '20' }]}>
                  <Text style={[styles.stanzaBadgeText, { color: theme.primary }]}>
                    {stanza.number}
                  </Text>
                </View>
              </View>

              <Text style={[styles.stanzaText, { color: theme.text, fontSize, lineHeight: fontSize * 1.55 }]}>
                {stanza.text}
              </Text>

              {/* Chorus if stanza has one */}
              {stanza.chorus ? (
                <View style={[styles.chorusBox, { backgroundColor: theme.chorusBg, borderColor: theme.chorusBorder }]}>
                  <Text style={[styles.chorusHeader, { color: theme.accentGold }]}>Egbe:</Text>
                  <Text style={[styles.chorusText, { color: theme.text, fontSize: fontSize * 0.95, lineHeight: fontSize * 1.45 }]}>
                    {stanza.chorus}
                  </Text>
                </View>
              ) : null}
            </View>
          ))}
        </View>

        {/* Amen Banner */}
        {hymn.amen ? (
          <View style={[styles.amenBanner, { backgroundColor: theme.primary + '15', borderColor: theme.primary + '30' }]}>
            <Text style={[styles.amenText, { color: theme.primary }]}>
              {hymn.amen}
            </Text>
          </View>
        ) : null}
      </ScrollView>

      {/* Bottom Prev / Next Bar */}
      <View style={[styles.bottomBar, { backgroundColor: theme.surface, borderTopColor: theme.border }]}>
        {prev ? (
          <TouchableOpacity
            style={[styles.navButton, { borderColor: theme.border }]}
            onPress={() => {
              onSelectHymn(prev.id);
              scrollViewRef.current?.scrollTo({ y: 0, animated: false });
            }}
          >
            <Ionicons name="chevron-back" size={20} color={theme.primary} />
            <View style={styles.navTextCol}>
              <Text style={[styles.navSub, { color: theme.textMuted }]}>Preceding</Text>
              <Text style={[styles.navMain, { color: theme.text }]} numberOfLines={1}>
                {prev.hymn_number}
              </Text>
            </View>
          </TouchableOpacity>
        ) : (
          <View style={{ flex: 1 }} />
        )}

        {next ? (
          <TouchableOpacity
            style={[styles.navButton, styles.navNext, { borderColor: theme.border }]}
            onPress={() => {
              onSelectHymn(next.id);
              scrollViewRef.current?.scrollTo({ y: 0, animated: false });
            }}
          >
            <View style={[styles.navTextCol, { alignItems: 'flex-end' }]}>
              <Text style={[styles.navSub, { color: theme.textMuted }]}>Next</Text>
              <Text style={[styles.navMain, { color: theme.text }]} numberOfLines={1}>
                {next.hymn_number}
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={theme.primary} />
          </TouchableOpacity>
        ) : (
          <View style={{ flex: 1 }} />
        )}
      </View>

      {/* Add To Service Set Modal */}
      <AddToSetlistModal
        visible={showSetlistModal}
        hymnId={hymn.id}
        hymnNumber={hymn.hymn_number}
        hymnTitle={hymn.title}
        setlists={setlists}
        theme={theme}
        onClose={() => setShowSetlistModal(false)}
        onAddToSetlist={async (setlistId) => {
          await onAddToSetlist(setlistId, hymn.id);
          Alert.alert('Saved', `Added ${hymn.hymn_number} to Service Set!`);
        }}
        onCreateAndAdd={async (name, desc) => {
          await onCreateAndAddSetlist(name, desc, hymn.id);
          Alert.alert('Created & Added', `Service set "${name}" created with ${hymn.hymn_number}!`);
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    height: Platform.OS === 'ios' ? 56 : 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    elevation: 2,
  },
  headerBtn: {
    padding: 6,
    borderRadius: 20,
  },
  headerTitleBox: {
    flex: 1,
    alignItems: 'center',
  },
  headerHymnNum: {
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  fontControlBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  fontLabel: {
    fontSize: 13,
    fontWeight: '600',
  },
  fontButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  fontSizeBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
  },
  fontSizeBtnText: {
    fontSize: 14,
    fontWeight: '700',
  },
  fontSizeResetText: {
    fontSize: 12,
    fontWeight: '500',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  infoCard: {
    padding: 18,
    borderRadius: 18,
    borderWidth: 1,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
    flexWrap: 'wrap',
  },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 8,
  },
  badgeText: {
    fontSize: 14,
    fontWeight: '800',
  },
  catBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    maxWidth: 180,
  },
  catText: {
    fontSize: 12,
    fontWeight: '600',
  },
  addToSetChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    gap: 4,
  },
  addToSetChipText: {
    fontSize: 11,
    fontWeight: '700',
  },
  hymnTitle: {
    fontSize: 22,
    fontWeight: '800',
    lineHeight: 28,
    letterSpacing: -0.3,
    marginBottom: 12,
  },
  meterCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 10,
    gap: 6,
    marginBottom: 10,
  },
  meterLabel: {
    fontSize: 12,
    fontWeight: '700',
  },
  meterVal: {
    fontSize: 12,
    fontWeight: '600',
    flex: 1,
  },
  scriptureCard: {
    padding: 12,
    borderRadius: 12,
    marginTop: 2,
  },
  scriptureText: {
    fontSize: 13,
    fontWeight: '600',
    fontStyle: 'italic',
    lineHeight: 18,
  },
  stanzasContainer: {
    gap: 14,
  },
  stanzaCard: {
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 3,
  },
  stanzaHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  stanzaBadge: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 6,
  },
  stanzaBadgeText: {
    fontSize: 12,
    fontWeight: '800',
  },
  stanzaText: {
    fontWeight: '500',
  },
  chorusBox: {
    marginTop: 12,
    padding: 12,
    borderRadius: 10,
    borderLeftWidth: 4,
  },
  chorusHeader: {
    fontSize: 12,
    fontWeight: '800',
    marginBottom: 4,
  },
  chorusText: {
    fontWeight: '500',
    fontStyle: 'italic',
  },
  amenBanner: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    marginTop: 20,
    marginBottom: 10,
  },
  amenText: {
    fontSize: 18,
    fontWeight: '900',
    letterSpacing: 2,
  },
  bottomBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderTopWidth: StyleSheet.hairlineWidth,
    gap: 12,
  },
  navButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 12,
    borderWidth: 1,
    gap: 8,
  },
  navNext: {
    justifyContent: 'flex-end',
  },
  navTextCol: {
    flex: 1,
  },
  navSub: {
    fontSize: 11,
    fontWeight: '500',
  },
  navMain: {
    fontSize: 13,
    fontWeight: '700',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 40,
    fontSize: 16,
  },
});
