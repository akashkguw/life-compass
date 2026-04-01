import React, { useMemo, useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import {
  Rocket, GraduationCap, Heart, Home, Activity,
  Check, Sun, Moon, Flame, Target, Zap, Users,
  DollarSign, TrendingUp, Sparkles, Compass,
  Trash2, X, BarChart3,
} from 'lucide-react';
import { useStore } from '../store';
import { PillarId } from '../types';

const pillarIcons: Record<string, React.FC<any>> = {
  career: Rocket, education: GraduationCap, family: Heart, home: Home, health: Activity,
  skills: Zap, networking: Users, finance: DollarSign, wellness: Activity,
  academics: GraduationCap, 'career-prep': Target, social: Users,
  'personal-growth': TrendingUp, creativity: Sparkles, spirituality: Compass,
  'side-project': Rocket,
};

function getGreeting(): string {
  const h = new Date().getHours();
  if (h < 6) return 'Rest well';
  if (h < 12) return 'Good morning';
  if (h < 18) return 'Good afternoon';
  return 'Good evening';
}

function getMotivation(pct: number): string {
  if (pct === 0) return 'A fresh start awaits';
  if (pct < 25) return 'Building momentum';
  if (pct < 50) return 'Making progress';
  if (pct < 75) return 'Strong momentum today';
  if (pct < 100) return 'Almost there';
  return 'Perfect day';
}

function MiniRing({ size, stroke, pct, color }: { size: number; stroke: number; pct: number; color: string }) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="var(--border-light)" strokeWidth={stroke} opacity=".3" />
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={stroke}
        strokeDasharray={c} strokeDashoffset={c * (1 - pct / 100)} strokeLinecap="round"
        style={{ transform: 'rotate(-90deg)', transformOrigin: '50% 50%', transition: 'stroke-dashoffset .5s ease' }}
      />
    </svg>
  );
}

/* ── Habit health status ── */
type HabitHealth = 'good' | 'warning' | 'danger';

function getHabitHealth(daysSinceLastDone: number | null, streak: number): HabitHealth {
  // Never done or 5+ days since last done → danger
  if (daysSinceLastDone === null || daysSinceLastDone >= 5) return 'danger';
  // 3-4 days → warning
  if (daysSinceLastDone >= 3) return 'warning';
  // Done recently
  return 'good';
}

function getHealthLabel(health: HabitHealth, daysSinceLastDone: number | null): string {
  if (health === 'danger') {
    if (daysSinceLastDone === null) return 'Never completed';
    return `${daysSinceLastDone}d inactive — needs attention`;
  }
  if (health === 'warning') return `${daysSinceLastDone}d ago — slipping`;
  return 'On track';
}

interface LongPressInfo {
  habitId: string;
  habitTitle: string;
  pillarName: string;
  pillarColor: string;
}

export default function Dashboard() {
  const navigate = useNavigate();
  const { state, dispatch, todayLog, getAllHabits, getDayCompletionRate, getHabitStreak, getHabitHistory, today } = useStore();

  // Long-press state
  const [longPressInfo, setLongPressInfo] = useState<LongPressInfo | null>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const pressTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pressStartRef = useRef(false);

  const dayCompletion = useMemo(() => getDayCompletionRate(today), [today, getDayCompletionRate]);
  const allHabits = useMemo(() => getAllHabits(), [getAllHabits]);
  const habitsDone = useMemo(
    () => Object.values(todayLog.habitCompletions || {}).filter(Boolean).length,
    [todayLog.habitCompletions]
  );
  const morningDone = !!todayLog.morningPlan;
  const eveningDone = !!todayLog.eveningReview;

  const bestStreak = useMemo(() => {
    let max = 0;
    allHabits.forEach(({ habit }) => { const s = getHabitStreak(habit.id); if (s > max) max = s; });
    return max;
  }, [allHabits, getHabitStreak]);

  const milestones = useMemo(() => {
    const all = state.pillars.flatMap(p => (p.goals || []).flatMap(g => g.milestones || []));
    return { done: all.filter(m => m.completed).length, total: all.length };
  }, [state.pillars]);

  const habitPct = allHabits.length > 0 ? Math.round((habitsDone / allHabits.length) * 100) : 0;

  const handleHabitToggle = (habitId: string) => {
    if (longPressInfo) return; // Don't toggle if long-press sheet is open
    dispatch({ type: 'TOGGLE_HABIT', payload: { date: today, habitId } });
  };

  // ── Long-press handlers ──
  const startPress = useCallback((info: LongPressInfo) => {
    pressStartRef.current = true;
    pressTimerRef.current = setTimeout(() => {
      if (pressStartRef.current) {
        setLongPressInfo(info);
        setConfirmDelete(false);
        // Vibrate for tactile feedback if available
        if (navigator.vibrate) navigator.vibrate(30);
      }
    }, 500);
  }, []);

  const cancelPress = useCallback(() => {
    pressStartRef.current = false;
    if (pressTimerRef.current) {
      clearTimeout(pressTimerRef.current);
      pressTimerRef.current = null;
    }
  }, []);

  const handleDelete = () => {
    if (!longPressInfo) return;
    if (!confirmDelete) {
      setConfirmDelete(true);
      return;
    }
    dispatch({ type: 'REMOVE_HABIT', payload: { habitId: longPressInfo.habitId } });
    setLongPressInfo(null);
    setConfirmDelete(false);
  };

  // Get history for long-press sheet
  const sheetHistory = longPressInfo ? getHabitHistory(longPressInfo.habitId) : null;
  const sheetStreak = longPressInfo ? getHabitStreak(longPressInfo.habitId) : 0;

  return (
    <div className="dashboard">

      {/* ── HERO ── */}
      <section className="hero">
        <div className="hero-bg-orb hero-orb-1" />
        <div className="hero-bg-orb hero-orb-2" />
        <div className="hero-row">
          <div className="hero-text">
            <p className="hero-date">{format(new Date(), 'EEE, MMM d')}</p>
            <h1 className="hero-greeting">{getGreeting()}, {state.userName || 'there'}</h1>
            <p className="hero-motive">{getMotivation(dayCompletion)}</p>
          </div>
          <div className="hero-ring">
            <MiniRing size={72} stroke={7} pct={dayCompletion} color="#6366f1" />
            <span className="hero-ring-pct">{Math.round(dayCompletion)}%</span>
          </div>
        </div>
        <div className="hero-strip">
          <div className="hs-chip">
            <Check size={11} strokeWidth={3} className="hs-icon hs-green" />
            <span className="hs-val">{habitsDone}/{allHabits.length}</span>
          </div>
          <div className="hs-chip">
            <Flame size={11} className="hs-icon hs-amber" />
            <span className="hs-val">{bestStreak}d</span>
          </div>
          <div className="hs-chip">
            <Target size={11} className="hs-icon hs-purple" />
            <span className="hs-val">{milestones.done}/{milestones.total}</span>
          </div>
          <div className="hs-dot-group">
            <div className={`hs-ritual ${morningDone ? 'hs-ritual-done' : ''}`} onClick={() => navigate('/daily')}
              role="button" tabIndex={0} aria-label={`Morning ritual ${morningDone ? 'completed' : 'pending'}`}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') navigate('/daily'); }}>
              <Sun size={11} />
            </div>
            <div className={`hs-ritual ${eveningDone ? 'hs-ritual-done' : ''}`} onClick={() => navigate('/daily')}
              role="button" tabIndex={0} aria-label={`Evening ritual ${eveningDone ? 'completed' : 'pending'}`}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') navigate('/daily'); }}>
              <Moon size={11} />
            </div>
          </div>
        </div>
      </section>

      {/* ── HABITS ── */}
      <section className="habits-section">
        <div className="habits-header">
          <span className="habits-title">Today's Habits</span>
          <div className="habits-prog">
            <MiniRing size={24} stroke={3} pct={habitPct} color="#6366f1" />
            <span className="habits-fraction">{habitsDone}/{allHabits.length}</span>
          </div>
        </div>
        <div className="habit-grid">
          {allHabits.map(({ habit, pillarName, pillarColor }, i) => {
            const done = todayLog.habitCompletions?.[habit.id] || false;
            const streak = getHabitStreak(habit.id);
            const history = getHabitHistory(habit.id);
            const health: HabitHealth = done ? 'good' : getHabitHealth(history.daysSinceLastDone, streak);

            return (
              <div key={habit.id}
                className={[
                  'habit-tile',
                  done && 'ht-done',
                  !done && health === 'danger' && 'ht-danger',
                  !done && health === 'warning' && 'ht-warning',
                ].filter(Boolean).join(' ')}
                onClick={() => handleHabitToggle(habit.id)}
                onTouchStart={() => startPress({ habitId: habit.id, habitTitle: habit.title, pillarName, pillarColor })}
                onTouchEnd={cancelPress}
                onTouchCancel={cancelPress}
                onMouseDown={() => startPress({ habitId: habit.id, habitTitle: habit.title, pillarName, pillarColor })}
                onMouseUp={cancelPress}
                onMouseLeave={cancelPress}
                onContextMenu={(e) => e.preventDefault()}
                role="checkbox" aria-checked={done} aria-label={habit.title} tabIndex={0}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleHabitToggle(habit.id); }}
                style={{ animationDelay: `${i * 25}ms` }}
              >
                <div className="habit-tile-accent" style={{ background: pillarColor }} />
                <div className="habit-tile-body">
                  <span className="habit-tile-emoji">{habit.icon || '✦'}</span>
                  <span className={`habit-tile-name ${done ? 'habit-tile-name-done' : ''}`}>{habit.title}</span>
                  {streak > 0 && <span className="habit-tile-streak"><Flame size={8} /> {streak}d</span>}
                </div>
                {done && <div className="habit-tile-flash" style={{ background: pillarColor }} />}
              </div>
            );
          })}
        </div>
      </section>

      {/* ── PILLARS ── */}
      <section>
        <div className="habits-header" style={{ marginBottom: 8 }}>
          <span className="habits-title">Life Pillars</span>
        </div>
        <div className="pillar-scroll">
          {state.pillars.map((pillar) => {
            const ms = (pillar.goals || []).flatMap(g => g.milestones || []);
            const pct = ms.length > 0 ? Math.round(ms.filter(m => m.completed).length / ms.length * 100) : 0;
            const Icon = pillarIcons[pillar.id as PillarId] || Activity;
            return (
              <div key={pillar.id} className="pillar-mini" onClick={() => navigate(`/pillar/${pillar.id}`)}
                role="button" tabIndex={0} aria-label={`${pillar.name} — ${pct}% complete`}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') navigate(`/pillar/${pillar.id}`); }}>
                <div className="pillar-mini-icon" style={{ background: pillar.gradient }}>
                  <Icon size={15} color="white" />
                </div>
                <span className="pillar-mini-name">{pillar.name}</span>
                <div className="pillar-mini-bar">
                  <div className="pillar-mini-fill" style={{ width: `${pct}%`, background: pillar.gradient }} />
                </div>
                <span className="pillar-mini-pct">{pct}%</span>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── LONG-PRESS BOTTOM SHEET ── */}
      {longPressInfo && sheetHistory && (
        <div className="ht-sheet-overlay" onClick={() => { setLongPressInfo(null); setConfirmDelete(false); }}>
          <div className="ht-sheet" onClick={(e) => e.stopPropagation()}>
            {/* Header */}
            <div className="ht-sheet-head">
              <div className="ht-sheet-title-row">
                <span className="ht-sheet-emoji">{allHabits.find(h => h.habit.id === longPressInfo.habitId)?.habit.icon || '✦'}</span>
                <div className="ht-sheet-titles">
                  <span className="ht-sheet-name">{longPressInfo.habitTitle}</span>
                  <span className="ht-sheet-pillar" style={{ color: longPressInfo.pillarColor }}>{longPressInfo.pillarName}</span>
                </div>
              </div>
              <button className="ht-sheet-close" onClick={() => { setLongPressInfo(null); setConfirmDelete(false); }}
                aria-label="Close">
                <X size={16} />
              </button>
            </div>

            {/* Stats row */}
            <div className="ht-sheet-stats">
              <div className="ht-stat">
                <Flame size={14} className="ht-stat-icon" style={{ color: '#f59e0b' }} />
                <span className="ht-stat-val">{sheetStreak}d</span>
                <span className="ht-stat-label">streak</span>
              </div>
              <div className="ht-stat">
                <BarChart3 size={14} className="ht-stat-icon" style={{ color: '#6366f1' }} />
                <span className="ht-stat-val">{sheetHistory.pct}%</span>
                <span className="ht-stat-label">all-time</span>
              </div>
              <div className="ht-stat">
                <Check size={14} className="ht-stat-icon" style={{ color: '#10b981' }} />
                <span className="ht-stat-val">{sheetHistory.last7}/7</span>
                <span className="ht-stat-label">this week</span>
              </div>
              <div className="ht-stat">
                <Target size={14} className="ht-stat-icon" style={{ color: '#8b5cf6' }} />
                <span className="ht-stat-val">{sheetHistory.longestStreak}d</span>
                <span className="ht-stat-label">best streak</span>
              </div>
            </div>

            {/* Health status line */}
            {(() => {
              const health = getHabitHealth(sheetHistory.daysSinceLastDone, sheetStreak);
              const label = getHealthLabel(health, sheetHistory.daysSinceLastDone);
              return (
                <div className={`ht-sheet-health ht-health-${health}`}>
                  <span className="ht-health-dot" />
                  {label}
                </div>
              );
            })()}

            {/* Delete */}
            <button className={`ht-sheet-delete ${confirmDelete ? 'ht-sheet-delete-confirm' : ''}`}
              onClick={handleDelete}>
              <Trash2 size={14} />
              {confirmDelete ? 'Confirm delete' : 'Remove habit'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
