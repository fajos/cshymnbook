import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Hymn, HymnNote } from '../types/hymn';
import { ThemeColors } from '../constants/theme';
import { storageService } from '../services/storageService';

interface HymnNoteModalProps {
  visible: boolean;
  hymn: Hymn;
  theme: ThemeColors;
  onClose: () => void;
  onNoteUpdated?: (note: HymnNote | null) => void;
}

const PRESET_TAGS = ['Prayer', 'Thanksgiving', 'Sunday Service', 'Vigil', 'Choir Rehearsal', 'Memorial'];

export const HymnNoteModal: React.FC<HymnNoteModalProps> = ({
  visible,
  hymn,
  theme,
  onClose,
  onNoteUpdated,
}) => {
  const [noteText, setNoteText] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [existingNote, setExistingNote] = useState<HymnNote | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (visible && hymn) {
      storageService.getNoteForHymn(hymn.id).then((note) => {
        if (note) {
          setExistingNote(note);
          setNoteText(note.text);
          setSelectedTags(note.tags || []);
        } else {
          setExistingNote(null);
          setNoteText('');
          setSelectedTags([]);
        }
      });
    }
  }, [visible, hymn]);

  const handleToggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleSave = async () => {
    if (!noteText.trim()) {
      Alert.alert('Empty Note', 'Please enter some text before saving.');
      return;
    }

    try {
      setIsSaving(true);
      const saved = await storageService.saveNote(hymn.id, noteText, selectedTags);
      setExistingNote(saved);
      setIsSaving(false);
      onNoteUpdated?.(saved);
      onClose();
    } catch {
      setIsSaving(false);
      Alert.alert('Error', 'Unable to save note. Please try again.');
    }
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Note',
      'Are you sure you want to delete this personal devotional note?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            await storageService.deleteNote(hymn.id);
            setExistingNote(null);
            setNoteText('');
            setSelectedTags([]);
            onNoteUpdated?.(null);
            onClose();
          },
        },
      ]
    );
  };

  const formatDate = (timestamp?: number) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    return date.toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.overlay}
      >
        <TouchableOpacity
          activeOpacity={1}
          onPress={onClose}
          style={styles.backdrop}
        />

        <View style={[styles.container, { backgroundColor: theme.surfaceCard, borderColor: theme.border }]}>
          {/* Header */}
          <View style={[styles.header, { borderBottomColor: theme.borderLight }]}>
            <View style={styles.headerLeft}>
              <View style={[styles.iconBadge, { backgroundColor: theme.primary + '15' }]}>
                <Ionicons name="journal-outline" size={20} color={theme.primary} />
              </View>
              <View>
                <Text style={[styles.title, { color: theme.text }]}>Personal Note</Text>
                <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
                  {hymn.hymn_number} • {hymn.title}
                </Text>
              </View>
            </View>

            <TouchableOpacity
              onPress={onClose}
              style={[styles.closeBtn, { backgroundColor: theme.borderLight }]}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Ionicons name="close" size={18} color={theme.text} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.body} showsVerticalScrollIndicator={false}>
            {/* Quick Tags */}
            <Text style={[styles.sectionLabel, { color: theme.textMuted }]}>
              DEVOTIONAL TAGS
            </Text>
            <View style={styles.tagsRow}>
              {PRESET_TAGS.map((tag) => {
                const isSelected = selectedTags.includes(tag);
                return (
                  <TouchableOpacity
                    key={tag}
                    onPress={() => handleToggleTag(tag)}
                    style={[
                      styles.tagChip,
                      {
                        backgroundColor: isSelected ? theme.primary : theme.background,
                        borderColor: isSelected ? theme.primary : theme.border,
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.tagChipText,
                        { color: isSelected ? '#FFFFFF' : theme.textSecondary },
                      ]}
                    >
                      {tag}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Note Input */}
            <View style={[styles.inputBox, { backgroundColor: theme.background, borderColor: theme.border }]}>
              <TextInput
                value={noteText}
                onChangeText={setNoteText}
                placeholder="Write personal reflection, prayer notes, or memories attached to this hymn..."
                placeholderTextColor={theme.textMuted}
                multiline
                numberOfLines={7}
                textAlignVertical="top"
                style={[styles.input, { color: theme.text }]}
              />
            </View>

            {existingNote && (
              <Text style={[styles.timestamp, { color: theme.textMuted }]}>
                Last updated: {formatDate(existingNote.updatedAt)}
              </Text>
            )}
          </ScrollView>

          {/* Footer Actions */}
          <View style={[styles.footer, { borderTopColor: theme.borderLight }]}>
            {existingNote ? (
              <TouchableOpacity
                onPress={handleDelete}
                style={[styles.deleteBtn, { borderColor: '#EF4444' }]}
              >
                <Ionicons name="trash-outline" size={18} color="#EF4444" />
                <Text style={styles.deleteText}>Delete</Text>
              </TouchableOpacity>
            ) : (
              <View style={{ flex: 1 }} />
            )}

            <View style={styles.footerRight}>
              <TouchableOpacity
                onPress={onClose}
                style={[styles.cancelBtn, { borderColor: theme.border }]}
              >
                <Text style={[styles.cancelText, { color: theme.textSecondary }]}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleSave}
                disabled={isSaving}
                style={[styles.saveBtn, { backgroundColor: theme.primary }]}
              >
                <Ionicons name="checkmark" size={18} color="#FFFFFF" />
                <Text style={styles.saveText}>{isSaving ? 'Saving...' : 'Save Note'}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.45)',
  },
  backdrop: {
    flex: 1,
  },
  container: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderWidth: 1,
    borderBottomWidth: 0,
    maxHeight: '85%',
    paddingBottom: Platform.OS === 'ios' ? 24 : 12,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  iconBadge: {
    width: 38,
    height: 38,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: '800',
  },
  subtitle: {
    fontSize: 12,
    fontWeight: '500',
    marginTop: 2,
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  body: {
    paddingHorizontal: 20,
    paddingVertical: 14,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 14,
  },
  tagChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
  },
  tagChipText: {
    fontSize: 12,
    fontWeight: '600',
  },
  inputBox: {
    borderRadius: 14,
    borderWidth: 1,
    padding: 12,
    minHeight: 140,
  },
  input: {
    fontSize: 15,
    lineHeight: 22,
    minHeight: 120,
  },
  timestamp: {
    fontSize: 11,
    fontStyle: 'italic',
    marginTop: 8,
    textAlign: 'right',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 14,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  deleteBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
  },
  deleteText: {
    color: '#EF4444',
    fontSize: 13,
    fontWeight: '700',
  },
  footerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  cancelBtn: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
  },
  cancelText: {
    fontSize: 14,
    fontWeight: '600',
  },
  saveBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
  },
  saveText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
});
