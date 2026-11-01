import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Pressable,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemeColors } from '../constants/theme';
import { hymns, extractNumber } from '../services/hymnService';

interface QuickNumberPadProps {
  visible: boolean;
  theme: ThemeColors;
  onClose: () => void;
  onSelectHymn: (hymnId: number) => void;
}

export const QuickNumberPad: React.FC<QuickNumberPadProps> = ({
  visible,
  theme,
  onClose,
  onSelectHymn,
}) => {
  const [inputNum, setInputNum] = useState('');

  const handleDigit = (digit: string) => {
    if (inputNum.length >= 4) return;
    setInputNum((prev) => prev + digit);
  };

  const handleBackspace = () => {
    setInputNum((prev) => prev.slice(0, -1));
  };

  const handleClear = () => {
    setInputNum('');
  };

  const handleGo = () => {
    const num = parseInt(inputNum, 10);
    if (!num) return;

    // Find hymn matching this number (K&S {num})
    // For standard 1-865, search where extractNumber(h.hymn_number) === num and category_id !== 0
    let match = hymns.find((h) => {
      if (h.category_id === 0) return false; // skip akunleko roman numerals
      return extractNumber(h.hymn_number) === num;
    });

    if (!match) {
      // try any hymn matching number
      match = hymns.find((h) => extractNumber(h.hymn_number) === num);
    }

    if (match) {
      setInputNum('');
      onClose();
      onSelectHymn(match.id);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable
          style={[
            styles.modalContainer,
            { backgroundColor: theme.surface, borderColor: theme.border },
          ]}
          onPress={(e) => e.stopPropagation()}
        >
          <View style={styles.header}>
            <Text style={[styles.title, { color: theme.text }]}>Jump to Hymn</Text>
            <TouchableOpacity onPress={onClose} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
              <Ionicons name="close" size={24} color={theme.textMuted} />
            </TouchableOpacity>
          </View>

          {/* Number Display */}
          <View style={[styles.displayBox, { backgroundColor: theme.background, borderColor: theme.border }]}>
            <Text style={[styles.prefix, { color: theme.primary }]}>K&S</Text>
            <Text style={[styles.numberInput, { color: theme.text }]}>
              {inputNum || '___'}
            </Text>
          </View>

          {/* Keypad Grid */}
          <View style={styles.grid}>
            {['1', '2', '3', '4', '5', '6', '7', '8', '9', 'C', '0', '⌫'].map((btn) => {
              const isAction = btn === 'C' || btn === '⌫';
              return (
                <TouchableOpacity
                  key={btn}
                  style={[
                    styles.key,
                    {
                      backgroundColor: isAction ? theme.borderLight : theme.surfaceElevated,
                      borderColor: theme.border,
                    },
                  ]}
                  onPress={() => {
                    if (btn === 'C') handleClear();
                    else if (btn === '⌫') handleBackspace();
                    else handleDigit(btn);
                  }}
                >
                  <Text
                    style={[
                      styles.keyText,
                      { color: isAction ? theme.primary : theme.text },
                    ]}
                  >
                    {btn}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Go Button */}
          <TouchableOpacity
            disabled={!inputNum}
            style={[
              styles.goButton,
              {
                backgroundColor: inputNum ? theme.primary : theme.textMuted + '40',
              },
            ]}
            onPress={handleGo}
          >
            <Text style={styles.goButtonText}>Open Hymn {inputNum ? `K&S ${inputNum}` : ''}</Text>
            <Ionicons name="arrow-forward" size={18} color="#FFFFFF" />
          </TouchableOpacity>
        </Pressable>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContainer: {
    width: '100%',
    maxWidth: 340,
    borderRadius: 20,
    borderWidth: 1,
    padding: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
  },
  displayBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 60,
    borderRadius: 14,
    borderWidth: 1,
    marginBottom: 20,
    gap: 8,
  },
  prefix: {
    fontSize: 24,
    fontWeight: '800',
  },
  numberInput: {
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: 2,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 10,
  },
  key: {
    width: '30%',
    height: 52,
    borderRadius: 12,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  keyText: {
    fontSize: 20,
    fontWeight: '700',
  },
  goButton: {
    flexDirection: 'row',
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 18,
    gap: 8,
  },
  goButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});
