import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import { useI18n } from '../i18n/i18n';
import { useAuth } from '../state/auth';

type Localized = { kk: string; ru: string };

function byLang(lang: 'kk' | 'ru', value: Localized): string {
  return lang === 'kk' ? value.kk : value.ru;
}

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { lang } = useI18n();
  const { isAuthenticated } = useAuth();
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const goStart = () => {
    navigate(isAuthenticated ? '/tasks' : '/auth?from=/tasks');
  };
  const goLogin = () => {
    navigate(isAuthenticated ? '/assistant' : '/auth?from=/assistant');
  };

  const features = useMemo(
    () => [
      {
        icon: 'psychology',
        title: { kk: 'AI генерациясы', ru: 'AI генерация' },
        desc: {
          kk: 'Күрделі тапсырмаларды бірнеше секунд ішінде генерациялау мүмкіндігі.',
          ru: 'Возможность генерации сложных задач за считанные секунды.',
        },
      },
      {
        icon: 'grid_view',
        title: { kk: 'Ыңғайлы интерфейс', ru: 'Удобный интерфейс' },
        desc: {
          kk: 'Интуитивті және түсінікті интерфейс арқылы жылдам нәтижеге қол жеткізіңіз.',
          ru: 'Быстрый результат через интуитивно понятный интерфейс.',
        },
      },
      {
        icon: 'school',
        title: { kk: 'Студенттерге арналған', ru: 'Для студентов' },
        desc: {
          kk: 'Болашақ ұстаздар мен педагогикалық мамандықтағы студенттерге арнайы әзірленген.',
          ru: 'Специально разработано для будущих преподавателей и студентов педагогических специальностей.',
        },
      },
      {
        icon: 'schedule',
        title: { kk: 'Уақыт үнемдеу', ru: 'Экономия времени' },
        desc: {
          kk: 'Құжаттама мен материалдарды дайындауға кететін уақытты 90%-ға азайтыңыз.',
          ru: 'Сократите время на подготовку документации и материалов на 90%.',
        },
      },
      {
        icon: 'cloud',
        title: { kk: 'Онлайн қолжетімділік', ru: 'Онлайн доступность' },
        desc: {
          kk: 'Кез келген жерден, кез келген уақытта материалдарыңызға қол жеткізіңіз.',
          ru: 'Доступ к материалам из любого места и в любое время.',
        },
      },
      {
        icon: 'speed',
        title: { kk: 'Жылдам нәтиже', ru: 'Быстрый результат' },
        desc: {
          kk: 'Нейрондық желінің көмегімен сапалы материалдарды лезде алыңыз.',
          ru: 'Мгновенно получайте качественные материалы с помощью нейронной сети.',
        },
      },
    ],
    [],
  );

  const stats = useMemo(
    () => [
      { value: '10+', label: { kk: 'Белсенді қолданушылар', ru: 'Активных пользователей' } },
      { value: '50+', label: { kk: 'Дайын материалдар', ru: 'Готовых материалов' } },
      { value: '24/7', label: { kk: 'Тұрақты қолжетімділік', ru: 'Постоянная доступность' } },
      { value: '95%', label: { kk: 'Қанағаттану көрсеткіші', ru: 'Уровень удовлетворенности' } },
    ],
    [],
  );

  const faqs = useMemo(
    () => [
      {
        q: { kk: 'Жасанды интеллект қалай жұмыс істейді?', ru: 'Как работает искусственный интеллект?' },
        a: {
          kk: 'Нейрондық желі сіздің сұранысыңызды талдап, мемлекеттік стандарттарға сәйкес келетін академиялық жауап немесе сабақ жоспарын генерациялайды.',
          ru: 'Нейронная сеть анализирует ваш запрос и генерирует академический ответ или план урока в соответствии с государственными стандартами.',
        },
      },
      {
        q: { kk: 'Тегін бе?', ru: 'Это бесплатно?' },
        a: {
          kk: 'Иә, платформаның негізгі мүмкіндіктері студенттер үшін толығымен тегін.',
          ru: 'Да, основные функции платформы полностью бесплатны для студентов.',
        },
      },
      {
        q: { kk: 'КСП қалай жасауға болады?', ru: 'Как сделать КСП?' },
        a: {
          kk: 'AI көмекшісіне тақырып, сынып және мақсатты жазсаңыз жеткілікті. Ол сізге 10 секунд ішінде дайын жоспар береді.',
          ru: 'Достаточно написать AI-помощнику тему, класс и цель. Он выдаст готовый план за 10 секунд.',
        },
      },
    ],
    [],
  );

  return (
    <div className="min-h-screen bg-[#f8f9fc] text-[#0f172a] antialiased font-body">
      <Navbar />

      <main className="pt-28 pb-0">
        {/* ═══════════ HERO ═══════════ */}
        <section className="relative px-6 md:px-8 py-10 lg:py-16 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            
            {/* Left text */}
            <div className="relative z-10 animate-fade-in">
              <span className="inline-block px-4 py-1.5 mb-6 text-[12px] font-bold tracking-wide text-[#1e6ae8] bg-[#e2ecf8] rounded-full">
                {lang === 'kk' ? 'AI платформа студенттерге' : 'AI платформа для студентов'}
              </span>

              <h1 className="text-5xl lg:text-[64px] font-bold font-headline leading-[1.05] tracking-tight mb-6">
                 <span className="bg-gradient-to-r from-[#4DA6FF] to-[#4C1D95] bg-clip-text text-transparent uppercase tracking-wide">
                    Neiro Ustaz 
                 </span>
                 <span className="text-black">
                    {' '}{lang === 'kk' ? '—' : '—'}
                 </span>
                 <br />
                 <span className="text-[#1e293b]">
                   {lang === 'kk' ? 'сіздің цифрлық көмекшіңіз' : 'ваш цифровой помощник'}
                 </span>
              </h1>

              <p className="text-[16px] text-slate-500 mb-8 max-w-md leading-relaxed">
                {lang === 'kk'
                  ? 'СОР, СОЧ, КСП және оқу материалдарын нейрожүйе арқылы бірнеше секундта жасаңыз.'
                  : 'Создавайте СОР, СОЧ, КСП и учебные материалы с помощью нейросети за несколько секунд.'}
              </p>

              <div className="space-y-4 mb-10">
                {[
                  { kk: 'Уақытты үнемдеу', ru: 'Экономия времени' },
                  { kk: 'Дайын оқу шешімдері', ru: 'Готовые учебные решения' },
                  { kk: 'Практика мен оқуда көмек', ru: 'Помощь в практике и учебе' },
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-[#d8e8fc] flex items-center justify-center">
                       <span className="material-symbols-outlined text-[#1e6ae8] text-[14px] font-bold">check</span>
                    </div>
                    <span className="text-[#0f172a] text-[15px] font-medium">{byLang(lang, item)}</span>
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap gap-4 items-center mb-8">
                <button
                  type="button"
                  onClick={goStart}
                  className="bg-gradient-to-r from-[#3b82f6] to-[#4f46e5] px-10 py-3.5 rounded-full text-white font-semibold text-[15px] hover:shadow-lg hover:shadow-blue-500/30 transition-all hover:scale-105 active:scale-95"
                >
                  {isAuthenticated 
                    ? (lang === 'kk' ? 'Менің тапсырмаларым' : 'Мои задания')
                    : (lang === 'kk' ? 'Тіркелу' : 'Регистрация')
                  }
                </button>
                <button
                  type="button"
                  onClick={goLogin}
                  className="bg-[#dce9fa] text-[#334155] px-10 py-3.5 rounded-full font-semibold text-[15px] hover:bg-[#c9def7] transition-all hover:scale-105 active:scale-95"
                >
                  {isAuthenticated
                    ? (lang === 'kk' ? 'AI-көмекші' : 'AI-помощник')
                    : (lang === 'kk' ? 'Кіру' : 'Войти')
                  }
                </button>
              </div>

              {/* Avatars */}
              <div className="flex items-center gap-3">
                <div className="flex -space-x-3">
                   <img src="https://i.pravatar.cc/100?img=1" alt="Student" className="w-10 h-10 rounded-full border-2 border-[#f8f9fc] object-cover" />
                   <img src="https://i.pravatar.cc/100?img=3" alt="Student" className="w-10 h-10 rounded-full border-2 border-[#f8f9fc] object-cover" />
                   <img src="https://i.pravatar.cc/100?img=5" alt="Student" className="w-10 h-10 rounded-full border-2 border-[#f8f9fc] object-cover" />
                </div>
                <p className="text-[13px] text-slate-500 font-medium">
                  {lang === 'kk' ? 'Платформаға алғашқылардың бірі болып қосылыңыз' : 'Станьте одним из первых пользователей платформы'}
                </p>
              </div>
            </div>

            {/* Right Hero visual */}
            <div className="relative flex justify-center lg:justify-end animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <div className="relative w-full max-w-[480px]">
                 <img 
                   src="/assets/hero_students.png" 
                   alt="Students working" 
                   className="w-full rounded-[40px] shadow-2xl object-cover h-[560px]"
                 />
              </div>
            </div>

          </div>
        </section>

        {/* ═══════════ STATS ═══════════ */}
        <section className="bg-[#f4f7fa] py-16 mt-16 px-6 md:px-8 border-y border-[#e2e8f0]">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row flex-wrap justify-between gap-8 md:gap-12">
            {stats.map((s, idx) => (
              <div key={idx} className="text-center flex-1">
                <p className="text-4xl md:text-[44px] font-bold text-[#1e6ae8] mb-2">{s.value}</p>
                <p className="text-slate-600 text-[14px] font-medium">{byLang(lang, s.label)}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ═══════════ INNOVATION FEATURES ═══════════ */}
        <section className="px-6 md:px-8 py-24 max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-[42px] font-bold font-headline mb-4 text-[#0f172a]">
              {lang === 'kk' ? 'Инновациялық мүмкіндіктер' : 'Инновационные возможности'}
            </h2>
            <p className="text-slate-500 text-[15px] max-w-2xl mx-auto">
              {lang === 'kk'
                ? 'Педагогикалық жұмысыңызды жеңілдетуге арналған барлық қажетті құралдар бір платформада.'
                : 'Все необходимые инструменты для облегчения вашей педагогической работы на одной платформе.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <div
                key={i}
                className="bg-white rounded-[32px] p-8 md:p-10 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-slate-100"
              >
                <div className="w-12 h-12 bg-[#e6f0fd] rounded-full flex items-center justify-center mb-6">
                  <span className="material-symbols-outlined text-[#1e6ae8] text-[24px]">{f.icon}</span>
                </div>
                <h3 className="text-[19px] font-bold font-headline mb-3 text-[#0f172a]">
                  {byLang(lang, f.title)}
                </h3>
                <p className="leading-relaxed text-[14px] text-slate-500">
                  {byLang(lang, f.desc)}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ═══════════ FAQ ═══════════ */}
        <section className="bg-[#f4f7fa] py-24">
           <div className="max-w-4xl mx-auto px-6 md:px-8 text-center">
             <h2 className="text-3xl md:text-4xl lg:text-[42px] font-bold font-headline mb-4 text-[#0f172a]">
               {lang === 'kk' ? 'Жиі қойылатын сұрақтар' : 'Часто задаваемые вопросы'}
             </h2>
             <p className="text-slate-500 text-[15px] mb-12">
               {lang === 'kk' ? 'Платформа туралы көкейіңіздегі сұрақтарға жауап табыңыз.' : 'Найдите ответы на интересующие вас вопросы о платформе.'}
             </p>

             <div className="space-y-4 text-left">
               {faqs.map((faq, i) => {
                 const isOpen = openFaq === i;
                 return (
                   <div
                     key={i}
                     className="bg-white rounded-[24px] shadow-sm hover:shadow-md transition-all overflow-hidden border border-slate-100"
                   >
                     <button
                       type="button"
                       onClick={() => setOpenFaq(isOpen ? null : i)}
                       className="w-full flex items-center justify-between p-6 md:px-8 py-6 text-left"
                     >
                       <span className="font-bold text-[#0f172a] text-[16px] pr-4">{byLang(lang, faq.q)}</span>
                       <span className={`material-symbols-outlined text-slate-400 transition-transform duration-300 shrink-0 ${isOpen ? 'rotate-180' : ''}`}>
                         expand_more
                       </span>
                     </button>
                     {isOpen && (
                       <div className="px-6 md:px-8 pb-6 pt-0 animate-fade-in">
                         <p className="text-slate-500 text-[15px] leading-relaxed">{byLang(lang, faq.a)}</p>
                       </div>
                     )}
                   </div>
                 );
               })}
             </div>
           </div>
        </section>

        {/* ═══════════ CTA BANNER ═══════════ */}
        <section className="max-w-7xl mx-auto px-6 md:px-8 py-20">
           <div className="bg-gradient-to-r from-[#483d8b] to-[#3b82f6] rounded-[40px] p-12 md:p-20 text-center relative overflow-hidden shadow-2xl shadow-blue-500/20">
              <h2 className="text-3xl md:text-5xl font-bold font-headline text-white mb-10 max-w-3xl mx-auto leading-tight">
                 {lang === 'kk' ? 'Neuro Ustaz платформасын бүгіннен бастап қолданыңыз' : 'Начните использовать платформу Neuro Ustaz сегодня'}
              </h2>
              <button
                 type="button"
                 onClick={goLogin}
                 className="bg-white text-[#1e6ae8] px-12 py-3.5 rounded-full font-bold text-[15px] hover:shadow-xl hover:scale-105 active:scale-95 transition-all"
              >
                 {isAuthenticated
                   ? (lang === 'kk' ? 'Платформаға өту' : 'Перейти в платформу')
                   : (lang === 'kk' ? 'Тіркелу' : 'Регистрация')
                 }
              </button>

              {/* Decorative glows */}
              <div className="absolute top-[-50%] left-[-20%] w-96 h-96 bg-white/20 blur-[100px] rounded-full pointer-events-none" />
              <div className="absolute bottom-[-50%] right-[-20%] w-96 h-96 bg-blue-400/40 blur-[100px] rounded-full pointer-events-none" />
           </div>
        </section>

        {/* ═══════════ CONTACT FORM ═══════════ */}
        <section className="max-w-7xl mx-auto px-6 md:px-8 pb-20">
           <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20 items-start">
              
              {/* Left text */}
              <div>
                 <h2 className="text-3xl font-bold font-headline mb-4 text-[#0f172a]">
                    {lang === 'kk' ? 'Кері байланыс' : 'Обратная связь'}
                 </h2>
                 <p className="text-slate-500 text-[15px] mb-10 max-w-md leading-relaxed">
                    {lang === 'kk'
                      ? 'Сұрақтарыңыз болса немесе ұсыныстарыңыз болса, бізге хабарласыңыз. Біз әрқашан көмектесуге дайынбыз.'
                      : 'Если у вас есть вопросы или предложения, свяжитесь с нами. Мы всегда готовы помочь.'}
                 </p>
                 
                 <div className="space-y-6">
                    <div className="flex flex-row items-center gap-4">
                       <div className="w-12 h-12 rounded-full bg-[#f0f5ff] flex items-center justify-center">
                          <span className="material-symbols-outlined text-[#1e6ae8] text-[20px]">mail</span>
                       </div>
                       <div>
                          <p className="text-[13px] font-bold text-[#0f172a] mb-0.5">Email</p>
                          <p className="text-[14px] text-slate-500">support@neuroustaz.kz</p>
                       </div>
                    </div>
                    <div className="flex flex-row items-center gap-4">
                       <div className="w-12 h-12 rounded-full bg-[#f0f5ff] flex items-center justify-center">
                          <span className="material-symbols-outlined text-[#1e6ae8] text-[20px]">call</span>
                       </div>
                       <div>
                          <p className="text-[13px] font-bold text-[#0f172a] mb-0.5">{lang === 'kk' ? 'Телефон' : 'Телефон'}</p>
                          <p className="text-[14px] text-slate-500">+7 (700) 123 45 67</p>
                       </div>
                    </div>
                 </div>
              </div>

              {/* Right form card */}
              <div className="bg-white rounded-[32px] p-8 md:p-10 shadow-sm border border-slate-100 relative">
                 <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                       <div className="space-y-2">
                          <label className="text-[13px] font-bold text-[#0f172a]">
                             {lang === 'kk' ? 'Аты-жөніңіз' : 'ФИО'}
                          </label>
                          <input 
                             type="text" 
                             placeholder={lang === 'kk' ? 'Есіміңіз' : 'Ваше имя'}
                             className="w-full bg-[#f1f5f9] border-none rounded-2xl px-5 py-3.5 text-[14px] outline-none focus:ring-2 focus:ring-[#1e6ae8]/20 transition-all font-body text-[#0f172a] placeholder:text-slate-400"
                          />
                       </div>
                       <div className="space-y-2">
                          <label className="text-[13px] font-bold text-[#0f172a]">
                             Email
                          </label>
                          <input 
                             type="email" 
                             placeholder="example@mail.com"
                             className="w-full bg-[#f1f5f9] border-none rounded-2xl px-5 py-3.5 text-[14px] outline-none focus:ring-2 focus:ring-[#1e6ae8]/20 transition-all font-body text-[#0f172a] placeholder:text-slate-400"
                          />
                       </div>
                    </div>
                    <div className="space-y-2">
                       <label className="text-[13px] font-bold text-[#0f172a]">
                          {lang === 'kk' ? 'Хабарлама' : 'Сообщение'}
                       </label>
                       <textarea 
                          placeholder={lang === 'kk' ? 'Сұрағыңызды жазыңыз...' : 'Напишите ваш вопрос...'}
                          rows={4}
                          className="w-full bg-[#f1f5f9] border-none rounded-2xl px-5 py-4 text-[14px] outline-none focus:ring-2 focus:ring-[#1e6ae8]/20 transition-all font-body text-[#0f172a] placeholder:text-slate-400 resize-none"
                       />
                    </div>
                    <button className="w-full bg-gradient-to-r from-[#3b82f6] to-[#4f46e5] text-white py-3.5 rounded-full font-bold text-[14px] hover:opacity-90 active:scale-95 transition-all shadow-md shadow-blue-500/20 mt-2">
                       {lang === 'kk' ? 'Жіберу' : 'Отправить'}
                    </button>
                 </form>
              </div>

           </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default HomePage;
