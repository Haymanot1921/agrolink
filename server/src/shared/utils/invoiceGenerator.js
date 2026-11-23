// server/src/shared/utils/invoiceGenerator.js
// Deterministic invoice payload + optional PDF buffer generator.
// Used by buyer-payments, order-oversight, and admin reports.
// Record-only first release: invoice is a receipt-of-record, not a tax doc.

'use strict';

const { formatDate } = require('./dateTime');
const { formatETB } = require('./currency');

/**
 * Build a JSON invoice payload from an order + buyer + farmer + payment record.
 * Deterministic — same input yields same output. All amounts are integers
 * in minor units (santim) until the presentation layer.
 */
function buildInvoicePayload({ order, buyer, farmer, payment }) {
  if (!order || !order._id) {
    const err = new Error('Order required for invoice');
    err.statusCode = 400;
    err.code = 'INVOICE_ORDER_REQUIRED';
    throw err;
  }

  const invoiceNumber = buildInvoiceNumber(order);
  const issuedAt = payment?.createdAt || order.createdAt || new Date();
  const items = (order.items || []).map((item) => ({
    sku: item.listingId ? String(item.listingId) : null,
    description: item.productName || item.name || 'Produce',
    quantity: item.quantity || 0,
    unitLabel: item.unit || 'kg',
    unitPriceMinor: Math.round(item.unitPriceMinor || 0),
    lineTotalMinor: Math.round(item.lineTotalMinor || (item.unitPriceMinor || 0) * (item.quantity || 0)),
  }));

  const subtotalMinor = items.reduce((a, i) => a + i.lineTotalMinor, 0);
  const taxMinor = Math.round(order.taxMinor || 0);
  const totalMinor = Math.round(order.totalMinor || subtotalMinor + taxMinor);

  return {
    invoiceNumber,
    currency: order.currency || 'ETB',
    issuedAt: new Date(issuedAt).toISOString(),
    issuedAtLocal: formatDate(issuedAt),
    status: order.status || 'pending',
    paymentMode: payment?.mode || 'record_only',
    paymentRef: payment?.transactionRef || null,
    seller: {
      id: farmer?._id ? String(farmer._id) : null,
      name: farmer?.fullName || farmer?.businessName || null,
      phone: farmer?.phone || null,
      region: farmer?.region || null,
    },
    buyer: {
      id: buyer?._id ? String(buyer._id) : null,
      name: buyer?.fullName || buyer?.businessName || null,
      phone: buyer?.phone || null,
      region: buyer?.region || null,
    },
    items,
    subtotalMinor,
    taxMinor,
    totalMinor,
    display: {
      subtotal: formatETB(subtotalMinor),
      tax: formatETB(taxMinor),
      total: formatETB(totalMinor),
    },
  };
}

function buildInvoiceNumber(order) {
  const d = new Date(order.createdAt || Date.now());
  const y = d.getUTCFullYear();
  const m = String(d.getUTCMonth() + 1).padStart(2, '0');
  const idPart = String(order._id).slice(-8).toUpperCase();
  return `INV-${y}${m}-${idPart}`;
}

/**
 * Optional PDF renderer. Returns a Buffer suitable for streaming/download.
 * Uses PDFKit lazily so the dependency is only loaded when invoked.
 * If PDFKit is unavailable (minimal deployment), throws a clear 501 so the
 * caller can fall back to JSON download.
 */
async function renderInvoicePdf(payload) {
  let PDFDocument;
  try {
    // eslint-disable-next-line global-require
    PDFDocument = require('pdfkit');
  } catch {
    const err = new Error('PDF rendering is not available in this deployment');
    err.statusCode = 501;
    err.code = 'PDF_NOT_AVAILABLE';
    throw err;
  }

  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ size: 'A4', margin: 48 });
      const chunks = [];
      doc.on('data', (c) => chunks.push(c));
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      doc.on('error', reject);

      doc.fontSize(18).text('AgroLink Ethiopia', { align: 'center' });
      doc.fontSize(10).fillColor('#555').text('Agricultural Marketplace — Invoice', { align: 'center' });
      doc.moveDown(1.5);

      doc.fillColor('#000').fontSize(12);
      doc.text(`Invoice: ${payload.invoiceNumber}`);
      doc.text(`Issued: ${payload.issuedAtLocal}`);
      doc.text(`Status: ${payload.status}`);
      doc.moveDown();

      doc.fontSize(11).text(`Buyer: ${payload.buyer.name || '—'}`);
      doc.text(`Seller: ${payload.seller.name || '—'}`);
      doc.moveDown();

      doc.fontSize(12).text('Items', { underline: true });
      payload.items.forEach((i) => {
        doc
          .fontSize(10)
          .text(`${i.description}  ${i.quantity} ${i.unitLabel}  —  ${formatETB(i.lineTotalMinor)}`);
      });
      doc.moveDown();

      doc.fontSize(11);
      doc.text(`Subtotal: ${payload.display.subtotal}`);
      doc.text(`Tax: ${payload.display.tax}`);
      doc.text(`Total: ${payload.display.total}`);

      doc.end();
    } catch (err) {
      reject(err);
    }
  });
}

module.exports = { buildInvoicePayload, renderInvoicePdf, buildInvoiceNumber };