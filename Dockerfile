# Image Node.js officielle
FROM node:16

# Répertoire de travail
WORKDIR /app

# Copier les fichiers package.json pour installer les dépendances
COPY BACKEND/package*.json ./

# Installer les dépendances
RUN npm install

# Copier les fichiers du backend
COPY BACKEND/ .

# Exposer le port utilisé par l'application
EXPOSE 3000

# Commande de démarrage
CMD ["node", "server.js"]
