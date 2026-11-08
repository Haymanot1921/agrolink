// mobile/src/shared/hooks/useImagePicker.ts
// Gallery + camera image picking with permission handling.
// SRS refs: FR-MARKET-003, §13.3.

import { useCallback, useState } from 'react';
import * as ImagePickerLib from 'expo-image-picker';
import { Alert, Linking } from 'react-native';

export interface PickedImage {
  uri: string;
  width: number;
  height: number;
  mimeType?: string;
  fileName?: string;
  fileSize?: number;
}

export interface UseImagePickerResult {
  isPicking: boolean;
  error: string | null;
  pickFromGallery: (opts?: {
    allowsMultipleSelection?: boolean;
    selectionLimit?: number;
    aspect?: [number, number];
  }) => Promise<PickedImage[]>;
  pickFromCamera: (opts?: { aspect?: [number, number] }) => Promise<PickedImage | null>;
  clearError: () => void;
}

export function useImagePicker(): UseImagePickerResult {
  const [isPicking, setIsPicking] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mapAsset = (a: ImagePickerLib.ImagePickerAsset): PickedImage => ({
    uri: a.uri,
    width: a.width,
    height: a.height,
    mimeType: a.mimeType,
    fileName: a.fileName ?? undefined,
    fileSize: a.fileSize,
  });

  const pickFromGallery = useCallback(
    async (
      opts: {
        allowsMultipleSelection?: boolean;
        selectionLimit?: number;
        aspect?: [number, number];
      } = {},
    ) => {
      setIsPicking(true);
      setError(null);
      try {
        const perm = await ImagePickerLib.requestMediaLibraryPermissionsAsync();
        if (!perm.granted) {
          if (!perm.canAskAgain) {
            Alert.alert('Permission required', 'Please allow photo access in Settings.', [
              { text: 'Cancel', style: 'cancel' },
              { text: 'Open Settings', onPress: () => Linking.openSettings() },
            ]);
          }
          return [];
        }
        const result = await ImagePickerLib.launchImageLibraryAsync({
          mediaTypes: ImagePickerLib.MediaTypeOptions.Images,
          quality: 0.85,
          allowsMultipleSelection: opts.allowsMultipleSelection ?? false,
          selectionLimit: opts.selectionLimit ?? 1,
          allowsEditing: !opts.allowsMultipleSelection,
          aspect: opts.aspect,
        });
        if (result.canceled) return [];
        return result.assets.map(mapAsset);
      } catch (e) {
        setError((e as Error).message);
        return [];
      } finally {
        setIsPicking(false);
      }
    },
    [],
  );

  const pickFromCamera = useCallback(async (opts: { aspect?: [number, number] } = {}) => {
    setIsPicking(true);
    setError(null);
    try {
      const perm = await ImagePickerLib.requestCameraPermissionsAsync();
      if (!perm.granted) {
        if (!perm.canAskAgain) {
          Alert.alert('Permission required', 'Please allow camera access in Settings.', [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Open Settings', onPress: () => Linking.openSettings() },
          ]);
        }
        return null;
      }
      const result = await ImagePickerLib.launchCameraAsync({
        mediaTypes: ImagePickerLib.MediaTypeOptions.Images,
        quality: 0.85,
        allowsEditing: true,
        aspect: opts.aspect,
      });
      if (result.canceled || !result.assets[0]) return null;
      return mapAsset(result.assets[0]);
    } catch (e) {
      setError((e as Error).message);
      return null;
    } finally {
      setIsPicking(false);
    }
  }, []);

  const clearError = useCallback(() => setError(null), []);

  return { isPicking, error, pickFromGallery, pickFromCamera, clearError };
}