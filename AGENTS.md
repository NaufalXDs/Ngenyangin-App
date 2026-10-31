# AGENTS.md — Ngenyangin Recipe Web App

Welcome to **Ngenyangin**, a web application for food and drink recipes featuring recipe publishing, email/password authentication, role-based access control (USER, REVIEWER, ADMIN), and a moderation workflow where recipes must be approved by a reviewer or admin before appearing in the public catalog.

## Tech Stack
- **Frontend**: React (Vite), TailwindCSS, React Router.
- **Backend**: NestJS (JavaScript / CommonJS), Prisma ORM v5.
- **Database**: MariaDB.

## Project Structure
- `backend/`: NestJS backend application (`prisma/schema.prisma`, `src/`).
- `frontend/`: React Vite frontend application (`src/`).
- `docs/superpowers/`: Specs and implementation plans.

## Admin Dashboard Rules
- All `/admin/*` endpoints require `ADMIN` (`JwtAuthGuard` + `RolesGuard` + `@Roles('ADMIN')`).
- User management: admins can list, change role, deactivate/reactivate, and delete users.
  - An admin cannot change the role of, deactivate, or delete themselves.
  - The system must always keep at least one active ADMIN.
  - Deactivated users cannot log in; guards must check current user status/role from the database, not only the JWT payload.
- Recipe management: admins can list all recipes (any status), edit, delete, and change status.
  - Deleting a recipe is a soft delete (`deletedAt`); public and moderation queries must exclude deleted recipes.
  - Rejecting a recipe requires a `rejectionReason`.
- Every destructive admin action (role change, deactivate, delete) must write an `AuditLog` entry.
- Frontend admin routes live in `frontend/src/pages/admin/`; frontend role checks are UX only.
- Read `docs/superpowers/<admin-dashboard-spec>.md` before working on admin features.

## Development & Commands

### Backend (`backend/`)
- Install dependencies: `npm install`
- Run migrations / prisma generate: `npm run prisma:migrate` / `npm run prisma:generate`
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
- **Workflow Rule**: The agent must NOT run `git commit` or `git push` directly. Instead, the agent provides the exact files to add and the suggested Conventional Commit message for the user to review and execute themselves.

## Architecture & Workflow Rules
1. **Authentication**: JWT-based authentication via `/auth/register` and `/auth/login`.
2. **Roles**: 
   - `USER`: Can register, login, create recipes (default status: `PENDING`).
   - `REVIEWER` / `ADMIN`: Can view pending recipes and moderate (`APPROVED` / `REJECTED`).
3. **Public Catalog**: `GET /recipes` returns *only* recipes with `APPROVED` status.

## Code Style & Constraints
- Backend is **JavaScript with ES Modules**: use `import`/`export`; do NOT use `require`/`module.exports` and no TypeScript syntax.
- `backend/package.json` uses `"type": "module"`: local imports must include the `.js` extension (e.g. `./auth.service.js`).
- NestJS decorators are compiled via <Babel/SWC> (see `<config file>`); do not remove or change that config without asking.
- Controllers stay thin; business logic lives in services; DB access only via `PrismaService`.
- Validate all input with DTOs + `ValidationPipe({ whitelist: true })`.
- Enforce authorization with `JwtAuthGuard` + `RolesGuard` + `@Roles()`; never trust role checks in the frontend.
- Public registration always creates role `USER`.

## Boundaries
- Ask before: adding dependencies, changing `schema.prisma`, deleting files, changing role rules.
- Never: commit `.env` or secrets, force-push, run `prisma migrate reset` on non-disposable data.
- Before finishing a task: run lint, tests, and build for the touched app.
