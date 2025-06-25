import React from 'react';
import { Bell, BellOff, Settings, TestTube } from 'lucide-react';
import { useNotifications } from '../hooks/useNotifications';
import './NotificationSettings.css';

interface NotificationSettingsProps {
  isOpen: boolean;
  onClose: () => void;
}

const NotificationSettings: React.FC<NotificationSettingsProps> = ({ isOpen, onClose }) => {  const {
    isSupported,
    configurations,
    requestPermission,    updateConfiguration,
    toggleNotification,
    testNotification,
    hasPermission,
    needsPermission
  } = useNotifications();

  if (!isOpen) return null;

  const handlePermissionRequest = async () => {
    await requestPermission();
  };

  const handleTimeChange = (id: string, time: string) => {
    updateConfiguration(id, { time });
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'reminder': return '⏰';
      case 'congratulation': return '🎉';
      case 'warning': return '⚠️';
      case 'custom': return '📝';
      default: return '🔔';
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'reminder': return 'Rappel';
      case 'congratulation': return 'Félicitation';
      case 'warning': return 'Avertissement';
      case 'custom': return 'Personnalisé';
      default: return 'Notification';
    }
  };

  if (!isSupported) {
    return (
      <div className="notification-settings-overlay">
        <div className="notification-settings">
          <div className="settings-header">
            <h3>🔔 Notifications</h3>
            <button className="close-button" onClick={onClose}>×</button>
          </div>
          <div className="not-supported">
            <BellOff size={48} />
            <p>Les notifications ne sont pas supportées dans votre navigateur.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="notification-settings-overlay">
      <div className="notification-settings">
        <div className="settings-header">
          <h3>🔔 Notifications</h3>
          <button className="close-button" onClick={onClose}>×</button>
        </div>

        <div className="settings-content">
          {/* Section Permission */}
          <div className="permission-section">
            <div className="permission-status">
              {hasPermission ? (
                <div className="permission-granted">
                  <Bell size={24} />
                  <span>Notifications activées</span>
                </div>
              ) : (
                <div className="permission-needed">
                  <BellOff size={24} />
                  <span>Notifications désactivées</span>
                </div>
              )}
            </div>

            {needsPermission && (
              <button 
                className="permission-button"
                onClick={handlePermissionRequest}
              >
                <Bell size={16} />
                Autoriser les notifications
              </button>
            )}

            {hasPermission && (
              <button 
                className="test-button"
                onClick={testNotification}
              >
                <TestTube size={16} />
                Tester les notifications
              </button>
            )}
          </div>

          {/* Liste des notifications */}
          {hasPermission && (
            <div className="notifications-list">              <div className="list-header">
                <h4>Rappels configurés</h4>
              </div>

              {configurations.map((config) => (
                <div key={config.id} className="notification-item">
                  <div className="notification-info">
                    <div className="notification-title">
                      <span className="type-icon">{getTypeIcon(config.type)}</span>
                      <span className="title">{config.title}</span>
                      <span className="type-label">{getTypeLabel(config.type)}</span>
                    </div>
                    <p className="notification-body">{config.body}</p>
                  </div>

                  <div className="notification-controls">
                    <input
                      type="time"
                      value={config.time}
                      onChange={(e) => handleTimeChange(config.id, e.target.value)}
                      className="time-input"
                      disabled={!config.enabled}
                    />
                    
                    <button
                      className={`toggle-button ${config.enabled ? 'enabled' : 'disabled'}`}
                      onClick={() => toggleNotification(config.id)}
                      title={config.enabled ? 'Désactiver' : 'Activer'}
                    >
                      {config.enabled ? <Bell size={16} /> : <BellOff size={16} />}
                    </button>                    {config.id.startsWith('custom-') && (
                      <span className="custom-label">Personnalisé</span>
                    )}
                  </div>
                </div>
              ))}

              {configurations.length === 0 && (
                <div className="empty-state">
                  <p>Aucune notification configurée</p>
                </div>
              )}
            </div>
          )}

          {/* Informations supplémentaires */}
          <div className="info-section">
            <div className="info-item">
              <Settings size={16} />
              <span>Les notifications vous aideront à maintenir vos habitudes de bien-être</span>
            </div>
            <div className="info-item">
              <Bell size={16} />
              <span>Vous pouvez personnaliser les heures et activer/désactiver chaque rappel</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationSettings;
