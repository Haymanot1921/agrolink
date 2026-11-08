// mobile/src/shared/services/csvExportService.ts
// Export reports (orders, inventory, sales) as CSV.
// SRS refs: FR-ADMIN-013 (reports), §11.6 admin.

import { FileSystem, shareAsync } from 'expo-file-system';

export type CsvRow = Record<string, string | number | boolean | null | undefined>;

function escapeCell(value: string | number | boolean | null | undefined): string {
  if (value === null || value === undefined) return '';
  const s = String(value);
  if (/[",\n\r]/.test(s)) {
    return `"${s.replace(/"/g, '""')}"`;
  }
  return s;
}

export const csvExportService = {
  toCsv(rows: CsvRow[], columns?: string[]): string {
    if (!rows.length) return '';
    const headers = columns ?? Object.keys(rows[0]!);
    const lines = [headers.map(escapeCell).join(',')];
    for (const row of rows) {
      lines.push(headers.map((h) => escapeCell(row[h])).join(','));
    }
    return lines.join('\r\n');
  },

  async exportCsv(
    filename: string,
    rows: CsvRow[],
    columns?: string[],
  ): Promise<string> {
    const csv = this.toCsv(rows, columns);
    const uri = `${FileSystem.cacheDirectory}${filename}.csv`;
    await FileSystem.writeAsStringAsync(uri, csv, {
      encoding: FileSystem.EncodingType.UTF8,
    });
    return uri;
  },

  async shareCsv(
    filename: string,
    rows: CsvRow[],
    columns?: string[],
  ): Promise<void> {
    const uri = await this.exportCsv(filename, rows, columns);
    await shareAsync(uri, { mimeType: 'text/csv', dialogTitle: filename });
  },
};