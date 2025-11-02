#  Documentation TICKETER

##  Vue d'ensemble

TICKETER est une plateforme web de réservation de billets de concerts permettant aux utilisateurs de découvrir, rechercher et réserver des billets pour leurs artistes préférés. Le projet utilise **NestJS** (backend), **MongoDB** (base de données) et **Handlebars** (templating frontend).



- Découvrir et rechercher des concerts
- Réserver des billets en ligne
- Gérer leurs favoris
- Recevoir des notifications

Les administrateurs peuvent :
- Gérer les concerts
- Gérer les artistes
- Gérer les utilisateurs
- Voir les statistiques

---

## 🛠️ Technologies {#technologies}

### Backend
```
NestJS 10.x              - Framework Node.js
TypeScript 5.x           - Langage de programmation
MongoDB 5.x              - Base de données NoSQL
Mongoose 7.x             - ORM MongoDB
JWT (jsonwebtoken)       - Authentification
bcryptjs 2.4.x           - Hash de passwords
Nodemailer 6.x           - Envoi d'emails
```

### Frontend
```
Handlebars 4.x           - Templating engine
Tailwind CSS 3.x         - Framework CSS
Font Awesome 6.x         - Icônes
Fetch API                - Requêtes HTTP
```

### Infrastructure
```
Node.js 18+              - Runtime JavaScript
npm 9+                   - Gestionnaire de paquets
Docker (optionnel)       - Containerization
Git                      - Versionning
```

### Outils Développement
```
Postman                  - Test des APIs
MongoDB Compass          - Gestion MongoDB
VS Code                  - Éditeur de code
```

---

## ✨ Fonctionnalités {#fonctionnalités}

### 👤 Utilisateur Standard

#### Authentification
- Inscription avec email
- Connexion avec email/password
- Vérification d'email
- Récupération de password
- Déconnexion
- Session sécurisée (JWT)

#### Exploration
- Parcourir les concerts
- Filtrer par genre, date, lieu
- Voir les détails d'un concert
- Voir les artistes disponibles
- Voir les informations de l'artiste

#### Réservation
- Sélectionner des places
- Ajouter au panier
- Voir le résumé de la réservation
- Recevoir une confirmation par email

#### Gestion de Compte
- Voir son profil
- Modifier ses informations
- Changer le mot de passe
- Voir l'historique de réservations
- Ajouter/Retirer des favoris
- Supprimer son compte

### 👨‍💼 Administrateur

#### Gestion des Utilisateurs
- Lister tous les utilisateurs
- Créer un utilisateur
- Modifier un utilisateur
- Promouvoir/Rétrograder un admin
- Supprimer un utilisateur
- Voir les statistiques utilisateurs

#### Gestion des Concerts
- Créer un concert
- Lister les concerts
- Modifier un concert
- Supprimer un concert
- Voir les places disponibles
- Voir les statistiques de ventes

#### Gestion des Artistes
- Créer un artiste
- Lister les artistes
- Modifier un artiste
- Supprimer un artiste
- Voir les concerts d'un artiste

#### Dashboard
- Statistiques globales
- Graphiques de ventes
- Derniers concerts
- Derniers utilisateurs

---

## 📊 Diagramme de Classes {#diagramme-de-classes}

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER (Utilisateur)                      │
├─────────────────────────────────────────────────────────────────┤
│ Propriétés:                                                     │
│  - _id: ObjectId                                                │
│  - username: string                                             │
│  - email: string                                                │
│  - password: string (hashé)                                     │
│  - isAdmin: boolean                                             │
│  - isVerified: boolean                                          │
│  - createdAt: Date                                              │
│  - updatedAt: Date                                              │
├─────────────────────────────────────────────────────────────────┤
│ Méthodes:                                                       │
│  + create(data): User                                           │
│  + findAll(): User[]                                            │
│  + findById(id): User                                           │
│  + update(id, data): User                                       │
│  + delete(id): void                                             │
│  + updateRole(id, isAdmin): User                                │
│  + updatePassword(id, hash): void                               │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                      CONCERT (Concert)                          │
├─────────────────────────────────────────────────────────────────┤
│ Propriétés:                                                     │
│  - _id: ObjectId                                                │
│  - title: string                                                │
│  - image: string (URL)                                          │
│  - date: Date                                                   │
│  - hour: string (HH:MM)                                         │
│  - genre: string                                                │
│  - location: string                                             │
│  - price: number                                                │
│  - group: ObjectId → GROUP                                      │
│  - totalSeats: number                                           │
│  - availableSeats: number                                       │
│  - createdAt: Date                                              │
├─────────────────────────────────────────────────────────────────┤
│ Méthodes:                                                       │
│  + create(data): Concert                                        │
│  + findAll(): Concert[]                                         │
│  + findOne(id): Concert                                         │
│  + findWithFilters(filters): Concert[]                          │
│  + update(id, data): Concert                                    │
│  + delete(id): void                                             │
│  + getUniqueGenres(): string[]                                  │
│  + reserveSeat(seatId): boolean                                 │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                    GROUP (Artiste/Groupe)                       │
├─────────────────────────────────────────────────────────────────┤
│ Propriétés:                                                     │
│  - _id: ObjectId                                                │
│  - name: string                                                 │
│  - image: string (URL)                                          │
│  - genre: string                                                │
│  - bio: string                                                  │
│  - createdAt: Date                                              │
├─────────────────────────────────────────────────────────────────┤
│ Méthodes:                                                       │
│  + create(data): Group                                          │
│  + findAll(): Group[]                                           │
│  + findById(id): Group                                          │
│  + update(id, data): Group                                      │
│  + delete(id): void                                             │
│  + getConcerts(id): Concert[]                                   │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                  RESERVATION (Réservation)                      │
├─────────────────────────────────────────────────────────────────┤
│ Propriétés:                                                     │
│  - _id: ObjectId                                                │
│  - user: ObjectId → USER                                        │
│  - concert: ObjectId → CONCERT                                  │
│  - seats: Seat[]                                                │
│  - totalPrice: number                                           │
│  - status: enum (pending|confirmed|cancelled)                   │
│  - createdAt: Date                                              │
├─────────────────────────────────────────────────────────────────┤
│ Méthodes:                                                       │
│  + create(data): Reservation                                    │
│  + findByUser(userId): Reservation[]                            │
│  + confirm(id): Reservation                                     │
│  + cancel(id): void                                             │
│  + getTotalPrice(): number                                      │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                    FAVORITE (Favori)                            │
├─────────────────────────────────────────────────────────────────┤
│ Propriétés:                                                     │
│  - _id: ObjectId                                                │
│  - user: ObjectId → USER                                        │
│  - group: ObjectId → GROUP                                      │
│  - createdAt: Date                                              │
├─────────────────────────────────────────────────────────────────┤
│ Méthodes:                                                       │
│  + addFavorite(userId, groupId): Favorite                       │
│  + removeFavorite(userId, groupId): void                        │
│  + getUserFavorites(userId): Group[]                            │
│  + isFavorited(userId, groupId): boolean                        │
└─────────────────────────────────────────────────────────────────┘

            ┌───────────────────────────────────────┐
            │          Relations                    │
            ├───────────────────────────────────────┤
            │ USER 1 ──── N RESERVATION             │
            │ USER 1 ──── N FAVORITE                │
            │ CONCERT 1 ──── N RESERVATION          │
            │ GROUP 1 ──── N CONCERT                │
            │ GROUP 1 ──── N FAVORITE               │
            └───────────────────────────────────────┘
```

---
---

## Architecture du Projet

```
ticketer/
├── src/
│   ├── auth/              # Authentification & autorisation
│   │   ├── auth.guard.ts
│   │   ├── auth-admin.guard.ts
│   │   ├── auth.service.ts
│   │   └── auth.controller.ts
│   ├── users/             # Gestion des utilisateurs
│   │   ├── users.service.ts
│   │   ├── users.controller.ts
│   │   └── entities/user.entity.ts
│   ├── concerts/          # Gestion des concerts
│   │   ├── concerts.service.ts
│   │   ├── concerts.controller.ts
│   │   └── concert.schema.ts
│   ├── groups/            # Gestion des artistes/groupes
│   │   ├── groups.service.ts
│   │   ├── groups.controller.ts
│   │   └── group.schema.ts
│   ├── mail/              # Service d'email
│   │   └── mail.service.ts
│   ├── favorites/         # Gestion des favoris
│   └── app.module.ts
├── views/                 # Templates Handlebars
│   ├── layouts/
│   ├── auth/
│   ├── user/
│   ├── admin/
│   └── index.hbs
└── main.ts
```

---

##  Authentification & Autorisation

### AuthGuard
- Vérifie que l'utilisateur est authentifié via JWT
- Bloque l'accès aux routes protégées sans token
- Attache les infos utilisateur à `req.user`

### AuthAdminGuard
- Vérifie que l'utilisateur est authentifié **ET** admin
- Bloque l'accès aux pages d'administration pour les non-admins
- Retourne `ForbiddenException` (403) si non autorisé

### Login Flow
```typescript
POST /login
├── Valide les credentials
├── Génère un JWT token
├── Stocke le token en cookie httpOnly
└── Retourne user info + token
```

### Redirect après login
- Admin → `/admin/dashboard`
- User → `/dashboard`

---

## 👥 Gestion des Utilisateurs

### Routes Utilisateurs

| Méthode | Route | Description | Guard |
|---------|-------|-------------|-------|
| POST | `/users` | Créer un utilisateur | AuthAdminGuard |
| GET | `/users` | Lister tous les utilisateurs | AuthAdminGuard |
| GET | `/users/:id` | Récupérer un utilisateur | AuthAdminGuard |
| PATCH | `/users/:id` | Mettre à jour un utilisateur | AuthAdminGuard |
| DELETE | `/users/:id` | Supprimer un utilisateur | AuthAdminGuard |
| PATCH | `/users/:id/promote` | Promouvoir en admin | AuthAdminGuard |
| PATCH | `/users/:id/demote` | Rétrograder en user | AuthAdminGuard |
| GET | `/users/accounts` | Page gestion des comptes | AuthAdminGuard |

### Propriétés User
```typescript
{
  _id: ObjectId,
  username: string,
  email: string,
  password: string (hashé),
  isAdmin: boolean,
  createdAt: Date,
  updatedAt: Date
}
```

---

##  Gestion des Concerts

### Routes Concerts

| Méthode | Route | Description |
|---------|-------|-------------|
| GET | `/concerts/view` | Afficher tous les concerts |
| GET | `/concerts/view/:id` | Afficher les détails d'un concert |
| POST | `/concerts` | Créer un concert (Admin) |
| PATCH | `/concerts/:id` | Mettre à jour un concert (Admin) |
| DELETE | `/concerts/:id` | Supprimer un concert (Admin) |

### Propriétés Concert
```typescript
{
  _id: ObjectId,
  title: string,
  image: string (URL),
  date: Date,
  hour: string,
  genre: string,
  location: string,
  price: number,
  group: ObjectId (référence Group),
  availableSeats: number,
  totalSeats: number,
  createdAt: Date
}
```

### Filtrage des Concerts
```typescript
GET /concerts/view?genre=Pop&date=2024-01-15&group=abc123
```

---

## Gestion des Artistes/Groupes

### Routes Groupes

| Méthode | Route | Description |
|---------|-------|-------------|
| GET | `/groups/singles` | Lister tous les artistes |
| GET | `/groups/admin` | Page gestion des groupes (Admin) |
| POST | `/groups` | Créer un artiste (Admin) |
| PATCH | `/groups/:id` | Mettre à jour un artiste (Admin) |
| DELETE | `/groups/:id` | Supprimer un artiste (Admin) |

### Propriétés Group
```typescript
{
  _id: ObjectId,
  name: string,
  image: string (URL),
  genre: string,
  description: string,
  createdAt: Date
}
```

---


## Système de Favoris




## 📱 Endpoints API

### Authentication
```
POST   /login           - Connexion
POST   /register        - Inscription
POST   /logout          - Déconnexion
GET    /auth/check      - Vérifier authentification
```

### Concerts
```
GET    /concerts/view        - Tous les concerts
GET    /concerts/view/:id    - Détails concert
POST   /concerts             - Créer concert (Admin)
PATCH  /concerts/:id         - Modifier concert (Admin)
DELETE /concerts/:id         - Supprimer concert (Admin)
```

### Utilisateurs
```
GET    /users/accounts       - Liste utilisateurs (Admin)
GET    /users/:id            - Info utilisateur (Admin)
POST   /users                - Créer utilisateur (Admin)
PATCH  /users/:id            - Modifier utilisateur (Admin)
DELETE /users/:id            - Supprimer utilisateur (Admin)
PATCH  /users/:id/promote    - Promouvoir admin (Admin)
PATCH  /users/:id/demote     - Rétrograder user (Admin)
```

### Groupes
```
GET    /groups/singles       - Tous les artistes
POST   /groups               - Créer artiste (Admin)
PATCH  /groups/:id           - Modifier artiste (Admin)
DELETE /groups/:id           - Supprimer artiste (Admin)
```


## 🧪 Workflow Utilisateur

### 1️⃣ Inscription
```
Utilisateur remplit formulaire
      ↓
Backend hash le password
      ↓
Email de vérification envoyé
      ↓
Utilisateur clique le lien
      ↓
Compte activé
```

### 2️⃣ Réservation Concert
```
Utilisateur explore les concerts
      ↓
Filtre par genre/date/lieu
      ↓
Clique sur "Réserver"
      ↓
Sélectionne ses places
      ↓
Effectue le paiement
      ↓
Reçoit son billet par email
```

### 3️⃣ Admin Panel
```
Admin se connecte
      ↓
Redirection vers /admin/dashboard
      ↓
Peut gérer : concerts, artistes, utilisateurs
      ↓
Toutes les actions sont protégées par AuthAdminGuard
```





## 📚 Dépendances Principales

| Package | Version | Utilisation |
|---------|---------|------------|
| @nestjs/core | ^10 | Framework principal |
| @nestjs/jwt | ^10 | Authentification JWT |
| @nestjs/mongoose | ^10 | ORM MongoDB |
| bcryptjs | ^2.4 | Hash de passwords |
| mongoose | ^7 | Schéma MongoDB |
| nodemailer | ^6 | Envoi d'emails |






## 🏗️ Architecture {#architecture}

### Architecture en Couches

```
┌────────────────────────────────────────────────┐
│           PRESENTATION LAYER                  │
│  (Handlebars Views + Fetch API)               │
└────────────────────────────────────────────────┘
                     ↕
┌────────────────────────────────────────────────┐
│           CONTROLLER LAYER                     │
│  (Route Handling + Request Validation)        │
│  - AuthController                             │
│  - UsersController                            │
│  - ConcertsController                         │
│  - GroupsController                           │
└────────────────────────────────────────────────┘
                     ↕
┌────────────────────────────────────────────────┐
│           SERVICE LAYER                        │
│  (Business Logic)                             │
│  - AuthService                                │
│  - UsersService                               │
│  - ConcertsService                            │
│  - GroupsService                              │
│  - MailService                                │
│  - FavoritesService                           │
└────────────────────────────────────────────────┘
                     ↕
┌────────────────────────────────────────────────┐
│           DATA ACCESS LAYER                    │
│  (Mongoose Models + Database)                 │
│  - User Model                                 │
│  - Concert Model                              │
│  - Group Model                                │
│  - Reservation Model                          │
│  - Favorite Model                             │
└────────────────────────────────────────────────┘
                     ↕
┌────────────────────────────────────────────────┐
│           DATABASE LAYER                       │
│  MongoDB Collections                          │
└────────────────────────────────────────────────┘
```

### Flux d'une Requête

```
1. Utilisateur accède à /
   ↓
2. Route au @ Get('/')
   ↓
3. AuthController.getHomePage()
   ↓
4. Appel ConcertsService.findAll()
   ↓
5. Query MongoDB
   ↓
6. Retour des données
   ↓
7. Rendu du template index.hbs
   ↓
8. Réponse HTML au navigateur
```

---

## 🚀 Installation {#installation}

### Prérequis
```bash
- Node.js 18+ (https://nodejs.org)
- MongoDB 5+ (https://www.mongodb.com)
- Git (https://git-scm.com)
- npm ou yarn
```

### Étapes

**1. Cloner le repository**
```bash
git clone <repo-url>
cd ticketer
```

**2. Installer les dépendances**
```bash
npm install
```

**3. Configuration (.env)**
```bash
cp .env.example .env
```

Remplir les variables :
```
# Database
MONGODB_URI=mongodb://localhost:27017/ticketer

# JWT
JWT_SECRET=your_super_secret_key_here_min_32_chars
JWT_EXPIRES_IN=24h

# Mail (Gmail)
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USER=your_email@gmail.com
MAIL_PASS=your_app_password

# Application
NODE_ENV=development
PORT=3000
APP_URL=http://localhost:3000
