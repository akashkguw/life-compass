import React, { useState, useRef, useEffect } from 'react';
import {
  ArrowRight, ChevronLeft, ChevronRight, Sparkles, Check,
} from 'lucide-react';
import { useStore } from '../store';
import { Pillar } from '../types';
import {
  LIFE_TEMPLATES, PILLAR_DEFS, ROLE_OPTIONS, EDUCATION_OPTIONS,
  FAMILY_OPTIONS, HEALTH_FOCUS_OPTIONS, generatePillars,
  OnboardingConfig,
} from '../data/library';

type Step = 'name' | 'template' | 'career' | 'education' | 'family' | 'health' | 'custom-pick' | 'carousel';

const STEP_HEROES: Record<string, { emoji: string; gradient: string }> = {
  name:         { emoji: '🧭', gradient: 'linear-gradient(135deg, #6366f1 0%, #a855f7 50%, #ec4899 100%)' },
  template:     { emoji: '✨', gradient: 'linear-gradient(135deg, #f59e0b 0%, #f97316 50%, #ef4444 100%)' },
  'custom-pick':{ emoji: '🎨', gradient: 'linear-gradient(135deg, #8b5cf6 0%, #6366f1 50%, #3b82f6 100%)' },
  career:       { emoji: '🚀', gradient: 'linear-gradient(135deg, #6366f1 0%, #3b82f6 50%, #0ea5e9 100%)' },
  education:    { emoji: '🎓', gradient: 'linear-gradient(135deg, #0ea5e9 0%, #06b6d4 50%, #14b8a6 100%)' },
  family:       { emoji: '❤️', gradient: 'linear-gradient(135deg, #f43f5e 0%, #ec4899 50%, #a855f7 100%)' },
  health:       { emoji: '🌿', gradient: 'linear-gradient(135deg, #10b981 0%, #14b8a6 50%, #06b6d4 100%)' },
  carousel:     { emoji: '🌟', gradient: 'linear-gradient(135deg, #f59e0b 0%, #ef4444 50%, #8b5cf6 100%)' },
};

const carouselSlides = [
  {
    emoji: '🌅', title: 'Start Every Morning',
    desc: 'Set your top 3 priorities and intentions each day.',
    example: '"Focus on the arch review, study for 1 hour, be present at dinner."',
  },
  {
    emoji: '⚡', title: 'Track Habits That Matter',
    desc: 'Tap to complete daily habits across your life pillars. Watch streaks grow.',
    example: '📚 Read · 💪 Exercise · 👶 Family · 🧘 Mindfulness',
  },
  {
    emoji: '📝', title: 'Log Wins & Blockers',
    desc: 'Quick-capture moments throughout your day. Tap + anytime.',
    example: '🏆 "Got buy-in on API design" · 🚧 "Blocked on security review"',
  },
  {
    emoji: '🌙', title: 'Reflect & Grow',
    desc: 'End each day reviewing wins, challenges, and tomorrow\'s focus.',
    example: '"Best moment: nailed the VP talk. Tomorrow: finish PMP module."',
  },
];

export default function Onboarding() {
  const { dispatch } = useStore();

  const [step, setStep] = useState<Step>('name');
  const [name, setName] = useState('');
  const [animating, setAnimating] = useState(false);
  const [direction, setDirection] = useState<'in' | 'out'>('in');
  const inputRef = useRef<HTMLInputElement>(null);

  const [templateId, setTemplateId] = useState('');
  const [role, setRole] = useState('');
  const [roleTarget, setRoleTarget] = useState('');
  const [education, setEducation] = useState('');
  const [family, setFamily] = useState('');
  const [healthFocus, setHealthFocus] = useState<string[]>([]);
  const [customPillars, setCustomPillars] = useState<string[]>([]);
  const [slide, setSlide] = useState(0);

  useEffect(() => {
    if (step === 'name' && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 400);
    }
  }, [step]);

  // ── Navigation ──

  const selectedTemplate = LIFE_TEMPLATES.find(t => t.id === templateId);

  const templateNeedsPillar = (category: string) => {
    if (!selectedTemplate) return false;
    if (templateId === 'custom') return customPillars.includes(category);
    return selectedTemplate.pillarCategories.includes(category);
  };

  const needsCareer = () => templateNeedsPillar('career') || templateNeedsPillar('career-prep');
  const needsEducation = () => templateNeedsPillar('education') || templateNeedsPillar('academics');
  const needsFamily = () => templateNeedsPillar('family');
  const needsHealth = () => templateNeedsPillar('health') || templateNeedsPillar('wellness');

  const getFlow = (): Step[] => {
    const flow: Step[] = ['name', 'template'];
    if (templateId === 'custom') flow.push('custom-pick');
    const checkCareer = templateId === 'custom' ? customPillars.some(p => ['career', 'career-prep'].includes(p)) : needsCareer();
    const checkEdu = templateId === 'custom' ? customPillars.some(p => ['education', 'academics'].includes(p)) : needsEducation();
    const checkFamily = templateId === 'custom' ? customPillars.includes('family') : needsFamily();
    const checkHealth = templateId === 'custom' ? customPillars.some(p => ['health', 'wellness'].includes(p)) : needsHealth();
    if (checkCareer) flow.push('career');
    if (checkEdu) flow.push('education');
    if (checkFamily) flow.push('family');
    if (checkHealth) flow.push('health');
    flow.push('carousel');
    return flow;
  };

  const currentIndex = () => getFlow().indexOf(step);
  const totalSteps = () => getFlow().length;

  const goNext = (nextStep: Step) => {
    if (animating) return;
    setAnimating(true);
    setDirection('out');
    setTimeout(() => {
      setStep(nextStep);
      setDirection('in');
      setTimeout(() => setAnimating(false), 50);
    }, 280);
  };

  const goBack = () => {
    const flow = getFlow();
    const idx = flow.indexOf(step);
    if (idx > 0) goNext(flow[idx - 1]);
  };

  const goForward = () => {
    const flow = getFlow();
    const idx = flow.indexOf(step);
    if (idx < flow.length - 1) goNext(flow[idx + 1]);
  };

  const handleFinish = () => {
    const config: OnboardingConfig = {
      templateId,
      role: role || undefined,
      roleTarget: roleTarget || undefined,
      education: education || undefined,
      family: family || undefined,
      healthFocus: healthFocus.length > 0 ? healthFocus : undefined,
      customPillars: customPillars.length > 0 ? customPillars : undefined,
    };
    const generated = generatePillars(config);
    dispatch({ type: 'COMPLETE_ONBOARDING', payload: generated as unknown as Pillar[] });
  };

  const progress = Math.max(0, ((currentIndex()) / (totalSteps() - 1)) * 100);
  const hero = STEP_HEROES[step] || STEP_HEROES.name;

  // ── Shared layout pieces ──

  const renderProgress = () => (
    <div className="ob2-progress-wrap">
      <div className="ob2-progress-bar">
        <div className="ob2-progress-fill" style={{ width: `${progress}%` }} />
      </div>
      <span className="ob2-progress-text">{currentIndex() + 1} of {totalSteps()}</span>
    </div>
  );

  const renderTopbar = () => (
    <div className="ob2-topbar">
      {currentIndex() > 0 ? (
        <button className="ob2-back-btn" onClick={goBack} aria-label="Go back">
          <ChevronLeft size={20} />
        </button>
      ) : <div style={{ width: 40 }} />}
      {renderProgress()}
      <div style={{ width: 40 }} />
    </div>
  );

  // ── STEP: Name ──
  if (step === 'name') {
    return (
      <div className="ob2-page">
        <div className="ob2-glow" style={{ background: hero.gradient }} />
        <div className={`ob2-body ${direction === 'out' ? 'ob2-exit' : 'ob2-enter'}`}>
          <div className="ob2-hero-emoji">{hero.emoji}</div>
          <h1 className="ob2-title-xl">Life Compass</h1>
          <p className="ob2-subtitle">Your personal growth dashboard</p>
          <div className="ob2-name-wrap">
            <label className="ob2-label">What should we call you?</label>
            <input ref={inputRef} className="ob2-input" type="text"
              placeholder="Your first name" value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && name.trim()) {
                  dispatch({ type: 'SET_USER_NAME', payload: name.trim() });
                  goForward();
                }
              }}
              maxLength={20} />
          </div>
        </div>
        <div className="ob2-footer">
          <button className="ob2-primary-btn"
            onClick={() => { dispatch({ type: 'SET_USER_NAME', payload: name.trim() }); goForward(); }}
            disabled={!name.trim()}>
            Get Started <ArrowRight size={18} />
          </button>
        </div>
      </div>
    );
  }

  // ── STEP: Template ──
  if (step === 'template') {
    return (
      <div className="ob2-page">
        <div className="ob2-glow" style={{ background: hero.gradient }} />
        {renderTopbar()}
        <div className={`ob2-body ${direction === 'out' ? 'ob2-exit' : 'ob2-enter'}`}>
          <div className="ob2-hero-emoji">{hero.emoji}</div>
          <h1 className="ob2-title">What describes your life right now?</h1>
          <p className="ob2-subtitle">We'll tailor everything to match</p>
          <div className="ob2-template-grid">
            {LIFE_TEMPLATES.map(t => (
              <button key={t.id}
                className={`ob2-template-card ${templateId === t.id ? 'ob2-selected' : ''}`}
                onClick={() => { setTemplateId(t.id); setCustomPillars([]); }}>
                <span className="ob2-tc-emoji">{t.emoji}</span>
                <span className="ob2-tc-name">{t.name}</span>
                <span className="ob2-tc-desc">{t.description}</span>
                {templateId === t.id && <div className="ob2-tc-check"><Check size={14} /></div>}
              </button>
            ))}
          </div>
        </div>
        <div className="ob2-footer">
          <button className="ob2-primary-btn" onClick={goForward} disabled={!templateId}>
            Continue <ChevronRight size={18} />
          </button>
        </div>
      </div>
    );
  }

  // ── STEP: Custom Pillar Picker ──
  if (step === 'custom-pick') {
    const togglePillar = (id: string) => {
      setCustomPillars(prev =>
        prev.includes(id) ? prev.filter(p => p !== id) : prev.length < 6 ? [...prev, id] : prev
      );
    };
    return (
      <div className="ob2-page">
        <div className="ob2-glow" style={{ background: hero.gradient }} />
        {renderTopbar()}
        <div className={`ob2-body ${direction === 'out' ? 'ob2-exit' : 'ob2-enter'}`}>
          <div className="ob2-hero-emoji">{hero.emoji}</div>
          <h1 className="ob2-title">Choose Your Life Pillars</h1>
          <p className="ob2-subtitle">{customPillars.length}/6 selected — pick at least 3</p>
          <div className="ob2-chips-wrap">
            {PILLAR_DEFS.map(p => {
              const on = customPillars.includes(p.id);
              return (
                <button key={p.id}
                  className={`ob2-chip ${on ? 'ob2-chip-on' : ''}`}
                  style={on ? { background: p.gradient, color: '#fff', borderColor: 'transparent' } : {}}
                  onClick={() => togglePillar(p.id)}>
                  <span className="ob2-chip-dot" style={{ background: on ? '#fff' : p.color }} />
                  {p.name}
                  {on && <Check size={13} />}
                </button>
              );
            })}
          </div>
        </div>
        <div className="ob2-footer">
          <button className="ob2-primary-btn" onClick={goForward} disabled={customPillars.length < 3}>
            Continue <ChevronRight size={18} />
          </button>
        </div>
      </div>
    );
  }

  // ── STEP: Career ──
  if (step === 'career') {
    const selectedRole = ROLE_OPTIONS.find(r => r.id === role);
    return (
      <div className="ob2-page">
        <div className="ob2-glow" style={{ background: hero.gradient }} />
        {renderTopbar()}
        <div className={`ob2-body ${direction === 'out' ? 'ob2-exit' : 'ob2-enter'}`}>
          <div className="ob2-hero-emoji">{hero.emoji}</div>
          <h1 className="ob2-title">What's your role?</h1>
          <p className="ob2-subtitle">This shapes your career goals and milestones</p>

          <div className="ob2-options-list">
            {ROLE_OPTIONS.map(r => (
              <button key={r.id}
                className={`ob2-option ${role === r.id ? 'ob2-option-on' : ''}`}
                onClick={() => { setRole(r.id); setRoleTarget(''); }}>
                <span>{r.label}</span>
                {role === r.id && <Check size={16} className="ob2-option-check" />}
              </button>
            ))}
          </div>

          {selectedRole && (
            <>
              <div className="ob2-divider" />
              <h2 className="ob2-title-sm">Where are you headed?</h2>
              <div className="ob2-options-list">
                {selectedRole.targetOptions.map(t => (
                  <button key={t.id}
                    className={`ob2-option ${roleTarget === t.id ? 'ob2-option-on' : ''}`}
                    onClick={() => setRoleTarget(t.id)}>
                    <span>{t.label}</span>
                    {roleTarget === t.id && <Check size={16} className="ob2-option-check" />}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
        <div className="ob2-footer">
          <button className="ob2-primary-btn" onClick={goForward} disabled={!role}>
            Continue <ChevronRight size={18} />
          </button>
        </div>
      </div>
    );
  }

  // ── STEP: Education ──
  if (step === 'education') {
    return (
      <div className="ob2-page">
        <div className="ob2-glow" style={{ background: hero.gradient }} />
        {renderTopbar()}
        <div className={`ob2-body ${direction === 'out' ? 'ob2-exit' : 'ob2-enter'}`}>
          <div className="ob2-hero-emoji">{hero.emoji}</div>
          <h1 className="ob2-title">What are you studying?</h1>
          <p className="ob2-subtitle">We'll create goals tailored to your program</p>
          <div className="ob2-options-list">
            {EDUCATION_OPTIONS.map(e => (
              <button key={e.id}
                className={`ob2-option ${education === e.id ? 'ob2-option-on' : ''}`}
                onClick={() => setEducation(e.id)}>
                <span>{e.label}</span>
                {education === e.id && <Check size={16} className="ob2-option-check" />}
              </button>
            ))}
          </div>
        </div>
        <div className="ob2-footer">
          <button className="ob2-primary-btn" onClick={goForward}>
            {education ? 'Continue' : 'Skip'} <ChevronRight size={18} />
          </button>
        </div>
      </div>
    );
  }

  // ── STEP: Family ──
  if (step === 'family') {
    return (
      <div className="ob2-page">
        <div className="ob2-glow" style={{ background: hero.gradient }} />
        {renderTopbar()}
        <div className={`ob2-body ${direction === 'out' ? 'ob2-exit' : 'ob2-enter'}`}>
          <div className="ob2-hero-emoji">{hero.emoji}</div>
          <h1 className="ob2-title">What's your family life like?</h1>
          <p className="ob2-subtitle">This personalizes your family pillar</p>
          <div className="ob2-options-list">
            {FAMILY_OPTIONS.map(f => (
              <button key={f.id}
                className={`ob2-option ${family === f.id ? 'ob2-option-on' : ''}`}
                onClick={() => setFamily(f.id)}>
                <span>{f.label}</span>
                {family === f.id && <Check size={16} className="ob2-option-check" />}
              </button>
            ))}
          </div>
        </div>
        <div className="ob2-footer">
          <button className="ob2-primary-btn" onClick={goForward}>
            {family ? 'Continue' : 'Skip'} <ChevronRight size={18} />
          </button>
        </div>
      </div>
    );
  }

  // ── STEP: Health ──
  if (step === 'health') {
    const toggleHealth = (id: string) => {
      setHealthFocus(prev => prev.includes(id) ? prev.filter(h => h !== id) : [...prev, id]);
    };
    return (
      <div className="ob2-page">
        <div className="ob2-glow" style={{ background: hero.gradient }} />
        {renderTopbar()}
        <div className={`ob2-body ${direction === 'out' ? 'ob2-exit' : 'ob2-enter'}`}>
          <div className="ob2-hero-emoji">{hero.emoji}</div>
          <h1 className="ob2-title">Health & Wellness Focus</h1>
          <p className="ob2-subtitle">Pick all that apply to you</p>
          <div className="ob2-chips-wrap ob2-chips-lg">
            {HEALTH_FOCUS_OPTIONS.map(h => {
              const on = healthFocus.includes(h.id);
              return (
                <button key={h.id}
                  className={`ob2-chip ob2-chip-health ${on ? 'ob2-chip-on' : ''}`}
                  style={on ? { background: 'linear-gradient(135deg, #10b981, #14b8a6)', color: '#fff', borderColor: 'transparent' } : {}}
                  onClick={() => toggleHealth(h.id)}>
                  {h.label}
                  {on && <Check size={14} />}
                </button>
              );
            })}
          </div>
        </div>
        <div className="ob2-footer">
          <button className="ob2-primary-btn" onClick={goForward}>
            {healthFocus.length > 0 ? 'Continue' : 'Skip'} <ChevronRight size={18} />
          </button>
        </div>
      </div>
    );
  }

  // ── STEP: Carousel ──
  const s = carouselSlides[slide];
  const isLast = slide === carouselSlides.length - 1;

  return (
    <div className="ob2-page">
      <div className="ob2-glow" style={{ background: hero.gradient }} />
      {renderTopbar()}
      <div className={`ob2-body ${direction === 'out' ? 'ob2-exit' : 'ob2-enter'}`}>
        <div className="ob2-hero-emoji ob2-hero-bounce" key={slide}>{s.emoji}</div>
        <h1 className="ob2-title">{s.title}</h1>
        <p className="ob2-subtitle">{s.desc}</p>
        <div className="ob2-example-card">
          <Sparkles size={14} className="ob2-example-icon" />
          <span>{s.example}</span>
        </div>
        <div className="ob2-carousel-dots">
          {carouselSlides.map((_, i) => (
            <button key={i}
              className={`ob2-dot ${i === slide ? 'ob2-dot-on' : ''}`}
              onClick={() => setSlide(i)} />
          ))}
        </div>
      </div>
      <div className="ob2-footer ob2-footer-col">
        {isLast ? (
          <button className="ob2-primary-btn ob2-finish-btn" onClick={handleFinish}>
            Launch My Compass <ArrowRight size={18} />
          </button>
        ) : (
          <button className="ob2-primary-btn" onClick={() => setSlide(slide + 1)}>
            Next <ChevronRight size={18} />
          </button>
        )}
        {!isLast && (
          <button className="ob2-skip-btn" onClick={handleFinish}>
            Skip tour
          </button>
        )}
      </div>
    </div>
  );
}
