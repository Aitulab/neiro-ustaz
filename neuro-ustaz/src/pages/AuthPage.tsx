import React, { useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useI18n } from '../i18n/i18n';
import { useAuth } from '../state/auth';

function sanitizeRedirect(path: string | null | undefined): string {
  if (!path || !path.startsWith('/')) return '/assistant';
  if (path.startsWith('//')) return '/assistant';
  return path;
}

const AuthPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { lang, setLang, t } = useI18n();
  const { login, register } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [fullName, setFullName] = useState('');
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [password, setPassword] = useState('');
  const [university, setUniversity] = useState('');
  const [major, setMajor] = useState('');
  const [error, setError] = useState<string | null>(null);

  const redirectTo = useMemo(() => {
    const searchParams = new URLSearchParams(location.search);
    const fromQuery = searchParams.get('from');
    const fromState = (location.state as { from?: string } | null)?.from;
    return sanitizeRedirect(fromState || fromQuery);
  }, [location.search, location.state]);

  const toggleLanguage = () => {
    setLang(lang === 'kk' ? 'ru' : 'kk');
  };

  return (
    <div className="min-h-screen bg-[#f8f9fc] relative overflow-hidden flex items-center justify-center p-4 py-12 sm:p-8">
      {/* Background Decorative Blurs */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-[#3b82f6]/10 rounded-full blur-[120px] animate-pulse-soft" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-[#6366f1]/10 rounded-full blur-[120px] animate-pulse-soft" style={{ animationDelay: '2s' }} />
      </div>

      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-12 rounded-[32px] overflow-hidden shadow-xl shadow-blue-500/10 border border-slate-100 bg-white relative z-10 min-h-[720px] animate-fade-in">
        
        {/* LEFT PANEL - Gradient Branding */}
        <div className="lg:col-span-5 p-10 md:p-14 flex flex-col justify-between bg-gradient-to-br from-[#1e6ae8] to-[#6366f1] text-white relative overflow-hidden">
           <div className="relative z-10">
             <button
                type="button"
                className="text-3xl font-black mb-12 hover:scale-105 transition-transform origin-left font-headline"
                onClick={() => navigate('/')}
             >
                {t('common.brand')}
             </button>
             <h1 className="text-4xl md:text-[50px] font-bold font-headline leading-tight mb-6">
                {lang === 'kk' ? (
                  <>Цифрлық<br />инклюзия<br />тренажері</>
                ) : (
                  <>Цифровой<br />тренажёр<br />по инклюзии</>
                )}
             </h1>
             <p className="text-white/80 text-[16px] leading-relaxed max-w-sm">
                {lang === 'kk'
                  ? 'Кейстерді шешіңіз, дағдыларыңызды дамытыңыз және тәжірибе алмасыңыз.'
                  : 'Решайте кейсы, развивайте навыки и обменивайтесь опытом.'}
             </p>
           </div>
           
           <div className="space-y-6 mt-12 relative z-10">
              <div className="flex items-center gap-4 bg-white/10 p-5 rounded-[20px] backdrop-blur-md border border-white/10">
                <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-white">psychology</span>
                </div>
                <div>
                  <div className="font-bold text-[15px]">{lang === 'kk' ? 'AI Педагог' : 'AI Педагог'}</div>
                  <div className="text-[13px] text-white/70">{lang === 'kk' ? 'Кейстер мен сабақ жоспарлары' : 'Кейсы и планы уроков'}</div>
                </div>
              </div>
              <div className="flex items-center gap-4 bg-white/10 p-5 rounded-[20px] backdrop-blur-md border border-white/10">
                <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-white">military_tech</span>
                </div>
                <div>
                  <div className="font-bold text-[15px]">{lang === 'kk' ? 'Геймификация' : 'Геймификация'}</div>
                  <div className="text-[13px] text-white/70">{lang === 'kk' ? 'Ұпай мен дәрежелер' : 'Баллы и ранги'}</div>
                </div>
              </div>
           </div>

           {/* Decorative circles */}
           <div className="absolute top-[-20%] right-[-20%] w-64 h-64 bg-white/10 rounded-full blur-3xl" />
           <div className="absolute bottom-[-10%] left-[-10%] w-48 h-48 bg-black/10 rounded-full blur-3xl" />
        </div>

        {/* RIGHT PANEL - Form */}
        <div className="lg:col-span-7 p-8 md:p-14 bg-white flex flex-col justify-center relative">
           
           {/* Top Right Actions */}
           <div className="absolute top-6 right-6 flex items-center gap-4">
              <button
                type="button"
                onClick={toggleLanguage}
                className="flex items-center justify-center w-10 h-10 rounded-full bg-slate-50 hover:bg-slate-100 font-bold text-[12px] text-slate-500 hover:text-slate-700 transition-colors border border-slate-200"
                title={lang === 'kk' ? 'Орыс тіліне ауыстыру' : 'Переключить на казахский'}
              >
                 {lang === 'kk' ? 'RU' : 'KK'}
              </button>
           </div>

           <div className="max-w-md mx-auto w-full">
              <div className="mb-10 text-center md:text-left">
                <h2 className="text-[32px] md:text-[40px] font-bold font-headline text-[#0f172a] mb-3">
                  {isLogin ? t('auth.welcome') : t('auth.register')}
                </h2>
                <p className="text-slate-500 text-[15px]">
                  {isLogin ? t('auth.subtitleLogin') : t('auth.subtitleRegister')}
                </p>
              </div>

              <form
                 className="space-y-5"
                 onSubmit={async (e) => {
                    e.preventDefault();
                    setError(null);
                    const email = emailOrPhone.trim();
                    const normalizedPassword = password.trim();

                    if (isLogin) {
                       const result = await login({ email, password: normalizedPassword });
                       if (!result.ok) {
                          setError(result.message || 'invalid_credentials');
                          return;
                       }
                       navigate(redirectTo);
                       return;
                    }

                    const result = await register({
                       fullName: fullName.trim(),
                       email,
                       password: normalizedPassword,
                       institution: university.trim(),
                    });

                    if (!result.ok) {
                       setError(result.message || 'registration_failed');
                       return;
                    }
                    navigate(redirectTo);
                 }}
              >
                {!isLogin && (
                   <div className="space-y-1.5">
                     <label className="text-[12px] font-bold text-slate-500 flex items-center gap-1.5 ml-1">
                        <span className="material-symbols-outlined text-[16px]">person</span>
                        {t('auth.fullName')}
                     </label>
                     <input
                        type="text"
                        className="w-full bg-[#f8f9fc] border border-slate-200 rounded-[16px] px-5 py-4 focus:ring-2 focus:ring-[#1e6ae8] focus:bg-white transition-all outline-none font-medium text-[#0f172a]"
                        placeholder={lang === 'kk' ? 'Ахмет Байтұрсынов' : 'Иван Иванов'}
                        required={!isLogin}
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        autoComplete="name"
                     />
                   </div>
                )}

                <div className="space-y-1.5">
                   <label className="text-[12px] font-bold text-slate-500 flex items-center gap-1.5 ml-1">
                      <span className="material-symbols-outlined text-[16px]">contact_mail</span>
                      {t('auth.emailOrPhone')}
                   </label>
                   <input
                      type="text"
                      className="w-full bg-[#f8f9fc] border border-slate-200 rounded-[16px] px-5 py-4 focus:ring-2 focus:ring-[#1e6ae8] focus:bg-white transition-all outline-none font-medium text-[#0f172a]"
                      placeholder={lang === 'kk' ? 'mail@example.com немесе +7 700...' : 'mail@example.com или +7 700...'}
                      required
                      value={emailOrPhone}
                      onChange={(e) => setEmailOrPhone(e.target.value)}
                      autoComplete="username"
                   />
                </div>

                <div className="space-y-1.5">
                   <label className="text-[12px] font-bold text-slate-500 flex items-center justify-between ml-1">
                      <span className="flex items-center gap-1.5">
                         <span className="material-symbols-outlined text-[16px]">lock</span>
                         {t('auth.password')}
                      </span>
                      {isLogin && (
                         <button type="button" className="text-[#1e6ae8] hover:underline text-[12px]" tabIndex={-1}>
                            {t('auth.forgotPassword')}
                         </button>
                      )}
                   </label>
                   <input
                      type="password"
                      className="w-full bg-[#f8f9fc] border border-slate-200 rounded-[16px] px-5 py-4 focus:ring-2 focus:ring-[#1e6ae8] focus:bg-white transition-all outline-none font-medium text-[#0f172a]"
                      placeholder="••••••••"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      autoComplete={isLogin ? 'current-password' : 'new-password'}
                   />
                </div>

                {!isLogin && (
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                         <label className="text-[12px] font-bold text-slate-500 flex items-center gap-1.5 ml-1">
                            <span className="material-symbols-outlined text-[16px]">school</span>
                            {t('auth.university')}
                         </label>
                         <input
                            type="text"
                            className="w-full bg-[#f8f9fc] border border-slate-200 rounded-[16px] px-5 py-3.5 focus:ring-2 focus:ring-[#1e6ae8] focus:bg-white transition-all outline-none font-medium text-[#0f172a]"
                            placeholder={lang === 'kk' ? 'Университет атауы' : 'Название ВУЗа'}
                            value={university}
                            onChange={(e) => setUniversity(e.target.value)}
                         />
                      </div>
                      <div className="space-y-1.5">
                         <label className="text-[12px] font-bold text-slate-500 flex items-center gap-1.5 ml-1">
                            <span className="material-symbols-outlined text-[16px]">menu_book</span>
                            {t('auth.major')}
                         </label>
                         <input
                            type="text"
                            className="w-full bg-[#f8f9fc] border border-slate-200 rounded-[16px] px-5 py-3.5 focus:ring-2 focus:ring-[#1e6ae8] focus:bg-white transition-all outline-none font-medium text-[#0f172a]"
                            placeholder={lang === 'kk' ? 'Мамандық' : 'Специальность'}
                            value={major}
                            onChange={(e) => setMajor(e.target.value)}
                         />
                      </div>
                   </div>
                )}

                 {error && (
                    <div className="bg-red-50 border border-red-200 text-red-600 px-5 py-4 rounded-[16px] text-[13px] font-bold flex items-start gap-2">
                       <span className="material-symbols-outlined mt-0.5 text-[18px]">error</span>
                       <div className="flex flex-col gap-1">
                          <p>
                             {error === 'invalid_credentials'
                               ? (lang === 'kk' ? 'Пошта/нөмір немесе құпия сөз қате' : 'Неверная почта/номер или пароль')
                               : error === 'no_user'
                                 ? (lang === 'kk' ? 'Сайтқа кіру үшін алдымен тіркеліңіз' : 'Для входа сначала зарегистрируйтесь')
                                 : (error.length < 100 ? error : (lang === 'kk' ? 'Деректерді толтыру барысында қате болды' : 'Ошибка при заполнении данных'))
                             }
                          </p>
                          <div className="text-[10px] opacity-50 font-normal">
                             API: {(() => {
                               try {
                                 // Simple way to get the base URL without extra imports if it's already in the bundle
                                 return (window as any)._API_DEBUG_URL || 'checking...';
                               } catch { return 'unknown'; }
                             })()}
                          </div>
                       </div>
                    </div>
                 )}

                <button 
                  className="w-full bg-[#0f172a] text-white py-4 rounded-[16px] font-bold text-[15px] shadow-lg shadow-slate-900/10 hover:opacity-90 active:scale-[0.98] transition-all mt-6"
                >
                   {isLogin ? t('auth.login') : t('auth.register')}
                </button>
              </form>

              <div className="mt-8 text-center text-slate-500 text-[14px]">
                 <span className="mr-2">{isLogin ? t('auth.noAccount') : t('auth.haveAccount')}</span>
                 <button
                    type="button"
                    className="text-[#1e6ae8] font-bold hover:underline"
                    onClick={() => {
                       setError(null);
                       setIsLogin(!isLogin);
                       setPassword('');
                    }}
                 >
                    {isLogin ? t('auth.switchToRegister') : t('auth.switchToLogin')}
                 </button>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
