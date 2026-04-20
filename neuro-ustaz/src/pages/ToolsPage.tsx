import React, { useState } from 'react';
import api from '../lib/api';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import { useI18n } from '../i18n/i18n';
import { useAuth } from '../state/auth';

type Localized = { kk: string; ru: string };

function byLang(lang: 'kk' | 'ru', value: Localized): string {
  return lang === 'kk' ? value.kk : value.ru;
}

const ToolsPage: React.FC = () => {
  const { lang } = useI18n();
  const { isAuthenticated } = useAuth();

  const [activeTab, setActiveTab] = useState<'lesson' | 'behavior'>('lesson');
  const [loading, setLoading] = useState(false);

  /* Lesson constructor state */
  const [lesson, setLesson] = useState({ topic: '', age: '', oop: '', goal: '' });
  const [lessonResult, setLessonResult] = useState<string | null>(null);

  /* Behavior analysis state */
  const [behavior, setBehavior] = useState({ behavior: '', context: '', frequency: '', triggers: '' });
  const [behaviorResult, setBehaviorResult] = useState<string | null>(null);



  const generateLesson = async () => {
    if (!lesson.topic.trim()) return;
    try {
      setLoading(true);
      const prompt = `Создай подробный инклюзивный план урока на тему "${lesson.topic}" для возрастной группы "${lesson.age}". 
      Особенности ООП: "${lesson.oop}". Цель урока: "${lesson.goal}". 
      Используй структуру: Введение, Основная часть (с адаптациями для ООП), Закрепление, Выводы и рекомендации.
      Язык ответа: ${lang === 'kk' ? 'Казахский' : 'Русский'}.`;

      const res = await api.post('/ai/generate', { prompt });
      if (res.data.success) {
        setLessonResult(res.data.text);
      }
    } catch (err) {
      console.error('Failed to generate lesson:', err);
    } finally {
      setLoading(false);
    }
  };

  const generateAnalysis = async () => {
    if (!behavior.behavior.trim()) return;
    try {
      setLoading(true);
      const prompt = `Проведи педагогический анализ поведения. 
      Описание поведения: "${behavior.behavior}". Контекст: "${behavior.context}". Частота: "${behavior.frequency}". Триггеры: "${behavior.triggers}". 
      Предложи гипотезы (сенсорные, коммуникативные и т.д.) и конкретные шаги для педагога (ABC-анализ, стратегии поддержки).
      Язык ответа: ${lang === 'kk' ? 'Казахский' : 'Русский'}.`;

      const res = await api.post('/ai/generate', { prompt });
      if (res.data.success) {
        setBehaviorResult(res.data.text);
      }
    } catch (err) {
      console.error('Failed to analyze behavior:', err);
    } finally {
      setLoading(false);
    }
  };


  const tabs = [
    {
      id: 'lesson' as const,
      icon: 'edit_note',
      label: byLang(lang, { kk: 'Сабақ конструкторы', ru: 'Конструктор уроков' }),
    },
    {
      id: 'behavior' as const,
      icon: 'psychology_alt',
      label: byLang(lang, { kk: 'Мінез‑құлық талдауы', ru: 'Анализ поведения' }),
    },
  ];

  return (
    <div className="min-h-screen bg-[#f8f9fc] text-[#0f172a] font-body">
      <Navbar />

      <main className="pt-28 pb-20 px-6 md:px-8 max-w-7xl mx-auto">
        <div className="mb-12 mt-6 md:mt-10 animate-fade-in text-center md:text-left">
          <div className="inline-block px-3 py-1 bg-[#1e6ae8]/10 text-[#1e6ae8] text-[12px] font-bold tracking-wider rounded-full mb-4 uppercase">
            {lang === 'kk' ? 'Автоматтандыру' : 'Автоматизация'}
          </div>
          <h1 className="text-4xl md:text-[56px] font-bold font-headline text-[#0f172a] mb-4 leading-tight tracking-tight">
            {lang === 'kk' ? 'Педагог құралдары' : 'Инструменты педагога'}
          </h1>
          <p className="text-slate-500 text-[16px] max-w-3xl leading-relaxed mx-auto md:mx-0">
            {lang === 'kk'
              ? 'Сабақ жоспарын дайындаңыз және балалардың мінез-құлқын талдаңыз. Платформа шаблон мен құрылым ұсынады, ал сіз бейімдейсіз.'
              : 'Подготовьте план урока и проанализируйте поведение ребёнка. Платформа предлагает шаблон и структуру, а вы адаптируете.'}
          </p>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-4 mb-10 overflow-x-auto custom-scrollbar pb-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-3 px-8 py-4 rounded-full font-bold transition-all shrink-0 ${
                activeTab === tab.id
                  ? 'bg-[#0f172a] text-white shadow-lg shadow-slate-900/10'
                  : 'bg-white border border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-slate-700'
              }`}
            >
              <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>
                {tab.icon}
              </span>
              <span className="text-[14px]">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Lesson Constructor */}
        {activeTab === 'lesson' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-fade-in">
            <section className="lg:col-span-5 bg-white rounded-[32px] p-8 md:p-10 border border-slate-100 shadow-sm relative overflow-hidden group hover:shadow-lg transition-all">
              <div className="absolute top-0 left-0 w-1 h-full bg-[#1e6ae8]" />
              <div className="flex items-center gap-5 mb-8 relative z-10">
                <div className="w-14 h-14 rounded-[20px] bg-gradient-to-tr from-[#3b82f6] to-[#6366f1] text-white flex items-center justify-center shadow-md shadow-blue-500/20">
                  <span className="material-symbols-outlined text-[28px]">edit_note</span>
                </div>
                <div>
                  <div className="font-bold text-[#0f172a] text-[18px]">
                    {lang === 'kk' ? 'Сабақ деректері' : 'Данные урока'}
                  </div>
                  <div className="text-[13px] text-slate-500 font-medium">
                    {lang === 'kk' ? 'Толтырып, «Жасау» басыңыз' : 'Заполните и нажмите «Создать»'}
                  </div>
                </div>
              </div>

              <div className="space-y-5 relative z-10">
                <div>
                  <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2 block">
                    {lang === 'kk' ? 'Сабақ тақырыбы' : 'Тема урока'}
                  </label>
                  <input
                    className="w-full bg-[#f8f9fc] border border-slate-200 rounded-[16px] px-5 py-3.5 outline-none focus:ring-2 focus:ring-[#1e6ae8] focus:bg-white transition-all text-[#0f172a] font-medium text-[14px]"
                    placeholder={lang === 'kk' ? 'Мысалы: Эмоцияларды тану' : 'Например: Распознавание эмоций'}
                    value={lesson.topic}
                    onChange={(e) => setLesson((p) => ({ ...p, topic: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2 block">
                    {lang === 'kk' ? 'Жас тобы' : 'Возрастная группа'}
                  </label>
                  <input
                    className="w-full bg-[#f8f9fc] border border-slate-200 rounded-[16px] px-5 py-3.5 outline-none focus:ring-2 focus:ring-[#1e6ae8] focus:bg-white transition-all text-[#0f172a] font-medium text-[14px]"
                    placeholder={lang === 'kk' ? 'Мысалы: 7-8 жас, 2 сынып' : 'Например: 7-8 лет, 2 класс'}
                    value={lesson.age}
                    onChange={(e) => setLesson((p) => ({ ...p, age: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2 block">
                    {lang === 'kk' ? 'ЕҚБ ерекшелігі' : 'Особенности ООП'}
                  </label>
                  <input
                    className="w-full bg-[#f8f9fc] border border-slate-200 rounded-[16px] px-5 py-3.5 outline-none focus:ring-2 focus:ring-[#1e6ae8] focus:bg-white transition-all text-[#0f172a] font-medium text-[14px]"
                    placeholder={lang === 'kk' ? 'Мысалы: АСБ, СТЖД, ПДТ' : 'Например: РАС, ОНР, ЗПР'}
                    value={lesson.oop}
                    onChange={(e) => setLesson((p) => ({ ...p, oop: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2 block">
                    {lang === 'kk' ? 'Сабақ мақсаты' : 'Цель урока'}
                  </label>
                  <textarea
                    className="w-full bg-[#f8f9fc] border border-slate-200 rounded-[16px] px-5 py-3.5 outline-none focus:ring-2 focus:ring-[#1e6ae8] focus:bg-white transition-all text-[#0f172a] font-medium text-[14px] min-h-[100px]"
                    placeholder={
                      lang === 'kk'
                        ? 'Мысалы: Оқушы 4 негізгі эмоцияны суреттен тани алады'
                        : 'Например: Ученик научится различать 4 основные эмоции по изображению'
                    }
                    value={lesson.goal}
                    onChange={(e) => setLesson((p) => ({ ...p, goal: e.target.value }))}
                  />
                </div>

                <div className="pt-4">
                  <button
                    type="button"
                    onClick={generateLesson}
                    disabled={!lesson.topic.trim() || loading}
                    className="w-full bg-gradient-to-r from-[#1e6ae8] to-[#4f46e5] text-white py-4 rounded-full font-bold shadow-md shadow-blue-500/20 hover:opacity-95 disabled:opacity-50 transition-all text-[15px] flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        {lang === 'kk' ? 'Дайындалуда...' : 'Создание...'}
                      </>
                    ) : (
                      lang === 'kk' ? 'Жоспар жасау' : 'Создать план'
                    )}
                  </button>
                </div>
              </div>
              
              <div className="absolute -left-20 -bottom-20 w-[300px] h-[300px] bg-[#f0f5ff] rounded-full blur-[80px] pointer-events-none opacity-50" />
            </section>

            <section className="lg:col-span-7 bg-white rounded-[32px] p-8 md:p-10 border border-slate-100 shadow-sm relative overflow-hidden group hover:shadow-lg transition-all flex flex-col">
              <div className="flex items-center justify-between mb-8 relative z-10">
                <div className="font-bold text-[#0f172a] text-[20px] font-headline flex items-center gap-2">
                   <div className="w-8 h-8 rounded-full bg-[#1bb55c]/10 text-[#1bb55c] flex items-center justify-center">
                      <span className="material-symbols-outlined text-[16px]">task_alt</span>
                   </div>
                  {lang === 'kk' ? 'Сабақ жоспары' : 'План урока'}
                </div>
                {lessonResult && (
                  <button
                    type="button"
                    onClick={() => navigator.clipboard.writeText(lessonResult)}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-slate-50 text-slate-600 hover:text-[#1e6ae8] hover:bg-[#f0f5ff] transition-colors text-[13px] font-bold border border-slate-200 hover:border-[#1e6ae8]/30"
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>
                      content_copy
                    </span>
                    {lang === 'kk' ? 'Көшіру' : 'Скопировать'}
                  </button>
                )}
              </div>

              {lessonResult ? (
                <div className="flex-1 bg-[#f8f9fc] rounded-[24px] p-8 border border-slate-100 whitespace-pre-wrap text-slate-700 leading-relaxed text-[15px] font-medium max-h-[650px] overflow-y-auto custom-scrollbar relative z-10 animate-fade-in shadow-inner">
                  {lessonResult}
                </div>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center min-h-[400px] text-slate-400 relative z-10 border-2 border-dashed border-slate-200 rounded-[24px] bg-slate-50/50">
                  <span className="material-symbols-outlined mb-4 opacity-50" style={{ fontSize: '64px' }}>
                    description
                  </span>
                  <p className="font-bold text-[15px] text-slate-500 text-center max-w-xs">
                    {loading 
                      ? (lang === 'kk' ? 'AI жоспарды құрастыруда...' : 'AI составляет план...')
                      : (lang === 'kk' ? 'Деректерді толтырып, «Жоспар жасау» басыңыз' : 'Заполните данные и нажмите «Создать план»')}
                  </p>
                </div>
              )}
            </section>
          </div>
        )}

        {/* Behavior Analysis */}
        {activeTab === 'behavior' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-fade-in">
            <section className="lg:col-span-5 bg-white rounded-[32px] p-8 md:p-10 border border-slate-100 shadow-sm relative overflow-hidden group hover:shadow-lg transition-all">
              <div className="absolute top-0 left-0 w-1 h-full bg-[#f59e0b]" />
              <div className="flex items-center gap-5 mb-8 relative z-10">
                <div className="w-14 h-14 rounded-[20px] bg-gradient-to-tr from-[#f59e0b] to-[#d97706] text-white flex items-center justify-center shadow-md shadow-amber-500/20">
                  <span className="material-symbols-outlined text-[28px]">psychology_alt</span>
                </div>
                <div>
                  <div className="font-bold text-[#0f172a] text-[18px]">
                    {lang === 'kk' ? 'Мінез‑құлық сипаттамасы' : 'Описание поведения'}
                  </div>
                  <div className="text-[13px] text-slate-500 font-medium">
                    {lang === 'kk' ? 'Толтырып, «Талдау» басыңыз' : 'Заполните и нажмите «Анализ»'}
                  </div>
                </div>
              </div>

              <div className="space-y-5 relative z-10">
                <div>
                  <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2 block">
                    {lang === 'kk' ? 'Мінез-құлық' : 'Поведение'}
                  </label>
                  <textarea
                    className="w-full bg-[#f8f9fc] border border-slate-200 rounded-[16px] px-5 py-3.5 outline-none focus:ring-2 focus:ring-[#f59e0b] focus:bg-white transition-all text-[#0f172a] font-medium text-[14px] min-h-[100px]"
                    placeholder={
                      lang === 'kk'
                        ? 'Мысалы: Оқушы сабақ кезінде кенеттен айқайлайды және үстелді ұрады'
                        : 'Например: Ученик внезапно кричит и стучит по столу во время урока'
                    }
                    value={behavior.behavior}
                    onChange={(e) => setBehavior((p) => ({ ...p, behavior: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2 block">
                    {lang === 'kk' ? 'Контекст (қашан/қайда?)' : 'Контекст (когда/где?)'}
                  </label>
                  <input
                    className="w-full bg-[#f8f9fc] border border-slate-200 rounded-[16px] px-5 py-3.5 outline-none focus:ring-2 focus:ring-[#f59e0b] focus:bg-white transition-all text-[#0f172a] font-medium text-[14px]"
                    placeholder={lang === 'kk' ? 'Мысалы: Математика сабағы, сынып' : 'Например: Урок математики, класс'}
                    value={behavior.context}
                    onChange={(e) => setBehavior((p) => ({ ...p, context: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2 block">
                    {lang === 'kk' ? 'Жиілігі' : 'Частота'}
                  </label>
                  <input
                    className="w-full bg-[#f8f9fc] border border-slate-200 rounded-[16px] px-5 py-3.5 outline-none focus:ring-2 focus:ring-[#f59e0b] focus:bg-white transition-all text-[#0f172a] font-medium text-[14px]"
                    placeholder={lang === 'kk' ? 'Мысалы: Күнделікті, сабақта 2-3 рет' : 'Например: Ежедневно, 2-3 раза за урок'}
                    value={behavior.frequency}
                    onChange={(e) => setBehavior((p) => ({ ...p, frequency: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2 block">
                    {lang === 'kk' ? 'Триггерлер (не қоздырады?)' : 'Триггеры (что вызывает?)'}
                  </label>
                  <input
                    className="w-full bg-[#f8f9fc] border border-slate-200 rounded-[16px] px-5 py-3.5 outline-none focus:ring-2 focus:ring-[#f59e0b] focus:bg-white transition-all text-[#0f172a] font-medium text-[14px]"
                    placeholder={lang === 'kk' ? 'Мысалы: Шу, жаңа тапсырма, өзгеріс' : 'Например: Шум, новое задание, изменение'}
                    value={behavior.triggers}
                    onChange={(e) => setBehavior((p) => ({ ...p, triggers: e.target.value }))}
                  />
                </div>

                <div className="pt-4">
                  <button
                    type="button"
                    onClick={generateAnalysis}
                    disabled={!behavior.behavior.trim() || loading}
                    className="w-full bg-gradient-to-r from-[#f59e0b] to-[#ea580c] text-white py-4 rounded-full font-bold shadow-md shadow-amber-500/20 hover:opacity-95 disabled:opacity-50 transition-all text-[15px] flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        {lang === 'kk' ? 'Талдануда...' : 'Анализ...'}
                      </>
                    ) : (
                      lang === 'kk' ? 'Талдау жасау' : 'Анализировать'
                    )}
                  </button>
                </div>
              </div>
              
              <div className="absolute -left-20 -bottom-20 w-[300px] h-[300px] bg-amber-50 rounded-full blur-[80px] pointer-events-none opacity-50" />
            </section>

            <section className="lg:col-span-7 bg-white rounded-[32px] p-8 md:p-10 border border-slate-100 shadow-sm relative overflow-hidden group hover:shadow-lg transition-all flex flex-col">
              <div className="flex items-center justify-between mb-8 relative z-10">
                <div className="font-bold text-[#0f172a] text-[20px] font-headline flex items-center gap-2">
                   <div className="w-8 h-8 rounded-full bg-[#1bb55c]/10 text-[#1bb55c] flex items-center justify-center">
                      <span className="material-symbols-outlined text-[16px]">task_alt</span>
                   </div>
                  {lang === 'kk' ? 'Талдау нәтижесі' : 'Результат анализа'}
                </div>
                {behaviorResult && (
                  <button
                    type="button"
                    onClick={() => navigator.clipboard.writeText(behaviorResult)}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-slate-50 text-slate-600 hover:text-[#f59e0b] hover:bg-amber-50 transition-colors text-[13px] font-bold border border-slate-200 hover:border-amber-200"
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>
                      content_copy
                    </span>
                    {lang === 'kk' ? 'Көшіру' : 'Скопировать'}
                  </button>
                )}
              </div>

              {behaviorResult ? (
                <div className="flex-1 bg-[#f8f9fc] rounded-[24px] p-8 border border-slate-100 whitespace-pre-wrap text-slate-700 leading-relaxed text-[15px] font-medium max-h-[650px] overflow-y-auto custom-scrollbar relative z-10 animate-fade-in shadow-inner">
                  {behaviorResult}
                </div>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center min-h-[400px] text-slate-400 relative z-10 border-2 border-dashed border-slate-200 rounded-[24px] bg-slate-50/50">
                  <span className="material-symbols-outlined mb-4 opacity-50" style={{ fontSize: '64px' }}>
                    psychology_alt
                  </span>
                  <p className="font-bold text-[15px] text-slate-500 text-center max-w-xs">
                    {loading 
                      ? (lang === 'kk' ? 'AI мінез-құлықты талдауда...' : 'AI анализирует поведение...')
                      : (lang === 'kk' ? 'Мінез-құлықты сипаттап, «Талдау жасау» басыңыз' : 'Опишите поведение и нажмите «Анализировать»')}
                  </p>
                </div>
              )}
            </section>
          </div>
        )}

        {/* Info box */}
        <div className="mt-12 rounded-[24px] bg-gradient-to-br from-slate-800 to-slate-900 p-8 border border-slate-700 text-white shadow-xl shadow-slate-900/10 animate-fade-in">
          <div className="flex items-start gap-4">
            <span className="material-symbols-outlined text-[#3b82f6] text-[32px]">info</span>
            <div>
              <div className="font-bold text-[18px] mb-2 font-headline">
                {lang === 'kk' ? 'Маңызды ескерту' : 'Важное примечание'}
              </div>
              <p className="text-[14px] text-slate-300 leading-relaxed font-medium">
                {lang === 'kk'
                  ? 'Бұл құралдар оқу мақсатында. AI ұсынған шаблондар мен талдаулар негіз ретінде қолданылады — оларды нақты жағдайға бейімдеу керек. Маман кеңесін алмастырмайды.'
                  : 'Эти инструменты предназначены для обучения. Шаблоны и анализы, созданные ИИ, используются как основа — их нужно адаптировать под конкретную ситуацию. Не заменяют консультацию специалиста.'}
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ToolsPage;
