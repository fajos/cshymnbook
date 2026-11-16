import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemeColors } from '../constants/theme';

interface HymnMetronomeModalProps {
  visible: boolean;
  theme: ThemeColors;
  hymnTitle?: string;
  suggestedBpm?: number;
  onClose: () => void;
}

const TEMPO_PRESETS = [
  { label: 'Solemn / Adura', bpm: 64 },
  { label: 'Worship / Alẹ', bpm: 84 },
  { label: 'Praise / Standard', bpm: 104 },
  { label: 'Lively / Idaraya', bpm: 128 },
];

export const HymnMetronomeModal: React.FC<HymnMetronomeModalProps> = ({
  visible,
  theme,
  hymnTitle,
  suggestedBpm = 92,
  onClose,
}) => {
  const [bpm, setBpm] = useState<number>(suggestedBpm);
  const [beatsPerBar, setBeatsPerBar] = useState<number>(4);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentBeat, setCurrentBeat] = useState<number>(0);

  const tapTimestampsRef = useRef<number[]>([]);
  const timerRef = useRef<any>(null);

  // Sync initial suggested BPM when modal opens
  useEffect(() => {
    if (visible && suggestedBpm) {
      setBpm(suggestedBpm);
    }
    if (!visible) {
      setIsPlaying(false);
      setCurrentBeat(0);
    }
  }, [visible, suggestedBpm]);

  // Metronome beat loop
  useEffect(() => {
    if (isPlaying) {
      const intervalMs = (60 / bpm) * 1000;
      timerRef.current = setInterval(() => {
        setCurrentBeat((prev) => (prev + 1) % beatsPerBar);
      }, intervalMs);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      setCurrentBeat(0);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [isPlaying, bpm, beatsPerBar]);

  const handleTapTempo = () => {
    const now = Date.now();
    const stamps = [...tapTimestampsRef.current, now].slice(-4);
    tapTimestampsRef.current = stamps;

    if (stamps.length >= 2) {
      const intervals: number[] = [];
      for (let i = 1; i < stamps.length; i++) {
        intervals.push(stamps[i] - stamps[i - 1]);
      }
      const avgInterval = intervals.reduce((a, b) => a + b, 0) / intervals.length;
      if (avgInterval > 250 && avgInterval < 2000) {
        const calculatedBpm = Math.round(60000 / avgInterval);
        setBpm(Math.max(40, Math.min(220, calculatedBpm)));
      }
    }
  };

  const adjustBpm = (delta: number) => {
    setBpm((prev) => Math.max(40, Math.min(220, prev + delta)));
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <TouchableOpacity activeOpacity={1} onPress={onClose} style={styles.backdrop} />

        <View style={[styles.container, { backgroundColor: theme.surfaceCard, borderColor: theme.border }]}>
          {/* Header */}
          <View style={[styles.header, { borderBottomColor: theme.borderLight }]}>
            <View style={styles.headerLeft}>
              <View style={[styles.iconBox, { backgroundColor: theme.accentGold + '18' }]}>
                <Ionicons name="speedometer-outline" size={20} color={theme.accentGold} />
              </View>
              <View>
                <Text style={[styles.title, { color: theme.text }]}>Hymn Metronome</Text>
                {hymnTitle ? (
                  <Text style={[styles.subtitle, { color: theme.textSecondary }]} numberOfLines={1}>
                    {hymnTitle}
                  </Text>
                ) : null}
              </View>
            </View>

            <TouchableOpacity
              onPress={onClose}
              style={[styles.closeBtn, { backgroundColor: theme.borderLight }]}
            >
              <Ionicons name="close" size={18} color={theme.text} />
            </TouchableOpacity>
          </View>

          {/* Visual Beat Indicator Dots */}
          <View style={styles.beatsRow}>
            {Array.from({ length: beatsPerBar }).map((_, idx) => {
              const isCurrent = isPlaying && currentBeat === idx;
              const isFirst = idx === 0;
              return (
                <View
                  key={idx}
                  style={[
                    styles.beatDot,
                    {
                      borderColor: isFirst ? theme.accentGold : theme.primary,
                      backgroundColor: isCurrent
                        ? isFirst
                          ? theme.accentGold
                          : theme.primary
                        : theme.borderLight,
                      transform: [{ scale: isCurrent ? 1.3 : 1.0 }],
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.beatNumber,
                      { color: isCurrent ? '#FFFFFF' : theme.textMuted },
                    ]}
                  >
                    {idx + 1}
                  </Text>
                </View>
              );
            })}
          </View>

          {/* Central BPM Display */}
          <View style={styles.bpmDisplayBox}>
            <TouchableOpacity
              onPress={() => adjustBpm(-5)}
              style={[styles.stepperBtn, { backgroundColor: theme.background, borderColor: theme.border }]}
            >
              <Ionicons name="remove" size={24} color={theme.text} />
            </TouchableOpacity>

            <View style={styles.bpmCenter}>
              <Text style={[styles.bpmNumber, { color: theme.text }]}>{bpm}</Text>
              <Text style={[styles.bpmLabel, { color: theme.textMuted }]}>BPM</Text>
            </View>

            <TouchableOpacity
              onPress={() => adjustBpm(5)}
              style={[styles.stepperBtn, { backgroundColor: theme.background, borderColor: theme.border }]}
            >
              <Ionicons name="add" size={24} color={theme.text} />
            </TouchableOpacity>
          </View>

          {/* Micro Adjustment Controls (-1 / +1) & Tap Tempo */}
          <View style={styles.fineTuningRow}>
            <TouchableOpacity
              onPress={() => adjustBpm(-1)}
              style={[styles.microBtn, { borderColor: theme.border }]}
            >
              <Text style={[styles.microBtnText, { color: theme.textSecondary }]}>-1</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleTapTempo}
              style={[styles.tapTempoBtn, { backgroundColor: theme.primary + '15', borderColor: theme.primary }]}
            >
              <Ionicons name="finger-print" size={16} color={theme.primary} />
              <Text style={[styles.tapTempoText, { color: theme.primary }]}>Tap Tempo</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => adjustBpm(1)}
              style={[styles.microBtn, { borderColor: theme.border }]}
            >
              <Text style={[styles.microBtnText, { color: theme.textSecondary }]}>+1</Text>
            </TouchableOpacity>
          </View>

          {/* Meter Time Signature Selector (2/4, 3/4, 4/4, 6/8) */}
          <View style={styles.meterSelectorRow}>
            {[2, 3, 4, 6].map((meter) => (
              <TouchableOpacity
                key={meter}
                onPress={() => setBeatsPerBar(meter)}
                style={[
                  styles.meterChip,
                  {
                    backgroundColor: beatsPerBar === meter ? theme.primary : theme.background,
                    borderColor: beatsPerBar === meter ? theme.primary : theme.border,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.meterChipText,
                    { color: beatsPerBar === meter ? '#FFFFFF' : theme.textSecondary },
                  ]}
                >
                  {meter}/4
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Presets */}
          <View style={styles.presetsRow}>
            {TEMPO_PRESETS.map((p) => (
              <TouchableOpacity
                key={p.label}
                onPress={() => setBpm(p.bpm)}
                style={[
                  styles.presetBtn,
                  bpm === p.bpm && { borderColor: theme.accentGold, backgroundColor: theme.accentGold + '12' },
                ]}
              >
                <Text
                  style={[
                    styles.presetBtnText,
                    { color: bpm === p.bpm ? theme.accentGold : theme.textMuted },
                  ]}
                >
                  {p.label} ({p.bpm})
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Master Play / Stop Button */}
          <TouchableOpacity
            onPress={() => setIsPlaying(!isPlaying)}
            style={[
              styles.playBtn,
              { backgroundColor: isPlaying ? '#EF4444' : theme.primary },
            ]}
          >
            <Ionicons name={isPlaying ? 'pause' : 'play'} size={22} color="#FFFFFF" />
            <Text style={styles.playBtnText}>
              {isPlaying ? 'Pause Metronome' : 'Start Metronome'}
            </Text>
          </TouchableOpacity>
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
  container: {
    width: '100%',
    maxWidth: 400,
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
    width: 38,
    height: 38,
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
  beatsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
    marginVertical: 18,
  },
  beatDot: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  beatNumber: {
    fontSize: 13,
    fontWeight: '800',
  },
  bpmDisplayBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 24,
    marginBottom: 12,
  },
  stepperBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bpmCenter: {
    alignItems: 'center',
    minWidth: 100,
  },
  bpmNumber: {
    fontSize: 44,
    fontWeight: '800',
    lineHeight: 50,
  },
  bpmLabel: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.8,
  },
  fineTuningRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    marginBottom: 16,
  },
  microBtn: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
  },
  microBtnText: {
    fontSize: 13,
    fontWeight: '700',
  },
  tapTempoBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
  },
  tapTempoText: {
    fontSize: 13,
    fontWeight: '700',
  },
  meterSelectorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 12,
  },
  meterChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
  },
  meterChipText: {
    fontSize: 12,
    fontWeight: '700',
  },
  presetsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    justifyContent: 'center',
    marginBottom: 16,
  },
  presetBtn: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  presetBtnText: {
    fontSize: 11,
    fontWeight: '600',
  },
  playBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: 14,
  },
  playBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
  },
});
