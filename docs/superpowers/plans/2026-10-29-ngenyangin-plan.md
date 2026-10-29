# Ngenyangin Web App Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the complete Ngenyangin web application with NestJS backend (JavaScript), MariaDB + Prisma, React + TailwindCSS frontend, email/password auth, user management, recipe management, and reviewer/admin moderation workflow.

**Architecture:** Monorepo structure with `backend/` (NestJS JS) and `frontend/` (React Vite TailwindCSS). Prisma connects to MariaDB. JWT-based authentication protects API endpoints and enforces Role-Based Access Control (USER, REVIEWER, ADMIN).

**Tech Stack:** NestJS (JavaScript), Prisma ORM, MariaDB, React, Vite, TailwindCSS, JWT.

**Spec:** docs/superpowers/specs/2026-10-29-ngenyangin-design.md

## Global Constraints
- Backend written in JavaScript (Node.js/NestJS without TypeScript compilation).
- MariaDB database accessed via Prisma ORM.
- Authentication via email/password using JWT.
- User management: roles (USER, REVIEWER, ADMIN), profile handling, and admin user controls.
- Recipe management: create, edit, delete, list public approved recipes, reviewer/admin moderation workflow (PENDING -> APPROVED/REJECTED).
- Git commit messages must strictly follow Conventional Commits format: `<type>(<scope>): <description>`.

## Review Focus
1. **Unauthorized Recipe Publication / Moderation Bypass:** Non-reviewers attempting to approve recipes must be rejected with 403 Forbidden.
2. **Unapproved Recipe Visibility:** Public recipe list API must filter strictly by `status === 'APPROVED'`.
3. **Invalid Credentials / Duplicate Email:** Signup with existing email or login with wrong password must return clear 400/401 error messages.
4. **Token Expiry / Invalid JWT:** Protected endpoints must reject expired or forged tokens with 401 Unauthorized.
5. **Input Validation:** Missing required recipe fields (title, ingredients, instructions) must be rejected with 400 Bad Request.

---

### Task 1: Project Scaffolding & Database Setup

**Files:**
- Create: `backend/package.json`, `backend/prisma/schema.prisma`, `backend/.env`
- Create: `frontend/package.json`, `frontend/vite.config.js`, `frontend/tailwind.config.js`
- Create: `AGENTS.md`

- [x] **Step 1: Initialize backend directory and Prisma schema**
Create `backend/prisma/schema.prisma` with User and Recipe models.
- [x] **Step 2: Initialize frontend directory with Vite, React, and TailwindCSS**
Setup frontend package.json, Tailwind config, and basic index.html/App.jsx.
- [x] **Step 3: Commit Task 1**
`git commit -m "feat(core): setup project scaffolding and database schema"`

---

### Task 2: Backend Auth & User Management Module

**Files:**
- Create: `backend/src/auth/auth.module.js`, `backend/src/auth/auth.controller.js`, `backend/src/auth/auth.service.js`, `backend/src/auth/jwt.strategy.js`, `backend/src/auth/roles.guard.js`
- Create: `backend/src/users/users.module.js`, `backend/src/users/users.controller.js`, `backend/src/users/users.service.js`

**Interfaces:**
- Produces: 
  - `POST /auth/register`
  - `POST /auth/login`
  - `GET /users/profile`
  - `GET /users` (Admin only: list users and manage roles)

- [ ] **Step 1: Implement Prisma service and User registration / login with JWT**
- [ ] **Step 2: Implement User Management endpoints (Profile, Role update for Admin)**
- [ ] **Step 3: Commit Task 2**
`git commit -m "feat(auth): implement authentication and user management module"`

---

### Task 3: Backend Recipe Management & Moderation Workflow

**Files:**
- Create: `backend/src/recipes/recipes.module.js`, `backend/src/recipes/recipes.controller.js`, `backend/src/recipes/recipes.service.js`

**Interfaces:**
- Produces:
  - `GET /recipes` (Public: returns only APPROVED recipes with search/category filter)
  - `GET /recipes/pending` (Reviewer/Admin only: returns PENDING recipes)
  - `POST /recipes` (Authenticated users: creates recipe with PENDING status)
  - `PATCH /recipes/:id` (Author/Admin: update recipe)
  - `DELETE /recipes/:id` (Author/Admin: delete recipe)
  - `PATCH /recipes/:id/moderate` (Reviewer/Admin only: updates status to APPROVED or REJECTED)

- [ ] **Step 1: Implement Recipe Service & Controller (CRUD + Public filter for APPROVED)**
- [ ] **Step 2: Implement Moderation endpoint (`/recipes/:id/moderate`)**
- [ ] **Step 3: Commit Task 3**
`git commit -m "feat(recipe): implement recipe management and moderation workflow"`

---

### Task 4: Frontend UI (React + TailwindCSS)

**Files:**
- Create: `frontend/src/App.jsx`, `frontend/src/components/Navbar.jsx`, `frontend/src/pages/Home.jsx`, `frontend/src/pages/Login.jsx`, `frontend/src/pages/Register.jsx`, `frontend/src/pages/AddRecipe.jsx`, `frontend/src/pages/Moderation.jsx`, `frontend/src/pages/UserManagement.jsx`

**Interfaces:**
- Consumes Backend REST API (`/auth/*`, `/users/*`, `/recipes/*`).

- [ ] **Step 1: Setup React Router, Context/State for Auth, Navbar, and Tailwind styling**
- [ ] **Step 2: Implement Public Recipe Catalog & Search view**
- [ ] **Step 3: Implement Add Recipe and My Recipes view for users**
- [ ] **Step 4: Implement Reviewer/Admin Moderation dashboard and User Management view**
- [ ] **Step 5: Commit Task 4**
`git commit -m "feat(frontend): implement react pages for catalog, auth, recipe submission, and moderation"`

---

### Task 5: End-to-End Verification

**Files:**
- Verify: Full app flow (register user -> post recipe -> login as reviewer/admin -> approve recipe -> view in public catalog).

- [ ] **Step 1: Run database migrations and seed default admin/reviewer**
- [ ] **Step 2: Start backend and frontend services, test all flows**
- [ ] **Step 3: Commit Task 5 and final verification**
`git commit -m "test(e2e): verify end-to-end user and recipe workflow"`
