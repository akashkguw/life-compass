import React, { useState, useRef } from 'react';
import {
  Compass, Sun, Zap, BarChart3, ArrowRight, ChevronLeft, ChevronRight, Sparkles,
} from 'lucide-react';
import { useStore } from '../store';

const slides = [
  {
    emoji: '🌅',
    icon: Sun,
    color: '#f59e0b',
    bg: 'linear-gradient(135deg, #fef3c7, #fde68a)',
    title: 'Start Every Morning',
    desc: 'Set your top 3 priorities and intentions each day. A mindful morning routine sets the tone for everything.',
    example: '"Today I will focus on the architecture review, study for 1 hour, and be fully present with family at dinner."',
  },
  {
    emoji: '⚡',
    icon: Zap,
    color: '#6366f1',
    bg: 'linear-gradient(135deg, #eef2ff, #e0e7ff)',
    title: 'Track Habits That Matter',
    desc: 'Tap to complete daily habits across all your life pillars. Watch streaks build and your consistency grow.',
    example: '📚 Read a technical paper · 💪 Exercise 30 min · 👶 Dedicated baby time · 🧘 10 min mindfulness',
  },
  {
    emoji: '📝',
    icon: Zap,
    color: '#10b981',
    bg: 'linear-gradient(135deg, #ecfdf5, #d1fae5)',
    title: 'Log Wins & Blockers',
    desc: 'Quick-capture moments throughout your day — wins, progress, blockers, or thoughts. Tap the + button anytime.',
    example: '🏆 "Got buy-in on the new API design" · 🚧 "Blocked on security review approval"',
  },
  {
    emoji: '🌙',
    icon: BarChart3,
    color: '#8b5cf6',
    bg: 'linear-gradient(135deg, #f5f3ff, #ede9fe)',
    title: 'Reflect & Grow',
    desc: 'End each day with a brief evening review. Celebrate wins, note challenges, and set tomorrow\'s focus.',
    example: '"Best part of today: nailed the VP presentation. Tomorrow: finish the PMP assignment."',
  },
];

export default function Onboarding() {
  const { dispatch } = useStore();
  const [step, setStep] = useState<'name' | 'carousel'>('name');
  const [name, setName] = useState('');
  const [slide, setSlide] = useState(0);
  const [slideDir, setSlideDir] = useState<'left' | 'right'>('right');
  const inputRef = useRef<HTMLInputElement>(null);

  const handleNameSubmit = () => {
    if (!name.trim()) return;
    dispatch({ type: 'SET_USER_NAME', payload: name.trim() });
    setStep('carousel');
  };

  const handleFinish = () => {
    dispatch({ type: 'COMPLETE_ONBOARDING' });
  };

  const goSlide = (next: number) => {
    setSlideDir(next > slide ? 'right' : 'left');
    setSlide(next);
  };

  if (step === 'name') {
    return (
      <div className="ob-screen">
        <div className="ob-name-card">
          <div className="ob-logo-ring">
            <Compass size={32} />
          </div>
          <h1 className="ob-brand">Life Compass</h1>
          <p className="ob-tagline">Your personal growth dashboard</p>

          <div className="ob-name-form">
            <label className="ob-label">What should we call you?</label>
            <input
              ref={inputRef}
              className="ob-name-input"
              type="text"
              placeholder="Your first name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleNameSubmit()}
              autoFocus
              maxLength={20}
            />
            <button
              className="ob-name-btn"
              onClick={handleNameSubmit}
              disabled={!name.trim()}
            >
              Continue <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </div>
    );
  }

  const s = slides[slide];
  const isLast = slide === slides.length - 1;

  return (
    <div className="ob-screen">
      <div className="ob-carousel">
        {/* Slide */}
        <div className="ob-slide" key={slide} data-dir={slideDir}>
          <div className="ob-slide-visual" style={{ background: s.bg }}>
            <span className="ob-slide-emoji">{s.emoji}</span>
          </div>
          <div className="ob-slide-content">
            <h2 className="ob-slide-title">{s.title}</h2>
            <p className="ob-slide-desc">{s.desc}</p>
            <div className="ob-slide-example">
              <Sparkles size={12} className="ob-example-icon" />
              <span>{s.example}</span>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="ob-controls">
          <div className="ob-dots">
            {slides.map((_, i) => (
              <button
                key={i}
                className={`ob-dot ${i === slide ? 'ob-dot-active' : ''}`}
                onClick={() => goSlide(i)}
              />
            ))}
          </div>

          <div className="ob-nav-btns">
            {slide > 0 && (
              <button className="ob-nav-back" onClick={() => goSlide(slide - 1)}>
                <ChevronLeft size={18} />
              </button>
            )}
            {isLast ? (
              <button className="ob-nav-go" onClick={handleFinish}>
                Get Started <ArrowRight size={16} />
              </button>
            ) : (
              <button className="ob-nav-next" onClick={() => goSlide(slide + 1)}>
                Next <ChevronRight size={16} />
              </button>
            )}
          </div>
        </div>

        {/* Skip */}
        {!isLast && (
          <button className="ob-skip" onClick={handleFinish}>Skip tour</button>
        )}
      </div>
    </div>
  );
}
