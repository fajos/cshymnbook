import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Pressable,
  TextInput,
  ScrollView,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Setlist } from '../types/hymn';
import { ThemeColors } from '../constants/theme';

interface AddToSetlistModalProps {
  visible: boolean;
  hymnId: number;
  hymnTitle: string;
  hymnNumber: string;
  setlists: Setlist[];
  theme: ThemeColors;
  onClose: () => void;
  onAddToSetlist: (setlistId: string) => void;
  onCreateAndAdd: (name: string, description?: string) => Promise<void>;
}

export const AddToSetlistModal: React.FC<AddToSetlistModalProps> = ({
  visible,
  hymnId,
  hymnTitle,
  hymnNumber,
  setlists,
  theme,
  onClose,
  onAddToSetlist,
  onCreateAndAdd,
}) => {
  const [isCreating, setIsCreating] = useState(false);
  const [newSetName, setNewSetName] = useState('');
  const [newSetDesc, setNewSetDesc] = useState('');

  const handleCreate = async () => {
    if (!newSetName.trim()) {
      Alert.alert('Required', 'Please enter a name for the Service Set.');
      return;
    }
    await onCreateAndAdd(newSetName, newSetDesc);
    setNewSetName('');
    setNewSetDesc('');
    setIsCreating(false);
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable
          style={[styles.modalBox, { backgroundColor: theme.surface, borderColor: theme.border }]}
          onPress={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <View style={styles.header}>
            <View style={{ flex: 1 }}>
              <Text style={[styles.title, { color: theme.text }]}>Add to Service Set</Text>
              <Text style={[styles.hymnLabel, { color: theme.primary }]} numberOfLines={1}>
                {hymnNumber} • {hymnTitle}
              </Text>
            </View>
            <TouchableOpacity onPress={onClose} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
              <Ionicons name="close" size={24} color={theme.textMuted} />
            </TouchableOpacity>
          </View>

          {isCreating ? (
            /* Create New Set Form */
            <View style={styles.createForm}>
              <Text style={[styles.inputLabel, { color: theme.textSecondary }]}>Service Set Name</Text>
              <TextInput
                placeholder="e.g. Sunday Divine Service, Vigil..."
                placeholderTextColor={theme.textMuted}
                value={newSetName}
                onChangeText={setNewSetName}
                style={[styles.input, { color: theme.text, borderColor: theme.border, backgroundColor: theme.background }]}
                autoFocus
              />

              <Text style={[styles.inputLabel, { color: theme.textSecondary, marginTop: 10 }]}>Description (Optional)</Text>
              <TextInput
                placeholder="e.g. Hymns for opening, communion & closing"
                placeholderTextColor={theme.textMuted}
                value={newSetDesc}
                onChangeText={setNewSetDesc}
                style={[styles.input, { color: theme.text, borderColor: theme.border, backgroundColor: theme.background }]}
              />

              <View style={styles.formButtons}>
                <TouchableOpacity
                  onPress={() => setIsCreating(false)}
                  style={[styles.cancelBtn, { borderColor: theme.border }]}
                >
                  <Text style={[styles.cancelBtnText, { color: theme.textSecondary }]}>Back</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={handleCreate}
                  style={[styles.submitBtn, { backgroundColor: theme.primary }]}
                >
                  <Text style={styles.submitBtnText}>Create & Add</Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            /* Setlists List */
            <>
              <ScrollView style={styles.setlistScroll} showsVerticalScrollIndicator={false}>
                {setlists.map((set) => {
                  const alreadyAdded = set.hymnIds.includes(hymnId);
                  return (
                    <TouchableOpacity
                      key={set.id}
                      disabled={alreadyAdded}
                      onPress={() => {
                        onAddToSetlist(set.id);
                        onClose();
                      }}
                      style={[
                        styles.setItem,
                        {
                          backgroundColor: alreadyAdded ? theme.background : theme.surfaceElevated,
                          borderColor: theme.border,
                        },
                      ]}
                    >
                      <View style={{ flex: 1 }}>
                        <Text style={[styles.setName, { color: theme.text }]}>{set.name}</Text>
                        <Text style={[styles.setCount, { color: theme.textMuted }]}>
                          {set.hymnIds.length} Hymns
                        </Text>
                      </View>

                      {alreadyAdded ? (
                        <View style={styles.addedBadge}>
                          <Ionicons name="checkmark-circle" size={18} color="#10B981" />
                          <Text style={styles.addedText}>Added</Text>
                        </View>
                      ) : (
                        <Ionicons name="add-circle-outline" size={24} color={theme.primary} />
                      )}
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>

              {/* Create New Setlist Button */}
              <TouchableOpacity
                onPress={() => setIsCreating(true)}
                style={[styles.newSetBtn, { borderColor: theme.primary, backgroundColor: theme.primary + '10' }]}
              >
                <Ionicons name="add" size={20} color={theme.primary} />
                <Text style={[styles.newSetBtnText, { color: theme.primary }]}>Create New Service Set</Text>
              </TouchableOpacity>
            </>
          )}
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
  modalBox: {
    width: '100%',
    maxWidth: 380,
    maxHeight: '80%',
    borderRadius: 20,
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
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
  },
  hymnLabel: {
    fontSize: 13,
    fontWeight: '600',
    marginTop: 2,
  },
  setlistScroll: {
    maxHeight: 240,
    marginVertical: 8,
  },
  setItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 8,
  },
  setName: {
    fontSize: 15,
    fontWeight: '700',
  },
  setCount: {
    fontSize: 12,
    marginTop: 2,
  },
  addedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  addedText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#10B981',
  },
  newSetBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderStyle: 'dashed',
    marginTop: 10,
    gap: 6,
  },
  newSetBtnText: {
    fontSize: 14,
    fontWeight: '700',
  },
  createForm: {
    paddingVertical: 8,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 6,
  },
  input: {
    height: 44,
    borderRadius: 10,
    borderWidth: 1,
    paddingHorizontal: 12,
    fontSize: 14,
  },
  formButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
    marginTop: 18,
  },
  cancelBtn: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 10,
    borderWidth: 1,
  },
  cancelBtnText: {
    fontSize: 14,
    fontWeight: '600',
  },
  submitBtn: {
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 10,
  },
  submitBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
});
