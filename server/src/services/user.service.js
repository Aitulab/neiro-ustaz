import db from '../db/index.js';

const LEVEL_NAMES = {
  1: { ru: 'Студент', kz: 'Студент' },
  2: { ru: 'Педагог', kz: 'Мұғалім' },
  3: { ru: 'Эксперт', kz: 'Сарапшы' }
};

function calculateLevel(points) {
  if (points >= 300) return 3;
  if (points >= 100) return 2;
  return 1;
}

export function getProfile(userId, lang = 'ru') {
  const user = db.prepare(`
    SELECT id, full_name, email, phone, university, year, lang, points, level, created_at
    FROM users WHERE id = ?
  `).get(userId);

  if (!user) {
    const err = new Error('Пользователь не найден');
    err.status = 404;
    err.code = 'USER_NOT_FOUND';
    throw err;
  }

  // Get user achievements
  const achievements = db.prepare(`
    SELECT a.code, a.title_ru, a.title_kz, a.description_ru, a.description_kz, a.points, ua.earned_at
    FROM user_achievements ua
    JOIN achievements a ON a.id = ua.achievement_id
    WHERE ua.user_id = ?
    ORDER BY ua.earned_at DESC
  `).all(userId);

  // Format achievements based on language
  const formattedAchievements = achievements.map(a => ({
    code: a.code,
    title: lang === 'kz' ? a.title_kz : a.title_ru,
    description: lang === 'kz' ? a.description_kz : a.description_ru,
    points: a.points,
    earned_at: a.earned_at
  }));

  const levelName = LEVEL_NAMES[user.level]?.[lang] || LEVEL_NAMES[1][lang];

  return {
    ...user,
    level_name: levelName,
    achievements: formattedAchievements
  };
}

export function updateProfile(userId, patch) {
  const allowedFields = ['full_name', 'university', 'year', 'lang'];
  const updates = [];
  const values = [];

  for (const field of allowedFields) {
    if (patch[field] !== undefined) {
      updates.push(`${field} = ?`);
      values.push(patch[field]);
    }
  }

  if (updates.length === 0) {
    const err = new Error('Нет данных для обновления');
    err.status = 400;
    err.code = 'NO_UPDATE_DATA';
    throw err;
  }

  values.push(userId);
  db.prepare(`UPDATE users SET ${updates.join(', ')} WHERE id = ?`).run(...values);

  return getProfile(userId, patch.lang);
}

export function addPoints(userId, points) {
  const updatePoints = db.transaction(() => {
    db.prepare('UPDATE users SET points = points + ? WHERE id = ?').run(points, userId);
    const user = db.prepare('SELECT points FROM users WHERE id = ?').get(userId);
    const newLevel = calculateLevel(user.points);
    db.prepare('UPDATE users SET level = ? WHERE id = ?').run(newLevel, userId);
    return user.points;
  });

  return updatePoints();
}
