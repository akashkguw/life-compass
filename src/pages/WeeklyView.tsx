import React, { useState, useMemo } from 'react';
import { format, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay } from 'date-fns';
import { Calendar, TrendingUp, Target, Plus } from 'lucide-react';
import { useStore } from '../store';
import { PillarId } from '../types';

export default function WeeklyView() {
  const { state, dispatch, today, getDayCompletionRate } = useStore();
  const [showPlanModal, setShowPlanModal] = useState(false);
  const [formData, setFormData] = useState({
    topPriority: '',
    career: '',
    education: '',
    family: '',
    home: '',
    health: '',
  });

  // Calculate week boundaries
  const weekStart = startOfWeek(new Date(today), { weekStartsOn: 1 });
  const weekEnd = endOfWeek(weekStart);
  const weekStartStr = format(weekStart, 'yyyy-MM-dd');
  const daysOfWeek = eachDayOfInterval({ start: weekStart, end: weekEnd });

  // Get existing weekly plan if it exists
  const existingPlan = state.weeklyPlans[weekStartStr];

  // Initialize form data from existing plan
  React.useEffect(() => {
    if (existingPlan) {
      const pillarGoals = existingPlan.pillarGoals || {};
      setFormData({
        topPriority: existingPlan.topPriority || '',
        career: (pillarGoals.career?.[0] || ''),
        education: (pillarGoals.education?.[0] || ''),
        family: (pillarGoals.family?.[0] || ''),
        home: (pillarGoals.home?.[0] || ''),
        health: (pillarGoals.health?.[0] || ''),
      });
    }
  }, [existingPlan]);

  // Calculate week stats
  const weekStats = useMemo(() => {
    const rates: number[] = [];
    let totalQuickLogs = 0;
    let bestDay = { name: '', rate: 0 };
    let totalHabitsDone = 0;

    daysOfWeek.forEach((day) => {
      const dayStr = format(day, 'yyyy-MM-dd');
      const rate = getDayCompletionRate(dayStr);
      rates.push(rate);

      const dayLog = state.dayLogs[dayStr];
      if (dayLog?.quickLogs) {
        totalQuickLogs += dayLog.quickLogs.length;
      }

      if (rate > bestDay.rate) {
        bestDay = { name: format(day, 'EEE'), rate };
      }

      // Count habits completed today
      if (dayLog?.habitCompletions) {
        totalHabitsDone += Object.values(dayLog.habitCompletions).filter(Boolean).length;
      }
    });

    const avgRate = rates.length > 0 ? Math.round(rates.reduce((a, b) => a + b, 0) / rates.length) : 0;

    return {
      avgCompletion: avgRate,
      quickLogCount: totalQuickLogs,
      bestDay: bestDay.name || 'N/A',
      totalHabitsDone,
    };
  }, [daysOfWeek, getDayCompletionRate, state.dayLogs]);

  const handlePlanSubmit = () => {
    const pillarGoals: Record<PillarId, string[]> = {
      career: formData.career ? [formData.career] : [],
      education: formData.education ? [formData.education] : [],
      family: formData.family ? [formData.family] : [],
      home: formData.home ? [formData.home] : [],
      health: formData.health ? [formData.health] : [],
    };

    dispatch({
      type: 'SAVE_WEEKLY_PLAN',
      payload: {
        weekStart: weekStartStr,
        pillarGoals,
        topPriority: formData.topPriority,
      },
    });

    setShowPlanModal(false);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <div className="page-container">
      {/* Header */}
      <div className="section-header">
        <h2>Weekly Overview</h2>
        <div className="week-range">
          {format(weekStart, 'MMM dd')} — {format(weekEnd, 'MMM dd, yyyy')}
        </div>
      </div>

      {/* Week Grid */}
      <div className="week-grid">
        {daysOfWeek.map((day) => {
          const dayStr = format(day, 'yyyy-MM-dd');
          const rate = getDayCompletionRate(dayStr);
          const isToday = isSameDay(day, new Date(today));

          let dotClass = 'dot-gray';
          if (rate > 70) dotClass = 'dot-green';
          else if (rate > 30) dotClass = 'dot-yellow';

          return (
            <div key={dayStr} className={`week-day ${isToday ? 'today' : ''}`}>
              <div className="day-label">{format(day, 'E')}</div>
              <div className="day-num">{format(day, 'd')}</div>
              <div className={`day-dot ${dotClass}`}></div>
            </div>
          );
        })}
      </div>

      {/* Stats Card */}
      <div className="card">
        <h3>This Week</h3>
        <div className="stats-grid">
          <div className="stat-item">
            <div className="stat-label">Avg Completion</div>
            <div className="stat-value">{weekStats.avgCompletion}%</div>
          </div>
          <div className="stat-item">
            <div className="stat-label">Quick Logs</div>
            <div className="stat-value">{weekStats.quickLogCount}</div>
          </div>
          <div className="stat-item">
            <div className="stat-label">Best Day</div>
            <div className="stat-value">{weekStats.bestDay}</div>
          </div>
          <div className="stat-item">
            <div className="stat-label">Habits Done</div>
            <div className="stat-value">{weekStats.totalHabitsDone}</div>
          </div>
        </div>
      </div>

      {/* Weekly Plan */}
      <div className="card">
        {existingPlan ? (
          <>
            <h3>Your Weekly Plan</h3>
            <div className="plan-priority-box">
              <strong>Top Priority:</strong> {existingPlan.topPriority}
            </div>
            <div className="plan-goals">
              {state.pillars.map((pillar) => {
                const goals = existingPlan.pillarGoals?.[pillar.id] || [];
                return (
                  <div key={pillar.id} className="plan-goal-item">
                    <div className="plan-goal-label">{pillar.name}</div>
                    <div className="plan-goal-text">{goals[0] || '—'}</div>
                  </div>
                );
              })}
            </div>
            <button className="btn btn-secondary" onClick={() => setShowPlanModal(true)}>
              Edit Plan
            </button>
          </>
        ) : (
          <>
            <h3>Plan Your Week</h3>
            <p>Set your priorities and goals for this week to stay focused.</p>
            <button
              className="btn btn-primary"
              onClick={() => setShowPlanModal(true)}
            >
              <Plus size={18} />
              Plan Your Week
            </button>
          </>
        )}
      </div>

      {/* Weekly Plan Modal */}
      {showPlanModal && (
        <div className="modal-overlay">
          <div className="modal-panel">
            <div className="modal-handle"></div>
            <h2 className="modal-title">Plan Your Week</h2>

            <div className="form-group">
              <label>Top Priority This Week</label>
              <input
                type="text"
                value={formData.topPriority}
                onChange={(e) => handleInputChange('topPriority', e.target.value)}
                placeholder="What matters most this week?"
              />
            </div>

            {state.pillars.map((pillar) => (
              <div key={pillar.id} className="form-group">
                <label>{pillar.name}</label>
                <input
                  type="text"
                  value={formData[pillar.id as keyof typeof formData]}
                  onChange={(e) => handleInputChange(pillar.id, e.target.value)}
                  placeholder={`Goal for ${pillar.name}`}
                />
              </div>
            ))}

            <div className="form-actions">
              <button
                className="btn btn-secondary"
                onClick={() => setShowPlanModal(false)}
              >
                Cancel
              </button>
              <button className="btn btn-primary" onClick={handlePlanSubmit}>
                Save Plan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
