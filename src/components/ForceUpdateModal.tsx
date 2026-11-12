import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Platform,
  BackHandler,
  Linking,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ThemeColors } from '../constants/theme';

interface ForceUpdateModalProps {
  visible: boolean;
  theme: ThemeColors;
  currentVersion: string;
  minimumVersion: string;
  title: string;
  message: string;
  storeUrl: string;
  isHardUpdate?: boolean;
  onDismissSoftUpdate?: () => void;
}

export const ForceUpdateModal: React.FC<ForceUpdateModalProps> = ({
  visible,
  theme,
  currentVersion,
  minimumVersion,
  title,
  message,
  storeUrl,
  isHardUpdate = true,
  onDismissSoftUpdate,
}) => {
  const insets = useSafeAreaInsets();

  // Prevent hardware back button on Android from bypassing a hard update
  useEffect(() => {
    if (!visible || !isHardUpdate) return;
    const subscription = BackHandler.addEventListener('hardwareBackPress', () => true);
    return () => subscription.remove();
  }, [visible, isHardUpdate]);

  const handleOpenStore = () => {
    Linking.openURL(storeUrl).catch(() => {});
  };

  const storeName = Platform.OS === 'ios' ? 'App Store' : 'Google Play';
  const storeIcon = Platform.OS === 'ios' ? 'logo-apple' : 'logo-google-playstore';

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent={true}
      onRequestClose={() => {
        if (!isHardUpdate && onDismissSoftUpdate) {
          onDismissSoftUpdate();
        }
      }}
    >
      <View style={styles.backdrop}>
        <View
          style={[
            styles.card,
            {
              backgroundColor: theme.surface,
              borderColor: theme.border,
              paddingBottom: Math.max(insets.bottom, 20),
            },
          ]}
        >
          {/* Accent Header Icon */}
          <View
            style={[
              styles.iconOuterRing,
              {
                backgroundColor: isHardUpdate ? theme.primary + '15' : theme.accentGold + '20',
                borderColor: theme.accentGold,
              },
            ]}
          >
            <View
              style={[
                styles.iconInner,
                { backgroundColor: isHardUpdate ? theme.primary : theme.accentGold },
              ]}
            >
              <Ionicons
                name={isHardUpdate ? 'arrow-up-circle' : 'sparkles'}
                size={38}
                color="#FFFFFF"
              />
            </View>
          </View>

          {/* Title & Badge */}
          <Text style={[styles.title, { color: theme.text }]}>{title}</Text>

          <View style={styles.versionRow}>
            <View
              style={[
                styles.versionBadge,
                { backgroundColor: theme.surfaceCard, borderColor: theme.border },
              ]}
            >
              <Text style={[styles.versionLabel, { color: theme.textMuted }]}>Installed:</Text>
              <Text style={[styles.versionValue, { color: theme.textSecondary }]}>
                v{currentVersion}
              </Text>
            </View>

            <Ionicons name="arrow-forward" size={14} color={theme.textMuted} />

            <View
              style={[
                styles.versionBadge,
                { backgroundColor: theme.primary + '18', borderColor: theme.primary + '40' },
              ]}
            >
              <Text style={[styles.versionLabel, { color: theme.primary }]}>Required:</Text>
              <Text style={[styles.versionValue, { color: theme.primary, fontWeight: '800' }]}>
                v{minimumVersion}
              </Text>
            </View>
          </View>

          {/* Explanation Message */}
          <View
            style={[
              styles.messageBox,
              { backgroundColor: theme.surfaceCard, borderColor: theme.border },
            ]}
          >
            <Text style={[styles.messageText, { color: theme.textSecondary }]}>
              {message}
            </Text>
          </View>

          {/* Action Buttons */}
          <View style={styles.actionsContainer}>
            <TouchableOpacity
              style={[styles.primaryButton, { backgroundColor: theme.primary }]}
              onPress={handleOpenStore}
              activeOpacity={0.85}
            >
              <Ionicons name={storeIcon} size={20} color="#FFFFFF" />
              <Text style={styles.primaryButtonText}>Update on {storeName}</Text>
            </TouchableOpacity>

            {!isHardUpdate && onDismissSoftUpdate && (
              <TouchableOpacity
                style={[
                  styles.laterButton,
                  { backgroundColor: theme.surfaceCard, borderColor: theme.border },
                ]}
                onPress={onDismissSoftUpdate}
                activeOpacity={0.7}
              >
                <Text style={[styles.laterButtonText, { color: theme.textSecondary }]}>
                  Maybe Later
                </Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Footer note */}
          <Text style={[styles.footnote, { color: theme.textMuted }]}>
            {isHardUpdate
              ? 'This update is required to ensure compatibility with C&S hymnal data.'
              : 'You can continue using the app, but some new features may be unavailable.'}
          </Text>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.72)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  card: {
    width: '100%',
    maxWidth: 420,
    borderRadius: 24,
    borderWidth: 1,
    paddingHorizontal: 22,
    paddingTop: 28,
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.35,
        shadowRadius: 20,
      },
      android: {
        elevation: 12,
      },
    }),
  },
  iconOuterRing: {
    width: 82,
    height: 82,
    borderRadius: 41,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  iconInner: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 10,
    letterSpacing: -0.3,
  },
  versionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  versionBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    borderWidth: 1,
  },
  versionLabel: {
    fontSize: 12,
    fontWeight: '600',
  },
  versionValue: {
    fontSize: 12,
    fontWeight: '700',
  },
  messageBox: {
    width: '100%',
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    marginBottom: 20,
  },
  messageText: {
    fontSize: 14,
    lineHeight: 21,
    textAlign: 'center',
  },
  actionsContainer: {
    width: '100%',
    gap: 10,
  },
  primaryButton: {
    width: '100%',
    height: 50,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
  },
  laterButton: {
    width: '100%',
    height: 44,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  laterButtonText: {
    fontSize: 14,
    fontWeight: '700',
  },
  footnote: {
    fontSize: 11.5,
    textAlign: 'center',
    marginTop: 14,
    lineHeight: 16,
    paddingHorizontal: 10,
  },
});
