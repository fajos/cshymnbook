import React, { useRef, useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  useWindowDimensions,
  NativeSyntheticEvent,
  NativeScrollEvent,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ThemeColors } from '../constants/theme';

interface OnboardingModalProps {
  visible: boolean;
  theme: ThemeColors;
  onComplete: () => void;
}

interface FeaturePoint {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  description: string;
}

interface OnboardingSlide {
  id: string;
  eyebrow: string;
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle: string;
  points: FeaturePoint[];
  notice?: {
    title: string;
    body: string;
  };
}

const SLIDES: OnboardingSlide[] = [
  {
    id: 'welcome',
    eyebrow: 'IWE ORIN MIMO K&S',
    icon: 'book',
    title: 'Welcome to C&S Hymn Book',
    subtitle:
      'All 980 Cherubim & Seraphim hymns faithfully preserved for personal devotion, choir rehearsal, and congregational worship.',
    points: [
      {
        icon: 'library-outline',
        title: '980 Complete Hymns',
        description:
          'Includes 45 Akúnlẹkọ (Kneeling Prayers), 865 General Hymns (K&S 1–865), 49 Ìsọjí Revival Choruses, plus Psalms & Creeds.',
      },
      {
        icon: 'shield-checkmark-outline',
        title: 'Faithful Heritage Restoration',
        description:
          'Traditional C&S liturgical wording preserved faithfully across stanzas, choruses, and creeds.',
      },
      {
        icon: 'cloud-offline-outline',
        title: '100% Offline Lyrics & Search',
        description:
          'Every hymn and search index lives right on your device—ready for worship anywhere, even without internet.',
      },
    ],
  },
  {
    id: 'navigation',
    eyebrow: 'FAST NAVIGATION',
    icon: 'keypad',
    title: 'Find Any Hymn in Seconds',
    subtitle:
      'Never fall behind when a hymn number is announced from the pulpit or during prayer.',
    points: [
      {
        icon: 'keypad-outline',
        title: 'Quick Number Dial Pad (#)',
        description:
          'Tap the # keypad button on the Hymns tab to type a number and jump straight to any hymn.',
      },
      {
        icon: 'search-outline',
        title: 'Smart Yorùbá & Lyric Search',
        description:
          'Search by hymn number, title, scripture, or any line of lyrics—works even without typing Yorùbá tone marks or underdots (ọ, ẹ, ṣ).',
      },
      {
        icon: 'folder-open-outline',
        title: '58 Categories & Special Liturgy',
        description:
          'Browse hymns grouped by liturgical occasion, or open Special Liturgy for Akúnlẹkọ, Ìsọjí, Psalms & Creeds.',
      },
    ],
  },
  {
    id: 'bilingual',
    eyebrow: 'BILINGUAL WORSHIP',
    icon: 'language',
    title: 'Yorùbá, English & Dual View',
    subtitle:
      'Worship in Yorùbá, switch to English, or read both side-by-side inside any hymn.',
    points: [
      {
        icon: 'swap-horizontal-outline',
        title: '3 Instant Reading Modes',
        description:
          'Use the Language bar inside a hymn to switch smoothly between Yorùbá, English, or parallel Dual View.',
      },
      {
        icon: 'document-text-outline',
        title: '866 Official English Hymns',
        description:
          'Matched stanza-by-stanza with the Yorùbá hymnal so families and multilingual congregations can sing together.',
      },
    ],
    notice: {
      title: 'Where English Versions Start',
      body: 'Official English translations begin from K&S 1 onward. The opening Roman-numeral hymns (K&S i – K&S xlv, Akúnlẹkọ) do not have English translations yet and display their original Yorùbá text.',
    },
  },
  {
    id: 'audio',
    eyebrow: 'MUSIC & CHOIR TOOLS',
    icon: 'musical-notes',
    title: 'Organ, Piano & Choir Mode',
    subtitle:
      'Practice unfamiliar melodies, switch instruments, and lead singing with confidence.',
    points: [
      {
        icon: 'play-circle-outline',
        title: 'Organ & Piano Tunes with Loop',
        description:
          'Play Organ or Piano accompaniments, loop verses while learning, and switch alternate tunes where available (authentic C&S tunes play first).',
      },
      {
        icon: 'download-outline',
        title: 'Automatic Offline Tune Caching',
        description:
          'Once a tune downloads, it saves locally on your device so subsequent plays work instantly offline.',
      },
      {
        icon: 'musical-note-outline',
        title: 'Choir Mode (Sol-fa & Meter)',
        description:
          'Open Choir Mode to inspect Key, Time Signature, Meter, and Tonic Sol-fa notation on supported hymns.',
      },
    ],
  },
  {
    id: 'personalize',
    eyebrow: 'WORSHIP & PLANNING',
    icon: 'albums',
    title: 'Auto-Scroll, Themes & Service Sets',
    subtitle:
      'Customize your reading comfort and prepare hymn lists before Sunday service.',
    points: [
      {
        icon: 'arrow-down-circle-outline',
        title: 'Hands-Free Auto-Scroll',
        description:
          'Tap Auto-Scroll while singing to gently advance lyrics at your preferred reading speed (0.5x–2x).',
      },
      {
        icon: 'color-palette-outline',
        title: 'Light, Dark & Sepia Themes + Text Size',
        description:
          'Switch between crisp Light, Night Dark, or warm Sepia parchment themes and resize text (Aa) anytime.',
      },
      {
        icon: 'heart-outline',
        title: 'Favorites, Service Sets & Sharing',
        description:
          'Bookmark favorites, build Sunday Service Setlists (with Liturgical Presets & Share/Import), and copy or share single verses or full hymns.',
      },
    ],
  },
];

export const OnboardingModal: React.FC<OnboardingModalProps> = ({
  visible,
  theme,
  onComplete,
}) => {
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const scrollRef = useRef<React.ComponentRef<typeof ScrollView>>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Always start at the first slide whenever opened
  useEffect(() => {
    if (visible) {
      setCurrentIndex(0);
      requestAnimationFrame(() => {
        scrollRef.current?.scrollTo({ x: 0, animated: false });
      });
    }
  }, [visible]);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    if (width <= 0) return;
    const offsetX = event.nativeEvent.contentOffset.x;
    const idx = Math.round(offsetX / width);
    if (idx >= 0 && idx < SLIDES.length && idx !== currentIndex) {
      setCurrentIndex(idx);
    }
  };

  const goToSlide = (index: number) => {
    const clamped = Math.max(0, Math.min(SLIDES.length - 1, index));
    setCurrentIndex(clamped);
    scrollRef.current?.scrollTo({ x: clamped * width, animated: true });
  };

  const isLastSlide = currentIndex === SLIDES.length - 1;

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent={false}
      onRequestClose={onComplete}
    >
      <View
        style={[
          styles.container,
          {
            backgroundColor: theme.background,
            paddingTop: Math.max(insets.top, 12),
            paddingBottom: Math.max(insets.bottom, 16),
          },
        ]}
      >
        {/* Top Bar */}
        <View style={styles.topBar}>
          <View style={[styles.stepPill, { backgroundColor: theme.surfaceCard, borderColor: theme.border }]}>
            <Text style={[styles.stepPillText, { color: theme.textSecondary }]}>
              {currentIndex + 1} of {SLIDES.length}
            </Text>
          </View>

          {!isLastSlide ? (
            <TouchableOpacity
              onPress={onComplete}
              style={styles.skipBtn}
              hitSlop={{ top: 10, bottom: 10, left: 12, right: 12 }}
              accessibilityLabel="Skip onboarding"
            >
              <Text style={[styles.skipText, { color: theme.textSecondary }]}>Skip</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.skipPlaceholder} />
          )}
        </View>

        {/* Swipeable Slides */}
        <ScrollView
          ref={scrollRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={handleScroll}
          onMomentumScrollEnd={handleScroll}
          scrollEventThrottle={16}
          bounces={false}
          style={styles.pager}
        >
          {SLIDES.map((slide) => (
            <View key={slide.id} style={[styles.slidePage, { width }]}>
              <ScrollView
                style={styles.slideScroll}
                contentContainerStyle={styles.slideContent}
                showsVerticalScrollIndicator={false}
                nestedScrollEnabled
              >
                {/* Hero Icon & Title */}
                <View style={styles.heroSection}>
                  <View
                    style={[
                      styles.heroIconRing,
                      {
                        backgroundColor: theme.primary + '15',
                        borderColor: theme.accentGold + '55',
                      },
                    ]}
                  >
                    <View style={[styles.heroIconInner, { backgroundColor: theme.primary }]}>
                      <Ionicons name={slide.icon} size={34} color={theme.accentGold} />
                    </View>
                  </View>

                  <View
                    style={[
                      styles.eyebrowBadge,
                      { backgroundColor: theme.badgeBg, borderColor: theme.border },
                    ]}
                  >
                    <Text style={[styles.eyebrowText, { color: theme.accent }]}>
                      {slide.eyebrow}
                    </Text>
                  </View>

                  <Text style={[styles.title, { color: theme.text }]}>{slide.title}</Text>
                  <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
                    {slide.subtitle}
                  </Text>
                </View>

                {/* Feature Cards */}
                <View style={styles.pointsList}>
                  {slide.points.map((pt, idx) => (
                    <View
                      key={idx}
                      style={[
                        styles.pointCard,
                        {
                          backgroundColor: theme.surfaceCard,
                          borderColor: theme.border,
                        },
                      ]}
                    >
                      <View
                        style={[
                          styles.pointIconBox,
                          { backgroundColor: theme.primary + '14' },
                        ]}
                      >
                        <Ionicons name={pt.icon} size={22} color={theme.primary} />
                      </View>
                      <View style={styles.pointTextCol}>
                        <Text style={[styles.pointTitle, { color: theme.text }]}>{pt.title}</Text>
                        <Text style={[styles.pointDesc, { color: theme.textSecondary }]}>
                          {pt.description}
                        </Text>
                      </View>
                    </View>
                  ))}
                </View>

                {/* Optional Important Callout (e.g. K&S 1+ English notice) */}
                {slide.notice && (
                  <View
                    style={[
                      styles.noticeCard,
                      {
                        backgroundColor: theme.chorusBg,
                        borderColor: theme.chorusBorder,
                      },
                    ]}
                  >
                    <View style={styles.noticeHeader}>
                      <Ionicons name="information-circle" size={18} color={theme.accent} />
                      <Text style={[styles.noticeTitle, { color: theme.text }]}>
                        {slide.notice.title}
                      </Text>
                    </View>
                    <Text style={[styles.noticeBody, { color: theme.textSecondary }]}>
                      {slide.notice.body}
                    </Text>
                  </View>
                )}
              </ScrollView>
            </View>
          ))}
        </ScrollView>

        {/* Bottom Footer Controls */}
        <View style={[styles.footer, { borderTopColor: theme.borderLight }]}>
          {/* Pagination Dots */}
          <View style={styles.dotsRow}>
            {SLIDES.map((s, idx) => {
              const active = idx === currentIndex;
              return (
                <TouchableOpacity
                  key={s.id}
                  onPress={() => goToSlide(idx)}
                  hitSlop={{ top: 8, bottom: 8, left: 4, right: 4 }}
                  accessibilityLabel={`Go to slide ${idx + 1}`}
                >
                  <View
                    style={[
                      styles.dot,
                      {
                        backgroundColor: active ? theme.primary : theme.border,
                        width: active ? 22 : 8,
                      },
                    ]}
                  />
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Back / Next / Get Started Buttons */}
          <View style={styles.navButtonsRow}>
            {currentIndex > 0 ? (
              <TouchableOpacity
                onPress={() => goToSlide(currentIndex - 1)}
                style={[
                  styles.backBtn,
                  { backgroundColor: theme.surfaceCard, borderColor: theme.border },
                ]}
                activeOpacity={0.75}
              >
                <Ionicons name="arrow-back" size={18} color={theme.text} />
                <Text style={[styles.backBtnText, { color: theme.text }]}>Back</Text>
              </TouchableOpacity>
            ) : (
              <View style={styles.backBtnPlaceholder} />
            )}

            <TouchableOpacity
              onPress={() => {
                if (isLastSlide) {
                  onComplete();
                } else {
                  goToSlide(currentIndex + 1);
                }
              }}
              style={[styles.primaryBtn, { backgroundColor: theme.primary }]}
              activeOpacity={0.85}
            >
              <Text style={styles.primaryBtnText}>
                {isLastSlide ? 'Get Started' : 'Next'}
              </Text>
              <Ionicons
                name={isLastSlide ? 'checkmark-circle' : 'arrow-forward'}
                size={18}
                color="#FFFFFF"
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  stepPill: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
    borderWidth: 1,
  },
  stepPillText: {
    fontSize: 12,
    fontWeight: '700',
  },
  skipBtn: {
    paddingHorizontal: 8,
    paddingVertical: 6,
  },
  skipPlaceholder: {
    width: 48,
    height: 30,
  },
  skipText: {
    fontSize: 15,
    fontWeight: '700',
  },
  pager: {
    flex: 1,
  },
  slidePage: {
    flex: 1,
  },
  slideScroll: {
    flex: 1,
  },
  slideContent: {
    paddingHorizontal: 22,
    paddingTop: 8,
    paddingBottom: 24,
    maxWidth: 640,
    width: '100%',
    alignSelf: 'center',
  },
  heroSection: {
    alignItems: 'center',
    marginBottom: 20,
  },
  heroIconRing: {
    width: 88,
    height: 88,
    borderRadius: 44,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  heroIconInner: {
    width: 68,
    height: 68,
    borderRadius: 34,
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.18,
        shadowRadius: 8,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  eyebrowBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 10,
  },
  eyebrowText: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    textAlign: 'center',
    letterSpacing: -0.3,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14.5,
    lineHeight: 21,
    textAlign: 'center',
    paddingHorizontal: 6,
  },
  pointsList: {
    gap: 11,
  },
  pointCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    gap: 12,
  },
  pointIconBox: {
    width: 40,
    height: 40,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 1,
  },
  pointTextCol: {
    flex: 1,
  },
  pointTitle: {
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 3,
  },
  pointDesc: {
    fontSize: 13.5,
    lineHeight: 19.5,
  },
  noticeCard: {
    marginTop: 14,
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderLeftWidth: 4,
  },
  noticeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 5,
  },
  noticeTitle: {
    fontSize: 14,
    fontWeight: '800',
  },
  noticeBody: {
    fontSize: 13.5,
    lineHeight: 19.5,
  },
  footer: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 4,
    borderTopWidth: StyleSheet.hairlineWidth,
    gap: 14,
  },
  dotsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  dot: {
    height: 8,
    borderRadius: 4,
  },
  navButtonsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    height: 48,
    borderRadius: 12,
    borderWidth: 1,
    gap: 6,
  },
  backBtnPlaceholder: {
    width: 84,
  },
  backBtnText: {
    fontSize: 15,
    fontWeight: '700',
  },
  primaryBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 48,
    borderRadius: 12,
    gap: 8,
  },
  primaryBtnText: {
    color: '#FFFFFF',
    fontSize: 15.5,
    fontWeight: '800',
  },
});
