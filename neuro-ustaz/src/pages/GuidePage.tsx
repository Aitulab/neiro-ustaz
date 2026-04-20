import React from 'react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import { useI18n } from '../i18n/i18n';

const steps = [
  {
    icon: 'person_add',
    title: { kk: '1. Тіркелу', ru: '1. Регистрация' },
    text: {
      kk: '«Кіру» батырмасын басыңыз → «Тіркелу» қойындысына ауысыңыз → Аты-жөніңізді, пошта/нөміріңізді, құпия сөзді және оқу орныңызды толтырыңыз → «Тіркелу» батырмасын басыңыз. Жүйе сізді автоматты түрде жеке кабинетіңізге бағыттайды.',
      ru: 'Нажмите «Войти» → перейдите на вкладку «Регистрация» → заполните ФИО, почту/телефон, пароль и место учёбы → нажмите «Регистрация». Система автоматически перенаправит вас в личный кабинет.',
    },
  },
  {
    icon: 'smart_toy',
    title: { kk: '2. AI көмекші', ru: '2. ИИ-помощник' },
    text: {
      kk: 'Навигациядағы «AI көмекші» бетіне кіріңіз → Чат терезесіне сұранысыңызды жазыңыз, мысалы: "5-сынып математикасынан сабақ жоспарын жаса" → ИИ сізге КТЖ, кейс шешімдерін немесе инклюзивті әдістемелерді ұсынады. Дайын мәтінді көшіріп алуға болады.',
      ru: 'Перейдите на вкладку «ИИ-помощник» → введите запрос в чат, например: "Составь КСП по математике для 5 класса" → ИИ сгенерирует план урока, решение кейса или методику. Готовый текст можно скопировать.',
    },
  },
  {
    icon: 'task_alt',
    title: { kk: '3. Тапсырмалар', ru: '3. Задания' },
    text: {
      kk: '«Тапсырмалар» бетінде күнделікті тапсырмалар жүктеледі → Тапсырманы орындаңыз және жауапты жіберіңіз → Дұрыс жауап үшін ұпай аласыз, деңгейіңіз көтеріледі.',
      ru: 'На вкладке «Задания» каждый день появляются новые задачи → выполните задание и отправьте ответ → за правильный ответ вы получите баллы и повысите свой уровень.',
    },
  },
  {
    icon: 'forum',
    title: { kk: '4. Қауымдастық', ru: '4. Сообщество' },
    text: {
      kk: '«Қауымдастық» бетінде басқа студенттермен тәжірибе бөлісуге болады → Жаңа пост жазыңыз немесе басқалардың постарына жауап жазыңыз, лайк басыңыз → Белсенді қатысу үшін қосымша ұпай аласыз.',
      ru: 'На вкладке «Сообщество» можно делиться опытом с другими педагогами → напишите пост или ответьте на чужой, ставьте лайки → за активное участие начисляются дополнительные баллы.',
    },
  },
  {
    icon: 'gavel',
    title: { kk: '5. НҚА (Нормативтік құқықтық актілер)', ru: '5. НПА (Нормативные правовые акты)' },
    text: {
      kk: '«НҚА» бетінде Қазақстан білім саласындағы негізгі заңнамалық құжаттар жинақталған → Әрбір құжаттың карточкасын басып, ресми сілтемеден толық мәтінін оқуға болады.',
      ru: 'На вкладке «НПА» собраны основные законодательные документы в сфере образования РК → нажмите на карточку документа, чтобы перейти на официальный источник и прочитать полный текст.',
    },
  },
  {
    icon: 'build',
    title: { kk: '6. Құралдар', ru: '6. Инструменты' },
    text: {
      kk: '«Құралдар» бетінде КТЖ генераторы, кейс талдау, инклюзивті әдістемелер сияқты арнайы құралдар бар → Қажетті құралды таңдап, бірнеше нұсқауды толтыру арқылы дайын нәтиже алыңыз.',
      ru: 'На вкладке «Инструменты» доступны специальные модули: генератор КСП, анализ кейсов, методики инклюзивного образования → выберите нужный инструмент и следуйте инструкциям для получения результата.',
    },
  },
  {
    icon: 'account_circle',
    title: { kk: '7. Жеке кабинет', ru: '7. Личный кабинет' },
    text: {
      kk: 'Жоғарғы оң жақтағы аватарыңызды басыңыз → Жеке кабинетте сіздің деңгейіңіз, ұпайларыңыз, жетістіктеріңіз және профиль мәліметтеріңіз көрсетіледі. Тілді ҚАЗ/РУС арасында ауыстыруға болады.',
      ru: 'Нажмите на свой аватар в правом верхнем углу → в личном кабинете отображается ваш уровень, баллы, достижения и данные профиля. Язык интерфейса можно переключить между КАЗ/РУС.',
    },
  },
];

const GuidePage: React.FC = () => {
  const { lang } = useI18n();

  return (
    <div className="min-h-screen bg-[#f8f9fc] text-[#0f172a] antialiased font-body flex flex-col">
      <Navbar />

      <main className="flex-1 pt-28 pb-20 px-6 md:px-8 max-w-4xl mx-auto w-full">
        {/* Header */}
        <div className="mb-12 text-center">
          <div className="inline-block px-3 py-1 bg-[#1e6ae8]/10 text-[#1e6ae8] text-[12px] font-bold tracking-wider rounded-full mb-4 uppercase">
            {lang === 'kk' ? 'Нұсқаулық' : 'Руководство'}
          </div>
          <h1 className="text-3xl md:text-5xl font-bold font-headline mb-4 text-[#0f172a]">
            {lang === 'kk' ? 'Платформаны қалай қолдану керек?' : 'Как пользоваться платформой?'}
          </h1>
          <p className="text-[16px] text-slate-500 max-w-2xl mx-auto leading-relaxed">
            {lang === 'kk'
              ? 'Төменде NeiroUstaz платформасының негізгі функцияларын қадамдық нұсқаулық арқылы түсіндіреміз.'
              : 'Ниже мы пошагово объясним все основные функции платформы NeiroUstaz.'}
          </p>
        </div>

        {/* Steps */}
        <div className="space-y-6">
          {steps.map((step, i) => (
            <div
              key={i}
              className="bg-white rounded-[28px] p-8 border border-slate-100 shadow-sm hover:shadow-md transition-all relative overflow-hidden group"
            >
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-blue-50 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

              <div className="flex items-start gap-5 relative z-10">
                <div className="w-12 h-12 bg-[#f0f5ff] rounded-xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined text-[#1e6ae8] text-[24px]">
                    {step.icon}
                  </span>
                </div>
                <div>
                  <h3 className="text-[18px] font-bold text-[#0f172a] mb-2">
                    {lang === 'kk' ? step.title.kk : step.title.ru}
                  </h3>
                  <p className="text-slate-500 text-[14px] leading-relaxed">
                    {lang === 'kk' ? step.text.kk : step.text.ru}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-12 text-center">
          <p className="text-slate-400 text-[14px] mb-4">
            {lang === 'kk'
              ? 'Сұрағыңыз бар ма? Қолдау бетіне өтіңіз.'
              : 'Остались вопросы? Перейдите на страницу поддержки.'}
          </p>
          <a
            href="/support"
            className="inline-flex items-center gap-2 bg-[#0f172a] text-white px-8 py-3.5 rounded-full font-bold text-[14px] hover:opacity-90 active:scale-[0.98] transition-all"
          >
            <span className="material-symbols-outlined text-[20px]">help</span>
            {lang === 'kk' ? 'Қолдау орталығы' : 'Центр поддержки'}
          </a>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default GuidePage;
