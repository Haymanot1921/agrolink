// mobile/src/shared/services/imagePickerService.ts
// Gallery + camera picker primitives used by useImagePicker.
// SRS refs: FR-MARKET-003, §13.3.

import * as ImagePickerLib from 'expo-image-picker';

export interface PickedImage {
  uri: string;
  width: number;
  height: number;
  mimeType?: string;
  fileName?: string;
  fileSize?: number;
}

const mapAsset = (a: ImagePickerLib.ImagePickerAsset): PickedImage => ({
  uri: a.uri,
  width: a.width,
  height: a.height,
  mimeType: a.mimeType,
  fileName: a.fileName ?? undefined,
  fileSize: a.fileSize,
});

export const imagePickerService = {
  async requestGalleryPermission(): Promise<boolean> {
    const perm = await ImagePickerLib.requestMediaLibraryPermissionsAsync();
    return perm.granted;
  },

  async requestCameraPermission(): Promise<boolean> {
    const perm = await ImagePickerLib.requestCameraPermissionsAsync();
    return perm.granted;
  },

  async pickFromGallery(opts: {
    allowsMultipleSelection?: boolean;
    selectionLimit?: number;
    aspect?: [number, number];
  } = {}): Promise<PickedImage[]> {
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
  },

  async pickFromCamera(opts: { aspect?: [number, number] } = {}): Promise<PickedImage | null> {
    const result = await ImagePickerLib.launchCameraAsync({
      mediaTypes: ImagePickerLib.MediaTypeOptions.Images,
      quality: 0.85,
      allowsEditing: true,
      aspect: opts.aspect,
    });
    if (result.canceled || !result.assets[0]) return null;
    return mapAsset(result.assets[0]);
  },
};