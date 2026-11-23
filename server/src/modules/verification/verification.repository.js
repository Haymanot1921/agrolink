// Applicant-side identity verification repository backed by MySQL.
'use strict';

const database = require('../../config/database');

const APPLICATION_SELECT = `
  SELECT id, applicant_id AS applicantId, applicant_role_code AS applicantRole,
         status, notes, submitted_at AS submittedAt, reviewed_at AS reviewedAt,
         info_requested_at AS infoRequestedAt,
         additional_info_submitted_at AS additionalInfoSubmittedAt,
         rejection_reason AS rejectionReason, rejection_note AS rejectionNote,
         approved_by AS approvedBy, rejected_by AS rejectedBy,
         withdrawn_at AS withdrawnAt, withdrawn_by_applicant AS withdrawnByApplicant,
         reminder_count AS reminderCount, last_reminder_at AS lastReminderAt,
         created_at AS createdAt, updated_at AS updatedAt
  FROM verification_applications
`;

function mapApplication(row) {
  if (!row) return null;
  return {
    _id: String(row.id),
    id: String(row.id),
    applicantId: String(row.applicantId),
    applicantRole: row.applicantRole,
    status: row.status,
    notes: row.notes,
    submittedAt: row.submittedAt,
    reviewedAt: row.reviewedAt,
    infoRequestedAt: row.infoRequestedAt,
    additionalInfoSubmittedAt: row.additionalInfoSubmittedAt,
    rejectionReason: row.rejectionReason,
    rejectionNote: row.rejectionNote,
    approvedBy: row.approvedBy === null ? null : String(row.approvedBy),
    rejectedBy: row.rejectedBy === null ? null : String(row.rejectedBy),
    withdrawnAt: row.withdrawnAt,
    withdrawnByApplicant: Boolean(row.withdrawnByApplicant),
    reminderCount: Number(row.reminderCount || 0),
    lastReminderAt: row.lastReminderAt,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
    documents: row.documents || [],
    reviewHistory: row.reviewHistory || [],
  };
}

async function loadDetails(connection, applicationIds) {
  if (!applicationIds.length) return { documents: new Map(), history: new Map() };
  const placeholders = applicationIds.map(() => '?').join(', ');
  const [documents] = await connection.execute(
    `SELECT application_id AS applicationId, document_type AS documentType,
            public_id AS publicId, url, file_name AS fileName, mime_type AS mimeType,
            size_bytes AS size, is_additional AS isAdditional, uploaded_at AS uploadedAt
     FROM verification_documents WHERE application_id IN (${placeholders})
     ORDER BY uploaded_at, id`,
    applicationIds,
  );
  const [history] = await connection.execute(
    `SELECT application_id AS applicationId, event, actor_id AS actorId,
            actor_role AS actorRole, notes, created_at AS at
     FROM verification_review_history WHERE application_id IN (${placeholders})
     ORDER BY created_at, id`,
    applicationIds,
  );
  const byApplication = (rows, key) => {
    const groups = new Map();
    for (const row of rows) {
      const id = String(row.applicationId);
      if (!groups.has(id)) groups.set(id, []);
      groups.get(id).push(key(row));
    }
    return groups;
  };
  return {
    documents: byApplication(documents, (row) => ({
      documentType: row.documentType,
      publicId: row.publicId,
      url: row.url,
      fileName: row.fileName,
      mimeType: row.mimeType,
      size: row.size,
      isAdditional: Boolean(row.isAdditional),
      uploadedAt: row.uploadedAt,
    })),
    history: byApplication(history, (row) => ({
      event: row.event,
      actorId: row.actorId === null ? null : String(row.actorId),
      actorRole: row.actorRole,
      notes: row.notes,
      at: row.at,
    })),
  };
}

async function withDetails(rows) {
  const connection = await database.getConnection();
  try {
    const ids = rows.map((row) => row.id);
    const details = await loadDetails(connection, ids);
    return rows.map((row) => mapApplication({
      ...row,
      documents: details.documents.get(String(row.id)) || [],
      reviewHistory: details.history.get(String(row.id)) || [],
    }));
  } finally {
    connection.release();
  }
}

async function findLatestByUser(userId) {
  const [rows] = await database.query(
    `${APPLICATION_SELECT} WHERE applicant_id = ? ORDER BY created_at DESC LIMIT 1`,
    [userId],
  );
  const applications = await withDetails(rows);
  return applications[0] || null;
}

async function findByIdForUser(applicationId, userId) {
  const [rows] = await database.query(
    `${APPLICATION_SELECT} WHERE id = ? AND applicant_id = ? LIMIT 1`,
    [applicationId, userId],
  );
  const applications = await withDetails(rows);
  return applications[0] || null;
}

async function listByUser(userId, { page = 1, limit = 20 } = {}) {
  const offset = (page - 1) * limit;
  const [rows, countRows] = await Promise.all([
    database.query(
      `${APPLICATION_SELECT} WHERE applicant_id = ?
       ORDER BY created_at DESC LIMIT ? OFFSET ?`,
      [userId, limit, offset],
    ),
    database.query(
      'SELECT COUNT(*) AS total FROM verification_applications WHERE applicant_id = ?',
      [userId],
    ),
  ]);
  const data = await withDetails(rows[0]);
  const total = Number(countRows[0][0].total);
  return {
    data,
    pagination: { page, limit, total, totalPages: Math.max(1, Math.ceil(total / limit)) },
  };
}

async function hasOpenApplication(userId) {
  const [rows] = await database.query(
    `SELECT 1 FROM verification_applications
     WHERE applicant_id = ? AND status IN ('pending', 'under_review', 'additional_info_requested')
     LIMIT 1`,
    [userId],
  );
  return rows.length > 0;
}

async function insertDocuments(connection, applicationId, documents) {
  for (const document of documents) {
    await connection.execute(
      `INSERT INTO verification_documents
       (application_id, document_type, public_id, url, file_name, mime_type,
        size_bytes, is_additional, uploaded_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        applicationId,
        document.documentType,
        document.publicId,
        document.url || null,
        document.fileName || null,
        document.mimeType || null,
        document.size || null,
        document.isAdditional ? 1 : 0,
        document.uploadedAt || new Date(),
      ],
    );
  }
}

async function insertHistory(connection, applicationId, events) {
  for (const event of events) {
    await connection.execute(
      `INSERT INTO verification_review_history
       (application_id, event, actor_id, actor_role, notes, created_at)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        applicationId,
        event.event,
        event.actorId || null,
        event.actorRole || null,
        event.notes || null,
        event.at || new Date(),
      ],
    );
  }
}

async function createApplication(data) {
  const id = await database.transaction(async (connection) => {
    const [result] = await connection.execute(
      `INSERT INTO verification_applications
       (applicant_id, applicant_role_code, status, notes, submitted_at)
       VALUES (?, ?, ?, ?, ?)`,
      [
        data.applicantId,
        data.applicantRole,
        data.status,
        data.notes || null,
        data.submittedAt || new Date(),
      ],
    );
    await insertDocuments(connection, result.insertId, data.documents || []);
    await insertHistory(connection, result.insertId, data.reviewHistory || []);
    return result.insertId;
  });
  return findByIdForUser(id, data.applicantId);
}

async function updateApplication(applicationId, patch) {
  await database.transaction(async (connection) => {
    const fields = {
      status: 'status',
      notes: 'notes',
      reviewedAt: 'reviewed_at',
      infoRequestedAt: 'info_requested_at',
      additionalInfoSubmittedAt: 'additional_info_submitted_at',
      rejectionReason: 'rejection_reason',
      rejectionNote: 'rejection_note',
      approvedBy: 'approved_by',
      rejectedBy: 'rejected_by',
      withdrawnAt: 'withdrawn_at',
      withdrawnByApplicant: 'withdrawn_by_applicant',
    };
    const assignments = [];
    const values = [];
    for (const [key, column] of Object.entries(fields)) {
      if (patch[key] !== undefined) {
        assignments.push(`${column} = ?`);
        values.push(patch[key]);
      }
    }
    if (assignments.length) {
      await connection.execute(
        `UPDATE verification_applications SET ${assignments.join(', ')} WHERE id = ?`,
        [...values, applicationId],
      );
    }
    if (patch.documents) {
      await connection.execute('DELETE FROM verification_documents WHERE application_id = ?', [applicationId]);
      await insertDocuments(connection, applicationId, patch.documents);
    }
    if (patch.$push && patch.$push.reviewHistory) {
      await insertHistory(connection, applicationId, [patch.$push.reviewHistory]);
    }
  });
  const [rows] = await database.query(
    `${APPLICATION_SELECT} WHERE id = ? LIMIT 1`,
    [applicationId],
  );
  const applications = await withDetails(rows);
  return applications[0] || null;
}

async function withdrawApplication(applicationId, userId) {
  const [result] = await database.query(
    `UPDATE verification_applications
     SET status = 'rejected', withdrawn_at = NOW(), withdrawn_by_applicant = 1
     WHERE id = ? AND applicant_id = ?
       AND status IN ('pending', 'additional_info_requested')`,
    [applicationId, userId],
  );
  return result.affectedRows ? findByIdForUser(applicationId, userId) : null;
}

module.exports = {
  findLatestByUser,
  findByIdForUser,
  listByUser,
  hasOpenApplication,
  createApplication,
  updateApplication,
  withdrawApplication,
};
