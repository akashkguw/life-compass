import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Check, Target, Repeat } from 'lucide-react';
import { format } from 'date-fns';
import { useStore } from '../store';

type TabType = 'goals' | 'habits';

export default function PillarDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { state, dispatch, today, todayLog, getHabitStreak } = useStore();
  const [activeTab, setActiveTab] = useState<TabType>('goals');

  const pillar = state.pillars.find(p => p.id === id);
  if (!pillar) {
    return (
      <div className="empty-state" style={{ paddingTop: '60px' }}>
        <div className="empty-state-icon">🧭</div>
        <p className="empty-state-text">Pillar not found</p>
        <button className="btn btn-primary" onClick={() => navigate('/')}>Go Home</button>
      </div>
    );
  }

  const pillarLogs = todayLog.quickLogs.filter(log => log.pillarId === id);
  const activeHabits = pillar.habits.filter((habit) => {
    const created = habit.createdDate || '2000-01-01';
    if (today < created) return false;
    if (habit.removedDate && today >= habit.removedDate) return false;
    return true;
  });

  return (
    <div className="page-container">
      <button className="back-btn" onClick={() => navigate('/')}>
        <ArrowLeft size={20} />
        Back
      </button>

      <div className="pillar-detail-header">
        <h2 style={{ color: pillar.color }}>{pillar.name}</h2>
        <p>{pillar.tagline}</p>
      </div>

      <div className="tab-row">
        <button
          className={`tab-btn ${activeTab === 'goals' ? 'active' : ''}`}
          onClick={() => setActiveTab('goals')}
        >
          Goals
        </button>
        <button
          className={`tab-btn ${activeTab === 'habits' ? 'active' : ''}`}
          onClick={() => setActiveTab('habits')}
        >
          Habits
        </button>
      </div>

      {activeTab === 'goals' && (
        <div className="tab-content">
          {pillar.goals.length === 0 ? (
            <div className="empty-state">
              <Target size={32} />
              <p className="empty-state-text">No goals yet for this pillar</p>
            </div>
          ) : (
            pillar.goals.map(goal => {
              const completedMilestones = goal.milestones.filter(m => m.completed).length;
              const totalMilestones = goal.milestones.length;
              const progressPercent = totalMilestones > 0 ? (completedMilestones / totalMilestones) * 100 : 0;

              return (
                <div key={goal.id} className="goal-card">
                  <h3 className="goal-title">{goal.title}</h3>
                  <p className="goal-description">{goal.description}</p>

                  <div className="progress-bar-container">
                    <div
                      className="progress-bar-fill"
                      style={{
                        width: `${progressPercent}%`,
                        backgroundColor: pillar.color,
                      }}
                    />
                  </div>
                  <p className="progress-text">
                    {completedMilestones} of {totalMilestones} milestones
                  </p>

                  <div>
                    {goal.milestones.map(milestone => (
                      <div
                        key={milestone.id}
                        className="milestone-item"
                        onClick={() =>
                          dispatch({
                            type: 'TOGGLE_MILESTONE',
                            payload: { goalId: goal.id, milestoneId: milestone.id },
                          })
                        }
                      >
                        <div
                          className={`milestone-check ${milestone.completed ? 'done' : ''}`}
                          style={milestone.completed ? { backgroundColor: pillar.color } : {}}
                        >
                          {milestone.completed && <Check size={16} />}
                        </div>
                        <span className={`milestone-text ${milestone.completed ? 'done' : ''}`}>
                          {milestone.title}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {activeTab === 'habits' && (
        <div className="tab-content">
          {activeHabits.length === 0 ? (
            <div className="empty-state">
              <Repeat size={32} />
              <p className="empty-state-text">No habits yet for this pillar</p>
            </div>
          ) : (
            activeHabits.map(habit => {
              const isCompleted = todayLog.habitCompletions[habit.id] || false;
              const streak = getHabitStreak(habit.id);

              return (
                <div
                  key={habit.id}
                  className="habit-item"
                  onClick={() =>
                    dispatch({
                      type: 'TOGGLE_HABIT',
                      payload: { date: today, habitId: habit.id },
                    })
                  }
                >
                  <div
                    className={`habit-check ${isCompleted ? 'completed' : ''}`}
                    style={isCompleted ? { backgroundColor: pillar.color } : {}}
                  >
                    {isCompleted && <Check size={16} />}
                  </div>
                  {habit.icon && <span className="habit-icon">{habit.icon}</span>}
                  <div style={{ flex: 1 }}>
                    <p className="habit-title">{habit.title}</p>
                    <span className="chip">{habit.frequency}</span>
                  </div>
                  {streak > 0 && <div className="habit-streak">🔥 {streak}</div>}
                </div>
              );
            })
          )}
        </div>
      )}

      {pillarLogs.length > 0 && (
        <div style={{ marginTop: '32px' }}>
          <h3 style={{ marginBottom: '16px' }}>Quick Logs</h3>
          <div className="timeline">
            {pillarLogs.map(log => (
              <div key={log.id} className="timeline-item">
                <span className="timeline-dot" style={{ backgroundColor: pillar.color }} />
                <div>
                  <p className="timeline-type">{log.type}</p>
                  <p className="timeline-note">{log.note}</p>
                  <p className="timeline-time">{format(new Date(log.timestamp), 'HH:mm')}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
