import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { navItems } from '../../data/navigation';
import { useI18n } from '../../i18n/i18n';
import { useAuth } from '../../state/auth';

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const { lang, setLang, t } = useI18n();
  const { user, isAuthenticated, logout } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, []);

  const initials = user?.fullName
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('');

  return (
    <header className="fixed top-0 w-full z-50 flex justify-center px-4 md:px-6 py-3 pointer-events-none">
      <nav
        className={`w-full max-w-7xl flex justify-between items-center glass-nav rounded-full shadow-lg shadow-black/[0.04] transition-all duration-300 pointer-events-auto border border-white/60 ${
          isScrolled ? 'px-6 py-2.5' : 'px-8 py-3.5'
        }`}
      >
        {/* Brand */}
        <NavLink
          to="/"
          className="text-xl font-black gradient-text font-headline tracking-tight"
        >
          {t('common.brand')}
        </NavLink>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-1">
          {navItems.map((item) => (
            <NavLink
              key={item.id}
              to={item.path}
              className={({ isActive }) =>
                `px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${
                  isActive
                    ? 'bg-[#1e6ae8]/10 text-[#1e6ae8]'
                    : 'text-slate-500 hover:text-[#0f172a] hover:bg-slate-100/60'
                }`
              }
            >
              {t(`nav.${item.id}`)}
            </NavLink>
          ))}
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2">
          {/* Lang Toggle */}
          <button
            type="button"
            onClick={() => setLang(lang === 'kk' ? 'ru' : 'kk')}
            className="hidden sm:inline-flex items-center justify-center w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 transition-all text-xs font-bold text-slate-500"
            aria-label={t('nav.langShort')}
            title={t('nav.langShort')}
          >
            {lang === 'kk' ? 'RU' : 'KK'}
          </button>

          {isAuthenticated ? (
            <>
              {/* Profile Button */}
              <button
                type="button"
                onClick={() => navigate('/profile')}
                className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#3b82f6] to-[#6366f1] text-white font-bold text-sm flex items-center justify-center shadow-md shadow-blue-500/20 hover:scale-105 active:scale-95 transition-transform"
                aria-label={t('nav.profile')}
                title={user?.fullName || t('nav.profile')}
              >
                {initials || 'U'}
              </button>
              {/* Logout */}
              <button
                type="button"
                onClick={() => {
                  logout();
                  navigate('/');
                }}
                className="hidden lg:inline-flex items-center justify-center px-4 py-2 rounded-full bg-slate-100 hover:bg-red-50 hover:text-red-500 transition-all text-xs font-bold text-slate-500"
              >
                {t('nav.logout')}
              </button>
            </>
          ) : (
            <button
              onClick={() => navigate('/auth')}
              className="bg-[#0f172a] text-white px-6 py-2.5 rounded-full font-bold text-sm hover:opacity-90 active:scale-95 transition-all shadow-md shadow-slate-900/10"
            >
              {t('nav.login')}
            </button>
          )}

          {/* Mobile Menu Toggle */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden w-10 h-10 rounded-full bg-slate-100/50 hover:bg-slate-200 flex items-center justify-center transition-all"
            aria-label="Menu"
          >
            <span className="material-symbols-outlined text-slate-500">
              {mobileMenuOpen ? 'close' : 'menu'}
            </span>
          </button>
        </div>
      </nav>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-4 right-4 mt-2 glass-nav rounded-3xl shadow-xl border border-white/60 p-4 pointer-events-auto fade-in">
          <div className="flex flex-col gap-1">
            {navItems.map((item) => (
              <NavLink
                key={item.id}
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `px-4 py-3 rounded-2xl text-sm font-semibold transition-all ${
                    isActive
                      ? 'bg-[#1e6ae8]/10 text-[#1e6ae8]'
                      : 'text-slate-500 hover:bg-slate-100/60'
                  }`
                }
              >
                {t(`nav.${item.id}`)}
              </NavLink>
            ))}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
