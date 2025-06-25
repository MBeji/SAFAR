import { DataService } from './DataService';

export class ReminderService {
  private static readonly REMINDER_KEY = 'wellbeing-reminders';

  // Types de rappels
  static reminderTypes = {
    DAILY_ENTRY: 'daily_entry',
    HYDRATION: 'hydration',
    EXERCISE: 'exercise',
    BEDTIME: 'bedtime',
    MEDITATION: 'meditation',
    GOAL_CHECK: 'goal_check'
  };

  // Configuration des rappels par défaut
  static defaultReminders = [
    {
      id: 'morning_checkin',
      type: this.reminderTypes.DAILY_ENTRY,
      title: '🌅 Bonjour ! Comment vous sentez-vous ?',
      time: '09:00',
      enabled: true,
      frequency: 'daily'
    },
    {
      id: 'evening_reflection',
      type: this.reminderTypes.DAILY_ENTRY,
      title: '🌙 Temps de bilan de votre journée',
      time: '20:00',
      enabled: true,
      frequency: 'daily'
    },
    {
      id: 'hydration_reminder',
      type: this.reminderTypes.HYDRATION,
      title: '💧 N\'oubliez pas de boire de l\'eau',
      time: '14:00',
      enabled: false,
      frequency: 'daily'
    },
    {
      id: 'exercise_motivation',
      type: this.reminderTypes.EXERCISE,
      title: '💪 C\'est le moment de bouger !',
      time: '18:00',
      enabled: false,
      frequency: 'daily'
    },
    {
      id: 'weekly_goals',
      type: this.reminderTypes.GOAL_CHECK,
      title: '🎯 Comment vont vos objectifs cette semaine ?',
      time: '10:00',
      enabled: true,
      frequency: 'weekly'
    }
  ];

  // Rappels adaptatifs basés sur les données
  static generateSmartReminders(): any[] {
    const weakestPillar = DataService.getWeakestPillar();
    const streakData = DataService.getStreakData();
    const smartReminders = [];

    // Rappel spécifique au pilier faible
    if (weakestPillar && weakestPillar.averageScore < 60) {
      const reminderTexts = {
        'alimentation': '🥗 Que diriez-vous d\'un en-cas sain ?',
        'sport': '🏃 15 minutes d\'activité peuvent changer votre journée',
        'sommeil': '😴 Préparez-vous pour une bonne nuit',
        'stress': '🧘 Prenez une pause respiration profonde',
        'spiritualite': '✨ Un moment de réflexion vous ferait du bien',
        'social': '❤️ Appelez quelqu\'un qui vous est cher'
      };

      smartReminders.push({
        id: `smart_${weakestPillar.pillarId}`,
        type: 'smart_pillar',
        title: reminderTexts[weakestPillar.pillarId as keyof typeof reminderTexts],
        time: '16:00',
        enabled: true,
        frequency: 'daily',
        pillarFocus: weakestPillar.pillarId
      });
    }

    // Motivation pour les séries
    if (streakData.currentStreak >= 3) {
      smartReminders.push({
        id: 'streak_motivation',
        type: 'streak',
        title: `🔥 ${streakData.currentStreak} jours de suite ! Continuez !`,
        time: '19:00',
        enabled: true,
        frequency: 'daily'
      });
    }

    return smartReminders;
  }

  // Planifier les notifications
  static scheduleNotifications(): void {
    if ('serviceWorker' in navigator && 'Notification' in window) {
      const reminders = this.getEnabledReminders();
      
      reminders.forEach(reminder => {
        this.scheduleNotification(reminder);
      });
    }
  }

  private static scheduleNotification(reminder: any): void {
    const now = new Date();
    const [hours, minutes] = reminder.time.split(':').map(Number);
    
    const scheduledTime = new Date();
    scheduledTime.setHours(hours, minutes, 0, 0);
    
    // Si l'heure est passée, programmer pour demain
    if (scheduledTime <= now) {
      scheduledTime.setDate(scheduledTime.getDate() + 1);
    }

    const delay = scheduledTime.getTime() - now.getTime();
    
    setTimeout(() => {
      this.showNotification(reminder);
      
      // Reprogrammer pour le prochain cycle
      if (reminder.frequency === 'daily') {
        setTimeout(() => this.scheduleNotification(reminder), 24 * 60 * 60 * 1000);
      }
    }, delay);
  }

  private static showNotification(reminder: any): void {
    if (Notification.permission === 'granted') {
      new Notification(reminder.title, {
        icon: '/icon-192x192.png',
        badge: '/badge-72x72.png',
        tag: reminder.id,
        // renotify: true, // Commenté car non supporté dans tous les navigateurs
        // vibrate: [200, 100, 200] // Commenté car non supporté dans tous les navigateurs
      });
    }
  }

  static getEnabledReminders(): any[] {
    const saved = localStorage.getItem(this.REMINDER_KEY);
    const userReminders = saved ? JSON.parse(saved) : this.defaultReminders;
    const smartReminders = this.generateSmartReminders();
    
    return [...userReminders, ...smartReminders].filter(r => r.enabled);
  }

  static updateReminder(reminderId: string, updates: any): void {
    const reminders = this.getAllReminders();
    const index = reminders.findIndex(r => r.id === reminderId);
    
    if (index !== -1) {
      reminders[index] = { ...reminders[index], ...updates };
      localStorage.setItem(this.REMINDER_KEY, JSON.stringify(reminders));
    }
  }

  static getAllReminders(): any[] {
    const saved = localStorage.getItem(this.REMINDER_KEY);
    return saved ? JSON.parse(saved) : this.defaultReminders;
  }

  // Demander permission pour les notifications
  static async requestNotificationPermission(): Promise<boolean> {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    }
    return false;
  }
}
