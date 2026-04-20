/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useProgress } from './progress';

export interface Achievement {
  id: string;
  icon: string;
  title: { kk: string; ru: string };
  description: { kk: string; ru: string };
  condition: (ctx: AchievementContext) => boolean;
}

interface AchievementContext {
  points: number;
  streakDays: number;
  completedDays: number;
  levelId: string;
}

const STORAGE_KEY = 'neiroustaz_achievements';

const ALL_ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first_task',
    icon: 'emoji_events',
    title: { kk: 'Бірінші қадам', ru: 'Первый шаг' },
    description: { kk: 'Алғашқы тапсырманы орындау', ru: 'Выполнить первое задание' },
    condition: (ctx) => ctx.completedDays >= 1,
  },
  {
    id: 'streak_3',
    icon: 'local_fire_department',
    title: { kk: '3 күндік серия', ru: 'Серия 3 дня' },
    description: { kk: 'Қатарынан 3 күн тапсырма орындау', ru: 'Выполнять задания 3 дня подряд' },
    condition: (ctx) => ctx.streakDays >= 3,
  },
  {
    id: 'streak_7',
    icon: 'whatshot',
    title: { kk: '7 күндік серия', ru: 'Серия 7 дней' },
    description: { kk: 'Қатарынан 7 күн тапсырма орындау', ru: 'Выполнять задания 7 дней подряд' },
    condition: (ctx) => ctx.streakDays >= 7,
  },
  {
    id: 'points_50',
    icon: 'star',
    title: { kk: '50 ұпай', ru: '50 баллов' },
    description: { kk: '50 ұпай жинау', ru: 'Набрать 50 баллов' },
    condition: (ctx) => ctx.points >= 50,
  },
  {
    id: 'points_100',
    icon: 'stars',
    title: { kk: '100 ұпай', ru: '100 баллов' },
    description: { kk: '100 ұпай жинау', ru: 'Набрать 100 баллов' },
    condition: (ctx) => ctx.points >= 100,
  },
  {
    id: 'points_200',
    icon: 'workspace_premium',
    title: { kk: '200 ұпай', ru: '200 баллов' },
    description: { kk: '200 ұпай жинау', ru: 'Набрать 200 баллов' },
    condition: (ctx) => ctx.points >= 200,
  },
  {
    id: 'level_teacher',
    icon: 'school',
    title: { kk: 'Педагог деңгейі', ru: 'Уровень «Педагог»' },
    description: { kk: '«Педагог» деңгейіне жету', ru: 'Достичь уровня «Педагог»' },
    condition: (ctx) => ctx.levelId === 'teacher' || ctx.levelId === 'expert',
  },
  {
    id: 'level_expert',
    icon: 'military_tech',
    title: { kk: 'Сарапшы деңгейі', ru: 'Уровень «Эксперт»' },
    description: { kk: '«Сарапшы» деңгейіне жету', ru: 'Достичь уровня «Эксперт»' },
    condition: (ctx) => ctx.levelId === 'expert',
  },
  {
    id: 'dedicated_10',
    icon: 'loyalty',
    title: { kk: 'Берілгендік', ru: 'Преданность' },
    description: { kk: '10 күн тапсырма орындау', ru: 'Выполнить задания за 10 дней' },
    condition: (ctx) => ctx.completedDays >= 10,
  },
];

function readUnlocked(): Set<string> {
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) return new Set();
  try {
    const arr = JSON.parse(raw);
    if (Array.isArray(arr)) return new Set(arr as string[]);
  } catch { /* ignore */ }
  return new Set();
}

function writeUnlocked(set: Set<string>) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify([...set]));
}

interface AchievementsContextValue {
  achievements: Achievement[];
  unlocked: Set<string>;
  recentUnlock: string | null;
  dismissRecent: () => void;
}

const AchievementsContext = createContext<AchievementsContextValue | null>(null);

export function AchievementsProvider({ children }: { children: React.ReactNode }) {
  const { points, level, streak, completions } = useProgress();
  const [unlocked, setUnlocked] = useState<Set<string>>(() => readUnlocked());
  const [recentUnlock, setRecentUnlock] = useState<string | null>(null);

  const completedDays = Object.keys(completions).length;

  useEffect(() => {
    const ctx: AchievementContext = {
      points,
      streakDays: streak,
      completedDays,
      levelId: level.id,
    };

    let changed = false;
    const next = new Set(unlocked);
    let latest: string | null = null;

    for (const ach of ALL_ACHIEVEMENTS) {
      if (!next.has(ach.id) && ach.condition(ctx)) {
        next.add(ach.id);
        changed = true;
        latest = ach.id;
      }
    }

    if (changed) {
      setUnlocked(next);
      writeUnlocked(next);
      if (latest) setRecentUnlock(latest);
    }
  }, [points, streak, completedDays, level.id, unlocked]);

  const dismissRecent = useCallback(() => setRecentUnlock(null), []);

  const value = useMemo<AchievementsContextValue>(
    () => ({
      achievements: ALL_ACHIEVEMENTS,
      unlocked,
      recentUnlock,
      dismissRecent,
    }),
    [unlocked, recentUnlock, dismissRecent],
  );

  return <AchievementsContext.Provider value={value}>{children}</AchievementsContext.Provider>;
}

export function useAchievements() {
  const value = useContext(AchievementsContext);
  if (!value) throw new Error('useAchievements must be used within AchievementsProvider');
  return value;
}
