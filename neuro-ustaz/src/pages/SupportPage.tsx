import React, { useState } from 'react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import { useI18n } from '../i18n/i18n';

const supportFaqs = [
  {
    q: { kk: 'ИИ-педагог қалай жұмыс істейді?', ru: 'Как работает ИИ-педагог?' },
    a: {
      kk: 'Біздің жасанды интеллект сіздің сұранысыңыз бойынша сабақ жоспарларын, ситуациялық кейстердің шешімін және инклюзивті оқыту әдістемелерін ұсынады. Тек чат арқылы сұрағыңызды жазыңыз.',
      ru: 'Наш искусственный интеллект анализирует ваш запрос и предлагает планы уроков, решения ситуационных кейсов и методики инклюзивного образования. Просто напишите свой вопрос в чате.'
    }
  },
  {
    q: { kk: 'КСП-генераторы МЖББС-қа сәйкес пе?', ru: 'Соответствует ли генератор КСП стандартам ГОСО?' },
    a: {
      kk: 'Иә, біздің жүйе Қазақстан Республикасының Мемлекеттік жалпыға міндетті білім беру стандартына (МЖББС) сәйкес бейімделген және құрылымдалған сабақ жоспарларын жасайды.',
      ru: 'Да, наша система генерирует планы уроков, которые структурированы и адаптированы в полном соответствии с Государственным общеобязательным стандартом образования (ГОСО) РК.'
    }
  },
  {
    q: { kk: 'Құжаттарым сақталады ма?', ru: 'Сохраняются ли мои документы?' },
    a: {
      kk: 'Барлық чат жазбалары мен жасалған құжаттар сіздің жеке кабинетіңізде сақталады.',
      ru: 'Все записи чата и сгенерированные документы безопасно хранятся в вашем личном кабинете.'
    }
  }
];

const SupportPage: React.FC = () => {
  const { lang } = useI18n();
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  return (
    <div className="min-h-screen bg-[#f8f9fc] text-[#0f172a] font-body">
      <Navbar />

      <main className="pt-28 pb-20 px-6 md:px-8 max-w-7xl mx-auto">
        <div className="mb-12 mt-6 md:mt-10 animate-fade-in text-center md:text-left">
          <div className="inline-block px-3 py-1 bg-[#1e6ae8]/10 text-[#1e6ae8] text-[12px] font-bold tracking-wider rounded-full mb-4 uppercase">
            {lang === 'kk' ? 'Көмек және қолдау' : 'Помощь и поддержка'}
          </div>
          <h1 className="text-4xl md:text-[56px] font-bold font-headline text-[#0f172a] mb-4 leading-tight tracking-tight">
            {lang === 'kk' ? 'Қолдау орталығы' : 'Центр поддержки'}
          </h1>
          <p className="text-slate-500 text-[16px] max-w-3xl leading-relaxed mx-auto md:mx-0">
            {lang === 'kk'
              ? 'Платформаны қалай пайдалану керектігін біліп, жиі қойылатын сұрақтарға жауап табыңыз.'
              : 'Узнайте, как пользоваться платформой, и найдите ответы на часто задаваемые вопросы.'}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <section className="lg:col-span-7 bg-white rounded-[32px] p-8 md:p-10 border border-slate-100 shadow-sm relative overflow-hidden group hover:shadow-lg transition-all animate-fade-in">
            <h2 className="text-[24px] font-bold font-headline mb-8 flex items-center gap-3">
              <span className="material-symbols-outlined text-[#1e6ae8] text-[28px]">quiz</span>
              {lang === 'kk' ? 'Жиі қойылатын сұрақтар' : 'Часто задаваемые вопросы'}
            </h2>

            <div className="space-y-4 relative z-10">
              {supportFaqs.map((item, index) => {
                const isOpen = openFaq === index;
                return (
                  <div
                    key={index}
                    className={`rounded-[20px] border transition-all duration-300 overflow-hidden ${
                      isOpen
                        ? 'border-[#1e6ae8]/30 bg-[#f8f9fc] shadow-sm'
                        : 'border-slate-100 bg-white hover:border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <button
                      type="button"
                      className="w-full px-6 py-5 flex items-center justify-between text-left focus:outline-none"
                      onClick={() => setOpenFaq(isOpen ? null : index)}
                    >
                      <span className={`font-bold text-[15px] pr-8 ${isOpen ? 'text-[#1e6ae8]' : 'text-[#0f172a]'}`}>
                        {lang === 'kk' ? item.q.kk : item.q.ru}
                      </span>
                      <span
                        className={`material-symbols-outlined transition-transform duration-300 text-slate-400 shrink-0 ${
                          isOpen ? 'rotate-180 text-[#1e6ae8]' : ''
                        }`}
                      >
                        expand_more
                      </span>
                    </button>
                    <div
                      className={`px-6 overflow-hidden transition-all duration-300 ease-in-out ${
                        isOpen ? 'max-h-96 pb-5 opacity-100' : 'max-h-0 opacity-0'
                      }`}
                    >
                      <p className="text-[14px] text-slate-500 leading-relaxed font-medium">
                        {lang === 'kk' ? item.a.kk : item.a.ru}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
            
            <div className="absolute -right-20 -bottom-20 w-[300px] h-[300px] bg-[#f0f5ff] rounded-full blur-[80px] pointer-events-none opacity-50" />
          </section>

          <aside className="lg:col-span-5 space-y-6 animate-fade-in" style={{ animationDelay: '0.1s' }}>
            <div className="bg-white rounded-[32px] p-8 border border-slate-100 shadow-sm relative overflow-hidden group hover:shadow-lg transition-all text-center">
              <div className="w-16 h-16 rounded-[24px] bg-gradient-to-br from-[#1e6ae8] to-[#6366f1] text-white flex items-center justify-center mx-auto mb-6 shadow-md shadow-blue-500/20">
                <span className="material-symbols-outlined text-[32px]">support_agent</span>
              </div>
              <h3 className="text-[20px] font-bold font-headline mb-3 text-[#0f172a]">
                {lang === 'kk' ? 'Толық нұсқаулық' : 'Полное руководство'}
              </h3>
              <p className="text-[14px] text-slate-500 font-medium mb-6 leading-relaxed">
                {lang === 'kk'
                  ? 'Сайттағы барлық мүмкіндіктерді қалай қолдану туралы қадамдық нұсқаулықты оқыңыз.'
                  : 'Прочитайте пошаговую инструкцию о том, как использовать все возможности сайта.'}
              </p>
              <a
                href="/guide"
                className="w-full bg-[#0f172a] text-white py-3.5 rounded-full font-bold text-[14px] shadow-lg shadow-slate-900/10 hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined text-[20px]">menu_book</span>
                {lang === 'kk' ? 'Нұсқаулықты оқу' : 'Читать инструкцию'}
              </a>
            </div>

            <div className="bg-white rounded-[32px] p-8 border border-slate-100 shadow-sm relative overflow-hidden group hover:shadow-lg transition-all text-center">
              <div className="w-16 h-16 rounded-[24px] bg-gradient-to-br from-[#10b981] to-[#059669] text-white flex items-center justify-center mx-auto mb-6 shadow-md shadow-emerald-500/20">
                <span className="material-symbols-outlined text-[32px]">mail</span>
              </div>
              <h3 className="text-[20px] font-bold font-headline mb-3 text-[#0f172a]">
                {lang === 'kk' ? 'Бізбен байланыс' : 'Связаться с нами'}
              </h3>
              <p className="text-[14px] text-slate-500 font-medium mb-6 leading-relaxed">
                {lang === 'kk'
                  ? 'Жауап таппадыңыз ба? Біздің қолдау тобына хабарласыңыз, біз көмектесеміз.'
                  : 'Не нашли ответ? Напишите в нашу службу поддержки, и мы поможем вам.'}
              </p>
              <a
                href="mailto:support@neiroustaz.kz"
                className="w-full bg-slate-50 text-slate-600 border border-slate-200 py-3.5 rounded-full font-bold text-[14px] hover:bg-[#f0f5ff] hover:text-[#1e6ae8] hover:border-[#1e6ae8]/30 active:scale-[0.98] transition-all inline-flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined text-[20px]">send</span>
                support@neiroustaz.kz
              </a>
            </div>
          </aside>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default SupportPage;
