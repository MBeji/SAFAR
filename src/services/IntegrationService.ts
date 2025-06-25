// Service d'intégration avec APIs externes
// Interfaces pour les APIs externes
interface GoogleAPI {
  auth2: {
    getAuthInstance(): {
      isSignedIn: { get(): boolean };
      signIn(): Promise<void>;
    };
  };
  client: {
    fitness: any;
  };
}

interface CapacitorPlugins {
  Health: any;
}

interface CapacitorGlobal {
  Plugins: CapacitorPlugins;
}

// Extension des types globaux
declare global {
  interface Window {
    gapi?: GoogleAPI;
    Capacitor?: CapacitorGlobal;
  }
}

// Variables d'environnement pour Vite - utilisées dans les méthodes météo
const WEATHER_API_KEY = import.meta.env.VITE_WEATHER_API_KEY || '';

export class IntegrationService {
  
  // Intégration Google Fit (exemple)
  static async syncGoogleFit(): Promise<boolean> {
    try {
      // Vérifier si l'API est disponible
      if (!window.gapi) {
        console.warn('Google API non disponible');
        return false;
      }

      // Authentification Google
      const auth = window.gapi.auth2.getAuthInstance();
      if (!auth.isSignedIn.get()) {
        await auth.signIn();
      }

      // Récupérer les données d'activité
      const fitness = window.gapi.client.fitness;
      const endTime = Date.now();
      const startTime = endTime - (7 * 24 * 60 * 60 * 1000); // 7 jours

      const response = await fitness.users.dataset.aggregate({
        userId: 'me',
        requestBody: {
          aggregateBy: [
            { dataTypeName: 'com.google.step_count.delta' },
            { dataTypeName: 'com.google.active_minutes' }
          ],
          bucketByTime: { durationMillis: 86400000 }, // 1 jour
          startTimeMillis: startTime,
          endTimeMillis: endTime
        }
      });

      // Traiter et sauvegarder les données
      const buckets = response.result.bucket;
      const fitnessData = buckets.map((bucket: any) => ({
        date: new Date(parseInt(bucket.startTimeMillis)).toISOString().split('T')[0],
        steps: bucket.dataset[0].point[0]?.value[0]?.intVal || 0,
        activeMinutes: bucket.dataset[1].point[0]?.value[0]?.intVal || 0
      }));

      localStorage.setItem('fitness-integration', JSON.stringify(fitnessData));
      return true;
    } catch (error) {
      console.error('Erreur sync Google Fit:', error);
      return false;
    }
  }

  // Intégration Apple Health (via capacitor sur mobile)
  static async syncAppleHealth(): Promise<boolean> {
    try {
      // Vérifier si Capacitor Health est disponible
      if (!window.Capacitor || !window.Capacitor.Plugins.Health) {
        return false;
      }

      const { Health } = window.Capacitor.Plugins;
      
      // Demander permissions
      await Health.requestAuthorization({
        read: ['steps', 'activeMinutes', 'heartRate', 'sleep']
      });

      // Récupérer données des 7 derniers jours
      const endDate = new Date();
      const startDate = new Date(endDate.getTime() - 7 * 24 * 60 * 60 * 1000);

      const stepsData = await Health.queryHealthData({
        dataType: 'steps',
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString()
      });

      // Traiter et sauvegarder
      const healthData = stepsData.data.map((item: any) => ({
        date: item.date,
        steps: item.value,
        source: 'apple_health'
      }));

      localStorage.setItem('health-integration', JSON.stringify(healthData));
      return true;
    } catch (error) {
      console.error('Erreur sync Apple Health:', error);
      return false;
    }
  }

  // Calculer score sport basé sur données externes
  static calculateSportScoreFromIntegration(): number {
    const fitnessData = localStorage.getItem('fitness-integration');
    const healthData = localStorage.getItem('health-integration');
    
    let score = 0;
    const today = new Date().toISOString().split('T')[0];

    if (fitnessData) {
      const data = JSON.parse(fitnessData);
      const todayData = data.find((d: any) => d.date === today);
      
      if (todayData) {
        // Score basé sur les pas (10000 pas = 100%)
        const stepsScore = Math.min(100, (todayData.steps / 10000) * 100);
        // Score basé sur minutes actives (30 min = 100%)
        const activeScore = Math.min(100, (todayData.activeMinutes / 30) * 100);
        score = Math.round((stepsScore + activeScore) / 2);
      }
    }

    if (healthData && score === 0) {
      const data = JSON.parse(healthData);
      const todayData = data.find((d: any) => d.date === today);
      
      if (todayData) {
        score = Math.min(100, (todayData.steps / 10000) * 100);
      }
    }

    return score;
  }
  // Intégration météo pour conseils adaptatifs
  static async getWeatherBasedTips(): Promise<string[]> {
    try {
      // API météo simple (exemple avec OpenWeatherMap)
      if (!WEATHER_API_KEY) {
        console.warn('Clé API météo non configurée');
        return [];
      }

      const position = await this.getCurrentPosition();
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${position.coords.latitude}&lon=${position.coords.longitude}&appid=${WEATHER_API_KEY}&units=metric&lang=fr`
      );
      
      const weather = await response.json();
      const tips: string[] = [];

      // Conseils selon la météo
      if (weather.main.temp < 5) {
        tips.push('☃️ Il fait froid ! Pensez à vous hydrater même par temps froid');
        tips.push('🏠 Parfait pour une séance de sport en intérieur');
      } else if (weather.main.temp > 25) {
        tips.push('☀️ Canicule ! Buvez beaucoup d\'eau et évitez l\'effort en plein soleil');
        tips.push('🌊 Idéal pour des activités aquatiques');
      }

      if (weather.weather[0].main === 'Rain') {
        tips.push('🌧️ Jour de pluie parfait pour méditer ou lire');
        tips.push('☕ Moment idéal pour une boisson chaude réconfortante');
      }

      if (weather.weather[0].main === 'Clear') {
        tips.push('🌞 Belle journée ! Profitez-en pour sortir et faire le plein de vitamine D');
        tips.push('🚶 Parfait pour une marche en extérieur');
      }

      return tips;
    } catch (error) {
      console.error('Erreur météo:', error);
      return [];
    }
  }

  private static getCurrentPosition(): Promise<GeolocationPosition> {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject);
    });
  }

  // Auto-sync selon préférences utilisateur
  static async autoSync(): Promise<void> {
    const preferences = JSON.parse(localStorage.getItem('integration-preferences') || '{}');
    
    if (preferences.googleFit) {
      await this.syncGoogleFit();
    }
    
    if (preferences.appleHealth) {
      await this.syncAppleHealth();
    }
  }

  // Configurer les préférences d'intégration
  static setIntegrationPreferences(preferences: {
    googleFit?: boolean;
    appleHealth?: boolean;
    weatherTips?: boolean;
    autoSync?: boolean;
  }): void {
    localStorage.setItem('integration-preferences', JSON.stringify(preferences));
    
    if (preferences.autoSync) {
      // Programmer sync automatique toutes les 4 heures
      setInterval(() => {
        this.autoSync();
      }, 4 * 60 * 60 * 1000);
    }
  }
}
