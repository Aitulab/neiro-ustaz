# TODO.md — Задачи и правила разработки бэкенда

## Статус проекта
- [x] Дизайн готов
- [x] Frontend готов
- [x] Backend готов
- [x] Интеграция фронта с бэком
- [x] Деплой (готовность)

---

## TODO — Что нужно сделать

### 🔴 Приоритет 1 — Основа (без этого ничего не работает)

- [x] Инициализация Express-проекта
- [x] Создать `index.js` — точка входа, подключение middleware и роутов
- [x] Создать `src/db/index.js` — подключение к SQLite, применение schema
- [x] Создать `src/db/schema.sql` — все таблицы (см. ARCHITECTURE.md)
- [x] Реализовать `authMiddleware` — проверка JWT
- [x] Реализовать `langMiddleware` — определение языка из user.lang
- [x] Реализовать `errorHandler` — глобальный обработчик ошибок

---

### 🔴 Приоритет 2 — Аутентификация

- [x] `POST /api/auth/register` — регистрация
- [x] `POST /api/auth/login` — вход

---

### 🔴 Приоритет 3 — Профиль пользователя

- [x] `GET /api/user/me` — получить профиль + достижения + уровень
- [x] `PATCH /api/user/me` — обновить профиль (ФИО, универ, курс, язык)

---

### 🟡 Приоритет 4 — ИИ-помощник

- [x] Groq SDK уже установлен (`groq-sdk`)
- [x] `POST /api/ai/chat` — основной чат
- [x] `GET /api/ai/chat/history` — история чата
- [x] `DELETE /api/ai/chat/history` — очистить историю

---

### 🟡 Приоритет 5 — Ежедневные задания

- [x] `GET /api/tasks/today` — получить задание на сегодня
- [x] `POST /api/tasks/:id/answer` — ответить на задание
- [x] Сервис `checkAchievements(userId)` — проверить и выдать достижения

---

### 🟡 Приоритет 6 — Сообщество

- [x] `GET /api/community/posts` — список постов с пагинацией и сортировкой
- [x] `POST /api/community/posts` — создать пост, начислить 5 баллов за первый пост
- [x] `POST /api/community/posts/:id/like` — toggle-лайк

---

### 🟢 Приоритет 7 — Дополнительно

- [x] Rate limiting — `npm install express-rate-limit`
- [x] Валидация запросов — `npm install express-validator` или `zod`
- [x] Логирование — `npm install morgan`
- [x] Сид-данные для достижений — скрипт `seed.js` для первоначального заполнению таблицы `achievements`

---

## ✅ ЧТО ДЕЛАТЬ (Best Practices)

### Структура кода
- **Разделяй роуты, контроллеры и сервисы** — один файл не должен делать всё сразу
- **Храни SQL-запросы в сервисах**, а не в контроллерах
- **Используй `async/await`** везде, оборачивай в try/catch
- **Проверяй принадлежность ресурса** — пользователь должен получать только свои данные (task_results, chat_history)

### База данных
- **Используй транзакции** при нескольких связанных INSERT/UPDATE (баллы + результат задания)
- **Используй параметризованные запросы** — никогда не вставляй данные пользователя в SQL строкой
- **Индексируй часто используемые поля**: `user_id`, `date` в таблице `tasks`

### Безопасность
- **Хэшируй пароли через bcrypt** — никогда не храни пароль в открытом виде
- **Проверяй JWT на каждом защищённом маршруте** через middleware
- **Не возвращай хэш пароля** в ответах API
- **Валидируй входящие данные** — длина, формат, тип

### ИИ-интеграция
- **Храни API-ключ только в `.env`**, никогда не хардкоди в коде
- **Ограничивай длину истории** — передавай не больше 20 сообщений в контекст
- **Обрабатывай ошибки API** — если Groq API недоступен, возвращай понятную ошибку

---

## ❌ ЧТО НЕ ДЕЛАТЬ

### Архитектура
- ❌ Не пиши всю логику в одном файле (`index.js` — только точка входа)
- ❌ Не используй ORM (Sequelize, Prisma) — проект простой, SQLite + чистый SQL достаточно
- ❌ Не используй глобальные переменные для состояния

### База данных
- ❌ **Никогда не делай**: `db.query("SELECT * FROM users WHERE email = '" + email + "'")`  ← SQL-инъекция
- ❌ Не удаляй данные из `task_results` — только добавляй
- ❌ Не забывай закрывать транзакции при ошибке

### Безопасность
- ❌ Не храни JWT в теле ответа и не передавай в URL — только в заголовке `Authorization`
- ❌ Не возвращай стек ошибок (`error.stack`) в production-ответах
- ❌ Не давай пользователю изменять `points` напрямую через API — только через логику заданий

### ИИ
- ❌ Не передавай в Groq API весь чат без ограничения — контекст ограничен
- ❌ Не делай запросы к Groq синхронно без timeout-обработки
- ❌ Не генерируй задания при каждом GET-запросе — генерируй раз в день и кэшируй в БД

### Общее
- ❌ Не коммить `.env` файл в git — добавь его в `.gitignore`
- ❌ Не возвращай `500` без сообщения — пользователь должен понимать что пошло не так
- ❌ Не забывай добавлять `CORS` middleware — иначе фронт не сможет достучаться до сервера

---

## Структура файлов сервера (финальная)

```
server/
├── index.js                        # Express app, порт, middleware
├── .env                            # Переменные окружения (не в git!)
├── .env.example                    # Пример для других разработчиков
├── .gitignore
├── package.json
└── src/
    ├── db/
    │   ├── index.js                # Подключение к SQLite
    │   └── schema.sql              # DDL всех таблиц
    ├── middleware/
    │   ├── auth.js                 # JWT проверка
    │   ├── lang.js                 # Определение языка
    │   └── errorHandler.js        # Глобальный обработчик ошибок
    ├── routes/
    │   ├── auth.routes.js
    │   ├── user.routes.js
    │   ├── ai.routes.js
    │   ├── tasks.routes.js
    │   └── community.routes.js
    ├── controllers/
    │   ├── auth.controller.js
    │   ├── user.controller.js
    │   ├── ai.controller.js
    │   ├── tasks.controller.js
    │   └── community.controller.js
    └── services/
        ├── auth.service.js
        ├── user.service.js
        ├── ai.service.js
        ├── tasks.service.js
        ├── community.service.js
        └── achievements.service.js # checkAchievements()
```

---

## npm-пакеты для установки

```bash
# Production
npm install express better-sqlite3 bcryptjs jsonwebtoken dotenv cors groq-sdk express-rate-limit morgan

# Development
npm install -D nodemon
```

**package.json scripts:**
```json
{
  "scripts": {
    "start": "node index.js",
    "dev": "nodemon index.js"
  }
}
```
