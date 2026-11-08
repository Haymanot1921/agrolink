// mobile/src/shared/utils/exportUtils.ts
// Export helpers — CSV, JSON, and share-to-app.
// SRS refs: FR-ADMIN-013 (reports), §11.6 admin, NFR-USE.

import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';

export type ExportFormat = 'csv' | 'json';

export interface ExportOptions {
  filename: string;
  format?: ExportFormat;
  /** For CSV — explicit column order. */
  columns?: string[];
}

function escapeCsvCell(value: unknown): string {
  if (value === null || value === undefined) return '';
  const s = typeof value === 'object' ? JSON.stringify(value) : String(value);
  return /[",\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

function toCsv(rows: Record<string, unknown>[], columns?: string[]): string {
  if (!rows.length) return '';
  const headers = columns ?? Object.keys(rows[0]!);
  const lines = [headers.map(escapeCsvCell).join(',')];
  for (const row of rows) {
    lines.push(headers.map((h) => escapeCsvCell(row[h])).join(','));
  }
  return lines.join('\r\n');
}

function toJson(rows: unknown[] | unknown): string {
  return JSON.stringify(rows, null, 2);
}

export const exportUtils = {
  toCsv,
  toJson,

  /** Write data to a cache file — returns the file URI. */
  async toFile(
    data: Record<string, unknown>[] | unknown[] | unknown,
    { filename, format = 'csv', columns }: ExportOptions,
  ): Promise<string> {
    const content =
      format === 'csv'
        ? toCsv(data as Record<string, unknown>[], columns)
        : toJson(data);
    const ext = format === 'csv' ? 'csv' : 'json';
    const uri = `${FileSystem.cacheDirectory}${filename}.${ext}`;
    await FileSystem.writeAsStringAsync(uri, content, {
      encoding: FileSystem.EncodingType.UTF8,
    });
    return uri;
  },

  /** Open the OS share sheet with the exported file. */
  async share(
    data: Record<string, unknown>[] | unknown[] | unknown,
    options: ExportOptions,
  ): Promise<void> {
    const uri = await this.toFile(data, options);
    if (!(await Sharing.isAvailableAsync())) return;
    await Sharing.shareAsync(uri, {
      mimeType: options.format === 'json' ? 'application/json' : 'text/csv',
      dialogTitle: options.filename,
    });
  },

  /** Quick CSV share shortcut (used in list screens). */
  async shareCsv(rows: Record<string, unknown>[], filename: string, columns?: string[]): Promise<void> {
    await this.share(rows, { filename, format: 'csv', columns });
  },
};