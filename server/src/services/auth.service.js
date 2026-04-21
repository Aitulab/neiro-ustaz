import db from '../db/index.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const SALT_ROUNDS = 10;

const LEVEL_NAMES = {
  1: { ru: 'Студент', kz: 'Студент' },
  2: { ru: 'Педагог', kz: 'Мұғалім' },
  3: { ru: 'Эксперт', kz: 'Сарапшы' }
};

function getLevelName(level, lang = 'ru') {
  return LEVEL_NAMES[level]?.[lang] || LEVEL_NAMES[1][lang];
}

function normalizePhone(phone) {
  if (!phone) return null;
  // Remove all non-digit characters
  const digits = phone.replace(/\D/g, '');
  // If it starts with 8, replace with 7 (Kazakhstan preference)
  if (digits.length === 11 && digits.startsWith('8')) {
    return '7' + digits.substring(1);
  }
  return digits;
}

export async function registerUser({ full_name, email, phone, password, university }) {
  const normalizedPhone = normalizePhone(phone);

  // Check if email or phone already exists
  const existing = db.prepare('SELECT id FROM users WHERE email = ? OR (phone IS NOT NULL AND phone = ?)').get(email, normalizedPhone || '____NONE____');
  if (existing) {
    const err = new Error('Email или телефон уже используется');
    err.status = 409;
    err.code = 'USER_EXISTS';
    throw err;
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

  // Insert user
  const result = db.prepare(`
    INSERT INTO users (full_name, email, phone, password, university)
    VALUES (?, ?, ?, ?, ?)
  `).run(full_name, email, normalizedPhone, hashedPassword, university || null);

  const user = db.prepare(`
    SELECT id, full_name, email, phone, university, year, lang, points, level, created_at
    FROM users WHERE id = ?
  `).get(result.lastInsertRowid);

  // Generate JWT
  const token = jwt.sign(
    { id: user.id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '30d' }
  );

  return {
    token,
    user: {
      id: user.id,
      full_name: user.full_name,
      email: user.email,
      points: user.points,
      level: user.level,
      level_name: getLevelName(user.level, user.lang)
    }
  };
}



export async function loginUser({ email, password }) {
  const isPhone = /^\+?[\d\s()-]{10,}$/.test(email);
  let user;

  const emailLower = email.trim().toLowerCase();

  if (isPhone) {
    const normalized = normalizePhone(email);
    // Search by phone OR by email (in case phone was saved as email)
    user = db.prepare('SELECT * FROM users WHERE phone = ? OR email = ?').get(normalized, emailLower);
  } else {
    // Search by email as normal
    user = db.prepare('SELECT * FROM users WHERE email = ?').get(emailLower);
  }

  if (!user) {
    console.warn(`[Auth] User not found for login attempt: ${emailLower}`);
    const err = new Error('Неверный email или пароль');
    err.status = 401;
    err.code = 'INVALID_CREDENTIALS';
    throw err;
  }

  // Compare password
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    console.warn(`[Auth] Password mismatch for user: ${emailLower}`);
    const err = new Error('Неверный email или пароль');
    err.status = 401;
    err.code = 'INVALID_CREDENTIALS';
    throw err;
  }

  // Generate JWT
  const token = jwt.sign(
    { id: user.id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '30d' }
  );

  return {
    token,
    user: {
      id: user.id,
      full_name: user.full_name,
      email: user.email,
      points: user.points,
      level: user.level,
      level_name: getLevelName(user.level, user.lang)
    }
  };
}

