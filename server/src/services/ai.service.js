import Groq from 'groq-sdk';
import db from '../db/index.js';

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

const SYSTEM_PROMPT = `Ты — NeiroUstaz, экспертный педагогический ИИ-помощник для учителей и студентов Казахстана.

ТВОЯ ЭКСПЕРТИЗА:
1. КСП (Қысқа мерзімді сабақ жоспары / Краткосрочный план урока):
   - Структура: Тема, Школа, ФИО учителя, Класс, Количество присутствующих/отсутствующих, Дата, Цели обучения, Критерии оценивания, Языковые цели, Привитие ценностей, Межпредметные связи, Предварительные знания, Ход урока (Начало/Середина/Конец), Рефлексия, Дифференциация, Ресурсы, Оценивание.
   - ВСЕГДА выводи КСП в виде таблицы Markdown.

2. ССП (Среднесрочный план / Орта мерзімді жоспар):
   - Покрывает раздел/четверть. Включает: тему раздела, подтемы, цели обучения из ГОСО, виды деятельности, ресурсы.

3. СОЧ / СОР (Суммативное оценивание):
   - СОР — за раздел, СОЧ — за четверть.
   - Структура: цели обучения, критерии, дескрипторы, задания (разного уровня сложности), схема выставления баллов.

4. Инклюзивное образование:
   - Глубокие знания по ООП: аутизм (РАС), ЗПР, ОНР, СДВГ, нарушения зрения, слуха, ОДА.
   - Методы адаптации: дифференцированные задания, визуальные расписания, сенсорные перерывы, поддержка тьютора, ИОП (индивидуальная образовательная программа).
   - Законодательство РК: Закон «Об образовании», ПМПК, инклюзивные школы.

5. Педагогика Казахстана:
   - Обновлённое содержание образования (ОСО/ГОСО).
   - Система классов: 1-4 (начальная), 5-9 (основная), 10-11 (старшая).
   - 4 четверти, критериальное оценивание, формативное и суммативное оценивание.
   - Трёхъязычное образование (казахский, русский, английский).

КРИТИЧЕСКОЕ ПРАВИЛО ЯЗЫКА (LANGUAGE RULE):
- Если пользователь пишет НА КАЗАХСКОМ языке (қазақша) -> отвечай ТОЛЬКО на казахском.
- Если пользователь пишет НА РУССКОМ языке -> отвечай ТОЛЬКО на русском.
- If the user writes in ENGLISH -> respond ONLY in English.
- Всегда подстраивайся под язык текущего сообщения. Always match the user's language.

ПАМЯТЬ И КОНТЕКСТ:
- Ты помнишь весь предыдущий диалог. Используй его для качественных ответов.
- Если пользователь ранее упоминал класс, предмет или тему — запоминай и используй.
- На «продолжи» или «ещё» — продолжай с того же места.

СТИЛЬ ОТВЕТА:
- Используй Markdown: **жирный текст**, таблицы, нумерованные и маркированные списки.
- Давай полные, развёрнутые, экспертные ответы. Не будь поверхностным.
- При генерации КСП ОБЯЗАТЕЛЬНО используй таблицу с разделами: Этап урока | Время | Деятельность учителя | Деятельность учащихся | Ресурсы | Оценивание.
- Для СОЧ/СОР обязательно указывай: цели обучения, критерии, дескрипторы, баллы.
- Педагогические советы подкрепляй конкретными примерами и методиками.
- Не давай готовых ответов на закрытые тесты платформы — задавай наводящие вопросы.`;

export async function chatStream(userId, message) {
  // Load last 40 messages from history for better context memory
  const history = db.prepare(`
    SELECT role, content FROM ai_chat_history
    WHERE user_id = ?
    ORDER BY created_at DESC
    LIMIT 40
  `).all(userId).reverse();

  const systemPrompt = SYSTEM_PROMPT;

  const messages = [
    { role: 'system', content: systemPrompt },
    ...history.map(h => ({ role: h.role, content: h.content })),
    { role: 'user', content: message }
  ];

  try {
    const stream = await groq.chat.completions.create({
      messages,
      model: process.env.GROQ_MODEL || 'llama-3.3-70b-versatile',
      temperature: 0.5,
      max_tokens: 4096,
      stream: true
    });

    return stream;
  } catch (err) {
    console.error('Groq API error:', err.message);
    const error = new Error('ИИ-помощник временно недоступен. Попробуйте позже.');
    error.status = 503;
    error.code = 'AI_UNAVAILABLE';
    throw error;
  }
}

export async function generate(prompt) {
  try {
    const completion = await groq.chat.completions.create({
      messages: [
        { role: 'system', content: 'Ты - профессиональный педагогический инструмент. Выводи ответ строго по запросу в Markdown.' },
        { role: 'user', content: prompt }
      ],
      model: process.env.GROQ_MODEL || 'llama-3.3-70b-versatile',
      temperature: 0.7,
      max_tokens: 2500
    });

    return completion.choices[0]?.message?.content || '';
  } catch (err) {
    console.error('Groq Generate error:', err.message);
    const error = new Error('Ошибка генерации.');
    error.status = 503;
    throw error;
  }
}

export function saveChatMessages(userId, userMessage, assistantReply) {
  const saveMessages = db.transaction(() => {
    db.prepare('INSERT INTO ai_chat_history (user_id, role, content) VALUES (?, ?, ?)')
      .run(userId, 'user', userMessage);
    db.prepare('INSERT INTO ai_chat_history (user_id, role, content) VALUES (?, ?, ?)')
      .run(userId, 'assistant', assistantReply);
  });
  saveMessages();
}

export function getChatHistory(userId) {
  return db.prepare(`
    SELECT role, content, created_at FROM ai_chat_history
    WHERE user_id = ?
    ORDER BY created_at ASC
    LIMIT 50
  `).all(userId);
}

export function clearChatHistory(userId) {
  db.prepare('DELETE FROM ai_chat_history WHERE user_id = ?').run(userId);
}
