// mobile/src/shared/services/uploadService.ts
// Image / file uploads with progress + metadata persistence.
// SRS refs: §13.3 (metadata + storage refs only, no large blobs in DB).

import * as FileSystem from 'expo-file-system';
import * as mime from 'react-native-mime-types';
import { apiClient } from './apiClient';

export interface UploadResult {
  url: string;
  storageKey: string;
  mimeType: string;
  sizeBytes: number;
  width?: number;
  height?: number;
}

export interface UploadOptions {
  /** e.g. 'product-images', 'verification', 'consultation-attachments'. */
  folder: 'product-images' | 'input-images' | 'verification' | 'consultation-attachments' | 'case-attachments' | 'article-cover' | 'dispute-evidence';
  onProgress?: (pct: number) => void;
  /** Additional form fields. */
  extra?: Record<string, string>;
}

async function getFileInfo(uri: string): Promise<{ size: number; mimeType: string; name: string }> {
  const info = await FileSystem.getInfoAsync(uri, { size: true });
  const size = 'size' in info ? info.size ?? 0 : 0;
  const name = uri.split('/').pop() ?? `upload-${Date.now()}`;
  const mimeType = mime.lookup(name) || 'application/octet-stream';
  return { size, mimeType, name };
}

export const uploadService = {
  async uploadImage(
    localUri: string,
    options: UploadOptions,
  ): Promise<UploadResult> {
    const { mimeType, name, size } = await getFileInfo(localUri);

    const form = new FormData();
    form.append('folder', options.folder);
    form.append('file', {
      // React Native expects this shape
      uri: localUri,
      type: mimeType,
      name,
    } as unknown as Blob);
    if (options.extra) {
      Object.entries(options.extra).forEach(([k, v]) => form.append(k, v));
    }

    // Get token + send as raw axios (not our JSON client)
    const { secureStore } = await import('./secureStore');
    const tokens = await secureStore.getTokens();

    const url = `${(apiClient.defaults.baseURL ?? '')}/uploads`;
    const uploadTask = FileSystem.createUploadTask(
      url,
      localUri,
      {
        httpMethod: 'POST',
        uploadType: FileSystem.FileSystemUploadType.MULTIPART,
        fieldName: 'file',
        mimeType,
        headers: {
          Accept: 'application/json',
          ...(tokens?.accessToken ? { Authorization: `Bearer ${tokens.accessToken}` } : {}),
        },
        parameters: {
          folder: options.folder,
          ...(options.extra ?? {}),
        },
      },
      (p) => {
        if (p.totalBytesExpectedToSend > 0) {
          options.onProgress?.(p.totalBytesSent / p.totalBytesExpectedToSend);
        }
      },
    );

    const result = await uploadTask.uploadAsync();
    if (!result || result.status < 200 || result.status >= 300) {
      throw new Error(`Upload failed (status ${result?.status ?? 'unknown'})`);
    }

    const body = JSON.parse(result.body) as {
      url: string;
      storageKey: string;
      width?: number;
      height?: number;
    };

    return {
      url: body.url,
      storageKey: body.storageKey,
      mimeType,
      sizeBytes: size,
      width: body.width,
      height: body.height,
    };
  },

  async uploadDocument(
    localUri: string,
    folder: UploadOptions['folder'],
  ): Promise<UploadResult> {
    return this.uploadImage(localUri, { folder });
  },

  /** Batch upload with aggregated progress. */
  async uploadMany(
    uris: string[],
    options: UploadOptions,
  ): Promise<UploadResult[]> {
    const total = uris.length;
    const results: UploadResult[] = [];
    for (let i = 0; i < total; i++) {
      const uri = uris[i]!;
      const result = await this.uploadImage(uri, {
        ...options,
        onProgress: (pct) => {
          options.onProgress?.((i + pct) / total);
        },
      });
      results.push(result);
    }
    return results;
  },
};