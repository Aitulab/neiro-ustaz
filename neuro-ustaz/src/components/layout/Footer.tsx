import React from 'react';
import { NavLink } from 'react-router-dom';
import { footerLinks } from '../../data/navigation';
import { useI18n } from '../../i18n/i18n';

const Footer: React.FC = () => {
  const { lang, t } = useI18n();

  const labels: Record<string, { kk: string; ru: string }> = {
    about: { kk: 'Біз туралы', ru: 'О проекте' },
    privacy: { kk: 'Құпиялылық', ru: 'Конфиденциальность' },
    help: { kk: 'Көмек', ru: 'Помощь' },
    contact: { kk: 'Байланыс', ru: 'Контакты' },
  };

  return (
    <footer className="bg-[#f8f9fc] pt-12 pb-8 border-t-0 font-body">
      <div className="max-w-7xl mx-auto px-6 md:px-8">
        
        {/* Top area in Footer */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
           <NavLink to="/" className="text-xl font-bold text-[#1e6ae8] font-headline tracking-tight">
              Neuro Ustaz
           </NavLink>
           
           <div className="flex flex-wrap gap-x-8 gap-y-4">
              {footerLinks.map((link) => (
                 <NavLink
                    key={link.id}
                    to={link.path}
                    className="text-[#475569] hover:text-[#1e6ae8] font-semibold text-[13px] transition-colors"
                 >
                    {lang === 'kk' ? (labels[link.id]?.kk ?? link.label ?? link.id) : labels[link.id]?.ru ?? link.label ?? link.id}
                 </NavLink>
              ))}
           </div>
        </div>

        {/* Divider */}
        <div className="w-full h-px bg-[#e2e8f0] mb-8" />

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
           <p className="text-[13px] text-[#64748b] font-medium">
              © {new Date().getFullYear()} {t('common.brand')}. {lang === 'kk' ? 'Барлық құқықтар қорғалған.' : 'Все права защищены.'}
           </p>
           
           <div className="flex items-center gap-3">
              <button 
                type="button"
                className="w-9 h-9 rounded-full bg-[#f1f5f9] flex items-center justify-center hover:bg-[#e2e8f0] transition-colors group text-[#475569] hover:text-[#0f172a]"
                aria-label="Share"
              >
                 <span className="material-symbols-outlined text-[18px]">share</span>
              </button>
              <button 
                type="button"
                className="w-9 h-9 rounded-full bg-[#f1f5f9] flex items-center justify-center hover:bg-[#e2e8f0] transition-colors group text-[#475569] hover:text-[#0f172a]"
                aria-label="Language & Region"
              >
                 <span className="material-symbols-outlined text-[18px]">public</span>
              </button>
           </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
