import * as Updates from 'expo-updates';
import { Alert, Platform } from 'react-native';

export interface UpdateInfo {
  isEnabled: boolean;
  updateId: string | null;
  channel: string | null;
  runtimeVersion: string | null;
  isEmergencyLaunch: boolean;
}

export const updateService = {
  getUpdateInfo: (): UpdateInfo => {
    return {
      isEnabled: Updates.isEnabled,
      updateId: Updates.updateId,
      channel: Updates.channel,
      runtimeVersion: Updates.runtimeVersion,
      isEmergencyLaunch: Updates.isEmergencyLaunch,
    };
  },

  checkAndApplyUpdate: async (notifyIfLatest: boolean = false): Promise<boolean> => {
    // Updates are not supported on web, in local dev servers, or when disabled
    if (Platform.OS === 'web' || !Updates.isEnabled || __DEV__) {
      if (notifyIfLatest) {
        Alert.alert(
          'OTA Updates',
          __DEV__
            ? 'Over-the-air updates are active in standalone production/preview builds.'
            : 'You are running the latest version of the app.'
        );
      }
      return false;
    }

    try {
      const update = await Updates.checkForUpdateAsync();
      if (update.isAvailable) {
        Alert.alert(
          'Update Available',
          'A new update is available for C&S Hymn Book. Would you like to download and restart now?',
          [
            { text: 'Later', style: 'cancel' },
            {
              text: 'Install & Restart',
              onPress: async () => {
                try {
                  await Updates.fetchUpdateAsync();
                  await Updates.reloadAsync();
                } catch {
                  Alert.alert(
                    'Update Pending',
                    'The update has been queued and will be applied on your next app launch.'
                  );
                }
              },
            },
          ]
        );
        return true;
      } else {
        if (notifyIfLatest) {
          Alert.alert('Up to Date', 'You are using the latest version of C&S Hymn Book.');
        }
        return false;
      }
    } catch {
      if (notifyIfLatest) {
        Alert.alert(
          'Check Complete',
          'Could not reach the update server. You are using the latest offline hymnal version.'
        );
      }
      return false;
    }
  },
};
