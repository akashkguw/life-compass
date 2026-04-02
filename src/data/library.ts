// Life Compass Content Library
// Comprehensive templates, pillar definitions, and goal generation for the onboarding flow

export type PillarId = string;

export interface Milestone {
  id: string;
  title: string;
  completed: boolean;
  completedDate?: string;
}

export interface Goal {
  id: string;
  pillarId: string;
  title: string;
  description: string;
  milestones: Milestone[];
  targetDate?: string;
  status: 'active' | 'completed' | 'paused';
}

export interface Habit {
  id: string;
  pillarId: string;
  title: string;
  frequency: 'daily' | 'weekly';
  icon?: string;
  priority: 'high' | 'medium' | 'low';
  createdDate: string;
  removedDate?: string;
}

// Re-export from types — but we use a local version for generation
// The final output matches the app's Pillar interface
export interface GeneratedPillar {
  id: string;
  name: string;
  tagline: string;
  color: string;
  gradient: string;
  iconName: string;
  goals: Goal[];
  habits: Habit[];
}

export interface LifeTemplate {
  id: string;
  name: string;
  emoji: string;
  description: string;
  pillarCategories: string[];
}

export interface PillarDef {
  id: string;
  name: string;
  color: string;
  gradient: string;
  iconName: string;
  category: string;
}

export interface RoleOption {
  id: string;
  label: string;
  targetOptions: { id: string; label: string }[];
}

export interface EducationOption {
  id: string;
  label: string;
}

export interface FamilyOption {
  id: string;
  label: string;
}

export interface HealthFocusOption {
  id: string;
  label: string;
}

export interface OnboardingConfig {
  templateId: string;
  role?: string;
  roleTarget?: string;
  education?: string;
  family?: string;
  healthFocus?: string[];
  customPillars?: string[];
}

// ID Generation Helper
let _idCounter = 0;
function uid(prefix: string): string {
  return `${prefix}-${++_idCounter}`;
}

// ============================================================================
// LIFE TEMPLATES
// ============================================================================

export const LIFE_TEMPLATES: LifeTemplate[] = [
  {
    id: 'balanced',
    name: 'Balanced Life',
    emoji: '⚖️',
    description: 'Build a well-rounded life across career, education, family, home, and health',
    pillarCategories: ['career', 'education', 'family', 'home', 'health'],
  },
  {
    id: 'career-focus',
    name: 'Career Focus',
    emoji: '🚀',
    description: 'Accelerate your career with dedicated focus on skills, networking, and finance',
    pillarCategories: ['career', 'skills', 'networking', 'finance', 'wellness'],
  },
  {
    id: 'student',
    name: 'Student',
    emoji: '🎓',
    description: 'Thrive in academics, career prep, social life, health, and personal growth',
    pillarCategories: ['academics', 'career-prep', 'social', 'health', 'personal-growth'],
  },
  {
    id: 'custom',
    name: 'Custom',
    emoji: '✨',
    description: 'Create your own life pillars',
    pillarCategories: [],
  },
];

// ============================================================================
// PILLAR DEFINITIONS
// ============================================================================

export const PILLAR_DEFS: PillarDef[] = [
  // Balanced template pillars
  { id: 'career', name: 'Career', color: '#6366f1', gradient: 'linear-gradient(135deg, #6366f1, #8b5cf6)', iconName: 'Rocket', category: 'career' },
  { id: 'education', name: 'Education', color: '#0ea5e9', gradient: 'linear-gradient(135deg, #0ea5e9, #06b6d4)', iconName: 'GraduationCap', category: 'education' },
  { id: 'family', name: 'Family', color: '#f43f5e', gradient: 'linear-gradient(135deg, #f43f5e, #ec4899)', iconName: 'Heart', category: 'family' },
  { id: 'home', name: 'Home', color: '#f59e0b', gradient: 'linear-gradient(135deg, #f59e0b, #f97316)', iconName: 'Home', category: 'home' },
  { id: 'health', name: 'Health', color: '#10b981', gradient: 'linear-gradient(135deg, #10b981, #14b8a6)', iconName: 'Activity', category: 'health' },

  // Career-focus template pillars
  { id: 'skills', name: 'Skills', color: '#8b5cf6', gradient: 'linear-gradient(135deg, #8b5cf6, #a855f7)', iconName: 'Zap', category: 'skills' },
  { id: 'networking', name: 'Networking', color: '#ec4899', gradient: 'linear-gradient(135deg, #ec4899, #f472b6)', iconName: 'Users', category: 'networking' },
  { id: 'finance', name: 'Finance', color: '#14b8a6', gradient: 'linear-gradient(135deg, #14b8a6, #2dd4bf)', iconName: 'DollarSign', category: 'finance' },
  { id: 'wellness', name: 'Wellness', color: '#10b981', gradient: 'linear-gradient(135deg, #10b981, #34d399)', iconName: 'Activity', category: 'wellness' },

  // Student template pillars
  { id: 'academics', name: 'Academics', color: '#0ea5e9', gradient: 'linear-gradient(135deg, #0ea5e9, #38bdf8)', iconName: 'GraduationCap', category: 'academics' },
  { id: 'career-prep', name: 'Career Prep', color: '#3b82f6', gradient: 'linear-gradient(135deg, #3b82f6, #60a5fa)', iconName: 'Target', category: 'career-prep' },
  { id: 'social', name: 'Social', color: '#ec4899', gradient: 'linear-gradient(135deg, #ec4899, #f472b6)', iconName: 'Users', category: 'social' },
  { id: 'personal-growth', name: 'Personal Growth', color: '#a855f7', gradient: 'linear-gradient(135deg, #a855f7, #c084fc)', iconName: 'TrendingUp', category: 'personal-growth' },

  // Custom template extras
  { id: 'creativity', name: 'Creativity', color: '#f97316', gradient: 'linear-gradient(135deg, #f97316, #fb923c)', iconName: 'Sparkles', category: 'creativity' },
  { id: 'spirituality', name: 'Spirituality', color: '#6d28d9', gradient: 'linear-gradient(135deg, #6d28d9, #7c3aed)', iconName: 'Compass', category: 'spirituality' },
  { id: 'side-project', name: 'Side Project', color: '#06b6d4', gradient: 'linear-gradient(135deg, #06b6d4, #22d3ee)', iconName: 'Rocket', category: 'side-project' },
];

// ============================================================================
// ROLE OPTIONS (CAREER PILLAR)
// ============================================================================

export const ROLE_OPTIONS: RoleOption[] = [
  {
    id: 'swe',
    label: 'Software Engineer',
    targetOptions: [
      { id: 'senior-engineer', label: 'Senior Engineer' },
      { id: 'staff-principal', label: 'Staff/Principal Engineer' },
      { id: 'engineering-manager', label: 'Engineering Manager' },
      { id: 'architect', label: 'Architect' },
    ],
  },
  {
    id: 'pm',
    label: 'Product Manager',
    targetOptions: [
      { id: 'senior-pm', label: 'Senior PM' },
      { id: 'director-product', label: 'Director of Product' },
      { id: 'vp-product', label: 'VP Product' },
      { id: 'cpo', label: 'CPO' },
    ],
  },
  {
    id: 'designer',
    label: 'Designer',
    targetOptions: [
      { id: 'senior-designer', label: 'Senior Designer' },
      { id: 'design-lead', label: 'Design Lead' },
      { id: 'head-design', label: 'Head of Design' },
      { id: 'design-director', label: 'Design Director' },
    ],
  },
  {
    id: 'data',
    label: 'Data Scientist/Analyst',
    targetOptions: [
      { id: 'senior-ds', label: 'Senior Data Scientist' },
      { id: 'lead-ds', label: 'Lead Data Scientist' },
      { id: 'ml-manager', label: 'ML Engineering Manager' },
      { id: 'head-data', label: 'Head of Data' },
    ],
  },
  {
    id: 'devops',
    label: 'DevOps/SRE',
    targetOptions: [
      { id: 'senior-sre', label: 'Senior SRE' },
      { id: 'staff-sre', label: 'Staff SRE' },
      { id: 'platform-lead', label: 'Platform Lead' },
      { id: 'director-engineering', label: 'Director of Engineering' },
    ],
  },
  {
    id: 'marketing',
    label: 'Marketing',
    targetOptions: [
      { id: 'senior-marketing', label: 'Senior Marketing' },
      { id: 'marketing-director', label: 'Marketing Director' },
      { id: 'vp-marketing', label: 'VP Marketing' },
      { id: 'cmo', label: 'CMO' },
    ],
  },
  {
    id: 'sales',
    label: 'Sales',
    targetOptions: [
      { id: 'senior-ae', label: 'Senior Account Executive' },
      { id: 'sales-manager', label: 'Sales Manager' },
      { id: 'sales-director', label: 'Sales Director' },
      { id: 'vp-sales', label: 'VP Sales' },
    ],
  },
  {
    id: 'finance-role',
    label: 'Finance/Accounting',
    targetOptions: [
      { id: 'senior-analyst', label: 'Senior Analyst' },
      { id: 'finance-manager', label: 'Finance Manager' },
      { id: 'controller', label: 'Controller' },
      { id: 'cfo', label: 'CFO' },
    ],
  },
  {
    id: 'hr',
    label: 'People/HR',
    targetOptions: [
      { id: 'senior-hrbp', label: 'Senior HRBP' },
      { id: 'hr-director', label: 'HR Director' },
      { id: 'vp-people', label: 'VP People' },
      { id: 'chro', label: 'CHRO' },
    ],
  },
  {
    id: 'founder',
    label: 'Founder/Entrepreneur',
    targetOptions: [
      { id: 'pmf', label: 'Product-Market Fit' },
      { id: 'series-a', label: 'Series A' },
      { id: 'scale-50', label: 'Scale to 50+' },
      { id: 'ipo-exit', label: 'IPO/Exit' },
    ],
  },
  {
    id: 'manager',
    label: 'Engineering Manager',
    targetOptions: [
      { id: 'senior-em', label: 'Senior EM' },
      { id: 'director', label: 'Director' },
      { id: 'vp-engineering', label: 'VP Engineering' },
      { id: 'cto', label: 'CTO' },
    ],
  },
  {
    id: 'consultant',
    label: 'Consultant',
    targetOptions: [
      { id: 'senior-consultant', label: 'Senior Consultant' },
      { id: 'manager-consultant', label: 'Manager' },
      { id: 'partner', label: 'Partner' },
      { id: 'own-practice', label: 'Own Practice' },
    ],
  },
  {
    id: 'other',
    label: 'Other',
    targetOptions: [
      { id: 'next-level', label: 'Next Level' },
      { id: 'leadership-role', label: 'Leadership Role' },
      { id: 'domain-expert', label: 'Domain Expert' },
      { id: 'career-pivot', label: 'Career Pivot' },
    ],
  },
];

// ============================================================================
// EDUCATION OPTIONS
// ============================================================================

export const EDUCATION_OPTIONS: EducationOption[] = [
  { id: 'pmp', label: 'Project Management (PMP)' },
  { id: 'mba', label: 'MBA' },
  { id: 'ms-cs', label: 'MS Computer Science' },
  { id: 'ms-other', label: 'MS (Other)' },
  { id: 'certification', label: 'Professional Certification' },
  { id: 'bootcamp', label: 'Bootcamp/Course' },
  { id: 'self-learning', label: 'Self-Directed Learning' },
  { id: 'phd', label: 'PhD' },
  { id: 'none', label: 'Not currently studying' },
];

// ============================================================================
// FAMILY OPTIONS
// ============================================================================

export const FAMILY_OPTIONS: FamilyOption[] = [
  { id: 'single', label: 'Single' },
  { id: 'partner', label: 'With Partner' },
  { id: 'new-parent', label: 'New Parent' },
  { id: 'parent-young', label: 'Parent (Young Kids)' },
  { id: 'parent-teen', label: 'Parent (Teenagers)' },
  { id: 'caregiver', label: 'Family Caregiver' },
];

// ============================================================================
// HEALTH FOCUS OPTIONS (MULTI-SELECT)
// ============================================================================

export const HEALTH_FOCUS_OPTIONS: HealthFocusOption[] = [
  { id: 'fitness', label: 'Fitness & Strength' },
  { id: 'weight', label: 'Weight Management' },
  { id: 'mental', label: 'Mental Wellness' },
  { id: 'sleep', label: 'Sleep & Recovery' },
  { id: 'nutrition', label: 'Nutrition' },
  { id: 'running', label: 'Running/Cardio' },
];

// ============================================================================
// PILLAR GENERATION LOGIC
// ============================================================================

function createGoal(
  pillarId: string,
  title: string,
  description: string,
  milestones: string[],
  targetDate?: string
): Goal {
  return {
    id: uid('goal'),
    pillarId,
    title,
    description,
    status: 'active',
    targetDate,
    milestones: milestones.map((m) => ({
      id: uid('milestone'),
      title: m,
      completed: false,
    })),
  };
}

function getLocalDateISO(): string {
  // Keep habit dates in local yyyy-MM-dd to match app-wide date comparisons.
  const now = new Date();
  const local = new Date(now.getTime() - now.getTimezoneOffset() * 60000);
  return local.toISOString().slice(0, 10);
}

function createHabit(
  pillarId: string,
  title: string,
  frequency: 'daily' | 'weekly',
  icon?: string
): Habit {
  return {
    id: uid('habit'),
    pillarId,
    title,
    frequency,
    icon,
    priority: 'medium' as const,
    createdDate: getLocalDateISO(),
  };
}

function createPillar(
  id: string,
  name: string,
  _category: string,
  color: string,
  gradient: string,
  iconName: string,
  goals: Goal[],
  habits: Habit[],
  tagline?: string
): GeneratedPillar {
  return {
    id,
    name,
    color,
    gradient,
    iconName,
    tagline: tagline || name,
    goals,
    habits,
  };
}

// ============================================================================
// ROLE-SPECIFIC CAREER PILLAR GENERATORS
// ============================================================================

function generateCareerPillar(role?: string, roleTarget?: string): GeneratedPillar {
  const pillarDef = PILLAR_DEFS.find((p) => p.id === 'career')!;
  let goals: Goal[] = [];
  let habits: Habit[] = [];
  let tagline = '';

  if (role === 'swe') {
    if (roleTarget === 'staff-principal') {
      tagline = 'SWE → Staff/Principal Engineer';
      goals = [
        createGoal(
          'career',
          '🏗️ Technical Leadership',
          'Establish yourself as a technical authority and shape architectural decisions across the organization',
          [
            'Write comprehensive tech strategy document for your domain',
            'Lead cross-team architecture review with 2+ teams',
            'Propose and establish organization-wide technical standard',
            'Mentor SDE through complex system design with 1:1 guidance',
            'Deliver widely-attended tech talk to VP+ audience',
          ],
          '12 months'
        ),
        createGoal(
          'career',
          '🌐 Organizational Influence',
          'Build visibility and influence across the organization through impact and relationships',
          [
            'Present quarterly business impact to VP+ leadership',
            'Actively mentor 2+ engineers through significant career milestones',
            'Lead cross-org technical initiative with measurable outcomes',
            'Build trusted relationships with 3+ partner team leads',
            'Author widely-read internal technical documentation or design',
          ],
          '12 months'
        ),
        createGoal(
          'career',
          '📋 Promotion Readiness',
          'Prepare and execute a strong promotion case to Staff/Principal',
          [
            'Draft comprehensive promotion document aligned with leveling criteria',
            'Collect and organize 5+ impact artifacts (design docs, incident learnings, mentorship evidence)',
            'Align with manager on career gaps and mitigation plan',
            'Engage promotion sponsor and secure sponsorship',
            'Complete final promo doc with collected evidence and narrative',
          ],
          '12 months'
        ),
      ];
      habits = [
        createHabit('career', '📖 Review or write design doc', 'weekly', '📝'),
        createHabit('career', '☕ Skip-level 1:1 with leadership', 'weekly', '👥'),
        createHabit('career', '📊 Update promotion artifacts', 'weekly', '📋'),
        createHabit('career', '📰 Read technical paper or RFC', 'daily', '🧠'),
      ];
    } else if (roleTarget === 'engineering-manager') {
      tagline = 'SWE → Engineering Manager';
      goals = [
        createGoal(
          'career',
          '👥 People Leadership',
          'Develop foundational people leadership skills and experience',
          [
            'Own end-to-end scope of intern/new grad mentoring and project delivery',
            'Start 1:1 mentoring relationship with high-potential peer',
            'Run structured team retrospective or post-mortem with full participation',
            'Deliver constructive peer feedback to 3+ engineers in formal settings',
            'Shadow engineering manager for full sprint cycle, observe 1:1s and planning',
          ],
          '9 months'
        ),
        createGoal(
          'career',
          '📦 Delivery & Process',
          'Take ownership of delivery accountability and team processes',
          [
            'Own sprint planning and scope management for team sprint',
            'Manage team project end-to-end from kickoff through retrospective',
            'Create and maintain team metrics dashboard with clear ownership indicators',
            'Run blameless postmortem for significant incident with follow-ups',
            'Establish 2+ team rituals (standups, retros, design reviews) and document',
          ],
          '9 months'
        ),
      ];
      habits = [
        createHabit('career', '🎯 Facilitate daily standup', 'daily', '📢'),
        createHabit('career', '💬 1:1 with mentee', 'weekly', '👤'),
        createHabit('career', '📚 Read management book chapter', 'weekly', '📖'),
        createHabit('career', '🤔 Reflect on team dynamics', 'weekly', '🧠'),
      ];
    } else if (roleTarget === 'architect') {
      tagline = 'SWE → Architect';
      goals = [
        createGoal(
          'career',
          '🏗️ Architectural Vision',
          'Develop and communicate clear, scalable architectural direction',
          [
            'Design multi-year technical roadmap for core system',
            'Evaluate and document 2+ architectural alternatives with trade-offs',
            'Lead architecture decision making for org-wide initiative',
            'Present architectural vision to 3+ technical stakeholders',
            'Create architecture decision records (ADRs) for 5+ major decisions',
          ],
          '12 months'
        ),
        createGoal(
          'career',
          '🔗 Cross-Team Alignment',
          'Coordinate technical direction across teams and domains',
          [
            'Facilitate architectural alignment meeting between 3+ teams',
            'Document shared patterns and platform capabilities',
            'Resolve 2+ architectural conflicts between teams',
            'Build relationships with architects/leads from partner teams',
            'Establish architecture review board or steering committee',
          ],
          '12 months'
        ),
      ];
      habits = [
        createHabit('career', '🏛️ Architecture review session', 'weekly', '🔍'),
        createHabit('career', '🔧 System design deep-dive', 'weekly', '⚙️'),
        createHabit('career', '📊 Review operational metrics', 'daily', '📈'),
        createHabit('career', '🤝 Architecture sync with teams', 'weekly', '👥'),
      ];
    } else {
      tagline = 'SWE → Senior Engineer';
      goals = [
        createGoal(
          'career',
          '🎯 Technical Depth',
          'Become a recognized technical expert in your domain',
          [
            'Complete 2+ complex technical projects showcasing mastery',
            'Lead design review for high-impact system redesign',
            'Write 3+ technical design documents used across the org',
            'Mentor 2+ engineers on technical growth',
            'Present technical deep-dive to leadership',
          ],
          '12 months'
        ),
        createGoal(
          'career',
          '💪 Impact at Scale',
          'Demonstrate consistent high impact on org-wide initiatives',
          [
            'Own system component used by 2+ teams or serving 1M+ users',
            'Unblock 3+ teams through technical guidance or solutions',
            'Improve system performance/reliability by 50%+',
            'Identify and drive 2+ process improvements',
            'Lead incident response for critical production issue',
          ],
          '12 months'
        ),
      ];
      habits = [
        createHabit('career', '💻 Code review and mentorship', 'daily', '👁️'),
        createHabit('career', '📖 Read technical documentation', 'weekly', '📚'),
        createHabit('career', '🧪 Write or improve tests', 'daily', '✅'),
        createHabit('career', '🤝 Pair programming sessions', 'weekly', '👥'),
      ];
    }
  } else if (role === 'pm') {
    if (roleTarget === 'director-product') {
      tagline = 'PM → Director of Product';
      goals = [
        createGoal(
          'career',
          '🎯 Strategic Product Vision',
          'Define and communicate compelling product strategy and vision',
          [
            'Write comprehensive product vision document covering 2+ year horizon',
            'Lead quarterly planning cycle across 2+ product teams',
            'Present product strategy to executive leadership with clear rationale',
            'Establish customer feedback loop with monthly review cadence',
            'Ship major 0→1 product or feature category',
          ],
          '12 months'
        ),
        createGoal(
          'career',
          '🌐 Cross-Functional Leadership',
          'Lead product organizations and align multiple functional areas',
          [
            'Align engineering and design on joint roadmap with clear dependencies',
            'Build stakeholder influence map and secure buy-in from 5+ leaders',
            'Run quarterly product strategy review with executive team',
            'Mentor 2+ junior PMs through complex product decisions',
            'Lead org retrospective and establish new process or methodology',
          ],
          '12 months'
        ),
      ];
      habits = [
        createHabit('career', '👥 Customer interview or user research', 'weekly', '🎤'),
        createHabit('career', '📊 Review product metrics and trends', 'daily', '📈'),
        createHabit('career', '🔍 Competitive analysis', 'weekly', '🔎'),
        createHabit('career', '📋 Roadmap refinement', 'weekly', '📝'),
      ];
    } else {
      tagline = `PM → ${roleTarget === 'senior-pm' ? 'Senior PM' : 'VP Product'}`;
      goals = [
        createGoal(
          'career',
          '🚀 Product Growth',
          'Drive measurable product adoption and engagement growth',
          [
            'Launch major product initiative with 20%+ adoption',
            'Grow key engagement metric by 50%+ through product changes',
            'Reduce key friction metric by 40%+',
            'Ship 3+ features that rank in top user requests',
            'Present quarterly product results to leadership',
          ],
          '9 months'
        ),
        createGoal(
          'career',
          '🤝 Stakeholder Alignment',
          'Build trust and influence across engineering and marketing',
          [
            'Establish weekly alignment meetings with eng and design leads',
            'Secure commitment for 2+ major engineering projects',
            'Launch coordinated marketing campaign for product release',
            'Mentor junior PM through launch cycle',
            'Present product strategy to board or investor',
          ],
          '9 months'
        ),
      ];
      habits = [
        createHabit('career', '👥 Talk to customers', 'weekly', '💬'),
        createHabit('career', '📊 Review metrics daily', 'daily', '📉'),
        createHabit('career', '🔄 Competitive review', 'weekly', '🔎'),
      ];
    }
  } else if (role === 'designer') {
    if (roleTarget === 'design-lead') {
      tagline = 'Designer → Design Lead';
      goals = [
        createGoal(
          'career',
          '✨ Design Excellence',
          'Establish design excellence and systems thinking across products',
          [
            'Build comprehensive design system with 50+ components and patterns',
            'Lead UX research initiative covering 3+ user segments',
            'Ship flagship feature design that becomes model for org',
            'Present design vision to executive leadership',
            'Mentor junior designer through 2+ major projects',
          ],
          '12 months'
        ),
        createGoal(
          'career',
          '🌐 Strategic Influence',
          'Influence product and business strategy through design perspective',
          [
            'Participate in quarterly product strategy planning',
            'Present design recommendations to VP+ leadership',
            'Build 12-month design roadmap aligned with product goals',
            'Establish design review process with clear ownership and criteria',
            'Lead design workshop with cross-functional teams',
          ],
          '12 months'
        ),
      ];
      habits = [
        createHabit('career', '👀 Design critique session', 'weekly', '🎨'),
        createHabit('career', '📦 Update portfolio with new work', 'weekly', '🖼️'),
        createHabit('career', '💡 Design inspiration gathering', 'daily', '✨'),
        createHabit('career', '🔍 User testing observation', 'weekly', '👁️'),
      ];
    } else {
      tagline = `Designer → ${roleTarget === 'senior-designer' ? 'Senior Designer' : 'Design Director'}`;
      goals = [
        createGoal(
          'career',
          '🎨 Design Impact',
          'Create designs that meaningfully improve user experience and engagement',
          [
            'Ship 3+ features that measurably improve user satisfaction or engagement',
            'Conduct design audit of major flow and deliver recommendations',
            'Lead design of new product category or major feature',
            'Present design work to leadership and users',
            'Mentor 1+ junior designer',
          ],
          '9 months'
        ),
      ];
      habits = [
        createHabit('career', '🎨 Design sketching or prototyping', 'daily', '✏️'),
        createHabit('career', '👥 User research or feedback', 'weekly', '🎤'),
        createHabit('career', '📚 Design system contribution', 'weekly', '📐'),
      ];
    }
  } else if (role === 'data') {
    if (roleTarget === 'lead-ds') {
      tagline = 'Data Scientist → Lead Data Scientist';
      goals = [
        createGoal(
          'career',
          '🧠 Technical Depth',
          'Develop specialized expertise in machine learning and analytics',
          [
            'Publish internal ML research paper with novel methodology',
            'Build end-to-end production ML model pipeline with 90%+ accuracy',
            'Establish A/B testing framework used org-wide',
            'Present technical findings to executive leadership',
            'Create comprehensive data governance and quality standards',
          ],
          '12 months'
        ),
        createGoal(
          'career',
          '👥 Team Impact',
          'Lead data science initiatives and develop junior team members',
          [
            'Mentor junior data scientist through capstone project',
            'Establish data science team best practices and standards',
            'Create reusable ML tooling and libraries for team',
            'Lead cross-team data initiative involving 2+ departments',
            'Present quarterly data science impact and roadmap',
          ],
          '12 months'
        ),
      ];
      habits = [
        createHabit('career', '📰 Read ML/stats paper', 'weekly', '📖'),
        createHabit('career', '📊 Review experiment results', 'daily', '📈'),
        createHabit('career', '🔬 Practice SQL/modeling', 'daily', '💻'),
        createHabit('career', '🤝 Data science discussion', 'weekly', '👥'),
      ];
    } else {
      tagline = `Data Scientist → ${roleTarget === 'senior-ds' ? 'Senior' : 'ML Manager'}`;
      goals = [
        createGoal(
          'career',
          '📊 Impact Analytics',
          'Drive business decisions through high-impact data insights',
          [
            'Deliver 3+ analyses that drive significant business decisions',
            'Build predictive model that improves key business metric by 25%+',
            'Lead data audit of major business process with recommendations',
            'Present quarterly insights to leadership',
            'Mentor 1+ analyst or junior DS',
          ],
          '9 months'
        ),
      ];
      habits = [
        createHabit('career', '💻 Coding practice', 'daily', '🖥️'),
        createHabit('career', '📊 Data exploration', 'daily', '📉'),
        createHabit('career', '📚 Learn new technique', 'weekly', '🧠'),
      ];
    }
  } else if (role === 'manager') {
    if (roleTarget === 'director') {
      tagline = 'Engineering Manager → Director';
      goals = [
        createGoal(
          'career',
          '🏛️ Organizational Leadership',
          'Lead multiple teams and shape engineering organization strategy',
          [
            'Grow team by 2+ successful hires with strong retention',
            'Achieve team OKRs for 2+ consecutive quarters',
            'Establish cross-team process or initiative with adoption',
            'Present engineering strategy to VP+ leadership',
            'Lead team through organizational change or reorg',
          ],
          '12 months'
        ),
        createGoal(
          'career',
          '👥 People Development',
          'Build strong talent and establish career development culture',
          [
            'Promote 2+ engineers from team with clear career path',
            'Create engineering career ladder and share with team',
            'Build recruiting pipeline with 5+ external candidates',
            'Run effective skip-level 1:1s with team members',
            'Establish team culture values and practices doc',
          ],
          '12 months'
        ),
      ];
      habits = [
        createHabit('career', '💬 1:1 with direct reports', 'weekly', '👤'),
        createHabit('career', '🏥 Org health check', 'weekly', '❤️'),
        createHabit('career', '📚 Leadership reading', 'daily', '📖'),
        createHabit('career', '🤝 Skip-level 1:1s', 'weekly', '👥'),
      ];
    } else {
      tagline = `Engineering Manager → ${roleTarget === 'senior-em' ? 'Senior EM' : 'VP Engineering'}`;
      goals = [
        createGoal(
          'career',
          '👥 Team Excellence',
          'Build high-performing team with strong delivery and culture',
          [
            'Hire and onboard 3+ strong engineers',
            'Achieve team delivery targets for 2+ quarters',
            'Establish team process improvements with measurable outcomes',
            'Mentor 2+ engineers toward growth and promotions',
            'Lead postmortem and implement improvements for key incident',
          ],
          '9 months'
        ),
      ];
      habits = [
        createHabit('career', '💬 1:1 with team', 'weekly', '👥'),
        createHabit('career', '📊 Review team metrics', 'weekly', '📈'),
        createHabit('career', '📚 Management book', 'weekly', '📖'),
      ];
    }
  } else if (role === 'founder') {
    if (roleTarget === 'pmf') {
      tagline = 'Founder → Product-Market Fit';
      goals = [
        createGoal(
          'career',
          '🎯 Customer Validation',
          'Find and validate your core customer and problem fit',
          [
            'Conduct 50+ customer interviews and document insights',
            'Define and validate MVP scope with customer feedback',
            'Ship minimum viable product to early users',
            'Acquire and retain 10 paying customers with positive feedback',
            'Iterate on product based on usage patterns and feedback',
          ],
          '12 months'
        ),
        createGoal(
          'career',
          '📊 Metrics & Traction',
          'Establish key metrics and demonstrate growth trajectory',
          [
            'Define unit economics and target LTV/CAC ratio',
            'Build revenue model with 3+ months of data',
            'Establish product roadmap based on data and customer feedback',
            'Achieve 20%+ month-over-month growth in key metric',
            'Secure initial customers on monthly contract',
          ],
          '12 months'
        ),
      ];
      habits = [
        createHabit('career', '👥 Customer outreach', 'daily', '📞'),
        createHabit('career', '🚀 Build and ship', 'daily', '⚒️'),
        createHabit('career', '📔 Journal learnings', 'daily', '📝'),
        createHabit('career', '📊 Review metrics', 'weekly', '📈'),
      ];
    } else {
      tagline = `Founder → ${roleTarget === 'series-a' ? 'Series A' : roleTarget === 'scale-50' ? 'Scale to 50+' : 'IPO/Exit'}`;
      goals = [
        createGoal(
          'career',
          '📈 Growth & Scaling',
          'Accelerate growth and build sustainable business',
          [
            'Grow revenue by 3x+ in current period',
            'Build team to 15+ people with clear roles',
            'Establish product roadmap for next 12 months',
            'Secure strategic partnerships or enterprise customers',
            'Improve unit economics and path to profitability',
          ],
          '12 months'
        ),
      ];
      habits = [
        createHabit('career', '💼 Business development', 'daily', '🤝'),
        createHabit('career', '📊 Review business metrics', 'daily', '📈'),
        createHabit('career', '👥 Team building', 'weekly', '👤'),
      ];
    }
  } else if (role === 'consultant') {
    if (roleTarget === 'partner') {
      tagline = 'Consultant → Partner';
      goals = [
        createGoal(
          'career',
          '💼 Client Impact',
          'Deliver exceptional client value and build reputation',
          [
            'Lead flagship engagement with significant client impact',
            'Build repeat business with 3+ clients with 2+ engagements each',
            'Develop industry expertise paper or thought leadership',
            'Present at industry conference or event',
            'Generate $2M+ revenue from client work',
          ],
          '12 months'
        ),
        createGoal(
          'career',
          '🏢 Firm Building',
          'Contribute to firm growth and establish partnership value',
          [
            'Mentor 3+ junior consultants through complex engagements',
            'Develop consulting methodology framework',
            'Build recruiting pipeline with 10+ candidates',
            'Contribute thought leadership article or research',
            'Establish strategic partnership with complementary firm',
          ],
          '12 months'
        ),
      ];
      habits = [
        createHabit('career', '📞 Client check-in', 'daily', '☎️'),
        createHabit('career', '💼 Business development', 'weekly', '🤝'),
        createHabit('career', '📚 Knowledge sharing', 'weekly', '🧠'),
        createHabit('career', '👥 Mentor junior consultant', 'weekly', '👤'),
      ];
    } else {
      tagline = `Consultant → ${roleTarget === 'senior-consultant' ? 'Senior' : roleTarget === 'manager-consultant' ? 'Manager' : 'Own Practice'}`;
      goals = [
        createGoal(
          'career',
          '💼 Engagement Excellence',
          'Deliver high-value client engagements with measurable impact',
          [
            'Lead 3+ engagements from sales through delivery',
            'Achieve 90%+ client satisfaction ratings',
            'Deliver quantifiable business value for clients',
            'Build 2+ long-term client relationships',
            'Develop 1+ signature methodology or approach',
          ],
          '9 months'
        ),
      ];
      habits = [
        createHabit('career', '💼 Client engagement', 'daily', '🤝'),
        createHabit('career', '📊 Delivery excellence', 'daily', '✅'),
        createHabit('career', '👥 Relationship building', 'weekly', '👤'),
      ];
    }
  } else if (role === 'hr') {
    if (roleTarget === 'hr-director') {
      tagline = 'HR → Director';
      goals = [
        createGoal(
          'career',
          '📋 People Strategy',
          'Design and implement company-wide people strategy',
          [
            'Redesign compensation framework and present to leadership',
            'Launch DEI initiative with measurable goals and tracking',
            'Build employer brand and increase recruitment pipeline quality',
            'Implement people analytics dashboard with org insights',
            'Establish succession planning for key roles',
          ],
          '12 months'
        ),
        createGoal(
          'career',
          '🏢 Organizational Impact',
          'Improve retention, hiring, and organizational health',
          [
            'Reduce attrition by 20% with exit interview insights',
            'Streamline hiring process reducing time-to-hire by 30%',
            'Launch L&D program with 80%+ participation',
            'Create HRBP playbook and train team',
            'Establish company culture and values documentation',
          ],
          '12 months'
        ),
      ];
      habits = [
        createHabit('career', '👥 Employee pulse check', 'daily', '❤️'),
        createHabit('career', '📋 Policy review', 'weekly', '📄'),
        createHabit('career', '💬 1:1 with stakeholders', 'weekly', '👤'),
        createHabit('career', '📊 Review talent metrics', 'weekly', '📈'),
      ];
    } else {
      tagline = `HR → ${roleTarget === 'senior-hrbp' ? 'Senior HRBP' : 'VP People'}`;
      goals = [
        createGoal(
          'career',
          '👥 People Engagement',
          'Drive employee engagement and development',
          [
            'Build executive relationship and understand business strategy',
            'Implement 2+ org initiatives with executive buy-in',
            'Mentor 2+ team members with strong development',
            'Create performance management process improvement',
            'Launch employee development program',
          ],
          '9 months'
        ),
      ];
      habits = [
        createHabit('career', '💬 Stakeholder conversations', 'daily', '👥'),
        createHabit('career', '📋 People planning', 'weekly', '📝'),
        createHabit('career', '📚 HR/OD learning', 'weekly', '📖'),
      ];
    }
  } else if (role === 'finance-role') {
    if (roleTarget === 'controller') {
      tagline = 'Finance → Controller';
      goals = [
        createGoal(
          'career',
          '📊 Financial Leadership',
          'Establish financial controls and reporting excellence',
          [
            'Implement new financial reporting system and close process',
            'Build comprehensive financial model covering 3-year horizon',
            'Present quarterly financials and analysis to board',
            'Establish internal audit and SOX-like controls framework',
            'Optimize working capital and cash flow management',
          ],
          '12 months'
        ),
        createGoal(
          'career',
          '🤝 Strategic Partnership',
          'Partner with operations and leadership on financial strategy',
          [
            'Partner with ops on budgeting and forecasting process',
            'Build investor relations materials and present to stakeholders',
            'Create risk framework and mitigation strategy',
            'Automate financial reporting and dashboarding',
            'Establish cost optimization program with measurable savings',
          ],
          '12 months'
        ),
      ];
      habits = [
        createHabit('career', '📊 Review financials', 'daily', '💰'),
        createHabit('career', '📈 Forecast update', 'weekly', '📉'),
        createHabit('career', '📋 Regulation monitoring', 'weekly', '⚖️'),
        createHabit('career', '🔍 Internal control review', 'weekly', '🔒'),
      ];
    } else {
      tagline = `Finance → ${roleTarget === 'senior-analyst' ? 'Senior Analyst' : 'Finance Manager'}`;
      goals = [
        createGoal(
          'career',
          '💰 Financial Analysis',
          'Deliver high-quality financial analysis and insights',
          [
            'Build 3+ financial models supporting business decisions',
            'Deliver monthly close and reporting on time with zero errors',
            'Conduct financial analysis of 2+ strategic initiatives',
            'Identify and implement 2+ process improvements',
            'Present financial insights to leadership',
          ],
          '9 months'
        ),
      ];
      habits = [
        createHabit('career', '💻 Excel/SQL practice', 'daily', '📊'),
        createHabit('career', '📋 Account review', 'weekly', '🔍'),
        createHabit('career', '📚 Learn financial concepts', 'weekly', '📖'),
      ];
    }
  } else if (role === 'sales') {
    if (roleTarget === 'sales-director') {
      tagline = 'Sales → Director';
      goals = [
        createGoal(
          'career',
          '📈 Revenue Growth',
          'Drive accelerated revenue growth and market expansion',
          [
            'Exceed quota for 2+ consecutive quarters',
            'Build enterprise deal playbook with 80%+ win rate',
            'Establish partner channel generating 20%+ revenue',
            'Present quarterly sales results and strategy to board',
            'Acquire marquee account with strategic value',
          ],
          '12 months'
        ),
        createGoal(
          'career',
          '👥 Team Performance',
          'Build and scale high-performing sales team',
          [
            'Hire and onboard 3+ productive sales reps',
            'Establish sales methodology and coaching framework',
            'Build sales forecast model with 85%+ accuracy',
            'Create sales training program and conduct quarterly training',
            'Establish team culture and sales operations',
          ],
          '12 months'
        ),
      ];
      habits = [
        createHabit('career', '📞 Pipeline review', 'daily', '📱'),
        createHabit('career', '🎯 Prospect outreach', 'daily', '📧'),
        createHabit('career', '🤝 Deal coaching', 'weekly', '👥'),
        createHabit('career', '📊 Metrics review', 'weekly', '📈'),
      ];
    } else {
      tagline = `Sales → ${roleTarget === 'senior-ae' ? 'Senior AE' : 'Sales Manager'}`;
      goals = [
        createGoal(
          'career',
          '🎯 Revenue Performance',
          'Consistently exceed quota and land major deals',
          [
            'Exceed quota for 2+ quarters',
            'Develop and close 3+ enterprise deals',
            'Build repeat business with 5+ accounts',
            'Win marquee customer or strategic account',
            'Mentor junior rep through 2+ deals',
          ],
          '9 months'
        ),
      ];
      habits = [
        createHabit('career', '📞 Prospect calls', 'daily', '☎️'),
        createHabit('career', '📊 Pipeline management', 'daily', '📈'),
        createHabit('career', '🎯 Deal pursuit', 'daily', '🎪'),
      ];
    }
  } else if (role === 'marketing') {
    if (roleTarget === 'marketing-director') {
      tagline = 'Marketing → Director';
      goals = [
        createGoal(
          'career',
          '📢 Growth Leadership',
          'Drive marketing-led growth and brand establishment',
          [
            'Launch major campaign reaching 100K+ audience',
            'Build marketing dashboard with KPIs tracked weekly',
            'Establish brand guidelines and visual identity',
            'Grow qualified pipeline by 50%+',
            'Present quarterly marketing results to executive team',
          ],
          '12 months'
        ),
        createGoal(
          'career',
          '👥 Team Building',
          'Build and scale marketing team and partnerships',
          [
            'Hire and onboard 2+ marketing specialists',
            'Establish content calendar and editorial process',
            'Build 2+ agency partnerships and manage productively',
            'Run marketing offsite and establish team culture',
            'Mentor 1+ junior marketer toward growth',
          ],
          '12 months'
        ),
      ];
      habits = [
        createHabit('career', '📊 Campaign metrics', 'daily', '📈'),
        createHabit('career', '📝 Content review', 'daily', '✍️'),
        createHabit('career', '🔍 Competitor analysis', 'weekly', '🔎'),
        createHabit('career', '👥 Marketing sync', 'weekly', '👤'),
      ];
    } else {
      tagline = `Marketing → ${roleTarget === 'senior-marketing' ? 'Senior Marketing' : 'VP Marketing'}`;
      goals = [
        createGoal(
          'career',
          '📢 Campaign Excellence',
          'Execute high-impact marketing campaigns',
          [
            'Execute 3+ campaigns with measurable ROI',
            'Build 2+ marketing programs generating qualified leads',
            'Grow audience or follower base by 50%+',
            'Develop thought leadership content',
            'Partner with sales and product on launch strategy',
          ],
          '9 months'
        ),
      ];
      habits = [
        createHabit('career', '📊 Metrics review', 'daily', '📉'),
        createHabit('career', '✍️ Content creation', 'daily', '📝'),
        createHabit('career', '🔍 Market research', 'weekly', '🔎'),
      ];
    }
  } else if (role === 'devops') {
    if (roleTarget === 'platform-lead') {
      tagline = 'DevOps/SRE → Platform Lead';
      goals = [
        createGoal(
          'career',
          '🏗️ Platform Excellence',
          'Build world-class platform and infrastructure',
          [
            'Achieve 99.99% uptime for critical systems',
            'Build modern CI/CD pipeline reducing deploy time 50%+',
            'Implement comprehensive observability and monitoring',
            'Create disaster recovery and business continuity plan',
            'Establish SLO framework and error budget management',
          ],
          '12 months'
        ),
        createGoal(
          'career',
          '🌐 Engineering Culture',
          'Enable teams through self-service and standards',
          [
            'Reduce production incident MTTR by 50%',
            'Establish on-call rotation with clear runbooks',
            'Build self-service platform for team deployments',
            'Document architecture decisions and share learnings',
            'Mentor 2+ junior SREs or platform engineers',
          ],
          '12 months'
        ),
      ];
      habits = [
        createHabit('career', '📊 Monitor dashboards', 'daily', '📉'),
        createHabit('career', '🔍 Incident review', 'weekly', '🔎'),
        createHabit('career', '💰 Infrastructure cost review', 'weekly', '💸'),
        createHabit('career', '⚙️ Runbook updates', 'weekly', '📋'),
      ];
    } else {
      tagline = `DevOps/SRE → ${roleTarget === 'senior-sre' ? 'Senior SRE' : 'Staff SRE'}`;
      goals = [
        createGoal(
          'career',
          '🏗️ System Reliability',
          'Establish high reliability and reduce incident impact',
          [
            'Achieve 99.9%+ uptime for services',
            'Reduce production incident MTTR by 40%',
            'Implement monitoring and alerting for critical paths',
            'Build runbooks for top incidents',
            'Establish error budget and SLO tracking',
          ],
          '9 months'
        ),
      ];
      habits = [
        createHabit('career', '📊 Dashboard review', 'daily', '📈'),
        createHabit('career', '📝 Incident analysis', 'weekly', '🔍'),
        createHabit('career', '⚙️ Infrastructure work', 'daily', '🛠️'),
      ];
    }
  } else if (role === 'skills') {
    tagline = 'Career → Skills Development';
    goals = [
      createGoal(
        'career',
        '🎯 Skill Mastery',
        'Develop deep expertise in critical skills',
        [
          'Define 2-year skill development roadmap',
          'Complete 2+ professional certifications or courses',
          'Build portfolio project showcasing new skills',
          'Share learning through presentation or writing',
          'Achieve proficiency level in 2+ new technical skills',
        ],
        '12 months'
      ),
    ];
    habits = [
      createHabit('career', '💻 Practice new skill', 'daily', '⌨️'),
      createHabit('career', '📰 Read industry news', 'weekly', '📰'),
      createHabit('career', '🎓 Online course lesson', 'daily', '🎓'),
      createHabit('career', '🧪 Build side project', 'weekly', '🛠️'),
    ];
  } else {
    // Default/Other role
    tagline = 'Career Growth Journey';
    goals = [
      createGoal(
        'career',
        '🚀 Professional Growth',
        'Establish clear career vision and development path',
        [
          'Define personal career vision and goals',
          'Identify key skill gaps and development areas',
          'Find mentor or sponsor for career guidance',
          'Complete professional development plan',
          'Achieve first major milestone toward career goal',
        ],
        '9 months'
      ),
      createGoal(
        'career',
        '🌐 Visibility & Impact',
        'Build reputation and influence in your field',
        [
          'Present work or ideas to leadership',
          'Build cross-functional working relationships',
          'Lead visible initiative or project',
          'Document and share major achievements',
          'Network with 5+ peers in your field',
        ],
        '9 months'
      ),
    ];
    habits = [
      createHabit('career', '💼 Skill development time', 'daily', '📚'),
      createHabit('career', '🤝 Network outreach', 'weekly', '👥'),
      createHabit('career', '📝 Reflective journaling', 'weekly', '📔'),
      createHabit('career', '👥 Mentor check-in', 'weekly', '👤'),
    ];
  }

  const pillarId = 'career';
  return createPillar(
    pillarId,
    pillarDef.name,
    pillarDef.category,
    pillarDef.color,
    pillarDef.gradient,
    pillarDef.iconName,
    goals,
    habits,
    tagline
  );
}

// ============================================================================
// EDUCATION PILLAR GENERATOR
// ============================================================================

function generateEducationPillar(educationType?: string): GeneratedPillar {
  const pillarDef = PILLAR_DEFS.find((p) => p.id === 'education' || p.id === 'academics')!;
  let goals: Goal[] = [];
  let habits: Habit[] = [];
  let tagline = '';

  if (educationType === 'pmp') {
    tagline = 'Project Management (PMP) Certification';
    goals = [
      createGoal(
        'education',
        '📚 Course Completion',
        'Complete PMP exam preparation course',
        [
          'Finish all course modules and review materials',
          'Complete 4+ hours of contact hours per week',
          'Review PMBOK Guide chapters with note-taking',
          'Take 2+ practice exams with 80%+ scores',
          'Complete final exam prep and review',
        ],
        '6 months'
      ),
      createGoal(
        'education',
        '🎓 Exam Readiness',
        'Prepare thoroughly for PMP exam',
        [
          'Score 75%+ on all practice exams',
          'Review weak topic areas with focused study',
          'Memorize formulas and key concepts',
          'Take final practice exam 1 week before real exam',
          'Pass PMP exam on first attempt',
        ],
        '6 months'
      ),
    ];
    habits = [
      createHabit('education', '📖 Study PMP material', 'daily', '📚'),
      createHabit('education', '✏️ Review notes and flashcards', 'daily', '📝'),
      createHabit('education', '🧪 Practice exam questions', 'daily', '❓'),
      createHabit('education', '👥 Study group session', 'weekly', '👥'),
    ];
  } else if (educationType === 'mba') {
    tagline = 'MBA Program';
    goals = [
      createGoal(
        'education',
        '📚 Academic Excellence',
        'Build strong GPA and master core business concepts',
        [
          'Maintain 3.5+ GPA throughout program',
          'Excel in quantitative courses (Finance, Analytics)',
          'Complete major projects with strong grades',
          'Read and absorb core business books and cases',
          'Build relationships with professors and TAs',
        ],
        '24 months'
      ),
      createGoal(
        'education',
        '🤝 Networking & Competitions',
        'Build professional network and test business acumen',
        [
          'Join 2+ student clubs or professional societies',
          'Participate in 2+ case competitions',
          'Build strong cohort relationships and study groups',
          'Attend 10+ networking and career events',
          'Secure 1-2 internships with strong companies',
        ],
        '24 months'
      ),
    ];
    habits = [
      createHabit('education', '📖 Read case studies', 'daily', '📄'),
      createHabit('education', '📊 Analysis and problem sets', 'daily', '🧮'),
      createHabit('education', '👥 Networking event', 'weekly', '🤝'),
      createHabit('education', '💼 Job search and applications', 'weekly', '💻'),
    ];
  } else if (educationType === 'ms-cs') {
    tagline = 'Master\'s in Computer Science';
    goals = [
      createGoal(
        'education',
        '📚 Core Coursework',
        'Complete challenging CS coursework with strong grades',
        [
          'Maintain 3.5+ GPA in all CS courses',
          'Master algorithms, systems, and distributed computing',
          'Complete 3+ coding-intensive projects',
          'Understand research methodologies and paper reading',
          'Build strong foundation in specialization area',
        ],
        '24 months'
      ),
      createGoal(
        'education',
        '🔬 Research & Thesis',
        'Contribute to research and publish findings',
        [
          'Identify interesting research problem in field',
          'Work with advisor to design and conduct research',
          'Implement prototype or system with novel contribution',
          'Write thesis or paper with strong results',
          'Present research to department and external audiences',
        ],
        '24 months'
      ),
    ];
    habits = [
      createHabit('education', '💻 Coding practice', 'daily', '⌨️'),
      createHabit('education', '📖 Read research papers', 'daily', '📰'),
      createHabit('education', '🧪 Lab work or experimentation', 'daily', '🔬'),
      createHabit('education', '👥 Research group meeting', 'weekly', '👨‍🔬'),
    ];
  } else if (educationType === 'certification') {
    tagline = 'Professional Certification';
    goals = [
      createGoal(
        'education',
        '📋 Study Plan',
        'Create and execute comprehensive study schedule',
        [
          'Define certification scope and learning objectives',
          'Break down study material into weekly topics',
          'Gather study resources and materials',
          'Create flashcards or study guides for key topics',
          'Schedule study time consistently each week',
        ],
        '6 months'
      ),
      createGoal(
        'education',
        '✅ Exam Preparation',
        'Prepare thoroughly for certification exam',
        [
          'Complete all study material review',
          'Take 3+ practice exams with 85%+ scores',
          'Review weak areas with focused study',
          'Take final practice exam right before real exam',
          'Pass certification exam on first or second attempt',
        ],
        '6 months'
      ),
    ];
    habits = [
      createHabit('education', '📖 Study session', 'daily', '📚'),
      createHabit('education', '📇 Flashcard review', 'daily', '🃏'),
      createHabit('education', '❓ Practice questions', 'daily', '❓'),
      createHabit('education', '👥 Study partner check-in', 'weekly', '👤'),
    ];
  } else if (educationType === 'bootcamp') {
    tagline = 'Bootcamp / Course Program';
    goals = [
      createGoal(
        'education',
        '💻 Projects & Portfolio',
        'Build strong portfolio through bootcamp projects',
        [
          'Complete all bootcamp curriculum modules',
          'Build 3+ portfolio projects with strong features',
          'Implement best practices and clean code',
          'Get code reviews from instructors and peers',
          'Publish projects on GitHub with documentation',
        ],
        '6 months'
      ),
      createGoal(
        'education',
        '🤝 Networking & Career',
        'Leverage bootcamp for job search and connections',
        [
          'Build relationships with 10+ classmates and alumni',
          'Attend career workshops and practice interviews',
          'Connect with 5+ mentors or industry professionals',
          'Apply to 20+ jobs with tailored applications',
          'Secure job offer from bootcamp search',
        ],
        '6 months'
      ),
    ];
    habits = [
      createHabit('education', '💻 Daily coding challenges', 'daily', '⌨️'),
      createHabit('education', '📁 Project work', 'daily', '🛠️'),
      createHabit('education', '👥 Pair programming', 'daily', '👤'),
      createHabit('education', '🤝 Networking or job search', 'weekly', '💼'),
    ];
  } else if (educationType === 'self-learning') {
    tagline = 'Self-Directed Learning';
    goals = [
      createGoal(
        'education',
        '🗺️ Skill Roadmap',
        'Define clear learning path and goals',
        [
          'Define specific skills to learn and timeline',
          'Research learning resources and choose best ones',
          'Create 12-month learning roadmap',
          'Set measurable milestones and checkpoints',
          'Share learning goals with accountability partner',
        ],
        '12 months'
      ),
      createGoal(
        'education',
        '🚀 Projects & Sharing',
        'Apply learning through projects and teaching others',
        [
          'Build 3+ projects applying new skills',
          'Publish 10+ articles or tutorials on learning',
          'Create portfolio website showcasing work',
          'Speak at 2+ meetups or conferences',
          'Mentor 1-2 people in learning journey',
        ],
        '12 months'
      ),
    ];
    habits = [
      createHabit('education', '🧠 Learn new concept', 'daily', '💡'),
      createHabit('education', '🛠️ Build something', 'daily', '⚒️'),
      createHabit('education', '✍️ Write about learning', 'weekly', '📝'),
      createHabit('education', '👥 Share knowledge', 'weekly', '🎓'),
    ];
  } else if (educationType === 'phd') {
    tagline = 'PhD Program';
    goals = [
      createGoal(
        'education',
        '📚 Coursework & Comprehensive Exams',
        'Complete rigorous PhD coursework and exams',
        [
          'Maintain strong grades in all courses',
          'Master advanced concepts in specialization',
          'Read and understand 50+ research papers',
          'Pass comprehensive exam demonstrating mastery',
          'Identify dissertation research direction',
        ],
        '24 months'
      ),
      createGoal(
        'education',
        '🔬 Research & Publications',
        'Conduct novel research and publish results',
        [
          'Design and conduct significant research',
          'Publish 2+ papers in top-tier venues',
          'Present research at 2+ major conferences',
          'Build strong relationships with research community',
          'Complete and defend dissertation',
        ],
        '36 months'
      ),
    ];
    habits = [
      createHabit('education', '✍️ Write and research', 'daily', '📝'),
      createHabit('education', '🔬 Lab work or analysis', 'daily', '🧪'),
      createHabit('education', '📖 Literature review', 'daily', '📚'),
      createHabit('education', '👥 Research group meeting', 'weekly', '👨‍🔬'),
    ];
  } else {
    // Generic education or none
    tagline = 'Learning & Development';
    goals = [
      createGoal(
        'education',
        '📚 Knowledge Building',
        'Expand knowledge and capabilities',
        [
          'Identify areas to learn and grow',
          'Choose resources and set learning timeline',
          'Dedicate consistent time to learning',
          'Apply learning in real projects',
          'Document progress and achievements',
        ],
        '12 months'
      ),
    ];
    habits = [
      createHabit('education', '📖 Read or study', 'daily', '📚'),
      createHabit('education', '💻 Practice skill', 'daily', '⌨️'),
      createHabit('education', '👥 Discuss learning', 'weekly', '👤'),
    ];
  }

  const pillarId = 'education';
  return createPillar(
    pillarId,
    pillarDef.name,
    pillarDef.category,
    pillarDef.color,
    pillarDef.gradient,
    pillarDef.iconName,
    goals,
    habits,
    tagline
  );
}

// ============================================================================
// FAMILY PILLAR GENERATOR
// ============================================================================

function generateFamilyPillar(familyType?: string): GeneratedPillar {
  const pillarDef = PILLAR_DEFS.find((p) => p.id === 'family')!;
  let goals: Goal[] = [];
  let habits: Habit[] = [];
  let tagline = '';

  if (familyType === 'new-parent') {
    tagline = 'New Parent - Bonding & Growth';
    goals = [
      createGoal(
        'family',
        '👶 Bonding & Attachment',
        'Build strong parent-child bond and secure attachment',
        [
          'Establish consistent daily 1:1 bonding time',
          'Learn and respond to baby\'s cues and needs',
          'Create calming bedtime and wake-up routines',
          'Take photos/videos capturing developmental milestones',
          'Journal observations of baby\'s growth and personality',
        ],
        '12 months'
      ),
      createGoal(
        'family',
        '💑 Partnership Strengthening',
        'Maintain and strengthen partner relationship during parenting',
        [
          'Establish weekly partner check-in time',
          'Create balanced responsibility and decision-making',
          'Plan 2+ date nights or partner time per month',
          'Communicate openly about stresses and needs',
          'Support each other through parenting challenges',
        ],
        '12 months'
      ),
    ];
    habits = [
      createHabit('family', '👶 Baby bonding time', 'daily', '👶'),
      createHabit('family', '📸 Capture moments', 'daily', '📷'),
      createHabit('family', '💑 Partner check-in', 'weekly', '❤️'),
      createHabit('family', '📝 Parenting reflection', 'weekly', '📔'),
    ];
  } else if (familyType === 'parent-young') {
    tagline = 'Parent (Young Kids) - Education & Engagement';
    goals = [
      createGoal(
        'family',
        '📚 Learning & Development',
        'Support children\'s learning and cognitive development',
        [
          'Establish daily reading routine with each child',
          'Plan and execute educational activities monthly',
          'Support school involvement and communication',
          'Develop children\'s curiosity about world',
          'Build family learning library or educational time',
        ],
        '12 months'
      ),
      createGoal(
        'family',
        '🎯 Engagement & Quality Time',
        'Create strong family bonds through shared activities',
        [
          'Plan 2+ family outings or activities per month',
          'Establish consistent family dinner time',
          'Play games or engage in hobbies together weekly',
          'Create family traditions and rituals',
          'Document family memories and growth',
        ],
        '12 months'
      ),
    ];
    habits = [
      createHabit('family', '📖 Reading time with kids', 'daily', '📚'),
      createHabit('family', '🎮 Activity or game time', 'daily', '🎲'),
      createHabit('family', '👨‍👩‍👧 Family meal time', 'daily', '🍽️'),
      createHabit('family', '🎉 Plan family activity', 'weekly', '🎪'),
    ];
  } else if (familyType === 'parent-teen') {
    tagline = 'Parent (Teenagers) - Connection & Guidance';
    goals = [
      createGoal(
        'family',
        '💬 Connection & Communication',
        'Maintain strong relationship and open communication with teens',
        [
          'Establish regular 1:1 check-in time with each teen',
          'Create safe space for teens to share concerns',
          'Attend 2+ teen activities or events per month',
          'Show interest in teens\' friends and activities',
          'Build trust through consistent presence and listening',
        ],
        '12 months'
      ),
      createGoal(
        'family',
        '🎓 Guidance & Support',
        'Support teens\' growth, decisions, and future planning',
        [
          'Help teens explore interests and possible careers',
          'Support academic goals and school involvement',
          'Discuss values, decisions, and life choices',
          'Provide safe boundaries while encouraging independence',
          'Celebrate teen achievements and growth',
        ],
        '12 months'
      ),
    ];
    habits = [
      createHabit('family', '💬 Teen check-in conversation', 'weekly', '👂'),
      createHabit('family', '🍽️ Family dinner time', 'weekly', '🍴'),
      createHabit('family', '🚗 Drive/activity together', 'weekly', '🚗'),
      createHabit('family', '📝 Reflect on family dynamics', 'weekly', '📔'),
    ];
  } else if (familyType === 'partner') {
    tagline = 'With Partner - Relationship Growth';
    goals = [
      createGoal(
        'family',
        '💕 Relationship Wellness',
        'Nurture and strengthen partnership',
        [
          'Establish weekly date night or quality time',
          'Practice open and vulnerable communication',
          'Express appreciation and gratitude regularly',
          'Work through conflicts collaboratively',
          'Invest in shared interests and activities',
        ],
        '12 months'
      ),
      createGoal(
        'family',
        '🎯 Shared Goals & Vision',
        'Build aligned future and shared aspirations',
        [
          'Define joint 5-year goals and vision',
          'Plan major life decisions together (home, travel, etc)',
          'Support each other\'s individual growth',
          'Create shared rituals and traditions',
          'Build financial partnership and planning',
        ],
        '12 months'
      ),
    ];
    habits = [
      createHabit('family', '💑 Quality time together', 'daily', '❤️'),
      createHabit('family', '💬 Deep conversation', 'weekly', '👂'),
      createHabit('family', '🎉 Date night', 'weekly', '🎭'),
      createHabit('family', '👏 Express appreciation', 'daily', '🙏'),
    ];
  } else if (familyType === 'single') {
    tagline = 'Single - Community & Growth';
    goals = [
      createGoal(
        'family',
        '👥 Social Connections',
        'Build and maintain meaningful friendships',
        [
          'Establish regular time with close friends',
          'Join 1-2 communities or groups aligned with interests',
          'Initiate 2+ social gatherings or activities per month',
          'Build deeper relationships through meaningful time',
          'Support friends through challenges',
        ],
        '12 months'
      ),
      createGoal(
        'family',
        '🌱 Personal Development',
        'Invest in self-growth and personal fulfillment',
        [
          'Pursue hobby or passion project',
          'Take course or learn new skill',
          'Travel or explore new experiences',
          'Volunteer or contribute to community',
          'Build strong sense of purpose and joy',
        ],
        '12 months'
      ),
    ];
    habits = [
      createHabit('family', '👥 Friend check-in', 'weekly', '💬'),
      createHabit('family', '🎯 Hobby time', 'weekly', '🎨'),
      createHabit('family', '🎉 Social activity', 'weekly', '🎪'),
      createHabit('family', '🧘 Self-care time', 'daily', '🌟'),
    ];
  } else if (familyType === 'caregiver') {
    tagline = 'Family Caregiver - Balance & Support';
    goals = [
      createGoal(
        'family',
        '💙 Care Coordination',
        'Provide excellent, organized care for family member',
        [
          'Establish clear care routine and schedule',
          'Coordinate with medical and support providers',
          'Stay informed about health and needs',
          'Document care activities and progress',
          'Build support network of helpers',
        ],
        '12 months'
      ),
      createGoal(
        'family',
        '⚖️ Self-Care & Balance',
        'Maintain own health and wellbeing while caregiving',
        [
          'Schedule regular respite time for yourself',
          'Maintain own exercise and wellness routine',
          'Stay connected with friends and interests',
          'Access support groups or counseling',
          'Set healthy boundaries and ask for help',
        ],
        '12 months'
      ),
    ];
    habits = [
      createHabit('family', '💙 Care routine', 'daily', '❤️'),
      createHabit('family', '🤝 Check medical needs', 'weekly', '🏥'),
      createHabit('family', '🧘 Self-care time', 'daily', '🌟'),
      createHabit('family', '👥 Reach out for support', 'weekly', '📞'),
    ];
  } else {
    // Generic family
    tagline = 'Family & Relationships';
    goals = [
      createGoal(
        'family',
        '❤️ Relationship Quality',
        'Build strong, healthy family relationships',
        [
          'Spend quality time with family regularly',
          'Communicate openly and listen actively',
          'Show appreciation and support',
          'Create positive family experiences',
          'Build family traditions and connections',
        ],
        '12 months'
      ),
    ];
    habits = [
      createHabit('family', '👥 Family time', 'daily', '❤️'),
      createHabit('family', '💬 Check-in conversation', 'weekly', '👂'),
      createHabit('family', '🎉 Activity together', 'weekly', '🎪'),
    ];
  }

  const pillarId = 'family';
  return createPillar(
    pillarId,
    pillarDef.name,
    pillarDef.category,
    pillarDef.color,
    pillarDef.gradient,
    pillarDef.iconName,
    goals,
    habits,
    tagline
  );
}

// ============================================================================
// HEALTH PILLAR GENERATOR
// ============================================================================

function generateHealthPillar(healthFocuses?: string[]): GeneratedPillar {
  const pillarDef = PILLAR_DEFS.find((p) => p.id === 'health' || p.id === 'wellness')!;
  let goals: Goal[] = [];
  let habits: Habit[] = [];
  let tagline = '';

  // Build comprehensive goals based on health focuses
  const hasFitness = healthFocuses?.includes('fitness');
  const hasWeight = healthFocuses?.includes('weight');
  const hasMental = healthFocuses?.includes('mental');
  const hasSleep = healthFocuses?.includes('sleep');
  const hasNutrition = healthFocuses?.includes('nutrition');
  const hasRunning = healthFocuses?.includes('running');

  // Generate tagline
  if (!healthFocuses || healthFocuses.length === 0) {
    tagline = 'Overall Health & Wellbeing';
  } else {
    tagline = healthFocuses.map((f) => {
      const opt = HEALTH_FOCUS_OPTIONS.find((o) => o.id === f);
      return opt?.label || f;
    }).join(', ');
  }

  // Fitness Goals
  if (hasFitness) {
    goals.push(
      createGoal(
        'health',
        '💪 Strength & Consistency',
        'Build consistent exercise habit and increase strength',
        [
          'Exercise 4+ times per week consistently for 12 weeks',
          'Complete progressive strength training program',
          'Increase key lifts by 20%+ (squat, bench, deadlift)',
          'Build muscular endurance through circuit training',
          'Establish gym routine and form good habits',
        ],
        '12 months'
      )
    );
  }

  // Weight Management Goals
  if (hasWeight) {
    goals.push(
      createGoal(
        'health',
        '⚖️ Weight & Body Composition',
        'Achieve healthy weight through sustainable habits',
        [
          'Track weight weekly and identify trends',
          'Lose/gain target weight at 1-2 lbs per week pace',
          'Build sustainable eating and exercise habits',
          'Improve body composition (muscle vs fat)',
          'Establish long-term maintenance plan',
        ],
        '12 months'
      )
    );
  }

  // Mental Wellness Goals
  if (hasMental) {
    goals.push(
      createGoal(
        'health',
        '🧠 Mental Wellness',
        'Improve mental health and emotional resilience',
        [
          'Establish daily meditation or mindfulness practice',
          'Maintain 30+ day meditation streak',
          'Process emotions through journaling or therapy',
          'Build stress management tools and techniques',
          'Improve sleep quality and emotional regulation',
        ],
        '12 months'
      )
    );
  }

  // Sleep Goals
  if (hasSleep) {
    goals.push(
      createGoal(
        'health',
        '😴 Sleep Quality & Recovery',
        'Optimize sleep and establish healthy sleep hygiene',
        [
          'Achieve 7-9 hours of sleep per night',
          'Establish consistent sleep and wake times',
          'Create bedtime wind-down routine',
          'Track sleep quality and identify patterns',
          'Improve sleep efficiency above 85%',
        ],
        '12 months'
      )
    );
  }

  // Nutrition Goals
  if (hasNutrition) {
    goals.push(
      createGoal(
        'health',
        '🥗 Nutrition & Hydration',
        'Build healthy eating habits and proper nutrition',
        [
          'Plan and prep healthy meals for 80% of week',
          'Increase vegetable and whole grain intake',
          'Drink 8+ glasses water daily consistently',
          'Track macros and understand nutritional needs',
          'Build sustainable healthy eating patterns',
        ],
        '12 months'
      )
    );
  }

  // Running Goals
  if (hasRunning) {
    goals.push(
      createGoal(
        'health',
        '🏃 Running & Cardio',
        'Build running fitness and achieve running goals',
        [
          'Run 3+ times per week consistently',
          'Improve 5K time by 2+ minutes',
          'Build up to 10K distance or longer',
          'Complete 1+ running event or race',
          'Establish injury prevention and recovery routine',
        ],
        '12 months'
      )
    );
  }

  // If no specific focus, create general health goals
  if (goals.length === 0) {
    goals = [
      createGoal(
        'health',
        '🏃 Physical Health',
        'Build exercise habit and improve physical fitness',
        [
          'Exercise 3+ times per week',
          'Complete beginner fitness program',
          'Improve energy levels and fitness baseline',
          'Establish enjoyable movement routine',
          'Build strength and cardiovascular health',
        ],
        '12 months'
      ),
      createGoal(
        'health',
        '🧠 Mental Wellness',
        'Support mental health and stress management',
        [
          'Establish daily relaxation or mindfulness time',
          'Journal or process emotions regularly',
          'Build strong sleep and rest routine',
          'Manage stress through healthy coping',
          'Seek support when needed',
        ],
        '12 months'
      ),
    ];
  }

  // Build habits based on focuses
  if (hasFitness) {
    habits.push(createHabit('health', '💪 Exercise 30+ minutes', 'daily', '🏋️'));
  }
  if (hasWeight) {
    habits.push(createHabit('health', '⚖️ Log weight and meals', 'daily', '📊'));
  }
  if (hasMental) {
    habits.push(createHabit('health', '🧘 10-min mindfulness', 'daily', '🧘'));
  }
  if (hasSleep) {
    habits.push(createHabit('health', '😴 Track and optimize sleep', 'daily', '📊'));
  }
  if (hasNutrition) {
    habits.push(createHabit('health', '🥗 Eat balanced meal', 'daily', '🍽️'));
    habits.push(createHabit('health', '💧 Drink 8 glasses water', 'daily', '💧'));
  }
  if (hasRunning) {
    habits.push(createHabit('health', '🏃 Go for run', 'weekly', '👟'));
    habits.push(createHabit('health', '🧘 Stretch routine', 'daily', '🤸'));
  }

  // Generic habits if no specific focus
  if (habits.length === 0) {
    habits = [
      createHabit('health', '🏃 Move and exercise', 'daily', '💪'),
      createHabit('health', '🥗 Eat healthy meals', 'daily', '🍽️'),
      createHabit('health', '😴 Get quality sleep', 'daily', '😴'),
      createHabit('health', '🧘 Relaxation or mindfulness', 'daily', '🧘'),
    ];
  }

  const pillarId = 'health';
  return createPillar(
    pillarId,
    pillarDef.name,
    pillarDef.category,
    pillarDef.color,
    pillarDef.gradient,
    pillarDef.iconName,
    goals,
    habits,
    tagline
  );
}

// ============================================================================
// HOME PILLAR GENERATOR
// ============================================================================

function generateHomePillar(): GeneratedPillar {
  const pillarDef = PILLAR_DEFS.find((p) => p.id === 'home')!;
  const goals = [
    createGoal(
      'home',
      '✨ Organized & Calm Space',
      'Create clean, organized, comfortable home environment',
      [
        'Declutter and organize 3+ major areas of home',
        'Establish daily tidying routine (15-30 min)',
        'Create storage systems and organization',
        'Maintain clutter-free surfaces',
        'Create welcoming spaces for rest and gathering',
      ],
      '12 months'
    ),
    createGoal(
      'home',
      '💰 Financial & Wellness',
      'Establish healthy home maintenance and financial routines',
      [
        'Review and optimize monthly household budget',
        'Establish home maintenance schedule',
        'Build emergency fund or savings goal',
        'Create sustainable utilities and resources plan',
        'Plan 2+ home improvement or upgrade projects',
      ],
      '12 months'
    ),
  ];
  const habits = [
    createHabit('home', '🧹 Daily tidying', 'daily', '✨'),
    createHabit('home', '🍳 Meal prep and cooking', 'daily', '👨‍🍳'),
    createHabit('home', '📊 Budget or expense review', 'weekly', '💳'),
    createHabit('home', '🏠 Home maintenance check', 'weekly', '🔧'),
  ];
  return createPillar(
    'home',
    pillarDef.name,
    pillarDef.category,
    pillarDef.color,
    pillarDef.gradient,
    pillarDef.iconName,
    goals,
    habits,
    'Home & Environment'
  );
}

// ============================================================================
// SKILLS PILLAR GENERATOR (Career-Focus)
// ============================================================================

function generateSkillsPillar(): GeneratedPillar {
  const pillarDef = PILLAR_DEFS.find((p) => p.id === 'skills')!;
  const goals = [
    createGoal(
      'skills',
      '🎯 Skill Roadmap',
      'Identify and plan critical skills development',
      [
        'Define 5 critical skills for career',
        'Research learning resources for each skill',
        'Create 12-month skill development roadmap',
        'Complete 2+ professional certifications',
        'Track progress toward skill mastery',
      ],
      '12 months'
    ),
    createGoal(
      'skills',
      '💻 Practical Application',
      'Apply new skills through projects and real work',
      [
        'Build 2+ portfolio projects showcasing skills',
        'Apply new skills on work projects',
        'Create reusable tools or templates',
        'Share learning through documentation',
        'Mentor others in new skills',
      ],
      '12 months'
    ),
  ];
  const habits = [
    createHabit('skills', '💻 Practice new skill', 'daily', '⌨️'),
    createHabit('skills', '📰 Read industry news', 'weekly', '📰'),
    createHabit('skills', '🎓 Online course or tutorial', 'daily', '🎓'),
    createHabit('skills', '🛠️ Build or experiment', 'weekly', '🔧'),
  ];
  return createPillar(
    'skills',
    pillarDef.name,
    pillarDef.category,
    pillarDef.color,
    pillarDef.gradient,
    pillarDef.iconName,
    goals,
    habits,
    'Technical Skills Development'
  );
}

// ============================================================================
// NETWORKING PILLAR GENERATOR (Career-Focus)
// ============================================================================

function generateNetworkingPillar(): GeneratedPillar {
  const pillarDef = PILLAR_DEFS.find((p) => p.id === 'networking')!;
  const goals = [
    createGoal(
      'networking',
      '🤝 Relationship Building',
      'Build authentic professional relationships',
      [
        'Connect with 20+ professionals in your field',
        'Have meaningful 1:1 conversations with 10+ people',
        'Build deeper relationships with 3+ mentors',
        'Maintain contact with 5+ professional connections',
        'Help others and give generously of your network',
      ],
      '12 months'
    ),
    createGoal(
      'networking',
      '🎤 Community Engagement',
      'Increase visibility and impact in communities',
      [
        'Attend 12+ networking or industry events',
        'Speak at 1+ conference or meetup',
        'Join 1-2 professional communities or groups',
        'Contribute to open source or community projects',
        'Build reputation as helpful resource',
      ],
      '12 months'
    ),
  ];
  const habits = [
    createHabit('networking', '📧 Reach out to contact', 'weekly', '📧'),
    createHabit('networking', '🎤 Attend event or meetup', 'weekly', '🎪'),
    createHabit('networking', '💬 Have coffee chat', 'weekly', '☕'),
    createHabit('networking', '🤝 Help someone', 'weekly', '🙌'),
  ];
  return createPillar(
    'networking',
    pillarDef.name,
    pillarDef.category,
    pillarDef.color,
    pillarDef.gradient,
    pillarDef.iconName,
    goals,
    habits,
    'Professional Networking'
  );
}

// ============================================================================
// FINANCE PILLAR GENERATOR (Career-Focus)
// ============================================================================

function generateFinancePillar(): GeneratedPillar {
  const pillarDef = PILLAR_DEFS.find((p) => p.id === 'finance')!;
  const goals = [
    createGoal(
      'finance',
      '💰 Savings & Investing',
      'Build wealth through consistent saving and investing',
      [
        'Define financial goals (savings, investments, net worth)',
        'Build emergency fund to 6 months expenses',
        'Increase retirement savings rate to 15%+',
        'Diversify investments across asset classes',
        'Reach specific net worth milestone',
      ],
      '12 months'
    ),
    createGoal(
      'finance',
      '💳 Financial Literacy',
      'Understand and optimize personal finances',
      [
        'Review and optimize monthly budget',
        'Reduce expenses by 10%+ or identify savings',
        'Understand investment and tax strategies',
        'Review insurance coverage and protection',
        'Create long-term financial plan',
      ],
      '12 months'
    ),
  ];
  const habits = [
    createHabit('finance', '💳 Track spending', 'daily', '📊'),
    createHabit('finance', '📈 Review investments', 'weekly', '📉'),
    createHabit('finance', '💰 Financial reading', 'weekly', '📚'),
    createHabit('finance', '💵 Review budget', 'weekly', '💰'),
  ];
  return createPillar(
    'finance',
    pillarDef.name,
    pillarDef.category,
    pillarDef.color,
    pillarDef.gradient,
    pillarDef.iconName,
    goals,
    habits,
    'Financial Health & Growth'
  );
}

// ============================================================================
// STUDENT TEMPLATE PILLAR GENERATORS
// ============================================================================

function generateAcademicsPillar(): GeneratedPillar {
  const pillarDef = PILLAR_DEFS.find((p) => p.id === 'academics')!;
  const goals = [
    createGoal(
      'academics',
      '📚 Academic Excellence',
      'Maintain strong grades and master course material',
      [
        'Maintain 3.5+ GPA or target grade',
        'Complete coursework with full understanding',
        'Attend all classes and actively participate',
        'Excel in challenging courses',
        'Build strong relationships with professors',
      ],
      '12 months'
    ),
    createGoal(
      'academics',
      '🎓 Learning Mastery',
      'Develop effective study habits and deep learning',
      [
        'Complete all assignments with excellence',
        'Prepare effectively for exams and assessments',
        'Engage in active learning and participation',
        'Build note-taking and study systems',
        'Seek help and resources when struggling',
      ],
      '12 months'
    ),
  ];
  const habits = [
    createHabit('academics', '📖 Attend classes', 'daily', '📚'),
    createHabit('academics', '✏️ Study and homework', 'daily', '🖊️'),
    createHabit('academics', '👥 Study group', 'weekly', '👥'),
    createHabit('academics', '🤓 Review notes', 'daily', '📝'),
  ];
  return createPillar(
    'academics',
    pillarDef.name,
    pillarDef.category,
    pillarDef.color,
    pillarDef.gradient,
    pillarDef.iconName,
    goals,
    habits,
    'Academic Excellence'
  );
}

function generateCareerPrepPillar(): GeneratedPillar {
  const pillarDef = PILLAR_DEFS.find((p) => p.id === 'career-prep')!;
  const goals = [
    createGoal(
      'career-prep',
      '💼 Resume & Portfolio',
      'Build strong resume and portfolio for job search',
      [
        'Create polished, targeted resume',
        'Build portfolio website or GitHub profile',
        'Collect 3+ portfolio projects or pieces',
        'Get resume reviewed by mentor or career coach',
        'Tailor materials for target roles',
      ],
      '12 months'
    ),
    createGoal(
      'career-prep',
      '🎯 Interview Readiness',
      'Prepare thoroughly for technical and behavioral interviews',
      [
        'Practice 50+ coding problems (LeetCode, HackerRank)',
        'Complete 5+ mock interviews with feedback',
        'Prepare answers to common behavioral questions',
        'Research target companies thoroughly',
        'Build confidence through practice and preparation',
      ],
      '12 months'
    ),
    createGoal(
      'career-prep',
      '🤝 Networking & Outreach',
      'Build relationships and pursue job opportunities',
      [
        'Apply to 20+ target companies or roles',
        'Network with 10+ professionals in target field',
        'Attend 5+ career fairs or networking events',
        'Get referrals from connections',
        'Build relationships with recruiters',
      ],
      '12 months'
    ),
  ];
  const habits = [
    createHabit('career-prep', '💻 Coding practice (LeetCode)', 'daily', '⌨️'),
    createHabit('career-prep', '📝 Job applications', 'weekly', '📝'),
    createHabit('career-prep', '🤝 Networking', 'weekly', '👥'),
    createHabit('career-prep', '📖 Mock interview prep', 'weekly', '🎤'),
  ];
  return createPillar(
    'career-prep',
    pillarDef.name,
    pillarDef.category,
    pillarDef.color,
    pillarDef.gradient,
    pillarDef.iconName,
    goals,
    habits,
    'Career Preparation'
  );
}

function generateSocialPillar(): GeneratedPillar {
  const pillarDef = PILLAR_DEFS.find((p) => p.id === 'social')!;
  const goals = [
    createGoal(
      'social',
      '👥 Friendship Building',
      'Build strong friendships and social connections',
      [
        'Develop 3+ close friendships in your cohort',
        'Spend quality time with friends regularly',
        'Be supportive and show up for friends',
        'Create shared experiences and memories',
        'Build inclusive and welcoming friend group',
      ],
      '12 months'
    ),
    createGoal(
      'social',
      '🎓 Campus Involvement',
      'Get involved in campus life and communities',
      [
        'Join 2+ clubs or student organizations',
        'Attend 10+ social events or activities',
        'Take leadership role in 1+ organization',
        'Contribute to campus community',
        'Build diverse network of peers',
      ],
      '12 months'
    ),
  ];
  const habits = [
    createHabit('social', '👥 Hang out with friends', 'weekly', '👫'),
    createHabit('social', '🎉 Attend social event', 'weekly', '🎪'),
    createHabit('social', '💬 Check in with friend', 'weekly', '💬'),
    createHabit('social', '🎓 Club or org activity', 'weekly', '🏛️'),
  ];
  return createPillar(
    'social',
    pillarDef.name,
    pillarDef.category,
    pillarDef.color,
    pillarDef.gradient,
    pillarDef.iconName,
    goals,
    habits,
    'Social Life & Community'
  );
}

function generatePersonalGrowthPillar(): GeneratedPillar {
  const pillarDef = PILLAR_DEFS.find((p) => p.id === 'personal-growth')!;
  const goals = [
    createGoal(
      'personal-growth',
      '📖 Reading & Learning',
      'Expand knowledge through reading and self-education',
      [
        'Read 12+ books throughout the year',
        'Explore diverse topics and perspectives',
        'Journal about insights and learnings',
        'Discuss ideas with peers',
        'Build critical thinking skills',
      ],
      '12 months'
    ),
    createGoal(
      'personal-growth',
      '🧘 Self-Reflection & Values',
      'Develop self-awareness and clarify values',
      [
        'Establish regular journaling practice',
        'Reflect on values and what matters to you',
        'Explore identity and beliefs',
        'Work through challenges and growth areas',
        'Build resilience and self-awareness',
      ],
      '12 months'
    ),
    createGoal(
      'personal-growth',
      '🎨 Hobbies & Interests',
      'Develop hobbies and pursue passions',
      [
        'Invest time in hobby or creative pursuit',
        'Try 2+ new activities or experiences',
        'Build skills in area of interest',
        'Share interests with others',
        'Find joy and fulfillment outside academics',
      ],
      '12 months'
    ),
  ];
  const habits = [
    createHabit('personal-growth', '📖 Read', 'daily', '📚'),
    createHabit('personal-growth', '📝 Journal', 'daily', '📔'),
    createHabit('personal-growth', '🎨 Hobby time', 'weekly', '🎨'),
    createHabit('personal-growth', '🧘 Reflection time', 'weekly', '🧘'),
  ];
  return createPillar(
    'personal-growth',
    pillarDef.name,
    pillarDef.category,
    pillarDef.color,
    pillarDef.gradient,
    pillarDef.iconName,
    goals,
    habits,
    'Personal Development & Growth'
  );
}

// ============================================================================
// MAIN GENERATION FUNCTION
// ============================================================================

export function generatePillars(config: OnboardingConfig): GeneratedPillar[] {
  const pillars: GeneratedPillar[] = [];

  if (config.templateId === 'balanced') {
    // Career Pillar
    pillars.push(generateCareerPillar(config.role, config.roleTarget));

    // Education Pillar
    pillars.push(generateEducationPillar(config.education));

    // Family Pillar
    pillars.push(generateFamilyPillar(config.family));

    // Home Pillar
    pillars.push(generateHomePillar());

    // Health Pillar
    pillars.push(generateHealthPillar(config.healthFocus));
  } else if (config.templateId === 'career-focus') {
    // Career Pillar
    pillars.push(generateCareerPillar(config.role, config.roleTarget));

    // Skills Pillar
    pillars.push(generateSkillsPillar());

    // Networking Pillar
    pillars.push(generateNetworkingPillar());

    // Finance Pillar
    pillars.push(generateFinancePillar());

    // Wellness Pillar (lighter health)
    pillars.push(generateHealthPillar(config.healthFocus));
  } else if (config.templateId === 'student') {
    // Academics Pillar
    pillars.push(generateAcademicsPillar());

    // Career Prep Pillar
    pillars.push(generateCareerPrepPillar());

    // Social Pillar
    pillars.push(generateSocialPillar());

    // Health Pillar
    pillars.push(generateHealthPillar(config.healthFocus));

    // Personal Growth Pillar
    pillars.push(generatePersonalGrowthPillar());
  } else if (config.templateId === 'custom') {
    // Generate pillars based on custom selections
    if (config.customPillars && config.customPillars.length > 0) {
      for (const pillarId of config.customPillars) {
        if (pillarId === 'career') {
          pillars.push(generateCareerPillar(config.role, config.roleTarget));
        } else if (pillarId === 'education') {
          pillars.push(generateEducationPillar(config.education));
        } else if (pillarId === 'family') {
          pillars.push(generateFamilyPillar(config.family));
        } else if (pillarId === 'home') {
          pillars.push(generateHomePillar());
        } else if (pillarId === 'health' || pillarId === 'wellness') {
          pillars.push(generateHealthPillar(config.healthFocus));
        } else if (pillarId === 'skills') {
          pillars.push(generateSkillsPillar());
        } else if (pillarId === 'networking') {
          pillars.push(generateNetworkingPillar());
        } else if (pillarId === 'finance') {
          pillars.push(generateFinancePillar());
        } else if (pillarId === 'academics') {
          pillars.push(generateAcademicsPillar());
        } else if (pillarId === 'career-prep') {
          pillars.push(generateCareerPrepPillar());
        } else if (pillarId === 'social') {
          pillars.push(generateSocialPillar());
        } else if (pillarId === 'personal-growth') {
          pillars.push(generatePersonalGrowthPillar());
        } else if (pillarId === 'creativity') {
          // Creativity Pillar
          const pillarDef = PILLAR_DEFS.find((p) => p.id === 'creativity')!;
          const goals = [
            createGoal(
              'creativity',
              '🎨 Creative Projects',
              'Develop creative skills through regular practice',
              [
                'Complete 12+ creative projects or pieces',
                'Establish daily creative practice',
                'Build portfolio of work',
                'Share work with others',
                'Develop unique creative voice',
              ],
              '12 months'
            ),
          ];
          const habits = [
            createHabit('creativity', '🎨 Create something', 'daily', '🎨'),
            createHabit('creativity', '💡 Seek inspiration', 'weekly', '💡'),
            createHabit('creativity', '👥 Share work', 'weekly', '🖼️'),
          ];
          pillars.push(
            createPillar(
              'creativity',
              pillarDef.name,
              pillarDef.category,
              pillarDef.color,
              pillarDef.gradient,
              pillarDef.iconName,
              goals,
              habits,
              'Creative Expression'
            )
          );
        } else if (pillarId === 'spirituality') {
          // Spirituality Pillar
          const pillarDef = PILLAR_DEFS.find((p) => p.id === 'spirituality')!;
          const goals = [
            createGoal(
              'spirituality',
              '🙏 Spiritual Practice',
              'Develop meaningful spiritual or contemplative practice',
              [
                'Establish daily spiritual practice',
                'Explore beliefs and values',
                'Build community connections',
                'Read spiritual or philosophical texts',
                'Find peace and purpose',
              ],
              '12 months'
            ),
          ];
          const habits = [
            createHabit('spirituality', '🙏 Meditation or prayer', 'daily', '🧘'),
            createHabit('spirituality', '📖 Read spiritual text', 'weekly', '📚'),
            createHabit('spirituality', '🤝 Spiritual community', 'weekly', '👥'),
          ];
          pillars.push(
            createPillar(
              'spirituality',
              pillarDef.name,
              pillarDef.category,
              pillarDef.color,
              pillarDef.gradient,
              pillarDef.iconName,
              goals,
              habits,
              'Spiritual Growth'
            )
          );
        } else if (pillarId === 'side-project') {
          // Side Project Pillar
          const pillarDef = PILLAR_DEFS.find((p) => p.id === 'side-project')!;
          const goals = [
            createGoal(
              'side-project',
              '🚀 Project Development',
              'Build and launch a meaningful side project',
              [
                'Define project scope and vision',
                'Build MVP with core features',
                'Launch project or share with others',
                'Iterate based on feedback',
                'Achieve project milestone or goal',
              ],
              '12 months'
            ),
          ];
          const habits = [
            createHabit('side-project', '⚒️ Work on project', 'weekly', '🛠️'),
            createHabit('side-project', '📊 Track progress', 'weekly', '📈'),
            createHabit('side-project', '💡 Brainstorm ideas', 'weekly', '🧠'),
          ];
          pillars.push(
            createPillar(
              'side-project',
              pillarDef.name,
              pillarDef.category,
              pillarDef.color,
              pillarDef.gradient,
              pillarDef.iconName,
              goals,
              habits,
              'Side Project Building'
            )
          );
        }
      }
    }
  }

  return pillars;
}
