import { useEffect, useState } from 'react'
import { Routes, Route, useLocation, Link } from 'react-router-dom'
import { Compass, LayoutDashboard, CalendarDays, Calendar, Plus, Settings } from 'lucide-react'
import { useStore } from './store'
import Dashboard from './pages/Dashboard'
import DailyView from './pages/DailyView'
import WeeklyView from './pages/WeeklyView'
import PillarDetail from './pages/PillarDetail'
import SettingsPage from './pages/Settings'
import Onboarding from './pages/Onboarding'
import QuickLogModal from './components/QuickLogModal'

export default function App() {
  const { state, dispatch } = useStore()
  const location = useLocation()
  const [showQuickLog, setShowQuickLog] = useState(false)

  // Theme management
  useEffect(() => {
    let theme = state.theme
    if (theme === 'auto') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      theme = prefersDark ? 'dark' : 'light'
    }
    document.documentElement.setAttribute('data-theme', theme)
  }, [state.theme])

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handleChange = () => {
      if (state.theme === 'auto') {
        const theme = mediaQuery.matches ? 'dark' : 'light'
        document.documentElement.setAttribute('data-theme', theme)
      }
    }
    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [state.theme])

  // Show onboarding if not completed
  if (!state.onboarded) {
    return (
      <div className="app-layout">
        <Onboarding />
      </div>
    )
  }

  const navItems = [
    { path: '/', icon: LayoutDashboard, label: 'Home' },
    { path: '/daily', icon: CalendarDays, label: 'Daily' },
    { path: '/weekly', icon: Calendar, label: 'Weekly' },
    { path: '/settings', icon: Settings, label: 'Settings' },
  ]

  const isActive = (path: string) => location.pathname === path

  return (
    <div className="app-layout">
      <header className="app-header">
        <div className="header-inner">
          <div className="header-brand">
            <div className="brand-icon">
              <Compass size={18} />
            </div>
            <span className="brand-text">Life Compass</span>
          </div>
        </div>
      </header>

      <main className="main-content page-enter" key={location.pathname}>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/daily" element={<DailyView />} />
          <Route path="/weekly" element={<WeeklyView />} />
          <Route path="/pillar/:id" element={<PillarDetail />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Routes>
      </main>

      <nav className="bottom-nav" role="navigation" aria-label="Main navigation">
        {navItems.slice(0, 2).map((item) => {
          const Icon = item.icon
          return (
            <Link key={item.path} to={item.path}
              className={`nav-item ${isActive(item.path) ? 'active' : ''}`}
              aria-current={isActive(item.path) ? 'page' : undefined}>
              <div className="nav-icon-wrap"><Icon size={20} /></div>
              <span>{item.label}</span>
            </Link>
          )
        })}
        <button className="nav-fab" onClick={() => setShowQuickLog(true)} aria-label="Quick Log">
          <Plus size={24} strokeWidth={2.5} />
        </button>
        {navItems.slice(2).map((item) => {
          const Icon = item.icon
          return (
            <Link key={item.path} to={item.path}
              className={`nav-item ${isActive(item.path) ? 'active' : ''}`}
              aria-current={isActive(item.path) ? 'page' : undefined}>
              <div className="nav-icon-wrap"><Icon size={20} /></div>
              <span>{item.label}</span>
            </Link>
          )
        })}
      </nav>

      <QuickLogModal isOpen={showQuickLog} onClose={() => setShowQuickLog(false)} />
    </div>
  )
}
