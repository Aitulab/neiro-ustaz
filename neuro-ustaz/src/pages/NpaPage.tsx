import React, { useState, useEffect, useRef } from 'react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import { useI18n } from '../i18n/i18n';
import { useAuth } from '../state/auth';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
const SERVER_BASE = API_BASE.replace('/api', '');

const NpaPage: React.FC = () => {
  const { lang } = useI18n();
  const { isAuthenticated, token } = useAuth();
  
  const [documents, setDocuments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/npa`);
      const data = await res.json();
      if (data.ok) {
        setDocuments(data.documents);
      }
    } catch (err) {
      console.error('Failed to fetch NPA documents', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  const uploadFile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fileInputRef.current?.files?.length) return;

    const file = fileInputRef.current.files[0];
    const form = new FormData();
    form.append('document', file);
    
    try {
      setIsUploading(true);
      const res = await fetch(`${API_BASE}/npa`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: form
      });
      const data = await res.json();
      if (data.ok) {
        await fetchDocuments();
        (e.target as HTMLFormElement).reset();
      } else {
        alert(data.error || 'Upload failed');
      }
    } catch (error) {
      console.error(error);
      alert(lang === 'kk' ? 'Жүктеу кезінде қате шықты. Серверді тексеріңіз.' : 'Ошибка при загрузке. Проверьте сервер.');
    } finally {
      setIsUploading(false);
    }
  };

  // Fallback documents if DB is empty
  const defaultDocs = [
      {
         id: 'd1',
         title_kk: 'ҚР «Білім туралы» Заңы', title_ru: 'Закон РК «Об образовании»',
         desc_kk: 'Қазақстан Республикасының білім беру саласындағы негізгі заңнамалық актісі.',
         desc_ru: 'Основной законодательный акт в сфере образования Республики Казахстан.',
         file_url: 'https://adilet.zan.kz/rus/docs/Z070000319_',
         created_at: '27.07.2007',
      },
      {
         id: 'd2',
         title_kk: 'Мемлекеттік жалпыға міндетті білім беру стандарты (МЖМБС)', title_ru: 'Государственные общеобязательные стандарты (ГОСО)',
         desc_kk: 'Барлық деңгейдегі білім беру мазмұнына қойылатын негізгі талаптар.',
         desc_ru: 'Основные требования к содержанию образования всех уровней.',
         file_url: 'https://adilet.zan.kz/rus/docs/V2200029031',
         created_at: '03.08.2022',
      },
      {
         id: 'd3',
         title_kk: 'ҚР «Педагог мәртебесі туралы» Заңы', title_ru: 'Закон РК «О статусе педагога»',
         desc_kk: 'Педагогтердің құқықтарын, міндеттерін және кепілдіктерін белгілейтін заң.',
         desc_ru: 'Закон, устанавливающий права, обязанности и гарантии трудящихся педагогов.',
         file_url: 'https://adilet.zan.kz/rus/docs/Z1900000293',
         created_at: '27.12.2019',
      }
  ];

  const displayDocs = documents.length > 0 ? documents : defaultDocs;

  return (
    <div className="min-h-screen bg-[#f8f9fc] text-[#0f172a] antialiased font-body flex flex-col">
      <Navbar />

      <main className="flex-1 pt-28 pb-20 px-6 md:px-8 max-w-7xl mx-auto w-full">
        {/* Header */}
        <div className="mb-10 lg:mb-16">
           <h1 className="text-3xl md:text-5xl font-bold font-headline mb-4 text-[#0f172a]">
              {lang === 'kk' ? 'Нормативтік құқықтық актілер' : 'Нормативные правовые акты'}
           </h1>
           <p className="text-[16px] text-slate-500 max-w-3xl leading-relaxed">
              {lang === 'kk'
                 ? 'Бұл бөлімде педагогтарға қажетті негізгі заңнамалық актілер мен құжаттар жинақталған. Құжаттарды оқу және жүктеп алу үшін төмендегі тізімді пайдаланыңыз.'
                 : 'В этом разделе собраны основные законодательные акты и документы, необходимые для работы педагога. Используйте список ниже для чтения и скачивания документов.'}
           </p>
        </div>

        {/* Documents Grid */}
        {loading ? (
           <div className="text-center text-slate-500 text-sm py-10">{lang === 'kk' ? 'Құжаттар жүктелуде...' : 'Загрузка документов...'}</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
             {displayDocs.map((doc: any) => {
                const dateStr = doc.created_at ? new Date(doc.created_at).toLocaleDateString('ru-RU') : doc.date;
                const fileUrl = doc.file_url.startsWith('http') ? doc.file_url : `${SERVER_BASE}${doc.file_url}`;
                
                return (
                <div key={doc.id} className="bg-white rounded-[24px] p-8 border border-slate-100 shadow-sm hover:shadow-md transition-all flex flex-col items-start h-full relative group overflow-hidden">
                   {/* Decorative background shape */}
                   <div className="absolute -top-10 -right-10 w-32 h-32 bg-blue-50 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                   
                   <div className="w-12 h-12 bg-[#f0f5ff] rounded-xl flex items-center justify-center mb-6 relative z-10 shrink-0 group-hover:scale-110 transition-transform">
                      <span className="material-symbols-outlined text-[#1e6ae8] text-[24px]">
                        {fileUrl.endsWith('.pdf') ? 'picture_as_pdf' : 'description'}
                      </span>
                   </div>
                   <div className="flex-1 relative z-10">
                      <p className="text-[12px] font-bold text-slate-400 mb-2 uppercase tracking-wider">{dateStr}</p>
                      <h3 className="text-[18px] font-bold text-[#0f172a] mb-3 leading-snug">
                         {lang === 'kk' ? doc.title_kk : doc.title_ru}
                      </h3>
                      <p className="text-slate-500 text-[14px] leading-relaxed mb-6">
                         {lang === 'kk' ? doc.desc_kk : doc.desc_ru}
                      </p>
                   </div>
                   <a 
                      href={fileUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="mt-auto w-full inline-flex items-center justify-center gap-2 bg-slate-50 hover:bg-[#1e6ae8] text-[#1e6ae8] hover:text-white px-5 py-3 rounded-xl font-bold text-[14px] transition-colors relative z-10"
                   >
                      <span className="material-symbols-outlined text-[18px]">
                        {fileUrl.startsWith('http') && !fileUrl.includes('localhost') ? 'open_in_new' : 'download'}
                      </span>
                      {lang === 'kk' ? (fileUrl.startsWith('http') && !fileUrl.includes('localhost') ? 'Ашу (Сілтеме)' : 'Жүктеп алу') : (fileUrl.startsWith('http') && !fileUrl.includes('localhost') ? 'Открыть (Ссылка)' : 'Скачать файл')}
                   </a>
                </div>
             )})}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default NpaPage;
