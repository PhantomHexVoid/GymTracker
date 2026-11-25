# GymTracker — BETA

Version statique prête à publier sur GitHub Pages, sur le même principe que NutriTracker : **tous les fichiers nécessaires sont directement à la racine du dépôt**.

## Mise en ligne

1. Crée un dépôt GitHub nommé `GymTracker`.
2. Ouvre le dépôt puis **Add file → Upload files**.
3. Décompresse l'archive et glisse directement les fichiers (`index.html`, `app.js`, `style.css`, etc.) dans la zone d'envoi. Ne téléverse pas le ZIP lui-même et ne crée pas de dossier parent.
4. Valide avec **Commit changes**.
5. Va dans **Settings → Pages**, choisis `Deploy from a branch`, branche `main`, dossier `/ (root)`, puis **Save**.

Ton site sera normalement disponible à `https://phantomhexvoid.github.io/GymTracker/` après le déploiement.

## Fonctions

- Tableau de bord et statistiques
- Séances libres avec poids, séries et répétitions
- Bibliothèque d'exercices par groupe musculaire
- Ajout d'exercices personnalisés
- Historique des séances
- Suivi des performances par exercice
- Export et import JSON
- Sauvegarde locale dans le navigateur
- Interface sombre mobile-first et PWA installable

## Données

Les données sont conservées dans le stockage local du navigateur de l'appareil. Elles ne sont pas synchronisées entre plusieurs appareils. Pense à exporter régulièrement une sauvegarde JSON.
