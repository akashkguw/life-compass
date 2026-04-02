import React, { useState } from 'react';
import { format, parseISO, addDays, subDays } from 'date-fns';
import {
  Sun, Moon as MoonIcon, Check, Plus, X,
  Flame, Trophy, TrendingUp, AlertCircle, Lightbulb, ChevronRight,
  ChevronLeft, Lock,
} from 'lucide-react';
import { useStore } from '../store';

const DailyView: React.FC = () => {
  const { state, dispatch, today, getAllHabits, getHabitStreak, getDayLog } = useStore();

  const [viewDate, setViewDate] = useState(today);
  const isToday = viewDate === today;
  const isYesterday = viewDate === format(subDays(new Date(), 1), 'yyyy-MM-dd');
  const canEdit = isToday || isYesterday;
  const dayLog = getDayLog(viewDate);

  const [showMorningModal, setShowMorningModal] = useState(false);
  const [showEveningModal, setShowEveningModal] = useState(false);

  const [morningForm, setMorningForm] = useState({
    priorities: ['', '', ''],
    intention: '',
    energyLevel: 0,
  });

  const [eveningForm, setEveningForm] = useState({
    wins: [''],
    challenges: [''],
    gratitude: '',
    tomorrowFocus: '',
    overallRating: 0,
  });

  const goToPrev = () => {
    const prev = format(subDays(parseISO(viewDate), 1), 'yyyy-MM-dd');
    setViewDate(prev);
  };

  const goToNext = () => {
    if (viewDate >= today) return;
    const next = format(addDays(parseISO(viewDate), 1), 'yyyy-MM-dd');
    setViewDate(next);
  };

  const handleSaveMorningPlan = () => {
    if (!canEdit) return;
    dispatch({
      type: 'SAVE_MORNING_PLAN',
      payload: {
        date: viewDate,
        plan: {
          topPriorities: morningForm.priorities.filter((p) => p.trim()),
          intentions: morningForm.intention,
          energyLevel: morningForm.energyLevel,
          timestamp: new Date().toISOString(),
        },
      },
    });
    setShowMorningModal(false);
    setMorningForm({ priorities: ['', '', ''], intention: '', energyLevel: 0 });
  };

  const handleSaveEveningReview = () => {
    if (!canEdit) return;
    dispatch({
      type: 'SAVE_EVENING_REVIEW',
      payload: {
        date: viewDate,
        review: {
          wins: eveningForm.wins.filter((w) => w.trim()),
          challenges: eveningForm.challenges.filter((c) => c.trim()),
          gratitude: eveningForm.gratitude,
          tomorrowFocus: eveningForm.tomorrowFocus,
          overallRating: eveningForm.overallRating,
          timestamp: new Date().toISOString(),
        },
      },
    });
    setShowEveningModal(false);
    setEveningForm({ wins: [''], challenges: [''], gratitude: '', tomorrowFocus: '', overallRating: 0 });
  };

  const handleToggleHabit = (habitId: string) => {
    if (!canEdit) return;
    dispatch({ type: 'TOGGLE_HABIT', payload: { date: viewDate, habitId } });
  };

  const habits = getAllHabits(viewDate);
  const completedHabits = habits.filter(({ habit }) => dayLog.habitCompletions?.[habit.id]).length;
  const habitsByPillar = habits.reduce(
    (acc, h) => {
      if (!acc[h.habit.pillarId]) acc[h.habit.pillarId] = [];
      acc[h.habit.pillarId].push(h);
      return acc;
    },
    {} as Record<string, typeof habits>
  );

  const formatLogTime = (timestamp: string): string => {
    try { return format(parseISO(timestamp), 'h:mm a'); }
    catch { return 'Invalid time'; }
  };

  const logTypeIcon: Record<string, React.ReactNode> = {
    win: <Trophy size={14} />,
    progress: <TrendingUp size={14} />,
    blocker: <AlertCircle size={14} />,
    thought: <Lightbulb size={14} />,
  };

  const displayDate = isToday ? 'Today' : isYesterday ? 'Yesterday' : format(parseISO(viewDate), 'EEE, MMM d');

  return (
    <div className="daily-view">
      {/* ── Date Navigator ── */}
      <div className="daily-date-nav">
        <button className="daily-date-btn" onClick={goToPrev} aria-label="Previous day">
          <ChevronLeft size={20} />
        </button>
        <div className="daily-date-center">
          <span className="daily-date-label">{displayDate}</span>
          {!canEdit && (
            <span className="daily-date-readonly"><Lock size={10} /> Read-only</span>
          )}
        </div>
        <button className="daily-date-btn" onClick={goToNext} disabled={viewDate >= today} aria-label="Next day">
          <ChevronRight size={20} />
        </button>
      </div>

      {/* ── Morning Plan ── */}
      <section className="daily-section">
        {dayLog.morningPlan ? (
          <div className="morning-plan-display">
            <div className="section-header-icon">
              <div className="sh-icon ritual-morning"><Sun size={16} /></div>
              <h2>Morning Plan</h2>
              <div className="ritual-check"><Check size={12} strokeWidth={3} /></div>
            </div>
            <div className="morning-plan-content">
              <div className="priorities-list">
                <ol>
                  {dayLog.morningPlan.topPriorities.map((p, i) => <li key={i}>{p}</li>)}
                </ol>
              </div>
              {dayLog.morningPlan.intentions && (
                <div className="intention-box">
                  <p>{dayLog.morningPlan.intentions}</p>
                </div>
              )}
              <div className="energy-circles">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div
                    key={i}
                    className={`energy-circle ${i < dayLog.morningPlan!.energyLevel ? 'filled' : ''}`}
                    style={i < dayLog.morningPlan!.energyLevel ? { backgroundColor: 'var(--warning)' } : {}}
                  />
                ))}
              </div>
            </div>
          </div>
        ) : canEdit ? (
          <div className="ritual-cta" onClick={() => setShowMorningModal(true)}>
            <div className="ritual-cta-icon ritual-morning"><Sun size={22} /></div>
            <div className="ritual-cta-text">
              <strong>Start Your Morning</strong>
              <span>Set priorities and intentions</span>
            </div>
            <ChevronRight />
          </div>
        ) : (
          <div className="ritual-cta ritual-cta-empty">
            <div className="ritual-cta-icon ritual-morning" style={{ opacity: 0.4 }}><Sun size={22} /></div>
            <div className="ritual-cta-text">
              <strong style={{ color: 'var(--text-tertiary)' }}>No morning plan</strong>
            </div>
          </div>
        )}
      </section>

      {/* ── Habits by Pillar ── */}
      <section className="daily-section">
        <div className="section-header-icon">
          <div className="sh-icon" style={{ background: 'var(--success-bg)', color: 'var(--success)' }}>
            <Check size={16} />
          </div>
          <h2>Habits</h2>
          <span className="section-counter">
            {completedHabits}/{habits.length}
          </span>
        </div>
        {habits.length === 0 ? (
          <p className="daily-empty-text">No habits tracked for this date.</p>
        ) : (
          <div className="habit-pillar-groups">
            {Object.entries(habitsByPillar).map(([pillarId, pillarHabits]) => {
              const pillar = state.pillars.find((p) => p.id === pillarId);
              if (!pillar) return null;
              return (
                <div key={pillarId} className="habit-pillar-group">
                  <div className="habit-group-label">
                    <div className="habit-group-dot" style={{ background: pillar.color }} />
                    {pillar.name}
                  </div>
                  {pillarHabits.map((h) => {
                    const isCompleted = dayLog.habitCompletions?.[h.habit.id] || false;
                    const streak = isToday ? getHabitStreak(h.habit.id) : 0;
                    return (
                      <div
                        key={h.habit.id}
                        className={`habit-row ${isCompleted ? 'habit-row-done' : ''} ${!canEdit ? 'habit-row-readonly' : ''}`}
                        onClick={() => handleToggleHabit(h.habit.id)}
                      >
                        <div
                          className={`habit-check ${isCompleted ? 'completed' : ''}`}
                          style={isCompleted ? { backgroundColor: h.pillarColor, borderColor: 'transparent' } : {}}
                        >
                          {isCompleted && <Check size={14} color="white" strokeWidth={3} />}
                        </div>
                        <span className="habit-row-emoji">{h.habit.icon}</span>
                        <span className={`habit-row-title ${isCompleted ? 'completed-text' : ''}`}>
                          {h.habit.title}
                        </span>
                        {streak > 0 && (
                          <span className="habit-streak"><Flame size={10} /> {streak}</span>
                        )}
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* ── Quick Logs ── */}
      {dayLog.quickLogs && dayLog.quickLogs.length > 0 && (
        <section className="daily-section">
          <div className="section-header-icon">
            <div className="sh-icon" style={{ background: 'var(--warning-bg)', color: 'var(--warning)' }}>
              <Lightbulb size={16} />
            </div>
            <h2>Logs</h2>
          </div>
          <div className="log-list">
            {dayLog.quickLogs.map((log) => {
              const lp = state.pillars.find((p) => p.id === log.pillarId);
              return (
                <div key={log.id} className="log-card">
                  <div className="log-card-top">
                    <div className="log-type-badge" data-type={log.type}>
                      {logTypeIcon[log.type]}
                      {log.type}
                    </div>
                    <span className="log-time">{formatLogTime(log.timestamp)}</span>
                  </div>
                  <p className="log-note">{log.note}</p>
                  {lp && <span className="log-pillar-tag" style={{ color: lp.color }}>{lp.name}</span>}
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* ── Evening Review ── */}
      <section className="daily-section">
        {dayLog.eveningReview ? (
          <div className="evening-review-display">
            <div className="section-header-icon">
              <div className="sh-icon ritual-evening"><MoonIcon size={16} /></div>
              <h2>Evening Review</h2>
              <div className="ritual-check"><Check size={12} strokeWidth={3} /></div>
            </div>
            <div className="evening-review-content">
              {dayLog.eveningReview.wins.length > 0 && (
                <div className="review-block">
                  <h3>Wins</h3>
                  <ul>{dayLog.eveningReview.wins.map((w, i) => <li key={i}>{w}</li>)}</ul>
                </div>
              )}
              {dayLog.eveningReview.challenges.length > 0 && (
                <div className="review-block">
                  <h3>Challenges</h3>
                  <ul>{dayLog.eveningReview.challenges.map((c, i) => <li key={i}>{c}</li>)}</ul>
                </div>
              )}
              {dayLog.eveningReview.gratitude && (
                <div className="review-block">
                  <h3>Gratitude</h3>
                  <p>{dayLog.eveningReview.gratitude}</p>
                </div>
              )}
              {dayLog.eveningReview.tomorrowFocus && (
                <div className="review-block">
                  <h3>Tomorrow</h3>
                  <p>{dayLog.eveningReview.tomorrowFocus}</p>
                </div>
              )}
              <div className="review-rating">
                {Array.from({ length: 5 }).map((_, i) => (
                  <span key={i} className={`rating-dot ${i < dayLog.eveningReview!.overallRating ? 'active' : ''}`} />
                ))}
              </div>
            </div>
          </div>
        ) : canEdit ? (
          <div className="ritual-cta" onClick={() => setShowEveningModal(true)}>
            <div className="ritual-cta-icon ritual-evening"><MoonIcon size={22} /></div>
            <div className="ritual-cta-text">
              <strong>Wind Down & Reflect</strong>
              <span>Review wins, challenges & gratitude</span>
            </div>
            <ChevronRight />
          </div>
        ) : (
          <div className="ritual-cta ritual-cta-empty">
            <div className="ritual-cta-icon ritual-evening" style={{ opacity: 0.4 }}><MoonIcon size={22} /></div>
            <div className="ritual-cta-text">
              <strong style={{ color: 'var(--text-tertiary)' }}>No evening review</strong>
            </div>
          </div>
        )}
      </section>

      {/* ── Morning Modal ── */}
      {showMorningModal && (
        <div className="modal-overlay" onClick={() => setShowMorningModal(false)} role="presentation">
          <div className="modal-panel" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true" aria-label="Morning Plan">
            <div className="modal-handle" />
            <button className="modal-close-btn" onClick={() => setShowMorningModal(false)} aria-label="Close">
              <X size={18} />
            </button>
            <div className="modal-title">Start Your Morning</div>
            <div className="modal-subtitle">Set your intentions for the day</div>
            <form className="modal-form">
              <div className="form-group">
                <label className="form-label">Top 3 Priorities</label>
                {morningForm.priorities.map((p, idx) => (
                  <input key={`priority-${idx}`} type="text" placeholder={`Priority ${idx + 1}`} value={p}
                    maxLength={200}
                    onChange={(e) => {
                      const u = [...morningForm.priorities]; u[idx] = e.target.value;
                      setMorningForm({ ...morningForm, priorities: u });
                    }} className="form-input" />
                ))}
              </div>
              <div className="form-group">
                <label className="form-label">Today's Intention</label>
                <textarea placeholder="What's your main intention today?" value={morningForm.intention}
                  onChange={(e) => setMorningForm({ ...morningForm, intention: e.target.value })}
                  className="form-textarea" rows={3} />
              </div>
              <div className="form-group">
                <label className="form-label">Energy Level</label>
                <div className="rating-row">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <button key={i} type="button" className={`rating-star ${i < morningForm.energyLevel ? 'active' : ''}`}
                      onClick={() => setMorningForm({ ...morningForm, energyLevel: i + 1 })}
                      aria-label={`Energy level ${i + 1} of 5`}>★</button>
                  ))}
                </div>
              </div>
              <button type="button" className="btn-primary btn-full" onClick={handleSaveMorningPlan}>
                Save Morning Plan
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ── Evening Modal ── */}
      {showEveningModal && (
        <div className="modal-overlay" onClick={() => setShowEveningModal(false)} role="presentation">
          <div className="modal-panel" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true" aria-label="Evening Review">
            <div className="modal-handle" />
            <button className="modal-close-btn" onClick={() => setShowEveningModal(false)} aria-label="Close">
              <X size={18} />
            </button>
            <div className="modal-title">Wind Down & Reflect</div>
            <div className="modal-subtitle">Review your day and plan ahead</div>
            <form className="modal-form">
              <div className="form-group">
                <label className="form-label">Wins</label>
                {eveningForm.wins.map((w, idx) => (
                  <div key={idx} className="dynamic-input">
                    <input type="text" placeholder={`Win ${idx + 1}`} value={w}
                      onChange={(e) => { const u = [...eveningForm.wins]; u[idx] = e.target.value; setEveningForm({ ...eveningForm, wins: u }); }}
                      className="form-input" />
                    {eveningForm.wins.length > 1 && (
                      <button type="button" className="btn-remove" aria-label={`Remove win ${idx + 1}`}
                        onClick={() => setEveningForm({ ...eveningForm, wins: eveningForm.wins.filter((_, i) => i !== idx) })}>
                        <X size={16} /></button>
                    )}
                  </div>
                ))}
                <button type="button" className="btn-add"
                  onClick={() => setEveningForm({ ...eveningForm, wins: [...eveningForm.wins, ''] })}>
                  <Plus size={16} /> Add Win
                </button>
              </div>
              <div className="form-group">
                <label className="form-label">Challenges</label>
                {eveningForm.challenges.map((c, idx) => (
                  <div key={idx} className="dynamic-input">
                    <input type="text" placeholder={`Challenge ${idx + 1}`} value={c}
                      onChange={(e) => { const u = [...eveningForm.challenges]; u[idx] = e.target.value; setEveningForm({ ...eveningForm, challenges: u }); }}
                      className="form-input" />
                    {eveningForm.challenges.length > 1 && (
                      <button type="button" className="btn-remove" aria-label={`Remove challenge ${idx + 1}`}
                        onClick={() => setEveningForm({ ...eveningForm, challenges: eveningForm.challenges.filter((_, i) => i !== idx) })}>
                        <X size={16} /></button>
                    )}
                  </div>
                ))}
                <button type="button" className="btn-add"
                  onClick={() => setEveningForm({ ...eveningForm, challenges: [...eveningForm.challenges, ''] })}>
                  <Plus size={16} /> Add Challenge
                </button>
              </div>
              <div className="form-group">
                <label className="form-label">Gratitude</label>
                <textarea placeholder="What are you grateful for today?" value={eveningForm.gratitude}
                  onChange={(e) => setEveningForm({ ...eveningForm, gratitude: e.target.value })}
                  className="form-textarea" rows={3} />
              </div>
              <div className="form-group">
                <label className="form-label">Tomorrow's Focus</label>
                <textarea placeholder="What do you want to focus on tomorrow?" value={eveningForm.tomorrowFocus}
                  onChange={(e) => setEveningForm({ ...eveningForm, tomorrowFocus: e.target.value })}
                  className="form-textarea" rows={3} />
              </div>
              <div className="form-group">
                <label className="form-label">Overall Rating</label>
                <div className="rating-row">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <button key={i} type="button" className={`rating-star ${i < eveningForm.overallRating ? 'active' : ''}`}
                      onClick={() => setEveningForm({ ...eveningForm, overallRating: i + 1 })}
                      aria-label={`Rating ${i + 1} of 5`}>★</button>
                  ))}
                </div>
              </div>
              <button type="button" className="btn-primary btn-full" onClick={handleSaveEveningReview}>
                Save Evening Review
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DailyView;
