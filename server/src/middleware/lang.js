import db from '../db/index.js';

export function langMiddleware(req, res, next) {
  // Default language
  req.lang = 'ru';

  // If user is authenticated, use their preferred language
  if (req.user?.id) {
    const row = db.prepare('SELECT lang FROM users WHERE id = ?').get(req.user.id);
    if (row?.lang) {
      req.lang = row.lang;
    }
  }

  // Allow override via query param or header
  if (req.query.lang && ['ru', 'kz'].includes(req.query.lang)) {
    req.lang = req.query.lang;
  } else if (req.headers['x-lang'] && ['ru', 'kz'].includes(req.headers['x-lang'])) {
    req.lang = req.headers['x-lang'];
  }

  next();
}
