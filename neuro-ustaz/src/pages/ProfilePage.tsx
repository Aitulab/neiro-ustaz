import React, { useEffect, useCallback, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../lib/api';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import { useI18n } from '../i18n/i18n';
import { useAuth } from '../state/auth';

const LEVELS = [
  { id: 'student', minPoints: 0 },
  { id: 'teacher', minPoints: 50 },
  { id: 'expert', minPoints: 150 },
];


const ProfilePage: React.FC = () => {
  const { lang } = useI18n();
  const navigate = useNavigate();
  const { user, isAuthenticated, logout, updateProfile } = useAuth();

  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [draft, setDraft] = useState({ fullName: '', institution: '' });

  const fetchProfile = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get('/users/profile');
      if (res.data.success) {
        setProfileData(res.data.user);
        setDraft({ 
          fullName: res.data.user.fullName, 
          institution: res.data.user.institution || '' 
        });
      }
    } catch (err) {
      console.error('Failed to fetch profile:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) fetchProfile();
  }, [isAuthenticated, fetchProfile]);

  const onUpdateProfile = async () => {
    try {
      await updateProfile({
        fullName: draft.fullName,
        institution: draft.institution
      });
      setIsEditing(false);
      fetchProfile(); // Refresh profile page data
    } catch (err) {
      console.error('Failed to update profile:', err);
    }
  };


  const points = profileData?.points || 0;
  const history = profileData?.history || [];
  const achievements = profileData?.achievements || [];

  const currentLevel = useMemo(() => {
    const sorted = [...LEVELS].sort((a, b) => b.minPoints - a.minPoints);
    return sorted.find((l) => points >= l.minPoints) || LEVELS[0];
  }, [points]);

  const nextLevel = useMemo(() => {
    const sorted = [...LEVELS].sort((a, b) => a.minPoints - b.minPoints);
    return sorted.find((l) => l.minPoints > points) ?? null;
  }, [points]);

  const progressPercent = useMemo(() => {
    if (!nextLevel) return 100;
    const currentMin = currentLevel.minPoints;
    const range = nextLevel.minPoints - currentMin;
    if (range <= 0) return 100;
    return Math.min(100, Math.round(((points - currentMin) / range) * 100));
  }, [points, currentLevel.minPoints, nextLevel]);



  if (loading || !user) {
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

  const levelLabel =
    currentLevel.id === 'student'
      ? lang === 'kk'
        ? 'Студент'
        : 'Студент'
      : currentLevel.id === 'teacher'
        ? lang === 'kk'
          ? 'Педагог'
          : 'Педагог'
        : lang === 'kk'
          ? 'Сарапшы'
          : 'Эксперт';

  const nextLevelLabel = nextLevel
    ? nextLevel.id === 'teacher'
      ? lang === 'kk'
        ? 'Педагог'
        : 'Педагог'
      : lang === 'kk'
        ? 'Сарапшы'
        : 'Эксперт'
    : null;

  return (
    <div className="min-h-screen bg-[#f8f9fc] text-[#0f172a] font-body">
      <Navbar />

      <main className="pt-28 pb-20 px-6 md:px-8 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12 mt-6 md:mt-10 animate-fade-in">
          <div>
            <h1 className="text-4xl md:text-[56px] font-bold font-headline text-[#0f172a] mb-4 leading-tight tracking-tight">
              {lang === 'kk' ? 'Жеке кабинет' : 'Профиль'}
            </h1>
            <p className="text-slate-500 text-[16px] max-w-2xl leading-relaxed">
              {lang === 'kk'
                 ? 'Өзіңіз туралы ақпарат, ұпайлар, жетістіктер және күнделікті тапсырмалар тарихы.'
                 : 'Информация о студенте, баллы, достижения и история ежедневных заданий.'}
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
                {levelLabel}
              </div>
            </div>
            <div className="px-6 py-4 rounded-[24px] bg-white border border-slate-100 shadow-sm flex flex-col justify-center min-w-[120px]">
              <div className="text-[11px] uppercase tracking-wider text-slate-400 font-bold mb-1">
                 {lang === 'kk' ? 'Тізбек' : 'Серия'}
              </div>
              <div className="text-[16px] font-bold text-[#f59e0b] items-center flex gap-1">
                 <span className="material-symbols-outlined text-[18px]">local_fire_department</span>
                 {lang === 'kk' ? `${user?.streakDays || 0} күн` : `${user?.streakDays || 0} дн.`}
              </div>
            </div>
          </div>
        </div>
 
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <section className="lg:col-span-7 space-y-8 animate-fade-in">
            {/* Profile info */}
            <div className="bg-white rounded-[32px] p-8 md:p-10 border border-slate-100 shadow-sm relative overflow-hidden group hover:shadow-lg transition-all">
              <div className="flex items-start justify-between gap-6 relative z-10">
                <div className="flex items-center gap-5">
                   <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-[#3b82f6] to-[#6366f1] text-white flex items-center justify-center text-xl font-bold shadow-md shadow-blue-500/20">
                      {user?.fullName?.split(' ').map((n: any) => n[0]).join('').substring(0, 2).toUpperCase() || '??'}
                   </div>
                   <div>
                     <div className="inline-block px-3 py-1 bg-[#f0f5ff] text-[#1e6ae8] text-[10px] font-bold tracking-wider rounded-full mb-2 uppercase">
                       {lang === 'kk' ? 'Студент профилі' : 'Профиль студента'}
                     </div>
                     <h2 className="text-[26px] font-bold font-headline text-[#0f172a] leading-tight">{user?.fullName}</h2>
                     <p className="text-slate-500 text-[14px] mt-1 pr-4">{user?.email}</p>
                   </div>
                </div>

                
                <button
                  type="button"
                  onClick={() => setIsEditing((v) => !v)}
                  className="w-10 h-10 rounded-full flex items-center justify-center bg-slate-50 text-slate-500 hover:bg-[#1e6ae8] hover:text-white transition-colors border border-slate-200 hover:border-[#1e6ae8]"
                >
                   <span className="material-symbols-outlined text-[20px]">
                      {isEditing ? 'close' : 'edit'}
                   </span>
                </button>
              </div>

              <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
                <div className="bg-[#f8f9fc] rounded-[24px] p-6 border border-slate-100">
                  <div className="text-[11px] uppercase tracking-wider text-slate-400 font-bold mb-2 flex items-center gap-1">
                    <span className="material-symbols-outlined text-[16px]">account_balance</span>
                    {lang === 'kk' ? 'Оқу орны' : 'Где учишься'}
                  </div>
                  {isEditing ? (
                    <input
                      className="w-full bg-white border border-slate-200 rounded-[16px] px-4 py-3 outline-none focus:ring-2 focus:ring-[#1e6ae8]/20 font-body text-[14px]"
                      value={draft.institution}
                      onChange={(e) => setDraft((p) => ({ ...p, institution: e.target.value }))}
                      placeholder={lang === 'kk' ? 'Мысалы: ҚазҰПУ' : 'Например: вуз/колледж'}
                    />
                  ) : (
                    <div className="font-bold text-[#0f172a] text-[15px]">{profileData.institution || <span className="text-slate-400">{lang === 'kk' ? 'Көрсетілмеген' : 'Не указано'}</span>}</div>
                  )}
                </div>

                <div className="bg-[#f8f9fc] rounded-[24px] p-6 border border-slate-100">
                  <div className="text-[11px] uppercase tracking-wider text-slate-400 font-bold mb-2 flex items-center gap-1">
                    <span className="material-symbols-outlined text-[16px]">school</span>
                    {lang === 'kk' ? 'Тіркелген күні' : 'Дата регистрации'}
                  </div>
                   <div className="font-bold text-[#0f172a] text-[15px]">
                     {new Date(profileData.createdAt).toLocaleDateString()}
                   </div>
                </div>
              </div>

              {isEditing && (
                <div className="mt-6 bg-[#f8f9fc] p-6 rounded-[24px] border border-slate-100 relative z-10 animate-fade-in">
                  <div className="text-[11px] uppercase tracking-wider text-slate-400 font-bold mb-2">
                    {lang === 'kk' ? 'Аты-жөніңіз' : 'ФИО'}
                  </div>
                  <input
                    className="w-full bg-white border border-slate-200 rounded-[16px] px-4 py-3 outline-none focus:ring-2 focus:ring-[#1e6ae8]/20 font-body text-[14px]"
                    value={draft.fullName}
                    onChange={(e) => setDraft((p) => ({ ...p, fullName: e.target.value }))}
                    placeholder={lang === 'kk' ? 'Аты-жөніңіз' : 'ФИО'}
                  />

                  <div className="mt-5 flex flex-wrap gap-3 justify-end">
                    <button
                      type="button"
                      onClick={onUpdateProfile}
                      className="px-6 py-2.5 rounded-full font-bold bg-[#1e6ae8] text-white hover:opacity-90 transition-opacity text-[13px]"
                    >
                      {lang === 'kk' ? 'Сақтау' : 'Сохранить'}
                    </button>
                  </div>
                </div>
              )}

              {/* Level progress bar */}
              <div className="mt-10 pt-6 border-t border-slate-100 relative z-10">
                <div className="flex items-center justify-between mb-3">
                  <div className="text-[15px] font-bold text-[#0f172a]">
                    {lang === 'kk' ? 'Деңгей барысы' : 'Прогресс уровня'}
                  </div>
                  {nextLevelLabel && (
                    <div className="text-[12px] font-bold text-slate-500 bg-slate-50 px-3 py-1 rounded-full border border-slate-200">
                      {lang === 'kk' ? `Келесі: ${nextLevelLabel} (${nextLevel?.minPoints} ұпай)` : `Следующий: ${nextLevelLabel} (${nextLevel?.minPoints} б.)`}
                    </div>
                  )}
                </div>
                <div className="w-full h-3.5 bg-slate-100 rounded-full overflow-hidden shadow-inner flex">
                  <div
                    className="h-full bg-gradient-to-r from-[#3b82f6] to-[#8b5cf6] rounded-full transition-all duration-1000 relative"
                    style={{ width: `${progressPercent}%` }}
                  >
                     <div className="absolute inset-0 bg-white/20" style={{ background: 'linear-gradient(45deg, rgba(255,255,255,0.15) 25%, transparent 25%, transparent 50%, rgba(255,255,255,0.15) 50%, rgba(255,255,255,0.15) 75%, transparent 75%, transparent)', backgroundSize: '1rem 1rem' }} />
                  </div>
                </div>
                <div className="mt-2 text-[12px] font-bold text-slate-400 text-right">
                  {progressPercent === 100
                    ? lang === 'kk'
                      ? 'Максималды деңгейге жеттіңіз!'
                      : 'Вы достигли максимального уровня!'
                    : `${progressPercent}%`}
                </div>
              </div>
              
              <div className="absolute -right-20 -top-20 w-[300px] h-[300px] bg-[#f0f5ff] rounded-full blur-[80px] pointer-events-none opacity-50" />
            </div>

            {/* Achievements */}
            <div className="bg-white rounded-[32px] p-8 md:p-10 border border-slate-100 shadow-sm transition-all">
              <h3 className="text-[22px] font-bold font-headline mb-6 text-[#0f172a] flex items-center gap-3">
                {lang === 'kk' ? 'Жетістіктер' : 'Достижения'}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {achievements.length > 0 ? achievements.map((ach: any) => (
                  <div
                    key={ach.id}
                    className="flex flex-col gap-3 p-5 rounded-[24px] border bg-gradient-to-br from-[#f0f5ff] to-white border-[#1e6ae8]/20 shadow-sm transition-all"
                  >
                    <div className="w-12 h-12 rounded-full flex items-center justify-center shrink-0 bg-gradient-to-r from-[#3b82f6] to-[#6366f1] text-white shadow-md shadow-blue-500/20">
                      <span className="text-xl">{ach.icon || '🏅'}</span>
                    </div>
                    <div>
                      <div className="text-[14px] font-bold text-[#0f172a] mb-1">{ach.name}</div>
                      <div className="text-[12px] font-medium text-slate-500 leading-snug">{ach.description}</div>
                    </div>
                  </div>
                )) : (
                  <div className="col-span-full py-8 text-center text-slate-400">
                    <span className="material-symbols-outlined text-[48px] mb-2 opacity-50">military_tech</span>
                    <p className="text-[14px]">
                      {lang === 'kk' ? 'Жетістіктер әлі ашылмаған.' : 'Достижения пока не разблокированы.'}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </section>

          <aside className="lg:col-span-5 space-y-8 animate-fade-in">
            <div className="bg-white rounded-[32px] p-8 md:p-10 border border-slate-100 shadow-sm">
              <h3 className="text-[22px] font-bold font-headline mb-6 text-[#0f172a] flex items-center gap-2">
                <span className="material-symbols-outlined text-[#1bb55c]">check_circle</span>
                {lang === 'kk' ? 'Соңғы тапсырмалар' : 'Последние задания'}
              </h3>
              {history.length === 0 ? (
                <div className="py-8 text-center text-slate-400">
                   <span className="material-symbols-outlined text-[48px] mb-2 opacity-50">history</span>
                   <p className="text-[14px]">
                     {lang === 'kk' ? 'Әзірге тапсырма орындалмаған.' : 'Пока нет выполненных заданий.'}
                   </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {history.map((c: any, i: number) => (
                    <div key={i} className="flex items-center justify-between gap-4 bg-[#f8f9fc] rounded-[20px] px-5 py-4 border border-slate-100 hover:border-slate-200 transition-colors">
                      <div className="flex-1">
                        <div className="font-bold text-[#0f172a] text-[14px] line-clamp-1">{c.title}</div>
                        <div className="text-[11px] text-slate-400">{new Date(c.completed_at).toLocaleDateString()}</div>
                      </div>
                      <div className="text-[14px] font-black text-[#1bb55c] bg-green-50 px-3 py-1 rounded-full border border-green-100">+{c.points}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="bg-gradient-to-br from-[#1e40af] to-[#3b82f6] rounded-[32px] p-8 md:p-10 text-white shadow-md shadow-blue-500/20 relative overflow-hidden">
              <h3 className="text-[22px] font-bold font-headline mb-3 flex items-center gap-2 relative z-10">
                <span className="material-symbols-outlined text-blue-200">info</span>
                {lang === 'kk' ? 'Жоба туралы' : 'О платформе'}
              </h3>
              <p className="text-[14px] text-blue-100 leading-relaxed font-medium mt-4 relative z-10">
                {lang === 'kk'
                  ? 'NeiroUstaz — инклюзивті білім беруді оқитын студенттерге арналған интерактивті платформа: кейстер, тапсырмалар, AI‑көмекші және қауымдастық.'
                  : 'NeiroUstaz — интерактивная платформа для студентов, изучающих инклюзивное образование: кейсы, задания, ИИ‑помощник и сообщество.'}
              </p>
              
              <div className="mt-8 flex flex-col gap-3 relative z-10 border-t border-white/20 pt-6">
                <button
                  type="button"
                  onClick={() => navigate('/tasks')}
                  className="w-full bg-white text-[#1e6ae8] px-6 py-3.5 rounded-full font-bold hover:shadow-lg transition-all hover:-translate-y-0.5 active:translate-y-0 text-[14px]"
                >
                  {lang === 'kk' ? 'Күнделікті тапсырмаға өту' : 'Перейти к заданию'}
                </button>
                <div className="flex gap-3">
                   <button
                     type="button"
                     onClick={() => {
                        logout();
                        navigate('/');
                     }}
                     className="flex-1 px-4 py-3 rounded-full font-bold bg-white/10 hover:bg-red-500/80 border border-white/20 hover:border-red-500 transition-all text-[13px] text-white"
                   >
                     {lang === 'kk' ? 'Шығу' : 'Выйти'}
                   </button>
                </div>
              </div>
              
              <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none" />
            </div>
          </aside>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ProfilePage;
