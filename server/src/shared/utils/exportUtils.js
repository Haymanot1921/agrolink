// server/src/shared/utils/exportUtils.js
// Report export helpers for FR-ADMIN-013 / FR-ASSISTED-013. Produces CSV
// buffers and (optionally) XLSX/PDF. All output is streamable. PII-safe
// by default (allow caller to whitelist columns).

'use strict';

const fs = require('fs');
const path = require('path');
const env = require('../../config/environment');
const logger = require('../../config/logger');

// --- CSV -------------------------------------------------------------------

function escapeCsvCell(value) {
  if (value === null || value === undefined) return '';
  const str = String(value);
  // Neutralize CSV injection (=, +, -, @, tab, CR) at cell start.
  const dangerous = /^[=+\-@\t\r]/;
  const safe = dangerous.test(str) ? `'${str}` : str;
  if (/[",\n\r]/.test(safe)) return `"${safe.replace(/"/g, '""')}"`;
  return safe;
}

/**
 * @param {Array<Object>} rows
 * @param {Array<{ key: string, label?: string }>} columns
 * @returns {Buffer}
 */
function toCsv(rows, columns) {
  if (!Array.isArray(columns) || columns.length === 0) {
    throw new Error('exportUtils.toCsv: columns required');
  }
  const header = columns.map((c) => escapeCsvCell(c.label || c.key)).join(',');
  const lines = rows.map((row) =>
    columns.map((c) => escapeCsvCell(row[c.key])).join(','),
  );
  return Buffer.from(`${header}\n${lines.join('\n')}`, 'utf8');
}

// --- XLSX (optional) -------------------------------------------------------

async function toXlsx(rows, columns, { sheetName = 'Report' } = {}) {
  let ExcelJS;
  try {
    // eslint-disable-next-line global-require
    ExcelJS = require('exceljs');
  } catch {
    const err = new Error('XLSX export not available in this deployment');
    err.statusCode = 501;
    err.code = 'XLSX_NOT_AVAILABLE';
    throw err;
  }

  const wb = new ExcelJS.Workbook();
  const ws = wb.addWorksheet(sheetName);
  ws.columns = columns.map((c) => ({ header: c.label || c.key, key: c.key, width: c.width || 20 }));

  rows.forEach((row) => {
    const safeRow = {};
    columns.forEach((c) => {
      safeRow[c.key] = row[c.key];
    });
    ws.addRow(safeRow);
  });

  ws.getRow(1).font = { bold: true };
  return Buffer.from(await wb.xlsx.writeBuffer());
}

// --- PDF (optional) --------------------------------------------------------

async function toPdf(rows, columns, { title = 'AgroLink Report', subtitle } = {}) {
  let PDFDocument;
  try {
    // eslint-disable-next-line global-require
    PDFDocument = require('pdfkit');
  } catch {
    const err = new Error('PDF export not available in this deployment');
    err.statusCode = 501;
    err.code = 'PDF_NOT_AVAILABLE';
    throw err;
  }

  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ size: 'A4', margin: 36, layout: 'landscape' });
      const chunks = [];
      doc.on('data', (c) => chunks.push(c));
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      doc.on('error', reject);

      doc.fontSize(16).text(title, { align: 'center' });
      if (subtitle) doc.fontSize(10).fillColor('#555').text(subtitle, { align: 'center' });
      doc.moveDown();

      const colWidth = Math.floor((doc.page.width - 72) / columns.length);
      const startX = 36;
      let y = doc.y;

      doc.fontSize(10).fillColor('#000');
      columns.forEach((c, i) => {
        doc.text(String(c.label || c.key), startX + i * colWidth, y, {
          width: colWidth,
          continued: false,
        });
      });
      y += 16;
      doc.moveTo(startX, y).lineTo(doc.page.width - 36, y).stroke();
      y += 6;

      rows.forEach((row) => {
        if (y > doc.page.height - 60) {
          doc.addPage();
          y = 36;
        }
        columns.forEach((c, i) => {
          const val = row[c.key] === null || row[c.key] === undefined ? '' : String(row[c.key]);
          doc.text(val.slice(0, 60), startX + i * colWidth, y, { width: colWidth });
        });
        y += 14;
      });

      doc.end();
    } catch (err) {
      reject(err);
    }
  });
}

// --- File persistence ------------------------------------------------------

async function saveExport(buffer, filename) {
  const dir = env.reports.exportDir;
  await fs.promises.mkdir(dir, { recursive: true });
  const safeName = filename.replace(/[^\w.\-]+/g, '_');
  const fullPath = path.join(dir, safeName);
  await fs.promises.writeFile(fullPath, buffer);
  logger.info('[export] file saved', { path: fullPath, bytes: buffer.length });
  return fullPath;
}

/**
 * One-shot export dispatcher. Returns { buffer, mimeType, filename }.
 * Does NOT send — the caller streams it (res.setHeader + res.send).
 */
async function buildExport({ format = 'csv', rows, columns, title, subtitle, filenameBase = 'report' }) {
  if (!Array.isArray(rows)) throw new Error('buildExport: rows must be an array');
  if (!Array.isArray(columns) || columns.length === 0) {
    throw new Error('buildExport: columns required');
  }

  const stamp = new Date().toISOString().replace(/[:.]/g, '-');
  const base = `${filenameBase}-${stamp}`;

  if (format === 'csv') {
    return {
      buffer: toCsv(rows, columns),
      mimeType: 'text/csv; charset=utf-8',
      filename: `${base}.csv`,
    };
  }
  if (format === 'xlsx') {
    return {
      buffer: await toXlsx(rows, columns, { sheetName: filenameBase }),
      mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      filename: `${base}.xlsx`,
    };
  }
  if (format === 'pdf') {
    return {
      buffer: await toPdf(rows, columns, { title, subtitle }),
      mimeType: 'application/pdf',
      filename: `${base}.pdf`,
    };
  }

  const err = new Error(`Unsupported export format: ${format}`);
  err.statusCode = 400;
  err.code = 'UNSUPPORTED_EXPORT_FORMAT';
  throw err;
}

module.exports = {
  toCsv,
  toXlsx,
  toPdf,
  saveExport,
  buildExport,
  escapeCsvCell,
};