# 🌐 Social Network Project

## 📖 Description

Ce projet est un réseau social simple où les utilisateurs peuvent s'inscrire, publier des articles, commenter les publications d'autres utilisateurs, et "liker" des articles. Le projet utilise un backend GraphQL avec Apollo Server, Prisma, et GraphQL Codegen, ainsi qu'un frontend en React avec Apollo Client.

## ✨ Fonctionnalités

- 🔒 Authentification des utilisateurs
- 📝 Création, lecture, mise à jour et suppression d'articles
- 💬 Ajout de commentaires et de likes aux articles
- 🔍 Filtrage des articles par auteur et par nombre de likes

## 📋 Prérequis

- 📦 Node.js (version 14.x ou supérieure)
- 📥 npm ou yarn
- 🗄️ PostgreSQL (ou un autre SGBD compatible avec Prisma)

## ⚙️ Installation

### Backend ⛓️

 ⏩ Installation rapide :
```sh
  cd ./social-network-graphql
 ```
Installer les dépendances du front & du back :
 ```sh
  npm install
 ```
Lancer le front & le back :
 ```sh
  npm start
 ```
---
1. Clonez le dépôt :
    ```sh
    git clone https://github.com/Chuaibe/GraphQLProjet/
    cd social-network/backend
    ```

2. Installez les dépendances :
    ```sh
    npm install
    ```

3. Configurez la base de données :
    - Créez un fichier `.env` à la racine du dossier `backend` et ajoutez-y vos informations  :
      ```env
      JWT_SECRET="your_jwt_secret"
      ```

4. Mettez à jour la base de données :
    ```sh
    npx prisma migrate dev --name init
    ```

5. Démarrez le serveur GraphQL :
    ```sh
    npm run start
    ```

### Frontend 📺

1. Ouvrez un nouveau terminal et naviguez vers le dossier `frontend` :
    ```sh
    cd ../frontend
    ```

2. Installez les dépendances :
    ```sh
    npm install
    ```

3. Démarrez l'application React :
    ```sh
    npm run start
    ```

## 🚀 Utilisation

- Accédez à `http://localhost:3000` dans votre navigateur pour utiliser l'application.
- Pour accéder à l'interface GraphQL Playground du backend, allez sur `http://localhost:4000`.

## 🗂️ Structure du Projet

- `backend/`: Contient le code source du backend GraphQL (Apollo Server, Prisma).
- `frontend/`: Contient le code source du frontend React (Apollo Client).

