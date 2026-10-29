# AGENTS.md — Ngenyangin Recipe Web App

Welcome to **Ngenyangin**, a web application for food and drink recipes featuring recipe publishing, email/password authentication, role-based access control (USER, REVIEWER, ADMIN), and a moderation workflow where recipes must be approved by a reviewer or admin before appearing in the public catalog.

## Tech Stack
- **Frontend**: React (Vite), TailwindCSS, React Router.
- **Backend**: NestJS (JavaScript / CommonJS), Prisma ORM.
- **Database**: MariaDB / MySQL.

## Project Structure
- `backend/`: NestJS backend application (`prisma/schema.prisma`, `src/`).
- `frontend/`: React Vite frontend application (`src/`).
- `docs/superpowers/`: Specs and implementation plans.

## Development & Commands

### Backend (`backend/`)
- Install dependencies: `npm install`
- Run migrations / prisma generate: `npx prisma generate` / `npx prisma db push`
- Run dev server: `npm run start:dev`

### Frontend (`frontend/`)
- Install dependencies: `npm install`
- Run dev server: `npm run dev`

## Git Commit Conventions (Mandatory)
All git commit messages MUST strictly follow the Conventional Commits format:
`<type>(<scope>): <description>`
- **Types**: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`.
- **Examples**: `feat(auth): add email password login`, `fix(recipe): restrict pending recipe view`.
- **Rule**: Never use unclear, casual, or unprofessional commit messages. Keep descriptions concise and in standard technical English.

## Architecture & Workflow Rules
1. **Authentication**: JWT-based authentication via `/auth/register` and `/auth/login`.
2. **Roles**: 
   - `USER`: Can register, login, create recipes (default status: `PENDING`).
   - `REVIEWER` / `ADMIN`: Can view pending recipes and moderate (`APPROVED` / `REJECTED`).
3. **Public Catalog**: `GET /recipes` returns *only* recipes with `APPROVED` status.
