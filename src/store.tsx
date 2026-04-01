import React, { createContext, useContext, useReducer, useEffect, useCallback, useRef, useMemo } from 'react';
import { AppState, DayLog, MorningPlan, QuickLog, EveningReview, WeeklyPlan, PillarId, Pillar } from './types';
import { defaultPillars } from './data/pillars';
import { format } from 'date-fns';

const STORAGE_KEY = 'life-compass-data';

function getToday(): string {
  return format(new Date(), 'yyyy-MM-dd');
}

function loadState(): AppState {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      // Merge with defaults in case new pillars/habits were added
      return {
        ...getDefaultState(),
        ...parsed,
        pillars: parsed.pillars || defaultPillars,
      };
    }
  } catch (e) {
    console.error('Failed to load state:', e);
  }
  return getDefaultState();
}

function getDefaultState(): AppState {
  return {
    userName: '',
    onboarded: false,
    pillars: defaultPillars,
    dayLogs: {},
    weeklyPlans: {},
    theme: 'auto',
  };
}

function ensureDayLog(state: AppState, date: string): DayLog {
  return state.dayLogs[date] || {
    date,
    morningPlan: null,
    quickLogs: [],
    eveningReview: null,
    habitCompletions: {},
  };
}

type Action =
  | { type: 'SET_THEME'; payload: 'light' | 'dark' | 'auto' }
  | { type: 'SAVE_MORNING_PLAN'; payload: { date: string; plan: MorningPlan } }
  | { type: 'ADD_QUICK_LOG'; payload: { date: string; log: QuickLog } }
  | { type: 'SAVE_EVENING_REVIEW'; payload: { date: string; review: EveningReview } }
  | { type: 'TOGGLE_HABIT'; payload: { date: string; habitId: string } }
  | { type: 'TOGGLE_MILESTONE'; payload: { goalId: string; milestoneId: string } }
  | { type: 'SAVE_WEEKLY_PLAN'; payload: WeeklyPlan }
  | { type: 'UPDATE_PILLARS'; payload: Pillar[] }
  | { type: 'SET_USER_NAME'; payload: string }
  | { type: 'COMPLETE_ONBOARDING' }
  | { type: 'RESET_STATE' };

function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'SET_THEME':
      return { ...state, theme: action.payload };

    case 'SAVE_MORNING_PLAN': {
      const { date, plan } = action.payload;
      const dayLog = ensureDayLog(state, date);
      return {
        ...state,
        dayLogs: {
          ...state.dayLogs,
          [date]: { ...dayLog, morningPlan: plan },
        },
      };
    }

    case 'ADD_QUICK_LOG': {
      const { date, log } = action.payload;
      const dayLog = ensureDayLog(state, date);
      return {
        ...state,
        dayLogs: {
          ...state.dayLogs,
          [date]: { ...dayLog, quickLogs: [...dayLog.quickLogs, log] },
        },
      };
    }

    case 'SAVE_EVENING_REVIEW': {
      const { date, review } = action.payload;
      const dayLog = ensureDayLog(state, date);
      return {
        ...state,
        dayLogs: {
          ...state.dayLogs,
          [date]: { ...dayLog, eveningReview: review },
        },
      };
    }

    case 'TOGGLE_HABIT': {
      const { date, habitId } = action.payload;
      const dayLog = ensureDayLog(state, date);
      return {
        ...state,
        dayLogs: {
          ...state.dayLogs,
          [date]: {
            ...dayLog,
            habitCompletions: {
              ...dayLog.habitCompletions,
              [habitId]: !dayLog.habitCompletions[habitId],
            },
          },
        },
      };
    }

    case 'TOGGLE_MILESTONE': {
      const { goalId, milestoneId } = action.payload;
      return {
        ...state,
        pillars: state.pillars.map(p => ({
          ...p,
          goals: p.goals.map(g => {
            if (g.id !== goalId) return g;
            return {
              ...g,
              milestones: g.milestones.map(m => {
                if (m.id !== milestoneId) return m;
                return {
                  ...m,
                  completed: !m.completed,
                  completedDate: !m.completed ? getToday() : undefined,
                };
              }),
            };
          }),
        })),
      };
    }

    case 'SAVE_WEEKLY_PLAN':
      return {
        ...state,
        weeklyPlans: {
          ...state.weeklyPlans,
          [action.payload.weekStart]: action.payload,
        },
      };

    case 'UPDATE_PILLARS':
      return { ...state, pillars: action.payload };

    case 'SET_USER_NAME':
      return { ...state, userName: action.payload };

    case 'COMPLETE_ONBOARDING': {
      // Seed mock data so the dashboard looks alive
      const t = getToday();
      const d = new Date();
      const dailyHabits = state.pillars.flatMap(p => p.habits.filter(h => h.frequency === 'daily'));
      // Today starts fresh — no habits pre-checked
      // Build 5 days of history for streaks
      const seededLogs: Record<string, DayLog> = {};
      for (let i = 1; i <= 5; i++) {
        const pd = new Date(d);
        pd.setDate(pd.getDate() - i);
        const ds = format(pd, 'yyyy-MM-dd');
        const hc: Record<string, boolean> = {};
        dailyHabits.forEach((h, j) => { if ((j + i) % 4 !== 0) hc[h.id] = true; });
        seededLogs[ds] = { date: ds, morningPlan: null, quickLogs: [], eveningReview: null, habitCompletions: hc };
      }
      // Today starts empty — user fills it in themselves
      seededLogs[t] = {
        date: t,
        morningPlan: null,
        quickLogs: [],
        eveningReview: null,
        habitCompletions: {},
      };
      // Mark a few milestones as done
      const seededPillars = state.pillars.map(p => ({
        ...p,
        goals: p.goals.map((g, gi) => ({
          ...g,
          milestones: g.milestones.map((m, mi) => mi === 0 && gi === 0 ? { ...m, completed: true, completedDate: t } : m),
        })),
      }));
      return { ...state, onboarded: true, pillars: seededPillars, dayLogs: { ...state.dayLogs, ...seededLogs } };
    }

    case 'RESET_STATE':
      return getDefaultState();

    default:
      return state;
  }
}

interface StoreContextType {
  state: AppState;
  dispatch: React.Dispatch<Action>;
  today: string;
  todayLog: DayLog;
  getAllHabits: () => { habit: { id: string; title: string; frequency: string; icon?: string; pillarId: PillarId }; pillarName: string; pillarColor: string }[];
  getHabitStreak: (habitId: string) => number;
  getDayCompletionRate: (date: string) => number;
}

const StoreContext = createContext<StoreContextType | null>(null);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, undefined, loadState);
  const today = getToday();
  const todayLog = ensureDayLog(state, today);

  // Debounced localStorage persistence (300ms)
  const saveTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    if (saveTimeout.current) clearTimeout(saveTimeout.current);
    saveTimeout.current = setTimeout(() => {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      } catch (e) {
        console.error('Failed to save state:', e);
      }
    }, 300);
    return () => { if (saveTimeout.current) clearTimeout(saveTimeout.current); };
  }, [state]);

  const getAllHabits = useCallback(() => {
    return state.pillars.flatMap(p =>
      p.habits.map(h => ({
        habit: h,
        pillarName: p.name,
        pillarColor: p.color,
      }))
    );
  }, [state.pillars]);

  const MAX_STREAK_LOOKBACK = 60;
  const getHabitStreak = useCallback((habitId: string) => {
    let streak = 0;
    for (let i = 0; i < MAX_STREAK_LOOKBACK; i++) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = format(d, 'yyyy-MM-dd');
      const log = state.dayLogs[dateStr];
      if (log?.habitCompletions[habitId]) {
        streak++;
      } else if (i > 0) {
        break;
      }
    }
    return streak;
  }, [state.dayLogs]);

  const dailyHabits = useMemo(
    () => state.pillars.flatMap(p => p.habits.filter(h => h.frequency === 'daily')),
    [state.pillars]
  );

  const getDayCompletionRate = useCallback((date: string) => {
    const log = state.dayLogs[date];
    if (!log || dailyHabits.length === 0) return 0;
    const completed = dailyHabits.filter(h => log.habitCompletions[h.id]).length;
    return Math.round((completed / dailyHabits.length) * 100);
  }, [state.dayLogs, dailyHabits]);

  return (
    <StoreContext.Provider value={{ state, dispatch, today, todayLog, getAllHabits, getHabitStreak, getDayCompletionRate }}>
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be used within StoreProvider');
  return ctx;
}
