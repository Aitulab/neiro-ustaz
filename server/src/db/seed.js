import db from './index.js';

const achievements = [
  {
    code: 'first_task',
    title_ru: 'Первый шаг',
    title_kz: 'Алғашқы қадам',
    description_ru: 'Выполнено первое ежедневное задание',
    description_kz: 'Алғашқы күнделікті тапсырма орындалды',
    points: 10
  },
  {
    code: 'streak_3',
    title_ru: 'Тройной удар',
    title_kz: 'Үштік соққы',
    description_ru: 'Выполняйте задания 3 дня подряд',
    description_kz: 'Тапсырмаларды қатарынан 3 күн орындаңыз',
    points: 30
  },
  {
    code: 'community_first',
    title_ru: 'Голос учителя',
    title_kz: 'Ұстаз үні',
    description_ru: 'Опубликован первый пост в сообществе',
    description_kz: 'Қауымдастықта алғашқы жазба жарияланды',
    points: 15
  },
  {
    code: 'ai_explorer',
    title_ru: 'Исследователь ИИ',
    title_kz: 'ЖИ Зерттеушісі',
    description_ru: 'Задано более 10 вопросов ИИ-помощнику',
    description_kz: 'ЖИ-көмекшіге 10-нан астам сұрақ қойылды',
    points: 20
  }
];

const seed = () => {
  console.log('🌱 Seeding database...');

  const insertAchievement = db.prepare(`
    INSERT OR IGNORE INTO achievements (code, title_ru, title_kz, description_ru, description_kz, points)
    VALUES (?, ?, ?, ?, ?, ?)
  `);

  for (const a of achievements) {
    insertAchievement.run(a.code, a.title_ru, a.title_kz, a.description_ru, a.description_kz, a.points);
  }

  console.log('✅ Seeding completed');
};

seed();
