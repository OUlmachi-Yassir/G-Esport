# Gestion des Inscriptions Sportives

## Description
Cette application permet à une organisation sportive de gérer facilement les événements sportifs et les inscriptions des participants. L'objectif est de simplifier le processus d'inscription tout en offrant des outils robustes pour l'administration des événements.

---

## Fonctionnalités

### Organisateur
- **Gestion des événements sportifs** : Créer, modifier et supprimer des événements.
- **Gestion des inscriptions** : Ajouter ou modifier les informations des participants inscrits.
- **Génération de liste des inscrits** : Générer et imprimer une liste des participants pour chaque événement.

---

## Technologies Utilisées

### Back-end
- **Node.js** avec **Express.js** ou **NestJS**
- **MongoDB** comme base de données
- **Mongoose** pour gérer les interactions avec MongoDB
- **JSON Web Token (JWT)** pour l'authentification et la sécurité
- **Tests unitaires** pour chaque contrôleur du back-end

### Front-end
- **React.js**
  - Utilisation de **hooks** : `useState`, `useEffect`
  - Gestion des états globaux avec **Redux** ou **Context API**
  - Protection des routes avec des **Nested Routes**

### Déploiement
- **Docker**
  - Création d'images Docker pour le front-end et le back-end
  - Mise en réseau des conteneurs via Docker

---

## Installation

### Prérequis
- Node.js (version 16 ou supérieure)
- MongoDB
- Docker et Docker Compose

### Étapes
1. **Clonez le dépôt** :
   ```bash
   git clone https://github.com/OUlmachi-Yassir/G-Esport.git
   cd BACKEND at cd FRONTEND

2. **Installer les dépendances** :
    #Back-end :

        cd BACKEND
        npm install

    #Front-end :
        cd FRONTEND
        npm start

3. **Tests** :

    Exécuter les tests unitaires :
        cd BACKEND
        npm test

4. **Déploiement** :

    -Construction des images Docker:

        ```bash
        docker-compose build
    
    -Lancer les conteneurs :
        ```bash
        docker-compose up






