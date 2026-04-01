import React, { useState, useRef } from 'react';
import {
  Compass, ArrowRight, ChevronLeft, ChevronRight, Sparkles,
  Sun, Zap, BarChart3, Check,
} from 'lucide-react';
import { useStore } from '../store';
import { Pillar } from '../types';
import {
  LIFE_TEMPLATES, PILLAR_DEFS, ROLE_OPTIONS, EDUCATION_OPTIONS,
  FAMILY_OPTIONS, HEALTH_FOCUS_OPTIONS, generatePillars,
  OnboardingConfig,
} from '../data/library';

/* ── Onboarding steps ──
   1. name      — What should we call you?
   2. template  — Pick a life template
   3. career    — Role + target (if template includes career)
   4. education — What are you studying? (if template includes education)
   5. family    — Family situation (if template includes family)
   6. health    — Health focus areas (if template includes health)
   7. custom    — Pick 3-5 pillars (only for "custom" template)
   8. carousel  — Welcome slides
*/

type Step = 'name' | 'template' | 'career' | 'education' | 'family' | 'health' | 'custom-pick' | 'carousel';

const carouselSlides = [
  {
    emoji: '🌅', color: '#f59e0b',
    bg: 'linear-gradient(135deg, #fef3c7, #fde68a)',
    title: 'Start Every Morning',
    desc: 'Set your top 3 priorities and intentions each day.',
    example: '"Focus on the arch review, study for 1 hour, be present at dinner."',
  },
  {
    emoji: '⚡', color: '#6366f1',
    bg: 'linear-gradient(135deg, #eef2ff, #e0e7ff)',
    title: 'Track Habits That Matter',
    desc: 'Tap to complete daily habits across your life pillars. Watch streaks grow.',
    example: '📚 Read technical paper · 💪 Exercise · 👶 Baby time · 🧘 Mindfulness',
  },
  {
    emoji: '📝', color: '#10b981',
    bg: 'linear-gradient(135deg, #ecfdf5, #d1fae5)',
    title: 'Log Wins & Blockers',
    desc: 'Quick-capture moments throughout your day. Tap + anytime.',
    example: '🏆 "Got buy-in on API design" · 🚧 "Blocked on security review"',
  },
  {
    emoji: '🌙', color: '#8b5cf6',
    bg: 'linear-gradient(135deg, #f5f3ff, #ede9fe)',
    title: 'Reflect & Grow',
    desc: 'End each day reviewing wins, challenges, and tomorrow\'s focus.',
    example: '"Best moment: nailed the VP talk. Tomorrow: finish PMP assignment."',
  },
];

export default function Onboarding() {
  const { dispatch } = useStore();

  // Shared state
  const [step, setStep] = useState<Step>('name');
  const [name, setName] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  // Config state
  const [templateId, setTemplateId] = useState('');
  const [role, setRole] = useState('');
  const [roleTarget, setRoleTarget] = useState('');
  const [education, setEducation] = useState('');
  const [family, setFamily] = useState('');
  const [healthFocus, setHealthFocus] = useState<string[]>([]);
  const [customPillars, setCustomPillars] = useState<string[]>([]);

  // Carousel state
  const [slide, setSlide] = useState(0);
  const [slideDir, setSlideDir] = useState<'left' | 'right'>('right');

  // ── Helpers ──

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

  const getNextStep = (current: Step): Step => {
    const flow: Step[] = ['template'];
    if (templateId === 'custom') flow.push('custom-pick');
    // After template/custom-pick, add relevant context steps
    const checkCareer = templateId === 'custom' ? customPillars.some(p => ['career', 'career-prep'].includes(p)) : needsCareer();
    const checkEdu = templateId === 'custom' ? customPillars.some(p => ['education', 'academics'].includes(p)) : needsEducation();
    const checkFamily = templateId === 'custom' ? customPillars.includes('family') : needsFamily();
    const checkHealth = templateId === 'custom' ? customPillars.some(p => ['health', 'wellness'].includes(p)) : needsHealth();

    if (checkCareer) flow.push('career');
    if (checkEdu) flow.push('education');
    if (checkFamily) flow.push('family');
    if (checkHealth) flow.push('health');
    flow.push('carousel');

    const idx = flow.indexOf(current);
    return idx >= 0 && idx < flow.length - 1 ? flow[idx + 1] : 'carousel';
  };

  const getPrevStep = (current: Step): Step | null => {
    const flow: Step[] = ['template'];
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

    const idx = flow.indexOf(current);
    return idx > 0 ? flow[idx - 1] : null;
  };

  // ── Finish ──

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
    // Cast to app's Pillar type (compatible structure)
    dispatch({ type: 'COMPLETE_ONBOARDING', payload: generated as unknown as Pillar[] });
  };

  // ── Step: Name ──
  if (step === 'name') {
    return (
      <div className="ob-screen">
        <div className="ob-name-card">
          <div className="ob-logo-ring"><Compass size={32} /></div>
          <h1 className="ob-brand">Life Compass</h1>
          <p className="ob-tagline">Your personal growth dashboard</p>
          <div className="ob-name-form">
            <label className="ob-label">What should we call you?</label>
            <input ref={inputRef} className="ob-name-input" type="text"
              placeholder="Your first name" value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter' && name.trim()) { dispatch({ type: 'SET_USER_NAME', payload: name.trim() }); setStep('template'); } }}
              autoFocus maxLength={20} />
            <button className="ob-name-btn"
              onClick={() => { dispatch({ type: 'SET_USER_NAME', payload: name.trim() }); setStep('template'); }}
              disabled={!name.trim()}>
              Continue <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── Step: Template ──
  if (step === 'template') {
    return (
      <div className="ob-screen">
        <div className="ob-step-card">
          <div className="ob-step-header">
            <p className="ob-step-label">Step 1</p>
            <h2 className="ob-step-title">What describes your life right now?</h2>
            <p className="ob-step-sub">We'll tailor your pillars, goals, and habits to match.</p>
          </div>
          <div className="ob-template-grid">
            {LIFE_TEMPLATES.map(t => (
              <button key={t.id}
                className={`ob-template-card ${templateId === t.id ? 'ob-template-active' : ''}`}
                onClick={() => { setTemplateId(t.id); setCustomPillars([]); }}>
                <span className="ob-template-emoji">{t.emoji}</span>
                <span className="ob-template-name">{t.name}</span>
                <span className="ob-template-desc">{t.description}</span>
                {templateId === t.id && <div className="ob-template-check"><Check size={14} /></div>}
              </button>
            ))}
          </div>
          <div className="ob-step-nav">
            <button className="ob-nav-back" onClick={() => setStep('name')}>
              <ChevronLeft size={18} />
            </button>
            <button className="ob-nav-go" onClick={() => setStep(getNextStep('template'))}
              disabled={!templateId}>
              Next <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── Step: Custom Pillar Picker ──
  if (step === 'custom-pick') {
    const togglePillar = (id: string) => {
      setCustomPillars(prev =>
        prev.includes(id) ? prev.filter(p => p !== id) : prev.length < 5 ? [...prev, id] : prev
      );
    };
    return (
      <div className="ob-screen">
        <div className="ob-step-card">
          <div className="ob-step-header">
            <p className="ob-step-label">Pick Your Pillars</p>
            <h2 className="ob-step-title">Choose 3–5 life areas</h2>
            <p className="ob-step-sub">{customPillars.length}/5 selected (min 3)</p>
          </div>
          <div className="ob-pillar-grid">
            {PILLAR_DEFS.map(p => {
              const selected = customPillars.includes(p.id);
              return (
                <button key={p.id}
                  className={`ob-pillar-chip ${selected ? 'ob-pillar-chip-on' : ''}`}
                  style={selected ? { background: p.gradient, color: 'white', borderColor: 'transparent' } : {}}
                  onClick={() => togglePillar(p.id)}>
                  <span className="ob-pillar-chip-dot" style={{ background: selected ? 'white' : p.color }} />
                  {p.name}
                  {selected && <Check size={12} />}
                </button>
              );
            })}
          </div>
          <div className="ob-step-nav">
            <button className="ob-nav-back" onClick={() => setStep('template')}>
              <ChevronLeft size={18} />
            </button>
            <button className="ob-nav-go" onClick={() => setStep(getNextStep('custom-pick'))}
              disabled={customPillars.length < 3}>
              Next <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── Step: Career ──
  if (step === 'career') {
    const selectedRole = ROLE_OPTIONS.find(r => r.id === role);
    return (
      <div className="ob-screen">
        <div className="ob-step-card">
          <div className="ob-step-header">
            <p className="ob-step-label">Career</p>
            <h2 className="ob-step-title">What's your role?</h2>
          </div>
          <div className="ob-option-list">
            {ROLE_OPTIONS.map(r => (
              <button key={r.id}
                className={`ob-option-btn ${role === r.id ? 'ob-option-active' : ''}`}
                onClick={() => { setRole(r.id); setRoleTarget(''); }}>
                {r.label}
                {role === r.id && <Check size={14} />}
              </button>
            ))}
          </div>

          {selectedRole && (
            <>
              <div className="ob-step-header" style={{ marginTop: 20 }}>
                <h2 className="ob-step-title">Where are you headed?</h2>
              </div>
              <div className="ob-option-list">
                {selectedRole.targetOptions.map(t => (
                  <button key={t.id}
                    className={`ob-option-btn ${roleTarget === t.id ? 'ob-option-active' : ''}`}
                    onClick={() => setRoleTarget(t.id)}>
                    {t.label}
                    {roleTarget === t.id && <Check size={14} />}
                  </button>
                ))}
              </div>
            </>
          )}

          <div className="ob-step-nav">
            <button className="ob-nav-back" onClick={() => { const prev = getPrevStep('career'); if (prev) setStep(prev); }}>
              <ChevronLeft size={18} />
            </button>
            <button className="ob-nav-go" onClick={() => setStep(getNextStep('career'))}
              disabled={!role}>
              Next <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── Step: Education ──
  if (step === 'education') {
    return (
      <div className="ob-screen">
        <div className="ob-step-card">
          <div className="ob-step-header">
            <p className="ob-step-label">Education</p>
            <h2 className="ob-step-title">What are you studying?</h2>
          </div>
          <div className="ob-option-list">
            {EDUCATION_OPTIONS.map(e => (
              <button key={e.id}
                className={`ob-option-btn ${education === e.id ? 'ob-option-active' : ''}`}
                onClick={() => setEducation(e.id)}>
                {e.label}
                {education === e.id && <Check size={14} />}
              </button>
            ))}
          </div>
          <div className="ob-step-nav">
            <button className="ob-nav-back" onClick={() => { const prev = getPrevStep('education'); if (prev) setStep(prev); }}>
              <ChevronLeft size={18} />
            </button>
            <button className="ob-nav-go" onClick={() => setStep(getNextStep('education'))}>
              {education ? 'Next' : 'Skip'} <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── Step: Family ──
  if (step === 'family') {
    return (
      <div className="ob-screen">
        <div className="ob-step-card">
          <div className="ob-step-header">
            <p className="ob-step-label">Family</p>
            <h2 className="ob-step-title">What's your family life like?</h2>
          </div>
          <div className="ob-option-list">
            {FAMILY_OPTIONS.map(f => (
              <button key={f.id}
                className={`ob-option-btn ${family === f.id ? 'ob-option-active' : ''}`}
                onClick={() => setFamily(f.id)}>
                {f.label}
                {family === f.id && <Check size={14} />}
              </button>
            ))}
          </div>
          <div className="ob-step-nav">
            <button className="ob-nav-back" onClick={() => { const prev = getPrevStep('family'); if (prev) setStep(prev); }}>
              <ChevronLeft size={18} />
            </button>
            <button className="ob-nav-go" onClick={() => setStep(getNextStep('family'))}>
              {family ? 'Next' : 'Skip'} <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── Step: Health ──
  if (step === 'health') {
    const toggleHealth = (id: string) => {
      setHealthFocus(prev => prev.includes(id) ? prev.filter(h => h !== id) : [...prev, id]);
    };
    return (
      <div className="ob-screen">
        <div className="ob-step-card">
          <div className="ob-step-header">
            <p className="ob-step-label">Health & Wellness</p>
            <h2 className="ob-step-title">What do you want to focus on?</h2>
            <p className="ob-step-sub">Pick all that apply</p>
          </div>
          <div className="ob-option-list ob-option-multi">
            {HEALTH_FOCUS_OPTIONS.map(h => {
              const on = healthFocus.includes(h.id);
              return (
                <button key={h.id}
                  className={`ob-option-btn ${on ? 'ob-option-active' : ''}`}
                  onClick={() => toggleHealth(h.id)}>
                  {h.label}
                  {on && <Check size={14} />}
                </button>
              );
            })}
          </div>
          <div className="ob-step-nav">
            <button className="ob-nav-back" onClick={() => { const prev = getPrevStep('health'); if (prev) setStep(prev); }}>
              <ChevronLeft size={18} />
            </button>
            <button className="ob-nav-go" onClick={() => setStep(getNextStep('health'))}>
              {healthFocus.length > 0 ? 'Next' : 'Skip'} <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── Step: Carousel (final) ──
  const s = carouselSlides[slide];
  const isLast = slide === carouselSlides.length - 1;

  const goSlide = (next: number) => {
    setSlideDir(next > slide ? 'right' : 'left');
    setSlide(next);
  };

  return (
    <div className="ob-screen">
      <div className="ob-carousel">
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

        <div className="ob-controls">
          <div className="ob-dots">
            {carouselSlides.map((_, i) => (
              <button key={i} className={`ob-dot ${i === slide ? 'ob-dot-active' : ''}`}
                onClick={() => goSlide(i)} />
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

        {!isLast && (
          <button className="ob-skip" onClick={handleFinish}>Skip tour</button>
        )}
      </div>
    </div>
  );
}
