import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  Modal,
  TextInput,
  Pressable,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Hymn, Setlist } from '../types/hymn';
import { ThemeColors } from '../constants/theme';
import { hymns, getHymnById, searchHymns } from '../services/hymnService';
import { HymnCard } from '../components/HymnCard';

interface FavoritesScreenProps {
  theme: ThemeColors;
  favorites: number[];
  setlists: Setlist[];
  onSelectHymn: (hymnId: number) => void;
  onToggleFavorite: (hymnId: number) => void;
  onCreateSetlist: (name: string, description?: string) => Promise<void>;
  onDeleteSetlist: (id: string) => Promise<void>;
  onAddHymnToSet: (setlistId: string, hymnId: number) => Promise<void>;
  onRemoveHymnFromSet: (setlistId: string, hymnId: number) => Promise<void>;
}

export const FavoritesScreen: React.FC<FavoritesScreenProps> = ({
  theme,
  favorites,
  setlists,
  onSelectHymn,
  onToggleFavorite,
  onCreateSetlist,
  onDeleteSetlist,
  onAddHymnToSet,
  onRemoveHymnFromSet,
}) => {
  const [activeTab, setActiveTab] = useState<'favorites' | 'setlists'>('favorites');
  const [selectedSetlistId, setSelectedSetlistId] = useState<string | null>(null);

  // Create Modal state
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [newSetName, setNewSetName] = useState('');
  const [newSetDesc, setNewSetDesc] = useState('');

  // Picker Modal state (Add hymn to current setlist)
  const [pickerModalVisible, setPickerModalVisible] = useState(false);
  const [pickerSearch, setPickerSearch] = useState('');

  // Favorite hymns list
  const favoriteHymns = hymns.filter((h) => favorites.includes(h.id));

  // Current selected setlist object
  const currentSetlist = setlists.find((s) => s.id === selectedSetlistId) || null;

  const handleCreateSetlist = async () => {
    if (!newSetName.trim()) {
      Alert.alert('Required', 'Please enter a name for the Service Set.');
      return;
    }
    await onCreateSetlist(newSetName, newSetDesc);
    setNewSetName('');
    setNewSetDesc('');
    setCreateModalVisible(false);
  };

  const handleDeleteSetlist = (setlist: Setlist) => {
    Alert.alert(
      'Delete Service Set',
      `Are you sure you want to delete "${setlist.name}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            if (selectedSetlistId === setlist.id) {
              setSelectedSetlistId(null);
            }
            await onDeleteSetlist(setlist.id);
          },
        },
      ]
    );
  };

  // Hymns eligible to add in picker modal
  const pickerResults = React.useMemo(() => {
    if (!currentSetlist) return [];
    const results = searchHymns(pickerSearch);
    return results.slice(0, 30); // limit for fast rendering
  }, [pickerSearch, currentSetlist]);

  // If viewing a specific setlist's hymns
  if (currentSetlist) {
    const setlistHymns = currentSetlist.hymnIds
      .map((id) => getHymnById(id))
      .filter((h): h is Hymn => h !== undefined);

    return (
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        {/* Setlist Header */}
        <View style={[styles.header, { backgroundColor: theme.surface, borderBottomColor: theme.border }]}>
          <TouchableOpacity
            onPress={() => setSelectedSetlistId(null)}
            style={styles.headerBtn}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons name="arrow-back" size={24} color={theme.text} />
          </TouchableOpacity>

          <View style={{ flex: 1, marginLeft: 8 }}>
            <Text style={[styles.headerTitle, { color: theme.text }]} numberOfLines={1}>
              {currentSetlist.name}
            </Text>
            <Text style={[styles.headerSub, { color: theme.textSecondary }]}>
              {setlistHymns.length} Hymns selected
            </Text>
          </View>

          <TouchableOpacity
            onPress={() => setPickerModalVisible(true)}
            style={[styles.addHymnHeaderBtn, { backgroundColor: theme.primary }]}
          >
            <Ionicons name="add" size={18} color="#FFFFFF" />
            <Text style={styles.addHymnHeaderBtnText}>Add Hymn</Text>
          </TouchableOpacity>
        </View>

        {currentSetlist.description ? (
          <View style={[styles.descBanner, { backgroundColor: theme.surfaceCard, borderColor: theme.border }]}>
            <Text style={[styles.descBannerText, { color: theme.textSecondary }]}>
              {currentSetlist.description}
            </Text>
          </View>
        ) : null}

        <FlatList
          data={setlistHymns}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContent}
          renderItem={({ item, index }) => (
            <View style={styles.setlistHymnRow}>
              <View style={[styles.orderBadge, { backgroundColor: theme.primary + '15' }]}>
                <Text style={[styles.orderBadgeText, { color: theme.primary }]}>
                  {index + 1}
                </Text>
              </View>
              <View style={{ flex: 1 }}>
                <HymnCard
                  hymn={item}
                  theme={theme}
                  isFavorite={favorites.includes(item.id)}
                  onPress={() => onSelectHymn(item.id)}
                  onToggleFavorite={() => onToggleFavorite(item.id)}
                />
              </View>
              <TouchableOpacity
                onPress={() => onRemoveHymnFromSet(currentSetlist.id, item.id)}
                style={styles.removeBtn}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Ionicons name="trash-outline" size={20} color="#EF4444" />
              </TouchableOpacity>
            </View>
          )}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="musical-notes-outline" size={54} color={theme.textMuted} />
              <Text style={[styles.emptyTitle, { color: theme.text }]}>No Hymns in this Set</Text>
              <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
                Tap the "+ Add Hymn" button above to add hymns for this service.
              </Text>
              <TouchableOpacity
                onPress={() => setPickerModalVisible(true)}
                style={[styles.actionBtn, { backgroundColor: theme.primary }]}
              >
                <Ionicons name="add-circle-outline" size={20} color="#FFFFFF" />
                <Text style={styles.actionBtnText}>Add Hymn Now</Text>
              </TouchableOpacity>
            </View>
          }
        />

        {/* Picker Modal for Adding Hymns */}
        <Modal
          visible={pickerModalVisible}
          transparent
          animationType="slide"
          onRequestClose={() => setPickerModalVisible(false)}
        >
          <View style={styles.pickerOverlay}>
            <View style={[styles.pickerContainer, { backgroundColor: theme.surface, borderColor: theme.border }]}>
              <View style={styles.pickerHeader}>
                <Text style={[styles.pickerTitle, { color: theme.text }]}>Select Hymn to Add</Text>
                <TouchableOpacity onPress={() => setPickerModalVisible(false)}>
                  <Ionicons name="close" size={24} color={theme.textMuted} />
                </TouchableOpacity>
              </View>

              <View style={[styles.pickerSearchBox, { backgroundColor: theme.background, borderColor: theme.border }]}>
                <Ionicons name="search" size={18} color={theme.textMuted} />
                <TextInput
                  placeholder="Search number, title or lyrics..."
                  placeholderTextColor={theme.textMuted}
                  value={pickerSearch}
                  onChangeText={setPickerSearch}
                  style={[styles.pickerSearchInput, { color: theme.text }]}
                  autoFocus
                />
              </View>

              <FlatList
                data={pickerResults}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => {
                  const alreadyInSet = currentSetlist.hymnIds.includes(item.id);
                  return (
                    <TouchableOpacity
                      disabled={alreadyInSet}
                      onPress={async () => {
                        await onAddHymnToSet(currentSetlist.id, item.id);
                        setPickerModalVisible(false);
                        setPickerSearch('');
                      }}
                      style={[
                        styles.pickerItem,
                        { borderColor: theme.border, backgroundColor: alreadyInSet ? theme.background : theme.surfaceElevated },
                      ]}
                    >
                      <View style={[styles.pickerNumBadge, { backgroundColor: theme.primary + '15' }]}>
                        <Text style={[styles.pickerNumText, { color: theme.primary }]}>{item.hymn_number}</Text>
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={[styles.pickerItemTitle, { color: theme.text }]} numberOfLines={1}>
                          {item.title}
                        </Text>
                        <Text style={[styles.pickerItemCat, { color: theme.textMuted }]} numberOfLines={1}>
                          {item.category_name}
                        </Text>
                      </View>
                      {alreadyInSet ? (
                        <Text style={styles.alreadyInSetText}>In Set</Text>
                      ) : (
                        <Ionicons name="add-circle" size={24} color={theme.primary} />
                      )}
                    </TouchableOpacity>
                  );
                }}
              />
            </View>
          </View>
        </Modal>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Segmented Tabs */}
      <View style={[styles.tabsRow, { backgroundColor: theme.surface, borderBottomColor: theme.border }]}>
        <TouchableOpacity
          onPress={() => setActiveTab('favorites')}
          style={[
            styles.tab,
            activeTab === 'favorites' && [styles.activeTab, { borderBottomColor: theme.primary }],
          ]}
        >
          <Ionicons
            name={activeTab === 'favorites' ? 'heart' : 'heart-outline'}
            size={18}
            color={activeTab === 'favorites' ? theme.primary : theme.textMuted}
          />
          <Text
            style={[
              styles.tabText,
              { color: activeTab === 'favorites' ? theme.primary : theme.textMuted },
            ]}
          >
            Favorites ({favoriteHymns.length})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setActiveTab('setlists')}
          style={[
            styles.tab,
            activeTab === 'setlists' && [styles.activeTab, { borderBottomColor: theme.primary }],
          ]}
        >
          <Ionicons
            name={activeTab === 'setlists' ? 'albums' : 'albums-outline'}
            size={18}
            color={activeTab === 'setlists' ? theme.primary : theme.textMuted}
          />
          <Text
            style={[
              styles.tabText,
              { color: activeTab === 'setlists' ? theme.primary : theme.textMuted },
            ]}
          >
            Service Sets ({setlists.length})
          </Text>
        </TouchableOpacity>
      </View>

      {/* Tab 1: Bookmarked Favorites */}
      {activeTab === 'favorites' ? (
        <FlatList
          data={favoriteHymns}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <HymnCard
              hymn={item}
              theme={theme}
              isFavorite={true}
              onPress={() => onSelectHymn(item.id)}
              onToggleFavorite={() => onToggleFavorite(item.id)}
            />
          )}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="heart-outline" size={54} color={theme.textMuted} />
              <Text style={[styles.emptyTitle, { color: theme.text }]}>No Favorite Hymns</Text>
              <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
                Tap the heart icon on any hymn to save it here for quick access during service.
              </Text>
            </View>
          }
        />
      ) : (
        /* Tab 2: Service Sets with "+ Create New Set" */
        <View style={{ flex: 1 }}>
          <View style={[styles.setlistActionBar, { backgroundColor: theme.surface, borderBottomColor: theme.border }]}>
            <View>
              <Text style={[styles.setlistActionTitle, { color: theme.text }]}>Worship Programs</Text>
              <Text style={[styles.setlistActionSubtitle, { color: theme.textMuted }]}>
                Organize hymns for Sunday services & vigils
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => setCreateModalVisible(true)}
              style={[styles.newSetButton, { backgroundColor: theme.primary }]}
            >
              <Ionicons name="add" size={18} color="#FFFFFF" />
              <Text style={styles.newSetButtonText}>New Set</Text>
            </TouchableOpacity>
          </View>

          <FlatList
            data={setlists}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContent}
            renderItem={({ item }) => (
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => setSelectedSetlistId(item.id)}
                style={[
                  styles.setlistCard,
                  { backgroundColor: theme.surfaceCard, borderColor: theme.border },
                ]}
              >
                <View style={[styles.setlistIcon, { backgroundColor: theme.primary + '15' }]}>
                  <Ionicons name="musical-notes" size={24} color={theme.primary} />
                </View>

                <View style={{ flex: 1 }}>
                  <Text style={[styles.setlistName, { color: theme.text }]}>{item.name}</Text>
                  {item.description ? (
                    <Text style={[styles.setlistDesc, { color: theme.textSecondary }]} numberOfLines={1}>
                      {item.description}
                    </Text>
                  ) : null}
                  <Text style={[styles.setlistCount, { color: theme.accentGold }]}>
                    {item.hymnIds.length} {item.hymnIds.length === 1 ? 'Hymn' : 'Hymns'} selected
                  </Text>
                </View>

                <TouchableOpacity
                  onPress={(e) => {
                    e.stopPropagation();
                    handleDeleteSetlist(item);
                  }}
                  style={styles.deleteSetBtn}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                  <Ionicons name="trash-outline" size={18} color={theme.textMuted} />
                </TouchableOpacity>

                <Ionicons name="chevron-forward" size={18} color={theme.textMuted} style={{ marginLeft: 6 }} />
              </TouchableOpacity>
            )}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Ionicons name="albums-outline" size={54} color={theme.textMuted} />
                <Text style={[styles.emptyTitle, { color: theme.text }]}>No Service Sets</Text>
                <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
                  Create your first service set to group hymns for Sunday Divine Service, Vigil, or Harvest.
                </Text>
                <TouchableOpacity
                  onPress={() => setCreateModalVisible(true)}
                  style={[styles.actionBtn, { backgroundColor: theme.primary }]}
                >
                  <Ionicons name="add" size={20} color="#FFFFFF" />
                  <Text style={styles.actionBtnText}>Create New Service Set</Text>
                </TouchableOpacity>
              </View>
            }
          />
        </View>
      )}

      {/* Modal: Create New Service Set */}
      <Modal
        visible={createModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setCreateModalVisible(false)}
      >
        <Pressable style={styles.modalOverlay} onPress={() => setCreateModalVisible(false)}>
          <Pressable
            style={[styles.modalBox, { backgroundColor: theme.surface, borderColor: theme.border }]}
            onPress={(e) => e.stopPropagation()}
          >
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: theme.text }]}>Create Service Set</Text>
              <TouchableOpacity onPress={() => setCreateModalVisible(false)}>
                <Ionicons name="close" size={24} color={theme.textMuted} />
              </TouchableOpacity>
            </View>

            <Text style={[styles.modalLabel, { color: theme.textSecondary }]}>Service Program Name</Text>
            <TextInput
              placeholder="e.g. Sunday Divine Service, Harvest Feast..."
              placeholderTextColor={theme.textMuted}
              value={newSetName}
              onChangeText={setNewSetName}
              style={[styles.modalInput, { color: theme.text, borderColor: theme.border, backgroundColor: theme.background }]}
              autoFocus
            />

            <Text style={[styles.modalLabel, { color: theme.textSecondary, marginTop: 12 }]}>
              Description / Notes (Optional)
            </Text>
            <TextInput
              placeholder="e.g. Opening, Processional, Sermon & Recessional"
              placeholderTextColor={theme.textMuted}
              value={newSetDesc}
              onChangeText={setNewSetDesc}
              style={[styles.modalInput, { color: theme.text, borderColor: theme.border, backgroundColor: theme.background }]}
            />

            <View style={styles.modalFooter}>
              <TouchableOpacity
                onPress={() => setCreateModalVisible(false)}
                style={[styles.modalCancelBtn, { borderColor: theme.border }]}
              >
                <Text style={[styles.modalCancelText, { color: theme.textSecondary }]}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleCreateSetlist}
                style={[styles.modalSubmitBtn, { backgroundColor: theme.primary }]}
              >
                <Text style={styles.modalSubmitText}>Create Set</Text>
              </TouchableOpacity>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    height: 58,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  headerBtn: {
    padding: 6,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '700',
  },
  headerSub: {
    fontSize: 12,
    fontWeight: '500',
  },
  addHymnHeaderBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 18,
    gap: 4,
  },
  addHymnHeaderBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  descBanner: {
    margin: 16,
    marginBottom: 6,
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
  },
  descBannerText: {
    fontSize: 13,
    lineHeight: 18,
  },
  tabsRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    gap: 8,
  },
  activeTab: {
    borderBottomWidth: 3,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '700',
  },
  setlistActionBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  setlistActionTitle: {
    fontSize: 16,
    fontWeight: '800',
  },
  setlistActionSubtitle: {
    fontSize: 12,
    fontWeight: '500',
    marginTop: 1,
  },
  newSetButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 4,
  },
  newSetButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  listContent: {
    paddingTop: 8,
    paddingBottom: 80,
  },
  setlistCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginVertical: 6,
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
    gap: 14,
  },
  setlistIcon: {
    width: 46,
    height: 46,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  setlistName: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 2,
  },
  setlistDesc: {
    fontSize: 13,
    marginBottom: 4,
  },
  setlistCount: {
    fontSize: 12,
    fontWeight: '600',
  },
  deleteSetBtn: {
    padding: 6,
  },
  setlistHymnRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  orderBadge: {
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 14,
  },
  orderBadgeText: {
    fontSize: 12,
    fontWeight: '800',
  },
  removeBtn: {
    padding: 10,
    marginRight: 8,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 70,
    paddingHorizontal: 30,
    gap: 10,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginTop: 6,
  },
  emptyText: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 20,
    marginTop: 10,
    gap: 8,
  },
  actionBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalBox: {
    width: '100%',
    maxWidth: 380,
    borderRadius: 20,
    borderWidth: 1,
    padding: 20,
    elevation: 8,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '800',
  },
  modalLabel: {
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 6,
  },
  modalInput: {
    height: 44,
    borderRadius: 10,
    borderWidth: 1,
    paddingHorizontal: 12,
    fontSize: 14,
  },
  modalFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
    marginTop: 20,
  },
  modalCancelBtn: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 10,
    borderWidth: 1,
  },
  modalCancelText: {
    fontSize: 14,
    fontWeight: '600',
  },
  modalSubmitBtn: {
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 10,
  },
  modalSubmitText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  pickerOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'flex-end',
  },
  pickerContainer: {
    height: '75%',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderTopWidth: 1,
    padding: 16,
  },
  pickerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  pickerTitle: {
    fontSize: 18,
    fontWeight: '800',
  },
  pickerSearchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 44,
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 12,
    gap: 8,
    marginBottom: 12,
  },
  pickerSearchInput: {
    flex: 1,
    fontSize: 14,
  },
  pickerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 8,
    gap: 10,
  },
  pickerNumBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  pickerNumText: {
    fontSize: 12,
    fontWeight: '800',
  },
  pickerItemTitle: {
    fontSize: 15,
    fontWeight: '700',
  },
  pickerItemCat: {
    fontSize: 12,
  },
  alreadyInSetText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#10B981',
  },
});
