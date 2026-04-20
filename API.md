# API.md — REST API эндпоинты NeiroUstaz

## Базовый URL
```
http://localhost:3001/api
```

## Аутентификация
Все защищённые маршруты требуют заголовок:
```
Authorization: Bearer <JWT_TOKEN>
```

---

## Auth — /api/auth

### POST /api/auth/register
Регистрация нового пользователя.

**Body:**
```json
{
  "full_name": "Айгерим Бекова",
  "email": "ai@example.com",
  "phone": "+77001234567",
  "password": "securepass123"
}
```

**Response 201:**
```json
{
  "token": "eyJhbGci...",
  "user": {
    "id": 1,
    "full_name": "Айгерим Бекова",
    "email": "ai@example.com",
    "points": 0,
    "level": 1
  }
}
```

---

### POST /api/auth/login
Вход в систему.

**Body:**
```json
{
  "email": "ai@example.com",
  "password": "securepass123"
}
```

**Response 200:**
```json
{
  "token": "eyJhbGci...",
  "user": { "id": 1, "full_name": "...", "points": 45, "level": 1 }
}
```

---

## User — /api/user 🔒

### GET /api/user/me
Получить профиль текущего пользователя.

**Response 200:**
```json
{
  "id": 1,
  "full_name": "Айгерим Бекова",
  "email": "ai@example.com",
  "university": "КазНПУ",
  "year": 2,
  "lang": "ru",
  "points": 120,
  "level": 2,
  "level_name": "Педагог",
  "achievements": [
    { "code": "first_task", "title": "Первый шаг", "earned_at": "2025-01-10" }
  ]
}
```

---

### PATCH /api/user/me
Обновить профиль.

**Body (все поля опциональны):**
```json
{
  "full_name": "Айгерим Бекова",
  "university": "КазНПУ",
  "year": 3,
  "lang": "kz"
}
```

**Response 200:**
```json
{ "message": "Профиль обновлён" }
```

---

## AI — /api/ai 🔒

### POST /api/ai/chat
Отправить сообщение ИИ-помощнику.

**Body:**
```json
{
  "message": "Как составить характеристику на ребёнка с РАС?"
}
```

**Response 200:**
```json
{
  "reply": "Для составления характеристики на ребёнка с РАС важно описать...",
  "lang": "ru"
}
```

---

### GET /api/ai/chat/history
Получить историю чата (последние 20 сообщений).

**Response 200:**
```json
{
  "history": [
    { "role": "user", "content": "Что такое ЗПР?", "created_at": "..." },
    { "role": "assistant", "content": "ЗПР — задержка психического развития...", "created_at": "..." }
  ]
}
```

---

### DELETE /api/ai/chat/history
Очистить историю чата.

**Response 200:**
```json
{ "message": "История очищена" }
```

---

## Tasks — /api/tasks 🔒

### GET /api/tasks/today
Получить задание на сегодня.

**Response 200:**
```json
{
  "id": 42,
  "type": "test",
  "content": {
    "question": "Ребёнок с аутизмом не реагирует на имя...",
    "options": ["Повторить громче", "Использовать жест", "Сообщить родителям", "Продолжить урок"],
    "correct": null
  },
  "points_reward": 10,
  "already_completed": false
}
```

Если задание уже выполнено — возвращает `already_completed: true` и результат.

---

### POST /api/tasks/:id/answer
Ответить на задание.

**Body для теста:**
```json
{ "selected": 1 }
```

**Body для кейса:**
```json
{ "text": "Сначала я подойду к ребёнку и..." }
```

**Response 200:**
```json
{
  "is_correct": true,
  "points_earned": 10,
  "feedback": "Верно! Визуальный контакт — ключевой инструмент при работе с детьми с РАС...",
  "total_points": 130,
  "new_achievement": null
}
```

---

## Community — /api/community 🔒

### GET /api/community/posts
Получить список постов.

**Query params:**
- `lang` — `ru` или `kz` (по умолчанию — язык пользователя)
- `sort` — `new` (по умолчанию) или `popular`
- `page` — номер страницы (по умолчанию 1)
- `limit` — постов на странице (по умолчанию 20)

**Response 200:**
```json
{
  "posts": [
    {
      "id": 5,
      "content": "Как вы работаете с неговорящими детьми на уроке?",
      "author": { "id": 3, "full_name": "Дана Сейткали", "level": 2 },
      "likes": 12,
      "user_liked": false,
      "created_at": "2025-01-15T10:30:00Z"
    }
  ],
  "total": 47,
  "page": 1
}
```

---

### POST /api/community/posts
Создать пост.

**Body:**
```json
{
  "content": "Поделитесь опытом работы с детьми с ОНР!"
}
```

**Response 201:**
```json
{
  "id": 6,
  "content": "...",
  "created_at": "...",
  "points_earned": 5
}
```

---

### POST /api/community/posts/:id/like
Поставить или убрать лайк.

**Response 200:**
```json
{
  "liked": true,
  "likes": 13
}
```

---

## Коды ошибок

| Код | Описание |
|-----|---------|
| 400 | Неверные данные запроса |
| 401 | Не авторизован / токен истёк |
| 403 | Нет прав доступа |
| 404 | Ресурс не найден |
| 409 | Конфликт (например, email уже занят) |
| 429 | Слишком много запросов (rate limit) |
| 500 | Внутренняя ошибка сервера |

**Формат ошибки:**
```json
{
  "error": "Email уже используется",
  "code": "EMAIL_EXISTS"
}
```
