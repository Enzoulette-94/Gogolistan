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

Backend (`gogolistan-api/.env`):

```bash
GOGOLISTAN_WRITE_PASSWORD=VIVELEROSE
```

`dotenv-rails` charge automatiquement ce fichier `.env` quand tu lances Rails en local.

## Fonctionnalites

- Lecture publique des PR et de l'historique
- Ajout / modification / suppression des PR protegees par mot de passe partage
- Historique versionne (create/update/destroy)
