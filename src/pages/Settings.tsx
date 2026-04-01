import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sun, Moon, Monitor, Download, Trash2, ArrowLeft, Info } from 'lucide-react';
import { useStore } from '../store';

export default function SettingsPage() {
  const navigate = useNavigate();
  const { state, dispatch } = useStore();
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const handleThemeChange = (theme: 'light' | 'dark' | 'auto') => {
    dispatch({
      type: 'SET_THEME',
      payload: theme,
    });
  };

  const handleExportData = () => {
    const dataToExport = {
      state,
      exportedAt: new Date().toISOString(),
    };

    const dataStr = JSON.stringify(dataToExport, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `life-compass-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleResetData = () => {
    dispatch({
      type: 'RESET_STATE',
    });
    setShowResetConfirm(false);
  };

  const currentTheme = state.theme || 'auto';

  return (
    <div className="page-container">
      {/* Back Button */}
      <button
        className="back-btn"
        onClick={() => navigate(-1)}
        aria-label="Go back"
      >
        <ArrowLeft size={20} />
        <span>Back</span>
      </button>

      {/* Appearance Section */}
      <div className="settings-section">
        <h2>Appearance</h2>
        <div className="setting-row">
          <div className="setting-info">
            <div className="setting-label">Theme</div>
            <div className="setting-desc">Choose your preferred appearance</div>
          </div>
          <div className="theme-toggle-group">
            <button
              className={`theme-toggle-btn ${currentTheme === 'light' ? 'active' : ''}`}
              onClick={() => handleThemeChange('light')}
              aria-label="Light theme"
              title="Light"
            >
              <Sun size={18} />
              <span>Light</span>
            </button>
            <button
              className={`theme-toggle-btn ${currentTheme === 'dark' ? 'active' : ''}`}
              onClick={() => handleThemeChange('dark')}
              aria-label="Dark theme"
              title="Dark"
            >
              <Moon size={18} />
              <span>Dark</span>
            </button>
            <button
              className={`theme-toggle-btn ${currentTheme === 'auto' ? 'active' : ''}`}
              onClick={() => handleThemeChange('auto')}
              aria-label="Auto theme"
              title="Auto"
            >
              <Monitor size={18} />
              <span>Auto</span>
            </button>
          </div>
        </div>
      </div>

      {/* Data Section */}
      <div className="settings-section">
        <h2>Data</h2>

        {/* Export Data */}
        <div className="setting-row">
          <div className="setting-info">
            <div className="setting-label">Export</div>
            <div className="setting-desc">Download your data as JSON</div>
          </div>
          <button
            className="btn btn-secondary"
            onClick={handleExportData}
          >
            <Download size={18} />
            Export
          </button>
        </div>

        {/* Reset Data */}
        <div className="setting-row">
          <div className="setting-info">
            <div className="setting-label">Reset</div>
            <div className="setting-desc">Clear all data and start fresh</div>
          </div>
          <button
            className="btn btn-secondary"
            onClick={() => setShowResetConfirm(true)}
            style={{ color: 'var(--danger)' }}
          >
            <Trash2 size={18} />
            Reset
          </button>
        </div>
      </div>

      {/* About Section */}
      <div className="settings-section">
        <div className="card">
          <h3>Life Compass</h3>
          <div className="about-content">
            <div className="about-item">
              <span className="about-label">Version</span>
              <span className="about-value">1.0.0</span>
            </div>
            <div className="about-tagline">Built with love for Akash's journey</div>
          </div>
        </div>
      </div>

      {/* Reset Confirmation Modal */}
      {showResetConfirm && (
        <div className="modal-overlay" style={{ alignItems: 'center' }}>
          <div className="modal-panel" style={{ margin: 0 }}>
            <div className="reset-confirm-icon">
              <Trash2 size={32} />
            </div>
            <h2>Reset All Data?</h2>
            <p className="reset-confirm-warning">
              This will permanently delete all your data including habits, logs, goals, and settings. This action cannot be undone.
            </p>
            <div className="form-actions">
              <button
                className="btn btn-secondary"
                onClick={() => setShowResetConfirm(false)}
              >
                Cancel
              </button>
              <button
                className="btn btn-secondary"
                onClick={handleResetData}
                style={{ color: 'var(--danger)' }}
              >
                Reset Everything
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
