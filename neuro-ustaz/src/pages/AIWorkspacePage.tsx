import React, { useEffect, useCallback, useRef, useState, useMemo } from 'react';
import api from '../lib/api';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import { useI18n } from '../i18n/i18n';
import { useAuth } from '../state/auth';
import Cookies from 'js-cookie';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

type Localized = { kk: string; ru: string };

function byLang(lang: 'kk' | 'ru', value: Localized): string {
  return lang === 'kk' ? value.kk : value.ru;
}

const TypingDots: React.FC = () => (
  <div className="flex justify-start">
    <div className="bg-white text-[#1e293b] border border-slate-200/60 rounded-[24px] px-5 py-4 flex items-center gap-1.5 shadow-sm">
      <span className="w-2 h-2 bg-[#1e6ae8]/60 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
      <span className="w-2 h-2 bg-[#1e6ae8]/60 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
      <span className="w-2 h-2 bg-[#1e6ae8]/60 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
    </div>
  </div>
);

const AIWorkspacePage: React.FC = () => {
  const { lang } = useI18n();
  const { isAuthenticated } = useAuth();

  const [messages, setMessages] = useState<{ id: string; role: 'user' | 'assistant'; content: string; createdAt: string }[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const hasMessages = messages.length > 0;

  // Saved notes panel
  const [showSaved, setShowSaved] = useState(false);
  const [savedNotes, setSavedNotes] = useState<{ id: string; text: string; savedAt: string }[]>(() => {
    try {
      const stored = localStorage.getItem('neiroustaz_saved_notes');
      return stored ? JSON.parse(stored) : [];
    } catch { return []; }
  });
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Persist saved notes
  useEffect(() => {
    localStorage.setItem('neiroustaz_saved_notes', JSON.stringify(savedNotes));
  }, [savedNotes]);

  const saveNote = (text: string) => {
    const note = { id: `note_${Date.now()}`, text, savedAt: new Date().toISOString() };
    setSavedNotes(prev => [note, ...prev]);
  };

  const deleteNote = (id: string) => {
    setSavedNotes(prev => prev.filter(n => n.id !== id));
  };

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  }, [input]);

  // Fetch chat history on load
  useEffect(() => {
    const initChat = async () => {
      try {
        const historyRes = await api.get('/ai/chat/history');
        if (historyRes.data.history) {
          // Map backend history (role, content, created_at) to frontend shape
          const mappedMessages = historyRes.data.history.map((msg: any, i: number) => ({
             id: `history_${i}`,
             role: msg.role,
             content: msg.content,
             createdAt: msg.created_at
          }));
          setMessages(mappedMessages);
        }
      } catch (err) {
        console.error('Failed to load chat history:', err);
      }
    };
    if (isAuthenticated) initChat();
  }, [isAuthenticated]);

  const chips = useMemo(
    () => [
      { icon: 'description', text: byLang(lang, { kk: 'КСП құрастыру', ru: 'Составить КСП' }), active: false },
      { icon: 'assignment_turned_in', text: byLang(lang, { kk: 'СОЧ дайындау', ru: 'Подготовить СОЧ' }), active: false },
      { icon: 'calendar_month', text: byLang(lang, { kk: 'Сабақ жоспары', ru: 'План урока' }), active: false },
      { icon: 'note_add', text: byLang(lang, { kk: 'Тапсырмалар жасау', ru: 'Создать задания' }), active: false },
    ],
    [lang],
  );

  const scrollToBottom = useCallback(() => {
    requestAnimationFrame(() => {
      scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
    });
  }, []);

  const clearHistory = async () => {
    try {
      if (!window.confirm(lang === 'kk' ? 'Барлық хабарламаларды өшіргіңіз келе ме?' : 'Очистить историю сообщений?')) return;
      await api.delete('/ai/chat/history');
      setMessages([]);
    } catch (err) {
      console.error('Failed to clear history:', err);
    }
  };

  const send = async (overrideText?: string) => {
    const trimmed = (overrideText ?? input).trim();
    if (!trimmed || isTyping) return;

    // Locally add user message for immediate feedback
    const userMsg = { 
      id: `temp_${Date.now()}`, 
      role: 'user' as const, 
      content: trimmed, 
      createdAt: new Date().toISOString() 
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);
    scrollToBottom();

    try {
      const token = Cookies.get('token');
      const baseUrl = api.defaults.baseURL;
      const currentLang = localStorage.getItem('neiroustaz_lang') || 'kk';
      
      const response = await fetch(`${baseUrl}/ai/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'X-Lang': currentLang === 'kk' ? 'kz' : currentLang
        },
        body: JSON.stringify({ message: trimmed })
      });

      if (!response.ok) {
         let errorMessage = lang === 'kk' ? 'Күтпеген қате орын алды' : 'Произошла непредвиденная ошибка';
         
         try {
           const errorData = await response.json();
           errorMessage = errorData.error || errorMessage;
         } catch {
           // Fallback for non-JSON errors (like 503 from Render)
           if (response.status === 503) {
             errorMessage = lang === 'kk' 
               ? 'Сервер уақытша қолжетімсіз. Шамалы уақыттан кейін қайта байқап көріңіз (503).' 
               : 'Сервер временно недоступен. Пожалуйста, попробуйте позже (503).';
           } else if (response.status === 429) {
              errorMessage = lang === 'kk'
                ? 'Сұраныс лимиті асып кетті. Бірнеше минут күте тұрыңыз.'
                : 'Лимит запросов исчерпан. Пожалуйста, подождите немного.';
           }
         }
         throw new Error(errorMessage);
      }
      
      if (!response.body) throw new Error('No body');

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      
      const replyMsgId = `reply_${Date.now()}`;
      setMessages(prev => [
        ...prev.filter(m => !m.id.startsWith('temp_')), 
        userMsg,
        { id: replyMsgId, role: 'assistant', content: '', createdAt: new Date().toISOString() }
      ]);
      
      let buffer = '';
      
      // eslint-disable-next-line no-constant-condition
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        
        buffer += decoder.decode(value, { stream: true });
        
        const lines = buffer.split('\n');
        // Keep the last partial line in the buffer
        buffer = lines.pop() || '';
        
        for (const line of lines) {
          const trimmedLine = line.trim();
          if (!trimmedLine || !trimmedLine.startsWith('data: ')) continue;
          
          const data = trimmedLine.slice(6);
          if (data === '[DONE]') continue;
          
          try {
            const parsed = JSON.parse(data);
            if (parsed.content) {
              setMessages(prev => prev.map(m => 
                m.id === replyMsgId ? { ...m, content: m.content + parsed.content } : m
              ));
            }
          } catch (e) {
            console.error('Error parsing SSE data:', e, data);
          }
        }
        scrollToBottom();
      }
    } catch (err: any) {
      console.error('AI Request failed:', err);
      // Replace the loading message with an error message
      setMessages(prev => [
        ...prev.filter(m => !m.id.startsWith('temp_')),
        { 
          id: `error_${Date.now()}`, 
          role: 'assistant', 
          content: err.message || (lang === 'kk' 
            ? 'Кешіріңіз, қате орын алды. Қайтадан байқап көріңіз.' 
            : 'Извините, произошла ошибка. Пожалуйста, попробуйте еще раз.'),
          createdAt: new Date().toISOString() 
        }
      ]);
    } finally {
      setIsTyping(false);
      scrollToBottom();
    }

  };

  return (
    <div className="min-h-screen bg-white text-[#1e293b] antialiased font-body flex flex-col">
      <Navbar />

      {/* Full-height chat area */}
      <main className="flex-1 flex flex-col pt-20">
        
        {/* Scrollable messages area */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto">
          
          {/* Empty state */}
          {!hasMessages && (
            <div className="flex flex-col items-center justify-center min-h-[70vh] px-6 animate-fade-in">
              <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-[#3b82f6] to-[#6366f1] flex items-center justify-center mb-6 shadow-lg shadow-blue-500/20">
                <span className="material-symbols-outlined text-white text-[32px]">auto_awesome</span>
              </div>
              <h1 className="text-2xl md:text-3xl font-bold font-headline text-center mb-3 text-[#0f172a]">
                {lang === 'kk' ? 'Сәлем! Мен NeiroUstaz.' : 'Привет! Я NeiroUstaz.'}
              </h1>
              <p className="text-slate-400 text-[15px] text-center max-w-md mb-10">
                {lang === 'kk' 
                  ? 'Сабақ жоспарлары, инклюзивті әдістемелер, педагогикалық кейстер — кез келген сұрағыңызға көмектесемін.'
                  : 'Планы уроков, инклюзивные методики, педагогические кейсы — помогу с любым вопросом.'}
              </p>
              
              {/* Suggestion cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-xl">
                {[
                  { icon: 'description', title: lang === 'kk' ? 'КСП құрастыру' : 'Составить КСП', desc: lang === 'kk' ? '8-сынып, Биология' : '8 класс, Биология', prompt: lang === 'kk' ? '8-сыныпқа Биология пәнінен КСП құрастырып берші. Кесте түрінде болсын.' : 'Составь КСП по биологии для 8 класса. Выведи в виде таблицы.' },
                  { icon: 'psychology', title: lang === 'kk' ? 'Кейс талдау' : 'Разбор кейса', desc: lang === 'kk' ? 'Инклюзивті ситуация' : 'Инклюзивная ситуация', prompt: lang === 'kk' ? 'Аутизм спектрі бар оқушы сыныпта оқшауланып қалғанда мұғалім не істеу керек? Кейсті талда.' : 'Ученик с аутизмом изолирован в классе. Что делать учителю? Разбери кейс.' },
                  { icon: 'assignment', title: lang === 'kk' ? 'СОЧ дайындау' : 'Подготовить СОЧ', desc: lang === 'kk' ? '5-сынып, Математика' : '5 класс, Математика', prompt: lang === 'kk' ? '5-сыныпқа Математика пәнінен 3-тоқсанға СОЧ дайындап бер.' : 'Подготовь Суммативную за четверть (СОЧ) по математике для 5 класса, 3 четверть.' },
                  { icon: 'translate', title: lang === 'kk' ? 'Аудару' : 'Перевести', desc: lang === 'kk' ? 'Қаз/Рус/Eng' : 'Каз/Рус/Eng', prompt: lang === 'kk' ? 'Мына мәтінді ағылшын тіліне аударып бер: "Инклюзивті білім беру - барлық балалардың тең құқықтарын қамтамасыз ететін жүйе."' : 'Переведи на английский: "Инклюзивное образование — это система обеспечения равных прав на образование для всех детей."' },
                ].map((card, i) => (
                  <button
                    key={i}
                    onClick={() => send(card.prompt)}
                    className="text-left bg-[#f8f9fc] hover:bg-[#f0f4ff] border border-slate-200/60 hover:border-[#1e6ae8]/30 rounded-2xl p-4 transition-all group"
                  >
                    <div className="flex items-center gap-3 mb-1.5">
                      <span className="material-symbols-outlined text-[#1e6ae8] text-[20px] group-hover:scale-110 transition-transform">{card.icon}</span>
                      <span className="font-bold text-[14px] text-[#0f172a]">{card.title}</span>
                    </div>
                    <p className="text-[12px] text-slate-400 ml-8">{card.desc}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Messages */}
          {hasMessages && (
            <div className="max-w-3xl mx-auto w-full px-6 py-6 space-y-1">
              {/* Header actions */}
              <div className="flex justify-between items-center mb-4 sticky top-0 bg-white/80 backdrop-blur-md z-10 py-2 -mx-2 px-2 rounded-2xl">
                <button
                  onClick={() => setShowSaved(!showSaved)}
                  className="flex items-center gap-1.5 text-slate-400 hover:text-[#1e6ae8] text-[13px] font-semibold transition-colors px-3 py-1.5 rounded-full hover:bg-blue-50"
                >
                  <span className="material-symbols-outlined text-[16px]">bookmark</span>
                  {savedNotes.length > 0 && `(${savedNotes.length})`}
                </button>
                <button
                  onClick={clearHistory}
                  className="flex items-center gap-1.5 text-slate-400 hover:text-red-500 text-[13px] font-semibold transition-colors px-3 py-1.5 rounded-full hover:bg-red-50"
                >
                  <span className="material-symbols-outlined text-[16px]">restart_alt</span>
                  {lang === 'kk' ? 'Жаңа чат' : 'Новый чат'}
                </button>
              </div>

              {/* Saved panel */}
              {showSaved && (
                <div className="bg-[#f8f9fc] rounded-2xl border border-slate-100 p-5 mb-4 animate-fade-in">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-[14px] font-bold text-[#0f172a] flex items-center gap-2">
                      <span className="material-symbols-outlined text-[#1e6ae8] text-[18px]">bookmark</span>
                      {lang === 'kk' ? 'Сақталғандар' : 'Сохранённые'}
                    </h3>
                    <button onClick={() => setShowSaved(false)} className="text-slate-400 hover:text-slate-600">
                      <span className="material-symbols-outlined text-[18px]">close</span>
                    </button>
                  </div>
                  {savedNotes.length === 0 ? (
                    <p className="text-slate-400 text-[13px] text-center py-4">
                      {lang === 'kk' ? 'Әзірге бос. ⭐ батырмасын басыңыз.' : 'Пока пусто. Нажмите ⭐ на ответе.'}
                    </p>
                  ) : (
                    <div className="space-y-2 max-h-[200px] overflow-y-auto">
                      {savedNotes.map(note => (
                        <div key={note.id} className="bg-white rounded-xl p-3 text-[13px] text-slate-600 relative group border border-slate-100">
                          <p className="line-clamp-3 pr-14 whitespace-pre-wrap">{note.text}</p>
                          <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={() => { navigator.clipboard.writeText(note.text); setCopiedId(note.id); setTimeout(() => setCopiedId(null), 1500); }} className="w-6 h-6 rounded-md bg-slate-50 hover:bg-blue-50 flex items-center justify-center">
                              <span className="material-symbols-outlined text-[13px] text-slate-400">{copiedId === note.id ? 'check' : 'content_copy'}</span>
                            </button>
                            <button onClick={() => deleteNote(note.id)} className="w-6 h-6 rounded-md bg-slate-50 hover:bg-red-50 flex items-center justify-center">
                              <span className="material-symbols-outlined text-[13px] text-red-400">delete</span>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Message list */}
              {messages.map((msg, idx) => (
                <div key={msg.id} className={`py-4 ${msg.role === 'assistant' ? 'bg-[#f8f9fc] -mx-6 px-6 rounded-2xl' : ''}`}>
                  <div className="flex gap-4">
                    {/* Avatar */}
                    <div className={`w-8 h-8 rounded-lg shrink-0 flex items-center justify-center ${
                      msg.role === 'assistant' 
                        ? 'bg-gradient-to-tr from-[#3b82f6] to-[#6366f1] text-white' 
                        : 'bg-[#0f172a] text-white'
                    }`}>
                      <span className="material-symbols-outlined text-[16px]">
                        {msg.role === 'assistant' ? 'auto_awesome' : 'person'}
                      </span>
                    </div>
                    
                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[13px] font-bold text-[#0f172a]">
                          {msg.role === 'assistant' ? 'NeiroUstaz' : (lang === 'kk' ? 'Сіз' : 'Вы')}
                        </span>
                        <span className="text-[11px] text-slate-400">
                          {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      
                      {msg.role === 'user' ? (
                        <p className="text-[15px] text-[#1e293b] leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                      ) : (
                        <div className="prose prose-slate prose-sm max-w-none text-[15px] leading-relaxed">
                          <ReactMarkdown remarkPlugins={[remarkGfm]}>
                            {msg.content}
                          </ReactMarkdown>
                        </div>
                      )}

                      {/* Action buttons for AI messages */}
                      {msg.role === 'assistant' && msg.content && !msg.id.startsWith('temp_') && (
                        <div className="flex items-center gap-1 mt-3 -ml-1">
                          <button onClick={() => navigator.clipboard.writeText(msg.content)} className="p-1.5 rounded-lg hover:bg-slate-200/60 text-slate-400 hover:text-slate-600 transition-colors" title={lang === 'kk' ? 'Көшіру' : 'Скопировать'}>
                            <span className="material-symbols-outlined text-[16px]">content_copy</span>
                          </button>
                          <button onClick={() => saveNote(msg.content)} className="p-1.5 rounded-lg hover:bg-yellow-50 text-slate-400 hover:text-yellow-500 transition-colors" title={lang === 'kk' ? 'Сақтау' : 'Сохранить'}>
                            <span className="material-symbols-outlined text-[16px]">star</span>
                          </button>
                          {idx === messages.length - 1 && (
                            <>
                              <div className="w-px h-4 bg-slate-200 mx-1" />
                              {[
                                { label: lang === 'kk' ? 'Жалғастыр' : 'Продолжи', prompt: lang === 'kk' ? 'Жалғастыр' : 'Продолжи' },
                                { label: lang === 'kk' ? 'Қысқарт' : 'Короче', prompt: lang === 'kk' ? 'Қысқартып бер' : 'Сделай короче' },
                                { label: lang === 'kk' ? 'Кестеге' : 'Таблица', prompt: lang === 'kk' ? 'Кесте түрінде шығар' : 'Выведи в виде таблицы' },
                              ].map((a, i) => (
                                <button key={i} onClick={() => send(a.prompt)} className="px-2.5 py-1 rounded-lg hover:bg-slate-200/60 text-slate-400 hover:text-[#1e6ae8] text-[12px] font-semibold transition-colors">
                                  {a.label}
                                </button>
                              ))}
                            </>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="py-4 bg-[#f8f9fc] -mx-6 px-6 rounded-2xl">
                  <div className="flex gap-4 items-center">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#3b82f6] to-[#6366f1] text-white flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-[16px]">auto_awesome</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 bg-[#1e6ae8]/50 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-2 h-2 bg-[#1e6ae8]/50 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="w-2 h-2 bg-[#1e6ae8]/50 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Sticky bottom input */}
        <div className="sticky bottom-0 bg-gradient-to-t from-white via-white to-white/0 pt-6 pb-6 px-6">
          <div className="max-w-3xl mx-auto">
            <div className="bg-[#f8f9fc] rounded-2xl border border-slate-200 shadow-sm focus-within:border-[#1e6ae8]/40 focus-within:shadow-[0_0_0_3px_rgba(30,106,232,0.08)] transition-all">
              <textarea
                ref={textareaRef}
                className="w-full bg-transparent py-4 px-5 text-[15px] placeholder:text-slate-400 outline-none text-[#1e293b] resize-none max-h-[200px] overflow-y-auto"
                placeholder={
                  lang === 'kk'
                    ? 'Сұрағыңызды жазыңыз...'
                    : 'Напишите ваш вопрос...'
                }
                rows={1}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    send();
                  }
                }}
              />
              <div className="flex items-center justify-between px-3 pb-3">
                <p className="text-[11px] text-slate-400 pl-2">
                  {lang === 'kk' ? 'Enter — жіберу, Shift+Enter — жаңа жол' : 'Enter — отправить, Shift+Enter — новая строка'}
                </p>
                <button
                  type="button"
                  onClick={() => send()}
                  disabled={isTyping || !input.trim()}
                  className="bg-[#0f172a] text-white w-10 h-10 rounded-xl flex items-center justify-center transition-all hover:bg-[#1e293b] active:scale-95 disabled:opacity-30"
                >
                  <span className="material-symbols-outlined text-[20px]">arrow_upward</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AIWorkspacePage;

