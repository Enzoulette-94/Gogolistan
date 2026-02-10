# GOGOLISTAN

Application React (Vite) + API Rails (PostgreSQL) pour partager des Personal Records.

## Architecture

- Frontend: `./` (React + Vite)
- Backend: `gogolistan-api/` (Rails API-only)

## 1) Lancer le backend

```bash
cd gogolistan-api
bundle install
cp .env.example .env
bin/rails db:create
bin/rails db:migrate
bin/rails db:seed
bin/rails s -p 3000
```

## 2) Lancer le frontend

Depuis la racine:

```bash
npm install
cp .env.example .env
npm run dev
```

## Variables d'environnement

Frontend (`.env`):

```bash
VITE_API_URL=http://localhost:3000
```

Frontend production (exemple):

```bash
VITE_API_URL=https://api.ton-domaine.com
```

Backend (`gogolistan-api/.env`):

```bash
GOGOLISTAN_WRITE_PASSWORD=VIVELEROSE
CORS_ALLOWED_ORIGINS=http://localhost:5173
```

`dotenv-rails` charge automatiquement ce fichier `.env` quand tu lances Rails en local.

## Deploy - Point 1 (VITE_API_URL)

Avant de build/deployer le frontend, definis `VITE_API_URL` avec l'URL publique de ton API Rails.

Exemple local de verification:

```bash
VITE_API_URL=https://api.ton-domaine.com npm run build
```

Si le frontend est heberge sur une plateforme (Vercel/Netlify/Render), ajoute la variable `VITE_API_URL` dans les variables d'environnement du projet frontend, puis relance un deploy.

## Deploy sur Render (recommande)

Le repo contient un blueprint `render.yaml` (backend Rails + frontend Vite + PostgreSQL).

1. Sur Render, choisis "New +" -> "Blueprint" et connecte ce repo.
2. Renseigne les variables requises:
   - `SECRET_KEY_BASE` (backend)
   - `GOGOLISTAN_WRITE_PASSWORD` (backend)
   - `CORS_ALLOWED_ORIGINS` = URL publique du frontend Render
   - `VITE_API_URL` = URL publique du backend Render
3. Lance le deploy.

## Fonctionnalites

- Lecture publique des PR et de l'historique
- Ajout / modification / suppression des PR protegees par mot de passe partage
- Historique versionne (create/update/destroy)
