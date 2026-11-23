// Canonical MySQL repository for user records.
'use strict';

const database = require('../../config/database');

const USER_SELECT = `
  SELECT u.id, u.email, u.phone, u.full_name AS fullName, u.password_hash AS passwordHash,
         u.password_changed_at AS passwordChangedAt, u.status, u.language,
         u.is_email_verified AS isEmailVerified, u.is_phone_verified AS isPhoneVerified,
         u.email_verified_at AS emailVerifiedAt, u.phone_verified_at AS phoneVerifiedAt,
         u.verification_status AS verificationStatus,
         u.verification_application_id AS verificationApplicationId,
         u.avatar_url AS avatarUrl, u.business_name AS businessName, u.bio,
         COALESCE(sp.provider_type_code, ep.provider_type_code, u.provider_type_code) AS providerType,
         COALESCE(ep.years_of_experience, u.years_of_experience) AS yearsOfExperience,
         u.token_version AS tokenVersion, u.last_login_at AS lastLoginAt,
         u.last_login_ip AS lastLoginIp, u.last_login_user_agent AS lastLoginUserAgent,
         u.notification_preferences AS notificationPreferences,
         u.created_at AS createdAt, u.updated_at AS updatedAt, u.deleted_at AS deletedAt,
         primary_role.code AS role,
         COALESCE(
           (SELECT GROUP_CONCAT(DISTINCT r.code ORDER BY r.code SEPARATOR ',')
            FROM user_roles ur JOIN roles r ON r.id = ur.role_id
            WHERE ur.user_id = u.id),
           primary_role.code
         ) AS rolesCsv,
         (SELECT GROUP_CONCAT(DISTINCT p.code ORDER BY p.code SEPARATOR ',')
          FROM user_roles ur
          JOIN role_permissions rp ON rp.role_id = ur.role_id
          JOIN permissions p ON p.id = rp.permission_id
          WHERE ur.user_id = u.id) AS permissionsCsv,
         fp.primary_crops_json AS primaryCrops,
         fp.farming_experience_years AS farmingExperienceYears,
         ua.region, ua.zone, ua.woreda, ua.kebele, ua.city, ua.line1, ua.line2,
         ua.postal_code AS postalCode, ua.geo_lat AS geoLat, ua.geo_lng AS geoLng,
         (SELECT GROUP_CONCAT(DISTINCT s.slug ORDER BY s.slug SEPARATOR ',')
          FROM user_specializations us
          JOIN specializations s ON s.id = us.specialization_id
          WHERE us.user_id = u.id) AS specialtiesCsv
  FROM users u
  JOIN roles primary_role ON primary_role.id = u.primary_role_id
  LEFT JOIN farmer_profiles fp ON fp.user_id = u.id
  LEFT JOIN expert_profiles ep ON ep.user_id = u.id
  LEFT JOIN service_provider_profiles sp ON sp.user_id = u.id
  LEFT JOIN user_addresses ua ON ua.user_id = u.id
`;

const USER_COLUMNS = Object.freeze({
  email: 'email',
  phone: 'phone',
  fullName: 'full_name',
  passwordHash: 'password_hash',
  passwordChangedAt: 'password_changed_at',
  status: 'status',
  language: 'language',
  isEmailVerified: 'is_email_verified',
  isPhoneVerified: 'is_phone_verified',
  emailVerifiedAt: 'email_verified_at',
  phoneVerifiedAt: 'phone_verified_at',
  verificationStatus: 'verification_status',
  verificationApplicationId: 'verification_application_id',
  avatarUrl: 'avatar_url',
  businessName: 'business_name',
  bio: 'bio',
  providerType: 'provider_type_code',
  yearsOfExperience: 'years_of_experience',
  tokenVersion: 'token_version',
  lastLoginAt: 'last_login_at',
  lastLoginIp: 'last_login_ip',
  lastLoginUserAgent: 'last_login_user_agent',
  notificationPreferences: 'notification_preferences',
  deletedAt: 'deleted_at',
});

function parseJson(value, fallback) {
  if (value === null || value === undefined) return fallback;
  if (typeof value !== 'string') return value;
  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
}

function mapUser(row) {
  if (!row) return null;
  const roles = row.rolesCsv ? row.rolesCsv.split(',') : [row.role];
  const address = row.region || row.zone || row.city || row.line1
    ? {
        region: row.region,
        zone: row.zone,
        woreda: row.woreda,
        kebele: row.kebele,
        city: row.city,
        line1: row.line1,
        line2: row.line2,
        postalCode: row.postalCode,
        geo: row.geoLat === null && row.geoLng === null
          ? null
          : { lat: row.geoLat, lng: row.geoLng },
      }
    : null;

  return {
    _id: String(row.id),
    id: String(row.id),
    email: row.email,
    phone: row.phone,
    fullName: row.fullName,
    passwordHash: row.passwordHash,
    passwordChangedAt: row.passwordChangedAt,
    role: row.role,
    roles,
    permissions: row.permissionsCsv ? row.permissionsCsv.split(',') : [],
    status: row.status,
    language: row.language,
    isEmailVerified: Boolean(row.isEmailVerified),
    isPhoneVerified: Boolean(row.isPhoneVerified),
    emailVerifiedAt: row.emailVerifiedAt,
    phoneVerifiedAt: row.phoneVerifiedAt,
    verificationStatus: row.verificationStatus,
    verificationApplicationId: row.verificationApplicationId === null
      ? null
      : String(row.verificationApplicationId),
    avatarUrl: row.avatarUrl,
    businessName: row.businessName,
    bio: row.bio,
    providerType: row.providerType,
    yearsOfExperience: row.yearsOfExperience,
    farmingExperienceYears: row.farmingExperienceYears,
    primaryCrops: parseJson(row.primaryCrops, []),
    specialties: row.specialtiesCsv ? row.specialtiesCsv.split(',') : [],
    notificationPreferences: parseJson(row.notificationPreferences, {}),
    address,
    tokenVersion: Number(row.tokenVersion || 0),
    lastLoginAt: row.lastLoginAt,
    lastLoginIp: row.lastLoginIp,
    lastLoginUserAgent: row.lastLoginUserAgent,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
    deletedAt: row.deletedAt,
    refreshTokens: row.refreshTokens || [],
  };
}

async function findOne(whereSql, params, { includeRefreshTokens = false } = {}) {
  const [rows] = await database.query(`${USER_SELECT} WHERE ${whereSql} LIMIT 1`, params);
  const user = mapUser(rows[0]);
  if (user && includeRefreshTokens) {
    const [tokens] = await database.query(
      `SELECT token_hash AS hash, created_at AS createdAt, expires_at AS expiresAt,
              device_fingerprint AS deviceFingerprint, user_agent AS userAgent, ip
       FROM refresh_tokens
       WHERE user_id = ? AND revoked_at IS NULL AND expires_at > NOW()
       ORDER BY created_at DESC LIMIT 10`,
      [user._id],
    );
    user.refreshTokens = tokens;
  }
  return user;
}

async function findById(id) {
  if (!id) return null;
  return findOne('u.id = ? AND u.deleted_at IS NULL', [id], { includeRefreshTokens: true });
}

async function findActiveUserById(id) {
  if (!id) return null;
  return findOne('u.id = ? AND u.deleted_at IS NULL', [id]);
}

async function findByEmail(email) {
  return findOne('u.email = ? AND u.deleted_at IS NULL', [String(email).toLowerCase()]);
}

async function findByPhone(phone) {
  return findOne('u.phone = ? AND u.deleted_at IS NULL', [phone]);
}

async function findByEmailOrPhone(identifier) {
  const value = String(identifier);
  return value.includes('@') ? findByEmail(value) : findByPhone(value);
}

async function existsEmailOrPhone({ email, phone }) {
  const conditions = [];
  const params = [];
  if (email) {
    conditions.push('email = ?');
    params.push(String(email).toLowerCase());
  }
  if (phone) {
    conditions.push('phone = ?');
    params.push(phone);
  }
  if (!conditions.length) return false;
  const [rows] = await database.query(
    `SELECT 1 FROM users WHERE deleted_at IS NULL AND (${conditions.join(' OR ')}) LIMIT 1`,
    params,
  );
  return rows.length > 0;
}

async function createUser(data) {
  const id = await database.transaction(async (connection) => {
    const [roleRows] = await connection.execute('SELECT id FROM roles WHERE code = ? LIMIT 1', [data.role]);
    if (!roleRows.length) throw new Error(`Unknown role '${data.role}'`);

    const roleId = roleRows[0].id;
    const [result] = await connection.execute(
      `INSERT INTO users
       (email, phone, full_name, password_hash, primary_role_id, status, language,
        provider_type_code, business_name, bio, years_of_experience, notification_preferences)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        String(data.email).toLowerCase(),
        data.phone,
        data.fullName,
        data.passwordHash,
        roleId,
        data.status || 'pending',
        data.language || 'en',
        data.providerType || null,
        data.businessName || null,
        data.bio || null,
        data.yearsOfExperience ?? null,
        JSON.stringify(data.notificationPreferences || {}),
      ],
    );
    const userId = result.insertId;
    await connection.execute('INSERT INTO user_roles (user_id, role_id) VALUES (?, ?)', [userId, roleId]);

    if (data.address) await saveAddress(connection, userId, data.address);
    if (data.role === 'farmer') {
      await connection.execute(
        `INSERT INTO farmer_profiles (user_id, primary_crops_json, farming_experience_years)
         VALUES (?, ?, ?)
         ON DUPLICATE KEY UPDATE primary_crops_json = VALUES(primary_crops_json),
                                 farming_experience_years = VALUES(farming_experience_years)`,
        [userId, JSON.stringify(data.primaryCrops || []), data.farmingExperienceYears ?? null],
      );
    } else if (data.role === 'expert') {
      await connection.execute(
        `INSERT INTO expert_profiles (user_id, provider_type_code)
         VALUES (?, ?)`,
        [userId, data.providerType || 'general'],
      );
    } else if (data.role === 'service_provider') {
      await connection.execute(
        `INSERT INTO service_provider_profiles (user_id, provider_type_code)
         VALUES (?, ?)`,
        [userId, data.providerType || 'general'],
      );
    }

    return userId;
  });
  return findById(id);
}

async function saveAddress(connection, userId, address) {
  const geo = address.geo || {};
  await connection.execute(
    `INSERT INTO user_addresses
     (user_id, region, zone, woreda, kebele, city, line1, line2, postal_code, geo_lat, geo_lng)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
     ON DUPLICATE KEY UPDATE
       region = VALUES(region), zone = VALUES(zone), woreda = VALUES(woreda),
       kebele = VALUES(kebele), city = VALUES(city), line1 = VALUES(line1),
       line2 = VALUES(line2), postal_code = VALUES(postal_code),
       geo_lat = VALUES(geo_lat), geo_lng = VALUES(geo_lng)`,
    [
      userId,
      address.region || null,
      address.zone || null,
      address.woreda || null,
      address.kebele || null,
      address.city || null,
      address.line1 || null,
      address.line2 || null,
      address.postalCode || null,
      geo.lat ?? null,
      geo.lng ?? null,
    ],
  );
}

async function updateById(id, patch = {}) {
  const values = [];
  const assignments = [];
  const relatedFields = new Set([
    'address',
    'primaryCrops',
    'farmingExperienceYears',
    'specialties',
  ]);
  const unsupportedFields = Object.keys(patch).filter(
    (key) => !Object.prototype.hasOwnProperty.call(USER_COLUMNS, key) && !relatedFields.has(key),
  );
  if (unsupportedFields.length) {
    throw new Error(`Unsupported user profile field(s): ${unsupportedFields.join(', ')}`);
  }

  for (const [key, value] of Object.entries(patch)) {
    if (Object.prototype.hasOwnProperty.call(USER_COLUMNS, key)) {
      assignments.push(`${USER_COLUMNS[key]} = ?`);
      values.push(key === 'notificationPreferences' ? JSON.stringify(value || {}) : value);
    }
  }

  await database.transaction(async (connection) => {
    if (assignments.length) {
      await connection.execute(
        `UPDATE users SET ${assignments.join(', ')} WHERE id = ?`,
        [...values, id],
      );
    }

    if (patch.address !== undefined) await saveAddress(connection, id, patch.address || {});
    if (patch.primaryCrops !== undefined || patch.farmingExperienceYears !== undefined) {
      await connection.execute(
        `INSERT INTO farmer_profiles (user_id, primary_crops_json, farming_experience_years)
         VALUES (?, ?, ?)
         ON DUPLICATE KEY UPDATE
           primary_crops_json = COALESCE(VALUES(primary_crops_json), primary_crops_json),
           farming_experience_years = COALESCE(VALUES(farming_experience_years), farming_experience_years)`,
        [
          id,
          patch.primaryCrops === undefined ? null : JSON.stringify(patch.primaryCrops),
          patch.farmingExperienceYears === undefined ? null : patch.farmingExperienceYears,
        ],
      );
    }

    if (patch.providerType !== undefined) {
      await connection.execute(
        'UPDATE expert_profiles SET provider_type_code = ? WHERE user_id = ?',
        [patch.providerType, id],
      );
      await connection.execute(
        'UPDATE service_provider_profiles SET provider_type_code = ? WHERE user_id = ?',
        [patch.providerType, id],
      );
    }

    if (patch.yearsOfExperience !== undefined) {
      await connection.execute(
        'UPDATE expert_profiles SET years_of_experience = ? WHERE user_id = ?',
        [patch.yearsOfExperience, id],
      );
    }

    if (patch.specialties !== undefined) {
      const uniqueSpecialties = [...new Set(patch.specialties)];
      if (uniqueSpecialties.length) {
        const placeholders = uniqueSpecialties.map(() => '?').join(', ');
        const [knownSpecialties] = await connection.execute(
          `SELECT slug FROM specializations WHERE slug IN (${placeholders})`,
          uniqueSpecialties,
        );
        if (knownSpecialties.length !== uniqueSpecialties.length) {
          throw new Error('One or more specialties do not exist');
        }
      }
      await connection.execute('DELETE FROM user_specializations WHERE user_id = ?', [id]);
      for (const slug of uniqueSpecialties) {
        await connection.execute(
          `INSERT IGNORE INTO user_specializations (user_id, specialization_id)
           SELECT ?, id FROM specializations WHERE slug = ?`,
          [id, slug],
        );
      }
    }
  });
  return findById(id);
}

async function setEmail(id, newEmail) {
  await database.query(
    `UPDATE users SET email = ?, is_email_verified = 1, email_verified_at = NOW(),
     token_version = token_version + 1 WHERE id = ?`,
    [String(newEmail).toLowerCase(), id],
  );
}

async function setPhone(id, newPhone) {
  await database.query(
    `UPDATE users SET phone = ?, is_phone_verified = 1, phone_verified_at = NOW(),
     token_version = token_version + 1 WHERE id = ?`,
    [newPhone, id],
  );
}

async function setNotificationPreferences(id, prefs) {
  await database.query('UPDATE users SET notification_preferences = ? WHERE id = ?', [
    JSON.stringify(prefs),
    id,
  ]);
}

async function setStatus(id, status) {
  await database.query('UPDATE users SET status = ? WHERE id = ?', [status, id]);
}

async function setRole(id, role) {
  await database.transaction(async (connection) => {
    const [roles] = await connection.execute('SELECT id FROM roles WHERE code = ? LIMIT 1', [role]);
    if (!roles.length) throw new Error(`Unknown role '${role}'`);
    await connection.execute('UPDATE users SET primary_role_id = ? WHERE id = ?', [roles[0].id, id]);
    await connection.execute('DELETE FROM user_roles WHERE user_id = ?', [id]);
    await connection.execute('INSERT INTO user_roles (user_id, role_id) VALUES (?, ?)', [id, roles[0].id]);
  });
}

async function softDelete(id) {
  await database.transaction(async (connection) => {
    await connection.execute(
      `UPDATE users SET deleted_at = NOW(), status = 'deleted', token_version = token_version + 1
       WHERE id = ?`,
      [id],
    );
    await connection.execute(
      'UPDATE refresh_tokens SET revoked_at = NOW() WHERE user_id = ? AND revoked_at IS NULL',
      [id],
    );
  });
}

async function addRefreshToken(id, record) {
  await database.query(
    `INSERT INTO refresh_tokens
     (user_id, token_hash, device_fingerprint, user_agent, ip, created_at, expires_at)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [
      id,
      record.hash,
      record.deviceFingerprint,
      record.userAgent,
      record.ip,
      record.createdAt,
      record.expiresAt,
    ],
  );
  await database.query(
    `UPDATE refresh_tokens SET revoked_at = NOW()
     WHERE user_id = ? AND revoked_at IS NULL AND id NOT IN (
       SELECT id FROM (
         SELECT id FROM refresh_tokens WHERE user_id = ? AND revoked_at IS NULL
         ORDER BY created_at DESC LIMIT 10
       ) AS retained
     )`,
    [id, id],
  );
}

async function setRefreshTokens(id, records) {
  await database.transaction(async (connection) => {
    await connection.execute(
      'UPDATE refresh_tokens SET revoked_at = NOW() WHERE user_id = ? AND revoked_at IS NULL',
      [id],
    );
    for (const record of records) {
      await connection.execute(
        `INSERT INTO refresh_tokens
         (user_id, token_hash, device_fingerprint, user_agent, ip, created_at, expires_at)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          id,
          record.hash,
          record.deviceFingerprint,
          record.userAgent,
          record.ip,
          record.createdAt,
          record.expiresAt,
        ],
      );
    }
  });
}

async function revokeAllTokens(id) {
  await database.transaction(async (connection) => {
    await connection.execute('UPDATE users SET token_version = token_version + 1 WHERE id = ?', [id]);
    await connection.execute(
      'UPDATE refresh_tokens SET revoked_at = NOW() WHERE user_id = ? AND revoked_at IS NULL',
      [id],
    );
  });
}

async function updatePassword(id, hash) {
  await database.query(
    `UPDATE users SET password_hash = ?, password_changed_at = NOW(),
     token_version = token_version + 1 WHERE id = ?`,
    [hash, id],
  );
}

async function recordLogin(id, meta = {}) {
  await database.query(
    'UPDATE users SET last_login_at = NOW(), last_login_ip = ?, last_login_user_agent = ? WHERE id = ?',
    [meta.ip || null, meta.userAgent || null, id],
  );
}

async function findPublicProfileById(id) {
  const user = await findOne('u.id = ? AND u.deleted_at IS NULL', [id]);
  if (!user) return null;
  return user;
}

async function findActiveByRole(role) {
  const [rows] = await database.query(
    `${USER_SELECT}
     WHERE primary_role.code = ? AND u.status = 'active' AND u.deleted_at IS NULL
     ORDER BY u.id`,
    [role],
  );
  return rows.map(mapUser);
}

async function listUsers({ filter = {}, page = 1, limit = 20, sort = null } = {}) {
  const conditions = ['u.deleted_at IS NULL'];
  const params = [];
  if (filter.role) {
    conditions.push('primary_role.code = ?');
    params.push(filter.role);
  }
  if (filter.status) {
    conditions.push('u.status = ?');
    params.push(filter.status);
  }
  if (typeof filter.verified === 'boolean') {
    conditions.push('u.is_email_verified = ?');
    params.push(filter.verified ? 1 : 0);
  }
  if (filter.q) {
    const term = `%${String(filter.q).replace(/[\\%_]/g, '\\$&')}%`;
    conditions.push('(u.full_name LIKE ? OR u.email LIKE ? OR u.phone LIKE ? OR u.business_name LIKE ?)');
    params.push(term, term, term, term);
  }

  const safeSortFields = {
    createdAt: 'u.created_at',
    fullName: 'u.full_name',
    email: 'u.email',
    status: 'u.status',
  };
  const sortEntry = sort && Object.entries(sort).find(([field]) => safeSortFields[field]);
  const orderBy = sortEntry
    ? `${safeSortFields[sortEntry[0]]} ${Number(sortEntry[1]) === 1 ? 'ASC' : 'DESC'}`
    : 'u.created_at DESC';
  const offset = (page - 1) * limit;
  const where = conditions.join(' AND ');

  const [rows, countRows] = await Promise.all([
    database.query(
      `${USER_SELECT} WHERE ${where} ORDER BY ${orderBy} LIMIT ? OFFSET ?`,
      [...params, limit, offset],
    ),
    database.query(
      `SELECT COUNT(*) AS total FROM users u JOIN roles primary_role
       ON primary_role.id = u.primary_role_id WHERE ${where}`,
      params,
    ),
  ]);
  const data = rows[0].map(mapUser);
  const total = Number(countRows[0][0].total);
  return {
    data,
    pagination: { page, limit, total, totalPages: Math.max(1, Math.ceil(total / limit)) },
  };
}

async function aggregateDailyRegistrations({ from, to }) {
  const [rows] = await database.query(
    `SELECT DATE_FORMAT(u.created_at, '%Y-%m-%d') AS day,
            COUNT(*) AS count,
            SUM(r.code = 'buyer') AS buyers,
            SUM(r.code = 'farmer') AS farmers
     FROM users u
     JOIN roles r ON r.id = u.primary_role_id
     WHERE u.created_at BETWEEN ? AND ? AND u.deleted_at IS NULL
     GROUP BY DATE(u.created_at) ORDER BY DATE(u.created_at)`,
    [from, to],
  );
  return rows.map((row) => ({
    day: row.day,
    count: Number(row.count),
    buyers: Number(row.buyers || 0),
    farmers: Number(row.farmers || 0),
  }));
}

async function setEmailVerified(id) {
  await database.query(
    'UPDATE users SET is_email_verified = 1, email_verified_at = NOW() WHERE id = ?',
    [id],
  );
}

async function setPhoneVerified(id) {
  await database.query(
    'UPDATE users SET is_phone_verified = 1, phone_verified_at = NOW() WHERE id = ?',
    [id],
  );
}

module.exports = {
  findById,
  findActiveUserById,
  findByEmail,
  findByPhone,
  findByEmailOrPhone,
  existsEmailOrPhone,
  findPublicProfileById,
  createUser,
  updateById,
  setEmail,
  setPhone,
  setEmailVerified,
  setPhoneVerified,
  setNotificationPreferences,
  setStatus,
  setRole,
  softDelete,
  listUsers,
  aggregateDailyRegistrations,
  findActiveByRole,
  addRefreshToken,
  setRefreshTokens,
  revokeAllTokens,
  updatePassword,
  recordLogin,
};
