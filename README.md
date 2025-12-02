# 📅 Todo List Personnalisée avec Calendrier

Une application de todo list moderne avec un calendrier style Google Calendar, utilisant des couleurs pastel (jaune, rose, bleu) et une base de données JSON.

## ✨ Fonctionnalités

- 📅 **Calendrier mensuel** : Vue mensuelle avec navigation entre les mois
- ✅ **Gestion des tâches** : Ajouter, modifier, supprimer et marquer comme terminées
- 🎨 **Couleurs pastel** : Choisissez entre jaune, rose et bleu pour vos tâches
- ⏰ **Heures optionnelles** : Ajoutez une heure à vos tâches
- 📋 **Historique des tâches pendantes** : Consultez les tâches non terminées des 7 derniers jours
- ⚠️ **Indicateur de retard** : Les tâches en retard sont marquées avec le nombre de jours de retard
- 💾 **Base de données JSON** : Toutes les tâches et l'historique sont sauvegardés dans `tasks.json`
- 📱 **Design responsive** : Fonctionne sur ordinateur et mobile

## 🚀 Installation et Utilisation

### Prérequis
- Node.js installé sur votre système

### Démarrage

1. **Installer les dépendances** (si nécessaire) :
   ```bash
   npm install
   ```

2. **Démarrer le serveur** :
   ```bash
   npm start
   ```
   ou
   ```bash
   node server.js
   ```

3. **Ouvrir dans le navigateur** :
   - Allez sur `http://localhost:3000`
   - Le fichier `tasks.json` sera créé automatiquement

### Utilisation

1. Cliquez sur une date dans le calendrier pour voir les tâches de ce jour
2. Cliquez sur "+ Ajouter" pour créer une nouvelle tâche
3. Cliquez sur une tâche existante pour la modifier ou la supprimer
4. Toutes les modifications sont automatiquement sauvegardées dans `tasks.json`

## 🎨 Couleurs

- **Jaune pastel** : Pour les tâches importantes ou urgentes
- **Rose pastel** : Pour les tâches personnelles
- **Bleu pastel** : Pour les tâches professionnelles

## 📁 Structure des données

Les données sont stockées dans `tasks.json` avec la structure suivante :

```json
{
  "tasks": [
    {
      "id": "identifiant_unique",
      "title": "Titre de la tâche",
      "date": "2024-01-15",
      "time": "14:30",
      "description": "Description optionnelle",
      "color": "yellow|pink|blue",
      "completed": false,
      "createdAt": "2024-01-10T10:00:00.000Z"
    }
  ],
  "history": []
}
```

Le champ `history` est automatiquement généré par le serveur à partir des tâches non terminées des 30 derniers jours.

## 🔧 API Endpoints

Le serveur expose les endpoints suivants :

- `GET /api/tasks` - Récupérer toutes les tâches
- `POST /api/tasks` - Créer ou mettre à jour une tâche
- `PUT /api/tasks/:id` - Mettre à jour une tâche spécifique
- `DELETE /api/tasks/:id` - Supprimer une tâche

## 💡 Astuces

- Cliquez sur "Aujourd'hui" pour revenir rapidement à la date du jour
- Les points colorés sur le calendrier indiquent les jours avec des tâches
- Vous pouvez marquer une tâche comme terminée sans la supprimer
- La section "Tâches Pendantes" affiche automatiquement les tâches non terminées des 7 derniers jours
- Cliquez sur une tâche dans l'historique pour aller directement à sa date dans le calendrier
- Les tâches en retard sont marquées avec un badge indiquant le nombre de jours de retard
- Le fichier `tasks.json` est sauvegardé automatiquement à chaque modification

