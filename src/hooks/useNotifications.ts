import { useState, useEffect } from 'react';
import { 
  NotificationService, 
  type NotificationConfig, 
  type NotificationPermissionState 
} from '../services/NotificationService';

export const useNotifications = () => {
  const [permissionState, setPermissionState] = useState<NotificationPermissionState>(
    NotificationService.getPermissionState()
  );
  const [configurations, setConfigurations] = useState<NotificationConfig[]>(
    NotificationService.getNotificationConfigs()
  );
  const [isSupported] = useState(NotificationService.isSupported());

  useEffect(() => {
    // Initialiser le service au montage
    NotificationService.init();
  }, []);

  const requestPermission = async (): Promise<boolean> => {
    const granted = await NotificationService.requestPermission();
    setPermissionState(NotificationService.getPermissionState());
    
    if (granted) {
      // Programmer les notifications si la permission est accordée
      NotificationService.scheduleAllNotifications();
    }
    
    return granted;
  };

  const updateConfiguration = (id: string, updates: Partial<NotificationConfig>) => {
    NotificationService.updateNotificationConfig(id, updates);
    setConfigurations(NotificationService.getNotificationConfigs());
  };

  const addConfiguration = (config: Omit<NotificationConfig, 'id'>): string => {
    const id = NotificationService.addNotificationConfig(config);
    setConfigurations(NotificationService.getNotificationConfigs());
    return id;
  };

  const removeConfiguration = (id: string) => {
    NotificationService.removeNotificationConfig(id);
    setConfigurations(NotificationService.getNotificationConfigs());
  };

  const toggleNotification = (id: string) => {
    const config = configurations.find(c => c.id === id);
    if (config) {
      updateConfiguration(id, { enabled: !config.enabled });
    }
  };

  const scheduleAll = () => {
    if (permissionState.granted) {
      NotificationService.scheduleAllNotifications();
    }
  };

  const showCongratulation = (score: number) => {
    NotificationService.showCongratulationNotification(score);
  };

  const showWarning = (pillarName: string, score: number) => {
    NotificationService.showWarningNotification(pillarName, score);
  };

  const testNotification = () => {
    if (permissionState.granted) {
      NotificationService.showNotification({
        id: 'test',
        title: '🧪 Test de notification',
        body: 'Si vous voyez ceci, les notifications fonctionnent !',
        time: '',
        enabled: true,
        type: 'custom',
        icon: '🧪',
        tag: 'test'
      });
    }
  };

  return {
    isSupported,
    permissionState,
    configurations,
    requestPermission,
    updateConfiguration,
    addConfiguration,
    removeConfiguration,
    toggleNotification,
    scheduleAll,
    showCongratulation,
    showWarning,
    testNotification,
    hasPermission: permissionState.granted,
    needsPermission: !permissionState.granted && !permissionState.requested
  };
};
