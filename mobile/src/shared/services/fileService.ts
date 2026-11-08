// mobile/src/shared/services/fileService.ts
// File system helpers — pick, read, share, delete (temp cache).
// SRS refs: §13.3, FR-ADMIN-003 (verification docs).

import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';

export interface PickedFile {
  uri: string;
  name: string;
  mimeType?: string;
  sizeBytes?: number;
}

export const fileService = {
  async pick(opts: { types?: string[]; maxSizeMb?: number } = {}): Promise<PickedFile | null> {
    const result = await DocumentPicker.getDocumentAsync({
      type: opts.types ?? '*/*',
      copyToCacheDirectory: true,
      multiple: false,
    });
    if (result.canceled || !result.assets[0]) return null;
    const a = result.assets[0];
    if (opts.maxSizeMb && a.size && a.size > opts.maxSizeMb * 1024 * 1024) {
      throw new Error(`File must be less than ${opts.maxSizeMb}MB`);
    }
    return {
      uri: a.uri,
      name: a.name,
      mimeType: a.mimeType,
      sizeBytes: a.size,
    };
  },

  async readText(uri: string): Promise<string> {
    return FileSystem.readAsStringAsync(uri);
  },

  async writeText(fileName: string, content: string): Promise<string> {
    const uri = `${FileSystem.documentDirectory}${fileName}`;
    await FileSystem.writeAsStringAsync(uri, content);
    return uri;
  },

  async share(uri: string, mimeType?: string): Promise<void> {
    if (!(await Sharing.isAvailableAsync())) return;
    await Sharing.shareAsync(uri, { mimeType });
  },

  async delete(uri: string): Promise<void> {
    try {
      await FileSystem.deleteAsync(uri, { idempotent: true });
    } catch {
      // ignore
    }
  },

  /** Compute file size in bytes. */
  async size(uri: string): Promise<number> {
    try {
      const info = await FileSystem.getInfoAsync(uri, { size: true });
      return 'size' in info ? info.size ?? 0 : 0;
    } catch {
      return 0;
    }
  },
};