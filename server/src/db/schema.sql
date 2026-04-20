-- Пользователи
CREATE TABLE IF NOT EXISTS users (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  full_name   TEXT NOT NULL,
  email       TEXT UNIQUE NOT NULL,
  phone       TEXT,
  password    TEXT NOT NULL,
  university  TEXT,
  year        INTEGER,
  lang        TEXT DEFAULT 'ru',
  points      INTEGER DEFAULT 0,
  level       INTEGER DEFAULT 1,
  created_at  DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Сессии (для инвалидации токенов)
CREATE TABLE IF NOT EXISTS sessions (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id    INTEGER REFERENCES users(id),
  token      TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  expires_at DATETIME NOT NULL
);

-- Ежедневные задания
CREATE TABLE IF NOT EXISTS tasks (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id       INTEGER REFERENCES users(id),
  type          TEXT NOT NULL,
  content_kz    TEXT NOT NULL,
  content_ru    TEXT NOT NULL,
  points_reward INTEGER DEFAULT 10,
  date          DATE NOT NULL,
  created_at    DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Результаты заданий
CREATE TABLE IF NOT EXISTS task_results (
  id           INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id      INTEGER REFERENCES users(id),
  task_id      INTEGER REFERENCES tasks(id),
  answer       TEXT,
  is_correct   INTEGER,
  points       INTEGER DEFAULT 0,
  feedback_kz  TEXT,
  feedback_ru  TEXT,
  completed_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Посты сообщества
CREATE TABLE IF NOT EXISTS community_posts (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id    INTEGER REFERENCES users(id),
  title      TEXT DEFAULT '',
  content    TEXT NOT NULL,
  tags       TEXT DEFAULT '[]',
  lang       TEXT DEFAULT 'ru',
  likes      INTEGER DEFAULT 0,
  replies_count INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Ответы на посты
CREATE TABLE IF NOT EXISTS community_replies (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  post_id    INTEGER REFERENCES community_posts(id),
  user_id    INTEGER REFERENCES users(id),
  content    TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Лайки постов
CREATE TABLE IF NOT EXISTS post_likes (
  user_id INTEGER REFERENCES users(id),
  post_id INTEGER REFERENCES community_posts(id),
  PRIMARY KEY (user_id, post_id)
);

-- История чата с ИИ
CREATE TABLE IF NOT EXISTS ai_chat_history (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id    INTEGER REFERENCES users(id),
  role       TEXT NOT NULL,
  content    TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Достижения (справочник)
CREATE TABLE IF NOT EXISTS achievements (
  id             INTEGER PRIMARY KEY AUTOINCREMENT,
  code           TEXT UNIQUE NOT NULL,
  title_ru       TEXT NOT NULL,
  title_kz       TEXT NOT NULL,
  description_ru TEXT,
  description_kz TEXT,
  points         INTEGER DEFAULT 0
);

-- Достижения пользователей
CREATE TABLE IF NOT EXISTS user_achievements (
  user_id        INTEGER REFERENCES users(id),
  achievement_id INTEGER REFERENCES achievements(id),
  earned_at      DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (user_id, achievement_id)
);

-- Индексы для часто используемых запросов
CREATE INDEX IF NOT EXISTS idx_tasks_user_date ON tasks(user_id, date);
CREATE INDEX IF NOT EXISTS idx_task_results_user ON task_results(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_chat_user ON ai_chat_history(user_id, created_at);
CREATE INDEX IF NOT EXISTS idx_community_posts_lang ON community_posts(lang, created_at);
CREATE INDEX IF NOT EXISTS idx_community_posts_likes ON community_posts(likes DESC);

-- НПА документы
CREATE TABLE IF NOT EXISTS npa_documents (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  title_kk    TEXT NOT NULL,
  title_ru    TEXT NOT NULL,
  desc_kk     TEXT NOT NULL,
  desc_ru     TEXT NOT NULL,
  file_url    TEXT NOT NULL,
  user_id     INTEGER REFERENCES users(id),
  created_at  DATETIME DEFAULT CURRENT_TIMESTAMP
);
