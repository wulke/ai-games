import React, { useState } from 'react';
import { useDeveloperSettings } from '../context/DeveloperSettingsContext';
import '../style/developer_settings.css';

interface DeveloperSettingsProps {
  isOpen: boolean;
  onClose: () => void;
}

const DeveloperSettings: React.FC<DeveloperSettingsProps> = ({ isOpen, onClose }) => {
  const { settings, updateSettings } = useDeveloperSettings();
  const [testStatus, setTestStatus] = useState<'idle' | 'testing' | 'ok' | 'error'>('idle');
  const [localUrl, setLocalUrl] = useState(settings.botUrl);

  if (!isOpen) return null;

  const handleTestConnection = async () => {
    setTestStatus('testing');
    try {
      const response = await fetch(`${localUrl}/health`, { method: 'GET' });
      if (response.ok) {
        setTestStatus('ok');
      } else {
        setTestStatus('error');
      }
    } catch (e) {
      console.error('Connection test failed', e);
      setTestStatus('error');
    }
  };

  const handleSave = () => {
    updateSettings({ botUrl: localUrl });
    onClose();
  };

  return (
    <div className="settings-overlay" onClick={onClose}>
      <div className="settings-modal" onClick={e => e.stopPropagation()}>
        <h2>
          <span>🛠️</span> Developer Settings
        </h2>

        <div className="settings-group">
          <label htmlFor="bot-url">Bot Engine URL (Phase 1: Local POC)</label>
          <input
            id="bot-url"
            type="text"
            value={localUrl}
            onChange={e => setLocalUrl(e.target.value)}
            placeholder="http://localhost:8080"
          />
          <div style={{ marginTop: '0.5rem' }}>
            <button className="btn-test" onClick={handleTestConnection} disabled={testStatus === 'testing'}>
              {testStatus === 'testing' ? 'Testing...' : 'Test Connection'}
            </button>
            {testStatus !== 'idle' && (
              <span className={`connection-status status-${testStatus}`}>
                {testStatus === 'ok' ? '✅ Connected' : testStatus === 'error' ? '❌ Failed' : '⏳ Testing...'}
              </span>
            )}
          </div>
        </div>

        <div className="settings-group toggle-group">
          <div>
            <label style={{ margin: 0 }}>Enable External Bot</label>
            <p style={{ fontSize: '0.8rem', opacity: 0.7, margin: 0 }}>
              Use the configured Bot Engine for legal move selection.
            </p>
          </div>
          <label className="switch">
            <input
              type="checkbox"
              checked={settings.isExternalBotEnabled}
              onChange={e => updateSettings({ isExternalBotEnabled: e.target.checked })}
            />
            <span className="slider"></span>
          </label>
        </div>

        <div className="modal-actions">
          <button className="btn-close" onClick={onClose}>Cancel</button>
          <button className="btn-test" style={{ margin: 0 }} onClick={handleSave}>Save Settings</button>
        </div>
      </div>
    </div>
  );
};

export default DeveloperSettings;
