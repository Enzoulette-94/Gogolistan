# Gogolistan API (Rails API-only)

Backend JSON partage pour les Personal Records.

## Stack

- Rails 8 API-only
- PostgreSQL
- rack-cors

## Setup

```bash
cd gogolistan-api
bundle install
cp .env.example .env
bin/rails db:create
bin/rails db:migrate
bin/rails db:seed
bin/rails s -p 3000
```

## Variable d'environnement

```bash
GOGOLISTAN_WRITE_PASSWORD=VIVELEROSE
```

Le fichier `.env` est charge automatiquement en local (via `dotenv-rails`).

## Regles d'acces

- Lecture PR + historique: publique
- Ecriture PR (create/update/destroy): mot de passe partage requis dans le header `X-GOGOLISTAN-WRITE-PASSWORD`

## Endpoints

### Personal Records

- `GET /people/:slug/personal_records`
- `GET /people/:slug/personal_records/history`
- `POST /people/:slug/personal_records` (write password requis)
- `PATCH /personal_records/:id` (write password requis)
- `DELETE /personal_records/:id` (write password requis)

## Exemples curl

Lire les PR:

```bash
curl http://localhost:3000/people/thomas/personal_records
```

Creer un PR:

```bash
curl -X POST http://localhost:3000/people/thomas/personal_records \
  -H "Content-Type: application/json" \
  -H "X-GOGOLISTAN-WRITE-PASSWORD: VIVELEROSE" \
  -d '{"date":"2026-05-08","note":"Sub 41 atteint","category":"course"}'
```

Modifier un PR:

```bash
curl -X PATCH http://localhost:3000/personal_records/1 \
  -H "Content-Type: application/json" \
  -H "X-GOGOLISTAN-WRITE-PASSWORD: VIVELEROSE" \
  -d '{"date":"2026-05-09","note":"Nouveau PR","category":"musculation"}'
```

Supprimer un PR:

```bash
curl -X DELETE http://localhost:3000/personal_records/1 \
  -H "X-GOGOLISTAN-WRITE-PASSWORD: VIVELEROSE"
```
