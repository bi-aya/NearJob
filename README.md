# NearJob - Plateforme de mise en relation locale

NearJob est une application mobile qui connecte instantanément les freelances, les stagiaires et les recruteurs dans une même zone géographique.

## 🛠️ Stack Technique

* **Frontend :** React Native (Expo), Redux Toolkit, Axios.
* **Backend :** Node.js, Express, PostgreSQL, TypeORM.
* **Sécurité & Validation :** JWT (JSON Web Tokens), `class-validator`.

## ⚙️ Installation en local

### 1. Backend
\`\`\`bash
cd backend
npm install
# Créez un fichier .env avec vos identifiants de base de données
npm run dev
\`\`\`

### 2. Frontend
\`\`\`bash
cd frontend
npm install
# Assurez-vous que l'IP de votre machine correspond dans api/config.js
npx expo start -c
\`\`\`

## ✨ Fonctionnalités Principales
* Authentification sécurisée (Freelance / Recruteur).
* Publication d'offres et système de candidatures dynamique.
* Push notifications.
