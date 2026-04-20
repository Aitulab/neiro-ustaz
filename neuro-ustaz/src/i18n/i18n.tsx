/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';

export type Lang = 'kk' | 'ru';

const STORAGE_KEY = 'neiroustaz_lang';

const translations = {
  kk: {
    common: {
      brand: 'NeiroUstaz',
      save: 'Сақтау',
      cancel: 'Бас тарту',
      continue: 'Жалғастыру',
      close: 'Жабу',
    },
    nav: {
      home: 'Басты бет',
      assistant: 'AI көмекші',
      tasks: 'Тапсырмалар',
      community: 'Қауымдастық',
      tools: 'Құралдар',
      support: 'Қолдау',
      profile: 'Жеке кабинет',
      login: 'Кіру',
      logout: 'Шығу',
      npa: 'НҚА',
      langShort: 'ҚАЗ/РУС',
      langKk: 'ҚАЗ',
      langRu: 'РУС',
    },
    auth: {
      welcome: 'Қош келдіңіз!',
      register: 'Тіркелу',
      login: 'Кіру',
      subtitleLogin: 'Платформаның барлық мүмкіндіктерін пайдалану үшін жүйеге кіріңіз',
      subtitleRegister: 'Платформаның барлық мүмкіндіктерін пайдалану үшін мәліметтерді енгізіңіз',
      fullName: 'Аты-жөніңіз',
      emailOrPhone: 'Пошта/нөмір',
      password: 'Құпия сөз',
      university: 'Оқу орны',
      major: 'Мамандық/бағыт',
      forgotPassword: 'Құпия сөзді ұмыттыңыз ба?',
      noAccount: 'Есептік жазбаңыз жоқ па?',
      haveAccount: 'Есептік жазбаңыз бар ма?',
      switchToRegister: 'Тіркелу',
      switchToLogin: 'Кіру',
    },
  },
  ru: {
    common: {
      brand: 'NeiroUstaz',
      save: 'Сохранить',
      cancel: 'Отмена',
      continue: 'Продолжить',
      close: 'Закрыть',
    },
    nav: {
      home: 'Главная',
      assistant: 'ИИ‑помощник',
      tasks: 'Задания',
      community: 'Сообщество',
      tools: 'Инструменты',
      support: 'Поддержка',
      profile: 'Профиль',
      login: 'Войти',
      logout: 'Выйти',
      npa: 'НПА',
      langShort: 'ҚАЗ/РУС',
      langKk: 'ҚАЗ',
      langRu: 'РУС',
    },
    auth: {
      welcome: 'Добро пожаловать!',
      register: 'Регистрация',
      login: 'Войти',
      subtitleLogin: 'Войдите, чтобы использовать все возможности платформы',
      subtitleRegister: 'Заполните данные, чтобы начать пользоваться платформой',
      fullName: 'ФИО',
      emailOrPhone: 'Почта/номер',
      password: 'Пароль',
      university: 'Где учишься',
      major: 'Специальность/направление',
      forgotPassword: 'Забыли пароль?',
      noAccount: 'Нет аккаунта?',
      haveAccount: 'Уже есть аккаунт?',
      switchToRegister: 'Регистрация',
      switchToLogin: 'Войти',
    },
  },
} as const;

type Dictionary = typeof translations.kk;

function getFromPath(obj: unknown, path: string): unknown {
  return path.split('.').reduce<unknown>((acc, key) => {
    if (acc && typeof acc === 'object' && key in (acc as Record<string, unknown>)) {
      return (acc as Record<string, unknown>)[key];
    }
    return undefined;
  }, obj);
}

function safeReadLang(): Lang {
  const raw = typeof window !== 'undefined' ? window.localStorage.getItem(STORAGE_KEY) : null;
  if (raw === 'kk' || raw === 'ru') return raw;
  return 'kk';
}

interface I18nContextValue {
  lang: Lang;
  setLang: (lang: Lang) => void;
  toggleLang: () => void;
  t: (key: string) => string;
}

const I18nContext = createContext<I18nContextValue | null>(null);

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>(() => safeReadLang());

  const setLang = useCallback((next: Lang) => {
    setLangState(next);
    window.localStorage.setItem(STORAGE_KEY, next);
  }, []);

  const toggleLang = useCallback(() => setLang(lang === 'kk' ? 'ru' : 'kk'), [lang, setLang]);

  const t = useCallback(
    (key: string) => {
      const dict: Dictionary = translations[lang] as unknown as Dictionary;
      const value = getFromPath(dict, key);
      return typeof value === 'string' ? value : key;
    },
    [lang],
  );

  const value = useMemo(() => ({ lang, setLang, toggleLang, t }), [lang, setLang, toggleLang, t]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const value = useContext(I18nContext);
  if (!value) {
    throw new Error('useI18n must be used within I18nProvider');
  }
  return value;
}
