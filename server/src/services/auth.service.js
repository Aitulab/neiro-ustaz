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

export async function registerUser({ full_name, email, phone, password }) {
  // Check if email already exists
  const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
  if (existing) {
    const err = new Error('Email уже используется');
    err.status = 409;
    err.code = 'EMAIL_EXISTS';
    throw err;
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

  // Insert user
  const result = db.prepare(`
    INSERT INTO users (full_name, email, phone, password)
    VALUES (?, ?, ?, ?)
  `).run(full_name, email, phone || null, hashedPassword);

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
  // Find user by email
  const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
  if (!user) {
    const err = new Error('Неверный email или пароль');
    err.status = 401;
    err.code = 'INVALID_CREDENTIALS';
    throw err;
  }

  // Compare password
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
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
