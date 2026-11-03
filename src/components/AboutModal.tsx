import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  Linking,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemeColors } from '../constants/theme';

interface AboutModalProps {
  visible: boolean;
  theme: ThemeColors;
  onClose: () => void;
}

type TabType = 'about' | 'privacy' | 'terms';

export const AboutModal: React.FC<AboutModalProps> = ({
  visible,
  theme,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('about');

  const openUrl = async (url: string) => {
    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      }
    } catch {
      // fallback
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={[styles.container, { backgroundColor: theme.surface }]}>
          {/* Header */}
          <View style={[styles.header, { borderBottomColor: theme.border }]}>
            <View style={styles.headerLeft}>
              <View style={[styles.iconBadge, { backgroundColor: theme.primaryLight }]}>
                <Ionicons name="book" size={20} color={theme.accentGold} />
              </View>
              <View>
                <Text style={[styles.headerTitle, { color: theme.text }]}>C&amp;S Hymn Book</Text>
                <Text style={[styles.headerSubtitle, { color: theme.textSecondary }]}>
                  Version 1.0.0 &bull; com.fajostech.cshymnbook
                </Text>
              </View>
            </View>
            <TouchableOpacity
              onPress={onClose}
              style={[styles.closeButton, { backgroundColor: theme.surfaceCard }]}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Ionicons name="close" size={22} color={theme.textSecondary} />
            </TouchableOpacity>
          </View>

          {/* Segmented Tab Navigation */}
          <View style={[styles.tabBar, { borderBottomColor: theme.border, backgroundColor: theme.surfaceCard }]}>
            <TouchableOpacity
              style={[
                styles.tabItem,
                activeTab === 'about' && [styles.activeTabItem, { borderBottomColor: theme.accentGold }],
              ]}
              onPress={() => setActiveTab('about')}
            >
              <Text
                style={[
                  styles.tabLabel,
                  { color: activeTab === 'about' ? theme.accentGold : theme.textSecondary },
                ]}
              >
                About
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.tabItem,
                activeTab === 'privacy' && [styles.activeTabItem, { borderBottomColor: theme.accentGold }],
              ]}
              onPress={() => setActiveTab('privacy')}
            >
              <Text
                style={[
                  styles.tabLabel,
                  { color: activeTab === 'privacy' ? theme.accentGold : theme.textSecondary },
                ]}
              >
                Privacy Policy
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.tabItem,
                activeTab === 'terms' && [styles.activeTabItem, { borderBottomColor: theme.accentGold }],
              ]}
              onPress={() => setActiveTab('terms')}
            >
              <Text
                style={[
                  styles.tabLabel,
                  { color: activeTab === 'terms' ? theme.accentGold : theme.textSecondary },
                ]}
              >
                Terms of Use
              </Text>
            </TouchableOpacity>
          </View>

          {/* Content Body */}
          <ScrollView
            style={styles.contentScroll}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={true}
          >
            {activeTab === 'about' && (
              <View>
                <View style={[styles.heroCard, { backgroundColor: theme.primary, borderColor: theme.accentGold }]}>
                  <Text style={styles.heroTitle}>Iwe Orin Mimo Cherubim &amp; Seraphim</Text>
                  <Text style={styles.heroText}>
                    Dedicated to faithful worship, prayer, and preserving the liturgical heritage of the Eternal Sacred Order of the Cherubim &amp; Seraphim worldwide.
                  </Text>
                </View>

                <Text style={[styles.sectionHeading, { color: theme.text }]}>Heritage Restoration</Text>
                <Text style={[styles.paragraph, { color: theme.textSecondary }]}>
                  In this application, historical hymns have been carefully reviewed and restored to their original liturgical designations:
                </Text>
                <View style={styles.bulletList}>
                  <Text style={[styles.bulletItem, { color: theme.text }]}>
                    &bull; <Text style={styles.boldText}>Ẹgbẹ Kérúbù &amp; Ẹgbẹ Séráfù</Text> restored in place of modified versions.
                  </Text>
                  <Text style={[styles.bulletItem, { color: theme.text }]}>
                    &bull; <Text style={styles.boldText}>Ẹgbẹ Aladura</Text> and <Text style={styles.boldText}>Ẹgbẹ Iye</Text> preserved where historically intended.
                  </Text>
                  <Text style={[styles.bulletItem, { color: theme.text }]}>
                    &bull; Church Creeds preserved faithfully with traditional liturgical text.
                  </Text>
                </View>

                <Text style={[styles.sectionHeading, { color: theme.text }]}>Features &amp; Content</Text>
                <View style={styles.bulletList}>
                  <Text style={[styles.bulletItem, { color: theme.text }]}>
                    &bull; <Text style={styles.boldText}>980 Total Hymns:</Text> 45 Kneeling prayers (Akúnlẹkọ), 865 General Hymns, 49 Revival songs (Ìsọjí), 9 Psalms &amp; Creeds.
                  </Text>
                  <Text style={[styles.bulletItem, { color: theme.text }]}>
                    &bull; <Text style={styles.boldText}>100% Offline:</Text> Complete data stored locally on your device.
                  </Text>
                  <Text style={[styles.bulletItem, { color: theme.text }]}>
                    &bull; <Text style={styles.boldText}>Sunday Service Sets:</Text> Create and manage collections of hymns for any church service.
                  </Text>
                  <Text style={[styles.bulletItem, { color: theme.text }]}>
                    &bull; <Text style={styles.boldText}>Instant Dial Pad:</Text> Quick-jump directly to any hymn announced during worship.
                  </Text>
                </View>

                <Text style={[styles.sectionHeading, { color: theme.text }]}>Online Documentation &amp; Source</Text>
                <TouchableOpacity
                  style={[styles.linkButton, { backgroundColor: theme.surfaceCard, borderColor: theme.border }]}
                  onPress={() => openUrl('https://fajos.github.io/cshymnbook/')}
                >
                  <Ionicons name="globe-outline" size={18} color={theme.accentGold} />
                  <Text style={[styles.linkButtonText, { color: theme.text }]}>Official Web Documentation</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.linkButton, { backgroundColor: theme.surfaceCard, borderColor: theme.border }]}
                  onPress={() => openUrl('https://github.com/fajos/cshymnbook')}
                >
                  <Ionicons name="logo-github" size={18} color={theme.accentGold} />
                  <Text style={[styles.linkButtonText, { color: theme.text }]}>GitHub Repository &amp; Issues</Text>
                </TouchableOpacity>

                <Text style={[styles.footerNotice, { color: theme.textSecondary }]}>
                  Published by FajosTech &bull; Developer: orjidom@yahoo.com
                </Text>
              </View>
            )}

            {activeTab === 'privacy' && (
              <View>
                <View style={[styles.statusBox, { backgroundColor: '#ECFDF5', borderColor: '#10B981' }]}>
                  <Ionicons name="shield-checkmark" size={24} color="#059669" />
                  <View style={{ flex: 1, marginLeft: 12 }}>
                    <Text style={{ fontWeight: '700', color: '#065F46', fontSize: 15 }}>Zero Data Collection</Text>
                    <Text style={{ color: '#047857', fontSize: 13, marginTop: 2 }}>
                      100% offline app. We never collect, store, transmit, or share any personal information.
                    </Text>
                  </View>
                </View>

                <Text style={[styles.sectionHeading, { color: theme.text }]}>1. Overview</Text>
                <Text style={[styles.paragraph, { color: theme.textSecondary }]}>
                  FajosTech built the C&amp;S Hymn Book application as an offline-first worship utility. This service is provided at no cost and is intended for use as is. Your privacy is a sacred trust.
                </Text>

                <Text style={[styles.sectionHeading, { color: theme.text }]}>2. Information Collection &amp; Use</Text>
                <Text style={[styles.paragraph, { color: theme.textSecondary }]}>
                  The application does NOT collect any personally identifiable information (PII). It does not request your name, email, phone number, location, contacts, camera, or microphone.
                </Text>

                <Text style={[styles.sectionHeading, { color: theme.text }]}>3. Local Storage Only</Text>
                <Text style={[styles.paragraph, { color: theme.textSecondary }]}>
                  All user preferences—such as bookmarked favorite hymns, custom service sets, reading theme (Light/Dark/Sepia), and font size—are saved strictly on your local device. This data never leaves your device and is erased if you uninstall the application.
                </Text>

                <Text style={[styles.sectionHeading, { color: theme.text }]}>4. No Advertising &amp; No Analytics</Text>
                <Text style={[styles.paragraph, { color: theme.textSecondary }]}>
                  The app contains no advertisements, no tracking SDKs, no behavioral cookies, and no telemetry libraries.
                </Text>

                <Text style={[styles.sectionHeading, { color: theme.text }]}>5. Children&rsquo;s Privacy (COPPA &amp; GDPR)</Text>
                <Text style={[styles.paragraph, { color: theme.textSecondary }]}>
                  Because no personal data is ever collected, the application complies with the Children&rsquo;s Online Privacy Protection Act (COPPA) and General Data Protection Regulation (GDPR).
                </Text>

                <Text style={[styles.sectionHeading, { color: theme.text }]}>6. Online Privacy Policy</Text>
                <TouchableOpacity
                  style={[styles.linkButton, { backgroundColor: theme.surfaceCard, borderColor: theme.border }]}
                  onPress={() => openUrl('https://fajos.github.io/cshymnbook/privacy-policy.html')}
                >
                  <Ionicons name="open-outline" size={18} color={theme.accentGold} />
                  <Text style={[styles.linkButtonText, { color: theme.text }]}>View Full Web Privacy Policy</Text>
                </TouchableOpacity>
              </View>
            )}

            {activeTab === 'terms' && (
              <View>
                <Text style={[styles.sectionHeading, { color: theme.text }]}>1. Acceptance of Terms</Text>
                <Text style={[styles.paragraph, { color: theme.textSecondary }]}>
                  By downloading, installing, or using C&amp;S Hymn Book, you agree to be bound by these Terms of Use. If you do not agree, do not use the application.
                </Text>

                <Text style={[styles.sectionHeading, { color: theme.text }]}>2. License Grant</Text>
                <Text style={[styles.paragraph, { color: theme.textSecondary }]}>
                  FajosTech grants you a personal, non-exclusive, non-transferable, revocable license to use the application on compatible devices solely for personal worship, religious study, fellowship, and congregational services.
                </Text>

                <Text style={[styles.sectionHeading, { color: theme.text }]}>3. Liturgical Heritage &amp; Intellectual Property</Text>
                <Text style={[styles.paragraph, { color: theme.textSecondary }]}>
                  The hymn lyrics, prayers, and liturgical rubrics represent the sacred heritage of the Eternal Sacred Order of the Cherubim &amp; Seraphim Church worldwide. This application is dedicated to promoting worship and preservation of original liturgical designations.
                </Text>

                <Text style={[styles.sectionHeading, { color: theme.text }]}>4. Limitation of Liability</Text>
                <Text style={[styles.paragraph, { color: theme.textSecondary }]}>
                  The application is provided &ldquo;as is&rdquo; without warranties of any kind. FajosTech shall not be liable for any indirect, incidental, or consequential damages arising from your use or inability to use the application.
                </Text>

                <Text style={[styles.sectionHeading, { color: theme.text }]}>5. Contact &amp; Full Terms</Text>
                <TouchableOpacity
                  style={[styles.linkButton, { backgroundColor: theme.surfaceCard, borderColor: theme.border }]}
                  onPress={() => openUrl('https://fajos.github.io/cshymnbook/terms-of-use.html')}
                >
                  <Ionicons name="open-outline" size={18} color={theme.accentGold} />
                  <Text style={[styles.linkButtonText, { color: theme.text }]}>View Full Web Terms of Use</Text>
                </TouchableOpacity>
              </View>
            )}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
    justifyContent: 'flex-end',
  },
  container: {
    height: '85%',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconBadge: {
    width: 40,
    height: 40,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  headerSubtitle: {
    fontSize: 12,
    marginTop: 2,
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabBar: {
    flexDirection: 'row',
    borderBottomWidth: 1,
  },
  tabItem: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTabItem: {},
  tabLabel: {
    fontSize: 14,
    fontWeight: '600',
  },
  contentScroll: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  heroCard: {
    padding: 18,
    borderRadius: 14,
    borderWidth: 1,
    marginBottom: 20,
  },
  heroTitle: {
    color: '#D4AF37',
    fontSize: 17,
    fontWeight: '700',
    marginBottom: 6,
  },
  heroText: {
    color: '#FFFFFF',
    fontSize: 13.5,
    lineHeight: 20,
  },
  sectionHeading: {
    fontSize: 16,
    fontWeight: '700',
    marginTop: 16,
    marginBottom: 8,
  },
  paragraph: {
    fontSize: 14,
    lineHeight: 22,
    marginBottom: 10,
  },
  bulletList: {
    marginVertical: 6,
    paddingLeft: 4,
  },
  bulletItem: {
    fontSize: 13.5,
    lineHeight: 22,
    marginBottom: 6,
  },
  boldText: {
    fontWeight: '600',
  },
  statusBox: {
    flexDirection: 'row',
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    marginBottom: 16,
  },
  linkButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 10,
    borderWidth: 1,
    marginTop: 10,
    gap: 10,
  },
  linkButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  footerNotice: {
    textAlign: 'center',
    fontSize: 12,
    marginTop: 24,
    marginBottom: 8,
  },
});
