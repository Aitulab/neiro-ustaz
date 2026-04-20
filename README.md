# NeiroUstaz — Образовательная платформа для будущих педагогов

> Интерактивная платформа для студентов педагогических специальностей, изучающих инклюзивное образование. С ИИ-помощником, геймификацией и сообществом.

---

## Стек технологий

| Слой | Технология |
|------|-----------|
| Frontend | React (уже готов) |
| Backend | Node.js + Express |
| База данных | SQLite (через `better-sqlite3`) |
| ИИ | Groq API (LLaMA 3) |
| Аутентификация | JWT (jsonwebtoken) |
| Языки интерфейса | Казахский / Русский |

---

## Структура репозитория

```
neiroUstaz/
├── client/                  # Frontend (уже готов)
│   └── ...
├── server/                  # Backend (Express)
│   ├── src/
│   │   ├── routes/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── db/
│   │   └── services/
│   ├── database.sqlite
│   ├── .env
│   └── index.js
├── docs/
│   ├── README.md            # этот файл
│   ├── ARCHITECTURE.md      # архитектура
│   ├── BUSINESS_LOGIC.md    # бизнес-логика
│   ├── API.md               # эндпоинты
│   └── TODO.md              # что делать
└── package.json
```

---

## Быстрый старт

```bash
# Установка зависимостей
cd server && npm install

# Создать .env (см. .env.example)
cp .env.example .env

# Запуск в dev-режиме
npm run dev
```

---

## Документация

- [Архитектура](./ARCHITECTURE.md)
- [Бизнес-логика](./BUSINESS_LOGIC.md)
- [API эндпоинты](./API.md)
- [Задачи и план](./TODO.md)
