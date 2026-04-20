# ARCHITECTURE.md — Архитектура проекта NeiroUstaz

## Общая схема

```
┌─────────────────────────────────────────────────────┐
│                    CLIENT (React)                   │
│  - Уже готов                                        │
│  - Общается с сервером через REST API               │
│  - Хранит JWT в localStorage                        │
└───────────────────┬─────────────────────────────────┘
                    │ HTTP REST
                    ▼
┌─────────────────────────────────────────────────────┐
│              SERVER (Express.js)                    │
│                                                     │
│  ┌──────────┐  ┌─────────────┐  ┌───────────────┐  │
│  │  Routes  │→ │ Controllers │→ │   Services    │  │
│  └──────────┘  └─────────────┘  └───────┬───────┘  │
│                                          │          │
│  ┌──────────────────────────────────┐    │          │
│  │         Middleware               │    │          │
│  │  - authMiddleware (JWT verify)   │    │          │
│  │  - langMiddleware (kz/ru)        │    │          │
│  │  - errorHandler                  │    │          │
│  └──────────────────────────────────┘    │          │
└─────────────────────────────┬────────────┘──────────┘
                              │
              ┌───────────────┴───────────────┐
              ▼                               ▼
┌─────────────────────┐         ┌─────────────────────┐
│   SQLite Database   │         │     Groq API        │
│   (better-sqlite3)  │         │   (LLaMA 3 / etc.)  │
│                     │         │  - Chat (/chat)     │
│  - users            │         │  - Tasks (/task)    │
│  - sessions         │         │  - Feedback         │
│  - tasks            │         └─────────────────────┘
│  - task_results     │
│  - community_posts  │
│  - post_likes       │
│  - achievements     │
│  - user_achievements│
└─────────────────────┘
```

---

## Слои приложения

### 1. Routes
Только маршрутизация. Никакой логики.

```
server/src/routes/
├── auth.routes.js        # /api/auth
├── user.routes.js        # /api/user
├── ai.routes.js          # /api/ai
├── tasks.routes.js       # /api/tasks
└── community.routes.js   # /api/community
```

### 2. Controllers
Принимают req/res, вызывают сервисы, возвращают ответ.

```
server/src/controllers/
├── auth.controller.js
├── user.controller.js
├── ai.controller.js
├── tasks.controller.js
└── community.controller.js
```

### 3. Services
Бизнес-логика. Работают с БД и внешними API.

```
server/src/services/
├── auth.service.js        # регистрация, логин, JWT
├── user.service.js        # профиль, баллы, уровень
├── ai.service.js          # запросы к Claude API
├── tasks.service.js       # генерация заданий, проверка
└── community.service.js   # посты, лайки
```

### 4. DB (Models)
Обёртки над SQLite. Нет ORM — чистый SQL.

```
server/src/db/
├── schema.sql             # DDL всех таблиц
├── migrations/            # изменения схемы
└── index.js               # экспорт db-соединения
```

### 5. Middleware

```
server/src/middleware/
├── auth.js                # проверка JWT токена
├── lang.js                # определение языка (kz/ru)
└── errorHandler.js        # глобальный обработчик ошибок
```

---

## База данных — SQLite Schema

```sql
-- Пользователи
CREATE TABLE users (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  full_name   TEXT NOT NULL,
  email       TEXT UNIQUE NOT NULL,
  phone       TEXT,
  password    TEXT NOT NULL,           -- bcrypt hash
  university  TEXT,
  year        INTEGER,
  lang        TEXT DEFAULT 'ru',       -- 'ru' или 'kz'
  points      INTEGER DEFAULT 0,
  level       INTEGER DEFAULT 1,       -- 1=Студент, 2=Педагог, 3=Эксперт
  created_at  DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Сессии (для инвалидации токенов, опционально)
CREATE TABLE sessions (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id    INTEGER REFERENCES users(id),
  token      TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  expires_at DATETIME NOT NULL
);

-- Ежедневные задания
CREATE TABLE tasks (
  id           INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id      INTEGER REFERENCES users(id),
  type         TEXT NOT NULL,          -- 'test' | 'case'
  content_kz   TEXT NOT NULL,          -- JSON задания на казахском
  content_ru   TEXT NOT NULL,          -- JSON задания на русском
  points_reward INTEGER DEFAULT 10,
  date         DATE NOT NULL,
  created_at   DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Результаты заданий
CREATE TABLE task_results (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id     INTEGER REFERENCES users(id),
  task_id     INTEGER REFERENCES tasks(id),
  answer      TEXT,                    -- JSON ответа пользователя
  is_correct  INTEGER,                 -- 0/1
  points      INTEGER DEFAULT 0,
  feedback_kz TEXT,
  feedback_ru TEXT,
  completed_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Посты сообщества
CREATE TABLE community_posts (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id    INTEGER REFERENCES users(id),
  content    TEXT NOT NULL,
  lang       TEXT DEFAULT 'ru',
  likes      INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Лайки постов (чтобы не лайкать дважды)
CREATE TABLE post_likes (
  user_id INTEGER REFERENCES users(id),
  post_id INTEGER REFERENCES community_posts(id),
  PRIMARY KEY (user_id, post_id)
);

-- История чата с ИИ (для контекста)
CREATE TABLE ai_chat_history (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id    INTEGER REFERENCES users(id),
  role       TEXT NOT NULL,            -- 'user' | 'assistant'
  content    TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Достижения (справочник)
CREATE TABLE achievements (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  code        TEXT UNIQUE NOT NULL,   -- 'first_task', 'streak_7', etc.
  title_ru    TEXT NOT NULL,
  title_kz    TEXT NOT NULL,
  description_ru TEXT,
  description_kz TEXT,
  points      INTEGER DEFAULT 0
);

-- Достижения пользователей
CREATE TABLE user_achievements (
  user_id        INTEGER REFERENCES users(id),
  achievement_id INTEGER REFERENCES achievements(id),
  earned_at      DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (user_id, achievement_id)
);
```

---

## Переменные окружения (.env)

```env
PORT=3001
JWT_SECRET=your_secret_key_here
JWT_EXPIRES_IN=7d
GROQ_API_KEY=gsk_...
GROQ_MODEL=llama-3.3-70b-versatile
NODE_ENV=development
```

---

## Поток запроса (пример: пользователь отправляет сообщение ИИ)

```
1. POST /api/ai/chat  { message: "..." }
         │
2. authMiddleware — проверяет JWT → достаёт user.id
         │
3. langMiddleware — определяет язык из user.lang
         │
4. ai.controller.js → ai.service.js
         │
5. ai.service.js:
   - загружает последние N сообщений из ai_chat_history
   - формирует системный промпт (роль педагогического ИИ)
   - отправляет в Groq API (OpenAI-совместимый формат)
   - сохраняет сообщение и ответ в ai_chat_history
         │
6. Возвращает { reply: "..." }
```
