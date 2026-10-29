# Ngenyangin Web App Design Document

## Intent and Why
Ngenyangin is a web-based recipe directory platform for food and drinks. Users can share and publish their own recipes. To maintain quality and safety, published recipes must undergo a moderation workflow where they are reviewed and approved/rejected by a Reviewer or Admin before becoming publicly visible. 

## Goals
- **User Authentication:** Secure email/password authentication with role-based access control (RBAC: User, Reviewer, Admin).
- **Recipe Management:** Users can create, edit, delete, and submit recipes with ingredients, steps, category, and image.
- **Moderation Workflow:** Recipes submitted by users are set to `PENDING` status. Reviewers or Admins can review pending recipes and set them to `APPROVED` or `REJECTED`. Only `APPROVED` recipes appear in the public catalog.
- **Public Catalog & Search:** Visitors and users can browse, search, and filter approved recipes by category, ingredients, or title.

## Non-Goals (Phase 1)
- OAuth / SSO login (deferred to Phase 2 as requested; Phase 1 uses email/password).
- Advanced social features like following users, comments, or ratings (can be added later).

## Tech Stack & Approaches
- **Frontend:** React (Vite) + TailwindCSS for a responsive, modern UI.
- **Backend:** NestJS (written in JavaScript, using CommonJS/ES modules as requested, without TypeScript types/compilation overhead).
- **Database & ORM:** MariaDB + Prisma ORM for clean database schema management and migrations.

## Data Models (Prisma Schema)
1. **User**
   - `id`: Int / UUID
   - `email`: String (unique)
   - `password`: String (hashed)
   - `name`: String
   - `role`: Enum (`USER`, `REVIEWER`, `ADMIN`)
   - `createdAt`, `updatedAt`

2. **Recipe**
   - `id`: Int / UUID
   - `title`: String
   - `description`: String
   - `ingredients`: Text / JSON
   - `instructions`: Text / JSON
   - `category`: String (Food, Drink, Dessert, etc.)
   - `imageUrl`: String (optional)
   - `status`: Enum (`PENDING`, `APPROVED`, `REJECTED`)
   - `authorId`: Foreign Key to User
   - `createdAt`, `updatedAt`
