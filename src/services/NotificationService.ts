export interface NotificationConfig {
  id: string;
  title: string;
  body: string;
  time: string; // Format HH:MM
  enabled: boolean;
  type: 'reminder' | 'congratulation' | 'warning' | 'custom';
  icon?: string;
  tag?: string;
}

export interface NotificationPermissionState {
  granted: boolean;
  requested: boolean;
}

const NOTIFICATIONS_STORAGE_KEY = 'wellbeing-notifications';
const PERMISSION_STORAGE_KEY = 'wellbeing-notification-permission';

export const DEFAULT_NOTIFICATIONS: NotificationConfig[] = [
  {
    id: 'daily-journal',
    title: '📝 Journal du Jour',
    body: 'N\'oubliez pas de remplir votre journal bien-être quotidien !',
    time: '20:00',
    enabled: true,
    type: 'reminder',
    icon: '📝',
    tag: 'daily-reminder'
  },
  {
    id: 'morning-motivation',
    title: '🌅 Bonne journée !',
    body: 'Prenez soin de votre bien-être aujourd\'hui. Vous pouvez le faire !',
    time: '08:00',
    enabled: true,
    type: 'custom',
    icon: '🌅',
    tag: 'morning-motivation'
  },
  {
    id: 'evening-reflection',
    title: '🌙 Temps de réflexion',
    body: 'Comment s\'est passée votre journée ? Prenez un moment pour réfléchir.',
    time: '21:30',
    enabled: false,
    type: 'custom',
    icon: '🌙',
    tag: 'evening-reflection'
  },
  {
    id: 'fajr-prayer',
    title: '🕌 Rappel Fajr',
    body: 'Il est temps pour la prière du Fajr',
    time: '05:30',
    enabled: false,
    type: 'reminder',
    icon: '🕌',
    tag: 'prayer-fajr'
  },
  {
    id: 'sport-reminder',
    title: '💪 Temps de bouger !',
    body: 'N\'oubliez pas votre séance de sport aujourd\'hui',
    time: '18:00',
    enabled: false,
    type: 'reminder',
    icon: '💪',
    tag: 'sport-reminder'
  }
];

export class NotificationService {
  private static scheduledNotifications = new Map<string, number>();

  // Vérifier si les notifications sont supportées
  static isSupported(): boolean {
    return 'Notification' in window && 'serviceWorker' in navigator;
  }

  // Demander la permission pour les notifications
  static async requestPermission(): Promise<boolean> {
    if (!this.isSupported()) {
      console.warn('Notifications non supportées dans ce navigateur');
      return false;
    }

    try {
      const permission = await Notification.requestPermission();
      const granted = permission === 'granted';
      
      this.savePermissionState({
        granted,
        requested: true
      });

      return granted;
    } catch (error) {
      console.error('Erreur lors de la demande de permission:', error);
      return false;
    }
  }

  // Obtenir l'état actuel des permissions
  static getPermissionState(): NotificationPermissionState {
    try {
      const saved = localStorage.getItem(PERMISSION_STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (error) {
      console.error('Erreur lors du chargement de l\'état des permissions:', error);
    }

    return {
      granted: Notification.permission === 'granted',
      requested: false
    };
  }

  // Sauvegarder l'état des permissions
  private static savePermissionState(state: NotificationPermissionState): void {
    try {
      localStorage.setItem(PERMISSION_STORAGE_KEY, JSON.stringify(state));
    } catch (error) {
      console.error('Erreur lors de la sauvegarde de l\'état des permissions:', error);
    }
  }

  // Obtenir les configurations de notifications
  static getNotificationConfigs(): NotificationConfig[] {
    try {
      const saved = localStorage.getItem(NOTIFICATIONS_STORAGE_KEY);
      if (saved) {
        const configs = JSON.parse(saved);
        // Fusionner avec les notifications par défaut pour les nouvelles
        return this.mergeWithDefaults(configs);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des configurations:', error);
    }

    return [...DEFAULT_NOTIFICATIONS];
  }

  // Fusionner avec les configurations par défaut
  private static mergeWithDefaults(saved: NotificationConfig[]): NotificationConfig[] {
    const savedMap = new Map(saved.map(config => [config.id, config]));
    const merged: NotificationConfig[] = [];

    // Ajouter les configurations par défaut, en utilisant les versions sauvegardées si elles existent
    DEFAULT_NOTIFICATIONS.forEach(defaultConfig => {
      const savedConfig = savedMap.get(defaultConfig.id);
      merged.push(savedConfig || defaultConfig);
      savedMap.delete(defaultConfig.id);
    });

    // Ajouter les configurations personnalisées restantes
    savedMap.forEach(config => merged.push(config));

    return merged;
  }

  // Sauvegarder les configurations
  static saveNotificationConfigs(configs: NotificationConfig[]): void {
    try {
      localStorage.setItem(NOTIFICATIONS_STORAGE_KEY, JSON.stringify(configs));
    } catch (error) {
      console.error('Erreur lors de la sauvegarde des configurations:', error);
    }
  }

  // Programmer toutes les notifications
  static scheduleAllNotifications(): void {
    if (!this.getPermissionState().granted) {
      console.warn('Permission non accordée pour les notifications');
      return;
    }

    // Annuler toutes les notifications existantes
    this.cancelAllNotifications();

    const configs = this.getNotificationConfigs().filter(config => config.enabled);
    
    configs.forEach(config => {
      this.scheduleNotification(config);
    });

    console.log(`${configs.length} notifications programmées`);
  }

  // Programmer une notification spécifique
  static scheduleNotification(config: NotificationConfig): void {
    if (!this.getPermissionState().granted) return;

    const now = new Date();
    const [hours, minutes] = config.time.split(':').map(Number);
    
    const scheduledTime = new Date();
    scheduledTime.setHours(hours, minutes, 0, 0);

    // Si l'heure est déjà passée aujourd'hui, programmer pour demain
    if (scheduledTime <= now) {
      scheduledTime.setDate(scheduledTime.getDate() + 1);
    }

    const delay = scheduledTime.getTime() - now.getTime();

    const timeoutId = setTimeout(() => {
      this.showNotification(config);
      // Programmer la notification pour le jour suivant
      this.scheduleNotification(config);
    }, delay);

    this.scheduledNotifications.set(config.id, timeoutId);

    console.log(`Notification "${config.title}" programmée pour ${scheduledTime.toLocaleString()}`);
  }

  // Afficher une notification
  static showNotification(config: NotificationConfig): void {
    if (!this.getPermissionState().granted) return;

    try {      const notification = new Notification(config.title, {
        body: config.body,
        icon: '/icon-192x192.png', // Icône de l'app
        badge: '/icon-192x192.png',
        tag: config.tag,
        requireInteraction: false,
        silent: false
      });

      // Auto-fermer après 10 secondes
      setTimeout(() => {
        notification.close();
      }, 10000);

      // Gestion des clics
      notification.onclick = () => {
        window.focus();
        notification.close();
        
        // Rediriger vers l'application si possible
        if (window.location.pathname !== '/') {
          window.location.href = '/';
        }
      };

    } catch (error) {
      console.error('Erreur lors de l\'affichage de la notification:', error);
    }
  }

  // Annuler toutes les notifications programmées
  static cancelAllNotifications(): void {
    this.scheduledNotifications.forEach((timeoutId) => {
      clearTimeout(timeoutId);
    });
    this.scheduledNotifications.clear();
  }

  // Annuler une notification spécifique
  static cancelNotification(id: string): void {
    const timeoutId = this.scheduledNotifications.get(id);
    if (timeoutId) {
      clearTimeout(timeoutId);
      this.scheduledNotifications.delete(id);
    }
  }

  // Envoyer une notification de félicitations
  static showCongratulationNotification(score: number): void {
    if (!this.getPermissionState().granted) return;

    let title = '🎉 Félicitations !';
    let body = '';

    if (score >= 90) {
      body = `Score exceptionnel de ${score}% ! Vous êtes au top de votre forme !`;
    } else if (score >= 80) {
      body = `Excellent score de ${score}% ! Continuez comme ça !`;
    } else if (score >= 70) {
      body = `Beau score de ${score}% ! Vous progressez bien !`;
    } else {
      return; // Pas de félicitations pour les scores plus bas
    }

    this.showNotification({
      id: 'congratulation',
      title,
      body,
      time: '',
      enabled: true,
      type: 'congratulation',
      icon: '🎉',
      tag: 'congratulation'
    });
  }

  // Envoyer une notification d'avertissement
  static showWarningNotification(pillarName: string, score: number): void {
    if (!this.getPermissionState().granted) return;

    if (score < 40) {
      this.showNotification({
        id: 'warning',
        title: '⚠️ Attention !',
        body: `Votre pilier "${pillarName}" nécessite votre attention (${score}%). Prenez soin de vous !`,
        time: '',
        enabled: true,
        type: 'warning',
        icon: '⚠️',
        tag: 'warning'
      });
    }
  }

  // Initialiser le service
  static async init(): Promise<void> {
    if (!this.isSupported()) {
      console.warn('Service de notifications non disponible');
      return;
    }

    const permissionState = this.getPermissionState();
    
    if (permissionState.granted) {
      this.scheduleAllNotifications();
    } else if (!permissionState.requested) {
      // Ne pas demander automatiquement, laisser l'utilisateur décider
      console.log('Permission de notification non demandée');
    }
  }

  // Mettre à jour une configuration
  static updateNotificationConfig(id: string, updates: Partial<NotificationConfig>): void {
    const configs = this.getNotificationConfigs();
    const index = configs.findIndex(config => config.id === id);
    
    if (index !== -1) {
      configs[index] = { ...configs[index], ...updates };
      this.saveNotificationConfigs(configs);
      
      // Reprogrammer toutes les notifications
      this.scheduleAllNotifications();
    }
  }

  // Ajouter une nouvelle configuration
  static addNotificationConfig(config: Omit<NotificationConfig, 'id'>): string {
    const id = `custom-${Date.now()}`;
    const newConfig: NotificationConfig = { ...config, id };
    
    const configs = this.getNotificationConfigs();
    configs.push(newConfig);
    this.saveNotificationConfigs(configs);
    
    // Reprogrammer toutes les notifications
    this.scheduleAllNotifications();
    
    return id;
  }

  // Supprimer une configuration
  static removeNotificationConfig(id: string): void {
    const configs = this.getNotificationConfigs();
    const filtered = configs.filter(config => config.id !== id);
    
    this.cancelNotification(id);
    this.saveNotificationConfigs(filtered);
  }
}
