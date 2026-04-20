import React, { useEffect, useCallback, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../lib/api';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import { useI18n } from '../i18n/i18n';
import { useAuth } from '../state/auth';

function getInitials(name: string): string {
  if (!name) return 'U';
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('');
}

const CommunityPage: React.FC = () => {
  const { lang } = useI18n();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showComposer, setShowComposer] = useState(false);
  const [composer, setComposer] = useState({ title: '', body: '', category: '' });
  const [openPostId, setOpenPostId] = useState<string | null>(null);
  const [commentDraft, setCommentDraft] = useState<Record<string, string>>({});
  const [replies, setReplies] = useState<Record<string, any[]>>({});

  const fetchPosts = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get('/community/posts');
      if (res.data.success) {
        setPosts(res.data.posts);
      }
    } catch (err) {
      console.error('Failed to fetch posts:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) fetchPosts();
  }, [isAuthenticated, fetchPosts]);

  const addPost = async () => {
    if (!user) return;
    const { title, body, category } = composer;
    if (!title.trim() || !body.trim()) return;

    try {
      const res = await api.post('/community/posts', {
        title: title.trim(),
        content: body.trim(),
        tags: category ? [category] : []
      });
      if (res.data.id) {
        setComposer({ title: '', body: '', category: '' });
        setShowComposer(false);
        fetchPosts(); // Refresh feed
      }
    } catch (err) {
      console.error('Failed to create post:', err);
    }
  };

  const likePost = async (postId: string) => {
    try {
      const res = await api.post(`/community/posts/${postId}/like`);
      // Response is { liked: boolean, likes: number }
      if (res.data !== undefined) {
        setPosts((prev) =>
          prev.map((p) =>
            p.id === postId
              ? { ...p, likes: res.data.likes, user_liked: res.data.liked }
              : p
          )
        );
      }
    } catch (err) {
      console.error('Failed to like post:', err);
    }
  };

  const addComment = async (postId: string) => {
    const body = (commentDraft[postId] ?? '').trim();
    if (!body) return;

    try {
      const res = await api.post(`/community/posts/${postId}/replies`, {
        content: body
      });
      if (res.data.success) {
        setCommentDraft((prev) => ({ ...prev, [postId]: '' }));
        // Refresh replies for this post
        const repRes = await api.get(`/community/posts/${postId}/replies`);
        if (repRes.data.success) {
          setReplies((prev) => ({ ...prev, [postId]: repRes.data.replies }));
        }
        // Also update the replies count in the main list
        setPosts((prev) => prev.map(p => p.id === postId ? { ...p, replies_count: (p.replies_count || 0) + 1 } : p));
      }
    } catch (err) {
      console.error('Failed to add comment:', err);
    }
  };

  const toggleOpenPost = async (postId: string) => {
    const isOpen = openPostId === postId;
    if (isOpen) {
      setOpenPostId(null);
    } else {
      setOpenPostId(postId);
      // Fetch replies if not already loaded or reload
      try {
         const res = await api.get(`/community/posts/${postId}/replies`);
         if (res.data.success) {
           setReplies((prev) => ({ ...prev, [postId]: res.data.replies }));
         }
      } catch (err) {
         console.error('Failed to fetch replies:', err);
      }
    }
  };

  const popularTags = useMemo(
    () =>
      lang === 'kk'
        ? ['#Инклюзия', '#АСБ', '#СТЖД', '#ПДТ', '#Мінезқұлық', '#Сенсорика', '#ИнклюзивтіБілім']
        : ['#Инклюзия', '#РАС', '#ОНР', '#ЗПР', '#Поведение', '#Сенсорика', '#ИнклюзивноеОбразование'],
    [lang],
  );

  const members = useMemo(
    () => [
      { initials: 'АС', name: lang === 'kk' ? 'Айбек Сейіт' : 'Айбек Сеит', posts: lang === 'kk' ? '142 жазба' : '142 поста', color: 'bg-blue-100 text-[#1e6ae8]' },
      { initials: 'ГН', name: lang === 'kk' ? 'Гүлназ Нұрлан' : 'Гульназ Нурлан', posts: lang === 'kk' ? '98 жазба' : '98 постов', color: 'bg-emerald-100 text-emerald-600' },
    ],
    [lang],
  );



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


  return (
    <div className="min-h-screen bg-[#f8f9fc] text-[#0f172a] font-body">
      <Navbar />

      <main className="pt-28 pb-20 px-6 md:px-8 max-w-7xl mx-auto">
        {/* ═══════════ HERO: Help for Students ═══════════ */}
        <section className="mb-16 mt-6 md:mt-10 animate-fade-in">
          <div className="mb-10 text-center md:text-left max-w-2xl">
            <h1 className="text-4xl md:text-[56px] font-bold font-headline text-[#0f172a] leading-tight tracking-tight mb-4">
              {lang === 'kk' ? 'Студенттерге көмек' : 'Помощь студентам'}
            </h1>
            <p className="text-slate-500 text-[16px] leading-relaxed">
              {lang === 'kk'
                ? 'Болашақ педагогтарға арналған қауымдастық. Сұрақ қойыңыз, тәжірибе бөлісіңіз және AI құралдарын пайдаланыңыз.'
                : 'Сообщество для будущих педагогов. Задавайте вопросы, делитесь опытом и используйте ИИ-инструменты.'}
            </p>
          </div>

          {/* Bento Grid Tools */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Lesson Planning */}
            <div
              className="md:col-span-2 bg-white p-8 md:p-10 rounded-[32px] flex flex-col md:flex-row justify-between items-start md:items-center group hover:shadow-lg transition-all border border-slate-100 cursor-pointer overflow-hidden relative"
              onClick={() => navigate('/tools')}
            >
              <div className="relative z-10 flex-1 pr-6">
                <div className="w-14 h-14 bg-[#e6f0fd] rounded-full flex items-center justify-center mb-6 text-[#1e6ae8]">
                  <span className="material-symbols-outlined text-[28px]">menu_book</span>
                </div>
                <h3 className="text-[22px] font-bold font-headline mb-3 text-[#0f172a]">
                  {lang === 'kk' ? 'Сабақ жоспарын дайындау' : 'Подготовка плана урока'}
                </h3>
                <p className="text-slate-500 text-[14px] max-w-md mb-6 leading-relaxed">
                  {lang === 'kk'
                    ? 'Инклюзивті сабақ жоспарын секунд ішінде жасаңыз. Тақырып пен ЕҚБ ерекшелігін таңдаңыз, қалғанын AI жасайды.'
                    : 'Создайте инклюзивный план урока за секунды. Выберите тему и особенности ООП — остальное сделает AI.'}
                </p>
                <span className="bg-[#1e6ae8] text-white px-6 py-2.5 rounded-full font-bold text-[14px] inline-flex items-center gap-2 group-hover:bg-[#155bd5] transition-colors shadow-md shadow-blue-500/20">
                  {lang === 'kk' ? 'Бастау' : 'Начать'} <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                </span>
              </div>
              <div className="absolute right-[-40px] bottom-[-40px] w-64 h-64 bg-[#e6f0fd] rounded-full blur-3xl opacity-50 group-hover:scale-125 transition-transform duration-700 pointer-events-none" />
            </div>

            {/* Practice Prep */}
            <div 
              className="bg-white p-8 rounded-[32px] flex flex-col justify-between border border-slate-100 hover:shadow-lg transition-all cursor-pointer"
              onClick={() => navigate('/tasks')}
            >
              <div>
                <div className="w-12 h-12 bg-gradient-to-tr from-[#3b82f6] to-[#6366f1] rounded-full flex items-center justify-center mb-6 text-white shadow-md shadow-blue-500/20">
                  <span className="material-symbols-outlined text-[24px]">school</span>
                </div>
                <h3 className="text-[19px] font-bold font-headline mb-3 text-[#0f172a] leading-tight">
                  {lang === 'kk' ? 'Практикаға дайындалу' : 'Подготовка к практике'}
                </h3>
                <p className="text-slate-500 text-[14px] leading-relaxed">
                  {lang === 'kk'
                    ? 'Педагогикалық практикаға қажетті дағдылар мен дайындық материалдары.'
                    : 'Навыки и материалы для подготовки к педагогической практике.'}
                </p>
              </div>
            </div>

          </div>
        </section>

        {/* ═══════════ COMMUNITY FORUM ═══════════ */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Main Feed */}
          <div className="lg:col-span-8">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-[26px] font-bold font-headline text-[#0f172a]">
                {lang === 'kk' ? 'Талқылаулар' : 'Обсуждения'}
              </h2>
              <button
                type="button"
                onClick={() => setShowComposer(!showComposer)}
                className="bg-gradient-to-r from-[#3b82f6] to-[#4f46e5] text-white px-5 py-2.5 rounded-full font-bold text-[14px] hover:shadow-lg active:scale-95 transition-all shadow-blue-500/20 flex items-center gap-1.5"
              >
                <span className="material-symbols-outlined text-[18px]">{showComposer ? 'close' : 'add'}</span>
                {showComposer ? (lang === 'kk' ? 'Жабу' : 'Закрыть') : lang === 'kk' ? 'Сұрақ қою' : 'Задать вопрос'}
              </button>
            </div>

            {/* Composer */}
            {showComposer && (
              <div className="bg-white rounded-[32px] p-8 mb-8 shadow-sm border border-[#e2e8f0] animate-fade-in relative">
                <h3 className="font-bold text-[#0f172a] mb-6">
                  {lang === 'kk' ? 'Жаңа талқылау бастау' : 'Начать новое обсуждение'}
                </h3>
                <input
                  type="text"
                  className="w-full bg-[#f8f9fc] border-none rounded-2xl px-5 py-3.5 mb-4 focus:ring-2 focus:ring-[#1e6ae8]/20 outline-none placeholder:text-slate-400 font-body text-[14px]"
                  placeholder={lang === 'kk' ? 'Тақырыбы (мысалы: Аутизмі бар баламен жұмыс)' : 'Тема (например: Работа с ребенком с РАС)'}
                  value={composer.title}
                  onChange={(e) => setComposer({ ...composer, title: e.target.value })}
                />
                <textarea
                  className="w-full bg-[#f8f9fc] border-none rounded-2xl px-5 py-4 mb-4 focus:ring-2 focus:ring-[#1e6ae8]/20 outline-none placeholder:text-slate-400 min-h-[120px] font-body text-[14px] resize-none"
                  placeholder={lang === 'kk' ? 'Жағдайды толық сипаттаңыз...' : 'Опишите ситуацию подробно...'}
                  value={composer.body}
                  onChange={(e) => setComposer({ ...composer, body: e.target.value })}
                />
                <div className="flex justify-between items-center flex-wrap gap-4">
                  <select
                    className="bg-[#f8f9fc] border-none rounded-full px-5 py-2.5 outline-none focus:ring-2 focus:ring-[#1e6ae8]/20 font-body text-[13px] font-bold text-slate-600 appearance-none cursor-pointer"
                    value={composer.category}
                    onChange={(e) => setComposer({ ...composer, category: e.target.value })}
                  >
                    <option value="" disabled>{lang === 'kk' ? 'Санатты таңдаңыз' : 'Выберите категорию'}</option>
                    <option value="Сұрақ">{lang === 'kk' ? 'Сұрақ' : 'Вопрос'}</option>
                    <option value="Тәжірибе">{lang === 'kk' ? 'Тәжірибе бөлісу' : 'Обмен опытом'}</option>
                    <option value="Кейс">{lang === 'kk' ? 'Кейс талдау' : 'Разбор кейса'}</option>
                  </select>
                  <button
                    type="button"
                    onClick={addPost}
                    disabled={!composer.title.trim() || !composer.body.trim()}
                    className="bg-[#1e6ae8] text-white px-8 py-2.5 rounded-full font-bold text-[14px] hover:opacity-90 disabled:opacity-50 transition-all flex items-center gap-2"
                  >
                    {lang === 'kk' ? 'Жариялау' : 'Опубликовать'}
                  </button>
                </div>
              </div>
            )}

            {/* Posts List */}
            <div className="space-y-6">
              {posts.map((post) => {
                const isOpen = openPostId === post.id;
                const avatarInitials = getInitials(post.author?.full_name || '');
                return (
                  <div key={post.id} className="bg-white rounded-[32px] p-6 shadow-sm border border-[#e2e8f0] transition-all hover:border-[#cbd5e1]">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-r from-[#4Da6FF] to-[#4c1D95] text-white flex items-center justify-center font-bold text-[14px] shrink-0">
                        {avatarInitials}
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-center mb-1">
                          <span className="font-bold text-[#0f172a] text-[15px]">{post.author?.full_name}</span>
                          <span className="text-[12px] text-slate-400 font-medium">
                            {new Date(post.created_at).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex gap-2 mb-3">
                          {(post.tags || []).map((tag: string) => (
                            <span key={tag} className="inline-block px-3 py-1 bg-[#f1f5f9] text-[#64748b] text-[11px] font-bold rounded-full tracking-wide">
                              {tag}
                            </span>
                          ))}
                        </div>
                        <h4 className="text-[18px] font-bold font-headline text-[#0f172a] mb-2">{post.title}</h4>
                        <p className="text-slate-600 text-[14px] leading-relaxed whitespace-pre-wrap">
                          {post.content}
                        </p>

                        {/* Actions */}
                        <div className="flex items-center gap-6 mt-4">
                          <button
                            type="button"
                            onClick={() => likePost(post.id)}
                            className={`flex items-center gap-1.5 transition-colors ${post.user_liked ? 'text-[#ef4444]' : 'text-slate-500 hover:text-[#ef4444]'}`}
                          >
                            <span className={`material-symbols-outlined text-[20px] ${post.user_liked ? 'fill-current' : ''}`}>
                               favorite
                            </span>
                            <span className="text-[13px] font-bold">{post.likes}</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => toggleOpenPost(post.id)}
                            className="flex items-center gap-1.5 text-slate-500 hover:text-[#1e6ae8] transition-colors"
                          >
                            <span className="material-symbols-outlined text-[20px]">chat_bubble</span>
                            <span className="text-[13px] font-bold">
                              {post.replies_count || 0} {lang === 'kk' ? 'жауап' : 'ответов'}
                            </span>
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Comments Section */}
                    {isOpen && (
                      <div className="mt-6 pt-6 border-t border-[#f1f5f9] space-y-5 animate-fade-in pl-[64px]">
                        {/* List of existing replies */}
                        <div className="space-y-4">
                          {(replies[post.id] || []).map((reply: any) => (
                             <div key={reply.id} className="bg-slate-50 rounded-[20px] p-4 border border-slate-100 shadow-sm">
                                <div className="flex justify-between items-center mb-2">
                                   <div className="flex items-center gap-2">
                                      <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center font-bold text-[10px]">
                                         {getInitials(reply.full_name)}
                                      </div>
                                      <span className="font-bold text-[13px] text-slate-700">{reply.full_name}</span>
                                   </div>
                                   <span className="text-[10px] text-slate-400">
                                      {new Date(reply.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                   </span>
                                </div>
                                <p className="text-[13px] text-slate-600 leading-relaxed">{reply.content}</p>
                             </div>
                          ))}
                        </div>
                        
                        {/* Add Comment */}
                        <div className="flex gap-3 mt-4">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#4Da6FF] to-[#4c1D95] text-white flex items-center justify-center font-bold text-[11px] shrink-0">
                             {getInitials(user?.fullName || 'U')}
                          </div>
                          <div className="flex-1 flex gap-2">
                            <input
                              type="text"
                              className="w-full bg-[#f8f9fc] border border-slate-200 rounded-full px-4 py-2 text-[13px] outline-none focus:border-[#1e6ae8] font-body"
                              placeholder={lang === 'kk' ? 'Жауап жазу...' : 'Написать ответ...'}
                              value={commentDraft[post.id] || ''}
                              onChange={(e) => setCommentDraft((prev) => ({ ...prev, [post.id]: e.target.value }))}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') addComment(post.id);
                              }}
                            />
                            <button
                              type="button"
                              onClick={() => addComment(post.id)}
                              className="w-9 h-9 rounded-full bg-[#1e6ae8] text-white flex items-center justify-center shrink-0 hover:opacity-90 transition-opacity"
                            >
                              <span className="material-symbols-outlined text-[16px]">send</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Tag Cloud */}
            <div className="bg-white rounded-[32px] p-6 shadow-sm border border-[#e2e8f0]">
              <h3 className="text-[16px] font-bold font-headline mb-4 text-[#0f172a] items-center flex gap-2">
                <span className="material-symbols-outlined text-[#1e6ae8] text-[20px]">tag</span>
                {lang === 'kk' ? 'Танымал тақырыптар' : 'Популярные теги'}
              </h3>
              <div className="flex flex-wrap gap-2">
                {popularTags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1.5 bg-[#f8f9fc] text-slate-600 hover:text-[#1e6ae8] hover:bg-[#e6f0fd] rounded-full text-[12px] font-bold cursor-pointer transition-colors"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Top Members */}
            <div className="bg-white rounded-[32px] p-6 shadow-sm border border-[#e2e8f0]">
              <h3 className="text-[16px] font-bold font-headline mb-4 text-[#0f172a] items-center flex gap-2">
                <span className="material-symbols-outlined text-[#f59e0b] text-[20px]">workspace_premium</span>
                {lang === 'kk' ? 'Белсенді мүшелер' : 'Активные участники'}
              </h3>
              <div className="space-y-4">
                {members.map((m, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-[13px] ${m.color}`}>
                      {m.initials}
                    </div>
                    <div>
                      <p className="font-bold text-[14px] text-[#0f172a]">{m.name}</p>
                      <p className="text-[12px] text-slate-500 font-medium">{m.posts}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Suggestion Card */}
            <div className="bg-gradient-to-br from-[#1e40af] to-[#3b82f6] rounded-[32px] p-6 text-white shadow-md shadow-blue-500/20 relative overflow-hidden">
               <div className="relative z-10 flex flex-col items-start">
                  <span className="material-symbols-outlined mb-3 text-[32px] text-white/50">school</span>
                  <h3 className="font-bold text-[18px] mb-2 font-headline">{lang === 'kk' ? 'Ұстаздыққа бірге' : 'Вместе к мастерству'}</h3>
                  <p className="text-white/80 text-[13px] mb-4">
                     {lang === 'kk' 
                        ? 'Қауымдастықта белсенді болыңыз, жауап беріңіз және тәжірибе жинаңыз.' 
                        : 'Будьте активны в сообществе, отвечайте на вопросы и набирайтесь опыта.'}
                  </p>
               </div>
               <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl" />
            </div>

          </div>

        </section>
      </main>

      <Footer />
    </div>
  );
};

export default CommunityPage;
