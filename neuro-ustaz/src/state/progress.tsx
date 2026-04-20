/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';

export interface TaskCompletion {
  dateKey: string; // YYYY-MM-DD
  taskId: string;
  points: number;
  completedAt: string;
}

interface ProgressState {
  points: number;
  completions: Record<string, TaskCompletion>; // dateKey -> completion
}

const STORAGE_KEY = 'neiroustaz_progress';

function safeParseJson<T>(raw: string | null): T | null {
  if (!raw) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

function readState(): ProgressState {
  const stored = safeParseJson<ProgressState>(window.localStorage.getItem(STORAGE_KEY));
  if (stored && typeof stored.points === 'number' && stored.completions && typeof stored.completions === 'object') {
    return stored;
  }
  return { points: 0, completions: {} };
}

function writeState(next: ProgressState) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
}

export interface LevelInfo {
  id: 'student' | 'teacher' | 'expert';
  minPoints: number;
}

const LEVELS: LevelInfo[] = [
  { id: 'student', minPoints: 0 },
  { id: 'teacher', minPoints: 50 },
  { id: 'expert', minPoints: 150 },
];

function getLevel(points: number): LevelInfo {
  const sorted = [...LEVELS].sort((a, b) => b.minPoints - a.minPoints);
  return sorted.find((level) => points >= level.minPoints) ?? LEVELS[0];
}

function formatDateKey(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function parseDateKey(dateKey: string): Date | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(dateKey);
  if (!match) return null;
  const [, y, m, d] = match;
  const date = new Date(Number(y), Number(m) - 1, Number(d));
  if (Number.isNaN(date.getTime())) return null;
  if (formatDateKey(date) !== dateKey) return null;
  return date;
}

function addDays(date: Date, days: number): Date {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

function computeStreak(completions: Record<string, TaskCompletion>): number {
  const todayKey = formatDateKey(new Date());
  const today = parseDateKey(todayKey);
  if (!today) return 0;

  let streak = 0;
  for (let offset = 0; offset < 365; offset += 1) {
    const key = formatDateKey(addDays(today, -offset));
    if (completions[key]) streak += 1;
    else break;
  }
  return streak;
}

interface ProgressContextValue {
  points: number;
  level: LevelInfo;
  streak: number;
  completions: Record<string, TaskCompletion>;
  completeDailyTask: (payload: { dateKey: string; taskId: string; points: number }) => { ok: true } | { ok: false };
  resetProgress: () => void;
}

const ProgressContext = createContext<ProgressContextValue | null>(null);

export function ProgressProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<ProgressState>(() => readState());

  const completeDailyTask: ProgressContextValue['completeDailyTask'] = useCallback(({ dateKey, taskId, points }) => {
    if (!parseDateKey(dateKey) || !taskId.trim() || !Number.isFinite(points) || points <= 0) {
      return { ok: false };
    }
    const current = readState();
    if (current.completions[dateKey]) return { ok: false };

    const completion: TaskCompletion = { dateKey, taskId, points, completedAt: new Date().toISOString() };
    const next: ProgressState = {
      points: current.points + points,
      completions: { ...current.completions, [dateKey]: completion },
    };
    writeState(next);
    setState(next);
    return { ok: true };
  }, []);

  const resetProgress = useCallback(() => {
    const next: ProgressState = { points: 0, completions: {} };
    setState(next);
    writeState(next);
  }, []);

  const value = useMemo<ProgressContextValue>(() => {
    return {
      points: state.points,
      level: getLevel(state.points),
      streak: computeStreak(state.completions),
      completions: state.completions,
      completeDailyTask,
      resetProgress,
    };
  }, [state.points, state.completions, completeDailyTask, resetProgress]);

  return <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>;
}

export function useProgress() {
  const value = useContext(ProgressContext);
  if (!value) throw new Error('useProgress must be used within ProgressProvider');
  return value;
}

export function getTodayKey(): string {
  return formatDateKey(new Date());
}
