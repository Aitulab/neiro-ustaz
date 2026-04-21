import Groq from 'groq-sdk';
import db from '../db/index.js';
import { addPoints } from './user.service.js';
import { checkAchievements, getStreak } from './achievements.service.js';

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

const TASK_GEN_PROMPT_RU = `Ты генерируешь ежедневные задания для студентов педагогических специальностей по инклюзивному образованию.

Сгенерируй одно задание. Случайно выбери тип: "test" или "case".

Для типа "test" верни JSON:
{
  "type": "test",
  "question": "вопрос",
  "options": ["вариант1", "вариант2", "вариант3", "вариант4"],
  "correct": 0,
  "explanation": "объяснение правильного ответа"
}

Для типа "case" верни JSON:
{
  "type": "case",
  "situation": "описание педагогической ситуации",
  "question": "вопрос к ситуации",
  "hints": ["подсказка1", "подсказка2"],
  "ideal_answer": "идеальный ответ",
  "criteria": ["критерий1", "критерий2", "критерий3"]
}

Темы: РАС (аутизм), ЗПР, ОНР, инклюзивный класс, адаптация учебного материала, коррекционная педагогика, работа с родителями особых детей.

ВАЖНО: Верни ТОЛЬКО валидный JSON, без markdown, без пояснений.`;

const TASK_GEN_PROMPT_KZ = `Сен инклюзивті білім беру бойынша педагогика мамандығының студенттеріне арналған күнделікті тапсырмаларды генерациялайтын AI-көмекшісің.

Бір тапсырма жаса. Кездейсоқ түрін таңда: "test" немесе "case".

Мәтіндерді орыс тілінен тікелей аудармай, сауатты, табиғи әрі кәсіби педагогикалық қазақ тілінде жаз. 
Мысалы: медициналық терминдер үшін орысша аббревиатураларды қолданба, "ЗПР" орнына "ПДТ" (Психикалық дамудың тежелуі), "ОНР" орнына "СТЖД" (Сөйлеу тілінің жалпы дамымауы), ал "РАС" орнына "АСБ" (Аутизм спектрінің бұзылуы) деп қолдан.

"test" түрі үшін JSON қайтар:
{
  "type": "test",
  "question": "сұрақ",
  "options": ["нұсқа1", "нұсқа2", "нұсқа3", "нұсқа4"],
  "correct": 0,
  "explanation": "дұрыс жауаптың түсіндірмесі"
}

"case" түрі үшін JSON қайтар:
{
  "type": "case",
  "situation": "педагогикалық жағдайдың сауатты қазақша сипаттамасы",
  "question": "жағдайға сұрақ",
  "hints": ["кеңес1", "кеңес2"],
  "ideal_answer": "тамаша толық жауап",
  "criteria": ["критерий1", "критерий2", "критерий3"]
}

Тақырыптар: АСБ, ПДТ, СТЖД, инклюзивті сынып, оқу материалын бейімдеу, коррекциялық педагогика, сенсорлық ерекшеліктер.

МАҢЫЗДЫ: ТЕК валидті JSON қайтар, markdown жоқ, ешқандай қосымша түсіндірме жазба. Барлық мәтін ЖОҒАРЫ ДЕҢГЕЙЛІ ҚАЗАҚ ТІЛІНДЕ болуы шарт.`;

async function generateTask(lang = 'ru', retryCount = 0) {
  const prompt = lang === 'kz' ? TASK_GEN_PROMPT_KZ : TASK_GEN_PROMPT_RU;

  try {
    const completion = await groq.chat.completions.create({
      messages: [
        { role: 'system', content: prompt },
        { role: 'user', content: lang === 'kz' ? 'Жаңа тапсырма жаса' : 'Сгенерируй новое задание' }
      ],
      model: process.env.GROQ_MODEL || 'llama-3.3-70b-versatile',
      temperature: 0.7, // Lower temperature for more consistent JSON
      max_tokens: 1024
    });

    const raw = completion.choices[0]?.message?.content || '';

    // Try to extract JSON from response
    const jsonMatch = raw.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      if (retryCount < 2) return generateTask(lang, retryCount + 1);
      throw new Error('Failed to parse task JSON from AI');
    }

    return JSON.parse(jsonMatch[0]);
  } catch (err) {
    if (retryCount < 2) return generateTask(lang, retryCount + 1);
    throw err;
  }
}


export async function getTodayTask(userId, lang = 'ru') {
  const today = new Date().toISOString().split('T')[0];

  // Check if task already exists for this user today
  let task = db.prepare(`
    SELECT * FROM tasks WHERE user_id = ? AND date = ?
  `).get(userId, today);

  if (task) {
    // Check if already completed
    const result = db.prepare(`
      SELECT * FROM task_results WHERE user_id = ? AND task_id = ?
    `).get(userId, task.id);

    const content = JSON.parse(lang === 'kz' ? task.content_kz : task.content_ru);

    // Hide correct answer if not completed
    if (!result && content.correct !== undefined) {
      const { correct, explanation, ideal_answer, ...safeContent } = content;
      return {
        id: task.id,
        type: content.type,
        content: safeContent,
        points_reward: task.points_reward,
        already_completed: false
      };
    }

    return {
      id: task.id,
      type: content.type,
      content,
      points_reward: task.points_reward,
      already_completed: !!result,
      result: result ? {
        is_correct: !!result.is_correct,
        points: result.points,
        feedback: lang === 'kz' ? result.feedback_kz : result.feedback_ru
      } : undefined
    };
  }

  // Generate new task
  try {
    const contentRu = await generateTask('ru');
    const contentKz = await generateTask('kz');

    const pointsReward = contentRu.type === 'case' ? 15 : 10;

    const insertResult = db.prepare(`
      INSERT INTO tasks (user_id, type, content_ru, content_kz, points_reward, date)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(userId, contentRu.type, JSON.stringify(contentRu), JSON.stringify(contentKz), pointsReward, today);

    const { correct, explanation, ideal_answer, ...safeContent } = contentRu;
    const content = lang === 'kz' ? contentKz : safeContent;

    // Also hide correct answer for KZ
    if (lang === 'kz') {
      const { correct: _, explanation: __, ideal_answer: ___, ...safeKz } = contentKz;
      return {
        id: insertResult.lastInsertRowid,
        type: contentRu.type,
        content: safeKz,
        points_reward: pointsReward,
        already_completed: false
      };
    }

    return {
      id: insertResult.lastInsertRowid,
      type: contentRu.type,
      content: safeContent,
      points_reward: pointsReward,
      already_completed: false
    };
  } catch (err) {
    console.error('Task generation error:', err.message);
    const error = new Error('Не удалось сгенерировать задание. Попробуйте позже.');
    error.status = 503;
    error.code = 'TASK_GEN_FAILED';
    throw error;
  }
}

export async function answerTask(userId, taskId, answer, lang = 'ru') {
  const task = db.prepare('SELECT * FROM tasks WHERE id = ?').get(taskId);
  if (!task) {
    const err = new Error('Задание не найдено');
    err.status = 404;
    err.code = 'TASK_NOT_FOUND';
    throw err;
  }

  // Check if already answered
  const existing = db.prepare('SELECT id FROM task_results WHERE user_id = ? AND task_id = ?').get(userId, taskId);
  if (existing) {
    const err = new Error('Задание уже выполнено');
    err.status = 400;
    err.code = 'TASK_ALREADY_COMPLETED';
    throw err;
  }

  const content = JSON.parse(task.content_ru);
  let isCorrect = 0;
  let points = 0;
  let feedbackRu = '';
  let feedbackKz = '';

  if (content.type === 'test') {
    // Simple comparison
    isCorrect = answer.selected === content.correct ? 1 : 0;
    points = isCorrect ? task.points_reward : 0;
    feedbackRu = isCorrect
      ? `Верно! ${content.explanation || ''}`
      : `Неверно. Правильный ответ: ${content.options[content.correct]}. ${content.explanation || ''}`;
    feedbackKz = isCorrect ? 'Дұрыс!' : 'Қате.';
  } else if (content.type === 'case') {
    // Send to Groq for evaluation
    try {
      const evalPrompt = `Оцени ответ студента на педагогический кейс.

Ситуация: ${content.situation}
Вопрос: ${content.question}
Критерии оценки: ${content.criteria?.join(', ')}
Идеальный ответ: ${content.ideal_answer || 'Не указан'}

Ответ студента: "${answer.text}"

Оцени ответ по критериям. Ответь JSON:
{
  "is_correct": true/false,
  "score": 0-100,
  "feedback_ru": "обратная связь на русском",
  "feedback_kz": "обратная связь на казахском"
}

Верни ТОЛЬКО JSON.`;

      const completion = await groq.chat.completions.create({
        messages: [
          { role: 'system', content: 'Ты — оценщик педагогических ответов. Отвечай только валидным JSON.' },
          { role: 'user', content: evalPrompt }
        ],
        model: process.env.GROQ_MODEL || 'llama-3.3-70b-versatile',
        temperature: 0.3,
        max_tokens: 512
      });

      const raw = completion.choices[0]?.message?.content || '';
      const jsonMatch = raw.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const evaluation = JSON.parse(jsonMatch[0]);
        isCorrect = evaluation.is_correct ? 1 : 0;
        points = isCorrect ? task.points_reward : Math.floor(task.points_reward * 0.5); // partial credit for cases
        feedbackRu = evaluation.feedback_ru || '';
        feedbackKz = evaluation.feedback_kz || '';
      }
    } catch (err) {
      console.error('Case evaluation error:', err.message);
      // Give benefit of doubt
      isCorrect = 1;
      points = task.points_reward;
      feedbackRu = 'Спасибо за ответ! ИИ-оценка временно недоступна, баллы начислены.';
      feedbackKz = 'Жауапты үшін рахмет! ЖИ-бағалау уақытша қолжетімсіз, ұпайлар есептелді.';
    }
  }

  // Bonus points for streak (+5)
  let streakBonus = 0;
  if (isCorrect) {
    const currentStreak = getStreak(userId);
    if (currentStreak >= 1) { // If they had at least one task yesterday/today
      streakBonus = 5;
      points += streakBonus;
      feedbackRu += ` +5 баллов за серию! 🔥`;
      feedbackKz += ` +5 ұпай серия үшін! 🔥`;
    }
  }

  // Save result in transaction
  const totalPoints = db.transaction(() => {
    db.prepare(`
      INSERT INTO task_results (user_id, task_id, answer, is_correct, points, feedback_ru, feedback_kz)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(userId, taskId, JSON.stringify(answer), isCorrect, points, feedbackRu, feedbackKz);

    if (points > 0) {
      return addPoints(userId, points);
    }
    return db.prepare('SELECT points FROM users WHERE id = ?').get(userId).points;
  })();

  // Check achievements (async, don't block response)
  checkAchievements(userId).catch(err => console.error('Achievement check failed:', err.message));

  return {
    is_correct: !!isCorrect,
    points_earned: points,
    feedback: lang === 'kz' ? feedbackKz : feedbackRu,
    total_points: totalPoints,
    new_achievement: null // populated by checkAchievements
  };
}
