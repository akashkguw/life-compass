import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import {
  Rocket, GraduationCap, Heart, Home, Activity,
  Check, Sun, Moon, Flame, Target, Zap, Users,
  DollarSign, TrendingUp, Sparkles, Compass,
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

/* Tiny inline SVG ring */
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

export default function Dashboard() {
  const navigate = useNavigate();
  const { state, dispatch, todayLog, getAllHabits, getDayCompletionRate, getHabitStreak, today } = useStore();

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
    dispatch({ type: 'TOGGLE_HABIT', payload: { date: today, habitId } });
  };

  return (
    <div className="dashboard">

      {/* ── HERO — compact: greeting row + stats strip ── */}
      <section className="hero">
        <div className="hero-bg-orb hero-orb-1" />
        <div className="hero-bg-orb hero-orb-2" />

        {/* Row 1: greeting + progress ring */}
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

        {/* Row 2: 4 stat chips + 2 ritual dots */}
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

      {/* ── HABITS — header + compact grid ── */}
      <section className="habits-section">
        <div className="habits-header">
          <span className="habits-title">Today's Habits</span>
          <div className="habits-prog">
            <MiniRing size={24} stroke={3} pct={habitPct} color="#6366f1" />
            <span className="habits-fraction">{habitsDone}/{allHabits.length}</span>
          </div>
        </div>
        <div className="habit-grid">
          {allHabits.map(({ habit, pillarColor }, i) => {
            const done = todayLog.habitCompletions?.[habit.id] || false;
            const streak = getHabitStreak(habit.id);
            return (
              <div key={habit.id}
                className={`habit-tile ${done ? 'habit-tile-done' : ''}`}
                onClick={() => handleHabitToggle(habit.id)}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleHabitToggle(habit.id); }}
                role="checkbox" aria-checked={done} aria-label={habit.title} tabIndex={0}
                style={{ animationDelay: `${i * 25}ms`, ...(done ? { borderColor: `${pillarColor}30` } : {}) }}
              >
                <div className="habit-tile-accent" style={{ background: pillarColor }} />
                <div className="habit-tile-body">
                  <div className="habit-tile-top">
                    <span className="habit-tile-emoji">{habit.icon || '✦'}</span>
                    <div className={`habit-tile-ck ${done ? 'habit-tile-ck-on' : ''}`}
                      style={done ? { borderColor: pillarColor, background: pillarColor } : {}}
                    >
                      {done && <Check size={8} color="white" strokeWidth={3} />}
                    </div>
                  </div>
                  <span className={`habit-tile-name ${done ? 'habit-tile-name-done' : ''}`}>{habit.title}</span>
                  {streak > 0 && <span className="habit-tile-streak"><Flame size={8} /> {streak}d</span>}
                </div>
                {done && <div className="habit-tile-flash" style={{ background: pillarColor }} />}
              </div>
            );
          })}
        </div>
      </section>

      {/* ── PILLARS — compact row ── */}
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
    </div>
  );
}
