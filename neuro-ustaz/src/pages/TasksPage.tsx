import React, { useEffect, useCallback, useMemo, useState } from 'react';

import api from '../lib/api';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import { useI18n } from '../i18n/i18n';
import { useAuth } from '../state/auth';

type Localized = { kk: string; ru: string };

function byLang(lang: 'kk' | 'ru', value: Localized | string): string {
  if (typeof value === 'string') return value;
  return lang === 'kk' ? value.kk : value.ru;
}

const TasksPage: React.FC = () => {
  const { lang } = useI18n();
  const { user, isAuthenticated, fetchProfile } = useAuth();
  const [challenge, setChallenge] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [caseAnswer, setCaseAnswer] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState<any>(null);

  // Fetch daily challenge
  const fetchChallenge = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get('/tasks/today');
      if (res.data) {
        const task = res.data;
        const challengeData = {
           id: task.id,
           isCompleted: task.already_completed,
           type: task.type,
           title: task.type === 'case' ? (lang === 'kk' ? 'Практикалық кейс' : 'Практический кейс') : (lang === 'kk' ? 'Күнделікті тест' : 'Ежедневный тест'),
           description: task.type === 'case' ? task.content.situation : '',
           content: {
              question: task.content.question,
              options: task.content.options?.map((opt: string, i: number) => ({ id: i, text: opt })) || []
           },
           explanation: task.result?.feedback || '',
           correct_answer: task.result ? task.content.correct : undefined
        };
        
        setChallenge(challengeData);
        if (task.already_completed) {
           setSubmitted(true);
           setResult(task.result);
        }
      }
    } catch (err) {
      console.error('Failed to fetch challenge:', err);
    } finally {
      setLoading(false);
    }
  }, [lang]);

  useEffect(() => {
    if (isAuthenticated) fetchChallenge();
  }, [isAuthenticated, fetchChallenge]);

  const submit = async () => {
    if (!challenge) return;
    if (challenge.type === 'test' && selectedOption === null) return;
    if (challenge.type === 'case' && !caseAnswer.trim()) return;

    try {
      const payload = challenge.type === 'test' ? { selected: selectedOption } : { text: caseAnswer };
      const res = await api.post(`/tasks/${challenge.id}/answer`, payload);
      
      if (res.data) {
        setResult(res.data);
        setSubmitted(true);
        fetchProfile();
      }
    } catch (err) {
      console.error('Submission failed:', err);
    }
  };



  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8f9fc] text-[#0f172a] font-body">
        <Navbar />
        <main className="pt-28 pb-20 px-6 md:px-8 max-w-7xl mx-auto flex flex-col items-center justify-center min-h-[60vh]">
          <div className="w-12 h-12 border-4 border-[#1e6ae8] border-t-transparent rounded-full animate-spin mb-4" />
          <p className="text-slate-400 text-sm font-medium animate-pulse">
            {lang === 'kk' ? 'Жүктелуде...' : 'Загрузка...'}
          </p>
        </main>
        <Footer />
      </div>
    );
  }

  const isCompletedToday = challenge?.isCompleted || submitted;

  return (
    <div className="min-h-screen bg-[#f8f9fc] text-[#0f172a] font-body">
      <Navbar />

      <main className="pt-28 pb-20 px-6 md:px-8 max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 mb-12 mt-6 md:mt-10 animate-fade-in">
          <div>
            <h1 className="text-4xl md:text-[56px] font-bold font-headline text-[#0f172a] mb-4 leading-tight tracking-tight">
              {lang === 'kk' ? 'Күнделікті тапсырма' : 'Ежедневное задание'}
            </h1>
            <p className="text-slate-500 text-[16px] max-w-2xl leading-relaxed">
              {lang === 'kk'
                ? 'Бұл бөлім сіздің педагогикалық ойлауыңызды дамытады: кейс → шешім → талдау.'
                : 'Этот раздел развивает профессиональное мышление: кейс → решение → анализ.'}
            </p>
          </div>

          <div className="flex flex-wrap gap-4">
            <div className="px-6 py-4 rounded-[24px] bg-white border border-slate-100 shadow-sm flex flex-col justify-center min-w-[120px]">
              <div className="text-[11px] uppercase tracking-wider text-slate-400 font-bold mb-1">
                {lang === 'kk' ? 'Ұпай' : 'Баллы'}
              </div>
              <div className="text-[28px] font-black text-[#1e6ae8] leading-none">{user?.points || 0}</div>
            </div>
            <div className="px-6 py-4 rounded-[24px] bg-white border border-slate-100 shadow-sm flex flex-col justify-center min-w-[120px]">
              <div className="text-[11px] uppercase tracking-wider text-slate-400 font-bold mb-1">
                {lang === 'kk' ? 'Деңгей' : 'Уровень'}
              </div>
              <div className="text-[16px] font-bold text-[#0f172a]">
                {user?.level === 'expert' 
                  ? (lang === 'kk' ? 'Сарапшы' : 'Эксперт') 
                  : user?.level === 'teacher' 
                    ? (lang === 'kk' ? 'Педагог' : 'Педагог') 
                    : (lang === 'kk' ? 'Студент' : 'Студент')}
              </div>
            </div>
          </div>
        </div>

        {!challenge ? (
          <div className="text-center py-20 bg-white rounded-[32px] border border-slate-100">
            <span className="material-symbols-outlined text-4xl text-slate-300 mb-4">event_busy</span>
            <p className="text-slate-500">{lang === 'kk' ? 'Бүгінге тапсырмалар жоқ' : 'На сегодня заданий нет'}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-1 gap-8">
            <section className="bg-white rounded-[32px] p-8 md:p-10 border border-slate-100 shadow-sm relative overflow-hidden group hover:shadow-lg transition-all">
              <div className="flex items-start justify-between gap-6 relative z-10">
                <div>
                  <div className="inline-block px-3 py-1 bg-[#f0f5ff] text-[#1e6ae8] text-[11px] font-bold tracking-wide rounded-full mb-4 uppercase">
                    {challenge.type === 'case' 
                      ? (lang === 'kk' ? 'Кейс' : 'Кейс') 
                      : (lang === 'kk' ? 'Тест' : 'Тест')}
                  </div>
                  <h2 className="text-2xl md:text-[28px] font-bold font-headline text-[#0f172a] leading-tight">
                    {byLang(lang, challenge.title)}
                  </h2>
                </div>
                <div className="px-4 py-2 rounded-full bg-slate-50 text-slate-400 text-[12px] font-bold border border-slate-200">
                  {new Date().toLocaleDateString()}
                </div>
              </div>

              <p className="mt-6 text-slate-600 leading-relaxed text-[15px] relative z-10">
                {byLang(lang, challenge.content?.scenario || challenge.description)}
              </p>

              <div className="mt-8 relative z-10">
                <div className="font-bold text-[#0f172a] mb-5 text-[16px]">
                  {byLang(lang, challenge.content?.question || (lang === 'kk' ? 'Дұрыс жауапты таңдаңыз:' : 'Выберите верный ответ:'))}
                </div>
                <div className="space-y-4">
                  {challenge.type === 'case' ? (
                     <textarea
                        className="w-full bg-white/40 border border-slate-200 rounded-[20px] p-5 text-slate-600 focus:ring-[#1e6ae8] focus:border-[#1e6ae8] outline-none resize-none"
                        rows={5}
                        placeholder={lang === 'kk' ? 'Сіздің шешіміңіз...' : 'Ваше решение...'}
                        value={caseAnswer}
                        onChange={(e) => setCaseAnswer(e.target.value)}
                        disabled={isCompletedToday}
                     />
                  ) : (
                    (challenge.content?.options || []).map((opt: any) => (
                      <label
                        key={opt.id}
                        className={`flex items-start gap-4 p-5 rounded-[20px] border transition-all cursor-pointer ${
                          selectedOption === opt.id
                            ? 'border-[#1e6ae8] bg-[#f0f5ff] text-[#0f172a]'
                            : 'border-slate-200 bg-white/40 hover:bg-[#f8f9fc] text-slate-600'
                        } ${submitted && (opt.id === challenge.correct_answer || (result?.is_correct && selectedOption === opt.id)) ? 'border-green-500 bg-green-50' : ''}`}
                      >
                        <input
                          type="radio"
                          name="challenge"
                          className="mt-1 w-4 h-4 text-[#1e6ae8] border-slate-300 focus:ring-[#1e6ae8]"
                          checked={selectedOption === opt.id}
                          onChange={() => setSelectedOption(opt.id)}
                          disabled={isCompletedToday}
                        />
                        <span className="text-[14px] leading-relaxed font-medium">{byLang(lang, opt.text || opt)}</span>
                      </label>
                    ))
                  )}
                </div>

                <div className="mt-8 flex flex-wrap gap-4">
                  {!isCompletedToday && (
                    <button
                      type="button"
                      className="bg-gradient-to-r from-[#3b82f6] to-[#4f46e5] text-white px-8 py-3.5 rounded-full font-bold text-[14px] shadow-md shadow-blue-500/20 hover:opacity-95 disabled:opacity-50 transition-all hover:-translate-y-0.5 active:translate-y-0"
                      disabled={challenge.type === 'test' ? (selectedOption === null || submitted) : (!caseAnswer.trim() || submitted)}
                      onClick={submit}
                    >
                      {lang === 'kk' ? 'Жауапты бекіту' : 'Ответить'}
                    </button>
                  )}
                </div>

                {submitted && (
                  <div className="mt-8 rounded-[24px] bg-[#f8f9fc] p-8 border border-slate-100 animate-fade-in relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-1 h-full bg-[#1e6ae8]" />
                    <div className="flex items-center gap-2 mb-3">
                       <span className={`material-symbols-outlined ${result?.is_correct || challenge.isCompleted ? 'text-green-500' : 'text-red-500'}`}>
                          {result?.is_correct || challenge.isCompleted ? 'check_circle' : 'cancel'}
                       </span>
                       <div className="text-[13px] font-bold text-[#1e6ae8] uppercase tracking-wide">
                        {lang === 'kk' ? 'Нәтиже' : 'Результат'}
                      </div>
                    </div>
                    
                    <p className="text-slate-600 leading-relaxed text-[14px] mb-5">
                      {result?.feedback || challenge.explanation}
                    </p>
                    
                    {challenge.explanation && (
                      <div className="pt-4 border-t border-slate-200/60">
                        <span className="text-[13px] font-bold text-[#0f172a] uppercase tracking-wide mr-2">
                           {lang === 'kk' ? 'Түсіндірме:' : 'Пояснение:'}
                        </span>
                        <p className="text-slate-500 text-[14px] mt-2 italic">{byLang(lang, challenge.explanation)}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
              
              <div className="absolute -right-20 -bottom-20 w-[400px] h-[400px] bg-[#f0f5ff] rounded-full blur-[80px] pointer-events-none opacity-50" />
            </section>
          </div>
        )}

        {isCompletedToday && (
          <div className="mt-10 rounded-[32px] bg-gradient-to-r from-[#16a34a] to-[#047857] text-white p-8 md:p-10 border border-green-400 overflow-hidden relative shadow-lg shadow-green-500/20 animate-fade-in flex flex-col md:flex-row items-center gap-6">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-md shrink-0">
               <span className="material-symbols-outlined text-[36px] text-white">emoji_events</span>
            </div>
            <div>
               <div className="font-headline font-black text-2xl mb-2">{lang === 'kk' ? 'Жарайсыз, тапсырма орындалды!' : 'Отлично, задание выполнено!'}</div>
               <div className="text-[15px] text-green-100 font-medium">
                 {lang === 'kk'
                   ? 'Платформа ойлауды алмастырмайды — оны дамытады. Ертең жаңа тапсырма болады.'
                   : 'Платформа не заменяет мышление — она развивает его. Завтра будет новое задание.'}
               </div>
            </div>
            <div className="absolute right-0 top-0 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default TasksPage;
