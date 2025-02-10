# Projet de Gestion des Équipes et Personnages

## 📌 Description
Ce projet est une application web permettant de gérer des équipes et des personnages.
Les équipes doivent contenir **exactement 5 personnages**, avec des rôles spécifiques :
- **1 Tank**
- **1 Soigneur**
- **3 Dégâts**
- Un personnage ne peut appartenir qu'à une seule équipe.

L'application est composée d'un **backend en Node.js avec PostgreSQL** et d'un **frontend en React.js**.

## 🚀 Fonctionnalités
### 🔹 Backend (API REST en Node.js)
- **Gestion des personnages** : Ajouter, modifier, supprimer et récupérer les personnages.
- **Gestion des équipes** : Ajouter, modifier, supprimer et récupérer les équipes avec leurs personnages associés.
- **Validation stricte des équipes** : Une équipe doit respecter les rôles définis.
- **Récupération des personnages disponibles** : Liste des personnages qui ne sont pas encore assignés à une équipe.

### 🔹 Frontend (React.js)
- **Liste des équipes** avec leurs personnages et boutons d’édition/suppression.
- **Liste des personnages** boutons d’édition/suppression et possibilité de les assigner aux équipes.
- **Ajout, modification et suppression d’une équipe ou d'un personnage** via un formulaire interactif.

## 🛠️ Technologies utilisées
### 🔹 Backend :
- **Node.js** avec **Express.js**
- **PostgreSQL** comme base de données
- **Jest** pour les tests unitaires

### 🔹 Frontend :
- **React.js**
- **React Router** pour la navigation
- **Tailwind CSS** pour le style

## 🔧 Installation et utilisation
### 📌 Prérequis
- **Node.js** (v16 ou plus)
- **PostgreSQL** installé et configuré

### 📌 Installation
1. **Cloner le projet** :
   ```sh
   git clone https://github.com/votre-repo.git
   cd votre-repo
   ```

2. **Installation des dépendances** :
   ```sh
   cd backend
   npm install
   cd ../frontend
   npm install
   ```

3. **Configuration de la base de données** :
   - Créez une base de données PostgreSQL
   - Configurez `backend/config/db.js` avec vos identifiants
   - Par défaut, les rôles et classes sont déjà ajoutées

4. **Lancer le backend** :
   ```sh
   cd backend
   npm start
   ```

5. **Lancer le frontend** :
   ```sh
   cd frontend
   npm start
   ```

## ✅ Tests
Pour exécuter les tests Jest sur le backend :
```sh
cd backend
npm test
```
