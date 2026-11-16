import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Alert,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemeColors } from '../constants/theme';
import {
  getOfflineTuneCount,
  getAllUniqueTuneFiles,
  downloadAllTunes,
  clearOfflineTunes,
  TuneDownloadProgress,
} from '../services/tuneService';

interface DownloadAllTunesModalProps {
  visible: boolean;
  theme: ThemeColors;
  onClose: () => void;
}

export const DownloadAllTunesModal: React.FC<DownloadAllTunesModalProps> = ({
  visible,
  theme,
  onClose,
}) => {
  const [instrument, setInstrument] = useState<'organ' | 'piano'>('organ');
  const [offlineCount, setOfflineCount] = useState<number>(0);
  const [totalTunesCount, setTotalTunesCount] = useState<number>(0);
  const [isDownloading, setIsDownloading] = useState(false);
  const [progress, setProgress] = useState<TuneDownloadProgress | null>(null);

  const cancelRef = useRef<boolean>(false);

  const refreshCounts = () => {
    const total = getAllUniqueTuneFiles().length;
    const downloaded = getOfflineTuneCount(instrument);
    setTotalTunesCount(total);
    setOfflineCount(downloaded);
  };

  useEffect(() => {
    if (visible) {
      refreshCounts();
    }
  }, [visible, instrument]);

  const handleStartDownload = async () => {
    cancelRef.current = false;
    setIsDownloading(true);
    setProgress({
      completed: offlineCount,
      total: totalTunesCount,
      currentTuneName: 'Starting download...',
      isFinished: false,
      errorCount: 0,
    });

    try {
      await downloadAllTunes(
        instrument,
        (p) => {
          setProgress(p);
          setOfflineCount(p.completed);
        },
        () => cancelRef.current
      );
    } finally {
      setIsDownloading(false);
      refreshCounts();
    }
  };

  const handleCancel = () => {
    cancelRef.current = true;
    setIsDownloading(false);
    refreshCounts();
  };

  const handleClearCache = () => {
    Alert.alert(
      'Clear Offline Audio Cache',
      `Are you sure you want to delete all cached ${instrument} tune files? You will need an internet connection to play tunes until re-downloaded.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear Cache',
          style: 'destructive',
          onPress: async () => {
            await clearOfflineTunes(instrument);
            refreshCounts();
            Alert.alert('Cache Cleared', `Offline ${instrument} tunes have been cleared.`);
          },
        },
      ]
    );
  };

  const percent = totalTunesCount > 0 ? Math.round((offlineCount / totalTunesCount) * 100) : 0;

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <TouchableOpacity activeOpacity={1} onPress={onClose} style={styles.backdrop} />

        <View style={[styles.modalCard, { backgroundColor: theme.surfaceCard, borderColor: theme.border }]}>
          {/* Header */}
          <View style={[styles.header, { borderBottomColor: theme.borderLight }]}>
            <View style={styles.headerLeft}>
              <View style={[styles.iconBox, { backgroundColor: theme.primary + '18' }]}>
                <Ionicons name="cloud-download-outline" size={22} color={theme.primary} />
              </View>
              <View>
                <Text style={[styles.title, { color: theme.text }]}>Offline Audio Manager</Text>
                <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
                  Download tunes for zero-data offline worship
                </Text>
              </View>
            </View>

            <TouchableOpacity
              onPress={onClose}
              disabled={isDownloading}
              style={[styles.closeBtn, { backgroundColor: theme.borderLight }]}
            >
              <Ionicons name="close" size={18} color={theme.text} />
            </TouchableOpacity>
          </View>

          {/* Instrument Selector */}
          <View style={styles.instrumentSelectorRow}>
            <Text style={[styles.selectorLabel, { color: theme.textSecondary }]}>Instrument:</Text>
            <View style={[styles.segmentBox, { backgroundColor: theme.background, borderColor: theme.border }]}>
              <TouchableOpacity
                onPress={() => !isDownloading && setInstrument('organ')}
                style={[
                  styles.segmentBtn,
                  instrument === 'organ' && { backgroundColor: theme.primary },
                ]}
              >
                <Text
                  style={[
                    styles.segmentText,
                    { color: instrument === 'organ' ? '#FFFFFF' : theme.textSecondary },
                  ]}
                >
                  Pipe Organ
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => !isDownloading && setInstrument('piano')}
                style={[
                  styles.segmentBtn,
                  instrument === 'piano' && { backgroundColor: theme.primary },
                ]}
              >
                <Text
                  style={[
                    styles.segmentText,
                    { color: instrument === 'piano' ? '#FFFFFF' : theme.textSecondary },
                  ]}
                >
                  Grand Piano
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Download Status & Progress Bar */}
          <View style={[styles.statusBox, { backgroundColor: theme.background, borderColor: theme.border }]}>
            <View style={styles.statusNumbersRow}>
              <Text style={[styles.statusMain, { color: theme.text }]}>
                {offlineCount} of {totalTunesCount} Tunes Saved
              </Text>
              <Text style={[styles.statusPercent, { color: theme.accentGold }]}>
                {percent}%
              </Text>
            </View>

            {/* Progress Bar Track */}
            <View style={[styles.progressTrack, { backgroundColor: theme.borderLight }]}>
              <View
                style={[
                  styles.progressBar,
                  {
                    width: `${percent}%`,
                    backgroundColor: percent === 100 ? '#10B981' : theme.primary,
                  },
                ]}
              />
            </View>

            {isDownloading && progress && (
              <View style={styles.downloadingRow}>
                <ActivityIndicator size="small" color={theme.primary} />
                <Text style={[styles.downloadingText, { color: theme.textSecondary }]} numberOfLines={1}>
                  Downloading: {progress.currentTuneName}
                </Text>
              </View>
            )}

            {!isDownloading && percent === 100 && (
              <View style={styles.completeRow}>
                <Ionicons name="checkmark-circle" size={16} color="#10B981" />
                <Text style={styles.completeText}>All tunes downloaded! 100% offline ready.</Text>
              </View>
            )}
          </View>

          {/* Action Buttons */}
          <View style={styles.actions}>
            {isDownloading ? (
              <TouchableOpacity
                onPress={handleCancel}
                style={[styles.cancelBtn, { borderColor: '#EF4444' }]}
              >
                <Ionicons name="stop-circle-outline" size={18} color="#EF4444" />
                <Text style={styles.cancelBtnText}>Stop Download</Text>
              </TouchableOpacity>
            ) : percent < 100 ? (
              <TouchableOpacity
                onPress={handleStartDownload}
                style={[styles.downloadBtn, { backgroundColor: theme.primary }]}
              >
                <Ionicons name="arrow-down-circle-outline" size={20} color="#FFFFFF" />
                <Text style={styles.downloadBtnText}>
                  {offlineCount > 0 ? 'Resume Download' : 'Download All Tunes (Offline Pack)'}
                </Text>
              </TouchableOpacity>
            ) : null}

            {offlineCount > 0 && !isDownloading && (
              <TouchableOpacity
                onPress={handleClearCache}
                style={[styles.clearBtn, { borderColor: theme.border }]}
              >
                <Ionicons name="trash-outline" size={16} color={theme.textMuted} />
                <Text style={[styles.clearBtnText, { color: theme.textMuted }]}>
                  Clear Offline Cache
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  backdrop: {
    ...StyleSheet.absoluteFill,
  },
  modalCard: {
    width: '100%',
    maxWidth: 440,
    borderRadius: 22,
    borderWidth: 1,
    padding: 20,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: '800',
  },
  subtitle: {
    fontSize: 12,
    marginTop: 2,
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  instrumentSelectorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 14,
    marginBottom: 12,
  },
  selectorLabel: {
    fontSize: 13,
    fontWeight: '600',
  },
  segmentBox: {
    flexDirection: 'row',
    borderRadius: 10,
    borderWidth: 1,
    padding: 2,
  },
  segmentBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  segmentText: {
    fontSize: 12,
    fontWeight: '700',
  },
  statusBox: {
    borderRadius: 14,
    borderWidth: 1,
    padding: 14,
    marginVertical: 10,
  },
  statusNumbersRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  statusMain: {
    fontSize: 14,
    fontWeight: '700',
  },
  statusPercent: {
    fontSize: 14,
    fontWeight: '800',
  },
  progressTrack: {
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    borderRadius: 4,
  },
  downloadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 10,
  },
  downloadingText: {
    fontSize: 12,
    fontWeight: '500',
    flex: 1,
  },
  completeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 8,
  },
  completeText: {
    color: '#10B981',
    fontSize: 12,
    fontWeight: '600',
  },
  actions: {
    marginTop: 12,
    gap: 10,
  },
  downloadBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: 12,
  },
  downloadBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  cancelBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
  cancelBtnText: {
    color: '#EF4444',
    fontSize: 14,
    fontWeight: '700',
  },
  clearBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
  },
  clearBtnText: {
    fontSize: 12,
    fontWeight: '600',
  },
});
