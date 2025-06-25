# Copilot Instructions pour l'Application Bien-être

<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

## Contexte du Projet
Cette application React TypeScript calcule et suit le bien-être global d'un utilisateur basé sur 6 piliers :
1. Alimentation
2. Sport 
3. Sommeil
4. Stress/équilibre
5. Spiritualité
6. Social

## Architecture et Technologies
- **Frontend**: React 18 + TypeScript + Vite
- **UI/UX**: Design moderne avec couleurs douces et pastels
- **Graphiques**: Recharts pour les visualisations
- **Icônes**: Lucide React
- **Stockage**: LocalStorage pour la persistance

## Structure de Données
- Chaque pilier contient plusieurs questions notées de 0 à 100%
- Score global calculé comme moyenne pondérée des 6 piliers
- Données sauvegardées quotidiennement avec horodatage

## Conventions de Code
- Utiliser TypeScript strict
- Composants fonctionnels avec hooks
- Interfaces pour tous les types de données
- Nommage en français pour l'UI, en anglais pour le code
- CSS Modules ou styled-components pour le styling

## Fonctionnalités Clés
- Interface intuitive avec sliders pour noter chaque critère
- Calcul automatique des scores par pilier et global
- Visualisations graphiques des progrès
- Sauvegarde locale des données
- Interface responsive mobile-first
