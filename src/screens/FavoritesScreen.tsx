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
  Share,
  Platform,
  ScrollView,
} from 'react-native';
import * as Clipboard from 'expo-clipboard';
import { Ionicons } from '@expo/vector-icons';
import { Hymn, Setlist } from '../types/hymn';
import { ThemeColors } from '../constants/theme';
import { hymns, getHymnById, searchHymns } from '../services/hymnService';
import { HymnCard } from '../components/HymnCard';
import { LITURGICAL_PRESETS, LiturgicalPreset } from '../constants/liturgicalPresets';

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
  onCreateSetlistWithHymns: (name: string, description?: string, hymnIds?: number[]) => Promise<void>;
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
  onCreateSetlistWithHymns,
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

  // Liturgical Presets State
  const [presetsModalVisible, setPresetsModalVisible] = useState(false);

  // Import Modal State
  const [importModalVisible, setImportModalVisible] = useState(false);
  const [importInput, setImportInput] = useState('');

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

  const handleLoadPreset = async (preset: LiturgicalPreset) => {
    try {
      await onCreateSetlistWithHymns(
        preset.title,
        `${preset.yorubaTitle} • ${preset.tagline}`,
        preset.hymns.map((h) => h.id)
      );
      Alert.alert(
        'Preset Added',
        `"${preset.title}" (${preset.yorubaTitle}) has been added to your Service Sets!`
      );
      setPresetsModalVisible(false);
    } catch {
      Alert.alert('Error', 'Could not add preset service set.');
    }
  };

  const handleShareSetlist = async (setlist: Setlist) => {
    try {
      const setHymns = setlist.hymnIds
        .map((id) => getHymnById(id))
        .filter((h): h is Hymn => h !== undefined);

      let text = `🎵 C&S Hymn Book — Service Set: ${setlist.name}\n`;
      if (setlist.description) {
        text += `Description: ${setlist.description}\n`;
      }
      text += `\nSelected Hymns (${setHymns.length}):\n`;
      setHymns.forEach((h, idx) => {
        text += `${idx + 1}. ${h.hymn_number} - ${h.title}\n`;
      });

      text += `\n📥 Quick Import Code for C&S Hymn Book:\nCSSET:${setlist.name}:${setlist.hymnIds.join(',')}\n`;
      text += `\n— Shared from C&S Hymn Book\n`;
      if (Platform.OS === 'ios') {
        text += `Download on App Store: apps.apple.com/app/id6829350908`;
      } else {
        text += `Download on Google Play: https://play.google.com/store/apps/details?id=com.fajostech.cshymnbook`;
      }

      await Share.share(
        Platform.OS === 'ios'
          ? { message: text }
          : { message: text, title: `Service Set: ${setlist.name}` }
      );
    } catch {}
  };

  const parsedImport = React.useMemo(() => {
    const trimmed = importInput.trim();
    if (!trimmed) return null;

    // Pattern: CSSET:<name>:<ids>
    const match = trimmed.match(/CSSET:([^:\n]+):([0-9, ]+)/i);
    let name = 'Imported Service Set';
    let rawIdsStr = '';

    if (match) {
      name = match[1].trim();
      rawIdsStr = match[2];
    } else {
      rawIdsStr = trimmed;
    }

    const ids = rawIdsStr
      .split(/[, \n]+/)
      .map((s) => parseInt(s.trim(), 10))
      .filter((n) => !isNaN(n) && n > 0);

    const validHymns = ids
      .map((id) => getHymnById(id))
      .filter((h): h is Hymn => h !== undefined);

    const uniqueValidHymns = Array.from(new Map(validHymns.map((h) => [h.id, h])).values());

    return {
      name,
      hymns: uniqueValidHymns,
      hymnIds: uniqueValidHymns.map((h) => h.id),
    };
  }, [importInput]);

  const handlePasteClipboard = async () => {
    try {
      const text = await Clipboard.getStringAsync();
      if (text) {
        setImportInput(text);
      } else {
        Alert.alert('Clipboard Empty', 'No text found in clipboard.');
      }
    } catch {}
  };

  const handleExecuteImport = async () => {
    if (!parsedImport || parsedImport.hymnIds.length === 0) {
      Alert.alert('Invalid Import', 'No valid hymn numbers were found in the text.');
      return;
    }
    await onCreateSetlistWithHymns(
      parsedImport.name,
      `Imported with ${parsedImport.hymnIds.length} hymns`,
      parsedImport.hymnIds
    );
    setImportInput('');
    setImportModalVisible(false);
    Alert.alert(
      'Import Successful',
      `"${parsedImport.name}" with ${parsedImport.hymnIds.length} hymns has been added to your Service Sets!`
    );
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
            onPress={() => handleShareSetlist(currentSetlist)}
            style={[styles.shareHeaderBtn, { backgroundColor: theme.surfaceCard, borderColor: theme.border }]}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            accessibilityLabel="Share service set"
          >
            <Ionicons name="share-social-outline" size={18} color={theme.accentGold} />
          </TouchableOpacity>

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
            <View style={{ flex: 1 }}>
              <Text style={[styles.setlistActionTitle, { color: theme.text }]}>Worship Programs</Text>
              <Text style={[styles.setlistActionSubtitle, { color: theme.textMuted }]}>
                Organize hymns for Sunday services & vigils
              </Text>
            </View>
            <View style={styles.actionButtonsRow}>
              <TouchableOpacity
                onPress={() => setImportModalVisible(true)}
                style={[styles.importSetButton, { backgroundColor: theme.surfaceCard, borderColor: theme.border }]}
              >
                <Ionicons name="download-outline" size={16} color={theme.accentGold} />
                <Text style={[styles.importSetButtonText, { color: theme.accentGold }]}>Import</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setCreateModalVisible(true)}
                style={[styles.newSetButton, { backgroundColor: theme.primary }]}
              >
                <Ionicons name="add" size={18} color="#FFFFFF" />
                <Text style={styles.newSetButtonText}>New Set</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Liturgical Presets Quick Banner */}
          <TouchableOpacity
            style={[styles.presetsBanner, { backgroundColor: theme.surfaceCard, borderColor: theme.border }]}
            onPress={() => setPresetsModalVisible(true)}
            activeOpacity={0.8}
          >
            <View style={[styles.presetsBadge, { backgroundColor: theme.primaryLight }]}>
              <Ionicons name="sparkles" size={20} color={theme.accentGold} />
            </View>
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={[styles.presetsBannerTitle, { color: theme.text }]}>
                Church Liturgical Presets (Ètò Ìjọ́sìn)
              </Text>
              <Text style={[styles.presetsBannerSub, { color: theme.textSecondary }]}>
                Sunday Worship, Mercy Service, Friday Vigil &amp; Revival
              </Text>
            </View>
            <View style={[styles.explorePill, { backgroundColor: theme.accentGold + '20' }]}>
              <Text style={[styles.explorePillText, { color: theme.accentGold }]}>Explore</Text>
              <Ionicons name="chevron-forward" size={14} color={theme.accentGold} />
            </View>
          </TouchableOpacity>

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
                    handleShareSetlist(item);
                  }}
                  style={styles.shareSetBtn}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                  accessibilityLabel="Share setlist"
                >
                  <Ionicons name="share-social-outline" size={18} color={theme.accentGold} />
                </TouchableOpacity>

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

      {/* Modal: Liturgical Presets */}
      <Modal
        visible={presetsModalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setPresetsModalVisible(false)}
      >
        <View style={styles.presetsModalOverlay}>
          <View style={[styles.presetsModalContainer, { backgroundColor: theme.surface, borderColor: theme.border }]}>
            <View style={[styles.presetsModalHeader, { borderBottomColor: theme.border }]}>
              <View>
                <Text style={[styles.presetsModalTitle, { color: theme.text }]}>Church Liturgical Presets</Text>
                <Text style={[styles.presetsModalSub, { color: theme.textSecondary }]}>
                  Ètò Ìjọ́sìn Kérúbù &amp; Séráfù
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => setPresetsModalVisible(false)}
                style={[styles.closeIconBtn, { backgroundColor: theme.surfaceCard }]}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Ionicons name="close" size={22} color={theme.textSecondary} />
              </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.presetsScrollContent} showsVerticalScrollIndicator={false}>
              {LITURGICAL_PRESETS.map((preset) => (
                <View
                  key={preset.id}
                  style={[styles.presetCard, { backgroundColor: theme.surfaceCard, borderColor: theme.border }]}
                >
                  <View style={styles.presetTopRow}>
                    <View style={[styles.presetIconBadge, { backgroundColor: preset.accentColor + '20' }]}>
                      <Ionicons name={preset.icon} size={22} color={preset.accentColor} />
                    </View>
                    <View style={{ flex: 1, marginLeft: 10 }}>
                      <Text style={[styles.presetCardTitle, { color: theme.text }]}>{preset.title}</Text>
                      <Text style={[styles.presetCardYoruba, { color: preset.accentColor }]}>
                        {preset.yorubaTitle}
                      </Text>
                    </View>
                  </View>

                  <Text style={[styles.presetDesc, { color: theme.textSecondary }]}>
                    {preset.description}
                  </Text>

                  {/* Hymn tags list */}
                  <View style={styles.presetHymnsList}>
                    {preset.hymns.map((h, i) => (
                      <View
                        key={i}
                        style={[styles.presetHymnTag, { backgroundColor: theme.surface, borderColor: theme.border }]}
                      >
                        <Text style={[styles.presetHymnPart, { color: theme.text }]}>
                          {h.part}
                        </Text>
                      </View>
                    ))}
                  </View>

                  <TouchableOpacity
                    style={[styles.loadPresetBtn, { backgroundColor: theme.primary }]}
                    onPress={() => handleLoadPreset(preset)}
                  >
                    <Ionicons name="add-circle-outline" size={18} color="#FFFFFF" />
                    <Text style={styles.loadPresetBtnText}>Add to My Service Sets</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Modal: Import Service Set */}
      <Modal
        visible={importModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setImportModalVisible(false)}
      >
        <Pressable style={styles.modalOverlay} onPress={() => setImportModalVisible(false)}>
          <Pressable
            style={[styles.modalBox, { backgroundColor: theme.surface, borderColor: theme.border }]}
            onPress={(e) => e.stopPropagation()}
          >
            <View style={styles.modalHeader}>
              <View>
                <Text style={[styles.modalTitle, { color: theme.text }]}>Import Service Set</Text>
                <Text style={[styles.modalSubTitle, { color: theme.textSecondary }]}>
                  Paste setlist code or share message from choir
                </Text>
              </View>
              <TouchableOpacity onPress={() => setImportModalVisible(false)}>
                <Ionicons name="close" size={24} color={theme.textMuted} />
              </TouchableOpacity>
            </View>

            <View style={styles.pasteRow}>
              <Text style={[styles.modalLabel, { color: theme.textSecondary }]}>Setlist Code / Text</Text>
              <TouchableOpacity onPress={handlePasteClipboard} style={styles.pasteFromClipboardBtn}>
                <Ionicons name="clipboard-outline" size={14} color={theme.primary} />
                <Text style={[styles.pasteFromClipboardText, { color: theme.primary }]}>Paste from Clipboard</Text>
              </TouchableOpacity>
            </View>

            <TextInput
              placeholder="e.g. CSSET:Sunday Divine Service:46,1,66,442,127,821"
              placeholderTextColor={theme.textMuted}
              value={importInput}
              onChangeText={setImportInput}
              multiline
              numberOfLines={4}
              style={[
                styles.modalInput,
                styles.importTextInput,
                { color: theme.text, borderColor: theme.border, backgroundColor: theme.background },
              ]}
              autoFocus
            />

            {/* Live Parsing Preview */}
            {parsedImport && (
              <View style={[styles.importPreviewBox, { backgroundColor: theme.surfaceCard, borderColor: theme.border }]}>
                <Text style={[styles.importPreviewTitle, { color: theme.accentGold }]}>
                  Set Name: {parsedImport.name}
                </Text>
                <Text style={[styles.importPreviewCount, { color: theme.text }]}>
                  {parsedImport.hymns.length} Hymns Detected:
                </Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.previewHymnTags}>
                  {parsedImport.hymns.map((h) => (
                    <View
                      key={h.id}
                      style={[styles.previewTag, { backgroundColor: theme.primary + '15', borderColor: theme.primary + '30' }]}
                    >
                      <Text style={[styles.previewTagText, { color: theme.primary }]}>{h.hymn_number}</Text>
                    </View>
                  ))}
                </ScrollView>
              </View>
            )}

            <View style={styles.modalFooter}>
              <TouchableOpacity
                onPress={() => {
                  setImportInput('');
                  setImportModalVisible(false);
                }}
                style={[styles.modalCancelBtn, { borderColor: theme.border }]}
              >
                <Text style={[styles.modalCancelText, { color: theme.textSecondary }]}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                disabled={!parsedImport || parsedImport.hymnIds.length === 0}
                onPress={handleExecuteImport}
                style={[
                  styles.modalSubmitBtn,
                  {
                    backgroundColor:
                      parsedImport && parsedImport.hymnIds.length > 0 ? theme.primary : theme.border,
                  },
                ]}
              >
                <Text style={styles.modalSubmitText}>Import Now</Text>
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
  shareHeaderBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  shareSetBtn: {
    padding: 6,
  },
  actionButtonsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  importSetButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 18,
    borderWidth: 1,
    gap: 4,
  },
  importSetButtonText: {
    fontSize: 12.5,
    fontWeight: '700',
  },
  presetsBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginTop: 12,
    marginBottom: 6,
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
  },
  presetsBadge: {
    width: 38,
    height: 38,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  presetsBannerTitle: {
    fontSize: 14.5,
    fontWeight: '700',
  },
  presetsBannerSub: {
    fontSize: 12,
    marginTop: 2,
    lineHeight: 16,
  },
  explorePill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
    gap: 2,
  },
  explorePillText: {
    fontSize: 12,
    fontWeight: '700',
  },
  presetsModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'flex-end',
  },
  presetsModalContainer: {
    height: '85%',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderTopWidth: 1,
    overflow: 'hidden',
  },
  presetsModalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  presetsModalTitle: {
    fontSize: 18,
    fontWeight: '800',
  },
  presetsModalSub: {
    fontSize: 12.5,
    fontWeight: '600',
    marginTop: 2,
  },
  closeIconBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  presetsScrollContent: {
    padding: 16,
    paddingBottom: 40,
    gap: 16,
  },
  presetCard: {
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
  },
  presetTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  presetIconBadge: {
    width: 42,
    height: 42,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  presetCardTitle: {
    fontSize: 16,
    fontWeight: '800',
  },
  presetCardYoruba: {
    fontSize: 13,
    fontWeight: '600',
    marginTop: 1,
  },
  presetDesc: {
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 12,
  },
  presetHymnsList: {
    gap: 6,
    marginBottom: 14,
  },
  presetHymnTag: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
    borderWidth: 1,
  },
  presetHymnPart: {
    fontSize: 12.5,
    fontWeight: '600',
  },
  loadPresetBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 12,
    gap: 6,
  },
  loadPresetBtnText: {
    color: '#FFFFFF',
    fontSize: 13.5,
    fontWeight: '700',
  },
  modalSubTitle: {
    fontSize: 12,
    marginTop: 2,
  },
  pasteRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  pasteFromClipboardBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 2,
  },
  pasteFromClipboardText: {
    fontSize: 12,
    fontWeight: '700',
  },
  importTextInput: {
    height: 80,
    textAlignVertical: 'top',
    paddingTop: 10,
  },
  importPreviewBox: {
    marginTop: 12,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
  importPreviewTitle: {
    fontSize: 13.5,
    fontWeight: '700',
    marginBottom: 4,
  },
  importPreviewCount: {
    fontSize: 12.5,
    fontWeight: '600',
    marginBottom: 8,
  },
  previewHymnTags: {
    flexDirection: 'row',
  },
  previewTag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    marginRight: 6,
  },
  previewTagText: {
    fontSize: 11.5,
    fontWeight: '700',
  },
});
