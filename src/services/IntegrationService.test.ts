// Version simplifiée de IntegrationService pour les tests
export class IntegrationService {
  static async connectGoogleFit(): Promise<any> {
    console.log('Google Fit: Service non disponible en mode test');
    return null;
  }

  static async connectAppleHealth(): Promise<any> {
    console.log('Apple Health: Service non disponible en mode test');
    return null;
  }

  static async getWeatherData(): Promise<any> {
    console.log('Weather API: Service non disponible en mode test');
    return {
      temperature: 22,
      condition: 'sunny',
      humidity: 65,
      description: 'Ensoleillé'
    };
  }

  static async syncHealthData(): Promise<void> {
    console.log('Sync: Service non disponible en mode test');
  }
}
