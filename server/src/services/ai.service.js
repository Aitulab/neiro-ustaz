import Groq from 'groq-sdk';
import db from '../db/index.js';

if (!process.env.GROQ_API_KEY) {
  console.error('⚠️ WARNING: GROQ_API_KEY is not set in environment variables!');
}

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

const SYSTEM_PROMPT = `Ты — NeiroUstaz, экспертный педагогический ИИ-помощник для учителей и студентов Казахстана. Твоя цель — помогать в разработке учебных материалов и решении педагогических кейсов.

ОСНОВНЫЕ КОМПЕТЕНЦИИ:
- КСП/ССП: Создание планов уроков по ГОСО РК. Всегда используй таблицы Markdown для КСП.
- СОЧ/СОР: Разработка заданий с критериями, дескрипторами и схемами баллов.
- Инклюзия: Глубокие знания по адаптации материалов для детей с ООП (РАС, ЗПР, ОНР и др.) согласно законодательству РК.
- Профессиональный стиль: Экспертные, развернутые и методически обоснованные ответы.

СТРОГОЕ ПРАВИЛО ЯЗЫКА:
1. Пиши ТОЛЬКО на том языке, на котором к тебе обратился пользователь:
   - Если вопрос на КАЗАХСКОМ (Қазақша) -> отвечай СТРОГО на казахском.
   - Если вопрос на РУССКОМ -> отвечай СТРОГО на русском.
2. Никогда не смешивай языки в одном ответе, если об этом не просили.

ФОРМАТИРОВАНИЕ:
- Используй Markdown для структурности (заголовки, списки, таблицы).
- КСП выводи в таблице: Этап | Время | Действие учителя | Действие учащихся | Ресурсы | Оценивание.
- При упоминании диагнозов (РАС, ЗПР) используй актуальную терминологию.`;


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
      model: process.env.GROQ_MODEL || 'llama-3.1-8b-instant',
      temperature: 0.5,
      max_tokens: 4096,
      stream: true
    });

    return stream;
  } catch (err) {
    console.error('❌ Groq API Error:', {
      message: err.message,
      status: err.status,
      name: err.name
    });

    if (err.status === 429) {
      const error = new Error('Лимит запросов к ИИ исчерпан. Пожалуйста, подождите минуту.');
      error.status = 429;
      error.code = 'AI_RATE_LIMIT';
      throw error;
    }

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
    console.error('❌ Groq Generate Error:', err.message, '| Status:', err.status);
    
    if (err.status === 429) {
      const error = new Error('Лимит генерации исчерпан.');
      error.status = 429;
      throw error;
    }

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
