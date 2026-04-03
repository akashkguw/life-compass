import React, { useState } from 'react';
import { Trophy, TrendingUp, AlertCircle, Lightbulb } from 'lucide-react';
import { useStore } from '../store';
import { QuickLog, PillarId } from '../types';
import OverlayPortal from './OverlayPortal';

interface QuickLogModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function QuickLogModal({ isOpen, onClose }: QuickLogModalProps) {
  const { state, dispatch, today } = useStore();
  const [selectedPillarId, setSelectedPillarId] = useState<string>('');
  const [selectedLogType, setSelectedLogType] = useState<'progress' | 'blocker' | 'win' | 'thought'>('win');
  const [note, setNote] = useState('');

  if (!isOpen) return null;

  const handleSave = () => {
    if (!selectedPillarId || !note.trim()) return;

    const newLog: QuickLog = {
      id: crypto.randomUUID(),
      pillarId: selectedPillarId as PillarId,
      note: note.trim(),
      timestamp: new Date().toISOString(),
      type: selectedLogType,
    };

    dispatch({ type: 'ADD_QUICK_LOG', payload: { date: today, log: newLog } });
    setNote('');
    setSelectedLogType('win');
    setSelectedPillarId('');
    onClose();
  };

  const logTypes = [
    { type: 'win' as const, icon: <Trophy size={16} />, label: 'Win', color: '#10b981', bg: 'var(--success-bg)' },
    { type: 'progress' as const, icon: <TrendingUp size={16} />, label: 'Progress', color: '#6366f1', bg: 'var(--accent-bg)' },
    { type: 'blocker' as const, icon: <AlertCircle size={16} />, label: 'Blocker', color: '#f43f5e', bg: 'var(--danger-bg)' },
    { type: 'thought' as const, icon: <Lightbulb size={16} />, label: 'Thought', color: '#f59e0b', bg: 'var(--warning-bg)' },
  ];

  return (
    <OverlayPortal>
      <div className="modal-overlay" onClick={onClose} role="presentation">
        <div className="modal-panel" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true" aria-label="Quick Log">
        <div className="modal-handle" />
        <h2 className="modal-title">Quick Log</h2>
        <p className="modal-subtitle">Capture a moment from your day</p>

        <div className="form-group">
          <label className="form-label">Pillar</label>
          <div className="chip-row">
            {state.pillars.map(pillar => (
              <button
                key={pillar.id}
                className={`chip-premium ${selectedPillarId === pillar.id ? 'active' : ''}`}
                onClick={() => setSelectedPillarId(pillar.id)}
                style={selectedPillarId === pillar.id ? { background: pillar.gradient, color: 'white', borderColor: 'transparent' } : {}}
              >
                {pillar.name}
              </button>
            ))}
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Type</label>
          <div className="chip-row">
            {logTypes.map(lt => (
              <button
                key={lt.type}
                className={`chip-premium chip-icon ${selectedLogType === lt.type ? 'active' : ''}`}
                onClick={() => setSelectedLogType(lt.type)}
                style={selectedLogType === lt.type ? { backgroundColor: lt.color, color: 'white', borderColor: 'transparent' } : {}}
              >
                {lt.icon}
                {lt.label}
              </button>
            ))}
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Note</label>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="What happened?"
            className="form-textarea"
            rows={3}
            maxLength={500}
          />
        </div>

        <button
          className="btn btn-primary btn-full"
          onClick={handleSave}
          disabled={!selectedPillarId || !note.trim()}
        >
          Save Log
        </button>
        </div>
      </div>
    </OverlayPortal>
  );
}
