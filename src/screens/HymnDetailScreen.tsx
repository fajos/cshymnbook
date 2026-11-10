import React, { useState, useRef, useEffect } from 'react';
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
import { Hymn, ThemeMode, Setlist, Stanza } from '../types/hymn';
import { ThemeColors } from '../constants/theme';
import { getHymnById, getSurroundingHymns } from '../services/hymnService';
import { AddToSetlistModal } from '../components/AddToSetlistModal';
import { parseMeterString } from '../services/musicService';
import { getEnglishHymn } from '../constants/englishHymns';

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

const IOS_STORE_URL = 'https://apps.apple.com/app/id6829350908';
const ANDROID_STORE_URL = 'https://play.google.com/store/apps/details?id=com.fajostech.cshymnbook';

const getStoreShareFooter = (isCopy: boolean = false) => {
  if (Platform.OS === 'ios') {
    // On iOS, having 'https://' inside the share message causes UIActivityViewController
    // and receiving share extensions (WhatsApp, Messages, etc.) to treat the payload as
    // an App Store URL attachment, which strips away the entire hymn lyrics text!
    // Using 'apps.apple.com/app/id6829350908' on iOS prevents the text from being dropped,
    // while remaining fully clickable as a link in WhatsApp, iMessage, and other chat apps.
    const storeLink = isCopy ? IOS_STORE_URL : 'apps.apple.com/app/id6829350908';
    return `— Shared from C&S Hymn Book\nDownload on App Store: ${storeLink}`;
  }
  if (Platform.OS === 'android') {
    return `— Shared from C&S Hymn Book\nDownload on Google Play: ${ANDROID_STORE_URL}`;
  }
  return `— Shared from C&S Hymn Book\nDownload on App Store: ${IOS_STORE_URL}\nDownload on Google Play: ${ANDROID_STORE_URL}`;
};

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
  const [copiedStanza, setCopiedStanza] = useState<string | null>(null);

  // Hands-Free Auto-Scroll States & Refs
  const [isAutoScrollActive, setIsAutoScrollActive] = useState(false);
  const [isAutoScrollPlaying, setIsAutoScrollPlaying] = useState(false);
  const [scrollSpeed, setScrollSpeed] = useState<number>(1.0);

  const scrollYRef = useRef<number>(0);
  const contentHeightRef = useRef<number>(0);
  const layoutHeightRef = useRef<number>(0);
  const autoScrollTimerRef = useRef<any>(null);

  // Stop and reset auto-scroll when changing hymns
  useEffect(() => {
    setIsAutoScrollPlaying(false);
    setIsAutoScrollActive(false);
    setShowChoirMode(false);
    scrollYRef.current = 0;
  }, [hymnId]);

  // Choir Mode & Musical Meter Analysis
  const [showChoirMode, setShowChoirMode] = useState(false);
  const meterInfo = React.useMemo(() => parseMeterString(hymn?.meter), [hymn?.meter]);

  // Bilingual Language Mode ('yoruba' | 'english' | 'dual')
  const [languageMode, setLanguageMode] = useState<'yoruba' | 'english' | 'dual'>('yoruba');
  const englishHymn = React.useMemo(() => getEnglishHymn(hymnId), [hymnId]);

  // Auto-scroll animation loop
  useEffect(() => {
    if (isAutoScrollPlaying) {
      autoScrollTimerRef.current = setInterval(() => {
        const maxScroll = Math.max(0, contentHeightRef.current - layoutHeightRef.current);
        const step = 0.9 * scrollSpeed;
        const nextY = scrollYRef.current + step;
        if (nextY >= maxScroll) {
          setIsAutoScrollPlaying(false);
        } else {
          scrollYRef.current = nextY;
          scrollViewRef.current?.scrollTo({ y: nextY, animated: false });
        }
      }, 35);
    } else {
      if (autoScrollTimerRef.current) {
        clearInterval(autoScrollTimerRef.current);
        autoScrollTimerRef.current = null;
      }
    }
    return () => {
      if (autoScrollTimerRef.current) {
        clearInterval(autoScrollTimerRef.current);
        autoScrollTimerRef.current = null;
      }
    };
  }, [isAutoScrollPlaying, scrollSpeed]);

  if (!hymn) {
    return (
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <Text style={[styles.emptyText, { color: theme.text }]}>Hymn not found.</Text>
      </View>
    );
  }

  // Format hymn text for sharing / copying (aware of Yoruba, English, or Dual view)
  const getShareableText = (isCopy: boolean = false) => {
    let output = `${hymn.hymn_number}: ${hymn.title}`;
    if (englishHymn && languageMode !== 'yoruba') {
      output += ` (${englishHymn.englishTitle})`;
    }
    output += `\nCategory: ${hymn.category_name}\n`;
    if (hymn.meter) output += `Tune/Meter: ${hymn.meter}\n`;
    if (hymn.scripture) output += `Scripture: ${hymn.scripture}\n\n`;

    if (languageMode === 'english' && englishHymn) {
      englishHymn.stanzas.forEach((s) => {
        output += `${s.number}\n${s.text}\n`;
        if (s.chorus) output += `${s.chorus}\n`;
        output += '\n';
      });
    } else if (languageMode === 'dual' && englishHymn) {
      hymn.stanzas.forEach((s, idx) => {
        output += `${s.number} [Yorùbá]\n${s.text}\n`;
        if (s.chorus) output += `Egbe:\n${s.chorus}\n`;
        const eng = englishHymn.stanzas[idx];
        if (eng) {
          output += `[English Translation]\n${eng.text}\n`;
          if (eng.chorus) output += `${eng.chorus}\n`;
        }
        output += '\n';
      });
    } else {
      hymn.stanzas.forEach((s) => {
        output += `${s.number}\n${s.text}\n`;
        if (s.chorus) {
          output += `Egbe:\n${s.chorus}\n`;
        }
        output += '\n';
      });
    }

    if (hymn.amen) {
      output += `${hymn.amen}\n`;
    }

    output += `\n${getStoreShareFooter(isCopy)}`;
    return output;
  };

  const handleShare = async () => {
    try {
      const text = getShareableText(false);
      await Share.share(
        Platform.OS === 'ios'
          ? { message: text }
          : { message: text, title: `${hymn.hymn_number}: ${hymn.title}` }
      );
    } catch {}
  };

  const handleCopy = async () => {
    try {
      const text = getShareableText(true);
      await Clipboard.setStringAsync(text);
      Alert.alert('Copied', 'Hymn lyrics copied to clipboard!');
    } catch {}
  };

  // Format single stanza for sharing / copying
  const getStanzaShareableText = (stanza: Stanza, isCopy: boolean = false, stanzaIdx?: number) => {
    let output = `${hymn.hymn_number}: ${hymn.title}`;
    if (englishHymn && languageMode !== 'yoruba') {
      output += ` (${englishHymn.englishTitle})`;
    }
    output += `\nVerse ${stanza.number}\n\n`;

    const engStanza = typeof stanzaIdx === 'number' && englishHymn ? englishHymn.stanzas[stanzaIdx] : undefined;

    if (languageMode === 'english' && engStanza) {
      output += `${engStanza.text}\n`;
      if (engStanza.chorus) {
        output += `\n${engStanza.chorus}\n`;
      }
    } else if (languageMode === 'dual' && engStanza) {
      output += `[Yorùbá]\n${stanza.text}\n`;
      if (stanza.chorus) {
        output += `\nEgbe:\n${stanza.chorus}\n`;
      }
      output += `\n[English Translation]\n${engStanza.text}\n`;
      if (engStanza.chorus) {
        output += `\n${engStanza.chorus}\n`;
      }
    } else {
      output += `${stanza.text}\n`;
      if (stanza.chorus) {
        output += `\nEgbe:\n${stanza.chorus}\n`;
      }
    }

    output += `\n${getStoreShareFooter(isCopy)}`;
    return output;
  };

  const handleCopyStanza = async (stanza: Stanza, stanzaIdx?: number) => {
    try {
      const text = getStanzaShareableText(stanza, true, stanzaIdx);
      await Clipboard.setStringAsync(text);
      setCopiedStanza(stanza.number);
      setTimeout(() => {
        setCopiedStanza((curr) => (curr === stanza.number ? null : curr));
      }, 2000);
      if (Platform.OS !== 'web') {
        Alert.alert('Verse Copied', `Verse ${stanza.number} copied to clipboard!`);
      }
    } catch {}
  };

  const handleShareStanza = async (stanza: Stanza, stanzaIdx?: number) => {
    try {
      const text = getStanzaShareableText(stanza, false, stanzaIdx);
      await Share.share(
        Platform.OS === 'ios'
          ? { message: text }
          : { message: text, title: `${hymn.hymn_number} - Verse ${stanza.number}` }
      );
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
        scrollEventThrottle={16}
        onScroll={(e) => {
          scrollYRef.current = e.nativeEvent.contentOffset.y;
        }}
        onContentSizeChange={(_, h) => {
          contentHeightRef.current = h;
        }}
        onLayout={(e) => {
          layoutHeightRef.current = e.nativeEvent.layout.height;
        }}
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

          {englishHymn && (
            <Text style={[styles.englishHymnSubTitle, { color: theme.accentGold }]}>
              {englishHymn.englishTitle}
              {englishHymn.author ? ` • ${englishHymn.author}` : ''}
            </Text>
          )}

          {hymn.meter ? (
            <View style={[styles.meterCard, { backgroundColor: theme.background }]}>
              <View style={styles.meterCardRow}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, flex: 1 }}>
                  <Ionicons name="musical-notes" size={15} color={theme.accentGold} />
                  <Text style={[styles.meterLabel, { color: theme.accentGold }]}>Tune / Meter:</Text>
                  <Text style={[styles.meterVal, { color: theme.textSecondary }]} numberOfLines={1}>
                    {hymn.meter}
                  </Text>
                </View>
                {meterInfo && (
                  <TouchableOpacity
                    onPress={() => setShowChoirMode(!showChoirMode)}
                    style={[
                      styles.choirModeChip,
                      {
                        backgroundColor: showChoirMode ? theme.accentGold : theme.surface,
                        borderColor: theme.accentGold,
                      },
                    ]}
                  >
                    <Ionicons name="musical-note" size={12} color={showChoirMode ? '#000000' : theme.accentGold} />
                    <Text
                      style={[
                        styles.choirModeChipText,
                        { color: showChoirMode ? '#000000' : theme.accentGold },
                      ]}
                    >
                      {showChoirMode ? 'Hide Sol-fa' : 'Choir Sol-fa'}
                    </Text>
                  </TouchableOpacity>
                )}
              </View>

              {/* Choir Mode Expandable Box */}
              {showChoirMode && meterInfo && (
                <View style={[styles.choirDetailsBox, { borderColor: theme.border, backgroundColor: theme.surfaceCard }]}>
                  <View style={styles.choirMetaRow}>
                    <View style={[styles.meterTypeBadge, { backgroundColor: theme.primary + '18' }]}>
                      <Text style={[styles.meterTypeBadgeText, { color: theme.primary }]}>
                        {meterInfo.meterType}
                      </Text>
                    </View>
                    {meterInfo.editionRef ? (
                      <Text style={[styles.editionRefText, { color: theme.accentGold }]}>
                        {meterInfo.editionRef}
                      </Text>
                    ) : null}
                  </View>

                  {meterInfo.tonicSolFa ? (
                    <View style={styles.solFaContainer}>
                      <Text style={[styles.solFaKeyText, { color: theme.text }]}>
                        Key / Beat: <Text style={{ color: theme.accentGold, fontWeight: '700' }}>{meterInfo.tonicSolFa.keySuggestion}</Text> • {meterInfo.tonicSolFa.timeSignature}
                      </Text>
                      <View style={[styles.solFaScoreBox, { backgroundColor: theme.background, borderColor: theme.border }]}>
                        <Text style={[styles.solFaScoreText, { color: theme.text }]}>
                          {meterInfo.tonicSolFa.scaleSnippet}
                        </Text>
                      </View>
                      <Text style={[styles.solFaPatternNotes, { color: theme.textSecondary }]}>
                        💡 {meterInfo.tonicSolFa.patternNotes}
                      </Text>
                    </View>
                  ) : null}
                </View>
              )}
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

        {/* Language Selector Bar (Yorùbá | English | Dual View) */}
        <View style={[styles.langBarContainer, { backgroundColor: theme.surfaceCard, borderColor: theme.border }]}>
          <View style={styles.langBarLeft}>
            <Ionicons name="language" size={15} color={theme.accentGold} />
            <Text style={[styles.langBarTitle, { color: theme.text }]}>Language:</Text>
          </View>
          <View style={[styles.langSegmentGroup, { backgroundColor: theme.background, borderColor: theme.border }]}>
            <TouchableOpacity
              style={[
                styles.langSegmentBtn,
                languageMode === 'yoruba' && [styles.activeLangSegmentBtn, { backgroundColor: theme.primary }],
              ]}
              onPress={() => setLanguageMode('yoruba')}
            >
              <Text
                style={[
                  styles.langSegmentText,
                  { color: languageMode === 'yoruba' ? '#FFFFFF' : theme.textSecondary },
                ]}
              >
                Yorùbá
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.langSegmentBtn,
                languageMode === 'english' && [styles.activeLangSegmentBtn, { backgroundColor: theme.primary }],
              ]}
              onPress={() => setLanguageMode('english')}
            >
              <Text
                style={[
                  styles.langSegmentText,
                  { color: languageMode === 'english' ? '#FFFFFF' : theme.textSecondary },
                ]}
              >
                English {englishHymn ? '✓' : ''}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.langSegmentBtn,
                languageMode === 'dual' && [styles.activeLangSegmentBtn, { backgroundColor: theme.primary }],
              ]}
              onPress={() => setLanguageMode('dual')}
            >
              <Text
                style={[
                  styles.langSegmentText,
                  { color: languageMode === 'dual' ? '#FFFFFF' : theme.textSecondary },
                ]}
              >
                Dual View
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {languageMode === 'english' && !englishHymn && (
          <View style={[styles.noEnglishNotice, { backgroundColor: theme.primary + '12', borderColor: theme.primary + '30' }]}>
            <Ionicons name="information-circle-outline" size={18} color={theme.accentGold} />
            <Text style={[styles.noEnglishNoticeText, { color: theme.textSecondary }]}>
              English translation for this indigenous C&amp;S hymn is in preparation. Displaying original Yorùbá liturgical lyrics below.
            </Text>
          </View>
        )}

        {/* Stanzas */}
        <View style={styles.stanzasContainer}>
          {languageMode === 'english' && englishHymn ? (
            englishHymn.stanzas.map((stanza, idx) => (
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

                  <View style={styles.stanzaActions}>
                    <TouchableOpacity
                      onPress={() =>
                        handleCopyStanza(
                          hymn.stanzas[idx] || { number: stanza.number, text: stanza.text, chorus: stanza.chorus || '' },
                          idx
                        )
                      }
                      style={[
                        styles.stanzaActionBtn,
                        {
                          backgroundColor: copiedStanza === stanza.number ? '#10B98118' : theme.surface,
                          borderColor: copiedStanza === stanza.number ? '#10B981' : theme.border,
                        },
                      ]}
                      hitSlop={{ top: 8, bottom: 8, left: 6, right: 6 }}
                      accessibilityLabel={`Copy verse ${stanza.number}`}
                    >
                      <Ionicons
                        name={copiedStanza === stanza.number ? 'checkmark' : 'copy-outline'}
                        size={12}
                        color={copiedStanza === stanza.number ? '#059669' : theme.textSecondary}
                      />
                      <Text
                        style={[
                          styles.stanzaActionText,
                          { color: copiedStanza === stanza.number ? '#059669' : theme.textSecondary },
                        ]}
                      >
                        {copiedStanza === stanza.number ? 'Copied' : 'Copy'}
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={() =>
                        handleShareStanza(
                          hymn.stanzas[idx] || { number: stanza.number, text: stanza.text, chorus: stanza.chorus || '' },
                          idx
                        )
                      }
                      style={[styles.stanzaActionBtn, { backgroundColor: theme.surface, borderColor: theme.border }]}
                      hitSlop={{ top: 8, bottom: 8, left: 6, right: 6 }}
                      accessibilityLabel={`Share verse ${stanza.number}`}
                    >
                      <Ionicons name="share-social-outline" size={12} color={theme.textSecondary} />
                    </TouchableOpacity>
                  </View>
                </View>

                <Text style={[styles.stanzaText, { color: theme.text, fontSize, lineHeight: fontSize * 1.55 }]}>
                  {stanza.text}
                </Text>

                {stanza.chorus ? (
                  <View style={[styles.chorusBox, { backgroundColor: theme.chorusBg, borderColor: theme.chorusBorder }]}>
                    <Text style={[styles.chorusHeader, { color: theme.accentGold }]}>Refrain:</Text>
                    <Text style={[styles.chorusText, { color: theme.text, fontSize: fontSize * 0.95, lineHeight: fontSize * 1.45 }]}>
                      {stanza.chorus}
                    </Text>
                  </View>
                ) : null}
              </View>
            ))
          ) : (
            hymn.stanzas.map((stanza, idx) => {
              const engStanza = englishHymn?.stanzas[idx];
              return (
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

                    <View style={styles.stanzaActions}>
                      <TouchableOpacity
                        onPress={() => handleCopyStanza(stanza, idx)}
                        style={[
                          styles.stanzaActionBtn,
                          {
                            backgroundColor: copiedStanza === stanza.number ? '#10B98118' : theme.surface,
                            borderColor: copiedStanza === stanza.number ? '#10B981' : theme.border,
                          },
                        ]}
                        hitSlop={{ top: 8, bottom: 8, left: 6, right: 6 }}
                        accessibilityLabel={`Copy verse ${stanza.number}`}
                      >
                        <Ionicons
                          name={copiedStanza === stanza.number ? 'checkmark' : 'copy-outline'}
                          size={12}
                          color={copiedStanza === stanza.number ? '#059669' : theme.textSecondary}
                        />
                        <Text
                          style={[
                            styles.stanzaActionText,
                            { color: copiedStanza === stanza.number ? '#059669' : theme.textSecondary },
                          ]}
                        >
                          {copiedStanza === stanza.number ? 'Copied' : 'Copy'}
                        </Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        onPress={() => handleShareStanza(stanza, idx)}
                        style={[styles.stanzaActionBtn, { backgroundColor: theme.surface, borderColor: theme.border }]}
                        hitSlop={{ top: 8, bottom: 8, left: 6, right: 6 }}
                        accessibilityLabel={`Share verse ${stanza.number}`}
                      >
                        <Ionicons name="share-social-outline" size={12} color={theme.textSecondary} />
                      </TouchableOpacity>
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

                  {/* Dual Mode: Parallel English translation block */}
                  {languageMode === 'dual' && engStanza && (
                    <View style={[styles.dualEnglishBox, { backgroundColor: theme.primary + '10', borderColor: theme.accentGold }]}>
                      <View style={styles.dualHeader}>
                        <Ionicons name="globe-outline" size={12} color={theme.accentGold} />
                        <Text style={[styles.dualLabel, { color: theme.accentGold }]}>
                          English Translation
                        </Text>
                      </View>
                      <Text style={[styles.dualText, { color: theme.text, fontSize: fontSize * 0.92, lineHeight: fontSize * 1.48 }]}>
                        {engStanza.text}
                      </Text>
                      {engStanza.chorus ? (
                        <View style={styles.dualChorusBox}>
                          <Text style={[styles.dualChorusLabel, { color: theme.accentGold }]}>Refrain:</Text>
                          <Text style={[styles.dualChorusText, { color: theme.textSecondary, fontSize: fontSize * 0.88, lineHeight: fontSize * 1.35 }]}>
                            {engStanza.chorus}
                          </Text>
                        </View>
                      ) : null}
                    </View>
                  )}
                </View>
              );
            })
          )}
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

      {/* Floating Auto-Scroll Launch Pill (when toolbar is closed) */}
      {!isAutoScrollActive && (
        <TouchableOpacity
          style={[styles.floatingAutoScrollBtn, { backgroundColor: theme.primary, borderColor: theme.accentGold }]}
          onPress={() => {
            setIsAutoScrollActive(true);
            setIsAutoScrollPlaying(true);
          }}
          activeOpacity={0.85}
        >
          <Ionicons name="play" size={13} color="#FFFFFF" />
          <Text style={styles.floatingAutoScrollText}>Auto-Scroll</Text>
        </TouchableOpacity>
      )}

      {/* Floating Auto-Scroll Active Toolbar */}
      {isAutoScrollActive && (
        <View style={[styles.autoScrollPill, { backgroundColor: theme.surfaceCard, borderColor: theme.border }]}>
          <TouchableOpacity
            style={[
              styles.autoScrollPlayBtn,
              { backgroundColor: isAutoScrollPlaying ? theme.accentGold : theme.primary },
            ]}
            onPress={() => setIsAutoScrollPlaying(!isAutoScrollPlaying)}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Ionicons name={isAutoScrollPlaying ? 'pause' : 'play'} size={18} color="#FFFFFF" />
          </TouchableOpacity>

          <View style={styles.speedButtonGroup}>
            {[0.5, 1.0, 1.5, 2.0].map((s) => (
              <TouchableOpacity
                key={s}
                style={[
                  styles.speedBtn,
                  scrollSpeed === s && [
                    styles.activeSpeedBtn,
                    { backgroundColor: theme.primary + '20', borderColor: theme.accentGold },
                  ],
                ]}
                onPress={() => setScrollSpeed(s)}
              >
                <Text
                  style={[
                    styles.speedBtnText,
                    { color: scrollSpeed === s ? theme.accentGold : theme.textSecondary },
                  ]}
                >
                  {s}x
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity
            style={styles.autoScrollCloseBtn}
            onPress={() => {
              setIsAutoScrollPlaying(false);
              setIsAutoScrollActive(false);
            }}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons name="close" size={20} color={theme.textMuted} />
          </TouchableOpacity>
        </View>
      )}

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
    justifyContent: 'space-between',
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
  stanzaActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  stanzaActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    gap: 4,
  },
  stanzaActionText: {
    fontSize: 11,
    fontWeight: '600',
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
  floatingAutoScrollBtn: {
    position: 'absolute',
    bottom: 74,
    right: 16,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 9,
    paddingHorizontal: 15,
    borderRadius: 24,
    borderWidth: 1,
    gap: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 6,
    zIndex: 20,
  },
  floatingAutoScrollText: {
    color: '#FFFFFF',
    fontSize: 12.5,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  autoScrollPill: {
    position: 'absolute',
    bottom: 72,
    left: 16,
    right: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 30,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 8,
    zIndex: 25,
  },
  autoScrollPlayBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  speedButtonGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  speedBtn: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  activeSpeedBtn: {},
  speedBtnText: {
    fontSize: 12.5,
    fontWeight: '700',
  },
  autoScrollCloseBtn: {
    padding: 6,
  },
  englishHymnSubTitle: {
    fontSize: 14,
    fontWeight: '600',
    fontStyle: 'italic',
    marginTop: 4,
    marginBottom: 6,
  },
  meterCardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  choirModeChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    gap: 4,
  },
  choirModeChipText: {
    fontSize: 11,
    fontWeight: '700',
  },
  choirDetailsBox: {
    marginTop: 10,
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
  },
  choirMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  meterTypeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  meterTypeBadgeText: {
    fontSize: 12,
    fontWeight: '700',
  },
  editionRefText: {
    fontSize: 11.5,
    fontWeight: '600',
  },
  solFaContainer: {
    gap: 6,
  },
  solFaKeyText: {
    fontSize: 12,
    fontWeight: '500',
  },
  solFaScoreBox: {
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    marginVertical: 4,
  },
  solFaScoreText: {
    fontSize: 12.5,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    lineHeight: 18,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  solFaPatternNotes: {
    fontSize: 11.5,
    lineHeight: 16,
  },
  langBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: 16,
    marginTop: 10,
    marginBottom: 14,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
  },
  langBarLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  langBarTitle: {
    fontSize: 13,
    fontWeight: '700',
  },
  langSegmentGroup: {
    flexDirection: 'row',
    borderRadius: 8,
    borderWidth: 1,
    padding: 2,
    gap: 2,
  },
  langSegmentBtn: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
  },
  activeLangSegmentBtn: {},
  langSegmentText: {
    fontSize: 12,
    fontWeight: '700',
  },
  noEnglishNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginBottom: 14,
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    gap: 8,
  },
  noEnglishNoticeText: {
    flex: 1,
    fontSize: 12.5,
    lineHeight: 17,
  },
  dualEnglishBox: {
    marginTop: 12,
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
  },
  dualHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 6,
  },
  dualLabel: {
    fontSize: 11.5,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  dualText: {
    fontWeight: '500',
  },
  dualChorusBox: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(212, 175, 55, 0.3)',
  },
  dualChorusLabel: {
    fontSize: 11,
    fontWeight: '700',
    marginBottom: 2,
  },
  dualChorusText: {
    fontStyle: 'italic',
  },
});
