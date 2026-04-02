import React, { useMemo, useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import {
  Rocket, GraduationCap, Heart, Home, Activity,
  Check, Sun, Moon, Flame, Target, Zap, Users,
  DollarSign, TrendingUp, Sparkles, Compass,
  Trash2, X, BarChart3, Plus, ChevronUp, ChevronDown,
} from 'lucide-react';
import { useStore } from '../store';
import { PillarId, HabitPriority } from '../types';

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

type HabitHealth = 'good' | 'warning' | 'danger';

function getHabitHealth(daysSinceLastDone: number | null, streak: number): HabitHealth {
  if (daysSinceLastDone === null || daysSinceLastDone >= 5) return 'danger';
  if (daysSinceLastDone >= 3) return 'warning';
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

const PRIORITY_LABELS: Record<HabitPriority, string> = { high: '🔴 High', medium: '🟡 Medium', low: '🟢 Low' };
const PRIORITY_COLORS: Record<HabitPriority, string> = { high: '#ef4444', medium: '#f59e0b', low: '#22c55e' };

const EMOJI_OPTIONS = ['✦', '📚', '💪', '🧘', '💧', '🎯', '🏃', '📝', '💤', '🥗', '🎨', '🤝', '💰', '🧠', '🏠', '📱', '🎵', '🌿'];

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

  // Add habit modal
  const [showAddHabit, setShowAddHabit] = useState(false);
  const [addPillarId, setAddPillarId] = useState('');
  const [addTitle, setAddTitle] = useState('');
  const [addIcon, setAddIcon] = useState('✦');
  const [addFreq, setAddFreq] = useState<'daily' | 'weekly'>('daily');

  // Morning/evening modals (direct from dashboard)
  const [showMorningModal, setShowMorningModal] = useState(false);
  const [showEveningModal, setShowEveningModal] = useState(false);
  const [morningForm, setMorningForm] = useState({ priorities: ['', '', ''], intention: '', energyLevel: 0 });
  const [eveningForm, setEveningForm] = useState({ wins: [''], challenges: [''], gratitude: '', tomorrowFocus: '', overallRating: 0 });

  const dayCompletion = useMemo(() => getDayCompletionRate(today), [today, getDayCompletionRate]);
  const allHabits = useMemo(() => getAllHabits(today), [getAllHabits, today]);
  const habitsDone = useMemo(
    () => allHabits.filter(({ habit }) => todayLog.habitCompletions?.[habit.id]).length,
    [todayLog.habitCompletions, allHabits]
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

  // Group habits by pillar
  const habitsByPillar = useMemo(() => {
    const map: Record<string, typeof allHabits> = {};
    allHabits.forEach(h => {
      const pid = h.habit.pillarId;
      if (!map[pid]) map[pid] = [];
      map[pid].push(h);
    });
    return map;
  }, [allHabits]);

  const handleHabitToggle = (habitId: string) => {
    if (longPressInfo) return;
    dispatch({ type: 'TOGGLE_HABIT', payload: { date: today, habitId } });
  };

  // Long-press handlers
  const startPress = useCallback((info: LongPressInfo) => {
    pressStartRef.current = true;
    pressTimerRef.current = setTimeout(() => {
      if (pressStartRef.current) {
        setLongPressInfo(info);
        setConfirmDelete(false);
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
    if (!confirmDelete) { setConfirmDelete(true); return; }
    dispatch({ type: 'REMOVE_HABIT', payload: { habitId: longPressInfo.habitId } });
    setLongPressInfo(null);
    setConfirmDelete(false);
  };

  const handleSetPriority = (priority: HabitPriority) => {
    if (!longPressInfo) return;
    dispatch({ type: 'SET_HABIT_PRIORITY', payload: { habitId: longPressInfo.habitId, priority } });
  };

  const handleAddHabit = () => {
    if (!addTitle.trim() || !addPillarId) return;
    dispatch({ type: 'ADD_HABIT', payload: { pillarId: addPillarId, title: addTitle.trim(), icon: addIcon, frequency: addFreq } });
    setShowAddHabit(false);
    setAddTitle('');
    setAddIcon('✦');
    setAddPillarId('');
    setAddFreq('daily');
  };

  const handleSaveMorning = () => {
    dispatch({ type: 'SAVE_MORNING_PLAN', payload: { date: today, plan: {
      topPriorities: morningForm.priorities.filter(p => p.trim()),
      intentions: morningForm.intention,
      energyLevel: morningForm.energyLevel,
      timestamp: new Date().toISOString(),
    }}});
    setShowMorningModal(false);
    setMorningForm({ priorities: ['', '', ''], intention: '', energyLevel: 0 });
  };

  const handleSaveEvening = () => {
    dispatch({ type: 'SAVE_EVENING_REVIEW', payload: { date: today, review: {
      wins: eveningForm.wins.filter(w => w.trim()),
      challenges: eveningForm.challenges.filter(c => c.trim()),
      gratitude: eveningForm.gratitude,
      tomorrowFocus: eveningForm.tomorrowFocus,
      overallRating: eveningForm.overallRating,
      timestamp: new Date().toISOString(),
    }}});
    setShowEveningModal(false);
    setEveningForm({ wins: [''], challenges: [''], gratitude: '', tomorrowFocus: '', overallRating: 0 });
  };

  const sheetHistory = longPressInfo ? getHabitHistory(longPressInfo.habitId) : null;
  const sheetStreak = longPressInfo ? getHabitStreak(longPressInfo.habitId) : 0;
  const sheetHabit = longPressInfo ? allHabits.find(h => h.habit.id === longPressInfo.habitId)?.habit : null;

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
            <div className={`hs-ritual ${morningDone ? 'hs-ritual-done' : ''}`}
              onClick={() => morningDone ? navigate('/daily') : setShowMorningModal(true)}
              role="button" tabIndex={0} aria-label={`Morning ritual ${morningDone ? 'completed' : 'pending'}`}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') morningDone ? navigate('/daily') : setShowMorningModal(true); }}>
              <Sun size={11} />
            </div>
            <div className={`hs-ritual ${eveningDone ? 'hs-ritual-done' : ''}`}
              onClick={() => eveningDone ? navigate('/daily') : setShowEveningModal(true)}
              role="button" tabIndex={0} aria-label={`Evening ritual ${eveningDone ? 'completed' : 'pending'}`}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') eveningDone ? navigate('/daily') : setShowEveningModal(true); }}>
              <Moon size={11} />
            </div>
          </div>
        </div>
      </section>

      {/* ── MORNING CTA (if not done) ── */}
      {!morningDone && (
        <section className="ritual-cta-card" onClick={() => setShowMorningModal(true)}>
          <div className="ritual-cta-glow ritual-morning-glow" />
          <div className="ritual-cta-inner">
            <div className="ritual-cta-icon-wrap ritual-morning"><Sun size={20} /></div>
            <div className="ritual-cta-text">
              <strong>Start Your Morning</strong>
              <span>Set today's priorities & intentions</span>
            </div>
            <ChevronUp size={18} className="ritual-cta-arrow" />
          </div>
        </section>
      )}

      {/* ── HABITS BY PILLAR ── */}
      <section className="habits-section">
        <div className="habits-header">
          <span className="habits-title">Today's Habits</span>
          <div className="habits-header-right">
            <div className="habits-prog">
              <MiniRing size={24} stroke={3} pct={habitPct} color="#6366f1" />
              <span className="habits-fraction">{habitsDone}/{allHabits.length}</span>
            </div>
            <button className="habits-add-btn" onClick={() => setShowAddHabit(true)} aria-label="Add habit">
              <Plus size={16} />
            </button>
          </div>
        </div>

        {state.pillars.map(pillar => {
          const pillarHabits = habitsByPillar[pillar.id];
          if (!pillarHabits || pillarHabits.length === 0) return null;
          const Icon = pillarIcons[pillar.id] || Activity;
          const pillarDone = pillarHabits.filter(({ habit }) => todayLog.habitCompletions?.[habit.id]).length;

          return (
            <div key={pillar.id} className="pillar-habit-widget">
              <div className="phw-header">
                <div className="phw-icon" style={{ background: pillar.gradient }}>
                  <Icon size={13} color="white" />
                </div>
                <span className="phw-name">{pillar.name}</span>
                <span className="phw-count">{pillarDone}/{pillarHabits.length}</span>
              </div>
              <div className="phw-habits">
                {pillarHabits.map(({ habit, pillarName, pillarColor }, i) => {
                  const done = todayLog.habitCompletions?.[habit.id] || false;
                  const streak = getHabitStreak(habit.id);
                  const history = getHabitHistory(habit.id);
                  const health: HabitHealth = done ? 'good' : getHabitHealth(history.daysSinceLastDone, streak);
                  const priorityDot = habit.priority === 'high' ? '#ef4444' : habit.priority === 'low' ? '#22c55e' : undefined;

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
                        {priorityDot && <span className="habit-tile-priority-dot" style={{ background: priorityDot }} />}
                        {streak > 0 && <span className="habit-tile-streak"><Flame size={8} /> {streak}d</span>}
                      </div>
                      {done && <div className="habit-tile-flash" style={{ background: pillarColor }} />}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </section>

      {/* ── EVENING CTA (if not done) ── */}
      {!eveningDone && new Date().getHours() >= 17 && (
        <section className="ritual-cta-card" onClick={() => setShowEveningModal(true)}>
          <div className="ritual-cta-glow ritual-evening-glow" />
          <div className="ritual-cta-inner">
            <div className="ritual-cta-icon-wrap ritual-evening"><Moon size={20} /></div>
            <div className="ritual-cta-text">
              <strong>Wind Down & Reflect</strong>
              <span>Review wins, challenges & gratitude</span>
            </div>
            <ChevronDown size={18} className="ritual-cta-arrow" />
          </div>
        </section>
      )}

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
            <div className="ht-sheet-head">
              <div className="ht-sheet-title-row">
                <span className="ht-sheet-emoji">{sheetHabit?.icon || '✦'}</span>
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

            {/* Stats */}
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

            {/* Health */}
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

            {/* Priority selector */}
            <div className="ht-sheet-priority">
              <span className="ht-sheet-priority-label">Priority</span>
              <div className="ht-priority-btns">
                {(['high', 'medium', 'low'] as HabitPriority[]).map(p => (
                  <button key={p} className={`ht-priority-btn ${sheetHabit?.priority === p ? 'ht-priority-active' : ''}`}
                    style={sheetHabit?.priority === p ? { background: PRIORITY_COLORS[p] + '18', borderColor: PRIORITY_COLORS[p], color: PRIORITY_COLORS[p] } : {}}
                    onClick={() => handleSetPriority(p)}>
                    {PRIORITY_LABELS[p]}
                  </button>
                ))}
              </div>
            </div>

            {/* Delete */}
            <button className={`ht-sheet-delete ${confirmDelete ? 'ht-sheet-delete-confirm' : ''}`}
              onClick={handleDelete}>
              <Trash2 size={14} />
              {confirmDelete ? 'Confirm delete' : 'Remove habit'}
            </button>
          </div>
        </div>
      )}

      {/* ── ADD HABIT MODAL ── */}
      {showAddHabit && (
        <div className="modal-overlay" onClick={() => setShowAddHabit(false)}>
          <div className="modal-panel" onClick={e => e.stopPropagation()}>
            <div className="modal-handle" />
            <button className="modal-close-btn" onClick={() => setShowAddHabit(false)} aria-label="Close"><X size={18} /></button>
            <div className="modal-title">Add Habit</div>
            <div className="modal-subtitle">This habit will appear for all future days</div>
            <form className="modal-form" onSubmit={e => { e.preventDefault(); handleAddHabit(); }}>
              <div className="form-group">
                <label className="form-label">Pillar</label>
                <div className="add-habit-pillars">
                  {state.pillars.map(p => (
                    <button key={p.id} type="button"
                      className={`add-habit-pillar-btn ${addPillarId === p.id ? 'add-habit-pillar-active' : ''}`}
                      style={addPillarId === p.id ? { borderColor: p.color, background: p.color + '15', color: p.color } : {}}
                      onClick={() => setAddPillarId(p.id)}>
                      {p.name}
                    </button>
                  ))}
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Habit Name</label>
                <input className="form-input" type="text" placeholder="e.g. Read for 20 min" value={addTitle}
                  onChange={e => setAddTitle(e.target.value)} maxLength={60} />
              </div>
              <div className="form-group">
                <label className="form-label">Icon</label>
                <div className="add-habit-emojis">
                  {EMOJI_OPTIONS.map(e => (
                    <button key={e} type="button" className={`add-habit-emoji ${addIcon === e ? 'add-habit-emoji-active' : ''}`}
                      onClick={() => setAddIcon(e)}>{e}</button>
                  ))}
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Frequency</label>
                <div className="add-habit-freq">
                  <button type="button" className={`add-habit-freq-btn ${addFreq === 'daily' ? 'add-habit-freq-active' : ''}`}
                    onClick={() => setAddFreq('daily')}>Daily</button>
                  <button type="button" className={`add-habit-freq-btn ${addFreq === 'weekly' ? 'add-habit-freq-active' : ''}`}
                    onClick={() => setAddFreq('weekly')}>Weekly</button>
                </div>
              </div>
              <button type="submit" className="btn-primary btn-full" disabled={!addTitle.trim() || !addPillarId}>
                Add Habit
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ── MORNING MODAL ── */}
      {showMorningModal && (
        <div className="modal-overlay" onClick={() => setShowMorningModal(false)}>
          <div className="modal-panel" onClick={e => e.stopPropagation()}>
            <div className="modal-handle" />
            <button className="modal-close-btn" onClick={() => setShowMorningModal(false)} aria-label="Close"><X size={18} /></button>
            <div className="modal-title">Start Your Morning</div>
            <div className="modal-subtitle">Set your intentions for the day</div>
            <form className="modal-form">
              <div className="form-group">
                <label className="form-label">Top 3 Priorities</label>
                {morningForm.priorities.map((p, idx) => (
                  <input key={idx} type="text" placeholder={`Priority ${idx + 1}`} value={p}
                    maxLength={200}
                    onChange={e => { const u = [...morningForm.priorities]; u[idx] = e.target.value; setMorningForm({ ...morningForm, priorities: u }); }}
                    className="form-input" />
                ))}
              </div>
              <div className="form-group">
                <label className="form-label">Today's Intention</label>
                <textarea placeholder="What's your main intention today?" value={morningForm.intention}
                  onChange={e => setMorningForm({ ...morningForm, intention: e.target.value })} className="form-textarea" rows={3} />
              </div>
              <div className="form-group">
                <label className="form-label">Energy Level</label>
                <div className="rating-row">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <button key={i} type="button" className={`rating-star ${i < morningForm.energyLevel ? 'active' : ''}`}
                      onClick={() => setMorningForm({ ...morningForm, energyLevel: i + 1 })}>★</button>
                  ))}
                </div>
              </div>
              <button type="button" className="btn-primary btn-full" onClick={handleSaveMorning}>
                Save Morning Plan
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ── EVENING MODAL ── */}
      {showEveningModal && (
        <div className="modal-overlay" onClick={() => setShowEveningModal(false)}>
          <div className="modal-panel" onClick={e => e.stopPropagation()}>
            <div className="modal-handle" />
            <button className="modal-close-btn" onClick={() => setShowEveningModal(false)} aria-label="Close"><X size={18} /></button>
            <div className="modal-title">Wind Down & Reflect</div>
            <div className="modal-subtitle">Review your day and plan ahead</div>
            <form className="modal-form">
              <div className="form-group">
                <label className="form-label">Wins</label>
                {eveningForm.wins.map((w, idx) => (
                  <div key={idx} className="dynamic-input">
                    <input type="text" placeholder={`Win ${idx + 1}`} value={w}
                      onChange={e => { const u = [...eveningForm.wins]; u[idx] = e.target.value; setEveningForm({ ...eveningForm, wins: u }); }} className="form-input" />
                    {eveningForm.wins.length > 1 && (
                      <button type="button" className="btn-remove" onClick={() => setEveningForm({ ...eveningForm, wins: eveningForm.wins.filter((_, i) => i !== idx) })}><X size={16} /></button>
                    )}
                  </div>
                ))}
                <button type="button" className="btn-add" onClick={() => setEveningForm({ ...eveningForm, wins: [...eveningForm.wins, ''] })}><Plus size={16} /> Add Win</button>
              </div>
              <div className="form-group">
                <label className="form-label">Challenges</label>
                {eveningForm.challenges.map((c, idx) => (
                  <div key={idx} className="dynamic-input">
                    <input type="text" placeholder={`Challenge ${idx + 1}`} value={c}
                      onChange={e => { const u = [...eveningForm.challenges]; u[idx] = e.target.value; setEveningForm({ ...eveningForm, challenges: u }); }} className="form-input" />
                    {eveningForm.challenges.length > 1 && (
                      <button type="button" className="btn-remove" onClick={() => setEveningForm({ ...eveningForm, challenges: eveningForm.challenges.filter((_, i) => i !== idx) })}><X size={16} /></button>
                    )}
                  </div>
                ))}
                <button type="button" className="btn-add" onClick={() => setEveningForm({ ...eveningForm, challenges: [...eveningForm.challenges, ''] })}><Plus size={16} /> Add Challenge</button>
              </div>
              <div className="form-group">
                <label className="form-label">Gratitude</label>
                <textarea placeholder="What are you grateful for today?" value={eveningForm.gratitude}
                  onChange={e => setEveningForm({ ...eveningForm, gratitude: e.target.value })} className="form-textarea" rows={3} />
              </div>
              <div className="form-group">
                <label className="form-label">Tomorrow's Focus</label>
                <textarea placeholder="What do you want to focus on tomorrow?" value={eveningForm.tomorrowFocus}
                  onChange={e => setEveningForm({ ...eveningForm, tomorrowFocus: e.target.value })} className="form-textarea" rows={3} />
              </div>
              <div className="form-group">
                <label className="form-label">Overall Rating</label>
                <div className="rating-row">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <button key={i} type="button" className={`rating-star ${i < eveningForm.overallRating ? 'active' : ''}`}
                      onClick={() => setEveningForm({ ...eveningForm, overallRating: i + 1 })}>★</button>
                  ))}
                </div>
              </div>
              <button type="button" className="btn-primary btn-full" onClick={handleSaveEvening}>
                Save Evening Review
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
